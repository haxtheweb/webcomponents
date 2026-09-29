import { fixture, expect, html } from '@open-wc/testing'

import '../lib/simple-fields-url-combo-item.js'

describe('simple-fields-url-combo-item', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html`<simple-fields-url-combo-item
        value="https://example.com/page.html"
      ></simple-fields-url-combo-item>`,
    )
    await el.updateComplete
  })

  it('passes a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })

  it('instantiates with properties', () => {
    expect(el.value).to.equal('https://example.com/page.html')
  })

  it('iconTypes returns a map of file extensions to icons', () => {
    const types = el.iconTypes
    expect(types).to.exist
    expect(types.pdf).to.equal('hax:file-pdf')
    expect(types.doc).to.equal('hax:file-doc')
    expect(types.mp4).to.equal('av:movie')
    expect(types.mp3).to.equal('av:volume-up')
    expect(types.email).to.equal('icons:mail')
    expect(types.tel).to.equal('communication:phone')
  })

  it('currentLocation returns globalThis.location', () => {
    expect(el.currentLocation).to.equal(globalThis.location)
  })

  it('resourceURL returns a URL object', () => {
    expect(el.resourceURL).to.exist
    expect(el.resourceURL instanceof URL).to.equal(true)
  })

  it('isLocal returns false for external URL', () => {
    expect(el.isLocal).to.equal(false)
  })

  it('isLocal returns true for same hostname', async () => {
    el.value = globalThis.location.href
    await el.updateComplete
    expect(el.isLocal).to.equal(true)
  })

  it('fileExtension returns extension from URL', () => {
    expect(el.fileExtension).to.equal('html')
  })

  it('fileExtension returns extension from type when no URL extension', async () => {
    el.value = 'https://example.com/noextension'
    el.type = 'pdf'
    await el.updateComplete
    expect(el.fileExtension).to.equal('pdf')
  })

  it('fileExtension returns empty string for no extension', async () => {
    el.value = 'https://example.com/noextension'
    el.type = ''
    await el.updateComplete
    expect(el.fileExtension).to.equal('')
  })

  it('imageTypes returns array of image extensions', () => {
    expect(el.imageTypes).to.deep.equal(['gif', 'svg', 'png', 'jpg', 'jpeg'])
  })

  it('pageTypes returns array of page extensions', () => {
    expect(el.pageTypes).to.deep.equal(['html', 'htm', 'php', ''])
  })

  it('isPage returns true for html extension', () => {
    expect(el.isPage).to.equal(true)
  })

  it('isPage returns false for pdf extension', async () => {
    el.value = 'https://example.com/doc.pdf'
    await el.updateComplete
    expect(el.isPage).to.equal(false)
  })

  it('isImage returns true for jpg extension', async () => {
    el.value = 'https://example.com/image.jpg'
    await el.updateComplete
    expect(el.isImage).to.equal(true)
  })

  it('isImage returns false for html extension', () => {
    expect(el.isImage).to.equal(false)
  })

  it('isEmail returns true for mailto: protocol', async () => {
    el.value = 'mailto:test@example.com'
    await el.updateComplete
    expect(el.isEmail).to.equal(true)
  })

  it('isPhone returns true for tel: protocol', async () => {
    el.value = 'tel:+1234567890'
    await el.updateComplete
    expect(el.isPhone).to.equal(true)
  })

  it('isSamePage returns false for different page', () => {
    expect(el.isSamePage).to.equal(false)
  })

  it('isAnchor returns false for non-anchor URL', () => {
    expect(el.isAnchor).to.equal(false)
  })

  it('isAnchor returns true for same page with hash', async () => {
    el.value = globalThis.location.href + '#section'
    await el.updateComplete
    expect(el.isAnchor).to.equal(true)
  })

  it('previewSrc returns preview when set', async () => {
    el.preview = 'https://example.com/thumb.jpg'
    await el.updateComplete
    expect(el.previewSrc).to.equal('https://example.com/thumb.jpg')
  })

  it('previewSrc returns undefined when no preview', () => {
    expect(el.previewSrc).to.equal(undefined)
  })

  it('iconName returns custom icon when set', async () => {
    el.icon = 'custom-icon'
    await el.updateComplete
    expect(el.iconName).to.equal('custom-icon')
  })

  it('iconName returns anchor icon for anchor URL', async () => {
    el.value = globalThis.location.href + '#section'
    await el.updateComplete
    expect(el.iconName).to.equal('hax:anchor')
  })

  it('iconName returns page icon for local page', async () => {
    el.value = globalThis.location.href
    await el.updateComplete
    expect(el.iconName).to.equal('lrn:content')
  })

  it('iconName returns html icon for non-local page', () => {
    expect(el.iconName).to.equal('icons:language')
  })

  it('iconName returns email icon for mailto', async () => {
    el.value = 'mailto:test@example.com'
    await el.updateComplete
    expect(el.iconName).to.equal('icons:mail')
  })

  it('iconName for tel returns phone icon even though pageTypes includes empty string', async () => {
    // tel: URLs have no file extension, so fileExtension returns '' and
    // pageTypes includes '' making isPage=true too, but isPhone is now
    // checked before isPage/isLocal so the phone icon wins.
    el.value = 'tel:+1234567890'
    await el.updateComplete
    expect(el.isPhone).to.equal(true)
    expect(el.isPage).to.equal(true)
    expect(el.iconName).to.equal('communication:phone')
  })

  it('iconName returns file extension icon for known types', async () => {
    el.value = 'https://example.com/doc.pdf'
    await el.updateComplete
    expect(el.iconName).to.equal('hax:file-pdf')
  })

  it('iconName falls back to file icon for unknown extension', async () => {
    // iconTypes[fileExtension] returns undefined for unknown extensions
    // like 'xyz', so iconName should fall back to iconTypes['file']
    // instead of returning undefined.
    el.value = 'https://example.com/file.xyz'
    await el.updateComplete
    expect(el.iconName).to.equal(el.iconTypes['file'])
  })

  it('iconTemplate renders a simple-icon-lite', () => {
    const result = el.iconTemplate
    expect(result).to.exist
  })

  it('imageTemplate renders a span with background-image', () => {
    el.preview = 'https://example.com/img.jpg'
    const result = el.imageTemplate
    expect(result).to.exist
  })

  it('previewTemplate uses imageTemplate when preview is set', async () => {
    el.preview = 'https://example.com/preview.jpg'
    await el.updateComplete
    expect(el.previewTemplate).to.exist
  })

  it('previewTemplate uses iconTemplate when icon is set', async () => {
    el.icon = 'custom'
    el.preview = ''
    await el.updateComplete
    expect(el.previewTemplate).to.exist
  })

  it('previewTemplate uses iconTemplate based on iconName', async () => {
    el.preview = ''
    el.icon = ''
    el.value = 'https://example.com/doc.pdf'
    await el.updateComplete
    expect(el.previewTemplate).to.exist
  })

  it('labelTemplate renders with name when set', async () => {
    el.name = 'My Resource'
    await el.updateComplete
    expect(el.labelTemplate).to.exist
  })

  it('primaryLabelTemplate uses name when set', async () => {
    el.name = 'Primary'
    expect(el.primaryLabelTemplate).to.exist
  })

  it('primaryLabelTemplate uses value when no name', () => {
    el.name = ''
    expect(el.primaryLabelTemplate).to.exist
  })

  it('secondaryLabelTemplate uses value when name is set', () => {
    el.name = 'Named'
    el.value = 'https://example.com'
    expect(el.secondaryLabelTemplate).to.exist
  })

  it('secondaryLabelTemplate is empty when no value', () => {
    el.name = 'Named'
    el.value = ''
    const result = el.secondaryLabelTemplate
    expect(result).to.equal('')
  })
})
