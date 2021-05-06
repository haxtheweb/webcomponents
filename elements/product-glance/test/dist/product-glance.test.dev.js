"use strict";

var _testing = require("@open-wc/testing");

var _testRunnerCommands = require("@web/test-runner-commands");

require("../src/product-glance.js");

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '<product-glance aria-labelledby="product-glance"></product-glance>',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([" <product-glance></product-glance> "]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    ' <product-glance title="test-title"></product-glance> ',
  ]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(
    Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })
  );
}

/*
 * Instantiation test
 * create element and see if an attribute binds to the element
 */
describe("Instantiation Test", function () {
  it("product-glance instantiates", function _callee() {
    var el;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            _context.next = 2;
            return regeneratorRuntime.awrap(
              (0, _testing.fixture)((0, _testing.html)(_templateObject()))
            );

          case 2:
            el = _context.sent;
            _context.next = 5;
            return regeneratorRuntime.awrap(
              (0, _testing.expect)(el.getAttribute("title")).to.equal(
                "test-title"
              )
            );

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  });
});
/*
 * A11y Accessibility tests
 */

describe("A11y/chai axe tests", function () {
  it("product-glance passes accessibility test", function _callee2() {
    var el;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch ((_context2.prev = _context2.next)) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap(
              (0, _testing.fixture)((0, _testing.html)(_templateObject2()))
            );

          case 2:
            el = _context2.sent;
            _context2.next = 5;
            return regeneratorRuntime.awrap(
              (0, _testing.expect)(el).to.be.accessible()
            );

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    });
  });
  it("product-glance passes accessibility negation", function _callee3() {
    var el;
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch ((_context3.prev = _context3.next)) {
          case 0:
            _context3.next = 2;
            return regeneratorRuntime.awrap(
              (0, _testing.fixture)((0, _testing.html)(_templateObject3()))
            );

          case 2:
            el = _context3.sent;
            _context3.next = 5;
            return regeneratorRuntime.awrap(
              _testing.assert.isNotAccessible(el)
            );

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    });
  });
});
/*
// Custom properties test
describe("Custom Property Test", () => {
  it("product-glance can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<product-glance .foo=${'bar'}></product-glance>`);
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
      const el = await fixture(html`<product-glance ></product-glance>`);
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
      const el = await fixture(html`<product-glance></product-glance>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<product-glance></product-glance>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
// clean up fixtures after all tests are complete

afterEach(function () {
  (0, _testing.fixtureCleanup)();
});
