import { html, css, LitElement } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { toJS } from "mobx";

export class PageAnchor extends DDDSuper(LitElement) {
  constructor() {
    super();
    this.value = null;
    this.target = "";
    this.entityId = null;
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * value used for the deep reference within the anchor
       */
      value: { type: String },
      /**
       * the selector to target in the DOM; css selector
       */
      target: { type: String, reflect: true },
      /**
       * entity to reference to pull associated visuals for such as icon / color
       */
      entityId: { type: String, attribute: "entity-id" },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: inline-block;
          cursor: pointer;
        }
        simple-icon-lite {
          margin-right: var(--ddd-spacing-2);
          --simple-icon-height: var(--ddd-icon-xxs);
          --simple-icon-width: var(--ddd-icon-xxs);
        }
      `,
    ];
  }
  // scroll related item into view and initialize
  clickHandler(e) {
    // @todo make sure that we can highlight concepts that are NOT connected to anything in the current page.
    // this could be a good way of reinforcing concepts or having a button that allows jumping to that concept (or loading the content of that concept short form in a tooltip like a definition)
    if (this._haxState && e.type === "click") {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
    // verify node exists and change targetting system if we are in edit mode of HAX
    let node;
    if (!this._haxState) {
      node = globalThis.document.querySelector(
        ".haxcms-theme-element " + this.target,
      );
    } else {
      node = HAXStore.activeHaxBody.querySelector(this.target);
    }
    // ensure node exists in selection; may get deleted after being set
    if (node) {
      node.scrollIntoView();
      setTimeout(() => {
        switch (node.tagName.toLowerCase()) {
          case "video-player":
          case "audio-player":
            if (this.value) {
              node.seek(parseInt(this.value));
            } else {
              node.play();
            }
            break;
          case "play-list":
            // move to the slide in question in the play-list
            node.slide = parseInt(this.value);
            break;
          case "time-line":
          default:
            // @todo nothing for now but may need future functionality based on usecases
            break;
        }
      }, 100);
    } else {
      // unset the node because we didn't find it
      this.target = null;
    }
  }
  // load field from entity id, or target based on who is closer to match
  getMatchFromFields(id, target, field = "accentColor") {
    const entityData = toJS(store.entityData);
    // support entity defining the field to use, which color is a possible option asked for
    if (entityData[id] && entityData[id][field]) {
      if (field == "accentColor") {
        return `--simple-colors-default-theme-${entityData[id][field]}-3`;
      } else {
        return entityData[id][field];
      }
    }
    // defer to the entity resource but fallback to the target itself
    // this way we can have an entity NOT supplying the value and we defer to the
    // system. For example a video might have that icon but color shift to
    // the taxonomy provided color
    let node;
    if (!this._haxState) {
      node = globalThis.document.querySelector(
        ".haxcms-theme-element " + target,
      );
    } else {
      node = HAXStore.activeHaxBody.querySelector(target);
    }
    // ensure we have a target and field value
    if (node && target && field == "accentColor") {
      let schema = HAXStore.haxSchemaFromTag(node.tagName);
      // check for color
      if (schema && schema.gizmo && schema.gizmo.color) {
        return `--simple-colors-default-theme-${schema.gizmo.color}-3`;
      }
    }
    return null;
  }

  render() {
    let icon;
    try {
      icon = this.getMatchFromFields(this.entityId, this.target, "icon");
    } catch (e) {}
    return html`<mark @click="${this.clickHandler}">
      ${icon ? html`<simple-icon-lite icon="${icon}"></simple-icon-lite>` : ``}
      <slot></slot>
    </mark>`;
  }
  static get tag() {
    return "page-anchor";
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./${this.tag}.haxProperties.json`, import.meta.url).href;
  }

  haxHooks() {
    return {
      editModeChanged: "haxeditModeChanged",
      setupActiveElementForm: "haxsetupActiveElementForm",
    };
  }
  /**
   * ensure that when we flip states here that we are actively switching the original level var
   */
  haxeditModeChanged(value) {
    this._haxState = value;
  }

  /**
   * Allow for dynamic setting of the parent field if we have the store around
   * with values to do so
   */
  haxsetupActiveElementForm(props) {
    var relatedDomNode = [
      {
        text: `-- No association --`,
        value: null,
      },
    ];
    HAXStore.activeHaxBody
      .querySelectorAll("[id],[resource]")
      .forEach((node) => {
        // test for a happy label
        if (
          !["PAGE-BREAK", "PAGE-ANCHOR", "RICH-TEXT-EDITOR-HIGHLIGHT"].includes(
            node.tagName,
          )
        ) {
          let schema = HAXStore.haxSchemaFromTag(node.tagName);
          let label = node.gizmo ? node.gizmo.title : "";
          let selector = node.tagName.toLowerCase();
          if (
            schema.gizmo &&
            schema.gizmo.metadata &&
            schema.gizmo.metadata.anchorLabel
          ) {
            label = node[schema.gizmo.metadata.anchorLabel];
          } else {
            if (node.innerText != "") {
              label = node.innerText;
            }
            if (node.getAttribute("id")) {
              label += ` (${node.getAttribute("id")})`;
              selector = `#${node.getAttribute("id")}`;
            } else if (node.getAttribute("resource")) {
              label += ` (${node.getAttribute("resource")})`;
              selector = `[resource="${node.getAttribute("resource")}"]`;
            }
          }
          relatedDomNode.push({
            text: label,
            value: selector,
          });
        }
      });

    const entityData = toJS(store.entityData);
    // default to null parent as the whole site
    var items = [
      {
        text: `-- No association --`,
        value: null,
      },
    ];
    Object.keys(entityData).map((key) => {
      items.push({
        text: entityData[key].title,
        value: entityData[key].id,
      });
    });
    // apply same logic of the items in the active site to
    // parent and related items
    props.settings.configure.forEach((attr, index) => {
      if (attr.property === "target") {
        props.settings.configure[index].inputMethod = "select";
        props.settings.configure[index].itemsList = relatedDomNode;
      }
      if (attr.property === "entityId") {
        props.settings.configure[index].inputMethod = "select";
        props.settings.configure[index].itemsList = items;
      }
    });
  }
}

globalThis.customElements.define(PageAnchor.tag, PageAnchor);
