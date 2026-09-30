import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'

import '../lib/course-intro.js'
import '../lib/course-intro-header.js'
import '../lib/course-intro-lesson-plan.js'
import '../lib/course-intro-lesson-plans.js'

const richManifest = () => ({
  title: 'Course Title',
  description: 'Course Description',
  metadata: {
    theme: {
      variables: {
        icon: 'icons:school',
        image: 'banner.jpg',
        hexCode: '#00ff00',
      },
    },
  },
  items: [
    {
      id: 'intro',
      title: 'Introduction',
      slug: 'introduction',
      parent: null,
      location: 'pages/introduction',
    },
    {
      id: 'unit-1',
      title: 'Unit 1',
      slug: 'unit-1',
      parent: null,
      location: 'pages/unit-1',
    },
    {
      id: 'child-1',
      title: 'Child Page',
      slug: 'child-1',
      parent: 'unit-1',
      location: 'pages/child-1',
    },
  ],
})

const settle = () => new Promise((resolve) => setTimeout(resolve, 60))

describe('course-intro family', () => {
  let savedManifest

  before(() => {
    savedManifest = store.manifest
    store.manifest = richManifest()
  })

  after(() => {
    store.manifest = savedManifest
  })

  describe('course-intro-header', () => {
    it('renders manifest driven title, description, icon, image, and color', async () => {
      const el = await fixture(html`
        <course-intro-header>
          <span slot="header-left">Brand left</span>
          <span slot="outline-title">Course outline</span>
        </course-intro-header>
      `)
      await settle()
      expect(el.title).to.equal('Course Title')
      expect(el.description).to.equal('Course Description')
      expect(el.icon).to.equal('icons:school')
      expect(el.color).to.equal('#00ff00')
      expect(el.backgroundImage).to.equal('url(\'banner.jpg\')')
      expect(
        el.shadowRoot.querySelector('#title').textContent.trim(),
      ).to.equal('Course Title')
      expect(
        el.shadowRoot.querySelector('#sub-heading').textContent.trim(),
      ).to.equal('Course Description')
      expect(
        el.shadowRoot.querySelector('#course-icon').getAttribute('icon'),
      ).to.equal('icons:school')
      expect(
        el.shadowRoot.querySelector('#sub-heading').getAttribute('style'),
      ).to.include('#00ff00')
      expect(
        el.shadowRoot.querySelector('#header').getAttribute('style'),
      ).to.include('banner.jpg')
      expect(el.textContent).to.include('Brand left')
      expect(el.textContent).to.include('Course outline')
    })

    it('keeps empty defaults without a manifest', async () => {
      const saved = store.manifest
      store.manifest = null
      const el = await fixture(html`<course-intro-header></course-intro-header>`)
      await settle()
      expect(el.title).to.equal('')
      expect(el.description).to.equal('')
      expect(el.icon).to.equal('')
      expect(el.backgroundImage).to.equal('')
      store.manifest = saved
    })
  })

  describe('course-intro-lesson-plans', () => {
    it('filters manifest items to top level non-introduction pages', async () => {
      const el = await fixture(
        html`<course-intro-lesson-plans></course-intro-lesson-plans>`,
      )
      await settle()
      await el.updateComplete
      expect(el.items.length).to.equal(1)
      expect(el.items[0].slug).to.equal('unit-1')
      const plans = el.shadowRoot.querySelectorAll('course-intro-lesson-plan')
      expect(plans.length).to.equal(1)
      expect(plans[0].getAttribute('title')).to.equal('Unit 1')
      expect(plans[0].getAttribute('link')).to.equal('unit-1')
    })

    it('exposes _itemsChanged filtering directly', () => {
      const el = globalThis.document.createElement(
        'course-intro-lesson-plans',
      )
      el._itemsChanged([
        { slug: 'introduction', parent: null, title: 'Intro' },
        { slug: 'unit-2', parent: null, title: 'Unit 2' },
        { slug: 'nested', parent: 'unit-2', title: 'Nested' },
      ])
      expect(el.items.length).to.equal(1)
      expect(el.items[0].slug).to.equal('unit-2')
    })
  })

  describe('course-intro', () => {
    it('renders header, lesson plans, and footer with manifest color', async () => {
      const el = await fixture(html`
        <course-intro>
          <span slot="header-left">Header left</span>
          <span slot="outline-title">Outline</span>
          <span slot="footer-left">Footer left</span>
          <span slot="footer-right">Footer right</span>
        </course-intro>
      `)
      await settle()
      await el.updateComplete
      expect(el.color).to.equal('#00ff00')
      expect(el.shadowRoot.querySelector('course-intro-header')).to.exist
      expect(el.shadowRoot.querySelector('course-intro-lesson-plans')).to.exist
      const footer = el.shadowRoot.querySelector('.course-intro-footer')
      expect(footer).to.exist
      expect(footer.getAttribute('part')).to.equal('course-intro-footer')
      expect(footer.getAttribute('style')).to.include('#00ff00')
      expect(el.textContent).to.include('Footer left')
      expect(el.textContent).to.include('Footer right')
    })
  })
})

describe('course-intro-lesson-plan', () => {
  it('renders a link with the title', async () => {
    const el = await fixture(html`
      <course-intro-lesson-plan title="Unit 3" link="unit-3"></course-intro-lesson-plan>
    `)
    await el.updateComplete
    const link = el.shadowRoot.querySelector('#container')
    expect(link.getAttribute('href')).to.equal('unit-3')
    expect(el.shadowRoot.querySelector('#title').textContent).to.equal('Unit 3')
    await expect(el).shadowDom.to.be.accessible()
  })
})
