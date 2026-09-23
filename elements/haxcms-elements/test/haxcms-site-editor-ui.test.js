import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lib/core/haxcms-site-editor-ui.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";

// regression coverage for https://github.com/haxtheweb/issues/issues/3065
// internal HAX drags (e.g. dragging a block/element within the page) were
// incorrectly triggering the Merlin/upload drop-highlight because the
// activeDrag/activeType gating only checked usAction.type === "drag" and
// never verified that the drag actually carried a file.
describe("haxcms-site-editor-ui drag/file highlight gating", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`,
    );
    // let the constructor's initial autoruns settle (e.g. isLoggedIn sync)
    // before forcing the memory state that our tests depend on.
    await aTimeout(0);
    UserScaffoldInstance.active = true;
    UserScaffoldInstance.writeMemory("isLoggedIn", true);
    SuperDaemonInstance.programName = null;
    UserScaffoldInstance.action = { type: null, architype: null };
    UserScaffoldInstance.data = { raw: null, value: null, architype: null };
    await aTimeout(0);
  });

  afterEach(async () => {
    UserScaffoldInstance.action = { type: null, architype: null };
    UserScaffoldInstance.data = { raw: null, value: null, architype: null };
    await aTimeout(0);
  });

  it("does not enable the drop highlight for a non-file (internal) drag", async () => {
    UserScaffoldInstance.action = { type: "drag", architype: "input" };
    UserScaffoldInstance.data = {
      raw: "text/plain",
      value: "text/plain",
      architype: "string",
    };
    await aTimeout(0);
    expect(element.activeDrag).to.equal(false);
    expect(element.activeType).to.equal(null);
  });

  it("enables the drop highlight when a file is dragged", async () => {
    UserScaffoldInstance.action = { type: "drag", architype: "input" };
    UserScaffoldInstance.data = {
      raw: "image/png",
      value: "image/png",
      architype: "file",
    };
    await aTimeout(0);
    expect(element.activeDrag).to.equal(true);
    expect(element.activeType).to.equal("image/png");
  });

  it("clears the drop highlight on dragleave", async () => {
    UserScaffoldInstance.action = { type: "drag", architype: "input" };
    UserScaffoldInstance.data = {
      raw: "image/png",
      value: "image/png",
      architype: "file",
    };
    await aTimeout(0);
    expect(element.activeDrag).to.equal(true);

    UserScaffoldInstance.action = { type: "dragleave", architype: null };
    await aTimeout(0);
    expect(element.activeDrag).to.equal(false);
    expect(element.activeType).to.equal(null);
  });
});
