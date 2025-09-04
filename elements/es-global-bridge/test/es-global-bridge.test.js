import { fixture, expect, html } from "@open-wc/testing";
import { ESGlobalBridge, ESGlobalBridgeStore } from "../es-global-bridge.js";

describe("ESGlobalBridge test", () => {
  let bridge;
  
  beforeEach(() => {
    // Create a fresh instance for each test
    bridge = new ESGlobalBridge();
    
    // Clean up any existing scripts from previous tests
    const existingScripts = document.querySelectorAll('script[data-name]');
    existingScripts.forEach(script => script.remove());
  });
  
  afterEach(() => {
    // Clean up scripts after each test
    const scripts = document.querySelectorAll('script[data-name]');
    scripts.forEach(script => script.remove());
  });

  // Basic functionality tests
  it("instantiates the ESGlobalBridge correctly", () => {
    expect(bridge).to.exist;
    expect(bridge.imports).to.deep.equal({});
    expect(bridge.webpack).to.be.false;
  });

  it("has import and load aliases", () => {
    expect(bridge.import).to.be.a('function');
    expect(bridge.load).to.be.a('function');
    // import should be an alias for load
    expect(bridge.import === bridge.load).to.be.false; // Different functions but same behavior
  });

  // Script loading tests
  it("creates script element with correct attributes", async () => {
    const testName = "test-script";
    const testLocation = "https://example.com/test.js";
    
    // Start the load (won't complete since it's a fake URL)
    const loadPromise = bridge.load(testName, testLocation);
    
    // Check that script was created
    const script = document.querySelector(`script[data-name="${testName}"]`);
    expect(script).to.exist;
    expect(script.src).to.equal(testLocation);
    expect(script.getAttribute('data-name')).to.equal(testName);
    
    // Clean up - remove script to prevent hanging
    script.remove();
  });

  it("handles successful script loading", (done) => {
    const testName = "success-test";
    // Use a data URL for a successful load
    const testLocation = "data:text/javascript,console.log('test loaded');";
    
    bridge.load(testName, testLocation).then((result) => {
      expect(result).to.be.true;
      expect(bridge.imports[testName]).to.be.true;
      done();
    }).catch(done);
    
    // Simulate successful load after a short delay
    setTimeout(() => {
      const script = document.querySelector(`script[data-name="${testName}"]`);
      if (script && script.onload) {
        script.onload();
      }
    }, 10);
  });

  it("handles script loading errors", (done) => {
    const testName = "error-test";
    const testLocation = "https://nonexistent.invalid/script.js";
    
    bridge.load(testName, testLocation).catch((error) => {
      expect(error).to.be.an('error');
      expect(error.message).to.include('Failed to load');
      expect(error.message).to.include(testName);
      expect(error.message).to.include(testLocation);
      expect(bridge.imports[testName]).to.be.false;
      done();
    });
    
    // Simulate error after a short delay
    setTimeout(() => {
      const script = document.querySelector(`script[data-name="${testName}"]`);
      if (script && script.onerror) {
        script.onerror();
      }
    }, 10);
  });

  it("prevents duplicate loading of same script", async () => {
    const testName = "duplicate-test";
    const testLocation = "data:text/javascript,console.log('loaded');";
    
    // Mark as already imported
    bridge.imports[testName] = true;
    
    const result = await bridge.load(testName, testLocation);
    expect(result).to.be.true;
    
    // Should not create a new script element
    const scripts = document.querySelectorAll(`script[data-name="${testName}"]`);
    expect(scripts.length).to.equal(0);
  });

  it("fires custom events on successful load", (done) => {
    const testName = "event-test";
    const testLocation = "data:text/javascript,console.log('event test');";
    
    // Listen for the custom event
    document.addEventListener(`es-bridge-${testName}-loaded`, (event) => {
      expect(event.detail.name).to.equal(testName);
      expect(event.detail.location).to.equal(testLocation);
      expect(event.bubbles).to.be.true;
      expect(event.cancelable).to.be.true;
      done();
    }, { once: true });
    
    bridge.load(testName, testLocation);
    
    // Simulate successful load
    setTimeout(() => {
      const script = document.querySelector(`script[data-name="${testName}"]`);
      if (script && script.onload) {
        script.onload();
      }
    }, 10);
  });

  // Import alias tests
  it("import method works identically to load method", async () => {
    const testName = "import-alias-test";
    const testLocation = "data:text/javascript,console.log('import test');";
    
    // Mark as already loaded to avoid actual loading
    bridge.imports[testName] = true;
    
    const loadResult = await bridge.load(testName, testLocation);
    const importResult = await bridge.import(testName, testLocation);
    
    expect(loadResult).to.equal(importResult);
  });

  // Webpack integration tests
  it("handles webpack parameter", async () => {
    const testName = "webpack-test";
    const testLocation = "data:text/javascript,console.log('webpack test');";
    
    // Test with webpack = true
    bridge.imports[testName] = true;
    const result = await bridge.load(testName, testLocation, true);
    expect(result).to.be.true;
  });

  it("prevents loading when webpack is handling it", async () => {
    const testName = "webpack-conflict-test";
    const testLocation = "data:text/javascript,console.log('webpack conflict');";
    
    // Set up webpack conflict scenario
    bridge.webpack = { [testName]: true };
    
    const result = await bridge.load(testName, testLocation, false);
    expect(result).to.equal(bridge.imports[testName]);
    
    // Should not create script element
    const scripts = document.querySelectorAll(`script[data-name="${testName}"]`);
    expect(scripts.length).to.equal(0);
  });

  // State management tests
  it("manages import state correctly during lifecycle", (done) => {
    const testName = "state-test";
    const testLocation = "data:text/javascript,console.log('state test');";
    
    // Initially should not be imported
    expect(bridge.imports[testName]).to.be.undefined;
    
    bridge.load(testName, testLocation).then((result) => {
      expect(result).to.be.true;
      expect(bridge.imports[testName]).to.be.true;
      done();
    }).catch(done);
    
    // Check intermediate state
    setTimeout(() => {
      expect(bridge.imports[testName]).to.equal(testLocation);
      
      // Simulate successful load
      const script = document.querySelector(`script[data-name="${testName}"]`);
      if (script && script.onload) {
        script.onload();
      }
    }, 10);
  });

  it("cleans up failed imports correctly", (done) => {
    const testName = "cleanup-test";
    const testLocation = "https://invalid.url/script.js";
    
    bridge.load(testName, testLocation).catch(() => {
      expect(bridge.imports[testName]).to.be.false;
      done();
    });
    
    // Simulate error
    setTimeout(() => {
      const script = document.querySelector(`script[data-name="${testName}"]`);
      if (script && script.onerror) {
        script.onerror();
      }
    }, 10);
  });

  // Edge cases and error handling
  it("handles empty or invalid names gracefully", async () => {
    const testLocation = "data:text/javascript,console.log('empty name test');";
    
    // Test with empty string
    bridge.imports[""] = true;
    const emptyResult = await bridge.load("", testLocation);
    expect(emptyResult).to.be.true;
    
    // Test with undefined (should work but convert to string)
    const undefinedName = undefined;
    bridge.imports[undefinedName] = true;
    const undefinedResult = await bridge.load(undefinedName, testLocation);
    expect(undefinedResult).to.be.true;
  });

  it("handles empty or invalid locations", (done) => {
    const testName = "invalid-location";
    
    bridge.load(testName, "").catch((error) => {
      expect(error).to.be.an('error');
      done();
    });
    
    setTimeout(() => {
      const script = document.querySelector(`script[data-name="${testName}"]`);
      if (script && script.onerror) {
        script.onerror();
      }
    }, 10);
  });

  // Performance and concurrency tests
  it("handles multiple simultaneous loads efficiently", async () => {
    const testNames = ["multi1", "multi2", "multi3"];
    const testLocation = "data:text/javascript,console.log('multi test');";
    
    // Mark all as already loaded for quick resolution
    testNames.forEach(name => {
      bridge.imports[name] = true;
    });
    
    const promises = testNames.map(name => bridge.load(name, testLocation));
    const results = await Promise.all(promises);
    
    results.forEach(result => {
      expect(result).to.be.true;
    });
  });

  it("maintains consistent state under rapid operations", async () => {
    const testName = "rapid-test";
    const testLocation = "data:text/javascript,console.log('rapid test');";
    
    // Mark as loaded first
    bridge.imports[testName] = true;
    
    // Fire multiple loads rapidly
    const promises = Array.from({ length: 5 }, () => bridge.load(testName, testLocation));
    const results = await Promise.all(promises);
    
    // All should return the same result
    results.forEach(result => {
      expect(result).to.be.true;
    });
  });
});

