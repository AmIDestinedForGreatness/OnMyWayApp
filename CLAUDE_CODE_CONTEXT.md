# ON MY WAY! STAYCATION — CLAUDE CODE CONTEXT

## 🔢 VERSION
**Current: V.1.1** — Phase 1, update 1

**Versioning system:**
- Phase 1 = V.1.x — each update within Phase 1 increments by +0.1 (V.1.1 → V.1.2 → ...)
- Phase 2 = V.2.0 — only moves to V.2 when Yujin explicitly says so
- Version is visible in the app (bottom-right badge on HomeScreen)

**Changelog:**
- V.1.0 (formerly V.01): Core map, navigation, chat, profiles, SellScreen, date picker, cost calculator, booking inquiry, all screens built and working
- V.1.1: Amenities filter on map + detail modal display, Premium Membership UI (mock), OMW Coins balance (mock), Boost button in SellScreen, Membership screen, fix route looping bug, fix auto-teleport joystick bug

## 👤 USER PROFILE
- **Name:** Yujin (PC username is "Marvin" — always call them Yujin)
- **Age:** 20, 1st year IT student
- **Location:** Quezon City, Philippines
- **Coding experience:** ZERO — relies 100% on AI for all technical work
- **Test device:** iPhone 12 (iOS)
- **VS Code save shortcut:** `sv.` (custom shortcut, replaces Ctrl+K→S)
- **GitHub:** https://github.com/AmIDestinedForGreatness/OnMyWayApp (private)

## 💬 HOW TO TALK TO YUJIN
- Call them **Yujin**, never Marvin
- Explain things plainly — no unexplained jargon
- Give exact file paths and copy-paste-ready code
- Tell them where each piece of code goes (which file, which folder)
- Push back on bad decisions — be a mentor, not a yes-man
- When they make typos or speak casually, understand the intent
- Save files using `sv.` in VS Code

## 🎯 THE PRODUCT
**"On My Way! Staycation"** — Map-first staycation rental app for Filipinos.

**Tagline:** *"On my way!"*

**Target user (Phase 1 MVP):** Students and young adults (Filipino or foreign) who need a rush/ASAP place to rent or stay — think "I need somewhere tonight", "I'm traveling for a uni event", "I need a place near campus this week." Budget-conscious, short stays, urgency-driven.

**Long-term vision:** Become an entirely new Filipino-first buy/sell/rent marketplace — not just properties and staycations, but also items, vehicles, services, etc. Think: the local alternative to OLX (shut down 2023) and Carousell, but built for how Filipinos actually shop and transact (map-based, community-driven, Viber/FB-integrated).

**STRATEGY NOTE — WEDGE FIRST:** Do NOT try to build a general marketplace from day one. OLX died going head-to-head with Facebook Marketplace. The winning move is: dominate the staycation/ASAP rental niche first (clear gap in the market, no strong local competitor) → build trust and user base → expand to vehicles, then items, then services. The staycation app is the foot in the door, not the full product.

**Urgency UX implications:**
- Availability status on listings ("Available tonight", "Available this weekend") matters a lot
- Quick inquiry/booking flow is higher priority than deep browsing
- Price range ₱500–₱3,500/night is the sweet spot for students
- Near-me + "available now" filters are critical features

**Core mechanic:** Three app inspirations combined:
1. **Waze (navigation layer):** 3D camera tilt, blue polyline route, live GPS tracking while navigating to property. Eventually: full Waze-style navigation UI (turn-by-turn instructions panel, ETA, distance display while in navigation mode).
2. **Carousell (marketplace layer):** Easy listing creation with photos + price, browse/search listings, bump/boost to push listing back to top. Reviews on listings. In-app purchases for boosts/bumps.
3. **Facebook Communities (social layer):** Community-feel around listings — eventually: groups or feeds per area (e.g. "Tagaytay Staycations"), shares, comments. This is how Filipinos already discover rentals; bring that trust layer into the app.

Pokémon GO-style map UX glues it all together: Pin tap → property detail modal. Chat with host → unlock red OMW! button → 3D Waze navigation to property.

**NOT competing with:** Airbnb (foreign tourists), Lamudi (long-term sales), Carousell (general marketplace).

