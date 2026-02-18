"use client";

import { Coins, Trophy, TrendingUp, Wallet } from "lucide-react";
import { useWithdraw } from "@/hooks/useCompetitivePot";
import { AnimatedMoney } from "@/components/animated-number";

interface ProfileSectionProps {
  address: string | null;
  poolData: {
    totalPool: string;
  };
  pendingWithdrawal: string;
  pendingAmount: bigint;
  refetchPending: () => void;
  copied: boolean;
  copyToClipboard: (text: string) => void;
}

export function ProfileSection({
  address,
  poolData,
  pendingWithdrawal,
  pendingAmount,
  refetchPending,
  copied,
  copyToClipboard,
}: ProfileSectionProps) {
  const { withdraw, isPending, isConfirming, isSuccess, error } = useWithdraw();
  const hasPending = pendingAmount > BigInt(0);
  const isBusy = isPending || isConfirming;

  const handleWithdraw = () => {
    withdraw();
  };

  // Refetch pending after successful withdrawal
  if (isSuccess && hasPending) {
    setTimeout(() => refetchPending(), 3000);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-6 overflow-y-auto py-2 sm:space-y-8">
      {/* Header Section */}
      <div className="shrink-0 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-[#FFD93D]" />
          <h2 className="text-xl font-black text-[#2C1810] sm:text-2xl md:text-3xl tracking-tight">
            Your Profile
          </h2>
        </div>
        <p className="text-sm font-semibold text-[#5D4E37]/80 sm:text-base ml-3">
          Your address and winnings
        </p>
      </div>

      {address && (
        <div className="group relative overflow-hidden rounded-2xl border-[3px] border-[#2C1810] bg-gradient-to-br from-[#fefcf4] to-white p-5 shadow-[4px_4px_0_0_rgba(44,24,16,1)] transition-all hover:shadow-[6px_6px_0_0_rgba(44,24,16,1)] sm:rounded-3xl sm:border-4 sm:p-6">
          <div className="mb-3 flex items-center gap-2">
            <div className="rounded-full bg-[#FFD93D]/20 p-1.5">
              <Wallet className="h-4 w-4 text-[#2C1810]" strokeWidth={2.5} />
            </div>
            <p className="text-xs font-black text-[#5D4E37] uppercase tracking-wider">Connected Address</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="font-mono text-sm font-bold text-[#2C1810] break-all sm:text-base">{address}</span>
            <button
              type="button"
              onClick={() => copyToClipboard(address)}
              className="shrink-0 rounded-lg border-2 border-[#2C1810] bg-[#FFD93D] px-4 py-2 text-xs font-black text-[#2C1810] shadow-sm transition-all hover:bg-[#FFE066] hover:shadow-md active:scale-95 sm:text-sm"
            >
              {copied ? "✓ Copied!" : "📋 Copy"}
            </button>
          </div>
        </div>
      )}

      {!address && (
        <div className="group relative overflow-hidden rounded-2xl border-[3px] border-[#2C1810] bg-gradient-to-br from-[#fefcf4] to-white p-8 text-center shadow-[4px_4px_0_0_rgba(44,24,16,1)] sm:rounded-3xl sm:border-4">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-[#FFD93D]/20 p-4">
              <Wallet className="h-8 w-8 text-[#5D4E37]" strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-base font-semibold text-[#5D4E37] sm:text-lg">Connect your wallet to see your profile</p>
          <p className="mt-2 text-sm text-[#5D4E37]/70">View your address, winnings, and stats</p>
        </div>
      )}

      {/* Withdraw section */}
      {address && (
        <div className={`group relative overflow-hidden rounded-2xl border-[3px] p-6 shadow-[4px_4px_0_0_rgba(44,24,16,1)] transition-all hover:shadow-[6px_6px_0_0_rgba(44,24,16,1)] sm:rounded-3xl sm:border-4 sm:p-7 ${
          hasPending
            ? "border-[#2C1810] bg-gradient-to-br from-[#FFD93D] via-[#FFED4E] to-[#FFD93D]"
            : "border-[#2C1810] bg-gradient-to-br from-[#fefcf4] to-white"
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className={`rounded-full p-1.5 ${hasPending ? "bg-[#2C1810]/10" : "bg-[#FFD93D]/20"}`}>
                    <TrendingUp className={`h-4 w-4 ${hasPending ? "text-[#2C1810]" : "text-[#5D4E37]"}`} strokeWidth={2.5} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-wider text-[#2C1810] sm:text-sm">Pending Winnings</p>
                </div>
                <p className="text-4xl font-black text-[#2C1810] sm:text-5xl md:text-6xl">
                  <AnimatedMoney
                    value={pendingWithdrawal}
                    suffix=" BNB"
                    fontSize={40}
                    color="#2C1810"
                    className="font-black"
                  />
                </p>
                <p className={`text-sm font-semibold ${hasPending ? "text-[#2C1810]" : "text-[#5D4E37]"}`}>
                  {hasPending ? "✨ Available to claim" : "No pending winnings"}
                </p>
              </div>
              {hasPending && (
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={handleWithdraw}
                    className="w-full max-w-[240px] rounded-xl border-2 border-[#2C1810] bg-[#2C1810] py-3 font-black text-[#FFD93D] shadow-[3px_3px_0_0_rgba(44,24,16,0.8)] transition-all hover:shadow-[4px_4px_0_0_rgba(44,24,16,1)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 sm:py-3.5 sm:text-base"
                  >
                    {isBusy ? "⏳ Confirming…" : isSuccess ? "✓ Withdrawn!" : "💰 Withdraw BNB"}
                  </button>
                  {error && (
                    <p className="text-xs font-semibold text-red-600">{error.message || "Withdraw failed"}</p>
                  )}
                  {isSuccess && (
                    <p className="text-xs font-bold text-green-700">✅ Successfully withdrawn!</p>
                  )}
                </div>
              )}
            </div>
            <div className={`shrink-0 rounded-full border-[3px] border-[#2C1810] p-3 ${hasPending ? "bg-white" : "bg-[#FFD93D]/20"}`}>
              <Trophy className="h-7 w-7 text-[#2C1810]" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 sm:gap-6">
        <div className="group relative overflow-hidden rounded-2xl border-[3px] border-[#2C1810] bg-gradient-to-br from-[#fefcf4] to-white p-6 shadow-[4px_4px_0_0_rgba(44,24,16,1)] transition-all hover:shadow-[6px_6px_0_0_rgba(44,24,16,1)] hover:-translate-y-0.5 sm:rounded-3xl sm:border-4 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[#FFD93D]/20 p-1.5">
                  <Coins className="h-4 w-4 text-[#2C1810]" strokeWidth={2.5} />
                </div>
                <p className="text-xs font-black text-[#5D4E37] uppercase tracking-wider sm:text-sm">Pool Total</p>
              </div>
              <p className="text-3xl font-black text-[#2C1810] sm:text-4xl md:text-5xl">
                <AnimatedMoney
                  value={poolData.totalPool}
                  suffix=" BNB"
                  fontSize={36}
                  color="#2C1810"
                  className="font-black"
                />
              </p>
              <p className="text-sm font-semibold text-[#5D4E37]">Current pot size</p>
            </div>
            <div className="shrink-0 rounded-full border-[3px] border-[#2C1810] bg-[#FFD93D] p-3">
              <Coins className="h-7 w-7 text-[#2C1810]" strokeWidth={2.5} />
            </div>
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-2xl border-[3px] border-[#2C1810] bg-gradient-to-br from-[#FFD93D] to-[#FFE066] p-6 shadow-[4px_4px_0_0_rgba(44,24,16,1)] transition-all hover:shadow-[6px_6px_0_0_rgba(44,24,16,1)] hover:-translate-y-0.5 sm:rounded-3xl sm:border-4 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-[#2C1810]/10 p-1.5">
                  <Trophy className="h-4 w-4 text-[#2C1810]" strokeWidth={2.5} />
                </div>
                <p className="text-xs font-black text-[#2C1810] uppercase tracking-wider sm:text-sm">Payouts</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-black text-[#2C1810] sm:text-3xl">80% to Winner</p>
                <p className="text-sm font-semibold text-[#2C1810]/90">Last bidder takes it all</p>
              </div>
              <div className="mt-2 inline-block rounded-lg bg-[#2C1810]/10 px-3 py-1">
                <p className="text-xs font-bold text-[#2C1810]">🏆 Winner takes 80%</p>
              </div>
            </div>
            <div className="shrink-0 rounded-full border-[3px] border-[#2C1810] bg-white p-3">
              <Trophy className="h-7 w-7 text-[#2C1810]" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
