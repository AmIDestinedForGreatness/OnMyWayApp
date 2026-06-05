# CLAUDE.md — On My Way! Staycation

Project instructions and session state for Claude Code. Read this before touching any file.

---

## Version

**Current: V.1.1** — Phase 1, update 1

**Versioning system:**
- Phase 1 = V.1.x — each update increments +0.1 (V.1.1 → V.1.2 → ...)
- Phase 2 = V.2.0 — only when Yujin explicitly says so
- Version badge visible in app — `APP_VERSION` constant in `HomeScreen.js`, also in `app.json`

**Changelog:**
- V.1.0: Core map, navigation, chat, profiles, SellScreen, date picker, cost calculator, booking inquiry — all screens built and working
- V.1.1: Amenities filter, Premium Membership UI (mock), OMW Coins (mock), Boost button, bug fixes (route loop + joystick teleport)

---

## The product

**"On My Way! Staycation"** — Map-first staycation rental app for Filipinos.
Target user: students and young adults who need a place ASAP — "I need somewhere tonight." Budget ₱500–₱3,500/night, urgency-driven, short stays.

**Long-term vision:** Filipino-first buy/sell/rent marketplace. Staycation is the wedge — dominate that niche first, then expand to vehicles → items → services. Do NOT build the general marketplace now. OLX died going head-to-head with Facebook Marketplace.

**Core mechanic:** Waze (navigation) + Carousell (marketplace) + Facebook Communities (social), glued together with Pokémon GO-style map UX. Pin tap → detail modal → chat host → unlock OMW! → 3D navigation.

**NOT competing with:** Airbnb (foreign tourists), Lamudi (long-term sales), Carousell (general marketplace).

**Revenue:** Ads + listing boosts + OMW Coins subscription. No commissions — RA 9646 broker license required.

**Premium membership:**
- Hosts subscribe (₱99–₱299/mo) → get OMW Coins monthly
- Coins used to boost listings (top of search + enlarged pin on map)
- Boost tiers: 50 coins = 24hr, 120 = 3-day, 200 = 7-day featured
- Phase 1: mock UI only. Phase 2: real GCash/Maya/Stripe payments via backend

---

## Tech stack

- **Frontend:** React Native + Expo (managed workflow — never eject, never bare workflow)
- **Backend:** None yet — all state in `PropertiesContext` (in-memory)
- **Maps:** OpenStreetMap via CartoDB Voyager tiles — `https://cartodb-basemaps-a.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png`
- **Routing:** OSRM public API (`router.project-osrm.org`)
- **Location:** expo-location
- **Images:** expo-image-picker
- **Safe area:** `useSafeAreaInsets()` from react-native-safe-area-context
- **Phase 2:** Supabase (auth, DB, storage, realtime) — TBD, Yujin decides when

**Installed packages:**
```json
{
  "@react-navigation/native": "^7.2.2",
  "@react-navigation/stack": "^7.8.10",
  "expo": "~54.0.33",
  "expo-image-picker": "~17.0.10",
  "expo-location": "~19.0.8",
  "expo-status-bar": "~3.0.9",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "react-native-maps": "1.20.1",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0"
}
```

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

- Always `useSafeAreaInsets()` — never hardcode `paddingTop`
- Always `StatusBar style="light"` on every screen
- `opacity={0.99}` on `UrlTile` — iOS polyline rendering fix

---

## Project structure

```
Personal PC:  C:\Users\Marvin\Documents\OnMyWay\OnMyWayApp
Mom's PC:     C:\Users\MARVIN-LI\Documents\OnMyWay\OnMyWayApp
├── App.js                    (Navigation + PropertiesProvider wrapper)
├── app.json
├── CLAUDE.md                 (this file)
├── context/
│   └── PropertiesContext.js  (Global state — in-memory, omwCoins, membershipTier)
└── screens/
    ├── SplashScreen.js
    ├── WelcomeScreen.js
    ├── SignUpScreen.js
    ├── LoginScreen.js
    ├── HomeScreen.js         (APP_VERSION badge bottom-right)
    ├── MapScreen.js          (Largest file — map, filters, navigation, dev mode)
    ├── ChatScreen.js
    ├── SellScreen.js         (Boost button → Membership)
    ├── MembershipScreen.js   (OMW Coins, boost tiers, plans — mock)
    ├── ProfileScreen.js      (Membership link added)
    ├── SettingsScreen.js
    └── HelpScreen.js
```

---

## Hard rules

- **Expo managed workflow only** — never suggest bare workflow, ejecting, or custom native modules
- **No TypeScript yet** — plain JS only
- **No backend calls in Phase 1** — state lives in `PropertiesContext` only
- **No Google Maps** — CartoDB tiles only
- **No paid APIs** — free OSM + OSRM only
- Read state from `useProperties()` — never bypass the context
- Always `useSafeAreaInsets()` — never `SafeAreaView` with hardcoded padding

---

## Known workarounds — do not undo

