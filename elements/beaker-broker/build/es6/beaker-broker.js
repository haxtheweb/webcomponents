import {
  html,
  PolymerElement
} from "./node_modules/@polymer/polymer/polymer-element.js";
export { BeakerBroker };
class BeakerBroker extends PolymerElement {
  static get template() {
    return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`;
  }
  static get haxProperties() {
    return {};
  }
  static get properties() {
    return {
      archive: { type: Object, notify: !0 },
      datUrl: {
        type: String,
        value: "window.location.host",
        observer: "_datUrlChanged",
        notify: !0
      }
    };
  }
  static get tag() {
    return "beaker-broker";
  }
  connectedCallback() {
    super.connectedCallback();
    if (typeof DatArchive === typeof void 0) {
      console.log("Beaker is not available from this site loading methodology");
    }
  }
  async _datUrlChanged(newValue) {
    if (typeof DatArchive !== typeof void 0 && newValue) {
      this.set("archive", new DatArchive(newValue));
    }
  }
  async write(path, data) {
    await this.archive.writeFile(path, data);
  }
  async read(path, type) {
    var ftype = "utf8",
      response;
    switch (type) {
      case "jpeg":
      case "jpg":
        ftype = "binary";
        var buf = await this.archive.readFile(path, ftype),
          blob = new Blob([buf], { type: "image/jpeg" });
        response = URL.createObjectURL(blob);
        break;
      case "png":
        ftype = "binary";
        var buf = await this.archive.readFile(path, ftype),
          blob = new Blob([buf], { type: "image/png" });
        response = URL.createObjectURL(blob);
        break;
      case "base64":
        var str = await this.archive.readFile(path, type);
        response = "data:image/png;base64," + str;
        break;
      default:
        var str = await this.archive.readFile(path, type);
        response = str;
        break;
    }
    return await response;
  }
}
window.customElements.define(BeakerBroker.tag, BeakerBroker);
