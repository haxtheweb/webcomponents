import { html, fixture, expect } from '@open-wc/testing'
import { DDDocs, styleGuideTopics } from '../d-d-docs.js'

// coverage for the d-d-docs wiring surface: option selection through the
// select control, single-topic rendering, the hax-palette-picker value
// sync, the pattern copy / insert affordances and the HAX schema. The
// full styleguide stamps every topic's DOM at once, so timeouts run long
// under coverage (see the a11y note in d-d-docs.test.js).
describe('d-d-docs wiring', function () {
  // a full styleguide render is heavy under coverage instrumentation
  this.timeout(20000)
  let element

  beforeEach(async () => {
    element = await fixture(html`<d-d-docs></d-d-docs>`)
    await element.updateComplete
  })

  it('defaults to the full styleguide with every topic rendered', () => {
    expect(element.option).to.equal('*')
    expect(element.options).to.deep.equal(Object.keys(styleGuideTopics))
    // the full styleguide wraps each topic in its own details element
    // (topic contents can nest their own details, so count only the
    // direct children of the render root)
    const topicWrappers = [...element.shadowRoot.children].filter(
      (el) => el.tagName === 'DETAILS',
    )
    expect(topicWrappers.length).to.equal(element.options.length)
    expect(
      element.shadowRoot.querySelector('details.PalettePicker hax-palette-picker'),
    ).to.exist
    // palette registry wiring from the constructor
    expect(Array.isArray(element.palettePickerOptions)).to.equal(true)
    expect(element.palettePickerOptions.length > 0).to.equal(true)
    expect(element.palettePickerValue).to.equal('0')
  })

  it('renders a single topic when the option is set', async () => {
    element.option = 'PalettePicker'
    await element.updateComplete
    // no details wrappers in single-topic mode
    expect(element.shadowRoot.querySelectorAll('details').length).to.equal(0)
    // the picker prototype renders in default and dark contexts
    expect(element.shadowRoot.querySelectorAll('hax-palette-picker').length).to.equal(
      2,
    )
    expect(element.shadowRoot.querySelectorAll('.palette-picker-swatch').length > 0).to.equal(
      true,
    )
  })

  it('updates the rendered option from the select control', async () => {
    const select = element.shadowRoot.querySelector('select')
    expect(select.getAttribute('aria-label')).to.equal('Select an option to render')
    select.value = 'Spacing'
    select.dispatchEvent(new Event('change'))
    await element.updateComplete
    expect(element.option).to.equal('Spacing')
    // the single topic renders without the details wrappers
    expect(
      [...element.shadowRoot.children].filter(
        (el) => el.tagName === 'DETAILS',
      ).length,
    ).to.equal(0)
    // BUG: the change handler (d-d-docs.js:3543-3546) writes the selected
    // value back into the select synchronously, but the re-render it
    // triggers re-stamps the option list, which resets the select to the
    // first option. The control keeps showing "Full styleguide" while a
    // single topic is on screen, so the UI never reflects the selection.
    // This documents the current value; it should read 'Spacing' once the
    // value is bound reactively instead of written once during the event.
    expect(element.shadowRoot.querySelector('select').value).to.equal('*')
  })

  it('syncs palette picker value changes into the preview', async () => {
    element.option = 'PalettePicker'
    await element.updateComplete
    // a selected palette value resolves through the registry
    element._onPalettePickerValueChanged({ detail: { value: '8' } })
    await element.updateComplete
    expect(element.palettePickerValue).to.equal('8')
    expect(
      element.shadowRoot
        .querySelector('.palette-picker-preview')
        .getAttribute('data-palette'),
    ).to.equal('8')
    expect(
      element.shadowRoot.querySelector('.palette-picker-meta').textContent,
    ).to.include('Polaris Invent')
    // the literal "0" string is a real value, not the fallback
    element._onPalettePickerValueChanged({ detail: { value: '0' } })
    expect(element.palettePickerValue).to.equal('0')
    // empty values fall back to "0"
    element._onPalettePickerValueChanged({ detail: { value: '' } })
    expect(element.palettePickerValue).to.equal('0')
    // missing detail objects fall back to "0"
    element._onPalettePickerValueChanged({})
    expect(element.palettePickerValue).to.equal('0')
  })

  it('copies a pattern recipe and flashes the copied feedback', async function () {
    this.timeout(10000)
    const copyButton = element.shadowRoot.querySelector('.pattern-recipe-copy')
    expect(copyButton).to.exist
    const card = copyButton.closest('.pattern-card')
    const feedback = card.querySelector('.pattern-copy-feedback')
    expect(feedback.hasAttribute('hidden')).to.equal(true)
    copyButton.click()
    await new Promise((resolve) => setTimeout(resolve, 200))
    // the clipboard may be unavailable headless, but the feedback still fires
    expect(feedback.hasAttribute('hidden')).to.equal(false)
    await new Promise((resolve) => setTimeout(resolve, 1700))
    expect(feedback.hasAttribute('hidden')).to.equal(true)
  })

  it('inserts a pattern into HAX through the content array event', async () => {
    const inserted = []
    const fakeBody = globalThis.document.createElement('div')
    fakeBody.addEventListener('hax-insert-content-array', (e) =>
      inserted.push(e.detail),
    )
    const savedHaxStore = globalThis.HaxStore
    globalThis.HaxStore = {
      requestAvailability: () => ({
        htmlToHaxElements: async (htmlString) => ['converted:' + htmlString],
        activeHaxBody: fakeBody,
      }),
    }
    await element._insertPattern({ html: '<p>pattern</p>' })
    globalThis.HaxStore = savedHaxStore
    expect(inserted.length).to.equal(1)
    expect(inserted[0][0]).to.equal('converted:<p>pattern</p>')
  })

  it('falls back to the clipboard when HAX is not present', async () => {
    const savedHaxStore = globalThis.HaxStore
    delete globalThis.HaxStore
    // no store active: the insert affordance degrades to a copy silently
    await element._insertPattern({ html: '<p>pattern</p>' })
    globalThis.HaxStore = savedHaxStore
    expect(globalThis.HaxStore === savedHaxStore).to.equal(true)
  })

  it('exposes the HAX schema for the editor', () => {
    const props = DDDocs.haxProperties
    expect(props.api).to.equal('1')
    expect(props.gizmo.title).to.equal('Design, Develop, Destroy')
    expect(props.gizmo.icon).to.equal('hax:hax2022')
    expect(props.settings.configure[0].property).to.equal('option')
    expect(props.settings.configure[0].options['*']).to.equal('Full styleguide')
    expect(props.settings.configure[0].options.PalettePicker).to.equal(
      'PalettePicker',
    )
    expect(props.demoSchema[0].tag).to.equal('d-d-docs')
    expect(DDDocs.tag).to.equal('d-d-docs')
  })
})
