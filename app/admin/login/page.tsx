"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Card from "@/src/components/ui/Card";
import Button from "@/src/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === "admin@codeassess.com" && password === "password") {
      router.push("/admin"); // go to dashboard
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      
      <Navbar brand={{ name: "CodeAssess", href: "/" }} />

      <main className="flex flex-1 items-center justify-center px-6">
        
        <Card className="w-full max-w-md p-8">
          
          <h2 className="text-xl font-semibold text-center text-zinc-900">
            Admin Login
          </h2>

          <p className="mt-2 text-center text-sm text-zinc-500">
            Sign in to access the admin dashboard
          </p>

          <div className="mt-6 space-y-4">
            
            {/* Email */}
            <input
              type="email"
              placeholder="admin@codeassess.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-3 py-2"
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-3 py-2"
            />

            {/* Button */}
            <Button
              onClick={handleLogin}
              tone="green"
              className="w-full h-10"
            >
              Login
            </Button>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center">
                {error}
              </p>
            )}

            <p className="text-center text-xs text-zinc-500">
              Demo: admin@codeassess.com / password
            </p>

          </div>

        </Card>

      </main>

      <Footer />
    </div>
  );
}