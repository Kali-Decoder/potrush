"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { AgentSection, PoolsSection, HistorySection, ProfileSection } from "@/components/sections";
import { useState } from "react";
import { GameRulesDialog } from "@/components/game-rules-dialog";
import { useCurrentPotInfo, usePotHistory, usePendingWithdrawals } from "@/hooks/useCompetitivePot";
import { usePotActivity } from "@/hooks/usePotActivity";
import { useAccount } from "wagmi";
import { CustomWalletButton } from "@/components/custom-wallet-button";
import { AnimatedMoney } from "@/components/animated-number";
import { AnimatedFooter } from "@/components/animated-footer";
export type TabId = "pools" | "history" | "profile" | "agent";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabId>("pools");
  const [copied, setCopied] = useState(false);
  const { address } = useAccount();
  const { details, isLoading: potLoading } = useCurrentPotInfo();

  const currentPotId = details?.potId ?? 0;
  const { history, isLoading: historyLoading } = usePotHistory(currentPotId);
  const { activities, isLoading: isActivityLoading } = usePotActivity({ limit: 30 });
  const { formatted: pendingFormatted, amount: pendingAmount, refetch: refetchPending } = usePendingWithdrawals(address);

  const totalPoolFormatted = details?.totalFundsFormatted ?? "0";
  const timeRemainingSeconds = details?.timeRemainingSeconds ?? 0;
  const minimumBidFormatted = details?.minimumNextBidFormatted ?? "0";
  const lastBidder = details?.lastBidder ?? "";
  const lastBidFormatted = details?.lastBidAmountFormatted ?? "0";
  const isActive = details?.isActive ?? false;

  const poolData = {
    totalPool: totalPoolFormatted,
    round: currentPotId,
    timeRemainingSeconds,
    lastBidder,
    lastBidFormatted,
    isActive,
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileSection
            address={address ?? null}
            poolData={{ totalPool: totalPoolFormatted }}
            pendingWithdrawal={pendingFormatted}
            pendingAmount={pendingAmount}
            refetchPending={refetchPending}
            copied={copied}
            copyToClipboard={copyToClipboard}
          />
        );
      case "pools":
        return (
          <PoolsSection
            address={address ?? null}
            poolData={poolData}
            minimumBidFormatted={minimumBidFormatted}
            isMinBidLoading={potLoading}
          />
        );
      case "agent":
        return <AgentSection />;
      case "history":
        return (
          <HistorySection
            history={history}
            activities={activities}
            isLoading={historyLoading}
            isActivityLoading={isActivityLoading}
            currentPotId={currentPotId}
          />
        );
      default:
        return (
          <div className="text-center text-lg font-bold text-[#2C1810] sm:text-2xl">Pool</div>
        );
    }
  };

  const navItems: { id: TabId; icon: React.ReactNode; label: string; shortLabel: string }[] = [
    { id: "pools", icon: <Image src="/images/assets/lottyRuleta.png" alt="" width={24} height={24} className="shrink-0" />, label: "Pool", shortLabel: "Pool" },
    { id: "history", icon: <span className="text-lg">🏆</span>, label: "History", shortLabel: "History" },
    { id: "profile", icon: <Image src="/images/assets/lottyGuy.png" alt="" width={24} height={24} className="shrink-0" />, label: "Profile", shortLabel: "You" },
    { id: "agent", icon: <span className="text-lg">🤖</span>, label: "Agent", shortLabel: "Agent" },
  ];

  return (
    <main className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-[#fefcf4] px-4 md:px-6 lg:px-8">
      {/* BNB decorative images - random locations */}
      <div className="pointer-events-none fixed left-8 top-20 z-0 opacity-40 sm:left-12 sm:top-24 sm:opacity-50">
        <Image src="/images/bnb.webp" alt="" width={40} height={40} className="drop-shadow-lg sm:w-[60px] sm:h-[60px]" />
      </div>
      <div className="pointer-events-none fixed left-1/4 top-1/3 z-0 opacity-40 sm:left-1/4 sm:top-1/3 sm:opacity-50">
        <Image src="/images/bnb.webp" alt="" width={35} height={35} className="drop-shadow-lg sm:w-[55px] sm:h-[55px]" />
      </div>
      <div className="pointer-events-none fixed bottom-32 left-12 z-0 opacity-40 sm:bottom-40 sm:left-16 sm:opacity-50">
        <Image src="/images/bnb.webp" alt="" width={45} height={45} className="drop-shadow-lg sm:w-[70px] sm:h-[70px]" />
      </div>
      <div className="pointer-events-none fixed bottom-20 left-1/3 z-0 opacity-40 sm:bottom-24 sm:left-1/3 sm:opacity-50">
        <Image src="/images/bnb.webp" alt="" width={38} height={38} className="drop-shadow-lg sm:w-[58px] sm:h-[58px]" />
      </div>
      <div className="pointer-events-none fixed left-16 top-1/2 z-0 opacity-35 sm:left-20 sm:top-1/2 sm:opacity-45">
        <Image src="/images/bnb.webp" alt="" width={32} height={32} className="drop-shadow-lg sm:w-[50px] sm:h-[50px]" />
      </div>
      <div className="pointer-events-none fixed left-1/5 top-2/3 z-0 opacity-35 sm:left-1/5 sm:top-2/3 sm:opacity-45">
        <Image src="/images/bnb.webp" alt="" width={42} height={42} className="drop-shadow-lg animate-pulse sm:w-[65px] sm:h-[65px]" />
      </div>
      <div className="pointer-events-none fixed bottom-12 left-1/5 z-0 hidden opacity-35 sm:block sm:bottom-16 sm:left-1/5 sm:opacity-45">
        <Image src="/images/bnb.webp" alt="" width={30} height={30} className="drop-shadow-lg sm:w-[48px] sm:h-[48px]" />
      </div>
      <div className="pointer-events-none fixed top-1/4 left-1/6 z-0 hidden opacity-35 sm:block sm:top-1/4 sm:left-1/6 sm:opacity-45">
        <Image src="/images/bnb.webp" alt="" width={36} height={36} className="drop-shadow-lg sm:w-[56px] sm:h-[56px]" />
      </div>

      <header className="flex shrink-0 items-center justify-between gap-2 border-b-2 border-[#2C1810]/20 bg-[#fefcf4] py-2 safe-area-inset-top md:py-3">
        <div className="flex items-center gap-1.5 rounded-lg border-2 border-[#2C1810]/30 bg-[#FFD93D]/80 px-3 py-2">
          <span className="text-xs font-bold uppercase text-[#5D4E37]">Pool</span>
          <span className="text-lg font-black text-[#2C1810] sm:text-xl md:text-2xl">
            <AnimatedMoney
              value={totalPoolFormatted}
              suffix=" BNB"
              fontSize={20}
              color="#2C1810"
              className="font-black"
            />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <GameRulesDialog />
          <CustomWalletButton />
        </div>
      </header>

      {/* Scrollable content */}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-16">
        <Card className="min-h-full border-0 bg-transparent p-3 shadow-none md:p-4 lg:p-6">
          <div className="font-sans">{renderContent()}</div>
        </Card>
      </div>

      {/* Animated Footer */}
      <AnimatedFooter />

      {/* Floating circular buttons on the right */}
      <nav
        className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col gap-3"
        role="tablist"
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeTab === item.id}
            aria-label={item.label}
            onClick={() => setActiveTab(item.id)}
            className={`group relative flex h-14 w-14 touch-manipulation items-center justify-center rounded-full border-2 border-[#2C1810]/30 shadow-lg transition-all duration-200 active:scale-95 ${
              activeTab === item.id
                ? "bg-[#FFD93D] scale-110 shadow-[0_4px_12px_rgba(255,217,61,0.5)]"
                : "bg-white/90 hover:bg-[#FFD93D]/60 hover:scale-105"
            }`}
          >
            <span className="flex h-8 w-8 items-center justify-center [&>img]:h-6 [&>img]:w-6">
              {item.icon}
            </span>
            {/* Tooltip on hover */}
            <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-[#2C1810] px-3 py-1.5 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </main>
  );
}
