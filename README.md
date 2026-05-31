# Valen - Prediction Social Network

Valen is a premium social network where credibility is the core currency. Users post predictions about the future, build reputations based on their accuracy, and interact in a real-time social ecosystem.

## Core Features

- **Algorithmic Feed:** Real-time, ranked prediction feed based on interests and credibility.
- **Reputation Engine:** Automated Trust Score, Rank (Rookie to Grand Oracle), and Streak tracking.
- **Social Interactions:** Support/Oppose voting, threaded comments, and a follow system.
- **Communities:** Category-specific spaces (AI, Tech, Finance, etc.) with dedicated leaderboards.
- **Real-Time Infrastructure:** Socket.io integration for instant updates on votes, comments, and messages.
- **Analytics:** Personal performance dashboards with accuracy and growth visualizations.
- **Messaging:** Secure 1-to-1 real-time chat.
- **PWA Ready:** Installable on mobile with offline caching capabilities.

## Tech Stack

- **Frontend:** Next.js 15+, TypeScript, Tailwind CSS, Framer Motion, Lucide React.
- **Backend:** Next.js API Routes, NextAuth.js (JWT), Socket.io.
- **Database:** Prisma ORM, PostgreSQL (Neon/Supabase) or SQLite for local development.
- **State/Data:** Chart.js for analytics, React Intersection Observer for infinite scrolling.

## Getting Started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (or use local SQLite)

### Installation

1.  Clone the repository and install dependencies:
    ```bash
    npm install
    ```

2.  Set up your environment variables:
    Create a `.env` file in the root directory:
    ```env
    DATABASE_URL="file:./dev.db" # Or your PostgreSQL URL
    NEXTAUTH_SECRET="your-secret-here"
    NEXTAUTH_URL="http://localhost:3000"
    ```

3.  Initialize the database:
    ```bash
    npx prisma db push
    ```

4.  Run the development server:
    ```bash
    npm run dev
    ```

### Production Deployment

Valen is designed to be deployed on **Vercel**.

1.  Connect your repository to Vercel.
2.  Set up a PostgreSQL database on **Neon** or **Supabase**.
3.  Update the `DATABASE_URL` in your Vercel project settings to point to your PostgreSQL instance.
4.  Vercel will automatically build and deploy the application.

## Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable React components (UI, Prediction cards, etc.).
- `src/lib`: Core logic (Auth, Prisma client, Reputation engine).
- `src/types`: TypeScript definitions and NextAuth extensions.
- `prisma/`: Database schema and migrations.
- `public/`: Static assets and PWA configuration (manifest, service worker).

## Security

- Role-Based Access Control (RBAC) for Admin features.
- Ownership verification for prediction resolutions.
- Secure password hashing with bcrypt.
- JWT-based session management.
