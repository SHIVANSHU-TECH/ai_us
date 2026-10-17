"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import { resumeKnowledge } from "@/lib/resume-knowledge";
import { AuthButton } from "@/components/auth/AuthButton";

const NAV: { href: string; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/consult", label: "Consult" },
  { href: "/clients", label: "Clients" },
  { href: "/systems", label: "Systems" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export function SiteShell({
  title,
  modeLabel,
  children,
}: {
  title: string;
  modeLabel: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="flex min-h-screen">
      <button
        type="button"
        className="fixed left-3 top-3 z-40 flex h-10 w-10 items-center justify-center border border-line bg-panel text-mint md:hidden"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        onClick={() => setMobileOpen((v) => !v)}
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/55 md:hidden"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-line bg-panel px-4 py-5 transition-transform duration-200 md:static md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-mint/40 bg-panel2 font-mono text-sm font-semibold text-mint shadow-mint">
            SS
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-soft">
              {resumeKnowledge.profile.name}
            </div>
            <div className="label-caps mt-0.5">Command Center</div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 text-left font-mono text-xs uppercase tracking-[0.12em] transition-colors",
                isActive(item.href)
                  ? "border border-mint/35 bg-panel2 text-mint"
                  : "border border-transparent text-mute hover:border-line hover:bg-panel2 hover:text-soft"
              )}
            >
              <span className="text-cyanx/70">›</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-6 border-t border-line pt-4">
          <div className="label-caps mb-2">System Status</div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-mint">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-mint" />
            AI_ASSISTANT: ONLINE
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-line bg-ink/90 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pl-12 md:pl-0">
            <div>
              <div className="font-mono text-[11px] text-mint">
                shivanshu@portfolio:~$
                <span className="ml-2 text-mute">mode/{modeLabel}</span>
              </div>
              <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-soft md:text-xl">
                {title}
              </h1>
            </div>
            <AuthButton />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 py-5 md:px-6 md:py-6">
          {children}
        </main>

        <footer className="border-t border-line px-4 py-3 md:px-6">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-mute">
            <span>sys.status // listen_first_then_align</span>
            <span className="text-mint">consult + resume modes</span>
            <span>© {new Date().getFullYear()} Shivanshu Shukla</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
