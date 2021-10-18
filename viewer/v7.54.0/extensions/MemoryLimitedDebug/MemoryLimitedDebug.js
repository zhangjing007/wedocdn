/*!
 * LMV v7.54.0
 *
 * Copyright 2021 Autodesk, Inc.
 * All rights reserved.
 *
 * This computer source code and related instructions and comments are the
 * unpublished confidential and proprietary information of Autodesk, Inc.
 * and are protected under Federal copyright and state trade secret law.
 * They may not be disclosed to, copied or used by any third party without
 * the prior written consent of Autodesk, Inc.
 *
 * Autodesk Forge Viewer Usage Limitations:
 *
 * The Autodesk Forge Viewer JavaScript must be delivered from an
 * Autodesk-hosted URL.
 */
/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/MemoryLimitedDebug/MemoryManagerUI.css":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/MemoryLimitedDebug/MemoryManagerUI.css ***!
  \****************************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/noSourceMaps.js */ "./node_modules/css-loader/dist/runtime/noSourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".adsk-viewing-viewer .mem-mgr-container {\n  width: 240px;\n  min-width: 240px;\n  top: 180px;\n  left: 220px;\n  line-height: 14px;\n  border-spacing: 1px;\n  border-collapse: separate;\n  resize: none;\n  background: rgba(34, 34, 34, 0.8); }\n\n.adsk-viewing-viewer .mem-mgr-content {\n  width: 100%;\n  height: calc(100% - 55px);\n  resize: none;\n  position: relative; }\n\n.adsk-viewing-viewer .mem-mgr-reload {\n  display: block;\n  font-size: 14px;\n  margin: 15px 20px 15px 21px;\n  padding: 6px 10px 6px 10px;\n  width: calc(100% - 60px);\n  cursor: pointer;\n  text-align: center; }\n\n.adsk-viewing-viewer .mem-mgr-reload:hover {\n  background-color: rgba(166, 194, 255, 0.7);\n  transition: all 0.2s ease; }\n\n.adsk-viewing-viewer .mem-mgr-status {\n  display: block;\n  font-size: 14px;\n  margin: 0px;\n  padding: 2px 10px;\n  width: calc(100% - 60px);\n  height: 28px;\n  cursor: pointer;\n  text-align: left;\n  white-space: pre; }\n\n.adsk-viewing-viewer .mem-mgr-memory td > input[id$=\"_stepper\"], .mem-mgr-occlusion td > input[id$=\"_stepper\"], .mem-mgr-debug td > input[id$=\"_stepper\"] {\n  color: initial; }\n\n.adsk-viewing-viewer .memory-manager {\n  max-width: 380px !important; }\n\n.adsk-viewing-viewer .memory-manager .settings-tabs ul li,\n.adsk-viewing-viewer .memory-manager .settings-tabs ul li a {\n  width: 33%; }\n\n.adsk-viewing-viewer .memory-manager .mem-mgr-occlusion a {\n  text-align: center; }\n\n.adsk-viewing-viewer .memory-manager .docking-panel-scroll {\n  top: 40px; }\n\n.adsk-viewing-viewer .memory-manager .switch {\n  margin-left: 25px; }\n\n.adsk-viewing-viewer .memory-manager .switch .slider {\n  width: 26px; }\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";

      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }

      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }

      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }

      content += cssWithMappingToString(item);

      if (needLayer) {
        content += "}";
      }

      if (item[2]) {
        content += "}";
      }

      if (item[4]) {
        content += "}";
      }

      return content;
    }).join("");
  }; // import a list of modules into the list


  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var _i = 0; _i < this.length; _i++) {
        var id = this[_i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i2 = 0; _i2 < modules.length; _i2++) {
      var item = [].concat(modules[_i2]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }

      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }

      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }

      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/noSourceMaps.js":
/*!**************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/noSourceMaps.js ***!
  \**************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (i) {
  return i[1];
};

/***/ }),

/***/ "./extensions/MemoryLimitedDebug/MemoryManagerUI.js":
/*!**********************************************************!*\
  !*** ./extensions/MemoryLimitedDebug/MemoryManagerUI.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MemoryManagerPanel": () => (/* binding */ MemoryManagerPanel)
/* harmony export */ });
/* harmony import */ var _MemoryManagerUI_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MemoryManagerUI.css */ "./extensions/MemoryLimitedDebug/MemoryManagerUI.css");


var av = Autodesk.Viewing,
avu = av.UI;

var defaultSettings = {
  "memorymanager.unloadPackfiles": false,
  "memorymanager.sblIterator": false,
  "memorymanager.autoRefresh": false,
  "memorymanager.keepIdPixels": 1,
  "memorymanager.occludePixels": 1,
  "memorymanager.startOcclusionTesting": 8,
  "memorymanager.occlusionPackCount": 4,
  "memorymanager.occludeInstancing": true,
  "memorymanager.memorySize": 50,
  "memorymanager.maxPageOutSize": 50,
  "memorymanager.boxProxyMaxCount": 0,
  "memorymanager.boxProxyMinScreen": 0.4 };


var memoryId = "memory";
var occlusionId = "occlusion";
var debugId = "debug";

var showPFindex = -1;
var visiblePFs = "0";
var _refreshTimeout = 0;

