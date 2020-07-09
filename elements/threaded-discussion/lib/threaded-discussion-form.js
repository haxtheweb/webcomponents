import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `threaded-discussion-form`
 * a threaded discussions component for elms-ln
 * 
### Styling

`<threaded-discussion-form>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--threaded-discussion-button-BorderRadius` | border-radius for all buttons | 3px
`--threaded-discussion-button-FontWeight` | default button font-weight | 
`--threaded-discussion-button-FontSize` | default button line-height | var(--threaded-discussion-FontSize, 14px));
`--threaded-discussion-button-FontFamily` | default button font-family |
`--threaded-discussion-reply-button-Color` | text color for reply button | #4b4b4b
`--threaded-discussion-reply-button-BackgroundColor` | background color for reply button | #fff
`--threaded-discussion-reply-button-BorderColor` | border color for reply button | #4b4b4b
`--threaded-discussion-reply-button-focus-Color` | text color for reply button when focused | #222
`--threaded-discussion-reply-button-focus-BackgroundColor` | background color for reply button when focused | #fff
`--threaded-discussion-reply-button-focus-BorderColor` | border color for reply button when focused | #222
`--threaded-discussion-comment-button-Color` | text color for reply button | #fff
`--threaded-discussion-comment-button-BackgroundColor` | background color for reply button | #4b4b4b
`--threaded-discussion-comment-button-BorderColor` | border color for reply button | #4b4b4b
`--threaded-discussion-comment-button-focus-Color` | text color for reply button when focused | #fff
`--threaded-discussion-comment-button-focus-BackgroundColor` | background color for reply button when focused | #222
`--threaded-discussion-comment-button-focus-BorderColor` | border color for reply button when focused | #222
`--threaded-discussion-comment-button-FontWeight` | overrides default button font-weight for comment button | 
`--threaded-discussion-comment-button-FontSize` | overrides default default button line-height for comment button |
`--threaded-discussion-comment-button-FontFamily` | overrides default default button font-family for comment button |
`--threaded-discussion-textarea-Height` | height of textarea when form is NOT focused | 16px
`--threaded-discussion-textarea-Opacity` | opacity of textarea when form is NT focused | 0
`--threaded-discussion-textarea-focus-Height` | height of textarea when form is focused | 100px
`--threaded-discussion-textarea-focus-Opacity` | opacity of textarea when form is focused | 1
`--threaded-discussion-textarea-Color` | textarea text color | var(--threaded-discussion-Color, #4b4b4b));
`--threaded-discussion-textarea-LineHeight` | textarea line-height | var(--threaded-discussion-LineHeight, 160%));
`--threaded-discussion-textarea-FontWeight` | textarea font-weight | 
`--threaded-discussion-textarea-FontSize` | textarea line-height | var(--threaded-discussion-FontSize, 14px));
`--threaded-discussion-textarea-FontFamily` | textarea font-family | var(--threaded-discussion-FontFamily));
 *
 *
 *
 * @element threaded-discussion-form
 */
