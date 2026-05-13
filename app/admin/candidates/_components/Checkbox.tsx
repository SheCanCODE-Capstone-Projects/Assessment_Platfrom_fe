type Props = {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
};

export default function Checkbox({ checked, indeterminate = false, onChange }: Props) {
  return (
    <input
      type="checkbox"
      checked={checked}
      ref={(el) => { if (el) el.indeterminate = indeterminate; }}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded border-zinc-300 accent-emerald-600 cursor-pointer"
    />
  );
}
