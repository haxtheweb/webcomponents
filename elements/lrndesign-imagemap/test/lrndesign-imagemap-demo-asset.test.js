import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lrndesign-imagemap.js";
import "../lib/lrndesign-imagemap-hotspot.js";

describe("lrndesign-imagemap demo asset", () => {
  it("lib/design-process.svg has the hotspots the demoSchema names", async () => {
    const src = new URL("../lib/design-process.svg", import.meta.url).href;
    const schema = await (
      await fetch(
        new URL("../lib/lrndesign-imagemap.haxProperties.json", import.meta.url)
          .href,
      )
    ).json();
    const demo = schema.demoSchema[0];
    expect(demo.properties.src.endsWith("/lib/design-process.svg")).to.equal(
      true,
    );
    const ids = Array.from(
      demo.content.matchAll(/hotspot-id="([^"]+)"/g),
      (m) => m[1],
    );
    expect(ids.length).to.equal(5);
    const el = await fixture(
      html`<lrndesign-imagemap src="${src}" label="Course design process">
        ${ids.map(
          (id) =>
            html`<lrndesign-imagemap-hotspot hotspot-id="${id}" label="${id}"
              >About ${id}</lrndesign-imagemap-hotspot
            >`,
        )}
      </lrndesign-imagemap>`,
    );
    let found = 0;
    for (let i = 0; i < 40 && found < ids.length; i++) {
      await aTimeout(50);
      found = ids.filter((id) =>
        el.querySelector(`svg[slot="svg"] #${id}.hotspot`),
      ).length;
    }
    expect(found).to.equal(ids.length);
  });
});