class ThreadedDiscussionForm extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          width: 100%;
          transition: all 0.5s ease-in-out;
        }
        :host([hidden]) {
          display: none;
        }
        label {
          flex: 0 0 0%;
          margin: 0;
          padding: 0;
          position: absolute;
          left: -99999px;
          width: 0;
          height: 0;
          overflow: hidden;
        }
        textarea {
          flex: 1 1 100%;
          height: var(--threaded-discussion-textarea-Height, 16px);
          opacity: var(--threaded-discussion-textarea-Opacity, 0);
          width: calc(
            100% - 2 * var(--threaded-discussion-comment-Padding, 10px)
          );
          padding: var(--threaded-discussion-comment-Padding, 10px);
          margin: 1px;
          border: none;
          resize: none;
          transition: all 0.5s ease-in-out;
          color: var(
            --threaded-discussion-textarea-Color,
            var(--threaded-discussion-Color, #4b4b4b)
          );
          line-height: var(
            --threaded-discussion-textarea-LineHeight,
            var(--threaded-discussion-LineHeight, 160%)
          );
          font-weight: var(--threaded-discussion-textarea-FontWeight);
          font-size: var(
            --threaded-discussion-textarea-FontSize,
            var(--threaded-discussion-FontSize, 14px)
          );
          font-family: var(
            --threaded-discussion-textarea-FontFamily,
            var(--threaded-discussion-FontFamily)
          );
        }
        textarea:focus,
        :host:focus-within textarea {
          height: var(--threaded-discussion-textarea-focus-Height, 100px);
          opacity: var(--threaded-discussion-textarea-focus-Opacity, 1);
        }
        form {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .reply-form {
          margin: 1px;
        }
        button {
          flex: 0 0 auto;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 1px;
          min-height: 24px;
          font-weight: var(--threaded-discussion-button-FontWeight);
          font-size: var(
            --threaded-discussion-button-FontSize,
            var(--threaded-discussion-FontSize, 14px)
          );
          font-family: var(--threaded-discussion-button-FontFamily);
          border-radius: var(--threaded-discussion-button-BorderRadius, 3px);
        }
        .reply-form button {
          color: var(--threaded-discussion-reply-button-Color, #4b4b4b);
          background-color: var(
            --threaded-discussion-reply-button-BackgroundColor,
            #fff
          );
          border: 1px solid
            var(--threaded-discussion-reply-button-BorderColor, #4b4b4b);
        }
        .reply-form button:focus,
        .reply-form button:hover {
          color: var(--threaded-discussion-reply-button-focus-Color, #222);
          background-color: var(
            --threaded-discussion-reply-button-focus-BackgroundColor,
            #fff
          );
          border: 1px solid
            var(--threaded-discussion-reply-button-focus-BorderColor, #222);
        }
        .comment-form button {
          font-weight: var(--threaded-discussion-comment-button-FontWeight);
          font-size: var(--threaded-discussion-comment-button-FontSize);
          font-family: var(--threaded-discussion-button-FontFamily);
          color: var(--threaded-discussion-comment-button-Color, #fff);
          background-color: var(
            --threaded-discussion-comment-button-BackgroundColor,
            #4b4b4b
          );
          border: 1px solid
            var(--threaded-discussion-comment-button-BorderColor, #4b4b4b);
        }
        .comment-form button:focus,
        .comment-form button:hover {
          color: var(--threaded-discussion-comment-button-focus-Color, #fff);
          background-color: var(
            --threaded-discussion-comment-button-focus-BackgroundColor,
            #222
          );
          border: 1px solid
            var(--threaded-discussion-comment-button-focus-BorderColor, #222);
        }
        button iron-icon {
          margin-left: 5px;
        }
      `
    ];
  }

  render() {
    return html`
      <form 
        action="${this.submit}"
        ?hidden=${this.hidden || this.disabled}
        class="${this.thread ? "reply-form" : "comment-form"}">
        <label for="${this.field}">${this.textareaLabel}</label>
        <textarea
          id="${this.field}"
          name="${this.field}"
          aria-describedby="${this.thread}"
        ></textarea>
        <button type="submit">
          ${this.buttonLabel}
          <iron-icon  
            aria-hidden="true" 
            ?hidden="${!this.icon}"
            icon="${this.icon}"></iron-icon>
        </button>
      </div>
    `;
  }

  static get tag() {
    return "threaded-discussion-form";
  }

  static get properties() {
    return {
      /**
       * reply button id
       */
      button: {
        type: String
      },
      /**
       * label for button
       */
      buttonLabel: {
        type: String,
        attribute: "button-label",
        reflect: true
      },
      /**
       * whether form is disabled
       */
      disabled: {
        type: Boolean,
        attribute: "disabled",
        reflect: true
      },
      /**
       * field name for comment body
       */
      field: {
        type: String
      },
      /**
       * whether form is hidden
       */
      hidden: {
        type: Boolean,
        attribute: "hidden",
        reflect: true
      },
      /**
       * button icon
       */
      icon: {
        type: String,
        attribute: "icon",
        reflect: true
      },
      /**
       * form action on submit
       */
      submit: {
        type: String
      },
      /**
       * label for textarea
       */
      textareaLabel: {
        type: String,
        attribute: "textarea-label",
        reflect: true
      },
      /**
       * thread id if this form is replying to a thread
       */
      thread: {
        type: String
      }
    };
  }

  constructor() {
    super();
    this.disabled = false;
    this.hidden = false;
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/iron-icons.js");
  }

  _handleSubmit() {
    this.replying = false;
    this.dispatchEvent(
      new CustomEvent("reply-submitted", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }
}
window.customElements.define(
  ThreadedDiscussionForm.tag,
  ThreadedDiscussionForm
);
export { ThreadedDiscussionForm };
