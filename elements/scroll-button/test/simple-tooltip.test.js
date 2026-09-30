import { fixture, expect, html } from '@open-wc/testing'

// scroll-button renders a simple-tooltip for its button, so the tooltip
// dependency's behaviors are covered from this package's test suite
import '@haxtheweb/simple-tooltip/simple-tooltip.js'

describe('simple-tooltip behavior (scroll-button dependency)', () => {
  async function makeTooltip(extra = '') {
    const container = await fixture(html`
      <div>
        <button id="tip-anchor">anchor</button>
        <simple-tooltip for="tip-anchor" position="bottom" ${extra}
          >Tip text</simple-tooltip
        >
      </div>
    `)
    const tooltip = container.querySelector('simple-tooltip')
    await tooltip.updateComplete
    return { container, tooltip, anchor: container.querySelector('#tip-anchor') }
  }

  /** time css custom properties used by the exit animation */
  function setDocTimeProperty(name, value) {
    const docEl = document.documentElement
    const previous = docEl.style.getPropertyValue(name)
    if (value === null) docEl.style.removeProperty(name)
    else docEl.style.setProperty(name, value)
    return () => {
      if (previous === '') docEl.style.removeProperty(name)
      else docEl.style.setProperty(name, previous)
    }
  }

  it('anchors to the element named by the for attribute', async () => {
    const { tooltip, anchor } = await makeTooltip()
    expect(tooltip.target).to.equal(anchor)
    expect(tooltip._target).to.equal(anchor)
  })

  it('anchors to the parent node when for is not set', async () => {
    const container = await fixture(
      html` <div><simple-tooltip>Tip text</simple-tooltip></div> `,
    )
    const tooltip = container.querySelector('simple-tooltip')
    await tooltip.updateComplete
    expect(tooltip.target).to.equal(container)
  })

  it('anchors to the shadow host when nested in a shadow root', async () => {
    const host = document.createElement('div')
    const shadow = host.attachShadow({ mode: 'open' })
    const tooltip = document.createElement('simple-tooltip')
    tooltip.textContent = 'Tip text'
    shadow.appendChild(tooltip)
    document.body.appendChild(host)
    try {
      await tooltip.updateComplete
      expect(tooltip.target).to.equal(host)
    } finally {
      host.remove()
    }
  })

  it('sets role and tabindex on first update', async () => {
    const { tooltip } = await makeTooltip()
    expect(tooltip.getAttribute('role')).to.equal('tooltip')
    expect(tooltip.getAttribute('tabindex')).to.equal('-1')
  })

  it('show is a no-op without any content', async () => {
    const { tooltip } = await makeTooltip()
    tooltip.textContent = ''
    await tooltip.updateComplete
    tooltip.show()
    expect(tooltip._showing).to.not.equal(true)
    expect(
      tooltip.shadowRoot.querySelector('#tooltip').classList.contains('hidden'),
    ).to.equal(true)
  })

  it('show reveals the tip with the entry animation class', async () => {
    const { tooltip } = await makeTooltip()
    tooltip.show()
    expect(tooltip._showing).to.equal(true)
    expect(tooltip._animationPlaying).to.equal(true)
    const tip = tooltip.shadowRoot.querySelector('#tooltip')
    expect(tip.classList.contains('hidden')).to.equal(false)
    expect(tip.classList.contains('fade-in-animation')).to.equal(true)
    // showing again while already showing does nothing
    tooltip.show()
    expect(tooltip._showing).to.equal(true)
  })

  it('shows when a slotted child provides the content', async () => {
    const { tooltip } = await makeTooltip()
    tooltip.textContent = ''
    // simulate a child that renders its text somewhere else, e.g. its own
    // shadow dom, so the tooltip itself has no text but the child does
    const child = document.createElement('span')
    Object.defineProperty(child, 'textContent', {
      configurable: true,
      get: () => 'Child supplied text',
    })
    tooltip.appendChild(child)
    await tooltip.updateComplete
    tooltip.show()
    expect(tooltip._showing).to.equal(true)
    expect(
      tooltip.shadowRoot.querySelector('#tooltip').classList.contains('hidden'),
    ).to.equal(false)
  })

  it('hide during the entry animation cancels straight to hidden', async () => {
    const { tooltip } = await makeTooltip()
    tooltip.show()
    expect(tooltip._animationPlaying).to.equal(true)
    tooltip.hide()
    expect(tooltip._showing).to.equal(false)
    expect(
      tooltip.shadowRoot.querySelector('#tooltip').classList.contains('hidden'),
    ).to.equal(true)
  })

  it('hide after the animation plays the exit animation and finishes', async () => {
    const { tooltip } = await makeTooltip()
    tooltip.show()
    // pretend the entry animation already completed
    tooltip._animationPlaying = false
    const restoreDuration = setDocTimeProperty(
      '--simple-tooltip-duration-out',
      '0ms',
    )
    const restoreDelay = setDocTimeProperty('--simple-tooltip-delay-out', '0ms')
    try {
      tooltip.hide()
      const tip = tooltip.shadowRoot.querySelector('#tooltip')
      // the exit animation class was applied by _onAnimationFinish
      expect(tip.classList.contains('fade-out-animation')).to.equal(true)
      expect(tip.classList.contains('fade-in-animation')).to.equal(false)
      expect(tooltip._showing).to.equal(false)
      // zero total timing forces the final hidden state on the next frame
      await new Promise((resolve) =>
        requestAnimationFrame(() => setTimeout(resolve, 0)),
      )
      expect(tip.classList.contains('hidden')).to.equal(true)
    } finally {
      restoreDuration()
      restoreDelay()
    }
  })

  it('hide is a no-op when not showing', async () => {
    const { tooltip } = await makeTooltip()
    tooltip.hide()
    expect(tooltip._showing).to.not.equal(true)
    expect(
      tooltip.shadowRoot.querySelector('#tooltip').classList.contains('hidden'),
    ).to.equal(true)
  })

  it('playAnimation drives the deprecated entry/exit api', async () => {
    const { tooltip } = await makeTooltip()
    tooltip.playAnimation('entry')
    expect(tooltip._showing).to.equal(true)
    tooltip._animationPlaying = false
    const restoreDuration = setDocTimeProperty(
      '--simple-tooltip-duration-out',
      '0ms',
    )
    const restoreDelay = setDocTimeProperty('--simple-tooltip-delay-out', '0ms')
    try {
      tooltip.playAnimation('exit')
      expect(tooltip._showing).to.equal(false)
      // unknown types do nothing
      tooltip.playAnimation('sideways')
      expect(tooltip._showing).to.equal(false)
    } finally {
      restoreDuration()
      restoreDelay()
    }
  })

  it('cancelAnimation applies the cancel class', async () => {
    const { tooltip } = await makeTooltip()
    tooltip.show()
    tooltip.cancelAnimation()
    expect(
      tooltip.shadowRoot
        .querySelector('#tooltip')
        .classList.contains('cancel-animation'),
    ).to.equal(true)
  })

  it('finishes hiding when animationend fires on the tip', async () => {
    const { tooltip } = await makeTooltip()
    tooltip.show()
    tooltip._showing = false
    tooltip.shadowRoot
      .querySelector('#tooltip')
      .dispatchEvent(new Event('animationend'))
    expect(
      tooltip.shadowRoot.querySelector('#tooltip').classList.contains('hidden'),
    ).to.equal(true)
  })

  it('updatePosition is a no-op without a target or offset parent', () => {
    const tooltip = document.createElement('simple-tooltip')
    expect(() => tooltip.updatePosition()).to.not.throw()
  })

  it('updatePosition places the tip for each position', async () => {
    const { tooltip, anchor } = await makeTooltip()
    tooltip.show()
    for (const position of ['top', 'bottom', 'left', 'right']) {
      tooltip.position = position
      await tooltip.updateComplete
      tooltip.updatePosition()
      expect(parseFloat(tooltip.style.left)).to.be.a('number')
      expect(Number.isNaN(parseFloat(tooltip.style.left))).to.equal(false)
      expect(Number.isNaN(parseFloat(tooltip.style.top))).to.equal(false)
    }
    // verify one placement numerically: bottom puts the tip below the anchor
    tooltip.position = 'bottom'
    await tooltip.updateComplete
    tooltip.updatePosition()
    const anchorRect = anchor.getBoundingClientRect()
    const parentRect = tooltip.offsetParent.getBoundingClientRect()
    const thisRect = tooltip.getBoundingClientRect()
    const expectedTop =
      anchorRect.top -
      parentRect.top +
      anchorRect.height +
      tooltip.offset
    expect(parseFloat(tooltip.style.top)).to.be.closeTo(expectedTop, 2)
    const expectedLeft =
      anchorRect.left -
      parentRect.left +
      (anchorRect.width - thisRect.width) / 2
    expect(parseFloat(tooltip.style.left)).to.be.closeTo(expectedLeft, 2)
  })

  it('updatePosition honors the deprecated marginTop offset', async () => {
    const { tooltip, anchor } = await makeTooltip()
    tooltip.show()
    tooltip.marginTop = 33
    await tooltip.updateComplete
    tooltip.updatePosition()
    const anchorRect = anchor.getBoundingClientRect()
    const parentRect = tooltip.offsetParent.getBoundingClientRect()
    expect(parseFloat(tooltip.style.top)).to.be.closeTo(
      anchorRect.top - parentRect.top + anchorRect.height + 33,
      2,
    )
  })

  it('updatePosition clips overflowing tips when fitToVisibleBounds is set', async () => {
    const { tooltip } = await makeTooltip()
    tooltip.fitToVisibleBounds = true
    await tooltip.updateComplete
    tooltip.show()
    // absurdly wide tip overflows the right viewport edge
    tooltip.style.width = '5000px'
    tooltip.updatePosition()
    expect(tooltip.style.right).to.equal('0px')
    expect(tooltip.style.left).to.equal('auto')
    // absurdly tall tip overflows the bottom edge
    tooltip.style.width = ''
    tooltip.style.height = '5000px'
    tooltip.updatePosition()
    expect(tooltip.style.bottom).to.not.equal('auto')
    expect(tooltip.style.top).to.equal('auto')
    // a normal tip stays positioned by left/top
    tooltip.style.height = ''
    tooltip.updatePosition()
    expect(tooltip.style.left).to.match(/^[0-9.]+px$/)
    expect(tooltip.style.top).to.match(/^[0-9.]+px$/)
    expect(tooltip.style.right).to.equal('auto')
    expect(tooltip.style.bottom).to.equal('auto')
  })

  it('adds and removes target listeners when manualMode toggles', async () => {
    const { tooltip, anchor } = await makeTooltip()
    tooltip.manualMode = true
    await tooltip.updateComplete
    // in manual mode hover events on the target do nothing
    anchor.dispatchEvent(new Event('mouseenter'))
    expect(tooltip._showing).to.not.equal(true)
    tooltip.manualMode = false
    await tooltip.updateComplete
    // back in automatic mode hovering the target shows the tip
    anchor.dispatchEvent(new Event('mouseenter'))
    expect(tooltip._showing).to.equal(true)
  })

  it('removes target listeners when disconnected', async () => {
    const { container, tooltip, anchor } = await makeTooltip()
    container.remove()
    anchor.dispatchEvent(new Event('mouseenter'))
    expect(tooltip._showing).to.not.equal(true)
  })

  it('animationDelay writes the delay css variable', async () => {
    const { tooltip } = await makeTooltip()
    const restore = setDocTimeProperty('--simple-tooltip-delay-in', '0ms')
    try {
      tooltip.animationDelay = 123
      await tooltip.updateComplete
      expect(
        document.documentElement.style.getPropertyValue(
          '--simple-tooltip-delay-in',
        ),
      ).to.equal('123ms')
    } finally {
      restore()
    }
  })

  it('prefers explicit animations then legacy animationConfig', async () => {
    const { tooltip } = await makeTooltip()
    // legacy defaults from the constructor
    expect(tooltip._getAnimationType('entry')).to.equal('fade-in-animation')
    expect(tooltip._getAnimationType('exit')).to.equal('fade-out-animation')
    // explicit properties win
    tooltip.animationEntry = 'my-entry-anim'
    tooltip.animationExit = 'my-exit-anim'
    expect(tooltip._getAnimationType('entry')).to.equal('my-entry-anim')
    expect(tooltip._getAnimationType('exit')).to.equal('my-exit-anim')
    // legacy config with a timing delay writes the css variables
    tooltip.animationEntry = ''
    tooltip.animationExit = ''
    tooltip.animationConfig = {
      entry: [{ name: 'legacy-entry', timing: { delay: 77 } }],
      exit: [{ name: 'legacy-exit', timing: { delay: 88 } }],
    }
    const restoreIn = setDocTimeProperty('--simple-tooltip-delay-in', '0ms')
    const restoreOut = setDocTimeProperty('--simple-tooltip-delay-out', '0ms')
    try {
      expect(tooltip._getAnimationType('entry')).to.equal('legacy-entry')
      expect(
        document.documentElement.style.getPropertyValue(
          '--simple-tooltip-delay-in',
        ),
      ).to.equal('77ms')
      expect(tooltip._getAnimationType('exit')).to.equal('legacy-exit')
      expect(
        document.documentElement.style.getPropertyValue(
          '--simple-tooltip-delay-out',
        ),
      ).to.equal('88ms')
    } finally {
      restoreIn()
      restoreOut()
    }
  })

  it('_timeToMs converts css time values', () => {
    const tooltip = document.createElement('simple-tooltip')
    expect(tooltip._timeToMs(500)).to.equal(0)
    expect(tooltip._timeToMs('500ms')).to.equal(500)
    expect(tooltip._timeToMs('1.5s')).to.equal(1500)
    expect(tooltip._timeToMs('0.25s')).to.equal(250)
    expect(tooltip._timeToMs('junk')).to.equal(0)
    expect(tooltip._timeToMs('junkms')).to.equal(0)
    expect(tooltip._timeToMs('junks')).to.equal(0)
  })

  it('_getExitAnimationTiming returns zero timing before render', () => {
    const tooltip = document.createElement('simple-tooltip')
    expect(tooltip._getExitAnimationTiming()).to.deep.equal({
      delay: 0,
      duration: 0,
    })
  })
})
