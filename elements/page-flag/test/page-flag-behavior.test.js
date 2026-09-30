import { fixture, expect, html } from '@open-wc/testing'
import { pageFlagManager } from '../page-flag.js'
import '../page-flag.js'
import '../lib/page-flag-comment.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

describe('page-flag-manager', () => {
  it('seeds defaults on a fresh manager', () => {
    const mgr = globalThis.document.createElement('page-flag-manager')
    expect(mgr.activeUser).to.equal(null)
    expect(mgr.allFlags).to.deep.equal([])
    expect(mgr.tagName).to.equal('PAGE-FLAG-MANAGER')
  })

  it('keeps a connected singleton', () => {
    expect(pageFlagManager === globalThis.pageFlagManager.instance).to.equal(true)
    expect(pageFlagManager.isConnected).to.equal(true)
  })

  it('updates the active user and shows every flag from user data events', async () => {
    const mgr = globalThis.document.createElement('page-flag-manager')
    globalThis.document.body.appendChild(mgr)
    const flagStub = { show: false }
    mgr.allFlags = [flagStub]
    globalThis.dispatchEvent(
      new CustomEvent('haxcms-user-data-updated', {
        detail: { userName: 'Bryan' },
      }),
    )
    expect(mgr.activeUser).to.equal('Bryan')
    expect(flagStub.show).to.equal(true)
    // a disconnected manager stops listening
    mgr.remove()
    globalThis.dispatchEvent(
      new CustomEvent('haxcms-user-data-updated', {
        detail: { userName: 'Other' },
      }),
    )
    expect(mgr.activeUser).to.equal('Bryan')
  })
})

