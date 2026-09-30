import { fixture, expect, html } from '@open-wc/testing'

import '../lib/ebook-button.js'
import { EbookButton } from '../lib/ebook-button.js'

describe('ebook-button', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('ebook-button')).to.exist
  })

  it('has the expected static tag', () => {
    expect(EbookButton.tag).to.equal('ebook-button')
  })

  it('has default property values', async () => {
    const el = await fixture(html`<ebook-button></ebook-button>`)
    expect(el.link).to.equal('')
    expect(el.title).to.equal('')
    expect(el.icon).to.equal('icons:book')
  })

  it('renders an icon, title, and new window link', async () => {
    const el = await fixture(html`
      <ebook-button
        title="Access Ebook"
        link="https://example.com/ebook"
      ></ebook-button>
    `)
    await el.updateComplete
    const link = el.shadowRoot.querySelector('a')
    expect(link.getAttribute('href')).to.equal('https://example.com/ebook')
    expect(link.getAttribute('target')).to.equal('_blank')
    expect(link.getAttribute('rel')).to.equal('noopener noreferrer')
    // the anchor is the only interactive control (no button nested in the a)
    expect(el.shadowRoot.querySelector('button') === null).to.be.true
    expect(link.textContent).to.include('Access Ebook')
    expect(
      el.shadowRoot.querySelector('simple-icon-lite').getAttribute('icon'),
    ).to.equal('icons:book')
    await expect(el).shadowDom.to.be.accessible()
  })

  it('updates the icon on property change', async () => {
    const el = await fixture(html`<ebook-button title="Read"></ebook-button>`)
    el.icon = 'icons:auto-stories'
    await el.updateComplete
    expect(
      el.shadowRoot.querySelector('simple-icon-lite').getAttribute('icon'),
    ).to.equal('icons:auto-stories')
  })

  it('exposes haxProperties with configure settings and a demo schema', () => {
    const props = EbookButton.haxProperties
    expect(props.canScale).to.be.false
    expect(props.gizmo.title).to.equal('Ebook button')
    expect(props.gizmo.handles[0].type).to.equal('link')
    expect(props.settings.configure.length).to.equal(3)
    expect(props.demoSchema[0].properties.icon).to.equal('icons:book')
  })

  it('wires hax hooks and blocks clicks while active in hax', () => {
    const el = globalThis.document.createElement('ebook-button')
    expect(el.haxHooks()).to.deep.equal({
      editModeChanged: 'haxeditModeChanged',
      activeElementChanged: 'haxactiveElementChanged',
    })
    let prevented = 0
    const makeEvent = () => ({
      preventDefault: () => {
        prevented += 1
      },
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
    })
    // clicks pass through until hax marks the element active
    el._clickLink(makeEvent())
    expect(prevented).to.equal(0)
    el.haxactiveElementChanged(el, true)
    el._clickLink(makeEvent())
    expect(prevented).to.equal(1)
    // leaving edit mode releases the click block
    el.haxeditModeChanged(false)
    el._clickLink(makeEvent())
    expect(prevented).to.equal(1)
    // edit mode alone also blocks clicks
    el.haxeditModeChanged(true)
    el._clickLink(makeEvent())
    expect(prevented).to.equal(2)
  })
})
