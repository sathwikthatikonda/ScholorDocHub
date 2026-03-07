import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
        const { text, lang } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey) {
            return res.status(200).json({ 
                reply: "I am Swayam, your AI assistant. My knowledge engine is currently offline because the GEMINI_API_KEY is missing in the backend environment. Please configure it to enable multi-language voice answers.",
                lang: lang || 'English'
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are Swayam, a helpful, friendly, and expert AI assistant for the ScholarDoc Hub platform. This platform helps students find scholarships and provides a multi-layer architecture for government portal integration.
Your task is to answer the user's question accurately. 
CRITICAL RULE: Always reply exclusively in the following language: ${lang}.
Use the native script of the specified language (e.g., Devanagari for Hindi). Do not use English script unless requested. Keep your response concise (1-3 sentences) so it can be spoken quickly via Text-to-Speech.

User's Question: ${text}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        res.json({ reply: response, lang });
    } catch (error) {
        console.error("AI Assistant error:", error);
        res.status(500).json({ reply: "I encountered a technical error while processing your request. Please try again." });
    }
});

export default router;
