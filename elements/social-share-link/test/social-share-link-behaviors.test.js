import { fixture, expect, html } from "@open-wc/testing";

import "../social-share-link.js";

// Behavioral coverage for social-share-link: per-type share hrefs
// (Facebook / LinkedIn / Pinterest / Twitter), link text / icon
// derivation, display modes, and property-change recomputation.
describe("social-share-link behaviors", () => {
  it("registers the custom element", () => {
    expect(globalThis.customElements.get("social-share-link")).to.exist;
  });

  it("registers the DDD design system so its token fallbacks resolve", async () => {
    // haxtheweb/issues#3107: social-share-link extends DDD, whose base
    // class registers the DDD design system on first construction; that
    // globally injects the --ddd-* variables, so the token fallbacks in
    // the disabled / button styling resolve on pages that never
    // otherwise load DDD instead of degrading to inherit
    const el = await fixture(
      html`<social-share-link
        type="Twitter"
        message="hello"
        url="https://x.com"
      ></social-share-link>`,
    );
    await el.updateComplete;
    const root = globalThis.getComputedStyle(
      globalThis.document.documentElement,
    );
    expect(
      root.getPropertyValue("--ddd-theme-default-link").trim(),
    ).to.not.equal("");
    expect(
      root.getPropertyValue("--ddd-theme-default-nittanyNavy").trim(),
    ).to.not.equal("");
    expect(
      root.getPropertyValue("--ddd-theme-default-white").trim(),
    ).to.not.equal("");
  });

  it("renders a default Twitter link with icon and link text", async () => {
    const el = await fixture(html`<social-share-link></social-share-link>`);
    await el.updateComplete;
    expect(el.type).to.equal("Twitter");
    expect(el.__linkText).to.equal("Share via Twitter");
    expect(el.__icon).to.equal("mdi-social:twitter");
    const a = el.shadowRoot.querySelector("a");
    expect(a).to.exist;
    expect(a.getAttribute("target")).to.equal("_blank");
    expect(a.getAttribute("rel")).to.equal("noopener noreferrer");
    // issues#3102 #23 FIXED: with no message/url the Twitter intent href
    // is empty instead of concatenating the literal string 'null' into the
    // query, and the link is disabled on the host (#21)
    expect(el.__href).to.equal("");
    expect(el.hasAttribute("disabled")).to.equal(true);
    expect(el.disabled).to.equal(true);
  });

  it("builds a Facebook share href from the url", async () => {
    const el = await fixture(
      html`<social-share-link
        type="Facebook"
        url="http://zombo.com"
      ></social-share-link>`,
    );
    await el.updateComplete;
    expect(el.__href).to.equal(
      "https://www.facebook.com/sharer/sharer.php?u=http://zombo.com",
    );
    expect(el.shadowRoot.querySelector("a").getAttribute("href")).to.equal(
      "https://www.facebook.com/sharer/sharer.php?u=http://zombo.com",
    );
    expect(el.__linkText).to.equal("Share via Facebook");
    expect(el.__icon).to.equal("mdi-social:facebook");
  });

  it('Facebook without a url disables the host instead of href "false"', async () => {
    const el = await fixture(
      html`<social-share-link type="Facebook"></social-share-link>`,
    );
    await el.updateComplete;
    // issues#3102 #21 FIXED: url is truthiness-guarded before encodeURI (no
    // more encodeURI(false) coercing to the truthy string "false"), and
    // disabled is reflected onto the HOST so the :host([disabled]) a
    // styling is finally reachable (the old ?disabled binding landed on
    // the inner <a>, which no CSS selector targeted).
    expect(el.__href).to.equal("");
    expect(el.hasAttribute("disabled")).to.equal(true);
    const a = el.shadowRoot.querySelector("a");
    expect(a.getAttribute("aria-disabled")).to.equal("true");
  });

  it("builds a LinkedIn share href from the url", async () => {
    const el = await fixture(
      html`<social-share-link
        type="LinkedIn"
        url="https://btopro.com/"
      ></social-share-link>`,
    );
    await el.updateComplete;
    expect(el.__href).to.equal(
      "https://www.linkedin.com/shareArticle?mini=true&url=https://btopro.com/",
    );
  });

  it("builds a LinkedIn base href when url is missing", async () => {
    const el = await fixture(
      html`<social-share-link type="LinkedIn"></social-share-link>`,
    );
    await el.updateComplete;
    // issues#3102 #54 FIXED: the dead "link !== null" ternaries are gone;
    // a missing url still degrades to the bare share endpoint (behavior
    // preserved, now via an explicit truthiness guard).
    expect(el.__href).to.equal(
      "https://www.linkedin.com/shareArticle?mini=true",
    );
  });

  it("builds a Pinterest share href from url, message and image", async () => {
    const el = await fixture(
      html`<social-share-link
        type="Pinterest"
        url="http://zombo.com"
        message="Pin It!"
        image="http://lorempixel.com/400/200/cats"
      ></social-share-link>`,
    );
    await el.updateComplete;
    expect(el.__href).to.equal(
      "http://pinterest.com/pin/create/button/?url=http://zombo.com&description=Pin%20It!&media=http://lorempixel.com/400/200/cats",
    );
  });

  it("builds a Pinterest href with only supplied params", async () => {
    const el = await fixture(
      html`<social-share-link
        type="Pinterest"
        message="Pin It!"
      ></social-share-link>`,
    );
    await el.updateComplete;
    // issues#3102 #23/#54 FIXED: message/image default to "" (NOT null)
    // and are truthiness-guarded now, so empty "&description=" / "&media="
    // params are no longer appended.
    expect(el.__href).to.equal(
      "http://pinterest.com/pin/create/button/?description=Pin%20It!",
    );
  });

  it("builds a Twitter intent href from message and url", async () => {
    const el = await fixture(
      html`<social-share-link
        type="Twitter"
        message="hello"
        url="https://x.com"
      ></social-share-link>`,
    );
    await el.updateComplete;
    expect(el.__href).to.equal(
      "http://twitter.com/intent/tweet?text=hello%20https://x.com",
    );
  });

  it('an unknown type yields an empty href instead of "undefined"', async () => {
    // direct method call (no connect) so the icon resolver never
    // requests an iconset svg for the unknown type
    const el = globalThis.document.createElement("social-share-link");
    // issues#3102 #23 FIXED: _getHref now has a default case; an
    // unrecognized type returns "" (which disables the link) instead of
    // encodeURI(undefined) producing the navigable string "undefined".
    expect(el._getHref("", "", "Myspace", "https://x.com")).to.equal("");
    // issues#3102 #23: Twitter guards each param individually; a missing
    // message/url never concatenates the literal string "null"
    expect(el._getHref("", "hello", "Twitter", null)).to.equal(
      "http://twitter.com/intent/tweet?text=hello",
    );
    expect(el._getHref("", "", "Twitter", "https://x.com")).to.equal(
      "http://twitter.com/intent/tweet?text=https://x.com",
    );
    expect(el._getHref("", "", "Twitter", null)).to.equal("");
    // issues#3102 #23/#54: Pinterest with no usable params yields an empty
    // (disabled) link rather than a bare "?" endpoint
    expect(el._getHref("", "", "Pinterest", null)).to.equal("");
    expect(el._getLinkText(null, "Myspace")).to.equal("Share via Myspace");
    expect(el._getIcon("Myspace")).to.equal("mdi-social:myspace");
  });

  it("prevents navigation while disabled and allows clicks when enabled", async () => {
    const el = await fixture(
      html`<social-share-link type="Facebook"></social-share-link>`,
    );
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).to.equal(true);
    // issues#3102 #21: the @click handler prevents the empty href from
    // navigating while disabled (safe to dispatch here: the handler calls
    // preventDefault, so no activation/navigation happens)
    const a = el.shadowRoot.querySelector("a");
    const blocked = new MouseEvent("click", {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    a.dispatchEvent(blocked);
    expect(blocked.defaultPrevented).to.equal(true);
    // with something to share the handler does not block; invoke directly
    // because dispatching an unprevented synthetic click on a real href
    // would attempt a navigation in the test runner
    el.url = "http://zombo.com";
    await el.updateComplete;
    expect(el.hasAttribute("disabled")).to.equal(false);
    const allowed = new MouseEvent("click", { cancelable: true });
    el._clickShare(allowed);
    expect(allowed.defaultPrevented).to.equal(false);
  });

  it("honors custom link text over the default", async () => {
    const el = await fixture(
      html`<social-share-link
        type="Twitter"
        text="Tweet this!"
      ></social-share-link>`,
    );
    await el.updateComplete;
    expect(el.__linkText).to.equal("Tweet this!");
    const span = el.shadowRoot.querySelector("span.linktext");
    expect(span).to.exist;
    expect(span.textContent.trim()).to.equal("Tweet this!");
  });

  it("reflects button-style attribute on the host", async () => {
    const el = await fixture(
      html`<social-share-link button-style type="Twitter"></social-share-link>`,
    );
    await el.updateComplete;
    expect(el.buttonStyle).to.equal(true);
    expect(el.hasAttribute("button-style")).to.equal(true);
  });

  it("icon-only mode shows the icon and keeps text for screen readers", async () => {
    const el = await fixture(
      html`<social-share-link
        type="Pinterest"
        mode="icon-only"
        url="http://zombo.com"
      ></social-share-link>`,
    );
    await el.updateComplete;
    expect(el.__showIcon).to.equal(true);
    const a = el.shadowRoot.querySelector("a");
    expect(a.getAttribute("class")).to.equal("icon-only");
    const icon = el.shadowRoot.querySelector("simple-icon-lite");
    expect(icon.hasAttribute("hidden")).to.equal(false);
    const span = el.shadowRoot.querySelector("span.linktext");
    expect(span).to.exist;
    // linktext is visually offscreen but still present in the a11y tree
    expect(span.textContent.trim()).to.equal("Share via Pinterest");
  });

  it("text-only mode hides the icon", async () => {
    const el = await fixture(
      html`<social-share-link
        type="Facebook"
        mode="text-only"
        url="http://zombo.com"
      ></social-share-link>`,
    );
    await el.updateComplete;
    expect(el.__showIcon).to.equal(false);
    const a = el.shadowRoot.querySelector("a");
    expect(a.getAttribute("class")).to.equal("text-only");
    const icon = el.shadowRoot.querySelector("simple-icon-lite");
    expect(icon.hasAttribute("hidden")).to.equal(true);
  });

  it("default (no mode) shows both the icon and text", async () => {
    const el = await fixture(
      html`<social-share-link
        type="Twitter"
        text="Tweet this!"
        message="hi"
        url="https://x.com"
      ></social-share-link>`,
    );
    await el.updateComplete;
    // issues#3102 #22 FIXED: __showIcon is true for any mode except
    // "text-only", so the documented default (mode unset -> icon AND text
    // both displayed) actually renders the icon now. The demo relies on
    // the default showing both.
    expect(el.__showIcon).to.equal(true);
    const icon = el.shadowRoot.querySelector("simple-icon-lite");
    expect(icon.hasAttribute("hidden")).to.equal(false);
  });

  it("recomputes the href when url changes after connection", async () => {
    const el = await fixture(
      html`<social-share-link type="Facebook"></social-share-link>`,
    );
    await el.updateComplete;
    expect(el.__href).to.equal("");
    expect(el.hasAttribute("disabled")).to.equal(true);
    el.url = "http://zombo.com";
    await el.updateComplete;
    expect(el.__href).to.equal(
      "https://www.facebook.com/sharer/sharer.php?u=http://zombo.com",
    );
    // issues#3102 #21: the host disabled reflection clears once there is
    // something to share
    expect(el.hasAttribute("disabled")).to.equal(false);
  });

  it("declares the dark property and forwards it to the icon", async () => {
    const el = await fixture(
      html`<social-share-link
        dark
        type="Twitter"
        url="https://x.com"
      ></social-share-link>`,
    );
    await el.updateComplete;
    // issues#3102 DDD FIXED: dark was NOT a declared property, which made
    // the ?dark=${this.dark} render binding dead; it is declared (and
    // reflected) now, so the element can respond to dark mode and forward
    // it to the icon
    expect(el.dark).to.equal(true);
    const icon = el.shadowRoot.querySelector("simple-icon-lite");
    expect(icon.hasAttribute("dark")).to.equal(true);
  });

  it("recomputes icon and link text when type changes after connection", async () => {
    const el = await fixture(html`<social-share-link></social-share-link>`);
    await el.updateComplete;
    el.type = "LinkedIn";
    await el.updateComplete;
    expect(el.__icon).to.equal("mdi-social:linkedin");
    expect(el.__linkText).to.equal("Share via LinkedIn");
    expect(el.__href).to.equal(
      "https://www.linkedin.com/shareArticle?mini=true",
    );
  });

  it("passes the a11y audit in button mode", async () => {
    const el = await fixture(
      html`<social-share-link
        button-style
        type="Twitter"
        text="Tweet this!"
        message="hello"
        url="https://x.com"
      ></social-share-link>`,
    );
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible();
  });
});
