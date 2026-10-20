// Translatable HAXcms API messages (haxtheweb/issues#3157)
import { expect } from "@open-wc/testing";
import {
  HAXCMS_API_MESSAGES_EN,
  HAXCMSApiMessages,
  apiMessageParts,
  translateApiCode,
  haxcmsApiMessage,
} from "../lib/core/utils/HAXCMSApiMessages.js";

const LOCALES = new URL("../locales/", import.meta.url).href;
const placeholders = (text) =>
  [...String(text).matchAll(/\{(\w+)\}/g)]
    .map((m) => m[1])
    .sort()
    .join(",");

async function json(url) {
  const response = await fetch(url);
  expect(response.ok, url).to.equal(true);
  return response.json();
}

describe("HAXCMSApiMessages", () => {
  afterEach(() => {
    HAXCMSApiMessages.t = { ...HAXCMS_API_MESSAGES_EN };
  });

  it("English defaults match locales/haxcms-api.en.json and the shared code list", async () => {
    const en = await json(`${LOCALES}haxcms-api.en.json`);
    expect(HAXCMS_API_MESSAGES_EN).to.deep.equal(en);
    const catalog = await json(
      new URL("../lib/haxcms-api-codes.json", import.meta.url).href,
    );
    const fromCatalog = {};
    catalog.codes.forEach((entry) => {
      fromCatalog[entry.code] = entry.en;
    });
    expect(fromCatalog).to.deep.equal(en);
  });

  it("every translation has the English keys and keeps the placeholders", async function () {
    // ~100 small files; fetched together, with room for slow CI machines
    this.timeout(30000);
    const manifest = await json(
      new URL(
        "../../i18n-manager/lib/translation-manifest.json",
        import.meta.url,
      ).href,
    );
    const languages = (manifest.manifest["haxcms-api"] || []).filter(
      (lang) => lang !== "en",
    );
    expect(languages.length).to.be.greaterThan(100);
    const problems = [];
    const files = await Promise.all(
      languages.map((lang) => json(`${LOCALES}haxcms-api.${lang}.json`)),
    );
    languages.forEach((lang, index) => {
      const data = files[index];
      for (const code of Object.keys(HAXCMS_API_MESSAGES_EN)) {
        if (typeof data[code] !== "string" || data[code] === "") {
          problems.push(`${lang}: missing ${code}`);
        } else if (
          placeholders(data[code]) !==
          placeholders(HAXCMS_API_MESSAGES_EN[code])
        ) {
          problems.push(`${lang}: placeholders in ${code}`);
        }
      }
      Object.keys(data).forEach((code) => {
        if (!(code in HAXCMS_API_MESSAGES_EN)) {
          problems.push(`${lang}: unknown ${code}`);
        }
      });
    });
    expect(problems).to.deep.equal([]);
  });

  it("finds the message and code wherever the response put them", () => {
    expect(
      apiMessageParts({
        status: 404,
        data: {
          message: "Site not found",
          code: "SITE_NOT_FOUND",
        },
      }),
    ).to.deep.equal({
      code: "SITE_NOT_FOUND",
      params: {},
      message: "Site not found",
    });
    // MicroFrontendRegistry error result
    expect(
      apiMessageParts({
        status: 403,
        data: null,
        message: "",
        body: {
          status: 403,
          data: { message: "Access denied", code: "ACCESS_DENIED" },
        },
      }),
    ).to.deep.equal({
      code: "ACCESS_DENIED",
      params: {},
      message: "Access denied",
    });
    // PHP operations
    expect(
      apiMessageParts({
        __failed: {
          status: 403,
          message: "invalid site token",
          code: "SITE_TOKEN_INVALID",
        },
      }).code,
    ).to.equal("SITE_TOKEN_INVALID");
    // converters send data.error
    expect(
      apiMessageParts({ status: 400, data: { error: "Conversion failed" } })
        .message,
    ).to.equal("Conversion failed");
    expect(apiMessageParts("plain text").message).to.equal("plain text");
    expect(apiMessageParts(null)).to.deep.equal({
      code: "",
      params: {},
      message: "",
    });
  });

  it("shows the server's English message while the language is English", () => {
    const response = {
      status: 404,
      data: {
        message: 'Item not found for idOrSlug "intro"',
        code: "ITEM_NOT_FOUND",
        params: { idOrSlug: "intro" },
      },
    };
    expect(haxcmsApiMessage(response)).to.equal(
      'Item not found for idOrSlug "intro"',
    );
  });

  it("shows the translation once the language has one", () => {
    HAXCMSApiMessages.t = {
      ...HAXCMS_API_MESSAGES_EN,
      UPLOAD_TOO_LARGE: "Die Datei überschreitet {maxMb} MB.",
    };
    const response = {
      status: 400,
      data: {
        message: "File exceeds the maximum upload size of 25MB",
        code: "UPLOAD_TOO_LARGE",
        params: { maxMb: "25" },
      },
    };
    expect(haxcmsApiMessage(response)).to.equal(
      "Die Datei überschreitet 25 MB.",
    );
  });

  it("falls back to the English message when a param is missing", () => {
    HAXCMSApiMessages.t = {
      ...HAXCMS_API_MESSAGES_EN,
      UPLOAD_NOT_VALID: "Keine gültige {expected}-Datei.",
    };
    const response = {
      status: 400,
      data: { message: "Invalid image file content", code: "UPLOAD_NOT_VALID" },
    };
    expect(haxcmsApiMessage(response)).to.equal("Invalid image file content");
    expect(translateApiCode("UPLOAD_NOT_VALID", {})).to.equal(null);
  });

  it("uses the code's English text when the response has only a code", () => {
    expect(
      haxcmsApiMessage({ status: 403, data: { code: "ACCESS_DENIED" } }),
    ).to.equal("Access denied.");
  });

  it("ignores unknown codes and falls back", () => {
    expect(
      haxcmsApiMessage({ status: 400, data: { message: "Odd", code: "NOPE" } }),
    ).to.equal("Odd");
    expect(haxcmsApiMessage({ status: 500 }, "Request failed")).to.equal(
      "Request failed",
    );
    expect(translateApiCode("NOPE")).to.equal(null);
  });

  it("is available to packages that can't import haxcms-elements", () => {
    expect(globalThis.haxcmsApiMessage).to.be.a("function");
    expect(
      globalThis.haxcmsApiMessage({ data: { message: "Hi" } }, "x"),
    ).to.equal("Hi");
  });
});
