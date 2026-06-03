# CLAUDE.md — On My Way! Staycation

Project instructions for Claude Code. Read this before touching any file.

---

## What this app is

A map-first staycation rental app for Filipinos. Pokémon GO-style UX — tap pins on a map to view properties, chat with hosts, unlock OMW! navigation. Target users: students and young adults who need a place ASAP (budget ₱500–₱3,500/night).

**Long-term vision:** Become a Filipino-first buy/sell/rent marketplace. The staycation niche is the wedge — do NOT build the general marketplace now.

**Revenue:** Ads + listing boosts + OMW Coins (subscription). No commissions — RA 9646 broker license required.

---

## Stack

- **Frontend:** React Native + Expo (managed workflow only — no bare workflow, no ejecting)
- **Backend:** None yet — all state in `PropertiesContext` (in-memory)
- **Maps:** OpenStreetMap via CartoDB Voyager tiles (no Google Maps — no paid plan)
- **Routing:** OSRM public API (`router.project-osrm.org`)
- **Phase 2:** Supabase backend (auth, DB, storage, realtime) — TBD, Yujin decides when

---

## Design system — strict, do not deviate

| Token | Value |
|---|---|
| Background | `#0A1628` |
| Cards | `#111F35` / border `#1E3050` |
| Primary blue | `#4A9EFF` |
| Sale accent | `#185FA5` |
| Staycation accent | `#0F6E56` |
| Dev/danger | `#CC0000` |
| Text primary | `#FFFFFF` |
| Text secondary | `#8899AA` |
| Text muted | `#445566` |
| Success green | `#1D9E75` |
| Map tiles | CartoDB Voyager (cream/Waze-like) |

- **Always** use `useSafeAreaInsets()` — never hardcode `paddingTop`
- **Always** `StatusBar style="light"` on every screen
- Use `opacity={0.99}` on `UrlTile` — iOS polyline rendering fix

---

## Hard rules

- **Expo managed workflow only** — never suggest native modules, bare workflow, or ejecting
- **No TypeScript yet** — plain JS only
- **No backend calls** in Phase 1 — state lives in `PropertiesContext`
- **No Google Maps** — use CartoDB tiles only
- **No paid APIs** — free OSM + OSRM only
- State must be read from `useProperties()` — never bypass the context
- Safe area: always `useSafeAreaInsets()`, never `SafeAreaView` with hardcoded padding

---

## Key workarounds (do not undo)

| Issue | Fix |
|---|---|
| iOS polyline hidden by tiles | `opacity={0.99}` on `UrlTile` |
| OSRM timeout | `AbortController` 8s + straight-line fallback set BEFORE the fetch |
| Route looping | Discard OSRM route if > 3× straight-line distance |
| Joystick snap on first move | `onPanResponderGrant` seeds spoofed location from real GPS |
| Overlapping OSRM fetches | `isReroutingRef` lock |
| Stale GPS in joystick closure | `realLocationRef` stores current GPS as ref |
| `PropertiesProvider` placement | Must wrap `NavigationContainer` in `App.js` |

---

## Versioning

- **Phase 1 = V.1.x** — each meaningful update = +0.1 (V.1.1 → V.1.2 → ...)
- **Phase 2 = V.2.0** — only when Yujin explicitly says so
- Version is visible in the app (HomeScreen bottom-right badge, `APP_VERSION` constant)
- Update `app.json` version to match on every bump

---

## Testing

- Yujin tests on **iPhone 12 via Expo Go** — iOS only
- Run: `npx expo start --lan --clear` (requires same WiFi, allow `node.exe` through Windows Firewall)
- "Done" = dev build launches + Yujin tests the affected screen on device

---

## Session start

Always fetch and read `CLAUDE_CODE_CONTEXT.md` from GitHub before starting:
```
https://raw.githubusercontent.com/AmIDestinedForGreatness/OnMyWayApp/main/CLAUDE_CODE_CONTEXT.md
```
It is remote — do not rely on a local cached copy. It has the current version, feature status, known bugs, and session lifeline.

## Session end

1. Push all changes to GitHub
2. Update `CLAUDE_CODE_CONTEXT.md` — version, feature checklist, known bugs, For Claude section
3. Update `## Last Session` in `ForClaudeYujin.md` and push to claude-context repo
