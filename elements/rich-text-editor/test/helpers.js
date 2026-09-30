// shared helpers for rich-text-editor tests
import { fixture, html } from '@open-wc/testing'
import '../rich-text-editor.js'
import '../lib/toolbars/rich-text-editor-toolbar.js'
import '../lib/toolbars/rich-text-editor-toolbar-full.js'

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// rich-text-editor sets tabindex in connectedCallback (fixed, issue #3077
// bug 1), so createElement is safe, but fixture keeps parity with the rest
// of the suite's element construction
export async function makeEditor(content) {
  const el = await fixture(html`<rich-text-editor></rich-text-editor>`)
  // an explicit empty string must stay empty (|| would fall back)
  el.innerHTML = content === undefined ? '<p>hello world</p>' : content
  await sleep(0)
  return el
}

// a plain contenteditable div target: unlike rich-text-editor it has no
// shadow root, which keeps range scoping simple in tests that do not need
// the editor's light-DOM/slotted selection paths
export async function makeTarget(content) {
  const el = globalThis.document.createElement('div')
  el.setAttribute('contenteditable', 'true')
  el.innerHTML = content || '<p>hello world</p>'
  globalThis.document.body.appendChild(el)
  await sleep(0)
  return el
}

export async function makeToolbar(tag) {
  // toolbar constructors set no attributes, so createElement is safe here
  // (unlike rich-text-editor itself)
  const el = globalThis.document.createElement(tag || 'rich-text-editor-toolbar')
  globalThis.document.body.appendChild(el)
  await sleep(0)
  return el
}

export function selectContents(editor, selector) {
  const node = editor.querySelector(selector || 'p')
  const range = globalThis.document.createRange()
  range.selectNodeContents(node)
  const sel = globalThis.getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
  return range
}

// stub and restore a property on an object (own property, configurable)
export function stubProperty(obj, prop, value) {
  const had = Object.prototype.hasOwnProperty.call(obj, prop)
  const previous = had ? obj[prop] : undefined
  Object.defineProperty(obj, prop, {
    get() {
      return value
    },
    configurable: true,
  })
  return () => {
    if (had) {
      obj[prop] = previous
    } else {
      delete obj[prop]
    }
  }
}
