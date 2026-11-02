import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lib/super-daemon-ui.js";
import "../lib/super-daemon-row.js";
import "../super-daemon.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import { SuperDaemonInstance } from "../super-daemon.js";

// The modal's details pane and the wand popover's "Open full Merlin":
// the pane runs and follows the right result, details stay reachable on
// narrow screens, and expanding keeps what was typed.
describe("super-daemon details pane and expand", () => {
  let element;
  const items = () => [
    {
      title: "Alpha",
      index: "alpha",
      path: "CMS/alpha",
      value: { a: 1 },
      eventName: "sd-test-alpha",
    },
    {
      title: "Beta",
      index: "beta",
      path: "CMS/beta",
      value: { b: 2 },
      eventName: "sd-test-beta",
      more: html`<a href="https://example.com/tos">Terms</a>`,
    },
  ];

  beforeEach(async () => {
    UserScaffoldInstance.active = false;
    SuperDaemonInstance.programName = null;
    // the full list is a lit-virtualizer, which only stamps rows when it
    // has room to lay them out
    element = await fixture(
      html`<super-daemon-ui style="height: 600px"></super-daemon-ui>`,
    );
    element.loading = false;
    element.items = items();
    await element.updateComplete;
    await aTimeout(500);
  });

  it("runs the previewed result from its data when its row is not rendered", async () => {
    element._previewIndex = 1;
    await element.updateComplete;
    // simulate the virtualizer having scrolled the row out of the DOM
    element._rowAt = () => null;
    let detail = null;
    let closed = false;
    const onRun = (e) => {
      detail = e.detail;
    };
    const onClose = () => {
      closed = true;
    };
    globalThis.addEventListener("sd-test-beta", onRun);
    element.addEventListener("super-daemon-close", onClose);
    element.shadowRoot.querySelector(".details-run").click();
    globalThis.removeEventListener("sd-test-beta", onRun);
    element.removeEventListener("super-daemon-close", onClose);
    expect(detail).to.deep.equal({ b: 2 });
    expect(closed).to.equal(true);
  });

  it("follows keyboard focus moving between result rows", async () => {
    const rows = element.shadowRoot.querySelectorAll("super-daemon-row");
    expect(rows.length).to.be.greaterThan(1);
    rows[1].focus();
    await element.updateComplete;
    expect(element._previewIndex).to.equal(1);
    expect(
      element.shadowRoot.querySelector(".details-title").textContent.trim(),
    ).to.equal("Beta");
  });

  it("keeps the inline details toggle on modal rows, marked as shown in the pane", async () => {
    const rows = element.shadowRoot.querySelectorAll("super-daemon-row");
    const beta = Array.from(rows).find((r) => r.title === "Beta");
    expect(beta.more).to.equal(true);
    expect(beta.hasAttribute("details-in-pane")).to.equal(true);
    // the toggle and details still render, for screens without the pane
    expect(beta.shadowRoot.querySelector("details")).to.exist;
  });
});

describe("super-daemon expand keeps what was typed", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<super-daemon></super-daemon>`);
    element.allItems = [];
    element.items = [];
    element.like = "";
    element.programName = null;
    element.programSearch = "";
    element.mini = true;
    element.wand = true;
    element.opened = true;
    await element.updateComplete;
  });

  afterEach(() => {
    element.opened = false;
  });

  it("carries global search text from the popover into the dialog", async () => {
    const popoverUi = element.shadowRoot.querySelector("super-daemon-ui");
    popoverUi.like = "imag";
    element.expand();
    await element.updateComplete;
    await aTimeout(120);
    expect(element.mini).to.equal(false);
    expect(element.like).to.equal("imag");
    const ui = element.shadowRoot.querySelector("super-daemon-ui");
    expect(ui).to.not.equal(popoverUi);
    const search = ui.shadowRoot.querySelector("super-daemon-search");
    expect(search.value).to.equal("imag");
  });

  it("keeps a running program's input as program input, not the global filter", async () => {
    element.programName = "Create a page";
    element.like = "";
    await element.updateComplete;
    const popoverUi = element.shadowRoot.querySelector("super-daemon-ui");
    popoverUi.programSearch = "Lesson 3";
    element.expand();
    await element.updateComplete;
    await aTimeout(120);
    expect(element.programSearch).to.equal("Lesson 3");
    expect(element.like).to.equal("");
    const ui = element.shadowRoot.querySelector("super-daemon-ui");
    const search = ui.shadowRoot.querySelector("super-daemon-search");
    expect(search.value).to.equal("Lesson 3");
  });
});
