# React + Next.js Hooks Practice

A learning project for mastering React 19 hooks with Next.js 16 using real SAP Business One data.

## Tech Stack

- **Next.js 16.1.6** — App Router, Server Components
- **React 19.2.3** — Latest hooks API
- **TypeScript 5** — Full type safety
- **Tailwind CSS 4** — Utility-first styling
- **Biome** — Linting and formatting

## Project Structure

```
src/
├── app/
│   ├── api/items/search/    # API route for item search
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── components/
│   ├── StateVendorServer.tsx    # useState practice
│   ├── StateVendorClient.tsx
│   ├── EffectVendorServer.tsx   # useEffect practice
│   ├── EffectVendorClient.tsx
│   ├── RefItemServer.tsx        # useRef practice
│   ├── RefItemClient.tsx
│   ├── MemoOrderServer.tsx      # useMemo practice
│   ├── MemoOrderClient.tsx
│   ├── CallbackItemServer.tsx   # useCallback practice
│   ├── CallbackItemClient.tsx
│   ├── ReducerOrderServer.tsx   # useReducer practice
│   ├── ReducerOrderClient.tsx
│   ├── VendorListServer.tsx     # Original components
│   ├── VendorListClient.tsx
│   ├── ItemListServer.tsx
│   ├── ItemListClient.tsx
│   ├── OrderListServer.tsx
│   └── OrderListClient.tsx
├── hooks/
│   └── useItemFilter.ts     # Custom hook example
├── lib/
│   └── sap.ts               # SAP B1 authentication
└── types.ts                 # Shared TypeScript types
```

## Hooks Covered

| Hook | Component | SAP API |
|------|-----------|---------|
| useState | StateVendorClient | Vendors |
| useEffect | EffectVendorClient | Vendors + Posts |
| useRef | RefItemClient | Items |
| useMemo | MemoOrderClient | Orders |
| useCallback | CallbackItemClient | Items |
| useReducer | ReducerOrderClient | Orders |

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open http://localhost:3000
```

## SAP B1 Connection

The project connects to a SAP Business One Service Layer at `saporder.nubewired.com`. Authentication is handled in `src/lib/sap.ts`.

**APIs used:**
- `GET /BusinessPartners?$filter=CardType eq 'S'` — Vendors
- `GET /Items` — Items
- `GET /Orders` — Sales Orders

## Testing Guide

See [HOOK-TESTING-GUIDE.md](./HOOK-TESTING-GUIDE.md) for detailed test instructions for each hook.

## Configuration

**next.config.ts:**
```ts
const nextConfig: NextConfig = {
  // reactCompiler: true,  // Keep disabled for manual memoization
  reactStrictMode: true,
};
```

Keep `reactCompiler` commented out — it conflicts with manual useMemo/useCallback.

## Scripts

```bash
pnpm dev      # Start dev server
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run Biome linter
pnpm format   # Format with Biome
```

## Key Learnings

1. **Server vs Client Components** — Server components fetch data, client components handle interactivity
2. **CORS** — Not an issue for server-to-server requests
3. **React Compiler** — Conflicts with manual memoization, choose one approach
4. **Hydration** — Refs that change during render cause hydration mismatches in Next.js
5. **Dispatch stability** — useReducer's dispatch is stable across renders (unlike useState setters which are also stable but less commonly passed to children)

## Next Steps

- [ ] useContext — Shared state without prop drilling
- [ ] useTransition — Non-blocking UI updates
- [ ] useActionState — Form handling (React 19)
- [ ] useOptimistic — Optimistic UI updates (React 19)