/**
 * Copyright 2026 haxtheweb
 * @license Apache-2.0, see LICENSE for full text.
 *
 * DDDPatternLibrary.js
 * --------------------
 * Single source of truth for the DDD Atomic Design pattern library.
 * Consumed by:
 *  - elements/d-d-docs/d-d-docs.js (demo rendering of Atoms/Molecules/Organisms/Templates/InternalContracts)
 *  - elements/d-d-d/lib/DDDPatternStax.js (converts entries to HAX stax / demoSchema overrides)
 *  - the hax-pattern-library-audit skill (read-only grading of element conformance)
 *  - AI generation passes (canonical recipes for uniform HAX HTML)
 *
 * Each pattern entry shape:
 *   id, level ('atom'|'molecule'|'organism'|'template'), title, description,
 *   components: [tagName, ...],            // every tag referenced; must be HAX-capable (see gate)
 *   tokens: [dddClassOrAttr, ...],         // DDD utility classes / data-attributes applied
 *   darkMode: 'supported'|'todo'|'n/a',
 *   html: canonical recipe string,
 *   hax: {
 *     publish: 'stax-area'|'stax-page'|'demoSchemaOverride'|'recipe-only',
 *     templateType: 'area'|'page' (when publish is stax-*),
 *     targetTag: tagName (when publish is demoSchemaOverride),
 *     dataAttributes: [data-foo, ...] (atom-level recipes that expand DDDStyleGuidePresets),
 *   }
 *
 * Internal contract shape (cross-cutting; applies to element internals, not compositions):
 *   id, title, description, surface, tokens, structure, targetElements: [tag, ...]
 */

/**
 * HAX-capability knowledge for components referenced by patterns.
 * `true` = verified to ship haxProperties (external lib JSON or inline).
 * `false` = no haxProperties found; gate will exclude/log unless wiring is created.
 * `null` = not yet verified; gate should resolve at load time.
 * This table is a static seed; resolveHaxCapability() reconciles against the live
 * customElements registry / haxProperties JSON files where possible.
 */
export const HAX_CAPABILITY = {
  // verified external JSON refs
  "stop-note": true,
  "wikipedia-query": true,
  "multiple-choice": true,
  "self-check": true,
  "media-image": true,
  "editable-table": true,
  "a11y-collapse": true,
  "a11y-tabs": true,
  "lrndesign-timeline": true,
  "person-testimonial": true,
  "author-card": true,
  "media-playlist": true,
  "image-gallery": true,
  "image-compare-slider": true,
  "a11y-figure": true,
  // verified inline objects
  "video-player": true,
  "simple-cta": true,
  "accent-card": true,
  "grid-plate": true,
  "a11y-media-player": true,
  // DDD-owned, HAX-capable (d-d-docs imports these)
  "ddd-card": true,
  "ddd-steps-list": true,
  "ddd-steps-list-item": true,
  "page-section": true,
  "figure-label": true,
  "block-quote": true,
  "learning-component": true,
  // Previously non-HAX-capable; external haxProperties JSON now wired
  "count-up": true,
  // simple-fields pill/tag element; external haxProperties JSON now wired
  "simple-tag": true,
};

/**
 * Atomic-level guidance entries (these are documentation/recipe atoms, not
 * insertable blocks; they expand DDDStyleGuidePresets and fill the "Logical Gaps"
 * flagged in DDDStyles.js). Kept as patterns with level 'atom'.
 */
