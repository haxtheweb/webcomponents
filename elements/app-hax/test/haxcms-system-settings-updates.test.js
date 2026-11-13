import { expect } from "@open-wc/testing";
import "../lib/v2/admin/haxcms-system-settings.js";

// Status ▸ Updates (https://github.com/haxtheweb/issues/issues/1768): the
// panel reads the status report's `update` object, keeps the server's
// verdict in the version row, and shows update steps for this install.
const advisory = {
  id: "GHSA-6w22-ghxf-x2pv",
  cve: "",
  severity: "high",
  summary: "Example",
  url: "https://github.com/haxtheweb/issues/security/advisories/GHSA-6w22-ghxf-x2pv",
  patched: "26.8.2",
};

function report(overrides = {}) {
  return Object.assign(
    {
      checkEnabled: true,
      managed: false,
      current: "26.8.1",
      latest: "26.9.0",
      releasedAt: "2026-11-10T15:00:00Z",
      releaseUrl: "https://github.com/haxtheweb/haxcms-php/releases/tag/26.9.0",
      updateAvailable: true,
      security: true,
      advisories: [advisory],
      installMethod: "php-archive",
      assets: [
        {
          name: "haxcms-php-26.9.0.zip",
          url: "https://github.com/haxtheweb/haxcms-php/releases/download/26.9.0/haxcms-php-26.9.0.zip",
        },
        {
          name: "SHA256SUMS",
          url: "https://github.com/haxtheweb/haxcms-php/releases/download/26.9.0/SHA256SUMS",
        },
      ],
    },
    overrides,
  );
}

describe("haxcms-system-settings Status ▸ Updates", () => {
  let el;

  beforeEach(() => {
    el = document.createElement("haxcms-system-settings");
  });

  it("drops links outside github.com/haxtheweb and unknown install methods", () => {
    const update = el._normalizeStatusUpdate(
      report({
        releaseUrl: "https://evil.example/release",
        installMethod: "curl-pipe-bash",
        advisories: [
          Object.assign({}, advisory, { url: "https://evil.example/a" }),
        ],
        assets: [{ name: "x.zip", url: "https://evil.example/x.zip" }],
      }),
    );
    expect(update.releaseUrl).to.equal("");
    expect(update.installMethod).to.equal("unknown");
    expect(update.advisories[0].url).to.equal("");
    expect(update.assets).to.deep.equal([]);
    expect(el._normalizeStatusUpdate(null)).to.equal(null);
  });

  it("keeps the server's security verdict in the version row", () => {
    const update = el._normalizeStatusUpdate(report());
    const payload = el._ensureVersionStatusRow(
      [{ key: "haxcms-version", tone: "warning", title: "v", value: "x" }],
      { haxcmsVersionCurrent: "26.8.1", haxcmsVersionLatest: "26.9.0" },
      "HAXcms version",
      "",
      update,
    );
    const row = payload.rows[0];
    expect(row.tone).to.equal("error");
    expect(row.links[0].label).to.equal("GHSA-6w22-ghxf-x2pv (high)");
  });

  it("says why no check ran on managed or checks-off installs", () => {
    const summary = {
      haxcmsVersionCurrent: "26.8.1",
      haxcmsVersionLatest: "26.8.1",
    };
    const managed = el._ensureVersionStatusRow(
      [],
      summary,
      "HAXcms version",
      "",
      el._normalizeStatusUpdate(report({ managed: true, checkEnabled: false })),
    ).rows[0];
    expect(managed.tone).to.equal("info");
    expect(managed.description).to.equal(el.t.updatesManagedByHost);
    const off = el._ensureVersionStatusRow(
      [],
      summary,
      "HAXcms version",
      "",
      el._normalizeStatusUpdate(report({ checkEnabled: false })),
    ).rows[0];
    expect(off.description).to.equal(el.t.updateChecksOff);
  });

  it("builds commands only from a release version", () => {
    const git = el._updateSteps(
      el._normalizeStatusUpdate(report({ installMethod: "php-git" })),
    );
    expect(git[1].command).to.equal("git fetch --tags && git checkout 26.9.0");
    const injected = el._updateSteps(
      el._normalizeStatusUpdate(
        report({ installMethod: "php-git", latest: "26.9.0; rm -rf /" }),
      ),
    );
    expect(injected[1].command).to.equal("");
    const npm = el._updateSteps(
      el._normalizeStatusUpdate(report({ installMethod: "node-npm" })),
    );
    expect(npm[0].command).to.equal("hax update");
    expect(npm[1].command).to.equal(
      "npm install --global @haxtheweb/haxcms-nodejs@26.9.0",
    );
  });

  it("offers the release zip and checksums for PHP archive installs", () => {
    const links = el._updateDownloads(el._normalizeStatusUpdate(report()));
    expect(links.map((l) => l.label)).to.deep.equal([
      el.t.downloadZip,
      el.t.downloadChecksums,
    ]);
    const fallback = el._updateDownloads(
      el._normalizeStatusUpdate(report({ assets: [] })),
    );
    expect(fallback[0].url).to.equal(
      "https://github.com/haxtheweb/haxcms-php/archive/refs/tags/26.9.0.zip",
    );
    expect(
      el._updateDownloads(
        el._normalizeStatusUpdate(report({ installMethod: "php-git" })),
      ),
    ).to.deep.equal([]);
  });

  it("renders the Updates card with advisories and steps", async () => {
    document.body.appendChild(el);
    el.statusUpdate = el._normalizeStatusUpdate(report());
    el.statusSummary = {
      haxcmsVersionCurrent: "26.8.1",
      haxcmsVersionLatest: "26.9.0",
    };
    await el.updateComplete;
    const card = el.shadowRoot.querySelector(".update-card");
    expect(card).to.not.equal(null);
    expect(
      card.querySelector(".update-security a").getAttribute("href"),
    ).to.equal(advisory.url);
    expect(card.querySelectorAll(".update-steps li").length).to.equal(3);
    el.statusUpdate = el._normalizeStatusUpdate(
      report({ updateAvailable: false, security: false, advisories: [] }),
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector(".update-card")).to.equal(null);
    el.remove();
  });

  it("notes an update once per browser", () => {
    try {
      globalThis.localStorage.setItem(
        "haxcms-system-settings-last-version",
        "26.8.1",
      );
    } catch {
      return;
    }
    el._checkUpdatedNotice("26.9.0");
    expect(el._updatedNotice).to.equal("26.9.0");
    const next = document.createElement("haxcms-system-settings");
    next._checkUpdatedNotice("26.9.0");
    expect(next._updatedNotice).to.equal("");
    globalThis.localStorage.removeItem("haxcms-system-settings-last-version");
  });
});
