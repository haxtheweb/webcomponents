import { fixture, expect, html, aTimeout } from '@open-wc/testing'
import '../lib/super-daemon-search.js'
import '../super-daemon.js'

// Behavioral coverage for super-daemon-search: context icon / program badge
// rendering, voice search click flow, keydown and input routing, placeholder
// updates, and the change events it emits.
describe('super-daemon-search behavior', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`<super-daemon-search></super-daemon-search>`)
    const sdi = globalThis.SuperDaemonManager.requestAvailability()
    sdi.listeningForInput = false
    sdi.opened = false
    sdi.santaMode = false
    sdi.hal = null
  })

  afterEach(async () => {
    const sdi = globalThis.SuperDaemonManager.requestAvailability()
    sdi.hal = null
    sdi.listeningForInput = false
  })

  it('renders the filter field with no context or program chrome', async () => {
    expect(element.shadowRoot.querySelector('#inputfilter')).to.exist
    expect(element.shadowRoot.querySelector('.user-context-icon')).to.be.null
    expect(element.shadowRoot.querySelector('.program')).to.be.null
    expect(element.shadowRoot.querySelector('simple-icon-button-lite')).to.be.null
  })

  it('renders a context icon for slash command mode', async () => {
    const el = await fixture(
      html`<super-daemon-search command-context="/"></super-daemon-search>`,
    )
    const icon = el.shadowRoot.querySelector('.user-context-icon')
    expect(icon).to.exist
    expect(icon.getAttribute('title')).to.equal('Slash commands active')
    expect(icon.getAttribute('icon')).to.equal('hax:wand')
  })

  it('renders a context icon for developer console mode', async () => {
    const el = await fixture(
      html`<super-daemon-search command-context=">"></super-daemon-search>`,
    )
    const icon = el.shadowRoot.querySelector('.user-context-icon')
    expect(icon).to.exist
    expect(icon.getAttribute('title')).to.equal('Developer console active')
    expect(icon.getAttribute('icon')).to.equal('hax:console-line')
  })

  it('resolves titles and icons for all contexts', () => {
    expect(element.getActiveTitle('CMS')).to.equal('Slash commands active')
    expect(element.getActiveIcon('CMS')).to.equal('hax:wand')
    expect(element.getActiveTitle('/')).to.equal('Slash commands active')
    expect(element.getActiveTitle('>')).to.equal('Developer console active')
    expect(element.getActiveIcon('>')).to.equal('hax:console-line')
    expect(element.getActiveTitle('unknown')).to.equal('')
    expect(element.getActiveIcon('unknown')).to.equal('')
  })

  it('renders the program badge in program mode', async () => {
    const el = await fixture(
      html`<super-daemon-search program-name="Search NASA"></super-daemon-search>`,
    )
    const badge = el.shadowRoot.querySelector('.program')
    expect(badge).to.exist
    expect(badge.textContent.trim()).to.equal('Search NASA')
  })

  it('renders the voice button when voice search is on', async () => {
    const el = await fixture(
      html`<super-daemon-search voice-search></super-daemon-search>`,
    )
    const btn = el.shadowRoot.querySelector('simple-icon-button-lite')
    expect(btn).to.exist
    expect(btn.getAttribute('icon')).to.equal('settings-voice')
    expect(btn.getAttribute('title')).to.equal('Voice search')
  })

  it('shows the listening icon and class while listening', async () => {
    const el = await fixture(
      html`<super-daemon-search
        voice-search
        listening-for-input
      ></super-daemon-search>`,
    )
    const btn = el.shadowRoot.querySelector('simple-icon-button-lite')
    expect(btn.getAttribute('icon')).to.equal('hax:loading')
    expect(btn.className).to.contain('listening')
  })

  it('voiceSearchClick stops listening when already listening', async () => {
    const el = await fixture(
      html`<super-daemon-search voice-search></super-daemon-search>`,
    )
    const sdi = globalThis.SuperDaemonManager.requestAvailability()
    el.listeningForInput = true
    sdi.listeningForInput = true
    el.voiceSearchClick()
    expect(sdi.listeningForInput).to.equal(false)
  })

  it('voiceSearchClick speaks and starts listening', async () => {
    const el = await fixture(
      html`<super-daemon-search voice-search></super-daemon-search>`,
    )
    const sdi = globalThis.SuperDaemonManager.requestAvailability()
    const spoke = []
    sdi.hal = {
      speak: (phrase) => {
        spoke.push(phrase)
        return Promise.resolve()
      },
    }
    el.disabled = false
    el.listeningForInput = false
    el.voiceSearchClick()
    await aTimeout(20)
    expect(spoke[0]).to.equal('How may I help you?')
    expect(sdi.listeningForInput).to.equal(true)
    sdi.hal = null
    sdi.listeningForInput = false
  })

  it('voiceSearchClick does nothing while disabled', async () => {
    const el = await fixture(
      html`<super-daemon-search voice-search></super-daemon-search>`,
    )
    el.disabled = true
    el.voiceSearchClick()
    expect(el.listeningForInput).to.equal(false)
  })

  it('_inputKeydown switches context keys when the value is empty', () => {
    element.value = ''
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: '/', cancelable: true }),
    )
    expect(element.commandContext).to.equal('/')
    element.value = ''
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: '!', cancelable: true }),
    )
    expect(element.commandContext).to.equal('/')
    element.value = ''
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: '\\', cancelable: true }),
    )
    expect(element.commandContext).to.equal('/')
    element.value = ''
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: '<', cancelable: true }),
    )
    expect(element.commandContext).to.equal('>')
    element.value = ''
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: '>', cancelable: true }),
    )
    expect(element.commandContext).to.equal('>')
    // with text typed the key is treated as text
    element.value = 'text'
    element.commandContext = '*'
    element._inputKeydown(
      new KeyboardEvent('keydown', { key: '/', cancelable: true }),
    )
    expect(element.commandContext).to.equal('*')
  })

  it('_inputKeydown ignores keys while disabled', () => {
    element.disabled = true
    element.value = ''
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
    // non-program with empty value resets the context
    const el2 = element
    el2.programName = null
    el2.value = ''
    el2.commandContext = '/'
    el2._inputKeydown(
      new KeyboardEvent('keydown', { key: 'Backspace', cancelable: true }),
    )
    expect(el2.commandContext).to.equal('*')
  })

  it('inputfilterChanged routes typed text into value', () => {
    const e = {
      target: { value: 'hello' },
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
      preventDefault: () => {},
    }
    element.inputfilterChanged(e)
    expect(element.value).to.equal('hello')
  })

  it('inputfilterChanged intercepts context characters and clears the field', () => {
    const e = {
      target: { value: '/' },
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
      preventDefault: () => {},
    }
    element.value = ''
    element.inputfilterChanged(e)
    expect(element.commandContext).to.equal('/')
    expect(e.target.value).to.equal('')
  })

  it('inputfilterChanged does nothing while disabled', () => {
    element.disabled = true
    const e = {
      target: { value: 'x' },
      stopPropagation: () => {},
      stopImmediatePropagation: () => {},
      preventDefault: () => {},
    }
    element.inputfilterChanged(e)
    expect(element.value).to.equal(null)
  })

  it('suggestPossibleAction names the dropped mime type', () => {
    const out = element.suggestPossibleAction('image/png')
    expect(out).to.contain('Drop')
    expect(out).to.contain('here for options')
    const plain = element.suggestPossibleAction(false)
    expect(element.possibleActions.includes(plain)).to.equal(true)
  })

  it('randomOption handles empty and populated option lists', () => {
    expect(element.randomOption([])).to.equal(undefined)
    expect(element.randomOption()).to.equal(undefined)
    expect(element.randomOption(['a'])).to.equal('a')
  })

  it('dispatches focused-changed when focus toggles', async () => {
    let focused = null
    element.addEventListener('focused-changed', (e) => (focused = e.detail.value))
    element.fieldFocus()
    await element.updateComplete
    expect(focused).to.equal(true)
    expect(element.hasAttribute('focused')).to.equal(true)
    element.fieldFocusLoss()
    await element.updateComplete
    expect(focused).to.equal(false)
    expect(element.hasAttribute('focused')).to.equal(false)
  })

  it('dispatches value-changed when value changes', async () => {
    let value = null
    element.addEventListener('value-changed', (e) => (value = e.detail.value))
    element.value = 'x'
    await element.updateComplete
    expect(value).to.equal('x')
  })

  it('dispatches command-context-changed when context changes', async () => {
    let ctx = null
    element.addEventListener(
      'command-context-changed',
      (e) => (ctx = e.detail.value),
    )
    element.commandContext = '/'
    await element.updateComplete
    expect(ctx).to.equal('/')
  })

  it('dispatches listening-for-input-changed when listening changes', async () => {
    let listening = null
    element.addEventListener(
      'listening-for-input-changed',
      (e) => (listening = e.detail.value),
    )
    element.listeningForInput = true
    await element.updateComplete
    expect(listening).to.equal(true)
    element.listeningForInput = false
    await element.updateComplete
    expect(listening).to.equal(false)
  })

  it('updates possible actions for standard, wand, and open wand states', () => {
    const sdi = globalThis.SuperDaemonManager.requestAvailability()
    element.t = {
      ...element.t,
      insertBlocks: 'Insert blocks',
      findMedia: 'Find media',
      submitIdeas: 'Submit your ideas',
      dropFilesHere: 'Drop files here',
      typeWhatYouWant: 'Type what you want',
      opensMemoryPalace: 'opens Merlin',
      clickToDoAnything: 'Click to do anything!',
    }
    element.wand = false
    element._updatePossibleActions()
    expect(element.possibleActions.join(' ').includes('Insert blocks')).to.equal(
      true,
    )
    element.wand = true
    sdi.opened = false
    element._updatePossibleActions()
    expect(element.possibleActions[0].includes(sdi.key1)).to.equal(true)
    expect(
      element.possibleActions.join(' ').includes('opens Merlin'),
    ).to.equal(true)
    sdi.opened = true
    element._updatePossibleActions()
    expect(
      element.possibleActions.join(' ').includes('Submit your ideas'),
    ).to.equal(true)
    sdi.opened = false
  })

  it('updates the placeholder from program, droppable, and default states', async () => {
    const inputField = () =>
      element.shadowRoot.querySelector('#inputfilter')
    element.programPlaceholder = 'Custom placeholder'
    element._updatePlaceholder()
    expect(inputField().placeholder).to.equal('Custom placeholder')
    element.programPlaceholder = ''
    element.droppableType = 'image/png'
    element._updatePlaceholder()
    expect(inputField().placeholder).to.contain('Drop')
    element.droppableType = null
    element._updatePlaceholder()
    expect(typeof inputField().placeholder === 'string').to.equal(true)
    expect(inputField().placeholder.length > 0).to.equal(true)
  })

  it('updates the placeholder when droppableType changes through updated', async () => {
    element.droppableType = 'image/png'
    await element.updateComplete
    expect(
      element.shadowRoot.querySelector('#inputfilter').placeholder,
    ).to.contain('Drop')
  })

  it('clears dragover when droppable turns off', async () => {
    element.droppable = true
    element.dragover = true
    await element.updateComplete
    element.droppable = false
    await element.updateComplete
    expect(element.dragover).to.equal(false)
  })

  it('focusInput and selectInput target the field after a tick', async () => {
    element.focusInput()
    await aTimeout(20)
    expect(document.activeElement === document.body).to.equal(false)
    element.selectInput()
    await aTimeout(20)
    expect(element.shadowRoot.querySelector('#inputfilter')).to.exist
  })

  it('updates possible actions when wand state changes via updated', async () => {
    element.t = {
      ...element.t,
      insertBlocks: 'Insert blocks',
      findMedia: 'Find media',
      opensMemoryPalace: 'opens Merlin',
      clickToDoAnything: 'Click to do anything!',
      dropFilesHere: 'Drop files here',
    }
    element.wand = true
    await element.updateComplete
    expect(
      element.possibleActions.join(' ').includes('opens Merlin'),
    ).to.equal(true)
  })
})
