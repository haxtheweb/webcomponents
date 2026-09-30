import { fixture, expect, html } from '@open-wc/testing'

// Clear demo appSettings before importing store-dependent modules
globalThis.appSettings = {}

// Directly import each lib file so istanbul instruments them
await import('../lib/v2/app-hax-filter-tag.js')
await import('../lib/v2/app-hax-scroll-button.js')
await import('../lib/v2/app-hax-use-case.js')
await import('../lib/v2/app-hax-simple-hat-progress.js')
await import('../lib/v2/app-hax-darkmode-toggle.js')

describe('app-hax-filter-tag', () => {
  it('renders label text', async () => {
    const el = await fixture(html`<app-hax-filter-tag label="My Tag"></app-hax-filter-tag>`)
    await el.updateComplete
    const label = el.shadowRoot.querySelector('.tag-label')
    expect(label).to.exist
    expect(label.textContent).to.equal('My Tag')
  })

  it('dispatches remove-tag event with label as detail', async () => {
    const el = await fixture(html`<app-hax-filter-tag label="RemoveMe"></app-hax-filter-tag>`)
    await el.updateComplete
    let capturedDetail = null
    el.addEventListener('remove-tag', (e) => {
      capturedDetail = e.detail
    })
    const removeEl = el.shadowRoot.querySelector('.remove')
    removeEl.click()
    expect(capturedDetail).to.equal('RemoveMe')
  })

  it('has correct tag name', () => {
    const el = document.createElement('app-hax-filter-tag')
    expect(el.constructor.tag).to.equal('app-hax-filter-tag')
  })

  it('defaults label to empty string', () => {
    const el = document.createElement('app-hax-filter-tag')
    expect(el.label).to.equal('')
  })

  it('has static styles defined', () => {
    const el = document.createElement('app-hax-filter-tag')
    expect(el.constructor.styles).to.exist
    expect(el.constructor.styles.length).to.be.greaterThan(0)
  })
})

describe('app-hax-scroll-button', () => {
  it('renders with label and role=button', async () => {
    const el = await fixture(html`<app-hax-scroll-button label="Section 1"></app-hax-scroll-button>`)
    await el.updateComplete
    const div = el.shadowRoot.querySelector('div[role="button"]')
    expect(div).to.exist
    expect(div.getAttribute('aria-label')).to.include('Section 1')
  })

  it('defaults label and targetId to empty strings', () => {
    const el = document.createElement('app-hax-scroll-button')
    expect(el.label).to.equal('')
    expect(el.targetId).to.equal('')
  })

  it('does not scroll when targetId is empty', () => {
    const el = document.createElement('app-hax-scroll-button')
    expect(() => el.scrollToTarget()).to.not.throw()
  })

  it('warns when target element not found', () => {
    const el = document.createElement('app-hax-scroll-button')
    el.targetId = 'nonexistent-id'
    let warned = false
    const originalWarn = console.warn
    console.warn = () => {
      warned = true
    }
    el.scrollToTarget()
    console.warn = originalWarn
    expect(warned).to.be.true
  })

  it('scrolls target element into view when found via getElementById', async () => {
    const el = await fixture(
      html`<app-hax-scroll-button label="Go" .targetId=${'found-target'}></app-hax-scroll-button>`,
    )
    await el.updateComplete
    // Create a target element in the document
    const target = document.createElement('div')
    target.id = 'found-target'
    document.body.appendChild(target)
    let scrolled = false
    Object.defineProperty(target, 'scrollIntoView', {
      value: () => {
        scrolled = true
      },
      configurable: true,
    })
    el.scrollToTarget()
    // Clean up
    target.remove()
    expect(scrolled).to.be.true
  })

  it('handles Enter key to trigger scroll', async () => {
    const el = await fixture(
      html`<app-hax-scroll-button label="Go" .targetId=${'kbd-target'}></app-hax-scroll-button>`,
    )
    await el.updateComplete
    const target = document.createElement('div')
    target.id = 'kbd-target'
    document.body.appendChild(target)
    let scrolled = false
    Object.defineProperty(target, 'scrollIntoView', {
      value: () => {
        scrolled = true
      },
      configurable: true,
    })
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }))
    target.remove()
    expect(scrolled).to.be.true
  })

  it('handles Space key to trigger scroll', async () => {
    const el = await fixture(
      html`<app-hax-scroll-button label="Go" .targetId=${'space-target'}></app-hax-scroll-button>`,
    )
    await el.updateComplete
    const target = document.createElement('div')
    target.id = 'space-target'
    document.body.appendChild(target)
    let scrolled = false
    Object.defineProperty(target, 'scrollIntoView', {
      value: () => {
        scrolled = true
      },
      configurable: true,
    })
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
    target.remove()
    expect(scrolled).to.be.true
  })

  it('ignores other keys', async () => {
    const el = await fixture(
      html`<app-hax-scroll-button label="Go" .targetId=${'other-target'}></app-hax-scroll-button>`,
    )
    await el.updateComplete
    const target = document.createElement('div')
    target.id = 'other-target'
    document.body.appendChild(target)
    let scrolled = false
    Object.defineProperty(target, 'scrollIntoView', {
      value: () => {
        scrolled = true
      },
      configurable: true,
    })
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }))
    target.remove()
    expect(scrolled).to.be.false
  })

  it('disconnects MutationObserver on disconnectedCallback', async () => {
    const el = await fixture(
      html`<app-hax-scroll-button label="Test"></app-hax-scroll-button>`,
    )
    await el.updateComplete
    expect(el._darkModeObserver).to.exist
    el.disconnectedCallback()
    // Observer should still exist but be disconnected (no error)
    expect(el._darkModeObserver).to.exist
  })

  it('reflects isDarkMode property', async () => {
    const el = await fixture(
      html`<app-hax-scroll-button label="Test" .isDarkMode=${true}></app-hax-scroll-button>`,
    )
    await el.updateComplete
    expect(el.isDarkMode).to.be.true
    expect(el.hasAttribute('isDarkMode')).to.be.true
  })
})

