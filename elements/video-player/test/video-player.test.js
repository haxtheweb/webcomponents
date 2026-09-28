import { fixture, expect, html } from "@open-wc/testing";

import "../video-player.js";

describe("video-player test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <video-player id="example" accent-color="amber" linkable>
        <video>
          <source
            src="https://iandevlin.github.io/mdn/video-player-with-captions/video/sintel-short.mp4"
            type="video/mp4"
          />
        </video>
      </video-player>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("video-player haxProperties", () => {
  it("has haxProperties static getter", () => {
    const ctor = globalThis.customElements.get("video-player");
    const props = ctor.haxProperties;
    expect(props).to.exist;
    expect(props.canScale).to.exist;
    expect(props.gizmo).to.exist;
    expect(props.settings).to.exist;
  });

  it("has demoSchema", () => {
    const ctor = globalThis.customElements.get("video-player");
    const props = ctor.haxProperties;
    expect(props.demoSchema).to.exist;
    expect(props.demoSchema.length).to.be.greaterThan(0);
    expect(props.demoSchema[0].tag).to.equal("video-player");
  });

  it("has saveOptions with unsetAttributes", () => {
    const ctor = globalThis.customElements.get("video-player");
    const props = ctor.haxProperties;
    expect(props.saveOptions).to.exist;
    expect(props.saveOptions.unsetAttributes).to.exist;
  });
});

describe("video-player defaults", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("sets default property values", () => {
    expect(el.crossorigin).to.equal("anonymous");
    expect(el.dark).to.equal(false);
    expect(el.darkTranscript).to.equal(false);
    expect(el.disableInteractive).to.equal(false);
    expect(el.hideTimestamps).to.equal(false);
    expect(el.hideTranscript).to.equal(false);
    expect(el.hideYoutubeLink).to.equal(false);
    expect(el.lang).to.equal("en");
    expect(el.playing).to.equal(false);
    expect(el.allowBackgroundPlay).to.equal(false);
    expect(el.learningMode).to.equal(false);
    expect(el.linkable).to.equal(false);
    expect(el.sources).to.deep.equal([]);
    expect(el.tracks).to.deep.equal([]);
    expect(el.source).to.equal("");
    expect(el.stickyCorner).to.equal("none");
    expect(el.audioDescriptionSource).to.equal("");
    expect(el.audioDescriptionEnabled).to.equal(false);
  });

  it("has correct tag", () => {
    const ctor = globalThis.customElements.get("video-player");
    expect(ctor.tag).to.equal("video-player");
  });
});

describe("video-player _computeMediaType", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("returns audio type for mp3", () => {
    expect(el._computeMediaType("file.mp3")).to.equal("audio/mp3");
  });

  it("returns audio type for wav", () => {
    expect(el._computeMediaType("file.wav")).to.equal("audio/wav");
  });

  it("returns audio type for aac", () => {
    expect(el._computeMediaType("file.aac")).to.equal("audio/aac");
  });

  it("returns audio type for flac", () => {
    expect(el._computeMediaType("file.flac")).to.equal("audio/flac");
  });

  it("returns audio type for oga", () => {
    expect(el._computeMediaType("file.oga")).to.equal("audio/oga");
  });

  it("returns video type for mp4", () => {
    expect(el._computeMediaType("file.mp4")).to.equal("video/mp4");
  });

  it("returns video type for webm", () => {
    expect(el._computeMediaType("file.webm")).to.equal("video/webm");
  });

  it("returns video type for mov", () => {
    expect(el._computeMediaType("file.mov")).to.equal("video/mov");
  });

  it("returns video type for ogv", () => {
    expect(el._computeMediaType("file.ogv")).to.equal("video/ogv");
  });

  it("returns empty for unknown extension", () => {
    expect(el._computeMediaType("file.txt")).to.equal("");
  });

  it("returns empty for null source", () => {
    expect(el._computeMediaType(null)).to.equal("");
  });
});

