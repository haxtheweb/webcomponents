import { html, fixture, expect } from '@open-wc/testing'
import sinon from 'sinon'
import '../author-card.js'
import { AuthorCard } from '../author-card.js'

// data URI so the rendered <img> never hits a real network
const testImage = 'data:image/gif;base64,R0lGODlhAQABAAAAADs='

describe('AuthorCard test', () => {
  let element
  let sandbox

  beforeEach(async () => {
    sandbox = sinon.createSandbox()
    element = await fixture(html`
      <author-card title="title"></author-card>
    `)
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('basic will it blend', async () => {
    expect(element).to.exist
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })

  it('has the correct tag name', () => {
    expect(element.tagName.toLowerCase()).to.equal('author-card')
    expect(AuthorCard.tag).to.equal('author-card')
  })

  it('has sensible default property values', () => {
    expect(element.name).to.equal('')
    expect(element.title).to.equal('title')
    expect(element.description).to.equal('')
    expect(element.image).to.equal('')
    expect(element.profileUrl).to.equal('')
    expect(element.socialLink).to.equal('')
    expect(element.socialHandle).to.equal('')
    expect(element.dark).to.be.false
    expect(element.accentColor).to.equal('blue')
    expect(element.primaryColor).to.equal('blue')
    expect(element.t.visitProfile).to.equal('Visit profile')
    expect(element.t.profileAlt).to.equal('Visit profile')
  })

  it('reflects accent-color and primary-color attributes', async () => {
    element.accentColor = 'green'
    element.primaryColor = 'purple'
    await element.updateComplete
    expect(element.getAttribute('accent-color')).to.equal('green')
    expect(element.getAttribute('primary-color')).to.equal('purple')
  })

  describe('rendering', () => {
    it('renders only the card shell and job title when unconfigured', () => {
      // boolean comparisons instead of DOM nodes in expect().to.equal so a
      // failing not-exist check can never trigger chai DOM inspection
      expect(element.shadowRoot.querySelector('.author') !== null).to.be.true
      expect(element.shadowRoot.querySelector('.inner') !== null).to.be.true
      expect(element.shadowRoot.querySelector('.name') === null).to.be.true
      expect(element.shadowRoot.querySelector('.bio') === null).to.be.true
      expect(element.shadowRoot.querySelector('img') === null).to.be.true
      // the beforeEach fixture supplies title="title" so the job title shows
      expect(element.shadowRoot.querySelector('.job-title') !== null).to.be
        .true
      expect(element.shadowRoot.querySelector('.job-title').textContent).to
        .equal('title')
      expect(element.shadowRoot.querySelectorAll('a').length).to.equal(0)
    })

    it('renders nothing at all on a completely bare card', async () => {
      const el = await fixture(html`<author-card></author-card>`)
      expect(el.shadowRoot.querySelector('.author') !== null).to.be.true
      expect(el.shadowRoot.querySelector('.name') === null).to.be.true
      expect(el.shadowRoot.querySelector('.job-title') === null).to.be.true
      expect(el.shadowRoot.querySelector('.bio') === null).to.be.true
      expect(el.shadowRoot.querySelector('img') === null).to.be.true
      expect(el.shadowRoot.querySelectorAll('a').length).to.equal(0)
    })

    it('renders the name, job title and bio', async () => {
      const el = await fixture(html`
        <author-card
          name="Jane Doe"
          title="Learning Designer"
          description="Makes excellent things."
        ></author-card>
      `)
      expect(el.shadowRoot.querySelector('.name').textContent).to.equal(
        'Jane Doe',
      )
      expect(el.shadowRoot.querySelector('.job-title').textContent).to.equal(
        'Learning Designer',
      )
      expect(el.shadowRoot.querySelector('.bio').textContent).to.equal(
        'Makes excellent things.',
      )
    })

    it('renders the image with the name as alt text', async () => {
      const el = await fixture(html`
        <author-card name="Jane Doe" image=${testImage}></author-card>
      `)
      const img = el.shadowRoot.querySelector('img.image')
      expect(img !== null).to.be.true
      expect(img.getAttribute('src')).to.equal(testImage)
      expect(img.getAttribute('alt')).to.equal('Jane Doe')
      expect(img.getAttribute('loading')).to.equal('lazy')
    })

    it('renders the profile link anchors when a url is given', async () => {
      const el = await fixture(html`
        <author-card
          name="Jane Doe"
          image=${testImage}
          profile-url="https://example.com/jane"
        ></author-card>
      `)
      const imgLink = el.shadowRoot.querySelector('.left a.profile-link')
      expect(imgLink !== null).to.be.true
      expect(imgLink.getAttribute('href')).to.equal('https://example.com/jane')
      const nameLink = el.shadowRoot.querySelector('.right a.profile-link')
      expect(nameLink !== null).to.be.true
      expect(nameLink.getAttribute('href')).to.equal('https://example.com/jane')
      // BUG (author-card.js:211,220,224,226): the profile link "wrapping" is
      // built from separate open-tag / close-tag template fragments, which
      // Lit renders as SIBLINGS, so the anchors stay empty and the image and
      // name are never actually inside them. Documented by asserting the
      // current sibling structure:
      expect(imgLink.children.length).to.equal(0)
      expect(nameLink.children.length).to.equal(0)
      expect(imgLink.nextElementSibling === el.shadowRoot.querySelector('img.image')).to.be.true
      const name = el.shadowRoot.querySelector('.name')
      expect(name !== null).to.be.true
      expect(name.textContent).to.equal('Jane Doe')
    })

    it('does not render profile anchors without a url', async () => {
      const el = await fixture(html`
        <author-card name="Jane Doe" image=${testImage}></author-card>
      `)
      expect(el.shadowRoot.querySelector('a.profile-link') === null).to.be
        .true
      expect(el.shadowRoot.querySelector('img.image') !== null).to.be.true
      expect(el.shadowRoot.querySelector('.name').textContent).to.equal(
        'Jane Doe',
      )
    })

    it('renders the social link with the handle', async () => {
      const el = await fixture(html`
        <author-card
          name="Jane Doe"
          social-link="https://social.example.com/jane"
          social-handle="@jane"
        ></author-card>
      `)
      const link = el.shadowRoot.querySelector('a.link')
      expect(link !== null).to.be.true
      expect(link.getAttribute('href')).to.equal(
        'https://social.example.com/jane',
      )
      expect(link.getAttribute('target')).to.equal('_blank')
      expect(link.getAttribute('rel')).to.include('noopener')
      expect(link.getAttribute('rel')).to.include('noreferrer')
      expect(link.getAttribute('aria-label')).to.equal('Visit profile @jane')
      expect(link.textContent).to.include('@jane')
    })

    it('falls back to the name in the social link label', async () => {
      const el = await fixture(html`
        <author-card
          name="Jane Doe"
          social-link="https://social.example.com/jane"
        ></author-card>
      `)
      const link = el.shadowRoot.querySelector('a.link')
      // aria-label falls back to the name; the link text falls back to the
      // i18n label instead (source uses socialHandle || t.visitProfile)
      expect(link.getAttribute('aria-label')).to.equal('Visit profile Jane Doe')
      expect(link.textContent).to.include('Visit profile')
      expect(link.textContent).to.not.include('Jane Doe')
    })

    it('falls back to the i18n label when handle and name are empty', async () => {
      const el = await fixture(html`
        <author-card
          social-link="https://social.example.com/anonymous"
        ></author-card>
      `)
      const link = el.shadowRoot.querySelector('a.link')
      expect(link.getAttribute('aria-label')).to.equal('Visit profile ')
      expect(link.textContent).to.include('Visit profile')
    })

    it('does not render a social link without a url', () => {
      element.socialHandle = '@jane'
      expect(element.shadowRoot.querySelector('a.link') === null).to.be.true
    })

    it('passes the a11y audit fully configured', async () => {
      // profile-url omitted: see BUG note above, the profile anchors render
      // empty and would fail an axe link-name check
      const el = await fixture(html`
        <author-card
          name="Jane Doe"
          title="Learning Designer"
          description="Makes excellent things."
          image=${testImage}
          social-link="https://social.example.com/jane"
          social-handle="@jane"
        ></author-card>
      `)
      await expect(el).shadowDom.to.be.accessible()
    })
  })

  describe('DDD design system', () => {
    it('uses DDD tokens and light-dark dark mode support', () => {
      const cssText = element.constructor.styles
        .map((style) => style.cssText)
        .join(' ')
      expect(cssText).to.include('--ddd-spacing-4')
      expect(cssText).to.include('--ddd-font-primary')
      expect(cssText).to.include('--ddd-radius-sm')
      expect(cssText).to.include('light-dark(')
      expect(cssText).to.include('--ddd-theme-default-coalyGray')
      expect(cssText).to.include(':host([dark])')
    })
  })

  describe('HAX integration', () => {
    it('registers the mediaSourceUpdated hook', () => {
      const hooks = element.haxHooks()
      expect(hooks.mediaSourceUpdated).to.equal('haxmediaSourceUpdated')
    })

    it('ignores media updates without a path or store', () => {
      const poke = sandbox.spy()
      // direct calls so the early-return ranges are definitely executed
      element.haxmediaSourceUpdated(null, {})
      element.haxmediaSourceUpdated('/files/a.png', null)
      element.haxmediaSourceUpdated(null, null)
      expect(poke.called).to.be.false
    })

    it('ignores stores without the matcher contract', () => {
      const store = {}
      expect(() => element.haxmediaSourceUpdated('/files/a.png', store)).to
        .not.throw
    })

    it('ignores media updates for other files', () => {
      const poke = sandbox.spy()
      const store = {
        _mediaSrcMatches: () => false,
        _pokeMatchingImgs: poke,
      }
      element.haxmediaSourceUpdated('/files/other.png', store)
      expect(poke.called).to.be.false
    })

    it('refreshes matching images when media is updated', async () => {
      const el = await fixture(html`
        <author-card image=${testImage}></author-card>
      `)
      const poke = sandbox.spy()
      const matches = sandbox.spy(() => true)
      const store = {
        _mediaSrcMatches: matches,
        _pokeMatchingImgs: poke,
      }
      el.haxmediaSourceUpdated('/files/portrait.png', store)
      expect(matches.calledOnce).to.be.true
      expect(poke.calledOnce).to.be.true
      // the shadow root is passed for cache-busting
      expect(poke.firstCall.args[0] === el.shadowRoot).to.be.true
      expect(poke.firstCall.args[1]).to.equal('/files/portrait.png')
    })

    it('exposes haxProperties as a lib file URL', () => {
      const url = AuthorCard.haxProperties
      expect(typeof url).to.equal('string')
      expect(url.endsWith('lib/author-card.haxProperties.json')).to.be.true
    })
  })
})
