# Welcome Contract - Hardhat Environment

This project demonstrates how to develop, test, and deploy the Welcome smart contract using Hardhat.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile Contracts
```bash
npm run compile
```

### 3. Run Tests
```bash
npm run test
```

### 4. Deploy Contract
```bash
npm run deploy
```

## 📁 Project Structure

```
├── contracts/          # Solidity smart contracts
│   └── Welcome.sol    # Welcome contract
├── scripts/            # Deployment and utility scripts
│   └── deploy.ts      # Contract deployment script
├── test/               # Test files
│   └── Welcome.test.ts # Contract tests
├── hardhat.config.ts   # Hardhat configuration
└── package.json        # Dependencies and scripts
```

## 🧪 Testing

The test suite covers:
- ✅ Contract deployment
- ✅ Greeting functionality (get/set)
- ✅ Multiple greeting updates
- ✅ Edge cases (empty strings, special characters)
- ✅ Gas optimization
- ✅ Access control

Run tests with:
```bash
npm run test
```

## 🚀 Deployment

### Local Development
1. Start local Hardhat node:
   ```bash
   npm run node
   ```

2. In another terminal, deploy the contract:
   ```bash
   npm run deploy
   ```

### Interact with Contract
1. Start Hardhat console:
   ```bash
   npm run console
   ```

2. Example interactions:
   ```javascript
   // Get the deployed contract
   const Welcome = await ethers.getContractFactory("Welcome");
   const welcome = await Welcome.attach("CONTRACT_ADDRESS");
   
   // Get current greeting
   await welcome.getGreeting();
   
   // Set new greeting
   await welcome.setGreeting("Hello from console!");
   ```

## ⚙️ Configuration

The `hardhat.config.ts` includes:
- Solidity compiler version 0.8.19
- Optimizer enabled for gas efficiency
- Local network configuration (chainId: 1337)
- TypeScript support
- Testing framework (Mocha + Chai)

## 🔧 Available Commands

| Command | Description |
|---------|-------------|
| `npm run compile` | Compile all contracts |
| `npm run test` | Run all tests |
| `npm run deploy` | Deploy contract to local network |
| `npm run node` | Start local Hardhat network |
| `npm run console` | Open Hardhat console |
| `npm run clean` | Clean build artifacts |

## 📚 Contract Details

### Welcome.sol
A simple smart contract that stores and manages a greeting message.

**Functions:**
- `constructor(string memory _greeting)` - Sets initial greeting
- `setGreeting(string memory _greeting)` - Updates the greeting
- `getGreeting()` - Returns current greeting

**Features:**
- Public access to all functions
- String storage and retrieval
- Gas-optimized operations

## 🐛 Troubleshooting

### Common Issues

1. **TypeScript errors**: Run `npm run compile` first to generate type definitions
2. **Test failures**: Ensure all dependencies are installed with `npm install`
3. **Deployment issues**: Check that local node is running with `npm run node`

### Reset Environment
```bash
npm run clean
npm run compile
```

## 🔗 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Solidity Documentation](https://docs.soliditylang.org/)
- [Ethers.js Documentation](https://docs.ethers.org/)

## 📝 License

MIT License - see LICENSE file for details
