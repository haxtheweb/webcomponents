import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import "../a11y-media-player.js";
import {
  MEDIA_WATCH_DONE,
  MEDIA_WATCH_END_MIN,
  MEDIA_WATCH_HALF,
  XAPI_MEDIA_PROGRESS,
} from "../a11y-media-player.js";
import { installOfflineYouTubeStubs } from "./offline-stubs.js";

// keep every youtube request off the real network (see helper)
installOfflineYouTubeStubs();
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
  // play from one time to another in quarter second reports (step is the
  // media time between reports: 0.5 at 2x speed)
  const watch = (from, to, step = 0.25) => {
    for (let t = from; t <= to + 0.0001; t += step) {
      at(Math.round(t * 100) / 100);
    }
  };
  el.__playing = true;
  return { el, seen, at, watch, media };
}

describe("a11y-media-player learner data", () => {
  it("uses 50% and 95% as the milestones", () => {
    expect(MEDIA_WATCH_HALF).to.equal(0.5);
    expect(MEDIA_WATCH_DONE).to.equal(0.95);
    expect(MEDIA_WATCH_END_MIN).to.equal(0.8);
  });

  const verbs = (seen) => seen.map((d) => d.activityDisplay);
  const last = (seen) => seen[seen.length - 1].statement;

  it("playing straight through at 1x completes with progress 1", async () => {
    const { el, seen, watch, at } = await player(40);
    watch(0, 39.75);
    at(40);
    el._handleMediaEnded();
    expect(verbs(seen)).to.deep.equal(["attempted", "progressed", "completed"]);
    expect(last(seen).result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(1);
    expect(last(seen).result.completion).to.equal(true);
    expect(el.watchedShare).to.equal(1);
    // the halfway statement reports what was actually played then
    expect(
      seen[1].statement.result.extensions[XAPI_MEDIA_PROGRESS],
    ).to.be.within(0.5, 0.53);
  });

  it("playing straight through at 2x completes", async () => {
    const { el, seen, watch } = await player(40);
    // at 2x the media time moves half a second between reports
    watch(0, 40, 0.5);
    el._handleMediaEnded();
    expect(verbs(seen)).to.deep.equal(["attempted", "progressed", "completed"]);
    expect(el.watchedShare).to.equal(1);
  });

  it("counts the final partial second when the end arrives before a report for it", async () => {
    const { el, seen, watch, at } = await player(40.6);
    watch(0, 39.75);
    // ended: the media sits at its full duration
    at(40.6);
    el._handleMediaEnded();
    expect(el.watchedShare).to.equal(1);
    expect(verbs(seen)).to.include("completed");
  });

  it("the media element's ended event completes it", async () => {
    const { el, seen, watch, at, media } = await player(30);
    watch(0, 29.5);
    at(30);
    // fired by the browser when playback reaches the end
    media.dispatchEvent(new Event("ended"));
    await el.updateComplete;
    expect(verbs(seen)).to.deep.equal(["attempted", "progressed", "completed"]);
    expect(last(seen).result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(1);
  });

  it("completes when playback runs into the end with a few seconds unreported", async () => {
    const { el, seen, watch, at } = await player(100);
    watch(0, 30);
    // a background tab or a stall: no reports for a while, then a jump
    // too big to count as watching
    at(40);
    watch(40, 98);
    el._handleMediaEnded();
    expect(el.watchedShare).to.be.below(MEDIA_WATCH_DONE);
    expect(el.watchedShare).to.be.at.least(MEDIA_WATCH_END_MIN);
    expect(verbs(seen)).to.deep.equal(["attempted", "progressed", "completed"]);
    expect(last(seen).result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(1);
  });

  it("pausing part way and playing on still completes", async () => {
    const { el, seen, watch } = await player(60);
    watch(0, 30);
    el.__playing = false;
    watch(30, 30);
    el.__playing = true;
    watch(30, 60);
    el._handleMediaEnded();
    expect(verbs(seen)).to.deep.equal(["attempted", "progressed", "completed"]);
  });

  it("seeking to the end without playing records nothing", async () => {
    const { el, seen, at } = await player(60);
    el.seek(59.5);
    at(59.5);
    at(60);
    el._handleMediaEnded();
    expect(seen.length).to.equal(0);
    expect(el.watchedShare).to.equal(0);
  });

  it("follows YouTube timing: reports stop just before the end and ended may not come", async () => {
    const yt = await fixture(
      html`<a11y-media-player youtube-id="abc123"></a11y-media-player>`,
    );
    await yt.updateComplete;
    await waitUntil(
      () => yt.youtube && yt.youtube.__yt,
      "youtube child player never initialized",
      { interval: 20, timeout: 5000 },
    );
    const fake = yt.youtube.__yt;
    fake.durationVal = 30;
    const seen = [];
    yt.addEventListener("user-engagement", (e) => seen.push(e.detail));
    yt.__playing = true;
    // YouTube reports every 250ms and the last report lands about a second
    // before the end
    for (let t = 0; t <= 29.0001; t += 0.25) {
      fake.time = Math.round(t * 100) / 100;
      yt._trackWatched();
    }
    expect(verbs(seen)).to.deep.equal(["attempted", "progressed", "completed"]);
    expect(last(seen).result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(1);
    yt.__playing = false;
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
    // completed is the whole media: progress 1; duration says what was
    // actually watched when it completed
    expect(done.result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(1);
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
