import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import { HAX_NETWORK_DESTINATIONS, HaxNetworkBar } from "../hax-network-bar.js";

describe("hax-network-bar", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<hax-network-bar current="elements"></hax-network-bar>`,
    );
  });

  it("links every site in the network", async () => {
    const links = element.shadowRoot.querySelectorAll(".sites a");
    expect(links.length).to.equal(5);
    expect(links[0].getAttribute("href")).to.equal("https://hax.cloud");
  });

  it("marks only the current site", async () => {
    const current = element.shadowRoot.querySelectorAll(
      'a[aria-current="page"]',
    );
    expect(current.length).to.equal(1);
    expect(current[0].textContent.trim()).to.equal("Elements");
  });

  it("marks nothing when current names no site", async () => {
    element.current = "";
    await element.updateComplete;
    expect(
      element.shadowRoot.querySelectorAll('a[aria-current="page"]').length,
    ).to.equal(0);
  });

  it("offers Merlin, drawn as the Future Traveler", () => {
    const btn = element.shadowRoot.querySelector("button.merlin");
    expect(btn.textContent.replace(/\s+/g, " ").trim()).to.equal(
      "Merlin Jump anywhere in the HAX network",
    );
    expect(btn.querySelector("svg.merlin-traveler")).to.exist;
  });

  it("turns a place into a Merlin option that only follows web links", () => {
    const o = element.networkOption({
      title: "Docs",
      href: "https://haxtheweb.org",
    });
    expect(o.context).to.equal("*");
    expect(o.eventName).to.equal("super-daemon-element-method");
    expect(o.value).to.deep.equal({
      target: element,
      method: "go",
      args: ["https://haxtheweb.org"],
    });
    expect(o.path).to.equal("HAX network");
    // a script URL is never followed
    const before = globalThis.location.href;
    element.go("javascript:alert(1)");
    expect(globalThis.location.href).to.equal(before);
  });

  it("gives Merlin the network's places and lets the page add its own", async () => {
    const added = [];
    const merlin = {
      defineOption: (o) => added.push(o),
      runProgram: (like, context) => {
        merlin.program = { like, context };
      },
      open: () => {
        merlin.opened = true;
      },
    };
    const load = HaxNetworkBar.loadMerlin;
    HaxNetworkBar.loadMerlin = () => Promise.resolve(merlin);
    HaxNetworkBar._defined = false;
    try {
      setTimeout(() => element.openMerlin());
      const ev = await oneEvent(element, "hax-network-merlin");
      ev.detail.add({ title: "Tours", href: "/tours" });
      await new Promise((r) => setTimeout(r));
      expect(added.length).to.equal(HAX_NETWORK_DESTINATIONS.length + 1);
      expect(added[0].title).to.equal("hax.cloud: the HAX ecosystem web");
      expect(added[added.length - 1].value.args).to.deep.equal(["/tours"]);
      expect(merlin.program).to.deep.equal({ like: "", context: "*" });
      expect(merlin.opened).to.be.true;
      expect(merlin.mini).to.be.false;
    } finally {
      HaxNetworkBar.loadMerlin = load;
    }
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
