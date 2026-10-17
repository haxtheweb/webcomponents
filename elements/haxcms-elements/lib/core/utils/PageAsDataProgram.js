/**
 * Page as Data Program for Merlin
 * Presents format options and applies ?format={selected} to the current page route.
 */

// English defaults for the labels this program shows; translations come from
// the context element's this.t (haxcms-site-editor-ui, haxcms namespace)
const PAGE_AS_DATA_T = {
  viewPageAsFormat: "View page as {format}",
  reloadPageUsingQuery: "Reload this page using {query}",
};
const _t = (context, key) =>
  context && context.t && context.t[key] ? context.t[key] : PAGE_AS_DATA_T[key];
const PAGE_AS_DATA_FORMATS = [
  {
    format: "json",
    formatName: "JSON",
    title: "View page as JSON",
    icon: "hax:code-json",
    description: "Reload this page using ?format=json",
    tags: ["json", "api", "developer", "robot", "llm"],
  },
  {
    format: "yaml",
    formatName: "YAML",
    title: "View page as YAML",
    icon: "editor:format-textdirection-r-to-l",
    description: "Reload this page using ?format=yaml",
    tags: ["yaml", "developer", "robot", "llm"],
  },
  {
    format: "md",
    formatName: "Markdown",
    title: "View page as Markdown",
    icon: "hax:format-textblock",
    description: "Reload this page using ?format=md",
    tags: ["markdown", "md", "developer", "robot", "llm"],
  },
  {
    format: "xml",
    formatName: "XML",
    title: "View page as XML",
    icon: "code",
    description: "Reload this page using ?format=xml",
    tags: ["xml", "developer", "robot", "llm"],
  },
];

export const createPageAsDataProgram = (context) => {
  return async (input, values) => {
    let results = [];
    let normalizedInput = "";
    if (input) {
      normalizedInput = input.toLowerCase().trim();
    }

    PAGE_AS_DATA_FORMATS.forEach((item) => {
      const title = _t(context, "viewPageAsFormat").replace(
        "{format}",
        item.formatName,
      );
      if (
        normalizedInput === "" ||
        item.title.toLowerCase().includes(normalizedInput) ||
        title.toLowerCase().includes(normalizedInput) ||
        item.format.includes(normalizedInput) ||
        item.tags.some((tag) => tag.includes(normalizedInput))
      ) {
        results.push({
          title: title,
          icon: item.icon,
          tags: ["developer", "page", "data", "format"].concat(item.tags),
          more: _t(context, "reloadPageUsingQuery").replace(
            "{query}",
            `?format=${item.format}`,
          ),
          value: {
            target: context,
            method: "openPageAsDataFormat",
            args: [item.format],
          },
          eventName: "super-daemon-element-method",
          path: `>developer/page-as-data/${item.format}`,
          context: [">"],
        });
      }
    });

    return results;
  };
};
