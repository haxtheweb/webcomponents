#!/usr/bin/env node

/**
 * HAX Elements Demo Page Generator
 *
 * Regenerates the Welcome page of the HAXcms demo site
 * (elements/haxcms-elements/demo) so that it contains one example
 * implementation of every HAX-capable element registered in
 * hax-elements-registry.json. This produces a single page that can be
 * scanned quickly for visual regressions across the whole library.
 *
 * An example is resolved for each registry tag in this order:
 * 1. EXAMPLE_OVERRIDES - hand-authored markup that beats extraction because
 *    the extracted form depends on files that do not resolve from the demo
 *    site root (e.g. a relative data file)
 * 2. demoSchema - from the element's <tag>.haxProperties.json file or the
 *    demoSchema array literal in its source
 * 3. real usage snippet - the first full tag usage found in the element's
 *    demo/*.html files
 * 4. PRIMITIVE_EXAMPLES - hand-authored markup for plain HTML tags
 * 5. FALLBACK_EXAMPLES - hand-authored markup for elements that have no
 *    demoSchema and no demo usage to lift from
 * 6. a visible placeholder plus a console warning, so new elements that
 *    resolve nowhere are easy to spot
 *
 * Tags that only exist as internal parts of other elements, admin-only UI,
 * or non-visual wrappers are intentionally excluded from the gallery.
 * Non-authorable elements (editor internals, the lrndesign chart family,
 * web-container tooling, branding) never reach this script because they are
 * excluded from hax-elements-registry.json by scripts/hax-elements-discovery.js.
 *
 * This runs as part of yarn run ubiquity right after hax-elements-discovery
 * refreshes the registry, so the page stays in sync as elements are added or
 * modified. Do not edit the generated page by hand.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')
const DEMO_SITE_DIR = path.join(ROOT, 'elements/haxcms-elements/demo')
const REGISTRY_PATH = path.join(ROOT, 'hax-elements-registry.json')
const WC_REGISTRY_PATH = path.join(DEMO_SITE_DIR, 'wc-registry.json')
const ELEMENTS_DIR = path.join(ROOT, 'elements')
// used if the Welcome node cannot be found in the site outline
const FALLBACK_PAGE_ID = 'item-8a5bf844-d498-4f75-bf96-110eaedb42d9'

/**
 * Tags that are internal pieces of other elements or admin-only UI and are
 * never authored as standalone blocks on a page, so they stay off the gallery.
 * lrndesign-bar is excluded because bar charts are intentionally omitted.
 */
const EXCLUDED_TAGS = new Set([
  'app-hax-site-bar',
  'beaker-broker',
  'career-org-item',
  'career-role-item',
  'cms-block',
  'cms-entity',
  'cms-token',
  'cms-views',
  'collection-row',
  'course-design',
  'glossy-portfolio-about',
  'glossy-portfolio-breadcrumb',
  'glossy-portfolio-card',
  'glossy-portfolio-footer',
  'glossy-portfolio-grid',
  'glossy-portfolio-header',
  'glossy-portfolio-home',
  'glossy-portfolio-theme',
  'grade-book',
  'hax-app-installer',
  'hax-autoloader',
  'hax-body',
  'hax-context-item',
  'hax-context-item-textop',
  'hax-element-list-selector',
  'hax-store',
  'haxcms-site-editor-ui',
  'instruction-card',
  'lesson-highlight',
  'lrs-emitter',
  'site-uuid-link',
  'lrndesign-bar',
  'lrndesign-chart',
  'lrndesign-line',
  'lrndesign-pie',
  "glossy-portfolio-about",
  "glossy-portfolio-breadcrumb",
  "glossy-portfolio-card",
  "glossy-portfolio-footer",
  "glossy-portfolio-grid",
  "glossy-portfolio-header",
  "glossy-portfolio-home",
  "glossy-portfolio-theme",
  "site-available-themes",
  "resume-theme",
])

/**
 * Short explanations rendered above specific examples so testers understand
 * why a section does not use the literal tag from the registry.
 */
