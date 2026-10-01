import { fixture, expect, html, elementUpdated } from '@open-wc/testing'
import { SimpleEmoji } from '../simple-emoji.js'

describe('simple-emoji behavior', () => {
  it('exposes the expected tag', () => {
    expect(SimpleEmoji.tag).to.equal('simple-emoji')
  })
  it('renders a div wrapper with a default slot', async () => {
    const el = await fixture(html`<simple-emoji>🎉 party</simple-emoji>`)
    const div = el.shadowRoot.querySelector('div')
    expect(div).to.exist
    expect(div.querySelector('slot')).to.exist
    expect(el.shadowRoot.querySelectorAll('slot').length).to.equal(1)
    expect(el.textContent).to.include('🎉 party')
  })
  it('exposes composable static styles', () => {
    const styles = SimpleEmoji.styles
    expect(styles.length).to.equal(2)
    expect(styles[1].cssText).to.include('display: block')
  })
  it('serves as a composition base for subclasses with properties', async () => {
    // simple-emoji is designed as a base class; a subclass with a declared
    // property exercises the updated() changedProperties loop inherited
    // from simple-emoji
    class TestEmoji extends SimpleEmoji {
      static get properties() {
        return { myProp: { type: String } }
      }
      constructor() {
        super()
        this.myProp = 'unset'
      }
    }
    if (!globalThis.customElements.get('test-simple-emoji-base')) {
      globalThis.customElements.define('test-simple-emoji-base', TestEmoji)
    }
    const el = await fixture(
      html`<test-simple-emoji-base my-prop="set">🎉 content</test-simple-emoji-base>`,
    )
    // Lit: values assigned in the constructor take precedence over the
    // initial attribute value, so myProp stays 'unset' despite my-prop="set"
    expect(el.myProp).to.equal('unset')
    expect(el.shadowRoot.querySelector('div')).to.exist
    expect(el.shadowRoot.querySelector('div').querySelector('slot')).to.exist
    expect(el.textContent).to.equal('🎉 content')
    el.myProp = 'changed'
    await elementUpdated(el)
    expect(el.myProp).to.equal('changed')
    expect(el.shadowRoot.querySelector('div')).to.exist
  })
  it('keeps rendering across repeated updates', async () => {
    const el = await fixture(html`<simple-emoji>first</simple-emoji>`)
    el.requestUpdate()
    await elementUpdated(el)
    el.textContent = 'second'
    el.requestUpdate()
    await elementUpdated(el)
    expect(el.shadowRoot.querySelector('div')).to.exist
    expect(el.textContent).to.equal('second')
  })
  it('meets a11y standards', async () => {
    const el = await fixture(html`<simple-emoji>🚀 emoji content</simple-emoji>`)
    await expect(el).to.be.accessible()
  })
})
