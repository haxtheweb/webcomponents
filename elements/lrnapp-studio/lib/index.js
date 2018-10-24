import "/node_modules/google-webfont-loader/google-webfont-loader.js";
import "/src/lrnapp-studio-app/lrnapp-studio-app.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@webcomponents/webcomponentsjs/webcomponents-lite.js";
var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");

$_documentContainer.innerHTML = `<title>lrnapp-studio-app</title><google-webfont-loader fonts="Roboto,Droid Sans,Droid Serif"></google-webfont-loader><style is="custom-style" include="iron-flex iron-flex-alignment"></style><style>
     body {
          margin:0;
          font-family: "Droid Sans";
        }
      .paper-material-margin-small {
        margin: 1rem 1rem;
        }
      .paper-material-margin-med {
        margin: 2rem;
      }
      .paper-material-margin-large {
        margin: 3.5rem;
      }
      .paper-material-padding-small {
        padding: 1rem;
      }
      .paper-material-padding-med {
        padding: 2rem;
      }
      .paper-material-padding-large {
        padding: 3.5rem;
      }
      .padding-xsmall {
        padding: 0.5rem;
      }
      .padding-width-small {
        padding: 1rem;
      }
      .padding-height-small {
       padding: 1rem; 
      }
      .padding-width-med {
       padding: 2rem; 
      }
      .divider {
        height:1px;
        width:100%;
        background-color: #efefef;

      }
   </style><lrnapp-studio-app></lrnapp-studio-app>`;

document.head.appendChild($_documentContainer);

/* See https://goo.gl/OOhYW5 */
