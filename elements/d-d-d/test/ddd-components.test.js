import { fixture, expect, html } from '@open-wc/testing'

import '../lib/ddd-card.js'
import '../lib/ddd-steps-list.js'
import '../lib/ddd-steps-list-item.js'
import '../lib/mini-map.js'
import '../lib/hax-palette-picker.js'

import { DddCard } from '../lib/ddd-card.js'
import { DddStepsList } from '../lib/ddd-steps-list.js'
import { DddStepsListItem } from '../lib/ddd-steps-list-item.js'
import { MiniMap } from '../lib/mini-map.js'
import { HaxPalettePicker } from '../lib/hax-palette-picker.js'

describe('ddd-card', () => {
  it('has correct tag name', () => {
    expect(DddCard.tag).to.equal('ddd-card')
  })

  it('renders with default properties', async () => {
    const el = await fixture(html`<ddd-card></ddd-card>`)
    expect(el).to.exist
    expect(el.title).to.be.null
    expect(el.src).to.be.null
    expect(el.href).to.be.null
    expect(el.target).to.equal('')
    expect(el.alt).to.equal('')
    expect(el.label).to.be.null
    expect(el.noArrow).to.be.false
  })

  it('renders a title', async () => {
    const el = await fixture(html`<ddd-card title="My Card"></ddd-card>`)
    expect(el.title).to.equal('My Card')
    await el.updateComplete
    const titleEl = el.shadowRoot.querySelector('.title')
    expect(titleEl.textContent).to.include('My Card')
  })

  it('renders an image when src is set', async () => {
    const el = await fixture(
      html`<ddd-card src="https://example.com/img.png" alt="Test"></ddd-card>`,
    )
    await el.updateComplete
    const img = el.shadowRoot.querySelector('img')
    expect(img).to.exist
    expect(img.getAttribute('src')).to.equal('https://example.com/img.png')
    expect(img.getAttribute('alt')).to.equal('Test')
  })

  it('does not render an image when src is null', async () => {
    const el = await fixture(html`<ddd-card></ddd-card>`)
    await el.updateComplete
    const img = el.shadowRoot.querySelector('img')
    expect(img).to.be.null
  })

  it('renders a button link when href is set', async () => {
    const el = await fixture(
      html`<ddd-card href="https://example.com" label="Go"></ddd-card>`,
    )
    await el.updateComplete
    const link = el.shadowRoot.querySelector('a')
    expect(link).to.exist
    expect(link.getAttribute('href')).to.equal('https://example.com')
    const button = el.shadowRoot.querySelector('button')
    expect(button.textContent).to.include('Go')
  })

  it('does not render a link when href is null', async () => {
    const el = await fixture(html`<ddd-card></ddd-card>`)
    await el.updateComplete
    const link = el.shadowRoot.querySelector('a')
    expect(link).to.be.null
  })

  it('uses default label "Explore" when no label is set', async () => {
    const el = await fixture(
      html`<ddd-card href="https://example.com"></ddd-card>`,
    )
    await el.updateComplete
    const button = el.shadowRoot.querySelector('button')
    expect(button.textContent).to.include('Explore')
  })

  it('shows arrow by default when href is set', async () => {
    const el = await fixture(
      html`<ddd-card href="https://example.com"></ddd-card>`,
    )
    await el.updateComplete
    const button = el.shadowRoot.querySelector('button')
    expect(button.textContent).to.include('>')
  })

  it('hides arrow when no-arrow is set', async () => {
    const el = await fixture(
      html`<ddd-card href="https://example.com" no-arrow></ddd-card>`,
    )
    await el.updateComplete
    const button = el.shadowRoot.querySelector('button')
    expect(button.textContent).to.not.include('>')
  })

  it('returns haxHooks with correct hook names', () => {
    const el = document.createElement('ddd-card')
    const hooks = el.haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
  })

  it('haxeditModeChanged sets editMode', () => {
    const el = document.createElement('ddd-card')
    el.haxeditModeChanged(true)
    expect(el.editMode).to.be.true
    el.haxeditModeChanged(false)
    expect(el.editMode).to.be.false
  })

  it('haxactiveElementChanged sets editMode and returns false', () => {
    const el = document.createElement('ddd-card')
    const result = el.haxactiveElementChanged(el, true)
    expect(el.editMode).to.be.true
    expect(result).to.be.false
  })

  it('_clickCard prevents default when in editMode', () => {
    const el = document.createElement('ddd-card')
    el.editMode = true
    let prevented = false
    let stopped = false
    let immediateStopped = false
    const fakeEvent = {
      preventDefault: () => {
        prevented = true
      },
      stopPropagation: () => {
        stopped = true
      },
      stopImmediatePropagation: () => {
        immediateStopped = true
      },
    }
    el._clickCard(fakeEvent)
    expect(prevented).to.be.true
    expect(stopped).to.be.true
    expect(immediateStopped).to.be.true
  })

  it('_clickCard does nothing when not in editMode', () => {
    const el = document.createElement('ddd-card')
    el.editMode = false
    let prevented = false
    const fakeEvent = {
      preventDefault: () => {
        prevented = true
      },
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
    }
    el._clickCard(fakeEvent)
    expect(prevented).to.be.false
  })

  it('has haxProperties returning a URL string', () => {
    const url = DddCard.haxProperties
    expect(url).to.be.a('string')
    expect(url).to.include('ddd-card.haxProperties.json')
  })
})

