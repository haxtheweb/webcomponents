import { fixture, expect, html } from "@open-wc/testing";
import "../lib/editable-table-display.js";
import "../lib/editable-table-filter.js";
import "../lib/editable-table-sort.js";

const DATA = [
  ["Item", "Supplier", "Qty"],
  ["Pipette tips", "Fisher", "40"],
  ["Nitrile gloves", "VWR", "25"],
  ["Safety goggles (box)", "VWR", "30"],
  ["Total", "", "95"],
];

const display = () =>
  fixture(
    html`<editable-table-display
      .data=${DATA}
      column-header
      row-header
      footer
      filter
      sort
    ></editable-table-display>`,
  );

describe("editable-table display readability", () => {
  it("inherits DDD tokens so design system bridges reach the table", async () => {
    const wrap = await fixture(
      html`<div
        style="color-scheme: light; --ddd-theme-default-nittanyNavy: rgb(1, 2, 3)"
      >
        <editable-table-display
          .data=${DATA}
          column-header
        ></editable-table-display>
      </div>`,
    );
    const el = wrap.querySelector("editable-table-display");
    await el.updateComplete;
    const th = el.shadowRoot.querySelector("thead th");
    expect(getComputedStyle(th).color).to.equal("rgb(1, 2, 3)");
  });

  it("lines the outer cells up with the block header", async () => {
    const wrap = await fixture(
      html`<div style="--ddd-surface-padding: 24px">
        <editable-table-display
          .data=${DATA}
          column-header
        ></editable-table-display>
      </div>`,
    );
    const el = wrap.querySelector("editable-table-display");
    await el.updateComplete;
    const first = el.shadowRoot.querySelector("tbody tr td:first-child");
    expect(getComputedStyle(first).paddingLeft).to.equal("24px");
    const body = el.shadowRoot.querySelector(".ddd-block-body");
    expect(getComputedStyle(body).paddingTop).to.equal("0px");
  });

  it("keeps a margin around a bordered grid", async () => {
    const el = await fixture(
      html`<editable-table-display
        .data=${DATA}
        bordered
      ></editable-table-display>`,
    );
    await el.updateComplete;
    const body = el.shadowRoot.querySelector(".ddd-block-body");
    expect(body.classList.contains("bordered")).to.be.true;
    expect(getComputedStyle(body).paddingTop).to.not.equal("0px");
  });

  it("puts no filter buttons in the footer", async () => {
    const el = await fixture(
      html`<editable-table-display
        .data=${DATA}
        column-header
        footer
        filter
      ></editable-table-display>`,
    );
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelectorAll("tfoot editable-table-filter").length,
    ).to.equal(0);
    expect(
      el.shadowRoot.querySelectorAll("tbody editable-table-filter").length,
    ).to.be.above(0);
  });

  it("says how many rows a filter leaves and clears it", async () => {
    const el = await fixture(
      html`<editable-table-display
        .data=${DATA}
        column-header
        footer
        filter
      ></editable-table-display>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".filter-status")).to.equal(null);
    el.toggleFilter({ detail: { columnIndex: 1, text: "VWR" } });
    await el.updateComplete;
    const status = el.shadowRoot.querySelector(".filter-status");
    expect(status).to.not.equal(null);
    expect(status.getAttribute("role")).to.equal("status");
    expect(status.textContent).to.contain("Showing 2 of 3 rows");
    expect(status.textContent).to.contain("Supplier");
    expect(
      el.shadowRoot.querySelectorAll("tbody td[filtered]").length,
    ).to.equal(2);
    status.querySelector("button").click();
    await el.updateComplete;
    expect(el.filtered).to.be.false;
    expect(el.shadowRoot.querySelector(".filter-status")).to.equal(null);
  });

  it("filters by the first column too", async () => {
    const el = await fixture(
      html`<editable-table-display
        .data=${DATA}
        column-header
        filter
      ></editable-table-display>`,
    );
    await el.updateComplete;
    el.toggleFilter({ detail: { columnIndex: 0, text: "Pipette tips" } });
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll("tbody tr").length).to.equal(1);
    expect(el._isCellFiltered(0, el.filterColumn, el.filtered)).to.be.true;
  });

  it("matches filter text literally, not as a pattern", async () => {
    const el = await fixture(
      html`<editable-table-display
        .data=${DATA}
        column-header
        filter
      ></editable-table-display>`,
    );
    await el.updateComplete;
    el.filterColumn = 0;
    el.filterText = "(box)";
    el.filterContains = true;
    expect(el._isRowFiltered(["Safety goggles (box)", "VWR", "30"])).to.be
      .false;
    expect(el._isRowFiltered(["Pipette tips", "Fisher", "40"])).to.be.true;
    el.filterText = "(";
    expect(() =>
      el._isRowFiltered(["Pipette tips", "Fisher", "40"]),
    ).to.not.throw();
  });

  it("marks numeric columns so their icons sit before the figures", async () => {
    const el = await display();
    await el.updateComplete;
    const sorts = el.shadowRoot.querySelectorAll("editable-table-sort");
    expect(sorts[2].hasAttribute("numeric")).to.be.true;
    expect(sorts[1].hasAttribute("numeric")).to.be.false;
    await sorts[2].updateComplete;
    const row = sorts[2].shadowRoot.querySelector("div");
    expect(getComputedStyle(row).flexDirection).to.equal("row-reverse");
  });
});
