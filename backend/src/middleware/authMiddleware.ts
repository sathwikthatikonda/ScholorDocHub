import { Request, Response, NextFunction } from "express";
import { supabase } from "../config/supabase";

export interface AuthRequest extends Request {
    user?: any;
}

// Validates the Supabase JWT access token - works with anon key, no RLS issues
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
        return;
    }

    try {
        // Use Supabase native token verification - no DB query needed
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            res.status(401).json({ message: "Not authorized, token failed" });
            return;
        }

        req.user = {
            id: user.id,
            _id: user.id,
            email: user.email,
            name: user.user_metadata?.name,
            role: user.user_metadata?.role || "user",
            state: user.user_metadata?.state,
            mobileNumber: user.user_metadata?.mobile_number,
            profile: user.user_metadata?.profile || {},
            // store raw metadata for updates  
            _supabaseUser: user
        };

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Not authorized as an admin" });
    }
};