describe("video-player _computeSRC", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("returns source for null input", () => {
    expect(el._computeSRC(null, null)).to.equal(null);
  });

  it("does not throw for undefined input", () => {
    // Note: typeof source !== undefined is always true (bug in source),
    // so undefined source passes the guard and gets processed by MediaBehaviors
    expect(() => el._computeSRC(undefined, undefined)).to.not.throw();
  });

  it("cleans youtube source and extracts startTime", () => {
    el.source = "https://www.youtube.com/watch?v=abc123&t=30";
    el._computeSRC("https://www.youtube.com/watch?v=abc123&t=30", "youtube");
    // startTime should be set from t= parameter
    expect(el.startTime).to.equal("30");
  });
});

describe("video-player sourceProperties getter", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("returns empty array when no sources", () => {
    el.sources = [];
    el.source = "";
    const result = el.sourceProperties;
    expect(result.length).to.equal(0);
  });

  it("prepends source property to array", () => {
    el.sources = [];
    el.source = "https://example.com/video.mp4";
    const result = el.sourceProperties;
    expect(result.length).to.equal(1);
    expect(result[0].src).to.equal("https://example.com/video.mp4");
  });

  it("parses string sources", () => {
    el.sources = JSON.stringify([{ src: "https://example.com/video.mp4" }]);
    el.source = "";
    const result = el.sourceProperties;
    expect(result.length).to.equal(1);
    expect(result[0].src).to.equal("https://example.com/video.mp4");
  });

  it("includes both source and sources", () => {
    el.sources = [{ src: "https://example.com/alt.webm" }];
    el.source = "https://example.com/main.mp4";
    const result = el.sourceProperties;
    expect(result.length).to.equal(2);
    expect(result[0].src).to.equal("https://example.com/main.mp4");
  });
});

describe("video-player trackProperties getter", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("returns empty array when no tracks", () => {
    el.tracks = [];
    el.track = "";
    const result = el.trackProperties;
    expect(result.length).to.equal(0);
  });

  it("uses single track string as fallback", () => {
    el.tracks = [];
    el.track = "https://example.com/track.vtt";
    const result = el.trackProperties;
    expect(result.length).to.equal(1);
    expect(result[0].src).to.equal("https://example.com/track.vtt");
  });

  it("uses tracks array when provided", () => {
    el.tracks = [{ src: "https://example.com/en.vtt", srclang: "en" }];
    el.track = "https://example.com/old.vtt";
    const result = el.trackProperties;
    expect(result.length).to.equal(1);
    expect(result[0].src).to.equal("https://example.com/en.vtt");
    expect(result[0].srclang).to.equal("en");
    expect(result[0].kind).to.equal("subtitles");
  });

  it("parses string tracks", () => {
    el.tracks = JSON.stringify([{ src: "https://example.com/en.vtt" }]);
    el.track = "";
    const result = el.trackProperties;
    expect(result.length).to.equal(1);
    expect(result[0].src).to.equal("https://example.com/en.vtt");
  });

  it("sets defaults for label and kind", () => {
    el.tracks = [{ src: "https://example.com/en.vtt", srclang: "en" }];
    el.track = "";
    const result = el.trackProperties;
    expect(result[0].kind).to.equal("subtitles");
  });
});

describe("video-player isA11yMedia getter", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("returns true for youtube source type", () => {
    el.sourceType = "youtube";
    expect(el.isA11yMedia).to.equal(true);
  });

  it("returns true for local source type", () => {
    el.sourceType = "local";
    expect(el.isA11yMedia).to.equal(true);
  });

  it("returns true when sourceData is empty", () => {
    el.sourceType = "";
    el.sources = [];
    el.source = "";
    expect(el.isA11yMedia).to.equal(true);
  });

  it("returns false for other source types with data", () => {
    el.sourceType = "vimeo";
    el.sources = [{ src: "https://vimeo.com/123" }];
    el.source = "";
    expect(el.isA11yMedia).to.equal(false);
  });
});

describe("video-player playerId getter", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("returns id-based playerId when id is set", () => {
    el.id = "my-video";
    expect(el.playerId).to.contain("my-video");
    expect(el.playerId).to.contain("-media");
  });

  it("returns schemaResourceID-based playerId when no id", () => {
    el.id = "";
    expect(el.playerId).to.contain("-media");
  });
});

