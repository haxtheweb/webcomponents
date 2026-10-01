import { expect } from '@open-wc/testing'
import { ESGlobalBridgeStore } from '@haxtheweb/es-global-bridge/es-global-bridge.js'

// The vendored SheetJS build (lib/xlsx/dist/xlsx.full.min.js) is injected by
// ESGlobalBridgeStore in the constructor. Stub the bridge for this session so
// the vendored script never executes; all wrapper logic runs against a fake
// globalThis.XLSX instead.
let originalLoad
let xlsxLib

before(async () => {
  originalLoad = ESGlobalBridgeStore.load
  ESGlobalBridgeStore.load = () => Promise.resolve(true)
  xlsxLib = await import('../lib/xlsx-file-system-broker.js')
})

after(() => {
  if (originalLoad) {
    ESGlobalBridgeStore.load = originalLoad
  }
})

describe('XLSXFileSystemBroker', () => {
  let element

  const makeFakeXLSX = (calls) => ({
    utils: {
      book_new: () => {
        calls.bookNew += 1
        return 'WORKBOOK'
      },
      json_to_sheet: (data, opts) => {
        calls.jsonToSheet.push([data, opts])
        return 'SHEET'
      },
      book_append_sheet: (workbook, sheet, name) => {
        calls.appendSheet.push([workbook, sheet, name])
      },
      sheet_to_json: (sheet, opts) => {
        calls.sheetToJson.push([sheet, opts])
        return sheet.rows
      },
      sheet_to_csv: (sheet) => {
        calls.sheetToCsv.push(sheet)
        return sheet.csv
      },
      get_formulae: (sheet) => {
        calls.getFormulae.push(sheet)
        return sheet.formulae
      },
    },
    write: (workbook, opts) => {
      calls.write.push([workbook, opts])
      return calls.writeReturn
    },
  })

  const makeCalls = (writeReturn) => ({
    bookNew: 0,
    jsonToSheet: [],
    appendSheet: [],
    sheetToJson: [],
    sheetToCsv: [],
    getFormulae: [],
    write: [],
    writeReturn: writeReturn,
  })

  const makeWorkbook = () => ({
    SheetNames: ['alpha', 'empty'],
    Sheets: {
      alpha: { rows: [['h'], ['r']], csv: 'a,b', formulae: ['=A1'] },
      empty: { rows: [], csv: '', formulae: [] },
    },
  })

  beforeEach(() => {
    element = document.createElement('xlsx-file-system-broker')
    document.body.appendChild(element)
  })

  afterEach(() => {
    if (element.parentNode) {
      element.remove()
    }
  })

  it('registers the custom element and exposes the singleton', () => {
    expect(xlsxLib.XLSXFileSystemBroker.tag).to.equal('xlsx-file-system-broker')
    expect(globalThis.customElements.get('xlsx-file-system-broker')).to.exist
    expect(
      xlsxLib.XLSXFileSystemBrokerSingleton instanceof
        xlsxLib.XLSXFileSystemBroker,
    ).to.be.true
    expect(
      globalThis.XLSXFileSystemBroker.requestAvailability() ===
        xlsxLib.XLSXFileSystemBrokerSingleton,
    ).to.be.true
    expect(
      xlsxLib.XLSXFileSystemBrokerSingleton.parentNode === document.body,
    ).to.be.true
  })

  describe('constructor wiring', () => {
    it('fires xlsx-ready with the global XLSX once the bridge resolves', async () => {
      const fakeXLSX = { marker: 'fake-xlsx' }
      const saved = globalThis.XLSX
      globalThis.XLSX = fakeXLSX
      let detail = null
      const el = document.createElement('xlsx-file-system-broker')
      el.addEventListener('xlsx-ready', (e) => {
        detail = e.detail
      })
      document.body.appendChild(el)
      try {
        await new Promise((resolve) => setTimeout(resolve, 10))
        expect(el.XLSX === fakeXLSX).to.be.true
        expect(detail === el).to.be.true
      } finally {
        el.remove()
        if (saved === undefined) {
          delete globalThis.XLSX
        } else {
          globalThis.XLSX = saved
        }
      }
    })

    it('stays quiet when globalThis.XLSX never loads', async () => {
      const saved = globalThis.XLSX
      delete globalThis.XLSX
      let fired = false
      const el = document.createElement('xlsx-file-system-broker')
      el.addEventListener('xlsx-ready', () => {
        fired = true
      })
      document.body.appendChild(el)
      try {
        await new Promise((resolve) => setTimeout(resolve, 10))
        expect(fired).to.be.false
        expect(el.XLSX).to.be.null
      } finally {
        el.remove()
        if (saved !== undefined) {
          globalThis.XLSX = saved
        }
      }
    })

    it('targets the vendored worker and dist paths', () => {
      expect(element.XW.msg).to.equal('xlsx')
      expect(element.XW.worker.endsWith('xlsxworker.js')).to.be.true
      expect(element.XW.worker.includes('xlsx/')).to.be.true
      expect(element.libPath.endsWith('xlsx/')).to.be.true
      expect(element.libPath.includes('file-system-broker')).to.be.true
    })
  })

  describe('workbookFromJSON', () => {
    it('builds a workbook from a data dictionary', () => {
      const calls = makeCalls('XLSX-OUTPUT')
      element.XLSX = makeFakeXLSX(calls)
      const data = { sheetA: [['a', '1']], sheetB: [['b', '2']] }
      const output = element.workbookFromJSON(data)
      expect(output).to.equal('XLSX-OUTPUT')
      expect(calls.bookNew).to.equal(1)
      expect(calls.jsonToSheet[0][0]).to.deep.equal([['a', '1']])
      expect(calls.jsonToSheet[0][1]).to.deep.equal({ skipHeader: true })
      expect(calls.jsonToSheet[1][0]).to.deep.equal([['b', '2']])
      expect(calls.appendSheet).to.deep.equal([
        ['WORKBOOK', 'SHEET', 'sheetA'],
        ['WORKBOOK', 'SHEET', 'sheetB'],
      ])
      expect(calls.write.length).to.equal(1)
      expect(calls.write[0][0]).to.equal('WORKBOOK')
      expect(calls.write[0][1]).to.deep.equal({
        bookType: 'xlsx',
        bookSST: false,
        type: 'array',
      })
    })
  })

  describe('__toJSON', () => {
    it('collects sheet rows and drops empty sheets', () => {
      const calls = makeCalls()
      element.XLSX = makeFakeXLSX(calls)
      const result = element.__toJSON(makeWorkbook(), false)
      expect(Object.keys(result)).to.deep.equal(['alpha'])
      expect(result.alpha).to.deep.equal([['h'], ['r']])
      expect(calls.sheetToJson.length).to.equal(2)
      expect(calls.sheetToJson[0][1]).to.deep.equal({
        header: 1,
        blankrows: false,
        raw: false,
        dateNF: 'yyyy-mm-dd',
      })
    })

    it('stringifies on request', () => {
      element.XLSX = makeFakeXLSX(makeCalls())
      const result = element.__toJSON(makeWorkbook(), true)
      expect(result).to.equal(JSON.stringify({ alpha: [['h'], ['r']] }, null, 2))
    })
  })

  describe('__toCSV', () => {
    it('joins per sheet csv with sheet headers, skipping empties', () => {
      const calls = makeCalls()
      element.XLSX = makeFakeXLSX(calls)
      expect(element.__toCSV(makeWorkbook())).to.equal('SHEET: alpha\n\na,b')
      expect(calls.sheetToCsv.length).to.equal(2)
    })
  })

  describe('__toFMLA', () => {
    it('joins formulae per sheet, skipping empties', () => {
      const calls = makeCalls()
      element.XLSX = makeFakeXLSX(calls)
      expect(element.__toFMLA(makeWorkbook())).to.equal('SHEET: alpha\n\n=A1')
      expect(calls.getFormulae.length).to.equal(2)
    })
  })

  describe('__toHTML', () => {
    it('writes every sheet as html and concatenates', () => {
      const calls = makeCalls('TABLE')
      element.XLSX = makeFakeXLSX(calls)
      const workbook = makeWorkbook()
      const output = element.__toHTML(workbook)
      expect(output).to.equal('TABLETABLE')
      expect(calls.write.length).to.equal(2)
      expect(calls.write[0][0] === workbook).to.be.true
      expect(calls.write[0][1]).to.deep.equal({
        sheet: 'alpha',
        type: 'string',
        bookType: 'html',
      })
      expect(calls.write[1][1]).to.deep.equal({
        sheet: 'empty',
        type: 'string',
        bookType: 'html',
      })
    })
  })

  describe('__toXLSX', () => {
    it('delegates to XLSX.write without options', () => {
      const calls = makeCalls('BINARY')
      element.XLSX = makeFakeXLSX(calls)
      const workbook = makeWorkbook()
      expect(element.__toXLSX(workbook, 'file.xlsx')).to.equal('BINARY')
      expect(calls.write.length).to.equal(1)
      expect(calls.write[0][0] === workbook).to.be.true
      expect(calls.write[0][1]).to.be.undefined
    })
  })

  describe('processWorker', () => {
    it('routes each format to the right converter', () => {
      const workbook = makeWorkbook()
      const calls = makeCalls('W')
      element.XLSX = makeFakeXLSX(calls)
      expect(element.processWorker(workbook, 'form')).to.equal(
        'SHEET: alpha\n\n=A1',
      )
      expect(element.processWorker(workbook, 'html')).to.equal('WW')
      expect(element.processWorker(workbook, 'jsonstringify')).to.equal(
        JSON.stringify({ alpha: [['h'], ['r']] }, null, 2),
      )
      expect(element.processWorker(workbook, 'json')).to.deep.equal({
        alpha: [['h'], ['r']],
      })
      expect(element.processWorker(workbook, 'xlsx', 'file.xlsx')).to.equal('W')
      expect(calls.write.length).to.equal(3)
      expect(calls.write[2][1]).to.be.undefined
    })

    it('defaults unknown formats to csv', () => {
      element.XLSX = makeFakeXLSX(makeCalls())
      expect(element.processWorker(makeWorkbook(), 'made-up')).to.equal(
        'SHEET: alpha\n\na,b',
      )
      expect(element.processWorker(makeWorkbook(), 'csv')).to.equal(
        'SHEET: alpha\n\na,b',
      )
    })
  })

  describe('processFile', () => {
    it('reads the file as a binary string and hands it to the worker bridge', async () => {
      const captured = []
      element.__executeWorker = (data, format, operation, filename) => {
        captured.push([data, format, operation, filename])
      }
      const file = new File(['abc123'], 'sheet.xlsx')
      element.processFile(file, 'json', 'sheet.xlsx')
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(captured).to.deep.equal([['abc123', 'json', 'read', 'sheet.xlsx']])
    })
  })

  describe('__executeWorker', () => {
    const installFakeWorker = (payload) => {
      const originalWorker = globalThis.Worker
      const constructedWith = []
      const terminated = []
      class FakeWorker {
        constructor(url) {
          constructedWith.push(url)
          this.onmessage = null
        }
        postMessage() {
          this.onmessage({ data: payload })
        }
        terminate() {
          terminated.push(true)
        }
      }
      globalThis.Worker = FakeWorker
      return {
        constructedWith: constructedWith,
        terminated: terminated,
        restore: () => {
          globalThis.Worker = originalWorker
        },
      }
    }

    it('dispatches xlsx-file-system-data with the processed workbook', async () => {
      const harness = installFakeWorker({
        t: 'xlsx',
        d: JSON.stringify(makeWorkbook()),
      })
      try {
        element.XLSX = makeFakeXLSX(makeCalls())
        const detail = await new Promise((resolve) => {
          globalThis.addEventListener(
            'xlsx-file-system-data',
            (e) => resolve(e.detail),
            { once: true },
          )
          element.__executeWorker('binary-data', 'json', 'read', 'report.xlsx')
        })
        expect(detail.filename).to.equal('report.xlsx')
        expect(detail.format).to.equal('json')
        expect(detail.operation).to.equal('read')
        expect(detail.data).to.deep.equal({ alpha: [['h'], ['r']] })
        expect(harness.constructedWith[0]).to.equal(element.XW.worker)
        // FIXED: xlsx-file-system-broker.js __executeWorker terminates the
        // worker once the vendored xlsxworker replies with the data
        // message, so each processed file releases its worker.
        expect(harness.terminated.length).to.equal(1)
      } finally {
        harness.restore()
      }
    })

    it('defaults operation to read and filename to an empty string', async () => {
      const harness = installFakeWorker({
        t: 'xlsx',
        d: JSON.stringify(makeWorkbook()),
      })
      try {
        element.XLSX = makeFakeXLSX(makeCalls())
        const detail = await new Promise((resolve) => {
          globalThis.addEventListener(
            'xlsx-file-system-data',
            (e) => resolve(e.detail),
            { once: true },
          )
          element.__executeWorker('binary-data', 'csv')
        })
        expect(detail.operation).to.equal('read')
        expect(detail.filename).to.equal('')
        expect(detail.format).to.equal('csv')
        expect(detail.data).to.equal('SHEET: alpha\n\na,b')
      } finally {
        harness.restore()
      }
    })

    it('logs worker error payloads without dispatching data', async () => {
      const harness = installFakeWorker({ t: 'e', d: 'worker exploded' })
      const originalError = console.error
      const errors = []
      console.error = (...args) => {
        errors.push(args[0])
      }
      let dispatched = 0
      const listener = () => {
        dispatched += 1
      }
      globalThis.addEventListener('xlsx-file-system-data', listener)
      try {
        element.__executeWorker('data', 'json')
        await new Promise((resolve) => setTimeout(resolve, 10))
        expect(errors).to.deep.equal(['worker exploded'])
        expect(dispatched).to.equal(0)
        // the error reply also completes the vendored worker round trip,
        // so the worker is released on failure as well
        expect(harness.terminated.length).to.equal(1)
      } finally {
        globalThis.removeEventListener('xlsx-file-system-data', listener)
        console.error = originalError
        harness.restore()
      }
    })

    it('ignores ready notifications', async () => {
      const harness = installFakeWorker({ t: 'ready' })
      const originalError = console.error
      const errors = []
      console.error = (...args) => {
        errors.push(args[0])
      }
      let dispatched = 0
      const listener = () => {
        dispatched += 1
      }
      globalThis.addEventListener('xlsx-file-system-data', listener)
      try {
        element.__executeWorker('data', 'json')
        await new Promise((resolve) => setTimeout(resolve, 10))
        expect(dispatched).to.equal(0)
        expect(errors.length).to.equal(0)
        // the ready handshake is not the reply to our data postMessage, so
        // the worker stays alive waiting for the data or error message
        expect(harness.terminated.length).to.equal(0)
      } finally {
        globalThis.removeEventListener('xlsx-file-system-data', listener)
        console.error = originalError
        harness.restore()
      }
    })
  })
})
