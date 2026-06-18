# Foodio Mobile — Cursor Rules

> Adapted from the project architecture prompt. Backend is **Express + MongoDB** (not Supabase).

## Backend Integration

- All API calls go through `src/services/` — never call `fetch` directly from components.
- Use `src/services/apiClient.ts` for REST requests to `foodio-backend` at `EXPO_PUBLIC_API_URL`.
- Realtime order tracking uses Socket.IO client at `EXPO_PUBLIC_SOCKET_URL` (namespace `/orders`).
- Unwrap `ApiResponse<T>.data` from every TanStack Query `queryFn`.
- JWT access token in `Authorization: Bearer` header; refresh via `/auth/refresh`.

## Environment Variables

```env
EXPO_PUBLIC_API_URL=http://localhost:3001/api/v1
EXPO_PUBLIC_SOCKET_URL=http://localhost:3001
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=
```

## State Management

1. **Zustand** — cart, auth session, delivery address (client-only).
2. **TanStack Query** — restaurants, menus, orders (server data).
3. Never store server data in Zustand. Never store cart/UI state in React Query.
4. Cart persists via `zustand/middleware` `persist` + AsyncStorage.

## Key Conventions

- Import colors, typography, spacing from `src/constants/` — never hardcode.
- Named exports for components; default export only for Expo Router screens.
- `Pressable` with 8pt `hitSlop`; `expo-image` for all images.
- Reanimated v3 for animations — never core `Animated`.
- Deep links: `foodio://restaurant/:id`, `foodio://order/:id`
- Stripe: `StripeProvider` in `AppProviders`; card checkout via `useStripePayment` + Payment Sheet.
- Maps: `TrackingMap` uses `react-native-maps`; configure `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` and native rebuild.
- Socket.IO connects on auth in `AppProviders`; order tracking via `useOrderTracking`.

See [`foodio-cursor-architecture-prompt.md`](../../foodio-cursor-architecture-prompt.md) in the workspace root for full architecture details.