describe("video-player youtubeId getter", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("returns falsy when not youtube type", () => {
    el.sourceType = "";
    expect(!el.youtubeId).to.equal(true);
  });
});

describe("video-player hax hooks", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("haxHooks returns expected hooks", () => {
    const hooks = el.haxHooks();
    expect(hooks.postProcessNodeToContent).to.equal("haxpostProcessNodeToContent");
    expect(hooks.inlineContextMenu).to.equal("haxinlineContextMenu");
    expect(hooks.mediaSourceUpdated).to.equal("haxmediaSourceUpdated");
  });

  it("haxinlineContextMenu adds timecode button", () => {
    const ceMenu = { ceButtons: [] };
    el.haxinlineContextMenu(ceMenu);
    expect(ceMenu.ceButtons.length).to.equal(1);
    expect(ceMenu.ceButtons[0].callback).to.equal("haxClickTimeCode");
  });

  it("haxpostProcessNodeToContent cleans empty sources and tracks", () => {
    let content = '<video-player sources="[]" tracks="[]"></video-player>';
    content = el.haxpostProcessNodeToContent(content);
    expect(content).to.not.contain('sources="[]"');
    expect(content).to.not.contain('tracks="[]"');
  });

  it("haxpostProcessNodeToContent cleans empty sources with comma", () => {
    let content = '<video-player sources="[]",></video-player>';
    content = el.haxpostProcessNodeToContent(content);
    expect(content).to.not.contain('sources="[]"');
  });

  it("haxmediaSourceUpdated returns early for missing path", () => {
    expect(el.haxmediaSourceUpdated(null, {})).to.equal(undefined);
  });

  it("haxmediaSourceUpdated returns early for missing store", () => {
    expect(el.haxmediaSourceUpdated("path", null)).to.equal(undefined);
  });

  it("haxmediaSourceUpdated returns early when store lacks _mediaSrcMatches", () => {
    expect(el.haxmediaSourceUpdated("path", {})).to.equal(undefined);
  });
});

describe("video-player haxClickTimeCode", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("pauses and returns true", () => {
    let pauseCalled = false;
    el.pause = () => {
      pauseCalled = true;
    };
    // currentTime is a getter-only property, so use defineProperty
    Object.defineProperty(el, "currentTime", {
      get() {
        return 42;
      },
      configurable: true,
    });
    const result = el.haxClickTimeCode({});
    expect(pauseCalled).to.equal(true);
    expect(result).to.equal(true);
  });
});

describe("video-player play/pause/seek delegation", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("pause does not throw when no player", () => {
    expect(() => el.pause()).to.not.throw();
  });

  it("play does not throw when no player", () => {
    expect(() => el.play()).to.not.throw();
  });

  it("seek does not throw when no player", () => {
    expect(() => el.seek(30)).to.not.throw();
  });

  it("currentTime returns 0 when no player", () => {
    expect(el.currentTime).to.equal(0);
  });
});

describe("video-player restart", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("restart with startTime calls seek and play", () => {
    let seekValue = null;
    let playCalled = false;
    el.startTime = 10;
    el.seek = (t) => {
      seekValue = t;
    };
    el.play = () => {
      playCalled = true;
    };
    el.pause = () => {};
    el.endTimeTest = () => {};
    el.restart();
    expect(seekValue).to.equal(10);
    expect(playCalled).to.equal(true);
  });

  it("restart without startTime seeks to 0", () => {
    let seekValue = null;
    el.startTime = null;
    el.seek = (t) => {
      seekValue = t;
    };
    el.play = () => {};
    el.pause = () => {};
    el.restart();
    expect(seekValue).to.equal(0);
  });

  it("restartEvent with startTime calls seek and endTimeTest", () => {
    let seekValue = null;
    let endTimeCalled = false;
    el.startTime = 15;
    el.seek = (t) => {
      seekValue = t;
    };
    el.endTimeTest = () => {
      endTimeCalled = true;
    };
    el.restartEvent();
    expect(seekValue).to.equal(15);
    expect(endTimeCalled).to.equal(true);
  });

  it("restartEvent without startTime does nothing", () => {
    let seekCalled = false;
    el.startTime = null;
    el.seek = () => {
      seekCalled = true;
    };
    el.restartEvent();
    expect(seekCalled).to.equal(false);
  });
});

