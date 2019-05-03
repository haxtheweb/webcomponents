import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/neon-animation/neon-animation.js";
import { NeonAnimationBehavior } from "@polymer/neon-animation/neon-animation-behavior.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
/**
`<paper-square-grow-animation>` increases the element's width and height from an initial
predefined pixel square size to its final size.

Configuration:
```
{
  name: 'expand-animation',
  node: <node>,
  startSize: <start-size-in-px>,
  timing: <animation-timing>,
}
```
@hero hero.svg
* @demo demo/index.html
*/
class PaperSquareGrowAnimation extends mixinBehaviors(
  [NeonAnimationBehavior],
  PolymerElement
) {
  static get tag() {
    return "paper-square-grow-animation";
  }
  configure(config) {
    var node = config.node;
    var startSize = config.startSize;
    var height = node.getBoundingClientRect().height;
    var width = node.getBoundingClientRect().width;
    this._effect = new KeyframeEffect(
      node,
      [
        {
          height: startSize + "px",
          width: startSize + "px"
        },
        {
          height: height + "px",
          width: width + "px"
        }
      ],
      this.timingFromConfig(config)
    );
    return this._effect;
  }
}
window.customElements.define(
  PaperSquareGrowAnimation.tag,
  PaperSquareGrowAnimation
);
export { PaperSquareGrowAnimation };
