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

/***/ "./extensions/StringExtractor/StringHelpers.js":
/*!*****************************************************!*\
  !*** ./extensions/StringExtractor/StringHelpers.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _src_file_loaders_lmvtk_common_StringUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../src/file-loaders/lmvtk/common/StringUtils */ "./src/file-loaders/lmvtk/common/StringUtils.js");
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {_defineProperty(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * Format output from F2D myData object
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * @param {Object} data - myData object that contains strings and relevant bounding boxes
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * @returns {Array} strings - Array with String ojects. Each object contains text and bounding box as THREE.Box2.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             */
function loadStringsFromModel(data) {
  var formattedStrings = [];
  var anglesExist = data.stringAngles ? true : false;

  for (var i = 0; i < data.strings.length; i++) {
    var tempStringBox = data.stringBoxes.slice(i * 4, i * 4 + 4);
    var min = new THREE.Vector2(tempStringBox[0], tempStringBox[1]);
    var max = new THREE.Vector2(tempStringBox[2], tempStringBox[3]);
    var bBox = new THREE.Box2(min, max);
    var stringData = _objectSpread({
      string: data.strings[i],
      boundingBox: bBox,
      stringCharWidths: data.stringCharWidths[i],
      stringPosition: data.stringPositions[i],
      stringHeight: data.stringHeights[i] },
    data.stringWidths && { stringWidth: data.stringWidths[i] });


    // Add angle for text rotation if available
    if (anglesExist) {
      stringData.angle = data.stringAngles[i];
    }
    formattedStrings.push(stringData);
  }
  return formattedStrings;
}

/**
   * Performs string extraction from Leaflet PDF file
   * @returns {Object} return JSON object with all strings in Leaflet document.
   */
function loadLeafletStrings(model) {
  var role = 'pdf-strings';
  var bubble = model.getData().loadOptions.bubbleNode;
  var doc = model.getDocumentNode().getRootNode().getDocument();
  var nodes = bubble ? bubble.search({ role: role }) : null;

  if (!nodes || !nodes[0]) {
    return Promise.reject("Node for ".concat(role, " not found"));
  }

  return fetchLeafletStrings(nodes[0].urn(), nodes[0].guid(), doc).
  then(function (data) {
    var strings = data ? (0,_src_file_loaders_lmvtk_common_StringUtils__WEBPACK_IMPORTED_MODULE_0__.utf8BlobToStr)(data, 0, data.length) : null;
    return Promise.resolve(strings ? JSON.parse(strings) : null);
  }).
  catch(function (error) {
    return Promise.reject("No data in ".concat(role));
  });
}

/**
   * Format output from loadLeafletStrings, remove duplicated data from JSON as "text" item
   * @param {Object} model - model of loaded document
   * @param {Object} pdfStrings - JSON with all strings from Leaflet.
   * @returns {Array} formattedStrings - Array with String objects. Each object contains text and bounding box as THREE.Box2.
   */
function formatleafletStrings(model, leafletStrings) {
  var formattedStrings = [];
  var modelBBox = model.getBoundingBox(true);
  var size = modelBBox.size();
  // 10000 values are related Extractor where string’s bounding box is in a normalized space defined by 10000*10000
  // Relevant code in extractor repo: https://git.autodesk.com/BIM360/PDFExtractor/blob/3cdaa75fbc9fb80419b65073b17d2e7fb1357541/PDFExtractor/RasterExtractor/StringExtractor.cpp#L46
  var extractorScaleFactor = 10000;

  /**
                                     * Since there 2 sources of strings, ACC Build and BIM360,
                                     * A different formatting needed for those cases.
                                     */

  // Page dimension retrieval for ACC Build based strings
  if (leafletStrings.items) {
    leafletStrings = leafletStrings.items;
    for (var i = 0; i < leafletStrings.length; i++) {
      if (leafletStrings[i].text && leafletStrings[i].frame) {
        var p1X = leafletStrings[i].frame[0] * size.x;
        var p2X = leafletStrings[i].frame[2] * size.x;
        var p1Y = void 0;
        var p2Y = void 0;

        // Different calculation needed if fitPaperSize provided
        if (model.isPageCoordinates()) {
          p1Y = (1 - leafletStrings[i].frame[1]) * size.y;
          p2Y = (1 - leafletStrings[i].frame[3]) * size.y;
        } else {
          p1Y = 1 - leafletStrings[i].frame[1] * size.y;
          p2Y = 1 - leafletStrings[i].frame[3] * size.y;
        }

        var p1 = new THREE.Vector2(p1X, p1Y);
        var p2 = new THREE.Vector2(p2X, p2Y);
        var bBox = new THREE.Box2().setFromPoints([p1, p2]);

        formattedStrings.push({
          string: leafletStrings[i].text,
          boundingBox: bBox });

      }
    }
  } else {
    // Page dimension retrieval for BIM360-like OCR extraction
    var xUnit = size.x / extractorScaleFactor;
    var yUnit = size.y / extractorScaleFactor;

    for (var _i = 0; _i < leafletStrings.length; _i++) {
      var tempString = leafletStrings[_i];

      if (tempString.words) {
        for (var j = 0; j < tempString.words.length; j++) {
          var top = tempString.words[j].bbox.top;
          var height = tempString.words[j].bbox.height;
          var width = tempString.words[j].bbox.width;
          var left = tempString.words[j].bbox.left;

          var minX = modelBBox.min.x + left * xUnit;
          var minY = modelBBox.min.y + (extractorScaleFactor - top - height) * yUnit;
          var maxX = modelBBox.min.x + (left + width) * xUnit;
          var maxY = modelBBox.min.y + (extractorScaleFactor - top) * yUnit;

          var min = new THREE.Vector2(minX, minY);
          var max = new THREE.Vector2(maxX, maxY);
          var _bBox = new THREE.Box2(min, max);

          formattedStrings.push({
            string: tempString.words[j].text,
            boundingBox: _bBox });

        }
      }
    }
  }

  return formattedStrings;
}

/**
   * Intiate HTTP request to get strings from Leaflet file
   * @param {*} urn URN for Leaflet PDF document
   * @param {*} guid Sheet ID of Leaflet document
   * @param {*} doc document from rootNode
   */
function fetchLeafletStrings(urn, guid, doc) {
  var av = Autodesk.Viewing;
  var avp = av.Private;
  return new Promise(function (resolve, reject) {
    urn = doc.getFullPath(urn);
    var onSuccess = function onSuccess(response) {
      resolve(response);
    };

    var onFailure = function onFailure(error) {
      reject(error);
    };

    var acmSessionId = doc.getAcmSessionId(urn);

    var getItemOptions = {
      responseType: 'arraybuffer',
      skipAssetCallback: true,
      guid: encodeURIComponent(guid),
      acmsession: acmSessionId };


    var msg = {
      queryParams: acmSessionId ? 'acmsession=' + acmSessionId : '' };


    if (av.isOffline()) {
      urn = window.location.origin + '/' + urn;
    }
    avp.ViewingService.getItem(av.initLoadContext(msg), urn, onSuccess, onFailure, getItemOptions);
  });
}

var StringHelpers = {
  loadLeafletStrings: loadLeafletStrings,
  loadStringsFromModel: loadStringsFromModel,
  formatleafletStrings: formatleafletStrings };


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (StringHelpers);

/***/ }),

