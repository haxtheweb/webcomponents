import { fixture, expect, html } from '@open-wc/testing'

import '../license-element.js'
import { LicenseElement, licenseList } from '../license-element.js'

const CC_KEYS = [
  'by',
  'by-sa',
  'by-nd',
  'by-nc',
  'by-nc-sa',
  'by-nc-nd',
]

describe('licenseList', () => {
  it('returns the full license map by default', () => {
    const list = new licenseList()
    CC_KEYS.forEach((key) => {
      expect(typeof list[key].name).to.equal('string')
      expect(typeof list[key].link).to.equal('string')
      expect(typeof list[key].image).to.equal('string')
    })
    expect(Object.keys(list).length).to.equal(6)
  })

  it('returns the full license map for explicit full mode', () => {
    const list = new licenseList('full')
    expect(list.by.name).to.equal('Attribution')
    expect(list.by.link).to.equal(
      'https://creativecommons.org/licenses/by/4.0/',
    )
  })

  it('returns a select list of names in select mode', () => {
    const list = new licenseList('select')
    CC_KEYS.forEach((key) => {
      expect(typeof list[key]).to.equal('string')
    })
    expect(list.by).to.equal('Attribution')
    expect(list['by-nc-sa']).to.equal(
      'Attribution non-commercial share a like',
    )
  })

  it('falls back to the full map for unknown modes', () => {
    const list = new licenseList('nonsense')
    expect(list.by.name).to.equal('Attribution')
  })
})

