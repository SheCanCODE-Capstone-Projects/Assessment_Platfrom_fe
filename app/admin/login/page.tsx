"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  extractAccessToken,
  parseApiErrorMessage,
  setAuthToken,
} from "@/lib/auth";

const API_BASE = (
  process.env.NEXT_PUBLIC_API_URL ??
  "https://assessment-platfrom-be.onrender.com"
).replace(/\/$/, "");

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
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const body: unknown = await res.json().catch(() => ({}));

      if (res.ok) {
        const token = extractAccessToken(body);
        if (!token) {
          setError("Login succeeded but no access token was returned.");
          return;
        }
        setAuthToken(token);
        router.push("/admin");
        return;
      }

      setError(
        parseApiErrorMessage(JSON.stringify(body)) ||
          "Invalid email or password",
      );
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
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
            Sign in with your admin account from the assessment platform
          </p>

          <div className="mt-6 space-y-4">

            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full border border-zinc-300 rounded-md px-3 py-2"
            />

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="w-full border border-zinc-300 rounded-md px-3 py-2"
            />

            <Button
              onClick={handleLogin}
              tone="green"
              className="w-full h-10"
              disabled={loading || !email.trim() || !password}
            >
              {loading ? "Signing in…" : "Login"}
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
