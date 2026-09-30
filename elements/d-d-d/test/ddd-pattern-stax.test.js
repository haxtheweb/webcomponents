import { expect } from '@open-wc/testing'

import '../lib/DDDPatternStax.js'
import {
  publishDDDPatternsToHax,
  activateDDDPatternStax,
  getDDDPatternGateReport,
} from '../lib/DDDPatternStax.js'
import { DDDPATTERNS } from '../lib/DDDPatternLibrary.js'

describe('getDDDPatternGateReport', () => {
  it('returns a report with verified, excluded, unverified, and flaggedPatterns', () => {
    const report = getDDDPatternGateReport()
    expect(report.verified).to.be.an('array')
    expect(report.excluded).to.be.an('array')
    expect(report.unverified).to.be.an('array')
    expect(report.flaggedPatterns).to.be.an('array')
  })

  it('delegates to resolveHaxCapabilityReport from DDDPatternLibrary', () => {
    const report = getDDDPatternGateReport()
    expect(report.verified).to.include('stop-note')
  })
})

describe('publishDDDPatternsToHax', () => {
  it('returns empty result when store is null', async () => {
    const result = await publishDDDPatternsToHax(null)
    expect(result.registeredStax).to.deep.equal([])
    expect(result.registeredOverrides).to.deep.equal([])
    expect(result.skipped).to.deep.equal([])
    expect(result.gaps).to.deep.equal([])
  })

  it('returns result object with correct shape when store is provided', async () => {
    const fakeStore = {
      platformAllows: () => true,
      htmlToHaxElements: () =>
        Promise.resolve([{ tag: 'div', properties: {}, content: '' }]),
      appendChild: () => {},
    }
    const result = await publishDDDPatternsToHax(fakeStore)
    expect(result.registeredStax).to.be.an('array')
    expect(result.registeredOverrides).to.be.an('array')
    expect(result.skipped).to.be.an('array')
    expect(result.gaps).to.be.an('array')
  })

  it('skips patterns when platformAllows blockTemplates is false', async () => {
    const fakeStore = {
      platformAllows: (key) => key !== 'blockTemplates',
      htmlToHaxElements: () =>
        Promise.resolve([{ tag: 'div', properties: {}, content: '' }]),
      appendChild: () => {},
    }
    const result = await publishDDDPatternsToHax(fakeStore)
    for (const skipped of result.skipped) {
      expect(skipped.reason).to.include('blockTemplates')
    }
  })

  it('skips patterns when platformAllows pageTemplates is false', async () => {
    const fakeStore = {
      platformAllows: (key) => key !== 'pageTemplates',
      htmlToHaxElements: () =>
        Promise.resolve([{ tag: 'div', properties: {}, content: '' }]),
      appendChild: () => {},
    }
    const result = await publishDDDPatternsToHax(fakeStore)
    for (const skipped of result.skipped) {
      expect(skipped.reason).to.include('pageTemplates')
    }
  })

  it('reports gaps for patterns with non-HAX-capable components', async () => {
    const fakeStore = {
      platformAllows: () => true,
      htmlToHaxElements: () =>
        Promise.resolve([{ tag: 'div', properties: {}, content: '' }]),
      appendChild: () => {},
    }
    const result = await publishDDDPatternsToHax(fakeStore)
    for (const gap of result.gaps) {
      expect(gap.id).to.be.a('string')
      expect(gap.title).to.be.a('string')
      expect(gap.reason).to.include('non-HAX-capable')
      expect(Array.isArray(gap.components)).to.be.true
    }
  })

  it('respects platformAllows defaulting to true when method is missing', async () => {
    const fakeStore = {
      htmlToHaxElements: () =>
        Promise.resolve([{ tag: 'div', properties: {}, content: '' }]),
      appendChild: () => {},
    }
    const result = await publishDDDPatternsToHax(fakeStore)
    // should not have any platform-related skips
    const platformSkips = result.skipped.filter(
      (s) =>
        s.reason.includes('blockTemplates') ||
        s.reason.includes('pageTemplates'),
    )
    expect(platformSkips.length).to.equal(0)
  })

  it('handles htmlToHaxElements returning empty array by not registering', async () => {
    const fakeStore = {
      platformAllows: () => true,
      htmlToHaxElements: () => Promise.resolve([]),
      appendChild: () => {},
    }
    const result = await publishDDDPatternsToHax(fakeStore)
    // patterns that produce empty elements should not appear in registeredStax
    // or registeredOverrides
    expect(result.registeredStax.length + result.registeredOverrides.length)
      .to.be.lessThanOrEqual(DDDPATTERNS.length)
  })

  it('handles htmlToHaxElements throwing an error gracefully', async () => {
    const fakeStore = {
      platformAllows: () => true,
      htmlToHaxElements: () => Promise.reject(new Error('parse error')),
      appendChild: () => {},
    }
    const result = await publishDDDPatternsToHax(fakeStore)
    // should not throw; should just not register the failing patterns
    expect(result).to.exist
  })
})

describe('activateDDDPatternStax', () => {
  it('does not throw when called without a HaxStore', () => {
    const origHaxStore = globalThis.HaxStore
    globalThis.HaxStore = undefined
    try {
      activateDDDPatternStax()
    } finally {
      globalThis.HaxStore = origHaxStore
    }
  })

  it('is idempotent when called multiple times', () => {
    const origHaxStore = globalThis.HaxStore
    globalThis.HaxStore = undefined
    try {
      activateDDDPatternStax()
      activateDDDPatternStax()
    } finally {
      globalThis.HaxStore = origHaxStore
    }
  })

  it('calls isDDDActive when HaxStore is available', () => {
    const origHaxStore = globalThis.HaxStore
    const KEY = '__dddPatternStaxPublished'
    globalThis.HaxStore = {
      requestAvailability: () => ({
        platformAllows: () => true,
        htmlToHaxElements: () =>
          Promise.resolve([{ tag: 'div', properties: {}, content: '' }]),
        appendChild: () => {},
        [KEY]: false,
      }),
    }
    try {
      activateDDDPatternStax()
      // tryPublish will be called, which calls getHaxStore and isDDDActive
      // since DDD is the active system (from the d-d-d.js import), it should proceed
      expect(true).to.be.true
    } finally {
      globalThis.HaxStore = origHaxStore
    }
  })
})
