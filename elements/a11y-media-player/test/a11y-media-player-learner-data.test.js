import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import "../a11y-media-player.js";
import {
  MEDIA_MILESTONES,
  MEDIA_QUARTER_HIT,
  MEDIA_RESUME_MIN,
  MEDIA_STATE_STEP,
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

// every milestone, once: start, the three quarters, done
const FULL = [
  "attempted",
  "progressed",
  "progressed",
  "progressed",
  "completed",
];

describe("a11y-media-player learner data", () => {
  it("uses quarters, 90% of each watched, as the milestones", () => {
    expect(MEDIA_QUARTER_HIT).to.equal(0.9);
    expect(MEDIA_MILESTONES).to.deep.equal([0.25, 0.5, 0.75]);
    expect(MEDIA_STATE_STEP).to.equal(0.1);
    expect(MEDIA_RESUME_MIN).to.equal(10);
  });

  const verbs = (seen) => seen.map((d) => d.activityDisplay);
  const last = (seen) => seen[seen.length - 1].statement;
  const progressOf = (d) => d.statement.result.extensions[XAPI_MEDIA_PROGRESS];

  it("playing straight through at 1x completes with progress 1", async () => {
    const { el, seen, watch, at } = await player(40);
    watch(0, 39.75);
    at(40);
    el._handleMediaEnded();
    expect(verbs(seen)).to.deep.equal(FULL);
    expect(last(seen).result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(1);
    expect(last(seen).result.completion).to.equal(true);
    expect(el.watchedShare).to.equal(1);
    // each progressed statement is one quarter milestone
    expect(seen.slice(1, 4).map(progressOf)).to.deep.equal([0.25, 0.5, 0.75]);
  });

  it("playing straight through at 2x completes", async () => {
    const { el, seen, watch } = await player(40);
    // at 2x the media time moves half a second between reports
    watch(0, 40, 0.5);
    el._handleMediaEnded();
    expect(verbs(seen)).to.deep.equal(FULL);
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
    expect(verbs(seen)).to.deep.equal(FULL);
    expect(last(seen).result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(1);
  });

  it("completes when a few seconds of a quarter went unreported", async () => {
    const { el, seen, watch, at } = await player(200);
    watch(0, 60);
    // a background tab or a stall: no reports for a few seconds, then a
    // jump too big to count as watching (4 of the 50 seconds in the quarter)
    at(65);
    watch(65, 198);
    el._handleMediaEnded();
    expect(el.watchedQuarters).to.deep.equal([true, true, true, true]);
    expect(verbs(seen)).to.deep.equal(FULL);
    expect(last(seen).result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(1);
  });

  it("a bigger unreported stretch leaves its quarter, and the rest, unsent", async () => {
    const { el, seen, watch, at } = await player(200);
    watch(0, 60);
    at(80);
    watch(80, 199);
    el._handleMediaEnded();
    expect(el.watchedQuarters[1]).to.equal(false);
    // the later quarters were watched, but milestones go in order
    expect(verbs(seen)).to.deep.equal(["attempted", "progressed"]);
    expect(progressOf(seen[1])).to.equal(0.25);
  });

  it("pausing part way and playing on still completes", async () => {
    const { el, seen, watch } = await player(60);
    watch(0, 30);
    el.__playing = false;
    watch(30, 30);
    el.__playing = true;
    watch(30, 60);
    el._handleMediaEnded();
    expect(verbs(seen)).to.deep.equal(FULL);
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

  it("a pause at the very end counts as reaching the end", async () => {
    const { el, seen, watch, at, media } = await player(60);
    watch(0, 52);
    // stopped within the last second, no ended event
    at(59.4);
    el.__playing = false;
    media.dispatchEvent(new Event("pause"));
    expect(verbs(seen)).to.deep.equal(FULL);
  });

  it("a pause earlier than the last second is not the end", async () => {
    const { el, seen, watch, media } = await player(60);
    watch(0, 52);
    el.__playing = false;
    media.dispatchEvent(new Event("pause"));
    expect(verbs(seen)).to.deep.equal([
      "attempted",
      "progressed",
      "progressed",
      "progressed",
    ]);
  });

  it("the player's ended event stands in for the last quarter", async () => {
    const { el, seen, watch } = await player(100);
    watch(0, 76);
    // the last quarter barely played, then the player reports its end
    el._handleMediaEnded();
    expect(el.watchedQuarters[3]).to.equal(false);
    expect(verbs(seen)).to.deep.equal(FULL);
  });

  it("the player's ended event does not complete when an earlier quarter was skipped", async () => {
    const { el, seen, watch } = await player(100);
    watch(0, 40);
    watch(70, 98);
    el._handleMediaEnded();
    expect(verbs(seen)).to.deep.equal(["attempted", "progressed"]);
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
    expect(verbs(seen)).to.deep.equal(FULL);
    expect(last(seen).result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(1);
    yt.__playing = false;
  });

  it("sends start, each quarter and completed once each while watching", async () => {
    const { el, seen, watch } = await player(100);
    watch(0, 99.5);
    // watching again does not resend anything
    watch(0, 99.5);
    el._handleMediaEnded();
    expect(verbs(seen)).to.deep.equal(FULL);
    const statements = seen.map((d) => d.statement);
    const start = statements[0];
    const half = statements[2];
    const done = statements[4];
    expect(start.verb.id).to.equal(XAPI_VERBS.attempted);
    expect(start.result).to.equal(undefined);
    expect(half.verb.id).to.equal(XAPI_VERBS.progressed);
    expect(half.result.completion).to.equal(false);
    expect(half.result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(0.5);
    expect(done.verb.id).to.equal(XAPI_VERBS.completed);
    expect(done.result.completion).to.equal(true);
    // completed is the whole media: progress 1; duration says what was
    // actually watched when it completed (90% of the last quarter)
    expect(done.result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(1);
    expect(done.result.duration).to.equal("PT98S");
    expect(done.object.id.endsWith("#clip")).to.equal(true);
    expect(done.object.definition.type).to.equal(
      "http://adlnet.gov/expapi/activities/media",
    );
    expect(seen[4].resultCompletion).to.equal(true);
  });

  it("completes once 90% of the last quarter played, so a missed final report still counts", async () => {
    const { seen, watch } = await player(60);
    // YouTube can stop reporting a moment before the very end
    watch(0, 58.25);
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
    expect(el.watchedShare).to.be.below(0.25);
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

describe("a11y-media-player learner data on the YouTube path", () => {
  // the stubbed IFrame API: time moves when the test says, state changes go
  // through the player's own onStateChange listener
  async function ytPlayer(duration) {
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
    fake.durationVal = duration;
    // the YouTube wrapper only plays once the player reports ready
    yt.youtube.__video = fake;
    const seen = [];
    yt.addEventListener("user-engagement", (e) => seen.push(e.detail));
    const state = (data) =>
      (fake.listeners.onStateChange || []).forEach((cb) => cb({ data }));
    return { yt, fake, seen, state };
  }
  const verbsOf = (seen) => seen.map((d) => d.activityDisplay);

  it("tracks watched time from the YouTube wrapper's own time reports", async () => {
    const { yt, fake, state } = await ytPlayer(8);
    yt.play();
    state(1);
    // advance the YouTube clock; the wrapper polls it every 250ms and
    // reports timeupdate to the player
    for (let t = 0.5; t <= 4; t += 0.5) {
      fake.time = t;
      await sleep(260);
    }
    expect(yt.__watched.size).to.be.at.least(4);
    yt.pause();
    state(2);
  });

  it("YouTube ENDED (state 0) completes a watched video", async () => {
    const { yt, fake, seen, state } = await ytPlayer(8);
    yt.play();
    state(1);
    for (let t = 0.5; t <= 6; t += 0.5) {
      fake.time = t;
      await sleep(260);
    }
    // reports stop before the last stretch: nothing completes from them
    expect(verbsOf(seen)).to.not.include("completed");
    // then YouTube reports ENDED
    fake.time = 8;
    fake.state = 0;
    state(0);
    await yt.updateComplete;
    expect(verbsOf(seen)).to.deep.equal(FULL);
    const done = seen[seen.length - 1].statement;
    expect(done.result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(1);
  });

  it("YouTube paused at the very end (state 2) completes too", async () => {
    const { yt, fake, seen, state } = await ytPlayer(8);
    yt.play();
    state(1);
    for (let t = 0.5; t <= 6; t += 0.5) {
      fake.time = t;
      await sleep(260);
    }
    expect(verbsOf(seen)).to.not.include("completed");
    fake.time = 7.6;
    fake.state = 2;
    yt.__playing = false;
    state(2);
    expect(verbsOf(seen)).to.include("completed");
  });

  it("YouTube seek to the end then ENDED records nothing", async () => {
    const { yt, fake, seen, state } = await ytPlayer(60);
    yt.seek(59.5);
    fake.time = 59.5;
    yt.__playing = true;
    yt._trackWatched();
    fake.time = 60;
    fake.state = 0;
    state(0);
    expect(verbsOf(seen)).to.not.include("completed");
    expect(verbsOf(seen)).to.not.include("progressed");
    yt.__playing = false;
  });
});

describe("a11y-media-player learner profile (state and resume)", () => {
  // stands in for the HAXcms learner progress bridge: answers
  // learner-progress-request with `record` and collects the state updates
  let record = null;
  let updates = [];
  const onRequest = (e) => {
    e.detail.record = record;
  };
  const onUpdate = (e) => updates.push(e.detail);
  beforeEach(() => {
    record = null;
    updates = [];
    globalThis.addEventListener("learner-progress-request", onRequest);
    globalThis.addEventListener("learner-progress-update", onUpdate);
  });
  afterEach(() => {
    globalThis.removeEventListener("learner-progress-request", onRequest);
    globalThis.removeEventListener("learner-progress-update", onUpdate);
  });
  const verbs = (seen) => seen.map((d) => d.activityDisplay);
  // the duration is known: the player reads the learner's record
  async function loaded(duration = 100) {
    const p = await player(duration);
    p.el._handleMediaLoaded();
    return p;
  }

  it("saves where the learner is each tenth covered, without a statement", async () => {
    const { el, seen, watch } = await loaded(100);
    watch(0, 25);
    expect(verbs(seen)).to.deep.equal(["attempted", "progressed"]);
    // 10% and 20% covered
    expect(updates.length).to.equal(2);
    const last = updates[updates.length - 1];
    expect(last.activityId).to.equal(seen[0].statement.object.id);
    expect(last.tag).to.equal("a11y-media-player");
    expect(last.state.covered).to.deep.equal([[0, 19]]);
    expect(last.state.progress).to.equal(0.2);
    expect(el.coveredRanges).to.deep.equal([[0, 25]]);
  });

  it("saves the resume point when paused", async () => {
    const { el, watch, media } = await loaded(100);
    watch(0, 33);
    el.__playing = false;
    media.dispatchEvent(new Event("pause"));
    const last = updates[updates.length - 1];
    expect(last.state.resume).to.equal(33);
    expect(last.state.covered).to.deep.equal([[0, 33]]);
  });

  it("resumes where the learner stopped and keeps what they watched", async () => {
    record = {
      verbs: { attempted: 1, progressed: 1 },
      milestones: ["attempted", "progressed@0.25"],
      state: { covered: [[0, 30]], resume: 31.5 },
    };
    const { el, seen, watch, media } = await loaded(100);
    expect(media.currentTime).to.equal(31.5);
    expect(el.watchedShare).to.equal(0.31);
    // the seek settled
    el.__seeking = false;
    // nothing already sent is sent again; the next quarter is
    watch(31.5, 52);
    expect(verbs(seen)).to.deep.equal(["progressed"]);
    expect(seen[0].statement.result.extensions[XAPI_MEDIA_PROGRESS]).to.equal(
      0.5,
    );
  });

  it("starts at the start when the learner barely began", async () => {
    record = {
      verbs: { attempted: 1 },
      milestones: ["attempted"],
      state: { covered: [[0, 5]], resume: 5 },
    };
    const { media } = await loaded(100);
    expect(media.currentTime).to.equal(0);
  });

  it("media finished before sends and saves nothing when watched again", async () => {
    record = {
      done: true,
      verbs: { attempted: 1, progressed: 3, completed: 1 },
      milestones: [
        "attempted",
        "progressed@0.25",
        "progressed@0.5",
        "progressed@0.75",
        "completed",
      ],
      state: { covered: [[0, 99]], resume: 0 },
    };
    const { el, seen, watch, media } = await loaded(100);
    watch(0, 99.75);
    el._handleMediaEnded();
    el.__playing = false;
    media.dispatchEvent(new Event("pause"));
    expect(seen.length).to.equal(0);
    expect(updates.length).to.equal(0);
  });

  it("a learner who cleared their progress starts over", async () => {
    record = {
      verbs: { attempted: 1 },
      milestones: ["attempted", "progressed@0.25"],
      state: { covered: [[0, 30]], resume: 31 },
    };
    const { el, seen, watch, at } = await loaded(100);
    globalThis.dispatchEvent(new CustomEvent("learner-progress-cleared"));
    expect(el.watchedShare).to.equal(0);
    el.__seeking = false;
    at(0);
    watch(0, 30);
    expect(verbs(seen)).to.deep.equal(["attempted", "progressed"]);
  });

  it("reads, resumes and saves nothing while the page is edited", async () => {
    const hs = globalThis.HaxStore;
    globalThis.HaxStore = { instance: { editMode: true } };
    try {
      record = {
        verbs: { attempted: 1 },
        milestones: ["attempted"],
        state: { covered: [[0, 40]], resume: 40 },
      };
      const { el, media, watch } = await loaded(100);
      expect(media.currentTime).to.equal(0);
      watch(0, 30);
      el._saveLearnerState();
      expect(updates.length).to.equal(0);
    } finally {
      globalThis.HaxStore = hs;
    }
  });
});
