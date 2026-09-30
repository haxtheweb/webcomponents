import { fixture, expect, html } from '@open-wc/testing'
import '../editable-table.js'
import '../lib/editable-table-display.js'
import '../lib/editable-table-edit.js'
import '../lib/editable-table-editor-rowcol.js'
import '../lib/editable-table-filter.js'
import '../lib/editable-table-sort.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const SAMPLE_DATA = [
  ['Food', 'Enclosure', 'Contents'],
  ['Hamburger', 'two buns', '5'],
  ['Hoagie', 'one bun', '2'],
]

describe('editable-table behaviors', () => {
  let element

  beforeEach(async () => {
    element = await fixture(
      html`<editable-table>
        <table>
          <caption>
            Is it a sandwich?
          </caption>
          <thead>
            <tr>
              <th scope="col">Food</th>
              <th scope="col">Enclosure</th>
              <th scope="col">Contents</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Hamburger</th>
              <td>two buns</td>
              <td>5</td>
            </tr>
            <tr>
              <th scope="row">Hoagie</th>
              <td>one bun</td>
              <td>2</td>
            </tr>
          </tbody>
        </table>
      </editable-table>`,
    )
    // slotted table is imported asynchronously from connectedCallback
    await sleep(80)
    await element.updateComplete
  })

  describe('CSVtoArray', () => {
    it('parses plain CSV text', () => {
      expect(element.CSVtoArray('a,b\nc,d')).to.deep.equal([
        ['a', 'b'],
        ['c', 'd'],
      ])
    })

    it('keeps commas inside quoted cells', () => {
      expect(element.CSVtoArray('"a,b",c')).to.deep.equal([['a,b', 'c']])
    })

    it('unescapes doubled quotes inside quoted cells', () => {
      expect(element.CSVtoArray('"a""b",c')).to.deep.equal([['a"b', 'c']])
    })

    it('handles CRLF line endings', () => {
      expect(element.CSVtoArray('a,b\r\nc,d')).to.deep.equal([
        ['a', 'b'],
        ['c', 'd'],
      ])
    })

    it('returns a single empty cell for empty input', () => {
      expect(element.CSVtoArray('')).to.deep.equal([['']])
    })
  })

  describe('cell helpers', () => {
    it('detects numeric cells', () => {
      expect(element._isNumericCell('5')).to.be.true
      expect(element._isNumericCell('5.5')).to.be.true
      expect(element._isNumericCell('$5')).to.be.true
      expect(element._isNumericCell('abc')).to.be.false
      expect(element._isNumericCell(null)).to.be.false
    })

    it('rejects empty strings', () => {
      expect(element._isNumericCell('')).to.be.false
    })

    it('detects negative cells', () => {
      expect(element._isNegative('-5')).to.be.true
      expect(element._isNegative('-$5')).to.be.true
      expect(element._isNegative('5')).to.be.false
      expect(element._isNegative('5-')).to.be.false
      expect(element._isNegative(null)).to.be.false
    })

    it('replaces blank cells with a dash', () => {
      expect(element._replaceBlankCell('')).to.equal('-')
      expect(element._replaceBlankCell('   ')).to.equal('-')
      expect(element._replaceBlankCell('x')).to.equal('x')
    })

    it('computes row header state', () => {
      expect(element._isRowHeader(true, 0)).to.be.true
      expect(element._isRowHeader(true, 1)).to.be.false
      expect(element._isRowHeader(false, 0)).to.be.false
    })

    it('detects numeric columns from tbody', () => {
      element.data = [
        ['Food', 'Count'],
        ['a', '1'],
        ['b', '2'],
      ]
      element.columnHeader = true
      element.footer = false
      expect(element._isNumericColumn(1)).to.be.true
      expect(element._isNumericColumn(0)).to.be.false
    })

    it('parses html strings into fragments', () => {
      const frag = element.getHTML('<b>hi</b>')
      expect(typeof frag.querySelector === 'function').to.be.true
      expect(frag.querySelector('b').textContent).to.equal('hi')
    })
  })

  describe('getTableCSV', () => {
    it('quotes text cells and blanks, emits numeric cells bare', () => {
      element.data = [
        ['Name', 'Count'],
        ['Food', '5'],
        ['Empty', ''],
        ['Total', '1,000'],
      ]
      // comma-containing cells are non-numeric by definition, so they
      // must stay quoted rather than being stripped into invalid CSV
      expect(element.getTableCSV()).to.equal(
        '"Name","Count"\n"Food",5\n"Empty","-"\n"Total","1,000"',
      )
    })

    it('escapes double quotes in text cells', () => {
      element.data = [['He said "hi"']]
      expect(element.getTableCSV()).to.equal('"He said ""hi"""')
    })
  })

  describe('getTableHTML / getTableHTMLNode', () => {
    beforeEach(() => {
      element.data = SAMPLE_DATA
      element.columnHeader = true
      element.rowHeader = true
      element.footer = true
      element.caption = 'My caption'
      element.bordered = true
      element.condensed = true
    })

    it('serializes caption, thead, tbody and tfoot', () => {
      const str = element.getTableHTML()
      expect(str.includes('<caption')).to.be.true
      expect(str.includes('My caption')).to.be.true
      expect(str.includes('<thead')).to.be.true
      expect(str.includes('<tbody')).to.be.true
      expect(str.includes('<tfoot')).to.be.true
      expect(str.includes('<th scope="row"')).to.be.true
      expect(str.includes('<th scope="col"')).to.be.true
      expect(str.includes('class="caption"')).to.be.false
    })

    it('omits caption when it is a literal null/undefined string', () => {
      element.caption = 'null'
      expect(element.getTableHTML().includes('<caption')).to.be.false
      element.caption = 'undefined'
      expect(element.getTableHTML().includes('<caption')).to.be.false
    })

    it('adds style classes when requested', () => {
      const str = element.getTableHTML(true)
      expect(str.includes('class="caption"')).to.be.true
      expect(str.includes('tbody-tr tr')).to.be.true
      expect(str.includes('th-or-td')).to.be.true
    })

    it('reflects display/data attributes on the table tag', () => {
      const str = element.getTableHTML()
      expect(str.includes('bordered')).to.be.true
      expect(str.includes('condensed')).to.be.true
    })

    it('returns a table node when asNode is set', async () => {
      const node = element.getTableHTML(true, true)
      expect(node.tagName).to.equal('TABLE')
      expect(node.querySelector('caption').textContent.includes('My caption'))
        .to.be.true
      expect(node.querySelectorAll('th[scope="row"]').length > 0).to.be.true
    })

    it('getTableHTMLNode builds an editable-table-display node', () => {
      const node = element.getTableHTMLNode()
      expect(node.tagName.toLowerCase()).to.equal('editable-table-display')
      expect(node.querySelector('table')).to.exist
      expect(node.bordered).to.equal(element.bordered)
      expect(node.caption).to.equal('My caption')
      expect(Array.isArray(node.data)).to.be.true
    })

    it('getTableProperties respects hide* flags', () => {
      element.hideBordered = true
      element.hideFilter = true
      const props = element.getTableProperties()
      expect(props.bordered).to.be.false
      expect(props.filter).to.be.false
      expect(props.condensed).to.equal(element.condensed)
    })
  })

  describe('download', () => {
    it('dispatches csv-downloaded with filename and data', () => {
      let detail = null
      element.addEventListener('csv-downloaded', (e) => {
        detail = e.detail
      })
      element.downloadable = true
      element.download()
      expect(detail).to.exist
      expect(detail.data).to.equal(element.getTableCSV())
      expect(detail.table === element).to.be.true
      // a non-empty caption is kept in the download filename (the ternary
      // used to drop the caption exactly when it was non-empty)
      expect(detail.filename).to.equal('IsitasandwichCSV')
    })

    it('falls back to the generic TableasCSV filename for an empty caption', () => {
      let detail = null
      element.addEventListener('csv-downloaded', (e) => {
        detail = e.detail
      })
      element.downloadable = true
      element.caption = ''
      element.download()
      expect(detail.filename).to.equal('TableasCSV')
    })
  })

  describe('copy', () => {
    const clipboard = globalThis.navigator.clipboard
    const hadClipboard = !!clipboard
    const originalWriteText = hadClipboard ? clipboard.writeText : undefined

    afterEach(() => {
      if (hadClipboard && originalWriteText) {
        delete clipboard.writeText
      }
    })

    it('copies via clipboard API when available', async () => {
      if (!hadClipboard) {
        // no clipboard API in this browser; skip the success-path stubbing
        return
      }
      clipboard.writeText = () => Promise.resolve()
      let detail = null
      element.addEventListener('csv-copied', (e) => {
        detail = e.detail
      })
      const copied = await element.copy()
      expect(copied).to.be.true
      expect(detail.copied).to.be.true
      expect(detail.data).to.equal(element.getTableCSV())
    })

    it('falls back to the textarea path when clipboard fails', async () => {
      if (!hadClipboard) {
        return
      }
      clipboard.writeText = () => Promise.reject(new Error('denied'))
      let detail = null
      element.addEventListener('csv-copied', (e) => {
        detail = e.detail
      })
      const copied = await element.copy()
      expect(typeof copied).to.equal('boolean')
      expect(detail).to.exist
      expect(detail.copied).to.equal(copied)
    })
  })

  describe('print', () => {
    // the <table> only exists in editable-table-display's shadow root, so
    // the full print-window path is driven through the display element
    it('writes the table into a print window and dispatches table-printed', async () => {
      const display = await fixture(
        html`<editable-table-display
          printable
          .data=${SAMPLE_DATA}
        ></editable-table-display>`,
      )
      await display.updateComplete
      const calls = []
      const fakeDoc = {
        head: { innerHTML: '' },
        body: { innerHTML: '' },
        close() {
          calls.push('close')
        },
      }
      const fakeWin = {
        document: fakeDoc,
        focus() {
          calls.push('focus')
        },
        print() {
          calls.push('print')
        },
        close() {},
        addEventListener() {},
      }
      const originalOpen = globalThis.open
      globalThis.open = () => fakeWin
      let printed = null
      display.addEventListener('table-printed', (e) => {
        printed = e.detail
      })
      display.print()
      globalThis.open = originalOpen
      expect(calls).to.deep.equal(['close', 'focus', 'print'])
      expect(fakeDoc.body.innerHTML.includes('<table')).to.be.true
      expect(fakeDoc.head.innerHTML.includes('<style>')).to.be.true
      expect(printed === display).to.be.true
    })

    it('still dispatches table-printed when the window cannot open', () => {
      const originalOpen = globalThis.open
      globalThis.open = () => null
      let fired = false
      element.addEventListener('table-printed', () => {
        fired = true
      })
      element.print()
      globalThis.open = originalOpen
      expect(fired).to.be.true
    })
  })

  describe('fetchData / csv loading', () => {
    const originalFetch = globalThis.fetch

    afterEach(() => {
      globalThis.fetch = originalFetch
    })

    it('loads csvData through fetch and converts it', async () => {
      let fetchedUrl = null
      globalThis.fetch = (url) => {
        fetchedUrl = url
        return Promise.resolve({
          text: () => Promise.resolve('H1,H2\na,b'),
        })
      }
      element.dataCsv = 'table.csv'
      await sleep(60)
      await element.updateComplete
      expect(fetchedUrl).to.equal('table.csv')
      expect(element.data).to.deep.equal([
        ['H1', 'H2'],
        ['a', 'b'],
      ])
      expect(element.columnHeader).to.be.true
      expect(element.dataCsv).to.be.null
    })

    it('falls back to the slotted table when fetch fails', async () => {
      globalThis.fetch = () => Promise.reject(new Error('404'))
      element.dataCsv = 'missing.csv'
      await sleep(60)
      await element.updateComplete
      // loadSlottedTable re-imported the slotted table from the catch path
      expect(element.data.length).to.equal(3)
      expect(element.data[0][0]).to.equal('Food')
    })
  })

  describe('importHTML', () => {
    it('expands colspan and rowspan into nbsp filler cells', () => {
      const host = globalThis.document.createElement('div')
      host.innerHTML =
        '<table><caption>Span table</caption>' +
        '<thead><tr><th scope="col">A</th><th scope="col" colspan="2">B</th></tr></thead>' +
        '<tbody>' +
        '<tr><th scope="row">R1</th><td>1</td><td rowspan="2">2</td></tr>' +
        '<tr><th scope="row">R2</th><td>3</td><td>4</td></tr>' +
        '</tbody></table>'
      element.importHTML(host.querySelector('table'))
      expect(element.data).to.deep.equal([
        ['A', 'B', '&nbsp;'],
        ['R1', '1', '2'],
        ['R2', '3', '&nbsp;', '4'],
      ])
      expect(element.columnHeader).to.be.true
      expect(element.rowHeader).to.be.true
      expect(element.footer).to.be.false
      expect(element.caption).to.equal('Span table')
    })

    it('reads display properties from table classes', () => {
      const host = globalThis.document.createElement('div')
      host.innerHTML =
        '<table class="bordered striped"><tr><td>x</td></tr></table>'
      element.bordered = false
      element.striped = false
      element.importHTML(host.querySelector('table'))
      expect(element.bordered).to.be.true
      expect(element.striped).to.be.true
    })
  })

  describe('loadSlottedTable', () => {
    it('unwraps an editable-table-display wrapper around the table', async () => {
      const el = await fixture(
        html`<editable-table>
          <editable-table-display>
            <table>
              <thead>
                <tr><th scope="col">W</th></tr>
              </thead>
              <tbody>
                <tr><td>1</td></tr>
              </tbody>
            </table>
          </editable-table-display>
        </editable-table>`,
      )
      await sleep(80)
      await el.updateComplete
      expect(el.data).to.deep.equal([['W'], ['1']])
      expect(el.columnHeader).to.be.true
    })
  })

  describe('focus', () => {
    it('focuses the first focusable control when present', async () => {
      const display = await fixture(
        html`<editable-table-display
          downloadable
          .data=${SAMPLE_DATA}
        ></editable-table-display>`,
      )
      await display.updateComplete
      expect(display.shadowRoot.querySelector('#download')).to.exist
      let focusSeen = false
      display.addEventListener('focusin', () => {
        focusSeen = true
      })
      display.focus()
      await sleep(20)
      // focus is async via setTimeout; the composed focusin event bubbles out
      expect(focusSeen).to.be.true
    })
  })
})

