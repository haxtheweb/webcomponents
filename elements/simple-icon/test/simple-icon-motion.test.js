import { fixture, expect, html } from "@open-wc/testing";
import "../simple-icon.js";
import "../lib/simple-icon-lite.js";

// simple-icon does not import the DDD design system. These tests run with
// no motion library on the page (and with a stand-in for it) to pin what
// the motion attribute does in each case. The motions themselves are
// tested with the library, in d-d-d/test/ddd-motion-icons.test.js.
describe("simple-icon motion attribute", () => {
  let saved;
  beforeEach(() => {
    saved = globalThis.DDDMotion;
    delete globalThis.DDDMotion;
  });
  afterEach(() => {
    if (saved) {
      globalThis.DDDMotion = saved;
    } else {
      delete globalThis.DDDMotion;
    }
  });

  ["simple-icon", "simple-icon-lite"].forEach((tag) => {
    const make = async (attrs = {}) => {
      const el = globalThis.document.createElement(tag);
      Object.keys(attrs).forEach((name) => el.setAttribute(name, attrs[name]));
      const wrap = await fixture(html`<div></div>`);
      wrap.appendChild(el);
      await el.updateComplete;
      return el;
    };

    describe(tag, () => {
      it("is unchanged when motion is absent", async () => {
        const el = await make();
        expect(el.motion).to.equal(undefined);
        expect(el.motionActive).to.equal(undefined);
        expect(el.hasAttribute("motion")).to.equal(false);
        expect(el.hasAttribute("motion-active")).to.equal(false);
        expect(el.__onMotionReady).to.equal(undefined);
        expect(globalThis.getComputedStyle(el).animationName).to.equal("none");
        expect(el.getAnimations()).to.deep.equal([]);
      });

      it("never asks for the motion library when motion is absent", async () => {
        let calls = 0;
        globalThis.DDDMotion = {
          adoptHost: () => {
            calls++;
            return true;
          },
        };
        const el = await make();
        const sheets = el.shadowRoot.adoptedStyleSheets.length;
        el.motionActive = true;
        await el.updateComplete;
        expect(calls).to.equal(0);
        expect(el.shadowRoot.adoptedStyleSheets.length).to.equal(sheets);
      });

      it("reflects motion and motion-active", async () => {
        const el = await make({ motion: "wiggle" });
        expect(el.motion).to.equal("wiggle");
        el.motion = "lift";
        el.motionActive = true;
        await el.updateComplete;
        expect(el.getAttribute("motion")).to.equal("lift");
        expect(el.hasAttribute("motion-active")).to.equal(true);
      });

      it("does not move, and does not fail, without the motion library", async () => {
        const plain = await make();
        const el = await make({ motion: "wiggle", "motion-active": "" });
        expect(el.getAnimations()).to.deep.equal([]);
        expect(globalThis.getComputedStyle(el).animationName).to.equal("none");
        expect(el.shadowRoot.adoptedStyleSheets.length).to.equal(
          plain.shadowRoot.adoptedStyleSheets.length,
        );
        // the filter id is random per icon; everything else is identical
        const drawn = (icon) =>
          icon.shadowRoot.innerHTML.replace(/f-\d+/g, "f-id");
        expect(drawn(el)).to.equal(drawn(plain));
      });

      it("takes the motion styles from the library when it is present", async () => {
        const roots = [];
        globalThis.DDDMotion = {
          adoptHost: (root) => {
            roots.push(root);
            return true;
          },
        };
        const el = await make({ motion: "pop" });
        expect(roots).to.deep.equal([el.shadowRoot]);
        expect(el.__onMotionReady).to.equal(undefined);
      });

      it("picks the library up when it arrives later", async () => {
        const el = await make({ motion: "pop" });
        expect(el.__onMotionReady).to.be.a("function");
        const roots = [];
        globalThis.DDDMotion = {
          adoptHost: (root) => {
            roots.push(root);
            return true;
          },
        };
        globalThis.dispatchEvent(new CustomEvent("ddd-motion-ready"));
        expect(roots).to.deep.equal([el.shadowRoot]);
        // it stops listening once it has the styles
        expect(el.__onMotionReady).to.equal(null);
        globalThis.dispatchEvent(new CustomEvent("ddd-motion-ready"));
        expect(roots.length).to.equal(1);
      });

      it("stops waiting when removed and asks again when re-added", async () => {
        const el = await make({ motion: "pop" });
        const parent = el.parentNode;
        el.remove();
        expect(el.__onMotionReady).to.equal(null);
        const roots = [];
        globalThis.DDDMotion = {
          adoptHost: (root) => {
            roots.push(root);
            return true;
          },
        };
        globalThis.dispatchEvent(new CustomEvent("ddd-motion-ready"));
        expect(roots.length).to.equal(0);
        parent.appendChild(el);
        expect(roots).to.deep.equal([el.shadowRoot]);
      });
    });
  });
});
