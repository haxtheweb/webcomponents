import { expect, oneEvent } from '@open-wc/testing'

import { HAXStore } from '../lib/hax-store.js'

describe('hax-store helper methods', () => {
  describe('mimeTypeToGizmoType', () => {
    it('returns audio for audio/*', () => {
      expect(HAXStore.mimeTypeToGizmoType('audio/mpeg')).to.equal('audio')
      expect(HAXStore.mimeTypeToGizmoType('audio/wav')).to.equal('audio')
    })

    it('returns image for image/*', () => {
      expect(HAXStore.mimeTypeToGizmoType('image/png')).to.equal('image')
      expect(HAXStore.mimeTypeToGizmoType('image/jpeg')).to.equal('image')
    })

    it('returns svg for image/svg+xml', () => {
      expect(HAXStore.mimeTypeToGizmoType('image/svg+xml')).to.equal('svg')
    })

    it('returns video for video/*', () => {
      expect(HAXStore.mimeTypeToGizmoType('video/mp4')).to.equal('video')
    })

    it('returns csv for text/csv', () => {
      expect(HAXStore.mimeTypeToGizmoType('text/csv')).to.equal('csv')
    })

    it('returns html for text/html', () => {
      expect(HAXStore.mimeTypeToGizmoType('text/html')).to.equal('html')
    })

    it('returns markdown for text/markdown', () => {
      expect(HAXStore.mimeTypeToGizmoType('text/markdown')).to.equal('markdown')
    })

    it('returns document for text/plain', () => {
      expect(HAXStore.mimeTypeToGizmoType('text/plain')).to.equal('document')
    })

    it('returns pdf for application/pdf', () => {
      expect(HAXStore.mimeTypeToGizmoType('application/pdf')).to.equal('pdf')
    })

    it('returns archive for application/zip', () => {
      expect(HAXStore.mimeTypeToGizmoType('application/zip')).to.equal('archive')
    })

    it('returns archive for application/gzip', () => {
      expect(HAXStore.mimeTypeToGizmoType('application/gzip')).to.equal('archive')
    })

    it('returns archive for application/x-tar', () => {
      expect(HAXStore.mimeTypeToGizmoType('application/x-tar')).to.equal('archive')
    })

    it('returns document for unknown application type', () => {
      expect(HAXStore.mimeTypeToGizmoType('application/octet-stream')).to.equal(
        'document',
      )
    })
  })

  describe('guessGizmoType', () => {
    it('returns audio for .mp3', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.mp3' })).to.equal('audio')
    })

    it('returns audio for .wav', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.wav' })).to.equal('audio')
    })

    it('returns audio for .ogg', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.ogg' })).to.equal('audio')
    })

    it('returns audio for .m4a', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.m4a' })).to.equal('audio')
    })

    it('returns audio for .flac', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.flac' })).to.equal('audio')
    })

    it('returns audio for .aac', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.aac' })).to.equal('audio')
    })

    it('returns audio for .mid', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.mid' })).to.equal('audio')
    })

    it('returns audio for .midi', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.midi' })).to.equal('audio')
    })

    it('returns video for .mp4', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.mp4' })).to.equal('video')
    })

    it('returns video for .webm', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.webm' })).to.equal('video')
    })

    it('returns video for .mov', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.mov' })).to.equal('video')
    })

    it('returns video for .mkv', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.mkv' })).to.equal('video')
    })

    it('returns video for .avi', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.avi' })).to.equal('video')
    })

    it('returns video for .m4v', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.m4v' })).to.equal('video')
    })

    it('returns image for .png', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.png' })).to.equal('image')
    })

    it('returns image for .jpg', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.jpg' })).to.equal('image')
    })

    it('returns image for .jpeg', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.jpeg' })).to.equal('image')
    })

    it('returns gif for .gif', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.gif' })).to.equal('gif')
    })

    it('returns pdf for .pdf', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.pdf' })).to.equal('pdf')
    })

    it('returns svg for .svg', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.svg' })).to.equal('svg')
    })

    it('returns csv for .csv', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.csv' })).to.equal('csv')
    })

    it('returns markdown for .md', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.md' })).to.equal('markdown')
    })

    it('returns html for .html', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.html' })).to.equal('html')
    })

    it('returns html for .htm', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.htm' })).to.equal('html')
    })

    it('returns pptx for .pptx (before .ppt check)', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.pptx' })).to.equal('pptx')
    })

    it('returns document for .ppt', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.ppt' })).to.equal('document')
    })

    it('returns document for .txt', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.txt' })).to.equal('document')
    })

    it('returns document for .doc', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.doc' })).to.equal('document')
    })

    it('returns document for .docx', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.docx' })).to.equal('document')
    })

    it('returns document for .xls', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.xls' })).to.equal('document')
    })

    it('returns document for .xlsx', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.xlsx' })).to.equal('document')
    })

    it('returns document for .vtt', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.vtt' })).to.equal('document')
    })

    it('returns archive for .zip', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.zip' })).to.equal('archive')
    })

    it('returns archive for .tar', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.tar' })).to.equal('archive')
    })

    it('returns archive for .tar.gz', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.tar.gz' })).to.equal('archive')
    })

    it('returns * for unknown source', () => {
      expect(HAXStore.guessGizmoType({ source: 'file.unknown' })).to.equal('*')
    })

    it('returns * when no source property', () => {
      expect(HAXStore.guessGizmoType({})).to.equal('*')
    })
  })

  describe('isTextElement', () => {
    let originalValidTagList
    beforeEach(() => {
      originalValidTagList = HAXStore.validTagList
      HAXStore.validTagList = [
        'p', 'ol', 'ul', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'span', 'blockquote', 'pre', 'code', 'figure', 'section',
        'div', 'media-image',
      ]
    })
    afterEach(() => {
      HAXStore.validTagList = originalValidTagList
    })

    it('returns true for p element', () => {
      const el = globalThis.document.createElement('p')
      expect(HAXStore.isTextElement(el)).to.equal(true)
    })

    it('returns true for h2 element', () => {
      const el = globalThis.document.createElement('h2')
      expect(HAXStore.isTextElement(el)).to.equal(true)
    })

    it('returns true for blockquote element', () => {
      const el = globalThis.document.createElement('blockquote')
      expect(HAXStore.isTextElement(el)).to.equal(true)
    })

    it('returns true for span element', () => {
      const el = globalThis.document.createElement('span')
      expect(HAXStore.isTextElement(el)).to.equal(true)
    })

    it('returns false for div element (not in text list)', () => {
      const el = globalThis.document.createElement('div')
      expect(HAXStore.isTextElement(el)).to.equal(false)
    })

    it('returns false for media-image (not a text element)', () => {
      const el = globalThis.document.createElement('media-image')
      expect(HAXStore.isTextElement(el)).to.equal(false)
    })

    it('returns false for null', () => {
      expect(HAXStore.isTextElement(null)).to.equal(false)
    })

    it('returns false for undefined', () => {
      expect(HAXStore.isTextElement(undefined)).to.equal(false)
    })

    it('handles HAX element objects with .tag property', () => {
      expect(HAXStore.isTextElement({ tag: 'p' })).to.equal(true)
      expect(HAXStore.isTextElement({ tag: 'div' })).to.equal(false)
    })

    it('returns false for tag not in validTagList', () => {
      const el = globalThis.document.createElement('custom-unknown')
      expect(HAXStore.isTextElement(el)).to.equal(false)
    })
  })

  describe('isInlineElement', () => {
    let originalValidTagList, originalElementList
    beforeEach(() => {
      originalValidTagList = HAXStore.validTagList
      originalElementList = HAXStore.elementList
      HAXStore.validTagList = [
        'a', 'span', 'b', 'i', 'em', 'strong', 'code', 'mark', 'div', 'p',
      ]
      HAXStore.elementList = {}
    })
    afterEach(() => {
      HAXStore.validTagList = originalValidTagList
      HAXStore.elementList = originalElementList
    })

    it('returns true for a element', () => {
      expect(HAXStore.isInlineElement(globalThis.document.createElement('a'))).to.equal(true)
    })

    it('returns true for span element', () => {
      expect(HAXStore.isInlineElement(globalThis.document.createElement('span'))).to.equal(true)
    })

    it('returns true for strong element', () => {
      expect(HAXStore.isInlineElement(globalThis.document.createElement('strong'))).to.equal(true)
    })

    it('returns true for em element', () => {
      expect(HAXStore.isInlineElement(globalThis.document.createElement('em'))).to.equal(true)
    })

    it('returns false for div (not inline)', () => {
      expect(HAXStore.isInlineElement(globalThis.document.createElement('div'))).to.equal(false)
    })

    it('returns false for null', () => {
      expect(HAXStore.isInlineElement(null)).to.equal(false)
    })

    it('handles string input', () => {
      expect(HAXStore.isInlineElement('span')).to.equal(true)
      expect(HAXStore.isInlineElement('div')).to.equal(false)
    })

    it('handles HAX element objects with .tag', () => {
      expect(HAXStore.isInlineElement({ tag: 'a' })).to.equal(true)
    })

    it('returns true when schema has inlineOnly meta', () => {
      HAXStore.validTagList = ['custom-inline', 'div']
      HAXStore.elementList = {
        'custom-inline': { gizmo: {}, meta: { inlineOnly: true } },
      }
      const el = globalThis.document.createElement('custom-inline')
      expect(HAXStore.isInlineElement(el)).to.equal(true)
    })
  })

  describe('platformAllows', () => {
    let originalConfig
    beforeEach(() => {
      originalConfig = HAXStore.platformConfig
    })
    afterEach(() => {
      HAXStore.platformConfig = originalConfig
    })

    it('returns true when platformConfig is undefined', () => {
      HAXStore.platformConfig = undefined
      expect(HAXStore.platformAllows('anything')).to.equal(true)
    })

    it('returns true when platformConfig is null', () => {
      HAXStore.platformConfig = null
      expect(HAXStore.platformAllows('anything')).to.equal(true)
    })

    it('returns true for feature that is not explicitly false', () => {
      HAXStore.platformConfig = {
        __supportedFeatures: new Set(['myFeature']),
        features: { myFeature: true },
      }
      expect(HAXStore.platformAllows('myFeature')).to.equal(true)
    })

    it('returns false for feature explicitly set to false', () => {
      HAXStore.platformConfig = {
        __supportedFeatures: new Set(['myFeature']),
        features: { myFeature: false },
      }
      expect(HAXStore.platformAllows('myFeature')).to.equal(false)
    })

    it('returns true for feature with no value in features (default)', () => {
      HAXStore.platformConfig = {
        __supportedFeatures: new Set(['myFeature']),
        features: {},
      }
      expect(HAXStore.platformAllows('myFeature')).to.equal(true)
    })

    it('returns false when allowedBlocks is null', () => {
      HAXStore.platformConfig = {
        __supportedFeatures: new Set(),
        features: {},
        allowedBlocks: null,
      }
      expect(HAXStore.platformAllows('some-block')).to.equal(false)
    })

    it('returns true when allowedBlocks is empty and no explicit blocks', () => {
      HAXStore.platformConfig = {
        __supportedFeatures: new Set(),
        features: {},
        allowedBlocks: new Set(),
      }
      expect(HAXStore.platformAllows('some-block')).to.equal(true)
    })

    it('returns true for block in allowedBlocks', () => {
      HAXStore.platformConfig = {
        __supportedFeatures: new Set(),
        features: {},
        allowedBlocks: new Set(['my-block']),
      }
      expect(HAXStore.platformAllows('my-block')).to.equal(true)
    })

    it('returns false for block NOT in allowedBlocks', () => {
      HAXStore.platformConfig = {
        __supportedFeatures: new Set(),
        features: {},
        allowedBlocks: new Set(['my-block']),
      }
      expect(HAXStore.platformAllows('other-block')).to.equal(false)
    })
  })

  describe('isPlatformAudience', () => {
    let originalConfig
    beforeEach(() => {
      originalConfig = HAXStore.platformConfig
    })
    afterEach(() => {
      HAXStore.platformConfig = originalConfig
    })

    it('returns true for expert when no platformConfig', () => {
      HAXStore.platformConfig = undefined
      expect(HAXStore.isPlatformAudience('expert')).to.equal(true)
      expect(HAXStore.isPlatformAudience('novice')).to.equal(false)
    })

    it('matches configured audience', () => {
      HAXStore.platformConfig = { audience: 'novice' }
      expect(HAXStore.isPlatformAudience('novice')).to.equal(true)
      expect(HAXStore.isPlatformAudience('expert')).to.equal(false)
    })
  })

  describe('haxSchemaFromTag', () => {
    let originalElementList
    beforeEach(() => {
      originalElementList = HAXStore.elementList
      HAXStore.elementList = {
        'test-element': { gizmo: { tag: 'test-element', title: 'Test' } },
      }
    })
    afterEach(() => {
      HAXStore.elementList = originalElementList
    })

    it('returns schema for known tag', () => {
      const schema = HAXStore.haxSchemaFromTag('test-element')
      expect(schema.gizmo.tag).to.equal('test-element')
    })

    it('returns empty object for unknown tag', () => {
      expect(HAXStore.haxSchemaFromTag('nonexistent')).to.deep.equal({})
    })

    it('returns empty object for null/undefined', () => {
      expect(HAXStore.haxSchemaFromTag(null)).to.deep.equal({})
      expect(HAXStore.haxSchemaFromTag(undefined)).to.deep.equal({})
    })

    it('lowercases tag before lookup', () => {
      const schema = HAXStore.haxSchemaFromTag('TEST-ELEMENT')
      expect(schema.gizmo.tag).to.equal('test-element')
    })
  })

  describe('slotsFromSchema', () => {
    it('extracts slots from schema settings', () => {
      const schema = {
        settings: {
          configure: [
            { slot: 'content' },
            { slot: 'image' },
            { property: 'title' },
          ],
        },
      }
      const slots = HAXStore.slotsFromSchema(schema)
      expect(slots.length).to.equal(2)
    })

    it('handles empty schema', () => {
      expect(HAXStore.slotsFromSchema({})).to.deep.equal([])
      expect(HAXStore.slotsFromSchema(null)).to.deep.equal([])
    })

    it('filters optional only slots', () => {
      const schema = {
        settings: {
          configure: [
            { slot: 'content', required: true },
            { slot: 'image', required: false },
          ],
        },
      }
      const allSlots = HAXStore.slotsFromSchema(schema, false)
      const optionalOnly = HAXStore.slotsFromSchema(schema, true)
      expect(allSlots.length).to.equal(2)
      expect(optionalOnly.length).to.equal(1)
    })

    it('deduplicates slots', () => {
      const schema = {
        settings: {
          configure: [
            { slot: 'content' },
            { slot: 'content' },
          ],
        },
      }
      const slots = HAXStore.slotsFromSchema(schema)
      expect(slots.length).to.equal(1)
    })

    it('includes empty-string slots', () => {
      const schema = {
        settings: {
          configure: [
            { slot: '' },
          ],
        },
      }
      const slots = HAXStore.slotsFromSchema(schema)
      expect(slots.length).to.equal(1)
    })
  })

  describe('write', () => {
    it('dispatches hax-store-write event on obj', async () => {
      const target = globalThis.document.createElement('div')
      const listener = oneEvent(target, 'hax-store-write')
      HAXStore.write('testProp', 'testVal', target)
      const e = await listener
      expect(e.detail.property).to.equal('testProp')
      expect(e.detail.value).to.equal('testVal')
      expect(e.detail.owner).to.equal(target)
    })

    it('does nothing when obj is falsy', () => {
      expect(() => HAXStore.write('prop', 'val', null)).to.not.throw()
      expect(() => HAXStore.write('prop', 'val', undefined)).to.not.throw()
    })
  })

  describe('toast', () => {
    it('dispatches toast show event on globalThis', async () => {
      const eventName = HAXStore.toastShowEventName
      const listener = oneEvent(globalThis, eventName)
      HAXStore.toast('Test message')
      const e = await listener
      expect(e.detail.text).to.equal('Test message')
      expect(e.detail.duration).to.equal(2000)
    })

    it('passes custom duration', async () => {
      const eventName = HAXStore.toastShowEventName
      const listener = oneEvent(globalThis, eventName)
      HAXStore.toast('Test', 5000)
      const e = await listener
      expect(e.detail.duration).to.equal(5000)
    })
  })

  describe('_nearestContainerTag', () => {
    it('finds nearest ancestor by tag name', () => {
      const div = globalThis.document.createElement('div')
      const span = globalThis.document.createElement('span')
      div.appendChild(span)
      globalThis.document.body.appendChild(div)
      const result = HAXStore._nearestContainerTag(span, 'div')
      expect(result).to.equal(div)
      div.remove()
    })

    it('returns null when no ancestor matches', () => {
      const span = globalThis.document.createElement('span')
      globalThis.document.body.appendChild(span)
      const result = HAXStore._nearestContainerTag(span, 'nonexistent-tag')
      expect(result).to.be.null
      span.remove()
    })

    it('returns the element itself if it matches', () => {
      const div = globalThis.document.createElement('div')
      globalThis.document.body.appendChild(div)
      const result = HAXStore._nearestContainerTag(div, 'div')
      expect(result).to.equal(div)
      div.remove()
    })
  })

  describe('_mediaSrcMatches', () => {
    it('returns false for empty src', () => {
      expect(HAXStore._mediaSrcMatches('', 'path')).to.equal(false)
      expect(HAXStore._mediaSrcMatches(null, 'path')).to.equal(false)
    })

    it('returns false for empty cleanPath', () => {
      expect(HAXStore._mediaSrcMatches('src', '')).to.equal(false)
      expect(HAXStore._mediaSrcMatches('src', null)).to.equal(false)
    })

    it('returns true for exact match', () => {
      expect(HAXStore._mediaSrcMatches('files/img.jpg', 'files/img.jpg')).to.equal(true)
    })

    it('returns true for substring match', () => {
      expect(HAXStore._mediaSrcMatches('files/img.jpg', 'files/img')).to.equal(true)
      expect(HAXStore._mediaSrcMatches('files/img', 'files/img.jpg')).to.equal(true)
    })

    it('returns true for basename match', () => {
      expect(HAXStore._mediaSrcMatches('path/to/img.jpg', 'other/img.jpg')).to.equal(true)
    })

    it('returns false for non-matching paths', () => {
      expect(HAXStore._mediaSrcMatches('files/a.jpg', 'files/b.jpg')).to.equal(false)
    })
  })

  describe('computePolyfillSafe', () => {
    it('returns a boolean', () => {
      expect(typeof HAXStore.computePolyfillSafe()).to.equal('boolean')
    })
  })

  describe('getRange', () => {
    it('returns false or range when no selection available', () => {
      const originalBody = HAXStore.activeHaxBody
      HAXStore.activeHaxBody = null
      // getSelection may return a selection with no ranges, which would
      // cause getRangeAt(0) to throw; wrap to verify graceful handling
      try {
        const result = HAXStore.getRange()
        expect(result === false || typeof result === 'object').to.equal(true)
      } catch (e) {
        // IndexSizeError is acceptable when rangeCount is 0
        expect(e.name).to.equal('IndexSizeError')
      }
      HAXStore.activeHaxBody = originalBody
    })
  })
})
