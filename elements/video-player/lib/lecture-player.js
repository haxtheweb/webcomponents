import { css, html, LitElement } from "lit";
import { DDDSuper } from '@lrnwebcomponents/d-d-d/d-d-d.js';
import { DDDDataAttributes } from '@lrnwebcomponents/d-d-d/lib/DDDStyles.js';
import "@lrnwebcomponents/video-player/video-player.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";

class LecturePlayer extends DDDSuper(LitElement) {
  static get styles() {
    return [
      super.styles,
      DDDDataAttributes,
      css`
      :host{
        font-family: var(--ddd-font-primary, sans-serif);
      }

      simple-modal{
        --simple-modal-width: 95%;
        --simple-modal-height: 95%;
        font-family: var(--ddd-font-primary, sans-serif);
      }

      .modal-content{
        display: grid;
        grid-template-columns: 1.5fr 1fr;
        width: calc(100% - 32px);
        height: 100%;
        gap: var(--ddd-spacing-4);
      }

      video-player{
        max-width: 100%;
        max-height: 100%;
      }

      .videoSection{
        display: grid;
        grid-template-rows: 1fr auto;
        max-width: 100%;
        max-height: 80vh;
      }

      .playlist{
        display: grid;
        grid-template-columns: .5fr 5fr .5fr;
        gap: var(--ddd-spacing-2);
        max-width: 100%;
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

      .timestampList {
        display: flex; /* Use flexbox to layout items in a row */
        flex-wrap: nowrap; /* Prevent wrapping of items */
        border: var(--ddd-border-xs);
        border-color: var(--ddd-theme-default-coalyGray, black);
        background: #bab8b8;
        overflow-x: auto; /* Enable horizontal scrolling */
        overflow-y: hidden; /* Hide vertical overflow */
      }
      
      .timestampBtn {
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

      .timestampBtn:not(:last-child){
        border-right: 1px solid black;
      }

      .jumbotron{
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: start;
      }

      #jumbotron-desc{
        padding: 8px;
        width: 100%;
      }

      .timestamp-navigation-button{
        background: white;
        cursor: pointer;
        padding: 4px;
        height: fit-content;
        margin: auto;
      }
      
      .timestampBtn.active{
        background: #dfedf5;
      }

      .endBtnContainer{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin: auto;
      }

      .endBtn{
        font-family: var(--ddd-font-primary, sans-serif);
        font-size: var(--ddd-theme-body-font-size, 16px);
        background: var(--ddd-theme-primary);
        color: var(--ddd-theme-bgContrast, black);
        cursor: pointer;
        padding: var(--ddd-spacing-4);
        height: fit-content;
        margin: auto;
        border-radius: var(--ddd-radius-sm);
        box-shadow: none;
        animation: pulse 1.2s ease infinite;
      }

      .endBtn:hover{
        animation: none;
      }

      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(188, 32, 75, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(188, 32, 75, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(188, 32, 75, 0);
        }
      }


      @media (max-width: 1200px) {
        :host{
          grid-template-columns: 1fr;
        }
      }
    `]
  }
  
  constructor() {
    super();
    //implementation
  }

