import { fixture, expect, html } from '@open-wc/testing'

import '../lib/simple-toolbar-button-group.js'

describe('simple-toolbar-button-group construction', () => {
  it('can be instantiated', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group></simple-toolbar-button-group>`,
    )
    expect(el).to.exist
    expect(el.tagName.toLowerCase()).to.equal('simple-toolbar-button-group')
  })

  it('sets role="radiogroup" in constructor', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group></simple-toolbar-button-group>`,
    )
    expect(el.getAttribute('role')).to.equal('radiogroup')
  })

  it('adds "group" class in constructor', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group></simple-toolbar-button-group>`,
    )
    expect(el.classList.contains('group')).to.equal(true)
  })

  it('renders a slot', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group></simple-toolbar-button-group>`,
    )
    const slot = el.shadowRoot.querySelector('slot')
    expect(slot).to.exist
  })
})

describe('simple-toolbar-button-group getters', () => {
  it('__allowNull returns true when not required', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group></simple-toolbar-button-group>`,
    )
    expect(el.__allowNull).to.equal(true)
  })

  it('__allowNull returns false when required', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group required></simple-toolbar-button-group>`,
    )
    expect(el.__allowNull).to.equal(false)
  })

  it('__query returns "*[radio]:not([hidden])"', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group></simple-toolbar-button-group>`,
    )
    expect(el.__query).to.equal('*[radio]:not([hidden])')
  })

  it('__selected returns "toggled"', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group></simple-toolbar-button-group>`,
    )
    expect(el.__selected).to.equal('toggled')
  })
})

describe('simple-toolbar-button-group required property', () => {
  it('reflects required attribute', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group required></simple-toolbar-button-group>`,
    )
    expect(el.required).to.equal(true)
    expect(el.hasAttribute('required')).to.equal(true)
  })

  it('defaults to not required', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group></simple-toolbar-button-group>`,
    )
 expect(el.required).to.not.equal(true)
  })
})

describe('simple-toolbar-button-group connectedCallback', () => {
  it('generates UUID for radio children without id', async () => {
    const container = globalThis.document.createElement('div')
    container.innerHTML = `
      <simple-toolbar-button-group>
        <div radio></div>
        <div radio></div>
      </simple-toolbar-button-group>
    `
    const group = container.querySelector('simple-toolbar-button-group')
    globalThis.document.body.appendChild(container)
    await group.updateComplete
    const radioItems = group.querySelectorAll('*[radio]')
    expect(radioItems[0].id).to.not.equal('')
    expect(radioItems[1].id).to.not.equal('')
    expect(radioItems[0].id).to.not.equal(radioItems[1].id)
    globalThis.document.body.removeChild(container)
  })

  it('preserves existing ids on radio children', async () => {
    const container = globalThis.document.createElement('div')
    container.innerHTML = `
      <simple-toolbar-button-group>
        <div radio id="my-id"></div>
      </simple-toolbar-button-group>
    `
    const group = container.querySelector('simple-toolbar-button-group')
    globalThis.document.body.appendChild(container)
    await group.updateComplete
    const radioItem = group.querySelector('*[radio]')
    expect(radioItem.id).to.equal('my-id')
    globalThis.document.body.removeChild(container)
  })
})

describe('simple-toolbar-button-group _handleToggle', () => {
  it('selects item when isToggled is true', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group>
        <div radio id="item-a"></div>
        <div radio id="item-b"></div>
      </simple-toolbar-button-group>`,
    )
    await el.updateComplete
    const toggleEvent = new CustomEvent('button-toggled', {
      bubbles: true,
      composed: true,
      detail: { isToggled: true, id: 'item-b' },
    })
    el._handleToggle(toggleEvent)
    expect(el.selection).to.equal('item-b')
  })

  it('deselects when isToggled is false', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group>
        <div radio id="item-a"></div>
        <div radio id="item-b"></div>
      </simple-toolbar-button-group>`,
    )
    await el.updateComplete
    // First select an item
    el.selectItem('item-a')
    expect(el.selection).to.equal('item-a')
    // Then toggle it off
    const toggleEvent = new CustomEvent('button-toggled', {
      bubbles: true,
      composed: true,
      detail: { isToggled: false, id: 'item-a' },
    })
    el._handleToggle(toggleEvent)
    // Since __allowNull is true (not required), selection should be undefined
    expect(el.selection).to.be.undefined
  })
})

describe('simple-toolbar-button-group selection', () => {
  it('selectItem sets selection by id', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group>
        <div radio id="opt-1"></div>
        <div radio id="opt-2"></div>
      </simple-toolbar-button-group>`,
    )
    await el.updateComplete
    el.selectItem('opt-2')
    expect(el.selection).to.equal('opt-2')
  })

  it('selectItem sets "toggled" attribute on selected item', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group>
        <div radio id="opt-1"></div>
        <div radio id="opt-2"></div>
      </simple-toolbar-button-group>`,
    )
    await el.updateComplete
    el.selectItem('opt-1')
    const opt1 = el.querySelector('#opt-1')
    expect(opt1.hasAttribute('toggled')).to.equal(true)
  })

  it('selectItem removes "toggled" from non-selected items', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group>
        <div radio id="opt-1"></div>
        <div radio id="opt-2"></div>
      </simple-toolbar-button-group>`,
    )
    await el.updateComplete
    el.selectItem('opt-1')
    el.selectItem('opt-2')
    const opt1 = el.querySelector('#opt-1')
    expect(opt1.hasAttribute('toggled')).to.equal(false)
  })

  it('dispatches selection-changed event on selection change', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group>
        <div radio id="opt-1"></div>
      </simple-toolbar-button-group>`,
    )
    await el.updateComplete
    let fired = false
    el.addEventListener('selection-changed', () => {
      fired = true
    })
    el.selectItem('opt-1')
    expect(fired).to.equal(true)
  })

  it('allows null selection when not required', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group>
        <div radio id="opt-1"></div>
      </simple-toolbar-button-group>`,
    )
    await el.updateComplete
    el.selectItem('opt-1')
    expect(el.selection).to.equal('opt-1')
    el.selectItem(undefined)
    expect(el.selection).to.be.undefined
  })

  it('selects first item when required and no selection', async () => {
    const container = globalThis.document.createElement('div')
    container.innerHTML = `
      <simple-toolbar-button-group required>
        <div radio id="req-1"></div>
        <div radio id="req-2"></div>
      </simple-toolbar-button-group>
    `
    const group = container.querySelector('simple-toolbar-button-group')
    globalThis.document.body.appendChild(container)
    await group.updateComplete
    expect(group.selection).to.equal('req-1')
    globalThis.document.body.removeChild(container)
  })
})

describe('simple-toolbar-button-group itemData', () => {
  it('populates itemData from slotted radio children', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group>
        <div radio id="d-1"></div>
        <div radio id="d-2"></div>
      </simple-toolbar-button-group>`,
    )
    await el.updateComplete
    expect(el.itemData.length).to.equal(2)
    expect(el.itemData[0].id).to.equal('d-1')
    expect(el.itemData[1].id).to.equal('d-2')
  })

  it('selectedIndex returns index of selected item', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group>
        <div radio id="d-1"></div>
        <div radio id="d-2"></div>
      </simple-toolbar-button-group>`,
    )
    await el.updateComplete
    el.selectItem('d-2')
    expect(el.selectedIndex).to.equal(1)
  })
})

describe('simple-toolbar-button-group a11y', () => {
  it('passes a11y audit', async () => {
    const el = await fixture(
      html`<simple-toolbar-button-group></simple-toolbar-button-group>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })
})
