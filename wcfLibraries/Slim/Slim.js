/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import 'slim-js';
<%- includesString %>
/**
 * `<%= elementName %>`
 * `<%= description %>`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @slimjs
 * @demo demo/index.html
 */
Slim.tag(
  "<%= elementName %>",
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
     * life cycle
     */
    constructor() {
      super();
      <%- constructorString %>
      // map our imported properties json to real props on the element
      // @notice static getter of properties is built via tooling
      // to edit modify src/<%= elementClassName %>-properties.json
      let obj = <%= elementClassName %>.properties;
      for (let p in obj) {
        if (obj.hasOwnProperty(p)) {
          if (this.hasAttribute(p)) {
            this[p] = this.getAttribute(p);
          }
          else {
	         this[p] = obj[p].value;
          }
        }
      }
    }
    // use shadowDOM - well that was easy
    get useShadow() { return true }
    // native API, watch attribute changes off of things we define as our properties
    static get observedAttributes() {
      return Object.keys(<%= elementClassName %>.properties);
    }
    /**
     * life cycle, element is afixed to the DOM
     */
    onRender() {
      <%- connectedString %>
    }
    <%- additionalFunctionsString %>
  }
);