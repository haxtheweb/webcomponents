/**
 * Edit Tags Program for Merlin - Provides tag editing capability for HAXcms pages
 * This program allows editing tags on the active page
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";

/**
 * Creates the edit tags program for use in SuperDaemon
 * @param {Object} context - The context object (typically the haxcms-site-editor-ui instance)
 * @returns {Function} The program function that returns tag editing options
 */
export const createEditTagsProgram = (context) => {
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
          path: "CMS/edit/tags/error",
        },
      ];
    }

    // Read the active page's current tags so the program is self-sufficient
    // regardless of which entry point launched it (quick page operations or
    // Merlin search/voice). Tags are stored as a comma-separated string.
    const currentTags =
      activeItem.metadata && activeItem.metadata.tags
        ? activeItem.metadata.tags
        : "";

    // User typed something - offer to save their input verbatim.
    if (input && input.trim() !== "") {
      results.push({
        title: `Save tags: ${input}`,
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
                idOrSlug: activeItem.id,
                operation: "setTags",
                tags: input,
              },
            }),
          ],
        },
        eventName: "super-daemon-element-method",
        path: "CMS/edit/tags/confirm",
      });
      return results;
    }

    // No input. If the page already has tags, show them as the primary action
    // (re-save) so the user can see what is currently set, and also offer to
    // clear them.
    if (currentTags) {
      results.push({
        title: `Save tags: ${currentTags}`,
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
                idOrSlug: activeItem.id,
                operation: "setTags",
                tags: currentTags,
              },
            }),
          ],
        },
        eventName: "super-daemon-element-method",
        path: "CMS/edit/tags/confirm",
      });
      results.push({
        title: "Clear all tags",
        icon: "icons:clear",
        tags: ["confirm", "clear"],
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
                operation: "setTags",
                tags: "",
              },
            }),
          ],
        },
        eventName: "super-daemon-element-method",
        path: "CMS/edit/tags/clear",
      });
      return results;
    }

    // No input and no current tags - nothing to save or clear.
    results.push({
      title: "No tags set",
      icon: "icons:info",
      tags: ["empty"],
      value: { disabled: true },
      eventName: "disabled",
      path: "CMS/edit/tags/empty",
    });

    return results;
  };
};