  static get properties() {
    return {
      activeIndex: { type: String, reflect: true },
      source: { type: String, reflect: true },
    };
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'activeIndex') {
        if(!this.shadowRoot.querySelector('video-player').playing){
          this.play();
        }
        this.seek(document.querySelector('#' + this.activeIndex).timestamp);
        this.updateJumbotron();
        this.updatePlaylist();
        this.checkDisabledButtons();
      }
    });
  }

  scan(){
    const lectureAnchors = document.querySelectorAll('lecture-anchor');
    console.log(lectureAnchors);
    const anchorsArray = Array.from(lectureAnchors);
    anchorsArray.sort((a, b) => {
      const timeA = parseInt(a.getAttribute('timestamp'), 10);
      const timeB = parseInt(b.getAttribute('timestamp'), 10);
      return timeA - timeB;
    });
    anchorsArray.forEach((anchor, index) => {
      anchor.id = `slide-${index + 1}`;
      anchor.addEventListener('click', () => {
        this.activeIndex = anchor.id;
      });
    });
    this.setJumbotronAttributes();
    this.activeIndex = 'slide-1';
  };

  setJumbotronAttributes() {
    console.log('setJumbotronAttributes');
    document.querySelectorAll('lecture-anchor').forEach((anchor) => {
      let parent = anchor.parentElement;
      if (parent && parent.tagName.startsWith('H')) {        // Parent is a heading
        anchor.setAttribute('jumbotronHeading', anchor.text);
        let sibling = parent.nextElementSibling;
        let content = '';
        while (sibling && !sibling.tagName.startsWith('H')) {
          content += sibling.outerHTML;
          sibling = sibling.nextElementSibling;
        }
        anchor.setAttribute('jumbotronContent', content);
      } else { // parent is not a heading
        let sibling = parent.previousElementSibling;
        while (sibling && !sibling.tagName.startsWith('H')) {
          sibling = sibling.previousElementSibling;
        }
        if (sibling) {
          // Found a heading sibling
          anchor.setAttribute('jumbotronHeading', sibling.textContent);
        } else {
          // No heading sibling found, use the text attribute
          anchor.setAttribute('jumbotronHeading', anchor.getAttribute('text'));
        }
        anchor.setAttribute('jumbotronContent', parent.outerHTML);
      }
    });
    this.addPrevNextListeners();
    this.updatePlaylist();
  }

  addPrevNextListeners(){
    console.log('addPrevNextListeners');
    const prevSlideBtn = this.shadowRoot.querySelector('#prevSlideBtn');
    const nextSlideBtn = this.shadowRoot.querySelector('#nextSlideBtn');
    if(!this.activeIndex){
      this.activeIndex = 'slide-1';
    }
    prevSlideBtn.addEventListener('click', () => {
      const prevSlide = this.activeIndex.split('-')[1] > 1 ? this.activeIndex.split('-')[1] - 1 : null;
      if (prevSlide) {
        this.activeIndex = 'slide-' + prevSlide;
      }
    });
    nextSlideBtn.addEventListener('click', () => {
      const nextSlide = this.activeIndex.split('-')[1] < document.querySelectorAll('lecture-anchor').length ? parseInt(this.activeIndex.split('-')[1]) + 1 : null;
      if (nextSlide) {
        this.activeIndex = 'slide-' + nextSlide;
      }
      else{
        this.endVideo();
      }
    });
  }

  updateJumbotron(){
    console.log('updateJumbotron');
    const jumbotron = this.shadowRoot.querySelector('.jumbotron');
    console.log(jumbotron);
    jumbotron.innerHTML = '';
    const activeAnchor = document.querySelector(`#${this.activeIndex}`);
    console.log(activeAnchor);
    if (activeAnchor) {
      const jumbotronHeading = document.createElement('h2');
      jumbotronHeading.innerText = activeAnchor.getAttribute('jumbotronHeading');
      jumbotron.appendChild(jumbotronHeading);
      const jumbotronContent = document.createElement('div');
      jumbotronContent.id = 'jumbotron-desc';
      jumbotronContent.innerHTML = activeAnchor.getAttribute('jumbotronContent');
      jumbotron.appendChild(jumbotronContent);
    }
  }

  updatePlaylist(){
    console.log('updatePlaylist');
    const timestampList = this.shadowRoot.querySelector('.timestampList');
    timestampList.innerHTML = '';
    const listOfAnchorElements = this.getSortedAnchors();
    listOfAnchorElements.forEach((anchor) => {
      const timestampBtn = document.createElement('button');
      timestampBtn.classList.add('timestampBtn');
      timestampBtn.innerText = anchor.getAttribute('jumbotronHeading');
      timestampBtn.timestamp = anchor.getAttribute('timestamp');
      timestampBtn.addEventListener('click', () => {
        this.activeIndex = anchor.id;
      });
      if (anchor.id === this.activeIndex) {
        timestampBtn.classList.add('active');
      }
      timestampList.appendChild(timestampBtn);
    });
    this.shadowRoot.querySelector('.timestampList').scrollTo({ left: this.shadowRoot.querySelector('.timestampBtn.active').offsetLeft - 125, behavior: 'smooth' });
  }

  getSortedAnchors() { 
    // Returns an array of all the lecture-anchor elements sorted by timestamp, to assing their IDs in order
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

  seek(timestamp){
    console.log('seek');
    console.log(timestamp);
    console.log(this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player"));
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player").seek(timestamp);
  }

  play(){
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player").play();
  }

  checkDisabledButtons(){
    console.log('checkDisabledButtons');
    const prevSlideBtn = this.shadowRoot.querySelector('#prevSlideBtn');
    const activeIndex = parseInt(this.activeIndex.split('-')[1]);
    if (activeIndex === 1) {
      prevSlideBtn.setAttribute('disabled', 'true');
    } else {
      prevSlideBtn.removeAttribute('disabled');
    }
    if (activeIndex !== document.querySelectorAll('lecture-anchor').length) {
      this.shadowRoot.querySelector('#nextSlideBtn').removeAttribute('disabled');
    }
  }

  endVideo(){
    console.log('endVideo');
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector("a11y-media-player").pause();
    this.shadowRoot.querySelector('#nextSlideBtn').setAttribute('disabled', 'true');
    let endBtnDiv = document.createElement('div');
    endBtnDiv.setAttribute('data-primary', '11');
    endBtnDiv.innerHTML = `<button class="endBtn">Close Lecture Player</button>`;
    endBtnDiv.classList.add('endBtnContainer');
    this.shadowRoot.querySelector('.jumbotron').appendChild(endBtnDiv);
    this.shadowRoot.querySelector('.endBtn').addEventListener('click', () => {
      this.shadowRoot.querySelector('simple-modal').close();
    });
    this.shadowRoot.querySelector('.endBtn').scrollIntoView({behavior: "smooth"});
  }

  showModal(){
    console.log('showModal');
    let c = document.createElement('div');
    c.classList.add('modal-content');
    c.innerHTML = `
      <div class="videoSection">
          <video-player source="${this.source}" source-type="${this.sourceType}"></video-player>
          <div class="playlist">
            <button class="timestamp-navigation-button" id="prevSlideBtn"><simple-icon-lite icon="lrn:arrow-left"></simple-icon-lite></button>
            <div class="timestampList">
            </div>
            <button class="timestamp-navigation-button" id="nextSlideBtn"><simple-icon-lite icon="lrn:arrow-right"></simple-icon-lite></button>
          </div>
        </div>
        <div class="jumbotron">
      </div>
    `;
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        elements: { content: c },
        invokedBy: document.getElementById('lectureActivation'),
      }
    });
    dispatchEvent(evt);
    this.scan();
  }

  render() {
    return html`
    <button id="lectureActivation" @click="${this.showModal}">Show Modal</button>
    <simple-modal>
    </simple-modal>
    `;
  }
}

window.customElements.define('lecture-player', LecturePlayer);