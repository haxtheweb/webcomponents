/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
<%- includesString %>
/**
 * `<%= elementName %>`
 * `<%= description %>`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class <%= elementClassName %> extends <%= customElementClass %> {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "<%= elementName %>";
  }
  /**
   * A file that contains the HTML template for the element.
   * @notice function name must be here for tooling to operate correctly
   */
  get templateUrl() {
    return "<%= elementName %>.html";
  }
  /**
   * A file that contains the properties that will be wired into this element.
   * @notice function name must be here for tooling to operate correctly
   */
  get propertiesUrl() {
    return "<%= elementName %>-properties.json";
  }
  /**
   * A file that contains the HAX properties that will be wired into this element.
   * @notice function name must be here for tooling to operate correctly
   */
  get HAXPropertiesUrl() {
    return "<%= elementName %>-hax.json";
  }
  /**
   * A file that contains the css for this element to be mixed into the html block.
   * @notice function name must be here for tooling to operate correctly
   */
  get styleUrl() {
  <%_ if (useSass) { _%>
    return "<%= elementName %>.scss";
  <%_ } else { _%>
    return "<%= elementName %>.css";
  <%_ } _%>
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    <%- connectedString %>
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
  <%- additionalFunctionsString %>
}
window.customElements.define(<%= elementClassName %>.tag, <%= elementClassName %>);
