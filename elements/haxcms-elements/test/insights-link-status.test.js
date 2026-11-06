import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import {
  LINK_CHECK_BATCH,
  LINK_CHECK_OPERATION,
  _resetLinkStatus,
  checkLinks,
  getLinkStatus,
  linkStatusSummary,
} from "../lib/core/insights/insights-link-status.js";
import "../lib/core/insights/sections/insights-links.js";
import "../lib/core/insights/sections/insights-overview.js";
import {
  loadSpec,
  loadFixtureSite,
  loadExtras,
  RESULT_OPTIONS,
} from "./insights-fixture-helpers.js";

// Outside link status (haxtheweb/issues#3167): the site's own backend
// answers POST x/api/v1/site/check-links. The registry is stubbed so the
// operation looks registered and each call is answered from `answer`.
let results;
let calls;
let answer;
let realHas;
let realCall;

function stubRegistry() {
  realHas = MicroFrontendRegistry.has;
  realCall = MicroFrontendRegistry.call;
  MicroFrontendRegistry.has = (name) =>
    name === LINK_CHECK_OPERATION
      ? true
      : realHas.call(MicroFrontendRegistry, name);
  MicroFrontendRegistry.call = async (name, params) => {
    calls.push({ name: name, links: params.links.slice() });
    return answer(params.links, calls.length);
  };
}

function restoreRegistry() {
  MicroFrontendRegistry.has = realHas;
  MicroFrontendRegistry.call = realCall;
}

function okAll(links) {
  return {
    status: 200,
    data: {
      results: links.map((href) => ({
        href: href,
        state: href.indexOf("canvas") !== -1 ? "broken" : "ok",
        reason: href.indexOf("canvas") !== -1 ? "http" : "",
        status: href.indexOf("canvas") !== -1 ? 404 : 200,
        finalUrl: "",
        cached: false,
      })),
    },
  };
}

before(async () => {
  const spec = await loadSpec();
  const site = await loadFixtureSite();
  results = analyzeSite(
    site.pages,
    site.manifest,
    spec,
    Object.assign({ extras: await loadExtras() }, RESULT_OPTIONS),
  );
});

beforeEach(() => {
  calls = [];
  answer = okAll;
  _resetLinkStatus();
  stubRegistry();
});

afterEach(() => {
  restoreRegistry();
  _resetLinkStatus();
});

describe("insights-link-status", () => {
  it("sends links in batches of LINK_CHECK_BATCH and keeps the answers", async () => {
    const hrefs = [];
    for (let i = 0; i < LINK_CHECK_BATCH + 5; i++) {
      hrefs.push(`https://example.org/${i}`);
    }
    const outcome = await checkLinks(hrefs);
    expect(calls.map((c) => c.links.length)).to.deep.equal([
      LINK_CHECK_BATCH,
      5,
    ]);
    expect(outcome.done).to.equal(LINK_CHECK_BATCH + 5);
    expect(getLinkStatus("https://example.org/3").state).to.equal("ok");
    expect(linkStatusSummary(hrefs).ok).to.equal(LINK_CHECK_BATCH + 5);
  });

  it("does not re-check answered links unless forced", async () => {
    await checkLinks(["https://example.org/a"]);
    await checkLinks(["https://example.org/a"]);
    expect(calls.length).to.equal(1);
    await checkLinks(["https://example.org/a"], { force: true });
    expect(calls.length).to.equal(2);
  });

  it("sends deferred links again", async () => {
    answer = (links, n) =>
      n === 1
        ? {
            status: 200,
            data: {
              results: links.map((href) => ({
                href: href,
                state: "skipped",
                reason: "deferred",
                status: null,
              })),
            },
          }
        : okAll(links);
    const outcome = await checkLinks(["https://example.org/slow"]);
    expect(calls.length).to.equal(2);
    expect(outcome.done).to.equal(1);
    expect(getLinkStatus("https://example.org/slow").state).to.equal("ok");
  });

  it("stops at a rate limit and reports the server's message", async () => {
    answer = () => ({
      status: 429,
      body: {
        status: 429,
        data: {
          message:
            "Link check limit reached: 1 checks per 15 minutes for this site. You can retry in 3 minutes.",
          code: "LINK_CHECK_RATE_LIMITED",
          params: { retryAfter: "3 minutes" },
          retryAfterSeconds: 170,
        },
      },
    });
    const hrefs = [];
    for (let i = 0; i < LINK_CHECK_BATCH * 2; i++) {
      hrefs.push(`https://example.org/${i}`);
    }
    const outcome = await checkLinks(hrefs);
    expect(calls.length).to.equal(1);
    expect(outcome.status).to.equal(429);
    expect(outcome.retryAfterSeconds).to.equal(170);
    expect(outcome.error).to.contain("3 minutes");
  });
});

