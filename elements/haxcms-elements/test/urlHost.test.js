import { expect } from "@open-wc/testing";
import { urlHostMatches } from "../lib/core/utils/urlHost.js";

describe("urlHostMatches", () => {
  it("matches the domain and its subdomains", () => {
    expect(urlHostMatches("https://youtube.com/watch?v=1", ["youtube.com"])).to
      .be.true;
    expect(urlHostMatches("https://www.YouTube.com/x", ["youtube.com"])).to.be
      .true;
    expect(urlHostMatches("//m.youtube.com/x", ["youtube.com"])).to.be.true;
    expect(urlHostMatches("http://youtu.be/abc", ["youtube.com", "youtu.be"]))
      .to.be.true;
  });
  it("does not match the domain in path, query, userinfo or look-alikes", () => {
    const d = ["youtube.com"];
    expect(urlHostMatches("https://evil.example/?u=youtube.com", d)).to.be
      .false;
    expect(urlHostMatches("https://evil.example/youtube.com", d)).to.be.false;
    expect(urlHostMatches("https://youtube.com.evil.example/", d)).to.be.false;
    expect(urlHostMatches("https://notyoutube.com/", d)).to.be.false;
    expect(urlHostMatches("https://youtube.com@evil.example/", d)).to.be.false;
  });
  it("does not treat x.com as a substring of other hosts", () => {
    expect(urlHostMatches("https://dropbox.com/s", ["x.com"])).to.be.false;
    expect(urlHostMatches("https://x.com/user/status/1", ["x.com"])).to.be.true;
  });
  it("accepts scheme-less values only when allowSchemeless is set", () => {
    const opt = { allowSchemeless: true };
    expect(urlHostMatches("linkedin.com/in/me", ["linkedin.com"])).to.be.false;
    expect(urlHostMatches("linkedin.com/in/me", ["linkedin.com"], opt)).to.be
      .true;
    expect(urlHostMatches("evil.example/?linkedin.com", ["linkedin.com"], opt))
      .to.be.false;
    expect(urlHostMatches("/linkedin.com/x", ["linkedin.com"], opt)).to.be
      .false;
  });
  it("rejects non-http(s), relative and invalid values", () => {
    const d = ["youtube.com"];
    expect(urlHostMatches("javascript:alert('youtube.com')", d)).to.be.false;
    expect(urlHostMatches("/youtube.com/page", d)).to.be.false;
    expect(urlHostMatches("youtube.com", d)).to.be.false;
    expect(urlHostMatches("", d)).to.be.false;
    expect(urlHostMatches(null, d)).to.be.false;
    expect(urlHostMatches(undefined, d)).to.be.false;
  });
});
