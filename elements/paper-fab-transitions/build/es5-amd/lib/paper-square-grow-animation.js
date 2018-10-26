define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/neon-animation/neon-animation.js",
  "../node_modules/@polymer/neon-animation/neon-animation-behavior.js"
], function(_polymerLegacy, _neonAnimation, _neonAnimationBehavior) {
  "use strict";
  (0, _polymerLegacy.Polymer)({
    is: "paper-square-grow-animation",
    behaviors: [_neonAnimationBehavior.NeonAnimationBehavior],
    configure: function configure(config) {
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
});
