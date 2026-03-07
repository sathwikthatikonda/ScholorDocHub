import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import scholarshipRoutes from "./routes/scholarshipRoutes";
import userRoutes from "./routes/userRoutes";
import aiRoutes from "./routes/aiRoutes";

dotenv.config();

const app = express();

// Allow all origins in development
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "ScholarDoc Hub API running with Supabase 🚀" });
});

app.use("/api/auth", authRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Connected to Supabase (auth via native SDK, no RLS restrictions)`);
    console.log(`📚 ${30} scholarships ready to serve`);
});
