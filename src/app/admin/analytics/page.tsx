import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { DashboardTabs, type TabKey } from "./dashboard-tabs";
import { OverviewTab } from "./overview-tab";
import { EffectivenessTab } from "./effectiveness-tab";
import { QuestionsTab } from "./questions-tab";
import { BehavioralTab } from "./behavioral-tab";
import { AgeGroupsTab } from "./age-groups-tab";
import { ByTypeTab } from "./by-type-tab";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "Фишинг IQ тест — судалгааны статистик",
};

const VALID_TABS: TabKey[] = [
  "overview",
  "effectiveness",
  "questions",
  "behavioral",
  "age-groups",
  "by-type",
];

type PageProps = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function AnalyticsPage({ searchParams }: PageProps) {
  const { tab } = await searchParams;
  const activeTab: TabKey = VALID_TABS.includes(tab as TabKey)
    ? (tab as TabKey)
    : "overview";

  return (
    <main id="main-content" className="relative z-10 flex flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
      <div className="w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            ШУТИС · Кибер аюулгүй байдлын тэнхим · 2026
          </div>
          <h1 className="bg-gradient-to-r from-cyan to-blue-2 bg-clip-text text-transparent text-3xl font-extrabold tracking-tight sm:text-4xl">
            Analytics Dashboard
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Фишинг IQ тестийн судалгааны дэлгэрэнгүй статистик
          </p>
        </div>

        <DashboardTabs activeTab={activeTab} />

        {/* Tab content */}
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "effectiveness" && <EffectivenessTab />}
        {activeTab === "questions" && <QuestionsTab />}
        {activeTab === "behavioral" && <BehavioralTab />}
        {activeTab === "age-groups" && <AgeGroupsTab />}
        {activeTab === "by-type" && <ByTypeTab />}
      </div>
    </main>
  );
}
