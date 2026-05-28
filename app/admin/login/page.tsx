"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { setAuth } from "@/lib/adminAuth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json().catch(() => null)) as
        | { success?: boolean; message?: string; accessToken?: string; role?: string | null }
        | null;

      if (!res.ok || !data?.success) {
        setError(data?.message ?? "Login failed");
        return;
      }

      if (!data.accessToken) {
        setError("Login succeeded but no token returned");
        return;
      }

      setAuth(data.accessToken, data.role);
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      
      <Navbar brand={{ name: "CodeAssess", href: "/" }} />

      <main className="flex flex-1 items-center justify-center px-6">
        
        <Card className="w-full max-w-md p-8 min-h-[420px] flex flex-col justify-center">
          
          <h2 className="text-xl font-semibold text-center text-zinc-900">
            Admin Login
          </h2>

          <p className="mt-2 text-center text-sm text-zinc-500">
            Sign in to access the admin dashboard
          </p>

          <div className="mt-6 space-y-4">
            
            <input
              type="email"
              placeholder="admin@codeassess.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-3 py-2"
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-3 py-2"
            />

            <Button
              onClick={handleLogin}
              tone="green"
              className="w-full h-10"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>

            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

          </div>

        </Card>

      </main>
    </div>
  );
}
