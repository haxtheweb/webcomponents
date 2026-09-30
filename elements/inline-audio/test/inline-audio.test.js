import { fixture, expect, html } from "@open-wc/testing";
import "../inline-audio.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <p>
        Richard Stallman once sang the
        <inline-audio
          shiny
          dark
          accent-color="purple"
          source="https://inline-audio-mocha.vercel.app/assets/whopper.mp3"
          >Open Source song.</inline-audio
        >
        The King of Burgers made a decree. The decree came in the form of a
        song. Not just any song, but a legendary song that bellowed to the
        world. This song was of
        <inline-audio
          accent-color="purple"
          source="https://inline-audio-mocha.vercel.app/assets/whopper.mp3"
          ><span>whoppers, toppers, boppers, and boopers.</span></inline-audio
        >
        The seven seas were aghast with the tune of
        <inline-audio
          dark
          accent-color="red"
          source="https://inline-audio-mocha.vercel.app/assets/whopper.mp3"
          >?</inline-audio
        >
        over the wind. Did you know that the critically acclaimed MMORPG Final
        Fantasy XIV has a free trial, and includes the entirety of A Realm
        Reborn AND the award-winning Heavensward expansion up to level 60 with
        no restrictions on playtime? Sign up, and enjoy Eorzea today!
      </p>`,
    );
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe('inline-audio behavior', () => {
  let el
  let audio

  const makeFakeAudio = () => {
    return {
      ended: false,
      currentTime: 25,
      duration: 100,
      paused: true,
      src: '',
      playCount: 0,
      pauseCount: 0,
      loadCount: 0,
      hasSrcAttribute: false,
      play() {
        this.playCount += 1
        this.paused = false
      },
      pause() {
        this.pauseCount += 1
        this.paused = true
      },
      load() {
        this.loadCount += 1
      },
      hasAttribute() {
        return this.hasSrcAttribute
      },
    }
  }

  const makeFakeEvent = () => {
    const flags = {
      defaultPrevented: false,
      propagationStopped: false,
      immediateStopped: false,
    }
    return {
      flags,
      preventDefault() {
        flags.defaultPrevented = true
      },
      stopPropagation() {
        flags.propagationStopped = true
      },
      stopImmediatePropagation() {
        flags.immediateStopped = true
      },
    }
  }

  beforeEach(async () => {
    el = await fixture(
      html` <inline-audio source="clip.mp3">Hear it</inline-audio> `,
    )
    await el.updateComplete
    audio = makeFakeAudio()
    el.__audio = audio
    el.shadowRoot.getSelection = () => ({ toString: () => '' })
  })

  afterEach(() => {
    if (el && el.shadowRoot) {
      delete el.shadowRoot.getSelection
    }
  })

  describe('defaults and wiring', () => {
    it('has the correct tag name', () => {
      expect(el.constructor.tag).to.equal('inline-audio')
    })

    it('sets constructor defaults', async () => {
      const fresh = await fixture(html` <inline-audio>plain</inline-audio> `)
      await fresh.updateComplete
      expect(fresh.source).to.equal('')
      expect(fresh.icon).to.equal('av:play-arrow')
      expect(fresh.playing).to.equal(false)
      expect(fresh.shiny).to.equal(false)
      expect(fresh.canPlay).to.equal(false)
      expect(fresh._haxstate).to.equal(false)
      expect(fresh.title).to.equal('Play')
      expect(fresh.aria).to.equal('Select to play related audio clip')
      expect(fresh.t.play).to.equal('Play')
      expect(fresh.t.pause).to.equal('Pause')
    })

    it('firstUpdated wires __audio to the shadow audio element', async () => {
      const fresh = await fixture(html` <inline-audio>word</inline-audio> `)
      await fresh.updateComplete
      expect(fresh.__audio).to.exist
      expect(fresh.__audio.tagName.toLowerCase()).to.equal('audio')
      expect(fresh.__audio.classList.contains('player')).to.equal(true)
      expect(fresh.__audio.hasAttribute('hidden')).to.equal(true)
    })

    it('reflects playing and shiny attributes', async () => {
      el.playing = true
      el.shiny = true
      await el.updateComplete
      expect(el.hasAttribute('playing')).to.equal(true)
      expect(el.hasAttribute('shiny')).to.equal(true)
      el.playing = false
      el.shiny = false
      await el.updateComplete
      expect(el.hasAttribute('playing')).to.equal(false)
      expect(el.hasAttribute('shiny')).to.equal(false)
    })
  })

  describe('rendered structure', () => {
    it('renders container, icon button, live region, slot, audio and progress parts', () => {
      const root = el.shadowRoot
      expect(root.querySelector('.container')).to.exist
      const btn = root.querySelector('simple-icon-button')
      expect(btn).to.exist
      expect(btn.getAttribute('icon')).to.equal('av:play-arrow')
      expect(btn.getAttribute('title')).to.equal('Play')
      expect(btn.getAttribute('label')).to.equal(
        'Select to play related audio clip',
      )
      const sr = root.querySelector('.sr-only')
      expect(sr.getAttribute('aria-live')).to.equal('polite')
      expect(sr.getAttribute('aria-atomic')).to.equal('true')
      expect(root.querySelector('slot')).to.exist
      expect(root.querySelector('audio.player')).to.exist
      expect(root.querySelector('[part="progress-bar"]')).to.exist
      expect(root.querySelector('[part="progress"]')).to.exist
      expect(el.textContent.trim()).to.equal('Hear it')
    })

    it('passes the a11y audit while playing', async () => {
      el.playing = true
      await el.updateComplete
      await expect(el).shadowDom.to.be.accessible()
    })
  })

  describe('audio control methods', () => {
    it('audioController(true) plays and sets playing', () => {
      el.audioController(true)
      expect(audio.playCount).to.equal(1)
      expect(audio.paused).to.equal(false)
      expect(el.playing).to.equal(true)
    })

    it('audioController(false) pauses and unsets playing', () => {
      el.audioController(true)
      el.audioController(false)
      expect(audio.pauseCount).to.equal(1)
      expect(audio.paused).to.equal(true)
      expect(el.playing).to.equal(false)
    })

    it('play() and pause() are shortcuts for audioController', () => {
      el.play()
      expect(audio.playCount).to.equal(1)
      expect(el.playing).to.equal(true)
      el.pause()
      expect(audio.pauseCount).to.equal(1)
      expect(el.playing).to.equal(false)
    })

    it('load() sets src and calls load on the audio element', () => {
      el.load('data:audio/mpeg;base64,')
      expect(audio.src).to.equal('data:audio/mpeg;base64,')
      expect(audio.loadCount).to.equal(1)
    })
  })

  describe('handleProgress', () => {
    it('updates the progress bar width from playback position', () => {
      audio.currentTime = 25
      audio.duration = 100
      audio.paused = true
      el.handleProgress()
      expect(el.shadowRoot.querySelector('.progress').style.width).to.equal(
        '25%',
      )
      expect(audio.pauseCount).to.equal(0)
    })

    it('stops playback when the audio has ended', () => {
      audio.ended = true
      audio.paused = true
      el.handleProgress()
      expect(audio.pauseCount).to.equal(1)
      expect(el.playing).to.equal(false)
    })

    it('keeps animating while playing then stops when paused', async () => {
      audio.paused = false
      audio.currentTime = 40
      audio.duration = 100
      el.handleProgress()
      expect(el.shadowRoot.querySelector('.progress').style.width).to.equal(
        '40%',
      )
      // stop the rAF loop before it schedules forever
      audio.paused = true
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      )
      expect(el.shadowRoot.querySelector('.progress').style.width).to.equal(
        '40%',
      )
    })

    it('writes no usable width when duration is unknown', () => {
      // BUG inline-audio.js:154 - currentTime / duration with an unknown
      // duration (0, or Infinity for live streams) produces NaN% / Infinity%,
      // which the CSSOM drops leaving no inline width. Harmless visually but
      // the progress bar silently does nothing for live sources.
      audio.currentTime = 0
      audio.duration = 0
      audio.paused = true
      el.handleProgress()
      expect(el.shadowRoot.querySelector('.progress').style.width).to.equal('')
    })
  })

  describe('handlePlaythrough', () => {
    it('enables canPlay and starts playback after the media can play', async () => {
      el.handlePlaythrough()
      expect(el.canPlay).to.equal(false)
      await new Promise((resolve) => setTimeout(resolve, 600))
      expect(el.canPlay).to.equal(true)
      expect(audio.playCount).to.equal(1)
      expect(el.playing).to.equal(true)
      expect(el.icon).to.equal('av:pause')
    })
  })

  describe('click handling', () => {
    it('ignores clicks while in HAX edit mode', () => {
      el._haxstate = true
      const ev = makeFakeEvent()
      el.__clickEvent(ev)
      expect(ev.flags.defaultPrevented).to.equal(true)
      expect(ev.flags.propagationStopped).to.equal(true)
      expect(ev.flags.immediateStopped).to.equal(true)
      expect(audio.loadCount).to.equal(0)
      expect(audio.playCount).to.equal(0)
    })

    it('loads the source on first click when no src attribute exists', () => {
      audio.hasSrcAttribute = false
      el.__clickEvent(makeFakeEvent())
      expect(audio.loadCount).to.equal(1)
      expect(audio.src).to.equal('clip.mp3')
      expect(el.icon).to.equal('hax:loading')
    })

    it('clicking the icon button loads the source through the host listener', async () => {
      el.shadowRoot.querySelector('simple-icon-button').click()
      await el.updateComplete
      expect(audio.loadCount).to.equal(1)
      expect(audio.src).to.equal('clip.mp3')
      expect(el.icon).to.equal('hax:loading')
    })

    it('plays when clicked with canPlay and paused audio', () => {
      audio.hasSrcAttribute = true
      el.canPlay = true
      audio.paused = true
      el.__clickEvent(makeFakeEvent())
      expect(audio.playCount).to.equal(1)
      expect(el.playing).to.equal(true)
    })

    it('pauses when clicked while playing', () => {
      audio.hasSrcAttribute = true
      el.canPlay = true
      audio.paused = false
      el.playing = true
      el.__clickEvent(makeFakeEvent())
      expect(audio.pauseCount).to.equal(1)
      expect(el.playing).to.equal(false)
    })

    it('does nothing before canPlay once src exists', () => {
      audio.hasSrcAttribute = true
      el.canPlay = false
      el.__clickEvent(makeFakeEvent())
      expect(audio.playCount).to.equal(0)
      expect(audio.pauseCount).to.equal(0)
      expect(audio.loadCount).to.equal(0)
    })

    it('does nothing when text inside the player is selected', () => {
      el.shadowRoot.getSelection = () => ({ toString: () => 'selected words' })
      audio.hasSrcAttribute = false
      el.__clickEvent(makeFakeEvent())
      expect(audio.loadCount).to.equal(0)
      expect(el.icon).to.equal('av:play-arrow')
    })

    it('swallows selection API failures', () => {
      el.shadowRoot.getSelection = () => {
        throw new Error('no selection api')
      }
      audio.hasSrcAttribute = false
      el.__clickEvent(makeFakeEvent())
      expect(audio.loadCount).to.equal(0)
      expect(el.icon).to.equal('av:play-arrow')
    })
  })

  describe('playing-changed lifecycle event', () => {
    it('dispatches playing-changed and swaps icon, title and aria', async () => {
      const seen = []
      const onChange = (e) => seen.push(e.detail.value)
      el.addEventListener('playing-changed', onChange)
      el.playing = true
      await el.updateComplete
      expect(seen).to.deep.equal([true])
      expect(el.icon).to.equal('av:pause')
      expect(el.title).to.equal('Pause')
      expect(el.aria).to.equal('Select to pause related audio clip')
      el.playing = false
      await el.updateComplete
      expect(seen).to.deep.equal([true, false])
      expect(el.icon).to.equal('av:play-arrow')
      expect(el.title).to.equal('Play')
      expect(el.aria).to.equal('Select to play related audio clip')
      el.removeEventListener('playing-changed', onChange)
    })
  })

  describe('HAX integration', () => {
    it('exposes haxProperties as a file URL to the JSON schema', () => {
      const href = el.constructor.haxProperties
      expect(href).to.include('lib/inline-audio.haxProperties.json')
      const parsed = new URL(href)
      expect(parsed.href).to.equal(href)
    })

    it('loads the referenced haxProperties JSON schema', async () => {
      const res = await fetch(el.constructor.haxProperties)
      expect(res.ok).to.equal(true)
      const schema = await res.json()
      expect(schema.gizmo.title).to.equal('Inline audio')
      expect(schema.settings.configure[0].property).to.equal('source')
      expect(schema.saveOptions.unsetAttributes).to.include('playing')
    })

    it('registers hax hooks', () => {
      const hooks = el.haxHooks()
      expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
      expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
    })

    it('tracks hax edit state in both directions', () => {
      el.haxeditModeChanged(true)
      expect(el._haxstate).to.equal(true)
      el.haxeditModeChanged(false)
      expect(el._haxstate).to.equal(false)
    })

    it('haxactiveElementChanged only sets state when active', () => {
      el.haxactiveElementChanged(el, true)
      expect(el._haxstate).to.equal(true)
      el.haxactiveElementChanged(el, false)
      expect(el._haxstate).to.equal(true)
    })
  })
});
