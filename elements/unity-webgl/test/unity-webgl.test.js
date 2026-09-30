import { fixture, expect, html, aTimeout } from '@open-wc/testing'
import { UnityWebgl } from '../unity-webgl.js'

// network stub: render() assigns the Unity loader through the script src
// property, so the descriptor is patched to capture the url instead of ever
// loading it; createUnityInstance is stubbed to capture the boot config
const capturedScriptSrcs = []
const scriptSrcDescriptor = Object.getOwnPropertyDescriptor(
  HTMLScriptElement.prototype,
  'src',
)
Object.defineProperty(HTMLScriptElement.prototype, 'src', {
  ...scriptSrcDescriptor,
  set(value) {
    capturedScriptSrcs.push(String(value))
  },
})
after(() => {
  Object.defineProperty(
    HTMLScriptElement.prototype,
    'src',
    scriptSrcDescriptor,
  )
})

describe('unity-webgl', () => {
  let bootConfigs

  beforeEach(() => {
    bootConfigs = []
    globalThis.createUnityInstance = (canvasElement, config) => {
      bootConfigs.push({ canvasElement, config })
    }
  })

  afterEach(() => {
    delete globalThis.createUnityInstance
  })

  it('is defined with its tag name', () => {
    expect(UnityWebgl.tag).to.equal('unity-webgl')
    expect(globalThis.customElements.get('unity-webgl')).to.exist
  })

  it('exposes a full haxProperties configuration', () => {
    const props = UnityWebgl.haxProperties
    expect(props.canScale).to.be.false
    expect(props.canEditSource).to.be.true
    expect(props.gizmo.title).to.equal('Unity Player')
    expect(props.gizmo.tags).to.include('unity')
    expect(props.settings.configure.length).to.equal(9)
    expect(props.demoSchema[0].tag).to.equal('unity-webgl')
    expect(props.demoSchema[0].properties.compression).to.equal('unityweb')
  })

  it('renders its canvas and boot script into the shadow root', async () => {
    const el = await fixture(
      html`<unity-webgl
        target="demo-build"
        compression="unityweb"
        streamingurl="StreamingAssets"
        companyname="DefaultCompany"
        productname="test webgl"
        productversion="0.1"
        width="460px"
        height="400px"
        background="#231F20"
      ></unity-webgl>`,
    )
    await aTimeout(50)
    const canvas = el.shadowRoot.querySelector('canvas')
    expect(canvas).to.exist
    expect(canvas.getAttribute('style')).to.include('width: 460px')
    expect(canvas.getAttribute('style')).to.include('height: 400px')
    expect(canvas.getAttribute('style')).to.include('background: #231F20')
    const script = el.shadowRoot.querySelector('script')
    expect(script).to.exist
    expect(capturedScriptSrcs.includes('demo-build.loader.js')).to.be.true
    expect(script.hasAttribute('src')).to.be.false
  })

  it('boots the unity instance once the loader script loads', async () => {
    const el = await fixture(
      html`<unity-webgl
        target="demo-build"
        compression="unityweb"
        streamingurl="StreamingAssets"
        companyname="DefaultCompany"
        productname="test webgl"
        productversion="0.1"
      ></unity-webgl>`,
    )
    await aTimeout(50)
    el.shadowRoot.querySelector('script').onload()
    expect(bootConfigs.length).to.equal(1)
    const boot = bootConfigs[0]
    expect(boot.canvasElement === el.shadowRoot.querySelector('canvas')).to.be
      .true
    expect(boot.config.dataUrl).to.equal('demo-build.data.unityweb')
    expect(boot.config.frameworkUrl).to.equal('demo-build.framework.js.unityweb')
    expect(boot.config.codeUrl).to.equal('demo-build.wasm.unityweb')
    expect(boot.config.streamingAssetsUrl).to.equal('StreamingAssets')
    expect(boot.config.company_name).to.equal('DefaultCompany')
    expect(boot.config.product_name).to.equal('test webgl')
    expect(boot.config.product_version).to.equal('0.1')
  })

  it('logs when the loader script fails to load', async () => {
    const el = await fixture(
      html`<unity-webgl target="demo-build" compression="unityweb"></unity-webgl>`,
    )
    await aTimeout(50)
    const logs = []
    const originalLog = console.log
    console.log = (...args) => logs.push(args.join(' '))
    el.shadowRoot.querySelector('script').onerror()
    console.log = originalLog
    expect(logs.length).to.equal(1)
    expect(logs[0]).to.include('Error loading')
  })

  it('rerenders when presentation attributes change', async () => {
    const el = await fixture(
      html`<unity-webgl
        target="demo-build"
        compression="unityweb"
        width="460px"
        height="400px"
        background="#231F20"
      ></unity-webgl>`,
    )
    await aTimeout(50)
    const before = capturedScriptSrcs.length
    el.setAttribute('width', '500px')
    await aTimeout(50)
    expect(capturedScriptSrcs.length).to.be.greaterThan(before)
    const canvas = el.shadowRoot.querySelector('canvas')
    expect(canvas.getAttribute('style')).to.include('width: 500px')
  })

  it('connects without attributes and renders placeholder values', async () => {
    const el = await fixture(html`<unity-webgl></unity-webgl>`)
    await aTimeout(50)
    expect(capturedScriptSrcs.includes('null.loader.js')).to.be.true
    const canvas = el.shadowRoot.querySelector('canvas')
    expect(canvas.getAttribute('style')).to.include('width: null')
  })

  it('clears the shadow root between renders', async () => {
    const el = await fixture(
      html`<unity-webgl
        target="demo-build"
        compression="unityweb"
        width="460px"
        height="400px"
        background="#231F20"
      ></unity-webgl>`,
    )
    await aTimeout(50)
    // innerHTML is LegacyNullToEmptyString so assigning null clears the root,
    // leaving exactly one canvas after a rerender
    el.setAttribute('width', '500px')
    await aTimeout(50)
    expect(el.shadowRoot.querySelectorAll('canvas').length).to.equal(1)
    expect(el.shadowRoot.querySelectorAll('script').length).to.equal(1)
    expect(el.shadowRoot.textContent).to.not.include('null')
  })

  it('reflects attribute access through its getters and setters', async () => {
    const el = await fixture(html`<unity-webgl></unity-webgl>`)
    await aTimeout(50)
    el.target = 'new-target'
    expect(el.target).to.equal('new-target')
    expect(el.getAttribute('target')).to.equal('new-target')
    el.compression = 'gzip'
    expect(el.compression).to.equal('gzip')
    el.streamingurl = 'assets'
    expect(el.streamingurl).to.equal('assets')
    el.companyname = 'ACME'
    expect(el.companyname).to.equal('ACME')
    el.productname = 'Game'
    expect(el.productname).to.equal('Game')
    el.productversion = '1.0'
    expect(el.productversion).to.equal('1.0')
    el.width = '320px'
    expect(el.width).to.equal('320px')
    el.height = '240px'
    expect(el.height).to.equal('240px')
    el.background = '#000000'
    expect(el.background).to.equal('#000000')
  })

  it('builds its markup from the current attributes', async () => {
    const el = await fixture(
      html`<unity-webgl
        width="100px"
        height="80px"
        background="#111111"
      ></unity-webgl>`,
    )
    await aTimeout(50)
    const markup = el.html
    expect(markup).to.include(':host')
    expect(markup).to.include('<canvas')
    expect(markup).to.include('width: 100px')
    expect(markup).to.include('height: 80px')
    expect(markup).to.include('background: #111111')
  })

  it('styles through ShadyCSS when it is present', async () => {
    const styled = []
    const prepared = []
    globalThis.ShadyCSS = {
      styleElement(element) {
        styled.push(element)
      },
      prepareTemplate(template, tag) {
        prepared.push(tag)
      },
    }
    let el
    try {
      el = await fixture(
        html`<unity-webgl
          target="shady-build"
          compression="unityweb"
          width="460px"
          height="400px"
          background="#231F20"
        ></unity-webgl>`,
      )
      await aTimeout(50)
    } finally {
      delete globalThis.ShadyCSS
    }
    expect(styled.length).to.be.greaterThan(0)
    expect(prepared.length).to.be.greaterThan(0)
    // BUG: render() passes this.tag to prepareTemplate, but tag is a static
    // getter so instances read undefined here instead of "unity-webgl"
    expect(prepared[0]).to.equal(undefined)
  })

  it('passes the a11y audit', async () => {
    const el = await fixture(
      html`<unity-webgl
        target="demo-build"
        compression="unityweb"
        width="460px"
        height="400px"
        background="#231F20"
      ></unity-webgl>`,
    )
    await aTimeout(50)
    await expect(el).shadowDom.to.be.accessible()
  })
})

/*
describe("unity-webgl test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<unity-webgl 
      target="${new URL('../demo/example/build web', import.meta.url).href}" 
      compression="unityweb"
      streamingurl="StreamingAssets" 
      companyname="DefaultCompany" 
      productname="test webgl" 
      productversion="0.1"
      width="460px" 
      height="400px" 
      background="#231F20">
    </unity-webgl>`
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
/*
describe("A11y/chai axe tests", () => {
  it("unity-webgl passes accessibility test", async () => {
    const el = await fixture(html` <unity-webgl></unity-webgl> `);
    await expect(el).to.be.accessible();
  });
  it("unity-webgl passes accessibility negation", async () => {
    const el = await fixture(
      html`<unity-webgl aria-labelledby="unity-webgl"></unity-webgl>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("unity-webgl can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<unity-webgl .foo=${'bar'}></unity-webgl>`);
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
      const el = await fixture(html`<unity-webgl ></unity-webgl>`);
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
        const el = await fixture(html`<unity-webgl></unity-webgl>`);
        const width = getComputedStyle(el).width;
        expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
        const el await fixture(html`<unity-webgl></unity-webgl>`);
        const hidden = el.getAttribute('hidden');
        expect(hidden).to.equal(true);
    })
}) */
