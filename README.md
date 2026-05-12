# HTMLSlide

HTMLSlide is a portable package format for HTML presentations that should open cleanly in Tosea HTML Presenter.

It is designed for PPT skills, AI agents, template generators, and design tools that export HTML slides. The format keeps each slide as an independent HTML document, includes all local assets, and uses a manifest to define playback order.

## Why This Exists

HTML PPT skills often export different shapes:

- one large `index.html`
- multiple sections inside one page
- separate HTML files with inconsistent naming
- local images and CSS in arbitrary folders

HTMLSlide gives those tools one predictable target. If a skill exports an HTMLSlide zip, users can upload it to Tosea HTML Presenter and present it immediately.

## Package Layout

```text
my-deck.zip
├── htmlslide.json
├── slides/
│   ├── slide_001.html
│   ├── slide_002.html
│   └── slide_003.html
└── assets/
    ├── brand.css
    └── chart.svg
```

The zip may contain these files at the archive root, or inside one top-level folder. Tosea Presenter normalizes a single top-level folder during import.

## Quick Start

```bash
git clone https://github.com/ToseaAI/HTMLSlide.git HTMLSlide
cd HTMLSlide
npm run validate
npm run pack
```

Then upload `dist/htmlslide-basic-demo.zip` to:

```text
https://tosea.ai/tools/html-presenter
```

## Minimal Manifest

```json
{
  "version": "1.0",
  "title": "HTMLSlide Demo Deck",
  "aspectRatio": "16:9",
  "width": 1280,
  "height": 720,
  "slides": [
    {
      "id": "cover",
      "title": "Cover",
      "src": "slides/slide_001.html"
    }
  ]
}
```

## Slide Requirements

Each slide should be a complete HTML document:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cover</title>
    <link rel="stylesheet" href="../assets/brand.css" />
  </head>
  <body>
    <main class="htmlslide-slide">
      <h1>Quarterly Review</h1>
      <img src="../assets/chart.svg" alt="" />
    </main>
  </body>
</html>
```

Recommended constraints:

- Use a fixed 16:9 canvas, normally `1280x720`.
- Put slide files in `slides/`.
- Put images, CSS, JS, fonts, and JSON in `assets/`.
- Reference local assets with relative paths such as `../assets/chart.svg`.
- Keep each slide independently renderable in a browser.
- Do not depend on the parent page DOM.
- Do not read cookies, localStorage, or parent window data.

## For Skill Authors

If your PPT skill currently generates a single `index.html`, convert it by:

1. Split each slide into `slides/slide_001.html`, `slides/slide_002.html`, etc.
2. Move local images, CSS, scripts, fonts, and data files into `assets/`.
3. Rewrite references inside each slide to use relative paths.
4. Create `htmlslide.json` with the playback order.
5. Zip the folder contents.

See [docs/skill-author-guide.md](docs/skill-author-guide.md) for the recommended conversion checklist.

## Repository Contents

- [SPEC.md](SPEC.md): full format specification.
- [schemas/htmlslide.schema.json](schemas/htmlslide.schema.json): JSON Schema for `htmlslide.json`.
- [examples/basic-deck](examples/basic-deck): complete 3-slide example deck.
- [scripts/validate.mjs](scripts/validate.mjs): dependency-free package checks.
- [scripts/pack.mjs](scripts/pack.mjs): creates a zip package from an example deck.

## Compatibility

Tosea HTML Presenter accepts:

- HTMLSlide `.zip` packages.
- Single `.html` files as one-slide presentations.
- Zip packages with `slides/slide_*.html` even without a manifest.
- Zip packages with only `index.html` as a fallback one-slide presentation.

HTMLSlide is the recommended public format for stable multi-slide playback.

