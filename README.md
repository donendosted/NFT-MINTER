# NFT Bazar - Decentralized NFT Marketplace

A decentralized NFT marketplace on the Stellar network with automatic royalty splitting for creators.

## Overview

This repository contains the NFT Bazar application with:
- **Frontend**: Next.js 14 application
- **Backend**: Express.js API server
- **Contracts**: Soroban smart contracts on Stellar blockchain
- **CI/CD**: GitHub Actions pipeline for automated testing, building, and deployment

## Repository Structure

```
NFT_BAZAR/
├── backend/              # Express.js backend API
├── frontend/             # Next.js 14 frontend application
├── contracts/            # Soroban smart contracts (Rust)
│   ├── nft_collection/   # NFT collection contract
│   ├── royalty_pool/     # Royalty distribution contract
│   └── marketplace/      # NFT marketplace contract
├── .github/              # GitHub Actions workflows
│   └── workflows/
│       └── ci-cd.yml     # CI/CD pipeline definition
├── backend/.env.example  # Backend environment variables template
├── frontend/.env.example # Frontend environment variables template
└── DEPLOYMENT_GUIDE.md   # Detailed contract deployment instructions
```

## Setup Instructions

### 1. Environment Configuration

Copy the example environment files and fill in your values:

```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your actual values

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your actual values
```

### 2. Contract Deployment

Before running the application, you need to deploy the Soroban contracts to Stellar testnet:

1. Follow the detailed instructions in `DEPLOYMENT_GUIDE.md`
2. Update the contract IDs in `backend/.env` with your deployed contract addresses:
   - `NFT_COLLECTION_ID`
   - `MARKETPLACE_ID`
   - `ROYALTY_POOL_ID`
   - `PAYMENT_TOKEN_ID`

### 3. Local Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## CI/CD Pipeline

This repository includes a GitHub Actions workflow that automates:

1. **Testing**: Runs backend and frontend tests on push/pull request
2. **Building**: Creates Docker images for backend and frontend
3. **Deployment**: 
   - Backend deployed to Render
   - Frontend deployed to Vercel

### Required Secrets

To enable the CI/CD pipeline, add these secrets to your GitHub repository:

- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password or access token
- `RENDER_API_KEY`: Render API key
- `RENDER_BACKEND_SERVICE_ID`: Your backend service ID on Render
- `VERCEL_TOKEN`: Vercel access token
- `VERCEL_ORG_ID`: Vercel organization ID
- `VERCEL_PROJECT_ID`: Vercel project ID

## API Endpoints

### Soroban Mint Routes
- `POST /soroban/mint/build` - Build unsigned mint transaction
- `POST /soroban/mint/submit` - Submit signed mint transaction

### Soroban Marketplace Routes
- `POST /soroban/marketplace/list/build` - Build unsigned list transaction
- `POST /soroban/marketplace/list/submit` - Submit signed list transaction
- `POST /soroban/marketplace/buy/build` - Build unsigned buy transaction
- `POST /soroban/marketplace/buy/submit` - Submit signed buy transaction

## License

MIT License

## Acknowledgments

- Built on Stellar Soroban smart contracts
- Uses Next.js 14 with App Router
- Freighter wallet for Stellar connectivity
