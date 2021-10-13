/*!
 * LMV v7.51.0
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
 * The Autodesk Forge viewer can only be used to view files generated by
 * Autodesk Forge services. The Autodesk Forge Viewer JavaScript must be
 * delivered from an Autodesk hosted URL.
 */
Autodesk.Extensions.Crop =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./extensions/Crop/Crop.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./extensions/Crop/Crop.css":
/*!**********************************!*\
  !*** ./extensions/Crop/Crop.css ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/css-loader!../../node_modules/sass-loader/dist/cjs.js!./Crop.css */ "./node_modules/css-loader/index.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Crop/Crop.css");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./extensions/Crop/Crop.js":
/*!*********************************!*\
  !*** ./extensions/Crop/Crop.js ***!
  \*********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Crop_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Crop.css */ "./extensions/Crop/Crop.css");
/* harmony import */ var _Crop_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Crop_css__WEBPACK_IMPORTED_MODULE_0__);
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}

var av = Autodesk.Viewing;
var CROP_CONTEXT_NAME = "crop-context";

var Events = {
  CROP_MODIFIED: 'cropModified' };


var namespace = AutodeskNamespace("Autodesk.Crop");

/**
                                                    * 2D Crop Extension
                                                    */var
CropExtension = /*#__PURE__*/function (_av$Extension) {_inherits(CropExtension, _av$Extension);var _super = _createSuper(CropExtension);
  function CropExtension(viewer, options) {var _this;_classCallCheck(this, CropExtension);
    _this = _super.call(this, viewer, options);

    Autodesk.Viewing.EventDispatcher.prototype.apply(_assertThisInitialized(_this));return _this;
  }_createClass(CropExtension, [{ key: "load", value: function () {var _load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {var DefaultCropStyle;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (


                  this.viewer.loadExtension("Autodesk.Edit2D"));case 2:this.edit2dExtension = _context.sent;

                // Additional default crop styles could be found in Crop.css
                DefaultCropStyle = new Autodesk.Edit2D.Style({
                  fillAlpha: 0.0,
                  lineColor: "rgb(0, 0, 0)",
                  lineStyle: 10, // Dashes long
                  lineWidth: 1 });


                // Optional crop style. Should be in the form of Edit2D.Style.
                this.cropStyle = this.options.cropStyle || DefaultCropStyle;

                this.tmpBox = new THREE.Box3();

                this.updateContextMatrix = this.updateContextMatrix.bind(this);
                this.updateCropBounds = this.updateCropBounds.bind(this);

                this.viewer.addEventListener(Autodesk.Viewing.MODEL_TRANSFORM_CHANGED_EVENT, this.updateContextMatrix);return _context.abrupt("return",

                true);case 10:case "end":return _context.stop();}}}, _callee, this);}));function load() {return _load.apply(this, arguments);}return load;}() }, { key: "unload", value: function unload()


    {
      this.clearCropEditBox();
      this.clearCropBounds();
      this.destroyUI();

      if (this.rectangleTool) {
        this.viewer.toolController.deregisterTool(this.rectangleTool);
        this.rectangleTool = null;
      }

      if (this.edgeMoveTool) {
        this.viewer.toolController.deregisterTool(this.edgeMoveTool);
        this.edgeMoveTool = null;
      }

      if (this.moveTool) {
        this.viewer.toolController.deregisterTool(this.moveTool);
        this.moveTool = null;
      }

      if (this.ctx) {
        this.edit2dExtension.unregisterTools(CROP_CONTEXT_NAME);
        this.ctx = null;
      }

      this.edit2dExtension = null;

      this.targetModel = null;
      this.tmpBox = null;

      this.viewer.removeEventListener(Autodesk.Viewing.MODEL_TRANSFORM_CHANGED_EVENT, this.updateContextMatrix);

      return true;
    } }, { key: "getEdit2DContext", value: function getEdit2DContext()

    {
      if (this.ctx) {
        return this.ctx;
      }

      this.ctx = this.edit2dExtension.registerTools(CROP_CONTEXT_NAME);

      // Disable selection fill color for the crop rectangle.
      this.ctx.layer.removeStyleModifier(this.ctx.selection.modifier);

      // Ignore cutplanes.
      this.ctx.layer.setCutPlanesEnabled(false);
      this.ctx.gizmoLayer.setCutPlanesEnabled(false);

      // EdgeMoveTool
      this.edgeMoveTool = new Autodesk.Edit2D.EdgeMoveTool(this.ctx, { edgeHighlightStyle: this.cropStyle, gizmoClassName: "crop" });
      this.viewer.toolController.registerTool(this.edgeMoveTool);

      if (!this.options.disableMoveTool) {
        // MoveTool
        this.moveTool = new Autodesk.Edit2D.MoveTool(this.ctx);
        this.viewer.toolController.registerTool(this.moveTool);
      }

      // RectangleTool
      this.rectangleTool = new Autodesk.Edit2D.RectangleTool(this.ctx, this.cropStyle);
      this.rectangleTool.getCursor = function () {return "crosshair";}; // TODO: Add a 'Crop' cursor?
      this.viewer.toolController.registerTool(this.rectangleTool);

      return this.ctx;
    }

    // Set models that will get affected by the crop bounds.
  }, { key: "setModel", value: function setModel(model) {
      if (model === this.targetModel) {
        return;
      }

      this.clearCropBounds();

      this.targetModel = model;

      this.updateContextMatrix();
    } }, { key: "updateContextMatrix", value: function updateContextMatrix()

    {
      if (this.targetModel) {
        var matrix = this.targetModel.getModelToViewerTransform() || new THREE.Matrix4();
        this.getEdit2DContext().setMatrix(matrix);
      }

      this.updateCropBounds();
    }

    // Calculate & update viewport bounds for all target models, according to current crop.
  }, { key: "updateCropBounds", value: function updateCropBounds() {
      if (!this.cropRect || !this.targetModel) {
        this.clearCropBounds();
        return;
      }

      this.cropRect.computeBBox();
      var bbox = this.cropRect.bbox;

      this.viewer.impl.setViewportBounds(this.targetModel, bbox);
    } }, { key: "setCropRect", value: function setCropRect(

    shape) {var _this2 = this;
      this.cropRect = shape;

      if (this.cropRect) {
        this.cropRect.addEventListener(Autodesk.Edit2D.Shape.Events.MODIFIED, function () {
          _this2.updateCropBounds();
          _this2.fireEvent({ type: Events.CROP_MODIFIED, cropRegion: _this2.getCurrentCropRegion() });
        });
      }

      this.updateCropBounds();
    } }, { key: "getCurrentCropRegion", value: function getCurrentCropRegion()

    {
      if (!this.targetModel || !this.cropRect) {
        return null;
      }

      this.cropRect.computeBBox();
      var cropRegion = new CropRegion(this.cropRect.bbox, this.targetModel.getUnitString());

      return cropRegion;
    } }, { key: "activate", value: function activate()

    {var _this3 = this,_this$cropButton;
      // In case there is already a cropRect, just use it as a starting point. (Don't start from scratch)
      var cropRegion = this.getCurrentCropRegion();

      if (cropRegion) {
        this.loadCropRegion(cropRegion, true);
        return;
      }

      this.getEdit2DContext().gizmoLayer.addEventListener(Autodesk.Edit2D.EditLayer.SHAPE_ADDED, function (_ref) {var shape = _ref.shape;
        _this3.setCropRect(shape);
      }, { once: true });

      // Start drawing a new rectangle
      this.viewer.toolController.activateTool(this.rectangleTool.getName());

      // Rectangle created (endDrag)
      this.rectangleTool.undoStack.addEventListener(Autodesk.Edit2D.UndoStack.AFTER_ACTION, function () {
        _this3.startCropEditing();
      }, { once: true });

      (_this$cropButton = this.cropButton) === null || _this$cropButton === void 0 ? void 0 : _this$cropButton.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);

      this.activeStatus = true;
    }

    // Make the current cropRect draggable, if exists.
  }, { key: "startCropEditing", value: function startCropEditing() {var _this$cropButton2;
      if (!this.cropRect) {
        return;
      }

      (_this$cropButton2 = this.cropButton) === null || _this$cropButton2 === void 0 ? void 0 : _this$cropButton2.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);

      var ctx = this.getEdit2DContext();
      if (!ctx.layer.hasShape(this.cropRect)) {
        ctx.layer.addShape(this.cropRect);
      }

      if (this.viewer.toolController.isToolActivated(this.rectangleTool.getName())) {
        this.viewer.toolController.deactivateTool(this.rectangleTool.getName());
      }

      if (this.moveTool) {
        this.viewer.toolController.activateTool(this.moveTool.getName());
      }

      this.viewer.toolController.activateTool(this.edgeMoveTool.getName());

      ctx.selection.selectOnly(this.cropRect); // Select rect
    }

    // Disable crop editing. Keeps the applied viewportBounds.
  }, { key: "deactivate", value: function deactivate() {var _this$cropButton3;
      if (this.rectangleTool && this.viewer.toolController.isToolActivated(this.rectangleTool.getName())) {
        this.viewer.toolController.deactivateTool(this.rectangleTool.getName());
      }

      if (this.edgeMoveTool && this.viewer.toolController.isToolActivated(this.edgeMoveTool.getName())) {
        this.viewer.toolController.deactivateTool(this.edgeMoveTool.getName());
      }

      if (this.moveTool && this.viewer.toolController.isToolActivated(this.moveTool.getName())) {
        this.viewer.toolController.deactivateTool(this.moveTool.getName());
      }

      this.clearCropEditBox();

      (_this$cropButton3 = this.cropButton) === null || _this$cropButton3 === void 0 ? void 0 : _this$cropButton3.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);

      this.activeStatus = false;
    } }, { key: "clearCropEditBox", value: function clearCropEditBox()

    {var _this$ctx;
      (_this$ctx = this.ctx) === null || _this$ctx === void 0 ? void 0 : _this$ctx.clearLayer(false);
    }

    // Clear the effect of the cropping - removes viewportBounds from all the target models.
  }, { key: "clearCropBounds", value: function clearCropBounds() {
      if (this.targetModel) {
        this.viewer.impl.setViewportBounds(this.targetModel, null);
      }
    }

    // Given a cropRegion, apply crop based on it.
  }, { key: "loadCropRegion", value: function loadCropRegion(cropRegion, startEditing) {
      this.deactivate();

      // cropRegion is a plane object - need to convert it to a CropRegion class.
      if (!cropRegion.getCropInUnits) {
        cropRegion = new CropRegion(cropRegion.bbox, cropRegion.units, cropRegion);
      }

      var cropInModelUnits = cropRegion.getCropInUnits(this.targetModel.getUnitString());
      var rect = new Autodesk.Edit2D.Polygon(undefined, this.cropStyle).fromBox2(cropInModelUnits);
      this.setCropRect(rect);

      if (startEditing) {
        this.startCropEditing();
      }
    }

    // Stops crop editing, and clears viewportBounds.
  }, { key: "reset", value: function reset() {
      this.setCropRect(null);
      this.deactivate();
    }

    // Notice - for F2D, the bounding box is without the shadow.
  }, { key: "cropToModelBounds", value: function cropToModelBounds(startEditing) {
      var bbox = this.targetModel.getBoundingBox(true, true);

      var cropRegion = new CropRegion(bbox, this.targetModel.getUnitString());
      this.loadCropRegion(cropRegion, startEditing);
    } }, { key: "onToolbarCreated", value: function onToolbarCreated()

    {
      if (this.options.createButton) {
        this.createUI();
      }
    }

    // Add toolbar button.
  }, { key: "createUI", value: function createUI() {var _this4 = this;
      var toolbar = this.viewer.getToolbar && this.viewer.getToolbar();

      if (!toolbar || this.cropButton) {
        return;
      }

      var toolbarName = Autodesk.Viewing.TOOLBAR.SETTINGSTOOLSID;
      var toolbarGroup = toolbar.getControl(toolbarName);

      if (!toolbarGroup) {
        return;
      }

      // Create the button first.
      this.cropButton = new Autodesk.Viewing.UI.Button("toolbar-crop-button");
      this.cropButton.setToolTip(Autodesk.Viewing.i18n.translate("Crop"));
      this.cropButton.setIcon("adsk-icon-box");

      this.cropButton.onClick = function () {
        if (_this4.cropButton.getState() === Autodesk.Viewing.UI.Button.State.INACTIVE) {
          _this4.activate();
        } else {
          _this4.deactivate();
        }
      };

      toolbarGroup.addControl(this.cropButton);
    }

    // Remove toolbar button
  }, { key: "destroyUI", value: function destroyUI() {
      if (!this.cropButton) {
        return;
      }

      var toolbar = this.viewer.getToolbar && this.viewer.getToolbar();

      if (!toolbar) {
        return;
      }

      this.cropButton.removeFromParent();
      this.cropButton = null;
    } }]);return CropExtension;}(av.Extension);


