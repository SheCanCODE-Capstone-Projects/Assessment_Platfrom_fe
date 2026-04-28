"use client";

import Footer from "@/src/components/layout/Footer";

export default function CodeReviewsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">

      {/* Header */}
      <div className="w-full bg-white border-b border-zinc-200">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-6">
          
          <h1 className="text-sm font-semibold text-zinc-900">
            Code Reviews
          </h1>

          <span className="ml-3 text-xs text-zinc-500">
            0 submissions
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto w-full max-w-6xl px-6 mt-6">
        <div className="flex gap-6 text-sm border-b border-zinc-200 pb-2">
          
          <span className="border-b-2 border-zinc-900 pb-1 font-medium">
            All (0)
          </span>

          <span className="text-zinc-500">Pending (0)</span>
          <span className="text-zinc-500">Reviewed (0)</span>
          <span className="text-zinc-500">Passed (0)</span>
          <span className="text-zinc-500">Failed (0)</span>
          <span className="text-zinc-500">Interview (0)</span>

        </div>
      </div>

      {/* Empty State */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="text-center">
          
          <div className="text-sm font-medium text-zinc-700">
            No submissions to review yet
          </div>

          <p className="mt-1 text-xs text-zinc-500">
            Submissions will appear here once candidates complete assessments
          </p>

        </div>
      </main>

      <Footer />
    </div>
  );
}