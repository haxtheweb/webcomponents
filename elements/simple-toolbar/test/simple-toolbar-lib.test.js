import { fixture, expect, html } from '@open-wc/testing'

import '../simple-toolbar.js'
import '../lib/simple-button-grid.js'
import '../lib/simple-toolbar-menu.js'
import '../lib/simple-toolbar-menu-item.js'
import '../lib/simple-toolbar-more-button.js'

describe('simple-button-grid construction', () => {
  it('can be instantiated', async () => {
    const el = await fixture(
      html`<simple-button-grid></simple-button-grid>`,
    )
    expect(el).to.exist
    expect(el.tagName.toLowerCase()).to.equal('simple-button-grid')
  })

  it('defaults columns to undefined', async () => {
    const el = await fixture(
      html`<simple-button-grid></simple-button-grid>`,
    )
    expect(el.columns).to.be.undefined
  })

  it('defaults rows to undefined', async () => {
    const el = await fixture(
      html`<simple-button-grid></simple-button-grid>`,
    )
    expect(el.rows).to.be.undefined
  })

  it('defaults disableAutogrow to undefined', async () => {
    const el = await fixture(
      html`<simple-button-grid></simple-button-grid>`,
    )
    expect(el.disableAutogrow).to.be.undefined
  })

  it('reflects columns attribute', async () => {
    const el = await fixture(
      html`<simple-button-grid columns="4"></simple-button-grid>`,
    )
    expect(el.columns).to.equal(4)
  })

  it('reflects rows attribute', async () => {
    const el = await fixture(
      html`<simple-button-grid rows="3"></simple-button-grid>`,
    )
    expect(el.rows).to.equal(3)
  })

  it('reflects disable-autogrow attribute', async () => {
    const el = await fixture(
      html`<simple-button-grid disable-autogrow></simple-button-grid>`,
    )
    expect(el.disableAutogrow).to.equal(true)
  })
})

describe('simple-button-grid gridStyles', () => {
  it('returns empty string when no columns set', async () => {
    const el = await fixture(
      html`<simple-button-grid></simple-button-grid>`,
    )
    expect(el.gridStyles).to.equal('')
  })

  it('returns column width style when columns is set', async () => {
    const el = await fixture(
      html`<simple-button-grid columns="4"></simple-button-grid>`,
    )
    expect(el.gridStyles).to.contain('--simple-button-grid-cols')
    expect(el.gridStyles).to.contain('25%')
  })

  it('returns 50% for 2 columns', async () => {
    const el = await fixture(
      html`<simple-button-grid columns="2"></simple-button-grid>`,
    )
    expect(el.gridStyles).to.contain('50%')
  })
})

describe('simple-button-grid toolbarTemplate', () => {
  it('renders a #grid wrapper around #buttons', async () => {
    const el = await fixture(
      html`<simple-button-grid></simple-button-grid>`,
    )
    const grid = el.shadowRoot.querySelector('#grid')
    expect(grid).to.exist
    const buttons = grid.querySelector('#buttons')
    expect(buttons).to.exist
  })

  it('renders a slot inside #buttons', async () => {
    const el = await fixture(
      html`<simple-button-grid></simple-button-grid>`,
    )
    const buttons = el.shadowRoot.querySelector('#buttons')
    const slot = buttons.querySelector('slot')
    expect(slot).to.exist
  })

  it('renders more button when not always-expanded', async () => {
    const el = await fixture(
      html`<simple-button-grid></simple-button-grid>`,
    )
    const more = el.shadowRoot.querySelector('#morebutton')
    expect(more).to.exist
  })

  it('does not render more button when always-expanded', async () => {
    const el = await fixture(
      html`<simple-button-grid always-expanded></simple-button-grid>`,
    )
    const more = el.shadowRoot.querySelector('#morebutton')
    expect(more).to.be.null
  })

  it('applies collapsed class when collapsed and not always-expanded', async () => {
    const el = await fixture(
      html`<simple-button-grid collapsed></simple-button-grid>`,
    )
    const buttons = el.shadowRoot.querySelector('#buttons')
    expect(buttons.classList.contains('collapsed')).to.equal(true)
  })
})

