import {
  html,
  PolymerElement
} from "../node_modules/@polymer/polymer/polymer-element.js";
import "../lrn-shared-styles.js";
class LrnSharedStylesDemo extends PolymerElement {
  static get template() {
    return html`
        <!-- include the lrn-shared-styles in the element-->
        <style include="lrn-shared-styles">
            /** 
             * add styles specific to the element here 
             */
            :host .demo-container {
                padding: 0px 0px 20px;
            }
            :host .code-container {
                margin: 0;
                background-color: var(--google-grey-100,#f5f5f5);
                border-top: 1px solid #e0e0e0;
            }
            :host code {
                padding: 20px 0px;
                display: block;
                margin: 0;
                font-size: 13px;
            }
            :host .tag {
            color: #905;
            }
            :host .attr-name {
            color: #690;
            }
            :host .attr-value {
            color: #07a;
            }
        </style>
        <div class="demo-container">
            <p class="sr-only">This text can only be read on screen readers. It is not visible on screen.</p>
            <p class="screen-only">This text can only be read on screen. It will not print.</p>
            <p class="print-only">This text can only be read when printed. It will not be visible on screen.</p>
        </demo>
        <div class="code-container">
            <code>
                /**<br> 
                 &nbsp;* importing the styles in the javascript<br>
                 &nbsp;*/<br>
                 <span class="tag">import </span><span class="attr-value">"@lrnwebcomponents/lrn-shared-styles/lrn-shared-styles.js"</span>;<br>
                <br>
                &lt;!-- using the styles --&gt;<br>
                <span class="tag">&lt;style <span class="attr-name">include=<span class="attr-value">"lrn-shared-styles"</span></span>&gt;</span><br>
                &nbsp;&nbsp;&nbsp;&nbsp;/* your custom CSS here */<br>
                <span class="tag">&lt;/style"&gt;</span>
            </code>
        </div>
    `;
  }
}
customElements.define("lrn-shared-styles-demo", LrnSharedStylesDemo);
