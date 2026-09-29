import { fixture, expect, html } from '@open-wc/testing'
import { CollectionItem } from '../lib/collection-item.js'

// direct lib import so istanbul sees lib/collection-item.js statements
describe('collection-item', () => {
  it('seeds defaults', async () => {
    const el = await fixture(html`<collection-item></collection-item>`)
    expect(el._haxstate).to.equal(false)
    expect(el.tags).to.equal(null)
    expect(el.saturate).to.equal(false)
    expect(el.url).to.equal(null)
    expect(el.image).to.equal(null)
    expect(el.alt).to.equal(null)
    expect(el.icon).to.equal(null)
    expect(el.line1).to.equal(null)
    expect(el.line2).to.equal(null)
    expect(el.line3).to.equal(null)
    expect(el.accentColor).to.equal(null)
  })

  it('renders a link card with image, icon, tags and text lines', async () => {
    const el = await fixture(
      html`<collection-item
        url="/item"
        image="hero.jpg"
        alt="Item alt"
        icon="icons:code"
        line1="Line One"
        line2="Line Two"
        line3="Line Three"
        tags="tag1, tag2"
        accent-color="blue"
      ></collection-item>`,
    )
    await el.updateComplete
    const link = el.shadowRoot.querySelector('a.link')
    expect(link === null).to.equal(false)
    expect(link.getAttribute('href')).to.equal('/item')
    expect(link.getAttribute('title')).to.equal('Item alt')
    // image renders as a background-image style on the image div
    const image = el.shadowRoot.querySelector('.image')
    expect(image.getAttribute('style').includes('hero.jpg')).to.equal(true)
    // icon renders inside the circle
    expect(
      el.shadowRoot.querySelector('.icon simple-icon').getAttribute('icon'),
    ).to.equal('icons:code')
    // tags render through simple-tags
    const tags = el.shadowRoot.querySelector('simple-tags')
    expect(tags === null).to.equal(false)
    expect(tags.getAttribute('tags')).to.equal('tag1, tag2')
    expect(tags.hasAttribute('auto-accent-color')).to.equal(true)
    // the three text lines render in order
    expect(el.shadowRoot.querySelector('.line-1').textContent).to.equal(
      'Line One',
    )
    expect(el.shadowRoot.querySelector('.line-2').textContent).to.equal(
      'Line Two',
    )
    expect(el.shadowRoot.querySelector('.line-3').textContent).to.equal(
      'Line Three',
    )
    // slotted content lands between the icon and the lines
    expect(el.shadowRoot.querySelector('.wrap slot') === null).to.equal(false)
  })

  it('renders placeholders without tags, icon or image', async () => {
    const el = await fixture(
      html`<collection-item url="/plain"></collection-item>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.no-tags') === null).to.equal(false)
    expect(el.shadowRoot.querySelector('.no-icon') === null).to.equal(false)
    expect(el.shadowRoot.querySelector('simple-tags')).to.equal(null)
    expect(el.shadowRoot.querySelector('.icon')).to.equal(null)
    expect(el.shadowRoot.querySelector('.image').getAttribute('style')).to
      .equal('')
  })

  it('reflects the saturate attribute', async () => {
    const el = await fixture(
      html`<collection-item url="/s" saturate></collection-item>`,
    )
    expect(el.hasAttribute('saturate')).to.equal(true)
    expect(el.saturate).to.equal(true)
  })

  it('blocks clicks while in hax edit state', async () => {
    const el = await fixture(html`<collection-item></collection-item>`)
    const counts = { prevent: 0, stop: 0, immediate: 0 }
    const fakeEvent = {
      preventDefault() {
        counts.prevent += 1
      },
      stopPropagation() {
        counts.stop += 1
      },
      stopImmediatePropagation() {
        counts.immediate += 1
      },
    }
    el._handleClick(fakeEvent)
    expect(counts.prevent).to.equal(0)
    el._haxstate = true
    el._handleClick(fakeEvent)
    expect(counts.prevent).to.equal(1)
    expect(counts.stop).to.equal(1)
    expect(counts.immediate).to.equal(1)
  })

  it('blocks clicks when the parent locks items', async () => {
    const el = await fixture(
      html`<div lock-items><collection-item></collection-item></div>`,
    )
    const item = el.querySelector('collection-item')
    let prevented = 0
    const fakeEvent = {
      preventDefault() {
        prevented += 1
      },
      stopPropagation() {},
      stopImmediatePropagation() {},
    }
    item._handleClick(fakeEvent)
    expect(prevented).to.equal(1)
  })

  it('exposes hax hooks and edit mode observers', async () => {
    const el = await fixture(html`<collection-item></collection-item>`)
    const hooks = el.haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
    // active element only flips hax state on, never off
    el.haxactiveElementChanged(el, true)
    expect(el._haxstate).to.equal(true)
    el.haxactiveElementChanged(el, false)
    expect(el._haxstate).to.equal(true)
    el.haxeditModeChanged(false)
    expect(el._haxstate).to.equal(false)
    el.haxeditModeChanged(true)
    expect(el._haxstate).to.equal(true)
  })

  it('references its hax properties file', () => {
    expect(
      CollectionItem.haxProperties.includes('collection-item.haxProperties.json'),
    ).to.equal(true)
  })

  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<collection-item
        url="/a11y"
        alt="Accessible item"
        line1="Title"
        line2="Description"
      ></collection-item>`,
    )
    await el.updateComplete
    await expect(el).shadowDom.to.be.accessible()
  })
})
