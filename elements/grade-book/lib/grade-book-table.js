import { html, css, LitElement } from "lit";
import "@haxtheweb/editable-table/editable-table.js";

class GradeBookTable extends LitElement {
  static get tag() {
    return "grade-book-table";
  }
  constructor() {
    super();
    this.editMode = false;
    // translatable text defaults so a bare element renders safely
    this.t = {
      letterGrade: "Letter grade",
      highRange: "High range",
      lowRange: "Low range",
    };
    // no store wiring of its own; default to an empty scale until data lands
    this.database = { gradeScale: [] };
  }
  static get properties() {
    return {
      editMode: { type: Boolean, attribute: "edit-mode", reflect: true },
      database: { type: Object },
    };
  }
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
  render() {
    return html`
      <editable-table
        ?edit-mode="${this.editMode}"
        bordered
        column-header
        condensed
        disable-responsive
        scroll
        striped
      >
        <table>
          <tbody>
            <tr>
              <td>${this.t.letterGrade}</td>
              <td>${this.t.highRange}</td>
              <td>${this.t.lowRange}</td>
            </tr>
            ${this.database && this.database.gradeScale
              ? this.database.gradeScale.map(
                  (scale) => html`
                    <tr>
                      <td>${scale.letter}</td>
                      <td>${scale.highRange}</td>
                      <td>${scale.lowRange}</td>
                    </tr>
                  `,
                )
              : ``}
          </tbody>
        </table>
      </editable-table>
    `;
  }
}

globalThis.customElements.define(GradeBookTable.tag, GradeBookTable);
export { GradeBookTable };