describe('ddd-steps-list', () => {
  it('has correct tag name', () => {
    expect(DddStepsList.tag).to.equal('ddd-steps-list')
  })

  it('renders with default properties', async () => {
    const el = await fixture(html`<ddd-steps-list></ddd-steps-list>`)
    expect(el).to.exist
    expect(el.dddPrimary).to.be.undefined
  })

  it('renders a steps container with a slot', async () => {
    const el = await fixture(html`<ddd-steps-list></ddd-steps-list>`)
    await el.updateComplete
    const container = el.shadowRoot.querySelector('.steps-container')
    expect(container).to.exist
    const slot = el.shadowRoot.querySelector('slot')
    expect(slot).to.exist
  })

  it('updateNumbers assigns step numbers to child ddd-steps-list-items', async () => {
    const el = await fixture(html`
      <ddd-steps-list>
        <ddd-steps-list-item title="A"></ddd-steps-list-item>
        <ddd-steps-list-item title="B"></ddd-steps-list-item>
        <ddd-steps-list-item title="C"></ddd-steps-list-item>
      </ddd-steps-list>
    `)
    await el.updateComplete
    const items = el.querySelectorAll('ddd-steps-list-item')
    expect(items[0].step).to.equal(1)
    expect(items[1].step).to.equal(2)
    expect(items[2].step).to.equal(3)
  })

  it('has haxProperties returning a URL string', () => {
    const url = DddStepsList.haxProperties
    expect(url).to.be.a('string')
    expect(url).to.include('ddd-steps-list.haxProperties.json')
  })
})

describe('ddd-steps-list-item', () => {
  it('has correct tag name', () => {
    expect(DddStepsListItem.tag).to.equal('ddd-steps-list-item')
  })

  it('renders with default properties', async () => {
    const el = await fixture(
      html`<ddd-steps-list-item></ddd-steps-list-item>`,
    )
    expect(el).to.exist
    expect(el.step).to.equal(0)
    expect(el.title).to.equal('')
  })

  it('renders the step number in a circle', async () => {
    const el = await fixture(
      html`<ddd-steps-list-item></ddd-steps-list-item>`,
    )
    el.step = 5
    await el.updateComplete
    const circle = el.shadowRoot.querySelector('.circle')
    expect(circle.textContent).to.include('5')
  })

  it('renders title in h3 when title is set', async () => {
    const el = await fixture(
      html`<ddd-steps-list-item title="Step Title"></ddd-steps-list-item>`,
    )
    await el.updateComplete
    const h3 = el.shadowRoot.querySelector('h3')
    expect(h3).to.exist
    expect(h3.textContent).to.include('Step Title')
  })

  it('does not render h3 when title is empty', async () => {
    const el = await fixture(
      html`<ddd-steps-list-item></ddd-steps-list-item>`,
    )
    await el.updateComplete
    const h3 = el.shadowRoot.querySelector('h3')
    expect(h3).to.be.null
  })

  it('has haxProperties returning a URL string', () => {
    const url = DddStepsListItem.haxProperties
    expect(url).to.be.a('string')
    expect(url).to.include('ddd-steps-list-item.haxProperties.json')
  })
})

