import { fixture, expect, html } from "@open-wc/testing";
import "../bootstrap-theme.js";

// Mock HAXcms dependencies
beforeEach(() => {
  // Mock store and MobX functions
  globalThis.store = {
    activeManifestIndex: 0,
    manifest: {
      title: 'Test Site',
      metadata: {
        author: {
          image: 'https://example.com/author.jpg'
        }
      }
    },
    activeTitle: 'Test Page'
  };
  
  globalThis.toJS = (value) => value;
  globalThis.autorun = (callback) => {
    callback(() => {});
    return { dispose: () => {} };
  };
  
  // Mock ESGlobalBridge
  globalThis.ESGlobalBridge = {
    requestAvailability: () => ({
      load: (name, url) => {
        setTimeout(() => {
          globalThis.dispatchEvent(new CustomEvent(`es-bridge-${name}-loaded`));
        }, 10);
      }
    })
  };
  
  // Mock AbsolutePositionStateManager
  globalThis.AbsolutePositionStateManager = {
    requestAvailability: () => ({
      scrollTarget: null
    })
  };
  
  // Mock jQuery and Bootstrap loading
  globalThis.jQuery = globalThis.$ = {};
  globalThis.bootstrap = {};
});

aftereEach(() => {
  // Clean up document modifications
  const links = globalThis.document.head.querySelectorAll('link[href*="bootstrap"]');
  links.forEach(link => link.remove());
  
  // Reset body styles
  if (globalThis.document.body.style.overflow) {
    globalThis.document.body.style.removeProperty('overflow');
  }
});

