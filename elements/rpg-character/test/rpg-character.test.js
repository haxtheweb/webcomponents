import { fixture, expect, html } from "@open-wc/testing";
import { RpgCharacter, hatList, charBuilder } from "../rpg-character.js";

/**
 * Helpers
 */
const pieceCount = (el) =>
  el.shadowRoot.querySelectorAll(".wrapper > svg").length;

const lastImageHref = (el) => {
  const images = el.shadowRoot.querySelectorAll(".wrapper > svg > image");
  return images.length ? images[images.length - 1].getAttribute("href") : null;
};

const num = (v) =>
  typeof v === "number" ? v : Number.parseFloat(v);

/**
 * Allow Lit3 to flush a re-render scheduled by the previous updateComplete
 * (e.g. the seed handler mutates traits mid-update, which queues another tick).
 */
const settled = async (el) => {
  await el.updateComplete;
  await el.updateComplete;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("rpg-character", () => {
  it("basic will it blend", async () => {
    const el = await fixture(html`<rpg-character></rpg-character>`);
    expect(el).to.exist;
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(html`<rpg-character></rpg-character>`);
    await expect(el).shadowDom.to.be.accessible();
  });

  describe("registration and tag", () => {
    it("static tag is rpg-character", () => {
      expect(RpgCharacter.tag).to.equal("rpg-character");
    });

    it("is registered as a custom element", () => {
      expect(customElements.get("rpg-character")).to.equal(RpgCharacter);
    });

    it("haxProperties points at rpg-character.haxProperties.json", () => {
      expect(RpgCharacter.haxProperties).to.include(
        "rpg-character.haxProperties.json",
      );
    });

    it("exports hatList with the 10 non-status hats", () => {
      expect(hatList).to.be.an("array");
      expect(hatList.length).to.equal(10);
      expect(hatList).to.include("bunny");
      expect(hatList).to.include("cowboy");
      expect(hatList).to.include("party");
      expect(hatList).to.not.include("none");
    });

    it("exports charBuilder entry for every trait", () => {
      expect(Object.keys(charBuilder)).to.deep.equal([
        "accessories",
        "base",
        "leg",
        "face",
        "faceItem",
        "hair",
        "pants",
        "shirt",
        "skin",
        "hatColor",
      ]);
      expect(charBuilder.leg).to.deep.equal(["", "R", "L"]);
    });
  });

  describe("constructor and defaults", () => {
    let el;
    beforeEach(async () => {
      el = await fixture(html`<rpg-character></rpg-character>`);
      await settled(el);
    });

    it("preserves non-seeded defaults after firstUpdated", () => {
      // Numeric / string traits that the seed handler rewrites are intentionally
      // not asserted here — see the seed-assignment blocks for those values.
      expect(el.literalseed).to.equal(false);
      expect(el.height).to.equal(142);
      expect(el.width).to.equal(113);
      expect(el.accentColor).to.equal("orange");
      expect(el.speed).to.equal(500);
      expect(el.walking).to.equal(false);
      expect(el.circle).to.equal(false);
      expect(el.hat).to.equal("none");
      expect(el.demo).to.equal(false);
      expect(el.fire).to.equal(false);
      expect(typeof el.reduceMotion).to.equal("boolean");
    });

    it("firstUpdated assigns a non-null seed string", () => {
      expect(el.seed).to.be.a("string");
      expect(el.seed.length).to.be.greaterThan(0);
    });

    it("reflects boolean attributes when true and removes when false", async () => {
      el.walking = true;
      el.circle = true;
      el.fire = true;
      el.seed = "btopro";
      await settled(el);
      expect(el.getAttribute("walking")).to.equal("");
      expect(el.getAttribute("circle")).to.equal("");
      expect(el.getAttribute("fire")).to.equal("");
      expect(el.getAttribute("seed")).to.equal("btopro");

      el.walking = false;
      el.circle = false;
      el.fire = false;
      await settled(el);
      expect(el.hasAttribute("walking")).to.equal(false);
      expect(el.hasAttribute("circle")).to.equal(false);
      expect(el.hasAttribute("fire")).to.equal(false);
    });

    it("renders the inline responsive size style", () => {
      const styles = Array.from(el.shadowRoot.querySelectorAll("style")).map(
        (s) => s.textContent || "",
      );
      const joined = styles.join("\n");
      expect(joined).to.include("width: 113px");
      expect(joined).to.include("height: 142px");
    });

    it("renders at least eight default pieces (skin, face, faceItem, shirt, pants, accessories, base, hatColor)", () => {
      // Defaults: base=0 (no hair), leg="" (no leg), fire=false, hat="none",
      // circle=false. The random firstUpdated seed can promote base=1 (hair)
      // and randomly choose a non-empty leg, so we only assert a lower bound.
      expect(pieceCount(el)).to.be.at.least(8);
    });

    it("accepts explicit width and height as numeric properties", async () => {
      el.width = 200;
      el.height = 300;
      await settled(el);
      expect(el.width).to.equal(200);
      expect(el.height).to.equal(300);
      const styles = Array.from(el.shadowRoot.querySelectorAll("style")).map(
        (s) => s.textContent || "",
      );
      expect(styles.join("\n")).to.include("width: 200px");
      expect(styles.join("\n")).to.include("height: 300px");
    });

    it("renderPiece emits an svg>image with focusable=false and viewBox matching width/height", async () => {
      el.width = 99;
      el.height = 88;
      await settled(el);
      const svg = el.shadowRoot.querySelector(".wrapper > svg");
      expect(svg).to.exist;
      expect(svg.getAttribute("viewBox")).to.equal(`0 0 99 88`);
      const img = svg.querySelector("image");
      expect(img).to.exist;
      expect(img.getAttribute("focusable")).to.equal("false");
    });
  });

  describe("seed trait assignment via funKeys", () => {
    let el;
    beforeEach(async () => {
      el = await fixture(html`<rpg-character></rpg-character>`);
      await settled(el);
    });

    it("'btopro' produces deterministic accessories/hair/skin per the funKeys map", async () => {
      el.seed = "btopro";
      await settled(el);
      // funKeys.btopro = "7122155501"
      // digits:   7   1   2   2   1   5   5   5   5   0   1
      // trait:  acc  base leg face fi  hair pant shirt skin hatColor
      expect(num(el.accessories)).to.equal(7);
      expect(el.base).to.equal(0);
      expect(num(el.face)).to.equal(2);
      expect(num(el.faceItem)).to.equal(1);
      expect(num(el.hair)).to.equal(5);
      expect(num(el.pants)).to.equal(5);
      expect(num(el.shirt)).to.equal(5);
      expect(num(el.skin)).to.equal(0);
      expect(num(el.hatColor)).to.equal(1);
    });

    it("'edtechjoker' rolls back to hatColor=0 because the key is one shorter", async () => {
      el.seed = "edtechjoker";
      await settled(el);
      // funKeys.edtechjoker = "712215550" (9 digits -> hatColor position falls off)
      expect(num(el.accessories)).to.equal(7);
      expect(num(el.face)).to.equal(2);
      expect(num(el.faceItem)).to.equal(1);
      expect(num(el.hair)).to.equal(5);
      expect(num(el.pants)).to.equal(5);
      expect(num(el.shirt)).to.equal(5);
      expect(num(el.skin)).to.equal(0);
      expect(el.hatColor).to.equal(0);
    });

    it("'zpg' triggers base=1 (hair visible) because the second digit is >= 5", async () => {
      el.seed = "zpg";
      await settled(el);
      // funKeys.zpg = "7501517984378880262144"
      // digit index:  0  1  2  3  4  5  6  7  8  9
      //              [7, 5, 0, 1, 5, 1, 7, 9, 8, 4]
      // trait order: acc base leg face fi  hair pant shirt skin hatColor
      expect(num(el.accessories)).to.equal(7);
      expect(el.base).to.equal(1);
      expect(num(el.face)).to.equal(1);
      expect(num(el.faceItem)).to.equal(5);
      expect(num(el.hair)).to.equal(1);
      expect(num(el.pants)).to.equal(7);
      expect(num(el.shirt)).to.equal(9);
      expect(num(el.skin)).to.equal(8);
      expect(num(el.hatColor)).to.equal(4);
      // hair is only rendered when base === 1
      expect(pieceCount(el)).to.be.at.least(9);
    });

    it("a non-mapped string seed applies via charCode math, not via funKeys", async () => {
      el.seed = "tester";
      await settled(el);
      // 'tester' is not in funKeys so the BigInt(charCodeAt(...)) path runs.
      // We don't pin the exact numeric mapping but we verify the handler
      // produced a numeric value (0-9) from the seed string.
      const acc = num(el.accessories);
      expect(acc).to.be.a("number");
      expect(acc).to.be.at.least(0);
      expect(acc).to.be.at.most(9);
    });
  });

  describe("literalseed", () => {
    it("treats the seed as a literal numeric digit stream", async () => {
      const el = await fixture(
        html`<rpg-character literalseed seed="987654321"></rpg-character>`,
      );
      await settled(el);
      // BigInt("987654321").toString() === "987654321"
      // digits:    9  8  7  6  5  4  3  2  1
      // trait:   acc base face fi  hair pant shirt skin hatColor
      expect(num(el.accessories)).to.equal(9);
      expect(el.base).to.equal(1);
      expect(el.face).to.equal(1);
      expect(num(el.faceItem)).to.equal(5);
      expect(num(el.hair)).to.equal(4);
      expect(num(el.pants)).to.equal(3);
      expect(num(el.shirt)).to.equal(2);
      expect(num(el.skin)).to.equal(1);
      expect(el.hatColor).to.equal(0);
    });

    it("with literalseed false the same numeric seed follows charCode hashing instead", async () => {
      const a = await fixture(
        html`<rpg-character literalseed seed="987654321"></rpg-character>`,
      );
      await settled(a);
      const b = await fixture(
        html`<rpg-character seed="987654321"></rpg-character>`,
      );
      await settled(b);
      // Same input — different code paths should produce different trait sets.
      expect(num(a.accessories)).to.not.equal(num(b.accessories));
    });
  });

  describe("hat selection", () => {
    let el;
    beforeEach(async () => {
      el = await fixture(html`<rpg-character seed="btopro"></rpg-character>`);
      await settled(el);
    });

    it("hat='none' renders no hat piece", async () => {
      el.hat = "none";
      await settled(el);
      const images = Array.from(
        el.shadowRoot.querySelectorAll(".wrapper > svg > image"),
      );
      for (const image of images) {
        const href = image.getAttribute("href") || "";
        expect(href).to.not.match(/\/hat\//);
      }
    });

    it("hat='cowboy' renders a cowboy hat piece", async () => {
      el.hat = "cowboy";
      await settled(el);
      const rendered = Array.from(
        el.shadowRoot.querySelectorAll(".wrapper > svg > image"),
      ).map((i) => i.getAttribute("href") || "");
      expect(rendered.some((h) => /\/hat\/cowboy\.svg$/.test(h))).to.be.true;
    });

    it("hat='knight' renders a knight hat piece", async () => {
      el.hat = "knight";
      await settled(el);
      const rendered = Array.from(
        el.shadowRoot.querySelectorAll(".wrapper > svg > image"),
      ).map((i) => i.getAttribute("href") || "");
      expect(rendered.some((h) => /\/hat\/knight\.svg$/.test(h))).to.be.true;
    });

    it("hat='random' picks one of the documented hatList values", async () => {
      el.hat = "random";
      await settled(el);
      const rendered = Array.from(
        el.shadowRoot.querySelectorAll(".wrapper > svg > image"),
      ).map((i) => i.getAttribute("href") || "");
      const hatRef = rendered.find((h) => h.match(/\/hat\//));
      expect(hatRef, "random hat should render at least one hat piece").to.not
        .be.undefined;
      const match = hatRef.match(/\/hat\/([^.]+)\.svg$/);
      expect(match, "random hat should resolve to a hat file").to.not.be.null;
      expect(hatList).to.include(match[1]);
    });

    it("fire=true with hat='none' swaps the hat out for coffee", async () => {
      el.fire = true;
      el.hat = "none";
      await settled(el);
      const rendered = Array.from(
        el.shadowRoot.querySelectorAll(".wrapper > svg > image"),
      ).map((i) => i.getAttribute("href") || "");
      const hatRef = rendered.find((h) => h.match(/\/hat\//));
      expect(hatRef).to.match(/\/hat\/coffee\.svg$/);
    });

    it("fire=true with an explicit hat keeps the requested hat, not coffee", async () => {
      el.fire = true;
      el.hat = "ninja";
      await settled(el);
      expect(lastImageHref(el)).to.match(/\/hat\/ninja\.svg$/);
    });
  });

  describe("circle flag", () => {
    it("toggling circle adds an extra svg piece", async () => {
      const el = await fixture(html`<rpg-character seed="btopro"></rpg-character>`);
      await settled(el);
      const baseline = pieceCount(el);
      el.circle = true;
      await settled(el);
      expect(pieceCount(el)).to.equal(baseline + 1);
      const rendered = Array.from(
        el.shadowRoot.querySelectorAll(".wrapper > svg > image"),
      ).map((i) => i.getAttribute("href") || "");
      expect(rendered.some((h) => /\/circle\.svg$/.test(h))).to.be.true;
    });

    it("toggling circle off removes the extra svg piece", async () => {
      const el = await fixture(
        html`<rpg-character seed="btopro" circle></rpg-character>`,
      );
      await settled(el);
      const withCircle = pieceCount(el);
      expect(withCircle).to.be.at.least(8);
      const rendered = Array.from(
        el.shadowRoot.querySelectorAll(".wrapper > svg > image"),
      ).map((i) => i.getAttribute("href") || "");
      expect(rendered.some((h) => /\/circle\.svg$/.test(h))).to.be.true;

      el.circle = false;
      await settled(el);
      expect(pieceCount(el)).to.equal(withCircle - 1);
    });
  });

  describe("fire flag", () => {
    it("speed drops to 100 when fire=true and returns to 500 when fire=false", async () => {
      const el = await fixture(html`<rpg-character seed="btopro"></rpg-character>`);
      await settled(el);
      expect(el.speed).to.equal(500);

      el.fire = true;
      await settled(el);
      expect(el.speed).to.equal(100);

      el.fire = false;
      await settled(el);
      expect(el.speed).to.equal(500);
    });

    it("renders the fire piece when fire=true", async () => {
      const el = await fixture(html`<rpg-character seed="btopro"></rpg-character>`);
      await settled(el);
      const renderedBefore = Array.from(
        el.shadowRoot.querySelectorAll(".wrapper > svg > image"),
      ).map((i) => i.getAttribute("href") || "");
      expect(renderedBefore.some((h) => /\/base\/fire\.svg$/.test(h))).to.be
        .false;

      el.fire = true;
      await settled(el);
      const renderedAfter = Array.from(
        el.shadowRoot.querySelectorAll(".wrapper > svg > image"),
      ).map((i) => i.getAttribute("href") || "");
      expect(renderedAfter.some((h) => /\/base\/fire\.svg$/.test(h))).to.be
        .true;
    });
  });

  describe("walking", () => {
    it("does not cycle legs when walking is false", async () => {
      const el = await fixture(html`<rpg-character seed="btopro"></rpg-character>`);
      await settled(el);
      el.walking = false;
      el.leg = "";
      await settled(el);
      await wait(700);
      expect(el.leg).to.equal("");
    });

    it("cycles leg pose while walking=true and motion is allowed", async () => {
      const el = await fixture(
        html`<rpg-character seed="btopro" walking></rpg-character>`,
      );
      await settled(el);
      // The fixture already created a timer; reset leg and wait a full speed cycle.
      el.leg = "";
      await settled(el);
      await wait(700);
      expect(["R", "L"]).to.include(el.leg);
    });

    it("does not cycle legs when reduceMotion is true at the time walking toggles on", async () => {
      // Build a fresh element with walking OFF so no pending timer is ever started.
      const el = await fixture(html`<rpg-character seed="btopro"></rpg-character>`);
      await settled(el);
      el.reduceMotion = true;
      el.leg = "";
      el.walking = true;
      await settled(el);
      await wait(700);
      expect(el.leg).to.equal("");
    });

    it("walks noticeably faster when fire toggles the speed", async () => {
      const el = await fixture(html`<rpg-character seed="btopro"></rpg-character>`);
      await settled(el);
      expect(el.speed).to.equal(500);
      el.fire = true;
      await settled(el);
      expect(el.speed).to.equal(100);
    });
  });

  describe("demo mode", () => {
    it("demo=false does not render the seed banner", async () => {
      const el = await fixture(
        html`<rpg-character seed="btopro"></rpg-character>`,
      );
      await settled(el);
      expect(el.shadowRoot.querySelector("#demo")).to.equal(null);
    });

    it("demo=true renders a #demo div with the current seed", async () => {
      const el = await fixture(
        html`<rpg-character seed="btopro" demo></rpg-character>`,
      );
      await settled(el);
      const demo = el.shadowRoot.querySelector("#demo");
      expect(demo).to.exist;
      expect(demo.textContent).to.include("btopro");
    });

    it("clicking the wrapper in demo mode randomizes the seed", async () => {
      const el = await fixture(
        html`<rpg-character seed="btopro" demo></rpg-character>`,
      );
      await settled(el);
      const before = el.seed;
      const wrapper = el.shadowRoot.querySelector(".wrapper");
      expect(wrapper).to.exist;
      wrapper.click();
      await settled(el);
      expect(el.seed).to.not.equal(before);
      const demo = el.shadowRoot.querySelector("#demo");
      expect(demo.textContent).to.include(el.seed);
    });

    it("disabling demo removes the seed banner", async () => {
      const el = await fixture(
        html`<rpg-character seed="btopro" demo></rpg-character>`,
      );
      await settled(el);
      expect(el.shadowRoot.querySelector("#demo")).to.exist;
      el.demo = false;
      await settled(el);
      expect(el.shadowRoot.querySelector("#demo")).to.equal(null);
    });
  });

  describe("accentColor CSS bridge", () => {
    it("emits a simple-colors CSS var binding for the accentColor", async () => {
      const el = await fixture(
        html`<rpg-character seed="btopro" accent-color="red"></rpg-character>`,
      );
      await settled(el);
      el.accentColor = "purple";
      await settled(el);
      const styles = Array.from(el.shadowRoot.querySelectorAll("style")).map(
        (s) => s.textContent || "",
      );
      expect(styles.join("\n")).to.include(
        "--simple-colors-default-theme-purple-8",
      );
    });
  });

  describe("randomColor helper", () => {
    it("returns a string key from the simple-colors palette", async () => {
      const el = await fixture(
        html`<rpg-character seed="btopro"></rpg-character>`,
      );
      await settled(el);
      const color = el.randomColor();
      expect(color).to.be.a("string");
      // color names from simple-colors palette never start with '#'
      expect(color.startsWith("#")).to.equal(false);
    });

    it("returns a deterministic color for a numeric seed", async () => {
      const el = await fixture(
        html`<rpg-character seed="btopro"></rpg-character>`,
      );
      await settled(el);
      const a = el.randomColor(0);
      const b = el.randomColor(0);
      expect(a).to.be.a("string");
      expect(a).to.equal(b);
    });
  });

  describe("a11y across configurations", () => {
    const configurations = [
      html`<rpg-character seed="btopro"></rpg-character>`,
      html`<rpg-character seed="btopro" hat="cowboy"></rpg-character>`,
      html`<rpg-character seed="btopro" circle></rpg-character>`,
      html`<rpg-character seed="btopro" fire></rpg-character>`,
      html`<rpg-character seed="btopro" demo></rpg-character>`,
      html`<rpg-character
        seed="btopro"
        hat="random"
        circle
        fire
      ></rpg-character>`,
    ];

    configurations.forEach((tmpl, index) => {
      it(`passes axe check #${index + 1}`, async () => {
        const el = await fixture(tmpl);
        await settled(el);
        await expect(el).shadowDom.to.be.accessible();
      });
    });
  });
});
