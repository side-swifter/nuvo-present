# Editing the deck

## Change the words

The spoken script is the `line` argument of each `bt(...)` call in `tes-keynote.html`, for example:

```js
bt('A', 'Three weeks.', el => { ...animation... }, 1.6),
```

Edit `line` to change what the presenter window, practice bar and run-through show, and the number of words drives the timing. If you change a line's start, update its key in the `DELIVERY` table (the match is a lower-cased `startsWith`, with straight apostrophes) or it falls back to normal speed with a short pause.

## Change how a line is delivered

In `DELIVERY`, each entry is `'line start': [rate, pauseSeconds]`.

```js
'nobody wants to lose': [.65, 1.3],   // say it slowly, then pause 1.3 s
'abc11': [1.25, .1],                  // rattle off the list
```

The total is always rescaled to `TARGET` (180 s). Change `TARGET` to make the whole talk longer or shorter.

## Change an animation

Each beat's `run(el)` builds a GSAP timeline with elements found by class inside the scene:

```js
bt('S', 'Set a goal.', el => { const tl = T(), c = $$('.sc', el)[0];
  tl.fromTo(c, { x: 400, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: .8, ease: 'back.out(1.5)' }, .2);
  return tl; }, 1.4),
```

Helpers: `T()` new timeline, `$`/`$$` query inside the scene, `rnd(min,max)`, `countTo(tl, el, value, at, duration, prefix, suffix)`, `burstAt(el, n)` (confetti; only fires for `n >= 90`), `ico(name, size)` inline icons, `logoTile(size)` the Nuvo app-icon tile, `words(str)` for masked word-by-word text reveals.

Rules that keep it replayable and smooth:

- Start every element hidden with the `hid` class and reveal it in the timeline. Never leave state that only exists after an earlier beat ran unless that beat ran.
- Hide or move away anything the next beats should not share the screen with.
- Animate `transform` and `opacity` (`x`, `y`, `scale`, `rotation`, `autoAlpha`). Avoid animating filters and shadows.
- For lines that should draw on, use `pathLength="1000" stroke-dasharray="1000" stroke-dashoffset="1000"` and tween `strokeDashoffset` to 0.

## Add a scene

Push a new object onto `S` in the order it should appear:

```js
S.push({
  title: 'My scene', theme: 'light',
  html: () => `<div class="abs hid thing" style="left:100px;top:100px">...</div>`,
  beats: [ bt('A', 'First phrase.', el => T().fromTo($('.thing', el), { autoAlpha: 0 }, { autoAlpha: 1 }), 1.2) ]
});
```

Also add a background mood entry to `MOODS` (4 numbers for the two background blobs). The schedule, presenter window, practice timeline and run-through list all pick the new beats up automatically.

## Change the people

Photos live in `assets/img/` (`akaash.jpg`, `shaurya.jpg`, `akshay.jpg`). `FACE` maps initials to files for the avatar clusters; the leaderboard rows and title scene reference the files directly in their templates.

## Swap media

- **Press images**: files in `assets/press/`, listed in the `PRESS` array.
- **Demo phone videos**: `assets/video/`. The `WALL` array lists the clips for the wall of people.
- **Phone pull-back**: `assets/video/phone-pull.webm`. To make a new one, export frames with a transparent background and encode:

```bash
ffmpeg -framerate 25 -i frames/p_%03d.png -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 33 -auto-alt-ref 0 -row-mt 1 -g 25 assets/video/phone-pull.webm
```

- **Small wall clips** (300 px wide, 6 s, no audio):

```bash
ffmpeg -t 6 -i input.mov -vf "fps=24,scale=300:-2" -c:v libx264 -crf 30 -preset fast -pix_fmt yuv420p -an -movflags +faststart assets/video/w_name.mp4
```

## Make a deck for another event

1. Copy `tes-keynote.html` to a new file.
2. Replace the scenes and beats with your script (keep the `bt` structure), update `DELIVERY` and `TARGET`.
3. Add a card for it in `index.html`.
4. The settings, modes, presenter window and timing engine work unchanged.

## Testing without a screen

The deck exposes `window.NUVO` (`next()`, `prev()`, `beats` with `beats.total`, `cur`, `pace`). You can drive it with Chrome DevTools Protocol (headless Chrome, `--remote-debugging-port`), press `->` programmatically, screenshot each beat, and check `NUVO.beats.total`. Headless Chrome has no GPU, so it is good for correctness (errors, layout, timing) but not for judging smoothness; check that on a real screen.
