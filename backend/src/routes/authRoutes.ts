import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase";

const router = express.Router();

// Register using Supabase native auth - works with anon key, no RLS issues
router.post("/register", async (req: Request, res: Response) => {
    const { name, email, password, mobileNumber, state } = req.body;

    if (!name || !email || !password || !mobileNumber || !state) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    mobile_number: mobileNumber,
                    state,
                    role: "user",
                    profile: {}
                }
            }
        });

        if (error) {
            console.error("Supabase signup error:", error);
            res.status(400).json({ message: error.message });
            return;
        }

        if (!data.user) {
            res.status(400).json({ message: "Failed to create user" });
            return;
        }

        // If email confirmation is enabled in Supabase, session will be null
        // In that case, we signal the frontend to redirect to login
        const token = data.session?.access_token || "";
        const requiresEmailConfirmation = !data.session;

        res.status(201).json({
            _id: data.user.id,
            name: data.user.user_metadata?.name,
            email: data.user.email,
            role: data.user.user_metadata?.role || "user",
            state: data.user.user_metadata?.state,
            mobileNumber: data.user.user_metadata?.mobile_number,
            profile: data.user.user_metadata?.profile || {},
            token,
            requiresEmailConfirmation
        });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login using Supabase native auth
router.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error || !data.user || !data.session) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }

        res.json({
            _id: data.user.id,
            name: data.user.user_metadata?.name,
            email: data.user.email,
            role: data.user.user_metadata?.role || "user",
            state: data.user.user_metadata?.state,
            mobileNumber: data.user.user_metadata?.mobile_number,
            profile: data.user.user_metadata?.profile || {},
            token: data.session.access_token
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
