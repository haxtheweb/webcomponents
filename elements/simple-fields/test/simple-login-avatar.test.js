import { fixture, expect, html, aTimeout } from '@open-wc/testing'

import '../lib/simple-login-avatar.js'
import '../lib/simple-camera-snap.js'

describe('simple-login-avatar', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-login-avatar></simple-login-avatar>`)
  })

  it('instantiates and has shadowRoot', () => {
    expect(el).to.exist
    expect(el.shadowRoot).to.exist
  })

  it('renders an avatar div with svg', () => {
    const avatar = el.shadowRoot.querySelector('.avatar')
    expect(avatar).to.exist
    const svg = el.shadowRoot.querySelector('svg')
    expect(svg).to.exist
  })

  it('has a slot in the avatar', () => {
    const slot = el.shadowRoot.querySelector('slot')
    expect(slot).to.exist
  })

  it('html getter returns template string with style', () => {
    const htmlStr = el.html
    expect(typeof htmlStr).to.equal('string')
    expect(htmlStr).to.contain(':host')
    expect(htmlStr).to.contain('.avatar')
    expect(htmlStr).to.contain('<svg')
  })

  it('render method populates shadowRoot', () => {
    el.shadowRoot.innerHTML = ''
    el.render()
    const avatar = el.shadowRoot.querySelector('.avatar')
    expect(avatar).to.exist
  })

  it('_copyAttribute copies attribute to recipients', () => {
    el.setAttribute('data-test', 'value123')
    // add a recipient element
    const recipient = document.createElement('div')
    recipient.setAttribute('data-test', '')
    el.shadowRoot.appendChild(recipient)
    el._copyAttribute('data-test', 'div')
    expect(recipient.getAttribute('data-test')).to.equal('value123')
  })

  it('_copyAttribute removes attribute when source is null', () => {
    const recipient = document.createElement('div')
    recipient.setAttribute('data-test', 'oldvalue')
    el.shadowRoot.appendChild(recipient)
    el.removeAttribute('data-test')
    el._copyAttribute('data-test', 'div')
    expect(recipient.hasAttribute('data-test')).to.equal(false)
  })

  it('tag is simple-login-avatar', () => {
    const cls = globalThis.customElements.get('simple-login-avatar')
    expect(cls.tag).to.equal('simple-login-avatar')
  })

  it('is registered as custom element', () => {
    expect(globalThis.customElements.get('simple-login-avatar')).to.exist
  })

  it('connectedCallback handles ShadyCSS gracefully', () => {
    // should not throw even if ShadyCSS is not present
    expect(() => {
      document.body.appendChild(el)
      document.body.removeChild(el)
    }).to.not.throw()
  })
})

describe('simple-camera-snap', () => {
  let el
  beforeEach(async () => {
    el = await fixture(html`<simple-camera-snap></simple-camera-snap>`)
  })

  it('instantiates and has shadowRoot', () => {
    expect(el).to.exist
    expect(el.shadowRoot).to.exist
  })

  it('renders a snap button', () => {
    const snap = el.shadowRoot.querySelector('#snap')
    expect(snap).to.exist
  })

  it('renders a camera element', () => {
    const camera = el.shadowRoot.querySelector('#camera')
    expect(camera).to.exist
  })

  it('renders a selfie div', () => {
    const selfie = el.shadowRoot.querySelector('#selfie')
    expect(selfie).to.exist
  })

  it('tag is simple-camera-snap', () => {
    const cls = globalThis.customElements.get('simple-camera-snap')
    expect(cls.tag).to.equal('simple-camera-snap')
  })

  it('is registered as custom element', () => {
    expect(globalThis.customElements.get('simple-camera-snap')).to.exist
  })

  it('has t object with takePhoto', () => {
    expect(el.t).to.exist
    expect(el.t.takePhoto).to.exist
  })

  it('html getter returns template string', () => {
    const htmlStr = el.html
    expect(typeof htmlStr).to.equal('string')
    expect(htmlStr).to.contain('#snap')
    expect(htmlStr).to.contain('#selfie')
  })

  it('render method populates shadowRoot', () => {
    el.shadowRoot.innerHTML = ''
    el.render()
    const snap = el.shadowRoot.querySelector('#snap')
    expect(snap).to.exist
  })

  it('clearPhoto resets selfie content', () => {
    const selfie = el.shadowRoot.querySelector('#selfie')
    selfie.innerHTML = '<img src="test.jpg">'
    selfie.classList.add('has-snap')
    el.clearPhoto({})
    expect(selfie.innerHTML).to.equal('')
    expect(selfie.classList.contains('has-snap')).to.equal(false)
    const camera = el.shadowRoot.querySelector('#camera')
    expect(camera.hasAttribute('autoplay')).to.equal(true)
  })
})
