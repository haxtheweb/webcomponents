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
      return {};
    }
    get fakeData() {
      let submissions = [],
        comments = [],
        ctr = 0,
        students = [
          {
            id: "hxb5122",
            lastName: "Brown",
            firstName: "Havana"
          },
          {
            id: "tmn823",
            lastName: "Nebelung",
            firstName: "Tabby"
          },
          {
            id: "kmk5124",
            lastName: "Korat",
            firstName: "Kitty",
            image: `//placekitten.com/g/350/500`
          },
          {
            id: "tjm5488",
            lastName: "Manx",
            firstName: "Tortie",
            image: `//placekitten.com/350/500`
          },
          {
            id: "fms9811",
            lastName: "Sphinx",
            firstName: "Felix"
          },
          {
            id: "tjc5167",
            lastName: "Cat",
            firstName: "Tom",
            image: `//placekitten.com/g/400/400`
          },
          {
            id: "cac488",
            lastName: "Coe",
            firstName: "Callie"
          },
          {
            id: "srf325",
            lastName: "Fold",
            firstName: "Scott",
            image: `//placekitten.com/400/400`
          }
        ],
        projects = [
          {
            id: "project-1",
            project: "Hypertext Narrative Project"
          },
          {
            id: "project-2",
            project: "Ritual Project"
          },
          {
            id: "project-3",
            project: "App Project"
          }
        ],
        assignments = [
          {
            id: "assignment-1",
            projectId: "project-2",
            project: "Hypertext Narrative Project",
            assignment: "Develop: Test and Iterate"
          },
          {
            id: "assignment-2",
            project: "Ritual Project",
            projectId: "project-1",
            assignment: "Define: Themes & Insights"
          },
          {
            id: "assignment-3",
            project: "Ritual Project",
            projectId: "project-1",
            assignment: "Discover: Journey Map"
          }
        ],
        images = [
          { image: "400/300", gravity: "center" },
          { image: "200/300", gravity: "top" },
          { image: "g/500/350", gravity: "center" },
          { image: "g/300/550", gravity: "top-left" },
          { image: "300/400", gravity: "center" },
          { image: "200/400", gravity: "top" },
          { image: "100/350", gravity: "center" },
          { image: "400/500", gravity: "center" },
          { image: "g/100/300", gravity: "center" },
          { image: "500/400", gravity: "center" },
          { image: "g/200/400", gravity: "top" },
          { image: "g/300/500", gravity: "top" },
          { image: "100/300", gravity: "center" },
          { image: "g/500/400", gravity: "top" },
          { image: "300/100", gravity: "center" },
          { image: "g/300/400", gravity: "center" },
          { image: "g/300/150", gravity: "center" },
          { image: "300/500", gravity: "center" },
          { image: "g/300/100", gravity: "top" },
          { image: "500/300", gravity: "center" },
          { image: "g/100/350", gravity: "top" },
          { image: "500/350", gravity: "center" },
          { image: "g/150/300", gravity: "top" },
          { image: "150/300", gravity: "center" },
          { image: "350/100", gravity: "center" },
          { image: "g/350/100", gravity: "center" },
          { image: "300/150", gravity: "center" },
          { image: "g/200/300", gravity: "center" },
          { image: "g/500/300", gravity: "center" },
          { image: "300/550", gravity: "center" },
          { image: "g/400/300", gravity: "center" },
          { image: "550/300", gravity: "center" },
          { image: "g/400/500", gravity: "center" },
          { image: "g/550/300", gravity: "center" }
        ],
        randomDate = () => {
          return `${
            ["January", "February", "March", "April"][
              Math.floor(Math.random() * 4)
            ]
          } ${Math.floor(Math.random() * 28 + 1)}, 2020`;
        },
        submissionView = [
          {
            assignment: "Define: Synopsis",
            date: randomDate(),
            body:
              "Weigh eight pounds but take up a full-size bed going to catch the red dot today going to catch the red dot today. Meow all night having their mate disturbing sleeping humans walk on keyboard and the door is opening!\n\nhow exciting oh, it's you, meh yet litter kitter kitty litty little kitten big roar roar feed me. Dream about hunting birds slap kitten brother with paw making bread on the bathrobe yet ask for petting really likes hummus chew foot. Where is it? i saw that bird i need to bring it home to mommy squirrel!\n\nCats making all the muffins i want to go outside let me go outside nevermind inside is better or love and coo around boyfriend who purrs and makes the perfect moonlight eyes so i can purr and swat the glittery gleaming yarn to him (the yarn is from a $125 sweater) but pose purrfectly to show my beauty have a lot of grump in yourself because you can't forget to be grumpy and not be like king grumpy cat."
          },
          {
            assignment: "Develop: Storyboard",
            date: randomDate(),
            links: [
              {
                url:
                  "https://www.researchgate.net/profile/Sandra_Mccune/publication/279405839_The_Domestic_Cat/links/56b891ef08ae3c1b79b2dd85/The-Domestic-Cat.pdf",
                text: "The Domestic Cat",
                type: "pdf"
              },
              {
                url: "//placekitten.com/g/400/200",
                type: "url"
              }
            ]
          },
          {
            assignment: "Deliver: Iterate",
            date: randomDate(),
            sources: images.slice(0, 4).map(s => {
              return {
                alt: `Random Kitten from ${s.image}`,
                src: `//placekitten.com/${s.image}`,
                sizing: "cover"
              };
            })
          }
        ];
      assignments.forEach(a => {
        students.forEach(s => {
          ctr++;
          submissions.push({
            id: `submission-${ctr}`,
            date: randomDate(),
            assignmentId: a.id,
            assignment: a.assignment,
            projectId: a.projectId,
            project: a.project,
            image: `//placekitten.com/${images[ctr].image}`,
            gravity: images[ctr].gravity,
            studentId: s.id,
            student: `${s.firstName} ${s.lastName}`
          });
          students.forEach((c, i) => {
            if (c.id !== s.id)
              comments.push({
                id: `comment-${ctr}-${i}`,
                commenterId: c.id,
                firstName: c.firstName,
                lastName: c.lastName,
                image: c.image,
                date: randomDate(),
                student: s.firstName,
                studentId: s.id,
                assignmentId: a.id,
                assignment: a.assignment,
                project: a.project
              });
          });
        });
      });

      assignments.push(
        ...[
          {
            id: "assignment-4",
            projectId: "project-1",
            project: "Ritual Project",
            assignment: "Develop: Storyboard",
            date: randomDate()
          },
          {
            id: "assignment-4",
            projectId: "project-2",
            project: "Hypertext Narrative Project",
            assignment: "Discover: Word-Pairs",
            date: randomDate()
          },
          {
            id: "assignment-5",
            projectId: "project-1",
            project: "Ritual Project",
            assignment: "Define: Synopsis",
            date: randomDate()
          },
          {
            id: "assignment-6",
            projectId: "project-3",
            project: "App Project",
            assignment: "Deliver: Iterate",
            date: randomDate()
          }
        ]
      );

      submissions[0].feature = `Lick arm hair make meme, make cute face. Making sure that fluff gets into the owner's eyes hey! you there, with the hands, side-eyes your \"jerk\" other hand while being petted loved it, hated it, loved it, hated it spill litter box, scratch at owner, destroy all furniture, especially couch groom yourself 4 hours - checked, have your beauty sleep 18 hours - checked, be fabulous for the rest of the day - checked. Thanks!`;
      submissions[5].feature = `Cough hairball on conveniently placed pants mew drool bury the poop bury it deep lay on arms while you're using the keyboard for cat fur is the new black or attack the child. Decide to want nothing to do with my owner today pretend you want to go out but then don't yet meow to be let in swat turds around the house but leave hair on owner's clothes. Headbutt owner's knee stinky cat for hack, or that box? i can fit in that box stare at ceiling, for i shall purr myself to sleep thug cat . Eat all the power cords paw at your fat belly, for catch eat throw up catch eat throw up bad birds or cat walks in keyboard swipe at owner's legs and meeeeouw get my claw stuck in the dog's ear. Catasstrophe thug cat , and so you're just gonna scroll by without saying meowdy? or check cat door for ambush 10 times before coming in bathe private parts with tongue then lick owner's face jump launch to pounce upon little yarn mouse, bare fangs at toy run hide in litter box until treats are fed yet roll over and sun my belly.`;
      submissions[11].feature = `Havana, I fixed the link so this should allow you to see the following passages. Let me know if it still gives you any issues!`;

      return {
        students: students,
        comments: comments,
        assignments: assignments,
        submissions: submissions,
        projects: projects,
        submissionView: submissionView
      };
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
    getFakeData() {
      let data = this.fakeData;
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
