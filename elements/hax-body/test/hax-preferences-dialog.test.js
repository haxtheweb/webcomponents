import { fixture, expect, html, oneEvent } from '@open-wc/testing'

import '../lib/hax-preferences-dialog.js'
import { HaxPreferencesDialog } from '../lib/hax-preferences-dialog.js'
import { HAXStore } from '../lib/hax-store.js'

describe('hax-preferences-dialog', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<hax-preferences-dialog></hax-preferences-dialog>`)
    await el.updateComplete
  })

  it('instantiates', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-preferences-dialog')
    expect(el.hideLink).to.equal(false)
  })

  it('has static tag', () => {
    expect(HaxPreferencesDialog.tag).to.equal('hax-preferences-dialog')
  })

  it('has t object with expected keys', () => {
    expect(el.t).to.have.property('learnAboutHAXTheWeb')
    expect(el.t).to.have.property('haxUITheme')
    expect(el.t).to.have.property('language')
    expect(el.t).to.have.property('english')
    expect(el.t).to.have.property('spanish')
  })

  describe('updateSchema', () => {
    it('creates schema with haxUiTheme property', () => {
      el.updateSchema()
      expect(el.schema).to.exist
      expect(el.schema.length).to.be.greaterThan(0)
      const themeProp = el.schema.find((s) => s.property === 'haxUiTheme')
      expect(themeProp).to.exist
      expect(themeProp.inputMethod).to.equal('radio')
    })

    it('sets schemaValues with default hax', () => {
      el.updateSchema()
      expect(el.schemaValues).to.exist
      expect(el.schemaValues.haxUiTheme).to.equal('hax')
    })

    it('schema has options for hax, haxdark, system', () => {
      el.updateSchema()
      const themeProp = el.schema.find((s) => s.property === 'haxUiTheme')
      expect(themeProp.options).to.have.property('hax')
      expect(themeProp.options).to.have.property('haxdark')
      expect(themeProp.options).to.have.property('system')
    })
  })

  describe('closeBtn', () => {
    it('dispatches hax-tray-button-click event', async () => {
      const listener = oneEvent(el, 'hax-tray-button-click')
      el.closeBtn({})
      const e = await listener
      expect(e.detail.eventName).to.equal('open-preferences')
      expect(e.detail.value).to.equal(true)
    })
  })

  describe('__valueChangedEvent', () => {
    it('sets HAXStore.globalPreferences when value present', () => {
      const originalPrefs = HAXStore.globalPreferences
      el.__valueChangedEvent({ detail: { value: { haxUiTheme: 'haxdark' } } })
      expect(HAXStore.globalPreferences.haxUiTheme).to.equal('haxdark')
      HAXStore.globalPreferences = originalPrefs
    })

    it('sets schemaValues when value present', () => {
      el.__valueChangedEvent({ detail: { value: { haxUiTheme: 'system' } } })
      expect(el.schemaValues.haxUiTheme).to.equal('system')
    })

    it('does nothing when no value', () => {
      const originalPrefs = HAXStore.globalPreferences
      el.__valueChangedEvent({ detail: {} })
      // Should not crash, and should not change globalPreferences
      HAXStore.globalPreferences = originalPrefs
    })
  })

  it('renders simple-fields form', () => {
    const form = el.shadowRoot.querySelector('#settingsform')
    expect(form).to.exist
  })
})
