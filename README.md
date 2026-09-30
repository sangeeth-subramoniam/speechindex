# Speech Cards

Simple communication cards for someone recovering speech after a stroke.
Big cards, English with Tamil underneath, swipe between pages, tap a card to
enlarge it and hear the Tamil word spoken aloud.

**Live app:** https://sangeeth-subramoniam.github.io/speechindex/

Works with no internet once it has been opened once. No accounts, no tracking,
no data leaves the phone.

---

## Put it on the phone

1. Open **https://sangeeth-subramoniam.github.io/speechindex/** in **Chrome** on the phone.
2. Tap the **⋮** menu (top right).
3. Tap **Add to Home screen** (it may say **Install app**).
4. Confirm. A **Speech Cards** icon appears on the home screen — open it from there,
   not from the browser. It fills the screen, with no address bar.

After this the phone can be in airplane mode and the app still works.

---

## How she uses it

- **Swipe left / right** — move between the 4 pages of cards. It stops at both ends.
- **Tap a card** — it fills the screen and speaks the Tamil word aloud.
  Tap the big card again to repeat it.
- **Back** (the big button, or the phone's back button) — return to the cards.

---

## Changing the cards

Everything she sees lives in one file: **`cards.js`**. Nothing else needs touching.

Each card looks like this:

```js
{ icon: "💧", en: "Water", ta: "தண்ணீர்", speak: "I need water" }
```

| Field   | What it is                                                        |
|---------|-------------------------------------------------------------------|
| `icon`  | The emoji shown on the card                                        |
| `en`    | The big English word                                               |
| `ta`    | The Tamil help text underneath                                     |
| `speak` | Optional. What the phone says out loud. Leave it out and it says `en`. |

**Rules**
- A page holds **1 to 6 cards**. Four gives the usual 2 × 2 grid; with fewer, the
  cards grow to fill the page. Five or six switch to three rows — the words stay the
  same size, the emoji gets smaller to make room.
- `category` sets the page colour. Use one of:
  `needs` `health` `comfort` `people` `activity` `feelings` `misc`.
- Keep English labels short. Two words fit comfortably; three start to wrap.

### Example: adding a card

Find the page you want in `cards.js` and add a line to its `cards` list:

```js
{ icon: "📞", en: "Call Sangeeth", ta: "சங்கீத்தை கூப்பிடு", speak: "Please call Sangeeth" },
```

If that page already has 6 cards, either take one out or start a new page:

```js
{
  category: "people",
  cards: [
    { icon: "📞", en: "Call Sangeeth", ta: "சங்கீத்தை கூப்பிடு", speak: "Please call Sangeeth" }
  ]
},
```

Then generate its Tamil audio clip — see the next section. Until you do, that one
card still works, it just speaks the English `speak` text instead of Tamil.

---

## The Tamil voice

Tapping a card speaks its Tamil word using a short pre-recorded audio clip — not the
phone's own text-to-speech. Most Android phones have no Tamil voice installed, so
relying on one would leave the app silent on her phone specifically. A pre-recorded
clip works everywhere, with no setup, exactly like the rest of the app.

The clips are generated locally with **macOS's built-in Tamil voice ("Vani")** — free,
offline, no account, no cost. Nothing is sent to any online service.

**After adding or changing a card in `cards.js`, run:**

```sh
node tools/generate-audio.js
```

This reads `cards.js`, and for every card whose audio doesn't exist yet, creates
`audio/<card-name>.m4a` by speaking its `ta` text. It skips cards that already have
a clip — pass `--force` to regenerate everything. Then commit the new files in
`audio/` along with your `cards.js` change and the usual `CACHE_VERSION` bump.

**Requires a Mac.** If you're on a different computer: generate the clip any other
way (any Tamil text-to-speech, even a phone app), save it as an `.m4a`, and place it
at `audio/<card-name>.m4a` — the name is the English label, lowercased, with spaces
and punctuation turned into dashes (`"Sit up"` → `sit-up.m4a`, `"TV"` → `tv.m4a`).

**If a card's clip is missing:** the app still works — that one card falls back to
speaking the English `speak` text (or `en` if there's no `speak`) instead of staying
silent. It's not a broken release, just a card waiting for its clip.

---

## Releasing a change

The app caches itself on the phone so it works offline. That means a change only
reaches the phone if the version number changes too. **Two edits, every time:**

1. Make the change in `cards.js` (or anywhere else).
2. Open `sw.js` and bump the version on line 6:
   ```js
   var CACHE_VERSION = "speech-cards-v1";   //  ->  "speech-cards-v2"
   ```
3. Commit and push:
   ```sh
   git add -A
   git commit -m "Update cards"
   git push
   ```

GitHub Pages redeploys in about a minute.

**On the phone:** open the app once **while online** — it downloads the new version
in the background and still shows the old cards. Close it and open it again, and the
new cards are there. If it seems stuck, open it once more.

> If you forget to bump `CACHE_VERSION`, the phone keeps showing the old cards
> forever. This is the one step that is easy to miss.

---

## Running it on your computer

```sh
cd speechindex
python3 -m http.server 8080
```

Then open http://localhost:8080/ and use Chrome's device toolbar (⌘⇧M) at 360 × 640.

Offline behaviour needs `localhost` or `https`, so use the server above rather than
opening `index.html` directly.

---

## Account checklist

This is a **personal** project. The machine also has a work GitHub account, so check
before pushing:

```sh
gh auth status          # sangeeth-subramoniam must be the Active account
git config user.email   # must be sangeethsubramoniam@gmail.com
```

If the wrong account is active:

```sh
gh auth switch --user sangeeth-subramoniam
```

The email is set per-repo, so it does not affect work repositories.

---

## What's in here

| File                   | What it does                                          |
|------------------------|-------------------------------------------------------|
| `cards.js`             | **The card content — this is the file you edit.**      |
| `index.html`           | The page structure                                     |
| `styles.css`           | Sizes, colours, layout                                 |
| `app.js`               | Swiping, tapping, speech, the enlarged card            |
| `sw.js`                | Makes it work offline. Bump the version to release.    |
| `manifest.webmanifest` | Name and icon for the home screen                      |
| `icons/`               | App icon                                               |
| `audio/`               | One Tamil pronunciation clip per card                  |
| `tools/generate-audio.js` | Generates those clips from `cards.js`               |
| `PRD.md`               | What was built and why                                 |

No frameworks, no build step, no dependencies. Plain HTML, CSS and JavaScript.

---

## Notes

- Speech is a pre-recorded Tamil clip per card (see "The Tamil voice" above), not the
  phone's own text-to-speech — it needs no voice pack installed on her phone.
- The voice is a synthesized one (macOS's Tamil TTS voice, "Vani"), not a recording of
  a real person. If a more natural voice matters more than the simplicity of
  generating clips locally, a family member could record each word instead — the
  file format and naming would stay exactly the same.
- If a card's audio clip is ever missing, it falls back to speaking the English text.
- Designed for an Android phone in portrait. It works on iOS too, though
  "Add to Home screen" lives in the Share menu there.
