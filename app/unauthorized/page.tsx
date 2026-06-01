import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Navbar from "@/components/layout/Navbar";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar brand={{ name: "CodeAssess", href: "/" }} />

      <main className="flex flex-1 items-center justify-center px-6">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-xl font-semibold text-zinc-900 text-center">
            Unauthorized
          </h1>
          <p className="mt-2 text-sm text-zinc-600 text-center">
            Nta burenganzira ufite bwo kugera kuri admin portal.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Button href="/admin/login" tone="green" className="w-full">
              Subira kuri Login
            </Button>
            <Button href="/" variant="outline" tone="zinc" className="w-full">
              Subira Ahabanza
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}

