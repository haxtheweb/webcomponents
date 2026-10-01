import { expect, waitUntil } from '@open-wc/testing'

// NOTE: this file deliberately does NOT statically import md-block.js.
// The constructor's light-DOM fallback (reading innerHTML at construction
// time, md-block.js:137-140) only fires for elements that were already in
// the document BEFORE the definition arrives and then get upgraded — the
// static-HTML + async-CDN-loading production scenario. The definition is
// therefore imported dynamically after the element is already in the DOM.
describe('md-block light-DOM upgrade', () => {
  it('seeds markdown from light-DOM children when upgraded', async () => {
    const holder = globalThis.document.createElement('div')
    holder.innerHTML = '<md-block>**upgraded**</md-block>'
    globalThis.document.body.appendChild(holder)
    // definition arrives while the element is already in the document
    await import('../md-block.js')
    const el = holder.querySelector('md-block')
    await waitUntil(
      () => el._parsedMarkdown && el._parsedMarkdown.length > 0,
      'upgraded markdown was never parsed',
      3000,
    )
    expect(el.constructor.tag).to.equal('md-block')
    // the constructor consumed the light-DOM children into markdown
    expect(el.markdown).to.equal('**upgraded**')
    // and the parsed markdown rendered
    expect(el._parsedMarkdown).to.contain('<strong>upgraded</strong>')
    // innerHTML was cleared by the constructor (innerHTML = null coerces
    // to an empty string through the DOMString innerHTML attribute)
    expect(el.innerHTML.trim()).to.equal('')
    globalThis.document.body.removeChild(holder)
  })
})
