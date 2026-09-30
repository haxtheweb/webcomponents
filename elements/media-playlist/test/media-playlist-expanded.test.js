import { fixture, expect, html } from '@open-wc/testing'
import '../media-playlist.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

describe('media-playlist items and rendering', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`
      <media-playlist for-course="course-1">
        <video-player
          source="clip.mp4"
          media-title="Video One"
          thumbnail-src="t1.jpg"
          tracks='[{"kind":"subtitles","src":"en.vtt","srclang":"en","label":"English"}]'
          crossorigin="anonymous"
          lang="en"
        ></video-player>
        <audio-player
          media-title="Audio One"
          duration="2:15"
          tracks="not-json"
        ></audio-player>
        <div>not media</div>
      </media-playlist>
    `)
    await element.updateComplete
    await sleep(150)
    await element.updateComplete
  })

  it('collects only player children into mediaItems', () => {
    expect(element.mediaItems.length).to.equal(2)
    expect(element.mediaItems[0].tagName).to.equal('VIDEO-PLAYER')
    expect(element.mediaItems[0].isAudio).to.be.false
    expect(element.mediaItems[1].tagName).to.equal('AUDIO-PLAYER')
    expect(element.mediaItems[1].isAudio).to.be.true
    expect(element.mediaItems[0].source).to.equal('clip.mp4')
    expect(element.mediaItems[0].title).to.equal('Video One')
    expect(element.mediaItems[0].mediaTitle).to.equal('Video One')
    expect(element.mediaItems[0].thumbnailSrc).to.equal('t1.jpg')
    expect(element.mediaItems[1].duration).to.equal('2:15')
    expect(element.mediaItems[0].crossorigin).to.equal('anonymous')
    expect(element.mediaItems[0].lang).to.equal('en')
    expect(element.mediaItems[1].lang).to.equal('en')
  })

  it('reads tracks from the parsed property and tolerates bad JSON', () => {
    expect(Array.isArray(element.mediaItems[0].tracks)).to.be.true
    expect(element.mediaItems[0].tracks.length).to.equal(1)
    expect(element.mediaItems[0].tracks[0].kind).to.equal('subtitles')
    // the invalid tracks attribute falls back to an empty array
    expect(Array.isArray(element.mediaItems[1].tracks)).to.be.true
    expect(element.mediaItems[1].tracks.length).to.equal(0)
  })

  it('renders the active video player, playlist sidebar and OER metadata', () => {
    expect(element.getAttribute('typeof')).to.equal('oer:LearningComponent')
    const player = element.shadowRoot.querySelector('#player')
    expect(player).to.exist
    expect(player.tagName).to.equal('VIDEO-PLAYER')
    expect(element.shadowRoot.querySelector('.playlist-header').textContent).to
      .equal('Playlist')
    const items = element.shadowRoot.querySelectorAll('.playlist-item')
    expect(items.length).to.equal(2)
    expect(items[0].classList.contains('active')).to.be.true
    expect(items[0].getAttribute('aria-current')).to.equal('true')
    expect(items[1].getAttribute('aria-current')).to.equal('false')
    expect(items[0].getAttribute('aria-label')).to.equal('Play Video One, ')
    expect(items[0].querySelector('img.playlist-thumbnail')).to.exist
    expect(items[1].querySelector('div.playlist-thumbnail')).to.exist
    expect(
      element.shadowRoot.querySelectorAll('meta[property="oer:hasComponent"]')
        .length,
    ).to.equal(2)
    const forCourse = element.shadowRoot.querySelector(
      'meta[property="oer:forCourse"]',
    )
    expect(forCourse.getAttribute('content')).to.equal('course-1')
  })

  it('switches the active item to the audio player', async () => {
    element._setActiveIndex(1)
    await element.updateComplete
    await sleep(200)
    expect(element.activeIndex).to.equal(1)
    expect(element.shadowRoot.querySelector('#player').tagName).to.equal(
      'AUDIO-PLAYER',
    )
    const items = element.shadowRoot.querySelectorAll('.playlist-item')
    expect(items[1].classList.contains('active')).to.be.true
    expect(items[0].classList.contains('active')).to.be.false
    // out of range and negative indexes are ignored
    element._setActiveIndex(9)
    element._setActiveIndex(-1)
    await element.updateComplete
    expect(element.activeIndex).to.equal(1)
    // the attached mediastatechange listener advances at the end boundary
    element.shadowRoot
      .querySelector('#player')
      .dispatchEvent(
        new CustomEvent('mediastatechange', { detail: { data: 0 } }),
      )
    expect(element.activeIndex).to.equal(1)
  })

  it('restarts the player when the active item is re-selected', async () => {
    const player = element.shadowRoot.querySelector('#player')
    const restarts = []
    player.restart = () => restarts.push('ok')
    element._setActiveIndex(0)
    expect(restarts).to.deep.equal(['ok'])
    expect(element.activeIndex).to.equal(0)
    // a throwing restart is swallowed
    player.restart = () => {
      throw new Error('restart boom')
    }
    element._setActiveIndex(0)
    expect(restarts.length).to.equal(1)
    // players without restart are skipped
    player.restart = undefined
    element._setActiveIndex(0)
    expect(restarts.length).to.equal(1)
  })

  it('advances on media state change and ended with a re-entry guard', async () => {
    // non-zero state data does not advance
    element._onMediaStateChange({ detail: { data: 1 } })
    expect(element.activeIndex).to.equal(0)
    // events without detail are ignored
    element._onMediaStateChange({})
    expect(element.activeIndex).to.equal(0)
    element._onMediaStateChange({ detail: { data: 0 } })
    expect(element.activeIndex).to.equal(1)
    // the advancing guard blocks re-entry for 500ms
    element._onMediaStateChange({ detail: { data: 0 } })
    expect(element.activeIndex).to.equal(1)
    await sleep(600)
    // at the end of the list the advance is a no-op
    element._onMediaEnded()
    expect(element.activeIndex).to.equal(1)
    await sleep(600)
    element._onMediaEnded()
    expect(element.activeIndex).to.equal(1)
  })

  it('rebuilds items from light-DOM mutations', async () => {
    const extra = globalThis.document.createElement('video-player')
    extra.setAttribute('source', 'clip2.mp4')
    element.appendChild(extra)
    await sleep(250)
    await element.updateComplete
    expect(element.mediaItems.length).to.equal(3)
    // items without a media title fall back to a numbered label
    expect(element.mediaItems[2].title).to.equal('Item 3')
    // removing every player resets the active index
    element._setActiveIndex(2)
    element.mediaItems.forEach((item) => item.element.remove())
    await sleep(250)
    await element.updateComplete
    expect(element.mediaItems.length).to.equal(0)
    expect(element.activeIndex).to.equal(0)
    expect(element.shadowRoot.querySelector('#player')).to.not.exist
  })

  it('syncs dark mode onto the player children', () => {
    element._setDarkMode(true)
    expect(element.mediaItems[0].element.hasAttribute('dark')).to.be.true
    expect(element.mediaItems[1].element.hasAttribute('dark')).to.be.true
    element._setDarkMode(false)
    expect(element.mediaItems[0].element.hasAttribute('dark')).to.be.false
    // the media-query change handler runs without throwing
    element._darkModeQuery.dispatchEvent(new Event('change'))
    expect(element.mediaItems.length).to.equal(2)
  })

  it('drives arrow-key and Enter navigation', async () => {
    const items = element.shadowRoot.querySelectorAll('.playlist-item')
    const mkEvent = (key, index) => {
      const target = element.shadowRoot.querySelector(
        `.playlist-item[data-index="${index}"]`,
      )
      const prevented = []
      return {
        key,
        target,
        prevented,
        preventDefault() {
          prevented.push(key)
        },
        composedPath() {
          return [target]
        },
      }
    }
    // events targeting something outside the playlist are ignored
    const outside = mkEvent('ArrowDown', 0)
    outside.target = element
    element._handleKeydown(outside)
    expect(element.activeIndex).to.equal(0)
    // ArrowDown moves down and focuses the item
    element._handleKeydown(mkEvent('ArrowDown', 0))
    expect(element.activeIndex).to.equal(1)
    const focused = element.shadowRoot.activeElement
    expect(focused === element.shadowRoot.querySelector('.playlist-item[data-index="1"]')).to.be.true
    // ArrowDown clamps at the last item
    element._handleKeydown(mkEvent('ArrowDown', 1))
    expect(element.activeIndex).to.equal(1)
    // ArrowUp moves back up
    element._handleKeydown(mkEvent('ArrowUp', 1))
    expect(element.activeIndex).to.equal(0)
    // Enter selects the item in the composed path
    const enterEvent = mkEvent('Enter', 1)
    element._handleKeydown(enterEvent)
    expect(enterEvent.prevented).to.deep.equal(['Enter'])
    expect(element.activeIndex).to.equal(1)
    // Space behaves the same
    element._handleKeydown(mkEvent(' ', 0))
    expect(element.activeIndex).to.equal(0)
    // unknown keys are ignored
    element._handleKeydown(mkEvent('x', 0))
    expect(element.activeIndex).to.equal(0)
    // focusing an unknown index does not throw
    element._focusPlaylistItem(99)
    expect(element.activeIndex).to.equal(0)
  })
})

