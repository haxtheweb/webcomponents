import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-tabs.js";

const tabsFixture = () =>
  fixture(html`
    <a11y-tabs active-tab="one">
      <a11y-tab id="one" icon="maps:restaurant" label="One">1</a11y-tab>
      <a11y-tab id="two" icon="maps:store-mall-directory" label="Two" flag="New"
        >2</a11y-tab
      >
      <a11y-tab id="three" icon="communication:phone" label="Three" disabled
        >3</a11y-tab
      >
    </a11y-tabs>
  `);

describe("a11y-tabs DDD tab row", () => {
  it("renders the icon before the label", async () => {
    const el = await tabsFixture();
    await el.updateComplete;
    const btn = el.shadowRoot.querySelector("#one-button");
    const parts = [...btn.children].filter((n) => !n.hidden);
    const icon = parts.findIndex((n) => n.classList.contains("icon"));
    const label = parts.findIndex((n) => n.classList.contains("label"));
    expect(icon).to.be.greaterThan(-1);
    expect(icon).to.be.lessThan(label);
  });

  it("gives tabs a 44px target and the selected tab a 3px rule", async () => {
    const el = await tabsFixture();
    await el.updateComplete;
    const selected = el.shadowRoot.querySelector("#one-button");
    const other = el.shadowRoot.querySelector("#two-button");
    expect(selected.getBoundingClientRect().height).to.be.at.least(44);
    expect(getComputedStyle(selected).borderBottomWidth).to.equal("3px");
    expect(getComputedStyle(selected).borderBottomColor).to.not.equal(
      getComputedStyle(other).borderBottomColor,
    );
    expect(Number(getComputedStyle(selected).fontWeight)).to.be.at.least(700);
  });

  it("frames tabs and panel together", async () => {
    const el = await tabsFixture();
    const cs = getComputedStyle(el);
    expect(cs.borderTopWidth).to.equal("1px");
    expect(cs.borderTopLeftRadius).to.not.equal("0px");
  });

  it("shows the flag as a visible pill", async () => {
    const el = await tabsFixture();
    await el.updateComplete;
    const flag = el.shadowRoot.querySelector("#two-button .flag-type");
    expect(flag.hidden).to.be.false;
    expect(flag.textContent.trim()).to.equal("New");
    const rect = flag.getBoundingClientRect();
    expect(rect.width).to.be.greaterThan(0);
    expect(rect.height).to.be.greaterThan(0);
    expect(
      el.shadowRoot
        .querySelector("#one-button .flag-type")
        .getBoundingClientRect().width,
    ).to.equal(0);
  });

  it("mutes the disabled tab", async () => {
    const el = await tabsFixture();
    await el.updateComplete;
    const disabled = el.shadowRoot.querySelector("#three-button");
    expect(disabled.disabled).to.be.true;
    expect(Number(getComputedStyle(disabled).opacity)).to.be.below(1);
  });

  it("keeps --a11y-tabs-* overrides", async () => {
    const el = await fixture(html`
      <a11y-tabs
        style="--a11y-tabs-faded-background: rgb(1, 2, 3); --a11y-tabs-selected-color: rgb(0, 128, 0); --a11y-tabs-border-radius: 0px;"
      >
        <a11y-tab id="a" label="A">A</a11y-tab>
        <a11y-tab id="b" label="B">B</a11y-tab>
      </a11y-tabs>
    `);
    await el.updateComplete;
    const [a, b] = el.shadowRoot.querySelectorAll("#tabs button");
    expect(getComputedStyle(a).color).to.equal("rgb(0, 128, 0)");
    expect(getComputedStyle(b).backgroundColor).to.equal("rgb(1, 2, 3)");
    expect(getComputedStyle(el).borderTopLeftRadius).to.equal("0px");
  });

  it("marks the selected tab with a left rule when vertical", async () => {
    const el = await fixture(html`
      <a11y-tabs layout-breakpoint="-1">
        <a11y-tab id="v1" label="One">1</a11y-tab>
        <a11y-tab id="v2" label="Two">2</a11y-tab>
      </a11y-tabs>
    `);
    await el.updateComplete;
    await new Promise((r) => setTimeout(r, 100));
    expect(el.hasAttribute("vertical")).to.be.true;
    const btn = el.shadowRoot.querySelector("#v1-button");
    expect(getComputedStyle(btn).borderLeftWidth).to.equal("3px");
  });
});
