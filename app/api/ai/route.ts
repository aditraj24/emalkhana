import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Initialize Model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite", // Note: gemini-2.0-flash is current best for speed
      systemInstruction: "You are a professional assistant for the Jharkhand Police e-Malkhana system. Help officers with legal queries and digital evidence management.",
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    if (!aiText) {
      return NextResponse.json({ error: "AI returned empty response" }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      reply: aiText 
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "AI generation failed", details: error.message },
      { status: 500 }
    );
  }
}