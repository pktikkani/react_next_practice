# React Hooks Testing Guide

Practice components for mastering React hooks with SAP B1 data.

---

## 1. useState — `StateVendorClient.tsx`

| Test | What to do | Expected result |
|------|-----------|-----------------|
| 1. String state | Type in search box | List filters live, count updates |
| 2. Boolean toggle | Click "Show/Hide Vendors" | List appears/disappears |
| 3. Number counter | Click +1 | Count increments by 1 |
| 4. Updater function | Click "+3 (broken)" then "+3 (correct)" | Broken: +1 only. Correct: +3. Console shows stale value both times |
| 5. Object state | Type in CardCode/CardName fields | Form preview updates, only changed field updates |
| 6. Array state | Click ☆ Fav on vendors | Vendor appears in favorites. Click ★ Unfav removes it |
| 7. Lazy initializer | Check console on page load | "Lazy initializer running..." appears once, never on re-renders |
| 8. Reset with key | Type a note, click "Next Vendor" | Note resets to empty (component remounts due to key change) |
| 9. State as snapshot | Click "Set to 99" | Console shows OLD count value, not 99 |
| 10. Object.is bailout | Click "Set same value" | React DevTools highlight should NOT flash (no re-render) |

---

## 2. useEffect — `EffectVendorClient.tsx`

| Test | What to do | Expected result |
|------|-----------|-----------------|
| 1. Mount/unmount | Load page, navigate away | Console: "mounted" on load, "unmounting" on leave. Strict Mode shows mount→unmount→mount |
| 2. Keydown listener | Type text, press Escape | Search clears, console confirms |
| 3. Interval timer | Wait 5 seconds | Console logs time every 5s. Navigate away to stop (cleanup) |
| 4. localStorage sync | Type in search, refresh browser | Text persists from localStorage |
| 5. Fetch on mount | Load page | Posts fetched once, loading state shows briefly |
| 6. Fetch with deps + race prevention | Rapidly switch dropdown options | Bio resets to "Loading...", ignore flag prevents stale response |
| 7. No dependency array | Any interaction causing re-render | Console logs "every render" on every single render |

---

## 3. useRef — `RefItemClient.tsx`

| Test | What to do | Expected result |
|------|-----------|-----------------|
| 1. DOM ref (focus) | Load page | Search input auto-focused |
| 2. Mutable counter | Type characters, click "Show Count" | Reveals actual keystroke count |
| 3. Timer ID storage | Click Start/Stop/Reset | Timer runs/stops/resets. intervalRef stores ID for cleanup |
| 4. Previous value | Type "abc" then "abcd" | Previous: "abc", Current: "abcd" |
| 5. Scroll to bottom | Show items, click "Scroll to Bottom" | Smooth scrolls to end of list |
| 6. Measure element | Show items, click "Measure List" | Shows width x height in pixels |
| 7. AbortController | Type fast in search | Network tab shows cancelled requests (AbortError) |
| 8. Callback ref | Show items, click "Random Scroll" | List scrolls to random highlighted item |
| 9. Ref vs state | Click "Increment Ref" multiple times | Console shows value, UI stays stale. "Force Re-render" reveals accumulated count |

---

## 4. useMemo — `MemoOrderClient.tsx`

| Test | What to do | Expected result |
|------|-----------|-----------------|
| 1. Filtered list | Type in search | Console: "Filtering orders..." |
| 1b. Unrelated state | Click counter | "Filtering orders..." does NOT appear (memo skips) |
| 2. Derived state | Load page | Total and average display from props, no useState |
| 3. Referential stability | Click counter | "OrderSummary rendering..." does NOT appear |
| 4. Dependency tracking | Type in search | "Computing currency summary..." fires |
| 5. Memoized JSX | Click counter | "Rendering currency badges..." does NOT appear |
| 6. Combined pattern | Show orders, click counter | "OrderRow rendering:" does NOT appear. Click order → rows don't re-render |

---

## 5. useCallback — `CallbackItemClient.tsx`

| Test | What to do | Expected result |
|------|-----------|-----------------|
| 1. Stable props (React.memo) | Click counter | "ClearButton rendering..." does NOT appear |
| 2. Stable useEffect dependency | Type in search, then click counter | "Search changed to:" logs on search only, not counter |
| 3. Stable handler for list | Show items, click counter | "ItemRow rendering:" does NOT appear |
| 4. Custom hook | ClearButton uses clearSearch | Proves useCallback works inside custom hooks |
| 5. Without useCallback | Swap handleItemClick → handleItemClickUnstable in code | Every row re-renders on counter click |
| 6. Callback with deps | Change counter/search, click "Add Log" | Message reflects current values |

---

## 6. useReducer — `ReducerOrderClient.tsx`

| Test | What to do | Expected result |
|------|-----------|-----------------|
| 1. Basic dispatch | Click "Toggle Orders" | List shows/hides, lastAction updates |
| 2. Multiple action types | Toggle, search, select, increment, reset | All work through one reducer |
| 3. Action with payload | Type in search, click an order | lastAction shows payload value |
| 4. Unknown action | Dispatch `{type: 'BOGUS'}` in code | State unchanged, no crash |
| 5. Previous state | Click counter repeatedly | Increments correctly (reads state.counter) |
| 6. Lazy initializer | Check console on load | "Lazy initializer running..." once only |
| 7. Immutability | Edit reducer to mutate directly | React won't re-render (proves immutability required) |
| 8. vs useState | Compare to OrderListClient.tsx | Same behavior, cleaner with single reducer |
| 9. Dispatch stability | Type or click counter | "OrderActions rendering..." does NOT appear |

---

## Setup

Add to `page.tsx`:

```tsx
import StateVendorServer from "@/components/StateVendorServer";
import EffectVendorServer from "@/components/EffectVendorServer";
import RefItemServer from "@/components/RefItemServer";
import MemoOrderServer from "@/components/MemoOrderServer";
import CallbackItemServer from "@/components/CallbackItemServer";
import ReducerOrderServer from "@/components/ReducerOrderServer";

export default function Home() {
    return (
        <>
            <StateVendorServer />
            <EffectVendorServer />
            <RefItemServer />
            <MemoOrderServer />
            <CallbackItemServer />
            <ReducerOrderServer />
        </>
    );
}
```

**Important:** Keep `reactCompiler` commented out in `next.config.ts` for manual memoization to work.