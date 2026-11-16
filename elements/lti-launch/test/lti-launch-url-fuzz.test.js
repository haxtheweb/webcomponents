/**
 * Property tests for the lti-launch address rules: whatever is passed in,
 * only an absolute http(s) address without credentials comes out, and the
 * login request never carries anything else as an address.
 */
import { expect } from "@open-wc/testing";
import fc from "fast-check";
import {
  frameSandbox,
  httpOrigin,
  launchPlan,
  loginRequestFields,
  opaqueValue,
  safeHttpUrl,
} from "../lib/lti-launch-url.js";
import { fuzzConfig } from "../../../scripts/test-setup/fuzz-config.mjs";

const RUNS = fuzzConfig({ defaultSeed: 20261115, defaultRuns: 400 });

const HOSTILE = [
  "javascript:alert(1)",
  "JaVaScRiPt:alert(1)",
  " javascript:alert(1)",
  "java\nscript:alert(1)",
  "java\tscript:alert(1)",
  "\u0001javascript:alert(1)",
  "javascript://example.org/%0Aalert(1)",
  "data:text/html,<script>alert(1)</script>",
  "DATA:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
  "vbscript:msgbox(1)",
  "blob:https://example.org/1234",
  "file:///etc/passwd",
  "ftp://example.org/tool",
  "//example.org/tool",
  "/tool",
  "tool.html",
  "https://",
  "https://user:pass@example.org/",
  "https://user@example.org/",
  "about:blank",
  "ws://example.org",
  "",
  "   ",
  `https://example.org/${"a".repeat(3000)}`,
];

const scheme = fc.constantFrom(
  "http:",
  "https:",
  "javascript:",
  "JAVASCRIPT:",
  "data:",
  "vbscript:",
  "blob:",
  "file:",
  "ftp:",
  "",
  ":",
);
const junk = fc.constantFrom(
  "",
  " ",
  "\n",
  "\t",
  "\u0000",
  "//",
  "/",
  "\\",
  "@",
);
const soup = fc
  .tuple(junk, scheme, junk, fc.string({ maxLength: 40 }), junk)
  .map((parts) => parts.join(""));
const anything = fc.oneof(
  soup,
  fc.string(),
  fc.webUrl(),
  fc.constantFrom(...HOSTILE),
  fc.constantFrom(null, undefined, 0, 12, true, {}, []),
);

function expectSafe(out) {
  if (out === "") {
    return;
  }
  const url = new URL(out);
  expect(["http:", "https:"]).to.include(url.protocol);
  expect(url.hostname).to.not.equal("");
  expect(url.username).to.equal("");
  expect(url.password).to.equal("");
  expect(out).to.equal(url.href);
}

describe("lti-launch address rules", () => {
  it("rejects every hostile address", () => {
    HOSTILE.forEach((value) =>
      expect(safeHttpUrl(value), JSON.stringify(value)).to.equal(""),
    );
  });

  it("keeps http and https addresses, normalized", () => {
    expect(safeHttpUrl("https://tool.example/lab4")).to.equal(
      "https://tool.example/lab4",
    );
    expect(safeHttpUrl("  HTTP://Tool.Example  ")).to.equal(
      "http://tool.example/",
    );
    expect(safeHttpUrl("https://tool.example/a?b=1#c")).to.equal(
      "https://tool.example/a?b=1#c",
    );
    expect(httpOrigin("https://tool.example:8443/a/b")).to.equal(
      "https://tool.example:8443",
    );
    expect(httpOrigin("javascript:alert(1)")).to.equal("");
  });

  it("only ever returns an http(s) address or nothing", () => {
    fc.assert(
      fc.property(anything, (value) => {
        expectSafe(safeHttpUrl(value));
        const origin = httpOrigin(value);
        if (origin) {
          expect(origin).to.match(/^https?:\/\/[^/]+$/);
        }
      }),
      RUNS,
    );
  });

  it("plans a launch only from usable settings", () => {
    fc.assert(
      fc.property(
        anything,
        anything,
        anything,
        anything,
        (launchUrl, loginUrl, clientId, deploymentId) => {
          const plan = launchPlan({
            launchUrl,
            loginUrl,
            clientId,
            deploymentId,
          });
          expectSafe(plan.launchUrl);
          expectSafe(plan.loginUrl);
          expect(["none", "link", "lti"]).to.include(plan.mode);
          if (plan.mode !== "none") {
            expect(plan.launchUrl).to.not.equal("");
          }
          if (plan.mode === "lti") {
            expect(plan.loginUrl).to.not.equal("");
            expect(plan.clientId).to.not.equal("");
            expect(plan.deploymentId).to.not.equal("");
          }
          const fields = loginRequestFields(plan, {
            issuer: loginUrl,
            pageOrigin: launchUrl,
            loginHint: clientId,
            messageHint: deploymentId,
          });
          if (fields.iss) {
            expect(safeHttpUrl(fields.iss)).to.not.equal("");
          }
          expect(fields.target_link_uri).to.equal(plan.launchUrl);
          Object.keys(fields).forEach((name) =>
            expect(fields[name]).to.be.a("string"),
          );
        },
      ),
      RUNS,
    );
    expect(launchPlan().mode).to.equal("none");
    expect(
      launchPlan({
        launchUrl: "https://tool.example/a",
        loginUrl: "javascript:alert(1)",
        clientId: "c",
        deploymentId: "d",
      }).mode,
    ).to.equal("link");
  });

  it("keeps opaque values as bounded text", () => {
    expect(opaqueValue("  abc ")).to.equal("abc");
    expect(opaqueValue(42)).to.equal("42");
    expect(opaqueValue(null)).to.equal("");
    expect(opaqueValue({ toString: () => "x" })).to.equal("");
    expect(opaqueValue("a".repeat(9000)).length).to.equal(4096);
  });

  it("never gives a same-origin frame scripts and same-origin together", () => {
    const page = "https://site.example";
    expect(frameSandbox(["https://tool.example/a"], page)).to.include(
      "allow-same-origin",
    );
    expect(frameSandbox(["https://site.example/tool"], page)).to.not.include(
      "allow-same-origin",
    );
    expect(
      frameSandbox(["https://tool.example/a", "https://site.example/b"], page),
    ).to.not.include("allow-same-origin");
    expect(frameSandbox(["https://tool.example/a"], "")).to.not.include(
      "allow-same-origin",
    );
    expect(frameSandbox(null, page)).to.include("allow-scripts");
    expect(frameSandbox(["https://tool.example/a"], page)).to.not.include(
      "allow-top-navigation",
    );
  });
});
