import { fixture, expect, html } from "@open-wc/testing";
import {
  activityId,
  activityKey,
  authoredResource,
  buildStatement,
  choiceResponse,
  describeResponse,
  deviceActor,
  educationalRecordContext,
  interactionComponents,
  legacyActivityKey,
  pageUrl,
  responseText,
  setActorProvider,
  statementFromEngagement,
  XAPI_EDUCATIONAL_RECORD_CATEGORY,
  XAPI_EXTENSIONS,
  XAPI_VERBS,
  XAPI_VERSION,
} from "../lib/xapi.js";
import { UserActionBroker } from "../lib/UserActionBroker.js";
import {
  XAPI_VOCABULARY,
  XAPI_TRACKABLE_TAGS,
} from "../lib/xapi-vocabulary.js";
import "../user-action.js";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe("xapi statement builder", () => {
  afterEach(() => setActorProvider(null));

  it("maps every ADL verb used by HAX", () => {
    [
      "answered",
      "attempted",
      "completed",
      "experienced",
      "progressed",
      "interacted",
    ].forEach((v) => {
      expect(XAPI_VERBS[v]).to.equal(`http://adlnet.gov/expapi/verbs/${v}`);
    });
    // one meaning per verb: pass and fail live in result.success
    expect(Object.keys(XAPI_VERBS).length).to.equal(6);
  });

  it("builds a full xAPI 1.0.3 statement", () => {
    const s = buildStatement({
      verb: "answered",
      object: {
        id: "https://x.test/p#q1",
        name: "Q1",
        interactionType: "choice",
      },
      result: {
        success: true,
        completion: true,
        response: "Sound",
        score: { raw: 1, max: 1 },
      },
    });
    expect(s.id).to.match(UUID);
    expect(s.version).to.equal(XAPI_VERSION);
    expect(s.verb.id).to.equal(XAPI_VERBS.answered);
    expect(s.verb.display["en-US"]).to.equal("answered");
    expect(s.object.objectType).to.equal("Activity");
    expect(s.object.definition.type).to.equal(
      "http://adlnet.gov/expapi/activities/cmi.interaction",
    );
    expect(s.object.definition.interactionType).to.equal("choice");
    expect(Object.values(s.object.definition.name)[0]).to.equal("Q1");
    expect(s.result.response).to.equal("Sound");
    expect(s.result.score).to.deep.equal({ raw: 1, min: 0, max: 1, scaled: 1 });
    expect(new Date(s.timestamp).toString()).to.not.equal("Invalid Date");
  });

  it("marks every statement as an educational record", () => {
    const s = buildStatement({ verb: "completed", object: { id: "urn:x" } });
    const ctx = s.context;
    expect(ctx.platform).to.equal("HAX");
    expect(ctx.contextActivities.category[0].id).to.equal(
      XAPI_EDUCATIONAL_RECORD_CATEGORY,
    );
    expect(ctx.contextActivities.category[0].definition.name["en-US"]).to.equal(
      "Educational record",
    );
    expect(ctx.extensions[XAPI_EXTENSIONS.educationalRecord]).to.equal(true);
    expect(ctx.contextActivities.parent[0].id).to.equal(pageUrl());
    expect(ctx.contextActivities.grouping[0].definition.type).to.equal(
      "http://adlnet.gov/expapi/activities/course",
    );
    // context options name the page and site
    const named = educationalRecordContext({ pageName: "P", siteName: "S" });
    expect(
      Object.values(named.contextActivities.parent[0].definition.name)[0],
    ).to.equal("P");
  });

  it("uses the registered actor and never carries a name or email", () => {
    const actor = deviceActor(undefined, "https://site.test/");
    expect(Object.keys(actor).sort()).to.deep.equal(["account", "objectType"]);
    expect(Object.keys(actor.account).sort()).to.deep.equal([
      "homePage",
      "name",
    ]);
    expect(actor.account.name).to.match(UUID);
    setActorProvider(() => actor);
    const s = buildStatement({ verb: "answered", object: { id: "urn:x" } });
    expect(s.actor).to.deep.equal(actor);
    const text = JSON.stringify(s);
    expect(text).to.not.include("mbox");
    expect(text).to.not.include("@");
    setActorProvider(null);
    expect(buildStatement({ verb: "answered" }).actor).to.equal(undefined);
  });

  it("turns answers into response text", () => {
    expect(responseText(["a", "b"])).to.equal("a[,]b");
    expect(responseText([{ label: "x" }, { text: "y" }])).to.equal("x[,]y");
    expect(responseText("typed")).to.equal("typed");
    expect(responseText(null)).to.equal("");
  });

  it("gives stable activity ids from id, else content", async () => {
    const el = await fixture(
      html`<div>
        <span id="named"></span><span title="same"></span
        ><span title="same"></span>
      </div>`,
    );
    const [named, a, b] = el.querySelectorAll("span");
    expect(activityId(named)).to.equal(`${pageUrl()}#named`);
    expect(activityKey(a)).to.match(/^span-[0-9a-f]+$/);
    expect(activityKey(b)).to.equal(`${activityKey(a)}-1`);
    expect(activityId(a)).to.equal(activityId(a));
  });

  it("ignores an id the element generated for itself", () => {
    const el = document.createElement("span");
    el.textContent = "generated";
    el.id = "thing" + 123;
    el._xapiGeneratedId = el.id;
    expect(activityKey(el)).to.match(/^span-[0-9a-f]+$/);
    el.id = "authored";
    expect(activityKey(el)).to.equal("authored");
  });

  it("keys by id, then authored resource, then content", async () => {
    const el = await fixture(
      html`<div>
        <span id="has-id" title="same" resource="#r0"></span
        ><span title="same" resource="#r1"></span
        ><span title="same" resource="#generated"></span
        ><span title="same"></span>
      </div>`,
    );
    const [withId, authored, generated, plain] = el.querySelectorAll("span");
    // what SchemaBehaviors records on connect (see schema-behaviors.js)
    withId._xapiAuthoredResource = "#r0";
    authored._xapiAuthoredResource = "#r1";
    generated._xapiAuthoredResource = "";
    expect(activityKey(withId)).to.equal("has-id");
    expect(authoredResource(authored)).to.equal("#r1");
    expect(activityKey(authored)).to.equal("r1");
    // a resource that was not in the markup is ignored
    expect(activityKey(generated)).to.match(/^span-[0-9a-f]+$/);
    expect(activityKey(plain)).to.equal(`${activityKey(generated)}-1`);
    // the old rule counted the authored element as a twin
    expect(legacyActivityKey(authored)).to.equal(activityKey(generated));
    expect(legacyActivityKey(plain)).to.equal(`${activityKey(generated)}-2`);
    // a duplicated block with the same authored resource stays distinct
    const twin = authored.cloneNode();
    twin._xapiAuthoredResource = "#r1";
    el.appendChild(twin);
    expect(activityKey(twin)).to.equal("r1-1");
  });

  it("puts interaction components into the definition as language maps", () => {
    const choices = interactionComponents(["Yes", "No"]);
    const s = buildStatement({
      verb: "answered",
      object: {
        id: "https://example.org/q",
        interactionType: "choice",
        choices,
        correctResponsesPattern: [choices[0].id],
      },
      result: { response: choiceResponse([choices[1].id]) },
      context: { language: "fr" },
    });
    expect(s.object.definition.choices).to.deep.equal([
      { id: choices[0].id, description: { fr: "Yes" } },
      { id: choices[1].id, description: { fr: "No" } },
    ]);
    expect(s.object.definition.correctResponsesPattern).to.deep.equal([
      choices[0].id,
    ]);
    expect(s.result.response).to.equal(choices[1].id);
    expect(describeResponse(s)).to.equal("No");
    // components are only for interactions
    const plain = buildStatement({
      verb: "experienced",
      object: { id: "https://example.org/p", choices },
    });
    expect(plain.object.definition.choices).to.equal(undefined);
  });

  it("converts loose engagement details", () => {
    const s = statementFromEngagement({
      activityDisplay: "progressed",
      objectName: "List",
      resultScore: 0.5,
      resultCompletion: false,
    });
    expect(s.verb.id).to.equal(XAPI_VERBS.progressed);
    expect(s.result.score.scaled).to.equal(0.5);
    expect(s.result.completion).to.equal(false);
  });
});

