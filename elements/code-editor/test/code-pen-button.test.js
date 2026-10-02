import { expect, html } from '@open-wc/testing'
import { CodePenButton } from '../lib/code-pen-button.js'

// FIXED (issue #3102 bug 20): the input[type=image] src is now an inline
// data-URI SVG baked into the static template (previously a hardcoded
// remote https:// S3 asset that fired a real network request on every
// render). Lifecycle hooks are still invoked directly and render() is
// evaluated for its TemplateResult so the suite stays fully hermetic.

describe('code-pen-button', () => {
  it('registers the code-pen-button custom element', () => {
    expect(globalThis.customElements.get('code-pen-button')).to.exist
  })

  it('constructs with default values', () => {
    const el = globalThis.document.createElement('code-pen-button')
    expect(el.checkItOut).to.equal('Check it out on codepen')
    expect(el.endPoint).to.equal('https://codepen.io/pen/define')
    expect(typeof el.data).to.equal('object')
    // no update cycle has run, so dataString keeps its constructor default
    expect(el.dataString).to.equal('')
  })

  it('renders a form template bound to endPoint, dataString and checkItOut', () => {
    const el = globalThis.document.createElement('code-pen-button')
    const template = el.render()
    // interpolations evaluate in template order: action, data value, alt
    expect(template.values[0]).to.equal('https://codepen.io/pen/define')
    expect(template.values[1]).to.equal('')
    expect(template.values[2]).to.equal('Check it out on codepen')
    // static structure of the form post
    const staticText = template.strings.join('')
    expect(staticText).to.contain('method="post"')
    expect(staticText).to.contain('target="_blank"')
    expect(staticText).to.contain('type="hidden"')
    expect(staticText).to.contain('type="image"')
    expect(staticText).to.contain('part="button"')
    // on-prem (issue #3102 bug 20): the image asset is an inline data URI
    // and no remote S3 URL remains anywhere in the template
    expect(staticText).to.contain('src="data:image/svg+xml')
    expect(staticText).to.not.contain('s3-us-west-2')
    expect(staticText).to.not.contain('https://')
  })

  it('derives dataString from the data object in updated', () => {
    const el = globalThis.document.createElement('code-pen-button')
    // detached elements never perform their first update, so updated is
    // invoked directly instead of waiting on an update cycle
    el.data = { title: 'My Pen', html: '<p>hello</p>' }
    el.updated(new Map([['data', {}]]))
    expect(el.dataString).to.contain('My Pen')
    expect(el.dataString).to.contain('&quot;')
    expect(el.dataString).to.not.contain('"')
    // the real render evaluates against the derived state without committing
    const template = el.render()
    expect(template.values[1]).to.equal(el.dataString)
  })

  it('firstUpdated stamps the title from checkItOut', () => {
    const el = globalThis.document.createElement('code-pen-button')
    el.checkItOut = 'View this pen'
    el.firstUpdated(new Map())
    expect(el.getAttribute('title')).to.equal('View this pen')
  })

  it('escapes double quotes and apostrophes in _getDataString', () => {
    const el = globalThis.document.createElement('code-pen-button')
    const out = el._getDataString({ a: 'say "hi"', b: "it's" })
    expect(out).to.not.contain('"')
    expect(out).to.not.contain("'")
    expect(out).to.contain('&quot;')
    expect(out).to.contain('&apos;')
  })
})
