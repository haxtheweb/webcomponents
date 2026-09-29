import { fixture, expect, html } from "@open-wc/testing";

import "../scroll-button.js";

describe("scroll-button test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <scroll-button title="test-title"></scroll-button>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe('scroll-button behavior', () => {
  async function wait(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  it('registers itself with the i18n manager on construction', async () => {
    const registrations = []
    const onRegister = (e) => registrations.push(e.detail)
    globalThis.addEventListener('i18n-manager-register-element', onRegister)
    let host
    try {
      host = document.createElement('div')
      document.body.appendChild(host)
      const el = document.createElement('scroll-button')
      host.appendChild(el)
      await wait(25)
      const mine = registrations.filter(
        (r) => r && r.namespace === 'scroll-button',
      )
      expect(mine.length).to.be.at.least(1)
      expect(mine[0].updateCallback).to.equal('render')
      expect(mine[0].localesPath).to.include('scroll-button')
      expect(mine[0].context).to.equal(el)
    } finally {
      globalThis.removeEventListener(
        'i18n-manager-register-element',
        onRegister,
      )
      if (host) host.remove()
    }
  })

  it('has the documented defaults and renders button and tooltip', async () => {
    const el = await fixture(html`<scroll-button></scroll-button>`)
    await el.updateComplete
    expect(el.icon).to.equal('icons:expand-less')
    expect(el.label).to.equal('')
    expect(el._label).to.equal('Back to top')
    expect(el.position).to.equal('top')
    expect(el.t.backToTop).to.equal('Back to top')
    const btn = el.shadowRoot.querySelector('simple-icon-button-lite#btn')
    expect(btn).to.exist
    expect(btn.getAttribute('icon')).to.equal('icons:expand-less')
    expect(btn.getAttribute('label')).to.equal('Back to top')
    const tooltip = el.shadowRoot.querySelector('simple-tooltip')
    expect(tooltip).to.exist
    expect(tooltip.getAttribute('for')).to.equal('btn')
    expect(tooltip.getAttribute('position')).to.equal('top')
    expect(tooltip.textContent.trim()).to.equal('Back to top')
  })

  it('reflects icon and position changes in the shadow dom', async () => {
    const el = await fixture(html`<scroll-button></scroll-button>`)
    await el.updateComplete
    el.icon = 'icons:arrow-upward'
    el.position = 'bottom'
    await el.updateComplete
    expect(el.shadowRoot.querySelector('#btn').getAttribute('icon')).to.equal(
      'icons:arrow-upward',
    )
    expect(
      el.shadowRoot.querySelector('simple-tooltip').getAttribute('position'),
    ).to.equal('bottom')
  })

  it('prefers a developer supplied label over the translation', async () => {
    const el = await fixture(
      html`<scroll-button label="Skip to top"></scroll-button>`,
    )
    await el.updateComplete
    expect(el._label).to.equal('Skip to top')
    expect(el.shadowRoot.querySelector('#btn').getAttribute('label')).to.equal(
      'Skip to top',
    )
    expect(
      el.shadowRoot.querySelector('simple-tooltip').textContent.trim(),
    ).to.equal('Skip to top')
  })

  it('falls back to the translation when the label is cleared', async () => {
    const el = await fixture(
      html`<scroll-button label="Skip to top"></scroll-button>`,
    )
    await el.updateComplete
    el.label = ''
    await el.updateComplete
    el.t = { backToTop: 'Retour en haut' }
    // setting _label inside updated() schedules a second render, so
    // settle two update cycles before asserting the rendered output
    await el.updateComplete
    await el.updateComplete
    expect(el._label).to.equal('Retour en haut')
    expect(
      el.shadowRoot.querySelector('simple-tooltip').textContent.trim(),
    ).to.equal('Retour en haut')
  })

  it('scrollEvent scrolls a supplied target into view', async () => {
    const el = await fixture(html`<scroll-button></scroll-button>`)
    await el.updateComplete
    const calls = []
    const target = document.createElement('div')
    target.scrollIntoView = (args) => calls.push(args)
    el.target = target
    el.scrollEvent({})
    expect(calls).to.deep.equal([
      { behavior: 'smooth', block: 'start', inline: 'nearest' },
    ])
  })

  it('scrollEvent scrolls the window back to the top without a target', async () => {
    const el = await fixture(html`<scroll-button></scroll-button>`)
    await el.updateComplete
    const original = globalThis.scrollTo
    const calls = []
    globalThis.scrollTo = (args) => calls.push(args)
    try {
      el.scrollEvent({})
      expect(calls).to.deep.equal([
        { top: 0, left: 0, behavior: 'smooth' },
      ])
    } finally {
      globalThis.scrollTo = original
    }
  })
})

describe('simple-icon-button-lite toggling (scroll-button dependency)', () => {
  const hosts = []

  async function makeButton(props) {
    const host = document.createElement('div')
    document.body.appendChild(host)
    hosts.push(host)
    const btn = document.createElement('simple-icon-button-lite')
    for (const key of Object.keys(props)) {
      btn[key] = props[key]
    }
    host.appendChild(btn)
    await btn.updateComplete
    return btn
  }

  afterEach(() => {
    for (const host of hosts.splice(0)) host.remove()
  })

  it('omits a meaningful aria-pressed unless toggles is set', async () => {
    const plain = await makeButton({ icon: 'icons:add', label: 'Add' })
    // lit renders the undefined branch as an empty attribute value
    expect(
      plain.shadowRoot.querySelector('button').getAttribute('aria-pressed'),
    ).to.satisfy((value) => value === '' || value === null)
    const toggle = await makeButton({
      icon: 'icons:add',
      label: 'Toggle',
      toggles: true,
      toggled: true,
    })
    expect(
      toggle.shadowRoot.querySelector('button').getAttribute('aria-pressed'),
    ).to.equal('true')
    const untoggled = await makeButton({
      icon: 'icons:add',
      label: 'Toggle',
      toggles: true,
      toggled: false,
    })
    expect(
      untoggled.shadowRoot
        .querySelector('button')
        .getAttribute('aria-pressed'),
    ).to.equal('false')
  })
})

describe('simple-icon-lite rendering (scroll-button dependency)', () => {
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
      expect(icon.shadowRoot.querySelector('image').getAttribute('xlink:href'))
        .to.include('remove')

      // clearing the icon clears the resolved src
      icon.icon = ''
      await new Promise((resolve) => setTimeout(resolve, 50))
      expect(icon.src).to.equal(null)
    } finally {
      host.remove()
    }
  })
})

/*
describe("A11y/chai axe tests", () => {
  it("scroll-button passes accessibility test", async () => {
    const el = await fixture(html` <scroll-button></scroll-button> `);
    await expect(el).to.be.accessible();
  });
  it("scroll-button passes accessibility negation", async () => {
    const el = await fixture(
      html`<scroll-button aria-labelledby="scroll-button"></scroll-button>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("scroll-button can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<scroll-button .foo=${'bar'}></scroll-button>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<scroll-button ></scroll-button>`);
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
      const el = await fixture(html`<scroll-button></scroll-button>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<scroll-button></scroll-button>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
