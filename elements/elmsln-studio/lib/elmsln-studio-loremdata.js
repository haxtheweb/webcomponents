/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import { ElmslnStudioUtilities } from "./elmsln-studio-utilities.js";

/**
 * `elmsln-studio-loremdata`
 * Generates fake data for ELMS:LN Studio
 *
 * @customElement elmsln-studio-loremdata
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
  }static get properties() {
    return {
      activities: {
        type: Object
      },
      assignments: {
        type: Object
      },
      endDate: {
        type: Object
      },
      feedback: {
        type: Object
      },
      instructors: {
        type: Object
      },
      replies: {
        type: Object
      },
      paragraphs: {
        type: Array
      },
      projects: {
        type: Object
      },
      portfolios: {
        type: Object
      },
      sentences: {
        type: Array
      },
      startDate: {
        type: Object
      },
      students: {
        type: Object
      },
      submissions: {
        type: Object
      },
      target: {
        type: String
      },
      users: {
        type: Object
      },
      userId: {
        type: String
      },
      weeks: {
        type: Number
      },
      words: {
        type: Array
      }
    };
  }
  constructor() {
    super();
    this.projects = {
      "project-0": {
        id: "project-0",
        project: "Hypertext Narrative Project",
        assignments: [
          {assignment: "Discover: Word-Pairs"},
          {assignment: "Define: Synopsis"},
          {assignment: "Develop: Story and Plot Elements"},
          {assignment: "Develop: Characters"},
          {assignment: "Deliver: Hypertext Narrative Draft"},
          {assignment: "Deliver: Feedback"},
          {assignment: "Deliver: Iterate"},
          {assignment: "Deliver: Iterate critique"},
          {assignment: "Deliver: Iterate critique"},
          {assignment: "Deliver: Hypertext Narrative"}
        ]
      },
      "project-1": {
        id: "project-1",
        project: "Ritual Project",
        assignments: [
          {assignment: "Discover: Interview"},
          {assignment: "Discover: Journey Map"},
          {assignment: "Define: Themes & Insights"},
          {assignment: "Define: HMW"},
          {assignment: "Develop: Brainstorm"},
          {assignment: "Develop: Storyboard"},
          {assignment: "Develop: Prototype"},
          {assignment: "Develop: Test and Iterate"},
          {assignment: "Deliver: Final Prototype"}
        ]
      },
      "project-2": {
        id: "project-2",
        project: "Open Kit Project",
        assignments: [
          {assignment: "Discover: Toy Research"},
          {assignment: "Discover: Modular Research"},
          {assignment: "Discover: Resources"},
          {assignment: "Define: Product Pitch"},
          {assignment: "Develop: Prototyping"},
          {assignment: "Develop: Instructions"},
          {assignment: "Develop: Test"},
          {assignment: "Develop: Iterate"},
          {assignment: "Deliver: Open Toy"}
        ]
      }
    };
    this.users = {
      ixp23: {
        id: "ixp23",
        lastName: "Instructor",
        firstName: "Person",
        instructor: true,
        image: `//placekitten.com/300/400`
      },
      hxb5122: {
        id: "hxb5122",
        lastName: "Brown",
        firstName: "Havana"
      },
      tmn823: {
        id: "tmn823",
        lastName: "Nebelung",
        firstName: "Tabby"
      },
      kmk5124: {
        id: "kmk5124",
        lastName: "Korat",
        firstName: "Kitty",
        image: `//placekitten.com/g/400/300`
      },
      tjm5488: {
        id: "tjm5488",
        lastName: "Manx",
        firstName: "Tortie",
        image: `//placekitten.com/400/300`
      },
      fms9811: {
        id: "fms9811",
        lastName: "Sphinx",
        firstName: "Felix"
      },
      tjc5167: {
        id: "tjc5167",
        lastName: "Cat",
        firstName: "Tom",
        image: `//placekitten.com/g/400/400`
      },
      cac488: {
        id: "cac488",
        lastName: "Coe",
        firstName: "Callie"
      },
      srf325: {
        id: "srf325",
        lastName: "Fold",
        firstName: "Scott",
        image: `//placekitten.com/400/400`
      }
    };
    /* lorem ipsum paragraph list */
    this.paragraphs = [
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent varius est ac sapien viverra lacinia. Aenean tempor risus ut egestas facilisis. Sed eu eros finibus, gravida lorem et, luctus massa. Aliquam tincidunt convallis enim sed molestie. Etiam facilisis varius felis sed imperdiet. Nunc ut eros id ligula ornare mattis id bibendum nibh. Fusce sagittis libero non enim placerat aliquam et ac sapien. Ut ac est porta, pulvinar odio et, efficitur lorem. Curabitur vitae vulputate est. Morbi est tellus, dapibus id nisi quis, dapibus sagittis nisi. Ut bibendum finibus purus. Quisque rhoncus lacus leo, tincidunt varius odio posuere sit amet. Suspendisse sodales nisl nec tincidunt elementum.`,
      `Pellentesque nec arcu in risus sodales feugiat eget et nisl. Maecenas fringilla risus at augue suscipit, id mollis sapien sodales. Duis auctor at dolor at pharetra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam sem dolor, scelerisque quis convallis at, fringilla nec purus. Aenean eget dapibus tellus. Sed pretium dictum ipsum, ut posuere tellus bibendum eget. Donec eget tempor lorem. Aenean justo velit, laoreet eget rhoncus eu, finibus ac justo. Donec convallis quis elit non dapibus. Donec lacinia, arcu eget ornare bibendum, ante lectus pretium dolor, sed aliquet nulla massa ut sem. Nullam luctus arcu et augue posuere molestie. Phasellus eget elit nec mauris imperdiet consectetur ac vel nibh. Ut euismod ex sagittis ipsum dapibus, eget sollicitudin nunc venenatis. Praesent augue justo, porta a hendrerit vel, fringilla vitae quam.`,
      `Nunc finibus erat a urna tincidunt, nec mattis neque tempus. Mauris quis augue quis massa tincidunt luctus. Nulla bibendum posuere neque vitae cursus. Nulla facilisi. Mauris sed est at eros dignissim laoreet. Nulla metus nibh, iaculis sit amet erat ac, vulputate bibendum orci. Morbi at dolor eget massa eleifend dictum. Sed sit amet elit sed massa consequat interdum. Nullam malesuada, ante non hendrerit accumsan, eros sapien tristique lorem, eu maximus nisl arcu eu felis. Donec condimentum id dui sit amet eleifend. Aliquam id lectus vel sapien consequat rhoncus auctor ut dui. Pellentesque efficitur finibus odio, eu imperdiet odio ultricies eu. Aenean nunc est, consectetur sed ultrices id, bibendum lobortis lorem. Phasellus et elementum magna. Pellentesque sit amet est quam.`,
      `Donec euismod suscipit est vel porta. Sed tincidunt aliquam leo, eu condimentum nulla. Vivamus leo nibh, varius eu orci id, mollis luctus odio. Nullam ultrices in sem eu laoreet. Nulla ut massa posuere, pharetra neque eget, euismod lorem. Cras facilisis nisl ut lectus suscipit cursus. Maecenas pulvinar est quam, in suscipit nisi venenatis vel. Vivamus et porta magna. Nunc aliquet sit amet est nec imperdiet. Phasellus eu fermentum dolor.`,
      `Nullam eget lectus lacus. In egestas, orci non efficitur condimentum, nisl leo tristique felis, vel mattis erat arcu eget sem. Cras cursus justo non ligula gravida laoreet. Nullam enim ligula, malesuada eget nunc sed, hendrerit iaculis enim. Ut ornare sit amet nunc quis sollicitudin. In vitae lectus iaculis lectus varius posuere. Nullam malesuada tempus commodo. Maecenas a malesuada nibh. Donec commodo commodo diam porta vulputate.`,
      `Donec in arcu eu risus eleifend viverra eu non lacus. Pellentesque a malesuada ipsum. Aliquam semper, magna id aliquet pretium, velit lacus volutpat urna, ac ultricies ante velit consequat purus. Nunc tempor, quam non tincidunt tincidunt, lectus quam dignissim diam, ut aliquam risus justo id urna. Sed metus enim, laoreet commodo mauris facilisis, aliquet cursus nulla. Nulla mi ligula, cursus nec nunc ac, vehicula ultrices orci. Nunc ac sem mauris. Morbi luctus eget augue vitae facilisis. Donec sit amet est tincidunt, blandit ipsum ac, tincidunt ante. Mauris volutpat eros sed tortor commodo pellentesque.`,
      `Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nam ac ex auctor nunc gravida luctus. Pellentesque lobortis nisl rhoncus maximus venenatis. Phasellus finibus tellus leo. Quisque rhoncus, nibh semper laoreet tempus, purus justo lacinia urna, et suscipit urna leo eget erat. Pellentesque eu laoreet felis. Proin sit amet tincidunt urna. Quisque et massa sit amet lorem interdum aliquet.`,
      `Maecenas egestas accumsan libero. Donec iaculis eget enim et tincidunt. Mauris at vulputate dui. Phasellus commodo, lectus et molestie tincidunt, justo justo maximus tortor, sed dictum lectus leo a augue. Nulla sollicitudin quam eget ipsum imperdiet, non pellentesque massa lobortis. Maecenas varius tincidunt leo, eu lobortis tortor congue in. Vestibulum at eros a justo sagittis placerat vitae pretium odio. Suspendisse porttitor aliquet pellentesque. Interdum et malesuada fames ac ante ipsum primis in faucibus. Quisque pretium orci quis varius facilisis.`,
      `Nunc ullamcorper nisl mi, nec maximus nisi euismod ac. Etiam elementum sit amet turpis a ultrices. Nam semper sem et venenatis congue. Cras erat massa, pharetra eget luctus sed, tristique non elit. Nam vitae feugiat odio. Fusce ut egestas metus. Curabitur porta felis sit amet eros eleifend sollicitudin. Duis pharetra feugiat efficitur. Aliquam diam ipsum, faucibus sit amet elit et, dapibus euismod nunc. Donec in est bibendum, tristique dui ut, mattis nunc. Donec a lacinia mauris, vel molestie arcu. Sed dolor risus, dignissim sit amet ipsum nec, feugiat aliquet dolor. Nulla sit amet nulla ut purus luctus tempor. Curabitur euismod massa a elit hendrerit, aliquam imperdiet eros malesuada. Donec porttitor scelerisque metus, non eleifend augue volutpat sed. Integer non nisl a neque tristique iaculis et ac sapien.`,
      `Maecenas commodo vel est vitae molestie. Vestibulum eget nisl lacus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam justo turpis, consequat quis sem placerat, finibus pretium orci. Aenean aliquam a diam a scelerisque. Fusce a bibendum sapien, quis consectetur velit. Etiam vitae felis ante. Ut nulla erat, aliquam sit amet purus vitae, malesuada maximus libero. Aliquam odio sem, auctor a eleifend in, hendrerit nec nunc.`,
      `Suspendisse venenatis nulla vitae dui ullamcorper ullamcorper. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec lobortis condimentum leo. Sed ornare laoreet feugiat. Pellentesque eget malesuada ligula. Ut egestas ligula ante. Vestibulum tincidunt ligula velit, at faucibus felis fringilla ut.`,
      `Integer bibendum fermentum tempus. Sed quis porttitor mauris. Proin bibendum tincidunt velit, a commodo leo feugiat ac. Sed pretium metus quis est feugiat sagittis. Suspendisse urna diam, semper et ante eu, vestibulum interdum purus. Etiam iaculis cursus metus. Vestibulum non est orci. Curabitur maximus, ex in tristique posuere, erat lacus luctus arcu, et finibus leo quam id ante. Donec non mauris metus. Praesent venenatis in nunc ut maximus.`,
      `Praesent pulvinar consectetur scelerisque. Integer sodales pharetra sem in dignissim. Cras sit amet massa at ex suscipit aliquet et in libero. Etiam magna ipsum, mollis ut tortor non, fringilla dictum lacus. Morbi dictum tempor libero, vel ornare lacus sagittis vitae. Sed molestie, nibh at vehicula gravida, turpis quam tristique quam, eu commodo orci justo rhoncus dui. In sit amet tincidunt orci, ut blandit sapien.`,
      `Quisque pellentesque augue ac dignissim pretium. Curabitur ut vestibulum nisi. Aenean accumsan purus sed metus consectetur semper. Integer et elit sit amet nulla mollis luctus. Morbi ac tortor non leo hendrerit porta sed et magna. Cras euismod cursus lorem ac dictum. Nulla maximus libero turpis, quis scelerisque velit maximus ac. Vestibulum sit amet egestas odio. Nullam feugiat finibus augue vel ultricies. Nam urna elit, dignissim eget quam ut, eleifend placerat arcu. Suspendisse nec diam vestibulum, feugiat orci et, convallis nunc. Sed dapibus commodo nibh, ut tempor diam euismod in. Phasellus eget consectetur nibh. Sed ac consequat orci, vitae congue felis. Ut in purus diam. Nam rutrum, magna rutrum blandit luctus, turpis erat fermentum ipsum, sed pretium tellus nunc ac risus.`,
      `Quisque tincidunt imperdiet purus in congue. Sed id risus ipsum. Integer tincidunt lacinia neque sed vulputate. Donec eget consectetur nibh. In nec nulla quis augue molestie posuere a non sapien. Fusce ultricies efficitur urna sed porta. Maecenas vitae fringilla ipsum. Cras venenatis, mauris non dictum interdum, quam risus lacinia enim, sed scelerisque diam nunc in risus. Integer tempor vitae leo a cursus. Vivamus suscipit nisi eu risus accumsan, vel rhoncus nulla mattis. Integer vulputate felis vel nulla aliquet, ac placerat nunc varius. Nulla sodales accumsan nibh, id sollicitudin diam placerat at.`
    ];
    this.refreshData();
  }
  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if(["target","users","projects","paragraphs"].includes(propName)) {
        this.refreshData();
      }
    });
  }
  get projectsList() {
    return this.toArray(this.projects);
  }
  get assignmentsList() {
    return this.toArray(this.assignments);
  }
  get portfoliosList() {
    return this.toArray(this.portfolios);
  }
  get submissionsList() {
    return this.toArray(this.submissions);
  }
  get feedbackList() {
    return this.toArray(this.feedback);
  }
  get repliesList() {
    return this.toArray(this.replies);
  }
  /**
   * draws x-y items from shuffled array
   * @param {array} arr array
   * @param {number} min minimum number of items
   * @param {number} max max number of items
   * @returns {arr} shuffled array of x items
   */
  draw(arr = [], min = 0, max = min) {
    return this.shuffle(arr).slice(
      0,
      min + Math.floor(Math.random() * (max - min))
    );
  }
  /**
   * make submission assets based on topic and type
   * @param {string} topic optional topic for image assets
   * @returns {array} array of assets
   */
  makeAssets(topic = "any", type) {
    if (type === "body") {
      return `${this.draw(this.sentences, 4, 10).join(". ")}.`;
    } else {
      let times = 1 + Math.floor(Math.random() * 7),
        assets = [];
      for (let i = 0; i < times; i++) {
        if (type === "links") {
          assets.push(this.randomLink());
        } else {
          assets.push(this.randomImage(topic));
        }
      }
      return assets;
    }
  }
  /**
   * make project assignment
   * @param {string} projectId project identifier
   * @param {string} assignmentName assignment name
   * @returns {object} assignment data
   */
  makeAssignment(projectId, a) {
    let topic = this.randomItem(["any", "animals", "nature", "people", "tech"]),
      type = this.randomItem(["links", "body", "sources"]),
      completed = Object.keys(this.assignments).length,
      id = `assignment-${completed}`,
      created = this.addWeeks(this.startDate + completed),
      studentsList =
        projectId === "project-2"
          ? []
          : projectId === "project-1"
          ? this.draw(Object.keys(this.students), 4, 6)
          : this.shuffle(Object.keys(this.students));
    this.assignments[id] = {
      id: id,
      projectId: projectId,
      project: this.projects[projectId].project,
      assignment: a.assignment,
      date: created,
      topic: topic,
      type: type,
      submissions: []
    };
    this.assignments[id].submissions = studentsList.map((studentId, i) => {
      let sid = this.makeSubmission(
        id,
        studentId,
        this.nextDate(created, i, studentsList.length, 7)
      );
      this.portfolios[`portfolio-${studentId}-${projectId}`].submissions.push(
        sid
      );
      return sid;
    });
    return this.assignments[id];
  }
  /**
   * make feedback or reply as comment
   * @param {string} id comment identifier
   * @param {string} val value of foreign key
   * @param {string} key foreign key
   * @param {string} comment author identifier
   * @param {object} created date comment was created
   * @returns {object} comment data
   */
  makeComment(id, submissionId, userId, created) {
    let assignmentId = this.submissions[submissionId].assignmentId, 
      comment = {
        id: id,
        userId: userId,
        submissionId: submissionId,
        submissionImage: this.submissions[submissionId].image,
        creator: this.submissions[submissionId].userId,
        creatorFirstName: this.submissions[submissionId].firstName,
        creatorLastName: this.submissions[submissionId].lastName,
        creatorAvatar: this.submissions[submissionId].avatar,
        assignmentId: assignmentId,
        assignment: this.assignments[assignmentId].assignment,
        project: this.assignments[assignmentId].project,
        projectId: this.assignments[assignmentId].projectId,
        firstName: this.users[userId].firstName,
        lastName: this.users[userId].lastName,
        avatar: this.users[userId].image,
        date: created,
        body: `${this.draw(this.sentences, 1, 4).join(" ")}`,
        read: Math.random() < 0.5,
        like: Math.random() < 0.5,
      };
    return comment;
  }
  /**
   * make feedback with threaded replies
   * @param {string} submissionId submission identifier
   * @param {string} reviewerId feedback author identifier
   * @param {object} created date comment was created
   * @returns {object} feedback data
   */
  makeFeedback(submissionId, reviewerId, created) {
    let id = `feedback-${Object.keys(this.feedback).length}`,
      replies = Math.floor(Math.random() * 4);
    this.feedback[id] = this.makeComment(
      id,
      submissionId,
      reviewerId,
      created
    );

    this.feedback[id].replies = [];
    for (let i = 0; i < replies; i++) {
      let reply = this.makeReply(
        id,
        this.randomItem(Object.keys(this.students)),
        this.nextDate(created, i, replies, 3)
      );
      this.replies[reply].feedbackId = id;
      this.replies[reply].feedbackFirstName = this.feedback[id].firstName;
      this.replies[reply].feedbackLastName = this.feedback[id].firstName;
      this.replies[reply].feedbackAvatar = this.feedback[id].avatar;
      this.feedback[id].replies.push(reply);
    }
    return id;
  }
  /**
   * makes user profile data
   * @returns {object}
   */
  makeProfile(userId) {
    let profile = this.users[userId];
    profile.assignments = this.assignmentsList;
    profile.submissions = this.submissionsList.filter(i => i.userId === userId);
    profile.feedbackFor = profile.submissions.map(
      submission => submission.feedback.map(i=>this.feedback[i])
    ).flat();
    profile.repliesBy = this.repliesList.filter(i => i.userId === userId);
    profile.feedbackBy = this.feedbackList.filter(i => i.userId === userId);
    profile.repliesFor = profile.feedbackBy.map(
      feedback=>feedback.replies.map(i =>this.replies[i])).flat();
    let assignments = profile.submissions.map(i=>this.assignments[i.assignmentId].id);
    profile.assignmentsCompleted = [...new Set(assignments.flat())];
    profile.workDue = this.assignmentsList.filter(
        i => !(profile.assignmentsCompleted || []).includes(i.id)
      )
    return profile;
  }
  /**
   * make a reply to feedback
   * @param {string} feedbackId feedback identifier
   * @param {string} commenterId reply author identifier
   * @param {object} created date comment was created
   * @returns {object} reply data
   */
  makeReply(feedbackId, commenterId, created) {
    let id = `reply-${Object.keys(this.replies).length}`;
    this.replies[id] = this.makeComment(
      id,
      this.feedback[feedbackId].submissionId,
      commenterId,
      created,
      feedbackId
    );
    return id;
  }
  /**
   * make assignment submission by student
   * @param {string} assignmentId assignment identifier
   * @param {string} studentId author identifier
   * @param {object} created date comment was created
   * @returns {object} submission data
   */
  makeSubmission(assignmentId, studentId, created) {
    let id = `submission-${Object.keys(this.submissions).length}`,
      reviewers = [
        this.randomItem(Object.keys(this.instructors)),
        ...this.draw(Object.keys(this.students), 1, 3)
      ],
      assignment = this.assignments[assignmentId];
    this.submissions[id] = {
      id: id,
      date: created,
      assignmentId: assignmentId,
      projectId: assignment.projectId,
      project: assignment.project,
      assignment: assignment.assignment,
      userId: studentId,
      firstName: this.users[studentId].firstName,
      lastName: this.users[studentId].lastName,
      avatar: this.users[studentId].image,
      image: this.randomImage(assignment.topic),
      feature:
        Math.random() < 0.2
          ? this.draw(this.sentences, 2, 10).join(" ")
          : undefined,
      feedback: []
    };

    this.submissions[id][assignment.type] = this.makeAssets(
      assignment.topic,
      assignment.type
    );
    this.submissions[id].feedback = reviewers.map((userId, i) => {
      return this.makeFeedback(
        id,
        userId,
        this.nextDate(created, i, reviewers.length, 3)
      );
    });
    return id;
  }
  /**
   * distributes items over a period of x days
   * @param {date} start starting date
   * @param {number} index index of item
   * @param {number} qty number of items
   * @param {number} days number of days to distributes items
   * @param {number} offset optional offset from start date
   * @returns {date}
   */
  nextDate(start, index = 1, qty = 1, days = 1, offset = 0) {
    return this.addDays(start, (days * index) / qty + offset);
  }
  /**
   * genterates random image data
   * @param {string} topic optional image topic
   * @returns {object} image's {alt, src, sizing, gravity}
   */
  randomImage(topic = "any") {
    let filter = this.randomItem([
        "",
        "",
        "",
        "",
        "/greyscale",
        "/greyscale",
        "/sepia"
      ]),
      aspect = `${200 + Math.floor(Math.random() * 600)}/${200 +
        Math.floor(Math.random() * 600)}`,
      gravity = this.randomItem([
        "center",
        "center",
        "center",
        "center",
        "center",
        "center",
        "center",
        "center",
        "top",
        "top-left",
        "top-right",
        "left",
        "bottom",
        "bottom-left",
        "bottom-right",
        "right"
      ]);
    return {
      alt: `Random ${topic} image from http://plageimg.com`,
      src: `http://placeimg.com/${aspect}/${topic}${filter}`,
      sizing: "cover",
      gravity: gravity
    };
  }
  /**
   * draws a random item from array of items
   * @param {array} array of items
   * @returns {*}
   */
  randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }
  /**
   * generates random link data
   * @returns {object} link as { url, text, type }
   * */
  randomLink() {
    let w = this.draw(this.words, 1, 4),
      file = this.randomItem(["url", "pdf"]),
      base = this.randomItem(this.words),
      extension = file !== "url" ? `.${file}` : "",
      url = `http://${base}.com/${w.join("/")}${extension}`,
      text = w.length > 0 ? w.join(" ") : base;
    return {
      url: url.toLowerCase(),
      text: text,
      type: file
    };
  }
  /**
   * updates the data
   */
  refreshData() {
    this.resetData();
    /* lorem ipsum sentence list */
    this.sentences = this.paragraphs
      .map(p => p.split(/[\.\?\!]+\s+/))
      .flat()
      .map(
        s => `${s}${this.randomItem(".", ".", ".", ".", "?", "?", "?", "!")}`
      );
    /* lorem ipsum word list */
    this.words = [
      ...new Set(
        this.paragraphs
          .map(p => p.split(/\W+/))
          .flat()
          .map(w => w.toLowerCase())
      )
    ];
    /* total weeks to complete all assgnments */
    this.weeks = Object.keys(this.projects || {})
      .map(i => this.projects[i].assignments)
      .flat().length;
    /* set start and end so we are halfway though course */
    this.endDate = this.addWeeks(new Date(), Math.floor(this.weeks / 2));
    this.startDate = this.addWeeks(this.endDate, (this.weeks + 1) * -1);

    /* filter users to get students  */
    this.students = JSON.parse(JSON.stringify(this.users));
    Object.keys(this.students || {}).forEach(s => {
      if (this.students[s].instructor) delete this.students[s];
    });

    /* filter users to get instructors  */
    this.instructors = JSON.parse(JSON.stringify(this.users));
    Object.keys(this.instructors || {}).forEach(s => {
      if (!this.instructors[s].instructor) delete this.instructors[s];
    });

    /* populate fake data starting with projects */
    Object.keys(this.projects || {}).forEach(p => {
      Object.keys(this.students || {}).forEach(s => {
        this.portfolios[`portfolio-${s}-${p}`] = {
          id: `portfolio-${s}-${p}`,
          userId: s,
          firstName: this.users[s].firstName,
          lastName: this.users[s].lastName,
          avatar: this.users[s].image,
          projectId: p,
          submissions: []
        };
      });
      this.projects[p].assignments = this.projects[p].assignments.map(a =>
        this.makeAssignment(p, a)
      );
    });

    this.activities = this.sortDates([
      ...this.toArray(this.submissions, { activity: "submission" }),
      ...this.toArray(this.feedback, { activity: "feedback" }),
      ...this.toArray(this.replies, { activity: "replies" })
    ]);

    /** make a profile */
    this.userId = this.randomItem(Object.keys(this.students || {}));
    this.profile = this.makeProfile(this.userId);
    this.setTarget();

    /**
     * Fires when data is ready
     *
     * @event data-loaded
     */
    this.dispatchEvent(
      new CustomEvent("data-loaded", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }
  /**
   * resets the objects
   * 
   */
  resetData(){
    this.activities = [];
    this.assignments = {};
    this.feedback = {};
    this.instructors = {};
    this.portfolios = {};
    this.replies = {};
    this.sentences = [];
    this.students = {};
    this.submissions = {};
    this.words = [];
  }
  /**
   * sends data to a specified target
   */
  setTarget() {
    let target = document.getElementById(this.target || "elmsln-studio");
    if (target) {
      target.activityData = this.activities;
      target.submissionsData = this.submissions;
      target.profileData = this.profile;
    }
  }
  /**
   * gets shuffled array
   * @param {array} arr array
   * @returns {arr} shuffled array
   */
  shuffle(arr = []) {
    return arr.sort((a, b) => Math.random() - Math.random());
  }
}
customElements.define("elmsln-studio-loremdata", ElmslnStudioLoremdata);
export { ElmslnStudioLoremdata };
