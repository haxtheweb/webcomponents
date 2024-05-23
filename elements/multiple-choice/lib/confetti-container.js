// confetti-element by stefanjudis MIT
// cleaned up for production use
(() => {
  const randomRange = (min, max) => Math.random() * (max - min) + min;
  const colors = [
    { front: "#52A7DD", back: "#2287BD" }, // Blue
    { front: "#f07178", back: "#c04148" }, // Red
    { front: "#ffcb6b", back: "#cf9b3b" }, // Yellow
  ];
  const initConfettoVelocity = (xRange, yRange) => {
    const x = randomRange(xRange[0], xRange[1]);
    const range = yRange[1] - yRange[0] + 1;
    let y =
      yRange[1] -
      Math.abs(randomRange(0, range) + randomRange(0, range) - range);
    if (y >= yRange[1] - 1) {
      // Occasional confetto goes higher than the max
      y += Math.random() < 0.25 ? randomRange(1, 3) : 0;
    }
    return { x: x, y: -y };
  };

  // Confetto Class
  function Confetto(canvas, options) {
    this.options = options;
    this.randomModifier = randomRange(0, 99);
    this.color = colors[Math.floor(randomRange(0, colors.length))];
    this.dimensions = {
      x: randomRange(8, 16),
      y: randomRange(8, 14),
    };
    this.position = {
      x: randomRange(
        // canvas.width / 2 - button.offsetWidth / 4,
        // canvas.width / 2 + button.offsetWidth / 4
        canvas.width / 2,
        canvas.width / 2,
      ),
      y: randomRange(
        // canvas.height / 2 + button.offsetHeight / 2 + 8,
        // canvas.height / 2 + 1.5 * button.offsetHeight - 8
        canvas.height / 2,
        canvas.height / 2,
      ),
    };
    this.rotation = randomRange(0, 2 * Math.PI);
    this.scale = {
      x: 1,
      y: 1,
    };
    this.velocity = initConfettoVelocity([-9, 9], [6, 11]);
  }
  Confetto.prototype.update = function () {
    // apply forces to velocity
    this.velocity.x -= this.velocity.x * this.options.dragConfetti;
    this.velocity.y = Math.min(
      this.velocity.y + this.options.gravityConfetti,
      this.options.terminalVelocity,
    );
    this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();

    // set position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // spin confetto by scaling y and set the color, .09 just slows cosine frequency
    this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
  };

  // Sequin Class
  function Sequin(canvas, options) {
    this.options = options;
    (this.color = colors[Math.floor(randomRange(0, colors.length))].back),
      (this.radius = randomRange(1, 2)),
      (this.position = {
        x: randomRange(
          // canvas.width / 2 - button.offsetWidth / 3,
          // canvas.width / 2 + button.offsetWidth / 3
          canvas.width / 2,
          canvas.width / 2,
        ),
        y: randomRange(
          // canvas.height / 2 + button.offsetHeight / 2 + 8,
          // canvas.height / 2 + 1.5 * button.offsetHeight - 8
          canvas.height / 2,
          canvas.height / 2,
        ),
      }),
      (this.velocity = {
        x: randomRange(-6, 6),
        y: randomRange(-8, -12),
      });
  }
  Sequin.prototype.update = function () {
    // apply forces to velocity
    this.velocity.x -= this.velocity.x * this.options.dragSequins;
    this.velocity.y = this.velocity.y + this.options.gravitySequins;

    // set position
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  };

  class Confetti extends HTMLElement {
    constructor() {
      super();

      this.canvas = null;
      this.confetti = [];
      this.sequins = [];

      this.options = {
        confettiCount: 55,
        sequinCount: 30,
        gravityConfetti: 0.25,
        gravitySequins: 0.35,
        dragConfetti: 0.025,
        dragSequins: 0.02,
        terminalVelocity: 4,
      };
    }

    connectedCallback() {
      this.style = "display: block; position: relative;";

      this.canvas = globalThis.document.createElement("canvas");
      this.canvas.id = "confetti-container-canvas-🎉";
      this.ctx = this.canvas.getContext("2d");
      // debugger;
      this.canvas.width = this.offsetWidth;
      this.canvas.height = this.offsetHeight;
      this.canvas.style =
        "pointer-events: none; position: absolute; top:0; left: 0; width: 100%; height: 100%; z-index: 1000; image-rendering: crisp-edges;";
      this.prepend(this.canvas);
    }

    static get observedAttributes() {
      return ["popped"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      const reduceMotion = globalThis.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const poppedAttrAdded = name === "popped" && oldValue === null;
      if (poppedAttrAdded && !reduceMotion) {
        this.popConfetti();
      } else if (reduceMotion) {
        this.removeAttribute("popped");
      }
    }

    popConfetti() {
      for (let i = 0; i < this.options.confettiCount; i++) {
        this.confetti.push(new Confetto(this.canvas, this.options));
      }
      for (let i = 0; i < this.options.sequinCount; i++) {
        this.sequins.push(new Sequin(this.canvas, this.options));
      }

      this.render();
    }

    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.confetti.forEach((confetto, index) => {
        let width = confetto.dimensions.x * confetto.scale.x;
        let height = confetto.dimensions.y * confetto.scale.y;

        // move canvas to position and rotate
        this.ctx.translate(confetto.position.x, confetto.position.y);
        this.ctx.rotate(confetto.rotation);

        // update confetto "physics" values
        confetto.update();

        // get front or back fill color
        this.ctx.fillStyle =
          confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;

        // draw confetto
        this.ctx.fillRect(-width / 2, -height / 2, width, height);

        // reset transform matrix
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

      this.sequins.forEach((sequin, index) => {
        // move canvas to position
        this.ctx.translate(sequin.position.x, sequin.position.y);

        // update sequin "physics" values
        sequin.update();

        // set the color
        this.ctx.fillStyle = sequin.color;

        // draw sequin
        this.ctx.beginPath();
        this.ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI);
        this.ctx.fill();

        // reset transform matrix
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      });

      // remove confetti and sequins that fall off the screen
      // must be done in seperate loops to avoid noticeable flickering
      this.confetti.forEach((confetto, index) => {
        if (confetto.position.y - 25 >= this.canvas.height)
          this.confetti.splice(index, 1);
      });
      this.sequins.forEach((sequin, index) => {
        if (sequin.position.y - 25 >= this.canvas.height)
          this.sequins.splice(index, 1);
      });

      if (this.sequins.length || this.confetti.length) {
        globalThis.requestAnimationFrame(this.render.bind(this));
      } else {
        this.removeAttribute("popped");
      }
    }
  }

  if (globalThis.customElements && globalThis.customElements.define) {
    customElements.define("confetti-container", Confetti);
  }
})();
