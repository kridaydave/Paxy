# Paxy

A command-line pixel art maker for AI agents. Agents create canvases, draw
pixels and shapes, place templates, and export scaled PNGs — all via
`paxy <subcommand>` invocations. State persists in `.paxy` JSON files that open
in the existing GUI editor for human polishing.

## Prerequisites

- **Node.js >= 18** (developed and tested on **v24.13.0** — see `.nvmrc`).
- No native dependencies. `pngjs` and `commander` are pure JS.

## Install (clean room)

```bash
npm ci          # installs exact versions from package-lock.json
```

> Use `npm ci`, not `npm install`, so the pinned lockfile is authoritative.

## Usage

```bash
# 1. Create a 32x32 project
node paxy.js create --size 32 --output hero.paxy

# 2. Place a built-in template (centered)
node paxy.js template --name Heart --project hero.paxy

# 3. Draw shapes / pixels
node paxy.js circle --cx 16 --cy 16 --r 5 --color "#00e436" --filled --project hero.paxy
node paxy.js pixel  --x 15 --y 2 --color "#ff004d" --project hero.paxy

# 4. Export a scaled PNG
node paxy.js export png --scale 4 --output hero.png --project hero.paxy
```

### Commands

| Command | Purpose |
|---------|---------|
| `paxy create --size WxH --output <file>` | New `.paxy` project (square grid) |
| `paxy pixel --x --y --color --project` | Set one pixel |
| `paxy line --x1 --y1 --x2 --y2 --color --project` | Bresenham line |
| `paxy rect --x1 --y1 --x2 --y2 --color --project [--filled]` | Rectangle |
| `paxy circle --cx --cy --r --color --project [--filled]` | Circle |
| `paxy fill --x --y --color --project` | Flood fill |
| `paxy erase --x --y --project` | Erase a pixel |
| `paxy template --name <Name> --project` | Place a built-in stencil |
| `paxy batch --file <ops.json> --project` | Bulk ops (pixel/line/rect/circle/fill/erase) |
| `paxy export png --scale <n> --output <file> --project` | Scaled PNG |

Every command prints JSON on success and `{"error":"..."}` (exit 1) on failure.

## Reproducibility

The tool is **deterministic**: a fixed command sequence always yields
byte-identical `.paxy` and PNG output (verified by SHA-256).

```bash
npm test         # runs scripts/smoke.js
```

`scripts/smoke.js` runs the canonical sequence twice and asserts the outputs
are internally identical **and** match the committed golden fixtures in
`test/fixtures/`.

- **Expected output:** a 128×128 PNG (`test/fixtures/smoke.png`).
- **Tolerance:** **bit-identical** (SHA-256 must match the golden). No variance
  is expected — there is no randomness, GPU, or external data in the pipeline.
- **Golden PNG SHA-256:** `a193c44f68e7f4a079606d024c5b681f45f3b37a1a33bbecb7e4c49eb3a211de`

## Project layout

```
paxy.js              entry point (commander)
bin/paxy.js          executable shim
lib/project.js       .paxy load/save + dense grid model
lib/draw.js          shape algorithms (line/rect/circle/flood fill)
lib/templates.js     12 built-in templates
lib/png.js           PNG export (pngjs)
commands/            one handler per subcommand
```
