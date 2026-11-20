import { html, fixture, expect, oneEvent, aTimeout } from "@open-wc/testing";
import {
  HAX_NETWORK_DESTINATIONS,
  HAX_NETWORK_SITES,
  HAX_INSTALL_METHODS,
  HAX_COMMUNITY_LINKS,
  HaxNetworkBar,
} from "../hax-network-bar.js";
import { HAX_NETWORK, HAX_NETWORK_GLYPHS } from "../lib/hax-network.js";

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

  it("links every property in the network's order, each as its own icon", async () => {
    const links = element.shadowRoot.querySelectorAll("nav.props a");
    expect(HAX_NETWORK_SITES.map((s) => s.id)).to.deep.equal([
      "web",
      "cloud",
      "try",
      "learn",
      "elements",
      "art",
    ]);
    expect([...links].map((a) => a.getAttribute("href"))).to.deep.equal(
      HAX_NETWORK_SITES.map((s) => s.href),
    );
    expect(links[0].getAttribute("href")).to.equal("https://haxtheweb.org");
    const tryIt = [...links].find(
      (a) => a.querySelector(".name").textContent === "Build now",
    );
    expect(tryIt.getAttribute("href")).to.equal("https://browser.hax.cloud");
    links.forEach((a) => expect(a.querySelector("svg.glyph")).to.exist);
    expect(Object.keys(HAX_NETWORK_GLYPHS)).to.deep.equal([
      ...HAX_NETWORK.order,
      "rpg",
    ]);
  });

  it("says what the network's record says about every property in the bar", () => {
    HAX_NETWORK.order.forEach((id) => {
      const p = HAX_NETWORK.properties[id];
      expect(element.t[id], id).to.equal(p.label);
      expect(element.t[`${id}About`], id).to.equal(p.purpose);
      const card = element.shadowRoot.querySelector(`#card-${id}`);
      expect(card.getAttribute("role")).to.equal("tooltip");
      expect(card.querySelector(".purpose").textContent).to.equal(p.purpose);
      expect(card.querySelector(".host").textContent).to.equal(
        p.url.replace("https://", ""),
      );
    });
  });

  it("shows a property's card on focus and puts it away on Escape", async () => {
    const link = element.shadowRoot.querySelector(
      'nav.props a[href="https://learn.hax.cloud"]',
    );
    const card = element.shadowRoot.querySelector("#card-learn");
    expect(link.getAttribute("aria-describedby")).to.equal("card-learn");
    expect(globalThis.getComputedStyle(card).display).to.equal("none");
    if (
      globalThis.matchMedia("(min-width: 901px) and (hover: hover)").matches
    ) {
      link.focus();
      expect(globalThis.getComputedStyle(card).display).to.equal("grid");
      link.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      expect(globalThis.getComputedStyle(card).display).to.equal("none");
      link.blur();
    }
  });

  it("marks only the current site, and opens it into its name", async () => {
    const current = element.shadowRoot.querySelectorAll(
      '.bar .start > nav a[aria-current="page"]',
    );
    expect(current.length).to.equal(1);
    expect(current[0].querySelector(".name").textContent).to.equal(
      "Web components",
    );
    expect(
      element.shadowRoot.querySelector("#card-elements .you").textContent,
    ).to.equal("You are here");
    expect(element.shadowRoot.querySelectorAll(".card .you").length).to.equal(
      1,
    );
  });

  it("still knows the sites by what current used to call them", async () => {
    element.current = "browser";
    await element.updateComplete;
    expect(
      element.shadowRoot
        .querySelector('nav.props a[aria-current="page"]')
        .getAttribute("href"),
    ).to.equal("https://browser.hax.cloud");
    element.current = "docs";
    await element.updateComplete;
    expect(
      element.shadowRoot
        .querySelector('nav.props a[aria-current="page"]')
        .getAttribute("href"),
    ).to.equal("https://haxtheweb.org");
  });

  it("keeps RPG me out of the bar: it is one of Art's tools, and on it Art lights up", async () => {
    expect(HAX_NETWORK.order).to.not.include("rpg");
    expect(HAX_NETWORK.properties.rpg.within).to.equal("art");
    expect(HAX_NETWORK.properties.rpg.url).to.equal(
      "https://rpg.art.hax.cloud",
    );
    const r = element.shadowRoot;
    expect(r.querySelectorAll("nav.props a").length).to.equal(
      HAX_NETWORK.order.length,
    );
    expect(r.querySelector("#card-rpg")).to.not.exist;
    expect(r.querySelector('a[href*="rpg"]')).to.not.exist;
    element.current = "rpg";
    await element.updateComplete;
    const lit = r.querySelectorAll('nav.props a[aria-current="page"]');
    expect(lit.length).to.equal(1);
    expect(lit[0].getAttribute("href")).to.equal(
      "https://haxtheweb.github.io/art/",
    );
    expect(lit[0].querySelector(".name").textContent).to.equal("Art");
    expect(r.querySelector("#card-art .you").textContent).to.equal(
      "You are here",
    );
    expect(r.querySelector("button.net-btn .label").textContent).to.equal(
      "Art",
    );
    element.current = "elements";
    await element.updateComplete;
  });

  it("lists the same properties, with their sentences, in the menu for narrow screens and touch", async () => {
    const btn = element.shadowRoot.querySelector("button.net-btn");
    const menu = element.shadowRoot.querySelector("#net-menu");
    expect(btn.getAttribute("aria-expanded")).to.equal("false");
    expect(menu.hidden).to.be.true;
    element.toggleMenu();
    await element.updateComplete;
    expect(btn.getAttribute("aria-expanded")).to.equal("true");
    expect(menu.hidden).to.be.false;
    const items = menu.querySelectorAll("ul:not(.more) a");
    expect([...items].map((a) => a.getAttribute("href"))).to.deep.equal(
      HAX_NETWORK_SITES.map((s) => s.href),
    );
    expect(items[2].querySelector(".text span").textContent).to.equal(
      element.t.tryAbout,
    );
    expect(
      [...menu.querySelectorAll("ul.more a")].map((a) =>
        a.getAttribute("href"),
      ),
    ).to.deep.equal([
      "https://www.linkedin.com/company/haxtheweb/",
      "https://discord.gg/aCGxmRHEJP",
      "https://github.com/haxtheweb",
      "https://x.com/haxtheweb",
    ]);
    btn.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await element.updateComplete;
    expect(element.menuOpen).to.be.false;
  });

  it("leaves Discord and GitHub to the menu wherever the properties fold into it", async () => {
    const folded = globalThis.matchMedia(
      "(max-width: 900px), (hover: none)",
    ).matches;
    const shown = (sel) =>
      getComputedStyle(element.shadowRoot.querySelector(sel)).display !==
      "none";
    expect(shown(".end a.discord")).to.equal(!folded);
    expect(shown('slot[name="post"] > a.github')).to.equal(!folded);
    expect(shown("button.net-btn")).to.equal(folded);
  });

  it("keeps a page's own post content when the menu holds GitHub", async () => {
    const own = document.createElement("a");
    own.slot = "post";
    own.href = "https://example.com/";
    own.textContent = "Own link";
    element.appendChild(own);
    await element.updateComplete;
    expect(getComputedStyle(own).display).to.not.equal("none");
    own.remove();
  });

  it("keeps a compact bar's pre slot at every width", async () => {
    element.compact = true;
    const app = document.createElement("span");
    app.slot = "pre";
    app.textContent = "Running in your browser";
    element.appendChild(app);
    await element.updateComplete;
    expect(app.getBoundingClientRect().width).to.be.above(0);
    app.remove();
    element.compact = false;
    await element.updateComplete;
  });

  it("marks nothing when current names no site", async () => {
    element.current = "";
    await element.updateComplete;
    expect(
      element.shadowRoot.querySelectorAll('nav.props a[aria-current="page"]')
        .length,
    ).to.equal(0);
  });

  it("is laid out like the HAX top bar: Merlin in the middle, the Future Traveler last", () => {
    const start = element.shadowRoot.querySelector(".start");
    const end = element.shadowRoot.querySelector(".end");
    expect(start.querySelector('slot[name="pre"]')).to.exist;
    expect(
      element.shadowRoot.querySelector("button.merlin .hint").textContent,
    ).to.equal("Travel anywhere");
    expect(end.querySelector("a.discord").getAttribute("href")).to.equal(
      "https://discord.gg/aCGxmRHEJP",
    );
    expect(end.querySelector('slot[name="post"] a.github')).to.exist;
    expect(end.querySelector("button.install-btn")).to.exist;
    expect(end.lastElementChild.classList.contains("traveler")).to.be.true;
    expect(
      end.querySelector(".traveler simple-icon-lite").getAttribute("icon"),
    ).to.equal("hax:future-traveler");
  });

  it("remixes the Future Traveler through every era on a click, loading the eras only then", async () => {
    const btn = element.shadowRoot.querySelector("button.traveler");
    expect(btn.getAttribute("aria-label")).to.equal(
      "Remix the HAX Future Traveler",
    );
    expect(btn.getAttribute("aria-pressed")).to.equal("false");
    expect(element.travelerEra).to.equal("now");
    expect(element._eras).to.equal(null);
    const eras = await import("../lib/hax-future-traveler.js");
    const ids = eras.HAX_TRAVELER_ERAS.map((e) => e.id);
    expect(ids[0]).to.equal("now");
    expect(ids.length).to.equal(14);
    const seen = [];
    for (let i = 0; i < ids.length; i++) {
      await element.remix();
      await aTimeout(400);
      await element.updateComplete;
      seen.push(element.travelerEra);
    }
    expect(seen).to.deep.equal([...ids.slice(1), "now"]);
    expect(element._eras).to.not.equal(null);
    await element.remix();
    await aTimeout(400);
    await element.updateComplete;
    expect(element.getAttribute("traveler-era")).to.equal("steam");
    expect(btn.getAttribute("aria-pressed")).to.equal("true");
    const drawn = btn.querySelector("svg.future-traveler");
    expect(drawn.getAttribute("data-era")).to.equal("steam");
    // a click chose this era, so leaving does not send him back to today
    btn.dispatchEvent(new MouseEvent("mouseleave"));
    await aTimeout(400);
    expect(element.travelerEra).to.equal("steam");
    await expect(element).shadowDom.to.be.accessible();
  });

  it("draws every era, and the world of tomorrow in every pillar's color", async () => {
    const eras = await import("../lib/hax-future-traveler.js");
    const { render } = await import("lit");
    const box = document.createElement("div");
    document.body.appendChild(box);
    eras.HAX_TRAVELER_ERAS.forEach((e) => {
      render(eras.futureTraveler(e.id), box);
      const drawn = box.querySelector("svg.future-traveler");
      expect(drawn.getAttribute("data-era"), e.id).to.equal(e.id);
      expect(drawn.children.length, e.id).to.be.greaterThan(0);
    });
    Object.keys(eras.HAX_TRAVELER_PILLAR_TINTS).forEach((p) => {
      render(eras.futureTraveler("tomorrow", p), box);
      expect(
        box.querySelector("ellipse.ft-orbit").getAttribute("stroke"),
        p,
      ).to.equal(eras.HAX_TRAVELER_PILLAR_TINTS[p]);
    });
    render(eras.futureTraveler("no-such-era"), box);
    expect(
      box.querySelector("svg.future-traveler").getAttribute("data-era"),
    ).to.equal("now");
    box.remove();
  });

  it("is shorter over a full platform: no Merlin or Future Traveler, the page's functions in the middle", async () => {
    const bar = await fixture(
      html`<hax-network-bar compact current="try"
        ><button slot="pre" type="button">Publish</button></hax-network-bar
      >`,
    );
    const r = bar.shadowRoot;
    expect(r.querySelector("button.merlin")).to.not.exist;
    expect(r.querySelector(".traveler")).to.not.exist;
    expect(r.querySelectorAll("nav.props a").length).to.equal(6);
    expect(
      r.querySelector('.app slot[name="pre"]').assignedElements().length,
    ).to.equal(1);
    expect(r.querySelector("button.install-btn")).to.exist;
    await expect(bar).shadowDom.to.be.accessible();
  });

  it("offers Merlin, drawn as the Future Traveler", () => {
    const btn = element.shadowRoot.querySelector("button.merlin");
    expect(btn.querySelector(".sr-only").textContent).to.equal(
      "Search in the HAX network",
    );
    expect(btn.querySelector("svg.merlin-traveler")).to.exist;
  });

  it("gives every way to install a tab, the first one open", async () => {
    element.shadowRoot.querySelector("button.install-btn").click();
    await element.updateComplete;
    const dialog = element.shadowRoot.querySelector("dialog");
    expect(dialog.open).to.be.true;
    const tabs = dialog.querySelectorAll('[role="tablist"] [role="tab"]');
    expect([...tabs].map((w) => w.dataset.way)).to.deep.equal([
      "browser",
      "cli",
      "nodejs",
      "php",
      "desktop",
      "agent",
    ]);
    expect([...tabs].map((w) => w.getAttribute("aria-selected"))).to.deep.equal(
      ["true", "false", "false", "false", "false", "false"],
    );
    const panel = dialog.querySelector('[role="tabpanel"]');
    expect(panel.dataset.way).to.equal("browser");
    expect(panel.getAttribute("aria-labelledby")).to.equal("tab-browser");
    expect(panel.querySelector("a.install-btn").getAttribute("href")).to.equal(
      "https://browser.hax.cloud",
    );
    expect(dialog.querySelectorAll(".beta").length).to.equal(0);
    const social = [...dialog.querySelectorAll(".install-foot .social a")].map(
      (a) => a.getAttribute("href"),
    );
    expect(social).to.deep.equal(HAX_COMMUNITY_LINKS.map((l) => l.href));
  });

  it("opens one way's quick steps from its tab, and a page for the rest", async () => {
    element.openInstall();
    await element.updateComplete;
    element.shadowRoot.querySelector('[role="tab"][data-way="cli"]').click();
    await element.updateComplete;
    const detail = element.shadowRoot.querySelector(".detail");
    expect(detail.dataset.way).to.equal("cli");
    expect(detail.querySelector("pre").textContent).to.equal(
      "npm install @haxtheweb/create --global",
    );
    expect(detail.querySelectorAll("ol.steps > li").length).to.equal(4);
    const more = detail.querySelector("a.more");
    expect(more.getAttribute("href")).to.equal(
      "https://haxtheweb.org/installation#cli",
    );
    expect(more.getAttribute("aria-label")).to.equal(
      "More details on haxtheweb.org: HAX CLI",
    );
    element.showInstallMethod("desktop");
    await element.updateComplete;
    expect(
      element.shadowRoot.querySelectorAll(".detail .beta").length,
    ).to.equal(1);
  });

  it("moves between the ways' tabs with the arrow keys, Home and End", async () => {
    element.openInstall("cli");
    await element.updateComplete;
    const list = element.shadowRoot.querySelector('[role="tablist"]');
    const press = async (key) => {
      list.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
      await element.updateComplete;
      await element.updateComplete;
    };
    await press("ArrowRight");
    expect(element.installMethod).to.equal("nodejs");
    expect(element.shadowRoot.activeElement.id).to.equal("tab-nodejs");
    await press("ArrowLeft");
    await press("ArrowLeft");
    expect(element.installMethod).to.equal("browser");
    await press("ArrowLeft");
    expect(element.installMethod).to.equal("agent");
    await press("Home");
    expect(element.installMethod).to.equal("browser");
    await press("End");
    expect(element.installMethod).to.equal("agent");
    expect(
      element.shadowRoot.querySelector("#tab-agent").getAttribute("tabindex"),
    ).to.equal("0");
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
      expect(
        element.shadowRoot.querySelector('[role="tabpanel"]').dataset.way,
      ).to.equal("browser");
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
      expect(added[0].title).to.equal("PRAW: the brain of the HAX ecosystem");
      const install = added.filter((o) => o.value.method === "openInstall");
      expect(install.map((o) => o.value.args[0])).to.deep.equal([
        "",
        ...HAX_INSTALL_METHODS.map((m) => m.id),
      ]);
      const hrefs = added
        .filter((o) => o.value.method === "go")
        .map((o) => o.value.args[0]);
      expect(hrefs).to.include("https://browser.hax.cloud");
      expect(hrefs).to.include("https://learn.hax.cloud");
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

  it("draws a demo as the mini bar: the property icons, a notice that nothing is saved, Install HAX, no Merlin", async () => {
    const demo = await fixture(html`<hax-network-bar demo></hax-network-bar>`);
    const mini = await fixture(
      html`<hax-network-bar compact current="elements"></hax-network-bar>`,
    );
    const r = demo.shadowRoot;
    expect(demo.mini).to.be.true;
    expect(r.querySelector(".app .notice .tag").textContent).to.equal("Demo");
    expect(r.querySelector(".app .notice .long").textContent).to.equal(
      demo.t.demoNotice,
    );
    // the same icons as the mini bar, in the same order
    const ids = (bar) =>
      [...bar.shadowRoot.querySelectorAll("nav.props li")].map(
        (li) => li.className,
      );
    expect(ids(demo).length).to.equal(HAX_NETWORK_SITES.length);
    expect(ids(demo)).to.deep.equal(ids(mini));
    expect(r.querySelector(".install-btn")).to.exist;
    expect(r.querySelector("button.merlin")).to.not.exist;
    expect(r.querySelector("button.traveler")).to.not.exist;
    // the old strip and its text links are gone
    expect(r.querySelector(".strip")).to.not.exist;
    expect(r.querySelector("nav.sites")).to.not.exist;
    // a mini bar that is not a demo has no notice
    expect(mini.shadowRoot.querySelector(".notice")).to.not.exist;
    r.querySelector(".install-btn").click();
    await demo.updateComplete;
    expect(r.querySelector("dialog").open).to.be.true;
    demo.closeInstall();
  });

  it("gives a demo's own controls a place in the mini bar and shortens its notice for them", async () => {
    const plain = await fixture(html`<hax-network-bar demo></hax-network-bar>`);
    await plain.updateComplete;
    expect(plain.hasPre).to.be.false;
    const demo = await fixture(
      html`<hax-network-bar demo
        ><button slot="pre" type="button">Theme</button></hax-network-bar
      >`,
    );
    await demo.updateComplete;
    // slotchange is async
    await new Promise((resolve) => setTimeout(resolve, 0));
    await demo.updateComplete;
    const slot = demo.shadowRoot.querySelector(".app slot[name='pre']");
    expect(slot).to.exist;
    expect(slot.assignedElements().length).to.equal(1);
    expect(getComputedStyle(slot).display).to.not.equal("none");
    expect(demo.hasPre).to.be.true;
    expect(demo.hasAttribute("has-pre")).to.be.true;
    const long = demo.shadowRoot.querySelector(".notice .long");
    expect(getComputedStyle(long).display).to.equal("none");
  });

  it("keeps --haxcms-top-offset at the demo bar's height while it is on the page", async () => {
    const root = document.documentElement;
    const demo = await fixture(html`<hax-network-bar demo></hax-network-bar>`);
    const frame = demo.shadowRoot.querySelector(".frame");
    const height = () => `${Math.ceil(frame.getBoundingClientRect().height)}px`;
    expect(getComputedStyle(frame).position).to.equal("fixed");
    // the host is the bar's stacking context: it, not only the frame, sits
    // above the HAXcms editor bar (--ddd-z-modal, 10000), so the cards and
    // the sites menu that drop below the bar open over the editor bar
    expect(Number(getComputedStyle(demo).zIndex)).to.be.above(10000);
    expect(root.style.getPropertyValue("--haxcms-top-offset")).to.equal(
      height(),
    );
    // the host holds the fixed bar's room in the page
    expect(demo.getBoundingClientRect().height).to.equal(
      parseInt(height(), 10),
    );
    demo.demo = false;
    await demo.updateComplete;
    expect(root.style.getPropertyValue("--haxcms-top-offset")).to.equal("");
    demo.demo = true;
    await demo.updateComplete;
    expect(root.style.getPropertyValue("--haxcms-top-offset")).to.equal(
      height(),
    );
    demo.remove();
    expect(root.style.getPropertyValue("--haxcms-top-offset")).to.equal("");
    // the full bar never sets it
    expect(element.demo).to.be.false;
  });

  ["demo", "compact"].forEach((mode) =>
    it(`leaves Alt⇧ to the editor's Merlin in the mini bar (${mode})`, async () => {
      const strip = await fixture(
        mode === "demo"
          ? html`<hax-network-bar demo></hax-network-bar>`
          : html`<hax-network-bar compact></hax-network-bar>`,
      );
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
    }),
  );

  it("passes the a11y audit as a demo", async () => {
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
