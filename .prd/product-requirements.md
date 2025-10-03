# DepositLock — Unified Product Requirements Document

## 🎯 Project Overview

**DepositLock** is a **mobile-first, Web3 escrow application** that enables secure deposit management through blockchain smart contracts. The platform serves rental scenarios (apartments, equipment, services) by allowing creators to request deposits and depositors to securely lock funds until predetermined conditions are met.

### 🎭 Target Users
- **Creators**: Landlords, service providers, equipment renters who need secure deposits
- **Depositors**: Tenants, customers, renters who need transparent fund protection
- **Early Web3 adopters** seeking practical blockchain utility applications

---

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + Shadcn/UI components  
- **State Management**: React Context + Zustand (where needed)
- **Web3 Integration**: Ethers.js v6 + Web3Modal v3
- **Hosting**: Vercel with CI/CD

### Blockchain Infrastructure
- **Development**: Polygon Amoy Testnet (POL token)
- **Production**: Polygon Mainnet + additional EVM networks
- **Smart Contract**: Solidity ^0.8.20
- **Multi-wallet Support**: MetaMask, WalletConnect, OKX, Binance Web3, BitGet

### Project Structure
```
apps/next/depositlock-website/
├── app/                           # Next.js App Router
│   ├── (home)/                   # SEO-friendly public pages
│   ├── (app)/                    # SPA routes (noindex)
│   │   ├── creator/              # Creator flow
│   │   ├── depositor/            # Depositor flow  
│   │   └── dashboard/            # User dashboard
├── lib/features/                 # Feature-driven components
├── contracts/                    # Smart contracts
└── .prd/                        # Product requirements
```

---

## 🔐 Smart Contract Specification

### Current Implementation (`Escrow.sol`)

```solidity
contract Escrow {
    address public creator;        // Contract initiator
    address public depositor;      // First person to deposit (set dynamically)
    uint256 public amount;         // Required deposit amount
    uint256 public deadline;       // Release deadline (timestamp)
    string public title;           // Agreement title (on-chain)
    string public description;     // Agreement description (on-chain)
    enum Status { Created, Filled, Released, Disputed, Canceled }
    Status public status;
}
```

### Key Functions
- `constructor(amount, deadline, title, description)` - Creates new escrow
- `deposit()` - **Open access**: First depositor gets assigned automatically
- `release()` - Releases funds to depositor after deadline
- **Status Flow**: Created → Deposited → Released

### Current Limitations (Post-MVP Features)
- No partial refund capability  (Disputes to be refuned fully in MVP)
- Manual release only (no automation)
- Single depositor per contract

---

## 📱 User Flow Implementation

### 🔵 Creator Flow (Implemented)
```
Home → /creator → Form (Title, Description, Amount, Deadline) 
  → Deploy Contract → Share Link → Dashboard Monitoring
```

**Features**:
- ✅ Stepper UI with form validation
- ✅ Real contract deployment to Polygon Amoy
- ✅ Network-aware currency selection (POL for Amoy)
- ✅ Contract address sharing and copying
- ✅ Dashboard contract tracking

### 🟢 Depositor Flow (Implemented)  
```
Shared Link → /depositor/[contractId] → View Details 
  → Connect Wallet → Deposit Funds → Confirmation
```

**Features**:
- ✅ Contract details display with real blockchain data
- ✅ Multi-wallet connection support
- ✅ Amount validation and network checking
- ✅ Transaction confirmation and status updates
- ✅ Open access (no pre-specified depositor required)

### 🟡 Dashboard Flow (Implemented)
```  
/dashboard → View All Contracts → Filter by Role 
  → View Individual Contracts → Track Status
```

**Features**:
- ✅ Creator and Depositor contract separation
- ✅ Real-time status tracking from blockchain
- ✅ Contract management and viewing

---

## 🎨 UI/UX Implementation Status

### ✅ Completed Components
- **Homepage**: SEO-optimized with clear CTAs
- **Creator Form**: Multi-step stepper with validation
- **Contract Viewer**: Real blockchain data display
- **Dashboard**: Role-based contract management
- **Wallet Integration**: Multi-wallet support via Web3Modal
- **Responsive Design**: Mobile-first Tailwind implementation

### 🔧 Current UI Architecture
- **Layout Strategy**: 
  - `(home)` - Public SEO pages with header/footer
  - `(app)` - Private SPA routes with role-specific headers
- **Design System**: Tailwind + custom deposit-lock theme
- **Components**: Shadcn/UI base with custom Web3 components

---

## 🚀 MVP Scope & Status

