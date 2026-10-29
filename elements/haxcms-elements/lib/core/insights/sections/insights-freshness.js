/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css, nothing } from "lit";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import { InsightsStyles } from "../insights-styles.js";

const LIMIT = 50;

/** "2025-01-24" -> "Jan 24, 2025" in the page language, read as UTC */
function formatDay(iso) {
  if (!iso) {
    return "";
  }
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) {
    return iso;
  }
  const doc = globalThis.document;
  const lang =
    doc && doc.documentElement && doc.documentElement.lang
      ? doc.documentElement.lang
      : undefined;
  try {
    return d.toLocaleDateString(lang, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return iso;
  }
}

/**
 * `insights-freshness`
 * Reports screen: created and updated dates stored with each page. Key
 * numbers, a timeline of edit events, time since each page was saved,
 * titles likely to change each term, bulk saves and every page's dates.
 * Edit history and reminders need the server and show as Coming soon.
 *
 * @element insights-freshness
 * @fires insights-open-page - { slug } to visit a page
 */
class InsightsFreshness extends I18NMixin(LitElement) {
  static get tag() {
    return "insights-freshness";
  }

  static get properties() {
    return {
      results: { attribute: false },
      density: { type: String, reflect: true },
      _expanded: { state: true },
    };
  }

  constructor() {
    super();
    this.results = null;
    this.density = "default";
    this._expanded = {};
    this.t = this.t || {};
    this.t = {
      ...this.t,
      keyNumbers: "Key numbers",
      sinceLastEdit: "Since last edit",
      daysShort: "{n} d",
      noEdits: "No saved edits",
      editedRecently: "Edited in last year",
      ofPages: "of {n} pages",
      bulkSaved: "Bulk-saved",
      onDate: "on {date}",
      noBulkSaves: "no bulk saves",
      termSpecific: "Term-specific",
      titlesWithTermWords: "titles with term words",
      oldestCreated: "Oldest created",
      onPages: "on {n} pages",
      neverSaved: "Never saved",
      noUpdatedDate: "no updated date",
      timeline: "Timeline",
      timelineHint: "From created and updated dates in site.json",
      today: "Today",
      noEvents: "No dated events in site.json yet",
      ageTitle: "Time since each page was saved",
      pagesCount: "{n} pages",
      ageNeverSaved: "{n} never saved",
      noAges: "No pages have a saved date yet",
      termTitle: "Likely to change each term",
      termHint:
        "Titles that match term words: syllabus, schedule, exam, staff…",
      noTerm: "No titles look tied to one term",
      bulkTitle: "Bulk saves",
      bulkHint: "Many pages saved together, usually an import or a move",
      bulkCaption: "Bulk saves",
      date: "Date",
      pages: "Pages",
      from: "From",
      to: "To",
      noBulk: "No bulk saves: pages were saved a few at a time",
      pagesTitle: "Pages",
      pagesHint: "Created and last saved dates for every page",
      pagesCaption: "Created and last saved dates for each page",
      page: "Page",
      created: "Created",
      updated: "Last saved",
      daysSince: "Days since",
      termReason: "Term-specific",
      actions: "Actions",
      notSaved: "Not saved",
      none: "None",
      noPages: "No pages in this scan",
      openPage: "Open page",
      openPageNamed: "Open page {title}",
      showAll: "Show all {n}",
      showFewer: "Show fewer",
      remindMe: "Remind me",
      comingSoon: "Coming soon",
      editHistoryTitle: "Edit history",
      editHistoryText:
        "Who changed what and when comes from the site's history.",
      remindersTitle: "Reminders",
      remindersText: "Reminders for pages not touched in a year.",
    };
    this.registerLocalization({
      context: this,
      localesPath: new URL("../../../../locales/", import.meta.url).href,
    });
  }

