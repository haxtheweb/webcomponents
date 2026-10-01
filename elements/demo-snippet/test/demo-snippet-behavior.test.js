import { html, fixture, expect } from '@open-wc/testing'
import '../demo-snippet.js'
import '@haxtheweb/code-sample/code-sample.js'
import '@haxtheweb/i18n-manager/i18n-manager.js'
import '@haxtheweb/simple-tooltip/simple-tooltip.js'
import { I18NManagerStore } from '@haxtheweb/i18n-manager/i18n-manager.js'

describe('demo-snippet rendering structure', () => {
  it('renders a .demo container with a slot', async () => {
    const el = await fixture(html`<demo-snippet></demo-snippet>`)
    const demo = el.shadowRoot.querySelector('.demo')
    expect(demo).to.exist
    const slot = demo.querySelector('slot')
    expect(slot).to.exist
    expect(slot.id).to.equal('content')
  })

  it('renders a code-sample element with type html', async () => {
    const el = await fixture(html`<demo-snippet></demo-snippet>`)
    const codeSample = el.shadowRoot.querySelector('#codeDisplay')
    expect(codeSample).to.exist
    expect(codeSample.getAttribute('type')).to.equal('html')
  })

  it('renders code-sample with copy-clipboard-button attribute', async () => {
    const el = await fixture(html`<demo-snippet></demo-snippet>`)
    const codeSample = el.shadowRoot.querySelector('#codeDisplay')
    expect(codeSample.hasAttribute('copy-clipboard-button')).to.equal(true)
  })
})

