# Presenter Compatibility

Tosea HTML Presenter is built for local preview, public share links, and offline HTML downloads.

## Recommended Input

Use an HTMLSlice zip:

```text
htmlslice.json
slides/slide_001.html
slides/slide_002.html
assets/...
```

## Supported Fallbacks

The presenter may also accept:

- a single `.html` file
- pasted HTML
- zip files with `slides/slide_*.html`
- zip files with only `index.html`

These fallback modes help users preview existing files, but skill authors should target HTMLSlice for predictable multi-slide playback.

## Resource Limits

Local import is handled in the browser and uses browser-safety limits to avoid freezing the tab. Cloud sharing is quota-gated by account tier.

Typical cloud share slots:

| Tier | Cloud share slots |
|---|---:|
| Free | 1 |
| Pro | 5 |
| Max | Unlimited |

Offline downloads require sign in but are not count-limited.