  static get styles() {
    return [
      ...InsightsStyles,
      css`
        .events {
          list-style: none;
          margin: 0;
          padding: 0;
          border: 1px solid var(--hax-ui-line);
          border-radius: var(--hax-ui-radius);
        }
        .events li {
          display: flex;
          align-items: flex-start;
          gap: var(--hax-ui-gap-md);
          min-height: var(--insights-row);
          padding: var(--hax-ui-gap) var(--hax-ui-gap-md);
          border-bottom: 1px solid var(--hax-ui-line);
        }
        .events li:last-child {
          border-bottom: 0;
        }
        .events .hax-ui-pill {
          min-width: 96px;
          justify-content: center;
        }
        .cols {
          list-style: none;
          margin: 0;
          padding: var(--hax-ui-gap-md) 0 0;
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(0, 1fr);
          gap: var(--hax-ui-gap-md);
          align-items: end;
          min-height: 168px;
        }
        .cols li {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: var(--hax-ui-gap);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .cols .col {
          width: 100%;
          max-width: 56px;
          min-height: 2px;
          border-radius: var(--hax-ui-radius) var(--hax-ui-radius) 0 0;
          background-color: var(--hax-ui-accent);
        }
        .cols .lbl {
          color: var(--hax-ui-text-muted);
          white-space: nowrap;
        }
        .events .t {
          flex: 1;
          min-width: 0;
        }
        .events .d {
          display: block;
          color: var(--hax-ui-text-muted);
          font-size: var(--hax-ui-admin-font-size-xs);
        }
        .more {
          margin-top: var(--hax-ui-gap-md);
        }
        .soon-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: var(--hax-ui-gap);
        }
        .soon-panel {
          display: flex;
          gap: var(--hax-ui-gap-md);
          align-items: flex-start;
        }
        .soon-panel p {
          margin: 0;
        }
      `,
    ];
  }

  _sec() {
    return this.results && this.results.freshness
      ? this.results.freshness
      : null;
  }

  _openPage(slug) {
    if (!slug) {
      return;
    }
    this.dispatchEvent(
      new CustomEvent("insights-open-page", {
        bubbles: true,
        composed: true,
        cancelable: false,
        detail: { slug: slug },
      }),
    );
  }

  _openBtn(title, slug) {
    if (!slug) {
      return nothing;
    }
    return html`<button
      type="button"
      class="sbtn open"
      data-slug="${slug}"
      aria-label="${this.t.openPageNamed.replace("{title}", () => title)}"
      @click="${() => this._openPage(slug)}"
    >
      ${this.t.openPage}
    </button>`;
  }

  _toggle(key) {
    this._expanded = { ...this._expanded, [key]: !this._expanded[key] };
  }

  _limit(key, list) {
    return this._expanded[key] ? list : list.slice(0, LIMIT);
  }

  _moreBtn(key, list) {
    if (list.length <= LIMIT) {
      return nothing;
    }
    return html`<div class="more">
      <button
        type="button"
        class="sbtn show-all"
        aria-expanded="${this._expanded[key] ? "true" : "false"}"
        @click="${() => this._toggle(key)}"
      >
        ${this._expanded[key]
          ? this.t.showFewer
          : this.t.showAll.replace("{n}", () => list.length)}
      </button>
    </div>`;
  }

  _needs(key) {
    const sec = this._sec() || {};
    const own = sec[key];
    if (own && own.needs) {
      return own.needs;
    }
    const all = this.results && this.results.unavailable;
    const alt = key === "reminders" ? "schedules" : key;
    return all && all[alt] && all[alt].needs ? all[alt].needs : "";
  }

  render() {
    const sec = this._sec();
    if (!sec) {
      return nothing;
    }
    return html`<div class="sec">
      ${this._renderKpis(sec)}
      <div class="grid-2">
        ${this._renderTimeline(sec)} ${this._renderAges(sec)}
      </div>
      ${this._renderTerm(sec)} ${this._renderBulk(sec)}
      ${this._renderPages(sec)} ${this._renderSoon()}
    </div>`;
  }

