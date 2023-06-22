import { fixture, expect, html } from "@open-wc/testing";
import "../audio-player.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <audio-player source="https://inline-audio-mocha.vercel.app/assets/whopper.mp3"></audio-player>
    `);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });
});
