import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import { executeServerCommand, setViewport } from "@web/test-runner-commands";
import "../lti-launch.js";
import {
  deviceActor,
  setActorProvider,
} from "@haxtheweb/user-action/lib/xapi.js";

const $ = (el, sel) => el.shadowRoot.querySelector(sel);
const LAUNCH = "https://tool.example/lab4";
const LOGIN = "https://tool.example/lti/login";

// click a control without letting the browser navigate or open a window;
// returns whether the element itself already stopped it
function clickWithoutNavigating(target) {
  let stoppedByElement = null;
  const stop = (e) => {
    stoppedByElement = e.defaultPrevented;
    e.preventDefault();
  };
  target.addEventListener("click", stop, { once: true });
  target.click();
  return stoppedByElement;
}

// submit the login form the way the button does, never navigating; returns
// the fields that would have been posted, or null when the element stopped it
function submitWithoutNavigating(el, buttonId = "launch") {
  const form = $(el, "form#login");
  let fields = null;
  const stop = (e) => {
    if (!e.defaultPrevented) {
      fields = Object.fromEntries(new FormData(form).entries());
    }
    e.preventDefault();
  };
  form.addEventListener("submit", stop, { once: true });
  form.requestSubmit($(el, `#${buttonId}`));
  form.removeEventListener("submit", stop);
  return fields;
}

const plain = () =>
  fixture(html`
    <lti-launch
      title="Lab 4 autograder"
      description="Submit your code to the autograder."
      launch-url="${LAUNCH}"
      ><a slot="fallback" href="${LAUNCH}">Lab 4 autograder</a></lti-launch
    >
  `);

const lti = (extra = {}) =>
  fixture(html`
    <lti-launch
      title="Lab 4 autograder"
      launch-url="${LAUNCH}"
      login-url="${LOGIN}"
      client-id="hax-8c1f"
      deployment-id="dep-001"
      display="${extra.display || "window"}"
      login-hint="${extra.loginHint || ""}"
      lti-message-hint="${extra.messageHint || ""}"
      issuer="${extra.issuer || ""}"
    ></lti-launch>
  `);

