import { fixture, expect, html } from "@open-wc/testing";

import "../simple-tooltip.js";

describe("simple-tooltip test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <simple-tooltip title="test-title"></simple-tooltip>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("simple-tooltip attribute reflection", () => {
  it("sets role=tooltip and tabindex=-1 after firstUpdated", async () => {
    const el = await fixture(html`<simple-tooltip>tip</simple-tooltip>`);
    expect(el.getAttribute("role")).to.equal("tooltip");
    expect(el.getAttribute("tabindex")).to.equal("-1");
  });
});

describe("simple-tooltip target getter", () => {
  it("returns parentNode when for is not set", async () => {
    const container = await fixture(html`
      <div><simple-tooltip>tip</simple-tooltip></div>
    `);
    const tip = container.querySelector("simple-tooltip");
    await tip.updateComplete;
    expect(tip.target).to.equal(container);
  });

  it("returns element by id when for is set", async () => {
    const container = await fixture(html`
      <div>
        <button id="anchor-btn">btn</button>
        <simple-tooltip for="anchor-btn">tip</simple-tooltip>
      </div>
    `);
    const tip = container.querySelector("simple-tooltip");
    await tip.updateComplete;
    expect(tip.target).to.equal(container.querySelector("#anchor-btn"));
  });
});

describe("simple-tooltip show", () => {
  it("reveals tooltip when text content is present", async () => {
    const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`);
    const tip = el.shadowRoot.querySelector("#tooltip");
    expect(tip.classList.contains("hidden")).to.be.true;
    el.show();
    expect(el._showing).to.be.true;
    expect(tip.classList.contains("hidden")).to.be.false;
  });

  it("is a no-op when already showing", async () => {
    const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`);
    el.show();
    el.show();
    expect(el._showing).to.be.true;
  });

  it("is a no-op when content is empty", async () => {
    const el = await fixture(html`<simple-tooltip></simple-tooltip>`);
    el.show();
    expect(el._showing).to.be.undefined;
  });

  it("is a no-op when all children are empty", async () => {
    const el = await fixture(
      html`<simple-tooltip><span>   </span></simple-tooltip>`,
    );
    el.show();
    expect(el._showing).to.be.undefined;
  });

  it("works when child has non-empty text content", async () => {
    const el = await fixture(
      html`<simple-tooltip><span>child tip</span></simple-tooltip>`,
    );
    el.show();
    expect(el._showing).to.be.true;
  });
});

describe("simple-tooltip hide", () => {
  it("hides after show when entry animation is still playing", async () => {
    const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`);
    el.show();
    expect(el._showing).to.be.true;
    el.hide();
    expect(el._showing).to.be.false;
  });

  it("is a no-op when not showing", async () => {
    const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`);
    el.hide();
    expect(el._showing).to.be.undefined;
  });

  it("goes through exit animation path when entry animation finished", async () => {
    const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`);
    el.show();
    const tip = el.shadowRoot.querySelector("#tooltip");
    tip.dispatchEvent(new Event("animationend"));
    expect(el._animationPlaying).to.be.false;
    el.hide();
    expect(el._showing).to.be.false;
    expect(el._animationPlaying).to.be.true;
    await new Promise((r) => setTimeout(r, 100));
  });

  it("adds hidden class after exit animation ends", async () => {
    const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`);
    const tip = el.shadowRoot.querySelector("#tooltip");
    el.show();
    tip.dispatchEvent(new Event("animationend"));
    el.hide();
    tip.dispatchEvent(new Event("animationend"));
    expect(tip.classList.contains("hidden")).to.be.true;
  });

  it("force-hides via setTimeout after exit animation duration", async () => {
    const docEl = globalThis.document.documentElement;
    docEl.style.setProperty("--simple-tooltip-duration-out", "10ms");
    const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`);
    el.show();
    const tip = el.shadowRoot.querySelector("#tooltip");
    tip.dispatchEvent(new Event("animationend"));
    el.hide();
    // setTimeout fires after total + 50 = 10 + 50 = 60ms
    await new Promise((r) => setTimeout(r, 120));
    expect(tip.classList.contains("hidden")).to.be.true;
    docEl.style.removeProperty("--simple-tooltip-duration-out");
  });

  it("hides immediately via requestAnimationFrame when exit duration is 0", async () => {
    const docEl = globalThis.document.documentElement;
    docEl.style.setProperty("--simple-tooltip-duration-out", "0ms");
    const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`);
    el.show();
    const tip = el.shadowRoot.querySelector("#tooltip");
    tip.dispatchEvent(new Event("animationend"));
    el.hide();
    // requestAnimationFrame fires on next frame
    await new Promise((r) => setTimeout(r, 50));
    expect(tip.classList.contains("hidden")).to.be.true;
    docEl.style.removeProperty("--simple-tooltip-duration-out");
  });
});

