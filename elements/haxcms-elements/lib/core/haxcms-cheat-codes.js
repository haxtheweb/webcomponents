/**
 * HAXcms Cheat Codes Module
 *
 * This module contains all the Easter egg cheat codes for HAXcms.
 * It's dynamically imported only when the Konami Code is detected
 * to maintain performance and keep the core UI editor lightweight.
 */

import { HAXStore } from "@haxtheweb/hax-body/lib/hax-store.js";
import { store } from "./haxcms-site-store.js";

/**
 * Define all cheat code programs for Merlin
 * @param {Object} editorInstance - The HAXcms site editor UI instance
 * @param {Object} SuperDaemonInstance - The SuperDaemon instance for Merlin
 */
export function defineCheatCodes(editorInstance, SuperDaemonInstance) {
  console.log("🎮 Loading cheat codes module...");

  // DKMODE - Make RPG character have big head
  SuperDaemonInstance.defineOption({
    title: "DKMODE",
    icon: "hax:wizard-hat",
    textCharacter: "🍌",
    tags: ["cheat", "character", "dk", "donkey-kong"],
    context: ["*", "CMS", "HAX"], // Available in all contexts
    priority: -1000, // High priority to appear near top
    eventName: "super-daemon-element-method",
    path: "cheat/dkmode",
    value: {
      target: editorInstance,
      method: "_executeCheatDKMODE",
      args: [],
    },
  });

  // DOABARRELROLL - Rotate the screen
  SuperDaemonInstance.defineOption({
    title: "DOABARRELROLL",
    icon: "image:rotate-right",
    textCharacter: "✈️",
    tags: ["cheat", "rotate", "starfox", "barrel-roll"],
    context: ["*", "CMS", "HAX"],
    priority: -999,
    eventName: "super-daemon-element-method",
    path: "cheat/barrel-roll",
    value: {
      target: editorInstance,
      method: "_executeCheatBarrelRoll",
      args: [],
    },
  });

  // SUMMONZOMBIE - Change character to zombie pirate girl
  SuperDaemonInstance.defineOption({
    title: "SUMMONZOMBIE",
    icon: "hax:skull",
    textCharacter: "🧟‍♀️",
    tags: ["cheat", "zombie", "pirate", "character"],
    context: ["*", "CMS", "HAX"],
    priority: -998,
    eventName: "super-daemon-element-method",
    path: "cheat/zombie",
    value: {
      target: editorInstance,
      method: "_executeCheatSummonZombie",
      args: [],
    },
  });

  // DDR - Play success sound
  SuperDaemonInstance.defineOption({
    title: "DDR",
    icon: "av:volume-up",
    textCharacter: "🎵",
    tags: ["cheat", "dance", "sound", "music"],
    context: ["*", "CMS", "HAX"],
    priority: -997,
    eventName: "super-daemon-element-method",
    path: "cheat/ddr",
    value: {
      target: editorInstance,
      method: "_executeCheatDDR",
      args: [],
    },
  });

  // SANTA - Activate Santa voice mode
  SuperDaemonInstance.defineOption({
    title: "SANTA",
    icon: "maps:local-mall",
    textCharacter: "🎅",
    tags: ["cheat", "santa", "voice", "christmas"],
    context: ["*", "CMS", "HAX"],
    priority: -996,
    eventName: "super-daemon-element-method",
    path: "cheat/santa",
    value: {
      target: editorInstance,
      method: "_executeCheatSanta",
      args: [],
    },
  });

  // TIMETRAVEL - Sepia effect to entire page
  SuperDaemonInstance.defineOption({
    title: "TIMETRAVEL",
    icon: "device:access-time",
    textCharacter: "⏳",
    tags: ["cheat", "time", "sepia", "vintage"],
    context: ["*", "CMS", "HAX"],
    priority: -994,
    eventName: "super-daemon-element-method",
    path: "cheat/timetravel",
    value: {
      target: editorInstance,
      method: "_executeCheatTimeTravel",
      args: [],
    },
  });

  // BEEPS - Click sounds everywhere
  SuperDaemonInstance.defineOption({
    title: "BEEPS",
    icon: "av:volume-up",
    textCharacter: "🔊",
    tags: ["cheat", "sound", "beep", "click"],
    context: ["*", "CMS", "HAX"],
    priority: -993,
    eventName: "super-daemon-element-method",
    path: "cheat/beeps",
    value: {
      target: editorInstance,
      method: "_executeCheatBeeps",
      args: [],
    },
  });

  // DARKWEB - Matrix effect
  SuperDaemonInstance.defineOption({
    title: "DARKWEB",
    icon: "hardware:security",
    textCharacter: "🕵️",
    tags: ["cheat", "matrix", "hacker", "dark"],
    context: ["*", "CMS", "HAX"],
    priority: -992,
    eventName: "super-daemon-element-method",
    path: "cheat/darkweb",
    value: {
      target: editorInstance,
      method: "_executeCheatDarkWeb",
      args: [],
    },
  });

  // RICKROLL - Never gonna give you up
  SuperDaemonInstance.defineOption({
    title: "RICKROLL",
    icon: "av:play-circle-filled",
    textCharacter: "🎤",
    tags: ["cheat", "rick", "roll", "music", "meme"],
    context: ["*", "CMS", "HAX"],
    priority: -991,
    eventName: "super-daemon-element-method",
    path: "cheat/rickroll",
    value: {
      target: editorInstance,
      method: "_executeCheatRickRoll",
      args: [],
    },
  });

  // NYANCAT - Flying rainbow cats
  SuperDaemonInstance.defineOption({
    title: "NYANCAT",
    icon: "pets",
    textCharacter: "🐈",
    tags: ["cheat", "nyan", "cat", "rainbow", "meme"],
    context: ["*", "CMS", "HAX"],
    priority: -990,
    eventName: "super-daemon-element-method",
    path: "cheat/nyancat",
    value: {
      target: editorInstance,
      method: "_executeCheatNyanCat",
      args: [],
    },
  });

  // WORLDCHANGER - Rotating HAX logos with Gandhi quote
  SuperDaemonInstance.defineOption({
    title: "WORLDCHANGER",
    icon: "social:public",
    textCharacter: "🌍",
    tags: ["cheat", "world", "change", "gandhi", "hax"],
    context: ["*", "CMS", "HAX"],
    priority: -989,
    eventName: "super-daemon-element-method",
    path: "cheat/worldchanger",
    value: {
      target: editorInstance,
      method: "_executeCheatWorldChanger",
      args: [],
    },
  });

  // TECHNO - Techno music with screen effects
  SuperDaemonInstance.defineOption({
    title: "TECHNO",
    icon: "av:music-note",
    textCharacter: "🎵",
    tags: ["cheat", "techno", "music", "party", "effects"],
    context: ["*", "CMS", "HAX"],
    priority: -988,
    eventName: "super-daemon-element-method",
    path: "cheat/techno",
    value: {
      target: editorInstance,
      method: "_executeCheatTechno",
      args: [],
    },
  });

  // CREDITS - Show project contributors with music
  SuperDaemonInstance.defineOption({
    title: "CREDITS",
    icon: "social:people",
    textCharacter: "🎬",
    tags: ["cheat", "credits", "contributors", "team", "thanks"],
    context: ["*", "CMS", "HAX"],
    priority: -987,
    eventName: "super-daemon-element-method",
    path: "cheat/credits",
    value: {
      target: editorInstance,
      method: "_executeCheatCredits",
      args: [],
    },
  });

  // JOKER - Chaotic joker and fire emojis with invisible video
  SuperDaemonInstance.defineOption({
    title: "JOKER",
    icon: "social:mood",
    textCharacter: "🃏",
    tags: ["cheat", "joker", "chaos", "fire", "message"],
    context: ["*", "CMS", "HAX"],
    priority: -986,
    eventName: "super-daemon-element-method",
    path: "cheat/joker",
    value: {
      target: editorInstance,
      method: "_executeCheatJoker",
      args: [],
    },
  });

  // FURBY - Late 90s Furby attack with pop-up windows
  SuperDaemonInstance.defineOption({
    title: "FURBY",
    icon: "pets",
    textCharacter: "🔮",
    tags: ["cheat", "furby", "90s", "popup", "nostalgia"],
    context: ["*", "CMS", "HAX"],
    priority: -985,
    eventName: "super-daemon-element-method",
    path: "cheat/furby",
    value: {
      target: editorInstance,
      method: "_executeCheatFurby",
      args: [],
    },
  });

  // WINDOWS95 - Classic Windows 95 desktop experience
  SuperDaemonInstance.defineOption({
    title: "WINDOWS95",
    icon: "hardware:computer",
    textCharacter: "💻",
    tags: ["cheat", "windows", "95", "retro", "desktop", "nostalgia"],
    context: ["*", "CMS", "HAX"],
    priority: -984,
    eventName: "super-daemon-element-method",
    path: "cheat/windows95",
    value: {
      target: editorInstance,
      method: "_executeCheatWindows95",
      args: [],
    },
  });

  // YTMND - You're The Man Now Dog meme experience
  SuperDaemonInstance.defineOption({
    title: "YTMND",
    icon: "av:music-note",
    textCharacter: "🎵",
    tags: ["cheat", "ytmnd", "meme", "spinning", "retro", "internet"],
    context: ["*", "CMS", "HAX"],
    priority: -983,
    eventName: "super-daemon-element-method",
    path: "cheat/ytmnd",
    value: {
      target: editorInstance,
      method: "_executeCheatYTMND",
      args: [],
    },
  });

  // GEOCITIES - Classic 90s website makeover
  SuperDaemonInstance.defineOption({
    title: "GEOCITIES",
    icon: "places:all-inclusive",
    textCharacter: "🌈",
    tags: ["cheat", "geocities", "90s", "website", "construction", "retro"],
    context: ["*", "CMS", "HAX"],
    priority: -982,
    eventName: "super-daemon-element-method",
    path: "cheat/geocities",
    value: {
      target: editorInstance,
      method: "_executeCheatGeocities",
      args: [],
    },
  });

  // CLIPPY - Microsoft Office Assistant
  SuperDaemonInstance.defineOption({
    title: "CLIPPY",
    icon: "editor:attach-file",
    textCharacter: "📎",
    tags: ["cheat", "clippy", "microsoft", "assistant", "help", "office"],
    context: ["*", "CMS", "HAX"],
    priority: -981,
    eventName: "super-daemon-element-method",
    path: "cheat/clippy",
    value: {
      target: editorInstance,
      method: "_executeCheatClippy",
      args: [],
    },
  });

  // CHICKENBUTT - Chicken Butt Freeze Ray Rawr children's book game
  SuperDaemonInstance.defineOption({
    title: "CHICKENBUTT",
    icon: "pets",
    textCharacter: "🐔",
    tags: [
      "cheat",
      "chicken",
      "butt",
      "freeze",
      "ray",
      "rawr",
      "kids",
      "game",
      "I love you",
      "to the moon and back",
      "childrens book",
    ],
    context: ["*", "CMS", "HAX"],
    priority: -980,
    eventName: "super-daemon-element-method",
    path: "cheat/chickenbutt",
    value: {
      target: editorInstance,
      method: "_executeCheatChickenButt",
      args: [],
    },
  });

  // ETERNALDARKNESS - Sanity effects that mess with interface
  SuperDaemonInstance.defineOption({
    title: "ETERNALDARKNESS",
    icon: "image:blur-on",
    textCharacter: "🌙",
    tags: ["cheat", "eternal", "darkness", "sanity", "horror", "gamecube"],
    context: ["*", "CMS", "HAX"],
    priority: -983,
    eventName: "super-daemon-element-method",
    path: "cheat/eternal-darkness",
    value: {
      target: editorInstance,
      method: "_executeCheatEternalDarkness",
      args: [],
    },
  });

  console.log(
    `🎮 Cheat codes defined! Total allItems: ${SuperDaemonInstance.allItems.length}`,
  );
}

/**
 * Add all cheat code execution methods to the editor instance
 * @param {Object} editorInstance - The HAXcms site editor UI instance
 * @param {Object} SuperDaemonInstance - The SuperDaemon instance for Merlin
 */