describe("lti-launch", () => {
  before(() =>
    setActorProvider(() =>
      deviceActor(
        "4b9f1c1e-0000-4000-8000-0000000000e1",
        "https://example.org/",
      ),
    ),
  );
  after(() => setActorProvider(null));

  describe("plain link, new window", () => {
    let el;
    beforeEach(async () => {
      el = await plain();
    });

    it("renders the DDD block frame with title, description and a footer", () => {
      const block = $(el, ".ddd-block");
      expect(block.getAttribute("role")).to.equal("group");
      expect($(el, "#" + block.getAttribute("aria-labelledby"))).to.exist;
      expect($(el, ".ddd-block-chip")).to.exist;
      expect($(el, ".ddd-block-label").textContent).to.equal("External tool");
      expect($(el, ".ddd-block-title").textContent).to.equal(
        "Lab 4 autograder",
      );
      expect($(el, "#description").textContent).to.equal(
        "Submit your code to the autograder.",
      );
      expect($(el, ".ddd-block-footer #launch")).to.exist;
    });

    it("is a real link that says it opens a new window, with noopener", () => {
      const link = $(el, "#launch");
      expect(link.tagName).to.equal("A");
      expect(link.getAttribute("href")).to.equal(LAUNCH);
      expect(link.getAttribute("target")).to.equal("_blank");
      expect(link.getAttribute("rel").split(" ")).to.include("noopener");
      expect(link.textContent.trim()).to.equal(
        "Open Lab 4 autograder (new window)",
      );
      expect($(el, "form")).to.not.exist;
      expect($(el, "iframe")).to.not.exist;
    });

    it("keeps the light DOM fallback link untouched and undisplayed", async () => {
      const link = el.querySelector('a[slot="fallback"]');
      expect(link.getAttribute("href")).to.equal(LAUNCH);
      expect(link.getBoundingClientRect().width).to.equal(0);
      const before = el.innerHTML;
      clickWithoutNavigating($(el, "#launch"));
      await el.updateComplete;
      expect(el.innerHTML).to.equal(before);
    });

    it("sends one conformant attempted statement when launched", async () => {
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      const stopped = clickWithoutNavigating($(el, "#launch"));
      expect(stopped).to.equal(false);
      await el.updateComplete;
      expect(events.length).to.equal(1);
      expect(events[0].activityDisplay).to.equal("attempted");
      expect(events[0].objectName).to.equal("Lab 4 autograder");
      const s = events[0].statement;
      expect(s.verb.id).to.equal("http://adlnet.gov/expapi/verbs/attempted");
      expect(s.object.definition.type).to.equal(
        "http://adlnet.gov/expapi/activities/interaction",
      );
      expect(s.result).to.equal(undefined);
      const r = await executeServerCommand("xapi-validate", s);
      expect(r.errors).to.deep.equal([]);
      expect($(el, "#status").textContent.trim()).to.equal(
        "A new window opened with the tool.",
      );
      // the same activity every time
      clickWithoutNavigating($(el, "#launch"));
      expect(events[1].statement.object.id).to.equal(s.object.id);
    });

    it("toggles the directions", async () => {
      $(el, "#directions-toggle").click();
      await el.updateComplete;
      expect($(el, "#directions").hidden).to.equal(false);
      expect($(el, "#directions").textContent).to.include("new window");
      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes the a11y audit", async () => {
      await expect(el).shadowDom.to.be.accessible();
      clickWithoutNavigating($(el, "#launch"));
      await el.updateComplete;
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  describe("address validation", () => {
    const hostile = [
      "javascript:alert(1)",
      "JaVaScRiPt:alert(document.domain)",
      "java\nscript:alert(1)",
      "data:text/html,<script>alert(1)</script>",
      "vbscript:msgbox(1)",
      "blob:https://example.org/1",
      "file:///etc/passwd",
      "//tool.example/lab4",
      "/lab4",
      "https://user:pass@tool.example/",
      "",
    ];

    hostile.forEach((value) => {
      it(`renders nothing to open for ${JSON.stringify(value)}`, async () => {
        const el = await fixture(
          html`<lti-launch
            title="Bad"
            launch-url="${value}"
            login-url="${LOGIN}"
            client-id="c"
            deployment-id="d"
            display="embed"
          ></lti-launch>`,
        );
        expect($(el, "#needs-url")).to.exist;
        expect($(el, "#launch")).to.not.exist;
        expect($(el, "a")).to.not.exist;
        expect($(el, "form")).to.not.exist;
        expect($(el, "iframe")).to.not.exist;
        await expect(el).shadowDom.to.be.accessible();
      });
    });

    it("falls back to a plain link when the login address is hostile", async () => {
      const el = await fixture(
        html`<lti-launch
          title="Tool"
          launch-url="${LAUNCH}"
          login-url="javascript:alert(1)"
          client-id="c"
          deployment-id="d"
        ></lti-launch>`,
      );
      expect($(el, "form")).to.not.exist;
      expect($(el, "#launch").getAttribute("href")).to.equal(LAUNCH);
      expect(el.shadowRoot.innerHTML).to.not.include("javascript:");
    });

    it("is a plain link until all three LTI settings are there", async () => {
      const el = await fixture(
        html`<lti-launch
          title="Tool"
          launch-url="${LAUNCH}"
          login-url="${LOGIN}"
          client-id="c"
        ></lti-launch>`,
      );
      expect($(el, "form")).to.not.exist;
      el.deploymentId = "d";
      await el.updateComplete;
      expect($(el, "form#login")).to.exist;
    });
  });

  describe("LTI 1.3 login request", () => {
    it("renders a real post form to the login address with the request fields", async () => {
      const el = await lti({ loginHint: "learner-1", messageHint: "msg-1" });
      const form = $(el, "form#login");
      expect(form.getAttribute("method")).to.equal("post");
      expect(form.getAttribute("action")).to.equal(LOGIN);
      expect(form.getAttribute("target")).to.equal("_blank");
      expect(form.getAttribute("rel")).to.equal("noopener");
      expect($(el, ".ddd-block-label").textContent).to.include("LTI 1.3");
      const button = $(el, "#launch");
      expect(button.tagName).to.equal("BUTTON");
      expect(button.getAttribute("type")).to.equal("submit");
      expect(button.textContent.trim()).to.equal(
        "Open Lab 4 autograder (new window)",
      );
      const fields = submitWithoutNavigating(el);
      expect(fields).to.deep.equal({
        iss: location.origin,
        target_link_uri: LAUNCH,
        client_id: "hax-8c1f",
        lti_deployment_id: "dep-001",
        login_hint: "learner-1",
        lti_message_hint: "msg-1",
      });
      await expect(el).shadowDom.to.be.accessible();
    });

    it("uses the issuer attribute when it is an http(s) address", async () => {
      const el = await lti({
        loginHint: "learner-1",
        issuer: "https://courses.example",
      });
      expect(submitWithoutNavigating(el).iss).to.equal(
        "https://courses.example",
      );
      el.issuer = "javascript:alert(1)";
      await el.updateComplete;
      expect(submitWithoutNavigating(el).iss).to.equal(location.origin);
    });

    it("fires a cancelable lti-launch-request a host can fill in", async () => {
      const el = await lti();
      const seen = [];
      const host = (e) => {
        seen.push(JSON.parse(JSON.stringify(e.detail)));
        expect(e.cancelable).to.equal(true);
        expect(e.bubbles).to.equal(true);
        expect(e.composed).to.equal(true);
        e.detail.params.login_hint = "from-host";
        e.detail.params.lti_message_hint = "launch-42";
        // a host cannot redirect the request or change the author's settings
        e.detail.params.target_link_uri = "javascript:alert(1)";
        e.detail.params.client_id = "someone-else";
        e.detail.loginUrl = "https://evil.example/";
      };
      document.addEventListener("lti-launch-request", host);
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      const fields = submitWithoutNavigating(el);
      document.removeEventListener("lti-launch-request", host);
      expect(seen.length).to.equal(1);
      expect(seen[0].display).to.equal("window");
      expect(seen[0].loginUrl).to.equal(LOGIN);
      expect(seen[0].params.login_hint).to.equal("");
      expect(seen[0].params.target_link_uri).to.equal(LAUNCH);
      expect(fields.login_hint).to.equal("from-host");
      expect(fields.lti_message_hint).to.equal("launch-42");
      expect(fields.target_link_uri).to.equal(LAUNCH);
      expect(fields.client_id).to.equal("hax-8c1f");
      expect($(el, "form").getAttribute("action")).to.equal(LOGIN);
      expect(events.length).to.equal(1);
      const r = await executeServerCommand(
        "xapi-validate",
        events[0].statement,
      );
      expect(r.errors).to.deep.equal([]);
    });

    it("does not launch when the host cancels", async () => {
      const el = await lti({ loginHint: "learner-1" });
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      el.addEventListener("lti-launch-request", (e) => e.preventDefault(), {
        once: true,
      });
      expect(submitWithoutNavigating(el)).to.equal(null);
      expect(events.length).to.equal(0);
      await el.updateComplete;
      expect($(el, "#status").textContent.trim()).to.equal("");
    });

    it("sends nothing without a login hint, and says why", async () => {
      const el = await lti();
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      expect(submitWithoutNavigating(el)).to.equal(null);
      await el.updateComplete;
      expect(events.length).to.equal(0);
      expect($(el, "#status").textContent).to.include("Nothing was opened");
      await expect(el).shadowDom.to.be.accessible();
    });

    it("ignores hints that are not text", async () => {
      const el = await lti({ loginHint: "learner-1" });
      el.addEventListener(
        "lti-launch-request",
        (e) => {
          e.detail.params.login_hint = { toString: () => "x" };
        },
        { once: true },
      );
      expect(submitWithoutNavigating(el)).to.equal(null);
    });
  });

  describe("embed", () => {
    it("has a titled, sandboxed, lazy frame that loads only when opened", async () => {
      const el = await fixture(html`
        <lti-launch
          title="Sample tool"
          launch-url="${LAUNCH}"
          display="embed"
          embed-height="300"
        ></lti-launch>
      `);
      const frame = $(el, "iframe");
      expect(frame.hidden).to.equal(true);
      expect(frame.hasAttribute("src")).to.equal(false);
      expect(frame.getAttribute("title")).to.equal(
        "Sample tool (external tool)",
      );
      expect(frame.getAttribute("loading")).to.equal("lazy");
      expect(frame.getAttribute("allow")).to.equal("fullscreen");
      const sandbox = frame.getAttribute("sandbox").split(" ");
      expect(sandbox).to.include("allow-scripts");
      expect(sandbox).to.include("allow-forms");
      expect(sandbox).to.include("allow-same-origin");
      expect(sandbox).to.not.include("allow-top-navigation");
      expect(frame.style.height).to.equal("300px");
      // the visible fallback link
      const instead = $(el, "#open-instead");
      expect(instead.tagName).to.equal("A");
      expect(instead.getAttribute("href")).to.equal(LAUNCH);
      expect(instead.getAttribute("target")).to.equal("_blank");
      expect(instead.getAttribute("rel")).to.include("noopener");
      expect(instead.getBoundingClientRect().height).to.be.at.least(24);
      const button = $(el, "#launch");
      expect(button.textContent.trim()).to.equal("Open Sample tool");
      await expect(el).shadowDom.to.be.accessible();
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      // never reach the network in the test
      el.launchUrl = new URL("../demo/tool.html", import.meta.url).href;
      await el.updateComplete;
      button.click();
      await waitUntil(() => !$(el, "iframe").hidden, "frame shown");
      expect($(el, "iframe").getAttribute("src")).to.equal(el.launchUrl);
      expect(events.length).to.equal(1);
      expect($(el, "#status").textContent.trim()).to.equal(
        "The tool opened on this page.",
      );
      await waitUntil(
        () => el.shadowRoot.activeElement === $(el, "iframe"),
        "focus moves to the frame",
      );
      await expect(el).shadowDom.to.be.accessible();
    });

    it("drops allow-same-origin for a tool on the page's own origin", async () => {
      const own = new URL("../demo/tool.html", import.meta.url).href;
      const el = await fixture(
        html`<lti-launch
          title="Own"
          launch-url="${own}"
          display="embed"
        ></lti-launch>`,
      );
      expect($(el, "iframe").getAttribute("sandbox")).to.not.include(
        "allow-same-origin",
      );
    });

    it("clamps the height", async () => {
      const el = await fixture(
        html`<lti-launch
          launch-url="${LAUNCH}"
          display="embed"
          embed-height="99999"
        ></lti-launch>`,
      );
      expect($(el, "iframe").style.height).to.equal("2000px");
      el.embedHeight = "abc";
      await el.updateComplete;
      expect($(el, "iframe").style.height).to.equal("480px");
      el.embedHeight = 1;
      await el.updateComplete;
      expect($(el, "iframe").style.height).to.equal("200px");
    });

    it("posts the LTI form into its own frame, with a new window fallback", async () => {
      const el = await lti({ display: "embed", loginHint: "learner-1" });
      const other = await lti({ display: "embed", loginHint: "learner-1" });
      const form = $(el, "form#login");
      const frame = $(el, "iframe");
      expect(frame.getAttribute("name")).to.match(/^lti-launch-[0-9a-f]{16}$/);
      expect(form.getAttribute("target")).to.equal(frame.getAttribute("name"));
      expect($(other, "iframe").getAttribute("name")).to.not.equal(
        frame.getAttribute("name"),
      );
      expect(frame.hasAttribute("src")).to.equal(false);
      const instead = $(el, "#open-instead");
      expect(instead.getAttribute("type")).to.equal("submit");
      expect(instead.getAttribute("formtarget")).to.equal("_blank");
      const requests = [];
      el.addEventListener("lti-launch-request", (e) =>
        requests.push(e.detail.display),
      );
      expect(submitWithoutNavigating(el, "open-instead").login_hint).to.equal(
        "learner-1",
      );
      await el.updateComplete;
      expect(frame.hidden).to.equal(true);
      expect(submitWithoutNavigating(el).target_link_uri).to.equal(LAUNCH);
      await el.updateComplete;
      expect(frame.hidden).to.equal(false);
      expect(requests).to.deep.equal(["window", "embed"]);
      await expect(el).shadowDom.to.be.accessible();
    });
  });

  describe("HAX", () => {
    it("does not launch or send anything in edit mode", async () => {
      const el = await plain();
      const events = [];
      el.addEventListener("user-engagement", (e) => events.push(e.detail));
      expect(el.haxHooks().editModeChanged).to.equal("haxeditModeChanged");
      el.haxeditModeChanged(true);
      expect(clickWithoutNavigating($(el, "#launch"))).to.equal(true);
      expect(events.length).to.equal(0);
      el.haxeditModeChanged(false);
      expect(clickWithoutNavigating($(el, "#launch"))).to.equal(false);
      expect(events.length).to.equal(1);
    });

    it("does not post the LTI form or open the frame in edit mode", async () => {
      const el = await lti({ display: "embed", loginHint: "learner-1" });
      let asked = 0;
      el.addEventListener("lti-launch-request", () => asked++);
      el.haxeditModeChanged(true);
      expect(submitWithoutNavigating(el)).to.equal(null);
      expect(asked).to.equal(0);
      const embed = await fixture(
        html`<lti-launch launch-url="${LAUNCH}" display="embed"></lti-launch>`,
      );
      embed.haxeditModeChanged(true);
      $(embed, "#launch").click();
      await embed.updateComplete;
      expect($(embed, "iframe").hidden).to.equal(true);
    });

    it("respects the HAX store's edit mode", async () => {
      const previous = globalThis.HaxStore;
      globalThis.HaxStore = {
        requestAvailability: () => ({ editMode: true }),
      };
      try {
        const el = await plain();
        const events = [];
        el.addEventListener("user-engagement", (e) => events.push(e.detail));
        expect(clickWithoutNavigating($(el, "#launch"))).to.equal(true);
        expect(events.length).to.equal(0);
      } finally {
        globalThis.HaxStore = previous;
      }
    });

    it("closes an open frame when editing starts", async () => {
      const el = await fixture(
        html`<lti-launch
          launch-url="${new URL("../demo/tool.html", import.meta.url).href}"
          display="embed"
        ></lti-launch>`,
      );
      $(el, "#launch").click();
      await waitUntil(() => !$(el, "iframe").hidden);
      el.haxeditModeChanged(true);
      await el.updateComplete;
      expect($(el, "iframe").hidden).to.equal(true);
      expect($(el, "iframe").hasAttribute("src")).to.equal(false);
    });

    it("writes one plain fallback link on save, and the same one every time", async () => {
      const el = await fixture(
        html`<lti-launch title="Tool" launch-url="${LAUNCH}"></lti-launch>`,
      );
      expect(el.haxHooks().preProcessNodeToContent).to.equal(
        "haxpreProcessNodeToContent",
      );
      const first = el.haxpreProcessNodeToContent(el.cloneNode(true)).outerHTML;
      expect(first).to.include(`<a slot="fallback" href="${LAUNCH}">Tool</a>`);
      const loaded = await fixture(first);
      const second = loaded.haxpreProcessNodeToContent(
        loaded.cloneNode(true),
      ).outerHTML;
      expect(second).to.equal(first);
      // a hostile address never becomes a link, and a stale link goes away
      loaded.setAttribute("launch-url", "javascript:alert(1)");
      await loaded.updateComplete;
      const bad = loaded.haxpreProcessNodeToContent(loaded.cloneNode(true));
      expect(bad.querySelector("a")).to.equal(null);
      // something else in the slot is replaced by a link
      const odd = await fixture(
        html`<lti-launch title="Tool" launch-url="${LAUNCH}"
          ><span slot="fallback">x</span
          ><a slot="fallback" href="https://old.example/">old</a></lti-launch
        >`,
      );
      const fixed = odd.haxpreProcessNodeToContent(odd.cloneNode(true));
      expect(fixed.querySelectorAll('[slot="fallback"]').length).to.equal(1);
      expect(fixed.querySelector("a").getAttribute("href")).to.equal(LAUNCH);
    });

    it("declares a vocabulary that does not count toward completion", () => {
      const v = customElements.get("lti-launch").xapiVocabulary;
      expect(v.tag).to.equal("lti-launch");
      expect(v.verbs).to.deep.equal(["attempted"]);
      expect(v.countsTowardCompletion).to.equal(false);
      expect(v.objectType).to.equal(
        "http://adlnet.gov/expapi/activities/interaction",
      );
    });

    it("ships HAX settings without secrets", async () => {
      const url = customElements.get("lti-launch").haxProperties;
      const props = await (await fetch(url)).json();
      expect(props.gizmo.tags).to.include("Instructional");
      expect(props.settings.configure.map((f) => f.property)).to.deep.equal([
        "title",
        "description",
        "launchUrl",
        "display",
      ]);
      const advanced = props.settings.advanced.map((f) => f.property);
      ["loginUrl", "clientId", "deploymentId", "issuer", "embedHeight"].forEach(
        (name) => expect(advanced).to.include(name),
      );
      const all = JSON.stringify(props.settings).toLowerCase();
      expect(all).to.not.include('"property":"secret');
      expect(all).to.not.include('"property":"key');
      expect(
        Object.keys(customElements.get("lti-launch").properties),
      ).to.not.include("clientSecret");
    });
  });

  describe("phone width", () => {
    before(async () => {
      await setViewport({ width: 360, height: 740 });
    });
    after(async () => {
      await setViewport({ width: 1024, height: 768 });
    });

    it("fits 360px with targets of at least 24px", async () => {
      const el = await fixture(html`
        <lti-launch
          title="A tool with a very long name that has to wrap on a phone screen"
          description="Averyveryveryveryveryveryveryveryveryverylongwordwithoutanyspacesinitatall and more."
          launch-url="${LAUNCH}"
          login-url="${LOGIN}"
          client-id="c"
          deployment-id="d"
          display="embed"
        ></lti-launch>
      `);
      const doc = document.documentElement;
      expect(doc.scrollWidth).to.be.at.most(doc.clientWidth);
      el.shadowRoot.querySelectorAll("button, a").forEach((control) => {
        const box = control.getBoundingClientRect();
        expect(box.right).to.be.at.most(doc.clientWidth);
        expect(box.height).to.be.at.least(24);
        expect(box.width).to.be.at.least(24);
      });
    });
  });

  describe("dark mode", () => {
    const root = document.documentElement;
    const body = document.body;
    let previous;
    beforeEach(() => {
      previous = {
        scheme: root.style.colorScheme,
        background: body.style.backgroundColor,
        color: body.style.color,
      };
      // light-dark() resolves against the used color-scheme. The explicit
      // Canvas background is needed because axe assumes a white page when
      // none is set, which would hide dark mode contrast failures.
      root.style.colorScheme = "dark";
      body.style.backgroundColor = "Canvas";
      body.style.color = "CanvasText";
    });
    afterEach(() => {
      root.style.colorScheme = previous.scheme;
      body.style.backgroundColor = previous.background;
      body.style.color = previous.color;
    });

    it("passes the a11y audit in dark mode", async () => {
      const el = await plain();
      await expect(el).shadowDom.to.be.accessible();
      const embed = await lti({ display: "embed" });
      submitWithoutNavigating(embed);
      await embed.updateComplete;
      await expect(embed).shadowDom.to.be.accessible();
      const none = await fixture(html`<lti-launch title="None"></lti-launch>`);
      await expect(none).shadowDom.to.be.accessible();
    });
  });

  describe("reduced motion", () => {
    it("has no transition or animation of its own", () => {
      const sheets = customElements.get("lti-launch").elementStyles;
      expect(sheets[sheets.length - 1].cssText).to.not.match(
        /transition|animation/,
      );
    });
  });
});
