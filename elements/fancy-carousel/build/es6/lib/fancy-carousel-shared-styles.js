var $_documentContainer = document.createElement("div");
$_documentContainer.setAttribute("style", "display: none;");
$_documentContainer.innerHTML = `<dom-module id="fancy-carousel-shared-styles">
  <template>
    <style>
      button {
        position: absolute;
        top: calc(50% - 20px);
        padding: 0;
        line-height: 40px;
        border: none;
        background: none;
        color: #DDD;
        font-size: 40px;
        font-weight: bold;
        opacity: 0.7;
      }

      button:hover,
      button:focus {
        opacity: 1;
      }

      button[disabled] {
        opacity: 0.4;
      }

      #content-wrapper ::content > .spread {
        -webkit-mask-size: 2300% 100%;
        mask-size: 2300% 100%;
        -webkit-animation: mask-play 1.4s steps(22) forwards;
        animation: mask-play 1.4s steps(22) forwards;
      }

      #content-wrapper ::content > .paint {
        -webkit-mask-size: 3000% 100%;
        mask-size: 3000% 100%;
        -webkit-animation: mask-play 1.4s steps(29) forwards;
        animation: mask-play 1.4s steps(29) forwards;
      }

      #content-wrapper ::content > .shift {
        -webkit-mask-size: 7500% 100%;
        mask-size: 7500% 100%;
        -webkit-animation: mask-play 1.4s steps(74) forwards;
        animation: mask-play 1.4s steps(74) forwards;
      }

      #content-wrapper ::content > .collapse {
       -webkit-mask-size: 8400% 100%;
          mask-size: 8400% 100%;
        -webkit-animation: mask-play 1.4s steps(83) forwards;
          animation: mask-play 1.4s steps(83) forwards;
      }

      #content-wrapper ::content > img {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      @-webkit-keyframes mask-play {
        from {
        -webkit-mask-position: 0% 0;
        mask-position: 0% 0;
        }
        to {
        -webkit-mask-position: 100% 0;
        mask-position: 100% 0;
        }
      }

      @keyframes mask-play {
        from {
        -webkit-mask-position: 0% 0;
        mask-position: 0% 0;
        }
        to {
        -webkit-mask-position: 100% 0;
        mask-position: 100% 0;
        }
      }
    </style>
  </template>
</dom-module>`;
document.head.appendChild($_documentContainer);