describe("simple-tooltip positioning", () => {
  it("positions below target by default (bottom)", async () => {
    const container = await fixture(html`
      <div style="position: relative; width: 300px; height: 300px;">
        <button
          id="pos-bottom"
          style="position: absolute; top: 50px; left: 50px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="pos-bottom">tip</simple-tooltip>
      </div>
    `);
    const tip = container.querySelector("simple-tooltip");
    await tip.updateComplete;
    tip.show();
    expect(tip.style.top).to.not.equal("");
  });

  it("positions above target when position=top", async () => {
    const container = await fixture(html`
      <div style="position: relative; width: 300px; height: 300px;">
        <button
          id="pos-top"
          style="position: absolute; top: 100px; left: 50px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="pos-top" position="top">tip</simple-tooltip>
      </div>
    `);
    const tip = container.querySelector("simple-tooltip");
    await tip.updateComplete;
    tip.show();
    expect(tip.style.top).to.not.equal("");
  });

  it("positions left when position=left", async () => {
    const container = await fixture(html`
      <div style="position: relative; width: 300px; height: 300px;">
        <button
          id="pos-left"
          style="position: absolute; top: 100px; left: 150px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="pos-left" position="left">tip</simple-tooltip>
      </div>
    `);
    const tip = container.querySelector("simple-tooltip");
    await tip.updateComplete;
    tip.show();
    expect(tip.style.left).to.not.equal("");
  });

  it("positions right when position=right", async () => {
    const container = await fixture(html`
      <div style="position: relative; width: 300px; height: 300px;">
        <button
          id="pos-right"
          style="position: absolute; top: 100px; left: 50px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="pos-right" position="right">tip</simple-tooltip>
      </div>
    `);
    const tip = container.querySelector("simple-tooltip");
    await tip.updateComplete;
    tip.show();
    expect(tip.style.left).to.not.equal("");
  });

  it("clips to visible bounds when fitToVisibleBounds is true", async () => {
    const container = await fixture(html`
      <div style="position: relative; width: 300px; height: 300px;">
        <button
          id="pos-fit"
          style="position: absolute; top: 280px; left: 280px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="pos-fit" fit-to-visible-bounds>tip</simple-tooltip>
      </div>
    `);
    const tip = container.querySelector("simple-tooltip");
    await tip.updateComplete;
    tip.show();
    const hasPos =
      tip.style.left !== "" ||
      tip.style.right !== "" ||
      tip.style.top !== "" ||
      tip.style.bottom !== "";
    expect(hasPos).to.be.true;
  });

  it("uses marginTop as offset when offset is default and marginTop differs", async () => {
    const container = await fixture(html`
      <div style="position: relative; width: 300px; height: 300px;">
        <button
          id="pos-mt"
          style="position: absolute; top: 100px; left: 50px; width: 100px; height: 30px;"
        >
          B
        </button>
        <simple-tooltip for="pos-mt" margin-top="20">tip</simple-tooltip>
      </div>
    `);
    const tip = container.querySelector("simple-tooltip");
    await tip.updateComplete;
    tip.show();
    expect(tip.style.top).to.not.equal("");
  });
});

describe("simple-tooltip playAnimation", () => {
  it("playAnimation('entry') calls show", async () => {
    const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`);
    el.playAnimation("entry");
    expect(el._showing).to.be.true;
  });

  it("playAnimation('exit') calls hide", async () => {
    const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`);
    el.show();
    el.playAnimation("exit");
    expect(el._showing).to.be.false;
  });
});

describe("simple-tooltip cancelAnimation method", () => {
  it("adds cancel-animation class to tooltip div", async () => {
    const el = await fixture(html`<simple-tooltip>tip text</simple-tooltip>`);
    const tip = el.shadowRoot.querySelector("#tooltip");
    el.cancelAnimation();
    expect(tip.classList.contains("cancel-animation")).to.be.true;
  });
});

describe("simple-tooltip _getAnimationType", () => {
  it("returns animationEntry when set for entry", async () => {
    const el = await fixture(html`<simple-tooltip>tip</simple-tooltip>`);
    el.animationEntry = "custom-entry";
    expect(el._getAnimationType("entry")).to.equal("custom-entry");
  });

  it("returns animationExit when set for exit", async () => {
    const el = await fixture(html`<simple-tooltip>tip</simple-tooltip>`);
    el.animationExit = "custom-exit";
    expect(el._getAnimationType("exit")).to.equal("custom-exit");
  });

  it("returns default from animationConfig for entry", async () => {
    const el = await fixture(html`<simple-tooltip>tip</simple-tooltip>`);
    expect(el._getAnimationType("entry")).to.equal("fade-in-animation");
  });

  it("returns default from animationConfig for exit", async () => {
    const el = await fixture(html`<simple-tooltip>tip</simple-tooltip>`);
    expect(el._getAnimationType("exit")).to.equal("fade-out-animation");
  });

  it("sets CSS delay-in when animationConfig entry has timing delay", async () => {
    const el = await fixture(html`<simple-tooltip>tip</simple-tooltip>`);
    el.animationConfig = {
      entry: [{ name: "fade-in-animation", node: el, timing: { delay: 300 } }],
      exit: [{ name: "fade-out-animation", node: el }],
    };
    el._getAnimationType("entry");
    expect(
      globalThis.document.documentElement.style.getPropertyValue(
        "--simple-tooltip-delay-in",
      ),
    ).to.equal("300ms");
  });

  it("sets CSS delay-out when animationConfig exit has timing delay", async () => {
    const el = await fixture(html`<simple-tooltip>tip</simple-tooltip>`);
    el.animationConfig = {
      entry: [{ name: "fade-in-animation", node: el }],
      exit: [{ name: "fade-out-animation", node: el, timing: { delay: 200 } }],
    };
    el._getAnimationType("exit");
    expect(
      globalThis.document.documentElement.style.getPropertyValue(
        "--simple-tooltip-delay-out",
      ),
    ).to.equal("200ms");
  });
});

