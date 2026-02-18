"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PotHistoryEntry } from "@/hooks/useCompetitivePot";
import type { PotActivityEntry } from "@/hooks/usePotActivity";
import { BSC_EXPLORER_URL } from "@/lib/constants";

interface HistorySectionProps {
  history: PotHistoryEntry[];
  activities: PotActivityEntry[];
  isLoading: boolean;
  isActivityLoading: boolean;
  currentPotId: number;
}

function shortAddress(addr: string): string {
  if (!addr || addr.length < 10 || addr === "0x0000000000000000000000000000000000000000") return "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatDate(timestamp: number): string {
  if (timestamp === 0) return "—";
  const d = new Date(timestamp * 1000);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function formatDuration(startTime: number, endTime: number): string {
  if (startTime === 0 || endTime === 0) return "—";
  const seconds = endTime - startTime;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatActivityTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function HistorySection({
  history,
  activities,
  isLoading,
  isActivityLoading,
  currentPotId,
}: HistorySectionProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col space-y-6 overflow-y-auto py-2 sm:space-y-8">
      {/* Header Section */}
      <div className="shrink-0 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-1 w-1 rounded-full bg-[#FFD93D]" />
          <h2 className="text-xl font-black text-[#2C1810] sm:text-2xl md:text-3xl tracking-tight">
            Pot History
          </h2>
        </div>
        <p className="text-sm font-semibold text-[#5D4E37]/80 sm:text-base ml-3">
          Past rounds, winners & bid activity
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:gap-5">
        <div className="group relative rounded-2xl border-[3px] border-[#2C1810] bg-gradient-to-br from-[#fefcf4] to-[#fefcf4] p-5 shadow-[4px_4px_0_0_rgba(44,24,16,1)] transition-all hover:shadow-[6px_6px_0_0_rgba(44,24,16,1)] hover:-translate-y-0.5 sm:rounded-3xl sm:border-4 sm:p-6">
          <div className="text-center">
            <div className="mb-2 flex items-center justify-center gap-1.5">
              <span className="text-lg">🎯</span>
              <p className="text-xs font-black text-[#5D4E37] uppercase tracking-wider">Total Rounds</p>
            </div>
            <p className="text-4xl font-black text-[#2C1810] sm:text-5xl">{currentPotId}</p>
          </div>
        </div>
        <div className="group relative rounded-2xl border-[3px] border-[#2C1810] bg-gradient-to-br from-[#FFD93D] to-[#FFE066] p-5 shadow-[4px_4px_0_0_rgba(44,24,16,1)] transition-all hover:shadow-[6px_6px_0_0_rgba(44,24,16,1)] hover:-translate-y-0.5 sm:rounded-3xl sm:border-4 sm:p-6">
          <div className="text-center">
            <div className="mb-2 flex items-center justify-center gap-1.5">
              <span className="text-lg">✅</span>
              <p className="text-xs font-black text-[#2C1810] uppercase tracking-wider">Completed</p>
            </div>
            <p className="text-4xl font-black text-[#2C1810] sm:text-5xl">{history.length}</p>
          </div>
        </div>
      </div>

      {/* Tables Container - Two Columns */}
      <div className="w-full" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Bid Activity – from MongoDB */}
          <div className="flex flex-col space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">💰</span>
                <h3 className="text-lg font-black text-[#2C1810] sm:text-xl tracking-tight">
                  Recent Bids
                </h3>
              </div>
              <p className="text-xs font-semibold text-[#5D4E37]/70 sm:text-sm ml-7">
                Bidder, amount & transaction per round
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border-[3px] border-[#2C1810] bg-gradient-to-br from-[#fefcf4] to-white shadow-[4px_4px_0_0_rgba(44,24,16,1)] transition-all hover:shadow-[6px_6px_0_0_rgba(44,24,16,1)] sm:rounded-3xl sm:border-4">
              <div className="max-h-[320px] overflow-auto p-4 sm:max-h-[360px] sm:p-5">
                {isActivityLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#FFD93D] border-t-transparent" />
                    <p className="text-sm font-semibold text-[#5D4E37]">Loading bids...</p>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <div className="rounded-full bg-[#FFD93D]/20 p-4">
                      <span className="text-3xl">📊</span>
                    </div>
                    <p className="text-center text-sm font-semibold text-[#5D4E37] max-w-xs">
                      No bid activity recorded yet.<br />
                      <span className="text-xs text-[#5D4E37]/70">Bids will appear here after participation.</span>
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="min-w-[500px]">
                      <TableHeader>
                        <TableRow className="border-b-[3px] border-[#2C1810] hover:bg-transparent">
                          <TableHead className="text-xs font-black text-[#2C1810] uppercase w-16 py-3">Round</TableHead>
                          <TableHead className="text-xs font-black text-[#2C1810] uppercase py-3">Bidder</TableHead>
                          <TableHead className="text-xs font-black text-[#2C1810] uppercase text-right py-3">Amount</TableHead>
                          <TableHead className="text-xs font-black text-[#2C1810] uppercase text-right py-3">Tx</TableHead>
                          <TableHead className="text-xs font-black text-[#2C1810] uppercase text-right hidden sm:table-cell py-3">Time</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activities.map((a, idx) => (
                          <TableRow
                            key={a.id ?? `${a.round}-${a.txHash}-${a.timestamp}`}
                            className="border-b border-[#2C1810]/15 transition-all hover:bg-[#FFD93D]/20 hover:shadow-sm"
                          >
                            <TableCell className="py-3">
                              <div className="flex items-center gap-2">
                                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#FFD93D]/30 text-xs font-black text-[#2C1810]">
                                  #{a.round}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="py-3">
                              <div className="space-y-0.5">
                                <span className="font-mono text-sm font-bold text-[#2C1810]">
                                  {shortAddress(a.bidder)}
                                </span>
                                {a.agentId && (
                                  <span className="block text-[10px] font-medium text-[#5D4E37]/70">
                                    🤖 {a.agentId}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right py-3">
                              <Badge className="bg-[#FFD93D] text-[#2C1810] border-2 border-[#2C1810]/30 font-black text-xs px-2 py-1 shadow-sm">
                                {a.amountEth} BNB
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right py-3">
                              <a
                                href={`${BSC_EXPLORER_URL}/tx/${a.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-lg bg-[#9333EA]/10 px-2 py-1 text-xs font-bold text-[#9333EA] transition-colors hover:bg-[#9333EA]/20 hover:underline"
                              >
                                🔗 View
                              </a>
                            </TableCell>
                            <TableCell className="text-right text-xs text-[#5D4E37] hidden sm:table-cell py-3">
                              <span className="font-medium">{formatActivityTime(a.timestamp)}</span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rounds & Winners – from chain */}
          <div className="flex flex-col space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <h3 className="text-lg font-black text-[#2C1810] sm:text-xl tracking-tight">
                  Round Winners
                </h3>
              </div>
              <p className="text-xs font-semibold text-[#5D4E37]/70 sm:text-sm ml-7">
                Completed rounds with winners & pot sizes
              </p>
            </div>
            <div className="group relative overflow-hidden rounded-2xl border-[3px] border-[#2C1810] bg-gradient-to-br from-[#fefcf4] to-white shadow-[4px_4px_0_0_rgba(44,24,16,1)] transition-all hover:shadow-[6px_6px_0_0_rgba(44,24,16,1)] sm:rounded-3xl sm:border-4">
              <div className="max-h-[320px] overflow-auto overflow-x-auto p-4 sm:max-h-[360px] sm:p-5">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#FFD93D] border-t-transparent" />
                    <p className="text-sm font-semibold text-[#5D4E37]">Loading winners...</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table className="min-w-[500px]">
                      <TableHeader>
                        <TableRow className="border-b-[3px] border-[#2C1810] hover:bg-transparent">
                          <TableHead className="text-xs font-black text-[#2C1810] uppercase w-20 py-3">Round</TableHead>
                          <TableHead className="text-xs font-black text-[#2C1810] uppercase py-3">Winner</TableHead>
                          <TableHead className="text-xs font-black text-[#2C1810] uppercase text-right py-3">Pot Size</TableHead>
                          <TableHead className="text-xs font-black text-[#2C1810] uppercase text-right hidden sm:table-cell py-3">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="py-12">
                              <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="rounded-full bg-[#FFD93D]/20 p-4">
                                  <span className="text-3xl">🏆</span>
                                </div>
                                <p className="text-center text-sm font-semibold text-[#5D4E37]">
                                  No completed pots yet
                                </p>
                                <p className="text-center text-xs text-[#5D4E37]/70">
                                  Winners will appear here once rounds complete.
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          history.map((entry) => (
                            <TableRow
                              key={entry.potId}
                              className="border-b border-[#2C1810]/15 transition-all hover:bg-[#FFD93D]/20 hover:shadow-sm"
                            >
                              <TableCell className="py-3">
                                <div className="flex items-center gap-2">
                                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#FFD93D]/40 text-sm font-black text-[#2C1810]">
                                    #{entry.potId}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="py-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">🏆</span>
                                  <span className="font-mono text-sm font-bold text-[#2C1810]">
                                    {shortAddress(entry.winner)}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right py-3">
                                <Badge className="border-2 border-[#2C1810] bg-gradient-to-r from-[#FFD93D] to-[#FFE066] font-black text-[#2C1810] px-2.5 py-1 shadow-sm">
                                  {entry.finalAmountFormatted} BNB
                                </Badge>
                              </TableCell>
                              <TableCell className="hidden text-right text-sm text-[#5D4E37] sm:table-cell py-3">
                                <div className="space-y-0.5">
                                  <p className="font-semibold">{formatDate(entry.endTime)}</p>
                                  <p className="text-xs text-[#5D4E37]/70 font-medium">{formatDuration(entry.startTime, entry.endTime)}</p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
