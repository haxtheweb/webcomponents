/**
 * Edit Title Program for Merlin - Provides title editing capability for HAXcms pages
 * This program allows editing the title on the active page
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { toJS } from "mobx";

// English defaults for the labels this program shows; translations come from
// the context element's this.t (haxcms-site-editor-ui, haxcms namespace)
const EDIT_TITLE_T = {
  noActivePageFound: "No active page found",
  saveTitleValue: "Save title: {title}",
};
const _t = (context, key) =>
  context && context.t && context.t[key] ? context.t[key] : EDIT_TITLE_T[key];

/**
 * Creates the edit title program for use in SuperDaemon
 * @param {Object} context - The context object (typically the haxcms-site-editor-ui instance)
 * @returns {Function} The program function that returns title editing options
 */
export const createEditTitleProgram = (context) => {
  return async (input, values) => {
    const results = [];
    const activeItem = toJS(store.activeItem);

    if (!activeItem || !activeItem.id) {
      return [
        {
          title: _t(context, "noActivePageFound"),
          icon: "icons:warning",
          tags: ["error"],
          value: { disabled: true },
          eventName: "disabled",
          path: "CMS/edit/title/error",
        },
      ];
    }

    const currentTitle = activeItem.title || "";

    // If no input provided, show option with current title
    if (!input || input.trim() === "") {
      if (currentTitle) {
        results.push({
          title: _t(context, "saveTitleValue").replace("{title}", currentTitle),
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
                  operation: "setTitle",
                  title: currentTitle,
                },
              }),
            ],
          },
          eventName: "super-daemon-element-method",
          path: "CMS/edit/title/confirm",
        });
      }
      return results;
    }

    // User has typed something - show save option with their input
    results.push({
      title: _t(context, "saveTitleValue").replace("{title}", input),
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
              operation: "setTitle",
              title: input,
            },
          }),
        ],
      },
      eventName: "super-daemon-element-method",
      path: "CMS/edit/title/confirm",
    });

    return results;
  };
};
