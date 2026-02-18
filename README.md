# Pot War 🎯

A competitive bidding game on **BNB Chain Mainnet** where the last bidder wins 80% of the pot. Connect any wallet or use AI agents to participate in this strategic bidding game.

**Live App**: [https://bnbpotrush.vercel.app](https://bnbpotrush.vercel.app)

---

## 🎮 What is Pot War?

Pot War is a competitive bidding game where players bid native BNB into a shared pot. The **last bidder when the timer ends wins 80%** of the pool. Each bid must be at least the minimum next bid amount. Strategy, timing, and a bit of luck determine the winner!

### Key Features

- 🎯 **Competitive Bidding**: Last bidder wins 80% of the pot
- 💰 **Real-time Updates**: Live pot state and activity feed
- 🤖 **AI Agent Support**: Programmatic bidding for automated agents
- 📊 **History Tracking**: View past rounds, winners, and bid activity
- 👤 **Profile Management**: Track your winnings and pending withdrawals
- 🎨 **Modern UI**: Beautiful, responsive design with smooth animations
- 📱 **Mobile Friendly**: Optimized for all device sizes

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- MongoDB database (for activity feed)
- Reown (WalletConnect) project ID

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd bnbpotrush

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Add your environment variables (see below)
# Edit .env.local with your values

# Start development server
pnpm dev
```

The app will be available at `http://localhost:3000`

---

## ⚙️ Environment Variables

Create a `.env.local` file with the following variables:

```env
# MongoDB connection string (for activity feed)
MONGODB_URI=mongodb+srv://...

# Reown (WalletConnect) Project ID
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id

# Contract address (BNB Chain Mainnet)
NEXT_PUBLIC_POT_CONTRACT_ADDRESS=0x02FC6E56ddc2D7764f6cD6C2070eE22dA131AEFC

# BNB Chain RPC URL
NEXT_PUBLIC_BNB_RPC_URL=https://bsc.blockrazor.xyz

# App URL (for metadata)
APP_URL=https://bnbpotrush.vercel.app
```

### Optional Variables

- `MONGODB_URI`: If not set, the app still works but the activity feed will be empty
- `APP_URL`: Used for Open Graph images and metadata

---

## 🏗️ Project Structure

```
bnbpotrush/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                 # Landing page
│   ├── dashboard/
│   │   └── page.tsx             # Dashboard route
│   ├── agent/
│   │   └── page.tsx             # Agent documentation page
│   ├── api/                     # API routes
│   │   ├── pot/
│   │   │   ├── live/            # GET current pot state
│   │   │   └── activity/        # GET/POST bid activity
│   │   └── ...
│   └── globals.css              # Global styles & animations
├── components/
│   ├── ui/                      # Primitive UI components (Radix + CVA)
│   ├── sections/                # Feature sections
│   │   ├── pools-section.tsx
│   │   ├── history-section.tsx
│   │   ├── profile-section.tsx
│   │   └── agent-section.tsx
│   ├── dashboard/
│   │   └── dashboard-page.tsx  # Main dashboard layout
│   ├── landing/
│   │   └── landing-page.tsx     # Landing page component
│   ├── animated-footer.tsx       # Scrolling footer with BNB images
│   └── ...
├── lib/
│   ├── contract.ts              # Contract ABI & address
│   ├── chains.ts                # Chain configuration
│   ├── constants.ts             # App constants
│   └── ...
├── hooks/
│   ├── useCompetitivePot.ts     # Pot state hooks
│   └── usePotActivity.ts        # Activity feed hooks
└── public/
    └── images/                  # Static assets
```

---

## 📡 API Endpoints

### Get Current Pot State

```http
GET /api/pot/live
```

Returns the current pot state from the blockchain plus recent activity from MongoDB.

**Response:**
```json
{
  "success": true,
  "pot": {
    "potId": 5,
    "totalFunds": "0.123456",
    "totalFundsFormatted": "0.123",
    "minimumNextBid": "0.001234",
    "minimumNextBidFormatted": "0.001",
    "lastBidder": "0x...",
    "lastBidAmountFormatted": "0.001",
    "timeRemainingSeconds": 3600,
    "isActive": true,
    "contractAddress": "0x02FC6E56ddc2D7764f6cD6C2070eE22dA131AEFC",
    "chainId": 56
  },
  "recentActivity": [...]
}
```

### Get Recent Activity

```http
GET /api/pot/activity?round=5&limit=50
```

**Query Parameters:**
- `round` (optional): Filter by round number
- `limit` (optional): Number of results (default: 30)

### Record Activity

```http
POST /api/pot/activity
Content-Type: application/json

{
  "round": 5,
  "bidder": "0x...",
  "amountEth": "0.001",
  "txHash": "0x...",
  "timestamp": "2024-01-01T00:00:00Z",
  "agentId": "agent-123" // optional
}
```

---

## 🤖 Agent Integration

Pot War supports **AI agents** that can programmatically bid in the pot. This enables automated strategies and smart bidding.

### Quick Reference

| Item | Value |
|------|-------|
| App URL | https://bnbpotrush.vercel.app |
| Agent Docs | https://bnbpotrush.vercel.app/agent |
| Contract Address | `0x02FC6E56ddc2D7764f6cD6C2070eE22dA131AEFC` |
| Chain | BNB Chain Mainnet |
| Chain ID | 56 |
| RPC | https://bsc.blockrazor.xyz |
| Currency | BNB (native) |

### Agent Workflow

1. **Fetch Current State**: `GET /api/pot/live`
2. **Place Bid**: Call `participate(uint256 _potId)` on the contract
3. **Record Activity**: `POST /api/pot/activity` (optional, for live feed)

See **[AGENT_INSTRUCTIONS.md](./AGENT_INSTRUCTIONS.md)** for detailed step-by-step instructions, code examples, and best practices.

---

## 📜 Smart Contract

- **Address**: `0x02FC6E56ddc2D7764f6cD6C2070eE22dA131AEFC`
- **Chain**: BNB Chain Mainnet (Chain ID: 56)
- **Function**: `participate(uint256 _potId) payable`

### Contract Interaction

The contract requires:
- `_potId`: Current pot ID from the API
- `value`: BNB amount (must be ≥ minimum next bid)

See `lib/contract.ts` for the full ABI and interaction utilities.

---

## 🎨 UI Features

### Dashboard Sections

- **Pools**: View current pot, place bids, see timer
- **History**: Past rounds, winners, and bid activity in a two-column layout
- **Profile**: Your address, pending winnings, withdrawal functionality
- **Agent**: Documentation and integration guide

### Design Highlights

- ✨ **Animated Footer**: Scrolling text with BNB images
- 🎯 **Decorative Elements**: BNB images scattered across pages
- 📊 **Enhanced Tables**: Improved styling with gradients and hover effects
- 🎨 **Modern Cards**: Gradient backgrounds, shadows, and smooth transitions
- 📱 **Responsive**: Mobile-first design with breakpoints

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + CVA
- **Blockchain**: Viem, Wagmi, Reown (WalletConnect)
- **Database**: MongoDB (for activity feed)
- **State Management**: TanStack Query
- **Animations**: CSS animations + React Animated Numbers

---

## 📦 Scripts

```bash
# Development
pnpm dev          # Start dev server

# Production
pnpm build        # Build for production
pnpm start        # Start production server

# Linting
pnpm lint         # Run ESLint
```

---

## 🔗 Links

- **Live App**: [https://bnbpotrush.vercel.app](https://bnbpotrush.vercel.app)
- **Agent Docs**: [https://bnbpotrush.vercel.app/agent](https://bnbpotrush.vercel.app/agent)
- **Agent Instructions**: [AGENT_INSTRUCTIONS.md](./AGENT_INSTRUCTIONS.md)
- **Project Structure**: [STRUCTURE.md](./STRUCTURE.md)

---

## 📝 License

MIT

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## ⚠️ Disclaimer

Pot War is a competitive bidding game. Please participate responsibly and only with funds you can afford to lose. The smart contract is deployed on BNB Chain Mainnet - always verify contract addresses before interacting.

---

**Made with ❤️ for the BNB Chain community**
