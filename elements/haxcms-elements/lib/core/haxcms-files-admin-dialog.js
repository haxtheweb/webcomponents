/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { closeChoiceOnEscape } from "./utils/haxcms-admin-helpers.js";
import { HaxcmsAdminSectionMixin } from "./admin/HaxcmsAdminSectionMixin.js";
import { html, css, nothing } from "lit";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { autorun, toJS } from "mobx";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { waitForHAXCMSSiteApiRegistryReady } from "@haxtheweb/haxcms-elements/lib/core/utils/haxcms-site-api-registry.js";
import "@haxtheweb/simple-icon/lib/simple-icon-button-lite.js";
import "@haxtheweb/simple-icon/lib/simple-clipboard-copy-button.js";
import "@haxtheweb/hax-body/lib/hax-upload-field.js";
import "./admin/haxcms-admin-add-area.js";
import { adminConfirm, adminPrompt } from "./admin/haxcms-admin-confirm.js";
import "@haxtheweb/simple-pager/simple-pager.js";
import "@haxtheweb/simple-fields/lib/simple-fields-field.js";
import { COMPRESS_PRESETS } from "@haxtheweb/hax-body/lib/hax-file-actions.js";
import {
  CROP_ASPECTS,
  canCropMime,
  centeredCropRect,
  cropOutputType,
  encodeCrop,
  loadCropImage,
} from "@haxtheweb/hax-body/lib/hax-image-crop.js";
import {
  HaxUiAdminStyles,
  HaxUiAdminIcons,
} from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import {
  AdminRowMenuStyles,
  createRangeSelector,
  handleAdminListKey,
  isAdminRowMenuKey,
  createAdminLongPress,
  matchesAdminShortcut,
  openAdminRowMenu,
  renderAdminRowMenu,
  renderRowMoreButton,
} from "./admin/admin-row-menu.js";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/hax-iconset/lib/simple-hax-iconset.js";
import { haxcmsApiMessage } from "./utils/HAXCMSApiMessages.js";

const FILE_TYPE_FILTER_ITEMS = [
  { value: "", text: "All types", key: "allTypes" },
  { value: "image", text: "Images", key: "images" },
  { value: "video", text: "Video", key: "video" },
  { value: "audio", text: "Audio", key: "audio" },
  { value: "application/pdf", text: "PDF" },
];

const COMPRESS_LEVELS = ["light", "medium", "heavy", "maximum"];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 75, 100, 250, 500];

/** below this section width files show as cards, not a table */
const COMPACT_WIDTH = 720;

const SORT_OPTIONS = [
  ["updated-desc", "sortNewest"],
  ["updated-asc", "sortOldest"],
  ["name", "sortName"],
  ["size-desc", "sortLargest"],
];

const SCALE_PRESETS = {
  xs: { width: 150, height: 150, label: "150px" },
  sm: { width: 480, height: 480, label: "480px" },
  md: { width: 800, height: 800, label: "800px" },
  lg: { width: 1200, height: 1200, label: "1200px" },
  xl: { width: 1920, height: 1920, label: "1920px" },
};

/** keys the item menu shows, bound on the rows (as in outline-designer) */
const FILES_ROW_SHORTCUTS = {
  crop: { key: "c", keys: [{ key: "c" }] },
  duplicate: { key: "d", ctrl: true, keys: [{ key: "d", ctrl: true }] },
  rename: { key: "F2", keys: [{ key: "F2" }] },
  delete: {
    key: "Delete",
    keys: [{ key: "Delete" }, { key: "Backspace" }],
  },
};

/**
 * `haxcms-files-admin-dialog`
 * The Files admin section: upload, filter and act on the site's files.
 * Inside the one admin dialog (haxcms-site-admin) it is a "selection"
 * section: it reports the selected count and its bulk actions with
 * `haxcms-admin-section-state`, and the shell's action bar calls
 * `runAction(id)` / `clearSelection()`. Each action runs the same handler,
 * confirm prompts and file operations as the bulk action select it
 * replaces (hax-file-actions, still used when not in the shell).
 */
class HAXCMSFilesAdminDialog extends HaxcmsAdminSectionMixin(I18NMixin(DDD)) {
  static get tag() {
    return "haxcms-files-admin-dialog";
  }
  static get properties() {
    return {
      rows: { type: Array },
      loading: { type: Boolean, reflect: true },
      busy: { type: Boolean, reflect: true },
      bulkBusy: { type: Boolean, attribute: false },
      selectedRows: { type: Object, attribute: false },
      errorMessage: { type: String },
      method: { type: String },
      siteName: { type: String, attribute: "site-name" },
      nodeId: { type: String, attribute: "node-id" },
      scalePreset: { type: String, attribute: "scale-preset" },
      cacheBustToken: { type: String, attribute: false },
      pageLimit: { type: Number, attribute: "page-limit" },
      pageOffset: { type: Number, attribute: "page-offset" },
      pageTotal: { type: Number, attribute: "page-total" },
      filterType: { type: String, attribute: "filter-type" },
      filterExtension: { type: String, attribute: "filter-extension" },
      filterNameContains: { type: String, attribute: "filter-name-contains" },
      /** set by haxcms-site-admin: the shell owns the bulk action bar */
      inShell: { type: Boolean, attribute: "in-shell", reflect: true },
      /** open option chooser for a bulk action that needs a value */
      _choice: { state: true },
      /**
       * the crop editor: { rows, index, done, aspect }. Opened by Crop…
       * on the selected JPG, PNG and WebP files, one at a time.
       */
      _crop: { state: true },
      /**
       * true while the section is narrow (a phone, or a small dialog): files
       * show as cards and the filters fold into one row. Set from the
       * section's own width, not the viewport's.
       */
      compact: { type: Boolean, reflect: true },
      /** card order while compact: updated-desc, updated-asc, name, size */
      _sort: { state: true },
      _brokenThumbs: { state: true },
      /** the file shown in the inspector (wide sections) */
      _focusKey: { state: true },
      _rowMenuFor: { state: true },
      _uploading: { state: true },
    };
  }

