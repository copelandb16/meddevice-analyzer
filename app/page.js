import AnalyzePanel from "./components/AnalyzePanel";

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
      <path d="M12 2v4" />
      <path d="M12 18v4" />
      <path d="M4.93 4.93l2.83 2.83" />
      <path d="M16.24 16.24l2.83 2.83" />
      <path d="M2 12h4" />
      <path d="M18 12h4" />
      <path d="M4.93 19.07l2.83-2.83" />
      <path d="M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="4" />
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

export default function Home() {
  return (
    <>
      <section className="border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 lg:pb-28 lg:pt-24">
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl sm:leading-[1.1] lg:text-[3.25rem]">
          Analyze Any FDA Import Alert & Draft Your Response Letter in 60 Seconds
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
            FDA Import Alert Intelligence for Importers, Brokers & Compliance Teams
          </p>
          <div className="mt-5 max-w-2xl">
            <p className="text-lg font-medium text-neutral-900">
              First analysis is 100% free. No credit card required.
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Used by U.S. customs brokers processing food, pharma, and cosmetics imports.
            </p>
          </div>
          <div className="mt-10">
            <a
              href="#analyze"
              className="inline-flex h-11 items-center justify-center rounded-md bg-blue-600 px-5 text-[15px] font-medium text-white hover:bg-blue-700"
            >
              Analyze an Alert
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-neutral-100 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <h2 className="sr-only">How it works</h2>
          <div className="grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
            <div className="flex flex-col items-center text-center">
              <IconPaste className="h-9 w-9 text-neutral-800" />
              <h3 className="mt-5 text-[15px] font-semibold text-neutral-950">
                Step 1: Paste Your Alert
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
                Drop in the citation, DWPE excerpt, or full alert text—nothing to
                install.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <IconAnalyze className="h-9 w-9 text-neutral-800" />
              <h3 className="mt-5 text-[15px] font-semibold text-neutral-950">
                Step 2: Click Analyze
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
                AlertIQ parses the breach, citations, and next actions in one pass.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <IconReport className="h-9 w-9 text-neutral-800" />
              <h3 className="mt-5 text-[15px] font-semibold text-neutral-950">
                Step 3: Get Your Report
              </h3>
              <p className="mt-2 text-[14px] leading-relaxed text-neutral-600">
                Structured summary, resolution steps, drafting support, export as
                PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AnalyzePanel />
    </>
  );
}