describe("insights-links with a backend that checks links", () => {
  it("checks outside links and lists the ones to fix", async () => {
    const el = await fixture(
      html`<insights-links .results="${results}"></insights-links>`,
    );
    await waitUntil(() =>
      el.shadowRoot.querySelector(
        ".link-status .check-outside:not([aria-disabled])",
      ),
    );
    const kpi = el.shadowRoot.querySelector(".kpis");
    expect(kpi.textContent).to.contain("Not checked yet");
    el.shadowRoot.querySelector(".check-outside").click();
    await waitUntil(() => el.shadowRoot.querySelector("table.problems"));
    expect(calls.length).to.equal(1);
    expect(calls[0].links.sort()).to.deep.equal(
      results.links.outsideLinks.urls.map((u) => u.href).sort(),
    );
    const rows = el.shadowRoot.querySelectorAll("table.problems tbody tr");
    expect(rows.length).to.equal(1);
    expect(rows[0].dataset.state).to.equal("broken");
    expect(rows[0].textContent).to.contain("http://canvas.psu.edu/");
    expect(rows[0].textContent).to.contain("HTTP 404");
    expect(rows[0].querySelector(".open-page")).to.exist;
    const broken = el.shadowRoot.querySelector(".broken-kpi");
    expect(broken.dataset.tone).to.equal("danger");
    expect(broken.querySelector(".v").textContent.trim()).to.equal("1");
    expect(
      el.shadowRoot.querySelector(".check-outside").textContent,
    ).to.contain("Check again");
  });

  it("shows the rate limit message as an alert", async () => {
    answer = () => ({
      status: 429,
      body: {
        status: 429,
        data: {
          message:
            "Link check limit reached: 1 checks per 15 minutes for this site. You can retry in 3 minutes.",
        },
      },
    });
    const el = await fixture(
      html`<insights-links .results="${results}"></insights-links>`,
    );
    await waitUntil(() =>
      el.shadowRoot.querySelector(".link-status .check-outside"),
    );
    el.shadowRoot.querySelector(".check-outside").click();
    await waitUntil(() => el.shadowRoot.querySelector(".check-error"));
    const alert = el.shadowRoot.querySelector(".check-error");
    expect(alert.getAttribute("role")).to.equal("alert");
    expect(alert.textContent).to.contain("3 minutes");
  });
});

describe("insights-overview with checked outside links", () => {
  it("shows broken outside links and scores them in site health", async () => {
    await checkLinks(results.links.outsideLinks.urls.map((u) => u.href));
    const el = await fixture(
      html`<insights-overview .results="${results}"></insights-overview>`,
    );
    await waitUntil(() => el.shadowRoot.querySelector(".broken-tile"));
    const tile = el.shadowRoot.querySelector(".broken-tile");
    expect(tile.querySelector(".v").textContent.trim()).to.equal("1");
    expect(tile.textContent).to.contain("of 5 checked");
    const row = el.shadowRoot.querySelector('[data-check="outsideLinks"]');
    expect(row.textContent).to.contain("4 of 5 outside links answer");
    expect(row.textContent).to.contain("80%");
    expect(el.shadowRoot.querySelector(".soon-row")).to.equal(null);
  });

  it("points to Links before any check", async () => {
    const el = await fixture(
      html`<insights-overview .results="${results}"></insights-overview>`,
    );
    await waitUntil(() => el.shadowRoot.querySelector(".check-in-links"));
    setTimeout(() => el.shadowRoot.querySelector(".check-in-links").click());
    const ev = await new Promise((resolve) =>
      el.addEventListener("haxcms-site-admin-navigate", resolve, {
        once: true,
      }),
    );
    expect(ev.detail.route).to.equal("reports-links");
  });
});
