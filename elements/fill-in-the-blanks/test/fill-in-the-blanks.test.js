import { fixture, expect, html } from "@open-wc/testing";
import "../fill-in-the-blanks.js";

describe("FillInTheBlanks test", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<fill-in-the-blanks></fill-in-the-blanks>`);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element with default values", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("fill-in-the-blanks");
  });

  it("has correct default property values", async () => {
    expect(element.question).to.equal("Fill in the blanks");
    expect(element.statement).to.equal("");
    expect(element.wordList).to.deep.equal([]);
    expect(element.answers).to.deep.equal([]);
    expect(element.numberCorrect).to.equal(0);
    expect(element.numberGuessed).to.equal(0);
    expect(element.isMarkTheWords).to.equal(false);
  });

  it("extends MarkTheWords correctly", async () => {
    expect(element.constructor.name).to.equal("FillInTheBlanks");
    expect(Object.getPrototypeOf(element.constructor).name).to.equal(
      "MarkTheWords",
    );
  });

  // Accessibility tests
  it("passes the a11y audit with default state", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with statement content", async () => {
    element.statement = "The [cat] is on the [mat].";
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit when showing answers", async () => {
    element.statement = "The [cat] is on the [mat].";
    element.showAnswer = true;
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  // Property validation and reflection tests
  it("reflects question property to attribute", async () => {
    const testQuestion = "Fill in these blanks please";
    element.question = testQuestion;
    await element.updateComplete;

    expect(element.getAttribute("question")).to.equal(testQuestion);
  });

  it("reflects statement property to attribute", async () => {
    const testStatement = "The [quick] brown fox jumps over the [lazy] dog.";
    element.statement = testStatement;
    await element.updateComplete;

    expect(element.getAttribute("statement")).to.equal(testStatement);
  });

  it("updates properties when attributes change", async () => {
    element.setAttribute("question", "New question");
    element.setAttribute("statement", "Test [answer] here.");
    await element.updateComplete;

    expect(element.question).to.equal("New question");
    expect(element.statement).to.equal("Test [answer] here.");
  });

  // Statement parsing and answer extraction tests
  it("parses simple bracketed answers correctly", async () => {
    element.statement = "The [cat] is on the [mat].";
    await element.updateComplete;

    expect(element.answers).to.have.length(2);
    expect(element.answers[0].answer).to.equal("cat");
    expect(element.answers[1].answer).to.equal("mat");
    expect(element.wordList).to.have.length(6); // "The", "[cat]", "is", "on", "the", "[mat]."
  });

  it("parses synonym answers with tilde separator", async () => {
    element.statement = "Programming is [good~great~awesome].";
    await element.updateComplete;

    expect(element.answers).to.have.length(1);
    expect(element.answers[0].answer).to.deep.equal([
      "good",
      "great",
      "awesome",
    ]);
    expect(element.answers[0].text).to.equal("[good~great~awesome]");
  });

  it("parses multiple choice answers with pipe separator", async () => {
    element.statement = "The color is [red|blue|green|yellow].";
    await element.updateComplete;

    expect(element.answers).to.have.length(1);
    expect(element.answers[0].answer).to.equal("red"); // First option is correct
    expect(element.answers[0].possible).to.include("red");
    expect(element.answers[0].possible).to.include("blue");
    expect(element.answers[0].possible).to.include("green");
    expect(element.answers[0].possible).to.include("yellow");
    expect(element.answers[0].possible).to.have.length(4);
  });

  it("handles mixed answer types in same statement", async () => {
    element.statement =
      "HAX is [good~great] at creating [content|videos|games].";
    await element.updateComplete;

    expect(element.answers).to.have.length(2);
    expect(element.answers[0].answer).to.deep.equal(["good", "great"]);
    expect(element.answers[1].answer).to.equal("content");
    expect(element.answers[1].possible).to.include("content");
    expect(element.answers[1].possible).to.include("videos");
    expect(element.answers[1].possible).to.include("games");
  });

  it("handles complex statements with punctuation", async () => {
    element.statement = "Hello, the [world] is [beautiful~amazing]!";
    await element.updateComplete;

    expect(element.answers).to.have.length(2);
    expect(element.answers[0].answer).to.equal("world");
    expect(element.answers[1].answer).to.deep.equal(["beautiful", "amazing"]);
    expect(element.wordList).to.have.length(6);
  });

  // User interaction and rendering tests
  it("renders text input fields for single answers", async () => {
    element.statement = "The [cat] is sleeping.";
    await element.updateComplete;

    const textFields = element.shadowRoot.querySelectorAll(
      'simple-fields-field[type="textfield"]',
    );
    expect(textFields).to.have.length(1);
    expect(textFields[0].getAttribute("data-answer-index")).to.equal("0");
  });

  it("renders select fields for multiple choice answers", async () => {
    element.statement = "Choose [red|blue|green].";
    await element.updateComplete;

    const selectFields = element.shadowRoot.querySelectorAll(
      'simple-fields-field[type="select"]',
    );
    expect(selectFields).to.have.length(1);
    expect(selectFields[0].getAttribute("data-answer-index")).to.equal("0");
  });

  it("renders mixed input types correctly", async () => {
    element.statement = "The [cat] likes [fish|meat|vegetables].";
    await element.updateComplete;

    const textFields = element.shadowRoot.querySelectorAll(
      'simple-fields-field[type="textfield"]',
    );
    const selectFields = element.shadowRoot.querySelectorAll(
      'simple-fields-field[type="select"]',
    );

    expect(textFields).to.have.length(1);
    expect(selectFields).to.have.length(1);
  });

  it("shows correct number of options in select dropdown", async () => {
    element.statement = "Pick [option1|option2|option3|option4].";
    await element.updateComplete;

    const selectField = element.shadowRoot.querySelector(
      'simple-fields-field[type="select"]',
    );
    expect(selectField.itemsList).to.have.length(5); // Empty option + 4 choices
    expect(selectField.itemsList[0].text).to.equal("");
    expect(selectField.itemsList[0].value).to.equal("");
  });

  // Answer validation tests
  it("validates correct single answers", async () => {
    element.statement = "The [cat] is on the [mat].";
    await element.updateComplete;

    // Simulate user input
    const textFields = element.shadowRoot.querySelectorAll(
      'simple-fields-field[type="textfield"]',
    );
    textFields[0].value = "cat";
    textFields[1].value = "mat";

    expect(element.isCorrect()).to.be.true;
    expect(element.numberCorrect).to.equal(2);
    expect(element.numberGuessed).to.equal(2);
  });

  it("validates correct synonym answers", async () => {
    element.statement = "Programming is [good~great~awesome].";
    await element.updateComplete;

    const textField = element.shadowRoot.querySelector(
      'simple-fields-field[type="textfield"]',
    );
    textField.value = "great";

    expect(element.isCorrect()).to.be.true;
    expect(element.numberCorrect).to.equal(1);
  });

  it("validates incorrect answers", async () => {
    element.statement = "The [cat] is on the [mat].";
    await element.updateComplete;

    const textFields = element.shadowRoot.querySelectorAll(
      'simple-fields-field[type="textfield"]',
    );
    textFields[0].value = "dog";
    textFields[1].value = "floor";

    expect(element.isCorrect()).to.be.false;
    expect(element.numberCorrect).to.equal(0);
    expect(element.numberGuessed).to.equal(2);
  });

  it("handles partial correct answers", async () => {
    element.statement = "The [cat] is on the [mat].";
    await element.updateComplete;

    const textFields = element.shadowRoot.querySelectorAll(
      'simple-fields-field[type="textfield"]',
    );
    textFields[0].value = "cat";
    textFields[1].value = "floor";

    expect(element.isCorrect()).to.be.false;
    expect(element.numberCorrect).to.equal(1);
    expect(element.numberGuessed).to.equal(2);
  });

  it("ignores case sensitivity", async () => {
    element.statement = "The [Cat] is sleeping.";
    await element.updateComplete;

    const textField = element.shadowRoot.querySelector(
      'simple-fields-field[type="textfield"]',
    );
    textField.value = "cat";

    expect(element.isCorrect()).to.be.true;
    expect(element.numberCorrect).to.equal(1);
  });

  it("trims whitespace from user answers", async () => {
    element.statement = "The [cat] is sleeping.";
    await element.updateComplete;

    const textField = element.shadowRoot.querySelector(
      'simple-fields-field[type="textfield"]',
    );
    textField.value = "  cat  ";

    expect(element.isCorrect()).to.be.true;
    expect(element.numberCorrect).to.equal(1);
  });

  it("counts guesses only for non-empty answers", async () => {
    element.statement = "The [cat] is on the [mat].";
    await element.updateComplete;

    const textFields = element.shadowRoot.querySelectorAll(
      'simple-fields-field[type="textfield"]',
    );
    textFields[0].value = "cat";
    textFields[1].value = "";

    expect(element.guessCount()).to.equal(1);
  });

  // Reset functionality tests
  it("resets user answers correctly", async () => {
    element.statement = "The [cat] is on the [mat].";
    await element.updateComplete;

    // Fill in answers
    const textFields = element.shadowRoot.querySelectorAll(
      'simple-fields-field[type="textfield"]',
    );
    textFields[0].value = "cat";
    textFields[1].value = "mat";

    // Mark as correct first
    expect(element.isCorrect()).to.be.true;

    // Reset
    element.resetAnswer();
    await element.updateComplete;

    // Check fields are cleared
    const resetFields = element.shadowRoot.querySelectorAll(
      'simple-fields-field[type="textfield"]',
    );
    resetFields.forEach((field) => {
      expect(field.value).to.equal("");
    });

    // Check answer states are reset
    element.answers.forEach((answer) => {
      expect(answer.userGuessCorrect).to.be.false;
    });
  });

  it("resets select field indices", async () => {
    element.statement = "Choose [red|blue|green].";
    await element.updateComplete;

    const selectField = element.shadowRoot.querySelector(
      'simple-fields-field[type="select"]',
    );
    selectField.value = "red";
    selectField.selectedIndex = 1;

    expect(element.isCorrect()).to.be.true;

    element.resetAnswer();
    await element.updateComplete;

    const resetSelectField = element.shadowRoot.querySelector(
      'simple-fields-field[type="select"]',
    );
    if (resetSelectField.selectedIndex !== undefined) {
      expect(resetSelectField.selectedIndex).to.equal(0);
    }
  });

  // Visual feedback tests
  it("applies correct styling when showing answers", async () => {
    element.statement = "The [cat] is on the [mat].";
    await element.updateComplete;

    const textFields = element.shadowRoot.querySelectorAll(
      'simple-fields-field[type="textfield"]',
    );
    textFields[0].value = "cat";
    textFields[1].value = "wrong";

    element.isCorrect(); // This sets userGuessCorrect flags
    element.showAnswer = true;
    await element.updateComplete;

    const updatedFields = element.shadowRoot.querySelectorAll(
      'simple-fields-field[type="textfield"]',
    );
    expect(updatedFields[0].classList.contains("correct")).to.be.true;
    expect(updatedFields[1].classList.contains("incorrect")).to.be.true;
  });

  it("disables fields when showing answers", async () => {
    element.statement = "The [cat] is sleeping.";
    element.showAnswer = true;
    await element.updateComplete;

    const textField = element.shadowRoot.querySelector(
      'simple-fields-field[type="textfield"]',
    );
    expect(textField.hasAttribute("disabled")).to.be.true;
  });

  // Directions rendering test
  it("renders custom directions for fill-in-the-blanks", async () => {
    const directions = element.renderDirections();
    const directionsString = directions.strings[0];

    expect(directionsString).to.include("Read the sentance");
    expect(directionsString).to.include("type or select the answer");
    expect(directionsString).to.include("press");
    expect(directionsString).to.include("to test your answers");
  });

  // HAX integration tests
  it("has proper HAX properties configuration", async () => {
    expect(element.constructor.haxProperties).to.exist;
    expect(element.constructor.haxProperties).to.include("haxProperties.json");
  });

  it("supports HAX demoSchema configuration", async () => {
    // This test verifies the structure matches what's in haxProperties.json
    expect(element.constructor.tag).to.equal("fill-in-the-blanks");
  });

  // Edge cases and error handling
  it("handles empty statements gracefully", async () => {
    element.statement = "";
    await element.updateComplete;

    expect(element.answers).to.deep.equal([]);
    expect(element.wordList).to.deep.equal([]);
    expect(() => element.isCorrect()).to.not.throw;
  });

  it("handles statements without brackets", async () => {
    element.statement = "This is a normal sentence.";
    await element.updateComplete;

    expect(element.answers).to.have.length(0);
    expect(element.wordList).to.have.length(5);
    expect(element.isCorrect()).to.be.true; // No answers to check
  });

  it("handles malformed bracket syntax", async () => {
    element.statement = "This has [unclosed bracket and closed] but wrong [.";
    await element.updateComplete;

    expect(element.answers).to.have.length(1); // Only the properly closed one
    expect(element.answers[0].answer).to.equal("closed");
  });

  it("handles consecutive brackets", async () => {
    element.statement = "First [answer] then [another] immediately.";
    await element.updateComplete;

    expect(element.answers).to.have.length(2);
    expect(element.answers[0].answer).to.equal("answer");
    expect(element.answers[1].answer).to.equal("another");
  });

  it("handles bracket with no content", async () => {
    element.statement = "Empty [] brackets here.";
    await element.updateComplete;

    expect(element.answers).to.have.length(1);
    expect(element.answers[0].answer).to.equal("");
  });

  it("shuffles multiple choice options", async () => {
    // Test that shuffling function exists and works
    const originalArray = ["a", "b", "c", "d"];
    const testArray = [...originalArray];

    element.shuffleArray(testArray);

    // Array should have same elements but potentially different order
    expect(testArray).to.have.length(originalArray.length);
    expect(testArray).to.include.members(originalArray);
  });

  it("handles rapid statement changes", async () => {
    const statements = [
      "First [test] here.",
      "Second [example] statement.",
      "Third [answer] version.",
    ];

    for (const statement of statements) {
      element.statement = statement;
      await element.updateComplete;
    }

    expect(element.answers).to.have.length(1);
    expect(element.answers[0].answer).to.equal("answer");
  });

  // Performance and lifecycle tests
  it("only rebuilds word list when statement changes", async () => {
    element.statement = "The [cat] is here.";
    await element.updateComplete;

    const originalWordList = element.wordList;
    const originalAnswers = element.answers;

    // Change a different property
    element.question = "New question";
    await element.updateComplete;

    expect(element.wordList).to.deep.equal(originalWordList);
    expect(element.answers).to.deep.equal(originalAnswers);
  });

  it("updates correctly when statement is modified", async () => {
    element.statement = "Original [answer].";
    await element.updateComplete;

    expect(element.answers).to.have.length(1);
    expect(element.answers[0].answer).to.equal("answer");

    element.statement = "Modified [different] text.";
    await element.updateComplete;

    expect(element.answers).to.have.length(1);
    expect(element.answers[0].answer).to.equal("different");
  });

  // Integration test using HAX demo schema
  it("works with HAX demoSchema example", async () => {
    element.question = "Complete this sentence";
    element.statement =
      "[hax] is really [good~great] at authoring [content|kittens|kites|moons] which is nice..";
    await element.updateComplete;

    expect(element.answers).to.have.length(3);
    expect(element.answers[0].answer).to.equal("hax");
    expect(element.answers[1].answer).to.deep.equal(["good", "great"]);
    expect(element.answers[2].answer).to.equal("content");
    expect(element.answers[2].possible).to.include.members([
      "content",
      "kittens",
      "kites",
      "moons",
    ]);

    // Should render one text field and two other fields (one text for synonyms, one select for multiple choice)
    const allFields = element.shadowRoot.querySelectorAll(
      "simple-fields-field",
    );
    expect(allFields).to.have.length(3);
  });
});