describe('page-flag', () => {
  let savedUser
  let savedFlags
  beforeEach(() => {
    savedUser = pageFlagManager.activeUser
    savedFlags = pageFlagManager.allFlags
    pageFlagManager.activeUser = 'Bryan'
    pageFlagManager.allFlags = []
  })
  afterEach(() => {
    pageFlagManager.activeUser = savedUser
    pageFlagManager.allFlags = savedFlags
  })

  it('seeds defaults', () => {
    const el = globalThis.document.createElement('page-flag')
    expect(el.label).to.equal('note')
    expect(el.opened).to.equal(false)
    expect(el.accentColor).to.equal('cyan')
    expect(el.show).to.equal(false)
    expect(el._haxState).to.equal(false)
    expect(el.tagName).to.equal('PAGE-FLAG')
  })

  it('registers, shows and wires itself when a user is active', async () => {
    const root = await fixture(html`
      <div>
        <page-flag accent-color="yellow">
          <page-flag-comment seed="Bryan">A comment</page-flag-comment>
        </page-flag>
      </div>
    `)
    const el = root.querySelector('page-flag')
    expect(el.show).to.equal(true)
    expect(pageFlagManager.allFlags.includes(el)).to.equal(true)
    // arrow node is wired as the popup target
    const apb = el.shadowRoot.querySelector('absolute-position-behavior')
    expect(apb === null).to.equal(false)
    expect(apb.target === el.shadowRoot.querySelector('.arrow')).to.equal(true)
    // popup hidden until opened
    expect(apb.hasAttribute('hidden')).to.equal(true)
    // slotted comments survive, no boilerplate needed
    expect(el.querySelectorAll('page-flag-comment').length).to.equal(1)
    expect(root.contains(el)).to.equal(true)
  })

  it('removes itself when no user is active', async () => {
    pageFlagManager.activeUser = null
    const root = await fixture(html`
      <div><page-flag></page-flag></div>
    `)
    const el = root.querySelector('page-flag')
    // self removed flags detach, so look them up before they vanish
    expect(root.contains(el)).to.equal(false)
  })

  it('adds a boilerplate comment and enters edit mode', async () => {
    const root = await fixture(html`
      <div><page-flag></page-flag></div>
    `)
    const el = root.querySelector('page-flag')
    const comment = el.querySelector('page-flag-comment')
    expect(comment === null).to.equal(false)
    expect(comment.seed).to.equal('Bryan')
    expect(comment.canEdit).to.equal(true)
    expect(comment.readOnly).to.equal(false)
    await wait(200)
    expect(comment.editMode).to.equal(true)
    expect(comment.hasAttribute('edit-mode')).to.equal(true)
  })

  it('toggles open and reevaluates comment edit rights', async () => {
    const root = await fixture(html`
      <div>
        <page-flag>
          <page-flag-comment seed="Bryan">Mine</page-flag-comment>
          <page-flag-comment seed="Other">Theirs</page-flag-comment>
        </page-flag>
      </div>
    `)
    const el = root.querySelector('page-flag')
    const comments = el.querySelectorAll('page-flag-comment')
    expect(el.hasAttribute('opened')).to.equal(false)
    el.shadowRoot.querySelector('button.arrow').click()
    // wait out the chained update cycles from opened + dark + comments
    await el.updateComplete
    await wait(30)
    expect(el.opened).to.equal(true)
    expect(el.hasAttribute('opened')).to.equal(true)
    expect(el.dark).to.equal(true)
    expect(el.shadowRoot.querySelector('absolute-position-behavior').hasAttribute('hidden')).to.equal(false)
    // outside hax edit mode comments stay read only, rights follow the author
    expect(comments[0].readOnly).to.equal(true)
    expect(comments[0].canEdit).to.equal(true)
    expect(comments[1].canEdit).to.equal(false)
    // inside hax edit mode comments become writable
    el.haxeditModeChanged(true)
    el.shadowRoot.querySelector('button.arrow').click()
    await el.updateComplete
    await wait(30)
    expect(el.opened).to.equal(false)
    expect(el.dark).to.equal(false)
    expect(comments[0].readOnly).to.equal(false)
    // leaving hax edit mode and reopening returns to read only
    el.haxeditModeChanged(false)
    el.shadowRoot.querySelector('button.arrow').click()
    await el.updateComplete
    await wait(30)
    expect(el.opened).to.equal(true)
    expect(el.dark).to.equal(true)
    expect(comments[0].readOnly).to.equal(true)
  })

  it('edits, replies and deletes comments through composed events', async () => {
    const root = await fixture(html`
      <div>
        <page-flag>
          <page-flag-comment seed="Bryan">First</page-flag-comment>
          <page-flag-comment seed="Bryan">Second</page-flag-comment>
        </page-flag>
      </div>
    `)
    const el = root.querySelector('page-flag')
    const comments = el.querySelectorAll('page-flag-comment')
    // edit flips the target comment edit mode
    comments[0].editMode = false
    comments[0].dispatchEvent(
      new CustomEvent('page-flag-comment-edit', {
        bubbles: true,
        composed: true,
        detail: comments[0],
      }),
    )
    expect(comments[0].editMode).to.equal(true)
    // reply inserts a fresh editable comment after the source
    comments[0].dispatchEvent(
      new CustomEvent('page-flag-comment-reply', {
        bubbles: true,
        composed: true,
        detail: comments[0],
      }),
    )
    const replies = el.querySelectorAll('page-flag-comment')
    expect(replies.length).to.equal(3)
    const reply = replies[1]
    expect(reply === comments[1]).to.equal(false)
    expect(reply.seed).to.equal('Bryan')
    expect(reply.reply).to.equal(1)
    expect(reply.canEdit).to.equal(true)
    expect(reply.readOnly).to.equal(false)
    await wait(50)
    expect(reply.editMode).to.equal(true)
    // reply depth caps at 2
    reply.editMode = false
    reply.dispatchEvent(
      new CustomEvent('page-flag-comment-reply', {
        bubbles: true,
        composed: true,
        detail: reply,
      }),
    )
    expect(el.querySelectorAll('page-flag-comment').length).to.equal(4)
    const capped = el.querySelectorAll('page-flag-comment')[2]
    expect(capped.reply).to.equal(2)
    // deleting comments removes them, the flag goes when the last one does
    const all = () => el.querySelectorAll('page-flag-comment')
    all()[0].dispatchEvent(
      new CustomEvent('page-flag-comment-delete', {
        bubbles: true,
        composed: true,
        detail: all()[0],
      }),
    )
    expect(all().length).to.equal(3)
    expect(el.isConnected).to.equal(true)
    for (const comment of Array.from(all())) {
      comment.dispatchEvent(
        new CustomEvent('page-flag-comment-delete', {
          bubbles: true,
          composed: true,
          detail: comment,
        }),
      )
    }
    expect(all().length).to.equal(0)
    expect(el.isConnected).to.equal(false)
  })

  it('routes built in comment events into the flag handlers', async () => {
    const root = await fixture(html`
      <div>
        <page-flag>
          <page-flag-comment seed="Bryan">Only one</page-flag-comment>
        </page-flag>
      </div>
    `)
    const el = root.querySelector('page-flag')
    const comment = el.querySelector('page-flag-comment')
    // the built in ops dispatch without composed: true, but slotted comment
    // events still propagate through the slot chain into the flag's shadow
    // DOM handlers (path: comment > slot > div), so the flow works as is
    comment.deleteOp()
    expect(el.querySelectorAll('page-flag-comment').length).to.equal(0)
    // removing the last comment takes the flag with it
    expect(root.contains(el)).to.equal(false)
  })

  it('exposes hax hooks, inline menu and thread resolution', async () => {
    const root = await fixture(html`
      <div><page-flag></page-flag></div>
    `)
    const el = root.querySelector('page-flag')
    const hooks = el.haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    expect(hooks.inlineContextMenu).to.equal('haxinlineContextMenu')
    el.haxeditModeChanged(true)
    expect(el.show).to.equal(true)
    expect(el._haxState).to.equal(true)
    const ceMenu = {}
    el.haxinlineContextMenu(ceMenu)
    expect(ceMenu.ceButtons.length).to.equal(1)
    expect(ceMenu.ceButtons[0].icon).to.equal('lrn:discuss')
    expect(ceMenu.ceButtons[0].callback).to.equal('haxResolveThread')
    expect(ceMenu.ceButtons[0].label).to.equal('Resolve thread')
    expect(el.haxResolveThread()).to.equal(true)
    expect(el.isConnected).to.equal(false)
  })

  it('passes the closed a11y audit and documents the opened contrast deficit', async () => {
    const root = await fixture(html`
      <div>
        <page-flag>
          <page-flag-comment seed="Bryan">A comment</page-flag-comment>
        </page-flag>
      </div>
    `)
    const el = root.querySelector('page-flag')
    await expect(el).shadowDom.to.be.accessible()
    el.shadowRoot.querySelector('button.arrow').click()
    await el.updateComplete
    await wait(30)
    // BUG(page-flag-comment.js:247-249): once the popup opens, the comment
    // date renders #999999 on white at 12px, measuring 2.84:1 against the
    // 4.5:1 WCAG AA minimum (axe color-contrast, serious, on the datetime).
    // Asserting the current non-compliant pairing so a token fix flips
    // this assertion. The color is inherited by the datetime host.
    const datetime = el
      .querySelector('page-flag-comment')
      .shadowRoot.querySelector('simple-datetime')
    const cs = globalThis.getComputedStyle(datetime)
    expect(cs.color).to.equal('rgb(153, 153, 153)')
    expect(cs.fontSize).to.equal('12px')
  })
})

