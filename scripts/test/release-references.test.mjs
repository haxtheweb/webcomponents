// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  applyRule,
  jsonSpans,
  scan,
  stampRepos,
} from "../release-references.mjs";

const WC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SCRIPT = path.join(WC, "scripts", "release-references.mjs");
const CONFIG = JSON.parse(
  fs.readFileSync(path.join(WC, "scripts", "release-references.json"), "utf8"),
);
const NETWORK = JSON.parse(
  fs.readFileSync(path.join(WC, "scripts", "ubiquity-network.json"), "utf8"),
);

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

const tempRoot = () =>
  fs.mkdtempSync(path.join(os.tmpdir(), "release-references-"));

// ------------------------------------------------------------- the registry

test("every rule names a network repo, files, one action and a reason", () => {
  const repos = new Set(NETWORK.repos.map((e) => e.repo));
  CONFIG.rules.forEach((rule, i) => {
    const where = `rule ${i} (${rule.repo})`;
    assert.ok(repos.has(rule.repo), `${where}: not in ubiquity-network.json`);
    assert.ok(Array.isArray(rule.files) && rule.files.length, `${where}: files`);
    const actions = ["set", "pattern", "delete", "ranges"].filter(
      (k) => k in rule,
    );
    assert.equal(actions.length, 1, `${where}: exactly one action`);
    assert.ok(rule.why && rule.why.length > 10, `${where}: why`);
    if (rule.pattern) {
      assert.ok(rule.pattern.includes("{v}"), `${where}: pattern needs {v}`);
      assert.doesNotThrow(() => new RegExp(rule.pattern.split("{v}").join("x")));
    }
  });
});

test("site.json rules remove the HAXcms version rather than stamp it", () => {
  // haxcms-nodejs saveManifest stripPublicVersion: site.json is public
  CONFIG.rules
    .filter((r) => r.files.some((f) => f.endsWith("site.json")))
    .forEach((r) => {
      assert.deepEqual(r.delete, [
        "metadata.site.version",
        "metadata.build.version",
      ]);
    });
});

// ------------------------------------------------------------- JSON edits

test("set: only the version value changes; formatting elsewhere is kept", () => {
  const text =
    '{\n  "name": "x",\n  "version": "26.8.0",\n  "tags": ["a", "b"],\n  "via": "GitHub \\u00b7 x"\n}\n';
  const { text: out, changes } = applyRule({ set: "version" }, text, "26.11.0");
  assert.equal(changes.length, 1);
  assert.equal(out, text.replace('"26.8.0"', '"26.11.0"'));
});

test("set paths: escaped dots, [] arrays and a trailing * prefix", () => {
  const text = JSON.stringify(
    {
      $extensions: { "org.haxtheweb.ddd": { version: "26.8.0" } },
      libraries: [{ version: "26.8.0" }, { version: "26.8.1" }],
      meta: {
        releases: { "npm:@haxtheweb/a": "26.8.0", "npm:other": "1.0.0" },
      },
    },
    null,
    2,
  );
  const a = applyRule(
    { set: "$extensions.org\\.haxtheweb\\.ddd.version" },
    text,
    "26.11.0",
  );
  assert.equal(JSON.parse(a.text).$extensions["org.haxtheweb.ddd"].version, "26.11.0");
  const b = applyRule({ set: "libraries[].version" }, text, "26.11.0");
  assert.deepEqual(
    JSON.parse(b.text).libraries.map((l) => l.version),
    ["26.11.0", "26.11.0"],
  );
  const c = applyRule({ set: "meta.releases.npm:@haxtheweb/*" }, text, "26.11.0");
  assert.deepEqual(JSON.parse(c.text).meta.releases, {
    "npm:@haxtheweb/a": "26.11.0",
    "npm:other": "1.0.0",
  });
});

test("network-releases: only nodes released from the network move", () => {
  const text = JSON.stringify(
    {
      cli: { release: "npm:@haxtheweb/create", version: "26.8.1" },
      php: { release: "git:haxtheweb/haxcms-php", version: "26.8.2" },
      gone: { release: "git:haxtheweb/open-apis", version: "26.8.0" },
      other: { release: "npm:left-pad", version: "1.3.0" },
    },
    null,
    1,
  );
  const out = JSON.parse(
    applyRule({ set: "network-releases" }, text, "26.11.0").text,
  );
  assert.equal(out.cli.version, "26.11.0");
  assert.equal(out.php.version, "26.11.0");
  assert.equal(out.gone.version, "26.8.0");
  assert.equal(out.other.version, "1.3.0");
});

