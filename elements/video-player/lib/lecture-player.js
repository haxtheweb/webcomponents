import { css, html, LitElement } from "lit";
import { DDDSuper } from "@lrnwebcomponents/d-d-d/d-d-d.js";
import {
  DDDDataAttributes,
  DDDPulseEffect,
} from "@lrnwebcomponents/d-d-d/lib/DDDStyles.js";
import "@lrnwebcomponents/video-player/video-player.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "@lrnwebcomponents/simple-cta/simple-cta.js";

class LecturePlayer extends DDDSuper(LitElement) {
  static get styles() {
    return [
      super.styles,
      DDDDataAttributes,
      DDDPulseEffect,
      css`
        :host {
          font-family: var(--ddd-font-primary, sans-serif);
        }

        @media (max-width: 1200px) {
          .videoSection {
            grid-template-columns: 1fr;
          }
        }
        lecture-player {
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.associatedNodes = new Object();
    this.videoPlayer = this.querySelector("video-player").outerHTML;
    window.addEventListener("DOMContentLoaded", () => {
      const flags = this.querySelectorAll("lecture-anchor");
      flags.forEach((flag) => {
        console.log(flag.associatedID);
        this.associatedNodes[flag.value] = flag.associatedID;
      });
      console.log(this.associatedNodes);
      for (const [key, value] of Object.entries(this.associatedNodes)) {
        console.log(`${key}: ${value}`);
      }
    });
    this.videoInterval = null;
    this.activeIndex = null;
  }

  static get properties() {
    return {
      activeIndex: { type: String, reflect: true },
      source: { type: String, reflect: true },
      associatedNodes: { type: Object, reflect: true },
      open: { type: Boolean, reflect: true },
    };
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (
        propName === "activeIndex" &&
        oldValue !== this.activeIndex &&
        this.activeIndex
      ) {
        if (!document.querySelector("video-player").playing) {
          this.play;
        }
        console.log("activeIndex changed to: ", this.activeIndex);
        console.log(document.querySelector("#" + this.activeIndex));
        this.seek(this.querySelector("#" + this.activeIndex).value);
        this.updateJumbotron();
        this.updatePlaylist();
        this.checkDisabledButtons();
      }
    });
  }

  scan() {
    const lectureAnchors = this.querySelectorAll("lecture-anchor");
    console.log(lectureAnchors);
    const anchorsArray = Array.from(lectureAnchors);
    anchorsArray.sort((a, b) => {
      const timeA = parseInt(a.getAttribute("value"), 10);
      const timeB = parseInt(b.getAttribute("value"), 10);
      return timeA - timeB;
    });
    anchorsArray.forEach((anchor, index) => {
      anchor.id = `slide-${index + 1}`;
      anchor.addEventListener("click", () => {
        this.activeIndex = anchor.id;
        this.seek(anchor.value);
        console.log(anchor.value);
      });
    });
    this.setJumbotronAttributes();
  }

  setJumbotronAttributes() {
    console.log("setJumbotronAttributes");
    this.querySelectorAll("lecture-anchor").forEach((anchor) => {
      let header = this.querySelector(
        `#${anchor.getAttribute("associatedID")}`,
      );
      anchor.setAttribute("jumbotronHeading", header.textContent);
      anchor.setAttribute("jumbotronContent", this.getNextSiblingHTML(header));
      // Scrub the ids from the lecture-anchor elements in the content
      let contentElement = document.createElement("div");
      contentElement.innerHTML = anchor.getAttribute("jumbotronContent");
      contentElement.querySelectorAll("lecture-anchor").forEach((el) => {
        el.removeAttribute("id");
        el.classList.add("no-pointer-events");
      });
      anchor.setAttribute("jumbotronContent", contentElement.innerHTML);
    });
    this.addPrevNextListeners();
    this.updatePlaylist();
  }

  getNextSiblingHTML(element) {
    let siblingHTML = "";
    let nextSibling = element.nextSibling;
    let stopIDs = Object.values(this.associatedNodes);

    while (nextSibling) {
      if (nextSibling.id && stopIDs.includes(nextSibling.id)) {
        break;
      }

      siblingHTML += nextSibling.outerHTML || "";
      nextSibling = nextSibling.nextSibling;
    }

    return siblingHTML;
  }

  addPrevNextListeners() {
    console.log("addPrevNextListeners");
    const prevSlideBtn = document.querySelector("#prevSlideBtn");
    const nextSlideBtn = document.querySelector("#nextSlideBtn");
    if (!this.activeIndex) {
      this.activeIndex = "slide-1";
    }
    prevSlideBtn.addEventListener("click", () => {
      const prevSlide =
        this.activeIndex.split("-")[1] > 1
          ? this.activeIndex.split("-")[1] - 1
          : null;
      if (prevSlide) {
        this.activeIndex = "slide-" + prevSlide;
      }
    });
    nextSlideBtn.addEventListener("click", () => {
      const anchorsWithId =
        document.querySelectorAll("lecture-anchor[id]").length;
      console.log(anchorsWithId);
      console.log(this.activeIndex.split("-")[1]);
      console.log(parseInt(this.activeIndex.split("-")[1]) + 1);
      console.log(parseInt(this.activeIndex.split("-")[1]) + 1 < anchorsWithId);
      const nextSlide =
        this.activeIndex.split("-")[1] < anchorsWithId
          ? parseInt(this.activeIndex.split("-")[1]) + 1
          : null;
      if (nextSlide) {
        this.activeIndex = "slide-" + nextSlide;
      } else {
        this.endVideo();
      }
    });
  }

  updateJumbotron() {
    console.log("updateJumbotron");
    const jumbotron = document.querySelector(".jumbotron");
    console.log(jumbotron);
    jumbotron.innerHTML = "";
    const activeAnchor = document.querySelector(`#${this.activeIndex}`);
    console.log(activeAnchor);
    if (activeAnchor) {
      const jumbotronHeading = document.createElement("h2");
      jumbotronHeading.id = "jumbotron-heading";
      jumbotronHeading.innerText =
        activeAnchor.getAttribute("jumbotronHeading");
      jumbotron.appendChild(jumbotronHeading);
      const jumbotronContent = document.createElement("div");
      jumbotronContent.id = "jumbotron-desc";
      jumbotronContent.innerHTML =
        activeAnchor.getAttribute("jumbotronContent");
      jumbotron.appendChild(jumbotronContent);
    }
  }

  updatePlaylist() {
    console.log("updatePlaylist");
    const valueList = document.querySelector(".valueList");
    valueList.innerHTML = "";
    const listOfAnchorElements = this.getSortedAnchors();
    listOfAnchorElements.forEach((anchor) => {
      const valueBtn = document.createElement("button");
      valueBtn.classList.add("valueBtn");
      valueBtn.innerText = anchor.getAttribute("jumbotronHeading");
      valueBtn.setAttribute("value", anchor.value);
      valueBtn.addEventListener("click", () => {
        this.activeIndex = anchor.id;
        this.seek(document.querySelector(`#${this.activeIndex}`).value);
      });
      if (anchor.id === this.activeIndex) {
        valueBtn.classList.add("active");
      }
      valueList.appendChild(valueBtn);
    });
    document.querySelector(".valueList").scrollTo({
      left: document.querySelector(".valueBtn.active").offsetLeft - 125,
      behavior: "smooth",
    });
  }

  getSortedAnchors() {
    // Returns an array of all the lecture-anchor elements sorted by value, to assing their IDs in order
    // May need to support the option for sorting by how the tags appear in the content order
    let anchors = [];
    let i = 1;
    let anchor = document.querySelector(`#slide-${i}`);
    while (anchor) {
      anchors.push(anchor);
      i++;
      anchor = document.querySelector(`#slide-${i}`);
    }
    return anchors;
  }

  seek(timestamp) {
    let lectureVideo = document.querySelector("#lecture-player-video");
    if (lectureVideo) {
      if (lectureVideo.hasAttribute("element-visible")) {
        document
          .querySelector("#lecture-player-video")
          .shadowRoot.querySelector("a11y-media-player")
          .play();
        document
          .querySelector("#lecture-player-video")
          .shadowRoot.querySelector("a11y-media-player")
          .seek(timestamp);
      } else {
        setTimeout(() => {
          document
            .querySelector("#lecture-player-video")
            .shadowRoot.querySelector("a11y-media-player")
            .play();
          document
            .querySelector("#lecture-player-video")
            .shadowRoot.querySelector("a11y-media-player")
            .seek(timestamp);
        }, 1000);
      }
    } else {
      this.querySelector("video-player")
        .shadowRoot.querySelector("a11y-media-player")
        .play();
      this.querySelector("video-player")
        .shadowRoot.querySelector("a11y-media-player")
        .seek(timestamp);
    }
  }

  play() {
    console.log(
      document
        .querySelector("video-player")
        .shadowRoot.querySelector("a11y-media-player"),
    );
    if (
      document
        .querySelector("video-player")
        .shadowRoot.querySelector("a11y-media-player")
    ) {
      document
        .querySelector("video-player")
        .shadowRoot.querySelector("a11y-media-player")
        .play();
    } else {
      this.querySelector("video-player")
        .shadowRoot.querySelector("a11y-media-player")
        .play();
    }
  }

  checkDisabledButtons() {
    console.log("checkDisabledButtons");
    const prevSlideBtn = document.querySelector("#prevSlideBtn");
    const activeIndex = parseInt(this.activeIndex.split("-")[1]);
    if (activeIndex === 1) {
      prevSlideBtn.setAttribute("disabled", "true");
    } else {
      prevSlideBtn.removeAttribute("disabled");
    }
    if (activeIndex !== document.querySelectorAll("lecture-anchor").length) {
      document.querySelector("#nextSlideBtn").removeAttribute("disabled");
    }
  }

  endVideo() {
    console.log("endVideo");
    document
      .querySelector("#lecture-player-video")
      .shadowRoot.querySelector("a11y-media-player")
      .pause();
    document.querySelector("#nextSlideBtn").setAttribute("disabled", "true");
    let endBtnDiv = document.createElement("div");
    endBtnDiv.setAttribute("data-primary", "11");
    endBtnDiv.innerHTML = `<simple-cta class="endBtn" data-pulse data-primary="11">Close Lecture Player</simple-cta>`;
    endBtnDiv.classList.add("endBtnContainer");
    document.querySelector(".jumbotron").appendChild(endBtnDiv);
    document.querySelector(".endBtn").addEventListener("click", () => {
      document.querySelector("simple-modal").close();
      this.open = false;
    });
    let jumbotron = document.querySelector(".jumbotron");
    jumbotron.scrollTop = jumbotron.scrollHeight + 500;
  }

  showModal(event) {
    let videoSectionColumns = "1fr 1fr";
    console.log("showModal");
    let c = document.createElement("div");
    c.classList.add("modal-content");
    c.innerHTML = `
    <style>
      simple-modal{
        --simple-modal-width: 95%;
        --simple-modal-height: 95%;
        font-family: var(--ddd-font-primary, sans-serif);
      }

      .modal-content{
        display: grid;
        grid-template-rows: 1.5fr auto;
        height: fit-content;
        gap: var(--ddd-spacing-6);
        padding: var(--ddd-spacing-4);
      }

      video-player{
        max-width: 100%;
        max-height: 100%;
      }

      .videoSection{
        display: grid;
        grid-template-columns: 1fr 1fr;
        max-width: 100%;
        height: 100%;
        gap: var(--ddd-spacing-4);
        max-height: 68vh;
      }

      .videoSection.small{
        grid-template-columns: .7fr 1.3fr;
      }

      .videoSection.large{
        grid-template-columns: 1.3fr .7fr;
        height: 100%;
        max-height: none;
      }

      .playlist{
        display: grid;
        grid-template-columns: .5fr 5fr .5fr;
        gap: var(--ddd-spacing-2);
        max-width: 100%;
        height: fit-content;
      }

      .overflow-ellipsis{
        max-width: 200px;
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        word-wrap: break-word;
        word-break: break-word;
      }

      .valueList {
        display: flex; /* Use flexbox to layout items in a row */
        flex-wrap: nowrap; /* Prevent wrapping of items */
        border: var(--ddd-border-xs);
        border-color: var(--ddd-theme-default-coalyGray, black);
        background: #bab8b8;
        overflow-x: auto; /* Enable horizontal scrolling */
        overflow-y: hidden; /* Hide vertical overflow */
      }
      
      .valueBtn {
        flex-shrink: 0; /* Prevent buttons from shrinking */
        background: white;
        border: none;
        border-right: 1px solid black; /* Keep the border-right */
        cursor: pointer;
        font-size: 24px;
        padding: 16px; /* Add padding to space out the buttons */
        height: 75px;
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: var(--ddd-font-primary, sans-serif);
      }

      .valueBtn:not(:last-child){
        border-right: 1px solid black;
      }

      .jumbotron{
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
        height: 100%;
        overflow-y: auto;
        overflow-x: show;
      }

      #jumbotron-heading{
        padding: 8px;
        width: calc(100% - 16px);
        margin: 8px 0;
      }

      #jumbotron-desc{
        padding: 8px;
        width: calc(100% - 32px);
      }

      .value-navigation-button{
        background: white;
        cursor: pointer;
        padding: 4px;
        height: fit-content;
        margin: auto;
      }
      
      .valueBtn.active{
        background: #dfedf5;
      }

      .endBtnContainer{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin: 64px auto;
      }

      .lecture-control.active, .lecture-control:focus, .lecture-control:hover, .lecture-control:active{
        color: var(--ddd-theme-default-beaverBlue, black);
      }

      .no-pointer-events{
        pointer-events: none;
      }
      .lecture-mode-controls {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--ddd-spacing-3);
        padding: var(--ddd-spacing-2);
        top: var(--ddd-spacing-2);
        right: var(--ddd-spacing-20);
      }
      .lecture-mode-controls simple-icon-button-lite {
        cursor: pointer;
        --simple-icon-height: var(--ddd-icon-xs);
        --simple-icon-width: var(--ddd-icon-xs);
      }
      @media (max-width: 1200px) {
        .videoSection {
          display: flex;
          flex-direction: column;
        }
      }
    </style>
      <div class="videoSection normal">
          ${this.videoPlayer}
        <div class="jumbotron"></div>
        <div class="lecture-mode-controls">
        <simple-icon-button-lite class="lecture-control" id="lecture-size-small" icon="image:photo-size-select-large"></simple-icon-button-lite>
        <simple-icon-button-lite class="lecture-control" id="lecture-size-normal" icon="image:switch-video"></simple-icon-button-lite>
        <simple-icon-button-lite class="lecture-control" id="lecture-size-large" icon="image:photo-size-select-actual"></simple-icon-button-lite>
      </div>
      </div>
      <div class="playlist">
        <button class="value-navigation-button" id="prevSlideBtn"><simple-icon-lite icon="lrn:arrow-left"></simple-icon-lite></button>
        <div class="valueList">
        </div>
        <button class="value-navigation-button" id="nextSlideBtn"><simple-icon-lite icon="lrn:arrow-right"></simple-icon-lite></button>
      </div>
    `;
    this.querySelector("video-player").setAttribute("hidden", true);
    const evnt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        elements: { content: c },
      },
    });
    this.open = true;
    dispatchEvent(evnt);
    document
      .querySelector("#lecture-size-large")
      .addEventListener("click", (e) => {
        document.querySelectorAll(".lecture-control").forEach((control) => {
          control.classList.remove("active");
        });
        e.target.classList.toggle("active");
        document.querySelector(".videoSection").classList.add("large");
        document.querySelector(".videoSection").classList.remove("small");
        document.querySelector(".videoSection").classList.remove("normal");
      });
    document
      .querySelector("#lecture-size-normal")
      .addEventListener("click", (e) => {
        document.querySelectorAll(".lecture-control").forEach((control) => {
          control.classList.remove("active");
        });
        e.target.classList.toggle("active");
        document.querySelector(".videoSection").classList.add("normal");
        document.querySelector(".videoSection").classList.remove("small");
        document.querySelector(".videoSection").classList.remove("large");
      });
    document
      .querySelector("#lecture-size-small")
      .addEventListener("click", (e) => {
        document.querySelectorAll(".lecture-control").forEach((control) => {
          control.classList.remove("active");
        });
        e.target.classList.toggle("active");
        document.querySelector(".videoSection").classList.add("small");
        document.querySelector(".videoSection").classList.remove("normal");
        document.querySelector(".videoSection").classList.remove("large");
      });
    document
      .querySelector("simple-modal .modal-content .videoSection video-player")
      .setAttribute("id", "lecture-player-video");
    this.scan();
    window.addEventListener("simple-modal-closed", () => {
      this.querySelector("video-player").removeAttribute("hidden");
      this.open = false;
    });
  }

  render() {
    return html`
      <simple-cta id="lectureActivation" @click="${this.showModal}"
        >Open Lecture Player</simple-cta
      >
      ${!this.open ? html`<slot></slot>` : html``}
    `;
  }
}

window.customElements.define("lecture-player", LecturePlayer);
