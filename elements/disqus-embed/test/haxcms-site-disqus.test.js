import { fixture, expect, html, aTimeout } from '@open-wc/testing'
import { HAXCMSSiteDisqus } from '../lib/haxcms-site-disqus.js'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'

describe('haxcms-site-disqus', () => {
  it('is defined with its tag name', () => {
    expect(HAXCMSSiteDisqus.tag).to.equal('haxcms-site-disqus')
    expect(globalThis.customElements.get('haxcms-site-disqus')).to.exist
  })

  it('exposes haxProperties from its lib schema file', () => {
    expect(HAXCMSSiteDisqus.haxProperties).to.be.a('string')
    expect(HAXCMSSiteDisqus.haxProperties).to.include(
      'haxcms-site-disqus.haxProperties.json',
    )
  })

  it('inherits the disqus embed presentation', async () => {
    const el = await fixture(html`<haxcms-site-disqus></haxcms-site-disqus>`)
    await aTimeout(150)
    expect(el.loadingText).to.equal('Loading comments...')
    expect(el.lang).to.equal('en')
    el.remove()
  })

  it('maps site store state onto the disqus embed', async () => {
    const el = await fixture(html`<haxcms-site-disqus></haxcms-site-disqus>`)
    await aTimeout(150)
    store.location = { route: { path: '/x/thing' } }
    await aTimeout(150)
    expect(el.pageURL).to.equal('/x/thing')
    // items: [] keeps the store's own autoruns happy (findItem reads items.find)
    store.manifest = { metadata: { site: { lang: 'fr' } }, items: [] }
    await aTimeout(150)
    expect(el.lang).to.equal('fr')
    store.activeId = 'item-123'
    await aTimeout(150)
    expect(el.pageIdentifier).to.equal('item-123')
    el.remove()
  })
})
