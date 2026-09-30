import { fixture, expect, html } from '@open-wc/testing'
import '../outline-designer.js'
import { HAXStore } from '@haxtheweb/hax-body/lib/hax-store.js'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'

// behavioral coverage for outline-designer content operations (heading
// promote/demote/move/delete, page breaks, heading renames, content
// prepend), the drag-and-drop lifecycle with drop zones, the preview
// popover, the storeTools import wiring (getSiteItems / getData) and the
// updated() branches (fidelity, activePreview).
function makeItems() {
  return [
    {
      id: 'p1',
      title: 'Page One',
      slug: 'page-one',
      location: 'pages/page-one/index.html',
      order: 0,
      parent: null,
      indent: 0,
      contents: '<h2 id="first">Heading one</h2><p id="second">Para one</p>',
      metadata: { locked: false, published: true },
    },
    {
      id: 'c1',
      title: 'Child One',
      slug: 'child-one',
      location: 'pages/child-one/index.html',
      order: 0,
      parent: 'p1',
      indent: 1,
      contents: '<h3>Child heading</h3><p>Child para</p>',
      metadata: { locked: false },
    },
    {
      id: 'p2',
      title: 'Page Two',
      slug: 'page-two',
      location: 'pages/page-two/index.html',
      order: 1,
      parent: null,
      indent: 0,
      contents: '<p>Two</p>',
      metadata: { locked: false },
    },
    {
      id: 'p3',
      title: 'Locked Page',
      slug: 'locked',
      location: 'pages/locked/index.html',
      order: 2,
      parent: null,
      indent: 0,
      contents: '<p>Locked</p>',
      metadata: { locked: true },
    },
  ]
}

const settle = async (element) => {
  await element.updateComplete
  await new Promise((resolve) => setTimeout(resolve, 60))
  await element.updateComplete
}

const pageLi = (element, id) =>
  element.shadowRoot.querySelector(`li[data-item-id="${id}"]`)

const contentLi = (element, itemId, nodeIndex) =>
  element.shadowRoot.querySelector(
    `li[data-content-parent-id="${itemId}"][data-node-index="${nodeIndex}"]`,
  )

const fakeEventFrom = (target) => ({
  target,
  preventDefault() {},
  stopPropagation() {},
  stopImmediatePropagation() {},
})

