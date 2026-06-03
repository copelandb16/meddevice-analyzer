import Link from "next/link";

export const metadata = {
  title: "Privacy policy",
  description:
    "How AlertIQ collects, processes, and shares information when you use the analyzer.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-8 lg:py-20">
      <Link
        href="/"
        className="text-[13px] font-medium text-neutral-950 underline underline-offset-4 hover:text-neutral-700"
      >
        ← AlertIQ home
      </Link>

      <h1 className="mt-10 text-3xl font-bold tracking-tight text-neutral-950">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-neutral-500">Last updated: May 2, 2026</p>

      <div className="mt-10 space-y-10 text-[15px] leading-7 text-neutral-600">
        <section aria-labelledby="p1">
          <h2
            id="p1"
            className="text-lg font-semibold text-neutral-950"
          >
            What this policy covers
          </h2>
          <p className="mt-3">
            This policy describes how AlertIQ treats information when you use
            this application. AlertIQ runs in your browser and communicates with
            our servers only when you explicitly submit content for analysis.
          </p>
        </section>

        <section aria-labelledby="p2">
          <h2
            id="p2"
            className="text-lg font-semibold text-neutral-950"
          >
            Information you provide
          </h2>
          <p className="mt-3">
            Text you paste for analysis is sent to our backend so it can be
            forwarded to our AI provider and returned to your browser as a
            report. Treat pasted material as confidential to your company; only
            include what your policies allow sharing with automated services.
          </p>
        </section>

        <section aria-labelledby="p3">
          <h2
            id="p3"
            className="text-lg font-semibold text-neutral-950"
          >
            How we use and share information
          </h2>
          <p className="mt-3">
            We use submitted text solely to produce the requested analysis,
            troubleshoot failures, or comply with law. Outputs are processed
            through Anthropic Claude (Anthropic). Anthropic operates under its
            own terms and privacy policy; review those at anthropic.com if you
            need detail on subprocessors and regions.
          </p>
          <p className="mt-3">
            We do not sell your pasted content. We may share information where
            required by law or to protect rights and safety.
          </p>
        </section>

        <section aria-labelledby="p4">
          <h2
            id="p4"
            className="text-lg font-semibold text-neutral-950"
          >
            Retention and security
          </h2>
          <p className="mt-3">
            AlertIQ does not advertise long-term retention of your analyses in
            this deployment; submissions are transient for processing unless you
            or your administrator configure separate logging or analytics. Use
            HTTPS in production and restrict API keys appropriately.
          </p>
        </section>

        <section aria-labelledby="p5">
          <h2
            id="p5"
            className="text-lg font-semibold text-neutral-950"
          >
            Children
          </h2>
          <p className="mt-3">
            AlertIQ is not directed at children under 16, and we do not
            knowingly collect personal information from them.
          </p>
        </section>

        <section aria-labelledby="p6">
          <h2
            id="p6"
            className="text-lg font-semibold text-neutral-950"
          >
            Changes
          </h2>
          <p className="mt-3">
            We may revise this policy as the service evolves. Continuing to use
            AlertIQ after an update constitutes acceptance unless otherwise
            required by law.
          </p>
        </section>

        <section aria-labelledby="p7">
          <h2
            id="p7"
            className="text-lg font-semibold text-neutral-950"
          >
            Contact
          </h2>
          <p className="mt-3">
            For privacy questions relating to AlertIQ as you operate it, email{" "}
            <a
              href="mailto:hello@alertiq.com"
              className="font-medium text-neutral-950 underline underline-offset-4"
            >
              hello@alertiq.com
            </a>
            {" "}
            or contact the mailbox responsible for your deployment.
          </p>
        </section>
      </div>
    </main>
  );
}