describe('license-element behavior', () => {
  it('has the correct tag name', () => {
    expect(LicenseElement.tag).to.equal('license-element')
  })

  it('instantiates as a LicenseElement', async () => {
    const el = await fixture(html`<license-element></license-element>`)
    expect(el instanceof LicenseElement).to.be.true
  })

  it('defaults creator, source, and moreLabel', async () => {
    const el = await fixture(html`<license-element></license-element>`)
    expect(el.creator).to.equal('(author)')
    expect(el.source).to.equal(null)
    expect(el.moreLabel).to.equal('on the licensing details page')
  })

  it('loads the full license list in the constructor', async () => {
    const el = await fixture(html`<license-element></license-element>`)
    expect(el.licenseList.by.name).to.equal('Attribution')
    expect(el.licenseList['by-nc-nd'].name).to.equal(
      'Attribution Non-commercial No derivatives',
    )
  })

  it('declares kebab-cased attribute mappings', () => {
    const props = LicenseElement.properties
    expect(props.licenseName.attribute).to.equal('license-name')
    expect(props.licenseImage.attribute).to.equal('license-image')
    expect(props.licenseLink.attribute).to.equal('license-link')
    expect(props.moreLabel.attribute).to.equal('more-label')
    expect(props.moreLink.attribute).to.equal('more-link')
    expect(props.hasMore.attribute).to.equal('has-more')
    expect(props).to.have.property('title')
    expect(props).to.have.property('creator')
    expect(props).to.have.property('source')
    expect(props).to.have.property('license')
  })

  it('derives license name, link, and image from the license shorthand', async () => {
    const el = await fixture(html`
      <license-element
        title="Wonderland"
        creator="Mad Hatter"
        source="https://haxtheweb.org/"
        license="by"
      ></license-element>
    `)
    expect(el.licenseName).to.equal('Attribution')
    expect(el.licenseLink).to.equal(
      'https://creativecommons.org/licenses/by/4.0/',
    )
    expect(el.licenseImage).to.equal(
      'https://i.creativecommons.org/l/by/4.0/88x31.png',
    )
  })

  it('renders the work title, creator, and source link', async () => {
    const el = await fixture(html`
      <license-element
        title="Wonderland"
        creator="Mad Hatter"
        source="https://haxtheweb.org/"
        license="by"
      ></license-element>
    `)
    const work = el.shadowRoot.querySelector('a.work-title')
    expect(work.getAttribute('href')).to.equal('https://haxtheweb.org/')
    expect(work.textContent.trim()).to.equal('Wonderland')
    const creator = el.shadowRoot.querySelector(
      'span[property="cc:attributionName"]',
    )
    expect(creator.textContent.trim()).to.equal('Mad Hatter')
  })

  it('renders the big license image with alt text', async () => {
    const el = await fixture(html`
      <license-element
        title="Wonderland"
        creator="Mad Hatter"
        source="https://haxtheweb.org/"
        license="by-sa"
      ></license-element>
    `)
    const link = el.shadowRoot.querySelector('a.big-license-link')
    expect(link.getAttribute('href')).to.equal(
      'https://creativecommons.org/licenses/by-sa/4.0/',
    )
    expect(link.getAttribute('target')).to.equal('_blank')
    const img = link.querySelector('img')
    expect(img.getAttribute('src')).to.equal(
      'https://i.creativecommons.org/l/by-sa/4.0/88x31.png',
    )
    expect(img.getAttribute('alt')).to.equal(
      'Attribution Share a like graphic',
    )
    expect(img.getAttribute('loading')).to.equal('lazy')
  })

  it('renders the license statement with a link to the deed', async () => {
    const el = await fixture(html`
      <license-element
        title="Wonderland"
        creator="Mad Hatter"
        source="https://haxtheweb.org/"
        license="by-nc"
      ></license-element>
    `)
    expect(
      el.shadowRoot.textContent.includes('is licensed under'),
    ).to.be.true
    const links = el.shadowRoot.querySelectorAll('a.license-link')
    const licenseLink = Array.from(links).find(
      (a) =>
        a.getAttribute('href') ===
        'https://creativecommons.org/licenses/by-nc/4.0/',
    )
    expect(!!licenseLink).to.be.true
    expect(licenseLink.textContent.trim()).to.equal(
      'Attribution non-commercial',
    )
  })

  it('omits the license statement without a license', async () => {
    const el = await fixture(html`
      <license-element
        title="Wonderland"
        creator="Mad Hatter"
        source="https://haxtheweb.org/"
      ></license-element>
    `)
    expect(el.shadowRoot.textContent.includes('is licensed under')).to.be
      .false
  })

  it('omits the big license image without a license', async () => {
    const el = await fixture(
      html`<license-element title="W"></license-element>`,
    )
    expect(!!el.shadowRoot.querySelector('a.big-license-link')).to.be.false
  })

  it('renders schema metadata for the supporting material', async () => {
    const el = await fixture(html`
      <license-element
        title="Wonderland"
        source="https://haxtheweb.org/"
        license="by"
      ></license-element>
    `)
    const body = el.shadowRoot.querySelector('div.license-body')
    expect(body.getAttribute('typeof')).to.equal('oer:SupportingMaterial')
    const name = el.shadowRoot.querySelector('meta[property="oer:name"]')
    expect(name.getAttribute('content')).to.equal('Wonderland')
    const uri = el.shadowRoot.querySelector('meta[property="oer:uri"]')
    expect(uri.getAttribute('content')).to.equal('https://haxtheweb.org/')
    const license = el.shadowRoot.querySelector('meta[rel="cc:license"]')
    expect(license.getAttribute('href')).to.equal(
      'https://creativecommons.org/licenses/by/4.0/',
    )
    expect(license.getAttribute('content')).to.equal(
      'License: Attribution',
    )
  })

  it('re-derives the license fields when license changes', async () => {
    const el = await fixture(html`
      <license-element license="by"></license-element>
    `)
    el.license = 'by-nd'
    await el.updateComplete
    expect(el.licenseName).to.equal('Attribution No derivatives')
    expect(el.licenseLink).to.equal(
      'https://creativecommons.org/licenses/by-nd/4.0/',
    )
    expect(el.licenseImage).to.equal(
      'https://i.creativecommons.org/l/by-nd/4.0/88x31.png',
    )
  })

  it('leaves derived fields alone for unknown license values', async () => {
    const el = await fixture(html`<license-element></license-element>`)
    el.license = 'not-a-real-license'
    await el.updateComplete
    expect(el.licenseName).to.equal(undefined)
    expect(el.licenseLink).to.equal(undefined)
    expect(el.licenseImage).to.equal(undefined)
  })

  it('renders the more-permissions block when has-more is set', async () => {
    const el = await fixture(html`
      <license-element
        title="Wonderland"
        creator="Mad Hatter"
        source="https://haxtheweb.org/"
        license="by"
        has-more
        more-link="https://example.com/more"
        more-label="in our FAQ"
      ></license-element>
    `)
    expect(
      el.shadowRoot.textContent.includes(
        'Permissions beyond the scope of this license are available',
      ),
    ).to.be.true
    const more = el.shadowRoot.querySelector(
      'a[rel="cc:morePermissions"]',
    )
    expect(more.getAttribute('href')).to.equal('https://example.com/more')
    expect(more.textContent.trim()).to.equal('in our FAQ')
  })

  it('omits the more-permissions block without has-more', async () => {
    const el = await fixture(html`
      <license-element more-link="https://example.com/more"></license-element>
    `)
    expect(
      el.shadowRoot.textContent.includes('Permissions beyond the scope'),
    ).to.be.false
  })

  // BUG: updated() assigns this.hasMode (a typo for hasMore) when moreLink
  // changes, so the more-permissions block never appears from a more-link
  // change alone. license-element.js line 271. Flip the assertions once the
  // typo is fixed (hasMode -> hasMore).
  it('BUG: setting more-link computes hasMode, not hasMore', async () => {
    const el = await fixture(html`
      <license-element more-link="https://example.com/more"></license-element>
    `)
    expect(el.hasMode).to.be.true
    // hasMore is never assigned (the typo writes hasMode instead)
    expect(el.hasMore).to.equal(undefined)
    expect(
      el.shadowRoot.textContent.includes('Permissions beyond the scope'),
    ).to.be.false
  })

  it('hides the element in footnote display mode', async () => {
    const el = await fixture(html`
      <license-element
        display-method="footnote"
        license="by"
      ></license-element>
    `)
    expect(globalThis.getComputedStyle(el).visibility).to.equal('hidden')
  })

  it('keeps the element visible by default', async () => {
    const el = await fixture(html`
      <license-element license="by"></license-element>
    `)
    expect(globalThis.getComputedStyle(el).visibility).to.equal('visible')
  })

  it('_computeHasMore only accepts non-empty links', async () => {
    const el = await fixture(html`<license-element></license-element>`)
    expect(el._computeHasMore('https://example.com')).to.be.true
    expect(el._computeHasMore('')).to.be.false
    expect(el._computeHasMore(undefined)).to.be.false
  })

  it('_licenseUpdated maps known shorthand to license fields', async () => {
    const el = await fixture(html`<license-element></license-element>`)
    el._licenseUpdated('by-nc-sa')
    expect(el.licenseName).to.equal(
      'Attribution non-commercial share a like',
    )
    expect(el.licenseLink).to.equal(
      'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    )
    expect(el.licenseImage).to.equal(
      'https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png',
    )
    el._licenseUpdated('unknown-license')
    // unknown values do not clobber the current fields
    expect(el.licenseName).to.equal(
      'Attribution non-commercial share a like',
    )
  })

  it('exposes haxProperties for the HAX editor', () => {
    const props = LicenseElement.haxProperties
    expect(props.canScale).to.equal(false)
    expect(props.canEditSource).to.equal(true)
    expect(props.gizmo.title).to.equal('License')
    expect(props.gizmo.icon).to.equal('icons:copyright')
    const licenseSetting = props.settings.configure.find(
      (s) => s.property === 'license',
    )
    expect(licenseSetting.inputMethod).to.equal('select')
    expect(licenseSetting.options.by).to.equal('Attribution')
    expect(props.demoSchema[0].tag).to.equal('license-element')
    expect(props.demoSchema[0].properties.license).to.equal('by')
  })

  it('passes the a11y audit with a full license', async () => {
    const el = await fixture(html`
      <license-element
        title="Wonderland"
        creator="Mad Hatter"
        source="https://haxtheweb.org/"
        license="by"
        has-more
        more-link="https://example.com/more"
      ></license-element>
    `)
    await expect(el).shadowDom.to.be.accessible()
  })
})
