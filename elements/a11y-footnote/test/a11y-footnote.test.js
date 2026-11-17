import { html, fixture, expect, aTimeout } from "@open-wc/testing";
import "../a11y-footnote.js";

const settle = () => aTimeout(60);

describe("a11y-footnote", () => {
  let main;
  beforeEach(async () => {
    main = await fixture(html`
      <main>
        <p>
          First claim<a11y-footnote>First source.</a11y-footnote> and a
          second<a11y-footnote>Second <em>source</em>.</a11y-footnote>.
        </p>
        <p>Third<a11y-footnote>Third source.</a11y-footnote>.</p>
      </main>
    `);
    await settle();
  });

  it("numbers notes in reading order", () => {
    const notes = main.querySelectorAll("a11y-footnote");
    expect([...notes].map((n) => n.number)).to.deep.equal([1, 2, 3]);
    const link = notes[1].shadowRoot.querySelector("a");
    expect(link.textContent.trim()).to.equal("2");
    expect(link.getAttribute("href")).to.equal("#a11y-footnote-2");
    expect(link.getAttribute("aria-label")).to.equal("Footnote 2");
  });

  it("assembles one list at the bottom of the content without being placed", () => {
    const lists = main.querySelectorAll("a11y-footnotes");
    expect(lists.length).to.equal(1);
    expect(main.lastElementChild).to.equal(lists[0]);
    const items = lists[0].querySelectorAll("li");
    expect(items.length).to.equal(3);
    expect(items[1].id).to.equal("a11y-footnote-2");
    // formatting in a note is kept in the list
    expect(items[1].querySelector("em").textContent).to.equal("source");
    expect(items[2].querySelector("a").getAttribute("href")).to.equal(
      "#a11y-footnote-ref-3",
    );
  });

  it("renumbers when a note is added and drops the list when none are left", async () => {
    const fn = document.createElement("a11y-footnote");
    fn.textContent = "Added first.";
    main.querySelector("p").prepend(fn);
    await settle();
    expect(fn.number).to.equal(1);
    expect(main.querySelectorAll("a11y-footnotes li").length).to.equal(4);
    main.querySelectorAll("a11y-footnote").forEach((n) => n.remove());
    await settle();
    expect(main.querySelector("a11y-footnotes")).to.equal(null);
  });

  it("shows the note in brackets where it was written while editing", async () => {
    const note = main.querySelector("a11y-footnote");
    note.haxeditModeChanged(true);
    await settle();
    expect(note.number).to.equal(0);
    expect(note.shadowRoot.querySelector(".inline-note")).to.exist;
    note.haxeditModeChanged(false);
    await settle();
    expect(note.number).to.equal(1);
  });

  it("keeps the list out of hax-body so it is never saved", async () => {
    const wrap = await fixture(html`
      <div>
        <hax-body
          ><p>Edited<a11y-footnote>Note.</a11y-footnote></p></hax-body
        >
      </div>
    `);
    await settle();
    const list = wrap.querySelector("a11y-footnotes");
    expect(list).to.exist;
    expect(list.closest("hax-body")).to.equal(null);
    expect(wrap.querySelector("hax-body").nextElementSibling).to.equal(list);
  });

  it("previews the note on focus and hides it on Escape", async () => {
    const note = main.querySelector("a11y-footnote");
    const link = note.shadowRoot.querySelector("a");
    link.focus();
    await note.updateComplete;
    const preview = note.shadowRoot.querySelector(".preview");
    expect(preview.hidden).to.equal(false);
    expect(preview.textContent).to.equal("First source.");
    link.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await note.updateComplete;
    expect(preview.hidden).to.equal(true);
  });

  it("passes the a11y audit", async () => {
    await expect(main).to.be.accessible();
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
      await expect(main).to.be.accessible();
    });
  });
});
