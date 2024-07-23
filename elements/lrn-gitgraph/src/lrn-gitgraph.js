import "./lib/gitgraphjs/src/gitgraph.js";
import { LitElement, html, css } from "lit";
/**
 * `lrn-gitgraph`
 * @element lrn-gitgraph
 * For each branch in your repo use the following git command:
 *   ```
 *   git log [branch_name] --format='{"refs": "%d", "commit": "%h", "tree": "%t", "parent": "%p", "subject": "%s", "date": "%cd", "author": "%an %ae"},' --reverse
 *   ```
 * @demo demo/index.html
 */
class LrnGitgraph extends LitElement {
  static get styles() {
    return [css`
      :host {
          display: block;
          overflow-x: scroll;
        }`];
  }
  render() {
    return html`
      <canvas id="gitGraph"></canvas>
    `;
  }

  static get tag() {
    return "lrn-gitgraph";
  }

  constructor() {
    super();
    this.commits = [];
    this.template = "blackarrow";
    this.orientation = "horizontal";
    this.mode = "";
    this.reverseArrow = false;
  }

  static get properties() {
    return {
      commits: {
        type: Array,
      },
      template: {
        type: String,
      },
      orientation: {
        type: String,
      },
      mode: {
        type: String,
      },
      reverseArrow: {
        type: Boolean,
        attribute: "reverse-arrow",
      },
      config: {
        type: Object,
      },
    };
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    if (changedProperties.has('commits')) {
      this._commitsChanged(this.commits);
    }
  }

  _commitsChanged(commits) {
    var root = this;
    if (root.config) {
      if (commits.length > 0) {
        var gitgraph = new GitGraph(root.config);
        var tree = [];
        commits.forEach(function (item) {
          if (item.commits) {
            item.commits.forEach(function (commit) {
              commit["branch"] = item.branch;
              tree.push(commit);
            });
          }
        });
        // remove duplicate commits
        tree = root._treeRemoveDuplicates(tree);
        // sort by date
        tree = tree.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date);
        });
        // reverse the tree so the newest oldest is first
        tree.reverse();
        // identify forks
        var branches = [];
        tree.forEach(function (item, i) {
          // if the branch doesn't exist create it
          if (typeof branches[item.branch] === "undefined") {
            branches[item.branch] = gitgraph.branch(item.branch);
          }
          // make the commit
          branches[item.branch].commit({
            sha1: item.commit,
            message: item.subject,
            author: item.author,
            tag: item.refs,
          });
        });
      }
    }
  }

  _treeRemoveDuplicates(tree) {
    var htTree = [];
    var htCommits = [];
    tree.forEach(function (t) {
      if (!htCommits.includes(t.commit)) {
        htTree.push(t);
        htCommits.push(t.commit);
      }
    });
    return htTree;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    var config = {
      template: this.template, // could be: "blackarrow" or "metro" or `myTemplate` (custom Template object)
      reverseArrow: false, // to make arrows point to ancestors, if displayed
      orientation: this.orientation,
      element: this.shadowRoot.querySelector("#gitGraph"),
    };
    if (this.mode !== "") {
      config.mode = this.mode;
    }
    this.config = config;
  }
}
customElements.define(LrnGitgraph.tag, LrnGitgraph);
export { LrnGitgraph };