  constructor() {
    super();
    // touch: a long press opens the item menu on iOS too
    this._longPress = createAdminLongPress((e) => this._onRowContextMenu(e));
    this.t = this.t || {};
    this.t = {
      ...this.t,
      allTypes: "All types",
      images: "Images",
      video: "Video",
      audio: "Audio",
      timeAgo: "{time} ago",
      month: "month",
      months: "months",
      day: "day",
      days: "days",
      hour: "hour",
      hours: "hours",
      minute: "minute",
      minutes: "minutes",
      second: "second",
      seconds: "seconds",
      unableToLoadFiles: "Unable to load files",
      uploadComplete: "Upload complete",
      unableToRunFileOperation: "Unable to run file operation.",
      fileUuidMissing: "File UUID is missing",
      fileOperationEndpointUnavailable:
        "File operation endpoint is not available",
      fileOperationFailed: "File operation failed",
      fileOperationComplete: "File operation complete",
      fileDeleted: "File deleted",
      fileRenamed: "File renamed",
      imageConvertedToJpg: "Image converted to JPG",
      imageRotated90: "Image rotated 90 degrees",
      imageTransformedSepia: "Image transformed to sepia",
      imageTransformedBlackAndWhite: "Image transformed to black and white",
      scaledTo: "Scaled to {size}",
      compressedLevel: "Compressed ({level})",
      fileDuplicated: "File duplicated",
      processingProgress: "Processing {current} of {total}…",
      bulkSummaryFile: "{verb}: {count} file",
      bulkSummaryFiles: "{verb}: {count} files",
      bulkFailed: "{verb} failed",
      bulkFailedAllFile: "{verb} failed for all {count} file",
      bulkFailedAllFiles: "{verb} failed for all {count} files",
      bulkPartial: "{verb}: {ok} succeeded, {failed} failed",
      onlyRasterScaled: "Only raster images can be scaled.",
      onlyRasterRotated: "Only raster images can be rotated.",
      rotated: "Rotated",
      onlyRasterConvertedJpg: "Only raster images can be converted to JPG.",
      onlyRasterTransformed: "Only raster images can be transformed.",
      transformed: "Transformed",
      onlyRasterCompressed: "Only raster images can be compressed.",
      duplicated: "Duplicated",
      renamePromptSingle:
        "Rename file using letters, numbers, and hyphens. Keep the existing extension.",
      renamePromptMultiple:
        "Rename {count} files. Enter a base name; files will be named base-1, base-2, etc.",
      renameCancelled: "Rename cancelled",
      renamed: "Renamed",
      selectedFilesCount: "{count} selected files",
      deleteConfirm: "Delete {label}? This cannot be undone.",
      deleteFilesTitle: "Delete files",
      renameFilesTitle: "Rename files",
      replaceOriginalsTitle: "Replace original files",
      newName: "New name",
      deleteAction: "Delete",
      renameAction: "Rename",
      deleted: "Deleted",
      bulkOverwriteConfirm:
        "{action} {count} files? This replaces the original files and cannot be undone.",
      actionScale: "Scale",
      actionRotate: "Rotate",
      actionTransform: "Transform",
      actionConvertJpg: "Convert to JPG",
      actionCompress: "Compress",
      noPublicUrl: "No public URL available for the selected file(s).",
      unableToEmbed: "Unable to embed: no active page editor found.",
      insertedSkipped:
        "Inserted {count} file(s); skipped {skipped} without a public URL.",
      insertedIntoPage: "Inserted {count} file(s) into page",
      type: "Type",
      extension: "Extension",
      extensionPlaceholder: "e.g. png",
      nameContains: "Name contains",
      nameContainsPlaceholder: "filename…",
      perPage: "Per page",
      refresh: "Refresh",
      refreshFileList: "Refresh file list",
      loading: "Loading…",
      filesPagination: "Files pagination",
      noFilesFound: "No files found.",
      selectAllFiles: "Select all files",
      preview: "Preview",
      file: "File",
      size: "Size",
      updated: "Updated",
      selectFile: "Select {name}",
      copyPath: "Copy path",
      pathCopied: "Path copied",
      embedInPage: "Embed in page",
      actionScaleChoose: "Scale\u2026",
      actionTransformChoose: "Transform\u2026",
      actionCompressChoose: "Compress\u2026",
      actionCropChoose: "Crop\u2026",
      actionCrop: "Crop",
      cropHeading: "Crop {name}",
      cropProgress: "Crop {current} of {total}: {name}",
      cropEditor: "Crop editor",
      cropReplaceNote:
        "Replaces {name} with the crop. It keeps its name and address, so every page using it shows the crop.",
      download: "Download",
      skip: "Skip",
      replaceOriginal: "Replace original",
      replaceAndNext: "Replace and next",
      cropAll: "Crop all {count} to {aspect}",
      cropAllNote:
        "Or crop this image and the {count} after it to the same shape, centered.",
      imageCropped: "{name} cropped",
      cropped: "Cropped",
      cropFailed: "Unable to crop {name}.",
      onlyCroppable: "Only JPG, PNG and WebP images can be cropped.",
      actionDuplicate: "Duplicate",
      actionRenameChoose: "Rename\u2026",
      actionDeleteChoose: "Delete\u2026",
      chooseScale: "Scale the selected images to",
      chooseTransform: "Transform the selected files",
      chooseCompress: "Compress the selected images",
      chooseInsert: "Embed the selected images as",
      insertGallery: "Gallery",
      insertImages: "Separate images",
      sepia: "Sepia",
      blackAndWhite: "Black and white",
      compressLight: "Light ({quality})",
      compressMedium: "Medium ({quality})",
      compressHeavy: "Heavy ({quality})",
      compressMaximum: "Maximum ({quality})",
      cancel: "Cancel",
      fileCount: "{count} file",
      filesCount: "{count} files",
      sortBy: "Sort",
      sortNewest: "Newest first",
      sortOldest: "Oldest first",
      sortName: "Name",
      sortLargest: "Largest first",
      selectAll: "Select all",
      openFile: "Open {name}",
      fileActions: "File actions",
      actionsFor: "Actions for {name}",
      rowActionsColumn: "Actions",
      openFileInNewTab: "Open file",
      files: "Files",
      filesDescription: "Everything uploaded to this site.",
      dropFiles: "Drop files here or",
      browseFiles: "browse",
      dropOrBrowse: "Drop files here or browse to upload",
      uploading: "Uploading\u2026",
      kindImage: "Image",
      kindVideo: "Video",
      kindAudio: "Audio",
      kindFile: "File",
      inspector: "File details",
      chooseFile: "Select only {name}",
      inspectorMany:
        "{count} files selected. Actions in the bar below apply to all of them.",
      sortAscending: "sorted ascending",
      sortDescending: "sorted descending",
      noneSelectedToInspect:
        "Select a file to see its details. Actions are in the bar below.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../locales/", import.meta.url).href,
    });
    this.rows = [];
    this.loading = false;
    this.busy = false;
    this.errorMessage = "";
    this.siteName = "";
    this.method = "POST";
    this.nodeId = "";
    this.scalePreset = "md";
    this.cacheBustToken = "0";
    this.__cacheBustCounter = 0;
    this.pageLimit = 25;
    this.pageOffset = 0;
    this.pageTotal = 0;
    this.filterType = "";
    this.filterExtension = "";
    this.filterNameContains = "";
    this.bulkBusy = false;
    this.inShell = false;
    this._choice = null;
    this.compact = false;
    this._sort = "updated-desc";
    this._focusKey = "";
    this._rowMenuFor = "";
    this._range = createRangeSelector();
    this._uploading = 0;
    this._brokenThumbs = new Set();
    this.__resizeObserver = null;
    this.selectedRows = new Set();
    this.__disposer = [];
    this.__boundFileAction = this._onFileAction.bind(this);
    this.__filterDebounceTimer = null;
  }

  static get styles() {
    return [
      ...super.styles,
      ...HaxUiAdminStyles,
      ...AdminRowMenuStyles,
      css`
        :host {
          display: flex;
          flex-direction: column;
          min-width: min(80vw, 1100px);
          max-height: calc(
            var(--simple-modal-height, 80vh) - var(
                --simple-modal-titlebar-height,
                80px
              ) - var(--ddd-spacing-8, 32px)
          );
          overflow: hidden;
          font-family: var(--hax-ui-admin-font-family);
          font-size: var(--hax-ui-admin-font-size);
          color: var(--hax-ui-text);
          background-color: var(--hax-ui-surface);
        }
        /* in the site admin dialog Files fills the body: the table and
           the inspector scroll on their own, the header and filters stay */
        :host([in-shell]) {
          display: flex;
          height: 100%;
          min-width: 0;
          max-height: none;
          overflow: hidden;
          container: files / inline-size;
        }
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }
        simple-icon-lite {
          --simple-icon-width: var(--hax-ui-icon);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-color: currentColor;
          flex: none;
        }
        .shell {
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-lg);
          flex: 1;
          min-height: 0;
          padding: var(--ddd-spacing-4, 16px);
        }
        :host([in-shell]) .shell {
          gap: 0;
          padding: 0;
          width: 100%;
        }
        /* page header with the slim drop zone beside it */
        .ph {
          display: flex;
          align-items: center;
          gap: var(--ddd-spacing-4, 16px);
          padding: var(--ddd-spacing-4, 16px) var(--ddd-spacing-5, 20px)
            var(--hax-ui-gap-md);
        }
        :host(:not([in-shell])) .ph {
          padding: 0 0 var(--hax-ui-gap-md);
        }
        .ph-text {
          flex: 1;
          min-width: 0;
        }
        .ph h2 {
          margin: 0;
          font-size: 22px;
          font-weight: var(--ddd-font-weight-bold, 700);
          line-height: 1.2;
        }
        .ph p {
          margin: var(--hax-ui-gap) 0 0;
          color: var(--hax-ui-text-muted);
        }
        /* the field that uploads: present for its picker and upload
           queue, not shown */
        .uploader {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          clip-path: inset(50%);
          white-space: nowrap;
        }
        :host([compact]) .ph {
          flex-direction: column;
          align-items: stretch;
          gap: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
        }
        :host([compact]) .ph h2 {
          font-size: 18px;
        }
        :host([compact]) .ph p {
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        :host([compact]) .add {
          width: 100%;
        }
        .upload-main hax-upload-field {
          display: block;
        }
        .bar {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md);
          align-items: center;
          padding: var(--hax-ui-gap-md) var(--ddd-spacing-5, 20px);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        :host(:not([in-shell])) .bar {
          padding: 0 0 var(--hax-ui-gap-lg);
        }
        :host([compact]) .bar {
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
        }
        .field.name input {
          width: 160px;
        }
        .field.ext input {
          width: 72px;
        }
        .sum {
          margin-left: auto;
          font-size: var(--hax-ui-admin-font-size-xs);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          color: var(--hax-ui-text-muted);
        }
        .status {
          min-height: 1.2em;
        }
        .status.error {
          color: var(--hax-ui-danger);
        }
        /* compact: no blank line while there is nothing to say; the live
           region stays in place for screen readers */
        .status.quiet {
          min-height: 0;
          margin-top: calc(-1 * var(--hax-ui-gap-md));
        }
        /* the table and the inspector side by side */
        .split {
          flex: 1;
          display: flex;
          min-height: 0;
        }
        .tw {
          flex: 1;
          min-width: 0;
          min-height: 0;
          overflow: auto;
        }
        :host(:not([in-shell])) .tw {
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
        }
        table.files {
          width: 100%;
          border-collapse: collapse;
          font-size: var(--hax-ui-admin-font-size);
        }
        /* undo the DDD content-table defaults (a border on every cell, body
           font size): this is an admin list with row dividers only */
        table.files thead,
        table.files tbody,
        table.files tr,
        table.files th,
        table.files td {
          border: 0 !important;
          font-family: inherit;
          font-size: inherit;
        }
        table.files th {
          position: sticky;
          top: 0;
          z-index: 1;
          height: 32px;
          padding: 0 var(--hax-ui-gap-md);
          text-align: left;
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-medium, 500);
          white-space: nowrap;
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-surface);
          border-bottom: 1px solid var(--hax-ui-line) !important;
        }
        table.files td {
          height: 40px;
          padding: 0 var(--hax-ui-gap-md);
          border-bottom: 1px solid var(--hax-ui-line) !important;
          white-space: nowrap;
        }
        table.files th:first-child,
        table.files td:first-child {
          padding-left: var(--ddd-spacing-5, 20px);
        }
        table.files .cbcol {
          width: 44px;
        }
        table.files tbody tr:hover {
          background-color: var(--hax-ui-hover);
        }
        table.files tr.sel,
        table.files tr.sel:hover {
          background-color: var(--hax-ui-selected);
        }
        table.files tr.focus {
          box-shadow: inset 3px 0 0 var(--hax-ui-accent-strong);
        }
        table.files .num {
          font-variant-numeric: tabular-nums;
          font-size: 13px;
          color: var(--hax-ui-text-muted);
        }
        table.files th.num,
        table.files td.num {
          text-align: right;
        }
        .cb {
          width: 16px;
          height: 16px;
          margin: 0;
          accent-color: var(--hax-ui-accent-strong);
        }
        .sort {
          all: unset;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 2px;
          border-radius: var(--hax-ui-radius);
        }
        .sort:hover {
          color: var(--hax-ui-text);
        }
        .sort:focus-visible,
        .fname:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .sort .dir {
          --simple-icon-width: 14px;
          --simple-icon-height: 14px;
          opacity: 0;
          transform: rotate(90deg);
        }
        .sort .dir.ascending {
          opacity: 1;
          transform: rotate(-90deg);
        }
        .sort .dir.descending {
          opacity: 1;
        }
        .fname {
          all: unset;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 100%;
          font-weight: var(--ddd-font-weight-medium, 500);
          border-radius: var(--hax-ui-radius);
        }
        .fname .nm {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        table.files td.fcol {
          max-width: 0;
          width: 100%;
        }
        .thumb.sm {
          width: 28px;
          height: 28px;
          flex: none;
          --simple-icon-width: 16px;
          --simple-icon-height: 16px;
        }
        .pill {
          display: inline-flex;
          align-items: center;
          padding: 0 var(--hax-ui-gap-md);
          border-radius: var(--hax-ui-radius-pill);
          font-size: var(--hax-ui-admin-font-size-xs);
          font-weight: var(--ddd-font-weight-medium, 500);
          line-height: 20px;
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-hover);
        }
        /* inspector */
        .insp {
          width: 300px;
          flex: none;
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: var(--ddd-spacing-4, 16px);
          overflow: auto;
          border-left: 1px solid var(--hax-ui-line);
        }
        @container files (max-width: 980px) {
          .insp {
            display: none;
          }
        }
        /* crop editor: takes the inspector's place, wider; on a narrow
           section it takes the list's place */
        .cropper {
          width: min(560px, 55%);
          flex: none;
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap-lg);
          padding: var(--ddd-spacing-4, 16px);
          overflow: auto;
          border-left: 1px solid var(--hax-ui-line);
          /* only focused to move focus in, never a tab stop */
          outline: none;
          /* leave room for the controls and the buttons under the image */
          --hax-image-crop-max-height: clamp(140px, 28vh, 480px);
        }
        @container files (max-width: 980px) {
          .split.cropping .tw {
            display: none;
          }
          .cropper {
            width: auto;
            flex: 1;
            border-left: 0;
          }
        }
        .crop-all {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          padding-top: var(--hax-ui-gap-lg);
          border-top: 1px solid var(--hax-ui-line);
        }
        .crop-all .hax-ui-note {
          flex: 1 1 200px;
          margin: 0;
        }
        /* key hints on the crop buttons, as on site admin's Save; only
           where there is a keyboard to press them */
        @media (hover: hover) and (pointer: fine) {
          .cropper .hax-ui-btn[data-shortcut]::after {
            content: attr(data-shortcut);
            margin-inline-start: var(--hax-ui-gap);
            padding: 0 var(--hax-ui-gap);
            line-height: 16px;
            font-family: var(--ddd-font-mono, monospace);
            font-size: var(--hax-ui-admin-font-size-xs);
            font-weight: var(--ddd-font-weight-bold, 700);
            border: 1px solid currentColor;
            border-bottom-width: var(--hax-ui-focus-width);
            border-radius: var(--hax-ui-radius);
            opacity: 0.8;
          }
        }
        :host([compact]) .cropper .hax-ui-btn[data-shortcut]::after {
          display: none;
        }
        .insp-empty {
          margin: 0;
          color: var(--hax-ui-text-muted);
        }
        .pvbig {
          height: 150px;
          flex: none;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-hover);
          --simple-icon-width: 40px;
          --simple-icon-height: 40px;
        }
        .pvbig img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .insp-name {
          margin: 0;
          font-size: 16px;
          font-weight: var(--ddd-font-weight-bold, 700);
          overflow-wrap: anywhere;
        }
        .insp dl {
          display: grid;
          grid-template-columns: 72px 1fr;
          gap: var(--hax-ui-gap) var(--hax-ui-gap-md);
          margin: 0;
          padding: 0;
          border: 0;
          font-size: 13px;
        }
        .insp dt,
        .insp dd {
          margin: 0;
          padding: 0;
          min-height: 0;
          font-size: inherit;
        }
        .insp dt {
          font-weight: var(--ddd-font-weight-regular, 400);
          color: var(--hax-ui-text-muted);
        }
        .insp dd {
          font-variant-numeric: tabular-nums;
        }
        .path {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          height: 32px;
          padding: 0 var(--hax-ui-gap) 0 var(--hax-ui-gap-md);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
          background-color: var(--hax-ui-hover);
          font-family:
            ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
          font-size: 12px;
        }
        .path span {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        /* the inspector path row is a compact line */
        .path .hax-ui-icon-btn {
          width: 28px;
          height: 28px;
        }
        .insp-multi {
          margin: 0;
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
        }
        :host([in-shell]) simple-pager {
          padding: var(--hax-ui-gap-md) var(--ddd-spacing-5, 20px);
          border-top: 1px solid var(--hax-ui-line);
        }
        simple-pager {
          --simple-pager-font-size: var(--hax-ui-admin-font-size-xs);
          margin: 0;
        }
        .ib {
          --simple-icon-button-border-radius: var(--hax-ui-radius);
          --simple-icon-button-border: 1px solid var(--hax-ui-line);
          --simple-icon-height: var(--hax-ui-icon);
          --simple-icon-width: var(--hax-ui-icon);
          padding: var(--hax-ui-gap);
        }
        .empty {
          padding: var(--ddd-spacing-4, 16px);
        }
        /* option chooser for bulk actions that need a value; sits above
           the shell action bar that opened it */
        .choice {
          position: sticky;
          bottom: var(--hax-ui-gap-md);
          z-index: 2;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-lg);
          border: 1px solid var(--hax-ui-line-strong);
          border-radius: var(--hax-ui-radius-lg);
          background-color: var(--hax-ui-surface);
          box-shadow: var(--hax-ui-shadow-popover);
        }
        .choice-title {
          margin-right: auto;
          font-weight: var(--ddd-font-weight-bold, 700);
        }
        .choice-opts {
          display: flex;
          flex-wrap: wrap;
          gap: var(--hax-ui-gap-md);
        }
        /* compact: a narrow section (phone, small dialog) */
        :host([compact]) {
          min-width: 0;
        }
        :host([compact]) .shell,
        :host([in-shell][compact]) .shell {
          gap: var(--hax-ui-gap-md);
          padding: var(--hax-ui-gap-md) var(--hax-ui-gap-md)
            var(--ddd-spacing-4, 16px);
        }
        .compact-bar {
          gap: var(--hax-ui-gap-md);
          padding-bottom: var(--hax-ui-gap-md);
        }
        .compact-bar .grow {
          flex: 1 1 160px;
          min-width: 0;
        }
        .compact-bar .grow input {
          width: 100%;
        }
        .compact-bar select {
          max-width: 150px;
        }
        .row2 {
          display: flex;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          width: 100%;
        }
        .row2 .sum {
          margin-left: auto;
        }
        .selall {
          display: inline-flex;
          align-items: center;
          gap: var(--hax-ui-gap);
          font-size: var(--hax-ui-admin-font-size-xs);
          white-space: nowrap;
        }
        .selall input,
        .card input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin: 0;
          accent-color: var(--hax-ui-accent-strong);
        }
        :host([compact]) .tw {
          border: 0;
          border-radius: 0;
          overflow: visible;
        }
        .cards {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap);
        }
        .card {
          display: grid;
          grid-template-columns: auto 48px minmax(0, 1fr) auto;
          align-items: center;
          gap: var(--hax-ui-gap-md);
          min-height: 64px;
          padding: var(--hax-ui-gap-md);
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius-lg);
          cursor: pointer;
          background-color: var(--hax-ui-surface);
        }
        .card:hover {
          background-color: var(--hax-ui-hover);
        }
        .card.selected {
          border-color: var(--hax-ui-accent-strong);
          background-color: var(--hax-ui-selected);
        }
        .card input:focus-visible,
        .selall input:focus-visible,
        .cbtn:focus-visible {
          outline: var(--hax-ui-focus-width) solid var(--hax-ui-focus);
          outline-offset: 2px;
        }
        .thumb {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text-muted);
          background-color: var(--hax-ui-hover);
          --simple-icon-width: 28px;
          --simple-icon-height: 28px;
        }
        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .info .name {
          font-size: var(--hax-ui-admin-font-size);
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: var(--ddd-font-weight-medium, 500);
        }
        .info .meta {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: var(--hax-ui-admin-font-size-xs);
          color: var(--hax-ui-text-muted);
          font-variant-numeric: tabular-nums;
        }
        .card-acts {
          display: inline-flex;
          align-items: center;
          gap: 2px;
        }
        /* the row ⋯: a narrow last column that opens the item menu */
        table.files .actcol {
          width: 40px;
          padding-left: 0;
          padding-right: var(--hax-ui-gap);
          text-align: right;
        }
        .cbtn {
          all: unset;
          box-sizing: border-box;
          cursor: pointer;
          display: inline-grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: var(--hax-ui-radius);
          color: var(--hax-ui-text);
        }
        .cbtn:hover {
          background-color: var(--hax-ui-hover);
        }
        .cbtn[disabled] {
          cursor: default;
          opacity: 0.6;
        }
        :host([compact]) simple-pager {
          align-self: center;
        }
        @media (max-width: 900px) {
          :host {
            min-width: 0;
            width: 100%;
          }
          .sum {
            margin-left: 0;
          }
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("hax-file-action", this.__boundFileAction);
    if (typeof globalThis.ResizeObserver === "function") {
      this.__resizeObserver = new globalThis.ResizeObserver((entries) => {
        const entry = entries && entries.length ? entries[0] : null;
        const width = entry ? entry.contentRect.width : this.offsetWidth;
        // 0 while hidden: keep the last layout
        if (width > 0) {
          const next = width < COMPACT_WIDTH;
          if (next !== this.compact) {
            this.compact = next;
          }
        }
      });
      this.__resizeObserver.observe(this);
    }
    this.__disposer.push(
      autorun(() => {
        const _mobx_val_0 = toJS(store.manifest);
        Promise.resolve().then(() => {
          const m = _mobx_val_0;
          if (m && m.metadata && m.metadata.site && m.metadata.site.name) {
            this.siteName = m.metadata.site.name;
          }
        });
      }),
    );
    this.__disposer.push(
      autorun(() => {
        const _mobx_val_0 = toJS(store.activeItem);
        Promise.resolve().then(() => {
          const ai = _mobx_val_0;
          if (ai && ai.id) {
            this.nodeId = ai.id;
          }
        });
      }),
    );
    // JWT is handled by MicroFrontendRegistry via Authorization header; no body injection needed
    this.refreshFiles();
  }

  disconnectedCallback() {
    this.removeEventListener("hax-file-action", this.__boundFileAction);
    if (this.__resizeObserver) {
      this.__resizeObserver.disconnect();
      this.__resizeObserver = null;
    }
    if (this.__filterDebounceTimer) {
      clearTimeout(this.__filterDebounceTimer);
      this.__filterDebounceTimer = null;
    }
    for (let i in this.__disposer) {
      const d = this.__disposer[i];
      if (typeof d === "function") {
        d();
      } else if (d && typeof d.dispose === "function") {
        d.dispose();
      }
    }
    this.__disposer = [];
    super.disconnectedCallback();
  }

  updated(cp) {
    if (super.updated) {
      super.updated(cp);
    }
    if (cp.has("siteName") && this._canList) {
      this.pageOffset = 0;
      this.refreshFiles();
    }
    // the inspected file went away (deleted, renamed, another page)
    if (cp.has("rows") && this._focusKey && !this._rowByKey(this._focusKey)) {
      this._focusKey = "";
    }
    if (this._choice && (this.selectedRows.size === 0 || this.busy)) {
      this._choice = null;
    }
    if (cp.has("_choice") && this._choice) {
      requestAnimationFrame(() => {
        const first =
          this.shadowRoot &&
          this.shadowRoot.querySelector(".choice-opts .hax-ui-btn");
        if (first) {
          first.focus();
        }
      });
    }
    if (
      cp.has("selectedRows") ||
      cp.has("rows") ||
      cp.has("busy") ||
      cp.has("loading") ||
      cp.has("_uploading") ||
      cp.has("nodeId") ||
      cp.has("siteName")
    ) {
      this._emitState();
    }
  }

  /**
   * Bulk actions for the shell's selection bar, available under the same
   * conditions as the options of the hax-file-actions select.
   */
  get selectionActions() {
    const selected = this._selectedRowObjects();
    const canScale = selected.some((r) => this._canScale(r));
    const busy = !!this.busy;
    return [
      { id: "insert", label: this.t.embedInPage, disabled: busy },
      {
        id: "crop",
        label: this.t.actionCropChoose,
        disabled: busy || !selected.some((r) => this._canCrop(r)),
      },
      {
        id: "scale",
        label: this.t.actionScaleChoose,
        disabled: busy || !canScale,
      },
      { id: "rotate", label: this.t.actionRotate, disabled: busy || !canScale },
      {
        id: "transform",
        label: this.t.actionTransformChoose,
        disabled: busy || !canScale,
      },
      {
        id: "compress",
        label: this.t.actionCompressChoose,
        disabled: busy || !canScale,
      },
      { id: "duplicate", label: this.t.actionDuplicate, disabled: busy },
      { id: "rename", label: this.t.actionRenameChoose, disabled: busy },
      {
        id: "delete",
        label: this.t.actionDeleteChoose,
        danger: true,
        disabled: busy,
      },
    ].map((action) => Object.assign({ icon: "", danger: false }, action));
  }

  _emitState() {
    this._dispatchSectionState({
      selected: this.selectedRows.size,
      actions: this.selectionActions,
      addArea: this.addArea,
    });
  }

  /** section contract: deselect every file */
  clearSelection() {
    this._choice = null;
    this.selectedRows = new Set();
  }

  /**
   * section contract: run a bulk action on the selected files. Takes an
   * action id from `selectionActions`, or "action:value" (the same values
   * hax-file-actions emits, e.g. "scale:md"). Actions that need a value
   * open a chooser first; every path ends in `_onFileAction`, so prompts,
   * confirms and file operations match the old bulk select exactly.
   * @param {string} id
   */
  runAction(id) {
    const raw = typeof id === "string" ? id.trim() : "";
    const sep = raw.indexOf(":");
    const action = sep === -1 ? raw : raw.substring(0, sep);
    let value = sep === -1 ? "" : raw.substring(sep + 1);
    const selected = this._selectedRowObjects();
    if (!action || this.busy || selected.length === 0) {
      return;
    }
    if (!value) {
      switch (action) {
        case "rotate":
          value = "rotate-90";
          break;
        case "duplicate":
        case "rename":
        case "delete":
          value = action;
          break;
        case "insert": {
          const images = selected.filter((r) => this._isImg(r)).length;
          if (selected.length >= 2 && images === selected.length) {
            this._openChoice(action);
            return;
          }
          value = "standalone";
          break;
        }
        case "scale":
        case "transform":
        case "compress":
          this._openChoice(action);
          return;
        case "crop":
          this._openCrop(selected);
          return;
        default:
          return;
      }
    }
    this._choice = null;
    this._onFileAction({ detail: { action: action, value: value } });
  }

  _choiceOptions(action) {
    switch (action) {
      case "insert":
        return [
          { value: "gallery", label: this.t.insertGallery },
          { value: "standalone", label: this.t.insertImages },
        ];
      case "scale":
        return Object.keys(SCALE_PRESETS).map((key) => ({
          value: key,
          label: SCALE_PRESETS[key].label,
        }));
      case "transform":
        return [
          { value: "convert-jpg", label: this.t.actionConvertJpg },
          { value: "sepia", label: this.t.sepia },
          { value: "black-and-white", label: this.t.blackAndWhite },
        ];
      case "compress": {
        const labels = {
          light: this.t.compressLight,
          medium: this.t.compressMedium,
          heavy: this.t.compressHeavy,
          maximum: this.t.compressMaximum,
        };
        return COMPRESS_LEVELS.map((key) => ({
          value: key,
          label: (labels[key] || key).replace("{quality}", () =>
            COMPRESS_PRESETS[key] ? COMPRESS_PRESETS[key].quality : "",
          ),
        }));
      }
      default:
        return [];
    }
  }

  _openChoice(action) {
    const titles = {
      insert: this.t.chooseInsert,
      scale: this.t.chooseScale,
      transform: this.t.chooseTransform,
      compress: this.t.chooseCompress,
    };
    this._choice = {
      action: action,
      title: titles[action] || action,
      options: this._choiceOptions(action),
    };
  }

  _closeChoice() {
    this._choice = null;
  }

  _onChoiceKeydown(e) {
    closeChoiceOnEscape(e, this);
  }

  _renderChoice() {
    const choice = this._choice;
    return html`<div
      class="choice"
      role="group"
      aria-labelledby="choice-title"
      @keydown="${this._onChoiceKeydown}"
    >
      <span class="choice-title" id="choice-title">${choice.title}</span>
      <div class="choice-opts">
        ${choice.options.map(
          (option) =>
            html`<button
              type="button"
              class="hax-ui-btn"
              data-choice="${option.value}"
              @click="${() =>
                this.runAction(`${choice.action}:${option.value}`)}"
            >
              ${option.label}
            </button>`,
        )}
      </div>
      <button
        type="button"
        class="hax-ui-btn ghost choice-cancel"
        @click="${this._closeChoice}"
      >
        ${this.t.cancel}
      </button>
    </div>`;
  }

  _setFilterType(value) {
    this._onFilterTypeChanged({ detail: { value: value } });
  }

  get _canList() {
    return this.siteName !== "";
  }
  get _canUpload() {
    return this.siteName !== "" && this.nodeId !== "";
  }
  get _canOp() {
    return this.siteName !== "";
  }

  _s(v) {
    return typeof v === "string" ? v.trim() : "";
  }

  _normPath(v) {
    const c = this._s(v).replace(/\\/g, "/");
    if (!c) return "";
    if (c.indexOf("files/") === 0) return c;
    const i = c.toLowerCase().indexOf("/files/");
    if (i !== -1) return c.substring(i + 1);
    const j = c.toLowerCase().indexOf("files/");
    if (j !== -1) return c.substring(j);
    return c;
  }

  _baseName(v) {
    const c = this._s(v).split("?")[0];
    if (!c) return "";
    const p = c.split("/");
    return p.length ? p[p.length - 1] : c;
  }
  _nameWithoutExt(v) {
    const c = this._s(v);
    if (!c) return "";
    const i = c.lastIndexOf(".");
    if (i <= 0) return c;
    return c.substring(0, i);
  }
  _dateMs(v) {
    if (typeof v === "number" && Number.isFinite(v) && v > 0) {
      const normalized = v < 1000000000000 ? v * 1000 : v;
      const d = new Date(normalized);
      return Number.isNaN(d.getTime()) ? 0 : normalized;
    }
    if (typeof v !== "string") return 0;
    const c = v.trim();
    if (!c) return 0;
    if (/^[0-9]+$/.test(c)) {
      const i = parseInt(c, 10);
      if (!Number.isNaN(i) && i > 0) {
        const normalized = i < 1000000000000 ? i * 1000 : i;
        const d = new Date(normalized);
        return Number.isNaN(d.getTime()) ? 0 : normalized;
      }
    }
    const d = new Date(c);
    if (Number.isNaN(d.getTime())) return 0;
    return d.getTime();
  }
  _dateValue(v) {
    const ms = this._dateMs(v);
    if (!ms) return "";
    return new Date(ms).toISOString();
  }
  _fmtDate(v) {
    const i = this._dateValue(v);
    if (!i) return "\u2014";
    return i.replace("T", " ").replace("Z", " UTC");
  }
  _fmtRelativeDate(v) {
    const ms = this._dateMs(v);
    if (!ms) return "—";
    const nowMs = Date.now();
    let delta = Math.floor((nowMs - ms) / 1000);
    if (delta < 0) {
      delta = 0;
    }
    const month = 2592000;
    const day = 86400;
    const hour = 3600;
    const minute = 60;
    if (delta >= month) {
      const months = Math.floor(delta / month);
      return this.t.timeAgo.replace(
        "{time}",
        () => `${months} ${months === 1 ? this.t.month : this.t.months}`,
      );
    }
    if (delta >= day) {
      const days = Math.floor(delta / day);
      return this.t.timeAgo.replace(
        "{time}",
        () => `${days} ${days === 1 ? this.t.day : this.t.days}`,
      );
    }
    if (delta >= hour) {
      const hours = Math.floor(delta / hour);
      const minutes = Math.floor((delta % hour) / minute);
      if (minutes > 0) {
        return this.t.timeAgo.replace(
          "{time}",
          () =>
            `${hours} ${hours === 1 ? this.t.hour : this.t.hours} ${minutes} ${minutes === 1 ? this.t.minute : this.t.minutes}`,
        );
      }
      return this.t.timeAgo.replace(
        "{time}",
        () => `${hours} ${hours === 1 ? this.t.hour : this.t.hours}`,
      );
    }
    if (delta >= minute) {
      const minutes = Math.floor(delta / minute);
      const seconds = Math.floor(delta % minute);
      return this.t.timeAgo.replace(
        "{time}",
        () =>
          `${minutes} ${minutes === 1 ? this.t.minute : this.t.minutes} ${seconds} ${seconds === 1 ? this.t.second : this.t.seconds}`,
      );
    }
    return this.t.timeAgo.replace(
      "{time}",
      () => `${delta} ${delta === 1 ? this.t.second : this.t.seconds}`,
    );
  }

  _mime(v) {
    const ext = this._s(v).toLowerCase().split("?")[0].split(".").pop();
    const m = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      gif: "image/gif",
      webp: "image/webp",
      svg: "image/svg+xml",
      avif: "image/avif",
      bmp: "image/bmp",
      tif: "image/tiff",
      tiff: "image/tiff",
      mp4: "video/mp4",
      webm: "video/webm",
      mov: "video/quicktime",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      m4a: "audio/mp4",
      pdf: "application/pdf",
    };
    return ext && m[ext] ? m[ext] : "";
  }

  _sz(v) {
    if (typeof v === "number") return v;
    if (typeof v === "string" && v) {
      const n = parseInt(v, 10);
      return Number.isNaN(n) ? 0 : n;
    }
    return 0;
  }

  _fmtBytes(s) {
    let v = this._sz(s);
    if (!v) return "\u2014";
    const u = ["B", "KB", "MB", "GB"];
    let i = 0;
    while (v >= 1024 && i < u.length - 1) {
      v /= 1024;
      i++;
    }
    return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${u[i]}`;
  }

  _pubUrl(row) {
    const f = this._s(row.fullUrl || "");
    if (f) {
      if (f.indexOf("http") === 0 || f.indexOf("/") === 0) return f;
      return "/" + f.replace(/^\/+/, "");
    }
    const p = this._s(row.path || "");
    return p ? "/" + p.replace(/^\/+/, "") : "";
  }

  _normItem(item, idx) {
    if (!item || typeof item !== "object") return null;
    const p = this._normPath(item.path || item.url || item.file || "");
    if (!p || p.indexOf("files/") !== 0) return null;
    const mt =
      this._s(item.mimetype || item.type || item.mimeType) || this._mime(p);
    const updatedValue =
      item.updated ||
      item.dateUpdated ||
      item.modified ||
      item.lastModified ||
      item.mtime ||
      item.dateCreated ||
      item.created ||
      "";
    const r = {
      id: this._s(item.id) || `${p}-${idx}`,
      path: p,
      uuid: this._s(item.uuid || item.fileUuid || item.id || ""),
      fullUrl: this._s(item.fullUrl || ""),
      name: this._s(item.name) || this._baseName(p),
      mimetype: mt,
      size: this._sz(item.size),
      updated: this._dateValue(updatedValue),
      dateCreated: this._dateValue(item.dateCreated || item.created || ""),
    };
    r.publicUrl = this._pubUrl(r);
    return r;
  }

  _normPayload(d) {
    const arr = d && d.data && Array.isArray(d.data.files) ? d.data.files : [];
    const rows = [];
    arr.forEach((it, i) => {
      const n = this._normItem(it, i);
      if (n) rows.push(n);
    });
    rows.sort((a, b) => a.path.localeCompare(b.path));
    return rows;
  }

  _readPageTotal(response) {
    const data = response && response.data ? response.data : null;
    if (!data) {
      return 0;
    }
    if (typeof data.total === "number") {
      return data.total;
    }
    if (data.page && typeof data.page.total === "number") {
      return data.page.total;
    }
    return 0;
  }

  _onPageChanged(e) {
    if (!e || !e.detail) {
      return;
    }
    this.pageLimit = e.detail.limit;
    this.pageOffset = e.detail.offset;
    this.refreshFiles();
  }

  _debounceFilterRefresh() {
    if (this.__filterDebounceTimer) {
      clearTimeout(this.__filterDebounceTimer);
    }
    this.__filterDebounceTimer = setTimeout(() => {
      this.__filterDebounceTimer = null;
      this.pageOffset = 0;
      this.refreshFiles();
    }, 400);
  }
  _onFilterTypeChanged(e) {
    const value =
      e && e.detail && typeof e.detail.value === "string"
        ? e.detail.value.trim()
        : "";
    if (value === this.filterType) return;
    this.filterType = value;
    this._debounceFilterRefresh();
  }
  _onFilterExtensionChanged(e) {
    const value =
      e && e.detail && typeof e.detail.value === "string"
        ? e.detail.value.trim()
        : "";
    if (value === this.filterExtension) return;
    this.filterExtension = value;
    this._debounceFilterRefresh();
  }
  _onFilterNameContainsChanged(e) {
    const value =
      e && e.detail && typeof e.detail.value === "string"
        ? e.detail.value.trim()
        : "";
    if (value === this.filterNameContains) return;
    this.filterNameContains = value;
    this._debounceFilterRefresh();
  }
  _onFilterKeydown(e, propName) {
    if (e && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      if (this[propName]) {
        this[propName] = "";
        this._debounceFilterRefresh();
      }
    }
  }
  _onPageSizeChanged(e) {
    const raw =
      e && e.detail && typeof e.detail.value === "string"
        ? e.detail.value.trim()
        : "";
    const parsed = parseInt(raw, 10);
    const next = PAGE_SIZE_OPTIONS.includes(parsed) ? parsed : 25;
    if (next === this.pageLimit) return;
    this.pageLimit = next;
    this.pageOffset = 0;
    this.refreshFiles();
  }

  _isImg(r) {
    return (
      r &&
      typeof r.mimetype === "string" &&
      r.mimetype.toLowerCase().indexOf("image/") === 0
    );
  }
  _canScale(r) {
    return this._isImg(r) && r.mimetype.toLowerCase().indexOf("svg") === -1;
  }
  _canConvertToJpg(r) {
    return this._canScale(r);
  }
  /** JPG, PNG and WebP: what a browser canvas can write back */
  _canCrop(r) {
    return this._isImg(r) && canCropMime(r.mimetype);
  }

  _nextCacheBustToken() {
    this.__cacheBustCounter += 1;
    return `${Date.now()}-${this.__cacheBustCounter}`;
  }
  _withCacheBust(url, token = this.cacheBustToken) {
    const cleanUrl = this._s(url);
    const cleanToken = this._s(token);
    if (!cleanUrl || !cleanToken) return cleanUrl;
    if (/[?&]cb=/.test(cleanUrl)) {
      return cleanUrl.replace(/([?&])cb=[^&]*/g, `$1cb=${cleanToken}`);
    }
    return `${cleanUrl}${cleanUrl.indexOf("?") === -1 ? "?" : "&"}cb=${cleanToken}`;
  }
  _previewUrl(row) {
    if (!row || !row.publicUrl) return "";
    return this._withCacheBust(row.publicUrl, this.cacheBustToken);
  }
  _statusCode(response) {
    if (!response || typeof response !== "object") return 0;
    if (typeof response.status === "number") return response.status;
    if (typeof response.status === "string") {
      const parsed = parseInt(response.status, 10);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  }
  _messageFromResponse(response, fallbackMessage) {
    if (!response || typeof response !== "object") return fallbackMessage;
    const apiText = haxcmsApiMessage(response, "");
    if (apiText) return apiText;
    const status = this._statusCode(response);
    if (status > 0) {
      return `${fallbackMessage} (${status})`;
    }
    return fallbackMessage;
  }

  async refreshFiles() {
    if (!this._canList) return;
    const cacheBustToken = this._nextCacheBustToken();
    this.cacheBustToken = cacheBustToken;
    this.loading = true;
    this.errorMessage = "";
    try {
      await waitForHAXCMSSiteApiRegistryReady();
      if (
        !MicroFrontendRegistry ||
        typeof MicroFrontendRegistry.call !== "function" ||
        typeof MicroFrontendRegistry.has !== "function" ||
        !MicroFrontendRegistry.has("@site/listFiles")
      ) {
        this.errorMessage = this.t.unableToLoadFiles;
        this.rows = [];
        this.pageTotal = 0;
        return;
      }
      const params = {
        cb: cacheBustToken,
        "page.limit": this.pageLimit,
        "page.offset": this.pageOffset,
      };
      if (this.filterType) {
        params["filter.type"] = this.filterType;
      }
      if (this.filterExtension) {
        params["filter.extension"] = this.filterExtension;
      }
      if (this.filterNameContains) {
        params["filter.nameContains"] = this.filterNameContains;
      }
      const response = await MicroFrontendRegistry.call(
        "@site/listFiles",
        params,
        null,
        this,
      );
      const status = this._statusCode(response);
      if (status !== 200) {
        this.errorMessage = this._messageFromResponse(
          response,
          this.t.unableToLoadFiles,
        );
        this.rows = [];
        this.pageTotal = 0;
        return;
      }
      this.pageTotal = this._readPageTotal(response);
      this.rows = this._normPayload(response);
      this.selectedRows = new Set();
    } catch {
      this.errorMessage = this.t.unableToLoadFiles;
      this.rows = [];
      this.pageTotal = 0;
    } finally {
      this.loading = false;
    }
  }

  _uploader() {
    return this.shadowRoot
      ? this.shadowRoot.querySelector("hax-upload-field.uploader")
      : null;
  }

  /**
   * The add area (area 9): what the shell draws in the page header, or
   * what this section draws in its own header outside the shell. Browse
   * opens the upload field's own picker; dropped files go to its queue.
   */
  get addArea() {
    const uploading = this._uploading > 0;
    return {
      accept: "",
      label: uploading ? this.t.uploading : this.t.dropFiles,
      browseLabel: uploading ? "" : this.t.browseFiles,
      hint: this.t.dropOrBrowse,
      disabled: !this._canUpload || this.busy,
      busy: uploading,
      browseHandled: true,
    };
  }

  _renderAddArea() {
    const area = this.addArea;
    return html`<haxcms-admin-add-area
      class="add"
      label="${area.label}"
      browse-label="${area.browseLabel}"
      hint="${area.hint}"
      ?disabled="${area.disabled}"
      ?busy="${area.busy}"
      browse-handled
      @admin-add-files="${(e) => this.addFiles(e.detail)}"
      @admin-add-browse="${() => this.browseFiles()}"
    ></haxcms-admin-add-area>`;
  }

  /** section contract: Browse opens the upload field's picker */
  browseFiles() {
    this._browseToUpload();
  }

  /** open the file picker of the upload field */
  _browseToUpload(e) {
    const field = this._uploader();
    if (field && typeof field._handleBrowse === "function") {
      field._handleBrowse(e || { preventDefault() {} });
    }
  }

  /**
   * section contract: files from the add area go to the upload field's
   * queue, the same queue a drop on the old zone filled
   * @param {{ files: File[], event: DragEvent }} detail
   */
  addFiles(detail) {
    if (!this._canUpload || this.busy || !detail) {
      return;
    }
    const field = this._uploader();
    const queue =
      field && field.shadowRoot
        ? field.shadowRoot.querySelector("#fileupload")
        : null;
    if (queue && typeof queue.handleDrop === "function") {
      queue.handleDrop(
        detail.event && detail.event.dataTransfer
          ? detail.event
          : { dataTransfer: { files: detail.files || [] } },
      );
    }
  }

  _onUploadStart() {
    this._uploading = this._uploading + 1;
  }

  _onUploadEnd() {
    this._uploading = Math.max(0, this._uploading - 1);
  }

  _onHaxUploadValueChanged(e) {
    const value =
      e && e.detail && typeof e.detail.value === "string" ? e.detail.value : "";
    if (!value) return;
    this.errorMessage = "";
    this._msg(this.t.uploadComplete);
    this.refreshFiles();
  }

  _rowKey(row) {
    return row ? this._s(row.uuid || row.id || row.path) : "";
  }
  _isRowSelected(row) {
    return this.selectedRows.has(this._rowKey(row));
  }
  _toggleRowSelected(row, checked) {
    const key = this._rowKey(row);
    if (!key) return;
    const next = new Set(this.selectedRows);
    if (checked) {
      next.add(key);
    } else {
      next.delete(key);
    }
    this.selectedRows = next;
  }
  _toggleSelectAll(checked) {
    if (checked) {
      this.selectedRows = new Set(this.rows.map((r) => this._rowKey(r)));
    } else {
      this.selectedRows = new Set();
    }
  }
  _selectedRowObjects() {
    return this.rows.filter((r) => this.selectedRows.has(this._rowKey(r)));
  }
  /**
   * The file actions menu: a right click or long press on a file, Shift+F10
   * or the context menu key. A file that is not selected becomes the only
   * selection first, as a click on its name does, so the menu acts on what
   * the action bar acts on; its items run the same runAction the bar does.
   */
  _onRowContextMenu(e) {
    // Android's own long-press contextmenu, after ours already opened it
    if (
      e.type === "contextmenu" &&
      e.cancelable &&
      this._longPress.justOpened()
    ) {
      e.preventDefault();
      return;
    }
    const row = this._menuRow(e);
    if (!row) {
      return;
    }
    e.preventDefault();
    this._openRowMenu(row, e);
  }

  /**
   * Row shortcuts the item menu shows, the same keys outline-designer uses
   * (Del deletes, F2 renames, Ctrl+D duplicates): the row becomes the
   * selection when it is not part of it, as the menu does, then the bar's
   * runAction runs. Returns true when one ran.
   */
  _runRowShortcut(e) {
    const id = Object.keys(FILES_ROW_SHORTCUTS).find((key) =>
      FILES_ROW_SHORTCUTS[key].keys.some((k) => matchesAdminShortcut(e, k)),
    );
    if (!id || this.busy) {
      return false;
    }
    const row = this._menuRow(e);
    const r = row ? this._rowByKey(row.getAttribute("data-row-key")) : null;
    if (!r) {
      return false;
    }
    if (!this._isRowSelected(r)) {
      this._chooseRow(r);
    }
    const action = this.selectionActions.find((a) => a.id === id);
    if (!action || action.disabled) {
      return false;
    }
    e.preventDefault();
    this.runAction(id);
    return true;
  }

  _onRowMenuKey(e) {
    if (this._runRowShortcut(e)) {
      return;
    }
    if (!isAdminRowMenuKey(e)) {
      this._onListKey(e);
      return;
    }
    const row = this._menuRow(e);
    if (!row) {
      return;
    }
    e.preventDefault();
    this._openRowMenu(row, e);
  }

  /**
   * The keyboard every admin list shares: arrows between rows, Shift+arrows
   * extend the selection, Space checks the row, Ctrl+A all, Escape clears.
   */
  _onListKey(e) {
    if (this.busy) {
      return;
    }
    const keyOf = (el) => el.getAttribute("data-row-key");
    handleAdminListKey(e, {
      rows: () => [
        ...this.shadowRoot.querySelectorAll(
          "table.files tbody tr[data-row-key], ul.cards li.card[data-row-key]",
        ),
      ],
      isChecked: (el) => this.selectedRows.has(keyOf(el)),
      setChecked: (el, checked) => {
        const r = this._rowByKey(keyOf(el));
        if (r) {
          this._checkRow(r, checked);
        }
      },
      selectAll: () => this._toggleSelectAll(true),
      clear: () => {
        if (!this.selectedRows.size) {
          return false;
        }
        this.clearSelection();
        return true;
      },
    });
  }

  /**
   * A checkbox change; Shift held on its click checks or unchecks every
   * file between it and the last checkbox clicked.
   */
  _onRowCheck(r, e) {
    const rows = this._sortedRows();
    const index = rows.indexOf(r);
    const shift = !!this.__shiftCheck;
    this.__shiftCheck = false;
    const next = new Set(this.selectedRows);
    const checked = e.target.checked;
    this._range.click(index, checked, shift, (i, on) => {
      const key = this._rowKey(rows[i]);
      if (!key) return;
      if (on) {
        next.add(key);
      } else {
        next.delete(key);
      }
    });
    this.selectedRows = next;
    if (checked) {
      this._focusKey = this._rowKey(r);
    }
  }

  /** the file row or card an event is for */
  _menuRow(e) {
    const target = e.composedPath ? e.composedPath()[0] : e.target;
    if (!target || !target.closest) {
      return null;
    }
    return target.closest("tr[data-row-key], li.card[data-row-key]");
  }

  _openRowMenu(row, e, anchorTo) {
    const key = row.getAttribute("data-row-key");
    const r = this._rowByKey(key);
    if (!r) {
      return;
    }
    if (!this._isRowSelected(r) && !this.busy) {
      this._chooseRow(r);
    }
    this._rowMenuFor = key;
    const anchor = anchorTo
      ? anchorTo
      : e.type === "keydown" && e.target && e.target.closest
        ? e.target
        : row;
    this.updateComplete.then(() => {
      openAdminRowMenu(
        this.shadowRoot.querySelector(".admin-row-menu"),
        e,
        anchor,
      );
    });
  }

  _rowMenuItems() {
    const r = this._rowMenuFor ? this._rowByKey(this._rowMenuFor) : null;
    if (!r) {
      return [];
    }
    const items = [];
    if (r.publicUrl) {
      items.push({
        id: "open",
        label: this.t.openFileInNewTab,
        icon: HaxUiAdminIcons.external,
        run: () => globalThis.open(r.publicUrl, "_blank", "noopener"),
      });
      items.push({ separator: true });
    }
    // the bar shows these as words; the menu gives each an icon, as
    // outline-designer's page menu does
    const icons = {
      insert: HaxUiAdminIcons.add,
      crop: HaxUiAdminIcons.crop,
      scale: HaxUiAdminIcons.image,
      rotate: HaxUiAdminIcons.refresh,
      transform: HaxUiAdminIcons.image,
      compress: HaxUiAdminIcons.download,
      duplicate: HaxUiAdminIcons.copy,
      rename: HaxUiAdminIcons.edit,
      delete: HaxUiAdminIcons.delete,
    };
    this.selectionActions.forEach((action) => {
      items.push(
        Object.assign({}, action, {
          icon: action.icon || icons[action.id] || "",
          shortcut: FILES_ROW_SHORTCUTS[action.id],
          run: () => this.runAction(action.id),
        }),
      );
    });
    return items;
  }

  _rowByKey(key) {
    const k = this._s(key);
    if (!k) return null;
    return this.rows.find((r) => this._rowKey(r) === k) || null;
  }
  _toggleRowSelectedByKey(key, checked) {
    const k = this._s(key);
    if (!k) return;
    const next = new Set(this.selectedRows);
    if (checked) {
      next.add(k);
    } else {
      next.delete(k);
    }
    this.selectedRows = next;
  }
  _onFileAction(e) {
    if (!e || !e.detail || this.busy) return;
    const selected = this._selectedRowObjects();
    if (selected.length === 0) return;
    const action = e.detail.action;
    const value = typeof e.detail.value === "string" ? e.detail.value : "";
    if (action === "scale") {
      this._onBulkScale(selected, value);
    } else if (action === "rotate") {
      this._onBulkRotate(selected);
    } else if (action === "transform") {
      this._onBulkTransform(selected, value);
    } else if (action === "compress") {
      this._onBulkCompress(selected, value);
    } else if (action === "duplicate") {
      this._onBulkDuplicate(selected);
    } else if (action === "rename") {
      this._onBulkRename(selected);
    } else if (action === "delete") {
      this._onBulkDelete(selected);
    } else if (action === "insert") {
      this._onBulkInsert(selected, value);
    }
  }
  async _op(row, op, options = {}) {
    const silent = !!(options && options.silent);
    const skipRefresh = !!(options && options.skipRefresh);
    if (!this._canOp) {
      if (!silent) this._msg(this.t.unableToRunFileOperation, true);
      return { ok: false, message: this.t.unableToRunFileOperation };
    }
    if (!silent) this.busy = true;
    this.errorMessage = "";
    try {
      const fileUuid = this._s(row && row.uuid ? row.uuid : "");
      if (!fileUuid) {
        this.errorMessage = this.t.fileUuidMissing;
        if (!silent) this._msg(this.errorMessage, true);
        return { ok: false, message: this.errorMessage };
      }
      await waitForHAXCMSSiteApiRegistryReady();
      const operationName =
        op === "delete" ? "@site/deleteFileByUuid" : "@site/updateFileByUuid";
      if (
        !MicroFrontendRegistry ||
        typeof MicroFrontendRegistry.call !== "function" ||
        typeof MicroFrontendRegistry.has !== "function" ||
        !MicroFrontendRegistry.has(operationName)
      ) {
        this.errorMessage = this.t.fileOperationEndpointUnavailable;
        if (!silent) this._msg(this.errorMessage, true);
        return { ok: false, message: this.errorMessage };
      }
      const params = { fileUuid };
      if (op !== "delete") {
        params.operation = op;
      }
      if (options && typeof options.size === "string" && options.size) {
        params.size = options.size;
      }
      if (options && typeof options.newName === "string" && options.newName) {
        params.newName = options.newName;
      }
      if (options && typeof options.level === "string" && options.level) {
        params.level = options.level;
      }
      const d = await MicroFrontendRegistry.call(
        operationName,
        params,
        null,
        this,
      );
      const status = this._statusCode(d);
      if (status !== 200) {
        this.errorMessage = this._messageFromResponse(
          d,
          this.t.fileOperationFailed,
        );
        if (!silent) this._msg(this.errorMessage, true);
        return { ok: false, message: this.errorMessage };
      }
      let message = this.t.fileOperationComplete;
      if (op === "delete") message = this.t.fileDeleted;
      else if (op === "rename") message = this.t.fileRenamed;
      else if (op === "convert-jpg") message = this.t.imageConvertedToJpg;
      else if (op === "rotate-90") message = this.t.imageRotated90;
      else if (op === "sepia") message = this.t.imageTransformedSepia;
      else if (op === "black-and-white")
        message = this.t.imageTransformedBlackAndWhite;
      else if (op === "scale" && options && options.size)
        message = this.t.scaledTo.replace("{size}", () => options.size);
      else if (op === "compress" && options && options.level)
        message = this.t.compressedLevel.replace(
          "{level}",
          () => options.level,
        );
      else if (op === "duplicate") message = this.t.fileDuplicated;
      if (!silent) this._msg(message);
      if (!skipRefresh) await this.refreshFiles();
      return { ok: true, message };
    } catch {
      this.errorMessage = this.t.fileOperationFailed;
      if (!silent) this._msg(this.errorMessage, true);
      return { ok: false, message: this.errorMessage };
    } finally {
      if (!silent) this.busy = false;
    }
  }

  /**
   * Runs `opFn` sequentially against each row in `rows`, aggregating
   * success/failure counts. For multi-row batches a live "Processing N of M"
   * toast updates as each file is processed (the toast just presents the
   * text; the counting lives here per #3050). When opts.refreshMedia is true,
   * each successful image op also fires HAXStore.refreshMediaSource so every
   * place in the active page currently displaying that file re-fetches the
   * fresh bytes without a page reload.
   */
  async _runBulkOp(rows, opFn, summaryVerb, opts = {}) {
    if (!rows || rows.length === 0) return;
    const refreshMedia = !!(opts && opts.refreshMedia);
    const multi = rows.length > 1;
    this.busy = true;
    this.bulkBusy = true;
    this.errorMessage = "";
    let okCount = 0;
    let failCount = 0;
    let lastError = "";
    try {
      for (let idx = 0; idx < rows.length; idx++) {
        const row = rows[idx];
        if (multi) {
          this._msg(
            this.t.processingProgress
              .replace("{current}", () => idx + 1)
              .replace("{total}", () => rows.length),
          );
        }
        const result = await opFn(row, idx);
        if (result && result.ok) {
          okCount++;
          if (
            refreshMedia &&
            this._isImg(row) &&
            HAXStore &&
            typeof HAXStore.refreshMediaSource === "function"
          ) {
            HAXStore.refreshMediaSource(
              row.publicUrl || row.fullUrl || row.path || "",
            );
          }
        } else {
          failCount++;
          const resultText = haxcmsApiMessage(result, "");
          if (resultText) lastError = resultText;
        }
      }
      await this.refreshFiles();
      if (failCount === 0) {
        this._msg(
          (okCount === 1 ? this.t.bulkSummaryFile : this.t.bulkSummaryFiles)
            .replace("{verb}", () => summaryVerb)
            .replace("{count}", () => okCount),
        );
      } else if (okCount === 0) {
        this.errorMessage =
          lastError || this.t.bulkFailed.replace("{verb}", () => summaryVerb);
        this._msg(
          (failCount === 1
            ? this.t.bulkFailedAllFile
            : this.t.bulkFailedAllFiles
          )
            .replace("{verb}", () => summaryVerb)
            .replace("{count}", () => failCount),
          true,
        );
      } else {
        this._msg(
          this.t.bulkPartial
            .replace("{verb}", () => summaryVerb)
            .replace("{ok}", () => okCount)
            .replace("{failed}", () => failCount),
          true,
        );
      }
    } finally {
      this.busy = false;
      this.bulkBusy = false;
    }
  }

  /**
   * Confirm in-place bulk operations (scale, rotate, transform, compress) that
   * overwrite the original files. Single-file actions are not prompted.
   * The HAX UI confirm matches the delete flow: focus is trapped, Escape
   * cancels and the cancel action is focused first.
   * @returns {Promise<boolean>}
   */
  async _confirmBulkOverwrite(count, actionLabel) {
    if (count < 2) return true;
    return adminConfirm({
      title: this.t.replaceOriginalsTitle,
      message: this.t.bulkOverwriteConfirm
        .replace("{action}", () => actionLabel)
        .replace("{count}", () => count),
      confirmLabel: actionLabel,
      cancelLabel: this.t.cancel,
      danger: true,
    });
  }
  async _onBulkScale(rows, size) {
    const normalizedSize = typeof size === "string" ? size.trim() : "";
    if (!normalizedSize || !SCALE_PRESETS[normalizedSize]) return;
    const scalable = rows.filter((r) => this._canScale(r));
    if (scalable.length === 0) {
      this._msg(this.t.onlyRasterScaled, true);
      return;
    }
    if (
      !(await this._confirmBulkOverwrite(scalable.length, this.t.actionScale))
    )
      return;
    this.scalePreset = normalizedSize;
    await this._runBulkOp(
      scalable,
      (row) =>
        this._op(row, "scale", {
          size: normalizedSize,
          silent: true,
          skipRefresh: true,
        }),
      this.t.scaledTo.replace("{size}", () => normalizedSize),
      { refreshMedia: true },
    );
  }
  async _onBulkRotate(rows) {
    const scalable = rows.filter((r) => this._canScale(r));
    if (scalable.length === 0) {
      this._msg(this.t.onlyRasterRotated, true);
      return;
    }
    if (
      !(await this._confirmBulkOverwrite(scalable.length, this.t.actionRotate))
    )
      return;
    await this._runBulkOp(
      scalable,
      (row) => this._op(row, "rotate-90", { silent: true, skipRefresh: true }),
      this.t.rotated,
      { refreshMedia: true },
    );
  }
  async _onBulkTransform(rows, op) {
    const normalizedOp = typeof op === "string" ? op.trim() : "";
    if (!normalizedOp) return;
    let applicable;
    if (normalizedOp === "convert-jpg") {
      applicable = rows.filter((r) => this._canConvertToJpg(r));
      if (applicable.length === 0) {
        this._msg(this.t.onlyRasterConvertedJpg, true);
        return;
      }
    } else {
      applicable = rows.filter((r) => this._canScale(r));
      if (applicable.length === 0) {
        this._msg(this.t.onlyRasterTransformed, true);
        return;
      }
    }
    // the op below runs on every selected row, so the count is rows.length
    if (
      !(await this._confirmBulkOverwrite(
        rows.length,
        normalizedOp === "convert-jpg"
          ? this.t.actionConvertJpg
          : this.t.actionTransform,
      ))
    )
      return;
    await this._runBulkOp(
      rows,
      (row) => this._op(row, normalizedOp, { silent: true, skipRefresh: true }),
      this.t.transformed,
      { refreshMedia: true },
    );
  }
  async _onBulkCompress(rows, level) {
    const normalizedLevel = typeof level === "string" ? level.trim() : "";
    if (!normalizedLevel || COMPRESS_LEVELS.indexOf(normalizedLevel) === -1)
      return;
    const compressible = rows.filter((r) => this._canScale(r));
    if (compressible.length === 0) {
      this._msg(this.t.onlyRasterCompressed, true);
      return;
    }
    if (
      !(await this._confirmBulkOverwrite(
        compressible.length,
        this.t.actionCompress,
      ))
    )
      return;
    await this._runBulkOp(
      compressible,
      (row) =>
        this._op(row, "compress", {
          level: normalizedLevel,
          silent: true,
          skipRefresh: true,
        }),
      this.t.compressedLevel.replace("{level}", () => normalizedLevel),
      { refreshMedia: true },
    );
  }
  async _onBulkDuplicate(rows) {
    await this._runBulkOp(
      rows,
      (row) => this._op(row, "duplicate", { silent: true, skipRefresh: true }),
      this.t.duplicated,
    );
  }
  async _onBulkRename(rows) {
    const defaultName =
      rows.length === 1
        ? this._nameWithoutExt(rows[0].name || rows[0].path)
        : "";
    const requestedName = await adminPrompt({
      title: this.t.renameFilesTitle,
      message:
        rows.length === 1
          ? this.t.renamePromptSingle
          : this.t.renamePromptMultiple.replace("{count}", () => rows.length),
      label: this.t.newName,
      value: defaultName,
      confirmLabel: this.t.renameAction,
      cancelLabel: this.t.cancel,
    });
    if (typeof requestedName !== "string") return;
    const baseName = requestedName.trim();
    if (!baseName) {
      this._msg(this.t.renameCancelled, true);
      return;
    }
    await this._runBulkOp(
      rows,
      (row, idx) => {
        const newName = rows.length === 1 ? baseName : `${baseName}-${idx + 1}`;
        return this._op(row, "rename", {
          newName,
          silent: true,
          skipRefresh: true,
        });
      },
      this.t.renamed,
    );
  }
  async _onBulkDelete(rows) {
    const label =
      rows.length === 1
        ? rows[0].path
        : this.t.selectedFilesCount.replace("{count}", () => rows.length);
    const confirmed = await adminConfirm({
      title: this.t.deleteFilesTitle,
      message: this.t.deleteConfirm.replace("{label}", () => label),
      confirmLabel: this.t.deleteAction,
      cancelLabel: this.t.cancel,
      danger: true,
    });
    if (!confirmed) return;
    await this._runBulkOp(
      rows,
      (row) => this._op(row, "delete", { silent: true, skipRefresh: true }),
      this.t.deleted,
    );
  }

  _msg(m, err) {
    if (store && typeof store.toast === "function") {
      store.toast(m, 3000, {
        hat: "construction",
        fire: err,
        tone: err ? "danger" : "success",
      });
      return;
    }
    if (HAXStore && typeof HAXStore.toast === "function")
      HAXStore.toast(m, 3000, "fit-bottom");
  }

  _embedInPage(row) {
    this._onBulkInsert([row], "standalone");
  }

  /**
   * Bulk-aware insert-into-page. Single file: unchanged behavior (one
   * `insertLogicFromValues` call). Multiple images: caller has already
   * chosen gallery vs. standalone via the hax-file-actions select
   * (`insert:gallery` / `insert:standalone`); mixed/non-image multi
   * selections loop `insertLogicFromValues` once per file.
   */
  _onBulkInsert(rows, mode) {
    const insertable = rows.filter((r) => r && r.publicUrl);
    const skipped = rows.length - insertable.length;
    if (insertable.length === 0) {
      this._msg(this.t.noPublicUrl, true);
      return;
    }
    store.editMode = true;
    globalThis.dispatchEvent(
      new CustomEvent("simple-modal-hide", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {},
      }),
    );
    setTimeout(() => {
      if (!HAXStore.activeHaxBody) {
        this._msg(this.t.unableToEmbed, true);
        return;
      }
      if (mode === "gallery") {
        const innerHTML = insertable
          .map(
            (row) =>
              `<media-image source="${row.publicUrl}" alt="${row.name || ""}"></media-image>`,
          )
          .join("");
        HAXStore.activeHaxBody.haxInsert("image-gallery", innerHTML, {
          mode: "grid",
        });
      } else if (mode === "standalone") {
        // Multiple images as individual media-image elements. haxInsert is
        // loop-safe (the store's own _haxStoreInsertMultiple loops it), so we
        // mirror the gallery path instead of insertLogicFromValues, whose
        // auto-gallery/selection logic is fragile in a tight loop.
        insertable.forEach((row) => {
          HAXStore.activeHaxBody.haxInsert("media-image", "", {
            source: row.publicUrl,
            alt: row.name || "",
          });
        });
      } else {
        // Single file (any type) — gizmo guessing inserts non-image types
        // (PDF, video, audio) via their correct element.
        insertable.forEach((row) => {
          HAXStore.insertLogicFromValues(
            { source: row.publicUrl, title: row.name },
            this,
          );
        });
      }
      if (skipped > 0) {
        this._msg(
          this.t.insertedSkipped
            .replace("{count}", () => insertable.length)
            .replace("{skipped}", () => skipped),
          true,
        );
      } else {
        this._msg(
          this.t.insertedIntoPage.replace("{count}", () => insertable.length),
        );
      }
    }, 300);
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // on by default and we don't need this here
    this.shadowRoot.querySelector("hax-upload-field").showSources = false;
  }

  /** this page's files in the order the compact sort asks for */
  _sortedRows() {
    const rows = this.rows.slice();
    const time = (r) => this._dateMs(r.updated || r.dateCreated) || 0;
    switch (this._sort) {
      case "updated-asc":
        rows.sort((a, b) => time(a) - time(b));
        break;
      case "name":
        rows.sort((a, b) => String(a.name).localeCompare(String(b.name)));
        break;
      case "name-desc":
        rows.sort((a, b) => String(b.name).localeCompare(String(a.name)));
        break;
      case "size-desc":
        rows.sort((a, b) => (Number(b.size) || 0) - (Number(a.size) || 0));
        break;
      case "size-asc":
        rows.sort((a, b) => (Number(a.size) || 0) - (Number(b.size) || 0));
        break;
      default:
        rows.sort((a, b) => time(b) - time(a));
    }
    return rows;
  }

  /** short kind of file for a card: the extension, else the mime type */
  _kind(r) {
    const name = String(r.name || r.path || "");
    const dot = name.lastIndexOf(".");
    if (dot > 0 && dot < name.length - 1) {
      return name.substring(dot + 1).toUpperCase();
    }
    return r.mimetype || "—";
  }

  /** the hax file-type icon for a file that has no image preview */
  _fileIcon(r) {
    const ext = this._kind(r).toLowerCase();
    const known = [
      "csv",
      "doc",
      "docx",
      "gif",
      "html",
      "jpg",
      "pdf",
      "png",
      "ppt",
      "rtf",
      "svg",
      "xls",
    ];
    if (known.indexOf(ext) !== -1) {
      return "hax:file-" + ext;
    }
    if (ext === "jpeg") {
      return "hax:file-jpg";
    }
    const mime = String(r.mimetype || "");
    if (mime.indexOf("video") === 0 || mime.indexOf("audio") === 0) {
      return HaxUiAdminIcons.image;
    }
    return "hax:file-blank";
  }

  /** a preview that fails to load shows the file-type icon instead */
  _onThumbError(r) {
    const next = new Set(this._brokenThumbs);
    next.add(this._rowKey(r));
    this._brokenThumbs = next;
  }

  /** a tap on a card (not on its checkbox, link or buttons) selects it */
  _onCardClick(e, r) {
    const path = typeof e.composedPath === "function" ? e.composedPath() : [];
    for (let i = 0; i < path.length; i++) {
      const node = path[i];
      if (node === e.currentTarget) {
        break;
      }
      const tag = node && node.tagName ? node.tagName.toLowerCase() : "";
      if (tag === "input" || tag === "a" || tag === "button") {
        return;
      }
    }
    if (this.busy) {
      return;
    }
    this._toggleRowSelected(r, !this._isRowSelected(r));
  }

  /** files as cards for a narrow section */
  _renderCards() {
    const rows = this._sortedRows();
    return html`<ul class="cards" aria-label="${this.t.file}">
      ${rows.map((r) => {
        const key = this._rowKey(r);
        const selected = this._isRowSelected(r);
        const thumb =
          this._isImg(r) && r.publicUrl && !this._brokenThumbs.has(key);
        const when = r.updated || r.dateCreated;
        const openLabel = this.t.openFile.replace("{name}", () => r.name);
        return html`<li
          class="card ${selected ? "selected" : ""}"
          data-row-key="${key}"
          @click="${(e) => this._onCardClick(e, r)}"
        >
          <input
            type="checkbox"
            aria-label="${this.t.selectFile.replace("{name}", () => r.name)}"
            data-action="select-row"
            data-row-key="${key}"
            .checked="${selected}"
            ?disabled="${this.busy}"
            @click="${(e) => {
              this.__shiftCheck = e.shiftKey;
            }}"
            @change="${(e) => this._onRowCheck(r, e)}"
          />
          <span class="thumb" aria-hidden="true">
            ${
              thumb
                ? html`<img
                    src="${this._previewUrl(r)}"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    @error="${() => this._onThumbError(r)}"
                  />`
                : html`<simple-icon-lite
                    icon="${this._fileIcon(r)}"
                  ></simple-icon-lite>`
            }
          </span>
          <span class="info">
            <span class="name" title="${r.path || r.name}">${r.name}</span>
            <span class="meta"
              >${this._kind(r)} ·
              ${this._fmtBytes(r.size)}${
                when
                  ? html` ·
                      <span title="${this._fmtDate(when)}"
                        >${this._fmtRelativeDate(when)}</span
                      >`
                  : nothing
              }</span
            >
          </span>
          <span class="card-acts">
            ${
              r.publicUrl
                ? html`<a
                    class="cbtn"
                    href="${r.publicUrl}"
                    target="_blank"
                    rel="noopener"
                    aria-label="${openLabel}"
                    title="${openLabel}"
                    ><simple-icon-lite
                      icon="${HaxUiAdminIcons.external}"
                      aria-hidden="true"
                    ></simple-icon-lite
                  ></a>`
                : nothing
            }
            <button
              type="button"
              class="cbtn"
              data-action="embed"
              aria-label="${this.t.embedInPage}"
              title="${this.t.embedInPage}"
              ?disabled="${this.busy}"
              @click="${() => this._embedInPage(r)}"
            >
              <simple-icon-lite
                icon="hax:embed"
                aria-hidden="true"
              ></simple-icon-lite>
            </button>
            ${renderRowMoreButton(
              this.t.actionsFor.replace("{name}", () => r.name),
              (e) =>
                this._openRowMenu(
                  e.currentTarget.closest("li.card"),
                  e,
                  e.currentTarget,
                ),
            )}
          </span>
        </li>`;
      })}
    </ul>`;
  }

  /** filters for a narrow section: search and type, then select-all, sort */
  _renderCompactBar(typeItems, filtersDisabled) {
    return html`
      <div class="bar compact-bar">
        <label class="field hax-ui-tool-field name grow">
          <simple-icon-lite
            icon="${HaxUiAdminIcons.search}"
            aria-hidden="true"
          ></simple-icon-lite>
          <input
            type="text"
            name="filter-name-contains"
            aria-label="${this.t.nameContains}"
            placeholder="${this.t.nameContains}"
            .value="${this.filterNameContains}"
            ?disabled="${filtersDisabled}"
            @input="${(e) =>
              this._onFilterNameContainsChanged({
                detail: { value: e.target.value },
              })}"
            @keydown="${(e) => this._onFilterKeydown(e, "filterNameContains")}"
          />
        </label>
        <label class="field hax-ui-tool-field">
          <span class="hax-ui-sr-only">${this.t.type}</span>
          <select
            name="filter-type"
            ?disabled="${filtersDisabled}"
            @change="${(e) => this._setFilterType(e.target.value)}"
          >
            ${typeItems.map(
              (item) =>
                html`<option
                  value="${item.value}"
                  ?selected="${this.filterType === item.value}"
                >
                  ${item.text}
                </option>`,
            )}
          </select>
        </label>
        <div class="row2">
          <label class="selall">
            <input
              type="checkbox"
              data-action="select-all"
              .checked="${
                this.rows.length > 0 &&
                this.selectedRows.size === this.rows.length
              }"
              ?disabled="${this.busy || this.rows.length === 0}"
              @change="${(e) => this._toggleSelectAll(e.target.checked)}"
            />
            ${this.t.selectAll}
          </label>
          <label class="field hax-ui-tool-field">
            <span class="hax-ui-sr-only">${this.t.sortBy}</span>
            <select
              name="sort"
              @change="${(e) => {
                this._sort = e.target.value;
              }}"
            >
              ${SORT_OPTIONS.map(
                ([value, key]) =>
                  html`<option
                    value="${value}"
                    ?selected="${this._sort === value}"
                  >
                    ${this.t[key]}
                  </option>`,
              )}
            </select>
          </label>
          <span class="sum"
            >${(this.pageTotal === 1
              ? this.t.fileCount
              : this.t.filesCount
            ).replace("{count}", () => this.pageTotal)}</span
          >
          <button
            type="button"
            class="hax-ui-icon-btn refresh"
            aria-label="${this.t.refreshFileList}"
            title="${this.t.refreshFileList}"
            ?disabled="${this.loading || !this._canList}"
            @click="${this.refreshFiles}"
          >
            <simple-icon-lite
              icon="${HaxUiAdminIcons.refresh}"
              aria-hidden="true"
            ></simple-icon-lite>
          </button>
        </div>
      </div>
    `;
  }

  /** the filter bar for a wide section */
  _renderWideBar(typeItems, filtersDisabled) {
    return html`
      <div class="bar">
        <div class="hax-ui-seg" role="group" aria-label="${this.t.type}">
          ${typeItems.map(
            (item) =>
              html`<button
                type="button"
                data-type="${item.value}"
                aria-pressed="${
                  this.filterType === item.value ? "true" : "false"
                }"
                ?disabled="${filtersDisabled}"
                @click="${() => this._setFilterType(item.value)}"
              >
                ${item.text}
              </button>`,
          )}
        </div>
        <label class="field hax-ui-tool-field name">
          <simple-icon-lite
            icon="${HaxUiAdminIcons.search}"
            aria-hidden="true"
          ></simple-icon-lite>
          <input
            type="text"
            name="filter-name-contains"
            aria-label="${this.t.nameContains}"
            placeholder="${this.t.nameContains}"
            .value="${this.filterNameContains}"
            ?disabled="${filtersDisabled}"
            @input="${(e) =>
              this._onFilterNameContainsChanged({
                detail: { value: e.target.value },
              })}"
            @keydown="${(e) => this._onFilterKeydown(e, "filterNameContains")}"
          />
        </label>
        <label class="field hax-ui-tool-field ext">
          <span>${this.t.extension}</span>
          <input
            type="text"
            name="filter-extension"
            placeholder="${this.t.extensionPlaceholder}"
            .value="${this.filterExtension}"
            ?disabled="${filtersDisabled}"
            @input="${(e) =>
              this._onFilterExtensionChanged({
                detail: { value: e.target.value },
              })}"
            @keydown="${(e) => this._onFilterKeydown(e, "filterExtension")}"
          />
        </label>
        <label class="field hax-ui-tool-field">
          <span>${this.t.perPage}</span>
          <select
            name="page-limit"
            ?disabled="${filtersDisabled}"
            @change="${(e) =>
              this._onPageSizeChanged({
                detail: { value: e.target.value },
              })}"
          >
            ${PAGE_SIZE_OPTIONS.map(
              (size) =>
                html`<option
                  value="${size}"
                  ?selected="${size === this.pageLimit}"
                >
                  ${size}
                </option>`,
            )}
          </select>
        </label>
        <span class="sum"
          >${(this.pageTotal === 1
            ? this.t.fileCount
            : this.t.filesCount
          ).replace("{count}", () => this.pageTotal)}</span
        >
        <button
          type="button"
          class="hax-ui-icon-btn refresh"
          aria-label="${this.t.refreshFileList}"
          title="${this.t.refreshFileList}"
          ?disabled="${this.loading || !this._canList}"
          @click="${this.refreshFiles}"
        >
          <simple-icon-lite
            icon="${HaxUiAdminIcons.refresh}"
            aria-hidden="true"
          ></simple-icon-lite>
        </button>
      </div>
    `;
  }

  /** Image, Video, Audio or File, for the type pill */
  _typeLabel(r) {
    const mime = String(r.mimetype || "");
    if (this._isImg(r) || mime.indexOf("image") === 0) {
      return this.t.kindImage;
    }
    if (mime.indexOf("video") === 0) {
      return this.t.kindVideo;
    }
    if (mime.indexOf("audio") === 0) {
      return this.t.kindAudio;
    }
    return this.t.kindFile;
  }

  /** the inspected file: the one chosen, else the first selected */
  _focusRow() {
    const selected = this._selectedRowObjects();
    const chosen = this._focusKey ? this._rowByKey(this._focusKey) : null;
    if (chosen && this._isRowSelected(chosen)) {
      return chosen;
    }
    return selected.length ? selected[selected.length - 1] : null;
  }

  /**
   * Clicking a file's name selects just that file (Ctrl or Cmd adds or
   * removes it instead) and shows it in the details panel. Every action
   * is in the selection bar, so there is one place to act.
   */
  _chooseRow(r, e) {
    const key = this._rowKey(r);
    if (!key) {
      return;
    }
    if (e && (e.ctrlKey || e.metaKey)) {
      const on = !this._isRowSelected(r);
      this._toggleRowSelected(r, on);
      if (on) {
        this._focusKey = key;
      }
      return;
    }
    this.selectedRows = new Set([key]);
    this._focusKey = key;
  }

  /** a checkbox that turns on also shows its file in the details panel */
  _checkRow(r, checked) {
    this._toggleRowSelected(r, checked);
    if (checked) {
      this._focusKey = this._rowKey(r);
    }
  }

  _sortBy(column) {
    const next = {
      name: this._sort === "name" ? "name-desc" : "name",
      size: this._sort === "size-desc" ? "size-asc" : "size-desc",
      updated: this._sort === "updated-desc" ? "updated-asc" : "updated-desc",
    };
    this._sort = next[column] || "updated-desc";
  }

  _ariaSort(column) {
    const map = {
      name: { name: "ascending", "name-desc": "descending" },
      size: { "size-asc": "ascending", "size-desc": "descending" },
      updated: { "updated-asc": "ascending", "updated-desc": "descending" },
    };
    return (map[column] && map[column][this._sort]) || "none";
  }

  _renderThumb(r, big) {
    const key = this._rowKey(r);
    const thumb = this._isImg(r) && r.publicUrl && !this._brokenThumbs.has(key);
    return thumb
      ? html`<img
          src="${this._previewUrl(r)}"
          alt="${big ? r.name : ""}"
          loading="lazy"
          decoding="async"
          @error="${() => this._onThumbError(r)}"
        />`
      : html`<simple-icon-lite
          icon="${this._fileIcon(r)}"
          aria-hidden="true"
        ></simple-icon-lite>`;
  }

  /** the file table for a wide section */
  _renderTable() {
    const rows = this._sortedRows();
    const focus = this._focusRow();
    const focusKey = focus ? this._rowKey(focus) : "";
    const sortBtn = (column, label) =>
      html`<button
        type="button"
        class="sort"
        data-sort="${column}"
        @click="${() => this._sortBy(column)}"
      >
        ${label}<simple-icon-lite
          icon="${HaxUiAdminIcons.chevron}"
          aria-hidden="true"
          class="dir ${this._ariaSort(column)}"
        ></simple-icon-lite>
      </button>`;
    return html`<table class="files">
      <caption class="hax-ui-sr-only">
        ${this.t.files}
      </caption>
      <thead>
        <tr>
          <th scope="col" class="cbcol">
            <input
              type="checkbox"
              class="cb"
              aria-label="${this.t.selectAllFiles}"
              title="${this.t.selectAllFiles}"
              data-action="select-all"
              ?disabled="${this.busy || this.rows.length === 0}"
              .checked="${
                this.rows.length > 0 &&
                this.selectedRows.size === this.rows.length
              }"
              @change="${(e) => this._toggleSelectAll(e.target.checked)}"
            />
          </th>
          <th scope="col" aria-sort="${this._ariaSort("name")}">
            ${sortBtn("name", this.t.file)}
          </th>
          <th scope="col">${this.t.type}</th>
          <th scope="col" class="num" aria-sort="${this._ariaSort("size")}">
            ${sortBtn("size", this.t.size)}
          </th>
          <th scope="col" class="num" aria-sort="${this._ariaSort("updated")}">
            ${sortBtn("updated", this.t.updated)}
          </th>
          <th scope="col" class="actcol">
            <span class="hax-ui-sr-only">${this.t.rowActionsColumn}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((r) => {
          const key = this._rowKey(r);
          const selected = this._isRowSelected(r);
          const when = r.updated || r.dateCreated;
          return html`<tr
            class="${selected ? "sel" : ""} ${key === focusKey ? "focus" : ""}"
            data-row-key="${key}"
          >
            <td class="cbcol">
              <input
                type="checkbox"
                class="cb"
                aria-label="${this.t.selectFile.replace(
                  "{name}",
                  () => r.name,
                )}"
                data-action="select-row"
                data-row-key="${key}"
                .checked="${selected}"
                ?disabled="${this.busy}"
                @click="${(e) => {
                  this.__shiftCheck = e.shiftKey;
                }}"
                @change="${(e) => this._onRowCheck(r, e)}"
              />
            </td>
            <td class="fcol">
              <button
                type="button"
                class="fname"
                title="${this.t.chooseFile.replace("{name}", () => r.name)}"
                @click="${(e) => this._chooseRow(r, e)}"
              >
                <span class="thumb sm">${this._renderThumb(r, false)}</span>
                <span class="nm">${r.name}</span>
              </button>
            </td>
            <td><span class="pill">${this._typeLabel(r)}</span></td>
            <td class="num">${this._fmtBytes(r.size)}</td>
            <td class="num" title="${this._fmtDate(when)}">
              ${this._fmtRelativeDate(when)}
            </td>
            <td class="actcol">
              ${renderRowMoreButton(
                this.t.actionsFor.replace("{name}", () => r.name),
                (e) =>
                  this._openRowMenu(
                    e.currentTarget.closest("tr"),
                    e,
                    e.currentTarget,
                  ),
              )}
            </td>
          </tr>`;
        })}
      </tbody>
    </table>`;
  }

  /** the selected file's preview and details; actions live in the bar */
  /**
   * Crop… : the selected JPG, PNG and WebP files open one at a time in
   * hax-image-crop beside the list. Each crop is made in the browser and
   * replaces the original (replaceFileContent), like Files' other image
   * actions; a fixed aspect can crop the rest centered in one go.
   */
  _openCrop(rows) {
    const croppable = (rows || []).filter((r) => this._canCrop(r));
    if (croppable.length === 0) {
      this._msg(this.t.onlyCroppable, true);
      return;
    }
    this._choice = null;
    this._crop = { rows: croppable, index: 0, done: 0, aspect: "free" };
    this.updateComplete.then(() => {
      const cropper =
        this.shadowRoot && this.shadowRoot.querySelector(".cropper");
      if (cropper) cropper.focus();
    });
  }

  _cropRow() {
    const crop = this._crop;
    return crop ? crop.rows[crop.index] || null : null;
  }

  /** leave the editor; refresh the list when anything was replaced */
  async _closeCrop() {
    const crop = this._crop;
    this._crop = null;
    if (crop && crop.done > 0) {
      await this.refreshFiles();
      if (crop.rows.length > 1) {
        this._msg(
          (crop.done === 1 ? this.t.bulkSummaryFile : this.t.bulkSummaryFiles)
            .replace("{verb}", () => this.t.cropped)
            .replace("{count}", () => crop.done),
        );
      }
    }
    // back to the list, on the first selected file
    this.updateComplete.then(() => {
      const root = this.shadowRoot;
      const box =
        root &&
        (root.querySelector(".tw [data-row-key] input:checked") ||
          root.querySelector(".tw [data-row-key] input"));
      if (box) box.focus();
    });
  }

  _nextCrop() {
    const crop = this._crop;
    if (!crop) return;
    if (crop.index + 1 >= crop.rows.length) {
      this._closeCrop();
      return;
    }
    this._crop = Object.assign({}, crop, { index: crop.index + 1 });
  }

  _onCropChanged(e) {
    const cropper = e && e.target;
    if (
      this._crop &&
      cropper &&
      typeof cropper.aspect === "string" &&
      cropper.aspect !== this._crop.aspect
    ) {
      this._crop = Object.assign({}, this._crop, { aspect: cropper.aspect });
    }
  }

  /** Esc cancels, Ctrl+Enter replaces, Ctrl+Shift+Enter skips */
  _onCropKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      this._closeCrop();
      return;
    }
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && !e.altKey) {
      e.preventDefault();
      e.stopPropagation();
      if (this.busy) return;
      if (e.shiftKey) {
        if (this._crop && this._crop.index + 1 < this._crop.rows.length) {
          this._nextCrop();
        }
      } else {
        this._replaceWithCrop();
      }
    }
  }

  async _downloadCrop() {
    const cropper = this.shadowRoot.querySelector("hax-image-crop");
    if (!cropper) return;
    try {
      await cropper.download();
    } catch (e) {
      cropper.error =
        e && e.message
          ? e.message
          : this.t.cropFailed.replace("{name}", () => cropper.fileName);
    }
  }

  /**
   * Send new bytes for `row` to replaceFileContent. The server writes them
   * over the file in its own format, keeping its name, path and UUID.
   * @returns {Promise<{ok: boolean, message: string}>}
   */
  async _replaceContent(row, blob) {
    const name = "@site/replaceFileContent";
    const failed = this.t.cropFailed.replace("{name}", () =>
      row && row.name ? row.name : "",
    );
    const fileUuid = this._s(row && row.uuid ? row.uuid : "");
    if (!fileUuid) {
      return { ok: false, message: this.t.fileUuidMissing };
    }
    if (!this._canOp) {
      return { ok: false, message: this.t.unableToRunFileOperation };
    }
    try {
      await waitForHAXCMSSiteApiRegistryReady();
      if (
        !MicroFrontendRegistry ||
        typeof MicroFrontendRegistry.has !== "function" ||
        !MicroFrontendRegistry.has(name)
      ) {
        return { ok: false, message: this.t.fileOperationEndpointUnavailable };
      }
      const form = new FormData();
      form.append("fileUuid", fileUuid);
      form.append("upload", blob, row.name || "image");
      const d = await MicroFrontendRegistry.call(name, form, null, this);
      if (this._statusCode(d) !== 200) {
        return { ok: false, message: this._messageFromResponse(d, failed) };
      }
      return { ok: true, message: "" };
    } catch {
      return { ok: false, message: failed };
    }
  }

  /** the crop in the editor replaces the current file, then the next opens */
  async _replaceWithCrop() {
    const row = this._cropRow();
    const cropper =
      this.shadowRoot && this.shadowRoot.querySelector("hax-image-crop");
    if (!row || !cropper || this.busy) return;
    this.busy = true;
    cropper.error = "";
    try {
      let blob;
      try {
        blob = await cropper.toBlob();
      } catch (e) {
        cropper.error =
          e && e.message
            ? e.message
            : this.t.cropFailed.replace("{name}", () => row.name);
        return;
      }
      const result = await this._replaceContent(row, blob);
      if (!result.ok) {
        cropper.error = result.message;
        return;
      }
      if (HAXStore && typeof HAXStore.refreshMediaSource === "function") {
        HAXStore.refreshMediaSource(
          row.publicUrl || row.fullUrl || row.path || "",
        );
      }
      this._crop = Object.assign({}, this._crop, {
        done: this._crop.done + 1,
      });
      this._msg(this.t.imageCropped.replace("{name}", () => row.name));
      this._nextCrop();
    } finally {
      this.busy = false;
    }
  }

  /** crop one file to `ratio`, centered, without opening it */
  async _cropCentered(row, ratio) {
    const failed = this.t.cropFailed.replace("{name}", () => row.name);
    try {
      const img = await loadCropImage(
        this._withCacheBust(row.publicUrl, this._nextCacheBustToken()),
      );
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const rect = centeredCropRect(w, h, ratio);
      if (rect.width === w && rect.height === h) {
        // already this shape; nothing to replace
        return { ok: true, message: "" };
      }
      const blob = await encodeCrop(img, rect, cropOutputType(row.mimetype));
      return this._replaceContent(row, blob);
    } catch {
      return { ok: false, message: failed };
    }
  }

  /** crop this file and the rest of the queue to the chosen aspect */
  async _cropAll() {
    const crop = this._crop;
    if (!crop || this.busy) return;
    const aspect = CROP_ASPECTS.find((a) => a.id === crop.aspect);
    if (!aspect || typeof aspect.ratio !== "number") return;
    const rows = crop.rows.slice(crop.index);
    if (!(await this._confirmBulkOverwrite(rows.length, this.t.actionCrop))) {
      return;
    }
    // files already replaced one at a time show up in the refresh the
    // bulk run ends with
    this._crop = null;
    await this._runBulkOp(
      rows,
      (row) => this._cropCentered(row, aspect.ratio),
      this.t.cropped,
      { refreshMedia: true },
    );
  }

  _renderCrop() {
    const crop = this._crop;
    const row = this._cropRow();
    if (!row) return nothing;
    const total = crop.rows.length;
    const remaining = total - crop.index;
    const more = remaining > 1;
    const aspect = CROP_ASPECTS.find((a) => a.id === crop.aspect);
    const canAll = more && aspect && typeof aspect.ratio === "number";
    const busy = !!this.busy;
    const heading =
      total > 1
        ? this.t.cropProgress
            .replace("{current}", () => crop.index + 1)
            .replace("{total}", () => total)
            .replace("{name}", () => row.name)
        : this.t.cropHeading.replace("{name}", () => row.name);
    return html`<section
      class="cropper"
      tabindex="-1"
      aria-label="${this.t.cropEditor}"
      @keydown="${this._onCropKeydown}"
      @crop-changed="${this._onCropChanged}"
    >
      <hax-image-crop
        src="${this._withCacheBust(row.publicUrl, this.cacheBustToken)}"
        file-name="${row.name}"
        mime-type="${row.mimetype}"
        aspect="${crop.aspect}"
        heading="${heading}"
        note="${this.t.cropReplaceNote.replace("{name}", () => row.name)}"
      >
        <button
          slot="actions"
          type="button"
          class="hax-ui-btn"
          ?disabled="${busy}"
          @click="${this._downloadCrop}"
        >
          ${this.t.download}
        </button>
        ${
          more
            ? html`<button
                slot="actions"
                type="button"
                class="hax-ui-btn"
                ?disabled="${busy}"
                aria-keyshortcuts="Control+Shift+Enter"
                data-shortcut="Ctrl⇧↵"
                @click="${this._nextCrop}"
              >
                ${this.t.skip}
              </button>`
            : nothing
        }
        <button
          slot="actions"
          type="button"
          class="hax-ui-btn ghost"
          aria-keyshortcuts="Escape"
          data-shortcut="Esc"
          @click="${this._closeCrop}"
        >
          ${this.t.cancel}
        </button>
        <button
          slot="actions"
          type="button"
          class="hax-ui-btn primary"
          ?disabled="${busy}"
          aria-keyshortcuts="Control+Enter"
          data-shortcut="Ctrl↵"
          @click="${this._replaceWithCrop}"
        >
          ${more ? this.t.replaceAndNext : this.t.replaceOriginal}
        </button>
      </hax-image-crop>
      ${
        canAll
          ? html`<div class="crop-all">
              <p class="hax-ui-note">
                ${this.t.cropAllNote.replace("{count}", () => remaining - 1)}
              </p>
              <button
                type="button"
                class="hax-ui-btn"
                ?disabled="${busy}"
                @click="${this._cropAll}"
              >
                ${this.t.cropAll
                  .replace("{count}", () => remaining)
                  .replace("{aspect}", () => aspect.id)}
              </button>
            </div>`
          : nothing
      }
    </section>`;
  }

  _renderInspector() {
    const r = this._focusRow();
    if (!r) {
      return html`<aside class="insp" aria-label="${this.t.inspector}">
        <p class="insp-empty">${this.t.noneSelectedToInspect}</p>
      </aside>`;
    }
    const when = r.updated || r.dateCreated;
    const count = this.selectedRows.size;
    return html`<aside class="insp" aria-label="${this.t.inspector}">
      <div class="pvbig">${this._renderThumb(r, true)}</div>
      <h3 class="insp-name">${r.name}</h3>
      <dl>
        <dt>${this.t.type}</dt>
        <dd>${this._typeLabel(r)} · ${this._kind(r)}</dd>
        <dt>${this.t.size}</dt>
        <dd>${this._fmtBytes(r.size)}</dd>
        <dt>${this.t.updated}</dt>
        <dd title="${this._fmtDate(when)}">${this._fmtRelativeDate(when)}</dd>
      </dl>
      <div class="path">
        <span title="${r.path}">${r.path}</span>
        <simple-clipboard-copy-button
          class="ib"
          label="${this.t.copyPath}"
          title="${this.t.copyPath}"
          data-cp="${r.path}"
          success-message="${this.t.pathCopied}"
        ></simple-clipboard-copy-button>
        ${
          r.publicUrl
            ? html`<a
                class="hax-ui-icon-btn"
                href="${r.publicUrl}"
                target="_blank"
                rel="noopener"
                aria-label="${this.t.openFile.replace("{name}", () => r.name)}"
                title="${this.t.openFile.replace("{name}", () => r.name)}"
                ><simple-icon-lite
                  icon="${HaxUiAdminIcons.external}"
                  aria-hidden="true"
                ></simple-icon-lite
              ></a>`
            : nothing
        }
      </div>
      ${
        count > 1
          ? html`<p class="hax-ui-message insp-multi">
              ${this.t.inspectorMany.replace("{count}", () => String(count))}
            </p>`
          : nothing
      }
    </aside>`;
  }

  render() {
    const typeItems = FILE_TYPE_FILTER_ITEMS.map((item) => ({
      value: item.value,
      text: item.key && this.t[item.key] ? this.t[item.key] : item.text,
    }));
    const filtersDisabled = this.busy || !this._canList;
    const showPager = this.pageTotal > this.pageLimit;
    return html`
      <div class="shell">
        ${
          this.inShell
            ? nothing
            : html`<div class="ph">
                <div class="ph-text">
                  <h2>${this.t.files}</h2>
                  <p>${this.t.filesDescription}</p>
                </div>
                ${this._renderAddArea()}
              </div>`
        }
        <hax-upload-field
          class="uploader"
          hide-input
          no-camera
          no-voice-record
          no-screen-record
          compact
          tabindex="-1"
          aria-hidden="true"
          ?disabled="${!this._canUpload || this.busy}"
          @value-changed="${this._onHaxUploadValueChanged}"
          @upload-before="${this._onUploadStart}"
          @upload-response="${this._onUploadEnd}"
        >
        </hax-upload-field>
        ${
          this.compact
            ? this._renderCompactBar(typeItems, filtersDisabled)
            : this._renderWideBar(typeItems, filtersDisabled)
        }
        <div
          class="hax-ui-note status ${this.errorMessage ? "error" : ""} ${
            !this.loading && !this.errorMessage ? "quiet" : ""
          }"
          aria-live="polite"
        >
          ${
            this.loading
              ? this.t.loading
              : this.errorMessage
                ? this.errorMessage
                : ``
          }
        </div>
        ${
          !this.inShell && this.selectedRows.size > 0
            ? html`
                <hax-file-actions
                  selected-count="${this.selectedRows.size}"
                  image-count="${
                    this._selectedRowObjects().filter((r) => this._isImg(r))
                      .length
                  }"
                  ?busy="${this.busy}"
                  ?can-scale="${this._selectedRowObjects().some((r) =>
                    this._canScale(r),
                  )}"
                >
                </hax-file-actions>
              `
            : nothing
        }
        <div class="split ${this._crop ? "cropping" : ""}">
          <div
            class="tw"
            @contextmenu="${this._onRowContextMenu}"
            @pointerdown="${this._longPress.pointerdown}"
            @pointermove="${this._longPress.pointermove}"
            @pointerup="${this._longPress.pointerup}"
            @pointercancel="${this._longPress.pointercancel}"
            @keydown="${this._onRowMenuKey}"
          >
            ${
              this.rows.length === 0 && !this.loading
                ? html`<div class="hax-ui-note empty">
                    ${this.t.noFilesFound}
                  </div>`
                : this.compact
                  ? this._renderCards()
                  : this._renderTable()
            }
          </div>
          ${
            this._crop
              ? this._renderCrop()
              : this.compact || this.rows.length === 0
                ? nothing
                : this._renderInspector()
          }
        </div>
        ${
          showPager
            ? html`<simple-pager
                mode="full"
                limit="${this.pageLimit}"
                offset="${this.pageOffset}"
                total="${this.pageTotal}"
                count="${this.rows.length}"
                label="${this.t.filesPagination}"
                @page-changed="${this._onPageChanged}"
              ></simple-pager>`
            : nothing
        }
        ${this._choice ? this._renderChoice() : nothing}
        ${renderAdminRowMenu(this.t.fileActions, this._rowMenuItems())}
      </div>
    `;
  }
}

globalThis.customElements.define(
  HAXCMSFilesAdminDialog.tag,
  HAXCMSFilesAdminDialog,
);
export { HAXCMSFilesAdminDialog };