describe('editable-table rubric mode (OER schema)', () => {
  it('emits Rubric metadata when rubric-mode is set', async () => {
    const el = await fixture(
      html`<editable-table rubric-mode rubric-type="analytic">
        <table>
          <thead>
            <tr>
              <th scope="col">Criterion</th>
              <th scope="col">1 pt</th>
              <th scope="col">2 pts</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Quality</th>
              <td>1</td>
              <td>2</td>
              <td>good work</td>
            </tr>
          </tbody>
        </table>
      </editable-table>`,
    )
    await sleep(80)
    await el.updateComplete
    expect(el.hasAttribute('typeof')).to.be.true
    expect(el.getAttribute('typeof')).to.equal('oer:Rubric')
    const schema = el.shadowRoot.querySelector('.oer-rubric-schema')
    expect(schema).to.exist
    expect(schema.hasAttribute('hidden')).to.be.true
    const typeMeta = schema.querySelector('meta[property="oer:rubricType"]')
    expect(typeMeta.getAttribute('content')).to.equal('analytic')
    const scale = schema.querySelector('span[typeof="oer:RubricScale"]')
    expect(scale).to.exist
    // rowHeader auto-detected: 4 header cells minus the criterion column
    expect(
      scale.querySelectorAll('span[typeof="oer:RubricLevel"]').length,
    ).to.equal(3)
    const criteria = schema.querySelectorAll('span[typeof="oer:RubricCriterion"]')
    expect(criteria.length).to.equal(1)
    expect(criteria[0].querySelector('meta[property="oer:criterionWeight"]').getAttribute('content')).to.equal('1')
    // levelPoints only for numeric cells ("good work" gets none)
    expect(
      schema.querySelectorAll('meta[property="oer:levelPoints"]').length,
    ).to.equal(2)
    expect(
      schema.querySelectorAll('meta[property="oer:levelOrdinal"]').length,
    ).to.equal(6)

    // toggling rubricMode off removes the typeof attribute
    el.rubricMode = false
    await el.updateComplete
    expect(el.hasAttribute('typeof')).to.be.false
    expect(el.shadowRoot.querySelector('.oer-rubric-schema')).to.not.exist
  })

  it('omits rubricType meta and RubricScale when not applicable', async () => {
    const el = await fixture(html`<editable-table></editable-table>`)
    await sleep(60)
    await el.updateComplete
    el.data = [
      ['Label', 'Score'],
      ['plain', 'text'],
    ]
    el.columnHeader = false
    el.rowHeader = false
    el.footer = false
    el.rubricMode = true
    await el.updateComplete
    expect(el.hasAttribute('typeof')).to.be.true
    const schema = el.shadowRoot.querySelector('.oer-rubric-schema')
    expect(schema).to.exist
    expect(schema.querySelector('meta[property="oer:rubricType"]')).to.not
      .exist
    expect(schema.querySelector('span[typeof="oer:RubricScale"]')).to.not
      .exist
    expect(schema.querySelectorAll('span[typeof="oer:RubricCriterion"]')
      .length).to.equal(2)
    // no numeric level cells -> no levelPoints metas at all
    expect(
      schema.querySelectorAll('meta[property="oer:levelPoints"]').length,
    ).to.equal(0)
  })
})

