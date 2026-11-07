import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../user-scaffold.js";

// interactionDelay counts idle time in 600 steps every 300ms up to a cap of
// 3600, and an interaction resets it. It used to be driven by a 300ms
// setInterval that ran forever, even long after the cap; now the timer
// stops at the cap and starts again when the delay is reset.

describe("UserScaffold idle counter", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<user-scaffold></user-scaffold>`);
    element.active = true;
    element.writeMemory("interactionDelay", 0);
  });
  afterEach(() => {
    element.disconnectedCallback();
  });

  it("counts up in 600 steps", async () => {
    await aTimeout(700);
    const delay = element.readMemory("interactionDelay");
    expect(delay).to.be.at.least(600);
    expect(delay % 600).to.equal(0);
  });

  it("stops its timer once the cap is reached", async () => {
    await aTimeout(2600);
    expect(element.readMemory("interactionDelay")).to.equal(3600);
    expect(element.interactionInterval).to.equal(null);
    await aTimeout(700);
    expect(element.readMemory("interactionDelay")).to.equal(3600);
  });

  it("starts counting again when an interaction resets the delay", async () => {
    await aTimeout(2600);
    expect(element.interactionInterval).to.equal(null);
    element.writeMemory("interactionDelay", 0);
    expect(element.interactionInterval).to.not.equal(null);
    await aTimeout(700);
    expect(element.readMemory("interactionDelay")).to.be.at.least(600);
  });

  it("a click resets the delay and restarts counting", async () => {
    await aTimeout(2600);
    element.userMouseAction({
      target: document.body,
      type: "click",
      isTrusted: true,
    });
    expect(element.readMemory("interactionDelay")).to.equal(0);
    expect(element.interactionInterval).to.not.equal(null);
  });

  it("does not count while inactive, and resumes when active again", async () => {
    element.active = false;
    await aTimeout(700);
    expect(element.readMemory("interactionDelay")).to.equal(0);
    element.active = true;
    await aTimeout(700);
    expect(element.readMemory("interactionDelay")).to.be.at.least(600);
  });

  it("never runs more than one timer", async () => {
    element.writeMemory("interactionDelay", 0);
    element.writeMemory("interactionDelay", 0);
    element._scheduleInteractionTick();
    await aTimeout(350);
    // one tick, one step
    expect(element.readMemory("interactionDelay")).to.equal(600);
  });

  it("stays stopped after disconnect", async () => {
    element.disconnectedCallback();
    expect(element.interactionInterval).to.equal(null);
    element.writeMemory("interactionDelay", 0);
    expect(element.interactionInterval).to.equal(null);
  });
});
