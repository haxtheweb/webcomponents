export const FutureTerminalTextLiteSuper = function (SuperClass) {
  return class extends SuperClass {
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
      // a11y -- check for reduced motion and DO NOT glitch if that is the case
      const motionMQ = globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      const prefersReducedMotion = motionMQ.matches;
      if (!prefersReducedMotion) {
        const text = this.innerHTML;
        const scrambleCount =
          Math.floor(
            Math.floor((Math.random() * text.length) / 10) + text.length / 20,
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