describe('editable-table HAX hooks', () => {
  let element

  beforeEach(async () => {
    element = await fixture(
      html`<editable-table>
        <table>
          <thead>
            <tr><th scope="col">A</th></tr>
          </thead>
          <tbody>
            <tr><td>1</td></tr>
          </tbody>
        </table>
      </editable-table>`,
    )
    await sleep(80)
    await element.updateComplete
  })

  it('haxpreProcessNodeToContent replaces light DOM with generated table', async () => {
    element.editMode = true
    await element.updateComplete
    const node = await element.haxpreProcessNodeToContent(element)
    expect(node === element).to.be.true
    expect(element.editMode).to.be.false
    expect(element.config).to.be.null
    const table = element.querySelector('table')
    expect(table).to.exist
    expect(table.querySelector('thead')).to.exist
    expect(table.querySelector('tbody')).to.exist
  })

  it('haxactiveElementChanged re-syncs light DOM on deactivate', async () => {
    const result = await element.haxactiveElementChanged(element, false)
    expect(result === element).to.be.true
    expect(element.querySelector('table')).to.exist
  })

  it('sync copies known properties from the editor and rejects arbitrary ones', async () => {
    const editor = element.editor
    editor.caption = 'Synced via editor'
    element.sync('caption')
    expect(element.caption).to.equal('Synced via editor')
    editor.testSyncProp = 'nope'
    element.sync('testSyncProp')
    expect(element.testSyncProp).to.equal(undefined)
  })

  it('handles cell-changed events with a HaxStore stub', async () => {
    const ignoreCalls = []
    globalThis.HaxStore = {
      instance: {
        activeBodyIgnoreActive: (v) => ignoreCalls.push(v),
      },
    }
    try {
      await element._handleCellChanged(new CustomEvent('cell-changed'))
      expect(ignoreCalls).to.deep.equal([true, false])
      const table = element.querySelector('table')
      expect(table).to.exist
      expect(table.querySelector('thead')).to.exist
    } finally {
      delete globalThis.HaxStore
    }
  })
})

