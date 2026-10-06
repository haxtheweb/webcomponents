# Accessibility Statement — haxtheweb/webcomponents

**Last updated:** October 2026  
**Contact:** hax@psu.edu  
**Standard:** WCAG 2.1 AA (with WCAG 2.0 AA baseline)

## Our Commitment

The `haxtheweb/webcomponents` monorepo is committed to ensuring that all web components and sites built with them are accessible to people with disabilities. Accessibility is one of our core project pillars: **Accessible**, **Free and Open**, **Platform Agnostic**, and **Sustainable**.

## What This Means

- **Perceivable**: Text alternatives for non-text content, captions for multimedia, content that can be presented in different ways without losing meaning
- **Operable**: All functionality available from a keyboard, enough time to read and use content, predictable navigation
- **Understandable**: Text readable and understandable, content appears and operates in predictable ways, help users avoid and correct mistakes
- **Robust**: Content interpreted reliably by a wide variety of user agents, including assistive technologies

## What We're Doing

### Automated Testing
- **121 test files** use axe-based a11ySuite testing, running in CI via `yarn test:all`
- **311 reference a11y patterns** across the codebase
- All elements tested automatically on every PR

### Design System
- **DDD (Design, Develop, Destroy) design system** provides contrast tooling and tokens targeting WCAG 2.0 AA
- **a11y-* element family** (a11y-collapse, a11y-tabs, a11y-details, a11y-figure...) makes accessibility a first-class surface
- Components built on **W3C web components standards** (custom elements, shadow DOM)
- **HAXSchema (haxProperties)** provides documented authoring-interoperability standard

### Contribution Requirements
- `hax audit` **required** before submitting theme or component changes
- DDD tokens for fonts, colors, padding, spacing, margins
- Inherit from `DDDSuper` class for automatic DDD integration

## Known Limitations

We are honest about areas where accessibility can be improved:

- **No standalone accessibility bug register** exists in-repo yet (track via GitHub Issues)
- **Browser/device support matrix** — see below for evergreen browser commitments
- **AI-enabled components**: Not applicable — this monorepo contains no AI chat or generative components
- **Legacy components**: Not applicable — all 250+ components follow current accessibility standards
- Some **older components** may not fully meet WCAG 2.1 AA requirements; prioritize updates via the issue queue

## How You Can Help

- **Report accessibility issues** via GitHub Issues or email hax@psu.edu
- **Test with assistive technologies** (screen readers, keyboard navigation) and share findings
- **Contribute accessibility fixes** through the unified issue queue (`haxtheweb/issues`)
- **Participate in accessibility testing** — our CI runs axe-based tests on every PR

## Support

- **Email:** hax@psu.edu
- **GitHub:** [haxtheweb/issues](https://github.com/haxtheweb/issues)
- **Discord:** [discord.gg/aCGxmRHEJP](https://discord.gg/aCGxmRHEJP) (#accessibility channel)

## Verification

- **CI Testing:** All PRs run `yarn test:all` which includes axe-based a11ySuite testing
- **Manual Testing:** Recommended with screen readers (NVDA, VoiceOver) and keyboard-only navigation
- **Component Gallery:** Live demos at the component gallery demonstrate accessible patterns

---

*This statement reflects our current status and commitments. As an evolving open source project, we acknowledge there is always more work to do to ensure accessibility for all users. We appreciate your partnership in making the HAX ecosystem more accessible.*

*Scored with the Higher Education Open Source Assessment Tool (HEOSAT), rubric version "2026.07 enhanced guidance edition". Accessibility is one of our four core project pillars: Accessible, Free and Open, OER 5Rs, Platform Agnostic, and Sustainable.*