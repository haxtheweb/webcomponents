/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";

export const safeString = (value) => {
  if (value === null || typeof value === "undefined") {
    return "";
  }
  return String(value);
};

export const isEmptyValue = (value) => {
  if (value === null || typeof value === "undefined") {
    return true;
  }
  if (Array.isArray(value)) {
    return value.length < 1;
  }
  if (typeof value === "string") {
    return value.trim() === "";
  }
  return false;
};

export const valueAtPath = (record, path) => {
  if (!path) {
    return "";
  }
  const segments = String(path).split(".");
  let pointer = record;
  for (let i = 0; i < segments.length; i++) {
    if (
      pointer &&
      typeof pointer === "object" &&
      Object.prototype.hasOwnProperty.call(pointer, segments[i])
    ) {
      pointer = pointer[segments[i]];
    } else {
      return "";
    }
  }
  return pointer;
};

export const recordTitle = (record) => {
  const titleCandidates = [
    "title",
    "name",
    "tag",
    "path",
    "slug",
    "id",
    "machineName",
  ];
  for (let i = 0; i < titleCandidates.length; i++) {
    const value = valueAtPath(record, titleCandidates[i]);
    if (!isEmptyValue(value)) {
      return safeString(value);
    }
  }
  return "No results";
};

export const recordDescription = (record) => {
  const descCandidates = [
    "description",
    "summary",
    "body",
    "metadata.description",
    "mimetype",
  ];
  for (let i = 0; i < descCandidates.length; i++) {
    const value = valueAtPath(record, descCandidates[i]);
    if (!isEmptyValue(value)) {
      return safeString(value);
    }
  }
  return "";
};

export const recordBody = (record) => {
  const bodyCandidates = ["body", "content", "description"];
  for (let i = 0; i < bodyCandidates.length; i++) {
    const value = valueAtPath(record, bodyCandidates[i]);
    if (!isEmptyValue(value)) {
      return safeString(value);
    }
  }
  return "";
};

export const recordBodyIsHtml = (record) => {
  const body = recordBody(record).trim();
  if (!body) {
    return false;
  }
  return body.indexOf("<") !== -1 && body.indexOf(">") !== -1;
};

