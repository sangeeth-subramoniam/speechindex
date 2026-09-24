# PRD — Speech Cards (speechindex)

Simple, offline-first communication cards (v1: deliberately minimal) for a stroke survivor recovering speech.
One HTML page, swipeable, big, bilingual (English + Tamil), hosted on GitHub Pages,
installed as a home-screen app on an Android phone.

Author: PRD drafted with Claude Fable 5.1 on 2026-09-22. Development to be done by another model — see §11.
**Status: built and live** at https://sangeeth-subramoniam.github.io/speechindex/ (2026-09-22).
See the test checklist at the end of §11 for what is verified and what still needs the phone.

---

## 1. Problem

Amma had a stroke recently and is doing physio + speech therapy. Until speech returns she
gets frustrated trying to say basic things (water, toilet, pain, call someone). She needs
a way to point at what she wants that is faster and less tiring than gesturing, and that
a caregiver can understand instantly.

## 2. User

- **Primary:** Amma. Android phone. Reads English; Tamil is her mother tongue (Tamil shown
  as help text). Assume reduced fine-motor control on one side, possibly reduced attention
  and reading stamina. She should never have to read instructions.
- **Secondary:** Caregiver / family member who reads the card she shows, or hears it spoken.
- **Maintainer:** Sangeeth — edits the card list, pushes to GitHub.

## 3. Goals

1. She can express any of ~30 everyday needs in ≤ 2 taps and ≤ 3 swipes.
2. Works with **no internet** after the first load. Internet is only needed to pick up updated cards.
3. Everything is big: icons, text, touch targets. Zero small UI.
4. Nothing to learn: only two gestures — **swipe** to change page, **tap** a card.
5. Maintainable by editing one plain data file and pushing.

## 4. Non-goals (for v1)

- No accounts, backend, analytics, or database.
- No typing / on-screen keyboard.
- No languages beyond English + Tamil.
- No card editing inside the app (edit the data file instead).
- No iOS-specific work (Android phone is the target; it will still mostly work on iOS).
- No Tamil speech / voice packs / audio files — speech is English via the phone's built-in voice.
- No arrow buttons, pain sub-pages, photo icons, or update banners. Keep v1 minimal; features
  get added later only if Amma actually needs them.

## 5. Decisions already made

| Question | Decision |
|---|---|
| Device | Android phone, Chrome, installed via "Add to Home screen" |
| Cards per page | 4 (2 × 2 grid) |
| Tap action | Card enlarges to full screen **and** the phone speaks the word |
| Text | **English primary** (large), **Tamil help text** below (smaller) |
| Navigation | Horizontal swipe between pages, left/right |
| Icons | Emoji (built-in on Android, zero assets, works offline) |
| Hosting | GitHub Pages, repo `speechindex` under **github.com/sangeeth-subramoniam** (personal account, NOT the work account) |
| Stack | Plain HTML + CSS + JS. No framework, no build step, no dependencies. |

## 6. Functional requirements

### 6.1 Card grid (P0)
- A page holds **1 to 6 cards** filling the viewport (minus the top page-dots and the bottom
  Yes/No bar). Four cards is the 2 × 2 grid; with three the last card spans both columns; with
  two they stack full-width; one fills the page. Five and six go to a 2 × 3 grid — English and
  Tamil keep their minimum sizes and the emoji shrinks (45px at 360 × 640) to make room. No
  vertical scrolling anywhere, on a 360 × 640 CSS-px screen.
- Card content: emoji icon (top, huge), English label (large, bold), Tamil label (below, smaller, lighter weight).
- Cards have a soft category colour background (see §7) and a dark, high-contrast border/text.
- Cards are defined in `cards.js` (see §8). Order in the file = order on screen.

### 6.2 Swipe between pages (P0)
- Native horizontal scroll with `scroll-snap-type: x mandatory`, one page per snap. No JS swipe library.
- Page indicator dots at the top, current page highlighted. Dots are large (≥ 16 px) but not tappable-critical.
- Body/document must not scroll vertically or bounce; `overscroll-behavior: none`.

