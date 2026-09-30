import { fixture, expect, html } from "@open-wc/testing";

import "../oer-schema.js";
import { OerSchemaElement } from "../oer-schema.js";

describe("oer-schema test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <oer-schema title="test-title"></oer-schema>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe('oer-schema element', () => {
  it('registers the custom element', () => {
    expect(globalThis.customElements.get('oer-schema')).to.exist
  })

  it('has the expected static tag', () => {
    expect(OerSchemaElement.tag).to.equal('oer-schema')
  })

  it('has default property values', async () => {
    const el = await fixture(html`<oer-schema></oer-schema>`)
    expect(el.text).to.equal('')
    expect(el.oerProperty).to.equal('name')
    expect(el.typeof).to.equal('Resource')
    expect(el.relatedResource).to.be.undefined
  })

  it('renders the oer property wrapper with text and slot content', async () => {
    const el = await fixture(
      html`<oer-schema oer-property="description" text="Inline text"
        >Slotted text</oer-schema
      >`,
    )
    await el.updateComplete
    const span = el.shadowRoot.querySelector('span')
    expect(span).to.exist
    expect(span.getAttribute('property')).to.equal('oer:description')
    expect(span.textContent).to.include('Inline text')
    expect(el.textContent).to.include('Slotted text')
  })

  it('updates the rendered oer property on change', async () => {
    const el = await fixture(html`<oer-schema></oer-schema>`)
    const span = el.shadowRoot.querySelector('span')
    expect(span.getAttribute('property')).to.equal('oer:name')
    el.oerProperty = 'forCourse'
    await el.updateComplete
    expect(span.getAttribute('property')).to.equal('oer:forCourse')
  })

  it('injects an oer:forComponent link for related resources', async () => {
    const el = await fixture(html`<oer-schema></oer-schema>`)
    el.relatedResource = 'course-123'
    await el.updateComplete
    const head = globalThis.document.head
    let link = head.querySelector('link[property="oer:forComponent"]')
    expect(link).to.exist
    expect(link.getAttribute('content')).to.equal('course-123')
    // changing it swaps the link rather than duplicating it
    el.relatedResource = 'course-456'
    await el.updateComplete
    const links = head.querySelectorAll('link[property="oer:forComponent"]')
    expect(links.length).to.equal(1)
    expect(links[0].getAttribute('content')).to.equal('course-456')
    // clean up the injected head link
    head.removeChild(links[0])
  })

  it('exposes haxProperties with schema driven settings', () => {
    const props = OerSchemaElement.haxProperties
    expect(props.canScale).to.be.false
    expect(props.gizmo.title).to.equal('Schema')
    expect(props.gizmo.meta.inlineOnly).to.be.true
    const configure = props.settings.configure
    expect(configure.length).to.equal(4)
    const typeofSetting = configure.find((s) => s.property === 'typeof')
    expect(typeofSetting.options['oer:Course']).to.equal('Course')
    expect(typeofSetting.options['oer:Task']).to.equal('Task')
    // the root default typeof value is not offered, see lib test BUG notes
    expect(typeofSetting.options['oer:Resource']).to.be.undefined
    // rubric and material types come from the additional types list
    expect(typeofSetting.options['oer:Rubric']).to.equal('Rubric')
    expect(typeofSetting.options['oer:RubricLevel']).to.equal('RubricLevel')
    expect(typeofSetting.options['oer:SupportingMaterial']).to.equal(
      'SupportingMaterial',
    )
    // non-instructional types are not selectable
    expect(typeofSetting.options['oer:Person']).to.be.undefined
    const oerSetting = configure.find((s) => s.property === 'oerProperty')
    expect(oerSetting.options.forCourse).to.equal('forCourse')
    expect(oerSetting.options.aiUsageConstraint).to.equal('aiUsageConstraint')
    expect(Object.keys(oerSetting.options).length >= 20).to.be.true
    expect(props.saveOptions.unsetAttributes).to.deep.equal(['_oerlink'])
  })
});

/*
describe("A11y/chai axe tests", () => {
  it("oer-schema passes accessibility test", async () => {
    const el = await fixture(html` <oer-schema></oer-schema> `);
    await expect(el).to.be.accessible();
  });
  it("oer-schema passes accessibility negation", async () => {
    const el = await fixture(
      html`<oer-schema aria-labelledby="oer-schema"></oer-schema>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("oer-schema can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<oer-schema .foo=${'bar'}></oer-schema>`);
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
      const el = await fixture(html`<oer-schema ></oer-schema>`);
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
      const el = await fixture(html`<oer-schema></oer-schema>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<oer-schema></oer-schema>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
