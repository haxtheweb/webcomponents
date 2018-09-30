/**
 * Copyright <%= year %> <%= copyrightOwner %>
 * @license <%= license %>, see License.md for full text.
 */
import 'twig/twig.min.js';
<%- includesString %>
/**
 * `<%= elementName %>`
 * `<%= description %>`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
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
   * life cycle
   */
  constructor(delayRender = false) {
    super();
    this.attachShadow({ mode: "open" });
    <%- constructorString %>
    // set tag for later use
    this.tag = <%= elementClassName %>.tag;
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
          this.setAttribute(p, obj[p].value);
          this[p] = obj[p].value;
        }
      }
    }
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    <%- connectedString %>
  }

  static get observedAttributes() {
    return Object.keys(<%= elementClassName %>.properties);
  }

  _setProperty({ name, value }) {
    this[name] = value;
  }

  render() {
    if (window.ShadyCSS) {
      window.ShadyCSS.prepareTemplate(this.template, this.tag);
    }
    this.shadowRoot.innerHTML = this.renderTemplate(this.getTemplateVariables());
  }

  attributeChangedCallback() {
    this.render();
  }

  getTemplateVariables() {
    const attributes = {};
    this.constructor.observedAttributes.forEach((attribute) => {
      if (this.hasAttribute(attribute)) {
        attributes[attribute.replace('-', '_')] = this.getAttribute(attribute);
      }
    });
    return attributes;
  }

  renderTemplate(variables) {
    return Twig.twig({
      data: this.getTemplate(),
    }).render(variables);
  }
  <%- additionalFunctionsString %>
}
window.customElements.define(<%= elementClassName %>.tag, <%= elementClassName %>);
