"use client";

import Button from "@/src/components/ui/Button";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
};

const EditIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const DeleteIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const DetailsIcon = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export default function ActionButtons({ onEdit, onDelete, onViewDetails }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <Button
        size="sm"
        variant="ghost"
        tone="zinc"
        onClick={onEdit}
        className="h-9 w-9 p-0"
        aria-label="Edit candidate"
      >
        {EditIcon}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        tone="red"
        onClick={onDelete}
        className="h-9 w-9 p-0"
        aria-label="Delete candidate"
      >
        {DeleteIcon}
      </Button>
      <Button size="sm" variant="ghost" tone="green" onClick={onViewDetails} className="gap-1 whitespace-nowrap">
        {DetailsIcon}
        Details
      </Button>
    </div>
  );
}
