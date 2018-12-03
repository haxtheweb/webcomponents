import './lrnapp-book.js';
const $_documentContainer = document.createElement('div');
$_documentContainer.setAttribute('style', 'display: none;');

$_documentContainer.innerHTML = `<title>lrnapp-book demo</title><lrnapp-book outline-path="demo/data.json" book-path="demo/data.json" title="Lesson 2">
      <img src="https://courses.aanda.psu.edu/dmd100/system/files/dmd100sp17/assets/dmd100-bg-compressed-cropped.jpg" alt="dmd 100 course background art" width="100%">

      <h2 data-scrollspy="scrollspy" id="db7874dcf12b8ae256f2493d79484731" class="scrollspy">DMD 100: Digital Multimedia Design Foundations</h2>

      <p class="elmsln-core-in-context" id="ec6ef230f1828039ee794566b9c58adc">DMD 100 is the first of three spine courses in the Bachelor of Design in Digital Multimedia Design (DMD) program at Penn State University. This program is the <a href="https://artsandarchitecture.psu.edu/news/e-learning-institute-launches-digital-multimedia-design-online-degree">first entirely online multi-college undergraduate bachelor's degree program</a> offered at Penn State.</p>

      <p class="elmsln-core-in-context" id="1d665b9b1467944c128a5575119d1cfd">Visit the <a href="http://dmd.psu.edu/">DMD Program Hub</a> for more details.</p>

      <h3 data-scrollspy="scrollspy" id="346b81a32e7007eccadf60252bb599f0" class="scrollspy">Downloads</h3>

      <h4 data-scrollspy="scrollspy" id="490b2834e65737c1fce95e468cc8b8bf" class="scrollspy">Desktop background art</h4>

      <p class="elmsln-core-in-context" id="7bc3ca68769437ce986455407dab2a1f"><strong>PNG - 2880x1800:</strong> (8.12MB)<br>
      <a href="https://github.com/dmd-program/dmd-course-graphics/blob/master/dmd-100-desktop-bg.png?raw=true">dmd-100-desktop-bg.png</a></p>

      <h3 data-scrollspy="scrollspy" id="6f207f8b5dfe1eebac63467930df5189" class="scrollspy">Contributors</h3>

      <p class="elmsln-core-in-context" id="13207e3d5722030f6c97d69b4904d39d"><strong>Primary Course Author</strong></p>

      <p class="elmsln-core-in-context" id="ed92eff813a02a31a2677be0563a0739">Michael Collins, Assistant Professor, Penn State School of Visual Arts</p>

      <p class="elmsln-core-in-context" id="c6c27fc98633c82571d75dcb5739bbdf"><strong>Instructional Design</strong></p>

      <p class="elmsln-core-in-context" id="46d46a759bf6cbed05d7bcdcb911a4f8">Kate Miffitt, Assistant Director of Strategic Initiatives, Penn State College of Arts and Architecture</p>

      <p class="elmsln-core-in-context" id="2e3f209d4f2bb34667dde08e3c9585f1"><strong>Additional Support</strong></p>

      <p class="elmsln-core-in-context" id="d9a9d61ef9ac1fb462fb3ce61f509700">Special thanks to:</p>

      <ul>
      <li>Graeme Sullivan, Director of the Penn State School of Visual Arts, for the inspiring conversations, book recommendations, and unwavering moral support;</li>
      <li>Linda Collins for proofreading over 200 pages.</li>
      </ul>

      <h3 data-scrollspy="scrollspy" id="ce1b1e8ce920100d134d0212d3a8f53f" class="scrollspy">Contributing</h3>

      <p class="elmsln-core-in-context" id="ad304601e6638bf2bcdd5345c013a6c1">Anyone can recommend additions or alterations to this course. Please, submit a <a href="https://github.com/dmd-program/dmd-100-sp17">pull request on github.com</a> or file an issue in the <a href="https://github.com/dmd-program/dmd-100-sp17/issues">issue queue</a>.</p>
    </lrnapp-book>`;

document.head.appendChild($_documentContainer);