const SECTION_NOTES = {
  'iframe-loader':
    'iframe-loader is the authoring wrapper around embedded iframe content, so its demoSchema demos the plain iframe it produces.',
}

/**
 * Hand-authored examples that must win over extraction. Add an entry here
 * when an element's extracted example depends on files that do not resolve
 * from the demo site root (e.g. a relative data file) and a self-contained
 * variant is needed instead.
 */
const EXAMPLE_OVERRIDES = {}

/**
 * Hand-authored examples for registry tags with no demoSchema and no demo
 * usage to lift.
 */
const FALLBACK_EXAMPLES = {
  'lesson-overview': `<lesson-overview>
  <lesson-highlight icon="school" title="Lesson 1: Introduction" subtitle="Read the introduction section"></lesson-highlight>
  <lesson-highlight accent-color="blue" icon="star" title="Lesson 2: Building" subtitle="Work through the hands-on activity"></lesson-highlight>
</lesson-overview>`,
  'page-anchor': `<p>Click the highlighted anchor to jump back to the top of the gallery: <page-anchor target="#gallery-top">back to the top</page-anchor></p>`,
  'site-collection-list': `<site-collection-list responsive-width="913" responsive-size="sm" published="" limit="8" sort="title" breakpoint-sm="900" breakpoint-md="1200" breakpoint-lg="1500" breakpoint-xl="1800" parent="item-a13f6fde-9c55-4a1c-bd64-cf8498be649d" items-per-row="7" sort-obj="{&quot;title&quot;:&quot;ASC&quot;}" edit-mode="" accent-color="grey"></site-collection-list>`,
}

/**
 * One simple example for every plain HTML tag the HAX editor can author.
 * Tags that need a structural context (li, td, dt, caption, etc.) are
 * wrapped in the minimum valid markup for that context.
 */
