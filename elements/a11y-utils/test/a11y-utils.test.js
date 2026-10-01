import { fixture, expect, html } from '@open-wc/testing'
import { LitElement, CSSResult } from 'lit'
import { screenreaderOnlyCSS } from '../a11y-utils.js'

// a11y-utils is a CSS utility module (no custom element); the behavioral
// surface is the exported screenreaderOnlyCSS lit CSSResult which elements
// compose into their static styles to hide content visually while keeping it
// available to assistive technology.

class SrOnlyHost extends LitElement {
  static get tag() {
    return 'sr-only-host'
  }
  static get styles() {
    return [screenreaderOnlyCSS]
  }
  render() {
    return html`<span class="sr-only">hidden helper text</span>
      <span>visible text</span>`
  }
}
customElements.define(SrOnlyHost.tag, SrOnlyHost)

describe('a11y-utils', () => {
  it('exports screenreaderOnlyCSS as a lit CSSResult', () => {
    expect(screenreaderOnlyCSS).to.exist
    expect(screenreaderOnlyCSS).to.be.instanceOf(CSSResult)
  })

  it('defines the .sr-only visually-hidden pattern (1px, overflow hidden, offscreen)', () => {
    // lit 3.3.3 CSSResult exposes the raw text as cssText (and toString)
    const text = screenreaderOnlyCSS.cssText
    expect(text).to.include('.sr-only')
    expect(text).to.include('position: absolute')
    expect(text).to.include('left: -10000px')
    expect(text).to.include('width: 1px')
    expect(text).to.include('height: 1px')
    expect(text).to.include('overflow: hidden')
  })

  it('applies verbatim when composed into a host element static styles', async () => {
    const el = await fixture(html`<sr-only-host></sr-only-host>`)
    await el.updateComplete
    // lit 3 adopts constructable stylesheets in supporting browsers; fall
    // back to the <style> element form otherwise. Either way the rule must
    // end up applied with the .sr-only selector intact.
    const sheets = el.shadowRoot.adoptedStyleSheets || []
    let found = false
    for (const sheet of sheets) {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText === '.sr-only') {
          found = true
        }
      }
    }
    if (!found) {
      const styleEl = el.shadowRoot.querySelector('style')
      expect(styleEl).to.exist
      expect(styleEl.textContent).to.include('.sr-only')
      found = true
    }
    expect(found).to.be.true
    // the slotted visually-hidden span remains in the DOM for screen readers
    expect(el.shadowRoot.querySelector('.sr-only').textContent).to.equal(
      'hidden helper text',
    )
  })
})
