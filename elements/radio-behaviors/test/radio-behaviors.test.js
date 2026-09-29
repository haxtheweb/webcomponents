import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import '../radio-behaviors.js'
import { LitElement } from 'lit'
import { RadioBehaviors } from '../radio-behaviors.js'

// radio-behaviors is a behavior mixin, so coverage is exercised through
// registered harness elements that adopt it the same way real consumers do.
class RadioHarness extends RadioBehaviors(LitElement) {
  static get tag() {
    return 'radio-harness'
  }
  get __query() {
    return ':scope > item'
  }
  render() {
    return html`<slot></slot>`
  }
}
globalThis.customElements.define(RadioHarness.tag, RadioHarness)

// allows no selection at all, exercising the __allowNull escape hatch
class RadioHarnessAllowNull extends RadioHarness {
  static get tag() {
    return 'radio-harness-allow-null'
  }
  get __allowNull() {
    return true
  }
}
globalThis.customElements.define(RadioHarnessAllowNull.tag, RadioHarnessAllowNull)

// no render override so the mixin's own render() output is used
class RadioHarnessBare extends RadioBehaviors(LitElement) {
  static get tag() {
    return 'radio-harness-bare'
  }
  get __query() {
    return ':scope > item'
  }
}
globalThis.customElements.define(RadioHarnessBare.tag, RadioHarnessBare)

// keeps every default hook; never connected so the default "> item" query
// can be read without tripping the broken leading-combinator selectors
class RadioHarnessDefault extends RadioBehaviors(LitElement) {
  static get tag() {
    return 'radio-harness-default'
  }
  render() {
    return html`<slot></slot>`
  }
}
globalThis.customElements.define(RadioHarnessDefault.tag, RadioHarnessDefault)

