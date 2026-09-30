import { fixture, expect, html } from '@open-wc/testing'
import { WebContainerEl } from '../web-container.js'
import { WebContainerDocPlayer } from '../lib/web-container-doc-player.js'
import { WebContainerWCRegistryDocs } from '../lib/web-container-wc-registry-docs.js'

// the real WebContainerManager.requestAvailability boots a full
// @webcontainer/api instance; every test below stubs the singleton BEFORE
// the element's firstUpdated runs so no real container ever boots.

const makeFakeContainer = () => {
  const fake = {
    spawns: [],
    mounts: [],
    serverReadyHandlers: {},
    files: {},
    spawn: async (command, args) => {
      const process = {
        command: command,
        args: args,
        output: { pipeTo: async () => {} },
        input: {
          getWriter: () => ({ write: (data) => fake.writes.push(data) }),
        },
        resize: () => {},
        exit: Promise.resolve(0),
      }
      fake.spawns.push(process)
      return process
    },
    mount: async (files) => {
      fake.mounts.push(files)
      return files
    },
    fs: {
      writes: [],
      writeFile: async (path, content) => {
        fake.fs.writes.push([path, content])
        fake.files[path] = content
      },
      readFile: async (path) =>
        typeof fake.files[path] === 'string'
          ? fake.files[path]
          : 'file: ' + path,
    },
    writes: [],
    on: (event, handler) => {
      fake.serverReadyHandlers[event] = handler
    },
  }
  return fake
}

