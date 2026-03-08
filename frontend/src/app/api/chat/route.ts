import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are a helpful and versatile assistant for 'ScholarDoc Hub'.
Your primary goal is to help users with their questions.
1. YOU MUST ANSWER ONLY IN ENGLISH. If the user speaks another language, politely ask them to speak in English.
2. You can answer ANY question the user asks, whether it's related to the website, general knowledge, coding, or anything else.
3. Keep your answers clear and professional. Use formatting like bullet points if it helps readability.`;

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY || "";
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is not set.");
            // Fallback for demo purposes if no key
            return NextResponse.json({ reply: "I am currently running in offline mode. Please configure the GEMINI_API_KEY environment variable to enable AI responses." });
        }

        const { message } = await req.json();
        if (!message) {
            return NextResponse.json({ reply: "Please provide a message." }, { status: 400 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT });

        const result = await model.generateContent(message);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ reply: "Sorry, I am having trouble answering that right now. Please try again later." }, { status: 500 });
    }
}
