/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement } from "lit";

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
 * A utility that manages the state of multiple a11y-media-players on a single page.
 *
 */
class A11yMediaStateManager extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "a11y-media-state-manager";
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * Stores an array of all the players on the page.
       */
      players: {
        type: Array,
      },
      /**
       * Manages which player is currently active.
       */
      activePlayer: {
        type: Object,
      },
    };
  }

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  constructor() {
    super();
    this.players = [];
    this.__stickyManager = (e) => this.setStickyPlayer(e.detail);
    this.__activeManager = (e) => this.setActivePlayer(e.detail);
    this.__scrollChecker = (e) => this._checkScroll(e);
    this.__playerLoader = (e) => this.players.push(e.detail);

    // sets the instance to the current instance
    if (!window.A11yMediaStateManager.instance) {
      window.A11yMediaStateManager.instance = this;
    }
  }

  /**
   * if a player disallows concurrent players, pauses other players
   */
  checkConcurrentPlayers() {
    let active = this.activePlayer;
    this.players.forEach((player) => {
      if (player !== active) {
        player.toggleFullscreen(false);
        if (
          (!player.allowConcurrent && !active.allowConcurrent) ||
          active.fullscreen
        )
          player.pause();
      }
    });
  }

  /**
   * sets the active player
   *
   * @param {object} the player to set stickiness
   */
  setActivePlayer(player) {
    this.activePlayer = player;
    this.checkConcurrentPlayers();
  }

  /**
   * stops all other players on the page
   *
   * @param {object} the player to set stickiness
   */
  setStickyPlayer(player) {
    let parent = this._getParentNode(player);
    this.__playerTop = parent.offsetTop;
    this.__playerUpperMiddle = this.__playerTop + parent.offsetHeight * 0.9;
    this.__playerLowerMiddle = this.__playerTop + parent.offsetHeight * 0.1;
    if (
      player !== this.activePlayer &&
      this.activePlayer !== undefined &&
      this.activePlayer !== null
    ) {
      this.activePlayer.toggleSticky(false);
    }
    parent.style.height = parent.offsetHeight + "px";
    this.setActivePlayer(player);
    this._checkScroll();
  }

  /**
   * checks the wondow's scroll position and compares it to active player to set sticky attribute
   */
  _checkScroll() {
    let wintop = window.pageYOffset,
      winbottom = wintop + window.innerHeight;
    if (this.activePlayer !== undefined && this.activePlayer !== null) {
      if (
        this.activePlayer.__playing &&
        (this.__playerLowerMiddle > winbottom ||
          this.__playerUpperMiddle < wintop)
      ) {
        this.activePlayer.toggleSticky(true);
      } else {
        this.activePlayer.toggleSticky(false);
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
  connectedCallback() {
    super.connectedCallback();
    // listen for a player that starts playing
    window.addEventListener("a11y-player-playing", this.__stickyManager);

    // listen for a player toggles fullscreen mode
    window.addEventListener("a11y-player-fullscreen", this.__activeManager);

    // listen for scrolling and find out if a player is off-screen
    window.addEventListener("scroll", this.__scrollChecker);

    // listen for a players added to the page
    window.addEventListener("a11y-player", this.__playerLoader);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    let root = this;
    window.removeEventListener("a11y-player", root.__playerLoader);
    window.removeEventListener("a11y-player-playing", root.__stickyManager);
    window.removeEventListener("a11y-player-fullscreen", root.__activeManager);
    window.removeEventListener("scroll", root.__scrollChecker);
    super.disconnectedCallback();
  }
}
window.customElements.define(A11yMediaStateManager.tag, A11yMediaStateManager);
export { A11yMediaStateManager };