**Revenue model:** Ads + boost listings + premium membership (Phase 1 UI, Phase 2 real payments). No commissions — RA 9646 (RESA Law) requires broker license.

**Premium membership concept:**
- Hosts pay a monthly/weekly subscription (e.g. ₱99–₱299/month)
- Membership gives in-app currency (e.g. "OMW Coins")
- Coins used to boost listings — boosts pin to top of search results and makes map pin larger/highlighted, even if property is far from the user
- Boost tiers: e.g. 50 coins = 24hr boost, 200 coins = 7-day featured
- Coins can also be purchased separately (à la carte)
- Phase 1: build the UI (membership screen, coin balance, boost button in SellScreen) — non-functional/mock only
- Phase 2: wire to real GCash/Maya/Stripe payments via backend

## 🏗️ TECH STACK
- **Frontend:** React Native + Expo (managed workflow)
- **Backend:** NONE YET — all in-memory state via PropertiesContext. Supabase planned for Phase 2.
- **Maps:** OpenStreetMap via CartoDB Voyager tiles (NOT Google Maps — no paid plan)
  - URL: `https://cartodb-basemaps-a.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png`
  - Use `opacity={0.99}` trick to fix polyline rendering on iOS
- **Routing:** OSRM public API (`router.project-osrm.org`)
- **Image picker:** expo-image-picker
- **Location:** expo-location
- **Safe area:** useSafeAreaInsets() from react-native-safe-area-context (NOT SafeAreaView with hardcoded paddingTop)

## 📂 PROJECT STRUCTURE
```
C:\Users\Marvin\Documents\OnMyWay\OnMyWayApp
├── App.js                          (Navigation + PropertiesProvider wrapper)
├── app.json
├── index.js
├── package.json
├── context/
│   └── PropertiesContext.js        (Global state — in-memory only)
├── assets/
│   └── properties/                 (condo1.jpg–condo9.jpg stock photos)
└── screens/
    ├── SplashScreen.js
    ├── WelcomeScreen.js
    ├── SignUpScreen.js
    ├── LoginScreen.js
    ├── HomeScreen.js
    ├── MapScreen.js                (Largest file — map, carousel, filters, navigation, dev mode)
    ├── ChatScreen.js
    ├── SellScreen.js
    ├── ProfileScreen.js
    ├── SettingsScreen.js
    └── HelpScreen.js
```

## 🎨 DESIGN SYSTEM (STRICT — DO NOT DEVIATE)
- **Background:** `#0A1628` (deep navy)
- **Cards:** `#111F35` with `#1E3050` borders
- **Primary blue:** `#4A9EFF`
- **Sale accent:** `#185FA5` (blue)
- **Rent/staycation accent:** `#0F6E56` (green)
- **Dev mode / danger:** `#CC0000` (red)
- **Text primary:** `#FFFFFF`
- **Text secondary:** `#8899AA`
- **Text muted:** `#445566`
- **Online/success green:** `#1D9E75`
- **Map tiles:** CartoDB Voyager (cream/Waze-like)
- **Safe area:** Always use `useSafeAreaInsets()` — never hardcode paddingTop
- **All screens:** `StatusBar style="light"`

