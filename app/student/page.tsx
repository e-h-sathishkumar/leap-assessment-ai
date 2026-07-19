import Link from "next/link";
import {
  ArrowLeft,
  Brain,
  ClipboardCheck,
  BarChart3,
  Trophy,
} from "lucide-react";

export default function StudentPortalPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}

      <section className="bg-gradient-to-br from-green-700 via-emerald-700 to-teal-800 text-white">

        <div className="mx-auto max-w-7xl px-8 py-16">

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-green-100 hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <h1 className="mt-8 text-5xl font-extrabold">
            Student Portal
          </h1>

          <p className="mt-6 max-w-3xl text-xl leading-8 text-green-100">
            Welcome to the LEAP Student Portal. Take assessments,
            monitor your academic progress, practise weak topics,
            and improve with AI-powered recommendations.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              href="/student/login"
              className="rounded-xl bg-white px-8 py-4 font-semibold text-green-700 transition hover:shadow-xl"
            >
              Login
            </Link>

            <Link
              href="/student/register"
              className="rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-green-700"
            >
              Register
            </Link>

          </div>

        </div>

      </section>

      {/* Features */}

      <section className="mx-auto max-w-7xl px-8 py-16">

        <h2 className="mb-10 text-center text-3xl font-bold">
          Everything You Need to Succeed
        </h2>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">

          <FeatureCard
            icon={<ClipboardCheck size={32} />}
            title="Take Assessments"
            description="Attend school tests and competitive exams."
          />

          <FeatureCard
            icon={<BarChart3 size={32} />}
            title="Performance Analytics"
            description="Understand strengths and areas for improvement."
          />

          <FeatureCard
            icon={<Brain size={32} />}
            title="AI Coach"
            description="Receive personalized learning recommendations."
          />

          <FeatureCard
            icon={<Trophy size={32} />}
            title="Practice & Improve"
            description="Generate unlimited practice tests using AI."
          />

        </div>

      </section>
    </main>
  );
}

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div className="mb-6 inline-flex rounded-full bg-green-100 p-4 text-green-700">
        {icon}
      </div>

      <h3 className="text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>

    </div>
  );
}