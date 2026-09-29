import { expect } from '@open-wc/testing'

// simple-icon-picker renders option icons through simple-icon-lite, so
// the icon rendering behaviors are covered from this package
import '@haxtheweb/simple-icon/lib/simple-icon-lite.js'
import '@haxtheweb/simple-icon/lib/simple-icons.js'

describe('simple-icon-lite rendering (simple-icon-picker dependency)', () => {
  it('renders the svg branch, resolves the src and reacts to icon changes', async () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    const icon = document.createElement('simple-icon-lite')
    // headless chromium advertises Safari in its UA, which routes the
    // element to its polyfill branch; pin the getter off for this
    // element so the svg rendering path is exercised
    Object.defineProperty(icon, 'useSafariPolyfill', {
      value: false,
      configurable: true,
    })
    icon.setAttribute('icon', 'icons:add')
    host.appendChild(icon)
    await new Promise((resolve) => setTimeout(resolve, 50))
    try {
      const svg = icon.shadowRoot.querySelector('svg')
      expect(svg).to.exist
      const filter = icon.shadowRoot.querySelector('filter')
      expect(filter.getAttribute('id')).to.match(/^f-/)
      const image = icon.shadowRoot.querySelector('image')
      expect(image.getAttribute('xlink:href')).to.include('add')
      // cssom normalizes url() with quotes, so compare by the filter id
      expect(image.style.filter).to.contain(filter.getAttribute('id'))

      // changing the icon re-resolves the src through the iconset store
      icon.icon = 'icons:remove'
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(icon.src).to.include('remove')
      expect(
        icon.shadowRoot.querySelector('image').getAttribute('xlink:href'),
      ).to.include('remove')

      // clearing the icon clears the resolved src
      icon.icon = ''
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(icon.src).to.equal(null)
    } finally {
      host.remove()
    }
  })
})
