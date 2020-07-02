/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import { AccentCard } from "@lrnwebcomponents/accent-card/accent-card.js";
import "@lrnwebcomponents/nav-card/nav-card.js";
import "@lrnwebcomponents/lrndesign-avatar/lrndesign-avatar.js";

const ElmslnStudioUtilities = function(SuperClass) {
  return class extends SuperClass {
    static get styles() {
      return [
        css`
          :host {
            font-family: var(
              --elmsln-studio-secondary-FontFamily,
              "Helvetica Neue",
              sans-serif
            );
            font-family: var(--elmsln-studio-FontFamily, "Roboto", sans-serif);
            font-size: var(--elmsln-studio-FontSize, 16px);
          }
          *[hidden] {
            display: none !important;
          }
          .sr-only {
            position: absolute;
            left: -9999999px;
            width: 0;
            overflow: hidden;
          }
          .filters {
            padding-bottom: calc(0.5 * var(--elmsln-studio-margin, 20px));
            margin-bottom: calc(0.5 * var(--elmsln-studio-margin, 20px));
            border-bottom: 1px solid #ddd;
            height: calc(2 * var(--elmsln-studio-FontSize, 16px));
            line-height: calc(1.5 * var(--elmsln-studio-FontSize, 16px));
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
          }
          simple-fields-field {
            color: #95989a;
            --simple-fields-border-color: transparent;
            --simple-fields-font-size: var(--elmsln-studio-FontSize, 16px);
            --simple-fields-detail-font-size: var(
              --elmsln-studio-FontSize,
              16px
            );
            --simple-fields-line-height: calc(
              1.5 * var(--elmsln-studio-FontSize, 16px)
            );
            --simple-fields-detail-line-height: calc(
              1.5 * var(--elmsln-studio-FontSize, 16px)
            );
            --simple-fields-font-family: var(
              --elmsln-studio-FontFamily,
              "Roboto",
              sans-serif
            );
            --simple-fields-detail-font-family: var(
              --elmsln-studio-FontFamily,
              "Roboto",
              sans-serif
            );
          }
          accent-card [slot="image-corner"] {
            display: inline-flex;
            right: 5px;
            bottom: 10px;
            position: absolute;
            border-radius: 3px;
            background-color: rgba(0, 0, 0, 0.25);
          }
          accent-card [slot="image-corner"]:focus-within,
          accent-card [slot="image-corner"]:hover {
            background-color: rgba(0, 0, 0, 0.5);
          }
          accent-card button {
            padding: calc(0.5 * var(--elmsln-studio-margin, 20px));
            background-color: transparent;
            border: none;
            padding: 0;
            flex: 1 1 auto;
          }
          accent-card button:last-child {
            text-align: right;
          }
          .load-more {
            text-align: center;
            display: block;
            padding: 10px;
            margin: 0;
            border-radius: 3px;
            border: none;
            background-color: var(--simple-colors-default-theme-grey-2, #eee);
            color: var(--simple-colors-default-theme-grey11, #222);
            width: 100%;
          }
          .load-more:focus,
          .load-more:hover {
            background-color: var(--simple-colors-default-theme-grey-3, #ddd);
            color: var(--simple-colors-default-theme-grey12, #000);
          }
          @media screen and (min-width: 900px) {
            :host {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
            }
            #primary {
              flex: 0 0 calc(66.66666667% - var(--elmsln-studio-margin, 20px));
            }
            #secondary {
              flex: 0 0 calc(33.33333333% - var(--elmsln-studio-margin, 20px));
            }
          }
        `
      ];
    }

    // properties available to the custom element for data binding
    static get properties() {
      return {
      };
    }
    // life cycle
    constructor() {
      super();
      if (!window.ElmslnStudioFakeData)
        window.ElmslnStudioFakeData = this._makeFakeData();
      this.initData(window.ElmslnStudioFakeData);
    }
    initData(data){
    }
    
    /**
     * sorts array by most recent
     * @param {array} arr array
     * @returns {arr} sorted array
     */
    _sortRecent(arr) {
      return arr.sort((a, b) => b.date - a.date);
    }
    /**
     * gets shuffled array
     * @param {array} arr array
     * @returns {arr} shuffled array
     */
    _shuffle(arr = []) {
      return arr.sort((a, b) => {
        let c = Math.random(),
          d = Math.random();
        return c - d;
      });
    }
    /**
     * draws x-y items from shuffled array
     * @param {array} arr array
     * @param {number} min minimum number of items
     * @param {number} max max number of items
     * @returns {arr} shuffled array of x items
     */
    _draw(arr = [], min = 0, max = min) {
      let rand = Math.floor(Math.random() * (max - min));
      return this._shuffle(arr).slice(0, min + rand);
    }
    /**
     * gets date x days from start date
     * @param {date} start starting date
     * @param {number} days number of weeks
     * @returns {date}
     */
    _addDays(start = new Date(), amt = 0) {
      return new Date(Date.parse(start) + amt * 86400000);
    }
    /**
     * gets date x weeks from start date
     * @param {date} start starting date
     * @param {number} weeks number of weeks
     * @returns {date}
     */
    _addWeeks(start = new Date(), amt = 0) {
      return new Date(Date.parse(start) + amt * 604800000);
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
    _nextDate(start, index = 1, qty = 1, days = 1, offset = 0) {
      return this._addDays(start, (days * index) / qty + offset);
    }
    /**
     * convert object to array
     * @param {object} obj object to convert
     * @param {props} additional properties to set
     * @returns {array}
     */
    _toArray(obj, props) {
      return Object.keys(obj || {}).map(i => {
        let item = obj[i];
        item.id = i;
        Object.keys(props || {}).forEach(j => (item[j] = props[j]));
        return item;
      });
    }
    /**
     * converts and sorts arrat
     * @param {object} obj object to convert
     * @returns {array}
     */
    _recentArray(arr) {
      return this._sortRecent(this._toArray(arr));
    }
    /**
     * draws a random item from array of items
     * @param {array} array of items
     * @returns {*}
     */
    _randomItem(items) {
      return items[Math.floor(Math.random() * items.length)];
    }

    fullDate(d) {
      return d.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    medDate(d) {
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    shortDate(d) {
      return d.toLocaleDateString(undefined, { month: "long", day: "numeric" });
    }

    activities(id) {
      return this._getById("activities", id);
    }
    assignment(id) {
      return this._getById("assignments", id);
    }
    feedback(id) {
      return this._getById("feedback", id);
    }
    project(id) {
      return this._getById("projects", id);
    }
    reply(id) {
      return this._getById("replies", id);
    }
    submission(id) {
      return this._getById("submissions", id);
    }
    user(id) {
      return this._getById("users", id);
    }
    _getById(type, id) {
      return type &&
        id &&
        window.ElmslnStudioFakeData[type] &&
        window.ElmslnStudioFakeData[type][id]
        ? window.ElmslnStudioFakeData[type][id]
        : undefined;
    }
    recent(type, count) {
      let arr =
        window.ElmslnStudioFakeData && window.ElmslnStudioFakeData[type]
          ? this._recentArray(window.ElmslnStudioFakeData[type])
          : [];
      return count ? arr.slice(0, count) : arr;
    }
    /**
     * generates fake data
     * @returns {obj}
     */
    _makeFakeData() {
      /* date functions */
      let /* all projects */
        projects = {
          "project-0": {
            project: "Hypertext Narrative Project",
            assignments: [
              "Discover: Word-Pairs",
              "Define: Synopsis",
              "Develop: Story and Plot Elements",
              "Develop: Characters",
              "Deliver: Hypertext Narrative Draft",
              "Deliver: Feedback",
              "Deliver: Iterate",
              "Deliver: Iterate critique",
              "Deliver: Iterate critique",
              "Deliver: Hypertext Narrative"
            ]
          },
          "project-1": {
            project: "Ritual Project",
            assignments: [
              "Discover: Interview",
              "Discover: Journey Map",
              "Define: Themes & Insights",
              "Define: HMW",
              "Develop: Brainstorm",
              "Develop: Storyboard",
              "Develop: Prototype",
              "Develop: Test and Iterate",
              "Deliver: Final Prototype"
            ]
          },
          "project-2": {
            project: "Open Kit Project",
            assignments: [
              "Discover: Toy Research",
              "Discover: Modular Research",
              "Discover: Resources",
              "Define: Product Pitch",
              "Develop: Prototyping",
              "Develop: Instructions",
              "Develop: Test",
              "Develop: Iterate",
              "Deliver: Open Toy"
            ]
          }
        },
        /* all users including instructor */
        users = {
          ixp23: {
            lastName: "Instructor",
            firstName: "Person",
            instructor: true,
            image: `//placekitten.com/300/400`
          },
          hxb5122: {
            lastName: "Brown",
            firstName: "Havana"
          },
          tmn823: {
            lastName: "Nebelung",
            firstName: "Tabby"
          },
          kmk5124: {
            lastName: "Korat",
            firstName: "Kitty",
            image: `//placekitten.com/g/400/300`
          },
          tjm5488: {
            lastName: "Manx",
            firstName: "Tortie",
            image: `//placekitten.com/400/300`
          },
          fms9811: {
            lastName: "Sphinx",
            firstName: "Felix"
          },
          tjc5167: {
            lastName: "Cat",
            firstName: "Tom",
            image: `//placekitten.com/g/400/400`
          },
          cac488: {
            lastName: "Coe",
            firstName: "Callie"
          },
          srf325: {
            lastName: "Fold",
            firstName: "Scott",
            image: `//placekitten.com/400/400`
          }
        },
        /* total weeks to complete all assgnments */
        weeks = Object.keys(projects || {})
          .map(p => projects[p].assignments)
          .flat().length,
        /* end date = now */
        endDate = this._addWeeks(new Date(), Math.floor(weeks / 2)),
        /* startDate */
        startDate = this._addWeeks(endDate, (weeks + 1) * -1),
        /* fake data object */
        data = {
          startDate: startDate,
          endDate: endDate,
          weeks: weeks,
          projects: projects,
          users: users,
          assignments: {},
          submissions: {},
          feedback: {},
          replies: {}
        },
        /* lorem ipsum paragraph list */
        paragraphs = [
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
        ],
        /* lorem ipsum sentence list */
        sentences = paragraphs
          .map(p => p.split(/[\.\?\!]+\s+/))
          .flat()
          .map(
            s =>
              `${s}${this._randomItem(".", ".", ".", ".", "?", "?", "?", "!")}`
          ),
        /* lorem ipsum word list */
        words = [
          ...new Set(
            paragraphs
              .map(p => p.split(/\W+/))
              .flat()
              .map(w => w.toLowerCase())
          )
        ],
        /* advances to next date */
        /* generates random link data */
        randomLink = () => {
          let w = this._draw(words, 1, 4),
            file = this._randomItem(["url", "pdf"]),
            base = this._randomItem(words),
            extension = file !== "url" ? `.${file}` : "",
            url = `http://${base}.com/${w.join("/")}${extension}`,
            text = w.length > 0 ? w.join(" ") : base;
          return {
            url: url.toLowerCase(),
            text: text,
            type: file
          };
        },
        /* genterates random image data */
        randomImage = (topic = "any") => {
          let filter = this._randomItem([
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
            gravity = this._randomItem([
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
        },
        /* make submission assets based on topic and type */
        makeAssets = (topic, type) => {
          if (type === "body") {
            return `${this._draw(sentences, 4, 10).join(". ")}.`;
          } else {
            let times = 1 + Math.floor(Math.random() * 7),
              assets = [];
            for (let i = 0; i < times; i++) {
              if (type === "links") {
                assets.push(randomLink());
              } else {
                assets.push(randomImage(topic));
              }
            }
            return assets;
          }
        },
        /* make feedback or reply as comment */
        makeComment = (id, key, userId, start) => {
          let comment = {
            userId: userId,
            date: start,
            body: `${this._draw(sentences, 1, 4).join(" ")}`,
            read: Math.random() < 0.5,
            like: Math.random() < 0.5
          };
          comment[key] = id;
          return comment;
        },
        /* make feedback thread based on reviewer */
        makeReply = (feedbackId, commenterId, start) => {
          let id = `reply-${Object.keys(data.replies).length}`;
          data.replies[id] = makeComment(
            feedbackId,
            "feedbackId",
            commenterId,
            start
          );
          return id;
        },
        /* make feedback thread based on reviewer */
        makeFeedback = (submissionId, reviewerId, start) => {
          let id = `feedback-${Object.keys(data.feedback).length}`,
            replies = Math.floor(Math.random() * 4);
          data.feedback[id] = makeComment(
            submissionId,
            "submissionId",
            reviewerId,
            start
          );
          data.feedback[id].replies = [];
          for (let i = 0; i < replies; i++) {
            data.feedback[id].replies.push(
              makeReply(
                id,
                this._randomItem(Object.keys(data.students)),
                this._nextDate(start, i, replies, 3)
              )
            );
          }
          return id;
        },
        /* make assignment submission by student */
        makeSubmission = (assignmentId, studentId, start) => {
          let id = `submission-${Object.keys(data.submissions).length}`,
            reviewers = [
              this._randomItem(Object.keys(data.instructors)),
              ...this._draw(Object.keys(data.students), 1, 3)
            ],
            assignment = data.assignments[assignmentId];
          data.submissions[id] = {
            date: start,
            assignmentId: assignmentId,
            userId: studentId,
            image: randomImage(assignment.topic),
            feature:
              Math.random() < 0.2
                ? this._draw(sentences, 2, 10).join(" ")
                : undefined,
            feedback: []
          };

          data.submissions[id][assignment.type] = makeAssets(
            assignment.topic,
            assignment.type
          );
          data.submissions[id].feedback = reviewers.map((userId, i) => {
              return makeFeedback(
                id,
                userId,
                this._nextDate(start, i, reviewers.length, 3)
              );
            });
          return id;
        },
        /* make project assignment */
        makeAssignment = (projectId, assignmentName) => {
          let topic = this._randomItem([
              "any",
              "animals",
              "nature",
              "people",
              "tech"
            ]),
            type = this._randomItem(["links", "body", "sources"]),
            completed = Object.keys(data.assignments).length,
            id = `assignment-${completed}`,
            start = this._addWeeks(startDate + completed),
            studentsList = this._shuffle(Object.keys(data.students));
          data.assignments[id] = {
            projectId: projectId,
            assignment: assignmentName,
            date: start,
            topic: topic,
            type: type,
            submissions: []
          };
          if (this._addDays(start, 7) < new Date())
            data.assignments[id].submissions = studentsList.map(
              (studentId, i) => {
                return makeSubmission(
                  id,
                  studentId,
                  this._nextDate(start, i, studentsList.length, 7)
                );
              }
            );
          return id;
        };

      /* filter users to get students  */
      data.students = JSON.parse(JSON.stringify(users));
      Object.keys(data.students || {}).forEach(s => {
        if (data.students[s].instructor) delete data.students[s];
      });

      /* filter users to get instructors  */
      data.instructors = JSON.parse(JSON.stringify(users));
      Object.keys(data.instructors || {}).forEach(s => {
        if (!data.instructors[s].instructor) delete data.instructors[s];
      });

      /* populate fake data starting with projects */
      Object.keys(projects || {}).slice(2).forEach(p => {
        projects[p].assignments = projects[p].assignments.map(a =>
          makeAssignment(p, a)
        );
      });

      data.activities = this._sortRecent([
        ...this._toArray(data.submissions, { activity: "submission" }),
        ...this._toArray(data.feedback, { activity: "feedback" }),
        ...this._toArray(data.replies, { activity: "replies" })
      ]);
      data.me = this._randomItem(Object.keys(data.students || {}));
      return data;
    }

    _handleArrayData(e, propName) {
      this[propName] =
        e && e.detail && e.detail.response && e.detail.response.data
          ? e.detail.response.data
          : [];
      //console.log("_handleArrayData", e, propName, this[propName]);
    }
    _handleObjectData(e, propName) {
      this[propName] =
        e && e.detail && e.detail.response && e.detail.response.data
          ? e.detail.response.data
          : {};
      //console.log('_handleObjectData',e,propName,this[propName]);
    }

    getAccentColor(str) {
      let card = new AccentCard(),
        colors = !card || !card.colors ? [""] : Object.keys(card.colors),
        i =
          str && str.charCodeAt(0)
            ? str.charCodeAt(0)
            : Math.floor(Math.random() * 16);
      return colors[(i % 16) + 1]
        ? colors[(i % 16) + 1]
        : colors[Math.floor(Math.random() * colors.length)];
    }
    _loadMore(e, filteredName, fullListName, increment) {
      this[filteredName] = this[fullListName].slice(
        0,
        this[filteredName].length + increment
      );
    }

    date(time) {
      let date,
        options = {
          //weekday: 'long',
          year: "numeric",
          month: "long",
          day: "numeric"
        };
      if (time && isNaN(time)) {
        let parts = time.split(/\D+/);
        date = new Date(...parts);
        /*console.log('date',parts,
        '\ndate',date,
        '\ntoString',date.toString(),
        '\ntoLocaleString',date.toLocaleString(),
        '\ntoLocaleDateString',date.toLocaleDateString(undefined,options),
        '\ntoUTCString',date.toUTCString(),
        '\ntoTimeString',date.toTimeString(),
        '\ntoLocaleTimeString',date.toLocaleTimeString()
        );*/
      } else if (time) {
        date = new Date(parseInt(time));
      }
      return date.toLocaleDateString(undefined, options);
    }
  };
};
export { ElmslnStudioUtilities };
