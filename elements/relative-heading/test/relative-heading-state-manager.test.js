import { fixture, expect, html } from '@open-wc/testing'

import { RelativeHeadingLite } from '../lib/relative-heading-lite.js'
import { RelativeHeadingStateManager } from '../lib/relative-heading-state-manager.js'

function fakeHeading(id, parent, level, defaultLevel) {
  return {
    id,
    parent,
    __level: level,
    defaultLevel,
    _setLevel(newLevel) {
      this.__level = newLevel
    },
  }
}

describe('relative-heading-lite (direct)', () => {
  it('registers the relative-heading-lite tag', async () => {
    expect(RelativeHeadingLite.tag).to.equal('relative-heading-lite')
    expect(globalThis.customElements.get('relative-heading-lite')).to.exist
  })

  it('renders a bare lite heading at level 1 with a generated id', async () => {
    const el = await fixture(
      html` <relative-heading-lite>Bare bones</relative-heading-lite> `,
    )
    await el.updateComplete
    expect(el.getAttribute('level')).to.equal('1')
    expect(el.getAttribute('default-level')).to.equal('1')
    expect(el.id.indexOf('heading-')).to.equal(0)
    expect(el.querySelector('h1')).to.exist
    expect(el.querySelector('h1').textContent).to.equal('Bare bones')
  })

  it('regenerates light DOM content when the level changes', async () => {
    const el = await fixture(
      html` <relative-heading-lite id="sm-lite1">
        <h2>Shuffle</h2>
      </relative-heading-lite>`,
    )
    await el.updateComplete
    await el.updateComplete
    // the authored h2 is rewritten to the computed level of 1
    expect(el.querySelector('h1')).to.exist
    expect(el.querySelector('h1').textContent).to.equal('Shuffle')
    el.defaultLevel = 4
    await el.updateComplete
    await el.updateComplete
    expect(el.getAttribute('level')).to.equal('4')
    expect(el.querySelector('h4')).to.exist
    expect(el.querySelector('h4').textContent).to.equal('Shuffle')
  })

  it('notifies the manager when its id changes', async () => {
    const el = await fixture(
      html` <relative-heading-lite id="sm-lite2">
        <h2>Rename</h2>
      </relative-heading-lite>`,
    )
    const manager = el.manager
    expect(manager.headings['sm-lite2'].heading === el).to.be.true
    el.id = 'sm-lite2-renamed'
    await el.updateComplete
    expect(manager.headings['sm-lite2'].heading === null).to.be.true
    expect(manager.headings['sm-lite2-renamed'].heading === el).to.be.true
  })

  it('creates a parent registry entry when a child connects first', async () => {
    const child = await fixture(
      html` <relative-heading-lite id="sm-child1" parent="sm-ghost1">
        <h2>Orphan</h2>
      </relative-heading-lite>`,
    )
    const manager = child.manager
    // the parent has not connected yet, so addSubhead created the entry
    expect(manager.headings['sm-ghost1']).to.exist
    expect(manager.headings['sm-ghost1'].subheads.length).to.equal(1)
    expect(manager.headings['sm-ghost1'].heading === null).to.be.true
    // the orphan falls back to its own default level of 1
    expect(child.getAttribute('level')).to.equal('1')
  })

  it('unregisters from the manager when disconnected', async () => {
    const el = await fixture(
      html` <relative-heading-lite id="sm-lite3">
        <h2>Bye</h2>
      </relative-heading-lite>`,
    )
    const manager = el.manager
    expect(manager.headings['sm-lite3'].heading === el).to.be.true
    el.remove()
    expect(manager.headings['sm-lite3'].heading === null).to.be.true
  })
})