describe('editable-table-display', () => {
  it('renders download/copy/print buttons when enabled', async () => {
    const display = await fixture(
      html`<editable-table-display
        downloadable
        copyable
        printable
        .data=${SAMPLE_DATA}
      ></editable-table-display>`,
    )
    await display.updateComplete
    expect(display.shadowRoot.querySelector('#download')).to.exist
    expect(display.shadowRoot.querySelector('#copy')).to.exist
    expect(display.shadowRoot.querySelector('#print')).to.exist
    expect(display.shadowRoot.querySelector('table')).to.exist
  })

  it('does not render the buttons when disabled features', async () => {
    const display = await fixture(
      html`<editable-table-display .data=${SAMPLE_DATA}></editable-table-display>`,
    )
    await display.updateComplete
    expect(display.shadowRoot.querySelector('#download')).to.not.exist
    expect(display.shadowRoot.querySelector('#copy')).to.not.exist
    expect(display.shadowRoot.querySelector('#print')).to.not.exist
  })

  it('imports a slotted table when its light DOM mutates', async () => {
    const display = await fixture(
      html`<editable-table-display>
        <table>
          <thead>
            <tr><th>H</th></tr>
          </thead>
          <tbody>
            <tr><td>v1</td></tr>
          </tbody>
        </table>
      </editable-table-display>`,
    )
    await sleep(80)
    await display.updateComplete
    // the connectedCallback timeout already imported the slotted table
    expect(display.data).to.deep.equal([['H'], ['v1']])
    const td = display.querySelector('td')
    td.textContent = 'v2'
    await sleep(80)
    await display.updateComplete
    // the MutationObserver re-imported the mutated table
    expect(display.data).to.deep.equal([['H'], ['v2']])
    expect(display.columnHeader).to.be.true
  })

  it('re-imports the slotted table when data is reset to empty', async () => {
    const display = await fixture(
      html`<editable-table-display>
        <table>
          <thead>
            <tr><th>H</th></tr>
          </thead>
          <tbody>
            <tr><td>v1</td></tr>
          </tbody>
        </table>
      </editable-table-display>`,
    )
    await display.updateComplete
    let changeDetail = null
    display.addEventListener('change', (e) => {
      changeDetail = e.detail
    })
    display.data = []
    await display.updateComplete
    expect(display.data).to.deep.equal([['H'], ['v1']])
    expect(Array.isArray(changeDetail)).to.be.true
  })

    it('derives disabled only from real data transitions (issue #3077 regression)', async () => {
      const display = await fixture(
        html`<editable-table-display .data=${SAMPLE_DATA}></editable-table-display>`,
      )
      await display.updateComplete
      expect(display.disabled).to.be.false
      // a real transition to empty data disables the table
      display.data = []
      await display.updateComplete
      expect(display.disabled).to.be.true
      // real data re-enables it
      display.data = SAMPLE_DATA
      await display.updateComplete
      expect(display.disabled).to.be.false
    })

    it('does not self-disable from the initial empty-data placeholder (issue #3077 regression)', async () => {
      const el = await fixture(html`<editable-table></editable-table>`)
      await sleep(80)
      await el.updateComplete
      // The constructor's empty data placeholder must not disable the
      // display before first paint: doing so flipped the host through
      // display:none and back when real data landed, feeding a resize
      // cycle into responsive-utility's ResizeObserver that aborted test
      // runs with a window ResizeObserver loop error.
      expect(el.display.disabled).to.be.false
      expect(el.display.hasAttribute('disabled')).to.be.false
    })

    it('toggleFilter sets, resets and switches filter state', async () => {
      const display = await fixture(
        html`<editable-table-display .data=${SAMPLE_DATA}></editable-table-display>`,
      )
      await display.updateComplete
      // no-arg call resets
      display.filterColumn = 1
    display.filtered = true
    display.toggleFilter()
    expect(display.filtered).to.be.false
    expect(display.filterText).to.be.undefined
    expect(display.filterColumn).to.be.undefined
    // event-shaped call sets state
    display.toggleFilter({ detail: { columnIndex: 1, text: 'two buns' } })
    expect(display.filtered).to.be.true
    expect(display.filterText).to.equal('two buns')
    expect(display.filterColumn).to.equal(1)
    // same column again resets
    display.toggleFilter({ detail: { columnIndex: 1, text: 'two buns' } })
    expect(display.filtered).to.be.false
    // a different column sets again
    display.toggleFilter({ detail: { columnIndex: 2, text: 'one bun' } })
    expect(display.filtered).to.be.true
    expect(display.filterColumn).to.equal(2)
    // the bound toggle-filter listener routes into toggleFilter
    display.dispatchEvent(
      new CustomEvent('toggle-filter', {
        detail: { columnIndex: 0, text: 'Hamburger' },
        bubbles: true,
        composed: true,
      }),
    )
    expect(display.filterColumn).to.equal(0)
    expect(display.filterText).to.equal('Hamburger')
  })

  it('_isRowFiltered respects contains and case sensitivity', async () => {
    const display = await fixture(
      html`<editable-table-display .data=${SAMPLE_DATA}></editable-table-display>`,
    )
    await display.updateComplete
    display.filterColumn = 1
    display.filterText = 'TWO'
    display.filterContains = true
    display.filterCaseSensitive = false
    expect(display._isRowFiltered(['Hamburger', 'two buns', '5'])).to.be.false
    display.filterCaseSensitive = true
    expect(display._isRowFiltered(['Hamburger', 'two buns', '5'])).to.be.true
    display.filterContains = false
    display.filterCaseSensitive = false
    display.filterText = 'two buns'
    expect(display._isRowFiltered(['Hamburger', 'two buns', '5'])).to.be.false
    expect(display._isRowFiltered(['Hamburger', 'one bun', '2'])).to.be.true
  })

  it('renders filtered cell buttons as toggled for the active filter', async () => {
    const display = await fixture(
      html`<editable-table-display
        filter
        .data=${SAMPLE_DATA}
      ></editable-table-display>`,
    )
    await display.updateComplete
    display.columnHeader = true
    display.footer = false
    display.toggleFilter({ detail: { columnIndex: 1, text: 'two buns' } })
    await display.updateComplete
    const toggled = display.shadowRoot.querySelectorAll(
      'editable-table-filter[toggled]',
    )
    expect(toggled.length > 0).to.be.true
  })

  it('_changeSortMode cycles asc, desc, none and tracks columns', async () => {
    const display = await fixture(
      html`<editable-table-display .data=${SAMPLE_DATA}></editable-table-display>`,
    )
    await display.updateComplete
    display._changeSortMode({ detail: { columnIndex: 0 } })
    expect(display.sortMode).to.equal('asc')
    expect(display.sortColumn).to.equal(0)
    display._changeSortMode({ detail: { columnIndex: 0 } })
    expect(display.sortMode).to.equal('desc')
    display._changeSortMode({ detail: { columnIndex: 0 } })
    expect(display.sortMode).to.equal('none')
    display._changeSortMode({ detail: { columnIndex: 2 } })
    expect(display.sortMode).to.equal('asc')
    expect(display.sortColumn).to.equal(2)
    // the bound change-sort-mode listener routes into _changeSortMode
    display.dispatchEvent(
      new CustomEvent('change-sort-mode', {
        detail: { columnIndex: 1 },
        bubbles: true,
        composed: true,
      }),
    )
    expect(display.sortMode).to.equal('asc')
    expect(display.sortColumn).to.equal(1)
  })

  it('options getter maps thead labels', async () => {
    const display = await fixture(
      html`<editable-table-display .data=${SAMPLE_DATA}></editable-table-display>`,
    )
    await display.updateComplete
    display.columnHeader = true
    const options = display.options
    expect(options.length).to.equal(3)
    expect(options[0][0].alt).to.equal('Food')
    expect(options[2][0].value).to.equal(2)
  })

  it('column helpers and selection handlers', async () => {
    const display = await fixture(
      html`<editable-table-display .data=${SAMPLE_DATA}></editable-table-display>`,
    )
    await display.updateComplete
    expect(display._isColHidden(0, 1)).to.be.false
    expect(display._isColHidden(1, 1)).to.be.false
    expect(display._isColHidden(2, 1)).to.be.true
    expect(display._isColHidden(2, 0)).to.be.true
    expect(display._isCellFiltered(1, 1, true)).to.be.true
    expect(display._isCellFiltered(1, 1, false)).to.be.false
    expect(display._isCellFiltered(2, 1, true)).to.be.false
    expect(display._isCellFiltered(1, 0, true)).to.be.false
    display.selected = 3
    display._tableChanged()
    expect(display.selected).to.equal(1)
    display._selectedChanged({ detail: { value: 2 } })
    expect(display.selected).to.equal(2)
    display._selectedChanged({ detail: { value: 0 } })
    expect(display.selected).to.equal(2)
  })

  it('_updateCols reads the rendered column picker and flags hidden cells', async () => {
    const display = await fixture(
      html`<editable-table-display .data=${SAMPLE_DATA}></editable-table-display>`,
    )
    await display.updateComplete
    // reads the class="column" picker rendered inside #table; must not
    // throw now that the old #column id no longer exists
    let threw = false
    try {
      display._updateCols()
    } catch (e) {
      threw = true
    }
    expect(threw).to.be.false
    const table = display.shadowRoot.querySelector('#table')
    // selected column is 1: only column 2 cells are flagged xs-hidden
    expect(table.querySelector('[cell-index="2"][xs-hidden]')).to.exist
    expect(table.querySelector('[cell-index="1"][xs-hidden]')).to.not.exist
    expect(table.querySelector('[cell-index="0"][xs-hidden]')).to.not.exist
  })
})