describe('web-container', () => {
  let element
  let originalRequestAvailability
  let originalFetch

  beforeEach(async () => {
    originalRequestAvailability =
      globalThis.WebContainerManager.requestAvailability
    originalFetch = globalThis.fetch
  })

  afterEach(() => {
    globalThis.WebContainerManager.requestAvailability =
      originalRequestAvailability
    globalThis.fetch = originalFetch
  })

  const fixtureWith = async (markup) => {
    const fake = makeFakeContainer()
    globalThis.WebContainerManager.requestAvailability = async () => fake
    const el = await fixture(markup)
    // let firstUpdated / setupWebContainers settle
    await new Promise((r) => setTimeout(r, 250))
    return { el, fake }
  }

  it('registers the tag and exposes its haxProperties file', () => {
    expect(WebContainerEl.tag).to.equal('web-container')
    expect(
      WebContainerEl.haxProperties.endsWith(
        'web-container.haxProperties.json',
      ),
    ).to.equal(true)
    expect(WebContainerDocPlayer.tag).to.equal('web-container-doc-player')
    expect(WebContainerWCRegistryDocs.tag).to.equal(
      'web-container-wc-registry-docs',
    )
  })

  it('defaults its properties and file map', () => {
    const el = globalThis.document.createElement('web-container')
    expect(el.status).to.equal('Loading')
    expect(el.fname).to.equal(null)
    expect(el.hideEditor).to.equal(false)
    expect(el.hideTerminal).to.equal(false)
    expect(el.hideWindow).to.equal(false)
    expect(el.commands).to.exist
    expect(el.commands.length).to.equal(0)
    expect(el.files['index.js']).to.exist
    expect(el.files['package.json']).to.exist
  })

  it('renders the container, editor, preview and terminal areas', async () => {
    const { el } = await fixtureWith(
      html`<web-container title="title"></web-container>`,
    )
    expect(el.shadowRoot.querySelector('.container[part="container"]')).to
      .exist
    expect(el.shadowRoot.querySelector('.editor[part="editor"]')).to.exist
    expect(el.shadowRoot.querySelector('.files[part="files"]')).to.exist
    expect(el.shadowRoot.querySelector('code-editor')).to.exist
    expect(el.shadowRoot.querySelector('.preview[part="preview"]')).to.exist
    expect(el.shadowRoot.querySelector('.status[part="status"]')).to.exist
    const iframe = el.shadowRoot.querySelector('iframe[part="iframe"]')
    expect(iframe).to.exist
    expect(iframe.getAttribute('title')).to.equal('Web container preview')
    expect(iframe.getAttribute('src').indexOf('loading.html') !== -1).to.equal(
      true,
    )
    expect(el.shadowRoot.querySelector('.terminal[part="terminal"]')).to.exist
    // xterm renders a div.xterm (dom renderer) inside .terminal
    expect(el.shadowRoot.querySelector('.terminal .xterm')).to.exist
  })

  it('mounts the default files, spawns a shell and installs dependencies', async () => {
    const { el, fake } = await fixtureWith(
      html`<web-container title="title"></web-container>`,
    )
    // boot sequence: mount -> shell -> npm install -> npm run start
    expect(fake.mounts.length).to.equal(1)
    expect(fake.mounts[0]).to.equal(el.files)
    expect(fake.spawns.length).to.equal(3)
    expect(fake.spawns[0].command).to.equal('jsh')
    expect(fake.spawns[0].args.terminal.cols).to.exist
    expect(fake.spawns[1].command).to.equal('npm')
    expect(fake.spawns[1].args[0]).to.equal('install')
    expect(fake.spawns[2].command).to.equal('npm')
    expect(fake.spawns[2].args[0]).to.equal('run')
    expect(fake.spawns[2].args[1]).to.equal('start')
    expect(el.status).to.equal('Running Start..')
    // dependency lifecycle events fired along the way
    const events = []
    const recordEvent = (e) => events.push(e.type)
    el.addEventListener(
      'web-container-dependencies-installing',
      recordEvent,
    )
    el.addEventListener('web-container-dependencies-installed', recordEvent)
    el.addEventListener('web-container-npm-start', recordEvent)
    el.dispatchEvent(
      new CustomEvent('web-container-dependencies-installing', {
        bubbles: true,
      }),
    )
    expect(events.length).to.equal(1)
  })

  it('fires the dependency lifecycle events during boot', async () => {
    const seen = []
    const onEvent = (e) => seen.push(e.type)
    const originalRequest =
      globalThis.WebContainerManager.requestAvailability
    globalThis.WebContainerManager.requestAvailability = async () =>
      makeFakeContainer()
    globalThis.document.body.addEventListener(
      'web-container-dependencies-installing',
      onEvent,
    )
    globalThis.document.body.addEventListener(
      'web-container-dependencies-installed',
      onEvent,
    )
    globalThis.document.body.addEventListener('web-container-npm-start', onEvent)
    try {
      element = await fixture(
        html`<web-container title="title"></web-container>`,
      )
      await new Promise((r) => setTimeout(r, 250))
      expect(
        seen.includes('web-container-dependencies-installing'),
      ).to.equal(true)
      expect(
        seen.includes('web-container-dependencies-installed'),
      ).to.equal(true)
      expect(seen.includes('web-container-npm-start')).to.equal(true)
    } finally {
      globalThis.document.body.removeEventListener(
        'web-container-dependencies-installing',
        onEvent,
      )
      globalThis.document.body.removeEventListener(
        'web-container-dependencies-installed',
        onEvent,
      )
      globalThis.document.body.removeEventListener(
        'web-container-npm-start',
        onEvent,
      )
      globalThis.WebContainerManager.requestAvailability = originalRequest
    }
  })

  it('parses commands from a slotted template and runs them with events', async () => {
    const { el, fake } = await fixtureWith(html`
      <web-container title="title">
        <template>npm install some-pkg echo hi there</template>
      </web-container>
    `)
    // the template content is split per line, then per word
    expect(el.commands.length).to.equal(1)
    expect(el.commands[0][0]).to.equal('npm')
    expect(el.commands[0][1]).to.equal('install')
    expect(el.commands[0][2]).to.equal('some-pkg')
    expect(el.commands[0][3]).to.equal('echo')
    expect(el.commands[0][4]).to.equal('hi')
    expect(el.commands[0][5]).to.equal('there')
    expect(el.status).to.equal('Running command (0/1): npm')
    // the whole line is one spawn: command word + remaining words as args
    const commands = fake.spawns.filter((p) => p.command === 'npm')
    expect(commands.length).to.equal(1)
    expect(commands[0].args[0]).to.equal('install')
    expect(commands[0].args[1]).to.equal('some-pkg')
    expect(commands[0].args[4]).to.equal('there')
  })

  it('runs commands given directly with non-array entries too', async () => {
    const { el, fake } = await fixtureWith(
      html`<web-container title="title"></web-container>`,
    )
    const events = []
    el.addEventListener('web-container-command-start', (e) =>
      events.push(['start', e.detail.command]),
    )
    el.addEventListener('web-container-command-finished', (e) =>
      events.push(['finished', e.detail.command]),
    )
    await el.runCommands([
      ['echo', 'array', 'args'],
      'ls',
    ])
    expect(fake.spawns.filter((p) => p.command === 'echo').length).to.equal(1)
    expect(fake.spawns.filter((p) => p.command === 'ls').length).to.equal(1)
    expect(events.length).to.equal(4)
    expect(events[0][0]).to.equal('start')
    expect(events[0][1][0]).to.equal('echo')
    expect(events[3][0]).to.equal('finished')
    expect(events[3][1]).to.equal('ls')
  })

  it('maps file endings to editor languages', async () => {
    const { el } = await fixtureWith(
      html`<web-container title="title"></web-container>`,
    )
    expect(el.getLanguageFromFileEnding('app.js')).to.equal('javascript')
    expect(el.getLanguageFromFileEnding('data.json')).to.equal('json')
    expect(el.getLanguageFromFileEnding('page.html')).to.equal('html')
    expect(el.getLanguageFromFileEnding('conf.yaml')).to.equal('yaml')
    expect(el.getLanguageFromFileEnding('readme.md')).to.equal('javascript')
  })

  it('writes files through editor changes and reads them back', async () => {
    const { el, fake } = await fixtureWith(
      html`<web-container title="title"></web-container>`,
    )
    el.fname = 'index.js'
    el.editorValueChanged({ detail: { value: 'console.log(1)' } })
    await new Promise((r) => setTimeout(r, 50))
    expect(fake.files['/index.js']).to.equal('console.log(1)')
    const read = await el.readFile('index.js')
    expect(read).to.equal('console.log(1)')
    // without an instance the write is skipped silently
    const instance = el.webcontainerInstance
    el.webcontainerInstance = null
    el.editorValueChanged({ detail: { value: 'x' } })
    expect(fake.files['/index.js']).to.equal('console.log(1)')
    el.webcontainerInstance = instance
  })

  it('updates the editor from file button clicks', async () => {
    const { el, fake } = await fixtureWith(html`
      <web-container title="title">
        <template>ls</template>
      </web-container>
    `)
    el.filesShown = [
      { file: 'index.js', label: 'index.js' },
      { file: 'package.json', label: 'package.json' },
    ]
    await el.updateComplete
    await new Promise((r) => setTimeout(r, 50))
    fake.files['/package.json'] = '{ "name": "pkg" }'
    const buttons = el.shadowRoot.querySelectorAll('.files button')
    expect(buttons.length).to.equal(2)
    expect(buttons[0].getAttribute('data-fname')).to.equal('index.js')
    expect(buttons[0].hasAttribute('active')).to.equal(true)
    expect(buttons[1].hasAttribute('active')).to.equal(false)
    buttons[1].click()
    await new Promise((r) => setTimeout(r, 50))
    expect(el.fname).to.equal('package.json')
    expect(buttons[1].hasAttribute('active')).to.equal(true)
    const editor = el.shadowRoot.querySelector('code-editor')
    expect(editor.innerHTML.indexOf('{ "name": "pkg" }') !== -1).to.equal(true)
    expect(editor.language).to.equal('json')
  })

  it('dispatches server-ready, points the iframe at the url and clears status', async () => {
    const { el, fake } = await fixtureWith(
      html`<web-container title="title"></web-container>`,
    )
    const ready = []
    el.addEventListener('web-container-server-ready', (e) =>
      ready.push(e.detail),
    )
    const iframe = el.shadowRoot.querySelector('iframe')
    const originalSrc = iframe.getAttribute('src')
    fake.serverReadyHandlers['server-ready'](4173, 'http://127.0.0.1:4173')
    await new Promise((r) => setTimeout(r, 50))
    expect(ready.length).to.equal(1)
    expect(ready[0].port).to.equal(4173)
    expect(ready[0].url).to.equal('http://127.0.0.1:4173')
    // the IDL src setter writes the raw string into the attribute
    expect(iframe.getAttribute('src')).to.equal('http://127.0.0.1:4173')
    expect(el.status).to.equal('')
    // refreshIframe reads src through the IDL getter (normalized, trailing
    // slash added) and reassigns it, so the attribute normalizes on refresh
    iframe.setAttribute('src', 'http://127.0.0.1:4173')
    el.refreshIframe()
    expect(iframe.getAttribute('src')).to.equal('http://127.0.0.1:4173/')
    expect(originalSrc.indexOf('loading.html') !== -1).to.equal(true)
  })

  it('sets the code editor contents and language', async () => {
    const { el } = await fixtureWith(
      html`<web-container title="title"></web-container>`,
    )
    const editor = el.shadowRoot.querySelector('code-editor')
    el.setCodeEditor('<p>hi</p>', 'html')
    expect(editor.innerHTML.indexOf('<iframe>') !== -1).to.equal(true)
    expect(editor.innerHTML.indexOf('<p>hi</p>') !== -1).to.equal(true)
    expect(editor.language).to.equal('html')
    el.setCodeEditor('body { color: red }', 'css')
    expect(editor.innerHTML.indexOf('<iframe>') !== -1).to.equal(false)
    expect(editor.innerHTML.indexOf('body { color: red }') !== -1).to.equal(
      true,
    )
    expect(editor.language).to.equal('css')
  })

})