/***/ "./src/file-loaders/lmvtk/common/StringUtils.js":
/*!******************************************************!*\
  !*** ./src/file-loaders/lmvtk/common/StringUtils.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "utf8BlobToStr": () => (/* binding */ utf8BlobToStr),
/* harmony export */   "safeUtf8BlobToStr": () => (/* binding */ safeUtf8BlobToStr),
/* harmony export */   "utf16to8": () => (/* binding */ utf16to8),
/* harmony export */   "utf8ArrayToString": () => (/* binding */ utf8ArrayToString),
/* harmony export */   "blobToJson": () => (/* binding */ blobToJson),
/* harmony export */   "subBlobToJson": () => (/* binding */ subBlobToJson),
/* harmony export */   "subBlobToJsonInt": () => (/* binding */ subBlobToJsonInt),
/* harmony export */   "parseIntArray": () => (/* binding */ parseIntArray),
/* harmony export */   "findValueOffsets": () => (/* binding */ findValueOffsets)
/* harmony export */ });


// http://www.onicos.com/staff/iz/amuse/javascript/expert/utf.txt
/* utf.js - UTF-8 <=> UTF-16 convertion
 *
 * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
 * Version: 1.0
 * LastModified: Dec 25 1999
 * This library is free.  You can redistribute it and/or modify it.
 */
