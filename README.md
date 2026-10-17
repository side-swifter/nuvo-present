# Nuvo Present

Animated, self-running pitch decks for **Nuvo** (getnuvo.net). Built for a 3-minute, two-speaker pitch (Teen Entrepreneur Summit 2026) where the slides *show* what is being said instead of repeating it.

Live: https://present.getnuvo.net

No build step, no framework. Plain HTML, CSS and JavaScript plus [GSAP](https://gsap.com) (vendored in `presentation/vendor`). Open `presentation/index.html` in Chrome, or serve the folder with any static server.

```bash
cd presentation && python3 -m http.server 5173   # then open http://localhost:5173
```

## What is in here

| Path | What it is |
|---|---|
| `presentation/index.html` | Picker page: choose a deck and a mode, edit settings |
| `presentation/tes-keynote.html` | **The main deck.** 65 timed beats, one visual per phrase of the script |
| `presentation/tes-readable.html` | Backup deck: ordinary text slides (Problem, Solution, Proof, Ask) |
| `presentation/assets/settings.js` | Shared settings module (speed, per-speaker speed, countdown, performance) |
| `presentation/assets/` | Fonts, logos, team photos, press images, phone video, app screen recordings |
| `presentation/_headers` | Cloudflare cache and robots headers |
| `wrangler.jsonc` | Cloudflare deploy config |
| `docs/` | Documentation (below) |

## Documentation

- [docs/OPERATING.md](docs/OPERATING.md) - how to run it: modes, keys, settings, what to do on stage
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - how the keynote deck works: scenes, beats, timing, modes, performance
- [docs/EDITING.md](docs/EDITING.md) - how to change the script, add a scene, swap media, make a new deck
- [docs/DEPLOY.md](docs/DEPLOY.md) - publishing to Cloudflare, cache behaviour

## Quick facts

- Designed at 1920x1080 and scaled to fit any screen.
- Visual language matches getnuvo.net (Barlow Condensed headlines, `#1268ff` blue, hard navy offset shadows, pill chips).
- Settings are saved per browser in `localStorage` under `nuvo-settings`.
- Tested in desktop Chrome. Safari and Firefox should work but are untested; the phone pull-back uses a transparent VP9 WebM, which Safari supports only on recent versions.

## Media and privacy

`assets/img` contains photos of the team, `assets/press` contains images taken from getnuvo.net press coverage, and `assets/video/*` contains screen recordings of the Nuvo app made by testers. Check you have the right to publish them before you reuse this repo for anything else, and remove or replace them if not.

No license has been chosen yet. Until one is added, all rights are reserved by the authors.

## One file per deck (please keep it this way)

Each slideshow lives in its own HTML file so two people can work on different decks without touching each other's work:

| File | Deck |
|---|---|
| `presentation/tes-keynote.html` | Teen Entrepreneur Summit 2026, 3-minute two-speaker pitch (script-timed, 65 beats) |
| `presentation/capitol-keynote.html` | Capitol keynote |
| `presentation/capitol-keynote-draft.html` | Earlier Capitol draft built on the TES engine (kept so nothing is lost) |
| `presentation/tes-readable.html` | Backup text slides for TES |

Rules of thumb: edit only your deck's file; if you change something shared (`assets/settings.js`, `assets/fonts`, `index.html`), pull first and keep the change backwards compatible. `npm run deploy` refuses to deploy if GitHub has commits you do not have, because a deploy replaces the whole live site.
