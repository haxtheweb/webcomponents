import { fixture, expect, html } from "@open-wc/testing";

import { TwitterEmbed } from "../twitter-embed.js";

// network stub: iframe src attributes are captured instead of being loaded so
// no request to platform.x.com ever leaves the test run
const blockedSrcs = []
const origSetAttribute = Element.prototype.setAttribute
Element.prototype.setAttribute = function (name, value) {
  if (
    this.tagName === "IFRAME" &&
    String(name).toLowerCase() === "src" &&
    String(value).startsWith("http")
  ) {
    blockedSrcs.push(String(value))
    return origSetAttribute.call(this, "data-blocked-src", String(value))
  }
  return origSetAttribute.call(this, name, value)
}
after(() => {
  Element.prototype.setAttribute = origSetAttribute
})

describe("twitter-embed test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <twitter-embed title="test-title"></twitter-embed>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("twitter-embed passes accessibility test", async () => {
    const el = await fixture(html` <twitter-embed></twitter-embed> `);
    await expect(el).to.be.accessible();
  });
  it("twitter-embed passes accessibility negation", async () => {
    const el = await fixture(
      html`<twitter-embed aria-labelledby="twitter-embed"></twitter-embed>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("twitter-embed can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<twitter-embed .foo=${'bar'}></twitter-embed>`);
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
      const el = await fixture(html`<twitter-embed ></twitter-embed>`);
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
        const el = await fixture(html`<twitter-embed></twitter-embed>`);
        const width = getComputedStyle(el).width;
        expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
        const el await fixture(html`<twitter-embed></twitter-embed>`);
        const hidden = el.getAttribute('hidden');
        expect(hidden).to.equal(true);
    })
}) */

describe('twitter-embed HAX integration', () => {
  let element
  beforeEach(async () => {
    element = await fixture(
      html`<twitter-embed tweet-id="123" lang="es"></twitter-embed>`,
    )
  })

  it('exposes haxProperties from its lib schema file', () => {
    expect(TwitterEmbed.haxProperties).to.be.a('string')
    expect(TwitterEmbed.haxProperties).to.include(
      'lib/twitter-embed.haxProperties.json',
    )
  })

  it('registers the gizmo, edit mode and active element hooks', () => {
    expect(element.haxHooks()).to.deep.equal({
      gizmoRegistration: 'haxgizmoRegistration',
      editModeChanged: 'haxeditModeChanged',
      activeElementChanged: 'haxactiveElementChanged',
    })
  })

  it('registers i18n for the HAX editor', () => {
    let detail = null
    const handler = (e) => {
      detail = e.detail
    }
    globalThis.addEventListener('i18n-manager-register-element', handler)
    element.haxgizmoRegistration()
    globalThis.removeEventListener('i18n-manager-register-element', handler)
    expect(detail).to.exist
    expect(detail.namespace).to.equal('twitter-embed.haxProperties')
    expect(detail.localesPath).to.include('/locales')
  })

  it('tracks the active element while active in hax', () => {
    element.haxactiveElementChanged(element, true)
    expect(element._haxstate).to.be.true
    // a false value does not unset the flag while still active
    element.haxactiveElementChanged(element, false)
    expect(element._haxstate).to.be.true
  })

  it('tracks hax edit mode changes', () => {
    element.haxeditModeChanged(true)
    expect(element._haxstate).to.be.true
    element.haxeditModeChanged(false)
    expect(element._haxstate).to.be.false
  })

  it('blocks click through when editing in hax', () => {
    element.haxeditModeChanged(true)
    const calls = []
    element._clickPrevent({
      preventDefault: () => calls.push('default'),
      stopPropagation: () => calls.push('propagation'),
      stopImmediatePropagation: () => calls.push('immediate'),
    })
    expect(calls).to.deep.equal(['default', 'propagation', 'immediate'])
    element.haxeditModeChanged(false)
    const blocked = []
    element._clickPrevent({
      preventDefault: () => blocked.push('default'),
      stopPropagation: () => blocked.push('propagation'),
      stopImmediatePropagation: () => blocked.push('immediate'),
    })
    expect(blocked).to.deep.equal([])
  })
})

describe('twitter-embed properties', () => {
  let element
  beforeEach(async () => {
    element = await fixture(html`<twitter-embed></twitter-embed>`)
  })

  it('drops popups when no-popups is set', async () => {
    element.noPopups = true
    await element.updateComplete
    expect(element.allowPopups).to.equal('')
    element.noPopups = false
    await element.updateComplete
    expect(element.allowPopups).to.equal('allow-popups')
  })

  it('derives a tweet id from a twitter.com url', async () => {
    element.tweet = 'https://twitter.com/btopro/status/42'
    await element.updateComplete
    expect(element.tweetId).to.equal('42')
  })

  it('respects an authored lang attribute over the document chain', async () => {
    const el = await fixture(html`<twitter-embed lang="es"></twitter-embed>`)
    await el.updateComplete
    expect(el.lang).to.equal('es')
    const iframe = el.shadowRoot.querySelector('iframe')
    const src = iframe.getAttribute('data-blocked-src')
    expect(src).to.include('lang=es')
  })

  it('derives a tweet id from an x.com url', async () => {
    element.tweet = 'https://x.com/btopro/status/77'
    await element.updateComplete
    expect(element.tweetId).to.equal('77')
  })

  it('leaves the tweet id alone for non twitter urls', async () => {
    element.tweetId = '77'
    element.tweet = 'https://example.com/not-a-tweet'
    await element.updateComplete
    expect(element.tweetId).to.equal('77')
  })

  it('renders an embed iframe without hitting the network', async () => {
    element.tweetId = '1234567890'
    element.dataWidth = '400px'
    element.dataTheme = 'dark'
    await element.updateComplete
    const iframe = element.shadowRoot.querySelector('iframe')
    expect(iframe).to.exist
    const src = iframe.getAttribute('data-blocked-src')
    expect(src).to.include('id=1234567890')
    expect(src).to.include('theme=dark')
    expect(src).to.include('width=400px')
    expect(src).to.include('lang=')
    expect(iframe.hasAttribute('src')).to.be.false
    expect(iframe.getAttribute('sandbox')).to.equal(
      'allow-same-origin allow-scripts allow-popups',
    )
    expect(blockedSrcs.includes(src)).to.be.true
  })
})
