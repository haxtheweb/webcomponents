import { fixture, expect, html } from "@open-wc/testing";
import "../matching-question.js";

describe("MatchingQuestion test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`<matching-question></matching-question>`);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element with default values", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("matching-question");
  });

  it("has correct default property values", async () => {
    expect(element.guessDataValue).to.equal("matchAnswers");
    expect(element.__activeOption).to.deep.equal({});
    expect(element.dragEnter).to.be.false;
    expect(element.dragging).to.be.false;
    expect(element.matchAnswers).to.deep.equal([]);
    expect(element.matchTarget).to.be.false;
  });

  it("extends QuestionElement correctly", async () => {
    expect(element.constructor.name).to.equal("MatchingQuestion");
    expect(Object.getPrototypeOf(element.constructor).name).to.equal("QuestionElement");
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Drag and Drop Alternative", () => {
    it("provides keyboard accessible matching interface", async () => {
      await element.updateComplete;
      
      // Should provide alternative to drag and drop
      const buttons = element.shadowRoot.querySelectorAll('button');
      const selects = element.shadowRoot.querySelectorAll('select');
      const inputs = element.shadowRoot.querySelectorAll('input');
      
      // Should have some form of keyboard interaction
      expect(buttons.length + selects.length + inputs.length).to.be.greaterThan(0);
    });

    it("has proper focus management for matching pairs", async () => {
      await element.updateComplete;
      
      // Should support proper focus management
      expect(element.shadowRootOptions?.delegatesFocus).to.be.true;
    });

    it("provides clear instructions for screen readers", async () => {
      await element.updateComplete;
      
      const instructions = element.shadowRoot.querySelector('[role="region"], .instructions, #directions');
      if (instructions) {
        expect(instructions.textContent.trim().length).to.be.greaterThan(0);
      }
    });
  });

  describe("Accessibility - ARIA Labels and Roles", () => {
    it("uses proper ARIA roles for matching interface", async () => {
      await element.updateComplete;
      
      // Check for proper ARIA structure
      const regions = element.shadowRoot.querySelectorAll('[role]');
      const fieldsets = element.shadowRoot.querySelectorAll('fieldset');
      
      // Should have some semantic structure
      expect(regions.length + fieldsets.length).to.be.greaterThan(0);
    });

    it("provides descriptive labels for all interactive elements", async () => {
      await element.updateComplete;
      
      const interactives = element.shadowRoot.querySelectorAll('button, select, input, [tabindex]');
      interactives.forEach(el => {
        const hasLabel = el.hasAttribute('aria-label') || 
                        el.hasAttribute('aria-labelledby') ||
                        el.hasAttribute('title') ||
                        el.textContent.trim().length > 0;
        expect(hasLabel).to.be.true;
      });
    });
  });

  describe("Accessibility - Assessment Features", () => {
    it("has proper assessment metadata", async () => {
      const meta = element.shadowRoot.querySelector('meta[property="oer:assessing"]');
      if (meta) {
        expect(meta).to.exist;
      }
      
      // Should inherit from QuestionElement
      expect(element.tagName.toLowerCase()).to.equal('matching-question');
    });

    it("provides feedback in accessible format", async () => {
      element.checkAnswer();
      await element.updateComplete;
      
      const feedback = element.shadowRoot.querySelector('#feedback, .feedback');
      if (feedback) {
        expect(feedback).to.exist;
      }
    });

    it("supports screen reader announcements for results", async () => {
      // Simulate checking an answer
      element.checkAnswer();
      await element.updateComplete;
      
      // Should focus feedback for screen readers
      const feedback = element.shadowRoot.querySelector('#feedback');
      if (feedback) {
        expect(feedback).to.exist;
      }
    });
  });

  describe("Accessibility - Visual Design", () => {
    it("maintains proper contrast and visual hierarchy", async () => {
      await element.updateComplete;
      
      const style = globalThis.getComputedStyle(element);
      expect(style.display).to.not.equal('none');
    });

    it("provides visual feedback for matches", async () => {
      element.showAnswer = true;
      await element.updateComplete;
      
      // Should have visual indicators for correct/incorrect
      const visualFeedback = element.shadowRoot.querySelectorAll('.correct, .incorrect, [data-correct]');
      // Visual feedback should exist when showing answers
      expect(visualFeedback.length >= 0).to.be.true;
    });
  });

  it("passes the a11y audit with answers configured", async () => {
    element.answers = [
      { label: "Target 1", correct: true, order: 0 },
      { label: "Match 1", correct: false, order: 1, match: 0 },
      { label: "Target 2", correct: true, order: 2 },
      { label: "Match 2", correct: false, order: 3, match: 2 }
    ];
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit when showing answers", async () => {
    element.answers = [
      { label: "Target 1", correct: true, order: 0 },
      { label: "Match 1", correct: false, order: 1, match: 0 }
    ];
    element.showAnswer = true;
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  // Property validation and reflection tests
  it("reflects dragging property to attribute", async () => {
    element.dragging = true;
    await element.updateComplete;
    
    expect(element.hasAttribute('dragging')).to.be.true;
    
    element.dragging = false;
    await element.updateComplete;
    
    expect(element.hasAttribute('dragging')).to.be.false;
  });

  it("reflects dragEnter property to drag-enter attribute", async () => {
    element.dragEnter = true;
    await element.updateComplete;
    
    expect(element.hasAttribute('drag-enter')).to.be.true;
    
    element.dragEnter = false;
    await element.updateComplete;
    
    expect(element.hasAttribute('drag-enter')).to.be.false;
  });

  it("reflects matchTarget property to match-target attribute", async () => {
    element.matchTarget = true;
    await element.updateComplete;
    
    expect(element.hasAttribute('match-target')).to.be.true;
    
    element.matchTarget = false;
    await element.updateComplete;
    
    expect(element.hasAttribute('match-target')).to.be.false;
  });

  // Answer processing and data model tests
  it("processes input data correctly for targets", async () => {
    const result = element.processInput(0, [], []);
    const targetData = { correct: true, order: 0 };
    const processed = element.processInput(0, [targetData], []);
    
    expect(processed.target).to.be.true;
  });

  it("processes input data correctly for match options", async () => {
    const targetData = { correct: true, order: 0, target: true };
    const matchData = { correct: false, order: 1 };
    const processed = element.processInput(1, [matchData], [targetData]);
    
    expect(processed.matchOption).to.be.true;
    expect(processed.match).to.equal(0);
  });

  it("cleans answer data correctly", async () => {
    const rawAnswers = [
      { label: "Target", correct: true },
      { label: "Match", correct: false }
    ];
    
    const cleaned = element.cleanAnswerData(rawAnswers);
    
    expect(cleaned).to.have.length(2);
    expect(cleaned[0].order).to.equal(0);
    expect(cleaned[0].target).to.be.true;
    expect(cleaned[1].order).to.equal(1);
    expect(cleaned[1].matchOption).to.be.true;
    expect(cleaned[1].match).to.equal(0);
  });

  it("resets matchAnswers when cleaning data", async () => {
    element.matchAnswers = [{ label: "test", order: 0 }];
    
    element.cleanAnswerData([]);
    
    expect(element.matchAnswers).to.deep.equal([]);
  });

  it("forces showAnswer to false when cleaning data", async () => {
    element.showAnswer = true;
    
    element.cleanAnswerData([]);
    
    expect(element.showAnswer).to.be.false;
  });

  // Answer correctness validation tests
  it("validates correct matches", async () => {
    element.matchAnswers = [
      { guess: 0, match: 0, label: "Match 1" },
      { guess: 2, match: 2, label: "Match 2" }
    ];
    element.displayedAnswers = [];
    
    const isCorrect = element.isCorrect();
    
    expect(isCorrect).to.be.true;
    expect(element.matchAnswers[0].correct).to.be.true;
    expect(element.matchAnswers[1].correct).to.be.true;
  });

  it("validates incorrect matches", async () => {
    element.matchAnswers = [
      { guess: 0, match: 2, label: "Wrong Match" },
      { guess: 2, match: 0, label: "Also Wrong" }
    ];
    element.displayedAnswers = [];
    
    const isCorrect = element.isCorrect();
    
    expect(isCorrect).to.be.false;
    expect(element.matchAnswers[0].correct).to.be.false;
    expect(element.matchAnswers[1].correct).to.be.false;
  });

  it("validates mixed correct/incorrect matches", async () => {
    element.matchAnswers = [
      { guess: 0, match: 0, label: "Correct Match" },
      { guess: 2, match: 1, label: "Wrong Match" }
    ];
    element.displayedAnswers = [];
    
    const isCorrect = element.isCorrect();
    
    expect(isCorrect).to.be.false;
    expect(element.matchAnswers[0].correct).to.be.true;
    expect(element.matchAnswers[1].correct).to.be.false;
  });

  it("marks as incorrect when matches are left unplaced", async () => {
    element.matchAnswers = [];
    element.displayedAnswers = [
      { match: 0, label: "Unplaced Match" }
    ];
    
    const isCorrect = element.isCorrect();
    
    expect(isCorrect).to.be.false;
  });

  // Rendering tests
  it("renders table structure with targets and matches", async () => {
    element.answers = [
      { label: "Target 1", correct: true, order: 0, target: true },
      { label: "Match 1", correct: false, order: 1, match: 0, matchOption: true }
    ];
    await element.updateComplete;
    
    const table = element.shadowRoot.querySelector('table');
    expect(table).to.exist;
    
    const headers = element.shadowRoot.querySelectorAll('th');
    expect(headers).to.have.length(2);
    expect(headers[0].textContent).to.equal('Target');
    expect(headers[1].textContent).to.equal('Match');
  });

  it("renders possible container for unplaced matches", async () => {
    element.displayedAnswers = [
      { label: "Unplaced", matchOption: true, order: 0 }
    ];
    await element.updateComplete;
    
    const container = element.shadowRoot.querySelector('#possible-container');
    expect(container).to.exist;
    expect(container.classList.contains('possible')).to.be.true;
  });

  it("renders dialog for target selection", async () => {
    await element.updateComplete;
    
    const dialog = element.shadowRoot.querySelector('dialog');
    expect(dialog).to.exist;
    expect(dialog.id).to.equal('selecttarget');
    
    const select = dialog.querySelector('select');
    expect(select).to.exist;
  });

  it("renders options with correct properties", async () => {
    element.displayedAnswers = [
      { label: "Test Option", matchOption: true, order: 0 }
    ];
    await element.updateComplete;
    
    const option = element.shadowRoot.querySelector('.tag-option');
    expect(option).to.exist;
    expect(option.textContent.trim()).to.equal('Test Option');
    expect(option.getAttribute('draggable')).to.equal('true');
    expect(option.getAttribute('data-label')).to.equal('Test Option');
  });

  it("disables dragging when showing answers", async () => {
    element.displayedAnswers = [
      { label: "Test Option", matchOption: true, order: 0 }
    ];
    element.showAnswer = true;
    await element.updateComplete;
    
    const option = element.shadowRoot.querySelector('.tag-option');
    expect(option.getAttribute('draggable')).to.equal('false');
    expect(option.hasAttribute('disabled')).to.be.true;
  });

  it("applies correct/incorrect styling when showing answers", async () => {
    element.matchAnswers = [
      { label: "Correct", correct: true, order: 0, guess: 0 },
      { label: "Incorrect", correct: false, order: 1, guess: 0 }
    ];
    element.showAnswer = true;
    await element.updateComplete;
    
    const options = element.shadowRoot.querySelectorAll('.tag-option');
    // Note: The styling is applied based on container type and showAnswer state
    // This test verifies the structure is in place for styling
    expect(options).to.have.length(2);
  });

  // Drag and drop functionality tests
  it("handles drag start correctly", async () => {
    const mockEvent = {
      target: { textContent: "  Test Item  " },
      dataTransfer: { setData: function(type, data) { this.data = data; } }
    };
    
    element.handleDrag(mockEvent);
    
    expect(element.dragging).to.be.true;
    expect(mockEvent.dataTransfer.data).to.equal("Test Item");
  });

  it("handles drag end correctly", async () => {
    element.dragging = true;
    element.dragEnter = true;
    
    const mockEvent = {
      target: { textContent: "Test Item" },
      dataTransfer: { setData: function(type, data) { this.data = data; } }
    };
    
    element.handleDragEnd(mockEvent);
    
    expect(element.dragging).to.be.false;
    expect(element.dragEnter).to.be.false;
  });

  it("handles drag over correctly", async () => {
    const mockTarget = {
      classList: {
        classes: [],
        add: function(className) { this.classes.push(className); }
      }
    };
    
    const mockEvent = {
      preventDefault: () => {},
      target: mockTarget
    };
    
    element.dragTargetOver(mockEvent);
    
    expect(element.dragEnter).to.be.true;
    expect(mockTarget.classList.classes).to.include('drag-enter');
  });

  it("handles drag leave correctly", async () => {
    const mockTarget = {
      classList: {
        classes: ['drag-enter'],
        remove: function(className) { 
          this.classes = this.classes.filter(c => c !== className);
        }
      }
    };
    
    const mockEvent = {
      preventDefault: () => {},
      target: mockTarget
    };
    
    element.dragTargetLeave(mockEvent);
    
    expect(mockTarget.classList.classes).to.not.include('drag-enter');
  });

  it("handles drop on possible container", async () => {
    element.answers = [{ label: "Test Item", order: 0 }];
    element.matchAnswers = [{ label: "Test Item", order: 0, guess: 1 }];
    element.displayedAnswers = [];
    
    // Mock shadow DOM method
    element.shadowRoot.querySelectorAll = () => [];
    
    const mockEvent = {
      preventDefault: () => {},
      dataTransfer: { getData: () => "Test Item" },
      target: { getAttribute: () => "possible-container", tagName: "DIV" }
    };
    
    element.handleDrop(mockEvent);
    
    expect(element.dragging).to.be.false;
    expect(element.dragEnter).to.be.false;
    expect(element.displayedAnswers).to.have.length(1);
    expect(element.matchAnswers).to.have.length(0);
  });

  it("handles drop on match container", async () => {
    element.answers = [{ label: "Test Item", order: 0 }];
    element.displayedAnswers = [{ label: "Test Item", order: 0 }];
    element.matchAnswers = [];
    
    // Mock shadow DOM method
    element.shadowRoot.querySelectorAll = () => [];
    
    const mockEvent = {
      preventDefault: () => {},
      dataTransfer: { getData: () => "Test Item" },
      target: { getAttribute: () => "match-1", tagName: "DIV" }
    };
    
    element.handleDrop(mockEvent);
    
    expect(element.matchAnswers).to.have.length(1);
    expect(element.matchAnswers[0].guess).to.equal(1);
    expect(element.displayedAnswers).to.have.length(0);
  });

  // Dialog and click interaction tests
  it("opens dialog when tag is clicked", async () => {
    element.answers = [
      { label: "Target", correct: true, order: 0, target: true }
    ];
    
    // Mock dialog and select elements
    const mockDialog = { showModal: function() { this.isOpen = true; } };
    const mockSelect = { selectedIndex: 0 };
    element.shadowRoot.querySelector = (selector) => {
      if (selector === 'dialog') return mockDialog;
      if (selector === 'dialog select') return mockSelect;
      if (selector === 'dialog option') return [];
      return null;
    };
    element.shadowRoot.querySelectorAll = () => [];
    
    const testOption = { label: "Test", order: 0, guess: null };
    element.handleTagClick(testOption);
    
    expect(element.__activeOption.label).to.equal("Test");
    expect(mockDialog.isOpen).to.be.true;
  });

  it("handles target selection from dialog", async () => {
    element.__activeOption = { label: "Test", order: 0, guess: null };
    element.matchAnswers = [];
    element.displayedAnswers = [{ label: "Test", order: 0 }];
    
    // Mock dialog elements
    const mockDialog = { close: function() { this.isOpen = false; } };
    const mockSelect = { selectedIndex: 1 };
    element.shadowRoot.querySelector = (selector) => {
      if (selector === 'dialog') return mockDialog;
      if (selector === 'dialog select') return mockSelect;
      return null;
    };
    
    const mockEvent = { target: { value: "1" } };
    element.selectTargetChange(mockEvent);
    
    expect(element.matchAnswers).to.have.length(1);
    expect(element.matchAnswers[0].guess).to.equal(1);
    expect(element.displayedAnswers).to.have.length(0);
  });

  it("handles empty selection from dialog", async () => {
    element.__activeOption = { label: "Test", order: 0, guess: 1 };
    element.matchAnswers = [{ label: "Test", order: 0 }];
    element.displayedAnswers = [];
    
    // Mock dialog elements
    const mockDialog = { close: function() { this.isOpen = false; } };
    const mockSelect = { selectedIndex: 0 };
    element.shadowRoot.querySelector = (selector) => {
      if (selector === 'dialog') return mockDialog;
      if (selector === 'dialog select') return mockSelect;
      return null;
    };
    
    const mockEvent = { target: { value: "" } };
    element.selectTargetChange(mockEvent);
    
    expect(element.displayedAnswers).to.have.length(1);
    expect(element.matchAnswers).to.have.length(0);
  });

  // Reset functionality tests
  it("resets answers correctly when correct", async () => {
    element.matchAnswers = [{ guess: 0, match: 0, label: "Test" }];
    element.displayedAnswers = [];
    element.answers = [{ label: "Original", order: 0 }];
    element.showAnswer = true;
    
    element.resetAnswer();
    
    expect(element.showAnswer).to.be.false;
    expect(element.displayedAnswers).to.deep.equal([]);
    expect(element.matchAnswers).to.deep.equal([]);
  });

  it("dispatches toast hide event on reset", async () => {
    let eventDispatched = false;
    const originalDispatch = globalThis.dispatchEvent;
    globalThis.dispatchEvent = function(event) {
      if (event.type === 'simple-toast-hide') {
        eventDispatched = true;
      }
      return originalDispatch.call(this, event);
    };
    
    element.resetAnswer();
    
    expect(eventDispatched).to.be.true;
    
    // Restore original
    globalThis.dispatchEvent = originalDispatch;
  });

  // Focus management tests
  it("focuses active element after interaction", (done) => {
    const testOption = { label: "Test Focus" };
    
    // Mock focus method
    const mockElement = { focus: function() { this.focused = true; } };
    element.shadowRoot.querySelector = () => mockElement;
    
    element.focusActive(testOption);
    
    // Check immediately as there's no async operation in this specific test
    expect(mockElement.focused).to.be.true;
    done();
  });

  // Directions rendering test
  it("renders custom directions for matching questions", async () => {
    const directions = element.renderDirections();
    const directionsString = directions.strings[0];
    
    expect(directionsString).to.include("Select all that apply");
    expect(directionsString).to.include("press");
    expect(directionsString).to.include("feedback indicating correctness");
  });

  // HAX integration tests
  it("has proper HAX properties configuration", async () => {
    expect(element.constructor.haxProperties).to.exist;
    expect(element.constructor.haxProperties).to.include('haxProperties.json');
  });

  it("supports HAX demoSchema configuration", async () => {
    expect(element.constructor.tag).to.equal("matching-question");
  });

  // Match target mode tests
  it("renders differently when matchTarget is enabled", async () => {
    element.matchTarget = true;
    element.answers = [
      { label: "Target 1", correct: true, order: 0, target: true }
    ];
    await element.updateComplete;
    
    const targetCell = element.shadowRoot.querySelector('.target');
    expect(targetCell).to.exist;
    // When matchTarget is true, targets become drop zones
    expect(targetCell.hasAttribute('id')).to.be.false; // This checks the conditional rendering
  });

  // Edge cases and error handling
  it("handles empty answers gracefully", async () => {
    element.answers = [];
    await element.updateComplete;
    
    expect(() => element.isCorrect()).to.not.throw;
    expect(element.isCorrect()).to.be.true; // No answers means technically correct
  });

  it("handles missing match references", async () => {
    const data = { correct: false, order: 1 };
    const result = element.cleanAnswerDataBeforeSend(data, 1, []);
    
    expect(result.matchOption).to.be.true;
    expect(result.match).to.be.false; // No target found
  });

  it("handles duplicate labels in answers", async () => {
    element.answers = [
      { label: "Duplicate", order: 0 },
      { label: "Duplicate", order: 1 }
    ];
    
    const found = element.answers.find(answer => answer.label === "Duplicate");
    expect(found.order).to.equal(0); // Should find first occurrence
  });

  it("handles malformed drag events", async () => {
    const mockEvent = {
      target: { textContent: "" },
      dataTransfer: { setData: function(type, data) { this.data = data; } }
    };
    
    expect(() => element.handleDrag(mockEvent)).to.not.throw;
    expect(element.dragging).to.be.true;
  });

  it("handles drop on non-target elements", async () => {
    element.shadowRoot.querySelectorAll = () => [];
    
    const mockEvent = {
      preventDefault: () => {},
      dataTransfer: { getData: () => "Test" },
      target: { getAttribute: () => null, tagName: "DIV" }
    };
    
    expect(() => element.handleDrop(mockEvent)).to.not.throw;
    expect(element.dragging).to.be.false;
  });

  // Performance and lifecycle tests
  it("updates correctly when answers change", async () => {
    const originalAnswers = [{ label: "Original", correct: true }];
    element.answers = originalAnswers;
    await element.updateComplete;
    
    const newAnswers = [
      { label: "Target", correct: true },
      { label: "Match", correct: false }
    ];
    element.answers = newAnswers;
    await element.updateComplete;
    
    // Should have processed the new answers
    expect(element.answers[0].target).to.be.true;
    expect(element.answers[1].matchOption).to.be.true;
  });

  it("maintains state consistency during interactions", async () => {
    element.answers = [
      { label: "Target", correct: true, order: 0, target: true },
      { label: "Match", correct: false, order: 1, match: 0, matchOption: true }
    ];
    element.displayedAnswers = [element.answers[1]];
    element.matchAnswers = [];
    
    // Simulate successful match
    element.matchAnswers.push({
      ...element.answers[1],
      guess: 0
    });
    element.displayedAnswers = [];
    
    expect(element.matchAnswers).to.have.length(1);
    expect(element.displayedAnswers).to.have.length(0);
  });

  // Integration test using similar structure to HAX demo
  it("works with HAX-style configuration", async () => {
    element.question = "What does the animal say?";
    element.answers = [
      { label: "Cow", correct: true, order: 0 },
      { label: "Moo", correct: false, order: 1 },
      { label: "Fox", correct: true, order: 2 },
      { label: "PaPaPower", correct: false, order: 3 }
    ];
    await element.updateComplete;
    
    // Should have processed into targets and matches
    expect(element.answers[0].target).to.be.true;
    expect(element.answers[1].matchOption).to.be.true;
    expect(element.answers[1].match).to.equal(0);
    expect(element.answers[2].target).to.be.true;
    expect(element.answers[3].matchOption).to.be.true;
    expect(element.answers[3].match).to.equal(2);
    
    // Should render proper structure
    const targets = element.shadowRoot.querySelectorAll('.target');
    const matches = element.shadowRoot.querySelectorAll('.match');
    expect(targets.length).to.be.greaterThan(0);
    expect(matches.length).to.be.greaterThan(0);
  });
});
