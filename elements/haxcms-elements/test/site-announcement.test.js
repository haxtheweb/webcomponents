import { expect, oneEvent } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/ui-components/site/site-announcement.js";
import "../lib/core/haxcms-appearance-admin-dialog.js";

function manifestWith(announcement) {
  const theme = { element: "clean-one", variables: {}, regions: {} };
  if (announcement) {
    theme.announcement = announcement;
  }
  return {
    id: "ann-site",
    title: "Announcement Site",
    metadata: {
      site: { name: "ann-site", lang: "en" },
      platform: {},
      theme: theme,
    },
    items: [],
  };
}

const SAMPLE = {
  title: "Spring sections open Monday.",
  text: "Registration closes January 9.",
  link: "https://example.com/dates",
  linkText: "See dates",
  variant: "warning",
  ends: "",
};

async function announcement(value) {
  store.manifest = manifestWith(value);
  // appended directly: fixture() waits for a frame, and frames stall in a
  // tab that is not showing when several test files run at once
  const el = document.createElement("site-announcement");
  globalThis.document.body.appendChild(el);
  await el.updateComplete;
  await el.updateComplete;
  return el;
}

describe("site-announcement", () => {
  let savedManifest;
  beforeEach(() => {
    savedManifest = store.manifest;
    try {
      globalThis.localStorage.removeItem(
        "haxcms-announcement-dismissed:ann-site",
      );
    } catch {
      // storage may be unavailable
    }
  });
  afterEach(() => {
    globalThis.document
      .querySelectorAll("site-announcement")
      .forEach((el) => el.remove());
    store.manifest = savedManifest;
  });

  it("shows the headline, text and link from site settings", async () => {
    const el = await announcement(SAMPLE);
    const bar = el.shadowRoot.querySelector(".bar");
    expect(bar).to.exist;
    expect(bar.getAttribute("role")).to.equal("region");
    expect(el.shadowRoot.querySelector("strong").textContent).to.equal(
      SAMPLE.title,
    );
    expect(bar.textContent).to.contain(SAMPLE.text);
    const link = el.shadowRoot.querySelector("a");
    expect(link.getAttribute("href")).to.equal(SAMPLE.link);
    expect(link.textContent).to.equal("See dates");
    expect(el.getAttribute("variant")).to.equal("warning");
    await expect(el).shadowDom.to.be.accessible();
  });

  it("shows nothing when the site has no announcement", async () => {
    const el = await announcement(null);
    expect(el.hidden).to.equal(true);
    expect(el.shadowRoot.querySelector(".bar")).to.equal(null);
  });

  it("stops showing after its end date, and shows through the end day", async () => {
    const past = await announcement({ ...SAMPLE, ends: "2020-01-01" });
    expect(past.hidden).to.equal(true);
    past.remove();
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const current = await announcement({ ...SAMPLE, ends: today });
    expect(current.hidden).to.equal(false);
  });

  it("never links to script", async () => {
    const el = await announcement({ ...SAMPLE, link: "javascript:alert(1)" });
    expect(el.shadowRoot.querySelector("a")).to.equal(null);
    expect(el._safeLink("/x/pages/dates")).to.equal("/x/pages/dates");
    expect(el._safeLink("mailto:a@example.com")).to.equal(
      "mailto:a@example.com",
    );
    expect(el._safeLink("data:text/html,hi")).to.equal("");
  });

  it("remembers a dismissal for this announcement only", async () => {
    const el = await announcement(SAMPLE);
    el.shadowRoot.querySelector("button").click();
    await el.updateComplete;
    expect(el.dismissed).to.equal(true);
    expect(el.shadowRoot.querySelector(".bar")).to.equal(null);
    el.remove();
    const again = await announcement(SAMPLE);
    expect(again.dismissed).to.equal(true);
    again.remove();
    // a new announcement shows even after the old one was dismissed
    const changed = await announcement({ ...SAMPLE, text: "Now January 16." });
    expect(changed.dismissed).to.equal(false);
    expect(changed.shadowRoot.querySelector(".bar")).to.exist;
  });

  it("tells fixed theme chrome how much of it is in view", async () => {
    const el = await announcement(SAMPLE);
    const root = globalThis.document.documentElement;
    expect(
      root.style.getPropertyValue("--haxcms-site-announcement-height"),
    ).to.equal(`${el.offsetHeight}px`);
    el.remove();
    expect(
      root.style.getPropertyValue("--haxcms-site-announcement-height"),
    ).to.equal("");
  });
});

describe("announcement in appearance settings", () => {
  let savedManifest;
  let savedSound;
  beforeEach(() => {
    savedManifest = store.manifest;
    savedSound = store.playSound;
    store.playSound = () => {};
  });
  afterEach(() => {
    globalThis.document
      .querySelectorAll("haxcms-appearance-admin-dialog")
      .forEach((el) => el.remove());
    store.manifest = savedManifest;
    store.playSound = savedSound;
  });

  async function settings(value) {
    store.manifest = manifestWith(value);
    const el = document.createElement("haxcms-appearance-admin-dialog");
    el.inShell = true;
    globalThis.document.body.appendChild(el);
    await new Promise((r) => setTimeout(r, 10));
    await el.updateComplete;
    return el;
  }

  function fieldsFor(el, key) {
    return [...el.shadowRoot.querySelectorAll("simple-fields")].find(
      (sf) => sf.value && Object.prototype.hasOwnProperty.call(sf.value, key),
    );
  }

  it("loads the saved announcement into its own group", async () => {
    const el = await settings(SAMPLE);
    expect(el.shadowRoot.querySelector('details[data-group="announcement"]')).to
      .exist;
    expect(
      fieldsFor(el, "manifest-metadata-theme-announcement-title").value[
        "manifest-metadata-theme-announcement-title"
      ],
    ).to.equal(SAMPLE.title);
    expect(
      fieldsFor(el, "manifest-metadata-theme-announcement-variant").value[
        "manifest-metadata-theme-announcement-variant"
      ],
    ).to.equal("warning");
  });

  it("sends only the announcement fields that were edited", async () => {
    const el = await settings(SAMPLE);
    const key = "manifest-metadata-theme-announcement-text";
    const sf = fieldsFor(el, key);
    sf.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: { value: { ...sf.value, [key]: "Now January 16." } },
      }),
    );
    setTimeout(() => el.save());
    const e = await oneEvent(globalThis, "haxcms-save-appearance-settings");
    const sent = Object.keys(e.detail.manifest.theme).filter(
      (k) => k.indexOf("manifest-metadata-theme-announcement-") === 0,
    );
    expect(sent).to.deep.equal([key]);
    expect(e.detail.manifest.theme[key]).to.equal("Now January 16.");
  });
});