describe('outline-designer content operations', () => {
  let element
  let savedHaxSchemaFromTag

  before(() => {
    // give every content node a schema so renderNodeAsItem resolves icons
    savedHaxSchemaFromTag = HAXStore.haxSchemaFromTag
    HAXStore.haxSchemaFromTag = () => ({
      gizmo: { icon: 'icons:code', title: 'Text block' },
    })
  })

  after(() => {
    delete HAXStore.haxSchemaFromTag
    HAXStore.haxSchemaFromTag = savedHaxSchemaFromTag
  })

  beforeEach(async () => {
    element = await fixture(html`<outline-designer></outline-designer>`)
    element.items = makeItems()
    await settle(element)
    // reveal contents of p1 for the content node tests (direct item
    // mutations are not reactive on their own, so force the update)
    element.items.find((i) => i.id === 'p1').showContent = true
    await element.requestUpdate()
    await new Promise((resolve) => setTimeout(resolve, 20))
  })

  it('renders content nodes as children with heading semantics', () => {
    const heading = contentLi(element, 'p1', 0)
    const para = contentLi(element, 'p1', 1)
    expect(heading === null).to.equal(false)
    expect(heading.classList.contains('content-heading')).to.equal(true)
    expect(
      heading.querySelector('.label.shown').textContent.trim(),
    ).to.equal('Heading one')
    expect(para.classList.contains('content-non-heading')).to.equal(true)
    expect(para.querySelector('.label.shown').textContent.trim()).to.equal(
      'Text block',
    )
    // heading operations are hidden (not removed) on non-heading nodes
    expect(
      para.querySelector('[title="Increase heading"]').hasAttribute('hidden'),
    ).to.equal(true)
    expect(
      heading.querySelector('[title="Increase heading"]').hasAttribute(
        'hidden',
      ),
    ).to.equal(false)
    // the operations row renders for the page
    expect(
      element.shadowRoot.querySelector('[data-item-for-content-id="p1"]') ===
        null,
    ).to.equal(false)
  })

  it('moves content nodes up and down', async () => {
    const page = element.items.find((i) => i.id === 'p1')
    const para = contentLi(element, 'p1', 1)
    element.modifyContentAction(fakeEventFrom(para), page, 'up')
    await settle(element)
    const p1 = element.items.find((i) => i.id === 'p1')
    expect(p1.contents.startsWith('<p id="second">')).to.equal(true)
    expect(p1.contents.endsWith('</h2>')).to.equal(true)
    // and back down (the para is now the first node)
    const movedPara = contentLi(element, 'p1', 0)
    element.modifyContentAction(fakeEventFrom(movedPara), page, 'down')
    await settle(element)
    const p1After = element.items.find((i) => i.id === 'p1')
    expect(p1After.contents.startsWith('<h2')).to.equal(true)
    // moving the first node up and last node down are no-ops
    const first = contentLi(element, 'p1', 0)
    element.modifyContentAction(fakeEventFrom(first), page, 'up')
    const last = contentLi(element, 'p1', 1)
    element.modifyContentAction(fakeEventFrom(last), page, 'down')
    await settle(element)
    expect(element.items.find((i) => i.id === 'p1').contents).to.equal(
      '<h2 id="first">Heading one</h2><p id="second">Para one</p>',
    )
  })

  it('promotes and demotes headings between levels', async () => {
    const page = element.items.find((i) => i.id === 'p1')
    const heading = contentLi(element, 'p1', 0)
    element.modifyContentAction(fakeEventFrom(heading), page, 'in')
    await settle(element)
    // NOTE: the level change rebuilds the heading element from its text
    // only, so any attributes on the original heading (like the id) are
    // dropped in the process (see the data-loss note in the report)
    expect(element.items.find((i) => i.id === 'p1').contents).to.include(
      '<h1>Heading one</h1>',
    )
    // back out to h2 and further out to h3
    const h1 = contentLi(element, 'p1', 0)
    element.modifyContentAction(fakeEventFrom(h1), page, 'out')
    await settle(element)
    const h2 = contentLi(element, 'p1', 0)
    element.modifyContentAction(fakeEventFrom(h2), page, 'out')
    await settle(element)
    expect(element.items.find((i) => i.id === 'p1').contents).to.include(
      '<h3>Heading one</h3>',
    )
  })

  it('blocks heading promotion at h1 and demotion at h6', async () => {
    const page = element.items.find((i) => i.id === 'p1')
    page.contents = '<h1>Top</h1><h6>Bottom</h6>'
    await element.requestUpdate()
    await new Promise((resolve) => setTimeout(resolve, 20))
    const h1 = contentLi(element, 'p1', 0)
    element.modifyContentAction(fakeEventFrom(h1), page, 'in')
    await settle(element)
    const h6 = contentLi(element, 'p1', 1)
    element.modifyContentAction(fakeEventFrom(h6), page, 'out')
    await settle(element)
    const after = element.items.find((i) => i.id === 'p1')
    expect(after.contents).to.include('<h1>Top</h1>')
    expect(after.contents).to.include('<h6>Bottom</h6>')
  })

  it('deletes a content node', async () => {
    const page = element.items.find((i) => i.id === 'p1')
    const para = contentLi(element, 'p1', 1)
    element.modifyContentAction(fakeEventFrom(para), page, 'delete')
    // set synchronously by the delete branch before the sync timers run
    expect(element.getAttribute('stop-animation')).to.equal('true')
    await settle(element)
    expect(element.items.find((i) => i.id === 'p1').contents).to.not.include(
      'Para one',
    )
  })

  it('splits a page at a heading into a new page', async () => {
    const p1 = element.items.find((i) => i.id === 'p1')
    p1.contents = '<h2>First section</h2><p>Old content</p><h2>Second</h2><p>New content</p>'
    await element.requestUpdate()
    await new Promise((resolve) => setTimeout(resolve, 20))
    const secondHeading = contentLi(element, 'p1', 2)
    const before = element.items.length
    element.pageBreakHere(fakeEventFrom(secondHeading), p1)
    await settle(element)
    expect(element.items.length).to.equal(before + 1)
    // the original page keeps everything above the split
    expect(element.items.find((i) => i.id === 'p1').contents).to.not.include(
      'New content',
    )
    expect(element.items.find((i) => i.id === 'p1').modified).to.equal(true)
    // the new page starts at the split heading
    const newPage = element.items.find(
      (i) => i.new === true && i.title === 'Second',
    )
    expect(newPage === undefined).to.equal(false)
    expect(newPage.parent).to.equal(null)
    expect(newPage.metadata.locked).to.equal(false)
  })

  it('renames a heading from its inline label', async () => {
    const heading = contentLi(element, 'p1', 0)
    const label = heading.querySelector('.label.shown')
    element.editTitle({ target: label })
    const labelEdit = heading.querySelector('.label-edit')
    // write via textContent (uncommitted innerText edits are discarded
    // when the contenteditable attribute is removed)
    labelEdit.textContent = 'Renamed heading'
    element.monitorHeading({ key: 'Enter', target: labelEdit })
    await settle(element)
    expect(element.items.find((i) => i.id === 'p1').contents).to.include(
      'Renamed heading',
    )
    expect(element.items.find((i) => i.id === 'p1').contents).to.not.include(
      'Heading one',
    )
  })

  it('previews a content node in the popover and resets it', async () => {
    const para = contentLi(element, 'p1', 1)
    element.setActivePreview(fakeEventFrom(para))
    const popover = element.shadowRoot.querySelector('simple-popover')
    expect(popover.hasAttribute('hidden')).to.equal(false)
    expect(element.activePreview === para).to.equal(true)
    expect(element.activePreviewIndex).to.equal(1)
    expect(popover.target === para).to.equal(true)
    await settle(element)
    // the preview renders the node markup into the popover
    expect(popover.querySelector('p') === null).to.equal(false)
    expect(
      element.activePreview.classList.contains('active-preview-item'),
    ).to.equal(true)
    // reset hides it again
    element.resetPopOver()
    expect(popover.hasAttribute('hidden')).to.equal(true)
    expect(element.activePreview).to.equal(null)
    expect(element.activePreviewIndex).to.equal(-1)
  })

  it('returns nothing for empty or unindexed preview targets', () => {
    const ghost = globalThis.document.createElement('div')
    ghost.setAttribute('data-content-parent-id', 'does-not-exist')
    expect(element.renderActiveContentItem(null, 0) === undefined).to.equal(
      true,
    )
    expect(element.renderActiveContentItem(ghost, -1) === undefined).to.equal(
      true,
    )
  })

  it('BUG renderActiveContentItem crashes on a stale preview target', () => {
    // outline-designer.js:1153 reads item.contents off the result of
    // items.find() without a guard. A preview node whose parent item is
    // gone (bulk delete never calls resetPopOver, so a stale activePreview
    // can survive into the next render) makes the whole render() throw a
    // TypeError instead of skipping the popover content.
    const ghost = globalThis.document.createElement('div')
    ghost.setAttribute('data-content-parent-id', 'does-not-exist')
    expect(() => element.renderActiveContentItem(ghost, 0)).to.throw(
      TypeError,
      "Cannot read properties of undefined (reading 'contents')",
    )
  })

  it('prepends a gizmo demo schema onto the page contents', async () => {
    HAXStore.haxSchemaFromTag = () => ({
      gizmo: { icon: 'av:av', title: 'Video', tag: 'video-player' },
      demoSchema: [
        {
          tag: 'p',
          content: 'Prepended block',
        },
      ],
    })
    // the operation buttons render from the gizmo list
    element.haxGizmos = [
      { icon: 'av:av', title: 'Video', tag: 'video-player' },
    ]
    await element.requestUpdate()
    await new Promise((resolve) => setTimeout(resolve, 20))
    const opRow = element.shadowRoot.querySelector(
      '[data-item-for-content-id="p1"]',
    )
    const opButton = opRow.querySelector('.operation')
    expect(opButton === null).to.equal(false)
    opButton.value = 'video-player'
    element.prependNodeToContent(fakeEventFrom(opButton))
    await settle(element)
    const p1 = element.items.find((i) => i.id === 'p1')
    expect(p1.contents.startsWith('<p>Prepended block</p>')).to.equal(true)
    expect(p1.contents).to.include('Heading one')
  })

  it('BUG prependNodeToContent crashes on schemas without demoSchema', async () => {
    // outline-designer.js:1595 fallback branch references an undefined
    // `tag` variable instead of the clicked gizmo tag (e.target.value).
    // Any HAX schema without demoSchema[0] hits this ReferenceError, so
    // adding content from such a gizmo throws and the page contents are
    // never updated.
    HAXStore.haxSchemaFromTag = () => ({
      gizmo: { icon: 'av:av', title: 'Video', tag: 'video-player' },
    })
    // the operation buttons render from the gizmo list
    element.haxGizmos = [
      { icon: 'av:av', title: 'Video', tag: 'video-player' },
    ]
    await element.requestUpdate()
    await new Promise((resolve) => setTimeout(resolve, 20))
    const opRow = element.shadowRoot.querySelector(
      '[data-item-for-content-id="p1"]',
    )
    const opButton = opRow.querySelector('.operation')
    opButton.value = 'video-player'
    const contentsBefore = element.items.find((i) => i.id === 'p1').contents
    expect(() =>
      element.prependNodeToContent(fakeEventFrom(opButton)),
    ).to.throw(ReferenceError, 'tag is not defined')
    expect(element.items.find((i) => i.id === 'p1').contents).to.equal(
      contentsBefore,
    )
  })

  it('skips content actions on locked pages', async () => {
    const lockedItem = element.items.find((i) => i.id === 'p3')
    lockedItem.showContent = true
    await element.requestUpdate()
    await new Promise((resolve) => setTimeout(resolve, 20))
    const lockedNode = contentLi(element, 'p3', 0)
    element.modifyContentAction(fakeEventFrom(lockedNode), lockedItem, 'up')
    await settle(element)
    expect(lockedItem.contents).to.equal('<p>Locked</p>')
    element.pageBreakHere(fakeEventFrom(lockedNode), lockedItem)
    await settle(element)
    expect(element.items.length).to.equal(4)
  })
})

