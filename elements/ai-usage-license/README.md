# `<ai-usage-license>` [![Published on npm](https://img.shields.io/npm/v/@haxtheweb/ai-usage-license.svg)](https://www.npmjs.com/package/@haxtheweb/ai-usage-license)

## Overview

`ai-usage-license` is a web component that makes it easy to display an [AI Usage License (AIUL)](https://dmd-program.github.io/aiul/) badge on your work. It is modeled after `@haxtheweb/license-element` and is fully compatible with the [HAX](https://haxtheweb.org/) editor ecosystem.

AIUL provides standardized visual tags specifying the permitted uses of AI tools in a given assignment or project.

## Usage

```html
<!-- License only (no modifier) -->
<ai-usage-license license="CD"></ai-usage-license>

<!-- License with media modifier -->
<ai-usage-license license="CD" modifier="IM"></ai-usage-license>
```

## License Codes

| Code | Full Name               | Description |
|------|-------------------------|-------------|
| `NA` | Not Allowed             | No AI tools allowed. All work must be entirely student-generated. |
| `WA` | With Approval           | AI tools may be used only with prior instructor approval. |
| `CD` | Conceptual Development  | AI tools may be used for research and ideation, but final work must be student-generated. |
| `TC` | Transformative Collaboration | AI tools may be used as a collaborative partner, but students must significantly transform AI-generated content. |
| `DP` | Directed Production     | AI tools may be used under the student's direction as a creative production tool. |
| `IU` | Integrated Usage        | Full, intentional, and skillful use of AI tools is permitted and encouraged. |

## Media Modifier Codes

| Code | Name               |
|------|--------------------|
| `3D` | 3D Design          |
| `AU` | Audio              |
| `CO` | Code               |
| `IM` | Image              |
| `MX` | Mixed Media        |
| `TR` | Traditional Media  |
| `VD` | Video              |
| `WR` | Writing            |

## Properties

| Property            | Attribute            | Type     | Description |
|---------------------|----------------------|----------|-------------|
| `license`           | `license`            | `String` | AIUL license code (e.g. `"CD"`) |
| `modifier`          | `modifier`           | `String` | Optional media modifier code (e.g. `"IM"`) |
| `licenseName`       | `license-name`       | `String` | Calculated full license name |
| `licenseImage`      | `license-image`      | `String` | License badge image URL |
| `licenseLink`       | `license-link`       | `String` | Link to license details page |
| `licenseDescription`| `license-description`| `String` | Description of the license |
| `licenseTag`        | `license-tag`        | `String` | Full AIUL tag string (e.g. `"AIUL-CD-IM"`) |

## Demo

```html
<script type="module" src="@haxtheweb/ai-usage-license/ai-usage-license.js"></script>
<ai-usage-license license="IU" modifier="CO"></ai-usage-license>
```

## API Reference

This component uses the [AIUL API](https://dmd-program.github.io/aiul/api/) for license data:
- License images: `https://cdn.jsdelivr.net/gh/dmd-program/aiul@main/assets/images/licenses/aiul-{code}.png`
- Combination images: `https://cdn.jsdelivr.net/gh/dmd-program/aiul@main/assets/images/licenses/aiul-{license}-{modifier}.png`

For more details, see the [AIUL project](https://dmd-program.github.io/aiul/).
