import { expect } from '@open-wc/testing'

import { HAXStore } from '../lib/hax-store.js'

describe('hax-store additional helper methods', () => {
  describe('_cleanMediaPath', () => {
    it('strips query string', () => {
      expect(HAXStore._cleanMediaPath('file.jpg?t=123')).to.equal('file.jpg')
    })

    it('strips hash fragment', () => {
      expect(HAXStore._cleanMediaPath('file.jpg#section')).to.equal('file.jpg')
    })

    it('strips both query and hash', () => {
      expect(HAXStore._cleanMediaPath('file.jpg?t=123#sec')).to.equal('file.jpg')
    })

    it('handles null/undefined', () => {
      expect(HAXStore._cleanMediaPath(null)).to.equal('')
      expect(HAXStore._cleanMediaPath(undefined)).to.equal('')
    })

    it('handles plain path', () => {
      expect(HAXStore._cleanMediaPath('file.jpg')).to.equal('file.jpg')
    })
  })

  describe('isBase64', () => {
    it('returns false for non-base64 strings', () => {
      expect(HAXStore.isBase64('hello world')).to.equal(false)
    })

    it('returns true for empty string (edge case: empty is valid base64)', () => {
      // atob('') returns '' and btoa('') returns '', so '' == '' is true
      expect(HAXStore.isBase64('')).to.equal(true)
    })
  })

  describe('dashToCamel', () => {
    it('converts dash-case to camelCase', () => {
      expect(HAXStore.dashToCamel('my-prop')).to.equal('myProp')
      expect(HAXStore.dashToCamel('data-hax-lock')).to.equal('dataHaxLock')
    })

    it('handles single word', () => {
      expect(HAXStore.dashToCamel('prop')).to.equal('prop')
    })

    it('handles multiple dashes', () => {
      expect(HAXStore.dashToCamel('a-b-c-d')).to.equal('aBCD')
    })
  })

  describe('HTMLPrimativeTest', () => {
    it('returns true for standard HTML tags', () => {
      expect(HAXStore.HTMLPrimativeTest(globalThis.document.createElement('p'))).to.equal(true)
      expect(HAXStore.HTMLPrimativeTest(globalThis.document.createElement('div'))).to.equal(true)
      expect(HAXStore.HTMLPrimativeTest(globalThis.document.createElement('h2'))).to.equal(true)
    })

    it('returns false for custom element tags', () => {
      expect(HAXStore.HTMLPrimativeTest(globalThis.document.createElement('my-element'))).to.equal(false)
      expect(HAXStore.HTMLPrimativeTest(globalThis.document.createElement('media-image'))).to.equal(false)
    })

    it('returns false for undefined tagName', () => {
      expect(HAXStore.HTMLPrimativeTest({})).to.equal(false)
    })
  })

  describe('haxElementPrototype', () => {
    it('creates a hax element prototype object', () => {
      const gizmo = { tag: 'test-tag', title: 'Test' }
      const props = { source: 'img.jpg' }
      const result = HAXStore.haxElementPrototype(gizmo, props, 'content')
      expect(result.tag).to.equal('test-tag')
      expect(result.properties).to.equal(props)
      expect(result.content).to.equal('content')
      expect(result.gizmo).to.equal(gizmo)
    })

    it('defaults content to empty string', () => {
      const result = HAXStore.haxElementPrototype({ tag: 't' }, {})
      expect(result.content).to.equal('')
    })
  })

  describe('pushWithLimit', () => {
    it('pushes element to array', () => {
      const arr = [1, 2]
      HAXStore.pushWithLimit(arr, 3, 5)
      expect(arr).to.deep.equal([1, 2, 3])
    })

    it('shifts oldest when over limit', () => {
      const arr = [1, 2, 3]
      HAXStore.pushWithLimit(arr, 4, 3)
      expect(arr).to.deep.equal([2, 3, 4])
    })

    it('does not shift when at limit but not over', () => {
      const arr = [1, 2, 3]
      HAXStore.pushWithLimit(arr, 4, 4)
      expect(arr).to.deep.equal([1, 2, 3, 4])
    })
  })

  describe('isExternalURLImport', () => {
    it('returns false for relative paths', () => {
      expect(HAXStore.isExternalURLImport('elements/foo/foo.js')).to.equal(false)
    })

    it('returns false for same-origin URLs', () => {
      expect(HAXStore.isExternalURLImport(globalThis.location.href)).to.equal(false)
    })

    it('returns false for non-URL strings', () => {
      expect(HAXStore.isExternalURLImport('not-a-url')).to.equal(false)
    })
  })

  describe('getOperatingSystem', () => {
    it('returns a non-empty string', () => {
      const os = HAXStore.getOperatingSystem()
      expect(typeof os).to.equal('string')
      expect(os.length).to.be.greaterThan(0)
    })
  })

  describe('_isMediaElement', () => {
    it('returns false for null/undefined', () => {
      expect(HAXStore._isMediaElement(null)).to.equal(false)
      expect(HAXStore._isMediaElement(undefined)).to.equal(false)
    })

    it('returns false for element without tagName', () => {
      expect(HAXStore._isMediaElement({})).to.equal(false)
    })

    it('returns true for video-player', () => {
      expect(HAXStore._isMediaElement(globalThis.document.createElement('video-player'))).to.equal(true)
    })

    it('returns true for audio-player', () => {
      expect(HAXStore._isMediaElement(globalThis.document.createElement('audio-player'))).to.equal(true)
    })

    it('returns false for non-media elements', () => {
      expect(HAXStore._isMediaElement(globalThis.document.createElement('p'))).to.equal(false)
      expect(HAXStore._isMediaElement(globalThis.document.createElement('div'))).to.equal(false)
    })
  })

  describe('_findDeepestLastTextNode', () => {
    it('returns null for null/undefined', () => {
      expect(HAXStore._findDeepestLastTextNode(null)).to.be.null
      expect(HAXStore._findDeepestLastTextNode(undefined)).to.be.null
    })

    it('returns null for element with no children', () => {
      const el = globalThis.document.createElement('div')
      expect(HAXStore._findDeepestLastTextNode(el)).to.be.null
    })

    it('finds last text node in simple element', () => {
      const el = globalThis.document.createElement('div')
      el.textContent = 'Hello world'
      const result = HAXStore._findDeepestLastTextNode(el)
      expect(result).to.exist
      expect(result.nodeType).to.equal(Node.TEXT_NODE)
    })

    it('finds deepest text node in nested structure', () => {
      const el = globalThis.document.createElement('div')
      el.innerHTML = '<span>nested <b>text</b></span>'
      const result = HAXStore._findDeepestLastTextNode(el)
      expect(result).to.exist
      expect(result.textContent).to.equal('text')
    })

    it('skips empty text nodes', () => {
      const el = globalThis.document.createElement('div')
      el.innerHTML = '<p>real text</p>   '
      const result = HAXStore._findDeepestLastTextNode(el)
      expect(result).to.exist
      expect(result.textContent.trim()).to.equal('real text')
    })
  })

  describe('isOriginalGridPlate', () => {
    it('returns true for GRID-PLATE tag', () => {
      expect(HAXStore.isOriginalGridPlate(globalThis.document.createElement('grid-plate'))).to.equal(true)
    })

    it('returns false for other tags', () => {
      expect(HAXStore.isOriginalGridPlate(globalThis.document.createElement('div'))).to.equal(false)
      expect(HAXStore.isOriginalGridPlate(globalThis.document.createElement('p'))).to.equal(false)
    })

    it('returns false for null', () => {
      expect(HAXStore.isOriginalGridPlate(null)).to.equal(false)
    })
  })

  describe('isGridPlateElement', () => {
    let originalGridTagList
    beforeEach(() => {
      originalGridTagList = HAXStore.validGridTagList
      HAXStore.validGridTagList = ['p', 'div', 'grid-plate', 'ol', 'ul']
    })
    afterEach(() => {
      HAXStore.validGridTagList = originalGridTagList
    })

    it('returns true for tags in validGridTagList', () => {
      expect(HAXStore.isGridPlateElement(globalThis.document.createElement('p'))).to.equal(true)
      expect(HAXStore.isGridPlateElement(globalThis.document.createElement('div'))).to.equal(true)
    })

    it('returns false for tags not in validGridTagList', () => {
      expect(HAXStore.isGridPlateElement(globalThis.document.createElement('span'))).to.equal(false)
    })

    it('returns false for null', () => {
      expect(HAXStore.isGridPlateElement(null)).to.equal(false)
    })

    it('handles HAX element objects with .tag', () => {
      expect(HAXStore.isGridPlateElement({ tag: 'p' })).to.equal(true)
      expect(HAXStore.isGridPlateElement({ tag: 'span' })).to.equal(false)
    })
  })

  describe('isLayoutElement', () => {
    let originalElementList
    beforeEach(() => {
      originalElementList = HAXStore.elementList
      HAXStore.elementList = {
        'grid-plate': { type: 'grid', gizmo: {} },
        'my-layout': { type: 'grid', gizmo: {} },
        'regular-el': { gizmo: {} },
      }
    })
    afterEach(() => {
      HAXStore.elementList = originalElementList
    })

    it('returns true when schema type is grid', () => {
      expect(HAXStore.isLayoutElement(globalThis.document.createElement('grid-plate'))).to.equal(true)
      expect(HAXStore.isLayoutElement(globalThis.document.createElement('my-layout'))).to.equal(true)
    })

    it('returns falsy when schema type is not grid', () => {
      const result = HAXStore.isLayoutElement(globalThis.document.createElement('regular-el'))
      expect(result).to.not.equal(true)
    })

    it('returns falsy for null/undefined', () => {
      expect(HAXStore.isLayoutElement(null)).to.not.equal(true)
      expect(HAXStore.isLayoutElement(undefined)).to.not.equal(true)
    })
  })

  describe('isLayoutSlot', () => {
    let originalElementList
    beforeEach(() => {
      originalElementList = HAXStore.elementList
      HAXStore.elementList = {
        'grid-plate': { type: 'grid', gizmo: {} },
      }
    })
    afterEach(() => {
      HAXStore.elementList = originalElementList
    })

    it('returns true when parent is a layout element', () => {
      const parent = globalThis.document.createElement('grid-plate')
      const child = globalThis.document.createElement('p')
      parent.appendChild(child)
      expect(HAXStore.isLayoutSlot(child)).to.equal(true)
    })

    it('returns falsy when parent is not a layout element', () => {
      const parent = globalThis.document.createElement('div')
      const child = globalThis.document.createElement('p')
      parent.appendChild(child)
      expect(HAXStore.isLayoutSlot(child)).to.not.equal(true)
    })

    it('returns false for null/undefined', () => {
      expect(HAXStore.isLayoutSlot(null)).to.equal(false)
      expect(HAXStore.isLayoutSlot(undefined)).to.equal(false)
    })

    it('returns false for node without parentNode', () => {
      const el = globalThis.document.createElement('p')
      expect(HAXStore.isLayoutSlot(el)).to.equal(false)
    })
  })

  describe('activeSchema', () => {
    let originalActiveNode, originalElementList
    beforeEach(() => {
      originalActiveNode = HAXStore.activeNode
      originalElementList = HAXStore.elementList
      HAXStore.elementList = {
        'test-el': { gizmo: { tag: 'test-el', title: 'Test' } },
      }
    })
    afterEach(() => {
      HAXStore.activeNode = originalActiveNode
      HAXStore.elementList = originalElementList
    })

    it('returns schema for activeNode', () => {
      HAXStore.activeNode = globalThis.document.createElement('test-el')
      const schema = HAXStore.activeSchema()
      expect(schema.gizmo.tag).to.equal('test-el')
    })

    it('returns undefined when no activeNode', () => {
      HAXStore.activeNode = null
      expect(HAXStore.activeSchema()).to.be.undefined
    })
  })

  describe('activeParentSchema', () => {
    let originalActiveNode, originalElementList
    beforeEach(() => {
      originalActiveNode = HAXStore.activeNode
      originalElementList = HAXStore.elementList
      HAXStore.elementList = {
        'parent-el': { gizmo: { tag: 'parent-el', title: 'Parent' } },
      }
    })
    afterEach(() => {
      HAXStore.activeNode = originalActiveNode
      HAXStore.elementList = originalElementList
    })

    it('returns schema for parent of activeNode', () => {
      const parent = globalThis.document.createElement('parent-el')
      const child = globalThis.document.createElement('p')
      parent.appendChild(child)
      globalThis.document.body.appendChild(parent)
      HAXStore.activeNode = child
      const schema = HAXStore.activeParentSchema()
      expect(schema.gizmo.tag).to.equal('parent-el')
      parent.remove()
    })

    it('returns undefined when no activeNode', () => {
      HAXStore.activeNode = null
      expect(HAXStore.activeParentSchema()).to.be.undefined
    })

    it('returns undefined when activeNode has no parentNode', () => {
      HAXStore.activeNode = globalThis.document.createElement('p')
      expect(HAXStore.activeParentSchema()).to.be.undefined
    })
  })

  describe('schemaBySlotId', () => {
    let originalElementList
    beforeEach(() => {
      originalElementList = HAXStore.elementList
      HAXStore.elementList = {
        'test-el': {
          gizmo: { tag: 'test-el' },
          settings: {
            configure: [
              { slot: 'col-1', title: 'Column 1' },
              { slot: 'col-2', title: 'Column 2' },
            ],
          },
        },
      }
    })
    afterEach(() => {
      HAXStore.elementList = originalElementList
    })

    it('returns schema for a specific slot', () => {
      const node = globalThis.document.createElement('test-el')
      const slotSchema = HAXStore.schemaBySlotId(node, 'col-1')
      expect(slotSchema).to.exist
      expect(slotSchema.label).to.equal('Column 1')
    })

    it('returns undefined for nonexistent slot', () => {
      const node = globalThis.document.createElement('test-el')
      expect(HAXStore.schemaBySlotId(node, 'nonexistent')).to.be.undefined
    })
  })

  describe('slottedContentByNode', () => {
    let originalElementList
    beforeEach(() => {
      originalElementList = HAXStore.elementList
      HAXStore.elementList = {
        'test-el': {
          gizmo: { tag: 'test-el' },
          settings: {
            configure: [
              { slot: 'content', title: 'Content' },
            ],
          },
        },
      }
    })
    afterEach(() => {
      HAXStore.elementList = originalElementList
    })

    it('returns slots with items', () => {
      const node = globalThis.document.createElement('test-el')
      const child = globalThis.document.createElement('p')
      child.setAttribute('slot', 'content')
      node.appendChild(child)
      const result = HAXStore.slottedContentByNode(node)
      expect(result['content']).to.exist
      expect(result['content'].items).to.exist
      expect(result['content'].items.length).to.equal(1)
    })

    it('returns empty slots for null node', () => {
      expect(HAXStore.slottedContentByNode(null)).to.deep.equal({})
    })
  })

  describe('getHaxAppStoreTargets', () => {
    let originalAppList
    beforeEach(() => {
      originalAppList = HAXStore.appList
      HAXStore.appList = [
        {
          connection: {
            operations: {
              add: { acceptsGizmoTypes: ['image', 'video'] },
            },
          },
        },
        {
          connection: {
            operations: {
              add: { acceptsGizmoTypes: ['audio'] },
            },
          },
        },
        {
          connection: {
            operations: {},
          },
        },
      ]
    })
    afterEach(() => {
      HAXStore.appList = originalAppList
    })

    it('filters apps that accept the given type', () => {
      const targets = HAXStore.getHaxAppStoreTargets('image')
      expect(targets.length).to.equal(1)
    })

    it('returns empty for type no app accepts', () => {
      const targets = HAXStore.getHaxAppStoreTargets('pdf')
      expect(targets.length).to.equal(0)
    })
  })

  describe('_calculateActiveGizmo', () => {
    let originalGizmoList
    beforeEach(() => {
      originalGizmoList = HAXStore.gizmoList
      HAXStore.gizmoList = [
        { tag: 'test-el', title: 'Test' },
        { tag: 'other-el', title: 'Other' },
      ]
    })
    afterEach(() => {
      HAXStore.gizmoList = originalGizmoList
    })

    it('returns gizmo matching activeNode tag', () => {
      const node = globalThis.document.createElement('test-el')
      const gizmo = HAXStore._calculateActiveGizmo(node)
      expect(gizmo).to.exist
      expect(gizmo.tag).to.equal('test-el')
    })

    it('returns null for null activeNode', () => {
      expect(HAXStore._calculateActiveGizmo(null)).to.be.null
    })

    it('returns null for node without tagName', () => {
      expect(HAXStore._calculateActiveGizmo({})).to.be.null
    })

    it('returns undefined when no gizmo matches', () => {
      const node = globalThis.document.createElement('nonexistent')
      const gizmo = HAXStore._calculateActiveGizmo(node)
      expect(gizmo).to.be.undefined
    })
  })

  describe('_onBeforeUnload', () => {
    let originalEditMode, originalSkipExitTrap
    beforeEach(() => {
      originalEditMode = HAXStore.editMode
      originalSkipExitTrap = HAXStore.skipExitTrap
    })
    afterEach(() => {
      HAXStore.editMode = originalEditMode
      HAXStore.skipExitTrap = originalSkipExitTrap
    })

    it('returns warning string when in editMode and not skipping exit trap', () => {
      HAXStore.editMode = true
      HAXStore.skipExitTrap = false
      expect(HAXStore._onBeforeUnload({})).to.contain('Are you sure')
    })

    it('returns undefined when not in editMode', () => {
      HAXStore.editMode = false
      expect(HAXStore._onBeforeUnload({})).to.be.undefined
    })

    it('returns undefined when skipExitTrap is true', () => {
      HAXStore.editMode = true
      HAXStore.skipExitTrap = true
      expect(HAXStore._onBeforeUnload({})).to.be.undefined
    })
  })
})
