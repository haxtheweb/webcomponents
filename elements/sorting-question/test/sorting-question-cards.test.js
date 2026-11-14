import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { executeServerCommand, setViewport } from "@web/test-runner-commands";
import "../sorting-question.js";
import {
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

const IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 92'%3E%3Crect width='100' height='92'/%3E%3C/svg%3E";
const LABELS = ["Seed", "Sprout", "Leafy stem", "Flower"];

const board = (layout) =>
  fixture(
    html`<sorting-question
      id="plants"
      question="How a plant grows"
      layout="${layout}"
      .randomize=${false}
    >
      ${LABELS.map(
        (label) =>
          html`<input
            value="${label}"
            data-image="${IMG}"
            data-image-alt="${label} picture"
          />`,
      )}
    </sorting-question>`,
  );
async function ready(el) {
  await waitUntil(() => el.getOptions().length === 4, "options rendered");
  await el.updateComplete;
  await Promise.all(Array.from(el.getOptions()).map((o) => o.updateComplete));
  // the end buttons settle a microtask after the cards connect
  await new Promise((r) => setTimeout(r, 0));
  await Promise.all(Array.from(el.getOptions()).map((o) => o.updateComplete));
  return el;
}
const cards = () => board("cards").then(ready);
const order = (el) =>
  Array.from(el.getOptions()).map((o) => o.textContent.trim());
const arrow = (option, id) =>
  option.shadowRoot.querySelector(`#${id}`).shadowRoot.querySelector("button");
async function press(el, index, id) {
  const option = el.getOptions()[index];
  // the direct callback: the click path wraps the same call in a view
  // transition, which is covered by the sorting-option tests
  option.arrowSortCallback(option.shadowRoot.querySelector(`#${id}`));
  await option.updateComplete;
  await el.updateComplete;
  await Promise.all(Array.from(el.getOptions()).map((o) => o.updateComplete));
}
async function check(el) {
  await el.checkAnswer();
  await waitUntil(
    () => Array.from(el.getOptions()).every((o) => o.correct || o.incorrect),
    "options marked",
  );
  await el.updateComplete;
  await Promise.all(Array.from(el.getOptions()).map((o) => o.updateComplete));
}

describe("sorting-question card layout", () => {
  it("leaves the default layout as it was", async () => {
    const el = await fixture(
      html`<sorting-question question="Order" .randomize=${false}>
        <input value="One" />
        <input value="Two" />
      </sorting-question>`,
    );
    await waitUntil(() => el.getOptions().length === 2);
    await el.updateComplete;
    expect(el.layout).to.equal(undefined);
    expect(el.hasAttribute("layout")).to.equal(false);
    expect(el.shadowRoot.querySelector("#move-status")).to.equal(null);
    const option = el.getOptions()[0];
    await option.updateComplete;
    expect(option.hasAttribute("layout")).to.equal(false);
    expect(getComputedStyle(option).display).to.equal("flex");
    expect(
      getComputedStyle(el.shadowRoot.querySelector("fieldset")).display,
    ).to.equal("flex");
    // the row keeps its arrows, titles and feedback slot exactly
    const up = option.shadowRoot.querySelector("#upArrow");
    const down = option.shadowRoot.querySelector("#downArrow");
    expect(up.getAttribute("icon")).to.equal("arrow-upward");
    expect(down.getAttribute("icon")).to.equal("arrow-downward");
    expect(up.getAttribute("title")).to.equal(
      "Select to move option up in order",
    );
    expect(up.disabled).to.equal(false);
    expect(option.shadowRoot.querySelector(".feedback-container")).to.exist;
    expect(option.shadowRoot.querySelector(".card-status")).to.equal(null);
    // an unknown value is the list too
    el.layout = "grid";
    await el.updateComplete;
    await option.updateComplete;
    expect(option.hasAttribute("layout")).to.equal(false);
  });

  it("renders a wrapping row of image cards", async () => {
    const el = await cards();
    const fieldset = el.shadowRoot.querySelector("fieldset.options");
    expect(getComputedStyle(fieldset).display).to.equal("grid");
    const options = Array.from(el.getOptions());
    options.forEach((option, i) => {
      expect(option.getAttribute("layout")).to.equal("cards");
      expect(getComputedStyle(option).display).to.equal("grid");
      // position number, image with its alt, the label
      expect(getComputedStyle(option, "::before").content).to.contain(
        "sorting-position",
      );
      const img = option.querySelector("img");
      expect(img.getAttribute("alt")).to.equal(`${LABELS[i]} picture`);
      expect(option.textContent.trim()).to.equal(LABELS[i]);
      // a move earlier and a move later button on every card, named for it
      expect(arrow(option, "upArrow").getAttribute("aria-label")).to.equal(
        `Move earlier: ${LABELS[i]}`,
      );
      expect(arrow(option, "downArrow").getAttribute("aria-label")).to.equal(
        `Move later: ${LABELS[i]}`,
      );
      expect(arrow(option, "upArrow").disabled).to.equal(i === 0);
      expect(arrow(option, "downArrow").disabled).to.equal(i === 3);
      expect(option.getAttribute("draggable")).to.equal("true");
    });
    // one row here
    const tops = options.map((o) => Math.round(o.getBoundingClientRect().top));
    expect(new Set(tops).size).to.equal(1);
    expect(el.shadowRoot.querySelector("#directions").textContent).to.contain(
      "move earlier and move later buttons",
    );
  });

  it("passes the a11y audit before and after checking", async () => {
    const el = await cards();
    await expect(el).shadowDom.to.be.accessible();
    for (const option of el.getOptions()) {
      await expect(option).shadowDom.to.be.accessible();
    }
    await press(el, 0, "downArrow");
    await check(el);
    await expect(el).shadowDom.to.be.accessible();
    for (const option of el.getOptions()) {
      await expect(option).shadowDom.to.be.accessible();
    }
  });

  it("moves cards with the buttons, announces the position and keeps focus", async () => {
    const el = await cards();
    const status = el.shadowRoot.querySelector("#move-status");
    expect(status.getAttribute("role")).to.equal("status");
    expect(status.getAttribute("aria-live")).to.equal("polite");
    const seed = el.getOptions()[0];
    arrow(seed, "downArrow").focus();
    await press(el, 0, "downArrow");
    expect(order(el)).to.deep.equal(["Sprout", "Seed", "Leafy stem", "Flower"]);
    expect(status.textContent.trim()).to.equal("Seed moved to position 2 of 4");
    // focus follows the card on its move later button
    await waitUntil(
      () =>
        seed.shadowRoot.activeElement ===
        seed.shadowRoot.querySelector("#downArrow"),
      "focus stays on the moved card",
    );
    // the ends are disabled where there is nowhere to go
    const [first, , , last] = el.getOptions();
    expect(arrow(first, "upArrow").disabled).to.equal(true);
    expect(arrow(seed, "upArrow").disabled).to.equal(false);
    expect(arrow(last, "downArrow").disabled).to.equal(true);
    // moving to the end hands focus to the button that still works
    await press(el, 1, "downArrow");
    await press(el, 2, "downArrow");
    expect(order(el)).to.deep.equal(["Sprout", "Leafy stem", "Flower", "Seed"]);
    expect(status.textContent.trim()).to.equal("Seed moved to position 4 of 4");
    await waitUntil(
      () =>
        seed.shadowRoot.activeElement ===
        seed.shadowRoot.querySelector("#upArrow"),
      "focus moves to move earlier at the end",
    );
    expect(arrow(seed, "downArrow").disabled).to.equal(true);
    // and back
    await press(el, 3, "upArrow");
    expect(order(el)).to.deep.equal(["Sprout", "Leafy stem", "Seed", "Flower"]);
    expect(status.textContent.trim()).to.equal("Seed moved to position 3 of 4");
    // the end buttons do nothing
    await press(el, 0, "upArrow");
    await press(el, 3, "downArrow");
    expect(order(el)).to.deep.equal(["Sprout", "Leafy stem", "Seed", "Flower"]);
  });

  it("a real click on a card button moves the card", async () => {
    const el = await cards();
    arrow(el.getOptions()[1], "upArrow").click();
    await waitUntil(() => order(el)[0] === "Sprout", "moved by click");
    expect(order(el)).to.deep.equal(["Sprout", "Seed", "Leafy stem", "Flower"]);
  });

  it("dragging a card over another takes its place", async () => {
    const el = await cards();
    const [seed, , stem] = el.getOptions();
    const r = stem.getBoundingClientRect();
    const at = { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2 };
    seed.dragStartCallback(at);
    expect(seed.dragging).to.equal(true);
    expect(order(el)).to.deep.equal(["Sprout", "Leafy stem", "Seed", "Flower"]);
    // the closing 0,0 drag event and a drag over itself change nothing
    seed.dragStartCallback({ clientX: 0, clientY: 0 });
    const own = seed.getBoundingClientRect();
    seed.dragStartCallback({ clientX: own.left + 5, clientY: own.top + 5 });
    expect(order(el)).to.deep.equal(["Sprout", "Leafy stem", "Seed", "Flower"]);
    // and back to the front
    const first = el.getOptions()[0].getBoundingClientRect();
    seed.dragStartCallback({ clientX: first.left + 5, clientY: first.top + 5 });
    expect(order(el)).to.deep.equal(LABELS);
    seed.dragEnd();
    expect(seed.dragging).to.equal(false);
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector("#move-status").textContent.trim(),
    ).to.equal("Seed moved to position 1 of 4");
    // a disabled card does not move
    seed.disabled = true;
    seed.dragStartCallback(at);
    expect(order(el)).to.deep.equal(LABELS);
  });

  it("scores the same as the list and marks cards with status line, icon and word", async () => {
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-000000000041",
        "https://example.org/",
      ),
    );
    const el = await cards();
    const list = await board("").then(ready);
    const events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    list.addEventListener("user-engagement", (e) => events.push(e.detail));
    // the same wrong order in both layouts
    await press(el, 0, "downArrow");
    const fieldset = list.shadowRoot.querySelector("fieldset");
    fieldset.insertBefore(list.getOptions()[1], list.getOptions()[0]);
    await check(el);
    await check(list);
    setActorProvider(null);
    expect(el.numberCorrect).to.equal(2);
    expect(list.numberCorrect).to.equal(2);
    expect(el.attempts).to.equal(1);
    expect(events.length).to.equal(2);
    const [card, row] = events.map((d) => d.statement);
    expect(card.result).to.deep.equal(row.result);
    expect(card.object.definition).to.deep.equal(row.object.definition);
    expect(card.object.definition.interactionType).to.equal("sequencing");
    expect(card.result.success).to.equal(false);
    const r = await executeServerCommand("xapi-validate", card);
    expect(r.errors).to.deep.equal([]);
    // status, never the accent: dotted for wrong, solid for right
    const marks = Array.from(el.getOptions()).map((o) => ({
      wrong: o.incorrect === true,
      style: getComputedStyle(o).borderTopStyle,
      word: o.shadowRoot.querySelector(".card-status").textContent.trim(),
      icon: o.shadowRoot
        .querySelector(".card-status simple-icon-lite")
        .getAttribute("icon"),
    }));
    expect(marks).to.deep.equal([
      { wrong: true, style: "dotted", word: "Incorrect", icon: "clear" },
      { wrong: true, style: "dotted", word: "Incorrect", icon: "clear" },
      { wrong: false, style: "solid", word: "Correct", icon: "check" },
      { wrong: false, style: "solid", word: "Correct", icon: "check" },
    ]);
    Array.from(el.getOptions()).forEach((o) => {
      expect(arrow(o, "upArrow").disabled).to.equal(true);
      expect(arrow(o, "downArrow").disabled).to.equal(true);
    });
    // try again, fix it, pass
    el.resetAnswer();
    await el.updateComplete;
    await Promise.all(Array.from(el.getOptions()).map((o) => o.updateComplete));
    expect(
      el.getOptions()[0].shadowRoot.querySelector(".card-status"),
    ).to.equal(null);
    await press(el, 1, "upArrow");
    await check(el);
    expect(el.numberCorrect).to.equal(4);
    expect(events[2].statement.result.success).to.equal(true);
    expect(el.shadowRoot.querySelector(".shell").dataset.status).to.equal(
      "correct",
    );
  });

  it("wraps to fewer columns at 360px without page scroll", async () => {
    await setViewport({ width: 360, height: 800 });
    const el = await cards();
    const options = Array.from(el.getOptions());
    const tops = new Set(
      options.map((o) => Math.round(o.getBoundingClientRect().top)),
    );
    expect(tops.size).to.be.at.least(2);
    expect(document.documentElement.scrollWidth).to.be.at.most(
      globalThis.innerWidth,
    );
    const box = el.getBoundingClientRect();
    options.forEach((o) => {
      const r = o.getBoundingClientRect();
      expect(r.right).to.be.at.most(box.right + 1);
      // buttons stay finger sized
      const b = arrow(o, "upArrow").getBoundingClientRect();
      expect(Math.min(b.width, b.height)).to.be.at.least(24);
    });
    await setViewport({ width: 800, height: 600 });
  });

  it("keeps layout out of content that never set it and saves it when set", async () => {
    const el = await cards();
    expect(el.getAttribute("layout")).to.equal("cards");
    const saved = await el.haxpreProcessNodeToContent(el);
    expect(saved.getAttribute("layout")).to.equal("cards");
    expect(
      Array.from(saved.querySelectorAll("input")).map((i) => i.value),
    ).to.deep.equal(LABELS);
  });

  describe("dark mode", () => {
    const root = document.documentElement;
    const body = document.body;
    let previous;
    beforeEach(() => {
      previous = {
        scheme: root.style.colorScheme,
        background: body.style.backgroundColor,
        color: body.style.color,
      };
      root.style.colorScheme = "dark";
      body.style.backgroundColor = "Canvas";
      body.style.color = "CanvasText";
    });
    afterEach(() => {
      root.style.colorScheme = previous.scheme;
      body.style.backgroundColor = previous.background;
      body.style.color = previous.color;
    });
    it("passes the a11y audit checked, in dark mode", async () => {
      const el = await cards();
      await press(el, 0, "downArrow");
      await check(el);
      await expect(el).shadowDom.to.be.accessible();
      for (const option of el.getOptions()) {
        await expect(option).shadowDom.to.be.accessible();
      }
    });
  });
});