function MemoryManagerPanel(viewer) {
  this.viewer = viewer;
  this.setGlobalManager(viewer.globalManager);
  viewer.prefs.load(defaultSettings);

  function setSavedSettings() {
    var model = scope.viewer.model;
    if (model) {
      var prefs = scope.viewer.prefs;
      var pp = model.getFragmentList()._pagingProxy;
      if (pp) {
        var options = pp.options;
        if (Object.prototype.hasOwnProperty.call(options, "limit"))
        options.limit = prefs.get("memorymanager.memorySize");
        if (Object.prototype.hasOwnProperty.call(options.debug, "maxPageOutSize"))
        options.debug.maxPageOutSize = prefs.get("memorymanager.maxPageOutSize");
        if (Object.prototype.hasOwnProperty.call(options.debug, "occlusionThreshold")) {
          options.debug.occlusionThreshold = prefs.get("memorymanager.keepIdPixels");
          scope.viewer.impl.renderer().settings.occlusionid = options.debug.occlusionThreshold > 0;
        }
        if (Object.prototype.hasOwnProperty.call(options.debug, "occlusionTestThreshold"))
        options.debug.occlusionTestThreshold = prefs.get("memorymanager.occludePixels");
        if (Object.prototype.hasOwnProperty.call(options.debug, "startOcclusionTestingPackCount"))
        options.debug.startOcclusionTestingPackCount = prefs.get("memorymanager.startOcclusionTesting");
        if (Object.prototype.hasOwnProperty.call(options.debug, "testPackfileCount"))
        options.debug.testPackfileCount = prefs.get("memorymanager.occlusionPackCount");
        if (Object.prototype.hasOwnProperty.call(options.debug, "useOcclusionInstancing"))
        options.debug.useOcclusionInstancing = prefs.get("memorymanager.occludeInstancing");
        if (Object.prototype.hasOwnProperty.call(options.debug, "boxProxyMaxCount"))
        options.debug.boxProxyMaxCount = prefs.get("memorymanager.boxProxyMaxCount");
        if (Object.prototype.hasOwnProperty.call(options.debug, "boxProxyMinScreen"))
        options.debug.boxProxyMinScreen = prefs.get("memorymanager.boxProxyMinScreen");
        if (Object.prototype.hasOwnProperty.call(options.debug, "automaticRefresh"))
        options.debug.automaticRefresh = prefs.get("memorymanager.autoRefresh");
      }
      scope.viewer.removeEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, setSavedSettings);
    }
  }
  viewer.addEventListener(Autodesk.Viewing.MODEL_ROOT_LOADED_EVENT, setSavedSettings);

  var scope = this;
  var rightCellWidth = "200px";
  var margin = "7px";

  function addRow(tabId, caption, atIndex) {
    var _document = scope.getDocument();
    var value = _document.createElement("div");
    scope.addControl(tabId, value, { caption: caption, insertAtIndex: atIndex });
    var cell = value.sliderRow.cells[1];
    cell.style.width = rightCellWidth;
    value.style.marginLeft = margin;
    value.style.marginRight = margin;
    return value;
  }

  function setupControl(controlId) {
    var control = scope.getControl(controlId);
    control.sliderRow.cells[1].style.width = rightCellWidth;
    return control;
  }

  function redrawView() {
    if (scope.model) {
      // just redraw
      scope.impl.invalidate(true, true, true);
    }
  }

  function getSortedPFid(pfIdIndex) {
    // -1 means don't use this feature to filter PFs
    if (pfIdIndex === -1)
    return -1;
    if (scope.viewer.model) {
      var pfOrder;
      var frags = scope.viewer.model.getFragmentList();
      if (frags && frags._pagingProxy && typeof frags._pagingProxy.pfOrder == 'function')
      pfOrder = frags._pagingProxy.pfOrder();
      return pfOrder ? pfOrder[pfIdIndex] : pfIdIndex;
    }
    return -1;
  }

  avu.SettingsPanel.call(this, viewer.container, 'MemoryManagePanel' + viewer.id, 'Memory Manager', { width: 400, heightAdjustment: 110 });
  this.setGlobalManager(viewer.globalManager);

  this.addVisibilityListener(function (show) {
    if (show) {
      scope.refreshPanel();
      scope.resizeToContent();
    } else {
      if (_refreshTimeout > 0) {
        clearTimeout(_refreshTimeout);
        _refreshTimeout = 0;
      }
    }
  });

  this.container.dockRight = true;
  this.container.classList.add('memory-manager');
  this.container.classList.add('viewer-settings-panel');

  this.addTab(memoryId, "Memory", { className: "mem-mgr-memory" });
  this.addTab(occlusionId, "Occlusion", { className: "mem-mgr-occlusion" });
  this.addTab(debugId, "Debug", { className: "mem-mgr-debug" });

  var _document = this.getDocument();
  this.refreshDiv = _document.createElement('div');
  this.refreshDiv.className = 'mem-mgr-reload';
  this.refreshDiv.textContent = "Refresh";
  this.addEventListener(this.refreshDiv, 'touchstart', av.touchStartToClick);
  this.addEventListener(this.refreshDiv, 'click', function () {
    if (scope.viewer.model) {
      resetForRefresh();
      scope.viewer.dispatchEvent({ type: av.LOAD_MISSING_GEOMETRY, delay: false, debug: {
          unloadPackFiles: !!scope.upfCheckbox.getValue() // For debugging only
        } });
      // view whole model, as viewing individual parts seems to be confusing the code
      // LMV-2188
      scope.showPFSlider.setValue(-1);
      updatePFstrat();
      scope.refreshPanel();
    }
  }, false);
  this.container.appendChild(this.refreshDiv);

  this.onDemandLoading = addRow(memoryId, "On Demand Loading", -1);
  this.packFileCount = addRow(memoryId, "Pack File Count", -1);
  this.geomMemorySize = addRow(memoryId, "Geom Memory Size", -1);
  this.memUsedSize = addRow(memoryId, "Memory Used", -1);
  this.lastPageOut = addRow(memoryId, "Last Page Out", -1);

  var prefs = viewer.prefs;
  this.autoCheckbox = setupControl(this.addCheckbox(debugId, "Auto Refresh",
  prefs.get("memorymanager.autoRefresh"), function (checked) {
    prefs.set("memorymanager.autoRefresh", checked);
    if (scope.viewer.model) {
      var pp = scope.viewer.model.getFragmentList()._pagingProxy;
      if (pp)
      pp.options.debug.automaticRefresh = checked;
    }
  }));

  this.upfCheckbox = setupControl(this.addCheckbox(debugId, "Unload Packfiles",
  prefs.get("memorymanager.unloadPackfiles"), function (checked) {
    prefs.set("memorymanager.unloadPackfiles", checked);
  }));

  this.occtSlider = setupControl(this.addSlider(occlusionId, "Keep Id Pixels", 0, 4096,
  prefs.get("memorymanager.keepIdPixels"), function (e) {
    prefs.set("memorymanager.keepIdPixels", Number(scope.occtSlider.stepperElement.value));
    if (scope.viewer.model) {
      var pp = scope.viewer.model.getFragmentList()._pagingProxy;
      var occlusionThreshold = Number(scope.occtSlider.stepperElement.value);
      if (pp)
      pp.options.debug.occlusionThreshold = occlusionThreshold;
      scope.viewer.impl.renderer().settings.occlusionid = occlusionThreshold > 0;
    }
  }));
  this.occtSlider.sliderElement.step = this.occtSlider.stepperElement.step = 1;

  this.poctSlider = setupControl(this.addSlider(occlusionId, "Pack Occluded Pixels", 0, 4096,
  prefs.get("memorymanager.occludePixels"), function (e) {
    prefs.set("memorymanager.occludePixels", Number(scope.poctSlider.stepperElement.value));
    if (scope.viewer.model) {
      var pp = scope.viewer.model.getFragmentList()._pagingProxy;
      var occlusionTestThreshold = Number(scope.poctSlider.stepperElement.value);
      if (pp)
      pp.options.debug.occlusionTestThreshold = occlusionTestThreshold;
    }
  }));
  this.poctSlider.sliderElement.step = this.poctSlider.stepperElement.step = 1;

  this.socpSlider = setupControl(this.addSlider(occlusionId, "Start Occlusion", 0, 4096,
  prefs.get("memorymanager.startOcclusionTesting"), function (e) {
    prefs.set("memorymanager.startOcclusionTesting", Number(scope.socpSlider.stepperElement.value));
    if (scope.viewer.model) {
      var pp = scope.viewer.model.getFragmentList()._pagingProxy;
      var startOcclusionTestingPackCount = Number(scope.socpSlider.stepperElement.value);
      if (pp)
      pp.options.debug.startOcclusionTestingPackCount = startOcclusionTestingPackCount;
    }
  }));
  this.socpSlider.sliderElement.step = this.socpSlider.stepperElement.step = 1;

  this.tstcSlider = setupControl(this.addSlider(occlusionId, "Occlusion Pack Count", 1, 4,
  prefs.get("memorymanager.occlusionPackCount"), function (e) {
    prefs.set("memorymanager.occlusionPackCount", Number(scope.tstcSlider.stepperElement.value));
    if (scope.viewer.model) {
      var pp = scope.viewer.model.getFragmentList()._pagingProxy;
      var testPackfileCount = Number(scope.tstcSlider.stepperElement.value);
      if (pp)
      pp.options.debug.testPackfileCount = testPackfileCount;
    }
  }));
  this.tstcSlider.sliderElement.step = this.tstcSlider.stepperElement.step = 1;

  this.occInstCheckbox = setupControl(this.addCheckbox(occlusionId, "Occlusion Instancing",
  prefs.get("memorymanager.occludeInstancing"), function (checked) {
    prefs.set("memorymanager.occludeInstancing", checked);
    if (scope.viewer.model) {
      var pp = scope.viewer.model.getFragmentList()._pagingProxy;
      if (pp)
      pp.options.debug.useOcclusionInstancing = checked;
    }
  }));

  this.occlusionCulledCount = addRow(memoryId, "Occlusion Culled Count", -1);

  this.pfSlider = setupControl(this.addSlider(debugId, "Memory Limit MB", 10, 2050,
  prefs.get("memorymanager.memorySize"), function (e) {
    prefs.set("memorymanager.memorySize", Number(scope.pfSlider.stepperElement.value));
    if (scope.viewer.model) {
      var pp = scope.viewer.model.getFragmentList()._pagingProxy;
      if (pp)
      pp.options.limit = Number(scope.pfSlider.stepperElement.value);
    }
  }));
  this.pfSlider.sliderElement.step = this.pfSlider.stepperElement.step = 10;

  this.maxPSlider = setupControl(this.addSlider(debugId, "Max Page Out Size", 10, 2050,
  prefs.get("memorymanager.maxPageOutSize"), function (e) {
    prefs.set("memorymanager.maxPageOutSize", Number(scope.maxPSlider.stepperElement.value));
    if (scope.viewer.model) {
      var pp = scope.viewer.model.getFragmentList()._pagingProxy;
      if (pp)
      pp.options.debug.maxPageOutSize = Number(scope.maxPSlider.stepperElement.value);
    }
  }));
  this.maxPSlider.sliderElement.step = this.maxPSlider.stepperElement.step = 10;

  this.pfCheckbox = setupControl(this.addCheckbox(debugId, "PF by importance", true,
  function () /*checked*/{
    updatePFstrat();
    redrawView();
  }));
  // Disable this control because RenderBatch.forEach and RenderBatchLess.forEach
  // no longer support showing a single pack file. Search for showPF to showPF
  // the lines that need to be uncommented to reenable it.
  this.pfCheckbox.checkElement.disabled = true;

  this.showPFSlider = setupControl(this.addSlider(debugId, "Show single PF", -1, 1500,
  -1, function (e) {
    if (scope.viewer.model) {
      var pp = scope.viewer.model.getFragmentList()._pagingProxy;
      // Automatically refreshing the geometry interferes with displaying individual pack files
      // turn it off.
      if (pp)
      pp.options.debug.automaticRefresh = false;
    }
    updatePFstrat();
    redrawView();
  }));
  this.showPFSlider.sliderElement.step = this.showPFSlider.stepperElement.step = 1;

  this.pfStrategy = addRow(debugId, "Pack File Displayed", -1);

  // Hide thes control because RenderBatch.forEach and RenderBatchLess.forEach
  // no longer support showing a single pack file. Search for showPF to showPF
  // the lines that need to be uncommented to reenable it.
  this.showPFSlider.sliderElement.parentElement.parentElement.style.display = "none";
  this.pfStrategy.parentElement.parentElement.style.display = "none";

  this.refreshPanel();

  this.selectTab(memoryId);

  function resetForRefresh() {
    if (scope.viewer.model) {
      var frags = scope.viewer.model.getFragmentList();
      frags.showPF = -1;
    }
  }

  function updatePFstrat() {
    showPFindex = Number(scope.showPFSlider.value);
    if (scope.viewer.model) {
      var frags = scope.viewer.model.getFragmentList();
      var pp = frags._pagingProxy;
      if (scope.pfCheckbox.getValue())
      frags.showPF = getSortedPFid(showPFindex);else

      frags.showPF = showPFindex;
      if (pp) {
        // update other values
        scope.refreshPanel();
      }
    }
  }
}