export function addCheatCodeMethods(editorInstance, SuperDaemonInstance) {
  /**
   * Execute DKMODE cheat - Make RPG character have big head
   */
  editorInstance._executeCheatDKMODE = function () {
    const rpgCharacter = this.shadowRoot.querySelector("rpg-character");
    if (rpgCharacter) {
      // Scale up the entire character and add visual effects with inline styles
      rpgCharacter.style.transform = "scale(1.8)";
      rpgCharacter.style.transformOrigin = "center center";
      rpgCharacter.style.filter =
        "hue-rotate(30deg) saturate(1.3) brightness(1.2)";
      rpgCharacter.style.transition = "all 0.3s ease-in-out";

      HAXStore.toast("🍌 DK MODE ACTIVATED! Big head engaged!");
      store.playSound("success");
    } else {
      HAXStore.toast("🍌 DK MODE: No character found!");
    }
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "Big head mode activated! Welcome to DK Island!",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute DOABARRELROLL cheat - Rotate the screen twice
   */
  editorInstance._executeCheatBarrelRoll = function () {
    const body = globalThis.document.body;
    body.style.transition = "transform 2s ease-in-out";
    body.style.transform = "rotate(720deg)";

    HAXStore.toast("✈️ DO A BARREL ROLL!");

    setTimeout(() => {
      body.style.transform = "rotate(0deg)";
      setTimeout(() => {
        body.style.transition = "";
      }, 2000);
    }, 2000);

    store.playSound("success");
    SuperDaemonInstance.merlinSpeak("Use the boost to get through!");
    SuperDaemonInstance.close();
  };

  /**
   * Execute SUMMONZOMBIE cheat - Change character to zombie pirate girl
   */
  editorInstance._executeCheatSummonZombie = function () {
    const rpgCharacter = this.shadowRoot.querySelector("rpg-character");
    if (rpgCharacter) {
      // Set to zombie pirate girl seed (zpg is predefined in rpg-character)
      rpgCharacter.seed = "zpg";

      // Add spooky visual effects with inline styles
      rpgCharacter.style.filter =
        "hue-rotate(120deg) saturate(1.5) contrast(1.2) sepia(0.3)";
      rpgCharacter.style.transform = "translateY(-5px)";
      rpgCharacter.style.transition = "all 0.5s ease-in-out";

      // Add floating effect using transform animation
      let floatDirection = 1;
      const floatInterval = setInterval(() => {
        if (rpgCharacter.parentNode) {
          floatDirection *= -1;
          rpgCharacter.style.transform = `translateY(${floatDirection * 5}px)`;
        } else {
          clearInterval(floatInterval);
        }
      }, 1000);

      HAXStore.toast("🧟‍♀️ ZOMBIE PIRATE GIRL SUMMONED!");
      store.playSound("success");
    } else {
      HAXStore.toast("🧟‍♀️ SUMMON FAILED: No character found!");
    }
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak("Arrr! The undead seas await ye matey!");
    SuperDaemonInstance.close();
  };

  /**
   * Execute DDR cheat - Play success sound with visual effects
   */
  editorInstance._executeCheatDDR = function () {
    // Play success sound multiple times for DDR effect
    store.playSound("success");
    setTimeout(() => store.playSound("success"), 200);
    setTimeout(() => store.playSound("success"), 400);

    // Add dance floor effect to body
    const body = globalThis.document.body;
    const originalFilter = body.style.filter || "";

    // Flash effect
    body.style.filter = originalFilter + " brightness(1.5) hue-rotate(45deg)";
    setTimeout(() => {
      body.style.filter =
        originalFilter + " brightness(0.8) hue-rotate(-45deg)";
    }, 150);
    setTimeout(() => {
      body.style.filter = originalFilter;
    }, 300);

    HAXStore.toast("🎵 DANCE DANCE REVOLUTION!");
    SuperDaemonInstance.merlinSpeak("Left, down, up, right! Keep the beat!");
    SuperDaemonInstance.close();
  };

  /**
   * Execute SANTA cheat - Toggle Santa mode in super-daemon
   */
  editorInstance._executeCheatSanta = function () {
    const SuperDaemon = globalThis.SuperDaemon;
    if (SuperDaemon && SuperDaemon.manager) {
      SuperDaemon.manager.santa = !SuperDaemon.manager.santa;
      HAXStore.toast(
        SuperDaemon.manager.santa
          ? "🎅 HO HO HO! Santa mode activated!"
          : "🎅 Santa mode deactivated. Back to normal voice.",
      );
    } else {
      HAXStore.toast("🎅 Santa mode unavailable");
    }

    store.playSound("success");
    SuperDaemonInstance.merlinSpeak("Ho ho ho! Have you been naughty or nice?");
    SuperDaemonInstance.close();
  };

  /**
   * Execute TIMETRAVEL cheat - Add sepia effect to entire page
   */
  editorInstance._executeCheatTimeTravel = function () {
    const body = globalThis.document.body;
    const existingFilter = body.style.filter || "";

    if (existingFilter.includes("sepia")) {
      // Remove time travel effect
      body.style.filter = existingFilter.replace(/sepia\([^)]*\)/g, "").trim();
      HAXStore.toast("⏳ Time travel disabled - Welcome back to the present!");
    } else {
      // Add sepia time travel effect
      body.style.filter =
        (existingFilter || "") + " sepia(0.8) contrast(1.2) brightness(0.9)";
      body.style.transition = "filter 2s ease-in-out";

      HAXStore.toast("⏳ TIME TRAVEL ACTIVATED! Welcome to the past!");

      // Auto-remove after 30 seconds
      setTimeout(() => {
        const currentFilter = body.style.filter || "";
        if (currentFilter.includes("sepia")) {
          body.style.filter = currentFilter
            .replace(/sepia\([^)]*\)/g, "")
            .trim();
          HAXStore.toast("⏳ Time travel expired - Returned to present");
        }
      }, 30000);
    }

    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "Great Scott! We have traveled through time itself!",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute BEEPS cheat - Add click sounds everywhere
   */
  editorInstance._executeCheatBeeps = function () {
    const beepSounds = ["beep", "boop", "ding", "ping", "click"];
    let beepActive = globalThis.document.body.hasAttribute("data-beeps-active");

    if (beepActive) {
      // Remove beep mode
      globalThis.document.body.removeAttribute("data-beeps-active");
      globalThis.document.removeEventListener(
        "click",
        globalThis.beepClickHandler,
      );
      HAXStore.toast("🔊 BEEPS disabled - Silence restored");
    } else {
      // Add beep mode
      globalThis.document.body.setAttribute("data-beeps-active", "true");

      globalThis.beepClickHandler = (e) => {
        // Create audio context for beep sounds
        const audioContext = new (globalThis.AudioContext ||
          globalThis.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Random frequency for variety
        oscillator.frequency.setValueAtTime(
          200 + Math.random() * 800,
          audioContext.currentTime,
        );
        oscillator.type = "sine";

        // Short beep
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.1,
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      };

      globalThis.document.addEventListener(
        "click",
        globalThis.beepClickHandler,
      );
      HAXStore.toast("🔊 BEEPS ACTIVATED! Every click makes a sound!");
    }

    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "Beep boop! Every click is now a symphony of chaos!",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute DARKWEB cheat - Matrix effect overlay
   */
  editorInstance._executeCheatDarkWeb = function () {
    const existingMatrix = globalThis.document.getElementById("matrix-effect");

    if (existingMatrix) {
      // Remove matrix effect
      existingMatrix.remove();
      HAXStore.toast("🕵️ Matrix disabled - Back to reality");
    } else {
      // Add matrix effect as overlay
      const matrixContainer = globalThis.document.createElement("div");
      matrixContainer.id = "matrix-effect";
      matrixContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
        overflow: hidden;
      `;

      // Create more matrix columns for fuller coverage
      for (let i = 0; i < 60; i++) {
        const column = globalThis.document.createElement("div");
        column.style.cssText = `
          position: absolute;
          top: -100%;
          left: ${(i / 60) * 100}%;
          width: 20px;
          height: 100%;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          animation: matrix-fall ${Math.random() * 3 + 2}s linear infinite;
          animation-delay: ${Math.random() * 3}s;
        `;

        // Add random characters with individual backgrounds
        const chars = "アイウエオカキクケコサシスセソ01010110100110";
        let columnText = "";
        for (let j = 0; j < 40; j++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          columnText += `<span style="color: #00ff00; background: rgba(0,0,0,0.8); display: block; text-align: center; margin: 2px 0;">${char}</span>`;
        }
        column.innerHTML = columnText;

        matrixContainer.appendChild(column);
      }

      // Add matrix animation CSS
      if (!globalThis.document.getElementById("matrix-animation")) {
        const style = globalThis.document.createElement("style");
        style.id = "matrix-animation";
        style.textContent = `
          @keyframes matrix-fall {
            0% {
              transform: translateY(-100vh);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh);
              opacity: 0;
            }
          }
        `;
        globalThis.document.head.appendChild(style);
      }

      globalThis.document.body.appendChild(matrixContainer);
      HAXStore.toast("🕵️ DARK WEB ACTIVATED - Welcome to the Matrix!");

      // Auto-remove after 20 seconds
      setTimeout(() => {
        const matrix = globalThis.document.getElementById("matrix-effect");
        if (matrix) {
          matrix.remove();
          HAXStore.toast("🕵️ Matrix session terminated");
        }
      }, 20000);
    }

    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "Welcome to the Matrix! Red pill or blue pill?",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute RICKROLL cheat - Rick Roll video modal with hidden continuation
   */
  editorInstance._executeCheatRickRoll = function () {
    // Create modal with Rick Roll video
    const modal = globalThis.document.createElement("div");
    modal.id = "rickroll-modal";
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    const videoContainer = globalThis.document.createElement("div");
    videoContainer.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 10px;
      position: relative;
      max-width: 80%;
      max-height: 80%;
    `;

    const closeBtn = globalThis.document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.style.cssText = `
      position: absolute;
      top: 10px;
      right: 15px;
      background: red;
      color: white;
      border: none;
      font-size: 20px;
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 50%;
    `;

    const iframe = globalThis.document.createElement("iframe");
    iframe.src = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
    iframe.style.cssText = `
      width: 560px;
      height: 315px;
      border: none;
      max-width: 100%;
      max-height: 100%;
    `;
    iframe.allow = "autoplay";

    const title = globalThis.document.createElement("h2");
    title.textContent = "Never Gonna Give You Up!";
    title.style.textAlign = "center";
    title.style.color = "red";
    title.style.marginTop = "0";

    videoContainer.appendChild(closeBtn);
    videoContainer.appendChild(title);
    videoContainer.appendChild(iframe);
    modal.appendChild(videoContainer);
    globalThis.document.body.appendChild(modal);

    // Hidden iframe for when modal is closed
    let hiddenIframe = null;

    const closeModal = () => {
      // Create hidden iframe to continue playing
      hiddenIframe = globalThis.document.createElement("iframe");
      hiddenIframe.src =
        "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&start=0";
      hiddenIframe.style.cssText = `
        position: fixed;
        top: -1000px;
        left: -1000px;
        width: 1px;
        height: 1px;
        border: none;
        opacity: 0;
        pointer-events: none;
      `;
      hiddenIframe.allow = "autoplay";
      globalThis.document.body.appendChild(hiddenIframe);

      // Remove modal
      modal.remove();

      // Remove hidden iframe after song ends
      setTimeout(() => {
        if (hiddenIframe && hiddenIframe.parentNode) {
          hiddenIframe.remove();
        }
      }, 213000); // Song is about 3.5 minutes
    };

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    HAXStore.toast("🎤 RICK ROLLED! Never gonna give you up!");
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "Never gonna give you up, never gonna let you down!",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute NYANCAT cheat - Flying rainbow cats across screen
   */
  editorInstance._executeCheatNyanCat = function () {
    // Create 50 nyan cats moving faster
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const nyanCat = globalThis.document.createElement("div");
        nyanCat.className = "nyan-cat";
        nyanCat.innerHTML = "🐈🌈";
        nyanCat.style.cssText = `
          position: fixed;
          left: -100px;
          top: ${Math.random() * (globalThis.innerHeight - 50)}px;
          font-size: 30px;
          z-index: 9999;
          animation: nyan-fly 2s linear;
          pointer-events: none;
        `;

        // Add rainbow trail
        const trail = globalThis.document.createElement("div");
        trail.style.cssText = `
          position: absolute;
          right: 30px;
          top: 50%;
          transform: translateY(-50%);
          width: 200px;
          height: 20px;
          background: linear-gradient(90deg, 
            red 0%, orange 16.66%, yellow 33.33%, 
            green 50%, blue 66.66%, indigo 83.33%, violet 100%);
          border-radius: 10px;
        `;

        nyanCat.appendChild(trail);
        globalThis.document.body.appendChild(nyanCat);

        // Remove after animation (faster cleanup)
        setTimeout(() => {
          if (nyanCat.parentNode) {
            nyanCat.remove();
          }
        }, 2000);
      }, i * 200); // More frequent cats (every 200ms)
    }

    // Add nyan animation CSS
    if (!globalThis.document.getElementById("nyan-animation")) {
      const style = globalThis.document.createElement("style");
      style.id = "nyan-animation";
      style.textContent = `
        @keyframes nyan-fly {
          0% {
            left: -100px;
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(5deg);
          }
          100% {
            left: calc(100vw + 100px);
            transform: rotate(0deg);
          }
        }
      `;
      globalThis.document.head.appendChild(style);
    }

    HAXStore.toast("🐈 NYAN CAT ACTIVATED! Rainbow cats incoming!");
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "Nyan nyan nyan! Rainbow cats are taking over the internet!",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute WORLDCHANGER cheat - Fill screen with rotating HAX logos
   */
  editorInstance._executeCheatWorldChanger = function () {
    // Create container for rotating logos
    const logoContainer = globalThis.document.createElement("div");
    logoContainer.id = "worldchanger-effect";
    logoContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;

    // Create 20 rotating HAX logos
    for (let i = 0; i < 20; i++) {
      const logo = globalThis.document.createElement("img");
      logo.src = "https://github.com/haxtheweb.png";
      logo.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: 80px;
        height: 80px;
        animation: worldchanger-spin ${Math.random() * 3 + 2}s linear infinite;
        animation-delay: ${Math.random() * 2}s;
        opacity: 0.8;
        transform-origin: center;
      `;
      logoContainer.appendChild(logo);
    }

    // Add spinning animation CSS
    if (!globalThis.document.getElementById("worldchanger-animation")) {
      const style = globalThis.document.createElement("style");
      style.id = "worldchanger-animation";
      style.textContent = `
        @keyframes worldchanger-spin {
          0% {
            transform: rotate(0deg) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: rotate(180deg) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 0.8;
          }
        }
      `;
      globalThis.document.head.appendChild(style);
    }

    globalThis.document.body.appendChild(logoContainer);

    // Auto-remove after 15 seconds
    setTimeout(() => {
      const effect = globalThis.document.getElementById("worldchanger-effect");
      if (effect) {
        effect.remove();
      }
    }, 15000);

    HAXStore.toast("🌍 WORLD CHANGER ACTIVATED! Be the change!");
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "You must be the change you wish to see in the world",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute TECHNO cheat - Play techno music with screen effects
   */
  editorInstance._executeCheatTechno = function () {
    // Create modal for techno video
    const modal = globalThis.document.createElement("div");
    modal.id = "techno-modal";
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.9);
      z-index: 10000;
      display: flex;
      justify-content: center;
      align-items: center;
    `;

    const videoContainer = globalThis.document.createElement("div");
    videoContainer.style.cssText = `
      position: relative;
      max-width: 80%;
      max-height: 80%;
    `;

    const iframe = globalThis.document.createElement("iframe");
    iframe.src = "https://www.youtube.com/embed/JwZwkk7q25I?autoplay=1";
    iframe.style.cssText = `
      width: 560px;
      height: 315px;
      border: none;
      max-width: 100%;
      max-height: 100%;
    `;
    iframe.allow = "autoplay";

    videoContainer.appendChild(iframe);
    modal.appendChild(videoContainer);
    globalThis.document.body.appendChild(modal);

    // Store reference to effect intervals so we can stop them
    let technoIntervals = null;

    // Start screen effects after 23 seconds
    const effectsTimeout = setTimeout(() => {
      technoIntervals = startTechnoEffects();
    }, 23000);

    // Function to stop all effects
    const stopEffects = () => {
      clearTimeout(effectsTimeout);
      if (technoIntervals) {
        clearInterval(technoIntervals.blinkInterval);
        clearInterval(technoIntervals.effectInterval);
        clearTimeout(technoIntervals.stopTimeout);
        // Reset body styles
        const body = globalThis.document.body;
        body.style.backgroundColor = "";
        body.style.filter = "";
        HAXStore.toast("🎵 Techno party stopped!");
      }
    };

    // Close modal after clicking
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
        stopEffects();
      }
    });

    HAXStore.toast("🎵 TECHNO TIME! Get ready to party!");
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak("The system is down!");
    SuperDaemonInstance.close();
  };

  /**
   * Start techno screen effects (blur and random effects)
   */
  function startTechnoEffects() {
    const body = globalThis.document.body;
    let effectInterval;
    let blurInterval;

    // Random blur effect (replaces flashing)
    blurInterval = setInterval(() => {
      const blurAmount = Math.random() * 10; // 0-10px blur
      body.style.filter = `blur(${blurAmount}px) hue-rotate(${Math.random() * 360}deg)`;

      // Clear blur after random duration
      setTimeout(
        () => {
          body.style.filter = "";
        },
        Math.random() * 500 + 100,
      ); // 100-600ms duration
    }, 300); // Every 300ms

    // Random effects
    effectInterval = setInterval(() => {
      const effects = [
        "contrast(2)",
        "saturate(3)",
        "invert(1)",
        "sepia(1)",
        "grayscale(1)",
        "brightness(0.5)",
        "brightness(1.5)",
      ];
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      body.style.filter = randomEffect;

      setTimeout(() => {
        body.style.filter = "";
      }, 400);
    }, 1000);

    // Return intervals so they can be stopped externally
    const stopTimeout = setTimeout(() => {
      clearInterval(blurInterval);
      clearInterval(effectInterval);
      body.style.backgroundColor = "";
      body.style.filter = "";
      HAXStore.toast("🎵 Techno party over! Back to reality.");
    }, 30000);

    // Return intervals for external cleanup
    return {
      blinkInterval: blurInterval,
      effectInterval: effectInterval,
      stopTimeout: stopTimeout,
    };
  }

  /**
   * Execute CREDITS cheat - Show contributors with background music
   */
  editorInstance._executeCheatCredits = async function () {
    try {
      // Dynamically import github-rpg-contributors component
      await import("@haxtheweb/github-preview/lib/github-rpg-contributors.js");
    } catch (error) {
      console.warn("Failed to load github-rpg-contributors:", error);
      HAXStore.toast("🎬 Failed to load contributors component");
      return;
    }

    // Create modal for credits
    const modal = globalThis.document.createElement("div");
    modal.id = "credits-modal";
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.95);
      z-index: 10000;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 40px;
      box-sizing: border-box;
    `;

    // Create title
    const title = globalThis.document.createElement("h1");
    title.textContent = "HAXTheWeb Contributors";
    title.style.cssText = `
      color: white;
      font-size: 2.5em;
      margin-bottom: 30px;
      text-align: center;
      font-family: Arial, sans-serif;
    `;
    modal.appendChild(title);

    // Create contributor sections
    const contributorContainer = globalThis.document.createElement("div");
    contributorContainer.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 30px;
      max-height: 60vh;
      overflow-y: auto;
      width: 100%;
      max-width: 1200px;
    `;

    // HAX Lab contributors
    const haxLabSection = globalThis.document.createElement("div");
    haxLabSection.innerHTML = `
      <h2 style="color: #00ff88; text-align: center; margin-bottom: 15px;">HAX Lab Team</h2>
      <github-rpg-contributors org="haxtheweb" repo="hax-lab"></github-rpg-contributors>
    `;
    contributorContainer.appendChild(haxLabSection);

    // Create contributors
    const createSection = globalThis.document.createElement("div");
    createSection.innerHTML = `
      <h2 style="color: #ff8800; text-align: center; margin-bottom: 15px;">Create Team</h2>
      <github-rpg-contributors org="haxtheweb" repo="create"></github-rpg-contributors>
    `;
    contributorContainer.appendChild(createSection);

    // Webcomponents contributors
    const webcomponentsSection = globalThis.document.createElement("div");
    webcomponentsSection.innerHTML = `
      <h2 style="color: #8800ff; text-align: center; margin-bottom: 15px;">Webcomponents Team</h2>
      <github-rpg-contributors org="haxtheweb" repo="webcomponents"></github-rpg-contributors>
    `;
    contributorContainer.appendChild(webcomponentsSection);

    modal.appendChild(contributorContainer);

    // Create hidden background music iframe
    const musicIframe = globalThis.document.createElement("iframe");
    musicIframe.src = "https://www.youtube.com/embed/siWusSBld7k?autoplay=1";
    musicIframe.style.cssText = `
      position: fixed;
      top: -1000px;
      left: -1000px;
      width: 1px;
      height: 1px;
      border: none;
      opacity: 0;
      pointer-events: none;
    `;
    musicIframe.allow = "autoplay";
    globalThis.document.body.appendChild(musicIframe);

    globalThis.document.body.appendChild(modal);

    // Close modal and remove music when clicking outside content
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
        musicIframe.remove();
      }
    });

    HAXStore.toast("🎬 CREDITS ROLL! Thank you contributors!");
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "Thank you for helping to build something amazing, free, and ubiquitous",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute JOKER cheat - Chaotic joker and fire emojis with invisible video
   */
  editorInstance._executeCheatJoker = function () {
    // Create container for joker effect
    const jokerContainer = globalThis.document.createElement("div");
    jokerContainer.id = "joker-effect";
    jokerContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      overflow: hidden;
    `;

    // Create 100+ joker, fire, and money emojis
    const emojis = ["🃏", "🔥", "💰", "💸", "💵", "💴", "💶", "💷"]; // Joker, fire, and money emojis
    for (let i = 0; i < 150; i++) {
      const emoji = globalThis.document.createElement("div");
      emoji.className = "joker-emoji";
      emoji.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
      emoji.style.cssText = `
        position: absolute;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        font-size: ${Math.random() * 40 + 20}px;
        animation: joker-chaos ${Math.random() * 3 + 2}s linear infinite;
        animation-delay: ${Math.random() * 2}s;
        transform-origin: center;
      `;
      jokerContainer.appendChild(emoji);
    }

    // Add joker animation CSS
    if (!globalThis.document.getElementById("joker-animation")) {
      const style = globalThis.document.createElement("style");
      style.id = "joker-animation";
      style.textContent = `
        @keyframes joker-chaos {
          0% {
            transform: rotate(0deg) scale(0.5);
            opacity: 0.8;
          }
          25% {
            transform: rotate(90deg) scale(1.5);
            opacity: 1;
          }
          50% {
            transform: rotate(180deg) scale(0.8);
            opacity: 0.9;
          }
          75% {
            transform: rotate(270deg) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) scale(0.5);
            opacity: 0.8;
          }
        }
      `;
      globalThis.document.head.appendChild(style);
    }

    // Create hidden video iframe
    const hiddenVideo = globalThis.document.createElement("iframe");
    hiddenVideo.src = "https://www.youtube.com/embed/QS-B775PvRc?autoplay=1";
    hiddenVideo.style.cssText = `
      position: fixed;
      top: -1000px;
      left: -1000px;
      width: 1px;
      height: 1px;
      border: none;
      opacity: 0;
      pointer-events: none;
    `;
    hiddenVideo.allow = "autoplay";

    globalThis.document.body.appendChild(jokerContainer);
    globalThis.document.body.appendChild(hiddenVideo);

    // Remove effect after 10 seconds
    setTimeout(() => {
      if (jokerContainer.parentNode) {
        jokerContainer.remove();
      }
      if (hiddenVideo.parentNode) {
        hiddenVideo.remove();
      }
      HAXStore.toast("🃏 Joker chaos subsided... for now");
    }, 10000);

    HAXStore.toast("🃏 JOKER ACTIVATED! Chaos unleashed!");
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "It's not about the money, it's about sending a message",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute FURBY cheat - Late 90s Furby attack with pop-up windows
   */
  editorInstance._executeCheatFurby = function () {
    const furbyCardTexts = [
      "This electronic pet speaks its own language called 'Furbish'!",
      "Feed me, play with me, and I'll learn to speak English!",
      "I have over 800 different combinations of movements and sounds!",
      "My eyes are LCD screens that show different expressions!",
      "I can remember my name and respond when you call me!",
      "Pet my tummy and I'll giggle and purr like a real pet!",
      "I sleep when it's dark and wake up when there's light!",
      "I can get sick if you don't take good care of me!",
      "Each Furby has its own unique personality that develops over time!",
      "I'm equipped with advanced artificial intelligence from 1998!",
      "My voice recognition lets me learn new words from you!",
      "I can dance and sing along to music!",
      "Warning: May develop separation anxiety if left alone!",
      "Batteries not included. Requires 4 AA batteries.",
      "Ages 6 and up. Not suitable for children under 3.",
    ];

    const furbyColors = [
      "#ff69b4", // Hot pink
      "#ff1493", // Deep pink
      "#9370db", // Medium purple
      "#00ced1", // Dark turquoise
      "#32cd32", // Lime green
      "#ffd700", // Gold
      "#ff4500", // Orange red
      "#8a2be2", // Blue violet
    ];

    let popupCount = 0;
    const popupWindows = [];
    let furbyAttackActive = true;

    // Function to create a single Furby popup
    const createFurbyPopup = () => {
      if (!furbyAttackActive) return;

      popupCount++;

      // Play Furby spawn sound when each one appears
      const audioContext = new (globalThis.AudioContext ||
        globalThis.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Furby-like frequency with some randomness
      oscillator.frequency.setValueAtTime(
        350 + Math.random() * 300,
        audioContext.currentTime,
      );
      oscillator.type = "square";

      gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.4,
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.4);

      const popup = globalThis.document.createElement("div");
      popup.className = "furby-popup";
      popup.id = `furby-popup-${popupCount}`;

      const randomColor =
        furbyColors[Math.floor(Math.random() * furbyColors.length)];
      const randomCardText =
        furbyCardTexts[Math.floor(Math.random() * furbyCardTexts.length)];

      popup.style.cssText = `
        position: fixed;
        width: 320px;
        height: 240px;
        background: linear-gradient(45deg, ${randomColor}, #ffffff);
        border: 3px solid #333;
        border-radius: 15px;
        z-index: ${10000 + popupCount};
        box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 15px;
        font-family: 'Comic Sans MS', cursive, sans-serif;
        color: #333;
        text-align: center;
        animation: furby-bounce 0.8s ease-out;
        cursor: move;
        user-select: none;
      `;

      // Random position on screen
      const maxX = globalThis.innerWidth - 320;
      const maxY = globalThis.innerHeight - 240;
      const randomX = Math.max(0, Math.random() * maxX);
      const randomY = Math.max(0, Math.random() * maxY);

      popup.style.left = `${randomX}px`;
      popup.style.top = `${randomY}px`;

      // Furby trading card content
      popup.innerHTML = `
        <div style="font-size: 50px; margin-bottom: 8px;">👾</div>
        <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #ff0066;">FURBY™ #${popupCount}</div>
        <div style="font-size: 11px; line-height: 1.3; margin-bottom: 12px; background: rgba(255,255,255,0.8); padding: 8px; border-radius: 8px; border: 1px dashed #666;">${randomCardText}</div>
        <button id="close-furby-${popupCount}" style="
          background: #ff69b4;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 20px;
          cursor: pointer;
          font-weight: bold;
          font-size: 11px;
        ">Close Trading Card</button>
      `;

      // Add bounce animation CSS if not exists
      if (!globalThis.document.getElementById("furby-animation")) {
        const style = globalThis.document.createElement("style");
        style.id = "furby-animation";
        style.textContent = `
          @keyframes furby-bounce {
            0% {
              transform: scale(0) rotate(0deg);
              opacity: 0;
            }
            50% {
              transform: scale(1.2) rotate(180deg);
              opacity: 0.8;
            }
            100% {
              transform: scale(1) rotate(360deg);
              opacity: 1;
            }
          }
          @keyframes furby-wiggle {
            0%, 100% {
              transform: rotate(0deg);
            }
            25% {
              transform: rotate(5deg);
            }
            75% {
              transform: rotate(-5deg);
            }
          }
        `;
        globalThis.document.head.appendChild(style);
      }

      globalThis.document.body.appendChild(popup);
      popupWindows.push(popup);

      // Make popup draggable
      let isDragging = false;
      let dragOffsetX = 0;
      let dragOffsetY = 0;

      popup.addEventListener("mousedown", (e) => {
        if (e.target.tagName !== "BUTTON") {
          isDragging = true;
          dragOffsetX = e.clientX - popup.offsetLeft;
          dragOffsetY = e.clientY - popup.offsetTop;
          popup.style.cursor = "grabbing";
        }
      });

      globalThis.document.addEventListener("mousemove", (e) => {
        if (isDragging) {
          popup.style.left = `${e.clientX - dragOffsetX}px`;
          popup.style.top = `${e.clientY - dragOffsetY}px`;
        }
      });

      globalThis.document.addEventListener("mouseup", () => {
        isDragging = false;
        popup.style.cursor = "move";
      });

      // Add wiggle effect randomly
      const wiggleInterval = setInterval(
        () => {
          if (popup.parentNode && furbyAttackActive) {
            popup.style.animation = "furby-wiggle 0.5s ease-in-out";
            setTimeout(() => {
              if (popup.parentNode) {
                popup.style.animation = "";
              }
            }, 500);
          } else {
            clearInterval(wiggleInterval);
          }
        },
        Math.random() * 4000 + 2000,
      ); // Random between 2-6 seconds

      // Close button functionality - spawn two more when closed!
      const closeBtn = popup.querySelector(`#close-furby-${popupCount}`);
      closeBtn.addEventListener("click", () => {
        popup.style.animation = "furby-bounce 0.5s ease-in reverse";
        setTimeout(() => {
          if (popup.parentNode) {
            popup.remove();
            const index = popupWindows.indexOf(popup);
            if (index > -1) {
              popupWindows.splice(index, 1);
            }
          }
        }, 500);
        clearInterval(wiggleInterval);

        // Spawn two new Furbies when one is closed (hydra effect!)
        if (furbyAttackActive) {
          setTimeout(() => {
            createFurbyPopup();
            setTimeout(() => {
              createFurbyPopup();
            }, 200);
          }, 600);
        }
      });
    };

    // Create initial Furby (sound will be played by createFurbyPopup)
    createFurbyPopup();

    // Remove ALL Furbies after 20 seconds
    setTimeout(() => {
      furbyAttackActive = false;

      // Remove all existing Furby popups
      const allFurbyPopups =
        globalThis.document.querySelectorAll(".furby-popup");
      allFurbyPopups.forEach((popup) => {
        popup.style.animation = "furby-bounce 0.5s ease-in reverse";
        setTimeout(() => {
          if (popup.parentNode) {
            popup.remove();
          }
        }, 500);
      });

      // Clear the popupWindows array
      popupWindows.length = 0;

      HAXStore.toast(
        "👾 Furby attack ended! They returned to the digital realm!",
      );
    }, 20000);

    HAXStore.toast("👾 FURBY TRADING CARD ATTACK! Close one, two more appear!");
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "Me-dah-loo-loo! Each Furby carries ancient trading card wisdom!",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute WINDOWS95 cheat - Classic Windows 95 desktop experience
   */
  editorInstance._executeCheatWindows95 = function () {
    // Create the Windows 95 desktop overlay
    const win95Desktop = globalThis.document.createElement("div");
    win95Desktop.id = "windows95-desktop";
    win95Desktop.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #008080 25%, transparent 25%), 
                  linear-gradient(-45deg, #008080 25%, transparent 25%), 
                  linear-gradient(45deg, transparent 75%, #008080 75%), 
                  linear-gradient(-45deg, transparent 75%, #008080 75%);
      background-size: 4px 4px;
      background-position: 0 0, 0 2px, 2px -2px, -2px 0px;
      background-color: #c0c0c0;
      z-index: 10000;
      font-family: 'MS Sans Serif', sans-serif;
      cursor: default;
    `;

    // Create the taskbar
    const taskbar = globalThis.document.createElement("div");
    taskbar.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 40px;
      background: linear-gradient(to bottom, #d4d0c8 0%, #a0a0a0 100%);
      border-top: 2px solid #ffffff;
      display: flex;
      align-items: center;
      padding: 0 4px;
      box-sizing: border-box;
    `;

    // Create Start button
    const startButton = globalThis.document.createElement("button");
    startButton.innerHTML = `
      <span style="display: flex; align-items: center; gap: 4px;">
        🪟 <strong>Start</strong>
      </span>
    `;
    startButton.style.cssText = `
      height: 32px;
      padding: 0 16px;
      background: linear-gradient(to bottom, #f0f0f0 0%, #c0c0c0 100%);
      border: 2px outset #c0c0c0;
      font-family: inherit;
      font-size: 12px;
      cursor: pointer;
      margin-right: 8px;
    `;

    // Create system tray area
    const systemTray = globalThis.document.createElement("div");
    systemTray.innerHTML = `
      <span style="font-size: 11px; color: #000;">3:${String(new Date().getMinutes()).padStart(2, "0")} PM</span>
    `;
    systemTray.style.cssText = `
      margin-left: auto;
      padding: 0 8px;
      background: linear-gradient(to bottom, #e0e0e0 0%, #a0a0a0 100%);
      border: 1px inset #c0c0c0;
      height: 24px;
      display: flex;
      align-items: center;
    `;

    taskbar.appendChild(startButton);
    taskbar.appendChild(systemTray);
    win95Desktop.appendChild(taskbar);

    // Create desktop icons
    const desktopIcons = [
      { name: "My Computer", icon: "🖥️", x: 20, y: 20 },
      { name: "Recycle Bin", icon: "🗑️", x: 20, y: 100 },
      { name: "My Documents", icon: "📁", x: 20, y: 180 },
      { name: "Solitaire", icon: "🃏", x: 20, y: 260 },
      { name: "Paint", icon: "🎨", x: 20, y: 340 },
    ];

    desktopIcons.forEach((iconData) => {
      const icon = globalThis.document.createElement("div");
      icon.style.cssText = `
        position: absolute;
        left: ${iconData.x}px;
        top: ${iconData.y}px;
        width: 64px;
        height: 80px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: white;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        font-size: 11px;
        text-align: center;
        padding: 4px;
        user-select: none;
      `;

      icon.innerHTML = `
        <div style="font-size: 32px; margin-bottom: 4px;">${iconData.icon}</div>
        <div>${iconData.name}</div>
      `;

      // Add click handler for Solitaire
      if (iconData.name === "Solitaire") {
        icon.addEventListener("dblclick", () => {
          createSolitaireWindow();
        });
      }

      // Add click handler for Paint
      if (iconData.name === "Paint") {
        icon.addEventListener("dblclick", () => {
          createPaintWindow();
        });
      }

      win95Desktop.appendChild(icon);
    });

    // Function to create Solitaire window
    function createSolitaireWindow() {
      const solitaireWin = createWindow("Solitaire", 400, 300, 200, 150);
      solitaireWin.querySelector(".window-content").innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <div style="font-size: 60px; margin-bottom: 16px;">🃏</div>
          <p>Windows Solitaire</p>
          <p style="font-size: 11px; color: #666;">The classic card game!</p>
          <div style="margin-top: 20px;">
            <div style="display: inline-block; margin: 4px; padding: 8px 16px; background: #f0f0f0; border: 1px outset #c0c0c0;">♠️ ♥️</div>
            <div style="display: inline-block; margin: 4px; padding: 8px 16px; background: #f0f0f0; border: 1px outset #c0c0c0;">♣️ ♦️</div>
          </div>
        </div>
      `;
    }

    // Function to create Paint window
    function createPaintWindow() {
      const paintWin = createWindow("Paint", 480, 360, 150, 100);
      paintWin.querySelector(".window-content").innerHTML = `
        <div style="height: 100%; display: flex; flex-direction: column;">
          <div style="background: #f0f0f0; border-bottom: 1px solid #808080; padding: 4px;">
            <div style="display: inline-block; margin: 2px; padding: 4px 8px; background: #e0e0e0; border: 1px outset #c0c0c0; font-size: 11px;">🖌️ Brush</div>
            <div style="display: inline-block; margin: 2px; padding: 4px 8px; background: #e0e0e0; border: 1px outset #c0c0c0; font-size: 11px;">✏️ Pencil</div>
            <div style="display: inline-block; margin: 2px; padding: 4px 8px; background: #e0e0e0; border: 1px outset #c0c0c0; font-size: 11px;">🎨 Fill</div>
          </div>
          <div style="flex: 1; background: white; border: 2px inset #c0c0c0; margin: 4px; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #ccc;">
            🎨 Canvas Area 🎨
          </div>
        </div>
      `;
    }

    // Generic window creation function
    function createWindow(title, width, height, x, y) {
      const window = globalThis.document.createElement("div");
      window.className = "win95-window";
      window.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: ${width}px;
        height: ${height}px;
        background: #c0c0c0;
        border: 2px outset #c0c0c0;
        z-index: 10001;
      `;

      const titleBar = globalThis.document.createElement("div");
      titleBar.style.cssText = `
        height: 20px;
        background: linear-gradient(to right, #0000ff 0%, #8080ff 100%);
        color: white;
        font-weight: bold;
        font-size: 11px;
        display: flex;
        align-items: center;
        padding: 0 4px;
        cursor: move;
      `;
      titleBar.innerHTML = `
        <span>${title}</span>
        <button class="close-btn" style="
          margin-left: auto;
          width: 16px;
          height: 14px;
          background: #c0c0c0;
          border: 1px outset #c0c0c0;
          font-size: 10px;
          cursor: pointer;
          line-height: 1;
        ">×</button>
      `;

      const content = globalThis.document.createElement("div");
      content.className = "window-content";
      content.style.cssText = `
        height: calc(100% - 20px);
        background: #c0c0c0;
        overflow: hidden;
      `;

      window.appendChild(titleBar);
      window.appendChild(content);
      win95Desktop.appendChild(window);

      // Make window draggable
      let isDragging = false;
      let dragOffsetX = 0;
      let dragOffsetY = 0;

      titleBar.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("close-btn")) return;
        isDragging = true;
        dragOffsetX = e.clientX - window.offsetLeft;
        dragOffsetY = e.clientY - window.offsetTop;
        window.style.zIndex = "10002";
      });

      globalThis.document.addEventListener("mousemove", (e) => {
        if (isDragging) {
          window.style.left = `${e.clientX - dragOffsetX}px`;
          window.style.top = `${e.clientY - dragOffsetY}px`;
        }
      });

      globalThis.document.addEventListener("mouseup", () => {
        isDragging = false;
      });

      // Close button functionality
      titleBar.querySelector(".close-btn").addEventListener("click", () => {
        window.remove();
      });

      return window;
    }

    // Add Start menu functionality
    let startMenuOpen = false;
    const startMenu = globalThis.document.createElement("div");
    startMenu.style.cssText = `
      position: absolute;
      bottom: 40px;
      left: 4px;
      width: 200px;
      background: #c0c0c0;
      border: 2px outset #c0c0c0;
      display: none;
      z-index: 10003;
    `;

    const startMenuItems = [
      { name: "Programs", icon: "📁" },
      { name: "Documents", icon: "📄" },
      { name: "Settings", icon: "⚙️" },
      { name: "Find", icon: "🔍" },
      { name: "Help", icon: "❓" },
      { name: "Run...", icon: "▶️" },
      null, // separator
      { name: "Shut Down...", icon: "🔌" },
    ];

    startMenuItems.forEach((item) => {
      if (item === null) {
        const separator = globalThis.document.createElement("div");
        separator.style.cssText = `
          height: 1px;
          background: #808080;
          margin: 2px 8px;
        `;
        startMenu.appendChild(separator);
      } else {
        const menuItem = globalThis.document.createElement("div");
        menuItem.innerHTML = `${item.icon} ${item.name}`;
        menuItem.style.cssText = `
          padding: 4px 8px;
          font-size: 11px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
        `;
        menuItem.addEventListener("mouseenter", () => {
          menuItem.style.background = "#0000ff";
          menuItem.style.color = "white";
        });
        menuItem.addEventListener("mouseleave", () => {
          menuItem.style.background = "";
          menuItem.style.color = "";
        });

        if (item.name === "Shut Down...") {
          menuItem.addEventListener("click", () => {
            win95Desktop.style.animation = "fadeOut 1s ease-out forwards";
            setTimeout(() => {
              if (win95Desktop.parentNode) {
                win95Desktop.remove();
              }
            }, 1000);
          });
        }

        startMenu.appendChild(menuItem);
      }
    });

    win95Desktop.appendChild(startMenu);

    startButton.addEventListener("click", (e) => {
      e.stopPropagation();
      startMenuOpen = !startMenuOpen;
      startMenu.style.display = startMenuOpen ? "block" : "none";
      startButton.style.border = startMenuOpen
        ? "2px inset #c0c0c0"
        : "2px outset #c0c0c0";
    });

    // Close start menu when clicking elsewhere
    win95Desktop.addEventListener("click", () => {
      if (startMenuOpen) {
        startMenuOpen = false;
        startMenu.style.display = "none";
        startButton.style.border = "2px outset #c0c0c0";
      }
    });

    // Add CSS animation for shutdown
    if (!globalThis.document.getElementById("win95-animation")) {
      const style = globalThis.document.createElement("style");
      style.id = "win95-animation";
      style.textContent = `
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
      `;
      globalThis.document.head.appendChild(style);
    }

    globalThis.document.body.appendChild(win95Desktop);

    // Play Windows 95 startup sound (web audio)
    const audioContext = new (globalThis.AudioContext ||
      globalThis.webkitAudioContext)();

    // Create the classic Windows startup chord progression
    const playStartupSound = () => {
      const chords = [
        [261.63, 329.63, 392.0], // C major
        [293.66, 369.99, 440.0], // D minor
        [329.63, 415.3, 493.88], // E minor
        [261.63, 329.63, 392.0, 523.25], // C major octave
      ];

      chords.forEach((chord, index) => {
        setTimeout(() => {
          chord.forEach((freq) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
            oscillator.type = "sine";

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
              0.01,
              audioContext.currentTime + 1.5,
            );

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1.5);
          });
        }, index * 300);
      });
    };

    playStartupSound();

    HAXStore.toast("💻 WINDOWS 95 ACTIVATED! Welcome to the future!");
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "Welcome to Windows 95! The operating system of tomorrow, today!",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute ETERNALDARKNESS cheat - Sanity effects that mess with interface
   */
  editorInstance._executeCheatEternalDarkness = function () {
    // Check if eternal darkness is already active
    if (globalThis.eternalDarknessActive) {
      // Disable all effects
      globalThis.eternalDarknessActive = false;

      // Remove all eternal darkness elements
      const sanityMeter = globalThis.document.querySelector("#sanity-meter");
      if (sanityMeter) sanityMeter.remove();

      const errorModal = globalThis.document.querySelector(
        ".eternal-darkness-error",
      );
      if (errorModal) errorModal.remove();

      const volumeModal = globalThis.document.querySelector(
        ".eternal-darkness-volume",
      );
      if (volumeModal) volumeModal.remove();

      const overlay = globalThis.document.querySelector(
        ".eternal-darkness-overlay",
      );
      if (overlay) overlay.remove();

      // Restore body scale and cursor
      const body = globalThis.document.body;
      body.style.transform = "";
      body.style.transformOrigin = "";
      body.style.cursor = "";
      body.style.transition = "";

      // Clear all intervals and event listeners
      if (globalThis.eternalDarknessCleanup) {
        globalThis.eternalDarknessCleanup.forEach((cleanup) => cleanup());
        globalThis.eternalDarknessCleanup = [];
      }

      // Clear mouse event listeners
      if (globalThis.eternalDarknessMouseHandler) {
        globalThis.document.removeEventListener(
          "mousemove",
          globalThis.eternalDarknessMouseHandler,
        );
        globalThis.eternalDarknessMouseHandler = null;
      }

      // Clear sanity mouse handler
      if (globalThis.eternalDarknessSanityHandler) {
        globalThis.document.removeEventListener(
          "mousemove",
          globalThis.eternalDarknessSanityHandler,
        );
        globalThis.eternalDarknessSanityHandler = null;
      }

      // Flash white to indicate deactivation
      const flash = globalThis.document.createElement("div");
      flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 10007;
        pointer-events: none;
        animation: eternal-flash 0.5s ease-out;
      `;
      globalThis.document.body.appendChild(flash);

      setTimeout(() => {
        flash.remove();
      }, 500);

      HAXStore.toast("🌙 ETERNAL DARKNESS DISABLED - Sanity restored!");
      SuperDaemonInstance.merlinSpeak("The nightmare ends... for now.");
      SuperDaemonInstance.close();
      return;
    }

    // Activate eternal darkness
    globalThis.eternalDarknessActive = true;
    globalThis.eternalDarknessCleanup = globalThis.eternalDarknessCleanup || [];

    const sanityEffects = [
      "contentDisappear",
      "fakeError",
      "volumeMeter",
      "cursorGlitch",
      "buttonSwap",
      "textScramble",
      "mouseScaleDown",
      "mouseScaleUp",
      "zombieInvasion",
    ];

    // Create persistent sanity meter
    const sanityMeter = globalThis.document.createElement("div");
    sanityMeter.id = "sanity-meter";
    sanityMeter.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 200px;
      height: 30px;
      background: #333;
      border: 2px solid #666;
      border-radius: 15px;
      overflow: hidden;
      z-index: 10005;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Courier New', monospace;
      color: white;
      font-size: 12px;
    `;

    const sanityBar = globalThis.document.createElement("div");
    sanityBar.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background: linear-gradient(90deg, #ff0000, #ff6600, #ffff00, #00ff00);
      transition: width 0.3s ease;
    `;

    const sanityText = globalThis.document.createElement("div");
    sanityText.textContent = "SANITY";
    sanityText.style.cssText = `
      position: relative;
      z-index: 1;
      font-weight: bold;
      text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
    `;

    sanityMeter.appendChild(sanityBar);
    sanityMeter.appendChild(sanityText);
    globalThis.document.body.appendChild(sanityMeter);

    // Mouse-reactive sanity system
    let currentSanityLevel = 100;
    let effectInProgress = false;

    const sanityMouseHandler = (e) => {
      if (!globalThis.eternalDarknessActive) return;

      // Calculate distance from center of screen
      const centerX = globalThis.innerWidth / 2;
      const centerY = globalThis.innerHeight / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2),
      );
      const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

      // Calculate sanity based on distance from center (closer = more sanity)
      const distanceRatio = Math.min(1, distance / maxDistance);
      const targetSanity = Math.max(10, 100 - distanceRatio * 90); // Range: 10-100%

      // Gradually adjust sanity toward target
      if (currentSanityLevel < targetSanity) {
        currentSanityLevel = Math.min(targetSanity, currentSanityLevel + 1);
      } else if (currentSanityLevel > targetSanity) {
        currentSanityLevel = Math.max(targetSanity, currentSanityLevel - 1);
      }

      // Update sanity bar
      const currentSanityBar =
        globalThis.document.querySelector("#sanity-meter div");
      if (currentSanityBar) {
        currentSanityBar.style.width = currentSanityLevel + "%";

        // Change color based on sanity level
        if (currentSanityLevel < 30) {
          currentSanityBar.style.background = "#ff0000"; // Red when low
        } else if (currentSanityLevel < 60) {
          currentSanityBar.style.background =
            "linear-gradient(90deg, #ff0000, #ff6600, #ffff00)"; // Red to yellow
        } else {
          currentSanityBar.style.background =
            "linear-gradient(90deg, #ff0000, #ff6600, #ffff00, #00ff00)"; // Full spectrum
        }
      }

      // Trigger effect if sanity drops below 30% and no effect in progress
      if (currentSanityLevel < 30 && !effectInProgress) {
        effectInProgress = true;
        const randomEffect =
          sanityEffects[Math.floor(Math.random() * sanityEffects.length)];
        executeSanityEffect(randomEffect);

        // Reset effect flag after effect completes (5 seconds + 3 second recovery)
        setTimeout(() => {
          effectInProgress = false;
        }, 8000);
      }
    };

    // Set up mouse tracking
    globalThis.document.addEventListener("mousemove", sanityMouseHandler);
    globalThis.eternalDarknessSanityHandler = sanityMouseHandler;
    globalThis.eternalDarknessCleanup.push(() => {
      globalThis.document.removeEventListener("mousemove", sanityMouseHandler);
      globalThis.eternalDarknessSanityHandler = null;
    });

    function executeSanityEffect(effect) {
      let effectCleanup = null;

      switch (effect) {
        case "contentDisappear":
          const editButtons = globalThis.document.querySelectorAll(
            '[data-hax-ray="editButton"], button[aria-label*="edit"], .edit-btn',
          );
          const originalContent = [];

          editButtons.forEach((btn, index) => {
            const clickHandler = () => {
              const pageContent = globalThis.document.querySelector(
                'page-contents, haxcms-site-body, [data-hax-ray="body"], main',
              );
              if (pageContent) {
                originalContent[index] = pageContent.innerHTML;
                pageContent.innerHTML =
                  '<div style="padding: 100px; text-align: center; color: #666; font-style: italic; font-size: 24px;">The content has vanished into the void...</div>';
              }
            };
            btn.addEventListener("click", clickHandler, { once: true });
          });

          effectCleanup = () => {
            const pageContent = globalThis.document.querySelector(
              'page-contents, haxcms-site-body, [data-hax-ray="body"], main',
            );
            if (pageContent && originalContent.length > 0) {
              pageContent.innerHTML =
                originalContent[0] || pageContent.innerHTML;
            }
          };
          break;

        case "fakeError":
          const errorModal = globalThis.document.createElement("div");
          errorModal.className = "eternal-darkness-error";
          errorModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #c0c0c0;
            border: 2px outset #c0c0c0;
            padding: 20px;
            z-index: 10006;
            font-family: 'MS Sans Serif', sans-serif;
            box-shadow: 4px 4px 8px rgba(0,0,0,0.5);
            min-width: 300px;
          `;

          errorModal.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
              <div style="font-size: 24px;">⚠️</div>
              <div><strong>Cosmic Horror Alert</strong></div>
            </div>
            <div style="margin-bottom: 15px;">Your sanity has been compromised by an ancient entity. All data may be corrupted.</div>
            <div style="text-align: right;">
              <button style="padding: 4px 12px; background: #e0e0e0; border: 1px outset #c0c0c0; margin-right: 8px;">Save Anyway</button>
              <button style="padding: 4px 12px; background: #e0e0e0; border: 1px outset #c0c0c0;">Cancel</button>
            </div>
          `;

          errorModal.querySelectorAll("button").forEach((btn) => {
            btn.addEventListener("click", () => {
              errorModal.remove();
            });
          });

          globalThis.document.body.appendChild(errorModal);
          effectCleanup = () => {
            if (errorModal.parentNode) errorModal.remove();
          };
          break;

        case "volumeMeter":
          const volumeModal = globalThis.document.createElement("div");
          volumeModal.className = "eternal-darkness-volume";
          volumeModal.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.9);
            color: #ff0000;
            padding: 25px;
            border: 2px solid #ff0000;
            border-radius: 10px;
            z-index: 10006;
            font-family: 'Courier New', monospace;
            text-align: center;
          `;

          volumeModal.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 10px;">🔊 VOLUME CORRUPTED</div>
            <div style="width: 250px; height: 25px; background: #330000; border: 1px solid #ff0000; position: relative; margin: 15px auto;">
              <div id="fake-volume-bar" style="height: 100%; background: linear-gradient(90deg, #ff0000, #ff6666); width: 0%; transition: width 0.3s;"></div>
            </div>
            <div style="margin-top: 15px; font-size: 12px; color: #ff6666;">Unknown entity is manipulating audio levels</div>
            <div style="margin-top: 10px; font-size: 10px; opacity: 0.7;">This cannot be happening...</div>
          `;

          globalThis.document.body.appendChild(volumeModal);

          const volumeBar = volumeModal.querySelector("#fake-volume-bar");
          const volumeInterval = setInterval(() => {
            const volumeLevel = Math.floor(Math.random() * 100);
            volumeBar.style.width = volumeLevel + "%";
          }, 150);

          effectCleanup = () => {
            clearInterval(volumeInterval);
            if (volumeModal.parentNode) volumeModal.remove();
          };
          globalThis.eternalDarknessCleanup.push(() =>
            clearInterval(volumeInterval),
          );
          break;

        case "cursorGlitch":
          const originalCursor = globalThis.document.body.style.cursor;
          const cursors = [
            "wait",
            "not-allowed",
            "crosshair",
            "move",
            "text",
            "progress",
            "grab",
            "pointer",
          ];
          let cursorIndex = 0;

          const cursorInterval = setInterval(() => {
            globalThis.document.body.style.cursor =
              cursors[cursorIndex % cursors.length];
            cursorIndex++;
          }, 200);

          effectCleanup = () => {
            clearInterval(cursorInterval);
            globalThis.document.body.style.cursor = originalCursor;
          };
          globalThis.eternalDarknessCleanup.push(() =>
            clearInterval(cursorInterval),
          );
          break;

        case "zombieInvasion":
          const invasionContainer = globalThis.document.createElement("div");
          invasionContainer.className = "eternal-darkness-invasion";
          invasionContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10004;
            overflow: hidden;
          `;

          // Create multiple zombies that grow over time
          const zombies = [];
          for (let i = 0; i < 20; i++) {
            const zombie = globalThis.document.createElement("div");
            zombie.textContent = "🧟‍♂️";
            zombie.style.cssText = `
              position: absolute;
              left: ${Math.random() * 100}%;
              top: ${Math.random() * 100}%;
              font-size: 20px;
              transition: font-size 0.5s ease-out;
              animation: zombie-float ${Math.random() * 3 + 2}s ease-in-out infinite alternate;
            `;
            invasionContainer.appendChild(zombie);
            zombies.push(zombie);
          }

          // Create giant boss creatures
          const bosses = [
            { emoji: "🦂", name: "scorpion" },
            { emoji: "🦑", name: "squid" },
            { emoji: "🧙‍♂️", name: "wizard" },
            { emoji: "💀", name: "skeleton" },
          ];

          bosses.forEach((boss, index) => {
            const bossElement = globalThis.document.createElement("div");
            bossElement.textContent = boss.emoji;
            bossElement.className = `boss-${boss.name}`;
            bossElement.style.cssText = `
              position: absolute;
              left: ${index * 25 + 10}%;
              top: ${Math.random() * 50 + 20}%;
              font-size: 60px;
              transition: font-size 1s ease-out, transform 0.3s ease-in-out;
              animation: boss-menace ${Math.random() * 2 + 3}s ease-in-out infinite alternate;
              filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.7));
            `;
            invasionContainer.appendChild(bossElement);
          });

          // Add invasion animation CSS
          if (!globalThis.document.getElementById("invasion-animation")) {
            const style = globalThis.document.createElement("style");
            style.id = "invasion-animation";
            style.textContent = `
              @keyframes zombie-float {
                0% {
                  transform: translateY(0px) rotate(0deg);
                }
                100% {
                  transform: translateY(-20px) rotate(5deg);
                }
              }
              @keyframes boss-menace {
                0% {
                  transform: scale(1) rotate(-2deg);
                  filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.7));
                }
                100% {
                  transform: scale(1.1) rotate(2deg);
                  filter: drop-shadow(0 0 20px rgba(255, 0, 0, 1));
                }
              }
            `;
            globalThis.document.head.appendChild(style);
          }

          globalThis.document.body.appendChild(invasionContainer);

          // Grow zombies over time
          let growthStage = 0;
          const growthInterval = setInterval(() => {
            growthStage++;
            zombies.forEach((zombie) => {
              const newSize = 20 + growthStage * 8;
              zombie.style.fontSize = newSize + "px";

              // Add more intense effects as they grow
              if (growthStage > 5) {
                zombie.style.filter = "hue-rotate(120deg) saturate(1.5)";
              }
              if (growthStage > 8) {
                zombie.style.textShadow = "0 0 10px #ff0000";
              }
            });

            // Grow bosses too
            const bossElements =
              invasionContainer.querySelectorAll('[class^="boss-"]');
            bossElements.forEach((boss) => {
              const newSize = 60 + growthStage * 10;
              boss.style.fontSize = newSize + "px";

              if (growthStage > 6) {
                boss.style.filter =
                  "drop-shadow(0 0 30px rgba(255, 0, 0, 1)) hue-rotate(30deg)";
              }
            });

            // Stop growing after 12 stages
            if (growthStage >= 12) {
              clearInterval(growthInterval);
            }
          }, 400);

          effectCleanup = () => {
            clearInterval(growthInterval);
            if (invasionContainer.parentNode) invasionContainer.remove();
          };
          globalThis.eternalDarknessCleanup.push(() =>
            clearInterval(growthInterval),
          );
          break;

        case "buttonSwap":
          const buttons = globalThis.document.querySelectorAll("button");
          const originalButtonTexts = [];

          buttons.forEach((btn, index) => {
            if (btn.textContent.trim()) {
              originalButtonTexts[index] = btn.textContent;
              btn.textContent = btn.textContent.split("").reverse().join("");
            }
          });

          effectCleanup = () => {
            buttons.forEach((btn, index) => {
              if (originalButtonTexts[index]) {
                btn.textContent = originalButtonTexts[index];
              }
            });
          };
          break;

        case "textScramble":
          const textElements = globalThis.document.querySelectorAll(
            "p, h1, h2, h3, h4, h5, h6, span, div",
          );
          const originalElementTexts = [];

          textElements.forEach((elem, index) => {
            if (
              elem.textContent.trim() &&
              elem.children.length === 0 &&
              elem.textContent.length < 100
            ) {
              originalElementTexts[index] = elem.textContent;
              const scrambled = elem.textContent
                .split("")
                .map(() =>
                  String.fromCharCode(33 + Math.floor(Math.random() * 94)),
                )
                .join("");
              elem.textContent = scrambled;
            }
          });

          effectCleanup = () => {
            textElements.forEach((elem, index) => {
              if (originalElementTexts[index]) {
                elem.textContent = originalElementTexts[index];
              }
            });
          };
          break;

        case "mouseScaleDown":
          const body = globalThis.document.body;
          body.style.transformOrigin = "center center";
          body.style.transition = "transform 0.1s ease-out";

          const mouseDownHandler = (e) => {
            const centerX = globalThis.innerWidth / 2;
            const centerY = globalThis.innerHeight / 2;
            const distance = Math.sqrt(
              Math.pow(e.clientX - centerX, 2) +
                Math.pow(e.clientY - centerY, 2),
            );
            const maxDistance = Math.sqrt(
              centerX * centerX + centerY * centerY,
            );
            const scaleFactor = Math.max(
              0.3,
              1 - (distance / maxDistance) * 0.7,
            );

            body.style.transform = `scale(${scaleFactor})`;
          };

          globalThis.document.addEventListener("mousemove", mouseDownHandler);
          globalThis.eternalDarknessMouseHandler = mouseDownHandler;

          effectCleanup = () => {
            globalThis.document.removeEventListener(
              "mousemove",
              mouseDownHandler,
            );
            body.style.transform = "";
            body.style.transformOrigin = "";
            body.style.transition = "";
          };
          break;

        case "mouseScaleUp":
          const bodyUp = globalThis.document.body;
          bodyUp.style.transformOrigin = "center center";
          bodyUp.style.transition = "transform 0.1s ease-out";

          const mouseUpHandler = (e) => {
            const centerX = globalThis.innerWidth / 2;
            const centerY = globalThis.innerHeight / 2;
            const distance = Math.sqrt(
              Math.pow(e.clientX - centerX, 2) +
                Math.pow(e.clientY - centerY, 2),
            );
            const maxDistance = Math.sqrt(
              centerX * centerX + centerY * centerY,
            );
            const scaleFactor = Math.min(3, 1 + (distance / maxDistance) * 2);

            bodyUp.style.transform = `scale(${scaleFactor})`;
          };

          globalThis.document.addEventListener("mousemove", mouseUpHandler);
          globalThis.eternalDarknessMouseHandler = mouseUpHandler;

          effectCleanup = () => {
            globalThis.document.removeEventListener(
              "mousemove",
              mouseUpHandler,
            );
            bodyUp.style.transform = "";
            bodyUp.style.transformOrigin = "";
            bodyUp.style.transition = "";
          };
          break;
      }

      // Store cleanup function
      if (effectCleanup) {
        globalThis.eternalDarknessCleanup.push(effectCleanup);
      }

      // After 5 seconds, show restoration sequence but keep effects going
      setTimeout(() => {
        if (!globalThis.eternalDarknessActive) return;

        // Don't restore sanity meter automatically - let mouse position control it

        // Screen flash effect
        const flash = globalThis.document.createElement("div");
        flash.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
          z-index: 10007;
          pointer-events: none;
          animation: eternal-flash 0.8s ease-out;
        `;

        // Add flash animation CSS
        if (!globalThis.document.getElementById("eternal-darkness-animation")) {
          const style = globalThis.document.createElement("style");
          style.id = "eternal-darkness-animation";
          style.textContent = `
            @keyframes eternal-flash {
              0% { opacity: 0; }
              25% { opacity: 0.8; }
              50% { opacity: 1; }
              75% { opacity: 0.8; }
              100% { opacity: 0; }
            }
          `;
          globalThis.document.head.appendChild(style);
        }

        globalThis.document.body.appendChild(flash);

        // Remove flash after animation
        setTimeout(() => {
          if (flash.parentNode) flash.remove();
        }, 800);

        // Play the signature voice line
        SuperDaemonInstance.merlinSpeak("This. Can't. Be. Happening.");

        // Cleanup current effect but keep the system active
        if (effectCleanup) {
          effectCleanup();
        }
      }, 5000);
    }

    HAXStore.toast("🌙 ETERNAL DARKNESS - Your sanity slips away...");
    store.playSound("success");
    SuperDaemonInstance.close();
  };

  /**
   * Execute YTMND cheat - You're The Man Now Dog meme experience
   */
  editorInstance._executeCheatYTMND = function () {
    // Create YTMND overlay
    const ytmndOverlay = globalThis.document.createElement("div");
    ytmndOverlay.id = "ytmnd-overlay";
    ytmndOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, #ff0000, #00ff00, #0000ff, #ffff00, #ff00ff);
      z-index: 10000;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Create spinning image container
    const imageContainer = globalThis.document.createElement("div");
    imageContainer.style.cssText = `
      width: 300px;
      height: 300px;
      animation: ytmnd-spin 2s linear infinite, ytmnd-zoom 3s ease-in-out infinite alternate;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 200px;
    `;
    imageContainer.innerHTML = "😎"; // Cool face emoji

    // Create impact text overlay
    const textOverlay = globalThis.document.createElement("div");
    textOverlay.innerHTML = "YOU'RE THE MAN NOW DOG!";
    textOverlay.style.cssText = `
      position: absolute;
      top: 20%;
      left: 50%;
      transform: translateX(-50%);
      font-family: Impact, 'Arial Black', sans-serif;
      font-size: 48px;
      font-weight: bold;
      color: white;
      text-shadow: 3px 3px 0px black, -3px -3px 0px black, 3px -3px 0px black, -3px 3px 0px black;
      text-align: center;
      animation: ytmnd-text-bounce 1s ease-in-out infinite alternate;
    `;

    // Create bottom text
    const bottomText = globalThis.document.createElement("div");
    bottomText.innerHTML = "NEDM CAT HAS CLASS";
    bottomText.style.cssText = `
      position: absolute;
      bottom: 20%;
      left: 50%;
      transform: translateX(-50%);
      font-family: Impact, 'Arial Black', sans-serif;
      font-size: 32px;
      font-weight: bold;
      color: yellow;
      text-shadow: 2px 2px 0px red, -2px -2px 0px red, 2px -2px 0px red, -2px 2px 0px red;
      text-align: center;
      animation: ytmnd-text-flash 0.5s linear infinite;
    `;

    ytmndOverlay.appendChild(imageContainer);
    ytmndOverlay.appendChild(textOverlay);
    ytmndOverlay.appendChild(bottomText);

    // Add YTMND animations
    if (!globalThis.document.getElementById("ytmnd-animations")) {
      const style = globalThis.document.createElement("style");
      style.id = "ytmnd-animations";
      style.textContent = `
        @keyframes ytmnd-spin {
          0% { transform: rotate(0deg) scale(1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes ytmnd-zoom {
          0% { transform: scale(0.8); }
          100% { transform: scale(1.2); }
        }
        @keyframes ytmnd-text-bounce {
          0% { transform: translateX(-50%) scale(1); }
          100% { transform: translateX(-50%) scale(1.1); }
        }
        @keyframes ytmnd-text-flash {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `;
      globalThis.document.head.appendChild(style);
    }

    globalThis.document.body.appendChild(ytmndOverlay);

    // Play repeating audio loop
    const audioContext = new (globalThis.AudioContext ||
      globalThis.webkitAudioContext)();
    let audioInterval = setInterval(() => {
      // Play YTMND-style beeping melody
      const notes = [440, 554, 659, 440]; // A, C#, E, A
      notes.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = "square";

          gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.3,
          );

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.3);
        }, index * 200);
      });
    }, 1500);

    // Auto remove after 15 seconds
    setTimeout(() => {
      clearInterval(audioInterval);
      if (ytmndOverlay.parentNode) {
        ytmndOverlay.remove();
      }
    }, 15000);

    // Click to close
    ytmndOverlay.addEventListener("click", () => {
      clearInterval(audioInterval);
      ytmndOverlay.remove();
    });

    HAXStore.toast("🎵 YTMND ACTIVATED! You're the man now, dog!");
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "You're the man now, dog! Welcome to the golden age of internet memes!",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute GEOCITIES cheat - Classic 90s website makeover
   */
  editorInstance._executeCheatGeocities = function () {
    // Create Geocities overlay
    const geocitiesOverlay = globalThis.document.createElement("div");
    geocitiesOverlay.id = "geocities-overlay";
    geocitiesOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000);
      background-size: 400% 400%;
      animation: geocities-rainbow 3s ease infinite;
      z-index: 10000;
      overflow-y: auto;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      padding: 20px;
      box-sizing: border-box;
    `;

    // Create Geocities content
    geocitiesOverlay.innerHTML = `
      <div style="text-align: center; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
        <h1 style="font-size: 48px; animation: geocities-blink 1s linear infinite; margin: 20px 0;">🏗️ UNDER CONSTRUCTION 🏗️</h1>
        
        <div style="background: rgba(255,255,0,0.9); color: black; padding: 10px; margin: 20px auto; width: fit-content; border: 3px dashed red; animation: geocities-bounce 2s ease-in-out infinite;">
          <h2>Welcome to My HomePage!!!</h2>
          <p>Last Updated: December 31, 1999 🎆</p>
        </div>

        <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; margin: 30px 0;">
          <div style="animation: geocities-spin 3s linear infinite;">🌟</div>
          <div style="animation: geocities-spin 3s linear infinite reverse;">✨</div>
          <div style="animation: geocities-bounce 1.5s ease-in-out infinite;">🎉</div>
          <div style="animation: geocities-spin 3s linear infinite;">🌈</div>
          <div style="animation: geocities-bounce 1.5s ease-in-out infinite reverse;">🦄</div>
        </div>

        <div style="background: rgba(0,0,255,0.8); color: white; padding: 15px; margin: 20px auto; width: 80%; max-width: 600px; border: 2px solid yellow;">
          <h3 style="animation: geocities-blink 0.5s linear infinite;">📊 VISITOR COUNTER 📊</h3>
          <div style="font-size: 24px; font-weight: bold; color: lime;">You are visitor #${Math.floor(Math.random() * 999999) + 100000}</div>
        </div>

        <div style="background: rgba(255,0,255,0.7); padding: 20px; margin: 20px auto; width: 80%; max-width: 500px; border: 3px ridge gold;">
          <h3>🎵 NOW PLAYING 🎵</h3>
          <p style="font-size: 14px; animation: geocities-scroll 10s linear infinite;">♪ Hamster Dance - The Ultimate Web Experience ♪ ~ Welcome to my site, please sign my guestbook! ~ ♪ MIDI music playing in background ♪</p>
        </div>

        <div style="margin: 30px 0; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
          <div style="background: rgba(255,255,255,0.9); color: black; padding: 8px 15px; border: 2px outset gray; animation: geocities-bounce 2s ease-in-out infinite;">📧 E-mail Me!</div>
          <div style="background: rgba(255,255,255,0.9); color: black; padding: 8px 15px; border: 2px outset gray; animation: geocities-bounce 2s ease-in-out infinite 0.5s;">📝 Sign Guestbook</div>
          <div style="background: rgba(255,255,255,0.9); color: black; padding: 8px 15px; border: 2px outset gray; animation: geocities-bounce 2s ease-in-out infinite 1s;">🔗 Cool Links</div>
        </div>

        <div style="position: fixed; bottom: 20px; right: 20px; background: rgba(255,255,0,0.9); color: black; padding: 10px; border: 2px solid red; animation: geocities-blink 2s linear infinite;">
          <div style="font-weight: bold;">Best viewed in:</div>
          <div>Netscape Navigator 4.0</div>
          <div>800x600 Resolution</div>
        </div>

        <div style="margin-top: 40px; font-size: 12px; animation: geocities-blink 3s linear infinite;">
          <p>This site is part of the WebRing!</p>
          <div style="display: flex; justify-content: center; gap: 10px; margin: 10px 0;">
            <button style="background: lime; border: 2px outset gray; padding: 5px;">⬅️ Prev</button>
            <button style="background: yellow; border: 2px outset gray; padding: 5px;">🏠 Home</button>
            <button style="background: cyan; border: 2px outset gray; padding: 5px;">➡️ Next</button>
            <button style="background: pink; border: 2px outset gray; padding: 5px;">🎲 Random</button>
          </div>
        </div>
      </div>
    `;

    // Add Geocities animations
    if (!globalThis.document.getElementById("geocities-animations")) {
      const style = globalThis.document.createElement("style");
      style.id = "geocities-animations";
      style.textContent = `
        @keyframes geocities-rainbow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes geocities-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes geocities-bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes geocities-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes geocities-scroll {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `;
      globalThis.document.head.appendChild(style);
    }

    globalThis.document.body.appendChild(geocitiesOverlay);

    // Play MIDI-style background music
    const audioContext = new (globalThis.AudioContext ||
      globalThis.webkitAudioContext)();
    const playMIDIStyle = () => {
      const melody = [261, 294, 329, 349, 392, 440, 493, 523]; // C major scale
      let noteIndex = 0;

      const playNote = () => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(
          melody[noteIndex],
          audioContext.currentTime,
        );
        oscillator.type = "square";

        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5,
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);

        noteIndex = (noteIndex + 1) % melody.length;
      };

      return setInterval(playNote, 600);
    };

    const musicInterval = playMIDIStyle();

    // Auto remove after 20 seconds
    setTimeout(() => {
      clearInterval(musicInterval);
      if (geocitiesOverlay.parentNode) {
        geocitiesOverlay.remove();
      }
    }, 20000);

    // Click to close
    geocitiesOverlay.addEventListener("click", () => {
      clearInterval(musicInterval);
      geocitiesOverlay.remove();
    });

    HAXStore.toast("🌈 GEOCITIES ACTIVATED! Welcome to 1999!");
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "Welcome to the information superhighway! Don't forget to sign the guestbook!",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute CLIPPY cheat - Microsoft Office Assistant
   */
  editorInstance._executeCheatClippy = function () {
    // Create Clippy character
    const clippy = globalThis.document.createElement("div");
    clippy.id = "clippy-assistant";
    clippy.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 50px;
      width: 80px;
      height: 100px;
      z-index: 10001;
      cursor: pointer;
      animation: clippy-bounce 2s ease-in-out infinite;
    `;

    // Clippy visual representation
    clippy.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #c0c0c0 0%, #ffffff 50%, #c0c0c0 100%);
        border: 2px solid #808080;
        border-radius: 20px 5px 5px 20px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
      ">
        📎
        <div style="
          position: absolute;
          top: 15px;
          right: 15px;
          width: 8px;
          height: 8px;
          background: black;
          border-radius: 50%;
          animation: clippy-blink 3s infinite;
        "></div>
        <div style="
          position: absolute;
          top: 15px;
          right: 25px;
          width: 8px;
          height: 8px;
          background: black;
          border-radius: 50%;
          animation: clippy-blink 3s infinite 0.1s;
        "></div>
      </div>
    `;

    // Create speech bubble
    let speechBubble = null;
    const clippyPhrases = [
      "It looks like you're trying to write a document. Would you like help?",
      "I see you're working on a website. Want some tips?",
      "It appears you're using HAX. That's pretty cool!",
      "Would you like me to help you format that text?",
      "I notice you're clicking around. Need assistance?",
      "It looks like you're trying to be productive. How can I help?",
      "I see you're using a modern web browser. Fancy!",
      "Would you like me to search for 'How to disable Clippy'?",
      "It appears you're annoyed by me. That's normal!",
      "I'm here to help whether you want it or not!",
    ];

    const showSpeechBubble = (message) => {
      // Remove existing bubble
      if (speechBubble) {
        speechBubble.remove();
      }

      speechBubble = globalThis.document.createElement("div");
      speechBubble.style.cssText = `
        position: fixed;
        bottom: 200px;
        right: 20px;
        width: 250px;
        background: #fffacd;
        border: 2px solid #000;
        border-radius: 10px;
        padding: 12px;
        font-family: 'MS Sans Serif', sans-serif;
        font-size: 12px;
        color: #000;
        z-index: 10002;
        box-shadow: 3px 3px 8px rgba(0,0,0,0.3);
        animation: clippy-bubble-appear 0.3s ease-out;
      `;

      speechBubble.innerHTML = `
        <div>${message}</div>
        <div style="
          position: absolute;
          bottom: -10px;
          left: 30px;
          width: 0;
          height: 0;
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 10px solid #fffacd;
        "></div>
        <div style="
          position: absolute;
          bottom: -12px;
          left: 28px;
          width: 0;
          height: 0;
          border-left: 12px solid transparent;
          border-right: 12px solid transparent;
          border-top: 12px solid #000;
        "></div>
        <button style="
          position: absolute;
          top: 5px;
          right: 5px;
          width: 16px;
          height: 16px;
          background: #c0c0c0;
          border: 1px outset #c0c0c0;
          font-size: 10px;
          cursor: pointer;
          line-height: 1;
        ">×</button>
      `;

      globalThis.document.body.appendChild(speechBubble);

      // Close button for speech bubble
      speechBubble.querySelector("button").addEventListener("click", () => {
        speechBubble.remove();
        speechBubble = null;
      });

      // Auto-hide after 5 seconds
      setTimeout(() => {
        if (speechBubble && speechBubble.parentNode) {
          speechBubble.remove();
          speechBubble = null;
        }
      }, 5000);
    };

    // Add Clippy animations
    if (!globalThis.document.getElementById("clippy-animations")) {
      const style = globalThis.document.createElement("style");
      style.id = "clippy-animations";
      style.textContent = `
        @keyframes clippy-bounce {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(2deg); }
          75% { transform: translateY(-2px) rotate(-1deg); }
        }
        @keyframes clippy-blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0; }
        }
        @keyframes clippy-bubble-appear {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0px);
          }
        }
      `;
      globalThis.document.head.appendChild(style);
    }

    globalThis.document.body.appendChild(clippy);

    // Show initial message
    setTimeout(() => {
      showSpeechBubble(clippyPhrases[0]);
    }, 1000);

    // Random helpful suggestions
    const suggestionInterval = setInterval(() => {
      const randomPhrase =
        clippyPhrases[Math.floor(Math.random() * clippyPhrases.length)];
      showSpeechBubble(randomPhrase);
    }, 8000);

    // Click interactions
    let clickCount = 0;
    clippy.addEventListener("click", () => {
      clickCount++;
      const clickResponses = [
        "Thanks for clicking me! I love attention!",
        "I'm here to help! What can I do for you?",
        "Did you know I have feelings? Well, I don't, but still...",
        "Stop poking me! I'm trying to be helpful!",
        "I'm not just a pretty paperclip, you know!",
      ];
      showSpeechBubble(clickResponses[clickCount % clickResponses.length]);
    });

    // Page interaction responses
    let pageClickHandler = (e) => {
      if (
        e.target !== clippy &&
        !e.target.closest("#clippy-assistant") &&
        Math.random() < 0.3
      ) {
        const contextResponses = [
          "I see you clicked on that. Need help with clicking?",
          "Interesting choice! I would have clicked something else.",
          "That's not where I would click, but you do you!",
          "I notice you're interacting with the page. Fascinating!",
        ];
        showSpeechBubble(
          contextResponses[Math.floor(Math.random() * contextResponses.length)],
        );
      }
    };

    globalThis.document.addEventListener("click", pageClickHandler);

    // Auto remove after 30 seconds
    setTimeout(() => {
      clearInterval(suggestionInterval);
      globalThis.document.removeEventListener("click", pageClickHandler);
      if (clippy.parentNode) {
        clippy.remove();
      }
      if (speechBubble && speechBubble.parentNode) {
        speechBubble.remove();
      }
    }, 30000);

    // Double-click to dismiss
    clippy.addEventListener("dblclick", () => {
      clearInterval(suggestionInterval);
      globalThis.document.removeEventListener("click", pageClickHandler);
      showSpeechBubble(
        "Fine, I'll go away! But I'll be back when you least expect it!",
      );
      setTimeout(() => {
        if (clippy.parentNode) {
          clippy.remove();
        }
        if (speechBubble && speechBubble.parentNode) {
          speechBubble.remove();
        }
      }, 2000);
    });

    HAXStore.toast("📎 CLIPPY ACTIVATED! I'm here to help!");
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "It looks like you're trying to activate an assistant. I can help with that!",
    );
    SuperDaemonInstance.close();
  };

  /**
   * Execute CHICKENBUTT cheat - Chicken Butt Freeze Ray Rawr children's book game
   */
  editorInstance._executeCheatChickenButt = function () {
    // Create game overlay
    const gameOverlay = globalThis.document.createElement("div");
    gameOverlay.id = "chickenbutt-game";
    gameOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #F0E68C 100%);
      z-index: 10000;
      overflow: hidden;
      cursor: crosshair;
    `;

    // Game state
    let foundItems = {
      chicken: false,
      waterGun: false,
      monster: false,
    };
    let totalFound = 0;

    // Create status display
    const statusDisplay = globalThis.document.createElement("div");
    statusDisplay.style.cssText = `
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(255,255,255,0.9);
      padding: 15px;
      border-radius: 10px;
      font-family: 'Comic Sans MS', cursive, sans-serif;
      font-size: 18px;
      font-weight: bold;
      color: #333;
      z-index: 10003;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      border: 3px solid #FF69B4;
    `;
    statusDisplay.innerHTML = `
      <div style="color: #FF1493; margin-bottom: 10px;">🐔 Chicken Butt Freeze Ray Rawr! 🦖</div>
      <div style="font-size: 14px;">
        Find: <span id="chicken-status" style="color: #999;">🐔 Chicken</span> | 
        <span id="gun-status" style="color: #999;">🔫 Freeze Ray</span> | 
        <span id="monster-status" style="color: #999;">🦖 Rawr Monster</span>
      </div>
      <div style="font-size: 12px; margin-top: 8px; color: #666;">I love you to the moon and back! 🌙💕</div>
    `;
    gameOverlay.appendChild(statusDisplay);

    // Special target emojis (higher z-index)
    const specialEmojis = [
      { emoji: "🐔", id: "chicken", name: "Chicken" },
      { emoji: "🔫", id: "waterGun", name: "Freeze Ray" },
      { emoji: "🦖", id: "monster", name: "Rawr Monster" },
    ];

    // Background emojis for visual clutter
    const backgroundEmojis = [
      "🌳",
      "🌲",
      "🌴",
      "🌿",
      "🍀", // Trees and plants
      "🕐",
      "🕑",
      "🕒",
      "🕓",
      "🕔",
      "🕕",
      "🕖",
      "🕗",
      "🕘",
      "🕙",
      "🕚",
      "🕛",
      "⏰",
      "⏱️",
      "⏲️", // Clocks
      "🔥",
      "🎇",
      "✨",
      "🌟",
      "💫",
      "🔆", // Fire and sparkles
      "🧱",
      "🟧",
      "🟨",
      "🟩",
      "🟦",
      "🟪",
      "🟫",
      "⬜",
      "⬛",
      "🔳",
      "🔲", // Lego-like blocks
    ];

    // Function to create a random emoji element
    const createRandomEmoji = (emoji, isSpecial = false) => {
      const element = globalThis.document.createElement("div");
      const fontSize = Math.floor(Math.random() * 35) + 20; // 20px to 54px
      const x = Math.random() * (globalThis.innerWidth - fontSize);
      const y = Math.random() * (globalThis.innerHeight - fontSize);

      element.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        font-size: ${fontSize}px;
        z-index: ${isSpecial ? 10002 : 10001};
        cursor: ${isSpecial ? "pointer" : "default"};
        user-select: none;
        transition: transform 0.2s ease;
      `;

      element.innerHTML = emoji;

      if (isSpecial) {
        element.addEventListener("mouseenter", () => {
          element.style.transform = "scale(1.2)";
        });
        element.addEventListener("mouseleave", () => {
          element.style.transform = "scale(1)";
        });
      }

      return element;
    };

    // Create hundreds of background emojis
    for (let i = 0; i < 300; i++) {
      const randomEmoji =
        backgroundEmojis[Math.floor(Math.random() * backgroundEmojis.length)];
      const emojiElement = createRandomEmoji(randomEmoji, false);
      gameOverlay.appendChild(emojiElement);
    }

    // Create and place the three special emojis
    specialEmojis.forEach((special) => {
      const specialElement = createRandomEmoji(special.emoji, true);
      specialElement.id = `target-${special.id}`;

      specialElement.addEventListener("click", () => {
        if (!foundItems[special.id]) {
          foundItems[special.id] = true;
          totalFound++;

          // Update status display
          const statusElement = globalThis.document.getElementById(
            `${special.id === "waterGun" ? "gun" : special.id}-status`,
          );
          statusElement.style.color = "#00AA00";
          statusElement.style.textDecoration = "line-through";

          // Celebration animation
          specialElement.style.animation = "chickenbutt-found 1s ease-out";

          // Success sound
          const audioContext = new (globalThis.AudioContext ||
            globalThis.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(
            523 + totalFound * 100,
            audioContext.currentTime,
          ); // C5 + higher each time
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.5,
          );

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.5);

          // Check if all items found
          if (totalFound === 3) {
            setTimeout(() => {
              showVictoryScreen();
            }, 1000);
          }
        }
      });

      gameOverlay.appendChild(specialElement);
    });

    // Victory screen function
    const showVictoryScreen = () => {
      const victoryOverlay = globalThis.document.createElement("div");
      victoryOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #FFD700, #FFA500, #FF69B4, #00CED1);
        background-size: 400% 400%;
        animation: chickenbutt-victory-bg 2s ease infinite;
        z-index: 10004;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-family: 'Comic Sans MS', cursive, sans-serif;
      `;

      victoryOverlay.innerHTML = `
        <div style="
          text-align: center;
          color: white;
          text-shadow: 3px 3px 0px rgba(0,0,0,0.5);
          animation: chickenbutt-victory-bounce 1s ease-in-out infinite alternate;
        ">
          <div style="font-size: 72px; margin-bottom: 20px;">🎉🐔🔫🦖🎉</div>
          <h1 style="font-size: 48px; margin: 20px 0;">YOU DID IT!</h1>
          <div style="font-size: 32px; margin: 15px 0;">Chicken Butt Freeze Ray Rawr Complete!</div>
          <div style="font-size: 24px; color: #FFE4E1; margin: 20px 0;">I love you to the moon and back! 🌙💕✨</div>
          <div style="font-size: 18px; margin-top: 30px; opacity: 0.8;">Click anywhere to close</div>
        </div>
      `;

      // Victory celebration sound
      const audioContext = new (globalThis.AudioContext ||
        globalThis.webkitAudioContext)();
      const victoryMelody = [523, 659, 784, 1047]; // C, E, G, C octave

      victoryMelody.forEach((freq, index) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
          oscillator.type = "sine";

          gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.8,
          );

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.8);
        }, index * 300);
      });

      gameOverlay.appendChild(victoryOverlay);

      // Click to close everything
      victoryOverlay.addEventListener("click", () => {
        gameOverlay.remove();
      });
    };

    // Add animations CSS
    if (!globalThis.document.getElementById("chickenbutt-animations")) {
      const style = globalThis.document.createElement("style");
      style.id = "chickenbutt-animations";
      style.textContent = `
        @keyframes chickenbutt-found {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.5) rotate(180deg); }
          100% { transform: scale(1.2) rotate(360deg); }
        }
        @keyframes chickenbutt-victory-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes chickenbutt-victory-bounce {
          0% { transform: translateY(0px) scale(1); }
          100% { transform: translateY(-20px) scale(1.05); }
        }
      `;
      globalThis.document.head.appendChild(style);
    }

    globalThis.document.body.appendChild(gameOverlay);

    HAXStore.toast(
      "🐔 CHICKEN BUTT FREEZE RAY RAWR! Find the three special items!",
    );
    store.playSound("success");
    SuperDaemonInstance.merlinSpeak(
      "I love you to the moon and back! Can you find the chicken, freeze ray, and rawr monster?",
    );
    SuperDaemonInstance.close();
  };

  console.log("🎮 All cheat code methods added to editor instance");
}
