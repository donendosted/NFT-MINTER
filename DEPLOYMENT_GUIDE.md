# NFT Bazar Contract Deployment Guide for Stellar Testnet

This guide walks you through deploying the three Soroban contracts (NFT Collection, Royalty Pool, Marketplace) to the Stellar testnet.

## Prerequisites

- Rust 1.81+ (we recommend using rustup)
- Stellar CLI installed (https://github.com/stellar/stellar-cli)
- Access to the internet to fund accounts via Friendbot
- An account on Stellar testnet (we'll create and fund one)

## Overview

We will deploy three contracts:
1. NFT Collection Contract
2. Royalty Pool Contract  
3. Marketplace Contract

Each contract deployment follows the same pattern:
- Build the contract to produce a WASM file
- Deploy the WASM to Stellar testnet using the Stellar CLI
- Record the Contract ID for later use in the backend configuration

## Step 1: Install Dependencies

If you haven't already installed Rust and the Stellar CLI:

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"

# Install Stellar CLI (macOS/Linux)
brew install stellar-cli  # macOS with Homebrew
# Or download from: https://github.com/stellar/stellar-cli/releases

# Verify installations
rustc --version
stellar --version
```

## Step 2: Create and Fund a Testnet Account

We need a funded account to pay for deployment fees. We'll use the Stellar testnet Friendbot.

```bash
# Generate a new key pair
stellar keys generate
# Output will show:
#   Secret Key: SA...
#   Public Key: GA...

# Save these values securely. We'll use them in the next steps.

# Fund the account using Friendbot (replace <PUBLIC_KEY> with your actual public key)
curl "https://friendbot.stellar.org?addr=<PUBLIC_KEY>"

# Check the account balance to confirm funding
stellar account <PUBLIC_KEY>
```

> **Note**: The Friendbot dispenses 10,000 test XLM, which is more than enough for contract deployment.

## Step 3: Set Environment Variables

To make the deployment commands easier, set these environment variables:

```bash
export ADMIN_SECRET_KEY="<YOUR_SECRET_KEY>"   # From step 2
export ADMIN_PUBLIC_KEY="<YOUR_PUBLIC_KEY>"   # From step 2
export NETWORK="testnet"
```

## Step 4: Deploy NFT Collection Contract

```bash
# Navigate to the NFT collection contract directory
cd contracts/nft_collection

# Build the contract for Soroban
cargo build --target wasm32v1-none --release

# Deploy the contract
stellar contract deploy \
  --wasm target/wasm32v1-none/release/nft_collection.wasm \
  --source-account $ADMIN_SECRET_KEY \
  --network $NETWORK

# After deployment, you'll see output like:
#   ✅ Successfully deployed contract
#   Contract ID: CB... (a string starting with 'C')

# Save the Contract ID for later use
export NFT_COLLECTION_ID="<CONTRACT_ID_FROM_OUTPUT>"
```

## Step 5: Deploy Royalty Pool Contract

```bash
# Navigate to the royalty pool contract directory
cd ../royalty_pool

# Build the contract
cargo build --target wasm32v1-none --release

# Deploy the contract
stellar contract deploy \
  --wasm target/wasm32v1-none/release/royalty_pool.wasm \
  --source-account $ADMIN_SECRET_KEY \
  --network $NETWORK

# Save the Contract ID
export ROYALTY_POOL_ID="<CONTRACT_ID_FROM_OUTPUT>"
```

## Step 6: Deploy Marketplace Contract

```bash
# Navigate to the marketplace contract directory
cd ../marketplace

# Build the contract
cargo build --target wasm32v1-none --release

# Deploy the contract
stellar contract deploy \
  --wasm target/wasm32v1-none/release/marketplace.wasm \
  --source-account $ADMIN_SECRET_KEY \
  --network $NETWORK

# Save the Contract ID
export MARKETPLACE_ID="<CONTRACT_ID_FROM_OUTPUT>"
```

## Step 7: Update Backend Configuration

Create a `.env` file in the `backend` directory (or update the existing one) with the following:

```env
# Stellar Configuration
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
STELLAR_RPC_URL=https://soroban-testnet.stellar.org

# Contract Addresses (from the deployment steps above)
NFT_COLLECTION_ID=<NFT_COLLECTION_ID>
ROYALTY_POOL_ID=<ROYALTY_POOL_ID>
MARKETPLACE_ID=<MARKETPLACE_ID>
PAYMENT_TOKEN_ID=<PAYMENT_TOKEN_ID>  # We'll deploy this next if needed

# Other Configuration (fill in as needed)
DATABASE_URL=your_postgresql_connection_string
MONGODB_URI=your_mongodb_connection_string
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
JWT_SECRET=your_jwt_secret
PORT=3000
```

> **Note**: The `PAYMENT_TOKEN_ID` is for the Stellar asset used as payment. If you need to create a custom token, you would issue one on the Stellar network. For now, you can use a existing testnet asset like USDC (GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5) or create your own.

## Step 8: (Optional) Create Payment Token

If you need to create a custom payment token for testing:

```bash
# Issue a new asset (requires the admin account to be the issuer)
stellar token issue \
  --source $ADMIN_SECRET_KEY \
  --asset-code "TKN" \
  --asset-issuer $ADMIN_PUBLIC_KEY \
  --amount 10000000 \
  --network $NETWORK

# The asset code and issuer together define the asset.
# In the backend, you would set PAYMENT_TOKEN_ID to the asset code + issuer? 
# Actually, in Stellar, assets are identified by (code, issuer). 
# The contract expects a contract ID for a Stellar Asset Contract (if using Soroban token standard).
# For simplicity, you can use the native XLM (which doesn't have a contract ID) or issue a Soroban token.

# For this project, the payment token is expected to be a Soroban token contract.
# You would need to deploy the Soroban token contract standard (not covered in this guide).
# As an alternative, you can use the native XLM and adjust the contracts accordingly, but that requires contract changes.
```

## Step 9: Start the Application

```bash
# Backend
cd ../../backend
npm install
npm run dev

# Frontend (in another terminal)
cd ../frontend
npm install
npm run dev
```

## Verification

After deployment, you can verify the contracts on Stellar Expert:
- https://stellar.expert/explorer/testnet/contract/<CONTRACT_ID>

Replace `<CONTRACT_ID>` with each contract's ID.

## Troubleshooting

**Error: Command 'stellar' not found**
- Ensure the Stellar CLI is installed and in your PATH.

**Error: Insufficient balance for fees**
- Re-fund your account with Friendbot: `curl "https://friendbot.stellar.org?addr=<PUBLIC_KEY>"`

**Error: WASM file not found**
- Ensure you built the contract with `cargo build --target wasm32v1-none --release`

**Error: Transaction failed**
- Check the transaction details on Stellar Expert for more information.
- Ensure your account has permission to invoke the contract (you set the admin as the source).

**Network issues**
- Verify your internet connection.
- Stellar testnet endpoints might be temporarily unavailable; try again later.

## Important Security Notes

- Never commit your secret keys to version control.
- The `.env` file should be added to `.gitignore`.
- For production, use a secure secrets management system.

## Recently Deployed Contracts (for reference)

Based on the latest deployment:
- NFT Collection: CCJBHSRDMMTLQ67RL2LH2RWHGQYUN5MKYBM7R43LYGIIIBXZ5NTTF2Z2
- Royalty Pool: CA32HYDWNV25UIQK5VK5CCWSITNA3LQ4FSO7TCSRAPG22ZEB5NMDKYW6
- Marketplace: CATJUTMPLDEQY323QONFOZRTRQHLTEH5RTN52JUICTD52AT2TQD6JDYD
