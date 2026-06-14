import { createAdminClient } from "@/lib/supabase/admin";

export function canUserAnalyze(subscription) {
  if (!subscription) return true;
  if (subscription.status === "active") return true;
  return !subscription.free_analysis_used;
}

export async function getSubscription(clerkUserId) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load subscription: ${error.message}`);
  }

  return data;
}

export async function getOrCreateSubscription(clerkUserId, email) {
  const existing = await getSubscription(clerkUserId);
  if (existing) return existing;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      clerk_user_id: clerkUserId,
      email: email ?? null,
      status: "free",
      free_analysis_used: false,
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create subscription record: ${error.message}`);
  }

  return data;
}

export async function markFreeAnalysisUsed(clerkUserId) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("subscriptions")
    .update({
      free_analysis_used: true,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_user_id", clerkUserId)
    .neq("status", "active");

  if (error) {
    throw new Error(`Failed to update free analysis flag: ${error.message}`);
  }
}

export async function activateSubscription({
  clerkUserId,
  stripeCustomerId,
  stripeSubscriptionId,
  email,
}) {
  const supabase = createAdminClient();
  const { error } = await supabase.from("subscriptions").upsert(
    {
      clerk_user_id: clerkUserId,
      email: email ?? null,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      status: "active",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "clerk_user_id" }
  );

  if (error) {
    throw new Error(`Failed to activate subscription: ${error.message}`);
  }
}

export async function updateSubscriptionStatus(stripeSubscriptionId, status) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", stripeSubscriptionId);

  if (error) {
    throw new Error(`Failed to update subscription status: ${error.message}`);
  }
}

export async function activateByStripeCustomerEmail(email, stripeIds) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("clerk_user_id")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to find user by email: ${error.message}`);
  }

  if (!data?.clerk_user_id) {
    return false;
  }

  await activateSubscription({
    clerkUserId: data.clerk_user_id,
    stripeCustomerId: stripeIds.customerId,
    stripeSubscriptionId: stripeIds.subscriptionId,
    email,
  });

  return true;
}
