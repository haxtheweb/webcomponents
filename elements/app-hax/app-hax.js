import { LitElement, css, html } from 'lit';
import { localStorageSet, localStorageGet } from '@lrnwebcomponents/utils/utils.js';
import { toJS, autorun } from 'mobx';
import { store } from '../lib/v1/AppHaxStore.js';
import { AppHaxAPI } from '../lib/v1/AppHaxBackendAPI.js';
import "../lib/v1/AppHaxRouter.js";
import '../lib/v1/app-hax-steps.js';
import '../lib/v1/app-hax-label.js';
import '../lib/v1/app-hax-top-bar.js';
import '../lib/v1/app-hax-site-button.js';


const haxLogo = new URL('../lib/assets/images/HAXLogo.svg', import.meta.url).href;
// toggle store darkmode
function darkToggle(e) {
  if (e.matches) {
    // dark mode
    store.darkMode = true;
  } else {
    // light mode
    store.darkMode = false;
  }
}

export class AppHax extends LitElement {
  static get tag() {
    return 'app-hax';
  }

  // eslint-disable-next-line class-methods-use-this
  playSound(sound) {
    if (store.soundStatus) {
      try {
        switch (sound) {
          case 'click':
          case 'click2':
          case 'coin':
          case 'coin2':
          case 'hit':
          case 'success':
            this.audio = new Audio(
              new URL(`../lib/assets/sounds/${sound}.mp3`, import.meta.url).href
            );
            this.audio.play();
            break;
          default:
            this.audio = new Audio(
              new URL(`../lib/assets/sounds/hit.mp3`, import.meta.url).href
            );
            this.audio.play();
            console.warn(`${sound} is not a valid sound file yet`);
            break;
        }
      }
      catch(e) {
        console.warn(e);
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', darkToggle);
  }

  disconnectedCallback() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .removeEventListener('change', darkToggle);
    super.disconnectedCallback();
  }

  constructor() {
    super();
    this.userMenuOpen = false;
    this.courses = [];
    this.activeItem = {};
    this.phrases = {
      new: ["What's ya name?", 'HAX to the moon', 'Welcome to the Jungle', 'We like to party', 'Build something awesome', 'Everything is awesome!', 'Everything is cool when you\'re part of the team', 'When you\'re living our dream'],
      return: ['Welcome back, take 2?', "That wasn't very long", 'Sup?', 'You again? Awesome!', 'Let\'s do this', 'There can only be one ring...', 'There is another', 'Fancy that, I love HAX and you show up'],
    };
    this.isNewUser = null;
    this.routes = [
      {
        path: 'createSite-step-1',
        component: 'fake',
        step: 1,
        id: 'step-1',
        label: 'Welcome',
        statement: "Let's start a new journey!",
      },
      {
        path: 'createSite-step-2',
        component: 'fake',
        step: 2,
        id: 'step-2',
        label: 'Pick type',
        statement: 'What type of journey is this?',
      },
      {
        path: 'createSite-step-3',
        component: 'fake',
        step: 3,
        id: 'step-3',
        label: 'Theme Select',
        statement: "What's it look like?",
      },
      {
        path: 'createSite-step-4',
        component: 'fake',
        step: 4,
        id: 'step-4',
        label: 'Name',
        statement: "Name this journey",
      },
      {
        path: 'createSite-step-5',
        component: 'fake',
        step: 5,
        id: 'step-5',
        label: 'Loading',
        statement: "Get ready for your journey",
      },
      {
        path: '/',
        component: 'fake', 
        name: 'home', 
        label: 'Welcome back',
        statement: "Let's explore HAX land",
      },
      {
        path: '/search',
        component: 'fake-search-e', 
        name: 'search', 
        label: 'Search',
        statement: "Discover active adventures",
      },
      { 
        path: '/(.*)', 
        component: 'fake', 
        name: '404', 
        label: '404 :[',
        statement: "it's not you.. it's me",
      },
    ];
    this.searchTerm = '';
    this.appMode = '';
    this.soundIcon = '';
    // full on store that does the heavy lifting
    this.store = store;
    // source for reading in the store if different than default site.json
    this.source = '';
    // centralized sound source to not flood sounds when playing
    this.sound = new Audio();
    this.source = new URL('../demo/sites.json', import.meta.url).href;
    // @todo need this from app deploy itself
    import('@lrnwebcomponents/simple-modal/simple-modal.js');
    autorun(() => {
      this.isNewUser = toJS(store.isNewUser);
      if (this.isNewUser && this.appMode !== 'create') {
        this.appMode = "create";
        setTimeout(() => {
          store.createSiteSteps = true;            
        }, 0);
      }
    });
    autorun(() => {
      this.userName = toJS(store.user.name);
    });
    autorun(() => {
      this.searchTerm = toJS(store.searchTerm);
    });
   
    
    /**
     * When location changes update activeItem / mode of app
     */
    autorun(async () => {
      if (store.location && store.location.route) {
        // get the id from the router
        const location = toJS(store.location);
        // verify this is a step vs other operations
        if (!location.route.step) {
          if (location.route.name === "404") {
            store.createSiteSteps = false;
            this.appMode = "404"
            setTimeout(() => {
              store.toast('the page miss.. it burns!!!', 3000, {fire: true, walking: true});              
            }, 500);
          }
          else if (location.route.name === "home" || location.route.name === "search") {
            // store.manifest = await AppHaxAPI.makeCall('getSitesList');
            this.appMode = "home"
          }
          else {
            console.warn(location.route);
          }
        }
        else {
          this.appMode = "create";
          setTimeout(() => {
            store.createSiteSteps = true;            
          }, 0);
        }
      }
    });
    // AutoRun block to detect to detect if site.structure is null but step == 3, set step to 2.
    autorun(() => {
      if (store.routes.length > 0 && store.location === null) {
        store.location = toJS(store.routes[0]);
      }
    });
    // manage dark mode
    // only set this initially if we don't have an app state of our own
    if (localStorageGet('app-hax-darkMode', null) === null) {
      store.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    autorun(() => {
      localStorageSet('app-hax-darkMode', toJS(store.darkMode));
      if (toJS(store.darkMode)) {
        document.body.classList.add('dark-mode');
        store.toast("I'm ascared of the dark", 2000, { fire: true});
      } else {
        document.body.classList.remove('dark-mode');
        store.toast("Sunny day it is", 2000, { hat: 'random'});
      }
    });
    autorun(() => {
      const mode = toJS(store.appMode);
      if (mode) {
        document.body.classList.remove('app-hax-search');
        document.body.classList.remove('app-hax-create');
        document.body.classList.remove('app-hax-404');
        document.body.classList.remove('app-hax-home');
        document.body.classList.add(`app-hax-${mode}`);
      }
    });

    // App is ready and the user is Logged in
    autorun(() => {
      if (toJS(store.appReady) && toJS(store.isLoggedIn)){
        console.log("I am ready to get sites list");
        // Need this for the auto run when testing new user
        const appSettings = toJS(store.appSettings);  
        setTimeout(async() => {
           // if we get new data source, trigger a rebuild of the site list
          const results = await AppHaxAPI.makeCall('getSitesList');
          store.manifest = results;
          console.log(`Manifest Length: ${store.manifest.items.length}`);
          }, 0);
      } else if (toJS(store.appReady) && !toJS(store.isLoggedIn)){
        setTimeout(() => {
          console.log("We in App-Hax - Running Log in")
          this.login();
        }, 0);
      }
    })
  }

  static get properties() {
    return {
      courses: { type: Array },
      source: { type: String },
      userName: { type: String },
      activeItem: { type: Object },
      soundIcon: { type: String },
      routes: { type: Array },
      searchTerm: { type: String },
      appMode: { type: String }, // minor context of what we're doing in the app for rendering
      isNewUser: { type: Boolean },
      phrases: { type: Object },
      userMenuOpen: { type: Boolean },
    };
  }

  // eslint-disable-next-line class-methods-use-this
  getData() {
    fetch(this.source)
      .then(response => response.json())
      .then(data => {
        this.courses = [];
        data.items.forEach(item => {
          const courseInfo = {
            title: item.title,
            description: item.description,
            link: toJS(store.sitesBase).concat(item.slug),
            icon: item.metadata.theme.variables
              ? item.metadata.theme.variables.icon
              : '',
          };
          this.courses.push(courseInfo);
        });
      });
  }

  // eslint-disable-next-line class-methods-use-this
  reset(reload = true) {
    // localStorage possible to be blocked by permission of system
    try {
      window.localStorage.removeItem('app-hax-step');
      window.localStorage.removeItem('app-hax-darkMode');
      window.localStorage.removeItem('app-hax-soundStatus');
      window.localStorage.removeItem('app-hax-site');
      if (reload) {
        console.log(document.querySelector('base').href);
        window.location = document.querySelector('base').href;
      }
    }
    catch(e) {
      console.warn(e);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  login() {
    console.log("Login Function in App-HAX ran");
    import('../lib/v1/app-hax-site-login.js').then(() => {
      const p = document.createElement('app-hax-site-login');
      if (this.querySelector('[slot="externalproviders"]')) {
        const cloneSlot = this.querySelector('[slot="externalproviders"]').cloneNode(true);
        p.appendChild(cloneSlot);
      }
      const evt = new CustomEvent('simple-modal-show', {
        bubbles: true,
        cancelable: true,
        detail: {
          title: 'Character select',
          modal: true,
          elements: { content: p },
          modal: true,
          invokedBy: this,
          styles: {
            "--simple-modal-titlebar-background": "orange",
            "--simple-modal-titlebar-color": "black",
            "--simple-modal-width": "25vw",
            "--simple-modal-min-width": "300px",
            "--simple-modal-z-index": "100000000",
            "--simple-modal-height": "40vh",
            "--simple-modal-min-height": "400px",
            "--simple-modal-titlebar-height": "40px",
          },
        },
      });

      this.dispatchEvent(evt);
    });
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        .topbar-character {
          transform: scale(0.4, 0.4);
          margin: -36px -35px 0px 0px;
          vertical-align: text-top;
          position: fixed;
          top: 0px;
          right: 0px;
          overflow: hidden;
          height: 120px;
          cursor: pointer;
        }
        .content {
          text-align: center;
          margin-top: 32px;
        }
        .four04-character {
          margin-top: 100px;
          transform: scale(2);
        }
        .start-journey {
          display: flex;
          justify-content: center;
        }
        app-hax-top-bar {
          top: 0;
          z-index: 1000;
          right: 0;
          left: 0;
          position: fixed;
        }
        .label {
          text-align: center;
          margin-top: 48px;
        }
        app-hax-label {
          animation: .8s ease-in-out 0s scrollin;
          -webkit-animation: .8s ease-in-out 0s scrollin;
          display: block;
        }
        @media (prefers-reduced-motion: reduce) {
          app-hax-label {
            animation: none;
            -webkit-animation: none;
          }
        }
        app-hax-label h1 {
          font-weight: normal;
          font-size: 4vw;
          margin: 0;
          padding: 0;
        }
        @keyframes scrollin {
          from {
            margin-top: -240px;
            margin-bottom: 240px;
          }
          to {
            margin-top: 0;
            margin-bottom: 0;
          }
        }
        .haxLogo {
          height: 40px;
          width: 40px;
          background-color: white;
          margin: 4px;
        }
        .space-hack {
          display: inline-flex;
          width: 64px;
          height: 48px;
        }
        .soundToggle {
          margin-right: 16px;
          position: relative;
          display: inline-flex;
          vertical-align: top;
        }
        .soundToggle img {
          width: 24px;
          height: 24px;
        }
        app-hax-search-bar {
          vertical-align: middle;
          display: inline-flex;
        }
        main {
          margin-top: 64px;
        }
        .user-menu {
          display:none;
        }
        .user-menu.open {
          display: block;
          top: 48px;
          right: 0px;
          position: absolute;
          border: 1px solid black;
          background-color: white;
        }
        .user-menu.open button {
          display: block;
          width: 100%;
          margin: 0;
          padding: 8px;
          font-size: 20px;
          font-family: 'Press Start 2P', sans-serif;
          color: black;
          background-color: white;
        }
        .user-menu.open button:hover,
        .user-menu.open button:active,
        .user-menu.open button:focus {
          background-color: black;
          color: white;
        }
        random-word {
          transform: rotate(25deg);
          position: absolute;
          right: 10px;
          top: 120px;
          padding: 12px;
          font-size: 12px;
          border: 4px solid black;
          background-color: yellow;
          color: black;
          width: 100px;
          word-wrap: break-word;
          text-align: center;
          cursor: pointer;
          user-select: none;
          opacity: 1;
          visibility: visible;
          transition: all .3s ease-in-out;
        }
        @media (max-width: 680px) {
          random-word {
            visibility: none;
            opacity: 0;
          }
        }
      `,
    ];
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    // update the store for step when it changes internal to our step flow
    changedProperties.forEach((oldValue, propName) => {
      if (['routes', 'appMode'].includes(propName)) {
        store[propName] = this[propName];
      }
    });
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    import('wired-elements/lib/wired-button.js');
    import('../lib/v1/app-hax-toast.js');
    import('../lib/v1/app-hax-wired-toggle.js');
    import('../lib/v1/app-hax-search-bar.js');
    import('../lib/v1/app-hax-search-results.js');
    import('@lrnwebcomponents/rpg-character/rpg-character.js');
    import('../lib/random-word/random-word.js');
    this.dispatchEvent(new CustomEvent('app-hax-loaded', {composed: true, bubbles: true, cancelable: false, detail: true}));
    store.appReady = true;
    autorun(() => {
      if (toJS(store.appReady)) {
        document.body.classList.add('app-loaded');
      } else {
        document.body.classList.remove('app-loaded');
      }
    });
    
    // play sound when we animate the banner in
    this.shadowRoot.querySelector('app-hax-label').addEventListener("animationend", (e) => {
      if (e.animationName === "scrollin") {
        store.appEl.playSound('coin2');
      }
    });
    store.appEl = this;
    autorun(() => {
      if (store.activeItem) {
        this.activeItem = toJS(store.activeItem);
      }
    });
    autorun(() => {
      this.soundIcon = toJS(store.soundStatus) ? new URL('../lib/assets/images/FullVolume.svg',import.meta.url).href : new URL('../lib/assets/images/Silence.svg',import.meta.url).href;
      if (!toJS(store.soundStatus)) {
        store.toast("Sound off.. hey.. HELLO!?!", 2000, { fire: true});
      }
      else {
        store.toast("Can you hear me now? Good.", 2000,{ hat: 'random'});
      }
    });
  }

  soundToggle(e) {
    store.soundStatus = !toJS(store.soundStatus);
    localStorageSet('app-hax-soundStatus', toJS(store.soundStatus));
  }
  toggleMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  render() {
    return html`<app-hax-router></app-hax-router>
    <header>
      <app-hax-top-bar>
        <img class="haxLogo" src="${haxLogo}" slot="left"  alt="" loading="lazy" decoding="async" />
        <app-hax-search-bar slot="center" ?disabled="${this.isNewUser}"></app-hax-search-bar>
        <wired-button
          elevation="1"
          slot="right"
          class="soundToggle"
          @click="${this.soundToggle}"
        >
        <img src="${this.soundIcon}" alt="" loading="lazy" decoding="async" />
      </wired-button>
        <app-hax-wired-toggle slot="right"></app-hax-wired-toggle>
        <div class="space-hack" slot="right"></div>
        <rpg-character
          class="topbar-character"
          seed="${this.userName}"
          slot="right"
          @click="${this.toggleMenu}"
        ></rpg-character>
        <div slot="right" class="user-menu ${this.userMenuOpen ? 'open' : ''}">
          <button>Site settings</button>
          <button>Site outline</button>
          <button>New Journey</button>
          <button>Account info</button>
          <button>log out</button>
        </div>
      </app-hax-top-bar>
    </header>
    <main>
      <div class="label">
        <app-hax-label>
        ${this.activeItem ? html`
        <h1>${this.activeItem.label}</h1>
          <div slot="subtitle">${this.activeItem.statement}</div>
        ` : ``}
          
          </app-hax-label>
      </div>
      <random-word
        key="${this.isNewUser ? `new` : `return`}"
        .phrases="${this.phrases}"
        @click="${this.getNewWord}"
      ></random-word>
      <section class="content">
        ${this.appBody(this.appMode)}
      </section>
    </main>`;
  }

  getNewWord() {
    this.shadowRoot.querySelector('random-word').getNewWord();
  }

  appBody(routine) {
    switch(routine) {
      case 'home':
      case 'search':
          return this.templateHome();
      break;
      case 'create':
        return this.templateCreate();
      break;
      case '404':
      default:
        return this.template404();
      break;
    }
  }

  templateHome() {
    return html`
      ${!this.searchTerm ? html`
      <div class="start-journey">
        <a href="createSite-step-1" @click="${this.startJourney}" tabindex="-1">
        <app-hax-site-button
          label="> Start new journey"
        ></app-hax-site-button>
        </a>
      </div>`: ``}
      
      <app-hax-search-results></app-hax-search-results>`;
  }
  
  // eslint-disable-next-line class-methods-use-this
  templateCreate() {
    return html`<app-hax-steps></app-hax-steps>`;
  }

  template404() {
    return html`
    <div class="four04">
      <a href="createSite-step-1" class="start-journey" @click="${this.startJourney}" tabindex="-1">
      <app-hax-site-button
        label="> Start a new journey"
      ></app-hax-site-button>
      </a>
      <rpg-character
          class="four04-character"
          fire
          walking
          seed="${this.userName}"
        ></rpg-character>
    </div>`;
  }

  startJourney(e) {
    store.step = 1;
    this.appMode = "create"; 
  }
}
customElements.define(AppHax.tag, AppHax);

window.AppHax = window.AppHax || {};

window.AppHax.requestAvailability = () => {
  if (!window.AppHax.instance) {
    window.AppHax.instance = document.querySelector(AppHax.tag);
  }
  return window.AppHax.instance;
};