const PRIMITIVE_EXAMPLES = {
  a: '<a href="https://haxtheweb.org/" target="_blank">HAXTheWeb</a>',
  abbr: '<p><abbr title="Headless Authoring eXperience">HAX</abbr> is a radically simple way to create web content.</p>',
  audio: '<audio controls src="https://archive.org/download/tvtunes_4710/Jonny%20Quest.mp3"></audio>',
  b: '<p>The following word is <b>bold</b>.</p>',
  blockquote: '<blockquote cite="https://haxtheweb.org/">HAX seeks to bring the web to the level of sustainability of the 90s web but without technical barriers to participate.</blockquote>',
  caption: '<table><caption>Daily totals</caption><tr><td>128</td></tr></table>',
  cite: '<p><cite>Designing with Web Standards</cite> by Jeffrey Zeldman.</p>',
  code: '<p>Run <code>yarn run ubiquity</code> to rebuild the published files.</p>',
  dd: '<dl><dt>HAX</dt><dd>Headless Authoring eXperience</dd></dl>',
  div: '<div>A generic container for flow content.</div>',
  dl: '<dl><dt>HAX</dt><dd>Headless Authoring eXperience</dd><dt>JOS</dt><dd>JSON Outline Schema</dd></dl>',
  dt: '<dl><dt>HAX</dt><dd>Headless Authoring eXperience</dd></dl>',
  em: '<p>This sentence contains <em>emphasized</em> text.</p>',
  embed: '<embed src="https://placehold.co/300x150.png" width="300" height="150" title="Placeholder image">',
  figcaption: '<figure><img src="https://placehold.co/300x150" alt="Placeholder image"><figcaption>A caption for the placeholder figure.</figcaption></figure>',
  figure: '<figure><img src="https://placehold.co/300x150" alt="Placeholder image"><figcaption>A figure with an image and caption.</figcaption></figure>',
  h1: '<h1>Heading level 1</h1>',
  h2: '<h2>Heading level 2</h2>',
  h3: '<h3>Heading level 3</h3>',
  h4: '<h4>Heading level 4</h4>',
  h5: '<h5>Heading level 5</h5>',
  h6: '<h6>Heading level 6</h6>',
  hr: '<p>Content above the rule.</p><hr><p>Content below the rule.</p>',
  i: '<p>The following word is <i>italic</i>.</p>',
  iframe: '<iframe src="https://example.com/" width="320" height="180" title="Example iframe"></iframe>',
  img: '<img src="https://placehold.co/320x180" alt="Placeholder image">',
  kbd: '<p>Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.</p>',
  li: '<ul><li>A single list item</li></ul>',
  mark: '<p>This sentence has a <mark>marked</mark> word.</p>',
  ol: '<ol><li>First step</li><li>Second step</li><li>Third step</li></ol>',
  p: '<p>A paragraph of plain text.</p>',
  picture: '<picture><source srcset="https://placehold.co/640x320" media="(min-width: 600px)"><img src="https://placehold.co/320x180" alt="Placeholder picture"></picture>',
  pre: '<pre>yarn run ubiquity\n# rebuilds the published files</pre>',
  section: '<section><h3>Section heading</h3><p>Content inside a sectioning element.</p></section>',
  span: '<p>This sentence has a <span>span of inline text</span>.</p>',
  strike: '<p>The following word is <strike>struck</strike>.</p>',
  strong: '<p>The following word is <strong>strong</strong>.</p>',
  sub: '<p>The chemical formula for water is H<sub>2</sub>O.</p>',
  sup: '<p>Mass-energy equivalence is E = mc<sup>2</sup>.</p>',
  table: '<table><thead><tr><th scope="col">Tag</th><th scope="col">Title</th></tr></thead><tbody><tr><td>p</td><td>Paragraph</td></tr></tbody></table>',
  td: '<table><tr><td>A single table cell</td></tr></table>',
  th: '<table><thead><tr><th scope="col">A single table header cell</th></tr></thead></table>',
  time: '<p>HAX work started <time datetime="2016">in 2016</time>.</p>',
  tr: '<table><tr><td>A single table row</td></tr></table>',
  u: '<p>The following word is <u>underlined</u>.</p>',
  ul: '<ul><li>First item</li><li>Second item</li></ul>',
  video: '<video controls width="320" src="https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4"></video>',
}

let wcRegistry = null
let elementDirs = null

function getWcRegistry() {
  if (wcRegistry === null) {
    try {
      wcRegistry = JSON.parse(fs.readFileSync(WC_REGISTRY_PATH, 'utf8'))
    } catch (error) {
      console.warn(
        'Could not read ' + WC_REGISTRY_PATH + ' (' + error.message + '); falling back to folder-name matching',
      )
      wcRegistry = {}
    }
  }
  return wcRegistry
}

function getElementDirs() {
  if (elementDirs === null) {
    elementDirs = fs
      .readdirSync(ELEMENTS_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  }
  return elementDirs
}

// map a registry tag to the element folder that defines it, using the
// wc-registry import path first and folder-name conventions as a fallback
function findFolderForTag(tag) {
  const importPath = getWcRegistry()[tag]
  if (importPath) {
    const match = importPath.match(/^@haxtheweb\/([^/]+)\//)
    if (match && getElementDirs().includes(match[1])) {
      return path.join(ELEMENTS_DIR, match[1])
    }
  }
  if (getElementDirs().includes(tag)) {
    return path.join(ELEMENTS_DIR, tag)
  }
  return null
}

// map a registry tag to the file that defines it, using the wc-registry
// import path first and folder conventions as a fallback
function findJsFileForTag(tag) {
  const importPath = getWcRegistry()[tag]
  if (importPath) {
    const match = importPath.match(/^@haxtheweb\/([^/]+)\/(.+)$/)
    if (match) {
      const full = path.join(ELEMENTS_DIR, match[1], match[2])
      if (fs.existsSync(full)) {
        return full
      }
    }
  }
  const folder = findFolderForTag(tag)
  if (folder) {
    const candidates = [path.join(folder, tag + '.js'), path.join(folder, 'lib', tag + '.js')]
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate
      }
    }
  }
  return null
}

