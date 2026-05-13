"use client";

import { useState } from "react";
import AdminHeader from "@/components/layout/AdminHeader";
import ExamCard from "@/components/cards/ExamCard";
import CreateExamModal from "@/components/modals/CreateExamModal";

export default function ExamManagementPage() {
  const [open, setOpen] = useState(false);

  const exams = [
    {
      id: "123",
      title: "JavaScript Developer Assessment",
      description: "Assess core JavaScript skills",
      duration: 60,
      passMark: 70,
      questions: 3,
      totalMarks: 60,
      link: "https://codeassess.com/exam/123",
      status: "ACTIVE" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <AdminHeader
        title="Exam Management"
        subtitle="1 exams"
        action={
          <button 
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors" 
            onClick={() => setOpen(true)}
          >
            + Create Exam
          </button>
        }
      />

      <div className="mt-6 grid gap-6">
        {exams.map((exam, i) => (
          <ExamCard key={i} exam={exam} />
        ))}
      </div>

      <CreateExamModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
