import { html, fixture, expect } from "@open-wc/testing";
import "../lib/hax-marketing-blocks.js";

describe("hax-marketing-blocks", function () {
  this.timeout(10000);

  it("gives every block a HAX editor schema file", () => {
    [
      "hax-cast",
      "hax-cast-member",
      "hax-pillar",
      "hax-pillar-strip",
      "hax-feature-row",
      "hax-stat-strip",
      "hax-stat",
      "hax-versus",
      "hax-chip",
    ].forEach((tag) => {
      expect(customElements.get(tag).haxProperties).to.match(
        new RegExp(`/lib/${tag}\\.haxProperties\\.json$`),
      );
    });
  });

  it("cast member: shows who it is and links only to http(s)", async () => {
    const good = await fixture(
      html`<hax-cast-member
        name="Teachers"
        link="https://example.com/teach"
        label="See how"
        >Build a course.</hax-cast-member
      >`,
    );
    expect(good.shadowRoot.textContent).to.contain("Teachers");
    expect(good.shadowRoot.querySelector("rpg-character")).to.exist;
    expect(good.shadowRoot.querySelector("a").getAttribute("href")).to.equal(
      "https://example.com/teach",
    );
    const bad = await fixture(
      html`<hax-cast-member
        name="Teachers"
        link="javascript:alert(1)"
        label="See how"
      ></hax-cast-member>`,
    );
    expect(bad.shadowRoot.querySelector("a")).to.not.exist;
  });

  it("pillar: compact card is one link to the pillar", async () => {
    const el = await fixture(
      html`<hax-pillar
        compact
        label="Accessible"
        phrase="Everyone gets in"
        icon="icons:accessibility"
        link="https://example.com/pillars"
      ></hax-pillar>`,
    );
    const links = el.shadowRoot.querySelectorAll("a");
    expect(links.length).to.equal(1);
    expect(links[0].textContent).to.contain("Accessible");
    expect(el.shadowRoot.textContent).to.not.contain("of 7");
  });

  it("stat: counts up to a number and offers its story", async () => {
    const el = await fixture(
      html`<hax-stat
        end="640"
        suffix="+"
        label="components"
        story="stories/abc12345"
      ></hax-stat>`,
    );
    expect(el.shadowRoot.querySelector("count-up")).to.exist;
    expect(el.shadowRoot.textContent).to.contain("components");
    expect(el.shadowRoot.querySelector("hax-story-link").story).to.equal(
      "stories/abc12345",
    );
    // no thousands separator unless asked, so years stay years
    expect(el.shadowRoot.querySelector("count-up").separator).to.equal("");
    const big = await fixture(
      html`<hax-stat end="17287" separator="," label="pages"></hax-stat>`,
    );
    expect(big.shadowRoot.querySelector("count-up").separator).to.equal(",");
    const words = await fixture(
      html`<hax-stat value="$0" label="Forever yours."></hax-stat>`,
    );
    expect(words.shadowRoot.querySelector("count-up")).to.not.exist;
    expect(words.shadowRoot.textContent).to.contain("$0");
  });

  it("feature row: describes its picture", async () => {
    const picture = new URL("../demo/files/screen-edit.jpg", import.meta.url)
      .href;
    const el = await fixture(
      html`<hax-feature-row
        eyebrow="Edit"
        heading="Click the page"
        image="${picture}"
        alt="A page in edit mode"
        >Type. Done.</hax-feature-row
      >`,
    );
    expect(el.shadowRoot.querySelector("img").getAttribute("alt")).to.equal(
      "A page in edit mode",
    );
    expect(el.shadowRoot.textContent).to.contain("Click the page");
  });

  it("versus: two characters face off over one link", async () => {
    const el = await fixture(
      html`<hax-versus
        heading="How does it stack up?"
        link="https://example.com/compare"
        label="Compare head to head"
        left="hax"
        right="other"
      ></hax-versus>`,
    );
    expect(el.shadowRoot.querySelectorAll("rpg-character").length).to.equal(2);
    expect(el.shadowRoot.querySelector("a").textContent).to.contain(
      "Compare head to head",
    );
  });

  it("chip: an icon and a label", async () => {
    const el = await fixture(
      html`<hax-chip icon="hax:file-docx" label="DOCX"></hax-chip>`,
    );
    expect(el.shadowRoot.textContent).to.contain("DOCX");
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<div>
        <hax-stat-strip
          ><hax-stat end="100" suffix="+" label="languages"></hax-stat
        ></hax-stat-strip>
        <hax-pillar-strip
          ><hax-pillar
            compact
            label="Accessible"
            phrase="Everyone gets in"
            icon="icons:accessibility"
            link="https://example.com/pillars"
          ></hax-pillar
        ></hax-pillar-strip>
        <hax-cast
          ><hax-cast-member
            name="Teachers"
            link="https://example.com/teach"
            label="See how"
            >Build a course.</hax-cast-member
          ></hax-cast
        >
        <hax-chip icon="hax:file-docx" label="DOCX"></hax-chip>
      </div>`,
    );
    await expect(el).to.be.accessible();
  });
});