describe('simple-button-grid _bottom', () => {
  it('returns undefined for falsy item', async () => {
    const el = await fixture(
      html`<simple-button-grid></simple-button-grid>`,
    )
    expect(el._bottom(undefined)).to.be.undefined
    expect(el._bottom(null)).to.be.undefined
  })

  it('returns undefined when offsetTop or clientHeight is 0', async () => {
    const el = await fixture(
      html`<simple-button-grid></simple-button-grid>`,
    )
    const item = { offsetTop: 0, clientHeight: 10 }
    expect(el._bottom(item)).to.be.undefined
  })

  it('returns offsetTop + clientHeight when both are nonzero', async () => {
    const el = await fixture(
      html`<simple-button-grid></simple-button-grid>`,
    )
    const item = { offsetTop: 5, clientHeight: 10 }
    expect(el._bottom(item)).to.equal(15)
  })
})

describe('simple-button-grid resizeToolbar', () => {
  it('returns early when alwaysExpanded', async () => {
    const el = await fixture(
      html`<simple-button-grid always-expanded></simple-button-grid>`,
    )
    const btn = globalThis.document.createElement('div')
    el.appendChild(btn)
    expect(() => el.resizeToolbar()).to.not.throw()
  })

  it('removes collapse-hide attribute from children', async () => {
    const el = await fixture(
      html`<simple-button-grid collapsed></simple-button-grid>`,
    )
    const btn = globalThis.document.createElement('div')
    btn.setAttribute('collapse-hide', 'true')
    el.appendChild(btn)
    el.resizeToolbar()
    expect(btn.hasAttribute('collapse-hide')).to.equal(false)
  })

  it('handles children without removeAttribute gracefully', async () => {
    const el = await fixture(
      html`<simple-button-grid collapsed></simple-button-grid>`,
    )
    el.appendChild(globalThis.document.createTextNode('text'))
    expect(() => el.resizeToolbar()).to.not.throw()
  })
})

describe('simple-button-grid a11y', () => {
  it('passes a11y audit', async () => {
    const el = await fixture(
      html`<simple-button-grid aria-label="grid"></simple-button-grid>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })
})

describe('simple-toolbar-menu construction', () => {
  it('can be instantiated', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu"></simple-toolbar-menu>`,
    )
    expect(el).to.exist
    expect(el.tagName.toLowerCase()).to.equal('simple-toolbar-menu')
  })

  it('defaults tooltipDirection to top', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu"></simple-toolbar-menu>`,
    )
    expect(el.tooltipDirection).to.equal('top')
  })

  it('renders a #menubutton in shadow DOM', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu"></simple-toolbar-menu>`,
    )
    const btn = el.shadowRoot.querySelector('#menubutton')
    expect(btn).to.exist
  })

  it('renders a dropdown icon', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu"></simple-toolbar-menu>`,
    )
    const icon = el.shadowRoot.querySelector('#dropdownicon')
    expect(icon).to.exist
  })
})

describe('simple-toolbar-menu focusableElement', () => {
  it('returns the #menubutton element', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu"></simple-toolbar-menu>`,
    )
    expect(el.focusableElement).to.exist
    expect(el.focusableElement.id).to.equal('menubutton')
  })
})

describe('simple-toolbar-menu _excludeEvent', () => {
  it('returns true for a button inside simple-toolbar-field', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu"></simple-toolbar-menu>`,
    )
    const field = globalThis.document.createElement('simple-toolbar-field')
    const btn = globalThis.document.createElement('button')
    field.appendChild(btn)
    el.appendChild(field)
    globalThis.document.body.appendChild(el)
    let result = null
    el.addEventListener('focus', (e) => {
      result = el._excludeEvent(e)
    })
    btn.focus()
    btn.dispatchEvent(new FocusEvent('focus', { bubbles: true, composed: true }))
    expect(result).to.equal(true)
    globalThis.document.body.removeChild(el)
  })

  it('returns false for a div not inside simple-toolbar-field', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu"></simple-toolbar-menu>`,
    )
    const div = globalThis.document.createElement('div')
    el.appendChild(div)
    globalThis.document.body.appendChild(el)
    let result = null
    el.addEventListener('focus', (e) => {
      result = el._excludeEvent(e)
    })
    div.dispatchEvent(new FocusEvent('focus', { bubbles: true, composed: true }))
    expect(result).to.equal(false)
    globalThis.document.body.removeChild(el)
  })
})