const ATOMS = [
  {
    id: "atom-heading-pairings",
    level: "atom",
    title: "Heading color / size / letter-spacing / line-height pairings",
    description:
      "Canonical pairing of each heading level (h1-h6) with its DDD font-size, font-weight, letter-spacing, and line-height token. Fills the first flagged Logical Gap.",
    components: [],
    tokens: [
      "--ddd-theme-h1-font-size",
      "--ddd-font-size-m",
      "--ddd-font-weight-bold",
      "--ddd-lh-120",
      "data-primary",
    ],
    darkMode: "supported",
    html:
      '<h1 data-primary="2">Heading 1</h1>\n' +
      '<h2 data-primary="2">Heading 2</h2>\n' +
      '<h3 data-primary="2">Heading 3</h3>\n' +
      "<h4>Heading 4</h4>\n" +
      "<h5>Heading 5</h5>\n" +
      "<h6>Heading 6</h6>",
    hax: {
      publish: "recipe-only",
      dataAttributes: ["data-primary", "data-font-size", "data-font-weight"],
    },
  },
  {
    id: "atom-link-chevron",
    level: "atom",
    title: "Link + chevron convention",
    description:
      "When to use a chevron after a link and how to pair it with a DDD-colored link. Fills the chevron-with-links Logical Gap.",
    components: ["simple-icon-lite"],
    tokens: ["--ddd-theme-default-link", "--ddd-icon-xs"],
    darkMode: "supported",
    html: '<a href="#">Read the brief</a> <simple-icon-lite icon="icons:chevron-right" style="color: var(--ddd-theme-default-link)"></simple-icon-lite>',
    hax: { publish: "recipe-only", dataAttributes: [] },
  },
  {
    id: "atom-heading-treatments",
    level: "atom",
    title: "Heading horizontal-line + vertical-line treatments",
    description:
      "data-design-treatment vert / horz-10p / horz-25p / horz-50p / horz-full / horz-md / horz-lg on headings, paired with data-primary for color.",
    components: [],
    tokens: ["data-design-treatment", "data-primary"],
    darkMode: "supported",
    html:
      '<h5 data-design-treatment="vert" data-primary="15">Vertical line</h5>\n' +
      '<h5 data-design-treatment="horz-25p" data-primary="15">Horizontal line 25%</h5>\n' +
      '<h5 data-design-treatment="horz-full" data-primary="15">Horizontal line 100%</h5>',
    hax: {
      publish: "recipe-only",
      dataAttributes: ["data-design-treatment", "data-primary"],
    },
  },
  {
    id: "atom-dropcap",
    level: "atom",
    title: "Drop cap on paragraph / blockquote",
    description:
      "data-design-treatment dropCap-sm / dropCap-md / dropCap-lg applied to p and blockquote for emphasis.",
    components: [],
    tokens: ["data-design-treatment", "data-accent"],
    darkMode: "supported",
    html:
      '<p data-design-treatment="dropCap-md" data-accent="2">Drop cap medium on a paragraph.</p>\n' +
      '<blockquote data-design-treatment="dropCap-sm" data-accent="2">Drop cap small on a quote.</blockquote>',
    hax: {
      publish: "recipe-only",
      dataAttributes: ["data-design-treatment", "data-accent"],
    },
  },
  {
    id: "atom-header-slash",
    level: "atom",
    title: "Double-slash after headers convention",
    description:
      "The // suffix convention for section headers; documents when and how to apply it consistently. Fills the // -after-headers Logical Gap.",
    components: [],
    tokens: ["data-primary", "--ddd-font-weight-bold"],
    darkMode: "supported",
    html: '<h2 data-primary="2">Objectives<span aria-hidden="true"> //</span></h2>',
    hax: { publish: "recipe-only", dataAttributes: ["data-primary"] },
  },
  {
    id: "atom-icon-sizing",
    level: "atom",
    title: "Icon sizing via DDD icon variables",
    description:
      "Size simple-icon-lite with DDD icon sizing variables (--ddd-icon-xs etc.) rather than spacing variables. Colorize via light-DOM color.",
    components: ["simple-icon-lite"],
    tokens: ["--ddd-icon-xs", "--ddd-icon-sm", "--ddd-icon-xxs"],
    darkMode: "supported",
    html: '<simple-icon-lite icon="icons:info" style="--simple-icon-height: var(--ddd-icon-sm); --simple-icon-width: var(--ddd-icon-sm); color: var(--ddd-primary-8)"></simple-icon-lite>',
    hax: { publish: "recipe-only", dataAttributes: [] },
  },
];

/**
 * Molecules (10-12): small composed units of 2-3 components.
 * Each that is a single HAX element publishes as demoSchemaOverride;
 * multi-element molecules publish as stax-area or recipe-only.
 */
