import { fixture, expect, html } from '@open-wc/testing'

import '../lib/lecture-anchor.js'

describe('lecture-anchor registration', () => {
  it('registers as custom element', () => {
    const ctor = globalThis.customElements.get('lecture-anchor')
    expect(ctor).to.exist
  })

  it('has correct tag', () => {
    const ctor = globalThis.customElements.get('lecture-anchor')
    expect(ctor.tag).to.equal('video-player-flag')
  })
})

describe('lecture-anchor defaults', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<lecture-anchor>Flag text</lecture-anchor>`)
  })

  it('sets default property values', () => {
    expect(el.icon).to.equal('icons:flag')
    expect(el.value).to.equal(0)
    expect(el.target).to.equal('video-player')
    expect(el.associatedID).to.equal('')
    expect(el.jumbotronHeading).to.equal('')
    expect(el.jumbotronContent).to.equal('')
  })

  it('reflects properties as attributes', () => {
    expect(el.getAttribute('icon')).to.equal('icons:flag')
    expect(el.getAttribute('value')).to.equal('0')
    expect(el.getAttribute('target')).to.equal('video-player')
  })

  it('renders a mark element with role button', () => {
    const mark = el.shadowRoot.querySelector('mark')
    expect(mark).to.exist
    expect(mark.getAttribute('role')).to.equal('button')
    expect(mark.getAttribute('tabindex')).to.equal('0')
  })

  it('renders simple-icon-lite with icon', () => {
    const icon = el.shadowRoot.querySelector('simple-icon-lite')
    expect(icon).to.exist
    expect(icon.getAttribute('icon')).to.equal('icons:flag')
  })

  it('passes a11y audit', async () => {
    await expect(el).shadowDom.to.be.accessible()
  })
})

describe('lecture-anchor clickHandler', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<lecture-anchor>Flag text</lecture-anchor>`)
  })

  it('sets target to null when target node not found', () => {
    el.target = 'nonexistent-selector'
    el.clickHandler({ type: 'click' })
    expect(el.target).to.equal(null)
  })

  it('seeks video-player when value is set', async () => {
    // Use audio-player tag to avoid creating a full video-player instance
    const mockVP = globalThis.document.createElement('audio-player')
    mockVP.id = 'test-vp-seek'
    let seekCalled = false
    let seekValue = null
    mockVP.seek = (v) => {
      seekCalled = true
      seekValue = v
    }
    mockVP.play = () => {}
    mockVP.scrollIntoView = () => {}
    globalThis.document.body.appendChild(mockVP)
    el.target = '#test-vp-seek'
    el.value = 42
    try {
      el.clickHandler({ type: 'click' })
      await new Promise((r) => setTimeout(r, 150))
      expect(seekCalled).to.equal(true)
      expect(seekValue).to.equal(42)
    } finally {
      mockVP.remove()
    }
  })

  it('plays video-player when value is 0', async () => {
    const mockVP = globalThis.document.createElement('audio-player')
    mockVP.id = 'test-vp-play'
    let playCalled = false
    mockVP.play = () => {
      playCalled = true
    }
    mockVP.seek = () => {}
    mockVP.scrollIntoView = () => {}
    globalThis.document.body.appendChild(mockVP)
    el.target = '#test-vp-play'
    el.value = 0
    try {
      el.clickHandler({ type: 'click' })
      await new Promise((r) => setTimeout(r, 150))
      expect(playCalled).to.equal(true)
    } finally {
      mockVP.remove()
    }
  })

  it('sets slide on play-list target', async () => {
    const mockPL = globalThis.document.createElement('play-list')
    mockPL.id = 'test-pl'
    let slideValue = null
    Object.defineProperty(mockPL, 'slide', {
      set(v) {
        slideValue = v
      },
      get() {
        return slideValue
      },
      configurable: true,
    })
    mockPL.scrollIntoView = () => {}
    globalThis.document.body.appendChild(mockPL)
    el.target = '#test-pl'
    el.value = 3
    try {
      el.clickHandler({ type: 'click' })
      await new Promise((r) => setTimeout(r, 150))
      expect(slideValue).to.equal(3)
    } finally {
      mockPL.remove()
    }
  })

  it('does nothing for time-line target (default case)', async () => {
    const mockTL = globalThis.document.createElement('time-line')
    mockTL.id = 'test-tl'
    mockTL.scrollIntoView = () => {}
    globalThis.document.body.appendChild(mockTL)
    el.target = '#test-tl'
    el.value = 5
    try {
      el.clickHandler({ type: 'click' })
      await new Promise((r) => setTimeout(r, 150))
    } finally {
      mockTL.remove()
    }
  })
})

