var $_documentContainer=document.createElement("div");$_documentContainer.setAttribute("style","display: none;");$_documentContainer.innerHTML=`<iron-iconset-svg size="30" name="lrn">
<iron-iconset-svg size="24" name="drawing">
  <!-- move -->
  <svg>
    <defs>
      <g id="move">
        <polygon points="21,12 17,8 17,11 13,11 13,7 16,7 12,3 8,7 11,7 11,11 7,11 7,8 3,12 7,16 7,13 11,13 11,17 8,17 12,21 16,17 
          13,17 13,13 17,13 17,16 	"></polygon>
      </g>
    </defs>
  </svg>
  
  
  <!-- select -->
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <defs>
      <g id="select">
        <path d="M6.3 2.8l.3 19.8.9.4 5.1-5.4 7.4.1.4-.9-14.1-14z"></path>
      </g>
    </defs>
  </svg>


  <!-- draw ellipsis -->
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <defs>
      <g id="draw-ellip">
        <ellipse cx="12" cy="11.9" rx="10.1" ry="7.1" opacity=".3" stroke-width="2" stroke-miterlimit="10"></ellipse>
        <ellipse cx="12" cy="11.9" rx="10.1" ry="7.1" stroke="#000" fill="none" stroke-width="2" stroke-miterlimit="10"></ellipse>
      </g>
    </defs>
  </svg>


  <!-- draw rectangle -->
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <defs>
      <g id="draw-rect">
        <path opacity=".3" d="M3.1 6h18v12.1h-18z" stroke-width="2" stroke-miterlimit="10"></path>
        <path fill="none" d="M3.1 6h18v12.1h-18z" stroke="#000" stroke-width="2" stroke-miterlimit="10"></path>
      </g>
    </defs>
  </svg>
  
  
  <!-- draw polygon -->
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <defs>
      <g id="draw-poly">
        <path opacity=".3" d="M2.7 7.3l17.6-2.8-4.1 16.6-11.6-5z" stroke-width="2" stroke-miterlimit="10"></path>
        <path fill="none" stroke="#000" stroke-width="2" stroke-miterlimit="10" d="M2.7 7.3l17.6-2.8-4.1 16.6-11.6-5z"></path>
      </g>
    </defs>
  </svg>
  
</iron-iconset-svg></iron-iconset-svg>`;document.head.appendChild($_documentContainer);