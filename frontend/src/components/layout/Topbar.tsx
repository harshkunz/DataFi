"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { RoleSwitcher } from "@/components/shared/RoleSwitcher";
import { ExportMenu } from "@/components/shared/ExportMenu";
import { CurrencySelector } from "@/components/shared/CurrencySelector";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useNotificationEngine } from "@/hooks/useNotificationEngine";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useEffect } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/transactions": "Transactions",
  "/dashboard/insights": "Insights",
  "/dashboard/bills": "Bills",
  "/dashboard/goals": "Goals",
  "/dashboard/recurring": "Recurring",
};

export function Topbar() {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] || "Dashboard";
  const fetchRates = useCurrencyStore((s) => s.fetchRates);
  useNotificationEngine();
  useEffect(() => { fetchRates(); }, [fetchRates]);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur w-full">
      {/* Main row */}
      <div className="flex h-16 items-center justify-between gap-2 px-4 md:px-6 overflow-x-hidden">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 relative overflow-hidden rounded-lg">
            <Image
              src="/images/logo.png"
              alt="DataFi Logo"
              fill
              className="object-contain"
            />
          </div>
          <span className="font-bold text-base tracking-tight"> DataFi </span>
        </div>

        {/* Page title — desktop */}
        <h1 className="hidden md:block text-lg font-semibold">{title}</h1>

        <div className="flex items-center gap-1.5 ml-auto">
          <div className="hidden md:flex items-center gap-1.5">
            <CurrencySelector />
            <ExportMenu />
            <RoleSwitcher />
          </div>
          <NotificationBell />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile controls row */}
      <div className="md:hidden flex items-center gap-2 px-4 py-2 border-t border-border/50">
        <CurrencySelector />
        <ExportMenu />
        <div className="ml-auto">
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}
