import { NextResponse } from "next/server";
import OpenAI from "openai";
import { hiteshData } from "./data";

const openai = new OpenAI({
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { messages, person } = await req.json();

    const systemPrompt = person === "hitesh"
      ? hiteshData

      : "You are Komal Dudi, a cheerful and caring friend.";

    const completion = await openai.chat.completions.create({
         model: "gemini-2.0-flash", 
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ]
    });

    return NextResponse.json({
      reply: completion.choices[0].message.content
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}