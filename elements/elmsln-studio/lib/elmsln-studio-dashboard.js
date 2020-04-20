/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element";
import "@polymer/iron-ajax/iron-ajax.js";
import "@lrnwebcomponents/accent-card/accent-card.js";
import "@lrnwebcomponents/a11y-collapse/a11y-collapse.js";
import "@lrnwebcomponents/progress-donut/progress-donut.js";
import "@polymer/iron-icons/iron-icons.js";

/**
 * `elmsln-studio-dashboard`
 * Studio App for ELMS:LN
 *
 * @customElement elmsln-studio-dashboard
 * @lit-html
 * @lit-element
 * @demo demo/index.html
 */
class ElmslnStudioDashboard extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          font-family: var(--elmsln-studio--FontFamily, sans-serif);
          font-size: 13px;
        }
        h1,
        h2,
        h3,
        accent-card > [slot="heading"] {
          font-size: 14px;
          font-weight: normal;
          color: var(--simple-colors-default-theme-grey-7, #666);
          margin: 0;
        }
        accent-card {
          margin: var(--elmsln-studio--Margin, 20px);
          flex: 1 0 calc(50% - 2 * var(--elmsln-studio--Margin, 20px));
          --accent-card-footer-border-color: transparent;
        }
        .linklist {
          list-style-type: none;
          padding-inline-start: 0;
        }
        #comments .linklist {
          padding: 0 var(--elmsln-studio--Margin, 20px);
        }
        .linklist li {
          position: relative;
          padding: 5px 0;
          margin-bottom: 1px;
          opacity: 0.8;
        }
        .linklist li,
        accent-card th,
        accent-card td {
          padding: 5px 0;
          text-align: left;
          min-height: 25px;
          border-bottom: 1px solid
            var(--simple-colors-default-theme-grey-4, #666);
        }
        accent-card table {
          width: 100%;
          border-collapse: collapse;
        }
        button[slot="subheading"] {
          text-decoration: underline;
        }
        button[slot="subheading"]:focus,
        button[slot="subheading"]:hover {
          text-decoration: none;
        }
        accent-card button,
        .linklist button {
          border: none;
          padding: 0;
          text-align: left;
          font-size: inherit;
          font-weight: inherit;
        }
        .linklist iron-icon {
          position: absolute;
          width: 24px;
          height: 24px;
          right: 0px;
          top: calc(50% - 12px);
        }
        .linklist-heading::after {
          content: " ";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
        }
        .linklist-heading:focus {
          outline: none;
        }
        .linklist li:focus,
        .linklist li:focus-within .linklist-heading::after {
          outline: 1px solid blue;
        }
        .linklist li:hover .linklist-heading,
        .linklist li:focus .linklist-heading,
        .linklist li:focus-within .linklist-heading {
          text-decoration: underline;
        }
        .linklist-heading,
        .linklist-subheading {
          display: block;
          width: calc(100% - 24px);
        }
        .linklist-heading {
          font-weight: bold;
        }
        .linklist-subheading {
          font-size: 11px;
        }
        progress-donut {
          width: 70%;
          margin: 0 auto;
        }
        @media screen and (min-width: 600px) {
          :host {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
          }
          #cards {
            width: calc(66.66666667%);
          }
          #comments {
            padding-right: var(--elmsln-studio--Padding, 20px);
            width: calc(33.33333333% - var(--elmsln-studio--Padding, 20px));
          }
          h1,
          h2 {
            flex: 0 0 calc(100% - var(--elmsln-studio--Margin, 20px));
            padding: 0 var(--elmsln-studio--Margin, 20px);
          }
        }
        @media screen and (min-width: 900px) {
          #cards > div {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            flex-wrap: wrap;
          }
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <iron-ajax
        auto
        url="${this.activitySrc}"
        @response="${e => this._handleArrayData(e, "__activity")}"
      ></iron-ajax>
      <iron-ajax
        auto
        url="${this.assignmentsSrc}"
        @response="${e => this._handleArrayData(e, "__assignments")}"
      ></iron-ajax>
      <iron-ajax
        auto
        url="${this.commentsSrc}"
        @response="${e => this._handleArrayData(e, "__comments")}"
      ></iron-ajax>
      <iron-ajax
        auto
        url="${this.profileSrc}"
        @response="${e => this._handleObjectData(e, "__profile")}"
      ></iron-ajax>
      <iron-ajax
        auto
        url="${this.submissionsSrc}"
        @response="${e => this._handleObjectData(e, "__submissions")}"
      ></iron-ajax>
      <!--h1 class="sr-only">Overview</h1-->
      <div id="cards">
        <div id="profile">
          <h2 class="sr-only">My Progress</h2>
          <accent-card accent-color="purple">
            <span slot="heading"
              >${this.__profile.student.data.display_name}</span
            >
            <progress-donut
              accent-color="purple"
              slot="content"
              animation="500"
              animation-delay="500"
              complete="[5,3,2,6]"
              image-src="${this.__profile.student.data.sis.avatar_url}"
              image-alt="Profile picture for ${this.__profile.student.data
                .display_name}"
              total="30"
            ></progress-donut>
            <table slot="content">
              <tbody>
                <tr>
                  <th scope="row">Course Progress</th>
                  <td>
                    ${Math.round(
                      (this.__profile.student.progress.submissions.reduce(
                        (sum, val) => sum + val
                      ) *
                        100) /
                        this.__profile.student.progress.totalAssignments
                    )}%
                  </td>
                </tr>
                <tr>
                  <th scope="row">Comments</th>
                  <td>${this.__profile.student.progress.comments}</td>
                </tr>
                <tr>
                  <th scope="row">Submissions</th>
                  <td>
                    ${this.__profile.student.progress.submissions.reduce(
                      (sum, val) => sum + val
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </accent-card>
          <accent-card accent-color="green">
            <span slot="heading">Work Due</span>
            <ul class="linklist" slot="content">
              ${this.__assignments.map(
                assign => html`
                  <li>
                    <iron-icon
                      aria-hidden="true"
                      icon="chevron-right"
                    ></iron-icon>
                    <button class="linklist-heading">
                      ${assign.attributes.title}
                    </button>
                    <span class="linklist-subheading"
                      >${this._getDueDate(assign)
                        ? html`
                            Due
                            ${this.date(
                              parseInt(this._getDueDate(assign)) * 1000
                            )}
                          `
                        : ``}
                    </span>
                  </li>
                `
              )}
            </ul>
          </accent-card>
        </div>
        <div id="work">
          <h2>Recent Work</h2>
          <accent-card accent-color="amber">
            <span slot="heading">Submissions</span>
            <button slot="subheading">All submissions</button>
            <ul class="linklist" slot="content">
              ${Object.keys(this.__submissions).map(
                submission => html`
                  <li>
                    <iron-icon
                      aria-hidden="true"
                      icon="chevron-right"
                    ></iron-icon>
                    <button class="linklist-heading">
                      ${this.__submissions[submission].attributes.title}
                    </button>
                    <span class="linklist-subheading"
                      >${this.date(
                        this.__submissions[submission].meta.changed
                      )}</span
                    >
                  </li>
                `
              )}
            </ul>
          </accent-card>
          <accent-card accent-color="cyan">
            <span slot="heading">Comments</span>
            <button slot="subheading">All comments</button>
            <!-- TODO need a comments list where student is in the thread or thread is about student submission -->
            <ul class="linklist" slot="content">
              ${this.__comments.map(
                comment => html`
                  <li>
                    <iron-icon
                      aria-hidden="true"
                      icon="chevron-right"
                    ></iron-icon>
                    <button class="linklist-heading">
                      ${comment.attributes.subject}
                    </button>
                    <span class="linklist-subheading"
                      >${this.date(comment.attributes.changed)}</span
                    >
                  </li>
                `
              )}
            </ul>
          </accent-card>
        </div>
      </div>
      <div id="comments">
        <h2>Recent Activity</h2>
        <ul class="linklist">
          ${this.__activity.map(
            activity => html`
              <li>
                <iron-icon aria-hidden="true" icon="chevron-right"></iron-icon>
                <button class="linklist-heading">
                  ${activity.relationships.author.data.sis.sortable_name.replace(
                    /.*,/,
                    ""
                  )}
                  ${activity.type === "comment" ? "commented" : "submitted"}
                  ${activity.type === "comment"
                    ? activity.attributes.subject
                    : activity.attributes.title}
                </button>
                <span class="linklist-subheading">
                  ${this.date(
                    activity.type === "comment"
                      ? activity.attributes.changed
                      : activity.meta.changed
                  )}
                </span>
              </li>
            `
          )}
        </ul>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /*
       * source JSON for all activity
       * (submissions and comments by anyone)
       */
      activitySrc: {
        type: String,
        attribute: "activity-src"
      },
      /*
       * source JSON for upcoming assignments
       * that student hasn't submitted yet
       */
      assignmentsSrc: {
        type: String,
        attribute: "assignments-src"
      },
      /*
       * source JSON for most recent comments in response to
       * student's comment or submission
       */
      commentsSrc: {
        type: String,
        attribute: "comments-src"
      },
      /*
       * source JSON for student's profile data (name & course progress)
       */
      profileSrc: {
        type: String,
        attribute: "profile-src"
      },
      /*
       * source JSON for student's most recent submissions
       */
      submissionsSrc: {
        type: String,
        attribute: "submissions-src"
      },
      /*
       * recent activity
       * (submissions and comments from everyone)
       */
      __activity: {
        type: Array
      },
      /*
       * upcoming assignments
       */
      __assignments: {
        type: Array
      },
      /*
       * most recent comments in response to
       * student's comment or submission
       */
      __comments: {
        type: Array
      },
      /*
       * student's profile data
       * (name & course progress)
       */
      __profileSrc: {
        type: Object
      },
      /*
       * student's submissions
       */
      __submissions: {
        type: Object
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "elmsln-studio-dashboard";
  }

  // life cycle
  constructor() {
    super();
    this.__activity = [
      {
        type: "comment",
        id: "1293",
        attributes: {
          subject: "Feedback from abc123",
          body:
            'Hey Tortie!Lick arm hair make meme, make cute face. Making sure that fluff gets into the owner\'s eyes hey! you there, with the hands, side-eyes your "jerk" other hand while being petted loved it, hated it, loved it, hated it spill litter box, scratch at owner, destroy all furniture, especially couch groom yourself 4 hours - checked, have your beauty sleep 18 hours - checked, be fabulous for the rest of the day - checked. Thanks!',
          thread: "01/",
          threadDepth: 1,
          parentComment: "0",
          created: "2020-03-19T15:08:21-04:00",
          changed: "2020-03-19T15:08:21-04:00"
        },
        metadata: { editing: false, disabled: false },
        relationships: {
          author: {
            data: {
              type: "user",
              id: "397",
              name: "abc123",
              display_name: "Havana Brown",
              avatar: "http://placekitten.com/200/300",
              visual: { icon: false, label: false },
              sis: {
                id: 6408850,
                name: "Havana Brown",
                created_at: "2015-07-30T13:15:56-04:00",
                sortable_name: "Brown, Havana",
                short_name: "Havana Brown",
                sis_user_id: "abc123@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com"
              }
            }
          },
          node: { data: { type: "node", id: "5381" } }
        },
        actions: { reply: true, like: false, edit: true, delete: true }
      },
      {
        type: "comment",
        id: "1296",
        attributes: {
          subject: "Feedback from xyz789",
          body:
            "Havana, I fixed the link so this should allow you to see the following passages. Let me know if it still gives you any issues!",
          thread: "01.00/",
          threadDepth: 2,
          parentComment: "1293",
          created: "2020-03-19T15:23:56-04:00",
          changed: "2020-03-19T15:23:56-04:00"
        },
        metadata: { editing: false, disabled: false },
        relationships: {
          author: {
            data: {
              type: "user",
              id: "385",
              name: "xyz789",
              display_name: "Tortie Manx",
              avatar: "http://placekitten.com/300/400",
              visual: { icon: false, label: false },
              sis: {
                id: 6938692,
                name: "Tortie Manx",
                created_at: "2019-02-05T18:22:47-05:00",
                sortable_name: "Manx, Tortie",
                short_name: "Tortie Manx",
                sis_user_id: "xyz789@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com/"
              }
            }
          },
          node: { data: { type: "node", id: "5381" } }
        },
        actions: { reply: true, like: false, edit: true, delete: true }
      },
      {
        type: "comment",
        id: "1299",
        attributes: {
          subject: "Feedback from def3456",
          body:
            "Good work so far, Tortie!  Cough hairball on conveniently placed pants mew drool bury the poop bury it deep lay on arms while you're using the keyboard for cat fur is the new black or attack the child. Decide to want nothing to do with my owner today pretend you want to go out but then don't yet meow to be let in swat turds around the house but leave hair on owner's clothes. Headbutt owner's knee stinky cat for hack, or that box? i can fit in that box stare at ceiling, for i shall purr myself to sleep thug cat . Eat all the power cords paw at your fat belly, for catch eat throw up catch eat throw up bad birds or cat walks in keyboard swipe at owner's legs and meeeeouw get my claw stuck in the dog's ear. Catasstrophe thug cat , and so you're just gonna scroll by without saying meowdy? or check cat door for ambush 10 times before coming in bathe private parts with tongue then lick owner's face jump launch to pounce upon little yarn mouse, bare fangs at toy run hide in litter box until treats are fed yet roll over and sun my belly.",
          thread: "02/",
          threadDepth: 1,
          parentComment: "0",
          created: "2020-03-20T00:52:30-04:00",
          changed: "2020-03-20T00:52:30-04:00"
        },
        metadata: { editing: false, disabled: false },
        relationships: {
          author: {
            data: {
              type: "user",
              id: "390",
              name: "def3456",
              display_name: "Minskin Minskin Mau",
              avatar: "http://placekitten.com/300/300",
              visual: { icon: false, label: false },
              sis: {
                id: 6968039,
                name: "Minskin Minskin Mau",
                created_at: "2019-08-01T10:57:22-04:00",
                sortable_name: "Minskin Mau, Minskin",
                short_name: "Minskin Minskin Mau",
                sis_user_id: "def3456@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com/"
              }
            }
          },
          node: { data: { type: "node", id: "5381" } }
        },
        actions: { reply: true, like: false, edit: true, delete: true }
      },
      {
        type: "comment",
        id: "1300",
        attributes: {
          subject: "Feedback from abc123",
          body:
            "Hey Tortie! It's working for me now.  Here's my feedback: I see a bird i stare at it i meow at it i do a wiggle come here birdy catching very fast laser pointer or purrrrrr and what the heck just happened, something feels fishy for taco cat backwards spells taco cat bite nose of your human have a lot of grump in yourself because you can't forget to be grumpy and not be like king grumpy cat. Mice why must they do that attack dog, run away and pretend to be victim. Leave dead animals as gifts purrr purr littel cat, little cat purr purr for human is washing you why halp oh the horror flee scratch hiss bite hiss at vacuum cleaner but pet me pet me don't pet me chase mice poop in the plant pot. Why use post when this sofa is here plop down in the middle where everybody walks. Burrow under covers meow meow mama poop in a handbag look delicious and drink the soapy mopping up water then puke giant foamy fur-balls cat sit like bread no, you can't close the door, i haven't decided whether or not i wanna go out but fight an alligator and win. Twitch tail in permanent irritation i heard this rumor where the humans are our owners, pfft, what do they know?! so howl on top of tall thing, floof tum, tickle bum, jellybean footies curly toes so stare out the window. \nPoop in a handbag look delicious and drink the soapy mopping up water then puke giant foamy fur-balls rub butt on table sit on human they not getting up ever or cat jumps and falls onto the couch purrs and wakes up in a new dimension filled with kitty litter meow meow yummy there is a bunch of cats hanging around eating catnip , sniff all the things stare at owner accusingly then wink pooping rainbow while flying in a toasted bread costume in space. Mark territory get scared by sudden appearance of cucumber yet purr purr purr until owner pets why owner not pet me hiss scratch meow, but humans,humans, humans oh how much they love us felines we are the center of attention they feed, they clean pushes butt to face. Then cats take over the world hide at bottom of staircase to trip human. Need to chase tail eat plants, meow, and throw up because i ate plants, cats are the world. Sit by the fire chase red laser dot twitch tail in permanent irritation but sniff sniff licks paws. Chew the plant roll over and sun my belly yet meow to be let in. \nOoh, are those your $250 dollar sandals? lemme use that as my litter box nap all day, and shred all toilet paper and spread around the house. Eat grass, throw it back up good now the other hand, too or scratch at fleas, meow until belly rubs, hide behind curtain when vacuum cleaner is on scratch strangers and poo on owners food meowzer, and chase the pig around the house. Hiss at vacuum cleaner i is not fat, i is fluffy or making sure that fluff gets into the owner's eyes. Stare out the window cat snacks, yet check cat door for ambush 10 times before coming in throw down all the stuff in the kitchen i love cuddles claw drapes. Sleep all day whilst slave is at work, play all night whilst slave is sleeping why must they do that please stop looking at your phone and pet me meow meow we are 3 small kittens sleeping most of our time, we are around 15 weeks old i think, i don’t know i can’t count. Curl up and sleep on the freshly laundered towels making bread on the bathrobe, you are a captive audience while sitting on the toilet, pet me, and eats owners hair then claws head yet has closed eyes but still sees you for ask to go outside and ask to come inside and ask to go outside and ask to come inside yet spend six hours per day washing, but still have a crusty butthole. Flex claws on the human's belly and purr like a lawnmower stand in front of the computer screen. Annoy owner until he gives you food say meow repeatedly until belly rubs, feels good cough hairball, eat toilet paper freak human out make funny noise mow mow mow mow mow mow success now attack human more napping, more napping all the napping is exhausting. Twitch tail in permanent irritation this human feeds me, i should be a god so i love cuddles found somthing move i bite it tail chill on the couch table attack dog, run away and pretend to be victim and destroy couch as revenge. Flop over really likes hummus. Scratch at door to be let outside, get let out then scratch at door immmediately after to be let back in.",
          thread: "03/",
          threadDepth: 1,
          parentComment: "0",
          created: "2020-03-20T11:39:35-04:00",
          changed: "2020-03-20T11:39:35-04:00"
        },
        metadata: { editing: false, disabled: false },
        relationships: {
          author: {
            data: {
              type: "user",
              id: "397",
              name: "abc123",
              display_name: "Havana Brown",
              avatar: "http://placekitten.com/200/300",
              visual: { icon: false, label: false },
              sis: {
                id: 6408850,
                name: "Havana Brown",
                created_at: "2015-07-30T13:15:56-04:00",
                sortable_name: "Brown, Havana",
                short_name: "Havana Brown",
                sis_user_id: "abc123@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com"
              }
            }
          },
          node: { data: { type: "node", id: "5381" } }
        },
        actions: { reply: true, like: false, edit: true, delete: true }
      },
      {
        type: "cle_submission",
        id: "4911",
        display: {
          image:
            "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=QRgih456",
          icon: false
        },
        attributes: {
          title: "Submission for Deliver: Open Toy",
          download_files:
            "/dmd100/download/cle_submission/node-field_download-4911-0",
          body: " ",
          state: "submission_ready",
          relatedSubmission: null,
          files: [
            {
              fid: 13343,
              uid: 362,
              filename: "crayon-play-instructions.pdf",
              uri:
                "private://submission_files/shh0000/crayon-play-instructions.pdf",
              filemime: "application/pdf",
              filesize: 2216011,
              status: 1,
              timestamp: 1575923237,
              origname: "crayon play instructions.pdf",
              type: "document",
              uuid: "e865ade8-a8e9-4e35-8fda-54aa86e57ab3",
              metadata: [],
              display: 0,
              description: null,
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_files/shh0000/crayon-play-instructions.pdf",
              created: "2019-12-09T15:27:17-05:00"
            }
          ],
          links: null,
          video: null,
          images: [
            {
              fid: 13339,
              uid: 362,
              filename: "IMG_0460.jpeg",
              uri: "private://submission_images/IMG_0460.jpeg",
              filemime: "image/jpeg",
              filesize: 1057072,
              status: 1,
              timestamp: 1575920911,
              origname: "IMG_0460.jpeg",
              type: "image",
              uuid: "6950f0ec-d2a4-4d63-bb04-fe22173cd8b8",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 1922, width: 2634 },
              height: "1922",
              width: "2634",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=S-2VxVRC",
              display: 0,
              created: "2019-12-09T14:48:31-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=S-2VxVRC",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=VGoJphDl",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=1bdKR05L",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=WjMn5Ll3",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=CDQdWU9-",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=DfM_xNDG",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=bt9TnApn",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=BabGlngr",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=ZFVeXW8y",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=cahZtNZP",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=21f9gMJd",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=MtYWvyyr"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_0460.jpeg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_0460.jpeg?itok=ZFVeXW8y"
            },
            {
              fid: 13341,
              uid: 362,
              filename: "IMG_0463.jpeg",
              uri: "private://submission_images/IMG_0463.jpeg",
              filemime: "image/jpeg",
              filesize: 1823473,
              status: 1,
              timestamp: 1575920911,
              origname: "IMG_0463.jpeg",
              type: "image",
              uuid: "505cc916-62d7-4356-9078-641bb63a4a63",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 2811, width: 2907 },
              height: "2811",
              width: "2907",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=iXC9fokp",
              display: 0,
              created: "2019-12-09T14:48:31-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=iXC9fokp",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=2S0XRZgq",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=goJF9BHX",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=pY6TrwnF",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=lh_6EdKz",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=hQ6JjvWO",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=f8U7spK6",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=Kzhq-uJH",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=D8c_HpFm",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=igUY4OUJ",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=nuiZeOjB",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=xul-aw8O"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_0463.jpeg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_0463.jpeg?itok=D8c_HpFm"
            },
            {
              fid: 13342,
              uid: 362,
              filename: "IMG_0464.jpeg",
              uri: "private://submission_images/IMG_0464.jpeg",
              filemime: "image/jpeg",
              filesize: 2189970,
              status: 1,
              timestamp: 1575920911,
              origname: "IMG_0464.jpeg",
              type: "image",
              uuid: "f2d2fc25-6371-4d4a-aeb3-feb2443b4c0e",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 3665, width: 2667 },
              height: "3665",
              width: "2667",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=mjM_2W1p",
              display: 0,
              created: "2019-12-09T14:48:31-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=mjM_2W1p",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=hxgBHvXU",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=wbkjKy2I",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=qr3YzPXk",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=K1Nq2d8Y",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=Op6LLNw6",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=hY7OoakW",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=5GotVhgN",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=sVlh32Xd",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=DrKcglsG",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=mpwxLi1k",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=WmFg3JIS"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_0464.jpeg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_0464.jpeg?itok=sVlh32Xd"
            },
            {
              fid: 13340,
              uid: 362,
              filename: "IMG_0462.jpeg",
              uri: "private://submission_images/IMG_0462.jpeg",
              filemime: "image/jpeg",
              filesize: 2536256,
              status: 1,
              timestamp: 1575920911,
              origname: "IMG_0462.jpeg",
              type: "image",
              uuid: "618360ac-29bd-406c-97a8-6e1398f369f8",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 3690, width: 2942 },
              height: "3690",
              width: "2942",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=diD1-nGr",
              display: 0,
              created: "2019-12-09T14:48:31-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=diD1-nGr",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=lyRBO0i-",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=Y7du__m4",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=02DfSLlO",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=CLtWBE3d",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=YhZTeLGU",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=WVmw0D-t",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=BqqdiozW",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=QRgih456",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=Wh6cSc-D",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=Tbk-4OTy",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=PyA0fSDh"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_0462.jpeg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_0462.jpeg?itok=QRgih456"
            }
          ]
        },
        meta: {
          created: "2019-12-09T14:43:50-05:00",
          changed: "2019-12-09T15:27:17-05:00",
          humandate: "December 9, 2019, 3:27 pm",
          revision_timestamp: "2019-12-09T15:27:17-05:00",
          canUpdate: 1,
          canDelete: 1,
          canCritique: 1,
          filefieldTypes:
            ".txt,.doc,.docx,.pdf,.zip,.md,.xls,.xlsx,.ppt,.pptx,.html,.rtf",
          imagefieldTypes: ".png,.gif,.jpg,.jpeg",
          state_icon: "done",
          state_color: "green lighten-3",
          submissionType: "default",
          comment_count: 0,
          comment_new: "0"
        },
        relationships: {
          assignment: {
            type: "cle_assignment",
            id: "3966",
            attributes: {
              title: "Deliver: Open Toy",
              body: null,
              critiqueOutline: null
            },
            meta: {
              created: "2019-08-15T11:15:34-04:00",
              changed: "2019-08-15T11:15:34-04:00",
              humandate: "August 15, 2019, 11:15 am",
              revision_timestamp: "2019-08-15T11:15:34-04:00",
              canUpdate: 1,
              canDelete: 1,
              afterDueDate: 0,
              canCritique: 0,
              relatedSubmissions: {
                canCreate: 1,
                complete: {
                  icon: "assignment",
                  color: "grey lighten-4",
                  status: 0,
                  rationale: {
                    text: "You have not submitted anything",
                    code: "submission-nosubmission"
                  },
                  submission: [],
                  submissions: []
                }
              },
              rationale: {
                text:
                  "The assignment is open for submission, there is no due date.",
                code: "date-none"
              },
              submissionActive: 1
            },
            relationships: {
              project: { data: { id: "3957" } },
              group: { data: { id: "3935" } },
              author: { data: { type: "user", id: "10", name: "yay33" } }
            },
            actions: null,
            links: {
              self:
                "https://studio.aanda.psu.edu/dmd100/api/v1/cle/assignments/3966",
              url:
                "https://studio.aanda.psu.edu/dmd100/cle/app/assignments/3966",
              direct: "https://studio.aanda.psu.edu/dmd100/node/3966",
              delete:
                "https://studio.aanda.psu.edu/dmd100/node/3966/delete?destination=",
              update:
                "https://studio.aanda.psu.edu/dmd100/node/3966/edit?destination="
            }
          },
          project: { data: { id: "3957", title: "Open Kit Project" } },
          group: { data: { id: "3935" } },
          author: {
            data: {
              type: "user",
              id: "362",
              name: "shh0000",
              display_name: "Pixie Bob",
              avatar: "http://placekitten.com/400/600",
              sis: {
                id: 6952870,
                name: "Pixie Bob",
                created_at: "2019-06-13T16:06:42-04:00",
                sortable_name: "Bob, Pixie",
                short_name: "Pixie Bob",
                sis_user_id: "shh0000@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com/400/600"
              }
            }
          },
          relatedSubmission: {},
          comments: null
        },
        actions: null
      },
      {
        type: "cle_submission",
        id: "4910",
        display: {
          image:
            "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=zYuKNTKR",
          icon: false
        },
        attributes: {
          title: "Submission for Deliver: Open Toy",
          download_files:
            "/dmd100/download/cle_submission/node-field_download-4910-0",
          body: " ",
          state: "submission_ready",
          relatedSubmission: null,
          files: [
            {
              fid: 13337,
              uid: 368,
              filename: "Rex-Cornish-instructions-3.pdf",
              uri:
                "private://submission_files/nxn121/Rex-Cornish-instructions-3.pdf",
              filemime: "application/pdf",
              filesize: 2240561,
              status: 1,
              timestamp: 1575874476,
              origname: "Rex Cornish Instructions 3.pdf",
              type: "document",
              uuid: "20879142-ce03-4b7e-97ac-946f95923798",
              metadata: [],
              display: 0,
              description: null,
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_files/nxn121/Rex-Cornish-instructions-3.pdf",
              created: "2019-12-09T01:54:36-05:00"
            }
          ],
          links: null,
          video: null,
          images: [
            {
              fid: 13333,
              uid: 368,
              filename: "IMG_2966.jpg",
              uri: "private://submission_images/IMG_2966.jpg",
              filemime: "image/jpeg",
              filesize: 3128040,
              status: 1,
              timestamp: 1575874476,
              origname: "IMG_2966.jpg",
              type: "image",
              uuid: "5715a2ba-d82d-4d51-886b-b97bf43b0385",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 3892, width: 2921 },
              height: "3892",
              width: "2921",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=VQW_AGay",
              display: 0,
              created: "2019-12-09T01:54:36-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=VQW_AGay",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=ua1UopNp",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=KPNMsiFB",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=wif1lsbB",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=VoFtyGkN",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=L0wkhGXq",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=gxo7JqUd",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=8jzuB_44",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=NiPvwEg6",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=JflyVXpP",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=uCkMszgR",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=kY4BlY7_"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_2966.jpg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_2966.jpg?itok=NiPvwEg6"
            },
            {
              fid: 13334,
              uid: 368,
              filename: "IMG_2968.jpg",
              uri: "private://submission_images/IMG_2968_0.jpg",
              filemime: "image/jpeg",
              filesize: 2496221,
              status: 1,
              timestamp: 1575874476,
              origname: "IMG_2968.jpg",
              type: "image",
              uuid: "6e73a118-0369-49f4-b855-46b113021dc1",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 3024, width: 4032 },
              height: "3024",
              width: "4032",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=-_jrg76i",
              display: 0,
              created: "2019-12-09T01:54:36-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=-_jrg76i",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=csQ8kyrA",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=vQO_Exun",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=OHqZsYhA",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=qABqlO_I",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=f_RQopvT",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=gnP_ajkZ",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=23W9YJo5",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=jRqrgQ0v",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=5COrmM27",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=IAt67KIH",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=5oYwmM-w"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_2968_0.jpg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_2968_0.jpg?itok=jRqrgQ0v"
            },
            {
              fid: 13335,
              uid: 368,
              filename: "IMG_2969.jpg",
              uri: "private://submission_images/IMG_2969.jpg",
              filemime: "image/jpeg",
              filesize: 2316791,
              status: 1,
              timestamp: 1575874476,
              origname: "IMG_2969.jpg",
              type: "image",
              uuid: "5dbcf82a-dbb2-4c18-b669-7fbaffb33bc2",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 3024, width: 4032 },
              height: "3024",
              width: "4032",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=2Az9XdHw",
              display: 0,
              created: "2019-12-09T01:54:36-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=2Az9XdHw",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=FNWfwnbS",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=LRJLiD9M",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=_AzLiY_C",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=aSw7rXa6",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=Cc421Z9R",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=N3SNVvcQ",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=444y3y1h",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=wGpGaDUI",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=aqz0j9pD",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=ueMB4kCK",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=9tNqAUsi"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_2969.jpg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_2969.jpg?itok=wGpGaDUI"
            },
            {
              fid: 13336,
              uid: 368,
              filename: "IMG_2970.jpg",
              uri: "private://submission_images/IMG_2970.jpg",
              filemime: "image/jpeg",
              filesize: 2592882,
              status: 1,
              timestamp: 1575874476,
              origname: "IMG_2970.jpg",
              type: "image",
              uuid: "f437ff48-59b4-4292-8469-b0dc75709379",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 3024, width: 4032 },
              height: "3024",
              width: "4032",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=q5vjyNOo",
              display: 0,
              created: "2019-12-09T01:54:36-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=q5vjyNOo",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=vl4UDDCf",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=_QDQvabq",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=_tJt3CKy",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=7hL3GPuM",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=25YOsnVT",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=H23UXpcZ",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=dAV6LQZ1",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=zYuKNTKR",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=vPYexIuf",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=1RQmfiCY",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=6D9no60e"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_2970.jpg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_2970.jpg?itok=zYuKNTKR"
            }
          ]
        },
        meta: {
          created: "2019-12-09T01:52:04-05:00",
          changed: "2019-12-09T01:54:36-05:00",
          humandate: "December 9, 2019, 1:54 am",
          revision_timestamp: "2019-12-09T01:54:36-05:00",
          canUpdate: 1,
          canDelete: 1,
          canCritique: 1,
          filefieldTypes:
            ".txt,.doc,.docx,.pdf,.zip,.md,.xls,.xlsx,.ppt,.pptx,.html,.rtf",
          imagefieldTypes: ".png,.gif,.jpg,.jpeg",
          state_icon: "done",
          state_color: "green lighten-3",
          submissionType: "default",
          comment_count: 0,
          comment_new: "0"
        },
        relationships: {
          assignment: {
            type: "cle_assignment",
            id: "3966",
            attributes: {
              title: "Deliver: Open Toy",
              body: null,
              critiqueOutline: null
            },
            meta: {
              created: "2019-08-15T11:15:34-04:00",
              changed: "2019-08-15T11:15:34-04:00",
              humandate: "August 15, 2019, 11:15 am",
              revision_timestamp: "2019-08-15T11:15:34-04:00",
              canUpdate: 1,
              canDelete: 1,
              afterDueDate: 0,
              canCritique: 0,
              relatedSubmissions: {
                canCreate: 1,
                complete: {
                  icon: "assignment",
                  color: "grey lighten-4",
                  status: 0,
                  rationale: {
                    text: "You have not submitted anything",
                    code: "submission-nosubmission"
                  },
                  submission: [],
                  submissions: []
                }
              },
              rationale: {
                text:
                  "The assignment is open for submission, there is no due date.",
                code: "date-none"
              },
              submissionActive: 1
            },
            relationships: {
              project: { data: { id: "3957" } },
              group: { data: { id: "3935" } },
              author: { data: { type: "user", id: "10", name: "yay33" } }
            },
            actions: null,
            links: {
              self:
                "https://studio.aanda.psu.edu/dmd100/api/v1/cle/assignments/3966",
              url:
                "https://studio.aanda.psu.edu/dmd100/cle/app/assignments/3966",
              direct: "https://studio.aanda.psu.edu/dmd100/node/3966",
              delete:
                "https://studio.aanda.psu.edu/dmd100/node/3966/delete?destination=",
              update:
                "https://studio.aanda.psu.edu/dmd100/node/3966/edit?destination="
            }
          },
          project: { data: { id: "3957", title: "Open Kit Project" } },
          group: { data: { id: "3935" } },
          author: {
            data: {
              type: "user",
              id: "368",
              name: "nxn121",
              display_name: "Cornish Rex",
              avatar: "http://placekitten.com/150/300",
              sis: {
                id: 6950745,
                name: "Cornish Rex",
                created_at: "2019-06-05T16:06:24-04:00",
                sortable_name: "Rex, Cornish",
                short_name: "Cornish Rex",
                sis_user_id: "nxn121@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com/150/300"
              }
            }
          },
          relatedSubmission: {},
          comments: null
        },
        actions: null
      },
      {
        type: "cle_submission",
        id: "4909",
        display: {
          image:
            "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=rpa-VE0E",
          icon: false
        },
        attributes: {
          title: "Submission for Deliver: Open Toy",
          download_files:
            "/dmd100/download/cle_submission/node-field_download-4909-0",
          body: " ",
          state: "submission_ready",
          relatedSubmission: null,
          files: [
            {
              fid: 13324,
              uid: 370,
              filename: "presentation-1.pdf",
              uri: "private://submission_files/hgs199/presentation-1.pdf",
              filemime: "application/pdf",
              filesize: 332389,
              status: 1,
              timestamp: 1575870114,
              origname: "Presentation 1.pdf",
              type: "document",
              uuid: "13d2c5c2-3eb1-4fde-a3e4-ac873ecc2611",
              metadata: [],
              display: 0,
              description: null,
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_files/hgs199/presentation-1.pdf",
              created: "2019-12-09T00:41:54-05:00"
            }
          ],
          links: null,
          video: null,
          images: [
            {
              fid: 13325,
              uid: 370,
              filename: "IMG_20191207_181422.jpg",
              uri: "private://submission_images/IMG_20191207_181422.jpg",
              filemime: "image/jpeg",
              filesize: 5714325,
              status: 1,
              timestamp: 1575870405,
              origname: "IMG_20191207_181422.jpg",
              type: "image",
              uuid: "fe917b59-fc68-4b76-80f8-9acf5b8ad5e2",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 3024, width: 4032 },
              height: "3024",
              width: "4032",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=tnVOjYuP",
              display: 0,
              created: "2019-12-09T00:46:45-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=tnVOjYuP",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=lUD9OZYJ",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=yCfHmzwD",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=CEsXloxm",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=F68lCP2l",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=i6u_VN0u",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=d2BU546z",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=WpeU2kJN",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=uS6RpD0n",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=B2f0B4T1",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=mo69uJ4Z",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=4nMxMX1D"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_20191207_181422.jpg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181422.jpg?itok=uS6RpD0n"
            },
            {
              fid: 13326,
              uid: 370,
              filename: "IMG_20191209_001815.jpg",
              uri: "private://submission_images/IMG_20191209_001815.jpg",
              filemime: "image/jpeg",
              filesize: 4855775,
              status: 1,
              timestamp: 1575870405,
              origname: "IMG_20191209_001815.jpg",
              type: "image",
              uuid: "16be2eb5-4b64-451d-a180-17fa72347a3f",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 3024, width: 4032 },
              height: "3024",
              width: "4032",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=SfF-svaF",
              display: 0,
              created: "2019-12-09T00:46:45-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=SfF-svaF",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=TZeom3WO",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=8wpcfQFQ",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=aciIADuQ",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=sOsxLB2z",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=L8WtodTZ",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=ibDkXNJp",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=j_RgQl6n",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=j5URMDYL",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=SKIAjlI3",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=XzriIhGM",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=31iFGuZe"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_20191209_001815.jpg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001815.jpg?itok=j5URMDYL"
            },
            {
              fid: 13327,
              uid: 370,
              filename: "IMG_20191209_001746.jpg",
              uri: "private://submission_images/IMG_20191209_001746.jpg",
              filemime: "image/jpeg",
              filesize: 4848314,
              status: 1,
              timestamp: 1575870405,
              origname: "IMG_20191209_001746.jpg",
              type: "image",
              uuid: "d321cd97-2741-4b82-b7aa-f52b5113f792",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 3024, width: 4032 },
              height: "3024",
              width: "4032",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=LUR00VAC",
              display: 0,
              created: "2019-12-09T00:46:45-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=LUR00VAC",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=C3Gm_1dl",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=EV5jVply",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=vSmp6sqz",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=OM34C57s",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=g9gWyynq",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=CwfvlzAS",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=-t7bf-Zs",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=tsklM9fQ",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=RVulcc2R",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=LaNKDn3A",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=rr5vIOqO"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_20191209_001746.jpg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001746.jpg?itok=tsklM9fQ"
            },
            {
              fid: 13328,
              uid: 370,
              filename: "IMG_20191209_001802.jpg",
              uri: "private://submission_images/IMG_20191209_001802.jpg",
              filemime: "image/jpeg",
              filesize: 4719901,
              status: 1,
              timestamp: 1575870405,
              origname: "IMG_20191209_001802.jpg",
              type: "image",
              uuid: "c01dc877-c19e-4291-bb90-c33fde6ed32e",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 3024, width: 4032 },
              height: "3024",
              width: "4032",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=r9lx05wi",
              display: 0,
              created: "2019-12-09T00:46:45-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=r9lx05wi",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=6G00LSho",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=ocNNgCp3",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=yABFGgEy",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=K2lz71Wq",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=2eh1J6V2",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=X7gR6o7Q",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=ojgQvnWN",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=PtgECqGi",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=2x9WBEza",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=Vx71S1NV",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=p2E4uSsR"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_20191209_001802.jpg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_20191209_001802.jpg?itok=PtgECqGi"
            },
            {
              fid: 13329,
              uid: 370,
              filename: "IMG_20191207_181446.jpg",
              uri: "private://submission_images/IMG_20191207_181446.jpg",
              filemime: "image/jpeg",
              filesize: 5608071,
              status: 1,
              timestamp: 1575870405,
              origname: "IMG_20191207_181446.jpg",
              type: "image",
              uuid: "0a500dcc-83ec-4b83-96de-f6ec55055edf",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 3024, width: 4032 },
              height: "3024",
              width: "4032",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=W8hpF4ZY",
              display: 0,
              created: "2019-12-09T00:46:45-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=W8hpF4ZY",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=VytdI9NP",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=2Cqtngm1",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=hniuj2Re",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=RUzpfqgA",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=RvUjRRRx",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=tKmLkCVv",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=dC1BkHMQ",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=oZiYp6F4",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=ZeovFi-6",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=XTsQio7i",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=TIleOXpe"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_20191207_181446.jpg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181446.jpg?itok=oZiYp6F4"
            },
            {
              fid: 13330,
              uid: 370,
              filename: "IMG_20191207_181439.jpg",
              uri: "private://submission_images/IMG_20191207_181439.jpg",
              filemime: "image/jpeg",
              filesize: 6108215,
              status: 1,
              timestamp: 1575870405,
              origname: "IMG_20191207_181439.jpg",
              type: "image",
              uuid: "3f557c6e-377f-423b-98d6-e7a7af72b057",
              field_file_image_alt_text: [],
              field_file_image_title_text: [],
              metadata: { height: 3024, width: 4032 },
              height: "3024",
              width: "4032",
              alt: "",
              title: "",
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=MIvzsr_9",
              display: 0,
              created: "2019-12-09T00:46:45-05:00",
              image_styles: {
                elmsln_normalize:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=MIvzsr_9",
                elmsln_gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=qxtBGHB1",
                elmsln_large:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=cKuvqyOm",
                elmsln_large__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_large/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=bf1w2zLv",
                elmsln_medium:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=QaAV7Zmb",
                elmsln_medium__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_medium/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=Sz8uvrCi",
                elmsln_micro:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=EkHY-SMs",
                elmsln_micro__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_micro/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=9G_o70fH",
                elmsln_small:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=rpa-VE0E",
                elmsln_small__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=86G3KEYI",
                elmsln_thumb:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=mknrdARs",
                elmsln_thumb__gray:
                  "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_thumb/private/styles/elmsln_gray/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=iR-mbjKM"
              },
              originalurl:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_images/IMG_20191207_181439.jpg",
              thumbnail:
                "https://studio.aanda.psu.edu/dmd100/system/files/styles/elmsln_small/private/styles/elmsln_normalize/private/submission_images/IMG_20191207_181439.jpg?itok=rpa-VE0E"
            }
          ]
        },
        meta: {
          created: "2019-12-09T00:40:52-05:00",
          changed: "2019-12-09T00:46:45-05:00",
          humandate: "December 9, 2019, 12:46 am",
          revision_timestamp: "2019-12-09T00:46:45-05:00",
          canUpdate: 1,
          canDelete: 1,
          canCritique: 1,
          filefieldTypes:
            ".txt,.doc,.docx,.pdf,.zip,.md,.xls,.xlsx,.ppt,.pptx,.html,.rtf",
          imagefieldTypes: ".png,.gif,.jpg,.jpeg",
          state_icon: "done",
          state_color: "green lighten-3",
          submissionType: "default",
          comment_count: 0,
          comment_new: "0"
        },
        relationships: {
          assignment: {
            type: "cle_assignment",
            id: "3966",
            attributes: {
              title: "Deliver: Open Toy",
              body: null,
              critiqueOutline: null
            },
            meta: {
              created: "2019-08-15T11:15:34-04:00",
              changed: "2019-08-15T11:15:34-04:00",
              humandate: "August 15, 2019, 11:15 am",
              revision_timestamp: "2019-08-15T11:15:34-04:00",
              canUpdate: 1,
              canDelete: 1,
              afterDueDate: 0,
              canCritique: 0,
              relatedSubmissions: {
                canCreate: 1,
                complete: {
                  icon: "assignment",
                  color: "grey lighten-4",
                  status: 0,
                  rationale: {
                    text: "You have not submitted anything",
                    code: "submission-nosubmission"
                  },
                  submission: [],
                  submissions: []
                }
              },
              rationale: {
                text:
                  "The assignment is open for submission, there is no due date.",
                code: "date-none"
              },
              submissionActive: 1
            },
            relationships: {
              project: { data: { id: "3957" } },
              group: { data: { id: "3935" } },
              author: { data: { type: "user", id: "10", name: "yay33" } }
            },
            actions: null,
            links: {
              self:
                "https://studio.aanda.psu.edu/dmd100/api/v1/cle/assignments/3966",
              url:
                "https://studio.aanda.psu.edu/dmd100/cle/app/assignments/3966",
              direct: "https://studio.aanda.psu.edu/dmd100/node/3966",
              delete:
                "https://studio.aanda.psu.edu/dmd100/node/3966/delete?destination=",
              update:
                "https://studio.aanda.psu.edu/dmd100/node/3966/edit?destination="
            }
          },
          project: { data: { id: "3957", title: "Open Kit Project" } },
          group: { data: { id: "3935" } },
          author: {
            data: {
              type: "user",
              id: "370",
              name: "hgs199",
              display_name: "Selkirk Rex",
              avatar: "http://placekitten.com/600/400",
              sis: {
                id: 6791277,
                name: "Selkirk Rex",
                created_at: "2016-07-06T04:00:54-04:00",
                sortable_name: "Rex, Selkirk",
                short_name: "Selkirk Rex",
                sis_user_id: "hgs199@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com/600/400"
              }
            }
          },
          relatedSubmission: {},
          comments: null
        },
        actions: null
      }
    ];
    this.__assignments = [
      {
        type: "cle_assignment",
        id: "3937",
        attributes: {
          title: "Discover: Interview",
          body: "",
          critiqueOutline: null
        },
        meta: {
          created: "2019-08-15T11:15:34-04:00",
          changed: "2019-08-15T11:15:34-04:00",
          humandate: "August 15, 2019, 11:15 am",
          revision_timestamp: "2019-08-15T11:15:34-04:00",
          canUpdate: 1,
          canDelete: 1,
          afterDueDate: 0,
          canCritique: 0,
          relatedSubmissions: {
            canCreate: 1,
            complete: {
              icon: "assignment",
              color: "grey lighten-4",
              status: 0,
              rationale: {
                text: "You have not submitted anything",
                code: "submission-nosubmission"
              },
              submission: [],
              submissions: []
            }
          },
          rationale: {
            text:
              "The assignment is open for submission, there is no due date.",
            code: "date-none"
          },
          submissionActive: 1
        },
        relationships: {
          project: { data: { id: "3936" } },
          group: { data: { id: "3935" } },
          author: { data: { type: "user", id: "10", name: "yay33" } }
        },
        actions: null,
        links: {
          self:
            "https://studio.aanda.psu.edu/dmd100/api/v1/cle/assignments/3937",
          url: "https://studio.aanda.psu.edu/dmd100/cle/app/assignments/3937",
          direct: "https://studio.aanda.psu.edu/dmd100/node/3937",
          delete:
            "https://studio.aanda.psu.edu/dmd100/node/3937/delete?destination=apps/lrnapp-studio-instructor",
          update:
            "https://studio.aanda.psu.edu/dmd100/node/3937/edit?destination=apps/lrnapp-studio-instructor"
        }
      },
      {
        type: "cle_assignment",
        id: "3938",
        attributes: {
          title: "Discover: Journey Map",
          body: "",
          critiqueOutline: null
        },
        meta: {
          created: "2019-08-15T11:15:34-04:00",
          changed: "2019-08-15T11:15:34-04:00",
          humandate: "August 15, 2019, 11:15 am",
          revision_timestamp: "2019-08-15T11:15:34-04:00",
          canUpdate: 1,
          canDelete: 1,
          afterDueDate: 0,
          canCritique: 0,
          relatedSubmissions: {
            canCreate: 1,
            complete: {
              icon: "assignment",
              color: "grey lighten-4",
              status: 0,
              rationale: {
                text: "You have not submitted anything",
                code: "submission-nosubmission"
              },
              submission: [],
              submissions: []
            }
          },
          rationale: {
            text:
              "The assignment is open for submission, there is no due date.",
            code: "date-none",
            data: ["1588353300", "1589649300"]
          },
          submissionActive: 1
        },
        relationships: {
          project: { data: { id: "3936" } },
          group: { data: { id: "3935" } },
          author: { data: { type: "user", id: "10", name: "yay33" } }
        },
        actions: null,
        links: {
          self:
            "https://studio.aanda.psu.edu/dmd100/api/v1/cle/assignments/3938",
          url: "https://studio.aanda.psu.edu/dmd100/cle/app/assignments/3938",
          direct: "https://studio.aanda.psu.edu/dmd100/node/3938",
          delete:
            "https://studio.aanda.psu.edu/dmd100/node/3938/delete?destination=apps/lrnapp-studio-instructor",
          update:
            "https://studio.aanda.psu.edu/dmd100/node/3938/edit?destination=apps/lrnapp-studio-instructor"
        }
      },
      {
        type: "cle_assignment",
        id: "3939",
        attributes: {
          title: "Define: Themes & Insights",
          body: null,
          critiqueOutline: null
        },
        meta: {
          created: "2019-08-15T11:15:34-04:00",
          changed: "2019-08-15T11:15:34-04:00",
          humandate: "August 15, 2019, 11:15 am",
          revision_timestamp: "2019-08-15T11:15:34-04:00",
          canUpdate: 1,
          canDelete: 1,
          afterDueDate: 0,
          canCritique: 0,
          relatedSubmissions: {
            canCreate: 1,
            complete: {
              icon: "assignment",
              color: "grey lighten-4",
              status: 0,
              rationale: {
                text: "You have not submitted anything",
                code: "submission-nosubmission"
              },
              submission: [],
              submissions: []
            }
          },
          rationale: {
            text:
              "The assignment is open for submission, there is no due date.",
            code: "date-none",
            data: ["1587353300", "1589849300"]
          },
          submissionActive: 1
        },
        relationships: {
          project: { data: { id: "3936" } },
          group: { data: { id: "3935" } },
          author: { data: { type: "user", id: "1", name: "cat666" } }
        },
        actions: null,
        links: {
          self:
            "https://studio.aanda.psu.edu/dmd100/api/v1/cle/assignments/3939",
          url: "https://studio.aanda.psu.edu/dmd100/cle/app/assignments/3939",
          direct: "https://studio.aanda.psu.edu/dmd100/node/3939",
          delete:
            "https://studio.aanda.psu.edu/dmd100/node/3939/delete?destination=apps/lrnapp-studio-instructor",
          update:
            "https://studio.aanda.psu.edu/dmd100/node/3939/edit?destination=apps/lrnapp-studio-instructor"
        }
      }
    ];
    this.__comments = [
      {
        type: "comment",
        id: "1293",
        attributes: {
          subject: "Feedback from abc123",
          body:
            'Hey Tortie!Lick arm hair make meme, make cute face. Making sure that fluff gets into the owner\'s eyes hey! you there, with the hands, side-eyes your "jerk" other hand while being petted loved it, hated it, loved it, hated it spill litter box, scratch at owner, destroy all furniture, especially couch groom yourself 4 hours - checked, have your beauty sleep 18 hours - checked, be fabulous for the rest of the day - checked. Thanks!',
          thread: "01/",
          threadDepth: 1,
          parentComment: "0",
          created: "2020-03-19T15:08:21-04:00",
          changed: "2020-03-19T15:08:21-04:00"
        },
        metadata: { editing: false, disabled: false },
        relationships: {
          author: {
            data: {
              type: "user",
              id: "397",
              name: "abc123",
              display_name: "Havana Brown",
              avatar: "http://placekitten.com/200/300",
              visual: { icon: false, label: false },
              sis: {
                id: 6408850,
                name: "Havana Brown",
                created_at: "2015-07-30T13:15:56-04:00",
                sortable_name: "Brown, Havana",
                short_name: "Havana Brown",
                sis_user_id: "abc123@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com"
              }
            }
          },
          node: { data: { type: "node", id: "5381" } }
        },
        actions: { reply: true, like: false, edit: true, delete: true }
      },
      {
        type: "comment",
        id: "1296",
        attributes: {
          subject: "Feedback from xyz789",
          body:
            "Havana, I fixed the link so this should allow you to see the following passages. Let me know if it still gives you any issues!",
          thread: "01.00/",
          threadDepth: 2,
          parentComment: "1293",
          created: "2020-03-19T15:23:56-04:00",
          changed: "2020-03-19T15:23:56-04:00"
        },
        metadata: { editing: false, disabled: false },
        relationships: {
          author: {
            data: {
              type: "user",
              id: "385",
              name: "xyz789",
              display_name: "Tortie Manx",
              avatar: "http://placekitten.com/300/400",
              visual: { icon: false, label: false },
              sis: {
                id: 6938692,
                name: "Tortie Manx",
                created_at: "2019-02-05T18:22:47-05:00",
                sortable_name: "Manx, Tortie",
                short_name: "Tortie Manx",
                sis_user_id: "xyz789@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com/"
              }
            }
          },
          node: { data: { type: "node", id: "5381" } }
        },
        actions: { reply: true, like: false, edit: true, delete: true }
      },
      {
        type: "comment",
        id: "1299",
        attributes: {
          subject: "Feedback from def3456",
          body:
            "Good work so far, Tortie!  Cough hairball on conveniently placed pants mew drool bury the poop bury it deep lay on arms while you're using the keyboard for cat fur is the new black or attack the child. Decide to want nothing to do with my owner today pretend you want to go out but then don't yet meow to be let in swat turds around the house but leave hair on owner's clothes. Headbutt owner's knee stinky cat for hack, or that box? i can fit in that box stare at ceiling, for i shall purr myself to sleep thug cat . Eat all the power cords paw at your fat belly, for catch eat throw up catch eat throw up bad birds or cat walks in keyboard swipe at owner's legs and meeeeouw get my claw stuck in the dog's ear. Catasstrophe thug cat , and so you're just gonna scroll by without saying meowdy? or check cat door for ambush 10 times before coming in bathe private parts with tongue then lick owner's face jump launch to pounce upon little yarn mouse, bare fangs at toy run hide in litter box until treats are fed yet roll over and sun my belly.",
          thread: "02/",
          threadDepth: 1,
          parentComment: "0",
          created: "2020-03-20T00:52:30-04:00",
          changed: "2020-03-20T00:52:30-04:00"
        },
        metadata: { editing: false, disabled: false },
        relationships: {
          author: {
            data: {
              type: "user",
              id: "390",
              name: "def3456",
              display_name: "Minskin Minskin Mau",
              avatar: "http://placekitten.com/300/300",
              visual: { icon: false, label: false },
              sis: {
                id: 6968039,
                name: "Minskin Minskin Mau",
                created_at: "2019-08-01T10:57:22-04:00",
                sortable_name: "Minskin Mau, Minskin",
                short_name: "Minskin Minskin Mau",
                sis_user_id: "def3456@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com/"
              }
            }
          },
          node: { data: { type: "node", id: "5381" } }
        },
        actions: { reply: true, like: false, edit: true, delete: true }
      },
      {
        type: "comment",
        id: "1300",
        attributes: {
          subject: "Feedback from abc123",
          body:
            "Hey Tortie! It's working for me now.  Here's my feedback: I see a bird i stare at it i meow at it i do a wiggle come here birdy catching very fast laser pointer or purrrrrr and what the heck just happened, something feels fishy for taco cat backwards spells taco cat bite nose of your human have a lot of grump in yourself because you can't forget to be grumpy and not be like king grumpy cat. Mice why must they do that attack dog, run away and pretend to be victim. Leave dead animals as gifts purrr purr littel cat, little cat purr purr for human is washing you why halp oh the horror flee scratch hiss bite hiss at vacuum cleaner but pet me pet me don't pet me chase mice poop in the plant pot. Why use post when this sofa is here plop down in the middle where everybody walks. Burrow under covers meow meow mama poop in a handbag look delicious and drink the soapy mopping up water then puke giant foamy fur-balls cat sit like bread no, you can't close the door, i haven't decided whether or not i wanna go out but fight an alligator and win. Twitch tail in permanent irritation i heard this rumor where the humans are our owners, pfft, what do they know?! so howl on top of tall thing, floof tum, tickle bum, jellybean footies curly toes so stare out the window. \nPoop in a handbag look delicious and drink the soapy mopping up water then puke giant foamy fur-balls rub butt on table sit on human they not getting up ever or cat jumps and falls onto the couch purrs and wakes up in a new dimension filled with kitty litter meow meow yummy there is a bunch of cats hanging around eating catnip , sniff all the things stare at owner accusingly then wink pooping rainbow while flying in a toasted bread costume in space. Mark territory get scared by sudden appearance of cucumber yet purr purr purr until owner pets why owner not pet me hiss scratch meow, but humans,humans, humans oh how much they love us felines we are the center of attention they feed, they clean pushes butt to face. Then cats take over the world hide at bottom of staircase to trip human. Need to chase tail eat plants, meow, and throw up because i ate plants, cats are the world. Sit by the fire chase red laser dot twitch tail in permanent irritation but sniff sniff licks paws. Chew the plant roll over and sun my belly yet meow to be let in. \nOoh, are those your $250 dollar sandals? lemme use that as my litter box nap all day, and shred all toilet paper and spread around the house. Eat grass, throw it back up good now the other hand, too or scratch at fleas, meow until belly rubs, hide behind curtain when vacuum cleaner is on scratch strangers and poo on owners food meowzer, and chase the pig around the house. Hiss at vacuum cleaner i is not fat, i is fluffy or making sure that fluff gets into the owner's eyes. Stare out the window cat snacks, yet check cat door for ambush 10 times before coming in throw down all the stuff in the kitchen i love cuddles claw drapes. Sleep all day whilst slave is at work, play all night whilst slave is sleeping why must they do that please stop looking at your phone and pet me meow meow we are 3 small kittens sleeping most of our time, we are around 15 weeks old i think, i don’t know i can’t count. Curl up and sleep on the freshly laundered towels making bread on the bathrobe, you are a captive audience while sitting on the toilet, pet me, and eats owners hair then claws head yet has closed eyes but still sees you for ask to go outside and ask to come inside and ask to go outside and ask to come inside yet spend six hours per day washing, but still have a crusty butthole. Flex claws on the human's belly and purr like a lawnmower stand in front of the computer screen. Annoy owner until he gives you food say meow repeatedly until belly rubs, feels good cough hairball, eat toilet paper freak human out make funny noise mow mow mow mow mow mow success now attack human more napping, more napping all the napping is exhausting. Twitch tail in permanent irritation this human feeds me, i should be a god so i love cuddles found somthing move i bite it tail chill on the couch table attack dog, run away and pretend to be victim and destroy couch as revenge. Flop over really likes hummus. Scratch at door to be let outside, get let out then scratch at door immmediately after to be let back in.",
          thread: "03/",
          threadDepth: 1,
          parentComment: "0",
          created: "2020-03-20T11:39:35-04:00",
          changed: "2020-03-20T11:39:35-04:00"
        },
        metadata: { editing: false, disabled: false },
        relationships: {
          author: {
            data: {
              type: "user",
              id: "397",
              name: "abc123",
              display_name: "Havana Brown",
              avatar: "http://placekitten.com/200/300",
              visual: { icon: false, label: false },
              sis: {
                id: 6408850,
                name: "Havana Brown",
                created_at: "2015-07-30T13:15:56-04:00",
                sortable_name: "Brown, Havana",
                short_name: "Havana Brown",
                sis_user_id: "abc123@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com"
              }
            }
          },
          node: { data: { type: "node", id: "5381" } }
        },
        actions: { reply: true, like: false, edit: true, delete: true }
      }
    ];
    this.__profile = {
      student: {
        data: {
          type: "user",
          id: "371",
          name: "toc5234",
          display_name: "Tom Cat",
          avatar: "http://placekitten.com/300/150",
          sis: {
            id: 6966348,
            name: "Tom Cat",
            created_at: "2019-07-24T16:16:51-04:00",
            sortable_name: "Cat, Tom",
            short_name: "Tom Cat",
            sis_user_id: "toc5234@psu.edu",
            integration_id: null,
            avatar_url: "http://placekitten.com/300/150"
          }
        },
        progress: {
          comments: 22,
          submissions: [5, 3, 2, 6],
          totalAssignments: 30
        }
      }
    };
    this.__submissions = {
      "d3e0bbc7-6da2-4117-9284-3617679d56c3": {
        type: "cle_submission",
        id: "4847",
        display: { image: null, icon: "file-download" },
        attributes: {
          title: "Submission for Develop: Test",
          download_files:
            "/dmd100/download/cle_submission/node-field_download-4847-0",
          body: " ",
          state: "submission_ready",
          relatedSubmission: null,
          files: [
            {
              fid: 13033,
              uid: 371,
              filename: "developtest.doc",
              uri: "private://submission_files/toc5234/developtest.doc",
              filemime: "application/msword",
              filesize: 29184,
              status: 1,
              timestamp: 1574628909,
              origname: "Develop_Test.doc",
              type: "document",
              uuid: "02721da8-d45c-4f3e-9619-f749f06cb72d",
              metadata: [],
              display: 0,
              description: null,
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_files/toc5234/developtest.doc",
              created: "2019-11-24T15:55:09-05:00"
            }
          ],
          links: null,
          video: null,
          images: null
        },
        meta: {
          created: "2019-11-24T15:54:41-05:00",
          changed: "2019-11-24T15:55:09-05:00",
          humandate: "November 24, 2019, 3:55 pm",
          revision_timestamp: "2019-11-24T15:55:09-05:00",
          canUpdate: 1,
          canDelete: 1,
          canCritique: 1,
          filefieldTypes:
            ".txt,.doc,.docx,.pdf,.zip,.md,.xls,.xlsx,.ppt,.pptx,.html,.rtf",
          imagefieldTypes: ".png,.gif,.jpg,.jpeg",
          state_icon: "done",
          state_color: "green lighten-3",
          submissionType: "default",
          comment_count: 0,
          comment_new: "0"
        },
        relationships: {
          assignment: {
            type: "cle_assignment",
            id: "3964",
            attributes: {
              title: "Develop: Test",
              body: null,
              critiqueOutline: null
            },
            meta: {
              created: "2019-08-15T11:15:34-04:00",
              changed: "2019-08-15T11:15:34-04:00",
              humandate: "August 15, 2019, 11:15 am",
              revision_timestamp: "2019-08-15T11:15:34-04:00",
              canUpdate: 1,
              canDelete: 1,
              afterDueDate: 0,
              canCritique: 0,
              relatedSubmissions: null,
              rationale: {
                text:
                  "The assignment is open for submission, there is no due date.",
                code: "date-none"
              },
              submissionActive: 1
            },
            relationships: {
              project: { data: { id: "3957" } },
              group: { data: { id: "3935" } },
              author: { data: { type: "user", id: "10", name: "yay33" } }
            },
            actions: null,
            links: {
              self:
                "https://studio.aanda.psu.edu/dmd100/api/v1/cle/assignments/3964",
              url:
                "https://studio.aanda.psu.edu/dmd100/cle/app/assignments/3964",
              direct: "https://studio.aanda.psu.edu/dmd100/node/3964",
              delete:
                "https://studio.aanda.psu.edu/dmd100/node/3964/delete?destination=",
              update:
                "https://studio.aanda.psu.edu/dmd100/node/3964/edit?destination="
            }
          },
          project: { data: { id: "3957", title: "Open Kit Project" } },
          group: { data: { id: "3935" } },
          author: {
            data: {
              type: "user",
              id: "371",
              name: "toc5234",
              display_name: "Tom Cat",
              avatar: "http://placekitten.com/300/150",
              sis: {
                id: 6966348,
                name: "Tom Cat",
                created_at: "2019-07-24T16:16:51-04:00",
                sortable_name: "Cat, Tom",
                short_name: "Tom Cat",
                sis_user_id: "toc5234@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com/300/150"
              }
            }
          },
          relatedSubmission: {},
          comments: null
        },
        actions: null
      },
      "c5630a17-998b-4a7c-b85d-45cdfdae5e3a": {
        type: "cle_submission",
        id: "4806",
        display: { image: null, icon: "file-download" },
        attributes: {
          title: "Submission for Develop: Instructions",
          download_files:
            "/dmd100/download/cle_submission/node-field_download-4806-0",
          body: " ",
          state: "submission_ready",
          relatedSubmission: null,
          files: [
            {
              fid: 12936,
              uid: 371,
              filename: "gearedioinstructions.pdf",
              uri:
                "private://submission_files/toc5234/gearedioinstructions.pdf",
              filemime: "application/pdf",
              filesize: 25274863,
              status: 1,
              timestamp: 1574053086,
              origname: "Gearedio_Instructions.pdf",
              type: "document",
              uuid: "31d5da26-9667-4453-9ea6-cccbf3d25472",
              metadata: [],
              display: 0,
              description: null,
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_files/toc5234/gearedioinstructions.pdf",
              created: "2019-11-17T23:58:06-05:00"
            }
          ],
          links: null,
          video: null,
          images: null
        },
        meta: {
          created: "2019-11-17T23:41:13-05:00",
          changed: "2019-11-17T23:58:06-05:00",
          humandate: "November 17, 2019, 11:58 pm",
          revision_timestamp: "2019-11-17T23:58:06-05:00",
          canUpdate: 1,
          canDelete: 1,
          canCritique: 1,
          filefieldTypes:
            ".txt,.doc,.docx,.pdf,.zip,.md,.xls,.xlsx,.ppt,.pptx,.html,.rtf",
          imagefieldTypes: ".png,.gif,.jpg,.jpeg",
          state_icon: "done",
          state_color: "green lighten-3",
          submissionType: "default",
          comment_count: 0,
          comment_new: "0"
        },
        relationships: {
          assignment: {
            type: "cle_assignment",
            id: "3963",
            attributes: {
              title: "Develop: Instructions",
              body: null,
              critiqueOutline: null
            },
            meta: {
              created: "2019-08-15T11:15:34-04:00",
              changed: "2019-08-15T11:15:34-04:00",
              humandate: "August 15, 2019, 11:15 am",
              revision_timestamp: "2019-08-15T11:15:34-04:00",
              canUpdate: 1,
              canDelete: 1,
              afterDueDate: 0,
              canCritique: 0,
              relatedSubmissions: null,
              rationale: {
                text:
                  "The assignment is open for submission, there is no due date.",
                code: "date-none"
              },
              submissionActive: 1
            },
            relationships: {
              project: { data: { id: "3957" } },
              group: { data: { id: "3935" } },
              author: { data: { type: "user", id: "10", name: "yay33" } }
            },
            actions: null,
            links: {
              self:
                "https://studio.aanda.psu.edu/dmd100/api/v1/cle/assignments/3963",
              url:
                "https://studio.aanda.psu.edu/dmd100/cle/app/assignments/3963",
              direct: "https://studio.aanda.psu.edu/dmd100/node/3963",
              delete:
                "https://studio.aanda.psu.edu/dmd100/node/3963/delete?destination=",
              update:
                "https://studio.aanda.psu.edu/dmd100/node/3963/edit?destination="
            }
          },
          project: { data: { id: "3957", title: "Open Kit Project" } },
          group: { data: { id: "3935" } },
          author: {
            data: {
              type: "user",
              id: "371",
              name: "toc5234",
              display_name: "Tom Cat",
              avatar: "http://placekitten.com/300/150",
              sis: {
                id: 6966348,
                name: "Tom Cat",
                created_at: "2019-07-24T16:16:51-04:00",
                sortable_name: "Cat, Tom",
                short_name: "Tom Cat",
                sis_user_id: "toc5234@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com/300/150"
              }
            }
          },
          relatedSubmission: {},
          comments: null
        },
        actions: null
      },
      "469cedb2-f10e-4277-82b0-680a414fb0f9": {
        type: "cle_submission",
        id: "4788",
        display: { image: null, icon: "file-download" },
        attributes: {
          title: "Submission for Develop: Instructions",
          download_files:
            "/dmd100/download/cle_submission/node-field_download-4788-0",
          body: " ",
          state: "submission_ready",
          relatedSubmission: null,
          files: [
            {
              fid: 12781,
              uid: 368,
              filename: "Rex-Cornish-instructions.pdf",
              uri:
                "private://submission_files/nxn121/Rex-Cornish-instructions.pdf",
              filemime: "application/pdf",
              filesize: 1483778,
              status: 1,
              timestamp: 1574037719,
              origname: "Rex Cornish Instructions.pdf",
              type: "document",
              uuid: "ee4d7412-62f8-479e-99f9-06560fab3adf",
              metadata: [],
              display: 0,
              description: null,
              url:
                "https://studio.aanda.psu.edu/dmd100/system/files/submission_files/nxn121/Rex-Cornish-instructions.pdf",
              created: "2019-11-17T19:41:59-05:00"
            }
          ],
          links: null,
          video: null,
          images: null
        },
        meta: {
          created: "2019-11-17T19:41:13-05:00",
          changed: "2019-11-17T19:41:59-05:00",
          humandate: "November 17, 2019, 7:41 pm",
          revision_timestamp: "2019-11-17T19:41:59-05:00",
          canUpdate: 1,
          canDelete: 1,
          canCritique: 1,
          filefieldTypes:
            ".txt,.doc,.docx,.pdf,.zip,.md,.xls,.xlsx,.ppt,.pptx,.html,.rtf",
          imagefieldTypes: ".png,.gif,.jpg,.jpeg",
          state_icon: "done",
          state_color: "green lighten-3",
          submissionType: "default",
          comment_count: 0,
          comment_new: "0"
        },
        relationships: {
          assignment: {
            type: "cle_assignment",
            id: "3963",
            attributes: {
              title: "Develop: Instructions",
              body: null,
              critiqueOutline: null
            },
            meta: {
              created: "2019-08-15T11:15:34-04:00",
              changed: "2019-08-15T11:15:34-04:00",
              humandate: "August 15, 2019, 11:15 am",
              revision_timestamp: "2019-08-15T11:15:34-04:00",
              canUpdate: 1,
              canDelete: 1,
              afterDueDate: 0,
              canCritique: 0,
              relatedSubmissions: null,
              rationale: {
                text:
                  "The assignment is open for submission, there is no due date.",
                code: "date-none"
              },
              submissionActive: 1
            },
            relationships: {
              project: { data: { id: "3957" } },
              group: { data: { id: "3935" } },
              author: { data: { type: "user", id: "10", name: "yay33" } }
            },
            actions: null,
            links: {
              self:
                "https://studio.aanda.psu.edu/dmd100/api/v1/cle/assignments/3963",
              url:
                "https://studio.aanda.psu.edu/dmd100/cle/app/assignments/3963",
              direct: "https://studio.aanda.psu.edu/dmd100/node/3963",
              delete:
                "https://studio.aanda.psu.edu/dmd100/node/3963/delete?destination=",
              update:
                "https://studio.aanda.psu.edu/dmd100/node/3963/edit?destination="
            }
          },
          project: { data: { id: "3957", title: "Open Kit Project" } },
          group: { data: { id: "3935" } },
          author: {
            data: {
              type: "user",
              id: "368",
              name: "nxn121",
              display_name: "Cornish Rex",
              avatar: "http://placekitten.com/150/300",
              sis: {
                id: 6950745,
                name: "Cornish Rex",
                created_at: "2019-06-05T16:06:24-04:00",
                sortable_name: "Rex, Cornish",
                short_name: "Cornish Rex",
                sis_user_id: "nxn121@psu.edu",
                integration_id: null,
                avatar_url: "http://placekitten.com/150/300"
              }
            }
          },
          relatedSubmission: {},
          comments: null
        },
        actions: null
      }
    };
    this.tag = ElmslnStudioDashboard.tag;
  }
  _getDueDates(item) {
    return item.meta.rationale && item.meta.rationale.data
      ? item.meta.rationale.data
      : undefined;
  }
  _getDueDate(item) {
    //console.log('_getDueDate',item,this._getDueDates(item));
    return this._getDueDates(item)
      ? this._getDueDates(item)[1] || this._getDueDates(item)[0]
      : undefined;
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
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  // static get observedAttributes() {
  //   return [];
  // }
  // disconnectedCallback() {}

  // attributeChangedCallback(attr, oldValue, newValue) {}
}
customElements.define("elmsln-studio-dashboard", ElmslnStudioDashboard);
export { ElmslnStudioDashboard };