describe('app-hax-use-case', () => {
  it('renders card with title', async () => {
    const el = await fixture(
      html`<app-hax-use-case title="My Template" description="A test template"></app-hax-use-case>`,
    )
    await el.updateComplete
    const h3 = el.shadowRoot.querySelector('h3')
    expect(h3).to.exist
    expect(h3.textContent).to.equal('My Template')
  })

  it('shows Untitled template when title is empty', async () => {
    const el = await fixture(html`<app-hax-use-case></app-hax-use-case>`)
    await el.updateComplete
    const h3 = el.shadowRoot.querySelector('h3')
    expect(h3.textContent).to.equal('Untitled template')
  })

  it('renders image when source is provided', async () => {
    const el = await fixture(
      html`<app-hax-use-case title="Test" source="img.png"></app-hax-use-case>`,
    )
    await el.updateComplete
    const img = el.shadowRoot.querySelector('img')
    expect(img).to.exist
    expect(img.getAttribute('src')).to.equal('img.png')
  })

  it('renders placeholder icon when no source', async () => {
    const el = await fixture(html`<app-hax-use-case title="Test"></app-hax-use-case>`)
    await el.updateComplete
    const placeholder = el.shadowRoot.querySelector('.image-placeholder')
    expect(placeholder).to.exist
  })

  it('toggleDisplay flips isSelected and showContinue', async () => {
    const el = await fixture(html`<app-hax-use-case title="Test"></app-hax-use-case>`)
    await el.updateComplete
    expect(el.isSelected).to.be.false
    el.toggleDisplay()
    expect(el.isSelected).to.be.true
    expect(el.showContinue).to.be.true
  })

  it('toggleDisplay dispatches toggle-display event', async () => {
    const el = await fixture(html`<app-hax-use-case title="Test"></app-hax-use-case>`)
    await el.updateComplete
    let capturedDetail = null
    el.addEventListener('toggle-display', (e) => {
      capturedDetail = e.detail
    })
    el.toggleDisplay()
    expect(capturedDetail).to.exist
    expect(capturedDetail.isSelected).to.be.true
  })

  it('toggleDisplay triggers continueAction after delay when selected', async () => {
    const el = await fixture(html`<app-hax-use-case title="Test"></app-hax-use-case>`)
    await el.updateComplete
    let continued = false
    el.addEventListener('continue-action', () => {
      continued = true
    })
    el.toggleDisplay()
    await new Promise((r) => setTimeout(r, 150))
    expect(continued).to.be.true
  })

  it('continueAction dispatches event with title and description', async () => {
    const el = await fixture(
      html`<app-hax-use-case title="MyTitle" description="MyDesc" source="src"></app-hax-use-case>`,
    )
    await el.updateComplete
    let capturedDetail = null
    el.addEventListener('continue-action', (e) => {
      capturedDetail = e.detail
    })
    el.continueAction()
    expect(capturedDetail).to.exist
    expect(capturedDetail.title).to.equal('MyTitle')
    expect(capturedDetail.description).to.equal('MyDesc')
    expect(capturedDetail.source).to.equal('src')
    expect(capturedDetail.template).to.equal('MyTitle')
  })

  it('openDemo opens demoLink in new window when set', async () => {
    const el = await fixture(
      html`<app-hax-use-case .demoLink=${'https://demo.example.com'}></app-hax-use-case>`,
    )
    await el.updateComplete
    let openedUrl = null
    let openedTarget = null
    const originalOpen = globalThis.open
    globalThis.open = (url, target) => {
      openedUrl = url
      openedTarget = target
    }
    el.openDemo()
    globalThis.open = originalOpen
    expect(openedUrl).to.equal('https://demo.example.com')
    expect(openedTarget).to.equal('_blank')
  })

  it('openDemo does nothing when demoLink is empty', async () => {
    const el = await fixture(html`<app-hax-use-case></app-hax-use-case>`)
    await el.updateComplete
    let opened = false
    const originalOpen = globalThis.open
    globalThis.open = () => {
      opened = true
    }
    el.openDemo()
    globalThis.open = originalOpen
    expect(opened).to.be.false
  })

  it('uses custom iconImage when provided', async () => {
    const el = await fixture(
      html`<app-hax-use-case
        title="Test"
        .iconImage=${[{ icon: 'custom:icon', tooltip: 'Custom' }]}
      ></app-hax-use-case>`,
    )
    await el.updateComplete
    const icon = el.shadowRoot.querySelector('simple-icon-lite')
    expect(icon).to.exist
    expect(icon.getAttribute('icon')).to.equal('custom:icon')
  })

  it('defaults to cloud-download icon when no iconImage', async () => {
    const el = await fixture(html`<app-hax-use-case title="Test"></app-hax-use-case>`)
    await el.updateComplete
    const icon = el.shadowRoot.querySelector('simple-icon-lite')
    expect(icon).to.exist
    expect(icon.getAttribute('icon')).to.equal('icons:cloud-download')
  })
})

