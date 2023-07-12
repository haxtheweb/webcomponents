import { fixture, expect, html } from "@open-wc/testing";
import "../inline-audio.js";

describe("elementName test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <p>
      Richard Stallman once sang the
      <inline-audio
        shiny
        dark
        accent-color="purple"
        source="https://inline-audio-mocha.vercel.app/assets/whopper.mp3"
        >Open Source song.</inline-audio
      >
      The King of Burgers made a decree. The decree came in the form of a song.
      Not just any song, but a legendary song that bellowed to the world. This
      song was of
      <inline-audio
        accent-color="purple"
        source="https://inline-audio-mocha.vercel.app/assets/whopper.mp3"
        ><span>whoppers, toppers, boppers, and boopers.</span></inline-audio
      >
      The seven seas were aghast with the tune of
      <inline-audio
        dark
        accent-color="red"
        source="https://inline-audio-mocha.vercel.app/assets/whopper.mp3"
        >?</inline-audio
      >
      over the wind. Did you know that the critically acclaimed MMORPG Final
      Fantasy XIV has a free trial, and includes the entirety of A Realm Reborn
      AND the award-winning Heavensward expansion up to level 60 with no
      restrictions on playtime? Sign up, and enjoy Eorzea today!
    </p>`);
  });

  it("basic will it blend", async () => {
    expect(element).to.exist;
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
