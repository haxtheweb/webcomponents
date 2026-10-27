# HAX Web Components Gallery

A simple, fast, and reliable component gallery system that replaces Storybook for showcasing your web components. Built using your existing demo pages and styled with the DDD design system.

## Features

- **Documentation view** - every element gets generated docs (attributes, slots, events, HAX schema, copy buttons) through `<documentation-player>`
- **Animated walkthroughs** - elements that ship `lib/<tag>.motion.json` also play it; filter with Walkthrough
- 🔍 **Search functionality** - Find components quickly by name or description
- 📱 **Responsive design** - Works great on all devices
- 🎨 **DDD Design System** - Uses your own design tokens for consistent styling
- ⚡ **Fast and reliable** - No complex build processes or breaking dependencies
- 🔗 **Links to existing demos** - Leverages all your existing demo pages
- 📊 **Categorized view** - Components grouped by prefix for better organization

## Usage

### Development
```bash
# Generate and serve the gallery locally
yarn gallery

# Just generate the gallery file
yarn build-gallery
```

### Production / Preview
The gallery is regenerated on every Vercel preview deployment via the `buildCommand` in `vercel.json` (`yarn install && yarn build-gallery`), so each PR preview at `*.vercel.app` includes a fresh `index.html` reflecting that branch's components — it's served automatically at the preview's root URL.

For a local production build that includes the gallery:
```bash
yarn build  # This runs lerna run build && yarn build-gallery
```

## Deep Linking

The gallery supports URL query params so you can link directly to a specific component (and an optional demo variant):

- `?element=<slug>` — opens the component named `<slug>` (e.g. `?element=video-player`).
- `?view=docs` — optional; opens the Documentation view instead of the live demo.
- `?topic=<topic>` — optional, with `view=docs`; opens one walkthrough of an element that has several (e.g. `?element=haxcms-elements&view=docs&topic=outline`).
- `?demo=<name>` — optional; selects a specific additional demo by its name (the demo filename without `.html`). Omit it (or use `?demo=index`) for the main demo.

When a component is selected from the sidebar, the address bar is updated via `history.replaceState` so the current view is always shareable. CI uses this convention to post per-element review links on PRs.

Example: `https://<preview>.vercel.app/?element=video-player`

## Automated Preview Builds (Vercel)

Every push and PR triggers a Vercel preview deployment. `vercel.json` sets `buildCommand` to `yarn install && yarn build-gallery`, so each preview includes a freshly generated, routable `index.html` served automatically at the preview's root URL. Reviewers can view the gallery for a PR without pulling the branch locally.

The `gallery-deeplinks` GitHub workflow watches for successful Vercel Preview deployments and posts a PR comment with `?element=<slug>` deep links for each element the PR touches, replacing the legacy `demo-deeplinks` workflow.

## How it Works

The gallery system:

1. **Scans** your `elements/` directory for components with `demo/index.html` files
2. **Reads** each component's `package.json` for metadata
3. **Groups** components by their prefix (e.g., `a11y-`, `hax-`, etc.)
4. **Generates** a single HTML file with embedded CSS and JavaScript
5. **Serves** the gallery with a simple HTTP server

## Design System Integration

The gallery uses your DDD design system variables:

- **Typography**: `--ddd-font-primary`, `--ddd-font-secondary`, `--ddd-font-navigation`
- **Spacing**: `--ddd-spacing-*` variables for consistent margins and padding
- **Colors**: Penn State brand colors from the DDD theme
- **Shadows & Borders**: `--ddd-boxShadow-*` and `--ddd-border-*` variables

## File Structure

```
webcomponents/
├── scripts/
│   └── build-component-gallery.js    # Gallery generator script
├── index.html                        # Generated gallery (gitignored; regenerated per deploy, not committed)
└── elements/
    └── [component-name]/
        ├── package.json              # Component metadata
        └── demo/
            ├── index.html            # Main demo (required)
            └── [other].html          # Additional demos (optional)
```

## Customization

### Adding Component Categories
Components are automatically categorized by their prefix (the part before the first `-`). For example:
- `a11y-carousel` → **A11Y Components**
- `hax-tray` → **HAX Components** 
- `simple-icon` → **SIMPLE Components**

### Styling
The gallery inherits styling from your DDD design system. To customize:

1. Modify the CSS variables in your DDD theme
2. Edit `scripts/build-component-gallery.js` for structural changes
3. Regenerate with `yarn build-gallery`

## Migration from Storybook

### What Changed
- `yarn storybook` → `yarn gallery`
- `yarn build-storybook` → `yarn build-gallery`
- No more complex webpack configuration
- No more breaking Storybook dependencies
- Uses your existing demo pages instead of stories

