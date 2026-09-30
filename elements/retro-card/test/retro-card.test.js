import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import '../retro-card.js'
import { RetroCard } from '../retro-card.js'
import { SimpleColorsSharedStylesGlobal } from '@haxtheweb/simple-colors-shared-styles/simple-colors-shared-styles.js'

// covers the legacy "source" property branch in updated() that stock
// retro-card no longer exposes (media-source replaced it)
class TestRetroSource extends RetroCard {
  static get tag() {
    return 'test-retro-source'
  }
  static get properties() {
    return { ...super.properties, source: { type: String } }
  }
}
globalThis.customElements.define(TestRetroSource.tag, TestRetroSource)

describe('retro-card test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <retro-card title="test-title"></retro-card>
    `)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

describe('retro-card defaults and statics', () => {
  it('constructor sets default state', async () => {
    const el = await fixture(html`<retro-card></retro-card>`)
    expect(el.title).to.equal(undefined)
    expect(el.subtitle).to.equal(undefined)
    expect(el.tags).to.equal(undefined)
    expect(el.mediaSource).to.equal(undefined)
    expect(el.hoverSource).to.equal(undefined)
    expect(el.url).to.equal(undefined)
    expect(el.hoverState).to.equal(false)
    expect(el.nosource).to.equal(false)
    expect(el.__cardTags).to.deep.equal([])
    expect(el.__source).to.equal(undefined)
  })

  it('has the conventional tag and hax wiring', () => {
    expect(RetroCard.tag).to.equal('retro-card')
    const props = RetroCard.haxProperties
    expect(props.canScale).to.equal(false)
    expect(props.canEditSource).to.equal(true)
    // intentional retro aesthetic, not a DDD-based element
    expect(props.designSystem).to.equal(false)
    expect(props.gizmo.title).to.equal('Retro card')
    expect(props.settings.configure[0].property).to.equal('title')
    expect(props.saveOptions.unsetAttributes).to.deep.equal(['colors'])
    // the demo schema demos this element, not another one
    expect(props.demoSchema[0].tag).to.equal('retro-card')
  })
})

describe('retro-card link variant rendering', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`
      <retro-card
        title="Card title"
        subtitle="Card subtitle"
        tags="dreams, hax"
        url="https://example.com/"
        media-source="media.png"
        hover-source="hover.png"
      >
        <p>description text</p>
      </retro-card>
    `)
    await aTimeout(50)
  })

  it('renders an anchor wrapper with the url', () => {
    const link = el.shadowRoot.querySelector('a')
    expect(link).to.exist
    expect(link.getAttribute('href')).to.equal('https://example.com/')
    expect(link.getAttribute('tabindex')).to.equal('-1')
    expect(link.className.includes('link')).to.equal(true)
    // host is keyboard focusable and delegates Enter to the inner link
    expect(el.getAttribute('tabindex')).to.equal('0')
  })

  it('renders title, subtitle, description slot, and tag chips', () => {
    const title = el.shadowRoot.querySelector('.title')
    expect(title.getAttribute('part')).to.equal('title')
    expect(title.textContent.trim()).to.equal('Card title')
    const subtitle = el.shadowRoot.querySelector('.subtitle')
    expect(subtitle.getAttribute('part')).to.equal('subtitle')
    expect(subtitle.textContent.trim()).to.equal('Card subtitle')
    const description = el.shadowRoot.querySelector('.description')
    expect(description.getAttribute('part')).to.equal('description')
    expect(description.querySelector('slot')).to.exist
    const tags = el.shadowRoot.querySelectorAll('.project-tag')
    expect(tags.length).to.equal(2)
    expect(tags[0].textContent.trim()).to.equal('dreams')
    expect(tags[1].textContent.trim()).to.equal('hax')
    expect(el.shadowRoot.querySelector('.card-tags').getAttribute('part')).to.equal('card-tags')
    expect(el.shadowRoot.querySelector('hr')).to.exist
  })

  it('renders the media source image before any hover state', () => {
    const img = el.shadowRoot.querySelector('img')
    expect(img == null).to.equal(false)
    expect(img.getAttribute('src')).to.equal('media.png')
    expect(img.getAttribute('loading')).to.equal('lazy')
    // alt is derived from the title and subtitle since media-source is required
    expect(img.getAttribute('alt')).to.equal('Card title Card subtitle')
  })

  it('swaps media source on and off hover state', async () => {
    el.dispatchEvent(new MouseEvent('mouseover'))
    await el.updateComplete
    await aTimeout(50)
    expect(el.hoverState).to.equal(true)
    // booleans reflect as an empty-string attribute value
    expect(el.hasAttribute('hover-state')).to.equal(true)
    expect(el.getAttribute('hover-state')).to.equal('')
    let img = el.shadowRoot.querySelector('img')
    expect(img.getAttribute('src')).to.equal('hover.png')
    expect(img.className).to.equal('img')
    el.dispatchEvent(new MouseEvent('mouseout'))
    await el.updateComplete
    await aTimeout(50)
    expect(el.hoverState).to.equal(false)
    img = el.shadowRoot.querySelector('img')
    expect(img.getAttribute('src')).to.equal('media.png')
  })

  it('normalizes hover and focus state for keyboard users', async () => {
    el.dispatchEvent(new FocusEvent('focusin'))
    await el.updateComplete
    await aTimeout(50)
    expect(el.hoverState).to.equal(true)
    el.dispatchEvent(new FocusEvent('focusout'))
    await el.updateComplete
    await aTimeout(50)
    expect(el.hoverState).to.equal(false)
  })

  it('delegates Enter keydown to a click on the inner link', () => {
    const anchor = el.shadowRoot.querySelector('a')
    let clicked = false
    const original = anchor.click
    anchor.click = () => {
      clicked = true
    }
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    expect(clicked).to.equal(true)
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    expect(clicked).to.equal(true)
    anchor.click = original
  })
})

describe('retro-card hover source fallback', () => {
  it('defaults hoverSource to mediaSource when not supplied', async () => {
    const el = await fixture(html`
      <retro-card media-source="only-media.png"></retro-card>
    `)
    await aTimeout(50)
    expect(el.hoverSource).to.equal('only-media.png')
    el.dispatchEvent(new MouseEvent('mouseover'))
    await el.updateComplete
    await aTimeout(50)
    expect(el.shadowRoot.querySelector('img').getAttribute('src')).to.equal('only-media.png')
  })
})

describe('retro-card nosource variant rendering', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`
      <retro-card
        nosource
        title="No link"
        tags="plain, card"
        media-source="media.png"
        hover-source="hover.png"
      ></retro-card>
    `)
    await aTimeout(50)
  })

  it('renders a div instead of an anchor and stays out of tab order', () => {
    expect(el.shadowRoot.querySelector('a')).to.equal(null)
    const wrap = el.shadowRoot.querySelector('div.link')
    expect(wrap).to.exist
    expect(wrap.className.includes('link')).to.equal(true)
    expect(el.getAttribute('tabindex')).to.equal(null)
  })

  it('renders tag chips in the div variant as well', () => {
    const tags = el.shadowRoot.querySelectorAll('.project-tag')
    expect(tags.length).to.equal(2)
    expect(tags[0].textContent.trim()).to.equal('plain')
    expect(tags[1].textContent.trim()).to.equal('card')
    expect(el.shadowRoot.querySelector('hr')).to.exist
    expect(el.shadowRoot.querySelector('.card-tags').getAttribute('part')).to.equal('card-tags')
  })

  it('still tracks hover state and swaps media without focus handlers', async () => {
    el.dispatchEvent(new MouseEvent('mouseover'))
    await el.updateComplete
    await aTimeout(50)
    expect(el.hoverState).to.equal(true)
    expect(el.shadowRoot.querySelector('img').getAttribute('src')).to.equal('hover.png')
    // focusin is intentionally not wired in nosource mode
    el.dispatchEvent(new FocusEvent('focusout'))
    await el.updateComplete
    await aTimeout(50)
    expect(el.hoverState).to.equal(true)
    el.dispatchEvent(new MouseEvent('mouseout'))
    await el.updateComplete
    await aTimeout(50)
    expect(el.hoverState).to.equal(false)
  })
})

describe('retro-card tags parsing', () => {
  it('splits comma separated tags into chips on change', async () => {
    const el = await fixture(html`<retro-card></retro-card>`)
    el.tags = 'dreams, hax, camp'
    await el.updateComplete
    await aTimeout(50)
    expect(el.__cardTags).to.deep.equal(['dreams', ' hax', ' camp'])
    const tags = el.shadowRoot.querySelectorAll('.project-tag')
    expect(tags.length).to.equal(3)
    expect(tags[2].textContent.trim()).to.equal('camp')
    expect(el.shadowRoot.querySelector('hr')).to.exist
  })
})

describe('retro-card hax integration hooks', () => {
  it('exposes edit mode and active element hooks', async () => {
    const el = await fixture(html`<retro-card></retro-card>`)
    expect(el.haxHooks()).to.deep.equal({
      editModeChanged: 'haxeditModeChanged',
      activeElementChanged: 'haxactiveElementChanged',
    })
    el.haxactiveElementChanged(el, true)
    expect(el._haxstate).to.equal(true)
    // a falsy value never resets the flag
    el.haxactiveElementChanged(el, false)
    expect(el._haxstate).to.equal(true)
    el.haxeditModeChanged(false)
    expect(el._haxstate).to.equal(false)
  })

  it('blocks link navigation while in hax edit state', async () => {
    const el = await fixture(html`
      <retro-card url="https://example.com/"></retro-card>
    `)
    // without hax state the click would run through untouched
    const unhandled = new MouseEvent('click', { bubbles: true, cancelable: true })
    el._clickCard(unhandled)
    expect(unhandled.defaultPrevented).to.equal(false)
    // with hax state the wired handler cancels the same click
    el.haxeditModeChanged(true)
    const anchor = el.shadowRoot.querySelector('a')
    const handled = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      composed: true,
    })
    anchor.dispatchEvent(handled)
    expect(handled.defaultPrevented).to.equal(true)
  })
})

describe('retro-card inherited simple-colors behavior', () => {
  it('exposes the base class render output', async () => {
    const el = await fixture(html`<retro-card></retro-card>`)
    const simpleColorsProto = Object.getPrototypeOf(RetroCard.prototype)
    const baseRender = simpleColorsProto.render.call(el)
    expect(baseRender.strings).to.exist
    // the shared styles singleton also carries a render method
    expect(SimpleColorsSharedStylesGlobal.render().strings).to.exist
  })

  it('delegates invertShade to the shared styles singleton', async () => {
    const el = await fixture(html`<retro-card></retro-card>`)
    expect(el.invertShade('3')).to.equal(10)
    expect(el.invertShade('12')).to.equal(1)
  })

  it('delegates getColorInfo', async () => {
    const el = await fixture(html`<retro-card></retro-card>`)
    const info = el.getColorInfo('--simple-colors-fixed-theme-red-3')
    expect(info).to.deep.equal({ theme: 'fixed', color: 'red', shade: '3' })
  })

  it('delegates makeVariable', async () => {
    const el = await fixture(html`<retro-card></retro-card>`)
    // the shared styles singleton composes correctly
    expect(SimpleColorsSharedStylesGlobal.makeVariable('red', 3, 'fixed')).to.equal(
      '--simple-colors-fixed-theme-red-3',
    )
    // and the element-level passthrough forwards the caller arguments
    expect(el.makeVariable('red', 3, 'fixed')).to.equal(
      '--simple-colors-fixed-theme-red-3',
    )
  })

  it('delegates contrast shade and color lookups', async () => {
    const el = await fixture(html`<retro-card></retro-card>`)
    expect(el.getContrastingShades(false, 'grey', '3', 'grey')).to.deep.equal([
      7, 8, 9, 10, 11, 12,
    ])
    expect(el.getContrastingShades(true, 'grey', '3', 'grey')).to.deep.equal([
      7, 8, 9, 10, 11, 12,
    ])
    expect(el.getContrastingShades(false, 'red', '3', 'blue')).to.deep.equal([
      9, 10, 11, 12,
    ])
    const contrasting = el.getContrastingColors('grey', '3', false)
    expect(Object.keys(contrasting).length).to.equal(Object.keys(el.colors).length)
    // colorName is grey so every target color resolves through the grey table
    expect(contrasting.grey).to.deep.equal([7, 8, 9, 10, 11, 12])
    expect(contrasting.red).to.deep.equal([7, 8, 9, 10, 11, 12])
  })

  it('delegates isContrastCompliant', async () => {
    const el = await fixture(html`<retro-card></retro-card>`)
    // below the compliant range
    expect(el.isContrastCompliant(true, 'grey', 1, 'grey', 1)).to.equal(false)
    // inside the compliant range
    expect(el.isContrastCompliant(true, 'grey', 1, 'grey', 7)).to.equal(true)
  })

  it('shares shade/index conversion helpers', () => {
    expect(SimpleColorsSharedStylesGlobal.indexToShade('3')).to.equal(4)
    expect(SimpleColorsSharedStylesGlobal.shadeToIndex('12')).to.equal(11)
  })
})

describe('retro-card legacy source property', () => {
  it('maps a source change onto the media source', async () => {
    const el = await fixture(html`
      <test-retro-source
        source="legacy.png"
        media-source="modern.png"
      ></test-retro-source>
    `)
    await aTimeout(50)
    const img = el.shadowRoot.querySelector('img')
    expect(img).to.exist
    expect(img.getAttribute('src')).to.equal('modern.png')
  })
})
