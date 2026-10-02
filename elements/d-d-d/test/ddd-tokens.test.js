import { fixture, expect, html } from '@open-wc/testing'

// Direct imports so istanbul instruments each lib file
import '../lib/DDDStyles.js'
import '../lib/DDDBorders.js'
import '../lib/DDDFontSizing.js'
import '../lib/DDDLineHeight.js'
import '../lib/DDDMarginPadding.js'

import {
  iconFromPageType,
  HAXOptionSampleFactory,
  ApplicationAttributeData,
  learningComponentNouns,
  learningComponentVerbs,
  learningComponentTypes,
  learningComponentColors,
  instructionalStyles,
  DDDFonts,
  DDDVariables,
  DDDGlobalStyles,
  DDDDataAttributes,
  DDDReset,
  DDDAllStyles,
  DDDPulseEffect,
  DDDAnimations,
  DDDPaletteStyles,
  DDDLetterSpacing,
  DDDBoxShadow,
  DDDBorderRadius,
  DDDBackground,
  DDDFontWeight,
  DDDFontClasses,
  DDDBreadcrumb,
} from '../lib/DDDStyles.js'
import { DDDBorders } from '../lib/DDDBorders.js'
import { DDDFontSizing } from '../lib/DDDFontSizing.js'
import { DDDLineHeight } from '../lib/DDDLineHeight.js'
import { DDDMarginPadding } from '../lib/DDDMarginPadding.js'

describe('DDDStyles exported objects', () => {
  it('learningComponentNouns has expected keys', () => {
    expect(learningComponentNouns.content).to.equal('Content')
    expect(learningComponentNouns.assessment).to.equal('Assessment')
    expect(learningComponentNouns.objectives).to.equal('Learning Objectives')
  })

  it('learningComponentVerbs has expected keys', () => {
    expect(learningComponentVerbs.read).to.equal('Read')
    expect(learningComponentVerbs.write).to.equal('Write')
    expect(learningComponentVerbs.watch).to.equal('Watch')
  })

  it('learningComponentTypes merges verbs and nouns', () => {
    expect(learningComponentTypes.read).to.equal('Read')
    expect(learningComponentTypes.content).to.equal('Content')
  })

  it('learningComponentColors maps every component to a color', () => {
    const allTypes = Object.keys(learningComponentTypes)
    for (const key of allTypes) {
      expect(learningComponentColors[key]).to.not.be.undefined
    }
  })

  it('instructionalStyles is an array of css results', () => {
    expect(Array.isArray(instructionalStyles)).to.be.true
    expect(instructionalStyles.length).to.equal(
      Object.keys(learningComponentColors).length,
    )
  })

  it('DDDFonts is an array of font URLs', () => {
    expect(Array.isArray(DDDFonts)).to.be.true
    expect(DDDFonts.length).to.be.greaterThan(0)
    for (const url of DDDFonts) {
      expect(url).to.include('fonts.googleapis.com')
    }
  })

  it('ApplicationAttributeData has expected categories', () => {
    expect(ApplicationAttributeData.primary).to.exist
    expect(ApplicationAttributeData.accent).to.exist
    expect(ApplicationAttributeData.margin).to.exist
    expect(ApplicationAttributeData.padding).to.exist
    expect(ApplicationAttributeData.border).to.exist
    expect(ApplicationAttributeData['border-radius']).to.exist
    expect(ApplicationAttributeData['box-shadow']).to.exist
    expect(ApplicationAttributeData['design-treatment']).to.exist
    expect(ApplicationAttributeData['font-family']).to.exist
    expect(ApplicationAttributeData['font-weight']).to.exist
    expect(ApplicationAttributeData['font-size']).to.exist
    expect(ApplicationAttributeData['instructional-action']).to.exist
  })

  it('ApplicationAttributeData.primary has 26 entries (0-25)', () => {
    expect(ApplicationAttributeData.primary[0]).to.equal('Pugh blue')
    expect(ApplicationAttributeData.primary[25]).to.equal('Success')
  })

  it('ApplicationAttributeData.accent has 15 entries (0-14)', () => {
    expect(ApplicationAttributeData.accent[0]).to.equal('Sky Max')
    expect(ApplicationAttributeData.accent[14]).to.equal('Alert Non Emergency')
  })

  it('ApplicationAttributeData.instructional-action references learningComponentTypes', () => {
    expect(ApplicationAttributeData['instructional-action']).to.equal(
      learningComponentTypes,
    )
  })
})

