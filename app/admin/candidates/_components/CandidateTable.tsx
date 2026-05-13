import EmptyState from "@/components/states/EmptyState";
import Checkbox from "./Checkbox";
import CandidateRow from "./CandidateRow";
import type { Candidate } from "../_data/types";

type Props = {
  candidates: Candidate[];
  selectedIds: Set<string>;
  onSelectAll: (checked: boolean) => void;
  onSelectOne: (id: string, checked: boolean) => void;
  onEdit: (c: Candidate) => void;
  onDelete: (id: string) => void;
  onViewDetails: (c: Candidate) => void;
};

export default function CandidateTable({ candidates, selectedIds, onSelectAll, onSelectOne, onEdit, onDelete, onViewDetails }: Props) {
  const allSelected = candidates.length > 0 && selectedIds.size === candidates.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < candidates.length;

  return (
    <div className="rounded-lg border border-zinc-200 bg-white shadow-sm overflow-hidden">
      {candidates.length === 0 ? (
        <EmptyState message="No candidates match your search" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50 text-left text-xs font-medium text-zinc-500">
                <th className="px-4 py-3">
                  <Checkbox checked={allSelected} indeterminate={someSelected} onChange={onSelectAll} />
                </th>
                {["Name", "Contact", "Exam", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <CandidateRow
                  key={c.id}
                  candidate={c}
                  selected={selectedIds.has(c.id)}
                  onSelect={(checked) => onSelectOne(c.id, checked)}
                  onEdit={() => onEdit(c)}
                  onDelete={() => onDelete(c.id)}
                  onViewDetails={() => onViewDetails(c)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
