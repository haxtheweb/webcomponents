import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/iron-resizable-behavior/iron-resizable-behavior.js";

Polymer.A11yMediaUtility = Polymer({
  is: "a11y-media-utility",

  properties: {
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
  },

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  created: function() {
    let root = this;
    this.__playerLoader = function(e) {
      root.players.push(e.detail);
    };

    // sets the instance to the current instance
    if (!Polymer.A11yMediaUtility.instance) {
      Polymer.A11yMediaUtility.instance = this;

      // listen for a players added to the page
      document.body.addEventListener("a11y-player", root.__playerLoader);
    }
  },

  /**
   * Makes sure there is a utility ready and listening for elements.
   */
  attached: function() {
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
    document.body.addEventListener("a11y-player-playing", root.__stickyManager);

    // listen for scrolling and find out if a player is off-screen
    window.addEventListener("scroll", root.__scrollChecker);
  },

  /**
   * Clean up.
   */
  detached: function() {
    let root = this;
    document.body.removeEventListener("a11y-player", root.__playerLoader);
    document.body.removeEventListener(
      "a11y-player-playing",
      root.__stickyManager
    );
    window.removeEventListener("scroll", root.__scrollChecker);
  },
  /**
   * if a player disallows concurrent players, pauses other players
   */

  checkConcurrentPlayers: function() {
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
  },
  /**
   * if a player disallows concurrent players, pauses other players
   */

  checkConcurrentPlayers: function() {
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
  },
  /**
   * stops all other players on the page
   */

  setStickyPlayer: function(player) {
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
  },
  /**
   * checks the wondow's scroll position and compares it to active player to set sticky attribute
   */

  _checkScroll: function() {
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
  },
  /**
   * gets parent node in light DOM
   */

  _getParentNode: function(node) {
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
});

Polymer.A11yMediaUtility.instance = null;

/**
 * Checks to see if there is an instance available, and if not appends one
 */
Polymer.A11yMediaUtility.requestAvailability = function() {
  //only create an instance if there isn't one
  if (!Polymer.A11yMediaUtility.instance) {
    Polymer.A11yMediaUtility.instance = document.createElement(
      "a11y-media-utility"
    );
  }

  document.body.appendChild(Polymer.A11yMediaUtility.instance);
};
