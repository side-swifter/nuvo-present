# Operating the deck

## Opening it

Open https://present.getnuvo.net (or `presentation/index.html`) in **Chrome**. Choose the keynote deck, then a mode:

| Mode | Use it for | What shows |
|---|---|---|
| **Present** | The real talk | Only the slides. No hints, timer or progress bar. |
| **Practice** | Rehearsing together | Slides plus a coaching bar: whose turn it is, the line with words lighting up as they should be said, a countdown to the next handoff, the next line, a clock and a coloured timeline of the whole talk. A banner flashes on every handoff. |
| **Run-through** | Learning the words | Slides on the left, the full script on the right. The current line is highlighted and follows along. Click any line to jump to it. |

Press **M** to cycle modes while it is running.

## Starting a talk

1. Press **F** for fullscreen on the projector screen.
2. Press **P** to open the presenter window and drag it to the laptop screen. It shows the script, who speaks next and a clock, and has the same controls.
3. The cover stays up while you walk on. Press **->** once when you start talking.
4. After the countdown (default 3 s) it plays by itself. Each visual fires on a clock timed to the script.

## Keys

| Key | Action |
|---|---|
| `->` or your clicker | Next beat now **and re-sync the clock**. Use it when you are ahead. |
| `<-` | Back one beat |
| `Space` | Pause or resume the clock. Use it when you are behind. |
| `A` | Auto-run on or off (off = one click per beat) |
| `+` / `-` | Speed the clock up or down 5% |
| `M` | Cycle present, practice, run-through |
| `S` | Settings (pauses the talk while open) |
| `P` | Presenter window |
| `T` | On-screen timer |
| `B` / `.` | Blackout |
| `F` | Fullscreen |
| `Esc` | Close settings |

Jump straight to a beat with `rtp-keynote.html#30`. Add `?mode=practice`, `?mode=run` or `?mode=present` to pick a mode from a link.

## Settings

Open from the picker page or with **S** in the deck. Saved in the browser (`localStorage`), so set them on the computer that will present.

- **How to run it** - present, practice or run-through.
- **Speaking speed** - overall multiplier (0.50 to 1.80). Slider, Slower/Normal/Faster buttons, or type a number. The talk length is shown.
- **Calibrate by reading aloud** - read a short passage; it measures your pace and sets the speed.
- **Speed for each person** - separate speed for Akaash and Shaurya, on top of the overall one. Slider or typed number. Changing it mid-run re-times the rest of the talk and keeps your place.
- **Countdown** - none, 3 s or 5 s before the first line.
- **Auto-run** - whether beats fire on the clock.
- **Adapt to my pace** - every time you press `->` early or late, the clock learns your real pace and re-times everything after it.
- **Energy** - Calm, Balanced (default) or Lively. Each beat is tagged calm, normal or big in the code. Balanced lets about a fifth of the beats pop (bounces, wobbles) while most use soft eases and slower motion so the judges can follow. Calm drops every beat one level; Lively raises every beat one level.
- **Performance** - Auto, Lite or Full. Lite turns off floating shapes, confetti and glow. Auto switches to Lite if the first seconds run under about 40 fps.
- **Confetti** and **Background motion** - individual switches.

## If you drift off script

- Ahead of the clock: press `->`. It jumps to the next beat and re-syncs.
- Behind the clock: press `Space` to pause, then `Space` again when you catch up.
- Very different pace overall: use the speed slider or let **Adapt** learn it.
- Screen frozen or laggy: `B` to blackout while you recover, switch Performance to **Lite**, and close other heavy tabs. Make sure Chrome hardware acceleration is on.

## Before the event checklist

- Run **Practice** at least twice with both speakers. Set each person's speed.
- Open the deck once on the actual presenting laptop (the first load downloads about 10 MB of media).
- Check the projector resolution. Stage is 16:9; other ratios get letterboxed.
- Keep the backup (`rtp-readable.html`) one click away.

## Big screens and TVs

The slides are drawn on a 1920x1080 stage and scaled to the screen, so they stay sharp up to 4K. The practice bar, run-through panel, settings and hints scale with the screen width too. Waitlist dots and the phone video render at full resolution. For a TV: connect it as the second display, press `F`, and run `Present`; the 16:9 stage fills it. On a non-16:9 display the stage is centred with bars at the sides.