describe('editable-table-edit', () => {
  let element

  beforeEach(async () => {
    element = await fixture(
      html`<editable-table>
        <table>
          <thead>
            <tr><th scope="col">H1</th><th scope="col">H2</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row">a</th><td>1</td></tr>
            <tr><th scope="row">b</th><td>2</td></tr>
          </tbody>
        </table>
      </editable-table>`,
    )
    await sleep(80)
    await element.updateComplete
    element.editMode = true
    await element.updateComplete
  })

  it('renders caption indicator icons for enabled data features', async () => {
    const editor = element.editor
    editor.downloadable = true
    editor.printable = true
    editor.copyable = true
    await editor.updateComplete
    expect(editor.shadowRoot.querySelector('.downloadable-icon')).to.exist
    expect(editor.shadowRoot.querySelector('.copyable-icon')).to.exist
    // the printable icon applies the correctly spelled class (it used to
    // be misspelled as calss so .printable-icon never matched)
    const printableIcon = editor.shadowRoot.querySelector(
      'simple-icon-lite.printable-icon',
    )
    expect(printableIcon).to.exist
    expect(printableIcon.hasAttribute('calss')).to.be.false
  })

  it('hides display and data groups via hide* flags', async () => {
    const editor = element.editor
    editor.hideBordered = true
    editor.hideCondensed = true
    editor.hideStriped = true
    editor.hideNumericStyles = true
    editor.hideResponsive = true
    editor.hideSort = true
    editor.hideFilter = true
    await editor.updateComplete
    expect(editor.hideDisplay).to.be.true
    expect(editor.hideSortFilter).to.be.true
    const groups = editor.shadowRoot.querySelectorAll(
      'div.group[part="simple-toolbar-section"]',
    )
    expect(groups.length).to.equal(3)
    const byLabel = {}
    groups.forEach((g) => {
      const label = g.querySelector('.label')
      byLabel[label.textContent.trim()] = g
    })
    expect(byLabel['Headers and footers'].hasAttribute('hidden')).to.be
      .false
    expect(byLabel['Display'].hasAttribute('hidden')).to.be.true
    expect(byLabel['Data'].hasAttribute('hidden')).to.be.true
  })

  it('dispatches editing-disabled when disabled', async () => {
    const editor = element.editor
    let detail = null
    editor.addEventListener('editing-disabled', (e) => {
      detail = e.detail
    })
    editor.disabled = true
    await editor.updateComplete
    expect(detail).to.exist
    expect(detail.editor === editor).to.be.true
  })

  it('labels columns with letters including double letters', () => {
    const editor = element.editor
    expect(editor._getLabel(0)).to.equal('A')
    expect(editor._getLabel(1)).to.equal('B')
    expect(editor._getLabel(25)).to.equal('Z')
    expect(editor._getLabel(26)).to.equal('AA')
    expect(editor._getLabel(27)).to.equal('AB')
    expect(editor._getLabel(701)).to.equal('ZZ')
  })

  it('_isSortDisabled requires column headers', () => {
    const editor = element.editor
    expect(editor._isSortDisabled(true, true)).to.be.true
    expect(editor._isSortDisabled(false, false)).to.be.true
    expect(editor._isSortDisabled(false, true)).to.be.false
  })

  it('deletes, inserts and changes rows, columns and cells', async () => {
    const editor = element.editor
    const events = []
    const names = [
      'row-deleted',
      'column-deleted',
      'row-inserted',
      'column-inserted',
      'cell-changed',
    ]
    names.forEach((name) =>
      editor.addEventListener(name, (e) => events.push([name, e.detail])),
    )
    editor.deleteRow(1)
    expect(editor.data).to.deep.equal([
      ['H1', 'H2'],
      ['b', '2'],
    ])
    editor.deleteColumn(1)
    expect(editor.data).to.deep.equal([['H1'], ['b']])
    editor.insertRow(0)
    expect(editor.data).to.deep.equal([['H1'], [' '], ['b']])
    editor.insertColumn(0)
    expect(editor.data).to.deep.equal([
      [' ', 'H1'],
      [' ', ' '],
      [' ', 'b'],
    ])
    editor.changeCell(0, 1, 'X')
    expect(editor.data[0][1]).to.equal('X')
    const fired = events.map((e) => e[0])
    expect(fired).to.deep.equal([
      'row-deleted',
      'column-deleted',
      'row-inserted',
      'column-inserted',
      'cell-changed',
    ])
    expect(events[0][1].rowNum).to.equal(1)
    expect(events[1][1].colNum).to.equal(1)
    expect(events[4][1].rowNum).to.equal(0)
    expect(events[4][1].colNum).to.equal(1)
    expect(events[4][1].data === editor.data).to.be.true
  })

  it('routes rowcol menu actions through _handleRowColumnMenu', async () => {
    const editor = element.editor
    const events = []
    const names = ['row-inserted', 'column-inserted', 'row-deleted', 'column-deleted']
    names.forEach((name) =>
      editor.addEventListener(name, (e) => events.push(name)),
    )
    editor.data = [
      ['H1', 'H2'],
      ['a', '1'],
    ]
    editor._handleRowColumnMenu({ detail: { insert: true, row: true, index: 0 } })
    editor._handleRowColumnMenu({ detail: { insert: true, row: false, index: 0 } })
    editor._handleRowColumnMenu({ detail: { insert: false, row: true, index: 2 } })
    editor._handleRowColumnMenu({ detail: { insert: false, row: false, index: 1 } })
    expect(events).to.deep.equal(names)
  })

  it('_handleMenuToggle marks ancestor sections as expanded', async () => {
    const editor = element.editor
    const thead = globalThis.document.createElement('thead')
    const tr = globalThis.document.createElement('tr')
    const th = globalThis.document.createElement('th')
    const btn = globalThis.document.createElement('button')
    th.appendChild(btn)
    tr.appendChild(th)
    thead.appendChild(tr)
    globalThis.document.body.appendChild(thead)
    try {
      btn.expanded = true
      editor._handleMenuToggle({ detail: btn })
      expect(thead.getAttribute('data-expanded')).to.equal('true')
      expect(tr.getAttribute('data-expanded')).to.equal('true')
      expect(th.getAttribute('data-expanded')).to.equal('true')
      btn.expanded = false
      editor._handleMenuToggle({ detail: btn })
      expect(thead.getAttribute('data-expanded')).to.equal('false')
      // falsy detail returns early without throwing
      editor._handleMenuToggle({ detail: null })
    } finally {
      globalThis.document.body.removeChild(thead)
    }
  })

  it('reads cell values from the rendered editor on change', async () => {
    const editor = element.editor
    let detail = null
    editor.addEventListener('cell-changed', (e) => {
      detail = e.detail
    })
    const cell = editor.shadowRoot.querySelector('#cell-0-0')
    expect(cell).to.exist
    cell.innerHTML = '<b>hi</b>'
    editor._onCellValueChange({}, 0, 0)
    expect(editor.data[0][0]).to.equal('<b>hi</b>')
    expect(detail.rowNum).to.equal(0)
    expect(detail.colNum).to.equal(0)
  })

  it('ignores out-of-range cell changes instead of throwing', async () => {
    const editor = element.editor
    const before = editor.data
    let threw = false
    try {
      // the cell editor does not exist (out-of-range row/col); the
      // undefined value flows into changeCell, which bounds-checks
      // and leaves the data untouched
      editor._onCellValueChange({}, 9, 9)
      editor.changeCell(99, 99, 'nope')
      editor.changeCell(-1, 0, 'nope')
      editor.changeCell(0, 99, 'nope')
    } catch (e) {
      threw = true
    }
    expect(threw).to.be.false
    expect(editor.data === before).to.be.true
  })

  it('updates the caption from the rendered caption editor', async () => {
    const editor = element.editor
    let detail = null
    editor.addEventListener('caption-changed', (e) => {
      detail = e.detail
    })
    const captionEditor = editor.shadowRoot.querySelector('#caption')
    expect(captionEditor).to.exist
    captionEditor.innerHTML = 'New caption'
    editor._captionChanged()
    expect(editor.caption).to.equal('New caption')
    expect(detail.caption).to.equal('New caption')
    expect(detail.editor === editor).to.be.true
  })

  it('applies toolbar setting toggles', async () => {
    const editor = element.editor
    const changes = []
    editor.addEventListener('change', (e) => changes.push(e.detail))
    editor._onTableSettingChange({ detail: { id: 'bordered', toggled: true } })
    expect(editor.bordered).to.be.true
    editor._onTableSettingChange({ detail: { id: 'bordered', toggled: false } })
    expect(editor.bordered).to.be.false
    expect(changes).to.deep.equal(['bordered', 'bordered'])
  })

  it('_dataChanged guarantees a minimal 2x2 table', async () => {
    const editor = element.editor
    editor._dataChanged([])
    expect(editor.data).to.deep.equal([
      ['', ''],
      ['', ''],
    ])
    editor._dataChanged([[]])
    expect(editor.data).to.deep.equal([
      ['', ''],
      ['', ''],
    ])
  })

  it('row helpers', () => {
    const editor = element.editor
    const data = [
      ['a', 'b'],
      ['c', 'd'],
    ]
    expect(editor._getCurrentRow(0, data) === data[0]).to.be.true
    expect(editor._getCurrentRow(5, data)).to.be.null
    expect(editor._getCurrentRow(0, null)).to.be.null
    expect(editor._getCurrentRow(0, undefined)).to.be.null
    expect(editor._isFirstRow(0)).to.be.true
    expect(editor._isFirstRow(1)).to.be.false
  })

  it('_onCellClick focuses the first nodeList control', async () => {
    const editor = element.editor
    const focusable = globalThis.document.createElement('button')
    globalThis.document.body.appendChild(focusable)
    try {
      editor._onCellClick({ model: { root: { nodeList: [focusable] } } })
      await sleep(20)
      expect(globalThis.document.activeElement === focusable).to.be.true
      // malformed event does not throw
      editor._onCellClick({})
    } finally {
      globalThis.document.body.removeChild(focusable)
    }
  })
})