describe('mini-map', () => {
  it('is registered as mini-map custom element', () => {
    expect(customElements.get('mini-map')).to.equal(MiniMap)
  })

  it('renders with default properties', async () => {
    const el = await fixture(html`<mini-map></mini-map>`)
    expect(el).to.exist
    expect(el.gridSize).to.equal(7)
    expect(el.nodeList).to.deep.equal([])
    expect(el.lineList).to.deep.equal([])
    expect(el.activeNode).to.be.null
    expect(el.availableNodes).to.deep.equal([])
  })

  it('renders a grid of gridSize*gridSize cells', async () => {
    const el = await fixture(html`<mini-map></mini-map>`)
    await el.updateComplete
    const cells = el.shadowRoot.querySelectorAll('.cell')
    expect(cells.length).to.equal(49)
  })

  it('renders action buttons', async () => {
    const el = await fixture(html`<mini-map></mini-map>`)
    await el.updateComplete
    const buttons = el.shadowRoot.querySelectorAll('button')
    expect(buttons.length).to.be.greaterThanOrEqual(4)
  })

  it('renderCell returns html for a cell with a node', async () => {
    const el = await fixture(
      html`<mini-map .nodeList=${[{ id: 0, name: 'Test', type: 'topic' }]}></mini-map>`,
    )
    await el.updateComplete
    const cellHtml = el.renderCell(0)
    expect(cellHtml).to.exist
  })

  it('renderCell returns html for an empty cell', async () => {
    const el = await fixture(html`<mini-map></mini-map>`)
    await el.updateComplete
    const cellHtml = el.renderCell(99)
    expect(cellHtml).to.exist
  })

  it('removeAllNodes clears nodeList and cells', async () => {
    const el = await fixture(
      html`<mini-map .nodeList=${[{ id: 0, name: 'A' }]}></mini-map>`,
    )
    await el.updateComplete
    el.removeAllNodes()
    expect(el.nodeList.length).to.equal(0)
  })

  it('_handleCellClick extracts id and calls showModal', async () => {
    const el = await fixture(html`<mini-map></mini-map>`)
    await el.updateComplete
    let calledId = null
    el.showModal = (id) => {
      calledId = id
    }
    const fakeEvent = {
      target: { id: 'cell-5' },
    }
    el._handleCellClick(fakeEvent)
    expect(calledId).to.equal('5')
  })

  it('closeModal dispatches simple-modal-hide event', async () => {
    const el = await fixture(html`<mini-map></mini-map>`)
    await el.updateComplete
    let eventDispatched = false
    const origDispatch = globalThis.dispatchEvent
    globalThis.dispatchEvent = (event) => {
      if (event.type === 'simple-modal-hide') {
        eventDispatched = true
      }
      return origDispatch.call(globalThis, event)
    }
    try {
      el.closeModal()
      expect(eventDispatched).to.be.true
    } finally {
      globalThis.dispatchEvent = origDispatch
    }
  })

  it('addLine pushes id to nodeList and sets cell background', async () => {
    const el = await fixture(html`<mini-map></mini-map>`)
    await el.updateComplete
    el.addLine(3, 'topic', 'Test', 'http://example.com')
    expect(el.nodeList).to.include(3)
  })

  it('removeNode is a no-op that does not throw', async () => {
    const el = await fixture(html`<mini-map></mini-map>`)
    await el.updateComplete
    el.removeNode()
    expect(true).to.be.true
  })

  it('removeLine is a no-op that does not throw', async () => {
    const el = await fixture(html`<mini-map></mini-map>`)
    await el.updateComplete
    el.removeLine()
    expect(true).to.be.true
  })

  it('renderCanvas is a no-op that does not throw', async () => {
    const el = await fixture(html`<mini-map></mini-map>`)
    await el.updateComplete
    el.renderCanvas()
    expect(true).to.be.true
  })

  it('showModal creates modal content without throwing', async () => {
    const el = await fixture(html`<mini-map></mini-map>`)
    await el.updateComplete
    const origDispatch = globalThis.dispatchEvent
    globalThis.dispatchEvent = () => true
    try {
      el.showModal(0)
      expect(true).to.be.true
    } finally {
      globalThis.dispatchEvent = origDispatch
    }
  })
})

