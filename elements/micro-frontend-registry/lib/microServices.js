import { MicroFrontendRegistry } from "../micro-frontend-registry.js";

// integrate the core services of our webcomponents API layer
// While not required, this is the home for non-visual aspects of
// our ecosystem that can be leveraged independent of other things
// Examples of a platform specific implementation would be HAXcms
// and it's name spacing

export function enableServices(services) {
  services.forEach((service) => {
    switch (service) {
      case "core":
        enableCoreServices();
        break;
      case "experimental":
        enableExperimentalServices();
        break;
      case "haxcms":
        enableHAXcmsServices();
        break;
    }
  });
}
// map service enable to global
MicroFrontendRegistry.enableServices = enableServices;

// core services
export function enableCoreServices() {
  // linkValidator
  MicroFrontendRegistry.add({
    endpoint: "/api/services/website/linkValidator",
    name: "@core/linkValidator",
    method: "GET",
    title: "Validate URLs",
    description:
      "Validates that an array of URLs are valid by returning status codes of a HEAD request",
    params: {
      links: "link for processing as link otherwise unused",
    },
  });

  // metadata
  MicroFrontendRegistry.add({
    endpoint: "/api/services/website/metadata",
    name: "@core/metadata",
    method: "GET",
    title: "URL Metadata",
    description: "Skims metadata off a link",
    params: {
      q: "url to process",
    },
    userContext: [
      {
        action: "paste",
        data: "url",
        memory: {
          isLoggedIn: true,
        },
        result: function (data) {
          return {
            tag: "a",
            content:
              data.title ||
              data["og:site_name"] ||
              data["og:title"] ||
              data.url,
            properties: {
              href: data.url,
              rel: "nofollow",
            },
          };
        },
      },
    ],
  });

  // mdToHtml
  MicroFrontendRegistry.add({
    endpoint: "/api/services/media/format/mdToHtml",
    name: "@core/mdToHtml",
    title: "Markdown to HTML",
    description: "Convert Markdown string (or file) to HTML",
    params: {
      md: "MD or link to be converted",
      type: "link for processing as link otherwise unused",
    },
  });

  // htmlToMd
  MicroFrontendRegistry.add({
    endpoint: "/api/services/media/format/htmlToMd",
    name: "@core/htmlToMd",
    title: "HTML to MD",
    description: "Convert HTML string (or file) to MD",
    params: {
      html: "HTML or link to be converted",
      type: "link for processing as link otherwise unused",
    },
  });
  // htmlToPdf
  MicroFrontendRegistry.add({
    endpoint: "/api/services/media/format/htmlToPdf",
    name: "@core/htmlToPdf",
    title: "HTML to PDF",
    description: "Convert HTML string (or file) to a PDF",
    params: {
      html: "HTML or link to be converted",
      type: "link for processing as link otherwise unused",
    },
  });

  // prettyHtml
  MicroFrontendRegistry.add({
    endpoint: "/api/services/media/format/prettyHtml",
    name: "@core/prettyHtml",
    title: "Pretty HTML",
    description: "Format HTML string (or file) to be more human readable",
    params: {
      html: "HTML or link to be converted",
      type: "link for processing as link otherwise unused",
    },
  });
  // crypto
  MicroFrontendRegistry.add({
    endpoint: "/api/services/security/aes256",
    name: "@core/crypto",
    title: "Cryptography from string",
    description: "Convert a string to or from an aes256 based hash",
    params: {
      data: "HTML or link to be converted",
      op: "decrypt or hash",
    },
  });
  // duckDuckGo
  MicroFrontendRegistry.add({
    endpoint: "/api/services/website/duckDuckGo",
    name: "@core/duckDuckGo",
    method: "GET",
    title: "Duck Duck Go",
    description: "Search results from duck duck go",
    params: {
      q: "query param to search on",
    },
  });

  // screenshot - kept by itself bc of size of getBrowserInstance
  MicroFrontendRegistry.add({
    endpoint: "https://screenshoturl.open-apis.hax.cloud/api/screenshotUrl",
    name: "@core/screenshotUrl",
    method: "GET",
    title: "Screenshot page",
    description: "Takes screenshot of a URL and returns image",
    params: {
      urlToCapture: "full url with https",
      quality: "Optional image quality parameter",
    },
  });

  // docxToPdf
  MicroFrontendRegistry.add({
    endpoint: "/api/services/media/format/docxToPdf",
    name: "@core/docxToPdf",
    title: "Docx to pdf",
    description: "Convert .docx file to PDF response (downloaded)",
    params: {
      body: "FormData class w/ uploaded file encoded into it",
    },
  });

  // docxToHtml
  MicroFrontendRegistry.add({
    endpoint: "/api/services/media/format/docxToHtml",
    name: "@core/docxToHtml",
    title: "Docx to HTML",
    description: "Convert .docx file to HTML",
    params: {
      body: "FormData class w/ uploaded file encoded into it",
    },
  });

  // htmlToDocx
  MicroFrontendRegistry.add({
    endpoint: "/api/services/media/format/htmlToDocx",
    name: "@core/htmlToDocx",
    title: "HTML to docx",
    description: "Convert HTML to .docx file",
    params: {
      html: "html body to be converted to a docx file download",
    },
  });

  // imgToAscii
  MicroFrontendRegistry.add({
    endpoint: "/api/services/media/format/imgToAscii",
    name: "@core/imgToAscii",
    title: "Image to ascii art",
    description:
      "Convert any valid image formatted file to ASCII terminal style art",
    params: {
      body: "FormData class w/ uploaded file encoded into it",
    },
  });

  // imgManipulation
  MicroFrontendRegistry.add({
    endpoint: "/api/services/media/image/manipulate",
    name: "@core/imgManipulate",
    title: "simple image manipulation",
    description:
      "scale, resize, convert and perform operations to manipulate any image",
    params: {
      src: "image source",
      height: "height in numbers",
      width: "width in numbers",
      quality: "0-100, jpeg quality to reduce image by if jpeg",
      fit: "how to crop if height and width are supplied (https://sharp.pixelplumbing.com/api-resize)",
      watermark: "SRC for an image to watermark on the output",
      wmspot: "nw,ne,se,sw for moving the location of the watermark",
      rotate: "https://sharp.pixelplumbing.com/api-operation#rotate",
      format: "png, jpg, gif, webp",
    },
  });
  MicroFrontendRegistry.add({
    endpoint: "/api/services/text/readability",
    name: "@core/readability",
    title: "readability score",
    description: "Readability metrics from analyzing text",
    params: {
      body: "Block of text to enhance",
    },
  });
}

