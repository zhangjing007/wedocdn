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
Autodesk.Extensions.Moldflow =
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
/******/ 	return __webpack_require__(__webpack_require__.s = "./extensions/Moldflow/Moldflow.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./extensions/Moldflow/Moldflow.css":
/*!******************************************!*\
  !*** ./extensions/Moldflow/Moldflow.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/css-loader!../../node_modules/sass-loader/dist/cjs.js!./Moldflow.css */ "./node_modules/css-loader/index.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Moldflow/Moldflow.css");

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

/***/ "./extensions/Moldflow/Moldflow.js":
/*!*****************************************!*\
  !*** ./extensions/Moldflow/Moldflow.js ***!
  \*****************************************/
/*! exports provided: MoldflowExtension */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MoldflowExtension", function() { return MoldflowExtension; });
/* harmony import */ var _Moldflow_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Moldflow.css */ "./extensions/Moldflow/Moldflow.css");
/* harmony import */ var _Moldflow_css__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_Moldflow_css__WEBPACK_IMPORTED_MODULE_0__);
 // IMPORTANT!!

/*
* load/unload moldflow visualization extension to/from the viewer.
*/
'use strict';

var _av = Autodesk.Viewing;
var _ave = _av.Extension;
var _avemgr = _av.theExtensionManager;

/**
                                        * MoldflowExtension adds a legendbar and scalebar to the main viewer.
                                        * @constructor
                                        * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
                                        * @param {Autodesk.Viewing.Viewer3D} viewer - Viewer instance.
                                        * @param {Object} options - Not used.
                                        */

// define a const string to hold name of our extension.
var MoldflowExtString = 'Autodesk.Moldflow';

function MoldflowExtension(viewer, options) {
  _ave.call(this, viewer, options);
  //hook viewer events we are interested in.
  this.onGeometryLoaded = this.onGeometryLoaded.bind(this);
  this.onCameraChanged = this.onCameraChanged.bind(this);
};

MoldflowExtension.prototype = Object.create(_ave.prototype);
MoldflowExtension.prototype.constructor = MoldflowExtension;

/**
                                                              * Override load to create the legend and scale bars in the viewer.
                                                              */
MoldflowExtension.prototype.load = function () {
  var that = this;

  //make sure the model exists, then init base moldflow view elements upon result data.
  //otherwise, hook event to create it later.
  if (that.viewer.model) {
    that.initBaseMFView();
  } else {
    that.viewer.addEventListener(_av.GEOMETRY_LOADED_EVENT, that.onGeometryLoaded);
  }

  that.viewer.addEventListener(_av.CAMERA_CHANGE_EVENT, this.onCameraChanged);

  return true;
};


/**
    * Override unload to release whatever we created on this viewer.
    */
MoldflowExtension.prototype.unload = function () {
  var that = this;

  //Remove all Moldflow extension UI elements.
  if (that.legendContainer) {
    that.viewer.container.removeChild(that.legendContainer);
  }

  if (that.scalebarContainer) {
    that.viewer.container.removeChild(that.scalebarContainer);
  }

  return true;
};


/**
    * event hook when geometry loaded.
    */
MoldflowExtension.prototype.onGeometryLoaded = function () {
  this.viewer.removeEventListener(_av.GEOMETRY_LOADED_EVENT, self.onGeometryLoaded);
  self.onGometryLoaded = null;
  this.initBaseMFView();
};

var legendBarData = function legendBarData(title, unit, smooth, colourArr, labelArr) {
  this.title = title;
  this.unit = unit;
  this.smooth = smooth;
  this.colourArr = colourArr;
  this.labelArr = labelArr;
};


/**
    * create moldflow extension UI components.
    */
