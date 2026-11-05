import { fixture, expect, html } from "@open-wc/testing";
import sinon from "sinon";
import "../lib/lrs-bridge-haxcms.js";
import { LrsBridgeHaxcms } from "../lib/lrs-bridge-haxcms.js";
import { LrsBridge } from "../lib/lrs-bridge.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("lrs-bridge-haxcms test", () => {
  let sandbox;
  let fetchStub;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    // stub ALL network access; recordStatement posts to an endpoint
    fetchStub = sandbox
      .stub(globalThis, "fetch")
      .resolves({ json: () => Promise.resolve({}) });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("has the correct tag name", () => {
    expect(LrsBridgeHaxcms.tag).to.equal("lrs-bridge-haxcms");
    const defined = globalThis.customElements.get("lrs-bridge-haxcms");
    expect(typeof defined).to.equal("function");
  });

  it("is registered alongside lrs-bridge", () => {
    const defined = globalThis.customElements.get("lrs-bridge");
    expect(typeof defined).to.equal("function");
    expect(new LrsBridgeHaxcms()).to.be.instanceOf(LrsBridge);
  });

  it("posts nothing of its own on creation", async () => {
    const el = globalThis.document.createElement("lrs-bridge-haxcms");
    el.endpoint = "https://lrs.example.com/graphql";
    await wait(50);
    expect(fetchStub.called).to.be.false;
  });

  it("forwards the progress store's page visit statement", async () => {
    const el = await fixture(
      html`<lrs-bridge-haxcms
        endpoint="https://lrs.example.com/graphql"
      ></lrs-bridge-haxcms>`,
    );
    await el.updateComplete;
    // the shape haxcms-learner-progress sends for a page visit
    globalThis.dispatchEvent(
      new CustomEvent("user-engagement", {
        detail: {
          activityDisplay: "experienced",
          statement: {
            id: "6a1b2c3d-0000-4000-8000-000000000001",
            verb: { id: "http://adlnet.gov/expapi/verbs/experienced" },
            object: {
              id: "https://example.com/welcome",
              objectType: "Activity",
              definition: {
                type: "http://adlnet.gov/expapi/activities/lesson",
              },
            },
          },
        },
      }),
    );
    await wait(50);
    expect(fetchStub.calledOnce).to.be.true;
    const data = JSON.parse(fetchStub.firstCall.args[1].body).variables.data
      .data;
    expect(data.verb.id).to.equal("http://adlnet.gov/expapi/verbs/experienced");
    expect(data.object.id).to.equal("https://example.com/welcome");
  });
});
