# Apex NFT Bridge: Cross-Chain NFT Escrow & Lock-and-Mint Protocol

![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-blue)
![Hardhat](https://img.shields.io/badge/Framework-Hardhat-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

A non-custodial cross-chain **NFT Escrow & Lock-and-Unlock Bridge Protocol** designed for secure, tamper-proof digital asset migration across EVM networks.

---

## 🌟 Key Features

- **Non-Custodial Escrow Vault**: Verifiable locking of ERC-721 tokens into immutable smart contract escrow.
- **Strict Anti-Replay Protection**: Single-use 32-byte cryptographic nonce verification on release events.
- **Relayer Role Access Control**: Decoupled validator signing preventing unauthorized fund releases.

---

## 🚀 Quick Start

### 1. Installation

```bash
git clone https://github.com/tediousnonb/apex-nft-bridge.git
cd apex-nft-bridge
npm install
```

### 2. Compile & Test

```bash
npx hardhat compile
npx hardhat test
```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.