describe('demo-snippet slot projection with template', () => {
  it('extracts innerHTML from slotted template into _markdown', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <input type="date" />
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(el._markdown).to.contain('<input')
    expect(el._markdown).to.contain('type="date"')
  })

  it('stamps template content into light DOM projected through the demo section', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <span class="stamped">Stamped Content</span>
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    // stamped content lives in light DOM so document scripts can reach it
    const stamped = el.querySelector('.stamped')
    expect(stamped).to.exist
    expect(stamped.textContent).to.contain('Stamped Content')
    // projected through the content slot into the .demo section
    const slot = el.shadowRoot.querySelector('.demo slot')
    const assigned = slot.assignedNodes({ flatten: true })
    expect(assigned.includes(stamped)).to.equal(true)
    // stamped exactly once even though slotchange and firstUpdated both fire
    expect(el.querySelectorAll('.stamped').length).to.equal(1)
  })

  it('dispatches dom-ready event after updating markdown', async () => {
    let fired = false
    const el = await fixture(html`
      <demo-snippet
        @dom-ready="${() => {
          fired = true
        }}"
      >
        <template>
          <p>Hello</p>
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(fired).to.equal(true)
  })

  it('sets _markdown to empty when no template is slotted', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <div>Not a template</div>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(el._markdown).to.equal('')
  })

  it('cleans up empty boolean attributes (="")', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <input checked />
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(el._markdown).to.contain('checked')
    expect(el._markdown).to.not.contain('checked=""')
  })

  it('cleans up empty class attributes', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <div class="">Content</div>
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(el._markdown).to.not.contain('class=""')
  })
})

describe('demo-snippet _unindent', () => {
  it('returns empty string for falsy input', async () => {
    const el = await fixture(html`<demo-snippet></demo-snippet>`)
    expect(el._unindent('')).to.equal('')
    expect(el._unindent(null)).to.equal('')
    expect(el._unindent(undefined)).to.equal('')
  })

  it('removes leading and trailing empty lines and common indent', async () => {
    const el = await fixture(html`<demo-snippet></demo-snippet>`)
    const result = el._unindent('\n\n  <p>text</p>\n\n')
    expect(result).to.equal('<p>text</p>')
  })

  it('removes common indentation from all lines', async () => {
    const el = await fixture(html`<demo-snippet></demo-snippet>`)
    const result = el._unindent('    <div>\n      <p>text</p>\n    </div>')
    expect(result).to.equal('<div>\n  <p>text</p>\n</div>')
  })

  it('handles single line input', async () => {
    const el = await fixture(html`<demo-snippet></demo-snippet>`)
    const result = el._unindent('  <p>single</p>')
    expect(result).to.equal('<p>single</p>')
  })

  it('returns empty string for all-empty-lines input', async () => {
    const el = await fixture(html`<demo-snippet></demo-snippet>`)
    const result = el._unindent('\n\n\n')
    expect(result).to.equal('')
  })

  it('preserves relative indentation when min indent is 0', async () => {
    const el = await fixture(html`<demo-snippet></demo-snippet>`)
    const result = el._unindent('<div>\n  <p>text</p>\n</div>')
    expect(result).to.equal('<div>\n  <p>text</p>\n</div>')
  })
})

describe('demo-snippet _updateCodeSample', () => {
  it('creates a new template inside code-sample with markdown content', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <p>Code content</p>
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    const codeDisplay = el.shadowRoot.querySelector('#codeDisplay')
    const tmpl = codeDisplay.querySelector('template')
    expect(tmpl).to.exist
    expect(tmpl.innerHTML).to.contain('Code content')
  })

  it('replaces existing template when markdown updates', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <p>First</p>
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    el._markdown = '<p>Second</p>'
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    const codeDisplay = el.shadowRoot.querySelector('#codeDisplay')
    const tmpl = codeDisplay.querySelector('template')
    expect(tmpl.innerHTML).to.contain('Second')
    expect(tmpl.innerHTML).to.not.contain('First')
  })
})

describe('demo-snippet disconnectedCallback', () => {
  it('disconnects observer without error', async () => {
    const el = await fixture(html`<demo-snippet></demo-snippet>`)
    expect(() => el.disconnectedCallback()).to.not.throw()
  })

  it('disconnects observer after template was processed', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <p>Content</p>
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(() => el.disconnectedCallback()).to.not.throw()
  })
})

describe('demo-snippet firstUpdated and updated lifecycle', () => {
  it('calls _updateMarkdown after firstUpdated via updateComplete', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <span>LC</span>
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(el._markdown).to.contain('LC')
  })

  it('updated reacts to _markdown change and calls _updateCodeSample', async () => {
    const el = await fixture(html`<demo-snippet></demo-snippet>`)
    await el.updateComplete
    el._markdown = '<div>Manual</div>'
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    const codeDisplay = el.shadowRoot.querySelector('#codeDisplay')
    const tmpl = codeDisplay.querySelector('template')
    expect(tmpl).to.exist
    expect(tmpl.innerHTML).to.contain('Manual')
  })
})

describe('demo-snippet complex content rendering', () => {
  it('renders nested HTML and triggers code-sample highlighting', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <div class="container">
            <h1>Title</h1>
            <p>Paragraph with <a href="#">link</a></p>
            <ul>
              <li>Item 1</li>
              <li>Item 2</li>
            </ul>
          </div>
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(el._markdown).to.contain('<div')
    expect(el._markdown).to.contain('<h1>')
    expect(el._markdown).to.contain('<a href="#">')
    const codeDisplay = el.shadowRoot.querySelector('#codeDisplay')
    expect(codeDisplay).to.exist
    const tmpl = codeDisplay.querySelector('template')
    expect(tmpl).to.exist
    expect(tmpl.innerHTML).to.contain('container')
  })

  it('renders self-closing tags and boolean attributes', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <input type="checkbox" checked disabled />
          <img src="test.png" alt="test" />
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(el._markdown).to.contain('checked')
    expect(el._markdown).to.contain('disabled')
    expect(el._markdown).to.contain('img')
    expect(el._markdown).to.not.contain('=""')
  })

  it('renders multiple templates updating code-sample each time', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <p>First content</p>
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(el._markdown).to.contain('First content')
    el._markdown = '<div>Second content</div>'
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 200))
    const codeDisplay = el.shadowRoot.querySelector('#codeDisplay')
    const tmpl = codeDisplay.querySelector('template')
    expect(tmpl.innerHTML).to.contain('Second content')
  })
})

describe('demo-snippet a11y with content', () => {
  it('passes a11y audit with slotted template', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <p>Hello world</p>
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 100))
    await expect(el).shadowDom.to.be.accessible()
  })
})

describe('code-sample integration via demo-snippet', () => {
  it('code-sample processes and highlights template content', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <div class="test">
            <p>Highlighted content</p>
          </div>
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 300))
    const codeSample = el.shadowRoot.querySelector('#codeDisplay')
    await codeSample.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 200))
    const code = codeSample.shadowRoot.querySelector('#code')
    expect(code).to.exist
    const codeEl = code.querySelector('code')
    expect(codeEl).to.exist
  })

  it('code-sample copy button is visible when copyClipboardButton is true', async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <p>Copy test</p>
        </template>
      </demo-snippet>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 300))
    const codeSample = el.shadowRoot.querySelector('#codeDisplay')
    const copyBtn = codeSample.shadowRoot.querySelector('#copyButton')
    expect(copyBtn).to.exist
    expect(copyBtn.hasAttribute('hidden')).to.equal(false)
  })
})

describe('code-sample direct rendering', () => {
  it('highlights HTML content in code-sample', async () => {
    const el = await fixture(html`
      <code-sample type="html" copy-clipboard-button>
        <template preserve-content="preserve-content">
          <div class="test">
            <p>Direct code sample</p>
          </div>
        </template>
      </code-sample>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 300))
    const code = el.shadowRoot.querySelector('#code')
    expect(code).to.exist
    const codeEl = code.querySelector('code')
    expect(codeEl).to.exist
    expect(codeEl.innerHTML).to.contain('Direct code sample')
  })

  it('highlights JavaScript content in code-sample', async () => {
    const el = await fixture(html`
      <code-sample type="javascript" copy-clipboard-button>
        <template preserve-content="preserve-content">
          const x = 42;
          console.log(x);
        </template>
      </code-sample>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 300))
    const code = el.shadowRoot.querySelector('#code')
    const codeEl = code.querySelector('code')
    expect(codeEl).to.exist
    expect(codeEl.innerHTML).to.contain('42')
  })

  it('copy button click triggers _copyToClipboard', async () => {
    const el = await fixture(html`
      <code-sample type="html" copy-clipboard-button>
        <template preserve-content="preserve-content">
          <p>Copy me</p>
        </template>
      </code-sample>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 300))
    const copyBtn = el.shadowRoot.querySelector('#copyButton')
    expect(copyBtn).to.exist
    copyBtn.click()
    await new Promise((resolve) => setTimeout(resolve, 100))
    expect(copyBtn.textContent.trim()).to.equal('Done')
  })

  it('renders theme styles in #theme element', async () => {
    const el = await fixture(html`
      <code-sample type="html">
        <template preserve-content="preserve-content">
          <p>Theme test</p>
        </template>
      </code-sample>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 300))
    const theme = el.shadowRoot.querySelector('#theme')
    expect(theme).to.exist
    expect(theme.children.length).to.be.greaterThan(0)
  })

  it('defaults type to html', async () => {
    const el = await fixture(html`
      <code-sample>
        <template preserve-content="preserve-content">
          <p>Default type</p>
        </template>
      </code-sample>
    `)
    expect(el.type).to.equal('html')
  })

  it('defaults copyClipboardButton to false', async () => {
    const el = await fixture(html`
      <code-sample>
        <template preserve-content="preserve-content">
          <p>No copy</p>
        </template>
      </code-sample>
    `)
    expect(el.copyClipboardButton).to.equal(false)
  })

  it('disconnectedCallback disconnects observer without error', async () => {
    const el = await fixture(html`
      <code-sample type="html">
        <template preserve-content="preserve-content">
          <p>Disconnect</p>
        </template>
      </code-sample>
    `)
    await el.updateComplete
    await new Promise((resolve) => setTimeout(resolve, 200))
    expect(() => el.disconnectedCallback()).to.not.throw()
  })
})

describe('i18n-manager singleton API', () => {
  it('provides the I18NManagerStore singleton', () => {
    expect(I18NManagerStore).to.exist
    expect(I18NManagerStore.tagName.toLowerCase()).to.equal('i18n-manager')
  })

  it('has documentLang and documentDir getters', () => {
    expect(I18NManagerStore.documentLang).to.exist
    expect(I18NManagerStore.dir).to.exist
  })

  it('registerLocalization adds an element to the manager', () => {
    const fakeContext = { tagName: 'FAKE-CTX', t: { hello: 'Hello' } }
    I18NManagerStore.registerLocalization({
      context: fakeContext,
      namespace: 'test-ns',
      localesPath: '/fake/locales',
      locales: ['en', 'es'],
    })
    const match = I18NManagerStore.elements.filter(
      (e) => e.namespace === 'test-ns',
    )
    expect(match.length).to.be.greaterThan(0)
  })

  it('detailNormalize infers namespace from context tagName', () => {
    const ctx = { tagName: 'MY-ELEMENT', t: { hi: 'Hi' } }
    const result = I18NManagerStore.detailNormalize({
      context: ctx,
      localesPath: '/fake/locales',
    })
    expect(result.namespace).to.equal('my-element')
  })

  it('detailNormalize infers updateCallback from context', () => {
    const ctx = { tagName: 'MY-EL', requestUpdate: () => {}, t: {} }
    const result = I18NManagerStore.detailNormalize({
      context: ctx,
      localesPath: '/fake/locales',
    })
    expect(result.updateCallback).to.equal('requestUpdate')
  })

  it('detailNormalize infers localesPath from basePath', () => {
    const result = I18NManagerStore.detailNormalize({
      namespace: 'test-ns2',
      basePath: 'https://example.com/some/path',
    })
    expect(result.localesPath).to.contain('locales')
  })

  it('hasTranslation returns false when manifest not loaded', () => {
    expect(I18NManagerStore.hasTranslation('foo', 'es')).to.equal(false)
  })

  it('needsManifest returns false for English', () => {
    expect(I18NManagerStore.needsManifest('en')).to.equal(false)
    expect(I18NManagerStore.needsManifest('en-US')).to.equal(false)
  })

  it('needsManifest returns true for non-English', () => {
    expect(I18NManagerStore.needsManifest('es')).to.equal(true)
    expect(I18NManagerStore.needsManifest('fr')).to.equal(true)
  })

  it('changeLanguageEvent updates lang from detail', () => {
    I18NManagerStore.changeLanguageEvent({ detail: 'fr' })
    expect(I18NManagerStore.lang).to.equal('fr')
    I18NManagerStore.changeLanguageEvent({ detail: 'en' })
    expect(I18NManagerStore.lang).to.equal('en')
  })
})

describe('simple-tooltip rendering', () => {
  it('can be instantiated', async () => {
    const el = await fixture(
      html`<simple-tooltip>Test tooltip</simple-tooltip>`,
    )
    expect(el).to.exist
    expect(el.tagName.toLowerCase()).to.equal('simple-tooltip')
  })

  it('renders content in shadow DOM', async () => {
    const el = await fixture(
      html`<simple-tooltip>My tooltip text</simple-tooltip>`,
    )
    await el.updateComplete
    expect(el.shadowRoot).to.exist
  })

  it('reflects position attribute', async () => {
    const el = await fixture(
      html`<simple-tooltip position="top">Tip</simple-tooltip>`,
    )
    expect(el.getAttribute('position')).to.equal('top')
  })

  it('has a shadowRoot after connection', async () => {
    const el = await fixture(
      html`<simple-tooltip>Default</simple-tooltip>`,
    )
    await el.updateComplete
    expect(el.shadowRoot).to.exist
  })
})