MemoryManagerPanel.prototype = Object.create(avu.SettingsPanel.prototype);
MemoryManagerPanel.prototype.constructor = MemoryManagerPanel;

MemoryManagerPanel.prototype.refreshPanel = function (timer) {
  if (_refreshTimeout !== 0) {
    clearTimeout(_refreshTimeout);
    _refreshTimeout = 0;
  }
  _refreshTimeout = setTimeout(function (ui) {
    _refreshTimeout = 0;
    if (ui.isVisible())
    ui.refreshPanel(true);
  }, 1000, this);

  var onDemandLoading = "Unknown";
  var onDemandLoadingColor = "#ff0000";
  var packFileCount = "Unknown";
  var memorySize = "Unknown";
  var memoryUsed = "Unknown";
  var pageOut = "Unknown";
  var culledCount = "Unknown";
  var pfStrategy = "-1 / default";
  var pfMax = 1500;
  var model = this.viewer.model;

  function getNumVisiblePFs() {
    // -1 means unknown
    if (this.viewer.model) {
      var pfVisible;
      var frags = this.viewer.model.getFragmentList();
      if (frags && frags._pagingProxy && typeof frags._pagingProxy.pfOrder == 'function')
      pfVisible = frags._pagingProxy.getNumVisiblePFs();
      return pfVisible;
    }
    return -1;
  }

  if (model) {
    var memoryStats = model.loader && model.loader.pagingProxy && model.loader.pagingProxy.getMemoryInfo();
    var loadedPackCount = -1;
    var packsPagedCount = -1;
    visiblePFs = getNumVisiblePFs.call(this);
    var frags = model.getFragmentList();
    if (frags) {
      onDemandLoading = frags._pagingProxy ? "On" : "Off";
      if (frags._pagingProxy)
      onDemandLoadingColor = "";
      if (frags._pagingProxy) {
        this.occInstCheckbox.setValue(!!frags._pagingProxy.options.debug.useOcclusionInstancing);
        this.autoCheckbox.setValue(!!frags._pagingProxy.options.debug.automaticRefresh);
        if (!timer) {
          if (memoryStats)
          this.pfSlider.setValue(memoryStats.limit);
          if (frags._pagingProxy.options.debug.maxPageOutSize)
          this.maxPSlider.setValue(frags._pagingProxy.options.debug.maxPageOutSize);
          if (frags._pagingProxy.options.debug.occlusionThreshold)
          this.occtSlider.setValue(frags._pagingProxy.options.debug.occlusionThreshold);
          if (frags._pagingProxy.options.debug.occlusionTestThreshold)
          this.poctSlider.setValue(frags._pagingProxy.options.debug.occlusionTestThreshold);
          if (frags._pagingProxy.options.debug.startOcclusionTestingPackCount)
          this.socpSlider.setValue(frags._pagingProxy.options.debug.startOcclusionTestingPackCount);
          if (frags._pagingProxy.options.debug.testPackfileCount)
          this.tstcSlider.setValue(frags._pagingProxy.options.debug.testPackfileCount);
        }
        if (Object.prototype.hasOwnProperty.call(frags._pagingProxy, "loadedPacks"))
        memorySize = frags._pagingProxy.totalGeomSize.toFixed(3) + " / limit " + memoryStats.effectiveLimit.toFixed(3);
        if (memoryStats)
        memoryUsed = memoryStats.loaded.toFixed(3);
        if (Object.prototype.hasOwnProperty.call(frags._pagingProxy, "loadedPacks"))
        loadedPackCount = Object.keys(frags._pagingProxy.loadedPacks).length;
        if (Object.prototype.hasOwnProperty.call(frags._pagingProxy, "packsPagedOut"))
        packsPagedCount = frags._pagingProxy.packsPagedOut;
        if (Object.prototype.hasOwnProperty.call(frags._pagingProxy, "lastPageOut"))
        pageOut = frags._pagingProxy.lastPageOut.toFixed(3);
        if (Object.prototype.hasOwnProperty.call(frags._pagingProxy, "occlusionCulledCount"))
        culledCount = frags._pagingProxy.occlusionCulledCount.toFixed(0);
      }

      var showPF = "all";
      if (frags.showPF !== -1) {
        var visPFs = parseInt(visiblePFs);
        if (showPFindex === -1) {
          showPF = "all";
        } else {
          showPF = frags.showPF;
          if (visPFs >= 0) {
            // valid to check for other status
            if (Object.prototype.hasOwnProperty.call(frags._pagingProxy, "loadedPacks") &&
            !frags._pagingProxy.loadedPacks[frags.showPF]) {
              // PF is not loaded or not visible, for some reason.
              showPF = showPF + " (not loaded)";
            }
            if (showPFindex >= visPFs) {
              // [] means nothing in PF is visible
              showPF = showPF + " (fully culled)";
            }
          }
        }
      }
      pfStrategy = showPF.toString();
    }
    if (model.is2d()) {
      packFileCount = "File is 2D";
    } else {
      var data = model.getData();
      if (data) {
        packFileCount = data.geompacks.length.toString();
        pfMax = packFileCount - 1;
      }
      if (visiblePFs >= 0)
      packFileCount += " / " + visiblePFs + " visible";
      if (loadedPackCount >= 0)
      memoryUsed += " / " + loadedPackCount + " loaded";
      if (packsPagedCount >= 0)
      pageOut += " / " + packsPagedCount + " packs paged out";

    }
  }
  this.onDemandLoading.setAttribute("data-i18n", onDemandLoading);
  this.onDemandLoading.textContent = av.i18n.translate(onDemandLoading);
  this.onDemandLoading.style.color = onDemandLoadingColor;
  this.packFileCount.setAttribute("data-i18n", packFileCount);
  this.packFileCount.textContent = av.i18n.translate(packFileCount);
  this.geomMemorySize.setAttribute("data-i18n", memorySize);
  this.geomMemorySize.textContent = av.i18n.translate(memorySize);
  this.memUsedSize.setAttribute("data-i18n", memoryUsed);
  this.memUsedSize.textContent = av.i18n.translate(memoryUsed);
  this.pfStrategy.setAttribute("data-i18n", pfStrategy);
  this.pfStrategy.textContent = av.i18n.translate(pfStrategy);
  this.lastPageOut.setAttribute("data-i18n", pageOut);
  this.lastPageOut.textContent = av.i18n.translate(pageOut);
  this.occlusionCulledCount.setAttribute("data-i18n", culledCount);
  this.occlusionCulledCount.textContent = av.i18n.translate(culledCount);

  // set to true range
  this.showPFSlider.sliderElement.max = pfMax;
  this.showPFSlider.stepperElement.max = pfMax;
};

