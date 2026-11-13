/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { toJS } from "mobx";
import { mimeTypeToName } from "@haxtheweb/utils/utils.js";

/**
 * Merlin programs that only exist on the HAX site dashboard (app-hax).
 * They run what the dashboard's cards and menus already do, so anything
 * you would scroll the page for can be reached from Merlin: making a site
 * from a file (also what dropping a file on the dashboard runs), each
 * importer, templates, themes, going to a site and sorting.
 *
 * Paths are what Merlin shows under each row and its first part is the
 * group heading (Create, Import, Sites, Dashboard).
 */

// the file types a site can be made from, as the file importers take them
export const SITE_FILE_EXTENSIONS = [
  "docx",
  "pdf",
  "pptx",
  "xlsx",
  "html",
  "htm",
];

// the program a dropped or picked file runs
export const FILE_DROP_PROGRAM = "app-hax-file-to-site";

/**
 * A file's extension, lower case, with no dot ("" when it has none).
 * @param {string} name
 * @returns {string}
 */
export function fileExtension(name) {
  if (!name || typeof name !== "string") {
    return "";
  }
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop().toLowerCase() : "";
}

/**
 * While a file is dragged the browser gives its MIME type but not its
 * name. Returns the extension Merlin can name for it (".docx"), or "".
 * @param {string} mimeType
 * @returns {string}
 */
export function dragTypeLabel(mimeType) {
  const name = mimeTypeToName(mimeType);
  return name && name.indexOf(".") === 0 ? name : "";
}

/**
 * Whether a dragged MIME type is one a site can be made from.
 * @param {string} mimeType
 * @returns {boolean}
 */
export function dragTypeMakesSite(mimeType) {
  const label = dragTypeLabel(mimeType);
  return label !== "" && SITE_FILE_EXTENSIONS.includes(label.substring(1));
}

/**
 * Whether text is an http(s) URL an importer can be handed.
 * @param {string} value
 * @returns {boolean}
 */