describe('page-flag-comment', () => {
  it('seeds defaults', async () => {
    const el = await fixture(
      html`<page-flag-comment>A note</page-flag-comment>`,
    )
    expect(el.tagName).to.equal('PAGE-FLAG-COMMENT')
    expect(el.mood).to.equal(null)
    expect(el.seed).to.equal('abc123')
    expect(el.reply).to.equal(0)
    expect(el.editMode).to.equal(false)
    expect(el.canEdit).to.equal(false)
    expect(el.readOnly).to.equal(true)
    expect(el.haxUIElement).to.equal(true)
    expect(el.timestamp > 0).to.equal(true)
  })

  it('updates edit rights from the active user', async () => {
    const el = await fixture(html`<page-flag-comment></page-flag-comment>`)
    el.testCanUpdate('abc123')
    expect(el.canEdit).to.equal(true)
    el.testCanUpdate('someone-else')
    expect(el.canEdit).to.equal(false)
  })

  it('renders read only without action buttons', async () => {
    const el = await fixture(
      html`<page-flag-comment seed="Bryan">A note</page-flag-comment>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelectorAll('simple-icon-button').length).to.equal(0)
    // mood renders into the emoji div when not editing
    el.mood = '🎈'
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.emoji').innerHTML.includes('🎈')).to.equal(true)
    expect(el.shadowRoot.querySelector('simple-emoji-picker')).to.equal(null)
    // identity and date render through the header
    expect(el.shadowRoot.querySelector('.comment__header__info__name').textContent).to.equal('Bryan')
    const datetime = el.shadowRoot.querySelector('simple-datetime')
    expect(datetime === null).to.equal(false)
    expect(datetime.getAttribute('format')).to.equal('m/j/y h:i')
    expect(datetime.getAttribute('unix')).to.equal('')
    // avatar carries the seed and no hat while not editing
    const avatar = el.shadowRoot.querySelector('rpg-character')
    expect(avatar.getAttribute('seed')).to.equal('Bryan')
    expect(avatar.getAttribute('hat')).to.equal('none')
  })

  it('renders reply, edit and delete actions by permission', async () => {
    const el = await fixture(
      html`<page-flag-comment seed="Bryan">A note</page-flag-comment>`,
    )
    el.readOnly = false
    await el.updateComplete
    // not the author: reply only
    const replyOnly = el.shadowRoot.querySelectorAll('simple-icon-button')
    expect(replyOnly.length).to.equal(1)
    expect(replyOnly[0].getAttribute('title')).to.equal('Reply')
    expect(replyOnly[0].getAttribute('icon')).to.equal('reply')
    // author: reply, edit and delete
    el.canEdit = true
    await el.updateComplete
    const buttons = el.shadowRoot.querySelectorAll('simple-icon-button')
    expect(buttons.length).to.equal(3)
    const titles = Array.from(buttons).map((b) => b.getAttribute('title'))
    expect(titles.includes('Update')).to.equal(true)
    expect(titles.includes('Delete')).to.equal(true)
    // editing swaps the update button icon and shows the picker
    el.editMode = true
    await el.updateComplete
    const icons = Array.from(el.shadowRoot.querySelectorAll('simple-icon-button')).map((b) => b.getAttribute('icon'))
    expect(icons.includes('save')).to.equal(true)
    expect(el.shadowRoot.querySelector('simple-emoji-picker') === null).to.equal(false)
    expect(el.shadowRoot.querySelector('.emoji')).to.equal(null)
    expect(el.shadowRoot.querySelector('rpg-character').getAttribute('hat')).to.equal('edit')
  })

  it('tracks mood changes from the emoji picker', async () => {
    const el = await fixture(html`<page-flag-comment></page-flag-comment>`)
    el.emojiChanged({ detail: { value: '🎉' } })
    await el.updateComplete
    expect(el.mood).to.equal('🎉')
    expect(el.shadowRoot.querySelector('.emoji').innerHTML.includes('🎉')).to.equal(true)
  })

  it('dispatches edit, reply and delete ops with itself as detail', async () => {
    const el = await fixture(html`<page-flag-comment>A note</page-flag-comment>`)
    const seen = []
    const handler = (e) => {
      seen.push([e.type, e.detail === el, e.bubbles])
    }
    el.addEventListener('page-flag-comment-edit', handler)
    el.addEventListener('page-flag-comment-reply', handler)
    el.addEventListener('page-flag-comment-delete', handler)
    el.editOp()
    el.replyOp()
    el.deleteOp()
    expect(seen.length).to.equal(3)
    expect(seen[0][0]).to.equal('page-flag-comment-edit')
    expect(seen[1][0]).to.equal('page-flag-comment-reply')
    expect(seen[2][0]).to.equal('page-flag-comment-delete')
    expect(seen[0][1]).to.equal(true)
    expect(seen[0][2]).to.equal(true)
  })

  it('seeds the textarea with its slotted content', async () => {
    const el = await fixture(
      html`<page-flag-comment>A seeded note</page-flag-comment>`,
    )
    await el.updateComplete
    const field = el.shadowRoot.querySelector('simple-fields-field')
    expect(field === null).to.equal(false)
    expect(field.value.trim()).to.equal('A seeded note')
  })

  it('focuses and selects the textarea when entering edit mode', async () => {
    const el = await fixture(
      html`<page-flag-comment>A seeded note</page-flag-comment>`,
    )
    await el.updateComplete
    const field = el.shadowRoot.querySelector('simple-fields-field')
    const focused = []
    const selected = []
    field.focus = () => {
      focused.push(true)
    }
    // simple-fields-field has no select method, patch it for the flow test
    field.select = () => {
      selected.push(true)
    }
    el.editMode = true
    await el.updateComplete
    await wait(50)
    expect(focused.length).to.equal(1)
    expect(selected.length).to.equal(1)
    // leaving edit mode writes the textarea back into the light dom
    field.value = 'An edited note'
    el.editMode = false
    await el.updateComplete
    expect(el.innerHTML.includes('An edited note')).to.equal(true)
  })
})
