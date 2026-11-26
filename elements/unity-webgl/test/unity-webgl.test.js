import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { UnityWebgl } from "../unity-webgl.js";

// The real build that ships with the demo, and a hostile probe build whose
// loader tries to reach the page (test/fixtures/probe.*).
const demoBuild = new URL("../demo/example/build web", import.meta.url).href;
const probeBuild = new URL("./fixtures/probe", import.meta.url).href;

const frameOf = (el) => el.shadowRoot.querySelector(".ddd-block-body iframe");

describe("unity-webgl", () => {
  it("is defined with its tag name", () => {
    expect(UnityWebgl.tag).to.equal("unity-webgl");
    expect(globalThis.customElements.get("unity-webgl")).to.exist;
  });

  it("exposes haxProperties from its lib schema file", () => {
    const url = UnityWebgl.haxProperties;
    expect(typeof url).to.equal("string");
    expect(url.endsWith("lib/unity-webgl.haxProperties.json")).to.be.true;
  });

  it("runs the player in a sandboxed, opaque-origin frame", async () => {
    const el = await fixture(
      html`<unity-webgl
        target="demo-build"
        compression="unityweb"
        width="460px"
        height="400px"
        background="#231F20"
      ></unity-webgl>`,
    );
    await waitUntil(() => frameOf(el), "no player frame");
    const frame = frameOf(el);
    // scripts only: no allow-same-origin, so the build never gets the site's
    // origin; no modals, popups, forms or top navigation
    expect(frame.getAttribute("sandbox")).to.equal(
      "allow-scripts allow-pointer-lock",
    );
    expect(frame.getAttribute("title")).to.equal("Unity WebGL player");
    expect(frame.style.width).to.equal("460px");
    expect(frame.style.height).to.equal("400px");
    expect(frame.style.background).to.include("rgb(35, 31, 32)");
    // nothing from the build is loaded into this page
    expect(el.shadowRoot.querySelector("script")).to.not.exist;
    expect(frame.srcdoc).to.include(JSON.stringify(globalThis.location.origin));
  });

  it("keeps markup in size and color attributes out of its shadow root", async () => {
    const el = await fixture(
      html`<unity-webgl
        target="demo-build"
        width='1px"><img id="injected" src="x"><b x="'
        height="1px;}</style><img id=injected2 src=x><style>"
        background="red"
      ></unity-webgl>`,
    );
    await waitUntil(() => frameOf(el), "no player frame");
    expect(el.shadowRoot.querySelector("img")).to.not.exist;
    expect(frameOf(el).style.width).to.equal("");
    expect(frameOf(el).style.background).to.include("red");
    expect(el._cssValue("width", "100%")).to.equal("100%");
    expect(el._cssValue("width", "1px; color: red")).to.equal("");
  });

  it("only takes http(s) build paths", async () => {
    const el = await fixture(html`<unity-webgl></unity-webgl>`);
    expect(el._httpUrl("javascript:alert(1)//")).to.be.null;
    expect(el._httpUrl("data:text/javascript,alert(1)//")).to.be.null;
    expect(el._httpUrl("blob:https://example.com/x")).to.be.null;
    expect(el._httpUrl("files/game/build")).to.equal(
      new URL("files/game/build", globalThis.document.baseURI).href,
    );
    el.setAttribute("target", "javascript:alert(1)//");
    await waitUntil(() => el.shadowRoot.querySelector(".ddd-block"));
    expect(frameOf(el)).to.not.exist;
  });

  it("builds the four file urls from target and compression", async () => {
    const el = await fixture(
      html`<unity-webgl
        target="games/run"
        compression="unityweb"
      ></unity-webgl>`,
    );
    const base = new URL("games/run", globalThis.document.baseURI).href;
    // the loader is never compressed
    expect(el._buildFileUrl(".loader.js")).to.equal(base + ".loader.js");
    expect(el._buildFileUrl(".framework.js")).to.equal(
      base + ".framework.js.unityweb",
    );
    expect(el._buildFileUrl(".data")).to.equal(base + ".data.unityweb");
    expect(el._buildFileUrl(".wasm")).to.equal(base + ".wasm.unityweb");
    el.compression = "../x";
    expect(el._buildFileUrl(".data")).to.equal(base + ".data");
  });

  it("boots the real demo build inside the frame, not the page", async function () {
    this.timeout(60000);
    const el = await fixture(
      html`<unity-webgl
        target=${demoBuild}
        compression="unityweb"
        companyname="DefaultCompany"
        productname="test webgl"
        productversion="0.1"
        width="460px"
        height="400px"
        background="#231F20"
      ></unity-webgl>`,
    );
    await waitUntil(
      () => el._status === "started" || el._status === "error",
      "the demo build never started",
      { timeout: 55000 },
    );
    expect(el._status).to.equal("started");
    // the framework defines unityFramework where it runs: in the frame
    expect(typeof globalThis.unityFramework).to.equal("undefined");
    expect(typeof globalThis.createUnityInstance).to.equal("undefined");
  });

  it("keeps a hostile build away from the page", async function () {
    this.timeout(20000);
    const warn = console.warn;
    const warnings = [];
    console.warn = (message) => warnings.push(String(message));
    let el;
    try {
      el = await fixture(
        html`<unity-webgl target=${probeBuild}></unity-webgl>`,
      );
      await waitUntil(() => warnings.length > 0, "the probe never reported", {
        timeout: 15000,
      });
    } finally {
      console.warn = warn;
    }
    expect(el._status).to.equal("error");
    const report = warnings[0];
    expect(report).to.include("no-parent-dom");
    expect(report).to.include("no-parent-global");
    expect(report).to.include("no-cookie");
    expect(report).to.include("no-storage");
    expect(report).to.include("origin:null");
    expect(globalThis.__unityProbeRan).to.be.undefined;
  });

  it("only listens to its own frame", async () => {
    const el = await fixture(
      html`<unity-webgl target="demo-build"></unity-webgl>`,
    );
    await waitUntil(() => frameOf(el), "no player frame");
    const channel = new MessageChannel();
    // a message from this page (not the player frame) is ignored
    el._onFrameMessage(
      new MessageEvent("message", {
        data: { type: "unity-webgl-port" },
        origin: "null",
        source: globalThis,
        ports: [channel.port2],
      }),
    );
    expect(el._port).to.not.equal(channel.port2);
    channel.port1.close();
  });

  it("rerenders with one player frame when attributes change", async () => {
    const el = await fixture(
      html`<unity-webgl target="demo-build" width="460px"></unity-webgl>`,
    );
    await waitUntil(() => frameOf(el), "no player frame");
    const first = frameOf(el);
    el.setAttribute("width", "500px");
    await waitUntil(() => frameOf(el) && frameOf(el) !== first, "no rerender");
    expect(el.shadowRoot.querySelectorAll("iframe").length).to.equal(1);
    expect(frameOf(el).style.width).to.equal("500px");
  });

  it("renders its header without a target and never writes null", async () => {
    const el = await fixture(html`<unity-webgl></unity-webgl>`);
    el.setAttribute("width", "300px");
    await waitUntil(() => el.shadowRoot.querySelector(".ddd-block-label"));
    expect(frameOf(el)).to.not.exist;
    expect(el.shadowRoot.textContent).to.not.include("null");
  });

  it("reflects attribute access through its getters and setters", async () => {
    const el = await fixture(html`<unity-webgl></unity-webgl>`);
    el.target = "new-target";
    expect(el.target).to.equal("new-target");
    expect(el.getAttribute("target")).to.equal("new-target");
    el.compression = "gzip";
    expect(el.compression).to.equal("gzip");
    el.streamingurl = "assets";
    expect(el.streamingurl).to.equal("assets");
    el.companyname = "ACME";
    expect(el.companyname).to.equal("ACME");
    el.productname = "Game";
    expect(el.productname).to.equal("Game");
    el.productversion = "1.0";
    expect(el.productversion).to.equal("1.0");
    el.width = "320px";
    expect(el.width).to.equal("320px");
    el.height = "240px";
    expect(el.height).to.equal("240px");
    el.background = "#000000";
    expect(el.background).to.equal("#000000");
  });

  it("styles through ShadyCSS when it is present", async () => {
    const styled = [];
    const prepared = [];
    globalThis.ShadyCSS = {
      styleElement(element) {
        styled.push(element);
      },
      prepareTemplate(template, tag) {
        prepared.push(tag);
      },
    };
    try {
      const el = await fixture(
        html`<unity-webgl target="shady-build" width="460px"></unity-webgl>`,
      );
      await waitUntil(() => frameOf(el), "no player frame");
    } finally {
      delete globalThis.ShadyCSS;
    }
    expect(styled.length).to.be.greaterThan(0);
    // render() prepares the template with the element tag so ShadyCSS scopes
    // the styles to unity-webgl instances
    expect(prepared[0]).to.equal("unity-webgl");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<unity-webgl
        target="demo-build"
        width="460px"
        height="400px"
        background="#231F20"
      ></unity-webgl>`,
    );
    await waitUntil(() => frameOf(el), "no player frame");
    await expect(el).shadowDom.to.be.accessible();
  });
});
