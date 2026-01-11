# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

ASTRA is a static, browser-based astronaut wellness companion built with plain HTML, CSS, and JavaScript. It provides:
- A stress check dashboard (`index.html`) that estimates stress from sleep, mood, heart rate, and activity, and shows personalized recommendations.
- A crew status dashboard (`crew.html`) that surfaces other astronauts’ stress levels and high‑stress alerts in real time.
- A set of relaxation mini‑games (`games.html`) to reduce stress.
- An authentication flow (`login.html`) plus an AI chatbot (ASTRA) for supportive conversation.

All persistence, authentication, and multi‑user behavior is implemented via Firebase; the chatbot integrates with Google’s Gemini HTTP API. Internationalization is first‑class, with English/Spanish/French/Hindi translations wired into the UI.

## Running & Developing the App

There is no build system, package manager, or test runner configured: this is a pure static site.

### Local preview

From the repository root (`Brain_Lag`):
- Open the main dashboard directly in your default browser (Windows / PowerShell):
  - `start index.html`
- To inspect other views, open them the same way:
  - `start crew.html`
  - `start games.html`
  - `start login.html`

All HTML files assume the current working directory is the repo root so that `css/styles.css` and the scripts under `js/` resolve correctly.

### External dependencies

The app depends on external CDNs and APIs at runtime:
- Tailwind CSS via `<script src="https://cdn.tailwindcss.com">`.
- Google Fonts (Orbitron, Inter) via fonts.googleapis.com.
- Firebase (Auth + Firestore) via `firebase-app-compat.js`, `firebase-auth-compat.js`, `firebase-firestore-compat.js`.
- Google Gemini via HTTPS from `js/chatbot.js`.

For any network‑related debugging, check that these remote resources are reachable in the browser devtools network tab.

### Testing & linting

- There are currently **no automated tests**, linters, or formatting tools configured in this repository.
- All verification is manual via browser interactions (forms, crew dashboard, games, chatbot).

## High‑Level Architecture

### Top‑level structure

The project layout (also summarized in `map.txt`) is:
- `index.html` – main stress dashboard and chatbot entrypoint.
- `crew.html` – crew status and alerting dashboard.
- `games.html` – relaxation games hub.
- `login.html` – authentication (email/password, signup, guest/anonymous login, password reset).
- `css/styles.css` – shared theme, layout, and component styles.
- `js/` – all dynamic behavior (Firebase integration, i18n, stress logic, games, crew UI, chatbot).
- `assets/logo.svg` – logo used in some UIs.

Each HTML file is a full page that:
- Shares a consistent ASTRA navbar and animated starfield background.
- Uses Tailwind utility classes plus custom classes from `css/styles.css`.
- Wires interactive elements via global functions attached on `window` from the JS files.

### Internationalization (i18n)

**File:** `js/translations.js`

- Defines a `TRANSLATIONS` object with four language dictionaries: `en`, `es`, `fr`, `hi`.
- Uses `data-i18n` and `data-i18n-placeholder` attributes in the HTML to bind elements to translation keys.
- On `DOMContentLoaded`, reads `astra_language` from `localStorage`, updates visible text and placeholders, and syncs all language `<select>` controls.
- Exposes two globals:
  - `getText(key)` – returns the localized string for `key`, falling back to English and finally the key itself.
  - `changeLanguage(lang)` – updates `currentLanguage`, persists it to `localStorage`, updates the DOM, and fires a `languageChanged` event.

Most feature modules define a small helper `t(key, defaultText)` that delegates to `getText`. When adding new user‑visible text:
- Give the element a `data-i18n`/`data-i18n-placeholder` attribute.
- Add the corresponding keys to all relevant language blocks in `TRANSLATIONS`.

### Firebase integration and data layer

**File:** `js/firebase.js`

This is the central backend and state layer for the app.

- Initializes Firebase with a project‑specific config, and creates the shared services:
  - `auth = firebase.auth()` for authentication.
  - `db = firebase.firestore()` for data access.
- Maintains `currentUser` (global) via `auth.onAuthStateChanged` and calls:
  - `onUserLoggedIn(user)` – updates navbar login state, sets the visible name/initials, loads the user profile, subscribes to crew alerts, and records the user as online.
  - `onUserLoggedOut()` – resets navbar state and redirects protected pages (`crew.html`, `games.html`) to `login.html`.

