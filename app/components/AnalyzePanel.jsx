"use client";

import { useCallback, useState } from "react";

export default function AnalyzePanel() {
  const [documentText, setDocumentText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const downloadPdf = useCallback(async () => {
    if (!analysis.trim()) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - 2 * margin;
    const lineHeight = 5.5;

    let y = margin;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("AlertIQ — Compliance analysis", margin, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated ${new Date().toLocaleString()}`, margin, y);
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
    doc.save(`alertiq-report-${stamp}.pdf`);
  }, [analysis]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
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
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Analysis failed.");
        return;
      }
      if (typeof data.analysis !== "string") {
        setError("Unexpected response from the analyzer.");
        return;
      }
      setAnalysis(data.analysis);
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
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
              {loading ? "Analyzing…" : "Analyze an Alert"}
            </button>
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
  );
}
