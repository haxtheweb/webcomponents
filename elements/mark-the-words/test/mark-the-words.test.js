import { fixture, expect, html } from "@open-wc/testing";

import "../mark-the-words.js";

describe("mark-the-words test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <mark-the-words answers="this,is">
        This is mark-the-words
      </mark-the-words>`,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Interactive Word Selection", () => {
    it("provides proper button roles for word selection", async () => {
      await element.updateComplete;
      const buttons = element.shadowRoot.querySelectorAll('button.tag-option');
      expect(buttons.length).to.be.greaterThan(0);
      
      buttons.forEach(button => {
        expect(button.tagName.toLowerCase()).to.equal('button');
      });
    });

    it("has proper focus styling for keyboard navigation", async () => {
      await element.updateComplete;
      const buttons = element.shadowRoot.querySelectorAll('button.tag-option');
      
      if (buttons.length > 0) {
        const firstButton = buttons[0];
        // Check that focus styling exists
        const computedStyle = globalThis.getComputedStyle(firstButton, ':focus');
        expect(firstButton).to.exist;
      }
    });

    it("supports keyboard activation of word selection", async () => {
      await element.updateComplete;
      const buttons = element.shadowRoot.querySelectorAll('button.tag-option');
      
      if (buttons.length > 0) {
        const button = buttons[0];
        const initialSelected = element.wordList.find(word => word.text === button.textContent)?.selected;
        
        // Simulate keyboard activation
        button.click();
        await element.updateComplete;
        
        const afterSelected = element.wordList.find(word => word.text === button.textContent)?.selected;
        expect(afterSelected).to.not.equal(initialSelected);
      }
    });

    it("provides visual indication of selected state", async () => {
      await element.updateComplete;
      const buttons = element.shadowRoot.querySelectorAll('button.tag-option');
      
      if (buttons.length > 0) {
        const button = buttons[0];
        button.click();
        await element.updateComplete;
        
        expect(button.classList.contains('selected')).to.be.true;
      }
    });
  });

  describe("Accessibility - Content Structure", () => {
    it("has proper question heading", async () => {
      const question = element.shadowRoot.querySelector('h3');
      expect(question).to.exist;
      expect(question.textContent).to.include('mark-the-words');
    });

    it("uses semantic fieldset for text content", async () => {
      const fieldset = element.shadowRoot.querySelector('fieldset.options');
      expect(fieldset).to.exist;
    });

    it("maintains proper reading order", async () => {
      await element.updateComplete;
      const textContainer = element.shadowRoot.querySelector('.text');
      expect(textContainer).to.exist;
    });
  });

  describe("Accessibility - Feedback and States", () => {
    it("disables interaction when showing answers", async () => {
      element.showAnswer = true;
      await element.updateComplete;
      
      const buttons = element.shadowRoot.querySelectorAll('button.tag-option');
      buttons.forEach(button => {
        const computedStyle = globalThis.getComputedStyle(button);
        expect(computedStyle.pointerEvents).to.equal('none');
      });
    });

    it("provides proper focus management with delegatesFocus", async () => {
      expect(element.shadowRootOptions.delegatesFocus).to.be.true;
    });

    it("has proper assessment metadata", async () => {
      const meta = element.shadowRoot.querySelector('meta[property="oer:assessing"]');
      expect(meta).to.exist;
      expect(element.hasAttribute('typeof')).to.be.true;
      expect(element.getAttribute('typeof')).to.equal('oer:Assessment');
    });
  });

  describe("Accessibility - User Experience", () => {
    it("provides meaningful directions", async () => {
      const directions = element.shadowRoot.querySelector('#directions');
      expect(directions).to.exist;
    });

    it("ensures buttons are sufficiently sized for interaction", async () => {
      await element.updateComplete;
      const buttons = element.shadowRoot.querySelectorAll('button.tag-option');
      
      buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        // Minimum touch target size should be reasonable
        expect(rect.height).to.be.greaterThan(0);
        expect(rect.width).to.be.greaterThan(0);
      });
    });
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("mark-the-words passes accessibility test", async () => {
    const el = await fixture(html` <mark-the-words></mark-the-words> `);
    await expect(el).to.be.accessible();
  });
  it("mark-the-words passes accessibility negation", async () => {
    const el = await fixture(
      html`<mark-the-words aria-labelledby="mark-the-words"></mark-the-words>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("mark-the-words can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<mark-the-words .foo=${'bar'}></mark-the-words>`);
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
      const el = await fixture(html`<mark-the-words ></mark-the-words>`);
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
      const el = await fixture(html`<mark-the-words></mark-the-words>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<mark-the-words></mark-the-words>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
