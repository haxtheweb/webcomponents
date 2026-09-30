import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import '../page-break.js'
// pre-load the dynamically imported editing UI so menu buttons upgrade
import '@haxtheweb/simple-toolbar/lib/simple-toolbar-button.js'
import '@haxtheweb/simple-fields/lib/simple-context-menu.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

describe('page-break editor actions', () => {
  let savedManifest
  let savedActiveId
  let savedCmsSiteEditor
  let savedHaxcms
  let savedSuperDaemon
  let toasts
  let sounds
  let editorCalls
  let daemonCalls
  let daemon

  beforeEach(() => {
    savedManifest = store.manifest
    savedActiveId = store.activeId
    savedCmsSiteEditor = store.cmsSiteEditor
    savedHaxcms = globalThis.HAXCMS
    savedSuperDaemon = globalThis.SuperDaemonManager
    toasts = []
    sounds = []
    editorCalls = []
    daemonCalls = []
    store.toast = (msg) => {
      toasts.push(msg)
    }
    store.playSound = (sound) => {
      sounds.push(sound)
    }
    store.manifest = {
      items: [
        {
          id: 'item-1',
          title: 'Active page',
          slug: 'active',
          parent: null,
          metadata: { tags: 'alpha, beta' },
        },
      ],
    }
    store.activeId = 'item-1'
    store.cmsSiteEditor = {
      haxCmsSiteEditorUIElement: {
        _editButtonTap: (...args) => {
          editorCalls.push(['edit', args])
        },
        _cancelButtonTap: (...args) => {
          editorCalls.push(['cancel', args])
        },
        _deleteButtonTap: (...args) => {
          editorCalls.push(['delete', args])
        },
        _reportsButtonTap: (...args) => {
          editorCalls.push(['reports', args])
        },
      },
    }
    daemon = {
      close: () => {
        daemonCalls.push(['close'])
      },
      waveWand: (args) => {
        daemonCalls.push(['waveWand', args])
      },
      allItems: [
        {
          path: 'CMS/admin/reports',
          eventName: 'super-daemon-element-method',
          value: {
            target: 'reports-panel',
            method: 'openReports',
            args: ['a', 'b', { existing: true }],
          },
        },
      ],
    }
    globalThis.SuperDaemonManager = {
      requestAvailability: () => daemon,
    }
  })
  afterEach(() => {
    store.manifest = savedManifest
    store.activeId = savedActiveId
    store.cmsSiteEditor = savedCmsSiteEditor
    globalThis.HAXCMS = savedHaxcms
    globalThis.SuperDaemonManager = savedSuperDaemon
    delete store.toast
    delete store.playSound
    delete store.platformAllows
  })

  const makeLoggedInBreak = async (extra = '') => {
    const el = await fixture(
      html`<page-break title="Actions ${extra}"></page-break>`,
    )
    el.isLoggedIn = true
    await el.updateComplete
    await wait(150)
    return el
  }

  it('toggles the context menu from the actions button', async () => {
    const el = await makeLoggedInBreak('menu')
    const menu = el.shadowRoot.querySelector('#menu')
    expect(menu === null).to.equal(false)
    const toggled = []
    const anchor = {}
    menu.toggle = (a) => {
      toggled.push(a)
    }
    el._toggleMenu({ stopPropagation: () => {}, target: anchor })
    expect(toggled.length).to.equal(1)
    expect(toggled[0] === anchor).to.equal(true)
    // a missing menu is a no-op
    const bare = await fixture(html`<page-break title="No menu"></page-break>`)
    bare._toggleMenu({ stopPropagation: () => {}, target: null })
    expect(bare.shadowRoot.querySelector('#menu')).to.equal(null)
  })

  it('closes the menu and taps the edit button', async () => {
    const el = await makeLoggedInBreak('edit')
    const menu = el.shadowRoot.querySelector('#menu')
    const closed = []
    menu.close = () => {
      closed.push(true)
    }
    el._editPage({})
    expect(closed.length).to.equal(1)
    expect(editorCalls.length).to.equal(1)
    expect(editorCalls[0][0]).to.equal('edit')
  })

  it('blocks editing while locked with a toast and error sound', async () => {
    const el = await makeLoggedInBreak('locked-edit')
    el.locked = true
    await el.updateComplete
    el._editPage({})
    expect(editorCalls.length).to.equal(0)
    expect(toasts[0]).to.equal('This page is locked. Unlock it first to edit.')
    expect(sounds).to.deep.equal(['error'])
  })

  it('delegates cancel to the editor UI', async () => {
    const el = await fixture(html`<page-break title="Cancel"></page-break>`)
    const evt = { fake: 'event' }
    el._cancelEdit(evt)
    expect(editorCalls.length).to.equal(1)
    expect(editorCalls[0][0]).to.equal('cancel')
    expect(editorCalls[0][1][0] === evt).to.equal(true)
  })

  it('launches the edit title daemon program', async () => {
    const el = await fixture(html`<page-break title="Edit title"></page-break>`)
    el._editTitle({})
    const wand = daemonCalls.find((call) => call[0] === 'waveWand')
    expect(wand === undefined).to.equal(false)
    expect(wand[1][0]).to.equal('')
    expect(wand[1][1]).to.equal('/')
    expect(wand[1][3]).to.equal('edit-title')
    expect(wand[1][4]).to.equal('Edit title')
    expect(sounds).to.deep.equal(['click'])
  })

  it('warns and bails from edit title without an active item', async () => {
    const savedActive = store.activeId
    store.activeId = 'missing'
    const el = await fixture(html`<page-break title="No item"></page-break>`)
    el._editTitle({})
    expect(daemonCalls.length).to.equal(0)
    expect(sounds.length).to.equal(0)
    store.activeId = savedActive
  })

  it('errors and bails from edit title without the super daemon', async () => {
    delete globalThis.SuperDaemonManager
    const el = await fixture(html`<page-break title="No daemon"></page-break>`)
    el._editTitle({})
    expect(daemonCalls.length).to.equal(0)
    expect(sounds.length).to.equal(0)
  })

  it('launches the edit icon program after closing the daemon', async () => {
    const el = await fixture(html`<page-break title="Edit icon"></page-break>`)
    el._editIcon({})
    expect(daemonCalls[0][0]).to.equal('close')
    const wand = daemonCalls.find((call) => call[0] === 'waveWand')
    expect(wand === undefined).to.equal(false)
    expect(wand[1][3]).to.equal('edit-icon')
    expect(wand[1][4]).to.equal('Edit Icon')
    expect(sounds).to.deep.equal(['click'])
  })

  it('bails from edit icon without an active item', async () => {
    const savedActive = store.activeId
    store.activeId = 'missing'
    const el = await fixture(html`<page-break title="No icon"></page-break>`)
    el._editIcon({})
    expect(daemonCalls.length).to.equal(0)
    store.activeId = savedActive
  })

  it('launches the media agent program', async () => {
    const el = await fixture(html`<page-break title="Edit media"></page-break>`)
    el._editMedia({})
    const wand = daemonCalls.find((call) => call[0] === 'waveWand')
    expect(wand === undefined).to.equal(false)
    expect(wand[1][3]).to.equal('hax-agent')
    expect(wand[1][4]).to.equal('Agent')
    expect(sounds).to.deep.equal(['click'])
  })

  it('launches the edit tags program and restores tags on escape', async () => {
    const el = await fixture(html`<page-break title="Edit tags"></page-break>`)
    el._editTags({})
    const wand = daemonCalls.find((call) => call[0] === 'waveWand')
    expect(wand === undefined).to.equal(false)
    expect(wand[1][0]).to.equal('alpha, beta')
    expect(wand[1][3]).to.equal('edit-tags')
    expect(wand[1][4]).to.equal('Edit tags')
    expect(el._originalTags).to.equal('alpha, beta')
    el.tags = 'changed'
    globalThis.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await wait(20)
    expect(el.tags).to.equal('alpha, beta')
  })

  it('dispatches page revisions with node details', async () => {
    const el = await fixture(
      html`<page-break item-id="item-7" title="Revisions"></page-break>`,
    )
    const seen = []
    const handler = (e) => {
      seen.push(e.detail)
    }
    globalThis.addEventListener('haxcms-open-page-revisions', handler)
    el._openRevisions({})
    globalThis.removeEventListener('haxcms-open-page-revisions', handler)
    expect(seen.length).to.equal(1)
    expect(seen[0].nodeId).to.equal('item-7')
    expect(seen[0].nodeTitle).to.equal('Revisions')
    expect(seen[0].source).to.equal('page-break')
    expect(sounds).to.deep.equal(['click'])
  })

  it('uses the active item id for revisions when the break has none', async () => {
    const el = await fixture(html`<page-break title="Fallback"></page-break>`)
    const seen = []
    const handler = (e) => {
      seen.push(e.detail)
    }
    globalThis.addEventListener('haxcms-open-page-revisions', handler)
    el._openRevisions({})
    globalThis.removeEventListener('haxcms-open-page-revisions', handler)
    expect(seen.length).to.equal(1)
    expect(seen[0].nodeId).to.equal('item-1')
  })

  it('skips revisions dispatch when no node id can be resolved', async () => {
    store.activeId = 'missing'
    const el = await fixture(html`<page-break title="No node"></page-break>`)
    let fired = 0
    const handler = () => {
      fired++
    }
    globalThis.addEventListener('haxcms-open-page-revisions', handler)
    el._openRevisions({})
    globalThis.removeEventListener('haxcms-open-page-revisions', handler)
    expect(fired).to.equal(0)
    expect(sounds.length).to.equal(0)
  })

  it('dispatches save node details to toggle the lock', async () => {
    const el = await fixture(html`<page-break title="Lock"></page-break>`)
    const seen = []
    const handler = (e) => {
      seen.push(e.detail)
    }
    globalThis.addEventListener('haxcms-save-node-details', handler)
    el._toggleLocked({})
    el.locked = true
    el._toggleLocked({})
    globalThis.removeEventListener('haxcms-save-node-details', handler)
    expect(seen.length).to.equal(2)
    expect(seen[0].operation).to.equal('setLocked')
    expect(seen[0].locked).to.equal(true)
    expect(seen[0].id).to.equal('item-1')
    expect(seen[0].idOrSlug).to.equal('item-1')
    expect(seen[1].locked).to.equal(false)
    expect(sounds).to.deep.equal(['click', 'click'])
  })

  it('dispatches save node details to toggle publish state', async () => {
    const el = await fixture(html`<page-break title="Publish"></page-break>`)
    const seen = []
    const handler = (e) => {
      seen.push(e.detail)
    }
    globalThis.addEventListener('haxcms-save-node-details', handler)
    el._togglePublished({})
    globalThis.removeEventListener('haxcms-save-node-details', handler)
    expect(seen.length).to.equal(1)
    expect(seen[0].operation).to.equal('setPublished')
    expect(seen[0].published).to.equal(true)
  })

  it('blocks publish toggling while locked', async () => {
    const el = await fixture(
      html`<page-break title="Locked publish"></page-break>`,
    )
    el.locked = true
    await el.updateComplete
    let fired = 0
    const handler = () => {
      fired++
    }
    globalThis.addEventListener('haxcms-save-node-details', handler)
    el._togglePublished({})
    globalThis.removeEventListener('haxcms-save-node-details', handler)
    expect(fired).to.equal(0)
    expect(toasts[0]).to.equal(
      'This page is locked. Unlock it first to change publish status.',
    )
    expect(sounds).to.deep.equal(['error'])
  })

  it('saves through the edit button tap', async () => {
    const el = await fixture(html`<page-break title="Save"></page-break>`)
    await el._savePage({})
    expect(editorCalls.length).to.equal(1)
    expect(editorCalls[0][0]).to.equal('edit')
  })

  it('deletes through the editor UI and blocks deletion while locked', async () => {
    const el = await fixture(html`<page-break title="Delete"></page-break>`)
    el._deletePage({})
    expect(editorCalls.length).to.equal(1)
    expect(editorCalls[0][0]).to.equal('delete')
    el.locked = true
    await el.updateComplete
    el._deletePage({})
    expect(editorCalls.length).to.equal(1)
    expect(toasts[0]).to.equal('This page is locked. Unlock it first to delete.')
    expect(sounds).to.deep.equal(['error'])
  })

  it('returns early from page reports when insights are not allowed', async () => {
    store.platformAllows = (capability) => capability !== 'insights'
    const el = await fixture(
      html`<page-break item-id="item-7" title="Report"></page-break>`,
    )
    el._openPageReport({})
    expect(daemonCalls.length).to.equal(0)
    expect(editorCalls.length).to.equal(0)
  })

  it('requires a node id before opening a page report', async () => {
    store.activeId = 'missing'
    const el = await fixture(html`<page-break title="No id"></page-break>`)
    el._openPageReport({})
    expect(daemonCalls.length).to.equal(0)
    expect(editorCalls.length).to.equal(0)
  })

  it('requires the editor UI reports button before opening a page report', async () => {
    store.cmsSiteEditor = {}
    const el = await fixture(
      html`<page-break item-id="item-9" title="No UI"></page-break>`,
    )
    el._openPageReport({})
    expect(daemonCalls.length).to.equal(0)
    expect(editorCalls.length).to.equal(0)
  })

  it('delegates page reports to the editor UI reports button', async () => {
    daemon.allItems = []
    const el = await fixture(
      html`<page-break item-id="item-7" title="Report"></page-break>`,
    )
    el._openPageReport({ target: 'button' })
    expect(editorCalls.length).to.equal(1)
    expect(editorCalls[0][0]).to.equal('reports')
    expect(editorCalls[0][1][0]).to.equal(null)
    expect(editorCalls[0][1][1]).to.equal(false)
    expect(editorCalls[0][1][2].reportScope).to.equal('page')
    expect(editorCalls[0][1][2].reportNodeId).to.equal('item-7')
    expect(editorCalls[0][1][2].invokedBy).to.equal('button')
  })

  it('routes page reports through the super daemon reports action', async () => {
    const el = await fixture(
      html`<page-break item-id="item-8" title="Report"></page-break>`,
    )
    const seen = []
    const handler = (e) => {
      seen.push(e)
    }
    globalThis.addEventListener('super-daemon-element-method', handler)
    el._openPageReport({ target: 'btn' })
    globalThis.removeEventListener('super-daemon-element-method', handler)
    expect(seen.length).to.equal(1)
    expect(seen[0].detail.target).to.equal('reports-panel')
    expect(seen[0].detail.method).to.equal('openReports')
    const args = seen[0].detail.args
    expect(args[0]).to.equal('a')
    expect(args[1]).to.equal('b')
    // existing route options are preserved and the page scope is added
    expect(args[2].existing).to.equal(true)
    expect(args[2].reportScope).to.equal('page')
    expect(args[2].reportNodeId).to.equal('item-8')
    expect(args[2].invokedBy).to.equal('btn')
    expect(editorCalls.length).to.equal(0)
  })

  it('routes page reports through the daemon without existing route options', async () => {
    daemon.allItems[0].value.args = ['a', 'b']
    const el = await fixture(
      html`<page-break item-id="item-8" title="Report"></page-break>`,
    )
    const seen = []
    const handler = (e) => {
      seen.push(e)
    }
    globalThis.addEventListener('super-daemon-element-method', handler)
    el._openPageReport({})
    globalThis.removeEventListener('super-daemon-element-method', handler)
    expect(seen.length).to.equal(1)
    expect(seen[0].detail.args.length).to.equal(3)
    expect(seen[0].detail.args[2].reportScope).to.equal('page')
    expect(Object.keys(seen[0].detail.args[2]).includes('existing')).to.equal(
      false,
    )
  })
})

