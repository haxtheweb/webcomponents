import { fixture, expect, html } from '@open-wc/testing'
import { CollectionRow } from '../lib/collection-row.js'

// direct lib import so istanbul sees lib/collection-row.js statements
describe('collection-row', () => {
  it('seeds defaults', async () => {
    const el = await fixture(html`<collection-row></collection-row>`)
    expect(el._haxstate).to.equal(false)
    expect(el.tags).to.equal(null)
    expect(el.saturate).to.equal(false)
    expect(el.url).to.equal(null)
    expect(el.image).to.equal(null)
    expect(el.alt).to.equal(null)
    expect(el.icon).to.equal(null)
    expect(el.line1).to.equal(null)
    expect(el.line2).to.equal(null)
    expect(el.accentColor).to.equal(null)
  })

  it('renders an image, link, text, footer icon and tags', async () => {
    const el = await fixture(
      html`<collection-row
        url="/row"
        image="row.jpg"
        alt="Row alt"
        icon="icons:bookmark"
        line1="Row Title"
        line2="Row description"
        tags="alpha, beta"
        accent-color="green"
      ></collection-row>`,
    )
    await el.updateComplete
    const img = el.shadowRoot.querySelector('img.image')
    expect(img === null).to.equal(false)
    expect(img.getAttribute('src')).to.equal('row.jpg')
    expect(img.getAttribute('alt')).to.equal('Row alt')
    const link = el.shadowRoot.querySelector('.text a')
    expect(link.getAttribute('href')).to.equal('/row')
    expect(link.textContent).to.equal('Row Title')
    expect(el.shadowRoot.querySelector('.text').textContent.includes('Row description')).to
      .equal(true)
    expect(
      el.shadowRoot.querySelector('.footer simple-icon').getAttribute('icon'),
    ).to.equal('icons:bookmark')
    const tags = el.shadowRoot.querySelector('.footer simple-tags')
    expect(tags === null).to.equal(false)
    expect(tags.getAttribute('tags')).to.equal('alpha, beta')
    expect(tags.hasAttribute('auto-accent-color')).to.equal(true)
    expect(el.shadowRoot.querySelector('.wrap slot') === null).to.equal(false)
  })

  it('renders without image, icon or tags', async () => {
    const el = await fixture(
      html`<collection-row url="/plain" line1="Only a title"></collection-row>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('img.image')).to.equal(null)
    expect(el.shadowRoot.querySelector('.footer simple-icon')).to.equal(null)
    expect(el.shadowRoot.querySelector('.footer simple-tags')).to.equal(null)
    expect(el.shadowRoot.querySelector('.image-wrap') === null).to.equal(false)
  })

  it('reflects the saturate attribute', async () => {
    const el = await fixture(
      html`<collection-row url="/s" saturate></collection-row>`,
    )
    expect(el.hasAttribute('saturate')).to.equal(true)
    expect(el.saturate).to.equal(true)
  })

  it('blocks clicks while in hax edit state', async () => {
    const el = await fixture(html`<collection-row></collection-row>`)
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

  it('exposes hax hooks and edit mode observers', async () => {
    const el = await fixture(html`<collection-row></collection-row>`)
    const hooks = el.haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
    el.haxactiveElementChanged(el, true)
    expect(el._haxstate).to.equal(true)
    el.haxactiveElementChanged(el, false)
    expect(el._haxstate).to.equal(true)
    el.haxeditModeChanged(false)
    expect(el._haxstate).to.equal(false)
    el.haxeditModeChanged(true)
    expect(el._haxstate).to.equal(true)
  })

  // BUG (packaging): lib/collection-row.js:36-38 references
  // ./collection-row.haxProperties.json but that file does not exist in
  // lib/ (only collection-item.haxProperties.json and
  // collection-list.haxProperties.json ship), so HAX schema loading for
  // this element 404s. Noted for the fix swarm.
  it('references its hax properties file', () => {
    expect(
      CollectionRow.haxProperties.includes('collection-row.haxProperties.json'),
    ).to.equal(true)
  })

  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<collection-row
        url="/a11y"
        image="row.jpg"
        alt="Row image"
        line1="Row title"
        line2="Row description"
      ></collection-row>`,
    )
    await el.updateComplete
    await expect(el).shadowDom.to.be.accessible()
  })
})