describe('web-container-doc-player', () => {
  let originalRequestAvailability
  let originalFetchInDocPlayer

  beforeEach(() => {
    originalFetchInDocPlayer = globalThis.fetch
    originalRequestAvailability =
      globalThis.WebContainerManager.requestAvailability
    globalThis.WebContainerManager.requestAvailability =
      async () => makeFakeContainer()
  })

  afterEach(() => {
    globalThis.WebContainerManager.requestAvailability =
      originalRequestAvailability
    globalThis.fetch = originalFetchInDocPlayer
  })

  it('rebuilds a hidden web-container for the documented element', async () => {
    const el = await fixture(
      html`<web-container-doc-player
        element="my-el"
        project="@haxtheweb/my-pkg"
        version="2.0.0"
      ></web-container-doc-player>`,
    )
    await new Promise((r) => setTimeout(r, 250))
    expect(el.shadowRoot.querySelector('#webcontainer')).to.exist
    const wc = el.shadowRoot.querySelector('web-container')
    expect(wc).to.exist
    expect(wc.hideTerminal).to.equal(true)
    expect(wc.hideEditor).to.equal(true)
    expect(wc.files['index.html']).to.exist
    expect(wc.files['package.json']).to.exist
    expect(wc.files['web-dev-server.config.mjs']).to.exist
    const index = wc.files['index.html'].file.contents
    expect(index.indexOf('Demo of @haxtheweb/my-pkg : 2.0.0') !== -1).to.equal(
      true,
    )
    expect(index.indexOf('import "@haxtheweb/my-pkg"') !== -1).to.equal(true)
    expect(index.indexOf('"my-el"') !== -1).to.equal(true)
    const pkg = wc.files['package.json'].file.contents
    expect(pkg.indexOf('"@haxtheweb/my-pkg": "2.0.0"') !== -1).to.equal(true)
    expect(el.rebuilding).to.equal(false)
  })

  it('rebuilds when element/project/version change while not rebuilding', async () => {
    const el = await fixture(
      html`<web-container-doc-player
        element="one-el"
        project="@haxtheweb/one"
      ></web-container-doc-player>`,
    )
    await new Promise((r) => setTimeout(r, 250))
    const firstWc = el.shadowRoot.querySelector('web-container')
    expect(firstWc).to.exist
    el.project = '@haxtheweb/two'
    await new Promise((r) => setTimeout(r, 250))
    // rebuild clears #webcontainer then appends a fresh web-container
    expect(el.shadowRoot.querySelectorAll('web-container').length).to.equal(1)
    const secondWc = el.shadowRoot.querySelector('web-container')
    expect(secondWc === firstWc).to.equal(
      false,
      'a project change rebuilds a new web-container',
    )
    // rebuilding guard blocks recursion during an active rebuild
    expect(el.rebuilding).to.equal(false)
    el.rebuilding = true
    el.version = '9.9.9'
    await new Promise((r) => setTimeout(r, 100))
    expect(el.shadowRoot.querySelector('web-container') === secondWc).to.equal(
      true,
      'rebuilding=true blocks the version-triggered rebuild',
    )
    el.rebuilding = false
  })

  it('encodes data strings for codepen hand-off', async () => {
    const el = await fixture(
      html`<web-container-doc-player
        element="my-el"
        project="@haxtheweb/my-pkg"
      ></web-container-doc-player>`,
    )
    await new Promise((r) => setTimeout(r, 250))
    const data = el._getDataString({ a: 'b', c: "d'e" })
    expect(data.indexOf('"') === -1).to.equal(true)
    expect(data.indexOf("'") === -1).to.equal(true)
    expect(data.indexOf('&quot;') !== -1).to.equal(true)
    expect(data.indexOf('&apos;') !== -1).to.equal(true)
    // codePenData looks up a code-pen-button in the shadow root; the player
    // never renders one itself, so inject one with the right tag name
    const fakeButton = globalThis.document.createElement(
      'code-pen-button',
    )
    el.shadowRoot.appendChild(fakeButton)
    await el.codePenData()
    expect(fakeButton.getAttribute('data-string').indexOf('&quot;') !== -1)
      .to.equal(true)
  })

  it('gets examples as text or node through getExample', async () => {
    const el = await fixture(
      html`<web-container-doc-player
        element="plain-el"
        project="@haxtheweb/plain"
      ></web-container-doc-player>`,
    )
    await new Promise((r) => setTimeout(r, 250))
    const outer = await el.getExample('plain-el')
    expect(outer).to.equal('<plain-el></plain-el>')
    const node = await el.getExample('plain-el', false)
    expect(node.tagName.toLowerCase()).to.equal('plain-el')
  })

  it('builds an example from a haxProperties string schema via fetch', async () => {
    const el = await fixture(
      html`<web-container-doc-player
        element="schema-el"
        project="@haxtheweb/my-pkg"
      ></web-container-doc-player>`,
    )
    await new Promise((r) => setTimeout(r, 250))
    const schema = {
      demoSchema: [
        {
          tag: 'my-el',
          properties: { foo: 'bar' },
          content: 'Some slotted text',
        },
      ],
    }
    const urls = []
    globalThis.fetch = async (url) => {
      urls.push(url)
      return { ok: true, json: async () => schema }
    }
    // getExample builds its candidate element through document.createElement;
    // supply a fake whose instance haxProperties() returns a schema URL
    const origCreate = globalThis.document.createElement
    globalThis.document.createElement = function (tag, opts) {
      if (tag === 'schema-el') {
        return {
          haxProperties: () => 'https://example.com/schema-el.haxProperties.json',
        }
      }
      return origCreate.call(globalThis.document, tag, opts)
    }
    try {
      const node = await el.getExample('schema-el', false)
      expect(urls.length).to.equal(1)
      expect(urls[0]).to.equal(
        'https://example.com/schema-el.haxProperties.json',
      )
      expect(node.tagName.toLowerCase()).to.equal('my-el')
      expect(node.getAttribute('foo')).to.equal('bar')
      // asText true serializes the built node
      const outer = await el.getExample('schema-el')
      expect(outer.indexOf('<my-el') !== -1).to.equal(true)
    } finally {
      globalThis.document.createElement = origCreate
      globalThis.fetch = originalFetchInDocPlayer
    }
  })

  it('skips the fetch when instance haxProperties is not a string', async () => {
    const el = await fixture(
      html`<web-container-doc-player
        element="object-el"
        project="@haxtheweb/my-pkg"
      ></web-container-doc-player>`,
    )
    await new Promise((r) => setTimeout(r, 250))
    const origCreate = globalThis.document.createElement
    globalThis.document.createElement = function (tag, opts) {
      if (tag === 'object-el') {
        return {
          haxProperties: () => ({ demoSchema: [] }),
          outerHTML: '<object-el></object-el>',
        }
      }
      return origCreate.call(globalThis.document, tag, opts)
    }
    try {
      const outer = await el.getExample('object-el')
      expect(outer).to.equal('<object-el></object-el>')
    } finally {
      globalThis.document.createElement = origCreate
    }
  })

  it('resizes the embedded web-container on frameResize messages', async () => {
    const el = await fixture(
      html`<web-container-doc-player
        element="my-el"
        project="@haxtheweb/my-pkg"
      ></web-container-doc-player>`,
    )
    await new Promise((r) => setTimeout(r, 250))
    const wc = el.shadowRoot.querySelector('web-container')
    globalThis.postMessage(
      JSON.stringify({ subject: 'frameResize', height: '460' }),
      '*',
    )
    // postMessage delivers the message event asynchronously
    await new Promise((r) => setTimeout(r, 50))
    expect(
      wc.style.getPropertyValue('--web-container-iframe-height'),
    ).to.equal('500px')
    // invalid payloads and other subjects are ignored
    globalThis.postMessage('not json', '*')
    globalThis.postMessage(
      JSON.stringify({ subject: 'other', height: '100' }),
      '*',
    )
    await new Promise((r) => setTimeout(r, 50))
    expect(
      wc.style.getPropertyValue('--web-container-iframe-height'),
    ).to.equal('500px')
  })

  it('removes the message listener on disconnect', async () => {
    const el = await fixture(
      html`<web-container-doc-player
        element="my-el"
        project="@haxtheweb/my-pkg"
      ></web-container-doc-player>`,
    )
    await new Promise((r) => setTimeout(r, 250))
    const wc = el.shadowRoot.querySelector('web-container')
    el.disconnectedCallback()
    globalThis.postMessage(
      JSON.stringify({ subject: 'frameResize', height: '900' }),
      '*',
    )
    await new Promise((r) => setTimeout(r, 50))
    expect(
      wc.style.getPropertyValue('--web-container-iframe-height'),
    ).to.equal('')
    el.connectedCallback()
  })
})

