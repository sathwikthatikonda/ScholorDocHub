import express, { Response } from "express";
import { protect, admin, AuthRequest } from "../middleware/authMiddleware";
import { supabase } from "../config/supabase";

const router = express.Router();

// All scholarships hardcoded — no DB needed, no RLS issues, instant response
// Data now fetched from Supabase database

// GET /api/scholarships - Filter and return matching scholarships from DB
router.get("/", async (req: express.Request, res: express.Response) => {
    try {
        const { educationLevel, category, incomeLimit, state, marksPercentage, minorityStatus, disabilityStatus, ids } = req.query;
        console.log("🔍 Received Query Params:", { educationLevel, category, incomeLimit, state, marksPercentage, minorityStatus, disabilityStatus, ids });

        let limit = 1000; // Fetch top 1000 for verification
        let { data, error: fetchError } = await supabase
            .from("scholarships")
            .select("*")
            .limit(limit);

        if (fetchError) {
            console.error("❌ Supabase fetch error:", fetchError);
            throw fetchError;
        }

        console.log(`[DEBUG] Found ${data?.length || 0} scholarships in DB (Total Cache)`);
        let filtered = data || [];

        // Helper to ensure array and handle nulls
        const ensureArray = (val: any) => {
            if (!val) return ["All"];
            if (Array.isArray(val)) return val.length > 0 ? val : ["All"];
            return [val];
        };

        // Manual filtering for arrays since basic Supabase .in() might not work as expected for "All" logic
        if (educationLevel) {
            filtered = filtered.filter(s => {
                const levels = ensureArray(s.education_level);
                return levels.includes(educationLevel as string) || levels.includes("All");
            });
        }

        if (category) {
            filtered = filtered.filter(s => {
                const cats = ensureArray(s.category);
                return cats.includes(category as string) || cats.includes("All") || (category === "General" && cats.includes("General"));
            });
        }

        // Map snake_case to camelCase for frontend compatibility
        const mapped = filtered.map(s => ({
            _id: s.id,
            id: s.id,
            name: s.name,
            provider: s.provider,
            eligibilityCriteria: s.eligibility_criteria,
            educationLevel: ensureArray(s.education_level),
            category: ensureArray(s.category),
            incomeLimit: s.income_limit || 0,
            marksRequirement: s.marks_requirement || 0,
            state: s.state || "All India",
            description: s.description,
            benefits: s.benefits,
            deadline: s.deadline,
            requiredDocuments: s.required_documents || [],
            officialWebsite: s.official_website,
            minorityStatus: !!s.minority_status,
            disabilityStatus: !!s.disability_status
        }));

        res.json(mapped);
    } catch (error) {
        console.error("Get scholarships error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/scholarships/:id - Get single scholarship from DB
router.get("/:id", async (req: express.Request, res: express.Response) => {
    try {
        const { data: s, error } = await supabase
            .from("scholarships")
            .select("*")
            .eq("id", req.params.id)
            .maybeSingle();

        if (error) throw error;
        if (!s) return res.status(404).json({ message: "Scholarship not found" });

        const mapped = {
            _id: s.id,
            id: s.id,
            name: s.name,
            provider: s.provider,
            eligibilityCriteria: s.eligibility_criteria,
            educationLevel: s.education_level,
            category: s.category,
            incomeLimit: s.income_limit,
            marksRequirement: s.marks_requirement,
            state: s.state,
            description: s.description,
            benefits: s.benefits,
            deadline: s.deadline,
            requiredDocuments: s.required_documents,
            officialWebsite: s.official_website,
            minorityStatus: s.minority_status,
            disabilityStatus: s.disability_status
        };

        res.json(mapped);
    } catch (error) {
        console.error("Get scholarship by ID error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// POST /api/scholarships - Create (admin only) - not needed for now as data is hardcoded
router.post("/", protect, admin, async (req: AuthRequest, res: Response) => {
    res.status(501).json({ message: "Scholarship creation via API is not supported in this version" });
});

export default router;
