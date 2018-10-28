import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { IronResizableBehavior } from "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";

/**
 * Helper object describing an action to be triggered by a swipe gesture.
 */
var Action = function(
  id,
  node,
  size,
  requestedSize,
  rubberBand,
  fade,
  maxRubberBandReached,
  axis,
  direction
) {
  this.id = id;
  this.node = node;
  this.size = size;
  this.requestedSize = requestedSize;
  this.rubberBand = rubberBand;
  this.fade = fade;
  this.maxRubberBandReached = maxRubberBandReached;
  this.axis = axis;
  this.direction = direction;
};
Action.prototype = {
  constructor: Action,
  id: "right",
  node: undefined,
  size: undefined,
  requestedSize: undefined,
  rubberBand: false,
  fade: false,
  maxRubberBandReached: false,
  axis: "x",
  direction: 1
};

Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        position: relative;
      }

      :host([is-swiping]) {
        z-index: 1001;
      }

      :host > ::content > * {
        position: absolute;
        box-sizing: border-box;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        height: 100%;
      }

      ::content > [swipe-left-action] {visibility: hidden;}
      ::content > [swipe-right-action] {visibility: hidden;}
      ::content > [swipe-up-action] {visibility: hidden;}
      ::content > [swipe-down-action] {visibility: hidden;}

      ::content > .visible-action {
        visibility: visible;
      }

      #swipeTarget {
        @apply(--swipe-action-swipe-target);
      }

      #swipeTarget.fade {
        opacity: 0 !important;
      }

      #swipeTarget.snap-back {
        -webkit-transform: none !important;
        transform: none !important;
        opacity: 1 !important;
      }

      #swipeTarget.snap-back.animated {
        transition: all 200ms ease-in-out;
      }
    </style>

    <slot id="actions" name="[swipe-left-action],[swipe-right-action],[swipe-up-action],[swipe-down-action]"></slot>
    
    <div id="swipeTarget">
      <slot id="content"></slot>
    </div>
