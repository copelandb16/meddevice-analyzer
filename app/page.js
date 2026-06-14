import AnalyzePanel from "./components/AnalyzePanel";
import Reveal from "./components/Reveal";

function IconPaste(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M15 11h-5" />
      <path d="M15 15h-5" />
    </svg>
  );
}

function IconAnalyze(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  );
}

function IconReport(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h8" />
      <path d="M8 9h4" />
    </svg>
  );
}

const steps = [
  {
    Icon: IconPaste,
    title: "Step 1: Paste Your Alert",
    body: "Drop in the citation, DWPE excerpt, or full alert text—nothing to install.",
  },
  {
    Icon: IconAnalyze,
    title: "Step 2: Click Analyze",
    body: "AlertIQ parses the breach, citations, and next actions in one pass.",
  },
  {
    Icon: IconReport,
    title: "Step 3: Get Your Report",
    body: "Structured summary, resolution steps, drafting support, export as PDF.",
  },
];

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-neutral-100 bg-white">
        <div
          aria-hidden
          className="hero-mesh pointer-events-none absolute inset-0 -z-10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-[#7c6ff0]/30 to-transparent"
        />
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-24 lg:pb-28 lg:pt-28">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#7c6ff0]/25 bg-[#7c6ff0]/[0.06] px-3 py-1 text-[12px] font-medium tracking-wide text-[#5b4fd0]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7c6ff0]" />
              FDA Import Alert Intelligence
            </span>
          </Reveal>
          <Reveal
            as="h1"
            delay={60}
            className="mt-6 max-w-3xl text-4xl font-bold tracking-[-0.02em] text-neutral-950 sm:text-5xl sm:leading-[1.05] lg:text-[3.5rem]"
          >
            Analyze Any FDA Import Alert &amp; Draft Your Response Letter in 60
            Seconds
          </Reveal>
          <Reveal
            as="p"
            delay={120}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600"
          >
            FDA Import Alert Intelligence for Importers, Brokers &amp; Compliance
            Teams
          </Reveal>
          <Reveal delay={180} className="mt-5 max-w-2xl">
            <p className="text-lg font-medium text-neutral-900">
              First analysis is 100% free. No credit card required.
            </p>
          </Reveal>
          <Reveal delay={240} className="mt-10">
            <a
              href="#analyze"
              className="btn-purple inline-flex h-11 items-center justify-center rounded-lg px-6 text-[15px] font-semibold text-white"
            >
              Analyze an Alert
            </a>
          </Reveal>
        </div>

        {/* Thin social-proof / trust bar */}
        <div className="border-t border-neutral-100 bg-white/60 backdrop-blur-sm">
          <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-3.5">
            <span className="flex -space-x-1.5" aria-hidden>
              <span className="h-2 w-2 rounded-full bg-[#7c6ff0]" />
              <span className="h-2 w-2 rounded-full bg-[#8b7ff5]" />
              <span className="h-2 w-2 rounded-full bg-[#a78bfa]" />
            </span>
            <p className="text-[13px] leading-relaxed text-neutral-500">
              Used by U.S. customs brokers processing food, pharma, and cosmetics
              imports.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-100 bg-gradient-to-b from-neutral-50/80 to-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <h2 className="sr-only">How it works</h2>
          <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
            {steps.map(({ Icon, title, body }, i) => (
              <Reveal
                key={title}
                delay={i * 120}
                className="group rounded-2xl border border-neutral-200/80 bg-white p-7 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(16,24,40,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#7c6ff0]/30 hover:shadow-[0_2px_4px_rgba(16,24,40,0.05),0_18px_40px_-16px_rgba(124,111,240,0.4)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#7c6ff0]/20 bg-[#7c6ff0]/[0.08] text-[#6d5ee8] transition-colors duration-300 group-hover:bg-[#7c6ff0]/[0.14]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-[15px] font-semibold text-neutral-950">
                  {title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
                  {body}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <AnalyzePanel />
    </>
  );
}