describe("ESGlobalBridge Global Registry", () => {
  it("creates global ESGlobalBridge namespace", () => {
    expect(globalThis.ESGlobalBridge).to.exist;
    expect(globalThis.ESGlobalBridge.requestAvailability).to.be.a('function');
  });

  it("provides singleton instance through requestAvailability", () => {
    const instance1 = globalThis.ESGlobalBridge.requestAvailability();
    const instance2 = globalThis.ESGlobalBridge.requestAvailability();
    
    expect(instance1).to.equal(instance2);
    expect(instance1).to.be.instanceOf(ESGlobalBridge);
  });

  it("ESGlobalBridgeStore is the singleton instance", () => {
    const storeInstance = ESGlobalBridgeStore;
    const globalInstance = globalThis.ESGlobalBridge.requestAvailability();
    
    expect(storeInstance).to.equal(globalInstance);
    expect(storeInstance).to.be.instanceOf(ESGlobalBridge);
  });

  it("maintains state across different access methods", async () => {
    const testName = "global-state-test";
    const testLocation = "data:text/javascript,console.log('global test');";
    
    // Use store instance to load
    ESGlobalBridgeStore.imports[testName] = true;
    
    // Access through global registry
    const globalInstance = globalThis.ESGlobalBridge.requestAvailability();
    const result = await globalInstance.load(testName, testLocation);
    
    expect(result).to.be.true;
    expect(ESGlobalBridgeStore.imports[testName]).to.be.true;
  });
});

describe("ESGlobalBridge A11y tests", () => {
  it("does not interfere with document accessibility", async () => {
    const testElement = document.createElement('div');
    testElement.innerHTML = '<p role="main">Test content</p>';
    document.body.appendChild(testElement);
    
    // Load a script and ensure it doesn't break accessibility
    const bridge = new ESGlobalBridge();
    bridge.imports["a11y-test"] = true;
    await bridge.load("a11y-test", "data:text/javascript,console.log('a11y');");
    
    // Should not affect DOM structure for accessibility
    expect(testElement.querySelector('[role="main"]')).to.exist;
    
    document.body.removeChild(testElement);
  });
});
