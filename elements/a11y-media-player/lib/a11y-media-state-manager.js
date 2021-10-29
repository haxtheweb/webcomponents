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
    this.__fullscreenManager = (e) => this._handleFullscreen(e.detail);
    this.__scrollChecker = (e) => setTimeout(this._checkScroll(), 500);
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
      if (!!active && player !== active) {
        if (player.fullscreen) player.toggleFullscreen(false);
        if (
          !player.allowConcurrent ||
          !active.allowConcurrent ||
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
    if (
      player !== this.activePlayer &&
      this.activePlayer !== undefined &&
      this.activePlayer !== null
    ) {
      this.activePlayer.toggleSticky(false);
    }
    this.setActivePlayer(player);
    setTimeout(this._checkScroll(), 500);
  }
  _handleFullscreen(player) {
    if (player && player.fullscreen) this.setActivePlayer(player);
  }

  /**
   * checks the wondow's scroll position and compares it to active player to set sticky attribute
   */
  _checkScroll() {
    if (this.__wait) return;
    this.__wait = true;
    let wintop = window.pageYOffset,
      winbottom = wintop + window.innerHeight;
    //no need to handle player if it isn't playing or if in fullscreen mode
    if (!this.activePlayer || this.activePlayer.fullscreen) {
    } else if (!this.activePlayer.__playing) {
      this.activePlayer.toggleSticky(false);
    } else {
      let parent = this._getParentNode(this.activePlayer),
        top = parent.offsetTop,
        height = parent.offsetHeight,
        upper = top + height * 0.8,
        lower = top + height * 0.2;
      if (lower > winbottom || upper < wintop) {
        this.activePlayer.toggleSticky(true);
      } else {
        this.activePlayer.toggleSticky(false);
      }
    }
    setTimeout((e) => (this.__wait = false), 500);
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

    // listen for a player toggling fullscreen mode
    window.addEventListener("fullscreen-toggle", this._handleFullscreen);

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
    window.removeEventListener("fullscreen-toggle", root.__fullscreenManager);
    window.removeEventListener("scroll", root.__scrollChecker);
    super.disconnectedCallback();
  }
}
window.customElements.define(A11yMediaStateManager.tag, A11yMediaStateManager);
export { A11yMediaStateManager };
