import { fixture, expect, html } from "@open-wc/testing";
import "../a11y-media-player.js";
import {
  MEDIA_WATCH_DONE,
  MEDIA_WATCH_HALF,
  XAPI_MEDIA_PROGRESS,
} from "../a11y-media-player.js";
import { XAPI_VERBS } from "@haxtheweb/user-action/lib/xapi.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// a player whose <video> reports a fake clock, so playback can be stepped
async function player(duration = 100) {
  const el = await fixture(
    html`<a11y-media-player id="clip"><video></video></a11y-media-player>`,
  );
  await el.updateComplete;
  await sleep(50);
  const media = el.querySelector("video");
  let now = 0;
  Object.defineProperty(media, "currentTime", {
    configurable: true,
    get: () => now,
    set: (v) => {
      now = v;
    },
  });
  Object.defineProperty(media, "duration", {
    configurable: true,
    get: () => duration,
  });
  media.play = () => Promise.resolve();
  media.pause = () => {};
  const seen = [];
  el.addEventListener("user-engagement", (e) => seen.push(e.detail));
  // report the clock the way timeupdate does
  const at = (t) => {
    now = t;
    el._trackWatched();
  };
  // play from one time to another in quarter second reports
  const watch = (from, to) => {
    for (let t = from; t <= to + 0.0001; t += 0.25) {
      at(Math.round(t * 100) / 100);
    }
  };
  el.__playing = true;
  return { el, seen, at, watch };
}

describe("a11y-media-player learner data", () => {
  it("uses 50% and 95% as the milestones", () => {
    expect(MEDIA_WATCH_HALF).to.equal(0.5);
    expect(MEDIA_WATCH_DONE).to.equal(0.95);
  });

  it("sends start, half way and completed once each while watching", async () => {
    const { el, seen, watch } = await player(100);
    watch(0, 99.5);
    // watching again does not resend anything
    watch(0, 99.5);
    el._handleMediaEnded();
    expect(seen.map((d) => d.activityDisplay)).to.deep.equal([
      "attempted",
      "progressed",
      "completed",
    ]);
    const [start, half, done] = seen.map((d) => d.statement);
    expect(start.verb.id).to.equal(XAPI_VERBS.attempted);
    expect(start.result).to.equal(undefined);
    expect(half.verb.id).to.equal(XAPI_VERBS.progressed);
    expect(half.result.completion).to.equal(false);
    expect(half.result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(0.5);
    expect(done.verb.id).to.equal(XAPI_VERBS.completed);
    expect(done.result.completion).to.equal(true);
    expect(done.result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(0.95);
    expect(done.result.duration).to.equal("PT95S");
    expect(done.object.id.endsWith("#clip")).to.equal(true);
    expect(done.object.definition.type).to.equal(
      "http://adlnet.gov/expapi/activities/media",
    );
    expect(seen[2].resultCompletion).to.equal(true);
  });

  it("completes at 95% so a missed final report still counts", async () => {
    const { seen, watch } = await player(60);
    // YouTube can stop reporting a moment before the very end
    watch(0, 57.25);
    expect(seen[seen.length - 1].activityDisplay).to.equal("completed");
  });

  it("does not count seeking ahead or reaching the end without watching", async () => {
    const { el, seen, watch, at } = await player(100);
    watch(0, 10);
    // scrub to near the end and let it play out
    at(90);
    watch(90, 100);
    el._handleMediaEnded();
    const verbs = seen.map((d) => d.activityDisplay);
    expect(verbs).to.deep.equal(["attempted"]);
    expect(el.watchedShare).to.be.below(MEDIA_WATCH_HALF);
  });

  it("counts each second once however often it is replayed", async () => {
    const { el, seen, watch, at } = await player(100);
    for (let i = 0; i < 6; i++) {
      at(0);
      watch(0, 20);
    }
    expect(el.watchedShare).to.be.closeTo(0.21, 0.01);
    expect(seen.map((d) => d.activityDisplay)).to.deep.equal(["attempted"]);
  });

  it("ignores time reports while paused or seeking", async () => {
    const { el, seen, watch } = await player(100);
    el.__playing = false;
    watch(0, 60);
    el.__playing = true;
    el.__seeking = true;
    watch(60, 70);
    expect(seen.length).to.equal(0);
    expect(el.watchedShare).to.equal(0);
  });

  it("sends no milestone while the duration is unknown", async () => {
    const { el, seen, watch } = await player(NaN);
    watch(0, 30);
    expect(el.watchedShare).to.equal(null);
    expect(seen.map((d) => d.activityDisplay)).to.deep.equal(["attempted"]);
  });
});

describe("a11y-media-player learner data host", () => {
  const elementExt = "https://haxtheweb.org/xapi/extensions/element";
  it("reports as the video-player it is authored inside (legacy markup)", async () => {
    const wrap = await fixture(html`<div></div>`);
    // a plain element named video-player stands in for the wrapper so the
    // legacy light-DOM nesting is tested without loading video-player
    const vp = document.createElement("video-player");
    vp.setAttribute("source", "legacy.mp3");
    const amp = document.createElement("a11y-media-player");
    amp.id = "a11y-media-player1755519619724";
    vp.appendChild(amp);
    wrap.appendChild(vp);
    await amp.updateComplete;
    const seen = [];
    amp.addEventListener("user-engagement", (e) => seen.push(e.detail));
    amp._announceMedia("attempted");
    expect(seen.length).to.equal(1);
    const s = seen[0].statement;
    expect(s.context.extensions[elementExt]).to.equal("video-player");
    expect(s.object.id).to.not.contain("a11y-media-player1755519619724");
  });

  it("keys a standalone player without an authored id by its content", async () => {
    const amp = await fixture(
      html`<a11y-media-player media-title="Lecture"
        ><video></video
      ></a11y-media-player>`,
    );
    await amp.updateComplete;
    expect(amp.id).to.match(/^a11y-media-player\d+$/);
    const seen = [];
    amp.addEventListener("user-engagement", (e) => seen.push(e.detail));
    amp._announceMedia("attempted");
    expect(seen[0].statement.object.id).to.not.contain(amp.id);
  });
});