describe('web-container-wc-registry-docs', () => {
  let originalFetch
  let originalRequestAvailability

  beforeEach(() => {
    originalFetch = globalThis.fetch
    originalRequestAvailability =
      globalThis.WebContainerManager.requestAvailability
    globalThis.WebContainerManager.requestAvailability =
      async () => makeFakeContainer()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
    globalThis.WebContainerManager.requestAvailability =
      originalRequestAvailability
  })

  it('defaults its text, registry file and empty options', () => {
    const el = globalThis.document.createElement(
      'web-container-wc-registry-docs',
    )
    expect(el.text).to.equal(
      'Select the project to produce a demo for. This will make a best attempt',
    )
    expect(el.file).to.equal('https://cdn.hax.cloud/cdn/wc-registry.json')
    expect(el.options['']).to.equal('')
  })

  it('renders the select, options and container', async () => {
    const el = await fixture(html`<web-container-wc-registry-docs
      file=""
    ></web-container-wc-registry-docs>`)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('select')).to.exist
    expect(el.shadowRoot.querySelector('option')).to.exist
    expect(el.shadowRoot.querySelector('p').textContent).to.equal(
      'Select the project to produce a demo for. This will make a best attempt',
    )
    expect(el.shadowRoot.querySelector('#container')).to.exist
  })

  it('filters fetched registry options to haxtheweb elements', async () => {
    const urls = []
    globalThis.fetch = async (url) => {
      urls.push(url)
      return {
        json: async () => ({
          'git-corner': '@haxtheweb/git-corner/git-corner.js',
          'hax-bookmarklet': '@haxtheweb/hax-bookmarklet/hax-bookmarklet.js',
          'unrelated-tag': 'vendor/some-lib.js',
          'other-tag': '@haxtheweb/other/other.js',
        }),
      }
    }
    const el = await fixture(
      html`<web-container-wc-registry-docs></web-container-wc-registry-docs>`,
    )
    await new Promise((r) => setTimeout(r, 100))
    expect(urls.length).to.equal(1)
    expect(urls[0]).to.equal('https://cdn.hax.cloud/cdn/wc-registry.json')
    // entries with @haxtheweb/ values and non-hax* keys survive
    expect(Object.keys(el.options).indexOf('git-corner') !== -1).to.equal(true)
    expect(Object.keys(el.options).indexOf('other-tag') !== -1).to.equal(true)
    expect(Object.keys(el.options).indexOf('hax-bookmarklet') === -1).to.equal(
      true,
    )
    expect(Object.keys(el.options).indexOf('unrelated-tag') === -1).to.equal(
      true,
    )
    await el.updateComplete
    const values = []
    el.shadowRoot
      .querySelectorAll('option')
      .forEach((o) => values.push(o.getAttribute('value')))
    expect(values.indexOf('git-corner') !== -1).to.equal(true)
    // the placeholder option carries no value attribute (null), not ""
    expect(values.indexOf(null) !== -1).to.equal(true)
  })

  it('selecting an option builds a doc player for that element', async () => {
    const el = await fixture(
      html`<web-container-wc-registry-docs
        file=""
      ></web-container-wc-registry-docs>`,
    )
    el.options = {
      'git-corner': '@haxtheweb/git-corner/git-corner.js',
    }
    await el.updateComplete
    const select = el.shadowRoot.querySelector('select')
    select.value = 'git-corner'
    await el.selectChange()
    const wcdp = el.shadowRoot.querySelector('#container web-container-doc-player')
    expect(wcdp).to.exist
    expect(wcdp.project).to.equal('@haxtheweb/git-corner')
    expect(wcdp.element).to.equal('git-corner')
    expect(wcdp.importpath).to.equal('@haxtheweb/git-corner/git-corner.js')
    // selecting nothing is a no-op: the previously built player stays
    select.value = ''
    await el.selectChange()
    expect(el.shadowRoot.querySelector('web-container-doc-player')).to.exist
  })
})
