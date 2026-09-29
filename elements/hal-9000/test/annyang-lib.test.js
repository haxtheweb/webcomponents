import { expect } from '@open-wc/testing'

// direct import of the vendored lib; it installs itself on globalThis.annyang
import '../lib/annyang/annyang.min.js'

describe('annyang (vendored lib)', () => {
  let annyang
  let logs
  let originalLog

  beforeEach(() => {
    annyang = globalThis.annyang
    logs = []
    originalLog = console.log
    console.log = (...args) => {
      logs.push(args)
    }
  })

  afterEach(() => {
    console.log = originalLog
    // leave the lib quiet for the next test
    if (annyang) {
      annyang.debug(false)
      annyang.abort()
    }
  })

  function hasLog(text) {
    return logs.some((args) => args[0] === text)
  }

  // grab the current recognizer and replace its platform methods with
  // deterministic counting stubs (init() swaps the recognizer object)
  function stubRecognizer() {
    const recognizer = annyang.getSpeechRecognizer()
    recognizer.startCalls = recognizer.startCalls || 0
    recognizer.abortCalls = recognizer.abortCalls || 0
    recognizer.start = () => {
      recognizer.startCalls += 1
    }
    recognizer.abort = () => {
      recognizer.abortCalls += 1
    }
    return recognizer
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  it('installs itself globally with the full API', () => {
    expect(annyang).to.exist
    expect(annyang.init).to.be.a('function')
    expect(annyang.start).to.be.a('function')
    expect(annyang.abort).to.be.a('function')
    expect(annyang.pause).to.be.a('function')
    expect(annyang.resume).to.be.a('function')
    expect(annyang.debug).to.be.a('function')
    expect(annyang.setLanguage).to.be.a('function')
    expect(annyang.addCommands).to.be.a('function')
    expect(annyang.removeCommands).to.be.a('function')
    expect(annyang.addCallback).to.be.a('function')
    expect(annyang.removeCallback).to.be.a('function')
    expect(annyang.isListening).to.be.a('function')
    expect(annyang.getSpeechRecognizer).to.be.a('function')
    expect(annyang.trigger).to.be.a('function')
  })

  it('is idle and safe to abort before initialization', () => {
    expect(annyang.isListening()).to.be.false
    expect(annyang.getSpeechRecognizer()).to.be.undefined
    expect(() => annyang.abort()).to.not.throw()
  })

  it('setLanguage initializes a recognizer on first use', () => {
    annyang.setLanguage('en-GB')
    const recognizer = annyang.getSpeechRecognizer()
    expect(recognizer).to.exist
    expect(recognizer.lang).to.equal('en-GB')
    expect(recognizer.maxAlternatives).to.equal(5)
    expect(annyang.isListening()).to.be.false
  })

  it('start begins listening and init(true) clears the command list', () => {
    const recognizer = stubRecognizer()
    annyang.start({ autoRestart: false })
    recognizer.onstart()
    expect(annyang.isListening()).to.be.true
    const probe = []
    annyang.addCommands({ 'init reset probe': () => probe.push(1) })
    // init with resetCommands=true wipes the list
    annyang.init({}, true)
    const noMatch = []
    annyang.addCallback('resultNoMatch', () => noMatch.push(1), null)
    annyang.trigger('init reset probe')
    expect(probe.length).to.equal(0)
    expect(noMatch.length).to.equal(1)
  })

  it('logs command registration while in debug mode', () => {
    annyang.debug(true)
    annyang.addCommands({ hello: () => {} })
    expect(
      logs.some((args) => args[0] === 'Command successfully loaded: %chello'),
    ).to.be.true
    // string values that do not resolve to functions are skipped with a log
    annyang.addCommands({ 'bad command': 'notAFunctionAnywhere' })
    expect(
      logs.some((args) => args[0] === 'Can not register command: %cbad command'),
    ).to.be.true
    // without debug mode the skip is silent
    annyang.debug(false)
    const logCount = logs.length
    annyang.addCommands({ 'bad command two': 'stillNotAFunction' })
    expect(logs.length).to.equal(logCount)
  })

  it('matches splat, named, optional and regexp-object commands', () => {
    const recognizer = stubRecognizer()
    annyang.start({ autoRestart: false })
    recognizer.onstart()
    const captured = {}
    annyang.addCommands({
      'show me *tag': (tag) => {
        captured.splat = tag
      },
      'calculate :month stats': (month) => {
        captured.month = month
      },
      'say hello (to my little) friend': (...args) => {
        captured.friendArgs = args
      },
      'rx thing': {
        regexp: /^rx thing$/,
        callback: () => {
          captured.rx = true
        },
      },
    })
    const matched = []
    annyang.addCallback(
      'resultMatch',
      (phrase, command, results) => {
        matched.push([phrase, command, results])
      },
      null,
    )
    annyang.debug(true)
    annyang.trigger('show me batman and robin')
    expect(captured.splat).to.equal('batman and robin')
    annyang.trigger('calculate october stats')
    expect(captured.month).to.equal('october')
    // parameters are logged in debug mode
    expect(logs.some((args) => args[0] === 'with parameters')).to.be.true
    annyang.trigger('say hello friend')
    // no capture groups means the callback gets the whole match array
    expect(captured.friendArgs).to.deep.equal(['say hello friend'])
    annyang.trigger('rx thing')
    expect(captured.rx).to.be.true
    expect(
      matched.some(
        (entry) =>
          entry[0] === 'calculate october stats' &&
          entry[1] === 'calculate :month stats' &&
          entry[2].length === 1,
      ),
    ).to.be.true
  })

  it('trigger is inert while paused or aborted (with debug messages)', () => {
    const recognizer = stubRecognizer()
    annyang.start({ autoRestart: false })
    recognizer.onstart()
    annyang.debug(true)
    annyang.pause()
    expect(annyang.isListening()).to.be.false
    const pausedBefore = logs.length
    annyang.trigger('hello')
    expect(hasLog('Speech heard, but annyang is paused')).to.be.true
    expect(logs.length).to.be.above(pausedBefore)
    // end listening; still paused but not listening means aborted
    recognizer.onend()
    expect(annyang.isListening()).to.be.false
    annyang.trigger('hello')
    expect(hasLog('Cannot trigger while annyang is aborted')).to.be.true
  })

  it('resumes, fires resultNoMatch, and accepts arrays of alternatives', () => {
    const recognizer = stubRecognizer()
    annyang.resume()
    // re-arm autoRestart/continuous deterministically
    annyang.start({ autoRestart: false, continuous: false })
    recognizer.onstart()
    expect(annyang.isListening()).to.be.true
    expect(recognizer.continuous).to.be.false
    const noMatch = []
    annyang.addCallback('resultNoMatch', (results) => noMatch.push(results), null)
    annyang.trigger('totally unrelated words')
    expect(noMatch.length).to.equal(1)
    expect(noMatch[0]).to.deep.equal(['totally unrelated words'])
    // second alternative in the array matches (unique phrase: earlier
    // duplicate registrations are matched first, so a repeat phrase would
    // fire the older callback)
    const captured = {}
    annyang.addCommands({
      'locate *item': (item) => {
        captured.item = item
      },
    })
    annyang.trigger(['nope nothing here', 'locate the money'])
    expect(captured.item).to.equal('the money')
  })

  it('removeCommands handles single, array and no-argument forms', () => {
    const recognizer = stubRecognizer()
    annyang.start({ autoRestart: false })
    recognizer.onstart()
    const noMatch = []
    annyang.addCallback('resultNoMatch', () => noMatch.push(1), null)
    const captured = {}
    annyang.addCommands({
      'show me *tag': (tag) => {
        captured.splat = tag
      },
      'calculate :month stats': () => {
        captured.month = true
      },
      'rx thing': {
        regexp: /^rx thing$/,
        callback: () => {
          captured.rx = true
        },
      },
    })
    annyang.removeCommands('show me *tag')
    annyang.trigger('show me stuff')
    expect(captured.splat).to.be.undefined
    expect(noMatch.length).to.equal(1)
    annyang.removeCommands(['calculate :month stats', 'rx thing'])
    annyang.trigger('calculate june stats')
    expect(captured.month).to.be.undefined
    expect(noMatch.length).to.equal(2)
    // no arguments clears everything
    annyang.removeCommands()
    annyang.trigger('show me stuff')
    expect(noMatch.length).to.equal(3)
  })

  it('handles paused and active recognition results', () => {
    const recognizer = stubRecognizer()
    annyang.start({ autoRestart: false })
    recognizer.onstart()
    const heard = []
    annyang.addCommands({
      hello: () => {
        heard.push('hello')
      },
    })
    // paused: the result is dropped with a debug message
    annyang.pause()
    annyang.debug(true)
    const fakeEvent = {
      resultIndex: 0,
      results: [[{ transcript: 'hello' }, { transcript: 'yellow' }]],
    }
    recognizer.onresult(fakeEvent)
    expect(hasLog('Speech heard, but annyang is paused')).to.be.true
    expect(heard.length).to.equal(0)
    // active: transcripts are parsed and matched
    annyang.resume()
    annyang.start({ autoRestart: false })
    recognizer.onstart()
    const results = []
    annyang.addCallback('result', (phrases) => results.push(phrases), null)
    recognizer.onresult(fakeEvent)
    expect(heard).to.deep.equal(['hello'])
    expect(results[0]).to.deep.equal(['hello', 'yellow'])
  })

  it('dispatches specific callbacks for recognition errors', async () => {
    const recognizer = stubRecognizer()
    const errors = { generic: [], network: [], blocked: [], denied: [] }
    annyang.addCallback('error', (event) => errors.generic.push(event), null)
    annyang.addCallback(
      'errorNetwork',
      (event) => errors.network.push(event),
      null,
    )
    annyang.addCallback(
      'errorPermissionBlocked',
      (event) => errors.blocked.push(event),
      null,
    )
    annyang.addCallback(
      'errorPermissionDenied',
      (event) => errors.denied.push(event),
      null,
    )
    annyang.start({ autoRestart: false })
    recognizer.onerror({ error: 'network' })
    expect(errors.network.length).to.equal(1)
    expect(errors.generic.length).to.equal(1)
    // unknown error kinds only hit the generic callback
    recognizer.onerror({ error: 'audio-capture' })
    expect(errors.generic.length).to.equal(2)
    expect(errors.network.length).to.equal(1)
    // a permission error right after start is "blocked" (auto-blocked)
    recognizer.onerror({ error: 'not-allowed' })
    expect(errors.blocked.length).to.equal(1)
    expect(errors.denied.length).to.equal(0)
    // the same error later than 200ms after start is "denied"
    await wait(250)
    annyang.start({ autoRestart: false })
    await wait(250)
    recognizer.onerror({ error: 'service-not-allowed' })
    expect(errors.denied.length).to.equal(1)
  })

  it('onend stops listening and defers auto-restart by up to a second', async () => {
    const recognizer = stubRecognizer()
    annyang.start({ autoRestart: true })
    recognizer.onstart()
    expect(annyang.isListening()).to.be.true
    const ends = []
    annyang.addCallback('end', () => ends.push(1), null)
    const before = recognizer.startCalls
    recognizer.onend()
    expect(annyang.isListening()).to.be.false
    expect(ends.length).to.equal(1)
    // restart is deferred so it happens at most once per second
    await wait(1200)
    expect(recognizer.startCalls).to.be.above(before)
  })

  it('onend restarts immediately when the last start was over a second ago', async () => {
    const recognizer = stubRecognizer()
    annyang.start({ autoRestart: true })
    recognizer.onstart()
    await wait(1050)
    const before = recognizer.startCalls
    recognizer.onend()
    // no deferral: the restart happens synchronously
    expect(recognizer.startCalls).to.be.above(before)
  })

  it('warns through the console after ten auto-restarts in a row', async () => {
    const recognizer = stubRecognizer()
    annyang.start({ autoRestart: true })
    recognizer.onstart()
    annyang.debug(true)
    const before = logs.length
    for (let i = 0; i < 10; i++) {
      recognizer.onend()
    }
    expect(hasLog('Speech Recognition is repeatedly stopping and starting. See http://is.gd/annyang_restarts for tips.')).to.be.true
    expect(logs.length).to.be.above(before)
    // let the deferred restart timers drain and then go quiet
    await wait(1300)
    annyang.abort()
    expect(annyang.isListening()).to.be.false
  })

  it('onsoundstart dispatches soundstart callbacks', () => {
    const recognizer = stubRecognizer()
    const sounds = []
    annyang.addCallback('soundstart', () => sounds.push(1), null)
    recognizer.onsoundstart()
    expect(sounds.length).to.equal(1)
  })

  it('addCallback ignores unknown event types and removeCallback variants work', () => {
    const recognizer = stubRecognizer()
    // unknown type is silently ignored
    expect(() => annyang.addCallback('bogus-type', () => {}, null)).to.not.throw()
    // removeCallback() clears every callback on every type
    const f = []
    const g = []
    annyang.addCallback('start', () => f.push('start'), null)
    annyang.addCallback('end', () => f.push('end'), null)
    annyang.removeCallback()
    recognizer.onstart()
    recognizer.onend()
    expect(f.length).to.equal(0)
    // removeCallback(type) clears a single type
    annyang.addCallback('start', () => f.push('start'), null)
    annyang.addCallback('end', () => g.push('end'), null)
    annyang.removeCallback('start')
    recognizer.onstart()
    recognizer.onend()
    expect(f.length).to.equal(0)
    expect(g.length).to.equal(1)
    // removeCallback(undefined, fn) removes fn from every type
    const h = []
    annyang.addCallback('start', () => h.push('start'), null)
    annyang.addCallback('end', () => h.push('end'), null)
    annyang.removeCallback(undefined, () => h.push('start'), null)
    // the second registration of the same function shape is what we remove,
    // so use a named function reference instead
    const sharedFn = () => h.push('hit')
    annyang.addCallback('start', sharedFn, null)
    annyang.addCallback('end', sharedFn, null)
    annyang.removeCallback(undefined, sharedFn)
    recognizer.onstart()
    recognizer.onend()
    expect(h.filter((entry) => entry === 'hit').length).to.equal(0)
    // removeCallback(type, fn) removes just that function from that type
    const kept = []
    const only = () => kept.push('only')
    annyang.addCallback('start', only, null)
    annyang.addCallback('start', () => kept.push('other'), null)
    annyang.removeCallback('start', only)
    recognizer.onstart()
    expect(kept).to.deep.equal(['other'])
  })

  it('init keeps existing commands, registers its own commands object, and start catches recognizer failures', () => {
    const recognizer = stubRecognizer()
    annyang.start({ autoRestart: false })
    recognizer.onstart()
    const kept = []
    annyang.addCommands({ keeper: () => kept.push(1) })
    const added = []
    // vendored divergence from upstream annyang 2.6.1: init() checks for
    // keys on the commands object so a commands object passed to init IS
    // registered (upstream checked commands.length on an object)
    annyang.init({ 'init probe': () => added.push(1) }, false)
    annyang.trigger('keeper')
    expect(kept.length).to.equal(1)
    annyang.trigger('init probe')
    expect(added.length).to.equal(1)
    // an array-like commands value reaches addCommands too, which skips
    // its non-function entries
    annyang.init(['not a function map'], false)
    annyang.trigger('keeper')
    expect(kept.length).to.equal(2)
    // init() swapped in a brand new recognizer object, so re-grab it
    const current = stubRecognizer()
    // a throwing recognizer start is caught and logged in debug mode
    current.start = () => {
      throw new Error('service unavailable')
    }
    annyang.debug(true)
    expect(() => annyang.start({ autoRestart: false })).to.not.throw()
    expect(hasLog('service unavailable')).to.be.true
    // paused start does not report listening
    current.start = () => {}
    annyang.start({ paused: true, continuous: false, autoRestart: false })
    expect(annyang.isListening()).to.be.false
    expect(current.continuous).to.be.false
  })

  it('isListening and getSpeechRecognizer expose live state', async () => {
    const recognizer = stubRecognizer()
    annyang.start({ autoRestart: false })
    recognizer.onstart()
    expect(annyang.isListening()).to.be.true
    expect(annyang.getSpeechRecognizer()).to.equal(recognizer)
    annyang.pause()
    expect(annyang.isListening()).to.be.false
    annyang.abort()
    expect(annyang.isListening()).to.be.false
    // abort disarms auto-restart and resets the counter
    recognizer.onend()
    const before = recognizer.startCalls
    await wait(1100)
    expect(recognizer.startCalls).to.equal(before)
  })
})
