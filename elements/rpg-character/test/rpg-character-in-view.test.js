import { fixture, expect, html } from "@open-wc/testing";
import "../rpg-character.js";

const frames = async (n) => {
  for (let i = 0; i < n; i++) {
    await new Promise((r) => requestAnimationFrame(r));
  }
};

// the art (7-15 SVG files) is only drawn once the character is near the
// screen; until then the wrapper holds the exact size
describe("rpg-character draws its art when in view", () => {
  it("keeps an off-screen character as a same-size placeholder", async () => {
    const box = await fixture(html`
      <div>
        <div style="height: 4000px"></div>
        <rpg-character seed="btopro" width="113" height="142"></rpg-character>
      </div>
    `);
    const el = box.querySelector("rpg-character");
    await el.updateComplete;
    await frames(5);
    expect(el.__inView).to.equal(false);
    expect(el.shadowRoot.querySelectorAll("image").length).to.equal(0);
    const wrapper = el.shadowRoot.querySelector(".wrapper");
    expect(wrapper.style.width).to.equal("113px");
    expect(wrapper.style.height).to.equal("142px");
    el.scrollIntoView();
    for (let i = 0; i < 100 && !el.__inView; i++) {
      await frames(1);
    }
    await el.updateComplete;
    expect(el.__inView).to.equal(true);
    expect(el.shadowRoot.querySelectorAll("image").length).to.be.greaterThan(3);
  });

  it("draws right away when it is already on screen", async () => {
    const el = await fixture(html`<rpg-character seed="a"></rpg-character>`);
    for (let i = 0; i < 20 && !el.__inView; i++) {
      await frames(1);
    }
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll("image").length).to.be.greaterThan(3);
  });
});
