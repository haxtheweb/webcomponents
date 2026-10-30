// Shared fixture loading for the insights-*.test.js suites.
const FIXTURES = new URL("./fixtures/insights/", import.meta.url);

export const NOW = Date.UTC(2026, 9, 15); // 2026-10-15T00:00:00Z
export const SITE_ORIGIN = "https://example.edu";
export const BASE_PATH = "/sites/chem110/";

export async function fixtureText(path) {
  const res = await fetch(new URL(path, FIXTURES));
  if (!res.ok) {
    throw new Error(`fixture ${path}: ${res.status}`);
  }
  return res.text();
}

export async function loadSpec() {
  const res = await fetch(
    new URL("../lib/core/insights/insights-spec.json", import.meta.url),
  );
  return res.json();
}

export async function loadFixtureSite() {
  const manifest = JSON.parse(await fixtureText("site.json"));
  const pages = [];
  for (let i = 0; i < manifest.items.length; i++) {
    const item = manifest.items[i];
    pages.push({ item, html: await fixtureText(`pages/${item.id}.html`) });
  }
  return { manifest, pages };
}

export async function loadExtras(pageId = "home") {
  return {
    robots: { found: true, text: await fixtureText("robots.txt") },
    llms: { found: true, text: await fixtureText("llms.txt") },
    noJs: {
      found: true,
      url: `${SITE_ORIGIN}${BASE_PATH}index`,
      html: await fixtureText("nojs-shell.html"),
      pageId,
    },
  };
}

export const RESULT_OPTIONS = {
  now: NOW,
  siteOrigin: SITE_ORIGIN,
  basePath: BASE_PATH,
};
