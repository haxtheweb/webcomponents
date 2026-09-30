import { expect } from '@open-wc/testing'
import { HaxSchematizer, HaxElementizer } from '../lib/HAXFields.js'
import { SimpleFields } from '@haxtheweb/simple-fields/simple-fields.js'

// direct lib import so istanbul sees lib/HAXFields.js statements
describe('HaxSchematizer', () => {
  it('maps every core input method to schema settings', () => {
    expect(HaxSchematizer.defaultSettings.type).to.equal('string')
    expect(HaxSchematizer.inputMethod.boolean.defaultSettings.type).to.equal(
      'boolean',
    )
    expect(HaxSchematizer.inputMethod.number.defaultSettings.type).to.equal(
      'number',
    )
    expect(HaxSchematizer.inputMethod.array.defaultSettings.type).to.equal(
      'array',
    )
    expect(HaxSchematizer.inputMethod.array.properties.label).to.equal(
      'itemLabel',
    )
    expect(HaxSchematizer.inputMethod.code.defaultSettings.type).to.equal(
      'markup',
    )
    expect(
      HaxSchematizer.inputMethod['code-editor'].defaultSettings.type,
    ).to.equal('markup')
    expect(HaxSchematizer.inputMethod.markup.defaultSettings.type).to.equal(
      'markup',
    )
    expect(HaxSchematizer.inputMethod.fieldset.defaultSettings.type).to.equal(
      'object',
    )
    expect(HaxSchematizer.inputMethod.object.defaultSettings.type).to.equal(
      'object',
    )
  })

  it('maps input methods to schema formats', () => {
    expect(HaxSchematizer.inputMethod.alt.defaultSettings.format).to.equal(
      'alt',
    )
    expect(HaxSchematizer.inputMethod.color.defaultSettings.format).to.equal(
      'color',
    )
    expect(
      HaxSchematizer.inputMethod.colorpicker.defaultSettings.format,
    ).to.equal('colorpicker')
    expect(
      HaxSchematizer.inputMethod.datepicker.defaultSettings.format,
    ).to.equal('date')
    expect(
      HaxSchematizer.inputMethod['date-time'].defaultSettings.format,
    ).to.equal('date-time')
    expect(
      HaxSchematizer.inputMethod.fileupload.defaultSettings.format,
    ).to.equal('fileupload')
    expect(
      HaxSchematizer.inputMethod.haxupload.defaultSettings.format,
    ).to.equal('fileupload')
    expect(
      HaxSchematizer.inputMethod.iconpicker.defaultSettings.format,
    ).to.equal('iconpicker')
    expect(
      HaxSchematizer.inputMethod['md-block'].defaultSettings.format,
    ).to.equal('md-block')
    expect(
      HaxSchematizer.inputMethod.monthpicker.defaultSettings.format,
    ).to.equal('month')
    expect(HaxSchematizer.inputMethod.select.defaultSettings.format).to.equal(
      'select',
    )
    expect(HaxSchematizer.inputMethod.radio.defaultSettings.format).to.equal(
      'radio',
    )
    expect(
      HaxSchematizer.inputMethod.slider.defaultSettings,
    ).to.deep.equal({ type: 'number', format: 'slider' })
    expect(HaxSchematizer.inputMethod.tabs.defaultSettings).to.deep.equal({
      type: 'object',
      format: 'tabs',
    })
    expect(HaxSchematizer.inputMethod.collapse.defaultSettings).to.deep.equal({
      type: 'object',
      format: 'collapse',
    })
    expect(
      HaxSchematizer.inputMethod.textarea.defaultSettings.format,
    ).to.equal('textarea')
    expect(
      HaxSchematizer.inputMethod.timepicker.defaultSettings.format,
    ).to.equal('time')
    expect(
      HaxSchematizer.inputMethod.weekpicker.defaultSettings.format,
    ).to.equal('week')
    expect(
      HaxSchematizer.inputMethod.screenRecorder.defaultSettings.format,
    ).to.equal('fileupload')
    expect(HaxSchematizer.inputMethod.srcset.defaultSettings.format).to.equal(
      'srcset',
    )
    expect(
      HaxSchematizer.inputMethod['hax-palette-picker'].defaultSettings.format,
    ).to.equal('hax-palette-picker')
    expect(
      HaxSchematizer.inputMethod['haxcms-theme-picker'].defaultSettings.format,
    ).to.equal('haxcms-theme-picker')
  })

  it('supports the simple-fields wrapper format', () => {
    expect(HaxSchematizer.format['simple-fields'].defaultSettings).to.deep.equal(
      {
        type: 'object',
        format: 'simple-fields',
      },
    )
  })
})

