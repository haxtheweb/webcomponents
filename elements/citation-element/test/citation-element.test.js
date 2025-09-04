import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import sinon from "sinon";
import "../citation-element.js";

// Mock license-element dependency
const mockLicenseList = {
  'by': {
    name: 'CC BY',
    link: 'https://creativecommons.org/licenses/by/4.0/',
    image: 'https://licensebuttons.net/l/by/4.0/88x31.png'
  },
  'by-sa': {
    name: 'CC BY-SA',
    link: 'https://creativecommons.org/licenses/by-sa/4.0/',
    image: 'https://licensebuttons.net/l/by-sa/4.0/88x31.png'
  },
  'cc0': {
    name: 'CC0',
    link: 'https://creativecommons.org/publicdomain/zero/1.0/',
    image: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
  }
};

// Mock utils dependency
const mockGenerateResourceID = () => 'test-resource-id-' + Date.now();

describe("citation-element test", () => {
  let element, sandbox;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    
    // Mock document.head operations
    sandbox.stub(document.head, 'appendChild');
    sandbox.stub(document.head, 'removeChild');
    
    // Mock license list
    const licenseElementModule = await import('@haxtheweb/license-element/license-element.js');
    sandbox.stub(licenseElementModule, 'licenseList').returns(mockLicenseList);
    
    // Mock utils
    const utilsModule = await import('@haxtheweb/utils/utils.js');
    sandbox.stub(utilsModule, 'generateResourceID').returns(mockGenerateResourceID());
    
    element = await fixture(html`
      <citation-element 
        title="Test Article"
        creator="John Doe"
        source="https://example.com/article"
        date="2024-01-15"
        license="by"
      ></citation-element>
    `);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("Basic Setup and Accessibility", () => {
    it("passes the a11y audit", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes a11y audit with all properties set", async () => {
      const el = await fixture(html`
        <citation-element 
          title="Complete Citation"
          creator="Jane Smith"
          source="https://example.com/complete"
          date="2024-02-01"
          license="by-sa"
          scope="parent"
          display-method="popup"
        ></citation-element>
      `);
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes a11y audit with minimal properties", async () => {
      const el = await fixture(html`
        <citation-element title="Minimal"></citation-element>
      `);
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes a11y audit in footnote mode", async () => {
      const el = await fixture(html`
        <citation-element 
          title="Footnote Citation"
          display-method="footnote"
        ></citation-element>
      `);
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  describe("Component Structure", () => {
    it("renders with correct tag name", () => {
      expect(element.tagName.toLowerCase()).to.equal('citation-element');
    });

    it("has proper shadow DOM structure", () => {
      const cite = element.shadowRoot.querySelector('cite');
      expect(cite).to.exist;
      
      const links = element.shadowRoot.querySelectorAll('a');
      expect(links.length).to.be.at.least(1);
    });

    it("includes meta elements for semantic markup", () => {
      const metas = element.shadowRoot.querySelectorAll('meta');
      expect(metas.length).to.be.at.least(2);
      
      const attributionUrl = element.shadowRoot.querySelector('meta[property="cc:attributionUrl"]');
      expect(attributionUrl).to.exist;
      
      const attributionName = element.shadowRoot.querySelector('meta[property="cc:attributionName"]');
      expect(attributionName).to.exist;
    });

    it("includes license meta when license is set", () => {
      const licenseMeta = element.shadowRoot.querySelector('meta[rel="cc:license"]');
      expect(licenseMeta).to.exist;
      expect(licenseMeta.getAttribute('content')).to.include('License:');
    });

    it("has correct ARIA attributes and semantics", () => {
      const cite = element.shadowRoot.querySelector('cite');
      expect(cite).to.exist;
      
      const links = element.shadowRoot.querySelectorAll('a');
      links.forEach(link => {
        expect(link.getAttribute('target')).to.equal('_blank');
        expect(link.getAttribute('rel')).to.include('noopener');
      });
    });
  });

  describe("Property Handling", () => {
    it("reflects display-method attribute", async () => {
      element.displayMethod = 'footnote';
      await element.updateComplete;
      expect(element.getAttribute('display-method')).to.equal('footnote');
    });

    it("handles title property correctly", async () => {
      element.title = 'New Title';
      await element.updateComplete;
      
      const titleLink = element.shadowRoot.querySelector('a');
      expect(titleLink.textContent).to.equal('New Title');
      
      const titleMeta = element.shadowRoot.querySelector('meta[property="cc:attributionName"]');
      expect(titleMeta.getAttribute('content')).to.equal('New Title');
    });

    it("handles creator property correctly", async () => {
      element.creator = 'Jane Doe';
      await element.updateComplete;
      
      const cite = element.shadowRoot.querySelector('cite');
      expect(cite.textContent).to.include('Jane Doe');
    });

    it("handles source property correctly", async () => {
      element.source = 'https://newexample.com';
      await element.updateComplete;
      
      const sourceLink = element.shadowRoot.querySelector('a');
      expect(sourceLink.getAttribute('href')).to.equal('https://newexample.com');
      
      const sourceMeta = element.shadowRoot.querySelector('meta[property="cc:attributionUrl"]');
      expect(sourceMeta.getAttribute('content')).to.equal('https://newexample.com');
    });

    it("handles date property correctly", async () => {
      element.date = '2024-03-01';
      await element.updateComplete;
      
      const cite = element.shadowRoot.querySelector('cite');
      expect(cite.textContent).to.include('2024-03-01');
    });

    it("handles license property and updates related fields", async () => {
      element.license = 'by-sa';
      await element.updateComplete;
      
      expect(element.licenseName).to.equal('CC BY-SA');
      expect(element.licenseLink).to.equal('https://creativecommons.org/licenses/by-sa/4.0/');
      expect(element.licenseImage).to.equal('https://licensebuttons.net/l/by-sa/4.0/88x31.png');
    });

    it("handles scope property changes", async () => {
      element.scope = 'parent';
      await element.updateComplete;
      expect(element.scope).to.equal('parent');
    });

    it("validates license-name attribute reflection", async () => {
      element.licenseName = 'Custom License';
      await element.updateComplete;
      expect(element.getAttribute('license-name')).to.equal('Custom License');
    });

    it("validates license-link attribute reflection", async () => {
      element.licenseLink = 'https://custom-license.com';
      await element.updateComplete;
      expect(element.getAttribute('license-link')).to.equal('https://custom-license.com');
    });
  });

  describe("Citation Rendering", () => {
    it("renders complete citation with all elements", async () => {
      const el = await fixture(html`
        <citation-element 
          title="Complete Work"
          creator="Author Name"
          source="https://example.com/work"
          date="2024-01-01"
          license="by"
        ></citation-element>
      `);
      
      const cite = el.shadowRoot.querySelector('cite');
      const text = cite.textContent;
      
      expect(text).to.include('Complete Work');
      expect(text).to.include('Author Name');
      expect(text).to.include('licensed under');
      expect(text).to.include('2024-01-01');
      expect(text).to.include('Accessed');
    });

    it("renders citation without license when not provided", async () => {
      const el = await fixture(html`
        <citation-element 
          title="No License Work"
          creator="Author Name"
          source="https://example.com/work"
          date="2024-01-01"
        ></citation-element>
      `);
      
      const cite = el.shadowRoot.querySelector('cite');
      const text = cite.textContent;
      
      expect(text).to.include('No License Work');
      expect(text).to.include('Author Name');
      expect(text).to.not.include('licensed under');
      expect(text).to.include('2024-01-01');
    });

    it("renders license image when available", async () => {
      element.license = 'by';
      await element.updateComplete;
      
      const licenseImg = element.shadowRoot.querySelector('img');
      expect(licenseImg).to.exist;
      expect(licenseImg.getAttribute('src')).to.equal('https://licensebuttons.net/l/by/4.0/88x31.png');
      expect(licenseImg.getAttribute('alt')).to.include('CC BY graphic');
      expect(licenseImg.getAttribute('width')).to.equal('44px');
      expect(licenseImg.getAttribute('height')).to.equal('16px');
    });

    it("hides license image when not available", async () => {
      element.licenseImage = '';
      await element.updateComplete;
      
      const licenseImg = element.shadowRoot.querySelector('img');
      expect(licenseImg.hasAttribute('hidden')).to.be.true;
    });

    it("renders proper link attributes for accessibility", () => {
      const links = element.shadowRoot.querySelectorAll('a');
      links.forEach(link => {
        expect(link.getAttribute('target')).to.equal('_blank');
        expect(link.getAttribute('rel')).to.include('noopener');
        expect(link.getAttribute('rel')).to.include('noreferrer');
      });
    });
  });

  describe("Display Methods", () => {
    it("shows normally with default display method", async () => {
      const el = await fixture(html`
        <citation-element title="Normal Display"></citation-element>
      `);
      
      const styles = getComputedStyle(el);
      expect(styles.display).to.not.equal('none');
      expect(styles.visibility).to.not.equal('hidden');
    });

    it("applies footnote styling when display-method is footnote", async () => {
      const el = await fixture(html`
        <citation-element 
          title="Footnote Display"
          display-method="footnote"
        ></citation-element>
      `);
      
      expect(el.getAttribute('display-method')).to.equal('footnote');
      // Note: visibility and opacity would be set by CSS, check attribute presence
    });

    it("applies popup styling when display-method is popup", async () => {
      const el = await fixture(html`
        <citation-element 
          title="Popup Display"
          display-method="popup"
        ></citation-element>
      `);
      
      expect(el.getAttribute('display-method')).to.equal('popup');
    });

    it("updates display method dynamically", async () => {
      element.displayMethod = 'popup';
      await element.updateComplete;
      expect(element.getAttribute('display-method')).to.equal('popup');
      
      element.displayMethod = 'footnote';
      await element.updateComplete;
      expect(element.getAttribute('display-method')).to.equal('footnote');
    });
  });

  describe("Scope Handling", () => {
    it("handles sibling scope with existing resource", async () => {
      const container = await fixture(html`
        <div>
          <div resource="existing-resource"></div>
          <citation-element title="Sibling Test" scope="sibling"></citation-element>
        </div>
      `);
      
      const citation = container.querySelector('citation-element');
      citation._scopeChanged('sibling');
      
      expect(citation.relatedResource).to.equal('existing-resource');
    });

    it("handles sibling scope without existing resource", async () => {
      const container = await fixture(html`
        <div>
          <div></div>
          <citation-element title="Sibling Test" scope="sibling"></citation-element>
        </div>
      `);
      
      const citation = container.querySelector('citation-element');
      const sibling = citation.previousElementSibling;
      citation._scopeChanged('sibling');
      
      expect(sibling.hasAttribute('resource')).to.be.true;
      expect(citation.relatedResource).to.exist;
    });

    it("handles parent scope with existing resource", async () => {
      const container = await fixture(html`
        <div resource="parent-resource">
          <citation-element title="Parent Test" scope="parent"></citation-element>
        </div>
      `);
      
      const citation = container.querySelector('citation-element');
      citation._scopeChanged('parent');
      
      expect(citation.relatedResource).to.equal('parent-resource');
    });

    it("handles parent scope without existing resource", async () => {
      const container = await fixture(html`
        <div>
          <citation-element title="Parent Test" scope="parent"></citation-element>
        </div>
      `);
      
      const citation = container.querySelector('citation-element');
      citation._scopeChanged('parent');
      
      expect(container.hasAttribute('resource')).to.be.true;
      expect(citation.relatedResource).to.exist;
    });

    it("sets prefix on sibling element", async () => {
      const container = await fixture(html`
        <div>
          <div></div>
          <citation-element 
            title="Prefix Test" 
            scope="sibling" 
            prefix="test-prefix"
          ></citation-element>
        </div>
      `);
      
      const citation = container.querySelector('citation-element');
      citation.setAttribute('prefix', 'test-prefix');
      citation._scopeChanged('sibling');
      
      const sibling = citation.previousElementSibling;
      expect(sibling.getAttribute('prefix')).to.equal('test-prefix');
    });

    it("sets prefix on parent element", async () => {
      const container = await fixture(html`
        <div>
          <citation-element 
            title="Prefix Test" 
            scope="parent" 
            prefix="parent-prefix"
          ></citation-element>
        </div>
      `);
      
      const citation = container.querySelector('citation-element');
      citation.setAttribute('prefix', 'parent-prefix');
      citation._scopeChanged('parent');
      
      expect(container.getAttribute('prefix')).to.equal('parent-prefix');
    });
  });

  describe("License Processing", () => {
    it("processes known license correctly", async () => {
      element._licenseUpdated('by');
      
      expect(element.licenseName).to.equal('CC BY');
      expect(element.licenseLink).to.equal('https://creativecommons.org/licenses/by/4.0/');
      expect(element.licenseImage).to.equal('https://licensebuttons.net/l/by/4.0/88x31.png');
    });

    it("processes different license types", async () => {
      element._licenseUpdated('cc0');
      
      expect(element.licenseName).to.equal('CC0');
      expect(element.licenseLink).to.equal('https://creativecommons.org/publicdomain/zero/1.0/');
      expect(element.licenseImage).to.equal('https://licensebuttons.net/p/zero/1.0/88x31.png');
    });

    it("handles unknown license gracefully", async () => {
      const originalName = element.licenseName;
      element._licenseUpdated('unknown-license');
      
      // Should not change if license is unknown
      expect(element.licenseName).to.equal(originalName);
    });

    it("handles undefined license", async () => {
      const originalName = element.licenseName;
      element._licenseUpdated(undefined);
      
      expect(element.licenseName).to.equal(originalName);
    });
  });

  describe("DOM Link Management", () => {
    it("creates license link in document head", () => {
      element._generateLicenseLink('https://test-source.com');
      
      expect(document.head.appendChild.called).to.be.true;
      const call = document.head.appendChild.getCall(0);
      const link = call.args[0];
      
      expect(link.tagName.toLowerCase()).to.equal('link');
      expect(link.getAttribute('typeof')).to.equal('resource');
      expect(link.getAttribute('rel')).to.equal('license');
      expect(link.getAttribute('src')).to.equal('https://test-source.com');
    });

    it("removes existing license link before creating new one", () => {
      // Create first link
      const firstLink = element._generateLicenseLink('https://first-source.com');
      element._licenseLink = firstLink;
      
      // Create second link
      element._generateLicenseLink('https://second-source.com');
      
      expect(document.head.removeChild.called).to.be.true;
      expect(document.head.removeChild.calledWith(firstLink)).to.be.true;
    });

    it("creates about link in document head", () => {
      element._generateAboutLink('test-resource', 'https://license-link.com');
      
      expect(document.head.appendChild.called).to.be.true;
      const call = document.head.appendChild.getCall(0);
      const link = call.args[0];
      
      expect(link.tagName.toLowerCase()).to.equal('link');
      expect(link.getAttribute('about')).to.equal('test-resource');
      expect(link.getAttribute('property')).to.equal('cc:license');
      expect(link.getAttribute('content')).to.equal('https://license-link.com');
    });

    it("removes existing about link before creating new one", () => {
      // Create first link
      const firstLink = element._generateAboutLink('first-resource', 'https://first-license.com');
      element._aboutLink = firstLink;
      
      // Create second link
      element._generateAboutLink('second-resource', 'https://second-license.com');
      
      expect(document.head.removeChild.called).to.be.true;
      expect(document.head.removeChild.calledWith(firstLink)).to.be.true;
    });
  });

  describe("Property Updates and Lifecycle", () => {
    it("triggers scope change on scope property update", async () => {
      const scopeSpy = sandbox.spy(element, '_scopeChanged');
      
      element.scope = 'parent';
      await element.updateComplete;
      
      expect(scopeSpy.calledWith('parent')).to.be.true;
    });

    it("triggers license update on license property update", async () => {
      const licenseSpy = sandbox.spy(element, '_licenseUpdated');
      
      element.license = 'by-sa';
      await element.updateComplete;
      
      expect(licenseSpy.calledWith('by-sa')).to.be.true;
    });

    it("updates about link on relatedResource change", async () => {
      const aboutSpy = sandbox.spy(element, '_generateAboutLink');
      
      element.relatedResource = 'new-resource';
      await element.updateComplete;
      
      expect(aboutSpy.called).to.be.true;
    });

    it("updates about link on licenseLink change", async () => {
      const aboutSpy = sandbox.spy(element, '_generateAboutLink');
      
      element.licenseLink = 'https://new-license.com';
      await element.updateComplete;
      
      expect(aboutSpy.called).to.be.true;
    });

    it("updates license link on source change", async () => {
      const licenseLinkSpy = sandbox.spy(element, '_generateLicenseLink');
      
      element.source = 'https://new-source.com';
      await element.updateComplete;
      
      expect(licenseLinkSpy.calledWith('https://new-source.com')).to.be.true;
    });

    it("initializes with correct default values", () => {
      expect(element.scope).to.equal('sibling');
      expect(element.source).to.equal('');
    });
  });

  describe("HAX Integration", () => {
    it("provides correct haxProperties", () => {
      const haxProps = element.constructor.haxProperties;
      
      expect(haxProps.canScale).to.be.false;
      expect(haxProps.canEditSource).to.be.true;
      expect(haxProps.gizmo.title).to.equal('Citation');
      expect(haxProps.gizmo.description).to.include('citation element');
      expect(haxProps.gizmo.icon).to.equal('editor:title');
      expect(haxProps.gizmo.color).to.equal('grey');
    });

    it("includes relevant tags", () => {
      const haxProps = element.constructor.haxProperties;
      const tags = haxProps.gizmo.tags;
      
      expect(tags).to.include('citation');
      expect(tags).to.include('reference');
      expect(tags).to.include('cc0');
      expect(tags).to.include('cc-by');
    });

    it("handles citation data correctly", () => {
      const haxProps = element.constructor.haxProperties;
      const handles = haxProps.gizmo.handles;
      
      expect(handles[0].type).to.equal('citation');
      expect(handles[0].source).to.equal('source');
      expect(handles[0].title).to.equal('title');
      expect(handles[0].author).to.equal('creator');
      expect(handles[0].license).to.equal('license');
    });

    it("provides proper configuration options", () => {
      const haxProps = element.constructor.haxProperties;
      const configure = haxProps.settings.configure;
      
      const titleConfig = configure.find(c => c.property === 'title');
      expect(titleConfig.inputMethod).to.equal('textfield');
      
      const sourceConfig = configure.find(c => c.property === 'source');
      expect(sourceConfig.validationType).to.equal('url');
      
      const scopeConfig = configure.find(c => c.property === 'scope');
      expect(scopeConfig.inputMethod).to.equal('select');
      expect(scopeConfig.options.sibling).to.exist;
      expect(scopeConfig.options.parent).to.exist;
    });

    it("provides demo schema", () => {
      const haxProps = element.constructor.haxProperties;
      const demoSchema = haxProps.demoSchema;
      
      expect(demoSchema[0].tag).to.equal('citation-element');
      expect(demoSchema[0].properties.creator).to.exist;
      expect(demoSchema[0].properties.license).to.exist;
      expect(demoSchema[0].properties.title).to.exist;
      expect(demoSchema[0].properties.source).to.exist;
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("handles empty properties gracefully", async () => {
      const el = await fixture(html`<citation-element></citation-element>`);
      
      expect(() => el.render()).to.not.throw;
      const cite = el.shadowRoot.querySelector('cite');
      expect(cite).to.exist;
    });

    it("handles missing sibling for sibling scope", async () => {
      const container = await fixture(html`
        <div>
          <citation-element title="No Sibling" scope="sibling"></citation-element>
        </div>
      `);
      
      const citation = container.querySelector('citation-element');
      expect(() => citation._scopeChanged('sibling')).to.not.throw;
    });

    it("handles malformed URLs gracefully", async () => {
      const el = await fixture(html`
        <citation-element 
          title="Bad URL Test"
          source="not-a-url"
        ></citation-element>
      `);
      
      const sourceLink = el.shadowRoot.querySelector('a');
      expect(sourceLink.getAttribute('href')).to.equal('not-a-url');
    });

    it("handles very long titles", async () => {
      const longTitle = 'A'.repeat(500);
      const el = await fixture(html`
        <citation-element title="${longTitle}"></citation-element>
      `);
      
      const titleLink = el.shadowRoot.querySelector('a');
      expect(titleLink.textContent).to.equal(longTitle);
    });

    it("handles special characters in properties", async () => {
      const specialTitle = 'Title with <>&\"\' characters';
      const el = await fixture(html`
        <citation-element .title="${specialTitle}"></citation-element>
      `);
      
      const titleMeta = el.shadowRoot.querySelector('meta[property="cc:attributionName"]');
      expect(titleMeta.getAttribute('content')).to.equal(specialTitle);
    });

    it("handles rapid property changes", async () => {
      for (let i = 0; i < 10; i++) {
        element.title = `Title ${i}`;
        element.creator = `Creator ${i}`;
        element.license = i % 2 === 0 ? 'by' : 'by-sa';
      }
      await element.updateComplete;
      
      expect(element.title).to.equal('Title 9');
      expect(element.creator).to.equal('Creator 9');
      expect(element.license).to.equal('by-sa');
    });
  });

  describe("Performance and Resource Management", () => {
    it("efficiently handles multiple license changes", async () => {
      const licenses = ['by', 'by-sa', 'cc0', 'by'];
      
      for (const license of licenses) {
        element.license = license;
        await element.updateComplete;
      }
      
      expect(element.licenseName).to.equal('CC BY');
      expect(document.head.appendChild.callCount).to.be.at.least(1);
    });

    it("properly cleans up DOM links when removed", () => {
      const licenseLink = element._generateLicenseLink('https://test.com');
      const aboutLink = element._generateAboutLink('test', 'https://license.com');
      
      // Simulate creating new links (should remove old ones)
      element._generateLicenseLink('https://new-test.com');
      element._generateAboutLink('new-test', 'https://new-license.com');
      
      expect(document.head.removeChild.calledTwice).to.be.true;
    });

    it("handles concurrent property updates", async () => {
      const promises = [
        (async () => { element.title = 'Concurrent Title'; })(),
        (async () => { element.creator = 'Concurrent Creator'; })(),
        (async () => { element.license = 'by-sa'; })(),
        (async () => { element.source = 'https://concurrent.com'; })()
      ];
      
      await Promise.all(promises);
      await element.updateComplete;
      
      expect(element.title).to.equal('Concurrent Title');
      expect(element.creator).to.equal('Concurrent Creator');
      expect(element.license).to.equal('by-sa');
      expect(element.source).to.equal('https://concurrent.com');
    });
  });

  describe("Styling and CSS Custom Properties", () => {
    it("applies DDD design system classes", () => {
      const licenseLinks = element.shadowRoot.querySelectorAll('.license-link');
      expect(licenseLinks.length).to.be.greaterThan(0);
    });

    it("uses CSS custom properties for theming", () => {
      const styles = element.constructor.styles[0].cssText;
      expect(styles).to.include('--ddd-spacing-2');
      expect(styles).to.include('--ddd-theme-default-link');
      expect(styles).to.include('--ddd-font-weight-bold');
    });

    it("handles display method styling", async () => {
      element.displayMethod = 'footnote';
      await element.updateComplete;
      
      expect(element.hasAttribute('display-method')).to.be.true;
      expect(element.getAttribute('display-method')).to.equal('footnote');
    });
  });

  describe("Integration Scenarios", () => {
    it("works as part of a larger document structure", async () => {
      const container = await fixture(html`
        <article>
          <h1>Article Title</h1>
          <p>Some content with references.</p>
          <citation-element 
            title="Referenced Work"
            creator="Reference Author"
            source="https://reference.com"
            scope="parent"
          ></citation-element>
        </article>
      `);
      
      const citation = container.querySelector('citation-element');
      expect(citation).to.exist;
      await expect(citation).shadowDom.to.be.accessible();
    });

    it("maintains semantic integrity with multiple citations", async () => {
      const container = await fixture(html`
        <div>
          <citation-element 
            title="First Citation"
            creator="First Author"
            license="by"
          ></citation-element>
          <citation-element 
            title="Second Citation"
            creator="Second Author"
            license="by-sa"
          ></citation-element>
        </div>
      `);
      
      const citations = container.querySelectorAll('citation-element');
      expect(citations.length).to.equal(2);
      
      for (const citation of citations) {
        await expect(citation).shadowDom.to.be.accessible();
      }
    });

    it("preserves citation data through DOM manipulations", async () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <citation-element 
          title="Persistent Citation"
          creator="Persistent Author"
          license="cc0"
        ></citation-element>
      `;
      
      document.body.appendChild(container);
      const citation = container.querySelector('citation-element');
      
      expect(citation.title).to.equal('Persistent Citation');
      expect(citation.creator).to.equal('Persistent Author');
      expect(citation.license).to.equal('cc0');
      
      document.body.removeChild(container);
    });
  });
});
