# Foodio Mobile App

Expo Router mobile app for Foodio — food ordering and delivery.

## Tech Stack

- Expo SDK 54 + Expo Router
- Zustand, TanStack Query, NativeWind
- Stripe (`@stripe/stripe-react-native`), react-native-maps, Socket.IO client

## Setup

```bash
cp .env.example .env
npm install
npx expo start
```

## Environment

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Backend REST API base URL |
| `EXPO_PUBLIC_SOCKET_URL` | Socket.IO server URL |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (required for card payments) |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps API key (Android + iOS Google Maps) |

**Simulator:** `EXPO_PUBLIC_API_URL=http://localhost:3001/api/v1`  
**Physical device:** use your machine's LAN IP instead of `localhost`.

### Stripe (card payments)

1. Add your Stripe publishable key to `.env`:
   ```
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
2. Configure `STRIPE_SECRET_KEY` in `foodio-backend/.env`.
3. Card checkout opens the Stripe Payment Sheet after the order is created.
4. COD and UPI do not require Stripe.

> **Expo Go:** SDK 54 works with the App Store version of Expo Go. Stripe and maps still require a development build for full native support.

### Maps (order tracking)

1. Enable **Maps SDK for Android** and **Maps SDK for iOS** in Google Cloud Console.
2. Add `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` to `.env`.
3. Rebuild the native app so `app.config.ts` injects the key:
   ```bash
   npx expo prebuild
   npx expo run:ios   # or run:android
   ```

iOS uses Apple Maps by default when no Google key is set. Android uses Google Maps when the key is configured.

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run typecheck` | TypeScript check |
| `npm test` | Run Jest unit tests |

## Deep Links

- `foodio://restaurant/:id` → restaurant detail
- `foodio://order/:id` → order tracking

## Project Structure

```
app/          # Expo Router screens
src/
  components/ # UI + feature components
  hooks/      # TanStack Query + Stripe hooks
  stores/     # Zustand stores
  services/   # API client + Socket.IO
  types/      # TypeScript types
  constants/  # Design tokens + config
  utils/      # Pure utility functions
```

## Test Credentials

After seeding the backend: `user@foodio.app` / `Password123!`