function utf8BlobToStr(array, start, length) {
  var out, i, len, c;
  var char2, char3;

  out = '';
  len = length;
  i = 0;
  while (i < len) {
    c = array[start + i++];
    switch (c >> 4) {

      case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[start + i++];
        out += String.fromCharCode((c & 0x1F) << 6 | char2 & 0x3F);
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[start + i++];
        char3 = array[start + i++];
        out += String.fromCharCode((c & 0x0F) << 12 |
        (char2 & 0x3F) << 6 |
        (char3 & 0x3F) << 0);
        break;}

  }

  return out;
}

/**
   * Safe version of utf8BlobToStr(), where Arrays are used to concatenate chars via join().
   * This function exists because string::operator += crashes on Chrome with large inputs.
   */
function safeUtf8BlobToStr(array, start, length) {
  var out, i, len, c, outArray, count;
  var char2, char3;

  var STR_CVT_LIMIT = 32 * 1024;
  out = '';
  outArray = [];
  len = length;
  count = 0;
  i = 0;
  while (i < len) {
    c = array[start + i++];
    switch (c >> 4) {

      case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
        // 0xxxxxxx
        outArray.push(String.fromCharCode(c));
        break;
      case 12:case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[start + i++];
        outArray.push(String.fromCharCode((c & 0x1F) << 6 | char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[start + i++];
        char3 = array[start + i++];
        outArray.push(String.fromCharCode((c & 0x0F) << 12 |
        (char2 & 0x3F) << 6 |
        (char3 & 0x3F) << 0));
        break;}

    if (++count >= STR_CVT_LIMIT || i >= len) {
      out += outArray.join("");
      outArray.length = 0;
      count = 0;
    }
  }

  return out;
}


function utf16to8(str, array, start) {
  var i, len, c;

  var j = start || 0;
  len = str.length;

  if (array) {
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if (c >= 0x0001 && c <= 0x007F) {
        array[j++] = c;
      } else if (c > 0x07FF) {
        array[j++] = 0xE0 | c >> 12 & 0x0F;
        array[j++] = 0x80 | c >> 6 & 0x3F;
        array[j++] = 0x80 | c >> 0 & 0x3F;
      } else {
        array[j++] = 0xC0 | c >> 6 & 0x1F;
        array[j++] = 0x80 | c >> 0 & 0x3F;
      }
    }
  } else {
    //If no output buffer is passed in, estimate the required
    //buffer size and return that.
    for (i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if (c >= 0x0001 && c <= 0x007F) {
        j++;
      } else if (c > 0x07FF) {
        j += 3;
      } else {
        j += 2;
      }
    }
  }

  return j - (start || 0);
}


var USE_MANUAL_UTF8 = true;
var SAFE_UTF_LENGTH = 1024 * 1024;

function utf8ArrayToString(array, start, length) {

  if (start === undefined)
  start = 0;
  if (length === undefined)
  length = array.length;

  if (USE_MANUAL_UTF8) {
    if (length > SAFE_UTF_LENGTH) {
      return safeUtf8BlobToStr(array, start, length);
    }
    return utf8BlobToStr(array, start, length);
  } else {
    var encodedString = "";
    for (var i = start, iEnd = start + length; i < iEnd; i++) {
      encodedString += String.fromCharCode(array[i]);}

    return decodeURIComponent(escape(encodedString));
  }
}

function blobToJson(blob) {

  var decodedString = utf8ArrayToString(blob, 0, blob.length);

  var regex = /\u000e/gi;
  // LMV-6005 Some blobs contained a Shift Out unicode character that could not be parsed by JSON.parse
  // This caused the property data base to not load.
  decodedString = decodedString.replace(regex, '');

  return JSON.parse(decodedString);
}

//parses a piece of json from a given blob (representing an array of json values)
//up to the next comma+newline combo (i.e. array delimiter).
function subBlobToJson(blob, startIndex) {
  if (startIndex === undefined) {
    return '';
  }

  var i = startIndex;

  while (i < blob.length - 1) {
    var c = blob[i];
    if (c == 44 && (blob[i + 1] == 10 || blob[i + 1] == 13)) //comma followed by newline?
      break;
    if (c == 10 || c == 13) //detect newline or line feed
      break;
    i++;
  }

  var decodedString = utf8ArrayToString(blob, startIndex, i - startIndex);
  try {
    return JSON.parse(decodedString);
  } catch (e) {
    console.error("Error parsing property blob to JSON : " + decodedString);
    return decodedString;
  }
}

function subBlobToJsonInt(blob, startIndex) {
  var val = 0;
  var i = startIndex;

  //Check for integers that were serialized as strings.
  //This should not happen, ever, but hey, it does.
  if (blob[i] == 34)
  i++;

  while (i < blob.length - 1) {
    var c = blob[i];
    if (c == 44 && (blob[i + 1] == 10 || blob[i + 1] == 13))
    break;
    if (c == 10 || c == 13 || c == 34)
    break;
    if (c >= 48 && c <= 57)
    val = val * 10 + (c - 48);

    i++;
  }

  return val;
}

//Simple integer array parse -- expects the array in property database
//format, where the array is packed with possibly newline separator,
//but no other white space. Does not do extensive error checking
function parseIntArray(blob, wantSentinel) {

  //find out how many items we have
  var count = 0;
  for (var i = 0, iEnd = blob.length; i < iEnd; i++) {
    if (blob[i] == 44) //44 = ','
      count++;}

  count++; //last item has no comma after it

  var items = new Uint32Array(count + (wantSentinel ? 1 : 0));

  i = 0;
  var end = blob.length;

  while (blob[i] != 91 && i < end) {//91 = '['
    i++;}

  if (i == blob.length)
  return null;

  i++;

  var seenDigit = false;
  count = 0;
  var curInt = 0;
  while (i < end) {
    var c = blob[i];
    if (c >= 48 && c <= 57) {//digit
      curInt = 10 * curInt + (c - 48);
      seenDigit = true;
    } else
    if (c == 44 || c == 93) {//',' or ']'
      if (seenDigit) {
        items[count++] = curInt;
        seenDigit = false;
        curInt = 0;
      }
    } else {
      seenDigit = false; //most likely a newline (the only other thing we have in our arrays
      curInt = 0;
    }
    i++;
  }

  return items;
}

//Scans an array of json values (strings, integers, doubles) and finds the
//offset of each value in the array, so that we can later pick off that
//specific value, without parsing the whole (potentially huge) json array up front.
//This expects the input blob to be in the form serialized by the property database
//C++ component -- one value per line. A more sophisticated parser would be needed
//in case the format changes and this assumption is not true anymore.
function findValueOffsets(blob) {

  //first, count how many items we have
  var count = 0;
  var end = blob.length - 1;

  for (var i = 0; i < end; i++) {
    if (blob[i] == 44 && (blob[i + 1] == 10 || blob[i + 1] == 13)) // ',' + newline is the item delimiter
      count++;
  }

  if (!count)
  return null;

  count++; //one for the last item

  var items = new Uint32Array(count);

  i = 0;
  count = 0;

  //find opening [
  while (blob[i] != 91 && i < end) {//91 = '['
    i++;}

  i++;

  items[count++] = i;
  var seenEol = false;
  while (i < end) {
    if (blob[i] == 10 || blob[i] == 13)
    seenEol = true;else
    if (seenEol) {
      seenEol = false;
      items[count++] = i;
    }

    i++;
  }

  return items;
}

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
/******/ 			// no module.id needed
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
/*!*******************************************************!*\
  !*** ./extensions/StringExtractor/StringExtractor.js ***!
  \*******************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ StringExtractor)
/* harmony export */ });
/* harmony import */ var _StringHelpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StringHelpers */ "./extensions/StringExtractor/StringHelpers.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {Promise.resolve(value).then(_next, _throw);}}function _asyncToGenerator(fn) {return function () {var self = this,args = arguments;return new Promise(function (resolve, reject) {var gen = fn.apply(self, args);function _next(value) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);}function _throw(err) {asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);}_next(undefined);});};}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}
'use strict';

