(function() {
  "use strict";
  var _MathPI = Math.PI,
    _Mathabs = Math.abs;
  function GitGraph(options) {
    options = _isObject(options) ? options : {};
    this.elementId =
      "string" === typeof options.elementId ? options.elementId : "gitGraph";
    this.element =
      "object" === babelHelpers.typeof(options.element)
        ? options.element
        : null;
    this.author =
      "string" === typeof options.author
        ? options.author
        : "Sergio Flores <saxo-guy@epic.com>";
    this.reverseArrow = _booleanOptionOr(options.reverseArrow, !1);
    if ("string" === typeof options.template || _isObject(options.template)) {
      this.template = this.newTemplate(options.template);
    } else if (babelHelpers.instanceof(options.template, Template)) {
      this.template = options.template;
    } else {
      this.template = this.newTemplate("metro");
    }
    this.mode = options.mode || null;
    if ("compact" === this.mode) {
      this.template.commit.message.display = !1;
    }
    switch (options.orientation) {
      case "vertical-reverse":
        this.template.commit.spacingY *= -1;
        this.orientation = "vertical-reverse";
        this.template.branch.labelRotation = _isNullOrUndefined(
          options,
          "template.branch.labelRotation"
        )
          ? 0
          : options.template.branch.labelRotation;
        this.template.commit.tag.spacingY *= -1;
        break;
      case "horizontal":
        this.template.commit.message.display = !1;
        this.template.commit.spacingX = this.template.commit.spacingY;
        this.template.branch.spacingY = this.template.branch.spacingX;
        this.template.commit.spacingY = 0;
        this.template.branch.spacingX = 0;
        this.orientation = "horizontal";
        this.template.branch.labelRotation = _isNullOrUndefined(
          options,
          "template.branch.labelRotation"
        )
          ? -90
          : options.template.branch.labelRotation;
        this.template.commit.tag.spacingX = -this.template.commit.spacingX;
        this.template.commit.tag.spacingY = this.template.branch.spacingY;
        break;
      case "horizontal-reverse":
        this.template.commit.message.display = !1;
        this.template.commit.spacingX = -this.template.commit.spacingY;
        this.template.branch.spacingY = this.template.branch.spacingX;
        this.template.commit.spacingY = 0;
        this.template.branch.spacingX = 0;
        this.orientation = "horizontal-reverse";
        this.template.branch.labelRotation = _isNullOrUndefined(
          options,
          "template.branch.labelRotation"
        )
          ? 90
          : options.template.branch.labelRotation;
        this.template.commit.tag.spacingX = -this.template.commit.spacingY;
        this.template.commit.tag.spacingY = this.template.branch.spacingY;
        break;
      default:
        this.orientation = "vertical";
        this.template.branch.labelRotation = _isNullOrUndefined(
          options,
          "template.branch.labelRotation"
        )
          ? 0
          : options.template.branch.labelRotation;
        break;
    }
    this.marginX =
      this.template.branch.spacingX + 2 * this.template.commit.dot.size;
    this.marginY =
      this.template.branch.spacingY + 2 * this.template.commit.dot.size;
    this.offsetX = 0;
    this.offsetY = 0;
    this.canvas = this.element
      ? this.element
      : document.getElementById(this.elementId) || options.canvas;
    this.context = this.canvas.getContext("2d");
    this.context.textBaseline = "center";
    this.tooltip = document.createElement("div");
    this.tooltip.className = "gitgraph-tooltip";
    this.tooltip.style.position = "fixed";
    this.tooltip.style.display = "none";
    var tooltipContainer = options.tooltipContainer || document.body;
    tooltipContainer.appendChild(this.tooltip);
    this.HEAD = null;
    this.branches = [];
    this.commits = [];
    this.columnMax = 0;
    this.commitOffsetX = options.initCommitOffsetX || 0;
    this.commitOffsetY = options.initCommitOffsetY || 0;
    this.mouseMoveOptions = { handleEvent: this.hover, gitgraph: this };
    this.canvas.addEventListener("mousemove", this.mouseMoveOptions, !1);
    this.mouseDownOptions = { handleEvent: this.click, gitgraph: this };
    this.canvas.addEventListener("mousedown", this.mouseDownOptions, !1);
    window.onresize = this.render.bind(this);
  }
  GitGraph.prototype.dispose = function() {
    this.canvas.removeEventListener("mousemove", this.mouseMoveOptions, !1);
    this.canvas.removeEventListener("mousedown", this.mouseDownOptions, !1);
  };
  GitGraph.prototype.branch = function(options) {
    if ("string" === typeof options) {
      var name = options;
      options = {};
      options.name = name;
    }
    options = _isObject(options) ? options : {};
    options.parent = this;
    options.parentBranch = options.parentBranch || this.HEAD;
    var branch = new Branch(options);
    this.branches.push(branch);
    return branch;
  };
  GitGraph.prototype.orphanBranch = function(options) {
    if ("string" === typeof options) {
      var name = options;
      options = {};
      options.name = name;
    }
    options = _isObject(options) ? options : {};
    options.parent = this;
    var branch = new Branch(options);
    this.branches.push(branch);
    return branch;
  };
  GitGraph.prototype.commit = function(options) {
    this.HEAD.commit(options);
    return this;
  };
  GitGraph.prototype.tag = function(options) {
    this.HEAD.tag(options);
    return this;
  };
  GitGraph.prototype.newTemplate = function(options) {
    if ("string" === typeof options) {
      return new Template().get(options);
    }
    return new Template(options);
  };
  GitGraph.prototype.render = function() {
    this.scalingFactor = _getScale(this.context);
    var unscaledResolution = {
      x:
        _Mathabs((this.columnMax + 1) * this.template.branch.spacingX) +
        _Mathabs(this.commitOffsetX) +
        2 * this.marginX,
      y:
        _Mathabs((this.columnMax + 1) * this.template.branch.spacingY) +
        _Mathabs(this.commitOffsetY) +
        2 * this.marginY
    };
    if (this.template.commit.message.display) {
      unscaledResolution.x += 800;
    }
    unscaledResolution.x += this.template.commit.widthExtension;
    this.canvas.style.width = unscaledResolution.x + "px";
    this.canvas.style.height = unscaledResolution.y + "px";
    this.canvas.width = unscaledResolution.x * this.scalingFactor;
    this.canvas.height = unscaledResolution.y * this.scalingFactor;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.translate(this.marginX, this.marginY);
    if (0 < this.template.commit.spacingY) {
      this.context.translate(0, this.canvas.height - 2 * this.marginY);
      this.offsetY = this.canvas.height - 2 * this.marginY;
    }
    if (0 < this.template.commit.spacingX) {
      this.context.translate(this.canvas.width - 2 * this.marginX, 0);
      this.offsetX = this.canvas.width - 2 * this.marginX;
    }
    this.context.scale(this.scalingFactor, this.scalingFactor);
    for (
      var i = this.branches.length - 1, branch;
      !!(branch = this.branches[i]);
      i--
    ) {
      branch.render();
    }
    for (var j = 0, commit; !!(commit = this.commits[j]); j++) {
      commit.render();
    }
    _emitEvent(this.canvas, "graph:render", { id: this.elementId });
  };
  GitGraph.prototype.applyCommits = function(event, callbackFn) {
    var _Mathpow = Math.pow;
    function getOffsetById(id) {
      var el = document.getElementById(id),
        rect = el.getBoundingClientRect();
      return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
      };
    }
    for (
      var offsetX =
          event.offsetX || event.pageX - getOffsetById(this.elementId).left,
        offsetY =
          event.offsetY || event.pageY - getOffsetById(this.elementId).top,
        i = 0,
        commit;
      !!(commit = this.commits[i]);
      i++
    ) {
      var distanceX =
          commit.x +
          (this.offsetX + this.marginX) / this.scalingFactor -
          offsetX,
        distanceY =
          commit.y +
          (this.offsetY + this.marginY) / this.scalingFactor -
          offsetY,
        distanceBetweenCommitCenterAndMouse = Math.sqrt(
          _Mathpow(distanceX, 2) + _Mathpow(distanceY, 2)
        ),
        isOverCommit =
          distanceBetweenCommitCenterAndMouse < this.template.commit.dot.size;
      callbackFn(commit, isOverCommit, event);
    }
  };
  GitGraph.prototype.hover = function(event) {
    var self = this.gitgraph,
      isOut = !0;
    function showCommitTooltip(commit) {
      if (!commit.tooltipDisplay) {
        return;
      }
      self.tooltip.style.left = event.clientX + "px";
      self.tooltip.style.top = event.clientY + "px";
      if (null !== self.template.commit.tooltipHTMLFormatter) {
        self.tooltip.innerHTML = self.template.commit.tooltipHTMLFormatter(
          commit
        );
      } else {
        self.tooltip.textContent = commit.sha1 + " - " + commit.message;
      }
      self.tooltip.style.display = "block";
    }
    function emitCommitEvent(commit, event) {
      var mouseEventOptions = {
        author: commit.author,
        message: commit.message,
        date: commit.date,
        sha1: commit.sha1
      };
      _emitEvent(self.canvas, "commit:" + event, mouseEventOptions);
    }
    self.applyCommits(event, function(commit, isOverCommit) {
      if (isOverCommit) {
        if (
          !self.template.commit.message.display &&
          self.template.commit.shouldDisplayTooltipsInCompactMode
        ) {
          showCommitTooltip(commit);
        }
        if (!commit.isMouseOver) {
          emitCommitEvent(commit, "mouseover");
        }
        isOut = !1;
        commit.isMouseOver = !0;
      } else {
        if (commit.isMouseOver) {
          emitCommitEvent(commit, "mouseout");
        }
        commit.isMouseOver = !1;
      }
    });
    if (isOut) {
      self.tooltip.style.display = "none";
    }
  };
  GitGraph.prototype.click = function(event) {
    this.gitgraph.applyCommits(event, function(commit, isOverCommit, event) {
      if (!isOverCommit) {
        return;
      }
      if (null !== commit.onClick) {
        commit.onClick(commit, !0, event);
      }
    });
  };
  function Branch(options) {
    if (!1 === babelHelpers.instanceof(options.parent, GitGraph)) {
      return;
    }
    options = _isObject(options) ? options : {};
    this.parent = options.parent;
    if (options.parentCommit && options.parentBranch) {
      if (options.parentCommit.branch !== options.parentBranch) {
        return;
      }
      this.parentCommit = options.parentCommit;
      this.parentBranch = options.parentBranch;
    } else if (options.parentCommit) {
      this.parentCommit = options.parentCommit;
      this.parentBranch = options.parentCommit.branch;
    } else if (options.parentBranch) {
      this.parentCommit = _getParentCommitFromBranch(options.parentBranch);
      this.parentBranch = options.parentBranch;
    } else {
      this.parentCommit = null;
      this.parentBranch = null;
    }
    this.name = "string" === typeof options.name ? options.name : "no-name";
    this.commitDefaultOptions = _isObject(options.commitDefaultOptions)
      ? options.commitDefaultOptions
      : {};
    this.context = this.parent.context;
    this.template = this.parent.template;
    this.lineWidth = options.lineWidth || this.template.branch.lineWidth;
    this.lineDash = options.lineDash || this.template.branch.lineDash;
    this.showLabel = _booleanOptionOr(
      options.showLabel,
      this.template.branch.showLabel
    );
    this.spacingX = this.template.branch.spacingX;
    this.spacingY = this.template.branch.spacingY;
    this.size = 0;
    this.height = 0;
    this.width = 0;
    this.commits = [];
    this.path = [];
    if ("number" === typeof options.column) {
      this.column = options.column;
    } else {
      this.column = 0;
      this.calculColumn();
    }
    this.parent.columnMax =
      this.column > this.parent.columnMax ? this.column : this.parent.columnMax;
    this.offsetX = this.column * this.spacingX;
    this.offsetY = this.column * this.spacingY;
    if (this.parentBranch && this.parentCommit) {
      if (
        this.parentCommit === _getParentCommitFromBranch(this.parentBranch) &&
        0 < this.commits.length
      ) {
        this.startPoint = {
          x:
            this.parentBranch.offsetX -
            this.parent.commitOffsetX +
            this.template.commit.spacingX,
          y:
            this.parentBranch.offsetY -
            this.parent.commitOffsetY +
            this.template.commit.spacingY,
          type: "start"
        };
      } else {
        this.startPoint = {
          x: this.parentCommit.x,
          y: this.parentCommit.y,
          type: "start"
        };
      }
    } else {
      this.startPoint = null;
    }
    var columnIndex = this.column % this.template.colors.length;
    this.color =
      options.color ||
      this.template.branch.color ||
      this.template.colors[columnIndex];
    this.checkout();
  }
  Branch.prototype.branch = function(options) {
    if ("string" === typeof options) {
      var name = options;
      options = {};
      options.name = name;
    }
    options = _isObject(options) ? options : {};
    options.parent = this.parent;
    options.parentBranch = options.parentBranch || this;
    var branch = new Branch(options);
    this.parent.branches.push(branch);
    return branch;
  };
  Branch.prototype.render = function() {
    this.context.beginPath();
    for (var i = 0, point; !!(point = this.path[i]); i++) {
      if ("start" === point.type) {
        this.context.moveTo(point.x, point.y);
      } else {
        if ("bezier" === this.template.branch.mergeStyle) {
          var path = this.path[i - 1];
          this.context.bezierCurveTo(
            path.x - this.template.commit.spacingX / 2,
            path.y - this.template.commit.spacingY / 2,
            point.x + this.template.commit.spacingX / 2,
            point.y + this.template.commit.spacingY / 2,
            point.x,
            point.y
          );
        } else {
          this.context.lineTo(point.x, point.y);
        }
      }
    }
    this.context.lineWidth = this.lineWidth;
    this.context.strokeStyle = this.color;
    if ("function" === typeof this.context.setLineDash) {
      this.context.setLineDash(this.lineDash);
    }
    this.context.stroke();
    this.context.closePath();
  };
  Branch.prototype.commit = function(options) {
    if ("string" === typeof options) {
      options = { message: options };
    } else if ("object" !== babelHelpers.typeof(options)) {
      options = {};
    }
    options.arrowDisplay = this.template.arrow.active;
    options.branch = this;
    var columnIndex = this.column % this.template.colors.length;
    options.color =
      options.color ||
      this.commitDefaultOptions.color ||
      this.template.commit.color ||
      this.template.colors[columnIndex];
    options.parent = this.parent;
    options.parentCommit =
      options.parentCommit || _getParentCommitFromBranch(this);
    if (
      "compact" === this.parent.mode &&
      _getLast(this.parent.commits) &&
      _getLast(this.parent.commits).branch !== options.branch &&
      options.branch.commits.length &&
      "mergeCommit" !== options.type
    ) {
      this.parent.commitOffsetX -= this.template.commit.spacingX;
      this.parent.commitOffsetY -= this.template.commit.spacingY;
    }
    options.messageColor =
      options.messageColor ||
      this.commitDefaultOptions.messageColor ||
      this.template.commit.message.color ||
      options.color ||
      null;
    options.labelColor =
      options.labelColor ||
      this.commitDefaultOptions.labelColor ||
      this.template.branch.labelColor ||
      options.color ||
      null;
    options.tagColor =
      options.tagColor ||
      this.commitDefaultOptions.tagColor ||
      this.template.commit.tag.color ||
      options.color ||
      null;
    options.dotColor =
      options.dotColor ||
      this.commitDefaultOptions.dotColor ||
      this.template.commit.dot.color ||
      options.color ||
      null;
    options.x = this.offsetX - this.parent.commitOffsetX;
    options.y = this.offsetY - this.parent.commitOffsetY;
    var isCompact = "compact" === this.parent.mode;
    if ("string" === typeof options.detailId && !isCompact) {
      options.detail = document.getElementById(options.detailId);
    } else {
      options.detail = null;
    }
    var previousCommit = _getLast(options.branch.commits) || {},
      commitPosition = options.x + options.y,
      previousCommitPosition = previousCommit.x + previousCommit.y;
    if (commitPosition === previousCommitPosition) {
      this.parent.commitOffsetX += this.template.commit.spacingX;
      this.parent.commitOffsetY += this.template.commit.spacingY;
      options.x = this.offsetX - this.parent.commitOffsetX;
      options.y = this.offsetY - this.parent.commitOffsetY;
    }
    if (
      !1 === babelHelpers.instanceof(options.parentCommit, Commit) &&
      babelHelpers.instanceof(this.parentBranch, Branch)
    ) {
      options.parentCommit = this.parentCommit;
    }
    var isFirstBranch = !babelHelpers.instanceof(options.parentCommit, Commit),
      isPathBeginning = 0 === this.path.length;
    options.showLabel = isPathBeginning && this.showLabel;
    if (options.showLabel) {
      options.x -= this.template.commit.spacingX;
      options.y -= this.template.commit.spacingY;
    }
    var commit = new Commit(options);
    this.commits.push(commit);
    var point = { x: commit.x, y: commit.y, type: "joint" };
    if (!isFirstBranch && isPathBeginning) {
      this.pushPath(this.startPoint);
      if (_isVertical(this.parent)) {
        this.pushPath({
          x: commit.x,
          y: this.startPoint.y - this.template.commit.spacingY,
          type: "joint"
        });
      } else {
        this.pushPath({
          x: this.startPoint.x - this.template.commit.spacingX,
          y: commit.y,
          type: "joint"
        });
      }
    } else if (isPathBeginning) {
      point.type = "start";
    }
    this.pushPath(point);
    this.parent.commitOffsetX +=
      this.template.commit.spacingX * (options.showLabel ? 2 : 1);
    this.parent.commitOffsetY +=
      this.template.commit.spacingY * (options.showLabel ? 2 : 1);
    if (null !== commit.detail && _isVertical(this.parent)) {
      commit.detail.style.display = "block";
      if ("vertical-reverse" === this.parent.orientation) {
        this.parent.commitOffsetY += commit.detail.clientHeight;
      } else {
        this.parent.commitOffsetY -= commit.detail.clientHeight;
      }
    }
    this.parent.render();
    return this;
  };
  Branch.prototype.tag = function(options) {
    if ("string" === typeof options) {
      options = { tag: options };
    }
    options = _isObject(options) ? options : {};
    var lastCommit = _getLast(this.commits);
    if (_isObject(lastCommit)) {
      _assignTagOptionsToCommit(lastCommit, options);
      this.parent.render();
    }
    return this;
  };
  Branch.prototype.checkout = function() {
    this.parent.HEAD = this;
  };
  Branch.prototype.delete = function() {
    this.isDeleted = !0;
  };
  Branch.prototype.merge = function(target, commitOptions) {
    var targetBranch = target || this.parent.HEAD;
    if (
      !1 === babelHelpers.instanceof(targetBranch, Branch) ||
      targetBranch === this
    ) {
      return this;
    }
    var firstBranchCommit = this.commits[0];
    if (!firstBranchCommit) {
      console.log(
        this.name + " is already up-to-date with " + targetBranch.name
      );
      return this;
    }
    var defaultMessage =
      "Merge branch `" + this.name + "` into `" + targetBranch.name + "`";
    if ("object" !== babelHelpers.typeof(commitOptions)) {
      var message = commitOptions;
      commitOptions = {};
      commitOptions.message =
        "string" === typeof message ? message : defaultMessage;
    } else {
      commitOptions.message = commitOptions.message || defaultMessage;
    }
    commitOptions.type = "mergeCommit";
    commitOptions.parentCommit = _getParentCommitFromBranch(this);
    var branchParentCommit = firstBranchCommit.parentCommit,
      targetBranchParentCommit = _getParentCommitFromBranch(targetBranch),
      isFastForwardPossible =
        branchParentCommit &&
        branchParentCommit.sha1 === targetBranchParentCommit.sha1;
    if (commitOptions.fastForward && isFastForwardPossible) {
      var isGraphHorizontal = _isHorizontal(this.parent);
      this.color = targetBranch.color;
      if (isGraphHorizontal) {
        var targetBranchY = targetBranch.path[1].y;
        this.path.forEach(function(point) {
          point.y = targetBranchY;
        });
      } else {
        var targetBranchX = targetBranch.path[1].x;
        this.path.forEach(function(point) {
          point.x = targetBranchX;
        });
      }
      this.commits.forEach(function(commit) {
        if (isGraphHorizontal) {
          commit.y = branchParentCommit.y;
        } else {
          commit.x = branchParentCommit.x;
        }
        commit.labelColor = branchParentCommit.labelColor;
        commit.messageColor = branchParentCommit.messageColor;
        commit.dotColor = branchParentCommit.dotColor;
        commit.dotStrokeColor = branchParentCommit.dotStrokeColor;
      });
    } else {
      targetBranch.commit(commitOptions);
      var targetCommit = _getLast(targetBranch.commits),
        endOfBranch = {
          x:
            this.offsetX +
            this.template.commit.spacingX * (targetCommit.showLabel ? 3 : 2) -
            this.parent.commitOffsetX,
          y:
            this.offsetY +
            this.template.commit.spacingY * (targetCommit.showLabel ? 3 : 2) -
            this.parent.commitOffsetY,
          type: "joint"
        };
      this.pushPath(_clone(endOfBranch));
      var mergeCommit = { x: targetCommit.x, y: targetCommit.y, type: "end" };
      this.pushPath(mergeCommit);
      endOfBranch.type = "start";
      this.pushPath(endOfBranch);
    }
    this.parent.render();
    this.parent.HEAD = targetBranch;
    return this;
  };
  Branch.prototype.calculColumn = function() {
    for (
      var candidates = [], i = 0, branch;
      !!(branch = this.parent.branches[i]);
      i++
    ) {
      if (!branch.isDeleted) {
        if (!(branch.column in candidates)) {
          candidates[branch.column] = 0;
        }
        candidates[branch.column]++;
      }
    }
    this.column = 0;
    for (; ; this.column++) {
      if (!(this.column in candidates) || 0 === candidates[this.column]) {
        break;
      }
    }
  };
  Branch.prototype.pushPath = function(point) {
    var lastPoint = _getLast(this.path);
    if (!lastPoint) {
      this.path.push(point);
    } else if (lastPoint.x === point.x && lastPoint.y === point.y) {
      if ("start" !== lastPoint.type && "end" === point.type) {
        lastPoint.type = "end";
      } else if (!("joint" === point.type)) {
        this.path.push(point);
      }
    } else {
      if ("joint" === point.type) {
        if (0 > (point.x - lastPoint.x) * this.template.commit.spacingX) {
          this.path.push(point);
        } else if (
          0 >
          (point.y - lastPoint.y) * this.template.commit.spacingY
        ) {
          this.path.push(point);
        }
      } else {
        this.path.push(point);
      }
    }
  };
  function Commit(options) {
    if (!1 === babelHelpers.instanceof(options.parent, GitGraph)) {
      return;
    }
    options = _isObject(options) ? options : {};
    this.parent = options.parent;
    this.template = this.parent.template;
    this.context = this.parent.context;
    this.branch = options.branch;
    this.author = options.author || this.parent.author;
    this.date = options.date || new Date().toUTCString();
    this.detail = options.detail || null;
    this.sha1 =
      options.sha1 ||
      Math.random(100)
        .toString(16)
        .substring(3, 10);
    this.message = options.message || "He doesn't like George Michael! Boooo!";
    this.arrowDisplay = options.arrowDisplay;
    this.messageDisplay = _booleanOptionOr(
      options.messageDisplay,
      this.template.commit.message.display
    );
    this.messageAuthorDisplay = _booleanOptionOr(
      options.messageAuthorDisplay,
      this.template.commit.message.displayAuthor
    );
    this.messageBranchDisplay = _booleanOptionOr(
      options.messageBranchDisplay,
      this.template.commit.message.displayBranch
    );
    this.messageHashDisplay = _booleanOptionOr(
      options.messageHashDisplay,
      this.template.commit.message.displayHash
    );
    this.messageColor = options.messageColor || options.color;
    this.messageFont = options.messageFont || this.template.commit.message.font;
    this.dotColor = options.dotColor || options.color;
    this.dotSize = options.dotSize || this.template.commit.dot.size;
    this.dotStrokeWidth =
      options.dotStrokeWidth || this.template.commit.dot.strokeWidth;
    this.dotStrokeColor =
      options.dotStrokeColor ||
      this.template.commit.dot.strokeColor ||
      options.color;
    this.lineDash = options.lineDash || this.template.commit.dot.lineDash;
    this.type = options.type || null;
    this.tooltipDisplay = _booleanOptionOr(options.tooltipDisplay, !0);
    this.onClick = options.onClick || null;
    this.representedObject = options.representedObject || null;
    this.parentCommit = options.parentCommit;
    this.x = options.x;
    this.y = options.y;
    this.showLabel = options.showLabel;
    this.labelColor = options.labelColor || options.color;
    this.labelFont = options.labelFont || this.template.branch.labelFont;
    _assignTagOptionsToCommit(this, options);
    this.parent.commits.push(this);
  }
  Commit.prototype.render = function() {
    var commitOffsetForTags = this.template.commit.tag.spacingX,
      commitOffsetLeft =
        (this.parent.columnMax + 1) * this.template.branch.spacingX +
        commitOffsetForTags;
    if (this.showLabel) {
      if (
        _isHorizontal(this.parent) &&
        0 === this.template.branch.labelRotation % 180
      ) {
        var yNegativeMargin =
          this.y - this.dotSize - _getFontHeight(this.labelFont);
        _drawTextBG(
          this.context,
          this.x,
          yNegativeMargin,
          this.branch.name,
          this.labelColor,
          this.labelFont,
          this.template.branch.labelRotation,
          !0
        );
      } else {
        _drawTextBG(
          this.context,
          this.x + this.template.commit.spacingX,
          this.y + this.template.commit.spacingY,
          this.branch.name,
          this.labelColor,
          this.labelFont,
          this.template.branch.labelRotation,
          !0
        );
      }
    }
    this.context.beginPath();
    this.context.arc(this.x, this.y, this.dotSize, 0, 2 * _MathPI, !1);
    this.context.fillStyle = this.dotColor;
    this.context.strokeStyle = this.dotStrokeColor;
    this.context.lineWidth = this.dotStrokeWidth;
    if ("function" === typeof this.context.setLineDash) {
      this.context.setLineDash(this.lineDash);
    }
    if ("number" === typeof this.dotStrokeWidth) {
      this.context.stroke();
    }
    this.context.fill();
    this.context.closePath();
    if (
      this.arrowDisplay &&
      babelHelpers.instanceof(this.parentCommit, Commit)
    ) {
      this.arrow();
    }
    if (null !== this.tag) {
      var tag = new Tag(this, { color: this.tagColor, font: this.tagFont });
      commitOffsetLeft += tag.width - commitOffsetForTags;
    }
    var DETAIL_OFFSET_TOP_IN_PX = 30;
    if (null !== this.detail && _isVertical(this.parent)) {
      this.detail.style.left =
        this.parent.canvas.offsetLeft + commitOffsetLeft + 60 + "px";
      var detailPositionTop = this.parent.canvas.offsetTop + this.y;
      if ("vertical-reverse" === this.parent.orientation) {
        var clientHeight =
          this.parent.canvas.clientHeight - this.detail.clientHeight;
        this.detail.style.top =
          detailPositionTop + clientHeight - DETAIL_OFFSET_TOP_IN_PX + "px";
      } else {
        this.detail.style.top =
          detailPositionTop + DETAIL_OFFSET_TOP_IN_PX + "px";
      }
    }
    if (this.messageDisplay) {
      var message = this.message;
      if (this.messageHashDisplay) {
        message = this.sha1 + " " + message;
      }
      if (this.messageAuthorDisplay) {
        message = message + (this.author ? " - " + this.author : "");
      }
      if (this.messageBranchDisplay) {
        message =
          (this.branch.name ? "[" + this.branch.name + "] " : "") + message;
      }
      this.context.font = this.messageFont;
      this.context.fillStyle = this.messageColor;
      this.context.fillText(
        message,
        commitOffsetLeft,
        this.y + this.dotSize / 2
      );
    }
  };
  Commit.prototype.arrow = function() {
    var _Mathsin = Math.sin,
      _Mathcos = Math.cos,
      size = this.template.arrow.size,
      color = this.template.arrow.color || this.branch.color,
      isReversed = this.parent.reverseArrow;
    function rotate(y, x) {
      var direction = isReversed ? -1 : 1;
      return Math.atan2(direction * y, direction * x);
    }
    var alpha = rotate(
        this.parentCommit.y - this.y,
        this.parentCommit.x - this.x
      ),
      isForkCommit = this === this.branch.commits[0];
    if ("mergeCommit" === this.type || isForkCommit) {
      var deltaColumn = this.parentCommit.branch.column - this.branch.column,
        commitSpaceDelta = this.showLabel ? 2 : 1,
        alphaX =
          this.template.branch.spacingX * deltaColumn +
          this.template.commit.spacingX * commitSpaceDelta,
        isPushedInY =
          (isForkCommit || isReversed) &&
          _Mathabs(this.y - this.parentCommit.y) >
            _Mathabs(this.template.commit.spacingY),
        isOnSameXThanParent = this.x === this.parentCommit.x;
      if (_isVertical(this.parent) && (isPushedInY || isOnSameXThanParent)) {
        alphaX = 0;
      }
      var alphaY =
          this.template.branch.spacingY * deltaColumn +
          this.template.commit.spacingY * commitSpaceDelta,
        isPushedInX =
          (isForkCommit || isReversed) &&
          _Mathabs(this.x - this.parentCommit.x) >
            _Mathabs(this.template.commit.spacingX),
        isOnSameYThanParent = this.y === this.parentCommit.y;
      if (_isHorizontal(this.parent) && (isPushedInX || isOnSameYThanParent)) {
        alphaY = 0;
      }
      alpha = rotate(alphaY, alphaX);
      color = this.parentCommit.branch.color;
    }
    var delta = _MathPI / 7,
      arrowX = isReversed ? this.parentCommit.x : this.x,
      arrowY = isReversed ? this.parentCommit.y : this.y,
      h = this.template.commit.dot.size + this.template.arrow.offset,
      x1 = h * _Mathcos(alpha) + arrowX,
      y1 = h * _Mathsin(alpha) + arrowY,
      x2 = (h + size) * _Mathcos(alpha - delta) + arrowX,
      y2 = (h + size) * _Mathsin(alpha - delta) + arrowY,
      x3 = (h + size / 2) * _Mathcos(alpha) + arrowX,
      y3 = (h + size / 2) * _Mathsin(alpha) + arrowY,
      x4 = (h + size) * _Mathcos(alpha + delta) + arrowX,
      y4 = (h + size) * _Mathsin(alpha + delta) + arrowY;
    this.context.beginPath();
    this.context.fillStyle = color;
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.quadraticCurveTo(x3, y3, x4, y4);
    this.context.lineTo(x4, y4);
    this.context.fill();
  };
  function Tag(commit, options) {
    if (!_isObject(commit)) {
      throw new Error("You can't tag a commit that doesn't exist");
    }
    options = _isObject(options) ? options : {};
    this.color = options.color || commit.color;
    this.font = options.font || commit.template.commit.tag.font;
    var originalFont = commit.context.font;
    commit.context.font = this.font;
    var textWidth = commit.context.measureText(commit.tag).width;
    this.width = Math.max(commit.template.commit.tag.spacingX, textWidth);
    var x = 0,
      y = 0,
      tagColumn = commit.parent.columnMax + 1;
    if (_isHorizontal(commit.parent)) {
      x = commit.x - commit.dotSize / 2;
      y =
        tagColumn * commit.template.commit.tag.spacingY -
        commit.template.commit.tag.spacingY / 2;
    } else {
      x =
        tagColumn * commit.template.commit.tag.spacingX -
        commit.template.commit.tag.spacingX / 2 +
        textWidth / 2;
      y = commit.y - commit.dotSize / 2;
    }
    _drawTextBG(
      commit.context,
      x,
      y,
      commit.tag,
      this.color,
      this.font,
      0,
      commit.displayTagBox
    );
    commit.context.font = originalFont;
    return this;
  }
  function Template(options) {
    options = _isObject(options) ? options : {};
    options.branch = options.branch || {};
    options.arrow = options.arrow || {};
    options.commit = options.commit || {};
    options.commit.dot = options.commit.dot || {};
    options.commit.tag = options.commit.tag || {};
    options.commit.message = options.commit.message || {};
    this.colors = options.colors || [
      "#6963FF",
      "#47E8D4",
      "#6BDB52",
      "#E84BA5",
      "#FFA657"
    ];
    this.branch = {};
    this.branch.color = options.branch.color || null;
    this.branch.lineWidth = options.branch.lineWidth || 2;
    this.branch.lineDash = options.branch.lineDash || [];
    this.branch.showLabel = options.branch.showLabel || !1;
    this.branch.labelColor = options.branch.labelColor || null;
    this.branch.labelFont = options.branch.labelFont || "normal 8pt Calibri";
    this.branch.labelRotation =
      options.branch.labelRotation !== void 0
        ? options.branch.labelRotation
        : null;
    this.branch.mergeStyle = options.branch.mergeStyle || "bezier";
    this.branch.spacingX =
      "number" === typeof options.branch.spacingX
        ? options.branch.spacingX
        : 20;
    this.branch.spacingY = options.branch.spacingY || 0;
    this.arrow = {};
    this.arrow.size = options.arrow.size || null;
    this.arrow.color = options.arrow.color || null;
    this.arrow.active = "number" === typeof this.arrow.size;
    this.arrow.offset = options.arrow.offset || 2;
    this.commit = {};
    this.commit.spacingX = options.commit.spacingX || 0;
    this.commit.spacingY =
      "number" === typeof options.commit.spacingY
        ? options.commit.spacingY
        : 25;
    this.commit.widthExtension =
      "number" === typeof options.commit.widthExtension
        ? options.commit.widthExtension
        : 0;
    this.commit.tooltipHTMLFormatter =
      options.commit.tooltipHTMLFormatter || null;
    this.commit.shouldDisplayTooltipsInCompactMode = _booleanOptionOr(
      options.commit.shouldDisplayTooltipsInCompactMode,
      !0
    );
    this.commit.color = options.commit.color || null;
    this.commit.dot = {};
    this.commit.dot.color = options.commit.dot.color || null;
    this.commit.dot.size = options.commit.dot.size || 3;
    this.commit.dot.strokeWidth = options.commit.dot.strokeWidth || null;
    this.commit.dot.strokeColor = options.commit.dot.strokeColor || null;
    this.commit.dot.lineDash =
      options.commit.dot.lineDash || this.branch.lineDash;
    this.commit.tag = {};
    this.commit.tag.color = options.commit.tag.color || this.commit.dot.color;
    this.commit.tag.font =
      options.commit.tag.font ||
      options.commit.message.font ||
      "normal 10pt Calibri";
    this.commit.tag.spacingX = this.branch.spacingX;
    this.commit.tag.spacingY = this.commit.spacingY;
    this.commit.message = {};
    this.commit.message.display = _booleanOptionOr(
      options.commit.message.display,
      !0
    );
    this.commit.message.displayAuthor = _booleanOptionOr(
      options.commit.message.displayAuthor,
      !0
    );
    this.commit.message.displayBranch = _booleanOptionOr(
      options.commit.message.displayBranch,
      !0
    );
    this.commit.message.displayHash = _booleanOptionOr(
      options.commit.message.displayHash,
      !0
    );
    this.commit.message.color = options.commit.message.color || null;
    this.commit.message.font =
      options.commit.message.font || "normal 12pt Calibri";
  }
  Template.prototype.get = function(name) {
    var template = {};
    switch (name) {
      case "blackarrow":
        template = {
          branch: {
            color: "#000000",
            lineWidth: 4,
            spacingX: 50,
            mergeStyle: "straight",
            labelRotation: 0
          },
          commit: {
            spacingY: -60,
            dot: { size: 12, strokeColor: "#000000", strokeWidth: 7 },
            message: { color: "black" }
          },
          arrow: { size: 16, offset: 2.5 }
        };
        break;
      case "metro":
      default:
        template = {
          colors: ["#979797", "#008fb5", "#f1c109"],
          branch: { lineWidth: 10, spacingX: 50, labelRotation: 0 },
          commit: {
            spacingY: -80,
            dot: { size: 14 },
            message: { font: "normal 14pt Arial" }
          }
        };
        break;
    }
    return new Template(template);
  };
  function _getLast(array) {
    return array.slice(-1)[0];
  }
  function _assignTagOptionsToCommit(commit, options) {
    commit.tag = options.tag || null;
    commit.tagColor = options.tagColor || commit.messageColor;
    commit.tagFont = options.tagFont || commit.template.commit.tag.font;
    commit.displayTagBox = _booleanOptionOr(options.displayTagBox, !0);
  }
  function _getParentCommitFromBranch(branch) {
    if (_getLast(branch.commits)) {
      return _getLast(branch.commits);
    } else if (branch.parentBranch) {
      return _getParentCommitFromBranch(branch.parentBranch);
    } else {
      return null;
    }
  }
  function _clone(object) {
    return JSON.parse(JSON.stringify(object));
  }
  function _getFontHeight(font) {
    var body = document.getElementsByTagName("body")[0],
      dummy = document.createElement("div"),
      dummyText = document.createTextNode("Mg");
    dummy.appendChild(dummyText);
    dummy.setAttribute("style", "font: " + font + "; display: inline-block;");
    body.appendChild(dummy);
    var fontHeight = dummy.offsetHeight;
    body.removeChild(dummy);
    return fontHeight;
  }
  function _booleanOptionOr(booleanOption, defaultOption) {
    return "boolean" === typeof booleanOption ? booleanOption : defaultOption;
  }
  function _drawTextBG(context, x, y, text, color, font, angle, useStroke) {
    context.save();
    context.translate(x, y);
    context.rotate(angle * (_MathPI / 180));
    context.textAlign = "center";
    context.font = font;
    var width = context.measureText(text).width,
      height = _getFontHeight(font);
    if (useStroke) {
      context.beginPath();
      context.rect(-(width / 2) - 4, -(height / 2) + 2, width + 8, height + 2);
      context.fillStyle = color;
      context.fill();
      context.lineWidth = 2;
      context.strokeStyle = "black";
      context.stroke();
      context.fillStyle = "black";
    } else {
      context.fillStyle = color;
    }
    context.fillText(text, 0, height / 2);
    context.restore();
  }
  function _emitEvent(element, eventName, data) {
    var event;
    if (document.createEvent) {
      event = document.createEvent("HTMLEvents");
      event.initEvent(eventName, !0, !0);
    } else {
      event = document.createEventObject();
      event.eventType = eventName;
    }
    event.eventName = eventName;
    event.data = data || {};
    if (document.createEvent) {
      element.dispatchEvent(event);
    } else {
      element.fireEvent("on" + event.eventType, event);
    }
  }
  function _getScale(context) {
    var backingStorePixelRatio, scalingFactor;
    scalingFactor = 1;
    if (window.devicePixelRatio) {
      backingStorePixelRatio =
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1;
      scalingFactor *= window.devicePixelRatio / backingStorePixelRatio;
    }
    return scalingFactor;
  }
  function _isVertical(graph) {
    return (
      "vertical" === graph.orientation ||
      "vertical-reverse" === graph.orientation
    );
  }
  function _isHorizontal(graph) {
    return (
      "horizontal" === graph.orientation ||
      "horizontal-reverse" === graph.orientation
    );
  }
  function _isObject(object) {
    return "object" === babelHelpers.typeof(object);
  }
  function _isNullOrUndefined(obj, key) {
    return !key.split(".").every(function(x) {
      if (
        "object" !== babelHelpers.typeof(obj) ||
        null === obj ||
        !(x in obj)
      ) {
        return !1;
      }
      obj = obj[x];
      return !0;
    });
  }
  if (!Array.prototype.every) {
    Array.prototype.every = function(callbackFn, thisArg) {
      var T, k;
      if (null === this) {
        throw new TypeError("this is null or not defined");
      }
      var O = Object(this),
        len = O.length >>> 0;
      if ("function" !== typeof callbackFn) {
        throw new TypeError();
      }
      if (1 < arguments.length) {
        T = thisArg;
      }
      k = 0;
      while (k < len) {
        var kValue;
        if (k in O) {
          kValue = O[k];
          var testResult = callbackFn.call(T, kValue, k, O);
          if (!testResult) {
            return !1;
          }
        }
        k++;
      }
      return !0;
    };
  }
  window.GitGraph = GitGraph;
  window.GitGraph.Branch = Branch;
  window.GitGraph.Commit = Commit;
  window.GitGraph.Template = Template;
})();
