import { fixture, expect, html } from "@open-wc/testing";
import "../lib/grade-book-table.js";
import { GradeBookTable } from "../lib/grade-book-table.js";
import { flush } from "./fixtures.js";

describe("grade-book-table", () => {
  it("has the expected tag and a false editMode default", () => {
    expect(GradeBookTable.tag).to.equal("grade-book-table");
    const el = globalThis.document.createElement("grade-book-table");
    expect(el.editMode).to.equal(false);
  });

  it("reflects edit-mode as an attribute", async () => {
    // inject explicit render deps (instead of relying on the constructor
    // defaults) and connect it manually for the reflection lifecycle
    const el = globalThis.document.createElement("grade-book-table");
    el.t = { letterGrade: "L", highRange: "H", lowRange: "Lo" };
    el.database = { gradeScale: [] };
    globalThis.document.body.appendChild(el);
    el.editMode = true;
    await flush(40);
    expect(el.hasAttribute("edit-mode")).to.equal(true);
    el.editMode = false;
    await flush(40);
    expect(el.hasAttribute("edit-mode")).to.equal(false);
    el.remove();
  });

  it("renders the grade scale table when t and database are provided", async () => {
    // GradeBookTable has no i18n mixin and no store wiring of its own (the
    // constructor defaults only keep a bare render safe), so provide richer
    // t and database values from the test side
    const el = globalThis.document.createElement("grade-book-table");
    el.t = {
      letterGrade: "Letter grade",
      highRange: "High range",
      lowRange: "Low range",
    };
    el.database = {
      gradeScale: [
        { letter: "A", highRange: 100, lowRange: 93 },
        { letter: "B", highRange: 92, lowRange: 85 },
      ],
    };
    globalThis.document.body.appendChild(el);
    await flush(60);
    expect(el.shadowRoot.querySelector("editable-table")).to.exist;
    const rows = el.shadowRoot.querySelectorAll("table tbody tr");
    expect(rows.length).to.equal(3);
    expect(el.shadowRoot.innerHTML.includes("Letter grade")).to.equal(true);
    expect(el.shadowRoot.innerHTML.includes("High range")).to.equal(true);
    expect(el.shadowRoot.innerHTML.includes("Low range")).to.equal(true);
    expect(el.shadowRoot.innerHTML.includes("100")).to.equal(true);
    el.remove();
  });

  it("render() is safe without injected t and database (was BUG: undefined render deps)", async () => {
    // regression: grade-book-table.js:40-44 render() used to read
    // this.t.letterGrade and this.database.gradeScale but the element
    // defined neither a t object (no I18NMixin) nor a database (no
    // GradeBookStore wiring), so a plain <grade-book-table> in the DOM
    // always threw on first render; constructor defaults plus a render
    // guard keep a bare render safe now
    const el = globalThis.document.createElement("grade-book-table");
    let threw = false;
    try {
      el.render();
    } catch (e) {
      threw = true;
    }
    expect(threw).to.equal(false);
    // a bare fixture renders the empty header row without crashing
    const el2 = await fixture(html`<grade-book-table></grade-book-table>`);
    await flush(60);
    expect(el2.shadowRoot.querySelector("editable-table")).to.exist;
    expect(el2.shadowRoot.querySelectorAll("table tbody tr").length).to.equal(
      1,
    );
    expect(el2.shadowRoot.innerHTML.includes("Letter grade")).to.equal(true);
  });
});
