import { fixture, expect, html } from '@open-wc/testing'
import {
  FileSystemBroker,
  FileSystemBrokerSingleton,
} from '../file-system-broker.js'

// helper: stub an own/prototype property and return a restore function
const stubProperty = (obj, prop, value) => {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop)
  Object.defineProperty(obj, prop, {
    value: value,
    configurable: true,
    writable: true,
  })
  return () => {
    if (descriptor) {
      Object.defineProperty(obj, prop, descriptor)
    } else {
      delete obj[prop]
    }
  }
}

// fake directory handles that satisfy both __readDir (async iterator of
// [name, handle] pairs) and readFileInDir/writeFileInDir (values() of handles)
const makeFileHandle = (name, text) => ({
  name: name,
  kind: 'file',
  getFile: async () => ({ text: async () => text }),
})
const makeDirHandle = (name, pairs, extra) => ({
  name: name,
  kind: 'directory',
  [Symbol.asyncIterator]: async function* () {
    for (const pair of pairs) {
      yield [pair[0], pair[1]]
    }
  },
  values: async function* () {
    for (const pair of pairs) {
      yield pair[1]
    }
  },
  ...(extra || {}),
})

describe('FileSystemBroker behavioral coverage', () => {
  let element
  let _pickers

  beforeEach(async () => {
    // stub the pickers so no code path can hang awaiting a user gesture
    _pickers = {
      showOpenFilePicker: globalThis.showOpenFilePicker,
      showSaveFilePicker: globalThis.showSaveFilePicker,
      showDirectoryPicker: globalThis.showDirectoryPicker,
    }
    const noopPicker = () => Promise.resolve([])
    const names = [
      'showOpenFilePicker',
      'showSaveFilePicker',
      'showDirectoryPicker',
    ]
    names.forEach((name) =>
      Object.defineProperty(globalThis, name, {
        value: noopPicker,
        configurable: true,
        writable: true,
      }),
    )
    element = await fixture(html`<file-system-broker></file-system-broker>`)
  })

  afterEach(() => {
    const names = [
      'showOpenFilePicker',
      'showSaveFilePicker',
      'showDirectoryPicker',
    ]
    names.forEach((name) => {
      if (_pickers[name] === undefined) {
        delete globalThis[name]
      } else {
        Object.defineProperty(globalThis, name, {
          value: _pickers[name],
          configurable: true,
          writable: true,
        })
      }
    })
  })

  describe('isFileSystemAccessSupported', () => {
    it('reports true when showOpenFilePicker is a function', () => {
      expect(element.isFileSystemAccessSupported()).to.be.true
    })

    it('reports false when showOpenFilePicker is missing', () => {
      delete globalThis.showOpenFilePicker
      expect(element.isFileSystemAccessSupported()).to.be.false
    })

    it('reports false when showOpenFilePicker is not a function', () => {
      const restore = stubProperty(
        globalThis,
        'showOpenFilePicker',
        'not-a-function',
      )
      try {
        expect(element.isFileSystemAccessSupported()).to.be.false
      } finally {
        restore()
      }
    })
  })

  describe('isMobileDevice', () => {
    it('returns a boolean for the running environment', () => {
      expect(element.isMobileDevice()).to.be.a('boolean')
    })

    it('detects a mobile user agent', () => {
      const restoreUA = stubProperty(
        navigator,
        'userAgent',
        'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36',
      )
      try {
        expect(element.isMobileDevice()).to.be.true
      } finally {
        restoreUA()
      }
    })

    it('detects touch capable small screen devices', () => {
      const restoreUA = stubProperty(
        navigator,
        'userAgent',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      )
      const restoreTouch = stubProperty(navigator, 'maxTouchPoints', 5)
      const restoreScreen = stubProperty(globalThis, 'screen', { width: 375 })
      try {
        expect(element.isMobileDevice()).to.be.true
      } finally {
        restoreScreen()
        restoreTouch()
        restoreUA()
      }
    })

    it('reports false for desktop without touch', () => {
      const restoreUA = stubProperty(
        navigator,
        'userAgent',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      )
      const restoreTouch = stubProperty(navigator, 'maxTouchPoints', 0)
      const restoreScreen = stubProperty(globalThis, 'screen', { width: 1920 })
      delete globalThis.ontouchstart
      try {
        expect(element.isMobileDevice()).to.be.false
      } finally {
        restoreScreen()
        restoreTouch()
        restoreUA()
      }
    })
  })

  describe('loadFileFallback', () => {
    const findInput = () => document.body.querySelector('input[type="file"]')

    it('resolves with the first picked file via a synthetic change event', async () => {
      const fakeFile = { name: 'picked.txt' }
      const promise = element.loadFileFallback('csv')
      const input = findInput()
      expect(input).to.exist
      expect(input.accept).to.equal('.csv,.txt')
      expect(input.multiple).to.be.false
      // neutralize the delayed native click so no dialog can ever open
      let clicked = 0
      input.click = () => {
        clicked += 1
      }
      Object.defineProperty(input, 'files', {
        value: { 0: fakeFile, length: 1 },
        configurable: true,
      })
      input.dispatchEvent(new Event('change'))
      const result = await promise
      expect(result === fakeFile).to.be.true
      expect(element.fileHandler === fakeFile).to.be.true
      expect(document.body.contains(input)).to.be.false
      // the delayed click statement still runs, against the stubbed method
      await new Promise((resolve) => setTimeout(resolve, 30))
      expect(clicked).to.equal(1)
    })

    it('rejects when the change event carries no files', async () => {
      const promise = element.loadFileFallback('html')
      const input = findInput()
      expect(input.accept).to.equal('.html,.htm')
      input.click = () => {}
      Object.defineProperty(input, 'files', {
        value: { length: 0 },
        configurable: true,
      })
      input.dispatchEvent(new Event('change'))
      let error = null
      try {
        await promise
      } catch (e) {
        error = e
      }
      expect(error).to.exist
      expect(error.message).to.equal('No file selected')
      expect(document.body.contains(input)).to.be.false
      await new Promise((resolve) => setTimeout(resolve, 30))
    })

    it('rejects when the dialog is cancelled', async () => {
      const promise = element.loadFileFallback('image')
      const input = findInput()
      expect(input.accept).to.equal('image/*')
      input.click = () => {}
      input.dispatchEvent(new Event('cancel'))
      let error = null
      try {
        await promise
      } catch (e) {
        error = e
      }
      expect(error).to.exist
      expect(error.message).to.equal('File selection cancelled')
      expect(document.body.contains(input)).to.be.false
      await new Promise((resolve) => setTimeout(resolve, 30))
    })

    it('flags the hidden input for multiple selection', async () => {
      const promise = element.loadFileFallback('pdf', true)
      const input = findInput()
      expect(input.multiple).to.be.true
      input.click = () => {}
      Object.defineProperty(input, 'files', {
        value: { 0: { name: 'a.pdf' }, length: 1 },
        configurable: true,
      })
      input.dispatchEvent(new Event('change'))
      await promise
      await new Promise((resolve) => setTimeout(resolve, 30))
    })
  })

  describe('typeToAcceptString', () => {
    it('maps every supported type to an accept string', () => {
      const cases = {
        html: '.html,.htm',
        xls: '.csv,.xls,.xlsx,.ods',
        xlsx: '.csv,.xls,.xlsx,.ods',
        ods: '.csv,.xls,.xlsx,.ods',
        zip: '.zip,.gz,.tar',
        csv: '.csv,.txt',
        pdf: '.pdf',
        doc: '.doc,.docx',
        docx: '.doc,.docx',
        ppt: '.ppt,.pptx',
        pptx: '.ppt,.pptx',
        image: 'image/*',
        video: 'video/*',
        markdown: '.txt,.md',
        '*': '*/*',
        'made-up-type': '*/*',
      }
      Object.keys(cases).forEach((type) => {
        expect(element.typeToAcceptString(type)).to.equal(cases[type])
      })
    })
  })

  describe('typeToAccept remaining branches', () => {
    it('handles pdf, doc/docx and ppt/pptx types', () => {
      expect(element.typeToAccept('pdf')).to.deep.equal({
        'application/pdf': ['.pdf'],
      })
      expect(element.typeToAccept('doc')).to.deep.equal({
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          ['.docx'],
      })
      expect(element.typeToAccept('docx')).to.deep.equal(
        element.typeToAccept('doc'),
      )
      expect(element.typeToAccept('ppt')).to.deep.equal({
        'application/vnd.ms-powerpoint': ['.ppt'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          ['.pptx'],
      })
      expect(element.typeToAccept('pptx')).to.deep.equal(
        element.typeToAccept('ppt'),
      )
    })
  })

  describe('loadFile', () => {
    it('uses the File System Access API when available', async () => {
      const fakeFile = new File(['hello world'], 'hello.txt', {
        type: 'text/plain',
      })
      const pickerOptions = []
      globalThis.showOpenFilePicker = (options) => {
        pickerOptions.push(options)
        return Promise.resolve([{ getFile: () => Promise.resolve(fakeFile) }])
      }
      const result = await element.loadFile('html')
      expect(result === fakeFile).to.be.true
      expect(element.fileHandler === fakeFile).to.be.true
      expect(pickerOptions.length).to.equal(1)
      expect(pickerOptions[0].types[0].description).to.equal('html file')
      expect(pickerOptions[0].types[0].accept).to.deep.equal(
        element.typeToAccept('html'),
      )
      expect(pickerOptions[0].excludeAcceptAllOption).to.be.true
      expect(pickerOptions[0].multiple).to.be.false
    })

    it('forwards multiple and excludeAll to the picker', async () => {
      const fakeFile = new File(['c'], 'c.csv', { type: 'text/csv' })
      const pickerOptions = []
      globalThis.showOpenFilePicker = (options) => {
        pickerOptions.push(options)
        return Promise.resolve([{ getFile: () => Promise.resolve(fakeFile) }])
      }
      await element.loadFile('csv', true, false)
      expect(pickerOptions[0].multiple).to.be.true
      expect(pickerOptions[0].excludeAcceptAllOption).to.be.false
      expect(pickerOptions[0].types[0].accept).to.deep.equal({
        'text/*': ['.csv', '.txt'],
      })
    })

    it('propagates picker rejections', async () => {
      globalThis.showOpenFilePicker = () =>
        Promise.reject(new Error('picker denied'))
      let error = null
      try {
        await element.loadFile('html')
      } catch (e) {
        error = e
      }
      expect(error).to.exist
      expect(error.message).to.equal('picker denied')
    })

    it('delegates to the fallback when the API is unsupported', async () => {
      const calls = []
      element.isFileSystemAccessSupported = () => false
      element.loadFileFallback = async (...args) => {
        calls.push(args)
        return 'fallback-file'
      }
      const result = await element.loadFile('pdf', true)
      expect(calls).to.deep.equal([['pdf', true]])
      expect(result).to.equal('fallback-file')
    })
  })

  describe('getFileContents', () => {
    it('returns the text of the loaded file', async () => {
      const fakeFile = new File(['file-contents-here'], 'note.md', {
        type: 'text/markdown',
      })
      globalThis.showOpenFilePicker = () =>
        Promise.resolve([{ getFile: () => Promise.resolve(fakeFile) }])
      const contents = await element.getFileContents('markdown')
      expect(contents).to.equal('file-contents-here')
    })
  })

  describe('saveFile', () => {
    it('writes content through a writable stream', async () => {
      const writes = []
      let closed = false
      const writable = {
        write: (content) => {
          writes.push(content)
        },
        close: () => {
          closed = true
        },
      }
      const fakeHandle = { createWritable: () => Promise.resolve(writable) }
      const saverOptions = []
      globalThis.showSaveFilePicker = (options) => {
        saverOptions.push(options)
        return Promise.resolve(fakeHandle)
      }
      await element.saveFile('html', '<b>saved</b>')
      expect(writes).to.deep.equal(['<b>saved</b>'])
      expect(closed).to.be.true
      expect(element.fileHandler === fakeHandle).to.be.true
      expect(saverOptions[0].types[0].description).to.equal('Save html file')
      expect(saverOptions[0].types[0].accept).to.deep.equal(
        element.typeToAccept('html'),
      )
    })
  })

  describe('openDir', () => {
    it('walks recursively, tracks folders, and skips .git recursion', async () => {
      const gitDir = makeDirHandle('.git', [
        ['config', { name: 'config', kind: 'file' }],
      ])
      const subDir = makeDirHandle('sub', [
        ['b.txt', makeFileHandle('b.txt', 'b-contents')],
      ])
      const rootDir = makeDirHandle('root', [
        ['a.txt', makeFileHandle('a.txt', 'a-contents')],
        ['sub', subDir],
        ['.git', gitDir],
      ])
      const pickerOptions = []
      globalThis.showDirectoryPicker = (options) => {
        pickerOptions.push(options)
        return Promise.resolve(rootDir)
      }
      const files = await element.openDir(true, { id: 'dir-test' })
      expect(pickerOptions).to.deep.equal([{ id: 'dir-test' }])
      expect(element.dirHandler === rootDir).to.be.true
      expect(files.map((f) => f.name)).to.deep.equal([
        'a.txt',
        'sub',
        'b.txt',
        '.git',
      ])
      const topFile = files.find((f) => f.name === 'a.txt')
      expect(topFile.folder).to.equal('root')
      expect(topFile.parentHandler === rootDir).to.be.true
      const nested = files.find((f) => f.name === 'b.txt')
      expect(nested.folder).to.equal('root/sub')
      expect(nested.parentHandler === subDir).to.be.true
      expect(nested.kind).to.equal('file')
      // .git itself is listed but its children are never walked
      const gitEntry = files.find((f) => f.name === '.git')
      expect(gitEntry.kind).to.equal('directory')
      expect(gitEntry.parentHandler === rootDir).to.be.true
      expect(files.some((f) => f.name === 'config')).to.be.false
    })

    it('does not recurse when recursive is false', async () => {
      const subDir = makeDirHandle('sub', [
        ['b.txt', makeFileHandle('b.txt', 'b')],
      ])
      const rootDir = makeDirHandle('root', [
        ['sub', subDir],
        ['a.txt', makeFileHandle('a.txt', 'a')],
      ])
      globalThis.showDirectoryPicker = () => Promise.resolve(rootDir)
      const files = await element.openDir(false)
      expect(files.map((f) => f.name)).to.deep.equal(['sub', 'a.txt'])
    })

    it('warns and reads the stale handle when the picker rejects', async () => {
      const warnings = []
      const originalWarn = console.warn
      console.warn = (...args) => {
        warnings.push(args[0])
      }
      try {
        const staleDir = makeDirHandle('stale', [
          ['old.txt', makeFileHandle('old.txt', 'old')],
        ])
        element.dirHandler = staleDir
        globalThis.showDirectoryPicker = () =>
          Promise.reject(new Error('picker denied'))
        const files = await element.openDir()
        expect(warnings.length).to.equal(1)
        expect(warnings[0].message).to.equal('picker denied')
        expect(files.map((f) => f.name)).to.deep.equal(['old.txt'])
      } finally {
        console.warn = originalWarn
      }
    })

    it('returns an empty list when the picker rejects and no handle exists', async () => {
      // FIXED: file-system-broker.js openDir no longer calls __readDir on
      // the stale (null) dirHandler after catching a picker rejection; it
      // warns once and resolves with an empty file list instead of throwing
      // a raw TypeError.
      const warnings = []
      const originalWarn = console.warn
      console.warn = (...args) => {
        warnings.push(args)
      }
      try {
        globalThis.showDirectoryPicker = () =>
          Promise.reject(new Error('picker denied'))
        const files = await element.openDir()
        expect(files).to.deep.equal([])
        expect(element.files).to.deep.equal([])
        expect(warnings.length).to.equal(1)
        expect(warnings[0][0].message).to.equal('picker denied')
      } finally {
        console.warn = originalWarn
      }
    })

    it('uses an empty folder name for nameless directory handles', async () => {
      const rootDir = makeDirHandle(undefined, [
        ['a.txt', makeFileHandle('a.txt', 'a')],
      ])
      globalThis.showDirectoryPicker = () => Promise.resolve(rootDir)
      const files = await element.openDir(true)
      expect(files[0].folder).to.equal('')
    })
  })

  describe('readFileInDir', () => {
    it('reads the matching file, skipping directories and other names', async () => {
      const dirHandle = makeDirHandle('root', [
        ['other.txt', makeFileHandle('other.txt', 'other')],
        ['nested', makeDirHandle('nested', [])],
        ['target.txt', makeFileHandle('target.txt', 'target-contents')],
      ])
      globalThis.showDirectoryPicker = () => Promise.resolve(dirHandle)
      const contents = await element.readFileInDir('target.txt')
      expect(contents).to.equal('target-contents')
      expect(element.dirHandler === dirHandle).to.be.true
    })

    it('returns an empty string when the file is not found', async () => {
      const dirHandle = makeDirHandle('root', [
        ['a.txt', makeFileHandle('a.txt', 'a')],
      ])
      globalThis.showDirectoryPicker = () => Promise.resolve(dirHandle)
      expect(await element.readFileInDir('missing.txt')).to.equal('')
    })

    it('returns an empty string when fileName is falsy', async () => {
      const dirHandle = makeDirHandle('root', [
        ['a.txt', makeFileHandle('a.txt', 'a')],
      ])
      globalThis.showDirectoryPicker = () => Promise.resolve(dirHandle)
      expect(await element.readFileInDir('')).to.equal('')
    })
  })

  describe('writeFileInDir', () => {
    it('writes content into the matching file and returns true', async () => {
      const writes = []
      let closed = false
      const writable = {
        write: (content) => {
          writes.push(content)
        },
        close: () => {
          closed = true
        },
      }
      const fileHandle = { createWritable: () => Promise.resolve(writable) }
      const getFileHandleCalls = []
      const dirHandle = makeDirHandle(
        'root',
        [['target.txt', makeFileHandle('target.txt', 'old')]],
        {
          getFileHandle: (name) => {
            getFileHandleCalls.push(name)
            return Promise.resolve(fileHandle)
          },
        },
      )
      globalThis.showDirectoryPicker = () => Promise.resolve(dirHandle)
      const result = await element.writeFileInDir('target.txt', 'new contents')
      expect(result).to.be.true
      expect(getFileHandleCalls).to.deep.equal(['target.txt'])
      expect(writes).to.deep.equal(['new contents'])
      expect(closed).to.be.true
      expect(element.dirHandler === dirHandle).to.be.true
    })

    it('returns false when the file is not in the directory', async () => {
      const dirHandle = makeDirHandle('root', [
        ['a.txt', makeFileHandle('a.txt', 'a')],
      ])
      globalThis.showDirectoryPicker = () => Promise.resolve(dirHandle)
      expect(await element.writeFileInDir('missing.txt', 'x')).to.be.false
    })

    it('returns false and warns when the picker rejects', async () => {
      const warnings = []
      const originalWarn = console.warn
      console.warn = (...args) => {
        warnings.push(args)
      }
      try {
        globalThis.showDirectoryPicker = () =>
          Promise.reject(new Error('picker denied'))
        expect(await element.writeFileInDir('a.txt', 'x')).to.be.false
        expect(warnings.length).to.equal(1)
      } finally {
        console.warn = originalWarn
      }
    })
  })

  describe('singleton requestAvailability', () => {
    it('creates and appends a fresh instance when none exists', () => {
      const original = globalThis.FileSystemBroker.instance
      delete globalThis.FileSystemBroker.instance
      const fresh = globalThis.FileSystemBroker.requestAvailability()
      try {
        expect(fresh === original).to.be.false
        expect(fresh instanceof FileSystemBroker).to.be.true
        expect(fresh.parentNode === document.body).to.be.true
        expect(globalThis.FileSystemBroker.instance === fresh).to.be.true
        expect(
          globalThis.FileSystemBroker.requestAvailability() === fresh,
        ).to.be.true
      } finally {
        globalThis.FileSystemBroker.instance = original
        fresh.remove()
      }
    })
  })

  it('exposes the singleton exported at import time', () => {
    expect(FileSystemBrokerSingleton instanceof FileSystemBroker).to.be.true
    expect(FileSystemBrokerSingleton.parentNode === document.body).to.be.true
  })
})
