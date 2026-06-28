"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { confirmLeave } from "@/lib/navigation/unsaved-changes";

interface NavbarProps {
  userName: string;
}

export function Navbar({ userName }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    if (!confirmLeave()) return;

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinkClass = (href: string) =>
    `text-sm font-medium transition-colors duration-200 ${
      pathname === href
        ? "text-primary"
        : "text-muted-foreground hover:text-foreground"
    }`;

  const mobileLinkClass = (href: string) =>
    `text-xs font-medium ${pathname === href ? "text-primary" : "text-muted-foreground"}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sidebar-border bg-sidebar/95">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold text-sm">
              {siteConfig.shortName}
            </span>
            <span className="text-lg font-bold text-sidebar-foreground tracking-tight">
              {siteConfig.name}
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className={navLinkClass("/")}>
              Invoices
            </Link>
            <Link
              href="/invoices/create"
              className={navLinkClass("/invoices/create")}
            >
              Create Invoice
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          {userName && (
            <div className="hidden sm:flex flex-col items-end text-right">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Logged in as
              </span>
              <span className="text-xs font-semibold text-sidebar-foreground">
                {userName}
              </span>
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="px-3.5"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="md:hidden border-t border-sidebar-border bg-sidebar px-4 py-2.5 flex items-center justify-around">
        <Link href="/" className={mobileLinkClass("/")}>
          Invoices
        </Link>
        <Link
          href="/invoices/create"
          className={mobileLinkClass("/invoices/create")}
        >
          Create Invoice
        </Link>
      </div>
    </header>
  );
}