describe('hax-palette-picker', () => {
  it('has correct tag name', () => {
    expect(HaxPalettePicker.tag).to.equal('hax-palette-picker')
  })

  it('renders with default properties', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    expect(el).to.exist
    expect(el.label).to.equal('Palette')
    expect(el.description).to.equal('')
    expect(el.activeValue).to.equal('')
    expect(el.showStatusFlags).to.be.false
    expect(el.disabled).to.be.false
    expect(el.required).to.be.false
    expect(el.fallbackValue).to.equal('0')
  })

  it('has default value derived from fallbackValue 0', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    expect(el.value).to.equal('0')
    expect(el.selectedKey).to.equal('wisdom-walk-green')
  })

  it('renders a fieldset with radiogroup role', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    await el.updateComplete
    const fieldset = el.shadowRoot.querySelector('fieldset')
    expect(fieldset).to.exist
    expect(fieldset.getAttribute('role')).to.equal('radiogroup')
  })

  it('renders a legend with the label', async () => {
    const el = await fixture(
      html`<hax-palette-picker label="Choose palette"></hax-palette-picker>`,
    )
    await el.updateComplete
    const legend = el.shadowRoot.querySelector('legend')
    expect(legend).to.exist
    expect(legend.textContent).to.include('Choose palette')
  })

  it('renders radio inputs for each option', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    await el.updateComplete
    const inputs = el.shadowRoot.querySelectorAll('input[type="radio"]')
    expect(inputs.length).to.be.greaterThan(0)
  })

  it('syncs value to option on willUpdate', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    el.value = '5'
    await el.updateComplete
    expect(el.selectedKey).to.equal('monotone')
  })

  it('_normalizeValue handles 0 as "0"', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    expect(el._normalizeValue(0)).to.equal('0')
    expect(el._normalizeValue('0')).to.equal('0')
  })

  it('_normalizeValue handles null and undefined as empty', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    expect(el._normalizeValue(null)).to.equal('')
    expect(el._normalizeValue(undefined)).to.equal('')
  })

  it('_normalizeValue trims and lowercases string values', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    expect(el._normalizeValue('  Monotone  ')).to.equal('monotone')
  })

  it('_optionMatchesValue matches by key', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    const options = el._pickerOptions
    const monotone = options.find((o) => o.key === 'monotone')
    expect(el._optionMatchesValue(monotone, 'monotone')).to.be.true
    expect(el._optionMatchesValue(monotone, '5')).to.be.true
  })

  it('_handleSelection sets value and selectedKey and fires events', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    let eventFired = false
    el.addEventListener('value-changed', () => {
      eventFired = true
    })
    const options = el._pickerOptions
    const target = options.find((o) => o.key === 'monotone')
    el._handleSelection(target)
    expect(el.value).to.equal('5')
    expect(el.selectedKey).to.equal('monotone')
    expect(eventFired).to.be.true
  })

  it('_handleSelection does nothing when disabled', async () => {
    const el = await fixture(
      html`<hax-palette-picker disabled></hax-palette-picker>`,
    )
    let eventFired = false
    el.addEventListener('value-changed', () => {
      eventFired = true
    })
    const options = el._pickerOptions
    const target = options.find((o) => o.key === 'monotone')
    const originalValue = el.value
    el._handleSelection(target)
    expect(el.value).to.equal(originalValue)
    expect(eventFired).to.be.false
  })

  it('_handleSelection does nothing when option is null', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    let eventFired = false
    el.addEventListener('value-changed', () => {
      eventFired = true
    })
    el._handleSelection(null)
    expect(eventFired).to.be.false
  })

  it('_normalizeOption handles string input', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    const result = el._normalizeOption('monotone')
    expect(result).to.not.be.null
    expect(result.key).to.equal('monotone')
  })

  it('_normalizeOption handles object input', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    const result = el._normalizeOption({
      key: 'custom',
      label: 'Custom',
      dataPalette: '5',
    })
    expect(result).to.not.be.null
    expect(result.key).to.equal('custom')
    expect(result.label).to.equal('Custom')
  })

  it('_normalizeOption returns null for null/undefined input', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    expect(el._normalizeOption(null)).to.be.null
    expect(el._normalizeOption(undefined)).to.be.null
  })

  it('_getMatchedOption returns the matching option or null', async () => {
    const el = await fixture(html`<hax-palette-picker></hax-palette-picker>`)
    const matched = el._getMatchedOption('5')
    expect(matched).to.not.be.null
    expect(matched.key).to.equal('monotone')
    const notMatched = el._getMatchedOption('nonexistent')
    expect(notMatched).to.be.null
  })

  it('_pickerOptions returns empty array when options is an empty array', async () => {
    const el = await fixture(
      html`<hax-palette-picker .options=${[]}></hax-palette-picker>`,
    )
    const options = el._pickerOptions
    // empty array is an object, so the object branch runs and produces []
    expect(options).to.deep.equal([])
  })

  it('_pickerOptions handles object-style options map', async () => {
    const el = await fixture(
      html`<hax-palette-picker .options=${{ '5': 'Monotone' }}></hax-palette-picker>`,
    )
    const options = el._pickerOptions
    expect(options.length).to.be.greaterThan(0)
  })
})
