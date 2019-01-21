/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";

// register globally so we can make sure there is only one
window.A11yMediaStateManager = window.A11yMediaStateManager || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same modal
window.A11yMediaStateManager.requestAvailability = () => {
  if (!window.A11yMediaStateManager.instance) {
    window.A11yMediaStateManager.instance = document.createElement(
      "a11y-media-state-manager"
    );
    document.body.appendChild(window.A11yMediaStateManager.instance);
  }
  return window.A11yMediaStateManager.instance;
};
/**
 * `a11y-media-state-manager`
 * `A utility that manages the state of multiple a11y-media-players on a single page.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class A11yMediaStateManager extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-state-manager";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Stores an array of all the players on the page.
       */
      players: {
        type: Array,
        value: []
      },
      /**
       * Manages which player is sticky.
       */
      stickyPlayer: {
        type: Object,
        value: null
      }
    };
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    let root = this;
    root.__playerLoader = function(e) {
      root.players.push(e.detail);
    };

    // sets the instance to the current instance
    if (!window.A11yMediaStateManager.instance) {
      window.A11yMediaStateManager.instance = this;

      // listen for a players added to the page
      window.addEventListener("a11y-player", root.__playerLoader);
    }
  }

  /**
   * life cycle, element is afixed to the DOM
   * Makes sure there is a utility ready and listening for elements.
   */
  connectedCallback() {
    super.connectedCallback();
    let root = this;
    this.__stickyManager = function(e) {
      root.setStickyPlayer(e.detail);
    };
    this.__scrollChecker = function(e) {
      root._checkScroll();
    };

    // listen for a player that starts playing,
    // make it the player that can be sticky,
    // and check for concurrent players
    window.addEventListener("a11y-player-playing", root.__stickyManager);

    // listen for scrolling and find out if a player is off-screen
    window.addEventListener("scroll", root.__scrollChecker);
  }

  /**
   * if a player disallows concurrent players, pauses other players
   */
  checkConcurrentPlayers() {
    let root = this,
      player = root.stickyPlayer;
    for (let i = 0; i < root.players.length; i++) {
      let playeri = root.players[i];
      if (
        playeri !== player &&
        (!player.allowConcurrent || !playeri.allowConcurrent)
      ) {
        playeri.pause();
      }
    }
  }

  /**
   * stops all other players on the page
   *
   * @param {object} the player to set stickiness
   */
  setStickyPlayer(player) {
    let root = this,
      parent = root._getParentNode(player);
    root.__playerTop = parent.offsetTop;
    root.__playerUpperMiddle = root.__playerTop + parent.offsetHeight * 0.9;
    root.__playerLowerMiddle = root.__playerTop + parent.offsetHeight * 0.1;
    if (
      player !== root.stickyPlayer &&
      root.stickyPlayer !== undefined &&
      root.stickyPlayer !== null
    ) {
      root.stickyPlayer.toggleSticky(false);
      root.__parent.style.height = "unset";
    }
    parent.style.height = parent.offsetHeight + "px";
    root.__parent = parent;
    root.stickyPlayer = player;
    if (!player.allowConcurrent) root.checkConcurrentPlayers();
    root._checkScroll();
  }

  /**
   * checks the wondow's scroll position and compares it to active player to set sticky attribute
   */
  _checkScroll() {
    let root = this,
      wintop = window.pageYOffset,
      winbottom = wintop + window.innerHeight;
    if (root.stickyPlayer !== undefined && root.stickyPlayer !== null) {
      if (
        root.stickyPlayer.__playing &&
        (root.__playerLowerMiddle > winbottom ||
          root.__playerUpperMiddle < wintop)
      ) {
        root.stickyPlayer.toggleSticky(true);
      } else {
        root.stickyPlayer.toggleSticky(false);
      }
    }
  }

  /**
   * gets parent node in light DOM
   *
   * @param {object} the node
   * @returns {object} the parent node
   */
  _getParentNode(node) {
    let parent = node.parentNode;
    if (
      parent !== undefined &&
      parent !== null &&
      parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE
    ) {
      parent = parent.host;
    }
    return parent;
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    let root = this;
    window.removeEventListener("a11y-player", root.__playerLoader);
    window.removeEventListener("a11y-player-playing", root.__stickyManager);
    window.removeEventListener("scroll", root.__scrollChecker);
  }
}
window.customElements.define(A11yMediaStateManager.tag, A11yMediaStateManager);
export { A11yMediaStateManager };
