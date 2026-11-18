// An untitled page gets the same default on every surface: "New page".
// The backends, the HAX CLI and haxcms-mcp store that for a blank title,
// so the create-page prompt sends the same text when nothing is typed.
import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lib/core/haxcms-site-editor-ui.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";

describe("haxcms-site-editor-ui create-page prompt title", () => {
  let program;

  beforeEach(async () => {
    await fixture(html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`);
    await aTimeout(0);
    const option = SuperDaemonInstance.allItems.find(
      (item) => item.value && item.value.machineName === "create-page",
    );
    program = option.value.program;
  });

  it("names an untitled page New page", async () => {
    const results = await program("", {});
    expect(results[0].value.method).to.equal("createPageWithTitle");
    expect(results[0].value.args[0]).to.equal("New page");
    const spaces = await program("   ", {});
    expect(spaces[0].value.args[0]).to.equal("New page");
  });

  it("keeps a typed title, trimmed", async () => {
    const results = await program("  Week 1 ", {});
    expect(results[0].value.args[0]).to.equal("Week 1");
  });
});
