define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/iron-resizable-behavior/iron-resizable-behavior.js"
], function(_polymerLegacy) {
  "use strict";
  var _Polymer;
  window.A11yMediaUtility = {};
  (0, _polymerLegacy.Polymer)(
    ((_Polymer = {
      is: "a11y-media-utility",
      properties: {
        players: { type: Array, value: [] },
        stickyPlayer: { type: Object, value: null }
      },
      created: function created() {
        var root = this;
        this.__playerLoader = function(e) {
          root.players.push(e.detail);
        };
        if (!window.A11yMediaUtility.instance) {
          window.A11yMediaUtility.instance = this;
          document.body.addEventListener("a11y-player", root.__playerLoader);
        }
      },
      attached: function attached() {
        var root = this;
        this.__stickyManager = function(e) {
          root.setStickyPlayer(e.detail);
        };
        this.__scrollChecker = function() {
          root._checkScroll();
        };
        document.body.addEventListener(
          "a11y-player-playing",
          root.__stickyManager
        );
        window.addEventListener("scroll", root.__scrollChecker);
      },
      detached: function detached() {
        var root = this;
        document.body.removeEventListener("a11y-player", root.__playerLoader);
        document.body.removeEventListener(
          "a11y-player-playing",
          root.__stickyManager
        );
        window.removeEventListener("scroll", root.__scrollChecker);
      },
      checkConcurrentPlayers: function checkConcurrentPlayers() {
        for (
          var root = this, player = root.stickyPlayer, i = 0, playeri;
          i < root.players.length;
          i++
        ) {
          playeri = root.players[i];
          if (
            playeri !== player &&
            (!player.allowConcurrent || !playeri.allowConcurrent)
          ) {
            playeri.pause();
          }
        }
      }
    }),
    babelHelpers.defineProperty(
      _Polymer,
      "checkConcurrentPlayers",
      function checkConcurrentPlayers() {
        for (
          var root = this, player = root.stickyPlayer, i = 0, playeri;
          i < root.players.length;
          i++
        ) {
          playeri = root.players[i];
          if (
            playeri !== player &&
            (!player.allowConcurrent || !playeri.allowConcurrent)
          ) {
            playeri.pause();
          }
        }
      }
    ),
    babelHelpers.defineProperty(
      _Polymer,
      "setStickyPlayer",
      function setStickyPlayer(player) {
        var root = this,
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
      }
    ),
    babelHelpers.defineProperty(
      _Polymer,
      "_checkScroll",
      function _checkScroll() {
        var root = this,
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
      }
    ),
    babelHelpers.defineProperty(
      _Polymer,
      "_getParentNode",
      function _getParentNode(node) {
        var parent = node.parentNode;
        if (
          parent !== void 0 &&
          null !== parent &&
          parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE
        ) {
          parent = parent.host;
        }
        return parent;
      }
    ),
    _Polymer)
  );
  window.A11yMediaUtility.instance = null;
  window.A11yMediaUtility.requestAvailability = function() {
    if (!window.A11yMediaUtility.instance) {
      window.A11yMediaUtility.instance = document.createElement(
        "a11y-media-utility"
      );
    }
    document.body.appendChild(window.A11yMediaUtility.instance);
  };
});