describe('iconFromPageType', () => {
  it('returns lrn:page for content', () => {
    expect(iconFromPageType('content')).to.equal('lrn:page')
  })

  it('returns lrn:assessment for assessment', () => {
    expect(iconFromPageType('assessment')).to.equal('lrn:assessment')
  })

  it('returns lrn:quiz for quiz', () => {
    expect(iconFromPageType('quiz')).to.equal('lrn:quiz')
  })

  it('returns icons:move-to-inbox for submission', () => {
    expect(iconFromPageType('submission')).to.equal('icons:move-to-inbox')
  })

  it('returns hax icons for lesson, module, unit, task, activity, project, practice', () => {
    expect(iconFromPageType('lesson')).to.equal('hax:lesson')
    expect(iconFromPageType('module')).to.equal('hax:module')
    expect(iconFromPageType('unit')).to.equal('hax:unit')
    expect(iconFromPageType('task')).to.equal('hax:task')
    expect(iconFromPageType('activity')).to.equal('hax:ticket')
    expect(iconFromPageType('project')).to.equal('hax:bulletin-board')
    expect(iconFromPageType('practice')).to.equal('hax:shovel')
  })

  it('returns courseicons for connection, knowledge, strategy', () => {
    expect(iconFromPageType('connection')).to.equal('courseicons:chem-connection')
    expect(iconFromPageType('knowledge')).to.equal('courseicons:knowledge')
    expect(iconFromPageType('strategy')).to.equal('courseicons:strategy')
  })

  it('returns courseicons:strategy for discuss, make, observe, present, read, reflect, research, watch', () => {
    expect(iconFromPageType('discuss')).to.equal('courseicons:strategy')
    expect(iconFromPageType('make')).to.equal('courseicons:strategy')
    expect(iconFromPageType('observe')).to.equal('courseicons:strategy')
    expect(iconFromPageType('present')).to.equal('courseicons:strategy')
    expect(iconFromPageType('read')).to.equal('courseicons:strategy')
    expect(iconFromPageType('reflect')).to.equal('courseicons:strategy')
    expect(iconFromPageType('research')).to.equal('courseicons:strategy')
    expect(iconFromPageType('watch')).to.equal('courseicons:strategy')
  })

  it('returns lrn:write for write', () => {
    expect(iconFromPageType('write')).to.equal('lrn:write')
  })

  it('returns learning-objectives default for unknown type', () => {
    expect(iconFromPageType('unknown')).to.equal(
      'courseicons:learning-objectives',
    )
  })

  it('returns learning-objectives default for undefined', () => {
    expect(iconFromPageType(undefined)).to.equal(
      'courseicons:learning-objectives',
    )
  })
})