/**
 * Extract a balanced [...] block following `keyword` from JS source text.
 * Bracket-depth and string-aware so nested arrays, quoted strings, and
 * escaped characters do not end the scan early.
 */
function extractBalancedArray(content, keyword) {
  const keywordIndex = content.indexOf(keyword)
  if (keywordIndex === -1) {
    return null
  }
  const bracketStart = content.indexOf('[', keywordIndex)
  if (bracketStart === -1) {
    return null
  }
  let depth = 0
  let inString = null
  let escaped = false
  for (let i = bracketStart; i < content.length; i++) {
    const char = content[i]
    if (inString) {
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === inString) {
        inString = null
      }
      continue
    }
    if (char === '"' || char === "'" || char === '`') {
      inString = char
      continue
    }
    if (char === '[') {
      depth++
    } else if (char === ']') {
      depth--
      if (depth === 0) {
        return content.slice(bracketStart, i + 1)
      }
    }
  }
  return null
}

/**
 * demoSchema values are JS array literals (unquoted keys, single quotes,
 * trailing commas) so JSON.parse cannot read them. Evaluate the literal
 * instead and let failures fall through to other resolution steps.
 */
function evalArrayLiteral(arrayText) {
  try {
    const value = new Function('return (' + arrayText + ');')()
    return Array.isArray(value) ? value : null
  } catch (error) {
    return null
  }
}

// resolve a tag's demoSchema array, preferring haxProperties.json files and
// falling back to parsing the array literal out of the element's source
function findDemoSchema(tag) {
  const folder = findFolderForTag(tag)
  if (folder) {
    const candidates = [
      path.join(folder, 'lib', tag + '.haxProperties.json'),
      path.join(folder, tag + '.haxProperties.json'),
    ]
    for (const candidate of candidates) {
      if (!fs.existsSync(candidate)) {
        continue
      }
      try {
        const data = JSON.parse(fs.readFileSync(candidate, 'utf8'))
        if (Array.isArray(data.demoSchema) && data.demoSchema.length > 0) {
          return data.demoSchema
        }
      } catch (error) {
        console.warn('Could not parse ' + candidate + ': ' + error.message)
      }
    }
  }
  const jsFile = findJsFileForTag(tag)
  if (jsFile) {
    const content = fs.readFileSync(jsFile, 'utf8')
    const arrayText = extractBalancedArray(content, 'demoSchema')
    const demos = arrayText ? evalArrayLiteral(arrayText) : null
    if (demos && demos.length > 0) {
      return demos
    }
  }
  return null
}

/**
 * Pull the first full usage of `tag` out of demo HTML, tracking nesting of
 * the same tag so self-nesting usage closes on the correct close tag.
 */
function extractTagUsage(html, tag) {
  // ignore commented-out examples
  html = html.replace(/<!--[\s\S]*?-->/g, '')
  const openMatch = new RegExp('<' + tag + '(\\s[^>]*)?>', 'i').exec(html)
  if (!openMatch) {
    return null
  }
  const openTagFull = openMatch[0]
  if (openTagFull.endsWith('/>')) {
    return openTagFull
  }
  const startIndex = openMatch.index
  let depth = 1
  let i = startIndex + openTagFull.length
  const closeTagString = '</' + tag + '>'
  while (i < html.length) {
    const nextOpen = html.indexOf('<' + tag, i)
    const nextClose = html.indexOf(closeTagString, i)
    if (nextClose === -1) {
      return null
    }
    if (nextOpen !== -1 && nextOpen < nextClose) {
      // only count a nested same-name tag when the match is the whole tag
      // name, not another tag that merely starts with the same characters
      const after = html[nextOpen + tag.length + 1]
      if (after === '>' || after === ' ' || after === '\n' || after === '\t' || after === '/') {
        depth++
      }
      i = nextOpen + tag.length + 1
      continue
    }
    depth--
    if (depth === 0) {
      return html.slice(startIndex, nextClose + closeTagString.length)
    }
    i = nextClose + closeTagString.length
  }
  return null
}

