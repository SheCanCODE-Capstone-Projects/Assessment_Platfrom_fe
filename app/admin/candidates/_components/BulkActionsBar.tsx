import Button from "@/src/components/ui/Button";

type Props = {
  selectedCount: number;
  totalCount: number;
  onInviteSelected: () => void;
  onInviteAll: () => void;
};

export default function BulkActionsBar({ selectedCount, totalCount, onInviteSelected, onInviteAll }: Props) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5">
      <span className="text-xs font-medium text-emerald-800">
        {selectedCount > 0 ? `${selectedCount} of ${totalCount} selected` : `${totalCount} candidate${totalCount !== 1 ? "s" : ""}`}
      </span>
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <Button size="sm" tone="green" variant="outline" onClick={onInviteSelected}>
            Invite Selected ({selectedCount})
          </Button>
        )}
        <Button size="sm" tone="green" onClick={onInviteAll}>
          Invite All
        </Button>
      </div>
    </div>
  );
}