/***/ }),

/***/ "./extensions/MemoryLimitedDebug/locales.js":
/*!**************************************************!*\
  !*** ./extensions/MemoryLimitedDebug/locales.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "locales": () => (/* binding */ locales)
/* harmony export */ });
/* harmony import */ var _res_locales_en_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../res/locales/en/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/en/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_en_GB_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../res/locales/en-GB/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/en-GB/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_cs_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../res/locales/cs/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/cs/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_de_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../res/locales/de/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/de/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_es_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../res/locales/es/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/es/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_fr_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../res/locales/fr/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/fr/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_fr_CA_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../res/locales/fr-CA/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/fr-CA/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_it_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../res/locales/it/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/it/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_ja_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../res/locales/ja/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/ja/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_ko_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../res/locales/ko/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/ko/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_pl_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../res/locales/pl/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/pl/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_pt_BR_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../res/locales/pt-BR/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/pt-BR/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_ru_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../res/locales/ru/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/ru/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_tr_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../res/locales/tr/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/tr/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_zh_HANS_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../res/locales/zh-HANS/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/zh-HANS/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_zh_HANT_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../res/locales/zh-HANT/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/zh-HANT/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_zh_HK_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../../res/locales/zh-HK/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/zh-HK/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_nl_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../../res/locales/nl/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/nl/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_sv_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../../res/locales/sv/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/sv/nobundle-mem-limited-debug-ext.loc.json");
/* harmony import */ var _res_locales_da_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../../res/locales/da/nobundle-mem-limited-debug-ext.loc.json */ "./res/locales/da/nobundle-mem-limited-debug-ext.loc.json");






















var locales = {
  en: _res_locales_en_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_0__,
  "en-GB": _res_locales_en_GB_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_1__,
  cs: _res_locales_cs_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_2__,
  de: _res_locales_de_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_3__,
  es: _res_locales_es_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_4__,
  fr: _res_locales_fr_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_5__,
  "fr-CA": _res_locales_fr_CA_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_6__,
  it: _res_locales_it_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_7__,
  ja: _res_locales_ja_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_8__,
  ko: _res_locales_ko_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_9__,
  pl: _res_locales_pl_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_10__,
  "pt-BR": _res_locales_pt_BR_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_11__,
  ru: _res_locales_ru_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_12__,
  tr: _res_locales_tr_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_13__,
  "zh-HANS": _res_locales_zh_HANS_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_14__,
  "zh-HANT": _res_locales_zh_HANT_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_15__,
  "zh-HK": _res_locales_zh_HK_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_16__,
  nl: _res_locales_nl_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_17__,
  sv: _res_locales_sv_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_18__,
  da: _res_locales_da_nobundle_mem_limited_debug_ext_loc_json__WEBPACK_IMPORTED_MODULE_19__ };

/***/ }),

