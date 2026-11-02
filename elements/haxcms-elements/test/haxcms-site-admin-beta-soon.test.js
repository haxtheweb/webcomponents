// Beta sections, Soon actions and a form section's bulk actions in the one
// admin dialog's shell: one layout for every panel (rail, page header,
// action bar), as the admin anatomy describes.
import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { getSiteAdminSection } from "../lib/core/admin/site-admin-sections.js";
import "../lib/core/admin/haxcms-site-admin.js";

/** a stand-in section that reports whatever state a test hands it */
class BetaSoonSection extends HTMLElement {
  constructor() {
    super();
    this.calls = [];
  }
  emit(detail) {
    this.dispatchEvent(
      new CustomEvent("haxcms-admin-section-state", {
        bubbles: true,
        composed: true,
        detail: detail,
      }),
    );
  }
  clearSelection() {
    this.calls.push(["clear"]);
  }
  runAction(id) {
    this.calls.push(["action", id]);
  }
  save() {
    this.calls.push(["save"]);
    return true;
  }
  discard() {
    this.calls.push(["discard"]);
  }
}
if (!globalThis.customElements.get("beta-soon-section")) {
  globalThis.customElements.define("beta-soon-section", BetaSoonSection);
}

async function shellWith(route, changes = {}) {
  const entry = getSiteAdminSection(route);
  const original = {};
  const swap = Object.assign(
    { tag: "beta-soon-section", load: () => Promise.resolve() },
    changes,
  );
  Object.keys(swap).forEach((key) => {
    original[key] = Object.prototype.hasOwnProperty.call(entry, key)
      ? { had: true, value: entry[key] }
      : { had: false };
    entry[key] = swap[key];
  });
  const shell = await fixture(
    html`<haxcms-site-admin
      style="--simple-modal-height: 720px"
    ></haxcms-site-admin>`,
  );
  shell.allowRoute = () => true;
  shell.route = route;
  await waitUntil(() => shell._sectionEl, "section element created");
  await shell.updateComplete;
  const restore = () => {
    Object.keys(original).forEach((key) => {
      if (original[key].had) {
        entry[key] = original[key].value;
      } else {
        delete entry[key];
      }
    });
  };
  return { shell, section: shell._sectionEl, restore };
}