describe('HaxElementizer', () => {
  it('defines the default field element contract', () => {
    expect(HaxElementizer.defaultSettings.element).to.equal(
      'simple-fields-field',
    )
    expect(HaxElementizer.defaultSettings.errorProperty).to.equal('errorMessage')
    expect(HaxElementizer.defaultSettings.invalidProperty).to.equal('invalid')
    expect(HaxElementizer.defaultSettings.noWrap).to.equal(true)
    expect(HaxElementizer.defaultSettings.attributes.type).to.equal('text')
    expect(HaxElementizer.defaultSettings.properties.minLength).to.equal(
      'minlength',
    )
    expect(HaxElementizer.defaultSettings.properties.maxLength).to.equal(
      'maxlength',
    )
  })

  it('maps formats to form elements', () => {
    expect(HaxElementizer.format.radio.defaultSettings.element).to.equal(
      'simple-fields-field',
    )
    expect(HaxElementizer.format.radio.defaultSettings.attributes.type).to.equal(
      'radio',
    )
    expect(HaxElementizer.format.radio.defaultSettings.child.element).to.equal(
      'simple-fields-array-item',
    )
    expect(
      HaxElementizer.format.select.defaultSettings.properties.items,
    ).to.equal('itemsList')
    expect(HaxElementizer.format['simple-picker'].defaultSettings.element).to.equal(
      'simple-picker',
    )
    expect(
      HaxElementizer.format['hax-palette-picker'].defaultSettings.element,
    ).to.equal('hax-palette-picker')
    expect(
      HaxElementizer.format['haxcms-theme-picker'].defaultSettings.properties
        .showAllThemes,
    ).to.equal('showAllThemes')
  })

  it('maps types to form elements', () => {
    expect(HaxElementizer.type.array.defaultSettings.element).to.equal(
      'simple-fields-array',
    )
    expect(HaxElementizer.type.boolean.defaultSettings.attributes.type).to.equal(
      'checkbox',
    )
    expect(HaxElementizer.type.file.defaultSettings.element).to.equal(
      'hax-upload-field',
    )
    expect(
      HaxElementizer.type.integer.defaultSettings.properties.minimum,
    ).to.equal('min')
    expect(HaxElementizer.type.markup.defaultSettings.element).to.equal(
      'simple-fields-code',
    )
    expect(
      HaxElementizer.type.markup.format['md-block'].defaultSettings.element,
    ).to.equal('md-block')
    expect(HaxElementizer.type.number.defaultSettings.element).to.equal(
      'simple-fields-field',
    )
    expect(HaxElementizer.type.object.defaultSettings.element).to.equal(
      'simple-fields-fieldset',
    )
    expect(
      HaxElementizer.type.object.format.tabs.defaultSettings.element,
    ).to.equal('simple-fields-tabs')
    expect(
      HaxElementizer.type.object.format.collapse.defaultSettings.child.element,
    ).to.equal('a11y-collapse')
    expect(HaxElementizer.type.string.format.color.defaultSettings.attributes.type).to.equal(
      'color',
    )
    expect(
      HaxElementizer.type.string.format.fileupload.defaultSettings.element,
    ).to.equal('hax-upload-field')
    expect(
      HaxElementizer.type.string.format.iconpicker.defaultSettings.properties
        .options,
    ).to.equal('icons')
    expect(
      HaxElementizer.type.string.format.srcset.defaultSettings.element,
    ).to.equal('simple-fields-srcset')
  })

  it('drives a real SimpleFields conversion as its schematizer', () => {
    const fields = new SimpleFields()
    fields.schematizer = HaxSchematizer
    const schema = fields.fieldsToSchema([
      { property: 'a', inputMethod: 'boolean' },
      { property: 'b', inputMethod: 'code' },
      { property: 'c', inputMethod: 'textarea' },
    ])
    expect(schema.a.type).to.equal('boolean')
    expect(schema.b.type).to.equal('markup')
    expect(schema.c.format).to.equal('textarea')
  })
})