/***/ "./extensions/MemoryLimitedDebug/MemoryManagerUI.css":
/*!***********************************************************!*\
  !*** ./extensions/MemoryLimitedDebug/MemoryManagerUI.css ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_MemoryManagerUI_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./MemoryManagerUI.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./extensions/MemoryLimitedDebug/MemoryManagerUI.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_MemoryManagerUI_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_MemoryManagerUI_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_MemoryManagerUI_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_MemoryManagerUI_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var style = document.createElement("style");
  options.setAttributes(style, options.attributes);
  options.insert(style);
  return style;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(style) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    style.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute("media", media);
  } else {
    style.removeAttribute("media");
  }

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, style);
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


function domAPI(options) {
  var style = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(style, options, obj);
    },
    remove: function remove() {
      removeStyleElement(style);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, style) {
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./res/locales/cs/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/cs/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"cs","@@context":"Rozšíření MemoryLimitedDebug","Memory Manager":"Správce paměti","Memory":"Paměť","On Demand Loading":"Načítání na vyžádání","Unknown":"Neznámé","On":"Zapnuto","Off":"Vypnuto","Pack File Count":"Počet souborů v balíčku","Geom Memory Size":"Velikosti paměti pro geometrii","Memory Used":"Využitá paměť","Last Page Out":"Poslední uvolněná stránka","Occlusion Culled Count":"Počet vynechání pomocí okluze","Occlusion":"Okluze","Keep Id Pixels":"Zachovat pixely ID","Pack Occluded Pixels":"Okluze pixelů v balíčku","Start Occlusion":"Počáteční okluze","Occlusion Pack Count":"Počet okluzí v balíčku","Occlusion Instancing":"Výskyt okluzí","Debug":"Ladit","Auto Refresh":"Automatické obnovení","Unload Packfiles":"Uvolnit soubory balíčků","Memory Limit MB":"Limit paměti v MB","Max Page Out Size":"Maximální velikost uvolněných stránek","PF by importance":"PF podle důležitosti","Show single PF":"Zobrazit jedno PF","Pack File Displayed":"Zobrazený soubor balíčku"}');

/***/ }),

/***/ "./res/locales/da/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/da/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"da","@@context":"MemoryLimitedDebug-filbetegnelse","Memory Manager":"Hukommelsesadministration","Memory":"Hukommelse","On Demand Loading":"On demand-indlæsning","Unknown":"Ukendt","On":"Til","Off":"Fra","Pack File Count":"Antal pakkede filer","Geom Memory Size":"Størrelse på Geom-hukommelse","Memory Used":"Hukommelse brugt","Last Page Out":"Sidste side ud","Occlusion Culled Count":"Antal for fravalgt okklusion","Occlusion":"Okkludering","Keep Id Pixels":"Behold ID-pixler","Pack Occluded Pixels":"Pak okkluderede pixler","Start Occlusion":"Start okklusion","Occlusion Pack Count":"Antal okklusionspakker","Occlusion Instancing":"Okklusionsforekomster","Debug":"Fejlretning","Auto Refresh":"Automatisk opdatering","Unload Packfiles":"Aflæs pakkefiler","Memory Limit MB":"Hukommelsesgrænse MB","Max Page Out Size":"Størrelse på maks. side ud","PF by importance":"PF efter vigtighed","Show single PF":"Vis enkelt PF","Pack File Displayed":"Vist pakkefil"}');

/***/ }),

/***/ "./res/locales/de/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/de/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"de","@@context":"Erweiterung MemoryLimitedDebug","Memory Manager":"Memory Manager","Memory":"Arbeitsspeicher","On Demand Loading":"Laden bei Bedarf","Unknown":"Unbekannt","On":"Aktiviert","Off":"Deaktiviert","Pack File Count":"Anzahl Paketdateien","Geom Memory Size":"GEOM-Speichergröße","Memory Used":"Verwendeter Speicher","Last Page Out":"Letzte ausgegebene Seite","Occlusion Culled Count":"Anzahl ausgeblendeter Okklusionen","Occlusion":"Okklusion","Keep Id Pixels":"ID-Pixel beibehalten","Pack Occluded Pixels":"Okkludierte Pixel packen","Start Occlusion":"Okklusion starten","Occlusion Pack Count":"Anzahl Okklusionspakete","Occlusion Instancing":"Okklusions-Instanzen","Debug":"Fehlerbehebung","Auto Refresh":"Autom. aktualisieren","Unload Packfiles":"Paketdateien entfernen","Memory Limit MB":"Speichergrenze in MB","Max Page Out Size":"Max. Größe Ausgabeseite","PF by importance":"Paketdateien nach Wichtigkeit","Show single PF":"Einzelne Paketdatei anzeigen","Pack File Displayed":"Angezeigte Paketdatei"}');

/***/ }),

/***/ "./res/locales/en-GB/nobundle-mem-limited-debug-ext.loc.json":
/*!*******************************************************************!*\
  !*** ./res/locales/en-GB/nobundle-mem-limited-debug-ext.loc.json ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"en","@@context":"MemoryLimitedDebug extension","Memory Manager":"Memory Manager","Memory":"Memory","On Demand Loading":"On Demand Loading","Unknown":"Unknown","On":"On","Off":"Off","Pack File Count":"Pack File Count","Geom Memory Size":"Geom Memory Size","Memory Used":"Memory Used","Last Page Out":"Last Page Out","Occlusion Culled Count":"Occlusion Culled Count","Occlusion":"Occlusion","Keep Id Pixels":"Keep Id Pixels","Pack Occluded Pixels":"Pack Occluded Pixels","Start Occlusion":"Start Occlusion","Occlusion Pack Count":"Occlusion Pack Count","Occlusion Instancing":"Occlusion Instancing","Debug":"Debug","Auto Refresh":"Auto Refresh","Unload Packfiles":"Unload Packfiles","Memory Limit MB":"Memory Limit MB","Max Page Out Size":"Max Page Out Size","PF by importance":"PF by importance","Show single PF":"Show single PF","Pack File Displayed":"Pack File Displayed"}');

/***/ }),

/***/ "./res/locales/en/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/en/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"en","@@context":"MemoryLimitedDebug extension","Memory Manager":"Memory Manager","Memory":"Memory","On Demand Loading":"On Demand Loading","Unknown":"Unknown","On":"On","Off":"Off","Pack File Count":"Pack File Count","Geom Memory Size":"Geom Memory Size","Memory Used":"Memory Used","Last Page Out":"Last Page Out","Occlusion Culled Count":"Occlusion Culled Count","Occlusion":"Occlusion","Keep Id Pixels":"Keep Id Pixels","Pack Occluded Pixels":"Pack Occluded Pixels","Start Occlusion":"Start Occlusion","Occlusion Pack Count":"Occlusion Pack Count","Occlusion Instancing":"Occlusion Instancing","Debug":"Debug","Auto Refresh":"Auto Refresh","Unload Packfiles":"Unload Packfiles","Memory Limit MB":"Memory Limit MB","Max Page Out Size":"Max Page Out Size","PF by importance":"PF by importance","Show single PF":"Show single PF","Pack File Displayed":"Pack File Displayed"}');

/***/ }),

/***/ "./res/locales/es/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/es/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"es","@@context":"Extensión de MemoryLimitedDebug","Memory Manager":"Administrador de memoria","Memory":"Memoria","On Demand Loading":"Carga a petición","Unknown":"Desconocido","On":"Act","Off":"Des","Pack File Count":"Recuento de archivos del paquete","Geom Memory Size":"Tamaño de memoria de geom.","Memory Used":"Memoria utilizada","Last Page Out":"Última salida de página","Occlusion Culled Count":"Recuento de exclusión selectiva de oclusión","Occlusion":"Oclusión","Keep Id Pixels":"Mantener ID píxeles","Pack Occluded Pixels":"Píxeles ocluidos del paquete","Start Occlusion":"Iniciar oclusión","Occlusion Pack Count":"Recuento de paquetes de oclusión","Occlusion Instancing":"Creación de ejemplares de oclusión","Debug":"Depurar","Auto Refresh":"Actualización automática","Unload Packfiles":"Descargar archivos del paquete","Memory Limit MB":"Límite de memoria (MB)","Max Page Out Size":"Tamaño máx. de salida de página","PF by importance":"PF por importancia","Show single PF":"Mostrar PF único","Pack File Displayed":"Archivo del paquete mostrado"}');

