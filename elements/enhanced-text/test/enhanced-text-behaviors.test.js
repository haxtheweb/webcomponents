import { fixture, expect, html } from '@open-wc/testing'
import sinon from 'sinon'

import '../enhanced-text.js'
import { MicroFrontendRegistry } from '@haxtheweb/micro-frontend-registry/micro-frontend-registry.js'

// Gap-closing behavioral tests for enhanced-text: glossary term
// application (single text node, element-only content, links, mark-all)
// and the enhance() micro-frontend call routing (call is stubbed so no
// network is ever hit).
describe('enhanced-text behaviors', () => {
  it('wraps a matching term in vocab-term from a single text node', async () => {
    const el = await fixture(
      html`<enhanced-text>This is sample text</enhanced-text>`,
    )
    el.applyTermFromList({
      status: true,
      data: [{ term: 'sample', definition: 'A representative part' }],
    })
    const termEl = el.querySelector('vocab-term')
    expect(termEl).to.exist
    expect(termEl.term).to.equal('sample')
    expect(termEl.information).to.equal('A representative part')
  })

  it('splits element-only content via innerText before applying terms', async () => {
    const el = await fixture(
      html`<enhanced-text><p>sample text here</p></enhanced-text>`,
    )
    // no direct text nodes: the innerText fallback path must run
    el.applyTermFromList({
      status: true,
      data: [{ term: 'sample', definition: 'A representative part' }],
    })
    const termEl = el.querySelector('vocab-term')
    expect(termEl).to.exist
    expect(termEl.term).to.equal('sample')
    // the wrapping p was cleared by the innerHTML reset
    expect(el.querySelector('p')).to.equal(null)
  })

  it('does nothing without status or data', async () => {
    const el = await fixture(html`<enhanced-text>plain text</enhanced-text>`)
    el.applyTermFromList({ status: false })
    el.applyTermFromList({ status: true, data: [] })
    expect(el.querySelector('vocab-term')).to.equal(null)
    expect(el.textContent.trim()).to.equal('plain text')
    // null payload is ignored by the applyTermFromList null guard
    // (haxtheweb/issues#3102)
    expect(() => el.applyTermFromList(null)).to.not.throw()
    expect(el.querySelector('vocab-term')).to.equal(null)
  })

  it('appends definition links inside the vocab-term', async () => {
    const el = await fixture(
      html`<enhanced-text>This is sample text</enhanced-text>`,
    )
    el.applyTermFromList({
      status: true,
      data: [
        {
          term: 'sample',
          definition: 'A representative part',
          links: [{ href: 'https://haxtheweb.org', title: 'HAXTheWeb' }],
        },
      ],
    })
    const termEl = el.querySelector('vocab-term')
    expect(termEl).to.exist
    const div = termEl.querySelector('div.links')
    expect(div).to.exist
    const a = div.querySelector('a')
    expect(a.getAttribute('href')).to.equal('https://haxtheweb.org')
    expect(a.innerText).to.equal('HAXTheWeb')
  })

  it('only marks the first match unless haxcms-mark-all is set', async () => {
    const el = await fixture(
      html`<enhanced-text>sample and sample</enhanced-text>`,
    )
    el.applyTermFromList({
      status: true,
      data: [{ term: 'sample', definition: 'd' }],
    })
    expect(el.querySelectorAll('vocab-term').length).to.equal(1)
    const all = await fixture(
      html`<enhanced-text haxcms-mark-all>sample and sample</enhanced-text>`,
    )
    all.applyTermFromList({
      status: true,
      data: [{ term: 'sample', definition: 'd' }],
    })
    expect(all.querySelectorAll('vocab-term').length).to.equal(2)
  })

  it('enhance() routes the vide call through the registry', async () => {
    const callStub = sinon.stub(MicroFrontendRegistry, 'call')
    try {
      const el = await fixture(
        html`<enhanced-text vide>Some body text</enhanced-text>`,
      )
      const p = el.enhance()
      expect(el.loading).to.equal(true)
      await p
      expect(callStub.callCount).to.equal(1)
      expect(callStub.getCall(0).args[0]).to.equal('@enhancedText/textVide')
      expect(callStub.getCall(0).args[1].fixationPoint).to.equal(4)
      expect(callStub.getCall(0).args[1].body).to.contain('Some body text')
      expect(el.loading).to.equal(false)
    } finally {
      callStub.restore()
    }
  })

  it('enhance() routes the glossary site call through the registry', async () => {
    const callStub = sinon.stub(MicroFrontendRegistry, 'call')
    try {
      const site = { title: 'Site' }
      const el = await fixture(
        html`<enhanced-text haxcms-glossary .haxcmsSite=${site}>
          Some body text
        </enhanced-text>`,
      )
      await el.enhance()
      expect(callStub.callCount).to.equal(1)
      expect(callStub.getCall(0).args[0]).to.equal('@system/termsInPage')
      expect(callStub.getCall(0).args[1].type).to.equal('site')
      expect(callStub.getCall(0).args[1].site).to.equal(site)
      expect(callStub.getCall(0).args[1].wikipedia).to.equal(false)
      expect(el.loading).to.equal(false)
    } finally {
      callStub.restore()
    }
  })

  it('enhance() routes the glossary link call through the registry', async () => {
    const callStub = sinon.stub(MicroFrontendRegistry, 'call')
    try {
      const el = await fixture(
        html`<enhanced-text
          haxcms-glossary
          haxcms-site-location="https://example.com"
          wikipedia
          >Some body text</enhanced-text
        >`,
      )
      await el.enhance()
      expect(callStub.callCount).to.equal(1)
      expect(callStub.getCall(0).args[0]).to.equal('@system/termsInPage')
      expect(callStub.getCall(0).args[1].type).to.equal('link')
      expect(callStub.getCall(0).args[1].site).to.equal('https://example.com')
      expect(callStub.getCall(0).args[1].wikipedia).to.equal(true)
    } finally {
      callStub.restore()
    }
  })

  it('enhance() calls both flows in order when configured together', async () => {
    const callStub = sinon.stub(MicroFrontendRegistry, 'call')
    try {
      const el = await fixture(
        html`<enhanced-text
          vide
          haxcms-glossary
          haxcms-site-location="https://example.com"
          >Some body text</enhanced-text
        >`,
      )
      await el.enhance()
      expect(callStub.callCount).to.equal(2)
      expect(callStub.getCall(0).args[0]).to.equal('@enhancedText/textVide')
      expect(callStub.getCall(1).args[0]).to.equal('@system/termsInPage')
    } finally {
      callStub.restore()
    }
  })

  it('enhance() skips the registry without enhancement flags', async () => {
    const callStub = sinon.stub(MicroFrontendRegistry, 'call')
    try {
      const el = await fixture(
        html`<enhanced-text>Some body text</enhanced-text>`,
      )
      await el.enhance()
      expect(callStub.callCount).to.equal(0)
      expect(el.loading).to.equal(false)
      // glossary without a site or location also skips
      el.haxcmsGlossary = true
      await el.enhance()
      expect(callStub.callCount).to.equal(0)
    } finally {
      callStub.restore()
    }
  })

  it('firstUpdated auto-enhances once connected with flags', async () => {
    const callStub = sinon.stub(MicroFrontendRegistry, 'call')
    try {
      const el = await fixture(
        html`<enhanced-text auto vide>Some body text</enhanced-text>`,
      )
      await el.updateComplete
      expect(callStub.callCount).to.equal(1)
      expect(callStub.getCall(0).args[0]).to.equal('@enhancedText/textVide')
    } finally {
      callStub.restore()
    }
  })

  it('invokes the response callback data into innerHTML', async () => {
    const el = await fixture(
      html`<enhanced-text>Some body text</enhanced-text>`,
    )
    el.enhancedTextResponse({
      status: true,
      data: '<p>Enhanced <b>text</b></p>',
    })
    expect(el.innerHTML).to.contain('<b>text</b>')
  })

  it('passes the a11y audit with a vocab-term applied', async () => {
    const el = await fixture(
      html`<enhanced-text>This is sample text</enhanced-text>`,
    )
    el.applyTermFromList({
      status: true,
      data: [{ term: 'sample', definition: 'A representative part' }],
    })
    await el.updateComplete
    await expect(el).to.be.accessible()
  })
})
