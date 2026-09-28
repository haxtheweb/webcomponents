import { fixture, expect, html } from '@open-wc/testing'

import '../simple-toolbar.js'

describe('simple-toolbar test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <simple-toolbar title="test-title"></simple-toolbar>
    `)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

describe('simple-toolbar rendering', () => {
  it('renders a #buttons container with a slot', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const buttonsDiv = el.shadowRoot.querySelector('#buttons')
    expect(buttonsDiv).to.exist
    const slot = buttonsDiv.querySelector('slot')
    expect(slot).to.exist
  })

  it('sets role="toolbar" and aria-live="polite" after first update', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    expect(el.getAttribute('role')).to.equal('toolbar')
    expect(el.getAttribute('aria-live')).to.equal('polite')
  })

  it('defaults to collapsed=true', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    expect(el.collapsed).to.equal(true)
    expect(el.hasAttribute('collapsed')).to.equal(true)
  })

  it('defaults to sticky=false', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    expect(el.sticky).to.equal(false)
  })

  it('reflects aria-label attribute', async () => {
    const el = await fixture(
      html`<simple-toolbar aria-label="my toolbar"></simple-toolbar>`,
    )
    expect(el.getAttribute('aria-label')).to.equal('my toolbar')
  })

  it('reflects aria-controls attribute', async () => {
    const el = await fixture(
      html`<simple-toolbar aria-controls="editor"></simple-toolbar>`,
    )
    expect(el.getAttribute('aria-controls')).to.equal('editor')
  })
})

describe('simple-toolbar more button', () => {
  it('renders a more button when not always-expanded', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const moreButton = el.shadowRoot.querySelector('#morebutton')
    expect(moreButton).to.exist
  })

  it('does not render a more button when always-expanded', async () => {
    const el = await fixture(
      html`<simple-toolbar always-expanded></simple-toolbar>`,
    )
    const moreButton = el.shadowRoot.querySelector('#morebutton')
    expect(moreButton).to.be.null
  })

  it('toggles collapsed when more button dispatches toggle event', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const initiallyCollapsed = el.collapsed
    const moreButton = el.shadowRoot.querySelector('#morebutton')
    moreButton.dispatchEvent(
      new CustomEvent('toggle', { bubbles: true, composed: true }),
    )
    expect(el.collapsed).to.equal(!initiallyCollapsed)
  })

  it('toggles collapsed when more button dispatches click event', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const initiallyCollapsed = el.collapsed
    const moreButton = el.shadowRoot.querySelector('#morebutton')
    moreButton.dispatchEvent(
      new MouseEvent('click', { bubbles: true, composed: true }),
    )
    expect(el.collapsed).to.equal(!initiallyCollapsed)
  })
})

describe('simple-toolbar collapsed state', () => {
  it('applies "collapsed" class to #buttons when collapsed and not always-expanded', async () => {
    const el = await fixture(html`<simple-toolbar collapsed></simple-toolbar>`)
    const buttonsDiv = el.shadowRoot.querySelector('#buttons')
    expect(buttonsDiv.classList.contains('collapsed')).to.equal(true)
  })

  it('does not apply "collapsed" class when always-expanded', async () => {
    const el = await fixture(
      html`<simple-toolbar collapsed always-expanded></simple-toolbar>`,
    )
    const buttonsDiv = el.shadowRoot.querySelector('#buttons')
    expect(buttonsDiv.classList.contains('collapsed')).to.equal(false)
  })

  it('does not apply "collapsed" class when not collapsed', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el.collapsed = false
    await el.updateComplete
    const buttonsDiv = el.shadowRoot.querySelector('#buttons')
    expect(buttonsDiv.classList.contains('collapsed')).to.equal(false)
  })
})

describe('simple-toolbar button registration', () => {
  // NOTE: the shadow-DOM <simple-toolbar-more-button> auto-registers itself
  // via a composed "register-button" event, so el.buttons always includes it.

  it('registers a button via registerButton()', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const btn = globalThis.document.createElement('div')
    btn.id = 'test-btn-1'
    btn.shortcutKeys = 'ctrl+b'
    el.registerButton(btn)
    expect(el.buttons).to.include(btn)
    expect(el.shortcutKeys['ctrl+b']).to.equal(btn)
  })

  it('deduplicates buttons on register', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const btn = globalThis.document.createElement('div')
    btn.id = 'test-btn-dedup'
    el.registerButton(btn)
    el.registerButton(btn)
    const count = el.buttons.filter((b) => b === btn).length
    expect(count).to.equal(1)
  })

  it('deregisters a button', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const btn = globalThis.document.createElement('div')
    btn.id = 'test-btn-dereg'
    btn.shortcutKeys = 'ctrl+b'
    el.registerButton(btn)
    el.deregisterButton(btn)
    expect(el.buttons).to.not.include(btn)
    expect(el.shortcutKeys['ctrl+b']).to.be.undefined
  })

  it('updateButton deregisters then re-registers', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const btn = globalThis.document.createElement('div')
    btn.id = 'test-btn-update'
    btn.shortcutKeys = 'ctrl+c'
    el.registerButton(btn)
    btn.shortcutKeys = 'ctrl+d'
    el.updateButton(btn)
    expect(el.buttons).to.include(btn)
    expect(el.shortcutKeys['ctrl+d']).to.equal(btn)
  })

  it('handles deregister of unregistered button without error', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const btn = globalThis.document.createElement('div')
    btn.shortcutKeys = ''
    expect(() => el.deregisterButton(btn)).to.not.throw()
  })

  it('sets isCurrentItem=false for non-menuitem buttons on register', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const btn = globalThis.document.createElement('div')
    btn.id = 'test-btn-role'
    btn.role = 'button'
    el.registerButton(btn)
    expect(btn.isCurrentItem).to.equal(false)
  })
})

describe('simple-toolbar _handleButtonRegister event', () => {
  it('handles register-button event and resizes', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const btn = globalThis.document.createElement('div')
    btn.id = 'evt-btn-reg'
    btn.shortcutKeys = 'ctrl+r'
    el.dispatchEvent(
      new CustomEvent('register-button', {
        bubbles: true,
        composed: true,
        detail: btn,
      }),
    )
    expect(el.buttons).to.include(btn)
  })

  it('handles deregister-button event', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const btn = globalThis.document.createElement('div')
    btn.id = 'evt-btn-dereg'
    btn.shortcutKeys = ''
    el.registerButton(btn)
    el.dispatchEvent(
      new CustomEvent('deregister-button', {
        bubbles: true,
        composed: true,
        detail: btn,
      }),
    )
    expect(el.buttons).to.not.include(btn)
  })

  it('handles update-button-registry event', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const btn = globalThis.document.createElement('div')
    btn.id = 'evt-btn-update'
    btn.shortcutKeys = 'ctrl+u'
    el.registerButton(btn)
    btn.shortcutKeys = 'ctrl+x'
    el.dispatchEvent(
      new CustomEvent('update-button-registry', {
        bubbles: true,
        composed: true,
        detail: btn,
      }),
    )
    expect(el.shortcutKeys['ctrl+x']).to.equal(btn)
  })
})

describe('simple-toolbar navigation', () => {
  let el, btnA, btnB, btnC
  beforeEach(async () => {
    el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    btnA = globalThis.document.createElement('div')
    btnA.id = 'nav-a'
    btnA.role = 'button'
    btnB = globalThis.document.createElement('div')
    btnB.id = 'nav-b'
    btnB.role = 'button'
    btnC = globalThis.document.createElement('div')
    btnC.id = 'nav-c'
    btnC.role = 'button'
    el.registerButton(btnA)
    el.registerButton(btnB)
    el.registerButton(btnC)
  })

  it('mainItems excludes menuitem buttons', () => {
    const menuItem = globalThis.document.createElement('div')
    menuItem.id = 'nav-menu'
    menuItem.role = 'menuitem'
    el.registerButton(menuItem)
    const myMain = el.mainItems.filter(
      (b) => b.id && b.id.startsWith('nav-'),
    )
    expect(myMain).to.not.include(menuItem)
    expect(myMain.length).to.equal(3)
  })

  it('firstItem is a registered button', () => {
    expect(el.firstItem).to.exist
  })

  it('lastItem is a registered button', () => {
    expect(el.lastItem).to.exist
  })

  it('getItemIndex returns correct index for a given item', () => {
    expect(el.getItemIndex(btnB)).to.be.greaterThan(-1)
  })

  it('getItemIndex returns -1 for unregistered item', () => {
    const outsider = globalThis.document.createElement('div')
    expect(el.getItemIndex(outsider)).to.equal(-1)
  })

  it('getItem with offset returns a button or undefined', () => {
    el.setCurrentItem(btnA)
    const next = el.getItem(1)
    expect(next === undefined || next.id.startsWith('nav-')).to.equal(true)
  })

  it('getItem with offset -1 returns a button or undefined', () => {
    el.setCurrentItem(btnC)
    const prev = el.getItem(-1)
    expect(prev === undefined || prev.id.startsWith('nav-')).to.equal(true)
  })

  it('nextItem and previousItem getters work', () => {
    el.setCurrentItem(btnB)
    const next = el.nextItem
    const prev = el.previousItem
    expect(next === undefined || next.id.startsWith('nav-')).to.equal(true)
    expect(prev === undefined || prev.id.startsWith('nav-')).to.equal(true)
  })

  it('setCurrentItem sets isCurrentItem on new and removes from old', () => {
    el.setCurrentItem(btnA)
    expect(btnA.isCurrentItem).to.equal(true)
    el.setCurrentItem(btnB)
    expect(btnA.isCurrentItem).to.equal(false)
    expect(btnB.isCurrentItem).to.equal(true)
  })

  it('setCurrentItem with null/undefined clears current item', () => {
    el.setCurrentItem(btnA)
    el.setCurrentItem(undefined)
    expect(btnA.isCurrentItem).to.equal(false)
  })

  it('setCurrentItem uncollapses if item is in a collapse-hide container', () => {
    el.collapsed = true
    const wrapper = globalThis.document.createElement('div')
    wrapper.setAttribute('collapse-hide', 'true')
    wrapper.appendChild(btnB)
    el.appendChild(wrapper)
    el.setCurrentItem(btnB)
    expect(el.collapsed).to.equal(false)
  })

  it('focusOn does not throw for a valid item', () => {
    btnA.focus = () => {}
    el.setCurrentItem(btnA)
    expect(() => el.focusOn(btnA)).to.not.throw()
  })

  it('focusOn with delay does not throw for collapse-hide item', () => {
    const wrapper = globalThis.document.createElement('div')
    wrapper.setAttribute('collapse-hide', 'true')
    btnB.focus = () => {}
    wrapper.appendChild(btnB)
    el.appendChild(wrapper)
    el.setCurrentItem(btnB)
    expect(() => el.focusOn(btnB)).to.not.throw()
  })
})

describe('simple-toolbar clearToolbar', () => {
  it('clears innerHTML and buttons array', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const btn = globalThis.document.createElement('div')
    btn.id = 'clear-btn'
    btn.shortcutKeys = 'ctrl+k'
    el.registerButton(btn)
    el.appendChild(btn)
    el.clearToolbar()
    expect(el.buttons.length).to.equal(0)
    expect(el.innerHTML).to.equal('')
  })

  it('resets shortcutKeys but keeps default shortcut', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const btn = globalThis.document.createElement('div')
    btn.id = 'clear-btn2'
    btn.shortcutKeys = 'ctrl+k'
    el.registerButton(btn)
    el.clearToolbar()
    expect(el.shortcutKeys['ctrl+k']).to.be.undefined
    expect(el.shortcutKeys[el.shortcut]).to.not.be.undefined
  })
})

describe('simple-toolbar config-driven layout', () => {
  it('addButton creates and appends a button element', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const config = { type: 'div', label: 'test' }
    const btn = el.addButton(config)
    expect(btn).to.exist
    expect(el.children.length).to.be.greaterThan(0)
  })

  it('addButton appends to specified parent', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const parent = globalThis.document.createElement('div')
    el.appendChild(parent)
    const config = { type: 'div' }
    const btn = el.addButton(config, parent)
    expect(parent.children[0]).to.equal(btn)
  })

  it('addButtonGroup returns undefined when no buttons', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const result = el.addButtonGroup({ type: 'div' })
    expect(result).to.be.undefined
  })

  it('addButtonGroup returns undefined when buttons array is empty', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const result = el.addButtonGroup({ type: 'div', buttons: [] })
    expect(result).to.be.undefined
  })

  it('addButtonGroup creates a div group with class "group"', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const group = el.addButtonGroup({
      type: 'button-group',
      buttons: [{ type: 'div' }],
    })
    expect(group).to.exist
    expect(group.classList.contains('group')).to.equal(true)
  })

  it('_renderButton creates element of config.type and sets properties', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const config = { type: 'div', label: 'my-label' }
    const btn = el._renderButton(config)
    expect(btn.tagName).to.equal('DIV')
    expect(btn.label).to.equal('my-label')
  })

  it('_renderButtonGroup creates a div for type "button-group"', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const group = el._renderButtonGroup({ type: 'button-group' })
    expect(group.tagName).to.equal('DIV')
    expect(group.getAttribute('class')).to.equal('group')
  })

  it('_renderButtonGroup creates a div for unknown group types', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const group = el._renderButtonGroup({ type: 'something-else' })
    expect(group.tagName).to.equal('DIV')
  })

  it('updateToolbar does nothing with empty config', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el.config = []
    el.updateToolbar()
    const added = [...el.children].filter(
      (c) => c.tagName === 'DIV' && !c.classList.contains('group'),
    )
    expect(added.length).to.equal(0)
  })

  it('updateToolbar does nothing with null config', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el.config = null
    expect(() => el.updateToolbar()).to.not.throw()
  })

  it('updateToolbar adds buttons from config', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el.config = [
      { type: 'div', label: 'btn1' },
      { type: 'div', label: 'btn2' },
    ]
    el.updateToolbar()
    expect(el.children.length).to.be.greaterThan(0)
  })

  it('updateToolbar adds button groups from config', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el.config = [
      {
        type: 'button-group',
        buttons: [{ type: 'div', label: 'g-btn1' }],
      },
    ]
    el.updateToolbar()
    expect(
      [...el.children].find((c) => c.classList.contains('group')),
    ).to.exist
  })

  it('_addConfigItems handles null items gracefully', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    expect(() => el._addConfigItems(null)).to.not.throw()
  })
})

describe('simple-toolbar resizeToolbar', () => {
  it('returns early when alwaysExpanded', async () => {
    const el = await fixture(
      html`<simple-toolbar always-expanded></simple-toolbar>`,
    )
    const btn = globalThis.document.createElement('div')
    el.appendChild(btn)
    expect(() => el.resizeToolbar()).to.not.throw()
  })

  it('returns early when not collapsed', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el.collapsed = false
    const btn = globalThis.document.createElement('div')
    el.appendChild(btn)
    expect(() => el.resizeToolbar()).to.not.throw()
  })

  it('sets collapseDisabled when all items are visible', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el.collapsed = true
    const btn = globalThis.document.createElement('div')
    el.appendChild(btn)
    el.resizeToolbar()
    expect(el.collapseDisabled).to.equal(true)
  })

  it('removes collapse-hide attribute from items', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el.collapsed = true
    const btn = globalThis.document.createElement('div')
    btn.setAttribute('collapse-hide', 'true')
    el.appendChild(btn)
    el.resizeToolbar()
    expect(btn.hasAttribute('collapse-hide')).to.equal(false)
  })

  it('handles children without removeAttribute gracefully', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el.collapsed = true
    el.appendChild(globalThis.document.createTextNode('text'))
    expect(() => el.resizeToolbar()).to.not.throw()
  })
})

describe('simple-toolbar _handleToggleToolbar', () => {
  it('toggles collapsed when no detail', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const initial = el.collapsed
    el.dispatchEvent(
      new CustomEvent('toggle-toolbar', { detail: undefined }),
    )
    expect(el.collapsed).to.equal(!initial)
  })

  it('sets collapsed to detail value when provided', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el.dispatchEvent(
      new CustomEvent('toggle-toolbar', { detail: true }),
    )
    expect(el.collapsed).to.equal(true)
  })

  it('sets collapsed to false when detail is false', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el.dispatchEvent(
      new CustomEvent('toggle-toolbar', { detail: false }),
    )
    expect(el.collapsed).to.equal(false)
  })
})

describe('simple-toolbar _handleFocusChange', () => {
  it('sets __focused=false when focus is outside toolbar', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el._handleFocusChange()
    expect(el.focused).to.equal(false)
  })

  it('sets __focused=true when focus is inside toolbar', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    const btn = globalThis.document.createElement('button')
    el.appendChild(btn)
    btn.focus()
    el._handleFocusChange()
    expect(el.focused).to.equal(true)
  })
})

describe('simple-toolbar keyCode', () => {
  it('returns key code mapping', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    expect(el.keyCode.TAB).to.equal(9)
    expect(el.keyCode.ENTER).to.equal(13)
    expect(el.keyCode.ESC).to.equal(27)
    expect(el.keyCode.SPACE).to.equal(32)
    expect(el.keyCode.LEFT).to.equal(37)
    expect(el.keyCode.UP).to.equal(38)
    expect(el.keyCode.RIGHT).to.equal(39)
    expect(el.keyCode.DOWN).to.equal(40)
    expect(el.keyCode.HOME).to.equal(36)
    expect(el.keyCode.END).to.equal(35)
  })
})

describe('simple-toolbar _handleKeydown', () => {
  let el, btnA, btnB, btnC
  beforeEach(async () => {
    el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    btnA = globalThis.document.createElement('div')
    btnA.id = 'kd-a'
    btnA.role = 'button'
    btnA.focus = () => {}
    btnB = globalThis.document.createElement('div')
    btnB.id = 'kd-b'
    btnB.role = 'button'
    btnB.focus = () => {}
    btnC = globalThis.document.createElement('div')
    btnC.id = 'kd-c'
    btnC.role = 'button'
    btnC.focus = () => {}
    el.registerButton(btnA)
    el.registerButton(btnB)
    el.registerButton(btnC)
    el.setCurrentItem(btnA)
  })

  it('navigates right: currentItem changes', () => {
    const before = el.currentItem
    const e = new KeyboardEvent('keydown', { keyCode: 39 })
    el._handleKeydown(e)
    expect(el.currentItem.id).to.not.equal(before.id)
  })

  it('navigates left: currentItem changes from last', () => {
    el.setCurrentItem(btnC)
    const before = el.currentItem
    const e = new KeyboardEvent('keydown', { keyCode: 37 })
    el._handleKeydown(e)
    expect(el.currentItem.id).to.not.equal(before.id)
  })

  it('navigates to first item with HOME', () => {
    el.setCurrentItem(btnC)
    const e = new KeyboardEvent('keydown', { keyCode: 36 })
    el._handleKeydown(e)
    expect(el.getItemIndex()).to.equal(0)
  })

  it('navigates to last item with END', () => {
    const e = new KeyboardEvent('keydown', { keyCode: 35 })
    el._handleKeydown(e)
    expect(el.getItemIndex()).to.equal(el.mainItems.length - 1)
  })

  it('does nothing for unhandled key codes', () => {
    const initial = el.currentItem
    const e = new KeyboardEvent('keydown', { keyCode: 27 })
    el._handleKeydown(e)
    expect(el.currentItem.id).to.equal(initial.id)
  })

  it('skips disabled items when navigating right', () => {
    btnB.disabled = true
    el.setCurrentItem(btnA)
    const e = new KeyboardEvent('keydown', { keyCode: 39 })
    el._handleKeydown(e)
    expect(el.currentItem.id).to.equal('kd-c')
  })

  it('skips hidden items when navigating right', () => {
    btnB.hidden = true
    el.setCurrentItem(btnA)
    const e = new KeyboardEvent('keydown', { keyCode: 39 })
    el._handleKeydown(e)
    expect(el.currentItem.id).to.equal('kd-c')
  })
})

describe('simple-toolbar _shortcutKeysMatch', () => {
  // IMPORTANT: restore shortcutKeys after each test to avoid TypeError
  // during fixture cleanup (deregisterButton iterates over shortcutKeys)
  let el
  let originalShortcutKeys
  afterEach(() => {
    if (el) {
      el.shortcutKeys = originalShortcutKeys
    }
  })

  it('returns false when no shortcutKeys defined', async () => {
    el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    originalShortcutKeys = { ...el.shortcutKeys }
    el.shortcutKeys = {}
    const e = new KeyboardEvent('keydown', { key: 'b' })
    expect(el._shortcutKeysMatch(e)).to.equal(false)
  })

  it('returns false when shortcutKeys is null', async () => {
    el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    originalShortcutKeys = { ...el.shortcutKeys }
    el.shortcutKeys = null
    const e = new KeyboardEvent('keydown', { key: 'b' })
    expect(el._shortcutKeysMatch(e)).to.equal(false)
  })

  it('matches a simple key shortcut', async () => {
    el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    originalShortcutKeys = { ...el.shortcutKeys }
    const btn = globalThis.document.createElement('div')
    el.shortcutKeys = { b: btn }
    const e = new KeyboardEvent('keydown', {
      key: 'b',
      altKey: false,
      ctrlKey: false,
      metaKey: false,
      shiftKey: false,
    })
    expect(el._shortcutKeysMatch(e)).to.equal('b')
  })

  it('matches ctrl+key shortcut', async () => {
    el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    originalShortcutKeys = { ...el.shortcutKeys }
    const btn = globalThis.document.createElement('div')
    el.shortcutKeys = { 'ctrl+b': btn }
    const e = new KeyboardEvent('keydown', {
      key: 'b',
      ctrlKey: true,
      altKey: false,
      metaKey: false,
      shiftKey: false,
    })
    expect(el._shortcutKeysMatch(e)).to.equal('ctrl+b')
  })

  it('does not match when ctrl does not match', async () => {
    el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    originalShortcutKeys = { ...el.shortcutKeys }
    const btn = globalThis.document.createElement('div')
    el.shortcutKeys = { 'ctrl+b': btn }
    const e = new KeyboardEvent('keydown', {
      key: 'b',
      ctrlKey: false,
      altKey: false,
      metaKey: false,
      shiftKey: false,
    })
    expect(el._shortcutKeysMatch(e)).to.equal(false)
  })
})

describe('simple-toolbar hidden attribute', () => {
  it('sets aria-hidden when hidden becomes true', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el.hidden = true
    await el.updateComplete
    expect(el.getAttribute('aria-hidden')).to.equal('true')
  })

  it('sets aria-hidden=false when hidden becomes false', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    el.hidden = true
    await el.updateComplete
    el.hidden = false
    await el.updateComplete
    expect(el.getAttribute('aria-hidden')).to.equal('false')
  })
})

describe('simple-toolbar button slotting', () => {
  it('slotted buttons are rendered in light DOM', async () => {
    const el = await fixture(html`
      <simple-toolbar>
        <simple-toolbar-button
          icon="add"
          label="Add"
        ></simple-toolbar-button>
      </simple-toolbar>
    `)
    const btn = el.querySelector('simple-toolbar-button')
    expect(btn).to.exist
    expect(btn.label).to.equal('Add')
  })

  it('slotted button registers with toolbar', async () => {
    const el = await fixture(html`
      <simple-toolbar>
        <simple-toolbar-button
          icon="add"
          label="Add"
        ></simple-toolbar-button>
      </simple-toolbar>
    `)
    await el.updateComplete
    expect(el.buttons.length).to.be.greaterThan(0)
  })
})
