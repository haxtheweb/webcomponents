/**
 * Copyright 2025 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement } from 'lit';
import { RichTextEditorPickerBehaviors } from '@haxtheweb/rich-text-editor/lib/buttons/rich-text-editor-picker.js';

/**
 * `hax-text-editor-alignment-picker`
 * an alignment picker dropdown for HAX text editor that sets DDD data-text-align attributes
 *
 * @customElement
 * @lit-html
 * @lit-element
 * @extends RichTextEditorPickerBehaviors
 * @extends LitElement
 * @element hax-text-editor-alignment-picker
 */
class HaxTextEditorAlignmentPicker extends RichTextEditorPickerBehaviors(
  LitElement,
) {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return 'hax-text-editor-alignment-picker';
  }

  constructor() {
    super();
    this.alignments = [
      {
        label: 'Default',
        value: '',
        icon: 'editor:format-align-left',
      },
      {
        label: 'Left',
        value: 'left',
        icon: 'editor:format-align-left',
      },
      {
        label: 'Center',
        value: 'center',
        icon: 'editor:format-align-center',
      },
      {
        label: 'Right',
        value: 'right',
        icon: 'editor:format-align-right',
      },
      {
        label: 'Justify',
        value: 'justify',
        icon: 'editor:format-align-justify',
      },
    ];
    this.allowNull = true;
    this.hideNullOption = false;
    this.icon = 'editor:format-align-left';
    this.label = 'Text alignment';
    // Block-level elements that can be aligned
    this.tagsList = 'p,h1,h2,h3,h4,h5,h6,div,blockquote,pre,ul,ol,dl,table,section,article,aside,header,footer,nav,figure,figcaption';
    this.titleAsHtml = false;
    this.value = '';
  }

  get labelVisibleClass() {
    return 'hide';
  }

  // properties available to the custom element for data binding
  static get properties() {
    let props = super.properties;
    return {
      ...props,
      /**
       * alignment options as array of objects
       */
      alignments: {
        type: Array,
      },
    };
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'alignments') this._setOptions();
      if (propName === 'range') {
        this._setRangeValue();
        // Disable picker if no valid block element is selected
        this.disabled = !this.rangeOrMatchingAncestor();
      }
    });
  }

  /**
   * sets picker's value based on current selected range
   */
  _setRangeValue() {
    let ancestor = this.rangeOrMatchingAncestor(),
      alignment = ancestor ? ancestor.getAttribute('data-text-align') : '';

    // Update the picker button value
    if (this.shadowRoot && this.shadowRoot.querySelector('#button')) {
      this.shadowRoot.querySelector('#button').value = alignment || '';
    }

    // Update the icon based on current alignment
    if (alignment) {
      const alignOption = this.alignments.find((a) => a.value === alignment);
      if (alignOption) {
        this.icon = alignOption.icon;
      }
    } else {
      this.icon = 'editor:format-align-left';
    }

    this.value = alignment || '';
  }

  /**
   * overrides RichTextEditorPickerBehaviors
   * to populate picker with alignment options
   */
  _setOptions() {
    this.options = this.alignments.map((alignment) => [
      {
        alt: alignment.label,
        value: alignment.value,
        icon: alignment.icon,
      },
    ]);
  }

  /**
   * Custom picker change handler that sets data-text-align attribute
   * instead of using browser execCommand
   *
   * @param {event} e
   */
  _pickerChange(e) {
    if (!this.range) return;

    let ancestor = this.rangeOrMatchingAncestor(),
      newValue = e.detail.value;

    if (ancestor) {
      // Remove attribute if empty/default, otherwise set it
      if (newValue === '' || newValue === null) {
        ancestor.removeAttribute('data-text-align');
      } else {
        ancestor.setAttribute('data-text-align', newValue);
      }

      // Update icon
      const alignOption = this.alignments.find((a) => a.value === newValue);
      if (alignOption) {
        this.icon = alignOption.icon;
      } else {
        this.icon = 'editor:format-align-left';
      }

      // Update picker display
      this.value = newValue || '';

      // Dispatch change event
      this.dispatchEvent(
        new CustomEvent('command', {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            command: 'setAlignment',
            value: newValue,
          },
        }),
      );
    }
  }

  /**
   * Find the closest block-level ancestor that can have alignment
   */
  rangeOrMatchingAncestor() {
    if (!this.range) return null;

    let node =
      this.range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? this.range.commonAncestorContainer.parentNode
        : this.range.commonAncestorContainer;

    // Walk up the tree to find a block-level element in tagsList
    // Stop at hax-body or body to avoid going too far up
    while (node && node.tagName) {
      const tagName = node.tagName.toLowerCase();
      
      // Stop if we hit the editor boundary
      if (tagName === 'hax-body' || tagName === 'body') {
        return null;
      }
      
      if (this.tagsArray.includes(tagName)) {
        return node;
      }
      
      node = node.parentNode;
    }

    return null;
  }
}

globalThis.customElements.define(
  HaxTextEditorAlignmentPicker.tag,
  HaxTextEditorAlignmentPicker,
);
export { HaxTextEditorAlignmentPicker };
