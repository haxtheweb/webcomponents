import { fixture, expect, html } from "@open-wc/testing";

import "../stop-note.js";
import { StopNote, StopNoteIconList } from "../stop-note.js";

describe("stop-note test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<stop-note
        title="Confirmation Message"
        url="https://www.google.com"
        icon="stopnoteicons:confirm-icon"
      >
        <span slot="message">You can write any confirmation</span>
      </stop-note>`,
    );
  });

  it("message slot correct", async () => {
    expect(
      element.shadowRoot
        .querySelector("slot[name='message']")
        .assignedNodes({ flatten: true })[0].textContent,
    ).to.equal("You can write any confirmation");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("stop-note gap coverage", () => {
  it("has default property values and tag", async () => {
    const el = await fixture(html`<stop-note></stop-note>`);
    await el.updateComplete;

    expect(el.constructor.tag).to.equal("stop-note");
    expect(el.title).to.equal("");
    expect(el.url).to.equal(null);
    expect(el.icon).to.equal("stopnoteicons:stop-icon");
    expect(el.t.moreInformation).to.equal("More Information");
    // the legacy reverse lookup derives status from the default icon
    expect(el.status).to.equal("stop");
  });

  it("passes the a11y audit with no url", async () => {
    const el = await fixture(
      html`<stop-note title="Stop and think">
        <span slot="message">Reflect before continuing</span>
      </stop-note>`,
    );
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible();
  });

  it("maps each status to its icon", async () => {
    const el = await fixture(html`<stop-note></stop-note>`);
    await el.updateComplete;

    el.status = "stop";
    await el.updateComplete;
    expect(el.icon).to.equal(StopNoteIconList.stop);

    el.status = "warning";
    await el.updateComplete;
    expect(el.icon).to.equal(StopNoteIconList.warning);

    el.status = "success";
    await el.updateComplete;
    expect(el.icon).to.equal(StopNoteIconList.success);

    el.status = "info";
    await el.updateComplete;
    expect(el.icon).to.equal(StopNoteIconList.info);
  });

  it("reflects status and icon changes to attributes", async () => {
    const el = await fixture(html`<stop-note></stop-note>`);
    await el.updateComplete;

    el.status = "warning";
    await el.updateComplete;
    expect(el.getAttribute("status")).to.equal("warning");
    // status drives the derived icon which is also reflected
    expect(el.getAttribute("icon")).to.equal(StopNoteIconList.warning);

    el.icon = "stopnoteicons:book-icon";
    await el.updateComplete;
    expect(el.getAttribute("icon")).to.equal(StopNoteIconList.info);
  });

  it("leaves icon untouched for an unmapped status", async () => {
    const el = await fixture(
      html`<stop-note icon="stopnoteicons:book-icon"></stop-note>`,
    );
    await el.updateComplete;

    el.status = "critical";
    await el.updateComplete;
    expect(el.icon).to.equal("stopnoteicons:book-icon");
  });

  it("renders the title as the heading with OER property", async () => {
    const el = await fixture(
      html`<stop-note title="Confirmation Message"></stop-note>`,
    );
    await el.updateComplete;

    const heading = el.shadowRoot.querySelector("h3#title");
    expect(heading).to.exist;
    expect(heading.getAttribute("property")).to.equal("oer:mainContent");
    expect(heading.textContent.trim()).to.equal("Confirmation Message");
  });

  it("renders a more information link only when url is set", async () => {
    const el = await fixture(
      html`<stop-note
        title="Confirmation Message"
        url="https://www.google.com"
      ></stop-note>`,
    );
    await el.updateComplete;

    const link = el.shadowRoot.querySelector("a#link");
    expect(link).to.exist;
    expect(link.getAttribute("href")).to.equal("https://www.google.com");
    expect(link.textContent.trim()).to.include("More Information");

    el.url = null;
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("a#link")).to.not.exist;
  });

  it("mirrors url into remoteLinkURL", async () => {
    const el = await fixture(
      html`<stop-note url="https://example.com/docs"></stop-note>`,
    );
    await el.updateComplete;
    expect(el.remoteLinkURL).to.equal("https://example.com/docs");

    el.url = "https://example.com/other";
    await el.updateComplete;
    expect(el.remoteLinkURL).to.equal("https://example.com/other");
  });

  it("registers hax hooks and applies hax edit state to the title", async () => {
    const el = await fixture(
      html`<stop-note title="Editable"></stop-note>`,
    );
    await el.updateComplete;

    const hooks = el.haxHooks();
    expect(hooks.editModeChanged).to.equal("haxeditModeChanged");
    expect(hooks.activeElementChanged).to.equal("haxactiveElementChanged");

    el.haxeditModeChanged(true);
    expect(el._haxstate).to.be.true;

    // active selection makes the title editable (no data-hax-lock present)
    const titleEl = el.shadowRoot.querySelector("h3#title");
    el.haxactiveElementChanged(el, true);
    expect(titleEl.hasAttribute("contenteditable")).to.be.true;

    // deactivating removes contenteditable and syncs title from the DOM;
    // mutate the text node in place (setting innerText would eject Lit's
    // part markers the same way it does in the browser)
    const textNode = Array.from(titleEl.childNodes).find(
      (node) => node.nodeType === 3 && node.textContent.trim() !== "",
    );
    textNode.textContent = "Edited inline";
    el.haxactiveElementChanged(el, false);
    expect(titleEl.hasAttribute("contenteditable")).to.be.false;
    expect(el.title).to.equal("Edited inline");
    await el.updateComplete;
  });

  it("ignores hax active changes while data-hax-lock is set", async () => {
    const el = await fixture(
      html`<stop-note title="Locked"></stop-note>`,
    );
    await el.updateComplete;

    el.setAttribute("data-hax-lock", "locked");
    const titleEl = el.shadowRoot.querySelector("h3#title");
    el.haxactiveElementChanged(el, true);
    expect(titleEl.hasAttribute("contenteditable")).to.be.false;
  });

  it("makes slotted anchors inherit color without overriding authored styles", async () => {
    const el = await fixture(
      html`<stop-note title="Links">
        <a href="https://example.com">plain link</a>
        <a href="https://example.com" style="color: red;" class="authored"
          >authored link</a
        >
        <a href="https://example.com" slot="message">slotted message link</a>
      </stop-note>`,
    );
    await el.updateComplete;

    const plainLink = el.querySelector("a:not([slot]):not(.authored)");
    const authoredLink = el.querySelector("a.authored");
    const messageLink = el.querySelector('a[slot="message"]');

    // links with no explicit color get inherit so they follow the note theme
    expect(plainLink.style.color).to.equal("inherit");
    expect(messageLink.style.color).to.equal("inherit");
    // an authored inline color is preserved
    expect(authoredLink.style.color).to.equal("red");
  });

  it("guards _applySlottedLinkColor against non-element targets", () => {
    // null and plain objects must not throw (defensive guard branches)
    expect(() => StopNote.prototype._applySlottedLinkColor.call(null)).to.not
      .throw();
    expect(() =>
      StopNote.prototype._applySlottedLinkColor.call({}, {}),
    ).to.not.throw();
  });

  it("guards _syncSlottedLinkColor before a shadow root exists", () => {
    // a this without shadowRoot must be a no-op rather than throw
    expect(() => StopNote.prototype._syncSlottedLinkColor.call({})).to.not
      .throw();
  });

  it("makes anchors nested inside slotted content inherit color", async () => {
    const el = await fixture(
      html`<stop-note title="Links">
        <div class="wrapper">
          <a href="https://example.com">nested link</a>
        </div>
      </stop-note>`,
    );
    await el.updateComplete;

    const nestedLink = el.querySelector("div.wrapper a");
    expect(nestedLink.style.color).to.equal("inherit");
  });

  it("exposes haxProperties via file reference", () => {
    expect(StopNote.haxProperties).to.include("haxProperties.json");
  });
});