test("ranges: @haxtheweb/ ranges become ^version, others are left", () => {
  const text =
    '{\n  "devDependencies": {\n    "@haxtheweb/d-d-d": "^26.8.0",\n    "esbuild": "^0.25.0"\n  }\n}\n';
  const out = applyRule({ ranges: "@haxtheweb/" }, text, "26.11.0").text;
  assert.equal(out, text.replace("^26.8.0", "^26.11.0"));
});

test("delete: a middle member and a last member, lines and commas", () => {
  const text = [
    "{",
    '  "metadata": {',
    '    "site": {',
    '      "name": "x",',
    '      "version": "9.0.6",',
    '      "domain": ""',
    "    },",
    '    "build": {',
    '      "structure": "course",',
    '      "version": "26.8.0"',
    "    }",
    "  }",
    "}",
    "",
  ].join("\n");
  const { text: out, changes } = applyRule(
    { delete: ["metadata.site.version", "metadata.build.version"] },
    text,
    "26.11.0",
  );
  assert.equal(changes.length, 2);
  assert.equal(
    out,
    [
      "{",
      '  "metadata": {',
      '    "site": {',
      '      "name": "x",',
      '      "domain": ""',
      "    },",
      '    "build": {',
      '      "structure": "course"',
      "    }",
      "  }",
      "}",
      "",
    ].join("\n"),
  );
  assert.doesNotThrow(() => JSON.parse(out));
});

test("delete leaves a file without the field alone", () => {
  const text = '{\n  "metadata": {\n    "build": {}\n  }\n}\n';
  const r = applyRule({ delete: ["metadata.build.version"] }, text, "26.11.0");
  assert.equal(r.changes.length, 0);
  assert.equal(r.text, text);
});

test("jsonSpans handles escapes and nesting", () => {
  const text = '{"a": "x\\"y", "b": [1, {"c": "d"}]}';
  const spans = jsonSpans(text);
  const c = spans.get(JSON.stringify(["b", 1, "c"]));
  assert.equal(text.slice(c.valueStart, c.valueEnd), '"d"');
});

// ------------------------------------------------------------- text edits

test("pattern: every {v} capture moves, nothing else in the line does", () => {
  const rule = {
    pattern:
      "HAXCMS_MCP_TEST_HAXCMS_VERSION={v} +# installs @haxtheweb/haxcms-nodejs@{v} from npm",
  };
  const text =
    "export HAXCMS_MCP_TEST_HAXCMS_VERSION=26.8.1   # installs @haxtheweb/haxcms-nodejs@26.8.1 from npm\nnode 18.20.3\n";
  const { text: out, changes } = applyRule(rule, text, "26.11.0");
  assert.equal(changes.length, 1);
  assert.equal(out, text.split("26.8.1").join("26.11.0"));
  assert.equal(applyRule(rule, out, "26.11.0").changes.length, 0);
});

// ------------------------------------------------------------- the CLI

function network(root) {
  write(root, "webcomponents/.version", "26.11.0");
  write(
    root,
    "webcomponents/elements/x-el/lib/x-el.docs.json",
    '{\n  "tag": "x-el",\n  "version": "26.8.0"\n}\n',
  );
  write(
    root,
    "webcomponents/elements/x-el/demo/site.json",
    '{\n  "metadata": {\n    "build": {\n      "version": "26.8.0",\n      "type": "own"\n    }\n  }\n}\n',
  );
  write(
    root,
    "haxcms-mcp/src/haxcms_mcp/config.py",
    '    test_haxcms_version: str = "26.8.1"\n',
  );
}

