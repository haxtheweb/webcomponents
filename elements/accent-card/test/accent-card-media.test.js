import { fixture, expect, html } from "@open-wc/testing";
import "../accent-card.js";
import { AccentCard } from "../accent-card.js";

describe("accent-card media source hooks (#3050)", () => {
  it("maps the mediaSourceUpdated hook", async () => {
    const el = await fixture(
      html`<accent-card
        image-src="https://placehold.co/400x300"
      ></accent-card>`,
    );
    const hooks = el.haxHooks();
    expect(hooks.mediaSourceUpdated).to.equal("haxmediaSourceUpdated");
    expect(AccentCard.tag).to.equal("accent-card");
  });

  it("ignores missing paths, stores and helper functions", async () => {
    const el = await fixture(
      html`<accent-card
        image-src="https://placehold.co/400x300"
      ></accent-card>`,
    );
    // no path / no store
    el.haxmediaSourceUpdated(null, null);
    // store without the match helper
    el.haxmediaSourceUpdated("files/a.png", {});
    // no store at all
    el.haxmediaSourceUpdated("files/a.png", null);
    expect(true).to.equal(true);
  });

  it("pokes matching images through the store when the path matches", async () => {
    const el = await fixture(
      html`<accent-card image-src="files/a.png"></accent-card>`,
    );
    const pokes = [];
    const store = {
      _mediaSrcMatches(src, path) {
        return src === "files/a.png" && path === "files/a.png";
      },
      _pokeMatchingImgs(root, path) {
        pokes.push([root, path]);
      },
    };
    el.haxmediaSourceUpdated("files/a.png", store);
    expect(pokes.length).to.equal(1);
    // compare as booleans/strings: never feed a shadow root into a chai equal
    expect(pokes[0][0] === el.shadowRoot).to.equal(true);
    expect(pokes[0][1]).to.equal("files/a.png");
    // a non-matching path leaves the card untouched
    const otherStore = {
      _mediaSrcMatches() {
        return false;
      },
      _pokeMatchingImgs(root, path) {
        pokes.push([root, path]);
      },
    };
    el.haxmediaSourceUpdated("files/b.png", otherStore);
    expect(pokes.length).to.equal(1);
  });
});
