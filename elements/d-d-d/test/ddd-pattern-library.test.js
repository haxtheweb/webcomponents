import { expect } from '@open-wc/testing'

import '../lib/DDDPatternLibrary.js'
import {
  HAX_CAPABILITY,
  INTERNAL_CONTRACTS,
  DDDPATTERNS,
  getPatternsByLevel,
  getPatternById,
  getAllPatternComponents,
  resolveHaxCapabilityReport,
  getContractsForElement,
  getPatternsUsingComponent,
} from '../lib/DDDPatternLibrary.js'

describe('HAX_CAPABILITY table', () => {
  it('has entries for known HAX-capable components', () => {
    expect(HAX_CAPABILITY['stop-note']).to.be.true
    expect(HAX_CAPABILITY['multiple-choice']).to.be.true
    expect(HAX_CAPABILITY['editable-table']).to.be.true
    expect(HAX_CAPABILITY['a11y-collapse']).to.be.true
  })

  it('has false entries for non-HAX-capable system UI', () => {
    expect(HAX_CAPABILITY['simple-pager']).to.be.false
    expect(HAX_CAPABILITY['simple-login']).to.be.false
    expect(HAX_CAPABILITY['site-menu']).to.be.false
    expect(HAX_CAPABILITY['site-title']).to.be.false
  })

  it('has true entries for DDD-owned components', () => {
    expect(HAX_CAPABILITY['ddd-card']).to.be.true
    expect(HAX_CAPABILITY['ddd-steps-list']).to.be.true
    expect(HAX_CAPABILITY['ddd-steps-list-item']).to.be.true
  })
})

describe('DDDPATTERNS', () => {
  it('is an array of pattern entries', () => {
    expect(Array.isArray(DDDPATTERNS)).to.be.true
    expect(DDDPATTERNS.length).to.be.greaterThan(0)
  })

  it('each pattern has required fields', () => {
    for (const p of DDDPATTERNS) {
      expect(p.id).to.be.a('string')
      expect(p.level).to.be.a('string')
      expect(p.title).to.be.a('string')
      expect(p.description).to.be.a('string')
      expect(Array.isArray(p.components)).to.be.true
      expect(p.html).to.be.a('string')
      expect(p.hax).to.be.an('object')
    }
  })

  it('patterns have valid levels: atom, molecule, organism, template', () => {
    const validLevels = ['atom', 'molecule', 'organism', 'template']
    for (const p of DDDPATTERNS) {
      expect(validLevels).to.include(p.level)
    }
  })

  it('patterns with stax-* publish have templateType', () => {
    for (const p of DDDPATTERNS) {
      if (
        p.hax.publish === 'stax-area' ||
        p.hax.publish === 'stax-page'
      ) {
        expect(p.hax.templateType).to.exist
      }
    }
  })

  it('patterns with demoSchemaOverride have targetTag', () => {
    for (const p of DDDPATTERNS) {
      if (p.hax.publish === 'demoSchemaOverride') {
        expect(p.hax.targetTag).to.exist
      }
    }
  })
})

describe('getPatternsByLevel', () => {
  it('returns only atom-level patterns when level is atom', () => {
    const atoms = getPatternsByLevel('atom')
    for (const a of atoms) {
      expect(a.level).to.equal('atom')
    }
    expect(atoms.length).to.be.greaterThan(0)
  })

  it('returns only molecule-level patterns when level is molecule', () => {
    const molecules = getPatternsByLevel('molecule')
    for (const m of molecules) {
      expect(m.level).to.equal('molecule')
    }
  })

  it('returns only organism-level patterns when level is organism', () => {
    const organisms = getPatternsByLevel('organism')
    for (const o of organisms) {
      expect(o.level).to.equal('organism')
    }
  })

  it('returns only template-level patterns when level is template', () => {
    const templates = getPatternsByLevel('template')
    for (const t of templates) {
      expect(t.level).to.equal('template')
    }
  })

  it('returns empty array for unknown level', () => {
    expect(getPatternsByLevel('nonexistent')).to.deep.equal([])
  })

  it('total across levels equals DDDPATTERNS length', () => {
    const total =
      getPatternsByLevel('atom').length +
      getPatternsByLevel('molecule').length +
      getPatternsByLevel('organism').length +
      getPatternsByLevel('template').length
    expect(total).to.equal(DDDPATTERNS.length)
  })
})

