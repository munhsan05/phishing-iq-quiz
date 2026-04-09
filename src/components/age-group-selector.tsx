"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AGE_GROUPS,
  AGE_GROUP_LABELS,
  AGE_GROUP_SUBLABELS,
  AGE_GROUP_ICONS,
} from "@/lib/constants";
import type { AgeGroup } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AgeGroupSelectorProps = {
  /** Called with the chosen age group when the user taps a card. */
  onSelect: (ageGroup: AgeGroup) => void;
  /** Disables all cards while a server action is in flight. */
  disabled?: boolean;
};

/**
 * Grid of three cards — one per supported age group.
 * Ports the `#step-age` / `.age-grid` UI from legacy `index.html`:
 * icon + range label + sublabel + start button.
 *
 * Keyboard: each card is a focusable button (both the outer Card and the
 * inner CTA). Enter/Space activates. Hover adds a cyan glow.
 */
export function AgeGroupSelector({
  onSelect,
  disabled = false,
}: AgeGroupSelectorProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
      {AGE_GROUPS.map((ageGroup) => (
        <Card
          key={ageGroup}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label={`${AGE_GROUP_LABELS[ageGroup]} — ${AGE_GROUP_SUBLABELS[ageGroup]}`}
          aria-disabled={disabled}
          onClick={() => {
            if (disabled) return;
            onSelect(ageGroup);
          }}
          onKeyDown={(e) => {
            if (disabled) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(ageGroup);
            }
          }}
          className={cn(
            "group/age relative cursor-pointer select-none overflow-hidden border border-border/60 bg-card/60 p-6 text-center backdrop-blur",
            "transition-all duration-300 ease-out",
            "hover:-translate-y-1 hover:border-accent/60 hover:shadow-[0_0_32px_rgba(6,214,245,0.18)]",
            "focus-visible:-translate-y-1 focus-visible:border-accent/60 focus-visible:shadow-[0_0_32px_rgba(6,214,245,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
            "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          )}
        >
          <CardContent className="flex flex-col items-center gap-3 px-0">
            <span
              aria-hidden="true"
              className="text-5xl drop-shadow-[0_0_12px_rgba(26,108,246,0.35)] transition-transform duration-300 group-hover/age:scale-110"
            >
              {AGE_GROUP_ICONS[ageGroup]}
            </span>
            <span className="font-mono text-xl font-bold tracking-wider text-white">
              {AGE_GROUP_LABELS[ageGroup]}
            </span>
            <span className="text-sm uppercase tracking-wide text-muted-foreground">
              {AGE_GROUP_SUBLABELS[ageGroup]}
            </span>
            <Button
              type="button"
              variant="default"
              size="lg"
              disabled={disabled}
              tabIndex={-1}
              className={cn(
                "mt-2 w-full bg-primary/90 text-primary-foreground shadow-[0_8px_24px_rgba(26,108,246,0.35)]",
                "hover:bg-primary",
              )}
              onClick={(e) => {
                e.stopPropagation();
                if (disabled) return;
                onSelect(ageGroup);
              }}
            >
              Эхлэх →
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