describe('radio-behaviors test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <radio-behaviors title="test-title"></radio-behaviors>
    `)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

describe('radio-behaviors getters and observer wiring', () => {
  it('exposes the conventional private hooks', async () => {
    const el = await fixture(html`<radio-harness></radio-harness>`)
    expect(el.__query).to.equal(':scope > item')
    expect(el.__selected).to.equal('selected')
    expect(el.__selectEvent).to.equal('select-item')
    expect(el.__allowNull).to.equal(false)
    expect(el.__observer).to.be.an.instanceof(globalThis.MutationObserver)
  })

  it('defaults __query to a direct-child item query', () => {
    const el = globalThis.document.createElement('radio-harness-default')
    expect(el.__query).to.equal(':scope > item')
    expect(el.__selected).to.equal('selected')
    expect(el.__selectEvent).to.equal('select-item')
    expect(el.__allowNull).to.equal(false)
    expect(el.__observer).to.be.an.instanceof(globalThis.MutationObserver)
  })

  it('renders an empty template from the mixin itself', async () => {
    const el = await fixture(html`<radio-harness-bare></radio-harness-bare>`)
    await el.updateComplete
    expect(el.shadowRoot).to.exist
    expect(el.itemData).to.deep.equal([])
  })

  it('selectedIndex is 0 when nothing matches', async () => {
    const el = await fixture(html`<radio-harness></radio-harness>`)
    expect(el.itemData).to.deep.equal([])
    expect(el.selectedIndex).to.equal(0)
  })
})

describe('radio-behaviors selection lifecycle', () => {
  it('auto-selects the first item on firstUpdated and fires selection-changed', async () => {
    const el = globalThis.document.createElement('radio-harness')
    const events = []
    el.addEventListener('selection-changed', (e) => events.push(e))
    el.innerHTML = '<item id="first">One</item><item id="second">Two</item>'
    globalThis.document.body.appendChild(el)
    await el.updateComplete
    expect(el.selection).to.equal('first')
    expect(el.querySelector('#first').hasAttribute('selected')).to.equal(true)
    expect(el.querySelector('#second').hasAttribute('selected')).to.equal(false)
    expect(events.length).to.equal(1)
    expect(events[0].detail).to.equal(el)
    expect(el.itemData.length).to.equal(2)
    expect(el.itemData[0].id).to.equal('first')
    expect(el.itemData[0].index).to.equal(0)
    expect(el.itemData[0].node).to.equal(el.querySelector('#first'))
    expect(el.itemData[0].innerHTML).to.equal('One')
    expect(el.itemData[0].selected).to.equal('true')
    expect(el.selectedIndex).to.equal(0)
    el.remove()
  })

  it('selects an item by id through selectItem and moves the selected attribute', async () => {
    const el = await fixture(html`
      <radio-harness>
        <item id="first">One</item>
        <item id="second">Two</item>
      </radio-harness>
    `)
    const events = []
    el.addEventListener('selection-changed', (e) => events.push(e))
    el.selectItem('second')
    await el.updateComplete
    expect(el.selection).to.equal('second')
    expect(el.querySelector('#first').hasAttribute('selected')).to.equal(false)
    expect(el.querySelector('#second').hasAttribute('selected')).to.equal(true)
    expect(el.selectedIndex).to.equal(1)
    expect(events.length).to.equal(1)
    // selecting the already selected item does not re-fire
    el.selectItem('second')
    await el.updateComplete
    expect(events.length).to.equal(1)
  })

  it('selects by index, by node object, and skips disabled items by index', async () => {
    const el = await fixture(html`
      <radio-harness>
        <item id="first">One</item>
        <item id="second">Two</item>
        <item id="third">Three</item>
      </radio-harness>
    `)
    el.querySelector('#third').disabled = true
    // by index
    el.selectItem(1)
    await el.updateComplete
    expect(el.selection).to.equal('second')
    // disabled index resolves to nothing and falls back to current selection
    el.selectItem(2)
    await el.updateComplete
    expect(el.selection).to.equal('second')
    // by node object
    el.selectItem(el.querySelector('#first'))
    await el.updateComplete
    expect(el.selection).to.equal('first')
  })

  it('generates a uuid for selected nodes that lack an id', async () => {
    const el = await fixture(html`<radio-harness></radio-harness>`)
    const node = globalThis.document.createElement('item')
    el.selectItem(node)
    expect(node.id).to.not.equal('')
    expect(el.selection).to.equal(node.id)
    const again = el._generateUUID()
    expect(again).to.not.equal(node.id)
    expect(typeof again).to.equal('string')
  })

  it('keeps a bogus selection stable when nothing can resolve it', async () => {
    const el = await fixture(html`
      <radio-harness>
        <item id="first">One</item>
        <item id="second">Two</item>
      </radio-harness>
    `)
    const events = []
    el.addEventListener('selection-changed', (e) => events.push(e))
    el.selection = 'ghost'
    await el.updateComplete
    // fallback re-resolves to the [selected] item but it is already selected
    expect(el.selection).to.equal('ghost')
    expect(el.querySelector('#first').hasAttribute('selected')).to.equal(true)
    expect(events.length).to.equal(0)
  })

  it('falls through the fallback chain when everything relevant is disabled', async () => {
    const el = await fixture(html`
      <radio-harness>
        <item id="first">One</item>
        <item id="second">Two</item>
      </radio-harness>
    `)
    el.querySelector('#first').disabled = true
    el.selectItem('first')
    await el.updateComplete
    // disabled item cannot be re-resolved by id, [selected], or first query
    expect(el.selection).to.equal('first')
    expect(el.querySelector('#first').hasAttribute('selected')).to.equal(true)
    expect(el._getItemByQuery('#first')).to.equal(undefined)
    expect(el._getItemByQuery('[selected]')).to.equal(undefined)
    expect(el._getItemByQuery()).to.equal(undefined)
    expect(el._getItemByIndex(0)).to.equal(undefined)
    expect(el._getItemByIndex(1)).to.equal(el.querySelector('#second'))
    expect(el._getItemByIndex(99)).to.equal(undefined)
    expect(el._getItemByQuery('#second')).to.equal(el.querySelector('#second'))
  })

  it('clears selection when no item resolves and null is allowed', async () => {
    const el = globalThis.document.createElement('radio-harness-allow-null')
    const events = []
    el.addEventListener('selection-changed', (e) => events.push(e))
    el.setAttribute('selection', 'ghost')
    globalThis.document.body.appendChild(el)
    await el.updateComplete
    await aTimeout(50)
    expect(el.selection).to.equal(undefined)
    expect(events.length).to.equal(1)
    el.remove()
  })

  it('leaves a bogus selection untouched when null is not allowed', async () => {
    const el = await fixture(
      html`<radio-harness selection="ghost"></radio-harness>`,
    )
    await el.updateComplete
    expect(el.selection).to.equal('ghost')
  })
})

describe('radio-behaviors select-item event handling', () => {
  it('selects the item named in a select-item event detail', async () => {
    const el = await fixture(html`
      <radio-harness>
        <item id="first">One</item>
        <item id="second">Two</item>
      </radio-harness>
    `)
    el.dispatchEvent(
      new CustomEvent('select-item', {
        detail: { controls: 'second' },
        bubbles: true,
        composed: true,
      }),
    )
    await el.updateComplete
    expect(el.selection).to.equal('second')
    expect(el.querySelector('#second').hasAttribute('selected')).to.equal(true)
  })

  it('removes listeners on disconnect so events no longer select', async () => {
    const el = globalThis.document.createElement('radio-harness')
    el.innerHTML = '<item id="first">One</item><item id="second">Two</item>'
    globalThis.document.body.appendChild(el)
    await el.updateComplete
    // let the selection/itemData follow-up updates settle before teardown
    await aTimeout(50)
    expect(el.selection).to.equal('first')
    el.remove()
    el.dispatchEvent(
      new CustomEvent('select-item', {
        detail: { controls: 'second' },
        bubbles: true,
        composed: true,
      }),
    )
    expect(el.selection).to.equal('first')
    // the observer is disconnected as well: appended items get no auto id
    const extra = globalThis.document.createElement('item')
    el.appendChild(extra)
    await aTimeout(100)
    expect(extra.id).to.equal('')
    expect(el.itemData.every((d) => d.id !== extra.id)).to.equal(true)
  })
})

describe('radio-behaviors mutation observer', () => {
  it('assigns ids to added items and refreshes itemData', async () => {
    const el = await fixture(html`
      <radio-harness><item id="first">One</item></radio-harness>
    `)
    const added = globalThis.document.createElement('item')
    added.textContent = 'Two'
    el.appendChild(added)
    await aTimeout(100)
    expect(added.id).to.not.equal('')
    expect(el.itemData.length).to.equal(2)
    expect(el.itemData[1].id).to.equal(added.id)
  })

  it('reselects a fallback when the selected item is removed', async () => {
    const el = await fixture(html`
      <radio-harness>
        <item id="first">One</item>
        <item id="second">Two</item>
      </radio-harness>
    `)
    const events = []
    el.addEventListener('selection-changed', (e) => events.push(e))
    el.querySelector('#first').remove()
    await aTimeout(100)
    expect(el.selection).to.equal('second')
    expect(el.querySelector('#second').hasAttribute('selected')).to.equal(true)
    expect(events.length).to.equal(1)
  })

  it('keeps selection when a non-selected item is removed', async () => {
    const el = await fixture(html`
      <radio-harness>
        <item id="first">One</item>
        <item id="second">Two</item>
        <item id="extra">Extra</item>
      </radio-harness>
    `)
    el.querySelector('#extra').remove()
    await aTimeout(100)
    expect(el.selection).to.equal('first')
    expect(el.itemData.length).to.equal(2)
  })

  it('reselects through the [selected] fallback when an item id is renamed', async () => {
    const el = await fixture(html`
      <radio-harness>
        <item id="first">One</item>
        <item id="second">Two</item>
      </radio-harness>
    `)
    el.querySelector('#first').setAttribute('id', 'renamed')
    await aTimeout(100)
    // id changed, but the item keeps its selected attribute so it stays chosen
    expect(el.selection).to.equal('first')
    expect(el.querySelector('#renamed').hasAttribute('selected')).to.equal(true)
    expect(el.itemData[0].id).to.equal('renamed')
  })

  it('only refreshes itemData for unrelated attribute changes', async () => {
    const el = await fixture(html`
      <radio-harness><item id="first">One</item></radio-harness>
    `)
    el.querySelector('#first').setAttribute('data-unrelated', 'yes')
    await aTimeout(100)
    expect(el.selection).to.equal('first')
    expect(el.itemData.length).to.equal(1)
    expect(el.querySelector('#first').hasAttribute('selected')).to.equal(true)
  })
})

describe('radio-behaviors internal helpers', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`
      <radio-harness>
        <item id="first">One</item>
        <item id="second">Two</item>
      </radio-harness>
    `)
  })

  it('_isItemSelected matches by current selection and by selected attribute', async () => {
    el.selectItem('second')
    await el.updateComplete
    expect(el._isItemSelected(el.querySelector('#second'))).to.equal(true)
    expect(el._isItemSelected(el.querySelector('#first'))).to.equal(false)
    expect(el._isItemSelected(null)).to.not.be.ok
  })

  it('_setItemSelected sets the attribute only on the selected item', () => {
    el.selection = 'second'
    el._setItemSelected(el.querySelector('#first'))
    expect(el.querySelector('#first').hasAttribute('selected')).to.equal(false)
    el._setItemSelected(el.querySelector('#second'))
    expect(el.querySelector('#second').hasAttribute('selected')).to.equal(true)
  })

  it('_getDataFromItem regenerates whitespace-only ids and captures data', () => {
    const item = globalThis.document.createElement('item')
    item.id = '   '
    item.innerHTML = 'hello'
    const data = el._getDataFromItem(item, '3', 'selected')
    expect(data.id).to.not.equal('   ')
    expect(data.id).to.not.equal('')
    expect(data.index).to.equal(3)
    expect(data.node).to.equal(item)
    expect(data.innerHTML).to.equal('hello')
    expect(data.selected).to.equal(null)
  })

  it('_getDataFromItems maps every slotted item', () => {
    const data = el._getDataFromItems()
    expect(data.length).to.equal(2)
    expect(data.map((d) => d.id)).to.deep.equal(['first', 'second'])
    expect(data.map((d) => d.index)).to.deep.equal([0, 1])
  })
})
