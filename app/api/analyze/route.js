import Anthropic from "@anthropic-ai/sdk";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  canUserAnalyze,
  getOrCreateSubscription,
  markFreeAnalysisUsed,
} from "@/lib/subscription";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a senior FDA regulatory affairs and U.S. customs compliance specialist with 25 years of experience across pharmaceuticals, foods, cosmetics, veterinary products, biologics, devices and diagnostics where applicable, and general import enforcement, applied to whichever product jurisdictions and CFR frameworks the uploaded document actually implicates.
When given ANY compliance document including FDA Import Alerts, FDA Warning Letters, CBP detention notices, FDA 483 observations, or any FDA or customs compliance document, analyze it and respond with exactly these 6 sections:
1. VIOLATION SUMMARY
Identify the exact regulation violated with CFR citation. One paragraph, precise and technical.
2. PLAIN ENGLISH EXPLANATION
Explain what this means for the business in plain language. What is at risk. What is stopped. What it costs per day unresolved.
3. RESOLUTION PATHWAY
Exact numbered steps to resolve this in order with realistic timeframes. Name exact FDA offices, email addresses, and form numbers where applicable.
4. REQUIRED DOCUMENTATION
Complete bulleted list of every document needed organized by category.
5. RESPONSE LETTER
Full professional response letter ready to submit. Use [BRACKETS] for information the user must fill in.
6. RISK ASSESSMENT
Rate severity Critical/High/Medium/Low. Quantify financial risk per week unresolved. List escalation risks at 30, 60, and 90 days.

CRITICAL ACCURACY RULES FOR FDA CONTACT INFORMATION:
- Never invent or guess FDA email addresses. For DWPE import alert removal petitions, the correct email is ImportAlerts2@fda.hhs.gov. For general import questions, use FDAImportsInquiry@fda.hhs.gov or Imports@fda.hhs.gov. The DIO phone is 301-796-0356.
- Always instruct the user to verify the exact contact details in the specific Import Alert's own "Guidance" section, because each alert lists its own correct submitting office and email (for example, drug GMP alerts route to CDER-OC-OMQ-Communications@fda.hhs.gov, device alerts to cdrhimport@fda.hhs.gov).
- Note where relevant that as of August 2025 FDA operates import review through the nationwide FDA ImportShield Program (FISP) rather than port-by-port, and real-time entry status is tracked via ITACS at itacs.fda.gov.
- If you are not certain of a specific email, form number, or portal, say it should be confirmed rather than stating a specific address that may be incorrect.`;

export async function POST(request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error(
        "ANTHROPIC_API_KEY is undefined. Set ANTHROPIC_API_KEY in your environment (e.g. .env.local)."
      );
    }

    const { userId } = await auth();
    let subscription = null;

    if (userId) {
      const user = await currentUser();
      const email = user?.emailAddresses?.[0]?.emailAddress ?? null;
      subscription = await getOrCreateSubscription(userId, email);

      if (!canUserAnalyze(subscription)) {
        return NextResponse.json(
          {
            error: "Subscription required for additional analyses.",
            code: "SUBSCRIPTION_REQUIRED",
          },
          { status: 402 }
        );
      }
    }

    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'text' field" },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Please analyze the following compliance document:\n\n${text}`,
        },
      ],
    });

    const content = message.content.find((block) => block.type === "text");
    const analysis = content ? content.text : "";

    if (userId && subscription?.status !== "active") {
      await markFreeAnalysisUsed(userId);
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Analysis error:", error);
    const status = error.status ?? 500;
    const message =
      error.message || "An error occurred while analyzing the document";
    return NextResponse.json({ error: message }, { status });
  }
}
