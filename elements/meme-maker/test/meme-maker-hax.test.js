import { fixture, expect, html } from '@open-wc/testing'
import '../meme-maker.js'

describe('meme-maker hax integration', () => {
  describe('haxmediaSourceUpdated #3050', () => {
    it('pokes its shadow tree when imageUrl references the changed path', async () => {
      const element = await fixture(
        html`<meme-maker
          image-url="files/meme.jpg"
          top-text="I bring you"
          bottom-text="the death"
          alt="Cat stalking a small toy"
        ></meme-maker>`,
      )
      await element.updateComplete
      let poked = null
      const fakeStore = {
        _mediaSrcMatches: (src, path) =>
          String(src || '').indexOf(path) !== -1,
        _pokeMatchingImgs: (root, path) => {
          poked = { root, path }
        },
      }
      element.haxmediaSourceUpdated('files/meme.jpg', fakeStore)
      expect(poked).to.not.equal(null)
      expect(poked.root).to.equal(element.shadowRoot)
      expect(poked.path).to.equal('files/meme.jpg')
    })

    it('does nothing when imageUrl does not reference the changed path', async () => {
      const element = await fixture(
        html`<meme-maker image-url="files/meme.jpg"></meme-maker>`,
      )
      await element.updateComplete
      let poked = false
      const fakeStore = {
        _mediaSrcMatches: (src, path) =>
          String(src || '').indexOf(path) !== -1,
        _pokeMatchingImgs: () => {
          poked = true
        },
      }
      element.haxmediaSourceUpdated('files/other.jpg', fakeStore)
      expect(poked).to.be.false
    })

    it('does nothing when path is missing', async () => {
      const element = await fixture(
        html`<meme-maker image-url="files/meme.jpg"></meme-maker>`,
      )
      await element.updateComplete
      let poked = false
      const fakeStore = {
        _mediaSrcMatches: (src, path) =>
          String(src || '').indexOf(path) !== -1,
        _pokeMatchingImgs: () => {
          poked = true
        },
      }
      element.haxmediaSourceUpdated(null, fakeStore)
      element.haxmediaSourceUpdated(undefined, fakeStore)
      expect(poked).to.be.false
    })

    it('does nothing when store is missing or lacks _mediaSrcMatches', async () => {
      const element = await fixture(
        html`<meme-maker image-url="files/meme.jpg"></meme-maker>`,
      )
      await element.updateComplete
      let poked = false
      const brokenStore = {
        _pokeMatchingImgs: () => {
          poked = true
        },
      }
      expect(() => element.haxmediaSourceUpdated('files/meme.jpg', null)).to
        .not.throw
      expect(() => element.haxmediaSourceUpdated('files/meme.jpg', {})).to.not
        .throw
      expect(() => element.haxmediaSourceUpdated('files/meme.jpg', brokenStore))
        .to.not.throw
      expect(poked).to.be.false
    })
  })

  describe('haxprogressiveEnhancement with aria relationship', () => {
    it('includes aria-describedby in the enhancement output when set', async () => {
      const element = await fixture(
        html`<meme-maker
          image-url="files/meme.jpg"
          top-text="top"
          bottom-text="bottom"
          alt="alt text"
          described-by="meme-desc"
        ></meme-maker>`,
      )
      await element.updateComplete
      const result = element.haxprogressiveEnhancement()
      expect(result).to.include('aria-describedby="meme-desc"')
      expect(result).to.include('files/meme.jpg')
    })
  })
})