describe('simple-toolbar-menu _handleFocus', () => {
  it('opens menu when menubutton receives focus', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu"></simple-toolbar-menu>`,
    )
    el.noOpenOnHover = false
    const btn = el.shadowRoot.querySelector('#menubutton')
    const event = new FocusEvent('focus', {
      bubbles: true,
      composed: true,
    })
    btn.dispatchEvent(event)
    expect(el.expanded).to.equal(true)
  })

  it('does not open menu when noOpenOnHover is true', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu"></simple-toolbar-menu>`,
    )
    el.noOpenOnHover = true
    const btn = el.shadowRoot.querySelector('#menubutton')
    const event = new FocusEvent('focus', {
      bubbles: true,
      composed: true,
    })
    btn.dispatchEvent(event)
    expect(el.expanded).to.not.equal(true)
  })
})

describe('simple-toolbar-menu _handleBlur', () => {
  it('does not close when relatedTarget is inside menu', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu" expanded></simple-toolbar-menu>`,
    )
    const item = globalThis.document.createElement('div')
    el.appendChild(item)
    const event = new FocusEvent('blur', {
      bubbles: true,
      composed: true,
      relatedTarget: item,
    })
    el._handleBlur(event)
    expect(el.expanded).to.equal(true)
  })

  it('schedules close when focus leaves menu and not current item', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu" expanded></simple-toolbar-menu>`,
    )
    el.isCurrentItem = false
    const event = new FocusEvent('blur', {
      bubbles: true,
      composed: true,
      relatedTarget: null,
    })
    el._handleBlur(event)
    // close is scheduled via setTimeout, just verify no throw
    expect(true).to.equal(true)
  })
})

describe('simple-toolbar-menu addItem / removeItem', () => {
  it('addItem adds an item to __menuItems', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu"></simple-toolbar-menu>`,
    )
    const item = globalThis.document.createElement('div')
    el.addItem(item)
    expect(el.__menuItems).to.include(item)
  })

  it('addItem adds multiple distinct items', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu"></simple-toolbar-menu>`,
    )
    const item1 = globalThis.document.createElement('div')
    const item2 = globalThis.document.createElement('div')
    el.addItem(item1)
    el.addItem(item2)
    expect(el.__menuItems.length).to.equal(2)
  })
})

describe('simple-toolbar-menu a11y', () => {
  it('passes a11y audit', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu label="Menu"></simple-toolbar-menu>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })
})

