import { fixture, expect, html } from '@open-wc/testing'

import '../simple-cta.js'
import { SimpleCta } from '../simple-cta.js'

describe('simple-cta test', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`
      <simple-cta title="this is my title"></simple-cta>
    `)
  })

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible()
  })
})

describe('simple-cta defaults and rendering', () => {
  it('has expected default property values', async () => {
    const el = await fixture(html`<simple-cta></simple-cta>`)
    expect(el.link).to.equal(null)
    expect(el.label).to.equal(null)
    expect(el.icon).to.equal('icons:chevron-right')
    expect(el.hideIcon).to.equal(false)
    expect(el.disabled).to.equal(false)
  })

  it('renders an anchor with # when no link is supplied', async () => {
    const el = await fixture(html`<simple-cta></simple-cta>`)
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    expect(a.getAttribute('href')).to.equal('#')
  })

  it('renders the supplied link as the anchor href', async () => {
    const el = await fixture(
      html`<simple-cta link="https://haxtheweb.org/"></simple-cta>`,
    )
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    expect(a.getAttribute('href')).to.equal('https://haxtheweb.org/')
  })

  it('renders the label text in the label span', async () => {
    const el = await fixture(html`<simple-cta label="Learn more"></simple-cta>`)
    expect(el.shadowRoot.querySelector('.label').textContent).to.equal(
      'Learn more',
    )
  })

  it('renders an icon by default and removes it when hideIcon is set', async () => {
    const el = await fixture(
      html`<simple-cta label="Learn more"></simple-cta>`,
    )
    expect(el.shadowRoot.querySelector('simple-icon-lite')).to.exist
    el.hideIcon = true
    await el.updateComplete
    expect(el.shadowRoot.querySelector('simple-icon-lite')).to.not.exist
    expect(
      el.shadowRoot.querySelector('.btn').classList.contains('hideIcon'),
    ).to.be.true
  })

  it('reflects the large boolean attribute and applies the large class', async () => {
    const el = await fixture(
      html`<simple-cta label="Learn more"></simple-cta>`,
    )
    expect(el.hasAttribute('large')).to.be.false
    el.large = true
    await el.updateComplete
    expect(el.hasAttribute('large')).to.be.true
    expect(el.shadowRoot.querySelector('.btn').classList.contains('large')).to
      .be.true
  })

  it('reflects light, hotline and saturate boolean attributes', async () => {
    const el = await fixture(html`<simple-cta></simple-cta>`)
    el.light = true
    el.hotline = true
    el.saturate = true
    await el.updateComplete
    expect(el.hasAttribute('light')).to.be.true
    expect(el.hasAttribute('hotline')).to.be.true
    expect(el.hasAttribute('saturate')).to.be.true
  })

  it('passes the a11y audit for visual variants', async () => {
    const light = await fixture(
      html`<simple-cta label="Go" link="#section" light large></simple-cta>`,
    )
    await expect(light).shadowDom.to.be.accessible()
    const hotline = await fixture(
      html`<simple-cta label="Go now" link="#section" hotline hide-icon></simple-cta>`,
    )
    await expect(hotline).shadowDom.to.be.accessible()
  })
})

describe('simple-cta aria label computation', () => {
  it('uses a trimmed label when the label property is set', async () => {
    const el = await fixture(
      html`<simple-cta label="  Learn more  "></simple-cta>`,
    )
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    expect(a.getAttribute('aria-label')).to.equal('Learn more')
  })

  it('falls back to the host title attribute when there is no label', async () => {
    const el = await fixture(
      html`<simple-cta title="this is my title"></simple-cta>`,
    )
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    expect(a.getAttribute('aria-label')).to.equal('this is my title')
  })

  it('falls back to the target url when there is no label or title', async () => {
    const el = await fixture(
      html`<simple-cta link="https://haxtheweb.org/"></simple-cta>`,
    )
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    expect(a.getAttribute('aria-label')).to.equal('https://haxtheweb.org/')
  })

  it('falls back to a generic call to action string', async () => {
    const el = await fixture(html`<simple-cta></simple-cta>`)
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    expect(a.getAttribute('aria-label')).to.equal('Call to action')
  })

  it('uses the url over a whitespace-only title attribute', async () => {
    const el = await fixture(
      html`<simple-cta title="   " link="https://haxtheweb.org/"></simple-cta>`,
    )
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    expect(a.getAttribute('aria-label')).to.equal('https://haxtheweb.org/')
  })
})

