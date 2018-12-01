import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/lrndesign-animationctrl/lrndesign-animationctrl.js";
import "./TweenMax.min.js";
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-family: "Open Sans", sans-serif;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: #6d6e71;
        text-align: center;
      }

      p {
        font-family: "Open Sans", sans-serif;
      }
    </style>

    <h1>Gene Crossover</h1>

    <p>
      Crossing over occurs when homologous chromosomes come together in
      synapsis. While in a tetrad, the chromatids align gene by gene and, at
      certain locations, can exchange genetic material.
    </p>

    <svg
      id="chromosomes"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 640 254.99"
    >
      <defs>
        <radialGradient
          id="423bb513-14ae-434c-b9bb-d9a74df89b27"
          cx="22"
          cy="-240.01"
          r="88.56"
          gradientTransform="matrix(0.13, -0.99, -0.99, -0.13, 168.97, 155.6)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#fcf"></stop>
          <stop offset="1" stop-color="#f6f"></stop>
        </radialGradient>
        <radialGradient
          id="fc7cb739-d6ee-4cf2-a252-fc4c057621b3"
          cx="-363.75"
          cy="-254.35"
          r="92.34"
          gradientTransform="matrix(-0.18, -0.98, -0.98, 0.18, -39.2, -143.49)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stop-color="#09f"></stop>
          <stop offset="1" stop-color="#03c"></stop>
        </radialGradient>
        <radialGradient
          id="6cea740f-d3d4-4767-9547-190646ef7d92"
          cx="-36.8"
          cy="-249.99"
          r="92.34"
          gradientTransform="matrix(0.08, -1, -1, -0.08, 30.75, 109.83)"
          xlink:href="#fc7cb739-d6ee-4cf2-a252-fc4c057621b3"
        ></radialGradient>
        <radialGradient
          id="56d773ec-f559-482e-86df-677cabc1a326"
          cx="-134.15"
          cy="-260.27"
          r="88.6"
          gradientTransform="matrix(0, -1, -1, 0, 134.88, 32.04)"
          xlink:href="#423bb513-14ae-434c-b9bb-d9a74df89b27"
        ></radialGradient>
        <radialGradient
          id="43b707a5-bf31-4e7b-90cb-2c24898c3fb8"
          cx="186.44"
          cy="-196.29"
          r="92.4"
          gradientTransform="matrix(0.26, -0.97, -0.97, -0.26, 28.74, 292.89)"
          xlink:href="#fc7cb739-d6ee-4cf2-a252-fc4c057621b3"
        ></radialGradient>
        <radialGradient
          id="952d2618-a390-4884-85df-2b86ba1eaa53"
          cx="97.82"
          cy="-222.83"
          r="92.35"
          gradientTransform="matrix(0.19, -0.98, -0.98, -0.19, -7.28, 221.62)"
          xlink:href="#fc7cb739-d6ee-4cf2-a252-fc4c057621b3"
        ></radialGradient>
        <radialGradient
          id="e3dcd28f-8611-46e9-9db2-36732c731126"
          cx="-134.15"
          cy="-260.27"
          r="92.4"
          gradientTransform="matrix(0, -1, -1, 0, 15.88, 31.04)"
          xlink:href="#fc7cb739-d6ee-4cf2-a252-fc4c057621b3"
        ></radialGradient>
        <radialGradient
          id="49acdd7e-3376-4b78-924b-3756b53c914f"
          cx="-134.15"
          cy="-260.27"
          r="92.4"
          gradientTransform="matrix(0, -1, -1, 0, 23.88, 31.04)"
          xlink:href="#fc7cb739-d6ee-4cf2-a252-fc4c057621b3"
        ></radialGradient>
        <radialGradient
          id="8f935048-8543-413e-9bb5-8eb18bec537f"
          cx="-134.15"
          cy="-260.27"
          r="88.7"
          gradientTransform="matrix(0, -1, -1, 0, 28.63, 27.54)"
          xlink:href="#fc7cb739-d6ee-4cf2-a252-fc4c057621b3"
        ></radialGradient>
      </defs>
      <title>crossover-2-full</title>

      <g id="setonerightfour">
        <g id="Layer1_0_FILL-15" data-name="Layer1 0 FILL">
          <path
            d="M327.12,82.44a15.13,15.13,0,0,0-7.35,5.15,12.68,12.68,0,0,0-1.9,9.2v.05l1.8,14.15.2,1.3,8.35,44.45,2.2,11.35.15,1.25a177.18,177.18,0,0,0-6.7,26.3l-.1,2.15q.35,5.8,7.9,7.3,8.65,1.7,12-7.3l.15-.4q3.25-9.4,3.25-14l2,6.35A49.42,49.42,0,0,0,354.87,202q3.9,6.15,8.9,4.1a42.1,42.1,0,0,0,6.35-2.95,8.13,8.13,0,0,0,2.4-2.65q1-1.7-.6-5.9a142.08,142.08,0,0,0-12.15-24.45q3.7-5.5,9.2-20.9t11.7-34.3a101.51,101.51,0,0,0,3.75-16.6l.2-2.4-.2-5.25q-.95-6.45-12.85-9.4-9.3-2.65-11.7,7-7.9,37.35-12.1,68L345.32,116a181.16,181.16,0,0,0-3.9-22.55Q337.77,78.54,327.12,82.44Z"
            fill="#c978af"
            stroke="#fcf"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </g>
        <path
          id="Layer1_0_1_STROKES-15"
          data-name="Layer1 0 1 STROKES"
          d="M327.12,82.44q10.65-3.9,14.3,11a181.16,181.16,0,0,1,3.9,22.55l2.45,40.4q4.2-30.65,12.1-68,2.4-9.7,11.7-7,11.9,3,12.85,9.4l.2,5.25-.2,2.4a101.51,101.51,0,0,1-3.75,16.6q-6.25,19-11.7,34.3t-9.2,20.9a142.08,142.08,0,0,1,12.15,24.45q1.55,4.2.6,5.9a8.13,8.13,0,0,1-2.4,2.65,42.1,42.1,0,0,1-6.35,2.95q-5,2.05-8.9-4.1A49.42,49.42,0,0,1,349,189.79l-2-6.35q0,4.55-3.25,14l-.15.4q-3.3,9-12,7.3-7.55-1.5-7.9-7.3l.1-2.15a177.18,177.18,0,0,1,6.7-26.3l-.15-1.25-2.2-11.35-8.35-44.45-.2-1.3-1.8-14.15v-.05a12.68,12.68,0,0,1,1.9-9.2A15.13,15.13,0,0,1,327.12,82.44Z"
          fill="#c978af"
          stroke="#fcf"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
      <g id="setoneleftfour">
        <g id="Layer0_0_FILL-15" data-name="Layer0 0 FILL">
          <path
            d="M277.2,149.19l.65,3.2.65,3.3-.3-4.15-.25-1.35-.3-.5Z"
            fill="#344da1"
            stroke="#2895b2"
            stroke-miterlimit="10"
          ></path>
          <path
            d="M259.55,89.54q-6.4-13.95-16.1-8.1t-6.35,16l4.5,13.55.4,1.25,16.75,42.05L263.1,165a177.39,177.39,0,0,0-6.75,26.55l-.1,2.15q.35,5.8,7.9,7.3,8.65,1.7,12-7.3l.15-.4q3.25-9.4,3.25-14l2,6.35A49.42,49.42,0,0,0,287.35,198q3.9,6.15,8.9,4.1a42.1,42.1,0,0,0,6.35-3,8.13,8.13,0,0,0,2.4-2.65q.95-1.7-.6-5.9a139.09,139.09,0,0,0-11.85-23.9q5-6.7,6.35-23l2.45-36.15-.7-17-.4-2.35a28.49,28.49,0,0,0-1.55-5q-2.6-6-14.85-5.75-9.65-.15-9.5,9.85l3.85,64.3.3,4.15-.65-3.3-.65-3.2q-5-23.75-9.45-38.25A173.9,173.9,0,0,0,259.55,89.54Z"
            fill="#344da1"
            stroke="#2895b2"
            stroke-miterlimit="10"
          ></path>
        </g>
        <path
          id="Layer0_0_1_STROKES-15"
          data-name="Layer0 0 1 STROKES"
          d="M278.2,151.54l-3.85-64.3q-.15-10,9.5-9.85,12.25-.2,14.85,5.75a28.49,28.49,0,0,1,1.55,5l.4,2.35.7,17-2.45,36.15q-1.35,16.3-6.35,23a139.09,139.09,0,0,1,11.85,23.9q1.55,4.2.6,5.9a8.13,8.13,0,0,1-2.4,2.65,42.1,42.1,0,0,1-6.35,3q-5,2-8.9-4.1a49.42,49.42,0,0,1-5.85-12.25l-2-6.35q0,4.55-3.25,14l-.15.4q-3.3,9-12,7.3-7.55-1.5-7.9-7.3l.1-2.15A177.39,177.39,0,0,1,263.1,165l-4.35-10.8L242,112.19l-.4-1.25-4.5-13.55q-3.4-10.05,6.35-16t16.1,8.1a173.9,173.9,0,0,1,8.2,21.4q4.45,14.5,9.45,38.25m.75,1,.25,1.35.3,4.15-.65-3.3-.65-3.2"
          fill="#344da1"
          stroke="#2895b2"
          stroke-miterlimit="10"
        ></path>
      </g>
      <g id="setonerightthree">
        <g id="Layer1_0_FILL-16" data-name="Layer1 0 FILL">
          <path
            d="M327.1,82.44a15.13,15.13,0,0,0-7.35,5.15,12.68,12.68,0,0,0-1.9,9.2v.05l1.8,14.15.2,1.3,8.35,44.45,2.2,11.35.15,1.25a177.18,177.18,0,0,0-6.7,26.3l-.1,2.15q.35,5.8,7.9,7.3,8.65,1.7,12-7.3l.15-.4q3.25-9.4,3.25-14l2,6.35A49.42,49.42,0,0,0,354.85,202q3.9,6.15,8.9,4.1a42.1,42.1,0,0,0,6.35-2.95,8.13,8.13,0,0,0,2.4-2.65q1-1.7-.6-5.9a142.08,142.08,0,0,0-12.15-24.45q3.7-5.5,9.2-20.9t11.7-34.3a101.51,101.51,0,0,0,3.75-16.6l.2-2.4-.2-5.25q-.95-6.45-12.85-9.4-9.3-2.65-11.7,7-7.9,37.35-12.1,68L345.3,116a181.16,181.16,0,0,0-3.9-22.55Q337.75,78.54,327.1,82.44Z"
            fill="#c978af"
            stroke="#fcf"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </g>
        <path
          id="Layer1_0_1_STROKES-16"
          data-name="Layer1 0 1 STROKES"
          d="M327.1,82.44q10.65-3.9,14.3,11A181.16,181.16,0,0,1,345.3,116l2.45,40.4q4.2-30.65,12.1-68,2.4-9.7,11.7-7,11.9,3,12.85,9.4l.2,5.25-.2,2.4a101.51,101.51,0,0,1-3.75,16.6q-6.25,19-11.7,34.3t-9.2,20.9a142.08,142.08,0,0,1,12.15,24.45q1.55,4.2.6,5.9a8.13,8.13,0,0,1-2.4,2.65,42.1,42.1,0,0,1-6.35,2.95q-5,2.05-8.9-4.1A49.42,49.42,0,0,1,349,189.79l-2-6.35q0,4.55-3.25,14l-.15.4q-3.3,9-12,7.3-7.55-1.5-7.9-7.3l.1-2.15a177.18,177.18,0,0,1,6.7-26.3l-.15-1.25-2.2-11.35-8.35-44.45-.2-1.3-1.8-14.15v-.05a12.68,12.68,0,0,1,1.9-9.2A15.13,15.13,0,0,1,327.1,82.44Z"
          fill="none"
          stroke="#fcf"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
      <g id="setoneleftthree">
        <path
          d="M259.55,89.54q-6.4-13.95-16.1-8.1t-6.35,16l4.5,13.55.4,1.25,16.75,42.05L263.1,165a177.39,177.39,0,0,0-6.75,26.55l-.1,2.15q.35,5.8,7.9,7.3,8.65,1.7,12-7.3l.15-.4q3.25-9.4,3.25-14l2,6.35A49.42,49.42,0,0,0,287.35,198q3.9,6.15,8.9,4.1a42.1,42.1,0,0,0,6.35-3,8.13,8.13,0,0,0,2.4-2.65q.95-1.7-.6-5.9a139.09,139.09,0,0,0-11.85-23.9q5-6.7,6.35-23l2.45-36.15-.7-17-.4-2.35a28.49,28.49,0,0,0-1.55-5q-2.6-6-14.85-5.75-9.65-.15-9.5,9.85l3.85,64.3.3,4.15-.65-3.3-.65-3.2q-5-23.75-9.45-38.25A173.9,173.9,0,0,0,259.55,89.54Z"
          fill="#344da1"
          stroke="#2895b2"
          stroke-miterlimit="10"
        ></path>
      </g>
      <g id="setonerighttwo">
        <g id="Layer1_0_FILL-17" data-name="Layer1 0 FILL">
          <path
            d="M347,93.59q-6.4-13.95-16.1-8.1t-6.35,16L329.1,115l.4,1.25q8,20.4,16.75,42.05l4.35,10.8a177.39,177.39,0,0,0-6.75,26.55l-.1,2.15q.35,5.8,7.9,7.3,8.65,1.7,12-7.3l.15-.4q3.25-9.4,3.25-14l2,6.35A49.42,49.42,0,0,0,374.85,202q3.9,6.15,8.9,4.1a42.1,42.1,0,0,0,6.35-2.95,8.13,8.13,0,0,0,2.4-2.65q1-1.7-.6-5.9a142.08,142.08,0,0,0-12.15-24.45q3.7-5.5,9.2-20.9t11.7-34.3a101.51,101.51,0,0,0,3.75-16.6l.2-2.4-.2-5.25q-.95-6.45-12.85-9.4-9.3-2.65-11.7,7-9.45,44.7-13.9,68.3-4.45-21.2-10.7-41.7A173.9,173.9,0,0,0,347,93.59Z"
            fill="#c978af"
            stroke="#fcf"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </g>
        <path
          id="Layer1_0_1_STROKES-17"
          data-name="Layer1 0 1 STROKES"
          d="M347,93.59a173.9,173.9,0,0,1,8.2,21.4q6.25,20.5,10.7,41.7,4.45-23.6,13.9-68.3,2.4-9.7,11.7-7,11.9,3,12.85,9.4l.2,5.25-.2,2.4a101.51,101.51,0,0,1-3.75,16.6q-6.25,19-11.7,34.3t-9.2,20.9a142.08,142.08,0,0,1,12.15,24.45q1.55,4.2.6,5.9a8.13,8.13,0,0,1-2.4,2.65,42.1,42.1,0,0,1-6.35,2.95q-5,2.05-8.9-4.1A49.42,49.42,0,0,1,369,189.79l-2-6.35q0,4.55-3.25,14l-.15.4q-3.3,9-12,7.3-7.55-1.5-7.9-7.3l.1-2.15a177.39,177.39,0,0,1,6.75-26.55l-4.35-10.8q-8.75-21.65-16.75-42.05l-.4-1.25-4.5-13.55q-3.4-10.05,6.35-16T347,93.59Z"
          fill="#c978af"
          stroke="#fcf"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
      <g id="setonelefttwo">
        <g id="Layer0_0_FILL-16" data-name="Layer0 0 FILL">
          <path
            d="M239.55,89.54q-6.4-13.95-16.1-8.1t-6.35,16l4.5,13.55.4,1.25,16.75,42.05L243.1,165a177.39,177.39,0,0,0-6.75,26.55l-.1,2.15q.35,5.8,7.9,7.3,8.65,1.7,12-7.3l.15-.4q3.25-9.4,3.25-14l2,6.35A49.42,49.42,0,0,0,267.35,198q3.9,6.15,8.9,4.1a42.1,42.1,0,0,0,6.35-3,8.13,8.13,0,0,0,2.4-2.65q.95-1.7-.6-5.9a142.08,142.08,0,0,0-12.15-24.45q3.7-5.5,9.2-20.9t11.7-34.3a101.51,101.51,0,0,0,3.75-16.6l.2-2.4-.2-5.25q-.95-6.45-12.85-9.4-9.3-2.65-11.7,7.05-9.45,44.7-13.9,68.3-4.45-21.2-10.7-41.7A173.9,173.9,0,0,0,239.55,89.54Z"
            fill="#344da1"
          ></path>
        </g>
        <path
          id="Layer0_0_1_STROKES-16"
          data-name="Layer0 0 1 STROKES"
          d="M221.6,110.94l-4.5-13.55q-3.4-10.05,6.35-16t16.1,8.1a173.9,173.9,0,0,1,8.2,21.4q6.25,20.5,10.7,41.7,4.45-23.6,13.9-68.3,2.4-9.7,11.7-7.05,11.9,3,12.85,9.4l.2,5.25-.2,2.4a101.51,101.51,0,0,1-3.75,16.6q-6.25,19-11.7,34.3t-9.2,20.9a142.08,142.08,0,0,1,12.15,24.45q1.55,4.2.6,5.9a8.13,8.13,0,0,1-2.4,2.65,42.1,42.1,0,0,1-6.35,3q-5,2-8.9-4.1a49.42,49.42,0,0,1-5.85-12.25l-2-6.35q0,4.55-3.25,14l-.15.4q-3.3,9-12,7.3-7.55-1.5-7.9-7.3l.1-2.15A177.39,177.39,0,0,1,243.1,165l-4.35-10.8L222,112.19Z"
          fill="none"
          stroke="#2895b2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
      <g id="setonerightone">
        <g id="Layer1_0_FILL-18" data-name="Layer1 0 FILL">
          <path
            d="M355,93.59q-6.4-13.95-16.1-8.1t-6.35,16L337.1,115l.4,1.25q8,20.4,16.75,42.05l4.35,10.8a177.39,177.39,0,0,0-6.75,26.55l-.1,2.15q.35,5.8,7.9,7.3,8.65,1.7,12-7.3l.15-.4q3.25-9.4,3.25-14l2,6.35A49.42,49.42,0,0,0,382.85,202q3.9,6.15,8.9,4.1a42.1,42.1,0,0,0,6.35-2.95,8.13,8.13,0,0,0,2.4-2.65q1-1.7-.6-5.9a142.08,142.08,0,0,0-12.15-24.45q3.7-5.5,9.2-20.9t11.7-34.3a101.51,101.51,0,0,0,3.75-16.6l.2-2.4-.2-5.25q-.95-6.45-12.85-9.4-9.3-2.65-11.7,7-9.45,44.7-13.9,68.3-4.45-21.2-10.7-41.7A173.9,173.9,0,0,0,355,93.59Z"
            fill="#c978af"
            stroke="#fcf"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </g>
        <path
          id="Layer1_0_1_STROKES-18"
          data-name="Layer1 0 1 STROKES"
          d="M355,93.59a173.9,173.9,0,0,1,8.2,21.4q6.25,20.5,10.7,41.7,4.45-23.6,13.9-68.3,2.4-9.7,11.7-7,11.9,3,12.85,9.4l.2,5.25-.2,2.4a101.51,101.51,0,0,1-3.75,16.6q-6.25,19-11.7,34.3t-9.2,20.9a142.08,142.08,0,0,1,12.15,24.45q1.55,4.2.6,5.9a8.13,8.13,0,0,1-2.4,2.65,42.1,42.1,0,0,1-6.35,2.95q-5,2.05-8.9-4.1A49.42,49.42,0,0,1,377,189.79l-2-6.35q0,4.55-3.25,14l-.15.4q-3.3,9-12,7.3-7.55-1.5-7.9-7.3l.1-2.15a177.39,177.39,0,0,1,6.75-26.55l-4.35-10.8q-8.75-21.65-16.75-42.05l-.4-1.25-4.5-13.55q-3.4-10.05,6.35-16T355,93.59Z"
          fill="none"
          stroke="#fcf"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
      <g id="setoneleftone">
        <g id="Layer0_0_FILL-17" data-name="Layer0 0 FILL">
          <path
            d="M213.6,110.94l.4,1.25,16.75,42.05L235.1,165a177.39,177.39,0,0,0-6.75,26.55l-.1,2.15q.35,5.8,7.9,7.3,8.65,1.7,11.95-7.3l.15-.4q3.25-9.4,3.25-14l2,6.35A49.42,49.42,0,0,0,259.35,198q3.9,6.15,8.9,4.1a42.1,42.1,0,0,0,6.35-3,8.13,8.13,0,0,0,2.4-2.65q1-1.7-.6-5.9a142.08,142.08,0,0,0-12.15-24.45q3.7-5.5,9.2-20.9t11.7-34.3a101.51,101.51,0,0,0,3.75-16.6l.2-2.4-.2-5.25q-.95-6.45-12.85-9.4-9.3-2.65-11.7,7.05-9.45,44.7-13.9,68.3-4.45-21.2-10.7-41.7a173.9,173.9,0,0,0-8.2-21.4q-6.4-13.95-16.1-8.1t-6.35,16Z"
            fill="#344da1"
          ></path>
        </g>
        <path
          id="Layer0_0_1_STROKES-17"
          data-name="Layer0 0 1 STROKES"
          d="M213.6,110.94l-4.5-13.55q-3.4-10.05,6.35-16t16.1,8.1a173.9,173.9,0,0,1,8.2,21.4q6.25,20.5,10.7,41.7,4.45-23.6,13.9-68.3,2.4-9.7,11.7-7.05,11.9,3,12.85,9.4l.2,5.25-.2,2.4a101.51,101.51,0,0,1-3.75,16.6q-6.25,19-11.7,34.3t-9.2,20.9a142.08,142.08,0,0,1,12.15,24.45q1.55,4.2.6,5.9a8.13,8.13,0,0,1-2.4,2.65,42.1,42.1,0,0,1-6.35,3q-5,2-8.9-4.1a49.42,49.42,0,0,1-5.85-12.25l-2-6.35q0,4.55-3.25,14l-.15.4q-3.3,9-11.95,7.3-7.55-1.5-7.9-7.3l.1-2.15A177.39,177.39,0,0,1,235.1,165l-4.35-10.8L214,112.19Z"
          fill="none"
          stroke="#2895b2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
      <g id="synapsetext">
        <text
          transform="translate(140.01 43.11)"
          font-size="17.11"
          font-family="OpenSans, Open Sans"
        >
          Synapsed chromosomes in tetrad - Prophase I
        </text>
      </g>
    </svg>
  `,

  is: "gene-crossover-2",

  properties: {
    tl: {
      type: Object,
      value: null
    },
    selected: {
      type: Boolean,
      value: false
    },
    animationReady: {
      type: Boolean,
      value: false
    }
  },

  observers: ["_selectedChanged(selected, animationReady)"],

  _selectedChanged: function(selected, animationReady) {
    if (!animationReady) {
      return;
    }
    if (selected) {
      this.tl.play();
      this.lefttl.play();
      this.righttl.play();
    } else {
      this.tl.progress(0);
      this.lefttl.progress(0);
      this.righttl.progress(0);
      this.tl.pause();
      this.lefttl.pause();
      this.righttl.pause();
    }
  },

  ready: function() {
    var root = this;
    var tl = new TimelineMax();
    var lefttl = new TimelineMax();
    var righttl = new TimelineMax();
    var playButton = this.shadowRoot.querySelector("#play-button");
    var replayButton = this.shadowRoot.querySelector("#replay-button");
    var svg = this.shadowRoot.querySelector("#chromosomes");

    // Text
    var synapsetext = svg.getElementById("synapsetext");

    // Right
    var setonerightfour = svg.getElementById("setonerightfour");
    var setonerightthree = svg.getElementById("setonerightthree");
    var setonerighttwo = svg.getElementById("setonerighttwo");
    var setonerightone = svg.getElementById("setonerightone");

    // Left
    var setoneleftfour = svg.getElementById("setoneleftfour");
    var setoneleftthree = svg.getElementById("setoneleftthree");
    var setonelefttwo = svg.getElementById("setonelefttwo");
    var setoneleftone = svg.getElementById("setoneleftone");

    // Set Animate
    tl.set(
      [
        setoneleftfour,
        setoneleftthree,
        setonelefttwo,
        setonerightfour,
        setonerightthree,
        setonerighttwo
      ],
      {
        display: "none"
      }
    );

    //Animate Start
    tl.to([setoneleftone], 0.2, {
      x: "+=5",
      alpha: 0
    }).to([setonerightone], 0.2, {
      x: "-=5",
      alpha: 0
    });

    // Animate Left
    lefttl
      .to([setonelefttwo], 0.1, {
        x: "+=10",
        display: "block",
        display: "none"
      })
      .to([setoneleftthree], 0.3, {
        x: "+=10",
        display: "block",
        display: "none"
      })
      .to([setoneleftfour], 0.3, {
        x: "+=10",
        display: "block"
      });

    // Animate Right
    righttl
      .to([setonerighttwo], 0.1, {
        x: "-=10",
        display: "block",
        display: "none"
      })
      .to([setonerightthree], 0.3, {
        x: "-=10",
        display: "block",
        display: "none"
      })
      .to([setonerightfour], 0.3, {
        x: "-=10",
        display: "block"
      });

    this.tl = tl;
    this.lefttl = lefttl;
    this.righttl = righttl;
    this.animationReady = true;

    this.tl.pause();
    this.lefttl.pause();
    this.righttl.pause();
  }
});
