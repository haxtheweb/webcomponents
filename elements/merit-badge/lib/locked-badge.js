import { LitElement, html, css } from "lit";

class LockedBadge extends LitElement {
  static get tag() {
    return "locked-badge";
  }
  static get styles() {
    return [
      css`
.badge
  {
    width: 200px;
    height: 200px;
    background: grey;
    border-radius: 50%
    padding: 20px;
    margin: 20px;
    background: grey;
    color: black;
    font-size: 21px;
    font-weight: bold;
    line-height: 1.3em;
    border: 2px dashed black;
    border-radius: 50%;
    box-shadow: 0 0 0 4px grey, 3px 2px 7px 5px rgba(10, 10, 0, 0.5);
    text-shadow: -1px -1px grey;
    font-weight: normal;
    position: relative;    
  }

  .badgepic
  {
    max-width: 70px;
    max-height: 70px;
    align-content: center;
    padding-left: 65px;
    padding-top: 58px;
  }
`,
    ];
  }

  render() {
    return html`
      <div class="badge">
        <img
          class="badgepic"
          src="https://cdn-icons-png.flaticon.com/512/61/61457.png"
          alt="image"
        />
      </div>
    `;
  }
}

customElements.define(LockedBadge.tag, LockedBadge);
export { LockedBadge };
