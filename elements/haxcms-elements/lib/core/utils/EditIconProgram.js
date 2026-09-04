/**
 * Edit Icon Program for Merlin - Provides icon editing capability for HAXcms pages
 * This program allows editing the icon on the active page
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";

/**
 * Creates the edit icon program for use in SuperDaemon
 * @param {Object} context - The context object (typically the haxcms-site-editor-ui instance)
 * @returns {Function} The program function that returns icon editing options
 */
export const createEditIconProgram = (context) => {
  return async (input) => {
    const results = [];
    // Read the active item lazily so the icon is always set on the page
    // that is active when the program executes, not the one that was active
    // when the program was registered. This avoids stale closures that
    // previously caused the icon to be written to a previously active page.
    const activeItem = toJS(store.activeItem);

    if (!activeItem || !activeItem.id) {
      return [
        {
          title: "No active page found",
          icon: "icons:warning",
          tags: ["error"],
          value: { disabled: true },
          eventName: "disabled",
          path: "CMS/edit/icon/error",
        },
      ];
    }

    // Lazy import so the iconset is only loaded when this program runs and
    // is never eagerly pulled into the initial bundle.
    const { SimpleIconsetStore } = await import(
      "@haxtheweb/simple-icon/lib/simple-iconset.js"
    );
    const allIcons =
      SimpleIconsetStore && SimpleIconsetStore.iconlist
        ? [...SimpleIconsetStore.iconlist].sort()
        : [];

    const searchTerm = input ? input.toLowerCase() : "";

    const filteredIcons = searchTerm
      ? allIcons.filter((icon) => icon.toLowerCase().includes(searchTerm))
      : allIcons.slice(0, 50);

    filteredIcons.forEach((icon) => {
      const friendlyName = icon
        .replace(/^.*:/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      results.push({
        title: `${friendlyName} (${icon})`,
        icon: icon,
        tags: ["icon"],
        value: {
          target: globalThis,
          method: "dispatchEvent",
          args: [
            new CustomEvent("haxcms-save-node-details", {
              bubbles: true,
              composed: true,
              cancelable: true,
              detail: {
                id: activeItem.id,
                idOrSlug: activeItem.id,
                operation: "setIcon",
                icon: icon,
              },
            }),
          ],
        },
        eventName: "super-daemon-element-method",
        path: `CMS/edit/icon/${icon}`,
      });
    });

    if (results.length === 0) {
      return [
        {
          title: searchTerm
            ? `No icons found for "${searchTerm}"`
            : "No icons available",
          icon: "icons:search",
          tags: ["empty"],
          value: { disabled: true },
          eventName: "disabled",
          path: "No results",
        },
      ];
    }

    if (!searchTerm && allIcons.length > 50) {
      results.push({
        title: `Showing 50 of ${allIcons.length} icons - type to search`,
        icon: "icons:info",
        tags: ["hint"],
        value: { disabled: true },
        eventName: "disabled",
        path: "Hint",
      });
    }

    return results;
  };
};
