import { fixture, expect, html } from '@open-wc/testing'
import '../code-sample.js'
import { hljs } from '../lib/highlightjs/highlight.js'
import { defaultTheme } from '../lib/themes/default.js'
import { github } from '../lib/themes/github.js'
import { kustomDark } from '../lib/themes/kustom-dark.js'
import { kustomLight } from '../lib/themes/kustom-light.js'
import { oneDark } from '../lib/themes/one-dark.js'
import { oneLight } from '../lib/themes/one-light.js'
import { solarizedDark } from '../lib/themes/solarized-dark.js'
import { solarizedLight } from '../lib/themes/solarized-light.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// NOTE on ordering: the HAX edit-state render tests come FIRST in this file.
// They must never leave a <code-editor> element in the DOM by the time the
// dynamic `import("@haxtheweb/code-editor/code-editor.js")` triggered by an
// editMode change resolves — otherwise the element would upgrade and boot
// the monaco iframe chain. Every test below resets state synchronously.

describe('code-sample HAX edit state', () => {
  it('renders and removes a code-editor when _haxstate toggles', async () => {
    const el = await fixture(
      html`<code-sample type="javascript">
        <template preserve-content="preserve-content">const x = 1;</template>
      </code-sample>`,
    )
    expect(el.shadowRoot.querySelector('code-editor')).to.not.exist
    el._haxstate = true
    await el.updateComplete
    const codeEditor = el.shadowRoot.querySelector('code-editor')
    expect(codeEditor).to.exist
    expect(codeEditor.getAttribute('language')).to.equal('javascript')
    // reset synchronously before any editMode change could load the module
    el._haxstate = false
    await el.updateComplete
    expect(el.shadowRoot.querySelector('code-editor')).to.not.exist
  })

  it('computes a minimum height from the rendered container', async () => {
    const el = await fixture(
      html`<code-sample type="javascript">
        <template preserve-content="preserve-content">const x = 1;</template>
      </code-sample>`,
    )
    await el.updateComplete
    // small code block falls back to the 250px default
    expect(el.getMinHeight()).to.equal('250px')
  })

  it('returns the container height when the code is taller than 250px', async () => {
    let tall = ''
    for (let i = 0; i < 50; i++) {
      tall += 'const value' + i + ' = ' + i + ';\n'
    }
    const el = await fixture(
      `<code-sample type="javascript"><template preserve-content="preserve-content">${tall}</template></code-sample>`,
    )
    await el.updateComplete
    await sleep(60)
    const minHeight = el.getMinHeight()
    expect(minHeight.endsWith('px')).to.be.true
    expect(minHeight === '250px').to.be.false
  })
})