const MOLECULES = [
  {
    id: "mol-media-object",
    level: "molecule",
    title: "Media object",
    description:
      "Image + heading + paragraph. media-image carries the figure label; heading + body sit beside it.",
    components: ["media-image"],
    tokens: ["m-4", "p-4"],
    darkMode: "supported",
    html:
      '<div class="m-4 p-4">\n' +
      '  <media-image source="files/photo.jpg" figure-label-title="1.1" figure-label-description="Field site" alt="Researchers at the field site">\n' +
      '    <div slot="caption">A caption describing the scene.</div>\n' +
      "  </media-image>\n" +
      "  <h3>Media object heading</h3>\n" +
      "  <p>Supporting paragraph that sits beside the figure.</p>\n" +
      "</div>",
    hax: { publish: "stax-area", templateType: "area" },
  },
  {
    id: "mol-stat-block",
    level: "molecule",
    title: "Stat block",
    description:
      "A count-up number + label + caption in a bordered, rounded, shadowed box. count-up animates the number when scrolled into view.",
    components: ["count-up"],
    tokens: [
      "b-xs",
      "p-4",
      "r-md",
      "bs-sm",
      "--ddd-font-size-3xl",
      "--ddd-font-weight-bold",
      "data-primary",
    ],
    darkMode: "supported",
    html:
      '<div class="b-xs p-4 r-md bs-sm" style="text-align: center">\n' +
      '  <count-up end="1250" duration="2.5" suffixtext="+" style="font-size: var(--ddd-font-size-3xl); font-weight: var(--ddd-font-weight-bold)" data-primary="10"></count-up>\n' +
      '  <div class="label">Students reached</div>\n' +
      "  <p>Across 14 campuses this year.</p>\n" +
      "</div>",
    hax: { publish: "stax-area", templateType: "area" },
  },
  {
    id: "mol-pill",
    level: "molecule",
    title: "Pill / tag",
    description:
      "A compact pill-shaped label using simple-tag. Supports accent-color, auto-accent-color (derive from label), cancel-button, and toggle. This is the canonical pill pattern for the ecosystem and the documented form for token/label metadata inline.",
    components: ["simple-tag"],
    tokens: ["data-primary", "data-accent", "--ddd-font-size-4xs"],
    darkMode: "supported",
    html:
      '<simple-tag value="NEW" accent-color="blue" readonly></simple-tag>\n' +
      '<simple-tag value="Open" accent-color="green" auto-accent-color></simple-tag>\n' +
      '<simple-tag value="Draft" accent-color="orange" cancel-button></simple-tag>',
    hax: { publish: "demoSchemaOverride", targetTag: "simple-tag" },
  },
  {
    id: "mol-callout",
    level: "molecule",
    title: "Callout (stop-note status variants)",
    description:
      "stop-note with stop / warning / success / info status and a slotted message. stop-note is HAX-capable.",
    components: ["stop-note"],
    tokens: ["data-accent", "data-border-radius"],
    darkMode: "supported",
    html:
      '<stop-note title="Read the textbook" status="info" data-accent="9" data-border-radius="xs">\n' +
      '  <span slot="message">Chapters 4-6 cover this concept in depth.</span>\n' +
      "</stop-note>",
    hax: { publish: "demoSchemaOverride", targetTag: "stop-note" },
  },
  {
    id: "mol-link-tile",
    level: "molecule",
    title: "Link tile",
    description:
      "accent-card with heading / content / footer slots and a link. accent-card is HAX-capable.",
    components: ["accent-card"],
    tokens: ["data-primary", "data-accent", "data-border-radius"],
    darkMode: "supported",
    html:
      '<accent-card accent-color="blue" link="https://haxtheweb.org" image-src="files/card.jpg" data-primary="1" data-accent="2">\n' +
      '  <h3 slot="heading">Get started with HAX</h3>\n' +
      '  <div slot="content">A quick tour of the authoring experience.</div>\n' +
      '  <div slot="footer">Read more</div>\n' +
      "</accent-card>",
    hax: { publish: "demoSchemaOverride", targetTag: "accent-card" },
  },
  {
    id: "mol-avatar-byline",
    level: "molecule",
    title: "Avatar byline",
    description:
      "author-card with name / title / description / image / profile-url. author-card is HAX-capable and DDD-based.",
    components: ["author-card"],
    tokens: ["data-primary", "data-accent", "data-border-radius"],
    darkMode: "supported",
    html: '<author-card name="Bryan Ollendieck" title="Product Owner, HAX" description="Builds open authoring tools for the web." image="files/avatar.jpg" profile-url="https://hax.psu.edu" social-link="https://x.com/btopro" social-handle="@btopro" data-primary="1" data-accent="2"></author-card>',
    hax: { publish: "demoSchemaOverride", targetTag: "author-card" },
  },
  {
    id: "mol-badge-chip",
    level: "molecule",
    title: "Badge chip (figure-label)",
    description:
      "figure-label as a small badge with title + description + accent-color. figure-label is HAX-capable.",
    components: ["figure-label"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "supported",
    html: '<figure-label accent-color="blue" title="NEW" description="Interdisciplinary Science and Business Degree"></figure-label>',
    hax: { publish: "demoSchemaOverride", targetTag: "figure-label" },
  },
  {
    id: "mol-pull-quote",
    level: "molecule",
    title: "Pull quote",
    description:
      "block-quote with citation + image + slotted quote. block-quote is HAX-capable.",
    components: ["block-quote"],
    tokens: ["data-primary", "data-accent", "data-border-left"],
    darkMode: "supported",
    html:
      '<block-quote citation="Albert Einstein" image="files/einstein.jpg" data-primary="2">\n' +
      '  <span slot="quote">If a person falls freely, he will not feel his own weight.</span>\n' +
      "</block-quote>",
    hax: { publish: "demoSchemaOverride", targetTag: "block-quote" },
  },
  {
    id: "mol-cta-button",
    level: "molecule",
    title: "CTA button (simple-cta variants)",
    description:
      "simple-cta with data-primary / data-accent and light / hotline / large / hide-icon / filled / outlined modifiers. simple-cta is HAX-capable.",
    components: ["simple-cta"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "supported",
    html:
      '<simple-cta link="https://haxtheweb.org" data-primary="1" data-accent="9" light>Get started</simple-cta>\n' +
      '<simple-cta link="https://haxtheweb.org" data-primary="8" hotline filled>Log in</simple-cta>',
    hax: { publish: "demoSchemaOverride", targetTag: "simple-cta" },
  },
  {
    id: "mol-tag-pill-list",
    level: "molecule",
    title: "Tag / pill list",
    description:
      "ul.ddd-link-list of link pills. Pure light-DOM HTML using the DDD link-list class.",
    components: [],
    tokens: ["ddd-link-list", "data-primary"],
    darkMode: "supported",
    html:
      '<ul class="ddd-link-list" data-primary="1">\n' +
      '  <li><a href="#">All Degrees</a></li>\n' +
      '  <li><a href="#">Engineering</a></li>\n' +
      '  <li><a href="#">Digital Media</a></li>\n' +
      "</ul>",
    hax: { publish: "recipe-only", dataAttributes: ["data-primary"] },
  },
  {
    id: "mol-self-check-question",
    level: "molecule",
    title: "Self-check question",
    description:
      "self-check with title / image / alt and a slotted question. self-check is HAX-capable.",
    components: ["self-check"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "supported",
    html:
      '<self-check title="Sharks Self Check" image="files/shark.jpg" alt="Great white shark" data-primary="17">\n' +
      '  <span slot="question">How large can the average great white shark grow to be?</span>\n' +
      "  The Great White shark can grow to be 15 ft to more than 20 ft in length.\n" +
      "</self-check>",
    hax: { publish: "demoSchemaOverride", targetTag: "self-check" },
  },
  {
    id: "mol-figure-caption",
    level: "molecule",
    title: "Figure with caption (a11y-figure)",
    description:
      "a11y-figure with imgSrc / imgAlt and figcaption + details + summary slots. a11y-figure is HAX-capable.",
    components: ["a11y-figure"],
    tokens: ["data-border-radius", "data-padding"],
    darkMode: "supported",
    html:
      '<a11y-figure img-src="files/chart.png" img-alt="Bar chart: enrollment doubled 2019-2024">\n' +
      '  <div slot="figcaption">Enrollment growth, 2019-2024.</div>\n' +
      '  <div slot="summary">Data details</div>\n' +
      '  <div slot="details">Source: institutional research office, fall census.</div>\n' +
      "</a11y-figure>",
    hax: { publish: "demoSchemaOverride", targetTag: "a11y-figure" },
  },
];

/**
 * Organisms (8-10): larger composed blocks. All publish as stax-area.
 */
const ORGANISMS = [
  {
    id: "org-hero",
    level: "organism",
    title: "Hero section",
    description:
      "page-section large/full/filter/fold/image with h1 + hr + p + simple-cta slot=buttons. hero / antihero / video preset variants.",
    components: ["page-section", "simple-cta"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "supported",
    html:
      '<page-section large full filter fold image="files/hero.jpg" accent-color="blue">\n' +
      "  <h1>We will meet you where you are.</h1>\n" +
      "  <hr />\n" +
      "  <p>Ready for you, future Nittany Lions.</p>\n" +
      '  <simple-cta slot="buttons" link="https://hax.psu.edu" hotline filled>Log in</simple-cta>\n' +
      "</page-section>",
    hax: { publish: "stax-area", templateType: "area" },
  },
  {
    id: "org-feature-card-grid",
    level: "organism",
    title: "Feature card grid",
    description: "grid-plate layout 1-1-1 holding three accent-cards.",
    components: ["grid-plate", "accent-card"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "supported",
    html:
      '<grid-plate layout="1-1-1">\n' +
      '  <accent-card slot="col-1" accent-color="blue" link="https://haxtheweb.org"><h3 slot="heading">Author</h3><div slot="content">Write pages anywhere.</div></accent-card>\n' +
      '  <accent-card slot="col-2" accent-color="green" link="https://haxtheweb.org"><h3 slot="heading">Publish</h3><div slot="content">Push to the web.</div></accent-card>\n' +
      '  <accent-card slot="col-3" accent-color="orange" link="https://haxtheweb.org"><h3 slot="heading">Remix</h3><div slot="content">Copy and adapt openly.</div></accent-card>\n' +
      "</grid-plate>",
    hax: { publish: "stax-area", templateType: "area" },
  },
  {
    id: "org-faq-accordion",
    level: "organism",
    title: "FAQ accordion group",
    description:
      "page-section wrapping a11y-collapse items with heading-button (a11y-collapse heading-button rule).",
    components: ["page-section", "a11y-collapse"],
    tokens: ["data-primary"],
    darkMode: "supported",
    html:
      '<page-section accent-color="blue">\n' +
      "  <h3>Frequently Asked Questions</h3>\n" +
      "  <hr />\n" +
      '  <a11y-collapse heading-button heading="Who can use HAX?"><div>Anyone with a web server and a domain.</div></a11y-collapse>\n' +
      '  <a11y-collapse heading-button heading="Is it free?"><div>Yes, open source.</div></a11y-collapse>\n' +
      "</page-section>",
    hax: { publish: "stax-area", templateType: "area" },
  },
  {
    id: "org-testimonial",
    level: "organism",
    title: "Testimonial block",
    description:
      "person-testimonial with image / name / position and a slotted quote.",
    components: ["person-testimonial"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "todo",
    html:
      '<person-testimonial image="files/person.jpg" name="Jamie Rivera" position="Instructional Designer">\n' +
      "  HAX let me ship a course site in an afternoon.\n" +
      "</person-testimonial>",
    hax: { publish: "demoSchemaOverride", targetTag: "person-testimonial" },
  },
  {
    id: "org-media-playlist",
    level: "organism",
    title: "Media playlist block",
    description:
      "media-playlist wrapping audio-player (and/or video-player) children in light DOM. media-playlist + audio-player are HAX-capable.",
    components: ["media-playlist", "audio-player"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "supported",
    html:
      "<media-playlist>\n" +
      '  <audio-player source="files/track1.mp3" media-title="Lecture 1"></audio-player>\n' +
      '  <audio-player source="files/track2.mp3" media-title="Lecture 2"></audio-player>\n' +
      "</media-playlist>",
    hax: { publish: "demoSchemaOverride", targetTag: "media-playlist" },
  },
  {
    id: "org-timeline",
    level: "organism",
    title: "Timeline",
    description:
      "lrndesign-timeline for a sequence of events. lrndesign-timeline is HAX-capable.",
    components: ["lrndesign-timeline"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "todo",
    html:
      '<lrndesign-timeline accent-color="blue">\n' +
      '  <div slot="event">2012 - ELMS:LN launched</div>\n' +
      '  <div slot="event">2022 - HAX spun out</div>\n' +
      "</lrndesign-timeline>",
    hax: { publish: "demoSchemaOverride", targetTag: "lrndesign-timeline" },
  },
  {
    id: "org-data-table",
    level: "organism",
    title: "Data table",
    description:
      "editable-table for authored data tables; note editable-table-display is the preferred presentation for admin panels per the standing rule.",
    components: ["editable-table"],
    tokens: ["data-primary", "data-accent", "data-border-radius"],
    darkMode: "supported",
    html:
      '<editable-table accent-color="blue" data-primary="1" data-border-radius="xs">\n' +
      "  <table>\n" +
      "    <thead><tr><th>Year</th><th>Enrollment</th></tr></thead>\n" +
      "    <tbody><tr><td>2019</td><td>640</td></tr><tr><td>2024</td><td>1250</td></tr></tbody>\n" +
      "  </table>\n" +
      "</editable-table>",
    hax: { publish: "demoSchemaOverride", targetTag: "editable-table" },
  },
  {
    id: "org-tabs",
    level: "organism",
    title: "Tabs content",
    description: "a11y-tabs with named tab panels. a11y-tabs is HAX-capable.",
    components: ["a11y-tabs"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "supported",
    html:
      '<a11y-tabs accent-color="blue">\n' +
      '  <a11y-tab id="overview" label="Overview"><p>High-level summary.</p></a11y-tab>\n' +
      '  <a11y-tab id="details" label="Details"><p>Deep dive.</p></a11y-tab>\n' +
      "</a11y-tabs>",
    hax: { publish: "demoSchemaOverride", targetTag: "a11y-tabs" },
  },
  {
    id: "org-steps",
    level: "organism",
    title: "Steps / process",
    description:
      "ddd-steps-list with ddd-steps-list-item children. Both are HAX-capable.",
    components: ["ddd-steps-list", "ddd-steps-list-item"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "supported",
    html:
      "<ddd-steps-list>\n" +
      '  <ddd-steps-list-item title="Register for classes"><p>Sign up before the deadline.</p></ddd-steps-list-item>\n' +
      '  <ddd-steps-list-item title="Pay for class"><p>Submit payment to hold your seat.</p></ddd-steps-list-item>\n' +
      '  <ddd-steps-list-item title="Go to class"><p>Attend and engage.</p></ddd-steps-list-item>\n' +
      "</ddd-steps-list>",
    hax: { publish: "stax-area", templateType: "area" },
  },
];

/**
 * Templates (5-6): full-page or full-area compositions. Publish as stax-page.
 */
const TEMPLATES = [
  {
    id: "tpl-landing",
    level: "template",
    title: "Landing",
    description:
      "Hero + feature card grid + CTA band. A complete landing area.",
    components: ["page-section", "grid-plate", "accent-card", "simple-cta"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "supported",
    html:
      '<page-section large full filter fold image="files/hero.jpg" accent-color="blue">\n' +
      "  <h1>Create anything with HAX</h1>\n" +
      "  <hr />\n" +
      "  <p>Open authoring for the web.</p>\n" +
      '  <simple-cta slot="buttons" link="https://haxtheweb.org" hotline filled>Start now</simple-cta>\n' +
      "</page-section>\n" +
      '<grid-plate layout="1-1-1">\n' +
      '  <accent-card slot="col-1"><h3 slot="heading">Author</h3><div slot="content">Write pages anywhere.</div></accent-card>\n' +
      '  <accent-card slot="col-2"><h3 slot="heading">Publish</h3><div slot="content">Push to the web.</div></accent-card>\n' +
      '  <accent-card slot="col-3"><h3 slot="heading">Remix</h3><div slot="content">Copy and adapt openly.</div></accent-card>\n' +
      "</grid-plate>\n" +
      '<page-section preset="antihero" scroller><h2>Ready to begin?</h2><simple-cta link="https://haxtheweb.org" filled>Get started</simple-cta></page-section>',
    hax: { publish: "stax-page", templateType: "page" },
  },
  {
    id: "tpl-article",
    level: "template",
    title: "Article / blog post",
    description:
      "Headline + byline + body + pull quote + media-image + self-check.",
    components: ["block-quote", "media-image", "self-check"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "supported",
    html:
      '<h1 data-design-treatment="vert" data-primary="2">A new approach to open authoring</h1>\n' +
      '<p class="byline" data-design-treatment="horz-10p" data-primary="8">By Bryan Ollendieck</p>\n' +
      "<p>Body paragraph one.</p>\n" +
      '<block-quote citation="A reader" data-primary="2"><span slot="quote">This changed how I build courses.</span></block-quote>\n' +
      '<media-image source="files/figure.jpg" figure-label-title="1.1" figure-label-description="Workflow" alt="Authoring workflow diagram"><div slot="caption">The HAX authoring loop.</div></media-image>\n' +
      '<self-check title="Check your understanding" data-primary="17"><span slot="question">What does HAX prioritize?</span>Accessibility, extensibility, and remixability.</self-check>',
    hax: { publish: "stax-page", templateType: "page" },
  },
  {
    id: "tpl-course-module",
    level: "template",
    title: "Course module",
    description: "learning-component + objectives list + content + self-check.",
    components: ["learning-component", "self-check"],
    tokens: ["data-primary", "data-accent", "data-instructional-action"],
    darkMode: "supported",
    html:
      '<learning-component subtitle="Step 1: Frame the problem" accent-color="blue" title="Learning Objectives" icon="courseicons:learning-objectives">\n' +
      "  <ul>\n" +
      "    <li>Define the target audience</li>\n" +
      "    <li>State the core problem</li>\n" +
      "  </ul>\n" +
      "</learning-component>\n" +
      "<h2 //>Read</h2>\n" +
      "<p>Background reading on the problem space.</p>\n" +
      '<self-check title="Check your understanding" data-primary="17"><span slot="question">Who is the audience?</span>The people who will use what you build.</self-check>',
    hax: { publish: "stax-page", templateType: "page" },
  },
  {
    id: "tpl-profile",
    level: "template",
    title: "Profile / bio",
    description: "author-card + media + stats row.",
    components: ["author-card", "media-image", "grid-plate"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "supported",
    html:
      '<author-card name="Bryan Ollendieck" title="Product Owner, HAX" description="Builds open authoring tools." image="files/avatar.jpg" profile-url="https://hax.psu.edu" data-primary="1" data-accent="2"></author-card>\n' +
      '<media-image source="files/workspace.jpg" figure-label-title="Workspace" figure-label-description="Where it happens" alt="Workspace photo"><div slot="caption">The desk where HAX is built.</div></media-image>\n' +
      '<grid-plate layout="1-1-1">\n' +
      '  <div slot="col-1" class="b-xs p-4 r-md bs-sm" style="text-align:center"><div style="font-size: var(--ddd-font-size-3xl); font-weight: var(--ddd-font-weight-bold)" data-primary="10">250+</div><div class="label">Components</div></div>\n' +
      '  <div slot="col-2" class="b-xs p-4 r-md bs-sm" style="text-align:center"><div style="font-size: var(--ddd-font-size-3xl); font-weight: var(--ddd-font-weight-bold)" data-primary="10">10yr</div><div class="label">Of OER</div></div>\n' +
      '  <div slot="col-3" class="b-xs p-4 r-md bs-sm" style="text-align:center"><div style="font-size: var(--ddd-font-size-3xl); font-weight: var(--ddd-font-weight-bold)" data-primary="10">Open</div><div class="label">By design</div></div>\n' +
      "</grid-plate>",
    hax: { publish: "stax-page", templateType: "page" },
  },
  {
    id: "tpl-faq",
    level: "template",
    title: "FAQ page",
    description: "page-section + a11y-collapse group with heading-button.",
    components: ["page-section", "a11y-collapse"],
    tokens: ["data-primary"],
    darkMode: "supported",
    html:
      '<page-section accent-color="blue">\n' +
      "  <h1>Frequently Asked Questions</h1>\n" +
      "  <hr />\n" +
      '  <a11y-collapse heading-button heading="Who can use HAX?"><div>Anyone with a web server and a domain.</div></a11y-collapse>\n' +
      '  <a11y-collapse heading-button heading="Is it free?"><div>Yes, open source.</div></a11y-collapse>\n' +
      '  <a11y-collapse heading-button heading="Can I host it myself?"><div>Yes, several backends are supported.</div></a11y-collapse>\n' +
      "</page-section>",
    hax: { publish: "stax-page", templateType: "page" },
  },
  {
    id: "tpl-gallery",
    level: "template",
    title: "Gallery / portfolio",
    description:
      "image-gallery holding media-image children in light DOM, in a grid-plate. image-gallery is HAX-capable.",
    components: ["image-gallery", "media-image", "grid-plate"],
    tokens: ["data-primary", "data-accent"],
    darkMode: "supported",
    html:
      '<grid-plate layout="1">\n' +
      '  <image-gallery slot="col-1" mode="masonry">\n' +
      '    <media-image source="files/a.jpg" alt="Project A"></media-image>\n' +
      '    <media-image source="files/b.jpg" alt="Project B"></media-image>\n' +
      '    <media-image source="files/c.jpg" alt="Project C"></media-image>\n' +
      "  </image-gallery>\n" +
      "</grid-plate>",
    hax: { publish: "stax-page", templateType: "page" },
  },
];

/**
 * Internal consistency contracts (cross-cutting; apply to element internals).
 * These are what the hax-pattern-library-audit skill grades and what later
 * application work would enforce. Defining them is in scope; mass-enforcing
 * across 226 elements is NOT (see plan scope boundary).
 */
export const INTERNAL_CONTRACTS = [
  {
    id: "contract-element-title",
    title: "Element title / caption",
    surface: "A titled element's primary heading or caption line.",
    tokens: [
      "--ddd-theme-h*-font-size",
      "--ddd-font-weight-bold",
      "--ddd-spacing-4",
      "data-primary",
    ],
    structure:
      "Use the DDD heading font-size scale (--ddd-theme-h*-font-size) + bold weight; margin top 0, bottom var(--ddd-spacing-2); optional data-primary for color. Apply consistently across video-player .video-caption, a11y-media-player media-title, stop-note #title, multiple-choice/QuestionElement question heading, media-image figure-label.",
    targetElements: [
      "video-player",
      "a11y-media-player",
      "stop-note",
      "multiple-choice",
      "media-image",
    ],
    example:
      '<h3 data-primary="2" style="font-size: var(--ddd-theme-h3-font-size); font-weight: var(--ddd-font-weight-bold); margin: 0 0 var(--ddd-spacing-2)">Element title</h3>',
  },
  {
    id: "contract-callout-status",
    title: "Callout / status box",
    surface: "A status callout (error / warning / success / info).",
    tokens: ["r-md", "p-4", "b-xs", "--ddd-icon-xs", "data-accent"],
    structure:
      "border-radius var(--ddd-radius-md), padding var(--ddd-spacing-4), border var(--ddd-border-xs), icon sized via --ddd-icon-xs, accent background via data-accent. Apply to stop-note status variants and self-check feedback.",
    targetElements: ["stop-note", "self-check"],
    example:
      '<stop-note title="Read the textbook" status="info" data-accent="9" data-border-radius="md"><span slot="message">Chapters 4-6 cover this concept in depth.</span></stop-note>',
  },
  {
    id: "contract-collapsible-heading",
    title: "Collapsible heading",
    surface:
      "The heading of a collapsible / accordion item or fieldset legend.",
    tokens: ["heading-button", "--ddd-font-weight-bold", "--ddd-spacing-4"],
    structure:
      "heading-button attribute set (per rule) so the whole heading is clickable; heading typography uses --ddd-font-weight-bold; horizontal padding var(--ddd-spacing-4). Apply to a11y-collapse, a11y-details, and admin-panel collapsed fieldset legends (simple-fields, grade-book, cms-hax views).",
    targetElements: [
      "a11y-collapse",
      "a11y-details",
      "simple-fields",
      "grade-book",
      "cms-hax",
    ],
    example:
      '<a11y-collapse heading-button heading="Click the whole heading to expand"><div>Content revealed by clicking anywhere on the heading row.</div></a11y-collapse>',
  },
  {
    id: "contract-click-to-reveal-trigger",
    title: "Click-to-reveal trigger",
    surface: "The button that reveals content (check answer, reveal, toggle).",
    tokens: [
      "simple-cta",
      "simple-icon-button-lite",
      "--ddd-icon-xs",
      "--ddd-spacing-2",
    ],
    structure:
      "Use simple-cta or simple-icon-button-lite (preferred per rules) for the trigger; icon sized via --ddd-icon-xs; spacing var(--ddd-spacing-2) between trigger and revealed content. Apply to multiple-choice check-answer, self-check reveal, a11y-collapse toggle.",
    targetElements: ["multiple-choice", "self-check", "a11y-collapse"],
    example: '<simple-cta link="#" data-primary="8">Check answer</simple-cta>',
  },
  {
    id: "contract-iframe-embed-wrapper",
    title: "Iframe / embed wrapper",
    surface:
      "A wrapper around an embedded iframe (wikipedia, runkit, spotify, etc.).",
    tokens: ["p-4", "b-xs", "r-md"],
    structure:
      "wrapper padding var(--ddd-spacing-4), border var(--ddd-border-xs), radius var(--ddd-radius-md), with a caption slot below. Apply to wikipedia-query, video-player iframe path, runkit-embed, spotify-embed, twitter-embed, linkedin-embed.",
    targetElements: [
      "wikipedia-query",
      "video-player",
      "runkit-embed",
      "spotify-embed",
      "twitter-embed",
      "linkedin-embed",
    ],
    example:
      '<div class="b-xs p-4 r-md" style="background-color: light-dark(var(--ddd-theme-default-limestoneMaxLight), var(--ddd-theme-default-coalyGray))"><wikipedia-query search="Open Educational Resources"></wikipedia-query><p style="font-size: var(--ddd-font-size-5xs); margin: var(--ddd-spacing-2) 0 0">Caption: embedded Wikipedia summary.</p></div>',
  },
  {
    id: "contract-admin-fieldset",
    title: "Admin panel fieldset",
    surface: "A collapsed group / fieldset in an admin panel.",
    tokens: [
      "heading-button",
      "--ddd-font-weight-bold",
      "--ddd-spacing-4",
      "--ddd-spacing-2",
    ],
    structure:
      "Mirror the public a11y-collapse / multiple-choice spacing: collapsed-group heading uses --ddd-font-weight-bold + var(--ddd-spacing-4) padding; field spacing var(--ddd-spacing-2); interior text uses DDD font-size scale so admin UI and authored UI feel identical.",
    targetElements: ["simple-fields", "grade-book", "cms-hax"],
    example:
      '<a11y-collapse heading-button heading="Site settings" expanded><div style="font-size: var(--ddd-font-size-5xs); padding: var(--ddd-spacing-2) var(--ddd-spacing-4)"><p>Field one</p><p>Field two</p></div></a11y-collapse>',
  },
];

/**
 * Full pattern list (atoms + molecules + organisms + templates).
 */
export const DDDPATTERNS = [...ATOMS, ...MOLECULES, ...ORGANISMS, ...TEMPLATES];

/**
 * Helper: get patterns by level.
 * @param {string} level atom|molecule|organism|template
 * @returns {Array}
 */
export function getPatternsByLevel(level) {
  return DDDPATTERNS.filter((p) => p.level === level);
}

/**
 * Helper: get a single pattern by id.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getPatternById(id) {
  return DDDPATTERNS.find((p) => p.id === id);
}

/**
 * Helper: list every component tag referenced across all patterns.
 * @returns {string[]}
 */
export function getAllPatternComponents() {
  const set = new Set();
  DDDPATTERNS.forEach((p) => {
    (p.components || []).forEach((tag) => set.add(tag));
  });
  return Array.from(set);
}

/**
 * HAX-capability gate. Returns a report of which referenced components are
 * verified HAX-capable, which are excluded (non-HAX), and which are unverified.
 * Patterns whose components include an excluded tag are flagged so the stax
 * wiring does not publish them; the audit skill surfaces these as gaps.
 *
 * @param {object} [capability] override table (defaults to HAX_CAPABILITY)
 * @returns {{verified:string[], excluded:string[], unverified:string[], flaggedPatterns: object[]}}
 */
export function resolveHaxCapabilityReport(capability) {
  const table = capability || HAX_CAPABILITY;
  const verified = [];
  const excluded = [];
  const unverified = [];
  const flaggedPatterns = [];
  DDDPATTERNS.forEach((p) => {
    const bad = [];
    (p.components || []).forEach((tag) => {
      if (table[tag] === true) {
        if (!verified.includes(tag)) verified.push(tag);
      } else if (table[tag] === false) {
        if (!excluded.includes(tag)) excluded.push(tag);
        if (!bad.includes(tag)) bad.push(tag);
      } else {
        if (!unverified.includes(tag)) unverified.push(tag);
      }
    });
    if (bad.length > 0) {
      flaggedPatterns.push({
        id: p.id,
        title: p.title,
        excludedComponents: bad,
      });
    }
  });
  return { verified, excluded, unverified, flaggedPatterns };
}

/**
 * Helper: which internal contracts apply to a given element tag.
 * Used by the audit skill to know which contracts to grade for an element.
 * @param {string} tag
 * @returns {object[]}
 */
export function getContractsForElement(tag) {
  return INTERNAL_CONTRACTS.filter((c) =>
    (c.targetElements || []).includes(tag),
  );
}

/**
 * Helper: which patterns include a given component tag (composition conformance
 * lookup for the audit skill).
 * @param {string} tag
 * @returns {object[]}
 */
export function getPatternsUsingComponent(tag) {
  return DDDPATTERNS.filter((p) => (p.components || []).includes(tag));
}