describe('outline-designer drag lifecycle', () => {
  let element
  let savedHaxSchemaFromTag

  before(() => {
    savedHaxSchemaFromTag = HAXStore.haxSchemaFromTag
    HAXStore.haxSchemaFromTag = () => ({
      gizmo: { icon: 'icons:code', title: 'Text block' },
    })
  })

  after(() => {
    delete HAXStore.haxSchemaFromTag
    HAXStore.haxSchemaFromTag = savedHaxSchemaFromTag
  })

  beforeEach(async () => {
    element = await fixture(html`<outline-designer></outline-designer>`)
    element.items = makeItems()
    await settle(element)
  })

  const dropEvent = (li, vertical, horizontal = 10) => {
    const rect = li.getBoundingClientRect()
    return {
      target: li,
      currentTarget: li,
      clientX: rect.left + horizontal,
      clientY: rect.top + rect.height * vertical,
      preventDefault() {},
    }
  }

  it('counts descendants for drag previews', () => {
    expect(element._countAllDescendants('p1')).to.equal(1)
    expect(element._countAllDescendants('p2')).to.equal(0)
  })

  it('resolves drop targets from a point', () => {
    const p2 = pageLi(element, 'p2')
    const rect = p2.getBoundingClientRect()
    const found = element._targetFromPoint(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
    )
    expect(found === null).to.equal(false)
    expect(found.getAttribute('data-item-id')).to.equal('p2')
    // off-canvas points resolve to nothing
    expect(element._targetFromPoint(-10, -10)).to.equal(null)
  })

  it('creates an accessible drag preview clone', () => {
    const p1 = pageLi(element, 'p1')
    const preview = element._createDragPreview(p1)
    expect(preview === null).to.equal(false)
    expect(preview.classList.contains('drag-preview')).to.equal(true)
    expect(preview.getAttribute('aria-hidden')).to.equal('true')
    expect(preview.hasAttribute('inert')).to.equal(true)
    // the context menu is not cloned into the preview
    expect(preview.querySelector('simple-context-menu') === null).to.equal(
      true,
    )
    // parents get a has-children flag on the preview
    expect(preview.classList.contains('has-children')).to.equal(true)
    expect(element._createDragPreview(pageLi(element, 'p2')).classList.contains('has-children')).to.equal(
      false,
    )
  })

  it('starts a drag with a custom preview and collapses kids', async () => {
    const p1 = pageLi(element, 'p1')
    const handle = p1.querySelector('[data-drag-handle-id]')
    const setDragImageCalls = []
    const evt = {
      target: handle,
      dataTransfer: {
        effectAllowed: '',
        dropEffect: '',
        setDragImage: (...args) => setDragImageCalls.push(args),
      },
      stopPropagation() {},
      stopImmediatePropagation() {},
    }
    element._dragStart(evt)
    expect(element._targetDrag === p1).to.equal(true)
    expect(p1.getAttribute('data-dragging')).to.equal('true')
    expect(element._dragPreviewElement === null).to.equal(false)
    expect(
      element._dragPreviewElement.classList.contains('drag-preview'),
    ).to.equal(true)
    expect(setDragImageCalls.length).to.equal(1)
    // the dragged parent collapses while dragging (collapse state is
    // tracked on the parent item, not the children)
    await settle(element)
    expect(element.items.find((i) => i.id === 'p1').collapsed).to.equal(true)
    expect(pageLi(element, 'c1') === null).to.equal(true)
    element._dragEnd({})
    await settle(element)
    // drag state resets after the drop
    expect(element._targetDrag).to.equal(null)
    expect(element._dragPreviewElement).to.equal(null)
    expect(element.shadowRoot.querySelector('.drag-preview') === null).to.equal(
      true,
    )
    expect(p1.hasAttribute('data-dragging')).to.equal(false)
  })

  it('paints above / below / child drop zones while dragging', async () => {
    const p1 = pageLi(element, 'p1')
    const p2 = pageLi(element, 'p2')
    element._targetDrag = p1
    // top 30% without indent offset = above
    element._dragEnter(dropEvent(p2, 0.1))
    expect(
      element.shadowRoot.querySelector('.drop-indicator.drop-above') === null,
    ).to.equal(false)
    expect(p2.classList.contains('drop-above-target')).to.equal(true)
    expect(element.liveRegionText).to.equal('Drop above Page Two')
    // bottom 30% without indent offset = below
    element._dragEnter(dropEvent(p2, 0.9))
    expect(
      element.shadowRoot.querySelector('.drop-indicator.drop-below') === null,
    ).to.equal(false)
    expect(p2.classList.contains('drop-below-target')).to.equal(true)
    expect(element.liveRegionText).to.equal('Drop below Page Two')
    // middle band, or past the 40px indent threshold, = child
    element._dragEnter(dropEvent(p2, 0.5))
    expect(p2.classList.contains('drop-target-child')).to.equal(true)
    expect(element.liveRegionText).to.equal('Drop as child of Page Two')
    // repeated identical zones do not duplicate indicators
    const indicators = element.shadowRoot.querySelectorAll('.drop-indicator')
    element._dragEnter(dropEvent(p2, 0.5))
    expect(
      element.shadowRoot.querySelectorAll('.drop-indicator').length,
    ).to.equal(indicators.length)
    // far left offsets always mean child
    element._dragEnter(dropEvent(p2, 0.1, 60))
    expect(p2.classList.contains('drop-target-child')).to.equal(true)
    element._dragEnd({})
    await settle(element)
    expect(element.shadowRoot.querySelector('.drop-indicator') === null).to.equal(
      true,
    )
  })

  it('skips drag feedback without an active drag', () => {
    const p2 = pageLi(element, 'p2')
    element._targetDrag = null
    element._dragEnter(dropEvent(p2, 0.1))
    expect(
      element.shadowRoot.querySelector('.drop-indicator') === null,
    ).to.equal(true)
    // dropping on yourself is a no-op
    element._targetDrag = p2
    element._dragEnter(dropEvent(p2, 0.1))
    expect(
      element.shadowRoot.querySelector('.drop-indicator') === null,
    ).to.equal(true)
  })

  it('keeps updating zones through the drag event stream', () => {
    const p1 = pageLi(element, 'p1')
    const p2 = pageLi(element, 'p2')
    element._targetDrag = p1
    element._onDrag(dropEvent(p2, 0.1))
    expect(
      element.shadowRoot.querySelector('.drop-indicator.drop-above') === null,
    ).to.equal(false)
  })

  it('applies an above drop on drag end', async () => {
    const p1 = pageLi(element, 'p1')
    const p2 = pageLi(element, 'p2')
    element._targetDrag = p2
    element._targetDrop = p1
    element._dropZone = 'above'
    element._dragEnd({})
    await settle(element)
    const moved = element.items.find((i) => i.id === 'p2')
    expect(moved.parent).to.equal(null)
    expect(moved.modified).to.equal(true)
    // p2 landed above p1 in the top level
    expect(element.items.findIndex((i) => i.id === 'p2')).to.equal(0)
  })

  it('applies a below drop and a child drop on drag end', async () => {
    const p1 = pageLi(element, 'p1')
    const p2 = pageLi(element, 'p2')
    element._targetDrag = p2
    element._targetDrop = p1
    element._dropZone = 'below'
    element._dragEnd({})
    await settle(element)
    const moved = element.items.find((i) => i.id === 'p2')
    expect(moved.parent).to.equal(null)
    // below-drop lands p2 directly after p1's subtree (p1, c1, p2, p3)
    expect(element.items.findIndex((i) => i.id === 'p2')).to.equal(2)
    // child drop re-parents under the target
    const p1Again = pageLi(element, 'p1')
    const p2Again = pageLi(element, 'p2')
    element._targetDrag = p2Again
    element._targetDrop = p1Again
    element._dropZone = 'child'
    element._dragEnd({})
    await settle(element)
    const childDrop = element.items.find((i) => i.id === 'p2')
    expect(childDrop.parent).to.equal('p1')
    expect(childDrop.indent).to.equal(1)
  })

  it('collapses branches from a plain mousedown drag press', async () => {
    const handle = pageLi(element, 'p1').querySelector('[data-drag-handle-id]')
    element._mouseDownDrag(fakeEventFrom(handle))
    await settle(element)
    // collapse state lands on the parent item
    expect(element.items.find((i) => i.id === 'p1').collapsed).to.equal(true)
    expect(pageLi(element, 'c1') === null).to.equal(true)
  })
})