describe("UserActionBroker normalization", () => {
  it("keeps a statement an event already carries", () => {
    const broker = new UserActionBroker();
    const el = document.createElement("div");
    const statement = buildStatement({
      verb: "answered",
      object: { id: "urn:q" },
    });
    expect(broker.normalize("user-engagement", { statement }, el)).to.equal(
      statement,
    );
  });

  it("does not treat question-element-state as a learner record", async () => {
    const broker = new UserActionBroker();
    const got = [];
    broker.listen();
    const off = broker.subscribe((e) => got.push(e));
    const el = await fixture(html`<p id="state-only"></p>`);
    el.dispatchEvent(
      new CustomEvent("question-element-state", {
        bubbles: true,
        composed: true,
        detail: { correct: true, attempts: 1, maxAttempts: 0 },
      }),
    );
    expect(got.length).to.equal(0);
    off();
    broker.unlisten();
  });

  it("hands window events to subscribers", async () => {
    const broker = new UserActionBroker();
    const got = [];
    broker.listen();
    const off = broker.subscribe((e) => got.push(e));
    const el = await fixture(html`<p id="tick"></p>`);
    el.dispatchEvent(
      new CustomEvent("user-engagement", {
        bubbles: true,
        composed: true,
        detail: { activityDisplay: "interacted", objectName: "x" },
      }),
    );
    el.dispatchEvent(
      new CustomEvent("learner-progress-import", {
        bubbles: true,
        composed: true,
        detail: { activityDisplay: "progressed" },
      }),
    );
    off();
    broker.unlisten();
    expect(got.length).to.equal(2);
    expect(got[0].element).to.equal(el);
    expect(got[0].statement.object.id).to.equal(`${pageUrl()}#tick`);
    expect(got[1].imported).to.equal(true);
  });

  it("user-action adds a statement to its user-engagement", async () => {
    const el = await fixture(html`<user-action track="click"></user-action>`);
    let detail = null;
    el.addEventListener("user-engagement", (e) => {
      detail = e.detail;
    });
    el.click();
    expect(detail.eventType).to.equal("click");
    expect(detail.statement.verb.id).to.equal(XAPI_VERBS.interacted);
  });
});

describe("xAPI vocabulary", () => {
  it("lists every emitting element with what it sends", () => {
    [
      "multiple-choice",
      "true-false-question",
      "short-answer-question",
      "sorting-question",
      "bullet-check-list",
      "video-player",
      "flash-card",
      "concept-quest-game",
      "user-action",
    ].forEach((tag) => {
      const v = XAPI_VOCABULARY[tag];
      expect(v, tag).to.exist;
      expect(v.event).to.equal("user-engagement");
      expect(v.verbs.length).to.be.greaterThan(0);
      v.verbs.forEach((verb) => expect(XAPI_VERBS[verb], verb).to.exist);
    });
    expect(XAPI_VOCABULARY["sorting-question"].interactionType).to.equal(
      "sequencing",
    );
    expect(XAPI_VOCABULARY["tagging-question"].interactionType).to.equal(
      "choice",
    );
    expect(XAPI_VOCABULARY["matching-question"].definition).to.include.members([
      "source",
      "target",
      "correctResponsesPattern",
    ]);
  });

  it("knows which elements count toward page completion", () => {
    expect(XAPI_TRACKABLE_TAGS).to.include("multiple-choice");
    expect(XAPI_TRACKABLE_TAGS).to.not.include("user-action");
  });
});
