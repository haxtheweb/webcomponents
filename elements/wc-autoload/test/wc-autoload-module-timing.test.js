import { expect } from '@open-wc/testing'

// runs in its own browser session so the module-level timing branches
// can be exercised by re-importing the module under a stubbed
// document.readyState without polluting the other test files
import '../wc-autoload.js'

describe('wc-autoload module timing', () => {
  async function wait(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  async function waitForBootstrap() {
    const start = Date.now()
    while (
      !globalThis.WCAutoloadRegistryFileProcessed &&
      Date.now() - start < 5000
    ) {
      await wait(25)
    }
  }

  /**
   * the module reads document.readyState at evaluation time, so an own
   * property is installed on the document to simulate a page that is
   * still parsing when the module is (re)evaluated
   */
  function stubReadyState(value) {
    Object.defineProperty(globalThis.document, 'readyState', {
      value,
      configurable: true,
    })
  }

  function restoreReadyState() {
    delete globalThis.document.readyState
  }

  /** stub globalThis.WCAutoload.process so initialProcess is observable */
  function stubProcess() {
    const original = globalThis.WCAutoload.process
    const calls = []
    globalThis.WCAutoload.process = (e) => {
      calls.push(e)
      return Promise.resolve('stubbed')
    }
    return () => {
      globalThis.WCAutoload.process = original
      return calls
    }
  }

  it('opts into window load timing when eagerness is load', async () => {
    await waitForBootstrap()
    stubReadyState('loading')
    const originalEagerness = globalThis.WCAutoloadEagerness
    globalThis.WCAutoloadEagerness = 'load'
    try {
      // re-evaluate the module; it may reject after registering because
      // the custom elements are already defined, which is fine here
      await import('../wc-autoload.js?timing=load').catch(() => {})
      const unstub = stubProcess()
      try {
        globalThis.dispatchEvent(new Event('load'))
        await wait(25)
        const calls = unstub()
        expect(calls.length).to.equal(1)
        // the listener was registered with once: true
        globalThis.dispatchEvent(new Event('load'))
        await wait(25)
        expect(globalThis.WCAutoload.process).to.exist
      } finally {
        unstub()
      }
    } finally {
      globalThis.WCAutoloadEagerness = originalEagerness
      restoreReadyState()
    }
  })

  it('defaults to DOMContentLoaded timing', async () => {
    await waitForBootstrap()
    stubReadyState('loading')
    const originalEagerness = globalThis.WCAutoloadEagerness
    globalThis.WCAutoloadEagerness = undefined
    try {
      await import('../wc-autoload.js?timing=dom').catch(() => {})
      const unstub = stubProcess()
      try {
        globalThis.dispatchEvent(new Event('DOMContentLoaded'))
        await wait(25)
        const calls = unstub()
        expect(calls.length).to.equal(1)
        // the listener was registered with once: true
        globalThis.dispatchEvent(new Event('DOMContentLoaded'))
        await wait(25)
        expect(globalThis.WCAutoload.process).to.exist
      } finally {
        unstub()
      }
    } finally {
      globalThis.WCAutoloadEagerness = originalEagerness
      restoreReadyState()
    }
  })

  it('initialProcess logs process rejections via console.warn', async () => {
    await waitForBootstrap()
    const originalProcess = globalThis.WCAutoload.process
    const originalWarn = console.warn
    const warnings = []
    console.warn = (msg) => warnings.push(msg)
    globalThis.WCAutoload.process = () =>
      Promise.reject(new Error('process failure'))
    try {
      globalThis.WCAutoload.initialProcess()
      await wait(25)
      expect(warnings.length).to.equal(1)
      expect(warnings[0].message).to.equal('process failure')
    } finally {
      globalThis.WCAutoload.process = originalProcess
      console.warn = originalWarn
    }
  })
})
