"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { clearAuth } from "@/lib/adminAuth";

export default function AdminLogoutButton() {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      tone="zinc"
      size="sm"
      className="rounded-full border-[#EDEDED] px-5"
      onClick={() => {
        clearAuth();
        router.push("/admin/login");
        router.refresh();
      }}
    >
      Exit Admin
    </Button>
  );
}