// find a real usage snippet in the element's demo html files
function findSnippet(tag) {
  const folder = findFolderForTag(tag)
  if (!folder) {
    return null
  }
  const candidates = []
  const demoDir = path.join(folder, 'demo')
  if (fs.existsSync(demoDir)) {
    candidates.push(path.join(demoDir, 'index.html'))
    candidates.push(
      ...fs
        .readdirSync(demoDir)
        .filter((file) => file.endsWith('.html') && file !== 'index.html')
        .sort()
        .map((file) => path.join(demoDir, file)),
    )
  }
  candidates.push(path.join(folder, 'index.html'))
  for (const candidate of candidates) {
    if (!fs.existsSync(candidate)) {
      continue
    }
    const snippet = extractTagUsage(fs.readFileSync(candidate, 'utf8'), tag)
    if (snippet) {
      return snippet
    }
  }
  return null
}

// escape a value used inside a double-quoted attribute, keeping any entity
// references already present in the value intact
function escapeAttribute(value) {
  return String(value)
    .replace(/&(?!(?:[a-zA-Z][a-zA-Z0-9]*|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// escape plain text content such as tag titles written into headings
function escapeText(value) {
  return String(value)
    .replace(/&(?!(?:[a-zA-Z][a-zA-Z0-9]*|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Convert a demoSchema entry ({tag, properties, content}) into example HTML,
 * converting camelCase property keys into kebab-case attributes the way HAX
 * writes them into page content.
 */
function demoSchemaToHtml(demo, fallbackTag) {
  const tag = demo.tag || fallbackTag
  let attrs = ''
  if (demo.properties && typeof demo.properties === 'object') {
    for (const [key, value] of Object.entries(demo.properties)) {
      // false booleans are skipped because a present attribute means true
      if (value === null || value === undefined || value === false) {
        continue
      }
      const attrName = key.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
      if (value === true) {
        attrs += ' ' + attrName
      } else if (typeof value === 'object') {
        attrs += ' ' + attrName + '="' + escapeAttribute(JSON.stringify(value)) + '"'
      } else {
        attrs += ' ' + attrName + '="' + escapeAttribute(value) + '"'
      }
    }
  }
  const content = typeof demo.content === 'string' ? demo.content : ''
  return '<' + tag + attrs + '>' + content + '</' + tag + '>'
}

/**
 * a11y-collapse is easier to activate when its whole heading is the button,
 * so make sure any a11y-collapse usage in generated examples has it set.
 */
function ensureA11yCollapseHeadingButton(html) {
  return html.replace(
    /<a11y-collapse(?=[\s>])(?![^>]*\bheading-button\b)([^>]*)>/g,
    '<a11y-collapse heading-button$1>',
  )
}

// resolve the example HTML for a registry tag, returning the html and the
// resolution method used so generation stats can be reported
function resolveExample(tag) {
  if (EXAMPLE_OVERRIDES[tag]) {
    return { html: EXAMPLE_OVERRIDES[tag], method: 'override' }
  }
  const demos = findDemoSchema(tag)
  if (demos && demos[0] && demos[0].tag) {
    return { html: demoSchemaToHtml(demos[0], tag), method: 'demoSchema' }
  }
  const snippet = findSnippet(tag)
  if (snippet) {
    return { html: snippet, method: 'demo snippet' }
  }
  if (PRIMITIVE_EXAMPLES[tag]) {
    return { html: PRIMITIVE_EXAMPLES[tag], method: 'primitive' }
  }
  if (FALLBACK_EXAMPLES[tag]) {
    return { html: FALLBACK_EXAMPLES[tag], method: 'fallback' }
  }
  return null
}

// locate the Welcome page of the demo site in the site outline so the
// generated content lands in the right place even if its id changes
function findOutputPath() {
  try {
    const site = JSON.parse(fs.readFileSync(path.join(DEMO_SITE_DIR, 'site.json'), 'utf8'))
    let found = null
    function walk(nodes) {
      for (const node of nodes) {
        if (node.slug === 'welcome' || node.title === 'Welcome') {
          found = node
          return
        }
        if (node.children) {
          walk(node.children)
          if (found) {
            return
          }
        }
      }
    }
    walk(site.items)
    if (found && found.id) {
      return path.join(DEMO_SITE_DIR, 'pages', found.id, 'index.html')
    }
  } catch (error) {
    console.warn('Could not find the Welcome page in site.json; using the known page id (' + error.message + ')')
  }
  return path.join(DEMO_SITE_DIR, 'pages', FALLBACK_PAGE_ID, 'index.html')
}

/**
 * Main generation function: read the registry, resolve an example for every
 * non-excluded tag, and write the full gallery page.
 */
function generateHaxElementsDemoPage() {
  console.log('🖼️ Generating the HAX elements gallery page...')

  if (!fs.existsSync(REGISTRY_PATH)) {
    console.error('❌ ' + REGISTRY_PATH + ' not found; run yarn run hax-elements-discovery first')
    process.exit(1)
  }
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'))
  const tags = Object.keys(registry).sort((a, b) => a.localeCompare(b))
  const outputPath = findOutputPath()

  const sections = []
  const missing = []
  const methodCounts = {}
  let displayed = 0
  let excluded = 0

  for (const tag of tags) {
    if (EXCLUDED_TAGS.has(tag)) {
      excluded++
      continue
    }
    const title = registry[tag] || tag
    let section =
      '<h2 id="element-' +
      tag +
      '"><code>' +
      escapeText('<' + tag + '>') +
      '</code> ' +
      escapeText(title) +
      '</h2>\n'
    if (SECTION_NOTES[tag]) {
      section += '<p><em>' + escapeText(SECTION_NOTES[tag]) + '</em></p>\n'
    }
    const example = resolveExample(tag)
    if (example) {
      section += ensureA11yCollapseHeadingButton(example.html.trim()) + '\n'
      displayed++
      methodCounts[example.method] = (methodCounts[example.method] || 0) + 1
    } else {
      section +=
        '<p><em>No example could be resolved for this element yet; add a demoSchema, a demo usage, or an entry in scripts/hax-elements-demo-page.js.</em></p>\n'
      missing.push(tag)
    }
    sections.push(section)
  }

  const parts = [
    '<!-- GENERATED FILE - DO NOT EDIT BY HAND -->',
    '<!-- Regenerated by scripts/hax-elements-demo-page.js, run by yarn run ubiquity after hax-elements-discovery. -->',
    '<p id="gallery-top">This page is an automatically generated gallery with one example implementation of every HAX-capable element in the webcomponents monorepo, so visual regressions can be reviewed on a single page. Examples are resolved from each element\'s HAX demoSchema, then its demo code, then hand-authored markup.</p>',
    '<p>' +
      displayed +
      ' of ' +
      tags.length +
      ' registered tags are shown below; ' +
      excluded +
      ' tags that are internal, admin-only, or non-visual wrappers are intentionally excluded.</p>',
    '',
    ...sections,
  ]

  fs.writeFileSync(outputPath, parts.join('\n'), 'utf8')

  console.log('✅ ' + displayed + ' of ' + tags.length + ' HAX-capable tags written to ' + path.relative(ROOT, outputPath))
  console.log(
    '   resolved via ' +
      Object.entries(methodCounts)
        .map(([method, count]) => method + ': ' + count)
        .join(', '),
  )
  if (missing.length > 0) {
    console.warn('⚠️  No example resolved for: ' + missing.join(', '))
    console.warn('   Add a demoSchema, a demo usage, or an entry in scripts/hax-elements-demo-page.js for these tags.')
  }
  return outputPath
}

// Run the script if called directly
if (import.meta.url === 'file://' + process.argv[1]) {
  generateHaxElementsDemoPage()
}

export default generateHaxElementsDemoPage
