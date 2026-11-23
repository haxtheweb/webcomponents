import { fixture, expect, html } from "@open-wc/testing";

import "../lib/model-option.js";
import { ModelOption } from "../lib/model-option.js";
import "../course-model.js";

describe("model-option", () => {
  it("registers the custom element", () => {
    expect(globalThis.customElements.get("model-option")).to.exist;
  });

  it("has the expected static tag", () => {
    expect(ModelOption.tag).to.equal("model-option");
  });

  it("has default property values", async () => {
    const el = await fixture(html`<model-option></model-option>`);
    expect(el.title).to.equal("");
    expect(el.url).to.equal("");
    expect(el.src).to.equal("");
  });

  it("renders the option card with title and slot content", async () => {
    const el = await fixture(html`
      <model-option title="Astronaut Suit">
        <p>Explore the suit.</p>
      </model-option>
    `);
    await el.updateComplete;
    const button = el.shadowRoot.querySelector("button.option");
    expect(button).to.exist;
    // the card is a native button, so no heading sits inside it
    expect(button.getAttribute("type")).to.equal("button");
    expect(el.shadowRoot.querySelector("#title h2")).to.not.exist;
    expect(el.shadowRoot.querySelector("#accent-color")).to.exist;
    expect(
      el.shadowRoot.querySelector("#title .title-text").textContent,
    ).to.equal("Astronaut Suit");
    expect(el.textContent).to.include("Explore the suit.");
    await expect(el).shadowDom.to.be.accessible();
  });

  it("dispatches a composed model-select event on click", async () => {
    const el = await fixture(
      html`<model-option title="Moon Model" src="moon.gltf"></model-option>`,
    );
    await el.updateComplete;
    let caught = null;
    el.addEventListener("model-select", (e) => {
      caught = e;
    });
    el.shadowRoot.querySelector("button.option").click();
    expect(caught).to.exist;
    // the detail is the element itself so course-model can read src/title
    expect(caught.detail).to.exist;
    expect(caught.detail.src).to.equal("moon.gltf");
    expect(caught.detail.title).to.equal("Moon Model");
    expect(caught.bubbles).to.be.true;
    expect(caught.composed).to.be.true;
  });

  it("drives a parent course-model through model-select", async () => {
    const parent = await fixture(html`
      <course-model title="Course" src="course.gltf">
        <model-option title="Rocket Model" src="rocket.gltf"></model-option>
      </course-model>
    `);
    await parent.updateComplete;
    const option = parent.querySelector("model-option");
    option.shadowRoot.querySelector("button.option").click();
    await parent.updateComplete;
    expect(parent.src).to.equal("rocket.gltf");
    expect(parent.title).to.equal("Rocket Model");
    expect(parent.visible).to.equal("model");
  });

  it("is a native button the keyboard reaches", async () => {
    const el = await fixture(
      html`<model-option title="Moon Model" src="moon.gltf"></model-option>`,
    );
    await el.updateComplete;
    const button = el.shadowRoot.querySelector("button.option");
    button.focus();
    expect(el.shadowRoot.activeElement === button).to.be.true;
    let count = 0;
    el.addEventListener("model-select", () => {
      count += 1;
    });
    // Enter and Space on a native button fire click
    button.click();
    expect(count).to.equal(1);
  });
});
