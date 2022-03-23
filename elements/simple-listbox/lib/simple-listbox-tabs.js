import { LitElement, html, css } from "lit";
import { A11yTabs } from "@lrnwebcomponents/a11y-tabs/a11y-tabs.js";


/**
 *`Simple-listbox-tabs`
 * input tags and validate an array of input
 * can return as a string or object based on
 * requirements of the implementing element
 *
 * @customElement
 * @class SimpleListboxTabs
 * @extends {SimpleListboxTabsBehaviors(LitElement)}
 * @demo ./demo/index.html Demo
 */
class SimpleListboxTabs extends A11yTabs {
  static get tag() {
    return "simple-listbox-tabs";
  }

  static get styles(){
    return [
      ...super.styles,
    ];
  }

  static get properties(){
    return {
      ...super.properties,
    };
  }

  render(){
    return html`
      ${this.tablistTemplate}
      <slot></slot>
    `;
  }

  /**
   * handle updates
   */
  updated(changedProperties) {
    if(super.updated)super.updated(changedProperties);
  }
  /**
   * selects a tab
   * @param {string} id the active tab's id
   */
  selectTab(id) {
    let tabs = this.querySelectorAll(this.tabQuery);
    if (tabs && tabs.length > 0) {
      let enabled = Object.keys(tabs || [])
          .filter((key) => !tabs[key].disabled).map(key=>tabs[key]),
        filtered = enabled.filter((tab) => tab.id === id),
        selected = filtered[0] || enabled[0];
      this.activeTab = selected.id;
      if(selected) selected.scrollIntoView({block: "nearest",behavior: "smooth"});
    }
  }

  /**
   * makes tab label
   *
   * @param {string} flag tab's flag
   * @returns object
   * @memberof A11yTabs
   */
  _tabLabel(tab) {
    let group = !tab ? false : tab.getAttribute('data-group'), icon = !tab ? false : tab.getAttribute('data-icon');
    return !group ? '' : html` <span class="label" part="label">${group}</span> `;
  }

  /**
   * makes tab icon
   *
   * @param {string} icon tab's icon
   * @returns object
   * @memberof A11yTabs
   */
  _tabIcon(tab,type) {
    let icon = !tab ? false : tab.getAttribute('data-icon');
    return !icon || type == "flagIcon" ? '' : html`
      <simple-icon-lite
        class="icon"
        .icon="${icon}"
        part="icon"
      >
      </simple-icon-lite>
    `;
  }

  /**
   * makes tab tooltip
   *
   * @param {string} id tab's unique id
   * @param {label} label tab's label
   * @returns object
   * @memberof A11yTabs
   */
  _tabTooltip(tab) {
    let tooltip = !tab ? false : tab.getAttribute('data-tooltip'), group = !tab ? false : tab.getAttribute('data-group');
    return !tooltip || (tooltip == group && !this.iconsOnly) ? '': html`
      <simple-tooltip for="${tab.id}-button" part="tooltip">
        ${tooltip}
      </simple-tooltip>
    `;
  }
  /**
   * determines if tabs should show icons only
   * @readonly
   * @returns {boolean}
   */
  get iconsOnly() {
    return (
      (this.tabs || []).filter((tab) => !tab.getAttribute('data-icon')).length < 1
    );
  }

  /**
   * query selector for tabs
   * override this for custom elements that extend a11y-tabs
   *
   * @readonly
   * @memberof A11yTabs
   */
  get tabQuery() {
    return 'li[role="presentation"]';
  }
}
window.customElements.define(SimpleListboxTabs.tag, SimpleListboxTabs);
export { SimpleListboxTabs };
