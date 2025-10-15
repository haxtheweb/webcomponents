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
  console.log('🎮 Loading cheat codes module...');

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

  // PIXELS - Pixelate effect
  SuperDaemonInstance.defineOption({
    title: "PIXELS",
    icon: "image:grid-on",
    textCharacter: "📺",
    tags: ["cheat", "pixel", "retro", "8bit"],
    context: ["*", "CMS", "HAX"],
    priority: -995,
    eventName: "super-daemon-element-method",
    path: "cheat/pixels",
    value: {
      target: editorInstance,
      method: "_executeCheatPixels",
      args: [],
    },
  });
  
  // TIMETRAVEL - Sepia effect to entire page
  SuperDaemonInstance.defineOption({
    title: 'TIMETRAVEL',
    icon: 'device:access-time',
    textCharacter: '⏳',
    tags: ['cheat', 'time', 'sepia', 'vintage'],
    context: ['*', 'CMS', 'HAX'],
    priority: -994,
    eventName: 'super-daemon-element-method',
    path: 'cheat/timetravel',
    value: {
      target: editorInstance,
      method: '_executeCheatTimeTravel',
      args: []
    }
  });
  
  // BEEPS - Click sounds everywhere
  SuperDaemonInstance.defineOption({
    title: 'BEEPS',
    icon: 'av:volume-up',
    textCharacter: '🔊',
    tags: ['cheat', 'sound', 'beep', 'click'],
    context: ['*', 'CMS', 'HAX'],
    priority: -993,
    eventName: 'super-daemon-element-method',
    path: 'cheat/beeps',
    value: {
      target: editorInstance,
      method: '_executeCheatBeeps',
      args: []
    }
  });
  
  // DARKWEB - Matrix effect
  SuperDaemonInstance.defineOption({
    title: 'DARKWEB',
    icon: 'hardware:security',
    textCharacter: '🕵️',
    tags: ['cheat', 'matrix', 'hacker', 'dark'],
    context: ['*', 'CMS', 'HAX'],
    priority: -992,
    eventName: 'super-daemon-element-method',
    path: 'cheat/darkweb',
    value: {
      target: editorInstance,
      method: '_executeCheatDarkWeb',
      args: []
    }
  });
  
  // RICKROLL - Never gonna give you up
  SuperDaemonInstance.defineOption({
    title: 'RICKROLL',
    icon: 'av:play-circle-filled',
    textCharacter: '🎤',
    tags: ['cheat', 'rick', 'roll', 'music', 'meme'],
    context: ['*', 'CMS', 'HAX'],
    priority: -991,
    eventName: 'super-daemon-element-method',
    path: 'cheat/rickroll',
    value: {
      target: editorInstance,
      method: '_executeCheatRickRoll',
      args: []
    }
  });
  
  // NYANCAT - Flying rainbow cats
  SuperDaemonInstance.defineOption({
    title: 'NYANCAT',
    icon: 'pets',
    textCharacter: '🐈',
    tags: ['cheat', 'nyan', 'cat', 'rainbow', 'meme'],
    context: ['*', 'CMS', 'HAX'],
    priority: -990,
    eventName: 'super-daemon-element-method',
    path: 'cheat/nyancat',
    value: {
      target: editorInstance,
      method: '_executeCheatNyanCat',
      args: []
    }
  });
  
  // WORLDCHANGER - Rotating HAX logos with Gandhi quote
  SuperDaemonInstance.defineOption({
    title: 'WORLDCHANGER',
    icon: 'social:public',
    textCharacter: '🌍',
    tags: ['cheat', 'world', 'change', 'gandhi', 'hax'],
    context: ['*', 'CMS', 'HAX'],
    priority: -989,
    eventName: 'super-daemon-element-method',
    path: 'cheat/worldchanger',
    value: {
      target: editorInstance,
      method: '_executeCheatWorldChanger',
      args: []
    }
  });
  
  // TECHNO - Techno music with screen effects
  SuperDaemonInstance.defineOption({
    title: 'TECHNO',
    icon: 'av:music-note',
    textCharacter: '🎵',
    tags: ['cheat', 'techno', 'music', 'party', 'effects'],
    context: ['*', 'CMS', 'HAX'],
    priority: -988,
    eventName: 'super-daemon-element-method',
    path: 'cheat/techno',
    value: {
      target: editorInstance,
      method: '_executeCheatTechno',
      args: []
    }
  });
  
  // CREDITS - Show project contributors with music
  SuperDaemonInstance.defineOption({
    title: 'CREDITS',
    icon: 'social:people',
    textCharacter: '🎬',
    tags: ['cheat', 'credits', 'contributors', 'team', 'thanks'],
    context: ['*', 'CMS', 'HAX'],
    priority: -987,
    eventName: 'super-daemon-element-method',
    path: 'cheat/credits',
    value: {
      target: editorInstance,
      method: '_executeCheatCredits',
      args: []
    }
  });
  
  // JOKER - Chaotic joker and fire emojis with invisible video
  SuperDaemonInstance.defineOption({
    title: 'JOKER',
    icon: 'social:mood',
    textCharacter: '🃏',
    tags: ['cheat', 'joker', 'chaos', 'fire', 'message'],
    context: ['*', 'CMS', 'HAX'],
    priority: -986,
    eventName: 'super-daemon-element-method',
    path: 'cheat/joker',
    value: {
      target: editorInstance,
      method: '_executeCheatJoker',
      args: []
    }
  });
  
  console.log(`🎮 Cheat codes defined! Total allItems: ${SuperDaemonInstance.allItems.length}`);
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
  editorInstance._executeCheatDKMODE = function() {
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
    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('Big head mode activated! Welcome to DK Island!');
    SuperDaemonInstance.close();
  };

  /**
   * Execute DOABARRELROLL cheat - Rotate the screen twice
   */
  editorInstance._executeCheatBarrelRoll = function() {
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

    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('Use the boost to get through!');
    SuperDaemonInstance.close();
  };

  /**
   * Execute SUMMONZOMBIE cheat - Change character to zombie pirate girl
   */
  editorInstance._executeCheatSummonZombie = function() {
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
    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('Arrr! The undead seas await ye matey!');
    SuperDaemonInstance.close();
  };

  /**
   * Execute DDR cheat - Play success sound with visual effects
   */
  editorInstance._executeCheatDDR = function() {
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
    SuperDaemonInstance.merlinSpeak('Left, down, up, right! Keep the beat!');
    SuperDaemonInstance.close();
  };

  /**
   * Execute SANTA cheat - Toggle Santa mode in super-daemon
   */
  editorInstance._executeCheatSanta = function() {
    const SuperDaemon = globalThis.SuperDaemon;
    if (SuperDaemon && SuperDaemon.manager) {
      SuperDaemon.manager.santa = !SuperDaemon.manager.santa;
      HAXStore.toast(
        SuperDaemon.manager.santa
          ? "🎅 HO HO HO! Santa mode activated!"
          : "🎅 Santa mode deactivated. Back to normal voice."
      );
    } else {
      HAXStore.toast("🎅 Santa mode unavailable");
    }
    
    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('Ho ho ho! Have you been naughty or nice?');
    SuperDaemonInstance.close();
  };

  /**
   * Execute PIXELS cheat - Add pixelated effect to page
   */
  editorInstance._executeCheatPixels = function() {
    const body = globalThis.document.body;
    const currentFilter = body.style.filter || "";
    
    if (currentFilter.includes("pixelate")) {
      // Remove pixel effect
      body.style.filter = currentFilter.replace(/pixelate\([^)]*\)/g, "").trim();
      body.style.imageRendering = "";
      HAXStore.toast("📺 Pixel effect disabled - Back to HD!");
    } else {
      // Add pixel effect using CSS filters and image rendering
      body.style.filter = (currentFilter || "") + " contrast(1.2) saturate(1.3)";
      body.style.imageRendering = "pixelated";
      
      // Apply pixelated look to all images
      const images = globalThis.document.querySelectorAll("img");
      images.forEach(img => {
        img.style.imageRendering = "pixelated";
      });
      
      HAXStore.toast("📺 PIXELS ACTIVATED! Welcome to the 8-bit world!");
    }
    
    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('Welcome to the retro arcade zone!');
    SuperDaemonInstance.close();
  };

  /**
   * Execute TIMETRAVEL cheat - Add sepia effect to entire page
   */
  editorInstance._executeCheatTimeTravel = function() {
    const body = globalThis.document.body;
    const existingFilter = body.style.filter || '';
    
    if (existingFilter.includes('sepia')) {
      // Remove time travel effect
      body.style.filter = existingFilter.replace(/sepia\([^)]*\)/g, '').trim();
      HAXStore.toast('⏳ Time travel disabled - Welcome back to the present!');
    } else {
      // Add sepia time travel effect
      body.style.filter = (existingFilter || '') + ' sepia(0.8) contrast(1.2) brightness(0.9)';
      body.style.transition = 'filter 2s ease-in-out';
      
      HAXStore.toast('⏳ TIME TRAVEL ACTIVATED! Welcome to the past!');
      
      // Auto-remove after 30 seconds
      setTimeout(() => {
        const currentFilter = body.style.filter || '';
        if (currentFilter.includes('sepia')) {
          body.style.filter = currentFilter.replace(/sepia\([^)]*\)/g, '').trim();
          HAXStore.toast('⏳ Time travel expired - Returned to present');
        }
      }, 30000);
    }
    
    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('Great Scott! We have traveled through time itself!');
    SuperDaemonInstance.close();
  };

  /**
   * Execute BEEPS cheat - Add click sounds everywhere
   */
  editorInstance._executeCheatBeeps = function() {
    const beepSounds = ['beep', 'boop', 'ding', 'ping', 'click'];
    let beepActive = globalThis.document.body.hasAttribute('data-beeps-active');
    
    if (beepActive) {
      // Remove beep mode
      globalThis.document.body.removeAttribute('data-beeps-active');
      globalThis.document.removeEventListener('click', globalThis.beepClickHandler);
      HAXStore.toast('🔊 BEEPS disabled - Silence restored');
    } else {
      // Add beep mode
      globalThis.document.body.setAttribute('data-beeps-active', 'true');
      
      globalThis.beepClickHandler = (e) => {
        // Create audio context for beep sounds
        const audioContext = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Random frequency for variety
        oscillator.frequency.setValueAtTime(200 + Math.random() * 800, audioContext.currentTime);
        oscillator.type = 'sine';
        
        // Short beep
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      };
      
      globalThis.document.addEventListener('click', globalThis.beepClickHandler);
      HAXStore.toast('🔊 BEEPS ACTIVATED! Every click makes a sound!');
    }
    
    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('Beep boop! Every click is now a symphony of chaos!');
    SuperDaemonInstance.close();
  };

  /**
   * Execute DARKWEB cheat - Matrix effect overlay
   */
  editorInstance._executeCheatDarkWeb = function() {
    const existingMatrix = globalThis.document.getElementById('matrix-effect');
    
    if (existingMatrix) {
      // Remove matrix effect
      existingMatrix.remove();
      HAXStore.toast('🕵️ Matrix disabled - Back to reality');
    } else {
      // Add matrix effect as overlay
      const matrixContainer = globalThis.document.createElement('div');
      matrixContainer.id = 'matrix-effect';
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
        const column = globalThis.document.createElement('div');
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
        const chars = 'アイウエオカキクケコサシスセソ01010110100110';
        let columnText = '';
        for (let j = 0; j < 40; j++) {
          const char = chars[Math.floor(Math.random() * chars.length)];
          columnText += `<span style="color: #00ff00; background: rgba(0,0,0,0.8); display: block; text-align: center; margin: 2px 0;">${char}</span>`;
        }
        column.innerHTML = columnText;
        
        matrixContainer.appendChild(column);
      }
      
      // Add matrix animation CSS
      if (!globalThis.document.getElementById('matrix-animation')) {
        const style = globalThis.document.createElement('style');
        style.id = 'matrix-animation';
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
      HAXStore.toast('🕵️ DARK WEB ACTIVATED - Welcome to the Matrix!');
      
      // Auto-remove after 20 seconds
      setTimeout(() => {
        const matrix = globalThis.document.getElementById('matrix-effect');
        if (matrix) {
          matrix.remove();
          HAXStore.toast('🕵️ Matrix session terminated');
        }
      }, 20000);
    }
    
    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('Welcome to the Matrix! Red pill or blue pill?');
    SuperDaemonInstance.close();
  };

  /**
   * Execute RICKROLL cheat - Rick Roll video modal with hidden continuation
   */
  editorInstance._executeCheatRickRoll = function() {
    // Create modal with Rick Roll video
    const modal = globalThis.document.createElement('div');
    modal.id = 'rickroll-modal';
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
    
    const videoContainer = globalThis.document.createElement('div');
    videoContainer.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 10px;
      position: relative;
      max-width: 80%;
      max-height: 80%;
    `;
    
    const closeBtn = globalThis.document.createElement('button');
    closeBtn.innerHTML = '×';
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
    
    const iframe = globalThis.document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
    iframe.style.cssText = `
      width: 560px;
      height: 315px;
      border: none;
      max-width: 100%;
      max-height: 100%;
    `;
    iframe.allow = 'autoplay';
    
    const title = globalThis.document.createElement('h2');
    title.textContent = 'Never Gonna Give You Up!';
    title.style.textAlign = 'center';
    title.style.color = 'red';
    title.style.marginTop = '0';
    
    videoContainer.appendChild(closeBtn);
    videoContainer.appendChild(title);
    videoContainer.appendChild(iframe);
    modal.appendChild(videoContainer);
    globalThis.document.body.appendChild(modal);
    
    // Hidden iframe for when modal is closed
    let hiddenIframe = null;
    
    const closeModal = () => {
      // Create hidden iframe to continue playing
      hiddenIframe = globalThis.document.createElement('iframe');
      hiddenIframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&start=0';
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
      hiddenIframe.allow = 'autoplay';
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
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    HAXStore.toast('🎤 RICK ROLLED! Never gonna give you up!');
    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('Never gonna give you up, never gonna let you down!');
    SuperDaemonInstance.close();
  };

  /**
   * Execute NYANCAT cheat - Flying rainbow cats across screen
   */
  editorInstance._executeCheatNyanCat = function() {
    // Create 50 nyan cats moving faster
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const nyanCat = globalThis.document.createElement('div');
        nyanCat.className = 'nyan-cat';
        nyanCat.innerHTML = '🐈🌈';
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
        const trail = globalThis.document.createElement('div');
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
    if (!globalThis.document.getElementById('nyan-animation')) {
      const style = globalThis.document.createElement('style');
      style.id = 'nyan-animation';
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
    
    HAXStore.toast('🐈 NYAN CAT ACTIVATED! Rainbow cats incoming!');
    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('Nyan nyan nyan! Rainbow cats are taking over the internet!');
    SuperDaemonInstance.close();
  };

  /**
   * Execute WORLDCHANGER cheat - Fill screen with rotating HAX logos
   */
  editorInstance._executeCheatWorldChanger = function() {
    // Create container for rotating logos
    const logoContainer = globalThis.document.createElement('div');
    logoContainer.id = 'worldchanger-effect';
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
      const logo = globalThis.document.createElement('img');
      logo.src = 'https://github.com/haxtheweb.png';
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
    if (!globalThis.document.getElementById('worldchanger-animation')) {
      const style = globalThis.document.createElement('style');
      style.id = 'worldchanger-animation';
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
      const effect = globalThis.document.getElementById('worldchanger-effect');
      if (effect) {
        effect.remove();
      }
    }, 15000);
    
    HAXStore.toast('🌍 WORLD CHANGER ACTIVATED! Be the change!');
    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('You must be the change you wish to see in the world');
    SuperDaemonInstance.close();
  };

  /**
   * Execute TECHNO cheat - Play techno music with screen effects
   */
  editorInstance._executeCheatTechno = function() {
    // Create modal for techno video
    const modal = globalThis.document.createElement('div');
    modal.id = 'techno-modal';
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
    
    const videoContainer = globalThis.document.createElement('div');
    videoContainer.style.cssText = `
      position: relative;
      max-width: 80%;
      max-height: 80%;
    `;
    
    const iframe = globalThis.document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/JwZwkk7q25I?autoplay=1';
    iframe.style.cssText = `
      width: 560px;
      height: 315px;
      border: none;
      max-width: 100%;
      max-height: 100%;
    `;
    iframe.allow = 'autoplay';
    
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
        body.style.backgroundColor = '';
        body.style.filter = '';
        HAXStore.toast('🎵 Techno party stopped!');
      }
    };
    
    // Close modal after clicking
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        stopEffects();
      }
    });
    
    HAXStore.toast('🎵 TECHNO TIME! Get ready to party!');
    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('The system is down!');
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
      setTimeout(() => {
        body.style.filter = '';
      }, Math.random() * 500 + 100); // 100-600ms duration
    }, 300); // Every 300ms
    
    // Random effects
    effectInterval = setInterval(() => {
      const effects = [
        'contrast(2)',
        'saturate(3)',
        'invert(1)',
        'sepia(1)',
        'grayscale(1)',
        'brightness(0.5)',
        'brightness(1.5)'
      ];
      const randomEffect = effects[Math.floor(Math.random() * effects.length)];
      body.style.filter = randomEffect;
      
      setTimeout(() => {
        body.style.filter = '';
      }, 400);
    }, 1000);
    
    // Return intervals so they can be stopped externally
    const stopTimeout = setTimeout(() => {
      clearInterval(blurInterval);
      clearInterval(effectInterval);
      body.style.backgroundColor = '';
      body.style.filter = '';
      HAXStore.toast('🎵 Techno party over! Back to reality.');
    }, 30000);
    
    // Return intervals for external cleanup
    return {
      blinkInterval: blurInterval,
      effectInterval: effectInterval,
      stopTimeout: stopTimeout
    };
  }

  /**
   * Execute CREDITS cheat - Show contributors with background music
   */
  editorInstance._executeCheatCredits = async function() {
    try {
      // Dynamically import github-rpg-contributors component
      await import('@haxtheweb/github-preview/lib/github-rpg-contributors.js');
    } catch (error) {
      console.warn('Failed to load github-rpg-contributors:', error);
      HAXStore.toast('🎬 Failed to load contributors component');
      return;
    }
    
    // Create modal for credits
    const modal = globalThis.document.createElement('div');
    modal.id = 'credits-modal';
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
    const title = globalThis.document.createElement('h1');
    title.textContent = 'HAXTheWeb Contributors';
    title.style.cssText = `
      color: white;
      font-size: 2.5em;
      margin-bottom: 30px;
      text-align: center;
      font-family: Arial, sans-serif;
    `;
    modal.appendChild(title);
    
    // Create contributor sections
    const contributorContainer = globalThis.document.createElement('div');
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
    const haxLabSection = globalThis.document.createElement('div');
    haxLabSection.innerHTML = `
      <h2 style="color: #00ff88; text-align: center; margin-bottom: 15px;">HAX Lab Team</h2>
      <github-rpg-contributors org="haxtheweb" repo="hax-lab"></github-rpg-contributors>
    `;
    contributorContainer.appendChild(haxLabSection);
    
    // Create contributors
    const createSection = globalThis.document.createElement('div');
    createSection.innerHTML = `
      <h2 style="color: #ff8800; text-align: center; margin-bottom: 15px;">Create Team</h2>
      <github-rpg-contributors org="haxtheweb" repo="create"></github-rpg-contributors>
    `;
    contributorContainer.appendChild(createSection);
    
    // Webcomponents contributors
    const webcomponentsSection = globalThis.document.createElement('div');
    webcomponentsSection.innerHTML = `
      <h2 style="color: #8800ff; text-align: center; margin-bottom: 15px;">Webcomponents Team</h2>
      <github-rpg-contributors org="haxtheweb" repo="webcomponents"></github-rpg-contributors>
    `;
    contributorContainer.appendChild(webcomponentsSection);
    
    modal.appendChild(contributorContainer);
    
    // Create hidden background music iframe
    const musicIframe = globalThis.document.createElement('iframe');
    musicIframe.src = 'https://www.youtube.com/embed/siWusSBld7k?autoplay=1';
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
    musicIframe.allow = 'autoplay';
    globalThis.document.body.appendChild(musicIframe);
    
    globalThis.document.body.appendChild(modal);
    
    // Close modal and remove music when clicking outside content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
        musicIframe.remove();
      }
    });
    
    HAXStore.toast('🎬 CREDITS ROLL! Thank you contributors!');
    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('Thank you for helping to build something amazing, free, and ubiquitous');
    SuperDaemonInstance.close();
  };

  /**
   * Execute JOKER cheat - Chaotic joker and fire emojis with invisible video
   */
  editorInstance._executeCheatJoker = function() {
    // Create container for joker effect
    const jokerContainer = globalThis.document.createElement('div');
    jokerContainer.id = 'joker-effect';
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
    const emojis = ['🃏', '🔥', '💰', '💸', '💵', '💴', '💶', '💷']; // Joker, fire, and money emojis
    for (let i = 0; i < 150; i++) {
      const emoji = globalThis.document.createElement('div');
      emoji.className = 'joker-emoji';
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
    if (!globalThis.document.getElementById('joker-animation')) {
      const style = globalThis.document.createElement('style');
      style.id = 'joker-animation';
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
    const hiddenVideo = globalThis.document.createElement('iframe');
    hiddenVideo.src = 'https://www.youtube.com/embed/QS-B775PvRc?autoplay=1';
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
    hiddenVideo.allow = 'autoplay';
    
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
      HAXStore.toast('🃏 Joker chaos subsided... for now');
    }, 10000);
    
    HAXStore.toast('🃏 JOKER ACTIVATED! Chaos unleashed!');
    store.playSound('success');
    SuperDaemonInstance.merlinSpeak('It\'s not about the money, it\'s about sending a message');
    SuperDaemonInstance.close();
  };

  console.log('🎮 All cheat code methods added to editor instance');
}
