import { html, fixture, expect, waitUntil } from "@open-wc/testing";
import "../lib/hax-use-case-picker.js";

const tick = (ms) => new Promise((r) => setTimeout(r, ms || 60));

// a skeleton list in the shape app-hax reads, served next to this test
const source = new URL("./skeletons.fixture.json", import.meta.url).href;

describe("hax-use-case-picker", function () {
  this.timeout(10000);
  let element;

  const show = async (attrs = {}) => {
    element = await fixture(
      html`<hax-use-case-picker
        source="${source}"
        exclude="studio-user-template"
        browser-url="${attrs.browserUrl || "https://browser.hax.cloud/"}"
      ></hax-use-case-picker>`,
    );
    await waitUntil(() => element._skeletons.length > 0, "skeletons load");
    await element.updateComplete;
    return element.shadowRoot;
  };

  it("does not load a list from an address that is not http(s)", async () => {
    element = await fixture(
      html`<hax-use-case-picker
        source="javascript:alert(1)"
      ></hax-use-case-picker>`,
    );
    await tick(100);
    expect(element._skeletons).to.deep.equal([]);
  });

  it("lists the skeletons by priority, leaving out the excluded ones", async () => {
    const root = await show();
    const titles = [...root.querySelectorAll(".choice span")].map((s) =>
      s.textContent.trim(),
    );
    expect(titles).to.deep.equal(["Online Course", "Blog", "Something new"]);
    expect(root.querySelector(".choice strong").textContent.trim()).to.equal(
      "teaches a course",
    );
  });

  it("picks the first skeleton and marks it pressed with a check", async () => {
    const root = await show();
    const pressed = root.querySelector('.choice[aria-pressed="true"]');
    expect(pressed.textContent).to.contain("Online Course");
    expect(pressed.querySelector("simple-icon-lite")).to.exist;
  });

  it("builds the browser link and the CLI command for the pick", async () => {
    const root = await show();
    root.querySelectorAll(".choice")[1].click();
    await element.updateComplete;
    expect(element.selected).to.equal("blog");
    expect(element._deepLink()).to.equal(
      "https://browser.hax.cloud/?skeleton=blog&name=My+Blog",
    );
    expect(element._command()).to.equal(
      "hax site my-blog --skeleton-machine-name blog --y",
    );
    expect(root.querySelector("simple-cta").getAttribute("link")).to.equal(
      element._deepLink(),
    );
  });

  it("uses the typed site name", async () => {
    const root = await show();
    const input = root.querySelector("#name");
    input.value = "Fall Studio";
    input.dispatchEvent(new Event("input"));
    await element.updateComplete;
    expect(element._command()).to.equal(
      "hax site fall-studio --skeleton-machine-name online-course --y",
    );
  });

  it("shows no link when the browser address is not http(s)", async () => {
    const root = await show({ browserUrl: "javascript:alert(1)" });
    expect(element._deepLink()).to.equal("");
    expect(root.querySelector("simple-cta")).to.not.exist;
  });

  it("passes the a11y audit", async () => {
    await show();
    await expect(element).shadowDom.to.be.accessible();
  });
});
