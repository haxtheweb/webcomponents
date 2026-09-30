import { fixture, expect, html } from '@open-wc/testing'

import '../lib/simple-toolbar-field.js'

describe('simple-toolbar-field rendering', () => {
  it('can be instantiated', async () => {
    const el = await fixture(
      html`<simple-toolbar-field></simple-toolbar-field>`,
    )
    expect(el).to.exist
    expect(el.tagName.toLowerCase()).to.equal('simple-toolbar-field')
  })

  it('defaults to fullDisplay=false', async () => {
    const el = await fixture(
      html`<simple-toolbar-field></simple-toolbar-field>`,
    )
    expect(el.fullDisplay).to.equal(false)
  })

  it('reflects full-display attribute', async () => {
    const el = await fixture(
      html`<simple-toolbar-field full-display></simple-toolbar-field>`,
    )
    expect(el.fullDisplay).to.equal(true)
    expect(el.hasAttribute('full-display')).to.equal(true)
  })

  it('renders a span[part="field"] wrapping the slot when not fullDisplay', async () => {
    const el = await fixture(
      html`<simple-toolbar-field></simple-toolbar-field>`,
    )
    const fieldSpan = el.shadowRoot.querySelector('span[part="field"]')
    expect(fieldSpan).to.exist
    const slot = fieldSpan.querySelector('slot')
    expect(slot).to.exist
  })

  it('renders slot directly in div[part="button"] when fullDisplay', async () => {
    const el = await fixture(
      html`<simple-toolbar-field full-display></simple-toolbar-field>`,
    )
    const buttonDiv = el.shadowRoot.querySelector('div[part="button"]')
    expect(buttonDiv).to.exist
    const fieldSpan = buttonDiv.querySelector('span[part="field"]')
    expect(fieldSpan).to.be.null
    const slot = buttonDiv.querySelector('slot')
    expect(slot).to.exist
  })

  it('passes a11y audit in non-fullDisplay mode', async () => {
    const el = await fixture(
      html`<simple-toolbar-field label="Test"></simple-toolbar-field>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })

  it('passes a11y audit in fullDisplay mode', async () => {
    const el = await fixture(
      html`<simple-toolbar-field full-display label="Test"></simple-toolbar-field>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })
})

describe('simple-toolbar-field focusableElement', () => {
  it('returns null when no slotted children', async () => {
    const el = await fixture(
      html`<simple-toolbar-field></simple-toolbar-field>`,
    )
    expect(el.focusableElement).to.be.null
  })

  it('returns the first non-disabled, non-hidden slotted child', async () => {
    const el = await fixture(
      html`<simple-toolbar-field><input type="text" /></simple-toolbar-field>`,
    )
    await el.updateComplete
    expect(el.focusableElement).to.exist
    expect(el.focusableElement.tagName).to.equal('INPUT')
  })

  it('skips disabled children', async () => {
    const el = await fixture(
      html`<simple-toolbar-field
        ><input type="text" disabled /><input type="text"
      /></simple-toolbar-field>`,
    )
    await el.updateComplete
    expect(el.focusableElement).to.exist
    expect(el.focusableElement.disabled).to.equal(false)
  })

  it('skips hidden children', async () => {
    const el = await fixture(
      html`<simple-toolbar-field
        ><input type="text" hidden /><input type="text"
      /></simple-toolbar-field>`,
    )
    await el.updateComplete
    expect(el.focusableElement).to.exist
    expect(el.focusableElement.hidden).to.equal(false)
  })
})

describe('simple-toolbar-field _syncFocusableState', () => {
  it('sets tabindex=0 when isCurrentItem and not disabled', async () => {
    const el = await fixture(
      html`<simple-toolbar-field
        ><input type="text"
      /></simple-toolbar-field>`,
    )
    await el.updateComplete
    el.isCurrentItem = true
    el.disabled = false
    el._syncFocusableState()
    expect(el.focusableElement.getAttribute('tabindex')).to.equal('0')
  })

  it('sets tabindex=-1 when not isCurrentItem', async () => {
    const el = await fixture(
      html`<simple-toolbar-field
        ><input type="text"
      /></simple-toolbar-field>`,
    )
    await el.updateComplete
    el.isCurrentItem = false
    el._syncFocusableState()
    expect(el.focusableElement.getAttribute('tabindex')).to.equal('-1')
  })

  it('sets tabindex=-1 when disabled', async () => {
    const el = await fixture(
      html`<simple-toolbar-field
        ><input type="text"
      /></simple-toolbar-field>`,
    )
    await el.updateComplete
    el.isCurrentItem = true
    el.disabled = true
    el._syncFocusableState()
    expect(el.focusableElement.getAttribute('tabindex')).to.equal('-1')
  })

  it('sets aria-disabled=true when disabled', async () => {
    const el = await fixture(
      html`<simple-toolbar-field
        ><input type="text"
      /></simple-toolbar-field>`,
    )
    await el.updateComplete
    el.disabled = true
    el._syncFocusableState()
    expect(el.focusableElement.getAttribute('aria-disabled')).to.equal('true')
  })

  it('removes aria-disabled when not disabled', async () => {
    const el = await fixture(
      html`<simple-toolbar-field
        ><input type="text"
      /></simple-toolbar-field>`,
    )
    await el.updateComplete
    el.disabled = true
    el._syncFocusableState()
    el.disabled = false
    el._syncFocusableState()
    expect(el.focusableElement.hasAttribute('aria-disabled')).to.equal(false)
  })

  it('is a no-op when no focusableElement', async () => {
    const el = await fixture(
      html`<simple-toolbar-field></simple-toolbar-field>`,
    )
    expect(() => el._syncFocusableState()).to.not.throw()
  })
})

describe('simple-toolbar-field toggleFocus', () => {
  it('focuses the field when focusableElement width <= 10', async () => {
    const el = await fixture(
      html`<simple-toolbar-field
        ><input type="text"
      /></simple-toolbar-field>`,
    )
    await el.updateComplete
    let focused = false
    el.focus = () => {
      focused = true
    }
    el.toggleFocus({})
    // In test env, clientWidth is 0 which is <= 10, so it should focus
    expect(focused).to.equal(true)
  })

  it('blurs the focusableElement when width > 10', async () => {
    const el = await fixture(
      html`<simple-toolbar-field
        ><input type="text"
      /></simple-toolbar-field>`,
    )
    await el.updateComplete
    let blurred = false
    el.focusableElement.blur = () => {
      blurred = true
    }
    // Mock clientWidth to be > 10
    Object.defineProperty(el.focusableElement, 'clientWidth', {
      value: 100,
      configurable: true,
    })
    el.toggleFocus({})
    expect(blurred).to.equal(true)
  })
})

describe('simple-toolbar-field updated lifecycle', () => {
  it('calls _syncFocusableState when isCurrentItem changes', async () => {
    const el = await fixture(
      html`<simple-toolbar-field
        ><input type="text"
      /></simple-toolbar-field>`,
    )
    await el.updateComplete
    el.isCurrentItem = true
    await el.updateComplete
    expect(el.focusableElement.getAttribute('tabindex')).to.equal('0')
  })

  it('calls _syncFocusableState when disabled changes', async () => {
    const el = await fixture(
      html`<simple-toolbar-field
        ><input type="text"
      /></simple-toolbar-field>`,
    )
    await el.updateComplete
    el.isCurrentItem = true
    await el.updateComplete
    el.disabled = true
    await el.updateComplete
    expect(el.focusableElement.getAttribute('aria-disabled')).to.equal('true')
  })
})

describe('simple-toolbar-field observer', () => {
  it('creates a MutationObserver', async () => {
    const el = await fixture(
      html`<simple-toolbar-field></simple-toolbar-field>`,
    )
    expect(el.observer).to.be.instanceOf(globalThis.MutationObserver)
  })

  it('_watchChildren calls _syncFocusableState', async () => {
    const el = await fixture(
      html`<simple-toolbar-field
        ><input type="text"
      /></simple-toolbar-field>`,
    )
    await el.updateComplete
    el.isCurrentItem = true
    el._syncFocusableState()
    const tabindexBefore = el.focusableElement.getAttribute('tabindex')
    expect(tabindexBefore).to.equal('0')
    // _watchChildren should sync state
    el.isCurrentItem = false
    el._watchChildren([])
    expect(el.focusableElement.getAttribute('tabindex')).to.equal('-1')
  })
})

describe('simple-toolbar-field tooltipFullDisplayTemplate', () => {
  it('returns empty string when tooltipVisible is false', async () => {
    const el = await fixture(
      html`<simple-toolbar-field full-display></simple-toolbar-field>`,
    )
    await el.updateComplete
    // No label, no icon, no tooltip -> tooltipVisible should be false
    expect(el.tooltipVisible).to.equal(false)
  })

  it('renders tooltip when tooltipVisible and fullDisplay', async () => {
    const el = await fixture(
      html`<simple-toolbar-field
        full-display
        label="My Field"
        show-tooltip
      ></simple-toolbar-field>`,
    )
    await el.updateComplete
    expect(el.tooltipVisible).to.equal(true)
    const tooltip = el.shadowRoot.querySelector('simple-tooltip')
    expect(tooltip).to.exist
  })
})