/***/ }),

/***/ "./res/locales/fr-CA/nobundle-mem-limited-debug-ext.loc.json":
/*!*******************************************************************!*\
  !*** ./res/locales/fr-CA/nobundle-mem-limited-debug-ext.loc.json ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"fr-CA","@@context":"Extension de débogage limité de la mémoire","Memory Manager":"Gestionnaire de mémoire","Memory":"Mémoire","On Demand Loading":"Téléchargement sur demande","Unknown":"Inconnu","On":"Activé","Off":"Désactivé","Pack File Count":"Nombre de fichiers groupés","Geom Memory Size":"Taille de la mémoire géomatique","Memory Used":"Mémoire utilisée","Last Page Out":"Dernière page de renvoi","Occlusion Culled Count":"Nombre d\'occlusions supprimées","Occlusion":"Occlusion","Keep Id Pixels":"Conserver les pixels des identifiants","Pack Occluded Pixels":"Pixels des groupes occlus","Start Occlusion":"Commencer l\'occlusion","Occlusion Pack Count":"Nombre de groupes d\'occlusions","Occlusion Instancing":"Instanciation d\'occlusion","Debug":"Déboguer","Auto Refresh":"Rafraîchissement automatique","Unload Packfiles":"Décharger des fichiers groupés","Memory Limit MB":"Limite de la mémoire (Mo)","Max Page Out Size":"Taille maximale de la page de renvoi","PF by importance":"Fichiers groupés classés selon l\'importance","Show single PF":"Afficher un fichier groupé","Pack File Displayed":"Fichier groupé affiché"}');

/***/ }),

/***/ "./res/locales/fr/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/fr/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"fr","@@context":"Extension MemoryLimitedDebug","Memory Manager":"Gestionnaire de mémoire","Memory":"Mémoire","On Demand Loading":"Chargement sur demande","Unknown":"Inconnu","On":"Actif","Off":"Inactif","Pack File Count":"Nombre de fichiers de compactage","Geom Memory Size":"Taille de la mémoire pour les éléments géométriques","Memory Used":"Mémoire utilisée","Last Page Out":"Dernière page non prise en compte","Occlusion Culled Count":"Nombre d\'occlusions éliminées","Occlusion":"Occlusion","Keep Id Pixels":"Conserver les pixels d\'identification","Pack Occluded Pixels":"Compacter les pixels cachés","Start Occlusion":"Démarrer l\'occlusion","Occlusion Pack Count":"Nombre d\'occlusions du compactage","Occlusion Instancing":"Instanciation de l\'occlusion","Debug":"Déboguer","Auto Refresh":"Actualisation automatique","Unload Packfiles":"Décharger les fichiers de compactage","Memory Limit MB":"Limite de mémoire (Mo)","Max Page Out Size":"Nombre max de pages hors format","PF by importance":"Compacter les fichiers par importance","Show single PF":"Afficher le fichier de compactage unique","Pack File Displayed":"Fichier de compactage affiché"}');

/***/ }),

/***/ "./res/locales/it/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/it/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"it","@@context":"Estensione MemoryLimitedDebug","Memory Manager":"Gestione della memoria","Memory":"Memoria","On Demand Loading":"Caricamento su richiesta","Unknown":"Sconosciuto","On":"On","Off":"Off","Pack File Count":"Conteggio file pacchetto","Geom Memory Size":"Dimensione memoria geometrica","Memory Used":"Memoria utilizzata","Last Page Out":"Ultima pagina in uscita","Occlusion Culled Count":"Conteggio occlusioni escluse","Occlusion":"Occlusione","Keep Id Pixels":"Conserva pixel ID","Pack Occluded Pixels":"Pixel occlusi pacchetto","Start Occlusion":"Avvia occlusione","Occlusion Pack Count":"Conteggio occlusioni pacchetto","Occlusion Instancing":"Creazione istanze occlusione","Debug":"Debug","Auto Refresh":"Aggiornamento automatico","Unload Packfiles":"Scarica file pacchetto","Memory Limit MB":"Limite memoria MB","Max Page Out Size":"Dimensione massima pagina in uscita","PF by importance":"PF per importanza","Show single PF":"Mostra PF singolo","Pack File Displayed":"File pacchetto visualizzato"}');

/***/ }),

/***/ "./res/locales/ja/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/ja/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"ja","@@context":"MemoryLimitedDebug エクステンション","Memory Manager":"メモリ管理","Memory":"メモリ","On Demand Loading":"オン ディマンド ロード","Unknown":"不明","On":"オン","Off":"オフ","Pack File Count":"パック ファイル数","Geom Memory Size":"Geom メモリ サイズ","Memory Used":"メモリ使用量","Last Page Out":"最終ページ出力","Occlusion Culled Count":"オクルージョン カリング数","Occlusion":"オクルージョン","Keep Id Pixels":"キープ Id ピクセル","Pack Occluded Pixels":"パック オクルード ピクセル","Start Occlusion":"オクルージョンを開始","Occlusion Pack Count":"オクルージョン パック数","Occlusion Instancing":"オクルージョンのインスタンス作成中","Debug":"デバッグ","Auto Refresh":"自動更新","Unload Packfiles":"パックファイルをロード解除","Memory Limit MB":"制限メモリ MB","Max Page Out Size":"最大ページ出力サイズ","PF by importance":"重要度別 PF","Show single PF":"シングル PF を表示","Pack File Displayed":"パック ファイルが表示されました"}');

/***/ }),

/***/ "./res/locales/ko/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/ko/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"ko","@@context":"MemoryLimitedDebug 확장","Memory Manager":"메모리 관리자","Memory":"메모리","On Demand Loading":"요청 시 로드","Unknown":"알 수 없음","On":"켜기","Off":"끄기","Pack File Count":"파일 개수 패키징","Geom Memory Size":"형상 메모리 크기","Memory Used":"사용된 메모리","Last Page Out":"마지막 페이지 출력","Occlusion Culled Count":"폐색 제거 개수","Occlusion":"폐색","Keep Id Pixels":"ID 픽셀 유지","Pack Occluded Pixels":"폐색 픽셀 패키징","Start Occlusion":"시작 폐색","Occlusion Pack Count":"폐색 팩 개수","Occlusion Instancing":"폐색 인스턴스","Debug":"디버그","Auto Refresh":"자동 갱신","Unload Packfiles":"Packfiles 언로드","Memory Limit MB":"메모리 제한 MB","Max Page Out Size":"최대 페이지 출력 크기","PF by importance":"중요도 순으로 PF","Show single PF":"단일 PF 표시","Pack File Displayed":"팩 파일 표시됨"}');

/***/ }),

