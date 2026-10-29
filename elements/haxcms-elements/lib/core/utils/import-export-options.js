/**
 * Shared import/export option metadata for dashboard and Merlin programs.
 * English text stays here; displays translate via `${tKey}Title` and
 * `${tKey}Description` in their own this.t, falling back to these strings.
 */
export const IMPORT_WORKFLOWS = [
  {
    tKey: "importFile",
    title: "Import from file",
    icon: "hax:admin-upload",
    action: "import-file",
    description:
      "Pick a local file, then choose how to apply it to content or site structure.",
  },
  {
    tKey: "importLink",
    title: "Import from URL",
    icon: "hax:admin-links",
    action: "import-link",
    description:
      "Paste a URL and choose how to embed it, link it, or transform it in content.",
  },
];

export const PAGE_EXPORT_FORMATS = [
  {
    tKey: "exportPageHtml",
    title: "Export as HTML",
    icon: "hax:file-html",
    format: "html",
    description: "Download current page as HTML file",
  },
  {
    tKey: "exportPageMarkdown",
    title: "Export as Markdown",
    icon: "hax:format-textblock",
    format: "markdown",
    description: "Download current page as Markdown (.md) file",
  },
  {
    tKey: "exportPageJson",
    title: "Export as JSON",
    icon: "hax:code-json",
    format: "json",
    description: "Download current page as JSON",
  },
  {
    tKey: "exportPageYaml",
    title: "Export as YAML",
    icon: "icons:code",
    format: "yaml",
    description: "Download current page as YAML",
  },
  {
    tKey: "exportPageXml",
    title: "Export as XML",
    icon: "icons:code",
    format: "xml",
    description: "Download current page as XML",
  },
  {
    tKey: "exportPageDocx",
    title: "Export as DOCX",
    icon: "hax:file-docx",
    format: "docx",
    description: "Download current page as Word document",
  },
  {
    tKey: "exportPagePdf",
    title: "Export as PDF",
    icon: "lrn:pdf",
    format: "pdf",
    description: "Download current page as PDF file",
  },
  {
    tKey: "exportPageEpub",
    title: "Export as EPUB",
    icon: "hax:file-html",
    format: "epub",
    description: "Download current page as an EPUB book",
  },
  {
    tKey: "exportPageHaxSchema",
    title: "Copy HAX schema JSON",
    icon: "hax:code-json",
    format: "haxschema",
    description: "Copy HAX schema JSON to the clipboard",
    developerOnly: true,
  },
];

export const SITE_EXPORT_FORMATS = [
  {
    tKey: "exportSiteArchive",
    title: "Download site archive",
    icon: "icons:archive",
    format: "zip",
    description: "Download the complete site as a ZIP file",
  },
  {
    tKey: "exportSiteHtml",
    title: "Export site as HTML",
    icon: "hax:file-html",
    format: "html",
    description: "Download the entire site as a single HTML document",
  },
  {
    tKey: "exportSiteMarkdown",
    title: "Export site as Markdown",
    icon: "hax:format-textblock",
    format: "markdown",
    description: "Download the entire site as Markdown",
  },
  {
    tKey: "exportSiteDocx",
    title: "Export site as DOCX",
    icon: "hax:file-docx",
    format: "docx",
    description: "Download the entire site as a Word document",
  },
  {
    tKey: "exportSitePdf",
    title: "Export site as PDF",
    icon: "lrn:pdf",
    format: "pdf",
    description: "Download the entire site as a PDF document",
  },
  {
    tKey: "exportSiteEpub",
    title: "Export site as EPUB",
    icon: "hax:file-html",
    format: "epub",
    description: "Download the site as an EPUB book",
  },
  {
    tKey: "exportSiteSkeleton",
    title: "Export site skeleton",
    icon: "icons:description",
    format: "skeleton",
    description: "Export a reusable site template for creating similar sites",
  },
];
