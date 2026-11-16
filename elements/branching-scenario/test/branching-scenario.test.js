import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { executeServerCommand, setViewport } from "@web/test-runner-commands";
import "../branching-scenario.js";
import {
  componentId,
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

// the approved sample: the missing blade guard, 9 scenes and 4 endings
const scenario = (attrs = {}) => html`
  <branching-scenario
    title="The missing blade guard"
    start="${attrs.start || ""}"
  >
    <branching-scene
      scene-id="start"
      id="start"
      heading="The blade guard is off"
    >
      <p>You arrive for your shift. The table saw's blade guard is off.</p>
      <ul>
        <li><a href="#cut">Make the cut carefully</a></li>
        <li><a href="#guard">Refit the guard first</a></li>
        <li><a href="#supervisor">Ask the supervisor</a></li>
      </ul>
      <p>
        <a href="#start">Read this again</a>
        <a href="#nowhere">A broken choice</a>
        <a href="https://example.org/saws">Saw manual</a>
      </p>
    </branching-scene>
    <branching-scene scene-id="cut" id="cut" heading="Kickback">
      <p>The board kicks back and hits the wall beside you.</p>
      <ul>
        <li><a href="#injury">Keep going, it was a fluke</a></li>
        <li><a href="#report">Shut the saw down and report it</a></li>
        <li><a href="#start">Think again</a></li>
      </ul>
    </branching-scene>
    <branching-scene scene-id="guard" id="guard" heading="A missing screw">
      <p>You find the guard, but one mounting screw is missing.</p>
      <ul>
        <li><a href="#shifted">Use it, it mostly holds</a></li>
        <li><a href="#tagged">Tag the saw out of service</a></li>
      </ul>
    </branching-scene>
    <branching-scene
      scene-id="supervisor"
      id="supervisor"
      heading="The supervisor"
    >
      <p>Your supervisor asks you to tag the saw out of service.</p>
      <ul>
        <li><a href="#tagged">Tag it and log it</a></li>
      </ul>
    </branching-scene>
    <branching-scene scene-id="report" id="report" heading="The report">
      <p>Your supervisor tags the saw out and asks what happened.</p>
      <ul>
        <li><a href="#warning">Explain what you did</a></li>
      </ul>
    </branching-scene>
    <branching-scene
      scene-id="tagged"
      id="tagged"
      heading="Safe call"
      ending="good"
      score="3"
    >
      <p>Best outcome. The saw is tagged out and logged.</p>
    </branching-scene>
    <branching-scene
      scene-id="shifted"
      id="shifted"
      heading="Partly safe"
      ending="mixed"
      score="1"
    >
      <p>The guard shifted during the next cut.</p>
    </branching-scene>
    <branching-scene
      scene-id="warning"
      id="warning"
      heading="Partly safe"
      ending="mixed"
      score="2"
    >
      <p>Reporting it was right.</p>
    </branching-scene>
    <branching-scene
      scene-id="injury"
      id="injury"
      heading="Injury"
      ending="poor"
      score="0"
    >
      <p>A second kickback breaks your thumb.</p>
    </branching-scene>
    <branching-scene scene-id="lost" id="lost" heading="Nobody comes here">
      <p>No choice leads to this scene.</p>
    </branching-scene>
  </branching-scenario>
`;

const scene = (el, id) => el.querySelector(`branching-scene[scene-id="${id}"]`);
const link = (el, from, to) =>
  scene(el, from).querySelector(`a[href="#${to}"]`);
const shown = (el) =>
  el.scenes
    .filter((s) => s.shadowRoot && s.shadowRoot.querySelector(".scene"))
    .map((s) => s.getAttribute("scene-id"));
const pathIds = (el) => el.path.map((s) => s.getAttribute("scene-id"));

async function ready(el) {
  await el.updateComplete;
  await Promise.all(el.scenes.map((s) => s.updateComplete));
  await waitUntil(() => shown(el).length >= 1, "a scene is shown");
}

// click a choice the way a learner does, and wait for the arrival
async function pick(el, from, to) {
  const a = link(el, from, to);
  const event = new MouseEvent("click", {
    bubbles: true,
    composed: true,
    cancelable: true,
  });
  a.dispatchEvent(event);
  await waitUntil(
    () => el.currentScene === scene(el, to) && shown(el)[0] === to,
    `arrived at ${to}`,
  );
  await waitUntil(
    () => el.shadowRoot.querySelector("#status").textContent.trim() !== "",
    "arrival announced",
  );
  return event;
}

describe("branching-scenario", () => {
  let el;
  let events;
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-0000000000b5",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  beforeEach(async () => {
    el = await fixture(scenario());
    events = [];
    el.addEventListener("user-engagement", (e) => events.push(e.detail));
    await ready(el);
  });

  describe("path", () => {
    it("shows only the start scene, the first one unless start names another", async () => {
      expect(shown(el)).to.deep.equal(["start"]);
      const other = await fixture(scenario({ start: "guard" }));
      await ready(other);
      expect(shown(other)).to.deep.equal(["guard"]);
    });

    it("moves along the path when a choice link is clicked", async () => {
      const event = await pick(el, "start", "cut");
      expect(event.defaultPrevented).to.equal(true);
      expect(pathIds(el)).to.deep.equal(["start", "cut"]);
      await pick(el, "cut", "report");
      expect(pathIds(el)).to.deep.equal(["start", "cut", "report"]);
      const stops = el.shadowRoot.querySelectorAll(".trail-item");
      expect(stops.length).to.equal(3);
      expect(el.shadowRoot.querySelector("#seen").textContent).to.include(
        "3 of 10 scenes seen",
      );
    });

    it("steps back one scene and starts over", async () => {
      await pick(el, "start", "cut");
      await pick(el, "cut", "report");
      expect(el.shadowRoot.querySelector("#back").hidden).to.equal(false);
      el.shadowRoot.querySelector("#back").click();
      await waitUntil(() => shown(el)[0] === "cut");
      expect(pathIds(el)).to.deep.equal(["start", "cut"]);
      el.shadowRoot.querySelector("#restart").click();
      await waitUntil(() => shown(el)[0] === "start");
      expect(pathIds(el)).to.deep.equal(["start"]);
      expect(el.shadowRoot.querySelector("#back").hidden).to.equal(true);
      // what was seen stays counted
      expect(el.shadowRoot.querySelector("#seen").textContent).to.include(
        "3 of 10",
      );
    });

    it("goes back to a scene already on the path instead of visiting it twice", async () => {
      await pick(el, "start", "cut");
      await pick(el, "cut", "start");
      expect(pathIds(el)).to.deep.equal(["start"]);
    });

    it("leaves unknown, self and outside links alone", async () => {
      const send = (a) => {
        const event = new MouseEvent("click", {
          bubbles: true,
          composed: true,
          cancelable: true,
        });
        // keep the test page where it is
        a.addEventListener("click", (e) => e.preventDefault(), { once: true });
        const prevented = [];
        el.addEventListener(
          "click",
          (e) => prevented.push(e.defaultPrevented),
          { once: true, capture: true },
        );
        a.dispatchEvent(event);
        return prevented[0];
      };
      const first = scene(el, "start");
      expect(send(first.querySelector('a[href="#start"]'))).to.equal(false);
      expect(send(first.querySelector('a[href="#nowhere"]'))).to.equal(false);
      expect(send(first.querySelector('a[href^="https"]'))).to.equal(false);
      await el.updateComplete;
      expect(pathIds(el)).to.deep.equal(["start"]);
      expect(events.length).to.equal(0);
    });

    it("moves focus to the new scene heading and announces it", async () => {
      await pick(el, "start", "cut");
      const target = scene(el, "cut");
      await waitUntil(
        () =>
          target.shadowRoot.activeElement &&
          target.shadowRoot.activeElement.id === "heading",
        "focus is on the heading",
      );
      expect(document.activeElement).to.equal(target);
      expect(
        el.shadowRoot.querySelector("#status").textContent.trim(),
      ).to.equal("Scene 2: Kickback");
    });

    it("styles only the real choices as buttons, without touching them", async () => {
      const first = scene(el, "start");
      const display = (sel) =>
        getComputedStyle(first.querySelector(sel)).display;
      await waitUntil(() => display('a[href="#cut"]') === "block");
      expect(display('a[href="#nowhere"]')).to.equal("inline");
      expect(display('a[href="#start"]')).to.equal("inline");
      expect(first.querySelector('a[href="#cut"]').attributes.length).to.equal(
        1,
      );
      const before = document.adoptedStyleSheets.length;
      el.remove();
      expect(document.adoptedStyleSheets.length).to.equal(before - 1);
    });
  });

  describe("endings", () => {
    it("shows each ending with its word, icon and score", async () => {
      await pick(el, "start", "supervisor");
      await pick(el, "supervisor", "tagged");
      const good = scene(el, "tagged").shadowRoot;
      expect(good.querySelector(".scene").dataset.ending).to.equal("good");
      expect(good.querySelector(".outcome-word").textContent).to.equal(
        "Good ending",
      );
      expect(good.querySelector(".outcome-score").textContent).to.equal(
        "Score 3 of 3",
      );
      expect(
        good.querySelector(".outcome simple-icon-lite").getAttribute("icon"),
      ).to.equal("icons:check");
      expect(el.shadowRoot.querySelector("#again").hidden).to.equal(false);
      expect(
        el.shadowRoot.querySelector("#status").textContent.trim(),
      ).to.equal("Ending: Safe call. Good ending. Score 3 of 3");
      expect(
        el.shadowRoot
          .querySelector(".ddd-block-chip")
          .hasAttribute("data-done"),
      ).to.equal(true);

      el.shadowRoot.querySelector("#again").click();
      await waitUntil(() => shown(el)[0] === "start");
      await pick(el, "start", "cut");
      await pick(el, "cut", "injury");
      const poor = scene(el, "injury").shadowRoot;
      expect(poor.querySelector(".outcome-word").textContent).to.equal(
        "Poor ending",
      );
      expect(poor.querySelector(".outcome-score").textContent).to.equal(
        "Score 0 of 3",
      );
      expect(
        poor.querySelector(".outcome simple-icon-lite").getAttribute("icon"),
      ).to.equal("icons:close");
    });

    it("gives a mixed ending the neutral treatment", async () => {
      await pick(el, "start", "guard");
      await pick(el, "guard", "shifted");
      const mixed = scene(el, "shifted").shadowRoot;
      expect(mixed.querySelector(".outcome-word").textContent).to.equal(
        "Mixed ending",
      );
      expect(
        mixed.querySelector(".outcome simple-icon-lite").getAttribute("icon"),
      ).to.equal("icons:remove");
    });
  });

  describe("light DOM", () => {
    it("is unchanged by rendering, moving along a path and going back", async () => {
      const fresh = await fixture(scenario());
      const authored = fresh.innerHTML;
      const attrs = fresh.getAttributeNames().join(",");
      await ready(fresh);
      await pick(fresh, "start", "guard");
      await pick(fresh, "guard", "tagged");
      await fresh.back();
      await fresh.restart();
      expect(fresh.innerHTML).to.equal(authored);
      expect(fresh.getAttributeNames().join(",")).to.equal(attrs);
    });

    it("keeps every scene and working anchors where the element is not defined", () => {
      // what a page without JavaScript has: the same markup, never upgraded
      const doc = document.implementation.createHTMLDocument("");
      doc.body.innerHTML = el.outerHTML;
      const plain = doc.body.firstElementChild;
      expect(plain.querySelectorAll("branching-scene").length).to.equal(10);
      plain
        .querySelectorAll('a[href="#cut"], a[href="#tagged"]')
        .forEach((a) => {
          expect(doc.getElementById(a.getAttribute("href").slice(1))).to.exist;
        });
    });
  });

  describe("xAPI", () => {
    it("sends progressed for a choice and completed at an ending, both conformant", async () => {
      await pick(el, "start", "guard");
      expect(events.length).to.equal(1);
      const progressed = events[0].statement;
      expect(events[0].activityDisplay).to.equal("progressed");
      expect(progressed.verb.id).to.equal(
        "http://adlnet.gov/expapi/verbs/progressed",
      );
      expect(progressed.result.completion).to.equal(false);
      expect(progressed.result.response).to.equal(
        [componentId("start"), componentId("guard")].join("[,]"),
      );
      expect(progressed.object.definition.interactionType).to.equal(
        "sequencing",
      );
      expect(progressed.object.definition.choices.length).to.equal(10);
      let r = await executeServerCommand("xapi-validate", progressed);
      expect(r.errors).to.deep.equal([]);

      await pick(el, "guard", "shifted");
      expect(events.map((e) => e.activityDisplay)).to.deep.equal([
        "progressed",
        "progressed",
        "completed",
      ]);
      const completed = events[2].statement;
      expect(completed.verb.id).to.equal(
        "http://adlnet.gov/expapi/verbs/completed",
      );
      expect(completed.result.completion).to.equal(true);
      expect(completed.result.success).to.equal(false);
      expect(events[2].resultSuccess).to.equal(false);
      expect(completed.result.score.raw).to.equal(1);
      expect(completed.result.score.max).to.equal(3);
      expect(completed.result.response).to.equal(
        ["start", "guard", "shifted"].map((id) => componentId(id)).join("[,]"),
      );
      expect(completed.object.id).to.equal(progressed.object.id);
      r = await executeServerCommand("xapi-validate", completed);
      expect(r.errors).to.deep.equal([]);
    });

    it("marks only a good ending a success, and sends each ending once a visit", async () => {
      await pick(el, "start", "supervisor");
      await pick(el, "supervisor", "tagged");
      const completed = events.filter((e) => e.activityDisplay === "completed");
      expect(completed.length).to.equal(1);
      expect(completed[0].statement.result.success).to.equal(true);
      expect(completed[0].statement.result.score.scaled).to.equal(1);
      const r = await executeServerCommand(
        "xapi-validate",
        completed[0].statement,
      );
      expect(r.errors).to.deep.equal([]);
      await el.back();
      await pick(el, "supervisor", "tagged");
      expect(
        events.filter((e) => e.activityDisplay === "completed").length,
      ).to.equal(1);
      await el.restart();
      await pick(el, "start", "cut");
      await pick(el, "cut", "injury");
      expect(
        events.filter((e) => e.activityDisplay === "completed").length,
      ).to.equal(2);
    });

    it("declares a vocabulary that counts toward completion", () => {
      const v = customElements.get("branching-scenario").xapiVocabulary;
      expect(v.verbs).to.deep.equal(["progressed", "completed"]);
      expect(v.countsTowardCompletion).to.equal(true);
    });
  });

  describe("HAX editing", () => {
    it("shows every scene with its id, flags problems and sends nothing", async () => {
      await pick(el, "start", "cut");
      events.length = 0;
      el.haxeditModeChanged(true);
      await ready(el);
      await waitUntil(() => shown(el).length === 10, "all scenes shown");
      const notes = (id) => scene(el, id).shadowRoot.textContent;
      expect(notes("cut")).to.include("Scene id: cut");
      expect(notes("start")).to.include("Start");
      expect(notes("lost")).to.include("No choice links to this scene.");
      expect(notes("start")).to.include("#nowhere");
      expect(notes("cut")).to.not.include("No choice links");
      // links are edited, not followed, and nothing is recorded
      const a = link(el, "start", "guard");
      expect(getComputedStyle(a).display).to.not.equal("block");
      const event = new MouseEvent("click", {
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      a.addEventListener("click", (e) => e.preventDefault(), { once: true });
      a.dispatchEvent(event);
      el.choose(scene(el, "tagged"));
      await el.updateComplete;
      expect(events.length).to.equal(0);
      expect(el.shadowRoot.querySelector("#back")).to.equal(null);
      await expect(el).shadowDom.to.be.accessible();
      await expect(scene(el, "lost")).shadowDom.to.be.accessible();

      // leaving edit mode starts from a clean slate
      el.haxeditModeChanged(false);
      await ready(el);
      await waitUntil(() => shown(el).length === 1);
      expect(pathIds(el)).to.deep.equal(["start"]);
      expect(
        el.shadowRoot
          .querySelector(".ddd-block-chip")
          .hasAttribute("data-done"),
      ).to.equal(false);
    });

    it("never saves learner state or runtime markup", async () => {
      const authored = el.innerHTML;
      await pick(el, "start", "guard");
      await pick(el, "guard", "tagged");
      el.haxeditModeChanged(true);
      await ready(el);
      expect(el.innerHTML).to.equal(authored);
      expect(el.getAttributeNames().sort()).to.deep.equal(["start", "title"]);
    });

    it("saves a scene with the id its links need", () => {
      const node = document.createElement("branching-scene");
      node.setAttribute("scene-id", "cut");
      scene(el, "cut").haxpreProcessNodeToContent(node);
      expect(node.getAttribute("id")).to.equal("cut");
      node.setAttribute("id", "mine");
      scene(el, "cut").haxpreProcessNodeToContent(node);
      expect(node.getAttribute("id")).to.equal("mine");
    });

    it("adds a scene with an unused id from the context menu", async () => {
      const menu = {};
      el.haxinlineContextMenu(menu);
      expect(menu.ceButtons[0].label).to.equal("Add scene");
      el[menu.ceButtons[0].callback]();
      await waitUntil(() => el.scenes.length === 11);
      expect(el.scenes[10].getAttribute("scene-id")).to.equal("scene-11");
    });
  });

  describe("accessibility", () => {
    it("passes the a11y audit on a mid scene", async () => {
      await pick(el, "start", "cut");
      await expect(el).shadowDom.to.be.accessible();
      await expect(scene(el, "cut")).shadowDom.to.be.accessible();
      await expect(el).to.be.accessible();
    });

    it("passes the a11y audit on each kind of ending", async () => {
      await pick(el, "start", "guard");
      await pick(el, "guard", "tagged");
      await expect(el).shadowDom.to.be.accessible();
      await expect(scene(el, "tagged")).shadowDom.to.be.accessible();
      await el.back();
      await pick(el, "guard", "shifted");
      await expect(scene(el, "shifted")).shadowDom.to.be.accessible();
      await el.restart();
      await pick(el, "start", "cut");
      await pick(el, "cut", "injury");
      await expect(scene(el, "injury")).shadowDom.to.be.accessible();
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
        // light-dark() resolves against the used color-scheme. The explicit
        // Canvas background is needed because axe assumes a white page when
        // none is set, which would hide dark mode contrast failures.
        root.style.colorScheme = "dark";
        body.style.backgroundColor = "Canvas";
        body.style.color = "CanvasText";
      });
      afterEach(() => {
        root.style.colorScheme = previous.scheme;
        body.style.backgroundColor = previous.background;
        body.style.color = previous.color;
      });

      it("passes the a11y audit in dark mode, mid scene and ending", async () => {
        await pick(el, "start", "guard");
        await expect(el).shadowDom.to.be.accessible();
        await expect(scene(el, "guard")).shadowDom.to.be.accessible();
        await expect(el).to.be.accessible();
        await pick(el, "guard", "shifted");
        await expect(el).shadowDom.to.be.accessible();
        await expect(scene(el, "shifted")).shadowDom.to.be.accessible();
      });
    });
  });

  describe("phone width", () => {
    afterEach(() => setViewport({ width: 1000, height: 800 }));

    it("fits 360px without page scroll, with targets of at least 24px", async () => {
      await setViewport({ width: 360, height: 740 });
      await pick(el, "start", "guard");
      await pick(el, "guard", "tagged");
      const fits = () =>
        document.documentElement.scrollWidth <= window.innerWidth;
      expect(fits()).to.equal(true);
      el.shadowRoot.querySelectorAll("button:not([hidden])").forEach((b) => {
        const box = b.getBoundingClientRect();
        expect(box.height).to.be.at.least(24);
        expect(box.width).to.be.at.least(24);
      });
      await el.back();
      expect(fits()).to.equal(true);
      scene(el, "guard")
        .querySelectorAll('a[href^="#"]')
        .forEach((a) => {
          expect(a.getBoundingClientRect().height).to.be.at.least(24);
        });
    });
  });
});
