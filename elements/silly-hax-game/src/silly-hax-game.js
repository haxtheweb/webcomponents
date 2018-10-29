import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/simple-timer/simple-timer.js";
import "@lrnwebcomponents/lrnsys-layout/lib/lrnsys-dialog-modal.js";
import "@lrnwebcomponents/to-do/to-do.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/paper-button/paper-button.js";
/**
`silly-hax-game`
An example web component of gamifying HAX to make it more fun and challenging.

@demo demo/index.html

*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <paper-card heading="[[haxText]]" elevation="1">
      <simple-timer id="timer" start-time="60" count-up="" hidden="" current-time="{{timer}}"></simple-timer>
      <div class="card-content">
        <to-do items="{{tasks}}" hide-form="" id="todo" name="Hax Challenge"></to-do>
      </div>
      <div class="card-actions">
        <paper-button raised="" on-tap="_playButton">Play</paper-button>
        <paper-button raised="" on-tap="_resetTimer">Reset</paper-button>
      </div>
    </paper-card>

    <lrnsys-dialog-modal id="modal" body-append="">
      <h3 slot="header">HAX Challenge score</h3>
      <div slot="primary">
        <p>[[__successText]]
          <a href="https://github.com/LRNWebComponents/hax-body/issues/new" target="_blank" style="text-decoration: none;text-transform: none;"><paper-button raised="">Give us feedback to improve</paper-button></a>
          <a href\$="[[tweet]]" target="_blank" style="text-decoration: none;text-transform: none;"><paper-button raised="">Tweet your score</paper-button></a>
      	</p>
        <to-do name="Report card" hide-form="" items="{{__score}}"></to-do>
      </div>
    </lrnsys-dialog-modal>
`,

  is: "silly-hax-game",

  properties: {
    /**
     * tasks to accomplish
     */
    tasks: {
      type: Array,
      value: []
    },
    /**
     * haxText
     */
    haxText: {
      type: String,
      computed: "_haxTextValue(timer)"
    },
    /**
     * __score board
     */
    __score: {
      type: Array,
      value: []
    },
    /**
     * tweet
     */
    tweet: {
      type: String
    },
    /**
     * Timer as updated via downstream
     */
    timer: {
      type: Number
    },
    /**
     * Playing the game or not.
     */
    playing: {
      type: Boolean,
      value: false,
      observer: "_playGame",
      reflectToAttribute: true
    }
  },

  /**
   * Play button
   */
  _playButton: function(e) {
    if (!this.playing) {
      this.playing = true;
      this.$.timer.start();
    }
  },

  /**
   * _playGame
   */
  _playGame: function(newValue, oldValue) {
    if (newValue) {
      this.__started = true;
      this.set("tasks", []);
      this.push(
        "tasks",
        {
          value: false,
          label: "Start to edit with HAX",
          disabled: true,
          id: "play"
        },
        {
          value: false,
          label: "Embed a video by Searching for it",
          disabled: true,
          id: "youtube"
        },
        {
          value: false,
          label: "Turn a NASA image into a meme",
          disabled: true,
          id: "nasa"
        },
        {
          value: false,
          label: "Saved content!!!",
          disabled: true,
          id: "saved"
        }
      );
    }
  },

  /**
   * Reset the timer to play again
   */
  _resetTimer: function(e) {
    this.$.timer.pause();
    this.playing = false;
    this.timer = 0;
    this.set("tasks", []);
  },

  _haxTextValue: function(time) {
    if (typeof time === typeof undefined || time == 60) {
      return "Take the HAX challenge";
    } else {
      return time.toFixed(2);
    }
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    document.body.addEventListener(
      "hax-body-tag-added",
      this._verifyAction.bind(this)
    );
    document.body.addEventListener(
      "hax-store-property-updated",
      this._propertyUpdated.bind(this)
    );
  },

  /**
   * Property updated in the hax store.
   */
  _propertyUpdated: function(e) {
    switch (e.detail.property) {
      case "editMode":
        if (
          this.playing &&
          this.__started &&
          e.detail.value &&
          typeof this.tasks[0].label !== typeof undefined
        ) {
          this.set("tasks.0.value", true);
          this.set(
            "tasks.0.label",
            this.tasks[0].label + " - " + this.timer.toFixed(2) + " seconds"
          );
        } else if (e.detail.value === false && this.__started && this.playing) {
          this.set(
            "tasks." + (parseInt(this.tasks.length) - 1) + ".value",
            true
          );
          this.set(
            "tasks." + (parseInt(this.tasks.length) - 1) + ".label",
            this.tasks[parseInt(this.tasks.length) - 1].label +
              " - " +
              this.timer.toFixed(2) +
              " seconds"
          );
          this.$.timer.pause();
          this._verifyWin();
        }
        break;
    }
  },

  /**
   * Verify if they won!
   */
  _verifyWin: function() {
    let win = true;
    let winning = 0;
    this.set("__score", this.tasks);
    for (var i in this.tasks) {
      if (!this.tasks[i].value) {
        win = false;
      } else {
        winning++;
      }
    }
    if (this.timer === 0) {
      win = false;
      this.push("__score", {
        value: false,
        label: "You ran out of time :(",
        disabled: true,
        id: "time"
      });
    } else if (!win) {
      this.push("__score", {
        value: false,
        label: "You didn't complete everything. CHEATER!",
        disabled: true,
        id: "cheater"
      });
    } else {
      this.push("__score", {
        value: true,
        label: "You did it!!! <(:) Much Success!",
        disabled: true,
        id: "time"
      });
      winning++;
    }
    this.$.modal.opened = true;
    if (!win) {
      this.__successText =
        ":( You have much sadness by only completing " +
        winning +
        " of the available " +
        this.tasks.length +
        " challenges. If you experienced confusion when using the interface for certain tasks please let us know! We want everyone to be able to master HAX.";
      this.tweet =
        "http://twitter.com/home?status=" +
        encodeURIComponent(
          "I took the #HaxtheWeb Challenge and finished " +
            winning +
            " challenges! Take the challenge at http://haxtheweb.org/ !"
        );
    } else {
      this.__successText =
        "YOU ARE A HAX MASTER! YOU BEAT ALL " +
        this.tasks.length +
        " CHALLENGES. AM I USING ENOUGH CAPSLOCK!? YOU BET I AM! TWEET YOUR SUCCESS NOW!";
      this.tweet =
        "http://twitter.com/home?status=" +
        encodeURIComponent(
          "I are winning! I beat the #HaxtheWeb Challenge in " +
            this.timer.toFixed(2) +
            " seconds. Now I drink more coffee and code less! Take the challenge at http://haxtheweb.org/ !"
        );
    }
  },

  /**
   * Verify that different tasks have been completed.
   */
  _verifyAction: function(e) {
    if (this.playing && this.__started) {
      if (e.detail.node.tagName === "VIDEO-PLAYER") {
        this.set("tasks.1.value", true);
        this.set(
          "tasks.1.label",
          this.tasks[1].label + " - " + this.timer.toFixed(2) + " seconds"
        );
      } else if (e.detail.node.tagName === "MEME-MAKER") {
        this.set("tasks.2.value", true);
        this.set(
          "tasks.2.label",
          this.tasks[2].label + " - " + this.timer.toFixed(2) + " seconds"
        );
      }
    }
  }
});