describe('relative-heading-state-manager (direct)', () => {
  it('registers the relative-heading-state-manager tag', async () => {
    expect(RelativeHeadingStateManager.tag).to.equal(
      'relative-heading-state-manager',
    )
    expect(
      globalThis.customElements.get('relative-heading-state-manager'),
    ).to.exist
  })

  it('exposes a single shared instance', async () => {
    const el = await fixture(
      html` <relative-heading-lite id="sm-single">
        <h2>Singleton</h2>
      </relative-heading-lite>`,
    )
    const manager = el.manager
    const again = globalThis.RelativeHeadingStateManager.requestAvailability()
    expect(again === manager).to.be.true
    expect(manager.headings).to.exist
  })

  it('levels a child one below its parent and cascades to subheads', async () => {
    const manager = globalThis.RelativeHeadingStateManager.requestAvailability()
    const parent = fakeHeading('sm-p1', null, 1, 1)
    const child = fakeHeading('sm-c1', 'sm-p1', 1, 1)
    manager.addHeading(child)
    // parent has not registered yet, so the child sits at its default
    expect(child.__level).to.equal(1)
    manager.addHeading(parent)
    expect(child.__level).to.equal(2)
    expect(manager.headings['sm-p1'].subheads.length).to.equal(1)
    // relevel the parent and the cascade updates the child
    manager.updateLevel(parent)
    expect(child.__level).to.equal(2)
  })

  it('removeHeading nulls the parent entry and relevels subheads', async () => {
    const manager = globalThis.RelativeHeadingStateManager.requestAvailability()
    const parent = fakeHeading('sm-p2', null, 3, 3)
    const child = fakeHeading('sm-c2', 'sm-p2', 4, 4)
    manager.addHeading(child)
    manager.addHeading(parent)
    expect(child.__level).to.equal(4)
    manager.removeHeading(parent)
    expect(manager.headings['sm-p2'].heading === null).to.be.true
    // the child falls back to its own default level
    expect(child.__level).to.equal(4)
    // the removed parent keeps its registered subheads
    expect(manager.headings['sm-p2'].subheads.length).to.equal(1)
  })

  it('updateParent moves a heading between parents', async () => {
    const manager = globalThis.RelativeHeadingStateManager.requestAvailability()
    const oldParent = fakeHeading('sm-p3', null, 1, 1)
    const newParent = fakeHeading('sm-p4', null, 1, 1)
    const child = fakeHeading('sm-c3', 'sm-p3', 2, 2)
    manager.addHeading(oldParent)
    manager.addHeading(newParent)
    manager.addHeading(child)
    expect(manager.headings['sm-p3'].subheads.length).to.equal(1)
    child.parent = 'sm-p4'
    manager.updateParent(child, 'sm-p3')
    expect(manager.headings['sm-p3'].subheads.length).to.equal(0)
    expect(manager.headings['sm-p4'].subheads.length).to.equal(1)
    expect(child.__level).to.equal(2)
  })

  it('updateDefaultLevel and updateId manage registry data', async () => {
    const manager = globalThis.RelativeHeadingStateManager.requestAvailability()
    const heading = fakeHeading('sm-u1', null, 1, 1)
    manager.updateDefaultLevel(heading, null)
    expect(heading.__level).to.equal(1)
    manager.updateId(heading, 'sm-old')
    expect(manager.headings['sm-old'].heading === null).to.be.true
    expect(manager.headings['sm-u1'].heading === heading).to.be.true
    manager.setHeading('sm-u1', null)
    expect(manager.headings['sm-u1'].heading === null).to.be.true
  })

  it('ignores missing headings and parents gracefully', async () => {
    const manager = globalThis.RelativeHeadingStateManager.requestAvailability()
    manager.addHeading(null)
    manager.removeHeading(null)
    manager.updateId(null, 'x')
    manager.updateParent(null, 'x')
    manager.updateDefaultLevel(null, 'x')
    manager.removeSubhead('does-not-exist', null)
    manager.updateLevel(null)
    // nothing threw and the registry is untouched for these ids
    expect(manager.headings['does-not-exist']).to.not.exist
  })

  it('renders the copy toast with close affordances', async () => {
    const el = await fixture(
      html` <relative-heading-lite id="sm-toast">
        <h2>Toast</h2>
      </relative-heading-lite>`,
    )
    const manager = el.manager
    expect(manager.usesCopyLink).to.be.false
    manager.useCopyLink()
    await manager.updateComplete
    expect(manager.usesCopyLink).to.be.true
    const toast = manager.shadowRoot.querySelector('#relative-heading-toast')
    expect(toast).to.exist
    expect(toast.getAttribute('duration')).to.equal('5000')
    const closeButton = toast.querySelector('simple-icon-button-lite')
    expect(closeButton.getAttribute('icon')).to.equal('close')
    expect(closeButton.getAttribute('label')).to.equal('Close')
  })

  it('copyLink captures the heading and builds a share URL', async () => {
    const el = await fixture(
      html` <relative-heading-lite id="sm-copy">
        <h2>Copy</h2>
      </relative-heading-lite>`,
    )
    const manager = el.manager
    manager.copyLink(el)
    expect(manager.copyHeading === el).to.be.true
    expect(manager.copyUrl.indexOf('#sm-copy')).to.not.equal(-1)
    await manager.updateComplete
    const toast = manager.shadowRoot.querySelector('#relative-heading-toast')
    expect(toast.getAttribute('text').indexOf('Copied to Clipboard')).to.not.equal(
      -1,
    )
    // a heading with no id produces a bare hash
    manager.copyLink({ closeIcon: 'x', closeLabel: 'Bye' })
    expect(manager.copyUrl.indexOf('#')).to.not.equal(-1)
    manager.closeCopyLink()
  })

  it('copyUrl keeps heading-specific overrides', async () => {
    const el = await fixture(
      html` <relative-heading-lite id="sm-copy2">
        <h2>Override</h2>
      </relative-heading-lite>`,
    )
    const manager = el.manager
    el.closeIcon = 'done'
    el.closeLabel = 'Finished'
    el.copyMessage = 'Link copied!'
    manager.copyLink(el)
    expect(manager.copyHeading === el).to.be.true
    await manager.updateComplete
    const toast = manager.shadowRoot.querySelector('#relative-heading-toast')
    expect(toast.getAttribute('text').indexOf('Link copied!')).to.not.equal(-1)
    const closeButton = toast.querySelector('simple-icon-button-lite')
    expect(closeButton.getAttribute('icon')).to.equal('done')
    expect(closeButton.getAttribute('label')).to.equal('Finished')
  })
})