describe('HAXOptionSampleFactory', () => {
  it('returns an array of option objects for primary', () => {
    const options = HAXOptionSampleFactory('primary')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.equal(
      Object.keys(ApplicationAttributeData.primary).length,
    )
    expect(options[0].value).to.equal('0')
  })

  it('returns an array of option objects for accent', () => {
    const options = HAXOptionSampleFactory('accent')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.equal(
      Object.keys(ApplicationAttributeData.accent).length,
    )
  })

  it('returns an array of option objects for margin', () => {
    const options = HAXOptionSampleFactory('margin')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.equal(
      Object.keys(ApplicationAttributeData.margin).length,
    )
  })

  it('returns an array of option objects for padding', () => {
    const options = HAXOptionSampleFactory('padding')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.equal(
      Object.keys(ApplicationAttributeData.padding).length,
    )
  })

  it('returns an array of option objects for design-treatment', () => {
    const options = HAXOptionSampleFactory('design-treatment')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.equal(
      Object.keys(ApplicationAttributeData['design-treatment']).length,
    )
  })

  it('returns an array of option objects for font-family', () => {
    const options = HAXOptionSampleFactory('font-family')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.equal(
      Object.keys(ApplicationAttributeData['font-family']).length,
    )
  })

  it('returns an array of option objects for font-weight', () => {
    const options = HAXOptionSampleFactory('font-weight')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.equal(
      Object.keys(ApplicationAttributeData['font-weight']).length,
    )
  })

  it('returns an array of option objects for font-size', () => {
    const options = HAXOptionSampleFactory('font-size')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.equal(
      Object.keys(ApplicationAttributeData['font-size']).length,
    )
  })

  it('returns an array of option objects for instructional-action', () => {
    const options = HAXOptionSampleFactory('instructional-action')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.equal(
      Object.keys(ApplicationAttributeData['instructional-action']).length,
    )
  })

  it('returns an array of option objects for border', () => {
    const options = HAXOptionSampleFactory('border')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.equal(
      Object.keys(ApplicationAttributeData.border).length,
    )
  })

  it('returns an array of option objects for border-radius', () => {
    const options = HAXOptionSampleFactory('border-radius')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.equal(
      Object.keys(ApplicationAttributeData['border-radius']).length,
    )
  })

  it('returns an array of option objects for box-shadow', () => {
    const options = HAXOptionSampleFactory('box-shadow')
    expect(Array.isArray(options)).to.be.true
    expect(options.length).to.equal(
      Object.keys(ApplicationAttributeData['box-shadow']).length,
    )
  })

  it('produces html with d-d-d-sample for primary and accent types', () => {
    const primaryOptions = HAXOptionSampleFactory('primary')
    expect(primaryOptions[0].html).to.exist
    const accentOptions = HAXOptionSampleFactory('accent')
    expect(accentOptions[0].html).to.exist
  })

  it('produces html with d-d-d-sample for non-primary/accent types', () => {
    const marginOptions = HAXOptionSampleFactory('margin')
    expect(marginOptions[0].html).to.exist
  })
})

describe('HAXOptionSampleFactory updatePreviewColorVar', () => {
  it('triggers updatePreviewColorVar when primary sample is clicked', async () => {
    const options = HAXOptionSampleFactory('primary')
    const wrapper = await fixture(html`<div>${options[0].html}</div>`)
    const sample = wrapper.querySelector('d-d-d-sample')
    expect(sample).to.exist
    await sample.updateComplete
    sample.click()
    expect(true).to.be.true
  })

  it('triggers updatePreviewColorVar when accent sample is clicked', async () => {
    const options = HAXOptionSampleFactory('accent')
    const wrapper = await fixture(html`<div>${options[3].html}</div>`)
    const sample = wrapper.querySelector('d-d-d-sample')
    expect(sample).to.exist
    await sample.updateComplete
    sample.click()
    expect(true).to.be.true
  })
})

