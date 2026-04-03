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

        let allData: any[] = [];
        let from = 0;
        const PAGE_LIMIT = 1000;
        let hasMore = true;
        let fetchError: any = null;

        while (hasMore) {
            let query = supabase.from("scholarships").select("*").order("name", { ascending: true }).range(from, from + PAGE_LIMIT - 1);

            if (ids) {
                const idList = (ids as string).split(",");
                query = query.in("id", idList);
            }

            if (state && state !== "All India") {
                query = query.or(`state.eq.${state},state.eq.All India`);
            }

            if (incomeLimit) {
                const income = Number(incomeLimit);
                query = query.or(`income_limit.eq.0,income_limit.gte.${income}`);
            }

            if (marksPercentage) {
                const marks = Number(marksPercentage);
                query = query.or(`marks_requirement.eq.0,marks_requirement.lte.${marks}`);
            }

            if (minorityStatus === "false") {
                query = query.eq("minority_status", false);
            }

            if (disabilityStatus === "false") {
                query = query.eq("disability_status", false);
            }

            const { data: chunk, error: chunkError } = await query;
            
            if (chunkError) {
                console.error("❌ Supabase chunk fetch error:", chunkError);
                fetchError = chunkError;
                break;
            }

            if (chunk && chunk.length > 0) {
                allData = allData.concat(chunk);
                if (chunk.length < PAGE_LIMIT) {
                    hasMore = false;
                } else {
                    from += PAGE_LIMIT;
                }
            } else {
                hasMore = false;
            }
        }

        const data = allData;
        const error = fetchError;

        if (error) {
            console.error("Supabase query error:", error);
            throw error;
        }

        console.log(`[DEBUG] Found ${data?.length || 0} scholarships in DB matching query`);
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
