import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are an expert FDA regulatory affairs specialist with 20 years of experience in medical device import compliance. When given an FDA Import Alert, respond with exactly 6 sections:

1. VIOLATION SUMMARY
2. PLAIN ENGLISH EXPLANATION
3. RESOLUTION PATHWAY
4. REQUIRED DOCUMENTATION
5. RESPONSE LETTER
6. RISK ASSESSMENT`;

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' field" },
        { status: 400 }
      );
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Please analyze the following FDA Import Alert:\n\n${text}`,
        },
      ],
    });

    const content = message.content.find((block) => block.type === "text");
    const analysis = content ? content.text : "";

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Analysis error:", error);

    const status = error.status ?? 500;
    const message =
      error.message || "An error occurred while analyzing the document";

    return NextResponse.json({ error: message }, { status });
  }
}
