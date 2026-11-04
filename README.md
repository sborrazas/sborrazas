# SBorrazas site

This repository builds Sebastian Borrazas's website as plain static files for GitHub Pages. Blog posts live in `blogposts/` and use colon-prefixed metadata followed by Markdown content. The resume and site assets live in `public/`.

## Build locally

Requires Node.js 20 or newer.

```sh
npm install
npm run build
npm run serve
```

The generated website is written to `dist/`. The local server serves that directory at `http://localhost:4173`. The GitHub Actions workflow builds `dist/` and publishes it to GitHub Pages whenever `main` is updated.
