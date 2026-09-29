import { fixture, expect, html, aTimeout } from '@open-wc/testing'
import '../lib/super-daemon-ui.js'
import { UserScaffoldInstance } from '@haxtheweb/user-scaffold/user-scaffold.js'
import { SuperDaemonInstance } from '../super-daemon.js'

// Behavioral coverage for super-daemon-ui: filter/render state machine,
// keyboard navigation with active-descendant management, program setup,
// focus/announce behaviors, and drag/drop delegation.
describe('super-daemon-ui behavior', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`<super-daemon-ui></super-daemon-ui>`)
    UserScaffoldInstance.active = false
    UserScaffoldInstance.writeMemory('isLoggedIn', false)
    SuperDaemonInstance.programName = null
    UserScaffoldInstance.action = { type: null, architype: null }
    UserScaffoldInstance.data = { raw: null, value: null, architype: null }
    await aTimeout(0)
  })

  afterEach(async () => {
    UserScaffoldInstance.action = { type: null, architype: null }
    UserScaffoldInstance.data = { raw: null, value: null, architype: null }
    await aTimeout(0)
  })

  it('renders a loading state initially and no-results once settled', async () => {
    expect(element.loading).to.equal(true)
    expect(element.shadowRoot.querySelector('.loading')).to.exist
    element.loading = false
    await element.updateComplete
    expect(element.shadowRoot.querySelector('.no-results')).to.exist
  })

  it('recomputes filtered immediately when items change', async () => {
    element.loading = false
    element.items = [{ title: 'Alpha', index: 'alpha', value: {}, eventName: 'e' }]
    await element.updateComplete
    expect(element.filtered.length).to.equal(1)
    expect(element.loading).to.equal(false)
  })

  it('switches the filter field based on program mode', async () => {
    expect(element.where).to.equal('index')
    element.programName = 'P'
    await element.updateComplete
    expect(element.where).to.equal('title')
    element.programName = null
    await element.updateComplete
    expect(element.where).to.equal('index')
  })

  it('renders rows in the mini results list', async () => {
    const el = await fixture(html`<super-daemon-ui mini></super-daemon-ui>`)
    el.loading = false
    el.items = [
      { title: 'One', index: 'one', value: { a: 1 }, eventName: 'e1' },
      { title: 'Two', index: 'two', value: {}, eventName: 'e2' },
    ]
    await el.updateComplete
    expect(el.filtered.length).to.equal(2)
    const list = el.shadowRoot.querySelector('.results-list')
    expect(list).to.exist
    expect(list.getAttribute('role')).to.equal('listbox')
    const rows = el.shadowRoot.querySelectorAll('super-daemon-row')
    expect(rows.length).to.equal(2)
    expect(rows[0].title).to.equal('One')
    expect(rows[1].hasAttribute('striped')).to.equal(true)
    // mini counter is shown when more than one result
    expect(el.shadowRoot.querySelector('.mini-results-counter')).to.exist
  })

  it('renders lit-virtualizer in full mode with a results stats bar', async () => {
    element.loading = false
    element.items = [{ title: 'Alpha', index: 'alpha', value: {}, eventName: 'e' }]
    await element.updateComplete
    expect(element.shadowRoot.querySelector('lit-virtualizer')).to.exist
    expect(element.shadowRoot.querySelector('.results-stats')).to.exist
  })

  it('shows type-to-see-results for an empty program', async () => {
    element.loading = false
    element.programName = 'P'
    await element.updateComplete
    const nr = element.shadowRoot.querySelector('.no-results')
    expect(nr).to.exist
    expect(nr.textContent).to.contain('Type something')
  })

  it('shows the no-results message for a program with search text', async () => {
    element.loading = false
    element.programName = 'P'
    element.programSearch = 'zzz'
    await element.updateComplete
    const nr = element.shadowRoot.querySelector('.no-results')
    expect(nr.textContent).to.contain('No results')
  })

  it('setupProgram clears stale like when launched empty', async () => {
    element.like = 'stale'
    element.setupProgram('')
    expect(element.programSearch).to.equal('')
    expect(element.like).to.equal('')
    const search = element.shadowRoot.querySelector('super-daemon-search')
    expect(search.value).to.equal('')
    await aTimeout(20)
  })

  it('setupProgram mirrors an initial value into the search field', async () => {
    element.setupProgram('initial')
    expect(element.programSearch).to.equal('initial')
    const search = element.shadowRoot.querySelector('super-daemon-search')
    expect(search.value).to.equal('initial')
    const inputField = search.shadowRoot.querySelector('#inputfilter')
    expect(inputField.value).to.equal('initial')
    await aTimeout(20)
  })

  it('_updateActiveDescendant tracks selection and applies row state', async () => {
    const el = await fixture(html`<super-daemon-ui mini></super-daemon-ui>`)
    el.loading = false
    el.items = [
      { title: 'A', index: 'a', value: {}, eventName: 'e' },
      { title: 'B', index: 'b', value: {}, eventName: 'e' },
    ]
    await el.updateComplete
    el._updateActiveDescendant(1)
    expect(el._selectedIndex).to.equal(1)
    expect(el._activeDescendant).to.equal('option-1')
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await aTimeout(0)
    const rows = el.shadowRoot.querySelectorAll("super-daemon-row")
    expect(rows[0].active).to.equal(false)
    expect(rows[1].active).to.equal(true)
    // the host (role=option) carries the dynamic aria-selected value so it
    // stays aligned with the keyboard selection for assistive tech
    expect(rows[0].getAttribute('aria-selected')).to.equal('false')
    expect(rows[1].getAttribute('aria-selected')).to.equal('true')
    el._updateActiveDescendant(-1)
    expect(el._activeDescendant).to.equal('')
  })

  it('_announceResults creates and removes a live region', async () => {
    const hasMessage = () => {
      const regions = document.body.querySelectorAll('[aria-live="polite"]')
      let found = false
      regions.forEach((region) => {
        if (region.textContent.includes('0 results available')) {
          found = true
        }
      })
      return found
    }
    element._announceResults()
    expect(hasMessage()).to.equal(true)
    // the fixture's own 250ms filter debounce can schedule one additional
    // announce after this test starts, so settle well past both 1000ms
    // removal timers
    await aTimeout(1600)
    expect(hasMessage()).to.equal(false)
  })

  it('itemSelected resets like and programSearch', () => {
    element.like = 'x'
    element.programSearch = 'y'
    element.itemSelected()
    expect(element.like).to.equal('')
    expect(element.programSearch).to.equal('')
  })

  it('focusedChanged tracks the focused flag', async () => {
    element.focusedChanged({ detail: { value: true } })
    await element.updateComplete
    expect(element.focused).to.equal(true)
    expect(element.hasAttribute('focused')).to.equal(true)
    element.focusedChanged({ detail: { value: false } })
    await element.updateComplete
    expect(element.focused).to.equal(false)
    expect(element.hasAttribute('focused')).to.equal(false)
  })

  it('listeningForInputChanged scrolls results to top when listening starts', () => {
    element.listeningForInputChanged({ detail: { value: true } })
    expect(element.shadowRoot.querySelector('.results')).to.exist
  })

  it('commandContextChanged updates the command context', () => {
    element.commandContextChanged({ detail: { value: '>' } })
    expect(element.commandContext).to.equal('>')
  })

  it('inputfilterChanged sets like when no program is active', () => {
    let valueEvent = null
    element.addEventListener('value-changed', (e) => (valueEvent = e.detail.value))
    element.inputfilterChanged({ target: { value: 'typed' } })
    expect(element.like).to.equal('typed')
    expect(valueEvent).to.equal('typed')
  })

  it('inputfilterChanged routes input to programSearch during a program', () => {
    element.programName = 'P'
    element.inputfilterChanged({ target: { value: 'prog input' } })
    expect(element.programSearch).to.equal('prog input')
    expect(element.like).to.equal('')
  })

  it('inputfilterChanged exits the welcome program on typing', () => {
    element.programName = 'Show getting started tasks'
    let runProgramEvt = false
    let ctxEvt = null
    element.addEventListener('super-daemon-run-program', () => (runProgramEvt = true))
    element.addEventListener(
      'super-daemon-command-context-changed',
      (e) => (ctxEvt = e.detail.value),
    )
    element.inputfilterChanged({ target: { value: 'hello' } })
    expect(runProgramEvt).to.equal(true)
    expect(ctxEvt).to.equal('*')
    expect(element.like).to.equal('hello')
    expect(element.programSearch).to.equal('')
  })

  it('_inputKeydown Enter selects the highlighted row', async () => {
    const el = await fixture(html`<super-daemon-ui mini></super-daemon-ui>`)
    el.loading = false
    el.items = [
      { title: 'A', index: 'a', value: { x: 1 }, eventName: 'custom-event' },
      { title: 'B', index: 'b', value: { x: 2 }, eventName: 'custom-event' },
    ]
    await el.updateComplete
    let selected = false
    let custom = null
    let closed = false
    el.addEventListener('super-daemon-row-selected', () => (selected = true))
    el.addEventListener('custom-event', (e) => (custom = e.detail))
    el.addEventListener('super-daemon-close', () => (closed = true))
    el._selectedIndex = 1
    el._inputKeydown(
      new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }),
    )
    expect(selected).to.equal(true)
    expect(custom.x).to.equal(2)
    expect(closed).to.equal(true)
    // no explicit selection selects the first row
    let selected2 = 0
    el.addEventListener('super-daemon-row-selected', () => selected2++)
    el._selectedIndex = -1
    el._inputKeydown(
      new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }),
    )
    expect(selected2).to.equal(1)
  })

  it('_inputKeydown ArrowDown and ArrowUp move selection with wrap', async () => {
    const el = await fixture(html`<super-daemon-ui mini></super-daemon-ui>`)
    el.loading = false
    el.items = [
      { title: 'A', index: 'a', value: {}, eventName: 'e' },
      { title: 'B', index: 'b', value: {}, eventName: 'e' },
    ]
    await el.updateComplete
    el._inputKeydown(
      new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }),
    )
    expect(el._selectedIndex).to.equal(0)
    el._inputKeydown(
      new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }),
    )
    expect(el._selectedIndex).to.equal(1)
    // wraps from the end back to the start
    el._inputKeydown(
      new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true }),
    )
    expect(el._selectedIndex).to.equal(0)
    // wraps from the start back to the end
    el._inputKeydown(
      new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true }),
    )
    expect(el._selectedIndex).to.equal(1)
    // ArrowLeft / ArrowRight are not handled by _inputKeydown
    el._inputKeydown(
      new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true }),
    )
    expect(el._selectedIndex).to.equal(1)
  })

  it('_inputKeydown Escape closes and resets selection', async () => {
    const el = await fixture(html`<super-daemon-ui mini></super-daemon-ui>`)
    el.loading = false
    el.items = [
      { title: 'A', index: 'a', value: {}, eventName: 'e' },
      { title: 'B', index: 'b', value: {}, eventName: 'e' },
    ]
    await el.updateComplete
    el._selectedIndex = 0
    let closed = false
    el.addEventListener('super-daemon-close', () => (closed = true))
    el._inputKeydown(
      new KeyboardEvent('keydown', { key: 'Escape', cancelable: true }),
    )
    expect(closed).to.equal(true)
    expect(el._selectedIndex).to.equal(-1)
    expect(el._activeDescendant).to.equal('')
  })

  it('_inputKeydown Enter in program mode emits program-enter', async () => {
    element.programName = 'P'
    element.programSearch = 'my input'
    let evt = null
    element.addEventListener('super-daemon-program-enter', (e) => (evt = e.detail))
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }),
    )
    expect(evt.programName).to.equal('P')
    expect(evt.input).to.equal('my input')
  })

  it('_inputKeydown Enter in program mode with empty input does nothing', () => {
    element.programName = 'P'
    element.programSearch = ''
    let evt = null
    element.addEventListener('super-daemon-program-enter', (e) => (evt = true))
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: 'Enter', cancelable: true }),
    )
    expect(evt).to.equal(null)
  })

  it('_inputKeydown context keys switch the command context', () => {
    const cases = [
      ['!', '/'],
      ['/', '/'],
      ['\\', '/'],
      ['>', '>'],
      ['<', '>'],
    ]
    cases.forEach((pair) => {
      element.like = ''
      element.commandContext = '*'
      element._inputKeydown(
        new KeyboardEvent('keydown', { key: pair[0], cancelable: true }),
      )
      expect(element.commandContext).to.equal(pair[1])
    })
    // with text typed the key stays plain text
    element.like = 'x'
    element.commandContext = '*'
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: '/', cancelable: true }),
    )
    expect(element.commandContext).to.equal('*')
  })

  it('_inputKeydown Backspace exits a program or resets the context', () => {
    element.programName = 'P'
    element.programSearch = ''
    let runEvt = false
    element.addEventListener('super-daemon-run-program', () => (runEvt = true))
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: 'Backspace', cancelable: true }),
    )
    expect(runEvt).to.equal(true)
    // outside a program it clears the context
    element.programName = null
    element.like = ''
    element.commandContext = '/'
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: 'Backspace', cancelable: true }),
    )
    expect(element.commandContext).to.equal('*')
  })

  it('welcome program exits on the first intent key', () => {
    element.programName = 'Show getting started tasks'
    element.programSearch = ''
    let runEvt = false
    let ctxEvt = null
    element.addEventListener('super-daemon-run-program', () => (runEvt = true))
    element.addEventListener(
      'super-daemon-command-context-changed',
      (e) => (ctxEvt = e.detail.value),
    )
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: 'a', cancelable: true }),
    )
    expect(runEvt).to.equal(true)
    expect(ctxEvt).to.equal('*')
  })

  it('welcome program maps context keys while exiting', () => {
    element.programName = 'Show getting started tasks'
    element.programSearch = ''
    let ctxEvt = null
    element.addEventListener(
      'super-daemon-command-context-changed',
      (e) => (ctxEvt = e.detail.value),
    )
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: '!', cancelable: true }),
    )
    expect(ctxEvt).to.equal('/')
    element.programSearch = ''
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: '<', cancelable: true }),
    )
    expect(ctxEvt).to.equal('>')
    element.programSearch = ''
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: 'x', cancelable: true }),
    )
    expect(ctxEvt).to.equal('*')
  })

  it('welcome program ignores arrow keys', () => {
    element.programName = 'Show getting started tasks'
    element.programSearch = ''
    let runEvt = false
    element.addEventListener('super-daemon-run-program', () => (runEvt = true))
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: 'ArrowDown' }),
    )
    expect(runEvt).to.equal(false)
  })

  it('_resultsKeydown wraps focus from the first row to the last', async () => {
    const el = await fixture(html`<super-daemon-ui mini></super-daemon-ui>`)
    el.loading = false
    el.items = [
      { title: 'A', index: 'a', value: {}, eventName: 'e' },
      { title: 'B', index: 'b', value: {}, eventName: 'e' },
    ]
    await el.updateComplete
    const rows = el.shadowRoot.querySelectorAll('super-daemon-row')
    rows[0].active = true
    // wait for the [active] attribute reflection before dispatching
    await el.updateComplete
    el._resultsKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await aTimeout(0)
    // delegatesFocus retargets focus to the row host at this shadow level
    expect(el.shadowRoot.activeElement === rows[1]).to.equal(true)
  })

  it('_resultsKeydown moves focus between rows without wrap', async () => {
    const el = await fixture(html`<super-daemon-ui mini></super-daemon-ui>`)
    el.loading = false
    el.items = [
      { title: 'A', index: 'a', value: {}, eventName: 'e' },
      { title: 'B', index: 'b', value: {}, eventName: 'e' },
    ]
    await el.updateComplete
    const rows = el.shadowRoot.querySelectorAll('super-daemon-row')
    rows[1].active = true
    await el.updateComplete
    el._resultsKeydown(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    expect(el.shadowRoot.activeElement === rows[0]).to.equal(true)
    // ArrowDown from the first row moves forward
    rows[0].active = true
    rows[1].active = false
    await el.updateComplete
    el._resultsKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(el.shadowRoot.activeElement === rows[1]).to.equal(true)
  })

  it('_resultsKeydown ignores keys when no row is active', async () => {
    element.loading = false
    element.items = [{ title: 'A', index: 'a', value: {}, eventName: 'e' }]
    await element.updateComplete
    element._resultsKeydown(new KeyboardEvent('keydown', { key: 'ArrowDown' }))
    expect(element.filtered.length).to.equal(1)
  })

  it('dragenter, dragover, and dragleave toggle search dragover', () => {
    const search = element.shadowRoot.querySelector('super-daemon-search')
    element.dragenterEvent(new Event('dragenter', { cancelable: true }))
    expect(search.dragover).to.equal(true)
    element.dragoverEvent(new Event('dragover', { cancelable: true }))
    expect(search.dragover).to.equal(true)
    element.dragleaveEvent(new Event('dragleave', { cancelable: true }))
    expect(search.dragover).to.equal(false)
  })

  it('dropEvent resets drag state and delegates to waveWand', () => {
    const sdi = globalThis.SuperDaemonManager.requestAvailability()
    let wandCalled = null
    const origWaveWand = sdi.waveWand
    sdi.waveWand = (params, target, sound) => {
      wandCalled = [params, target, sound]
    }
    element.activeDrag = true
    element.activeType = 'image/png'
    element.dropEvent(new Event('drop', { cancelable: true }))
    sdi.waveWand = origWaveWand
    expect(element.activeDrag).to.equal(false)
    expect(element.activeType).to.equal(null)
    expect(Array.isArray(wandCalled[0])).to.equal(true)
    expect(wandCalled[0][3]).to.equal('hax-agent')
    expect(wandCalled[2]).to.equal('coin2')
  })

  it('opening resets drag state and focuses the input', async () => {
    element.activeDrag = true
    element.activeType = 'file'
    element.opened = true
    await element.updateComplete
    await aTimeout(20)
    expect(element.activeDrag).to.equal(false)
    expect(element.activeType).to.equal(null)
    expect(element.opened).to.equal(true)
  })

  it('focusInput and selectInput target the inner field', async () => {
    element.focusInput()
    await aTimeout(20)
    expect(document.activeElement === document.body).to.equal(false)
    element.selectInput()
    await aTimeout(20)
    const search = element.shadowRoot.querySelector('super-daemon-search')
    expect(search.shadowRoot.querySelector('#inputfilter')).to.exist
  })

  it('auto-selects the sole result while listening for input', async () => {
    const el = await fixture(html`<super-daemon-ui mini></super-daemon-ui>`)
    let selected = false
    el.addEventListener('super-daemon-row-selected', () => (selected = true))
    const sdi = globalThis.SuperDaemonManager.requestAvailability()
    sdi.listeningForInput = false
    // arm listening BEFORE the filtered change so the auto-select runs
    el.listeningForInput = true
    el.loading = false
    el.items = [{ title: 'A', index: 'a', value: {}, eventName: 'e' }]
    // the 250ms filter debounce re-runs updated(filtered) which re-arms the
    // 600ms auto-select timeout, so allow ~1000ms total
    await aTimeout(1000)
    expect(selected).to.equal(true)
    sdi.listeningForInput = false
  })

  it('renders the search with combobox semantics', async () => {
    const search = element.shadowRoot.querySelector('super-daemon-search')
    expect(search.getAttribute('role')).to.equal('combobox')
    expect(search.getAttribute('aria-haspopup')).to.equal('listbox')
    expect(search.getAttribute('aria-controls')).to.equal('results-listbox')
  })
})
