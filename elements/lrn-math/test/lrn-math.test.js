import { fixture, expect, html } from '@open-wc/testing'

import { LrnMath, LrnMathController } from '../lrn-math.js'

// The module appends a <script src="https://cdnjs.../MathJax.js"> to load the
// real MathJax library. Tests must never hit the network, so intercept any
// script whose src references mathjax and silently drop it. Everything else
// still appends normally.
const origAppendChild = document.head.appendChild.bind(document.head)
document.head.appendChild = function (node) {
  if (
    node &&
    node.tagName === 'SCRIPT' &&
    node.getAttribute &&
    String(node.getAttribute('src')).indexOf('mathjax') !== -1
  ) {
    return node
  }
  return origAppendChild(node)
}

// getStyleNode() looks for a <style> element whose stylesheet has 100+ rules
// and a first rule of .mjx-chtml. Provide one so the typeset callback has a
// style node to clone into the shadow DOM.
const mjxStyle = document.createElement('style')
let mjxCss = '.mjx-chtml { font-size: 1em }'
for (let i = 0; i < 105; i++) {
  mjxCss += '\n.mjx-fake-rule-' + i + ' { color: red }'
}
mjxStyle.textContent = mjxCss
origAppendChild(mjxStyle)

let typesetCalls = 0
function makeFakeHub() {
  return {
    Queue(item) {
      if (typeof item === 'function') {
        item()
      } else if (Array.isArray(item) && item[0] === 'Typeset') {
        typesetCalls++
        item[2].forEach((script) => {
          const span = document.createElement('span')
          span.className = 'mjx-chtml'
          span.setAttribute('data-fake-typeset', 'true')
          script.parentNode.insertBefore(span, script)
        })
      }
    },
    Register: {
      StartupHook(name, fn) {
        fn()
      },
    },
  }
}

let fakeHubReady = false
async function ensureFakeHub() {
  if (fakeHubReady) return
  // the first <lrn-math> connection auto-creates the controller, which calls
  // load_library() and defines globalThis.MathJax (with the module's own
  // AuthorInit). Drive AuthorInit with a fake Hub so state becomes ready and
  // flush_typesets() runs without any network.
  if (globalThis.MathJax && globalThis.MathJax.AuthorInit) {
    globalThis.MathJax.Hub = makeFakeHub()
    globalThis.MathJax.AuthorInit()
    fakeHubReady = true
  }
}

