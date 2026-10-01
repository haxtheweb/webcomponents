import { fixture, expect, html } from '@open-wc/testing'
import { LitElement, css } from 'lit'
import { LaTex } from '../la-tex.js'
import { ESGlobalBridgeStore } from '@haxtheweb/es-global-bridge/es-global-bridge.js'

const tick = (ms = 20) => new Promise((resolve) => setTimeout(resolve, ms))

function stubBridgeImport() {
  const originalImport = ESGlobalBridgeStore.import
  ESGlobalBridgeStore.import = () => Promise.resolve()
  return () => {
    ESGlobalBridgeStore.import = originalImport
  }
}

function stubLatexGlobal(value) {
  const hadGlobal = 'LaTeX2HTML5' in globalThis
  const previous = globalThis.LaTeX2HTML5
  if (value === undefined) {
    delete globalThis.LaTeX2HTML5
  } else {
    globalThis.LaTeX2HTML5 = value
  }
  return () => {
    if (hadGlobal) {
      globalThis.LaTeX2HTML5 = previous
    } else {
      delete globalThis.LaTeX2HTML5
    }
  }
}

describe('la-tex behavior', () => {
  it('starts not hydrated with no captured text', async () => {
    const element = await fixture(html`<la-tex></la-tex>`)
    expect(element.hydrated).to.equal(false)
    expect(element.initialText).to.equal('')
  })

  it('reflects hydrated as an attribute', async () => {
    const element = await fixture(html`<la-tex>x</la-tex>`)
    element.hydrated = true
    await element.updateComplete
    expect(element.hasAttribute('hydrated')).to.be.true
    element.hydrated = false
    await element.updateComplete
    expect(element.hasAttribute('hydrated')).to.be.false
  })

  it('renders an empty wrapper div in the shadow root', async () => {
    const element = await fixture(html`<la-tex>text</la-tex>`)
    const wrapper = element.shadowRoot.querySelector('div.wrapper')
    expect(wrapper === null).to.be.false
    expect(wrapper.childElementCount).to.equal(0)
  })

  it('initializes LaTeX2HTML5 once the bridge import settles', async () => {
    let initCalls = 0
    const restoreImport = stubBridgeImport()
    const restoreGlobal = stubLatexGlobal({
      init() {
        initCalls += 1
      },
    })
    try {
      await fixture(html`<la-tex>y = x^2</la-tex>`)
      await tick()
      expect(initCalls).to.equal(1)
    } finally {
      restoreImport()
      restoreGlobal()
    }
  })

  it('does not initialize anything when the global is missing', async () => {
    const restoreImport = stubBridgeImport()
    const restoreGlobal = stubLatexGlobal(undefined)
    try {
      const element = await fixture(html`<la-tex>y = x^2</la-tex>`)
      await tick()
      expect('LaTeX2HTML5' in globalThis).to.be.false
      expect(element.hydrated).to.equal(false)
    } finally {
      restoreImport()
      restoreGlobal()
    }
  })

  it('declares its hax hooks', async () => {
    const element = await fixture(html`<la-tex>q</la-tex>`)
    expect(element.haxHooks()).to.deep.equal({
      preProcessNodeToContent: 'haxpreProcessNodeToContent',
      editModeChanged: 'haxeditModeChanged',
      activeElementChanged: 'haxactiveElementChanged',
    })
  })

  it('restores the original latex when converting to content', async () => {
    const element = await fixture(html`<la-tex></la-tex>`)
    element.initialText = 'a^2 + b^2'
    const node = globalThis.document.createElement('div')
    node.innerHTML = '<p>hydrated markup</p>'
    node.hydrated = true
    const result = await element.haxpreProcessNodeToContent(node)
    expect(result === node).to.be.true
    expect(node.innerHTML).to.equal('a^2 + b^2')
    expect(node.hydrated).to.equal(false)
  })

  it('restores the original latex when activated in HAX', async () => {
    const element = await fixture(html`<la-tex></la-tex>`)
    element.initialText = '\\frac{1}{2}'
    element.innerHTML = '<p>hydrated markup</p>'
    element.hydrated = true
    const sentinel = globalThis.document.createElement('span')
    const result = element.haxactiveElementChanged(sentinel, true)
    expect(result === sentinel).to.be.true
    expect(element.innerHTML).to.equal('\\frac{1}{2}')
    expect(element.hydrated).to.equal(false)
  })

  it('rehydrates after edit mode toggles', async () => {
    let initCalls = 0
    const restoreImport = stubBridgeImport()
    const restoreGlobal = stubLatexGlobal({
      init() {
        initCalls += 1
      },
    })
    try {
      const element = await fixture(html`<la-tex></la-tex>`)
      element.initialText = 'e^{i\\pi}'
      // let the constructor's own deferred hydration settle first
      await tick()
      initCalls = 0
      element.innerHTML = '<p>hydrated markup</p>'
      element.hydrated = true
      element.haxeditModeChanged(false)
      expect(element.innerHTML).to.equal('e^{i\\pi}')
      expect(element.hydrated).to.equal(false)
      await tick()
      expect(initCalls).to.equal(1)
    } finally {
      restoreImport()
      restoreGlobal()
    }
  })

  it('points haxProperties at its schema file', () => {
    expect(
      LaTex.haxProperties.endsWith('lib/la-tex.haxProperties.json'),
    ).to.be.true
  })

  it('supports inheriting styles from other classes', () => {
    const inherited = [css`:host { display: inline }`]
    const descriptor = Object.getOwnPropertyDescriptor(LitElement, 'styles')
    LitElement.styles = inherited
    try {
      const styles = LaTex.styles
      expect(Array.isArray(styles)).to.be.true
      expect(styles.length).to.equal(2)
      expect(styles[0] === inherited[0]).to.be.true
    } finally {
      if (descriptor) {
        Object.defineProperty(LitElement, 'styles', descriptor)
      } else {
        delete LitElement.styles
      }
    }
  })
})
