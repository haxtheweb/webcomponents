import { expect } from "@open-wc/testing";
import {
  KeyboardShortcutManager,
  KeyboardShortcutManagerInstance,
} from "../utils.js";

/**
 * Exercise the centralized KeyboardShortcutManager registry that backs all
 * HAX keyboard/markdown/Merlin shortcuts. Tests use a fresh manager instance
 * (not the shared singleton) where isolation matters so they do not pollute
 * or depend on whatever else has registered into the global singleton.
 */
describe("KeyboardShortcutManager", () => {
  describe("singleton", () => {
    it("exposes a shared singleton instance", async () => {
      expect(KeyboardShortcutManagerInstance).to.be.instanceOf(
        KeyboardShortcutManager,
      );
      // requestAvailability returns the same instance
      expect(globalThis.KeyboardShortcutManager.requestAvailability()).to.equal(
        KeyboardShortcutManagerInstance,
      );
    });
  });

  describe("binding shortcuts", () => {
    let mgr;
    beforeEach(() => {
      mgr = new KeyboardShortcutManager();
    });

    it("registers a binding and resolves it by combo", async () => {
      const stored = mgr.register({
        id: "cms-save",
        key: "S",
        ctrl: true,
        shift: true,
        description: "Save page",
        context: "edit",
      });
      expect(stored.id).to.equal("cms-save");
      expect(stored.type).to.equal("binding");

      const found = mgr.getByBinding("s", true, true, false, false);
      expect(found).to.not.be.null;
      expect(found.id).to.equal("cms-save");
      expect(found.key).to.equal("S");
      expect(found.ctrl).to.be.true;
      expect(found.shift).to.be.true;
    });

    it("defaults type to binding and derives an id from the combo", async () => {
      const stored = mgr.register({ key: "E", ctrl: true, shift: true });
      expect(stored.type).to.equal("binding");
      expect(stored.id).to.equal("Ctrl+Shift+E");
      expect(mgr.getByBinding("e", true, true, false, false).id).to.equal(
        "Ctrl+Shift+E",
      );
    });

    it("returns null for an unmatched combo", async () => {
      expect(mgr.getByBinding("x", true, true)).to.be.null;
    });

    it("re-registering the same combo overwrites the previous entry", async () => {
      mgr.register({ id: "a", key: "1", ctrl: true, shift: true });
      mgr.register({ id: "b", key: "1", ctrl: true, shift: true });
      expect(mgr.getById("a")).to.be.null;
      expect(mgr.getByBinding("1", true, true, false, false).id).to.equal("b");
    });
  });

  describe("markdown shortcuts", () => {
    let mgr;
    beforeEach(() => {
      mgr = new KeyboardShortcutManager();
    });

    it("registers a markdown trigger and resolves it", async () => {
      mgr.register({
        id: "markdown-h3",
        type: "markdown",
        trigger: "###",
        tag: "h3",
        content: "",
        context: "edit",
      });
      const found = mgr.getByTrigger("###");
      expect(found).to.not.be.null;
      expect(found.type).to.equal("markdown");
      expect(found.tag).to.equal("h3");
    });

    it("derives an id from the trigger when none supplied", async () => {
      const stored = mgr.register({ type: "markdown", trigger: ">" });
      expect(stored.id).to.equal("markdown->");
    });

    it("returns null for an unknown trigger", async () => {
      expect(mgr.getByTrigger("nope")).to.be.null;
    });
  });

  describe("query helpers", () => {
    let mgr;
    beforeEach(() => {
      mgr = new KeyboardShortcutManager();
      mgr.register({
        id: "g",
        key: "G",
        ctrl: true,
        shift: true,
        context: "global",
      });
      mgr.register({
        id: "e",
        key: "E",
        ctrl: true,
        shift: true,
        context: "edit",
      });
      mgr.register({
        id: "md",
        type: "markdown",
        trigger: "###",
        context: "edit",
      });
    });

    it("getAll returns every descriptor", async () => {
      expect(mgr.getAll().length).to.equal(3);
    });

    it("getByContext includes global + matching context", async () => {
      const edit = mgr.getByContext("edit");
      const ids = edit.map((s) => s.id).sort();
      expect(ids).to.deep.equal(["e", "g", "md"]);
      const view = mgr.getByContext("view");
      expect(view.map((s) => s.id)).to.deep.equal(["g"]);
    });

    it("getByType filters by type", async () => {
      expect(mgr.getByType("markdown").map((s) => s.id)).to.deep.equal(["md"]);
      expect(
        mgr
          .getByType("binding")
          .map((s) => s.id)
          .sort(),
      ).to.deep.equal(["e", "g"]);
    });

    it("getById returns a copy, not the internal reference", async () => {
      const a = mgr.getById("e");
      const b = mgr.getById("e");
      expect(a).to.not.equal(b);
      expect(a.id).to.equal(b.id);
    });
  });

  describe("getMarkdownByTag", () => {
    let mgr;
    beforeEach(() => {
      mgr = new KeyboardShortcutManager();
      // Mimic HAXStore's default markdown registrations (tag collisions:
      // ---, ***, ___ all -> hr; -, *, + all -> ul)
      mgr.register({ id: "md-h3", type: "markdown", trigger: "###", tag: "h3" });
      mgr.register({ id: "md-ul1", type: "markdown", trigger: "-", tag: "ul" });
      mgr.register({ id: "md-ul2", type: "markdown", trigger: "*", tag: "ul" });
      mgr.register({ id: "md-hr1", type: "markdown", trigger: "---", tag: "hr" });
      mgr.register({ id: "md-hr2", type: "markdown", trigger: "***", tag: "hr" });
    });

    it("resolves the first registered markdown shortcut for a tag", async () => {
      const ul = mgr.getMarkdownByTag("ul");
      expect(ul).to.not.be.null;
      expect(ul.tag).to.equal("ul");
      expect(ul.trigger).to.equal("-");
    });

    it("returns null for a tag with no markdown shortcut", async () => {
      expect(mgr.getMarkdownByTag("video-player")).to.be.null;
      expect(mgr.getMarkdownByTag("")).to.be.null;
      expect(mgr.getMarkdownByTag(null)).to.be.null;
    });

    it("does not match binding shortcuts", async () => {
      mgr.register({ id: "b", key: "B", ctrl: true, shift: true });
      expect(mgr.getMarkdownByTag("B")).to.be.null;
    });
  });

  describe("unregister", () => {
    let mgr;
    beforeEach(() => {
      mgr = new KeyboardShortcutManager();
      mgr.register({ id: "cms-save", key: "S", ctrl: true, shift: true });
      mgr.register({
        id: "md-h3",
        type: "markdown",
        trigger: "###",
        tag: "h3",
      });
    });

    it("removes a binding by id", async () => {
      mgr.unregister("cms-save");
      expect(mgr.getById("cms-save")).to.be.null;
      expect(mgr.getByBinding("s", true, true, false, false)).to.be.null;
    });

    it("removes a markdown shortcut by id", async () => {
      mgr.unregister("md-h3");
      expect(mgr.getByTrigger("###")).to.be.null;
    });

    it("supports the legacy (key, ctrl, shift, alt, meta) signature", async () => {
      mgr.unregister("S", true, true, false, false);
      expect(mgr.getById("cms-save")).to.be.null;
    });

    it("is a no-op for unknown ids", async () => {
      expect(() => mgr.unregister("does-not-exist")).to.not.throw();
    });
  });

  describe("labels", () => {
    it("generates legacy-style binding labels", async () => {
      expect(
        KeyboardShortcutManager.generateLabel({
          key: "S",
          ctrl: true,
          shift: true,
        }),
      ).to.equal("Ctrl\u21e7S");
      expect(
        KeyboardShortcutManager.generateLabel({
          key: "[",
          ctrl: true,
          shift: true,
        }),
      ).to.equal("Ctrl\u21e7[");
    });

    it("returns the trigger for markdown labels", async () => {
      expect(
        KeyboardShortcutManager.generateLabel({
          type: "markdown",
          trigger: "###",
        }),
      ).to.equal("###");
    });

    it("getForDisplay exposes label/description/context/key", async () => {
      const mgr = new KeyboardShortcutManager();
      mgr.register({
        id: "cms-save",
        key: "S",
        ctrl: true,
        shift: true,
        description: "Save page",
        context: "edit",
      });
      mgr.register({
        id: "md-h3",
        type: "markdown",
        trigger: "###",
        tag: "h3",
        description: "Heading 3",
        context: "edit",
      });
      const display = mgr.getForDisplay();
      const save = display.find((d) => d.id === "cms-save");
      expect(save.label).to.equal("Ctrl\u21e7S");
      expect(save.key).to.equal("S");
      expect(save.context).to.equal("edit");
      const md = display.find((d) => d.id === "md-h3");
      expect(md.label).to.equal("###");
      expect(md.key).to.equal("###");
    });
  });
});
