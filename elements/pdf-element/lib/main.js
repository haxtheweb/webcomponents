var _Mathround = Math.round,
  Reader = function (el) {
    this.element = el;
    this.reader = el.root.querySelector(".pdf-viewer");
    this.viewportOut = this.reader.querySelector(".pdf-viewport-out");
    this.element = this.reader.querySelector(".pdf-element");
    this.container = this.reader.querySelector(".sidebar");
    this.toolbar = this.reader.querySelector(".pdf-toolbar");
    this.card = el.root.querySelector(".style-scope");
    this.toolbarHeight = 0;
    this.title = this.toolbar.querySelector(".title");
    this.enableTextSelection = el.enableTextSelection;
    this.fitWidth = el.fitWidth;
    this.HEIGHT = el.getAttribute("height");
    this.WIDTH = el.getAttribute("width");
    this.viewport = this.reader.querySelector(".pdf-viewport");
    if (this.enableTextSelection) {
      this.textLayerDiv = this.reader.querySelector(".textLayer");
      this.textLayerDivStyle = this.textLayerDiv.style;
    }
    this.spinner = this.reader.querySelector(".spinner");
    this.totalPages = this.reader.querySelector("#totalPages");
    this.viewportStyle = this.viewport.style;
    this.viewportOutStyle = this.viewportOut.style;
    this.ctx = this.viewport.getContext("2d");
    this.SRC = el.src;
    this.pageRendering = !1;
    this.pageNumPending = null;
  };
