# HAX Web Components Gallery

A simple, fast, and reliable component gallery system that replaces Storybook for showcasing your web components. Built using your existing demo pages and styled with the DDD design system.

## Features

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

### Production
The gallery is automatically built during your main build process:
```bash
yarn build  # This now includes yarn build-gallery
```

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
├── component-gallery.html            # Generated gallery (gitignored)
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

The generated `component-gallery.html` file is completely self-contained and can be:

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