describe("video-player playEvent/pauseEvent", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("playEvent sets playing from event detail", () => {
    el.playEvent({ detail: { __playing: true } });
    expect(el.playing).to.equal(true);
  });

  it("pauseEvent sets playing from event detail", () => {
    el.playing = true;
    el.pauseEvent({ detail: { __playing: false } });
    expect(el.playing).to.equal(false);
  });

  it("playEvent with startTime seeks on first play", () => {
    let seekValue = null;
    let endTimeCalled = false;
    el.startTime = 10;
    el.seek = (t) => {
      seekValue = t;
    };
    el.endTimeTest = () => {
      endTimeCalled = true;
    };
    el.playEvent({ detail: { __playing: true } });
    expect(seekValue).to.equal(10);
    expect(endTimeCalled).to.equal(true);
    expect(el.__hasPlayed).to.equal(true);
  });

  it("playEvent does not seek on second play", () => {
    let seekCalled = false;
    el.startTime = 10;
    el.__hasPlayed = true;
    el.seek = () => {
      seekCalled = true;
    };
    el.playEvent({ detail: { __playing: true } });
    expect(seekCalled).to.equal(false);
  });
});

describe("video-player setSourceData", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("toggles source to trigger update", () => {
    el.source = "https://example.com/video.mp4";
    el.setSourceData();
    expect(el.source).to.equal("https://example.com/video.mp4");
  });
});

describe("video-player audio description preference", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  afterEach(() => {
    globalThis.localStorage.clear();
  });

  it("_loadAudioDescriptionPreference reads from localStorage", () => {
    el.source = "https://example.com/video.mp4";
    el.audioDescriptionSource = "https://example.com/audio.mp3";
    globalThis.localStorage.setItem(
      "video-player-ad-https://example.com/video.mp4",
      "true",
    );
    el._loadAudioDescriptionPreference();
    expect(el.audioDescriptionEnabled).to.equal(true);
  });

  it("_saveAudioDescriptionPreference writes to localStorage", () => {
    el.source = "https://example.com/video.mp4";
    el.audioDescriptionSource = "https://example.com/audio.mp3";
    el.audioDescriptionEnabled = true;
    el._saveAudioDescriptionPreference();
    const stored = globalThis.localStorage.getItem(
      "video-player-ad-https://example.com/video.mp4",
    );
    expect(stored).to.equal("true");
  });

  it("_saveAudioDescriptionPreference coerces null to false", () => {
    el.source = "https://example.com/video.mp4";
    el.audioDescriptionSource = "https://example.com/audio.mp3";
    el.audioDescriptionEnabled = null;
    el._saveAudioDescriptionPreference();
    const stored = globalThis.localStorage.getItem(
      "video-player-ad-https://example.com/video.mp4",
    );
    expect(stored).to.equal("false");
  });

  it("toggleAudioDescription toggles and saves", () => {
    el.source = "https://example.com/video.mp4";
    el.audioDescriptionSource = "https://example.com/audio.mp3";
    el.audioDescriptionEnabled = false;
    el.toggleAudioDescription();
    expect(el.audioDescriptionEnabled).to.equal(true);
    const stored = globalThis.localStorage.getItem(
      "video-player-ad-https://example.com/video.mp4",
    );
    expect(stored).to.equal("true");
  });

  it("_handleAudioDescriptionToggle sets enabled from event", () => {
    el.source = "https://example.com/video.mp4";
    el.audioDescriptionSource = "https://example.com/audio.mp3";
    el._handleAudioDescriptionToggle({ detail: { audioDescriptionEnabled: true } });
    expect(el.audioDescriptionEnabled).to.equal(true);
  });
});

describe("video-player html5 getter", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("returns html template", () => {
    el.sources = [{ src: "https://example.com/video.mp4", type: "video/mp4" }];
    el.source = "";
    const result = el.html5;
    expect(result).to.exist;
  });
});

describe("video-player querySelectorAll SSR stub", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(html`<video-player></video-player>`);
  });

  it("returns empty array", () => {
    const result = el.querySelectorAll("video");
    expect(result).to.deep.equal([]);
  });
});
