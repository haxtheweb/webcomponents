# Browser/Device Support Matrix — haxtheweb/webcomponents

**Last updated:** October 2026  
**Scope:** All 250+ web components in the HAX monorepo  
**Standard:** Evergreen browser support — auto-update channels only

## Philosophy

HAX components support **all evergreen browsers** with auto-update enabled. We do not maintain support for legacy browser versions (IE 11, old Chrome/Firefox/Safari versions). This approach aligns with our **Platform Agnostic** pillar and reduces maintenance burden, allowing us to focus on accessibility and feature development.

## Supported Browsers

| Browser | Platform | Version Support | Testing |
|---------|----------|----------------|---------|
| **Chrome** | Desktop (Windows, macOS, Linux) | Latest -1 version | Automated (CI) + Manual |
| **Chrome** | Mobile (Android) | Latest version | Responsive testing |
| **Firefox** | Desktop (Windows, macOS, Linux) | Latest -1 version | Automated (CI) + Manual |
| **Firefox** | Mobile (Android) | Latest version | Responsive testing |
| **Safari** | Desktop (macOS) | Latest version | Manual |
| **Safari** | Mobile (iOS/iPadOS) | Latest version | Responsive testing |
| **Edge** | Desktop (Windows) | Latest -1 version | Automated (CI) + Manual |

## Testing Methodology

- **Automated CI**: `yarn test:all` runs Playwright Chromium + axe a11ySuite on every PR
- **Manual QA**: Locally via haxcms-nodejs, haxcms-php as well as built in `npm start` capabilities
- **Responsive**: All components tested at mobile, tablet, and desktop breakpoints
- **QA Pipeline**: After passing local testing, then local platform, then CI/CD, it goes manually up to dev servers for testing before landing on staging. Only after passing staging via manual review does it get tagged and released to the general public.

## Known Exclusions

The following are **not supported** and not tested:

- Internet Explorer (any version), including IE 11
- Safari versions older than current major releases (though likely work after 2023)
- Firefox ESR (Extended Support Release) versions (though likely work after 2023)

## Mobile Support

- **iOS Safari**: Tested on latest iOS version via responsive design tools
- **Android Chrome**: Tested on latest Android version via responsive design tools
- **No native app** — all components are web-based and responsive

## Declaration

> **HAX components are designed for evergreen browsers with auto-update enabled.**
> 
> We intentionally do not support legacy browsers to:
> - Maximize accessibility through modern web standards
> - Reduce security vulnerabilities from outdated browser versions
> - Minimize maintenance burden, allowing faster feature delivery
> - Align with WCAG 2.1 AA best practices for browser support

## How to Request Legacy Browser Support

If your institution requires support for a specific legacy browser version, please:
1. **Open a GitHub Issue** at `haxtheweb/issues` with label `browser-support`
2. **Describe the use case** and which component(s) are affected
3. **Note** that adding legacy support will increase maintenance overhead and may impact accessibility roadmap priorities

## Verification

- **CI Status**: All PRs must pass `yarn test:all` before merge
- **Component Gallery**: Live demos at the component gallery test against current browser versions
- **Accessibility Statement**: References this matrix for procurement and compliance reviews

---

*This matrix is intentionally concise — we support evergreen browsers only. For institutional legacy browser requirements, see the "How to Request Legacy Browser Support" section above.*

*Aligned with HEOSAT AS5 recommendations and our project pillar: Platform Agnostic.*