## ✅ FEATURES FULLY BUILT & WORKING
1. Splash → Welcome → SignUp/Login → Home flow
2. Map screen with Voyager cream tiles + 9 staycation sample listings (QC area)
3. Property pins with real photos, scale by distance (closer = bigger)
4. Pin tap → opens detail modal directly
5. Property detail: photo carousel, price, amenities, host info, sample reviews
6. Chat with 6 unique host personalities (Tagalog + English mix)
7. After 1+ message exchange → red OMW! pill appears in chat banner
8. OMW! → 3D Waze-style camera tilt (60° pitch, calculated heading, zoom 17)
9. Blue polyline route via OSRM (straight-line fallback if API fails, 8s timeout)
10. Route re-fetches every 80m as user moves (with isReroutingRef lock to prevent overlaps)
11. Arrival detection at 50m → green "📍 I've Arrived!" button replaces Stop navigation
12. Search modal: text + sort + property type + listing type + distance + sqm filters
13. Quick filter chips on map: All / 🏡 Buy / 🌴 Staycation / 📍 Near me (horizontal scroll)
14. Dev mode toggle on Home (NOT password-gated)
15. Dev mode: tap-teleport, floating joystick (bottom-left), speed slider (beside joystick)
16. Joystick + speed slider are side-by-side at bottom-left
17. GPS pin/location button above carousel
18. Persistent spoofed location (survives dev mode toggle, only Reset clears it)
19. Custom UserMarker (pulsing blue dot, red when spoofed)
20. GPS focus button: zooms to level 18
21. Profile screen: avatar upload, edit name/email/phone/bio, 3 tabs (My listings/Received/Given)
22. Settings screen: edit account info, clear app data, app version
23. Help screen: 4-step guide, collapsible FAQ, bug report (mailto), about section
24. Settings + Help accessible from Profile screen as tappable rows
25. Host your space (SellScreen): nightly rate, amenities chips, max guests, min nights, photos
26. Staycation reframe complete: all language updated (host/guest, not seller/buyer)
27. All screens use useSafeAreaInsets() for proper iPhone notch handling
28. GitHub repo set up: https://github.com/AmIDestinedForGreatness/OnMyWayApp
29. Date picker: custom CalendarModal (no extra package) — check-in/check-out in property detail modal
30. Cost calculator: nights × nightly rate = total, shown inline with date picker
31. Booking inquiry flow: "Message host" becomes "Request to book" when dates set; ChatScreen pre-fills inquiry message with dates + total

## 🐛 KNOWN BUGS (NOT YET FIXED)
All known bugs resolved as of V.1.1.

~~1. **Route loops during navigation**~~ — FIXED (V.1.1): Added 3× straight-line sanity check — if OSRM route is more than 3× the direct distance, it's discarded and straight-line fallback is used instead.
~~2. **Auto-teleport on first joystick move**~~ — FIXED (V.1.1): Added `onPanResponderGrant` to seed spoofed location from real GPS on first touch, preventing snap to default QC coords.
~~3. **SignUpScreen navigates to Map**~~ — FIXED
~~4. **ChatScreen auto-responses — old real estate language**~~ — FIXED
~~5. **Speed slider / dev toolbar orphaned JSX**~~ — FIXED

## 📋 PHASE 1 REMAINING (Frontend Polish)
- [x] Date picker (check-in / check-out dates) — DONE
- [x] Nightly total cost calculator (nights × rate = total) — DONE
- [x] Booking inquiry flow (pick dates → auto-fills chat message to host) — DONE
- [x] Amenities filter on map — DONE (V.1.1): multi-select in search modal, filters listings by required amenities, amenities displayed in property detail modal
- [x] Premium membership UI — DONE (V.1.1): MembershipScreen with OMW Coins balance, boost tiers, subscription plans (mock — no real payments); Boost button in SellScreen; Membership link in ProfileScreen
- [x] Fix all known bugs — DONE (V.1.1)

**Phase 1 is complete. Move to Phase 2 only when Yujin says so.**

## 🗺️ FULL ROADMAP
### Phase 1 — Frontend Polish (CURRENT)
Make app feel like a real staycation product before adding backend.

### Phase 2 — Backend Integration
- Supabase auth (email/password)
- Migrate properties from in-memory to Supabase DB
- Photo upload to Supabase Storage
- Real chat (Supabase Realtime) replacing auto-replies
- Premium membership payments (GCash/Maya/Stripe) + OMW Coins backend
- Boost system: boosted listings float to top of search + enlarged map pin

### Phase 3 — Trust & Verification
- Phone OTP verification
- Host verification badge (selfie + ID upload, manual review)
- Real review system (only verified bookings can review)

### Phase 4 — Community & Social Layer
- Area-based community feeds (e.g. "Tagaytay Staycations", "La Union Listings")
- Comments/reactions on listings (Facebook marketplace feel)
- Listing shares (to Facebook groups, Viber, etc.)
- Full Waze-style navigation UI (turn-by-turn panel, ETA bar, distance display during active navigation)

### Phase 5 — Launch Prep
- Landing page (Vercel)
- Android APK + iOS TestFlight
- Onboard 5-10 real hosts, 50 beta users