Reader.prototype.setSize = function (attrName, newVal) {
  if (!this.WIDTH) {
    this.WIDTH = this.viewportOut.offsetWidth;
  }
  if (!this.HEIGHT) {
    this.HEIGHT = this.viewportOut.offsetHeight;
  }
  var width = this.WIDTH,
    height = this.HEIGHT;
  if ("width" === attrName) {
    width = newVal;
  }
  if ("height" === attrName) {
    height = newVal;
  }
  this.viewportOutStyle.height = height + "px";
  this.spinner.style.top = (height - this.toolbarHeight) / 2 + "px";
};
Reader.prototype.setSrc = function (src) {
  this.SRC = src;
};
Reader.prototype.setFitWidth = function (fitWidth) {
  this.fitWidth = fitWidth;
};
Reader.prototype.queueRenderPage = function (num) {
  this.pdfExists = !0;
  if (this.pageRendering) {
    this.pageNumPending = num;
  } else {
    this.renderPDF(num);
  }
};
Reader.prototype.loadPDF = function (pageNum) {
  var _this = this;
  this.setSize();
  pageNum = 1;
  var self = this;
  PDFJS.getDocument(this.SRC)
    .then(function (pdf) {
      self.PDF = pdf;
      self.queueRenderPage(pageNum);
      self.currentPage = pageNum;
      self.totalPages.innerHTML = self.PDF.numPages;
      self.totalPagesNum = self.PDF.numPages;
      self.currentZoomVal = self.fitZoomVal = self.widthZoomVal = 0;
      self.createDownloadLink();
    })
    .catch(function () {
      _this.pdfExists = !1;
    });
};
Reader.prototype.renderPages = function () {
  var self = this;
  self.viewportOut.innerHTML = "";
  PDFJS.getDocument(this.SRC).then(function (pdf) {
    self.PDF = pdf;
    for (var num = 1; num <= self.PDF.numPages; num++) {
      pdf.getPage(num).then(self.renderPDF(num, null, !0));
    }
    self.currentPage = 1;
    self.totalPages.innerHTML = self.PDF.numPages;
    self.totalPagesNum = self.PDF.numPages;
    if (!self.currentZoomVal)
      self.currentZoomVal = self.fitZoomVal = self.widthZoomVal = 0;
    self.createDownloadLink();
  });
};
Reader.prototype.sidebarSetup = function (currentThis) {
  var self = this,
    pdfName = currentThis.src,
    currPage = 1,
    numPages = 0,
    pdfObj = null;
  if (0 != self.container.innerHTML.length) {
    if (currentThis.changedSideBar) {
      self.container.innerHTML = "";
      PDFJS.getDocument(this.SRC).then(function (pdf) {
        pdfObj = pdf;
        numPages = pdfObj.numPages;
        var container = self.container;
        pdf.getPage(1).then(handlePages);
      });
      self.setViewportPos(!1);
    }
  } else {
    self.container.innerHTML = "";
    PDFJS.getDocument(this.SRC).then(function (pdf) {
      pdfObj = pdf;
      numPages = pdfObj.numPages;
      var container = self.container;
      pdf.getPage(1).then(handlePages);
    });
    self.setViewportPos(!0);
  }
  function handlePages(page) {
    var scale = 0.14,
      scaleWidth = 0,
      container = self.container;
    if (currentThis.sidebarOpen) {
      scaleWidth = self.WIDTH;
    } else {
      scaleWidth = self.WIDTH;
    }
    scale = 35e-5 * scaleWidth;
    var viewport = page.getViewport(scale),
      div = document.createElement("div"),
      pageString = (page.pageIndex + 1).toString(),
      parsedFileName = pdfName.split("/").pop();
    div.style.backgroundColor = "gray";
    var click = document.querySelector("pdf-element"),
      canvas = document.createElement("canvas");
    div.appendChild(canvas);
    container.appendChild(div);
    var addPage = self.container.childNodes[page.pageIndex];
    addPage.addEventListener("click", function () {
      var nextPage = page.pageIndex + 1;
      click.sideBarClick(nextPage, currentThis.instance, currentThis);
    });
    var context = canvas.getContext("2d");
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    page.render({ canvasContext: context, viewport: viewport });
    currPage++;
    if (null !== pdfObj && currPage <= numPages) {
      pdfObj.getPage(currPage).then(handlePages);
    }
  }
};
Reader.prototype.renderPDF = function (pageNum, resize, isFull) {
  var self = this;
  self.pageRendering = !0;
  self.spinner.active = !0;
  this.PDF.getPage(pageNum).then(function (page) {
    var _Mathabs = Math.abs,
      _Mathsin = Math.sin,
      _Mathcos = Math.cos,
      scaleW,
      scaleH,
      viewerViewport,
      scale,
      radians;
    radians = (page.pageInfo.rotate * Math.PI) / 180;
    self.pageW = _Mathabs(
      page.view[2] * _Mathcos(radians) + page.view[3] * _Mathsin(radians)
    );
    self.pageH = _Mathabs(
      page.view[3] * _Mathcos(radians) + page.view[2] * _Mathsin(radians)
    );
    if (0 === self.currentZoomVal || !!resize) {
      (scaleW = _Mathround(100 * (self.WIDTH / self.pageW)) / 100),
        (scaleH =
          _Mathround(100 * ((self.HEIGHT - self.toolbarHeight) / self.pageH)) /
          100),
        (scale = Math.min(scaleH, scaleW));
      self.fitZoomVal = scale;
      self.widthZoomVal = self.WIDTH / self.pageW;
      self.currentZoomVal = self.fitWidth ? self.widthZoomVal : self.fitZoomVal;
    }
    if (!!resize) {
      self.zoomPage({ target: self.zoomLvl });
    } else {
      scale = self.currentZoomVal;
      viewerViewport = page.getViewport(scale);
      self.ctx.height = viewerViewport.height;
      self.ctx.width = viewerViewport.width;
      self.pageW = self.pageW * scale;
      self.pageH = self.pageH * scale;
      if (self.WIDTH == self.currentWidth || null == self.currentWidth) {
        self.setViewportPos(!1);
      } else {
        self.setViewportPos(!0);
      }
      self.viewport.width = self.pageW;
      self.viewport.height = self.pageH;
      self.viewportStyle.width = self.pageW + "px";
      self.viewportStyle.height = self.pageH + "px";
      if (self.enableTextSelection) {
        self.textLayerDivStyle.width = self.pageW + "px";
        self.textLayerDivStyle.height = self.pageH + "px";
      }
      self.ctx.clearRect(0, 0, self.viewport.width, self.viewport.height);
      if (isFull) {
        var wrapper = document.createElement("div");
        wrapper.setAttribute("style", "position: relative");
        var canvas = document.createElement("canvas"),
          textLayer = document.createElement("div");
        textLayer.setAttribute("style", "left: " + self.viewportStyle.left);
        textLayer.className = "textLayer";
        var ctx = canvas.getContext("2d");
        textLayer.height = viewerViewport.height;
        textLayer.width = viewerViewport.width;
        self.viewportOut.appendChild(wrapper);
        wrapper.appendChild(canvas);
        wrapper.appendChild(textLayer);
        page.render({ canvasContext: ctx, viewport: viewerViewport });
        if (self.enableTextSelection) {
          self.textLayerDiv.innerHTML = "";
          page.getTextContent().then(function (textContent) {
            PDFJS.renderTextLayer({
              textContent: textContent,
              container: textLayer,
              pageIndex: pageNum,
              viewport: viewerViewport,
              textDivs: [],
            });
          });
        }
      } else {
        var renderTask = page.render({
          canvasContext: self.ctx,
          viewport: viewerViewport,
        });
        renderTask.promise.then(function () {
          self.pageRendering = !1;
          self.spinner.active = !1;
          if (null !== self.pageNumPending) {
            self.renderPDF(self.pageNumPending);
            self.pageNumPending = null;
          }
        });
      }
      if (self.enableTextSelection) {
        self.textLayerDiv.innerHTML = "";
        page.getTextContent().then(function (textContent) {
          PDFJS.renderTextLayer({
            textContent: textContent,
            container: self.textLayerDiv,
            pageIndex: pageNum,
            viewport: viewerViewport,
            textDivs: [],
          });
        });
      }
    }
  });
};
Reader.prototype.setViewportPos = function (sidebarAdjust) {
  var _Mathfloor = Math.floor;
  if (sidebarAdjust) {
    this.currentWidth = 0.75 * this.WIDTH;
  } else {
    this.currentWidth = this.WIDTH;
  }
  if (this.pageW < this.currentWidth) {
    this.viewportStyle.left = (this.currentWidth - this.pageW) / 2 + "px";
  } else this.viewportStyle.left = 0;
  if (this.pageH < this.HEIGHT) {
    this.viewportStyle.top =
      (this.HEIGHT - this.pageH - this.toolbarHeight) / 2 + "px";
    this.viewportStyle.topNum =
      _Mathfloor((this.HEIGHT - this.pageH - this.toolbarHeight) / 2) +
      this.toolbarHeight;
    if (this.enableTextSelection) {
      this.textLayerDivStyle.topNum =
        _Mathfloor((this.HEIGHT - this.pageH - this.toolbarHeight) / 2) +
        this.toolbarHeight;
    }
  } else {
    this.viewportStyle.top = 0;
  }
  if (this.enableTextSelection) {
    this.textLayerDivStyle.left = this.viewportStyle.left;
    this.textLayerDivStyle.top = this.viewportStyle.top;
  }
};
Reader.prototype.changePDFSource = function (newSrc) {
  this.setSrc(newSrc);
  this.loadPDF(1);
};
Reader.prototype.zoomInOut = function (step) {
  this.currentZoomVal =
    _Mathround(10 * (_Mathround(10 * this.currentZoomVal) / 10 + step)) / 10;
  this.queueRenderPage(this.currentPage);
};
Reader.prototype.zoomIn = function () {
  this.currentZoomVal =
    _Mathround(10 * (_Mathround(10 * this.currentZoomVal) / 10 + 0.1)) / 10;
  this.queueRenderPage(this.currentPage);
};
Reader.prototype.zoomOut = function () {
  this.currentZoomVal =
    _Mathround(10 * (_Mathround(10 * this.currentZoomVal) / 10 + -0.1)) / 10;
  this.queueRenderPage(this.currentPage);
};
Reader.prototype.zoomPageFit = function () {
  this.currentZoomVal = this.fitZoomVal;
  this.queueRenderPage(this.currentPage);
};
Reader.prototype.zoomWidthFit = function () {
  this.currentZoomVal = this.widthZoomVal;
  this.queueRenderPage(this.currentPage);
};
Reader.prototype.getPageNum = function () {
  return this.PDF.numPages;
};
Reader.prototype.createDownloadLink = function () {
  var self = this;
  this.PDF.getData().then(function (data) {
    var blob = PDFJS.createBlob(data, "application/pdf");
    self.downloadLink = URL.createObjectURL(blob);
  });
};
Reader.prototype.download = function () {
  var a = document.createElement("a"),
    filename = this.SRC.split("/");
  a.href = this.downloadLink;
  a.target = "_parent";
  if ("download" in a) {
    a.download = decodeURIComponent(filename[filename.length - 1]);
  }
  this.reader.appendChild(a);
  a.click();
  a.parentNode.removeChild(a);
};
window.Reader = Reader;