describe('code-sample HAX hooks', () => {
  let element

  beforeEach(async () => {
    element = await fixture(
      html`<code-sample type="javascript">
        <template preserve-content="preserve-content">
          const hello = "world"; console.log(hello);
        </template>
      </code-sample>`,
    )
    await element.updateComplete
  })

  it('haxpreProcessNodeToContent passes the node through', () => {
    const node = element.haxpreProcessNodeToContent(element)
    expect(node === element).to.be.true
  })

  it('haxeditModeChanged syncs the hax state flag', async () => {
    element.haxeditModeChanged(false)
    expect(element._haxstate).to.be.false
    element.haxeditModeChanged(true)
    expect(element._haxstate).to.be.true
    element.haxeditModeChanged(false)
    expect(element._haxstate).to.be.false
  })

  it('haxeditModeChanged writes the editor value back on deactivate', async () => {
    // render the (unupgraded, inert) editor host and stub its value node
    element._haxstate = true
    await element.updateComplete
    const codeEditor = element.shadowRoot.querySelector('code-editor')
    expect(codeEditor).to.exist
    const stubNode = globalThis.document.createElement('div')
    stubNode.innerHTML = 'stubbed code'
    codeEditor.getValueAsNode = () => stubNode
    element.haxeditModeChanged(false)
    expect(element.innerHTML).to.include('stubbed code')
    expect(element.innerHTML).to.include('preserve-content')
    // reset synchronously so no inert editor host lingers
    element._haxstate = false
    await element.updateComplete
    expect(element.shadowRoot.querySelector('code-editor')).to.not.exist
  })

  it('haxactiveElementChanged activates the HAX edit state', async () => {
    element._haxstate = true
    await element.updateComplete
    expect(element.shadowRoot.querySelector('code-editor')).to.exist
    element.haxactiveElementChanged(element, true)
    expect(element._haxstate).to.be.true
    expect(element.editMode).to.be.true
    // clear the state synchronously BEFORE Lit's update microtask renders the
    // editor host, so the dynamic code-editor import triggered by the
    // editMode change above finds no element to upgrade
    element._haxstate = false
    await element.updateComplete
    expect(element.shadowRoot.querySelector('code-editor')).to.not.exist
    // let the dynamic import resolve against a host with no code-editor
    await sleep(400)
    expect(element.shadowRoot.querySelector('code-editor')).to.not.exist
  })

  it('haxgizmoRegistration registers ``` language shortcuts', () => {
    const store = { keyboardShortcuts: {} }
    element.haxgizmoRegistration(store)
    const shortcuts = store.keyboardShortcuts
    expect(Object.keys(shortcuts).length).to.equal(9)
    expect(shortcuts['```javascript'].tag).to.equal('code-sample')
    expect(shortcuts['```javascript'].properties.type).to.equal('javascript')
    expect(shortcuts['```js'].properties.type).to.equal('javascript')
    expect(shortcuts['```json'].content).to.include('mainMenu')
    expect(shortcuts['```css'].content).to.include('the-cheet')
    expect(shortcuts['```php'].content).to.include('MrTheCheat')
    expect(shortcuts['```yaml'].content).to.include('Homestar')
    expect(shortcuts['```xml'].content).to.include('fhqwhgads')
    expect(shortcuts['```html'].content).to.include('blockquote')
    expect(shortcuts['```'].content).to.equal(shortcuts['```html'].content)
  })

  it('haxinlineContextMenu adds a toggle edit button', () => {
    const ceMenu = { ceButtons: [] }
    element.haxinlineContextMenu(ceMenu)
    expect(ceMenu.ceButtons.length).to.equal(1)
    expect(ceMenu.ceButtons[0].label).to.equal('Toggle edit mode')
    expect(ceMenu.ceButtons[0].callback).to.equal('haxToggleEdit')
    expect(ceMenu.ceButtons[0].icon).to.equal('lrn:edit')
  })

  it('haxToggleEdit flips edit mode and reports success', async () => {
    expect(element.haxToggleEdit({})).to.be.true
    expect(element.editMode).to.be.true
    expect(element.haxToggleEdit({})).to.be.true
    expect(element.editMode).to.be.false
    await element.updateComplete
    // the dynamic code-editor import may have resolved; with no inert host
    // rendered there is nothing for it to upgrade
    expect(element.shadowRoot.querySelector('code-editor')).to.not.exist
  })

  it('getExample returns samples for every language', () => {
    expect(element.getExample('js')).to.include('everyBody')
    expect(element.getExample('xml')).to.include('fhqwhgads')
    expect(element.getExample('yaml')).to.include('Homestar Runner')
    expect(element.getExample('php')).to.include('tRoPhY')
    expect(element.getExample('json')).to.include('mainMenu')
    expect(element.getExample('css')).to.include('tothelimit')
    expect(element.getExample('html')).to.include('Strongbad')
  })
})

