// Test fixture module: exports a class carrying an INLINE static
// haxProperties object (the legacy authoring pattern). It stands in for a
// registry element so hax-element-list-selector's dynamic import loop can
// exercise its has-schema branch; modules without a static haxProperties
// (like product-card itself) exercise the noSchema branch instead.
class InlineHaxElement extends HTMLElement {
  static get tag() {
    return 'inline-hax-element'
  }
  static get haxProperties() {
    return {
      gizmo: {
        title: 'Inline HAX Element',
        description: 'Fixture element with inline haxProperties',
        icon: 'icons:code',
        color: 'blue',
        tags: ['Test', 'Card'],
        meta: { chemistry: 'test fixture only' },
      },
      settings: { configure: [], advanced: [] },
      demoSchema: [
        { tag: 'p', properties: {}, content: 'fixture demo content' },
      ],
    }
  }
}
globalThis.customElements.define(InlineHaxElement.tag, InlineHaxElement)
export { InlineHaxElement }
