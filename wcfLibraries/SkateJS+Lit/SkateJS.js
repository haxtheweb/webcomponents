/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import { props, withComponent } from 'skatejs';
import withLitHtml from '@skatejs/renderer-lit-html';
import { html } from 'lit-html';
<%- includesString %>
// extend into class name matching library for consistency
class SkateJS extends withComponent(withLitHtml()) { }
/**
 * `<%= elementName %>`
 * `<%= description %>`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @lit-html
 * @skatejs
 * @demo demo/index.html
 */
class <%= elementClassName %> extends <%= customElementClass %> {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  tag() {
    return "<%= elementName %>";
  }
  /**
   * A file that contains the HTML template for the element.
   * @notice function name must be here for tooling to operate correctly
   */
  templateUrl() {
    return "<%= elementName %>.html";
  }
  /**
   * A file that contains the properties that will be wired into this element.
   * @notice function name must be here for tooling to operate correctly
   */
  propertiesUrl() {
    return "<%= elementName %>-properties.json";
  }
  /**
   * A file that contains the HAX properties that will be wired into this element.
   * @notice function name must be here for tooling to operate correctly
   */
  HAXPropertiesUrl() {
    return "<%= elementName %>-hax.json";
  }
  /**
   * A file that contains the css for this element to be mixed into the html block.
   * @notice function name must be here for tooling to operate correctly
   */
  styleUrl() {
  <%_ if (useSass) { _%>
    return "<%= elementName %>.scss";
  <%_ } else { _%>
    return "<%= elementName %>.css";
  <%_ } _%>
  }
  /**
   * life cycle
   */
  constructor() {
    super();
    <%- constructorString %>
    // silly but this nets us data binding for default values
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/<%= elementClassName %>-properties.json
    let obj = <%= elementClassName %>.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        this[p] = obj[p].value;
      }
    }
  }
  // SkateJS props function that we map our abstracted properties object over to
  static get props() {
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/<%= elementClassName %>-properties.json
    let obj = <%= elementClassName %>.properties;
    let simpleProps = {};
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        simpleProps[p] = obj[p].value;
      }
    }
    return simpleProps;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connected() {
    <%- connectedString %>
  }

  <%- additionalFunctionsString %>
}
customElements.define("<%= elementName %>", <%= elementClassName %>);