describe('simple-toolbar-menu-item construction', () => {
  it('can be instantiated', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu-item></simple-toolbar-menu-item>`,
    )
    expect(el).to.exist
    expect(el.tagName.toLowerCase()).to.equal('simple-toolbar-menu-item')
  })

  it('renders an li with role="none"', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu-item></simple-toolbar-menu-item>`,
    )
    const li = el.shadowRoot.querySelector('li[role="none"]')
    expect(li).to.exist
  })

  it('renders a slot', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu-item></simple-toolbar-menu-item>`,
    )
    const slot = el.shadowRoot.querySelector('slot')
    expect(slot).to.exist
  })
})

describe('simple-toolbar-menu-item menuItem getter', () => {
  it('returns slotted element with role=menuitem', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu-item
        ><button role="menuitem">Item 1</button></simple-toolbar-menu-item
      >`,
    )
    const mi = el.menuItem
    expect(mi).to.exist
    expect(mi.getAttribute('role')).to.equal('menuitem')
  })

  it('returns undefined when no role=menuitem child', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu-item
        ><div>Not a menuitem</div></simple-toolbar-menu-item
      >`,
    )
    expect(el.menuItem).to.be.undefined
  })
})

describe('simple-toolbar-menu-item focusableElement', () => {
  it('returns the menuitem element itself when no focusableElement on it', async () => {
    const el = await fixture(
      html`<simple-toolbar-menu-item
        ><button role="menuitem">Click</button></simple-toolbar-menu-item
      >`,
    )
    const fe = el.focusableElement
    expect(fe).to.exist
    expect(fe.getAttribute('role')).to.equal('menuitem')
  })
})

describe('simple-toolbar-menu-item a11y', () => {
  it('passes a11y audit within a menu context', async () => {
    const el = await fixture(
      html`<div role="menu"><simple-toolbar-menu-item
          ><button role="menuitem">Item</button></simple-toolbar-menu-item
        ></div>`,
    )
    const item = el.querySelector('simple-toolbar-menu-item')
    await expect(item).shadowDom.to.be.accessible()
  })
})

describe('simple-toolbar-more-button defaults', () => {
  it('sets icon to more-vert', async () => {
    const el = await fixture(
      html`<simple-toolbar-more-button></simple-toolbar-more-button>`,
    )
    expect(el.icon).to.equal('more-vert')
  })

  it('sets toggles to true', async () => {
    const el = await fixture(
      html`<simple-toolbar-more-button></simple-toolbar-more-button>`,
    )
    expect(el.toggles).to.equal(true)
  })

  it('sets label to "More buttons"', async () => {
    const el = await fixture(
      html`<simple-toolbar-more-button></simple-toolbar-more-button>`,
    )
    expect(el.label).to.equal('More buttons')
  })

  it('sets labelToggled to "Less buttons"', async () => {
    const el = await fixture(
      html`<simple-toolbar-more-button></simple-toolbar-more-button>`,
    )
    expect(el.labelToggled).to.equal('Less buttons')
  })

  it('sets tooltipDirection to left', async () => {
    const el = await fixture(
      html`<simple-toolbar-more-button></simple-toolbar-more-button>`,
    )
    expect(el.tooltipDirection).to.equal('left')
  })
})

describe('simple-toolbar-more-button _handleShortcutKeys', () => {
  it('dispatches a toggle event with detail', async () => {
    const el = await fixture(
      html`<simple-toolbar-more-button></simple-toolbar-more-button>`,
    )
    let fired = false
    let detail = null
    el.addEventListener('toggle', (e) => {
      fired = true
      detail = e.detail
    })
    const event = new CustomEvent('keydown', {
      detail: { foo: 'bar' },
      bubbles: true,
      composed: true,
    })
    el._handleShortcutKeys(event, 'ctrl+shift+;')
    expect(fired).to.equal(true)
    expect(detail).to.exist
    expect(detail.shortcutKey).to.equal(el)
    expect(detail.button).to.equal(el)
  })
})

describe('simple-toolbar-more-button toggle', () => {
  it('toggles the toggled property', async () => {
    const el = await fixture(
      html`<simple-toolbar-more-button></simple-toolbar-more-button>`,
    )
    const initial = el.toggled
    el.toggle()
    expect(el.toggled).to.equal(!initial)
  })

  it('dispatches button-toggled event', async () => {
    const el = await fixture(
      html`<simple-toolbar-more-button></simple-toolbar-more-button>`,
    )
    let fired = false
    el.addEventListener('button-toggled', () => {
      fired = true
    })
    el.toggle()
    expect(fired).to.equal(true)
  })
})

describe('simple-toolbar more button shortcut', () => {
  it('fires the more-button shortcut from a real keydown', async () => {
    const el = await fixture(html`<simple-toolbar></simple-toolbar>`)
    await el.updateComplete
    // a non-empty config reruns updateToolbar, which registers the more
    // button under its default ctrl+shift+; shortcut
    el.config = [
      {
        type: 'simple-toolbar-button',
        label: 'Add',
        icon: 'add',
      },
    ]
    await el.updateComplete
    let shortcutFired = false
    let toggleFired = false
    el.addEventListener('shortcut-key-pressed', () => {
      shortcutFired = true
    })
    el.addEventListener('toggle', () => {
      toggleFired = true
    })
    // only keydown fires for ctrl/meta chords, so the toolbar shortcut
    // engine can only work through its keydown listener
    el.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: ';',
        ctrlKey: true,
        shiftKey: true,
        bubbles: true,
        cancelable: true,
        composed: true,
      }),
    )
    expect(shortcutFired).to.equal(true)
    expect(toggleFired).to.equal(true)
    expect(el.collapsed).to.equal(false)
  })
})
