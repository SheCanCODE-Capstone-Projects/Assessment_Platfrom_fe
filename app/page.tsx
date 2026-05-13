import Navbar from "@/src/components/layout/Navbar";
import FeatureCard from "@/src/components/cards/FeatureCard";
import Button from "@/src/components/ui/Button";
import Footer from "@/src/components/layout/Footer";



export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />

      <main className="w-full flex-1">
        <div className="mx-auto w-full max-w-6xl px-6">
        <section className="py-24 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            Technical Assessment Platform
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-zinc-600">
            Evaluate coding skills with real-world challenges. Create
            assessments, manage candidates, and review code submissions all in
            one place.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              href="/candidate-register"
              tone="green"
              size="md"
              className="px-8"
            >
              Start Sample Assessment
            </Button>
          </div>
        </section>
        </div>
        <section className="pb-20 pt-12 bg-[#F3F4F6]">
          <div className="mx-auto w-full max-w-6xl px-6">
            <h2 className="text-center text-[15px] font-semibold text-black/90">
              Platform Features
            </h2>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M8 9l-3 3 3 3" />
                    <path d="M16 9l3 3-3 3" />
                    <path d="M14 7l-4 10" />
                  </svg>
                }
                title="Code Editor"
                description="Monaco-powered code editor with syntax highlighting and autocomplete."
              />
              <FeatureCard
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                }
                title="Test Cases"
                description="Create custom test cases to validate candidate solutions automatically."
              />
              <FeatureCard
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <path d="M20 8v6" />
                    <path d="M23 11h-6" />
                  </svg>
                }
                title="Candidate Management"
                description="Assign exams to candidates and track their progress in real-time."
              />
              <FeatureCard
                icon={
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    <path d="M8 10h8" />
                    <path d="M8 14h5" />
                  </svg>
                }
                title="Code Review"
                description="Review submissions, provide feedback, and make hiring decisions."
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
