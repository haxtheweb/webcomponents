import { fixture, expect, html } from "@open-wc/testing";

import "../wc-autoload.js";

describe("wc-autoload test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <wc-autoload title="test-title"></wc-autoload>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe('wc-autoload behavior', () => {
  // globals that the module and the loader mutate; snapshotted and
  // restored around every test so tests stay isolated
  const GLOBAL_KEYS = [
    'WCAutoloadRegistryFileProcessed',
    'WCAutoloadRegistryFile',
    'WCAutoloadBasePath',
    'WCGlobalBasePath',
    'WCAutoloadRegistry',
    'WCAutoloadRegistryRegistered',
    'WCAutoloadOptions',
    'WCAutoloadTarget',
  ]
  let snapshot
  let loader

  async function wait(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * The module schedules its initial process() at import time, which
   * fetches the harness registry file; wait for that to land so the
   * tests below start from a steady state.
   */
  async function waitForBootstrap() {
    const start = Date.now()
    while (
      !globalThis.WCAutoloadRegistryFileProcessed &&
      Date.now() - start < 5000
    ) {
      await wait(25)
    }
  }

  beforeEach(async () => {
    snapshot = {}
    for (const key of GLOBAL_KEYS) snapshot[key] = globalThis[key]
    await waitForBootstrap()
    loader = globalThis.WCAutoload.requestAvailability()
  })

  afterEach(() => {
    for (const key of GLOBAL_KEYS) globalThis[key] = snapshot[key]
  })

  it('bootstraps the registry from the harness registry file at import time', () => {
    expect(globalThis.WCAutoloadRegistryFileProcessed).to.equal(true)
    expect(globalThis.WCAutoloadRegistryRegistered).to.equal(true)
    expect(loader.registry.list['a11y-carousel']).to.exist
    expect(loader.loaded).to.equal(true)
  })

  it('requestAvailability returns a singleton appended to the body', () => {
    const again = globalThis.WCAutoload.requestAvailability()
    expect(again).to.equal(loader)
    expect(again.tagName).to.equal('WC-AUTOLOAD')
    expect(again.parentNode).to.equal(document.body)
  })

  it('wires the shared dynamic import registry and observes the body by default', async () => {
    const el = await fixture(html`<wc-autoload></wc-autoload>`)
    expect(el.registry).to.equal(
      globalThis.DynamicImportRegistry.requestAvailability(),
    )
    await wait(10)
    expect(el.target).to.equal(document.body)
    expect(el.options).to.deep.equal({ childList: true, subtree: true })
  })

  it('honors WCAutoloadOptions and WCAutoloadTarget', async () => {
    // must still be a valid MutationObserver options object
    const customOptions = { childList: true, subtree: false }
    const customTarget = document.createElement('div')
    document.body.appendChild(customTarget)
    globalThis.WCAutoloadOptions = customOptions
    globalThis.WCAutoloadTarget = customTarget
    try {
      const el = await fixture(html`<wc-autoload></wc-autoload>`)
      await wait(10)
      expect(el.options).to.equal(customOptions)
      expect(el.target).to.equal(customTarget)
    } finally {
      customTarget.remove()
    }
  })

  it('loads definitions for custom tags added to the observed target', async () => {
    const el = await fixture(html`<wc-autoload></wc-autoload>`)
    await wait(10)
    const calls = []
    const orig = el.registry.loadDefinition
    el.registry.loadDefinition = (tag) => {
      calls.push(tag)
      return Promise.resolve(true)
    }
    try {
      const added = document.createElement('mutation-observed-el')
      document.body.appendChild(added)
      await wait(50)
      expect(calls).to.include('MUTATION-OBSERVED-EL')
    } finally {
      el.registry.loadDefinition = orig
      document.querySelectorAll('mutation-observed-el').forEach((n) => {
        n.remove()
      })
    }
  })

  it('stops processing after being disconnected', async () => {
    const customTarget = document.createElement('div')
    document.body.appendChild(customTarget)
    globalThis.WCAutoloadTarget = customTarget
    try {
      const el = document.createElement('wc-autoload')
      customTarget.appendChild(el)
      await wait(10)
      const calls = []
      const orig = el.registry.loadDefinition
      el.registry.loadDefinition = (tag) => {
        calls.push(tag)
        return Promise.resolve(true)
      }
      try {
        const watched = document.createElement('disconnect-watch-el')
        customTarget.appendChild(watched)
        await wait(50)
        expect(calls).to.include('DISCONNECT-WATCH-EL')
        el.remove()
        await wait(10)
        // detach the target tree so the singleton body observer cannot
        // see the new node; only el's (now disconnected) observer could.
        // awaiting between removal and append lets the transient
        // registered observers from the removal flush first, otherwise
        // the body observer still receives the append in the detached tree
        const after = document.createElement('after-remove-el')
        customTarget.remove()
        await wait(10)
        customTarget.appendChild(after)
        await wait(50)
        expect(calls).to.not.include('AFTER-REMOVE-EL')
      } finally {
        el.registry.loadDefinition = orig
      }
    } finally {
      customTarget.remove()
    }
  })

  it('processNewElement only loads dashed tags that are not the loader machinery', async () => {
    const el = await fixture(html`<wc-autoload></wc-autoload>`)
    const calls = []
    const orig = el.registry.loadDefinition
    el.registry.loadDefinition = (tag) => {
      calls.push(tag)
      return Promise.resolve(true)
    }
    try {
      el.processNewElement(document.createTextNode('just text'))
      el.processNewElement(document.createElement('div'))
      el.processNewElement(document.createElement('p'))
      el.processNewElement(document.createElement('dynamic-import-registry'))
      el.processNewElement(document.createElement('wc-registry'))
      el.processNewElement(document.createElement('wc-autoload'))
      expect(calls).to.deep.equal([])
      el.processNewElement(document.createElement('some-unknown-tag'))
      expect(calls).to.deep.equal(['SOME-UNKNOWN-TAG'])
    } finally {
      el.registry.loadDefinition = orig
    }
  })

  it('process resolves immediately when the registry was already processed', async () => {
    const target = document.createElement('div')
    const sweepEl = document.createElement('already-processed-el')
    target.appendChild(sweepEl)
    document.body.appendChild(target)
    const origTarget = loader.target
    const origProcess = loader.processNewElement
    const processed = []
    loader.processNewElement = (node) => {
      processed.push(node.tagName)
    }
    try {
      globalThis.WCAutoloadRegistryFileProcessed = true
      const result = await globalThis.WCAutoload.process()
      expect(result).to.equal('autoloader already processed')
      expect(loader.loaded).to.equal(true)
      expect(processed).to.include('DIV')
      expect(processed).to.include('ALREADY-PROCESSED-EL')
    } finally {
      loader.processNewElement = origProcess
      loader.target = origTarget
      target.remove()
    }
  })

  it('process sets the basePath from WCGlobalBasePath when WCAutoloadBasePath is unset', async () => {
    const origBasePath = loader.registry.basePath
    globalThis.WCAutoloadRegistryFileProcessed = false
    globalThis.WCAutoloadRegistryFile = null
    globalThis.WCAutoloadBasePath = undefined
    globalThis.WCGlobalBasePath = '/wc-global-base-path/'
    try {
      const result = await globalThis.WCAutoload.process()
      expect(result).to.equal('autoloader processed on the fly')
      expect(loader.registry.basePath).to.equal('/wc-global-base-path/')
    } finally {
      loader.registry.basePath = origBasePath
    }
  })

  it('process fetches a single registry file, merges and registers it', async () => {
    const origBasePath = loader.registry.basePath
    // an as-yet-undefined tag in the dom so the :not(:defined) sweep
    // of the on-the-fly branch has something to process
    const sweepEl = document.createElement('on-the-fly-sweep-el')
    document.body.appendChild(sweepEl)
    globalThis.WCAutoloadRegistryFileProcessed = false
    globalThis.WCAutoloadRegistryFile =
      'data:application/json,{"data-url-single":"data/url-single.js"}'
    globalThis.WCAutoloadBasePath = '/node_modules/'
    try {
      const result = await globalThis.WCAutoload.process()
      expect(result).to.equal('autoloader processed on the fly')
      expect(globalThis.WCAutoloadRegistry['data-url-single']).to.equal(
        'data/url-single.js',
      )
      expect(loader.registry.list['data-url-single']).to.equal(
        'data/url-single.js',
      )
      expect(loader.registry.list['on-the-fly-sweep-el']).to.equal(undefined)
    } finally {
      sweepEl.remove()
      loader.registry.basePath = origBasePath
    }
  })

  it('process supports multiple registry files as an array', async () => {
    const origBasePath = loader.registry.basePath
    globalThis.WCAutoloadRegistryFileProcessed = false
    globalThis.WCAutoloadRegistryFile = [
      'data:application/json,{"array-form-a":"array/a.js"}',
      'data:application/json,{"array-form-b":"array/b.js"}',
    ]
    try {
      const result = await globalThis.WCAutoload.process()
      expect(result).to.equal('autoloader processed on the fly')
      expect(loader.registry.list['array-form-a']).to.equal('array/a.js')
      expect(loader.registry.list['array-form-b']).to.equal('array/b.js')
    } finally {
      loader.registry.basePath = origBasePath
    }
  })

  it('process retries the registry fetch after a transient failure', async () => {
    const origBasePath = loader.registry.basePath
    const realFetch = globalThis.fetch
    let attempts = 0
    globalThis.fetch = (url, options) => {
      attempts++
      if (attempts === 1) {
        return Promise.reject(new Error('transient network error'))
      }
      return realFetch(url, options)
    }
    globalThis.WCAutoloadRegistryFileProcessed = false
    globalThis.WCAutoloadRegistryFile =
      '/elements/haxcms-elements/demo/wc-registry.json'
    try {
      const result = await globalThis.WCAutoload.process()
      expect(result).to.equal('autoloader processed on the fly')
      // first attempt rejected, the retry with backoff succeeded
      expect(attempts).to.equal(2)
      expect(loader.registry.list['a11y-carousel']).to.exist
    } finally {
      globalThis.fetch = realFetch
      loader.registry.basePath = origBasePath
    }
  })

  it('process gives up after three failed fetch attempts', async () => {
    const rejections = []
    const onRejection = (e) => {
      rejections.push(e.reason)
      if (e.preventDefault) e.preventDefault()
    }
    globalThis.addEventListener('unhandledrejection', onRejection)
    const realFetch = globalThis.fetch
    let attempts = 0
    globalThis.fetch = () => {
      attempts++
      return Promise.reject(new Error('offline'))
    }
    globalThis.WCAutoloadRegistryFileProcessed = false
    globalThis.WCAutoloadRegistryFile =
      'data:application/json,{"never-loaded":"never.js"}'
    // not awaited: when every attempt fails the outer promise never settles
    globalThis.WCAutoload.process()
    const start = Date.now()
    while (rejections.length === 0 && Date.now() - start < 4000) {
      await wait(25)
    }
    globalThis.fetch = realFetch
    globalThis.removeEventListener('unhandledrejection', onRejection)
    expect(attempts).to.equal(3)
    expect(rejections.length).to.be.at.least(1)
    expect(globalThis.WCAutoloadRegistryFileProcessed).to.equal(false)
  })

  it('postLoaded loads definitions for late registrations of tags in the dom', async () => {
    const modUrl = new URL('../wc-autoload.js', import.meta.url).href
    const origBasePath = loader.registry.basePath
    const lateEl = document.createElement('post-loaded-el')
    document.body.appendChild(lateEl)
    // let the always-on body mutation observers react to the append so
    // only the late registration path is asserted below
    await wait(50)
    const loadedTags = []
    const onLoaded = (e) => loadedTags.push(e.detail.tag)
    const registry = loader.registry
    registry.addEventListener('dynamic-import-registry-loaded', onLoaded)
    try {
      registry.basePath = ''
      loader.loaded = true
      registry.register({
        tag: 'post-loaded-el',
        path: modUrl,
      })
      await wait(100)
      expect(loadedTags).to.include('post-loaded-el')
    } finally {
      registry.removeEventListener('dynamic-import-registry-loaded', onLoaded)
      registry.basePath = origBasePath
      lateEl.remove()
      delete registry.list['post-loaded-el']
      delete registry.__loaded['post-loaded-el']
    }
  })

  it('postLoaded skips tags that are not in the dom or when not loaded yet', async () => {
    const calls = []
    const orig = loader.registry.loadDefinition
    loader.registry.loadDefinition = (tag) => {
      calls.push(tag)
      return Promise.resolve(true)
    }
    const lateEl = document.createElement('post-loaded-absent-el')
    document.body.appendChild(lateEl)
    // discard the noise from the always-on body mutation observers
    await wait(50)
    calls.length = 0
    try {
      // tag present in dom but loader not loaded yet
      loader.loaded = false
      globalThis.dispatchEvent(
        new CustomEvent('dynamic-import-registry--new-registration', {
          detail: { tag: 'post-loaded-absent-el' },
        }),
      )
      await wait(50)
      // loader loaded but tag missing from dom
      loader.loaded = true
      globalThis.dispatchEvent(
        new CustomEvent('dynamic-import-registry--new-registration', {
          detail: { tag: 'never-in-dom-el' },
        }),
      )
      await wait(50)
      expect(calls).to.deep.equal([])
    } finally {
      loader.registry.loadDefinition = orig
      lateEl.remove()
    }
  })
})

