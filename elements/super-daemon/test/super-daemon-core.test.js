import { fixture, expect, html, aTimeout } from '@open-wc/testing'
import '../super-daemon.js'

// Behavioral coverage for the top-level SuperDaemon (Merlin) element:
// option registration + index building, program execution, window events,
// keyboard activation, Konami code, context management, santa/voice flows.
describe('SuperDaemon core behavior', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`<super-daemon></super-daemon>`)
    // reset fixture state between tests
    element.allItems = []
    element.items = []
    element.context = []
    element.commandContext = '*'
    element.value = ''
    element.like = ''
    element.opened = false
    element.mini = false
    element.wand = false
    element.inlineMode = false
    element.loading = false
    element.programName = null
    element.programPlaceholder = null
    element.programResults = []
    element.programSearch = ''
    element.santaMode = false
    element.voiceCommands = {}
    element.hal = null
    element.konamiProgress = []
    // keep the singleton from bleeding state into event driven tests
    const sdi = globalThis.SuperDaemonManager.requestAvailability()
    sdi.value = ''
    sdi.opened = false
    sdi.mini = false
    sdi.wand = false
    sdi.santaMode = false
    sdi.listeningForInput = false
    sdi.programName = null
  })

  it('registers the santa option on firstUpdated', async () => {
    const sdi = globalThis.SuperDaemonManager.requestAvailability()
    const found = sdi.allItems.filter((i) => i.title === 'Toggle Santa Mode')
    expect(found.length > 0).to.equal(true)
    expect(found[0].value.method).to.equal('toggleSantaMode')
    expect(found[0].path).to.equal('>settings/hohoho')
  })

  it('defineOption builds a search index and fills defaults', () => {
    element.defineOption({
      title: 'Insert blocks',
      value: { x: 1 },
      eventName: 'test-event',
      tags: ['block'],
      path: 'CMS/blocks/insert',
    })
    expect(element.allItems.length).to.equal(1)
    const item = element.allItems[0]
    expect(item.priority).to.equal(0)
    expect(item.context).to.equal('*')
    expect(item.inline).to.equal(false)
    expect(item.index).to.contain('insert')
    expect(item.index).to.contain('blocks')
    expect(item.index).to.contain('CMS/blocks/insert')
  })

  it('defineOption resolves an unknown shortcut id to an empty label', () => {
    element.defineOption({
      title: 'Save',
      value: {},
      eventName: 'save-event',
      shortcut: 'nonexistent-shortcut-id',
    })
    expect(element.allItems[0].shortcutLabel).to.equal('')
  })

  it('defineOption ignores malformed options', () => {
    element.defineOption(null)
    element.defineOption({ title: 'no value' })
    element.defineOption({ value: {}, title: 'no eventName' })
    element.defineOption({ value: {}, eventName: 'no title' })
    expect(element.allItems.length).to.equal(0)
  })

  it('registers options from the super-daemon-define-option event', () => {
    globalThis.dispatchEvent(
      new CustomEvent('super-daemon-define-option', {
        detail: {
          title: 'Event option',
          value: {},
          eventName: 'e2',
        },
      }),
    )
    expect(
      element.allItems.filter((i) => i.title === 'Event option').length,
    ).to.equal(1)
  })

  it('elementMethod invokes the named method on the target', () => {
    let called = []
    const target = {
      doThing: function (...args) {
        called = args
      },
    }
    globalThis.dispatchEvent(
      new CustomEvent('super-daemon-element-method', {
        detail: { target: target, method: 'doThing', args: ['a', 1] },
      }),
    )
    expect(called.join(',')).to.equal('a,1')
    // default args when none supplied
    globalThis.dispatchEvent(
      new CustomEvent('super-daemon-element-method', {
        detail: { target: target, method: 'doThing' },
      }),
    )
    expect(called.length).to.equal(0)
  })

  it('elementClick dispatches a click on the target', () => {
    let clicked = false
    const target = document.createElement('button')
    target.addEventListener('click', () => (clicked = true))
    globalThis.dispatchEvent(
      new CustomEvent('super-daemon-element-click', {
        detail: { target: target },
      }),
    )
    expect(clicked).to.equal(true)
  })

  it('keyHandler toggles opened with Shift+Alt', async () => {
    globalThis.dispatchEvent(
      new KeyboardEvent('keydown', {
        shiftKey: true,
        altKey: true,
        key: 'Alt',
      }),
    )
    await element.updateComplete
    expect(element.opened).to.equal(true)
    expect(element.hasAttribute('opened')).to.equal(true)
    globalThis.dispatchEvent(
      new KeyboardEvent('keydown', {
        shiftKey: true,
        altKey: true,
        key: 'Alt',
      }),
    )
    await element.updateComplete
    expect(element.opened).to.equal(false)
  })

  it('keyHandler Escape closes an open daemon', async () => {
    element.opened = true
    element.mini = true
    globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await element.updateComplete
    expect(element.opened).to.equal(false)
  })

  it('detects the Konami code, clears input, and fires the event', async () => {
    let fired = false
    const handler = () => (fired = true)
    globalThis.addEventListener('super-daemon-konami-code', handler)
    element.opened = true
    element.value = 'ba'
    const seq = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a',
    ]
    seq.forEach((key) => {
      globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: key }))
    })
    await aTimeout(50)
    expect(fired).to.equal(true)
    expect(element.value).to.equal('')
    expect(element.konamiProgress.length).to.equal(0)
    globalThis.removeEventListener('super-daemon-konami-code', handler)
  })

  it('resets Konami progress on a wrong key and via resetKonamiCode', () => {
    element.checkKonamiCode(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    expect(element.konamiProgress.length).to.equal(1)
    element.checkKonamiCode(new KeyboardEvent('keydown', { key: 'x' }))
    expect(element.konamiProgress.length).to.equal(0)
    // wrong key that starts a new sequence counts as progress
    element.checkKonamiCode(new KeyboardEvent('keydown', { key: 'ArrowUp' }))
    element.resetKonamiCode()
    expect(element.konamiProgress.length).to.equal(0)
    expect(element.konamiTimeout).to.equal(null)
  })

  it('filterItems sorts alphabetically then by exact-match priority', () => {
    element.defineOption({ title: 'Zebra', value: {}, eventName: 'e' })
    element.defineOption({ title: 'Apple', value: {}, eventName: 'e' })
    element.defineOption({ title: 'Mango', value: {}, eventName: 'e' })
    const filtered = element.filterItems(element.allItems, [])
    expect(filtered.map((i) => i.title).join(',')).to.equal('Apple,Mango,Zebra')
    // exact title match floats to the top regardless of order
    element.value = 'mango'
    const filtered2 = element.filterItems(element.allItems, [])
    expect(filtered2[0].title).to.equal('Mango')
    expect(filtered2[0].priority).to.equal(-10000000)
    element.value = ''
  })

  it('filterItems drops hidden items and honors inline gating', () => {
    element.defineOption({
      title: 'Hidden gem',
      value: {},
      eventName: 'e',
      hidden: true,
    })
    element.defineOption({
      title: 'Emoji picker',
      value: {},
      eventName: 'e',
      inlineOnly: true,
    })
    element.defineOption({
      title: 'Inline item',
      value: {},
      eventName: 'e',
      inline: true,
    })
    element.defineOption({ title: 'Plain', value: {}, eventName: 'e' })
    const normal = element.filterItems(element.allItems, [])
    expect(normal.map((i) => i.title).join(',')).to.equal(
      'Inline item,Plain',
    )
    element.inlineMode = true
    const inline = element.filterItems(element.allItems, [])
    expect(inline.map((i) => i.title).join(',')).to.equal('Emoji picker,Inline item')
    element.inlineMode = false
  })

  it('filterItems matches item context against commandContext', () => {
    element.defineOption({
      title: 'CMS only',
      value: {},
      eventName: 'e',
      context: ['CMS'],
    })
    element.defineOption({
      title: 'Any context',
      value: {},
      eventName: 'e',
      context: '*',
    })
    element.commandContext = 'CMS'
    const scoped = element.filterItems(element.allItems, [])
    expect(scoped.map((i) => i.title).join(',')).to.equal('Any context,CMS only')
    element.commandContext = '/'
    const other = element.filterItems(element.allItems, [])
    expect(other.map((i) => i.title).join(',')).to.equal('Any context')
    element.commandContext = '*'
    const globalCtx = element.filterItems(element.allItems, ['CMS'])
    expect(globalCtx.map((i) => i.title).join(',')).to.equal(
      'Any context,CMS only',
    )
    element.commandContext = '*'
  })

  it('appendContext and removeContext manage the context list', () => {
    element.appendContext('CMS')
    element.appendContext('CMS')
    expect(element.context.join(',')).to.equal('CMS')
    element.appendContext('RTE')
    expect(element.context.join(',')).to.equal('CMS,RTE')
    element.removeContext('CMS')
    expect(element.context.join(',')).to.equal('RTE')
    element.removeContext('not-there')
    element.removeContext(null)
    expect(element.context.join(',')).to.equal('RTE')
    element.context = []
  })

  it('runProgram executes a function program and tracks results', async () => {
    let calls = []
    const program = async (search, values) => {
      calls.push([search, values])
      return [{ title: 'Result ' + search }]
    }
    await element.runProgram(
      'blocks',
      '/',
      { page: 1 },
      program,
      'Test program',
      '',
      'Type here',
    )
    expect(element.programName).to.equal('Test program')
    expect(element.programPlaceholder).to.equal('Type here')
    expect(element.commandContext).to.equal('/')
    expect(element.like).to.equal('blocks')
    expect(element.programSearch).to.equal('blocks')
    expect(element.value).to.equal('blocks')
    expect(element.loading).to.equal(true)
    await aTimeout(120)
    expect(calls.length).to.equal(1)
    expect(calls[0][0]).to.equal('blocks')
    expect(calls[0][1].page).to.equal(1)
    expect(element.loading).to.equal(false)
    expect(element.programResults[0].title).to.equal('Result blocks')
  })

  it('runProgram resolves a string program name from allItems', async () => {
    const program = async (search) => [{ title: 'P ' + search }]
    element.defineOption({
      title: 'String program',
      value: {
        machineName: 'string-program',
        program: program,
        placeholder: 'Search things',
      },
      eventName: 'super-daemon-run-program',
    })
    await element.runProgram(null, '/', {}, 'string-program', 'SP')
    expect(element.programPlaceholder).to.equal('Search things')
    await aTimeout(120)
    expect(element.programResults[0].title).to.equal('P ')
  })

  it('runProgram promotes initialValue when launched generically', async () => {
    const program = async (search) => [{ title: 'r ' + search }]
    element.defineOption({
      title: 'Initial value program',
      value: {
        machineName: 'iv-program',
        program: program,
        initialValue: async () => 'seed text',
      },
      eventName: 'super-daemon-run-program',
    })
    await element.runProgram(null, '/', {}, 'iv-program', 'IV')
    expect(element.like).to.equal('seed text')
    expect(element.programSearch).to.equal('seed text')
    await aTimeout(120)
    expect(element.programResults[0].title).to.equal('r seed text')
  })

  it('runProgram reports an error for an unknown program name', async () => {
    let logged = null
    const origError = console.error
    console.error = (msg) => (logged = msg)
    await element.runProgram(null, '/', {}, 'does-not-exist', 'X')
    console.error = origError
    expect(logged).to.equal('Incorrect program called')
    expect(element.programResults.length).to.equal(0)
  })

  it('runProgram resets the placeholder when no program is active', async () => {
    element.programPlaceholder = 'leftover'
    await element.runProgram(null, '/', {}, null, null)
    expect(element.programPlaceholder).to.equal(null)
    expect(element.programResults.length).to.equal(0)
  })

  it('runProgram clears loading when a program throws', async () => {
    const bad = async () => {
      throw new Error('boom')
    }
    await element.runProgram(null, '/', {}, bad, 'Bad')
    expect(element.loading).to.equal(true)
    await aTimeout(120)
    expect(element.loading).to.equal(false)
  })

  it('runProgramEvent launches a program from event detail', async () => {
    let ran = null
    const program = async (search) => {
      ran = search
      return [{ title: 'E' }]
    }
    globalThis.dispatchEvent(
      new CustomEvent('super-daemon-run-program', {
        detail: {
          context: '/',
          program: program,
          name: 'EP',
          placeholder: 'ep',
          value: { keep: true },
        },
      }),
    )
    await aTimeout(120)
    expect(ran).to.equal('')
    expect(element.programName).to.equal('EP')
  })

  it('runProgramEvent resets state when the detail is missing', async () => {
    element.runProgramEvent({ detail: false })
    expect(element.commandContext).to.equal('/')
    expect(element.like).to.equal('')
    expect(element.programResults.length).to.equal(0)
  })

  it('handleProgramEnter creates a page via the site editor UI', async () => {
    let created = null
    const fakeEditor = {
      createPageWithTitle: (title, type, template) => {
        created = [title, type, template]
      },
    }
    const origQS = globalThis.document.querySelector
    globalThis.document.querySelector = (sel) =>
      sel === 'haxcms-site-editor-ui'
        ? fakeEditor
        : origQS.call(globalThis.document, sel)
    element._programValues = { type: 'child', templateContent: 'tpl' }
    globalThis.dispatchEvent(
      new CustomEvent('super-daemon-program-enter', {
        detail: { programName: 'create-page', input: 'My page' },
      }),
    )
    globalThis.document.querySelector = origQS
    expect(created[0]).to.equal('My page')
    expect(created[1]).to.equal('child')
    expect(created[2]).to.equal('tpl')
    // fallback type when _programValues has no type
    let created2 = null
    fakeEditor.createPageWithTitle = (title, type) => {
      created2 = [title, type]
    }
    globalThis.document.querySelector = (sel) =>
      sel === 'haxcms-site-editor-ui'
        ? fakeEditor
        : origQS.call(globalThis.document, sel)
    element._programValues = {}
    globalThis.dispatchEvent(
      new CustomEvent('super-daemon-program-enter', {
        detail: { programName: 'create-page', input: 'Second page' },
      }),
    )
    globalThis.document.querySelector = origQS
    expect(created2[1]).to.equal('sibling')
  })

  it('handleProgramEnter ignores other program names', async () => {
    let created = false
    const fakeEditor = {
      createPageWithTitle: () => (created = true),
    }
    const origQS = globalThis.document.querySelector
    globalThis.document.querySelector = (sel) =>
      sel === 'haxcms-site-editor-ui'
        ? fakeEditor
        : origQS.call(globalThis.document, sel)
    globalThis.dispatchEvent(
      new CustomEvent('super-daemon-program-enter', {
        detail: { programName: 'other-program', input: 'x' },
      }),
    )
    globalThis.document.querySelector = origQS
    expect(created).to.equal(false)
  })

  it('waveWand opens mini wand mode and runs the program', async () => {
    let ran = null
    const program = async (search) => {
      ran = search
      return []
    }
    const target = document.createElement('div')
    document.body.appendChild(target)
    element.wandTarget = target
    await element.waveWand(
      ['blocks', '/', {}, program, 'Wand'],
      target,
      'coin2',
    )
    expect(element.mini).to.equal(true)
    expect(element.wand).to.equal(true)
    expect(element.activeNode === target).to.equal(true)
    expect(element.opened).to.equal(true)
    expect(element.inlineMode).to.equal(false)
    await aTimeout(120)
    expect(ran).to.equal('blocks')
    element.close()
  })

  it('waveWand uses full mode on mobile for page creation programs', async () => {
    let ran = null
    const program = async (search) => {
      ran = search
      return []
    }
    const origMM = globalThis.matchMedia
    globalThis.matchMedia = () => ({ matches: true })
    await element.waveWand(['create-page', '/', {}, program, 'CP'])
    globalThis.matchMedia = origMM
    expect(element.mini).to.equal(false)
    expect(element.wand).to.equal(false)
    expect(element.activeNode).to.equal(null)
    expect(element.opened).to.equal(true)
    await aTimeout(120)
    expect(ran).to.equal('create-page')
    element.close()
  })

  it('open filters items to the current context', async () => {
    element.defineOption({
      title: 'Ctx item',
      value: {},
      eventName: 'e',
      context: ['CMS'],
    })
    element.context = ['CMS']
    element.open()
    await element.updateComplete
    await aTimeout(20)
    expect(element.opened).to.equal(true)
    expect(element.items.length).to.equal(1)
    expect(element.items[0].title).to.equal('Ctx item')
  })

  it('close resets the session state and clears the search input', async () => {
    element.opened = true
    element.like = 'zzz'
    element.value = 'zzz'
    element.commandContext = '/'
    element.programName = 'P'
    element.programResults = [{ title: 'r' }]
    await element.updateComplete
    // flush stale child (ui) commandContext updates before closing so a
    // pending super-daemon-command-context-changed dispatch out of
    // super-daemon-ui.updated() cannot race the close() reset
    await aTimeout(20)
    element.close()
    await element.updateComplete
    await aTimeout(20)
    expect(element.opened).to.equal(false)
    expect(element.like).to.equal('')
    expect(element.value).to.equal('')
    expect(element.commandContext).to.equal('*')
    expect(element.programName).to.equal(null)
    expect(element.programResults.length).to.equal(0)
    const ui = element.shadowRoot.querySelector('super-daemon-ui')
    expect(ui.like).to.equal('')
    expect(ui.programSearch).to.equal('')
    const search = ui.shadowRoot.querySelector('super-daemon-search')
    expect(search.value).to.equal('')
    const inputField = search.shadowRoot.querySelector('#inputfilter')
    expect(inputField.value).to.equal('')
  })

  it('close hides the toast when called from a non-close event', async () => {
    let toastHidden = false
    const th = () => (toastHidden = true)
    globalThis.addEventListener('super-daemon-toast-hide', th)
    element.opened = true
    element.close(new CustomEvent('selection-made'))
    await aTimeout(20)
    expect(toastHidden).to.equal(true)
    globalThis.removeEventListener('super-daemon-toast-hide', th)
  })

  it('close from a super-daemon-close event does not re-dispatch', async () => {
    element.opened = true
    let closeEvents = 0
    const h = () => closeEvents++
    globalThis.addEventListener('super-daemon-close', h)
    globalThis.dispatchEvent(new CustomEvent('super-daemon-close'))
    await aTimeout(20)
    globalThis.removeEventListener('super-daemon-close', h)
    expect(element.opened).to.equal(false)
    // fixed (was a documented swarm bug): the re-entry from web-dialog's
    // native close event (fired by the ?open binding flip) no longer
    // re-dispatches super-daemon-close. The only counted event is the one
    // this test dispatched itself.
    expect(closeEvents).to.equal(1)
  })

  it('a user close dispatches super-daemon-close exactly once', async () => {
    // Regression (was a documented swarm bug): close() dispatched the global
    // super-daemon-close event TWICE for every user-visible close -- once
    // directly from close() and once via web-dialog's native close event
    // re-entering close() through the @close binding after the ?open flip.
    // close() now guards the re-entry so exactly one dispatch fires.
    element.opened = true
    await element.updateComplete
    let closeEvents = 0
    const h = () => closeEvents++
    globalThis.addEventListener('super-daemon-close', h)
    element.close(new MouseEvent('click'))
    await aTimeout(20)
    globalThis.removeEventListener('super-daemon-close', h)
    expect(element.opened).to.equal(false)
    expect(closeEvents).to.equal(1)
  })

  it('close neutralizes a pending child commandContext update', async () => {
    // Regression (was a documented swarm bug): a
    // super-daemon-command-context-changed dispatch scheduled out of
    // super-daemon-ui.updated() before close() ran could land AFTER close()
    // reset commandContext to '*' and overwrite the reset with the stale
    // child value. close() now resets the child context in the same tick so
    // the pending dispatch cannot win the race.
    element.opened = true
    await element.updateComplete
    const ui = element.shadowRoot.querySelector('super-daemon-ui')
    // route through the child the way a user context keypress does so a
    // child-side update + dispatch is pending when close runs
    ui.commandContext = '/'
    element.close()
    await element.updateComplete
    await aTimeout(20)
    expect(element.commandContext).to.equal('*')
    expect(ui.commandContext).to.equal('*')
  })

  it('close restores a stripped inline token when cancelled without selection', async () => {
    const node = document.createElement('div')
    node.textContent = 'base'
    document.body.appendChild(node)
    const sel = globalThis.document.getSelection()
    const range = document.createRange()
    range.selectNodeContents(node)
    sel.removeAllRanges()
    sel.addRange(range)
    element.inlineTextInsert = true
    element.__inlineShortcutToken = ':: '
    element.activeNode = node
    element.activeRange = range
    element.activeSelection = sel
    element.opened = true
    element.close()
    expect(element.inlineTextInsert).to.equal(false)
    expect(element.__inlineShortcutToken).to.equal(null)
    expect(element.__inlineShortcutSuppressNext).to.equal(true)
    node.remove()
  })

  it('miniCancel restores the active node text when not in wand mode', async () => {
    const node = document.createElement('div')
    node.textContent = 'original'
    document.body.appendChild(node)
    const sel = globalThis.document.getSelection()
    const range = document.createRange()
    range.selectNodeContents(node)
    sel.removeAllRanges()
    sel.addRange(range)
    element.mini = true
    element.wand = false
    element.activeNode = node
    element.activeRange = range
    element.activeSelection = sel
    element.value = 'typed value'
    element.inlineTextInsert = false
    element.opened = true
    element.miniCancel()
    expect(node.textContent).to.equal('typed value')
    expect(element.opened).to.equal(false)
    node.remove()
  })

  it('clickOnMiniMode re-arms for synthetic events and closes for outside clicks', async () => {
    element.mini = true
    element.opened = true
    // synthetic (not trusted) event re-arms instead of consuming
    element.clickOnMiniMode({
      isTrusted: false,
      composedPath: () => [element],
    })
    expect(element.opened).to.equal(true)
    // a trusted click outside Merlin closes mini mode
    element.clickOnMiniMode({
      isTrusted: true,
      composedPath: () => [document.body],
    })
    expect(element.opened).to.equal(false)
  })

  it('clickOnMiniMode ignores clicks when not in mini mode', () => {
    element.mini = false
    element.opened = false
    element.clickOnMiniMode({ isTrusted: true, composedPath: () => [] })
    expect(element.opened).to.equal(false)
  })

  it('setListeningStatus forces listening in santa mode', () => {
    element.santaMode = true
    element.setListeningStatus(false)
    expect(element.listeningForInput).to.equal(true)
    element.santaMode = false
    element.setListeningStatus(true)
    expect(element.listeningForInput).to.equal(true)
    element.setListeningStatus(false)
    expect(element.listeningForInput).to.equal(false)
  })

  it('toggleSantaMode flips mode and syncs listening via hal', async () => {
    const spoke = []
    element.hal = {
      speak: (phrase) => {
        spoke.push(phrase)
        return Promise.resolve(true)
      },
      setToast: (t) => spoke.push('toast:' + t),
    }
    element.toggleSantaMode()
    expect(element.santaMode).to.equal(true)
    await element.updateComplete
    expect(element.hasAttribute('santa-mode')).to.equal(true)
    await aTimeout(20)
    expect(spoke[0]).to.equal(element.t.santaModeActivated)
    expect(element.listeningForInput).to.equal(true)
    element.toggleSantaMode()
    await aTimeout(20)
    expect(element.santaMode).to.equal(false)
    expect(element.hasAttribute('santa-mode')).to.equal(false)
    expect(element.listeningForInput).to.equal(false)
  })

  it('merlinSpeak speaks then closes', async () => {
    let spoke = null
    element.hal = {
      speak: (p) => {
        spoke = p
        return Promise.resolve()
      },
    }
    element.opened = true
    element.merlinSpeak('hi')
    expect(spoke).to.equal('hi')
    await aTimeout(20)
    expect(element.opened).to.equal(false)
  })

  it('promptMerlin opens and enables listening after speaking', async () => {
    element.hal = { speak: () => Promise.resolve() }
    element.promptMerlin()
    expect(element.opened).to.equal(true)
    expect(element.__closeLock).to.equal(true)
    await aTimeout(20)
    expect(element.listeningForInput).to.equal(true)
    expect(element.__closeLock).to.equal(false)
  })

  it('stopMerlin speaks in santa mode but santa keeps listening', () => {
    const spoke = []
    element.hal = {
      speak: (p) => {
        spoke.push(p)
        return Promise.resolve()
      },
    }
    element.santaMode = true
    element.listeningForInput = true
    element.stopMerlin()
    expect(spoke.length).to.equal(1)
    // santa mode intentionally forces listening to stay on
    expect(element.listeningForInput).to.equal(true)
    element.santaMode = false
    element.stopMerlin()
    expect(element.listeningForInput).to.equal(false)
  })

  it('closeMerlin closes after speaking when not santa', async () => {
    element.hal = { speak: () => Promise.resolve() }
    element.opened = true
    element.closeMerlin()
    await aTimeout(20)
    expect(element.opened).to.equal(false)
  })

  it('closeMerlin closes immediately in santa mode', () => {
    element.santaMode = true
    element.opened = true
    element.closeMerlin()
    expect(element.opened).to.equal(false)
  })

  it('belsnickel disables santa mode', async () => {
    element.hal = {
      speak: () => Promise.resolve(),
      setToast: () => {},
    }
    element.santaMode = true
    element.belsnickel()
    expect(element.santaMode).to.equal(false)
    await aTimeout(20)
    // when santa mode is already off it is a no-op
    element.belsnickel()
    expect(element.santaMode).to.equal(false)
  })

  it('defaultVoiceCommands registers the full command map', () => {
    element.defaultVoiceCommands()
    const keys = Object.keys(element.voiceCommands)
    expect(keys.includes('(hey) merlin')).to.equal(true)
    expect(keys.includes('(hey) marilyn')).to.equal(true)
    expect(keys.includes('stop listening')).to.equal(true)
    expect(keys.includes('close merlin')).to.equal(true)
    expect(keys.includes('cancel merlin')).to.equal(true)
    expect(keys.includes('disable santa (mode)')).to.equal(true)
    expect(keys.includes('belsnickel')).to.equal(true)
    expect(keys.includes('scroll up')).to.equal(true)
    expect(keys.includes('scroll (down)')).to.equal(true)
    expect(keys.includes('scroll (to) bottom')).to.equal(true)
    expect(keys.includes('scroll (to) top')).to.equal(true)
    expect(keys.includes('back to top')).to.equal(true)
    expect(keys.includes('(run) program')).to.equal(true)
    expect(keys.includes('developer (mode)')).to.equal(true)
    expect(keys.includes('*anything')).to.equal(true)
  })

  it('voice scroll commands drive window scrolling', () => {
    element.defaultVoiceCommands()
    const origScrollBy = globalThis.scrollBy
    const origScrollTo = globalThis.scrollTo
    let by = null
    let to = null
    globalThis.scrollBy = (opts) => (by = opts.top)
    globalThis.scrollTo = (x, y) => (to = [x, y])
    element.voiceCommands['scroll up']()
    expect(by).to.equal(-(globalThis.innerHeight * 0.5))
    element.voiceCommands['scroll (down)']()
    expect(by).to.equal(globalThis.innerHeight * 0.5)
    element.voiceCommands['scroll (to) bottom']()
    expect(to[1]).to.equal(globalThis.document.body.scrollHeight)
    element.voiceCommands['scroll (to) top']()
    expect(to.join(',')).to.equal('0,0')
    element.voiceCommands['back to top']()
    expect(to.join(',')).to.equal('0,0')
    globalThis.scrollBy = origScrollBy
    globalThis.scrollTo = origScrollTo
  })

  it('voice mode commands switch the command context', () => {
    element.defaultVoiceCommands()
    element.voiceCommands['(run) program']()
    expect(element.commandContext).to.equal('/')
    element.voiceCommands['developer (mode)']()
    expect(element.commandContext).to.equal('>')
    element.commandContext = '*'
  })

  it('addVoiceCommand binds context callbacks and resolves :name:', () => {
    const ctx = {
      hit: false,
      cb: function () {
        this.hit = true
      },
    }
    element.addVoiceCommand('(hey) :name:', ctx, 'cb')
    expect(typeof element.voiceCommands['(hey) merlin']).to.equal('function')
    element.voiceCommands['(hey) merlin']()
    expect(ctx.hit).to.equal(true)
    // without context the command is ignored
    element.voiceCommands = {}
    element.addVoiceCommand('nope', null, 'cb')
    expect(Object.keys(element.voiceCommands).length).to.equal(0)
  })

  it('_addVoiceCommand registers via a detail context or the event target', () => {
    const ctx = {
      hit: false,
      cb: function () {
        this.hit = true
      },
    }
    element._addVoiceCommand({
      detail: { command: 'vc one', context: ctx, callback: 'cb' },
    })
    expect(typeof element.voiceCommands['vc one']).to.equal('function')
    element.voiceCommands['vc one']()
    expect(ctx.hit).to.equal(true)
    // fallback to e.target when no context supplied
    const ctx2 = {
      hit: false,
      cb: function () {
        this.hit = true
      },
    }
    element._addVoiceCommand({
      detail: { command: 'vc two', callback: 'cb' },
      target: ctx2,
    })
    expect(typeof element.voiceCommands['vc two']).to.equal('function')
    element.voiceCommands['vc two']()
    expect(ctx2.hit).to.equal(true)
  })

  it('updateSearchInputViaVoice fills the ui input and stops listening', async () => {
    element.updateSearchInputViaVoice('voice typed')
    const ui = element.shadowRoot.querySelector('super-daemon-ui')
    expect(ui.like).to.equal('voice typed')
    await aTimeout(20)
    expect(element.listeningForInput).to.equal(false)
  })

  it('inputfilterChanged debounces program execution', async () => {
    const program = async (search) => [{ title: 'r ' + search }]
    element.programName = 'P'
    element._programToRun = program
    element._programValues = {}
    await element.inputfilterChanged({ detail: { value: 'ab' } })
    expect(element.value).to.equal('ab')
    // non-empty typing keeps prior results visible until the debounce fires
    expect(element.loading).to.equal(false)
    await aTimeout(200)
    expect(element.loading).to.equal(false)
    expect(element.programResults[0].title).to.equal('r ab')
    // clearing the input flips loading immediately before the debounce
    await element.inputfilterChanged({ detail: { value: '' } })
    expect(element.loading).to.equal(true)
    await aTimeout(200)
    expect(element.loading).to.equal(false)
  })

  it('inputfilterChanged outside a program refilters items', async () => {
    element.programName = null
    element._programToRun = null
    element.defineOption({ title: 'Zebra', value: {}, eventName: 'e' })
    await element.inputfilterChanged({ detail: { value: 'x' } })
    expect(element.value).to.equal('x')
    expect(element.programResults.length).to.equal(0)
    expect(element.items.length).to.equal(1)
  })

  it('itemsForDisplay returns program results only in program mode', () => {
    element.programName = 'X'
    expect(element.itemsForDisplay([1], [2])[0]).to.equal(2)
    element.programName = null
    expect(element.itemsForDisplay([1], [2])[0]).to.equal(1)
  })

  it('commandContextChanged switches recognized contexts and resets on empty', () => {
    element.defineOption({
      title: 'Slash item',
      value: {},
      eventName: 'e',
      context: ['/', 'CMS'],
    })
    element.commandContextChanged({ detail: { value: '/' } })
    expect(element.commandContext).to.equal('/')
    expect(element.items.length).to.equal(1)
    // unrecognized values are ignored
    element.commandContextChanged({ detail: { value: 'bogus' } })
    expect(element.commandContext).to.equal('/')
    // '>' does not match the item context so items refilter to empty
    element.commandContextChanged({ detail: { value: '>' } })
    expect(element.commandContext).to.equal('>')
    expect(element.items.length).to.equal(0)
    // empty value (backspace) resets to global
    element.commandContextChanged({ detail: {} })
    expect(element.commandContext).to.equal('*')
  })

  it('updated dispatches command-context and context change events', async () => {
    let ctxEvt = null
    let contextEvt = null
    element.addEventListener(
      'super-daemon-command-context-changed',
      (e) => (ctxEvt = e.detail.value),
    )
    element.addEventListener(
      'super-daemon-context-changed',
      (e) => (contextEvt = e.detail.value),
    )
    element.commandContext = '/'
    await element.updateComplete
    expect(ctxEvt).to.equal('/')
    element.context = ['CMS']
    await element.updateComplete
    expect(Array.isArray(contextEvt)).to.equal(true)
    expect(contextEvt.join(',')).to.equal('CMS')
  })

  it('listening state syncs hal and hides the toast when listening stops', async () => {
    const hal = { enabled: null }
    element.hal = hal
    let toastHidden = false
    const th = () => (toastHidden = true)
    globalThis.addEventListener('super-daemon-toast-hide', th)
    element.listeningForInput = true
    await element.updateComplete
    expect(hal.enabled).to.equal(true)
    element.listeningForInput = false
    await element.updateComplete
    expect(hal.enabled).to.equal(false)
    await aTimeout(150)
    expect(toastHidden).to.equal(true)
    globalThis.removeEventListener('super-daemon-toast-hide', th)
  })

  it('focusout refocuses the input when focus leaves the ui', async () => {
    element.opened = true
    const ui = element.shadowRoot.querySelector('super-daemon-ui')
    // related target inside the ui is ignored
    element.focusout({ relatedTarget: ui })
    await aTimeout(20)
    expect(element.opened).to.equal(true)
    // focus leaving entirely re-focuses the search input
    element.focusout({ relatedTarget: null })
    await aTimeout(20)
    expect(element.opened).to.equal(true)
  })

  it('likeChanged updates like from the event', () => {
    element.likeChanged({ detail: { value: 'xyz' } })
    expect(element.like).to.equal('xyz')
  })

  it('randomResponse returns one of the provided responses', () => {
    const responses = ['a', 'b']
    expect(responses.includes(element.randomResponse(responses))).to.equal(true)
    expect(element.randomResponse(['only'])).to.equal('only')
  })

  it('playSound dispatches a playaudio event', async () => {
    let sound = null
    const h = (e) => (sound = e.detail.sound)
    globalThis.addEventListener('playaudio', h)
    await element.playSound('coin2')
    expect(sound).to.equal('coin2')
    globalThis.removeEventListener('playaudio', h)
  })

  it('keyHandlerCallback and allowedCallback default to true', () => {
    expect(element.keyHandlerCallback()).to.equal(true)
    expect(element.allowedCallback()).to.equal(true)
  })

  it('noResultsSlot is a no-op hook by default', () => {
    expect(element.noResultsSlot('x')).to.equal(undefined)
  })

  it('SuperDaemonManager.requestAvailability returns one singleton', () => {
    const a = globalThis.SuperDaemonManager.requestAvailability()
    const b = globalThis.SuperDaemonManager.requestAvailability()
    expect(a === b).to.equal(true)
    expect(a.tagName.toLowerCase()).to.equal('super-daemon')
  })

  it('global event listeners survive disconnect/reconnect', async () => {
    // Regression (was a documented swarm bug): super-daemon.js
    // disconnectedCallback aborts windowControllers but connectedCallback
    // never recreated the AbortController, so after an element was
    // disconnected and reconnected all of its globalThis listeners
    // (define-option, element-method, close, etc.) were silently dead because
    // addEventListener with an aborted signal is a no-op. Reconnection now
    // rebuilds the controllers.
    const el = await fixture(html`<super-daemon></super-daemon>`)
    const parent = el.parentElement
    el.remove()
    parent.appendChild(el)
    await el.updateComplete
    globalThis.dispatchEvent(
      new CustomEvent('super-daemon-define-option', {
        detail: { title: 'Reconnect option', value: {}, eventName: 'e3' },
      }),
    )
    expect(
      el.allItems.filter((i) => i.title === 'Reconnect option').length,
    ).to.equal(1)
  })
})