describe('media-playlist edit mode', () => {
  it('renders an edit wrapper and pauses children on exit', async () => {
    const el = await fixture(html`
      <media-playlist edit>
        <video-player source="clip.mp4" media-title="Edit One"></video-player>
      </media-playlist>
    `)
    await el.updateComplete
    expect(el.shadowRoot.querySelector('.edit-wrapper')).to.exist
    const child = el.querySelector('video-player')
    const pauses = []
    child.pause = () => pauses.push('paused')
    el.edit = false
    await el.updateComplete
    await sleep(150)
    expect(pauses).to.deep.equal(['paused'])
    expect(el.mediaItems.length).to.equal(1)
    expect(el.shadowRoot.querySelector('.edit-wrapper')).to.not.exist
    expect(el.shadowRoot.querySelector('.layout')).to.exist
    // a throwing pause is swallowed on the next exit cycle
    child.pause = () => {
      throw new Error('pause boom')
    }
    el.edit = true
    await el.updateComplete
    el.edit = false
    await el.updateComplete
    await sleep(150)
    expect(pauses.length).to.equal(1)
  })
})

describe('media-playlist HAX integration', () => {
  let element

  beforeEach(async () => {
    element = await fixture(html`
      <media-playlist>
        <video-player source="a.mp4" media-title="A"></video-player>
        <audio-player media-title="B"></audio-player>
      </media-playlist>
    `)
    await element.updateComplete
    await sleep(150)
    await element.updateComplete
  })

  it('registers the hax hooks', () => {
    expect(element.haxHooks()).to.deep.equal({
      inlineContextMenu: 'haxinlineContextMenu',
      editModeChanged: 'haxeditModeChanged',
      activeElementChanged: 'haxactiveElementChanged',
    })
  })

  it('haxeditModeChanged forwards to player children', () => {
    const calls = []
    const video = element.querySelector('video-player')
    const audio = element.querySelector('audio-player')
    video.haxeditModeChanged = (v) => calls.push(['video', v])
    // children without the hook are skipped without throwing
    audio.haxeditModeChanged = undefined
    element.haxeditModeChanged(true)
    expect(element._haxState).to.be.true
    expect(calls).to.deep.equal([['video', true]])
    element.haxeditModeChanged(false)
    expect(calls).to.deep.equal([
      ['video', true],
      ['video', false],
    ])
  })

  it('haxactiveElementChanged only sets state when activated', () => {
    element.haxactiveElementChanged(element, true)
    expect(element._haxState).to.be.true
    element.haxactiveElementChanged(element, false)
    expect(element._haxState).to.be.true
  })

  it('haxinlineContextMenu builds the button list', () => {
    const ceMenu = { ceButtons: [] }
    element.haxinlineContextMenu(ceMenu)
    expect(ceMenu.ceButtons.length).to.equal(5)
    expect(ceMenu.ceButtons.map((b) => b.callback)).to.deep.equal([
      'haxBreakOutPlaylist',
      'haxToggleEdit',
      'haxAddVideo',
      'haxAddAudio',
      'haxCopyActiveIndex',
    ])
  })

  it('haxToggleEdit flips edit mode', async () => {
    expect(element.haxToggleEdit({})).to.be.true
    expect(element.edit).to.be.true
    expect(element.haxToggleEdit({})).to.be.true
    expect(element.edit).to.be.false
    await element.updateComplete
    expect(element.mediaItems.length).to.equal(2)
  })

  it('haxAddVideo and haxAddAudio append players', async () => {
    expect(element.haxAddVideo({})).to.be.true
    expect(element.haxAddAudio({})).to.be.true
    await sleep(250)
    await element.updateComplete
    expect(element.mediaItems.length).to.equal(4)
    expect(element.mediaItems[2].tagName).to.equal('VIDEO-PLAYER')
    expect(element.mediaItems[2].title).to.equal('New video')
    expect(element.mediaItems[3].tagName).to.equal('AUDIO-PLAYER')
    expect(element.mediaItems[3].title).to.equal('New audio')
  })

  it('haxBreakOutPlaylist clones items and removes itself', async () => {
    const container = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(container)
    container.appendChild(element)
    const result = element.haxBreakOutPlaylist({})
    expect(result).to.be.true
    expect(container.querySelectorAll('video-player').length).to.equal(1)
    expect(container.querySelectorAll('audio-player').length).to.equal(1)
    // without a slot attribute the clones drop the slot
    expect(container.querySelector('video-player').hasAttribute('slot')).to.be
      .false
    expect(container.querySelector('media-playlist')).to.not.exist
    globalThis.document.body.removeChild(container)
  })

  it('haxBreakOutPlaylist honors the slot attribute', async () => {
    const container = globalThis.document.createElement('div')
    globalThis.document.body.appendChild(container)
    const el = await fixture(html`
      <media-playlist slot="col-1">
        <video-player source="a.mp4" media-title="A"></video-player>
      </media-playlist>
    `)
    await sleep(150)
    container.appendChild(el)
    expect(el.haxBreakOutPlaylist({})).to.be.true
    expect(container.querySelector('video-player').getAttribute('slot')).to
      .equal('col-1')
    globalThis.document.body.removeChild(container)
  })

  it('haxBreakOutPlaylist bails without a parent or items', async () => {
    // no parent node
    element.remove()
    expect(element.haxBreakOutPlaylist({})).to.be.false
    // upgraded but empty playlist
    const empty = await fixture(html`<media-playlist></media-playlist>`)
    await empty.updateComplete
    expect(empty.haxBreakOutPlaylist({})).to.be.false
  })

  it('haxCopyActiveIndex copies and reports success', () => {
    expect(element.haxCopyActiveIndex({})).to.be.true
  })

  it('_getHaxStore resolves the store through a stub', () => {
    expect(element._getHaxStore()).to.be.null
    const store = { marker: 'store' }
    globalThis.HaxStore = { requestAvailability: () => store }
    try {
      expect(element._getHaxStore().marker).to.equal('store')
      globalThis.HaxStore = {
        requestAvailability: () => {
          throw new Error('store boom')
        },
      }
      expect(element._getHaxStore()).to.be.null
    } finally {
      delete globalThis.HaxStore
    }
  })

  it('_onDrop gates on hax state, store and target tags', async () => {
    const makeEvent = () => {
      const counts = [0, 0, 0]
      return {
        e: {
          stopPropagation() {
            counts[0]++
          },
          stopImmediatePropagation() {
            counts[1]++
          },
          preventDefault() {
            counts[2]++
          },
        },
        counts,
      }
    }
    // outside hax state the drop is a no-op
    expect(element._onDrop({})).to.be.undefined
    element._haxState = true
    const store = {}
    globalThis.HaxStore = { requestAvailability: () => store }
    try {
      // a store without a drag target is a no-op
      const ev1 = makeEvent()
      element._onDrop(ev1.e)
      expect(ev1.counts).to.deep.equal([0, 0, 0])
      // non-media drag targets are rejected and cleared
      store.__dragTarget = globalThis.document.createElement('div')
      const ev2 = makeEvent()
      element._onDrop(ev2.e)
      expect(ev2.counts).to.deep.equal([1, 1, 1])
      expect(store.__dragTarget).to.be.null
      // external players are adopted into the playlist
      const external = globalThis.document.createElement('audio-player')
      external.setAttribute('media-title', 'Dropped')
      store.__dragTarget = external
      const ev3 = makeEvent()
      element._onDrop(ev3.e)
      expect(ev3.counts).to.deep.equal([1, 1, 1])
      expect(element.contains(external)).to.be.true
      await sleep(250)
      await element.updateComplete
      expect(element.mediaItems.length).to.equal(3)
      expect(element.mediaItems[2].title).to.equal('Dropped')
      // already-contained targets are not re-adopted
      store.__dragTarget = external
      const ev4 = makeEvent()
      element._onDrop(ev4.e)
      expect(ev4.counts).to.deep.equal([1, 1, 1])
      expect(element.mediaItems.length).to.equal(3)
    } finally {
      delete globalThis.HaxStore
      element._haxState = false
    }
  })

  it('attaches ended listeners to the active media element', async () => {
    // activeIndex has never changed, so no auto-attach timer is pending and
    // the manual calls below are the only ones in flight
    const player = element.shadowRoot.querySelector('#player')
    // video-player gates its a11y-media-player behind elementVisible
    // (IntersectionObserverMixin) and the real IO callback never delivers in
    // a backgrounded / throttled test tab. Simulate the callback the same way
    // the accent-card tests do so the player internals actually render.
    player.handleIntersectionCallback([{ intersectionRatio: 1 }])
    await player.updateComplete
    const a11yPlayer = player.shadowRoot.querySelector('a11y-media-player')
    expect(a11yPlayer).to.exist
    const fakeMedia = globalThis.document.createElement('video')
    // media/isYoutube are getter-only on the real player, so shadow them
    // with configurable own-property getters for this test
    let mediaValue = null
    Object.defineProperty(a11yPlayer, 'media', {
      get: () => mediaValue,
      configurable: true,
    })
    Object.defineProperty(a11yPlayer, 'isYoutube', {
      get: () => false,
      configurable: true,
    })
    try {
      // media not ready yet: the ended listener defers to a retry timer
      element._attachPlayerListeners()
      expect(element._lastMediaElement).to.be.null
      // the media element appears before the retry fires
      mediaValue = fakeMedia
      await sleep(600)
      expect(element._lastMediaElement === fakeMedia).to.be.true
      // the ended event routes through the attached listener and advances
      const ended = []
      fakeMedia.addEventListener('ended', () => ended.push('ended'))
      fakeMedia.dispatchEvent(new Event('ended'))
      expect(ended).to.deep.equal(['ended'])
      expect(element.activeIndex).to.equal(1)
      // re-attaching with the same media keeps the listener as-is
      element._attachPlayerListeners()
      expect(element._lastMediaElement === fakeMedia).to.be.true
      // a different media element swaps the ended listener over
      const other = globalThis.document.createElement('video')
      mediaValue = other
      element._attachPlayerListeners()
      expect(element._lastMediaElement === other).to.be.true
      // the old media element no longer advances the playlist
      fakeMedia.dispatchEvent(new Event('ended'))
      expect(ended.length).to.equal(2)
      expect(element.activeIndex).to.equal(1)
    } finally {
      delete a11yPlayer.media
      delete a11yPlayer.isYoutube
    }
  })

  it('exposes haxProperties via file reference', () => {
    expect(element.constructor.haxProperties).to.include(
      'media-playlist.haxProperties.json',
    )
  })

  it('cleans up listeners and tracked media on disconnect', async () => {
    const el = await fixture(html`
      <media-playlist>
        <video-player source="clip.mp4" media-title="V"></video-player>
      </media-playlist>
    `)
    await sleep(150)
    const fakeMedia = globalThis.document.createElement('video')
    el._lastMediaElement = fakeMedia
    el.remove()
    expect(el._lastMediaElement).to.be.null
  })
})
