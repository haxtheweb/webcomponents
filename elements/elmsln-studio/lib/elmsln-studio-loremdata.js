/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";
import "@lrnwebcomponents/lorem-data/lorem-data.js";

/**
 * `elmsln-studio-loremdata`
 * Generates fake data for ELMS:LN Studio
 *
 * @customElement elmsln-studio-loremdata
 * @demo demo/loremdata.html
 * @lit-html
 * @lit-element
 */
class ElmslnStudioLoremdata extends ElmslnStudioUtilities(LitElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "elmsln-studio-loremdata";
  }
  static get properties() {
    return {
      sourcePath: {
        type: String,
        reflect: true,
        attribute: "source-path",
      },
      endDate: {
        type: Object,
      },
      lessonData: {
        type: Array,
      },
      lorem: {
        type: Object,
      },
      startDate: {
        type: Object,
      },
      lessons: {
        type: Object,
      },
      projects: {
        type: Object,
      },
      assignments: {
        type: Object,
      },
      portfolios: {
        type: Object,
      },
      submissions: {
        type: Object,
      },
      discussions: {
        type: Object,
      },
      profile: {
        type: Object,
      },
      users: {
        type: Object,
      },
      activity: {
        type: Array,
      },
      __imgCtr: {
        type: Number,
      },
      __demoImages: {
        type: Array,
      },
    };
  }

  constructor() {
    super();
    this.__demoImages = [];
    this.__imgCtr = 0;
    this.users = {
      ixp23: {
        id: "ixp23",
        lastName: "Instructor",
        firstName: "Person",
        instructor: true,
        image: `//placekitten.com/300/400`,
      },
      hxb5122: {
        id: "hxb5122",
        lastName: "Brown",
        firstName: "Havana",
      },
      tmn823: {
        id: "tmn823",
        lastName: "Nebelung",
        firstName: "Tabby",
      },
      kmk5124: {
        id: "kmk5124",
        lastName: "Korat",
        firstName: "Kitty",
        image: `//placekitten.com/g/400/300`,
      },
      tjm5488: {
        id: "tjm5488",
        lastName: "Manx",
        firstName: "Tortie",
        image: `//placekitten.com/400/300`,
      },
      fms9811: {
        id: "fms9811",
        lastName: "Sphinx",
        firstName: "Felix",
      },
      tjc5167: {
        id: "tjc5167",
        lastName: "Cat",
        firstName: "Tom",
        image: `//placekitten.com/g/400/400`,
      },
      cac488: {
        id: "cac488",
        lastName: "Coe",
        firstName: "Callie",
      },
      srf325: {
        id: "srf325",
        lastName: "Fold",
        firstName: "Scott",
        image: `//placekitten.com/400/400`,
      },
    };
    this.lessonData = [
      {
        id: "lesson-1",
        lesson: "Lesson 1",
        assignments: [
          {
            id: "assignment-1",
            assignment: "Lesson 1 Reading",
          },
          {
            id: "project-1",
            project: "Hypertext Narrative Project",
            assignments: [
              { id: "assignment-2", assignment: "Discover: Word-Pairs" },
              { id: "assignment-3", assignment: "Define: Synopsis" },
              {
                id: "assignment-4",
                assignment: "Develop: Story and Plot Elements",
              },
              { id: "assignment-5", assignment: "Develop: Characters" },
              {
                id: "assignment-6",
                assignment: "Deliver: Hypertext Narrative Draft",
              },
              { id: "assignment-7", assignment: "Deliver: Feedback" },
              { id: "assignment-8", assignment: "Deliver: Iterate" },
              { id: "assignment-9", assignment: "Deliver: Iterate critique" },
              { id: "assignment-10", assignment: "Deliver: Iterate critique" },
              {
                id: "assignment-11",
                assignment: "Deliver: Hypertext Narrative",
              },
            ],
          },
          { id: "assignment-12", assignment: "Lesson 1 Wrap-Up" },
        ],
      },
      {
        id: "lesson-2",
        lesson: "Lesson 2",
        assignments: [
          { id: "assignment-13", assignment: "Lesson 2 Reading" },
          {
            id: "project-2",
            project: "Ritual Project",
            assignments: [
              { id: "assignment-14", assignment: "Discover: Interview" },
              { id: "assignment-15", assignment: "Discover: Journey Map" },
              { id: "assignment-16", assignment: "Define: Themes & Insights" },
              { id: "assignment-17", assignment: "Define: HMW" },
              { id: "assignment-18", assignment: "Develop: Brainstorm" },
              { id: "assignment-19", assignment: "Develop: Storyboard" },
              { id: "assignment-20", assignment: "Develop: Prototype" },
              { id: "assignment-21", assignment: "Develop: Test and Iterate" },
              { id: "assignment-22", assignment: "Deliver: Final Prototype" },
            ],
          },
          { id: "assignment-23", assignment: "Lesson 2 Wrap-Up" },
        ],
      },
      {
        id: "lesson-3",
        lesson: "Lesson 3",
        assignments: [
          { id: "assignment-24", assignment: "Lesson 2 Reading" },
          {
            id: "project-3",
            project: "Open Kit Project",
            assignments: [
              { id: "assignment-25", assignment: "Discover: Toy Research" },
              { id: "assignment-26", assignment: "Discover: Modular Research" },
              { id: "assignment-27", assignment: "Discover: Resources" },
              { id: "assignment-28", assignment: "Define: Product Pitch" },
              { id: "assignment-29", assignment: "Develop: Prototyping" },
              { id: "assignment-30", assignment: "Develop: Instructions" },
              { id: "assignment-31", assignment: "Develop: Test" },
              { id: "assignment-32", assignment: "Develop: Iterate" },
              { id: "assignment-33", assignment: "Deliver: Open Toy" },
            ],
          },
          { id: "assignment-34", assignment: "Lesson 2 Wrap-Up" },
        ],
      },
    ];

    this.activity = [];
    this.profile = {};

    this.projects = {};
    this.lessons = {};
    this.assignments = {};

    this.portfolios = {};
    this.submissions = {};
    this.discussions = {};
  }
  static get styles() {
    return [css``];
  }
  render() {
    return html`
      <lorem-data id="lorem" .schemas="${this.schemas || []}"></lorem-data>
    `;
  }
  get students() {
    return Object.keys(this.users || {})
      .filter((u) => !this.users[u].instructor)
      .map((s) => this.users[s]);
  }
  get instructors() {
    return Object.keys(this.users || {})
      .filter((u) => this.users[u].instructor)
      .map((s) => this.users[s]);
  }
  get schemas() {
    return {
      "users.json": {
        type: "data",
        data: this.users,
      },
      "profile.json": {
        type: "data",
        data: this.profile,
      },
      "activity.json": {
        type: "data",
        data: this.activity,
      },

      "lessons.json": {
        type: "data",
        data: this.lessons,
      },
      "projects.json": {
        type: "data",
        data: this.projects,
      },
      "assignments.json": {
        type: "data",
        data: this.assignments,
      },

      "portfolios.json": {
        type: "data",
        data: this.portfolios,
      },
      "submissions.json": {
        type: "data",
        data: this.submissions,
      },
      "discussion.json": {
        type: "data",
        data: this.discussions,
      },
    };
  }
  firstUpdated(changedProperties) {
    this.__demoImages = [
      `${this.sourcePath}images/image1.jpg`,
      `${this.sourcePath}images/image2.jpg`,
      `${this.sourcePath}images/image3.jpg`,
      `${this.sourcePath}images/image4.jpg`,
      `${this.sourcePath}images/image5.jpg`,
      `${this.sourcePath}images/image6.jpg`,
      `${this.sourcePath}images/image7.jpg`,
      `${this.sourcePath}images/image8.jpg`,
    ];
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    let lorem = this.shadowRoot.getElementById("lorem"),
      startDate = lorem.addDays(undefined, -4 - 3 * this.lessonData.length),
      lessonDate = startDate;
    this.lessonData.forEach((l, i) => {
      let assignDate = lessonDate,
        assignments = l.assignments.map((a, ai) => {
          if (a.project) {
            let project = this._project(a, l.id, ai, assignDate, lorem);
            this.projects[a.id] = project;
            assignDate = lorem.addDays(assignDate, a.assignments.length);
            return project;
          } else {
            let assignment = this._assignment(
              a,
              l.id,
              undefined,
              ai,
              assignDate,
              lorem
            );
            assignDate = lorem.addDays(assignDate, 1);
            return assignment;
          }
        });
      this.lessons[l.id] = {
        id: l.id,
        order: i,
        lesson: l.lesson,
        body: lorem.randomParagraph(2, 6),
        assignments: assignments,
      };
      lessonDate = lorem.addWeeks(lessonDate, 1);
    });

    Object.keys(this.assignments || {}).forEach((a, i) => {
      let some = (arr) => Math.round(arr.length * 0.333),
        most = (arr) => Math.round(arr.length * 0.667),
        topic = lorem.randomOption([
          "animals",
          "arch",
          "nature",
          "people",
          "tech",
        ]),
        type = lorem.randomOption(["links", "body", "sources"]),
        creators =
          i > most(Object.keys(this.assignments || {}))
            ? []
            : i > some(Object.keys(this.assignments || {}))
            ? lorem.draw(
                this.students,
                some(this.students),
                most(this.students)
              )
            : this.students;
      creators.forEach((creator) =>
        this._submission(a, creator.id, topic, type, a.date, lorem)
      );
    });
    Object.keys(this.submissions).forEach((key) => {
      let s = this.submissions[key];
      s.activity = "submission";
      this.activity.push(s);
    });
    Object.keys(this.discussions).forEach((key) => {
      let d = this.discussions[key];
      d.activity = "discussion";
      this.activity.push(d);
      d.replies.forEach((reply) => {
        let r = reply;
        r.activity = "reply";
        this.activity.push(r);
      });
    });
    this.activity = lorem.sortDates(this.activity);
    this.profile = JSON.parse(
      JSON.stringify(lorem.randomOption(this.students))
    );
    this.profile.submissions = lorem.sortDates(
      Object.keys(this.submissions)
        .filter((key) => this.submissions[key].userId === this.profile.id)
        .map((key) => this.submissions[key])
    );
    this.profile.completed = this.profile.submissions.map(
      (submission) => submission.assignmentId
    );
    this.profile.due = Object.keys(this.assignments)
      .filter((key) => !this.profile.completed.includes(key))
      .map((key) => this.assignments[key]);
    this.profile.features = this.profile.submissions
      .filter((submission) => submission.feature)
      .map((submission) => submission.id);
    this.profile.feedback = lorem.sortDates(
      this.profile.submissions
        .map((submission) => submission.feedback)
        .flat()
        .map((key) => this.discussions[key])
    );
    this.profile.given = Object.keys(this.discussions).filter(
      (key) => this.discussions[key].userId === this.profile.id
    );
    this.profile.replies = Object.keys(this.discussions)
      .map((key) =>
        this.discussions[key].replies.filter(
          (reply) => reply.userId === this.profile.id
        )
      )
      .flat()
      .map((discussion) => discussion.id);
    this.profile.discussions = [...this.profile.given, ...this.profile.replies];
  }

  _assets(type, topic, lorem) {
    console.log(
      "_assets",
      this.sourcePath && this.__demoImages,
      this.sourcePath && this.__demoImages.length > 0
        ? this.__demoImages[this.__imgCtr % this.__demoImages.length]
        : false
    );
    if (!lorem) {
      return [];
    } else if (type === "body") {
      return lorem.randomParagraph(2, 6);
    } else {
      let x = lorem.randomNumber(1, 7),
        assets = [];
      for (let i = 0; i < x; i++) {
        if (type === "links") {
          assets.push(lorem.randomLink());
        } else {
          this.__imgCtr++;
          let img = lorem.randomImageData(
            lorem.randomAspect(200, 600, 200, 600),
            lorem.randomOption([false, false, false, false, true]),
            topic,
            this.__imgCtr
          );
          if (this.sourcePath && this.__demoImages.length > 0)
            img.src = this.__demoImages[
              this.__imgCtr % this.__demoImages.length
            ];
          assets.push(img);
        }
      }
      return assets;
    }
  }
  _project(project, lessonId, order, date, lorem) {
    if (!lorem) {
      return undefined;
    } else {
      return {
        id: project.id,
        order: order,
        lessonId: lessonId,
        project: project.project,
        body: lorem.randomParagraph(2, 6),
        assignments: project.assignments.map((a, i) =>
          this._assignment(
            a,
            lessonId,
            project.id,
            i,
            lorem.addDays(date, i),
            lorem
          )
        ),
      };
    }
  }
  _assignment(assignment, lessonId, projectId, order, date, lorem) {
    if (!lorem) {
      return undefined;
    } else {
      let criteria = lorem.randomNumber(3, 7),
        rubric = {
          key: [
            "Distinguished (4)",
            "Proficient (3)",
            "Apprentice (2)",
            "Novice (1)",
          ],
          values: [],
        };
      for (let i = 0; i < criteria; i++) {
        rubric.values.push([
          `${lorem.randomWord()} ${lorem.randomWord()}`,
          lorem.randomSentence(3, 6),
        ]);
      }
      this.assignments[assignment.id] = {
        id: assignment.id,
        order: order,
        lessonId: lessonId,
        projectId: projectId,
        assignment: assignment.assignment,
        showDate: Math.random > 0.8 ? lorem.addWeeks(date, -2) : undefined,
        hideDate: Math.random > 0.8 ? lorem.addWeeks(date, 2) : undefined,
        date: date,
        rubric: rubric,
        body: lorem.randomParagraph(2, 6),
      };
      return this.assignments[assignment.id];
    }
  }
  _feedback(submissionId, reviewerId, date, lorem) {
    if (!lorem) {
      return undefined;
    } else {
      let id = `feedback-${Object.keys(this.discussions).length + 1}`,
        repliers = lorem.draw([...this.students, ...this.instructors], 0, 2),
        user = this.users[reviewerId],
        submission = this.submissions[submissionId],
        creator = this.users[submission.userId],
        feedback = {
          id: id,
          userId: reviewerId,
          firstName: user && user.firstName ? user.firstName : "",
          lastName: user && user.lastName ? user.lastName : "",
          avatar: user && user.image ? user.image : undefined,
          submissionId: submissionId,
          portfolioId: submission.portfolioId,
          assignment: submission.assignment,
          creatorId: submission.userId,
          creatorFirstName:
            creator && creator.firstName ? creator.firstName : "",
          creatorLastName: creator && creator.lastName ? creator.lastName : "",
          creatorAvatar: creator && creator.image ? creator.image : undefined,
          date: date,
          body: lorem.randomParagraph(1, 4),
          read: Math.random() < 0.5,
          like: Math.random() < 0.5,
          replies: repliers.map((replier, i) => {
            let rid = `${id}-reply-${i + 1}`,
              reply;
            date = lorem.addMinutes(
              date,
              (i + 1) * lorem.randomNumber(1, 3000)
            );
            reply = {
              id: rid,
              feedbackId: id,
              userId: replier.id,
              firstName: replier && replier.firstName ? replier.firstName : "",
              lastName: replier && replier.lastName ? replier.lastName : "",
              avatar: replier && replier.image ? replier.image : undefined,
              reviewerId: reviewerId,
              reviewerFirstName: user && user.firstName ? user.firstName : "",
              reviewerLastName: user && user.lastName ? user.lastName : "",
              reviewerAvatar: user && user.image ? user.image : undefined,
              submissionId: submissionId,
              submissionId: submissionId,
              portfolioId: submission.portfolioId,
              date: date,
              body: lorem.randomParagraph(2, 6),
              read: Math.random() < 0.5,
              like: Math.random() < 0.5,
            };
            return reply;
          }),
        };
      this.discussions[id] = feedback;
      return id;
    }
  }
  _submission(assignmentId, creatorId, topic, type, date, lorem) {
    if (lorem) {
      this.__imgCtr++;
      console.log(
        "_submission",
        this.__imgCtr,
        this.sourcePath,
        this.__demoImages,
        this.__demoImages.length > 0,
        this.sourcePath && this.__demoImages.length > 0
          ? this.__demoImages[this.__imgCtr % this.__demoImages.length]
          : false
      );
      let id = `${assignmentId}-${creatorId}`,
        image = lorem.randomImageData(
          lorem.randomAspect(400, 1200, 400, 1200),
          lorem.randomOption([false, false, false, false, true]),
          topic,
          this.__imgCtr
        );
      if (this.sourcePath && this.__demoImages.length > 0)
        image.src = this.__demoImages[this.__imgCtr % this.__demoImages.length];

      let reviewers = lorem.draw(
          this.students.filter((s) => s.id !== creatorId),
          0,
          5
        ),
        instructors =
          Math.round() > 0.75 ? lorem.draw(this.instructors, 1, 1) : [],
        submitDate = lorem.addHours(date, lorem.randomNumber(-40, 48)),
        a =
          this.assignments && this.assignments[assignmentId]
            ? this.assignments[assignmentId]
            : undefined,
        projectId = a && a.projectId ? a.projectId : undefined,
        lessonId = a && a.lessonId ? a.lessonId : undefined,
        p =
          this.projects && this.projects[projectId]
            ? this.projects[projectId]
            : undefined,
        l =
          this.lessons && this.lessons[lessonId]
            ? this.lessons[lessonId]
            : undefined,
        creator = this.users[creatorId],
        submission = {
          id: id,
          assignment: a && a.assignment ? a.assignment : "",
          project: p && p.project ? p.project : "",
          lesson: l && l.lesson ? l.lesson : "",
          portfolio: projectId ? `${projectId}-${creatorId}` : id,
          portfolioId: projectId ? `${projectId}-${creatorId}` : id,
          assignmentId: assignmentId,
          projectId: projectId,
          lessonId: lessonId,
          userId: creatorId,
          firstName: creator && creator.firstName ? creator.firstName : "",
          lastName: creator && creator.lastName ? creator.lastName : "",
          avatar: creator && creator.image ? creator.image : "",
          date: submitDate,
          image: image.src,
          thumbnail: image.src,
          full: image.src,
          imageAlt: image.alt,
          imageLongdesc: image.longdesc,
        };
      if (Math.random() < 0.2) submission.feature = lorem.randomParagraph(2, 6);
      this.portfolios[submission.portfolioId] = this.portfolios[
        submission.portfolioId
      ] || {
        id: submission.portfolioId,
        projectId: projectId,
        project: p && p.project ? p.project : "",
        userId: creatorId,
        firstName: creator && creator.firstName ? creator.firstName : "",
        lastName: creator && creator.lastName ? creator.lastName : "",
        avatar: creator && creator.image ? creator.image : "",
        submissions: [],
      };
      submission[type] = this._assets(type, topic, lorem);
      this.activity.push({
        id: id,
        activity: "submission",
        date: submission.date,
      });
      this.submissions[id] = submission;
      this.submissions[id].feedback = lorem
        .shuffle([...reviewers, ...instructors])
        .map((reviewer, i) =>
          this._feedback(
            id,
            reviewer.id,
            lorem.addMinutes(submitDate, (i + 1) * 64),
            lorem
          )
        );
      this.portfolios[submission.portfolioId].submissions.push(submission);
    }
  }
}
customElements.define("elmsln-studio-loremdata", ElmslnStudioLoremdata);
export { ElmslnStudioLoremdata };
