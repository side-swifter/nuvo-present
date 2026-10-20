# How the keynote deck works

Everything is in `presentation/rtp-keynote.html` (CSS, markup templates and script in one file) plus `assets/settings.js`.

## The idea

A normal deck shows sentences; people read faster than you talk and stop listening. This deck instead has **one visual beat per phrase of the script** (65 in total). A clock fires each beat at the moment its phrase should be spoken, so the picture lands with the words.

## Data model

```
S = [ scene, scene, ... ]                // 8 scenes: cover, title, problem, solution, edge, traction, ask, thank-you
scene = { title, theme, html(), init(el), beats: [ beat, ... ] }
beat  = bt(who, line, run(el) -> gsap timeline, min)
```

- `theme` is `light`, `dark` or `blue` and recolours the page background.
- `html()` returns the scene's markup as a string. Elements that start hidden carry the class `hid`; `mount()` hides them with GSAP before the first beat.
- `init(el)` runs once after mounting (e.g. set up a canvas, set initial values).
- `bt(who, line, run, min)`: `who` is `'A'` (Akaash) or `'S'` (Shaurya), `line` is the exact spoken text, `run` builds and returns a GSAP timeline, `min` is the minimum animation length in seconds.

A scene is **replayable from any beat**: `mount(scene, upTo)` rebuilds the DOM and fast-forwards earlier beats (`ff = true` suppresses confetti and video), then plays the target beat. This is what makes going back (`<-`), jumping (`#30`) and re-timing safe.

## Timing

1. `DELIVERY` maps the start of each line (lower-cased) to `[rate, pause]`: how fast it is said (1 = normal, below 1 slow and dramatic, above 1 rattled off) and how long to pause after it.
2. For each beat: `dur = max(words / (WPS * rate), min * .45)` and `gap = pause (+ .9 s at a scene change)`.
3. Everything is scaled once so the whole talk lands on `TARGET = 180` seconds. The scaled values are stored as `dur0` and `gap0`.
4. `buildSchedule()` divides `dur0` and `gap0` by the speaker's multiplier (`paceA` or `paceS`) and accumulates `beat.at`, the start time of every beat. It runs at startup and whenever a per-speaker speed changes.
5. A 60 ms interval compares `clockNow()` (elapsed time x `pace`) to `beats[cur+1].at` and calls `show()` when it is due.
6. `fitBeat()` squeezes a beat's animation into its slot (up to 2.2x) so a drawing animation is not cut off by the next beat.

Pressing `->` calls `show(cur+1)` and `rebase()`, which moves the clock origin so the next scheduled time is measured from now. If **Adapt** is on it also nudges `pace` toward the speakers' real rate (about 45% of the error each press, clamped to 0.6 to 1.6).

## Modes

`document.body.dataset.mode` is `present`, `practice` or `run`. CSS rules like `body[data-mode=present] #practice { display:none }` hide the extras. `applyMode()` re-fits the stage (practice reserves 210 px at the bottom, run-through gives the slides 62% of the width). `hud()` drives the practice bar and `runHud()` the script panel; both read `beats[].at/.dur` so word highlighting follows each line's own speed.

## Stage and scaling

`#stage` is a fixed 1920x1080 box scaled with `transform: scale()` by `fit()`. All coordinates in templates are in that space. Slide transitions use two full-screen "curtain" divs (`#c1`, `#c2`) that sweep across while the scene swaps behind them.

## Settings (`assets/settings.js`)

A tiny module on `window.NuvoSettings`: `get()`, `set(patch)`, `onChange(fn)`, `render(el, opts)`. State lives in `localStorage['nuvo-settings']`. The picker page and the deck both call `render()`, so the panels are identical. The deck subscribes with `onChange` and reacts: `pace`, `paceA/paceS` (rebuilds the schedule and keeps your place), `auto`, `mode`, `perf`. Defaults are in `DEF`.

## Media

- `phone-pull.webm`: VP9 with alpha, the phone pulling back. Edge feathering is baked into the alpha so no CSS mask is needed (masks on a playing video are expensive).
- `w_*.mp4`: small 300 px wide app recordings for the "wall of people" beat.
- `aarin.mp4` and friends: larger phone recordings used in the "edge" scene.
- Videos are preloaded (hidden `<video preload=auto>`) before the deck starts so nothing buffers on stage.

## Performance notes

- Ambient shapes and confetti draw on canvases at half resolution; the ambient loop skips every other frame and pauses when the tab is hidden.
- The 1,400-dot waitlist board draws only the newly revealed dots; dimming is a CSS opacity change.
- Avoid animating `filter`, `box-shadow`, `letter-spacing` or `text-shadow` on large elements; animate `transform` and `opacity`.
- Lite mode (`body.lite`) hides decorative layers and disables confetti. Auto mode samples about 150 frames at the start and switches to Lite if more than 35% of them take over 28 ms.
- Line-draw animations use `pathLength="1000"` with `stroke-dasharray="1000"`. Do not use a path length of 1: GSAP rounds the dash offset to whole numbers and the line pops instead of drawing.

## The presenter window

`P` opens a popup written with `document.write` containing the script and controls. It talks to the deck through `window.opener.NUVO` (`next`, `prev`, `pause`, `auto`, `pace`, `beats`, `cur`). The deck calls `notes.update(cur, state)` on every beat.

## Backup deck

`rtp-readable.html` is an earlier, simpler design: 7 slides, GSAP timelines with click-through steps, no timing engine. It shares fonts and the phone video.

## Energy levels

Each beat has a level from the `HI` and `CALM` lists near `DELIVERY` (everything else is normal). `runBeat()` sets `CALMLVL` (the level plus the Energy setting's shift) before calling a beat's `run`. `T()` returns a timeline whose `to/from/fromTo` are wrapped when the level is 0: bouncy eases (`back`, `bounce`, `elastic`) become `power2.out`, durations grow 30%, staggers 25% and yoyo repeats halve. Confetti only fires for bursts of 100 or more particles, so it is reserved for a few big moments.

## Scaling

`fit()` computes `--ui = innerWidth / 1920` (clamped 0.7 to 3) and `window.__scale`. The coaching UI uses CSS `zoom: var(--ui)`; the waitlist canvas sizes itself by `__scale x devicePixelRatio` so dots stay crisp on 4K; ambient shapes and confetti scale with `--ui`.