describe('lrn-math test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(
      html` <lrn-math>c = \\sqrt{a^2 + b^2}</lrn-math> `,
    )
    await ensureFakeHub()
    await new Promise((resolve) => setTimeout(resolve, 50))
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })

  it('registers the lrn-math and lrn-math-controller tags', async () => {
    expect(LrnMath.tag).to.equal('lrn-math')
    expect(globalThis.customElements.get('lrn-math')).to.exist
    expect(globalThis.customElements.get('lrn-math-controller')).to.exist
  })

  it('observes only the mathtext attribute', async () => {
    expect(LrnMath.observedAttributes).to.deep.equal(['mathtext'])
  })

  it('creates a controller handler in the document head', async () => {
    const handler = document.querySelector('lrn-math-controller')
    expect(handler).to.exist
    expect(document.head.contains(handler)).to.be.true
  })

  it('typesets inline math into the shadow DOM', async () => {
    const sdom = element.shadowRoot
    expect(sdom.querySelector('span[data-fake-typeset]')).to.exist
    const style = sdom.querySelector('style')
    expect(style).to.exist
    expect(style.textContent.indexOf('.mjx-chtml')).to.not.equal(-1)
  })

  it('caches typesets so identical math is not re-typeset', async () => {
    const before = typesetCalls
    element.updateMath()
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(typesetCalls).to.equal(before)
  })

  it('re-typesets when the light DOM math changes', async () => {
    const before = typesetCalls
    element.textContent = 'a + b'
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(typesetCalls).to.equal(before + 1)
    const span = element.shadowRoot.querySelector('span[data-fake-typeset]')
    expect(span).to.exist
  })

  it('typesets display-mode math via the mode attribute', async () => {
    const displayEl = await fixture(
      html` <lrn-math mode="display">\\sum_{k=1}^n k</lrn-math> `,
    )
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(displayEl.shadowRoot.querySelector('span[data-fake-typeset]')).to
      .exist
    // the D-prefixed cache key separates display from inline content
    expect(displayEl.getAttribute('mathtext')).to.exist
  })

  it('exposes mathtext as a reflected attribute', async () => {
    expect(element.getAttribute('mathtext')).to.equal('c = \\sqrt{a^2 + b^2}')
    element.mathtext = 'x + 1'
    expect(element.getAttribute('mathtext')).to.equal('x + 1')
    await new Promise((resolve) => setTimeout(resolve, 400))
    const span = element.querySelector('span')
    expect(span.textContent).to.equal('x + 1')
    // getter reads the same attribute back
    expect(element.mathtext).to.equal('x + 1')
  })

  it('skips replacement while already processing a mathtext change', async () => {
    element.processing = true
    element.mathtext = 'w^2'
    await new Promise((resolve) => setTimeout(resolve, 400))
    // the re-entrancy guard returns early so the light DOM is untouched
    expect(element.querySelector('span')).to.not.exist
    expect(element.processing).to.be.true
    element.processing = false
    expect(element.processing).to.be.false
  })

  it('normalizes a self-referential mathtext capture', async () => {
    element.mathtext = '<lrn-math data-hax-active="active">junk</lrn-math>'
    await new Promise((resolve) => setTimeout(resolve, 50))
    // the guard rebuilds mathtext from the real textContent
    expect(element.getAttribute('mathtext')).to.not.contain('<lrn-math')
    await new Promise((resolve) => setTimeout(resolve, 400))
    expect(element.querySelector('span')).to.exist
  })

  it('falls back to updateMath when mathtext is cleared', async () => {
    element.setAttribute('mathtext', '')
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(element.getAttribute('mathtext')).to.equal('')
  })

  it('reflects the processing flag', async () => {
    expect(element.processing).to.be.false
    element.processing = true
    expect(element.hasAttribute('processing')).to.be.true
    expect(element.processing).to.be.true
    element.processing = false
    expect(element.hasAttribute('processing')).to.be.false
  })

  it('implements hax hooks', async () => {
    const hooks = element.haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
    element.haxeditModeChanged(true)
    expect(element._haxstate).to.be.true
    element.haxactiveElementChanged(element, true)
    expect(element._haxstate).to.be.true
    element.haxactiveElementChanged(element, false)
    // a falsey val does not overwrite the flag
    expect(element._haxstate).to.be.true
  })

  it('reports haxProperties for the editor', async () => {
    const props = LrnMath.haxProperties
    expect(props.canScale).to.be.false
    expect(props.canEditSource).to.be.true
    expect(props.gizmo.title).to.equal('Math')
    expect(props.settings.configure[0].property).to.equal('mathtext')
  })

  it('queues typesets through the shared controller', async () => {
    const handler = document.querySelector('lrn-math-controller')
    expect(handler instanceof LrnMathController).to.be.true
    const before = typesetCalls
    const cbResults = []
    handler.typeset('z^2', false, function (melem, styleNode) {
      cbResults.push(typeof melem === 'object' && styleNode !== undefined)
    })
    expect(typesetCalls).to.equal(before + 1)
    expect(cbResults.length).to.equal(1)
    expect(cbResults[0]).to.be.true
  })

  it('does not typeset empty math', async () => {
    const before = typesetCalls
    const emptyEl = await fixture(html` <lrn-math></lrn-math> `)
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(emptyEl.shadowRoot.querySelector('span')).to.not.exist
    expect(typesetCalls).to.equal(before)
  })

  it('honors a src attribute and lazy loading on the controller', async () => {
    const lazy = document.createElement('lrn-math-controller')
    lazy.setAttribute('src', 'mathjax-fake-src.js')
    lazy.setAttribute('lazy', 'lazy')
    origAppendChild(lazy)
    await new Promise((resolve) => setTimeout(resolve, 50))
    // lazy controller never loads a library and the src is only stored
    expect(lazy.hasAttribute('lazy')).to.be.true
    expect(lazy.getAttribute('src')).to.equal('mathjax-fake-src.js')
  })
})