describe('lecture-anchor clickHandler with _haxState', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<lecture-anchor>Flag text</lecture-anchor>`)
    el._haxState = true
  })

  it('prevents default and returns false on click in haxState', () => {
    let preventCalled = false
    let stopCalled = false
    let stopImmediateCalled = false
    const fakeEvent = {
      type: 'click',
      preventDefault() {
        preventCalled = true
      },
      stopPropagation() {
        stopCalled = true
      },
      stopImmediatePropagation() {
        stopImmediateCalled = true
      },
    }
    const result = el.clickHandler(fakeEvent)
    expect(preventCalled).to.equal(true)
    expect(stopCalled).to.equal(true)
    expect(stopImmediateCalled).to.equal(true)
    expect(result).to.equal(false)
  })

  it('queries haxcms-theme-element in haxState with non-click event', async () => {
    const wrapper = globalThis.document.createElement('div')
    wrapper.classList.add('haxcms-theme-element')
    const mockVP = globalThis.document.createElement('audio-player')
    mockVP.id = 'hax-vp'
    let playCalled = false
    mockVP.play = () => {
      playCalled = true
    }
    mockVP.seek = () => {}
    mockVP.scrollIntoView = () => {}
    wrapper.appendChild(mockVP)
    globalThis.document.body.appendChild(wrapper)
    el.target = '#hax-vp'
    el.value = 0
    try {
      el.clickHandler({ type: 'keydown' })
      await new Promise((r) => setTimeout(r, 150))
      expect(playCalled).to.equal(true)
    } finally {
      wrapper.remove()
    }
  })
})

describe('lecture-anchor _handleKeydown', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<lecture-anchor>Flag text</lecture-anchor>`)
  })

  it('calls clickHandler on Enter key', () => {
    let called = false
    el.clickHandler = () => {
      called = true
    }
    el._handleKeydown({ key: 'Enter', preventDefault() {} })
    expect(called).to.equal(true)
  })

  it('calls clickHandler on Space key', () => {
    let called = false
    el.clickHandler = () => {
      called = true
    }
    el._handleKeydown({ key: ' ', preventDefault() {} })
    expect(called).to.equal(true)
  })

  it('calls clickHandler on Spacebar key', () => {
    let called = false
    el.clickHandler = () => {
      called = true
    }
    el._handleKeydown({ key: 'Spacebar', preventDefault() {} })
    expect(called).to.equal(true)
  })

  it('does not call clickHandler on other keys', () => {
    let called = false
    el.clickHandler = () => {
      called = true
    }
    el._handleKeydown({ key: 'Tab', preventDefault() {} })
    expect(called).to.equal(false)
  })

  it('does not call clickHandler in haxState', () => {
    let called = false
    el._haxState = true
    el.clickHandler = () => {
      called = true
    }
    el._handleKeydown({ key: 'Enter', preventDefault() {} })
    expect(called).to.equal(false)
  })

  it('prevents default on Enter', () => {
    let preventCalled = false
    el._handleKeydown({ key: 'Enter', preventDefault() { preventCalled = true } })
    expect(preventCalled).to.equal(true)
  })
})
