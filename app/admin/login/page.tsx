"use client";

import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Card from "@/src/components/ui/Card";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      
      {/* Navbar (logo only) */}
      <Navbar brand={{ name: "CodeAssess", href: "/" }} />

      {/* Centered content */}
      <main className="flex flex-1 items-center justify-center px-6">
        
        <Card className="w-full max-w-md p-8">
          
          {/* Title */}
          <h2 className="text-xl font-semibold text-center text-zinc-900">
            Admin Login
          </h2>

          {/* Subtitle */}
          <p className="mt-2 text-center text-sm text-zinc-500">
            Sign in to access the admin dashboard
          </p>

          {/* Form */}
          <div className="mt-6 space-y-4">
            
            <Input
              type="email"
              placeholder="admin@codeassess.com"
            />

            <Input
              type="password"
              placeholder="Enter your password"
            />

            <Button
              tone="green"
              className="w-full h-10"
            >
              Login
            </Button>

            {/* Hint */}
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