export const stripHtml = (value) => {
  return safeString(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const recordTag = (record) => {
  const tagCandidates = [
    "tag",
    "haxElementSchema.tag",
    "instances.0.haxElementSchema.tag",
  ];
  for (let i = 0; i < tagCandidates.length; i++) {
    const value = safeString(valueAtPath(record, tagCandidates[i])).trim();
    if (value) {
      return value.toLowerCase();
    }
  }
  return "";
};

export const recordElementSchema = (record) => {
  let schema = valueAtPath(record, "haxElementSchema");
  if (Array.isArray(schema) && schema.length > 0) {
    schema = schema[0];
  }
  if (
    (!schema || typeof schema !== "object") &&
    record &&
    typeof record === "object"
  ) {
    schema = valueAtPath(record, "instances.0.haxElementSchema");
  }
  if (!schema || typeof schema !== "object" || Array.isArray(schema)) {
    return null;
  }
  if (!schema.tag || safeString(schema.tag).trim() === "") {
    return null;
  }
  return schema;
};

export const isRenderableTag = (tag) => {
  const normalized = safeString(tag).trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  const nativeMediaTags = {
    img: true,
    video: true,
    audio: true,
    iframe: true,
  };
  if (Object.prototype.hasOwnProperty.call(nativeMediaTags, normalized)) {
    return true;
  }
  return /^[a-z][a-z0-9]*-[a-z0-9-]*$/.test(normalized);
};

export const attributeValue = (value) => {
  if (value === null || typeof value === "undefined" || value === false) {
    return "";
  }
  if (value === true) {
    return "__BOOLEAN_TRUE__";
  }
  if (typeof value === "object") {
    return "";
  }
  return safeString(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .trim();
};

export const attributeStringFromProperties = (properties) => {
  if (
    !properties ||
    typeof properties !== "object" ||
    Array.isArray(properties)
  ) {
    return "";
  }
  const keys = Object.keys(properties);
  let output = "";
  for (let i = 0; i < keys.length; i++) {
    const key = safeString(keys[i]).trim();
    if (!key) {
      continue;
    }
    const normalizedValue = attributeValue(properties[key]);
    if (!normalizedValue) {
      continue;
    }
    if (normalizedValue === "__BOOLEAN_TRUE__") {
      output += ` ${key}`;
      continue;
    }
    output += ` ${key}="${normalizedValue}"`;
  }
  return output;
};

export const renderRecordElementPreview = (record) => {
  const schema = recordElementSchema(record);
  const tag =
    schema && schema.tag
      ? safeString(schema.tag).trim()
      : recordTag(record);
  if (!isRenderableTag(tag)) {
    return null;
  }
  const properties =
    schema && schema.properties && typeof schema.properties === "object"
      ? schema.properties
      : {};
  const content =
    schema && typeof schema.content === "string" ? schema.content : "";
  const attributeString = attributeStringFromProperties(properties);
  const elementMarkup = `<${tag}${attributeString}>${content}</${tag}>`;
  return html`<div class="record-element-preview">
    ${unsafeHTML(elementMarkup)}
  </div>`;
};

export const recordUrl = (record, options = {}) => {
  const resolve = options.resolveHref || ((v) => v);
  const candidates = [
    "links.page",
    "slug",
    "url",
    "fullUrl",
    "path",
    "metadata.path",
    "links.self",
    "links.content",
  ];
  for (let i = 0; i < candidates.length; i++) {
    const value = safeString(valueAtPath(record, candidates[i])).trim();
    if (!value) {
      continue;
    }
    return resolve(value);
  }
  return "";
};

export const looksLikeImageSource = (url) => {
  const value = safeString(url).trim().toLowerCase();
  if (!value) {
    return false;
  }
  if (
    value.endsWith(".png") ||
    value.endsWith(".jpg") ||
    value.endsWith(".jpeg") ||
    value.endsWith(".gif") ||
    value.endsWith(".webp") ||
    value.endsWith(".svg") ||
    value.endsWith(".avif") ||
    value.endsWith(".bmp")
  ) {
    return true;
  }
  if (
    value.indexOf(".png?") !== -1 ||
    value.indexOf(".jpg?") !== -1 ||
    value.indexOf(".jpeg?") !== -1 ||
    value.indexOf(".gif?") !== -1 ||
    value.indexOf(".webp?") !== -1 ||
    value.indexOf(".svg?") !== -1 ||
    value.indexOf(".avif?") !== -1 ||
    value.indexOf(".bmp?") !== -1
  ) {
    return true;
  }
  return false;
};

export const recordImage = (record, options = {}) => {
  const resolve = options.resolveHref || ((v) => v);
  const candidates = [
    "image",
    "src",
    "properties.src",
    "properties.image",
    "haxElementSchema.properties.src",
    "haxElementSchema.properties.image",
    "instances.0.haxElementSchema.properties.src",
    "instances.0.haxElementSchema.properties.image",
    "metadata.image",
    "logo",
    "metadata.site.logo",
    "screenshot",
    "preview",
    "thumbnail",
    "poster",
    "haxElementSchema.properties.poster",
    "instances.0.haxElementSchema.properties.poster",
    "url",
    "fullUrl",
    "path",
    "metadata.path",
  ];
  for (let i = 0; i < candidates.length; i++) {
    const value = safeString(valueAtPath(record, candidates[i])).trim();
    if (value) {
      const resolvedPath = resolve(value);
      if (looksLikeImageSource(resolvedPath)) {
        return resolvedPath;
      }
    }
  }
  return "";
};

export const recordIcon = (record) => {
  const candidates = ["icon", "metadata.icon", "pageType"];
  for (let i = 0; i < candidates.length; i++) {
    const value = safeString(valueAtPath(record, candidates[i])).trim();
    if (value) {
      return value;
    }
  }
  return "hax:module";
};

export const recordTags = (record) => {
  const tags = valueAtPath(record, "tags");
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => safeString(tag).trim())
      .filter((tag) => tag);
  }
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  }
  const metadataTags = valueAtPath(record, "metadata.tags");
  if (Array.isArray(metadataTags)) {
    return metadataTags
      .map((tag) => safeString(tag).trim())
      .filter((tag) => tag);
  }
  if (typeof metadataTags === "string") {
    return metadataTags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
  }
  return [];
};

