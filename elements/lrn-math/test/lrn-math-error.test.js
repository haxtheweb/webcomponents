import { fixture, expect, html } from '@open-wc/testing'

import { LrnMath, LrnMathController } from '../lrn-math.js'

// Never hit the network: when the module tries to append the MathJax CDN
// script, simulate an immediate load failure by invoking its onerror handler.
const origAppendChild = document.head.appendChild.bind(document.head)
const warnings = []
const origWarn = console.warn
console.warn = function (msg) {
  warnings.push(String(msg))
}
document.head.appendChild = function (node) {
  if (
    node &&
    node.tagName === 'SCRIPT' &&
    node.getAttribute &&
    String(node.getAttribute('src')).indexOf('mathjax') !== -1
  ) {
    if (typeof node.onerror === 'function') {
      node.onerror()
    }
    return node
  }
  return origAppendChild(node)
}

after(() => {
  console.warn = origWarn
})

describe('lrn-math error state (library fails to load)', () => {
  let element
  beforeEach(async () => {
    element = await fixture(
      html` <lrn-math>a + b</lrn-math> `,
    )
    await new Promise((resolve) => setTimeout(resolve, 100))
  })

  it('warns when the MathJax library fails to load', async () => {
    expect(
      warnings.some((w) => w.indexOf('Error loading MathJax library') !== -1),
    ).to.be.true
  })

  it('never typesets into the shadow DOM while in error state', async () => {
    expect(element.shadowRoot.querySelector('span')).to.not.exist
    expect(element.shadowRoot.textContent).to.equal('')
  })

  it('drops queued typesets when the library errors', async () => {
    const handler = document.querySelector('lrn-math-controller')
    expect(handler).to.exist
    let called = false
    handler.typeset('q^2', false, function () {
      called = true
    })
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(called).to.be.false
  })

  it('still reflects mathtext and processing while in error state', async () => {
    expect(element.getAttribute('mathtext')).to.equal('a + b')
    element.processing = true
    expect(element.hasAttribute('processing')).to.be.true
    element.processing = false
    expect(element.hasAttribute('processing')).to.be.false
    element.mathtext = 'z + 9'
    await new Promise((resolve) => setTimeout(resolve, 400))
    expect(element.getAttribute('mathtext')).to.equal('z + 9')
    expect(element.querySelector('span')).to.exist
    expect(element.shadowRoot.querySelector('span')).to.not.exist
  })

  it('supports a lazy controller that defers library loading', async () => {
    const lazy = document.createElement('lrn-math-controller')
    lazy.setAttribute('src', 'mathjax-local-fake.js')
    lazy.setAttribute('lazy', 'lazy')
    origAppendChild(lazy)
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(lazy instanceof LrnMathController).to.be.true
    expect(lazy.getAttribute('src')).to.equal('mathjax-local-fake.js')
    // no mathjax script was ever appended to the document
    const scripts = document.querySelectorAll('script')
    let appendedCdnScript = false
    scripts.forEach((s) => {
      if (String(s.getAttribute('src')).indexOf('cdnjs.cloudflare.com') !== -1) {
        appendedCdnScript = true
      }
    })
    expect(appendedCdnScript).to.be.false
  })

  it('still reports tag and hax wiring', async () => {
    expect(LrnMath.tag).to.equal('lrn-math')
    const hooks = element.haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    element.haxeditModeChanged(false)
    expect(element._haxstate).to.be.false
  })
})
