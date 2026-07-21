# Sella — Frontend

Angular frontend for **Sella**, a platform for organizing and managing online raffles ("rifas"). Organizers create raffles and track buyers and payments; buyers pick a number, upload a payment receipt, and follow its status.

Live app: **[sella-frontend.vercel.app](https://sella-frontend.vercel.app)**
Backend repo: [SellaBackend](https://github.com/JonathanCastro07/SellaBackend) (Spring Boot API, deployed on Render)

## Features

- **JWT-based authentication** — login persists the token and attaches it to every API request via an HTTP interceptor
- **Route guards** protecting organizer-only pages
- **Organizer dashboard**: create raffles, view all owned raffles, review buyers and uploaded payment receipts per raffle, manage contacts
- **Public raffle board**: buyers view available numbers and reserve one without needing an account
- Fully decoupled from the backend via a configurable `apiUrl` per environment

## Tech Stack

Angular 21 · TypeScript · RxJS · Vitest (unit tests) · Vercel (hosting)

## Project Structure

```
src/app/
├── components/
│   ├── login/                 # Organizer login
│   ├── crear-rifa/            # Create a new raffle
│   ├── mis-rifas/             # Organizer's raffle list
│   ├── panel-organizador/     # Organizer view: buyers, receipts, payment status
│   ├── tablero-rifa/          # Public board: pick and reserve a number
│   └── contactos-rifa/        # Buyer contact management
├── services/
│   ├── auth.ts                # Login/session handling
│   └── rifa.ts                # Raffle/number API calls
├── guards/
│   └── auth-guard.ts          # Protects organizer routes
├── interceptors/
│   └── jwt-interceptor.ts     # Attaches the JWT to outgoing requests
└── models/                    # TypeScript interfaces mirroring the API DTOs
```

## Running locally

### Prerequisites

- Node.js 18+
- The [SellaBackend](https://github.com/JonathanCastro07/SellaBackend) API running locally (or point `environment.ts` at a deployed instance)

### Setup

```bash
npm install
ng serve
```

The app runs at `http://localhost:4200` and expects the API at `http://localhost:8080/api` (see `src/environments/environment.ts`).

### Build for production

```bash
ng build
```

Production builds read the API URL from `src/environments/environment.prod.ts`.

### Run tests

```bash
ng test