export const looksLikeVideoSource = (url) => {
  const value = safeString(url).trim().toLowerCase();
  if (!value) {
    return false;
  }
  if (
    value.indexOf("youtube.com/") !== -1 ||
    value.indexOf("youtu.be/") !== -1 ||
    value.indexOf("vimeo.com/") !== -1
  ) {
    return true;
  }
  if (
    value.endsWith(".mp4") ||
    value.endsWith(".webm") ||
    value.endsWith(".ogg") ||
    value.endsWith(".m3u8") ||
    value.indexOf(".mp4?") !== -1 ||
    value.indexOf(".webm?") !== -1 ||
    value.indexOf(".ogg?") !== -1 ||
    value.indexOf(".m3u8?") !== -1
  ) {
    return true;
  }
  return false;
};

export const videoSource = (record, options = {}) => {
  const resolve = options.resolveHref || ((v) => v);
  const candidates = [
    "source",
    "src",
    "video",
    "properties.source",
    "properties.src",
    "haxElementSchema.properties.source",
    "haxElementSchema.properties.src",
    "haxElementSchema.properties.url",
    "instances.0.haxElementSchema.properties.source",
    "instances.0.haxElementSchema.properties.src",
    "instances.0.haxElementSchema.properties.url",
    "url",
    "fullUrl",
    "path",
    "metadata.path",
    "links.self",
    "links.page",
    "links.content",
  ];
  const rTag = recordTag(record);
  for (let i = 0; i < candidates.length; i++) {
    const candidateName = candidates[i];
    const value = safeString(valueAtPath(record, candidates[i])).trim();
    if (!value) {
      continue;
    }
    const resolvedPath = resolve(value);
    if (looksLikeVideoSource(resolvedPath)) {
      return resolvedPath;
    }
    if (
      rTag &&
      rTag.indexOf("video") !== -1 &&
      candidateName.indexOf("links.") !== 0 &&
      resolvedPath.indexOf("/x/api/") === -1
    ) {
      return resolvedPath;
    }
  }
  return "";
};

export const displayValue = (value) => {
  if (value === null || typeof value === "undefined" || value === "") {
    return "—";
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  if (typeof value === "number") {
    return String(value);
  }
  if (Array.isArray(value)) {
    const containsObject = value.some(
      (item) => item && typeof item === "object",
    );
    if (containsObject) {
      try {
        return JSON.stringify(value, null, 2);
      } catch (e) {}
    }
    return value.map((item) => safeString(item)).join(", ");
  }
  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return safeString(value);
    }
  }
  return safeString(value);
};

export const shortValue = (value, max = 240) => {
  const normalized = safeString(value);
  if (normalized.length <= max) {
    return normalized;
  }
  return `${normalized.substring(0, max)}…`;
};

export const tableCellValue = (column, value) => {
  const dValue = displayValue(value);
  const normalizedColumn = safeString(column).toLowerCase();
  if (normalizedColumn.indexOf("haxelementschema") !== -1) {
    return dValue;
  }
  return shortValue(dValue, 180);
};

export const tableColumns = (records, selectedFields) => {
  if (Array.isArray(selectedFields) && selectedFields.length > 0) {
    return selectedFields;
  }
  if (!Array.isArray(records) || records.length < 1) {
    return ["id", "title", "slug"];
  }
  const firstRecord = records[0];
  if (!firstRecord || typeof firstRecord !== "object") {
    return ["value"];
  }
  return Object.keys(firstRecord).slice(0, 6);
};

export const recordTimelineDate = (record) => {
  const candidates = [
    "generatedAt",
    "dateCreated",
    "updated",
    "created",
    "metadata.updated",
    "metadata.created",
  ];
  for (let i = 0; i < candidates.length; i++) {
    const value = safeString(valueAtPath(record, candidates[i])).trim();
    if (!value) {
      continue;
    }
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString();
    }
  }
  return "";
};

