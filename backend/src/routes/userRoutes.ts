import express, { Response } from "express";
import { protect, AuthRequest } from "../middleware/authMiddleware";
import { supabase } from "../config/supabase";

const router = express.Router();

// Get user profile - reads from Supabase auth user_metadata (no RLS issues)
router.get("/profile", protect, async (req: AuthRequest, res: Response) => {
    try {
        // User data is already in req.user from protect middleware
        res.json({
            _id: req.user.id,
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            state: req.user.state,
            mobileNumber: req.user.mobileNumber,
            profile: req.user.profile,
            savedScholarships: req.user._supabaseUser?.user_metadata?.saved_scholarships || [],
            appliedScholarships: req.user._supabaseUser?.user_metadata?.applied_scholarships || []
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Update user profile/eligibility data - saves into Supabase user_metadata
router.put("/profile", protect, async (req: AuthRequest, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Not authorized" });

        const { createClient } = await import("@supabase/supabase-js");
        const userSupabase = createClient(
            process.env.SUPABASE_URL || "",
            process.env.SUPABASE_ANON_KEY || "",
            { auth: { persistSession: false } }
        );

        // Explicitly set the session so the SDK 'knows' it is authenticated
        const { error: sessionError } = await userSupabase.auth.setSession({
            access_token: token,
            refresh_token: token // Workaround: using access_token as refresh_token for Node.js requests
        });

        if (sessionError) {
            console.error("Session set error:", sessionError);
            return res.status(401).json({ message: "Invalid session" });
        }

        const currentProfile = req.user.profile || {};
        const updatedProfile = { ...currentProfile, ...req.body.profile };

        const { data, error } = await userSupabase.auth.updateUser({
            data: {
                ...req.user._supabaseUser?.user_metadata,
                profile: updatedProfile
            }
        });

        if (error) {
            console.error("Update user metadata error:", error);
            return res.status(500).json({ message: error.message || "Failed to update profile" });
        }

        res.json({
            _id: data.user?.id,
            name: data.user?.user_metadata?.name,
            email: data.user?.email,
            role: data.user?.user_metadata?.role || "user",
            state: data.user?.user_metadata?.state,
            profile: data.user?.user_metadata?.profile || {}
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Save a scholarship ID to user's saved list (stored in user_metadata)
router.post("/save-scholarship/:id", protect, async (req: AuthRequest, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Not authorized" });

        const { createClient } = await import("@supabase/supabase-js");
        const userSupabase = createClient(
            process.env.SUPABASE_URL || "",
            process.env.SUPABASE_ANON_KEY || "",
            { auth: { persistSession: false } }
        );

        await userSupabase.auth.setSession({
            access_token: token,
            refresh_token: token
        });

        const currentSaved: string[] = req.user._supabaseUser?.user_metadata?.saved_scholarships || [];
        const scholarshipId = String(req.params.id);
        if (!currentSaved.includes(scholarshipId)) {
            currentSaved.push(scholarshipId);
        }

        const { data, error } = await userSupabase.auth.updateUser({
            data: {
                ...req.user._supabaseUser?.user_metadata,
                saved_scholarships: currentSaved
            }
        });

        if (error) return res.status(500).json({ message: "Failed to save scholarship" });
        res.json({ savedScholarships: data.user?.user_metadata?.saved_scholarships });
    } catch (error) {
        console.error("Save scholarship error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Remove a saved scholarship
router.delete("/save-scholarship/:id", protect, async (req: AuthRequest, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Not authorized" });

        const { createClient } = await import("@supabase/supabase-js");
        const userSupabase = createClient(
            process.env.SUPABASE_URL || "",
            process.env.SUPABASE_ANON_KEY || "",
            { auth: { persistSession: false } }
        );

        await userSupabase.auth.setSession({
            access_token: token,
            refresh_token: token
        });

        let currentSaved: string[] = req.user._supabaseUser?.user_metadata?.saved_scholarships || [];
        const removeId = String(req.params.id);
        currentSaved = currentSaved.filter((id: string) => id !== removeId);

        const { data, error } = await userSupabase.auth.updateUser({
            data: {
                ...req.user._supabaseUser?.user_metadata,
                saved_scholarships: currentSaved
            }
        });

        if (error) return res.status(500).json({ message: "Failed to remove scholarship" });
        res.json({ savedScholarships: data.user?.user_metadata?.saved_scholarships });
    } catch (error) {
        console.error("Remove scholarship error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Mark a scholarship as applied (stored in user_metadata)
router.post("/apply-scholarship/:id", protect, async (req: AuthRequest, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Not authorized" });

        const { createClient } = await import("@supabase/supabase-js");
        const userSupabase = createClient(
            process.env.SUPABASE_URL || "",
            process.env.SUPABASE_ANON_KEY || "",
            { auth: { persistSession: false } }
        );

        await userSupabase.auth.setSession({
            access_token: token,
            refresh_token: token
        });

        const currentApplied: string[] = req.user._supabaseUser?.user_metadata?.applied_scholarships || [];
        const scholarshipId = String(req.params.id);
        if (!currentApplied.includes(scholarshipId)) {
            currentApplied.push(scholarshipId);
        }

        const { data, error } = await userSupabase.auth.updateUser({
            data: {
                ...req.user._supabaseUser?.user_metadata,
                applied_scholarships: currentApplied
            }
        });

        if (error) return res.status(500).json({ message: "Failed to mark as applied" });
        res.json({ appliedScholarships: data.user?.user_metadata?.applied_scholarships });
    } catch (error) {
        console.error("Apply scholarship error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Remove an applied scholarship
router.delete("/apply-scholarship/:id", protect, async (req: AuthRequest, res: Response) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Not authorized" });

        const { createClient } = await import("@supabase/supabase-js");
        const userSupabase = createClient(
            process.env.SUPABASE_URL || "",
            process.env.SUPABASE_ANON_KEY || "",
            { auth: { persistSession: false } }
        );

        await userSupabase.auth.setSession({
            access_token: token,
            refresh_token: token
        });

        let currentApplied: string[] = req.user._supabaseUser?.user_metadata?.applied_scholarships || [];
        const removeId = String(req.params.id);
        currentApplied = currentApplied.filter((id: string) => id !== removeId);

        const { data, error } = await userSupabase.auth.updateUser({
            data: {
                ...req.user._supabaseUser?.user_metadata,
                applied_scholarships: currentApplied
            }
        });

        if (error) return res.status(500).json({ message: "Failed to remove applied scholarship" });
        res.json({ appliedScholarships: data.user?.user_metadata?.applied_scholarships });
    } catch (error) {
        console.error("Remove applied scholarship error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
