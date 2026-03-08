import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
    try {
        const { text, lang } = await req.json();
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                reply: "I am Swayam, your AI assistant. My knowledge engine is currently offline because the GEMINI_API_KEY is missing. Please configure it in Vercel environment variables to enable multi-language voice answers.",
                lang: lang || 'English'
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `You are Swayam, a helpful, friendly, and expert AI assistant for the ScholarDoc Hub platform. This platform helps students find scholarships and provides a multi-layer architecture for government portal integration.
Your task is to answer the user's question accurately. 
CRITICAL RULE: Always reply exclusively in the following language: ${lang}.
Use the native script of the specified language (e.g., Devanagari for Hindi). Do not use English script unless requested. Keep your response concise (1-3 sentences) so it can be spoken quickly via Text-to-Speech.

User's Question: ${text}`;

        const result = await model.generateContent(prompt);
        const response = result.response.text();

        return NextResponse.json({ reply: response, lang });
    } catch (error) {
        console.error('AI Assistant error:', error);
        return NextResponse.json(
            { reply: 'I encountered a technical error while processing your request. Please try again.' },
            { status: 500 }
        );
    }
}