describe('simple-cta hax integration', () => {
  it('exposes haxProperties for the HAX editor', async () => {
    const props = SimpleCta.haxProperties
    expect(props).to.exist
    expect(props.type).to.equal('element')
    expect(props.canScale).to.be.true
    expect(props.designSystem.primary).to.be.true
    expect(props.designSystem.accent).to.be.true
    expect(props.gizmo.title).to.equal('Call to action')
    expect(props.gizmo.handles[0].type).to.equal('link')
    const configure = props.settings.configure.map((s) => s.property)
    expect(configure).to.include('label')
    expect(configure).to.include('link')
    expect(configure).to.include('hideIcon')
    const advanced = props.settings.advanced.map((s) => s.property)
    expect(advanced).to.include('icon')
    expect(props.saveOptions.unsetAttributes).to.include('colors')
    expect(props.demoSchema[0].tag).to.equal('simple-cta')
    expect(props.demoSchema[0].properties.link).to.equal(
      'https://haxtheweb.org/',
    )
  })

  it('registers the expected haxHooks', async () => {
    const el = await fixture(html`<simple-cta></simple-cta>`)
    const hooks = el.haxHooks()
    expect(hooks.editModeChanged).to.equal('haxeditModeChanged')
    expect(hooks.activeElementChanged).to.equal('haxactiveElementChanged')
  })

  it('haxeditModeChanged toggles editMode', async () => {
    const el = await fixture(html`<simple-cta></simple-cta>`)
    el.haxeditModeChanged(true)
    expect(el.editMode).to.be.true
    el.haxeditModeChanged(false)
    expect(el.editMode).to.be.false
  })

  it('haxactiveElementChanged flags edit mode and returns false', async () => {
    const el = await fixture(html`<simple-cta></simple-cta>`)
    const result = el.haxactiveElementChanged(el, true)
    expect(result).to.be.false
    expect(el.editMode).to.be.true
  })

  it('blocks the click when in edit mode', async () => {
    const el = await fixture(
      html`<simple-cta label="Go" link="#section"></simple-cta>`,
    )
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    let laterListenerCalled = false
    a.addEventListener('click', () => {
      laterListenerCalled = true
    })
    el.editMode = true
    const blocked = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(blocked)
    expect(blocked.defaultPrevented).to.be.true
    expect(laterListenerCalled).to.be.false
  })

  it('does not block the click when not in edit mode', async () => {
    const el = await fixture(
      html`<simple-cta label="Go" link="#section"></simple-cta>`,
    )
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    const normal = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(normal)
    expect(normal.defaultPrevented).to.be.false
  })
})

describe('simple-cta disabled behavior', () => {
  // FIXED (haxtheweb/issues#3102 #36): the disabled property was
  // declared/reflected but had no effect on the rendered anchor or click
  // handling (dead API). The anchor now carries aria-disabled and
  // _clickCard blocks activation while disabled.
  it('exposes aria-disabled on the anchor when disabled is set', async () => {
    const el = await fixture(
      html`<simple-cta label="Go" link="#section" disabled></simple-cta>`,
    )
    expect(el.disabled).to.equal(true)
    expect(el.hasAttribute('disabled')).to.be.true
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    expect(a.getAttribute('aria-disabled')).to.equal('true')
  })

  it('renders aria-disabled false when enabled', async () => {
    const el = await fixture(
      html`<simple-cta label="Go" link="#section"></simple-cta>`,
    )
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    expect(a.getAttribute('aria-disabled')).to.equal('false')
  })

  it('blocks the click when disabled', async () => {
    const el = await fixture(
      html`<simple-cta label="Go" link="#section" disabled></simple-cta>`,
    )
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    let laterListenerCalled = false
    a.addEventListener('click', () => {
      laterListenerCalled = true
    })
    const blocked = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(blocked)
    expect(blocked.defaultPrevented).to.be.true
    expect(laterListenerCalled).to.be.false
  })

  it('re-enables clicks when disabled toggles back off', async () => {
    const el = await fixture(
      html`<simple-cta label="Go" link="#section" disabled></simple-cta>`,
    )
    el.disabled = false
    await el.updateComplete
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    expect(a.getAttribute('aria-disabled')).to.equal('false')
    const normal = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(normal)
    expect(normal.defaultPrevented).to.be.false
  })

  it('passes the a11y audit when disabled', async () => {
    const el = await fixture(
      html`<simple-cta label="Go" link="#section" disabled></simple-cta>`,
    )
    await expect(el).shadowDom.to.be.accessible()
  })
})

describe('simple-cta progressive enhancement', () => {
  it('lifts the href and text from a light-DOM anchor on upgrade', async () => {
    const name = 'simple-cta-progressive-test'
    const container = document.createElement('div')
    document.body.appendChild(container)
    // parse the legacy light DOM BEFORE the definition exists so the
    // constructor sees the anchor child at upgrade time
    container.innerHTML = `<${name}><a href="https://example.com/legacy">Legacy label</a></${name}>`
    if (!globalThis.customElements.get(name)) {
      class SimpleCtaProgressiveTest extends SimpleCta {
        static get tag() {
          return name
        }
      }
      globalThis.customElements.define(name, SimpleCtaProgressiveTest)
    }
    const el = container.querySelector(name)
    await el.updateComplete
    expect(el.link).to.equal('https://example.com/legacy')
    expect(el.label).to.equal('Legacy label')
    const a = el.shadowRoot.querySelector('a[part="simple-cta-link"]')
    expect(a.getAttribute('href')).to.equal('https://example.com/legacy')
    expect(a.getAttribute('aria-label')).to.equal('Legacy label')
    document.body.removeChild(container)
  })
})

/*
describe("A11y/chai axe tests", () => {
  it("simple-cta passes accessibility test", async () => {
    const el = await fixture(html` <simple-cta></simple-cta> `);
    await expect(el).to.be.accessible();
  });
  it("simple-cta passes accessibility negation", async () => {
    const el = await fixture(
      html`<simple-cta aria-labelledby="simple-cta"></simple-cta>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("simple-cta can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<simple-cta .foo=${'bar'}></simple-cta>`);
    expect(el.foo).to.equal('bar');
  })
})

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<simple-cta ></simple-cta>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<simple-cta></simple-cta>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<simple-cta></simple-cta>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
