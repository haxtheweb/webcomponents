import { expect } from "@open-wc/testing";
import { HAXStore } from "../lib/hax-store.js";

// #3066: helper-level tests for _isImageElement (now recognises
// <place-holder type="image"> as an image target) and _replaceImageInPlace
// (in-place source/alt replace instead of auto-wrapping into
// <image-gallery>). Tests do NOT rely on the full HAXOS schema bootstrap;
// they exercise the helper functions directly on the HAXStore singleton.

/**
 * Stub haxReplaceNode on a fake activeHaxBody so _replaceImageInPlace can
 * swap the placeholder in light DOM without needing a real <hax-body>.
 */
function makeActiveHaxBodyFor(parentHost) {
  const fakeBody = {
    haxReplaceNode(oldNode, newNode) {
      if (oldNode && oldNode.parentNode) {
        oldNode.parentNode.insertBefore(newNode, oldNode);
        oldNode.parentNode.removeChild(oldNode);
      } else if (parentHost && oldNode) {
        parentHost.appendChild(newNode);
      }
    },
  };
  HAXStore.activeHaxBody = fakeBody;
  return fakeBody;
}

describe("hax-store #3066 image replace-on-drop helpers", () => {
  let originalActiveBody;
  let originalActiveNode;
  let originalActivePlaceHolder;
  let originalsToastEvents;

  beforeEach(() => {
    originalActiveBody = HAXStore.activeHaxBody;
    originalActiveNode = HAXStore.activeNode;
    originalActivePlaceHolder = HAXStore.activePlaceHolder;
    originalsToastEvents = [];
    // capture toast events so tests don't blow up on globalThis dispatch
    HAXStore.toast = (msg) => originalsToastEvents.push(msg);
  });

  afterEach(() => {
    HAXStore.activeHaxBody = originalActiveBody;
    HAXStore.activeNode = originalActiveNode;
    HAXStore.activePlaceHolder = originalActivePlaceHolder;
  });

  describe("_isImageElement", () => {
    it("returns false for null / undefined / untagged input", () => {
      expect(HAXStore._isImageElement(null)).to.equal(false);
      expect(HAXStore._isImageElement(undefined)).to.equal(false);
      expect(HAXStore._isImageElement({})).to.equal(false);
    });

    it("returns true for known image tag names", () => {
      const tags = [
        "media-image",
        "img",
        "image",
        "a11y-figure",
        "full-width-image",
        "parallax-image",
      ];
      for (const tag of tags) {
        const el = globalThis.document.createElement(tag);
        expect(HAXStore._isImageElement(el)).to.equal(
          true,
          `expected ${tag} to be recognised as image element`,
        );
      }
    });

    it("returns true for <place-holder type='image'>", () => {
      // place-holder is not registered as a custom element in this test
      // harness so we hand-roll a tag-less element via innerHTML; createElement
      // works without registration since unknown tags are still HTMLElements.
      const host = globalThis.document.createElement("div");
      host.innerHTML = `<place-holder type="image"></place-holder>`;
      const ph = host.querySelector("place-holder");
      expect(ph).to.exist;
      // make sure attribute is read off the actual element, not the path
      expect(ph.getAttribute("type")).to.equal("image");
      expect(HAXStore._isImageElement(ph)).to.equal(true);
    });

    it("returns false for <place-holder> with non-image type", () => {
      const host = globalThis.document.createElement("div");
      for (const t of ["audio", "video", "document", "math", "text"]) {
        host.innerHTML = `<place-holder type="${t}"></place-holder>`;
        const ph = host.querySelector("place-holder");
        expect(HAXStore._isImageElement(ph)).to.equal(
          false,
          `expected <place-holder type="${t}"> not to be image`,
        );
      }
    });

    it("returns false for an unrelated tag like paragraph", () => {
      const p = globalThis.document.createElement("p");
      expect(HAXStore._isImageElement(p)).to.equal(false);
    });
  });

  describe("_replaceImageInPlace", () => {
    it("updates source on an existing <media-image> in place; preserves alt and treatment props", () => {
      const host = globalThis.document.createElement("div");
      const original = globalThis.document.createElement("media-image");
      original.setAttribute("source", "files/old.jpg");
      original.setAttribute("alt", "Old alt");
      original.setAttribute("card", "");
      host.appendChild(original);
      makeActiveHaxBodyFor(host);

      HAXStore._replaceImageInPlace(original, {
        source: "files/new.jpg",
      });

      // The original element must remain (in-place), not be wrapped
      const galleries = host.querySelectorAll("image-gallery");
      expect(galleries.length).to.equal(0);
      const stillThere = host.querySelector("media-image");
      expect(stillThere).to.equal(original, "original image should remain in-place");
      expect(original.getAttribute("source")).to.equal("files/new.jpg");
      expect(original.getAttribute("alt")).to.equal("Old alt", "alt preserved on replace");
      // card reflects the attribute on the element
      expect(original.hasAttribute("card")).to.equal(true);
      expect(HAXStore.activeNode).to.equal(original);
      expect(HAXStore.activePlaceHolder).to.equal(null);
      expect(originalsToastEvents[0]).to.equal("Image replaced");
    });

    it("updates alt when one is supplied in values", () => {
      const host = globalThis.document.createElement("div");
      const img = globalThis.document.createElement("media-image");
      img.setAttribute("alt", "Old alt");
      host.appendChild(img);
      makeActiveHaxBodyFor(host);

      HAXStore._replaceImageInPlace(img, {
        source: "files/new.jpg",
        alt: "Updated alt",
      });
      expect(img.getAttribute("alt")).to.equal("Updated alt");
    });

    it("promotes a <place-holder type='image'> to a fresh <media-image> at the same slot", () => {
      const host = globalThis.document.createElement("div");
      host.innerHTML = `<place-holder slot="col-1" type="image"></place-holder>`;
      const ph = host.querySelector("place-holder");
      makeActiveHaxBodyFor(host);

      HAXStore._replaceImageInPlace(ph, { source: "files/promo.jpg" });

      // Ensure no gallery was created
      expect(host.querySelectorAll("image-gallery").length).to.equal(0);
      // Place-holder must be gone
      expect(host.querySelector("place-holder")).to.equal(null);
      const img = host.querySelector("media-image");
      expect(img).to.exist;
      expect(img.getAttribute("source")).to.equal("files/promo.jpg");
      expect(img.getAttribute("slot")).to.equal("col-1", "slot attr preserved");
      expect(HAXStore.activeNode).to.equal(img);
      expect(HAXStore.activePlaceHolder).to.equal(null);
    });

    it("removes the temporary <p> placeholder that hax-body dropEvent() injects", () => {
      const host = globalThis.document.createElement("div");
      const img = globalThis.document.createElement("media-image");
      img.setAttribute("source", "files/old.jpg");
      host.appendChild(img);
      const tmpP = globalThis.document.createElement("p");
      host.appendChild(tmpP);
      makeActiveHaxBodyFor(host);
      HAXStore.activePlaceHolder = tmpP;

      HAXStore._replaceImageInPlace(img, { source: "files/new.jpg" });

      expect(host.querySelector("p")).to.equal(null, "temp <p> should be removed");
      expect(img.getAttribute("source")).to.equal("files/new.jpg");
      expect(HAXStore.activePlaceHolder).to.equal(null);
    });

    it("works when imageTarget is a <place-holder> with no temporary <p> sibling (drop landed on the placeholder itself)", () => {
      const host = globalThis.document.createElement("div");
      host.innerHTML = `<place-holder type="image"></place-holder>`;
      const ph = host.querySelector("place-holder");
      makeActiveHaxBodyFor(host);

      HAXStore._replaceImageInPlace(ph, { source: "files/direct.jpg" });
      expect(host.querySelector("place-holder")).to.equal(null);
      const img = host.querySelector("media-image");
      expect(img).to.exist;
      expect(img.getAttribute("source")).to.equal("files/direct.jpg");
      expect(HAXStore.activeNode).to.equal(img);
    });

    it("is a no-op when imageTarget is null", () => {
      makeActiveHaxBodyFor(globalThis.document.createElement("div"));
      expect(() => HAXStore._replaceImageInPlace(null, { source: "files/x.jpg" })).to.not.throw();
      expect(originalsToastEvents.length).to.equal(0);
    });
  });
});
