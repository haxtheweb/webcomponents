import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lrndesign-imagemap.js";
import "../lib/lrndesign-imagemap-hotspot.js";
import {
  sanitizedSvgFromMarkup,
  sanitizeSvgTree,
} from "../lib/lrndesign-imagemap-sanitize.js";

// security: the fetched svg used to go straight into innerHTML, so a hostile
// svg could run script in the site's origin
const hostileSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" onload="globalThis.__imagemapPwned=1">' +
  "<title>Map</title>" +
  "<script>globalThis.__imagemapPwned=2</script>" +
  '<foreignObject><img src="x" onerror="globalThis.__imagemapPwned=3"></foreignObject>' +
  '<a href="javascript:globalThis.__imagemapPwned=4"><circle id="spot-a" cx="20" cy="20" r="10" onclick="globalThis.__imagemapPwned=5"/></a>' +
  '<a xlink:href="data:text/html,hi"><rect id="spot-c" width="5" height="5"/></a>' +
  '<set attributeName="href" to="javascript:alert(1)"/>' +
  '<image href="data:image/png;base64,iVBORw0KGgo=" width="1" height="1"/>' +
  '<circle id="spot-b" cx="60" cy="60" r="10"/>' +
  "</svg>";

describe("lrndesign-imagemap svg sanitizing", () => {
  afterEach(() => {
    delete globalThis.__imagemapPwned;
  });

  it("strips script-capable parts and keeps the drawing", () => {
    const svg = sanitizedSvgFromMarkup(hostileSvg);
    expect(svg).to.exist;
    expect(svg.ownerDocument).to.equal(globalThis.document);
    expect(svg.hasAttribute("onload")).to.equal(false);
    expect(svg.querySelector("script")).to.equal(null);
    expect(svg.querySelector("foreignObject")).to.equal(null);
    expect(svg.querySelector("set")).to.equal(null);
    expect(svg.querySelector("#spot-a").hasAttribute("onclick")).to.equal(
      false,
    );
    const links = svg.querySelectorAll("a");
    expect(links[0].hasAttribute("href")).to.equal(false);
    expect(links[1].hasAttribute("xlink:href")).to.equal(false);
    // embedded raster images keep their data: href
    expect(svg.querySelector("image").getAttribute("href")).to.contain(
      "data:image/png",
    );
    expect(svg.querySelector("#spot-b")).to.exist;
    expect(svg.querySelector("title").textContent).to.equal("Map");
  });

  it("returns null when there is no svg", () => {
    expect(sanitizedSvgFromMarkup("<p>nope</p>")).to.equal(null);
    expect(sanitizedSvgFromMarkup("")).to.equal(null);
    expect(sanitizedSvgFromMarkup(null)).to.equal(null);
  });

  it("keeps svg files without an xmlns working", () => {
    const svg = sanitizedSvgFromMarkup(
      '<svg viewBox="0 0 10 10"><circle id="c" r="2"/></svg>',
    );
    expect(svg.namespaceURI).to.equal("http://www.w3.org/2000/svg");
    expect(svg.querySelector("#c")).to.exist;
  });

  it("sanitizeSvgTree removes namespaced script elements", () => {
    const doc = new DOMParser().parseFromString(
      '<svg xmlns="http://www.w3.org/2000/svg"><html:script xmlns:html="http://www.w3.org/1999/xhtml">1</html:script><g/></svg>',
      "image/svg+xml",
    );
    const root = sanitizeSvgTree(doc.documentElement);
    expect(root.getElementsByTagNameNS("*", "script").length).to.equal(0);
    expect(root.querySelector("g")).to.exist;
  });

  it("renders a hostile svg with hotspots and runs none of its script", async () => {
    const src = "data:image/svg+xml," + encodeURIComponent(hostileSvg);
    const el = await fixture(html`
      <lrndesign-imagemap label="Map" src="${src}">
        <lrndesign-imagemap-hotspot hotspot-id="spot-a" label="A">
          A details
        </lrndesign-imagemap-hotspot>
        <lrndesign-imagemap-hotspot hotspot-id="spot-b" label="B">
          B details
        </lrndesign-imagemap-hotspot>
      </lrndesign-imagemap>
    `);
    await aTimeout(300);
    const svg = el.querySelector(':scope > svg[slot="svg"]');
    expect(svg).to.exist;
    expect(svg.querySelector("#spot-a").classList.contains("hotspot")).to.equal(
      true,
    );
    const hotspotSvg = el
      .querySelector("lrndesign-imagemap-hotspot")
      .querySelector('svg[slot="svg"]');
    expect(hotspotSvg).to.exist;
    expect(hotspotSvg.querySelector("script")).to.equal(null);
    svg.querySelector("#spot-a").dispatchEvent(new MouseEvent("click"));
    await aTimeout(50);
    expect(globalThis.__imagemapPwned).to.equal(undefined);
  });
});