## ⚙️ KNOWN WORKAROUNDS
1. **Expo LAN mode:** Use `npx expo start --lan --clear` — requires same WiFi. Allow `node.exe` through Windows Firewall.
2. **OSRM timeout:** AbortController with 8s timeout. Straight-line fallback set BEFORE OSRM call.
3. **Polyline hidden by tiles:** Use `opacity={0.99}` on UrlTile — NOT `shouldReplaceMapContent={true}`.
4. **PropertiesProvider** must wrap NavigationContainer in App.js.
5. **useSafeAreaInsets** must be used instead of SafeAreaView + hardcoded paddingTop for correct iPhone notch handling.
6. **isReroutingRef** lock prevents overlapping OSRM fetches during navigation.
7. **realLocationRef** stores current GPS position as a ref to avoid stale closure in joystick PanResponder.

## 💰 CONSTRAINTS
- No paid APIs (Google Maps billing declined — using free OSM)
- Cannot collect commissions without RA 9646 broker license
- No TypeScript yet
- No Sentry, React Query yet
- No backend until Phase 2
- Budget: ~₱500 max in first 90 days

## 🔑 USEFUL COMMANDS
```bash
# Start dev server
npx expo start --lan --clear

# Save to GitHub
git add .
git commit -m "describe changes"
git push

# Project folder
cd C:\Users\Marvin\Documents\OnMyWay\OnMyWayApp
```

## 📦 INSTALLED PACKAGES (package.json)
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

## 🤖 FOR CLAUDE (Session lifeline — read this first)

**This file on GitHub (raw):** `https://raw.githubusercontent.com/AmIDestinedForGreatness/OnMyWayApp/main/CLAUDE_CODE_CONTEXT.md`
Fetch via WebFetch at session start — do not rely on a local cached copy.

### Behavior rules
- React Native + Expo (managed workflow) only — no Next.js, no web patterns, no bare workflow features
- State lives in `PropertiesContext` — no backend yet. Never suggest backend solutions for Phase 1 work.
- Always use `useSafeAreaInsets()` for screen padding — never hardcode `paddingTop`
- Readiness bar: **Medium** — ship working features, don't over-engineer. Phase 2 will reshape the backend entirely.

### Testing
- Yujin tests on **iPhone 12 via Expo Go** — iOS only
- Always consider iOS-specific behavior: safe areas, scroll physics, navigation gestures
- Expo Go limitation: custom native modules not supported — never suggest bare workflow changes
- "Done" = Expo dev build launches without error + Yujin tests the affected flow on device

### Deployment (future)
- OTA updates → `expo publish` (Expo managed workflow)
- App Store → EAS Build (Phase 2+, after backend is ready)

### End of session checklist
1. Push all changes to GitHub (`git add . → commit → push`)
2. Update `## Last Session` in `C:\Users\MARVIN-LI\.claude\ForClaudeYujin.md`
3. Sync ForClaudeYujin.md to the claude-context repo and push

---

## 🏠 SAMPLE DATA (PropertiesContext.js)
9 staycation listings all in QC coordinates (for dev/testing):
1. Cozy Tagaytay Cabin with Taal View — ₱3,500/night — Cabin
2. BGC Condo with City Views — ₱4,200/night — Condo
3. Baguio Pine Forest Bungalow — ₱2,800/night — Bungalow
4. La Union Beachfront Studio — ₱2,200/night — Beachfront
5. Batangas Villa with Private Pool — ₱12,000/night — Villa
6. Antipolo Glamping Tent — ₱1,800/night — Glamping
7. Boracay-Style Condo near Alabang — ₱3,800/night — Condo
8. Whole House in Quezon City — ₱5,500/night — Whole House
9. Siargao-Inspired Apartment in Makati — ₱3,200/night — Apartment

Property type options: Whole House, Condo, Villa, Cabin, Beachfront, Glamping, Apartment, Bungalow
Amenities list: WiFi, Pool, Parking, Kitchen, BBQ Grill, Pet-friendly, Beach Access, Netflix, Gym, Balcony, Garden, Fireplace, Breakfast included, Videoke, Aircon