var av = Autodesk.Viewing;
var myExtensionName = 'Autodesk.StringExtractor';var

StringExtractor = /*#__PURE__*/function (_av$Extension) {_inherits(StringExtractor, _av$Extension);var _super = _createSuper(StringExtractor);
  function StringExtractor(viewer, options) {var _this;_classCallCheck(this, StringExtractor);
    _this = _super.call(this, viewer, options);
    _this.documentStrings = {};
    _this.extractStringsFromModels = _this.extractStringsFromModels.bind(_assertThisInitialized(_this));return _this;
  }_createClass(StringExtractor, [{ key: "load", value: function () {var _load = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:


                // Since content of Viewer might change, as while switching sheets, string extraction repeated on every model load.
                this.viewer.addEventListener(av.MODEL_ROOT_LOADED_EVENT, this.extractStringsFromModels);
                this.viewer.addEventListener(av.GEOMETRY_LOADED_EVENT, this.extractStringsFromModels);return _context.abrupt("return",
                true);case 3:case "end":return _context.stop();}}}, _callee, this);}));function load() {return _load.apply(this, arguments);}return load;}() }, { key: "unload", value: function unload()


    {
      this.viewer.removeEventListener(av.MODEL_ROOT_LOADED_EVENT, this.extractStringsFromModels);
      this.viewer.removeEventListener(av.GEOMETRY_LOADED_EVENT, this.extractStringsFromModels);
      return true;
    }

    /**
       * Performs string extraction from all models in scene
       * @returns {Promise} Function returns a Promise with array of results all models in scene.
       */ }, { key: "extractStringsFromModels", value: function extractStringsFromModels()
    {
      var models = this.viewer.getVisibleModels();
      var promisesArray = [];
      var result;

      for (var i = 0; i < models.length; i++) {
        var model = models[i];

        result = this.extractStringsFromModel(model);
        promisesArray.push(result);
      }
      // promisesArray for all request for string extraction.
      return Promise.all(promisesArray);
    }

    /**
       * Performs string extraction from specific model
       * @param {Object} model - model within which string extraction performed.
       * @returns {Promise} Promise which is resolved when the data from F2D/Leaflet/PDF document by model type is fetched.
       */ }, { key: "extractStringsFromModel", value: function extractStringsFromModel(
    model) {var _this2 = this;
      // Do not extract strings if already cached
      // Do not fetch temporary leaflet data since vector will load 
      if (!model.isLoadDone() || !model.is2d() || this.documentStrings[model.id] || model.getData().underlayRaster) {
        return Promise.resolve();
      }

      if (model.isPdf()) {

        var vectorStrings = _StringHelpers__WEBPACK_IMPORTED_MODULE_0__["default"].loadStringsFromModel(model.getData());
        this.documentStrings[model.id] = {
          model: model,
          strings: vectorStrings };

        return Promise.resolve();
      } else
      if (model.isLeaflet()) {
        return _StringHelpers__WEBPACK_IMPORTED_MODULE_0__["default"].loadLeafletStrings(model).then(function (result) {
          _this2.documentStrings[model.id] = {
            model: model,
            strings: _StringHelpers__WEBPACK_IMPORTED_MODULE_0__["default"].formatleafletStrings(model, result) };

        });
      } else
      {
        var f2dStrings = _StringHelpers__WEBPACK_IMPORTED_MODULE_0__["default"].loadStringsFromModel(model.getData());
        this.documentStrings[model.id] = {
          model: model,
          strings: f2dStrings };

        return Promise.resolve();
      }
    }

    /**
       * @returns {Array} with all strings within scene by initiating String Extraction
       */ }, { key: "getDocumentStrings", value: function getDocumentStrings()
    {var _this3 = this;
      return this.extractStringsFromModels().then(function () {
        return Promise.resolve(_this3.documentStrings);
      });
    } }]);return StringExtractor;}(av.Extension);


av.theExtensionManager.registerExtension(myExtensionName, StringExtractor);
})();

Autodesk.Extensions.StringExtractor = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=StringExtractor.js.map