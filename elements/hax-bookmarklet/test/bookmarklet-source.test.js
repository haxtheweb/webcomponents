import { expect } from '@open-wc/testing'

// BOOKMARKLET-SOURCE.js is a plain script (not a LitElement module). At
// module scope it injects a <script src="https://cdn.waxam.io/..."> and a
// <style> into document.body and attaches click/hover listeners. To keep
// this suite off the network, document.createElement and
// document.body.appendChild are patched while the module is imported so the
// CDN script and style are created and recorded but never attached.

describe('BOOKMARKLET-SOURCE', () => {
  let created
  let appended
  let originalCreateElement
  let originalBodyAppendChild
  let originalHaxStore
  let originalAppliedHax

  before(async () => {
    originalCreateElement = globalThis.document.createElement
    originalBodyAppendChild = globalThis.document.body.appendChild
    originalHaxStore = globalThis.HaxStore
    originalAppliedHax = globalThis.__appliedHax
    created = []
    appended = []
    // record created elements, still returning real (detached) nodes
    globalThis.document.createElement = function (tag, opts) {
      const node = originalCreateElement.call(globalThis.document, tag, opts)
      created.push(node)
      return node
    }
    // swallow body appends so the CDN script/style never load
    globalThis.document.body.appendChild = function (node) {
      appended.push(node)
      return node
    }
    await import('../BOOKMARKLET-SOURCE.js')
    globalThis.document.createElement = originalCreateElement
    globalThis.document.body.appendChild = originalBodyAppendChild
  })

  after(() => {
    globalThis.document.createElement = originalCreateElement
    globalThis.document.body.appendChild = originalBodyAppendChild
    globalThis.HaxStore = originalHaxStore
    // permanently neutralize the injected body listeners
    globalThis.__appliedHax = true
    const wrapper = globalThis.document.querySelector('body > h-a-x')
    if (wrapper) {
      wrapper.remove()
    }
  })

  it('injects the hax CDN module script and highlighter style', () => {
    const scripts = created.filter((n) => n.tagName === 'SCRIPT')
    expect(scripts.length).to.equal(1)
    expect(scripts[0].getAttribute('type')).to.equal('module')
    expect(scripts[0].getAttribute('src')).to.equal(
      'https://cdn.waxam.io/build/es6/node_modules/@haxtheweb/h-a-x/h-a-x.js',
    )
    const styles = created.filter((n) => n.tagName === 'STYLE')
    expect(styles.length).to.equal(1)
    const css = styles[0].innerHTML
    expect(css.indexOf('.hax-injected-highlighter') !== -1).to.equal(true)
    expect(css.indexOf('h-a-x') !== -1).to.equal(true)
    expect(appended.length).to.equal(2)
    expect(appended[0].tagName).to.equal('SCRIPT')
    expect(appended[1].tagName).to.equal('STYLE')
    // flag starts off so the first click applies hax
    expect(globalThis.__appliedHax).to.equal(false)
  })

  it('highlights targets on mouseover and clears on mouseout', () => {
    const target = globalThis.document.createElement('div')
    target.setAttribute('id', 'bm-hover-target')
    globalThis.document.body.appendChild(target)
    try {
      globalThis.__appliedHax = false
      target.dispatchEvent(
        new MouseEvent('mouseover', { bubbles: true }),
      )
      expect(
        target.classList.contains('hax-injected-highlighter'),
      ).to.equal(true)
      target.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }))
      expect(
        target.classList.contains('hax-injected-highlighter'),
      ).to.equal(false)
      // after hax is applied the hover handlers go quiet
      globalThis.__appliedHax = true
      target.dispatchEvent(
        new MouseEvent('mouseover', { bubbles: true }),
      )
      expect(
        target.classList.contains('hax-injected-highlighter'),
      ).to.equal(false)
    } finally {
      globalThis.__appliedHax = true
      target.remove()
    }
  })

  it('wraps the first clicked element in h-a-x exactly once', () => {
    const target = globalThis.document.createElement('p')
    target.setAttribute('id', 'bm-click-target')
    target.textContent = 'click me'
    globalThis.document.body.appendChild(target)
    try {
      globalThis.__appliedHax = false
      target.click()
      const wrapper = globalThis.document.querySelector('body > h-a-x')
      expect(wrapper).to.exist
      expect(wrapper.querySelector('#bm-click-target')).to.exist
      expect(globalThis.__appliedHax).to.equal(true)
      // a second click must not wrap again
      const inner = wrapper.querySelector('#bm-click-target')
      inner.click()
      const wrappers = globalThis.document.querySelectorAll('body > h-a-x')
      expect(wrappers.length).to.equal(1)
    } finally {
      globalThis.__appliedHax = true
      const wrapper = globalThis.document.querySelector('body > h-a-x')
      if (wrapper) {
        wrapper.remove()
      }
    }
  })

  it('seeds the HaxStore appStore on hax-store-ready', () => {
    globalThis.HaxStore = { instance: {} }
    globalThis.dispatchEvent(new Event('hax-store-ready'))
    const appStore = globalThis.HaxStore.instance.appStore
    expect(appStore).to.exist
    expect(appStore.status).to.equal(200)

    // ten app connection definitions
    expect(appStore.apps.length).to.equal(10)
    expect(appStore.apps[0].details.title).to.equal('Youtube')
    expect(appStore.apps[0].connection.url).to.equal(
      'www.googleapis.com/youtube/v3',
    )
    expect(appStore.apps[1].details.title).to.equal('Vimeo')
    expect(appStore.apps[2].details.title).to.equal('Flickr')
    expect(appStore.apps[3].details.title).to.equal('NASA')
    expect(appStore.apps[4].details.title).to.equal('Giphy')
    expect(appStore.apps[5].details.title).to.equal('Google Poly')
    expect(appStore.apps[6].details.title).to.equal('Sketchfab')
    expect(appStore.apps[7].details.title).to.equal('Meme generator')
    expect(appStore.apps[8].details.title).to.equal('Unsplash')
    expect(appStore.apps[9].details.title).to.equal('Wikipedia')

    // three starter stax (lesson, about, assignment)
    expect(appStore.stax.length).to.equal(3)
    expect(appStore.stax[0].details.title).to.equal('Example Lesson')
    expect(appStore.stax[0].stax.length).to.equal(11)
    expect(appStore.stax[0].stax[2].tag).to.equal('video-player')
    expect(appStore.stax[1].details.title).to.equal('About the course')
    expect(appStore.stax[2].details.title).to.equal('Example Assignment')

    // five layout blox
    expect(appStore.blox.length).to.equal(5)
    expect(appStore.blox[0].details.layout).to.equal('1-1')
    expect(appStore.blox[1].details.layout).to.equal('8/4')
    expect(appStore.blox[2].details.layout).to.equal('4/4/4')
    expect(appStore.blox[3].details.layout).to.equal('4/8')
    expect(appStore.blox[4].details.layout).to.equal('3/3/3/3')
    expect(appStore.blox[0].blox[0].properties.slot).to.equal('col-1')

    // autoloader tag list
    expect(appStore.autoloader.length).to.equal(29)
    for (const tag of [
      'lrn-aside',
      'grid-plate',
      'video-player',
      'oer-schema',
      'code-editor',
      'place-holder',
      'q-r',
      'wave-player',
    ]) {
      expect(appStore.autoloader.includes(tag)).to.equal(
        true,
        `expected autoloader to include ${tag}`,
      )
    }
  })
})
