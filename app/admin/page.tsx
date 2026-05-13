import Navbar from "@/components/layout/Navbar";
import FeatureCard from "@/components/cards/FeatureCard";
import StatCard from "@/components/cards/StatCard";
import Button from "@/components/ui/Button";

function Icon({
  d,
}: {
  d: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d={d} />
    </svg>
  );
}

export default function AdminPage() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <Navbar
        brand={{ name: "CodeAssess Admin", href: "/admin" }}
        right={
          <Button
            href="/"
            variant="outline"
            tone="zinc"
            size="sm"
            className="rounded-full border-[#EDEDED] px-5"
          >
            Exit Admin
          </Button>
        }
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <div className="text-xs font-medium text-zinc-500">Dashboard</div>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Questions"
            value={<span className="text-emerald-700">3</span>}
            description=" "
          />
          <StatCard
            title="Active Exams"
            value={<span className="text-emerald-700">1</span>}
            description=" "
          />
          <StatCard
            title="Total Candidates"
            value={<span className="text-emerald-700">0</span>}
            description=" "
          />
          <StatCard
            title="Pending Reviews"
            value={<span className="text-emerald-700">0</span>}
            description=" "
          />
        </section>

        <section className="mt-8">
          <h2 className="text-sm font-semibold text-zinc-900">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Icon d="M12 20h9" />}
              title="Manage Questions"
              description="Create and edit coding questions"
              href="/admin/questions"
            />
            <FeatureCard
              icon={<Icon d="M8 7V3m8 4V3M4 11h16M6 21h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2Z" />}
              title="Manage Exams"
              description="Create and configure exams"
              href="/admin/exams"
            />
            <FeatureCard
              icon={<Icon d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 7a4 4 0 1 0 0.1 0Z" />}
              title="Assign Candidates"
              description="Invite candidates and assign exams"
              href="/admin/candidates"
            />
            <FeatureCard
              icon={<Icon d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />}
              title="Code Reviews"
              description="Review and grade submissions"
              href="/admin/reviews"
            />
          </div>
        </section>

        <section className="mt-8 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="text-sm font-semibold text-zinc-900">
            Recent Submissions
          </div>
          <div className="mt-10 text-center text-sm text-zinc-500">
            No submissions yet
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard title="Passed" value={<span>0</span>} description=" " />
          <StatCard
            title="Interview Ready"
            value={<span className="text-blue-600">0</span>}
            description=" "
          />
          <StatCard
            title="Awaiting Review"
            value={<span className="text-orange-600">0</span>}
            description=" "
          />
        </section>
      </main>

    </div>
  );
}