// HAXcms services
export function enableHAXcmsServices() {
  // docxToSite
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/docxToSite",
    name: "@haxcms/docxToSite",
    title: "Docx to Site",
    description: "Convert .docx file to Site schema",
    params: {
      body: "FormData class w/ uploaded file encoded into it",
    },
  });
  // htmlToSite
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/convert/htmlToSite",
    name: "@haxcms/htmlToSite",
    title: "HTML to Site",
    description: "Convert HTML file location to Site schema",
    params: {
      repoUrl: "Location of the repo",
    },
  });
  // evolutionToSite
  MicroFrontendRegistry.add({
    endpoint: "/system/api/importEvolution",
    name: "@haxcms/evolutionToSite",
    title: "Evolution to Site",
    description: "Convert .zip and schema to valid HAXcms",
    params: {
      body: "FormData class w/ uploaded file encoded into it",
    },
  });
  // gitbookToSite
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/convert/gitbookToSite",
    name: "@haxcms/gitbookToSite",
    title: "Gitbook to Site",
    description: "Convert Gitbook baseed repo to valid HAXcms",
    params: {
      md: "Location of the repo",
    },
  });
  // notionToSite
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/convert/notionToSite",
    name: "@haxcms/notionToSite",
    title: "Notion to Site",
    description: "Convert notion baseed repo to valid HAXcms",
    params: {
      repoUrl: "Location of the repo",
    },
  });
  // haxcmsToSite
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/convert/haxcmsToSite",
    name: "@haxcms/haxcmsToSite",
    title: "HAXcms to Site",
    description: "Use a HAXcms site as the basis for a new one",
    params: {
      repoUrl: "Location of the site",
    },
  });
  // elmslnToSite
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/convert/elmslnToSite",
    name: "@haxcms/elmslnToSite",
    title: "ELMS:LN to Site",
    description: "Import an ELMS:LN site to HAXcms",
    params: {
      repoUrl: "Location of the site",
    },
  });
  // pressbooksToSite
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/convert/pressbooksToSite",
    name: "@haxcms/pressbooksToSite",
    title: "Pressbooks to Site",
    description: "Convert pressbooks HTML export to Site schema",
    params: {
      body: "FormData class w/ uploaded file encoded into it",
    },
  });
  // insights
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/insights",
    name: "@haxcms/insights",
    title: "Site insights",
    description:
      "States relative to the page, lesson, and site as a whole. Used for content authors.",
    params: {
      site: "location of the HAXcms site OR site.json data",
      type: "site for site.json or link for remote loading",
      activeId: "id to query from",
    },
  });
  // contentBrowser
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/contentBrowser",
    name: "@haxcms/contentBrowser",
    title: "Content browser",
    description: "Returns details about content relative to an activeID",
    params: {
      site: "location of the HAXcms site OR site.json data",
      type: "site for site.json or link for remote loading",
      activeId: "id to query from",
    },
  });
  // mediaBrowser
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/mediaBrowser",
    name: "@haxcms/mediaBrowser",
    title: "Media browser",
    description: "Returns details about media relative to an activeID",
    params: {
      site: "location of the HAXcms site OR site.json data",
      type: "site for site.json or link for remote loading",
      activeId: "id to query from",
    },
  });
  // linkChecker
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/linkChecker",
    name: "@haxcms/linkChecker",
    title: "Check site links",
    description: "Returns details about links relative to an activeID",
    params: {
      site: "location of the HAXcms site OR site.json data",
      type: "site for site.json or link for remote loading",
      activeId: "id to query from",
    },
  });
  // courseStats
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/courseStats",
    name: "@haxcms/courseStats",
    title: "Course stats",
    description:
      "Relevant stats for teaching relative to the ancestor in question",
    params: {
      site: "location of the HAXcms site OR site.json data",
      type: "site for site.json or link for remote loading",
      ancestor: "optional: ancestor to print from as opposed to entire site",
    },
  });
  // siteToHtml
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/siteToHtml",
    name: "@haxcms/siteToHtml",
    title: "HAXcms Full Site HTML",
    description: "Load entire HAXcms site via URL as HTML",
    params: {
      site: "location of the HAXcms site OR site.json data",
      type: "site for site.json or link for remote loading",
      ancestor: "optional: ancestor to print from as opposed to entire site",
    },
  });
  // pageCache
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/pageCache",
    method: "GET",
    name: "@haxcms/pageCache",
    title: "HAXcms Page cache",
    description: "Load a page from a site via uuid",
    params: {
      site: "location of the HAXcms site OR site.json data",
      type: "site for site.json or link for remote loading",
      uuid: "page to return content of",
    },
  });
  // siteManifest
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/siteManifest",
    name: "@haxcms/siteManifest",
    title: "HAXcms manifest",
    description: "Load the manifest for a site based on URL",
    params: {
      site: "location of the HAXcms site OR site.json data",
    },
  });

  // siteGlossary
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/siteGlossary",
    name: "@haxcms/siteGlossary",
    title: "HAXcms site Glossary",
    description: "array of terms found in the glossary slug",
    params: {
      url: "location of the HAXcms site",
    },
  });

  // views
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/views",
    name: "@haxcms/views",
    title: "Views, but for HAX",
    description: "Views criteria for slicing and remixing HAX site data",
    params: {
      site: "location of the HAXcms site",
    },
  });

  // termsInPage
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/termsInPage",
    name: "@haxcms/termsInPage",
    title: "HAXcms Page terms",
    description: "array of terms from glossary found in a blob of html",
    params: {
      body: "HTML blob to process",
      site: "location of the HAXcms site OR site.json data",
      type: "site for site.json or link for remote loading",
      wikipedia: "if wikipedia links should be included in response, if found",
      terms:
        "Optional array of term objects. This is intended for future use / forcibly passing a list from elsewhere",
    },
  });
  // siteToEpub
  MicroFrontendRegistry.add({
    endpoint: "/api/apps/haxcms/siteToEpub",
    name: "@haxcms/siteToEpub",
    title: "HAXcms Full Site EPUB",
    description: "generate .epub of entire HAXcms site via URL",
    params: {
      url: "location of the HAXcms site",
    },
  });
}

// experimental service
export function enableExperimentalServices() {
  // hydrateSsr
  MicroFrontendRegistry.add({
    endpoint: "https://webcomponents.hax.cloud/api/hydrateSsr",
    name: "@experiments/hydrateSsr",
    title: "Hydrate SSR",
    description: "Hydrate web components via lit server side",
    params: {
      html: "blob of HTML or link to html file to load",
    },
  });
}
