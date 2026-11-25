/**
 * Copyright 2022 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
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
  // metadata
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/actions/website-metadata",
    name: "@core/websiteMetadata",
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
    endpoint: "/system/api/v1/actions/md-to-html",
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
    endpoint: "/system/api/v1/actions/html-to-md",
    name: "@core/htmlToMd",
    title: "HTML to MD",
    description: "Convert HTML string (or file) to MD",
    params: {
      html: "HTML or link to be converted",
      type: "link for processing as link otherwise unused",
    },
  });
  // prettyHtml
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/actions/pretty-html",
    name: "@core/prettyHtml",
    title: "Pretty HTML",
    description: "Format HTML string (or file) to be more human readable",
    params: {
      html: "HTML or link to be converted",
      type: "link for processing as link otherwise unused",
    },
  });

  // jsonToYaml
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/actions/json-to-yaml",
    name: "@core/jsonToYaml",
    title: "JSON to YAML",
    description: "Convert JSON object or string to YAML format",
    params: {
      json: "JSON object or JSON string to be converted",
      type: "link for processing as link otherwise unused",
    },
  });

  // xlsxToCsv
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/actions/xlsx-to-csv",
    name: "@core/xlsxToCsv",
    title: "Excel to CSV",
    description: "Convert .xls/.xlsx spreadsheet to CSV string",
    params: {
      body: "FormData containing the Excel file (field name arbitrary)",
      sheet: "Optional sheet name to convert",
      headers: "Include headers in CSV (default true)",
    },
  });
  // yamlToJson
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/actions/yaml-to-json",
    name: "@core/yamlToJson",
    title: "YAML to JSON",
    description: "Convert YAML string to JSON format",
    params: {
      yaml: "YAML string to be converted to JSON",
      type: "link for processing as link otherwise unused",
    },
  });

  // docxToPdf
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/actions/docx-to-pdf",
    name: "@core/docxToPdf",
    title: "Docx to pdf",
    description: "Convert .docx file to PDF response (downloaded)",
    params: {
      body: "FormData class w/ uploaded file encoded into it",
    },
  });
  // pdfToHtml
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/actions/pdf-to-html",
    name: "@core/pdfToHtml",
    title: "PDF to HTML",
    description: "Convert .pdf file to semantic HTML",
    params: {
      body: "FormData class w/ uploaded file encoded into it",
    },
  });

  // docxToHtml
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/actions/docx-to-html",
    name: "@core/docxToHtml",
    title: "Docx to HTML",
    description: "Convert .docx file to HTML",
    params: {
      body: "FormData class w/ uploaded file encoded into it",
    },
  });
  // pptxToHtml
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/actions/pptx-to-html",
    name: "@core/pptxToHtml",
    title: "PPTX to HTML",
    description: "Convert .pptx file to HTML",
    params: {
      body: "FormData class w/ uploaded file encoded into it",
    },
  });
}

// HAXcms services
export function enableHAXcmsServices() {
  // importPdf
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/actions/import-pdf",
    name: "@system/importPdf",
    title: "PDF to Site",
    description: "Convert .pdf file to Site schema",
    params: {
      body: "FormData class w/ uploaded file encoded into it",
    },
  });
  // importPptx
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/actions/import-pptx",
    name: "@system/importPptx",
    title: "PPTX to Site",
    description: "Convert .pptx file to Site schema",
    params: {
      body: "FormData class w/ uploaded file encoded into it",
    },
  });
  // importXlsx
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/actions/import-xlsx",
    name: "@system/importXlsx",
    title: "Excel to Site",
    description: "Convert .xlsx/.xls file to Site schema",
    params: {
      body: "FormData class w/ uploaded file encoded into it",
    },
  });
  // htmlToSite
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/site/import/html",
    name: "@system/htmlToSite",
    title: "HTML to Site",
    description:
      "Convert uploaded HTML, repoUrl HTML, or raw HTML to Site schema",
    params: {
      body: "FormData upload or object payload with repoUrl/html plus method and parentId",
    },
  });
  // gitbookToSite
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/site/import/gitbook",
    name: "@system/gitbookToSite",
    title: "Gitbook to Site",
    description: "Convert Gitbook baseed repo to valid HAXcms",
    params: {
      md: "Location of the repo",
    },
  });
  // notionToSite
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/site/import/notion",
    name: "@system/notionToSite",
    title: "Notion to Site",
    description: "Convert notion baseed repo to valid HAXcms",
    params: {
      repoUrl: "Location of the repo",
    },
  });
  // haxcmsToSite
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/site/import/haxcms",
    name: "@system/haxcmsToSite",
    title: "HAXcms to Site",
    description: "Use a HAXcms site as the basis for a new one",
    params: {
      repoUrl: "Location of the site",
    },
  });
  // elmslnToSite
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/site/import/elmsln",
    name: "@system/elmslnToSite",
    title: "ELMS:LN to Site",
    description: "Import an ELMS:LN site to HAXcms",
    params: {
      repoUrl: "Location of the site",
    },
  });
  // pressbooksToSite
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/site/import/pressbooks",
    name: "@system/pressbooksToSite",
    title: "Pressbooks to Site",
    description: "Convert pressbooks site URL to Site schema",
    params: {
      repoUrl: "Location of the Pressbooks site",
    },
  });
  // ploneToSite
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/site/import/plone",
    name: "@system/ploneToSite",
    title: "Plone to Site",
    description: "Convert Plone REST API content to Site schema",
    params: {
      repoUrl: "Location of the Plone site",
    },
  });
  // wordpressToSite
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/site/import/wordpress",
    name: "@system/wordpressToSite",
    title: "WordPress Pages to Site",
    description:
      "Convert WordPress pages (and menu structure where available) to Site schema",
    params: {
      repoUrl: "Location of the WordPress site",
    },
  });
  // drupalToSite
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/site/import/drupal",
    name: "@system/drupalToSite",
    title: "Drupal to Site",
    description: "Convert a Drupal site (JSON:API) to Site schema",
    params: {
      repoUrl: "Location of the Drupal site",
    },
  });
  // openstaxToSite
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/site/import/openstax",
    name: "@system/openstaxToSite",
    title: "OpenStax to Site",
    description: "Convert an OpenStax textbook to Site schema",
    params: {
      repoUrl: "Location of the OpenStax book",
    },
  });
  // vitepressToSite
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/site/import/vitepress",
    name: "@system/vitepressToSite",
    title: "VitePress to Site",
    description: "Convert a VitePress documentation repo to Site schema",
    params: {
      repoUrl: "Location of the VitePress git repo",
    },
  });
  // quartoToSite
  MicroFrontendRegistry.add({
    endpoint: "/system/api/v1/site/import/quarto",
    name: "@system/quartoToSite",
    title: "Quarto to Site",
    description: "Convert a Quarto book or website repo to Site schema",
    params: {
      repoUrl: "Location of the Quarto git repo",
    },
  });
  // siteToHtml
  MicroFrontendRegistry.add({
    endpoint: "/x/api/v1/site/export/html",
    method: "GET",
    name: "@system/siteToHtml",
    title: "HAXcms Full Site HTML",
    description: "Load entire HAXcms site via URL as HTML",
    params: {
      magic: "optional CDN URL to wrap HTML in full document",
      "filter.ancestor":
        "optional: ancestor to print from as opposed to entire site",
    },
  });
  // siteToEpub
  MicroFrontendRegistry.add({
    endpoint: "/x/api/v1/site/export/epub",
    method: "GET",
    name: "@system/siteToEpub",
    title: "HAXcms Full Site EPUB",
    description: "generate .epub of entire HAXcms site via URL",
    params: {
      "filter.ancestor":
        "optional: ancestor to print from as opposed to entire site",
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
      q: "blob of HTML or link to html file to load",
      type: "link for processing as link otherwise unused",
    },
  });
}
