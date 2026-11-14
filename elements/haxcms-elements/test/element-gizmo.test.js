import { expect } from "@open-wc/testing";
import {
  elementGizmo,
  loadElementGizmo,
  ELEMENT_GIZMO_READY,
} from "../lib/core/utils/ElementGizmo.js";

const schemaUrl = (gizmo) =>
  URL.createObjectURL(
    new Blob([JSON.stringify({ gizmo })], { type: "application/json" }),
  );

describe("ElementGizmo", () => {
  it("reads a gizmo from a schema object", async () => {
    customElements.define(
      "gizmo-inline-fixture",
      class extends HTMLElement {
        static get haxProperties() {
          return { gizmo: { title: "Inline block", icon: "icons:star" } };
        }
      },
    );
    expect(elementGizmo("gizmo-inline-fixture").title).to.equal("Inline block");
    const gizmo = await loadElementGizmo("gizmo-inline-fixture");
    expect(gizmo.icon).to.equal("icons:star");
  });

  it("reads a gizmo from a schema file and announces it", async () => {
    const url = schemaUrl({ title: "File block", icon: "hax:books" });
    customElements.define(
      "gizmo-file-fixture",
      class extends HTMLElement {
        static get haxProperties() {
          return url;
        }
      },
    );
    let announced = "";
    const heard = (e) => {
      announced = e.detail.tag;
    };
    globalThis.addEventListener(ELEMENT_GIZMO_READY, heard);
    // not known yet: the file is still being read
    expect(elementGizmo("gizmo-file-fixture")).to.equal(undefined);
    const gizmo = await loadElementGizmo("gizmo-file-fixture");
    globalThis.removeEventListener(ELEMENT_GIZMO_READY, heard);
    expect(gizmo.title).to.equal("File block");
    expect(announced).to.equal("gizmo-file-fixture");
    // known from here on without another read
    expect(elementGizmo("gizmo-file-fixture").icon).to.equal("hax:books");
  });

  it("answers null for an element without a schema", async () => {
    expect(elementGizmo("gizmo-not-defined")).to.equal(null);
    expect(await loadElementGizmo("gizmo-not-defined")).to.equal(null);
  });
});
