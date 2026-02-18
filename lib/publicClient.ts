import { createPublicClient, http } from "viem";
import { potChain } from "@/lib/chains";

/**
 * Standalone viem public client for BNB Chain Mainnet.
 * Used for contract reads – independent of the wallet adapter / Reown project ID.
 */
export const publicClient = createPublicClient({
  chain: potChain,
  transport: http(process.env.NEXT_PUBLIC_BNB_RPC_URL as string),
});
