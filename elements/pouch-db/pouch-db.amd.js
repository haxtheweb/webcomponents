define(["exports","./node_modules/@polymer/polymer/polymer-element.js","./lib/pouchdb.min.js"],function(_exports,_polymerElement,_pouchdbMin){"use strict";Object.defineProperty(_exports,"__esModule",{value:!0});_exports.PouchDb=void 0;function _templateObject_d0b761a0ab1611e9990aed8ad8315e8c(){var data=babelHelpers.taggedTemplateLiteral(["\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"]);_templateObject_d0b761a0ab1611e9990aed8ad8315e8c=function _templateObject_d0b761a0ab1611e9990aed8ad8315e8c(){return data};return data}// register globally so we can make sure there is only one
window.PouchDb=window.PouchDb||{};// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same pouch-db element, making it a singleton.
window.PouchDb.requestAvailability=function(){// if there is no single instance, generate one and append it to end of the document
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
 */var PouchDb=/*#__PURE__*/function(_PolymerElement){babelHelpers.inherits(PouchDb,_PolymerElement);function PouchDb(){babelHelpers.classCallCheck(this,PouchDb);return babelHelpers.possibleConstructorReturn(this,babelHelpers.getPrototypeOf(PouchDb).apply(this,arguments))}babelHelpers.createClass(PouchDb,[{key:"connectedCallback",/**
   * life cycle, element is afixed to the DOM
   */value:function connectedCallback(){babelHelpers.get(babelHelpers.getPrototypeOf(PouchDb.prototype),"connectedCallback",this).call(this);window.addEventListener("user-engagement",this.userEngagmentFunction.bind(this));window.addEventListener("get-data",this.getDataFunction.bind(this))}},{key:"userEngagmentFunction",value:function userEngagmentFunction(e){var eventData=e.detail,whatEvent=event.target.tagName;switch(whatEvent){case"MULTIPLE-CHOICE":var dbType="xapistatements",activityDisplay=eventData.activityDisplay,activityId="http://adlnet.gov/expapi/verbs/"+activityDisplay,objectId="http://haxcms.psu.edu/haxQuiz",objectName=eventData.objectName,objectDescription="HAX Quiz",resultScoreScaled=1,resultScoreMin=0,resultScoreMax=100,resultScoreRaw=100,resultSuccess=eventData.resultSuccess,resultCompletion=!0,resultResponse="sample",resultDuration="sample";//hard-coded for now for results, future tracking change to pull data from eventData.x
break;default:break;}var db=new PouchDB(dbType),remoteCouch=!1,userEmail="mailto:dave@gmail.com",userName="Dave Fusco",objectStatement={actor:{mbox:userEmail,name:userName,objectType:"Agent"},verb:{id:activityId,display:{"en-US":activityDisplay}},object:{id:objectId,definition:{name:{"en-US":objectName},description:{"en-US":objectDescription}},objectType:"Activity"},result:{score:{scaled:resultScoreScaled,min:resultScoreMin,max:resultScoreMax,raw:resultScoreRaw},success:resultSuccess,completion:resultCompletion,response:resultResponse,duration:resultDuration}},xapistatement={_id:new Date().toISOString(),title:JSON.stringify(objectStatement),completed:!1};db.put(xapistatement,function callback(err,result){if(!err){console.log("Successfully posted a statement!")}});if(remoteCouch){var opts={live:!0};db.replicate.to(remoteCouch,opts,syncError);db.replicate.from(remoteCouch,opts,syncError)}//display for testing only - move to own elements
db.allDocs({include_docs:!0,descending:!0},function(err,doc){console.log(doc.rows)});//display for testing only - move to own elements
}},{key:"getDataFunction",value:function getDataFunction(e){var eventData=e.detail,whatEvent=event.target.tagName;switch(eventData.queryRequest){case"all-quizzes":var dbType="xapistatements";//this needs to be changed to be more dynamic in the future
break;case"single-quiz":var dbType="xapistatements",objectName=eventData.objectName;//this needs to be changed to be more dynamic in the future
//"Quiz2"
break;case"future-query":var dbType="xapistatements",activityDisplay=eventData.activityDisplay,objectName=eventData.objectName,resultSuccess=eventData.resultSuccess,resultCompletion=eventData.resultCompletion;break;default:var dbType="xapistatements";break;}var db=new PouchDB(dbType),remoteCouch=!1;///var remoteCouch = 'http://35.164.8.64:3000/todos';
//ADD SINGLE-QUIZ QUERY
function processxAPI(statements,callback){var arrayxAPI=[];statements.forEach(function(statement){var out=JSON.parse(statement.doc.title),jsonStatement=out.object.definition.name["en-US"];//var jsonStatement = out.verb.display['en-US'];  //verb
//all quizzes; quiz name
arrayxAPI.push(jsonStatement)});callback(arrayxAPI)}function processItems(statements,callback){var map={};statements.forEach(function(statement){map[statement]=(map[statement]||0)+1});callback(map)}db.allDocs({include_docs:!0,descending:!0},function(err,doc){processxAPI(doc.rows,function displayxAPI(mapxAPI){processItems(mapxAPI,function display(backMap){for(var labelsArray=[],resultsArray=[],_i=0,_Object$keys=Object.keys(backMap),key;_i<_Object$keys.length;_i++){key=_Object$keys[_i];labelsArray.push(key)}for(var _i2=0,_Object$values=Object.values(backMap),value;_i2<_Object$values.length;_i2++){value=_Object$values[_i2];resultsArray.push(value)}var queryData=[""];queryData={labels:labelsArray,series:[resultsArray]//activityDisplay: eventData.resultCompletion,    //FUTURE
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
   */},{key:"disconnectedCallback",value:function disconnectedCallback(){window.removeEventListener("user-engagement",this.userEngagmentFunction.bind(this));window.removeEventListener("get-data",this.getDataFunction.bind(this));babelHelpers.get(babelHelpers.getPrototypeOf(PouchDb.prototype),"disconnectedCallback",this).call(this)}}],[{key:"template",// render function
get:function get(){return(0,_polymerElement.html)(_templateObject_d0b761a0ab1611e9990aed8ad8315e8c())}// properties available to the custom element for data binding
},{key:"properties",get:function get(){return{title:{name:"title",type:"String",value:"pouch-db-default-value",reflectToAttribute:!1,observer:!1}}}/**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */},{key:"tag",get:function get(){return"pouch-db"}}]);return PouchDb}(_polymerElement.PolymerElement);_exports.PouchDb=PouchDb;window.customElements.define(PouchDb.tag,PouchDb)});