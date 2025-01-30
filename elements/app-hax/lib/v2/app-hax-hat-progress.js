import { html, css } from "lit";
import { SimpleColors } from "@haxtheweb/simple-colors/simple-colors.js";
import { autorun, toJS } from "mobx";
import { store } from "./AppHaxStore.js";
import "@haxtheweb/promise-progress/promise-progress.js";

export class AppHaxHatProgress extends SimpleColors {
  static get tag() {
    return "app-hax-hat-progress";
  }

  constructor() {
    super();
    this.promises = [];
    this.max = 100;
    autorun(() => {
      this.promises = toJS(store.newSitePromiseList);
    });
    autorun(() => {
      this.dark = toJS(store.darkMode);
    });
  }

  static get properties() {
    return {
      ...super.properties,
      promises: { type: Array },
    };
  }

  process() {
    this.shadowRoot.querySelector("#progress2").process();
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.dispatchEvent(new CustomEvent("progress-ready", { detail: true }));

    setTimeout(() => {
      this.shadowRoot
        .querySelector("#progress2")
        .addEventListener("value-changed", (e) => {
          this.shadowRoot.querySelector("#value").textContent = e.detail.value;
        });
      this.shadowRoot
        .querySelector("#progress2")
        .addEventListener("max-changed", (e) => {
          this.max = e.detail.value;
        });
      this.shadowRoot
        .querySelector("#progress2")
        .addEventListener("promise-progress-finished", (e) => {
          if (e.detail.value) {
            // this will seem like magic... but our createSite
            // Promise has a special flag on the function that
            // saves the result in an object relative to our API broker
            // this way if we ask it for the last thing it created
            // the response is there even though we kicked it off previously
            // we more or less assume it completed bc the Promises all resolved
            // and it was our 1st Promise we asked to issue!

            // state clean up incase activated twice
            if (this.shadowRoot.querySelector(".game")) {
              this.shadowRoot.querySelector(".game").remove();
            }

            const createResponse = store.AppHaxAPI.lastResponse.createSite.data;
            const text = globalThis.document.createElement("button");
            this.shadowRoot.querySelector("#value").textContent = this.max;
            text.textContent = "Let's go!";
            text.classList.add("game");
            text.addEventListener("pointerdown", () => {
              store.appEl.playSound("click");
            });
            text.addEventListener("click", () => {
              store.appEl.reset();
              setTimeout(() => {
                globalThis.location = createResponse.slug.replace(
                  "index.html",
                  "",
                );
              }, 0);
            });
            this.shadowRoot
              .querySelector("#progress2")
              .parentNode.appendChild(text);
            // show you saying you got this!
            store.toast(
              `${createResponse.title ? createResponse.title : ""} ready!`,
              1500,
              {
                hat: "random",
              },
            );
            store.setPageTitle(
              `${createResponse.title ? createResponse.title : ""} ready!`,
            );
            setTimeout(() => {
              store.toast(`redirecting in 3..`, 10000, {
                hat: "random",
                walking: true,
              });
              store.setPageTitle("Redirecting in 3..");
              setTimeout(() => {
                store.toast(`redirecting in 2..`, 10000, {
                  hat: "random",
                  walking: true,
                });
                store.setPageTitle("Redirecting in 2..");
                setTimeout(() => {
                  store.toast(`redirecting in 1..`, 10000, {
                    hat: "random",
                    walking: true,
                  });
                  store.setPageTitle("Redirecting in 1..");
                  store.appEl.reset();
                  setTimeout(() => {
                    store.setPageTitle(`Enjoy!`);
                    globalThis.location = createResponse.slug.replace(
                      "index.html",
                      "",
                    );
                  }, 1000);
                }, 1000);
              }, 1000);
            }, 1800);
            this.dispatchEvent(
              new CustomEvent("promise-progress-finished", {
                composed: true,
                bubbles: true,
                cancelable: true,
                detail: true,
              }),
            );
          }
        });
    }, 0);
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          height: 400px;
          width: 400px;
        }
        img {
          width: 400px;
          height: 400px;
          pointer-events: none;
        }
        .progress {
          margin: -148px 0 0 10px;
          z-index: -1;
        }
        .progress::part(progress) {
          height: 100px;
          width: 338px;
          margin-top: -1px 0 0 -4px;
        }

        .progress::part(progress)::-moz-progress-bar {
          background-color: red;
          height: 50px;
          margin: 24px 0 0 0;
          border: none;
        }

        .count {
          color: var(--simple-colors-default-theme-grey-1, white);
          font-family: "Press Start 2P", sans-serif;
          width: 350px;
          text-align: center;
          position: relative;
          display: block;
          font-size: 30px;
          margin-top: -250px;
          margin-left: 30px;
        }
        .game {
          font-family: "Press Start 2P", sans-serif;
          font-size: 28px;
          font-weight: bold;
          text-align: center;
          width: 310px;
          background-color: var(--simple-colors-default-theme-red-7, red);
          color: var(--simple-colors-default-theme-grey-1, white);
          border: 0px;
          height: 54px;
          display: block;
          position: relative;
          margin: 138px 0px 0px 52px;
          padding: 0;
          box-sizing: border-box;
        }
        .game:focus,
        .game:hover {
          cursor: pointer;
          background-color: var(--simple-colors-default-theme-red-8);
          color: var(--simple-colors-default-theme-grey-2);
        }
        .game:active {
          cursor: progress;
          background-color: var(--simple-colors-default-theme-red-10);
          color: var(--simple-colors-default-theme-grey-5);
        }
      `,
    ];
  }

  render() {
    return html`
      <img
        src="${new URL("../assets/images/HatBlank.svg", import.meta.url).href}"
        alt=""
      />
      <promise-progress
        id="progress2"
        accent-color="red"
        ?dark="${this.dark}"
        class="progress"
        .list=${this.promises}
      ></promise-progress>
      <div class="count"><span id="value">0</span>%</div>
    `;
  }
}
customElements.define(AppHaxHatProgress.tag, AppHaxHatProgress);
