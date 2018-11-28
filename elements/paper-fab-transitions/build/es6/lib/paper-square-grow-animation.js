import { Polymer } from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/neon-animation/neon-animation.js";
import { NeonAnimationBehavior } from "../node_modules/@polymer/neon-animation/neon-animation-behavior.js";
Polymer({
  is: "paper-square-grow-animation",
  behaviors: [NeonAnimationBehavior],
  configure: function(config) {
    var node = config.node,
      startSize = config.startSize,
      height = node.getBoundingClientRect().height,
      width = node.getBoundingClientRect().width;
    this._effect = new KeyframeEffect(
      node,
      [
        { height: startSize + "px", width: startSize + "px" },
        { height: height + "px", width: width + "px" }
      ],
      this.timingFromConfig(config)
    );
    return this._effect;
  }
});
