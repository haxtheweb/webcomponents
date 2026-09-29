import { fixture, expect, html } from '@open-wc/testing'
import '../lib/open-apis/link-preview-card.js'
// pre-warm the dynamic import that fetchData awaits so the stubbed calls
// resolve quickly inside the tests
import '@haxtheweb/micro-frontend-registry/lib/microServices.js'
import { sleep } from './helpers.js'

const registry = () =>
  globalThis.MicroFrontendRegistry.requestAvailability()

const stubRegistry = (callResult) => {
  const reg = registry()
  const previousCall = reg.call
  const previousEnable = reg.enableServices
  reg.call = async () => callResult
  reg.enableServices = () => {}
  return () => {
    delete reg.call
    delete reg.enableServices
    reg.call = previousCall
    reg.enableServices = previousEnable
  }
}

describe('link-preview-card', () => {
  it('renders a card with title, link and description', async () => {
    const el = await fixture(
      html`<link-preview-card
        title="Sample"
        description="A sample page"
        link="https://psu.edu"
        image="https://psu.edu/img.png"
        theme-color="red"
      ></link-preview-card>`,
    )
    expect(el.getAttribute('theme-color')).to.equal('red')
    const card = el.shadowRoot.querySelector('.card')
    expect(card === null).to.equal(false)
    const img = el.shadowRoot.querySelector('img')
    expect(img === null).to.equal(false)
    expect(img.getAttribute('src')).to.equal('https://psu.edu/img.png')
    expect(img.getAttribute('loading')).to.equal('lazy')
    const title = el.shadowRoot.querySelector('.title')
    expect(title.textContent.trim()).to.equal('Sample')
    const link = el.shadowRoot.querySelector('a')
    expect(link.getAttribute('href')).to.equal('https://psu.edu')
    expect(link.getAttribute('rel')).to.equal('noopener noreferrer')
    expect(el.shadowRoot.querySelector('p').textContent.trim()).to.equal(
      'A sample page',
    )
    expect(el.shadowRoot.querySelector('.loader') === null).to.equal(true)
  })

  it('renders a loader while loading and falls back to no preview', async () => {
    const el = await fixture(
      html`<link-preview-card loading-state></link-preview-card>`,
    )
    expect(el.shadowRoot.querySelector('.loader') === null).to.equal(false)
    expect(el.shadowRoot.querySelector('img') === null).to.equal(true)
    expect(
      el.shadowRoot.querySelector('.title').textContent.trim(),
    ).to.equal('No preview available')
  })

  it('fetchData maps metadata onto the card', async () => {
    const restore = stubRegistry({
      status: 200,
      data: {
        'og:title': 'Open Graph Title',
        'og:description': 'A great page',
        'og:image': 'img/cover.png',
        'og:url': 'https://psu.edu',
        'theme-color': ' #3f51b5 ',
      },
    })
    const el = await fixture(html`<link-preview-card></link-preview-card>`)
    el.href = 'https://psu.edu'
    await sleep(100)
    expect(el.title).to.equal('Open Graph Title')
    expect(el.description).to.equal('A great page')
    expect(el.image).to.equal('https://psu.eduimg/cover.png')
    expect(el.link).to.equal('https://psu.edu')
    expect(el.themeColor).to.equal('#3f51b5')
    expect(el.loadingState).to.equal(false)
    restore()
  })

  it('fetchData falls back to title/description/image keys', async () => {
    const restore = stubRegistry({
      status: 200,
      data: {
        title: 'Plain Title',
        description: 'Plain description',
        image: 'https://psu.edu/img.png',
        url: 'https://psu.edu/page',
        'theme-color': 'red',
      },
    })
    const el = await fixture(html`<link-preview-card></link-preview-card>`)
    el.href = 'https://psu.edu/page'
    await sleep(50)
    expect(el.title).to.equal('Plain Title')
    expect(el.description).to.equal('Plain description')
    expect(el.image).to.equal('https://psu.edu/img.png')
    expect(el.link).to.equal('https://psu.edu/page')
    restore()
  })

  it('fetchData truncates long descriptions at 250 characters', async () => {
    const long = 'x'.repeat(300)
    const restore = stubRegistry({
      status: 200,
      data: {
        'og:title': 'T',
        'og:description': long,
        'og:url': 'https://psu.edu',
        'theme-color': 'red',
      },
    })
    const el = await fixture(html`<link-preview-card></link-preview-card>`)
    el.href = 'https://psu.edu'
    await sleep(50)
    expect(el.description.length).to.equal(253)
    expect(el.description.endsWith('...')).to.equal(true)
    restore()
  })

  it('fetchData defaults when the metadata is empty', async () => {
    const restore = stubRegistry({ status: 200, data: {} })
    const el = await fixture(html`<link-preview-card></link-preview-card>`)
    el.href = 'https://psu.edu'
    await sleep(50)
    // fixed (issue #3077, bug 33): the success path no longer reads an
    // undefined link identifier, so defaults flow from the success path
    // instead of the catch resetting the card to no-preview state
    expect(el.title).to.equal('No title available')
    expect(el.description).to.equal('No description available')
    expect(el.link).to.equal('https://psu.edu')
    expect(el.themeColor).to.equal('var(--ddd-primary-2)')
    restore()
  })

  it('fetchData catch resets the card on the rejected call path', async () => {
    const reg = registry()
    const previousCall = reg.call
    reg.call = async () => {
      throw new Error('network down')
    }
    const el = await fixture(html`<link-preview-card></link-preview-card>`)
    el.href = 'https://psu.edu'
    await sleep(50)
    expect(el.title).to.equal('No preview available')
    expect(el.description).to.equal('')
    // fixed (issue #3077, bug 33): the catch no longer crashes on an
    // undefined link identifier, so the full cleanup runs and the link
    // falls back to the requested url
    expect(el.link).to.equal('https://psu.edu')
    expect(el.image).to.equal('')
    expect(el.themeColor).to.equal('var(--ddd-primary-2)')
    expect(el.loadingState).to.equal(false)
    delete reg.call
    reg.call = previousCall
  })

  it('isValidURL checks URL validity', async () => {
    const el = await fixture(html`<link-preview-card></link-preview-card>`)
    expect(el.isValidURL('https://psu.edu')).to.equal(true)
    expect(el.isValidURL('not a url')).to.equal(false)
  })

  it('truncateText trims to the max length with ellipsis', async () => {
    const el = await fixture(html`<link-preview-card></link-preview-card>`)
    expect(el.truncateText('short', 250)).to.equal('short')
    expect(el.truncateText('x'.repeat(251), 250)).to.equal('x'.repeat(250) + '...')
  })

  it('getThemeColor prefers psu.edu and otherwise picks a ddd token', async () => {
    const el = await fixture(html`<link-preview-card></link-preview-card>`)
    expect(el.getThemeColor('https://www.psu.edu/whatever')).to.equal(
      'var(--ddd-primary-2)',
    )
    const token = el.getThemeColor('https://example.com/page')
    expect(/^var\(--ddd-primary-\d+\)$/.test(token)).to.equal(true)
    // invalid urls also fall back to a random ddd token
    expect(/^var\(--ddd-primary-\d+\)$/.test(el.getThemeColor('nope'))).to.equal(
      true,
    )
  })

  it('updated ignores empty href', async () => {
    const restore = stubRegistry({ status: 200, data: {} })
    const el = await fixture(html`<link-preview-card></link-preview-card>`)
    el.href = ''
    await sleep(50)
    expect(el.title).to.equal('')
    expect(el.loadingState).to.equal(false)
    restore()
  })
})
