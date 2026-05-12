# Skill Author Guide

Use this checklist when adapting a PPT skill or HTML slide generator to HTMLSlide.

## Export Checklist

1. Generate one complete HTML document per slide.
2. Save slides as `slides/slide_001.html`, `slides/slide_002.html`, etc.
3. Put all local assets under `assets/`.
4. Rewrite slide references to relative paths.
5. Write `htmlslide.json`.
6. Validate the package.
7. Zip the package contents.

## Recommended File Naming

```text
slides/slide_001.html
slides/slide_002.html
slides/slide_003.html
assets/cover.jpg
assets/chart.svg
assets/brand.css
```

Use stable filenames. Avoid spaces and non-portable characters in generated paths.

## Splitting A Single HTML Deck

If your existing output is one `index.html` with repeated sections:

```html
<section class="slide">...</section>
<section class="slide">...</section>
```

The export step should:

1. Extract each slide section.
2. Wrap it with the original shared `<head>` styles.
3. Save each wrapped result as a full document.
4. Copy linked assets.
5. Rebase local URLs from `assets/x.png` to `../assets/x.png`.

## Manifest Generation

```json
{
  "version": "1.0",
  "title": "Generated Deck",
  "aspectRatio": "16:9",
  "width": 1280,
  "height": 720,
  "sourceSkill": {
    "name": "my-ppt-skill",
    "url": "https://github.com/example/my-ppt-skill"
  },
  "slides": [
    {
      "id": "slide-001",
      "title": "Slide 1",
      "src": "slides/slide_001.html"
    }
  ]
}
```

## Validation

From this repository:

```bash
node scripts/validate.mjs examples/basic-deck
```

For your own output:

```bash
node scripts/validate.mjs /path/to/my-deck
```

## Packaging

```bash
node scripts/pack.mjs /path/to/my-deck dist/my-deck.htmlslide.zip
```

The resulting zip can be uploaded to Tosea HTML Presenter.

