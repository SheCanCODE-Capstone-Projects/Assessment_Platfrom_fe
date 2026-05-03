import Link from "next/link";

interface Exam {
  id: string;
  title: string;
  description: string;
  duration: number;
  passMark: number;
  questions: number;
  totalMarks: number;
  link: string;
}

export default function ExamCard({ exam }: { exam: Exam }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex justify-end mb-4">
        <Link href={`/admin/exams/${exam.id}`}>
          <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            View Details
          </button>
        </Link>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">{exam.title}</h3>
      <p className="text-gray-600 mb-4">{exam.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
        <span>⏱ {exam.duration} min</span>
        <span>🎯 {exam.passMark}%</span>
        <span>📝 {exam.questions} Questions</span>
        <span>📊 {exam.totalMarks} Marks</span>
      </div>

      <div className="text-sm text-blue-600 break-all">{exam.link}</div>
    </div>
  );
}