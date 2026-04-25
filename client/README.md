# Veda’s Vision Client

## Setup

```bash
cd client
npm install
```

## Environment

Create a `.env` file in `client/` with these values:

```env
VITE_API_BASE=http://localhost:4000
```

## Run locally

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

Deploy the `dist/` directory to Netlify, Vercel, or any static hosting provider. Ensure `VITE_API_BASE` points to your deployed backend API.