### Benefits
- ✅ **Reliable**: No more build failures
- ✅ **Fast**: Instant startup, no complex bundling  
- ✅ **Simple**: Single HTML file output
- ✅ **Consistent**: Uses your actual design system
- ✅ **Maintainable**: Leverages existing demo infrastructure

## Deployment

For HAX webcomponents, the gallery is automatically built and deployed on every Vercel preview/production deployment (see [Automated Preview Builds (Vercel)](#automated-preview-builds-vercel)). Since it builds to `index.html`, it is served automatically at the deployment's root URL. The generated file is completely self-contained and can also be:

- Served statically from any web server
- Deployed to GitHub Pages, Netlify, Vercel, etc.
- Opened directly in a browser
- Embedded in documentation sites

## Troubleshooting

### No components found
- Ensure components have a `demo/index.html` file
- Check that `package.json` files are valid JSON
- Verify you're running from the repository root

### Gallery not loading properly  
- Check that the DDD design system is properly imported
- Ensure all demo links are relative paths
- Verify `d-d-d.js` is accessible from the gallery location

### Search not working
- JavaScript must be enabled
- Check browser console for errors
- Ensure component data is properly embedded in the HTML

## Contributing

To improve the gallery system:

1. Edit `scripts/build-component-gallery.js`
2. Test with `yarn build-gallery`
3. Submit a PR with your changes

The gallery system is designed to be simple and maintainable - keep that philosophy when making changes!

## Documentation and walkthroughs

`yarn build-gallery` first runs `scripts/extract-element-docs.mjs`, which writes one `<element>.docs.json` per element into the gitignored `gallery-data/` folder. The Documentation view hands that file, and the element's storyboard when one exists, to `<documentation-player>`. Elements without a storyboard still get docs, demo and schema; only the Walkthrough tab is omitted.

### What ships with each element

Each element's `yarn build` ends with `node ../../scripts/extract-element-docs.mjs --write .`, which writes `lib/<tag>.docs.json` next to the element's other `lib/` files, so the docs data is published with the package and can be loaded from the CDN, for example on a Learn HAX page:

```html
<documentation-player
  docs-src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/meme-maker/lib/meme-maker.docs.json"
  motion-src="https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/meme-maker/lib/meme-maker.motion.json"
></documentation-player>
```

| File | Made by | Purpose |
| --- | --- | --- |
| `lib/<tag>.docs.json` | the element build (generated, do not edit) | attributes, slots, events, HAX schema, snippets, surface hash |
| `lib/<tag>.motion.json` | a person, or `draft-element-walkthrough.mjs` | the animated walkthrough |
| `lib/<tag>.video.json` | `scripts/link-element-tutorial.mjs` (or a person) | `{ "source", "title", "captions", "tutorial" }`: the short video tutorial shown in the Video tab, its captions file and a link to the full tutorial page |
| `lib/<tag>.captions.vtt` | `scripts/link-element-tutorial.mjs` | WebVTT captions for that video |

### Several walkthroughs for one element

Elements with many screens or operations (`app-hax`, the HAX editor in `haxcms-elements`) keep one walkthrough per topic next to the main one:

```
lib/<tag>.motion.json              main walkthrough
lib/<tag>.<topic>.motion.json      one per topic, topic = lowercase letters, digits, dashes
lib/<tag>.<topic>.video.json       a video for that topic (optional)
```

A storyboard's `"title"` names its topic and `"order"` sets where it is listed. The docs data lists them all as `walkthroughs` and `videos`, the player shows a topic picker above the film, `--status` reports each one as `<element>:<topic>`, and the walkthrough-status workflow flags them one by one.

### Linking a video tutorial

```bash
node scripts/link-element-tutorial.mjs <element> --video <YouTube URL> \
  --title "<video title>" --captions <transcript.vtt> --tutorial <tutorial page URL> \
  [--topic <topic>]
```

The `hax-tutorial-site` skill runs this for you when a tutorial is about an element, then opens a pull request. Running it again replaces the earlier link.

### Walkthrough status

Check which storyboards are current, awaiting review or stale:

```bash
node scripts/extract-element-docs.mjs --status
```

A storyboard stores the surface hash of the element it was written for. When attributes, HAX settings, slots, events or demo schema change, the hash changes and the walkthrough shows as stale until someone updates and re-approves it. The `walkthrough-status` workflow runs this check on every pull request that touches an element and flags stale walkthroughs on the PR.

### Drafting a walkthrough

```bash
node scripts/draft-element-walkthrough.mjs <element> [element ...]
```

Builds a first draft from the element's HAX settings (or attributes), its demo markup and a sketch chosen by element type, and writes `lib/<tag>.motion.json` with `review.status: "draft"`. Treat it as a starting point: watch it in the gallery's Documentation view, then edit the JSON or hand it to a person to approve. Hand-written and approved storyboards are never overwritten unless `--force` is passed.