// A crop region is defined by a bounding box and units.
var CropRegion = /*#__PURE__*/function () {
  function CropRegion(bbox, units) {_classCallCheck(this, CropRegion);
    this.bbox = bbox;
    this.units = units;
  }

  // Used in order to convert the bbox to a specific target units.
  _createClass(CropRegion, [{ key: "getCropInUnits", value: function getCropInUnits(targetUnits) {
      // If we don't have units information for some reason, just return bbox as is.
      if (!targetUnits || !this.units) {
        return this.bbox;
      }

      var factor = Autodesk.Viewing.Private.convertUnits(this.units, targetUnits, 1, 1);

      var bbox = this.bbox.clone();
      bbox.min.multiplyScalar(factor);
      bbox.max.multiplyScalar(factor);

      return bbox;
    } }]);return CropRegion;}();


// The ExtensionManager requires an extension to be registered.
av.theExtensionManager.registerExtension('Autodesk.Crop', CropExtension);

namespace.Events = Events;

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Crop/Crop.css":
/*!***************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/sass-loader/dist/cjs.js!./extensions/Crop/Crop.css ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".adsk-viewing-viewer .crop.edge-gizmo:hover {\n  background-color: #0696d7; }\n\n.adsk-viewing-viewer .crop.edge-gizmo.selected {\n  background-color: #0696d7; }\n\n.adsk-viewing-viewer .crop.edge-gizmo {\n  background-color: #505050; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })

/******/ });
//# sourceMappingURL=Crop.js.map