describe('app-hax-simple-hat-progress', () => {
  it('renders with progress 0 by default', async () => {
    const el = await fixture(html`<app-hax-simple-hat-progress></app-hax-simple-hat-progress>`)
    await el.updateComplete
    const text = el.shadowRoot.querySelector('.progress-text')
    expect(text).to.exist
    expect(text.textContent).to.equal('0%')
  })

  it('renders correct percentage for progress 50 of 100', async () => {
    const el = await fixture(
      html`<app-hax-simple-hat-progress .progress=${50} .max=${100}></app-hax-simple-hat-progress>`,
    )
    await el.updateComplete
    const text = el.shadowRoot.querySelector('.progress-text')
    expect(text.textContent).to.equal('50%')
  })

  it('caps percentage at 100 when progress exceeds max', async () => {
    const el = await fixture(
      html`<app-hax-simple-hat-progress .progress=${150} .max=${100}></app-hax-simple-hat-progress>`,
    )
    await el.updateComplete
    const text = el.shadowRoot.querySelector('.progress-text')
    expect(text.textContent).to.equal('100%')
  })

  it('floors percentage at 0 when progress is negative', async () => {
    const el = await fixture(
      html`<app-hax-simple-hat-progress .progress=${-20} .max=${100}></app-hax-simple-hat-progress>`,
    )
    await el.updateComplete
    const text = el.shadowRoot.querySelector('.progress-text')
    expect(text.textContent).to.equal('0%')
  })

  it('updates progress-fill width on property change', async () => {
    const el = await fixture(html`<app-hax-simple-hat-progress></app-hax-simple-hat-progress>`)
    await el.updateComplete
    el.progress = 75
    await el.updateComplete
    const fill = el.shadowRoot.querySelector('.progress-fill')
    expect(fill).to.exist
    expect(fill.style.width).to.equal('75%')
  })

  it('renders hat image', async () => {
    const el = await fixture(html`<app-hax-simple-hat-progress></app-hax-simple-hat-progress>`)
    await el.updateComplete
    const img = el.shadowRoot.querySelector('.hat-image')
    expect(img).to.exist
    expect(img.getAttribute('alt')).to.equal('Progress Hat')
  })

  it('defaults max to 100', () => {
    const el = document.createElement('app-hax-simple-hat-progress')
    expect(el.max).to.equal(100)
  })

  it('defaults progress to 0', () => {
    const el = document.createElement('app-hax-simple-hat-progress')
    expect(el.progress).to.equal(0)
  })
})

describe('app-hax-darkmode-toggle', () => {
  it('has correct tag name', () => {
    const el = document.createElement('app-hax-darkmode-toggle')
    expect(el.constructor.tag).to.equal('app-hax-darkmode-toggle')
  })

  it('removes media query listener on disconnect', async () => {
    const el = await fixture(html`<app-hax-darkmode-toggle></app-hax-darkmode-toggle>`)
    await el.updateComplete
    expect(el.darkModeMediaQuery).to.exist
    expect(el._updateToggleState).to.be.a('function')
    // Should not throw on disconnect
    expect(() => el.disconnectedCallback()).to.not.throw()
  })
})
