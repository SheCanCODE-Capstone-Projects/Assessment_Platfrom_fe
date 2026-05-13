import Badge from "@/src/components/ui/Badge";
import Checkbox from "./Checkbox";
import ActionButtons from "./ActionButtons";
import type { Candidate, CandidateStatus } from "../_data/types";

type Props = {
  candidate: Candidate;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
};

const statusConfig: Record<CandidateStatus, { label: string; tone: "green" | "orange" | "zinc" | "red" }> = {
  pending:     { label: "Pending",     tone: "zinc"   },
  in_progress: { label: "In Progress", tone: "orange" },
  completed:   { label: "Completed",   tone: "green"  },
  expired:     { label: "Expired",     tone: "red"    },
};

export default function CandidateRow({ candidate, selected, onSelect, onEdit, onDelete, onViewDetails }: Props) {
  const { label, tone } = statusConfig[candidate.status];
  return (
    <tr className={`border-b border-zinc-100 transition-colors hover:bg-zinc-50/60 ${selected ? "bg-emerald-50/40" : ""}`}>
      <td className="px-4 py-3"><Checkbox checked={selected} onChange={onSelect} /></td>
      <td className="px-4 py-3 font-medium text-zinc-900">{candidate.name}</td>
      <td className="px-4 py-3">
        <div className="text-sm text-zinc-700">{candidate.email}</div>
        <div className="text-xs text-zinc-400">{candidate.phone}</div>
      </td>
      <td className="px-4 py-3 text-sm text-zinc-600">{candidate.exam}</td>
      <td className="px-4 py-3"><Badge tone={tone}>{label}</Badge></td>
      <td className="px-4 py-3 text-xs text-zinc-500">{candidate.date}</td>
      <td className="px-4 py-3">
        <ActionButtons onEdit={onEdit} onDelete={onDelete} onViewDetails={onViewDetails} />
      </td>
    </tr>
  );
}