export function isImportUrl(value) {
  if (!value || typeof value !== "string") {
    return false;
  }
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function importerIcon(item) {
  return item.useCaseIcon && item.useCaseIcon[0] && item.useCaseIcon[0].icon
    ? item.useCaseIcon[0].icon
    : "icons:cloud-download";
}

/**
 * Rows for a file: what Merlin offers once a file is dropped or picked.
 * @param {Object} host app-hax
 * @param {File} file
 * @returns {Array}
 */
export function fileRows(host, file) {
  const t = host.t;
  const filter = host._useCaseFilter();
  const ext = fileExtension(file && file.name);
  const importer =
    filter && file ? filter.importItemForFileName(file.name) : null;
  const rows = [];
  if (importer) {
    rows.push({
      title: t.createSiteFromFile.replace("{name}", () => file.name),
      icon: importerIcon(importer),
      tags: ["Import", importer.useCaseTitle],
      description: importer.useCaseDescription,
      value: {
        target: host,
        method: "importFileToSite",
        args: [file],
      },
      eventName: "super-daemon-element-method",
      path: `Import/${importer.useCaseTitle}`,
    });
  }
  rows.push({
    title: t.chooseDifferentFile,
    icon: "icons:folder-open",
    tags: ["Import", "file"],
    description: importer
      ? t.chooseFileDescription
      : ext
        ? t.noImporterForType.replace("{type}", () => `.${ext}`)
        : t.noImporterForFile,
    value: {
      target: host,
      method: "chooseFileForSite",
      args: [],
    },
    eventName: "super-daemon-element-method",
    path: importer ? "Create/From file" : t.supportedFileTypes,
  });
  if (importer) {
    rows.push({
      title: t.seeEveryImportOption,
      icon: "icons:file-upload",
      tags: ["Import"],
      value: {
        target: host,
        method: "showImportOptions",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: `Dashboard/${filter.t.fromExistingSource}`,
    });
  } else {
    rows.push({
      title: t.importFromUrlInstead,
      icon: "icons:link",
      tags: ["Import", "url"],
      value: {
        target: host,
        method: "openImportFromUrl",
        args: [],
      },
      eventName: "super-daemon-element-method",
      path: "Import/From a URL",
    });
  }
  return rows;
}

/**
 * Define every dashboard-only program on Merlin.
 * @param {Object} host app-hax
 * @param {Object} SuperDaemonInstance
 */
export function defineDashboardPrograms(host, SuperDaemonInstance) {
  const t = host.t;
  // a dropped or picked file: the program shows what to do with it
  SuperDaemonInstance.defineOption({
    i18n: { context: host, title: "makeSiteFromAFileEllipsis" },
    title: t.makeSiteFromAFileEllipsis,
    icon: "icons:folder-open",
    tags: ["Create", "Import", "file", "upload", "drop", "site"],
    eventName: "super-daemon-element-method",
    path: "Create/From file",
    value: {
      target: host,
      method: "chooseFileForSite",
      args: [],
    },
    context: ["*"],
  });
  SuperDaemonInstance.defineOption({
    title: t.makeSiteFromAFile,
    icon: "icons:folder-open",
    // only run by name, from a drop or the file picker
    tags: [],
    eventName: "super-daemon-run-program",
    path: "Create/From file",
    context: [FILE_DROP_PROGRAM],
    value: {
      name: t.makeSiteFromAFile,
      machineName: FILE_DROP_PROGRAM,
      placeholder: t.pickWhatToDoWithFile,
      program: async (_input, values) => {
        if (!values || !values.file) {
          return [];
        }
        return fileRows(host, values.file);
      },
    },
  });
  // templates and themes, as the Create New Site cards list them
  const listProgram = (dataType) => async (input) => {
    const filter = host._useCaseFilter();
    const items =
      filter && Array.isArray(filter.items)
        ? filter.items.filter((item) => item && item.dataType === dataType)
        : [];
    const like = (input || "").toLowerCase();
    return items
      .filter(
        (item) =>
          like === "" || (item.useCaseTitle || "").toLowerCase().includes(like),
      )
      .map((item) => ({
        title: item.useCaseTitle,
        icon: importerIcon(item),
        tags: Array.isArray(item.useCaseTag) ? item.useCaseTag : [],
        description: item.useCaseDescription,
        value: {
          target: host,
          method: "openTemplateFromMerlin",
          args: [item],
        },
        eventName: "super-daemon-element-method",
        path: `Create/${dataType === "skeleton" ? "From template" : "From scratch"}/${item.useCaseTitle}`,
      }));
  };
  SuperDaemonInstance.defineOption({
    i18n: { context: host, title: "createSiteFromTemplate" },
    title: t.createSiteFromTemplate,
    icon: "icons:dashboard",
    tags: ["Create", "template", "skeleton", "site"],
    eventName: "super-daemon-run-program",
    path: "Create/From template",
    value: {
      name: t.createSiteFromTemplateName,
      program: listProgram("skeleton"),
    },
    context: ["*"],
  });
  SuperDaemonInstance.defineOption({
    i18n: { context: host, title: "createBlankSiteWithTheme" },
    title: t.createBlankSiteWithTheme,
    icon: "icons:add",
    tags: ["Create", "theme", "blank", "scratch", "site"],
    eventName: "super-daemon-run-program",
    path: "Create/From scratch",
    value: {
      name: t.createBlankSiteWithThemeName,
      program: listProgram("blank"),
    },
    context: ["*"],
  });
  // every importer, by name, so typing "wordpress" finds it
  const filter = host._useCaseFilter();
  const importers =
    filter && typeof filter.getImportItems === "function"
      ? filter.getImportItems()
      : [];
  importers.forEach((item) => {
    if (item.importKind === "file") {
      SuperDaemonInstance.defineOption({
        title: t.importType.replace("{title}", () => item.useCaseTitle),
        icon: importerIcon(item),
        tags: ["Import", "file", item.importType].concat(
          Array.isArray(item.useCaseTag) ? item.useCaseTag : [],
        ),
        description: item.useCaseDescription,
        eventName: "super-daemon-element-method",
        path: `Import/${item.useCaseTitle}`,
        value: {
          target: host,
          method: "runImporter",
          args: ["file", item.importType],
        },
        context: ["*"],
      });
    } else if (item.importKind === "url") {
      SuperDaemonInstance.defineOption({
        title: t.importTypeEllipsis.replace("{title}", () => item.useCaseTitle),
        icon: importerIcon(item),
        tags: ["Import", "url", item.importType].concat(
          Array.isArray(item.useCaseTag) ? item.useCaseTag : [],
        ),
        description: item.useCaseDescription,
        eventName: "super-daemon-run-program",
        path: `Import/${item.useCaseTitle}`,
        value: {
          name: item.useCaseTitle,
          placeholder: item.prompt,
          program: async (input) => {
            if (!isImportUrl(input)) {
              return [];
            }
            const url = input.trim();
            return [
              {
                title: t.createSiteFromUrl.replace("{url}", () => url),
                icon: importerIcon(item),
                tags: ["Import", item.useCaseTitle],
                description: item.useCaseDescription,
                value: {
                  target: host,
                  method: "runImporter",
                  args: ["url", item.importType, url],
                },
                eventName: "super-daemon-element-method",
                path: `Import/${item.useCaseTitle}`,
              },
            ];
          },
        },
        context: ["*"],
      });
    }
  });
  // a URL first, then which kind of site it is
  SuperDaemonInstance.defineOption({
    i18n: { context: host, title: "importFromUrl" },
    title: t.importFromUrl,
    icon: "icons:link",
    tags: ["Import", "url", "link", "migrate", "site"],
    eventName: "super-daemon-run-program",
    path: "Import/From a URL",
    value: {
      name: t.importFromUrlName,
      machineName: "app-hax-import-url",
      placeholder: t.importFromUrlPlaceholder,
      program: async (input) => {
        if (!isImportUrl(input)) {
          return [];
        }
        const url = input.trim();
        return importers
          .filter((item) => item.importKind === "url")
          .map((item) => ({
            title: t.importUrlAs
              .replace("{url}", () => url)
              .replace("{kind}", () => item.useCaseTitle),
            icon: importerIcon(item),
            tags: ["Import", item.useCaseTitle],
            description: item.useCaseDescription,
            value: {
              target: host,
              method: "runImporter",
              args: ["url", item.importType, url],
            },
            eventName: "super-daemon-element-method",
            path: `Import/${item.useCaseTitle}`,
          }));
      },
    },
    context: ["*"],
  });
  // sort the sites, as the sort menu by the search does
  SuperDaemonInstance.defineOption({
    i18n: { context: host, title: "sortSitesBy" },
    title: t.sortSitesBy,
    icon: "icons:sort",
    tags: ["Dashboard", "sort", "sites", "order"],
    eventName: "super-daemon-run-program",
    path: "Dashboard/Sort",
    value: {
      name: t.sortSitesByName,
      program: async () => {
        // the same labels as the sort menu beside the search
        const current = host._useCaseFilter();
        const ft = current ? current.t : {};
        return [
          ["newest", ft.recentlyUpdated],
          ["az", ft.titleAZ],
          ["za", ft.titleZA],
          ["oldest", ft.leastRecentlyUpdated],
          ["theme", ft.themeName],
        ].map(([sortValue, label]) => ({
          title: label,
          icon: "icons:sort",
          tags: ["sort"],
          value: {
            target: host,
            method: "sortSitesFromMerlin",
            args: [sortValue],
          },
          eventName: "super-daemon-element-method",
          path: `Dashboard/Sort/${label}`,
        }));
      },
    },
    context: ["*"],
  });
}

/**
 * The rows of the Go to site program.
 * @param {Object} host app-hax
 * @param {Object} store
 * @param {string} input
 * @returns {Array}
 */
export function goToSiteRows(host, store, input) {
  const items = toJS(store.manifest && store.manifest.items) || [];
  const like = (input || "").toLowerCase();
  return items
    .filter(
      (site) =>
        like === "" ||
        (site.title || "").toLowerCase().includes(like) ||
        (site.metadata &&
          site.metadata.site &&
          site.metadata.site.name &&
          site.metadata.site.name.toLowerCase().includes(like)),
    )
    .map((site) => ({
      title: site.title,
      icon:
        site.metadata &&
        site.metadata.theme &&
        site.metadata.theme.variables &&
        site.metadata.theme.variables.icon
          ? site.metadata.theme.variables.icon
          : "hax:hax2022",
      tags: ["site", site.description],
      value: {
        target: host,
        method: "goToLocation",
        args: [site.slug],
      },
      eventName: "super-daemon-element-method",
      path: `Sites/Go to/${site.title}`,
    }));
}
