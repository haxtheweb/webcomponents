import { fixture, expect, html } from '@open-wc/testing'

import '../lib/badge-sticker.js'
import { BadgeSticker } from '../lib/badge-sticker.js'

describe('badge-sticker', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('badge-sticker')).to.exist
  })

  it('has the expected static tag', () => {
    expect(BadgeSticker.tag).to.equal('badge-sticker')
  })

  it('has default property values including todays date', async () => {
    const el = await fixture(html`<badge-sticker></badge-sticker>`)
    expect(el.badgeImage).to.equal('')
    expect(el.badgeTitle).to.equal('')
    expect(el.badgeDetails).to.equal('')
    expect(el.hyperLink).to.equal('')
    expect(el.badgeSkills).to.equal('')
    expect(el.skillsOpened).to.be.false
    expect(el.detailsOpened).to.be.false
    expect(el.badgeColor).to.equal('')
    expect(el.badgeDate).to.equal(new Date().toLocaleDateString())
  })

  it('renders the badge, circular title, image, and verification link', async () => {
    // properties map to kebab-case attribute names (badge-title etc)
    const el = await fixture(html`
      <badge-sticker
        badge-title="Trailblazer"
        badge-image="badge.png"
        badge-details="Earned for blazing trails"
        hyper-link="https://example.com/verify"
        badge-skills="leadership,navigation"
        badge-color="#2b6cb0"
      ></badge-sticker>
    `)
    await el.updateComplete
    const badge = el.shadowRoot.querySelector('.badge')
    expect(badge).to.exist
    expect(badge.getAttribute('style')).to.include('--badge-color: #2b6cb0')
    const dateTitle = el.shadowRoot.querySelector('date-title.date-title')
    expect(dateTitle).to.exist
    expect(dateTitle.getAttribute('title')).to.equal('Trailblazer')
    expect(dateTitle.getAttribute('date')).to.equal(
      new Date().toLocaleDateString(),
    )
    const img = el.shadowRoot.querySelector('img.badgepic')
    expect(img.getAttribute('src')).to.equal('badge.png')
    // the badge image alt reflects the badge title
    expect(img.getAttribute('alt')).to.equal('Trailblazer')
    const link = el.shadowRoot.querySelector('.verificationlink a')
    expect(link.getAttribute('href')).to.equal('https://example.com/verify')
    expect(link.getAttribute('target')).to.equal('_blank')
    expect(link.getAttribute('aria-label')).to.equal('Verify this badge')
  })

  it('tracks the badge node and splits skills on first update', async () => {
    const el = await fixture(
      html`<badge-sticker
        badge-skills="leadership,navigation,first aid"
      ></badge-sticker>`,
    )
    await el.updateComplete
    expect(
      el.activeNode === el.shadowRoot.querySelector('.badge'),
    ).to.be.true
    expect(el.skillsArray).to.deep.equal([
      'leadership',
      'navigation',
      'first aid',
    ])
  })

  it('toggles the skills popover through the details button', async () => {
    const el = await fixture(
      html`<badge-sticker
        badge-details="Earned for blazing trails"
        badge-skills="leadership"
      ></badge-sticker>`,
    )
    await el.updateComplete
    const popover = el.shadowRoot.querySelector(
      'absolute-position-behavior.popover',
    )
    expect(popover).to.exist
    expect(popover.hasAttribute('hidden')).to.be.true
    el.shadowRoot.querySelector('.button').click()
    await el.updateComplete
    expect(el.skillsOpened).to.be.true
    expect(popover.hasAttribute('hidden')).to.be.false
    expect(popover.textContent).to.include('Earned for blazing trails')
    expect(popover.textContent).to.include('leadership')
    el.shadowRoot.querySelector('.button').click()
    await el.updateComplete
    expect(popover.hasAttribute('hidden')).to.be.true
  })

  it('exposes a keyboard-operable details button with expanded state', async () => {
    const el = await fixture(
      html`<badge-sticker
        badge-details="Earned for blazing trails"
        badge-skills="leadership"
      ></badge-sticker>`,
    )
    await el.updateComplete
    const button = el.shadowRoot.querySelector('button.button')
    expect(button).to.exist
    // the button discloses the popover through aria-expanded/aria-controls
    expect(button.getAttribute('aria-expanded')).to.equal('false')
    expect(button.getAttribute('aria-controls')).to.equal('skills-popover')
    // the button itself is keyboard-focusable
    button.focus()
    expect(el.shadowRoot.activeElement === button).to.be.true
    button.click()
    await el.updateComplete
    expect(button.getAttribute('aria-expanded')).to.equal('true')
  })
})
