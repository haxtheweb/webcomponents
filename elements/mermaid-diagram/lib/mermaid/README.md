# Mermaid (vendored)

`mermaid.min.js` is the unmodified `dist/mermaid.min.js` from the npm package
[`mermaid@11.16.1`](https://www.npmjs.com/package/mermaid/v/11.16.1)
(https://github.com/mermaid-js/mermaid), MIT licensed. See `LICENSE`.

- npm tarball integrity: `sha512-TQsq6u22fAn3rek5VOubrhKPo1g5hwC3FXUN9hiyupTckcYiGuuKGkNQrKYwGJkXUxZdojwRG46gsSCFZMDp4g==`
- `mermaid.min.js` sha256: `18327bef70d96fb505fe7287d9f6a7362ebf07ff6576ddfaffb1a06f3e1a2954`

It is a single classic script that sets `globalThis.mermaid`. `mermaid-diagram`
loads it through `@haxtheweb/es-global-bridge` the first time a diagram comes
near the screen; it is never part of the module graph.

The bundle includes Mermaid's own dependencies: d3 (ISC), d3-sankey
(BSD-3-Clause), dagre-d3-es, cytoscape and its layouts, katex, khroma, marked,
roughjs, stylis, dayjs, es-toolkit, uuid, @braintree/sanitize-url,
@iconify/utils, @upsetjs/venn.js, @mermaid-js/parser (all MIT) and DOMPurify
(offered as MPL-2.0 OR Apache-2.0; Apache-2.0 is the option used).

The 11.x line is used on purpose: Mermaid 12 bundles elkjs (EPL-2.0), which
is not on this repository's dependency license allow list.

To update: replace `mermaid.min.js` with `dist/mermaid.min.js` from the new
release, check the licenses of what it bundles, update the version and hashes
here, and run the element's tests (they draw real diagrams).
