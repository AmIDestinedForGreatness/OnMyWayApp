# ON MY WAY! STAYCATION — CLAUDE CODE CONTEXT

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
- Use Filipino cultural context when relevant
- When they make typos or speak casually, understand the intent
- Save files using `sv.` in VS Code

## 🎯 THE PRODUCT
**"On My Way! Staycation"** — Map-first staycation rental app for Filipinos.

**Tagline:** *"Tara, staycation! Find Filipino-owned rentals near you."*

**Target user:** Pinoys 22-35 booking weekend escapes (Tagaytay, Baguio, La Union, BGC condos, Antipolo, Batangas, Boracay, Siargao, Palawan).

**Core mechanic:** Pokemon GO-style map UX. Pin tap → property detail modal. Chat with host → unlock red OMW! button → 3D Waze-style navigation to property.

**NOT competing with:** Airbnb (foreign tourists), Lamudi (long-term sales), Carousell (general marketplace).

**Revenue model:** Ads + boost listings only (Phase 1). No commissions — RA 9646 (RESA Law) requires broker license.

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

## 🐛 KNOWN BUGS (NOT YET FIXED)
1. **Route loops during navigation** — OSRM sometimes returns weird looping path instead of clean road route. Root cause: sample properties are clustered in QC but user's real GPS may be far away, causing OSRM to find odd road connections.
2. **Auto-teleport on first joystick move** — when joystick moves from real GPS position, it snaps near the sample property cluster. Partial fix applied (realLocationRef) but needs verification.
3. **SignUpScreen navigates to Map** instead of Home after account creation — bug never fixed.
4. **ChatScreen auto-responses** — still use old real estate language ("schedule a viewing", "clean title", "move-in ready"). Need staycation rewording (e.g. "available for the weekend", "check-in ready").
5. **Speed slider width** — uses SLIDER_WIDTH constant that may mismatch after layout changes.

## 📋 PHASE 1 REMAINING (Frontend Polish)
- [ ] Date picker (check-in / check-out dates)
- [ ] Nightly total cost calculator (nights × rate = total)
- [ ] Booking inquiry flow (pick dates → auto-fills chat message to host)
- [ ] Amenities filter on map (pool, WiFi, pet-friendly, parking, beachfront, etc.)
- [ ] Fix all known bugs above

## 🗺️ FULL ROADMAP
### Phase 1 — Frontend Polish (CURRENT)
Make app feel like a real staycation product before adding backend.

### Phase 2 — Backend Integration
- Supabase auth (email/password)
- Migrate properties from in-memory to Supabase DB
- Photo upload to Supabase Storage
- Real chat (Supabase Realtime) replacing auto-replies

### Phase 3 — Trust & Verification
- Phone OTP verification
- Host verification badge (selfie + ID upload, manual review)
- Real review system (only verified bookings can review)

### Phase 4 — Launch Prep
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
