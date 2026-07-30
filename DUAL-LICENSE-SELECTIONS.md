# Dual-License Selections

This file records the permissive-license election for every dependency in
`@haxtheweb/webcomponents` that is offered under a dual license where one
option is copyleft (GPL/LGPL/AGPL). For each, the project elects the
permissive option (MIT) so the dependency is compatible with the repo's
Apache-2.0 outbound license.

This is an engineering record of the selection, not legal advice.

## jszip — MIT elected

- Package: `jszip@3.10.1` (transitive via `epub-gen-memory`, `html-to-docx`,
  `mammoth`)
- Offered as: `MIT OR GPL-3.0-or-later`
- Election: **MIT**
- Upstream source: https://github.com/Stuk/jszip
- Vendored copy: a copy of jszip is also vendored in
  `elements/file-system-broker/lib/xlsx/jszip.js`; the MIT election and the
  full MIT license text for that vendored copy are recorded in
  `elements/file-system-broker/lib/xlsx/jszip-LICENSE.txt`.
- Reason: MIT is compatible with the Apache-2.0 outbound license; the GPL
  option is not used.

## xmldom — MIT elected

- Package: `xmldom@0.1.31` (transitive via `@oozcitak/dom`, `plist`)
- Offered as: `LGPL-2.0 OR MIT`
- Election: **MIT**
- Upstream source: https://github.com/xmldom/xmldom
- Reason: MIT is compatible with the Apache-2.0 outbound license; the LGPL
  option is not used.

## Scope and notes

- Both `jszip` and `xmldom` are transitive dependencies; neither is vendored
  directly (jszip is also vendored inside the SheetJS `lib/xlsx` folder as
  noted above).
- The Apache-2.0 outbound license of this repository is compatible with MIT;
  electing MIT for these dependencies keeps the combined work Apache-2.0
  compatible.
- Dependencies that are copyleft-only (no permissive option) are not listed
  here because no permissive election is possible — those are handled under
  the OSS review memo and, where present in the shipped surface, are
  remediated by removal or replacement (see `@haxtheweb/h5p-element`).
