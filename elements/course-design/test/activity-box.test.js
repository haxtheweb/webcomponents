import { fixture, expect, html } from '@open-wc/testing'

import '../lib/activity-box.js'
import { ActivityBox } from '../lib/activity-box.js'

describe('activity-box', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('activity-box')).to.exist
  })

  it('has the expected static tag and haxProperties URL', () => {
    expect(ActivityBox.tag).to.equal('activity-box')
    const url = ActivityBox.haxProperties
    expect(typeof url).to.equal('string')
    expect(url.endsWith('activity-box.haxProperties.json')).to.be.true
  })

  it('has default property values', async () => {
    const el = await fixture(html`<activity-box></activity-box>`)
    expect(el.icon).to.equal('')
    expect(el.tag).to.equal('')
    // no constructor default, so unset until an author sets it
    expect(el.nocolourize).to.be.undefined
  })

  it('renders the icon, tag, and slotted content', async () => {
    const el = await fixture(html`
      <activity-box icon="icons:assignment" tag="Try it">
        Complete this activity
      </activity-box>
    `)
    await el.updateComplete
    expect(
      el.shadowRoot.querySelector('.container > simple-icon').getAttribute('icon'),
    ).to.equal('icons:assignment')
    const tag = el.shadowRoot.querySelector('.tag')
    expect(tag.hasAttribute('hidden')).to.be.false
    expect(
      el.shadowRoot.querySelector('.tag-content').textContent,
    ).to.include('Try it')
    expect(el.textContent).to.include('Complete this activity')
    await expect(el).shadowDom.to.be.accessible()
  })

  it('hides the tag and icon when unset', async () => {
    const el = await fixture(html`<activity-box>No tag or icon</activity-box>`)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.container > simple-icon')).to.not
      .exist
    expect(el.shadowRoot.querySelector('.tag').hasAttribute('hidden')).to.be
      .true
    expect(el.textContent).to.include('No tag or icon')
  })

  it('toggles contenteditable on the tag content through hax hooks', async () => {
    const el = await fixture(html`
      <activity-box icon="icons:assignment" tag="Try it"></activity-box>
    `)
    await el.updateComplete
    expect(el.haxHooks()).to.deep.equal({
      activeElementChanged: 'haxactiveElementChanged',
    })
    const result = el.haxactiveElementChanged(el, true)
    expect(result).to.equal(false)
    const container = el.shadowRoot.querySelector('.tag-content')
    expect(container.hasAttribute('contenteditable')).to.be.true
    el.haxactiveElementChanged(el, false)
    expect(container.hasAttribute('contenteditable')).to.be.false
    expect(el.tag).to.include('Try it')
  })
})