MoldflowExtension.prototype.initBaseMFView = function () {
  var that = this;

  var lbData = new legendBarData("", "", 0, 0, 0, [0]);

  // get legend bar control parameters. If not found, don't display legend bar.
  var pdb = that.viewer.model.getPropertyDb();

  // uses 'lbVer' as key value to determine search for table containing entries.
  pdb.findProperty('lbVer').then(function (myIdArr) {
    // if multiple database id's returned, use only last database.
    var j = myIdArr.length - 1;
    if (j === -1) return;
    {
      pdb.getProperties(myIdArr[j], function (result) {

        var rawRGBAStr = "";
        var rawRGBALen = 0;
        var rawLabelsStr = "";
        var rawLabelsLen = 0;

        for (var i = 0; i < result.properties.length; ++i) {
          var myProp = result.properties[i];
          switch (myProp.displayName) {
            case 'lbTitle':
              lbData.title = myProp.displayValue;
              break;
            case 'lbUnit':
              lbData.unit = myProp.displayValue;
              break;
            case 'lbRGBA':
              rawRGBAStr = myProp.displayValue;
              break;
            case 'lbRGBAcount':
              rawRGBALen = myProp.displayValue;
              break;
            case 'lbSmooth':
              lbData.smooth = myProp.displayValue;
              break;
            case 'lbLabels':
              rawLabelsStr = myProp.displayValue;
              break;
            case 'lbLabelCount':
              rawLabelsLen = myProp.displayValue;
              break;
            default:
              break;}

        }

        // convert RGB string to array.
        if (rawRGBALen != 0) {
          lbData.colourArr = new Array(rawRGBALen);
          lbData.colourArr = rawRGBAStr.split(',', rawRGBALen);
        }

        // Get the Label array.
        if (rawLabelsLen != 0) {
          lbData.labelArr = new Array(rawLabelsLen);
          lbData.labelArr = rawLabelsStr.split('&', rawLabelsLen);
        }

        that.createLegendBar(lbData);
      });
    }
  });

  // use 'sbVer' as key value to switch scale bar on
  pdb.findProperty('sbVer').then(function (myIdArr) {
    if (myIdArr.length <= 0)
    return;
    that.createScaleBar();
  });
};


/** -------------------------------------------------
    *
    * Legend Bar related variables/functions.
    *
    *  ------------------------------------------------- */

/**
                                                             * create legend colour bar.
                                                             */
MoldflowExtension.prototype.createLegendBar = function (lbData) {

  var _document = this.getDocument();
  //create colour legend container - with 2 elements: title + colour container
  var legendContainer = _document.createElement('div');
  legendContainer.classList.add('adsk-mf-legend-container');
  var legendTitle = _document.createElement('div');
  legendTitle.classList.add('adsk-mf-legend-title');
  var colourContainer = _document.createElement('div');
  colourContainer.classList.add('adsk-mf-legend-colour-container');

  // Set legend title
  if (!lbData.unit)
  lbData.unit = '';
  legendTitle.innerHTML = _av.i18n.translate(lbData.title + " " + lbData.unit);

  // colour container is split into two components: colour bar + label containers
  // Create either: a) smoothed colour bar b) banded colour bar
  if (lbData.smooth == true) {
    var smoothColourBar = _document.createElement('div');
    smoothColourBar.classList.add('adsk-mf-legend-colour-bar');
    var backgroundGradient = '';
    if (lbData.colourArr.length > 0) {
      backgroundGradient = "linear-gradient(to bottom";
      for (var i = lbData.colourArr.length - 1; i > -1; i--) {
        // Chrome understands rgba hex, Edge + IE11 DO NOT! Truncate hex rgba to std rgb
        backgroundGradient += ", " + lbData.colourArr[i].substring(0, 7);
      }
      backgroundGradient += ")";
    }
    smoothColourBar.style.background = backgroundGradient;
    colourContainer.appendChild(smoothColourBar);
  } else

  {// banded colour bar - reverse order to match definition
    var colourSegments = new Array(lbData.colourArr.length);
    var colourHeight = "calc(100%/" + lbData.colourArr.length + ")";
    var bandedColourBar = _document.createElement('div');
    bandedColourBar.classList.add('adsk-mf-legend-colour-bar');
    for (var j = lbData.colourArr.length - 1; j > -1; j--) {
      colourSegments[j] = _document.createElement('div');
      colourSegments[j].classList.add('adsk-mf-legend-colour-band');
      bandedColourBar.appendChild(colourSegments[j]);
      colourSegments[j].style.background = lbData.colourArr[j];
      colourSegments[j].style.height = colourHeight;
    }
    colourContainer.appendChild(bandedColourBar);
  }

  // Add labels to label container - in reverse order to match colour mapping.
  var labelContainer = _document.createElement('div');
  labelContainer.classList.add('adsk-mf-legend-label-container');
  var labels = new Array(lbData.labelArr.length);

  var labelHeight = "calc((100% - 20px)/" + (lbData.labelArr.length - 1) + ")";
  for (var k = lbData.labelArr.length - 1; k > -1; k--) {
    labels[k] = _document.createElement('div');
    labels[k].classList.add('adsk-mf-legend-label');
    labelContainer.appendChild(labels[k]);
    labels[k].innerHTML = lbData.labelArr[k];
    labels[k].style.height = labelHeight;
  }
  colourContainer.appendChild(labelContainer);

  // append constructed Title + colour containers to legend.
  legendContainer.appendChild(legendTitle);
  legendContainer.appendChild(colourContainer);

  this.viewer.container.appendChild(legendContainer);
};