describe('outline-designer store tools', () => {
  let element
  let savedGetManifestItems
  let savedFindItemAsObject

  before(() => {
    savedGetManifestItems = store.getManifestItems
    savedFindItemAsObject = store.findItemAsObject
  })

  after(() => {
    delete store.getManifestItems
    delete store.findItemAsObject
    store.getManifestItems = savedGetManifestItems
    store.findItemAsObject = savedFindItemAsObject
  })

  beforeEach(async () => {
    element = await fixture(html`<outline-designer></outline-designer>`)
    element.items = makeItems()
    await settle(element)
  })

  it('returns only the placeholder target before the app is ready', () => {
    element.appReady = false
    expect(element.getSiteItems()).to.deep.equal([
      { text: 'Select target', value: null },
    ])
  })

  it('builds a depth-prefixed target list from the site manifest', () => {
    element.appReady = true
    store.getManifestItems = () => makeItems()
    const items = element.getSiteItems()
    expect(items.length).to.equal(5)
    expect(items[1].text).to.equal('- Page One')
    expect(items[2].text).to.equal('--- Child One')
    expect(items[3].value).to.equal('p2')
  })

  it('returns the current items from getData without store tools', async () => {
    const data = await element.getData()
    expect(data.items.length).to.equal(4)
    expect(data.items.map((i) => i.id)).to.include('p1')
  })

  it('renders the import controls and re-parents imports on getData', async () => {
    element.appReady = true
    store.getManifestItems = () => makeItems()
    store.findItemAsObject = async () => ({
      id: 'p1',
      parent: null,
      order: 5,
    })
    element.activeId = 'p1'
    element.storeTools = true
    await settle(element)
    // the import controls render with the site tree
    expect(
      element.shadowRoot.querySelector('#targetselector') === null,
    ).to.equal(false)
    expect(
      element.shadowRoot.querySelector('#itemselector') === null,
    ).to.equal(false)
    // import as children of the target page
    element.shadowRoot.querySelector('#itemselector').value = 'p1'
    element.shadowRoot.querySelector('#targetselector').value = 'children'
    const childrenData = await element.getData()
    expect(childrenData.items.find((i) => i.id === 'p1').parent).to.equal('p1')
    // the children branch re-parents the shared item objects themselves,
    // so restore top-level parents before exercising the other branches
    ;['p1', 'p2', 'p3'].forEach((id) => {
      element.items.find((i) => i.id === id).parent = null
    })
    // import below the target page
    element.shadowRoot.querySelector('#targetselector').value = 'below'
    const belowData = await element.getData()
    // BUG: getData (outline-designer.js:2836-2857) increments count inside
    // an async map callback but reads it AFTER `await store
    // .findItemAsObject()`, so by the time each order is computed the shared
    // counter has already finished all of its increments. Every imported
    // top-level item gets the same sibling order (parent.order + total
    // count) instead of sequential orders, so multi-item imports collapse
    // into one sibling slot. The assertions document the current values:
    // they should become 6 / 7 / 8 once the count is captured per item.
    expect(belowData.items.find((i) => i.id === 'p1').order).to.equal(8)
    expect(belowData.items.find((i) => i.id === 'p2').order).to.equal(8)
    expect(belowData.items.find((i) => i.id === 'p3').order).to.equal(8)
    // import above the target page
    element.shadowRoot.querySelector('#targetselector').value = 'above'
    const aboveData = await element.getData()
    expect(aboveData.items.find((i) => i.id === 'p1').order).to.equal(2)
    expect(aboveData.items.find((i) => i.id === 'p2').order).to.equal(2)
    expect(aboveData.items.find((i) => i.id === 'p3').order).to.equal(2)
  })
})

