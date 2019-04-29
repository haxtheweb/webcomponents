define(["exports","./node_modules/@polymer/polymer/polymer-legacy.js","./lib/gitgraph.js/src/gitgraph.js"],function(_exports,_polymerLegacy,_gitgraph){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.LrnGitgraph=void 0;function _templateObject_df076f906a8211e9ba16f7fb77e7f8f0(){var data=babelHelpers.taggedTemplateLiteral(["\n    <style>\n      :host {\n        display: block;\n        overflow-x: scroll;\n      }\n    </style>\n    <canvas id=\"gitGraph\"></canvas>\n  "]);_templateObject_df076f906a8211e9ba16f7fb77e7f8f0=function _templateObject_df076f906a8211e9ba16f7fb77e7f8f0(){return data};return data}/**
`lrn-gitgraph`
A LRN element

For each branch in your repo use the following git command:
```
git log [branch_name] --format='{"refs": "%d", "commit": "%h", "tree": "%t", "parent": "%p", "subject": "%s", "date": "%cd", "author": "%an %ae"},' --reverse
```

* @demo demo/index.html
*/var LrnGitgraph=(0,_polymerLegacy.Polymer)({_template:(0,_polymerLegacy.html)(_templateObject_df076f906a8211e9ba16f7fb77e7f8f0()),is:"lrn-gitgraph",properties:{commits:{type:Array,value:[]},template:{type:String,value:"blackarrow"},orientation:{type:String,value:"horizontal"},mode:{type:String,value:""},reverseArrow:{type:Boolean,value:!1},/**
     * @type {{template: String, reverseArrow: Boolean, orientation: String, element: Object}}
     */config:{type:Object}},observers:["_commitsChanged(commits)"],_commitsChanged:function _commitsChanged(commits){var root=this;if(root.config){if(0<commits.length){var gitgraph=new GitGraph(root.config),tree=[];commits.forEach(function(item){if(item.commits){item.commits.forEach(function(commit){commit.branch=item.branch;tree.push(commit)})}});// remove duplicate commits
console.log("befor",tree);tree=root._treeRemoveDuplicates(tree);// sort by date
tree=tree.sort(function(a,b){return new Date(b.date)-new Date(a.date)});// reverse the tree so the newest oldest is first
tree.reverse();// identify forks
var branches=[];tree.forEach(function(item,i){// if the branch doesn't exist create it
if("undefined"===typeof branches[item.branch]){branches[item.branch]=gitgraph.branch(item.branch)}// make the commit
branches[item.branch].commit({sha1:item.commit,message:item.subject,author:item.author,tag:item.refs})})}}},_treeRemoveDuplicates:function _treeRemoveDuplicates(tree){var htTree=[],htCommits=[];tree.forEach(function(t){if(!htCommits.includes(t.commit)){htTree.push(t);htCommits.push(t.commit)}});return htTree},ready:function ready(){var root=this,config={template:root.template,// could be: "blackarrow" or "metro" or `myTemplate` (custom Template object)
reverseArrow:!1,// to make arrows point to ancestors, if displayed
orientation:root.orientation,element:root.shadowRoot.querySelector("#gitGraph")};if(""!==root.mode){config.mode=root.mode}root.config=config}});_exports.LrnGitgraph=LrnGitgraph});