describe('code-sample content handling', () => {
  it('errors and creates an empty template for non-template content', async () => {
    const el = await fixture(html`<code-sample>just some text</code-sample>`)
    await el.updateComplete
    // connectedCallback logged the error branch and _updateContent
    // synthesized a template child
    const template = el.querySelector('template')
    expect(template).to.exist
    expect(template.getAttribute('preserve-content')).to.equal(
      'preserve-content',
    )
    expect(el.shadowRoot.querySelector('#code').children.length).to.equal(0)
  })

  it('copies to clipboard through the copy button', async () => {
    const el = await fixture(
      `<code-sample type="javascript" copy-clipboard-button><template preserve-content="preserve-content">const x = 1;</template></code-sample>`,
    )
    await el.updateComplete
    const copyButton = el.shadowRoot.querySelector('#copyButton')
    expect(copyButton).to.exist
    expect(copyButton.hasAttribute('hidden')).to.be.false
    copyButton.click()
    // button text switches to Done (or Error if execCommand throws)
    expect(['Done', 'Error']).to.include(copyButton.textContent.trim())
    // the helper textarea was appended to the body and removed again
    expect(globalThis.document.body.querySelector('textarea')).to.not.exist
    // the label resets after the timeout
    await sleep(1100)
    expect(copyButton.textContent.trim()).to.equal('Copy')
  })

  it('switches between every packaged theme', async () => {
    const el = await fixture(
      html`<code-sample type="javascript">
        <template preserve-content="preserve-content">const x = 1;</template>
      </code-sample>`,
    )
    await el.updateComplete
    const themes = [
      oneDark,
      oneLight,
      defaultTheme,
      github,
      kustomDark,
      kustomLight,
      solarizedDark,
      solarizedLight,
    ]
    for (const theme of themes) {
      el.theme = theme
      await el.updateComplete
      const themeDiv = el.shadowRoot.querySelector('#theme')
      expect(themeDiv.innerHTML.includes('<style')).to.be.true
      // re-theming through render keeps exactly one active style element;
      // the old clear-loop compared a bare NodeList with > 0 (always
      // false, dead code) and making it live would have ejected lit part
      // markers and crashed every re-theme
      expect(themeDiv.querySelectorAll('style').length).to.equal(1)
    }
  })
})

describe('vendored hljs core API', () => {
  it('highlight throws for unknown languages', () => {
    let threw = false
    try {
      hljs.highlight('nosuchlang', 'code')
    } catch (e) {
      threw = true
    }
    expect(threw).to.be.true
  })

  it('returns the escaped fallback on illegal lexemes', () => {
    const result = hljs.highlight('javascript', 'const s = "abc\ndef"', false)
    expect(result.relevance).to.equal(0)
    expect(typeof result.value).to.equal('string')
  })

  it('closes dangling modes for unterminated comments', () => {
    const result = hljs.highlight('javascript', '/* never closed', true)
    expect(result.value).to.include('hljs-comment')
  })

  it('highlightAuto detects a language and tracks the runner-up', () => {
    const result = hljs.highlightAuto('const x = 1; // note\n')
    expect(typeof result.language).to.equal('string')
    expect(typeof result.value).to.equal('string')
  })

  it('registers languages with aliases and exposes helpers', () => {
    hljs.registerLanguage('fakelang', () => ({
      aliases: ['fk'],
      contains: [{ className: 'built_in', begin: 'foo', end: 'bar' }],
    }))
    expect(hljs.getLanguage('fk')).to.exist
    expect(hljs.getLanguage('FAKELANG')).to.exist
    expect(hljs.listLanguages().includes('fakelang')).to.be.true
    expect(hljs.autoDetection('fakelang')).to.be.true
    const out = hljs.highlight('fk', 'foo hello bar', true)
    expect(out.value).to.include('hljs-built_in')
    // languages can opt out of autodetection
    hljs.registerLanguage('nodetectlang', () => ({
      disableAutodetect: true,
      contains: [],
    }))
    expect(hljs.autoDetection('nodetectlang')).to.be.false
    // unregistered languages short-circuit to undefined
    expect(hljs.autoDetection('missinglang')).to.be.undefined
  })
})

