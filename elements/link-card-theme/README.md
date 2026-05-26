# link-card-theme
Single-page HAXcms theme for personal profile + link hub experiences. The theme renders:
- Profile image, title, and description from site metadata
- Top-level menu items as large button-style links
- Auto-detected social links for LinkedIn and X/Twitter
- DDD styling with palette and dark-mode support
## Install dependencies
- `npm install`
## Commands
- `npm start` - run local development server
- `npm run build` - build distributable output and generate `custom-elements.json`
- `npm test` - run component tests
## Working with this theme
- edit `./link-card-theme.js`
- edit `./index.html` for local demo behavior
- add additional helpers under `./lib/` if needed
- keep styling aligned with DDD tokens and palette support