/***/ "./res/locales/nl/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/nl/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"nl","@@context":"MemoryLimitedDebug-extensie","Memory Manager":"Geheugenbeheer","Memory":"Geheugen","On Demand Loading":"Laden op aanvraag","Unknown":"Onbekend","On":"Aan","Off":"Uit","Pack File Count":"Aantal pakketbestanden","Geom Memory Size":"Geheugengrootte geometrie","Memory Used":"Gebruikt geheugen","Last Page Out":"Laatste pagina uit","Occlusion Culled Count":"Aantal verzamelde occlusie","Occlusion":"Occlusie","Keep Id Pixels":"Id-pixels behouden","Pack Occluded Pixels":"Verborgen pixels inpakken","Start Occlusion":"Occlusie starten","Occlusion Pack Count":"Aantal occlusiepakketten","Occlusion Instancing":"Occlusie-instancing","Debug":"Fouten opsporen","Auto Refresh":"Automatisch vernieuwen","Unload Packfiles":"Pakketbestanden uitladen","Memory Limit MB":"MB geheugenlimiet","Max Page Out Size":"Maximale grootte pagina uit","PF by importance":"PF op urgentie","Show single PF":"Enkele PF weergeven","Pack File Displayed":"Pakketbestand weergegeven"}');

/***/ }),

/***/ "./res/locales/pl/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/pl/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"pl","@@context":"Rozszerzenie MemoryLimitedDebug","Memory Manager":"Menedżer pamięci","Memory":"Pamięć","On Demand Loading":"Wczytywanie na żądanie","Unknown":"Nieznane","On":"Wł.","Off":"Wył.","Pack File Count":"Liczba plików pakietu","Geom Memory Size":"Geometryczny rozmiar pamięci","Memory Used":"Użycie pamięci","Last Page Out":"Ostatnia strona na wyjściu","Occlusion Culled Count":"Liczba wyeliminowanych okluzji","Occlusion":"Okluzja","Keep Id Pixels":"Zachowaj piksele identyfikatora","Pack Occluded Pixels":"Piksele pakietu okluzji","Start Occlusion":"Rozpocznij okluzję","Occlusion Pack Count":"Liczba pakietów okluzji","Occlusion Instancing":"Tworzenie instancji okluzji","Debug":"Debuguj","Auto Refresh":"Automatyczne odświeżanie","Unload Packfiles":"Usuń pliki pakietu","Memory Limit MB":"Limit pamięci MB","Max Page Out Size":"Maks. rozmiar strony na wyjściu","PF by importance":"Plik pakietu według ważności","Show single PF":"Pokaż pojedynczy plik pakietu","Pack File Displayed":"Plik pakietu wyświetlony"}');

/***/ }),

/***/ "./res/locales/pt-BR/nobundle-mem-limited-debug-ext.loc.json":
/*!*******************************************************************!*\
  !*** ./res/locales/pt-BR/nobundle-mem-limited-debug-ext.loc.json ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"pt","@@context":"Extensão MemoryLimitedDebug","Memory Manager":"Gerenciador de memória","Memory":"Memória","On Demand Loading":"Carregamento sob demanda","Unknown":"Desconhecido","On":"Ativado","Off":"Desativado","Pack File Count":"Contagem de arquivos do pacote","Geom Memory Size":"Tamanho da memória de geometria","Memory Used":"Memória usada","Last Page Out":"Última página externa","Occlusion Culled Count":"Contagem da seleção de oclusão","Occlusion":"Oclusão","Keep Id Pixels":"Manter pixels de ID","Pack Occluded Pixels":"Pixels obstruídos do pacote","Start Occlusion":"Iniciar oclusão","Occlusion Pack Count":"Contagem dos pacotes de oclusão","Occlusion Instancing":"Instanciação da oclusão","Debug":"Depurar","Auto Refresh":"Atualização automática","Unload Packfiles":"Descarregar arquivos do pacote","Memory Limit MB":"Limite de memória em MB","Max Page Out Size":"Tamanho máx. da página externa","PF by importance":"PF por importância","Show single PF":"Mostrar PF único","Pack File Displayed":"Arquivo do pacote exibido"}');

/***/ }),

/***/ "./res/locales/ru/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/ru/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"ru","@@context":"Расширение MemoryLimitedDebug","Memory Manager":"Диспетчер памяти","Memory":"Память","On Demand Loading":"Загрузка по требованию","Unknown":"Нет данных","On":"Вкл.","Off":"Откл.","Pack File Count":"Количество файлов пакетов","Geom Memory Size":"Размер памяти для элементов геометрии","Memory Used":"Используется памяти","Last Page Out":"Последняя выгрузка страницы","Occlusion Culled Count":"Количество отсеянных скрытых элементов","Occlusion":"Скрытие","Keep Id Pixels":"Оставить пикселы с идентификаторами","Pack Occluded Pixels":"Создать пакет скрытых пикселов","Start Occlusion":"Начать скрытие","Occlusion Pack Count":"Количество пакетов скрытых элементов","Occlusion Instancing":"Создание экземпляров скрытых элементов","Debug":"Отладка","Auto Refresh":"Автоматическое обновление","Unload Packfiles":"Выгрузить файлы пакетов","Memory Limit MB":"Ограничение памяти (МБ)","Max Page Out Size":"Макс. размер страницы для выгрузки","PF by importance":"Файлы пакетов по важности","Show single PF":"Показать один файл пакета","Pack File Displayed":"Отображаемый файл пакета"}');

/***/ }),

/***/ "./res/locales/sv/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/sv/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"sv","@@context":"MemoryLimitedDebug-tillägg","Memory Manager":"Minneshanteraren","Memory":"Minne","On Demand Loading":"Inläsning på begäran","Unknown":"Okänd","On":"På","Off":"Av","Pack File Count":"Paketfilsantal","Geom Memory Size":"Geom-minnesstorlek","Memory Used":"Använt minne","Last Page Out":"Senaste sida ut","Occlusion Culled Count":"Antal ocklusioner som avlägsnats","Occlusion":"Ocklusion","Keep Id Pixels":"Behåll ID-pixlar","Pack Occluded Pixels":"Packa ockluderade pixlar","Start Occlusion":"Starta ockludering","Occlusion Pack Count":"Antal ockluderingspaket","Occlusion Instancing":"Ockluderingsinstantiering","Debug":"Felsök","Auto Refresh":"Automatisk uppdatering","Unload Packfiles":"Ladda ur packfiler","Memory Limit MB":"Minnesgräns MB","Max Page Out Size":"Max storlek för sida ut","PF by importance":"PF efter vikt","Show single PF":"Visa enskild PF","Pack File Displayed":"Packfil som visas"}');

/***/ }),