  _renderKpis(sec) {
    const k = sec.kpis || {};
    const total = this._pageCount(sec);
    const tiles = [
      {
        id: "since",
        label: this.t.sinceLastEdit,
        value:
          k.daysSinceLastEdit === null || k.daysSinceLastEdit === undefined
            ? "–"
            : this.t.daysShort.replace("{n}", () => k.daysSinceLastEdit),
        note: k.lastEdit ? formatDay(k.lastEdit) : this.t.noEdits,
        tone:
          this.results.nav &&
          this.results.nav.freshness &&
          this.results.nav.freshness.tone === "warning"
            ? "warning"
            : "",
      },
      {
        id: "recent",
        label: this.t.editedRecently,
        value: k.editedRecently || 0,
        note: this.t.ofPages.replace("{n}", () => total),
        tone: total && !k.editedRecently ? "warning" : "",
      },
      {
        id: "bulk",
        label: this.t.bulkSaved,
        value: k.bulkSaved || 0,
        note: k.bulkSaveDate
          ? this.t.onDate.replace("{date}", () => formatDay(k.bulkSaveDate))
          : this.t.noBulkSaves,
        tone: "",
      },
      {
        id: "term",
        label: this.t.termSpecific,
        value: k.termSpecific || 0,
        note: this.t.titlesWithTermWords,
        tone: "",
      },
      {
        id: "oldest",
        label: this.t.oldestCreated,
        value:
          k.oldestCreatedYear === null || k.oldestCreatedYear === undefined
            ? "–"
            : k.oldestCreatedYear,
        note: this.t.onPages.replace("{n}", () => k.oldestCreatedCount || 0),
        tone: "",
      },
      {
        id: "never",
        label: this.t.neverSaved,
        value: k.neverSaved || 0,
        note: this.t.noUpdatedDate,
        tone: "",
      },
    ];
    return html`<section class="kpis" aria-label="${this.t.keyNumbers}">
      ${tiles.map(
        (s) =>
          html`<div class="kpi" data-kpi="${s.id}" data-tone="${s.tone}">
            <span class="l">${s.label}</span>
            <span class="v">${s.value}</span>
            <span class="l">${s.note}</span>
          </div>`,
      )}
    </section>`;
  }

  _pageCount(sec) {
    if (this.results.totals && this.results.totals.pages !== undefined) {
      return this.results.totals.pages;
    }
    return (sec.pages || []).length;
  }

  _renderTimeline(sec) {
    const events = sec.events || [];
    return html`<section aria-labelledby="fr-timeline">
      <h3 class="block" id="fr-timeline">
        ${this.t.timeline}<span class="hint">${this.t.timelineHint}</span>
      </h3>
      ${events.length
        ? html`<ol class="events">
            ${events.map(
              (e) =>
                html`<li data-code="${e.code}">
                  <span class="hax-ui-pill" data-tone="${e.tone || ""}"
                    >${e.code === "now"
                      ? this.t.today
                      : formatDay(e.date)}</span
                  >
                  <span class="t"
                    >${e.title}<span class="d">${e.detail}</span></span
                  >
                </li>`,
            )}
          </ol>`
        : html`<p class="empty">${this.t.noEvents}</p>`}
    </section>`;
  }

  _renderAges(sec) {
    const buckets = sec.ageBuckets || [];
    const max = buckets.reduce((n, b) => Math.max(n, b.count), 0);
    const k = sec.kpis || {};
    return html`<section aria-labelledby="fr-ages">
      <h3 class="block" id="fr-ages">
        ${this.t.ageTitle}<span class="hint"
          >${this.t.pagesCount.replace("{n}", () =>
            this._pageCount(sec),
          )}${k.neverSaved
            ? html` · ${this.t.ageNeverSaved.replace("{n}", () => k.neverSaved)}`
            : nothing}</span
        >
      </h3>
      ${max
        ? html`<ul class="cols">
            ${buckets.map(
              (b) =>
                html`<li>
                  <span class="num">${b.count}</span>
                  <span
                    class="col"
                    aria-hidden="true"
                    style="height:${Math.max(
                      Math.round((b.count / max) * 120),
                      2,
                    )}px"
                  ></span>
                  <span class="lbl">${b.label}</span>
                </li>`,
            )}
          </ul>`
        : html`<p class="empty">${this.t.noAges}</p>`}
    </section>`;
  }

  _slugFor(pageId) {
    const pages = (this._sec() || {}).pages || [];
    const hit = pages.find((p) => p.pageId === pageId);
    return hit ? hit.slug : "";
  }

  _renderTerm(sec) {
    const rows = sec.termSpecific || [];
    const shown = this._limit("term", rows);
    return html`<section aria-labelledby="fr-term">
      <h3 class="block" id="fr-term">
        ${this.t.termTitle}<span class="hint">${this.t.termHint}</span>
      </h3>
      ${rows.length
        ? html`<ul class="findings term">
              ${shown.map(
                (r) =>
                  html`<li>
                    <span class="t">${r.title}</span>
                    <span class="d">${r.reason}</span>
                    ${this._openBtn(r.title, this._slugFor(r.pageId))}
                  </li>`,
              )}
            </ul>
            ${this._moreBtn("term", rows)}`
        : html`<p class="empty">${this.t.noTerm}</p>`}
    </section>`;
  }