describe('editable-table-editor-rowcol', () => {
  it('labels and controls rows vs columns', async () => {
    const rowcol = await fixture(
      html`<editable-table-editor-rowcol index="2"></editable-table-editor-rowcol>`,
    )
    await rowcol.updateComplete
    expect(rowcol.type).to.equal('Column')
    expect(rowcol.controls).to.equal('cell-2-0')
    expect(rowcol.label).to.equal('C')
    expect(rowcol.position).to.equal('bottom')
    rowcol.row = true
    await rowcol.updateComplete
    expect(rowcol.type).to.equal('Row')
    // toggling row recomputes controls to the row's first-column cell
    // (it used to keep the stale column-oriented controls id)
    expect(rowcol.controls).to.equal('cell-0-2')
    expect(rowcol.label).to.equal(3)
    expect(rowcol.position).to.equal('right')
  })

  it('fires rowcol-action with insert/delete details', async () => {
    const rowcol = await fixture(
      html`<editable-table-editor-rowcol index="2"></editable-table-editor-rowcol>`,
    )
    await rowcol.updateComplete
    // the `row` property defaults to undefined, so pin it before asserting
    rowcol.row = false
    await rowcol.updateComplete
    const details = []
    rowcol.addEventListener('rowcol-action', (e) => details.push(e.detail))
    rowcol.rowColAction()
    expect(details.length).to.equal(1)
    expect(details[0].insert).to.be.true
    expect(details[0].row).to.be.false
    expect(details[0].index).to.equal(2)
    rowcol._onDelete({})
    expect(details[1].insert).to.be.false
    rowcol._onInsertBefore({})
    expect(details[2].index).to.equal(2)
    rowcol.row = true
    await rowcol.updateComplete
    rowcol._onInsertBefore({})
    expect(details[3].index).to.equal(1)
    rowcol._onInsertAfter({})
    expect(details[4].index).to.equal(2)
    rowcol.row = false
    await rowcol.updateComplete
    rowcol._onInsertAfter({})
    expect(details[5].index).to.equal(3)
  })
})