| Issue | Fix |
|---|---|
| iOS polyline hidden by tiles | `opacity={0.99}` on `UrlTile` |
| OSRM timeout | `AbortController` 8s + straight-line fallback set BEFORE the fetch |
| Route looping | Discard OSRM route if > 3× straight-line distance — use straight line |
| Joystick snap on first move | `onPanResponderGrant` seeds spoofed location from real GPS |
| Overlapping OSRM fetches | `isReroutingRef` lock |
| Stale GPS in joystick closure | `realLocationRef` stores current GPS as ref |
| `PropertiesProvider` placement | Must wrap `NavigationContainer` in `App.js` |
| Expo LAN mode | `npx expo start --lan --clear` — same WiFi, allow `node.exe` through Windows Firewall |

---

## Features built (V.1.1)

1. Splash → Welcome → SignUp/Login → Home flow
2. Map with Voyager tiles + 9 sample listings (QC area)
3. Property pins — scale by distance, photo thumbnails
4. Pin tap → detail modal (photo carousel, price, amenities, host, reviews, booking)
5. Amenities display in detail modal (green ✓ tags)
6. Chat with 6 host personalities (Tagalog + English mix)
7. After 1+ message → red OMW! pill in chat banner
8. OMW! → 3D navigation (60° pitch, calculated heading, zoom 17)
9. Blue polyline via OSRM + straight-line fallback (8s timeout, 3× loop check)
10. Route re-fetches every 80m during navigation
11. Arrival detection at 50m → green "I've Arrived!" button
12. Search modal: text, sort, listing type, property type, distance, sqm, amenities filters
13. Quick filter chips: All / Buy / Staycation / Near me
14. Date picker (CalendarModal — no extra package), cost calculator, booking inquiry flow
15. Dev mode: tap-teleport, joystick + speed slider (bottom-left), GPS focus
16. Persistent spoofed location (survives dev toggle, Reset clears it)
17. Custom UserMarker (pulsing blue dot, red when spoofed)
18. Profile: avatar upload, edit info, 3 tabs (listings/received/given reviews)
19. Settings, Help screens
20. SellScreen: photos, type, price, amenities, guests, nights, description + Boost button
21. MembershipScreen: OMW Coins balance, boost tiers, Basic/Pro plans (mock)

---

## Known bugs

All resolved as of V.1.1.

---

## Phase 1 checklist

- [x] Date picker
- [x] Cost calculator
- [x] Booking inquiry flow
- [x] Amenities filter on map
- [x] Premium membership UI (mock)
- [x] All bugs fixed

**Phase 1 is complete. Phase 2 starts only when Yujin says so.**

---

## Roadmap

**Phase 2 — Backend:** Supabase auth, real properties DB, photo storage, real chat (Realtime), GCash/Maya payments + OMW Coins backend, boost system

**Phase 3 — Trust:** Phone OTP, host verification badge, real review system

**Phase 4 — Community:** Area feeds, comments/reactions, listing shares, full Waze-style nav UI

**Phase 5 — Launch:** Landing page, Android APK + iOS TestFlight, onboard first real hosts

---

## Sample data (PropertiesContext.js)

9 listings, all pinned to QC coords for dev/testing:
1. Cozy Tagaytay Cabin — ₱3,500/night — Cabin
2. BGC Condo with City Views — ₱4,200/night — Condo
3. Baguio Pine Forest Bungalow — ₱2,800/night — Bungalow
4. La Union Beachfront Studio — ₱2,200/night — Beachfront
5. Batangas Villa with Pool — ₱12,000/night — Villa
6. Antipolo Glamping Tent — ₱1,800/night — Glamping
7. Boracay-Style Condo near Alabang — ₱3,800/night — Condo
8. Whole House in Quezon City — ₱5,500/night — Whole House
9. Siargao-Inspired Apartment in Makati — ₱3,200/night — Apartment

Property types: Whole House, Condo, Villa, Cabin, Beachfront, Glamping, Apartment, Bungalow
Amenities: WiFi, Pool, Parking, Kitchen, BBQ Grill, Pet-friendly, Beach Access, Netflix, Gym, Balcony, Garden, Fireplace, Breakfast included, Videoke, Aircon

---

## Commands

```bash
npx expo start --lan --clear   # start dev server
git add . && git commit -m "..." && git push
cd C:\Users\Marvin\Documents\OnMyWay\OnMyWayApp        # Personal PC
cd C:\Users\MARVIN-LI\Documents\OnMyWay\OnMyWayApp    # Mom's PC
```

---

## For Claude — session lifeline

**This file on GitHub (raw):**
`https://raw.githubusercontent.com/AmIDestinedForGreatness/OnMyWayApp/main/CLAUDE.md`

Fetch via WebFetch at session start when not already in this project directory.

### Session end checklist
1. Push all changes to GitHub
2. Update this file — version, features, bugs, last session notes
3. Update `## Last Session` in ForClaudeYujin.md and push to claude-context repo
   - Personal PC: `C:\Users\Marvin\.claude\ForClaudeYujin.md`
   - Mom's PC: `C:\Users\MARVIN-LI\.claude\ForClaudeYujin.md`
