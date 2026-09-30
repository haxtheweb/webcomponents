import { fixture, expect, html } from "@open-wc/testing";

import { A11yMediaStateManager } from "../lib/a11y-media-state-manager.js";

/**
 * A real element acting as a player so IntersectionObserver.observe() stays
 * happy, with the player surface the manager drives stubbed onto it.
 */
const makePlayer = (opts) => {
  opts = opts || {};
  const player = globalThis.document.createElement("div");
  player.fullscreen = !!opts.fullscreen;
  player.allowConcurrent = !!opts.allowConcurrent;
  player.__playing = !!opts.playing;
  player.pausedCount = 0;
  player.pause = () => {
    player.pausedCount += 1;
  };
  player.fullscreenToggles = [];
  player.toggleFullscreen = (mode) => {
    player.fullscreenToggles.push(mode);
  };
  player.stickyToggles = [];
  player.toggleSticky = (mode) => {
    player.stickyToggles.push(mode);
  };
  return player;
};

describe("a11y-media-state-manager singleton", () => {
  it("requestAvailability creates one manager and appends it to the body", () => {
    const manager = globalThis.A11yMediaStateManager.requestAvailability();
    expect(manager).to.exist;
    expect(manager.tagName.toLowerCase()).to.equal("a11y-media-state-manager");
    const again = globalThis.A11yMediaStateManager.requestAvailability();
    expect(again === manager).to.be.true;
    expect(manager.players).to.deep.equal([]);
  });
});

describe("a11y-media-state-manager concurrency", () => {
  let manager;
  beforeEach(async () => {
    manager = await fixture(
      html`<a11y-media-state-manager></a11y-media-state-manager>`,
    );
    await manager.updateComplete;
  });

  it("pauses and un-fullscreens other players by default", () => {
    const active = makePlayer({ playing: true });
    const fullscreenPlayer = makePlayer({ fullscreen: true });
    const plain = makePlayer({});
    manager.players = [fullscreenPlayer, plain, active];
    manager.activePlayer = active;
    manager.checkConcurrentPlayers();
    expect(fullscreenPlayer.fullscreenToggles).to.deep.equal([false]);
    expect(fullscreenPlayer.pausedCount).to.equal(1);
    expect(plain.pausedCount).to.equal(1);
    expect(active.pausedCount).to.equal(0);
  });

  it("allows concurrent playback when both players allow it", () => {
    const active = makePlayer({ playing: true, allowConcurrent: true });
    const other = makePlayer({ allowConcurrent: true });
    manager.players = [other, active];
    manager.activePlayer = active;
    manager.checkConcurrentPlayers();
    expect(other.pausedCount).to.equal(0);
  });

  it("stops everyone when the active player goes fullscreen", () => {
    const active = makePlayer({ playing: true, fullscreen: true });
    const other = makePlayer({ allowConcurrent: true });
    manager.players = [other, active];
    manager.activePlayer = active;
    manager.checkConcurrentPlayers();
    expect(other.pausedCount).to.equal(1);
  });

  it("does nothing without an active player", () => {
    const other = makePlayer({});
    manager.players = [other];
    manager.activePlayer = undefined;
    manager.checkConcurrentPlayers();
    expect(other.pausedCount).to.equal(0);
  });

  it("setActivePlayer switches the active player and observes it", () => {
    const first = makePlayer({ playing: true });
    const second = makePlayer({ playing: true });
    manager.players = [first, second];
    manager.setActivePlayer(first);
    expect(manager.activePlayer === first).to.be.true;
    manager.setActivePlayer(second);
    expect(manager.activePlayer === second).to.be.true;
    // switching pauses the previous player
    expect(first.pausedCount).to.equal(1);
  });

  it("the observer getter reuses a single IntersectionObserver", () => {
    expect(manager.observer === manager.observer).to.be.true;
    expect(manager.observer).to.be.instanceOf(globalThis.IntersectionObserver);
  });

  it("_handleIntersect toggles stickiness from visibility", () => {
    const playing = makePlayer({ playing: true });
    manager.activePlayer = playing;
    manager._handleIntersect([{ isIntersecting: false }], manager.observer);
    expect(playing.stickyToggles).to.deep.equal([true]);
    manager._handleIntersect([{ isIntersecting: true }], manager.observer);
    expect(playing.stickyToggles).to.deep.equal([true, false]);
    // a paused player never becomes sticky
    const paused = makePlayer({ playing: false });
    manager.activePlayer = paused;
    manager._handleIntersect([{ isIntersecting: false }], manager.observer);
    expect(paused.stickyToggles).to.deep.equal([false]);
    // a fullscreen player ignores intersection entirely
    const full = makePlayer({ playing: true, fullscreen: true });
    manager.activePlayer = full;
    manager._handleIntersect([{ isIntersecting: false }], manager.observer);
    expect(full.stickyToggles).to.deep.equal([]);
    // no active player is safe
    manager.activePlayer = null;
    manager._handleIntersect([{ isIntersecting: true }], manager.observer);
  });

  it("setStickyPlayer demotes the previous sticky player", () => {
    const first = makePlayer({ playing: true });
    const second = makePlayer({ playing: true });
    manager.setStickyPlayer(first);
    expect(manager.activePlayer === first).to.be.true;
    manager.setStickyPlayer(second);
    expect(first.stickyToggles).to.deep.equal([false]);
    expect(manager.activePlayer === second).to.be.true;
  });

  it("_handleFullscreen only promotes fullscreen players", () => {
    const fullscreen = makePlayer({ fullscreen: true });
    manager._handleFullscreen(fullscreen);
    expect(manager.activePlayer === fullscreen).to.be.true;
    const plain = makePlayer({});
    manager._handleFullscreen(plain);
    expect(manager.activePlayer === fullscreen).to.be.true;
    manager._handleFullscreen(null);
    expect(manager.activePlayer === fullscreen).to.be.true;
  });
});

describe("a11y-media-state-manager global listeners", () => {
  it("listens for player, playing and fullscreen events while connected", () => {
    const manager = globalThis.A11yMediaStateManager.requestAvailability();
    const player = makePlayer({ playing: true, fullscreen: true });
    globalThis.dispatchEvent(
      new CustomEvent("a11y-player", { detail: player, bubbles: true, composed: true }),
    );
    expect(manager.players).to.include(player);
    globalThis.dispatchEvent(
      new CustomEvent("a11y-player-playing", {
        detail: player,
        bubbles: true,
        composed: true,
      }),
    );
    expect(manager.activePlayer === player).to.be.true;
    // BUG lib/a11y-media-state-manager.js:170 registers this._handleFullscreen
    // directly instead of the __fullscreenManager wrapper that unwraps
    // e.detail, so the raw event (not the player) is inspected and the
    // fullscreen player is never promoted by fullscreen-toggle events.
    const other = makePlayer({ fullscreen: true });
    globalThis.dispatchEvent(
      new CustomEvent("fullscreen-toggle", {
        detail: other,
        bubbles: true,
        composed: true,
      }),
    );
    expect(manager.activePlayer === player).to.be.true;
  });

  it("stops listening once disconnected", () => {
    const manager = globalThis.A11yMediaStateManager.requestAvailability();
    manager.remove();
    const before = manager.players.length;
    const player = makePlayer({});
    globalThis.dispatchEvent(
      new CustomEvent("a11y-player", { detail: player, bubbles: true, composed: true }),
    );
    expect(manager.players.length).to.equal(before);
  });
});
