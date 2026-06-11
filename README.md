# Mapping Austrofascism — situated-storytelling prototypes

Public, runnable AR/WebXR prototypes from a research-through-design study that
translates the [Campus Medius](https://campusmedius.net) cartographic platform
into **situated, in-place storytelling** at a contested Austrofascist site in
Vienna — the gardens of Schönbrunn Palace, where the "Turks Deliverance
Celebration" (*Türkenbefreiungsfeier*) was held on 14 May 1933.

> These are **research artifacts, not products**. Each prototype exists to occupy
> one position in a design space and to teach one lesson about it. The design-space
> research and the paper live in a separate (private) repository; this repo
> publishes only the runnable sketches.

## What's here

**Real WebXR AR** (three.js + hit-test; **Android + Chrome/ARCore only**, tap to
place on a detected surface — not geo-pinned to the real site):

| | File | What it does |
|---|---|---|
| **P2 — ISOTYPE apparatus** | `p2-isotype-bildstatistik/webxr.html` | the verified apparatus placed at 1:1 as pictograms you walk among; attendance left blank; September contrast toggle |
| **P1 — perspective shift** | `p1-perspective-shift/webxr.html` | speaker vs participant standpoints; spatialised audio shifts as you walk (audio is **placeholder/synthetic, disclosed in-app**) |
| template | `_template/webxr.html` | reusable "place content in AR" shell every prototype starts from |

**Browser versions** (not AR):

| | File | Runs on |
|---|---|---|
| P2 flat board | `p2-isotype-bildstatistik/index.html` | any browser |
| P2 walk-through | `p2-isotype-bildstatistik/walk.html` | desktop only (WASD + mouse); press <kbd>2</kbd> for the September contrast |

The landing page (`index.html`) links everything. The AR demos load three.js
from a CDN; the browser demos are single-file vanilla JS with no dependencies.

> **iOS Safari does not support WebXR `immersive-ar`** (as of 2026) — the AR demos
> need an Android phone with Chrome + ARCore. True on-site geo-anchoring (pinning
> content to the real Schönbrunn coordinates) needs ARCore Geospatial / prat-ar and
> is out of scope for these "simple WebXR" sketches.

## Data-honesty conventions (enacted in the demos)

- **One icon = one verified thing.** Every quantity is a real count of the event's
  *apparatus* (≈6 microphones on the terrace, the recording/broadcast machinery,
  the live Radio Wien window), not crowd-size triumphalism.
- **The gap is shown, not filled.** Attendance on 14 May is a deliberate blank;
  no figure is invented to fill a row.
- **A different event is labelled as such.** The 48 distributed loudspeakers and
  the large crowd belong to the September 1933 Catholic Mass, shown only when
  explicitly marked. (The "mushroom" loudspeaker is a 1934 Telefunken design for
  later Nazi rallies and does not belong to this event.)

## Run locally

```bash
# Flat board and walk-through need no server:
open p2-isotype-bildstatistik/index.html
open p2-isotype-bildstatistik/walk.html      # desktop: WASD + mouse; press 2 for the September contrast

# Real AR on a phone needs HTTPS (WebXR requires a secure context):
python3 -m http.server 8080
npx ngrok http 8080        # open the https URL on an Android phone → ar.html
```

iOS Safari does not support WebXR `immersive-ar` (as of 2026); it shows the preview.

## Hosting

Served as static files via GitHub Pages (HTTPS, which WebXR requires).
`.nojekyll` is present so files are served as-is.

## Provenance & credits

Source material is curated by the
[Mapping Austrofascism](https://mapping-austrofascism.campusmedius.net) /
[Campus Medius](https://campusmedius.net) project (dir. Simon Ganahl, University
of Vienna). ISOTYPE is the *International System of Typographic Picture Education*
developed under Otto Neurath (Gesellschafts- und Wirtschaftsmuseum, Vienna, from
1925).

## License

TODO: choose a license before relying on this being reusable. Campus Medius source
material is CC BY 4.0; the prototype code can carry its own (e.g. MIT) — your call.
