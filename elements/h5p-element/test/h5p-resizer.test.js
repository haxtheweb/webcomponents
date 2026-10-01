import { expect } from '@open-wc/testing'
import '../lib/h5p-resizer.js'

// the resizer speaks a postMessage protocol with iframes; a local about:blank
// frame is used as the message source so no external request ever happens
describe('h5p-resizer', () => {
  let iframe

  beforeEach(() => {
    iframe = globalThis.document.createElement('iframe')
    globalThis.document.body.appendChild(iframe)
  })

  afterEach(() => {
    iframe.remove()
  })

  const dispatch = (data, source) => {
    globalThis.dispatchEvent(
      new MessageEvent('message', {
        data,
        source,
        origin: globalThis.location.origin,
      }),
    )
  }

  it('ignores non-object message data', () => {
    dispatch('not-an-object')
    dispatch(null)
  })

  it('ignores messages from unknown frames', () => {
    dispatch({ context: 'h5p', action: 'hello' })
  })

  it('answers hello from a known frame', () => {
    dispatch({ context: 'h5p', action: 'hello' }, iframe.contentWindow)
    expect(iframe.style.width).to.equal('100%')
  })

  it('relays window resizes to frames that said hello', () => {
    dispatch({ context: 'h5p', action: 'hello' }, iframe.contentWindow)
    globalThis.dispatchEvent(new Event('resize'))
  })

  it('prepares a resize when heights differ', () => {
    dispatch(
      {
        context: 'h5p',
        action: 'prepareResize',
        scrollHeight: 500,
        clientHeight: 300,
      },
      iframe.contentWindow,
    )
    expect(iframe.style.height).to.equal('300px')
  })

  it('skips preparing a resize when heights match', () => {
    const height = iframe.clientHeight
    dispatch(
      {
        context: 'h5p',
        action: 'prepareResize',
        scrollHeight: height,
        clientHeight: height,
      },
      iframe.contentWindow,
    )
    expect(iframe.style.height).to.equal('')
  })

  it('resizes to the scroll height', () => {
    dispatch({ context: 'h5p', action: 'resize', scrollHeight: 444 }, iframe.contentWindow)
    expect(iframe.style.height).to.equal('444px')
  })

  it('ignores unknown h5p actions', () => {
    dispatch({ context: 'h5p', action: 'bogus' }, iframe.contentWindow)
  })

  it('handles legacy entity iframe resize messages', () => {
    // the resize action applies the legacy height directly; its respond
    // callback mirrors the payload height so it stays defined if invoked
    dispatch({ subject: 'entityIframe.resize', height: 321 }, iframe.contentWindow)
    expect(iframe.style.height).to.equal('321px')
  })
})