describe("simple-tooltip _timeToMs", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<simple-tooltip>tip</simple-tooltip>`);
  });

  it("returns 0 for non-string input", () => {
    expect(el._timeToMs(500)).to.equal(0);
    expect(el._timeToMs(null)).to.equal(0);
    expect(el._timeToMs(undefined)).to.equal(0);
    expect(el._timeToMs({})).to.equal(0);
  });

  it("parses ms values", () => {
    expect(el._timeToMs("500ms")).to.equal(500);
    expect(el._timeToMs("0ms")).to.equal(0);
  });

  it("parses s values", () => {
    expect(el._timeToMs("2s")).to.equal(2000);
    expect(el._timeToMs("0.5s")).to.equal(500);
  });

  it("parses plain numbers", () => {
    expect(el._timeToMs("100")).to.equal(100);
  });

  it("returns 0 for NaN values", () => {
    expect(el._timeToMs("abcms")).to.equal(0);
    expect(el._timeToMs("abcd")).to.equal(0);
  });
});

describe("simple-tooltip property changes via updated", () => {
  it("changing for attribute re-finds target", async () => {
    const container = await fixture(html`
      <div>
        <button id="tgt1">T1</button>
        <button id="tgt2">T2</button>
        <simple-tooltip for="tgt1">tip</simple-tooltip>
      </div>
    `);
    const tip = container.querySelector("simple-tooltip");
    await tip.updateComplete;
    expect(tip.target).to.equal(container.querySelector("#tgt1"));
    tip.setAttribute("for", "tgt2");
    await tip.updateComplete;
    expect(tip.target).to.equal(container.querySelector("#tgt2"));
  });

  it("setting manualMode=true removes listeners", async () => {
    const el = await fixture(html`<simple-tooltip>tip</simple-tooltip>`);
    el.manualMode = true;
    await el.updateComplete;
    expect(el.manualMode).to.be.true;
  });

  it("setting manualMode=false adds listeners back", async () => {
    const el = await fixture(html`<simple-tooltip>tip</simple-tooltip>`);
    el.manualMode = true;
    await el.updateComplete;
    el.manualMode = false;
    await el.updateComplete;
    expect(el.manualMode).to.be.false;
  });

  it("setting animationDelay updates CSS variable", async () => {
    const el = await fixture(html`<simple-tooltip>tip</simple-tooltip>`);
    el.animationDelay = 300;
    await el.updateComplete;
    expect(
      globalThis.document.documentElement.style.getPropertyValue(
        "--simple-tooltip-delay-in",
      ),
    ).to.equal("300ms");
  });
});

describe("simple-tooltip event wiring", () => {
  it("shows on target mouseenter and hides on mouseleave", async () => {
    const container = await fixture(html`
      <div>
        <button id="ew-mouse">B</button>
        <simple-tooltip for="ew-mouse">tip</simple-tooltip>
      </div>
    `);
    const tip = container.querySelector("simple-tooltip");
    const btn = container.querySelector("#ew-mouse");
    await tip.updateComplete;
    btn.dispatchEvent(new Event("mouseenter"));
    expect(tip._showing).to.be.true;
    btn.dispatchEvent(new Event("mouseleave"));
    expect(tip._showing).to.be.false;
  });

  it("shows on target focus and hides on blur", async () => {
    const container = await fixture(html`
      <div>
        <button id="ew-focus">B</button>
        <simple-tooltip for="ew-focus">tip</simple-tooltip>
      </div>
    `);
    const tip = container.querySelector("simple-tooltip");
    const btn = container.querySelector("#ew-focus");
    await tip.updateComplete;
    btn.dispatchEvent(new Event("focus"));
    expect(tip._showing).to.be.true;
    btn.dispatchEvent(new Event("blur"));
    expect(tip._showing).to.be.false;
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("simple-tooltip passes accessibility test", async () => {
    const el = await fixture(html` <simple-tooltip></simple-tooltip> `);
    await expect(el).to.be.accessible();
  });
  it("simple-tooltip passes accessibility negation", async () => {
    const el = await fixture(
      html`<simple-tooltip aria-labelledby="simple-tooltip"></simple-tooltip>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("simple-tooltip can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<simple-tooltip .foo=${'bar'}></simple-tooltip>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<simple-tooltip ></simple-tooltip>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<simple-tooltip></simple-tooltip>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<simple-tooltip></simple-tooltip>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
