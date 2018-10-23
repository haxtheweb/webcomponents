import "@polymer/polymer/polymer.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-input/paper-input.js";
const $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<dom-module id="govcon-banner">
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
  <template>
    <style>
      :host {
        display: block;
      }
      *, *:before, *:after {
      	box-sizing: inherit;
      }
      img, legend {
      	border: 0;
      }
      .secondarybanners {
      	margin: 0 -1em;
      }
      @media (min-width: 768px) {
	      .secondarybanners .secondarybanner {
	      	width: 50%;
	    	float: left;
	      }
	  }
      .secondarybanner {
      	display: block;
	    position: relative;
	    margin-bottom: -0.5em;
      }
      .secondarybanner:after {
      	content: "";
	    display: block;
	    clear: both;
      }
      .secondarybanner img {
      	width: 100%;
      }
      .secondarybanner__text {
      	position: absolute;
	    bottom: 0.5em;
	    padding-bottom: 0.5em;
      }
      .secondarybanner h3 {
      	font-family: Helvetica,sans-serif;
	    font-size: 2.5em;
	    letter-spacing: 0.05em;
	    color: white;
	    text-shadow: 0 0 0.5em rgba(0,0,0,0.5);
	    margin: 0 0.5em -0.25em 0.5em;
	    padding-bottom: 0;
	    line-height: 145%;
      }
      .secondarybanner p {
      	color: #efac37;
	    margin: 0 1em;
	    padding: 0 0 0.5em 0;
      }
      .secondarybanner a:link, .secondarybanner a:visited {
      	color: #efac37;
    	text-decoration: none;
    	cursor: inherit;
      }
    </style>
    <a tabindex="-1" href="[[link]]">
    <paper-button raised="">
  	<div class="secondarybanner">
  	  <img src="[[image]]" alt="[[alt]]">
  	  <div class="secondarybanner__text">
        <template is="dom-if" if="[[title]]">
  	      <h3>[[title]]</h3>
        </template>
  	    <p>[[text]]</p>
  	  </div>
  	</div>
    </paper-button>
    </a>
    <paper-input value="{{link}}"></paper-input>
  </template>

  
</dom-module><template>
		<style>
			:host {
				display: block;
			}

			*,
			*:before,
			*:after {
				box-sizing: inherit;
			}

			img,
			legend {
				border: 0;
			}

			.secondarybanners {
				margin: 0 -1em;
			}

			@media (min-width: 768px) {
				.secondarybanners .secondarybanner {
					width: 50%;
					float: left;
				}
			}

			.secondarybanner {
				display: block;
				position: relative;
				margin-bottom: -0.5em;
			}

			.secondarybanner:after {
				content: "";
				display: block;
				clear: both;
			}

			.secondarybanner img {
				width: 100%;
			}

			.secondarybanner__text {
				position: absolute;
				bottom: 0.5em;
				padding-bottom: 0.5em;
			}

			.secondarybanner h3 {
				font-family: Helvetica, sans-serif;
				font-size: 2.5em;
				letter-spacing: 0.05em;
				color: white;
				text-shadow: 0 0 0.5em rgba(0, 0, 0, 0.5);
				margin: 0 0.5em -0.25em 0.5em;
				padding-bottom: 0;
				line-height: 145%;
			}

			.secondarybanner p {
				color: #efac37;
				margin: 0 1em;
				padding: 0 0 0.5em 0;
			}

			.secondarybanner a:link,
			.secondarybanner a:visited {
				color: #efac37;
				text-decoration: none;
				cursor: inherit;
			}
			</style>



			<paper-button on-click="_buttonClicked">
				<div class="secondarybanner">
					<img src="[[image]]" alt="[[alt]]">
					<div class="secondarybanner__text">
						<template is="dom-if" if="[[_renderTitle()]]">
							<h3>[[title]]</h3>
						</template>
						<p>[[text]]</p>
					</div>
				</div>
			</paper-button>


	</template>`;

document.head.appendChild($_documentContainer);
/**
`govcon-banner`
A sample govcon banner.

@demo demo/index.html
*/
Polymer({
  is: "govcon-banner",

  properties: {
    title: {
      type: String
    },
    text: {
      type: String
    },
    image: {
      type: String
    },
    link: {
      type: String
    },
    alt: {
      type: String
    }
  }
});
Polymer({
  is: "govcon-banner",

  properties: {
    title: {
      type: String
    },
    text: {
      type: String
    },
    image: {
      type: String
    },
    link: {
      type: String
    },
    alt: {
      type: String
    }
  },
  _renderTitle: function() {
    return true;
  },
  _buttonClicked: function() {
    if (this.link) {
      alert("I'm going to " + this.link);
    }
  }
});
