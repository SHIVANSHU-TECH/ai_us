"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

function NavLinks({
  orientation,
  onNavigate,
}: {
  orientation: "horizontal" | "vertical";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      className={clsx(
        orientation === "horizontal"
          ? "scrollbar-thin flex snap-x snap-mandatory gap-1.5 overflow-x-auto overscroll-x-contain pb-0.5 [-ms-overflow-style:none] [scrollbar-width:thin]"
          : "flex flex-1 flex-col gap-1"
      )}
      aria-label="Primary"
    >
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={clsx(
            "shrink-0 snap-start font-mono text-[11px] uppercase tracking-[0.12em] transition-colors",
            orientation === "horizontal"
              ? "whitespace-nowrap border px-3 py-1.5"
              : "flex items-center gap-2 px-3 py-2 text-left text-xs",
            isActive(item.href)
              ? "border-mint/35 bg-panel2 text-mint"
              : "border-line text-mute hover:border-mint/30 hover:bg-panel2 hover:text-soft",
            orientation === "vertical" && !isActive(item.href)
              ? "border-transparent"
              : null
          )}
        >
          {orientation === "vertical" && (
            <span className="text-cyanx/70">›</span>
          )}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function SiteShell({
  title,
  modeLabel,
  children,
}: {
  title: string;
  modeLabel: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh min-h-screen flex-col md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-[240px] shrink-0 flex-col border-r border-line bg-panel px-4 py-5 md:flex lg:w-[260px]">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-mint/40 bg-panel2 font-mono text-sm font-semibold text-mint shadow-mint">
            SS
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold tracking-wide text-soft">
              {resumeKnowledge.profile.name}
            </div>
            <div className="label-caps mt-0.5">Command Center</div>
          </div>
        </div>

        <NavLinks orientation="vertical" />

        <div className="mt-6 border-t border-line pt-4">
          <div className="label-caps mb-2">System Status</div>
          <div className="flex items-center gap-2 font-mono text-[11px] text-mint">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-mint" />
            AI_ASSISTANT: ONLINE
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-line bg-ink/95 backdrop-blur">
          <div className="flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 md:px-6 md:py-3">
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-[10px] text-mint sm:text-[11px]">
                shivanshu@portfolio:~$
                <span className="ml-1.5 text-mute sm:ml-2">mode/{modeLabel}</span>
              </div>
              <h1 className="mt-0.5 truncate text-base font-semibold tracking-tight text-soft sm:text-lg md:text-xl">
                {title}
              </h1>
            </div>
            <AuthButton />
          </div>

          {/* Mobile / tablet: horizontal scrolling nav */}
          <div className="border-t border-line px-3 py-2 md:hidden">
            <NavLinks orientation="horizontal" />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-3 py-4 sm:gap-5 sm:px-4 sm:py-5 md:px-6 md:py-6">
          {children}
        </main>

        <footer className="border-t border-line px-3 py-3 sm:px-4 md:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mute sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
            <span>sys.status // listen_first_then_align</span>
            <span className="text-mint">consult + resume modes</span>
            <span>© {new Date().getFullYear()} Shivanshu Shukla</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