`,

  is: "swipe-action",

  /**
   * Fired when the target has been swiped away and a swipe action
   * has been triggered as a result.
   *
   * Content of the event's `detail` property:
   *
   *     {
   *       action: { // The related action
   *         id, // {String} Id of the action. One of
   *           // `window.SwipeAction.ACTION_LEFT`,
   *           // `window.SwipeAction.ACTION_RIGHT`,
   *           // `window.SwipeAction.ACTION_UP`,
   *           // `window.SwipeAction.ACTION_DOWN`
   *         node, // {Object} The action's DOM node
   *         size, // {Number} The actual size of the action
   *         requestedSize, // {Number} The requested size of
   *           // the action (as per the `swipe-size` attribute)
   *         rubberBand, // {Boolean} The requested size of the
   *           // action (as per the `swipe-rubber-band` attr.)
   *         fade, // {Boolean} `true` if the swipeable item
   *           // fades when swiped
   *           // (as per the `swipe-fade` attribute)
   *         maxRubberBandReached, // {Boolean} `true` if the
   *           // swipeable item was swiped all the way
   *           // to maximize the rubber band effect
   *         axis, // {String} The axis of the action
   *           // (either `x` or `y`)
   *         direction // {Number} The direction of the action
   *           // along it's axis (either `1` or `-1`)
   *       },
   *       gesture: { // The triggering swipe gesture
   *         axis, // {String} The axis of the action
   *           // (either `x` or `y`)
   *         direction, // {Number} The direction of the action
   *           // along it's axis (either `1` or `-1`)
   *         lastDelta, // {Number} change in pixels along the
   *           // `axis` since last track event
   *         lastDeltaDuration, // {Number} Time in ms since
   *           // last track event
   *         lastTimestamp // {Number} Timestamp in ms
   *           //of last track event
   *       }
   *     }
   *
   * @event swiped-away
   */

  /**
   * Fired when a swipe has been canceled (ie a pending swipe action
   * has not been 'validated' by the user) or reset (ie an action was
   * triggered and then has been reset).
   *
   * Content of the event's `detail` property: See the `swiped-away` event.
   *
   * @event swipe-canceled
   */

  /**
   * Fired when the target is swiped, whenever the rubber band effect reaches
   * it's limit (ie the target can't swipe be swiped further).
   *
   * Fired once per swipe and per swipe action
   * (unless the action to be triggered changes during a swipe,
   * in which case the event can be fired again once after each change).
   *
   * Does not fire if the `swipe-rubber-band` argument of the swipe action is set
   * to 0 (default), or if the `swipe-fade` argument is set for the swipe action.
   *
   * Content of the event's `detail` property: See the `swiped-away` event.
   *
   * @event swipe-rubber-band-limit
   */

  properties: {
    /**
     * If set, the swipe gesture will be disabled. Actions can only be activated
     * via the `activateAction` function or by setting the `activatedActionId` property.
     */
    gestureDisabled: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      observer: "_refreshActions"
    },

    /**
     * Flag set to true when the element is being swiped via a gesture.
     */
    isSwiping: {
      type: Boolean,
      value: false,
      readOnly: true,
      notify: true,
      reflectToAttribute: true
    },

    /**
     * Flag set to true when the element has been swiped away.
     */
    isSwipedAway: {
      type: Boolean,
      value: false,
      readOnly: true,
      notify: true,
      reflectToAttribute: true
    },

    /**
     * The currently activated action, if there is one.
     * Read-only.
     */
    activatedAction: {
      type: Action,
      value: undefined,
      readOnly: true,
      notify: true
    },

    /**
     * The ID of the activated action. One of `window.SwipeAction.ACTION_LEFT`,
     * `window.SwipeAction.ACTION_RIGHT`, `window.SwipeAction.ACTION_UP`, `window.SwipeAction.ACTION_DOWN`
     *
     * Setting this property will activate/deactivate action(s) but without any animation,
     * and without triggering any event.
     * Bind this property to your model when using `iron-list` to persist the activated action.
     *
     * If you want to programmatically activate/deactivate an action, take a look at
     * the `activateAction` and `reset` functions.
     */
    activatedActionId: {
      type: String,
      value: undefined,
      notify: true,
      observer: "_onActivatedActionIdChange"
    },

    _SWIPE_SPEED_THREASHOLD: {
      type: Number,
      value: 10,
      readOnly: true
    },

    _OPPOSITE_AXIS_MAX_SCROLLING_THREASHOLD: {
      type: Number,
      value: 10,
      readOnly: true
    },

    _SWIPE_TRANSITION: {
      type: String,
      value: "all 200ms ease-in-out",
      readOnly: true
    },

    _ACTIONS_CONFIG: {
      type: Array,
      value: function() {
        return [
          { attr: "swipe-left-action", id: window.SwipeAction.ACTION_LEFT },
          { attr: "swipe-right-action", id: window.SwipeAction.ACTION_RIGHT },
          { attr: "swipe-up-action", id: window.SwipeAction.ACTION_UP },
          { attr: "swipe-down-action", id: window.SwipeAction.ACTION_DOWN }
        ];
      },
      readOnly: true
    },

    /**
     * Data describing the ongoing swipe gesture.
     */
    _gesture: {
      type: Object,
      value: null
    }
  },

  behaviors: [IronResizableBehavior, MutationObserverBehavior],

  listeners: {
    "iron-resize": "_onResize",
    "dom-mutation": "_refreshActions"
  },

  ready: function() {
    // mutation observer setup
    this._mutationOptions = {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: false,
      attributeFilter: this._ACTIONS_CONFIG.map(function(config) {
        return config.attr;
      })
    };
    this._mutationFilter = function(mutation) {
      return (
        this._mutationIsChildList(mutation, this.$.actions) ||
        this._mutationIsChildAttributes(mutation, this.$.actions)
      );
    };

    this.target = this.$.swipeTarget;
    this.listen(this.target, "track", "_onTrack");
    this.listen(this.target, "transitionend", "_onTransitionEnd");
    this._refreshActions();
  },

  detached: function() {
    this.unlisten(this.target, "track", "_onTrack");
    this.unlisten(this.target, "transitionend", "_onTransitionEnd");
  },

  /**
   * Reset the item to it's initial state (not swiped away) and cancel
   * any activated action.
   *
   * @param {Boolean} animate Whether or not to animate the item whilst
   * the item is being reseted
   */
  reset: function(animate) {
    // Snap the item back into place
    this._snapBack(animate);
  },

  /**
   * Programmatically activate a swipe action.
   *
   * @param {String} actionId The ID of the action to activate. One of `window.SwipeAction.ACTION_LEFT`,
   * `window.SwipeAction.ACTION_RIGHT`, `window.SwipeAction.ACTION_UP`, `window.SwipeAction.ACTION_DOWN`.
   * @param {Boolean} animate Whether or not to animate the item whilst
   * the item is being activated
   */
  activateAction: function(actionId, animate) {
    this._animateActivation = animate;
    // Compute to action details
    var actionToActivate = this._actionsMap[actionId];
    var activatedId = this.activatedAction
      ? this.activatedAction.id
      : undefined;
    var toActivateId = actionToActivate ? actionToActivate.id : undefined;
    if (activatedId === toActivateId) {
      // Already activated => nothing to do
      return;
    } else if (!toActivateId && activatedId) {
      // No action to activate, let's just reset the one currently activated
      this.reset(animate);
    } else {
      // If there is on action to activate indeed, keep track of it
      this._currentAction = actionToActivate;
      if (this.activatedAction) {
        // Snap back previous action before
        this.listen(this, "swipe-canceled", "_activateCurrentAction");
        this.reset(animate);
      } else {
        // If no activated action, directly activate the new one
        this._activateCurrentAction();
      }
    }
  },

  _activateCurrentAction: function() {
    this.unlisten(this, "swipe-canceled", "_activateCurrentAction");
    if (this._currentAction) {
      // Update all the action nodes
      this._updateActions(
        this._currentAction.axis,
        this._currentAction.direction
      );
      // Actually swipe away the current action (this._currentAction)
      this._swipeAway(
        this._currentAction,
        this._animateActivation ? this._SWIPE_TRANSITION : ""
      );
    }
  },

  _onActivatedActionIdChange: function(newValue, oldValue) {
    if (!this._activatedActionIdAlreadyChanged) {
      this._mutationObserverPaused = true;
      this._mute = 1;
      if (!newValue) {
        this._mute++;
        this.reset(false);
      } else {
        this.activateAction(newValue, false);
      }
    }
    this._activatedActionIdAlreadyChanged = false;
  },

  _onResize: function() {
    this.debounce("_refreshActions", this._refreshActions, 100);
  },

  _refreshActions: function() {
    if (this.target && this._ACTIONS_CONFIG) {
      // Cache the size of the swipeable node.
      this._targetHeight = this.target.offsetHeight;
      this._targetWidth = this.target.offsetWidth;

      var action,
        map = {},
        canSwipeX = false,
        canSwipeY = false;
      // Build a model for every action declared in the light DOM
      this.getContentChildren("#actions").forEach(function(el) {
        this._ACTIONS_CONFIG.forEach(function(config) {
          if (el.hasAttribute(config.attr)) {
            action = this._actionFactory(config.id, el);
            map[config.id] = action;
            canSwipeX = canSwipeX || action.axis === "x";
            canSwipeY = canSwipeY || action.axis === "y";
          }
        }, this);
      }, this);
      this._actionsMap = map;

      // Computing which scroll direction(s) is/are allowed
      this.setScrollDirection(
        this.gestureDisabled || (!canSwipeX && !canSwipeY)
          ? "all"
          : !canSwipeX
            ? "x"
            : !canSwipeY
              ? "y"
              : "none",
        this.target
      );
    }
  },

  _actionFactory: function(actionId, actionNode) {
    if (!actionNode) {
      return null;
    }
    var sizeAttr = Number(actionNode.getAttribute("swipe-size")) || null;
    var fadeAttr = actionNode.getAttribute("swipe-fade");
    var rubberBandAttr = Number(actionNode.getAttribute("swipe-rubber-band"));
    return new Action(
      actionId,
      actionNode,
      sizeAttr ||
        (actionId === window.SwipeAction.ACTION_UP ||
        actionId === window.SwipeAction.ACTION_DOWN
          ? this._targetHeight
          : this._targetWidth),
      sizeAttr,
      isNaN(rubberBandAttr) ? 60 : rubberBandAttr,
      fadeAttr || fadeAttr === "",
      false,
      actionId === window.SwipeAction.ACTION_UP ||
      actionId === window.SwipeAction.ACTION_DOWN
        ? "y"
        : "x",
      actionId === window.SwipeAction.ACTION_LEFT ||
      actionId === window.SwipeAction.ACTION_UP
        ? -1
        : 1
    );
  },

  _getActionId: function(axis, direction) {
    if (direction > 0) {
      return axis === "x"
        ? window.SwipeAction.ACTION_RIGHT
        : window.SwipeAction.ACTION_DOWN;
    } else {
      return axis === "x"
        ? window.SwipeAction.ACTION_LEFT
        : window.SwipeAction.ACTION_UP;
    }
  },

  /**
   * Computes the swiping direction
   */
  _getSwipingDirection: function(e, axis) {
    return e.detail["d" + axis] > 0 ? 1 : -1;
  },

  /**
   * Track gesture handler
   */
  _onTrack: function(e) {
    // Track only when not already swiped away
    if (!this.isSwipedAway && !this.gestureDisabled) {
      switch (e.detail.state) {
        case "start":
          this._swipeStart(e);
          break;
        case "track":
          if (this.isSwiping) {
            this._swipeUpdate(e);
          }
          break;
        case "end":
          if (this.isSwiping) {
            this._swipeEnd(e);
          }
          break;
      }
    }
  },

  _swipeStart: function(e) {
    this._mutationObserverPaused = true;
    // Set the swipe axis when starting: it must not change once set for the current swipe
    this._gesture = {
      axis: Math.abs(e.detail.dx) > Math.abs(e.detail.dy) ? "x" : "y"
    };
    var oppositeAxis = this._gesture.axis === "x" ? "y" : "x";
    this._gesture.direction = this._getSwipingDirection(e, this._gesture.axis);
    this._gesture.lastTimestamp = Date.now();
    // Initialize the action
    this._updateActions(this._gesture.axis, this._gesture.direction);
    // Prevent the swipe if one of the following conditions is met:
    // - no swipe action is found for the gesture
    // - the gesture is diagonal (this is most likely a weird scroll gesture)
    var validateSwipe =
      this._currentAction &&
      Math.abs(e.detail["d" + oppositeAxis]) <=
        this._OPPOSITE_AXIS_MAX_SCROLLING_THREASHOLD;
    this._setIsSwiping(validateSwipe);
    if (!validateSwipe) {
      return;
    }
    // Translate to element
    this.target.style.willChange = "transform";
    this._applyGestureTranslation(
      e.detail["d" + this._gesture.axis],
      this._gesture.axis
    );
  },

  _swipeUpdate: function(e) {
    var newSwipingDirection = this._getSwipingDirection(e, this._gesture.axis);
    var track = e.detail["d" + this._gesture.axis];
    // If the swiping direction changes, the action to display may also have changed
    if (newSwipingDirection != this._gesture.direction) {
      this._gesture.direction = newSwipingDirection;
      this._updateActions(this._gesture.axis, this._gesture.direction);
      this.target.style.opacity = 1;
    }
    // Cache the last track delta to assess the swipe speed when the 'track end' event is fired
    var newTimestamp = Date.now();
    this._gesture.lastDelta = e.detail["dd" + this._gesture.axis];
    this._gesture.lastDeltaDuration =
      newTimestamp - this._gesture.lastTimestamp;
    this._gesture.lastTimestamp = newTimestamp;
    // Translate
    this._applyGestureTranslation(track, this._gesture.axis);
    // Fade it as well if it is required
    if (this._currentAction.fade) {
      this.target.style.opacity =
        1 - Math.abs(track) / this._currentAction.size;
    }
  },

  _swipeEnd: function(e) {
    var absTranslation = Math.abs(e.detail["d" + this._gesture.axis]);
    var transition;
    // If exactly swiped away (tracked futher than the size of the action, without rubberBandAttr effect),
    // we don't need any transition
    if (
      absTranslation >= this._currentAction.size &&
      !this._currentAction.rubberBand
    ) {
      transition = "";
    }
    // Swipe the item all the way if it was fast.
    else if (
      absTranslation < this._currentAction.size &&
      this._gesture.lastDelta * this._gesture.direction >
        this._SWIPE_SPEED_THREASHOLD
    ) {
      transition = "all ";
      transition += Math.floor(
        Math.min(
          200,
          ((this._currentAction.size - absTranslation) /
            (this._gesture.lastDelta * this._gesture.direction)) *
            this._gesture.lastDeltaDuration
        )
      );
      transition += "ms linear";
    }
    // Slide all the way off (left/right) if we're 50% total size
    else if (absTranslation >= this._currentAction.size / 2) {
      transition = this._SWIPE_TRANSITION;
    }
    // Swipe not confirmed, the swipe target should snap back
    else {
      this._snapBack(true);
      return;
    }
    // Do swipe away
    this._swipeAway(this._currentAction, transition);
  },

  /**
   * Update the actions objects, and initialize the currently visible one
   */
  _updateActions: function(axis, direction) {
    var actionId = this._getActionId(axis, direction);
    // Get the Action matching the action identifier
    this._currentAction = this._actionsMap[actionId];
    // Toggle visibility for the resolved action
    for (actionId in this._actionsMap) {
      dom(this._actionsMap[actionId].node).classList.remove("visible-action");
    }
    if (this._currentAction) {
      dom(this._currentAction.node).classList.add("visible-action");
    }
  },

  _swipeAway: function(action, transition) {
    this.target.style.transition = transition;
    this._willBeSwipedAway = true;
    // Apply CSS transformations
    if (action.fade) {
      dom(this.target).classList.add("fade");
    }
    Polymer.Base.transform(
      this._getTranslate3d(action.direction * action.size, action.axis),
      this.target
    );

    // If there we don't transition, the end handler won't run, so let's handle the cleanup now
    if (!transition) {
      this._cleanupAfterTransition();
    }
  },

  _snapBack: function(animate) {
    if (this.isSwiping || this.isSwipedAway) {
      dom(this.target).classList.add("snap-back");
    }
    // Animation
    if (animate) {
      dom(this.target).classList.add("animated");
    } else {
      this.target.style.transition = "";
      this._cleanupAfterTransition();
    }
  },

  _onTransitionEnd: function(e) {
    if (dom(e).rootTarget === this.target) {
      // Prevent transitionend event from bubbling up further.
      e.stopPropagation();
      // Cleanup after the transition
      if (e.propertyName === "transform") {
        this._cleanupAfterTransition();
      }
    }
  },

  _cleanupAfterTransition: function() {
    // If item is swiped away, the swipe-action is activated: fire the appropriate event
    if (this._willBeSwipedAway) {
      this._willBeSwipedAway = false;
      this._changeActivatedAction(this._currentAction);
      // Fire activation event
      this._fireEvent("swiped-away");
      return;
    }
    // If the target node won't be swiped away, then it will be snaped back,
    // and the action won't be activated anymore
    else if (dom(this.target).classList.contains("snap-back")) {
      this._changeActivatedAction(undefined);
      // Fire cancelation event
      this._fireEvent("swipe-canceled");
    }
    // Cleanup to do AFTER the event is fired
    this._mute--;
  },

  _fireEvent: function(eventName) {
    if (!this._mute) {
      this.fire(eventName, {
        action: this._currentAction,
        gesture: this._gesture
      });
    }
  },

  /**
   * Do change the activatedAction after a swipe or when set programmatically.
   */
  _changeActivatedAction: function(action) {
    var actionId = action ? action.id : undefined;
    // Set the `activatedActionId` property accordingly
    if (this.activatedActionId !== actionId) {
      // Flag the `activatedActionId` property as 'just changed', no computing needed on that front
      this._activatedActionIdAlreadyChanged = true;
      this.activatedActionId = actionId;
    }
    // Reset stuff if the activated action is unset
    if (!action) {
      // Removing inline styles
      Polymer.Base.transform("", this.target);
      this.target.style.opacity = "";
      // Removing state classes (multiple calls to avoid IE bug)
      var classList = dom(this.target).classList;
      classList.remove("snap-back");
      classList.remove("animated");
      classList.remove("fade");
    }
    // Actually set the value
    this._setActivatedAction(action);
    // Set correct values to bindable attributes and do some cleanup
    this.target.style.transition = "";
    this.target.style.willChange = "";
    this._gesture = undefined;
    this._mutationObserverPaused = false;
    this._setIsSwipedAway(!!action);
    this._setIsSwiping(false);
  },

  /**
   * Computes the translation along the correct axis
   */
  _getTranslate3d: function(translation, axis) {
    var t = axis === "x" ? translation + "px, 0" : "0, " + translation + "px";
    return "translate3d(" + t + ", 0)";
  },

  /**
   * Translate the target to match the swipe gesture
   */
  _applyGestureTranslation: function(track, axis) {
    var translation = track;
    // Transform the translation to apply the 'rubber band' effect if requested
    if (!this._currentAction.rubberBand || this._currentAction.fade) {
      translation =
        this._currentAction.direction *
        Math.min(Math.abs(translation), this._currentAction.size);
    } else {
      translation = this._applyRubberBand(translation);
    }
    // Apply the translation
    Polymer.Base.transform(
      this._getTranslate3d(translation, axis),
      this.target
    );
  },

  /**
   * Calculate the translation to apply to create the rubber band effect.
   * If the limit is reached, fire the approriate event.
   */
  _applyRubberBand: function(track) {
    var absTrack = Math.abs(track);
    // The rubber band effect spans at least 3.5 times the rubber band area size
    var rubberBandTrackLength = Math.max(
      this._gesture.direction *
        (this._currentAction.size + this._currentAction.rubberBand),
      3.5 * this._currentAction.rubberBand
    );
    var actionSizePlusRubberBandTrack =
      rubberBandTrackLength + this._currentAction.size;

    // Rubber band if swiped past the boundary if the swipe-action
    if (
      absTrack > this._currentAction.size &&
      absTrack < actionSizePlusRubberBandTrack
    ) {
      return (
        this._gesture.direction *
        this._rubberBand(
          absTrack,
          this._currentAction.size,
          rubberBandTrackLength,
          this._currentAction.rubberBand
        )
      );
    }
    // Cap translation once the rubber band limit is reached
    if (absTrack >= actionSizePlusRubberBandTrack) {
      // Fire an event when reaching the limit of the rubber band effect
      if (!this._currentAction.maxRubberBandReached) {
        this._currentAction.maxRubberBandReached = true;
        this._fireEvent("swipe-rubber-band-limit");
      }
      return (
        this._gesture.direction *
        (this._currentAction.size + this._currentAction.rubberBand)
      );
    }
    // Otherwise, just return the unadulterated track position
    return track;
  },

  /**
   * Rubber banding effect when the target node is swiped further than the action allows.
   */
  _rubberBand: function(
    currentTrack,
    trackForEffectStart,
    trackForEffectPeak,
    maxResult
  ) {
    // Min of linear & Quadratic ease out (http://gizma.com/easing/#quad2)
    var res = (currentTrack - trackForEffectStart) / trackForEffectPeak;
    return Math.min(
      -maxResult * res * (res - 2) + trackForEffectStart,
      currentTrack
    );
    // TODO in dire need of a better function (always inferior to a linear function)
    // trackForEffectStart * (1 + log10(currentTrack / trackForEffectStart)) ?
  }
});
Object.defineProperty(window.SwipeAction, "ACTION_LEFT", {
  get: function() {
    return "left";
  }
});
Object.defineProperty(window.SwipeAction, "ACTION_RIGHT", {
  get: function() {
    return "right";
  }
});
Object.defineProperty(window.SwipeAction, "ACTION_UP", {
  get: function() {
    return "up";
  }
});
Object.defineProperty(window.SwipeAction, "ACTION_DOWN", {
  get: function() {
    return "down";
  }
});
