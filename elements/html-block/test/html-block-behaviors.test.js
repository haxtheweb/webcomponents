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

  it('sanitizes content present at connect time', async () => {
    const el = await fixture(
      html`<html-block>
        <script>
          alert(1)
        </script>
        <p onclick="evil()">hi</p>
      </html-block>`,
    )
    await settle()
    // issues#3102 #3 (security) FIXED: connectedCallback now sanitizes the
    // existing light DOM and captures __rawHTML for it, so pre-existing
    // event-handler attributes and script nodes never survive connection.
    expect(el.querySelector('script')).to.equal(null)
    expect(el.innerHTML).to.contain('&lt;script&gt;')
    expect(el.querySelector('p').getAttribute('onclick')).to.equal(null)
    expect(el.querySelector('p').textContent).to.equal('hi')
    expect(typeof el.__rawHTML).to.equal('string')
    expect(el.__rawHTML).to.contain('onclick="evil()"')
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

  it('parse-time allowscript survives connect and skips sanitization', async () => {
    const el = await fixture(
      html`<html-block allowscript>
        <script>
          alert(3)
        </script>
      </html-block>`,
    )
    await settle()
    // issues#3102 #26 FIXED: connectedCallback reads the allowscript
    // attribute first and only force-sanitizes when it is absent; a bare
    // (empty-string) attribute is the author's intent to allow script and
    // now survives connect with the content untouched.
    expect(el.hasAttribute('allowscript')).to.equal(true)
    expect(el.allowscript).to.equal('')
    expect(el.querySelector('script')).to.exist
    expect(el.__rawHTML).to.equal(undefined)
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

  it('keeps the original raw pen across repeated sanitize passes', async () => {
    const el = await fixture(html`<html-block></html-block>`)
    await settle()
    el.innerHTML = '<p onclick="evil()">keep</p>'
    await settle()
    expect(el.__rawHTML).to.equal('<p onclick="evil()">keep</p>')
    // issues#3102 #27 FIXED: extra sanitize passes (upgrade /
    // attribute-reaction ordering) skip the recapture when innerHTML is
    // already the escaped form of the stored pen, so the pen can never end
    // up holding escaped content.
    el.render()
    el.render()
    expect(el.__rawHTML).to.equal('<p onclick="evil()">keep</p>')
    // toggling allowscript on restores the author's original HTML, not
    // escaped text
    el.setAttribute('allowscript', 'allowscript')
    await settle()
    expect(el.querySelector('p').getAttribute('onclick')).to.equal('evil()')
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
