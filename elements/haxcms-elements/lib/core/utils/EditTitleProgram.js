/**
 * Edit Title Program for Merlin - Provides title editing capability for HAXcms pages
 * This program allows editing the title on the active page
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";

/**
 * Creates the edit title program for use in SuperDaemon
 * @param {Object} context - The context object (typically the haxcms-site-editor-ui instance)
 * @returns {Function} The program function that returns title editing options
 */
export const createEditTitleProgram = (context) => {
  return async (input) => {
    const results = [];
    const activeItem = toJS(store.activeItem);

    if (!activeItem || !activeItem.id) {
      return [
        {
          title: "No active page found",
          icon: "icons:warning",
          tags: ["error"],
          value: { disabled: true },
          eventName: "disabled",
          path: "CMS/edit/title/error",
        },
      ];
    }

    // Save button first - most common action
    if (input && input.trim() !== "") {
      results.push({
        title: `Save title: ${input}`,
        icon: "icons:check",
        tags: ["confirm", "save"],
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
                operation: "setTitle",
                title: input,
              },
            }),
          ],
        },
        eventName: "super-daemon-element-method",
        path: "CMS/edit/title/confirm",
      });
    }

    return results;
  };
};
