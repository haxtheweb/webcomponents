import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { render } from "lit";
import "../lib/core/haxcms-site-editor-ui.js";
import { SuperDaemonInstance } from "@haxtheweb/super-daemon/super-daemon.js";
import { GogglesState } from "../lib/core/ui/haxcms-goggles.js";

// contributing to HAX goes through the goggles: Merlin's Community group
// leads with them and nothing links to the issue queue
describe("haxcms-site-editor-ui: contributing with the goggles", function () {
  this.timeout(15000);
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`,
    );
    await aTimeout(0);
  });

  afterEach(async () => {
    GogglesState.set({ on: false });
    if (element.developerMode) {
      element.toggleDeveloperMode();
    }
    await aTimeout(0);
  });

  it("leads Merlin's Community group with the goggles", () => {
    const community = SuperDaemonInstance.allItems.filter(
      (o) => o.path && o.path.indexOf("Community/") === 0,
    );
    const goggles = community.filter((o) => o.path === "Community/Contribute");
    expect(goggles.length).to.be.at.least(1);
    expect(goggles[0].title).to.equal("Contribute with the goggles");
    expect(goggles[0].value.method).to.equal("contributeWithGoggles");
    expect(goggles[0].description).to.contain("translation");
    community
      .filter((o) => o.path !== "Community/Contribute")
      .forEach((o) => {
        expect(goggles[0].priority).to.be.below(o.priority);
        expect(String(o.value.args[0])).to.not.contain("haxtheweb/issues");
      });
    // the developer list keeps its own entry
    expect(
      SuperDaemonInstance.allItems.some((o) => o.path === ">developer/goggles"),
    ).to.be.true;
  });

  it("turns developer mode on and puts the goggles on, on the lens asked for", async () => {
    expect(element.developerMode).to.not.be.true;
    await element.contributeWithGoggles("flag");
    expect(element.developerMode).to.be.true;
    expect(GogglesState.on).to.be.true;
    expect(GogglesState.lens).to.equal("flag");
  });

  it("offers the Flag lens, not an issue link, when Merlin finds nothing", () => {
    const slot = SuperDaemonInstance.noResultsSlot("missing thing");
    const holder = globalThis.document.createElement("div");
    globalThis.document.body.appendChild(holder);
    render(slot, holder);
    const a = holder.querySelector("a");
    expect(a).to.exist;
    expect(a.getAttribute("href")).to.contain("goggles=flag");
    expect(a.getAttribute("href")).to.not.contain("haxtheweb/issues");
    holder.remove();
  });
});
