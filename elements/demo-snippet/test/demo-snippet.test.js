import { html, fixture, expect } from '@open-wc/testing';
import "../demo-snippet.js";

describe("DemoSnippet test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <demo-snippet
        title="title"
      ></demo-snippet>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("stamps template content into light DOM once so document scripts work", async () => {
    const el = await fixture(html`
      <demo-snippet>
        <template>
          <button id="load">Load file</button>
          <script>
            document.getElementById("load").addEventListener("click", () => {});
          </script>
        </template>
      </demo-snippet>
    `);
    await el.updateComplete;
    // allow the slotchange and firstUpdated triggers to both settle
    await new Promise((resolve) => setTimeout(resolve, 0));
    // stamped exactly once into light DOM so document scripts can reach it
    expect(el.querySelectorAll("#load").length).to.equal(1);
    expect(document.getElementById("load")).to.exist;
  });
});
