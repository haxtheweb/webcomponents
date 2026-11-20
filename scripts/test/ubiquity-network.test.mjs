// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const WC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SCRIPT = path.join(WC, "scripts", "ubiquity-network.mjs");
const NETWORK = JSON.parse(
  fs.readFileSync(path.join(WC, "scripts", "ubiquity-network.json"), "utf8"),
);

/** run the CLI against a made-up $HAXTHEWEB_ROOT */
function cli(root, args) {
  const env = Object.assign({}, process.env, { HAXTHEWEB_ROOT: root });
  delete env.UBIQUITY_DRY_RUN;
  delete env.UBIQUITY_DRY_RUN_VERSION;
  const r = spawnSync(process.execPath, [SCRIPT, ...args], {
    env,
    encoding: "utf8",
  });
  return { status: r.status, out: r.stdout + r.stderr };
}

function write(root, rel, text) {
  const file = path.join(root, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function tempRoot() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "ubiquity-network-"));
}

test("the network names every repo once, in a known phase, never also excluded", () => {
  const names = NETWORK.repos.map((e) => e.repo);
  assert.equal(new Set(names).size, names.length);
  NETWORK.repos.forEach((e) => {
    assert.ok(["core", "satellite"].includes(e.phase), e.repo);
    assert.ok(e.branch, e.repo);
  });
  NETWORK.excluded.forEach((e) => {
    assert.ok(!names.includes(e.repo), e.repo);
    assert.ok(e.reason, e.repo);
  });
});

test("RPG me is a satellite that goes out before art, which links to it", () => {
  const sats = NETWORK.repos
    .filter((e) => e.phase === "satellite")
    .map((e) => e.repo);
  assert.ok(sats.indexOf("rpg-me") > -1);
  assert.ok(sats.indexOf("rpg-me") < sats.indexOf("art"));
  // praw builds hax.cloud from what was published, so it is a satellite too
  assert.ok(sats.includes("praw"));
});

test("versions --strict needs the release past every repo that publishes or bumps", () => {
  const root = tempRoot();
  write(
    root,
    "haxcms-nodejs/package.json",
    JSON.stringify({ version: "26.8.1" }),
  );
  write(root, "learn/package.json", JSON.stringify({ version: "26.8.0" }));
  let r = cli(root, ["versions", "--strict", "--version", "26.8.0"]);
  assert.equal(r.status, 1);
  assert.match(r.out, /not past haxcms-nodejs 26\.8\.1/);
  // learn only records the version: equal is fine, so it is not named
  assert.doesNotMatch(r.out, /learn/);
  r = cli(root, ["versions", "--strict", "--version", "26.11.0"]);
  assert.equal(r.status, 0, r.out);
  // a recording repo that is ahead still stops a release
  write(root, "learn/package.json", JSON.stringify({ version: "26.12.0" }));
  r = cli(root, ["versions", "--strict", "--version", "26.11.0"]);
  assert.equal(r.status, 1);
  assert.match(r.out, /learn 26\.12\.0/);
});

test("versions without --strict only warns", () => {
  const root = tempRoot();
  write(root, "create/package.json", JSON.stringify({ version: "26.9.0" }));
  const r = cli(root, ["versions", "--version", "26.8.0"]);
  assert.equal(r.status, 0);
  assert.match(r.out, /WARNING/);
});

test("coverage fails on a repo PRAW names that the network does not account for", () => {
  const root = tempRoot();
  const properties = {
    web: { repo: "haxtheweb.org" },
    art: { repo: "art" },
    rpg: { repo: "rpg-me", within: "art" },
  };
  write(root, "praw/ecosystem/network.json", JSON.stringify({ properties }));
  write(
    root,
    "praw/ecosystem/web/hax-ecosystem.json",
    JSON.stringify({ links: ["https://github.com/haxtheweb/wcfactory"] }),
  );
  let r = cli(root, ["coverage"]);
  assert.equal(r.status, 0, r.out);
  properties.zine = { repo: "hax-zine" };
  write(root, "praw/ecosystem/network.json", JSON.stringify({ properties }));
  write(
    root,
    "praw/ecosystem/web/hax-ecosystem.json",
    JSON.stringify({ links: ["https://github.com/haxtheweb/new-thing"] }),
  );
  r = cli(root, ["coverage"]);
  assert.equal(r.status, 1);
  assert.match(r.out, /hax-zine \(network property zine\)/);
  assert.match(r.out, /new-thing \(ecosystem map\)/);
});

test("coverage without a praw checkout is an error, not a pass", () => {
  const r = cli(tempRoot(), ["coverage"]);
  assert.equal(r.status, 1);
  assert.match(r.out, /praw checkout/);
});

test("satellites --dry-run reports what it would do and writes nothing", () => {
  const root = tempRoot();
  const dir = path.join(root, "rpg-me");
  write(
    root,
    "rpg-me/package.json",
    JSON.stringify(
      {
        version: "0.0.0",
        dependencies: { "@haxtheweb/rpg-character": "^26.8.0", lit: "^3.3.0" },
      },
      null,
      2,
    ) + "\n",
  );
  execFileSync("git", ["init", "-q", "-b", "main"], { cwd: dir });
  const before = fs.readFileSync(path.join(dir, "package.json"), "utf8");
  const r = cli(root, [
    "satellites",
    "--version",
    "26.11.0",
    "--dry-run",
    "--only",
    "rpg-me",
  ]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /version 0\.0\.0 -> 26\.11\.0/);
  assert.match(r.out, /@haxtheweb\/rpg-character \^26\.8\.0 -> \^26\.11\.0/);
  assert.doesNotMatch(r.out, /lit/);
  assert.match(r.out, /git tag -a v26\.11\.0/);
  assert.equal(fs.readFileSync(path.join(dir, "package.json"), "utf8"), before);
  assert.equal(
    execFileSync("git", ["tag"], { cwd: dir, encoding: "utf8" }),
    "",
  );
});

test("satellites stops at a missing checkout, before touching the rest", () => {
  const r = cli(tempRoot(), [
    "satellites",
    "--version",
    "26.11.0",
    "--dry-run",
    "--only",
    "learn",
  ]);
  assert.equal(r.status, 1);
  assert.match(r.out, /no checkout/);
});