describe('editable-table-filter', () => {
  it('fires toggle-filter on click and updates its tooltip', async () => {
    const filter = await fixture(
      html`<editable-table-filter
        column-index="2"
        text="abc"
      ></editable-table-filter>`,
    )
    await filter.updateComplete
    expect(filter.tooltip).to.equal('Toggle Column 2 filter.')
    let detail = null
    let event = null
    filter.addEventListener('toggle-filter', (e) => {
      detail = e.detail
      event = e
    })
    filter._handleClick()
    expect(detail === filter).to.be.true
    expect(event.bubbles).to.be.true
    expect(event.composed).to.be.true
    expect(event.cancelable).to.be.true
  })
})

describe('editable-table-sort', () => {
  it('derives toggled state and icon from sort settings', async () => {
    const sort = await fixture(
      html`<editable-table-sort column-index="1"></editable-table-sort>`,
    )
    await sort.updateComplete
    expect(sort.toggled).to.be.false
    expect(sort.icon).to.equal('editable-table:sortable')
    sort.sortColumn = 1
    await sort.updateComplete
    expect(sort.toggled).to.be.true
    sort.sortMode = 'asc'
    await sort.updateComplete
    expect(sort.icon).to.equal('arrow-drop-up')
    sort.sortMode = 'desc'
    await sort.updateComplete
    expect(sort.icon).to.equal('arrow-drop-down')
    expect(sort.hasAttribute('sort-mode')).to.be.true
    expect(sort.getAttribute('sort-mode')).to.equal('desc')
  })

  it('fires change-sort-mode on click', async () => {
    const sort = await fixture(
      html`<editable-table-sort column-index="0"></editable-table-sort>`,
    )
    await sort.updateComplete
    let detail = null
    let event = null
    sort.addEventListener('change-sort-mode', (e) => {
      detail = e.detail
      event = e
    })
    sort._handleClick()
    expect(detail === sort).to.be.true
    expect(event.bubbles).to.be.true
    expect(event.composed).to.be.true
    expect(event.cancelable).to.be.true
  })
})
