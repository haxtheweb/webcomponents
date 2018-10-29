import{html,Polymer}from"./node_modules/@polymer/polymer/polymer-legacy.js";import"./node_modules/@lrnwebcomponents/iron-data-table/iron-data-table.js";import"./node_modules/@polymer/iron-ajax/iron-ajax.js";var $_documentContainer=document.createElement("div");$_documentContainer.setAttribute("style","display: none;");$_documentContainer.innerHTML=`<dom-module id="lrn-gradebook">
<style>
  data-table-row {
    border: 10px solid black;
  }
</style>
  <template>
    <iron-ajax url="demo/data.json" last-response="{{data}}" auto=""></iron-ajax>
		  <iron-data-table items="[[data]]">
		    <data-table-column name="First Name">
		      <template>[[item.name.first]]</template>
		    </data-table-column>
		    <data-table-column name="Last Name">
		      <template>[[item.name.last]]</template>
		    </data-table-column>
		  </iron-data-table>
  </template>

  
</dom-module>`;document.head.appendChild($_documentContainer);Polymer({is:"lrn-gradebook",properties:{data:{type:Object}}});