**Authentication helpers** (used primarily from `login.html`’s inline script):
- `signUp(email, password, displayName)` – creates a Firebase Auth user, sets their `displayName`, and writes an initial profile document in Firestore under `users/{uid}`.
- `signIn(email, password)` – logs in, updates `lastLogin` + `isOnline`, shows a localized toast, and redirects to `index.html`.
- `signInAnonymously()` – anonymous guest login with a generated "Astronaut X" display name and a default profile.
- `logout()` – marks the user offline, signs them out, shows a toast, then redirects to `login.html`.
- `resetPassword(email)` – sends a reset email and toasts success/error.

**User profile & stress data:**
- Profiles live under `users/{uid}` with fields such as `displayName`, `email`, `role`, `stressLevel`, `stressScore`, `lastCheckIn`, `checksToday`, `isOnline`, etc.
- `createUserProfile(userId, profileData)` / `updateUserProfile(userId, updates)` – generic profile CRUD.
- `loadUserProfile(userId)` – fetches the profile, creating a default one if missing, and calls `updateProfileUI(profile)`.
- `updateProfileUI(profile)` – updates the "Today’s Summary" widgets on `index.html` (`lastCheckTime`, `checksToday`, `avgStress`).
- `saveStressCheck(stressData)` – writes a document to `users/{uid}/stressHistory`, updates the main `users/{uid}` document (stress level, score, check counts, last check‑in), and, if level is `high`, calls `createCrewAlert`.
- `getStressHistory(limit)` – reads recent stress entries from `users/{uid}/stressHistory`.

**Crew and alerts:**
- Data model:
  - `users` – all astronauts, with `isOnline` and stress‑related fields.
  - `crewAlerts` – top‑level collection of high‑stress alerts; documents include `userId`, `userName`, `stressLevel`, `stressScore`, `message`, `timestamp`, `isRead`, `isActive`.
- Functions:
  - `getCrewMembers()` / `getAllCrew()` – fetch crew lists from `users`.
  - `subscribeToCrewUpdates(callback)` – real‑time subscription to the entire `users` collection (used by `crew.js` for dashboard rendering).
  - `createCrewAlert(userId, stressData)` – builds a translated message and writes a new `crewAlerts` document.
  - `subscribeToCrewAlerts()` – listens to active alerts and shows in‑page preview + toast for alerts involving other users.
  - `getOnlineCrewCount()` / `initializeCrewCount()` – compute and display the current online crew count on the home dashboard.

**Recommendations, games, and chat logs:**
- `saveRecommendation(recommendation)` – appends to `users/{uid}/recommendations`.
- `logGameActivity(gameType, duration, score)` – appends to `users/{uid}/gameActivity`.
- `saveChatMessage(message, sender)` / `getChatHistory(limit)` – persist and read chat messages under `users/{uid}/chatHistory` for the chatbot.

**Shared utilities:**
- `t(key, defaultText)` – thin wrapper over `getText` to keep this file i18n‑aware.
- `getAuthErrorMessage(errorCode)` – maps Firebase auth error codes to translation keys.
- `showAuthLoader(show)` – toggles form‑level loading indicators (used by the login/signup flows).
- `showToast(type, title, message)` – central toast implementation used across all modules; manipulates a global `#toast` element.
- `updateOnlineStatus(isOnline)` + visibility/beforeunload handlers – attempt to keep `isOnline` and `lastSeen` accurate as the tab visibility changes.

When adding any new backend interaction, prefer adding a small, focused function here rather than calling `db` directly from page‑specific scripts.

### Stress analysis & recommendations

**File:** `js/app.js` (used by `index.html`)

Responsibilities:
- Attaches listeners to the stress input form (`#stressForm`) and mood slider to keep `#moodValue` in sync.
- `handleStressCheck(event)`:
  - Reads the current inputs (sleep hours, mood level, heart rate, activity level).
  - Calls `calculateStressLevel(...)` to compute a numeric stress score (0–100) and categorical level (`low`/`medium`/`high`) using a rule‑based heuristic.
  - Simulates an analysis delay, then updates the UI via `displayStressResult(...)` and generates a list of recommendations via `generateRecommendations(...)`.
  - Persists the stress check using `saveStressCheck(...)` and updates local "Today’s Summary" counters.
  - If stress is high, opens `#highStressModal` and shows a translated toast summarizing the result.