describe('outline-designer updated branches', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`<outline-designer></outline-designer>`)
    element.items = makeItems()
    await settle(element)
  })

  it('handles all fidelity settings', async () => {
    element.fidelity = 'low'
    await element.updateComplete
    expect(element.fidelity).to.equal('low')
    element.fidelity = 'medium'
    await element.updateComplete
    expect(element.fidelity).to.equal('medium')
    element.fidelity = 'high'
    await element.updateComplete
    expect(element.fidelity).to.equal('high')
  })

  it('moves the active-preview highlight between nodes', async () => {
    const first = pageLi(element, 'p1')
    const second = pageLi(element, 'p2')
    element.activePreview = first
    await element.updateComplete
    expect(first.classList.contains('active-preview-item')).to.equal(true)
    element.activePreview = second
    await element.updateComplete
    expect(first.classList.contains('active-preview-item')).to.equal(false)
    expect(second.classList.contains('active-preview-item')).to.equal(true)
  })

  it('toggles the actions menu open and closed', async () => {
    const li = pageLi(element, 'p1')
    const menuButton = li.querySelector('.actions-menu-button')
    element._toggleActionsMenu(fakeEventFrom(menuButton), 0)
    const menu = li.querySelector('.actions-menu')
    expect(menu.open).to.equal(true)
    // an action through the menu closes it again
    const menuAction = li.querySelector(
      'simple-toolbar-button[value="edit-title"]',
    )
    element._handleMenuAction(fakeEventFrom(menuAction), 0, 'edit-title')
    expect(menu.open).to.equal(false)
    // the edit title action armed the inline title editor
    expect(
      li.querySelector('.label-edit').getAttribute('contenteditable'),
    ).to.equal('true')
    // a plain operation routes through itemOp
    const upAction = li.querySelector('simple-toolbar-button[value="up"]')
    const before = element.items.findIndex((i) => i.id === 'p1')
    element._handleMenuAction(fakeEventFrom(upAction), before, 'up')
    await settle(element)
    expect(element.items.findIndex((i) => i.id === 'p1')).to.equal(0)
    // edit-title on a locked item does nothing
    const lockedLi = pageLi(element, 'p3')
    const lockedButton = lockedLi.querySelector('.actions-menu-button')
    element._toggleActionsMenu(fakeEventFrom(lockedButton), 3)
    const lockedLabel = lockedLi.querySelector('.label-edit')
    element._handleMenuAction(fakeEventFrom(lockedButton), 3, 'edit-title')
    expect(lockedLabel.getAttribute('contenteditable') === null).to.equal(true)
  })
})
