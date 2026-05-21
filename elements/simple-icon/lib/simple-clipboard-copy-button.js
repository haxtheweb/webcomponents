/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { SimpleIconButtonLite } from './simple-icon-button-lite.js'

/**
 * `simple-clipboard-copy-button`
 * `A simple-icon-button-lite variant that copies `data-cp` to the clipboard`
 *
 * @customElement
 * @extends SimpleIconButtonLite
 * @element simple-clipboard-copy-button
 */
class SimpleClipboardCopyButton extends SimpleIconButtonLite {
  /**
   * Store tag name to make lookup easier.
   */
  static get tag() {
    return 'simple-clipboard-copy-button'
  }

  static get properties() {
    return {
      ...super.properties,
      dataCp: {
        type: String,
        attribute: 'data-cp',
      },
      successMessage: {
        type: String,
        attribute: 'success-message',
      },
      errorMessage: {
        type: String,
        attribute: 'error-message',
      },
    }
  }

  constructor() {
    super()
    this.dataCp = ''
    this.icon = 'content-copy'
    this.label = 'Copy to clipboard'
    this.successMessage = ''
    this.errorMessage = ''
    this.__copyClickHandler = this._copyOnClick.bind(this)
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('click', this.__copyClickHandler)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.__copyClickHandler)
    super.disconnectedCallback()
  }

  _dispatchCopyEvent(name, detail) {
    this.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail,
      }),
    )
  }

  _toast(message) {
    if (!message) {
      return
    }
    const toastShowEventName = globalThis.HAXCMSToast
      ? 'haxcms-toast-show'
      : 'simple-toast-show'
    globalThis.dispatchEvent(
      new CustomEvent(toastShowEventName, {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {
          text: message,
          duration: 3000,
        },
      }),
    )
  }

  _getCopyValue() {
    if (typeof this.dataCp === 'string' && this.dataCp.trim() !== '') {
      return this.dataCp.trim()
    }
    const attrValue = this.getAttribute('data-cp')
    if (typeof attrValue === 'string') {
      return attrValue.trim()
    }
    return ''
  }

  async _writeClipboard(text) {
    if (
      globalThis.navigator &&
      globalThis.navigator.clipboard &&
      globalThis.navigator.clipboard.writeText
    ) {
      await globalThis.navigator.clipboard.writeText(text)
      return true
    }
    return false
  }

  _legacyWriteClipboard(text) {
    let ok = false
    try {
      const textarea = globalThis.document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', 'true')
      textarea.style.position = 'absolute'
      textarea.style.left = '-9999px'
      globalThis.document.body.appendChild(textarea)
      textarea.select()
      ok = globalThis.document.execCommand('copy')
      globalThis.document.body.removeChild(textarea)
    } catch (e) {}
    return ok
  }

  async _copyOnClick() {
    const value = this._getCopyValue()
    if (!value || this.disabled) {
      return
    }
    let copied = false
    try {
      copied = await this._writeClipboard(value)
    } catch (e) {}
    if (!copied) {
      copied = this._legacyWriteClipboard(value)
    }
    const detail = {
      value,
      copied,
    }
    this._dispatchCopyEvent('simple-clipboard-copy', detail)
    if (copied) {
      this._dispatchCopyEvent('simple-clipboard-copy-success', detail)
      this._toast(this.successMessage || 'Copied to clipboard')
      return
    }
    this._dispatchCopyEvent('simple-clipboard-copy-error', detail)
    this._toast(this.errorMessage || 'Unable to copy to clipboard')
  }
}
globalThis.customElements.define(
  SimpleClipboardCopyButton.tag,
  SimpleClipboardCopyButton,
)
export { SimpleClipboardCopyButton }
