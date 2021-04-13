import { expect, fixture, html, assert, elementUpdated, fixtureCleanup } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import '../src/github-preview.js';


// test custom properties
describe('instantiation test', () => {
  it('works', async () => {
    const el = await fixture(html` <github-preview org="elmsln" repo="haxcms"></github-preview> `);
    await expect(el.org).to.equal('elmsln');
  });
});

// a11y axe test
describe('a11y axe test', () => {
  it('works', async () => {
    const el = await fixture(html` <github-preview org="elmsln" repo="haxcms"></github-preview> `);
    await expect(el).to.be.accessible();
  });
});

it('passes axe accessible tests', async () => {
  const el = await fixture(html`<github-preview></github-preview>`);
  await assert.isAccessible(el);
});

it('axe negation', async () => {
  const el = await fixture(html`<github-preview aria-labelledby="github-preview"></github-preview>`);
  await assert.isNotAccessible(el);
});


describe('Test Bound Attributes', () => {
  describe('.org', () => {
    it('is bound to the org attribute', async () => {
      const el = await fixture(html`<github-preview org="collinkleest" repo="lrnwebcomponents"></github-preview>`);
      expect(el.org).to.equal('collinkleest');
      
      // change org and update
      el.org = 'elmsln';
      await elementUpdated(el);
      expect(el).dom.to.equal(html`<github-preview org="elmsln" repo="lrnwebcomponents"></github-preview>`);
    });
  });
});

// responsive tests
describe('test mobile responsiveness', () => {
  before(async () => {
    await setViewport({width: 375, height: 750});
  })
  it('sized down to 360px', async () => {
    const el = await fixture(html`<github-preview org="elmsln" repo="lrnwebcomponents"></github-preview>`);
    const width = getComputedStyle(el).width;
    expect(width).to.equal('360px');
  })
})

describe('test desktop responsiveness', () => {
  before(async () => {
    await setViewport({width: 1000, height: 1000});
  })
  it('sized up to 410px', async () => {
    const el = await fixture(html`<github-preview org="elmsln" repo="lrnwebcomponents"></github-preview>`);
    const width = getComputedStyle(el).width;
    expect(width).to.equal('410px');
  })
})


// clean up fixtures 
afterEach(() => {
  fixtureCleanup();
});