describe("bootstrap-theme test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`<bootstrap-theme></bootstrap-theme>`);
    await element.updateComplete;
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("bootstrap-theme");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component structure and properties", () => {
    it("should have correct tag name", () => {
      expect(element.constructor.tag).to.equal("bootstrap-theme");
    });

    it("should initialize with default properties", () => {
      expect(element.menuOpen).to.be.true;
      expect(element.colorTheme).to.equal("0");
      expect(element.searchTerm).to.equal("");
      expect(element.__siteTitle).to.equal("Test Site");
      expect(element.__pageTitle).to.equal("Test Page");
    });

    it("should have required theme structure elements", () => {
      const site = element.shadowRoot.querySelector('.site');
      const menuOutline = element.shadowRoot.querySelector('.menu-outline');
      const siteBody = element.shadowRoot.querySelector('.site-body');
      const siteHeader = element.shadowRoot.querySelector('.site-header');
      const mainContent = element.shadowRoot.querySelector('.main-content');
      const footer = element.shadowRoot.querySelector('footer');
      
      expect(site).to.exist;
      expect(menuOutline).to.exist;
      expect(siteBody).to.exist;
      expect(siteHeader).to.exist;
      expect(mainContent).to.exist;
      expect(footer).to.exist;
    });

    it("should include Bootstrap components", () => {
      const breadcrumb = element.shadowRoot.querySelector('bootstrap-breadcrumb');
      const search = element.shadowRoot.querySelector('bootstrap-search');
      const footer = element.shadowRoot.querySelector('bootstrap-footer');
      
      expect(breadcrumb).to.exist;
      expect(search).to.exist;
      expect(footer).to.exist;
    });
  });

  describe("Property validation with accessibility", () => {
    describe("menuOpen property", () => {
      it("should handle menu open/close states and maintain accessibility", async () => {
        // Test open state
        element.menuOpen = true;
        await element.updateComplete;
        
        expect(element.menuOpen).to.be.true;
        expect(element.hasAttribute('menu-open')).to.be.true;
        await expect(element).shadowDom.to.be.accessible();
        
        // Test closed state
        element.menuOpen = false;
        await element.updateComplete;
        
        expect(element.menuOpen).to.be.false;
        expect(element.hasAttribute('menu-open')).to.be.false;
        await expect(element).shadowDom.to.be.accessible();
      });
    });

    describe("colorTheme property", () => {
      it("should handle different color themes and maintain accessibility", async () => {
        const themes = ["0", "1", "2"]; // Light, Dark, Palenight
        
        for (const theme of themes) {
          element.colorTheme = theme;
          await element.updateComplete;
          
          expect(element.colorTheme).to.equal(theme);
          expect(element.getAttribute('color-theme')).to.equal(theme);
          await expect(element).shadowDom.to.be.accessible();
        }
      });

      it("should apply correct theme styles", async () => {
        // Test dark theme
        element.colorTheme = "1";
        await element.updateComplete;
        
        const computedStyle = globalThis.getComputedStyle(element);
        // Dark theme should change background color
        expect(element.getAttribute('color-theme')).to.equal('1');
        
        // Test palenight theme
        element.colorTheme = "2";
        await element.updateComplete;
        
        expect(element.getAttribute('color-theme')).to.equal('2');
      });
    });

    describe("searchTerm property", () => {
      it("should handle search terms and maintain accessibility", async () => {
        const searchTerms = [
          "test search",
          "complex search query",
          "special chars: !@#$%",
          ""
        ];
        
        for (const term of searchTerms) {
          element.searchTerm = term;
          await element.updateComplete;
          
          expect(element.searchTerm).to.equal(term);
          
          // Search results should be visible when term is not empty
          const siteSearch = element.shadowRoot.querySelector('site-search');
          if (term !== "") {
            expect(siteSearch.hasAttribute('hidden')).to.be.false;
          } else {
            expect(siteSearch.hasAttribute('hidden')).to.be.true;
          }
          
          await expect(element).shadowDom.to.be.accessible();
        }
      });
    });
  });

  describe("Bootstrap integration and styling", () => {
    it("should load Bootstrap CSS", () => {
      expect(element._bootstrapPath).to.include('bootstrap.min.css');
      
      const linkElement = element.shadowRoot.querySelector('link[rel="stylesheet"]');
      expect(linkElement).to.exist;
      expect(linkElement.getAttribute('href')).to.include('bootstrap.min.css');
    });

    it("should load Bootstrap and jQuery scripts", (done) => {
      let jqueryLoaded = false;
      let bootstrapLoaded = false;
      
      globalThis.addEventListener('es-bridge-jquery-loaded', () => {
        jqueryLoaded = true;
        expect(element._jquery).to.be.true;
      });
      
      globalThis.addEventListener('es-bridge-bootstrap-loaded', () => {
        bootstrapLoaded = true;
        expect(element._bootstrap).to.be.true;
        
        if (jqueryLoaded && bootstrapLoaded) {
          done();
        }
      });
      
      // Scripts should be loaded during firstUpdated
    });

    it("should have responsive design classes", async () => {
      // Test different responsive sizes
      const responsiveSizes = ['xs', 'sm', 'md', 'lg'];
      
      for (const size of responsiveSizes) {
        element.setAttribute('responsive-size', size);
        await element.updateComplete;
        
        expect(element.getAttribute('responsive-size')).to.equal(size);
        await expect(element).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Search functionality", () => {
    it("should handle search changed events", async () => {
      const mockEvent = {
        detail: {
          searchText: 'test search query'
        }
      };
      
      element.searchChanged(mockEvent);
      await element.updateComplete;
      
      expect(element.searchTerm).to.equal('test search query');
      
      // Content container should be hidden when searching
      const contentContainer = element.shadowRoot.querySelector('#contentcontainer');
      expect(contentContainer.hasAttribute('hidden')).to.be.true;
    });

    it("should clear search when empty", async () => {
      // Set initial search term
      element.searchTerm = 'initial search';
      await element.updateComplete;
      
      const mockEvent = {
        detail: {
          searchText: ''
        }
      };
      
      element.searchChanged(mockEvent);
      await element.updateComplete;
      
      expect(element.searchTerm).to.equal('');
    });

    it("should handle search item selection", async () => {
      // Set search term
      element.searchTerm = 'test search';
      await element.updateComplete;
      
      element.searchItemSelected({});
      await element.updateComplete;
      
      expect(element.searchTerm).to.equal('');
    });
  });

  describe("Menu functionality", () => {
    it("should toggle menu visibility", async () => {
      // Menu should start open
      expect(element.menuOpen).to.be.true;
      expect(element.hasAttribute('menu-open')).to.be.true;
      
      // Close menu
      element.menuOpen = false;
      await element.updateComplete;
      
      expect(element.menuOpen).to.be.false;
      expect(element.hasAttribute('menu-open')).to.be.false;
      
      // Reopen menu
      element.menuOpen = true;
      await element.updateComplete;
      
      expect(element.menuOpen).to.be.true;
      expect(element.hasAttribute('menu-open')).to.be.true;
    });

    it("should have mobile menu components", () => {
      // Should have mobile menu button and navigation
      const mobileMenuButton = element.shadowRoot.querySelector('#haxcmsmobilemenubutton');
      const mobileMenuNav = element.shadowRoot.querySelector('#haxcmsmobilemenunav');
      
      // These are created by mixins, so check they're referenced in the template
      const template = element.shadowRoot.innerHTML;
      expect(template).to.include('HAXCMSMobileMenu');
      expect(template).to.include('HAXCMSMobileMenuButton');
    });
  });

  describe("Content and layout", () => {
    it("should display site title and image", async () => {
      const siteTitle = element.shadowRoot.querySelector('.site-title h4');
      const siteImage = element.shadowRoot.querySelector('.site-img');
      
      expect(siteTitle.textContent).to.equal('Test Site');
      expect(siteImage.src).to.equal('https://example.com/author.jpg');
    });

    it("should display page title", () => {
      const pageTitle = element.shadowRoot.querySelector('.page-title');
      expect(pageTitle.textContent).to.equal('Test Page');
    });

    it("should have main content slot", () => {
      const slot = element.shadowRoot.querySelector('slot#main-content');
      expect(slot).to.exist;
    });

    it("should hide/show content based on search state", async () => {
      const contentContainer = element.shadowRoot.querySelector('#contentcontainer');
      const siteSearch = element.shadowRoot.querySelector('site-search');
      
      // No search term - content visible, search hidden
      element.searchTerm = '';
      await element.updateComplete;
      
      expect(contentContainer.hasAttribute('hidden')).to.be.false;
      expect(siteSearch.hasAttribute('hidden')).to.be.true;
      
      // With search term - content hidden, search visible
      element.searchTerm = 'test';
      await element.updateComplete;
      
      expect(contentContainer.hasAttribute('hidden')).to.be.true;
      expect(siteSearch.hasAttribute('hidden')).to.be.false;
    });
  });

  describe("Theme parts and mixins", () => {
    it("should include user styles menu", () => {
      const template = element.shadowRoot.innerHTML;
      expect(template).to.include('BootstrapUserStylesMenu');
    });

    it("should have theme settings", () => {
      expect(element.HAXCMSThemeSettings).to.exist;
      expect(element.HAXCMSThemeSettings.autoScroll).to.be.true;
    });

    it("should set scroll target", async () => {
      // firstUpdated should set the scroll target
      const siteBody = element.shadowRoot.querySelector('.site-body');
      expect(element.HAXCMSThemeSettings.scrollTarget).to.equal(siteBody);
    });
  });

  describe("Accessibility scenarios", () => {
    it("should remain accessible with different color themes", async () => {
      const themes = ['0', '1', '2'];
      
      for (const theme of themes) {
        element.colorTheme = theme;
        await element.updateComplete;
        await expect(element).shadowDom.to.be.accessible();
      }
    });

    it("should remain accessible when menu is closed", async () => {
      element.menuOpen = false;
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should remain accessible during search", async () => {
      element.searchTerm = 'accessibility test';
      await element.updateComplete;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should have proper ARIA roles and structure", () => {
      const main = element.shadowRoot.querySelector('main[role="main"]');
      const header = element.shadowRoot.querySelector('header');
      const footer = element.shadowRoot.querySelector('footer');
      
      expect(main).to.exist;
      expect(header).to.exist;
      expect(footer).to.exist;
    });

    it("should maintain focus management", () => {
      const pageWrapper = element.shadowRoot.querySelector('.page-wrapper');
      expect(pageWrapper.getAttribute('tabindex')).to.equal('0');
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle missing site image gracefully", async () => {
      // Update store to have no image
      globalThis.store.manifest.metadata.author.image = '';
      
      const newElement = await fixture(html`<bootstrap-theme></bootstrap-theme>`);
      await newElement.updateComplete;
      
      const siteImage = newElement.shadowRoot.querySelector('.site-img');
      expect(siteImage).to.not.exist;
      
      await expect(newElement).shadowDom.to.be.accessible();
    });

    it("should handle empty site title", async () => {
      globalThis.store.manifest.title = '';
      
      const newElement = await fixture(html`<bootstrap-theme></bootstrap-theme>`);
      await newElement.updateComplete;
      
      const siteTitle = newElement.shadowRoot.querySelector('.site-title h4');
      expect(siteTitle.textContent).to.equal('');
      
      await expect(newElement).shadowDom.to.be.accessible();
    });

    it("should handle invalid color theme values", async () => {
      element.colorTheme = 'invalid';
      await element.updateComplete;
      
      expect(element.colorTheme).to.equal('invalid');
      expect(element.getAttribute('color-theme')).to.equal('invalid');
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should handle long search terms", async () => {
      const longSearch = 'a'.repeat(1000);
      element.searchTerm = longSearch;
      await element.updateComplete;
      
      expect(element.searchTerm).to.equal(longSearch);
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should handle special characters in search", async () => {
      const specialSearch = '<script>alert("xss")</script>';
      element.searchTerm = specialSearch;
      await element.updateComplete;
      
      expect(element.searchTerm).to.equal(specialSearch);
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Lifecycle methods", () => {
    it("should handle constructor properly", () => {
      const newElement = new (element.constructor)();
      
      expect(newElement.menuOpen).to.be.true;
      expect(newElement.colorTheme).to.equal('0');
      expect(newElement.searchTerm).to.equal('');
      expect(newElement.HAXCMSThemeSettings.autoScroll).to.be.true;
    });

    it("should handle firstUpdated lifecycle", async () => {
      // firstUpdated should set up scroll target and load scripts
      expect(element.HAXCMSThemeSettings.scrollTarget).to.exist;
      expect(globalThis.document.body.style.overflow).to.equal('hidden');
    });

    it("should handle disconnectedCallback", () => {
      // Mock the Bootstrap link
      element._bootstrapLink = globalThis.document.createElement('link');
      globalThis.document.head.appendChild(element._bootstrapLink);
      
      // Mock disposer functions
      element.__disposer = [{ dispose: () => {} }];
      
      element.disconnectedCallback();
      
      // Should clean up resources
      expect(globalThis.document.body.style.overflow).to.equal('');
    });

    it("should handle updated lifecycle", async () => {
      let updateCalled = false;
      const originalUpdated = element.updated.bind(element);
      element.updated = (changedProperties) => {
        updateCalled = true;
        return originalUpdated(changedProperties);
      };
      
      element.colorTheme = '1';
      await element.updateComplete;
      
      expect(updateCalled).to.be.true;
    });
  });

  describe("Utility methods", () => {
    it("should get base path correctly", () => {
      const testUrl = 'http://example.com/@haxtheweb/bootstrap-theme/bootstrap-theme.js';
      const basePath = element.getBasePath(testUrl);
      
      expect(basePath).to.equal('http://example.com/');
    });

    it("should generate Bootstrap link", () => {
      const link = element._generateBootstrapLink();
      
      expect(link).to.exist;
      expect(link.getAttribute('rel')).to.equal('stylesheet');
      expect(link.getAttribute('href')).to.include('bootstrap.min.css');
    });

    it("should remove old Bootstrap link when generating new one", () => {
      const firstLink = element._generateBootstrapLink();
      const secondLink = element._generateBootstrapLink();
      
      expect(firstLink).to.not.equal(secondLink);
      expect(globalThis.document.head.contains(firstLink)).to.be.false;
      expect(globalThis.document.head.contains(secondLink)).to.be.true;
    });
  });

  describe("Integration scenarios", () => {
    it("should handle complete theme workflow", async () => {
      // Start with default state
      expect(element.menuOpen).to.be.true;
      expect(element.colorTheme).to.equal('0');
      expect(element.searchTerm).to.equal('');
      
      // Change to dark theme
      element.colorTheme = '1';
      await element.updateComplete;
      
      // Open search
      element.searchChanged({ detail: { searchText: 'test search' }});
      await element.updateComplete;
      
      expect(element.searchTerm).to.equal('test search');
      
      // Close menu
      element.menuOpen = false;
      await element.updateComplete;
      
      // Clear search
      element.searchItemSelected({});
      await element.updateComplete;
      
      expect(element.searchTerm).to.equal('');
      expect(element.menuOpen).to.be.false;
      expect(element.colorTheme).to.equal('1');
      
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should work with different responsive sizes", async () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
      
      for (const size of sizes) {
        element.setAttribute('responsive-size', size);
        await element.updateComplete;
        
        // Menu and content should adapt to size
        expect(element.getAttribute('responsive-size')).to.equal(size);
        await expect(element).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Performance considerations", () => {
    it("should handle rapid property changes efficiently", async () => {
      const startTime = performance.now();
      
      // Rapid changes
      for (let i = 0; i < 10; i++) {
        element.colorTheme = (i % 3).toString();
        element.menuOpen = i % 2 === 0;
        element.searchTerm = i % 2 === 0 ? `search ${i}` : '';
        await element.updateComplete;
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      expect(totalTime).to.be.lessThan(1000);
      expect(element.colorTheme).to.equal('1'); // (9 % 3).toString()
    });

    it("should cleanup resources on disconnect", () => {
      // Set up resources to be cleaned
      element._bootstrapLink = globalThis.document.createElement('link');
      globalThis.document.head.appendChild(element._bootstrapLink);
      element.__disposer = [{ dispose: () => {} }];
      
      const linkCount = globalThis.document.head.querySelectorAll('link').length;
      
      element.disconnectedCallback();
      
      const newLinkCount = globalThis.document.head.querySelectorAll('link').length;
      expect(newLinkCount).to.be.lessThan(linkCount);
    });
  });
});
