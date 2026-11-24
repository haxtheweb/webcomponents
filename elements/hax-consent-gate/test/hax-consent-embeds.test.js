import { expect, aTimeout } from "@open-wc/testing";
import { gateIframes } from "../lib/hax-consent-embeds.js";
import {
  HaxConsent,
  consentServiceForUrl,
} from "@haxtheweb/utils/lib/hax-consent.js";

// page content as HAXcms inserts it: parsed, detached, then appended
const parse = (markup) =>
  globalThis.document.createRange().createContextualFragment(markup);

describe("consentServiceForUrl", () => {
  it("names the services with their own entry", () => {
    expect(
      consentServiceForUrl("https://www.youtube.com/embed/x").service,
    ).to.equal("youtube");
    expect(
      consentServiceForUrl("https://player.vimeo.com/video/1").service,
    ).to.equal("vimeo");
    expect(
      consentServiceForUrl("https://www.google.com/maps/embed?pb=1").service,
    ).to.equal("google-maps");
    expect(
      consentServiceForUrl("https://maps.google.co.uk/x").service,
    ).to.equal("google-maps");
  });
  it("asks per host for anything else, matching hosts at a dot boundary", () => {
    expect(
      consentServiceForUrl("https://open.spotify.com/embed/x").service,
    ).to.equal("embed:open.spotify.com");
    expect(consentServiceForUrl("https://evilyoutube.com/x").service).to.equal(
      "embed:evilyoutube.com",
    );
    expect(
      consentServiceForUrl("https://youtube.com.evil.test/x").service,
    ).to.equal("embed:youtube.com.evil.test");
    expect(
      consentServiceForUrl("https://google.evil.test/maps/x").service,
    ).to.equal("embed:google.evil.test");
  });
  it("needs nothing for this site, relative paths or other protocols", () => {
    expect(
      consentServiceForUrl(globalThis.location.origin + "/files/a.pdf"),
    ).to.equal(null);
    expect(consentServiceForUrl("/files/a.pdf")).to.equal(null);
    expect(consentServiceForUrl("javascript:alert(1)")).to.equal(null);
    expect(consentServiceForUrl("")).to.equal(null);
  });
});

describe("gateIframes", () => {
  let host;
  beforeEach(() => {
    HaxConsent.clearAll();
    host = globalThis.document.createElement("div");
    globalThis.document.body.appendChild(host);
  });
  afterEach(() => {
    host.remove();
    HaxConsent.clearAll();
  });

  it("holds back a cross-origin frame and puts the panel in front of it", () => {
    const frag = parse(
      '<p>Map</p><iframe src="https://www.google.com/maps/embed?pb=1" title="map"></iframe>',
    );
    expect(gateIframes(frag)).to.equal(1);
    host.appendChild(frag);
    const frame = host.querySelector("iframe");
    expect(frame.hasAttribute("src")).to.equal(false);
    expect(frame.style.display).to.equal("none");
    const gate = frame.previousElementSibling;
    expect(gate.tagName).to.equal("HAX-CONSENT-GATE");
    expect(gate.getAttribute("service")).to.equal("google-maps");
  });

  it("leaves same-origin and already allowed frames alone", () => {
    HaxConsent.set("vimeo", "allow");
    const frag = parse(
      '<iframe src="/files/a.html" title="a"></iframe><iframe src="https://player.vimeo.com/video/1" title="v"></iframe>',
    );
    expect(gateIframes(frag)).to.equal(0);
    host.appendChild(frag);
    expect(host.querySelectorAll("hax-consent-gate").length).to.equal(0);
    expect(host.querySelectorAll("iframe[src]").length).to.equal(2);
  });

  it("loads the frame in place on allow and holds it back again on withdraw", async () => {
    const frag = parse(
      '<iframe src="https://example.com/x" title="x"></iframe>',
    );
    gateIframes(frag);
    host.appendChild(frag);
    HaxConsent.set("embed:example.com", "allow");
    await aTimeout(0);
    const frame = host.querySelector("iframe");
    expect(frame.getAttribute("src")).to.equal("https://example.com/x");
    expect(frame.style.display).to.equal("");
    expect(host.querySelector("hax-consent-gate")).to.not.exist;
    HaxConsent.set("embed:example.com", "deny");
    await aTimeout(0);
    expect(frame.hasAttribute("src")).to.equal(false);
    expect(host.querySelector("hax-consent-gate")).to.exist;
  });

  it("only moves the src aside inside iframe-loader, which draws its own panel", () => {
    const frag = parse(
      '<iframe-loader><iframe src="https://example.com/y" title="y"></iframe></iframe-loader>',
    );
    gateIframes(frag);
    const frame = frag.querySelector("iframe");
    expect(frame.hasAttribute("src")).to.equal(false);
    expect(frame.getAttribute("data-hax-consent-src")).to.equal(
      "https://example.com/y",
    );
    expect(frag.querySelector("hax-consent-gate")).to.not.exist;
  });

  it("puts the panel in front of a wrapper that would hide it", () => {
    const frag = parse(
      '<responsive-iframe><iframe src="https://example.com/z" title="z"></iframe></responsive-iframe>',
    );
    gateIframes(frag);
    host.appendChild(frag);
    const wrapper = host.querySelector("responsive-iframe");
    expect(wrapper.previousElementSibling.tagName).to.equal("HAX-CONSENT-GATE");
    expect(wrapper.style.display).to.equal("none");
  });
});
