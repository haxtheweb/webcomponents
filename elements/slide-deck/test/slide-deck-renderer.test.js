import { expect } from '@open-wc/testing'
import { DeckRenderer } from '../lib/slide-deck-renderer.js'

const DEMO_PPTX = '/elements/slide-deck/demo/demo-deck.pptx'

describe('DeckRenderer', () => {
  describe('with a fake vendored api', () => {
    let presentation, api, log, renderer

    beforeEach(() => {
      log = []
      presentation = {
        width: 1000,
        height: 750,
        slides: [{ n: 1 }, { n: 2 }, { n: 3 }],
      }
      api = {
        materializeSlideNodes(pres, slide) {
          log.push('materialize:' + slide.n)
        },
        renderSlide(pres, slide, options) {
          log.push('renderSlide:' + slide.n)
          log.push('mediaUrlCache:' + String(options.mediaUrlCache === renderer.mediaUrlCache))
          log.push('chartInstances:' + String(options.chartInstances === renderer.chartInstances))
          const element = globalThis.document.createElement('div')
          element.className = 'fake-slide'
          return {
            element: element,
            ready: Promise.resolve(),
            dispose() {
              log.push('dispose')
            },
          }
        },
      }
      renderer = new DeckRenderer(presentation, api)
    })

    it('exposes the presentation, slide count and aspect ratio', () => {
      expect(renderer.presentation === presentation).to.be.true
      expect(renderer.slideCount).to.equal(3)
      expect(renderer.aspectRatio).to.equal(0.75)
      expect(renderer.mediaUrlCache instanceof Map).to.be.true
      expect(renderer.chartInstances instanceof Set).to.be.true
      expect(renderer.handle === null).to.be.true
      expect(renderer.target === null).to.be.true
      expect(renderer.resizeObserver instanceof ResizeObserver).to.be.true
    })

    it('falls back to a 16:9 aspect ratio when the deck has no width', () => {
      renderer = new DeckRenderer({ width: 0, height: 500, slides: [] }, api)
      expect(renderer.aspectRatio).to.equal(0.5625)
    })

    it('renders a slide into the target and scales it to fill', async () => {
      const target = globalThis.document.createElement('div')
      globalThis.document.body.appendChild(target)
      target.style.width = '100px'
      try {
        await renderer.render(target, 0)
        expect(log[0]).to.equal('materialize:1')
        expect(log[1]).to.equal('renderSlide:1')
        expect(log[2]).to.equal('mediaUrlCache:true')
        expect(log[3]).to.equal('chartInstances:true')
        expect(target.childElementCount).to.equal(1)
        expect(target.firstElementChild === renderer.handle.element).to.be.true
        expect(target.firstElementChild.className).to.equal('fake-slide')
        // the css engine normalizes the shorthand order
        expect(target.firstElementChild.style.transformOrigin).to.equal(
          'left top',
        )
        expect(target.firstElementChild.style.transform).to.equal('scale(0.1)')
      } finally {
        renderer.clear()
        target.remove()
      }
    })

    it('ignores out of range slide indexes', async () => {
      const target = globalThis.document.createElement('div')
      globalThis.document.body.appendChild(target)
      try {
        await renderer.render(target, 0)
        log = []
        await renderer.render(target, 99)
        expect(log.length).to.equal(0)
        expect(renderer.handle === null).to.be.false
      } finally {
        renderer.clear()
        target.remove()
      }
    })

    it('disposes the previous handle when a new slide is painted', async () => {
      const target = globalThis.document.createElement('div')
      globalThis.document.body.appendChild(target)
      try {
        await renderer.render(target, 0)
        await renderer.render(target, 1)
        expect(log.includes('dispose')).to.be.true
        expect(log.includes('materialize:2')).to.be.true
        expect(target.firstElementChild === renderer.handle.element).to.be.true
      } finally {
        renderer.clear()
        target.remove()
      }
    })

    it('clear releases the painted handle and its target', async () => {
      const target = globalThis.document.createElement('div')
      globalThis.document.body.appendChild(target)
      try {
        await renderer.render(target, 0)
        renderer.clear()
        expect(log.includes('dispose')).to.be.true
        expect(renderer.handle === null).to.be.true
        expect(renderer.target === null).to.be.true
        // fit is a no-op without a painted handle
        renderer.fit()
        expect(renderer.handle === null).to.be.true
      } finally {
        target.remove()
      }
    })

    it('dispose revokes every cached media url and clears the cache', async () => {
      const target = globalThis.document.createElement('div')
      globalThis.document.body.appendChild(target)
      const revoked = []
      const originalRevoke = URL.revokeObjectURL
      URL.revokeObjectURL = (url) => {
        revoked.push(url)
      }
      try {
        await renderer.render(target, 0)
        renderer.mediaUrlCache.set('blob:one', 'blob:one')
        renderer.mediaUrlCache.set('blob:two', 'blob:two')
        renderer.dispose()
        expect(revoked.length).to.equal(2)
        expect(revoked.includes('blob:one')).to.be.true
        expect(revoked.includes('blob:two')).to.be.true
        expect(renderer.mediaUrlCache.size).to.equal(0)
      } finally {
        URL.revokeObjectURL = originalRevoke
        target.remove()
      }
    })

    it('fit does nothing before anything is painted', () => {
      renderer.fit()
      expect(renderer.handle === null).to.be.true
      expect(renderer.target === null).to.be.true
    })
  })

  describe('DeckRenderer.load against the demo fixtures', () => {
    it('rejects when the presentation cannot be fetched', async () => {
      let error = null
      try {
        await DeckRenderer.load('/elements/slide-deck/demo/missing.pptx')
      } catch (e) {
        error = e
      }
      expect(error instanceof Error).to.be.true
      expect(error.message).to.contain('unable to fetch')
      expect(error.message).to.contain('404')
    })

    it('parses the demo deck and renders a real slide', async () => {
      const renderer = await DeckRenderer.load(DEMO_PPTX)
      const target = globalThis.document.createElement('div')
      globalThis.document.body.appendChild(target)
      target.style.width = '640px'
      try {
        expect(renderer instanceof DeckRenderer).to.be.true
        expect(renderer.slideCount).to.equal(3)
        expect(renderer.aspectRatio > 0).to.be.true
        await renderer.render(target, 0)
        expect(target.childElementCount > 0).to.be.true
      } finally {
        renderer.dispose()
        target.remove()
      }
    })
  })
})