/***/ "./res/locales/tr/nobundle-mem-limited-debug-ext.loc.json":
/*!****************************************************************!*\
  !*** ./res/locales/tr/nobundle-mem-limited-debug-ext.loc.json ***!
  \****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"tr","@@context":"MemoryLimitedDebug uzantısı","Memory Manager":"Bellek Yöneticisi","Memory":"Bellek","On Demand Loading":"İsteğe Bağlı Yükleme","Unknown":"Bilinmiyor","On":"Açık","Off":"Kapalı","Pack File Count":"Paket Dosyası Sayısı","Geom Memory Size":"Geom Bellek Boyutu","Memory Used":"Bellek Kullanıldı","Last Page Out":"Son Çıkış Sayfası","Occlusion Culled Count":"Kapanma Tıkanma Sayısı","Occlusion":"Kapanma","Keep Id Pixels":"Kimlik Piksellerini Sakla","Pack Occluded Pixels":"Kapatılmış Pikselleri Paketle","Start Occlusion":"Kapatmayı Başlat","Occlusion Pack Count":"Kapatma Paketi Sayısı","Occlusion Instancing":"Kapatma Örneği","Debug":"Hata Ayıkla","Auto Refresh":"Otomatik Yenile","Unload Packfiles":"Paket Dosyalarını Boşalt","Memory Limit MB":"Bellek Sınırı MB","Max Page Out Size":"Maks. Çıkış Sayfaası Boyutu","PF by importance":"Öneme göre PF","Show single PF":"Tek PF\'yi göster","Pack File Displayed":"Paket Dosyası Görüntülendi"}');

/***/ }),

/***/ "./res/locales/zh-HANS/nobundle-mem-limited-debug-ext.loc.json":
/*!*********************************************************************!*\
  !*** ./res/locales/zh-HANS/nobundle-mem-limited-debug-ext.loc.json ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"zh-Hans","@@context":"内存限制调试扩展","Memory Manager":"内存管理器","Memory":"内存","On Demand Loading":"按需加载","Unknown":"未知","On":"打开","Off":"关闭","Pack File Count":"包文件数","Geom Memory Size":"Geom 内存大小","Memory Used":"已用内存","Last Page Out":"出最后一页","Occlusion Culled Count":"遮挡消隐数","Occlusion":"阻光度","Keep Id Pixels":"保持 Id 像素","Pack Occluded Pixels":"被阻挡的像素保压","Start Occlusion":"开始阻挡","Occlusion Pack Count":"遮挡保压计数","Occlusion Instancing":"实例化阻光","Debug":"调试","Auto Refresh":"自动刷新","Unload Packfiles":"卸载包文件","Memory Limit MB":"内存限制 MB","Max Page Out Size":"最大出页大小","PF by importance":"PF (按重要性)","Show single PF":"显示单个 PF","Pack File Displayed":"显示的包文件"}');

/***/ }),

/***/ "./res/locales/zh-HANT/nobundle-mem-limited-debug-ext.loc.json":
/*!*********************************************************************!*\
  !*** ./res/locales/zh-HANT/nobundle-mem-limited-debug-ext.loc.json ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"zh-Hant","@@context":"MemoryLimitedDebug 延伸","Memory Manager":"記憶體管理員","Memory":"記憶體","On Demand Loading":"隨選載入","Unknown":"不明","On":"開啟","Off":"關閉","Pack File Count":"封裝檔案計數","Geom Memory Size":"幾何記憶體大小","Memory Used":"使用的記憶體","Last Page Out":"最後移出分頁","Occlusion Culled Count":"遮擋剔除計數","Occlusion":"遮擋","Keep Id Pixels":"保留 ID 像素","Pack Occluded Pixels":"封裝遮擋的像素","Start Occlusion":"開始遮擋","Occlusion Pack Count":"遮擋封裝計數","Occlusion Instancing":"遮擋實例化","Debug":"除錯","Auto Refresh":"自動重新整理","Unload Packfiles":"卸載封裝檔案","Memory Limit MB":"記憶體限制 MB","Max Page Out Size":"移出分頁最大大小","PF by importance":"依重要性的 PF","Show single PF":"展示單一 PF","Pack File Displayed":"顯示的封裝檔案"}');

/***/ }),

/***/ "./res/locales/zh-HK/nobundle-mem-limited-debug-ext.loc.json":
/*!*******************************************************************!*\
  !*** ./res/locales/zh-HK/nobundle-mem-limited-debug-ext.loc.json ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"@@locale":"zh-hk","@@context":"MemoryLimitedDebug 擴充功能","Memory Manager":"記憶體管理員","Memory":"記憶體","On Demand Loading":"隨選載入","Unknown":"不明","On":"開啟","Off":"關閉","Pack File Count":"封裝檔案計數","Geom Memory Size":"幾何記憶體大小","Memory Used":"使用的記憶體","Last Page Out":"最後移出分頁","Occlusion Culled Count":"遮擋剔除計數","Occlusion":"遮擋","Keep Id Pixels":"保留 ID 像素","Pack Occluded Pixels":"封裝遮擋的像素","Start Occlusion":"開始遮擋","Occlusion Pack Count":"遮擋封裝計數","Occlusion Instancing":"遮擋執行個體化","Debug":"除錯","Auto Refresh":"自動重新整理","Unload Packfiles":"解決安載封裝檔案","Memory Limit MB":"記憶體限制 MB","Max Page Out Size":"移出分頁大小上限","PF by importance":"依重要性的 PF","Show single PF":"展示單一 PF","Pack File Displayed":"顯示的封裝檔案"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************************************************!*\
  !*** ./extensions/MemoryLimitedDebug/MemoryManager.js ***!
  \********************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MemoryManager": () => (/* binding */ MemoryManager)
/* harmony export */ });
/* harmony import */ var _MemoryManagerUI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MemoryManagerUI */ "./extensions/MemoryLimitedDebug/MemoryManagerUI.js");
/* harmony import */ var _locales__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./locales */ "./extensions/MemoryLimitedDebug/locales.js");


var SETTINGS_BUTTON_LABEL = 'Memory Manager';

var av = Autodesk.Viewing;

function MemoryManager(viewer, options) {
  av.Extension.call(this, viewer, options);
  this.name = 'memorymanager';

  // UI
  this.configButtonId = null; // Button in the setting panel
  this.panel = null; // Panel that opens after the config button is clicked
}

MemoryManager.prototype = Object.create(av.Extension.prototype);
MemoryManager.prototype.constructor = MemoryManager;

MemoryManager.prototype.close = function () {
  this.panel.setVisible(false, true);
};

MemoryManager.prototype.load = function () {
  this.extendLocalization(_locales__WEBPACK_IMPORTED_MODULE_1__.locales);
  return true;
};

MemoryManager.prototype.onToolbarCreated = function () {var _this = this;
  this.configButtonId = this.viewer.getSettingsPanel().addConfigButton(SETTINGS_BUTTON_LABEL, function () {
    if (!_this.panel) {
      _this.panel = new _MemoryManagerUI__WEBPACK_IMPORTED_MODULE_0__.MemoryManagerPanel(_this.viewer);
    }
    _this.panel.setVisible(true);
  });
};

MemoryManager.prototype.unload = function () {

  if (this.configButtonId) {
    this.viewer.viewerSettingsPanel.removeConfigButton(this.configButtonId);
    this.configButtonId = null;
  }
  if (this.panel) {
    this.panel.setVisible(false);
    this.panel.uninitialize();
    this.panel = null;
  }

  return true;
};

av.theExtensionManager.registerExtension('Autodesk.Viewing.MemoryLimitedDebug', MemoryManager);
})();

Autodesk.Extensions.MemoryLimitedDebug = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=MemoryLimitedDebug.js.map