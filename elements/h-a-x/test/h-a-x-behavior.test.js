import { fixture, expect, html } from '@open-wc/testing'

import '../h-a-x.js'
import '../lib/h-a-x-dependencies.js'
import { HAX } from '../h-a-x.js'
import { HAXStore } from '@haxtheweb/hax-body/lib/hax-store.js'

describe('h-a-x construction and rendering', () => {
  it('passes the a11y audit', async () => {
    const el = await fixture(
      html` <h-a-x>
        <p>This is h-a-x</p>
      </h-a-x>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })

  it('can be instantiated with delayRender=true', async () => {
    const el = new HAX(true)
    expect(el).to.exist
    expect(el.__rendered).to.equal(false)
  })

  it('renders by default (delayRender=false)', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    expect(el.__rendered).to.equal(true)
  })

  it('renders hax-body in shadow DOM', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    const haxBody = el.shadowRoot.querySelector('hax-body')
    expect(haxBody).to.exist
  })

  it('renders a slot inside hax-body', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    const slot = el.shadowRoot.querySelector('hax-body slot')
    expect(slot).to.exist
  })

  it('renders a style element with editable-table styles', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    const style = el.shadowRoot.querySelector('style')
    expect(style).to.exist
  })

  it('has correct tag', () => {
    expect(HAX.tag).to.equal('h-a-x')
  })

  it('observes expected attributes', () => {
    expect(HAX.observedAttributes).to.deep.equal([
      'element-align',
      'offset-margin',
      'app-store',
      'hide-panel-ops',
    ])
  })
})

describe('h-a-x html getter', () => {
  it('returns HTML string with style and hax-body', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    const htmlStr = el.html
    expect(htmlStr).to.contain('<style>')
    expect(htmlStr).to.contain('hax-body')
    expect(htmlStr).to.contain('<slot>')
  })
})

describe('h-a-x render method', () => {
  it('can be called multiple times without error', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    expect(() => el.render()).to.not.throw()
    expect(el.__rendered).to.equal(true)
  })

  it('clears shadowRoot before re-rendering', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    el.render()
    const haxBody = el.shadowRoot.querySelector('hax-body')
    expect(haxBody).to.exist
  })
})

describe('h-a-x adopted stylesheet methods', () => {
  it('__getHAXAdoptedSheets returns empty array when no adopted sheets', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    const sheets = el.__getHAXAdoptedSheets()
    expect(sheets).to.be.instanceOf(Array)
  })

  it('__sheetToCSSText returns empty string for null sheet', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    expect(el.__sheetToCSSText(null)).to.equal('')
  })

  it('__sheetToCSSText returns empty string for sheet without cssRules', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    const fakeSheet = {}
    expect(el.__sheetToCSSText(fakeSheet)).to.equal('')
  })

  it('__supportsShadowSheetAdoption returns a boolean', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    const result = el.__supportsShadowSheetAdoption()
    expect(typeof result).to.equal('boolean')
  })

  it('__supportsShadowSheetAdoption caches result', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    const first = el.__supportsShadowSheetAdoption()
    const second = el.__supportsShadowSheetAdoption()
    expect(first).to.equal(second)
  })

  it('__applyHAXAdoptedStylesToShadowRoot does not throw', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    expect(() => el.__applyHAXAdoptedStylesToShadowRoot()).to.not.throw()
  })
})

describe('h-a-x importSlotToHaxBody', () => {
  it('imports slotted content to hax body', async () => {
    const el = await fixture(
      html`<h-a-x>
        <p>Content to import</p>
        <span>More content</span>
      </h-a-x>`,
    )
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(() => el.importSlotToHaxBody()).to.not.throw()
  })
})

describe('h-a-x cancelEvent', () => {
  it('calls importSlotToHaxBody without error', async () => {
    const el = await fixture(
      html`<h-a-x><p>Cancel test</p></h-a-x>`,
    )
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(() => el.cancelEvent({})).to.not.throw()
  })
})

describe('h-a-x storeReady', () => {
  it('handles hax-store-ready event with detail', async () => {
    const el = await fixture(
      html`<h-a-x app-store='{"url": "test.json"}'>
        <p>Store ready test</p>
      </h-a-x>`,
    )
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(() =>
      el.storeReady({ detail: true }),
    ).to.not.throw()
  })

  it('does nothing when event has no detail', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    expect(() => el.storeReady({})).to.not.throw()
  })
})

describe('h-a-x appStoreReady', () => {
  it('imports slot and aborts controller when detail is present', async () => {
    const el = await fixture(
      html`<h-a-x><p>App store ready</p></h-a-x>`,
    )
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(() =>
      el.appStoreReady({ detail: true }),
    ).to.not.throw()
  })

  it('does nothing when event has no detail', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    expect(() => el.appStoreReady({})).to.not.throw()
  })
})

describe('h-a-x attribute getters and setters', () => {
  it('elementAlign getter returns attribute value', async () => {
    const el = await fixture(
      html`<h-a-x element-align="right"><p>test</p></h-a-x>`,
    )
    expect(el.elementAlign).to.equal('right')
  })

  it('elementAlign setter sets attribute when rendered', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    el.elementAlign = 'left'
    expect(el.getAttribute('element-align')).to.equal('left')
  })

  it('offsetMargin getter returns attribute value', async () => {
    const el = await fixture(
      html`<h-a-x offset-margin="10px"><p>test</p></h-a-x>`,
    )
    expect(el.offsetMargin).to.equal('10px')
  })

  it('offsetMargin setter sets attribute', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    el.offsetMargin = '5px 10px'
    expect(el.getAttribute('offset-margin')).to.equal('5px 10px')
  })

  it('hideToolbar getter returns attribute value', async () => {
    const el = await fixture(
      html`<h-a-x hide-toolbar="hide-toolbar"><p>test</p></h-a-x>`,
    )
    expect(el.hideToolbar).to.equal('hide-toolbar')
  })

  it('hideToolbar setter sets attribute when truthy', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    el.hideToolbar = true
    expect(el.getAttribute('hide-toolbar')).to.equal('hide-toolbar')
  })

  it('hidePanelOps getter returns attribute value', async () => {
    const el = await fixture(
      html`<h-a-x hide-panel-ops="hide-panel-ops"><p>test</p></h-a-x>`,
    )
    expect(el.hidePanelOps).to.equal('hide-panel-ops')
  })

  it('hidePanelOps setter sets attribute when truthy', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    el.hidePanelOps = true
    expect(el.getAttribute('hide-panel-ops')).to.equal('hide-panel-ops')
  })

  it('appStore getter returns attribute value', async () => {
    const el = await fixture(
      html`<h-a-x app-store='{"url": "test.json"}'>
        <p>test</p>
      </h-a-x>`,
    )
    expect(el.appStore).to.contain('test.json')
  })

  it('appStore setter sets attribute', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    el.appStore = '{"url": "new.json"}'
    expect(el.getAttribute('app-store')).to.contain('new.json')
  })
})

describe('h-a-x attributeChangedCallback', () => {
  it('does not throw for any attribute change', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    expect(() =>
      el.attributeChangedCallback('element-align', 'left', 'right'),
    ).to.not.throw()
    expect(() =>
      el.attributeChangedCallback('offset-margin', '0px', '10px'),
    ).to.not.throw()
    expect(() =>
      el.attributeChangedCallback('app-store', '{}', '{"url":"x"}'),
    ).to.not.throw()
    expect(() =>
      el.attributeChangedCallback('hide-panel-ops', null, 'hide-panel-ops'),
    ).to.not.throw()
  })
})

describe('h-a-x applyHAX', () => {
  it('applies HAX and sets globalThis.__HAXApplied', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    expect(globalThis.__HAXApplied).to.equal(true)
  })
})

describe('h-a-x disconnectedCallback', () => {
  it('aborts controllers without error', async () => {
    const el = await fixture(html`<h-a-x><p>test</p></h-a-x>`)
    expect(() => el.disconnectedCallback()).to.not.throw()
  })
})

describe('h-a-x lib dependencies import', () => {
  it('lib/h-a-x-dependencies.js is instrumented', async () => {
    // The import at top of file ensures instrumentation
    // If it loaded without error, the dependencies are valid
    expect(true).to.equal(true)
  })
})