describe("haxcms-site-admin Beta, Soon and mixed action bars", () => {
  let restore = () => {};
  afterEach(() => {
    restore();
    restore = () => {};
  });

  it("marks a beta section Beta on the rail and in the page header", async () => {
    const made = await shellWith("views", { status: "beta" });
    restore = made.restore;
    const { shell, section } = made;
    const rail = shell.shadowRoot.querySelector(
      '.rail-row .rail-item[data-route="views"] .rail-badge[data-tone="beta"]',
    );
    expect(rail, "rail badge").to.exist;
    expect(rail.textContent.trim()).to.equal(shell.t.beta);
    const pill = shell.shadowRoot.querySelector(
      '.ph h2 .hax-ui-pill[data-tone="beta"]',
    );
    expect(pill, "header pill").to.exist;
    expect(pill.textContent.trim()).to.equal(shell.t.beta);
    // other sections carry no Beta
    expect(
      shell.shadowRoot.querySelector(
        '.rail-item[data-route="files"] .rail-badge[data-tone="beta"]',
      ),
    ).to.equal(null);
  });

  it("the Views entry is beta", () => {
    expect(getSiteAdminSection("views").status).to.equal("beta");
  });

  it("draws a Soon action disabled with its pill, and never runs it", async () => {
    const made = await shellWith("views", {
      footer: "selection",
    });
    restore = made.restore;
    const { shell, section } = made;
    section.emit({
      selected: 0,
      selectionText: "5 record(s) shown",
      actions: [
        { id: "embed", label: "Embed in page", icon: "hax:embed", soon: true },
      ],
    });
    await shell.updateComplete;
    const button = shell.shadowRoot.querySelector(
      '.ftr .bulk[data-action="embed"]',
    );
    expect(button.disabled).to.equal(true);
    expect(button.classList.contains("soon")).to.equal(true);
    expect(button.getAttribute("title")).to.equal(shell.t.comingSoon);
    const pill = button.querySelector('.hax-ui-pill[data-tone="soon"]');
    expect(pill.textContent.trim()).to.equal(shell.t.soon);
    expect(shell.shadowRoot.querySelector(".ftr .st").textContent).to.contain(
      "5 record(s) shown",
    );
    // even with something selected it stays Soon
    section.emit({ selected: 2 });
    await shell.updateComplete;
    expect(
      shell.shadowRoot.querySelector('.ftr .bulk[data-action="embed"]')
        .disabled,
    ).to.equal(true);
    button.click();
    expect(section.calls).to.deep.equal([]);
  });

  it("a form section's selection and bulk actions come before Discard and Save", async () => {
    const made = await shellWith("views", { footer: "form" });
    restore = made.restore;
    const { shell, section } = made;
    section.emit({
      dirty: true,
      changes: ["Moved 2 pages"],
      canSave: true,
      selected: 2,
      actions: [{ id: "delete", label: "Delete selected", danger: true }],
    });
    await shell.updateComplete;
    const bar = shell.shadowRoot.querySelector(".ftr");
    const order = [...bar.querySelectorAll("button")].map((b) =>
      b.classList.contains("bulk")
        ? `bulk:${b.getAttribute("data-action")}`
        : [...b.classList].find((c) =>
            ["clear", "discard", "save"].includes(c),
          ),
    );
    expect(order).to.deep.equal(["clear", "bulk:delete", "discard", "save"]);
    expect(bar.querySelector(".bar-sep")).to.exist;
    expect(bar.querySelector(".st .sel").textContent).to.contain("2");
    bar.querySelector('.bulk[data-action="delete"]').click();
    bar.querySelector(".clear").click();
    expect(section.calls).to.deep.equal([["action", "delete"], ["clear"]]);
    // nothing selected: the bulk action is disabled and Clear goes away
    section.emit({ selected: 0 });
    await shell.updateComplete;
    expect(
      shell.shadowRoot.querySelector('.ftr .bulk[data-action="delete"]')
        .disabled,
    ).to.equal(true);
    expect(shell.shadowRoot.querySelector(".ftr .clear")).to.equal(null);
  });

  it("an action with needsSelection false works with nothing selected, also folded on a phone", async () => {
    const made = await shellWith("views", { footer: "form" });
    restore = made.restore;
    const { shell, section } = made;
    section.emit({
      dirty: false,
      changes: [],
      canSave: false,
      selected: 0,
      actions: [
        { id: "delete", label: "Delete selected", danger: true },
        { id: "add-page", label: "Add page", needsSelection: false },
      ],
    });
    await shell.updateComplete;
    const root = shell.shadowRoot;
    const add = root.querySelector('.ftr .bulk[data-action="add-page"]');
    expect(add.disabled).to.equal(false);
    expect(
      root.querySelector('.ftr .bulk[data-action="delete"]').disabled,
    ).to.equal(true);
    add.click();
    expect(section.calls).to.deep.equal([["action", "add-page"]]);
    // narrow: Add page folds under More, which stays usable for it
    shell._narrow = true;
    await shell.updateComplete;
    const more = root.querySelector(".more-btn");
    expect(more.disabled).to.equal(false);
    more.click();
    await shell.updateComplete;
    const folded = root.querySelector(
      '.more-menu .bulk[data-action="add-page"]',
    );
    expect(folded.disabled).to.equal(false);
    folded.click();
    expect(section.calls).to.deep.equal([
      ["action", "add-page"],
      ["action", "add-page"],
    ]);
  });
});

// Structure's save() waits on its confirm, so it returns a promise; the
// bar shows Saving only once the save is sent, then Saved from the
// editor's haxcms-admin-save-result, like every other form section
describe("haxcms-site-admin promise saves", () => {
  const result = (ok) =>
    globalThis.dispatchEvent(
      new CustomEvent("haxcms-admin-save-result", {
        detail: { operation: "@site/updateSiteOutline", ok: ok },
      }),
    );
  const dirty = (section) =>
    section.emit({ dirty: true, changes: ["1 changed"], canSave: true });

  it("waits for a promise save, then shows Saving and Saved", async () => {
    const { shell, section, restore } = await shellWith("structure");
    restore();
    let answer;
    section.save = () =>
      new Promise((resolve) => {
        answer = resolve;
      });
    dirty(section);
    await shell.updateComplete;
    const sent = shell._save();
    expect(shell._status).to.equal("dirty");
    answer(true);
    expect(await sent).to.equal(true);
    expect(shell._status).to.equal("saving");
    result(true);
    await shell.updateComplete;
    expect(shell._status).to.equal("saved");
    expect(shell.shadowRoot.querySelector(".ftr .st").textContent).to.contain(
      "saved",
    );
  });

  it("a promise save that resolves false leaves the bar as it was", async () => {
    const { shell, section, restore } = await shellWith("structure");
    restore();
    section.save = () => Promise.resolve(false);
    dirty(section);
    await shell.updateComplete;
    expect(await shell._save()).to.equal(false);
    expect(shell._status).to.equal("dirty");
    expect(shell._canSave).to.equal(true);
  });

  it("keeps a result that comes while the save is being sent", async () => {
    const { shell, section, restore } = await shellWith("structure");
    restore();
    // a failure the editor reports at once, before save() returns
    section.save = () => {
      result(false);
      return true;
    };
    dirty(section);
    await shell.updateComplete;
    expect(shell._save()).to.equal(true);
    expect(shell._status).to.equal("error");
  });
});
