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
        threadedComments = [],
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
            image: `//placekitten.com/g/400/300`
          },
          {
            id: "tjm5488",
            lastName: "Manx",
            firstName: "Tortie",
            image: `//placekitten.com/400/300`
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
        randomDate = () => {
          return `${
            ["January", "February", "March", "April"][
              Math.floor(Math.random() * 4)
            ]
          } ${Math.floor(Math.random() * 28 + 1)}, 2020`;
        },
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
        sentences = paragraphs.map(p=>p.split(/[\.\?\!]+\s+/)).flat(),
        words = paragraphs.map(p=>p.split(/\W+/)).flat(),
        loremIpsum = (min = 0,max = 15, arr = paragraphs) => {
          let rand = min + Math.floor(Math.random() * (max - min)), result = [];
          while(result.length < rand){
            result = [...arr, ...arr].slice(0,rand); 
          }
          return result; 
        },
        randomAspect = () => {
          let w = 200 + Math.floor(Math.random() * 600),
            h = 200 + Math.floor(Math.random() * 600);
          return `${w}/${h}`;
        },
        randomItem = (items) => {
          return items[Math.floor(Math.random() * items.length)];
        },
        randomGravity = () => {
          return randomItem([
            "center","center","center","center",
            "center","center","center","center",
            "top","top-left","top-right","left",
            "bottom","bottom-left","bottom-right","right",
          ]);
        },
        randomTopic = () => randomItem(["any","animals","nature","people","tech"]),
        randomFilter = () => randomItem(["","","","","/greyscale","/greyscale","/sepia"]),
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
            sources: [1,2,3,4].map(s => {
              return {
                alt: `Random image from //plageimg.com`,
                src: `http://placeimg.com/${randomAspect()}/any${randomFilter()}`,
                sizing: "cover"
              };
            })
          }
        ];

      for(let i = 0; i < 3; i++){
        let thread = {
          id: `thread-${i}`,
          comments: []
        };
        for(let j = 0; j < 1 + Math.floor(Math.random() * 4); j++){
          let c = randomItem(students),
            s = randomItem(students.filter(f=>f !== c));
            thread.comments.push({
            id: `thread-${i}-comment-${j}`,
            commenterId: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
            image: c.image,
            date: randomDate(),
            replyTo: thread.comments.length > 0 ? thread.comments[0].id : undefined,
            student: s.firstName,
            studentId: s.id,
            body: `${loremIpsum(1,8,sentences).join(', ')}.`,
            read: Math.random() < 0.5
          });
        }
        threadedComments.push(thread);
      }
      assignments.forEach(a => {
        let topic = randomTopic();
        students.forEach(s => {
          ctr++;
          submissions.push({
            id: `submission-${ctr}`,
            date: randomDate(),
            assignmentId: a.id,
            assignment: a.assignment,
            projectId: a.projectId,
            project: a.project,
            image: `http://placeimg.com/${randomAspect()}/${topic}${randomFilter()}`,
            gravity: randomGravity(),
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
        submissionView: submissionView,
        threads: threadedComments
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
