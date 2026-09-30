import { fixture, expect, html, oneEvent } from '@open-wc/testing'

import '../lib/hax-tray-button.js'
import { HaxButton } from '../lib/hax-tray-button.js'

describe('hax-tray-button', () => {
  let el
  beforeEach(async () => {
    el = await fixture(
      html`<hax-tray-button event-name="test-event"></hax-tray-button>`,
    )
    await el.updateComplete
  })

  it('instantiates with default props', () => {
    expect(el.tagName.toLowerCase()).to.equal('hax-tray-button')
    expect(el.eventName).to.equal('test-event')
    expect(el.eventData).to.be.null
  })

  it('has static tag', () => {
    expect(HaxButton.tag).to.equal('hax-tray-button')
  })

  describe('_handleClick', () => {
    it('dispatches hax-tray-button-click with eventName and index', async () => {
      el.eventName = 'my-event'
      el.index = 5
      el.eventData = 'my-data'
      const listener = oneEvent(el, 'hax-tray-button-click')
      el._handleClick({})
      const e = await listener
      expect(e.detail.eventName).to.equal('my-event')
      expect(e.detail.index).to.equal(5)
      expect(e.detail.value).to.equal('my-data')
    })
  })

  describe('_voiceEvent', () => {
    it('calls _handleClick and then click', () => {
      let handleClickCalled = false
      let clickCalled = false
      el._handleClick = () => {
        handleClickCalled = true
      }
      el.click = () => {
        clickCalled = true
      }
      el._voiceEvent({})
      expect(handleClickCalled).to.equal(true)
      expect(clickCalled).to.equal(true)
    })
  })

  describe('updated with voiceCommand', () => {
    it('dispatches super-daemon-voice-command when voiceCommand changes', async () => {
      const listener = oneEvent(el, 'super-daemon-voice-command')
      el.voiceCommand = 'insert test'
      await el.updateComplete
      const e = await listener
      expect(e.detail.command).to.equal('insert test')
      expect(e.detail.context).to.equal(el)
      expect(e.detail.callback).to.equal('_voiceEvent')
    })
  })
})
