type InputProps = {
  type?: string;
  placeholder?: string;
  className?: string;
};

export default function Input({
  type = "text",
  placeholder = "",
  className = "",
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full border border-zinc-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${className}`}
    />
  );
}