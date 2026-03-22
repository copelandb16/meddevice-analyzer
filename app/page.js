"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

function LogoIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function ArrowIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function DownloadIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
  );
}

export default function Home() {
  const [text, setText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    const content =
      typeof results === "string" ? results : results?.analysis || "";
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clearanceiq-report-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const darkText = "text-[#1e293b]";
  const reportComponents = {
    h1: ({ children }) => (
      <h1 className={`text-lg font-semibold ${darkText} mb-3`}>{children}</h1>
    ),
    h2: ({ children }) => (
      <div className="border-t border-slate-200 pt-6 mt-6 first:mt-0 first:pt-0 first:border-t-0">
        <h2 className={`text-base font-semibold ${darkText} mb-3`}>
          {children}
        </h2>
      </div>
    ),
    h3: ({ children }) => (
      <h3 className={`text-sm font-semibold ${darkText} mt-4 mb-2`}>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className={`text-sm font-semibold ${darkText} mt-3 mb-2`}>
        {children}
      </h4>
    ),
    p: ({ children }) => (
      <p className={`${darkText} leading-relaxed mb-4 last:mb-0`}>{children}</p>
    ),
    li: ({ children }) => (
      <li className={`${darkText} leading-relaxed mb-1`}>{children}</li>
    ),
    ul: ({ children }) => (
      <ul className={`list-disc pl-5 mb-4 space-y-1 ${darkText}`}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className={`list-decimal pl-5 mb-4 space-y-1 ${darkText}`}>
        {children}
      </ol>
    ),
    strong: ({ children }) => (
      <strong className={`font-semibold ${darkText}`}>{children}</strong>
    ),
    em: ({ children }) => (
      <em className={darkText}>{children}</em>
    ),
    blockquote: ({ children }) => (
      <blockquote className={`border-l-4 border-slate-200 pl-4 my-4 ${darkText}`}>
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className={`${darkText} bg-slate-100 px-1 py-0.5 rounded text-sm`}>
        {children}
      </code>
    ),
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="w-full bg-[#0f172a] px-8 py-6">
        <div className="mx-auto max-w-4xl flex items-center gap-3">
          <LogoIcon className="h-9 w-9 text-white flex-shrink-0" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              ClearanceIQ
            </h1>
            <p className="text-[#3b82f6] text-sm font-medium mt-0.5">
              FDA Import Alert Intelligence
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white py-16 px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Analyze FDA Import Alerts in 60 Seconds
            </h2>
            <p className="mt-5 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Get instant violation analysis, resolution pathways, and
              ready-to-submit response letters
            </p>
          </div>
        </section>

        {/* Input Section */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50">
              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}
              <label
                htmlFor="alert-input"
                className="mb-3 block text-sm font-semibold text-slate-700"
              >
                Paste your FDA Import Alert
              </label>
              <textarea
                id="alert-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the full text of the FDA Import Alert here..."
                className="mb-6 min-h-[200px] w-full resize-y rounded-lg border border-slate-300 bg-white px-4 py-3.5 text-slate-900 text-[15px] leading-relaxed placeholder:text-slate-400 focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/20"
                disabled={loading}
              />
              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3b82f6] px-6 py-4 text-base font-bold text-white shadow-sm transition-all hover:bg-[#2563eb] disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? (
                  "Analyzing…"
                ) : (
                  <>
                    Analyze Document
                    <ArrowIcon className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Results Section - Only show when results exist */}
        {results && (
          <section className="px-6 pb-20">
            <div className="mx-auto max-w-4xl">
              <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                  <p className="text-sm font-semibold text-slate-600">
                    Analysis Report
                  </p>
                  <button
                    onClick={handleDownloadReport}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-400"
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Download Report
                  </button>
                </div>
                <div className="px-6 py-8">
                  <div className="prose prose-slate max-w-none text-[#1e293b] [&_h1]:text-[#1e293b] [&_h2]:text-[#1e293b] [&_h3]:text-[#1e293b] [&_h4]:text-[#1e293b] [&_p]:text-[#1e293b] [&_li]:text-[#1e293b] [&_strong]:text-[#1e293b] [&_em]:text-[#1e293b] [&_a]:text-[#1e293b] [&_span]:text-[#1e293b]">
                    <ReactMarkdown components={reportComponents}>
                      {typeof results === "string"
                        ? results
                        : results.analysis}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0f172a] py-8">
        <p className="text-center text-sm text-white">
          ClearanceIQ © 2025 — FDA Import Alert Intelligence
        </p>
      </footer>
    </div>
  );
}