### ✅ Core Features (Completed)
- [x] **Contract Creation**: Real smart contract deployment
- [x] **Open Access Deposits**: Anyone can fill deposit via shared link
- [x] **Multi-network Support**: Dynamic currency based on network
- [x] **Wallet Integration**: Web3Modal with multiple wallet support
- [x] **Real-time Status**: Blockchain data fetching and display
- [x] **Responsive UI**: Mobile-first design implementation
- [x] **Dashboard Management**: Contract tracking by user role

### 🔄 In Progress
- [ ] **Connect Wallet Component**: Unified header wallet component
- [ ] **Route Consolidation**: Change `/depositor/[id]` to `/contract/[id]`  
- [ ] **Mode Detection**: Creator vs Depositor mode based on wallet address
- [ ] **Basic Dispute Handling**: Flag and resolve disagreements (Only resolve 100% of funds in MVP)
- [ ] **Release Functionality**: Manual fund release after deadline

### 📋 Post-MVP Features (Planned)
- [ ] **Enhanced Dispute Handling**: Flag and resolve disagreements (Only resolve 100% of funds in MVP)
- [ ] **Partial Release**: Split deposit between parties
- [ ] **Auto-release**: Chainlink Automation integration
- [ ] **Multi-chain Deployment**: Polygon Mainnet + other EVM chains
- [ ] **PWA Support**: Service worker and app manifest
- [ ] **Enhanced UX**: Email notifications, QR sharing

---

## 🔧 Development Environment

### Current Setup
- **Local Development**: Hardhat for contract compilation
- **Network**: Polygon Amoy Testnet (Chain ID: 80002)
- **RPC**: Public Polygon Amoy RPC
- **Currency**: POL token (Polygon testnet token)
- **Contract Compilation**: Hardhat + TypeScript artifacts

### Environment Variables
```bash
NEXT_PUBLIC_WC_PROJECT_ID=         # WalletConnect Project ID
NEXT_PUBLIC_RPC_AMOY=              # Polygon Amoy RPC URL  
NEXT_PUBLIC_CONTRACT_ADDRESS=      # (Optional) Default contract
```

---

## 🎯 Success Metrics (MVP)

### Technical KPIs
- ✅ **Contract Deployment**: Successful real contract creation
- ✅ **Deposit Success Rate**: Functional deposit mechanism  
- ✅ **Multi-wallet Support**: Web3Modal integration working
- ✅ **Mobile Responsiveness**: Clean mobile-first UI

### User Experience KPIs
- **Creator Flow Completion**: Form → Deploy → Share success rate
- **Depositor Flow Completion**: Link → Connect → Deposit success rate  
- **Cross-device Compatibility**: Desktop and mobile usage
- **Load Performance**: Fast blockchain data fetching

---

## 🛠️ Implementation Roadmap

### Phase 1: MVP Completion (Current)
1. **UI Polish**: Complete wallet component and routing updates
2. **Release Mechanism**: Implement manual fund release
3. **Testing**: Comprehensive flow testing on Amoy testnet
4. **Documentation**: User guides and technical docs

### Phase 2: Production Ready
1. **Mainnet Deployment**: Polygon mainnet contract deployment
2. **Multi-chain Support**: Expand to additional EVM networks
3. **Security Audit**: Smart contract security review
4. **Performance Optimization**: Frontend and blockchain interaction optimization

### Phase 3: Advanced Features  
1. **Dispute System**: On-chain dispute flagging and resolution
2. **Partial Refunds**: Split deposit functionality
3. **Automation**: Chainlink integration for auto-release
4. **Enhanced UX**: PWA, notifications, advanced sharing

---

## 📝 Notes & Constraints

### Technical Decisions Made
- **Open Access Deposits**: Removed hardcoded depositor addresses for flexibility
- **Individual Contracts**: Each agreement is a separate deployed contract
- **Manual Release First**: Keeping MVP simple before automation
- **Feature-driven Architecture**: Organized by user flows rather than technical layers

### Known Limitations
- **Gas Costs**: Individual contract deployment requires gas fees
- **Testnet Only**: Currently limited to Polygon Amoy for development
- **Basic Dispute Handling**: Only 100% dispute release in MVP
- **Manual Processes**: No automated release or notifications yet

### Future Considerations
- **Factory Pattern**: Consider contract factory for gas optimization
- **Layer 2 Integration**: Explore cheaper alternatives for deployment
- **Legal Framework**: Terms of service and partial dispute resolution mechanisms
- **Internationalization**: Multi-language support for global adoption

---

This unified PRD reflects the current implementation status while maintaining clear direction for future development phases.