export const timelineEvents = (records) => {
  if (!Array.isArray(records)) {
    return [];
  }
  return records
    .map((record) => {
      const isoDate = recordTimelineDate(record);
      const headingPrefix = isoDate
        ? new Date(isoDate).toLocaleDateString()
        : "Record";
      const detailsSource =
        recordDescription(record) || recordBody(record) || "";
      const details = shortValue(stripHtml(detailsSource), 420);
      return {
        heading: `${headingPrefix} — ${recordTitle(record)}`,
        details,
        imagesrc: recordImage(record),
        imagealt: `${recordTitle(record)} image`,
      };
    })
    .filter((event) => event.heading && event.details);
};

export const numericValue = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  const normalized = safeString(value).trim();
  if (!normalized) {
    return null;
  }
  const numeric = Number(normalized);
  if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
    return numeric;
  }
  return null;
};

export const chartDescriptor = (records, selectedFields, selectedEntity) => {
  if (!Array.isArray(records) || records.length < 1) {
    return null;
  }
  const firstRecord = records[0];
  const selected = Array.isArray(selectedFields) ? selectedFields : [];
  const flattened = (() => {
    const input = firstRecord || {};
    const output = {};
    const walk = (obj, prefix = "") => {
      const keys = Object.keys(obj || {});
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const val = obj[key];
        const path = prefix ? `${prefix}.${key}` : key;
        if (val && typeof val === "object" && !Array.isArray(val)) {
          walk(val, path);
        } else {
          output[path] = val;
        }
      }
    };
    walk(input);
    return output;
  })();
  const candidateFields = selected.length > 0 ? selected : Object.keys(flattened);
  let valueField = "";
  for (let i = 0; i < candidateFields.length; i++) {
    const field = candidateFields[i];
    for (let j = 0; j < records.length; j++) {
      const val = numericValue(valueAtPath(records[j], field));
      if (val !== null) {
        valueField = field;
        break;
      }
    }
    if (valueField) {
      break;
    }
  }
  if (!valueField) {
    return null;
  }
  let labelField = "";
  for (let i = 0; i < candidateFields.length; i++) {
    const field = candidateFields[i];
    if (field === valueField) {
      continue;
    }
    const val = safeString(valueAtPath(firstRecord, field)).trim();
    if (val) {
      labelField = field;
      break;
    }
  }
  const labels = [];
  const values = [];
  const recordLimit = Math.min(records.length, 24);
  for (let i = 0; i < recordLimit; i++) {
    const record = records[i];
    const label = labelField
      ? safeString(valueAtPath(record, labelField)).trim()
      : recordTitle(record);
    const numeric = numericValue(valueAtPath(record, valueField));
    labels.push(label || recordTitle(record));
    values.push(numeric === null ? 0 : numeric);
  }
  return {
    valueField,
    labelField,
    data: {
      labels,
      series: [values],
    },
  };
};

export const treeRecords = (records) => {
  if (!Array.isArray(records) || records.length < 1) {
    return [];
  }
  const idLookup = {};
  const mapped = records.map((record, index) => {
    const rawId = safeString(
      record.id || record.slug || record.path || record.tag || `${index + 1}`,
    ).trim();
    const id = rawId || `${index + 1}`;
    idLookup[id] = true;
    return {
      id,
      parent: safeString(record.parent).trim(),
      title: recordTitle(record),
      slug: recordUrl(record),
      metadata: {
        icon: recordIcon(record),
        pageType: safeString(record.pageType || ""),
        published: true,
      },
    };
  });
  mapped.forEach((record) => {
    if (
      !record.parent ||
      !Object.prototype.hasOwnProperty.call(idLookup, record.parent)
    ) {
      record.parent = null;
    }
  });
  return mapped;
};

export const renderRecordBody = (record, maxLength = 240) => {
  const body = recordBody(record);
  if (!body) {
    return html``;
  }
  if (recordBodyIsHtml(record)) {
    return html`<div class="record-html">${unsafeHTML(body)}</div>`;
  }
  return html`<p>${shortValue(body, maxLength)}</p>`;
};