describe('getPatternById', () => {
  it('returns the pattern with the given id', () => {
    const firstPattern = DDDPATTERNS[0]
    const found = getPatternById(firstPattern.id)
    expect(found).to.equal(firstPattern)
  })

  it('returns undefined for a nonexistent id', () => {
    expect(getPatternById('nonexistent-id')).to.be.undefined
  })
})

describe('getAllPatternComponents', () => {
  it('returns a deduplicated array of all component tags', () => {
    const components = getAllPatternComponents()
    expect(Array.isArray(components)).to.be.true
    const unique = [...new Set(components)]
    expect(components.length).to.equal(unique.length)
  })

  it('includes known component tags', () => {
    const components = getAllPatternComponents()
    expect(components).to.include('stop-note')
  })
})

describe('resolveHaxCapabilityReport', () => {
  it('returns verified, excluded, unverified, and flaggedPatterns arrays', () => {
    const report = resolveHaxCapabilityReport()
    expect(report.verified).to.be.an('array')
    expect(report.excluded).to.be.an('array')
    expect(report.unverified).to.be.an('array')
    expect(report.flaggedPatterns).to.be.an('array')
  })

  it('verified list includes true-capability components', () => {
    const report = resolveHaxCapabilityReport()
    expect(report.verified).to.include('stop-note')
    expect(report.verified).to.include('multiple-choice')
  })

  it('excluded list includes false-capability components', () => {
    const report = resolveHaxCapabilityReport()
    expect(report.excluded).to.include('simple-pager')
  })

  it('flaggedPatterns includes patterns with excluded components', () => {
    const report = resolveHaxCapabilityReport()
    for (const flagged of report.flaggedPatterns) {
      expect(flagged.id).to.be.a('string')
      expect(flagged.title).to.be.a('string')
      expect(Array.isArray(flagged.excludedComponents)).to.be.true
      expect(flagged.excludedComponents.length).to.be.greaterThan(0)
    }
  })

  it('accepts a custom capability override table', () => {
    const customTable = { 'stop-note': false }
    const report = resolveHaxCapabilityReport(customTable)
    expect(report.excluded).to.include('stop-note')
    expect(report.verified).to.not.include('stop-note')
  })

  it('uses HAX_CAPABILITY as default when no override given', () => {
    const report = resolveHaxCapabilityReport()
    const reportDefault = resolveHaxCapabilityReport(HAX_CAPABILITY)
    expect(report.verified).to.deep.equal(reportDefault.verified)
    expect(report.excluded).to.deep.equal(reportDefault.excluded)
  })

  it('unverified list includes components not in the table', () => {
    // Find a component referenced in patterns that is null in HAX_CAPABILITY
    const allComponents = getAllPatternComponents()
    const nullComponents = allComponents.filter(
      (tag) => HAX_CAPABILITY[tag] === null || HAX_CAPABILITY[tag] === undefined,
    )
    if (nullComponents.length > 0) {
      const report = resolveHaxCapabilityReport()
      expect(report.unverified).to.include(nullComponents[0])
    }
  })
})

describe('getContractsForElement', () => {
  it('returns contracts targeting the given tag', () => {
    const contracts = getContractsForElement('stop-note')
    expect(Array.isArray(contracts)).to.be.true
    for (const c of contracts) {
      expect(c.targetElements).to.include('stop-note')
    }
  })

  it('returns empty array for a tag with no contracts', () => {
    expect(getContractsForElement('nonexistent-tag')).to.deep.equal([])
  })
})

describe('getPatternsUsingComponent', () => {
  it('returns patterns that include the given component tag', () => {
    const patterns = getPatternsUsingComponent('stop-note')
    expect(Array.isArray(patterns)).to.be.true
    for (const p of patterns) {
      expect(p.components).to.include('stop-note')
    }
  })

  it('returns empty array for a component not used in any pattern', () => {
    expect(getPatternsUsingComponent('nonexistent-component')).to.deep.equal([])
  })
})

describe('INTERNAL_CONTRACTS', () => {
  it('is an array of contract objects', () => {
    expect(Array.isArray(INTERNAL_CONTRACTS)).to.be.true
    expect(INTERNAL_CONTRACTS.length).to.be.greaterThan(0)
  })

  it('each contract has id, title, surface, tokens, structure, targetElements', () => {
    for (const c of INTERNAL_CONTRACTS) {
      expect(c.id).to.be.a('string')
      expect(c.title).to.be.a('string')
      expect(c.surface).to.be.a('string')
      expect(Array.isArray(c.tokens)).to.be.true
      expect(c.structure).to.be.a('string')
      expect(Array.isArray(c.targetElements)).to.be.true
    }
  })
})
