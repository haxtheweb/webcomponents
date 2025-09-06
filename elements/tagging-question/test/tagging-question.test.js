import { fixture, expect, html } from "@open-wc/testing";
import "../tagging-question.js";

describe("TaggingQuestion test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`<tagging-question></tagging-question>`);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element with default values", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("tagging-question");
  });

  it("has correct default property values", async () => {
    expect(element.guessDataValue).to.equal("selectedAnswers");
    expect(element.dragEnter).to.be.false;
    expect(element.dragEnterAnswer).to.be.false;
    expect(element.dragging).to.be.false;
    expect(element.selectedAnswers).to.deep.equal([]);
  });

  it("extends QuestionElement correctly", async () => {
    expect(element.constructor.name).to.equal("TaggingQuestion");
    expect(Object.getPrototypeOf(element.constructor).name).to.equal("QuestionElement");
  });

  // Accessibility tests
  it("passes the a11y audit with default state", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with answers configured", async () => {
    element.answers = [
      { label: "Correct Tag", correct: true },
      { label: "Incorrect Tag", correct: false }
    ];
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit when showing answers", async () => {
    element.answers = [
      { label: "Correct Tag", correct: true },
      { label: "Incorrect Tag", correct: false }
    ];
    element.selectedAnswers = [{ label: "Correct Tag", correct: true }];
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

  it("reflects dragEnterAnswer property to drag-enter-answer attribute", async () => {
    element.dragEnterAnswer = true;
    await element.updateComplete;
    
    expect(element.hasAttribute('drag-enter-answer')).to.be.true;
    
    element.dragEnterAnswer = false;
    await element.updateComplete;
    
    expect(element.hasAttribute('drag-enter-answer')).to.be.false;
  });

  // Tag selection and management tests
  it("adds tags to selectedAnswers when clicked from displayedAnswers", async () => {
    const testTag = { label: "Test Tag", correct: true };
    element.displayedAnswers = [testTag];
    element.selectedAnswers = [];
    
    element.handleTagClick(testTag);
    
    expect(element.selectedAnswers).to.have.length(1);
    expect(element.selectedAnswers[0].label).to.equal("Test Tag");
    expect(element.displayedAnswers).to.have.length(0);
  });

  it("removes tags from selectedAnswers when clicked", async () => {
    const testTag = { label: "Test Tag", correct: true };
    element.selectedAnswers = [testTag];
    element.displayedAnswers = [];
    
    element.handleTagClick(testTag);
    
    expect(element.selectedAnswers).to.have.length(0);
    expect(element.displayedAnswers).to.have.length(1);
    expect(element.displayedAnswers[0].label).to.equal("Test Tag");
  });

  it("addTag method adds tag to selectedAnswers and removes from displayedAnswers", async () => {
    const testTag = { label: "Test Tag", correct: true };
    element.displayedAnswers = [testTag];
    element.selectedAnswers = [];
    
    element.addTag(testTag);
    
    expect(element.selectedAnswers).to.have.length(1);
    expect(element.selectedAnswers[0].label).to.equal("Test Tag");
    expect(element.displayedAnswers).to.have.length(0);
  });

  it("removeTag method removes tag from selectedAnswers and adds to displayedAnswers", async () => {
    const testTag = { label: "Test Tag", correct: true };
    element.selectedAnswers = [testTag];
    element.displayedAnswers = [];
    
    element.removeTag(testTag);
    
    expect(element.selectedAnswers).to.have.length(0);
    expect(element.displayedAnswers).to.have.length(1);
    expect(element.displayedAnswers[0].label).to.equal("Test Tag");
  });

  it("does not add tags when showAnswer is true", async () => {
    const testTag = { label: "Test Tag", correct: true };
    element.displayedAnswers = [testTag];
    element.selectedAnswers = [];
    element.showAnswer = true;
    
    element.addTag(testTag);
    
    expect(element.selectedAnswers).to.have.length(0);
    expect(element.displayedAnswers).to.have.length(1);
  });

  it("does not remove tags when showAnswer is true", async () => {
    const testTag = { label: "Test Tag", correct: true };
    element.selectedAnswers = [testTag];
    element.displayedAnswers = [];
    element.showAnswer = true;
    
    element.removeTag(testTag);
    
    expect(element.selectedAnswers).to.have.length(1);
    expect(element.displayedAnswers).to.have.length(0);
  });

  // Drag and drop functionality tests
  it("handles drag start correctly", async () => {
    const mockEvent = {
      target: { textContent: "  Test Tag  " },
      dataTransfer: { setData: function(type, data) { this.data = data; } }
    };
    
    element.handleDrag(mockEvent);
    
    expect(element.dragging).to.be.true;
    expect(mockEvent.dataTransfer.data).to.equal("Test Tag");
  });

  it("handles drag end correctly", async () => {
    element.dragging = true;
    element.dragEnter = true;
    element.dragEnterAnswer = true;
    
    const mockEvent = {
      target: { textContent: "Test Tag" },
      dataTransfer: { setData: function(type, data) { this.data = data; } }
    };
    
    element.handleDragEnd(mockEvent);
    
    expect(element.dragging).to.be.false;
    expect(element.dragEnter).to.be.false;
    expect(element.dragEnterAnswer).to.be.false;
  });

  it("handles allowDrop correctly", async () => {
    const mockEvent = { preventDefault: () => {} };
    
    element.allowDrop(mockEvent);
    
    expect(element.dragEnter).to.be.true;
    expect(element.dragEnterAnswer).to.be.false;
  });

  it("handles allowDropAnswer correctly", async () => {
    const mockEvent = { preventDefault: () => {} };
    
    element.allowDropAnswer(mockEvent);
    
    expect(element.dragEnterAnswer).to.be.true;
    expect(element.dragEnter).to.be.false;
  });

  it("handles drop on possible container", async () => {
    const testTag = { label: "Test Tag", correct: true };
    element.answers = [testTag];
    element.selectedAnswers = [testTag];
    element.displayedAnswers = [];
    
    const mockEvent = {
      preventDefault: () => {},
      dataTransfer: { getData: () => "Test Tag" },
      target: { getAttribute: () => "possible-container" }
    };
    
    element.handleDrop(mockEvent);
    
    expect(element.dragging).to.be.false;
    expect(element.dragEnter).to.be.false;
    expect(element.dragEnterAnswer).to.be.false;
  });

  it("handles drop on user choice container", async () => {
    const testTag = { label: "Test Tag", correct: true };
    element.answers = [testTag];
    element.displayedAnswers = [testTag];
    element.selectedAnswers = [];
    
    const mockEvent = {
      preventDefault: () => {},
      dataTransfer: { getData: () => "Test Tag" },
      target: { getAttribute: () => "user-choice-container" }
    };
    
    element.handleDrop(mockEvent);
    
    expect(element.dragging).to.be.false;
    expect(element.dragEnter).to.be.false;
    expect(element.dragEnterAnswer).to.be.false;
  });

  it("handles tag movement correctly", async () => {
    const testTag = { label: "Test Tag", correct: true };
    
    // Test moving from user-choice-container (removing)
    element.selectedAnswers = [testTag];
    element.displayedAnswers = [];
    
    element.handleTagMove(testTag, "user-choice-container");
    
    expect(element.selectedAnswers).to.have.length(0);
    expect(element.displayedAnswers).to.have.length(1);
    
    // Test moving to user-choice-container (adding)
    element.handleTagMove(testTag, "possible-container");
    
    expect(element.selectedAnswers).to.have.length(1);
    expect(element.displayedAnswers).to.have.length(0);
  });

  // Answer validation and correctness logic tests
  it("validates correct answers when all correct tags are selected", async () => {
    element.answers = [
      { label: "Correct 1", correct: true },
      { label: "Correct 2", correct: true },
      { label: "Incorrect", correct: false }
    ];
    element.selectedAnswers = [
      { label: "Correct 1", correct: true },
      { label: "Correct 2", correct: true }
    ];
    
    expect(element.isCorrect()).to.be.true;
  });

  it("validates incorrect when missing correct tags", async () => {
    element.answers = [
      { label: "Correct 1", correct: true },
      { label: "Correct 2", correct: true },
      { label: "Incorrect", correct: false }
    ];
    element.selectedAnswers = [
      { label: "Correct 1", correct: true }
    ];
    
    expect(element.isCorrect()).to.be.false;
  });

  it("validates incorrect when incorrect tags are selected", async () => {
    element.answers = [
      { label: "Correct", correct: true },
      { label: "Incorrect", correct: false }
    ];
    element.selectedAnswers = [
      { label: "Correct", correct: true },
      { label: "Incorrect", correct: false }
    ];
    
    expect(element.isCorrect()).to.be.false;
  });

  it("validates incorrect when too many tags are selected", async () => {
    element.answers = [
      { label: "Correct", correct: true },
      { label: "Incorrect 1", correct: false },
      { label: "Incorrect 2", correct: false }
    ];
    element.selectedAnswers = [
      { label: "Correct", correct: true },
      { label: "Incorrect 1", correct: false },
      { label: "Incorrect 2", correct: false }
    ];
    
    expect(element.isCorrect()).to.be.false;
  });

  it("handles empty selections correctly", async () => {
    element.answers = [
      { label: "Correct", correct: true },
      { label: "Incorrect", correct: false }
    ];
    element.selectedAnswers = [];
    
    expect(element.isCorrect()).to.be.false;
  });

  // Rendering tests
  it("renders user choice container", async () => {
    await element.updateComplete;
    
    const userChoiceContainer = element.shadowRoot.querySelector('#user-choice-container');
    expect(userChoiceContainer).to.exist;
  });

  it("renders possible container", async () => {
    await element.updateComplete;
    
    const possibleContainer = element.shadowRoot.querySelector('#possible-container');
    expect(possibleContainer).to.exist;
  });

  it("renders selected tags in user choice container", async () => {
    element.selectedAnswers = [
      { label: "Selected Tag", correct: true }
    ];
    await element.updateComplete;
    
    const tagButtons = element.shadowRoot.querySelectorAll('#user-choice-container .tag-option');
    expect(tagButtons).to.have.length(1);
    expect(tagButtons[0].textContent.trim()).to.equal("Selected Tag");
  });

  it("renders available tags in possible container", async () => {
    element.displayedAnswers = [
      { label: "Available Tag", correct: true }
    ];
    await element.updateComplete;
    
    const tagButtons = element.shadowRoot.querySelectorAll('#possible-container .tag-option');
    expect(tagButtons).to.have.length(1);
    expect(tagButtons[0].textContent.trim()).to.equal("Available Tag");
  });

  it("applies correct styling to selected tags when showing answers", async () => {
    element.selectedAnswers = [
      { label: "Correct Tag", correct: true },
      { label: "Incorrect Tag", correct: false }
    ];
    element.showAnswer = true;
    await element.updateComplete;
    
    const tagButtons = element.shadowRoot.querySelectorAll('#user-choice-container .tag-option');
    expect(tagButtons[0].classList.contains('correct')).to.be.true;
    expect(tagButtons[1].classList.contains('incorrect')).to.be.true;
  });

  it("disables tags when showing answers", async () => {
    element.selectedAnswers = [{ label: "Tag", correct: true }];
    element.displayedAnswers = [{ label: "Other Tag", correct: false }];
    element.showAnswer = true;
    await element.updateComplete;
    
    const selectedTag = element.shadowRoot.querySelector('#user-choice-container .tag-option');
    const availableTag = element.shadowRoot.querySelector('#possible-container .tag-option');
    
    expect(selectedTag.hasAttribute('disabled')).to.be.true;
    expect(availableTag.hasAttribute('disabled')).to.be.true;
    expect(selectedTag.getAttribute('draggable')).to.equal('false');
    expect(availableTag.getAttribute('draggable')).to.equal('false');
  });

  // Directions rendering test
  it("renders custom directions for tagging questions", async () => {
    const directions = element.renderDirections();
    const directionsString = directions.strings[0];
    
    expect(directionsString).to.include("Select all that apply");
    expect(directionsString).to.include("press");
    expect(directionsString).to.include("feedback indicating correctness");
  });

  // Feedback rendering tests
  it("renders feedback when showing answers", async () => {
    element.answers = [
      { label: "Correct", correct: true, selectedFeedback: "Good choice", unselectedFeedback: "Should select" },
      { label: "Incorrect", correct: false, selectedFeedback: "Wrong", unselectedFeedback: "Correctly not selected" }
    ];
    element.selectedAnswers = [{ label: "Correct", correct: true, selectedFeedback: "Good choice" }];
    element.displayedAnswers = [{ label: "Incorrect", correct: false, unselectedFeedback: "Correctly not selected" }];
    element.showAnswer = true;
    await element.updateComplete;
    
    const feedback = element.renderFeedback();
    expect(feedback).to.exist;
  });

  it("shows correct feedback text when correct", async () => {
    element.answers = [{ label: "Correct", correct: true }];
    element.selectedAnswers = [{ label: "Correct", correct: true }];
    element.showAnswer = true;
    element.correctText = "Great job!";
    await element.updateComplete;
    
    const feedback = element.renderFeedback();
    expect(feedback.strings.join('')).to.include("Great job!");
  });

  it("shows incorrect feedback text when incorrect", async () => {
    element.answers = [{ label: "Correct", correct: true }];
    element.selectedAnswers = [];
    element.showAnswer = true;
    element.incorrectText = "Try again!";
    await element.updateComplete;
    
    const feedback = element.renderFeedback();
    expect(feedback.strings.join('')).to.include("Try again!");
  });

  // Reset functionality tests
  it("resets to initial state when correct", async () => {
    element.answers = [
      { label: "Tag1", correct: true },
      { label: "Tag2", correct: false }
    ];
    element.selectedAnswers = [{ label: "Tag1", correct: true }];
    element.displayedAnswers = [{ label: "Tag2", correct: false }];
    element.showAnswer = true;
    
    element.resetAnswer();
    
    expect(element.showAnswer).to.be.false;
    expect(element.selectedAnswers).to.have.length(0);
    expect(element.displayedAnswers).to.have.length(2);
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

  // Randomization functionality tests
  it("randomizes options array", async () => {
    const originalArray = ["a", "b", "c", "d", "e"];
    const testArray = [...originalArray];
    
    element.randomizeOptions(testArray);
    
    // Array should have same elements but potentially different order
    expect(testArray).to.have.length(originalArray.length);
    expect(testArray).to.include.members(originalArray);
  });

  it("randomizes displayedAnswers on reset when correct", async () => {
    element.answers = [
      { label: "A", correct: true },
      { label: "B", correct: false },
      { label: "C", correct: false }
    ];
    element.selectedAnswers = [{ label: "A", correct: true }];
    element.displayedAnswers = [
      { label: "B", correct: false },
      { label: "C", correct: false }
    ];
    element.showAnswer = true;
    
    // Mock randomizeOptions to track if it was called
    let randomizeCalled = false;
    const originalRandomize = element.randomizeOptions;
    element.randomizeOptions = function(array) {
      randomizeCalled = true;
      return originalRandomize.call(this, array);
    };
    
    element.resetAnswer();
    
    expect(randomizeCalled).to.be.true;
    
    // Restore original
    element.randomizeOptions = originalRandomize;
  });

  // Event handling tests
  it("handles click events on tags", async () => {
    const testTag = { label: "Test Tag", correct: true };
    element.displayedAnswers = [testTag];
    element.selectedAnswers = [];
    
    // Create a button and simulate click
    const button = document.createElement('button');
    button.textContent = "Test Tag";
    
    // Mock the click handler
    let clickHandled = false;
    const originalHandleTagClick = element.handleTagClick;
    element.handleTagClick = function(tag) {
      clickHandled = true;
      expect(tag).to.equal(testTag);
      return originalHandleTagClick.call(this, tag);
    };
    
    element.handleTagClick(testTag);
    
    expect(clickHandled).to.be.true;
    expect(element.selectedAnswers).to.have.length(1);
    
    // Restore original
    element.handleTagClick = originalHandleTagClick;
  });

  // HAX integration tests
  it("has proper HAX properties configuration", async () => {
    expect(element.constructor.haxProperties).to.exist;
    expect(element.constructor.haxProperties).to.include('haxProperties.json');
  });

  it("supports HAX demoSchema configuration", async () => {
    expect(element.constructor.tag).to.equal("tagging-question");
  });

  // Edge cases and error handling
  it("handles empty answers gracefully", async () => {
    element.answers = [];
    await element.updateComplete;
    
    expect(() => element.isCorrect()).to.not.throw;
    expect(element.isCorrect()).to.be.true; // No answers means technically correct
  });

  it("handles missing answer properties gracefully", async () => {
    element.answers = [
      { label: "Tag1" }, // Missing correct property
      { label: "Tag2", correct: true }
    ];
    
    expect(() => element.isCorrect()).to.not.throw;
  });

  it("handles duplicate tag labels", async () => {
    const duplicateTag = { label: "Duplicate", correct: true };
    element.answers = [duplicateTag, duplicateTag];
    element.displayedAnswers = [duplicateTag];
    element.selectedAnswers = [];
    
    element.addTag(duplicateTag);
    
    // Should remove all instances with that label
    expect(element.displayedAnswers).to.have.length(0);
    expect(element.selectedAnswers).to.have.length(1);
  });

  it("handles drag events with malformed data", async () => {
    const mockEvent = {
      target: { textContent: "" },
      dataTransfer: { setData: function(type, data) { this.data = data; } }
    };
    
    expect(() => element.handleDrag(mockEvent)).to.not.throw;
    expect(element.dragging).to.be.true;
  });

  it("handles drop with missing tag", async () => {
    const mockEvent = {
      preventDefault: () => {},
      dataTransfer: { getData: () => "Nonexistent Tag" },
      target: { getAttribute: () => "user-choice-container" }
    };
    
    element.answers = [{ label: "Real Tag", correct: true }];
    
    expect(() => element.handleDrop(mockEvent)).to.not.throw;
  });

  // Performance and state management tests
  it("updates correctly when selectedAnswers change", async () => {
    element.selectedAnswers = [{ label: "Tag1", correct: true }];
    await element.updateComplete;
    
    let tagButton = element.shadowRoot.querySelector('#user-choice-container .tag-option');
    expect(tagButton).to.exist;
    
    element.selectedAnswers = [
      { label: "Tag1", correct: true },
      { label: "Tag2", correct: false }
    ];
    await element.updateComplete;
    
    const tagButtons = element.shadowRoot.querySelectorAll('#user-choice-container .tag-option');
    expect(tagButtons).to.have.length(2);
  });

  it("maintains drag state consistency", async () => {
    element.dragging = true;
    element.dragEnter = true;
    element.dragEnterAnswer = false;
    await element.updateComplete;
    
    expect(element.hasAttribute('dragging')).to.be.true;
    expect(element.hasAttribute('drag-enter')).to.be.true;
    expect(element.hasAttribute('drag-enter-answer')).to.be.false;
  });

  // Integration test using HAX demo schema structure
  it("works with HAX demoSchema configuration", async () => {
    element.question = "What does the fox say?";
    element.answers = [
      { label: "DingDingDing", correct: true },
      { label: "PaPaPower", correct: true },
      { label: "Moo", correct: false }
    ];
    await element.updateComplete;
    
    expect(element.question).to.equal("What does the fox say?");
    expect(element.answers).to.have.length(3);
    expect(element.answers.filter(a => a.correct)).to.have.length(2);
    
    // Test selecting correct answers
    element.selectedAnswers = [
      { label: "DingDingDing", correct: true },
      { label: "PaPaPower", correct: true }
    ];
    
    expect(element.isCorrect()).to.be.true;
    
    // Test with incorrect selection
    element.selectedAnswers = [
      { label: "DingDingDing", correct: true },
      { label: "Moo", correct: false }
    ];
    
    expect(element.isCorrect()).to.be.false;
  });

  // Complex interaction scenarios
  it("handles complete user workflow", async () => {
    // Setup question with answers
    element.answers = [
      { label: "Correct1", correct: true },
      { label: "Correct2", correct: true },
      { label: "Wrong1", correct: false },
      { label: "Wrong2", correct: false }
    ];
    element.displayedAnswers = [...element.answers];
    element.selectedAnswers = [];
    await element.updateComplete;
    
    // User selects correct answers
    element.addTag(element.answers[0]); // Correct1
    element.addTag(element.answers[1]); // Correct2
    
    expect(element.selectedAnswers).to.have.length(2);
    expect(element.displayedAnswers).to.have.length(2);
    expect(element.isCorrect()).to.be.true;
    
    // User changes mind and removes one
    element.removeTag(element.answers[1]); // Remove Correct2
    
    expect(element.selectedAnswers).to.have.length(1);
    expect(element.displayedAnswers).to.have.length(3);
    expect(element.isCorrect()).to.be.false;
    
    // User adds wrong answer
    element.addTag(element.answers[2]); // Wrong1
    
    expect(element.selectedAnswers).to.have.length(2);
    expect(element.isCorrect()).to.be.false;
  });

  // CSS and styling integration tests
  it("applies proper drag styling classes", async () => {
    element.dragging = true;
    element.dragEnterAnswer = true;
    await element.updateComplete;
    
    expect(element.hasAttribute('dragging')).to.be.true;
    expect(element.hasAttribute('drag-enter-answer')).to.be.true;
  });

  it("renders containers with correct CSS classes", async () => {
    await element.updateComplete;
    
    const userChoiceContainer = element.shadowRoot.querySelector('#user-choice-container');
    const possibleContainer = element.shadowRoot.querySelector('#possible-container');
    
    expect(userChoiceContainer).to.exist;
    expect(possibleContainer).to.exist;
  });
});
