import Link from "next/link";
import type { ReactNode } from "react";

export type FeatureCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;

};

export default function FeatureCard({
  icon,
  title,
  description,
  href,
}: FeatureCardProps )  {
  const content = (
    <>
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
        {icon}
      </div>
      <div className="text-[15px] font-semibold text-zinc-900">{title}</div>
      <p className="mt-1 text-sm leading-6 text-zinc-600">{description}</p>
    </>
  );

  const classes =
    "block rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50";

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}