describe('wc-registry behavior', () => {
  async function wait(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  it('registers tags from the JSON in its template child', async () => {
    const loader = globalThis.WCAutoload.requestAvailability()
    await fixture(
      html`<wc-registry
        ><template>{"wc-reg-template-tag":"wc-reg/path.js"}</template></wc-registry
      >`,
    )
    await wait(25)
    expect(loader.registry.list['wc-reg-template-tag']).to.equal(
      'wc-reg/path.js',
    )
    delete loader.registry.list['wc-reg-template-tag']
  })

  it('warns and keeps going when the template JSON is invalid', async () => {
    const warnings = []
    const origWarn = console.warn
    console.warn = (msg) => warnings.push(String(msg))
    try {
      await fixture(
        html`<wc-registry
          ><template>this is not json</template></wc-registry
        >`,
      )
      await wait(25)
      expect(warnings.length).to.be.at.least(1)
    } finally {
      console.warn = origWarn
    }
  })

  it('ignores children that are not templates', async () => {
    const loader = globalThis.WCAutoload.requestAvailability()
    await fixture(
      html`<wc-registry
        ><div>{"wc-reg-div-tag":"wc-reg/div.js"}</div></wc-registry
      >`,
    )
    await wait(25)
    expect(loader.registry.list['wc-reg-div-tag']).to.equal(undefined)
  })
})

/*
describe("A11y/chai axe tests", () => {
  it("wc-autoload passes accessibility test", async () => {
    const el = await fixture(html` <wc-autoload></wc-autoload> `);
    await expect(el).to.be.accessible();
  });
  it("wc-autoload passes accessibility negation", async () => {
    const el = await fixture(
      html`<wc-autoload aria-labelledby="wc-autoload"></wc-autoload>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("wc-autoload can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<wc-autoload .foo=${'bar'}></wc-autoload>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<wc-autoload ></wc-autoload>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<wc-autoload></wc-autoload>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<wc-autoload></wc-autoload>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