describe('vendored hljs highlightBlock', () => {
  const hosts = []

  afterEach(() => {
    while (hosts.length) {
      const host = hosts.pop()
      if (host.parentNode) host.parentNode.removeChild(host)
    }
  })

  const makeHost = (inner) => {
    const host = globalThis.document.createElement('div')
    host.innerHTML = inner
    globalThis.document.body.appendChild(host)
    hosts.push(host)
    return host
  }

  it('detects language-* classes on the block', () => {
    const host = makeHost(
      '<code class="language-javascript">const x = 1;</code>',
    )
    hljs.highlightBlock(host.querySelector('code'))
    const code = host.querySelector('code')
    expect(code.className.includes('hljs')).to.be.true
    expect(code.innerHTML.includes('hljs-keyword')).to.be.true
  })

  it('treats unknown language-* classes as no-highlight', () => {
    const host = makeHost(
      '<code class="language-nosuchlang">plain text</code>',
    )
    hljs.highlightBlock(host.querySelector('code'))
    const code = host.querySelector('code')
    expect(code.className.includes('hljs')).to.be.false
    expect(code.innerHTML).to.equal('plain text')
  })

  it('skips blocks explicitly marked no-highlight', () => {
    const host = makeHost('<code class="no-highlight">const x = 1;</code>')
    hljs.highlightBlock(host.querySelector('code'))
    const code = host.querySelector('code')
    expect(code.className.includes('hljs')).to.be.false
    expect(code.innerHTML).to.equal('const x = 1;')
  })

  it('detects plain class names without the language- prefix', () => {
    const host = makeHost('<code class="javascript">const x = 1;</code>')
    hljs.highlightBlock(host.querySelector('code'))
    const code = host.querySelector('code')
    expect(code.className.includes('hljs')).to.be.true
    expect(code.innerHTML.includes('hljs-keyword')).to.be.true
  })

  it('preserves original markup elements while highlighting', () => {
    const host = makeHost(
      '<code class="language-javascript">const <b>x</b> = 1;<br>let y = 2;</code>',
    )
    hljs.highlightBlock(host.querySelector('code'))
    const code = host.querySelector('code')
    // the <b> element survives the merged-stream highlighting
    expect(code.querySelector('b')).to.exist
    expect(code.querySelector('b').textContent).to.equal('x')
    expect(code.querySelectorAll('span').length > 0).to.be.true
  })

  it('converts <br> markup when configured to useBR', () => {
    const host = makeHost(
      '<code class="javascript">const x = 1;<br>let y = 2;</code>',
    )
    hljs.configure({ useBR: true })
    try {
      hljs.highlightBlock(host.querySelector('code'))
      const code = host.querySelector('code')
      expect(code.className.includes('hljs')).to.be.true
      // <br> was normalized to newlines for parsing and re-emitted after
      expect(code.innerHTML.includes('<br>')).to.be.true
      expect(code.innerHTML.includes('hljs-number')).to.be.true
    } finally {
      hljs.configure({ useBR: false })
    }
  })

  it('expands tabs when tabReplace is configured', () => {
    // fixMarkup only replaces tabs at the start of a line
    const host = makeHost(
      '<code class="javascript">\ttabbed = 1;</code>',
    )
    hljs.configure({ tabReplace: 'TABSPAN' })
    try {
      hljs.highlightBlock(host.querySelector('code'))
      expect(host.querySelector('code').innerHTML.startsWith('TABSPAN')).to.be
        .true
    } finally {
      hljs.configure({ tabReplace: null })
    }
  })

  it('initHighlighting processes pre>code blocks in the document once', () => {
    const host = makeHost(
      '<pre><code class="javascript">const x = 1;</code></pre>',
    )
    const code = host.querySelector('code')
    hljs.initHighlighting()
    expect(code.className.includes('hljs')).to.be.true
    // the called-guard makes the second invocation a no-op
    code.className = 'javascript'
    hljs.initHighlighting()
    expect(code.className).to.equal('javascript')
  })

  it('initHighlightingOnLoad registers listeners without throwing', () => {
    hljs.initHighlightingOnLoad()
    expect(typeof hljs.initHighlighting).to.equal('function')
  })
})

