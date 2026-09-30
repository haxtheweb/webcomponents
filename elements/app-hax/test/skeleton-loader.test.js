import { expect } from '@open-wc/testing'
import { SkeletonLoader } from '../lib/v2/skeleton-loader.js'

// Directly imported so istanbul instruments it. skeleton-loader is a pure
// static utility class — no DOM, no store, no side effects.

function makeValidSkeleton(overrides = {}) {
  return {
    meta: {
      type: 'skeleton',
      name: 'Test Skeleton',
      useCaseTitle: 'Test Title',
      useCaseDescription: 'Test Description',
      useCaseImage: 'img.png',
      category: ['course'],
      tags: ['beginner'],
      sourceUrl: 'https://example.com',
      created: '2024-01-01',
      ...overrides.meta,
    },
    site: {
      name: 'test-site',
      theme: 'clean-two',
      ...overrides.site,
    },
    build: {
      type: 'course',
      items: [{ id: 1 }],
      files: [{ path: 'a.txt' }],
      ...overrides.build,
    },
    theme: {
      color: 'blue',
      icon: 'hax:site',
      ...overrides.theme,
    },
    ...overrides,
  }
}

describe('SkeletonLoader', () => {
  describe('isValidSkeleton', () => {
    it('returns false for null', () => {
      expect(SkeletonLoader.isValidSkeleton(null)).to.be.false
    })
    it('returns false for non-object', () => {
      expect(SkeletonLoader.isValidSkeleton('string')).to.be.false
    })
    it('returns false when meta.type is not skeleton', () => {
      const skel = makeValidSkeleton({ meta: { type: 'other', name: 'x' } })
      expect(SkeletonLoader.isValidSkeleton(skel)).to.be.false
    })
    it('returns false when site is missing', () => {
      const skel = makeValidSkeleton()
      delete skel.site
      expect(SkeletonLoader.isValidSkeleton(skel)).to.be.false
    })
    it('returns false when build is missing', () => {
      const skel = makeValidSkeleton()
      delete skel.build
      expect(SkeletonLoader.isValidSkeleton(skel)).to.be.false
    })
    it('returns false when site.name is missing', () => {
      const skel = makeValidSkeleton({ site: { theme: 'x' } })
      expect(SkeletonLoader.isValidSkeleton(skel)).to.be.false
    })
    it('returns false when site.theme is missing', () => {
      const skel = makeValidSkeleton({ site: { name: 'x' } })
      expect(SkeletonLoader.isValidSkeleton(skel)).to.be.false
    })
    it('returns false when build.items is missing', () => {
      const skel = makeValidSkeleton({ build: { type: 'x' } })
      expect(SkeletonLoader.isValidSkeleton(skel)).to.be.false
    })
    it('returns false when build.items is not array', () => {
      const skel = makeValidSkeleton({ build: { type: 'x', items: {} } })
      expect(SkeletonLoader.isValidSkeleton(skel)).to.be.false
    })
    it('returns true for a valid skeleton', () => {
      expect(SkeletonLoader.isValidSkeleton(makeValidSkeleton())).to.be.true
    })
  })

  describe('extractTags', () => {
    it('extracts categories and tags', () => {
      const skel = makeValidSkeleton()
      const tags = SkeletonLoader.extractTags(skel)
      expect(tags).to.include('course')
      expect(tags).to.include('beginner')
    })
    it('includes build type as tag', () => {
      const skel = makeValidSkeleton({ meta: { type: 'skeleton', name: 'x' } })
      const tags = SkeletonLoader.extractTags(skel)
      expect(tags).to.include('course')
    })
    it('includes theme tag', () => {
      const skel = makeValidSkeleton({ site: { name: 'x', theme: 'mytheme' } })
      const tags = SkeletonLoader.extractTags(skel)
      expect(tags).to.include('theme-mytheme')
    })
    it('deduplicates tags', () => {
      const skel = makeValidSkeleton({
        meta: { type: 'skeleton', name: 'x', category: ['course'], tags: ['course'] },
        build: { type: 'course', items: [] },
      })
      const tags = SkeletonLoader.extractTags(skel)
      const courseCount = tags.filter((t) => t === 'course').length
      expect(courseCount).to.equal(1)
    })
    it('filters out empty/whitespace tags', () => {
      const skel = makeValidSkeleton({
        meta: { type: 'skeleton', name: 'x', category: ['  ', ''], tags: ['valid'] },
        build: { type: 'course', items: [] },
      })
      const tags = SkeletonLoader.extractTags(skel)
      expect(tags).to.include('valid')
      expect(tags).to.not.include('')
      expect(tags).to.not.include('  ')
    })
    it('handles missing category and tags arrays', () => {
      const skel = makeValidSkeleton({
        meta: { type: 'skeleton', name: 'x' },
        build: { type: 'course', items: [] },
      })
      const tags = SkeletonLoader.extractTags(skel)
      expect(tags).to.include('course')
    })
  })

  describe('loadSkeleton', () => {
    it('throws on invalid skeleton', () => {
      expect(() => SkeletonLoader.loadSkeleton(null)).to.throw('Invalid skeleton format')
    })
    it('returns processed skeleton with useCase data', () => {
      const skel = makeValidSkeleton()
      const result = SkeletonLoader.loadSkeleton(skel)
      expect(result.dataType).to.equal('skeleton')
      expect(result.useCaseTitle).to.equal('Test Title')
      expect(result.useCaseDescription).to.equal('Test Description')
      expect(result.isSelected).to.be.false
      expect(result.showContinue).to.be.false
    })
    it('falls back to meta.name when useCaseTitle missing', () => {
      const skel = makeValidSkeleton({
        meta: { type: 'skeleton', name: 'Fallback Name' },
      })
      const result = SkeletonLoader.loadSkeleton(skel)
      expect(result.useCaseTitle).to.equal('Fallback Name')
    })
    it('falls back to meta.description when useCaseDescription missing', () => {
      const skel = makeValidSkeleton({
        meta: { type: 'skeleton', name: 'x', description: 'Fallback Desc' },
      })
      const result = SkeletonLoader.loadSkeleton(skel)
      expect(result.useCaseDescription).to.equal('Fallback Desc')
    })
    it('uses options.defaultImage when useCaseImage missing', () => {
      const skel = makeValidSkeleton({
        meta: { type: 'skeleton', name: 'x' },
      })
      const result = SkeletonLoader.loadSkeleton(skel, { defaultImage: 'default.png' })
      expect(result.useCaseImage).to.equal('default.png')
    })
    it('uses options.defaultIcons when provided', () => {
      const skel = makeValidSkeleton()
      const customIcons = [{ icon: 'custom', tooltip: 'Custom' }]
      const result = SkeletonLoader.loadSkeleton(skel, { defaultIcons: customIcons })
      expect(result.useCaseIcon).to.equal(customIcons)
    })
    it('uses sourceUrl as demoLink', () => {
      const skel = makeValidSkeleton()
      const result = SkeletonLoader.loadSkeleton(skel)
      expect(result.demoLink).to.equal('https://example.com')
    })
    it('defaults demoLink to # when sourceUrl missing', () => {
      const skel = makeValidSkeleton({
        meta: { type: 'skeleton', name: 'x' },
      })
      const result = SkeletonLoader.loadSkeleton(skel)
      expect(result.demoLink).to.equal('#')
    })
    it('includes createSiteData with site/build/theme', () => {
      const skel = makeValidSkeleton()
      const result = SkeletonLoader.loadSkeleton(skel)
      expect(result.createSiteData.site).to.exist
      expect(result.createSiteData.build).to.exist
      expect(result.createSiteData.theme).to.exist
    })
    it('preserves originalData reference', () => {
      const skel = makeValidSkeleton()
      const result = SkeletonLoader.loadSkeleton(skel)
      expect(result.originalData).to.equal(skel)
    })
  })

  describe('loadSkeletons', () => {
    it('throws on non-array input', () => {
      expect(() => SkeletonLoader.loadSkeletons({})).to.throw('Expected array of skeletons')
    })
    it('loads multiple valid skeletons', () => {
      const skeletons = [makeValidSkeleton(), makeValidSkeleton()]
      const results = SkeletonLoader.loadSkeletons(skeletons)
      expect(results.length).to.equal(2)
    })
    it('filters out invalid skeletons without throwing', () => {
      const skeletons = [makeValidSkeleton(), null, { bad: true }]
      const results = SkeletonLoader.loadSkeletons(skeletons)
      expect(results.length).to.equal(1)
    })
    it('returns empty array for empty input', () => {
      const results = SkeletonLoader.loadSkeletons([])
      expect(results.length).to.equal(0)
    })
  })

  describe('applyCustomizations', () => {
    it('applies siteName customization', () => {
      const loaded = SkeletonLoader.loadSkeleton(makeValidSkeleton())
      const result = SkeletonLoader.applyCustomizations(loaded, { siteName: 'Custom Name' })
      expect(result.site.name).to.equal('Custom Name')
    })
    it('applies siteDescription customization', () => {
      const loaded = SkeletonLoader.loadSkeleton(makeValidSkeleton())
      const result = SkeletonLoader.applyCustomizations(loaded, { siteDescription: 'Custom Desc' })
      expect(result.site.description).to.equal('Custom Desc')
    })
    it('applies theme customization', () => {
      const loaded = SkeletonLoader.loadSkeleton(makeValidSkeleton())
      const result = SkeletonLoader.applyCustomizations(loaded, { theme: 'newtheme' })
      expect(result.site.theme).to.equal('newtheme')
    })
    it('applies color customization to theme', () => {
      const loaded = SkeletonLoader.loadSkeleton(makeValidSkeleton())
      const result = SkeletonLoader.applyCustomizations(loaded, { color: 'blue' })
      expect(result.theme.color).to.equal('blue')
    })
    it('applies icon customization to theme', () => {
      const loaded = SkeletonLoader.loadSkeleton(makeValidSkeleton())
      const result = SkeletonLoader.applyCustomizations(loaded, { icon: 'myicon' })
      expect(result.theme.icon).to.equal('myicon')
    })
    it('applies themeSettings via Object.assign', () => {
      const loaded = SkeletonLoader.loadSkeleton(makeValidSkeleton())
      const result = SkeletonLoader.applyCustomizations(loaded, {
        themeSettings: { customProp: 'val' },
      })
      expect(result.theme.customProp).to.equal('val')
    })
    it('deep clones createSiteData (does not mutate original)', () => {
      const loaded = SkeletonLoader.loadSkeleton(makeValidSkeleton())
      const originalName = loaded.createSiteData.site.name
      SkeletonLoader.applyCustomizations(loaded, { siteName: 'Changed' })
      expect(loaded.createSiteData.site.name).to.equal(originalName)
    })
    it('returns unmodified data when no customizations given', () => {
      const loaded = SkeletonLoader.loadSkeleton(makeValidSkeleton())
      const result = SkeletonLoader.applyCustomizations(loaded)
      expect(result.site.name).to.equal(loaded.createSiteData.site.name)
    })
  })

  describe('generateSkeletonMetadata', () => {
    it('generates metadata with all fields', () => {
      const skel = makeValidSkeleton()
      const meta = SkeletonLoader.generateSkeletonMetadata(skel)
      expect(meta.name).to.equal('Test Skeleton')
      expect(meta.title).to.equal('Test Title')
      expect(meta.description).to.equal('Test Description')
      expect(meta.type).to.equal('course')
      expect(meta.theme).to.equal('clean-two')
      expect(meta.itemCount).to.equal(1)
      expect(meta.fileCount).to.equal(1)
      expect(meta.created).to.equal('2024-01-01')
      expect(meta.sourceUrl).to.equal('https://example.com')
    })
    it('falls back to meta.name for title when useCaseTitle missing', () => {
      const skel = makeValidSkeleton({
        meta: { type: 'skeleton', name: 'Fallback' },
      })
      const meta = SkeletonLoader.generateSkeletonMetadata(skel)
      expect(meta.title).to.equal('Fallback')
    })
    it('falls back to meta.description when useCaseDescription missing', () => {
      const skel = makeValidSkeleton({
        meta: { type: 'skeleton', name: 'x', description: 'Desc Fallback' },
      })
      const meta = SkeletonLoader.generateSkeletonMetadata(skel)
      expect(meta.description).to.equal('Desc Fallback')
    })
    it('defaults type to skeleton when build.type missing', () => {
      const skel = makeValidSkeleton()
      delete skel.build.type
      const meta = SkeletonLoader.generateSkeletonMetadata(skel)
      expect(meta.type).to.equal('skeleton')
    })
    it('handles missing build.files', () => {
      const skel = makeValidSkeleton()
      delete skel.build.files
      const meta = SkeletonLoader.generateSkeletonMetadata(skel)
      expect(meta.fileCount).to.equal(0)
    })
    it('defaults sourceUrl to null when missing', () => {
      const skel = makeValidSkeleton({
        meta: { type: 'skeleton', name: 'x' },
      })
      const meta = SkeletonLoader.generateSkeletonMetadata(skel)
      expect(meta.sourceUrl).to.be.null
    })
    it('includes extracted tags', () => {
      const skel = makeValidSkeleton()
      const meta = SkeletonLoader.generateSkeletonMetadata(skel)
      expect(meta.tags).to.include('course')
      expect(meta.tags).to.include('beginner')
    })
  })
})
