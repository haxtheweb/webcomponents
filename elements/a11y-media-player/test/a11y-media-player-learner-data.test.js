import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-media-player.js";
import { XAPI_VERBS } from "@haxtheweb/user-action/lib/xapi.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

describe("a11y-media-player learner data", () => {
  it("playing to the end sends one completed statement", async () => {
    const el = await fixture(
      html`<a11y-media-player id="clip"><video></video></a11y-media-player>`,
    );
    await el.updateComplete;
    await sleep(50);
    const media = el.querySelector("video");
    media.play = () => Promise.resolve();
    media.pause = () => {};
    const seen = [];
    el.addEventListener("user-engagement", (e) => seen.push(e.detail));
    el._handleMediaEnded();
    el._handleMediaEnded();
    expect(seen.length).to.equal(1);
    expect(seen[0].activityDisplay).to.equal("completed");
    expect(seen[0].resultCompletion).to.equal(true);
    expect(seen[0].statement.verb.id).to.equal(XAPI_VERBS.completed);
    expect(seen[0].statement.object.id.endsWith("#clip")).to.equal(true);
    expect(seen[0].statement.object.definition.type).to.equal(
      "http://adlnet.gov/expapi/activities/media",
    );
  });
});