/** -------------------------------------------------
    *
    * Scale Bar related variables/functions.
    *
    *  ------------------------------------------------- */

var previousScale = 1.0;
var maxRulerLen = 1000;
var numOfTicks = 1;

var pixcel2LenFactor = 2.5; // This is approximate and to be improved.


/**
 * event hook when camera changed.
 */
MoldflowExtension.prototype.onCameraChanged = function () {
  //TBD: what's the right way to compute the true scale of the viewer? 
  //
  var vec = this.viewer.navigation.getEyeToCenterOfBoundsVec(this.viewer.model.getBoundingBox());
  var scale = vec.length();
  if (previousScale == scale)
  return;else

  previousScale = scale;

  if (scale != 0.0)
  scale = 1.0 / scale;
  this.updateScaleBar(scale, "mm");
};

/**
    * create scale bar.
    */
MoldflowExtension.prototype.createScaleBar = function () {
  var _document = this.getDocument();
  //create scale bar.
  this.scalebarContainer = _document.createElement('div');
  this.scalebarContainer.classList.add('adsk-mf-scalebar');
  this.scalebarRuler = _document.createElement('div');
  this.scalebarRuler.classList.add('adsk-mf-scalebar-ruler');
  this.scalebarLabel = _document.createElement('div');
  this.scalebarLabel.classList.add('adsk-mf-scalebar-label');
  this.scalebarLabel.innerHTML = 'Scale(' + 100 + 'mm)'; //TODO: a fake default value.

  this.scalebarRulerTicks = [];
  for (var i = 0; i < 4; i++) {
    var divTick = _document.createElement('div');

    divTick.classList.add('adsk-mf-scalebar-tick');
    this.scalebarRulerTicks[i] = divTick;
    this.scalebarRuler.appendChild(divTick);
  }

  this.scalebarContainer.appendChild(this.scalebarRuler);
  this.scalebarContainer.appendChild(this.scalebarLabel);

  // Update scale before displaying.
  var scale = this.viewer.navigation.getEyeToCenterOfBoundsVec(this.viewer.model.getBoundingBox()).length();
  previousScale = scale;

  if (scale != 0.0)
  scale = 1.0 / scale;


  this.updateScaleBar(scale, "mm");

  // display
  this.viewer.container.appendChild(this.scalebarContainer);
};

/**
    * Update scale bar.
    */