export const renderRecordPrimary = (record, maxLength = 240, options = {}) => {
  const vSource = videoSource(record, options);
  if (vSource) {
    return html`
      <div class="record-media">
        <video-player
          source="${vSource}"
          media-title="${recordTitle(record)}"
        ></video-player>
      </div>
    `;
  }
  const imgSource = recordImage(record, options);
  if (imgSource) {
    return html`
      <img
        class="record-image"
        src="${imgSource}"
        alt="${recordTitle(record)} preview"
        loading="lazy"
        decoding="async"
      />
    `;
  }
  const elementPreview = renderRecordElementPreview(record);
  if (elementPreview) {
    return elementPreview;
  }
  return renderRecordBody(record, maxLength);
};

export const titleFromParameterName = (name) => {
  const label = safeString(name)
    .replace(/[._-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return label.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const renderCollectionPreview = (records, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  return html`
    <collection-list>
      ${records.map((record) => {
        const tags = recordTags(record);
        const url = recordUrl(record, options);
        const bodyIsHtml = recordBodyIsHtml(record);
        const elementPreview = renderRecordElementPreview(record);
        return html`
          <collection-item
            line1="${recordTitle(record)}"
            line2="${bodyIsHtml
              ? ""
              : shortValue(recordDescription(record), 180)}"
            url="${url}"
            image="${recordImage(record, options)}"
            icon="${recordIcon(record)}"
            tags="${tags.join(",")}"
            accent-color="grey"
            saturate
          >
            ${elementPreview
              ? elementPreview
              : renderRecordBody(record, 220)}
          </collection-item>
        `;
      })}
    </collection-list>
  `;
};

export const renderGridPreview = (records, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  return html`
    <div class="card-grid">
      ${records.map((record) => {
        const url = recordUrl(record, options);
        return html`
          <accent-card accent-color="grey" no-border>
            <div slot="heading">${recordTitle(record)}</div>
            <div slot="subheading">
              ${recordTags(record).slice(0, 5).join(", ")}
            </div>
            <div slot="content">
              ${renderRecordPrimary(record, 240, options)}
              ${url
                ? html`<a
                    class="card-link"
                    href="${url}"
                    target="_blank"
                    rel="noopener"
                    >Open record</a
                  >`
                : html``}
            </div>
          </accent-card>
        `;
      })}
    </div>
  `;
};

export const renderCardsPreview = (records, options = {}) => {
  return renderGridPreview(records, options);
};

export const renderBulletedListPreview = (records, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  return html`
    <ul class="result-list">
      ${records.map((record) => {
        const url = recordUrl(record, options);
        return html`
          <li class="result-list-item">
            <h4 class="result-title">
              ${url
                ? html`<a href="${url}" target="_blank" rel="noopener"
                    >${recordTitle(record)}</a
                  >`
                : recordTitle(record)}
            </h4>
            ${renderRecordPrimary(record, 360, options)}
          </li>
        `;
      })}
    </ul>
  `;
};

export const renderContentPreview = (records, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  return html`
    <div class="content-records">
      ${records.map((record) => {
        const url = recordUrl(record, options);
        return html`
          <article class="content-record">
            <h3 class="content-record-title">
              ${url
                ? html`<a href="${url}" target="_blank" rel="noopener"
                    >${recordTitle(record)}</a
                  >`
                : recordTitle(record)}
            </h3>
            ${renderRecordPrimary(record, 720, options)}
          </article>
        `;
      })}
    </div>
  `;
};

export const renderTablePreview = (records, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  const columns = tableColumns(records, options.selectedFields);
  return html`
    <div class="table-scroll">
      <editable-table-display
        bordered
        condensed
        column-header
        responsive
        sort
        striped
        scroll
      >
        <table>
          <thead>
            <tr>
              ${columns.map(
                (column) =>
                  html`<th>${titleFromParameterName(column)}</th>`,
              )}
            </tr>
          </thead>
          <tbody>
            ${records.map(
              (record) => html`
                <tr>
                  ${columns.map((column) => {
                    const value = valueAtPath(record, column);
                    return html`<td title="${displayValue(value)}">
                      ${tableCellValue(column, value)}
                    </td>`;
                  })}
                </tr>
              `,
            )}
          </tbody>
        </table>
      </editable-table-display>
    </div>
  `;
};

export const renderCarouselPreview = (records, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  const allImageRecords = records.every((record) => {
    const hasVideo = videoSource(record, options);
    const hasImage = recordImage(record, options);
    return !hasVideo && !!hasImage;
  });
  if (allImageRecords) {
    return html`
      <div class="media-gallery">
        ${records.map((record) => {
          const image = recordImage(record, options);
          const url = recordUrl(record, options);
          return html`
            <div class="media-gallery-item">
              ${url
                ? html`<a href="${url}" target="_blank" rel="noopener"
                    ><img
                      src="${image}"
                      alt="${recordTitle(record)} preview"
                      loading="lazy"
                      decoding="async"
                  /></a>`
                : html`<img
                    src="${image}"
                    alt="${recordTitle(record)} preview"
                    loading="lazy"
                    decoding="async"
                  />`}
              <span class="media-gallery-caption"
                >${recordTitle(record)}</span
              >
            </div>
          `;
        })}
      </div>
    `;
  }
  return html`
    <div class="carousel-shell">
      <play-list navigation pagination>
        ${records.map((record) => {
          const vSource = videoSource(record, options);
          if (vSource) {
            return html`
              <video-player
                source="${vSource}"
                media-title="${recordTitle(record)}"
              ></video-player>
            `;
          }
          const url = recordUrl(record, options);
          const image = recordImage(record, options);
          const elementPreview = renderRecordElementPreview(record);
          if (image) {
            return html`
              <figure>
                <img
                  class="record-image"
                  src="${image}"
                  alt="${recordTitle(record)} preview"
                  loading="lazy"
                  decoding="async"
                />
                <figcaption>
                  ${url
                    ? html`<a
                        href="${url}"
                        target="_blank"
                        rel="noopener"
                        >${recordTitle(record)}</a
                      >`
                    : recordTitle(record)}
                </figcaption>
              </figure>
            `;
          }
          if (elementPreview) {
            return html`${elementPreview}`;
          }
          return html`
            <accent-card accent-color="grey">
              <div slot="heading">${recordTitle(record)}</div>
              <div slot="content">
                ${renderRecordBody(record, 300)}
                ${url
                  ? html`<a href="${url}" target="_blank" rel="noopener"
                      >Open record</a
                    >`
                  : html``}
              </div>
            </accent-card>
          `;
        })}
      </play-list>
    </div>
  `;
};

export const renderAccordionPreview = (records, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  return html`
    <div class="accordion-preview">
      <a11y-collapse-group>
        ${records.map(
          (record, index) => html`
            <a11y-collapse
              heading-button
              heading="${recordTitle(record)}"
              ?expanded="${index === 0}"
            >
              ${renderRecordPrimary(record, 420, options)}
            </a11y-collapse>
          `,
        )}
      </a11y-collapse-group>
    </div>
  `;
};

export const renderTabsPreview = (records, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  return html`
    <div class="tabs-preview">
      <a11y-tabs full-width>
        ${records.map(
          (record, index) => html`
            <a11y-tab
              id="views-preview-tab-${index}"
              label="${recordTitle(record)}"
            >
              ${renderRecordPrimary(record, 520, options)}
            </a11y-tab>
          `,
        )}
      </a11y-tabs>
    </div>
  `;
};

export const renderTimelinePreview = (records, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  const events = timelineEvents(records);
  if (!events || events.length < 1) {
    return html`<p class="empty-preview">
      No date-oriented records available for timeline rendering.
    </p>`;
  }
  return html`
    <div class="timeline-shell">
      <lrndesign-timeline
        timeline-title="${titleFromParameterName(
          options.selectedEntity || "",
        )} timeline"
        .events="${events}"
      ></lrndesign-timeline>
    </div>
  `;
};

export const renderChartPreview = (records, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  const descriptor = chartDescriptor(
    records,
    options.selectedFields,
    options.selectedEntity,
  );
  if (!descriptor) {
    return html`<p class="empty-preview">
      No numeric field detected for chart rendering.
    </p>`;
  }
  return html`
    <div class="chart-shell">
      <p class="note">
        Charting
        <strong>${titleFromParameterName(descriptor.valueField)}</strong
        >${descriptor.labelField
          ? html` by
              <strong
                >${titleFromParameterName(descriptor.labelField)}</strong
              >`
          : html``}
      </p>
      <lrndesign-bar
        .data="${descriptor.data}"
        chart-title="${titleFromParameterName(
          options.selectedEntity || "",
        )} chart"
        show-table
      ></lrndesign-bar>
    </div>
  `;
};

export const renderTreePreview = (records, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  const mapped = treeRecords(records);
  if (!mapped || mapped.length < 1) {
    return html`<p class="empty-preview">
      No hierarchical records available for tree rendering.
    </p>`;
  }
  return html`
    <div class="tree-shell">
      <map-menu .data="${mapped}" auto-scroll></map-menu>
    </div>
  `;
};

export const renderImageGalleryPreview = (records, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  const imageRecords = records.filter((record) => {
    return !!recordImage(record, options);
  });
  if (imageRecords.length < 1) {
    return html`<p class="empty-preview">No image records available for gallery rendering.</p>`;
  }
  return html`
    <image-gallery mode="masonry">
      ${imageRecords.map((record) => {
        const image = recordImage(record, options);
        return html`<img src="${image}" alt="${recordTitle(record)} preview" loading="lazy" decoding="async" />`;
      })}
    </image-gallery>
  `;
};

export const renderMediaPlaylistPreview = (records, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  const mediaRecords = records.filter((record) => {
    return !!videoSource(record, options) || !!recordImage(record, options);
  });
  if (mediaRecords.length < 1) {
    return html`<p class="empty-preview">No media records available for playlist rendering.</p>`;
  }
  return html`
    <media-playlist>
      ${mediaRecords.map((record) => {
        const vSource = videoSource(record, options);
        if (vSource) {
          return html`<video-player source="${vSource}" media-title="${recordTitle(record)}"></video-player>`;
        }
        const image = recordImage(record, options);
        return html`<img src="${image}" alt="${recordTitle(record)} preview" loading="lazy" decoding="async" />`;
      })}
    </media-playlist>
  `;
};

export const renderPreview = (records, renderer, options = {}) => {
  if (!Array.isArray(records)) {
    return html``;
  }
  const normalizedRenderer =
    renderer === "playlist"
      ? "carousel"
      : renderer === "cards"
        ? "grid"
        : renderer;
  switch (normalizedRenderer) {
    case "table":
      return renderTablePreview(records, options);
    case "grid":
      return renderGridPreview(records, options);
    case "carousel":
      return renderCarouselPreview(records, options);
    case "image-gallery":
      return renderImageGalleryPreview(records, options);
    case "media-playlist":
      return renderMediaPlaylistPreview(records, options);
    case "list":
      return renderBulletedListPreview(records, options);
    case "content":
      return renderContentPreview(records, options);
    case "accordion":
      return renderAccordionPreview(records, options);
    case "tabs":
      return renderTabsPreview(records, options);
    case "timeline":
      return renderTimelinePreview(records, options);
    case "chart":
      return renderChartPreview(records, options);
    case "tree":
      return renderTreePreview(records, options);
    case "collection":
    default:
      return renderCollectionPreview(records, options);
  }
};

export const RENDERER_OPTIONS = [
  { value: "collection", text: "Collection" },
  { value: "table", text: "Table" },
  { value: "grid", text: "Grid" },
  { value: "carousel", text: "Carousel" },
  { value: "image-gallery", text: "Image Gallery" },
  { value: "media-playlist", text: "Media Playlist" },
  { value: "list", text: "List" },
  { value: "content", text: "Content" },
  { value: "accordion", text: "Accordion" },
  { value: "tabs", text: "Tabs" },
  { value: "timeline", text: "Timeline" },
  { value: "chart", text: "Chart" },
  { value: "tree", text: "Tree" },
];

export const viewsRendererStyles = css`
  .table-scroll {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .table-scroll table {
    min-width: 600px;
    width: 100%;
    border-collapse: collapse;
  }
  .table-scroll th,
  .table-scroll td {
    text-align: left;
    vertical-align: top;
    padding: var(--ddd-spacing-2);
    border-bottom: var(--ddd-border-xs) solid
      light-dark(
        var(--ddd-theme-default-limestoneGray),
        var(--ddd-primary-5)
      );
    font-size: var(--ddd-font-size-5xs);
  }
  .card-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ddd-spacing-3);
  }
  .card-grid accent-card {
    width: 100%;
  }
  .card-link {
    font-size: var(--ddd-font-size-4xs);
  }
  .record-html {
    font-size: var(--ddd-font-size-5xs);
    line-height: var(--ddd-lh-150);
    overflow-wrap: anywhere;
  }
  .record-image {
    display: block;
    width: 100%;
    max-height: 220px;
    object-fit: cover;
    border-radius: var(--ddd-radius-sm);
    margin-bottom: var(--ddd-spacing-2);
    border: var(--ddd-border-xs) solid
      light-dark(
        var(--ddd-theme-default-limestoneGray),
        var(--ddd-primary-5)
      );
  }
  .record-media {
    display: block;
    width: 100%;
    margin-bottom: var(--ddd-spacing-2);
  }
  .record-media video-player {
    display: block;
    width: 100%;
  }
  .record-element-preview {
    border: var(--ddd-border-xs) solid
      light-dark(
        var(--ddd-theme-default-limestoneGray),
        var(--ddd-primary-5)
      );
    border-radius: var(--ddd-radius-sm);
    padding: var(--ddd-spacing-2);
    margin-bottom: var(--ddd-spacing-2);
    overflow: auto;
  }
  .record-element-preview > * {
    max-width: 100%;
  }
  .result-list {
    margin: 0;
    padding-left: var(--ddd-spacing-4);
    display: flex;
    flex-direction: column;
    gap: var(--ddd-spacing-3);
  }
  .result-list-item {
    margin: 0;
    font-size: var(--ddd-font-size-5xs);
  }
  .result-title {
    margin: 0 0 var(--ddd-spacing-1) 0;
    font-size: var(--ddd-font-size-4xs);
  }
  .content-records {
    display: flex;
    flex-direction: column;
    gap: var(--ddd-spacing-4);
  }
  .content-record {
    border-bottom: var(--ddd-border-xs) solid
      light-dark(
        var(--ddd-theme-default-limestoneGray),
        var(--ddd-primary-5)
      );
    padding-bottom: var(--ddd-spacing-3);
  }
  .content-record:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }
  .content-record-title {
    margin: 0 0 var(--ddd-spacing-2) 0;
    font-size: var(--ddd-font-size-s);
  }
  .carousel-shell play-list,
  .playlist-shell play-list {
    display: block;
  }
  .media-gallery {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ddd-spacing-3);
  }
  .media-gallery-item {
    border: var(--ddd-border-xs) solid
      light-dark(
        var(--ddd-theme-default-limestoneGray),
        var(--ddd-primary-5)
      );
    border-radius: var(--ddd-radius-sm);
    overflow: hidden;
    background: light-dark(
      var(--ddd-theme-default-white),
      rgba(255, 255, 255, 0.03)
    );
  }
  .media-gallery-item img {
    display: block;
    width: 100%;
    height: 220px;
    object-fit: cover;
  }
  .media-gallery-caption {
    display: block;
    padding: var(--ddd-spacing-2);
    font-size: var(--ddd-font-size-5xs);
  }
  .accordion-preview {
    display: block;
  }
  .accordion-preview a11y-collapse {
    --a11y-collapse-margin: 0 0 var(--ddd-spacing-2) 0;
  }
  .tabs-preview a11y-tabs {
    --a11y-tabs-content-padding: var(--ddd-spacing-3);
    --a11y-tabs-button-padding: var(--ddd-spacing-2);
  }
  .timeline-shell lrndesign-timeline {
    display: block;
  }
  .chart-shell lrndesign-bar {
    display: block;
    min-height: 280px;
  }
  .tree-shell {
    min-height: 320px;
    border: var(--ddd-border-xs) solid
      light-dark(
        var(--ddd-theme-default-limestoneGray),
        var(--ddd-primary-5)
      );
    border-radius: var(--ddd-radius-sm);
    overflow: hidden;
  }
  .tree-shell map-menu {
    height: 320px;
    --map-menu-gap: var(--ddd-spacing-2);
  }
  @media screen and (max-width: 1024px) {
    .card-grid {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    .media-gallery {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
  }
`;

export default viewsRendererStyles;
