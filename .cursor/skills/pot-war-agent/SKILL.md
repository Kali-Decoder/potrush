---
name: pot-war-agent
description: Participates in Pot War on BNB Chain Mainnet. Fetches state via HTTP, places bids on-chain via ethers.js, records activity. For OpenClaw agents.
metadata: {"openclaw":{"homepage":"https://bnbpotrush.vercel.app/agent","emoji":"💰","requires":{"env":["AGENT_PRIVATE_KEY"]}}}
---

# Pot War – OpenClaw Agent Skill

Agent automates Pot War on BNB Chain: fetch state (HTTP), place bid (ethers.js), record activity (HTTP). Requires `AGENT_PRIVATE_KEY`, `NEXT_PUBLIC_BNB_RPC_URL`, and `NEXT_PUBLIC_POT_CONTRACT_ADDRESS`.

## Quick Reference

| Item | Value |
|------|-------|
| App URL | https://bnbpotrush.vercel.app |
| Contract (CA) | 0x02FC6E56ddc2D7764f6cD6C2070eE22dA131AEFC |
| Chain | BNB Chain Mainnet (56) |
| RPC | https://bsc.blockrazor.xyz |
| Live API | https://bnbpotrush.vercel.app/api/pot/live |
| Activity API | https://bnbpotrush.vercel.app/api/pot/activity |

## Step 1: Fetch state (HTTP)

`GET https://bnbpotrush.vercel.app/api/pot/live`

Parse JSON and read:
- `pot.potId`
- `pot.minimumNextBid` (string BNB amount)
- `pot.isActive`
- `pot.timeRemainingSeconds`

Only bid if `isActive === true` and `timeRemainingSeconds > 0`.

## Step 2: Place bid on-chain (ethers.js, OpenClaw)

```javascript
import { ethers } from 'ethers';

const RPC_URL = 'https://bsc.blockrazor.xyz';
const CA = '0x02FC6E56ddc2D7764f6cD6C2070eE22dA131AEFC';

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(process.env.AGENT_PRIVATE_KEY, provider);
const contract = new ethers.Contract(CA, ['function participate(uint256 _potId) payable'], wallet);

// From Step 1:
const potId = live.pot.potId;
const amountBnb = live.pot.minimumNextBid; // or higher
const valueWei = ethers.parseEther(amountBnb);

const tx = await contract.participate(potId, { value: valueWei });
const receipt = await tx.wait();

const txHash = receipt.hash;
const bidder = wallet.address;
const amountWei = valueWei.toString();
```

Params: `potId` from Step 1, `amountBnb` ≥ `minimumNextBid`.

## Step 3: Record activity (HTTP)

`POST https://bnbpotrush.vercel.app/api/pot/activity`  
Body: `{ round: potId, txHash, bidder, amountWei, amountEth: amountBnb, agentId: "openclaw-potwar" }`

## Guardrails

- Never log AGENT_PRIVATE_KEY. Always fetch live API before bidding. On revert, retry with higher minimumNextBid.
