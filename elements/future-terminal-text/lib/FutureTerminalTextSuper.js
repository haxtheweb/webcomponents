export const FutureTerminalTextLiteSuper = function (SuperClass) {
  return class extends SuperClass {
    //styles function
    static get styles() {
      return;
      `:host {
            font-weight: bold;
            display: inline-flex;
            --flicker-easing: cubic-bezier(0.32, 0.32, 0, 0.92);
            --flicker-duration: 300ms;
            --fade-in-duration: 500ms;
          }
          span {
              color: #5fa4a5;
              text-shadow: 0 0 4px #5fa4a5;
              animation: flicker var(--flicker-duration) var(--flicker-easing);
          }
          :host([red]) span {
              color: #b35b5a;
              text-shadow: 0 0 4px #b35b5a;
          }
          :host([fadein]) span {
              animation: fade-in var(--fade-in-duration), flicker 300ms var(--flicker-easing) calc(var(--fade-in-duration) * 0.8);
              transform: translate(0,0);
              opacity: 1;
          }
          @keyframes flicker {
              0% { opacity: 0.75; }
              50% { opacity: 0.45; }
              100% { opacity: 1; }
          }
          @keyframes fade-in {
              from {
                  transform: translate(-30px, 0px);
                  opacity: 0;
              }
          }
        `;
    }

    /**
     * HTMLElement
     */
    constructor() {
      super();
      this.red = false;
      this.fadein = false;
      this.glitch = false;
      this.glitchMax = 5;
      this.glitchDuration = 50;
    }
    async _doGlitch() {
      const text = this.innerHTML;
      const scrambleCount =
        Math.floor(
          Math.floor((Math.random() * text.length) / 10) + text.length / 20
        ) + 1;
      const scrambleIterationCount =
        Math.floor(Math.random() * this.glitchMax) + 10;
      for (let j = 0; j < scrambleIterationCount; j++) {
        let newText = text;
        for (let i = 0; i < scrambleCount; i++) {
          newText = this._scramble(newText);
        }
        this.innerHTML = newText;
        await this._wait(this.glitchDuration);
      }
      this.innerHTML = text;
    }

    _scramble(text) {
      const index = Math.floor(Math.random() * Math.floor(text.length - 1));
      const random = Math.floor(Math.random() * 100);
      return (
        text.substring(0, index) +
        String.fromCharCode(random) +
        text.substring(index + 1)
      );
    }

    _wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  };
};
