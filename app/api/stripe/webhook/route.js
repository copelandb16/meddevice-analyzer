import Stripe from "stripe";
import { NextResponse } from "next/server";
import {
  activateByStripeCustomerEmail,
  activateSubscription,
  updateSubscriptionStatus,
} from "@/lib/subscription";

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  return new Stripe(secretKey);
}

function mapStripeSubscriptionStatus(stripeStatus) {
  if (stripeStatus === "active" || stripeStatus === "trialing") return "active";
  if (stripeStatus === "past_due" || stripeStatus === "unpaid") return "past_due";
  return "canceled";
}

async function handleCheckoutCompleted(session) {
  const clerkUserId =
    session.metadata?.clerk_user_id ?? session.client_reference_id ?? null;
  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;
  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;
  const email =
    session.customer_details?.email ?? session.customer_email ?? null;

  if (clerkUserId) {
    await activateSubscription({
      clerkUserId,
      stripeCustomerId: customerId ?? null,
      stripeSubscriptionId: subscriptionId ?? null,
      email,
    });
    return;
  }

  if (email) {
    const matched = await activateByStripeCustomerEmail(email, {
      customerId: customerId ?? null,
      subscriptionId: subscriptionId ?? null,
    });
    if (!matched) {
      console.warn(
        "Stripe checkout completed but no Clerk user matched for email:",
        email
      );
    }
  }
}

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET is not configured." },
      { status: 500 }
    );
  }

  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  const body = await request.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error.message);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        await updateSubscriptionStatus(
          subscription.id,
          mapStripeSubscriptionStatus(subscription.status)
        );
        break;
      }
      default:
        break;
    }
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
