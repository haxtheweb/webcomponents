import { expect } from "@open-wc/testing";
import {
  USER_TOKEN_HEADER,
  SITE_TOKEN_HEADER,
  extractSessionRequestTokens,
  hasSessionRequestTokens,
  applySessionRequestTokens,
  withSessionRequestTokens,
} from "../lib/core/utils/session-request-tokens.js";

describe("session-request-tokens", () => {
  describe("extractSessionRequestTokens", () => {
    it("reads top-level tokens from a login / refresh response", () => {
      expect(
        extractSessionRequestTokens({
          status: 200,
          jwt: "j",
          userToken: " u ",
          siteToken: "s",
        }),
      ).to.deep.equal({ userToken: "u", siteToken: "s" });
    });

    it("reads tokens from an enveloped { data } response", () => {
      expect(
        extractSessionRequestTokens({ data: { jwt: "j", userToken: "u" } }),
      ).to.deep.equal({ userToken: "u" });
    });

    it("prefers top-level values over the envelope", () => {
      expect(
        extractSessionRequestTokens({
          userToken: "top",
          data: { userToken: "inner", siteToken: "inner-site" },
        }),
      ).to.deep.equal({ userToken: "top", siteToken: "inner-site" });
    });

    it("ignores empty, non-string and missing values", () => {
      expect(
        extractSessionRequestTokens({ userToken: "  ", siteToken: 42 }),
      ).to.deep.equal({});
      expect(extractSessionRequestTokens(null)).to.deep.equal({});
      expect(extractSessionRequestTokens("jwt-string")).to.deep.equal({});
      expect(extractSessionRequestTokens([{ userToken: "u" }])).to.deep.equal(
        {},
      );
    });
  });

  describe("hasSessionRequestTokens", () => {
    it("is true only when a non-empty token is present", () => {
      expect(hasSessionRequestTokens({ userToken: "u" })).to.equal(true);
      expect(hasSessionRequestTokens({ siteToken: "s" })).to.equal(true);
      expect(hasSessionRequestTokens({})).to.equal(false);
      expect(hasSessionRequestTokens({ userToken: "" })).to.equal(false);
      expect(hasSessionRequestTokens(null)).to.equal(false);
    });
  });

  describe("applySessionRequestTokens", () => {
    it("writes every shape the editor reads tokens from", () => {
      const settings = {
        userTokenHeader: "X-Custom-User",
        getUserDataHeaders: { Accept: "application/json" },
        appStore: { url: "/appstore", headers: { Accept: "x" } },
      };
      const changed = applySessionRequestTokens(settings, {
        userToken: "u",
        siteToken: "s",
      });
      expect(changed).to.equal(true);
      expect(settings.userToken).to.equal("u");
      expect(settings.siteToken).to.equal("s");
      expect(settings.getUserDataHeaders).to.deep.equal({
        Accept: "application/json",
        "X-Custom-User": "u",
      });
      expect(settings.appStore).to.deep.equal({
        url: "/appstore",
        headers: { Accept: "x", [SITE_TOKEN_HEADER]: "s" },
      });
    });

    it("uses the default user token header and creates getUserDataHeaders", () => {
      const settings = {};
      applySessionRequestTokens(settings, { userToken: "u" });
      expect(settings.getUserDataHeaders).to.deep.equal({
        [USER_TOKEN_HEADER]: "u",
      });
      expect(settings).to.not.have.property("siteToken");
    });

    it("does not invent an appStore connection", () => {
      const settings = {};
      applySessionRequestTokens(settings, { siteToken: "s" });
      expect(settings.siteToken).to.equal("s");
      expect(settings).to.not.have.property("appStore");
    });

    it("keeps existing tokens when the response omits them", () => {
      const settings = { userToken: "old-u", siteToken: "old-s" };
      applySessionRequestTokens(settings, { userToken: "new-u" });
      expect(settings.userToken).to.equal("new-u");
      expect(settings.siteToken).to.equal("old-s");
    });

    it("replaces nested objects instead of mutating them", () => {
      const userHeaders = Object.freeze({ Accept: "a" });
      const appStoreHeaders = Object.freeze({});
      const appStore = Object.freeze({ url: "/s", headers: appStoreHeaders });
      const settings = { getUserDataHeaders: userHeaders, appStore };
      applySessionRequestTokens(settings, { userToken: "u", siteToken: "s" });
      expect(settings.getUserDataHeaders).to.not.equal(userHeaders);
      expect(settings.appStore).to.not.equal(appStore);
      expect(userHeaders).to.deep.equal({ Accept: "a" });
      expect(appStoreHeaders).to.deep.equal({});
    });

    it("reports no change when everything already matches", () => {
      const settings = {};
      applySessionRequestTokens(settings, { userToken: "u", siteToken: "s" });
      expect(
        applySessionRequestTokens(settings, { userToken: "u", siteToken: "s" }),
      ).to.equal(false);
      expect(applySessionRequestTokens(settings, {})).to.equal(false);
      expect(applySessionRequestTokens(null, { userToken: "u" })).to.equal(
        false,
      );
    });
  });

  describe("withSessionRequestTokens", () => {
    it("returns a copy with tokens and leaves the original alone", () => {
      const original = { login: "/login" };
      const next = withSessionRequestTokens(original, { userToken: "u" });
      expect(next).to.not.equal(original);
      expect(next.userToken).to.equal("u");
      expect(next.login).to.equal("/login");
      expect(original).to.deep.equal({ login: "/login" });
    });

    it("returns the same object when nothing changes", () => {
      const original = { userToken: "u" };
      original.getUserDataHeaders = { [USER_TOKEN_HEADER]: "u" };
      expect(withSessionRequestTokens(original, { userToken: "u" })).to.equal(
        original,
      );
      expect(withSessionRequestTokens(original, {})).to.equal(original);
    });
  });
});
