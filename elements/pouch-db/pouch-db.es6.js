/**
 * Copyright 2019
 * @license Apache-2.0, see License.md for full text.
 */import{html,PolymerElement}from"./node_modules/@polymer/polymer/polymer-element.js";import"./lib/pouchdb.min.js";// register globally so we can make sure there is only one
window.PouchDb=window.PouchDb||{};// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same pouch-db element, making it a singleton.
window.PouchDb.requestAvailability=()=>{// if there is no single instance, generate one and append it to end of the document
if(!window.PouchDb.instance){window.PouchDb.instance=document.createElement("pouch-db");document.body.appendChild(window.PouchDb.instance)}return window.PouchDb.instance};/**
 * `pouch-db`
 * `read and write localized data elements`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */class PouchDb extends PolymerElement{// render function
static get template(){return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`}// properties available to the custom element for data binding
static get properties(){return{title:{name:"title",type:"String",value:"pouch-db-default-value",reflectToAttribute:!1,observer:!1}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */static get tag(){return"pouch-db"}/**
   * life cycle, element is afixed to the DOM
   */connectedCallback(){super.connectedCallback();window.addEventListener("user-engagement",this.userEngagmentFunction.bind(this));window.addEventListener("get-data",this.getDataFunction.bind(this))}userEngagmentFunction(e){var eventData=e.detail,whatEvent=event.target.tagName;switch(whatEvent){case"MULTIPLE-CHOICE":var dbType="xapistatements",activityDisplay=eventData.activityDisplay,activityId="http://adlnet.gov/expapi/verbs/"+activityDisplay,objectId="http://haxcms.psu.edu/haxQuiz",objectName=eventData.objectName,objectDescription="HAX Quiz",resultScoreScaled=1,resultScoreMin=0,resultScoreMax=100,resultScoreRaw=100,resultSuccess=eventData.resultSuccess,resultCompletion=!0,resultResponse="sample",resultDuration="sample";//hard-coded for now for results, future tracking change to pull data from eventData.x
break;default:break;}var db=new PouchDB(dbType),remoteCouch=!1,userEmail="mailto:dave@gmail.com",userName="Dave Fusco",objectStatement={actor:{mbox:userEmail,name:userName,objectType:"Agent"},verb:{id:activityId,display:{"en-US":activityDisplay}},object:{id:objectId,definition:{name:{"en-US":objectName},description:{"en-US":objectDescription}},objectType:"Activity"},result:{score:{scaled:resultScoreScaled,min:resultScoreMin,max:resultScoreMax,raw:resultScoreRaw},success:resultSuccess,completion:resultCompletion,response:resultResponse,duration:resultDuration}},xapistatement={_id:new Date().toISOString(),title:JSON.stringify(objectStatement),completed:!1};db.put(xapistatement,function callback(err,result){if(!err){console.log("Successfully posted a statement!")}});if(remoteCouch){var opts={live:!0};db.replicate.to(remoteCouch,opts,syncError);db.replicate.from(remoteCouch,opts,syncError)}//display for testing only - move to own elements
db.allDocs({include_docs:!0,descending:!0},function(err,doc){console.log(doc.rows)});//display for testing only - move to own elements
}getDataFunction(e){var eventData=e.detail,whatEvent=event.target.tagName;switch(eventData.queryRequest){case"all-quizzes":var dbType="xapistatements";//this needs to be changed to be more dynamic in the future
break;case"single-quiz":var dbType="xapistatements",objectName=eventData.objectName;//this needs to be changed to be more dynamic in the future
//"Quiz2"
break;case"future-query":var dbType="xapistatements",activityDisplay=eventData.activityDisplay,objectName=eventData.objectName,resultSuccess=eventData.resultSuccess,resultCompletion=eventData.resultCompletion;break;default:var dbType="xapistatements";break;}var db=new PouchDB(dbType),remoteCouch=!1;///var remoteCouch = 'http://35.164.8.64:3000/todos';
//ADD SINGLE-QUIZ QUERY
function processxAPI(statements,callback){var arrayxAPI=[];statements.forEach(function(statement){var out=JSON.parse(statement.doc.title),jsonStatement=out.object.definition.name["en-US"];//var jsonStatement = out.verb.display['en-US'];  //verb
//all quizzes; quiz name
arrayxAPI.push(jsonStatement)});callback(arrayxAPI)}function processItems(statements,callback){var map={};statements.forEach(function(statement){map[statement]=(map[statement]||0)+1});callback(map)}db.allDocs({include_docs:!0,descending:!0},function(err,doc){processxAPI(doc.rows,function displayxAPI(mapxAPI){processItems(mapxAPI,function display(backMap){var labelsArray=[],resultsArray=[];for(let key of Object.keys(backMap)){labelsArray.push(key)}for(let value of Object.values(backMap)){resultsArray.push(value)}let queryData=[""];queryData={labels:labelsArray,series:[resultsArray]//activityDisplay: eventData.resultCompletion,    //FUTURE
//objectName: eventData.objectName,               //FUTURE
//resultSuccess: eventData.resultSuccess          //FUTURE
//resultCompletion: eventData.resultCompletion    //FUTURE
};window.dispatchEvent(new CustomEvent("show-data",{bubbles:!0,composed:!0,cancelable:!1,detail:queryData}))}// end of display function
);//end of processItems
}// end of displayxAPI function
);//end of processxAPI
});//end of db.allDocs
}// end of getDataFunction
/**
   * life cycle, element is removed from the DOM
   */disconnectedCallback(){window.removeEventListener("user-engagement",this.userEngagmentFunction.bind(this));window.removeEventListener("get-data",this.getDataFunction.bind(this));super.disconnectedCallback()}}window.customElements.define(PouchDb.tag,PouchDb);export{PouchDb};