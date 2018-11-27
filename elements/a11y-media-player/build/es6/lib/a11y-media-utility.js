import {
  html,
  Polymer
} from "../node_modules/@polymer/polymer/polymer-legacy.js";
import "../node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js";
window.A11yMediaUtility = {};
Polymer({
  is: "a11y-media-utility",
  properties: {
    players: { type: Array, value: [] },
    stickyPlayer: { type: Object, value: null }
  },
  created: function() {
    let root = this;
    this.__playerLoader = function(e) {
      root.players.push(e.detail);
    };
    if (!window.A11yMediaUtility.instance) {
      window.A11yMediaUtility.instance = this;
      document.body.addEventListener("a11y-player", root.__playerLoader);
    }
  },
  attached: function() {
    let root = this;
    this.__stickyManager = function(e) {
      root.setStickyPlayer(e.detail);
    };
    this.__scrollChecker = function(e) {
      root._checkScroll();
    };
    document.body.addEventListener("a11y-player-playing", root.__stickyManager);
    window.addEventListener("scroll", root.__scrollChecker);
  },
  detached: function() {
    let root = this;
    document.body.removeEventListener("a11y-player", root.__playerLoader);
    document.body.removeEventListener(
      "a11y-player-playing",
      root.__stickyManager
    );
    window.removeEventListener("scroll", root.__scrollChecker);
  },
  checkConcurrentPlayers: function() {
    let root = this,
      player = root.stickyPlayer;
    for (let i = 0, playeri; i < root.players.length; i++) {
      playeri = root.players[i];
      if (
        playeri !== player &&
        (!player.allowConcurrent || !playeri.allowConcurrent)
      ) {
        playeri.pause();
      }
    }
  },
  checkConcurrentPlayers: function() {
    let root = this,
      player = root.stickyPlayer;
    for (let i = 0, playeri; i < root.players.length; i++) {
      playeri = root.players[i];
      if (
        playeri !== player &&
        (!player.allowConcurrent || !playeri.allowConcurrent)
      ) {
        playeri.pause();
      }
    }
  },
  setStickyPlayer: function(player) {
    let root = this,
      parent = root._getParentNode(player);
    root.__playerTop = parent.offsetTop;
    root.__playerUpperMiddle = root.__playerTop + 0.9 * parent.offsetHeight;
    root.__playerLowerMiddle = root.__playerTop + 0.1 * parent.offsetHeight;
    if (
      player !== root.stickyPlayer &&
      root.stickyPlayer !== void 0 &&
      null !== root.stickyPlayer
    ) {
      root.stickyPlayer.toggleSticky(!1);
      root.__parent.style.height = "unset";
    }
    parent.style.height = parent.offsetHeight + "px";
    root.__parent = parent;
    root.stickyPlayer = player;
    if (!player.allowConcurrent) root.checkConcurrentPlayers();
    root._checkScroll();
  },
  _checkScroll: function() {
    let root = this,
      wintop = window.pageYOffset,
      winbottom = wintop + window.innerHeight;
    if (root.stickyPlayer !== void 0 && null !== root.stickyPlayer) {
      if (
        root.stickyPlayer.__playing &&
        (root.__playerLowerMiddle > winbottom ||
          root.__playerUpperMiddle < wintop)
      ) {
        root.stickyPlayer.toggleSticky(!0);
      } else {
        root.stickyPlayer.toggleSticky(!1);
      }
    }
  },
  _getParentNode: function(node) {
    let parent = node.parentNode;
    if (
      parent !== void 0 &&
      null !== parent &&
      parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE
    ) {
      parent = parent.host;
    }
    return parent;
  }
});
window.A11yMediaUtility.instance = null;
window.A11yMediaUtility.requestAvailability = function() {
  if (!window.A11yMediaUtility.instance) {
    window.A11yMediaUtility.instance = document.createElement(
      "a11y-media-utility"
    );
  }
  document.body.appendChild(window.A11yMediaUtility.instance);
};
