/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `material-word`
 * `Outputs word in material alphabet`
 * @demo demo/index.html
 */
class MaterialWord extends PolymerElement {
  static get template() {
    return html`
      <style>
        html {
          font-size: 100%;
          height: 100%;
          width: 100%;
          outline: none;
        }

        body {
          background: #673ab7;
          font-family: "Roboto", sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: #373737;
          line-height: 26px;
          text-align: left;
          overflow-x: hidden;
          margin: auto;
          width: 100%;
          outline: none;
        }

        *,
        *:before,
        *:after {
          -webkit-box-sizing: border-box;
          -moz-box-sizing: border-box;
          box-sizing: border-box;
        }

        * {
          margin: 0;
          padding: 0;
          border: 0;
          border-radius: 0;
          -webkit-border-radius: 0;
          border-spacing: 0;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: normal;
          -webkit-tap-highlight-color: transparent;
          outline: 0 !important;
          -webkit-touch-callout: none;
          transition-timing-function: ease-in-out;
          -moz-transition-timing-function: ease-in-out;
          -webkit-transition-timing-function: ease-in-out;
          -o-transition-timing-function: ease-in-out;
          transition-duration: 0.2s;
          -moz-transition-duration: 0.2s;
          -webkit-transition-duration: 0.2s;
          -o-transition-duration: 0.2s;
        }

        @viewport {
          width: device-width;
        }

        .fab {
          margin: 0 7% 0 0;
          background-color: #ff9800;
          height: 70px;
          width: 70px;
          border-radius: 50px;
          color: #fff;
          font-size: 30px;
          text-align: center;
          line-height: 75px;
          position: absolute;
          right: 0;
          box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.24),
            0 1.5px 6px rgba(0, 0, 0, 0.12);
        }
        .fab:hover {
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.22),
            0 14px 56px rgba(0, 0, 0, 0.25);
        }
        .fab:hover i {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }

        .social i {
          font-size: 40px;
          margin: 30px 0px 15px;
          color: #8460c4;
          width: 60px;
          height: 60px;
          line-height: 60px;
        }
        .social i:hover {
          box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.24),
            0 1.5px 6px rgba(0, 0, 0, 0.12);
          border-radius: 50%;
          text-align: center;
        }
        .wrapper {
          margin: 0 auto;
          width: 75%;
        }

        .cname_wrapper,
        .title_wrapper {
          width: 70%;
          margin: 0 auto;
        }

        .cname-title,
        .alfa-title {
          -webkit-transform: scale(0.6);
          transform: scale(0.6);
          margin: -15px;
        }

        @media (min-width: 480px) {
          .title_wrapper {
            width: 60%;
            margin: 0 auto;
          }
          .wrapper {
            margin: 0 auto;
            width: 85%;
          }
        }
        @media (min-width: 640px) {
          .wrapper {
            margin: 0 auto;
            width: 80%;
          }
        }
        @media (min-width: 768px) {
          .title_wrapper {
            width: 600px;
            margin: 0 auto;
          }
          .cname-title {
            -webkit-transform: scale(0.5);
            transform: scale(0.5);
            margin: -21px;
          }
          .cname_wrapper {
            width: 690px;
            margin: 0 auto;
          }
        }
        @media (min-width: 1200px) {
          .wrapper {
            margin: 0 auto;
            width: 1200px;
          }
        }
        .card {
          display: inline-block;
          width: 150px;
          height: 150px;
          padding: 32px;
          margin: 16px;
          background: #fff;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.23),
            0 3px 12px rgba(0, 0, 0, 0.16);
        }
        .alphabets,
        .alfa-title,
        .cname-title {
          width: 100px;
          height: 100px;
          display: inline-block;
          position: relative;
        }

        .alphabets {
          -webkit-transform: scale(1);
          transform: scale(1);
        }
        .a {
          display: block;
          height: 100px;
        }

        .a:before {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 50px 100px 50px;
          border-color: transparent transparent rgba(233, 30, 99, 0.8)
            transparent;
        }

        .b {
          display: block;
          height: 100px;
        }

        .b:before {
          position: absolute;
          content: "";
          height: 65px;
          width: 100px;
          border-radius: 0 30px 30px 0px;
          background-color: rgba(103, 58, 183, 0.8);
        }

        .b:after {
          position: absolute;
          content: "";
          height: 65px;
          width: 100px;
          top: 35px;
          border-radius: 0 30px 30px 0px;
          background-color: rgba(103, 58, 183, 0.5);
        }

        .c {
          display: block;
          height: 100px;
        }

        .c:before {
          position: absolute;
          content: "";
          height: 100px;
          width: 60px;
          top: 12px;
          border-radius: 0 50px 50px 0px;
          background-color: rgba(0, 150, 136, 0.8);
          -webkit-transform: rotate(140deg);
          transform: rotate(140deg);
        }

        .c:after {
          position: absolute;
          content: "";
          height: 100px;
          width: 60px;
          top: -12px;
          border-radius: 0 50px 50px 0px;
          background-color: rgba(0, 150, 136, 0.5);
          -webkit-transform: rotate(210deg);
          transform: rotate(210deg);
        }

        .d {
          display: block;
          height: 100px;
        }

        .d:before {
          position: absolute;
          content: "";
          height: 100px;
          width: 100px;
          border-radius: 0 50px 50px 0px;
          background-color: rgba(63, 81, 181, 0.8);
        }

        .e,
        .e-half {
          display: block;
          height: 100px;
        }
        .e:before {
          position: absolute;
          content: "";
          background-color: rgba(255, 152, 0, 0.8);
          height: 100px;
          width: 40px;
        }
        .e:after {
          position: absolute;
          content: "";
          top: 0;
          background-color: rgba(255, 152, 0, 0.5);
          height: 30px;
          width: 100px;
        }
        .e-half:before {
          position: absolute;
          content: "";
          background-color: rgba(255, 152, 0, 0.5);
          top: 35px;
          height: 30px;
          width: 100px;
        }
        .e-half:after {
          position: absolute;
          content: "";
          background-color: rgba(255, 152, 0, 0.5);
          bottom: 0;
          height: 30px;
          width: 100px;
        }

        .f,
        .f-half {
          display: block;
          height: 100px;
        }
        .f:before {
          position: absolute;
          content: "";
          background-color: rgba(0, 188, 212, 0.8);
          height: 100px;
          width: 40px;
        }
        .f:after {
          position: absolute;
          content: "";
          top: 0;
          background-color: rgba(0, 188, 212, 0.5);
          height: 30px;
          width: 100px;
        }
        .f-half:before {
          position: absolute;
          content: "";
          background-color: rgba(0, 188, 212, 0.5);
          top: 35px;
          height: 30px;
          width: 100px;
        }
        .g {
          display: block;
          height: 100px;
        }
        .g:before {
          position: absolute;
          content: "";
          height: 60px;
          width: 60px;
          bottom: 0;
          left: 30px;
          background-color: rgba(103, 58, 183, 0.8);
        }
        .g:after {
          position: absolute;
          content: "";
          height: 100px;
          width: 60px;
          top: -12px;
          border-radius: 0 50px 50px 0px;
          background-color: rgba(103, 58, 183, 0.5);
          -webkit-transform: rotate(210deg);
          transform: rotate(210deg);
        }
        .h,
        .h-half {
          display: block;
          height: 100px;
        }
        .h:before {
          position: absolute;
          content: "";
          background-color: rgba(0, 188, 212, 0.8);
          top: 30px;
          height: 40px;
          width: 100px;
        }
        .h:after {
          position: absolute;
          content: "";
          background-color: rgba(0, 188, 212, 0.5);
          height: 100px;
          width: 45px;
        }

        .h-half:before {
          position: absolute;
          content: "";
          top: 0;
          right: 0;
          background-color: rgba(0, 188, 212, 0.5);
          height: 100px;
          width: 45px;
        }

        .i,
        .i-half {
          display: block;
          height: 100px;
        }
        .i:before {
          position: absolute;
          content: "";
          top: 0;
          background-color: rgba(255, 152, 0, 0.5);
          height: 30px;
          width: 100px;
        }
        .i:after {
          position: absolute;
          content: "";
          bottom: 0;
          background-color: rgba(255, 152, 0, 0.5);
          height: 30px;
          width: 100px;
        }
        .i-half:before {
          position: absolute;
          content: "";
          background-color: rgba(255, 152, 0, 0.8);
          top: 0px;
          left: 25px;
          height: 100px;
          width: 50px;
        }

        .j {
          display: block;
          height: 100px;
        }
        .j:before {
          position: absolute;
          content: "";
          height: 50px;
          width: 100px;
          bottom: 0;
          border-radius: 0px 0px 50px 50px;
          background-color: rgba(233, 30, 99, 0.5);
        }
        .j:after {
          position: absolute;
          content: "";
          right: 0;
          background-color: rgba(233, 30, 99, 0.8);
          height: 100px;
          width: 50px;
        }
        .k {
          display: block;
          height: 100px;
        }
        .k:before {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 100px 100px 0;
          border-color: transparent transparent rgba(103, 58, 183, 0.8)
            transparent;
        }
        .k:after {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 100px 100px 0;
          border-color: transparent transparent rgba(103, 58, 183, 0.5)
            transparent;
          -webkit-transform: rotate(90deg);
          transform: rotate(90deg);
        }
        .l {
          display: block;
          height: 100px;
        }
        .l:before {
          position: absolute;
          content: "";
          bottom: 0;
          background-color: rgba(0, 150, 136, 0.8);
          height: 30px;
          width: 100px;
        }
        .l:after {
          position: absolute;
          content: "";
          left: 0;
          background-color: rgba(0, 150, 136, 0.5);
          height: 100px;
          width: 50px;
        }

        .m {
          display: block;
          height: 100px;
        }
        .m:before {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          left: 0;
          border-style: solid;
          border-width: 0 35px 100px 35px;
          border-color: transparent transparent rgba(63, 81, 181, 0.8)
            transparent;
        }
        .m:after {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          right: 0;
          border-style: solid;
          border-width: 0 35px 100px 35px;
          border-color: transparent transparent rgba(63, 81, 181, 0.5)
            transparent;
        }

        .n {
          display: block;
          height: 100px;
        }
        .n:before {
          position: absolute;
          content: "";
          width: 100px;
          height: 100px;
          background-color: rgba(233, 30, 99, 0.5);
        }
        .n:after {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          right: 0;
          border-style: solid;
          border-width: 0 100px 100px 0px;
          border-color: transparent transparent rgba(233, 30, 99, 0.8)
            transparent;
        }
        .o {
          display: block;
          height: 100px;
        }
        .o:before {
          position: absolute;
          content: "";
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: rgba(0, 150, 136, 0.8);
        }

        .p {
          display: block;
          height: 100px;
        }
        .p:before {
          position: absolute;
          content: "";
          height: 65px;
          width: 100px;
          border-radius: 0 30px 30px 0px;
          background-color: rgba(103, 58, 183, 0.8);
        }
        .p:after {
          position: absolute;
          content: "";
          left: 0;
          width: 50px;
          height: 100px;
          background-color: rgba(103, 58, 183, 0.5);
        }

        .q {
          display: block;
          height: 100px;
        }
        .q:before {
          position: absolute;
          content: "";
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background-color: rgba(255, 152, 0, 0.5);
        }
        .q:after {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          bottom: 0;
          right: 0;
          border-style: solid;
          border-width: 0 50px 50px 0px;
          border-color: transparent transparent rgba(255, 152, 0, 0.8)
            transparent;
        }

        .r {
          display: block;
          height: 100px;
        }
        .r:before {
          position: absolute;
          content: "";
          height: 65px;
          width: 100px;
          border-radius: 0 30px 30px 0px;
          background-color: rgba(0, 188, 212, 0.5);
        }
        .r:after {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          left: 0;
          border-style: solid;
          border-width: 0 100px 100px 0px;
          border-color: transparent transparent rgba(0, 188, 212, 0.8)
            transparent;
        }
        .s {
          display: block;
          height: 100px;
        }
        .s:before {
          position: absolute;
          content: "";
          height: 65px;
          width: 100px;
          border-radius: 0 30px 30px 0px;
          background-color: rgba(0, 150, 136, 0.8);
          -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
        }

        .s:after {
          position: absolute;
          content: "";
          height: 65px;
          width: 100px;
          top: 35px;
          border-radius: 0 30px 30px 0px;
          background-color: rgba(0, 150, 136, 0.5);
        }

        .t {
          display: block;
          height: 100px;
        }
        .t:before {
          position: absolute;
          content: "";
          top: 0;
          background-color: rgba(103, 58, 183, 0.8);
          height: 30px;
          width: 100px;
        }
        .t:after {
          position: absolute;
          content: "";
          left: 25px;
          background-color: rgba(103, 58, 183, 0.5);
          height: 100px;
          width: 50px;
        }
        .u {
          display: block;
          height: 100px;
        }

        .u:before {
          position: absolute;
          content: "";
          height: 100px;
          width: 100px;
          border-radius: 0 0 50px 50px;
          background-color: rgba(255, 152, 0, 0.8);
        }
        .v {
          display: block;
          height: 100px;
        }

        .v:before {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 50px 100px 50px;
          border-color: transparent transparent rgba(233, 30, 99, 0.8)
            transparent;
          -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
        }

        .w {
          display: block;
          height: 100px;
        }
        .w:before {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          left: 0;
          border-style: solid;
          border-width: 0 35px 100px 35px;
          border-color: transparent transparent rgba(63, 81, 181, 0.8)
            transparent;
          -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
        }
        .w:after {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          right: 0;
          border-style: solid;
          border-width: 0 35px 100px 35px;
          border-color: transparent transparent rgba(63, 81, 181, 0.5)
            transparent;
          -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
        }

        .x {
          display: block;
          height: 100px;
        }
        .x:before {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 100px 100px 0;
          border-color: transparent transparent rgba(0, 150, 136, 0.8)
            transparent;
        }
        .x:after {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 100px 100px 0;
          border-color: transparent transparent rgba(0, 150, 136, 0.5)
            transparent;
          -webkit-transform: rotate(270deg);
          transform: rotate(270deg);
        }

        .y {
          display: block;
          height: 100px;
        }
        .y:before {
          position: absolute;
          content: "";
          height: 60px;
          width: 100px;
          top: 0;
          border-radius: 0px 0px 50px 50px;
          background-color: rgba(255, 152, 0, 0.5);
        }
        .y:after {
          position: absolute;
          content: "";
          left: 25px;
          background-color: rgba(255, 152, 0, 0.8);
          height: 100px;
          width: 50px;
        }
        .z {
          display: block;
          height: 100px;
        }
        .z:before {
          position: absolute;
          content: "";
          width: 100px;
          height: 100px;
          background-color: rgba(0, 188, 212, 0.5);
        }
        .z:after {
          position: absolute;
          content: "";
          width: 0;
          height: 0;
          right: 0;
          border-style: solid;
          border-width: 0 100px 100px 0px;
          border-color: transparent transparent rgba(0, 188, 212, 0.8)
            transparent;
          -webkit-transform: rotate(270deg);
          transform: rotate(270deg);
        }
      </style>
      <div class="card-title">
        <div class="wrapper">
          <div class="container-fluid">
            <template is="dom-if" if="[[letters]]">
              <template is="dom-repeat" items="[[letters]]">
                <div class="card">
                  <div class="alphabets">
                    <div class\$="[[item]]"></div>
                    <template is="dom-if" if="[[showHalf(item)]]">
                      <div class\$="[[item]]-half"></div>
                    </template>
                  </div>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    `;
  }
  static get tag() {
    return "material-word";
  }
  static get properties() {
    return {
      word: {
        type: String,
        notify: true
      },
      letters: {
        type: Array,
        value: [],
        notify: true,
        reflectToAttribute: true
      },
      halfLetters: {
        type: Array,
        value: ["e", "f", "h", "i"]
      }
    };
  }
  ready() {
    super.ready();
    var word = this.getAttribute("word");
    var letters = word
      .toLowerCase()
      .trim()
      .split("");
    if (letters.length) {
      this.letters = letters;
    }
  }
  showHalf(letter) {
    if (this.halfLetters[letter]) {
      return true;
    }
    return false;
  }
}
window.customElements.define(MaterialWord.tag, MaterialWord);
export { MaterialWord };
