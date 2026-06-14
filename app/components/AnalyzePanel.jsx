"use client";

import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useState } from "react";

const FALLBACK_STRIPE_LINK =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ||
  "https://buy.stripe.com/7sY8wP15c3upfLm9bXaEE00";
const FREE_USED_KEY = "alertiq_free_used";

function PaywallModal({ onClose, onSubscribe, subscribing }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-xl">
        <h2 className="text-xl font-bold text-neutral-950">
          Your first analysis was free
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
          Subscribe for $99.99/month for unlimited analyses
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onSubscribe}
            disabled={subscribing}
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-green-600 text-[15px] font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {subscribing ? "Redirecting…" : "Subscribe Now"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-[13px] text-neutral-500 underline underline-offset-4 hover:text-neutral-700"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AnalyzePanel() {
  const { isSignedIn } = useAuth();
  const [documentText, setDocumentText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [hasUsedFree, setHasUsedFree] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const refreshAccess = useCallback(async () => {
    try {
      const res = await fetch("/api/subscription");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return;

      if (data.signedIn) {
        setIsSubscribed(data.status === "active");
        setHasUsedFree(Boolean(data.freeAnalysisUsed));
        return;
      }

      const usedLocally = localStorage.getItem(FREE_USED_KEY) === "true";
      setHasUsedFree(usedLocally);
      setIsSubscribed(false);
    } catch {
      const usedLocally = localStorage.getItem(FREE_USED_KEY) === "true";
      setHasUsedFree(usedLocally);
    }
  }, []);

  useEffect(() => {
    refreshAccess();
  }, [refreshAccess, isSignedIn]);

  const startCheckout = useCallback(async () => {
    setSubscribing(true);
    try {
      if (!isSignedIn) {
        window.location.href = "/sign-in?redirect_url=" + encodeURIComponent("/#analyze");
        return;
      }

      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }

      window.location.href = FALLBACK_STRIPE_LINK;
    } catch {
      window.location.href = FALLBACK_STRIPE_LINK;
    } finally {
      setSubscribing(false);
    }
  }, [isSignedIn]);

  const downloadPdf = useCallback(async () => {
    if (!analysis.trim()) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - 2 * margin;
    const lineHeight = 5.5;
    let y = margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("AlertIQ - Compliance analysis", margin, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Generated " + new Date().toLocaleString(), margin, y);
    y += 8;
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(analysis.trim(), maxWidth);
    for (let i = 0; i < lines.length; i += 1) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines[i], margin, y);
      y += lineHeight;
    }
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    doc.save("alertiq-report-" + stamp + ".pdf");
  }, [analysis]);

  function shouldBlockAnalysis() {
    if (isSubscribed) return false;
    return hasUsedFree;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (shouldBlockAnalysis()) {
      setShowPaywall(true);
      return;
    }

    const text = documentText.trim();
    if (!text) {
      setError("Paste alert text above to run an analysis.");
      return;
    }

    setLoading(true);
    setAnalysis("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.status === 402 || data.code === "SUBSCRIPTION_REQUIRED") {
        setHasUsedFree(true);
        setShowPaywall(true);
        return;
      }

      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Analysis failed.");
        return;
      }

      if (typeof data.analysis !== "string") {
        setError("Unexpected response from the analyzer.");
        return;
      }

      setAnalysis(data.analysis);

      if (!isSubscribed) {
        if (!isSignedIn) {
          localStorage.setItem(FREE_USED_KEY, "true");
        }
        setHasUsedFree(true);
        setTimeout(() => setShowPaywall(true), 3000);
      }

      await refreshAccess();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  const blocked = shouldBlockAnalysis();

  return (
    <>
      {showPaywall ? (
        <PaywallModal
          onClose={() => setShowPaywall(false)}
          onSubscribe={startCheckout}
          subscribing={subscribing}
        />
      ) : null}
      <section
        id="analyze"
        className="scroll-mt-6 bg-white pb-24 pt-20 lg:pb-28 lg:pt-24"
        aria-labelledby="analyze-heading"
      >
        <div className="mx-auto max-w-2xl px-6">
          <h2 id="analyze-heading" className="sr-only">
            Analyze alert
          </h2>
          <div className="rounded-lg border border-neutral-200 bg-white p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <label htmlFor="compliance-document" className="sr-only">
                Alert text to analyze
              </label>
              <textarea
                id="compliance-document"
                value={documentText}
                onChange={(event) => setDocumentText(event.target.value)}
                rows={10}
                placeholder="Paste your FDA Import Alert text here..."
                className="w-full resize-y rounded-md border border-neutral-200 bg-white px-3 py-3 text-[15px] leading-relaxed text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-900"
              />
              {error ? (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center rounded-md bg-blue-600 text-[15px] font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Analyzing..."
                  : blocked
                    ? "Subscribe to Analyze"
                    : "Analyze an Alert"}
              </button>
              <p className="text-center text-sm text-neutral-500">
                {isSubscribed
                  ? "Unlimited analyses included with your subscription."
                  : blocked
                    ? "Subscribe for $99.99/month for unlimited analyses."
                    : "No signup required for your first analysis."}
              </p>
            </form>
          </div>
          {analysis ? (
            <article className="mt-12 border-t border-neutral-100 pt-12">
              <div className="flex flex-row flex-wrap items-baseline justify-between gap-3 border-b border-neutral-100 pb-4">
                <h3 className="text-[15px] font-semibold text-neutral-950">
                  Report
                </h3>
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="text-[13px] font-medium text-blue-600 underline underline-offset-4 hover:text-blue-700"
                >
                  Download PDF
                </button>
              </div>
              <div className="mt-6 whitespace-pre-wrap text-[14px] leading-7 text-neutral-700">
                {analysis}
              </div>
            </article>
          ) : null}
        </div>
      </section>
    </>
  );
}
