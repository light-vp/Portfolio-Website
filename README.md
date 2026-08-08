# Portfolio Website

Personal site for Vaibhav Patel — static HTML, CSS and vanilla JavaScript, no build step.

## Structure

```
index.html          Home: hero, selected work, approach, CTA
about.html          Background timeline, toolkit, certifications, philosophy
contact.html        Contact channels and details
assets/css/main.css Single stylesheet: tokens → base → layout → components
assets/js/main.js   Theme toggle, mobile nav, scroll reveal, project filtering
```

## Design system

All visual decisions live as custom properties at the top of `assets/css/main.css`:

- **Type** — fluid scale on a 1.250 major third, clamped between 390px and 1280px.
  Inter for text, JetBrains Mono for labels and metadata.
- **Spacing** — 4px base scale. Sections share one rhythm via `--section-y`
  (96px desktop, 64px mobile), so vertical spacing is consistent everywhere.
- **Colour** — monochrome base with a single accent. Light and dark are two token
  sets; nothing else in the file hardcodes a colour.
- **Motion** — 120–420ms, `ease-out`, transform and opacity only. Fully disabled
  under `prefers-reduced-motion`.

Theme is applied by an inline script in each `<head>` before first paint, so there
is no flash of the wrong colours. The choice persists in `localStorage`, and the
site follows the OS preference until the visitor picks a theme explicitly.

## Running locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Notes

- Project links currently point at the GitHub profile. Replace them with real
  per-project repository URLs (search for `TODO(vaibhav)` in `index.html`).
- There is no contact form — the site is static with no backend. Contact is via
  email, LinkedIn and GitHub. Adding a form would need a third-party handler such
  as Formspree or Netlify Forms.