### 6.3 Tap a card (P0)
1. Short haptic pulse (`navigator.vibrate(30)` if available).
2. Card animates (scale up ~200 ms, `prefers-reduced-motion` respected) into a full-screen overlay:
   emoji ≥ 40 vw, English label ≥ 48 px, Tamil label ≥ 32 px, same category colour.
3. The phone **speaks** the English label via `speechSynthesis` (see 6.4).
4. The overlay stays open until dismissed — she may be showing it to someone. Dismiss by tapping
   a very large ✕ / "Back" button (≥ 96 px) at the bottom, or the Android back button
   (push a history state on open, pop on close).
5. Tapping the enlarged card again repeats the speech.

### 6.4 Speech (P0)
- Use the Web Speech API (`speechSynthesis`). Cancel any in-progress utterance before speaking.
- Always speak the **English** label (or the card's optional `speak` override) with the device's
  default English voice, rate ~0.9. No voice-pack setup, no Tamil speech, no audio files.
- If `speechSynthesis` is unavailable, fail silently — the enlarged card is still shown.

### 6.5 Yes / No bar — REMOVED 2026-09-23

Dropped at Sangeeth's request along with 12 cards. The freed height goes to the cards, whose
emoji grew from 70px to 102px at 360 x 640.

### 6.6 Offline / installable (P0)
- `manifest.webmanifest`: `display: standalone`, `orientation: portrait`, `start_url: ./`,
  `scope: ./`, `background_color`/`theme_color` matching the app, 192 & 512 px PNG icons (maskable).
- Service worker `sw.js`, **cache-first** for every app asset, precached on install with a
  versioned cache name (`speech-cards-v1` …). On `activate`, delete old caches.
- All URLs **relative** (`./`), because the site lives at `/speechindex/`, not the domain root.
- Updates: new SW installs in the background when online and activates on the next launch
  (`skipWaiting` + `clients.claim`). Bumping `CACHE_VERSION` is the release mechanism.
- Verify: load once online → airplane mode → kill app → reopen from home screen → fully functional.

### 6.7 Touch & input hygiene (P0)
- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`.
- `touch-action: manipulation` on interactive elements (kills double-tap zoom delay).
- `user-select: none`, `-webkit-touch-callout: none`, and `contextmenu` prevented on cards
  so long-presses do nothing surprising.
- Ignore taps that happen while a scroll-snap is in flight (check `pointerdown` → `pointerup`
  travel < 10 px) so a swipe never accidentally opens a card.
- Use the full safe area (`env(safe-area-inset-*)`).

## 7. Content — card set (14 cards over 4 pages)

English primary, Tamil help text. Colour = category. **Tamil strings still need Sangeeth's review.**

Revised 2026-09-23: removed Sleep, Medicine, Hot, Cold, Bath, Exercise, Go outside, Charger,
Happy and Tired, plus the fixed Yes / No bar. The reason is clinical, not cosmetic — Amma is six
days post-surgery and newly discharged, and the app should stay as positive and as small as
possible. Cards get added back as she improves.

Sit up moved from Comfort to Needs, because Comfort would otherwise have been a page holding
one card. Feelings became empty and the page was dropped.

2026-09-24: Bath added back, on page 3 rather than page 1. Page 1 was already full, and a fifth
card there would have forced the 2 x 3 grid and shrunk the emoji on the most-used page from
102px to about 58px. Page 3 had room and keeps its 2 x 2 layout.

| Page | Category (colour) | Cards |
|---|---|---|
| 1 | Needs (blue) | 💧 Water · தண்ணீர் — 🍚 Food · சாப்பாடு — 🚽 Toilet · கழிவறை — 🪑 Sit up · எழுந்து உட்கார |
| 2 | Health (pink) | 🤕 Pain · வலி — 🤚 Itching · அரிப்பு — 😵‍💫 Dizzy · தலைசுற்றல் — 😖 Headache · தலைவலி |
| 3 | Misc (teal) | 🚿 Bath · குளியல் — 🍵 Tea · டீ — ☕ Coffee · காபி — 🛐 Prayer · பிரார்த்தனை |
| 4 | Activity (green) | 📺 TV · டிவி — 🎵 Music · பாட்டு |

No fixed bottom bar.

## 8. Data format — `cards.js`

```js
// Edit this file, bump CACHE_VERSION in sw.js, commit, push. That's a release.
window.CARDS = {
  pages: [
    {
      category: "needs",            // key into COLORS
      cards: [
        { icon: "💧", en: "Water",  ta: "தண்ணீர்",  speak: "I need water" }, // speak optional
        { icon: "🍚", en: "Food",   ta: "சாப்பாடு" },
        { icon: "🚽", en: "Toilet", ta: "கழிவறை" },
        { icon: "🛏️", en: "Sleep",  ta: "தூக்கம்" },
      ],
    },
    // ...
  ],
  yesNo: {
    yes: { icon: "✅", en: "Yes", ta: "ஆமாம்" },
    no:  { icon: "❌", en: "No",  ta: "இல்லை" },
  },
};
```

Plain script (not an ES module, not JSON fetch) so it works from `file://` for quick local checks
and needs no CORS or bundling. Validation: if a page has ≠ 4 cards, log a console warning but still render.

## 9. Visual & accessibility spec

- Minimum sizes on a 360 px-wide phone: card emoji **≥ 64 px**, English label **≥ 26 px bold**,
  Tamil label **≥ 20 px**, Yes/No label ≥ 28 px. Every tap target ≥ 96 × 96 px.
- Fonts: system UI stack; Tamil renders with the Android system Tamil font (Noto Sans Tamil).
  No web fonts (offline, weight).
- Colours: soft pastel category backgrounds with near-black text; contrast ≥ 7:1 for text.
  Category colours must remain distinguishable for common colour-vision deficiencies — pair colour
  with the page position, never rely on colour alone.
- Light theme only.
- No hover-only affordances. No text smaller than 18 px anywhere, including page dots labels (none).
- Animations ≤ 250 ms, disabled under `prefers-reduced-motion`.
- Lighthouse: Accessibility ≥ 95, PWA installable, no console errors.

## 10. Hosting & accounts

- Repo: `github.com/sangeeth-subramoniam/speechindex`, public, GitHub Pages from `main` / root.
  Live URL: `https://sangeeth-subramoniam.github.io/speechindex/`.
- **Account status (verified 2026-09-22):** `gh` on this machine has **two** accounts:
  - `sangeeth-subramoniam` — **personal, active**, scopes `repo`, `workflow`. Use this one.
  - `atf-sangeeth-subramoniam` — work account, inactive. **Never** create/push with it.
  - The repo `sangeeth-subramoniam/speechindex` does **not exist yet** — create it in step 6 of §11.
- **Account checklist — run before the first commit/push, in this order:**
  1. `gh auth status` → confirm `sangeeth-subramoniam` shows `Active account: true`.
     If not: `gh auth switch --user sangeeth-subramoniam`.
  2. `git init` (the folder is not a git repo yet), then repo-local config — **not** `--global`:
     ```
     git config user.name  "Sangeeth Subramoniam"
     git config user.email "sangeethsubramoniam@gmail.com"
     ```
  3. `git config user.email` must print `sangeethsubramoniam@gmail.com`. The work address
     (`@aktsk.ai`) must never appear in `git log`.
  4. Create + push: `gh repo create sangeeth-subramoniam/speechindex --public --source=. --remote=origin --push`
     then confirm `git remote -v` shows `https://github.com/sangeeth-subramoniam/speechindex.git`.
  5. Enable Pages from `main` / root:
     `gh api -X POST repos/sangeeth-subramoniam/speechindex/pages -f 'source[branch]=main' -f 'source[path]=/'`
     then poll `gh api repos/sangeeth-subramoniam/speechindex/pages --jq .status` until `built`
     and check `https://sangeeth-subramoniam.github.io/speechindex/` returns 200.
  6. Leave `gh` on the personal account unless Sangeeth asks to switch back.
- No secrets, no CI needed. (Optional later: Pages deploy workflow — not required, root deploy is enough.)
- Install on the phone: open the URL in Chrome → ⋮ → *Add to Home screen* (or *Install app*).
  Name it "Speech Cards". README must have this as a 4-step illustrated list.

## 11. Handoff notes for the implementing model

Build order — each step is verifiable on its own:

1. `index.html` + `styles.css` + `app.js` + `cards.js` rendering the 2 × 2 grid with scroll-snap
   pages and dots. Verify at 360 × 640 and 412 × 915 in Chrome devtools: no vertical scroll, sizes per §9.
2. Tap → overlay + speech + back-button handling + haptic. Verify speech on a real Android phone
   (emulator TTS is unreliable).
3. Yes/No bar.
4. `manifest.webmanifest`, icons (generate 192/512 PNG from a simple SVG — a speech bubble), `sw.js`.
   Verify offline via devtools "Offline" and on the phone in airplane mode.
5. README: how to edit cards, how to release (bump version + push), how to install on the phone,
   account-switching checklist.
6. Follow the account checklist in §10 exactly: init, repo-local git config, create repo under the
   personal account, push, enable Pages, confirm the live URL loads and installs on the phone.

Files:

```
speechindex/
  index.html
  styles.css
  app.js
  cards.js
  sw.js
  manifest.webmanifest
  icons/icon-192.png  icons/icon-512.png  icons/icon.svg
  README.md
  PRD.md
```

Local run: `python3 -m http.server 8080` in the repo, open `http://localhost:8080/`. Service workers
need `localhost` or HTTPS — `file://` is fine for layout only.

Test checklist — **status as of 2026-09-22**, verified with Playwright driving real Chrome
with touch emulation at 360 x 640 and 412 x 915, against both localhost and the live URL:

- [x] 360 x 640: all 4 cards visible, nothing clipped, no vertical scroll, dots + Yes/No visible.
- [x] Swipe left/right snaps exactly one page; a swipe never opens a card.
- [x] Tap card -> overlay + speech; close button and browser back both close it; tapping again re-speaks.
- [x] Yes / No speak and flash.
- [x] Airplane mode after first load: cold start renders everything and taps still work (emulated offline,
      on the live HTTPS URL, with the service worker scoped to /speechindex/).
- [x] Edit a label in `cards.js`, bump version -> launch 1 keeps the old copy, launch 2 shows the change,
      old cache deleted, new version still works offline.
- [x] Pushed from the personal account; commit author is sangeethsubramoniam@gmail.com, no work email
      anywhere in history.

Still to confirm on the actual phone (cannot be done from this machine):

- [ ] Real text-to-speech output — the tests stub `speechSynthesis` to assert the right words are
      requested; only a real device proves a voice is installed and audible.
- [ ] Haptic buzz on tap (`navigator.vibrate` is a no-op on desktop).
- [ ] "Add to Home screen" and launching standalone with no address bar.
- [ ] Genuine airplane mode, as opposed to emulated offline.

**Two bugs found and fixed during implementation**, both in `sw.js` and both invisible until a second release:
1. `cache.addAll()` precached through the browser HTTP cache, so a new release re-cached the *old*
   `cards.js` — the version bumped but the content never changed. Now precaches with
   `fetch(new Request(url, { cache: "reload" }))`.
2. The fetch handler used the global `caches.match()`, which searches every cache, so during a version
   changeover it could serve files from the previous release. Now scoped to `CACHE_VERSION`'s cache only.

## 12. Open items for Sangeeth

1. Review / correct the Tamil strings in §7 (colloquial vs. formal — how does Amma say "toilet", "doctor"?).
2. Any cards to add / remove from the 28.
3. ~~App name on the home screen~~ — **resolved: "Speech Cards"** (manifest `name` and `short_name`).

Resolved: git email is `sangeethsubramoniam@gmail.com`; GitHub personal account is logged in and active (§10).
