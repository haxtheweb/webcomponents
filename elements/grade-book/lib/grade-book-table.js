import { html, css, LitElement } from "lit";
import "@lrnwebcomponents/editable-table/editable-table.js";

class GradeBookTable extends LitElement {
  static get tag() {
    return "grade-book-table";
  }
  constructor() {
    super();
    this.editMode = false;
  }
  static get properties() {
    return {
      editMode: { type: Boolean, attribute: "edit-mode", reflect: true },
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
            ${this.database.gradeScale.map(
              (scale) => html`
                <tr>
                  <td>${scale.letter}</td>
                  <td>${scale.highRange}</td>
                  <td>${scale.lowRange}</td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </editable-table>
    `;
  }
}

customElements.define(GradeBookTable.tag, GradeBookTable);
export { GradeBookTable };