describe('page-break hax hooks', () => {
  it('exposes the full set of hax hooks', async () => {
    const el = await fixture(html`<page-break title="Hooks"></page-break>`)
    const hooks = el.haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    expect(hooks.inlineContextMenu).to.equal('haxinlineContextMenu')
    expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
    expect(hooks.setupActiveElementForm).to.equal('haxsetupActiveElementForm')
    expect(hooks.preProcessInsertContent).to.equal('haxpreProcessInsertContent')
    expect(hooks.trayDragNDropToNode).to.equal('haxtrayDragNDropToNode')
  })

  it('mirrors hax edit mode into _haxState', async () => {
    const el = await fixture(html`<page-break title="Mode"></page-break>`)
    el.haxeditModeChanged(true)
    expect(el._haxState).to.equal(true)
    el.haxeditModeChanged(false)
    expect(el._haxState).to.equal(false)
  })

  it('toggles lock and publish from the inline context menu buttons', async () => {
    const el = await fixture(html`<page-break title="Inline"></page-break>`)
    expect(el.haxClickInlineLock()).to.equal(true)
    expect(el.locked).to.equal(true)
    expect(el.haxClickInlinePublished()).to.equal(true)
    expect(el.published).to.equal(true)
    // the in page lock click also refreshes the tray form
    let refreshed = 0
    const handler = () => {
      refreshed++
    }
    globalThis.addEventListener('hax-refresh-tray-form', handler)
    el.haxClickLockInPage()
    globalThis.removeEventListener('hax-refresh-tray-form', handler)
    expect(el.locked).to.equal(false)
    expect(refreshed).to.equal(1)
  })

  it('steals defaults from the associated break when inserting content', async () => {
    const root = await fixture(html`
      <div>
        <hax-body>
          <page-break id="pb-existing" parent="site-root" title="Existing">
          </page-break>
          <h2>Existing section</h2>
          <div id="drop-target">Dropped content</div>
        </hax-body>
      </div>
    `)
    const pb = root.querySelector('#pb-existing')
    pb.order = 5
    pb.published = true
    pb.locked = true
    await wait(50)
    const details = { properties: {} }
    const result = await pb.haxpreProcessInsertContent(
      details,
      root.querySelector('#drop-target'),
    )
    expect(result === details).to.equal(true)
    expect(result.properties.parent).to.equal('site-root')
    expect(result.properties.order).to.equal(6)
    expect(result.properties.published).to.equal(true)
    expect(result.properties.locked).to.equal(true)
  })

  it('applies defaults to a dropped node via the drag and drop hook', async () => {
    const root = await fixture(html`
      <div>
        <hax-body>
          <page-break id="pb-drop" parent="site-root" title="Drop"></page-break>
          <h2>Drop section</h2>
          <div id="dropped">Dropped</div>
        </hax-body>
      </div>
    `)
    const pb = root.querySelector('#pb-drop')
    pb.order = 2
    pb.published = false
    pb.locked = true
    const dropped = root.querySelector('#dropped')
    await pb.haxtrayDragNDropToNode(dropped)
    expect(dropped.parent).to.equal('site-root')
    expect(dropped.order).to.equal(3)
    expect(dropped.published).to.equal(false)
    expect(dropped.locked).to.equal(true)
  })

  it('crashes building the form lists without a loaded manifest', async () => {
    const el = await fixture(html`<page-break title="No manifest"></page-break>`)
    const props = {
      settings: { advanced: [{ property: 'parent' }], developer: [] },
    }
    // BUG(page-break.js:1305-1307): globalThis.HAXCMS is always defined once
    // the site store is imported, so the guard never fails and
    // store.getManifestItems throws on a null manifest before any list is
    // built. Asserting the current (crashing) behavior so a fix flips this.
    let threw = null
    try {
      el.haxsetupActiveElementForm(props)
    } catch (e) {
      threw = e.message
    }
    expect(threw === null).to.equal(false)
    expect(threw.includes('items')).to.equal(true)
  })

  it('builds parent and theme select lists for the active element form', async () => {
    const savedCms = globalThis.HAXCMS
    globalThis.HAXCMS = {
      requestAvailability: () => ({
        store: {
          userData: { userName: 'form-user' },
          getManifestItems: () => [
            { id: 'item-1', title: 'Home', parent: null },
            { id: 'item-2', title: 'Child', parent: 'item-1' },
            { id: 'item-3', title: 'Grandchild', parent: 'item-2' },
            { id: 'item-4', title: 'Sibling', parent: null },
          ],
        },
      }),
    }
    const savedManifest = store.manifest
    const savedActiveId = store.activeId
    store.manifest = {
      metadata: { site: { settings: { pathauto: true } } },
      items: [{ id: 'item-1', title: 'Home', parent: null, metadata: {} }],
    }
    store.activeId = 'item-1'
    const el = await fixture(
      html`<page-break item-id="item-1" title="Form"></page-break>`,
    )
    const props = {
      settings: {
        advanced: [
          { property: 'parent' },
          { property: 'noderefs', properties: [{}] },
          { property: 'slug' },
        ],
        developer: [{ property: 'developerTheme' }, { property: 'author' }],
      },
    }
    el.haxsetupActiveElementForm(props)
    const parentInput = props.settings.advanced[0]
    expect(parentInput.inputMethod).to.equal('select')
    expect(parentInput.itemsList.length).to.equal(5)
    expect(parentInput.itemsList[0].text).to.equal('-- No parent --')
    expect(parentInput.itemsList[0].value === null).to.equal(true)
    // the current item and its descendants are disabled as parent options
    expect(
      parentInput.itemsList.find((i) => i.value === 'item-1').disabled,
    ).to.equal(true)
    expect(
      parentInput.itemsList.find((i) => i.value === 'item-2').disabled,
    ).to.equal(true)
    expect(
      parentInput.itemsList.find((i) => i.value === 'item-3').disabled,
    ).to.equal(true)
    expect(
      parentInput.itemsList.find((i) => i.value === 'item-4').disabled,
    ).to.equal(false)
    // depth dashes visualize the tree
    expect(
      parentInput.itemsList.find((i) => i.value === 'item-2').text.includes(
        'Child',
      ),
    ).to.equal(true)
    expect(
      parentInput.itemsList
        .find((i) => i.value === 'item-3')
        .text.startsWith('----'),
    ).to.equal(true)
    // noderefs shares the same select wiring
    const noderefsInput = props.settings.advanced[1]
    expect(noderefsInput.properties[0].inputMethod).to.equal('select')
    expect(noderefsInput.properties[0].itemsList.length).to.equal(5)
    // the theme list comes from appSettings
    const themeInput = props.settings.developer[0]
    expect(themeInput.inputMethod).to.equal('select')
    expect(themeInput.itemsList[1].text).to.equal('Developer theme')
    expect(themeInput.itemsList[1].value).to.equal('haxcms-dev-theme')
    // the author is pre-filled from the current user
    expect(el.author).to.equal('form-user')
    expect(props.settings.developer[1].value).to.equal('form-user')
    // slug is disabled while pathauto is on without an override
    expect(props.settings.advanced[2].disabled).to.equal(true)
    el.overridePathauto = true
    const props2 = {
      settings: {
        advanced: [
          { property: 'parent' },
          { property: 'noderefs', properties: [{}] },
          { property: 'slug' },
        ],
        developer: [{ property: 'developerTheme' }, { property: 'author' }],
      },
    }
    el.haxsetupActiveElementForm(props2)
    expect(props2.settings.advanced[2].disabled).to.equal(false)
    store.manifest = savedManifest
    store.activeId = savedActiveId
    globalThis.HAXCMS = savedCms
  })
})
