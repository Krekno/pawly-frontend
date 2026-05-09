import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  return (
    <header className="border-b border-border bg-background sticky top-0 z-10">
      <div className="container mx-auto max-w-2xl px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Pawly
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/auth/signin" className="text-sm font-medium hover:underline text-muted-foreground hover:text-foreground transition-colors">
            Sign In
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
