# NFT MINTER

> Decentralized NFT marketplace on the Stellar network with automatic royalty splitting for creators.

**Live Demo:** https://nft-minter-seven-gamma.vercel.app

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/donendosted/NFT-MINTER)

---

## Screenshots

### Mobile Responsive View

![Mobile View](https://images.unsplash.com/photo-1618000775193-194f42c5b84f)

---

## Deployment

- **Frontend**: Auto-deployed to Vercel on every push to `main`
- **Backend**: Auto-deployed to Render on every push to `main`

### CI/CD Pipeline

[![CI/CD Pipeline](https://github.com/donendosted/NFT-MINTER/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/donendosted/NFT-MINTER/actions)

---

## Features

- **Browse NFTs** — Discover and filter NFTs listed on the marketplace
- **Mint NFTs** — Create new NFTs with custom names and images
- **List for Sale** — Set a price and list your NFT on the marketplace
- **Buy NFTs** — Purchase NFTs directly from other users
- **Automatic Royalties** — 10% royalty on every resale, split between creator (50%), stakers (30%), and treasury (20%)
- **Wallet Integration** — Connect via Freighter wallet (Stellar ecosystem)
- **Analytics Dashboard** — View volume charts, top sales, and market statistics
- **Mobile-First Design** — Fully responsive UI with bottom navigation

---

## Tech Stack

### Frontend

- **Next.js 14** — React framework with App Router
- **TypeScript** — Type-safe codebase
- **Tailwind CSS** — Utility-first styling
- **React Query** — Server state management & caching
- **Zustand** — Client-side wallet state
- **Recharts** — Analytics charts
- **Framer Motion** — Smooth animations

### Backend

- **Express.js** — REST API server
- **Prisma** + **PostgreSQL** — Relational data (users, NFTs, listings, sales)
- **JWT** — Authentication

### Blockchain

- **Stellar Testnet** — Soroban smart contracts
- **Freighter** — Wallet connection
- **@stellar/stellar-sdk** — Backend Horizon/RPC integration

---

## Smart Contracts (Soroban)

| Contract | Address (Testnet) |
|----------|-------------------|
| Payment Token | `CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC` |
| RoyaltyPool | `CA32HYDWNV25UIQK5VK5CCWSITNA3LQ4FSO7TCSRAPG22ZEB5NMDKYW6` |
| NFTCollection | `CCJBHSRDMMTLQ67RL2LH2RWHGQYUN5MKYBM7R43LYGIIIBXZ5NTTF2Z2` |
| Marketplace | `CATJUTMPLDEQY323QONFOZRTRQHLTEH5RTN52JUICTD52AT2TQD6JDYD` |

### User-Pays-Gas Model

The platform implements a **user-pays-gas** model where:

- **Users pay gas fees** for all operations (minting, listing, buying)
- **No admin secrets** are stored in the backend
- **Two-step transaction flow**:
  1. Backend builds unsigned transaction
  2. User signs with Freighter wallet and pays gas
  3. Backend submits signed transaction

This ensures users have full control over their transactions and gas spending.

### Royalty Split (10% of each sale)

| Recipient | Share |
|-----------|-------|
| Creator | 50% |
| Stakers | 30% |
| Treasury | 20% |

---

## Architecture

```
frontend/          Next.js 14 (Vercel)
backend/           Express API (Render)
postgresql/        PostgreSQL — users, NFTs, listings, sales
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (Neon/Render) or local Postgres
- Freighter wallet (browser extension)

### Backend Setup

```bash
cd backend
cp .env.example .env
# Fill in your DATABASE_URL and contract addresses
npm install
npx prisma db push
npm run dev
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev
```

### Environment Variables

**Backend (`backend/.env`):**

```
DATABASE_URL=           # PostgreSQL connection string
JWT_SECRET=           # Your JWT secret
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
NFT_COLLECTION_ID=    # Your NFT Collection contract ID
MARKETPLACE_ID=     # Your Marketplace contract ID
ROYALTY_POOL_ID=    # Your Royalty Pool contract ID
PAYMENT_TOKEN_ID=   # USDC or your token
```

**Frontend (`frontend/.env.local`):**

```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
NEXT_PUBLIC_NETWORK=testnet
```

---

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/nfts` | List all NFTs (filterable) |
| GET | `/nfts/owner/:address` | Get NFTs by owner |
| GET | `/nfts/:contract/:tokenId` | Get NFT details |
| POST | `/blockchain/mint/nft/build` | Build mint transaction (user signs) |
| POST | `/blockchain/mint/nft/submit` | Submit signed mint transaction |
| GET | `/listings` | List active listings |
| POST | `/listings` | Create a listing |
| DELETE | `/listings/:id` | Cancel a listing |
| GET | `/sales` | Recent sales |
| GET | `/royalties/:address` | Claimable royalties |
| GET | `/analytics/volume` | Volume analytics |
| GET | `/analytics/stats` | Market statistics |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Marketplace — browse & filter NFTs |
| `/my-nfts` | My NFTs — owned, listed, sold tabs |
| `/mint-soroban` | Mint NFTs on Soroban (user pays gas) |
| `/list-soroban` | List NFTs on Soroban marketplace |
| `/buy-soroban` | Buy NFTs on Soroban marketplace |
| `/royalties` | Claimable royalties & history |
| `/analytics` | Volume charts & top sales |
| `/nft/:contract/:tokenId` | NFT detail + buy |

---

## License

MIT
