/**
 * Copyright 2024 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { ChatAgentModalStore } from "../chat-agent.js";
import { DDD } from "@haxtheweb/d-d-d/d-d-d.js";
import { html, css } from "lit";
import { autorun, toJS, } from "mobx";

class ChatInterface extends DDD {

  static get tag() {
    return "chat-interface";
  }

  constructor() {
    super();
    this.chatLog = [];
    this.developerModeEnabled = null;
    this.isFullView = null;
    this.isInterfaceHidden = null;
    this.hasEditorUI = null;
    
    autorun(() => {
      this.chatLog = toJS(ChatAgentModalStore.chatLog);
      this.developerModeEnabled = toJS(ChatAgentModalStore.developerModeEnabled);
      this.isFullView = toJS(ChatAgentModalStore.isFullView);
      this.isInterfaceHidden = toJS(ChatAgentModalStore.isInterfaceHidden);
      
      // TODO will change, brute forcing for now
      const tempSiteGrabber = document.querySelector("#site");
      
      // TODO add something so this if statement is called when window size changes (event listener?)
      if (window.innerHeight > 1000) {
        this.isFullView && !this.isInterfaceHidden ? tempSiteGrabber.style.width = "65%" : tempSiteGrabber.style.width = "100%";
      } else {
        this.isFullView && !this.isInterfaceHidden ? tempSiteGrabber.style.width = "75%" : tempSiteGrabber.style.width = "100%";
      }
      
      // TODO again, brute forcing for now
      if (document.querySelector('haxcms-site-editor-ui')) {
        this.hasEditorUI = true;
      } else {
        this.hasEditorUI = false; 
      }
      console.log(hasEditorUI);
    })
  }

  static get styles() {
    return [
      super.styles,
      css`
        /* https://oer.hax.psu.edu/bto108/sites/haxcellence/documentation/ddd */
        
        :host {
          display: block;
          z-index: 999999;
          width: 100%;
        }

        /* Chat Interface Wrapper */
        .chat-interface-wrapper {
          background-color: transparent;
        }

        :host([is-full-view]) .chat-interface-wrapper {
          background-color: var(--ddd-theme-default-potentialMidnight);
          padding: var(--ddd-spacing-3);
          height: 100vh;
        }

        :host([is-interface-hidden]) .chat-interface-wrapper {
          display: none;
        }
        
        /* Chat Wrapper */
        .chat-wrapper {
          background-color: var(--data-theme-primary, var(--ddd-primary-1));
          padding: var(--ddd-spacing-0) var(--ddd-spacing-2) var(--ddd-spacing-2) var(--ddd-spacing-2);
          border-radius: var(--ddd-radius-sm);
          box-shadow: var(--ddd-boxShadow-xl);
        }
        
        :host([is-full-view]) .chat-wrapper {
          margin: var(--ddd-spacing-6) var(--ddd-spacing-0) var(--ddd-spacing-6) var(--ddd-spacing-0);
          height: 94%;
        } 
        
        :host([is-full-view][has-editor-ui]) .chat-wrapper {
          margin: var(--ddd-spacing-18) var(--ddd-spacing-0) var(--ddd-spacing-0) var(--ddd-spacing-0);
          height: 87%;
        } 
        
        :host([developer-mode]), .chat-wrapper {
          padding-top: var(--ddd-spacing-1);
        }
        
        /* Main Wrapper */
        .main-wrapper {
          display: flex;
          flex-direction: column;
        }

        :host([is-full-view]) .main-wrapper {
          height: 100%;
        }

        :host([is-full-view][developer-mode]) .main-wrapper {
          height: 88%;
        }
        
        /* Chat Container */
        .chat-container {
          width: 100%;
          background-color: var(--ddd-theme-default-white);
          border-radius: var(--ddd-radius-sm);
          display: flex;
          flex-direction: column;
        }

        :host([is-full-view]) .chat-container {
          height: 92%;
        }
        
        :host([is-full-view][developer-mode]) .chat-container {
          height: 90%;
        }

        /* Chat Messages */
        .chat-messages {
          max-height: 300px;
          overflow-x: hidden;
          overflow-y: auto;
          scrollbar-width: thin;
        }
        
        :host([is-full-view]) .chat-messages {
          max-height: 100%;
          height: 100%;
        }

        /* TODO test the media queries for quality assurance, and test without editor ui & without developer mode */
        /* This should coveer a lot of horizontal monitors */
        @media only screen and (min-width: 1081px) {
          @media only screen and (min-height: 1201px) {
            :host([is-full-view]) .chat-wrapper {
              height: 98%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 95%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 105.5%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 101%;
            }
          }

          @media only screen and (max-height: 1200px) and (min-height: 940px) {
            :host([is-full-view]) .chat-wrapper {
              height: 96%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 91.5%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 102%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 96%;
            }
          }

          @media only screen and (max-height: 939px) and (min-height: 880px) {
            :host([is-full-view]) .chat-wrapper {
              height: 91%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 91%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 99%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 95%;
            }
          }

          @media only screen and (max-height: 879px) and (min-height: 780px) {
            :host([is-full-view]) .chat-wrapper {
              height: 90%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 90%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 97%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 93%;
            }
          }

          @media only screen and (max-height: 779px) and (min-height: 752px) {
            :host([is-full-view]) .chat-wrapper {
              height: 89%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 89%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 96%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 92%;
            }
          }

          @media only screen and (max-height: 751px) {
            :host([is-full-view]) .chat-wrapper {
              height: 88%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 88%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 95%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 91%;
            }
          }

          @media only screen and (max-height: 748px) {
            :host([is-full-view]) .chat-wrapper {
              height: 88%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 88%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 94%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 89%;
            }
          }
        }


        /* This should cover a lot of vertical monitors */
        @media only screen and (max-width: 1080px) {

          @media only screen and (min-height: 1720px) {
            :host([is-full-view]) .chat-wrapper {
              height: 98%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 95%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 105.5%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 103%;
            }
          }

          @media only screen and (max-height: 1719px)  and  (min-height: 1600px){
            :host([is-full-view]) .chat-wrapper {
              height: 97.5%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 95%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 105%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 102.5%;
            }
          }

          @media only screen and (max-height: 1599px) and (min-height: 1500px) {
            :host([is-full-view]) .chat-wrapper {
              height: 97%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 95%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 104.5%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 102%;
            }
          }

          @media only screen and (max-height: 1499px) and (min-height: 1440px) {
            :host([is-full-view]) .chat-wrapper {
              height: 96.5%; 
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 95%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 103.5%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 101.5%;
            }
          }

          @media only screen and (max-height: 1439px) and (min-height: 1420px) {
            :host([is-full-view]) .chat-wrapper {
              height: 96%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 95%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 103%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 101%;
            }
          }

          @media only screen and (max-height: 1419px) and (min-height: 1400px) {
            :host([is-full-view]) .chat-wrapper {
              height: 96%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 94.5%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 102.5%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 100.5%;
            }
          }

          @media only screen and (max-height: 1399px) and (min-height: 1300px) {
            :host([is-full-view]) .chat-wrapper {
              height: 96%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 94%
            }

            :host([is-full-view]) .main-wrapper {
              height: 101.5%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 100%;
            }
          }

          @media only screen and (max-height: 1299px) and (min-height: 1220px) {
            :host([is-full-view]) .chat-wrapper {
              height: 96%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 93.5%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 101%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 99.5%;
            }
          }

          @media only screen and (max-height: 1219px) and (min-height: 1160px) {
            :host([is-full-view]) .chat-wrapper {
              height: 96%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 93%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 100.5%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 99%;
            }
          }

          @media only screen and (max-height: 1159px) and (min-height: 1100px) {
            :host([is-full-view]) .chat-wrapper {
              height: 96%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 92.5%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 100%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 98%;
            }
          }

          @media only screen and (max-height: 1099px) and (min-height: 1000px) {
            :host([is-full-view]) .chat-wrapper {
              height: 96%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 92%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 99.5%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 97%;
            }
          }

          @media only screen and (max-height: 999px) and (min-height: 880px){
            :host([is-full-view]) .chat-wrapper {
              height: 96%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 91.5%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 99%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 88%;
            }
          }

          @media only screen and (max-height: 879px) and (min-height: 800px) {
            :host([is-full-view]) .chat-wrapper {
              height: 96%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 91%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 98.5%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 87%;
            }
          }

          @media only screen and (max-height: 799px) and (min-height: 750px) {
            :host([is-full-view]) .chat-wrapper {
              height: 96%;
            }

            :host([is-full-view][has-editor-ui]) .chat-wrapper {
              height: 90.5%;
            }

            :host([is-full-view]) .main-wrapper {
              height: 98%;
            }

            :host([is-full-view][developer-mode]) .main-wrapper {
              height: 86%;
            }
          }
        }

        @media only screen and (max-height: 749px) and (min-height: 720px) {
          :host([is-full-view]) .chat-wrapper {
            height: 96%;
          }

          :host([is-full-view][has-editor-ui]) .chat-wrapper {
            height: 90%;
          }

          :host([is-full-view]) .main-wrapper {
            height: 98%;
          }

          :host([is-full-view][developer-mode]) .main-wrapper {
            height: 85%;
          }
        }
      `
    ];
  }

  // TODO page scrolls down when new message is mapped
  render() {
    return html`
      <div class="chat-interface-wrapper">
        <div class="chat-wrapper">
          ${ChatAgentModalStore.developerModeEnabled ? html`
            <chat-developer-panel></chat-developer-panel>
          ` : ''}
          <div class="main-wrapper">
            <chat-control-bar></chat-control-bar>
            <div class="chat-container">
              <div class="chat-messages">
                  ${this.chatLog.map((message) => html`
                    <chat-message message="${message.message}" ?sent-prompt="${message.author === ChatAgentModalStore.userName}" ?suggested-prompts="${ChatAgentModalStore.currentSuggestions.length > 0}"></chat-message>
                  `)}
              </div>
              <chat-input placeholder="${ChatAgentModalStore.promptPlaceholder}"></chat-input>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static get properties() {
    return {
      ...super.properties,
      chatLog: {
        type: Array,
      },
      developerModeEnabled: {
        type: Boolean,
        attribute: "developer-mode",
        reflect: true,
      },
      hasEditorUI: {
        type: Boolean,
        attribute: "has-editor-ui",
        reflect: true,
      },
      isFullView: {
        type: Boolean,
        attribute: "is-full-view",
        reflect: true,
      },
      isInterfaceHidden: {
        type: Boolean,
        attribute: "is-interface-hidden",
        reflect: true,
      },
    };
  }
}

globalThis.customElements.define(ChatInterface.tag, ChatInterface);
export { ChatInterface };