export type FooterProps = {
  productName?: string;
  year?: number;
};

export default function Footer({
  productName = "CodeAssess",
  year = 2026,
}: FooterProps) {
  return (
    <footer className="w-full">
      <div className="h-px w-full bg-zinc-200/70 shadow-[0_-1px_0_rgba(0,0,0,0.04)]" />
      <div className="min-h-[15vh] flex items-center justify-center text-center text-xs text-zinc-500">
        © {year} {productName}. All rights reserved.
      </div>
    </footer>
  );
}

