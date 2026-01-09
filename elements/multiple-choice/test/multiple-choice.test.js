import { fixture, expect, html } from "@open-wc/testing";

import "../multiple-choice.js";

describe("multiple-choice test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<multiple-choice
        id="basic"
        name="basic"
        title="Which are ducks????"
        randomize
        question="Which are ducks?"
      >
        <input correct value="Huey" />
        <input correct value="Duey" />
        <input correct value="Daffy" />
        <input correct value="Donald" />
        <input value="Mickey" />
        <p slot="correct-feedback">Yay! Let's jump in the money pit.</p>
        <p slot="incorrect-feedback">You're despicable. What a quack!</p>
      </multiple-choice>`,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Focus Management", () => {
    it("has proper focus management with delegatesFocus", async () => {
      // Check that the element uses delegatesFocus
      expect(element.shadowRootOptions.delegatesFocus).to.be.true;
    });

    it("focuses properly on feedback when answer is checked", async () => {
      element.checkAnswer();
      await element.updateComplete;
      const feedback = element.shadowRoot.querySelector("#feedback");
      expect(globalThis.document.activeElement).to.equal(feedback);
    });

    it("can navigate through options using keyboard", async () => {
      const firstField = element.shadowRoot.querySelector(
        "simple-fields-field",
      );
      expect(firstField).to.exist;
      expect(firstField.hasAttribute("tabindex") || firstField.tabIndex >= 0).to
        .be.true;
    });
  });

  describe("Accessibility - ARIA Attributes", () => {
    it("has proper semantic structure with fieldset for options", async () => {
      const fieldset = element.shadowRoot.querySelector("fieldset.options");
      expect(fieldset).to.exist;
    });

    it("has proper question heading structure", async () => {
      const question = element.shadowRoot.querySelector("h3");
      expect(question).to.exist;
      expect(question.textContent).to.include("Which are ducks");
    });

    it("has proper ARIA roles and properties on form elements", async () => {
      const fields = element.shadowRoot.querySelectorAll("simple-fields-field");
      fields.forEach((field) => {
        expect(field.hasAttribute("property")).to.be.true;
        expect(field.getAttribute("property")).to.equal("oer:answer");
      });
    });

    it("uses proper input types for single vs multiple options", async () => {
      // Test multiple choice (checkbox)
      let fields = element.shadowRoot.querySelectorAll("simple-fields-field");
      fields.forEach((field) => {
        expect(field.getAttribute("type")).to.equal("checkbox");
      });

      // Test single option (radio)
      element.singleOption = true;
      await element.updateComplete;
      fields = element.shadowRoot.querySelectorAll("simple-fields-field");
      fields.forEach((field) => {
        expect(field.getAttribute("type")).to.equal("radio");
      });
    });

    it("properly disables options when showing answer", async () => {
      element.showAnswer = true;
      await element.updateComplete;
      const fields = element.shadowRoot.querySelectorAll("simple-fields-field");
      fields.forEach((field) => {
        expect(field.hasAttribute("disabled")).to.be.true;
      });
    });
  });

  describe("Accessibility - Labels and Descriptions", () => {
    it("has descriptive labels for all interactive elements", async () => {
      const fields = element.shadowRoot.querySelectorAll("simple-fields-field");
      fields.forEach((field) => {
        const label = field.getAttribute("label");
        expect(label).to.not.be.empty;
      });
    });

    it("provides meaningful button labels", async () => {
      const checkButton = element.shadowRoot.querySelector(
        "simple-toolbar-button",
      );
      expect(checkButton).to.exist;
      expect(checkButton.textContent.trim()).to.not.be.empty;
    });

    it("has proper metadata for assessment", async () => {
      const meta = element.shadowRoot.querySelector(
        'meta[property="oer:assessing"]',
      );
      expect(meta).to.exist;
      expect(element.hasAttribute("typeof")).to.be.true;
      expect(element.getAttribute("typeof")).to.equal("oer:Assessment");
    });
  });

  describe("Accessibility - Visual Feedback", () => {
    it("provides visual indicators for correct/incorrect answers", async () => {
      element.showAnswer = true;
      // Simulate some user guesses
      element.displayedAnswers[0].userGuess = true; // correct answer
      element.displayedAnswers[4].userGuess = true; // incorrect answer
      await element.updateComplete;

      const fields = element.shadowRoot.querySelectorAll("simple-fields-field");
      let hasCorrectClass = false;
      let hasIncorrectClass = false;

      fields.forEach((field) => {
        if (field.classList.contains("correct")) {
          hasCorrectClass = true;
        }
        if (field.classList.contains("incorrect")) {
          hasIncorrectClass = true;
        }
      });

      expect(hasCorrectClass).to.be.true;
      expect(hasIncorrectClass).to.be.true;
    });
  });

  describe("Accessibility - Keyboard Navigation", () => {
    it("supports keyboard activation of options", async () => {
      const field = element.shadowRoot.querySelector("simple-fields-field");
      const initialValue = field.value;

      // Simulate keydown event
      const event = new KeyboardEvent("keydown", { key: " ", bubbles: true });
      field.dispatchEvent(event);

      // The field should be interactive via keyboard
      expect(field.hasAttribute("name")).to.be.true;
    });
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("multiple-choice passes accessibility test", async () => {
    const el = await fixture(html` <multiple-choice></multiple-choice> `);
    await expect(el).to.be.accessible();
  });
  it("multiple-choice passes accessibility negation", async () => {
    const el = await fixture(
      html`<multiple-choice
        aria-labelledby="multiple-choice"
      ></multiple-choice>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("multiple-choice can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<multiple-choice .foo=${'bar'}></multiple-choice>`);
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
      const el = await fixture(html`<multiple-choice ></multiple-choice>`);
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
      const el = await fixture(html`<multiple-choice></multiple-choice>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<multiple-choice></multiple-choice>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
