import { expect } from '@open-wc/testing'
import { ESGlobalBridgeStore } from '@haxtheweb/es-global-bridge/es-global-bridge.js'

// The vendored mammoth browser build (lib/mammoth/mammoth.browser.min.js) is
// injected by ESGlobalBridgeStore in the constructor. Stub the bridge for
// this session so the vendored script never executes; conversion logic runs
// against a fake globalThis.mammoth instead.
let originalLoad
let docxLib

before(async () => {
  originalLoad = ESGlobalBridgeStore.load
  ESGlobalBridgeStore.load = () => Promise.resolve(true)
  docxLib = await import('../lib/docx-file-system-broker.js')
})

after(() => {
  if (originalLoad) {
    ESGlobalBridgeStore.load = originalLoad
  }
})

describe('DOCXFileSystemBroker', () => {
  let element

  beforeEach(() => {
    element = document.createElement('docx-file-system-broker')
    document.body.appendChild(element)
  })

  afterEach(() => {
    if (element.parentNode) {
      element.remove()
    }
  })

  it('registers the custom element and exposes the singleton', () => {
    expect(docxLib.DOCXFileSystemBroker.tag).to.equal('docx-file-system-broker')
    expect(globalThis.customElements.get('docx-file-system-broker')).to.exist
    expect(
      docxLib.DOCXFileSystemBrokerSingleton instanceof
        docxLib.DOCXFileSystemBroker,
    ).to.be.true
    expect(
      globalThis.DOCXFileSystemBroker.requestAvailability() ===
        docxLib.DOCXFileSystemBrokerSingleton,
    ).to.be.true
    expect(
      docxLib.DOCXFileSystemBrokerSingleton.parentNode === document.body,
    ).to.be.true
  })

  describe('constructor wiring', () => {
    it('fires docx-reader-ready with the global mammoth once resolved', async () => {
      const fakeMammoth = { marker: 'fake-mammoth' }
      const saved = globalThis.mammoth
      globalThis.mammoth = fakeMammoth
      let detail = null
      const el = document.createElement('docx-file-system-broker')
      el.addEventListener('docx-reader-ready', (e) => {
        detail = e.detail
      })
      document.body.appendChild(el)
      try {
        await new Promise((resolve) => setTimeout(resolve, 10))
        expect(el.docx === fakeMammoth).to.be.true
        expect(detail === el).to.be.true
      } finally {
        el.remove()
        if (saved === undefined) {
          delete globalThis.mammoth
        } else {
          globalThis.mammoth = saved
        }
      }
    })

    it('stays quiet when mammoth never loads', async () => {
      const saved = globalThis.mammoth
      delete globalThis.mammoth
      let fired = false
      const el = document.createElement('docx-file-system-broker')
      el.addEventListener('docx-reader-ready', () => {
        fired = true
      })
      document.body.appendChild(el)
      try {
        await new Promise((resolve) => setTimeout(resolve, 10))
        expect(fired).to.be.false
        expect(el.docx).to.be.undefined
      } finally {
        el.remove()
        if (saved !== undefined) {
          globalThis.mammoth = saved
        }
      }
    })

    it('targets the vendored mammoth path', () => {
      expect(element.libPath.endsWith('mammoth/')).to.be.true
      expect(element.libPath.includes('file-system-broker')).to.be.true
    })
  })

  describe('__toHTML', () => {
    it('dispatches docx-file-system-data with name and value', async () => {
      const detail = await new Promise((resolve) => {
        globalThis.addEventListener(
          'docx-file-system-data',
          (e) => resolve(e.detail),
          { once: true },
        )
        element.__toHTML({ value: '<p>converted</p>' }, 'report.docx')
      })
      expect(detail).to.deep.equal({
        name: 'report.docx',
        value: '<p>converted</p>',
      })
    })
  })

  describe('HTMLToDOCX', () => {
    it('downloads through a data uri anchor when dl is true', () => {
      const clicks = []
      const originalClick = HTMLAnchorElement.prototype.click
      HTMLAnchorElement.prototype.click = function () {
        clicks.push({
          node: this,
          href: this.href,
          download: this.download,
        })
      }
      try {
        const output = element.HTMLToDOCX('<p>Content</p>', 'testdoc', true)
        expect(clicks.length).to.equal(1)
        expect(clicks[0].download).to.equal('testdoc.docx')
        expect(
          clicks[0].href.indexOf(
            'data:application/vnd.ms-word;charset=utf-8,',
          ),
        ).to.equal(0)
        const decoded = decodeURIComponent(
          clicks[0].href.split(',').slice(1).join(','),
        )
        expect(decoded.indexOf('<title>testdoc</title>') > -1).to.be.true
        expect(decoded.indexOf('<p>Content</p>') > -1).to.be.true
        expect(output.indexOf('<p>Content</p>') > -1).to.be.true
        // the anchor is cleaned up after the click
        expect(clicks[0].node.isConnected).to.be.false
      } finally {
        HTMLAnchorElement.prototype.click = originalClick
      }
    })

    it('returns the document without downloading when dl is false', () => {
      const clicks = []
      const originalClick = HTMLAnchorElement.prototype.click
      HTMLAnchorElement.prototype.click = function () {
        clicks.push(true)
      }
      try {
        const output = element.HTMLToDOCX('<p>No download</p>', 'silent', false)
        expect(clicks.length).to.equal(0)
        expect(output.indexOf('<p>No download</p>') > -1).to.be.true
        expect(output.indexOf('<title>silent</title>') > -1).to.be.true
      } finally {
        HTMLAnchorElement.prototype.click = originalClick
      }
    })
  })

  describe('fileToHTML', () => {
    const makeFakeMammoth = (convertInputs, html) => ({
      convertToHtml: (input) => {
        convertInputs.push(input)
        return {
          then: (onResolved) => ({
            done: () => Promise.resolve(onResolved({ value: html })),
          }),
        }
      },
    })

    it('converts a file through mammoth and dispatches the html', async () => {
      const convertInputs = []
      element.docx = makeFakeMammoth(convertInputs, '<p>converted html</p>')
      const detail = await new Promise((resolve) => {
        globalThis.addEventListener(
          'docx-file-system-data',
          (e) => resolve(e.detail),
          { once: true },
        )
        const file = new File(['docx-bytes'], 'input.docx')
        element.fileToHTML(file, 'input-doc')
      })
      expect(detail).to.deep.equal({
        name: 'input-doc',
        value: '<p>converted html</p>',
      })
      expect(convertInputs.length).to.equal(1)
      expect(convertInputs[0].arrayBuffer).to.equal('docx-bytes')
    })

    it('defaults the document name to filepicked', async () => {
      element.docx = makeFakeMammoth([], '<em>ok</em>')
      const detail = await new Promise((resolve) => {
        globalThis.addEventListener(
          'docx-file-system-data',
          (e) => resolve(e.detail),
          { once: true },
        )
        element.fileToHTML(new File(['x'], 'any.docx'))
      })
      expect(detail.name).to.equal('filepicked')
      expect(detail.value).to.equal('<em>ok</em>')
    })

    it('queues a premature read and converts it once mammoth loads', async () => {
      // FIXED: docx-file-system-broker.js fileToHTML guards this.docx in the
      // onload handler; reads that arrive before mammoth finishes loading
      // are queued on the element and flushed by the constructor resolution
      // path right after docx-reader-ready fires, so the file converts with
      // no unhandled rejection.
      const originalLoad = ESGlobalBridgeStore.load
      let resolveLoad
      const loadPromise = new Promise((resolve) => {
        resolveLoad = resolve
      })
      ESGlobalBridgeStore.load = () => loadPromise
      const savedMammoth = globalThis.mammoth
      delete globalThis.mammoth
      let el = null
      try {
        el = document.createElement('docx-file-system-broker')
        document.body.appendChild(el)
        const convertInputs = []
        el.fileToHTML(new File(['premature-bytes'], 'early.docx'), 'early-doc')
        // mammoth is still loading, so the read queues instead of converting
        await new Promise((resolve) => setTimeout(resolve, 50))
        expect(el.docx).to.be.undefined
        expect(el.docxReadQueue).to.deep.equal([
          { arrayBuffer: 'premature-bytes', name: 'early-doc' },
        ])
        const detail = new Promise((resolve) => {
          globalThis.addEventListener(
            'docx-file-system-data',
            (e) => resolve(e.detail),
            { once: true },
          )
          globalThis.mammoth = makeFakeMammoth(convertInputs, '<p>late</p>')
          resolveLoad(true)
        })
        const resolved = await detail
        expect(resolved).to.deep.equal({
          name: 'early-doc',
          value: '<p>late</p>',
        })
        expect(el.docx === globalThis.mammoth).to.be.true
        expect(convertInputs.length).to.equal(1)
        expect(convertInputs[0].arrayBuffer).to.equal('premature-bytes')
        expect(el.docxReadQueue).to.deep.equal([])
      } finally {
        ESGlobalBridgeStore.load = originalLoad
        if (el) {
          el.remove()
        }
        if (savedMammoth === undefined) {
          delete globalThis.mammoth
        } else {
          globalThis.mammoth = savedMammoth
        }
      }
    })
  })
})
