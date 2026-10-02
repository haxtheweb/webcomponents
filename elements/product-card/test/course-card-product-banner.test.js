import { fixture, expect, html } from '@open-wc/testing'
import { CourseCard } from '../lib/course-card.js'
import { ProductBanner } from '../lib/product-banner.js'

// inline data URI so no image network request is ever issued
const DATA_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

describe('course-card', () => {
  it('renders the course link, image, icon, number, name and author', async () => {
    const el = await fixture(html`
      <course-card
        url="course-101.html"
        image="${DATA_IMAGE}"
        alt="AST 101 course card"
        number="AST 101"
        name="Astronomy"
        icon="icons:explore"
        author="Carl Sagan"
      ></course-card>
    `)
    await el.updateComplete
    const anchor = el.shadowRoot.querySelector('a')
    expect(anchor.getAttribute('href')).to.equal('course-101.html')
    expect(anchor.getAttribute('title')).to.equal('AST 101 course card')
    expect(
      el.shadowRoot.querySelector('#course_image').getAttribute('style'),
    ).to.include(DATA_IMAGE)
    expect(el.shadowRoot.querySelector('#course_number').textContent).to.equal(
      'AST 101',
    )
    expect(el.shadowRoot.querySelector('#course_name').textContent).to.equal(
      'Astronomy',
    )
    expect(
      el.shadowRoot.querySelector('#course_icon simple-icon').getAttribute('icon'),
    ).to.equal('icons:explore')
    expect(el.shadowRoot.querySelector('#course_author').textContent).to.equal(
      'By: Carl Sagan',
    )
  })

  it('omits the author block when no author is set', async () => {
    const el = await fixture(
      html`<course-card number="ART 10" name="Art"></course-card>`,
    )
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#course_author')).to.equal(null)
  })

  it('reflects size and zoom attributes', async () => {
    const el = await fixture(html`
      <course-card size="small" zoom></course-card>
    `)
    expect(el.getAttribute('size')).to.equal('small')
    expect(el.hasAttribute('zoom')).to.equal(true)
    expect(el.size).to.equal('small')
    expect(el.zoom).to.equal(true)
  })

  it('defines the element with defaults', () => {
    expect(globalThis.customElements.get('course-card')).to.exist
    const fresh = new CourseCard()
    expect(fresh.zoom).to.equal(false)
    expect(fresh.url).to.equal('')
    expect(fresh.image).to.equal('')
    expect(fresh.alt).to.equal('')
    expect(fresh.number).to.equal('')
    expect(fresh.name).to.equal('')
    expect(fresh.icon).to.equal('')
    expect(fresh.author).to.equal('')
  })
})

describe('product-banner', () => {
  it('renders primary and secondary text with logo and image', async () => {
    const el = await fixture(html`
      <product-banner
        primary-text="Explore the platform"
        secondary-text="HAXTheWeb"
        logo="${DATA_IMAGE}"
        image="${DATA_IMAGE}"
        alt="Banner image"
      ></product-banner>
    `)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('h1').textContent).to.equal(
      'Explore the platform',
    )
    expect(el.shadowRoot.querySelector('h2').textContent).to.equal('HAXTheWeb')
    const logoImg = el.shadowRoot.querySelector('.logo img')
    expect(logoImg.getAttribute('src')).to.equal(DATA_IMAGE)
    expect(
      el.shadowRoot.querySelector('.image_wrap').getAttribute('style'),
    ).to.include(DATA_IMAGE)
    // a11y: the CSS background image is exposed to AT through role/aria-label
    // on the div (alt on a div was a no-op; the decorative logo img keeps
    // alt="")
    const imageWrap = el.shadowRoot.querySelector('.image_wrap')
    expect(imageWrap.getAttribute('role')).to.equal('img')
    expect(imageWrap.getAttribute('aria-label')).to.equal('Banner image')
    expect(imageWrap.getAttribute('alt')).to.equal(null)
    expect(logoImg.getAttribute('alt')).to.equal('')
  })

  it('omits the text blocks when unset', async () => {
    const el = await fixture(html`<product-banner></product-banner>`)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.image-text')).to.equal(null)
    expect(el.shadowRoot.querySelector('.company_name')).to.equal(null)
    expect(el.shadowRoot.querySelector('.logo')).to.equal(null)
    // decorative default: with no alt the wrap carries no role/aria-label
    const imageWrap = el.shadowRoot.querySelector('.image_wrap')
    expect(imageWrap.getAttribute('role')).to.equal(null)
    expect(imageWrap.getAttribute('aria-label')).to.equal(null)
  })

  it('defines the element with defaults', () => {
    expect(globalThis.customElements.get('product-banner')).to.exist
    const fresh = new ProductBanner()
    expect(fresh.alt).to.equal('')
    expect(fresh.accentColor).to.equal('orange')
  })
})
