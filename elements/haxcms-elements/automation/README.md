# HAX Theme Screenshot Automation

This directory contains an automated system for generating screenshots of all HAX themes using Puppeteer.

## Overview

The automation system:
- Launches a headless Chrome browser via Puppeteer
- Navigates to the HAX demo site running on localhost:8000
- Removes the `haxcms-site-editor-ui` element from the DOM to hide editing toolbar
- Systematically switches between all themes using `HAXCMS.setTheme()`
- Captures screenshots in two sizes:
  - Large: 1440x900 pixels (modern desktop resolution for detailed previews)
  - Thumbnail: 300x188 pixels (resized from desktop rendering, not mobile)
- Saves screenshots to `../lib/theme-screenshots/`
- Updates `../lib/themes.json` with generation timestamps

## Files

- `puppeteer-theme-automation.js` - Main automation script
- `package.json` - Node.js dependencies and scripts
- `README.md` - This documentation

## Prerequisites

1. **Dev Server Running**: The HAX development server must be running on port 8000:
   ```bash
   cd ~/Documents/git/haxtheweb/webcomponents/elements/app-hax
   yarn start
   ```

2. **Dependencies**: Install Node.js dependencies:
   ```bash
   cd automation
   npm install
   ```

## Usage

### Full Automation (All 30 themes)
```bash
npm run start
# or
node puppeteer-theme-automation.js
```

### Debug Mode (First 3 themes only)
```bash
npm run debug
# or
node puppeteer-theme-automation.js --debug
```

## Configuration

The script configuration can be modified in `puppeteer-theme-automation.js`:

```javascript
const CONFIG = {
  baseUrl: 'http://localhost:8000/elements/haxcms-elements/demo/',
  screenshotDir: path.join(__dirname, '..', 'lib', 'theme-screenshots'),
  themesConfigPath: path.join(__dirname, '..', 'lib', 'themes.json'),
  viewport: {
    width: 1440,
    height: 900  // 16:10 aspect ratio
  },
  thumbnailSize: {
    width: 300,
    height: 188  // Maintains same aspect ratio as large
  },
  themeLoadDelay: 3000, // Wait time after theme change for rendering
  uiSetupDelay: 2000, // Wait time after setting user scaffolding
  headless: true, // Set to false for debugging
  timeout: 30000,
  debugMode: process.argv.includes('--debug'),
  maxThemesInDebug: 3
};
```

## Output

### Screenshots
- Location: `../lib/theme-screenshots/`
- Format: PNG files named after theme elements
- Two sizes generated per theme:
  - Large: `{theme-name}.png` (1440x900 pixels, desktop rendering, 40-500KB)
  - Thumbnail: `{theme-name}-thumb.png` (300x188 pixels, resized from desktop, 5-30KB)
- Clean UI appearance (editing toolbar hidden)
- Desktop layout preserved in both sizes (no mobile rendering)

### Metadata Updates
The script automatically updates `../lib/themes.json` with:
- `screenshotGenerated`: ISO timestamp of when screenshot was taken
- Existing `thumbnail` and `screenshot` paths are preserved

### Console Output
The script provides detailed progress information:
- Configuration summary
- Browser launch status
- Theme-by-theme progress with file sizes
- Final success/failure summary
- Complete file listing

## Example Output

```
🚀 Starting HAX Theme Screenshot Automation

Configuration:
  Base URL: http://localhost:8000/elements/haxcms-elements/demo/
  Screenshot directory: /path/to/lib/theme-screenshots
  Viewport: 1280x800
  Theme load delay: 3000ms
  Headless mode: true

📋 Found 30 themes to process

[1/30] ==========================================
📸 Processing theme: app-hax-theme
    Theme name: 8-bit Overworld theme
    → Switching to theme: app-hax-theme
    → Waiting 3000ms for theme rendering...
    → Taking screenshot: /path/to/app-hax-theme.png
    ✓ Screenshot saved (180KB)
    ✓ Updated timestamp for app-hax-theme
    ✅ SUCCESS

🏁 Automation Complete!
==========================================
✅ Successful: 30
❌ Failed: 0
```

## Troubleshooting

### Dev Server Issues
- Ensure the server is running: `curl http://localhost:8000/elements/haxcms-elements/demo/`
- Restart server if needed: `cd ~/Documents/git/haxtheweb/webcomponents/elements/app-hax && yarn start`

### Puppeteer Issues
- Install Chromium: `npm install puppeteer` downloads bundled Chromium
- For Ubuntu/Linux: May need `sudo apt install -y chromium-browser`
- For debugging: Set `headless: false` in CONFIG

### File Permissions
- Ensure write permissions to `../lib/theme-screenshots/` directory
- Check Node.js has permission to read `../lib/themes.json`

## Architecture

The system uses:
- **Puppeteer**: Headless Chrome automation
- **ES Modules**: Modern JavaScript module system
- **Async/Await**: Clean asynchronous code patterns
- **Error Handling**: Comprehensive error catching and reporting
- **File System Operations**: Reading themes.json, writing screenshots, updating metadata

## Integration

This automation system is designed to support the v2 app-hax dashboard by pre-generating static theme preview images. The generated screenshots can be used for:
- Theme selection interfaces
- Theme galleries
- Documentation
- Preview thumbnails
- Static site generation

The system is standalone and doesn't require Warp or MCP to function, making it suitable for CI/CD pipelines or manual execution.