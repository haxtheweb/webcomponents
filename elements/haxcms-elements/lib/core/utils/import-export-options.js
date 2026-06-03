/**
 * Shared import/export option metadata for dashboard and Merlin programs.
 */
export const IMPORT_WORKFLOWS = [
  {
    title: "Import from file",
    icon: "file-upload",
    action: "import-file",
    description:
      "Pick a local file, then choose how to apply it to content or site structure.",
  },
  {
    title: "Import from URL",
    icon: "editor:insert-link",
    action: "import-link",
    description:
      "Paste a URL and choose how to embed it, link it, or transform it in content.",
  },
];

export const PAGE_EXPORT_FORMATS = [
  {
    title: "Export as HTML",
    icon: "hax:file-html",
    format: "html",
    description: "Download current page as HTML file",
  },
  {
    title: "Export as Markdown",
    icon: "hax:format-textblock",
    format: "markdown",
    description: "Download current page as Markdown (.md) file",
  },
  {
    title: "Export as JSON",
    icon: "hax:code-json",
    format: "json",
    description: "Download current page as JSON",
  },
  {
    title: "Export as YAML",
    icon: "icons:code",
    format: "yaml",
    description: "Download current page as YAML",
  },
  {
    title: "Export as XML",
    icon: "icons:code",
    format: "xml",
    description: "Download current page as XML",
  },
  {
    title: "Export as DOCX",
    icon: "hax:file-docx",
    format: "docx",
    description: "Download current page as Word document",
  },
  {
    title: "Export as PDF",
    icon: "lrn:pdf",
    format: "pdf",
    description: "Download current page as PDF file",
  },
  {
    title: "Copy HAX schema JSON",
    icon: "hax:code-json",
    format: "haxschema",
    description: "Copy HAX schema JSON to the clipboard",
    developerOnly: true,
  },
];

export const SITE_EXPORT_FORMATS = [
  {
    title: "Download site archive",
    icon: "icons:archive",
    format: "zip",
    description: "Download the complete site as a ZIP file",
  },
  {
    title: "Export site as HTML",
    icon: "hax:file-html",
    format: "html",
    description: "Download the entire site as a single HTML document",
  },
  {
    title: "Export site as Markdown",
    icon: "hax:format-textblock",
    format: "markdown",
    description: "Download the entire site as Markdown",
  },
  {
    title: "Export site as DOCX",
    icon: "hax:file-docx",
    format: "docx",
    description: "Download the entire site as a Word document",
  },
  {
    title: "Export site as PDF",
    icon: "lrn:pdf",
    format: "pdf",
    description: "Download the entire site as a PDF document",
  },
  {
    title: "Export site as EPUB",
    icon: "hax:file-html",
    format: "epub",
    description: "Download the site as an EPUB book",
  },
  {
    title: "Export site skeleton",
    icon: "icons:description",
    format: "skeleton",
    description: "Export a reusable site template for creating similar sites",
  },
];
