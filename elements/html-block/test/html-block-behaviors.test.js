import { fixture, expect, html } from '@open-wc/testing'

import '../html-block.js'
import { HtmlBlock } from '../html-block.js'

const settle = (ms = 100) => new Promise((r) => setTimeout(r, ms))

// Behavioral coverage for html-block: MutationObserver-driven
// sanitization, allowscript toggling, haxProperties schema, and the
// html getter template.
describe('html-block behaviors', () => {
  it('registers the custom element and sets instance tag', async () => {
    expect(globalThis.customElements.get('html-block')).to.exist
    expect(HtmlBlock.tag).to.equal('html-block')
    const el = await fixture(html`<html-block></html-block>`)
    expect(el.tag).to.equal('html-block')
  })

  it('observes only the allowscript attribute', () => {
    expect(HtmlBlock.observedAttributes).to.deep.equal(['allowscript'])
  })

  it('html getter returns a slot template', async () => {
    const el = await fixture(html`<html-block></html-block>`)
    expect(el.html).to.contain('<slot></slot>')
    expect(el.html).to.contain('<style>')
  })

  it('haxProperties describes the gizmo and code-editor setting', () => {
    const props = HtmlBlock.haxProperties
    expect(props.canScale).to.equal(true)
    expect(props.canEditSource).to.equal(true)
    expect(props.gizmo.title).to.equal('Html block')
    expect(props.gizmo.icon).to.equal('hax:html-code')
    expect(props.gizmo.handles).to.deep.equal([{ type: 'html', content: 'slot' }])
    expect(props.settings.configure[0].inputMethod).to.equal('code-editor')
    expect(props.settings.advanced).to.deep.equal([])
  })

  it('defaults to block display on connect', async () => {
    const el = await fixture(html`<html-block></html-block>`)
    expect(el.style.display).to.equal('block')
    expect(el.__ignoreChange).to.equal(false)
    expect(el.__observer).to.be.instanceOf(MutationObserver)
  })

  it('BUG: content present at connect time is never sanitized', async () => {
    const el = await fixture(
      html`<html-block>
        <script>
          alert(1)
        </script>
        <p onclick="evil()">hi</p>
      </html-block>`,
    )
    await settle()
    // BUG (html-block.js:83-97): connectedCallback only arms a
    // MutationObserver; sanitize runs exclusively from later mutations.
    // Pre-existing light DOM is never passed through sanitizeHTMLString,
    // so a live onclick handler survives connection (the script tag is
    // inert via innerHTML semantics, but event-handler attributes are
    // an active vector once clicked). __rawHTML is never even captured.
    expect(el.querySelector('script')).to.exist
    expect(el.querySelector('p').getAttribute('onclick')).to.equal('evil()')
    expect(el.__rawHTML).to.equal(undefined)
  })

  it('sanitizes content written after connection', async () => {
    const el = await fixture(html`<html-block></html-block>`)
    await settle()
    el.innerHTML = '<script>alert(2)</script><p onclick="evil()">yo</p>'
    await settle()
    // script tags are escaped into inert text by the sanitizer
    expect(el.querySelector('script')).to.equal(null)
    expect(el.innerHTML).to.contain('&lt;script&gt;')
    // event handler attributes are stripped
    expect(el.querySelector('p').getAttribute('onclick')).to.equal(null)
    // the raw value is held for allowscript restore
    expect(el.__rawHTML).to.equal(
      '<script>alert(2)</script><p onclick="evil()">yo</p>',
    )
  })

  it('sanitizes content appended as nodes after connection', async () => {
    const el = await fixture(html`<html-block></html-block>`)
    await settle()
    const p = globalThis.document.createElement('p')
    p.setAttribute('onclick', 'evil()')
    p.textContent = 'added'
    el.appendChild(p)
    await settle()
    expect(el.querySelector('p').getAttribute('onclick')).to.equal(null)
    expect(el.querySelector('p').textContent).to.equal('added')
  })

  it('BUG: allowscript at parse time never survives connect', async () => {
    const el = await fixture(
      html`<html-block allowscript>
        <script>
          alert(3)
        </script>
      </html-block>`,
    )
    await settle()
    // BUG (html-block.js:83-86): connectedCallback unconditionally sets
    // this.allowscript = false, removing the author-supplied attribute,
    // so parse-time allowscript content is sanitized no matter what.
    expect(el.getAttribute('allowscript')).to.equal(null)
    expect(el.querySelector('script')).to.equal(null)
    expect(el.innerHTML).to.contain('&lt;script&gt;')
    // the raw value was captured by the sanitize pass; NOTE: depending on
    // upgrade/attribute reaction ordering the captured pen can already
    // hold the escaped form (double-sanitize), so only check it is set
    expect(typeof el.__rawHTML).to.equal('string')
    expect(el.__rawHTML).to.contain('script')
  })

  it('restores raw HTML when allowscript is toggled on and off', async () => {
    const el = await fixture(html`<html-block></html-block>`)
    await settle()
    el.innerHTML = '<script>alert(4)</script>'
    await settle()
    expect(el.innerHTML).to.contain('&lt;script&gt;')
    // toggle on: raw HTML from the holding pen is restored
    el.setAttribute('allowscript', 'allowscript')
    await settle()
    expect(el.querySelector('script')).to.exist
    // toggle off: sanitization runs again
    el.removeAttribute('allowscript')
    await settle()
    expect(el.querySelector('script')).to.equal(null)
    expect(el.innerHTML).to.contain('&lt;script&gt;')
  })

  it('skips sanitization for mutations while allowscript is on', async () => {
    const el = await fixture(html`<html-block></html-block>`)
    await settle()
    el.setAttribute('allowscript', 'allowscript')
    await settle()
    el.innerHTML = '<script>alert(5)</script>'
    await settle()
    expect(el.querySelector('script')).to.exist
    expect(el.__rawHTML).to.equal(undefined)
  })

  it('allowscript getter and setter manage the attribute', async () => {
    const el = await fixture(html`<html-block></html-block>`)
    expect(el.allowscript).to.equal(null)
    el.allowscript = true
    expect(el.getAttribute('allowscript')).to.equal('allowscript')
    expect(el.allowscript).to.equal('allowscript')
    el.allowscript = false
    expect(el.getAttribute('allowscript')).to.equal(null)
    expect(el.allowscript).to.equal(null)
  })

  it('render() sanitizes directly when allowscript is unset', async () => {
    const el = await fixture(html`<html-block></html-block>`)
    await settle()
    el.__ignoreChange = false
    el.innerHTML = '<p onclick="evil()">direct</p>'
    await settle()
    // calling render() directly with allowscript unset sanitizes
    el.render()
    expect(el.querySelector('p').getAttribute('onclick')).to.equal(null)
  })

  it('render() resets __ignoreChange without sanitizing when set', async () => {
    const el = await fixture(html`<html-block></html-block>`)
    await settle()
    el.innerHTML = '<p onclick="evil()">ignored</p>'
    await settle()
    // sanitize once, then arm the ignore flag like the internal loop does
    el.__ignoreChange = true
    el.render()
    expect(el.__ignoreChange).to.equal(false)
    // the write behind the ignore flag was not re-sanitized... it was,
    // because __sanitizeHTML already ran; arm again and verify the
    // flag-reset path alone keeps content untouched when allowscript on
    el.setAttribute('allowscript', 'allowscript')
    await settle()
    el.innerHTML = '<p onclick="evil()">ignored2</p>'
    await settle()
    el.__ignoreChange = true
    el.render()
    expect(el.__ignoreChange).to.equal(false)
    expect(el.querySelector('p').getAttribute('onclick')).to.equal('evil()')
  })

  it('passes the light-DOM a11y audit with sanitized content', async () => {
    const el = await fixture(html`<html-block></html-block>`)
    await settle()
    el.innerHTML = '<p>plain text is fine</p>'
    await settle()
    // html-block has no shadow DOM; audit the light DOM it renders
    await expect(el).to.be.accessible()
  })
})
