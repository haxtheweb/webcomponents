import { fixture, expect, html } from '@open-wc/testing'
import { A11yMenuButton } from '../a11y-menu-button.js'
import '../lib/a11y-menu-button-item.js'

const threeItems = () => html`
  <a11y-menu-button>
    <span slot="button">Menu</span>
    <a11y-menu-button-item>Alpha</a11y-menu-button-item>
    <a11y-menu-button-item>Beta</a11y-menu-button-item>
    <a11y-menu-button-item>Gamma</a11y-menu-button-item>
  </a11y-menu-button>
`

const keyEvent = (keyCode, target, extras = {}) => ({
  keyCode,
  key: extras.key || '',
  shiftKey: extras.shiftKey,
  ctrlKey: extras.ctrlKey,
  altKey: extras.altKey,
  metaKey: extras.metaKey,
  composedPath: () => [target],
  stopPropagation: extras.stopPropagation || (() => {}),
  preventDefault: extras.preventDefault || (() => {}),
})

describe('a11y-menu-button behaviors', () => {
  let el
  let items
  let focusCalls

  beforeEach(async () => {
    el = await fixture(threeItems())
    await el.updateComplete
    items = [...el.querySelectorAll('a11y-menu-button-item')]
    focusCalls = []
    items.forEach((item) => {
      item.focus = () => focusCalls.push(item.textContent)
    })
  })

  it('exposes the key code map and core/theme styles', () => {
    expect(el.keyCode.ESC).to.equal(27)
    expect(el.keyCode.TAB).to.equal(9)
    expect(el.keyCode.RETURN).to.equal(13)
    expect(el.keyCode.SPACE).to.equal(32)
    expect(el.keyCode.UP).to.equal(38)
    expect(el.keyCode.DOWN).to.equal(40)
    expect(el.keyCode.HOME).to.equal(36)
    expect(el.keyCode.END).to.equal(35)
    expect(A11yMenuButton.menuButtonCoreStyles.length).to.equal(1)
    expect(A11yMenuButton.menuButtonThemeStyles.length).to.equal(1)
    expect(A11yMenuButton.styles.length).to.equal(2)
  })

  it('collects slotted items with their first characters', () => {
    expect(items.length).to.equal(3)
    expect(el.menuItems.length).to.equal(3)
    expect(el.firstChars.join(',')).to.equal('a,b,g')
    expect(el.firstItem.textContent).to.equal('Alpha')
    expect(el.lastItem.textContent).to.equal('Gamma')
  })

  it('excludes events from keyboard handling by default', () => {
    expect(el._excludeEvent({})).to.equal(false)
  })

  it('focus() targets the inner menu button', async () => {
    const bare = new A11yMenuButton()
    let threw = false
    try {
      bare.focus()
    } catch (e) {
      threw = true
    }
    expect(threw).to.equal(false)
    el.focus()
    // focus inside a shadow root is reported on the host element
    expect(globalThis.document.activeElement === el).to.equal(true)
    expect(el.shadowRoot.querySelector('#menubutton') === null).to.equal(
      false,
    )
  })

  it('focusOn defaults to the first item and is a no-op when empty', () => {
    el.focusOn()
    expect(el.expanded).to.equal(true)
    expect(el.focused).to.equal(true)
    expect(el.currentItem.textContent).to.equal('Alpha')
    expect(focusCalls.join(',')).to.equal('Alpha')
    const empty = new A11yMenuButton()
    let threw = false
    try {
      empty.focusOn()
    } catch (e) {
      threw = true
    }
    expect(threw).to.equal(false)
  })

  it('navigates items relative to the current item', () => {
    el.currentItem = items[1]
    expect(el.getItemIndex()).to.equal(1)
    expect(el.previousItem.textContent).to.equal('Alpha')
    expect(el.nextItem.textContent).to.equal('Gamma')
    expect(el.getItem(-2)).to.equal(undefined)
    expect(el.getItem(2)).to.equal(undefined)
    expect(el.getItem(1).textContent).to.equal('Gamma')
    // at the edges the relative getters run out of items (the keydown
    // handlers are what wrap around using || lastItem / || firstItem)
    el.currentItem = items[0]
    expect(el.previousItem).to.equal(undefined)
    el.currentItem = items[2]
    expect(el.nextItem).to.equal(undefined)
    // an empty menu has no items at all
    const empty = new A11yMenuButton()
    expect(empty.previousItem).to.equal(undefined)
    expect(empty.nextItem).to.equal(undefined)
    expect(empty.getItemIndex()).to.equal(-1)
  })

  it('focusByCharacter jumps to matching items and wraps around', () => {
    el.currentItem = items[0]
    el.focusByCharacter('b')
    expect(focusCalls.join(',')).to.equal('Beta')
    // searching from the last item wraps to the start
    el.currentItem = items[2]
    el.focusByCharacter('a')
    expect(focusCalls.join(',')).to.equal('Beta,Alpha')
    // unknown characters focus nothing
    el.focusByCharacter('z')
    expect(focusCalls.join(',')).to.equal('Beta,Alpha')
  })

  it('toggles the menu from real clicks on the button', async () => {
    const button = el.shadowRoot.querySelector('#menubutton')
    button.dispatchEvent(new Event('click', { bubbles: true, composed: true }))
    expect(el.expanded).to.equal(true)
    button.dispatchEvent(new Event('click', { bubbles: true, composed: true }))
    expect(el.expanded).to.equal(false)
    // clicks that did not hit the button do not toggle
    el.dispatchEvent(new Event('click', { bubbles: true, composed: true }))
    expect(el.expanded).to.equal(false)
  })

  it('toggles for targets nested inside the button via closest', () => {
    const nested = { id: 'inner', closest: () => true }
    el._handleClick(keyEvent(0, nested))
    expect(el.expanded).to.equal(true)
    const outside = { id: 'other', closest: () => null }
    el._handleClick(keyEvent(0, outside))
    expect(el.expanded).to.equal(true)
    el.close(true)
  })

  it('closes on document clicks away from the open menu', async () => {
    el.open()
    await el.updateComplete
    expect(el._docListenerAdded).to.equal(true)
    // a click inside the menu keeps it open
    el.dispatchEvent(new Event('click', { bubbles: true, composed: true }))
    expect(el.expanded).to.equal(true)
    // a click anywhere else closes it
    globalThis.document.body.dispatchEvent(
      new Event('click', { bubbles: true, composed: true }),
    )
    expect(el.expanded).to.equal(false)
    expect(el._docListenerAdded).to.equal(false)
  })

  it('close() without force respects focused and hovered state', () => {
    el.open()
    el.focused = true
    el.close()
    expect(el.expanded).to.equal(true)
    el.focused = false
    el.hovered = true
    el.close()
    expect(el.expanded).to.equal(true)
    el.hovered = false
    el.close()
    expect(el.expanded).to.equal(false)
  })

  it('removes the document listener on disconnect', async () => {
    const el2 = await fixture(threeItems())
    await el2.updateComplete
    el2.open()
    expect(el2._docListenerAdded).to.equal(true)
    el2.remove()
    expect(el2._docListenerAdded).to.equal(false)
  })

  it('handles menu button keydown for open, close and navigation', () => {
    // escape only closes when expanded
    el._handleKeydown(keyEvent(27, el))
    expect(el.expanded).to.equal(false)
    // space opens and focuses the first item
    el._handleKeydown(keyEvent(32, el))
    expect(el.expanded).to.equal(true)
    expect(el.currentItem.textContent).to.equal('Alpha')
    el.close(true)
    // return opens and focuses the first item
    el._handleKeydown(keyEvent(13, el))
    expect(el.expanded).to.equal(true)
    el.close(true)
    // down opens and focuses the first item, but only when closed
    el._handleKeydown(keyEvent(40, el))
    expect(el.expanded).to.equal(true)
    expect(el.currentItem.textContent).to.equal('Alpha')
    el.close(true)
    el._handleKeydown(keyEvent(40, el))
    expect(el.currentItem.textContent).to.equal('Alpha')
    // up opens and focuses the last item while the menu is closed
    el.close(true)
    el._handleKeydown(keyEvent(38, el))
    expect(el.expanded).to.equal(true)
    expect(el.currentItem.textContent).to.equal('Gamma')
    // unknown keys do nothing
    el._handleKeydown(keyEvent(999, el))
    expect(el.expanded).to.equal(true)
    // space and return close when already expanded
    el._handleKeydown(keyEvent(32, el))
    expect(el.expanded).to.equal(false)
  })

  it('handles menu item keydown navigation', () => {
    // escape closes and refocuses the button
    el.open()
    el._handleItemKeydown(keyEvent(27, items[0]))
    expect(el.expanded).to.equal(false)
    // up from the first item wraps to the last
    el.currentItem = items[0]
    el._handleItemKeydown(keyEvent(38, items[0], { key: 'ArrowUp' }))
    expect(el.currentItem.textContent).to.equal('Gamma')
    // down from the last item wraps to the first
    el.currentItem = items[2]
    el._handleItemKeydown(keyEvent(40, items[2], { key: 'ArrowDown' }))
    expect(el.currentItem.textContent).to.equal('Alpha')
    // home and page up focus the first item
    el._handleItemKeydown(keyEvent(36, items[1], { key: 'Home' }))
    expect(el.currentItem.textContent).to.equal('Alpha')
    el._handleItemKeydown(keyEvent(33, items[1], { key: 'PageUp' }))
    expect(el.currentItem.textContent).to.equal('Alpha')
    // end and page down focus the last item
    el._handleItemKeydown(keyEvent(35, items[1], { key: 'End' }))
    expect(el.currentItem.textContent).to.equal('Gamma')
    el._handleItemKeydown(keyEvent(34, items[1], { key: 'PageDown' }))
    expect(el.currentItem.textContent).to.equal('Gamma')
    // printable characters jump to matching items
    focusCalls = []
    el.currentItem = items[0]
    el._handleItemKeydown(keyEvent(0, items[0], { key: 'g' }))
    expect(focusCalls.join(',')).to.equal('Gamma')
    // shift plus a printable character also searches
    el._handleItemKeydown(keyEvent(0, items[0], { key: 'b', shiftKey: true }))
    expect(focusCalls.join(',')).to.equal('Gamma,Beta')
  })

  it('handles tab and shift-tab between items', () => {
    el.open()
    // tab from the middle item moves to the next item
    el.currentItem = items[1]
    el._handleItemKeydown(keyEvent(9, items[1], { key: 'Tab' }))
    expect(el.currentItem.textContent).to.equal('Gamma')
    // tab from the last item exits the menu
    el.currentItem = items[2]
    el._handleItemKeydown(keyEvent(9, items[2], { key: 'Tab' }))
    expect(el.expanded).to.equal(false)
    // shift-tab from the middle item moves to the previous item
    el.open()
    el.currentItem = items[1]
    el._handleItemKeydown(
      keyEvent(9, items[1], { key: 'Tab', shiftKey: true }),
    )
    expect(el.currentItem.textContent).to.equal('Alpha')
    // shift-tab from the first item exits the menu
    el.currentItem = items[0]
    el._handleItemKeydown(
      keyEvent(9, items[0], { key: 'Tab', shiftKey: true }),
    )
    expect(el.expanded).to.equal(false)
  })

  it('ignores item keystrokes for form fields and modifiers', () => {
    const inputTarget = { tagName: 'INPUT' }
    let threw = false
    try {
      el._handleItemKeydown(keyEvent(38, inputTarget, { key: 'Shift' }))
    } catch (e) {
      threw = true
    }
    expect(threw).to.equal(false)
    // modifier keys are left to the browser
    el.currentItem = items[0]
    el._handleItemKeydown(
      keyEvent(38, items[0], { key: 'ArrowUp', ctrlKey: true }),
    )
    expect(el.currentItem.textContent).to.equal('Alpha')
    // space and return on items keep default behavior
    el._handleItemKeydown(keyEvent(32, items[0], { key: ' ' }))
    el._handleItemKeydown(keyEvent(13, items[0], { key: 'Enter' }))
    expect(focusCalls.length).to.equal(0)
  })

  it('fires item-click and closes unless keep-open is set', async () => {
    let clicked = null
    el.addEventListener('item-click', (e) => {
      clicked = e.detail
    })
    el.open()
    const clickEvent = { stopPropagation: () => {} }
    el._handleItemClick(clickEvent)
    expect(el.expanded).to.equal(false)
    expect(clicked === clickEvent).to.equal(true)
    // keepOpenOnClick keeps the menu open but still notifies
    const keeper = await fixture(
      html`<a11y-menu-button keep-open-on-click>
        <span slot="button">Menu</span>
        <a11y-menu-button-item>Alpha</a11y-menu-button-item>
      </a11y-menu-button>`,
    )
    await keeper.updateComplete
    let kept = null
    keeper.addEventListener('item-click', (e) => {
      kept = e.detail
    })
    keeper.open()
    keeper._handleItemClick(clickEvent)
    expect(keeper.expanded).to.equal(true)
    expect(kept === clickEvent).to.equal(true)
  })

  it('tracks blur targets within the menu', () => {
    el._handleFocus()
    expect(el.focused).to.equal(true)
    // blurring toward a menu item keeps state tidy
    el._handleBlur({ relatedTarget: items[0] })
    expect(el.focused).to.equal(false)
    el._handleBlur({ relatedTarget: globalThis.document.createElement('div') })
    expect(el.focused).to.equal(false)
    el._handleBlur()
    expect(el.focused).to.equal(false)
  })

  it('adds and removes items through the dom events', async () => {
    expect(el.menuItems.length).to.equal(3)
    const extra = globalThis.document.createElement('a11y-menu-button-item')
    extra.textContent = 'Delta'
    el.appendChild(extra)
    await el.updateComplete
    expect(el.menuItems.length).to.equal(4)
    expect(el.menuItems[3].textContent).to.equal('Delta')
    // removing from the dom leaves the stale item in the list
    extra.remove()
    await el.updateComplete
    expect(el.menuItems.length).to.equal(4)
    expect(
      el.menuItems.filter((i) => i === extra).length,
    ).to.equal(1)
  })

  // BUG (two defects in the item removal flow):
  // (a) lib/a11y-menu-button-item.js:223-237 — disconnectedCallback
  //     dispatches remove-a11y-menu-button-item AFTER the element is
  //     already detached, so the event never bubbles to the menu; removal
  //     notifications are dead code (verified: only the add event arrives).
  // (b) a11y-menu-button.js:606-609 — even when the event is delivered
  //     (simulated below), _handleRemoveItem calls this.addItem(event.detail)
  //     instead of this.removeItem, so it would RE-ADD the removed item.
  // Documents current behavior for the fix swarm.
  it('re-adds removed items instead of removing them', async () => {
    const extra = globalThis.document.createElement('a11y-menu-button-item')
    extra.textContent = 'Delta'
    el.appendChild(extra)
    await el.updateComplete
    const before = el.menuItems.length
    // simulate the event the detached item can no longer deliver itself
    extra.dispatchEvent(
      new CustomEvent('remove-a11y-menu-button-item', {
        bubbles: true,
        composed: true,
        detail: extra,
      }),
    )
    // the handler re-adds the removed item instead of removing it
    expect(el.menuItems.length).to.equal(before + 1)
    expect(
      el.menuItems.filter((i) => i === extra).length,
    ).to.equal(2)
  })

  // BUG: a11y-menu-button.js:279-280 — the menu ul wires @mousover and
  // @mousout (misspelled event names, so real mouseover/mouseout events
  // never fire them) and the handlers write to this.hover, an undeclared
  // property, instead of the hovered property used by close(). Documents
  // the misspelling for the fix swarm.
  it('only the misspelled mousover event is wired on the menu list', async () => {
    el.open()
    await el.updateComplete
    const list = el.shadowRoot.querySelector('#menu')
    list.dispatchEvent(new Event('mousover'))
    expect(el.hover).to.equal(true)
    // hovered, the property close() actually consults, stays untouched
    expect(el.hovered).to.equal(undefined)
    list.dispatchEvent(new Event('mousout'))
    expect(el.hover).to.equal(false)
    // the correctly spelled event never reaches the handler
    list.dispatchEvent(new Event('mouseover'))
    expect(el.hover).to.equal(false)
    el.close(true)
  })

  it('renders the templates with slots for button and items', async () => {
    const button = el.shadowRoot.querySelector('#menubutton')
    expect(button === null).to.equal(false)
    expect(button.getAttribute('aria-haspopup')).to.equal('true')
    const list = el.shadowRoot.querySelector('#menu')
    expect(list === null).to.equal(false)
    expect(list.hasAttribute('hidden')).to.equal(true)
    el.open()
    await el.updateComplete
    expect(list.hasAttribute('hidden')).to.equal(false)
  })
})
