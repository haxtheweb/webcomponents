import { fixture, expect, html } from "@open-wc/testing";
import "../simple-pager.js";

function waitForPageChanged(el) {
  return new Promise((resolve) => {
    el.addEventListener("page-changed", (e) => resolve(e), { once: true });
  });
}

function iconButtons(el) {
  return [...el.shadowRoot.querySelectorAll("simple-icon-button-lite")];
}

describe("SimplePager", () => {
  it("instantiates with default properties", async () => {
    const el = await fixture(html`<simple-pager></simple-pager>`);
    expect(el.limit).to.equal(25);
    expect(el.offset).to.equal(0);
    expect(el.total).to.equal(0);
    expect(el.count).to.equal(0);
    expect(el.mode).to.equal("mini");
    expect(el.maxPageButtons).to.equal(10);
    expect(el.forceVisible).to.equal(false);
  });

  it("hides when total fits within a single page", async () => {
    const el = await fixture(
      html`<simple-pager total="10" limit="25"></simple-pager>`,
    );
    await el.updateComplete;
    expect(el.hidden).to.be.true;
  });

  it("shows when total exceeds a single page", async () => {
    const el = await fixture(
      html`<simple-pager total="100" limit="25"></simple-pager>`,
    );
    await el.updateComplete;
    expect(el.hidden).to.be.false;
  });

  it("force-visible overrides the single-page hide rule", async () => {
    const el = await fixture(
      html`<simple-pager total="10" limit="25" force-visible></simple-pager>`,
    );
    await el.updateComplete;
    expect(el.hidden).to.be.false;
  });

  it("mini mode renders a nav with prev/next only", async () => {
    const el = await fixture(
      html`<simple-pager mode="mini" total="100" limit="25"></simple-pager>`,
    );
    await el.updateComplete;
    const nav = el.shadowRoot.querySelector("nav");
    expect(nav).to.exist;
    expect(nav.getAttribute("aria-label")).to.equal("Pagination");
    expect(iconButtons(el).length).to.equal(2);
    expect(el.shadowRoot.querySelector(".page-btn")).to.be.null;
  });

  it("full mode renders first/last plus numbered page buttons", async () => {
    const el = await fixture(
      html`<simple-pager mode="full" total="100" limit="25"></simple-pager>`,
    );
    await el.updateComplete;
    expect(iconButtons(el).length).to.equal(4);
    // 100 / 25 = 4 pages, all within the default max-page-buttons window
    expect(el.shadowRoot.querySelectorAll(".page-btn").length).to.equal(4);
  });

  it("marks the current page button with aria-current and disables it", async () => {
    const el = await fixture(
      html`<simple-pager
        mode="full"
        total="100"
        limit="25"
        offset="25"
      ></simple-pager>`,
    );
    await el.updateComplete;
    const current = el.shadowRoot.querySelector(
      '.page-btn[aria-current="page"]',
    );
    expect(current).to.exist;
    expect(current.getAttribute("data-page")).to.equal("2");
    expect(current.disabled).to.be.true;
  });

  it("truncates long page lists with non-interactive ellipsis", async () => {
    const el = await fixture(
      html`<simple-pager
        mode="full"
        total="1000"
        limit="25"
        max-page-buttons="5"
        offset="500"
      ></simple-pager>`,
    );
    await el.updateComplete;
    const ellipses = el.shadowRoot.querySelectorAll(".ellipsis");
    expect(ellipses.length).to.be.greaterThan(0);
    expect(ellipses[0].getAttribute("aria-hidden")).to.equal("true");
  });

  it("fires page-changed with the next offset on next click", async () => {
    const el = await fixture(
      html`<simple-pager
        mode="mini"
        total="100"
        limit="25"
        offset="0"
      ></simple-pager>`,
    );
    await el.updateComplete;
    const next = iconButtons(el).pop();
    const pending = waitForPageChanged(el);
    next.click();
    const ev = await pending;
    expect(ev.detail.limit).to.equal(25);
    expect(ev.detail.offset).to.equal(25);
  });

  it("fires page-changed with the previous offset on prev click", async () => {
    const el = await fixture(
      html`<simple-pager
        mode="mini"
        total="100"
        limit="25"
        offset="50"
      ></simple-pager>`,
    );
    await el.updateComplete;
    const prev = iconButtons(el)[0];
    const pending = waitForPageChanged(el);
    prev.click();
    const ev = await pending;
    expect(ev.detail.offset).to.equal(25);
  });

  it("fires page-changed with offset 0 on first click", async () => {
    const el = await fixture(
      html`<simple-pager
        mode="full"
        total="100"
        limit="25"
        offset="50"
      ></simple-pager>`,
    );
    await el.updateComplete;
    const first = iconButtons(el)[0];
    const pending = waitForPageChanged(el);
    first.click();
    const ev = await pending;
    expect(ev.detail.offset).to.equal(0);
  });

  it("fires page-changed with the last-page offset on last click", async () => {
    const el = await fixture(
      html`<simple-pager
        mode="full"
        total="100"
        limit="25"
        offset="0"
      ></simple-pager>`,
    );
    await el.updateComplete;
    const buttons = iconButtons(el);
    const last = buttons[buttons.length - 1];
    const pending = waitForPageChanged(el);
    last.click();
    const ev = await pending;
    // 100 / 25 = 4 pages, last page starts at offset 75
    expect(ev.detail.offset).to.equal(75);
  });

  it("fires page-changed when clicking a numbered page button", async () => {
    const el = await fixture(
      html`<simple-pager
        mode="full"
        total="100"
        limit="25"
        offset="0"
      ></simple-pager>`,
    );
    await el.updateComplete;
    const page3 = el.shadowRoot.querySelector('.page-btn[data-page="3"]');
    const pending = waitForPageChanged(el);
    page3.click();
    const ev = await pending;
    expect(ev.detail.offset).to.equal(50);
  });

  it("does not fire page-changed when clicking the current page button", async () => {
    const el = await fixture(
      html`<simple-pager
        mode="full"
        total="100"
        limit="25"
        offset="0"
      ></simple-pager>`,
    );
    await el.updateComplete;
    let fired = false;
    el.addEventListener("page-changed", () => {
      fired = true;
    });
    const current = el.shadowRoot.querySelector(
      '.page-btn[aria-current="page"]',
    );
    current.click();
    await el.updateComplete;
    expect(fired).to.be.false;
  });

  it("does not fire page-changed when clicking next at the last page", async () => {
    const el = await fixture(
      html`<simple-pager
        mode="mini"
        total="100"
        limit="25"
        offset="75"
      ></simple-pager>`,
    );
    await el.updateComplete;
    let fired = false;
    el.addEventListener("page-changed", () => {
      fired = true;
    });
    iconButtons(el).pop().click();
    await el.updateComplete;
    expect(fired).to.be.false;
  });

  it("exposes currentPage / totalPages derived math", async () => {
    const el = await fixture(
      html`<simple-pager total="100" limit="25" offset="50"></simple-pager>`,
    );
    await el.updateComplete;
    expect(el._totalPages).to.equal(4);
    expect(el._currentPage).to.equal(3);
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<simple-pager mode="full" total="100" limit="25"></simple-pager>`,
    );
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible();
  });
});
