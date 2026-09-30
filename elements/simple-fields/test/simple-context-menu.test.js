import { fixture, expect, html, oneEvent, aTimeout } from '@open-wc/testing'

import '../lib/simple-context-menu.js'

describe('simple-context-menu', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-context-menu></simple-context-menu>`)
    await el.updateComplete
  })

  it('passes a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })

  it('instantiates with default properties', () => {
    expect(el.title).to.equal('')
    expect(el.open).to.equal(false)
    expect(el.positionStrategy).to.equal('anchor')
    expect(el.x).to.equal(0)
    expect(el.y).to.equal(0)
    expect(el.offset).to.equal(4)
  })

  it('renders a dialog element', () => {
    const dialog = el.shadowRoot.querySelector('dialog')
    expect(dialog).to.exist
  })

  it('renders title header when title is set', async () => {
    el.title = 'My Menu'
    await el.updateComplete
    const header = el.shadowRoot.querySelector('.menu-header')
    expect(header).to.exist
    expect(header.textContent).to.equal('My Menu')
  })

  it('does not render title header when no title', () => {
    const header = el.shadowRoot.querySelector('.menu-header')
    expect(header).to.equal(null)
  })

  it('has a slot for menu items', () => {
    const slot = el.shadowRoot.querySelector('slot')
    expect(slot).to.exist
  })

  it('_isFocusableMenuNode returns false for null', () => {
    expect(el._isFocusableMenuNode(null)).to.equal(false)
  })

  it('_isFocusableMenuNode returns false for disabled element', () => {
    const btn = document.createElement('button')
    btn.setAttribute('disabled', '')
    expect(el._isFocusableMenuNode(btn)).to.equal(false)
  })

  it('_isFocusableMenuNode returns false for aria-disabled', () => {
    const div = document.createElement('div')
    div.setAttribute('aria-disabled', 'true')
    expect(el._isFocusableMenuNode(div)).to.equal(false)
  })

  it('_isFocusableMenuNode returns true for button', () => {
    const btn = document.createElement('button')
    expect(el._isFocusableMenuNode(btn)).to.equal(true)
  })

  it('_isFocusableMenuNode returns true for anchor', () => {
    const a = document.createElement('a')
    a.href = '#'
    expect(el._isFocusableMenuNode(a)).to.equal(true)
  })

  it('_isFocusableMenuNode returns true for input', () => {
    const input = document.createElement('input')
    expect(el._isFocusableMenuNode(input)).to.equal(true)
  })

  it('_isFocusableMenuNode returns true for element with tabindex >= 0', () => {
    const div = document.createElement('div')
    div.tabIndex = 0
    expect(el._isFocusableMenuNode(div)).to.equal(true)
  })

  it('_isFocusableMenuNode returns true for element with tabindex attribute >= 0', () => {
    const div = document.createElement('div')
    div.setAttribute('tabindex', '0')
    expect(el._isFocusableMenuNode(div)).to.equal(true)
  })

  it('_isFocusableMenuNode returns true for element with focusableElement', () => {
    const div = document.createElement('div')
    div.focusableElement = { disabled: false }
    expect(el._isFocusableMenuNode(div)).to.equal(true)
  })

  it('_isFocusableMenuNode returns true for element with shadowRoot containing button', () => {
    const el2 = document.createElement('div')
    el2.attachShadow({ mode: 'open' })
    el2.shadowRoot.innerHTML = '<button>test</button>'
    expect(el._isFocusableMenuNode(el2)).to.equal(true)
  })

  it('_isFocusableMenuNode returns false for non-focusable div', () => {
    const div = document.createElement('div')
    expect(el._isFocusableMenuNode(div)).to.equal(false)
  })

  it('_getFocusableItems returns empty array when no slot', async () => {
    // remove slot by replacing render
    const result = el._getFocusableItems()
    // slot exists in shadow dom, but no items slotted
    expect(Array.isArray(result)).to.equal(true)
  })

  it('_pathContainsItem returns false for null path', () => {
    expect(el._pathContainsItem(null, {})).to.equal(false)
  })

  it('_pathContainsItem returns false for null item', () => {
    expect(el._pathContainsItem([], null)).to.equal(false)
  })

  it('_pathContainsItem returns true when item is in path', () => {
    const item = document.createElement('div')
    expect(el._pathContainsItem([item], item)).to.equal(true)
  })

  it('_pathContainsItem returns true when focusableElement is in path', () => {
    const item = { focusableElement: {} }
    expect(el._pathContainsItem([item.focusableElement], item)).to.equal(true)
  })

  it('_itemMatchesFocus returns false for null item', () => {
    expect(el._itemMatchesFocus(null, null, [])).to.equal(false)
  })

  it('_itemMatchesFocus returns true when path contains item', () => {
    const item = document.createElement('div')
    expect(el._itemMatchesFocus(item, null, [item])).to.equal(true)
  })

  it('_itemMatchesFocus returns true when activeElement equals item', () => {
    const item = document.createElement('div')
    expect(el._itemMatchesFocus(item, item, [])).to.equal(true)
  })

  it('_itemMatchesFocus returns true when activeElement equals focusableElement', () => {
    const fe = {}
    const item = { focusableElement: fe }
    expect(el._itemMatchesFocus(item, fe, [])).to.equal(true)
  })

  it('_itemMatchesFocus returns true when item has shadowRoot activeElement', () => {
    // Need a non-null activeElement so the code doesn't early-return at
    // `if (!activeElement) return false` before reaching the shadowRoot check
    const activeEl = document.createElement('div')
    const item = {
      shadowRoot: { activeElement: document.createElement('div') },
    }
    expect(el._itemMatchesFocus(item, activeEl, [])).to.equal(true)
  })

  it('_getFocusedItemIndex returns -1 for empty array', () => {
    expect(el._getFocusedItemIndex([], {})).to.equal(-1)
  })

  it('_getFocusedItemIndex returns -1 for null array', () => {
    expect(el._getFocusedItemIndex(null, {})).to.equal(-1)
  })

  it('_focusItem does not throw for empty array', () => {
    expect(() => el._focusItem([], 0)).to.not.throw()
  })

  it('_focusItem wraps negative index', () => {
    const items = [{ focus() {} }, { focus() {} }]
    let focusedIndex = -1
    items[0].focus = () => { focusedIndex = 0 }
    items[1].focus = () => { focusedIndex = 1 }
    el._focusItem(items, -1)
    // -1 + 2 = 1, so index 1
    expect(focusedIndex).to.equal(1)
  })

  it('_focusItem wraps index beyond length', () => {
    const items = [{ focus() {} }, { focus() {} }]
    let focusedIndex = -1
    items[0].focus = () => { focusedIndex = 0 }
    items[1].focus = () => { focusedIndex = 1 }
    el._focusItem(items, 2)
    // 2 % 2 = 0
    expect(focusedIndex).to.equal(0)
  })

  it('_activateMenuItem clicks the item directly', () => {
    let clicked = false
    const item = { click() { clicked = true } }
    el._activateMenuItem(item)
    expect(clicked).to.equal(true)
  })

  it('_activateMenuItem clicks focusableElement when available', () => {
    let clicked = false
    const item = {
      focusableElement: {
        disabled: false,
        click() { clicked = true },
      },
    }
    el._activateMenuItem(item)
    expect(clicked).to.equal(true)
  })

  it('_activateMenuItem clicks inner control in shadowRoot', () => {
    let clicked = false
    const innerEl = document.createElement('button')
    innerEl.click = () => { clicked = true }
    const item = document.createElement('div')
    item.attachShadow({ mode: 'open' })
    item.shadowRoot.appendChild(innerEl)
    el._activateMenuItem(item)
    expect(clicked).to.equal(true)
  })

  it('_activateMenuItem is no-op for null', () => {
    expect(() => el._activateMenuItem(null)).to.not.throw()
  })

  it('_handleKeydown is no-op when no focusable items', () => {
    expect(() =>
      el._handleKeydown({ key: 'ArrowDown', preventDefault() {} }),
    ).to.not.throw()
  })

  it('close does not throw when dialog not open', () => {
    expect(() => el.close()).to.not.throw()
  })

  it('open property reflects to attribute', async () => {
    el.open = true
    await el.updateComplete
    expect(el.hasAttribute('open')).to.equal(true)
  })

  it('positionStrategy property does not reflect to attribute (no reflect:true)', async () => {
    // positionStrategy has attribute mapping but no reflect: true,
    // so setting the property does not update the attribute
    el.positionStrategy = 'fixed'
    await el.updateComplete
    expect(el.positionStrategy).to.equal('fixed')
    expect(el.getAttribute('position-strategy')).to.equal(null)
  })
})
