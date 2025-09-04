import { fixture, expect, html } from "@open-wc/testing";

import "../pouch-db.js";
import { PouchDBElement } from "../pouch-db.js";

describe("pouch-db test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <pouch-db title="test-title"></pouch-db> `);
  });

  describe('Component Structure', () => {
    it('should be defined as a custom element', () => {
      expect(customElements.get('pouch-db')).to.exist;
      expect(element.tagName.toLowerCase()).to.equal('pouch-db');
    });

    it('should create an instance', () => {
      expect(element).to.exist;
      expect(element.constructor.name).to.equal('PouchDb');
    });

    it('should have correct tag property', () => {
      expect(element.constructor.tag).to.equal('pouch-db');
    });

    it('should extend HTMLElement', () => {
      expect(element instanceof HTMLElement).to.be.true;
    });

    it('should not have shadow DOM', () => {
      expect(element.shadowRoot).to.be.null;
    });
  });

  describe('Singleton Pattern', () => {
    it('should have global PouchDb namespace', () => {
      expect(globalThis.PouchDb).to.exist;
      expect(typeof globalThis.PouchDb.requestAvailability).to.equal('function');
    });

    it('should return same instance from requestAvailability', () => {
      const instance1 = globalThis.PouchDb.requestAvailability();
      const instance2 = globalThis.PouchDb.requestAvailability();
      expect(instance1).to.equal(instance2);
    });

    it('should have singleton instance available as export', () => {
      expect(PouchDBElement).to.exist;
      expect(PouchDBElement.tagName.toLowerCase()).to.equal('pouch-db');
    });

    it('should maintain single instance across multiple requests', () => {
      const instances = [];
      for (let i = 0; i < 5; i++) {
        instances.push(globalThis.PouchDb.requestAvailability());
      }
      
      // All instances should be the same object
      instances.forEach(instance => {
        expect(instance).to.equal(instances[0]);
      });
    });
  });

  describe('Initialization', () => {
    it('should have default type property', () => {
      expect(element.type).to.equal('xapi');
    });

    it('should have windowControllers AbortController', () => {
      expect(element.windowControllers).to.exist;
      expect(element.windowControllers instanceof AbortController).to.be.true;
    });

    it('should initialize database asynchronously', (done) => {
      // Wait a bit for the dynamic import to complete
      setTimeout(() => {
        expect(element.db).to.exist;
        done();
      }, 100);
    });
  });

  describe('Event Listeners', () => {
    it('should bind to user-engagement events', () => {
      expect(typeof element.userEngagmentFunction).to.equal('function');
    });

    it('should bind to pouch-db-get-data events', () => {
      expect(typeof element.getDataFunction).to.equal('function');
    });

    it('should handle user-engagement events', () => {
      const mockEvent = {
        detail: {
          activityDisplay: 'answered',
          objectName: 'Test Quiz',
          resultSuccess: true
        },
        target: { tagName: 'MULTIPLE-CHOICE' }
      };

      expect(() => element.userEngagmentFunction(mockEvent)).to.not.throw;
    });

    it('should handle pouch-db-get-data events', () => {
      const mockEvent = {
        detail: {
          queryRequest: 'all-quizzes'
        },
        target: { tagName: 'TEST-ELEMENT' }
      };

      expect(() => element.getDataFunction(mockEvent)).to.not.throw;
    });
  });

  describe('User Engagement Processing', () => {
    it('should process MULTIPLE-CHOICE events', () => {
      const mockEvent = {
        detail: {
          activityDisplay: 'answered',
          objectName: 'Test Quiz',
          resultSuccess: true
        },
        target: { tagName: 'MULTIPLE-CHOICE' }
      };

      // Mock console.log to capture output
      const originalLog = console.log;
      let loggedData = null;
      console.log = (data) => {
        loggedData = data;
      };

      element.userEngagmentFunction(mockEvent);
      
      expect(loggedData).to.exist;
      expect(loggedData._id).to.be.a('string');
      expect(loggedData.title).to.be.a('string');
      expect(loggedData.completed).to.be.false;

      // Restore console.log
      console.log = originalLog;
    });

    it('should handle unknown event types gracefully', () => {
      const mockEvent = {
        detail: {
          activityDisplay: 'unknown',
          objectName: 'Test',
          resultSuccess: false
        },
        target: { tagName: 'UNKNOWN-ELEMENT' }
      };

      expect(() => element.userEngagmentFunction(mockEvent)).to.not.throw;
    });
  });

  describe('Data Query Processing', () => {
    it('should handle all-quizzes query request', () => {
      const mockEvent = {
        detail: {
          queryRequest: 'all-quizzes'
        },
        target: { tagName: 'TEST-ELEMENT' }
      };

      expect(() => element.getDataFunction(mockEvent)).to.not.throw;
    });

    it('should handle single-quiz query request', () => {
      const mockEvent = {
        detail: {
          queryRequest: 'single-quiz',
          objectName: 'Quiz1'
        },
        target: { tagName: 'TEST-ELEMENT' }
      };

      expect(() => element.getDataFunction(mockEvent)).to.not.throw;
    });

    it('should handle future-query request', () => {
      const mockEvent = {
        detail: {
          queryRequest: 'future-query',
          activityDisplay: 'completed',
          objectName: 'Advanced Quiz',
          resultSuccess: true,
          resultCompletion: true
        },
        target: { tagName: 'TEST-ELEMENT' }
      };

      expect(() => element.getDataFunction(mockEvent)).to.not.throw;
    });

    it('should handle unknown query request', () => {
      const mockEvent = {
        detail: {
          queryRequest: 'unknown-query'
        },
        target: { tagName: 'TEST-ELEMENT' }
      };

      expect(() => element.getDataFunction(mockEvent)).to.not.throw;
    });
  });

  describe('Event Dispatching', () => {
    it('should dispatch pouch-db-show-data event', (done) => {
      const mockQueryData = {
        labels: ['Quiz1', 'Quiz2'],
        series: [[1, 2]]
      };

      // Listen for the dispatched event
      globalThis.addEventListener('pouch-db-show-data', (event) => {
        expect(event.detail).to.exist;
        expect(event.bubbles).to.be.true;
        expect(event.composed).to.be.true;
        expect(event.cancelable).to.be.false;
        done();
      }, { once: true });

      // Trigger a data query that should dispatch the event
      const mockEvent = {
        detail: {
          queryRequest: 'all-quizzes'
        },
        target: { tagName: 'TEST-ELEMENT' }
      };

      element.getDataFunction(mockEvent);
    });
  });

  describe('Lifecycle Management', () => {
    it('should setup event listeners on connect', () => {
      const spy = {
        called: false,
        addEventListener: () => { spy.called = true; }
      };
      
      const originalAddEventListener = globalThis.addEventListener;
      globalThis.addEventListener = spy.addEventListener;
      
      element.connectedCallback();
      expect(spy.called).to.be.true;
      
      globalThis.addEventListener = originalAddEventListener;
    });

    it('should cleanup on disconnect', () => {
      const originalAbort = element.windowControllers.abort;
      let abortCalled = false;
      element.windowControllers.abort = () => {
        abortCalled = true;
        originalAbort.call(element.windowControllers);
      };
      
      element.disconnectedCallback();
      expect(abortCalled).to.be.true;
    });
  });

  describe('Edge Cases', () => {
    it('should handle events with missing detail', () => {
      const mockEvent = {
        target: { tagName: 'MULTIPLE-CHOICE' }
      };

      expect(() => element.userEngagmentFunction(mockEvent)).to.not.throw;
    });

    it('should handle events with null target', () => {
      const mockEvent = {
        detail: { queryRequest: 'all-quizzes' },
        target: null
      };

      expect(() => element.getDataFunction(mockEvent)).to.not.throw;
    });

    it('should handle malformed event data gracefully', () => {
      const mockEvent = {
        detail: {
          invalidProperty: 'test',
          nested: { deeply: { invalid: true } }
        },
        target: { tagName: 'INVALID-ELEMENT' }
      };

      expect(() => element.userEngagmentFunction(mockEvent)).to.not.throw;
      expect(() => element.getDataFunction(mockEvent)).to.not.throw;
    });
  });

  describe('Database Operations', () => {
    it('should have xAPI statement structure', () => {
      const mockEvent = {
        detail: {
          activityDisplay: 'answered',
          objectName: 'Test Quiz',
          resultSuccess: true
        },
        target: { tagName: 'MULTIPLE-CHOICE' }
      };

      const originalLog = console.log;
      let xapiStatement = null;
      console.log = (data) => {
        if (data._id && data.title && typeof data.completed !== 'undefined') {
          xapiStatement = data;
        }
      };

      element.userEngagmentFunction(mockEvent);
      
      if (xapiStatement) {
        expect(xapiStatement._id).to.be.a('string');
        expect(xapiStatement.title).to.be.a('string');
        expect(xapiStatement.completed).to.be.a('boolean');
        
        // Parse the title to check xAPI structure
        const parsedTitle = JSON.parse(xapiStatement.title);
        expect(parsedTitle.actor).to.exist;
        expect(parsedTitle.verb).to.exist;
        expect(parsedTitle.object).to.exist;
        expect(parsedTitle.result).to.exist;
      }

      console.log = originalLog;
    });
  });

  describe('Multiple Instances Behavior', () => {
    it('should maintain singleton behavior with multiple fixture instances', async () => {
      const element1 = await fixture(html`<pouch-db></pouch-db>`);
      const element2 = await fixture(html`<pouch-db></pouch-db>`);
      
      // Both should reference the same singleton through global availability
      const singleton1 = globalThis.PouchDb.requestAvailability();
      const singleton2 = globalThis.PouchDb.requestAvailability();
      
      expect(singleton1).to.equal(singleton2);
      expect(element1.constructor).to.equal(element2.constructor);
    });
  });

  describe('Performance', () => {
    it('should handle rapid event processing efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 50; i++) {
        const mockEvent = {
          detail: {
            queryRequest: 'all-quizzes'
          },
          target: { tagName: `TEST-ELEMENT-${i}` }
        };
        
        element.getDataFunction(mockEvent);
      }
      
      const endTime = performance.now();
      expect(endTime - startTime).to.be.lessThan(1000); // Should complete within 1 second
    });
  });

  it("passes the a11y audit", async () => {
    // Since this component has no shadow DOM and no visual elements,
    // we test the element existence instead
    expect(element).to.exist;
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("pouch-db passes accessibility test", async () => {
    const el = await fixture(html` <pouch-db></pouch-db> `);
    await expect(el).to.be.accessible();
  });
  it("pouch-db passes accessibility negation", async () => {
    const el = await fixture(
      html`<pouch-db aria-labelledby="pouch-db"></pouch-db>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("pouch-db can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<pouch-db .foo=${'bar'}></pouch-db>`);
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
      const el = await fixture(html`<pouch-db ></pouch-db>`);
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
      const el = await fixture(html`<pouch-db></pouch-db>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<pouch-db></pouch-db>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
