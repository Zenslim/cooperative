# Wu-Wei Cooperative OS

A transparency-first cooperative management system built with Next.js and Supabase, embodying the Wu-Wei philosophy of effortless action through community oversight.

## Features

### Core Wu-Wei Principles

- **Open-Spend System**: Public spending feed with full transparency
- **Public Challenge Mechanism**: Four resolution paths (Justify, Equalize, Refund, Improve)
- **Append-Only Truth**: Immutable audit trail with cryptographic hashing
- **Three Tiny Locks**: 
  - Proposal-Spend Link (every spend must reference a proposal)
  - Two-Person Rule (dual approval required)
  - No Private Payees (all vendors publicly verified)

### Sunlight Dials Dashboard

Physics-based indicators showing system health:
- **Posting Delay**: How quickly actions become public (target: <3 minutes)
- **Reversal Rate**: Percentage of corrections (healthy if low but not zero)
- **Recon Coverage**: Bank reconciliation coverage (target: >90%)
- **Orphan Spends**: Must be 0 (enforced by Three Tiny Locks)
- **Challenges Resolved**: Community oversight effectiveness
- **Equalized to Commons**: Money returned from challenges

### Bilingual Support

- Full English/Nepali internationalization
- Bilingual routing: `/en/open-spend` and `/np/खुल्ला-खर्च`
- Cultural localization
- User language preferences stored in database

### Role-Based Interfaces

- **Farmer**: Simple spending submission and tracking
- **Storekeeper**: Inventory and procurement management
- **CEO/Accountant**: Approval and confirmation (two-person rule)
- **Investor**: Financial transparency and ROI tracking
- **Auditor**: Complete system transparency and verification

## Technology Stack

- **Frontend**: Next.js 16 with TypeScript
- **Backend**: Supabase (PostgreSQL, Edge Functions, Storage)
- **Styling**: Tailwind CSS
- **i18n**: next-intl
- **Icons**: Lucide React
- **Real-time**: Supabase Subscriptions

## Database Schema

### Tables (10)
- `profiles`: Users with roles and language preferences
- `proposals`: All spends must link to approved proposals
- `open_spends`: Main spending feed with bilingual content
- `challenges`: Public challenge mechanism with resolution tracking
- `challenge_votes`: Community voting system
- `audit_trail`: Append-only history with transaction hashes
- `public_proofs`: Nightly cryptographic verification
- `sunlight_metrics`: Dashboard health indicators
- `payees`: Public vendor verification
- `notifications`: Real-time updates

### Edge Functions (6)
- `upload-receipt`: Receipt upload with SHA-256 integrity hash
- `submit-spend`: Create spend with automatic audit trail
- `create-challenge`: Public challenge mechanism
- `resolve-challenge`: Four resolution paths
- `calculate-metrics`: Sunlight dials calculation (cron)
- `generate-nightly-proof`: Daily cryptographic proof (cron)

### Storage
- `receipts` bucket: Public access, 10MB limit, supports images and PDFs

## Getting Started

```bash
# Run development server
pnpm dev

# Open http://localhost:3000
```

## Environment

Copy `.env.example` to `.env.local` and provide your Supabase project credentials before starting the development server:

```bash
cp .env.example .env.local
# then edit .env.local with your Supabase URL and anon key
```

The app will raise a descriptive error during startup if the credentials are missing, preventing silent hydration failures.

## Philosophy

The Wu-Wei Cooperative OS replaces traditional hierarchical management with transparent, collaborative decision-making. It's not about building a smarter boss, but a more perceptive and empowering partner that:

- Makes truth visible so manipulation becomes pointless
- Provides effortless oversight through community eyes
- Prevents disputes through clear, simple processes
- Builds trust through consistent, honest interfaces

## Wu-Wei in Practice

- **No heavy rules**: Instead, make truth visible and mistakes easy to fix
- **Manipulation prevention**: When reality is transparent, manipulation becomes pointless
- **Community oversight**: The "eyes" of the community keep the system honest
- **Dispute prevention**: Clear processes prevent conflicts from starting

## Deployment

This Next.js application can be deployed to Vercel, Netlify, or any platform supporting Next.js applications. Requires Node.js 20+ for production builds.

## License

Built for communities to adopt and use freely.