Key helpers:
- `calculateStressLevel(...)` – applies weighted penalties/bonuses for sleep, mood, heart rate, and activity, assembling translated factor descriptions for the explanation text.
- `displayStressResult(result)` – animates the circular SVG gauge, updates the stress badge styling, and populates the explanation and score.
- `generateRecommendations(...)` – builds up to four recommendation objects (breathing, chat, games, rest, activity, etc.) driven by the current inputs and stress level, using translation keys.
- `displayRecommendations(recommendations)` – renders these recommendations into `#recommendationsList` and logs them via `saveRecommendation(...)`.
- `simulateHeartRate()` – randomizes `#heartRate` around a base rate and shows an informational toast.
- Global exports: `simulateHeartRate`, `closeHighStressModal`, and a local `capitalizeFirst` are attached to `window` for use from HTML.

### Relaxation games

**File:** `js/games.js` (used by `games.html`)

This module implements three mini‑games and their shared state.

- Global state objects track each game:
  - `starCatcherState` – score, time left, level, combo, and max combo for the Star Catcher game.
  - `breathingState` – current phase/cycle/total cycles for the guided breathing exercise.
  - `constellationState` – current constellation, score, and selected stars for the Constellation Connect game.
- Page bootstrap:
  - On `DOMContentLoaded`, inspects `window.location.hash` (e.g. `#breathing`) and switches to that game tab if present.
- Tab management:
  - `switchGame(gameType)` – updates tab button classes and toggles visibility of `[data-game-container]` sections for `breathing`, `star-catcher`, and `constellation`.

**Star Catcher:**
- `startStarCatcher()` – initializes state, hides the intro, shows the game area, clears prior stars, then starts:
  - A spawn interval (`spawnStar`) that creates clickable `.game-star` elements with randomized positions, colors, and point values.
  - A countdown timer that decreases `timeLeft`, increases difficulty over time (faster spawns), and ends the game at zero.
- `catchStar(star, points)` – handles clicks, applying a combo multiplier, updating score/maxCombo, showing a `points-popup`, playing a short synthesized sound, and removing the star.
- `endStarCatcher()` – stops timers, logs the session via `logGameActivity('star_catcher', duration, score)`, shows the game‑over screen, and surfaces a localized summary/toast.

**Breathing exercise:**
- Uses a small state machine defined in `BREATHING_PHASES` (`inhale`, `hold`, `exhale`, `rest`) with durations, labels, and colors.
- `startBreathingExercise()` – sets initial state, flips from intro to exercise view, and calls `runBreathingPhase()`.
- `runBreathingPhase()` – updates text, circle size/color, cycle counter, and a per‑phase countdown; cycles through phases until `totalCycles` is reached, then calls `completeBreathingExercise()`.
- `completeBreathingExercise()` – logs with `logGameActivity('breathing_exercise', ...)`, shows the completion view with duration and cycles, and fires a congratulatory toast.

**Constellation Connect:**
- `CONSTELLATIONS` is a small, hard‑coded model of three constellations with normalized star coordinates and connection pairs.
- `startConstellationGame()` – resets state and calls `loadConstellation(0)` to start with the first pattern.
- `loadConstellation(index)` – renders the target constellation into `#constellationField` with clickable `.constellation-star` elements and an SVG overlay for lines.
- `selectConstellationStar(index)` – supports selecting/deselecting a star and attempts to connect a pair when two stars are chosen, awarding or penalizing points and advancing through all constellations.
- `completeConstellationGame()` – logs with `logGameActivity('constellation_connect', ...)`, shows the summary view, and toasts a localized "Constellation Master" message.

All games log activity through `logGameActivity(...)` in `firebase.js`, which centralizes any future analytics or history features.

### Crew dashboard

**File:** `js/crew.js` (used by `crew.html`)

This module renders the crew grid, high‑stress alerts, and summary stats using real‑time Firestore subscriptions.

Initialization:
- On `DOMContentLoaded`, attaches an `auth.onAuthStateChanged` handler:
  - If a user exists, calls `initializeCrewDashboard()`.
  - Otherwise, redirects to `login.html`.

Core flows:
- `initializeCrewDashboard()`:
  - Shows a loading state.
  - Calls `subscribeToCrewMembers()` and `subscribeToAlerts()`.
  - Marks connection status as `online` in the UI.