test("check fails while a listed reference is behind; stamp fixes it once", () => {
  const root = tempRoot();
  network(root);
  const before = cli(root, ["check"]);
  assert.equal(before.status, 1, before.out);
  assert.match(before.out, /x-el\.docs\.json: version 26\.8\.0 -> 26\.11\.0/);
  assert.match(before.out, /metadata\.build\.version 26\.8\.0 removed/);

  const dry = cli(root, ["stamp", "--dry-run"]);
  assert.equal(dry.status, 0);
  assert.match(
    fs.readFileSync(
      path.join(root, "webcomponents/elements/x-el/lib/x-el.docs.json"),
      "utf8",
    ),
    /26\.8\.0/,
    "a dry run writes nothing",
  );

  assert.equal(cli(root, ["stamp"]).status, 0);
  const after = cli(root, ["check"]);
  assert.equal(after.status, 0, after.out);
  assert.match(
    fs.readFileSync(path.join(root, "haxcms-mcp/src/haxcms_mcp/config.py"), "utf8"),
    /"26\.11\.0"/,
  );
  assert.match(cli(root, ["stamp"]).out, /nothing to change/);
});

test("--repos limits the stamp to those repos", () => {
  const root = tempRoot();
  network(root);
  cli(root, ["stamp", "--repos", "haxcms-mcp"]);
  assert.match(
    fs.readFileSync(
      path.join(root, "webcomponents/elements/x-el/lib/x-el.docs.json"),
      "utf8",
    ),
    /26\.8\.0/,
  );
  assert.equal(cli(root, ["check", "--repos", "haxcms-mcp"]).status, 0);
});

test("stampRepos reports without writing when write is false", () => {
  const root = tempRoot();
  network(root);
  const behind = stampRepos(["webcomponents"], "26.11.0", {
    write: false,
    root,
  });
  assert.equal(behind, 2);
});

test("missing checkouts are skipped, not fatal", () => {
  const root = tempRoot();
  write(root, "webcomponents/.version", "26.11.0");
  const r = cli(root, ["check"]);
  assert.equal(r.status, 0, r.out);
  assert.match(r.out, /no checkout under/);
});

test("no release version is an error", () => {
  const root = tempRoot();
  const r = cli(root, ["check"]);
  assert.equal(r.status, 1);
  assert.match(r.out, /no release version/);
});

// ------------------------------------------------------------- scan

function gitRepo(root, repo, files) {
  const dir = path.join(root, repo);
  Object.entries(files).forEach(([rel, text]) => write(dir, rel, text));
  execFileSync("git", ["init", "-q"], { cwd: dir });
  execFileSync("git", ["add", "-A"], { cwd: dir });
}

test("scan reports the previous line, minus history and owned lines", () => {
  const root = tempRoot();
  gitRepo(root, "art", {
    "tools/package.json": '{\n  "devDependencies": {\n    "@haxtheweb/d-d-d": "^26.8.0"\n  }\n}\n',
    "package.json": '{\n  "version": "26.8.0",\n  "dependencies": {\n    "@haxtheweb/x": "^26.8.0"\n  }\n}\n',
    "CHANGELOG.md": "## 26.8.0\n",
    "node_modules/x/index.js": "26.8.0",
    "notes.md": "made with 26.8.1\nlodash 4.26.8.10 is not a match\n",
    ".version": "26.8.0",
  });
  const hits = scan({ previous: "26.8.1", root, repos: ["art", "praw"] });
  assert.deepEqual(Object.keys(hits), ["art"]);
  const files = hits.art.map((h) => h.split(":")[0]).sort();
  assert.deepEqual(files, ["notes.md", "tools/package.json"]);
});

test("scan takes the previous release from the newest older v* tag", () => {
  const root = tempRoot();
  gitRepo(root, "webcomponents", { ".version": "26.11.0", "a.txt": "x" });
  const dir = path.join(root, "webcomponents");
  const git = (args) =>
    execFileSync("git", args, {
      cwd: dir,
      env: {
        ...process.env,
        GIT_AUTHOR_NAME: "t",
        GIT_AUTHOR_EMAIL: "t@t",
        GIT_COMMITTER_NAME: "t",
        GIT_COMMITTER_EMAIL: "t@t",
      },
    });
  git(["-c", "commit.gpgsign=false", "commit", "-q", "-m", "x"]);
  ["v26.0.0", "v26.8.2", "v26.11.0"].forEach((t) => git(["tag", t]));
  gitRepo(root, "praw", { "a.md": "on 26.8.0 still\n" });
  const r = cli(root, ["scan", "--repos", "praw"]);
  assert.equal(r.status, 0);
  assert.match(r.out, /mentions of 26\.8\.x/);
  assert.match(r.out, /a\.md:1: on 26\.8\.0 still/);
});
