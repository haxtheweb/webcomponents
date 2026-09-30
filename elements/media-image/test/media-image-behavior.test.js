import { fixture, expect, html, aTimeout } from '@open-wc/testing'
import '../media-image.js'

describe('media-image behavior', () => {
  describe('defaults', () => {
    it('starts with documented default property values', async () => {
      const el = await fixture(html`<media-image></media-image>`)
      await el.updateComplete
      expect(el.link).to.equal(null)
      expect(el.disableZoom).to.be.false
      expect(el.source).to.equal('')
      expect(el.thumbnail).to.equal('')
      expect(el.citation).to.equal('')
      expect(el.caption).to.equal('')
      expect(el.alt).to.equal('')
      expect(el.size).to.equal('wide')
      expect(el.round).to.be.false
      expect(el.card).to.be.false
      expect(el.box).to.be.false
      expect(el.offset).to.equal('none')
      expect(el.asMd).to.be.false
      expect(el.modalTitle).to.equal('')
      expect(el.figureLabelTitle).to.equal('')
      expect(el.figureLabelDescription).to.equal('')
    })
  })

  describe('link wiring', () => {
    it('wraps the image in an anchor and disables zoom when link is set', async () => {
      const el = await fixture(
        html`<media-image
          source="files/photo.jpg"
          link="#zoom-target"
        ></media-image>`,
      )
      await el.updateComplete
      expect(el.disableZoom).to.be.true
      expect(el.hasAttribute('disable-zoom')).to.be.true
      const anchor = el.shadowRoot.querySelector('a')
      expect(anchor).to.exist
      expect(anchor.getAttribute('href')).to.equal('#zoom-target')
      const image = el.shadowRoot.querySelector('media-image-image')
      expect(anchor.contains(image)).to.be.true
      // zoom is disabled for the link variant so the inner image stays out
      // of the tab order (no double tab stop inside the anchor)
      expect(image.getAttribute('tabindex')).to.equal('-1')
    })

    it('keeps zoom active without a link', async () => {
      const el = await fixture(
        html`<media-image source="files/photo.jpg"></media-image>`,
      )
      await el.updateComplete
      expect(el.disableZoom).to.be.false
      expect(el.shadowRoot.querySelector('a')).to.equal(null)
      const image = el.shadowRoot.querySelector('media-image-image')
      expect(image.getAttribute('tabindex')).to.equal('0')
    })

    it('removes the image from the tab order when zoom is disabled', async () => {
      const el = await fixture(
        html`<media-image source="files/photo.jpg"></media-image>`,
      )
      await el.updateComplete
      const image = el.shadowRoot.querySelector('media-image-image')
      expect(image.getAttribute('tabindex')).to.equal('0')
      el.disableZoom = true
      await el.updateComplete
      expect(el.hasAttribute('disable-zoom')).to.be.true
      expect(image.getAttribute('tabindex')).to.equal('-1')
    })
  })

  describe('thumbnail wiring', () => {
    it('shows the thumbnail and disables zoom when only a thumbnail is set', async () => {
      const el = await fixture(
        html`<media-image thumbnail="files/thumb.jpg"></media-image>`,
      )
      await el.updateComplete
      expect(el.disableZoom).to.be.true
      const image = el.shadowRoot.querySelector('media-image-image')
      expect(image.getAttribute('source')).to.equal('files/thumb.jpg')
      expect(image.getAttribute('full-source')).to.equal('')
    })

    it('uses the thumbnail for display and the source for the modal', async () => {
      const el = await fixture(
        html`<media-image
          source="files/full.jpg"
          thumbnail="files/thumb.jpg"
        ></media-image>`,
      )
      await el.updateComplete
      const image = el.shadowRoot.querySelector('media-image-image')
      expect(image.getAttribute('source')).to.equal('files/thumb.jpg')
      expect(image.getAttribute('full-source')).to.equal('files/full.jpg')
      // the modal content follows the full source when present
      expect(image.modalContent.src).to.equal('files/full.jpg')
    })

    it('falls back to the source for the modal content', async () => {
      const el = await fixture(
        html`<media-image source="files/full.jpg"></media-image>`,
      )
      await el.updateComplete
      const image = el.shadowRoot.querySelector('media-image-image')
      expect(image.modalContent.src).to.equal('files/full.jpg')
      expect(image.modalContent.noLeft).to.be.true
      expect(image.modalContent.tagName.toLowerCase()).to.equal(
        'image-inspector',
      )
    })

    it('wires SchemaBehaviors microdata onto the host and image', async () => {
      const el = await fixture(
        html`<media-image source="files/full.jpg"></media-image>`,
      )
      await el.updateComplete
      await el.updateComplete
      // SchemaBehaviors generates a resource id and prefix on the host
      expect(el.getAttribute('resource')).to.match(/^#/)
      expect(el.getAttribute('prefix')).to.include('oer:')
      const image = el.shadowRoot.querySelector('media-image-image')
      // the image resource id is derived from the host resource id
      expect(image.getAttribute('resource')).to.match(/^#.*-image$/)
    })
  })

  describe('figure label wiring', () => {
    it('renders the figure label when only a description is provided', async () => {
      const el = await fixture(
        html`<media-image source="files/photo.jpg"></media-image>`,
      )
      await el.updateComplete
      expect(el.shadowRoot.querySelector('figure-label')).to.equal(null)
      el.figureLabelDescription = 'description only'
      await el.updateComplete
      const label = el.shadowRoot.querySelector('figure-label')
      expect(label).to.exist
      expect(label.getAttribute('title')).to.equal('')
      expect(label.getAttribute('description')).to.equal('description only')
    })

    it('passes title and description into the internal figure-label', async () => {
      const el = await fixture(
        html`<media-image
          source="files/photo.jpg"
          figure-label-title="1.4"
          figure-label-description="A chart"
        ></media-image>`,
      )
      await el.updateComplete
      const label = el.shadowRoot.querySelector('figure-label')
      expect(label.getAttribute('title')).to.equal('1.4')
      expect(label.getAttribute('description')).to.equal('A chart')
    })

    it('exposes the internal figure-label HAX schema', async () => {
      const el = await fixture(
        html`<media-image
          source="files/photo.jpg"
          figure-label-title="1.4"
        ></media-image>`,
      )
      await el.updateComplete
      const label = el.shadowRoot.querySelector('figure-label')
      const haxProps = label.constructor.haxProperties
      expect(haxProps.gizmo.title).to.equal('Figure label')
      expect(haxProps.settings.configure).to.have.lengthOf(2)
    })
  })

  describe('modal title derivation', () => {
    it('combines figure label title and description', async () => {
      const el = await fixture(
        html`<media-image
          source="files/photo.jpg"
          figure-label-title="Figure 1"
          figure-label-description="The data"
          caption="A caption"
        ></media-image>`,
      )
      await el.updateComplete
      expect(el.modalTitle).to.equal('Figure 1 - The data')
      expect(
        el.shadowRoot
          .querySelector('media-image-image')
          .getAttribute('modal-title'),
      ).to.equal('Figure 1 - The data')
    })

    it('uses the title alone when no description exists', async () => {
      const el = await fixture(
        html`<media-image
          source="files/photo.jpg"
          figure-label-title="Figure 2"
        ></media-image>`,
      )
      await el.updateComplete
      expect(el.modalTitle).to.equal('Figure 2')
    })

    it('falls back to the caption when no figure label title exists', async () => {
      const el = await fixture(
        html`<media-image
          source="files/photo.jpg"
          caption="Caption fallback"
        ></media-image>`,
      )
      await el.updateComplete
      expect(el.modalTitle).to.equal('Caption fallback')
    })

    it('stays empty without a title or caption', async () => {
      const el = await fixture(
        html`<media-image source="files/photo.jpg"></media-image>`,
      )
      await el.updateComplete
      expect(el.modalTitle).to.equal('')
    })
  })

  describe('caption handling', () => {
    it('renders the caption element for a caption property', async () => {
      const el = await fixture(
        html`<media-image source="files/photo.jpg" caption="My caption">
        </media-image>`,
      )
      await el.updateComplete
      const caption = el.shadowRoot.querySelector('media-image-caption')
      expect(caption).to.exist
      // the caption is not interactive so it stays out of the tab order
      expect(caption.hasAttribute('tabindex')).to.equal(false)
      expect(caption.textContent).to.include('My caption')
    })

    it('drops the caption element when the caption empties', async () => {
      const el = await fixture(
        html`<media-image source="files/photo.jpg" caption="My caption">
        </media-image>`,
      )
      await el.updateComplete
      el.caption = ''
      await el.updateComplete
      expect(el.shadowRoot.querySelector('media-image-caption')).to.equal(
        null,
      )
    })

    it('reacts to slotted caption content through the observer', async () => {
      const el = await fixture(
        html`<media-image source="files/photo.jpg"></media-image>`,
      )
      await el.updateComplete
      expect(el.shadowRoot.querySelector('media-image-caption')).to.equal(
        null,
      )
      const slotted = globalThis.document.createElement('div')
      slotted.setAttribute('slot', 'caption')
      slotted.textContent = 'Slotted caption'
      el.appendChild(slotted)
      await aTimeout(100)
      const caption = el.shadowRoot.querySelector('media-image-caption')
      expect(caption).to.exist
      slotted.remove()
      await aTimeout(100)
      expect(el.shadowRoot.querySelector('media-image-caption')).to.equal(
        null,
      )
    })
  })

  describe('citation and presentation attributes', () => {
    it('renders the citation block with its content', async () => {
      const el = await fixture(
        html`<media-image
          source="files/photo.jpg"
          citation="Photo by someone"
        ></media-image>`,
      )
      await el.updateComplete
      const citation = el.shadowRoot.querySelector('media-image-citation')
      expect(citation).to.exist
      expect(citation.textContent).to.include('Photo by someone')
    })

    it('reflects round on the inner image element', async () => {
      const el = await fixture(
        html`<media-image source="files/photo.jpg" round></media-image>`,
      )
      await el.updateComplete
      expect(
        el.shadowRoot.querySelector('media-image-image').hasAttribute('round'),
      ).to.be.true
    })
  })

  describe('hax hooks', () => {
    it('declares edit mode, active element and media source hooks', () => {
      const el = globalThis.document.createElement('media-image')
      const hooks = el.haxHooks()
      expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
      expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
      expect(hooks.mediaSourceUpdated).to.equal('haxmediaSourceUpdated')
    })

    it('tracks edit mode state from haxeditModeChanged', () => {
      const el = globalThis.document.createElement('media-image')
      el.haxeditModeChanged(true)
      expect(el._haxState).to.be.true
      el.haxeditModeChanged(false)
      expect(el._haxState).to.be.false
    })

    it('sets active element state only for truthy values', () => {
      const el = globalThis.document.createElement('media-image')
      el.haxactiveElementChanged(el, true)
      expect(el._haxState).to.be.true
      el.haxactiveElementChanged(el, false)
      expect(el._haxState).to.be.true
    })
  })

  describe('_handleClick', () => {
    it('blocks the event while hax editing', async () => {
      const el = await fixture(
        html`<media-image source="files/photo.jpg"></media-image>`,
      )
      await el.updateComplete
      let prevented = 0
      let stopped = 0
      let stoppedImmediately = 0
      el.haxeditModeChanged(true)
      el._handleClick({
        preventDefault: () => {
          prevented++
        },
        stopPropagation: () => {
          stopped++
        },
        stopImmediatePropagation: () => {
          stoppedImmediately++
        },
      })
      expect(prevented).to.equal(1)
      expect(stopped).to.equal(1)
      expect(stoppedImmediately).to.equal(1)
    })

    it('blocks the event when zoom is disabled without editing', async () => {
      const el = await fixture(
        html`<media-image source="files/photo.jpg" disable-zoom>
        </media-image>`,
      )
      await el.updateComplete
      let prevented = 0
      el._handleClick({
        preventDefault: () => {
          prevented++
        },
        stopPropagation: () => {},
        stopImmediatePropagation: () => {},
      })
      expect(prevented).to.equal(1)
    })

    it('follows the anchor when a link with disabled zoom is clicked', async () => {
      const el = await fixture(
        html`<media-image
          source="files/photo.jpg"
          link="#follow-me"
        ></media-image>`,
      )
      await el.updateComplete
      expect(el.disableZoom).to.be.true
      const anchor = el.shadowRoot.querySelector('a')
      let anchorClicked = false
      const originalClick = anchor.click
      anchor.click = () => {
        anchorClicked = true
      }
      el._handleClick({
        preventDefault: () => {},
        stopPropagation: () => {},
        stopImmediatePropagation: () => {},
      })
      anchor.click = originalClick
      expect(anchorClicked).to.be.true
    })

    it('lets the modal open when zoom is enabled and not editing', async () => {
      const el = await fixture(
        html`<media-image source="files/photo.jpg"></media-image>`,
      )
      await el.updateComplete
      let prevented = 0
      el._handleClick({
        preventDefault: () => {
          prevented++
        },
        stopPropagation: () => {},
        stopImmediatePropagation: () => {},
      })
      expect(prevented).to.equal(0)
    })
  })

  describe('_handleImageKeydown', () => {
    let el
    let clicks
    const keyEvent = (key) => ({
      key,
      preventDefault: () => {},
      target: {
        click: () => {
          clicks++
        },
      },
    })

    beforeEach(async () => {
      el = await fixture(
        html`<media-image source="files/photo.jpg"></media-image>`,
      )
      await el.updateComplete
      clicks = 0
    })

    it('activates the image for Enter, Space and Spacebar', () => {
      el._handleImageKeydown(keyEvent('Enter'))
      el._handleImageKeydown(keyEvent(' '))
      el._handleImageKeydown(keyEvent('Spacebar'))
      expect(clicks).to.equal(3)
    })

    it('ignores other keys', () => {
      el._handleImageKeydown(keyEvent('Tab'))
      el._handleImageKeydown(keyEvent('ArrowLeft'))
      expect(clicks).to.equal(0)
    })

    it('does nothing while zoom is disabled', async () => {
      el.disableZoom = true
      await el.updateComplete
      el._handleImageKeydown(keyEvent('Enter'))
      expect(clicks).to.equal(0)
    })

    it('does nothing while hax editing', () => {
      el.haxeditModeChanged(true)
      el._handleImageKeydown(keyEvent('Enter'))
      expect(clicks).to.equal(0)
    })
  })

  describe('haxmediaSourceUpdated guards', () => {
    it('ignores calls with missing path, store or matcher', async () => {
      const el = await fixture(
        html`<media-image source="files/photo.jpg"></media-image>`,
      )
      await el.updateComplete
      let poked = false
      const fakeStore = {
        _mediaSrcMatches: (src, path) =>
          String(src || '').indexOf(path) !== -1,
        _pokeMatchingImgs: () => {
          poked = true
        },
      }
      expect(() => el.haxmediaSourceUpdated(null, fakeStore)).to.not.throw
      expect(() => el.haxmediaSourceUpdated('files/photo.jpg', null)).to.not
        .throw
      expect(() => el.haxmediaSourceUpdated('files/photo.jpg', {})).to.not
        .throw
      expect(poked).to.be.false
    })

    it('pokes when the thumbnail matches the changed path', async () => {
      const el = await fixture(
        html`<media-image
          source="files/full.jpg"
          thumbnail="files/thumb.jpg"
        ></media-image>`,
      )
      await el.updateComplete
      let poked = null
      const fakeStore = {
        _mediaSrcMatches: (src, path) =>
          String(src || '').indexOf(path) !== -1,
        _pokeMatchingImgs: (root, path) => {
          poked = { root, path }
        },
      }
      el.haxmediaSourceUpdated('files/thumb.jpg', fakeStore)
      expect(poked).to.not.equal(null)
      expect(poked.path).to.equal('files/thumb.jpg')
    })
  })

  describe('hax schema', () => {
    it('exposes the full HAX property schema', () => {
      const haxProps = globalThis.document.createElement(
        'media-image',
      ).constructor.haxProperties
      expect(haxProps.canScale).to.be.true
      expect(haxProps.canEditSource).to.be.true
      expect(haxProps.gizmo.title).to.equal('Enhanced Image')
      expect(haxProps.gizmo.handles[0].type).to.equal('image')
      expect(haxProps.gizmo.handles[0].type_exclusive).to.be.true
      expect(haxProps.gizmo.meta.outlineDesigner).to.be.true
      const configure = haxProps.settings.configure
      const sourceConfig = configure.find((c) => c.property === 'source')
      expect(sourceConfig.required).to.be.true
      expect(sourceConfig.inputMethod).to.equal('haxupload')
      const altConfig = configure.find((c) => c.property === 'alt')
      expect(altConfig.required).to.be.true
      const offsetConfig = configure.find((c) => c.property === 'offset')
      expect(offsetConfig.options).to.deep.equal({
        none: 'none',
        wide: 'wide',
        narrow: 'narrow',
      })
      const advanced = haxProps.settings.advanced
      expect(advanced.map((c) => c.property)).to.include('thumbnail')
      expect(advanced.map((c) => c.property)).to.include('round')
      expect(advanced.map((c) => c.property)).to.include('disableZoom')
      expect(haxProps.settings.developer[0].property).to.equal('asMd')
      expect(haxProps.demoSchema[0].tag).to.equal('media-image')
      expect(haxProps.demoSchema[0].properties.card).to.be.true
    })
  })
})
