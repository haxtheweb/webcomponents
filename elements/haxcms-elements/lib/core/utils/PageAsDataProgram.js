/**
 * Page as Data Program for Merlin
 * Presents format options and applies ?format={selected} to the current page route.
 */
const PAGE_AS_DATA_FORMATS = [
  {
    format: "json",
    title: "View page as JSON",
    icon: "hax:code-json",
    description: "Reload this page using ?format=json",
    tags: ["json", "api", "developer", "robot", "llm"],
  },
  {
    format: "yaml",
    title: "View page as YAML",
    icon: "editor:format-textdirection-r-to-l",
    description: "Reload this page using ?format=yaml",
    tags: ["yaml", "developer", "robot", "llm"],
  },
  {
    format: "md",
    title: "View page as Markdown",
    icon: "hax:format-textblock",
    description: "Reload this page using ?format=md",
    tags: ["markdown", "md", "developer", "robot", "llm"],
  },
  {
    format: "xml",
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
      if (
        normalizedInput === "" ||
        item.title.toLowerCase().includes(normalizedInput) ||
        item.format.includes(normalizedInput) ||
        item.tags.some((tag) => tag.includes(normalizedInput))
      ) {
        results.push({
          title: item.title,
          icon: item.icon,
          tags: ["developer", "page", "data", "format"].concat(item.tags),
          more: item.description,
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
