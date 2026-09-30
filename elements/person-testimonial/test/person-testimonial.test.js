import { fixture, expect, html } from '@open-wc/testing'
import '../person-testimonial.js'
import { PersonTestimonial } from '../person-testimonial.js'

describe('person-testimonial test', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`
      <person-testimonial title="test-title"></person-testimonial>
    `)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })

  it('has the correct tag name', () => {
    expect(element.tagName.toLowerCase()).to.equal('person-testimonial')
    expect(PersonTestimonial.tag).to.equal('person-testimonial')
  })

  it('marks itself as OER schema SupportingMaterial', () => {
    // firstUpdated stamps the OER schema class on the host
    expect(element.getAttribute('typeof')).to.equal('oer:SupportingMaterial')
  })

  it('has undefined defaults for its data properties', () => {
    expect(element.image).to.equal(undefined)
    expect(element.name).to.equal(undefined)
    expect(element.position).to.equal(undefined)
    expect(element.describedBy).to.equal(undefined)
  })

  it('renders the quote scaffolding without an image', () => {
    expect(element.shadowRoot.querySelector('.card')).to.exist
    expect(element.shadowRoot.querySelector('.image')).to.not.exist
    expect(element.shadowRoot.querySelector('.arrow_right')).to.exist
    expect(element.shadowRoot.querySelector('.wrap')).to.exist
    expect(element.shadowRoot.querySelector('.testimonial')).to.exist
    expect(element.shadowRoot.querySelector('slot')).to.exist
    expect(element.shadowRoot.querySelector('#quotestart')).to.exist
    expect(element.shadowRoot.querySelector('#quoteend')).to.exist
  })

  it('renders the name and position with OER schema markup', async () => {
    element.name = 'Jane Doe'
    element.position = 'Chief Learner'
    await element.updateComplete
    const name = element.shadowRoot.querySelector('.name')
    expect(name.getAttribute('property')).to.equal('oer:name')
    expect(name.textContent).to.equal('Jane Doe')
    const position = element.shadowRoot.querySelector('.position')
    expect(position.textContent).to.equal('Chief Learner')
  })

  it('renders slotted testimonial content into the quote slot', async () => {
    const el = await fixture(html`
      <person-testimonial name="Jane Doe">
        This company rocks!
      </person-testimonial>
    `)
    expect(el.textContent.trim()).to.equal('This company rocks!')
    const slot = el.shadowRoot.querySelector('slot')
    expect(slot.getAttribute('property')).to.equal('oer:description')
  })

  describe('image rendering', () => {
    it('renders the image with OER schema markup when provided', async () => {
      // data URI so no real network request is ever made
      const src = 'data:image/gif;base64,R0lGODlhAQABAAAAADs='
      const el = await fixture(html`
        <person-testimonial
          name="Jane Doe"
          image="${src}"
          described-by="testimonial-source"
        ></person-testimonial>
      `)
      const img = el.shadowRoot.querySelector('.image img')
      expect(img).to.exist
      expect(img.getAttribute('property')).to.equal('oer:image')
      expect(img.getAttribute('src')).to.equal(src)
      expect(img.getAttribute('loading')).to.equal('lazy')
      expect(img.getAttribute('alt')).to.equal('Jane Doe')
      expect(img.getAttribute('aria-describedby')).to.equal(
        'testimonial-source',
      )
    })

    it('falls back to a meaningful alt when no name is given', async () => {
      const el = await fixture(html`
        <person-testimonial
          image="data:image/gif;base64,R0lGODlhAQABAAAAADs="
        ></person-testimonial>
      `)
      const img = el.shadowRoot.querySelector('.image img')
      // a11y fix: the image is informative (the testimonial's author), so
      // an empty decorative alt is wrong; fall back to a real description
      expect(img.getAttribute('alt')).to.equal('Person giving this testimonial')
    })

    it('uses the position as the alt when no name is given', async () => {
      const el = await fixture(html`
        <person-testimonial
          image="data:image/gif;base64,R0lGODlhAQABAAAAADs="
          position="Chief Learner"
        ></person-testimonial>
      `)
      const img = el.shadowRoot.querySelector('.image img')
      expect(img.getAttribute('alt')).to.equal('Chief Learner')
    })

    it('omits aria-describedby when described-by is unset', async () => {
      // a11y fix: an empty aria-describedby attribute is invalid; only
      // render it when a described-by value is actually set
      const el = await fixture(html`
        <person-testimonial
          name="Jane Doe"
          image="data:image/gif;base64,R0lGODlhAQABAAAAADs="
        ></person-testimonial>
      `)
      const img = el.shadowRoot.querySelector('.image img')
      expect(img.hasAttribute('aria-describedby')).to.be.false
    })

    it('removes the image when the property is cleared', async () => {
      const el = await fixture(html`
        <person-testimonial
          name="Jane Doe"
          image="data:image/gif;base64,R0lGODlhAQABAAAAADs="
        ></person-testimonial>
      `)
      expect(el.shadowRoot.querySelector('.image img')).to.exist
      // an empty string is falsy so the image block is removed entirely
      el.image = ''
      await el.updateComplete
      expect(el.shadowRoot.querySelector('.image')).to.not.exist
      el.image = undefined
      await el.updateComplete
      expect(el.shadowRoot.querySelector('.image')).to.not.exist
    })
  })

  describe('editable outline styles', () => {
    it('applies the hax-body editable outline variable when HAX activates', () => {
      // fixed (person-testimonial.js): the editable outline var was
      // misspelled with three dashes so it never matched the real
      // --hax-body-editable-outline variable and the fallback always won;
      // a custom outline supplied by HAX now actually applies
      element.setAttribute('data-hax-ray', 'block')
      element.setAttribute('data-hax-active', 'true')
      element.style.setProperty(
        '--hax-body-editable-outline',
        '4px solid rgb(10, 20, 30)',
      )
      const quote = element.shadowRoot.querySelector('.testimonial')
      const computed = getComputedStyle(quote)
      expect(computed.outlineWidth).to.equal('4px')
      expect(computed.outlineColor).to.equal('rgb(10, 20, 30)')
    })
  })

  describe('HAX integration', () => {
    it('exposes haxProperties as a lib file URL', () => {
      const url = PersonTestimonial.haxProperties
      expect(typeof url).to.equal('string')
      expect(url.endsWith('lib/person-testimonial.haxProperties.json')).to.be
        .true
    })
  })
})
