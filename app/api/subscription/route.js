import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  canUserAnalyze,
  getOrCreateSubscription,
} from "@/lib/subscription";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({
        signedIn: false,
        status: "anonymous",
        freeAnalysisUsed: false,
        canAnalyze: true,
      });
    }

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress ?? null;
    const subscription = await getOrCreateSubscription(userId, email);

    return NextResponse.json({
      signedIn: true,
      status: subscription.status,
      freeAnalysisUsed: subscription.free_analysis_used,
      canAnalyze: canUserAnalyze(subscription),
    });
  } catch (error) {
    console.error("Subscription status error:", error);
    return NextResponse.json(
      { error: error.message || "Could not load subscription status." },
      { status: 500 }
    );
  }
}
