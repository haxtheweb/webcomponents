/**
 * Legacy wrapper for lrnsys-button
 *
 * This makes <lrnsys-button> behave like <simple-cta>, while preserving
 * the older lrnsys-button API (notably `href` + `label`).
 */
import { SimpleCta } from '@haxtheweb/simple-cta/simple-cta.js'

class LrnsysButton extends SimpleCta {
  static get tag () {
    return 'lrnsys-button'
  }

  static get properties () {
    return {
      ...super.properties,
      // legacy attribute used in older content; we map this to `link`
      href: { type: String },
    }
  }

  updated (changedProperties) {
    if (super.updated) {
      super.updated(changedProperties)
    }
    changedProperties.forEach((oldValue, propName) => {
      // if legacy `href` is set and `link` is not, map it through
      if (propName === 'href' && this.href && !this.link) {
        this.link = this.href
      }
    })
  }
}

if (!globalThis.customElements.get(LrnsysButton.tag)) {
  globalThis.customElements.define(LrnsysButton.tag, LrnsysButton)
}

export { LrnsysButton }
