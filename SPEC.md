# HTMLSlide 1.0 Specification

HTMLSlide is a zip-based package format for HTML presentations.

## Goals

- Make AI-generated HTML presentations portable.
- Preserve local images, CSS, JS, fonts, and data files.
- Keep each slide independently renderable.
- Give presenters a deterministic playback order.
- Avoid coupling slides to the host application's DOM.

## Non-Goals

- HTMLSlide is not a design system.
- HTMLSlide does not require a specific JavaScript framework.
- HTMLSlide does not define editing semantics.
- HTMLSlide does not require speaker notes, animations, or embedded navigation.

## Archive Rules

An HTMLSlide package is a `.zip` file. The archive may have files at root:

```text
htmlslide.json
slides/slide_001.html
assets/brand.css
```

It may also have a single top-level folder:

```text
my-deck/htmlslide.json
my-deck/slides/slide_001.html
my-deck/assets/brand.css
```

Importers should normalize that single root folder.

Paths must be relative. Absolute paths and parent traversal are invalid:

- Invalid: `/slides/slide_001.html`
- Invalid: `../outside.html`
- Valid: `slides/slide_001.html`

## Manifest

`htmlslide.json` is the recommended manifest file.

Required fields:

| Field | Type | Description |
|---|---|---|
| `version` | string | Must be `"1.0"`. |
| `title` | string | Deck title. |
| `slides` | array | Ordered list of slides. |

Recommended fields:

| Field | Type | Description |
|---|---|---|
| `aspectRatio` | string | Commonly `"16:9"`. |
| `width` | number | Intended slide width, usually `1280`. |
| `height` | number | Intended slide height, usually `720`. |
| `description` | string | Short deck summary. |
| `sourceSkill` | object | Name and URL of the generator skill. |

Example:

```json
{
  "$schema": "schemas/htmlslide.schema.json",
  "version": "1.0",
  "title": "HTMLSlide Demo Deck",
  "aspectRatio": "16:9",
  "width": 1280,
  "height": 720,
  "description": "A small example deck for Tosea HTML Presenter.",
  "sourceSkill": {
    "name": "example-generator",
    "url": "https://github.com/ToseaAI/HTMLSlide"
  },
  "slides": [
    {
      "id": "cover",
      "title": "Cover",
      "src": "slides/slide_001.html"
    }
  ]
}
```

## Slide Objects

Required fields:

| Field | Type | Description |
|---|---|---|
| `src` | string | Relative path to a `.html` or `.htm` file. |

Recommended fields:

| Field | Type | Description |
|---|---|---|
| `id` | string | Stable slide identifier. |
| `title` | string | Human-readable slide title. |

## Slide HTML

Each slide should be a complete HTML document.

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
      ...
    </main>
  </body>
</html>
```

Recommended slide canvas:

```css
.htmlslide-slide {
  width: 1280px;
  height: 720px;
  overflow: hidden;
  position: relative;
}
```

## Assets

All local assets should live under `assets/`. Supported references include:

```html
<img src="../assets/image.png" alt="" />
<link rel="stylesheet" href="../assets/brand.css" />
<script src="../assets/demo.js"></script>
```

CSS references are also supported:

```css
.cover {
  background-image: url("../assets/cover.jpg");
}
```

Remote resources are discouraged because they can break offline preview and downloaded playback.

## Security Guidance

Slides are treated as user-provided HTML. Generators should avoid:

- reading cookies or localStorage
- navigating the parent page
- depending on `window.parent`
- loading untrusted remote scripts
- using absolute local file paths

## Fallback Import Behavior

Importers may support non-standard packages:

| Input | Suggested behavior |
|---|---|
| Single `.html` | Load as one-slide deck. |
| Zip with `slides/slide_*.html` and no manifest | Sort slides by filename. |
| Zip with only `index.html` | Load as one-slide deck. |
| HTML fragment | Wrap in a fixed 1280x720 shell. |

These fallbacks are for user convenience. Skill authors should export the manifest-based format.

