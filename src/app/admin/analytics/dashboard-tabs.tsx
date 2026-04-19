"use client";

import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "overview", label: "Ерөнхий" },
  { key: "effectiveness", label: "Үр нөлөө" },
  { key: "questions", label: "Асуултууд" },
  { key: "behavioral", label: "Зан үйл" },
  { key: "age-groups", label: "Насны бүлэг" },
] as const;

export type TabKey = (typeof TABS)[number]["key"];

export function DashboardTabs({ activeTab }: { activeTab: TabKey }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav
      className="flex gap-1 overflow-x-auto rounded-lg bg-[var(--color-navy-2)] p-1 ring-1 ring-[var(--color-border-1)]"
      aria-label="Dashboard tabs"
    >
      {TABS.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.key}
          onClick={() => router.push(`${pathname}?tab=${tab.key}`)}
          className={cn(
            "whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors",
            activeTab === tab.key
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-white hover:bg-white/5",
          )}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
