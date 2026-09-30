// store-driven content, click guards, and sub-element wiring tests for
// training-theme (complements training-theme.test.js)
globalThis.process = globalThis.process || {
  env: {
    NODE_ENV: 'development',
  },
}
import { fixture, expect, html } from '@open-wc/testing'
import { store } from '@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js'
import { TrainingTheme } from '../training-theme.js'
import '../lib/training-button.js'
import { TrainingButton } from '../lib/training-button.js'
import '../lib/training-top.js'
import { TrainingTop } from '../lib/training-top.js'

// poll until fn() is truthy or the timeout elapses; resolves to a boolean so
// assertions never receive a DOM node
async function waitFor(fn, timeout = 6000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (fn()) {
      return true
    }
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  return !!fn()
}

describe('training-button', () => {
  it('registers with the expected tag name', () => {
    expect(TrainingButton.tag).to.equal('training-button')
  })

  it('renders title, index dot, and slug link', async () => {
    const btn = await fixture(
      html`<training-button
        title="Intro"
        slug="intro"
        index="3"
      ></training-button>`,
    )
    await btn.updateComplete
    const anchor = btn.shadowRoot.querySelector('a.wrapper')
    expect(anchor.getAttribute('href')).to.equal('intro')
    expect(btn.shadowRoot.querySelector('#title').textContent).to.equal('Intro')
    expect(btn.shadowRoot.querySelector('.dot div').textContent).to.equal('3')
    await expect(btn).shadowDom.to.be.accessible()
  })

  it('prevents navigation when disabled', async () => {
    const btn = await fixture(
      html`<training-button
        title="Locked"
        slug="locked"
        index="2"
        disabled
      ></training-button>`,
    )
    await btn.updateComplete
    const evt = new Event('click', { cancelable: true })
    btn.shadowRoot.querySelector('a.wrapper').dispatchEvent(evt)
    expect(evt.defaultPrevented).to.be.true
  })

  it('prevents navigation in edit mode', async () => {
    const btn = await fixture(
      html`<training-button
        title="Editing"
        slug="editing"
        index="1"
      ></training-button>`,
    )
    await btn.updateComplete
    btn.editMode = true
    await btn.updateComplete
    const anchor = btn.shadowRoot.querySelector('a.wrapper')
    const evt = new Event('click', { cancelable: true })
    anchor.dispatchEvent(evt)
    expect(evt.defaultPrevented).to.be.true
    expect(anchor.getAttribute('part')).to.equal('edit-mode-active')
  })

  it('allows navigation when enabled', async () => {
    const btn = await fixture(
      html`<training-button
        title="Open"
        slug="open"
        index="1"
      ></training-button>`,
    )
    await btn.updateComplete
    const evt = new Event('click', { cancelable: true })
    btn.shadowRoot.querySelector('a.wrapper').dispatchEvent(evt)
    expect(evt.defaultPrevented).to.be.false
  })

  it('reflects active and disabled attributes', async () => {
    const btn = await fixture(
      html`<training-button title="A" slug="a" index="1"></training-button>`,
    )
    await btn.updateComplete
    expect(btn.hasAttribute('active')).to.be.false
    btn.active = true
    btn.disabled = true
    await btn.updateComplete
    expect(btn.hasAttribute('active')).to.be.true
    expect(btn.hasAttribute('disabled')).to.be.true
  })
})

describe('training-top', () => {
  it('registers with the expected tag name', () => {
    expect(TrainingTop.tag).to.equal('training-top')
  })

  it('renders the site title and timer region', async () => {
    const top = await fixture(html`<training-top time="5 min"></training-top>`)
    await top.updateComplete
    expect(top.shadowRoot.querySelector('site-title')).to.exist
    const timer = top.shadowRoot.querySelector('.time-remaining')
    expect(timer.getAttribute('role')).to.equal('timer')
    expect(timer.getAttribute('tabindex')).to.equal('0')
    expect(timer.textContent.trim()).to.equal('5 min')
  })

  it('labels the timer with an estimate when no time is set', async () => {
    const top = await fixture(html`<training-top></training-top>`)
    await top.updateComplete
    expect(
      top.shadowRoot.querySelector('.time-remaining').getAttribute('aria-label'),
    ).to.equal('Estimated time remaining: 40 minutes')
  })
})

describe('training-theme store wiring', () => {
  it('mirrors items, activeId, and maxIndex from the store', async () => {
    const originalManifest = store.manifest
    const originalActiveId = store.activeId
    try {
      store.manifest = {
        title: 'Training coverage',
        items: [
          { id: 'item-1', title: 'One', slug: 'one' },
          { id: 'item-2', title: 'Two', slug: 'two' },
          { id: 'item-3', title: 'Three', slug: 'three' },
        ],
      }
      store.activeId = 'item-2'
      const el = await fixture(html`<training-theme></training-theme>`)
      // constructor autoruns mirror activeId, items, and grow maxIndex to the
      // deepest visited manifest index (1 here, item-2 of 0-based items)
      const mirrored = await waitFor(() => el.maxIndex === 1)
      expect(mirrored).to.be.true
      expect(el.activeId).to.equal('item-2')
      const buttons = el.shadowRoot.querySelectorAll('training-button')
      expect(buttons.length).to.equal(3)
      // the active item's button carries the active attribute
      expect(buttons[1].hasAttribute('active')).to.be.true
      expect(buttons[0].hasAttribute('active')).to.be.false
      // items beyond the visited maxIndex are locked out
      expect(buttons[2].hasAttribute('disabled')).to.be.true
      expect(buttons[0].hasAttribute('disabled')).to.be.false
      expect(buttons[1].hasAttribute('disabled')).to.be.false
      // titles flow from the manifest into the buttons
      expect(
        buttons[0].shadowRoot.querySelector('#title').textContent,
      ).to.equal('One')
    } finally {
      store.manifest = originalManifest
      store.activeId = originalActiveId
    }
  })
})

// BUG(training-theme.js:60-65): the constructor autorun reads
// store.manifest.items without a null guard. With a null manifest (before
// CMS boot / after teardown) the reaction throws
// "TypeError: Cannot read properties of null (reading 'items')", which mobx
// catches, logs, and then disposes the reaction — so the theme permanently
// stops mirroring items. Evidence: the baseline coverage run logs exactly
// this mobx reaction failure twice. The guard should be
// store.manifest && store.manifest.items.
describe('training-theme manifest guard (BUG: unguarded null manifest)', () => {
  it('constructor autorun throws on a null manifest', async () => {
    const originalManifest = store.manifest
    const originalActiveId = store.activeId
    store.manifest = null
    store.activeId = null
    const errors = []
    const originalError = console.error
    console.error = (...args) => {
      errors.push(args.map(String).join(' '))
    }
    try {
      const el = await fixture(html`<training-theme></training-theme>`)
      await new Promise((resolve) => setTimeout(resolve, 150))
      const sawItemsTypeError = errors.some((entry) => {
        return entry.includes("reading 'items'")
      })
      // documents the current broken behavior; see BUG comment above
      expect(sawItemsTypeError).to.be.true
      expect(el.items.length).to.equal(0)
    } finally {
      console.error = originalError
      store.manifest = originalManifest
      store.activeId = originalActiveId
    }
  })
})