- `subscribeToCrewMembers()` – sets up a snapshot listener on `db.collection('users').orderBy('lastCheckIn', 'desc')`, populating the `crewMembers` array and then:
  - `renderCrewMembers()` – renders `.crew-card` elements ordered by stress severity and online/offline.
  - `updateCrewStats()` – updates summary cards (total crew, online now, high stress count), and toggles a high‑stress indicator banner.
- `subscribeToAlerts()` – listens to active documents in `crewAlerts`, updates `activeAlerts`, and for each new alert:
  - Renders an alert banner in the "Active Alerts" section via `createAlertCard`.
  - Plays an audible chime (`playAlertSound()`).
  - Shows a toast and, if browser notifications are enabled, a native notification.

User actions:
- `filterCrew(filter)` – filters `crewMembers` by `all`/`online`/`high-stress` and re‑renders the grid.
- `dismissAlert(alertId)` – marks `crewAlerts/{id}` as inactive and records who dismissed it.
- `offerSupport(memberId, memberName)` – writes a support notification into `users/{memberId}/notifications` and optionally opens the chatbot as a follow‑up.
- `refreshCrewData()` – briefly shows a syncing state and then a toast that data is up to date.
- `requestNotificationPermission()` – asks the browser for notification permission and toasts on success.

The module surfaces its main entrypoints on `window` (`filterCrew`, `refreshCrewData`, `dismissAlert`, `offerSupport`, `requestNotificationPermission`) so that `crew.html` can call them from inline event handlers.

### Chatbot (Gemini integration)

**File:** `js/chatbot.js` (used by all main pages)

- Manages the floating ASTRA chat widget (open/close, input handling, scrolling, typing indicator).
- Communicates with Google’s Gemini API via `fetch` to `GEMINI_API_URL`, using `GEMINI_API_KEY` defined at the top of the file.
- Builds a rich system prompt (`ASTRA_SYSTEM_PROMPT`) describing ASTRA’s role, tone, and constraints, and appends a language instruction based on `localStorage['astra_language']` so responses match the currently selected UI language.
- Maintains `conversationHistory` in a Gemini‑compatible shape and includes up to 10 previous turns when making requests.
- On each message:
  - Appends a user bubble to the chat window and saves it using `saveChatMessage(message, 'user')` if available.
  - Calls `getAstraResponse(userMessage)` to hit the Gemini API, handling common HTTP errors and safety‑blocked responses.
  - Appends ASTRA’s reply and saves it as `sender: 'astra'`.
- If the API key is misconfigured or a network/API error occurs, falls back to deterministic, localized canned responses chosen by keyword (stress, loneliness, sleep, greetings, etc.) using translation keys from `translations.js`.
- `loadChatHistory()` rehydrates the last N messages from `getChatHistory` so past conversations persist across page reloads.

Key globals exported on `window` for use from HTML/other scripts: `toggleChatbot`, `openChatbot`, `sendQuickResponse`, `clearChat`, `testGeminiAPI`.

### Styling and shared UI components

**File:** `css/styles.css`

This stylesheet defines the visual identity and reusable components used by all pages:
- Root CSS variables for the "space" color palette and glow effects.
- Animated starfield layers (`#stars`, `#stars2`, `#stars3`) and twinkling animations.
- Reusable classes for navigation links, primary/secondary/danger buttons, cards, inputs, sliders, the circular stress gauge, badges, modals, loader spinners, chat messages, crew cards, game containers, constellation stars, breathing circle, alert banners, and connection status indicators.
- Responsive tweaks for mobile (e.g., smaller gauges/game containers, chat window width, breathing circle size).

Most visual tweaks for new features should be implemented by extending these existing primitives rather than introducing unrelated styling patterns.

## Data model quick reference

In Firestore, the app uses the following collections and subcollections (all inferred from the JavaScript code):
- `users` – documents keyed by Firebase Auth UID; core user profile and current status.
  - `stressHistory` (subcollection) – individual stress check records.
  - `recommendations` (subcollection) – logged recommendations shown to the user.
  - `gameActivity` (subcollection) – per‑session logs for the games.
  - `chatHistory` (subcollection) – user/ASTRA chat transcript.
  - `notifications` (subcollection) – support notifications between crew members.
- `crewAlerts` – high‑stress alerts raised when a user’s stress level is `high`.

When adding new features that persist data, keep this shape in mind and prefer adding to these existing collections/subcollections rather than inventing parallel structures, unless the feature clearly warrants a new top‑level collection.
