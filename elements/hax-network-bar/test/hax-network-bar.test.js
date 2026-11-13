import { html, fixture, expect, oneEvent } from "@open-wc/testing";
import {
  HAX_NETWORK_DESTINATIONS,
  HAX_NETWORK_SITES,
  HAX_INSTALL_METHODS,
  HAX_COMMUNITY_LINKS,
  HaxNetworkBar,
} from "../hax-network-bar.js";

describe("hax-network-bar", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<hax-network-bar current="elements"></hax-network-bar>`,
    );
  });
  afterEach(() => {
    element.closeInstall();
  });

  it("links every site in the network, the browser one at browser.hax.cloud", async () => {
    const links = element.shadowRoot.querySelectorAll("nav.sites a");
    expect(links.length).to.equal(HAX_NETWORK_SITES.length);
    expect(links[0].getAttribute("href")).to.equal("https://hax.cloud");
    const browser = [...links].find((a) => a.textContent.trim() === "Browser");
    expect(browser.getAttribute("href")).to.equal("https://browser.hax.cloud");
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

  it("is laid out like the HAX top bar: character, Merlin, Future Traveler", () => {
    const start = element.shadowRoot.querySelector(".start");
    const end = element.shadowRoot.querySelector(".end");
    expect(start.querySelector("a.character rpg-character")).to.exist;
    expect(start.querySelector('slot[name="pre"]')).to.exist;
    expect(end.querySelector('slot[name="post"] a.github')).to.exist;
    expect(end.lastElementChild.classList.contains("traveler")).to.be.true;
    expect(
      end.querySelector(".traveler simple-icon-lite").getAttribute("icon"),
    ).to.equal("hax:future-traveler");
  });

  it("sends the character to RPG me, on its code when it has one", async () => {
    const a = element.shadowRoot.querySelector("a.character");
    expect(a.getAttribute("href")).to.equal("https://rpg-me.hax.cloud");
    element.character = "1-0103020401020305060009";
    await element.updateComplete;
    expect(a.getAttribute("href")).to.equal(
      "https://rpg-me.hax.cloud/?code=1-0103020401020305060009",
    );
  });

  it("offers Merlin, drawn as the Future Traveler", () => {
    const btn = element.shadowRoot.querySelector("button.merlin");
    expect(btn.querySelector(".sr-only").textContent).to.equal(
      "Merlin in the HAX network",
    );
    expect(btn.querySelector("svg.merlin-traveler")).to.exist;
  });

  it("lists every way to install on one screen, the desktop app as beta", async () => {
    element.shadowRoot.querySelector("button.install-btn").click();
    await element.updateComplete;
    const dialog = element.shadowRoot.querySelector("dialog");
    expect(dialog.open).to.be.true;
    const ways = dialog.querySelectorAll("button.way");
    expect([...ways].map((w) => w.dataset.way)).to.deep.equal([
      "browser",
      "cli",
      "nodejs",
      "php",
      "desktop",
      "agent",
    ]);
    expect(dialog.querySelector('.way[data-way="desktop"] .beta')).to.exist;
    expect(dialog.querySelectorAll(".beta").length).to.equal(1);
    const social = [...dialog.querySelectorAll(".install-foot .social a")].map(
      (a) => a.getAttribute("href"),
    );
    expect(social).to.deep.equal(HAX_COMMUNITY_LINKS.map((l) => l.href));
  });

  it("opens one way's steps and goes back to the list", async () => {
    element.openInstall();
    await element.updateComplete;
    element.shadowRoot.querySelector('.way[data-way="cli"]').click();
    await element.updateComplete;
    const detail = element.shadowRoot.querySelector(".detail");
    expect(detail.dataset.way).to.equal("cli");
    expect(detail.querySelector("pre").textContent).to.equal(
      "npm install @haxtheweb/create --global",
    );
    expect(element.shadowRoot.activeElement).to.equal(
      detail.querySelector("h3"),
    );
    element.shadowRoot.querySelector("button.back").click();
    await element.updateComplete;
    expect(element.shadowRoot.querySelector(".detail")).to.not.exist;
    expect(element.shadowRoot.activeElement.dataset.way).to.equal("cli");
  });

  it("gives every way steps and links, and the agent a prompt to copy", async () => {
    HAX_INSTALL_METHODS.forEach((m) => {
      expect(element.t[m.title], m.id).to.be.a("string");
      expect(m.steps.length, m.id).to.be.greaterThan(1);
      expect(m.links.length, m.id).to.be.greaterThan(0);
      m.steps.forEach((s) =>
        expect(element.t[s.text], s.text).to.be.a("string"),
      );
    });
    element.openInstall("agent");
    await element.updateComplete;
    const prompt = element.shadowRoot.querySelector(".detail pre");
    expect(prompt.textContent).to.equal(element.t.installAgentPrompt);
    expect(prompt.textContent).to.contain("hax skills install --all");
  });

  it("opens Install HAX from #install and #install/<way>", async () => {
    const before = globalThis.location.href;
    try {
      globalThis.history.replaceState(null, "", "#install/php");
      element._onHash();
      await element.updateComplete;
      expect(element.installOpen).to.be.true;
      expect(element.installMethod).to.equal("php");
      element.closeInstall();
      await element.updateComplete;
      globalThis.history.replaceState(null, "", "#install/nope");
      element._onHash();
      await element.updateComplete;
      expect(element.installMethod).to.equal("");
    } finally {
      globalThis.history.replaceState(null, "", before);
    }
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

  it("gives Merlin the network's places and install commands, and lets the page add its own", async () => {
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
      expect(added.length).to.equal(
        HAX_NETWORK_DESTINATIONS.length + HAX_INSTALL_METHODS.length + 2,
      );
      expect(added[0].title).to.equal("hax.cloud: the HAX ecosystem web");
      const install = added.filter((o) => o.value.method === "openInstall");
      expect(install.map((o) => o.value.args[0])).to.deep.equal([
        "",
        ...HAX_INSTALL_METHODS.map((m) => m.id),
      ]);
      const hrefs = added
        .filter((o) => o.value.method === "go")
        .map((o) => o.value.args[0]);
      expect(hrefs).to.include("https://browser.hax.cloud");
      expect(hrefs).to.include("https://discord.gg/aCGxmRHEJP");
      expect(hrefs).to.include("https://github.com/haxtheweb/issues");
      expect(added[added.length - 1].value.args).to.deep.equal(["/tours"]);
      expect(merlin.program).to.deep.equal({ like: "", context: "*" });
      expect(merlin.opened).to.be.true;
      expect(merlin.mini).to.be.false;
    } finally {
      HaxNetworkBar.loadMerlin = load;
    }
  });

  it("draws the demo strip: nothing is saved, the browser version, Install HAX, no Merlin", async () => {
    const strip = await fixture(html`<hax-network-bar demo></hax-network-bar>`);
    const r = strip.shadowRoot;
    expect(r.querySelector(".strip .notice .tag").textContent).to.equal("Demo");
    expect(r.querySelector(".strip .notice .long").textContent).to.equal(
      strip.t.demoNotice,
    );
    expect(r.querySelector(".strip a.browser").getAttribute("href")).to.equal(
      "https://browser.hax.cloud",
    );
    expect(r.querySelector(".strip .install-btn")).to.exist;
    expect(r.querySelector("button.merlin")).to.not.exist;
    expect(r.querySelector("a.character")).to.not.exist;
    expect(r.querySelectorAll("nav.sites a").length).to.equal(
      HAX_NETWORK_SITES.length,
    );
    r.querySelector(".strip .install-btn").click();
    await strip.updateComplete;
    expect(r.querySelector("dialog").open).to.be.true;
    strip.closeInstall();
  });

  it("keeps --haxcms-top-offset at the strip's height while it is on the page", async () => {
    const root = document.documentElement;
    const strip = await fixture(html`<hax-network-bar demo></hax-network-bar>`);
    expect(root.style.getPropertyValue("--haxcms-top-offset")).to.equal("40px");
    strip.demo = false;
    await strip.updateComplete;
    expect(root.style.getPropertyValue("--haxcms-top-offset")).to.equal("");
    strip.demo = true;
    await strip.updateComplete;
    expect(root.style.getPropertyValue("--haxcms-top-offset")).to.equal("40px");
    strip.remove();
    expect(root.style.getPropertyValue("--haxcms-top-offset")).to.equal("");
    // the full bar never sets it
    expect(element.demo).to.be.false;
  });

  it("leaves Alt⇧ to the editor's Merlin in a demo", async () => {
    const strip = await fixture(html`<hax-network-bar demo></hax-network-bar>`);
    let opened = false;
    strip.openMerlin = () => {
      opened = true;
    };
    const ready = HaxNetworkBar._merlinReady;
    HaxNetworkBar._merlinReady = false;
    try {
      strip._onKey(
        new KeyboardEvent("keydown", {
          key: "Shift",
          shiftKey: true,
          altKey: true,
        }),
      );
      expect(opened).to.be.false;
    } finally {
      HaxNetworkBar._merlinReady = ready;
    }
  });

  it("passes the a11y audit as the demo strip", async () => {
    const strip = await fixture(html`<hax-network-bar demo></hax-network-bar>`);
    await expect(strip).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with Install HAX open", async () => {
    element.openInstall("cli");
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });
});
