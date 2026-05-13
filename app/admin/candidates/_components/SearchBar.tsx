import Input from "@/src/components/ui/Input";

type Props = { value: string; onChange: (v: string) => void };

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <Input
      placeholder="Search by name or email…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      leftIcon={<SearchIcon />}
      className="w-full max-w-xs sm:w-64"
    />
  );
}