  _renderBulk(sec) {
    const rows = sec.bulkSaves || [];
    const fmtTime = (s) => {
      try {
        return new Date(s * 1000).toISOString().substring(11, 16);
      } catch {
        return "";
      }
    };
    return html`<section aria-labelledby="fr-bulk">
      <h3 class="block" id="fr-bulk">
        ${this.t.bulkTitle}<span class="hint">${this.t.bulkHint}</span>
      </h3>
      ${rows.length
        ? html`<div class="tbl-wrap">
            <table class="bulk">
              <caption class="sr-only">
                ${this.t.bulkCaption}
              </caption>
              <thead>
                <tr>
                  <th scope="col">${this.t.date}</th>
                  <th scope="col">${this.t.from}</th>
                  <th scope="col">${this.t.to}</th>
                  <th scope="col" class="num">${this.t.pages}</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map(
                  (b) =>
                    html`<tr>
                      <td>${formatDay(b.date)}</td>
                      <td>${fmtTime(b.start)} UTC</td>
                      <td>${fmtTime(b.end)} UTC</td>
                      <td class="num">${b.count}</td>
                    </tr>`,
                )}
              </tbody>
            </table>
          </div>`
        : html`<p class="empty">${this.t.noBulk}</p>`}
    </section>`;
  }

  _renderPages(sec) {
    const rows = sec.pages || [];
    const shown = this._limit("pages", rows);
    return html`<section aria-labelledby="fr-pages">
      <h3 class="block" id="fr-pages">
        ${this.t.pagesTitle}<span class="hint">${this.t.pagesHint}</span>
      </h3>
      ${rows.length
        ? html`<div class="tbl-wrap">
              <table class="pages">
                <caption class="sr-only">
                  ${this.t.pagesCaption}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">${this.t.page}</th>
                    <th scope="col">${this.t.created}</th>
                    <th scope="col">${this.t.updated}</th>
                    <th scope="col" class="num">${this.t.daysSince}</th>
                    <th scope="col">${this.t.termReason}</th>
                    <th scope="col">
                      <span class="sr-only">${this.t.actions}</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${shown.map(
                    (p) =>
                      html`<tr data-page="${p.pageId}">
                        <td>${p.title}</td>
                        <td>${p.created ? formatDay(p.created) : "–"}</td>
                        <td>
                          ${p.updated ? formatDay(p.updated) : this.t.notSaved}
                        </td>
                        <td class="num">
                          ${p.daysSinceUpdate === null ||
                          p.daysSinceUpdate === undefined
                            ? "–"
                            : p.daysSinceUpdate}
                        </td>
                        <td>${p.termReason || ""}</td>
                        <td>${this._openBtn(p.title, p.slug)}</td>
                      </tr>`,
                  )}
                </tbody>
              </table>
            </div>
            ${this._moreBtn("pages", rows)}`
        : html`<p class="empty">${this.t.noPages}</p>`}
    </section>`;
  }

  _renderSoon() {
    const history = this._needs("editHistory");
    const reminders = this._needs("reminders");
    return html`<section
      class="soon-panel"
      role="note"
      aria-label="${this.t.comingSoon}"
    >
      <span class="hax-ui-pill" data-tone="soon">${this.t.comingSoon}</span>
      <div class="soon-text">
        <p>
          <strong>${this.t.editHistoryTitle}.</strong>
          ${this.t.editHistoryText}
          <span class="needs-history">${history}.</span>
        </p>
        <p>
          <strong>${this.t.remindersTitle}.</strong>
          ${this.t.remindersText}
          <span class="needs-reminders">${reminders}.</span>
        </p>
      </div>
      <button
        type="button"
        class="sbtn remind"
        disabled
        title="${reminders}"
        aria-describedby="fr-remind-needs"
      >
        ${this.t.remindMe}
        <span class="hax-ui-pill" data-tone="soon">${this.t.comingSoon}</span>
      </button>
      <span id="fr-remind-needs" class="sr-only">${reminders}</span>
    </section>`;
  }
}

globalThis.customElements.define(InsightsFreshness.tag, InsightsFreshness);
export { InsightsFreshness };