MoldflowExtension.prototype.updateScaleBar = function (scale, unit) {

  var _document = this.getDocument();
  var maxLen = maxRulerLen / scale / pixcel2LenFactor;

  var precision = 1.0;
  var normlizedMaxLen = maxLen;
  while (normlizedMaxLen < 1 || normlizedMaxLen >= 10) {
    if (normlizedMaxLen < 1) {
      precision *= 0.1;
      normlizedMaxLen *= 10.0;
    } else if (normlizedMaxLen >= 10) {
      precision *= 10.0;
      normlizedMaxLen *= 0.1;
    }
  }

  numOfTicks = Math.floor(normlizedMaxLen);
  var rulerWidth = Math.floor(maxRulerLen / normlizedMaxLen) * numOfTicks;
  // can only update if the item is defined (asynchronous creation varies by browser)
  if (this.scalebarContainer != undefined) {
    this.scalebarContainer.style.width = rulerWidth + 'px';
    this.scalebarContainer.style.left = this.viewer.container.clientWidth / 2 - 0.5 * rulerWidth - 2 + 'px';
    var result = numOfTicks * precision;
    result = parseFloat(result.toPrecision(1));
    this.scalebarLabel.innerHTML = 'Scale(' + result + ' ' + unit + ')';

    this.scalebarRulerTicks = [];
    this.scalebarRuler.innerHTML = "";

    for (var i = 0; i < numOfTicks - 1; i++) {
      var divTick = _document.createElement('div');

      divTick.classList.add('adsk-mf-scalebar-tick');
      divTick.style.marginLeft = rulerWidth / numOfTicks - 2 + 'px';
      this.scalebarRulerTicks[i] = divTick;
      this.scalebarRuler.appendChild(divTick);
    }
  }
};

/**
    * Register the extension with the extension manager.
    */
_avemgr.registerExtension(MoldflowExtString, MoldflowExtension);

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/sass-loader/dist/cjs.js!./extensions/Moldflow/Moldflow.css":
/*!***********************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/sass-loader/dist/cjs.js!./extensions/Moldflow/Moldflow.css ***!
  \***********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".adsk-mf-legend-container {\n  top: calc(25%);\n  left: 20px;\n  height: calc(50%);\n  position: absolute;\n  min-height: 100px;\n  pointer-events: none; }\n\n.adsk-mf-legend-title {\n  height: 20px;\n  text-align: left;\n  color: black; }\n\n.adsk-mf-legend-colour-container {\n  display: inline-block;\n  position: relative;\n  height: calc(100% - 20px); }\n\n.adsk-mf-legend-colour-bar {\n  float: left;\n  width: 20px;\n  height: calc(100% - 16px);\n  margin: 7px 0 0 5px; }\n\n.adsk-mf-legend-colour-band {\n  width: 20px; }\n\n.adsk-mf-legend-label-container {\n  display: inline-block;\n  height: 100%;\n  position: relative; }\n\n.adsk-mf-legend-label {\n  text-align: left;\n  margin-left: 3px;\n  font-size: 14px;\n  white-space: nowrap;\n  color: black; }\n\n.adsk-mf-scalebar {\n  bottom: 60px;\n  height: 60px;\n  width: 400px;\n  left: calc(50% - 200px);\n  position: absolute;\n  pointer-events: none; }\n\n.adsk-mf-scalebar-ruler {\n  height: 25%;\n  width: 100%;\n  margin-left: auto;\n  margin-right: auto;\n  border-bottom: 2px solid gray;\n  border-left: 2px solid gray;\n  border-right: 2px solid gray;\n  margin-bottom: 5px; }\n\n.adsk-mf-scalebar-tick {\n  float: left;\n  width: 2px;\n  background: gray;\n  height: 100%;\n  margin-left: calc(20%); }\n\n.adsk-mf-scalebar-label {\n  height: 50%;\n  width: auto;\n  text-align: center;\n  font-size: 14px;\n  color: black; }\n", ""]);

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
//# sourceMappingURL=Moldflow.js.map