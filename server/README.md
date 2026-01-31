# Carvo - Vehicle Customization System Backend

## Overview
This is the backend for the Carvo Vehicle Customization System. It provides APIs for users, admins, sellers, service providers, and delivery agents to manage the vehicle customization lifecycle.

## Tech Stack
- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MySQL (TypeORM)
- **Caching**: Redis (optional for now)
- **Containerization**: Docker & Docker Compose

## Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- MySQL (if running locally without Docker)

## Setup Instructions

### 1. Clone the repository
\`\`\`bash
git clone <repo-url>
cd Carvo/server
\`\`\`

### 2. Environment Variables
Copy `.env.example` to `.env` and update the values if necessary.
\`\`\`bash
cp .env.example .env
\`\`\`

### 3. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 4. Run with Docker (Recommended)
\`\`\`bash
docker-compose up -d
\`\`\`

### 5. Run Locally (Dev Mode)
Ensure MySQL is running and configured in `.env`.
\`\`\`bash
npm run dev
\`\`\`

### 6. Database Migration & Seeding
To initialize the database schema and seed data:
\`\`\`bash
# Run migrations (if not using synchronize: true)
npx typeorm-ts-node-commonjs migration:run -d src/config/data-source.ts

# Seed data
npx ts-node src/scripts/seed.ts
\`\`\`

## API Documentation
The API provides endpoints for:
- **Auth**: `/auth/signup`, `/auth/login`
- **Admin**: `/admin/users`, `/admin/cars`, `/admin/analytics`
- **Customer**: `/customer/cars`, `/customer/customizations`, `/orders`
- **Seller**: `/seller/parts`, `/seller/orders`
- **Provider**: `/provider/bookings`
- **Delivery**: `/delivery/assignments`
- **Support**: `/support`

## Testing
Run unit tests (placeholder):
\`\`\`bash
npm test
\`\`\`

## Deployment
1. Build the Docker image:
   \`\`\`bash
   docker build -t carvo-backend .
   \`\`\`
2. Deploy using Docker Compose or a container orchestrator.
3. Ensure environment variables are set in the production environment.
