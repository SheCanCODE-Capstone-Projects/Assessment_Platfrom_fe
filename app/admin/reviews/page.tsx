"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "pending" | "passed" | "failed" | "interview";

type Submission = {
  id: number;
  name: string;
  status: Status;
  title: string;
  date: string;
};

const initialData: Submission[] = [
  {
    id: 1,
    name: "Yvette",
    status: "passed",
    title: "JavaScript Developer Assessment",
    date: "4/29/2026",
  },
  {
    id: 2,
    name: "Yvette",
    status: "pending",
    title: "JavaScript Developer Assessment",
    date: "5/5/2026",
  },
];

const statusStyles: Record<Status, string> = {
  passed: "bg-green-100 text-green-700",
  pending: "bg-orange-100 text-orange-700",
  failed: "bg-red-100 text-red-700",
  interview: "bg-blue-100 text-blue-700",
};

export default function CodeReviewsPage() {
  const router = useRouter();

  const [submissions, setSubmissions] = useState(initialData);
  const [activeTab, setActiveTab] = useState<"all" | Status>("all");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [activeQuestion, setActiveQuestion] = useState(0);

  const questions = [
    {
      title: "Question 1 (20 marks)",
      code: `function twoSum(nums, target) {
  return [];
}`,
    },
    {
      title: "Question 2 (15 marks)",
      code: `function reverseString(str) {
  return str.split("").reverse().join("");
}`,
    },
    {
      title: "Question 3 (25 marks)",
      code: `function isPalindrome(str) {
  return str === str.split("").reverse().join("");
}`,
    },
  ];

  const filtered = submissions.filter((s) =>
    activeTab === "all" ? true : s.status === activeTab
  );

  const count = (status: Status) =>
    submissions.filter((s) => s.status === status).length;

  const updateStatus = (id: number, newStatus: Status) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
    setSelected(null);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">

      {/* HEADER */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-3">

          {/* Back Arrow */}
          <button
            onClick={() => router.push("/admin")}
            className="p-2 rounded hover:bg-zinc-100"
          >
            ←
          </button>

          {/* Logo */}
          <div className="h-8 w-8 flex items-center justify-center rounded bg-orange-500 text-white">
            {"</>"}
          </div>

          <div>
            <h1 className="text-sm font-semibold">Code Reviews</h1>
            <p className="text-xs text-zinc-500">
              {submissions.length} submissions
            </p>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="px-6 mt-4">
        <div className="flex gap-6 text-sm border-b pb-2">
          {[
            { key: "all", label: `All (${submissions.length})` },
            { key: "pending", label: `Pending (${count("pending")})` },
            { key: "passed", label: `Passed (${count("passed")})` },
            { key: "failed", label: `Failed (${count("failed")})` },
            { key: "interview", label: `Interview (${count("interview")})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-1 ${
                activeTab === tab.key
                  ? "border-b-2 border-black font-medium"
                  : "text-zinc-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <main className="px-6 py-6 space-y-4 flex-1">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-lg p-5 flex justify-between items-center"
          >
            <div>
              <div className="flex gap-3 items-center">
                <span className="font-medium">{item.name}</span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${statusStyles[item.status]}`}
                >
                  {item.status}
                </span>
              </div>
              <div className="text-sm text-zinc-600">{item.title}</div>
              <div className="text-xs text-zinc-400">
                {item.date}
              </div>
            </div>

            <button
              onClick={() => {
                setSelected(item);
                setActiveQuestion(0);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Review
            </button>
          </div>
        ))}
      </main>

      {/* MODAL */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[95%] max-w-5xl p-6 rounded">

            <div className="flex justify-between">
              <h2 className="font-semibold">{selected.name}</h2>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">

              {/* QUESTIONS */}
              <div className="space-y-2">
                {questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveQuestion(i)}
                    className={`w-full text-left p-2 rounded ${
                      activeQuestion === i
                        ? "bg-green-500 text-white"
                        : "bg-zinc-100"
                    }`}
                  >
                    {q.title}
                  </button>
                ))}
              </div>

              {/* CODE */}
              <div className="col-span-2 bg-black text-green-400 p-4 rounded">
                {questions[activeQuestion].code}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={() => updateStatus(selected.id, "failed")}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Failed
              </button>

              <button
                onClick={() => updateStatus(selected.id, "passed")}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Passed
              </button>

              <button
                onClick={() => updateStatus(selected.id, "interview")}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM ACTIONS */}
      <div className="px-6 py-4 flex justify-center gap-3">
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Failed
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Passed
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Interview
        </button>
      </div>

      {/* PAGINATION */}
      <div className="px-6 py-4 flex justify-center gap-2">
        <button className="border px-3 py-1">Prev</button>
        <button className="border px-3 py-1 bg-black text-white">1</button>
        <button className="border px-3 py-1">2</button>
        <button className="border px-3 py-1">Next</button>
      </div>
    </div>
  );
}