/**
 * Copyright 2019
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

//Confirm this is the proper way to import/use
import "./pouchdb.min.js";

// register globally so we can make sure there is only one
window.PouchDb = window.PouchDb || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same pouch-db element, making it a singleton.
window.PouchDb.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (!window.PouchDb.instance) {
    window.PouchDb.instance = document.createElement("pouch-db");
    document.body.appendChild(window.PouchDb.instance);
  }
  return window.PouchDb.instance;
};

/**
 * `pouch-db`
 * `read and write localized data elements`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class PouchDb extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "pouch-db";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "user-engagement",
      this.userEngagmentFunction.bind(this)
    );
  }

  userEngagmentFunction(e) {
    var eventData = e.detail;
    var db = new PouchDB(eventData.dbType);
    var remoteCouch = false;
    ///var remoteCouch = 'http://35.164.8.64:3000/todos';
    var objectStatement = {
      actor: {
        mbox: "mailto:dave@gmail.com",
        name: "Dave Fusco",
        objectType: "Agent"
      },
      verb: {
        id: eventData.activityId,
        display: {
          "en-US": eventData.activityDisplay
        }
      },
      object: {
        id: eventData.objectId,
        definition: {
          name: {
            "en-US": eventData.objectName
          },
          description: {
            "en-US": eventData.objectDescription
          }
        },
        objectType: "Activity"
      },
      result: {
        score: {
          scaled: eventData.resultScoreScaled,
          min: eventData.resultScoreMin,
          max: eventData.resultScoreMax,
          raw: eventData.resultScoreRaw
        },
        success: eventData.resultSuccess,
        completion: eventData.resultCompletion,
        response: eventData.resultResponse,
        duration: eventData.resultDuration
      }
    };

    var xapistatement = {
      _id: new Date().toISOString(),
      title: JSON.stringify(objectStatement),
      completed: false
    };

    db.put(xapistatement, function callback(err, result) {
      if (!err) {
        console.log("Successfully posted a statement!");
      }
    });

    if (remoteCouch) {
      var opts = { live: true };
      db.replicate.to(remoteCouch, opts, syncError);
      db.replicate.from(remoteCouch, opts, syncError);
    }

    //display for testing only - move to own elements
    db.allDocs({ include_docs: true, descending: true }, function(err, doc) {
      console.log(doc.rows);
    });
    //display for testing only - move to own elements
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    super.connectedCallback();
    window.removeEventListener("pouch-db-hide", this.hidePouchDb.bind(this));
    window.removeEventListener("pouch-db-show", this.showPouchDb.bind(this));
    window.removeEventListener(
      "user-engagement",
      this.userEngagmentFunction.bind(this)
    );
  }
  /**
   * Hide callback
   */
  hidePouchDb(e) {
    // add your code to run when the singleton hides
  }
  /**
   * Show / available callback
   */
  showPouchDb(e) {
    // add your code to run when the singleton is called for
  }
}
window.customElements.define(PouchDb.tag, PouchDb);
export { PouchDb };
