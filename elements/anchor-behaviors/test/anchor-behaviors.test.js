import { expect } from "@open-wc/testing";
import "../anchor-behaviors.js";

describe("anchor-behaviors utility test", () => {
  let originalLocation;
  let originalDocument;
  let mockElement;
  
  beforeEach(() => {
    // Backup original globals
    originalLocation = globalThis.location;
    originalDocument = globalThis.document;
    
    // Reset AnchorBehaviors state
    delete globalThis.AnchorBehaviors.target;
    delete globalThis.AnchorBehaviors.params;
    
    // Create mock element for testing
    mockElement = {
      id: 'test-element',
      resource: null,
      scrollIntoView: () => {}
    };
    
    // Mock document methods
    globalThis.document = {
      readyState: 'complete',
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => []
    };
  });
  
  afterEach(() => {
    // Restore original globals
    globalThis.location = originalLocation;
    globalThis.document = originalDocument;
    
    // Clean up AnchorBehaviors state
    delete globalThis.AnchorBehaviors.target;
    delete globalThis.AnchorBehaviors.params;
  });

  describe("Global namespace setup", () => {
    it("should create global AnchorBehaviors object", () => {
      expect(globalThis.AnchorBehaviors).to.exist;
      expect(globalThis.AnchorBehaviors).to.be.an('object');
    });

    it("should expose getTarget function", () => {
      expect(globalThis.AnchorBehaviors.getTarget).to.exist;
      expect(globalThis.AnchorBehaviors.getTarget).to.be.a('function');
    });

    it("should not overwrite existing AnchorBehaviors object", () => {
      const testProp = 'test-value';
      globalThis.AnchorBehaviors.testProperty = testProp;
      
      // Re-import the module
      delete require.cache[require.resolve('../anchor-behaviors.js')];
      require('../anchor-behaviors.js');
      
      expect(globalThis.AnchorBehaviors.testProperty).to.equal(testProp);
    });
  });

  describe("Parameter parsing from URL", () => {
    it("should parse parameters from hash", () => {
      globalThis.location = {
        hash: '#test-id',
        search: ''
      };
      
      const target = globalThis.AnchorBehaviors.getTarget();
      expect(globalThis.AnchorBehaviors.params).to.exist;
      expect(globalThis.AnchorBehaviors.params.id).to.equal('test-id');
    });

    it("should parse parameters from search string", () => {
      globalThis.location = {
        hash: '',
        search: '?id=search-id&resource=test-resource'
      };
      
      globalThis.AnchorBehaviors.getTarget();
      expect(globalThis.AnchorBehaviors.params.id).to.equal('search-id');
      expect(globalThis.AnchorBehaviors.params.resource).to.equal('test-resource');
    });

    it("should handle complex parameter strings", () => {
      globalThis.location = {
        hash: '',
        search: '?id=complex-id&param1=value1&param2=value2'
      };
      
      globalThis.AnchorBehaviors.getTarget();
      expect(globalThis.AnchorBehaviors.params.id).to.equal('complex-id');
      expect(globalThis.AnchorBehaviors.params.param1).to.equal('value1');
      expect(globalThis.AnchorBehaviors.params.param2).to.equal('value2');
    });

    it("should handle empty URL parameters", () => {
      globalThis.location = {
        hash: '',
        search: ''
      };
      
      globalThis.AnchorBehaviors.getTarget();
      expect(globalThis.AnchorBehaviors.params).to.deep.equal({});
    });

    it("should handle malformed URL parameters gracefully", () => {
      globalThis.location = {
        hash: '#malformed{param',
        search: ''
      };
      
      expect(() => {
        globalThis.AnchorBehaviors.getTarget();
      }).to.not.throw();
    });
  });

  describe("Element targeting by ID", () => {
    it("should find element by exact ID match", () => {
      globalThis.location = {
        hash: '#target-element',
        search: ''
      };
      
      const targetElement = { id: 'target-element', scrollIntoView: () => {} };
      globalThis.document.getElementById = (id) => {
        return id === 'target-element' ? targetElement : null;
      };
      
      const result = globalThis.AnchorBehaviors.getTarget();
      expect(result).to.equal(targetElement);
      expect(globalThis.AnchorBehaviors.target).to.equal(targetElement);
    });

    it("should find element by ID with hash prefix", () => {
      globalThis.location = {
        hash: '#prefixed-element',
        search: ''
      };
      
      const targetElement = { id: 'prefixed-element', scrollIntoView: () => {} };
      globalThis.document.getElementById = (id) => {
        return id === '#prefixed-element' ? targetElement : null;
      };
      
      const result = globalThis.AnchorBehaviors.getTarget();
      expect(result).to.equal(targetElement);
    });
  });

  describe("Element targeting by resource attribute", () => {
    it("should find element by resource attribute", () => {
      globalThis.location = {
        hash: '',
        search: '?resource=test-resource'
      };
      
      const targetElement = { resource: 'test-resource', scrollIntoView: () => {} };
      globalThis.document.querySelector = (selector) => {
        if (selector.includes('test-resource')) {
          return targetElement;
        }
        return null;
      };
      
      const result = globalThis.AnchorBehaviors.getTarget();
      expect(result).to.equal(targetElement);
    });

    it("should handle resource attribute with hash prefix", () => {
      globalThis.location = {
        hash: '',
        search: '?resource=hash-resource'
      };
      
      const targetElement = { resource: '#hash-resource', scrollIntoView: () => {} };
      globalThis.document.querySelector = (selector) => {
        if (selector.includes('hash-resource')) {
          return targetElement;
        }
        return null;
      };
      
      const result = globalThis.AnchorBehaviors.getTarget();
      expect(result).to.equal(targetElement);
    });
  });

  describe("Element testing function", () => {
    it("should test element ID against parameters", () => {
      const testElement = {
        id: 'matching-id',
        resource: null
      };
      
      globalThis.location = {
        hash: '#matching-id',
        search: ''
      };
      
      const result = globalThis.AnchorBehaviors.getTarget(testElement);
      expect(result).to.equal(testElement);
    });

    it("should test element resource against parameters", () => {
      const testElement = {
        id: null,
        resource: 'matching-resource'
      };
      
      globalThis.location = {
        hash: '',
        search: '?resource=matching-resource'
      };
      
      const result = globalThis.AnchorBehaviors.getTarget(testElement);
      expect(result).to.equal(testElement);
    });

    it("should handle cross-matching ID and resource", () => {
      const testElement = {
        id: 'test-id',
        resource: 'test-resource'
      };
      
      globalThis.location = {
        hash: '',
        search: '?id=test-resource&resource=test-id'
      };
      
      const result = globalThis.AnchorBehaviors.getTarget(testElement);
      expect(result).to.equal(testElement);
    });
  });

  describe("Scroll behavior", () => {
    it("should call scrollIntoView when target is found", () => {
      let scrollCalled = false;
      const targetElement = {
        id: 'scroll-target',
        scrollIntoView: () => { scrollCalled = true; }
      };
      
      globalThis.location = {
        hash: '#scroll-target',
        search: ''
      };
      
      globalThis.document.getElementById = (id) => {
        return id === 'scroll-target' ? targetElement : null;
      };
      
      globalThis.AnchorBehaviors.getTarget();
      expect(scrollCalled).to.be.true;
    });

    it("should not call scrollIntoView when no target is found", () => {
      globalThis.location = {
        hash: '#nonexistent-target',
        search: ''
      };
      
      // Ensure no element is found
      globalThis.document.getElementById = () => null;
      globalThis.document.querySelector = () => null;
      
      const result = globalThis.AnchorBehaviors.getTarget();
      expect(result).to.be.null;
    });
  });

  describe("Target caching", () => {
    it("should cache the target element", () => {
      const targetElement = { id: 'cached-target', scrollIntoView: () => {} };
      
      globalThis.location = {
        hash: '#cached-target',
        search: ''
      };
      
      globalThis.document.getElementById = () => targetElement;
      
      // First call
      const result1 = globalThis.AnchorBehaviors.getTarget();
      expect(result1).to.equal(targetElement);
      
      // Mock getElementById to return null to test caching
      globalThis.document.getElementById = () => null;
      
      // Second call should return cached result
      const result2 = globalThis.AnchorBehaviors.getTarget();
      expect(result2).to.equal(targetElement);
    });

    it("should return cached target even with different parameters", () => {
      const originalTarget = { id: 'original', scrollIntoView: () => {} };
      
      globalThis.location = {
        hash: '#original',
        search: ''
      };
      
      globalThis.document.getElementById = () => originalTarget;
      
      // First call establishes cache
      const result1 = globalThis.AnchorBehaviors.getTarget();
      expect(result1).to.equal(originalTarget);
      
      // Change location but should still return cached target
      globalThis.location.hash = '#different';
      const result2 = globalThis.AnchorBehaviors.getTarget();
      expect(result2).to.equal(originalTarget);
    });
  });

  describe("Document ready state handling", () => {
    it("should handle complete document state", () => {
      globalThis.document.readyState = 'complete';
      globalThis.location = {
        hash: '#ready-test',
        search: ''
      };
      
      globalThis.AnchorBehaviors.getTarget();
      expect(globalThis.AnchorBehaviors.params).to.exist;
    });

    it("should set up onload handler for non-complete state", () => {
      globalThis.document.readyState = 'loading';
      globalThis.location = {
        hash: '#loading-test',
        search: ''
      };
      
      // Mock onload
      let onloadSet = false;
      Object.defineProperty(globalThis, 'onload', {
        set: () => { onloadSet = true; },
        get: () => {},
        configurable: true
      });
      
      globalThis.AnchorBehaviors.getTarget();
      expect(onloadSet).to.be.true;
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle null/undefined element parameter", () => {
      expect(() => {
        globalThis.AnchorBehaviors.getTarget(null);
      }).to.not.throw();
      
      expect(() => {
        globalThis.AnchorBehaviors.getTarget(undefined);
      }).to.not.throw();
    });

    it("should handle elements without id or resource", () => {
      const elementWithoutIds = {};
      
      globalThis.location = {
        hash: '#test',
        search: ''
      };
      
      const result = globalThis.AnchorBehaviors.getTarget(elementWithoutIds);
      expect(result).to.be.null;
    });

    it("should handle malformed hash strings", () => {
      globalThis.location = {
        hash: '#test#malformed#hash',
        search: ''
      };
      
      expect(() => {
        globalThis.AnchorBehaviors.getTarget();
      }).to.not.throw();
    });

    it("should handle special characters in parameters", () => {
      globalThis.location = {
        hash: '',
        search: '?id=test%20with%20spaces&resource=test%2Bplus'
      };
      
      globalThis.AnchorBehaviors.getTarget();
      expect(globalThis.AnchorBehaviors.params.id).to.include('test with spaces');
      expect(globalThis.AnchorBehaviors.params.resource).to.include('test+plus');
    });

    it("should handle elements with hash characters in IDs", () => {
      const elementWithHash = {
        id: '#element-with-hash',
        resource: '#resource-with-hash'
      };
      
      globalThis.location = {
        hash: '',
        search: '?id=element-with-hash&resource=resource-with-hash'
      };
      
      const result = globalThis.AnchorBehaviors.getTarget(elementWithHash);
      expect(result).to.equal(elementWithHash);
    });
  });

  describe("Multiple selector strategies", () => {
    it("should try multiple selector strategies in order", () => {
      globalThis.location = {
        hash: '',
        search: '?id=fallback-test'
      };
      
      let getElementByIdCalled = false;
      let querySelectorCalled = false;
      
      globalThis.document.getElementById = (id) => {
        getElementByIdCalled = true;
        return null; // Force fallback to querySelector
      };
      
      const targetElement = { id: 'fallback-test', scrollIntoView: () => {} };
      globalThis.document.querySelector = (selector) => {
        querySelectorCalled = true;
        return selector.includes('fallback-test') ? targetElement : null;
      };
      
      const result = globalThis.AnchorBehaviors.getTarget();
      
      expect(getElementByIdCalled).to.be.true;
      expect(querySelectorCalled).to.be.true;
      expect(result).to.equal(targetElement);
    });
  });

  describe("Parameter caching", () => {
    it("should cache parameters to avoid re-parsing", () => {
      globalThis.location = {
        hash: '#cached-params',
        search: ''
      };
      
      // First call
      globalThis.AnchorBehaviors.getTarget();
      const firstParams = globalThis.AnchorBehaviors.params;
      
      // Change location (but params should remain cached)
      globalThis.location.hash = '#different';
      
      // Second call
      globalThis.AnchorBehaviors.getTarget();
      const secondParams = globalThis.AnchorBehaviors.params;
      
      expect(secondParams).to.equal(firstParams);
    });
  });
});