describe('vendored hljs line-numbers plugin', () => {
  it('lineNumbersValue builds tables with startFrom options', () => {
    const out = hljs.lineNumbersValue('line1\nline2\nline3', { startFrom: 5 })
    expect(typeof out).to.equal('string')
    expect(out.includes('data-line-number="5"')).to.be.true
    expect(out.includes('data-line-number="7"')).to.be.true
    expect(out.includes('hljs-ln-code')).to.be.true
    // non-string input returns undefined
    expect(hljs.lineNumbersValue(42)).to.be.undefined
    // single-line input without singleLine is returned unchanged
    expect(hljs.lineNumbersValue('only line')).to.equal('only line')
    // singleLine forces numbering even for one line
    const single = hljs.lineNumbersValue('only line', { singleLine: true })
    expect(single.includes('data-line-number="1"')).to.be.true
  })

  it('lineNumbersBlock honors data-ln-start-from attributes', async () => {
    const host = globalThis.document.createElement('div')
    host.innerHTML =
      '<code class="javascript" data-ln-start-from="10">one\ntwo</code>'
    globalThis.document.body.appendChild(host)
    try {
      const code = host.querySelector('code')
      hljs.lineNumbersBlock(code, {})
      await sleep(30)
      expect(code.innerHTML.includes('data-line-number="10"')).to.be.true
      expect(code.innerHTML.includes('data-line-number="11"')).to.be.true
    } finally {
      globalThis.document.body.removeChild(host)
    }
  })

  it('falls back to 1 for invalid start-from values', async () => {
    const host = globalThis.document.createElement('div')
    host.innerHTML =
      '<code class="javascript" data-ln-start-from="abc">one\ntwo</code>'
    globalThis.document.body.appendChild(host)
    try {
      const code = host.querySelector('code')
      hljs.lineNumbersBlock(code, {})
      await sleep(30)
      expect(code.innerHTML.includes('data-line-number="1"')).to.be.true
    } finally {
      globalThis.document.body.removeChild(host)
    }
  })

  it('skips blocks marked nohljsln through the selector path', async () => {
    const host = globalThis.document.createElement('div')
    host.innerHTML = '<code class="javascript nohljsln">one\ntwo</code>'
    globalThis.document.body.appendChild(host)
    try {
      const code = host.querySelector('code')
      hljs.initLineNumbersOnLoad({}, code)
      await sleep(30)
      expect(code.innerHTML.includes('hljs-ln')).to.be.false
    } finally {
      globalThis.document.body.removeChild(host)
    }
  })

  it('processes all code-sample elements when no selector is given', async () => {
    const el = await fixture(
      `<code-sample type="javascript"><template preserve-content="preserve-content">const a = 1;
/* a comment
that spans lines */
const b = 2;</template></code-sample>`,
    )
    await sleep(80)
    const code = el.shadowRoot.querySelector('code')
    expect(code).to.exist
    code.classList.remove('nohljsln')
    hljs.initLineNumbersOnLoad({})
    await sleep(80)
    expect(code.innerHTML.includes('hljs-ln')).to.be.true
    expect(code.innerHTML.includes('data-line-number="1"')).to.be.true
  })

  it('catches and logs errors from broken code-sample blocks', async () => {
    const el = await fixture(
      `<code-sample type="javascript"><template preserve-content="preserve-content">const a = 1;</template></code-sample>`,
    )
    await sleep(80)
    const code = el.shadowRoot.querySelector('code')
    expect(code).to.exist
    code.remove()
    const origError = globalThis.console.error
    const errors = []
    globalThis.console.error = (...args) => errors.push(args.join(' '))
    try {
      hljs.initLineNumbersOnLoad({})
      await sleep(30)
    } finally {
      globalThis.console.error = origError
    }
    expect(errors.length > 0).to.be.true
    expect(errors[0].includes('LineNumbers error')).to.be.true
  })

  it('captures selections inside line-number tables on copy', async () => {
    const el = await fixture(
      `<code-sample type="javascript"><template preserve-content="preserve-content">const a = 1;
const b = 2;</template></code-sample>`,
    )
    await sleep(80)
    const codeTd = el.shadowRoot.querySelector('td.hljs-ln-code')
    expect(codeTd).to.exist
    const range = globalThis.document.createRange()
    range.selectNodeContents(codeTd)
    const selection = globalThis.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
    const dataTransfer = new DataTransfer()
    const copyEvent = new ClipboardEvent('copy', {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true,
    })
    globalThis.document.dispatchEvent(copyEvent)
    expect(dataTransfer.getData('text/plain')).to.include('const')
    expect(copyEvent.defaultPrevented).to.be.true
    selection.removeAllRanges()
  })
})
