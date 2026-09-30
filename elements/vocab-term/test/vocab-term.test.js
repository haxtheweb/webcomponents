import { fixture, expect, html } from '@open-wc/testing'

import { VocabTerm } from '../vocab-term.js'

describe('vocab-term test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <vocab-term title="test-title"></vocab-term>
    `)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })

  it('registers the vocab-term tag', async () => {
    expect(VocabTerm.tag).to.equal('vocab-term')
    expect(globalThis.customElements.get('vocab-term')).to.exist
  })

  it('references an external haxProperties schema file', async () => {
    const url = VocabTerm.haxProperties
    expect(typeof url).to.equal('string')
    expect(url).to.contain('vocab-term.haxProperties.json')
  })

  it('declares itself an oer:LearningComponent', async () => {
    expect(element.getAttribute('typeof')).to.equal('oer:LearningComponent')
  })
})

describe('vocab-term modal mode (default)', () => {
  it('renders the term as an accessible summary with oer:name', async () => {
    const el = await fixture(
      html` <vocab-term term="breaching">A whale thing</vocab-term> `,
    )
    const summary = el.shadowRoot.querySelector('summary#summary')
    expect(summary).to.exist
    expect(summary.getAttribute('property')).to.equal('oer:name')
    expect(summary.textContent).to.equal('breaching')
    expect(summary.getAttribute('part')).to.not.exist
  })

  it('renders information as oer:description inside a modal template', async () => {
    const el = await fixture(
      html` <vocab-term term="breaching" information="Attacking prey"></vocab-term> `,
    )
    const modal = el.shadowRoot.querySelector('simple-modal-template')
    expect(modal).to.exist
    expect(modal.getAttribute('title')).to.equal('breaching')
    const p = el.shadowRoot.querySelector('p[property="oer:description"]')
    expect(p).to.exist
    expect(p.textContent.trim()).to.equal('Attacking prey')
    expect(p.getAttribute('slot')).to.equal('content')
  })

  it('defaults the term from light DOM innerHTML', async () => {
    const el = await fixture(html` <vocab-term>whalefall</vocab-term> `)
    expect(el.term).to.contain('whalefall')
    const summary = el.shadowRoot.querySelector('summary')
    expect(summary.textContent).to.contain('whalefall')
  })

  it('parses the links attribute into a link list', async () => {
    const el = await fixture(
      html` <vocab-term term="song" information="whale song"></vocab-term> `,
    )
    el.setAttribute(
      'links',
      'Whales,https://example.com/whales\nSong,https://example.com/song',
    )
    await el.updateComplete
    await el.updateComplete
    expect(el.links.length).to.equal(2)
    expect(el.links[0].title).to.equal('Whales')
    expect(el.links[0].href).to.equal('https://example.com/whales')
    const anchors = el.shadowRoot.querySelectorAll(
      'simple-modal-template ul[slot="content"] a',
    )
    expect(anchors.length).to.equal(2)
    expect(anchors[0].getAttribute('href')).to.equal(
      'https://example.com/whales',
    )
    expect(anchors[0].getAttribute('target')).to.equal('_blank')
    expect(anchors[0].getAttribute('rel')).to.equal('noopener noreferrer')
    expect(anchors[0].textContent).to.equal('Whales')
  })

  it('collects links from light DOM .links anchors', async () => {
    const el = await fixture(html`
      <vocab-term>
        Click a link:
        <div class="links">
          <a href="https://example.com/one">One</a>
        </div>
      </vocab-term>
    `)
    expect(el.links.length).to.equal(1)
    expect(el.links[0].title).to.equal('One')
    expect(el.links[0].href).to.equal('https://example.com/one')
    const anchor = el.shadowRoot.querySelector(
      'simple-modal-template a[href="https://example.com/one"]',
    )
    expect(anchor).to.exist
  })

  it('renders no link list without links', async () => {
    const el = await fixture(
      html` <vocab-term term="plain" information="no links"></vocab-term> `,
    )
    expect(el.shadowRoot.querySelector('ul')).to.not.exist
  })

  it('serializes links back to an attribute string', async () => {
    const converter = VocabTerm.properties.links.converter
    const attr = converter.toAttribute([
      { title: 'Whales', href: 'https://example.com/whales' },
      { title: 'Song', href: 'https://example.com/song' },
    ])
    expect(attr).to.equal(
      'Whales,https://example.com/whales\nSong,https://example.com/song',
    )
  })

  it('blocks summary clicks while hax editing is active', async () => {
    const el = await fixture(
      html` <vocab-term term="guard" information="guarded"></vocab-term> `,
    )
    const calls = []
    const fakeEvent = {
      preventDefault() {
        calls.push('prevent')
      },
      stopPropagation() {
        calls.push('stop')
      },
      stopImmediatePropagation() {
        calls.push('stopImmediate')
      },
    }
    el._handleSummaryClick(fakeEvent)
    expect(calls.length).to.equal(0)
    el.haxeditModeChanged(true)
    el._handleSummaryClick(fakeEvent)
    expect(calls).to.deep.equal(['prevent', 'stop', 'stopImmediate'])
  })

  it('implements hax hooks for edit mode', async () => {
    const el = await fixture(
      html` <vocab-term term="hooks" information="hooked"></vocab-term> `,
    )
    const hooks = el.haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
    el.haxactiveElementChanged(el, true)
    expect(el._haxstate).to.be.true
    el.haxactiveElementChanged(el, false)
    // a falsey val does not clear the flag
    expect(el._haxstate).to.be.true
    el.haxeditModeChanged(false)
    expect(el._haxstate).to.be.false
  })
})

describe('vocab-term popover mode', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html` <vocab-term popover-mode term="breaching" information="from below"></vocab-term> `,
    )
  })

  it('renders a details/summary pair with the popover', async () => {
    expect(el.getAttribute('popover-mode')).to.exist
    const details = el.shadowRoot.querySelector('details')
    expect(details).to.exist
    const summary = el.shadowRoot.querySelector('summary#summary')
    expect(summary.getAttribute('property')).to.equal('oer:name')
    const popover = el.shadowRoot.querySelector('simple-popover')
    expect(popover).to.exist
    expect(popover.getAttribute('for')).to.equal('summary')
    expect(popover.getAttribute('position')).to.equal('top')
    expect(popover.getAttribute('auto')).to.exist
    const p = popover.querySelector('p[property="oer:description"]')
    expect(p).to.exist
    expect(p.textContent.trim()).to.equal('from below')
    expect(popover.querySelector('div[part="links"]')).to.exist
  })

  it('drops detailsOpen when entering popover mode', async () => {
    const plain = await fixture(
      html` <vocab-term term="t" information="i"></vocab-term> `,
    )
    expect(plain.shadowRoot.querySelector('details')).to.not.exist
    plain.popoverMode = true
    await plain.updateComplete
    await plain.updateComplete
    expect(plain.detailsOpen).to.be.false
    expect(plain.shadowRoot.querySelector('details')).to.exist
    expect(plain.details).to.exist
  })

  it('toggles the details open state through clicks', async () => {
    expect(el.details).to.exist
    expect(el.details.hasAttribute('open')).to.be.false
    // simulate browsers that do not support the details open property
    el.detailsOpen = undefined
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await el.updateComplete
    expect(el.details.hasAttribute('open')).to.be.true
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await el.updateComplete
    expect(el.details.hasAttribute('open')).to.be.false
  })

  it('keeps detailsOpen in sync while toggling', async () => {
    el.detailsOpen = true
    el.toggleOpen()
    await el.updateComplete
    expect(el.details.hasAttribute('open')).to.be.true
    expect(el.detailsOpen).to.be.true
    el.toggleOpen()
    await el.updateComplete
    expect(el.details.hasAttribute('open')).to.be.false
    expect(el.detailsOpen).to.be.false
  })

  it('blocks toggling while hax editing is active', async () => {
    el.haxeditModeChanged(true)
    el.detailsOpen = undefined
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await el.updateComplete
    expect(el.details.hasAttribute('open')).to.be.false
    expect(el.shadowRoot.querySelector('summary')).to.exist
  })

  it('toggles through keyboard handlers', async () => {
    // simulate browsers that do not support the details open property
    el.detailsOpen = undefined
    const prevented = []
    const fakeEvent = (keyCode) => ({
      keyCode,
      preventDefault() {
        prevented.push(keyCode)
      },
      stopPropagation() {},
      stopImmediatePropagation() {},
    })
    el._handleKeyup(fakeEvent(32))
    await el.updateComplete
    expect(el.details.hasAttribute('open')).to.be.true
    expect(prevented).to.deep.equal([32])
    el._handleKeyup(fakeEvent(13))
    await el.updateComplete
    expect(el.details.hasAttribute('open')).to.be.false
  })

  it('ignores keyboard toggles while hax editing is active', async () => {
    el.haxeditModeChanged(true)
    const prevented = []
    const fakeEvent = {
      keyCode: 32,
      preventDefault() {
        prevented.push(32)
      },
      stopPropagation() {},
      stopImmediatePropagation() {},
    }
    el._handleKeyup(fakeEvent)
    await el.updateComplete
    expect(el.details.hasAttribute('open')).to.be.false
    expect(prevented.length).to.equal(0)
  })

  it('renders the link list inside the popover', async () => {
    const popEl = await fixture(
      html` <vocab-term
        popover-mode
        term="breaching"
        information="from below"
        links="Study,https://example.com/study"
      ></vocab-term>`,
    )
    await popEl.updateComplete
    const popover = popEl.shadowRoot.querySelector('simple-popover')
    expect(popover).to.exist
    const anchor = popover.querySelector('a[href="https://example.com/study"]')
    expect(anchor).to.exist
    expect(anchor.textContent).to.equal('Study')
    expect(anchor.getAttribute('target')).to.equal('_blank')
  })

  it('closes the details on detailsFocusOut', async () => {
    el.details.setAttribute('open', 'open')
    el.detailsFocusOut()
    expect(el.details.hasAttribute('open')).to.be.false
  })

  it('removes listeners when disconnected', async () => {
    const summary = el.shadowRoot.querySelector('summary')
    expect(summary).to.exist
    el.remove()
    // disconnectedCallback removes the summary/click listeners without error
    expect(globalThis.document.body.contains(el)).to.be.false
  })
})