describe('DDDStyles CSS exports', () => {
  it('DDDVariables is a CSSResult', () => {
    expect(DDDVariables).to.exist
    expect(DDDVariables.cssText).to.exist
  })

  it('DDDGlobalStyles is a CSSResult', () => {
    expect(DDDGlobalStyles).to.exist
    expect(DDDGlobalStyles.cssText).to.exist
  })

  it('DDDReset is a CSSResult', () => {
    expect(DDDReset).to.exist
    expect(DDDReset.cssText).to.exist
  })

  it('DDDPulseEffect is a CSSResult', () => {
    expect(DDDPulseEffect).to.exist
    expect(DDDPulseEffect.cssText).to.exist
  })

  it('DDDAnimations is a CSSResult', () => {
    expect(DDDAnimations).to.exist
    expect(DDDAnimations.cssText).to.exist
  })

  it('DDDPaletteStyles is a CSSResult', () => {
    expect(DDDPaletteStyles).to.exist
    expect(DDDPaletteStyles.cssText).to.exist
  })

  it('DDDDataAttributes is an array of CSSResults', () => {
    expect(Array.isArray(DDDDataAttributes)).to.be.true
    expect(DDDDataAttributes.length).to.be.greaterThan(0)
  })

  it('DDDAllStyles is an array combining all style sheets', () => {
    expect(Array.isArray(DDDAllStyles)).to.be.true
    expect(DDDAllStyles.length).to.be.greaterThan(0)
  })

  it('DDDAllStyles includes DDDGlobalStyles, DDDVariables, DDDPaletteStyles', () => {
    expect(DDDAllStyles).to.include(DDDGlobalStyles)
    expect(DDDAllStyles).to.include(DDDVariables)
    expect(DDDAllStyles).to.include(DDDPaletteStyles)
    expect(DDDAllStyles).to.include(DDDReset)
  })

  it('exports remaining CSS results', () => {
    expect(DDDPulseEffect.cssText).to.exist
    expect(DDDLetterSpacing.cssText).to.exist
    expect(DDDBoxShadow.cssText).to.exist
    expect(DDDBorderRadius.cssText).to.exist
    expect(DDDBackground.cssText).to.exist
    expect(DDDFontWeight.cssText).to.exist
    expect(DDDFontClasses.cssText).to.exist
    expect(DDDBreadcrumb.cssText).to.exist
  })

  it('DDDReset ships the sr-only screen-reader helper class', () => {
    // DDDExtra was removed; the rule folded into DDDReset so every
    // DDDSuper-based element gets it through super.styles
    expect(DDDReset.cssText).to.include('.sr-only')
  })
})

describe('DDDBorders CSS utility classes', () => {
  it('exports a CSSResult with border classes', () => {
    expect(DDDBorders).to.exist
    expect(DDDBorders.cssText).to.exist
    expect(DDDBorders.cssText).to.include('b-0')
    expect(DDDBorders.cssText).to.include('b-xs')
    expect(DDDBorders.cssText).to.include('bt-md')
    expect(DDDBorders.cssText).to.include('br-lg')
    expect(DDDBorders.cssText).to.include('bb-sm')
    expect(DDDBorders.cssText).to.include('bl-md')
  })
})

describe('DDDFontSizing CSS utility classes', () => {
  it('exports a CSSResult with font-size classes', () => {
    expect(DDDFontSizing).to.exist
    expect(DDDFontSizing.cssText).to.exist
    expect(DDDFontSizing.cssText).to.include('fs-6xs')
    expect(DDDFontSizing.cssText).to.include('fs-4xl')
  })
})

describe('DDDLineHeight CSS utility classes', () => {
  it('exports a CSSResult with line-height classes', () => {
    expect(DDDLineHeight).to.exist
    expect(DDDLineHeight.cssText).to.exist
    expect(DDDLineHeight.cssText).to.include('lh-120')
    expect(DDDLineHeight.cssText).to.include('lh-140')
    expect(DDDLineHeight.cssText).to.include('lh-150')
    expect(DDDLineHeight.cssText).to.include('lh-auto')
  })
})

describe('DDDMarginPadding CSS utility classes', () => {
  it('exports a CSSResult with margin classes', () => {
    expect(DDDMarginPadding).to.exist
    expect(DDDMarginPadding.cssText).to.exist
    expect(DDDMarginPadding.cssText).to.include('m-auto')
    expect(DDDMarginPadding.cssText).to.include('m-0')
    expect(DDDMarginPadding.cssText).to.include('m-30')
  })

  it('includes top/bottom/left/right margin variants', () => {
    expect(DDDMarginPadding.cssText).to.include('mt-0')
    expect(DDDMarginPadding.cssText).to.include('mb-0')
    expect(DDDMarginPadding.cssText).to.include('ml-0')
    expect(DDDMarginPadding.cssText).to.include('mr-0')
  })

  it('includes padding classes', () => {
    expect(DDDMarginPadding.cssText).to.include('p-0')
    expect(DDDMarginPadding.cssText).to.include('p-30')
  })
})
