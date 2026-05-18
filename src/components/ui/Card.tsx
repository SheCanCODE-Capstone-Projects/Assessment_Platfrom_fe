type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`bg-white border border-zinc-200 rounded-lg shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}