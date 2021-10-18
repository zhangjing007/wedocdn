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
/******/ 	var __webpack_modules__ = ({

/***/ "./extensions/MSDF/Generator.js":
/*!**************************************!*\
  !*** ./extensions/MSDF/Generator.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Generator": () => (/* binding */ Generator)
/* harmony export */ });
/* harmony import */ var maxrects_packer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! maxrects-packer */ "./node_modules/maxrects-packer/dist/maxrects-packer.mjs");
/* harmony import */ var opentype_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! opentype.js */ "./node_modules/opentype.js/dist/opentype.js");
/* harmony import */ var opentype_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(opentype_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var worker_loader_inline_GeneratorWorker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! worker-loader?inline!./GeneratorWorker */ "./node_modules/worker-loader/dist/cjs.js?inline!./extensions/MSDF/GeneratorWorker.js");
/* harmony import */ var worker_loader_inline_GeneratorWorker__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(worker_loader_inline_GeneratorWorker__WEBPACK_IMPORTED_MODULE_2__);
function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _iterableToArray(iter) {if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) return _arrayLikeToArray(arr);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}




var av = Autodesk.Viewing;

var Executer = function Executer(tasks) {var workerNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
  // do this job with workers

  var workers = [];
  var pendingTasks = tasks.length;
  var taskId = 0;

  this.execute = function () {var _this = this;
    if (tasks.length == 0) {
      return Promise.resolve([]);
    }

    var results = [];
    var promise = new Promise(function (resolve, reject) {
      for (var i = 0; i < workerNumber; i++) {
        var worker = new (worker_loader_inline_GeneratorWorker__WEBPACK_IMPORTED_MODULE_2___default())();
        workers.push(worker);
        worker.onmessage = function (event) {

          pendingTasks--;
          results.push(event.data);

          if (pendingTasks == 0) {
            resolve(results);
          }
        };
      }

      tasks.map(function (task) {
        var index = taskId++ % workerNumber;
        workers[index].postMessage(task);
      });
    });
    return promise.then(function (results) {
      _this.finish();
      return results;
    }).catch(console.error);
  };

  this.finish = function () {
    for (var i = 0; i < workerNumber; i++) {
      workers[i].terminate();
    }
  };
};

/**
    * Control Point for generate msdf-font-atlas
    * 
    */

var Generator = function Generator() {
  function locateChar(unicode, f1) {
    var chars = f1.data.toFontChar;
    var index = -1;
    for (var i = 0; i < chars.length; i++) {
      if (chars[i] == unicode) {
        index = i;
        break;
      }
    }
    if (f1.data.toUnicode._map) {
      return f1.data.toUnicode._map[index];
    }
  }

  var tasks = [];
  var outputData = {
    "pages": [],
    "chars": [],
    "charsMap": {},
    "info": [],
    "common": [],
    "distanceField": {},
    "kernings": [] };


  var infoIndex = 0;
  var commonIndex = 0;

  /**
                         * 
                         * @param {OpenType.Font} font 
                         * @param {PDFFontObj} pdfFontObj 
                         */
  this._prepare = function (font, pdfFontObj, option) {
    var charset = new Set();
    var fontSize = option.fontSize || 32;
    var range = option.range || 4;
    this.textureWidth = option.textureWidth || 1920;
    this.textureHeight = option.textureHeight || 1080;
    this.texturePadding = option.texturePadding || 4;

    var scale = fontSize / font.unitsPerEm;
    var currentInfoIndex = infoIndex++;
    var currentCommonIndex = commonIndex++;

    outputData.distanceField.fieldType = "msdf";
    outputData.distanceField.distanceRange = range;

    // Add font common info into the outputdata
    var os2 = font.tables.os2;
    var baseline = os2.sTypoAscender * (fontSize / font.unitsPerEm) + (range >> 1);
    var common = {
      "lineHeight": (os2.sTypoAscender - os2.sTypoDescender + os2.sTypoLineGap) * (fontSize / font.unitsPerEm),
      "base": baseline,
      "scaleW": this.textureWidth,
      "scaleH": this.textureHeight,
      "pages": 1,
      "packed": 0,
      "alphaChnl": 0,
      "redChnl": 0,
      "greenChnl": 0,
      "blueChnl": 0 };

    outputData.common.push(common);
    // var scaleSign = common. ? -1 : 1;

    var charectorSet = new Set();
    for (var key in font.glyphs.glyphs) {
      var glyph = font.glyphs.glyphs[key];
      var char = locateChar(glyph.unicode, pdfFontObj);
      var indexKey = "".concat(pdfFontObj.data.loadedName, "_").concat(String.fromCharCode(glyph.unicode));

      if (glyph.unicode != null && !charset.has(indexKey)) {
        var path = glyph.getPath(0, 0, fontSize, { xScale: scale, yScale: scale });
        var bounds = path.getBoundingBox();

        // if (char != '8') {
        //     continue;
        // }

        tasks.push({
          fontName: pdfFontObj.data.name,
          index: key,
          path: path,
          bounds: bounds,
          range: range,
          char: char,
          fontSize: fontSize,
          unicodes: glyph.unicodes.slice(0),
          info: currentInfoIndex,
          common: currentCommonIndex,
          advanceWidth: Math.round(glyph.advanceWidth * scale),
          unicode: glyph.unicode });


        charset.add(indexKey);
        charectorSet.add(glyph.unicode);
        charectorSet.add.apply(charectorSet, _toConsumableArray(glyph.unicodes));
      }
    }

    var info = {
      face: pdfFontObj.data.loadedName,
      fontname: pdfFontObj.data.name,
      size: fontSize,
      bold: 0,
      italic: 0,
      charset: Array.from(charectorSet).map(function (code) {return String.fromCharCode(code);}),
      unicode: 1,
      stretchH: 100,
      smooth: 1,
      aa: 1,
      padding: [0, 0, 0, 0],
      spacing: [0, 0],
      scale: scale };

    outputData.info.push(info);
  };

  this._execute = function execute(cacheKey) {var _this2 = this;
    var executer = new Executer(tasks);
    return executer.execute().then(function (results) {
      var packer = new maxrects_packer__WEBPACK_IMPORTED_MODULE_0__.MaxRectsPacker(_this2.textureWidth, _this2.textureHeight, _this2.texturePadding, {
        smart: true,
        pot: false,
        square: false,
        allowRotation: false,
        tag: false,
        border: 0 });


      if (outputData.bins) {
        packer.load(outputData.bins);
      }

      if (results.length > 0) {
        packer.addArray(results);
        results.length = 0;
        var binIndex = 0;

        packer.bins.forEach(function (bin) {
          var canvas = outputData.pages[binIndex];
          if (canvas == null) {
            var _document = _this2.getDocument();
            canvas = _document.createElement("canvas");
            outputData.pages.push(canvas);

            canvas.width = _this2.textureWidth;
            canvas.height = _this2.textureHeight;

            var _ctx = canvas.getContext("2d");

            _ctx.save();
            _ctx.fillStyle = "#000000";
            _ctx.fillRect(0, 0, canvas.width, canvas.height);
            _ctx.restore();
          }
          canvas.cacheKey = new Date().getTime();

          var ctx = canvas.getContext("2d");

          bin.rects.forEach(function (item) {
            if (item.image == undefined) {
              return;
            }

            var imageData = new ImageData(item.image.binData, item.image.width, item.image.height);

            ctx.putImageData(imageData, item.x, item.y);
            var charIndex = outputData.chars.length;
            outputData.chars.push({
              "index": item.index,
              "aschar": item.char,
              "width": item.width,
              "height": item.height,
              "inverseYAxis": item.inverseYAxis,
              "xoffset": item.charInfo.xOffset,
              "yoffset": item.charInfo.yOffset,
              "txoffset": item.charInfo.txOffset,
              "tyoffset": item.charInfo.tyOffset,
              "xadvance": item.advanceWidth,
              "chnl": 15,
              "x": item.x,
              "y": item.y,
              "page": binIndex,
              info: item.info,
              common: item.common,
              "unicode": item.unicode });

            item.unicodes.map(function (code) {
              if (!outputData.charsMap[item.fontName]) {
                outputData.charsMap[item.fontName] = {};
              }
              outputData.charsMap[item.fontName][code] = charIndex;
            });
          });

          // if(binIndex == 0) {
          //     canvas.toBlob((blob) => {
          //         let url = URL.createObjectURL(blob);
          //         window.open(url);
          //     }, "image/png");
          // }
          binIndex++;
        });
        var bins = packer.save();
        outputData.bins = bins;
        // console.log(JSON.stringify(outputData));
        _this2.saveCache(cacheKey, outputData);
        return outputData;
      }
      return outputData;
    });
  };

  this.getCacheKey = function (cacheKeyPrefix) {
    return "".concat(cacheKeyPrefix, "/pdf/fontAtlas/v0");
  };

  this.saveCache = function (cacheKey, data) {
    // need to convert the pages in the data to base64/png data
    var pages = data.pages;
    data.pages = data.pages.map(function (canvas) {return canvas.toDataURL("image/png");});
    Autodesk.Viewing.Private.LocalStorage.setItem(this.getCacheKey(cacheKey), JSON.stringify(data));

    // set the pages back
    data.pages = pages;
  };

  this.readCache = function (cacheKey) {var _this3 = this;
    // need to read pages base64/png data back to html canvas
    var data = Autodesk.Viewing.Private.LocalStorage.getItem(this.getCacheKey(cacheKey));
    if (data) {
      data = JSON.parse(data);
      if (data.pages && data.pages.length > 0) {
        var promises = [];var _loop = function _loop() {

          var item = data.pages[index];
          var _document = _this3.getDocument();
          var canvas = _document.createElement("canvas");
          canvas.width = data.common[index].scaleW;
          canvas.height = data.common[index].scaleH;

          var ctx = canvas.getContext("2d");
          ctx.save();
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          var image = new Image();
          image.src = item;
          promises.push(new Promise(function (resolve, reject) {
            image.onload = function () {
              ctx.drawImage(image, 0, 0);
              ctx.restore();
              resolve();
            };
          }));
          data.pages[index] = canvas;};for (var index = 0; index < data.pages.length; index++) {_loop();
        }

        return Promise.all(promises).then(function () {
          return data;
        });
      } else {
        return Promise.resolve(null);
      }
    } else {
      return Promise.resolve(null);
    }
  };

  this.createFontAtlasForPDF = function (page, cacheKey, option) {var _this4 = this;
    var fontSize = option ? option.fontSize : 48;
    var range = option ? option.range : 4;
    // console.time("PDF load time FontAtlas");

    return this.readCache(cacheKey).then(function (data) {
      // override current output data
      if (data) {
        outputData = data;
      }
    }).then(function () {
      return new Promise(function (resolve, reject) {
        function needLoad(name) {
          var needLoad = outputData.info.filter(function (item) {return item.fontname === name;}).length == 0;
          // if (needLoad) console.log("needLoad", name);
          return needLoad;
        }

        for (var fontKey in page.commonObjs._objs) {
          var f1 = page.commonObjs._objs[fontKey];
          if (f1.data && f1.data.loadedName && f1.data.fallbackName && f1.data.data && needLoad(f1.data.name)) {
            var font = opentype_js__WEBPACK_IMPORTED_MODULE_1__.parse(f1.data.data.buffer);
            // font.download();
            _this4._prepare(font, f1, { fontSize: fontSize, range: range });
          }
        }

        _this4._execute(cacheKey).then(function (fontAtlas) {
          // console.timeEnd("PDF load time FontAtlas");
          resolve(fontAtlas);
        }).catch(console.error).then(resolve);
      });
    });
  };
};

av.GlobalManagerMixin.call(Generator.prototype);





/***/ }),

/***/ "./node_modules/opentype.js/dist/opentype.js":
/*!***************************************************!*\
  !*** ./node_modules/opentype.js/dist/opentype.js ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

/**
 * https://opentype.js.org v0.9.0 | (c) Frederik De Bleser and other contributors | MIT License | Uses tiny-inflate by Devon Govett and string.prototype.codepointat polyfill by Mathias Bynens
 */

(function (global, factory) {
	 true ? factory(exports) :
	0;
}(this, (function (exports) { 'use strict';

	/*! https://mths.be/codepointat v0.2.0 by @mathias */
	if (!String.prototype.codePointAt) {
		(function() {
			var defineProperty = (function() {
				// IE 8 only supports `Object.defineProperty` on DOM elements
				try {
					var object = {};
					var $defineProperty = Object.defineProperty;
					var result = $defineProperty(object, object, object) && $defineProperty;
				} catch(error) {}
				return result;
			}());
			var codePointAt = function(position) {
				if (this == null) {
					throw TypeError();
				}
				var string = String(this);
				var size = string.length;
				// `ToInteger`
				var index = position ? Number(position) : 0;
				if (index != index) { // better `isNaN`
					index = 0;
				}
				// Account for out-of-bounds indices:
				if (index < 0 || index >= size) {
					return undefined;
				}
				// Get the first code unit
				var first = string.charCodeAt(index);
				var second;
				if ( // check if it’s the start of a surrogate pair
					first >= 0xD800 && first <= 0xDBFF && // high surrogate
					size > index + 1 // there is a next code unit
				) {
					second = string.charCodeAt(index + 1);
					if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
						// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
						return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
					}
				}
				return first;
			};
			if (defineProperty) {
				defineProperty(String.prototype, 'codePointAt', {
					'value': codePointAt,
					'configurable': true,
					'writable': true
				});
			} else {
				String.prototype.codePointAt = codePointAt;
			}
		}());
	}

	var TINF_OK = 0;
	var TINF_DATA_ERROR = -3;

	function Tree() {
	  this.table = new Uint16Array(16);   /* table of code length counts */
	  this.trans = new Uint16Array(288);  /* code -> symbol translation table */
	}

	function Data(source, dest) {
	  this.source = source;
	  this.sourceIndex = 0;
	  this.tag = 0;
	  this.bitcount = 0;
	  
	  this.dest = dest;
	  this.destLen = 0;
	  
	  this.ltree = new Tree();  /* dynamic length/symbol tree */
	  this.dtree = new Tree();  /* dynamic distance tree */
	}

	/* --------------------------------------------------- *
	 * -- uninitialized global data (static structures) -- *
	 * --------------------------------------------------- */

	var sltree = new Tree();
	var sdtree = new Tree();

	/* extra bits and base tables for length codes */
	var length_bits = new Uint8Array(30);
	var length_base = new Uint16Array(30);

	/* extra bits and base tables for distance codes */
	var dist_bits = new Uint8Array(30);
	var dist_base = new Uint16Array(30);

	/* special ordering of code length codes */
	var clcidx = new Uint8Array([
	  16, 17, 18, 0, 8, 7, 9, 6,
	  10, 5, 11, 4, 12, 3, 13, 2,
	  14, 1, 15
	]);

	/* used by tinf_decode_trees, avoids allocations every call */
	var code_tree = new Tree();
	var lengths = new Uint8Array(288 + 32);

	/* ----------------------- *
	 * -- utility functions -- *
	 * ----------------------- */

	/* build extra bits and base tables */
	function tinf_build_bits_base(bits, base, delta, first) {
	  var i, sum;

	  /* build bits table */
	  for (i = 0; i < delta; ++i) { bits[i] = 0; }
	  for (i = 0; i < 30 - delta; ++i) { bits[i + delta] = i / delta | 0; }

	  /* build base table */
	  for (sum = first, i = 0; i < 30; ++i) {
	    base[i] = sum;
	    sum += 1 << bits[i];
	  }
	}

	/* build the fixed huffman trees */
	function tinf_build_fixed_trees(lt, dt) {
	  var i;

	  /* build fixed length tree */
	  for (i = 0; i < 7; ++i) { lt.table[i] = 0; }

	  lt.table[7] = 24;
	  lt.table[8] = 152;
	  lt.table[9] = 112;

	  for (i = 0; i < 24; ++i) { lt.trans[i] = 256 + i; }
	  for (i = 0; i < 144; ++i) { lt.trans[24 + i] = i; }
	  for (i = 0; i < 8; ++i) { lt.trans[24 + 144 + i] = 280 + i; }
	  for (i = 0; i < 112; ++i) { lt.trans[24 + 144 + 8 + i] = 144 + i; }

	  /* build fixed distance tree */
	  for (i = 0; i < 5; ++i) { dt.table[i] = 0; }

	  dt.table[5] = 32;

	  for (i = 0; i < 32; ++i) { dt.trans[i] = i; }
	}

	/* given an array of code lengths, build a tree */
	var offs = new Uint16Array(16);

	function tinf_build_tree(t, lengths, off, num) {
	  var i, sum;

	  /* clear code length count table */
	  for (i = 0; i < 16; ++i) { t.table[i] = 0; }

	  /* scan symbol lengths, and sum code length counts */
	  for (i = 0; i < num; ++i) { t.table[lengths[off + i]]++; }

	  t.table[0] = 0;

	  /* compute offset table for distribution sort */
	  for (sum = 0, i = 0; i < 16; ++i) {
	    offs[i] = sum;
	    sum += t.table[i];
	  }

	  /* create code->symbol translation table (symbols sorted by code) */
	  for (i = 0; i < num; ++i) {
	    if (lengths[off + i]) { t.trans[offs[lengths[off + i]]++] = i; }
	  }
	}

	/* ---------------------- *
	 * -- decode functions -- *
	 * ---------------------- */

	/* get one bit from source stream */
	function tinf_getbit(d) {
	  /* check if tag is empty */
	  if (!d.bitcount--) {
	    /* load next tag */
	    d.tag = d.source[d.sourceIndex++];
	    d.bitcount = 7;
	  }

	  /* shift bit out of tag */
	  var bit = d.tag & 1;
	  d.tag >>>= 1;

	  return bit;
	}

	/* read a num bit value from a stream and add base */
	function tinf_read_bits(d, num, base) {
	  if (!num)
	    { return base; }

	  while (d.bitcount < 24) {
	    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
	    d.bitcount += 8;
	  }

	  var val = d.tag & (0xffff >>> (16 - num));
	  d.tag >>>= num;
	  d.bitcount -= num;
	  return val + base;
	}

	/* given a data stream and a tree, decode a symbol */
	function tinf_decode_symbol(d, t) {
	  while (d.bitcount < 24) {
	    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
	    d.bitcount += 8;
	  }
	  
	  var sum = 0, cur = 0, len = 0;
	  var tag = d.tag;

	  /* get more bits while code value is above sum */
	  do {
	    cur = 2 * cur + (tag & 1);
	    tag >>>= 1;
	    ++len;

	    sum += t.table[len];
	    cur -= t.table[len];
	  } while (cur >= 0);
	  
	  d.tag = tag;
	  d.bitcount -= len;

	  return t.trans[sum + cur];
	}

	/* given a data stream, decode dynamic trees from it */
	function tinf_decode_trees(d, lt, dt) {
	  var hlit, hdist, hclen;
	  var i, num, length;

	  /* get 5 bits HLIT (257-286) */
	  hlit = tinf_read_bits(d, 5, 257);

	  /* get 5 bits HDIST (1-32) */
	  hdist = tinf_read_bits(d, 5, 1);

	  /* get 4 bits HCLEN (4-19) */
	  hclen = tinf_read_bits(d, 4, 4);

	  for (i = 0; i < 19; ++i) { lengths[i] = 0; }

	  /* read code lengths for code length alphabet */
	  for (i = 0; i < hclen; ++i) {
	    /* get 3 bits code length (0-7) */
	    var clen = tinf_read_bits(d, 3, 0);
	    lengths[clcidx[i]] = clen;
	  }

	  /* build code length tree */
	  tinf_build_tree(code_tree, lengths, 0, 19);

	  /* decode code lengths for the dynamic trees */
	  for (num = 0; num < hlit + hdist;) {
	    var sym = tinf_decode_symbol(d, code_tree);

	    switch (sym) {
	      case 16:
	        /* copy previous code length 3-6 times (read 2 bits) */
	        var prev = lengths[num - 1];
	        for (length = tinf_read_bits(d, 2, 3); length; --length) {
	          lengths[num++] = prev;
	        }
	        break;
	      case 17:
	        /* repeat code length 0 for 3-10 times (read 3 bits) */
	        for (length = tinf_read_bits(d, 3, 3); length; --length) {
	          lengths[num++] = 0;
	        }
	        break;
	      case 18:
	        /* repeat code length 0 for 11-138 times (read 7 bits) */
	        for (length = tinf_read_bits(d, 7, 11); length; --length) {
	          lengths[num++] = 0;
	        }
	        break;
	      default:
	        /* values 0-15 represent the actual code lengths */
	        lengths[num++] = sym;
	        break;
	    }
	  }

	  /* build dynamic trees */
	  tinf_build_tree(lt, lengths, 0, hlit);
	  tinf_build_tree(dt, lengths, hlit, hdist);
	}

	/* ----------------------------- *
	 * -- block inflate functions -- *
	 * ----------------------------- */

	/* given a stream and two trees, inflate a block of data */
	function tinf_inflate_block_data(d, lt, dt) {
	  while (1) {
	    var sym = tinf_decode_symbol(d, lt);

	    /* check for end of block */
	    if (sym === 256) {
	      return TINF_OK;
	    }

	    if (sym < 256) {
	      d.dest[d.destLen++] = sym;
	    } else {
	      var length, dist, offs;
	      var i;

	      sym -= 257;

	      /* possibly get more bits from length code */
	      length = tinf_read_bits(d, length_bits[sym], length_base[sym]);

	      dist = tinf_decode_symbol(d, dt);

	      /* possibly get more bits from distance code */
	      offs = d.destLen - tinf_read_bits(d, dist_bits[dist], dist_base[dist]);

	      /* copy match */
	      for (i = offs; i < offs + length; ++i) {
	        d.dest[d.destLen++] = d.dest[i];
	      }
	    }
	  }
	}

	/* inflate an uncompressed block of data */
	function tinf_inflate_uncompressed_block(d) {
	  var length, invlength;
	  var i;
	  
	  /* unread from bitbuffer */
	  while (d.bitcount > 8) {
	    d.sourceIndex--;
	    d.bitcount -= 8;
	  }

	  /* get length */
	  length = d.source[d.sourceIndex + 1];
	  length = 256 * length + d.source[d.sourceIndex];

	  /* get one's complement of length */
	  invlength = d.source[d.sourceIndex + 3];
	  invlength = 256 * invlength + d.source[d.sourceIndex + 2];

	  /* check length */
	  if (length !== (~invlength & 0x0000ffff))
	    { return TINF_DATA_ERROR; }

	  d.sourceIndex += 4;

	  /* copy block */
	  for (i = length; i; --i)
	    { d.dest[d.destLen++] = d.source[d.sourceIndex++]; }

	  /* make sure we start next block on a byte boundary */
	  d.bitcount = 0;

	  return TINF_OK;
	}

	/* inflate stream from source to dest */
	function tinf_uncompress(source, dest) {
	  var d = new Data(source, dest);
	  var bfinal, btype, res;

	  do {
	    /* read final block flag */
	    bfinal = tinf_getbit(d);

	    /* read block type (2 bits) */
	    btype = tinf_read_bits(d, 2, 0);

	    /* decompress block */
	    switch (btype) {
	      case 0:
	        /* decompress uncompressed block */
	        res = tinf_inflate_uncompressed_block(d);
	        break;
	      case 1:
	        /* decompress block with fixed huffman trees */
	        res = tinf_inflate_block_data(d, sltree, sdtree);
	        break;
	      case 2:
	        /* decompress block with dynamic huffman trees */
	        tinf_decode_trees(d, d.ltree, d.dtree);
	        res = tinf_inflate_block_data(d, d.ltree, d.dtree);
	        break;
	      default:
	        res = TINF_DATA_ERROR;
	    }

	    if (res !== TINF_OK)
	      { throw new Error('Data error'); }

	  } while (!bfinal);

	  if (d.destLen < d.dest.length) {
	    if (typeof d.dest.slice === 'function')
	      { return d.dest.slice(0, d.destLen); }
	    else
	      { return d.dest.subarray(0, d.destLen); }
	  }
	  
	  return d.dest;
	}

	/* -------------------- *
	 * -- initialization -- *
	 * -------------------- */

	/* build fixed huffman trees */
	tinf_build_fixed_trees(sltree, sdtree);

	/* build extra bits and base tables */
	tinf_build_bits_base(length_bits, length_base, 4, 3);
	tinf_build_bits_base(dist_bits, dist_base, 2, 1);

	/* fix a special case */
	length_bits[28] = 0;
	length_base[28] = 258;

	var tinyInflate = tinf_uncompress;

	// The Bounding Box object

	function derive(v0, v1, v2, v3, t) {
	    return Math.pow(1 - t, 3) * v0 +
	        3 * Math.pow(1 - t, 2) * t * v1 +
	        3 * (1 - t) * Math.pow(t, 2) * v2 +
	        Math.pow(t, 3) * v3;
	}
	/**
	 * A bounding box is an enclosing box that describes the smallest measure within which all the points lie.
	 * It is used to calculate the bounding box of a glyph or text path.
	 *
	 * On initialization, x1/y1/x2/y2 will be NaN. Check if the bounding box is empty using `isEmpty()`.
	 *
	 * @exports opentype.BoundingBox
	 * @class
	 * @constructor
	 */
	function BoundingBox() {
	    this.x1 = Number.NaN;
	    this.y1 = Number.NaN;
	    this.x2 = Number.NaN;
	    this.y2 = Number.NaN;
	}

	/**
	 * Returns true if the bounding box is empty, that is, no points have been added to the box yet.
	 */
	BoundingBox.prototype.isEmpty = function() {
	    return isNaN(this.x1) || isNaN(this.y1) || isNaN(this.x2) || isNaN(this.y2);
	};

	/**
	 * Add the point to the bounding box.
	 * The x1/y1/x2/y2 coordinates of the bounding box will now encompass the given point.
	 * @param {number} x - The X coordinate of the point.
	 * @param {number} y - The Y coordinate of the point.
	 */
	BoundingBox.prototype.addPoint = function(x, y) {
	    if (typeof x === 'number') {
	        if (isNaN(this.x1) || isNaN(this.x2)) {
	            this.x1 = x;
	            this.x2 = x;
	        }
	        if (x < this.x1) {
	            this.x1 = x;
	        }
	        if (x > this.x2) {
	            this.x2 = x;
	        }
	    }
	    if (typeof y === 'number') {
	        if (isNaN(this.y1) || isNaN(this.y2)) {
	            this.y1 = y;
	            this.y2 = y;
	        }
	        if (y < this.y1) {
	            this.y1 = y;
	        }
	        if (y > this.y2) {
	            this.y2 = y;
	        }
	    }
	};

	/**
	 * Add a X coordinate to the bounding box.
	 * This extends the bounding box to include the X coordinate.
	 * This function is used internally inside of addBezier.
	 * @param {number} x - The X coordinate of the point.
	 */
	BoundingBox.prototype.addX = function(x) {
	    this.addPoint(x, null);
	};

	/**
	 * Add a Y coordinate to the bounding box.
	 * This extends the bounding box to include the Y coordinate.
	 * This function is used internally inside of addBezier.
	 * @param {number} y - The Y coordinate of the point.
	 */
	BoundingBox.prototype.addY = function(y) {
	    this.addPoint(null, y);
	};

	/**
	 * Add a Bézier curve to the bounding box.
	 * This extends the bounding box to include the entire Bézier.
	 * @param {number} x0 - The starting X coordinate.
	 * @param {number} y0 - The starting Y coordinate.
	 * @param {number} x1 - The X coordinate of the first control point.
	 * @param {number} y1 - The Y coordinate of the first control point.
	 * @param {number} x2 - The X coordinate of the second control point.
	 * @param {number} y2 - The Y coordinate of the second control point.
	 * @param {number} x - The ending X coordinate.
	 * @param {number} y - The ending Y coordinate.
	 */
	BoundingBox.prototype.addBezier = function(x0, y0, x1, y1, x2, y2, x, y) {
	    var this$1 = this;

	    // This code is based on http://nishiohirokazu.blogspot.com/2009/06/how-to-calculate-bezier-curves-bounding.html
	    // and https://github.com/icons8/svg-path-bounding-box

	    var p0 = [x0, y0];
	    var p1 = [x1, y1];
	    var p2 = [x2, y2];
	    var p3 = [x, y];

	    this.addPoint(x0, y0);
	    this.addPoint(x, y);

	    for (var i = 0; i <= 1; i++) {
	        var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
	        var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
	        var c = 3 * p1[i] - 3 * p0[i];

	        if (a === 0) {
	            if (b === 0) { continue; }
	            var t = -c / b;
	            if (0 < t && t < 1) {
	                if (i === 0) { this$1.addX(derive(p0[i], p1[i], p2[i], p3[i], t)); }
	                if (i === 1) { this$1.addY(derive(p0[i], p1[i], p2[i], p3[i], t)); }
	            }
	            continue;
	        }

	        var b2ac = Math.pow(b, 2) - 4 * c * a;
	        if (b2ac < 0) { continue; }
	        var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
	        if (0 < t1 && t1 < 1) {
	            if (i === 0) { this$1.addX(derive(p0[i], p1[i], p2[i], p3[i], t1)); }
	            if (i === 1) { this$1.addY(derive(p0[i], p1[i], p2[i], p3[i], t1)); }
	        }
	        var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
	        if (0 < t2 && t2 < 1) {
	            if (i === 0) { this$1.addX(derive(p0[i], p1[i], p2[i], p3[i], t2)); }
	            if (i === 1) { this$1.addY(derive(p0[i], p1[i], p2[i], p3[i], t2)); }
	        }
	    }
	};

	/**
	 * Add a quadratic curve to the bounding box.
	 * This extends the bounding box to include the entire quadratic curve.
	 * @param {number} x0 - The starting X coordinate.
	 * @param {number} y0 - The starting Y coordinate.
	 * @param {number} x1 - The X coordinate of the control point.
	 * @param {number} y1 - The Y coordinate of the control point.
	 * @param {number} x - The ending X coordinate.
	 * @param {number} y - The ending Y coordinate.
	 */
	BoundingBox.prototype.addQuad = function(x0, y0, x1, y1, x, y) {
	    var cp1x = x0 + 2 / 3 * (x1 - x0);
	    var cp1y = y0 + 2 / 3 * (y1 - y0);
	    var cp2x = cp1x + 1 / 3 * (x - x0);
	    var cp2y = cp1y + 1 / 3 * (y - y0);
	    this.addBezier(x0, y0, cp1x, cp1y, cp2x, cp2y, x, y);
	};

	// Geometric objects

	/**
	 * A bézier path containing a set of path commands similar to a SVG path.
	 * Paths can be drawn on a context using `draw`.
	 * @exports opentype.Path
	 * @class
	 * @constructor
	 */
	function Path() {
	    this.commands = [];
	    this.fill = 'black';
	    this.stroke = null;
	    this.strokeWidth = 1;
	}

	/**
	 * @param  {number} x
	 * @param  {number} y
	 */
	Path.prototype.moveTo = function(x, y) {
	    this.commands.push({
	        type: 'M',
	        x: x,
	        y: y
	    });
	};

	/**
	 * @param  {number} x
	 * @param  {number} y
	 */
	Path.prototype.lineTo = function(x, y) {
	    this.commands.push({
	        type: 'L',
	        x: x,
	        y: y
	    });
	};

	/**
	 * Draws cubic curve
	 * @function
	 * curveTo
	 * @memberof opentype.Path.prototype
	 * @param  {number} x1 - x of control 1
	 * @param  {number} y1 - y of control 1
	 * @param  {number} x2 - x of control 2
	 * @param  {number} y2 - y of control 2
	 * @param  {number} x - x of path point
	 * @param  {number} y - y of path point
	 */

	/**
	 * Draws cubic curve
	 * @function
	 * bezierCurveTo
	 * @memberof opentype.Path.prototype
	 * @param  {number} x1 - x of control 1
	 * @param  {number} y1 - y of control 1
	 * @param  {number} x2 - x of control 2
	 * @param  {number} y2 - y of control 2
	 * @param  {number} x - x of path point
	 * @param  {number} y - y of path point
	 * @see curveTo
	 */
	Path.prototype.curveTo = Path.prototype.bezierCurveTo = function(x1, y1, x2, y2, x, y) {
	    this.commands.push({
	        type: 'C',
	        x1: x1,
	        y1: y1,
	        x2: x2,
	        y2: y2,
	        x: x,
	        y: y
	    });
	};

	/**
	 * Draws quadratic curve
	 * @function
	 * quadraticCurveTo
	 * @memberof opentype.Path.prototype
	 * @param  {number} x1 - x of control
	 * @param  {number} y1 - y of control
	 * @param  {number} x - x of path point
	 * @param  {number} y - y of path point
	 */

	/**
	 * Draws quadratic curve
	 * @function
	 * quadTo
	 * @memberof opentype.Path.prototype
	 * @param  {number} x1 - x of control
	 * @param  {number} y1 - y of control
	 * @param  {number} x - x of path point
	 * @param  {number} y - y of path point
	 */
	Path.prototype.quadTo = Path.prototype.quadraticCurveTo = function(x1, y1, x, y) {
	    this.commands.push({
	        type: 'Q',
	        x1: x1,
	        y1: y1,
	        x: x,
	        y: y
	    });
	};

	/**
	 * Closes the path
	 * @function closePath
	 * @memberof opentype.Path.prototype
	 */

	/**
	 * Close the path
	 * @function close
	 * @memberof opentype.Path.prototype
	 */
	Path.prototype.close = Path.prototype.closePath = function() {
	    this.commands.push({
	        type: 'Z'
	    });
	};

	/**
	 * Add the given path or list of commands to the commands of this path.
	 * @param  {Array} pathOrCommands - another opentype.Path, an opentype.BoundingBox, or an array of commands.
	 */
	Path.prototype.extend = function(pathOrCommands) {
	    if (pathOrCommands.commands) {
	        pathOrCommands = pathOrCommands.commands;
	    } else if (pathOrCommands instanceof BoundingBox) {
	        var box = pathOrCommands;
	        this.moveTo(box.x1, box.y1);
	        this.lineTo(box.x2, box.y1);
	        this.lineTo(box.x2, box.y2);
	        this.lineTo(box.x1, box.y2);
	        this.close();
	        return;
	    }

	    Array.prototype.push.apply(this.commands, pathOrCommands);
	};

	/**
	 * Calculate the bounding box of the path.
	 * @returns {opentype.BoundingBox}
	 */
	Path.prototype.getBoundingBox = function() {
	    var this$1 = this;

	    var box = new BoundingBox();

	    var startX = 0;
	    var startY = 0;
	    var prevX = 0;
	    var prevY = 0;
	    for (var i = 0; i < this.commands.length; i++) {
	        var cmd = this$1.commands[i];
	        switch (cmd.type) {
	            case 'M':
	                box.addPoint(cmd.x, cmd.y);
	                startX = prevX = cmd.x;
	                startY = prevY = cmd.y;
	                break;
	            case 'L':
	                box.addPoint(cmd.x, cmd.y);
	                prevX = cmd.x;
	                prevY = cmd.y;
	                break;
	            case 'Q':
	                box.addQuad(prevX, prevY, cmd.x1, cmd.y1, cmd.x, cmd.y);
	                prevX = cmd.x;
	                prevY = cmd.y;
	                break;
	            case 'C':
	                box.addBezier(prevX, prevY, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
	                prevX = cmd.x;
	                prevY = cmd.y;
	                break;
	            case 'Z':
	                prevX = startX;
	                prevY = startY;
	                break;
	            default:
	                throw new Error('Unexpected path command ' + cmd.type);
	        }
	    }
	    if (box.isEmpty()) {
	        box.addPoint(0, 0);
	    }
	    return box;
	};

	/**
	 * Draw the path to a 2D context.
	 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context.
	 */
	Path.prototype.draw = function(ctx) {
	    var this$1 = this;

	    ctx.beginPath();
	    for (var i = 0; i < this.commands.length; i += 1) {
	        var cmd = this$1.commands[i];
	        if (cmd.type === 'M') {
	            ctx.moveTo(cmd.x, cmd.y);
	        } else if (cmd.type === 'L') {
	            ctx.lineTo(cmd.x, cmd.y);
	        } else if (cmd.type === 'C') {
	            ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
	        } else if (cmd.type === 'Q') {
	            ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
	        } else if (cmd.type === 'Z') {
	            ctx.closePath();
	        }
	    }

	    if (this.fill) {
	        ctx.fillStyle = this.fill;
	        ctx.fill();
	    }

	    if (this.stroke) {
	        ctx.strokeStyle = this.stroke;
	        ctx.lineWidth = this.strokeWidth;
	        ctx.stroke();
	    }
	};

	/**
	 * Convert the Path to a string of path data instructions
	 * See http://www.w3.org/TR/SVG/paths.html#PathData
	 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
	 * @return {string}
	 */
	Path.prototype.toPathData = function(decimalPlaces) {
	    var this$1 = this;

	    decimalPlaces = decimalPlaces !== undefined ? decimalPlaces : 2;

	    function floatToString(v) {
	        if (Math.round(v) === v) {
	            return '' + Math.round(v);
	        } else {
	            return v.toFixed(decimalPlaces);
	        }
	    }

	    function packValues() {
	        var arguments$1 = arguments;

	        var s = '';
	        for (var i = 0; i < arguments.length; i += 1) {
	            var v = arguments$1[i];
	            if (v >= 0 && i > 0) {
	                s += ' ';
	            }

	            s += floatToString(v);
	        }

	        return s;
	    }

	    var d = '';
	    for (var i = 0; i < this.commands.length; i += 1) {
	        var cmd = this$1.commands[i];
	        if (cmd.type === 'M') {
	            d += 'M' + packValues(cmd.x, cmd.y);
	        } else if (cmd.type === 'L') {
	            d += 'L' + packValues(cmd.x, cmd.y);
	        } else if (cmd.type === 'C') {
	            d += 'C' + packValues(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
	        } else if (cmd.type === 'Q') {
	            d += 'Q' + packValues(cmd.x1, cmd.y1, cmd.x, cmd.y);
	        } else if (cmd.type === 'Z') {
	            d += 'Z';
	        }
	    }

	    return d;
	};

	/**
	 * Convert the path to an SVG <path> element, as a string.
	 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
	 * @return {string}
	 */
	Path.prototype.toSVG = function(decimalPlaces) {
	    var svg = '<path d="';
	    svg += this.toPathData(decimalPlaces);
	    svg += '"';
	    if (this.fill && this.fill !== 'black') {
	        if (this.fill === null) {
	            svg += ' fill="none"';
	        } else {
	            svg += ' fill="' + this.fill + '"';
	        }
	    }

	    if (this.stroke) {
	        svg += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"';
	    }

	    svg += '/>';
	    return svg;
	};

	/**
	 * Convert the path to a DOM element.
	 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
	 * @return {SVGPathElement}
	 */
	Path.prototype.toDOMElement = function(decimalPlaces) {
	    var temporaryPath = this.toPathData(decimalPlaces);
	    var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

	    newPath.setAttribute('d', temporaryPath);

	    return newPath;
	};

	// Run-time checking of preconditions.

	function fail(message) {
	    throw new Error(message);
	}

	// Precondition function that checks if the given predicate is true.
	// If not, it will throw an error.
	function argument(predicate, message) {
	    if (!predicate) {
	        fail(message);
	    }
	}
	var check = { fail: fail, argument: argument, assert: argument };

	// Data types used in the OpenType font file.

	var LIMIT16 = 32768; // The limit at which a 16-bit number switches signs == 2^15
	var LIMIT32 = 2147483648; // The limit at which a 32-bit number switches signs == 2 ^ 31

	/**
	 * @exports opentype.decode
	 * @class
	 */
	var decode = {};
	/**
	 * @exports opentype.encode
	 * @class
	 */
	var encode = {};
	/**
	 * @exports opentype.sizeOf
	 * @class
	 */
	var sizeOf = {};

	// Return a function that always returns the same value.
	function constant(v) {
	    return function() {
	        return v;
	    };
	}

	// OpenType data types //////////////////////////////////////////////////////

	/**
	 * Convert an 8-bit unsigned integer to a list of 1 byte.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.BYTE = function(v) {
	    check.argument(v >= 0 && v <= 255, 'Byte value should be between 0 and 255.');
	    return [v];
	};
	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.BYTE = constant(1);

	/**
	 * Convert a 8-bit signed integer to a list of 1 byte.
	 * @param {string}
	 * @returns {Array}
	 */
	encode.CHAR = function(v) {
	    return [v.charCodeAt(0)];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.CHAR = constant(1);

	/**
	 * Convert an ASCII string to a list of bytes.
	 * @param {string}
	 * @returns {Array}
	 */
	encode.CHARARRAY = function(v) {
	    var b = [];
	    for (var i = 0; i < v.length; i += 1) {
	        b[i] = v.charCodeAt(i);
	    }

	    return b;
	};

	/**
	 * @param {Array}
	 * @returns {number}
	 */
	sizeOf.CHARARRAY = function(v) {
	    return v.length;
	};

	/**
	 * Convert a 16-bit unsigned integer to a list of 2 bytes.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.USHORT = function(v) {
	    return [(v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.USHORT = constant(2);

	/**
	 * Convert a 16-bit signed integer to a list of 2 bytes.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.SHORT = function(v) {
	    // Two's complement
	    if (v >= LIMIT16) {
	        v = -(2 * LIMIT16 - v);
	    }

	    return [(v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.SHORT = constant(2);

	/**
	 * Convert a 24-bit unsigned integer to a list of 3 bytes.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.UINT24 = function(v) {
	    return [(v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.UINT24 = constant(3);

	/**
	 * Convert a 32-bit unsigned integer to a list of 4 bytes.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.ULONG = function(v) {
	    return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.ULONG = constant(4);

	/**
	 * Convert a 32-bit unsigned integer to a list of 4 bytes.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.LONG = function(v) {
	    // Two's complement
	    if (v >= LIMIT32) {
	        v = -(2 * LIMIT32 - v);
	    }

	    return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.LONG = constant(4);

	encode.FIXED = encode.ULONG;
	sizeOf.FIXED = sizeOf.ULONG;

	encode.FWORD = encode.SHORT;
	sizeOf.FWORD = sizeOf.SHORT;

	encode.UFWORD = encode.USHORT;
	sizeOf.UFWORD = sizeOf.USHORT;

	/**
	 * Convert a 32-bit Apple Mac timestamp integer to a list of 8 bytes, 64-bit timestamp.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.LONGDATETIME = function(v) {
	    return [0, 0, 0, 0, (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.LONGDATETIME = constant(8);

	/**
	 * Convert a 4-char tag to a list of 4 bytes.
	 * @param {string}
	 * @returns {Array}
	 */
	encode.TAG = function(v) {
	    check.argument(v.length === 4, 'Tag should be exactly 4 ASCII characters.');
	    return [v.charCodeAt(0),
	            v.charCodeAt(1),
	            v.charCodeAt(2),
	            v.charCodeAt(3)];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.TAG = constant(4);

	// CFF data types ///////////////////////////////////////////////////////////

	encode.Card8 = encode.BYTE;
	sizeOf.Card8 = sizeOf.BYTE;

	encode.Card16 = encode.USHORT;
	sizeOf.Card16 = sizeOf.USHORT;

	encode.OffSize = encode.BYTE;
	sizeOf.OffSize = sizeOf.BYTE;

	encode.SID = encode.USHORT;
	sizeOf.SID = sizeOf.USHORT;

	// Convert a numeric operand or charstring number to a variable-size list of bytes.
	/**
	 * Convert a numeric operand or charstring number to a variable-size list of bytes.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.NUMBER = function(v) {
	    if (v >= -107 && v <= 107) {
	        return [v + 139];
	    } else if (v >= 108 && v <= 1131) {
	        v = v - 108;
	        return [(v >> 8) + 247, v & 0xFF];
	    } else if (v >= -1131 && v <= -108) {
	        v = -v - 108;
	        return [(v >> 8) + 251, v & 0xFF];
	    } else if (v >= -32768 && v <= 32767) {
	        return encode.NUMBER16(v);
	    } else {
	        return encode.NUMBER32(v);
	    }
	};

	/**
	 * @param {number}
	 * @returns {number}
	 */
	sizeOf.NUMBER = function(v) {
	    return encode.NUMBER(v).length;
	};

	/**
	 * Convert a signed number between -32768 and +32767 to a three-byte value.
	 * This ensures we always use three bytes, but is not the most compact format.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.NUMBER16 = function(v) {
	    return [28, (v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.NUMBER16 = constant(3);

	/**
	 * Convert a signed number between -(2^31) and +(2^31-1) to a five-byte value.
	 * This is useful if you want to be sure you always use four bytes,
	 * at the expense of wasting a few bytes for smaller numbers.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.NUMBER32 = function(v) {
	    return [29, (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.NUMBER32 = constant(5);

	/**
	 * @param {number}
	 * @returns {Array}
	 */
	encode.REAL = function(v) {
	    var value = v.toString();

	    // Some numbers use an epsilon to encode the value. (e.g. JavaScript will store 0.0000001 as 1e-7)
	    // This code converts it back to a number without the epsilon.
	    var m = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(value);
	    if (m) {
	        var epsilon = parseFloat('1e' + ((m[2] ? +m[2] : 0) + m[1].length));
	        value = (Math.round(v * epsilon) / epsilon).toString();
	    }

	    var nibbles = '';
	    for (var i = 0, ii = value.length; i < ii; i += 1) {
	        var c = value[i];
	        if (c === 'e') {
	            nibbles += value[++i] === '-' ? 'c' : 'b';
	        } else if (c === '.') {
	            nibbles += 'a';
	        } else if (c === '-') {
	            nibbles += 'e';
	        } else {
	            nibbles += c;
	        }
	    }

	    nibbles += (nibbles.length & 1) ? 'f' : 'ff';
	    var out = [30];
	    for (var i$1 = 0, ii$1 = nibbles.length; i$1 < ii$1; i$1 += 2) {
	        out.push(parseInt(nibbles.substr(i$1, 2), 16));
	    }

	    return out;
	};

	/**
	 * @param {number}
	 * @returns {number}
	 */
	sizeOf.REAL = function(v) {
	    return encode.REAL(v).length;
	};

	encode.NAME = encode.CHARARRAY;
	sizeOf.NAME = sizeOf.CHARARRAY;

	encode.STRING = encode.CHARARRAY;
	sizeOf.STRING = sizeOf.CHARARRAY;

	/**
	 * @param {DataView} data
	 * @param {number} offset
	 * @param {number} numBytes
	 * @returns {string}
	 */
	decode.UTF8 = function(data, offset, numBytes) {
	    var codePoints = [];
	    var numChars = numBytes;
	    for (var j = 0; j < numChars; j++, offset += 1) {
	        codePoints[j] = data.getUint8(offset);
	    }

	    return String.fromCharCode.apply(null, codePoints);
	};

	/**
	 * @param {DataView} data
	 * @param {number} offset
	 * @param {number} numBytes
	 * @returns {string}
	 */
	decode.UTF16 = function(data, offset, numBytes) {
	    var codePoints = [];
	    var numChars = numBytes / 2;
	    for (var j = 0; j < numChars; j++, offset += 2) {
	        codePoints[j] = data.getUint16(offset);
	    }

	    return String.fromCharCode.apply(null, codePoints);
	};

	/**
	 * Convert a JavaScript string to UTF16-BE.
	 * @param {string}
	 * @returns {Array}
	 */
	encode.UTF16 = function(v) {
	    var b = [];
	    for (var i = 0; i < v.length; i += 1) {
	        var codepoint = v.charCodeAt(i);
	        b[b.length] = (codepoint >> 8) & 0xFF;
	        b[b.length] = codepoint & 0xFF;
	    }

	    return b;
	};

	/**
	 * @param {string}
	 * @returns {number}
	 */
	sizeOf.UTF16 = function(v) {
	    return v.length * 2;
	};

	// Data for converting old eight-bit Macintosh encodings to Unicode.
	// This representation is optimized for decoding; encoding is slower
	// and needs more memory. The assumption is that all opentype.js users
	// want to open fonts, but saving a font will be comparatively rare
	// so it can be more expensive. Keyed by IANA character set name.
	//
	// Python script for generating these strings:
	//
	//     s = u''.join([chr(c).decode('mac_greek') for c in range(128, 256)])
	//     print(s.encode('utf-8'))
	/**
	 * @private
	 */
	var eightBitMacEncodings = {
	    'x-mac-croatian':  // Python: 'mac_croatian'
	    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø' +
	    '¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ',
	    'x-mac-cyrillic':  // Python: 'mac_cyrillic'
	    'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњ' +
	    'јЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю',
	    'x-mac-gaelic': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
	    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæø' +
	    'ṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ',
	    'x-mac-greek':  // Python: 'mac_greek'
	    'Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩ' +
	    'άΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ\u00AD',
	    'x-mac-icelandic':  // Python: 'mac_iceland'
	    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
	    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
	    'x-mac-inuit': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
	    'ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗ' +
	    'ᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł',
	    'x-mac-ce':  // Python: 'mac_latin2'
	    'ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅ' +
	    'ņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ',
	    macintosh:  // Python: 'mac_roman'
	    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
	    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
	    'x-mac-romanian':  // Python: 'mac_romanian'
	    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș' +
	    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
	    'x-mac-turkish':  // Python: 'mac_turkish'
	    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
	    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ'
	};

	/**
	 * Decodes an old-style Macintosh string. Returns either a Unicode JavaScript
	 * string, or 'undefined' if the encoding is unsupported. For example, we do
	 * not support Chinese, Japanese or Korean because these would need large
	 * mapping tables.
	 * @param {DataView} dataView
	 * @param {number} offset
	 * @param {number} dataLength
	 * @param {string} encoding
	 * @returns {string}
	 */
	decode.MACSTRING = function(dataView, offset, dataLength, encoding) {
	    var table = eightBitMacEncodings[encoding];
	    if (table === undefined) {
	        return undefined;
	    }

	    var result = '';
	    for (var i = 0; i < dataLength; i++) {
	        var c = dataView.getUint8(offset + i);
	        // In all eight-bit Mac encodings, the characters 0x00..0x7F are
	        // mapped to U+0000..U+007F; we only need to look up the others.
	        if (c <= 0x7F) {
	            result += String.fromCharCode(c);
	        } else {
	            result += table[c & 0x7F];
	        }
	    }

	    return result;
	};

	// Helper function for encode.MACSTRING. Returns a dictionary for mapping
	// Unicode character codes to their 8-bit MacOS equivalent. This table
	// is not exactly a super cheap data structure, but we do not care because
	// encoding Macintosh strings is only rarely needed in typical applications.
	var macEncodingTableCache = typeof WeakMap === 'function' && new WeakMap();
	var macEncodingCacheKeys;
	var getMacEncodingTable = function (encoding) {
	    // Since we use encoding as a cache key for WeakMap, it has to be
	    // a String object and not a literal. And at least on NodeJS 2.10.1,
	    // WeakMap requires that the same String instance is passed for cache hits.
	    if (!macEncodingCacheKeys) {
	        macEncodingCacheKeys = {};
	        for (var e in eightBitMacEncodings) {
	            /*jshint -W053 */  // Suppress "Do not use String as a constructor."
	            macEncodingCacheKeys[e] = new String(e);
	        }
	    }

	    var cacheKey = macEncodingCacheKeys[encoding];
	    if (cacheKey === undefined) {
	        return undefined;
	    }

	    // We can't do "if (cache.has(key)) {return cache.get(key)}" here:
	    // since garbage collection may run at any time, it could also kick in
	    // between the calls to cache.has() and cache.get(). In that case,
	    // we would return 'undefined' even though we do support the encoding.
	    if (macEncodingTableCache) {
	        var cachedTable = macEncodingTableCache.get(cacheKey);
	        if (cachedTable !== undefined) {
	            return cachedTable;
	        }
	    }

	    var decodingTable = eightBitMacEncodings[encoding];
	    if (decodingTable === undefined) {
	        return undefined;
	    }

	    var encodingTable = {};
	    for (var i = 0; i < decodingTable.length; i++) {
	        encodingTable[decodingTable.charCodeAt(i)] = i + 0x80;
	    }

	    if (macEncodingTableCache) {
	        macEncodingTableCache.set(cacheKey, encodingTable);
	    }

	    return encodingTable;
	};

	/**
	 * Encodes an old-style Macintosh string. Returns a byte array upon success.
	 * If the requested encoding is unsupported, or if the input string contains
	 * a character that cannot be expressed in the encoding, the function returns
	 * 'undefined'.
	 * @param {string} str
	 * @param {string} encoding
	 * @returns {Array}
	 */
	encode.MACSTRING = function(str, encoding) {
	    var table = getMacEncodingTable(encoding);
	    if (table === undefined) {
	        return undefined;
	    }

	    var result = [];
	    for (var i = 0; i < str.length; i++) {
	        var c = str.charCodeAt(i);

	        // In all eight-bit Mac encodings, the characters 0x00..0x7F are
	        // mapped to U+0000..U+007F; we only need to look up the others.
	        if (c >= 0x80) {
	            c = table[c];
	            if (c === undefined) {
	                // str contains a Unicode character that cannot be encoded
	                // in the requested encoding.
	                return undefined;
	            }
	        }
	        result[i] = c;
	        // result.push(c);
	    }

	    return result;
	};

	/**
	 * @param {string} str
	 * @param {string} encoding
	 * @returns {number}
	 */
	sizeOf.MACSTRING = function(str, encoding) {
	    var b = encode.MACSTRING(str, encoding);
	    if (b !== undefined) {
	        return b.length;
	    } else {
	        return 0;
	    }
	};

	// Helper for encode.VARDELTAS
	function isByteEncodable(value) {
	    return value >= -128 && value <= 127;
	}

	// Helper for encode.VARDELTAS
	function encodeVarDeltaRunAsZeroes(deltas, pos, result) {
	    var runLength = 0;
	    var numDeltas = deltas.length;
	    while (pos < numDeltas && runLength < 64 && deltas[pos] === 0) {
	        ++pos;
	        ++runLength;
	    }
	    result.push(0x80 | (runLength - 1));
	    return pos;
	}

	// Helper for encode.VARDELTAS
	function encodeVarDeltaRunAsBytes(deltas, offset, result) {
	    var runLength = 0;
	    var numDeltas = deltas.length;
	    var pos = offset;
	    while (pos < numDeltas && runLength < 64) {
	        var value = deltas[pos];
	        if (!isByteEncodable(value)) {
	            break;
	        }

	        // Within a byte-encoded run of deltas, a single zero is best
	        // stored literally as 0x00 value. However, if we have two or
	        // more zeroes in a sequence, it is better to start a new run.
	        // Fore example, the sequence of deltas [15, 15, 0, 15, 15]
	        // becomes 6 bytes (04 0F 0F 00 0F 0F) when storing the zero
	        // within the current run, but 7 bytes (01 0F 0F 80 01 0F 0F)
	        // when starting a new run.
	        if (value === 0 && pos + 1 < numDeltas && deltas[pos + 1] === 0) {
	            break;
	        }

	        ++pos;
	        ++runLength;
	    }
	    result.push(runLength - 1);
	    for (var i = offset; i < pos; ++i) {
	        result.push((deltas[i] + 256) & 0xff);
	    }
	    return pos;
	}

	// Helper for encode.VARDELTAS
	function encodeVarDeltaRunAsWords(deltas, offset, result) {
	    var runLength = 0;
	    var numDeltas = deltas.length;
	    var pos = offset;
	    while (pos < numDeltas && runLength < 64) {
	        var value = deltas[pos];

	        // Within a word-encoded run of deltas, it is easiest to start
	        // a new run (with a different encoding) whenever we encounter
	        // a zero value. For example, the sequence [0x6666, 0, 0x7777]
	        // needs 7 bytes when storing the zero inside the current run
	        // (42 66 66 00 00 77 77), and equally 7 bytes when starting a
	        // new run (40 66 66 80 40 77 77).
	        if (value === 0) {
	            break;
	        }

	        // Within a word-encoded run of deltas, a single value in the
	        // range (-128..127) should be encoded within the current run
	        // because it is more compact. For example, the sequence
	        // [0x6666, 2, 0x7777] becomes 7 bytes when storing the value
	        // literally (42 66 66 00 02 77 77), but 8 bytes when starting
	        // a new run (40 66 66 00 02 40 77 77).
	        if (isByteEncodable(value) && pos + 1 < numDeltas && isByteEncodable(deltas[pos + 1])) {
	            break;
	        }

	        ++pos;
	        ++runLength;
	    }
	    result.push(0x40 | (runLength - 1));
	    for (var i = offset; i < pos; ++i) {
	        var val = deltas[i];
	        result.push(((val + 0x10000) >> 8) & 0xff, (val + 0x100) & 0xff);
	    }
	    return pos;
	}

	/**
	 * Encode a list of variation adjustment deltas.
	 *
	 * Variation adjustment deltas are used in ‘gvar’ and ‘cvar’ tables.
	 * They indicate how points (in ‘gvar’) or values (in ‘cvar’) get adjusted
	 * when generating instances of variation fonts.
	 *
	 * @see https://www.microsoft.com/typography/otspec/gvar.htm
	 * @see https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6gvar.html
	 * @param {Array}
	 * @return {Array}
	 */
	encode.VARDELTAS = function(deltas) {
	    var pos = 0;
	    var result = [];
	    while (pos < deltas.length) {
	        var value = deltas[pos];
	        if (value === 0) {
	            pos = encodeVarDeltaRunAsZeroes(deltas, pos, result);
	        } else if (value >= -128 && value <= 127) {
	            pos = encodeVarDeltaRunAsBytes(deltas, pos, result);
	        } else {
	            pos = encodeVarDeltaRunAsWords(deltas, pos, result);
	        }
	    }
	    return result;
	};

	// Convert a list of values to a CFF INDEX structure.
	// The values should be objects containing name / type / value.
	/**
	 * @param {Array} l
	 * @returns {Array}
	 */
	encode.INDEX = function(l) {
	    //var offset, offsets, offsetEncoder, encodedOffsets, encodedOffset, data,
	    //    i, v;
	    // Because we have to know which data type to use to encode the offsets,
	    // we have to go through the values twice: once to encode the data and
	    // calculate the offsets, then again to encode the offsets using the fitting data type.
	    var offset = 1; // First offset is always 1.
	    var offsets = [offset];
	    var data = [];
	    for (var i = 0; i < l.length; i += 1) {
	        var v = encode.OBJECT(l[i]);
	        Array.prototype.push.apply(data, v);
	        offset += v.length;
	        offsets.push(offset);
	    }

	    if (data.length === 0) {
	        return [0, 0];
	    }

	    var encodedOffsets = [];
	    var offSize = (1 + Math.floor(Math.log(offset) / Math.log(2)) / 8) | 0;
	    var offsetEncoder = [undefined, encode.BYTE, encode.USHORT, encode.UINT24, encode.ULONG][offSize];
	    for (var i$1 = 0; i$1 < offsets.length; i$1 += 1) {
	        var encodedOffset = offsetEncoder(offsets[i$1]);
	        Array.prototype.push.apply(encodedOffsets, encodedOffset);
	    }

	    return Array.prototype.concat(encode.Card16(l.length),
	                           encode.OffSize(offSize),
	                           encodedOffsets,
	                           data);
	};

	/**
	 * @param {Array}
	 * @returns {number}
	 */
	sizeOf.INDEX = function(v) {
	    return encode.INDEX(v).length;
	};

	/**
	 * Convert an object to a CFF DICT structure.
	 * The keys should be numeric.
	 * The values should be objects containing name / type / value.
	 * @param {Object} m
	 * @returns {Array}
	 */
	encode.DICT = function(m) {
	    var d = [];
	    var keys = Object.keys(m);
	    var length = keys.length;

	    for (var i = 0; i < length; i += 1) {
	        // Object.keys() return string keys, but our keys are always numeric.
	        var k = parseInt(keys[i], 0);
	        var v = m[k];
	        // Value comes before the key.
	        d = d.concat(encode.OPERAND(v.value, v.type));
	        d = d.concat(encode.OPERATOR(k));
	    }

	    return d;
	};

	/**
	 * @param {Object}
	 * @returns {number}
	 */
	sizeOf.DICT = function(m) {
	    return encode.DICT(m).length;
	};

	/**
	 * @param {number}
	 * @returns {Array}
	 */
	encode.OPERATOR = function(v) {
	    if (v < 1200) {
	        return [v];
	    } else {
	        return [12, v - 1200];
	    }
	};

	/**
	 * @param {Array} v
	 * @param {string}
	 * @returns {Array}
	 */
	encode.OPERAND = function(v, type) {
	    var d = [];
	    if (Array.isArray(type)) {
	        for (var i = 0; i < type.length; i += 1) {
	            check.argument(v.length === type.length, 'Not enough arguments given for type' + type);
	            d = d.concat(encode.OPERAND(v[i], type[i]));
	        }
	    } else {
	        if (type === 'SID') {
	            d = d.concat(encode.NUMBER(v));
	        } else if (type === 'offset') {
	            // We make it easy for ourselves and always encode offsets as
	            // 4 bytes. This makes offset calculation for the top dict easier.
	            d = d.concat(encode.NUMBER32(v));
	        } else if (type === 'number') {
	            d = d.concat(encode.NUMBER(v));
	        } else if (type === 'real') {
	            d = d.concat(encode.REAL(v));
	        } else {
	            throw new Error('Unknown operand type ' + type);
	            // FIXME Add support for booleans
	        }
	    }

	    return d;
	};

	encode.OP = encode.BYTE;
	sizeOf.OP = sizeOf.BYTE;

	// memoize charstring encoding using WeakMap if available
	var wmm = typeof WeakMap === 'function' && new WeakMap();

	/**
	 * Convert a list of CharString operations to bytes.
	 * @param {Array}
	 * @returns {Array}
	 */
	encode.CHARSTRING = function(ops) {
	    // See encode.MACSTRING for why we don't do "if (wmm && wmm.has(ops))".
	    if (wmm) {
	        var cachedValue = wmm.get(ops);
	        if (cachedValue !== undefined) {
	            return cachedValue;
	        }
	    }

	    var d = [];
	    var length = ops.length;

	    for (var i = 0; i < length; i += 1) {
	        var op = ops[i];
	        d = d.concat(encode[op.type](op.value));
	    }

	    if (wmm) {
	        wmm.set(ops, d);
	    }

	    return d;
	};

	/**
	 * @param {Array}
	 * @returns {number}
	 */
	sizeOf.CHARSTRING = function(ops) {
	    return encode.CHARSTRING(ops).length;
	};

	// Utility functions ////////////////////////////////////////////////////////

	/**
	 * Convert an object containing name / type / value to bytes.
	 * @param {Object}
	 * @returns {Array}
	 */
	encode.OBJECT = function(v) {
	    var encodingFunction = encode[v.type];
	    check.argument(encodingFunction !== undefined, 'No encoding function for type ' + v.type);
	    return encodingFunction(v.value);
	};

	/**
	 * @param {Object}
	 * @returns {number}
	 */
	sizeOf.OBJECT = function(v) {
	    var sizeOfFunction = sizeOf[v.type];
	    check.argument(sizeOfFunction !== undefined, 'No sizeOf function for type ' + v.type);
	    return sizeOfFunction(v.value);
	};

	/**
	 * Convert a table object to bytes.
	 * A table contains a list of fields containing the metadata (name, type and default value).
	 * The table itself has the field values set as attributes.
	 * @param {opentype.Table}
	 * @returns {Array}
	 */
	encode.TABLE = function(table) {
	    var d = [];
	    var length = table.fields.length;
	    var subtables = [];
	    var subtableOffsets = [];

	    for (var i = 0; i < length; i += 1) {
	        var field = table.fields[i];
	        var encodingFunction = encode[field.type];
	        check.argument(encodingFunction !== undefined, 'No encoding function for field type ' + field.type + ' (' + field.name + ')');
	        var value = table[field.name];
	        if (value === undefined) {
	            value = field.value;
	        }

	        var bytes = encodingFunction(value);

	        if (field.type === 'TABLE') {
	            subtableOffsets.push(d.length);
	            d = d.concat([0, 0]);
	            subtables.push(bytes);
	        } else {
	            d = d.concat(bytes);
	        }
	    }

	    for (var i$1 = 0; i$1 < subtables.length; i$1 += 1) {
	        var o = subtableOffsets[i$1];
	        var offset = d.length;
	        check.argument(offset < 65536, 'Table ' + table.tableName + ' too big.');
	        d[o] = offset >> 8;
	        d[o + 1] = offset & 0xff;
	        d = d.concat(subtables[i$1]);
	    }

	    return d;
	};

	/**
	 * @param {opentype.Table}
	 * @returns {number}
	 */
	sizeOf.TABLE = function(table) {
	    var numBytes = 0;
	    var length = table.fields.length;

	    for (var i = 0; i < length; i += 1) {
	        var field = table.fields[i];
	        var sizeOfFunction = sizeOf[field.type];
	        check.argument(sizeOfFunction !== undefined, 'No sizeOf function for field type ' + field.type + ' (' + field.name + ')');
	        var value = table[field.name];
	        if (value === undefined) {
	            value = field.value;
	        }

	        numBytes += sizeOfFunction(value);

	        // Subtables take 2 more bytes for offsets.
	        if (field.type === 'TABLE') {
	            numBytes += 2;
	        }
	    }

	    return numBytes;
	};

	encode.RECORD = encode.TABLE;
	sizeOf.RECORD = sizeOf.TABLE;

	// Merge in a list of bytes.
	encode.LITERAL = function(v) {
	    return v;
	};

	sizeOf.LITERAL = function(v) {
	    return v.length;
	};

	// Table metadata

	/**
	 * @exports opentype.Table
	 * @class
	 * @param {string} tableName
	 * @param {Array} fields
	 * @param {Object} options
	 * @constructor
	 */
	function Table(tableName, fields, options) {
	    var this$1 = this;

	    for (var i = 0; i < fields.length; i += 1) {
	        var field = fields[i];
	        this$1[field.name] = field.value;
	    }

	    this.tableName = tableName;
	    this.fields = fields;
	    if (options) {
	        var optionKeys = Object.keys(options);
	        for (var i$1 = 0; i$1 < optionKeys.length; i$1 += 1) {
	            var k = optionKeys[i$1];
	            var v = options[k];
	            if (this$1[k] !== undefined) {
	                this$1[k] = v;
	            }
	        }
	    }
	}

	/**
	 * Encodes the table and returns an array of bytes
	 * @return {Array}
	 */
	Table.prototype.encode = function() {
	    return encode.TABLE(this);
	};

	/**
	 * Get the size of the table.
	 * @return {number}
	 */
	Table.prototype.sizeOf = function() {
	    return sizeOf.TABLE(this);
	};

	/**
	 * @private
	 */
	function ushortList(itemName, list, count) {
	    if (count === undefined) {
	        count = list.length;
	    }
	    var fields = new Array(list.length + 1);
	    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
	    for (var i = 0; i < list.length; i++) {
	        fields[i + 1] = {name: itemName + i, type: 'USHORT', value: list[i]};
	    }
	    return fields;
	}

	/**
	 * @private
	 */
	function tableList(itemName, records, itemCallback) {
	    var count = records.length;
	    var fields = new Array(count + 1);
	    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
	    for (var i = 0; i < count; i++) {
	        fields[i + 1] = {name: itemName + i, type: 'TABLE', value: itemCallback(records[i], i)};
	    }
	    return fields;
	}

	/**
	 * @private
	 */
	function recordList(itemName, records, itemCallback) {
	    var count = records.length;
	    var fields = [];
	    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
	    for (var i = 0; i < count; i++) {
	        fields = fields.concat(itemCallback(records[i], i));
	    }
	    return fields;
	}

	// Common Layout Tables

	/**
	 * @exports opentype.Coverage
	 * @class
	 * @param {opentype.Table}
	 * @constructor
	 * @extends opentype.Table
	 */
	function Coverage(coverageTable) {
	    if (coverageTable.format === 1) {
	        Table.call(this, 'coverageTable',
	            [{name: 'coverageFormat', type: 'USHORT', value: 1}]
	            .concat(ushortList('glyph', coverageTable.glyphs))
	        );
	    } else {
	        check.assert(false, 'Can\'t create coverage table format 2 yet.');
	    }
	}
	Coverage.prototype = Object.create(Table.prototype);
	Coverage.prototype.constructor = Coverage;

	function ScriptList(scriptListTable) {
	    Table.call(this, 'scriptListTable',
	        recordList('scriptRecord', scriptListTable, function(scriptRecord, i) {
	            var script = scriptRecord.script;
	            var defaultLangSys = script.defaultLangSys;
	            check.assert(!!defaultLangSys, 'Unable to write GSUB: script ' + scriptRecord.tag + ' has no default language system.');
	            return [
	                {name: 'scriptTag' + i, type: 'TAG', value: scriptRecord.tag},
	                {name: 'script' + i, type: 'TABLE', value: new Table('scriptTable', [
	                    {name: 'defaultLangSys', type: 'TABLE', value: new Table('defaultLangSys', [
	                        {name: 'lookupOrder', type: 'USHORT', value: 0},
	                        {name: 'reqFeatureIndex', type: 'USHORT', value: defaultLangSys.reqFeatureIndex}]
	                        .concat(ushortList('featureIndex', defaultLangSys.featureIndexes)))}
	                    ].concat(recordList('langSys', script.langSysRecords, function(langSysRecord, i) {
	                        var langSys = langSysRecord.langSys;
	                        return [
	                            {name: 'langSysTag' + i, type: 'TAG', value: langSysRecord.tag},
	                            {name: 'langSys' + i, type: 'TABLE', value: new Table('langSys', [
	                                {name: 'lookupOrder', type: 'USHORT', value: 0},
	                                {name: 'reqFeatureIndex', type: 'USHORT', value: langSys.reqFeatureIndex}
	                                ].concat(ushortList('featureIndex', langSys.featureIndexes)))}
	                        ];
	                    })))}
	            ];
	        })
	    );
	}
	ScriptList.prototype = Object.create(Table.prototype);
	ScriptList.prototype.constructor = ScriptList;

	/**
	 * @exports opentype.FeatureList
	 * @class
	 * @param {opentype.Table}
	 * @constructor
	 * @extends opentype.Table
	 */
	function FeatureList(featureListTable) {
	    Table.call(this, 'featureListTable',
	        recordList('featureRecord', featureListTable, function(featureRecord, i) {
	            var feature = featureRecord.feature;
	            return [
	                {name: 'featureTag' + i, type: 'TAG', value: featureRecord.tag},
	                {name: 'feature' + i, type: 'TABLE', value: new Table('featureTable', [
	                    {name: 'featureParams', type: 'USHORT', value: feature.featureParams} ].concat(ushortList('lookupListIndex', feature.lookupListIndexes)))}
	            ];
	        })
	    );
	}
	FeatureList.prototype = Object.create(Table.prototype);
	FeatureList.prototype.constructor = FeatureList;

	/**
	 * @exports opentype.LookupList
	 * @class
	 * @param {opentype.Table}
	 * @param {Object}
	 * @constructor
	 * @extends opentype.Table
	 */
	function LookupList(lookupListTable, subtableMakers) {
	    Table.call(this, 'lookupListTable', tableList('lookup', lookupListTable, function(lookupTable) {
	        var subtableCallback = subtableMakers[lookupTable.lookupType];
	        check.assert(!!subtableCallback, 'Unable to write GSUB lookup type ' + lookupTable.lookupType + ' tables.');
	        return new Table('lookupTable', [
	            {name: 'lookupType', type: 'USHORT', value: lookupTable.lookupType},
	            {name: 'lookupFlag', type: 'USHORT', value: lookupTable.lookupFlag}
	        ].concat(tableList('subtable', lookupTable.subtables, subtableCallback)));
	    }));
	}
	LookupList.prototype = Object.create(Table.prototype);
	LookupList.prototype.constructor = LookupList;

	// Record = same as Table, but inlined (a Table has an offset and its data is further in the stream)
	// Don't use offsets inside Records (probable bug), only in Tables.
	var table = {
	    Table: Table,
	    Record: Table,
	    Coverage: Coverage,
	    ScriptList: ScriptList,
	    FeatureList: FeatureList,
	    LookupList: LookupList,
	    ushortList: ushortList,
	    tableList: tableList,
	    recordList: recordList,
	};

	// Parsing utility functions

	// Retrieve an unsigned byte from the DataView.
	function getByte(dataView, offset) {
	    return dataView.getUint8(offset);
	}

	// Retrieve an unsigned 16-bit short from the DataView.
	// The value is stored in big endian.
	function getUShort(dataView, offset) {
	    return dataView.getUint16(offset, false);
	}

	// Retrieve a signed 16-bit short from the DataView.
	// The value is stored in big endian.
	function getShort(dataView, offset) {
	    return dataView.getInt16(offset, false);
	}

	// Retrieve an unsigned 32-bit long from the DataView.
	// The value is stored in big endian.
	function getULong(dataView, offset) {
	    return dataView.getUint32(offset, false);
	}

	// Retrieve a 32-bit signed fixed-point number (16.16) from the DataView.
	// The value is stored in big endian.
	function getFixed(dataView, offset) {
	    var decimal = dataView.getInt16(offset, false);
	    var fraction = dataView.getUint16(offset + 2, false);
	    return decimal + fraction / 65535;
	}

	// Retrieve a 4-character tag from the DataView.
	// Tags are used to identify tables.
	function getTag(dataView, offset) {
	    var tag = '';
	    for (var i = offset; i < offset + 4; i += 1) {
	        tag += String.fromCharCode(dataView.getInt8(i));
	    }

	    return tag;
	}

	// Retrieve an offset from the DataView.
	// Offsets are 1 to 4 bytes in length, depending on the offSize argument.
	function getOffset(dataView, offset, offSize) {
	    var v = 0;
	    for (var i = 0; i < offSize; i += 1) {
	        v <<= 8;
	        v += dataView.getUint8(offset + i);
	    }

	    return v;
	}

	// Retrieve a number of bytes from start offset to the end offset from the DataView.
	function getBytes(dataView, startOffset, endOffset) {
	    var bytes = [];
	    for (var i = startOffset; i < endOffset; i += 1) {
	        bytes.push(dataView.getUint8(i));
	    }

	    return bytes;
	}

	// Convert the list of bytes to a string.
	function bytesToString(bytes) {
	    var s = '';
	    for (var i = 0; i < bytes.length; i += 1) {
	        s += String.fromCharCode(bytes[i]);
	    }

	    return s;
	}

	var typeOffsets = {
	    byte: 1,
	    uShort: 2,
	    short: 2,
	    uLong: 4,
	    fixed: 4,
	    longDateTime: 8,
	    tag: 4
	};

	// A stateful parser that changes the offset whenever a value is retrieved.
	// The data is a DataView.
	function Parser(data, offset) {
	    this.data = data;
	    this.offset = offset;
	    this.relativeOffset = 0;
	}

	Parser.prototype.parseByte = function() {
	    var v = this.data.getUint8(this.offset + this.relativeOffset);
	    this.relativeOffset += 1;
	    return v;
	};

	Parser.prototype.parseChar = function() {
	    var v = this.data.getInt8(this.offset + this.relativeOffset);
	    this.relativeOffset += 1;
	    return v;
	};

	Parser.prototype.parseCard8 = Parser.prototype.parseByte;

	Parser.prototype.parseUShort = function() {
	    var v = this.data.getUint16(this.offset + this.relativeOffset);
	    this.relativeOffset += 2;
	    return v;
	};

	Parser.prototype.parseCard16 = Parser.prototype.parseUShort;
	Parser.prototype.parseSID = Parser.prototype.parseUShort;
	Parser.prototype.parseOffset16 = Parser.prototype.parseUShort;

	Parser.prototype.parseShort = function() {
	    var v = this.data.getInt16(this.offset + this.relativeOffset);
	    this.relativeOffset += 2;
	    return v;
	};

	Parser.prototype.parseF2Dot14 = function() {
	    var v = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
	    this.relativeOffset += 2;
	    return v;
	};

	Parser.prototype.parseULong = function() {
	    var v = getULong(this.data, this.offset + this.relativeOffset);
	    this.relativeOffset += 4;
	    return v;
	};

	Parser.prototype.parseOffset32 = Parser.prototype.parseULong;

	Parser.prototype.parseFixed = function() {
	    var v = getFixed(this.data, this.offset + this.relativeOffset);
	    this.relativeOffset += 4;
	    return v;
	};

	Parser.prototype.parseString = function(length) {
	    var dataView = this.data;
	    var offset = this.offset + this.relativeOffset;
	    var string = '';
	    this.relativeOffset += length;
	    for (var i = 0; i < length; i++) {
	        string += String.fromCharCode(dataView.getUint8(offset + i));
	    }

	    return string;
	};

	Parser.prototype.parseTag = function() {
	    return this.parseString(4);
	};

	// LONGDATETIME is a 64-bit integer.
	// JavaScript and unix timestamps traditionally use 32 bits, so we
	// only take the last 32 bits.
	// + Since until 2038 those bits will be filled by zeros we can ignore them.
	Parser.prototype.parseLongDateTime = function() {
	    var v = getULong(this.data, this.offset + this.relativeOffset + 4);
	    // Subtract seconds between 01/01/1904 and 01/01/1970
	    // to convert Apple Mac timestamp to Standard Unix timestamp
	    v -= 2082844800;
	    this.relativeOffset += 8;
	    return v;
	};

	Parser.prototype.parseVersion = function(minorBase) {
	    var major = getUShort(this.data, this.offset + this.relativeOffset);

	    // How to interpret the minor version is very vague in the spec. 0x5000 is 5, 0x1000 is 1
	    // Default returns the correct number if minor = 0xN000 where N is 0-9
	    // Set minorBase to 1 for tables that use minor = N where N is 0-9
	    var minor = getUShort(this.data, this.offset + this.relativeOffset + 2);
	    this.relativeOffset += 4;
	    if (minorBase === undefined) { minorBase = 0x1000; }
	    return major + minor / minorBase / 10;
	};

	Parser.prototype.skip = function(type, amount) {
	    if (amount === undefined) {
	        amount = 1;
	    }

	    this.relativeOffset += typeOffsets[type] * amount;
	};

	///// Parsing lists and records ///////////////////////////////

	// Parse a list of 32 bit unsigned integers.
	Parser.prototype.parseULongList = function(count) {
	    if (count === undefined) { count = this.parseULong(); }
	    var offsets = new Array(count);
	    var dataView = this.data;
	    var offset = this.offset + this.relativeOffset;
	    for (var i = 0; i < count; i++) {
	        offsets[i] = dataView.getUint32(offset);
	        offset += 4;
	    }

	    this.relativeOffset += count * 4;
	    return offsets;
	};

	// Parse a list of 16 bit unsigned integers. The length of the list can be read on the stream
	// or provided as an argument.
	Parser.prototype.parseOffset16List =
	Parser.prototype.parseUShortList = function(count) {
	    if (count === undefined) { count = this.parseUShort(); }
	    var offsets = new Array(count);
	    var dataView = this.data;
	    var offset = this.offset + this.relativeOffset;
	    for (var i = 0; i < count; i++) {
	        offsets[i] = dataView.getUint16(offset);
	        offset += 2;
	    }

	    this.relativeOffset += count * 2;
	    return offsets;
	};

	// Parses a list of 16 bit signed integers.
	Parser.prototype.parseShortList = function(count) {
	    var list = new Array(count);
	    var dataView = this.data;
	    var offset = this.offset + this.relativeOffset;
	    for (var i = 0; i < count; i++) {
	        list[i] = dataView.getInt16(offset);
	        offset += 2;
	    }

	    this.relativeOffset += count * 2;
	    return list;
	};

	// Parses a list of bytes.
	Parser.prototype.parseByteList = function(count) {
	    var list = new Array(count);
	    var dataView = this.data;
	    var offset = this.offset + this.relativeOffset;
	    for (var i = 0; i < count; i++) {
	        list[i] = dataView.getUint8(offset++);
	    }

	    this.relativeOffset += count;
	    return list;
	};

	/**
	 * Parse a list of items.
	 * Record count is optional, if omitted it is read from the stream.
	 * itemCallback is one of the Parser methods.
	 */
	Parser.prototype.parseList = function(count, itemCallback) {
	    var this$1 = this;

	    if (!itemCallback) {
	        itemCallback = count;
	        count = this.parseUShort();
	    }
	    var list = new Array(count);
	    for (var i = 0; i < count; i++) {
	        list[i] = itemCallback.call(this$1);
	    }
	    return list;
	};

	Parser.prototype.parseList32 = function(count, itemCallback) {
	    var this$1 = this;

	    if (!itemCallback) {
	        itemCallback = count;
	        count = this.parseULong();
	    }
	    var list = new Array(count);
	    for (var i = 0; i < count; i++) {
	        list[i] = itemCallback.call(this$1);
	    }
	    return list;
	};

	/**
	 * Parse a list of records.
	 * Record count is optional, if omitted it is read from the stream.
	 * Example of recordDescription: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
	 */
	Parser.prototype.parseRecordList = function(count, recordDescription) {
	    var this$1 = this;

	    // If the count argument is absent, read it in the stream.
	    if (!recordDescription) {
	        recordDescription = count;
	        count = this.parseUShort();
	    }
	    var records = new Array(count);
	    var fields = Object.keys(recordDescription);
	    for (var i = 0; i < count; i++) {
	        var rec = {};
	        for (var j = 0; j < fields.length; j++) {
	            var fieldName = fields[j];
	            var fieldType = recordDescription[fieldName];
	            rec[fieldName] = fieldType.call(this$1);
	        }
	        records[i] = rec;
	    }
	    return records;
	};

	Parser.prototype.parseRecordList32 = function(count, recordDescription) {
	    var this$1 = this;

	    // If the count argument is absent, read it in the stream.
	    if (!recordDescription) {
	        recordDescription = count;
	        count = this.parseULong();
	    }
	    var records = new Array(count);
	    var fields = Object.keys(recordDescription);
	    for (var i = 0; i < count; i++) {
	        var rec = {};
	        for (var j = 0; j < fields.length; j++) {
	            var fieldName = fields[j];
	            var fieldType = recordDescription[fieldName];
	            rec[fieldName] = fieldType.call(this$1);
	        }
	        records[i] = rec;
	    }
	    return records;
	};

	// Parse a data structure into an object
	// Example of description: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
	Parser.prototype.parseStruct = function(description) {
	    var this$1 = this;

	    if (typeof description === 'function') {
	        return description.call(this);
	    } else {
	        var fields = Object.keys(description);
	        var struct = {};
	        for (var j = 0; j < fields.length; j++) {
	            var fieldName = fields[j];
	            var fieldType = description[fieldName];
	            struct[fieldName] = fieldType.call(this$1);
	        }
	        return struct;
	    }
	};

	/**
	 * Parse a GPOS valueRecord
	 * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
	 * valueFormat is optional, if omitted it is read from the stream.
	 */
	Parser.prototype.parseValueRecord = function(valueFormat) {
	    if (valueFormat === undefined) {
	        valueFormat = this.parseUShort();
	    }
	    if (valueFormat === 0) {
	        // valueFormat2 in kerning pairs is most often 0
	        // in this case return undefined instead of an empty object, to save space
	        return;
	    }
	    var valueRecord = {};

	    if (valueFormat & 0x0001) { valueRecord.xPlacement = this.parseShort(); }
	    if (valueFormat & 0x0002) { valueRecord.yPlacement = this.parseShort(); }
	    if (valueFormat & 0x0004) { valueRecord.xAdvance = this.parseShort(); }
	    if (valueFormat & 0x0008) { valueRecord.yAdvance = this.parseShort(); }

	    // Device table (non-variable font) / VariationIndex table (variable font) not supported
	    // https://docs.microsoft.com/fr-fr/typography/opentype/spec/chapter2#devVarIdxTbls
	    if (valueFormat & 0x0010) { valueRecord.xPlaDevice = undefined; this.parseShort(); }
	    if (valueFormat & 0x0020) { valueRecord.yPlaDevice = undefined; this.parseShort(); }
	    if (valueFormat & 0x0040) { valueRecord.xAdvDevice = undefined; this.parseShort(); }
	    if (valueFormat & 0x0080) { valueRecord.yAdvDevice = undefined; this.parseShort(); }

	    return valueRecord;
	};

	/**
	 * Parse a list of GPOS valueRecords
	 * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
	 * valueFormat and valueCount are read from the stream.
	 */
	Parser.prototype.parseValueRecordList = function() {
	    var this$1 = this;

	    var valueFormat = this.parseUShort();
	    var valueCount = this.parseUShort();
	    var values = new Array(valueCount);
	    for (var i = 0; i < valueCount; i++) {
	        values[i] = this$1.parseValueRecord(valueFormat);
	    }
	    return values;
	};

	Parser.prototype.parsePointer = function(description) {
	    var structOffset = this.parseOffset16();
	    if (structOffset > 0) {
	        // NULL offset => return undefined
	        return new Parser(this.data, this.offset + structOffset).parseStruct(description);
	    }
	    return undefined;
	};

	Parser.prototype.parsePointer32 = function(description) {
	    var structOffset = this.parseOffset32();
	    if (structOffset > 0) {
	        // NULL offset => return undefined
	        return new Parser(this.data, this.offset + structOffset).parseStruct(description);
	    }
	    return undefined;
	};

	/**
	 * Parse a list of offsets to lists of 16-bit integers,
	 * or a list of offsets to lists of offsets to any kind of items.
	 * If itemCallback is not provided, a list of list of UShort is assumed.
	 * If provided, itemCallback is called on each item and must parse the item.
	 * See examples in tables/gsub.js
	 */
	Parser.prototype.parseListOfLists = function(itemCallback) {
	    var this$1 = this;

	    var offsets = this.parseOffset16List();
	    var count = offsets.length;
	    var relativeOffset = this.relativeOffset;
	    var list = new Array(count);
	    for (var i = 0; i < count; i++) {
	        var start = offsets[i];
	        if (start === 0) {
	            // NULL offset
	            // Add i as owned property to list. Convenient with assert.
	            list[i] = undefined;
	            continue;
	        }
	        this$1.relativeOffset = start;
	        if (itemCallback) {
	            var subOffsets = this$1.parseOffset16List();
	            var subList = new Array(subOffsets.length);
	            for (var j = 0; j < subOffsets.length; j++) {
	                this$1.relativeOffset = start + subOffsets[j];
	                subList[j] = itemCallback.call(this$1);
	            }
	            list[i] = subList;
	        } else {
	            list[i] = this$1.parseUShortList();
	        }
	    }
	    this.relativeOffset = relativeOffset;
	    return list;
	};

	///// Complex tables parsing //////////////////////////////////

	// Parse a coverage table in a GSUB, GPOS or GDEF table.
	// https://www.microsoft.com/typography/OTSPEC/chapter2.htm
	// parser.offset must point to the start of the table containing the coverage.
	Parser.prototype.parseCoverage = function() {
	    var this$1 = this;

	    var startOffset = this.offset + this.relativeOffset;
	    var format = this.parseUShort();
	    var count = this.parseUShort();
	    if (format === 1) {
	        return {
	            format: 1,
	            glyphs: this.parseUShortList(count)
	        };
	    } else if (format === 2) {
	        var ranges = new Array(count);
	        for (var i = 0; i < count; i++) {
	            ranges[i] = {
	                start: this$1.parseUShort(),
	                end: this$1.parseUShort(),
	                index: this$1.parseUShort()
	            };
	        }
	        return {
	            format: 2,
	            ranges: ranges
	        };
	    }
	    throw new Error('0x' + startOffset.toString(16) + ': Coverage format must be 1 or 2.');
	};

	// Parse a Class Definition Table in a GSUB, GPOS or GDEF table.
	// https://www.microsoft.com/typography/OTSPEC/chapter2.htm
	Parser.prototype.parseClassDef = function() {
	    var startOffset = this.offset + this.relativeOffset;
	    var format = this.parseUShort();
	    if (format === 1) {
	        return {
	            format: 1,
	            startGlyph: this.parseUShort(),
	            classes: this.parseUShortList()
	        };
	    } else if (format === 2) {
	        return {
	            format: 2,
	            ranges: this.parseRecordList({
	                start: Parser.uShort,
	                end: Parser.uShort,
	                classId: Parser.uShort
	            })
	        };
	    }
	    throw new Error('0x' + startOffset.toString(16) + ': ClassDef format must be 1 or 2.');
	};

	///// Static methods ///////////////////////////////////
	// These convenience methods can be used as callbacks and should be called with "this" context set to a Parser instance.

	Parser.list = function(count, itemCallback) {
	    return function() {
	        return this.parseList(count, itemCallback);
	    };
	};

	Parser.list32 = function(count, itemCallback) {
	    return function() {
	        return this.parseList32(count, itemCallback);
	    };
	};

	Parser.recordList = function(count, recordDescription) {
	    return function() {
	        return this.parseRecordList(count, recordDescription);
	    };
	};

	Parser.recordList32 = function(count, recordDescription) {
	    return function() {
	        return this.parseRecordList32(count, recordDescription);
	    };
	};

	Parser.pointer = function(description) {
	    return function() {
	        return this.parsePointer(description);
	    };
	};

	Parser.pointer32 = function(description) {
	    return function() {
	        return this.parsePointer32(description);
	    };
	};

	Parser.tag = Parser.prototype.parseTag;
	Parser.byte = Parser.prototype.parseByte;
	Parser.uShort = Parser.offset16 = Parser.prototype.parseUShort;
	Parser.uShortList = Parser.prototype.parseUShortList;
	Parser.uLong = Parser.offset32 = Parser.prototype.parseULong;
	Parser.uLongList = Parser.prototype.parseULongList;
	Parser.struct = Parser.prototype.parseStruct;
	Parser.coverage = Parser.prototype.parseCoverage;
	Parser.classDef = Parser.prototype.parseClassDef;

	///// Script, Feature, Lookup lists ///////////////////////////////////////////////
	// https://www.microsoft.com/typography/OTSPEC/chapter2.htm

	var langSysTable = {
	    reserved: Parser.uShort,
	    reqFeatureIndex: Parser.uShort,
	    featureIndexes: Parser.uShortList
	};

	Parser.prototype.parseScriptList = function() {
	    return this.parsePointer(Parser.recordList({
	        tag: Parser.tag,
	        script: Parser.pointer({
	            defaultLangSys: Parser.pointer(langSysTable),
	            langSysRecords: Parser.recordList({
	                tag: Parser.tag,
	                langSys: Parser.pointer(langSysTable)
	            })
	        })
	    })) || [];
	};

	Parser.prototype.parseFeatureList = function() {
	    return this.parsePointer(Parser.recordList({
	        tag: Parser.tag,
	        feature: Parser.pointer({
	            featureParams: Parser.offset16,
	            lookupListIndexes: Parser.uShortList
	        })
	    })) || [];
	};

	Parser.prototype.parseLookupList = function(lookupTableParsers) {
	    return this.parsePointer(Parser.list(Parser.pointer(function() {
	        var lookupType = this.parseUShort();
	        check.argument(1 <= lookupType && lookupType <= 9, 'GPOS/GSUB lookup type ' + lookupType + ' unknown.');
	        var lookupFlag = this.parseUShort();
	        var useMarkFilteringSet = lookupFlag & 0x10;
	        return {
	            lookupType: lookupType,
	            lookupFlag: lookupFlag,
	            subtables: this.parseList(Parser.pointer(lookupTableParsers[lookupType])),
	            markFilteringSet: useMarkFilteringSet ? this.parseUShort() : undefined
	        };
	    }))) || [];
	};

	Parser.prototype.parseFeatureVariationsList = function() {
	    return this.parsePointer32(function() {
	        var majorVersion = this.parseUShort();
	        var minorVersion = this.parseUShort();
	        check.argument(majorVersion === 1 && minorVersion < 1, 'GPOS/GSUB feature variations table unknown.');
	        var featureVariations = this.parseRecordList32({
	            conditionSetOffset: Parser.offset32,
	            featureTableSubstitutionOffset: Parser.offset32
	        });
	        return featureVariations;
	    }) || [];
	};

	var parse = {
	    getByte: getByte,
	    getCard8: getByte,
	    getUShort: getUShort,
	    getCard16: getUShort,
	    getShort: getShort,
	    getULong: getULong,
	    getFixed: getFixed,
	    getTag: getTag,
	    getOffset: getOffset,
	    getBytes: getBytes,
	    bytesToString: bytesToString,
	    Parser: Parser,
	};

	// The `cmap` table stores the mappings from characters to glyphs.

	function parseCmapTableFormat12(cmap, p) {
	    //Skip reserved.
	    p.parseUShort();

	    // Length in bytes of the sub-tables.
	    cmap.length = p.parseULong();
	    cmap.language = p.parseULong();

	    var groupCount;
	    cmap.groupCount = groupCount = p.parseULong();
	    cmap.glyphIndexMap = {};

	    for (var i = 0; i < groupCount; i += 1) {
	        var startCharCode = p.parseULong();
	        var endCharCode = p.parseULong();
	        var startGlyphId = p.parseULong();

	        for (var c = startCharCode; c <= endCharCode; c += 1) {
	            cmap.glyphIndexMap[c] = startGlyphId;
	            startGlyphId++;
	        }
	    }
	}

	function parseCmapTableFormat4(cmap, p, data, start, offset) {
	    // Length in bytes of the sub-tables.
	    cmap.length = p.parseUShort();
	    cmap.language = p.parseUShort();

	    // segCount is stored x 2.
	    var segCount;
	    cmap.segCount = segCount = p.parseUShort() >> 1;

	    // Skip searchRange, entrySelector, rangeShift.
	    p.skip('uShort', 3);

	    // The "unrolled" mapping from character codes to glyph indices.
	    cmap.glyphIndexMap = {};
	    var endCountParser = new parse.Parser(data, start + offset + 14);
	    var startCountParser = new parse.Parser(data, start + offset + 16 + segCount * 2);
	    var idDeltaParser = new parse.Parser(data, start + offset + 16 + segCount * 4);
	    var idRangeOffsetParser = new parse.Parser(data, start + offset + 16 + segCount * 6);
	    var glyphIndexOffset = start + offset + 16 + segCount * 8;
	    for (var i = 0; i < segCount - 1; i += 1) {
	        var glyphIndex = (void 0);
	        var endCount = endCountParser.parseUShort();
	        var startCount = startCountParser.parseUShort();
	        var idDelta = idDeltaParser.parseShort();
	        var idRangeOffset = idRangeOffsetParser.parseUShort();
	        for (var c = startCount; c <= endCount; c += 1) {
	            if (idRangeOffset !== 0) {
	                // The idRangeOffset is relative to the current position in the idRangeOffset array.
	                // Take the current offset in the idRangeOffset array.
	                glyphIndexOffset = (idRangeOffsetParser.offset + idRangeOffsetParser.relativeOffset - 2);

	                // Add the value of the idRangeOffset, which will move us into the glyphIndex array.
	                glyphIndexOffset += idRangeOffset;

	                // Then add the character index of the current segment, multiplied by 2 for USHORTs.
	                glyphIndexOffset += (c - startCount) * 2;
	                glyphIndex = parse.getUShort(data, glyphIndexOffset);
	                if (glyphIndex !== 0) {
	                    glyphIndex = (glyphIndex + idDelta) & 0xFFFF;
	                }
	            } else {
	                glyphIndex = (c + idDelta) & 0xFFFF;
	            }

	            cmap.glyphIndexMap[c] = glyphIndex;
	        }
	    }
	}

	// Parse the `cmap` table. This table stores the mappings from characters to glyphs.
	// There are many available formats, but we only support the Windows format 4 and 12.
	// This function returns a `CmapEncoding` object or null if no supported format could be found.
	function parseCmapTable(data, start) {
	    var cmap = {};
	    cmap.version = parse.getUShort(data, start);
	    check.argument(cmap.version === 0, 'cmap table version should be 0.');

	    // The cmap table can contain many sub-tables, each with their own format.
	    // We're only interested in a "platform 0" (Unicode format) and "platform 3" (Windows format) table.
	    cmap.numTables = parse.getUShort(data, start + 2);
	    var offset = -1;
	    for (var i = cmap.numTables - 1; i >= 0; i -= 1) {
	        var platformId = parse.getUShort(data, start + 4 + (i * 8));
	        var encodingId = parse.getUShort(data, start + 4 + (i * 8) + 2);
	        if ((platformId === 3 && (encodingId === 0 || encodingId === 1 || encodingId === 10)) ||
	            (platformId === 0 && (encodingId === 0 || encodingId === 1 || encodingId === 2 || encodingId === 3 || encodingId === 4))) {
	            offset = parse.getULong(data, start + 4 + (i * 8) + 4);
	            break;
	        }
	    }

	    if (offset === -1) {
	        // There is no cmap table in the font that we support.
	        throw new Error('No valid cmap sub-tables found.');
	    }

	    var p = new parse.Parser(data, start + offset);
	    cmap.format = p.parseUShort();

	    if (cmap.format === 12) {
	        parseCmapTableFormat12(cmap, p);
	    } else if (cmap.format === 4) {
	        parseCmapTableFormat4(cmap, p, data, start, offset);
	    } else {
	        throw new Error('Only format 4 and 12 cmap tables are supported (found format ' + cmap.format + ').');
	    }

	    return cmap;
	}

	function addSegment(t, code, glyphIndex) {
	    t.segments.push({
	        end: code,
	        start: code,
	        delta: -(code - glyphIndex),
	        offset: 0,
	        glyphIndex: glyphIndex
	    });
	}

	function addTerminatorSegment(t) {
	    t.segments.push({
	        end: 0xFFFF,
	        start: 0xFFFF,
	        delta: 1,
	        offset: 0
	    });
	}

	// Make cmap table, format 4 by default, 12 if needed only
	function makeCmapTable(glyphs) {
	    // Plan 0 is the base Unicode Plan but emojis, for example are on another plan, and needs cmap 12 format (with 32bit)
	    var isPlan0Only = true;
	    var i;

	    // Check if we need to add cmap format 12 or if format 4 only is fine
	    for (i = glyphs.length - 1; i > 0; i -= 1) {
	        var g = glyphs.get(i);
	        if (g.unicode > 65535) {
	            console.log('Adding CMAP format 12 (needed!)');
	            isPlan0Only = false;
	            break;
	        }
	    }

	    var cmapTable = [
	        {name: 'version', type: 'USHORT', value: 0},
	        {name: 'numTables', type: 'USHORT', value: isPlan0Only ? 1 : 2},

	        // CMAP 4 header
	        {name: 'platformID', type: 'USHORT', value: 3},
	        {name: 'encodingID', type: 'USHORT', value: 1},
	        {name: 'offset', type: 'ULONG', value: isPlan0Only ? 12 : (12 + 8)}
	    ];

	    if (!isPlan0Only)
	        { cmapTable = cmapTable.concat([
	            // CMAP 12 header
	            {name: 'cmap12PlatformID', type: 'USHORT', value: 3}, // We encode only for PlatformID = 3 (Windows) because it is supported everywhere
	            {name: 'cmap12EncodingID', type: 'USHORT', value: 10},
	            {name: 'cmap12Offset', type: 'ULONG', value: 0}
	        ]); }

	    cmapTable = cmapTable.concat([
	        // CMAP 4 Subtable
	        {name: 'format', type: 'USHORT', value: 4},
	        {name: 'cmap4Length', type: 'USHORT', value: 0},
	        {name: 'language', type: 'USHORT', value: 0},
	        {name: 'segCountX2', type: 'USHORT', value: 0},
	        {name: 'searchRange', type: 'USHORT', value: 0},
	        {name: 'entrySelector', type: 'USHORT', value: 0},
	        {name: 'rangeShift', type: 'USHORT', value: 0}
	    ]);

	    var t = new table.Table('cmap', cmapTable);

	    t.segments = [];
	    for (i = 0; i < glyphs.length; i += 1) {
	        var glyph = glyphs.get(i);
	        for (var j = 0; j < glyph.unicodes.length; j += 1) {
	            addSegment(t, glyph.unicodes[j], i);
	        }

	        t.segments = t.segments.sort(function (a, b) {
	            return a.start - b.start;
	        });
	    }

	    addTerminatorSegment(t);

	    var segCount = t.segments.length;
	    var segCountToRemove = 0;

	    // CMAP 4
	    // Set up parallel segment arrays.
	    var endCounts = [];
	    var startCounts = [];
	    var idDeltas = [];
	    var idRangeOffsets = [];
	    var glyphIds = [];

	    // CMAP 12
	    var cmap12Groups = [];

	    // Reminder this loop is not following the specification at 100%
	    // The specification -> find suites of characters and make a group
	    // Here we're doing one group for each letter
	    // Doing as the spec can save 8 times (or more) space
	    for (i = 0; i < segCount; i += 1) {
	        var segment = t.segments[i];

	        // CMAP 4
	        if (segment.end <= 65535 && segment.start <= 65535) {
	            endCounts = endCounts.concat({name: 'end_' + i, type: 'USHORT', value: segment.end});
	            startCounts = startCounts.concat({name: 'start_' + i, type: 'USHORT', value: segment.start});
	            idDeltas = idDeltas.concat({name: 'idDelta_' + i, type: 'SHORT', value: segment.delta});
	            idRangeOffsets = idRangeOffsets.concat({name: 'idRangeOffset_' + i, type: 'USHORT', value: segment.offset});
	            if (segment.glyphId !== undefined) {
	                glyphIds = glyphIds.concat({name: 'glyph_' + i, type: 'USHORT', value: segment.glyphId});
	            }
	        } else {
	            // Skip Unicode > 65535 (16bit unsigned max) for CMAP 4, will be added in CMAP 12
	            segCountToRemove += 1;
	        }

	        // CMAP 12
	        // Skip Terminator Segment
	        if (!isPlan0Only && segment.glyphIndex !== undefined) {
	            cmap12Groups = cmap12Groups.concat({name: 'cmap12Start_' + i, type: 'ULONG', value: segment.start});
	            cmap12Groups = cmap12Groups.concat({name: 'cmap12End_' + i, type: 'ULONG', value: segment.end});
	            cmap12Groups = cmap12Groups.concat({name: 'cmap12Glyph_' + i, type: 'ULONG', value: segment.glyphIndex});
	        }
	    }

	    // CMAP 4 Subtable
	    t.segCountX2 = (segCount - segCountToRemove) * 2;
	    t.searchRange = Math.pow(2, Math.floor(Math.log((segCount - segCountToRemove)) / Math.log(2))) * 2;
	    t.entrySelector = Math.log(t.searchRange / 2) / Math.log(2);
	    t.rangeShift = t.segCountX2 - t.searchRange;

	    t.fields = t.fields.concat(endCounts);
	    t.fields.push({name: 'reservedPad', type: 'USHORT', value: 0});
	    t.fields = t.fields.concat(startCounts);
	    t.fields = t.fields.concat(idDeltas);
	    t.fields = t.fields.concat(idRangeOffsets);
	    t.fields = t.fields.concat(glyphIds);

	    t.cmap4Length = 14 + // Subtable header
	        endCounts.length * 2 +
	        2 + // reservedPad
	        startCounts.length * 2 +
	        idDeltas.length * 2 +
	        idRangeOffsets.length * 2 +
	        glyphIds.length * 2;

	    if (!isPlan0Only) {
	        // CMAP 12 Subtable
	        var cmap12Length = 16 + // Subtable header
	            cmap12Groups.length * 4;

	        t.cmap12Offset = 12 + (2 * 2) + 4 + t.cmap4Length;
	        t.fields = t.fields.concat([
	            {name: 'cmap12Format', type: 'USHORT', value: 12},
	            {name: 'cmap12Reserved', type: 'USHORT', value: 0},
	            {name: 'cmap12Length', type: 'ULONG', value: cmap12Length},
	            {name: 'cmap12Language', type: 'ULONG', value: 0},
	            {name: 'cmap12nGroups', type: 'ULONG', value: cmap12Groups.length / 3}
	        ]);

	        t.fields = t.fields.concat(cmap12Groups);
	    }

	    return t;
	}

	var cmap = { parse: parseCmapTable, make: makeCmapTable };

	// Glyph encoding

	var cffStandardStrings = [
	    '.notdef', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
	    'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
	    'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
	    'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
	    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
	    'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
	    'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', 'exclamdown', 'cent', 'sterling',
	    'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle', 'quotedblleft', 'guillemotleft',
	    'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'endash', 'dagger', 'daggerdbl', 'periodcentered', 'paragraph',
	    'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis', 'perthousand',
	    'questiondown', 'grave', 'acute', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'dieresis', 'ring',
	    'cedilla', 'hungarumlaut', 'ogonek', 'caron', 'emdash', 'AE', 'ordfeminine', 'Lslash', 'Oslash', 'OE',
	    'ordmasculine', 'ae', 'dotlessi', 'lslash', 'oslash', 'oe', 'germandbls', 'onesuperior', 'logicalnot', 'mu',
	    'trademark', 'Eth', 'onehalf', 'plusminus', 'Thorn', 'onequarter', 'divide', 'brokenbar', 'degree', 'thorn',
	    'threequarters', 'twosuperior', 'registered', 'minus', 'eth', 'multiply', 'threesuperior', 'copyright',
	    'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring', 'Atilde', 'Ccedilla', 'Eacute', 'Ecircumflex',
	    'Edieresis', 'Egrave', 'Iacute', 'Icircumflex', 'Idieresis', 'Igrave', 'Ntilde', 'Oacute', 'Ocircumflex',
	    'Odieresis', 'Ograve', 'Otilde', 'Scaron', 'Uacute', 'Ucircumflex', 'Udieresis', 'Ugrave', 'Yacute',
	    'Ydieresis', 'Zcaron', 'aacute', 'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde', 'ccedilla', 'eacute',
	    'ecircumflex', 'edieresis', 'egrave', 'iacute', 'icircumflex', 'idieresis', 'igrave', 'ntilde', 'oacute',
	    'ocircumflex', 'odieresis', 'ograve', 'otilde', 'scaron', 'uacute', 'ucircumflex', 'udieresis', 'ugrave',
	    'yacute', 'ydieresis', 'zcaron', 'exclamsmall', 'Hungarumlautsmall', 'dollaroldstyle', 'dollarsuperior',
	    'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', '266 ff', 'onedotenleader',
	    'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle',
	    'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'commasuperior', 'threequartersemdash', 'periodsuperior',
	    'questionsmall', 'asuperior', 'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior',
	    'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior', 'tsuperior', 'ff', 'ffi', 'ffl',
	    'parenleftinferior', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
	    'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
	    'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
	    'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', 'exclamdownsmall',
	    'centoldstyle', 'Lslashsmall', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall', 'Caronsmall',
	    'Dotaccentsmall', 'Macronsmall', 'figuredash', 'hypheninferior', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall',
	    'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds',
	    'zerosuperior', 'foursuperior', 'fivesuperior', 'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior',
	    'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior',
	    'seveninferior', 'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior',
	    'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall',
	    'Aringsmall', 'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall',
	    'Igravesmall', 'Iacutesmall', 'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall',
	    'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall',
	    'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall', '001.000',
	    '001.001', '001.002', '001.003', 'Black', 'Bold', 'Book', 'Light', 'Medium', 'Regular', 'Roman', 'Semibold'];

	var cffStandardEncoding = [
	    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
	    '', '', '', '', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
	    'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
	    'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
	    'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
	    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
	    'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
	    'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', '', '', '', '', '', '', '', '',
	    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
	    'exclamdown', 'cent', 'sterling', 'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle',
	    'quotedblleft', 'guillemotleft', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', '', 'endash', 'dagger',
	    'daggerdbl', 'periodcentered', '', 'paragraph', 'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright',
	    'guillemotright', 'ellipsis', 'perthousand', '', 'questiondown', '', 'grave', 'acute', 'circumflex', 'tilde',
	    'macron', 'breve', 'dotaccent', 'dieresis', '', 'ring', 'cedilla', '', 'hungarumlaut', 'ogonek', 'caron',
	    'emdash', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'AE', '', 'ordfeminine', '', '', '',
	    '', 'Lslash', 'Oslash', 'OE', 'ordmasculine', '', '', '', '', '', 'ae', '', '', '', 'dotlessi', '', '',
	    'lslash', 'oslash', 'oe', 'germandbls'];

	var cffExpertEncoding = [
	    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
	    '', '', '', '', 'space', 'exclamsmall', 'Hungarumlautsmall', '', 'dollaroldstyle', 'dollarsuperior',
	    'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', 'twodotenleader', 'onedotenleader',
	    'comma', 'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle',
	    'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'colon',
	    'semicolon', 'commasuperior', 'threequartersemdash', 'periodsuperior', 'questionsmall', '', 'asuperior',
	    'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', '', '', 'isuperior', '', '', 'lsuperior', 'msuperior',
	    'nsuperior', 'osuperior', '', '', 'rsuperior', 'ssuperior', 'tsuperior', '', 'ff', 'fi', 'fl', 'ffi', 'ffl',
	    'parenleftinferior', '', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
	    'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
	    'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
	    'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', '', '', '', '', '', '', '',
	    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
	    'exclamdownsmall', 'centoldstyle', 'Lslashsmall', '', '', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall',
	    'Brevesmall', 'Caronsmall', '', 'Dotaccentsmall', '', '', 'Macronsmall', '', '', 'figuredash', 'hypheninferior',
	    '', '', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall', '', '', '', 'onequarter', 'onehalf', 'threequarters',
	    'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds', '',
	    '', 'zerosuperior', 'onesuperior', 'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior',
	    'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior',
	    'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior',
	    'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior', 'commainferior', 'Agravesmall',
	    'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall',
	    'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall',
	    'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall', 'Oacutesmall',
	    'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall',
	    'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall'];

	var standardNames = [
	    '.notdef', '.null', 'nonmarkingreturn', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent',
	    'ampersand', 'quotesingle', 'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash',
	    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less',
	    'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
	    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright',
	    'asciicircum', 'underscore', 'grave', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
	    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde',
	    'Adieresis', 'Aring', 'Ccedilla', 'Eacute', 'Ntilde', 'Odieresis', 'Udieresis', 'aacute', 'agrave',
	    'acircumflex', 'adieresis', 'atilde', 'aring', 'ccedilla', 'eacute', 'egrave', 'ecircumflex', 'edieresis',
	    'iacute', 'igrave', 'icircumflex', 'idieresis', 'ntilde', 'oacute', 'ograve', 'ocircumflex', 'odieresis',
	    'otilde', 'uacute', 'ugrave', 'ucircumflex', 'udieresis', 'dagger', 'degree', 'cent', 'sterling', 'section',
	    'bullet', 'paragraph', 'germandbls', 'registered', 'copyright', 'trademark', 'acute', 'dieresis', 'notequal',
	    'AE', 'Oslash', 'infinity', 'plusminus', 'lessequal', 'greaterequal', 'yen', 'mu', 'partialdiff', 'summation',
	    'product', 'pi', 'integral', 'ordfeminine', 'ordmasculine', 'Omega', 'ae', 'oslash', 'questiondown',
	    'exclamdown', 'logicalnot', 'radical', 'florin', 'approxequal', 'Delta', 'guillemotleft', 'guillemotright',
	    'ellipsis', 'nonbreakingspace', 'Agrave', 'Atilde', 'Otilde', 'OE', 'oe', 'endash', 'emdash', 'quotedblleft',
	    'quotedblright', 'quoteleft', 'quoteright', 'divide', 'lozenge', 'ydieresis', 'Ydieresis', 'fraction',
	    'currency', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'daggerdbl', 'periodcentered', 'quotesinglbase',
	    'quotedblbase', 'perthousand', 'Acircumflex', 'Ecircumflex', 'Aacute', 'Edieresis', 'Egrave', 'Iacute',
	    'Icircumflex', 'Idieresis', 'Igrave', 'Oacute', 'Ocircumflex', 'apple', 'Ograve', 'Uacute', 'Ucircumflex',
	    'Ugrave', 'dotlessi', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'ring', 'cedilla', 'hungarumlaut',
	    'ogonek', 'caron', 'Lslash', 'lslash', 'Scaron', 'scaron', 'Zcaron', 'zcaron', 'brokenbar', 'Eth', 'eth',
	    'Yacute', 'yacute', 'Thorn', 'thorn', 'minus', 'multiply', 'onesuperior', 'twosuperior', 'threesuperior',
	    'onehalf', 'onequarter', 'threequarters', 'franc', 'Gbreve', 'gbreve', 'Idotaccent', 'Scedilla', 'scedilla',
	    'Cacute', 'cacute', 'Ccaron', 'ccaron', 'dcroat'];

	/**
	 * This is the encoding used for fonts created from scratch.
	 * It loops through all glyphs and finds the appropriate unicode value.
	 * Since it's linear time, other encodings will be faster.
	 * @exports opentype.DefaultEncoding
	 * @class
	 * @constructor
	 * @param {opentype.Font}
	 */
	function DefaultEncoding(font) {
	    this.font = font;
	}

	DefaultEncoding.prototype.charToGlyphIndex = function(c) {
	    var code = c.codePointAt(0);
	    var glyphs = this.font.glyphs;
	    if (glyphs) {
	        for (var i = 0; i < glyphs.length; i += 1) {
	            var glyph = glyphs.get(i);
	            for (var j = 0; j < glyph.unicodes.length; j += 1) {
	                if (glyph.unicodes[j] === code) {
	                    return i;
	                }
	            }
	        }
	    }
	    return null;
	};

	/**
	 * @exports opentype.CmapEncoding
	 * @class
	 * @constructor
	 * @param {Object} cmap - a object with the cmap encoded data
	 */
	function CmapEncoding(cmap) {
	    this.cmap = cmap;
	}

	/**
	 * @param  {string} c - the character
	 * @return {number} The glyph index.
	 */
	CmapEncoding.prototype.charToGlyphIndex = function(c) {
	    return this.cmap.glyphIndexMap[c.codePointAt(0)] || 0;
	};

	/**
	 * @exports opentype.CffEncoding
	 * @class
	 * @constructor
	 * @param {string} encoding - The encoding
	 * @param {Array} charset - The character set.
	 */
	function CffEncoding(encoding, charset) {
	    this.encoding = encoding;
	    this.charset = charset;
	}

	/**
	 * @param  {string} s - The character
	 * @return {number} The index.
	 */
	CffEncoding.prototype.charToGlyphIndex = function(s) {
	    var code = s.codePointAt(0);
	    var charName = this.encoding[code];
	    return this.charset.indexOf(charName);
	};

	/**
	 * @exports opentype.GlyphNames
	 * @class
	 * @constructor
	 * @param {Object} post
	 */
	function GlyphNames(post) {
	    var this$1 = this;

	    switch (post.version) {
	        case 1:
	            this.names = standardNames.slice();
	            break;
	        case 2:
	            this.names = new Array(post.numberOfGlyphs);
	            for (var i = 0; i < post.numberOfGlyphs; i++) {
	                if (post.glyphNameIndex[i] < standardNames.length) {
	                    this$1.names[i] = standardNames[post.glyphNameIndex[i]];
	                } else {
	                    this$1.names[i] = post.names[post.glyphNameIndex[i] - standardNames.length];
	                }
	            }

	            break;
	        case 2.5:
	            this.names = new Array(post.numberOfGlyphs);
	            for (var i$1 = 0; i$1 < post.numberOfGlyphs; i$1++) {
	                this$1.names[i$1] = standardNames[i$1 + post.glyphNameIndex[i$1]];
	            }

	            break;
	        case 3:
	            this.names = [];
	            break;
	        default:
	            this.names = [];
	            break;
	    }
	}

	/**
	 * Gets the index of a glyph by name.
	 * @param  {string} name - The glyph name
	 * @return {number} The index
	 */
	GlyphNames.prototype.nameToGlyphIndex = function(name) {
	    return this.names.indexOf(name);
	};

	/**
	 * @param  {number} gid
	 * @return {string}
	 */
	GlyphNames.prototype.glyphIndexToName = function(gid) {
	    return this.names[gid];
	};

	/**
	 * @alias opentype.addGlyphNames
	 * @param {opentype.Font}
	 */
	function addGlyphNames(font) {
	    var glyph;
	    var glyphIndexMap = font.tables.cmap.glyphIndexMap;
	    var charCodes = Object.keys(glyphIndexMap);

	    for (var i = 0; i < charCodes.length; i += 1) {
	        var c = charCodes[i];
	        var glyphIndex = glyphIndexMap[c];
	        glyph = font.glyphs.get(glyphIndex);
	        glyph.addUnicode(parseInt(c));
	    }

	    for (var i$1 = 0; i$1 < font.glyphs.length; i$1 += 1) {
	        glyph = font.glyphs.get(i$1);
	        if (font.cffEncoding) {
	            if (font.isCIDFont) {
	                glyph.name = 'gid' + i$1;
	            } else {
	                glyph.name = font.cffEncoding.charset[i$1];
	            }
	        } else if (font.glyphNames.names) {
	            glyph.name = font.glyphNames.glyphIndexToName(i$1);
	        }
	    }
	}

	// Drawing utility functions.

	// Draw a line on the given context from point `x1,y1` to point `x2,y2`.
	function line(ctx, x1, y1, x2, y2) {
	    ctx.beginPath();
	    ctx.moveTo(x1, y1);
	    ctx.lineTo(x2, y2);
	    ctx.stroke();
	}

	var draw = { line: line };

	// The Glyph object
	// import glyf from './tables/glyf' Can't be imported here, because it's a circular dependency

	function getPathDefinition(glyph, path) {
	    var _path = path || new Path();
	    return {
	        configurable: true,

	        get: function() {
	            if (typeof _path === 'function') {
	                _path = _path();
	            }

	            return _path;
	        },

	        set: function(p) {
	            _path = p;
	        }
	    };
	}
	/**
	 * @typedef GlyphOptions
	 * @type Object
	 * @property {string} [name] - The glyph name
	 * @property {number} [unicode]
	 * @property {Array} [unicodes]
	 * @property {number} [xMin]
	 * @property {number} [yMin]
	 * @property {number} [xMax]
	 * @property {number} [yMax]
	 * @property {number} [advanceWidth]
	 */

	// A Glyph is an individual mark that often corresponds to a character.
	// Some glyphs, such as ligatures, are a combination of many characters.
	// Glyphs are the basic building blocks of a font.
	//
	// The `Glyph` class contains utility methods for drawing the path and its points.
	/**
	 * @exports opentype.Glyph
	 * @class
	 * @param {GlyphOptions}
	 * @constructor
	 */
	function Glyph(options) {
	    // By putting all the code on a prototype function (which is only declared once)
	    // we reduce the memory requirements for larger fonts by some 2%
	    this.bindConstructorValues(options);
	}

	/**
	 * @param  {GlyphOptions}
	 */
	Glyph.prototype.bindConstructorValues = function(options) {
	    this.index = options.index || 0;

	    // These three values cannot be deferred for memory optimization:
	    this.name = options.name || null;
	    this.unicode = options.unicode || undefined;
	    this.unicodes = options.unicodes || options.unicode !== undefined ? [options.unicode] : [];

	    // But by binding these values only when necessary, we reduce can
	    // the memory requirements by almost 3% for larger fonts.
	    if (options.xMin) {
	        this.xMin = options.xMin;
	    }

	    if (options.yMin) {
	        this.yMin = options.yMin;
	    }

	    if (options.xMax) {
	        this.xMax = options.xMax;
	    }

	    if (options.yMax) {
	        this.yMax = options.yMax;
	    }

	    if (options.advanceWidth) {
	        this.advanceWidth = options.advanceWidth;
	    }

	    // The path for a glyph is the most memory intensive, and is bound as a value
	    // with a getter/setter to ensure we actually do path parsing only once the
	    // path is actually needed by anything.
	    Object.defineProperty(this, 'path', getPathDefinition(this, options.path));
	};

	/**
	 * @param {number}
	 */
	Glyph.prototype.addUnicode = function(unicode) {
	    if (this.unicodes.length === 0) {
	        this.unicode = unicode;
	    }

	    this.unicodes.push(unicode);
	};

	/**
	 * Calculate the minimum bounding box for this glyph.
	 * @return {opentype.BoundingBox}
	 */
	Glyph.prototype.getBoundingBox = function() {
	    return this.path.getBoundingBox();
	};

	/**
	 * Convert the glyph to a Path we can draw on a drawing context.
	 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 * @param  {Object=} options - xScale, yScale to stretch the glyph.
	 * @param  {opentype.Font} if hinting is to be used, the font
	 * @return {opentype.Path}
	 */
	Glyph.prototype.getPath = function(x, y, fontSize, options, font) {
	    x = x !== undefined ? x : 0;
	    y = y !== undefined ? y : 0;
	    fontSize = fontSize !== undefined ? fontSize : 72;
	    var commands;
	    var hPoints;
	    if (!options) { options = { }; }
	    var xScale = options.xScale;
	    var yScale = options.yScale;

	    if (options.hinting && font && font.hinting) {
	        // in case of hinting, the hinting engine takes care
	        // of scaling the points (not the path) before hinting.
	        hPoints = this.path && font.hinting.exec(this, fontSize);
	        // in case the hinting engine failed hPoints is undefined
	        // and thus reverts to plain rending
	    }

	    if (hPoints) {
	        // Call font.hinting.getCommands instead of `glyf.getPath(hPoints).commands` to avoid a circular dependency
	        commands = font.hinting.getCommands(hPoints);
	        x = Math.round(x);
	        y = Math.round(y);
	        // TODO in case of hinting xyScaling is not yet supported
	        xScale = yScale = 1;
	    } else {
	        commands = this.path.commands;
	        var scale = 1 / this.path.unitsPerEm * fontSize;
	        if (xScale === undefined) { xScale = scale; }
	        if (yScale === undefined) { yScale = scale; }
	    }

	    var p = new Path();
	    for (var i = 0; i < commands.length; i += 1) {
	        var cmd = commands[i];
	        if (cmd.type === 'M') {
	            p.moveTo(x + (cmd.x * xScale), y + (-cmd.y * yScale));
	        } else if (cmd.type === 'L') {
	            p.lineTo(x + (cmd.x * xScale), y + (-cmd.y * yScale));
	        } else if (cmd.type === 'Q') {
	            p.quadraticCurveTo(x + (cmd.x1 * xScale), y + (-cmd.y1 * yScale),
	                               x + (cmd.x * xScale), y + (-cmd.y * yScale));
	        } else if (cmd.type === 'C') {
	            p.curveTo(x + (cmd.x1 * xScale), y + (-cmd.y1 * yScale),
	                      x + (cmd.x2 * xScale), y + (-cmd.y2 * yScale),
	                      x + (cmd.x * xScale), y + (-cmd.y * yScale));
	        } else if (cmd.type === 'Z') {
	            p.closePath();
	        }
	    }

	    return p;
	};

	/**
	 * Split the glyph into contours.
	 * This function is here for backwards compatibility, and to
	 * provide raw access to the TrueType glyph outlines.
	 * @return {Array}
	 */
	Glyph.prototype.getContours = function() {
	    var this$1 = this;

	    if (this.points === undefined) {
	        return [];
	    }

	    var contours = [];
	    var currentContour = [];
	    for (var i = 0; i < this.points.length; i += 1) {
	        var pt = this$1.points[i];
	        currentContour.push(pt);
	        if (pt.lastPointOfContour) {
	            contours.push(currentContour);
	            currentContour = [];
	        }
	    }

	    check.argument(currentContour.length === 0, 'There are still points left in the current contour.');
	    return contours;
	};

	/**
	 * Calculate the xMin/yMin/xMax/yMax/lsb/rsb for a Glyph.
	 * @return {Object}
	 */
	Glyph.prototype.getMetrics = function() {
	    var commands = this.path.commands;
	    var xCoords = [];
	    var yCoords = [];
	    for (var i = 0; i < commands.length; i += 1) {
	        var cmd = commands[i];
	        if (cmd.type !== 'Z') {
	            xCoords.push(cmd.x);
	            yCoords.push(cmd.y);
	        }

	        if (cmd.type === 'Q' || cmd.type === 'C') {
	            xCoords.push(cmd.x1);
	            yCoords.push(cmd.y1);
	        }

	        if (cmd.type === 'C') {
	            xCoords.push(cmd.x2);
	            yCoords.push(cmd.y2);
	        }
	    }

	    var metrics = {
	        xMin: Math.min.apply(null, xCoords),
	        yMin: Math.min.apply(null, yCoords),
	        xMax: Math.max.apply(null, xCoords),
	        yMax: Math.max.apply(null, yCoords),
	        leftSideBearing: this.leftSideBearing
	    };

	    if (!isFinite(metrics.xMin)) {
	        metrics.xMin = 0;
	    }

	    if (!isFinite(metrics.xMax)) {
	        metrics.xMax = this.advanceWidth;
	    }

	    if (!isFinite(metrics.yMin)) {
	        metrics.yMin = 0;
	    }

	    if (!isFinite(metrics.yMax)) {
	        metrics.yMax = 0;
	    }

	    metrics.rightSideBearing = this.advanceWidth - metrics.leftSideBearing - (metrics.xMax - metrics.xMin);
	    return metrics;
	};

	/**
	 * Draw the glyph on the given context.
	 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
	 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 * @param  {Object=} options - xScale, yScale to stretch the glyph.
	 */
	Glyph.prototype.draw = function(ctx, x, y, fontSize, options) {
	    this.getPath(x, y, fontSize, options).draw(ctx);
	};

	/**
	 * Draw the points of the glyph.
	 * On-curve points will be drawn in blue, off-curve points will be drawn in red.
	 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
	 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 */
	Glyph.prototype.drawPoints = function(ctx, x, y, fontSize) {
	    function drawCircles(l, x, y, scale) {
	        var PI_SQ = Math.PI * 2;
	        ctx.beginPath();
	        for (var j = 0; j < l.length; j += 1) {
	            ctx.moveTo(x + (l[j].x * scale), y + (l[j].y * scale));
	            ctx.arc(x + (l[j].x * scale), y + (l[j].y * scale), 2, 0, PI_SQ, false);
	        }

	        ctx.closePath();
	        ctx.fill();
	    }

	    x = x !== undefined ? x : 0;
	    y = y !== undefined ? y : 0;
	    fontSize = fontSize !== undefined ? fontSize : 24;
	    var scale = 1 / this.path.unitsPerEm * fontSize;

	    var blueCircles = [];
	    var redCircles = [];
	    var path = this.path;
	    for (var i = 0; i < path.commands.length; i += 1) {
	        var cmd = path.commands[i];
	        if (cmd.x !== undefined) {
	            blueCircles.push({x: cmd.x, y: -cmd.y});
	        }

	        if (cmd.x1 !== undefined) {
	            redCircles.push({x: cmd.x1, y: -cmd.y1});
	        }

	        if (cmd.x2 !== undefined) {
	            redCircles.push({x: cmd.x2, y: -cmd.y2});
	        }
	    }

	    ctx.fillStyle = 'blue';
	    drawCircles(blueCircles, x, y, scale);
	    ctx.fillStyle = 'red';
	    drawCircles(redCircles, x, y, scale);
	};

	/**
	 * Draw lines indicating important font measurements.
	 * Black lines indicate the origin of the coordinate system (point 0,0).
	 * Blue lines indicate the glyph bounding box.
	 * Green line indicates the advance width of the glyph.
	 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
	 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 */
	Glyph.prototype.drawMetrics = function(ctx, x, y, fontSize) {
	    var scale;
	    x = x !== undefined ? x : 0;
	    y = y !== undefined ? y : 0;
	    fontSize = fontSize !== undefined ? fontSize : 24;
	    scale = 1 / this.path.unitsPerEm * fontSize;
	    ctx.lineWidth = 1;

	    // Draw the origin
	    ctx.strokeStyle = 'black';
	    draw.line(ctx, x, -10000, x, 10000);
	    draw.line(ctx, -10000, y, 10000, y);

	    // This code is here due to memory optimization: by not using
	    // defaults in the constructor, we save a notable amount of memory.
	    var xMin = this.xMin || 0;
	    var yMin = this.yMin || 0;
	    var xMax = this.xMax || 0;
	    var yMax = this.yMax || 0;
	    var advanceWidth = this.advanceWidth || 0;

	    // Draw the glyph box
	    ctx.strokeStyle = 'blue';
	    draw.line(ctx, x + (xMin * scale), -10000, x + (xMin * scale), 10000);
	    draw.line(ctx, x + (xMax * scale), -10000, x + (xMax * scale), 10000);
	    draw.line(ctx, -10000, y + (-yMin * scale), 10000, y + (-yMin * scale));
	    draw.line(ctx, -10000, y + (-yMax * scale), 10000, y + (-yMax * scale));

	    // Draw the advance width
	    ctx.strokeStyle = 'green';
	    draw.line(ctx, x + (advanceWidth * scale), -10000, x + (advanceWidth * scale), 10000);
	};

	// The GlyphSet object

	// Define a property on the glyph that depends on the path being loaded.
	function defineDependentProperty(glyph, externalName, internalName) {
	    Object.defineProperty(glyph, externalName, {
	        get: function() {
	            // Request the path property to make sure the path is loaded.
	            glyph.path; // jshint ignore:line
	            return glyph[internalName];
	        },
	        set: function(newValue) {
	            glyph[internalName] = newValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	}

	/**
	 * A GlyphSet represents all glyphs available in the font, but modelled using
	 * a deferred glyph loader, for retrieving glyphs only once they are absolutely
	 * necessary, to keep the memory footprint down.
	 * @exports opentype.GlyphSet
	 * @class
	 * @param {opentype.Font}
	 * @param {Array}
	 */
	function GlyphSet(font, glyphs) {
	    var this$1 = this;

	    this.font = font;
	    this.glyphs = {};
	    if (Array.isArray(glyphs)) {
	        for (var i = 0; i < glyphs.length; i++) {
	            this$1.glyphs[i] = glyphs[i];
	        }
	    }

	    this.length = (glyphs && glyphs.length) || 0;
	}

	/**
	 * @param  {number} index
	 * @return {opentype.Glyph}
	 */
	GlyphSet.prototype.get = function(index) {
	    if (typeof this.glyphs[index] === 'function') {
	        this.glyphs[index] = this.glyphs[index]();
	    }

	    return this.glyphs[index];
	};

	/**
	 * @param  {number} index
	 * @param  {Object}
	 */
	GlyphSet.prototype.push = function(index, loader) {
	    this.glyphs[index] = loader;
	    this.length++;
	};

	/**
	 * @alias opentype.glyphLoader
	 * @param  {opentype.Font} font
	 * @param  {number} index
	 * @return {opentype.Glyph}
	 */
	function glyphLoader(font, index) {
	    return new Glyph({index: index, font: font});
	}

	/**
	 * Generate a stub glyph that can be filled with all metadata *except*
	 * the "points" and "path" properties, which must be loaded only once
	 * the glyph's path is actually requested for text shaping.
	 * @alias opentype.ttfGlyphLoader
	 * @param  {opentype.Font} font
	 * @param  {number} index
	 * @param  {Function} parseGlyph
	 * @param  {Object} data
	 * @param  {number} position
	 * @param  {Function} buildPath
	 * @return {opentype.Glyph}
	 */
	function ttfGlyphLoader(font, index, parseGlyph, data, position, buildPath) {
	    return function() {
	        var glyph = new Glyph({index: index, font: font});

	        glyph.path = function() {
	            parseGlyph(glyph, data, position);
	            var path = buildPath(font.glyphs, glyph);
	            path.unitsPerEm = font.unitsPerEm;
	            return path;
	        };

	        defineDependentProperty(glyph, 'xMin', '_xMin');
	        defineDependentProperty(glyph, 'xMax', '_xMax');
	        defineDependentProperty(glyph, 'yMin', '_yMin');
	        defineDependentProperty(glyph, 'yMax', '_yMax');

	        return glyph;
	    };
	}
	/**
	 * @alias opentype.cffGlyphLoader
	 * @param  {opentype.Font} font
	 * @param  {number} index
	 * @param  {Function} parseCFFCharstring
	 * @param  {string} charstring
	 * @return {opentype.Glyph}
	 */
	function cffGlyphLoader(font, index, parseCFFCharstring, charstring) {
	    return function() {
	        var glyph = new Glyph({index: index, font: font});

	        glyph.path = function() {
	            var path = parseCFFCharstring(font, glyph, charstring);
	            path.unitsPerEm = font.unitsPerEm;
	            return path;
	        };

	        return glyph;
	    };
	}

	var glyphset = { GlyphSet: GlyphSet, glyphLoader: glyphLoader, ttfGlyphLoader: ttfGlyphLoader, cffGlyphLoader: cffGlyphLoader };

	// The `CFF` table contains the glyph outlines in PostScript format.

	// Custom equals function that can also check lists.
	function equals(a, b) {
	    if (a === b) {
	        return true;
	    } else if (Array.isArray(a) && Array.isArray(b)) {
	        if (a.length !== b.length) {
	            return false;
	        }

	        for (var i = 0; i < a.length; i += 1) {
	            if (!equals(a[i], b[i])) {
	                return false;
	            }
	        }

	        return true;
	    } else {
	        return false;
	    }
	}

	// Subroutines are encoded using the negative half of the number space.
	// See type 2 chapter 4.7 "Subroutine operators".
	function calcCFFSubroutineBias(subrs) {
	    var bias;
	    if (subrs.length < 1240) {
	        bias = 107;
	    } else if (subrs.length < 33900) {
	        bias = 1131;
	    } else {
	        bias = 32768;
	    }

	    return bias;
	}

	// Parse a `CFF` INDEX array.
	// An index array consists of a list of offsets, then a list of objects at those offsets.
	function parseCFFIndex(data, start, conversionFn) {
	    var offsets = [];
	    var objects = [];
	    var count = parse.getCard16(data, start);
	    var objectOffset;
	    var endOffset;
	    if (count !== 0) {
	        var offsetSize = parse.getByte(data, start + 2);
	        objectOffset = start + ((count + 1) * offsetSize) + 2;
	        var pos = start + 3;
	        for (var i = 0; i < count + 1; i += 1) {
	            offsets.push(parse.getOffset(data, pos, offsetSize));
	            pos += offsetSize;
	        }

	        // The total size of the index array is 4 header bytes + the value of the last offset.
	        endOffset = objectOffset + offsets[count];
	    } else {
	        endOffset = start + 2;
	    }

	    for (var i$1 = 0; i$1 < offsets.length - 1; i$1 += 1) {
	        var value = parse.getBytes(data, objectOffset + offsets[i$1], objectOffset + offsets[i$1 + 1]);
	        if (conversionFn) {
	            value = conversionFn(value);
	        }

	        objects.push(value);
	    }

	    return {objects: objects, startOffset: start, endOffset: endOffset};
	}

	// Parse a `CFF` DICT real value.
	function parseFloatOperand(parser) {
	    var s = '';
	    var eof = 15;
	    var lookup = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'E', 'E-', null, '-'];
	    while (true) {
	        var b = parser.parseByte();
	        var n1 = b >> 4;
	        var n2 = b & 15;

	        if (n1 === eof) {
	            break;
	        }

	        s += lookup[n1];

	        if (n2 === eof) {
	            break;
	        }

	        s += lookup[n2];
	    }

	    return parseFloat(s);
	}

	// Parse a `CFF` DICT operand.
	function parseOperand(parser, b0) {
	    var b1;
	    var b2;
	    var b3;
	    var b4;
	    if (b0 === 28) {
	        b1 = parser.parseByte();
	        b2 = parser.parseByte();
	        return b1 << 8 | b2;
	    }

	    if (b0 === 29) {
	        b1 = parser.parseByte();
	        b2 = parser.parseByte();
	        b3 = parser.parseByte();
	        b4 = parser.parseByte();
	        return b1 << 24 | b2 << 16 | b3 << 8 | b4;
	    }

	    if (b0 === 30) {
	        return parseFloatOperand(parser);
	    }

	    if (b0 >= 32 && b0 <= 246) {
	        return b0 - 139;
	    }

	    if (b0 >= 247 && b0 <= 250) {
	        b1 = parser.parseByte();
	        return (b0 - 247) * 256 + b1 + 108;
	    }

	    if (b0 >= 251 && b0 <= 254) {
	        b1 = parser.parseByte();
	        return -(b0 - 251) * 256 - b1 - 108;
	    }

	    throw new Error('Invalid b0 ' + b0);
	}

	// Convert the entries returned by `parseDict` to a proper dictionary.
	// If a value is a list of one, it is unpacked.
	function entriesToObject(entries) {
	    var o = {};
	    for (var i = 0; i < entries.length; i += 1) {
	        var key = entries[i][0];
	        var values = entries[i][1];
	        var value = (void 0);
	        if (values.length === 1) {
	            value = values[0];
	        } else {
	            value = values;
	        }

	        if (o.hasOwnProperty(key) && !isNaN(o[key])) {
	            throw new Error('Object ' + o + ' already has key ' + key);
	        }

	        o[key] = value;
	    }

	    return o;
	}

	// Parse a `CFF` DICT object.
	// A dictionary contains key-value pairs in a compact tokenized format.
	function parseCFFDict(data, start, size) {
	    start = start !== undefined ? start : 0;
	    var parser = new parse.Parser(data, start);
	    var entries = [];
	    var operands = [];
	    size = size !== undefined ? size : data.length;

	    while (parser.relativeOffset < size) {
	        var op = parser.parseByte();

	        // The first byte for each dict item distinguishes between operator (key) and operand (value).
	        // Values <= 21 are operators.
	        if (op <= 21) {
	            // Two-byte operators have an initial escape byte of 12.
	            if (op === 12) {
	                op = 1200 + parser.parseByte();
	            }

	            entries.push([op, operands]);
	            operands = [];
	        } else {
	            // Since the operands (values) come before the operators (keys), we store all operands in a list
	            // until we encounter an operator.
	            operands.push(parseOperand(parser, op));
	        }
	    }

	    return entriesToObject(entries);
	}

	// Given a String Index (SID), return the value of the string.
	// Strings below index 392 are standard CFF strings and are not encoded in the font.
	function getCFFString(strings, index) {
	    if (index <= 390) {
	        index = cffStandardStrings[index];
	    } else {
	        index = strings[index - 391];
	    }

	    return index;
	}

	// Interpret a dictionary and return a new dictionary with readable keys and values for missing entries.
	// This function takes `meta` which is a list of objects containing `operand`, `name` and `default`.
	function interpretDict(dict, meta, strings) {
	    var newDict = {};
	    var value;

	    // Because we also want to include missing values, we start out from the meta list
	    // and lookup values in the dict.
	    for (var i = 0; i < meta.length; i += 1) {
	        var m = meta[i];

	        if (Array.isArray(m.type)) {
	            var values = [];
	            values.length = m.type.length;
	            for (var j = 0; j < m.type.length; j++) {
	                value = dict[m.op] !== undefined ? dict[m.op][j] : undefined;
	                if (value === undefined) {
	                    value = m.value !== undefined && m.value[j] !== undefined ? m.value[j] : null;
	                }
	                if (m.type[j] === 'SID') {
	                    value = getCFFString(strings, value);
	                }
	                values[j] = value;
	            }
	            newDict[m.name] = values;
	        } else {
	            value = dict[m.op];
	            if (value === undefined) {
	                value = m.value !== undefined ? m.value : null;
	            }

	            if (m.type === 'SID') {
	                value = getCFFString(strings, value);
	            }
	            newDict[m.name] = value;
	        }
	    }

	    return newDict;
	}

	// Parse the CFF header.
	function parseCFFHeader(data, start) {
	    var header = {};
	    header.formatMajor = parse.getCard8(data, start);
	    header.formatMinor = parse.getCard8(data, start + 1);
	    header.size = parse.getCard8(data, start + 2);
	    header.offsetSize = parse.getCard8(data, start + 3);
	    header.startOffset = start;
	    header.endOffset = start + 4;
	    return header;
	}

	var TOP_DICT_META = [
	    {name: 'version', op: 0, type: 'SID'},
	    {name: 'notice', op: 1, type: 'SID'},
	    {name: 'copyright', op: 1200, type: 'SID'},
	    {name: 'fullName', op: 2, type: 'SID'},
	    {name: 'familyName', op: 3, type: 'SID'},
	    {name: 'weight', op: 4, type: 'SID'},
	    {name: 'isFixedPitch', op: 1201, type: 'number', value: 0},
	    {name: 'italicAngle', op: 1202, type: 'number', value: 0},
	    {name: 'underlinePosition', op: 1203, type: 'number', value: -100},
	    {name: 'underlineThickness', op: 1204, type: 'number', value: 50},
	    {name: 'paintType', op: 1205, type: 'number', value: 0},
	    {name: 'charstringType', op: 1206, type: 'number', value: 2},
	    {
	        name: 'fontMatrix',
	        op: 1207,
	        type: ['real', 'real', 'real', 'real', 'real', 'real'],
	        value: [0.001, 0, 0, 0.001, 0, 0]
	    },
	    {name: 'uniqueId', op: 13, type: 'number'},
	    {name: 'fontBBox', op: 5, type: ['number', 'number', 'number', 'number'], value: [0, 0, 0, 0]},
	    {name: 'strokeWidth', op: 1208, type: 'number', value: 0},
	    {name: 'xuid', op: 14, type: [], value: null},
	    {name: 'charset', op: 15, type: 'offset', value: 0},
	    {name: 'encoding', op: 16, type: 'offset', value: 0},
	    {name: 'charStrings', op: 17, type: 'offset', value: 0},
	    {name: 'private', op: 18, type: ['number', 'offset'], value: [0, 0]},
	    {name: 'ros', op: 1230, type: ['SID', 'SID', 'number']},
	    {name: 'cidFontVersion', op: 1231, type: 'number', value: 0},
	    {name: 'cidFontRevision', op: 1232, type: 'number', value: 0},
	    {name: 'cidFontType', op: 1233, type: 'number', value: 0},
	    {name: 'cidCount', op: 1234, type: 'number', value: 8720},
	    {name: 'uidBase', op: 1235, type: 'number'},
	    {name: 'fdArray', op: 1236, type: 'offset'},
	    {name: 'fdSelect', op: 1237, type: 'offset'},
	    {name: 'fontName', op: 1238, type: 'SID'}
	];

	var PRIVATE_DICT_META = [
	    {name: 'subrs', op: 19, type: 'offset', value: 0},
	    {name: 'defaultWidthX', op: 20, type: 'number', value: 0},
	    {name: 'nominalWidthX', op: 21, type: 'number', value: 0}
	];

	// Parse the CFF top dictionary. A CFF table can contain multiple fonts, each with their own top dictionary.
	// The top dictionary contains the essential metadata for the font, together with the private dictionary.
	function parseCFFTopDict(data, strings) {
	    var dict = parseCFFDict(data, 0, data.byteLength);
	    return interpretDict(dict, TOP_DICT_META, strings);
	}

	// Parse the CFF private dictionary. We don't fully parse out all the values, only the ones we need.
	function parseCFFPrivateDict(data, start, size, strings) {
	    var dict = parseCFFDict(data, start, size);
	    return interpretDict(dict, PRIVATE_DICT_META, strings);
	}

	// Returns a list of "Top DICT"s found using an INDEX list.
	// Used to read both the usual high-level Top DICTs and also the FDArray
	// discovered inside CID-keyed fonts.  When a Top DICT has a reference to
	// a Private DICT that is read and saved into the Top DICT.
	//
	// In addition to the expected/optional values as outlined in TOP_DICT_META
	// the following values might be saved into the Top DICT.
	//
	//    _subrs []        array of local CFF subroutines from Private DICT
	//    _subrsBias       bias value computed from number of subroutines
	//                      (see calcCFFSubroutineBias() and parseCFFCharstring())
	//    _defaultWidthX   default widths for CFF characters
	//    _nominalWidthX   bias added to width embedded within glyph description
	//
	//    _privateDict     saved copy of parsed Private DICT from Top DICT
	function gatherCFFTopDicts(data, start, cffIndex, strings) {
	    var topDictArray = [];
	    for (var iTopDict = 0; iTopDict < cffIndex.length; iTopDict += 1) {
	        var topDictData = new DataView(new Uint8Array(cffIndex[iTopDict]).buffer);
	        var topDict = parseCFFTopDict(topDictData, strings);
	        topDict._subrs = [];
	        topDict._subrsBias = 0;
	        var privateSize = topDict.private[0];
	        var privateOffset = topDict.private[1];
	        if (privateSize !== 0 && privateOffset !== 0) {
	            var privateDict = parseCFFPrivateDict(data, privateOffset + start, privateSize, strings);
	            topDict._defaultWidthX = privateDict.defaultWidthX;
	            topDict._nominalWidthX = privateDict.nominalWidthX;
	            if (privateDict.subrs !== 0) {
	                var subrOffset = privateOffset + privateDict.subrs;
	                var subrIndex = parseCFFIndex(data, subrOffset + start);
	                topDict._subrs = subrIndex.objects;
	                topDict._subrsBias = calcCFFSubroutineBias(topDict._subrs);
	            }
	            topDict._privateDict = privateDict;
	        }
	        topDictArray.push(topDict);
	    }
	    return topDictArray;
	}

	// Parse the CFF charset table, which contains internal names for all the glyphs.
	// This function will return a list of glyph names.
	// See Adobe TN #5176 chapter 13, "Charsets".
	function parseCFFCharset(data, start, nGlyphs, strings) {
	    var sid;
	    var count;
	    var parser = new parse.Parser(data, start);

	    // The .notdef glyph is not included, so subtract 1.
	    nGlyphs -= 1;
	    var charset = ['.notdef'];

	    var format = parser.parseCard8();
	    if (format === 0) {
	        for (var i = 0; i < nGlyphs; i += 1) {
	            sid = parser.parseSID();
	            charset.push(getCFFString(strings, sid));
	        }
	    } else if (format === 1) {
	        while (charset.length <= nGlyphs) {
	            sid = parser.parseSID();
	            count = parser.parseCard8();
	            for (var i$1 = 0; i$1 <= count; i$1 += 1) {
	                charset.push(getCFFString(strings, sid));
	                sid += 1;
	            }
	        }
	    } else if (format === 2) {
	        while (charset.length <= nGlyphs) {
	            sid = parser.parseSID();
	            count = parser.parseCard16();
	            for (var i$2 = 0; i$2 <= count; i$2 += 1) {
	                charset.push(getCFFString(strings, sid));
	                sid += 1;
	            }
	        }
	    } else {
	        throw new Error('Unknown charset format ' + format);
	    }

	    return charset;
	}

	// Parse the CFF encoding data. Only one encoding can be specified per font.
	// See Adobe TN #5176 chapter 12, "Encodings".
	function parseCFFEncoding(data, start, charset) {
	    var code;
	    var enc = {};
	    var parser = new parse.Parser(data, start);
	    var format = parser.parseCard8();
	    if (format === 0) {
	        var nCodes = parser.parseCard8();
	        for (var i = 0; i < nCodes; i += 1) {
	            code = parser.parseCard8();
	            enc[code] = i;
	        }
	    } else if (format === 1) {
	        var nRanges = parser.parseCard8();
	        code = 1;
	        for (var i$1 = 0; i$1 < nRanges; i$1 += 1) {
	            var first = parser.parseCard8();
	            var nLeft = parser.parseCard8();
	            for (var j = first; j <= first + nLeft; j += 1) {
	                enc[j] = code;
	                code += 1;
	            }
	        }
	    } else {
	        throw new Error('Unknown encoding format ' + format);
	    }

	    return new CffEncoding(enc, charset);
	}

	// Take in charstring code and return a Glyph object.
	// The encoding is described in the Type 2 Charstring Format
	// https://www.microsoft.com/typography/OTSPEC/charstr2.htm
	function parseCFFCharstring(font, glyph, code) {
	    var c1x;
	    var c1y;
	    var c2x;
	    var c2y;
	    var p = new Path();
	    var stack = [];
	    var nStems = 0;
	    var haveWidth = false;
	    var open = false;
	    var x = 0;
	    var y = 0;
	    var subrs;
	    var subrsBias;
	    var defaultWidthX;
	    var nominalWidthX;
	    if (font.isCIDFont) {
	        var fdIndex = font.tables.cff.topDict._fdSelect[glyph.index];
	        var fdDict = font.tables.cff.topDict._fdArray[fdIndex];
	        subrs = fdDict._subrs;
	        subrsBias = fdDict._subrsBias;
	        defaultWidthX = fdDict._defaultWidthX;
	        nominalWidthX = fdDict._nominalWidthX;
	    } else {
	        subrs = font.tables.cff.topDict._subrs;
	        subrsBias = font.tables.cff.topDict._subrsBias;
	        defaultWidthX = font.tables.cff.topDict._defaultWidthX;
	        nominalWidthX = font.tables.cff.topDict._nominalWidthX;
	    }
	    var width = defaultWidthX;

	    function newContour(x, y) {
	        if (open) {
	            p.closePath();
	        }

	        p.moveTo(x, y);
	        open = true;
	    }

	    function parseStems() {
	        var hasWidthArg;

	        // The number of stem operators on the stack is always even.
	        // If the value is uneven, that means a width is specified.
	        hasWidthArg = stack.length % 2 !== 0;
	        if (hasWidthArg && !haveWidth) {
	            width = stack.shift() + nominalWidthX;
	        }

	        nStems += stack.length >> 1;
	        stack.length = 0;
	        haveWidth = true;
	    }

	    function parse$$1(code) {
	        var b1;
	        var b2;
	        var b3;
	        var b4;
	        var codeIndex;
	        var subrCode;
	        var jpx;
	        var jpy;
	        var c3x;
	        var c3y;
	        var c4x;
	        var c4y;

	        var i = 0;
	        while (i < code.length) {
	            var v = code[i];
	            i += 1;
	            switch (v) {
	                case 1: // hstem
	                    parseStems();
	                    break;
	                case 3: // vstem
	                    parseStems();
	                    break;
	                case 4: // vmoveto
	                    if (stack.length > 1 && !haveWidth) {
	                        width = stack.shift() + nominalWidthX;
	                        haveWidth = true;
	                    }

	                    y += stack.pop();
	                    newContour(x, y);
	                    break;
	                case 5: // rlineto
	                    while (stack.length > 0) {
	                        x += stack.shift();
	                        y += stack.shift();
	                        p.lineTo(x, y);
	                    }

	                    break;
	                case 6: // hlineto
	                    while (stack.length > 0) {
	                        x += stack.shift();
	                        p.lineTo(x, y);
	                        if (stack.length === 0) {
	                            break;
	                        }

	                        y += stack.shift();
	                        p.lineTo(x, y);
	                    }

	                    break;
	                case 7: // vlineto
	                    while (stack.length > 0) {
	                        y += stack.shift();
	                        p.lineTo(x, y);
	                        if (stack.length === 0) {
	                            break;
	                        }

	                        x += stack.shift();
	                        p.lineTo(x, y);
	                    }

	                    break;
	                case 8: // rrcurveto
	                    while (stack.length > 0) {
	                        c1x = x + stack.shift();
	                        c1y = y + stack.shift();
	                        c2x = c1x + stack.shift();
	                        c2y = c1y + stack.shift();
	                        x = c2x + stack.shift();
	                        y = c2y + stack.shift();
	                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
	                    }

	                    break;
	                case 10: // callsubr
	                    codeIndex = stack.pop() + subrsBias;
	                    subrCode = subrs[codeIndex];
	                    if (subrCode) {
	                        parse$$1(subrCode);
	                    }

	                    break;
	                case 11: // return
	                    return;
	                case 12: // flex operators
	                    v = code[i];
	                    i += 1;
	                    switch (v) {
	                        case 35: // flex
	                            // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 dx6 dy6 fd flex (12 35) |-
	                            c1x = x   + stack.shift();    // dx1
	                            c1y = y   + stack.shift();    // dy1
	                            c2x = c1x + stack.shift();    // dx2
	                            c2y = c1y + stack.shift();    // dy2
	                            jpx = c2x + stack.shift();    // dx3
	                            jpy = c2y + stack.shift();    // dy3
	                            c3x = jpx + stack.shift();    // dx4
	                            c3y = jpy + stack.shift();    // dy4
	                            c4x = c3x + stack.shift();    // dx5
	                            c4y = c3y + stack.shift();    // dy5
	                            x = c4x   + stack.shift();    // dx6
	                            y = c4y   + stack.shift();    // dy6
	                            stack.shift();                // flex depth
	                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
	                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
	                            break;
	                        case 34: // hflex
	                            // |- dx1 dx2 dy2 dx3 dx4 dx5 dx6 hflex (12 34) |-
	                            c1x = x   + stack.shift();    // dx1
	                            c1y = y;                      // dy1
	                            c2x = c1x + stack.shift();    // dx2
	                            c2y = c1y + stack.shift();    // dy2
	                            jpx = c2x + stack.shift();    // dx3
	                            jpy = c2y;                    // dy3
	                            c3x = jpx + stack.shift();    // dx4
	                            c3y = c2y;                    // dy4
	                            c4x = c3x + stack.shift();    // dx5
	                            c4y = y;                      // dy5
	                            x = c4x + stack.shift();      // dx6
	                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
	                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
	                            break;
	                        case 36: // hflex1
	                            // |- dx1 dy1 dx2 dy2 dx3 dx4 dx5 dy5 dx6 hflex1 (12 36) |-
	                            c1x = x   + stack.shift();    // dx1
	                            c1y = y   + stack.shift();    // dy1
	                            c2x = c1x + stack.shift();    // dx2
	                            c2y = c1y + stack.shift();    // dy2
	                            jpx = c2x + stack.shift();    // dx3
	                            jpy = c2y;                    // dy3
	                            c3x = jpx + stack.shift();    // dx4
	                            c3y = c2y;                    // dy4
	                            c4x = c3x + stack.shift();    // dx5
	                            c4y = c3y + stack.shift();    // dy5
	                            x = c4x + stack.shift();      // dx6
	                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
	                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
	                            break;
	                        case 37: // flex1
	                            // |- dx1 dy1 dx2 dy2 dx3 dy3 dx4 dy4 dx5 dy5 d6 flex1 (12 37) |-
	                            c1x = x   + stack.shift();    // dx1
	                            c1y = y   + stack.shift();    // dy1
	                            c2x = c1x + stack.shift();    // dx2
	                            c2y = c1y + stack.shift();    // dy2
	                            jpx = c2x + stack.shift();    // dx3
	                            jpy = c2y + stack.shift();    // dy3
	                            c3x = jpx + stack.shift();    // dx4
	                            c3y = jpy + stack.shift();    // dy4
	                            c4x = c3x + stack.shift();    // dx5
	                            c4y = c3y + stack.shift();    // dy5
	                            if (Math.abs(c4x - x) > Math.abs(c4y - y)) {
	                                x = c4x + stack.shift();
	                            } else {
	                                y = c4y + stack.shift();
	                            }

	                            p.curveTo(c1x, c1y, c2x, c2y, jpx, jpy);
	                            p.curveTo(c3x, c3y, c4x, c4y, x, y);
	                            break;
	                        default:
	                            console.log('Glyph ' + glyph.index + ': unknown operator ' + 1200 + v);
	                            stack.length = 0;
	                    }
	                    break;
	                case 14: // endchar
	                    if (stack.length > 0 && !haveWidth) {
	                        width = stack.shift() + nominalWidthX;
	                        haveWidth = true;
	                    }

	                    if (open) {
	                        p.closePath();
	                        open = false;
	                    }

	                    break;
	                case 18: // hstemhm
	                    parseStems();
	                    break;
	                case 19: // hintmask
	                case 20: // cntrmask
	                    parseStems();
	                    i += (nStems + 7) >> 3;
	                    break;
	                case 21: // rmoveto
	                    if (stack.length > 2 && !haveWidth) {
	                        width = stack.shift() + nominalWidthX;
	                        haveWidth = true;
	                    }

	                    y += stack.pop();
	                    x += stack.pop();
	                    newContour(x, y);
	                    break;
	                case 22: // hmoveto
	                    if (stack.length > 1 && !haveWidth) {
	                        width = stack.shift() + nominalWidthX;
	                        haveWidth = true;
	                    }

	                    x += stack.pop();
	                    newContour(x, y);
	                    break;
	                case 23: // vstemhm
	                    parseStems();
	                    break;
	                case 24: // rcurveline
	                    while (stack.length > 2) {
	                        c1x = x + stack.shift();
	                        c1y = y + stack.shift();
	                        c2x = c1x + stack.shift();
	                        c2y = c1y + stack.shift();
	                        x = c2x + stack.shift();
	                        y = c2y + stack.shift();
	                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
	                    }

	                    x += stack.shift();
	                    y += stack.shift();
	                    p.lineTo(x, y);
	                    break;
	                case 25: // rlinecurve
	                    while (stack.length > 6) {
	                        x += stack.shift();
	                        y += stack.shift();
	                        p.lineTo(x, y);
	                    }

	                    c1x = x + stack.shift();
	                    c1y = y + stack.shift();
	                    c2x = c1x + stack.shift();
	                    c2y = c1y + stack.shift();
	                    x = c2x + stack.shift();
	                    y = c2y + stack.shift();
	                    p.curveTo(c1x, c1y, c2x, c2y, x, y);
	                    break;
	                case 26: // vvcurveto
	                    if (stack.length % 2) {
	                        x += stack.shift();
	                    }

	                    while (stack.length > 0) {
	                        c1x = x;
	                        c1y = y + stack.shift();
	                        c2x = c1x + stack.shift();
	                        c2y = c1y + stack.shift();
	                        x = c2x;
	                        y = c2y + stack.shift();
	                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
	                    }

	                    break;
	                case 27: // hhcurveto
	                    if (stack.length % 2) {
	                        y += stack.shift();
	                    }

	                    while (stack.length > 0) {
	                        c1x = x + stack.shift();
	                        c1y = y;
	                        c2x = c1x + stack.shift();
	                        c2y = c1y + stack.shift();
	                        x = c2x + stack.shift();
	                        y = c2y;
	                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
	                    }

	                    break;
	                case 28: // shortint
	                    b1 = code[i];
	                    b2 = code[i + 1];
	                    stack.push(((b1 << 24) | (b2 << 16)) >> 16);
	                    i += 2;
	                    break;
	                case 29: // callgsubr
	                    codeIndex = stack.pop() + font.gsubrsBias;
	                    subrCode = font.gsubrs[codeIndex];
	                    if (subrCode) {
	                        parse$$1(subrCode);
	                    }

	                    break;
	                case 30: // vhcurveto
	                    while (stack.length > 0) {
	                        c1x = x;
	                        c1y = y + stack.shift();
	                        c2x = c1x + stack.shift();
	                        c2y = c1y + stack.shift();
	                        x = c2x + stack.shift();
	                        y = c2y + (stack.length === 1 ? stack.shift() : 0);
	                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
	                        if (stack.length === 0) {
	                            break;
	                        }

	                        c1x = x + stack.shift();
	                        c1y = y;
	                        c2x = c1x + stack.shift();
	                        c2y = c1y + stack.shift();
	                        y = c2y + stack.shift();
	                        x = c2x + (stack.length === 1 ? stack.shift() : 0);
	                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
	                    }

	                    break;
	                case 31: // hvcurveto
	                    while (stack.length > 0) {
	                        c1x = x + stack.shift();
	                        c1y = y;
	                        c2x = c1x + stack.shift();
	                        c2y = c1y + stack.shift();
	                        y = c2y + stack.shift();
	                        x = c2x + (stack.length === 1 ? stack.shift() : 0);
	                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
	                        if (stack.length === 0) {
	                            break;
	                        }

	                        c1x = x;
	                        c1y = y + stack.shift();
	                        c2x = c1x + stack.shift();
	                        c2y = c1y + stack.shift();
	                        x = c2x + stack.shift();
	                        y = c2y + (stack.length === 1 ? stack.shift() : 0);
	                        p.curveTo(c1x, c1y, c2x, c2y, x, y);
	                    }

	                    break;
	                default:
	                    if (v < 32) {
	                        console.log('Glyph ' + glyph.index + ': unknown operator ' + v);
	                    } else if (v < 247) {
	                        stack.push(v - 139);
	                    } else if (v < 251) {
	                        b1 = code[i];
	                        i += 1;
	                        stack.push((v - 247) * 256 + b1 + 108);
	                    } else if (v < 255) {
	                        b1 = code[i];
	                        i += 1;
	                        stack.push(-(v - 251) * 256 - b1 - 108);
	                    } else {
	                        b1 = code[i];
	                        b2 = code[i + 1];
	                        b3 = code[i + 2];
	                        b4 = code[i + 3];
	                        i += 4;
	                        stack.push(((b1 << 24) | (b2 << 16) | (b3 << 8) | b4) / 65536);
	                    }
	            }
	        }
	    }

	    parse$$1(code);

	    glyph.advanceWidth = width;
	    return p;
	}

	function parseCFFFDSelect(data, start, nGlyphs, fdArrayCount) {
	    var fdSelect = [];
	    var fdIndex;
	    var parser = new parse.Parser(data, start);
	    var format = parser.parseCard8();
	    if (format === 0) {
	        // Simple list of nGlyphs elements
	        for (var iGid = 0; iGid < nGlyphs; iGid++) {
	            fdIndex = parser.parseCard8();
	            if (fdIndex >= fdArrayCount) {
	                throw new Error('CFF table CID Font FDSelect has bad FD index value ' + fdIndex + ' (FD count ' + fdArrayCount + ')');
	            }
	            fdSelect.push(fdIndex);
	        }
	    } else if (format === 3) {
	        // Ranges
	        var nRanges = parser.parseCard16();
	        var first = parser.parseCard16();
	        if (first !== 0) {
	            throw new Error('CFF Table CID Font FDSelect format 3 range has bad initial GID ' + first);
	        }
	        var next;
	        for (var iRange = 0; iRange < nRanges; iRange++) {
	            fdIndex = parser.parseCard8();
	            next = parser.parseCard16();
	            if (fdIndex >= fdArrayCount) {
	                throw new Error('CFF table CID Font FDSelect has bad FD index value ' + fdIndex + ' (FD count ' + fdArrayCount + ')');
	            }
	            if (next > nGlyphs) {
	                throw new Error('CFF Table CID Font FDSelect format 3 range has bad GID ' + next);
	            }
	            for (; first < next; first++) {
	                fdSelect.push(fdIndex);
	            }
	            first = next;
	        }
	        if (next !== nGlyphs) {
	            throw new Error('CFF Table CID Font FDSelect format 3 range has bad final GID ' + next);
	        }
	    } else {
	        throw new Error('CFF Table CID Font FDSelect table has unsupported format ' + format);
	    }
	    return fdSelect;
	}

	// Parse the `CFF` table, which contains the glyph outlines in PostScript format.
	function parseCFFTable(data, start, font) {
	    font.tables.cff = {};
	    var header = parseCFFHeader(data, start);
	    var nameIndex = parseCFFIndex(data, header.endOffset, parse.bytesToString);
	    var topDictIndex = parseCFFIndex(data, nameIndex.endOffset);
	    var stringIndex = parseCFFIndex(data, topDictIndex.endOffset, parse.bytesToString);
	    var globalSubrIndex = parseCFFIndex(data, stringIndex.endOffset);
	    font.gsubrs = globalSubrIndex.objects;
	    font.gsubrsBias = calcCFFSubroutineBias(font.gsubrs);

	    var topDictArray = gatherCFFTopDicts(data, start, topDictIndex.objects, stringIndex.objects);
	    if (topDictArray.length !== 1) {
	        throw new Error('CFF table has too many fonts in \'FontSet\' - count of fonts NameIndex.length = ' + topDictArray.length);
	    }

	    var topDict = topDictArray[0];
	    font.tables.cff.topDict = topDict;

	    if (topDict._privateDict) {
	        font.defaultWidthX = topDict._privateDict.defaultWidthX;
	        font.nominalWidthX = topDict._privateDict.nominalWidthX;
	    }

	    if (topDict.ros[0] !== undefined && topDict.ros[1] !== undefined) {
	        font.isCIDFont = true;
	    }

	    if (font.isCIDFont) {
	        var fdArrayOffset = topDict.fdArray;
	        var fdSelectOffset = topDict.fdSelect;
	        if (fdArrayOffset === 0 || fdSelectOffset === 0) {
	            throw new Error('Font is marked as a CID font, but FDArray and/or FDSelect information is missing');
	        }
	        fdArrayOffset += start;
	        var fdArrayIndex = parseCFFIndex(data, fdArrayOffset);
	        var fdArray = gatherCFFTopDicts(data, start, fdArrayIndex.objects, stringIndex.objects);
	        topDict._fdArray = fdArray;
	        fdSelectOffset += start;
	        topDict._fdSelect = parseCFFFDSelect(data, fdSelectOffset, font.numGlyphs, fdArray.length);
	    }

	    var privateDictOffset = start + topDict.private[1];
	    var privateDict = parseCFFPrivateDict(data, privateDictOffset, topDict.private[0], stringIndex.objects);
	    font.defaultWidthX = privateDict.defaultWidthX;
	    font.nominalWidthX = privateDict.nominalWidthX;

	    if (privateDict.subrs !== 0) {
	        var subrOffset = privateDictOffset + privateDict.subrs;
	        var subrIndex = parseCFFIndex(data, subrOffset);
	        font.subrs = subrIndex.objects;
	        font.subrsBias = calcCFFSubroutineBias(font.subrs);
	    } else {
	        font.subrs = [];
	        font.subrsBias = 0;
	    }

	    // Offsets in the top dict are relative to the beginning of the CFF data, so add the CFF start offset.
	    var charStringsIndex = parseCFFIndex(data, start + topDict.charStrings);
	    font.nGlyphs = charStringsIndex.objects.length;

	    var charset = parseCFFCharset(data, start + topDict.charset, font.nGlyphs, stringIndex.objects);
	    if (topDict.encoding === 0) {
	        // Standard encoding
	        font.cffEncoding = new CffEncoding(cffStandardEncoding, charset);
	    } else if (topDict.encoding === 1) {
	        // Expert encoding
	        font.cffEncoding = new CffEncoding(cffExpertEncoding, charset);
	    } else {
	        font.cffEncoding = parseCFFEncoding(data, start + topDict.encoding, charset);
	    }

	    // Prefer the CMAP encoding to the CFF encoding.
	    font.encoding = font.encoding || font.cffEncoding;

	    font.glyphs = new glyphset.GlyphSet(font);
	    for (var i = 0; i < font.nGlyphs; i += 1) {
	        var charString = charStringsIndex.objects[i];
	        font.glyphs.push(i, glyphset.cffGlyphLoader(font, i, parseCFFCharstring, charString));
	    }
	}

	// Convert a string to a String ID (SID).
	// The list of strings is modified in place.
	function encodeString(s, strings) {
	    var sid;

	    // Is the string in the CFF standard strings?
	    var i = cffStandardStrings.indexOf(s);
	    if (i >= 0) {
	        sid = i;
	    }

	    // Is the string already in the string index?
	    i = strings.indexOf(s);
	    if (i >= 0) {
	        sid = i + cffStandardStrings.length;
	    } else {
	        sid = cffStandardStrings.length + strings.length;
	        strings.push(s);
	    }

	    return sid;
	}

	function makeHeader() {
	    return new table.Record('Header', [
	        {name: 'major', type: 'Card8', value: 1},
	        {name: 'minor', type: 'Card8', value: 0},
	        {name: 'hdrSize', type: 'Card8', value: 4},
	        {name: 'major', type: 'Card8', value: 1}
	    ]);
	}

	function makeNameIndex(fontNames) {
	    var t = new table.Record('Name INDEX', [
	        {name: 'names', type: 'INDEX', value: []}
	    ]);
	    t.names = [];
	    for (var i = 0; i < fontNames.length; i += 1) {
	        t.names.push({name: 'name_' + i, type: 'NAME', value: fontNames[i]});
	    }

	    return t;
	}

	// Given a dictionary's metadata, create a DICT structure.
	function makeDict(meta, attrs, strings) {
	    var m = {};
	    for (var i = 0; i < meta.length; i += 1) {
	        var entry = meta[i];
	        var value = attrs[entry.name];
	        if (value !== undefined && !equals(value, entry.value)) {
	            if (entry.type === 'SID') {
	                value = encodeString(value, strings);
	            }

	            m[entry.op] = {name: entry.name, type: entry.type, value: value};
	        }
	    }

	    return m;
	}

	// The Top DICT houses the global font attributes.
	function makeTopDict(attrs, strings) {
	    var t = new table.Record('Top DICT', [
	        {name: 'dict', type: 'DICT', value: {}}
	    ]);
	    t.dict = makeDict(TOP_DICT_META, attrs, strings);
	    return t;
	}

	function makeTopDictIndex(topDict) {
	    var t = new table.Record('Top DICT INDEX', [
	        {name: 'topDicts', type: 'INDEX', value: []}
	    ]);
	    t.topDicts = [{name: 'topDict_0', type: 'TABLE', value: topDict}];
	    return t;
	}

	function makeStringIndex(strings) {
	    var t = new table.Record('String INDEX', [
	        {name: 'strings', type: 'INDEX', value: []}
	    ]);
	    t.strings = [];
	    for (var i = 0; i < strings.length; i += 1) {
	        t.strings.push({name: 'string_' + i, type: 'STRING', value: strings[i]});
	    }

	    return t;
	}

	function makeGlobalSubrIndex() {
	    // Currently we don't use subroutines.
	    return new table.Record('Global Subr INDEX', [
	        {name: 'subrs', type: 'INDEX', value: []}
	    ]);
	}

	function makeCharsets(glyphNames, strings) {
	    var t = new table.Record('Charsets', [
	        {name: 'format', type: 'Card8', value: 0}
	    ]);
	    for (var i = 0; i < glyphNames.length; i += 1) {
	        var glyphName = glyphNames[i];
	        var glyphSID = encodeString(glyphName, strings);
	        t.fields.push({name: 'glyph_' + i, type: 'SID', value: glyphSID});
	    }

	    return t;
	}

	function glyphToOps(glyph) {
	    var ops = [];
	    var path = glyph.path;
	    ops.push({name: 'width', type: 'NUMBER', value: glyph.advanceWidth});
	    var x = 0;
	    var y = 0;
	    for (var i = 0; i < path.commands.length; i += 1) {
	        var dx = (void 0);
	        var dy = (void 0);
	        var cmd = path.commands[i];
	        if (cmd.type === 'Q') {
	            // CFF only supports bézier curves, so convert the quad to a bézier.
	            var _13 = 1 / 3;
	            var _23 = 2 / 3;

	            // We're going to create a new command so we don't change the original path.
	            cmd = {
	                type: 'C',
	                x: cmd.x,
	                y: cmd.y,
	                x1: _13 * x + _23 * cmd.x1,
	                y1: _13 * y + _23 * cmd.y1,
	                x2: _13 * cmd.x + _23 * cmd.x1,
	                y2: _13 * cmd.y + _23 * cmd.y1
	            };
	        }

	        if (cmd.type === 'M') {
	            dx = Math.round(cmd.x - x);
	            dy = Math.round(cmd.y - y);
	            ops.push({name: 'dx', type: 'NUMBER', value: dx});
	            ops.push({name: 'dy', type: 'NUMBER', value: dy});
	            ops.push({name: 'rmoveto', type: 'OP', value: 21});
	            x = Math.round(cmd.x);
	            y = Math.round(cmd.y);
	        } else if (cmd.type === 'L') {
	            dx = Math.round(cmd.x - x);
	            dy = Math.round(cmd.y - y);
	            ops.push({name: 'dx', type: 'NUMBER', value: dx});
	            ops.push({name: 'dy', type: 'NUMBER', value: dy});
	            ops.push({name: 'rlineto', type: 'OP', value: 5});
	            x = Math.round(cmd.x);
	            y = Math.round(cmd.y);
	        } else if (cmd.type === 'C') {
	            var dx1 = Math.round(cmd.x1 - x);
	            var dy1 = Math.round(cmd.y1 - y);
	            var dx2 = Math.round(cmd.x2 - cmd.x1);
	            var dy2 = Math.round(cmd.y2 - cmd.y1);
	            dx = Math.round(cmd.x - cmd.x2);
	            dy = Math.round(cmd.y - cmd.y2);
	            ops.push({name: 'dx1', type: 'NUMBER', value: dx1});
	            ops.push({name: 'dy1', type: 'NUMBER', value: dy1});
	            ops.push({name: 'dx2', type: 'NUMBER', value: dx2});
	            ops.push({name: 'dy2', type: 'NUMBER', value: dy2});
	            ops.push({name: 'dx', type: 'NUMBER', value: dx});
	            ops.push({name: 'dy', type: 'NUMBER', value: dy});
	            ops.push({name: 'rrcurveto', type: 'OP', value: 8});
	            x = Math.round(cmd.x);
	            y = Math.round(cmd.y);
	        }

	        // Contours are closed automatically.
	    }

	    ops.push({name: 'endchar', type: 'OP', value: 14});
	    return ops;
	}

	function makeCharStringsIndex(glyphs) {
	    var t = new table.Record('CharStrings INDEX', [
	        {name: 'charStrings', type: 'INDEX', value: []}
	    ]);

	    for (var i = 0; i < glyphs.length; i += 1) {
	        var glyph = glyphs.get(i);
	        var ops = glyphToOps(glyph);
	        t.charStrings.push({name: glyph.name, type: 'CHARSTRING', value: ops});
	    }

	    return t;
	}

	function makePrivateDict(attrs, strings) {
	    var t = new table.Record('Private DICT', [
	        {name: 'dict', type: 'DICT', value: {}}
	    ]);
	    t.dict = makeDict(PRIVATE_DICT_META, attrs, strings);
	    return t;
	}

	function makeCFFTable(glyphs, options) {
	    var t = new table.Table('CFF ', [
	        {name: 'header', type: 'RECORD'},
	        {name: 'nameIndex', type: 'RECORD'},
	        {name: 'topDictIndex', type: 'RECORD'},
	        {name: 'stringIndex', type: 'RECORD'},
	        {name: 'globalSubrIndex', type: 'RECORD'},
	        {name: 'charsets', type: 'RECORD'},
	        {name: 'charStringsIndex', type: 'RECORD'},
	        {name: 'privateDict', type: 'RECORD'}
	    ]);

	    var fontScale = 1 / options.unitsPerEm;
	    // We use non-zero values for the offsets so that the DICT encodes them.
	    // This is important because the size of the Top DICT plays a role in offset calculation,
	    // and the size shouldn't change after we've written correct offsets.
	    var attrs = {
	        version: options.version,
	        fullName: options.fullName,
	        familyName: options.familyName,
	        weight: options.weightName,
	        fontBBox: options.fontBBox || [0, 0, 0, 0],
	        fontMatrix: [fontScale, 0, 0, fontScale, 0, 0],
	        charset: 999,
	        encoding: 0,
	        charStrings: 999,
	        private: [0, 999]
	    };

	    var privateAttrs = {};

	    var glyphNames = [];
	    var glyph;

	    // Skip first glyph (.notdef)
	    for (var i = 1; i < glyphs.length; i += 1) {
	        glyph = glyphs.get(i);
	        glyphNames.push(glyph.name);
	    }

	    var strings = [];

	    t.header = makeHeader();
	    t.nameIndex = makeNameIndex([options.postScriptName]);
	    var topDict = makeTopDict(attrs, strings);
	    t.topDictIndex = makeTopDictIndex(topDict);
	    t.globalSubrIndex = makeGlobalSubrIndex();
	    t.charsets = makeCharsets(glyphNames, strings);
	    t.charStringsIndex = makeCharStringsIndex(glyphs);
	    t.privateDict = makePrivateDict(privateAttrs, strings);

	    // Needs to come at the end, to encode all custom strings used in the font.
	    t.stringIndex = makeStringIndex(strings);

	    var startOffset = t.header.sizeOf() +
	        t.nameIndex.sizeOf() +
	        t.topDictIndex.sizeOf() +
	        t.stringIndex.sizeOf() +
	        t.globalSubrIndex.sizeOf();
	    attrs.charset = startOffset;

	    // We use the CFF standard encoding; proper encoding will be handled in cmap.
	    attrs.encoding = 0;
	    attrs.charStrings = attrs.charset + t.charsets.sizeOf();
	    attrs.private[1] = attrs.charStrings + t.charStringsIndex.sizeOf();

	    // Recreate the Top DICT INDEX with the correct offsets.
	    topDict = makeTopDict(attrs, strings);
	    t.topDictIndex = makeTopDictIndex(topDict);

	    return t;
	}

	var cff = { parse: parseCFFTable, make: makeCFFTable };

	// The `head` table contains global information about the font.

	// Parse the header `head` table
	function parseHeadTable(data, start) {
	    var head = {};
	    var p = new parse.Parser(data, start);
	    head.version = p.parseVersion();
	    head.fontRevision = Math.round(p.parseFixed() * 1000) / 1000;
	    head.checkSumAdjustment = p.parseULong();
	    head.magicNumber = p.parseULong();
	    check.argument(head.magicNumber === 0x5F0F3CF5, 'Font header has wrong magic number.');
	    head.flags = p.parseUShort();
	    head.unitsPerEm = p.parseUShort();
	    head.created = p.parseLongDateTime();
	    head.modified = p.parseLongDateTime();
	    head.xMin = p.parseShort();
	    head.yMin = p.parseShort();
	    head.xMax = p.parseShort();
	    head.yMax = p.parseShort();
	    head.macStyle = p.parseUShort();
	    head.lowestRecPPEM = p.parseUShort();
	    head.fontDirectionHint = p.parseShort();
	    head.indexToLocFormat = p.parseShort();
	    head.glyphDataFormat = p.parseShort();
	    return head;
	}

	function makeHeadTable(options) {
	    // Apple Mac timestamp epoch is 01/01/1904 not 01/01/1970
	    var timestamp = Math.round(new Date().getTime() / 1000) + 2082844800;
	    var createdTimestamp = timestamp;

	    if (options.createdTimestamp) {
	        createdTimestamp = options.createdTimestamp + 2082844800;
	    }

	    return new table.Table('head', [
	        {name: 'version', type: 'FIXED', value: 0x00010000},
	        {name: 'fontRevision', type: 'FIXED', value: 0x00010000},
	        {name: 'checkSumAdjustment', type: 'ULONG', value: 0},
	        {name: 'magicNumber', type: 'ULONG', value: 0x5F0F3CF5},
	        {name: 'flags', type: 'USHORT', value: 0},
	        {name: 'unitsPerEm', type: 'USHORT', value: 1000},
	        {name: 'created', type: 'LONGDATETIME', value: createdTimestamp},
	        {name: 'modified', type: 'LONGDATETIME', value: timestamp},
	        {name: 'xMin', type: 'SHORT', value: 0},
	        {name: 'yMin', type: 'SHORT', value: 0},
	        {name: 'xMax', type: 'SHORT', value: 0},
	        {name: 'yMax', type: 'SHORT', value: 0},
	        {name: 'macStyle', type: 'USHORT', value: 0},
	        {name: 'lowestRecPPEM', type: 'USHORT', value: 0},
	        {name: 'fontDirectionHint', type: 'SHORT', value: 2},
	        {name: 'indexToLocFormat', type: 'SHORT', value: 0},
	        {name: 'glyphDataFormat', type: 'SHORT', value: 0}
	    ], options);
	}

	var head = { parse: parseHeadTable, make: makeHeadTable };

	// The `hhea` table contains information for horizontal layout.

	// Parse the horizontal header `hhea` table
	function parseHheaTable(data, start) {
	    var hhea = {};
	    var p = new parse.Parser(data, start);
	    hhea.version = p.parseVersion();
	    hhea.ascender = p.parseShort();
	    hhea.descender = p.parseShort();
	    hhea.lineGap = p.parseShort();
	    hhea.advanceWidthMax = p.parseUShort();
	    hhea.minLeftSideBearing = p.parseShort();
	    hhea.minRightSideBearing = p.parseShort();
	    hhea.xMaxExtent = p.parseShort();
	    hhea.caretSlopeRise = p.parseShort();
	    hhea.caretSlopeRun = p.parseShort();
	    hhea.caretOffset = p.parseShort();
	    p.relativeOffset += 8;
	    hhea.metricDataFormat = p.parseShort();
	    hhea.numberOfHMetrics = p.parseUShort();
	    return hhea;
	}

	function makeHheaTable(options) {
	    return new table.Table('hhea', [
	        {name: 'version', type: 'FIXED', value: 0x00010000},
	        {name: 'ascender', type: 'FWORD', value: 0},
	        {name: 'descender', type: 'FWORD', value: 0},
	        {name: 'lineGap', type: 'FWORD', value: 0},
	        {name: 'advanceWidthMax', type: 'UFWORD', value: 0},
	        {name: 'minLeftSideBearing', type: 'FWORD', value: 0},
	        {name: 'minRightSideBearing', type: 'FWORD', value: 0},
	        {name: 'xMaxExtent', type: 'FWORD', value: 0},
	        {name: 'caretSlopeRise', type: 'SHORT', value: 1},
	        {name: 'caretSlopeRun', type: 'SHORT', value: 0},
	        {name: 'caretOffset', type: 'SHORT', value: 0},
	        {name: 'reserved1', type: 'SHORT', value: 0},
	        {name: 'reserved2', type: 'SHORT', value: 0},
	        {name: 'reserved3', type: 'SHORT', value: 0},
	        {name: 'reserved4', type: 'SHORT', value: 0},
	        {name: 'metricDataFormat', type: 'SHORT', value: 0},
	        {name: 'numberOfHMetrics', type: 'USHORT', value: 0}
	    ], options);
	}

	var hhea = { parse: parseHheaTable, make: makeHheaTable };

	// The `hmtx` table contains the horizontal metrics for all glyphs.

	// Parse the `hmtx` table, which contains the horizontal metrics for all glyphs.
	// This function augments the glyph array, adding the advanceWidth and leftSideBearing to each glyph.
	function parseHmtxTable(data, start, numMetrics, numGlyphs, glyphs) {
	    var advanceWidth;
	    var leftSideBearing;
	    var p = new parse.Parser(data, start);
	    for (var i = 0; i < numGlyphs; i += 1) {
	        // If the font is monospaced, only one entry is needed. This last entry applies to all subsequent glyphs.
	        if (i < numMetrics) {
	            advanceWidth = p.parseUShort();
	            leftSideBearing = p.parseShort();
	        }

	        var glyph = glyphs.get(i);
	        glyph.advanceWidth = advanceWidth;
	        glyph.leftSideBearing = leftSideBearing;
	    }
	}

	function makeHmtxTable(glyphs) {
	    var t = new table.Table('hmtx', []);
	    for (var i = 0; i < glyphs.length; i += 1) {
	        var glyph = glyphs.get(i);
	        var advanceWidth = glyph.advanceWidth || 0;
	        var leftSideBearing = glyph.leftSideBearing || 0;
	        t.fields.push({name: 'advanceWidth_' + i, type: 'USHORT', value: advanceWidth});
	        t.fields.push({name: 'leftSideBearing_' + i, type: 'SHORT', value: leftSideBearing});
	    }

	    return t;
	}

	var hmtx = { parse: parseHmtxTable, make: makeHmtxTable };

	// The `ltag` table stores IETF BCP-47 language tags. It allows supporting

	function makeLtagTable(tags) {
	    var result = new table.Table('ltag', [
	        {name: 'version', type: 'ULONG', value: 1},
	        {name: 'flags', type: 'ULONG', value: 0},
	        {name: 'numTags', type: 'ULONG', value: tags.length}
	    ]);

	    var stringPool = '';
	    var stringPoolOffset = 12 + tags.length * 4;
	    for (var i = 0; i < tags.length; ++i) {
	        var pos = stringPool.indexOf(tags[i]);
	        if (pos < 0) {
	            pos = stringPool.length;
	            stringPool += tags[i];
	        }

	        result.fields.push({name: 'offset ' + i, type: 'USHORT', value: stringPoolOffset + pos});
	        result.fields.push({name: 'length ' + i, type: 'USHORT', value: tags[i].length});
	    }

	    result.fields.push({name: 'stringPool', type: 'CHARARRAY', value: stringPool});
	    return result;
	}

	function parseLtagTable(data, start) {
	    var p = new parse.Parser(data, start);
	    var tableVersion = p.parseULong();
	    check.argument(tableVersion === 1, 'Unsupported ltag table version.');
	    // The 'ltag' specification does not define any flags; skip the field.
	    p.skip('uLong', 1);
	    var numTags = p.parseULong();

	    var tags = [];
	    for (var i = 0; i < numTags; i++) {
	        var tag = '';
	        var offset = start + p.parseUShort();
	        var length = p.parseUShort();
	        for (var j = offset; j < offset + length; ++j) {
	            tag += String.fromCharCode(data.getInt8(j));
	        }

	        tags.push(tag);
	    }

	    return tags;
	}

	var ltag = { make: makeLtagTable, parse: parseLtagTable };

	// The `maxp` table establishes the memory requirements for the font.

	// Parse the maximum profile `maxp` table.
	function parseMaxpTable(data, start) {
	    var maxp = {};
	    var p = new parse.Parser(data, start);
	    maxp.version = p.parseVersion();
	    maxp.numGlyphs = p.parseUShort();
	    if (maxp.version === 1.0) {
	        maxp.maxPoints = p.parseUShort();
	        maxp.maxContours = p.parseUShort();
	        maxp.maxCompositePoints = p.parseUShort();
	        maxp.maxCompositeContours = p.parseUShort();
	        maxp.maxZones = p.parseUShort();
	        maxp.maxTwilightPoints = p.parseUShort();
	        maxp.maxStorage = p.parseUShort();
	        maxp.maxFunctionDefs = p.parseUShort();
	        maxp.maxInstructionDefs = p.parseUShort();
	        maxp.maxStackElements = p.parseUShort();
	        maxp.maxSizeOfInstructions = p.parseUShort();
	        maxp.maxComponentElements = p.parseUShort();
	        maxp.maxComponentDepth = p.parseUShort();
	    }

	    return maxp;
	}

	function makeMaxpTable(numGlyphs) {
	    return new table.Table('maxp', [
	        {name: 'version', type: 'FIXED', value: 0x00005000},
	        {name: 'numGlyphs', type: 'USHORT', value: numGlyphs}
	    ]);
	}

	var maxp = { parse: parseMaxpTable, make: makeMaxpTable };

	// The `name` naming table.

	// NameIDs for the name table.
	var nameTableNames = [
	    'copyright',              // 0
	    'fontFamily',             // 1
	    'fontSubfamily',          // 2
	    'uniqueID',               // 3
	    'fullName',               // 4
	    'version',                // 5
	    'postScriptName',         // 6
	    'trademark',              // 7
	    'manufacturer',           // 8
	    'designer',               // 9
	    'description',            // 10
	    'manufacturerURL',        // 11
	    'designerURL',            // 12
	    'license',                // 13
	    'licenseURL',             // 14
	    'reserved',               // 15
	    'preferredFamily',        // 16
	    'preferredSubfamily',     // 17
	    'compatibleFullName',     // 18
	    'sampleText',             // 19
	    'postScriptFindFontName', // 20
	    'wwsFamily',              // 21
	    'wwsSubfamily'            // 22
	];

	var macLanguages = {
	    0: 'en',
	    1: 'fr',
	    2: 'de',
	    3: 'it',
	    4: 'nl',
	    5: 'sv',
	    6: 'es',
	    7: 'da',
	    8: 'pt',
	    9: 'no',
	    10: 'he',
	    11: 'ja',
	    12: 'ar',
	    13: 'fi',
	    14: 'el',
	    15: 'is',
	    16: 'mt',
	    17: 'tr',
	    18: 'hr',
	    19: 'zh-Hant',
	    20: 'ur',
	    21: 'hi',
	    22: 'th',
	    23: 'ko',
	    24: 'lt',
	    25: 'pl',
	    26: 'hu',
	    27: 'es',
	    28: 'lv',
	    29: 'se',
	    30: 'fo',
	    31: 'fa',
	    32: 'ru',
	    33: 'zh',
	    34: 'nl-BE',
	    35: 'ga',
	    36: 'sq',
	    37: 'ro',
	    38: 'cz',
	    39: 'sk',
	    40: 'si',
	    41: 'yi',
	    42: 'sr',
	    43: 'mk',
	    44: 'bg',
	    45: 'uk',
	    46: 'be',
	    47: 'uz',
	    48: 'kk',
	    49: 'az-Cyrl',
	    50: 'az-Arab',
	    51: 'hy',
	    52: 'ka',
	    53: 'mo',
	    54: 'ky',
	    55: 'tg',
	    56: 'tk',
	    57: 'mn-CN',
	    58: 'mn',
	    59: 'ps',
	    60: 'ks',
	    61: 'ku',
	    62: 'sd',
	    63: 'bo',
	    64: 'ne',
	    65: 'sa',
	    66: 'mr',
	    67: 'bn',
	    68: 'as',
	    69: 'gu',
	    70: 'pa',
	    71: 'or',
	    72: 'ml',
	    73: 'kn',
	    74: 'ta',
	    75: 'te',
	    76: 'si',
	    77: 'my',
	    78: 'km',
	    79: 'lo',
	    80: 'vi',
	    81: 'id',
	    82: 'tl',
	    83: 'ms',
	    84: 'ms-Arab',
	    85: 'am',
	    86: 'ti',
	    87: 'om',
	    88: 'so',
	    89: 'sw',
	    90: 'rw',
	    91: 'rn',
	    92: 'ny',
	    93: 'mg',
	    94: 'eo',
	    128: 'cy',
	    129: 'eu',
	    130: 'ca',
	    131: 'la',
	    132: 'qu',
	    133: 'gn',
	    134: 'ay',
	    135: 'tt',
	    136: 'ug',
	    137: 'dz',
	    138: 'jv',
	    139: 'su',
	    140: 'gl',
	    141: 'af',
	    142: 'br',
	    143: 'iu',
	    144: 'gd',
	    145: 'gv',
	    146: 'ga',
	    147: 'to',
	    148: 'el-polyton',
	    149: 'kl',
	    150: 'az',
	    151: 'nn'
	};

	// MacOS language ID → MacOS script ID
	//
	// Note that the script ID is not sufficient to determine what encoding
	// to use in TrueType files. For some languages, MacOS used a modification
	// of a mainstream script. For example, an Icelandic name would be stored
	// with smRoman in the TrueType naming table, but the actual encoding
	// is a special Icelandic version of the normal Macintosh Roman encoding.
	// As another example, Inuktitut uses an 8-bit encoding for Canadian Aboriginal
	// Syllables but MacOS had run out of available script codes, so this was
	// done as a (pretty radical) "modification" of Ethiopic.
	//
	// http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt
	var macLanguageToScript = {
	    0: 0,  // langEnglish → smRoman
	    1: 0,  // langFrench → smRoman
	    2: 0,  // langGerman → smRoman
	    3: 0,  // langItalian → smRoman
	    4: 0,  // langDutch → smRoman
	    5: 0,  // langSwedish → smRoman
	    6: 0,  // langSpanish → smRoman
	    7: 0,  // langDanish → smRoman
	    8: 0,  // langPortuguese → smRoman
	    9: 0,  // langNorwegian → smRoman
	    10: 5,  // langHebrew → smHebrew
	    11: 1,  // langJapanese → smJapanese
	    12: 4,  // langArabic → smArabic
	    13: 0,  // langFinnish → smRoman
	    14: 6,  // langGreek → smGreek
	    15: 0,  // langIcelandic → smRoman (modified)
	    16: 0,  // langMaltese → smRoman
	    17: 0,  // langTurkish → smRoman (modified)
	    18: 0,  // langCroatian → smRoman (modified)
	    19: 2,  // langTradChinese → smTradChinese
	    20: 4,  // langUrdu → smArabic
	    21: 9,  // langHindi → smDevanagari
	    22: 21,  // langThai → smThai
	    23: 3,  // langKorean → smKorean
	    24: 29,  // langLithuanian → smCentralEuroRoman
	    25: 29,  // langPolish → smCentralEuroRoman
	    26: 29,  // langHungarian → smCentralEuroRoman
	    27: 29,  // langEstonian → smCentralEuroRoman
	    28: 29,  // langLatvian → smCentralEuroRoman
	    29: 0,  // langSami → smRoman
	    30: 0,  // langFaroese → smRoman (modified)
	    31: 4,  // langFarsi → smArabic (modified)
	    32: 7,  // langRussian → smCyrillic
	    33: 25,  // langSimpChinese → smSimpChinese
	    34: 0,  // langFlemish → smRoman
	    35: 0,  // langIrishGaelic → smRoman (modified)
	    36: 0,  // langAlbanian → smRoman
	    37: 0,  // langRomanian → smRoman (modified)
	    38: 29,  // langCzech → smCentralEuroRoman
	    39: 29,  // langSlovak → smCentralEuroRoman
	    40: 0,  // langSlovenian → smRoman (modified)
	    41: 5,  // langYiddish → smHebrew
	    42: 7,  // langSerbian → smCyrillic
	    43: 7,  // langMacedonian → smCyrillic
	    44: 7,  // langBulgarian → smCyrillic
	    45: 7,  // langUkrainian → smCyrillic (modified)
	    46: 7,  // langByelorussian → smCyrillic
	    47: 7,  // langUzbek → smCyrillic
	    48: 7,  // langKazakh → smCyrillic
	    49: 7,  // langAzerbaijani → smCyrillic
	    50: 4,  // langAzerbaijanAr → smArabic
	    51: 24,  // langArmenian → smArmenian
	    52: 23,  // langGeorgian → smGeorgian
	    53: 7,  // langMoldavian → smCyrillic
	    54: 7,  // langKirghiz → smCyrillic
	    55: 7,  // langTajiki → smCyrillic
	    56: 7,  // langTurkmen → smCyrillic
	    57: 27,  // langMongolian → smMongolian
	    58: 7,  // langMongolianCyr → smCyrillic
	    59: 4,  // langPashto → smArabic
	    60: 4,  // langKurdish → smArabic
	    61: 4,  // langKashmiri → smArabic
	    62: 4,  // langSindhi → smArabic
	    63: 26,  // langTibetan → smTibetan
	    64: 9,  // langNepali → smDevanagari
	    65: 9,  // langSanskrit → smDevanagari
	    66: 9,  // langMarathi → smDevanagari
	    67: 13,  // langBengali → smBengali
	    68: 13,  // langAssamese → smBengali
	    69: 11,  // langGujarati → smGujarati
	    70: 10,  // langPunjabi → smGurmukhi
	    71: 12,  // langOriya → smOriya
	    72: 17,  // langMalayalam → smMalayalam
	    73: 16,  // langKannada → smKannada
	    74: 14,  // langTamil → smTamil
	    75: 15,  // langTelugu → smTelugu
	    76: 18,  // langSinhalese → smSinhalese
	    77: 19,  // langBurmese → smBurmese
	    78: 20,  // langKhmer → smKhmer
	    79: 22,  // langLao → smLao
	    80: 30,  // langVietnamese → smVietnamese
	    81: 0,  // langIndonesian → smRoman
	    82: 0,  // langTagalog → smRoman
	    83: 0,  // langMalayRoman → smRoman
	    84: 4,  // langMalayArabic → smArabic
	    85: 28,  // langAmharic → smEthiopic
	    86: 28,  // langTigrinya → smEthiopic
	    87: 28,  // langOromo → smEthiopic
	    88: 0,  // langSomali → smRoman
	    89: 0,  // langSwahili → smRoman
	    90: 0,  // langKinyarwanda → smRoman
	    91: 0,  // langRundi → smRoman
	    92: 0,  // langNyanja → smRoman
	    93: 0,  // langMalagasy → smRoman
	    94: 0,  // langEsperanto → smRoman
	    128: 0,  // langWelsh → smRoman (modified)
	    129: 0,  // langBasque → smRoman
	    130: 0,  // langCatalan → smRoman
	    131: 0,  // langLatin → smRoman
	    132: 0,  // langQuechua → smRoman
	    133: 0,  // langGuarani → smRoman
	    134: 0,  // langAymara → smRoman
	    135: 7,  // langTatar → smCyrillic
	    136: 4,  // langUighur → smArabic
	    137: 26,  // langDzongkha → smTibetan
	    138: 0,  // langJavaneseRom → smRoman
	    139: 0,  // langSundaneseRom → smRoman
	    140: 0,  // langGalician → smRoman
	    141: 0,  // langAfrikaans → smRoman
	    142: 0,  // langBreton → smRoman (modified)
	    143: 28,  // langInuktitut → smEthiopic (modified)
	    144: 0,  // langScottishGaelic → smRoman (modified)
	    145: 0,  // langManxGaelic → smRoman (modified)
	    146: 0,  // langIrishGaelicScript → smRoman (modified)
	    147: 0,  // langTongan → smRoman
	    148: 6,  // langGreekAncient → smRoman
	    149: 0,  // langGreenlandic → smRoman
	    150: 0,  // langAzerbaijanRoman → smRoman
	    151: 0   // langNynorsk → smRoman
	};

	// While Microsoft indicates a region/country for all its language
	// IDs, we omit the region code if it's equal to the "most likely
	// region subtag" according to Unicode CLDR. For scripts, we omit
	// the subtag if it is equal to the Suppress-Script entry in the
	// IANA language subtag registry for IETF BCP 47.
	//
	// For example, Microsoft states that its language code 0x041A is
	// Croatian in Croatia. We transform this to the BCP 47 language code 'hr'
	// and not 'hr-HR' because Croatia is the default country for Croatian,
	// according to Unicode CLDR. As another example, Microsoft states
	// that 0x101A is Croatian (Latin) in Bosnia-Herzegovina. We transform
	// this to 'hr-BA' and not 'hr-Latn-BA' because Latin is the default script
	// for the Croatian language, according to IANA.
	//
	// http://www.unicode.org/cldr/charts/latest/supplemental/likely_subtags.html
	// http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry
	var windowsLanguages = {
	    0x0436: 'af',
	    0x041C: 'sq',
	    0x0484: 'gsw',
	    0x045E: 'am',
	    0x1401: 'ar-DZ',
	    0x3C01: 'ar-BH',
	    0x0C01: 'ar',
	    0x0801: 'ar-IQ',
	    0x2C01: 'ar-JO',
	    0x3401: 'ar-KW',
	    0x3001: 'ar-LB',
	    0x1001: 'ar-LY',
	    0x1801: 'ary',
	    0x2001: 'ar-OM',
	    0x4001: 'ar-QA',
	    0x0401: 'ar-SA',
	    0x2801: 'ar-SY',
	    0x1C01: 'aeb',
	    0x3801: 'ar-AE',
	    0x2401: 'ar-YE',
	    0x042B: 'hy',
	    0x044D: 'as',
	    0x082C: 'az-Cyrl',
	    0x042C: 'az',
	    0x046D: 'ba',
	    0x042D: 'eu',
	    0x0423: 'be',
	    0x0845: 'bn',
	    0x0445: 'bn-IN',
	    0x201A: 'bs-Cyrl',
	    0x141A: 'bs',
	    0x047E: 'br',
	    0x0402: 'bg',
	    0x0403: 'ca',
	    0x0C04: 'zh-HK',
	    0x1404: 'zh-MO',
	    0x0804: 'zh',
	    0x1004: 'zh-SG',
	    0x0404: 'zh-TW',
	    0x0483: 'co',
	    0x041A: 'hr',
	    0x101A: 'hr-BA',
	    0x0405: 'cs',
	    0x0406: 'da',
	    0x048C: 'prs',
	    0x0465: 'dv',
	    0x0813: 'nl-BE',
	    0x0413: 'nl',
	    0x0C09: 'en-AU',
	    0x2809: 'en-BZ',
	    0x1009: 'en-CA',
	    0x2409: 'en-029',
	    0x4009: 'en-IN',
	    0x1809: 'en-IE',
	    0x2009: 'en-JM',
	    0x4409: 'en-MY',
	    0x1409: 'en-NZ',
	    0x3409: 'en-PH',
	    0x4809: 'en-SG',
	    0x1C09: 'en-ZA',
	    0x2C09: 'en-TT',
	    0x0809: 'en-GB',
	    0x0409: 'en',
	    0x3009: 'en-ZW',
	    0x0425: 'et',
	    0x0438: 'fo',
	    0x0464: 'fil',
	    0x040B: 'fi',
	    0x080C: 'fr-BE',
	    0x0C0C: 'fr-CA',
	    0x040C: 'fr',
	    0x140C: 'fr-LU',
	    0x180C: 'fr-MC',
	    0x100C: 'fr-CH',
	    0x0462: 'fy',
	    0x0456: 'gl',
	    0x0437: 'ka',
	    0x0C07: 'de-AT',
	    0x0407: 'de',
	    0x1407: 'de-LI',
	    0x1007: 'de-LU',
	    0x0807: 'de-CH',
	    0x0408: 'el',
	    0x046F: 'kl',
	    0x0447: 'gu',
	    0x0468: 'ha',
	    0x040D: 'he',
	    0x0439: 'hi',
	    0x040E: 'hu',
	    0x040F: 'is',
	    0x0470: 'ig',
	    0x0421: 'id',
	    0x045D: 'iu',
	    0x085D: 'iu-Latn',
	    0x083C: 'ga',
	    0x0434: 'xh',
	    0x0435: 'zu',
	    0x0410: 'it',
	    0x0810: 'it-CH',
	    0x0411: 'ja',
	    0x044B: 'kn',
	    0x043F: 'kk',
	    0x0453: 'km',
	    0x0486: 'quc',
	    0x0487: 'rw',
	    0x0441: 'sw',
	    0x0457: 'kok',
	    0x0412: 'ko',
	    0x0440: 'ky',
	    0x0454: 'lo',
	    0x0426: 'lv',
	    0x0427: 'lt',
	    0x082E: 'dsb',
	    0x046E: 'lb',
	    0x042F: 'mk',
	    0x083E: 'ms-BN',
	    0x043E: 'ms',
	    0x044C: 'ml',
	    0x043A: 'mt',
	    0x0481: 'mi',
	    0x047A: 'arn',
	    0x044E: 'mr',
	    0x047C: 'moh',
	    0x0450: 'mn',
	    0x0850: 'mn-CN',
	    0x0461: 'ne',
	    0x0414: 'nb',
	    0x0814: 'nn',
	    0x0482: 'oc',
	    0x0448: 'or',
	    0x0463: 'ps',
	    0x0415: 'pl',
	    0x0416: 'pt',
	    0x0816: 'pt-PT',
	    0x0446: 'pa',
	    0x046B: 'qu-BO',
	    0x086B: 'qu-EC',
	    0x0C6B: 'qu',
	    0x0418: 'ro',
	    0x0417: 'rm',
	    0x0419: 'ru',
	    0x243B: 'smn',
	    0x103B: 'smj-NO',
	    0x143B: 'smj',
	    0x0C3B: 'se-FI',
	    0x043B: 'se',
	    0x083B: 'se-SE',
	    0x203B: 'sms',
	    0x183B: 'sma-NO',
	    0x1C3B: 'sms',
	    0x044F: 'sa',
	    0x1C1A: 'sr-Cyrl-BA',
	    0x0C1A: 'sr',
	    0x181A: 'sr-Latn-BA',
	    0x081A: 'sr-Latn',
	    0x046C: 'nso',
	    0x0432: 'tn',
	    0x045B: 'si',
	    0x041B: 'sk',
	    0x0424: 'sl',
	    0x2C0A: 'es-AR',
	    0x400A: 'es-BO',
	    0x340A: 'es-CL',
	    0x240A: 'es-CO',
	    0x140A: 'es-CR',
	    0x1C0A: 'es-DO',
	    0x300A: 'es-EC',
	    0x440A: 'es-SV',
	    0x100A: 'es-GT',
	    0x480A: 'es-HN',
	    0x080A: 'es-MX',
	    0x4C0A: 'es-NI',
	    0x180A: 'es-PA',
	    0x3C0A: 'es-PY',
	    0x280A: 'es-PE',
	    0x500A: 'es-PR',

	    // Microsoft has defined two different language codes for
	    // “Spanish with modern sorting” and “Spanish with traditional
	    // sorting”. This makes sense for collation APIs, and it would be
	    // possible to express this in BCP 47 language tags via Unicode
	    // extensions (eg., es-u-co-trad is Spanish with traditional
	    // sorting). However, for storing names in fonts, the distinction
	    // does not make sense, so we give “es” in both cases.
	    0x0C0A: 'es',
	    0x040A: 'es',

	    0x540A: 'es-US',
	    0x380A: 'es-UY',
	    0x200A: 'es-VE',
	    0x081D: 'sv-FI',
	    0x041D: 'sv',
	    0x045A: 'syr',
	    0x0428: 'tg',
	    0x085F: 'tzm',
	    0x0449: 'ta',
	    0x0444: 'tt',
	    0x044A: 'te',
	    0x041E: 'th',
	    0x0451: 'bo',
	    0x041F: 'tr',
	    0x0442: 'tk',
	    0x0480: 'ug',
	    0x0422: 'uk',
	    0x042E: 'hsb',
	    0x0420: 'ur',
	    0x0843: 'uz-Cyrl',
	    0x0443: 'uz',
	    0x042A: 'vi',
	    0x0452: 'cy',
	    0x0488: 'wo',
	    0x0485: 'sah',
	    0x0478: 'ii',
	    0x046A: 'yo'
	};

	// Returns a IETF BCP 47 language code, for example 'zh-Hant'
	// for 'Chinese in the traditional script'.
	function getLanguageCode(platformID, languageID, ltag) {
	    switch (platformID) {
	        case 0:  // Unicode
	            if (languageID === 0xFFFF) {
	                return 'und';
	            } else if (ltag) {
	                return ltag[languageID];
	            }

	            break;

	        case 1:  // Macintosh
	            return macLanguages[languageID];

	        case 3:  // Windows
	            return windowsLanguages[languageID];
	    }

	    return undefined;
	}

	var utf16 = 'utf-16';

	// MacOS script ID → encoding. This table stores the default case,
	// which can be overridden by macLanguageEncodings.
	var macScriptEncodings = {
	    0: 'macintosh',           // smRoman
	    1: 'x-mac-japanese',      // smJapanese
	    2: 'x-mac-chinesetrad',   // smTradChinese
	    3: 'x-mac-korean',        // smKorean
	    6: 'x-mac-greek',         // smGreek
	    7: 'x-mac-cyrillic',      // smCyrillic
	    9: 'x-mac-devanagai',     // smDevanagari
	    10: 'x-mac-gurmukhi',     // smGurmukhi
	    11: 'x-mac-gujarati',     // smGujarati
	    12: 'x-mac-oriya',        // smOriya
	    13: 'x-mac-bengali',      // smBengali
	    14: 'x-mac-tamil',        // smTamil
	    15: 'x-mac-telugu',       // smTelugu
	    16: 'x-mac-kannada',      // smKannada
	    17: 'x-mac-malayalam',    // smMalayalam
	    18: 'x-mac-sinhalese',    // smSinhalese
	    19: 'x-mac-burmese',      // smBurmese
	    20: 'x-mac-khmer',        // smKhmer
	    21: 'x-mac-thai',         // smThai
	    22: 'x-mac-lao',          // smLao
	    23: 'x-mac-georgian',     // smGeorgian
	    24: 'x-mac-armenian',     // smArmenian
	    25: 'x-mac-chinesesimp',  // smSimpChinese
	    26: 'x-mac-tibetan',      // smTibetan
	    27: 'x-mac-mongolian',    // smMongolian
	    28: 'x-mac-ethiopic',     // smEthiopic
	    29: 'x-mac-ce',           // smCentralEuroRoman
	    30: 'x-mac-vietnamese',   // smVietnamese
	    31: 'x-mac-extarabic'     // smExtArabic
	};

	// MacOS language ID → encoding. This table stores the exceptional
	// cases, which override macScriptEncodings. For writing MacOS naming
	// tables, we need to emit a MacOS script ID. Therefore, we cannot
	// merge macScriptEncodings into macLanguageEncodings.
	//
	// http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/Readme.txt
	var macLanguageEncodings = {
	    15: 'x-mac-icelandic',    // langIcelandic
	    17: 'x-mac-turkish',      // langTurkish
	    18: 'x-mac-croatian',     // langCroatian
	    24: 'x-mac-ce',           // langLithuanian
	    25: 'x-mac-ce',           // langPolish
	    26: 'x-mac-ce',           // langHungarian
	    27: 'x-mac-ce',           // langEstonian
	    28: 'x-mac-ce',           // langLatvian
	    30: 'x-mac-icelandic',    // langFaroese
	    37: 'x-mac-romanian',     // langRomanian
	    38: 'x-mac-ce',           // langCzech
	    39: 'x-mac-ce',           // langSlovak
	    40: 'x-mac-ce',           // langSlovenian
	    143: 'x-mac-inuit',       // langInuktitut
	    146: 'x-mac-gaelic'       // langIrishGaelicScript
	};

	function getEncoding(platformID, encodingID, languageID) {
	    switch (platformID) {
	        case 0:  // Unicode
	            return utf16;

	        case 1:  // Apple Macintosh
	            return macLanguageEncodings[languageID] || macScriptEncodings[encodingID];

	        case 3:  // Microsoft Windows
	            if (encodingID === 1 || encodingID === 10) {
	                return utf16;
	            }

	            break;
	    }

	    return undefined;
	}

	// Parse the naming `name` table.
	// FIXME: Format 1 additional fields are not supported yet.
	// ltag is the content of the `ltag' table, such as ['en', 'zh-Hans', 'de-CH-1904'].
	function parseNameTable(data, start, ltag) {
	    var name = {};
	    var p = new parse.Parser(data, start);
	    var format = p.parseUShort();
	    var count = p.parseUShort();
	    var stringOffset = p.offset + p.parseUShort();
	    for (var i = 0; i < count; i++) {
	        var platformID = p.parseUShort();
	        var encodingID = p.parseUShort();
	        var languageID = p.parseUShort();
	        var nameID = p.parseUShort();
	        var property = nameTableNames[nameID] || nameID;
	        var byteLength = p.parseUShort();
	        var offset = p.parseUShort();
	        var language = getLanguageCode(platformID, languageID, ltag);
	        var encoding = getEncoding(platformID, encodingID, languageID);
	        if (encoding !== undefined && language !== undefined) {
	            var text = (void 0);
	            if (encoding === utf16) {
	                text = decode.UTF16(data, stringOffset + offset, byteLength);
	            } else {
	                text = decode.MACSTRING(data, stringOffset + offset, byteLength, encoding);
	            }

	            if (text) {
	                var translations = name[property];
	                if (translations === undefined) {
	                    translations = name[property] = {};
	                }

	                translations[language] = text;
	            }
	        }
	    }

	    var langTagCount = 0;
	    if (format === 1) {
	        // FIXME: Also handle Microsoft's 'name' table 1.
	        langTagCount = p.parseUShort();
	    }

	    return name;
	}

	// {23: 'foo'} → {'foo': 23}
	// ['bar', 'baz'] → {'bar': 0, 'baz': 1}
	function reverseDict(dict) {
	    var result = {};
	    for (var key in dict) {
	        result[dict[key]] = parseInt(key);
	    }

	    return result;
	}

	function makeNameRecord(platformID, encodingID, languageID, nameID, length, offset) {
	    return new table.Record('NameRecord', [
	        {name: 'platformID', type: 'USHORT', value: platformID},
	        {name: 'encodingID', type: 'USHORT', value: encodingID},
	        {name: 'languageID', type: 'USHORT', value: languageID},
	        {name: 'nameID', type: 'USHORT', value: nameID},
	        {name: 'length', type: 'USHORT', value: length},
	        {name: 'offset', type: 'USHORT', value: offset}
	    ]);
	}

	// Finds the position of needle in haystack, or -1 if not there.
	// Like String.indexOf(), but for arrays.
	function findSubArray(needle, haystack) {
	    var needleLength = needle.length;
	    var limit = haystack.length - needleLength + 1;

	    loop:
	    for (var pos = 0; pos < limit; pos++) {
	        for (; pos < limit; pos++) {
	            for (var k = 0; k < needleLength; k++) {
	                if (haystack[pos + k] !== needle[k]) {
	                    continue loop;
	                }
	            }

	            return pos;
	        }
	    }

	    return -1;
	}

	function addStringToPool(s, pool) {
	    var offset = findSubArray(s, pool);
	    if (offset < 0) {
	        offset = pool.length;
	        var i = 0;
	        var len = s.length;
	        for (; i < len; ++i) {
	            pool.push(s[i]);
	        }

	    }

	    return offset;
	}

	function makeNameTable(names, ltag) {
	    var nameID;
	    var nameIDs = [];

	    var namesWithNumericKeys = {};
	    var nameTableIds = reverseDict(nameTableNames);
	    for (var key in names) {
	        var id = nameTableIds[key];
	        if (id === undefined) {
	            id = key;
	        }

	        nameID = parseInt(id);

	        if (isNaN(nameID)) {
	            throw new Error('Name table entry "' + key + '" does not exist, see nameTableNames for complete list.');
	        }

	        namesWithNumericKeys[nameID] = names[key];
	        nameIDs.push(nameID);
	    }

	    var macLanguageIds = reverseDict(macLanguages);
	    var windowsLanguageIds = reverseDict(windowsLanguages);

	    var nameRecords = [];
	    var stringPool = [];

	    for (var i = 0; i < nameIDs.length; i++) {
	        nameID = nameIDs[i];
	        var translations = namesWithNumericKeys[nameID];
	        for (var lang in translations) {
	            var text = translations[lang];

	            // For MacOS, we try to emit the name in the form that was introduced
	            // in the initial version of the TrueType spec (in the late 1980s).
	            // However, this can fail for various reasons: the requested BCP 47
	            // language code might not have an old-style Mac equivalent;
	            // we might not have a codec for the needed character encoding;
	            // or the name might contain characters that cannot be expressed
	            // in the old-style Macintosh encoding. In case of failure, we emit
	            // the name in a more modern fashion (Unicode encoding with BCP 47
	            // language tags) that is recognized by MacOS 10.5, released in 2009.
	            // If fonts were only read by operating systems, we could simply
	            // emit all names in the modern form; this would be much easier.
	            // However, there are many applications and libraries that read
	            // 'name' tables directly, and these will usually only recognize
	            // the ancient form (silently skipping the unrecognized names).
	            var macPlatform = 1;  // Macintosh
	            var macLanguage = macLanguageIds[lang];
	            var macScript = macLanguageToScript[macLanguage];
	            var macEncoding = getEncoding(macPlatform, macScript, macLanguage);
	            var macName = encode.MACSTRING(text, macEncoding);
	            if (macName === undefined) {
	                macPlatform = 0;  // Unicode
	                macLanguage = ltag.indexOf(lang);
	                if (macLanguage < 0) {
	                    macLanguage = ltag.length;
	                    ltag.push(lang);
	                }

	                macScript = 4;  // Unicode 2.0 and later
	                macName = encode.UTF16(text);
	            }

	            var macNameOffset = addStringToPool(macName, stringPool);
	            nameRecords.push(makeNameRecord(macPlatform, macScript, macLanguage,
	                                            nameID, macName.length, macNameOffset));

	            var winLanguage = windowsLanguageIds[lang];
	            if (winLanguage !== undefined) {
	                var winName = encode.UTF16(text);
	                var winNameOffset = addStringToPool(winName, stringPool);
	                nameRecords.push(makeNameRecord(3, 1, winLanguage,
	                                                nameID, winName.length, winNameOffset));
	            }
	        }
	    }

	    nameRecords.sort(function(a, b) {
	        return ((a.platformID - b.platformID) ||
	                (a.encodingID - b.encodingID) ||
	                (a.languageID - b.languageID) ||
	                (a.nameID - b.nameID));
	    });

	    var t = new table.Table('name', [
	        {name: 'format', type: 'USHORT', value: 0},
	        {name: 'count', type: 'USHORT', value: nameRecords.length},
	        {name: 'stringOffset', type: 'USHORT', value: 6 + nameRecords.length * 12}
	    ]);

	    for (var r = 0; r < nameRecords.length; r++) {
	        t.fields.push({name: 'record_' + r, type: 'RECORD', value: nameRecords[r]});
	    }

	    t.fields.push({name: 'strings', type: 'LITERAL', value: stringPool});
	    return t;
	}

	var _name = { parse: parseNameTable, make: makeNameTable };

	// The `OS/2` table contains metrics required in OpenType fonts.

	var unicodeRanges = [
	    {begin: 0x0000, end: 0x007F}, // Basic Latin
	    {begin: 0x0080, end: 0x00FF}, // Latin-1 Supplement
	    {begin: 0x0100, end: 0x017F}, // Latin Extended-A
	    {begin: 0x0180, end: 0x024F}, // Latin Extended-B
	    {begin: 0x0250, end: 0x02AF}, // IPA Extensions
	    {begin: 0x02B0, end: 0x02FF}, // Spacing Modifier Letters
	    {begin: 0x0300, end: 0x036F}, // Combining Diacritical Marks
	    {begin: 0x0370, end: 0x03FF}, // Greek and Coptic
	    {begin: 0x2C80, end: 0x2CFF}, // Coptic
	    {begin: 0x0400, end: 0x04FF}, // Cyrillic
	    {begin: 0x0530, end: 0x058F}, // Armenian
	    {begin: 0x0590, end: 0x05FF}, // Hebrew
	    {begin: 0xA500, end: 0xA63F}, // Vai
	    {begin: 0x0600, end: 0x06FF}, // Arabic
	    {begin: 0x07C0, end: 0x07FF}, // NKo
	    {begin: 0x0900, end: 0x097F}, // Devanagari
	    {begin: 0x0980, end: 0x09FF}, // Bengali
	    {begin: 0x0A00, end: 0x0A7F}, // Gurmukhi
	    {begin: 0x0A80, end: 0x0AFF}, // Gujarati
	    {begin: 0x0B00, end: 0x0B7F}, // Oriya
	    {begin: 0x0B80, end: 0x0BFF}, // Tamil
	    {begin: 0x0C00, end: 0x0C7F}, // Telugu
	    {begin: 0x0C80, end: 0x0CFF}, // Kannada
	    {begin: 0x0D00, end: 0x0D7F}, // Malayalam
	    {begin: 0x0E00, end: 0x0E7F}, // Thai
	    {begin: 0x0E80, end: 0x0EFF}, // Lao
	    {begin: 0x10A0, end: 0x10FF}, // Georgian
	    {begin: 0x1B00, end: 0x1B7F}, // Balinese
	    {begin: 0x1100, end: 0x11FF}, // Hangul Jamo
	    {begin: 0x1E00, end: 0x1EFF}, // Latin Extended Additional
	    {begin: 0x1F00, end: 0x1FFF}, // Greek Extended
	    {begin: 0x2000, end: 0x206F}, // General Punctuation
	    {begin: 0x2070, end: 0x209F}, // Superscripts And Subscripts
	    {begin: 0x20A0, end: 0x20CF}, // Currency Symbol
	    {begin: 0x20D0, end: 0x20FF}, // Combining Diacritical Marks For Symbols
	    {begin: 0x2100, end: 0x214F}, // Letterlike Symbols
	    {begin: 0x2150, end: 0x218F}, // Number Forms
	    {begin: 0x2190, end: 0x21FF}, // Arrows
	    {begin: 0x2200, end: 0x22FF}, // Mathematical Operators
	    {begin: 0x2300, end: 0x23FF}, // Miscellaneous Technical
	    {begin: 0x2400, end: 0x243F}, // Control Pictures
	    {begin: 0x2440, end: 0x245F}, // Optical Character Recognition
	    {begin: 0x2460, end: 0x24FF}, // Enclosed Alphanumerics
	    {begin: 0x2500, end: 0x257F}, // Box Drawing
	    {begin: 0x2580, end: 0x259F}, // Block Elements
	    {begin: 0x25A0, end: 0x25FF}, // Geometric Shapes
	    {begin: 0x2600, end: 0x26FF}, // Miscellaneous Symbols
	    {begin: 0x2700, end: 0x27BF}, // Dingbats
	    {begin: 0x3000, end: 0x303F}, // CJK Symbols And Punctuation
	    {begin: 0x3040, end: 0x309F}, // Hiragana
	    {begin: 0x30A0, end: 0x30FF}, // Katakana
	    {begin: 0x3100, end: 0x312F}, // Bopomofo
	    {begin: 0x3130, end: 0x318F}, // Hangul Compatibility Jamo
	    {begin: 0xA840, end: 0xA87F}, // Phags-pa
	    {begin: 0x3200, end: 0x32FF}, // Enclosed CJK Letters And Months
	    {begin: 0x3300, end: 0x33FF}, // CJK Compatibility
	    {begin: 0xAC00, end: 0xD7AF}, // Hangul Syllables
	    {begin: 0xD800, end: 0xDFFF}, // Non-Plane 0 *
	    {begin: 0x10900, end: 0x1091F}, // Phoenicia
	    {begin: 0x4E00, end: 0x9FFF}, // CJK Unified Ideographs
	    {begin: 0xE000, end: 0xF8FF}, // Private Use Area (plane 0)
	    {begin: 0x31C0, end: 0x31EF}, // CJK Strokes
	    {begin: 0xFB00, end: 0xFB4F}, // Alphabetic Presentation Forms
	    {begin: 0xFB50, end: 0xFDFF}, // Arabic Presentation Forms-A
	    {begin: 0xFE20, end: 0xFE2F}, // Combining Half Marks
	    {begin: 0xFE10, end: 0xFE1F}, // Vertical Forms
	    {begin: 0xFE50, end: 0xFE6F}, // Small Form Variants
	    {begin: 0xFE70, end: 0xFEFF}, // Arabic Presentation Forms-B
	    {begin: 0xFF00, end: 0xFFEF}, // Halfwidth And Fullwidth Forms
	    {begin: 0xFFF0, end: 0xFFFF}, // Specials
	    {begin: 0x0F00, end: 0x0FFF}, // Tibetan
	    {begin: 0x0700, end: 0x074F}, // Syriac
	    {begin: 0x0780, end: 0x07BF}, // Thaana
	    {begin: 0x0D80, end: 0x0DFF}, // Sinhala
	    {begin: 0x1000, end: 0x109F}, // Myanmar
	    {begin: 0x1200, end: 0x137F}, // Ethiopic
	    {begin: 0x13A0, end: 0x13FF}, // Cherokee
	    {begin: 0x1400, end: 0x167F}, // Unified Canadian Aboriginal Syllabics
	    {begin: 0x1680, end: 0x169F}, // Ogham
	    {begin: 0x16A0, end: 0x16FF}, // Runic
	    {begin: 0x1780, end: 0x17FF}, // Khmer
	    {begin: 0x1800, end: 0x18AF}, // Mongolian
	    {begin: 0x2800, end: 0x28FF}, // Braille Patterns
	    {begin: 0xA000, end: 0xA48F}, // Yi Syllables
	    {begin: 0x1700, end: 0x171F}, // Tagalog
	    {begin: 0x10300, end: 0x1032F}, // Old Italic
	    {begin: 0x10330, end: 0x1034F}, // Gothic
	    {begin: 0x10400, end: 0x1044F}, // Deseret
	    {begin: 0x1D000, end: 0x1D0FF}, // Byzantine Musical Symbols
	    {begin: 0x1D400, end: 0x1D7FF}, // Mathematical Alphanumeric Symbols
	    {begin: 0xFF000, end: 0xFFFFD}, // Private Use (plane 15)
	    {begin: 0xFE00, end: 0xFE0F}, // Variation Selectors
	    {begin: 0xE0000, end: 0xE007F}, // Tags
	    {begin: 0x1900, end: 0x194F}, // Limbu
	    {begin: 0x1950, end: 0x197F}, // Tai Le
	    {begin: 0x1980, end: 0x19DF}, // New Tai Lue
	    {begin: 0x1A00, end: 0x1A1F}, // Buginese
	    {begin: 0x2C00, end: 0x2C5F}, // Glagolitic
	    {begin: 0x2D30, end: 0x2D7F}, // Tifinagh
	    {begin: 0x4DC0, end: 0x4DFF}, // Yijing Hexagram Symbols
	    {begin: 0xA800, end: 0xA82F}, // Syloti Nagri
	    {begin: 0x10000, end: 0x1007F}, // Linear B Syllabary
	    {begin: 0x10140, end: 0x1018F}, // Ancient Greek Numbers
	    {begin: 0x10380, end: 0x1039F}, // Ugaritic
	    {begin: 0x103A0, end: 0x103DF}, // Old Persian
	    {begin: 0x10450, end: 0x1047F}, // Shavian
	    {begin: 0x10480, end: 0x104AF}, // Osmanya
	    {begin: 0x10800, end: 0x1083F}, // Cypriot Syllabary
	    {begin: 0x10A00, end: 0x10A5F}, // Kharoshthi
	    {begin: 0x1D300, end: 0x1D35F}, // Tai Xuan Jing Symbols
	    {begin: 0x12000, end: 0x123FF}, // Cuneiform
	    {begin: 0x1D360, end: 0x1D37F}, // Counting Rod Numerals
	    {begin: 0x1B80, end: 0x1BBF}, // Sundanese
	    {begin: 0x1C00, end: 0x1C4F}, // Lepcha
	    {begin: 0x1C50, end: 0x1C7F}, // Ol Chiki
	    {begin: 0xA880, end: 0xA8DF}, // Saurashtra
	    {begin: 0xA900, end: 0xA92F}, // Kayah Li
	    {begin: 0xA930, end: 0xA95F}, // Rejang
	    {begin: 0xAA00, end: 0xAA5F}, // Cham
	    {begin: 0x10190, end: 0x101CF}, // Ancient Symbols
	    {begin: 0x101D0, end: 0x101FF}, // Phaistos Disc
	    {begin: 0x102A0, end: 0x102DF}, // Carian
	    {begin: 0x1F030, end: 0x1F09F}  // Domino Tiles
	];

	function getUnicodeRange(unicode) {
	    for (var i = 0; i < unicodeRanges.length; i += 1) {
	        var range = unicodeRanges[i];
	        if (unicode >= range.begin && unicode < range.end) {
	            return i;
	        }
	    }

	    return -1;
	}

	// Parse the OS/2 and Windows metrics `OS/2` table
	function parseOS2Table(data, start) {
	    var os2 = {};
	    var p = new parse.Parser(data, start);
	    os2.version = p.parseUShort();
	    os2.xAvgCharWidth = p.parseShort();
	    os2.usWeightClass = p.parseUShort();
	    os2.usWidthClass = p.parseUShort();
	    os2.fsType = p.parseUShort();
	    os2.ySubscriptXSize = p.parseShort();
	    os2.ySubscriptYSize = p.parseShort();
	    os2.ySubscriptXOffset = p.parseShort();
	    os2.ySubscriptYOffset = p.parseShort();
	    os2.ySuperscriptXSize = p.parseShort();
	    os2.ySuperscriptYSize = p.parseShort();
	    os2.ySuperscriptXOffset = p.parseShort();
	    os2.ySuperscriptYOffset = p.parseShort();
	    os2.yStrikeoutSize = p.parseShort();
	    os2.yStrikeoutPosition = p.parseShort();
	    os2.sFamilyClass = p.parseShort();
	    os2.panose = [];
	    for (var i = 0; i < 10; i++) {
	        os2.panose[i] = p.parseByte();
	    }

	    os2.ulUnicodeRange1 = p.parseULong();
	    os2.ulUnicodeRange2 = p.parseULong();
	    os2.ulUnicodeRange3 = p.parseULong();
	    os2.ulUnicodeRange4 = p.parseULong();
	    os2.achVendID = String.fromCharCode(p.parseByte(), p.parseByte(), p.parseByte(), p.parseByte());
	    os2.fsSelection = p.parseUShort();
	    os2.usFirstCharIndex = p.parseUShort();
	    os2.usLastCharIndex = p.parseUShort();
	    os2.sTypoAscender = p.parseShort();
	    os2.sTypoDescender = p.parseShort();
	    os2.sTypoLineGap = p.parseShort();
	    os2.usWinAscent = p.parseUShort();
	    os2.usWinDescent = p.parseUShort();
	    if (os2.version >= 1) {
	        os2.ulCodePageRange1 = p.parseULong();
	        os2.ulCodePageRange2 = p.parseULong();
	    }

	    if (os2.version >= 2) {
	        os2.sxHeight = p.parseShort();
	        os2.sCapHeight = p.parseShort();
	        os2.usDefaultChar = p.parseUShort();
	        os2.usBreakChar = p.parseUShort();
	        os2.usMaxContent = p.parseUShort();
	    }

	    return os2;
	}

	function makeOS2Table(options) {
	    return new table.Table('OS/2', [
	        {name: 'version', type: 'USHORT', value: 0x0003},
	        {name: 'xAvgCharWidth', type: 'SHORT', value: 0},
	        {name: 'usWeightClass', type: 'USHORT', value: 0},
	        {name: 'usWidthClass', type: 'USHORT', value: 0},
	        {name: 'fsType', type: 'USHORT', value: 0},
	        {name: 'ySubscriptXSize', type: 'SHORT', value: 650},
	        {name: 'ySubscriptYSize', type: 'SHORT', value: 699},
	        {name: 'ySubscriptXOffset', type: 'SHORT', value: 0},
	        {name: 'ySubscriptYOffset', type: 'SHORT', value: 140},
	        {name: 'ySuperscriptXSize', type: 'SHORT', value: 650},
	        {name: 'ySuperscriptYSize', type: 'SHORT', value: 699},
	        {name: 'ySuperscriptXOffset', type: 'SHORT', value: 0},
	        {name: 'ySuperscriptYOffset', type: 'SHORT', value: 479},
	        {name: 'yStrikeoutSize', type: 'SHORT', value: 49},
	        {name: 'yStrikeoutPosition', type: 'SHORT', value: 258},
	        {name: 'sFamilyClass', type: 'SHORT', value: 0},
	        {name: 'bFamilyType', type: 'BYTE', value: 0},
	        {name: 'bSerifStyle', type: 'BYTE', value: 0},
	        {name: 'bWeight', type: 'BYTE', value: 0},
	        {name: 'bProportion', type: 'BYTE', value: 0},
	        {name: 'bContrast', type: 'BYTE', value: 0},
	        {name: 'bStrokeVariation', type: 'BYTE', value: 0},
	        {name: 'bArmStyle', type: 'BYTE', value: 0},
	        {name: 'bLetterform', type: 'BYTE', value: 0},
	        {name: 'bMidline', type: 'BYTE', value: 0},
	        {name: 'bXHeight', type: 'BYTE', value: 0},
	        {name: 'ulUnicodeRange1', type: 'ULONG', value: 0},
	        {name: 'ulUnicodeRange2', type: 'ULONG', value: 0},
	        {name: 'ulUnicodeRange3', type: 'ULONG', value: 0},
	        {name: 'ulUnicodeRange4', type: 'ULONG', value: 0},
	        {name: 'achVendID', type: 'CHARARRAY', value: 'XXXX'},
	        {name: 'fsSelection', type: 'USHORT', value: 0},
	        {name: 'usFirstCharIndex', type: 'USHORT', value: 0},
	        {name: 'usLastCharIndex', type: 'USHORT', value: 0},
	        {name: 'sTypoAscender', type: 'SHORT', value: 0},
	        {name: 'sTypoDescender', type: 'SHORT', value: 0},
	        {name: 'sTypoLineGap', type: 'SHORT', value: 0},
	        {name: 'usWinAscent', type: 'USHORT', value: 0},
	        {name: 'usWinDescent', type: 'USHORT', value: 0},
	        {name: 'ulCodePageRange1', type: 'ULONG', value: 0},
	        {name: 'ulCodePageRange2', type: 'ULONG', value: 0},
	        {name: 'sxHeight', type: 'SHORT', value: 0},
	        {name: 'sCapHeight', type: 'SHORT', value: 0},
	        {name: 'usDefaultChar', type: 'USHORT', value: 0},
	        {name: 'usBreakChar', type: 'USHORT', value: 0},
	        {name: 'usMaxContext', type: 'USHORT', value: 0}
	    ], options);
	}

	var os2 = { parse: parseOS2Table, make: makeOS2Table, unicodeRanges: unicodeRanges, getUnicodeRange: getUnicodeRange };

	// The `post` table stores additional PostScript information, such as glyph names.

	// Parse the PostScript `post` table
	function parsePostTable(data, start) {
	    var post = {};
	    var p = new parse.Parser(data, start);
	    post.version = p.parseVersion();
	    post.italicAngle = p.parseFixed();
	    post.underlinePosition = p.parseShort();
	    post.underlineThickness = p.parseShort();
	    post.isFixedPitch = p.parseULong();
	    post.minMemType42 = p.parseULong();
	    post.maxMemType42 = p.parseULong();
	    post.minMemType1 = p.parseULong();
	    post.maxMemType1 = p.parseULong();
	    switch (post.version) {
	        case 1:
	            post.names = standardNames.slice();
	            break;
	        case 2:
	            post.numberOfGlyphs = p.parseUShort();
	            post.glyphNameIndex = new Array(post.numberOfGlyphs);
	            for (var i = 0; i < post.numberOfGlyphs; i++) {
	                post.glyphNameIndex[i] = p.parseUShort();
	            }

	            post.names = [];
	            for (var i$1 = 0; i$1 < post.numberOfGlyphs; i$1++) {
	                if (post.glyphNameIndex[i$1] >= standardNames.length) {
	                    var nameLength = p.parseChar();
	                    post.names.push(p.parseString(nameLength));
	                }
	            }

	            break;
	        case 2.5:
	            post.numberOfGlyphs = p.parseUShort();
	            post.offset = new Array(post.numberOfGlyphs);
	            for (var i$2 = 0; i$2 < post.numberOfGlyphs; i$2++) {
	                post.offset[i$2] = p.parseChar();
	            }

	            break;
	    }
	    return post;
	}

	function makePostTable() {
	    return new table.Table('post', [
	        {name: 'version', type: 'FIXED', value: 0x00030000},
	        {name: 'italicAngle', type: 'FIXED', value: 0},
	        {name: 'underlinePosition', type: 'FWORD', value: 0},
	        {name: 'underlineThickness', type: 'FWORD', value: 0},
	        {name: 'isFixedPitch', type: 'ULONG', value: 0},
	        {name: 'minMemType42', type: 'ULONG', value: 0},
	        {name: 'maxMemType42', type: 'ULONG', value: 0},
	        {name: 'minMemType1', type: 'ULONG', value: 0},
	        {name: 'maxMemType1', type: 'ULONG', value: 0}
	    ]);
	}

	var post = { parse: parsePostTable, make: makePostTable };

	// The `GSUB` table contains ligatures, among other things.

	var subtableParsers = new Array(9);         // subtableParsers[0] is unused

	// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#SS
	subtableParsers[1] = function parseLookup1() {
	    var start = this.offset + this.relativeOffset;
	    var substFormat = this.parseUShort();
	    if (substFormat === 1) {
	        return {
	            substFormat: 1,
	            coverage: this.parsePointer(Parser.coverage),
	            deltaGlyphId: this.parseUShort()
	        };
	    } else if (substFormat === 2) {
	        return {
	            substFormat: 2,
	            coverage: this.parsePointer(Parser.coverage),
	            substitute: this.parseOffset16List()
	        };
	    }
	    check.assert(false, '0x' + start.toString(16) + ': lookup type 1 format must be 1 or 2.');
	};

	// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#MS
	subtableParsers[2] = function parseLookup2() {
	    var substFormat = this.parseUShort();
	    check.argument(substFormat === 1, 'GSUB Multiple Substitution Subtable identifier-format must be 1');
	    return {
	        substFormat: substFormat,
	        coverage: this.parsePointer(Parser.coverage),
	        sequences: this.parseListOfLists()
	    };
	};

	// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#AS
	subtableParsers[3] = function parseLookup3() {
	    var substFormat = this.parseUShort();
	    check.argument(substFormat === 1, 'GSUB Alternate Substitution Subtable identifier-format must be 1');
	    return {
	        substFormat: substFormat,
	        coverage: this.parsePointer(Parser.coverage),
	        alternateSets: this.parseListOfLists()
	    };
	};

	// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#LS
	subtableParsers[4] = function parseLookup4() {
	    var substFormat = this.parseUShort();
	    check.argument(substFormat === 1, 'GSUB ligature table identifier-format must be 1');
	    return {
	        substFormat: substFormat,
	        coverage: this.parsePointer(Parser.coverage),
	        ligatureSets: this.parseListOfLists(function() {
	            return {
	                ligGlyph: this.parseUShort(),
	                components: this.parseUShortList(this.parseUShort() - 1)
	            };
	        })
	    };
	};

	var lookupRecordDesc = {
	    sequenceIndex: Parser.uShort,
	    lookupListIndex: Parser.uShort
	};

	// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CSF
	subtableParsers[5] = function parseLookup5() {
	    var start = this.offset + this.relativeOffset;
	    var substFormat = this.parseUShort();

	    if (substFormat === 1) {
	        return {
	            substFormat: substFormat,
	            coverage: this.parsePointer(Parser.coverage),
	            ruleSets: this.parseListOfLists(function() {
	                var glyphCount = this.parseUShort();
	                var substCount = this.parseUShort();
	                return {
	                    input: this.parseUShortList(glyphCount - 1),
	                    lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
	                };
	            })
	        };
	    } else if (substFormat === 2) {
	        return {
	            substFormat: substFormat,
	            coverage: this.parsePointer(Parser.coverage),
	            classDef: this.parsePointer(Parser.classDef),
	            classSets: this.parseListOfLists(function() {
	                var glyphCount = this.parseUShort();
	                var substCount = this.parseUShort();
	                return {
	                    classes: this.parseUShortList(glyphCount - 1),
	                    lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
	                };
	            })
	        };
	    } else if (substFormat === 3) {
	        var glyphCount = this.parseUShort();
	        var substCount = this.parseUShort();
	        return {
	            substFormat: substFormat,
	            coverages: this.parseList(glyphCount, Parser.pointer(Parser.coverage)),
	            lookupRecords: this.parseRecordList(substCount, lookupRecordDesc)
	        };
	    }
	    check.assert(false, '0x' + start.toString(16) + ': lookup type 5 format must be 1, 2 or 3.');
	};

	// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#CC
	subtableParsers[6] = function parseLookup6() {
	    var start = this.offset + this.relativeOffset;
	    var substFormat = this.parseUShort();
	    if (substFormat === 1) {
	        return {
	            substFormat: 1,
	            coverage: this.parsePointer(Parser.coverage),
	            chainRuleSets: this.parseListOfLists(function() {
	                return {
	                    backtrack: this.parseUShortList(),
	                    input: this.parseUShortList(this.parseShort() - 1),
	                    lookahead: this.parseUShortList(),
	                    lookupRecords: this.parseRecordList(lookupRecordDesc)
	                };
	            })
	        };
	    } else if (substFormat === 2) {
	        return {
	            substFormat: 2,
	            coverage: this.parsePointer(Parser.coverage),
	            backtrackClassDef: this.parsePointer(Parser.classDef),
	            inputClassDef: this.parsePointer(Parser.classDef),
	            lookaheadClassDef: this.parsePointer(Parser.classDef),
	            chainClassSet: this.parseListOfLists(function() {
	                return {
	                    backtrack: this.parseUShortList(),
	                    input: this.parseUShortList(this.parseShort() - 1),
	                    lookahead: this.parseUShortList(),
	                    lookupRecords: this.parseRecordList(lookupRecordDesc)
	                };
	            })
	        };
	    } else if (substFormat === 3) {
	        return {
	            substFormat: 3,
	            backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
	            inputCoverage: this.parseList(Parser.pointer(Parser.coverage)),
	            lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
	            lookupRecords: this.parseRecordList(lookupRecordDesc)
	        };
	    }
	    check.assert(false, '0x' + start.toString(16) + ': lookup type 6 format must be 1, 2 or 3.');
	};

	// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#ES
	subtableParsers[7] = function parseLookup7() {
	    // Extension Substitution subtable
	    var substFormat = this.parseUShort();
	    check.argument(substFormat === 1, 'GSUB Extension Substitution subtable identifier-format must be 1');
	    var extensionLookupType = this.parseUShort();
	    var extensionParser = new Parser(this.data, this.offset + this.parseULong());
	    return {
	        substFormat: 1,
	        lookupType: extensionLookupType,
	        extension: subtableParsers[extensionLookupType].call(extensionParser)
	    };
	};

	// https://www.microsoft.com/typography/OTSPEC/GSUB.htm#RCCS
	subtableParsers[8] = function parseLookup8() {
	    var substFormat = this.parseUShort();
	    check.argument(substFormat === 1, 'GSUB Reverse Chaining Contextual Single Substitution Subtable identifier-format must be 1');
	    return {
	        substFormat: substFormat,
	        coverage: this.parsePointer(Parser.coverage),
	        backtrackCoverage: this.parseList(Parser.pointer(Parser.coverage)),
	        lookaheadCoverage: this.parseList(Parser.pointer(Parser.coverage)),
	        substitutes: this.parseUShortList()
	    };
	};

	// https://www.microsoft.com/typography/OTSPEC/gsub.htm
	function parseGsubTable(data, start) {
	    start = start || 0;
	    var p = new Parser(data, start);
	    var tableVersion = p.parseVersion(1);
	    check.argument(tableVersion === 1 || tableVersion === 1.1, 'Unsupported GSUB table version.');
	    if (tableVersion === 1) {
	        return {
	            version: tableVersion,
	            scripts: p.parseScriptList(),
	            features: p.parseFeatureList(),
	            lookups: p.parseLookupList(subtableParsers)
	        };
	    } else {
	        return {
	            version: tableVersion,
	            scripts: p.parseScriptList(),
	            features: p.parseFeatureList(),
	            lookups: p.parseLookupList(subtableParsers),
	            variations: p.parseFeatureVariationsList()
	        };
	    }

	}

	// GSUB Writing //////////////////////////////////////////////
	var subtableMakers = new Array(9);

	subtableMakers[1] = function makeLookup1(subtable) {
	    if (subtable.substFormat === 1) {
	        return new table.Table('substitutionTable', [
	            {name: 'substFormat', type: 'USHORT', value: 1},
	            {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)},
	            {name: 'deltaGlyphID', type: 'USHORT', value: subtable.deltaGlyphId}
	        ]);
	    } else {
	        return new table.Table('substitutionTable', [
	            {name: 'substFormat', type: 'USHORT', value: 2},
	            {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
	        ].concat(table.ushortList('substitute', subtable.substitute)));
	    }
	    check.fail('Lookup type 1 substFormat must be 1 or 2.');
	};

	subtableMakers[3] = function makeLookup3(subtable) {
	    check.assert(subtable.substFormat === 1, 'Lookup type 3 substFormat must be 1.');
	    return new table.Table('substitutionTable', [
	        {name: 'substFormat', type: 'USHORT', value: 1},
	        {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
	    ].concat(table.tableList('altSet', subtable.alternateSets, function(alternateSet) {
	        return new table.Table('alternateSetTable', table.ushortList('alternate', alternateSet));
	    })));
	};

	subtableMakers[4] = function makeLookup4(subtable) {
	    check.assert(subtable.substFormat === 1, 'Lookup type 4 substFormat must be 1.');
	    return new table.Table('substitutionTable', [
	        {name: 'substFormat', type: 'USHORT', value: 1},
	        {name: 'coverage', type: 'TABLE', value: new table.Coverage(subtable.coverage)}
	    ].concat(table.tableList('ligSet', subtable.ligatureSets, function(ligatureSet) {
	        return new table.Table('ligatureSetTable', table.tableList('ligature', ligatureSet, function(ligature) {
	            return new table.Table('ligatureTable',
	                [{name: 'ligGlyph', type: 'USHORT', value: ligature.ligGlyph}]
	                .concat(table.ushortList('component', ligature.components, ligature.components.length + 1))
	            );
	        }));
	    })));
	};

	function makeGsubTable(gsub) {
	    return new table.Table('GSUB', [
	        {name: 'version', type: 'ULONG', value: 0x10000},
	        {name: 'scripts', type: 'TABLE', value: new table.ScriptList(gsub.scripts)},
	        {name: 'features', type: 'TABLE', value: new table.FeatureList(gsub.features)},
	        {name: 'lookups', type: 'TABLE', value: new table.LookupList(gsub.lookups, subtableMakers)}
	    ]);
	}

	var gsub = { parse: parseGsubTable, make: makeGsubTable };

	// The `GPOS` table contains kerning pairs, among other things.

	// Parse the metadata `meta` table.
	// https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6meta.html
	function parseMetaTable(data, start) {
	    var p = new parse.Parser(data, start);
	    var tableVersion = p.parseULong();
	    check.argument(tableVersion === 1, 'Unsupported META table version.');
	    p.parseULong(); // flags - currently unused and set to 0
	    p.parseULong(); // tableOffset
	    var numDataMaps = p.parseULong();

	    var tags = {};
	    for (var i = 0; i < numDataMaps; i++) {
	        var tag = p.parseTag();
	        var dataOffset = p.parseULong();
	        var dataLength = p.parseULong();
	        var text = decode.UTF8(data, start + dataOffset, dataLength);

	        tags[tag] = text;
	    }
	    return tags;
	}

	function makeMetaTable(tags) {
	    var numTags = Object.keys(tags).length;
	    var stringPool = '';
	    var stringPoolOffset = 16 + numTags * 12;

	    var result = new table.Table('meta', [
	        {name: 'version', type: 'ULONG', value: 1},
	        {name: 'flags', type: 'ULONG', value: 0},
	        {name: 'offset', type: 'ULONG', value: stringPoolOffset},
	        {name: 'numTags', type: 'ULONG', value: numTags}
	    ]);

	    for (var tag in tags) {
	        var pos = stringPool.length;
	        stringPool += tags[tag];

	        result.fields.push({name: 'tag ' + tag, type: 'TAG', value: tag});
	        result.fields.push({name: 'offset ' + tag, type: 'ULONG', value: stringPoolOffset + pos});
	        result.fields.push({name: 'length ' + tag, type: 'ULONG', value: tags[tag].length});
	    }

	    result.fields.push({name: 'stringPool', type: 'CHARARRAY', value: stringPool});

	    return result;
	}

	var meta = { parse: parseMetaTable, make: makeMetaTable };

	// The `sfnt` wrapper provides organization for the tables in the font.

	function log2(v) {
	    return Math.log(v) / Math.log(2) | 0;
	}

	function computeCheckSum(bytes) {
	    while (bytes.length % 4 !== 0) {
	        bytes.push(0);
	    }

	    var sum = 0;
	    for (var i = 0; i < bytes.length; i += 4) {
	        sum += (bytes[i] << 24) +
	            (bytes[i + 1] << 16) +
	            (bytes[i + 2] << 8) +
	            (bytes[i + 3]);
	    }

	    sum %= Math.pow(2, 32);
	    return sum;
	}

	function makeTableRecord(tag, checkSum, offset, length) {
	    return new table.Record('Table Record', [
	        {name: 'tag', type: 'TAG', value: tag !== undefined ? tag : ''},
	        {name: 'checkSum', type: 'ULONG', value: checkSum !== undefined ? checkSum : 0},
	        {name: 'offset', type: 'ULONG', value: offset !== undefined ? offset : 0},
	        {name: 'length', type: 'ULONG', value: length !== undefined ? length : 0}
	    ]);
	}

	function makeSfntTable(tables) {
	    var sfnt = new table.Table('sfnt', [
	        {name: 'version', type: 'TAG', value: 'OTTO'},
	        {name: 'numTables', type: 'USHORT', value: 0},
	        {name: 'searchRange', type: 'USHORT', value: 0},
	        {name: 'entrySelector', type: 'USHORT', value: 0},
	        {name: 'rangeShift', type: 'USHORT', value: 0}
	    ]);
	    sfnt.tables = tables;
	    sfnt.numTables = tables.length;
	    var highestPowerOf2 = Math.pow(2, log2(sfnt.numTables));
	    sfnt.searchRange = 16 * highestPowerOf2;
	    sfnt.entrySelector = log2(highestPowerOf2);
	    sfnt.rangeShift = sfnt.numTables * 16 - sfnt.searchRange;

	    var recordFields = [];
	    var tableFields = [];

	    var offset = sfnt.sizeOf() + (makeTableRecord().sizeOf() * sfnt.numTables);
	    while (offset % 4 !== 0) {
	        offset += 1;
	        tableFields.push({name: 'padding', type: 'BYTE', value: 0});
	    }

	    for (var i = 0; i < tables.length; i += 1) {
	        var t = tables[i];
	        check.argument(t.tableName.length === 4, 'Table name' + t.tableName + ' is invalid.');
	        var tableLength = t.sizeOf();
	        var tableRecord = makeTableRecord(t.tableName, computeCheckSum(t.encode()), offset, tableLength);
	        recordFields.push({name: tableRecord.tag + ' Table Record', type: 'RECORD', value: tableRecord});
	        tableFields.push({name: t.tableName + ' table', type: 'RECORD', value: t});
	        offset += tableLength;
	        check.argument(!isNaN(offset), 'Something went wrong calculating the offset.');
	        while (offset % 4 !== 0) {
	            offset += 1;
	            tableFields.push({name: 'padding', type: 'BYTE', value: 0});
	        }
	    }

	    // Table records need to be sorted alphabetically.
	    recordFields.sort(function(r1, r2) {
	        if (r1.value.tag > r2.value.tag) {
	            return 1;
	        } else {
	            return -1;
	        }
	    });

	    sfnt.fields = sfnt.fields.concat(recordFields);
	    sfnt.fields = sfnt.fields.concat(tableFields);
	    return sfnt;
	}

	// Get the metrics for a character. If the string has more than one character
	// this function returns metrics for the first available character.
	// You can provide optional fallback metrics if no characters are available.
	function metricsForChar(font, chars, notFoundMetrics) {
	    for (var i = 0; i < chars.length; i += 1) {
	        var glyphIndex = font.charToGlyphIndex(chars[i]);
	        if (glyphIndex > 0) {
	            var glyph = font.glyphs.get(glyphIndex);
	            return glyph.getMetrics();
	        }
	    }

	    return notFoundMetrics;
	}

	function average(vs) {
	    var sum = 0;
	    for (var i = 0; i < vs.length; i += 1) {
	        sum += vs[i];
	    }

	    return sum / vs.length;
	}

	// Convert the font object to a SFNT data structure.
	// This structure contains all the necessary tables and metadata to create a binary OTF file.
	function fontToSfntTable(font) {
	    var xMins = [];
	    var yMins = [];
	    var xMaxs = [];
	    var yMaxs = [];
	    var advanceWidths = [];
	    var leftSideBearings = [];
	    var rightSideBearings = [];
	    var firstCharIndex;
	    var lastCharIndex = 0;
	    var ulUnicodeRange1 = 0;
	    var ulUnicodeRange2 = 0;
	    var ulUnicodeRange3 = 0;
	    var ulUnicodeRange4 = 0;

	    for (var i = 0; i < font.glyphs.length; i += 1) {
	        var glyph = font.glyphs.get(i);
	        var unicode = glyph.unicode | 0;

	        if (isNaN(glyph.advanceWidth)) {
	            throw new Error('Glyph ' + glyph.name + ' (' + i + '): advanceWidth is not a number.');
	        }

	        if (firstCharIndex > unicode || firstCharIndex === undefined) {
	            // ignore .notdef char
	            if (unicode > 0) {
	                firstCharIndex = unicode;
	            }
	        }

	        if (lastCharIndex < unicode) {
	            lastCharIndex = unicode;
	        }

	        var position = os2.getUnicodeRange(unicode);
	        if (position < 32) {
	            ulUnicodeRange1 |= 1 << position;
	        } else if (position < 64) {
	            ulUnicodeRange2 |= 1 << position - 32;
	        } else if (position < 96) {
	            ulUnicodeRange3 |= 1 << position - 64;
	        } else if (position < 123) {
	            ulUnicodeRange4 |= 1 << position - 96;
	        } else {
	            throw new Error('Unicode ranges bits > 123 are reserved for internal usage');
	        }
	        // Skip non-important characters.
	        if (glyph.name === '.notdef') { continue; }
	        var metrics = glyph.getMetrics();
	        xMins.push(metrics.xMin);
	        yMins.push(metrics.yMin);
	        xMaxs.push(metrics.xMax);
	        yMaxs.push(metrics.yMax);
	        leftSideBearings.push(metrics.leftSideBearing);
	        rightSideBearings.push(metrics.rightSideBearing);
	        advanceWidths.push(glyph.advanceWidth);
	    }

	    var globals = {
	        xMin: Math.min.apply(null, xMins),
	        yMin: Math.min.apply(null, yMins),
	        xMax: Math.max.apply(null, xMaxs),
	        yMax: Math.max.apply(null, yMaxs),
	        advanceWidthMax: Math.max.apply(null, advanceWidths),
	        advanceWidthAvg: average(advanceWidths),
	        minLeftSideBearing: Math.min.apply(null, leftSideBearings),
	        maxLeftSideBearing: Math.max.apply(null, leftSideBearings),
	        minRightSideBearing: Math.min.apply(null, rightSideBearings)
	    };
	    globals.ascender = font.ascender;
	    globals.descender = font.descender;

	    var headTable = head.make({
	        flags: 3, // 00000011 (baseline for font at y=0; left sidebearing point at x=0)
	        unitsPerEm: font.unitsPerEm,
	        xMin: globals.xMin,
	        yMin: globals.yMin,
	        xMax: globals.xMax,
	        yMax: globals.yMax,
	        lowestRecPPEM: 3,
	        createdTimestamp: font.createdTimestamp
	    });

	    var hheaTable = hhea.make({
	        ascender: globals.ascender,
	        descender: globals.descender,
	        advanceWidthMax: globals.advanceWidthMax,
	        minLeftSideBearing: globals.minLeftSideBearing,
	        minRightSideBearing: globals.minRightSideBearing,
	        xMaxExtent: globals.maxLeftSideBearing + (globals.xMax - globals.xMin),
	        numberOfHMetrics: font.glyphs.length
	    });

	    var maxpTable = maxp.make(font.glyphs.length);

	    var os2Table = os2.make({
	        xAvgCharWidth: Math.round(globals.advanceWidthAvg),
	        usWeightClass: font.tables.os2.usWeightClass,
	        usWidthClass: font.tables.os2.usWidthClass,
	        usFirstCharIndex: firstCharIndex,
	        usLastCharIndex: lastCharIndex,
	        ulUnicodeRange1: ulUnicodeRange1,
	        ulUnicodeRange2: ulUnicodeRange2,
	        ulUnicodeRange3: ulUnicodeRange3,
	        ulUnicodeRange4: ulUnicodeRange4,
	        fsSelection: font.tables.os2.fsSelection, // REGULAR
	        // See http://typophile.com/node/13081 for more info on vertical metrics.
	        // We get metrics for typical characters (such as "x" for xHeight).
	        // We provide some fallback characters if characters are unavailable: their
	        // ordering was chosen experimentally.
	        sTypoAscender: globals.ascender,
	        sTypoDescender: globals.descender,
	        sTypoLineGap: 0,
	        usWinAscent: globals.yMax,
	        usWinDescent: Math.abs(globals.yMin),
	        ulCodePageRange1: 1, // FIXME: hard-code Latin 1 support for now
	        sxHeight: metricsForChar(font, 'xyvw', {yMax: Math.round(globals.ascender / 2)}).yMax,
	        sCapHeight: metricsForChar(font, 'HIKLEFJMNTZBDPRAGOQSUVWXY', globals).yMax,
	        usDefaultChar: font.hasChar(' ') ? 32 : 0, // Use space as the default character, if available.
	        usBreakChar: font.hasChar(' ') ? 32 : 0 // Use space as the break character, if available.
	    });

	    var hmtxTable = hmtx.make(font.glyphs);
	    var cmapTable = cmap.make(font.glyphs);

	    var englishFamilyName = font.getEnglishName('fontFamily');
	    var englishStyleName = font.getEnglishName('fontSubfamily');
	    var englishFullName = englishFamilyName + ' ' + englishStyleName;
	    var postScriptName = font.getEnglishName('postScriptName');
	    if (!postScriptName) {
	        postScriptName = englishFamilyName.replace(/\s/g, '') + '-' + englishStyleName;
	    }

	    var names = {};
	    for (var n in font.names) {
	        names[n] = font.names[n];
	    }

	    if (!names.uniqueID) {
	        names.uniqueID = {en: font.getEnglishName('manufacturer') + ':' + englishFullName};
	    }

	    if (!names.postScriptName) {
	        names.postScriptName = {en: postScriptName};
	    }

	    if (!names.preferredFamily) {
	        names.preferredFamily = font.names.fontFamily;
	    }

	    if (!names.preferredSubfamily) {
	        names.preferredSubfamily = font.names.fontSubfamily;
	    }

	    var languageTags = [];
	    var nameTable = _name.make(names, languageTags);
	    var ltagTable = (languageTags.length > 0 ? ltag.make(languageTags) : undefined);

	    var postTable = post.make();
	    var cffTable = cff.make(font.glyphs, {
	        version: font.getEnglishName('version'),
	        fullName: englishFullName,
	        familyName: englishFamilyName,
	        weightName: englishStyleName,
	        postScriptName: postScriptName,
	        unitsPerEm: font.unitsPerEm,
	        fontBBox: [0, globals.yMin, globals.ascender, globals.advanceWidthMax]
	    });

	    var metaTable = (font.metas && Object.keys(font.metas).length > 0) ? meta.make(font.metas) : undefined;

	    // The order does not matter because makeSfntTable() will sort them.
	    var tables = [headTable, hheaTable, maxpTable, os2Table, nameTable, cmapTable, postTable, cffTable, hmtxTable];
	    if (ltagTable) {
	        tables.push(ltagTable);
	    }
	    // Optional tables
	    if (font.tables.gsub) {
	        tables.push(gsub.make(font.tables.gsub));
	    }
	    if (metaTable) {
	        tables.push(metaTable);
	    }

	    var sfntTable = makeSfntTable(tables);

	    // Compute the font's checkSum and store it in head.checkSumAdjustment.
	    var bytes = sfntTable.encode();
	    var checkSum = computeCheckSum(bytes);
	    var tableFields = sfntTable.fields;
	    var checkSumAdjusted = false;
	    for (var i$1 = 0; i$1 < tableFields.length; i$1 += 1) {
	        if (tableFields[i$1].name === 'head table') {
	            tableFields[i$1].value.checkSumAdjustment = 0xB1B0AFBA - checkSum;
	            checkSumAdjusted = true;
	            break;
	        }
	    }

	    if (!checkSumAdjusted) {
	        throw new Error('Could not find head table with checkSum to adjust.');
	    }

	    return sfntTable;
	}

	var sfnt = { make: makeSfntTable, fontToTable: fontToSfntTable, computeCheckSum: computeCheckSum };

	// The Layout object is the prototype of Substitution objects, and provides

	function searchTag(arr, tag) {
	    /* jshint bitwise: false */
	    var imin = 0;
	    var imax = arr.length - 1;
	    while (imin <= imax) {
	        var imid = (imin + imax) >>> 1;
	        var val = arr[imid].tag;
	        if (val === tag) {
	            return imid;
	        } else if (val < tag) {
	            imin = imid + 1;
	        } else { imax = imid - 1; }
	    }
	    // Not found: return -1-insertion point
	    return -imin - 1;
	}

	function binSearch(arr, value) {
	    /* jshint bitwise: false */
	    var imin = 0;
	    var imax = arr.length - 1;
	    while (imin <= imax) {
	        var imid = (imin + imax) >>> 1;
	        var val = arr[imid];
	        if (val === value) {
	            return imid;
	        } else if (val < value) {
	            imin = imid + 1;
	        } else { imax = imid - 1; }
	    }
	    // Not found: return -1-insertion point
	    return -imin - 1;
	}

	// binary search in a list of ranges (coverage, class definition)
	function searchRange(ranges, value) {
	    // jshint bitwise: false
	    var range;
	    var imin = 0;
	    var imax = ranges.length - 1;
	    while (imin <= imax) {
	        var imid = (imin + imax) >>> 1;
	        range = ranges[imid];
	        var start = range.start;
	        if (start === value) {
	            return range;
	        } else if (start < value) {
	            imin = imid + 1;
	        } else { imax = imid - 1; }
	    }
	    if (imin > 0) {
	        range = ranges[imin - 1];
	        if (value > range.end) { return 0; }
	        return range;
	    }
	}

	/**
	 * @exports opentype.Layout
	 * @class
	 */
	function Layout(font, tableName) {
	    this.font = font;
	    this.tableName = tableName;
	}

	Layout.prototype = {

	    /**
	     * Binary search an object by "tag" property
	     * @instance
	     * @function searchTag
	     * @memberof opentype.Layout
	     * @param  {Array} arr
	     * @param  {string} tag
	     * @return {number}
	     */
	    searchTag: searchTag,

	    /**
	     * Binary search in a list of numbers
	     * @instance
	     * @function binSearch
	     * @memberof opentype.Layout
	     * @param  {Array} arr
	     * @param  {number} value
	     * @return {number}
	     */
	    binSearch: binSearch,

	    /**
	     * Get or create the Layout table (GSUB, GPOS etc).
	     * @param  {boolean} create - Whether to create a new one.
	     * @return {Object} The GSUB or GPOS table.
	     */
	    getTable: function(create) {
	        var layout = this.font.tables[this.tableName];
	        if (!layout && create) {
	            layout = this.font.tables[this.tableName] = this.createDefaultTable();
	        }
	        return layout;
	    },

	    /**
	     * Returns all scripts in the substitution table.
	     * @instance
	     * @return {Array}
	     */
	    getScriptNames: function() {
	        var layout = this.getTable();
	        if (!layout) { return []; }
	        return layout.scripts.map(function(script) {
	            return script.tag;
	        });
	    },

	    /**
	     * Returns the best bet for a script name.
	     * Returns 'DFLT' if it exists.
	     * If not, returns 'latn' if it exists.
	     * If neither exist, returns undefined.
	     */
	    getDefaultScriptName: function() {
	        var layout = this.getTable();
	        if (!layout) { return; }
	        var hasLatn = false;
	        for (var i = 0; i < layout.scripts.length; i++) {
	            var name = layout.scripts[i].tag;
	            if (name === 'DFLT') { return name; }
	            if (name === 'latn') { hasLatn = true; }
	        }
	        if (hasLatn) { return 'latn'; }
	    },

	    /**
	     * Returns all LangSysRecords in the given script.
	     * @instance
	     * @param {string} [script='DFLT']
	     * @param {boolean} create - forces the creation of this script table if it doesn't exist.
	     * @return {Object} An object with tag and script properties.
	     */
	    getScriptTable: function(script, create) {
	        var layout = this.getTable(create);
	        if (layout) {
	            script = script || 'DFLT';
	            var scripts = layout.scripts;
	            var pos = searchTag(layout.scripts, script);
	            if (pos >= 0) {
	                return scripts[pos].script;
	            } else if (create) {
	                var scr = {
	                    tag: script,
	                    script: {
	                        defaultLangSys: {reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: []},
	                        langSysRecords: []
	                    }
	                };
	                scripts.splice(-1 - pos, 0, scr);
	                return scr.script;
	            }
	        }
	    },

	    /**
	     * Returns a language system table
	     * @instance
	     * @param {string} [script='DFLT']
	     * @param {string} [language='dlft']
	     * @param {boolean} create - forces the creation of this langSysTable if it doesn't exist.
	     * @return {Object}
	     */
	    getLangSysTable: function(script, language, create) {
	        var scriptTable = this.getScriptTable(script, create);
	        if (scriptTable) {
	            if (!language || language === 'dflt' || language === 'DFLT') {
	                return scriptTable.defaultLangSys;
	            }
	            var pos = searchTag(scriptTable.langSysRecords, language);
	            if (pos >= 0) {
	                return scriptTable.langSysRecords[pos].langSys;
	            } else if (create) {
	                var langSysRecord = {
	                    tag: language,
	                    langSys: {reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: []}
	                };
	                scriptTable.langSysRecords.splice(-1 - pos, 0, langSysRecord);
	                return langSysRecord.langSys;
	            }
	        }
	    },

	    /**
	     * Get a specific feature table.
	     * @instance
	     * @param {string} [script='DFLT']
	     * @param {string} [language='dlft']
	     * @param {string} feature - One of the codes listed at https://www.microsoft.com/typography/OTSPEC/featurelist.htm
	     * @param {boolean} create - forces the creation of the feature table if it doesn't exist.
	     * @return {Object}
	     */
	    getFeatureTable: function(script, language, feature, create) {
	        var langSysTable = this.getLangSysTable(script, language, create);
	        if (langSysTable) {
	            var featureRecord;
	            var featIndexes = langSysTable.featureIndexes;
	            var allFeatures = this.font.tables[this.tableName].features;
	            // The FeatureIndex array of indices is in arbitrary order,
	            // even if allFeatures is sorted alphabetically by feature tag.
	            for (var i = 0; i < featIndexes.length; i++) {
	                featureRecord = allFeatures[featIndexes[i]];
	                if (featureRecord.tag === feature) {
	                    return featureRecord.feature;
	                }
	            }
	            if (create) {
	                var index = allFeatures.length;
	                // Automatic ordering of features would require to shift feature indexes in the script list.
	                check.assert(index === 0 || feature >= allFeatures[index - 1].tag, 'Features must be added in alphabetical order.');
	                featureRecord = {
	                    tag: feature,
	                    feature: { params: 0, lookupListIndexes: [] }
	                };
	                allFeatures.push(featureRecord);
	                featIndexes.push(index);
	                return featureRecord.feature;
	            }
	        }
	    },

	    /**
	     * Get the lookup tables of a given type for a script/language/feature.
	     * @instance
	     * @param {string} [script='DFLT']
	     * @param {string} [language='dlft']
	     * @param {string} feature - 4-letter feature code
	     * @param {number} lookupType - 1 to 9
	     * @param {boolean} create - forces the creation of the lookup table if it doesn't exist, with no subtables.
	     * @return {Object[]}
	     */
	    getLookupTables: function(script, language, feature, lookupType, create) {
	        var featureTable = this.getFeatureTable(script, language, feature, create);
	        var tables = [];
	        if (featureTable) {
	            var lookupTable;
	            var lookupListIndexes = featureTable.lookupListIndexes;
	            var allLookups = this.font.tables[this.tableName].lookups;
	            // lookupListIndexes are in no particular order, so use naive search.
	            for (var i = 0; i < lookupListIndexes.length; i++) {
	                lookupTable = allLookups[lookupListIndexes[i]];
	                if (lookupTable.lookupType === lookupType) {
	                    tables.push(lookupTable);
	                }
	            }
	            if (tables.length === 0 && create) {
	                lookupTable = {
	                    lookupType: lookupType,
	                    lookupFlag: 0,
	                    subtables: [],
	                    markFilteringSet: undefined
	                };
	                var index = allLookups.length;
	                allLookups.push(lookupTable);
	                lookupListIndexes.push(index);
	                return [lookupTable];
	            }
	        }
	        return tables;
	    },

	    /**
	     * Find a glyph in a class definition table
	     * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#class-definition-table
	     * @param {object} classDefTable - an OpenType Layout class definition table
	     * @param {number} glyphIndex - the index of the glyph to find
	     * @returns {number} -1 if not found
	     */
	    getGlyphClass: function(classDefTable, glyphIndex) {
	        switch (classDefTable.format) {
	            case 1:
	                if (classDefTable.startGlyph <= glyphIndex && glyphIndex < classDefTable.startGlyph + classDefTable.classes.length) {
	                    return classDefTable.classes[glyphIndex - classDefTable.startGlyph];
	                }
	                return 0;
	            case 2:
	                var range = searchRange(classDefTable.ranges, glyphIndex);
	                return range ? range.classId : 0;
	        }
	    },

	    /**
	     * Find a glyph in a coverage table
	     * https://docs.microsoft.com/en-us/typography/opentype/spec/chapter2#coverage-table
	     * @param {object} coverageTable - an OpenType Layout coverage table
	     * @param {number} glyphIndex - the index of the glyph to find
	     * @returns {number} -1 if not found
	     */
	    getCoverageIndex: function(coverageTable, glyphIndex) {
	        switch (coverageTable.format) {
	            case 1:
	                var index = binSearch(coverageTable.glyphs, glyphIndex);
	                return index >= 0 ? index : -1;
	            case 2:
	                var range = searchRange(coverageTable.ranges, glyphIndex);
	                return range ? range.index + glyphIndex - range.start : -1;
	        }
	    },

	    /**
	     * Returns the list of glyph indexes of a coverage table.
	     * Format 1: the list is stored raw
	     * Format 2: compact list as range records.
	     * @instance
	     * @param  {Object} coverageTable
	     * @return {Array}
	     */
	    expandCoverage: function(coverageTable) {
	        if (coverageTable.format === 1) {
	            return coverageTable.glyphs;
	        } else {
	            var glyphs = [];
	            var ranges = coverageTable.ranges;
	            for (var i = 0; i < ranges.length; i++) {
	                var range = ranges[i];
	                var start = range.start;
	                var end = range.end;
	                for (var j = start; j <= end; j++) {
	                    glyphs.push(j);
	                }
	            }
	            return glyphs;
	        }
	    }

	};

	// The Position object provides utility methods to manipulate

	/**
	 * @exports opentype.Position
	 * @class
	 * @extends opentype.Layout
	 * @param {opentype.Font}
	 * @constructor
	 */
	function Position(font) {
	    Layout.call(this, font, 'gpos');
	}

	Position.prototype = Layout.prototype;

	/**
	 * Init some data for faster and easier access later.
	 */
	Position.prototype.init = function() {
	    var script = this.getDefaultScriptName();
	    this.defaultKerningTables = this.getKerningTables(script);
	};

	/**
	 * Find a glyph pair in a list of lookup tables of type 2 and retrieve the xAdvance kerning value.
	 *
	 * @param {integer} leftIndex - left glyph index
	 * @param {integer} rightIndex - right glyph index
	 * @returns {integer}
	 */
	Position.prototype.getKerningValue = function(kerningLookups, leftIndex, rightIndex) {
	    var this$1 = this;

	    for (var i = 0; i < kerningLookups.length; i++) {
	        var subtables = kerningLookups[i].subtables;
	        for (var j = 0; j < subtables.length; j++) {
	            var subtable = subtables[j];
	            var covIndex = this$1.getCoverageIndex(subtable.coverage, leftIndex);
	            if (covIndex < 0) { continue; }
	            switch (subtable.posFormat) {
	                case 1:
	                    // Search Pair Adjustment Positioning Format 1
	                    var pairSet = subtable.pairSets[covIndex];
	                    for (var k = 0; k < pairSet.length; k++) {
	                        var pair = pairSet[k];
	                        if (pair.secondGlyph === rightIndex) {
	                            return pair.value1 && pair.value1.xAdvance || 0;
	                        }
	                    }
	                    break;      // left glyph found, not right glyph - try next subtable
	                case 2:
	                    // Search Pair Adjustment Positioning Format 2
	                    var class1 = this$1.getGlyphClass(subtable.classDef1, leftIndex);
	                    var class2 = this$1.getGlyphClass(subtable.classDef2, rightIndex);
	                    var pair$1 = subtable.classRecords[class1][class2];
	                    return pair$1.value1 && pair$1.value1.xAdvance || 0;
	            }
	        }
	    }
	    return 0;
	};

	/**
	 * List all kerning lookup tables.
	 *
	 * @param {string} [script='DFLT'] - use font.position.getDefaultScriptName() for a better default value
	 * @param {string} [language='dflt']
	 * @return {object[]} The list of kerning lookup tables (may be empty), or undefined if there is no GPOS table (and we should use the kern table)
	 */
	Position.prototype.getKerningTables = function(script, language) {
	    if (this.font.tables.gpos) {
	        return this.getLookupTables(script, language, 'kern', 2);
	    }
	};

	// The Substitution object provides utility methods to manipulate

	/**
	 * @exports opentype.Substitution
	 * @class
	 * @extends opentype.Layout
	 * @param {opentype.Font}
	 * @constructor
	 */
	function Substitution(font) {
	    Layout.call(this, font, 'gsub');
	}

	// Check if 2 arrays of primitives are equal.
	function arraysEqual(ar1, ar2) {
	    var n = ar1.length;
	    if (n !== ar2.length) { return false; }
	    for (var i = 0; i < n; i++) {
	        if (ar1[i] !== ar2[i]) { return false; }
	    }
	    return true;
	}

	// Find the first subtable of a lookup table in a particular format.
	function getSubstFormat(lookupTable, format, defaultSubtable) {
	    var subtables = lookupTable.subtables;
	    for (var i = 0; i < subtables.length; i++) {
	        var subtable = subtables[i];
	        if (subtable.substFormat === format) {
	            return subtable;
	        }
	    }
	    if (defaultSubtable) {
	        subtables.push(defaultSubtable);
	        return defaultSubtable;
	    }
	    return undefined;
	}

	Substitution.prototype = Layout.prototype;

	/**
	 * Create a default GSUB table.
	 * @return {Object} gsub - The GSUB table.
	 */
	Substitution.prototype.createDefaultTable = function() {
	    // Generate a default empty GSUB table with just a DFLT script and dflt lang sys.
	    return {
	        version: 1,
	        scripts: [{
	            tag: 'DFLT',
	            script: {
	                defaultLangSys: { reserved: 0, reqFeatureIndex: 0xffff, featureIndexes: [] },
	                langSysRecords: []
	            }
	        }],
	        features: [],
	        lookups: []
	    };
	};

	/**
	 * List all single substitutions (lookup type 1) for a given script, language, and feature.
	 * @param {string} [script='DFLT']
	 * @param {string} [language='dflt']
	 * @param {string} feature - 4-character feature name ('aalt', 'salt', 'ss01'...)
	 * @return {Array} substitutions - The list of substitutions.
	 */
	Substitution.prototype.getSingle = function(feature, script, language) {
	    var this$1 = this;

	    var substitutions = [];
	    var lookupTables = this.getLookupTables(script, language, feature, 1);
	    for (var idx = 0; idx < lookupTables.length; idx++) {
	        var subtables = lookupTables[idx].subtables;
	        for (var i = 0; i < subtables.length; i++) {
	            var subtable = subtables[i];
	            var glyphs = this$1.expandCoverage(subtable.coverage);
	            var j = (void 0);
	            if (subtable.substFormat === 1) {
	                var delta = subtable.deltaGlyphId;
	                for (j = 0; j < glyphs.length; j++) {
	                    var glyph = glyphs[j];
	                    substitutions.push({ sub: glyph, by: glyph + delta });
	                }
	            } else {
	                var substitute = subtable.substitute;
	                for (j = 0; j < glyphs.length; j++) {
	                    substitutions.push({ sub: glyphs[j], by: substitute[j] });
	                }
	            }
	        }
	    }
	    return substitutions;
	};

	/**
	 * List all alternates (lookup type 3) for a given script, language, and feature.
	 * @param {string} [script='DFLT']
	 * @param {string} [language='dflt']
	 * @param {string} feature - 4-character feature name ('aalt', 'salt'...)
	 * @return {Array} alternates - The list of alternates
	 */
	Substitution.prototype.getAlternates = function(feature, script, language) {
	    var this$1 = this;

	    var alternates = [];
	    var lookupTables = this.getLookupTables(script, language, feature, 3);
	    for (var idx = 0; idx < lookupTables.length; idx++) {
	        var subtables = lookupTables[idx].subtables;
	        for (var i = 0; i < subtables.length; i++) {
	            var subtable = subtables[i];
	            var glyphs = this$1.expandCoverage(subtable.coverage);
	            var alternateSets = subtable.alternateSets;
	            for (var j = 0; j < glyphs.length; j++) {
	                alternates.push({ sub: glyphs[j], by: alternateSets[j] });
	            }
	        }
	    }
	    return alternates;
	};

	/**
	 * List all ligatures (lookup type 4) for a given script, language, and feature.
	 * The result is an array of ligature objects like { sub: [ids], by: id }
	 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
	 * @param {string} [script='DFLT']
	 * @param {string} [language='dflt']
	 * @return {Array} ligatures - The list of ligatures.
	 */
	Substitution.prototype.getLigatures = function(feature, script, language) {
	    var this$1 = this;

	    var ligatures = [];
	    var lookupTables = this.getLookupTables(script, language, feature, 4);
	    for (var idx = 0; idx < lookupTables.length; idx++) {
	        var subtables = lookupTables[idx].subtables;
	        for (var i = 0; i < subtables.length; i++) {
	            var subtable = subtables[i];
	            var glyphs = this$1.expandCoverage(subtable.coverage);
	            var ligatureSets = subtable.ligatureSets;
	            for (var j = 0; j < glyphs.length; j++) {
	                var startGlyph = glyphs[j];
	                var ligSet = ligatureSets[j];
	                for (var k = 0; k < ligSet.length; k++) {
	                    var lig = ligSet[k];
	                    ligatures.push({
	                        sub: [startGlyph].concat(lig.components),
	                        by: lig.ligGlyph
	                    });
	                }
	            }
	        }
	    }
	    return ligatures;
	};

	/**
	 * Add or modify a single substitution (lookup type 1)
	 * Format 2, more flexible, is always used.
	 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
	 * @param {Object} substitution - { sub: id, delta: number } for format 1 or { sub: id, by: id } for format 2.
	 * @param {string} [script='DFLT']
	 * @param {string} [language='dflt']
	 */
	Substitution.prototype.addSingle = function(feature, substitution, script, language) {
	    var lookupTable = this.getLookupTables(script, language, feature, 1, true)[0];
	    var subtable = getSubstFormat(lookupTable, 2, {                // lookup type 1 subtable, format 2, coverage format 1
	        substFormat: 2,
	        coverage: {format: 1, glyphs: []},
	        substitute: []
	    });
	    check.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);
	    var coverageGlyph = substitution.sub;
	    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
	    if (pos < 0) {
	        pos = -1 - pos;
	        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
	        subtable.substitute.splice(pos, 0, 0);
	    }
	    subtable.substitute[pos] = substitution.by;
	};

	/**
	 * Add or modify an alternate substitution (lookup type 1)
	 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
	 * @param {Object} substitution - { sub: id, by: [ids] }
	 * @param {string} [script='DFLT']
	 * @param {string} [language='dflt']
	 */
	Substitution.prototype.addAlternate = function(feature, substitution, script, language) {
	    var lookupTable = this.getLookupTables(script, language, feature, 3, true)[0];
	    var subtable = getSubstFormat(lookupTable, 1, {                // lookup type 3 subtable, format 1, coverage format 1
	        substFormat: 1,
	        coverage: {format: 1, glyphs: []},
	        alternateSets: []
	    });
	    check.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);
	    var coverageGlyph = substitution.sub;
	    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
	    if (pos < 0) {
	        pos = -1 - pos;
	        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
	        subtable.alternateSets.splice(pos, 0, 0);
	    }
	    subtable.alternateSets[pos] = substitution.by;
	};

	/**
	 * Add a ligature (lookup type 4)
	 * Ligatures with more components must be stored ahead of those with fewer components in order to be found
	 * @param {string} feature - 4-letter feature name ('liga', 'rlig', 'dlig'...)
	 * @param {Object} ligature - { sub: [ids], by: id }
	 * @param {string} [script='DFLT']
	 * @param {string} [language='dflt']
	 */
	Substitution.prototype.addLigature = function(feature, ligature, script, language) {
	    var lookupTable = this.getLookupTables(script, language, feature, 4, true)[0];
	    var subtable = lookupTable.subtables[0];
	    if (!subtable) {
	        subtable = {                // lookup type 4 subtable, format 1, coverage format 1
	            substFormat: 1,
	            coverage: { format: 1, glyphs: [] },
	            ligatureSets: []
	        };
	        lookupTable.subtables[0] = subtable;
	    }
	    check.assert(subtable.coverage.format === 1, 'Ligature: unable to modify coverage table format ' + subtable.coverage.format);
	    var coverageGlyph = ligature.sub[0];
	    var ligComponents = ligature.sub.slice(1);
	    var ligatureTable = {
	        ligGlyph: ligature.by,
	        components: ligComponents
	    };
	    var pos = this.binSearch(subtable.coverage.glyphs, coverageGlyph);
	    if (pos >= 0) {
	        // ligatureSet already exists
	        var ligatureSet = subtable.ligatureSets[pos];
	        for (var i = 0; i < ligatureSet.length; i++) {
	            // If ligature already exists, return.
	            if (arraysEqual(ligatureSet[i].components, ligComponents)) {
	                return;
	            }
	        }
	        // ligature does not exist: add it.
	        ligatureSet.push(ligatureTable);
	    } else {
	        // Create a new ligatureSet and add coverage for the first glyph.
	        pos = -1 - pos;
	        subtable.coverage.glyphs.splice(pos, 0, coverageGlyph);
	        subtable.ligatureSets.splice(pos, 0, [ligatureTable]);
	    }
	};

	/**
	 * List all feature data for a given script and language.
	 * @param {string} feature - 4-letter feature name
	 * @param {string} [script='DFLT']
	 * @param {string} [language='dflt']
	 * @return {Array} substitutions - The list of substitutions.
	 */
	Substitution.prototype.getFeature = function(feature, script, language) {
	    if (/ss\d\d/.test(feature)) {
	        // ss01 - ss20
	        return this.getSingle(feature, script, language);
	    }
	    switch (feature) {
	        case 'aalt':
	        case 'salt':
	            return this.getSingle(feature, script, language)
	                    .concat(this.getAlternates(feature, script, language));
	        case 'dlig':
	        case 'liga':
	        case 'rlig': return this.getLigatures(feature, script, language);
	    }
	    return undefined;
	};

	/**
	 * Add a substitution to a feature for a given script and language.
	 * @param {string} feature - 4-letter feature name
	 * @param {Object} sub - the substitution to add (an object like { sub: id or [ids], by: id or [ids] })
	 * @param {string} [script='DFLT']
	 * @param {string} [language='dflt']
	 */
	Substitution.prototype.add = function(feature, sub, script, language) {
	    if (/ss\d\d/.test(feature)) {
	        // ss01 - ss20
	        return this.addSingle(feature, sub, script, language);
	    }
	    switch (feature) {
	        case 'aalt':
	        case 'salt':
	            if (typeof sub.by === 'number') {
	                return this.addSingle(feature, sub, script, language);
	            }
	            return this.addAlternate(feature, sub, script, language);
	        case 'dlig':
	        case 'liga':
	        case 'rlig':
	            return this.addLigature(feature, sub, script, language);
	    }
	    return undefined;
	};

	function isBrowser() {
	    return typeof window !== 'undefined';
	}

	function nodeBufferToArrayBuffer(buffer) {
	    var ab = new ArrayBuffer(buffer.length);
	    var view = new Uint8Array(ab);
	    for (var i = 0; i < buffer.length; ++i) {
	        view[i] = buffer[i];
	    }

	    return ab;
	}

	function arrayBufferToNodeBuffer(ab) {
	    var buffer = new Buffer(ab.byteLength);
	    var view = new Uint8Array(ab);
	    for (var i = 0; i < buffer.length; ++i) {
	        buffer[i] = view[i];
	    }

	    return buffer;
	}

	function checkArgument(expression, message) {
	    if (!expression) {
	        throw message;
	    }
	}

	// The `glyf` table describes the glyphs in TrueType outline format.

	// Parse the coordinate data for a glyph.
	function parseGlyphCoordinate(p, flag, previousValue, shortVectorBitMask, sameBitMask) {
	    var v;
	    if ((flag & shortVectorBitMask) > 0) {
	        // The coordinate is 1 byte long.
	        v = p.parseByte();
	        // The `same` bit is re-used for short values to signify the sign of the value.
	        if ((flag & sameBitMask) === 0) {
	            v = -v;
	        }

	        v = previousValue + v;
	    } else {
	        //  The coordinate is 2 bytes long.
	        // If the `same` bit is set, the coordinate is the same as the previous coordinate.
	        if ((flag & sameBitMask) > 0) {
	            v = previousValue;
	        } else {
	            // Parse the coordinate as a signed 16-bit delta value.
	            v = previousValue + p.parseShort();
	        }
	    }

	    return v;
	}

	// Parse a TrueType glyph.
	function parseGlyph(glyph, data, start) {
	    var p = new parse.Parser(data, start);
	    glyph.numberOfContours = p.parseShort();
	    glyph._xMin = p.parseShort();
	    glyph._yMin = p.parseShort();
	    glyph._xMax = p.parseShort();
	    glyph._yMax = p.parseShort();
	    var flags;
	    var flag;

	    if (glyph.numberOfContours > 0) {
	        // This glyph is not a composite.
	        var endPointIndices = glyph.endPointIndices = [];
	        for (var i = 0; i < glyph.numberOfContours; i += 1) {
	            endPointIndices.push(p.parseUShort());
	        }

	        glyph.instructionLength = p.parseUShort();
	        glyph.instructions = [];
	        for (var i$1 = 0; i$1 < glyph.instructionLength; i$1 += 1) {
	            glyph.instructions.push(p.parseByte());
	        }

	        var numberOfCoordinates = endPointIndices[endPointIndices.length - 1] + 1;
	        flags = [];
	        for (var i$2 = 0; i$2 < numberOfCoordinates; i$2 += 1) {
	            flag = p.parseByte();
	            flags.push(flag);
	            // If bit 3 is set, we repeat this flag n times, where n is the next byte.
	            if ((flag & 8) > 0) {
	                var repeatCount = p.parseByte();
	                for (var j = 0; j < repeatCount; j += 1) {
	                    flags.push(flag);
	                    i$2 += 1;
	                }
	            }
	        }

	        check.argument(flags.length === numberOfCoordinates, 'Bad flags.');

	        if (endPointIndices.length > 0) {
	            var points = [];
	            var point;
	            // X/Y coordinates are relative to the previous point, except for the first point which is relative to 0,0.
	            if (numberOfCoordinates > 0) {
	                for (var i$3 = 0; i$3 < numberOfCoordinates; i$3 += 1) {
	                    flag = flags[i$3];
	                    point = {};
	                    point.onCurve = !!(flag & 1);
	                    point.lastPointOfContour = endPointIndices.indexOf(i$3) >= 0;
	                    points.push(point);
	                }

	                var px = 0;
	                for (var i$4 = 0; i$4 < numberOfCoordinates; i$4 += 1) {
	                    flag = flags[i$4];
	                    point = points[i$4];
	                    point.x = parseGlyphCoordinate(p, flag, px, 2, 16);
	                    px = point.x;
	                }

	                var py = 0;
	                for (var i$5 = 0; i$5 < numberOfCoordinates; i$5 += 1) {
	                    flag = flags[i$5];
	                    point = points[i$5];
	                    point.y = parseGlyphCoordinate(p, flag, py, 4, 32);
	                    py = point.y;
	                }
	            }

	            glyph.points = points;
	        } else {
	            glyph.points = [];
	        }
	    } else if (glyph.numberOfContours === 0) {
	        glyph.points = [];
	    } else {
	        glyph.isComposite = true;
	        glyph.points = [];
	        glyph.components = [];
	        var moreComponents = true;
	        while (moreComponents) {
	            flags = p.parseUShort();
	            var component = {
	                glyphIndex: p.parseUShort(),
	                xScale: 1,
	                scale01: 0,
	                scale10: 0,
	                yScale: 1,
	                dx: 0,
	                dy: 0
	            };
	            if ((flags & 1) > 0) {
	                // The arguments are words
	                if ((flags & 2) > 0) {
	                    // values are offset
	                    component.dx = p.parseShort();
	                    component.dy = p.parseShort();
	                } else {
	                    // values are matched points
	                    component.matchedPoints = [p.parseUShort(), p.parseUShort()];
	                }

	            } else {
	                // The arguments are bytes
	                if ((flags & 2) > 0) {
	                    // values are offset
	                    component.dx = p.parseChar();
	                    component.dy = p.parseChar();
	                } else {
	                    // values are matched points
	                    component.matchedPoints = [p.parseByte(), p.parseByte()];
	                }
	            }

	            if ((flags & 8) > 0) {
	                // We have a scale
	                component.xScale = component.yScale = p.parseF2Dot14();
	            } else if ((flags & 64) > 0) {
	                // We have an X / Y scale
	                component.xScale = p.parseF2Dot14();
	                component.yScale = p.parseF2Dot14();
	            } else if ((flags & 128) > 0) {
	                // We have a 2x2 transformation
	                component.xScale = p.parseF2Dot14();
	                component.scale01 = p.parseF2Dot14();
	                component.scale10 = p.parseF2Dot14();
	                component.yScale = p.parseF2Dot14();
	            }

	            glyph.components.push(component);
	            moreComponents = !!(flags & 32);
	        }
	        if (flags & 0x100) {
	            // We have instructions
	            glyph.instructionLength = p.parseUShort();
	            glyph.instructions = [];
	            for (var i$6 = 0; i$6 < glyph.instructionLength; i$6 += 1) {
	                glyph.instructions.push(p.parseByte());
	            }
	        }
	    }
	}

	// Transform an array of points and return a new array.
	function transformPoints(points, transform) {
	    var newPoints = [];
	    for (var i = 0; i < points.length; i += 1) {
	        var pt = points[i];
	        var newPt = {
	            x: transform.xScale * pt.x + transform.scale01 * pt.y + transform.dx,
	            y: transform.scale10 * pt.x + transform.yScale * pt.y + transform.dy,
	            onCurve: pt.onCurve,
	            lastPointOfContour: pt.lastPointOfContour
	        };
	        newPoints.push(newPt);
	    }

	    return newPoints;
	}

	function getContours(points) {
	    var contours = [];
	    var currentContour = [];
	    for (var i = 0; i < points.length; i += 1) {
	        var pt = points[i];
	        currentContour.push(pt);
	        if (pt.lastPointOfContour) {
	            contours.push(currentContour);
	            currentContour = [];
	        }
	    }

	    check.argument(currentContour.length === 0, 'There are still points left in the current contour.');
	    return contours;
	}

	// Convert the TrueType glyph outline to a Path.
	function getPath(points) {
	    var p = new Path();
	    if (!points) {
	        return p;
	    }

	    var contours = getContours(points);

	    for (var contourIndex = 0; contourIndex < contours.length; ++contourIndex) {
	        var contour = contours[contourIndex];

	        var prev = null;
	        var curr = contour[contour.length - 1];
	        var next = contour[0];

	        if (curr.onCurve) {
	            p.moveTo(curr.x, curr.y);
	        } else {
	            if (next.onCurve) {
	                p.moveTo(next.x, next.y);
	            } else {
	                // If both first and last points are off-curve, start at their middle.
	                var start = {x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5};
	                p.moveTo(start.x, start.y);
	            }
	        }

	        for (var i = 0; i < contour.length; ++i) {
	            prev = curr;
	            curr = next;
	            next = contour[(i + 1) % contour.length];

	            if (curr.onCurve) {
	                // This is a straight line.
	                p.lineTo(curr.x, curr.y);
	            } else {
	                var prev2 = prev;
	                var next2 = next;

	                if (!prev.onCurve) {
	                    prev2 = { x: (curr.x + prev.x) * 0.5, y: (curr.y + prev.y) * 0.5 };
	                }

	                if (!next.onCurve) {
	                    next2 = { x: (curr.x + next.x) * 0.5, y: (curr.y + next.y) * 0.5 };
	                }

	                p.quadraticCurveTo(curr.x, curr.y, next2.x, next2.y);
	            }
	        }

	        p.closePath();
	    }
	    return p;
	}

	function buildPath(glyphs, glyph) {
	    if (glyph.isComposite) {
	        for (var j = 0; j < glyph.components.length; j += 1) {
	            var component = glyph.components[j];
	            var componentGlyph = glyphs.get(component.glyphIndex);
	            // Force the ttfGlyphLoader to parse the glyph.
	            componentGlyph.getPath();
	            if (componentGlyph.points) {
	                var transformedPoints = (void 0);
	                if (component.matchedPoints === undefined) {
	                    // component positioned by offset
	                    transformedPoints = transformPoints(componentGlyph.points, component);
	                } else {
	                    // component positioned by matched points
	                    if ((component.matchedPoints[0] > glyph.points.length - 1) ||
	                        (component.matchedPoints[1] > componentGlyph.points.length - 1)) {
	                        throw Error('Matched points out of range in ' + glyph.name);
	                    }
	                    var firstPt = glyph.points[component.matchedPoints[0]];
	                    var secondPt = componentGlyph.points[component.matchedPoints[1]];
	                    var transform = {
	                        xScale: component.xScale, scale01: component.scale01,
	                        scale10: component.scale10, yScale: component.yScale,
	                        dx: 0, dy: 0
	                    };
	                    secondPt = transformPoints([secondPt], transform)[0];
	                    transform.dx = firstPt.x - secondPt.x;
	                    transform.dy = firstPt.y - secondPt.y;
	                    transformedPoints = transformPoints(componentGlyph.points, transform);
	                }
	                glyph.points = glyph.points.concat(transformedPoints);
	            }
	        }
	    }

	    return getPath(glyph.points);
	}

	// Parse all the glyphs according to the offsets from the `loca` table.
	function parseGlyfTable(data, start, loca, font) {
	    var glyphs = new glyphset.GlyphSet(font);

	    // The last element of the loca table is invalid.
	    for (var i = 0; i < loca.length - 1; i += 1) {
	        var offset = loca[i];
	        var nextOffset = loca[i + 1];
	        if (offset !== nextOffset) {
	            glyphs.push(i, glyphset.ttfGlyphLoader(font, i, parseGlyph, data, start + offset, buildPath));
	        } else {
	            glyphs.push(i, glyphset.glyphLoader(font, i));
	        }
	    }

	    return glyphs;
	}

	var glyf = { getPath: getPath, parse: parseGlyfTable };

	/* A TrueType font hinting interpreter.
	*
	* (c) 2017 Axel Kittenberger
	*
	* This interpreter has been implemented according to this documentation:
	* https://developer.apple.com/fonts/TrueType-Reference-Manual/RM05/Chap5.html
	*
	* According to the documentation F24DOT6 values are used for pixels.
	* That means calculation is 1/64 pixel accurate and uses integer operations.
	* However, Javascript has floating point operations by default and only
	* those are available. One could make a case to simulate the 1/64 accuracy
	* exactly by truncating after every division operation
	* (for example with << 0) to get pixel exactly results as other TrueType
	* implementations. It may make sense since some fonts are pixel optimized
	* by hand using DELTAP instructions. The current implementation doesn't
	* and rather uses full floating point precision.
	*
	* xScale, yScale and rotation is currently ignored.
	*
	* A few non-trivial instructions are missing as I didn't encounter yet
	* a font that used them to test a possible implementation.
	*
	* Some fonts seem to use undocumented features regarding the twilight zone.
	* Only some of them are implemented as they were encountered.
	*
	* The exports.DEBUG statements are removed on the minified distribution file.
	*/

	var instructionTable;
	var exec;
	var execGlyph;
	var execComponent;

	/*
	* Creates a hinting object.
	*
	* There ought to be exactly one
	* for each truetype font that is used for hinting.
	*/
	function Hinting(font) {
	    // the font this hinting object is for
	    this.font = font;

	    this.getCommands = function (hPoints) {
	        return glyf.getPath(hPoints).commands;
	    };

	    // cached states
	    this._fpgmState  =
	    this._prepState  =
	        undefined;

	    // errorState
	    // 0 ... all okay
	    // 1 ... had an error in a glyf,
	    //       continue working but stop spamming
	    //       the console
	    // 2 ... error at prep, stop hinting at this ppem
	    // 3 ... error at fpeg, stop hinting for this font at all
	    this._errorState = 0;
	}

	/*
	* Not rounding.
	*/
	function roundOff(v) {
	    return v;
	}

	/*
	* Rounding to grid.
	*/
	function roundToGrid(v) {
	    //Rounding in TT is supposed to "symmetrical around zero"
	    return Math.sign(v) * Math.round(Math.abs(v));
	}

	/*
	* Rounding to double grid.
	*/
	function roundToDoubleGrid(v) {
	    return Math.sign(v) * Math.round(Math.abs(v * 2)) / 2;
	}

	/*
	* Rounding to half grid.
	*/
	function roundToHalfGrid(v) {
	    return Math.sign(v) * (Math.round(Math.abs(v) + 0.5) - 0.5);
	}

	/*
	* Rounding to up to grid.
	*/
	function roundUpToGrid(v) {
	    return Math.sign(v) * Math.ceil(Math.abs(v));
	}

	/*
	* Rounding to down to grid.
	*/
	function roundDownToGrid(v) {
	    return Math.sign(v) * Math.floor(Math.abs(v));
	}

	/*
	* Super rounding.
	*/
	var roundSuper = function (v) {
	    var period = this.srPeriod;
	    var phase = this.srPhase;
	    var threshold = this.srThreshold;
	    var sign = 1;

	    if (v < 0) {
	        v = -v;
	        sign = -1;
	    }

	    v += threshold - phase;

	    v = Math.trunc(v / period) * period;

	    v += phase;

	    // according to http://xgridfit.sourceforge.net/round.html
	    if (v < 0) { return phase * sign; }

	    return v * sign;
	};

	/*
	* Unit vector of x-axis.
	*/
	var xUnitVector = {
	    x: 1,

	    y: 0,

	    axis: 'x',

	    // Gets the projected distance between two points.
	    // o1/o2 ... if true, respective original position is used.
	    distance: function (p1, p2, o1, o2) {
	        return (o1 ? p1.xo : p1.x) - (o2 ? p2.xo : p2.x);
	    },

	    // Moves point p so the moved position has the same relative
	    // position to the moved positions of rp1 and rp2 than the
	    // original positions had.
	    //
	    // See APPENDIX on INTERPOLATE at the bottom of this file.
	    interpolate: function (p, rp1, rp2, pv) {
	        var do1;
	        var do2;
	        var doa1;
	        var doa2;
	        var dm1;
	        var dm2;
	        var dt;

	        if (!pv || pv === this) {
	            do1 = p.xo - rp1.xo;
	            do2 = p.xo - rp2.xo;
	            dm1 = rp1.x - rp1.xo;
	            dm2 = rp2.x - rp2.xo;
	            doa1 = Math.abs(do1);
	            doa2 = Math.abs(do2);
	            dt = doa1 + doa2;

	            if (dt === 0) {
	                p.x = p.xo + (dm1 + dm2) / 2;
	                return;
	            }

	            p.x = p.xo + (dm1 * doa2 + dm2 * doa1) / dt;
	            return;
	        }

	        do1 = pv.distance(p, rp1, true, true);
	        do2 = pv.distance(p, rp2, true, true);
	        dm1 = pv.distance(rp1, rp1, false, true);
	        dm2 = pv.distance(rp2, rp2, false, true);
	        doa1 = Math.abs(do1);
	        doa2 = Math.abs(do2);
	        dt = doa1 + doa2;

	        if (dt === 0) {
	            xUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
	            return;
	        }

	        xUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
	    },

	    // Slope of line normal to this
	    normalSlope: Number.NEGATIVE_INFINITY,

	    // Sets the point 'p' relative to point 'rp'
	    // by the distance 'd'.
	    //
	    // See APPENDIX on SETRELATIVE at the bottom of this file.
	    //
	    // p   ... point to set
	    // rp  ... reference point
	    // d   ... distance on projection vector
	    // pv  ... projection vector (undefined = this)
	    // org ... if true, uses the original position of rp as reference.
	    setRelative: function (p, rp, d, pv, org) {
	        if (!pv || pv === this) {
	            p.x = (org ? rp.xo : rp.x) + d;
	            return;
	        }

	        var rpx = org ? rp.xo : rp.x;
	        var rpy = org ? rp.yo : rp.y;
	        var rpdx = rpx + d * pv.x;
	        var rpdy = rpy + d * pv.y;

	        p.x = rpdx + (p.y - rpdy) / pv.normalSlope;
	    },

	    // Slope of vector line.
	    slope: 0,

	    // Touches the point p.
	    touch: function (p) {
	        p.xTouched = true;
	    },

	    // Tests if a point p is touched.
	    touched: function (p) {
	        return p.xTouched;
	    },

	    // Untouches the point p.
	    untouch: function (p) {
	        p.xTouched = false;
	    }
	};

	/*
	* Unit vector of y-axis.
	*/
	var yUnitVector = {
	    x: 0,

	    y: 1,

	    axis: 'y',

	    // Gets the projected distance between two points.
	    // o1/o2 ... if true, respective original position is used.
	    distance: function (p1, p2, o1, o2) {
	        return (o1 ? p1.yo : p1.y) - (o2 ? p2.yo : p2.y);
	    },

	    // Moves point p so the moved position has the same relative
	    // position to the moved positions of rp1 and rp2 than the
	    // original positions had.
	    //
	    // See APPENDIX on INTERPOLATE at the bottom of this file.
	    interpolate: function (p, rp1, rp2, pv) {
	        var do1;
	        var do2;
	        var doa1;
	        var doa2;
	        var dm1;
	        var dm2;
	        var dt;

	        if (!pv || pv === this) {
	            do1 = p.yo - rp1.yo;
	            do2 = p.yo - rp2.yo;
	            dm1 = rp1.y - rp1.yo;
	            dm2 = rp2.y - rp2.yo;
	            doa1 = Math.abs(do1);
	            doa2 = Math.abs(do2);
	            dt = doa1 + doa2;

	            if (dt === 0) {
	                p.y = p.yo + (dm1 + dm2) / 2;
	                return;
	            }

	            p.y = p.yo + (dm1 * doa2 + dm2 * doa1) / dt;
	            return;
	        }

	        do1 = pv.distance(p, rp1, true, true);
	        do2 = pv.distance(p, rp2, true, true);
	        dm1 = pv.distance(rp1, rp1, false, true);
	        dm2 = pv.distance(rp2, rp2, false, true);
	        doa1 = Math.abs(do1);
	        doa2 = Math.abs(do2);
	        dt = doa1 + doa2;

	        if (dt === 0) {
	            yUnitVector.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
	            return;
	        }

	        yUnitVector.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
	    },

	    // Slope of line normal to this.
	    normalSlope: 0,

	    // Sets the point 'p' relative to point 'rp'
	    // by the distance 'd'
	    //
	    // See APPENDIX on SETRELATIVE at the bottom of this file.
	    //
	    // p   ... point to set
	    // rp  ... reference point
	    // d   ... distance on projection vector
	    // pv  ... projection vector (undefined = this)
	    // org ... if true, uses the original position of rp as reference.
	    setRelative: function (p, rp, d, pv, org) {
	        if (!pv || pv === this) {
	            p.y = (org ? rp.yo : rp.y) + d;
	            return;
	        }

	        var rpx = org ? rp.xo : rp.x;
	        var rpy = org ? rp.yo : rp.y;
	        var rpdx = rpx + d * pv.x;
	        var rpdy = rpy + d * pv.y;

	        p.y = rpdy + pv.normalSlope * (p.x - rpdx);
	    },

	    // Slope of vector line.
	    slope: Number.POSITIVE_INFINITY,

	    // Touches the point p.
	    touch: function (p) {
	        p.yTouched = true;
	    },

	    // Tests if a point p is touched.
	    touched: function (p) {
	        return p.yTouched;
	    },

	    // Untouches the point p.
	    untouch: function (p) {
	        p.yTouched = false;
	    }
	};

	Object.freeze(xUnitVector);
	Object.freeze(yUnitVector);

	/*
	* Creates a unit vector that is not x- or y-axis.
	*/
	function UnitVector(x, y) {
	    this.x = x;
	    this.y = y;
	    this.axis = undefined;
	    this.slope = y / x;
	    this.normalSlope = -x / y;
	    Object.freeze(this);
	}

	/*
	* Gets the projected distance between two points.
	* o1/o2 ... if true, respective original position is used.
	*/
	UnitVector.prototype.distance = function(p1, p2, o1, o2) {
	    return (
	        this.x * xUnitVector.distance(p1, p2, o1, o2) +
	        this.y * yUnitVector.distance(p1, p2, o1, o2)
	    );
	};

	/*
	* Moves point p so the moved position has the same relative
	* position to the moved positions of rp1 and rp2 than the
	* original positions had.
	*
	* See APPENDIX on INTERPOLATE at the bottom of this file.
	*/
	UnitVector.prototype.interpolate = function(p, rp1, rp2, pv) {
	    var dm1;
	    var dm2;
	    var do1;
	    var do2;
	    var doa1;
	    var doa2;
	    var dt;

	    do1 = pv.distance(p, rp1, true, true);
	    do2 = pv.distance(p, rp2, true, true);
	    dm1 = pv.distance(rp1, rp1, false, true);
	    dm2 = pv.distance(rp2, rp2, false, true);
	    doa1 = Math.abs(do1);
	    doa2 = Math.abs(do2);
	    dt = doa1 + doa2;

	    if (dt === 0) {
	        this.setRelative(p, p, (dm1 + dm2) / 2, pv, true);
	        return;
	    }

	    this.setRelative(p, p, (dm1 * doa2 + dm2 * doa1) / dt, pv, true);
	};

	/*
	* Sets the point 'p' relative to point 'rp'
	* by the distance 'd'
	*
	* See APPENDIX on SETRELATIVE at the bottom of this file.
	*
	* p   ...  point to set
	* rp  ... reference point
	* d   ... distance on projection vector
	* pv  ... projection vector (undefined = this)
	* org ... if true, uses the original position of rp as reference.
	*/
	UnitVector.prototype.setRelative = function(p, rp, d, pv, org) {
	    pv = pv || this;

	    var rpx = org ? rp.xo : rp.x;
	    var rpy = org ? rp.yo : rp.y;
	    var rpdx = rpx + d * pv.x;
	    var rpdy = rpy + d * pv.y;

	    var pvns = pv.normalSlope;
	    var fvs = this.slope;

	    var px = p.x;
	    var py = p.y;

	    p.x = (fvs * px - pvns * rpdx + rpdy - py) / (fvs - pvns);
	    p.y = fvs * (p.x - px) + py;
	};

	/*
	* Touches the point p.
	*/
	UnitVector.prototype.touch = function(p) {
	    p.xTouched = true;
	    p.yTouched = true;
	};

	/*
	* Returns a unit vector with x/y coordinates.
	*/
	function getUnitVector(x, y) {
	    var d = Math.sqrt(x * x + y * y);

	    x /= d;
	    y /= d;

	    if (x === 1 && y === 0) { return xUnitVector; }
	    else if (x === 0 && y === 1) { return yUnitVector; }
	    else { return new UnitVector(x, y); }
	}

	/*
	* Creates a point in the hinting engine.
	*/
	function HPoint(
	    x,
	    y,
	    lastPointOfContour,
	    onCurve
	) {
	    this.x = this.xo = Math.round(x * 64) / 64; // hinted x value and original x-value
	    this.y = this.yo = Math.round(y * 64) / 64; // hinted y value and original y-value

	    this.lastPointOfContour = lastPointOfContour;
	    this.onCurve = onCurve;
	    this.prevPointOnContour = undefined;
	    this.nextPointOnContour = undefined;
	    this.xTouched = false;
	    this.yTouched = false;

	    Object.preventExtensions(this);
	}

	/*
	* Returns the next touched point on the contour.
	*
	* v  ... unit vector to test touch axis.
	*/
	HPoint.prototype.nextTouched = function(v) {
	    var p = this.nextPointOnContour;

	    while (!v.touched(p) && p !== this) { p = p.nextPointOnContour; }

	    return p;
	};

	/*
	* Returns the previous touched point on the contour
	*
	* v  ... unit vector to test touch axis.
	*/
	HPoint.prototype.prevTouched = function(v) {
	    var p = this.prevPointOnContour;

	    while (!v.touched(p) && p !== this) { p = p.prevPointOnContour; }

	    return p;
	};

	/*
	* The zero point.
	*/
	var HPZero = Object.freeze(new HPoint(0, 0));

	/*
	* The default state of the interpreter.
	*
	* Note: Freezing the defaultState and then deriving from it
	* makes the V8 Javascript engine going awkward,
	* so this is avoided, albeit the defaultState shouldn't
	* ever change.
	*/
	var defaultState = {
	    cvCutIn: 17 / 16,    // control value cut in
	    deltaBase: 9,
	    deltaShift: 0.125,
	    loop: 1,             // loops some instructions
	    minDis: 1,           // minimum distance
	    autoFlip: true
	};

	/*
	* The current state of the interpreter.
	*
	* env  ... 'fpgm' or 'prep' or 'glyf'
	* prog ... the program
	*/
	function State(env, prog) {
	    this.env = env;
	    this.stack = [];
	    this.prog = prog;

	    switch (env) {
	        case 'glyf' :
	            this.zp0 = this.zp1 = this.zp2 = 1;
	            this.rp0 = this.rp1 = this.rp2 = 0;
	            /* fall through */
	        case 'prep' :
	            this.fv = this.pv = this.dpv = xUnitVector;
	            this.round = roundToGrid;
	    }
	}

	/*
	* Executes a glyph program.
	*
	* This does the hinting for each glyph.
	*
	* Returns an array of moved points.
	*
	* glyph: the glyph to hint
	* ppem: the size the glyph is rendered for
	*/
	Hinting.prototype.exec = function(glyph, ppem) {
	    if (typeof ppem !== 'number') {
	        throw new Error('Point size is not a number!');
	    }

	    // Received a fatal error, don't do any hinting anymore.
	    if (this._errorState > 2) { return; }

	    var font = this.font;
	    var prepState = this._prepState;

	    if (!prepState || prepState.ppem !== ppem) {
	        var fpgmState = this._fpgmState;

	        if (!fpgmState) {
	            // Executes the fpgm state.
	            // This is used by fonts to define functions.
	            State.prototype = defaultState;

	            fpgmState =
	            this._fpgmState =
	                new State('fpgm', font.tables.fpgm);

	            fpgmState.funcs = [ ];
	            fpgmState.font = font;

	            if (exports.DEBUG) {
	                console.log('---EXEC FPGM---');
	                fpgmState.step = -1;
	            }

	            try {
	                exec(fpgmState);
	            } catch (e) {
	                console.log('Hinting error in FPGM:' + e);
	                this._errorState = 3;
	                return;
	            }
	        }

	        // Executes the prep program for this ppem setting.
	        // This is used by fonts to set cvt values
	        // depending on to be rendered font size.

	        State.prototype = fpgmState;
	        prepState =
	        this._prepState =
	            new State('prep', font.tables.prep);

	        prepState.ppem = ppem;

	        // Creates a copy of the cvt table
	        // and scales it to the current ppem setting.
	        var oCvt = font.tables.cvt;
	        if (oCvt) {
	            var cvt = prepState.cvt = new Array(oCvt.length);
	            var scale = ppem / font.unitsPerEm;
	            for (var c = 0; c < oCvt.length; c++) {
	                cvt[c] = oCvt[c] * scale;
	            }
	        } else {
	            prepState.cvt = [];
	        }

	        if (exports.DEBUG) {
	            console.log('---EXEC PREP---');
	            prepState.step = -1;
	        }

	        try {
	            exec(prepState);
	        } catch (e) {
	            if (this._errorState < 2) {
	                console.log('Hinting error in PREP:' + e);
	            }
	            this._errorState = 2;
	        }
	    }

	    if (this._errorState > 1) { return; }

	    try {
	        return execGlyph(glyph, prepState);
	    } catch (e) {
	        if (this._errorState < 1) {
	            console.log('Hinting error:' + e);
	            console.log('Note: further hinting errors are silenced');
	        }
	        this._errorState = 1;
	        return undefined;
	    }
	};

	/*
	* Executes the hinting program for a glyph.
	*/
	execGlyph = function(glyph, prepState) {
	    // original point positions
	    var xScale = prepState.ppem / prepState.font.unitsPerEm;
	    var yScale = xScale;
	    var components = glyph.components;
	    var contours;
	    var gZone;
	    var state;

	    State.prototype = prepState;
	    if (!components) {
	        state = new State('glyf', glyph.instructions);
	        if (exports.DEBUG) {
	            console.log('---EXEC GLYPH---');
	            state.step = -1;
	        }
	        execComponent(glyph, state, xScale, yScale);
	        gZone = state.gZone;
	    } else {
	        var font = prepState.font;
	        gZone = [];
	        contours = [];
	        for (var i = 0; i < components.length; i++) {
	            var c = components[i];
	            var cg = font.glyphs.get(c.glyphIndex);

	            state = new State('glyf', cg.instructions);

	            if (exports.DEBUG) {
	                console.log('---EXEC COMP ' + i + '---');
	                state.step = -1;
	            }

	            execComponent(cg, state, xScale, yScale);
	            // appends the computed points to the result array
	            // post processes the component points
	            var dx = Math.round(c.dx * xScale);
	            var dy = Math.round(c.dy * yScale);
	            var gz = state.gZone;
	            var cc = state.contours;
	            for (var pi = 0; pi < gz.length; pi++) {
	                var p = gz[pi];
	                p.xTouched = p.yTouched = false;
	                p.xo = p.x = p.x + dx;
	                p.yo = p.y = p.y + dy;
	            }

	            var gLen = gZone.length;
	            gZone.push.apply(gZone, gz);
	            for (var j = 0; j < cc.length; j++) {
	                contours.push(cc[j] + gLen);
	            }
	        }

	        if (glyph.instructions && !state.inhibitGridFit) {
	            // the composite has instructions on its own
	            state = new State('glyf', glyph.instructions);

	            state.gZone = state.z0 = state.z1 = state.z2 = gZone;

	            state.contours = contours;

	            // note: HPZero cannot be used here, since
	            //       the point might be modified
	            gZone.push(
	                new HPoint(0, 0),
	                new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
	            );

	            if (exports.DEBUG) {
	                console.log('---EXEC COMPOSITE---');
	                state.step = -1;
	            }

	            exec(state);

	            gZone.length -= 2;
	        }
	    }

	    return gZone;
	};

	/*
	* Executes the hinting program for a component of a multi-component glyph
	* or of the glyph itself for a non-component glyph.
	*/
	execComponent = function(glyph, state, xScale, yScale)
	{
	    var points = glyph.points || [];
	    var pLen = points.length;
	    var gZone = state.gZone = state.z0 = state.z1 = state.z2 = [];
	    var contours = state.contours = [];

	    // Scales the original points and
	    // makes copies for the hinted points.
	    var cp; // current point
	    for (var i = 0; i < pLen; i++) {
	        cp = points[i];

	        gZone[i] = new HPoint(
	            cp.x * xScale,
	            cp.y * yScale,
	            cp.lastPointOfContour,
	            cp.onCurve
	        );
	    }

	    // Chain links the contours.
	    var sp; // start point
	    var np; // next point

	    for (var i$1 = 0; i$1 < pLen; i$1++) {
	        cp = gZone[i$1];

	        if (!sp) {
	            sp = cp;
	            contours.push(i$1);
	        }

	        if (cp.lastPointOfContour) {
	            cp.nextPointOnContour = sp;
	            sp.prevPointOnContour = cp;
	            sp = undefined;
	        } else {
	            np = gZone[i$1 + 1];
	            cp.nextPointOnContour = np;
	            np.prevPointOnContour = cp;
	        }
	    }

	    if (state.inhibitGridFit) { return; }

	    if (exports.DEBUG) {
	        console.log('PROCESSING GLYPH', state.stack);
	        for (var i$2 = 0; i$2 < pLen; i$2++) {
	            console.log(i$2, gZone[i$2].x, gZone[i$2].y);
	        }
	    }

	    gZone.push(
	        new HPoint(0, 0),
	        new HPoint(Math.round(glyph.advanceWidth * xScale), 0)
	    );

	    exec(state);

	    // Removes the extra points.
	    gZone.length -= 2;

	    if (exports.DEBUG) {
	        console.log('FINISHED GLYPH', state.stack);
	        for (var i$3 = 0; i$3 < pLen; i$3++) {
	            console.log(i$3, gZone[i$3].x, gZone[i$3].y);
	        }
	    }
	};

	/*
	* Executes the program loaded in state.
	*/
	exec = function(state) {
	    var prog = state.prog;

	    if (!prog) { return; }

	    var pLen = prog.length;
	    var ins;

	    for (state.ip = 0; state.ip < pLen; state.ip++) {
	        if (exports.DEBUG) { state.step++; }
	        ins = instructionTable[prog[state.ip]];

	        if (!ins) {
	            throw new Error(
	                'unknown instruction: 0x' +
	                Number(prog[state.ip]).toString(16)
	            );
	        }

	        ins(state);

	        // very extensive debugging for each step
	        /*
	        if (exports.DEBUG) {
	            var da;
	            if (state.gZone) {
	                da = [];
	                for (let i = 0; i < state.gZone.length; i++)
	                {
	                    da.push(i + ' ' +
	                        state.gZone[i].x * 64 + ' ' +
	                        state.gZone[i].y * 64 + ' ' +
	                        (state.gZone[i].xTouched ? 'x' : '') +
	                        (state.gZone[i].yTouched ? 'y' : '')
	                    );
	                }
	                console.log('GZ', da);
	            }

	            if (state.tZone) {
	                da = [];
	                for (let i = 0; i < state.tZone.length; i++) {
	                    da.push(i + ' ' +
	                        state.tZone[i].x * 64 + ' ' +
	                        state.tZone[i].y * 64 + ' ' +
	                        (state.tZone[i].xTouched ? 'x' : '') +
	                        (state.tZone[i].yTouched ? 'y' : '')
	                    );
	                }
	                console.log('TZ', da);
	            }

	            if (state.stack.length > 10) {
	                console.log(
	                    state.stack.length,
	                    '...', state.stack.slice(state.stack.length - 10)
	                );
	            } else {
	                console.log(state.stack.length, state.stack);
	            }
	        }
	        */
	    }
	};

	/*
	* Initializes the twilight zone.
	*
	* This is only done if a SZPx instruction
	* refers to the twilight zone.
	*/
	function initTZone(state)
	{
	    var tZone = state.tZone = new Array(state.gZone.length);

	    // no idea if this is actually correct...
	    for (var i = 0; i < tZone.length; i++)
	    {
	        tZone[i] = new HPoint(0, 0);
	    }
	}

	/*
	* Skips the instruction pointer ahead over an IF/ELSE block.
	* handleElse .. if true breaks on matching ELSE
	*/
	function skip(state, handleElse)
	{
	    var prog = state.prog;
	    var ip = state.ip;
	    var nesting = 1;
	    var ins;

	    do {
	        ins = prog[++ip];
	        if (ins === 0x58) // IF
	            { nesting++; }
	        else if (ins === 0x59) // EIF
	            { nesting--; }
	        else if (ins === 0x40) // NPUSHB
	            { ip += prog[ip + 1] + 1; }
	        else if (ins === 0x41) // NPUSHW
	            { ip += 2 * prog[ip + 1] + 1; }
	        else if (ins >= 0xB0 && ins <= 0xB7) // PUSHB
	            { ip += ins - 0xB0 + 1; }
	        else if (ins >= 0xB8 && ins <= 0xBF) // PUSHW
	            { ip += (ins - 0xB8 + 1) * 2; }
	        else if (handleElse && nesting === 1 && ins === 0x1B) // ELSE
	            { break; }
	    } while (nesting > 0);

	    state.ip = ip;
	}

	/*----------------------------------------------------------*
	*          And then a lot of instructions...                *
	*----------------------------------------------------------*/

	// SVTCA[a] Set freedom and projection Vectors To Coordinate Axis
	// 0x00-0x01
	function SVTCA(v, state) {
	    if (exports.DEBUG) { console.log(state.step, 'SVTCA[' + v.axis + ']'); }

	    state.fv = state.pv = state.dpv = v;
	}

	// SPVTCA[a] Set Projection Vector to Coordinate Axis
	// 0x02-0x03
	function SPVTCA(v, state) {
	    if (exports.DEBUG) { console.log(state.step, 'SPVTCA[' + v.axis + ']'); }

	    state.pv = state.dpv = v;
	}

	// SFVTCA[a] Set Freedom Vector to Coordinate Axis
	// 0x04-0x05
	function SFVTCA(v, state) {
	    if (exports.DEBUG) { console.log(state.step, 'SFVTCA[' + v.axis + ']'); }

	    state.fv = v;
	}

	// SPVTL[a] Set Projection Vector To Line
	// 0x06-0x07
	function SPVTL(a, state) {
	    var stack = state.stack;
	    var p2i = stack.pop();
	    var p1i = stack.pop();
	    var p2 = state.z2[p2i];
	    var p1 = state.z1[p1i];

	    if (exports.DEBUG) { console.log('SPVTL[' + a + ']', p2i, p1i); }

	    var dx;
	    var dy;

	    if (!a) {
	        dx = p1.x - p2.x;
	        dy = p1.y - p2.y;
	    } else {
	        dx = p2.y - p1.y;
	        dy = p1.x - p2.x;
	    }

	    state.pv = state.dpv = getUnitVector(dx, dy);
	}

	// SFVTL[a] Set Freedom Vector To Line
	// 0x08-0x09
	function SFVTL(a, state) {
	    var stack = state.stack;
	    var p2i = stack.pop();
	    var p1i = stack.pop();
	    var p2 = state.z2[p2i];
	    var p1 = state.z1[p1i];

	    if (exports.DEBUG) { console.log('SFVTL[' + a + ']', p2i, p1i); }

	    var dx;
	    var dy;

	    if (!a) {
	        dx = p1.x - p2.x;
	        dy = p1.y - p2.y;
	    } else {
	        dx = p2.y - p1.y;
	        dy = p1.x - p2.x;
	    }

	    state.fv = getUnitVector(dx, dy);
	}

	// SPVFS[] Set Projection Vector From Stack
	// 0x0A
	function SPVFS(state) {
	    var stack = state.stack;
	    var y = stack.pop();
	    var x = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SPVFS[]', y, x); }

	    state.pv = state.dpv = getUnitVector(x, y);
	}

	// SFVFS[] Set Freedom Vector From Stack
	// 0x0B
	function SFVFS(state) {
	    var stack = state.stack;
	    var y = stack.pop();
	    var x = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SPVFS[]', y, x); }

	    state.fv = getUnitVector(x, y);
	}

	// GPV[] Get Projection Vector
	// 0x0C
	function GPV(state) {
	    var stack = state.stack;
	    var pv = state.pv;

	    if (exports.DEBUG) { console.log(state.step, 'GPV[]'); }

	    stack.push(pv.x * 0x4000);
	    stack.push(pv.y * 0x4000);
	}

	// GFV[] Get Freedom Vector
	// 0x0C
	function GFV(state) {
	    var stack = state.stack;
	    var fv = state.fv;

	    if (exports.DEBUG) { console.log(state.step, 'GFV[]'); }

	    stack.push(fv.x * 0x4000);
	    stack.push(fv.y * 0x4000);
	}

	// SFVTPV[] Set Freedom Vector To Projection Vector
	// 0x0E
	function SFVTPV(state) {
	    state.fv = state.pv;

	    if (exports.DEBUG) { console.log(state.step, 'SFVTPV[]'); }
	}

	// ISECT[] moves point p to the InterSECTion of two lines
	// 0x0F
	function ISECT(state)
	{
	    var stack = state.stack;
	    var pa0i = stack.pop();
	    var pa1i = stack.pop();
	    var pb0i = stack.pop();
	    var pb1i = stack.pop();
	    var pi = stack.pop();
	    var z0 = state.z0;
	    var z1 = state.z1;
	    var pa0 = z0[pa0i];
	    var pa1 = z0[pa1i];
	    var pb0 = z1[pb0i];
	    var pb1 = z1[pb1i];
	    var p = state.z2[pi];

	    if (exports.DEBUG) { console.log('ISECT[], ', pa0i, pa1i, pb0i, pb1i, pi); }

	    // math from
	    // en.wikipedia.org/wiki/Line%E2%80%93line_intersection#Given_two_points_on_each_line

	    var x1 = pa0.x;
	    var y1 = pa0.y;
	    var x2 = pa1.x;
	    var y2 = pa1.y;
	    var x3 = pb0.x;
	    var y3 = pb0.y;
	    var x4 = pb1.x;
	    var y4 = pb1.y;

	    var div = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
	    var f1 = x1 * y2 - y1 * x2;
	    var f2 = x3 * y4 - y3 * x4;

	    p.x = (f1 * (x3 - x4) - f2 * (x1 - x2)) / div;
	    p.y = (f1 * (y3 - y4) - f2 * (y1 - y2)) / div;
	}

	// SRP0[] Set Reference Point 0
	// 0x10
	function SRP0(state) {
	    state.rp0 = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SRP0[]', state.rp0); }
	}

	// SRP1[] Set Reference Point 1
	// 0x11
	function SRP1(state) {
	    state.rp1 = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SRP1[]', state.rp1); }
	}

	// SRP1[] Set Reference Point 2
	// 0x12
	function SRP2(state) {
	    state.rp2 = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SRP2[]', state.rp2); }
	}

	// SZP0[] Set Zone Pointer 0
	// 0x13
	function SZP0(state) {
	    var n = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SZP0[]', n); }

	    state.zp0 = n;

	    switch (n) {
	        case 0:
	            if (!state.tZone) { initTZone(state); }
	            state.z0 = state.tZone;
	            break;
	        case 1 :
	            state.z0 = state.gZone;
	            break;
	        default :
	            throw new Error('Invalid zone pointer');
	    }
	}

	// SZP1[] Set Zone Pointer 1
	// 0x14
	function SZP1(state) {
	    var n = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SZP1[]', n); }

	    state.zp1 = n;

	    switch (n) {
	        case 0:
	            if (!state.tZone) { initTZone(state); }
	            state.z1 = state.tZone;
	            break;
	        case 1 :
	            state.z1 = state.gZone;
	            break;
	        default :
	            throw new Error('Invalid zone pointer');
	    }
	}

	// SZP2[] Set Zone Pointer 2
	// 0x15
	function SZP2(state) {
	    var n = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SZP2[]', n); }

	    state.zp2 = n;

	    switch (n) {
	        case 0:
	            if (!state.tZone) { initTZone(state); }
	            state.z2 = state.tZone;
	            break;
	        case 1 :
	            state.z2 = state.gZone;
	            break;
	        default :
	            throw new Error('Invalid zone pointer');
	    }
	}

	// SZPS[] Set Zone PointerS
	// 0x16
	function SZPS(state) {
	    var n = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SZPS[]', n); }

	    state.zp0 = state.zp1 = state.zp2 = n;

	    switch (n) {
	        case 0:
	            if (!state.tZone) { initTZone(state); }
	            state.z0 = state.z1 = state.z2 = state.tZone;
	            break;
	        case 1 :
	            state.z0 = state.z1 = state.z2 = state.gZone;
	            break;
	        default :
	            throw new Error('Invalid zone pointer');
	    }
	}

	// SLOOP[] Set LOOP variable
	// 0x17
	function SLOOP(state) {
	    state.loop = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SLOOP[]', state.loop); }
	}

	// RTG[] Round To Grid
	// 0x18
	function RTG(state) {
	    if (exports.DEBUG) { console.log(state.step, 'RTG[]'); }

	    state.round = roundToGrid;
	}

	// RTHG[] Round To Half Grid
	// 0x19
	function RTHG(state) {
	    if (exports.DEBUG) { console.log(state.step, 'RTHG[]'); }

	    state.round = roundToHalfGrid;
	}

	// SMD[] Set Minimum Distance
	// 0x1A
	function SMD(state) {
	    var d = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SMD[]', d); }

	    state.minDis = d / 0x40;
	}

	// ELSE[] ELSE clause
	// 0x1B
	function ELSE(state) {
	    // This instruction has been reached by executing a then branch
	    // so it just skips ahead until matching EIF.
	    //
	    // In case the IF was negative the IF[] instruction already
	    // skipped forward over the ELSE[]

	    if (exports.DEBUG) { console.log(state.step, 'ELSE[]'); }

	    skip(state, false);
	}

	// JMPR[] JuMP Relative
	// 0x1C
	function JMPR(state) {
	    var o = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'JMPR[]', o); }

	    // A jump by 1 would do nothing.
	    state.ip += o - 1;
	}

	// SCVTCI[] Set Control Value Table Cut-In
	// 0x1D
	function SCVTCI(state) {
	    var n = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SCVTCI[]', n); }

	    state.cvCutIn = n / 0x40;
	}

	// DUP[] DUPlicate top stack element
	// 0x20
	function DUP(state) {
	    var stack = state.stack;

	    if (exports.DEBUG) { console.log(state.step, 'DUP[]'); }

	    stack.push(stack[stack.length - 1]);
	}

	// POP[] POP top stack element
	// 0x21
	function POP(state) {
	    if (exports.DEBUG) { console.log(state.step, 'POP[]'); }

	    state.stack.pop();
	}

	// CLEAR[] CLEAR the stack
	// 0x22
	function CLEAR(state) {
	    if (exports.DEBUG) { console.log(state.step, 'CLEAR[]'); }

	    state.stack.length = 0;
	}

	// SWAP[] SWAP the top two elements on the stack
	// 0x23
	function SWAP(state) {
	    var stack = state.stack;

	    var a = stack.pop();
	    var b = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SWAP[]'); }

	    stack.push(a);
	    stack.push(b);
	}

	// DEPTH[] DEPTH of the stack
	// 0x24
	function DEPTH(state) {
	    var stack = state.stack;

	    if (exports.DEBUG) { console.log(state.step, 'DEPTH[]'); }

	    stack.push(stack.length);
	}

	// LOOPCALL[] LOOPCALL function
	// 0x2A
	function LOOPCALL(state) {
	    var stack = state.stack;
	    var fn = stack.pop();
	    var c = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'LOOPCALL[]', fn, c); }

	    // saves callers program
	    var cip = state.ip;
	    var cprog = state.prog;

	    state.prog = state.funcs[fn];

	    // executes the function
	    for (var i = 0; i < c; i++) {
	        exec(state);

	        if (exports.DEBUG) { console.log(
	            ++state.step,
	            i + 1 < c ? 'next loopcall' : 'done loopcall',
	            i
	        ); }
	    }

	    // restores the callers program
	    state.ip = cip;
	    state.prog = cprog;
	}

	// CALL[] CALL function
	// 0x2B
	function CALL(state) {
	    var fn = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'CALL[]', fn); }

	    // saves callers program
	    var cip = state.ip;
	    var cprog = state.prog;

	    state.prog = state.funcs[fn];

	    // executes the function
	    exec(state);

	    // restores the callers program
	    state.ip = cip;
	    state.prog = cprog;

	    if (exports.DEBUG) { console.log(++state.step, 'returning from', fn); }
	}

	// CINDEX[] Copy the INDEXed element to the top of the stack
	// 0x25
	function CINDEX(state) {
	    var stack = state.stack;
	    var k = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'CINDEX[]', k); }

	    // In case of k == 1, it copies the last element after popping
	    // thus stack.length - k.
	    stack.push(stack[stack.length - k]);
	}

	// MINDEX[] Move the INDEXed element to the top of the stack
	// 0x26
	function MINDEX(state) {
	    var stack = state.stack;
	    var k = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'MINDEX[]', k); }

	    stack.push(stack.splice(stack.length - k, 1)[0]);
	}

	// FDEF[] Function DEFinition
	// 0x2C
	function FDEF(state) {
	    if (state.env !== 'fpgm') { throw new Error('FDEF not allowed here'); }
	    var stack = state.stack;
	    var prog = state.prog;
	    var ip = state.ip;

	    var fn = stack.pop();
	    var ipBegin = ip;

	    if (exports.DEBUG) { console.log(state.step, 'FDEF[]', fn); }

	    while (prog[++ip] !== 0x2D){ }

	    state.ip = ip;
	    state.funcs[fn] = prog.slice(ipBegin + 1, ip);
	}

	// MDAP[a] Move Direct Absolute Point
	// 0x2E-0x2F
	function MDAP(round, state) {
	    var pi = state.stack.pop();
	    var p = state.z0[pi];
	    var fv = state.fv;
	    var pv = state.pv;

	    if (exports.DEBUG) { console.log(state.step, 'MDAP[' + round + ']', pi); }

	    var d = pv.distance(p, HPZero);

	    if (round) { d = state.round(d); }

	    fv.setRelative(p, HPZero, d, pv);
	    fv.touch(p);

	    state.rp0 = state.rp1 = pi;
	}

	// IUP[a] Interpolate Untouched Points through the outline
	// 0x30
	function IUP(v, state) {
	    var z2 = state.z2;
	    var pLen = z2.length - 2;
	    var cp;
	    var pp;
	    var np;

	    if (exports.DEBUG) { console.log(state.step, 'IUP[' + v.axis + ']'); }

	    for (var i = 0; i < pLen; i++) {
	        cp = z2[i]; // current point

	        // if this point has been touched go on
	        if (v.touched(cp)) { continue; }

	        pp = cp.prevTouched(v);

	        // no point on the contour has been touched?
	        if (pp === cp) { continue; }

	        np = cp.nextTouched(v);

	        if (pp === np) {
	            // only one point on the contour has been touched
	            // so simply moves the point like that

	            v.setRelative(cp, cp, v.distance(pp, pp, false, true), v, true);
	        }

	        v.interpolate(cp, pp, np, v);
	    }
	}

	// SHP[] SHift Point using reference point
	// 0x32-0x33
	function SHP(a, state) {
	    var stack = state.stack;
	    var rpi = a ? state.rp1 : state.rp2;
	    var rp = (a ? state.z0 : state.z1)[rpi];
	    var fv = state.fv;
	    var pv = state.pv;
	    var loop = state.loop;
	    var z2 = state.z2;

	    while (loop--)
	    {
	        var pi = stack.pop();
	        var p = z2[pi];

	        var d = pv.distance(rp, rp, false, true);
	        fv.setRelative(p, p, d, pv);
	        fv.touch(p);

	        if (exports.DEBUG) {
	            console.log(
	                state.step,
	                (state.loop > 1 ?
	                   'loop ' + (state.loop - loop) + ': ' :
	                   ''
	                ) +
	                'SHP[' + (a ? 'rp1' : 'rp2') + ']', pi
	            );
	        }
	    }

	    state.loop = 1;
	}

	// SHC[] SHift Contour using reference point
	// 0x36-0x37
	function SHC(a, state) {
	    var stack = state.stack;
	    var rpi = a ? state.rp1 : state.rp2;
	    var rp = (a ? state.z0 : state.z1)[rpi];
	    var fv = state.fv;
	    var pv = state.pv;
	    var ci = stack.pop();
	    var sp = state.z2[state.contours[ci]];
	    var p = sp;

	    if (exports.DEBUG) { console.log(state.step, 'SHC[' + a + ']', ci); }

	    var d = pv.distance(rp, rp, false, true);

	    do {
	        if (p !== rp) { fv.setRelative(p, p, d, pv); }
	        p = p.nextPointOnContour;
	    } while (p !== sp);
	}

	// SHZ[] SHift Zone using reference point
	// 0x36-0x37
	function SHZ(a, state) {
	    var stack = state.stack;
	    var rpi = a ? state.rp1 : state.rp2;
	    var rp = (a ? state.z0 : state.z1)[rpi];
	    var fv = state.fv;
	    var pv = state.pv;

	    var e = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SHZ[' + a + ']', e); }

	    var z;
	    switch (e) {
	        case 0 : z = state.tZone; break;
	        case 1 : z = state.gZone; break;
	        default : throw new Error('Invalid zone');
	    }

	    var p;
	    var d = pv.distance(rp, rp, false, true);
	    var pLen = z.length - 2;
	    for (var i = 0; i < pLen; i++)
	    {
	        p = z[i];
	        fv.setRelative(p, p, d, pv);
	        //if (p !== rp) fv.setRelative(p, p, d, pv);
	    }
	}

	// SHPIX[] SHift point by a PIXel amount
	// 0x38
	function SHPIX(state) {
	    var stack = state.stack;
	    var loop = state.loop;
	    var fv = state.fv;
	    var d = stack.pop() / 0x40;
	    var z2 = state.z2;

	    while (loop--) {
	        var pi = stack.pop();
	        var p = z2[pi];

	        if (exports.DEBUG) {
	            console.log(
	                state.step,
	                (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
	                'SHPIX[]', pi, d
	            );
	        }

	        fv.setRelative(p, p, d);
	        fv.touch(p);
	    }

	    state.loop = 1;
	}

	// IP[] Interpolate Point
	// 0x39
	function IP(state) {
	    var stack = state.stack;
	    var rp1i = state.rp1;
	    var rp2i = state.rp2;
	    var loop = state.loop;
	    var rp1 = state.z0[rp1i];
	    var rp2 = state.z1[rp2i];
	    var fv = state.fv;
	    var pv = state.dpv;
	    var z2 = state.z2;

	    while (loop--) {
	        var pi = stack.pop();
	        var p = z2[pi];

	        if (exports.DEBUG) {
	            console.log(
	                state.step,
	                (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
	                'IP[]', pi, rp1i, '<->', rp2i
	            );
	        }

	        fv.interpolate(p, rp1, rp2, pv);

	        fv.touch(p);
	    }

	    state.loop = 1;
	}

	// MSIRP[a] Move Stack Indirect Relative Point
	// 0x3A-0x3B
	function MSIRP(a, state) {
	    var stack = state.stack;
	    var d = stack.pop() / 64;
	    var pi = stack.pop();
	    var p = state.z1[pi];
	    var rp0 = state.z0[state.rp0];
	    var fv = state.fv;
	    var pv = state.pv;

	    fv.setRelative(p, rp0, d, pv);
	    fv.touch(p);

	    if (exports.DEBUG) { console.log(state.step, 'MSIRP[' + a + ']', d, pi); }

	    state.rp1 = state.rp0;
	    state.rp2 = pi;
	    if (a) { state.rp0 = pi; }
	}

	// ALIGNRP[] Align to reference point.
	// 0x3C
	function ALIGNRP(state) {
	    var stack = state.stack;
	    var rp0i = state.rp0;
	    var rp0 = state.z0[rp0i];
	    var loop = state.loop;
	    var fv = state.fv;
	    var pv = state.pv;
	    var z1 = state.z1;

	    while (loop--) {
	        var pi = stack.pop();
	        var p = z1[pi];

	        if (exports.DEBUG) {
	            console.log(
	                state.step,
	                (state.loop > 1 ? 'loop ' + (state.loop - loop) + ': ' : '') +
	                'ALIGNRP[]', pi
	            );
	        }

	        fv.setRelative(p, rp0, 0, pv);
	        fv.touch(p);
	    }

	    state.loop = 1;
	}

	// RTG[] Round To Double Grid
	// 0x3D
	function RTDG(state) {
	    if (exports.DEBUG) { console.log(state.step, 'RTDG[]'); }

	    state.round = roundToDoubleGrid;
	}

	// MIAP[a] Move Indirect Absolute Point
	// 0x3E-0x3F
	function MIAP(round, state) {
	    var stack = state.stack;
	    var n = stack.pop();
	    var pi = stack.pop();
	    var p = state.z0[pi];
	    var fv = state.fv;
	    var pv = state.pv;
	    var cv = state.cvt[n];

	    if (exports.DEBUG) {
	        console.log(
	            state.step,
	            'MIAP[' + round + ']',
	            n, '(', cv, ')', pi
	        );
	    }

	    var d = pv.distance(p, HPZero);

	    if (round) {
	        if (Math.abs(d - cv) < state.cvCutIn) { d = cv; }

	        d = state.round(d);
	    }

	    fv.setRelative(p, HPZero, d, pv);

	    if (state.zp0 === 0) {
	        p.xo = p.x;
	        p.yo = p.y;
	    }

	    fv.touch(p);

	    state.rp0 = state.rp1 = pi;
	}

	// NPUSB[] PUSH N Bytes
	// 0x40
	function NPUSHB(state) {
	    var prog = state.prog;
	    var ip = state.ip;
	    var stack = state.stack;

	    var n = prog[++ip];

	    if (exports.DEBUG) { console.log(state.step, 'NPUSHB[]', n); }

	    for (var i = 0; i < n; i++) { stack.push(prog[++ip]); }

	    state.ip = ip;
	}

	// NPUSHW[] PUSH N Words
	// 0x41
	function NPUSHW(state) {
	    var ip = state.ip;
	    var prog = state.prog;
	    var stack = state.stack;
	    var n = prog[++ip];

	    if (exports.DEBUG) { console.log(state.step, 'NPUSHW[]', n); }

	    for (var i = 0; i < n; i++) {
	        var w = (prog[++ip] << 8) | prog[++ip];
	        if (w & 0x8000) { w = -((w ^ 0xffff) + 1); }
	        stack.push(w);
	    }

	    state.ip = ip;
	}

	// WS[] Write Store
	// 0x42
	function WS(state) {
	    var stack = state.stack;
	    var store = state.store;

	    if (!store) { store = state.store = []; }

	    var v = stack.pop();
	    var l = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'WS', v, l); }

	    store[l] = v;
	}

	// RS[] Read Store
	// 0x43
	function RS(state) {
	    var stack = state.stack;
	    var store = state.store;

	    var l = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'RS', l); }

	    var v = (store && store[l]) || 0;

	    stack.push(v);
	}

	// WCVTP[] Write Control Value Table in Pixel units
	// 0x44
	function WCVTP(state) {
	    var stack = state.stack;

	    var v = stack.pop();
	    var l = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'WCVTP', v, l); }

	    state.cvt[l] = v / 0x40;
	}

	// RCVT[] Read Control Value Table entry
	// 0x45
	function RCVT(state) {
	    var stack = state.stack;
	    var cvte = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'RCVT', cvte); }

	    stack.push(state.cvt[cvte] * 0x40);
	}

	// GC[] Get Coordinate projected onto the projection vector
	// 0x46-0x47
	function GC(a, state) {
	    var stack = state.stack;
	    var pi = stack.pop();
	    var p = state.z2[pi];

	    if (exports.DEBUG) { console.log(state.step, 'GC[' + a + ']', pi); }

	    stack.push(state.dpv.distance(p, HPZero, a, false) * 0x40);
	}

	// MD[a] Measure Distance
	// 0x49-0x4A
	function MD(a, state) {
	    var stack = state.stack;
	    var pi2 = stack.pop();
	    var pi1 = stack.pop();
	    var p2 = state.z1[pi2];
	    var p1 = state.z0[pi1];
	    var d = state.dpv.distance(p1, p2, a, a);

	    if (exports.DEBUG) { console.log(state.step, 'MD[' + a + ']', pi2, pi1, '->', d); }

	    state.stack.push(Math.round(d * 64));
	}

	// MPPEM[] Measure Pixels Per EM
	// 0x4B
	function MPPEM(state) {
	    if (exports.DEBUG) { console.log(state.step, 'MPPEM[]'); }
	    state.stack.push(state.ppem);
	}

	// FLIPON[] set the auto FLIP Boolean to ON
	// 0x4D
	function FLIPON(state) {
	    if (exports.DEBUG) { console.log(state.step, 'FLIPON[]'); }
	    state.autoFlip = true;
	}

	// LT[] Less Than
	// 0x50
	function LT(state) {
	    var stack = state.stack;
	    var e2 = stack.pop();
	    var e1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'LT[]', e2, e1); }

	    stack.push(e1 < e2 ? 1 : 0);
	}

	// LTEQ[] Less Than or EQual
	// 0x53
	function LTEQ(state) {
	    var stack = state.stack;
	    var e2 = stack.pop();
	    var e1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'LTEQ[]', e2, e1); }

	    stack.push(e1 <= e2 ? 1 : 0);
	}

	// GTEQ[] Greater Than
	// 0x52
	function GT(state) {
	    var stack = state.stack;
	    var e2 = stack.pop();
	    var e1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'GT[]', e2, e1); }

	    stack.push(e1 > e2 ? 1 : 0);
	}

	// GTEQ[] Greater Than or EQual
	// 0x53
	function GTEQ(state) {
	    var stack = state.stack;
	    var e2 = stack.pop();
	    var e1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'GTEQ[]', e2, e1); }

	    stack.push(e1 >= e2 ? 1 : 0);
	}

	// EQ[] EQual
	// 0x54
	function EQ(state) {
	    var stack = state.stack;
	    var e2 = stack.pop();
	    var e1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'EQ[]', e2, e1); }

	    stack.push(e2 === e1 ? 1 : 0);
	}

	// NEQ[] Not EQual
	// 0x55
	function NEQ(state) {
	    var stack = state.stack;
	    var e2 = stack.pop();
	    var e1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'NEQ[]', e2, e1); }

	    stack.push(e2 !== e1 ? 1 : 0);
	}

	// ODD[] ODD
	// 0x56
	function ODD(state) {
	    var stack = state.stack;
	    var n = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'ODD[]', n); }

	    stack.push(Math.trunc(n) % 2 ? 1 : 0);
	}

	// EVEN[] EVEN
	// 0x57
	function EVEN(state) {
	    var stack = state.stack;
	    var n = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'EVEN[]', n); }

	    stack.push(Math.trunc(n) % 2 ? 0 : 1);
	}

	// IF[] IF test
	// 0x58
	function IF(state) {
	    var test = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'IF[]', test); }

	    // if test is true it just continues
	    // if not the ip is skipped until matching ELSE or EIF
	    if (!test) {
	        skip(state, true);

	        if (exports.DEBUG) { console.log(state.step, 'EIF[]'); }
	    }
	}

	// EIF[] End IF
	// 0x59
	function EIF(state) {
	    // this can be reached normally when
	    // executing an else branch.
	    // -> just ignore it

	    if (exports.DEBUG) { console.log(state.step, 'EIF[]'); }
	}

	// AND[] logical AND
	// 0x5A
	function AND(state) {
	    var stack = state.stack;
	    var e2 = stack.pop();
	    var e1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'AND[]', e2, e1); }

	    stack.push(e2 && e1 ? 1 : 0);
	}

	// OR[] logical OR
	// 0x5B
	function OR(state) {
	    var stack = state.stack;
	    var e2 = stack.pop();
	    var e1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'OR[]', e2, e1); }

	    stack.push(e2 || e1 ? 1 : 0);
	}

	// NOT[] logical NOT
	// 0x5C
	function NOT(state) {
	    var stack = state.stack;
	    var e = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'NOT[]', e); }

	    stack.push(e ? 0 : 1);
	}

	// DELTAP1[] DELTA exception P1
	// DELTAP2[] DELTA exception P2
	// DELTAP3[] DELTA exception P3
	// 0x5D, 0x71, 0x72
	function DELTAP123(b, state) {
	    var stack = state.stack;
	    var n = stack.pop();
	    var fv = state.fv;
	    var pv = state.pv;
	    var ppem = state.ppem;
	    var base = state.deltaBase + (b - 1) * 16;
	    var ds = state.deltaShift;
	    var z0 = state.z0;

	    if (exports.DEBUG) { console.log(state.step, 'DELTAP[' + b + ']', n, stack); }

	    for (var i = 0; i < n; i++) {
	        var pi = stack.pop();
	        var arg = stack.pop();
	        var appem = base + ((arg & 0xF0) >> 4);
	        if (appem !== ppem) { continue; }

	        var mag = (arg & 0x0F) - 8;
	        if (mag >= 0) { mag++; }
	        if (exports.DEBUG) { console.log(state.step, 'DELTAPFIX', pi, 'by', mag * ds); }

	        var p = z0[pi];
	        fv.setRelative(p, p, mag * ds, pv);
	    }
	}

	// SDB[] Set Delta Base in the graphics state
	// 0x5E
	function SDB(state) {
	    var stack = state.stack;
	    var n = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SDB[]', n); }

	    state.deltaBase = n;
	}

	// SDS[] Set Delta Shift in the graphics state
	// 0x5F
	function SDS(state) {
	    var stack = state.stack;
	    var n = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SDS[]', n); }

	    state.deltaShift = Math.pow(0.5, n);
	}

	// ADD[] ADD
	// 0x60
	function ADD(state) {
	    var stack = state.stack;
	    var n2 = stack.pop();
	    var n1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'ADD[]', n2, n1); }

	    stack.push(n1 + n2);
	}

	// SUB[] SUB
	// 0x61
	function SUB(state) {
	    var stack = state.stack;
	    var n2 = stack.pop();
	    var n1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SUB[]', n2, n1); }

	    stack.push(n1 - n2);
	}

	// DIV[] DIV
	// 0x62
	function DIV(state) {
	    var stack = state.stack;
	    var n2 = stack.pop();
	    var n1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'DIV[]', n2, n1); }

	    stack.push(n1 * 64 / n2);
	}

	// MUL[] MUL
	// 0x63
	function MUL(state) {
	    var stack = state.stack;
	    var n2 = stack.pop();
	    var n1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'MUL[]', n2, n1); }

	    stack.push(n1 * n2 / 64);
	}

	// ABS[] ABSolute value
	// 0x64
	function ABS(state) {
	    var stack = state.stack;
	    var n = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'ABS[]', n); }

	    stack.push(Math.abs(n));
	}

	// NEG[] NEGate
	// 0x65
	function NEG(state) {
	    var stack = state.stack;
	    var n = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'NEG[]', n); }

	    stack.push(-n);
	}

	// FLOOR[] FLOOR
	// 0x66
	function FLOOR(state) {
	    var stack = state.stack;
	    var n = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'FLOOR[]', n); }

	    stack.push(Math.floor(n / 0x40) * 0x40);
	}

	// CEILING[] CEILING
	// 0x67
	function CEILING(state) {
	    var stack = state.stack;
	    var n = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'CEILING[]', n); }

	    stack.push(Math.ceil(n / 0x40) * 0x40);
	}

	// ROUND[ab] ROUND value
	// 0x68-0x6B
	function ROUND(dt, state) {
	    var stack = state.stack;
	    var n = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'ROUND[]'); }

	    stack.push(state.round(n / 0x40) * 0x40);
	}

	// WCVTF[] Write Control Value Table in Funits
	// 0x70
	function WCVTF(state) {
	    var stack = state.stack;
	    var v = stack.pop();
	    var l = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'WCVTF[]', v, l); }

	    state.cvt[l] = v * state.ppem / state.font.unitsPerEm;
	}

	// DELTAC1[] DELTA exception C1
	// DELTAC2[] DELTA exception C2
	// DELTAC3[] DELTA exception C3
	// 0x73, 0x74, 0x75
	function DELTAC123(b, state) {
	    var stack = state.stack;
	    var n = stack.pop();
	    var ppem = state.ppem;
	    var base = state.deltaBase + (b - 1) * 16;
	    var ds = state.deltaShift;

	    if (exports.DEBUG) { console.log(state.step, 'DELTAC[' + b + ']', n, stack); }

	    for (var i = 0; i < n; i++) {
	        var c = stack.pop();
	        var arg = stack.pop();
	        var appem = base + ((arg & 0xF0) >> 4);
	        if (appem !== ppem) { continue; }

	        var mag = (arg & 0x0F) - 8;
	        if (mag >= 0) { mag++; }

	        var delta = mag * ds;

	        if (exports.DEBUG) { console.log(state.step, 'DELTACFIX', c, 'by', delta); }

	        state.cvt[c] += delta;
	    }
	}

	// SROUND[] Super ROUND
	// 0x76
	function SROUND(state) {
	    var n = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'SROUND[]', n); }

	    state.round = roundSuper;

	    var period;

	    switch (n & 0xC0) {
	        case 0x00:
	            period = 0.5;
	            break;
	        case 0x40:
	            period = 1;
	            break;
	        case 0x80:
	            period = 2;
	            break;
	        default:
	            throw new Error('invalid SROUND value');
	    }

	    state.srPeriod = period;

	    switch (n & 0x30) {
	        case 0x00:
	            state.srPhase = 0;
	            break;
	        case 0x10:
	            state.srPhase = 0.25 * period;
	            break;
	        case 0x20:
	            state.srPhase = 0.5  * period;
	            break;
	        case 0x30:
	            state.srPhase = 0.75 * period;
	            break;
	        default: throw new Error('invalid SROUND value');
	    }

	    n &= 0x0F;

	    if (n === 0) { state.srThreshold = 0; }
	    else { state.srThreshold = (n / 8 - 0.5) * period; }
	}

	// S45ROUND[] Super ROUND 45 degrees
	// 0x77
	function S45ROUND(state) {
	    var n = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'S45ROUND[]', n); }

	    state.round = roundSuper;

	    var period;

	    switch (n & 0xC0) {
	        case 0x00:
	            period = Math.sqrt(2) / 2;
	            break;
	        case 0x40:
	            period = Math.sqrt(2);
	            break;
	        case 0x80:
	            period = 2 * Math.sqrt(2);
	            break;
	        default:
	            throw new Error('invalid S45ROUND value');
	    }

	    state.srPeriod = period;

	    switch (n & 0x30) {
	        case 0x00:
	            state.srPhase = 0;
	            break;
	        case 0x10:
	            state.srPhase = 0.25 * period;
	            break;
	        case 0x20:
	            state.srPhase = 0.5  * period;
	            break;
	        case 0x30:
	            state.srPhase = 0.75 * period;
	            break;
	        default:
	            throw new Error('invalid S45ROUND value');
	    }

	    n &= 0x0F;

	    if (n === 0) { state.srThreshold = 0; }
	    else { state.srThreshold = (n / 8 - 0.5) * period; }
	}

	// ROFF[] Round Off
	// 0x7A
	function ROFF(state) {
	    if (exports.DEBUG) { console.log(state.step, 'ROFF[]'); }

	    state.round = roundOff;
	}

	// RUTG[] Round Up To Grid
	// 0x7C
	function RUTG(state) {
	    if (exports.DEBUG) { console.log(state.step, 'RUTG[]'); }

	    state.round = roundUpToGrid;
	}

	// RDTG[] Round Down To Grid
	// 0x7D
	function RDTG(state) {
	    if (exports.DEBUG) { console.log(state.step, 'RDTG[]'); }

	    state.round = roundDownToGrid;
	}

	// SCANCTRL[] SCAN conversion ConTRoL
	// 0x85
	function SCANCTRL(state) {
	    var n = state.stack.pop();

	    // ignored by opentype.js

	    if (exports.DEBUG) { console.log(state.step, 'SCANCTRL[]', n); }
	}

	// SDPVTL[a] Set Dual Projection Vector To Line
	// 0x86-0x87
	function SDPVTL(a, state) {
	    var stack = state.stack;
	    var p2i = stack.pop();
	    var p1i = stack.pop();
	    var p2 = state.z2[p2i];
	    var p1 = state.z1[p1i];

	    if (exports.DEBUG) { console.log(state.step, 'SDPVTL[' + a + ']', p2i, p1i); }

	    var dx;
	    var dy;

	    if (!a) {
	        dx = p1.x - p2.x;
	        dy = p1.y - p2.y;
	    } else {
	        dx = p2.y - p1.y;
	        dy = p1.x - p2.x;
	    }

	    state.dpv = getUnitVector(dx, dy);
	}

	// GETINFO[] GET INFOrmation
	// 0x88
	function GETINFO(state) {
	    var stack = state.stack;
	    var sel = stack.pop();
	    var r = 0;

	    if (exports.DEBUG) { console.log(state.step, 'GETINFO[]', sel); }

	    // v35 as in no subpixel hinting
	    if (sel & 0x01) { r = 35; }

	    // TODO rotation and stretch currently not supported
	    // and thus those GETINFO are always 0.

	    // opentype.js is always gray scaling
	    if (sel & 0x20) { r |= 0x1000; }

	    stack.push(r);
	}

	// ROLL[] ROLL the top three stack elements
	// 0x8A
	function ROLL(state) {
	    var stack = state.stack;
	    var a = stack.pop();
	    var b = stack.pop();
	    var c = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'ROLL[]'); }

	    stack.push(b);
	    stack.push(a);
	    stack.push(c);
	}

	// MAX[] MAXimum of top two stack elements
	// 0x8B
	function MAX(state) {
	    var stack = state.stack;
	    var e2 = stack.pop();
	    var e1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'MAX[]', e2, e1); }

	    stack.push(Math.max(e1, e2));
	}

	// MIN[] MINimum of top two stack elements
	// 0x8C
	function MIN(state) {
	    var stack = state.stack;
	    var e2 = stack.pop();
	    var e1 = stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'MIN[]', e2, e1); }

	    stack.push(Math.min(e1, e2));
	}

	// SCANTYPE[] SCANTYPE
	// 0x8D
	function SCANTYPE(state) {
	    var n = state.stack.pop();
	    // ignored by opentype.js
	    if (exports.DEBUG) { console.log(state.step, 'SCANTYPE[]', n); }
	}

	// INSTCTRL[] INSTCTRL
	// 0x8D
	function INSTCTRL(state) {
	    var s = state.stack.pop();
	    var v = state.stack.pop();

	    if (exports.DEBUG) { console.log(state.step, 'INSTCTRL[]', s, v); }

	    switch (s) {
	        case 1 : state.inhibitGridFit = !!v; return;
	        case 2 : state.ignoreCvt = !!v; return;
	        default: throw new Error('invalid INSTCTRL[] selector');
	    }
	}

	// PUSHB[abc] PUSH Bytes
	// 0xB0-0xB7
	function PUSHB(n, state) {
	    var stack = state.stack;
	    var prog = state.prog;
	    var ip = state.ip;

	    if (exports.DEBUG) { console.log(state.step, 'PUSHB[' + n + ']'); }

	    for (var i = 0; i < n; i++) { stack.push(prog[++ip]); }

	    state.ip = ip;
	}

	// PUSHW[abc] PUSH Words
	// 0xB8-0xBF
	function PUSHW(n, state) {
	    var ip = state.ip;
	    var prog = state.prog;
	    var stack = state.stack;

	    if (exports.DEBUG) { console.log(state.ip, 'PUSHW[' + n + ']'); }

	    for (var i = 0; i < n; i++) {
	        var w = (prog[++ip] << 8) | prog[++ip];
	        if (w & 0x8000) { w = -((w ^ 0xffff) + 1); }
	        stack.push(w);
	    }

	    state.ip = ip;
	}

	// MDRP[abcde] Move Direct Relative Point
	// 0xD0-0xEF
	// (if indirect is 0)
	//
	// and
	//
	// MIRP[abcde] Move Indirect Relative Point
	// 0xE0-0xFF
	// (if indirect is 1)

	function MDRP_MIRP(indirect, setRp0, keepD, ro, dt, state) {
	    var stack = state.stack;
	    var cvte = indirect && stack.pop();
	    var pi = stack.pop();
	    var rp0i = state.rp0;
	    var rp = state.z0[rp0i];
	    var p = state.z1[pi];

	    var md = state.minDis;
	    var fv = state.fv;
	    var pv = state.dpv;
	    var od; // original distance
	    var d; // moving distance
	    var sign; // sign of distance
	    var cv;

	    d = od = pv.distance(p, rp, true, true);
	    sign = d >= 0 ? 1 : -1; // Math.sign would be 0 in case of 0

	    // TODO consider autoFlip
	    d = Math.abs(d);

	    if (indirect) {
	        cv = state.cvt[cvte];

	        if (ro && Math.abs(d - cv) < state.cvCutIn) { d = cv; }
	    }

	    if (keepD && d < md) { d = md; }

	    if (ro) { d = state.round(d); }

	    fv.setRelative(p, rp, sign * d, pv);
	    fv.touch(p);

	    if (exports.DEBUG) {
	        console.log(
	            state.step,
	            (indirect ? 'MIRP[' : 'MDRP[') +
	            (setRp0 ? 'M' : 'm') +
	            (keepD ? '>' : '_') +
	            (ro ? 'R' : '_') +
	            (dt === 0 ? 'Gr' : (dt === 1 ? 'Bl' : (dt === 2 ? 'Wh' : ''))) +
	            ']',
	            indirect ?
	                cvte + '(' + state.cvt[cvte] + ',' +  cv + ')' :
	                '',
	            pi,
	            '(d =', od, '->', sign * d, ')'
	        );
	    }

	    state.rp1 = state.rp0;
	    state.rp2 = pi;
	    if (setRp0) { state.rp0 = pi; }
	}

	/*
	* The instruction table.
	*/
	instructionTable = [
	    /* 0x00 */ SVTCA.bind(undefined, yUnitVector),
	    /* 0x01 */ SVTCA.bind(undefined, xUnitVector),
	    /* 0x02 */ SPVTCA.bind(undefined, yUnitVector),
	    /* 0x03 */ SPVTCA.bind(undefined, xUnitVector),
	    /* 0x04 */ SFVTCA.bind(undefined, yUnitVector),
	    /* 0x05 */ SFVTCA.bind(undefined, xUnitVector),
	    /* 0x06 */ SPVTL.bind(undefined, 0),
	    /* 0x07 */ SPVTL.bind(undefined, 1),
	    /* 0x08 */ SFVTL.bind(undefined, 0),
	    /* 0x09 */ SFVTL.bind(undefined, 1),
	    /* 0x0A */ SPVFS,
	    /* 0x0B */ SFVFS,
	    /* 0x0C */ GPV,
	    /* 0x0D */ GFV,
	    /* 0x0E */ SFVTPV,
	    /* 0x0F */ ISECT,
	    /* 0x10 */ SRP0,
	    /* 0x11 */ SRP1,
	    /* 0x12 */ SRP2,
	    /* 0x13 */ SZP0,
	    /* 0x14 */ SZP1,
	    /* 0x15 */ SZP2,
	    /* 0x16 */ SZPS,
	    /* 0x17 */ SLOOP,
	    /* 0x18 */ RTG,
	    /* 0x19 */ RTHG,
	    /* 0x1A */ SMD,
	    /* 0x1B */ ELSE,
	    /* 0x1C */ JMPR,
	    /* 0x1D */ SCVTCI,
	    /* 0x1E */ undefined,   // TODO SSWCI
	    /* 0x1F */ undefined,   // TODO SSW
	    /* 0x20 */ DUP,
	    /* 0x21 */ POP,
	    /* 0x22 */ CLEAR,
	    /* 0x23 */ SWAP,
	    /* 0x24 */ DEPTH,
	    /* 0x25 */ CINDEX,
	    /* 0x26 */ MINDEX,
	    /* 0x27 */ undefined,   // TODO ALIGNPTS
	    /* 0x28 */ undefined,
	    /* 0x29 */ undefined,   // TODO UTP
	    /* 0x2A */ LOOPCALL,
	    /* 0x2B */ CALL,
	    /* 0x2C */ FDEF,
	    /* 0x2D */ undefined,   // ENDF (eaten by FDEF)
	    /* 0x2E */ MDAP.bind(undefined, 0),
	    /* 0x2F */ MDAP.bind(undefined, 1),
	    /* 0x30 */ IUP.bind(undefined, yUnitVector),
	    /* 0x31 */ IUP.bind(undefined, xUnitVector),
	    /* 0x32 */ SHP.bind(undefined, 0),
	    /* 0x33 */ SHP.bind(undefined, 1),
	    /* 0x34 */ SHC.bind(undefined, 0),
	    /* 0x35 */ SHC.bind(undefined, 1),
	    /* 0x36 */ SHZ.bind(undefined, 0),
	    /* 0x37 */ SHZ.bind(undefined, 1),
	    /* 0x38 */ SHPIX,
	    /* 0x39 */ IP,
	    /* 0x3A */ MSIRP.bind(undefined, 0),
	    /* 0x3B */ MSIRP.bind(undefined, 1),
	    /* 0x3C */ ALIGNRP,
	    /* 0x3D */ RTDG,
	    /* 0x3E */ MIAP.bind(undefined, 0),
	    /* 0x3F */ MIAP.bind(undefined, 1),
	    /* 0x40 */ NPUSHB,
	    /* 0x41 */ NPUSHW,
	    /* 0x42 */ WS,
	    /* 0x43 */ RS,
	    /* 0x44 */ WCVTP,
	    /* 0x45 */ RCVT,
	    /* 0x46 */ GC.bind(undefined, 0),
	    /* 0x47 */ GC.bind(undefined, 1),
	    /* 0x48 */ undefined,   // TODO SCFS
	    /* 0x49 */ MD.bind(undefined, 0),
	    /* 0x4A */ MD.bind(undefined, 1),
	    /* 0x4B */ MPPEM,
	    /* 0x4C */ undefined,   // TODO MPS
	    /* 0x4D */ FLIPON,
	    /* 0x4E */ undefined,   // TODO FLIPOFF
	    /* 0x4F */ undefined,   // TODO DEBUG
	    /* 0x50 */ LT,
	    /* 0x51 */ LTEQ,
	    /* 0x52 */ GT,
	    /* 0x53 */ GTEQ,
	    /* 0x54 */ EQ,
	    /* 0x55 */ NEQ,
	    /* 0x56 */ ODD,
	    /* 0x57 */ EVEN,
	    /* 0x58 */ IF,
	    /* 0x59 */ EIF,
	    /* 0x5A */ AND,
	    /* 0x5B */ OR,
	    /* 0x5C */ NOT,
	    /* 0x5D */ DELTAP123.bind(undefined, 1),
	    /* 0x5E */ SDB,
	    /* 0x5F */ SDS,
	    /* 0x60 */ ADD,
	    /* 0x61 */ SUB,
	    /* 0x62 */ DIV,
	    /* 0x63 */ MUL,
	    /* 0x64 */ ABS,
	    /* 0x65 */ NEG,
	    /* 0x66 */ FLOOR,
	    /* 0x67 */ CEILING,
	    /* 0x68 */ ROUND.bind(undefined, 0),
	    /* 0x69 */ ROUND.bind(undefined, 1),
	    /* 0x6A */ ROUND.bind(undefined, 2),
	    /* 0x6B */ ROUND.bind(undefined, 3),
	    /* 0x6C */ undefined,   // TODO NROUND[ab]
	    /* 0x6D */ undefined,   // TODO NROUND[ab]
	    /* 0x6E */ undefined,   // TODO NROUND[ab]
	    /* 0x6F */ undefined,   // TODO NROUND[ab]
	    /* 0x70 */ WCVTF,
	    /* 0x71 */ DELTAP123.bind(undefined, 2),
	    /* 0x72 */ DELTAP123.bind(undefined, 3),
	    /* 0x73 */ DELTAC123.bind(undefined, 1),
	    /* 0x74 */ DELTAC123.bind(undefined, 2),
	    /* 0x75 */ DELTAC123.bind(undefined, 3),
	    /* 0x76 */ SROUND,
	    /* 0x77 */ S45ROUND,
	    /* 0x78 */ undefined,   // TODO JROT[]
	    /* 0x79 */ undefined,   // TODO JROF[]
	    /* 0x7A */ ROFF,
	    /* 0x7B */ undefined,
	    /* 0x7C */ RUTG,
	    /* 0x7D */ RDTG,
	    /* 0x7E */ POP, // actually SANGW, supposed to do only a pop though
	    /* 0x7F */ POP, // actually AA, supposed to do only a pop though
	    /* 0x80 */ undefined,   // TODO FLIPPT
	    /* 0x81 */ undefined,   // TODO FLIPRGON
	    /* 0x82 */ undefined,   // TODO FLIPRGOFF
	    /* 0x83 */ undefined,
	    /* 0x84 */ undefined,
	    /* 0x85 */ SCANCTRL,
	    /* 0x86 */ SDPVTL.bind(undefined, 0),
	    /* 0x87 */ SDPVTL.bind(undefined, 1),
	    /* 0x88 */ GETINFO,
	    /* 0x89 */ undefined,   // TODO IDEF
	    /* 0x8A */ ROLL,
	    /* 0x8B */ MAX,
	    /* 0x8C */ MIN,
	    /* 0x8D */ SCANTYPE,
	    /* 0x8E */ INSTCTRL,
	    /* 0x8F */ undefined,
	    /* 0x90 */ undefined,
	    /* 0x91 */ undefined,
	    /* 0x92 */ undefined,
	    /* 0x93 */ undefined,
	    /* 0x94 */ undefined,
	    /* 0x95 */ undefined,
	    /* 0x96 */ undefined,
	    /* 0x97 */ undefined,
	    /* 0x98 */ undefined,
	    /* 0x99 */ undefined,
	    /* 0x9A */ undefined,
	    /* 0x9B */ undefined,
	    /* 0x9C */ undefined,
	    /* 0x9D */ undefined,
	    /* 0x9E */ undefined,
	    /* 0x9F */ undefined,
	    /* 0xA0 */ undefined,
	    /* 0xA1 */ undefined,
	    /* 0xA2 */ undefined,
	    /* 0xA3 */ undefined,
	    /* 0xA4 */ undefined,
	    /* 0xA5 */ undefined,
	    /* 0xA6 */ undefined,
	    /* 0xA7 */ undefined,
	    /* 0xA8 */ undefined,
	    /* 0xA9 */ undefined,
	    /* 0xAA */ undefined,
	    /* 0xAB */ undefined,
	    /* 0xAC */ undefined,
	    /* 0xAD */ undefined,
	    /* 0xAE */ undefined,
	    /* 0xAF */ undefined,
	    /* 0xB0 */ PUSHB.bind(undefined, 1),
	    /* 0xB1 */ PUSHB.bind(undefined, 2),
	    /* 0xB2 */ PUSHB.bind(undefined, 3),
	    /* 0xB3 */ PUSHB.bind(undefined, 4),
	    /* 0xB4 */ PUSHB.bind(undefined, 5),
	    /* 0xB5 */ PUSHB.bind(undefined, 6),
	    /* 0xB6 */ PUSHB.bind(undefined, 7),
	    /* 0xB7 */ PUSHB.bind(undefined, 8),
	    /* 0xB8 */ PUSHW.bind(undefined, 1),
	    /* 0xB9 */ PUSHW.bind(undefined, 2),
	    /* 0xBA */ PUSHW.bind(undefined, 3),
	    /* 0xBB */ PUSHW.bind(undefined, 4),
	    /* 0xBC */ PUSHW.bind(undefined, 5),
	    /* 0xBD */ PUSHW.bind(undefined, 6),
	    /* 0xBE */ PUSHW.bind(undefined, 7),
	    /* 0xBF */ PUSHW.bind(undefined, 8),
	    /* 0xC0 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 0),
	    /* 0xC1 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 1),
	    /* 0xC2 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 2),
	    /* 0xC3 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 0, 3),
	    /* 0xC4 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 0),
	    /* 0xC5 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 1),
	    /* 0xC6 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 2),
	    /* 0xC7 */ MDRP_MIRP.bind(undefined, 0, 0, 0, 1, 3),
	    /* 0xC8 */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 0),
	    /* 0xC9 */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 1),
	    /* 0xCA */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 2),
	    /* 0xCB */ MDRP_MIRP.bind(undefined, 0, 0, 1, 0, 3),
	    /* 0xCC */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 0),
	    /* 0xCD */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 1),
	    /* 0xCE */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 2),
	    /* 0xCF */ MDRP_MIRP.bind(undefined, 0, 0, 1, 1, 3),
	    /* 0xD0 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 0),
	    /* 0xD1 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 1),
	    /* 0xD2 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 2),
	    /* 0xD3 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 0, 3),
	    /* 0xD4 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 0),
	    /* 0xD5 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 1),
	    /* 0xD6 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 2),
	    /* 0xD7 */ MDRP_MIRP.bind(undefined, 0, 1, 0, 1, 3),
	    /* 0xD8 */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 0),
	    /* 0xD9 */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 1),
	    /* 0xDA */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 2),
	    /* 0xDB */ MDRP_MIRP.bind(undefined, 0, 1, 1, 0, 3),
	    /* 0xDC */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 0),
	    /* 0xDD */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 1),
	    /* 0xDE */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 2),
	    /* 0xDF */ MDRP_MIRP.bind(undefined, 0, 1, 1, 1, 3),
	    /* 0xE0 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 0),
	    /* 0xE1 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 1),
	    /* 0xE2 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 2),
	    /* 0xE3 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 0, 3),
	    /* 0xE4 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 0),
	    /* 0xE5 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 1),
	    /* 0xE6 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 2),
	    /* 0xE7 */ MDRP_MIRP.bind(undefined, 1, 0, 0, 1, 3),
	    /* 0xE8 */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 0),
	    /* 0xE9 */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 1),
	    /* 0xEA */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 2),
	    /* 0xEB */ MDRP_MIRP.bind(undefined, 1, 0, 1, 0, 3),
	    /* 0xEC */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 0),
	    /* 0xED */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 1),
	    /* 0xEE */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 2),
	    /* 0xEF */ MDRP_MIRP.bind(undefined, 1, 0, 1, 1, 3),
	    /* 0xF0 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 0),
	    /* 0xF1 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 1),
	    /* 0xF2 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 2),
	    /* 0xF3 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 0, 3),
	    /* 0xF4 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 0),
	    /* 0xF5 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 1),
	    /* 0xF6 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 2),
	    /* 0xF7 */ MDRP_MIRP.bind(undefined, 1, 1, 0, 1, 3),
	    /* 0xF8 */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 0),
	    /* 0xF9 */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 1),
	    /* 0xFA */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 2),
	    /* 0xFB */ MDRP_MIRP.bind(undefined, 1, 1, 1, 0, 3),
	    /* 0xFC */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 0),
	    /* 0xFD */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 1),
	    /* 0xFE */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 2),
	    /* 0xFF */ MDRP_MIRP.bind(undefined, 1, 1, 1, 1, 3)
	];

	/*****************************
	  Mathematical Considerations
	******************************

	fv ... refers to freedom vector
	pv ... refers to projection vector
	rp ... refers to reference point
	p  ... refers to to point being operated on
	d  ... refers to distance

	SETRELATIVE:
	============

	case freedom vector == x-axis:
	------------------------------

	                        (pv)
	                     .-'
	              rpd .-'
	               .-*
	          d .-'90°'
	         .-'       '
	      .-'           '
	   *-'               ' b
	  rp                  '
	                       '
	                        '
	            p *----------*-------------- (fv)
	                          pm

	  rpdx = rpx + d * pv.x
	  rpdy = rpy + d * pv.y

	  equation of line b

	   y - rpdy = pvns * (x- rpdx)

	   y = p.y

	   x = rpdx + ( p.y - rpdy ) / pvns


	case freedom vector == y-axis:
	------------------------------

	    * pm
	    |\
	    | \
	    |  \
	    |   \
	    |    \
	    |     \
	    |      \
	    |       \
	    |        \
	    |         \ b
	    |          \
	    |           \
	    |            \    .-' (pv)
	    |         90° \.-'
	    |           .-'* rpd
	    |        .-'
	    *     *-'  d
	    p     rp

	  rpdx = rpx + d * pv.x
	  rpdy = rpy + d * pv.y

	  equation of line b:
	           pvns ... normal slope to pv

	   y - rpdy = pvns * (x - rpdx)

	   x = p.x

	   y = rpdy +  pvns * (p.x - rpdx)



	generic case:
	-------------


	                              .'(fv)
	                            .'
	                          .* pm
	                        .' !
	                      .'    .
	                    .'      !
	                  .'         . b
	                .'           !
	               *              .
	              p               !
	                         90°   .    ... (pv)
	                           ...-*-'''
	                  ...---'''    rpd
	         ...---'''   d
	   *--'''
	  rp

	    rpdx = rpx + d * pv.x
	    rpdy = rpy + d * pv.y

	 equation of line b:
	    pvns... normal slope to pv

	    y - rpdy = pvns * (x - rpdx)

	 equation of freedom vector line:
	    fvs ... slope of freedom vector (=fy/fx)

	    y - py = fvs * (x - px)


	  on pm both equations are true for same x/y

	    y - rpdy = pvns * (x - rpdx)

	    y - py = fvs * (x - px)

	  form to y and set equal:

	    pvns * (x - rpdx) + rpdy = fvs * (x - px) + py

	  expand:

	    pvns * x - pvns * rpdx + rpdy = fvs * x - fvs * px + py

	  switch:

	    fvs * x - fvs * px + py = pvns * x - pvns * rpdx + rpdy

	  solve for x:

	    fvs * x - pvns * x = fvs * px - pvns * rpdx - py + rpdy



	          fvs * px - pvns * rpdx + rpdy - py
	    x =  -----------------------------------
	                 fvs - pvns

	  and:

	    y = fvs * (x - px) + py



	INTERPOLATE:
	============

	Examples of point interpolation.

	The weight of the movement of the reference point gets bigger
	the further the other reference point is away, thus the safest
	option (that is avoiding 0/0 divisions) is to weight the
	original distance of the other point by the sum of both distances.

	If the sum of both distances is 0, then move the point by the
	arithmetic average of the movement of both reference points.




	           (+6)
	    rp1o *---->*rp1
	         .     .                          (+12)
	         .     .                  rp2o *---------->* rp2
	         .     .                       .           .
	         .     .                       .           .
	         .    10          20           .           .
	         |.........|...................|           .
	               .   .                               .
	               .   . (+8)                          .
	                po *------>*p                      .
	               .           .                       .
	               .    12     .          24           .
	               |...........|.......................|
	                                  36


	-------



	           (+10)
	    rp1o *-------->*rp1
	         .         .                      (-10)
	         .         .              rp2 *<---------* rpo2
	         .         .                   .         .
	         .         .                   .         .
	         .    10   .          30       .         .
	         |.........|.............................|
	                   .                   .
	                   . (+5)              .
	                po *--->* p            .
	                   .    .              .
	                   .    .   20         .
	                   |....|..............|
	                     5        15


	-------


	           (+10)
	    rp1o *-------->*rp1
	         .         .
	         .         .
	    rp2o *-------->*rp2


	                               (+10)
	                          po *-------->* p

	-------


	           (+10)
	    rp1o *-------->*rp1
	         .         .
	         .         .(+30)
	    rp2o *---------------------------->*rp2


	                                        (+25)
	                          po *----------------------->* p



	vim: set ts=4 sw=4 expandtab:
	*****/

	// The Font object

	// This code is based on Array.from implementation for strings in https://github.com/mathiasbynens/Array.from
	var arrayFromString = Array.from || (function (s) { return s.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]?|[^\uD800-\uDFFF]|./g) || []; });

	/**
	 * @typedef FontOptions
	 * @type Object
	 * @property {Boolean} empty - whether to create a new empty font
	 * @property {string} familyName
	 * @property {string} styleName
	 * @property {string=} fullName
	 * @property {string=} postScriptName
	 * @property {string=} designer
	 * @property {string=} designerURL
	 * @property {string=} manufacturer
	 * @property {string=} manufacturerURL
	 * @property {string=} license
	 * @property {string=} licenseURL
	 * @property {string=} version
	 * @property {string=} description
	 * @property {string=} copyright
	 * @property {string=} trademark
	 * @property {Number} unitsPerEm
	 * @property {Number} ascender
	 * @property {Number} descender
	 * @property {Number} createdTimestamp
	 * @property {string=} weightClass
	 * @property {string=} widthClass
	 * @property {string=} fsSelection
	 */

	/**
	 * A Font represents a loaded OpenType font file.
	 * It contains a set of glyphs and methods to draw text on a drawing context,
	 * or to get a path representing the text.
	 * @exports opentype.Font
	 * @class
	 * @param {FontOptions}
	 * @constructor
	 */
	function Font(options) {
	    options = options || {};

	    if (!options.empty) {
	        // Check that we've provided the minimum set of names.
	        checkArgument(options.familyName, 'When creating a new Font object, familyName is required.');
	        checkArgument(options.styleName, 'When creating a new Font object, styleName is required.');
	        checkArgument(options.unitsPerEm, 'When creating a new Font object, unitsPerEm is required.');
	        checkArgument(options.ascender, 'When creating a new Font object, ascender is required.');
	        checkArgument(options.descender, 'When creating a new Font object, descender is required.');
	        checkArgument(options.descender < 0, 'Descender should be negative (e.g. -512).');

	        // OS X will complain if the names are empty, so we put a single space everywhere by default.
	        this.names = {
	            fontFamily: {en: options.familyName || ' '},
	            fontSubfamily: {en: options.styleName || ' '},
	            fullName: {en: options.fullName || options.familyName + ' ' + options.styleName},
	            // postScriptName may not contain any whitespace
	            postScriptName: {en: options.postScriptName || (options.familyName + options.styleName).replace(/\s/g, '')},
	            designer: {en: options.designer || ' '},
	            designerURL: {en: options.designerURL || ' '},
	            manufacturer: {en: options.manufacturer || ' '},
	            manufacturerURL: {en: options.manufacturerURL || ' '},
	            license: {en: options.license || ' '},
	            licenseURL: {en: options.licenseURL || ' '},
	            version: {en: options.version || 'Version 0.1'},
	            description: {en: options.description || ' '},
	            copyright: {en: options.copyright || ' '},
	            trademark: {en: options.trademark || ' '}
	        };
	        this.unitsPerEm = options.unitsPerEm || 1000;
	        this.ascender = options.ascender;
	        this.descender = options.descender;
	        this.createdTimestamp = options.createdTimestamp;
	        this.tables = { os2: {
	            usWeightClass: options.weightClass || this.usWeightClasses.MEDIUM,
	            usWidthClass: options.widthClass || this.usWidthClasses.MEDIUM,
	            fsSelection: options.fsSelection || this.fsSelectionValues.REGULAR
	        } };
	    }

	    this.supported = true; // Deprecated: parseBuffer will throw an error if font is not supported.
	    this.glyphs = new glyphset.GlyphSet(this, options.glyphs || []);
	    this.encoding = new DefaultEncoding(this);
	    this.position = new Position(this);
	    this.substitution = new Substitution(this);
	    this.tables = this.tables || {};

	    Object.defineProperty(this, 'hinting', {
	        get: function() {
	            if (this._hinting) { return this._hinting; }
	            if (this.outlinesFormat === 'truetype') {
	                return (this._hinting = new Hinting(this));
	            }
	        }
	    });
	}

	/**
	 * Check if the font has a glyph for the given character.
	 * @param  {string}
	 * @return {Boolean}
	 */
	Font.prototype.hasChar = function(c) {
	    return this.encoding.charToGlyphIndex(c) !== null;
	};

	/**
	 * Convert the given character to a single glyph index.
	 * Note that this function assumes that there is a one-to-one mapping between
	 * the given character and a glyph; for complex scripts this might not be the case.
	 * @param  {string}
	 * @return {Number}
	 */
	Font.prototype.charToGlyphIndex = function(s) {
	    return this.encoding.charToGlyphIndex(s);
	};

	/**
	 * Convert the given character to a single Glyph object.
	 * Note that this function assumes that there is a one-to-one mapping between
	 * the given character and a glyph; for complex scripts this might not be the case.
	 * @param  {string}
	 * @return {opentype.Glyph}
	 */
	Font.prototype.charToGlyph = function(c) {
	    var glyphIndex = this.charToGlyphIndex(c);
	    var glyph = this.glyphs.get(glyphIndex);
	    if (!glyph) {
	        // .notdef
	        glyph = this.glyphs.get(0);
	    }

	    return glyph;
	};

	/**
	 * Convert the given text to a list of Glyph objects.
	 * Note that there is no strict one-to-one mapping between characters and
	 * glyphs, so the list of returned glyphs can be larger or smaller than the
	 * length of the given string.
	 * @param  {string}
	 * @param  {GlyphRenderOptions} [options]
	 * @return {opentype.Glyph[]}
	 */
	Font.prototype.stringToGlyphs = function(s, options) {
	    var this$1 = this;

	    options = options || this.defaultRenderOptions;
	    // Get glyph indexes
	    var chars = arrayFromString(s);
	    var indexes = [];
	    for (var i = 0; i < chars.length; i += 1) {
	        var c = chars[i];
	        indexes.push(this$1.charToGlyphIndex(c));
	    }
	    var length = indexes.length;

	    // Apply substitutions on glyph indexes
	    if (options.features) {
	        var script = options.script || this.substitution.getDefaultScriptName();
	        var manyToOne = [];
	        if (options.features.liga) { manyToOne = manyToOne.concat(this.substitution.getFeature('liga', script, options.language)); }
	        if (options.features.rlig) { manyToOne = manyToOne.concat(this.substitution.getFeature('rlig', script, options.language)); }
	        for (var i$1 = 0; i$1 < length; i$1 += 1) {
	            for (var j = 0; j < manyToOne.length; j++) {
	                var ligature = manyToOne[j];
	                var components = ligature.sub;
	                var compCount = components.length;
	                var k = 0;
	                while (k < compCount && components[k] === indexes[i$1 + k]) { k++; }
	                if (k === compCount) {
	                    indexes.splice(i$1, compCount, ligature.by);
	                    length = length - compCount + 1;
	                }
	            }
	        }
	    }

	    // convert glyph indexes to glyph objects
	    var glyphs = new Array(length);
	    var notdef = this.glyphs.get(0);
	    for (var i$2 = 0; i$2 < length; i$2 += 1) {
	        glyphs[i$2] = this$1.glyphs.get(indexes[i$2]) || notdef;
	    }
	    return glyphs;
	};

	/**
	 * @param  {string}
	 * @return {Number}
	 */
	Font.prototype.nameToGlyphIndex = function(name) {
	    return this.glyphNames.nameToGlyphIndex(name);
	};

	/**
	 * @param  {string}
	 * @return {opentype.Glyph}
	 */
	Font.prototype.nameToGlyph = function(name) {
	    var glyphIndex = this.nameToGlyphIndex(name);
	    var glyph = this.glyphs.get(glyphIndex);
	    if (!glyph) {
	        // .notdef
	        glyph = this.glyphs.get(0);
	    }

	    return glyph;
	};

	/**
	 * @param  {Number}
	 * @return {String}
	 */
	Font.prototype.glyphIndexToName = function(gid) {
	    if (!this.glyphNames.glyphIndexToName) {
	        return '';
	    }

	    return this.glyphNames.glyphIndexToName(gid);
	};

	/**
	 * Retrieve the value of the kerning pair between the left glyph (or its index)
	 * and the right glyph (or its index). If no kerning pair is found, return 0.
	 * The kerning value gets added to the advance width when calculating the spacing
	 * between glyphs.
	 * For GPOS kerning, this method uses the default script and language, which covers
	 * most use cases. To have greater control, use font.position.getKerningValue .
	 * @param  {opentype.Glyph} leftGlyph
	 * @param  {opentype.Glyph} rightGlyph
	 * @return {Number}
	 */
	Font.prototype.getKerningValue = function(leftGlyph, rightGlyph) {
	    leftGlyph = leftGlyph.index || leftGlyph;
	    rightGlyph = rightGlyph.index || rightGlyph;
	    var gposKerning = this.position.defaultKerningTables;
	    if (gposKerning) {
	        return this.position.getKerningValue(gposKerning, leftGlyph, rightGlyph);
	    }
	    // "kern" table
	    return this.kerningPairs[leftGlyph + ',' + rightGlyph] || 0;
	};

	/**
	 * @typedef GlyphRenderOptions
	 * @type Object
	 * @property {string} [script] - script used to determine which features to apply. By default, 'DFLT' or 'latn' is used.
	 *                               See https://www.microsoft.com/typography/otspec/scripttags.htm
	 * @property {string} [language='dflt'] - language system used to determine which features to apply.
	 *                                        See https://www.microsoft.com/typography/developers/opentype/languagetags.aspx
	 * @property {boolean} [kerning=true] - whether to include kerning values
	 * @property {object} [features] - OpenType Layout feature tags. Used to enable or disable the features of the given script/language system.
	 *                                 See https://www.microsoft.com/typography/otspec/featuretags.htm
	 */
	Font.prototype.defaultRenderOptions = {
	    kerning: true,
	    features: {
	        liga: true,
	        rlig: true
	    }
	};

	/**
	 * Helper function that invokes the given callback for each glyph in the given text.
	 * The callback gets `(glyph, x, y, fontSize, options)`.* @param  {string} text
	 * @param {string} text - The text to apply.
	 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 * @param  {GlyphRenderOptions=} options
	 * @param  {Function} callback
	 */
	Font.prototype.forEachGlyph = function(text, x, y, fontSize, options, callback) {
	    var this$1 = this;

	    x = x !== undefined ? x : 0;
	    y = y !== undefined ? y : 0;
	    fontSize = fontSize !== undefined ? fontSize : 72;
	    options = options || this.defaultRenderOptions;
	    var fontScale = 1 / this.unitsPerEm * fontSize;
	    var glyphs = this.stringToGlyphs(text, options);
	    var kerningLookups;
	    if (options.kerning) {
	        var script = options.script || this.position.getDefaultScriptName();
	        kerningLookups = this.position.getKerningTables(script, options.language);
	    }
	    for (var i = 0; i < glyphs.length; i += 1) {
	        var glyph = glyphs[i];
	        callback.call(this$1, glyph, x, y, fontSize, options);
	        if (glyph.advanceWidth) {
	            x += glyph.advanceWidth * fontScale;
	        }

	        if (options.kerning && i < glyphs.length - 1) {
	            // We should apply position adjustment lookups in a more generic way.
	            // Here we only use the xAdvance value.
	            var kerningValue = kerningLookups ?
	                  this$1.position.getKerningValue(kerningLookups, glyph.index, glyphs[i + 1].index) :
	                  this$1.getKerningValue(glyph, glyphs[i + 1]);
	            x += kerningValue * fontScale;
	        }

	        if (options.letterSpacing) {
	            x += options.letterSpacing * fontSize;
	        } else if (options.tracking) {
	            x += (options.tracking / 1000) * fontSize;
	        }
	    }
	    return x;
	};

	/**
	 * Create a Path object that represents the given text.
	 * @param  {string} text - The text to create.
	 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 * @param  {GlyphRenderOptions=} options
	 * @return {opentype.Path}
	 */
	Font.prototype.getPath = function(text, x, y, fontSize, options) {
	    var fullPath = new Path();
	    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
	        var glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
	        fullPath.extend(glyphPath);
	    });
	    return fullPath;
	};

	/**
	 * Create an array of Path objects that represent the glyphs of a given text.
	 * @param  {string} text - The text to create.
	 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 * @param  {GlyphRenderOptions=} options
	 * @return {opentype.Path[]}
	 */
	Font.prototype.getPaths = function(text, x, y, fontSize, options) {
	    var glyphPaths = [];
	    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
	        var glyphPath = glyph.getPath(gX, gY, gFontSize, options, this);
	        glyphPaths.push(glyphPath);
	    });

	    return glyphPaths;
	};

	/**
	 * Returns the advance width of a text.
	 *
	 * This is something different than Path.getBoundingBox() as for example a
	 * suffixed whitespace increases the advanceWidth but not the bounding box
	 * or an overhanging letter like a calligraphic 'f' might have a quite larger
	 * bounding box than its advance width.
	 *
	 * This corresponds to canvas2dContext.measureText(text).width
	 *
	 * @param  {string} text - The text to create.
	 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 * @param  {GlyphRenderOptions=} options
	 * @return advance width
	 */
	Font.prototype.getAdvanceWidth = function(text, fontSize, options) {
	    return this.forEachGlyph(text, 0, 0, fontSize, options, function() {});
	};

	/**
	 * Draw the text on the given drawing context.
	 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
	 * @param  {string} text - The text to create.
	 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 * @param  {GlyphRenderOptions=} options
	 */
	Font.prototype.draw = function(ctx, text, x, y, fontSize, options) {
	    this.getPath(text, x, y, fontSize, options).draw(ctx);
	};

	/**
	 * Draw the points of all glyphs in the text.
	 * On-curve points will be drawn in blue, off-curve points will be drawn in red.
	 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
	 * @param {string} text - The text to create.
	 * @param {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 * @param {GlyphRenderOptions=} options
	 */
	Font.prototype.drawPoints = function(ctx, text, x, y, fontSize, options) {
	    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
	        glyph.drawPoints(ctx, gX, gY, gFontSize);
	    });
	};

	/**
	 * Draw lines indicating important font measurements for all glyphs in the text.
	 * Black lines indicate the origin of the coordinate system (point 0,0).
	 * Blue lines indicate the glyph bounding box.
	 * Green line indicates the advance width of the glyph.
	 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
	 * @param {string} text - The text to create.
	 * @param {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 * @param {GlyphRenderOptions=} options
	 */
	Font.prototype.drawMetrics = function(ctx, text, x, y, fontSize, options) {
	    this.forEachGlyph(text, x, y, fontSize, options, function(glyph, gX, gY, gFontSize) {
	        glyph.drawMetrics(ctx, gX, gY, gFontSize);
	    });
	};

	/**
	 * @param  {string}
	 * @return {string}
	 */
	Font.prototype.getEnglishName = function(name) {
	    var translations = this.names[name];
	    if (translations) {
	        return translations.en;
	    }
	};

	/**
	 * Validate
	 */
	Font.prototype.validate = function() {
	    var _this = this;

	    function assert(predicate, message) {
	    }

	    function assertNamePresent(name) {
	        var englishName = _this.getEnglishName(name);
	        assert(englishName && englishName.trim().length > 0,
	               'No English ' + name + ' specified.');
	    }

	    // Identification information
	    assertNamePresent('fontFamily');
	    assertNamePresent('weightName');
	    assertNamePresent('manufacturer');
	    assertNamePresent('copyright');
	    assertNamePresent('version');

	    // Dimension information
	    assert(this.unitsPerEm > 0, 'No unitsPerEm specified.');
	};

	/**
	 * Convert the font object to a SFNT data structure.
	 * This structure contains all the necessary tables and metadata to create a binary OTF file.
	 * @return {opentype.Table}
	 */
	Font.prototype.toTables = function() {
	    return sfnt.fontToTable(this);
	};
	/**
	 * @deprecated Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.
	 */
	Font.prototype.toBuffer = function() {
	    console.warn('Font.toBuffer is deprecated. Use Font.toArrayBuffer instead.');
	    return this.toArrayBuffer();
	};
	/**
	 * Converts a `opentype.Font` into an `ArrayBuffer`
	 * @return {ArrayBuffer}
	 */
	Font.prototype.toArrayBuffer = function() {
	    var sfntTable = this.toTables();
	    var bytes = sfntTable.encode();
	    var buffer = new ArrayBuffer(bytes.length);
	    var intArray = new Uint8Array(buffer);
	    for (var i = 0; i < bytes.length; i++) {
	        intArray[i] = bytes[i];
	    }

	    return buffer;
	};

	/**
	 * Initiate a download of the OpenType font.
	 */
	Font.prototype.download = function(fileName) {
	    var familyName = this.getEnglishName('fontFamily');
	    var styleName = this.getEnglishName('fontSubfamily');
	    fileName = fileName || familyName.replace(/\s/g, '') + '-' + styleName + '.otf';
	    var arrayBuffer = this.toArrayBuffer();

	    if (isBrowser()) {
	        window.URL = window.URL || window.webkitURL;

	        if (window.URL) {
	            var dataView = new DataView(arrayBuffer);
	            var blob = new Blob([dataView], {type: 'font/opentype'});

	            var link = document.createElement('a');
	            link.href = window.URL.createObjectURL(blob);
	            link.download = fileName;

	            var event = document.createEvent('MouseEvents');
	            event.initEvent('click', true, false);
	            link.dispatchEvent(event);
	        } else {
	            console.warn('Font file could not be downloaded. Try using a different browser.');
	        }
	    } else {
	        var fs = __webpack_require__(/*! fs */ "?4db5");
	        var buffer = arrayBufferToNodeBuffer(arrayBuffer);
	        fs.writeFileSync(fileName, buffer);
	    }
	};
	/**
	 * @private
	 */
	Font.prototype.fsSelectionValues = {
	    ITALIC:              0x001, //1
	    UNDERSCORE:          0x002, //2
	    NEGATIVE:            0x004, //4
	    OUTLINED:            0x008, //8
	    STRIKEOUT:           0x010, //16
	    BOLD:                0x020, //32
	    REGULAR:             0x040, //64
	    USER_TYPO_METRICS:   0x080, //128
	    WWS:                 0x100, //256
	    OBLIQUE:             0x200  //512
	};

	/**
	 * @private
	 */
	Font.prototype.usWidthClasses = {
	    ULTRA_CONDENSED: 1,
	    EXTRA_CONDENSED: 2,
	    CONDENSED: 3,
	    SEMI_CONDENSED: 4,
	    MEDIUM: 5,
	    SEMI_EXPANDED: 6,
	    EXPANDED: 7,
	    EXTRA_EXPANDED: 8,
	    ULTRA_EXPANDED: 9
	};

	/**
	 * @private
	 */
	Font.prototype.usWeightClasses = {
	    THIN: 100,
	    EXTRA_LIGHT: 200,
	    LIGHT: 300,
	    NORMAL: 400,
	    MEDIUM: 500,
	    SEMI_BOLD: 600,
	    BOLD: 700,
	    EXTRA_BOLD: 800,
	    BLACK:    900
	};

	// The `fvar` table stores font variation axes and instances.

	function addName(name, names) {
	    var nameString = JSON.stringify(name);
	    var nameID = 256;
	    for (var nameKey in names) {
	        var n = parseInt(nameKey);
	        if (!n || n < 256) {
	            continue;
	        }

	        if (JSON.stringify(names[nameKey]) === nameString) {
	            return n;
	        }

	        if (nameID <= n) {
	            nameID = n + 1;
	        }
	    }

	    names[nameID] = name;
	    return nameID;
	}

	function makeFvarAxis(n, axis, names) {
	    var nameID = addName(axis.name, names);
	    return [
	        {name: 'tag_' + n, type: 'TAG', value: axis.tag},
	        {name: 'minValue_' + n, type: 'FIXED', value: axis.minValue << 16},
	        {name: 'defaultValue_' + n, type: 'FIXED', value: axis.defaultValue << 16},
	        {name: 'maxValue_' + n, type: 'FIXED', value: axis.maxValue << 16},
	        {name: 'flags_' + n, type: 'USHORT', value: 0},
	        {name: 'nameID_' + n, type: 'USHORT', value: nameID}
	    ];
	}

	function parseFvarAxis(data, start, names) {
	    var axis = {};
	    var p = new parse.Parser(data, start);
	    axis.tag = p.parseTag();
	    axis.minValue = p.parseFixed();
	    axis.defaultValue = p.parseFixed();
	    axis.maxValue = p.parseFixed();
	    p.skip('uShort', 1);  // reserved for flags; no values defined
	    axis.name = names[p.parseUShort()] || {};
	    return axis;
	}

	function makeFvarInstance(n, inst, axes, names) {
	    var nameID = addName(inst.name, names);
	    var fields = [
	        {name: 'nameID_' + n, type: 'USHORT', value: nameID},
	        {name: 'flags_' + n, type: 'USHORT', value: 0}
	    ];

	    for (var i = 0; i < axes.length; ++i) {
	        var axisTag = axes[i].tag;
	        fields.push({
	            name: 'axis_' + n + ' ' + axisTag,
	            type: 'FIXED',
	            value: inst.coordinates[axisTag] << 16
	        });
	    }

	    return fields;
	}

	function parseFvarInstance(data, start, axes, names) {
	    var inst = {};
	    var p = new parse.Parser(data, start);
	    inst.name = names[p.parseUShort()] || {};
	    p.skip('uShort', 1);  // reserved for flags; no values defined

	    inst.coordinates = {};
	    for (var i = 0; i < axes.length; ++i) {
	        inst.coordinates[axes[i].tag] = p.parseFixed();
	    }

	    return inst;
	}

	function makeFvarTable(fvar, names) {
	    var result = new table.Table('fvar', [
	        {name: 'version', type: 'ULONG', value: 0x10000},
	        {name: 'offsetToData', type: 'USHORT', value: 0},
	        {name: 'countSizePairs', type: 'USHORT', value: 2},
	        {name: 'axisCount', type: 'USHORT', value: fvar.axes.length},
	        {name: 'axisSize', type: 'USHORT', value: 20},
	        {name: 'instanceCount', type: 'USHORT', value: fvar.instances.length},
	        {name: 'instanceSize', type: 'USHORT', value: 4 + fvar.axes.length * 4}
	    ]);
	    result.offsetToData = result.sizeOf();

	    for (var i = 0; i < fvar.axes.length; i++) {
	        result.fields = result.fields.concat(makeFvarAxis(i, fvar.axes[i], names));
	    }

	    for (var j = 0; j < fvar.instances.length; j++) {
	        result.fields = result.fields.concat(makeFvarInstance(j, fvar.instances[j], fvar.axes, names));
	    }

	    return result;
	}

	function parseFvarTable(data, start, names) {
	    var p = new parse.Parser(data, start);
	    var tableVersion = p.parseULong();
	    check.argument(tableVersion === 0x00010000, 'Unsupported fvar table version.');
	    var offsetToData = p.parseOffset16();
	    // Skip countSizePairs.
	    p.skip('uShort', 1);
	    var axisCount = p.parseUShort();
	    var axisSize = p.parseUShort();
	    var instanceCount = p.parseUShort();
	    var instanceSize = p.parseUShort();

	    var axes = [];
	    for (var i = 0; i < axisCount; i++) {
	        axes.push(parseFvarAxis(data, start + offsetToData + i * axisSize, names));
	    }

	    var instances = [];
	    var instanceStart = start + offsetToData + axisCount * axisSize;
	    for (var j = 0; j < instanceCount; j++) {
	        instances.push(parseFvarInstance(data, instanceStart + j * instanceSize, axes, names));
	    }

	    return {axes: axes, instances: instances};
	}

	var fvar = { make: makeFvarTable, parse: parseFvarTable };

	// The `GPOS` table contains kerning pairs, among other things.

	var subtableParsers$1 = new Array(10);         // subtableParsers[0] is unused

	// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#lookup-type-1-single-adjustment-positioning-subtable
	// this = Parser instance
	subtableParsers$1[1] = function parseLookup1() {
	    var start = this.offset + this.relativeOffset;
	    var posformat = this.parseUShort();
	    if (posformat === 1) {
	        return {
	            posFormat: 1,
	            coverage: this.parsePointer(Parser.coverage),
	            value: this.parseValueRecord()
	        };
	    } else if (posformat === 2) {
	        return {
	            posFormat: 2,
	            coverage: this.parsePointer(Parser.coverage),
	            values: this.parseValueRecordList()
	        };
	    }
	    check.assert(false, '0x' + start.toString(16) + ': GPOS lookup type 1 format must be 1 or 2.');
	};

	// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#lookup-type-2-pair-adjustment-positioning-subtable
	subtableParsers$1[2] = function parseLookup2() {
	    var start = this.offset + this.relativeOffset;
	    var posFormat = this.parseUShort();
	    check.assert(posFormat === 1 || posFormat === 2, '0x' + start.toString(16) + ': GPOS lookup type 2 format must be 1 or 2.');
	    var coverage = this.parsePointer(Parser.coverage);
	    var valueFormat1 = this.parseUShort();
	    var valueFormat2 = this.parseUShort();
	    if (posFormat === 1) {
	        // Adjustments for Glyph Pairs
	        return {
	            posFormat: posFormat,
	            coverage: coverage,
	            valueFormat1: valueFormat1,
	            valueFormat2: valueFormat2,
	            pairSets: this.parseList(Parser.pointer(Parser.list(function() {
	                return {        // pairValueRecord
	                    secondGlyph: this.parseUShort(),
	                    value1: this.parseValueRecord(valueFormat1),
	                    value2: this.parseValueRecord(valueFormat2)
	                };
	            })))
	        };
	    } else if (posFormat === 2) {
	        var classDef1 = this.parsePointer(Parser.classDef);
	        var classDef2 = this.parsePointer(Parser.classDef);
	        var class1Count = this.parseUShort();
	        var class2Count = this.parseUShort();
	        return {
	            // Class Pair Adjustment
	            posFormat: posFormat,
	            coverage: coverage,
	            valueFormat1: valueFormat1,
	            valueFormat2: valueFormat2,
	            classDef1: classDef1,
	            classDef2: classDef2,
	            class1Count: class1Count,
	            class2Count: class2Count,
	            classRecords: this.parseList(class1Count, Parser.list(class2Count, function() {
	                return {
	                    value1: this.parseValueRecord(valueFormat1),
	                    value2: this.parseValueRecord(valueFormat2)
	                };
	            }))
	        };
	    }
	};

	subtableParsers$1[3] = function parseLookup3() { return { error: 'GPOS Lookup 3 not supported' }; };
	subtableParsers$1[4] = function parseLookup4() { return { error: 'GPOS Lookup 4 not supported' }; };
	subtableParsers$1[5] = function parseLookup5() { return { error: 'GPOS Lookup 5 not supported' }; };
	subtableParsers$1[6] = function parseLookup6() { return { error: 'GPOS Lookup 6 not supported' }; };
	subtableParsers$1[7] = function parseLookup7() { return { error: 'GPOS Lookup 7 not supported' }; };
	subtableParsers$1[8] = function parseLookup8() { return { error: 'GPOS Lookup 8 not supported' }; };
	subtableParsers$1[9] = function parseLookup9() { return { error: 'GPOS Lookup 9 not supported' }; };

	// https://docs.microsoft.com/en-us/typography/opentype/spec/gpos
	function parseGposTable(data, start) {
	    start = start || 0;
	    var p = new Parser(data, start);
	    var tableVersion = p.parseVersion(1);
	    check.argument(tableVersion === 1 || tableVersion === 1.1, 'Unsupported GPOS table version ' + tableVersion);

	    if (tableVersion === 1) {
	        return {
	            version: tableVersion,
	            scripts: p.parseScriptList(),
	            features: p.parseFeatureList(),
	            lookups: p.parseLookupList(subtableParsers$1)
	        };
	    } else {
	        return {
	            version: tableVersion,
	            scripts: p.parseScriptList(),
	            features: p.parseFeatureList(),
	            lookups: p.parseLookupList(subtableParsers$1),
	            variations: p.parseFeatureVariationsList()
	        };
	    }

	}

	// GPOS Writing //////////////////////////////////////////////
	// NOT SUPPORTED
	var subtableMakers$1 = new Array(10);

	function makeGposTable(gpos) {
	    return new table.Table('GPOS', [
	        {name: 'version', type: 'ULONG', value: 0x10000},
	        {name: 'scripts', type: 'TABLE', value: new table.ScriptList(gpos.scripts)},
	        {name: 'features', type: 'TABLE', value: new table.FeatureList(gpos.features)},
	        {name: 'lookups', type: 'TABLE', value: new table.LookupList(gpos.lookups, subtableMakers$1)}
	    ]);
	}

	var gpos = { parse: parseGposTable, make: makeGposTable };

	// The `kern` table contains kerning pairs.

	function parseWindowsKernTable(p) {
	    var pairs = {};
	    // Skip nTables.
	    p.skip('uShort');
	    var subtableVersion = p.parseUShort();
	    check.argument(subtableVersion === 0, 'Unsupported kern sub-table version.');
	    // Skip subtableLength, subtableCoverage
	    p.skip('uShort', 2);
	    var nPairs = p.parseUShort();
	    // Skip searchRange, entrySelector, rangeShift.
	    p.skip('uShort', 3);
	    for (var i = 0; i < nPairs; i += 1) {
	        var leftIndex = p.parseUShort();
	        var rightIndex = p.parseUShort();
	        var value = p.parseShort();
	        pairs[leftIndex + ',' + rightIndex] = value;
	    }
	    return pairs;
	}

	function parseMacKernTable(p) {
	    var pairs = {};
	    // The Mac kern table stores the version as a fixed (32 bits) but we only loaded the first 16 bits.
	    // Skip the rest.
	    p.skip('uShort');
	    var nTables = p.parseULong();
	    //check.argument(nTables === 1, 'Only 1 subtable is supported (got ' + nTables + ').');
	    if (nTables > 1) {
	        console.warn('Only the first kern subtable is supported.');
	    }
	    p.skip('uLong');
	    var coverage = p.parseUShort();
	    var subtableVersion = coverage & 0xFF;
	    p.skip('uShort');
	    if (subtableVersion === 0) {
	        var nPairs = p.parseUShort();
	        // Skip searchRange, entrySelector, rangeShift.
	        p.skip('uShort', 3);
	        for (var i = 0; i < nPairs; i += 1) {
	            var leftIndex = p.parseUShort();
	            var rightIndex = p.parseUShort();
	            var value = p.parseShort();
	            pairs[leftIndex + ',' + rightIndex] = value;
	        }
	    }
	    return pairs;
	}

	// Parse the `kern` table which contains kerning pairs.
	function parseKernTable(data, start) {
	    var p = new parse.Parser(data, start);
	    var tableVersion = p.parseUShort();
	    if (tableVersion === 0) {
	        return parseWindowsKernTable(p);
	    } else if (tableVersion === 1) {
	        return parseMacKernTable(p);
	    } else {
	        throw new Error('Unsupported kern table version (' + tableVersion + ').');
	    }
	}

	var kern = { parse: parseKernTable };

	// The `loca` table stores the offsets to the locations of the glyphs in the font.

	// Parse the `loca` table. This table stores the offsets to the locations of the glyphs in the font,
	// relative to the beginning of the glyphData table.
	// The number of glyphs stored in the `loca` table is specified in the `maxp` table (under numGlyphs)
	// The loca table has two versions: a short version where offsets are stored as uShorts, and a long
	// version where offsets are stored as uLongs. The `head` table specifies which version to use
	// (under indexToLocFormat).
	function parseLocaTable(data, start, numGlyphs, shortVersion) {
	    var p = new parse.Parser(data, start);
	    var parseFn = shortVersion ? p.parseUShort : p.parseULong;
	    // There is an extra entry after the last index element to compute the length of the last glyph.
	    // That's why we use numGlyphs + 1.
	    var glyphOffsets = [];
	    for (var i = 0; i < numGlyphs + 1; i += 1) {
	        var glyphOffset = parseFn.call(p);
	        if (shortVersion) {
	            // The short table version stores the actual offset divided by 2.
	            glyphOffset *= 2;
	        }

	        glyphOffsets.push(glyphOffset);
	    }

	    return glyphOffsets;
	}

	var loca = { parse: parseLocaTable };

	// opentype.js

	/**
	 * The opentype library.
	 * @namespace opentype
	 */

	// File loaders /////////////////////////////////////////////////////////
	/**
	 * Loads a font from a file. The callback throws an error message as the first parameter if it fails
	 * and the font as an ArrayBuffer in the second parameter if it succeeds.
	 * @param  {string} path - The path of the file
	 * @param  {Function} callback - The function to call when the font load completes
	 */
	function loadFromFile(path, callback) {
	    var fs = __webpack_require__(/*! fs */ "?4db5");
	    fs.readFile(path, function(err, buffer) {
	        if (err) {
	            return callback(err.message);
	        }

	        callback(null, nodeBufferToArrayBuffer(buffer));
	    });
	}
	/**
	 * Loads a font from a URL. The callback throws an error message as the first parameter if it fails
	 * and the font as an ArrayBuffer in the second parameter if it succeeds.
	 * @param  {string} url - The URL of the font file.
	 * @param  {Function} callback - The function to call when the font load completes
	 */
	function loadFromUrl(url, callback) {
	    var request = new XMLHttpRequest();
	    request.open('get', url, true);
	    request.responseType = 'arraybuffer';
	    request.onload = function() {
	        if (request.response) {
	            return callback(null, request.response);
	        } else {
	            return callback('Font could not be loaded: ' + request.statusText);
	        }
	    };

	    request.onerror = function () {
	        callback('Font could not be loaded');
	    };

	    request.send();
	}

	// Table Directory Entries //////////////////////////////////////////////
	/**
	 * Parses OpenType table entries.
	 * @param  {DataView}
	 * @param  {Number}
	 * @return {Object[]}
	 */
	function parseOpenTypeTableEntries(data, numTables) {
	    var tableEntries = [];
	    var p = 12;
	    for (var i = 0; i < numTables; i += 1) {
	        var tag = parse.getTag(data, p);
	        var checksum = parse.getULong(data, p + 4);
	        var offset = parse.getULong(data, p + 8);
	        var length = parse.getULong(data, p + 12);
	        tableEntries.push({tag: tag, checksum: checksum, offset: offset, length: length, compression: false});
	        p += 16;
	    }

	    return tableEntries;
	}

	/**
	 * Parses WOFF table entries.
	 * @param  {DataView}
	 * @param  {Number}
	 * @return {Object[]}
	 */
	function parseWOFFTableEntries(data, numTables) {
	    var tableEntries = [];
	    var p = 44; // offset to the first table directory entry.
	    for (var i = 0; i < numTables; i += 1) {
	        var tag = parse.getTag(data, p);
	        var offset = parse.getULong(data, p + 4);
	        var compLength = parse.getULong(data, p + 8);
	        var origLength = parse.getULong(data, p + 12);
	        var compression = (void 0);
	        if (compLength < origLength) {
	            compression = 'WOFF';
	        } else {
	            compression = false;
	        }

	        tableEntries.push({tag: tag, offset: offset, compression: compression,
	            compressedLength: compLength, length: origLength});
	        p += 20;
	    }

	    return tableEntries;
	}

	/**
	 * @typedef TableData
	 * @type Object
	 * @property {DataView} data - The DataView
	 * @property {number} offset - The data offset.
	 */

	/**
	 * @param  {DataView}
	 * @param  {Object}
	 * @return {TableData}
	 */
	function uncompressTable(data, tableEntry) {
	    if (tableEntry.compression === 'WOFF') {
	        var inBuffer = new Uint8Array(data.buffer, tableEntry.offset + 2, tableEntry.compressedLength - 2);
	        var outBuffer = new Uint8Array(tableEntry.length);
	        tinyInflate(inBuffer, outBuffer);
	        if (outBuffer.byteLength !== tableEntry.length) {
	            throw new Error('Decompression error: ' + tableEntry.tag + ' decompressed length doesn\'t match recorded length');
	        }

	        var view = new DataView(outBuffer.buffer, 0);
	        return {data: view, offset: 0};
	    } else {
	        return {data: data, offset: tableEntry.offset};
	    }
	}

	// Public API ///////////////////////////////////////////////////////////

	/**
	 * Parse the OpenType file data (as an ArrayBuffer) and return a Font object.
	 * Throws an error if the font could not be parsed.
	 * @param  {ArrayBuffer}
	 * @return {opentype.Font}
	 */
	function parseBuffer(buffer) {
	    var indexToLocFormat;
	    var ltagTable;

	    // Since the constructor can also be called to create new fonts from scratch, we indicate this
	    // should be an empty font that we'll fill with our own data.
	    var font = new Font({empty: true});

	    // OpenType fonts use big endian byte ordering.
	    // We can't rely on typed array view types, because they operate with the endianness of the host computer.
	    // Instead we use DataViews where we can specify endianness.
	    var data = new DataView(buffer, 0);
	    var numTables;
	    var tableEntries = [];
	    var signature = parse.getTag(data, 0);
	    if (signature === String.fromCharCode(0, 1, 0, 0) || signature === 'true' || signature === 'typ1') {
	        font.outlinesFormat = 'truetype';
	        numTables = parse.getUShort(data, 4);
	        tableEntries = parseOpenTypeTableEntries(data, numTables);
	    } else if (signature === 'OTTO') {
	        font.outlinesFormat = 'cff';
	        numTables = parse.getUShort(data, 4);
	        tableEntries = parseOpenTypeTableEntries(data, numTables);
	    } else if (signature === 'wOFF') {
	        var flavor = parse.getTag(data, 4);
	        if (flavor === String.fromCharCode(0, 1, 0, 0)) {
	            font.outlinesFormat = 'truetype';
	        } else if (flavor === 'OTTO') {
	            font.outlinesFormat = 'cff';
	        } else {
	            throw new Error('Unsupported OpenType flavor ' + signature);
	        }

	        numTables = parse.getUShort(data, 12);
	        tableEntries = parseWOFFTableEntries(data, numTables);
	    } else {
	        throw new Error('Unsupported OpenType signature ' + signature);
	    }

	    var cffTableEntry;
	    var fvarTableEntry;
	    var glyfTableEntry;
	    var gposTableEntry;
	    var gsubTableEntry;
	    var hmtxTableEntry;
	    var kernTableEntry;
	    var locaTableEntry;
	    var nameTableEntry;
	    var metaTableEntry;
	    var p;

	    for (var i = 0; i < numTables; i += 1) {
	        var tableEntry = tableEntries[i];
	        var table = (void 0);
	        switch (tableEntry.tag) {
	            case 'cmap':
	                table = uncompressTable(data, tableEntry);
	                font.tables.cmap = cmap.parse(table.data, table.offset);
	                font.encoding = new CmapEncoding(font.tables.cmap);
	                break;
	            case 'cvt ' :
	                table = uncompressTable(data, tableEntry);
	                p = new parse.Parser(table.data, table.offset);
	                font.tables.cvt = p.parseShortList(tableEntry.length / 2);
	                break;
	            case 'fvar':
	                fvarTableEntry = tableEntry;
	                break;
	            case 'fpgm' :
	                table = uncompressTable(data, tableEntry);
	                p = new parse.Parser(table.data, table.offset);
	                font.tables.fpgm = p.parseByteList(tableEntry.length);
	                break;
	            case 'head':
	                table = uncompressTable(data, tableEntry);
	                font.tables.head = head.parse(table.data, table.offset);
	                font.unitsPerEm = font.tables.head.unitsPerEm;
	                indexToLocFormat = font.tables.head.indexToLocFormat;
	                break;
	            case 'hhea':
	                table = uncompressTable(data, tableEntry);
	                font.tables.hhea = hhea.parse(table.data, table.offset);
	                font.ascender = font.tables.hhea.ascender;
	                font.descender = font.tables.hhea.descender;
	                font.numberOfHMetrics = font.tables.hhea.numberOfHMetrics;
	                break;
	            case 'hmtx':
	                hmtxTableEntry = tableEntry;
	                break;
	            case 'ltag':
	                table = uncompressTable(data, tableEntry);
	                ltagTable = ltag.parse(table.data, table.offset);
	                break;
	            case 'maxp':
	                table = uncompressTable(data, tableEntry);
	                font.tables.maxp = maxp.parse(table.data, table.offset);
	                font.numGlyphs = font.tables.maxp.numGlyphs;
	                break;
	            case 'name':
	                nameTableEntry = tableEntry;
	                break;
	            case 'OS/2':
	                table = uncompressTable(data, tableEntry);
	                font.tables.os2 = os2.parse(table.data, table.offset);
	                break;
	            case 'post':
	                table = uncompressTable(data, tableEntry);
	                font.tables.post = post.parse(table.data, table.offset);
	                font.glyphNames = new GlyphNames(font.tables.post);
	                break;
	            case 'prep' :
	                table = uncompressTable(data, tableEntry);
	                p = new parse.Parser(table.data, table.offset);
	                font.tables.prep = p.parseByteList(tableEntry.length);
	                break;
	            case 'glyf':
	                glyfTableEntry = tableEntry;
	                break;
	            case 'loca':
	                locaTableEntry = tableEntry;
	                break;
	            case 'CFF ':
	                cffTableEntry = tableEntry;
	                break;
	            case 'kern':
	                kernTableEntry = tableEntry;
	                break;
	            case 'GPOS':
	                gposTableEntry = tableEntry;
	                break;
	            case 'GSUB':
	                gsubTableEntry = tableEntry;
	                break;
	            case 'meta':
	                metaTableEntry = tableEntry;
	                break;
	        }
	    }

	    var nameTable = uncompressTable(data, nameTableEntry);
	    font.tables.name = _name.parse(nameTable.data, nameTable.offset, ltagTable);
	    font.names = font.tables.name;

	    if (glyfTableEntry && locaTableEntry) {
	        var shortVersion = indexToLocFormat === 0;
	        var locaTable = uncompressTable(data, locaTableEntry);
	        var locaOffsets = loca.parse(locaTable.data, locaTable.offset, font.numGlyphs, shortVersion);
	        var glyfTable = uncompressTable(data, glyfTableEntry);
	        font.glyphs = glyf.parse(glyfTable.data, glyfTable.offset, locaOffsets, font);
	    } else if (cffTableEntry) {
	        var cffTable = uncompressTable(data, cffTableEntry);
	        cff.parse(cffTable.data, cffTable.offset, font);
	    } else {
	        throw new Error('Font doesn\'t contain TrueType or CFF outlines.');
	    }

	    var hmtxTable = uncompressTable(data, hmtxTableEntry);
	    hmtx.parse(hmtxTable.data, hmtxTable.offset, font.numberOfHMetrics, font.numGlyphs, font.glyphs);
	    addGlyphNames(font);

	    if (kernTableEntry) {
	        var kernTable = uncompressTable(data, kernTableEntry);
	        font.kerningPairs = kern.parse(kernTable.data, kernTable.offset);
	    } else {
	        font.kerningPairs = {};
	    }

	    if (gposTableEntry) {
	        var gposTable = uncompressTable(data, gposTableEntry);
	        font.tables.gpos = gpos.parse(gposTable.data, gposTable.offset);
	        font.position.init();
	    }

	    if (gsubTableEntry) {
	        var gsubTable = uncompressTable(data, gsubTableEntry);
	        font.tables.gsub = gsub.parse(gsubTable.data, gsubTable.offset);
	    }

	    if (fvarTableEntry) {
	        var fvarTable = uncompressTable(data, fvarTableEntry);
	        font.tables.fvar = fvar.parse(fvarTable.data, fvarTable.offset, font.names);
	    }

	    if (metaTableEntry) {
	        var metaTable = uncompressTable(data, metaTableEntry);
	        font.tables.meta = meta.parse(metaTable.data, metaTable.offset);
	        font.metas = font.tables.meta;
	    }

	    return font;
	}

	/**
	 * Asynchronously load the font from a URL or a filesystem. When done, call the callback
	 * with two arguments `(err, font)`. The `err` will be null on success,
	 * the `font` is a Font object.
	 * We use the node.js callback convention so that
	 * opentype.js can integrate with frameworks like async.js.
	 * @alias opentype.load
	 * @param  {string} url - The URL of the font to load.
	 * @param  {Function} callback - The callback.
	 */
	function load(url, callback) {
	    var isNode$$1 = typeof window === 'undefined';
	    var loadFn = isNode$$1 ? loadFromFile : loadFromUrl;
	    loadFn(url, function(err, arrayBuffer) {
	        if (err) {
	            return callback(err);
	        }
	        var font;
	        try {
	            font = parseBuffer(arrayBuffer);
	        } catch (e) {
	            return callback(e, null);
	        }
	        return callback(null, font);
	    });
	}

	/**
	 * Synchronously load the font from a URL or file.
	 * When done, returns the font object or throws an error.
	 * @alias opentype.loadSync
	 * @param  {string} url - The URL of the font to load.
	 * @return {opentype.Font}
	 */
	function loadSync(url) {
	    var fs = __webpack_require__(/*! fs */ "?4db5");
	    var buffer = fs.readFileSync(url);
	    return parseBuffer(nodeBufferToArrayBuffer(buffer));
	}

	exports.Font = Font;
	exports.Glyph = Glyph;
	exports.Path = Path;
	exports.BoundingBox = BoundingBox;
	exports._parse = parse;
	exports.parse = parseBuffer;
	exports.load = load;
	exports.loadSync = loadSync;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=opentype.js.map


/***/ }),

/***/ "./node_modules/worker-loader/dist/cjs.js?inline!./extensions/MSDF/GeneratorWorker.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/worker-loader/dist/cjs.js?inline!./extensions/MSDF/GeneratorWorker.js ***!
  \********************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = function() {
  return __webpack_require__(/*! !!./node_modules/worker-loader/dist/workers/InlineWorker.js */ "./node_modules/worker-loader/dist/workers/InlineWorker.js")("/*!\n * LMV v7.54.0\n *\n * Copyright 2021 Autodesk, Inc.\n * All rights reserved.\n *\n * This computer source code and related instructions and comments are the\n * unpublished confidential and proprietary information of Autodesk, Inc.\n * and are protected under Federal copyright and state trade secret law.\n * They may not be disclosed to, copied or used by any third party without\n * the prior written consent of Autodesk, Inc.\n *\n * Autodesk Forge Viewer Usage Limitations:\n *\n * The Autodesk Forge Viewer JavaScript must be delivered from an\n * Autodesk-hosted URL.\n */\n/******/ (() => { // webpackBootstrap\n/******/ \t\"use strict\";\n/******/ \tvar __webpack_modules__ = ({\n\n/***/ \"./extensions/MSDF/Bitmap.js\":\n/*!***********************************!*\\\n  !*** ./extensions/MSDF/Bitmap.js ***!\n  \\***********************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Bitmap\": () => (/* binding */ Bitmap)\n/* harmony export */ });\n/* harmony import */ var _Math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Math */ \"./extensions/MSDF/Math.js\");\n\n\nfunction Bitmap(width, height) {\n  // RGB float texture\n  var data = new Float32Array(width * height * 3);\n\n  this.width = width;\n  this.height = height;\n  this.positivePoint = 0;\n  this.negativePoint = 0;\n  this.positiveValue = 0;\n  this.negativeValue = 0;\n\n  this.set = function (x, y, offset, value) {\n    var index = width * 3 * y + x * 3 + offset;\n    data[index] = value;\n  };\n\n\n  this.setRGB = function (x, y, value) {\n    var index = width * 3 * y + x * 3;\n    data[index++] = value[0];\n    data[index++] = value[1];\n    data[index++] = value[2];\n\n    var m = (0,_Math__WEBPACK_IMPORTED_MODULE_0__.median)(value[0], value[1], value[2]);\n    if (m >= 0 && m < 0.5) {\n      this.negativePoint++;\n      this.negativeValue += m;\n    } else if (m >= 0.5) {\n      this.positivePoint++;\n      this.positiveValue += m;\n    }\n  };\n\n  this.get = function (x, y) {\n    var index = width * 3 * y + x * 3;\n    return {\n      r: data[index++],\n      g: data[index++],\n      b: data[index++] };\n\n  };\n\n  this.getRaw = function (x, y) {\n    var index = width * 3 * y + x * 3;\n    return [\n    data[index++],\n    data[index++],\n    data[index++]];\n\n  };\n\n  this.getData = function () {\n    return data;\n  };\n\n\n  this.convert = function (x, y, distance, range) {\n    var values = [\n    distance.r / range + 0.5,\n    distance.g / range + 0.5,\n    distance.b / range + 0.5];\n\n\n    this.setRGB(x, y, values);\n  };\n\n  this.reset = function () {\n    data = new Float32Array(width * height * 3);\n  };\n\n  function clamp(v, boostValue) {\n    v += boostValue;\n\n    if (v >= 255) {\n      return 255;\n    } else if (v <= 0) {\n      return 0;\n    } else {\n      return Math.round(v);\n    }\n  }\n\n  this.getDrawingData = function (width, height) {var flipY = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;var range = arguments.length > 3 ? arguments[3] : undefined;var char = arguments.length > 4 ? arguments[4] : undefined;\n    // special logic for those very thin stroke\n    var boostValue = 0;\n    // console.log(\"statistics_\" + char, this.positivePoint/ this.negativePoint, this.positiveValue/ this.negativeValue);\n    var threshold = 1 / range;\n    if (this.positivePoint / this.negativePoint < threshold) {\n      boostValue = 0.4 / range * 255;\n    }\n\n    var imageData = new Uint8ClampedArray(width * height * 4);\n    var y1;\n    for (var x = 0; x < width; x++) {\n      for (var y = 0; y < height; y++) {\n        y1 = flipY ? height - y - 1 : y;\n        var index = (y1 * this.width + x) * 3;\n        var index1 = (y * width + x) * 4;\n\n        imageData[index1++] = clamp(data[index++] * 255, boostValue);\n        imageData[index1++] = clamp(data[index++] * 255, boostValue);\n        imageData[index1++] = clamp(data[index++] * 255, boostValue);\n        imageData[index1++] = 255;\n      }\n    }\n\n    return {\n      binData: imageData,\n      width: width,\n      height: height };\n\n  };\n\n  this.draw = function (canvas, width, height) {\n    canvas = canvas || document.createElement(\"canvas\");\n    canvas.width = width;\n    canvas.height = height;\n\n    var imageData = this.getDrawingData(width, height);\n    var ctx = canvas.getContext(\"2d\");\n\n    ctx.putImageData(imageData, 0, 0);\n    canvas.toBlob(function (blob) {\n      var url = URL.createObjectURL(blob);\n      document.getElementById(\"sample\").setAttribute(\"src\", url);\n    }, \"image/png\");\n  };\n}\n\n\n\n/***/ }),\n\n/***/ \"./extensions/MSDF/Contour.js\":\n/*!************************************!*\\\n  !*** ./extensions/MSDF/Contour.js ***!\n  \\************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Contour\": () => (/* binding */ Contour)\n/* harmony export */ });\n/* harmony import */ var _Math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Math */ \"./extensions/MSDF/Math.js\");\n/* harmony import */ var _Vector2__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Vector2 */ \"./extensions/MSDF/Vector2.js\");\n\n\n\n\nvar Contour = function Contour() {\n\n  var edges = (0,_Math__WEBPACK_IMPORTED_MODULE_0__.createArray)();\n\n  this.addEdge = function (edge) {\n    edges.push(edge);\n  };\n\n  /**\n      * https://stackoverflow.com/questions/14505565/detect-if-a-set-of-points-in-an-array-that-are-the-vertices-of-a-complex-polygon\n      */\n  this.winding = function () {\n    if (edges.empty()) {\n      return 0;\n    }\n\n    var total = 0;\n    if (edges.size() == 1) {\n      var a = edges[0].point(0),b = edges[0].point(1 / 3.),c = edges[0].point(2 / 3.);\n      total += (0,_Math__WEBPACK_IMPORTED_MODULE_0__.shoelace)(a, b);\n      total += (0,_Math__WEBPACK_IMPORTED_MODULE_0__.shoelace)(b, c);\n      total += (0,_Math__WEBPACK_IMPORTED_MODULE_0__.shoelace)(c, a);\n    } else if (edges.size() == 2) {\n      var _a = edges[0].point(0),_b = edges[0].point(.5),_c = edges[1].point(0),d = edges[1].point(.5);\n      total += (0,_Math__WEBPACK_IMPORTED_MODULE_0__.shoelace)(_a, _b);\n      total += (0,_Math__WEBPACK_IMPORTED_MODULE_0__.shoelace)(_b, _c);\n      total += (0,_Math__WEBPACK_IMPORTED_MODULE_0__.shoelace)(_c, d);\n      total += (0,_Math__WEBPACK_IMPORTED_MODULE_0__.shoelace)(d, _a);\n    } else {\n      var prev = edges.back().point(0);\n\n      for (var i = 0; i < edges.length; i++) {\n        var edge = edges[i];\n        var cur = edge.point(0);\n        total += (0,_Math__WEBPACK_IMPORTED_MODULE_0__.shoelace)(prev, cur);\n        prev = cur;\n      }\n    }\n    return total;\n  };\n\n  this.inverseY = function () {\n    var yVector = new _Vector2__WEBPACK_IMPORTED_MODULE_1__.Vector2(1, -1);\n    for (var i = 0; i < edges.length; i++) {\n      var edge = edges[i];\n      for (var j = 0; j < edge.p.length; j++) {\n        edge.p[j].multiply(yVector);\n      }\n    }\n  };\n\n  this.edges = edges;\n};\n\n\n\n/***/ }),\n\n/***/ \"./extensions/MSDF/EdgeColor.js\":\n/*!**************************************!*\\\n  !*** ./extensions/MSDF/EdgeColor.js ***!\n  \\**************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"BLACK\": () => (/* binding */ BLACK),\n/* harmony export */   \"RED\": () => (/* binding */ RED),\n/* harmony export */   \"GREEN\": () => (/* binding */ GREEN),\n/* harmony export */   \"YELLOW\": () => (/* binding */ YELLOW),\n/* harmony export */   \"BLUE\": () => (/* binding */ BLUE),\n/* harmony export */   \"MAGENTA\": () => (/* binding */ MAGENTA),\n/* harmony export */   \"CYAN\": () => (/* binding */ CYAN),\n/* harmony export */   \"WHITE\": () => (/* binding */ WHITE)\n/* harmony export */ });\nvar BLACK = 0,\nRED = 1,\nGREEN = 2,\nYELLOW = 3,\nBLUE = 4,\nMAGENTA = 5,\nCYAN = 6,\nWHITE = 7;\n\n\n\n/***/ }),\n\n/***/ \"./extensions/MSDF/Edges.js\":\n/*!**********************************!*\\\n  !*** ./extensions/MSDF/Edges.js ***!\n  \\**********************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"LinearSegment\": () => (/* binding */ LinearSegment),\n/* harmony export */   \"QuadraticSegment\": () => (/* binding */ QuadraticSegment),\n/* harmony export */   \"CubicSegment\": () => (/* binding */ CubicSegment),\n/* harmony export */   \"EdgeSegment\": () => (/* binding */ EdgeSegment)\n/* harmony export */ });\n/* harmony import */ var _EdgeColor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EdgeColor */ \"./extensions/MSDF/EdgeColor.js\");\n/* harmony import */ var _Math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Math */ \"./extensions/MSDF/Math.js\");\n/* harmony import */ var _SignedDistance__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SignedDistance */ \"./extensions/MSDF/SignedDistance.js\");\n\n\n\n\n\n\n\nvar fabs = Math.abs;\nvar MSDFGEN_CUBIC_SEARCH_STARTS = 4;\nvar MSDFGEN_CUBIC_SEARCH_STEPS = 4;\n\n\nvar EdgeSegment = function EdgeSegment(color) {\n  this.p = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.createArray)();\n  this.color = color || _EdgeColor__WEBPACK_IMPORTED_MODULE_0__.WHITE;\n};\n\nEdgeSegment.prototype.point = function (param) {\n  console.error(\"Interface\", \"Point\");\n};\n\nEdgeSegment.prototype.clone = function () {\n  console.error(\"Interface\", \"clone\");\n};\n\nEdgeSegment.prototype.direction = function (param) {\n  console.error(\"Interface\", \"direction\");\n};\n\nEdgeSegment.prototype.scanlineIntersections = function (xArray, dyArray, y) {\n  console.error(\"Interface\", \"scanlineIntersections\");\n};\n\nEdgeSegment.prototype.distanceToPseudoDistance = function (distance, origin, param) {\n  if (param < 0) {\n    var dir = this.direction(0).normalize();\n    var aq = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(origin, this.point(0));\n    var ts = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(aq, dir);\n    if (ts < 0) {\n      var pseudoDistance = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)(aq, dir);\n      if (fabs(pseudoDistance) <= fabs(distance.distance)) {\n        distance.distance = pseudoDistance;\n        distance.dot = 0;\n      }\n    }\n  } else if (param > 1) {\n    var _dir = this.direction(1).normalize();\n    var bq = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(origin, this.point(1));\n    var _ts = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(bq, _dir);\n    if (_ts > 0) {\n      var _pseudoDistance = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)(bq, _dir);\n      if (fabs(_pseudoDistance) <= fabs(distance.distance)) {\n        distance.distance = _pseudoDistance;\n        distance.dot = 0;\n      }\n    }\n  }\n};\n\nEdgeSegment.prototype.debug = function (mainPath) {\n  var result;\n  if (mainPath) {\n    result = \"\".concat(mainPath, \".\");\n  } else {\n    result = \"var myPath = new CompoundPath();\\nmyPath.strokeColor = 'black';\\nmyPath.moveTo(new Point(\".concat(\n\n    this.p[0].x, \", \").concat(this.p[0].y, \"));\\nmyPath.\");\n\n  }\n\n  if (this.p.length == 2) {\n    result += \"lineTo(new Point(\".concat(this.p[1].x, \", \").concat(this.p[1].y, \"));\\n\");\n  } else if (this.p.length == 3) {\n    result += \"quadraticCurveTo(new Point(\".concat(this.p[1].x, \", \").concat(this.p[1].y, \"), new Point(\").concat(this.p[2].x, \", \").concat(this.p[2].y, \"));\\n\");\n  } else if (this.p.length == 4) {\n    result += \"cubicCurveTo(new Point(\".concat(this.p[1].x, \", \").concat(this.p[1].y, \"), new Point(\").concat(this.p[2].x, \", \").concat(this.p[2].y, \"), new Point(\").concat(this.p[3].x, \", \").concat(this.p[3].y, \"));\\n\");\n  }\n\n  return result;\n};\n\n/**\n    * LinearSegment\n    * @param {*} p0 \n    * @param {*} p1 \n    */\nvar LinearSegment = function LinearSegment(p0, p1, color) {\n  EdgeSegment.call(this, color);\n  var p = this.p;\n\n  p[0] = p0;\n  p[1] = p1;\n};\n\nLinearSegment.prototype = Object.create(EdgeSegment.prototype);\nLinearSegment.prototype.constructor = LinearSegment;\n\nLinearSegment.prototype.point = function (param) {\n  var p = this.p;\n  return (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[0], p[1], param);\n};\n\nLinearSegment.prototype.clone = function () {\n  var p = this.p;\n  return new LinearSegment(p[0].clone(), p[1].clone(), this.color);\n};\n\nLinearSegment.prototype.direction = function () {\n  var p = this.p;\n  return (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[1], p[0]);\n};\n\nLinearSegment.prototype.signedDistance = function (origin) {\n  var p = this.p;\n  var aq = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(origin, p[0]);\n  var ab = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[1], p[0]);\n\n  var param = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(aq, ab) / (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(ab, ab);\n  var index = param > 0.5 ? 1 : 0;\n  var eq = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[index], origin);\n  var endpointDistance = eq.length();\n\n  if (param > 0 && param < 1) {\n    var orthoDistance = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(ab.getOrthonormal(false), aq);\n    if (fabs(orthoDistance) < endpointDistance) {\n      return new _SignedDistance__WEBPACK_IMPORTED_MODULE_2__.SignedDistance(orthoDistance, 0, param);\n    }\n  }\n  return new _SignedDistance__WEBPACK_IMPORTED_MODULE_2__.SignedDistance((0,_Math__WEBPACK_IMPORTED_MODULE_1__.nonZeroSign)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)(aq, ab)) * endpointDistance,\n  fabs((0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(ab.normalizeExt(), eq.normalizeExt())),\n  param);\n};\n\n/**\n    * @param {Float[3]} x,\n    * @param {Int[3]} dy,\n    * @param {float} y\n    */\nLinearSegment.prototype.scanlineIntersections = function (x, dy, y) {\n  var p = this.p;\n  if (y >= p[0].y && y < p[1].y || y >= p[1].y && y < p[0].y) {\n    var param = (y - p[0].y) / (p[1].y - p[0].y);\n    x[0] = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mixFloat)(p[0].x, p[1].x, param);\n    dy[0] = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.sign)(p[1].y - p[0].y);\n    return 1;\n  }\n  return 0;\n};\n\nLinearSegment.prototype.bounds = function (bounds) {\n  var p = this.p;\n\n  bounds.update(p[0]);\n  bounds.update(p[1]);\n};\n\nLinearSegment.prototype.moveStartPoint = function (to) {\n  var p = this.p;\n\n  p[0] = to;\n};\n\nLinearSegment.prototype.moveEndPoint = function (to) {\n  var p = this.p;\n\n  p[1] = to;\n};\n\nLinearSegment.prototype.splitInThirds = function (parts) {\n  var p = this.p;\n\n  parts[0] = new LinearSegment(p[0], this.point(1 / 3.), this.color);\n  parts[1] = new LinearSegment(this.point(1 / 3.), this.point(2 / 3.), this.color);\n  parts[2] = new LinearSegment(this.point(2 / 3.), p[1], this.color);\n};\n\n\n/**\n    * QuadraticSegment\n    * @param {*} p0 \n    * @param {*} p1 \n    * @param {*} p2 \n    */\nvar QuadraticSegment = function QuadraticSegment(p0, p1, p2, color) {\n  EdgeSegment.call(this, color);\n  var p = this.p;\n  if (p1.equals(p0) || p1.equals(p2)) {\n    p1.x = (p0.x + p2.x) * 0.5;\n    p1.y = (p0.y + p2.y) * 0.5;\n  }\n  p[0] = p0;\n  p[1] = p1;\n  p[2] = p2;\n};\n\nQuadraticSegment.prototype = Object.create(EdgeSegment.prototype);\nQuadraticSegment.prototype.constructor = QuadraticSegment;\n\nQuadraticSegment.prototype.point = function (param) {\n  var p = this.p;\n  return (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[0], p[1], param), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[1], p[2], param), param);\n};\n\nQuadraticSegment.prototype.clone = function () {\n  var p = this.p;\n  return new QuadraticSegment(p[0].clone(), p[1].clone(), p[2].clone(), this.color);\n};\n\nQuadraticSegment.prototype.direction = function (param) {\n  var p = this.p;\n  var tangent = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[1], p[0]), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]), param);\n  if (tangent.isEmtpy()) {\n    return (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[0]);\n  }\n  return tangent;\n};\n\nQuadraticSegment.prototype.signedDistance = function (origin) {\n  var p = this.p;\n  var qa = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[0], origin);\n  var ab = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[1], p[0]);\n  var br = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]).sub(ab);\n\n  var a = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(br, br);\n  var b = 3 * (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(ab, br);\n  var c = 2 * (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(ab, ab) + (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(qa, br);\n  var d = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(qa, ab);\n\n  var t = [];\n  var solutions = Math.round((0,_Math__WEBPACK_IMPORTED_MODULE_1__.solveCubic)(t, a, b, c, d));\n  var epDir = this.direction(0);\n  var minDistance = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.nonZeroSign)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)(epDir, qa)) * qa.length(); // distance from A\n  var param = -(0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(qa, epDir) / (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(epDir, epDir);\n  {\n    epDir = this.direction(1);\n    var distance = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.nonZeroSign)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)(epDir, (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], origin))) * (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], origin).length(); // distance from B\n    if (fabs(distance) < fabs(minDistance)) {\n      minDistance = distance;\n      param = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(origin, p[1]), epDir) / (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(epDir, epDir);\n    }\n  }\n  for (var i = 0; i < solutions; ++i) {\n    if (t[i] > 0 && t[i] < 1) {\n      var qe = p[0].clone().\n      add(ab.clone().multiplyScalar(2 * t[i])).\n      add(br.clone().multiplyScalar(t[i] * t[i])).\n      sub(origin);\n\n      var _distance = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.nonZeroSign)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[0]), qe)) * qe.length();\n      if (fabs(_distance) <= fabs(minDistance)) {\n        minDistance = _distance;\n        param = t[i];\n      }\n    }\n  }\n\n  if (param >= 0 && param <= 1) {\n    return new _SignedDistance__WEBPACK_IMPORTED_MODULE_2__.SignedDistance(minDistance, 0, param);\n  } else if (param < 0.5) {\n    return new _SignedDistance__WEBPACK_IMPORTED_MODULE_2__.SignedDistance(minDistance, fabs((0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(this.direction(0).normalize(), qa.normalize())), param);\n  } else {\n    return new _SignedDistance__WEBPACK_IMPORTED_MODULE_2__.SignedDistance(minDistance, fabs((0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(this.direction(1).normalize(), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], origin).normalize())), param);\n  }\n};\n\nQuadraticSegment.prototype.scanlineIntersections = function (x, dy, y) {\n  var total = 0;\n  var p = this.p;\n  var nextDY = y > p[0].y ? 1 : -1;\n  x[total] = p[0].x;\n  if (p[0].y == y) {\n    if (p[0].y < p[1].y || p[0].y == p[1].y && p[0].y < p[2].y)\n    dy[total++] = 1;else\n\n    nextDY = 1;\n  }\n  {\n    var ab = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[1], p[0]);\n    var br = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]).sub(ab);\n    var t = [];\n    var solutions = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.solveQuadratic)(t, br.y, 2 * ab.y, p[0].y - y);\n\n    // Sort solutions\n    var tmp;\n    if (solutions >= 2 && t[0] > t[1])\n    tmp = t[0], t[0] = t[1], t[1] = tmp;\n    for (var i = 0; i < solutions && total < 2; ++i) {\n      if (t[i] > 0 && t[i] < 1) {\n        x[total] = p[0].x + 2 * t[i] * ab.x + t[i] * t[i] * br.x;\n        if (nextDY * (ab.y + t[i] * br.y) >= 0) {\n          dy[total++] = nextDY;\n          nextDY = -nextDY;\n        }\n      }\n    }\n  }\n  if (p[2].y == y) {\n    if (nextDY > 0 && total > 0) {\n      --total;\n      nextDY = -1;\n    }\n    if ((p[2].y < p[1].y || p[2].y == p[1].y && p[2].y < p[0].y) && total < 2) {\n      x[total] = p[2].x;\n      if (nextDY < 0) {\n        dy[total++] = -1;\n        nextDY = 1;\n      }\n    }\n  }\n  if (nextDY != (y >= p[2].y ? 1 : -1)) {\n    if (total > 0)\n    --total;else\n\n    dy[total++] = nextDY;\n  }\n  return total;\n};\n\nQuadraticSegment.prototype.bounds = function (bounds) {\n  var p = this.p;\n  bounds.update(p[0]);\n  bounds.update(p[2]);\n\n  var bot = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[1], p[0]).sub((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]));\n  if (bot.x) {\n    var param = (p[1].x - p[0].x) / bot.x;\n    if (param > 0 && param < 1) {\n      bounds.update(this.point(param));\n    }\n  }\n  if (bot.y) {\n    var _param = (p[1].y - p[0].y) / bot.y;\n    if (_param > 0 && _param < 1) {\n      bounds.update(this.point(_param));\n    }\n  }\n};\n\nQuadraticSegment.prototype.moveStartPoint = function (to) {\n  var p = this.p;\n\n  var origSDir = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[0], p[1]);\n  var origP1 = p[1].clone();\n  var w = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[0], p[1]), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(to, p[0])) / (0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[0], p[1]), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]));\n  p[1].add((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]).multiplyScalar(w));\n  p[0] = to.clone();\n  if ((0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(origSDir, (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[0], p[1])) < 0) {\n    p[1] = origP1;\n  }\n};\n\nQuadraticSegment.prototype.moveEndPoint = function (to) {\n  var p = this.p;\n\n  var origEDir = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]);\n  var origP1 = p[1].clone();\n  var w = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(to, p[2])) / (0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[0], p[1]));\n  p[1].add((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[0], p[1]).multiplyScalar(w));\n  p[2] = to;\n  if ((0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(origEDir, (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1])) < 0) {\n    p[1] = origP1;\n  }\n};\n\nQuadraticSegment.prototype.splitInThirds = function (parts) {\n  var p = this.p;\n\n  parts[0] = new QuadraticSegment(p[0], (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[0], p[1], 1 / 3.), this.point(1 / 3.), this.color);\n  parts[1] = new QuadraticSegment(this.point(1 / 3.), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[0], p[1], 5 / 9.), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[1], p[2], 4 / 9.), .5), this.point(2 / 3.), this.color);\n  parts[2] = new QuadraticSegment(this.point(2 / 3.), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[1], p[2], 2 / 3.), p[2], this.color);\n};\n\n\nvar CubicSegment = function CubicSegment(p0, p1, p2, p3, color) {\n  EdgeSegment.call(this, color);\n  var p = this.p;\n  p[0] = p0;\n  p[1] = p1;\n  p[2] = p2;\n  p[3] = p3;\n};\n\nCubicSegment.prototype = Object.create(EdgeSegment.prototype);\nCubicSegment.prototype.constructor = CubicSegment;\n\nCubicSegment.prototype.point = function (param) {\n  var p = this.p;\n  var p12 = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[1], p[2], param);\n  return (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[0], p[1], param), p12, param), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p12, (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[2], p[3], param), param), param);\n};\n\nCubicSegment.prototype.clone = function () {\n  var p = this.p;\n  return new CubicSegment(p[0].clone(), p[1].clone(), p[2].clone(), p[3].clone(), this.color);\n};\n\nCubicSegment.prototype.direction = function (param) {\n  var p = this.p;\n\n  var tangent1 = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[1], p[0]), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]), param);\n  var tangent2 = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[3], p[2]), param);\n  var tangent = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(tangent1, tangent2, param);\n\n  if (tangent.isEmtpy()) {\n    if (param == 0) return (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[0]);\n    if (param == 1) return (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[3], p[1]);\n  }\n  return tangent;\n};\n\nCubicSegment.prototype.signedDistance = function (origin) {\n  var p = this.p;\n  var qa = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[0], origin);\n  var ab = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[1], p[0]);\n  var br = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]).sub(ab);\n  var as = p[3].clone().sub(p[2]).sub(p[2]).add(p[1]).sub(br);\n\n  var epDir = this.direction(0);\n  var minDistance = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.nonZeroSign)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)(epDir, qa)) * qa.length(); // distance from A\n  var param = -(0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(qa, epDir) / (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(epDir, epDir);\n  {\n    epDir = this.direction(1);\n    var distance = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.nonZeroSign)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)(epDir, (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[3], origin))) * (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[3], origin).length(); // distance from B\n    if (fabs(distance) < fabs(minDistance)) {\n      minDistance = distance;\n      param = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(epDir, (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[3], origin)), epDir) / (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(epDir, epDir);\n    }\n  }\n  // Iterative minimum distance search\n  for (var i = 0; i <= MSDFGEN_CUBIC_SEARCH_STARTS; ++i) {\n    var t = i / MSDFGEN_CUBIC_SEARCH_STARTS;\n    for (var step = 0;; ++step) {\n      var qe = p[0].clone().\n      add(ab.clone().multiplyScalar(3 * t)).\n      add(br.clone().multiplyScalar(3 * t * t)).\n      add(as.clone().multiplyScalar(t * t * t)).\n      sub(origin); // do not simplify with qa !!!\n\n      var _distance2 = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.nonZeroSign)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)(this.direction(t), qe)) * qe.length();\n      if (fabs(_distance2) < fabs(minDistance)) {\n        minDistance = _distance2;\n        param = t;\n      }\n      if (step == MSDFGEN_CUBIC_SEARCH_STEPS)\n      break;\n      // Improve t\n      var d1 = as.clone().multiplyScalar(3 * t * t).\n      add(br.clone().multiplyScalar(6 * t)).\n      add(ab.clone().multiplyScalar(3));\n      var d2 = as.clone().multiplyScalar(6 * t).\n      add(br.clone().multiplyScalar(6));\n      t -= (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(qe, d1) / ((0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(d1, d1) + (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(qe, d2));\n      if (t < 0 || t > 1)\n      break;\n    }\n  }\n\n  if (param >= 0 && param <= 1)\n  return new _SignedDistance__WEBPACK_IMPORTED_MODULE_2__.SignedDistance(minDistance, 0, param);\n  if (param < .5)\n  return new _SignedDistance__WEBPACK_IMPORTED_MODULE_2__.SignedDistance(minDistance, fabs((0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(this.direction(0).normalize(), qa.normalize())), param);else\n\n  return new _SignedDistance__WEBPACK_IMPORTED_MODULE_2__.SignedDistance(minDistance, fabs((0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(this.direction(1).normalizeExt(), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[3], origin).normalizeExt())), param);\n};\n\n\nCubicSegment.prototype.scanlineIntersections = function (x, dy, y) {\n  var total = 0;\n  var p = this.p;\n  var nextDY = y > p[0].y ? 1 : -1;\n  x[total] = p[0].x;\n  if (p[0].y == y) {\n    if (p[0].y < p[1].y || p[0].y == p[1].y && (p[0].y < p[2].y || p[0].y == p[2].y && p[0].y < p[3].y))\n    dy[total++] = 1;else\n\n    nextDY = 1;\n  }\n  {\n    var ab = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[1], p[0]);\n    var br = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]).sub(ab);\n    var as = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[3], p[2]).sub((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1])).sub(br);\n    var t = [];\n    var solutions = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.solveCubic)(t, as.y, 3 * br.y, 3 * ab.y, p[0].y - y);\n\n    // Sort solutions\n    var tmp;\n    if (solutions >= 2) {\n      if (t[0] > t[1])\n      tmp = t[0], t[0] = t[1], t[1] = tmp;\n      if (solutions >= 3 && t[1] > t[2]) {\n        tmp = t[1], t[1] = t[2], t[2] = tmp;\n        if (t[0] > t[1])\n        tmp = t[0], t[0] = t[1], t[1] = tmp;\n      }\n    }\n    for (var i = 0; i < solutions && total < 3; ++i) {\n      if (t[i] > 0 && t[i] < 1) {\n        x[total] = p[0].x + 3 * t[i] * ab.x + 3 * t[i] * t[i] * br.x + t[i] * t[i] * t[i] * as.x;\n        if (nextDY * (ab.y + 2 * t[i] * br.y + t[i] * t[i] * as.y) >= 0) {\n          dy[total++] = nextDY;\n          nextDY = -nextDY;\n        }\n      }\n    }\n  }\n  if (p[3].y == y) {\n    if (nextDY > 0 && total > 0) {\n      --total;\n      nextDY = -1;\n    }\n    if ((p[3].y < p[2].y || p[3].y == p[2].y && (p[3].y < p[1].y || p[3].y == p[1].y && p[3].y < p[0].y)) && total < 3) {\n      x[total] = p[3].x;\n      if (nextDY < 0) {\n        dy[total++] = -1;\n        nextDY = 1;\n      }\n    }\n  }\n  if (nextDY != (y >= p[3].y ? 1 : -1)) {\n    if (total > 0)\n    --total;else\n\n    dy[total++] = nextDY;\n  }\n  return total;\n};\n\n\nCubicSegment.prototype.bounds = function (bounds) {\n  var p = this.p;\n\n  bounds.update(p[0]);\n  bounds.update(p[3]);\n\n  var a0 = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[1], p[0]);\n  var a1 = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[2], p[1]).sub(a0).multiplyScalar(2);\n  var a2 = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p[3], p[2].clone().multiplyScalar(3)).\n  add(p[1].clone().multiplyScalar(3)).\n  sub(p[0]);\n  var params;\n  var solutions = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.solveQuadratic)(params, a2.x, a1.x, a0.x);\n  for (var i = 0; i < solutions; ++i) {\n    if (params[i] > 0 && params[i] < 1) {\n      bounds.update(this.point(params[i]));\n    }\n  }\n\n  solutions = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.solveQuadratic)(params, a2.y, a1.y, a0.y);\n  for (var _i = 0; _i < solutions; ++_i) {\n    if (params[_i] > 0 && params[_i] < 1) {\n      bounds.update(this.point(params[_i]));\n    }\n  }\n};\n\nCubicSegment.prototype.moveStartPoint = function (to) {\n  var p = this.p;\n\n  p[1].add((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(to, p[0]));\n  p[0] = to;\n};\n\nCubicSegment.prototype.moveEndPoint = function (to) {\n  var p = this.p;\n\n  p[2].add((0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(to, p[3]));\n  p[3] = to;\n};\n\n\nCubicSegment.prototype.splitInThirds = function (parts) {\n  var p = this.p;\n  var color = this.color;\n\n  parts[0] = new CubicSegment(p[0], p[0].equals(p[1]) ? p[0] : (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[0], p[1], 1 / 3.),\n  (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[0], p[1], 1 / 3.), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[1], p[2], 1 / 3.), 1 / 3.), this.point(1 / 3.), color);\n  parts[1] = new CubicSegment(this.point(1 / 3.),\n  (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[0], p[1], 1 / 3.), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[1], p[2], 1 / 3.), 1 / 3.),\n  (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[1], p[2], 1 / 3.), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[2], p[3], 1 / 3.), 1 / 3.), 2 / 3.),\n  (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[0], p[1], 2 / 3.), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[1], p[2], 2 / 3.), 2 / 3.), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[1], p[2], 2 / 3.), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[2], p[3], 2 / 3.), 2 / 3.), 1 / 3.),\n  this.point(2 / 3.), color);\n  parts[2] = new CubicSegment(this.point(2 / 3.),\n  (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)((0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[1], p[2], 2 / 3.), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[2], p[3], 2 / 3.), 2 / 3.), p[2].equals(p[3]) ? p[3] : (0,_Math__WEBPACK_IMPORTED_MODULE_1__.mix)(p[2], p[3], 2 / 3.),\n  p[3], color);\n};\n\n\n\n/***/ }),\n\n/***/ \"./extensions/MSDF/MSDF.js\":\n/*!*********************************!*\\\n  !*** ./extensions/MSDF/MSDF.js ***!\n  \\*********************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"MSDF\": () => (/* binding */ MSDF),\n/* harmony export */   \"Bitmap\": () => (/* reexport safe */ _Bitmap__WEBPACK_IMPORTED_MODULE_3__.Bitmap),\n/* harmony export */   \"Vector2\": () => (/* reexport safe */ _Vector2__WEBPACK_IMPORTED_MODULE_2__.Vector2)\n/* harmony export */ });\n/* harmony import */ var _EdgeColor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EdgeColor */ \"./extensions/MSDF/EdgeColor.js\");\n/* harmony import */ var _Math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Math */ \"./extensions/MSDF/Math.js\");\n/* harmony import */ var _Vector2__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Vector2 */ \"./extensions/MSDF/Vector2.js\");\n/* harmony import */ var _Bitmap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Bitmap */ \"./extensions/MSDF/Bitmap.js\");\n/* harmony import */ var _Edges__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Edges */ \"./extensions/MSDF/Edges.js\");\n/* harmony import */ var _Shape__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Shape */ \"./extensions/MSDF/Shape.js\");\n/* harmony import */ var _OverlappingContourCombiner__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./OverlappingContourCombiner */ \"./extensions/MSDF/OverlappingContourCombiner.js\");\n/* harmony import */ var _Selector__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Selector */ \"./extensions/MSDF/Selector.js\");\n/* harmony import */ var _Scanline__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Scanline */ \"./extensions/MSDF/Scanline.js\");\nfunction _createForOfIteratorHelper(o, allowArrayLike) {var it;if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) {if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") {if (it) o = it;var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e) {throw _e;}, f: F };}throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\");}var normalCompletion = true,didErr = false,err;return { s: function s() {it = o[Symbol.iterator]();}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e2) {didErr = true;err = _e2;}, f: function f() {try {if (!normalCompletion && it.return != null) it.return();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === \"string\") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === \"Object\" && o.constructor) n = o.constructor.name;if (n === \"Map\" || n === \"Set\") return Array.from(o);if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}\n\n\n\n\n\n\n\n\n\n\n\nvar fabs = Math.abs;\n\nvar MSDF = function MSDF() {\n\n};\n\n/**\n    * \n    * @param {Bitmap} output \n    * @param {Path2D} shape \n    * @param {Number} range \n    * @param {Number} scale \n    * @param {THREE.Vector2} translate \n    */\nMSDF.generate = function (output, charInfo, range) {var\n  shape = charInfo.shape,translate = charInfo.translate,width = charInfo.width,height = charInfo.height;\n  var scale = new _Vector2__WEBPACK_IMPORTED_MODULE_2__.Vector2(1, 1);\n  var contourCombiner = new _OverlappingContourCombiner__WEBPACK_IMPORTED_MODULE_6__.OverlappingContourCombiner(shape);\n  var p = new _Vector2__WEBPACK_IMPORTED_MODULE_2__.Vector2();\n\n  for (var y = 0; y < height; ++y) {\n    var row = y;\n    p.y = (y + .5) / scale.y - translate.y;\n    for (var x = 0; x < width; ++x) {\n      p.x = (x + .5) / scale.x - translate.x;\n\n      contourCombiner.reset(p);\n\n      for (var contourIndex = 0; contourIndex < shape.contours.length; contourIndex++) {\n        var contour = shape.contours[contourIndex];\n        if (!contour.edges.empty()) {\n          var edgeSelector = new _Selector__WEBPACK_IMPORTED_MODULE_7__.MultiDistanceSelector(p);\n\n          var prevEdge = contour.edges.length >= 2 ? contour.edges[contour.edges.length - 2] : contour.edges[0];\n          var curEdge = contour.edges.back();\n          for (var edgeIndex = 0; edgeIndex < contour.edges.length; edgeIndex++) {\n            var nextEdge = contour.edges[edgeIndex];\n            edgeSelector.addEdge(prevEdge, curEdge, nextEdge);\n            prevEdge = curEdge;\n            curEdge = nextEdge;\n          }\n\n          contourCombiner.setContourEdgeSelection(contourIndex, edgeSelector);\n        }\n      }\n\n      var distance = contourCombiner.distance();\n      output.convert(x, row, distance, range);\n    }\n  }\n\n  distanceSignCorrection(output, shape, scale, translate, _Scanline__WEBPACK_IMPORTED_MODULE_8__.FILL_NONZERO);\n\n  var edgeThreshold = 1.0001;\n  var threshold = new _Vector2__WEBPACK_IMPORTED_MODULE_2__.Vector2();\n  threshold.x = edgeThreshold / (scale.x * range);\n  threshold.y = edgeThreshold / (scale.y * range);\n  msdfErrorCorrection(output, threshold);\n};\n\nMSDF.loadGlyph = function (path, bounds, fontSize, distanceRange) {\n  var shape = new _Shape__WEBPACK_IMPORTED_MODULE_5__.Shape();\n\n  shape.bounds = bounds;\n\n  MSDF.parseGlyph(path, shape, fontSize);\n  shape.normalizeExt();\n  MSDF.edgeColoringSimple(shape, 3.0, 0);\n\n  var pad = distanceRange >> 1;\n  var width = Math.ceil(bounds.x2 - bounds.x1) + pad + pad;\n  var height = Math.ceil(bounds.y2 - bounds.y1) + pad + pad;\n  var xOffset = Math.ceil(-bounds.x1) + pad;\n  var yOffset = Math.ceil(-bounds.y1) + pad;\n\n  return {\n    shape: shape,\n    translate: new _Vector2__WEBPACK_IMPORTED_MODULE_2__.Vector2(xOffset, yOffset),\n    width: width,\n    height: height,\n    xOffset: xOffset,\n    yOffset: yOffset,\n    txOffset: -xOffset,\n    tyOffset: yOffset,\n    oH: bounds.y2 - bounds.y1,\n    oW: bounds.x2 - bounds.x1 };\n\n};\n\nMSDF.parseGlyph = function (path, shape) {\n  var position;\n\n  for (var i = 0; i < path.commands.length; i++) {\n    var command = path.commands[i];\n    switch (command.type) {\n      case \"M\":{\n          shape.createContour();\n          position = new _Vector2__WEBPACK_IMPORTED_MODULE_2__.Vector2(command.x, command.y);\n          break;\n        }\n\n      case \"L\":{\n          var next = new _Vector2__WEBPACK_IMPORTED_MODULE_2__.Vector2(command.x, command.y);\n          if (!next.equals(position)) {\n            shape.currentContour.addEdge(new _Edges__WEBPACK_IMPORTED_MODULE_4__.LinearSegment(position, next));\n            position = next.clone();\n          }\n          break;\n        }\n\n      case \"Q\":{\n          var _next = new _Vector2__WEBPACK_IMPORTED_MODULE_2__.Vector2(command.x, command.y);\n          var c1 = new _Vector2__WEBPACK_IMPORTED_MODULE_2__.Vector2(command.x1, command.y1);\n          shape.currentContour.addEdge(new _Edges__WEBPACK_IMPORTED_MODULE_4__.QuadraticSegment(position, c1, _next));\n          position = _next.clone();\n          break;\n        }\n\n      case \"C\":{\n          var _next2 = new _Vector2__WEBPACK_IMPORTED_MODULE_2__.Vector2(command.x, command.y);\n          var _c = new _Vector2__WEBPACK_IMPORTED_MODULE_2__.Vector2(command.x1, command.y1);\n          var c2 = new _Vector2__WEBPACK_IMPORTED_MODULE_2__.Vector2(command.x2, command.y2);\n          shape.currentContour.addEdge(new _Edges__WEBPACK_IMPORTED_MODULE_4__.CubicSegment(position, _c, c2, _next2));\n          position = _next2.clone();\n          break;\n        }\n\n      case \"Z\":{\n          // Need to close the path\n          if (shape.currentContour && shape.currentContour.edges.first()) {\n            var p = shape.currentContour.edges.first().p[0];\n            if (p && !p.equals(position)) {\n              var edge = new _Edges__WEBPACK_IMPORTED_MODULE_4__.LinearSegment(position, p);\n              shape.currentContour.addEdge(edge);\n            }\n          }\n          break;\n        }\n\n      default:\n        break;}\n\n  }\n};\n\n\n\nfunction switchColor(color, seed) {var banned = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _EdgeColor__WEBPACK_IMPORTED_MODULE_0__.BLACK;\n  var combined = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(color) & banned;\n  if (combined === _EdgeColor__WEBPACK_IMPORTED_MODULE_0__.RED || combined === _EdgeColor__WEBPACK_IMPORTED_MODULE_0__.GREEN || combined === _EdgeColor__WEBPACK_IMPORTED_MODULE_0__.BLUE) {\n    (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refset)(color, combined ^ _EdgeColor__WEBPACK_IMPORTED_MODULE_0__.WHITE);\n    return;\n  }\n  if ((0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(color) === _EdgeColor__WEBPACK_IMPORTED_MODULE_0__.BLACK || (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(color) === _EdgeColor__WEBPACK_IMPORTED_MODULE_0__.WHITE) {\n    // static const EdgeColor start[3] = { CYAN, MAGENTA, YELLOW };\n    var start = [_EdgeColor__WEBPACK_IMPORTED_MODULE_0__.CYAN, _EdgeColor__WEBPACK_IMPORTED_MODULE_0__.MAGENTA, _EdgeColor__WEBPACK_IMPORTED_MODULE_0__.YELLOW];\n    (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refset)(color, start[(0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(seed) % 3]);\n    (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refset)(seed, (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(seed) / 3);\n    return;\n  }\n  var shifted = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(color) << 1 + ((0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(seed) & 1);\n  (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refset)(color, (shifted | shifted >> 3) & _EdgeColor__WEBPACK_IMPORTED_MODULE_0__.WHITE);\n  (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refset)(seed, (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(seed) >> 1);\n}\nMSDF.switchColor = switchColor;\n\nfunction isCorner(aDir, bDir, crossThreshold) {\n  return (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(aDir, bDir) <= 0 || fabs((0,_Math__WEBPACK_IMPORTED_MODULE_1__.crossProduct)(aDir, bDir)) > crossThreshold;\n}\n\n/** Assigns colors to edges of the shape in accordance to the multi-channel distance field technique.\n  *  May split some edges if necessary.\n  *  angleThreshold specifies the maximum angle (in radians) to be considered a corner, for example 3 (~172 degrees).\n  *  Values below 1/2 PI will be treated as the external angle.\n  */\nMSDF.edgeColoringSimple = function edgeColoringSimple(shape, angleThreshold) {var _seed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;\n  var seed = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refnew)(_seed);\n  var crossThreshold = Math.sin(angleThreshold);\n  var corners = [];var _iterator = _createForOfIteratorHelper(\n  shape.contours),_step;try {for (_iterator.s(); !(_step = _iterator.n()).done;) {var contour = _step.value;\n      // Identify corners\n      corners.length = 0;\n      if (contour.edges.length > 0) {\n        var prevDirection = contour.edges.back().direction(1);\n        var index = 0;var _iterator2 = _createForOfIteratorHelper(\n        contour.edges),_step2;try {for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {var edge = _step2.value;\n            if (isCorner(prevDirection.normalize(), edge.direction(0).normalize(), crossThreshold)) {\n              corners.push(index);\n            }\n            prevDirection = edge.direction(1);\n            index++;\n          }} catch (err) {_iterator2.e(err);} finally {_iterator2.f();}\n      }\n      // Smooth contour\n      if (corners.length === 0) {var _iterator3 = _createForOfIteratorHelper(\n        contour.edges),_step3;try {for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {var _edge = _step3.value;\n            _edge.color = _EdgeColor__WEBPACK_IMPORTED_MODULE_0__.WHITE;\n          }} catch (err) {_iterator3.e(err);} finally {_iterator3.f();}\n      }\n      // \"Teardrop\" case\n      else if (corners.length === 1) {\n          var colors = [(0,_Math__WEBPACK_IMPORTED_MODULE_1__.refnew)(_EdgeColor__WEBPACK_IMPORTED_MODULE_0__.WHITE), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refnew)(_EdgeColor__WEBPACK_IMPORTED_MODULE_0__.WHITE), (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refnew)(_EdgeColor__WEBPACK_IMPORTED_MODULE_0__.WHITE)];\n          switchColor(colors[0], seed);\n          (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refset)(colors[2], (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(colors[0]));\n          switchColor(colors[2], seed);\n          var corner = corners[0];\n          if (contour.edges.length >= 3) {\n            var m = contour.edges.length;\n            for (var i = 0; i < m; ++i) {\n              contour.edges[(corner + i) % m].color = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(colors[1 + Math.floor(3 + 2.875 * i / (m - 1) - 1.4375 + .5) - 3]);\n            }\n          } else\n          if (contour.edges.length >= 1) {\n            // Less than three edge segments for three colors => edges must be split\n            var parts = [];\n            var tempParts = [];\n            contour.edges[0].splitInThirds(tempParts);\n            parts[0 + 3 * corner] = tempParts[0];\n            parts[1 + 3 * corner] = tempParts[1];\n            parts[2 + 3 * corner] = tempParts[2];\n            if (contour.edges.length >= 2) {\n              contour.edges[1].splitInThirds(tempParts);\n              parts[3 - 3 * corner] = tempParts[0];\n              parts[4 - 3 * corner] = tempParts[1];\n              parts[5 - 3 * corner] = tempParts[2];\n\n              parts[0].color = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(colors[0]);\n              parts[1].color = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(colors[0]);\n\n              parts[2].color = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(colors[1]);\n              parts[3].color = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(colors[1]);\n\n              parts[4].color = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(colors[2]);\n              parts[5].color = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(colors[2]);\n            } else\n            {\n              parts[0].color = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(colors[0]);\n              parts[1].color = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(colors[1]);\n              parts[2].color = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(colors[2]);\n            }\n            contour.edges.length = 0;\n            for (var _i = 0; parts[_i]; ++_i) {\n              contour.edges.push(parts[_i]);\n            }\n          }\n        }\n        // Multiple corners\n        else {\n            var cornerCount = corners.length;\n            var spline = 0;\n            var start = corners[0];\n            var _m = contour.edges.length;\n            var color = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refnew)(_EdgeColor__WEBPACK_IMPORTED_MODULE_0__.WHITE);\n            switchColor(color, seed);\n            var initialColor = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(color);\n            for (var _i2 = 0; _i2 < _m; ++_i2) {\n              var _index = (start + _i2) % _m;\n              if (spline + 1 < cornerCount && corners[spline + 1] === _index) {\n                ++spline;\n                switchColor(color, seed, (spline === cornerCount - 1 ? 1 : 0) * initialColor);\n              }\n              contour.edges[_index].color = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.refget)(color);\n            }\n          }\n    }} catch (err) {_iterator.e(err);} finally {_iterator.f();}\n};\n\nfunction pixelClash(a, b, threshold) {\n  // Only consider pair where both are on the inside or both are on the outside\n  var aIn = (a.r > .5 ? 1 : 0) + (a.g > .5 ? 1 : 0) + (a.b > .5 ? 1 : 0) >= 2;\n  var bIn = (b.r > .5 ? 1 : 0) + (b.g > .5 ? 1 : 0) + (b.b > .5 ? 1 : 0) >= 2;\n  if (aIn !== bIn) {\n    return false;\n  }\n  // If the change is 0 <-> 1 or 2 <-> 3 channels and not 1 <-> 1 or 2 <-> 2, it is not a clash\n  if (a.r > .5 && a.g > .5 && a.b > .5 || a.r < .5 && a.g < .5 && a.b < .5 ||\n  b.r > .5 && b.g > .5 && b.b > .5 || b.r < .5 && b.g < .5 && b.b < .5) {\n    return false;\n  }\n  // Find which color is which: _a, _b = the changing channels, _c = the remaining one\n  var aa, ab, ba, bb, ac, bc;\n  if (a.r > .5 !== b.r > .5 && a.r < .5 !== b.r < .5) {\n    aa = a.r, ba = b.r;\n    if (a.g > .5 !== b.g > .5 && a.g < .5 !== b.g < .5) {\n      ab = a.g, bb = b.g;\n      ac = a.b, bc = b.b;\n    } else\n    if (a.b > .5 !== b.b > .5 && a.b < .5 !== b.b < .5) {\n      ab = a.b, bb = b.b;\n      ac = a.g, bc = b.g;\n    } else\n    {\n      return false; // this should never happen\n    }\n  } else\n  if (a.g > .5 !== b.g > .5 && a.g < .5 !== b.g < .5 &&\n  a.b > .5 !== b.b > .5 && a.b < .5 !== b.b < .5) {\n    aa = a.g, ba = b.g;\n    ab = a.b, bb = b.b;\n    ac = a.r, bc = b.r;\n  } else\n  {\n    return false;\n  }\n  // Find if the channels are in fact discontinuous\n  return Math.abs(aa - ba) >= threshold &&\n  Math.abs(ab - bb) >= threshold &&\n  Math.abs(ac - .5) >= Math.abs(bc - .5); // Out of the pair, only flag the pixel farther from a shape edge\n}\n\nfunction msdfErrorCorrection(bitmap, threshold) {\n  var clashes = [];\n  var w = bitmap.width,h = bitmap.height;\n  for (var y = 0; y < h; ++y) {\n    for (var x = 0; x < w; ++x) {\n      if (x > 0 && pixelClash(bitmap.get(x, y), bitmap.get(x - 1, y), threshold.x) ||\n      x < w - 1 && pixelClash(bitmap.get(x, y), bitmap.get(x + 1, y), threshold.x) ||\n      y > 0 && pixelClash(bitmap.get(x, y), bitmap.get(x, y - 1), threshold.y) ||\n      y < h - 1 && pixelClash(bitmap.get(x, y), bitmap.get(x, y + 1), threshold.y)) {\n        clashes.push({ x: x, y: y });\n      }\n    }\n  }\n  for (var _i3 = 0, _clashes = clashes; _i3 < _clashes.length; _i3++) {var clash = _clashes[_i3];\n    var pixel = bitmap.get(clash.x, clash.y);\n    var med = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.median)(pixel.r, pixel.g, pixel.b);\n    bitmap.setRGB(clash.x, clash.y, [med, med, med]);\n  }\n}\n\nfunction distanceSignCorrection(sdf, shape, scale, translate, fillRule) {\n  var w = sdf.width,h = sdf.height;\n  if (!(w * h))\n  return;\n  var p = new _Vector2__WEBPACK_IMPORTED_MODULE_2__.Vector2();\n  var scanline = new _Scanline__WEBPACK_IMPORTED_MODULE_8__.Scanline();\n  var ambiguous = false;\n  var matchMap = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.createArray)();\n\n  var match = 0;\n  for (var y = 0; y < h; ++y) {\n    var row = y;\n    p.y = (y + .5) / scale.y - translate.y;\n\n    shape.scanline(scanline, p.y);\n    for (var x = 0; x < w; ++x) {\n      p.x = (x + .5) / scale.x - translate.x;\n      var fill = scanline.filled(p.x, fillRule) ? 1 : 0;\n\n\n      var msd = sdf.getRaw(x, row);\n      var sd = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.median)(msd[0], msd[1], msd[2]);\n      if (sd == .5) {\n        ambiguous = true;\n      } else\n      if ((sd > .5 ? 1 : 0) != fill) {\n        var value = [];\n        value[0] = 1. - msd[0];\n        value[1] = 1. - msd[1];\n        value[2] = 1. - msd[2];\n        sdf.setRGB(x, row, value);\n        matchMap[match] = -1;\n      } else\n      matchMap[match] = 1;\n      ++match;\n    }\n  }\n  // This step is necessary to avoid artifacts when whole shape is inverted\n  if (ambiguous) {\n    match = 0;\n    for (var _y = 0; _y < h; ++_y) {\n      var _row = _y;\n      for (var _x = 0; _x < w; ++_x) {\n        if (!matchMap[match]) {\n          var neighborMatch = 0;\n          if (_x > 0) neighborMatch += matchMap[match - 1];\n          if (_x < w - 1) neighborMatch += matchMap[match + 1];\n          if (_y > 0) neighborMatch += matchMap[match - w];\n          if (_y < h - 1) neighborMatch += matchMap[match + w];\n          if (neighborMatch < 0) {\n            var _msd = sdf.getRaw(_x, _row);\n            var _value = [];\n            _value[0] = 1 - _msd[0];\n            _value[1] = 1 - _msd[1];\n            _value[2] = 1 - _msd[2];\n            sdf.setRGB(_x, _row, _value);\n          }\n        }\n        ++match;\n      }\n    }\n  }\n}\n\n\n\n\n/***/ }),\n\n/***/ \"./extensions/MSDF/Math.js\":\n/*!*********************************!*\\\n  !*** ./extensions/MSDF/Math.js ***!\n  \\*********************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"mixFloat\": () => (/* binding */ mixFloat),\n/* harmony export */   \"mix\": () => (/* binding */ mix),\n/* harmony export */   \"sign\": () => (/* binding */ sign),\n/* harmony export */   \"nonZeroSign\": () => (/* binding */ nonZeroSign),\n/* harmony export */   \"solveCubic\": () => (/* binding */ solveCubic),\n/* harmony export */   \"solveQuadratic\": () => (/* binding */ solveQuadratic),\n/* harmony export */   \"solveCubicNormed\": () => (/* binding */ solveCubicNormed),\n/* harmony export */   \"crossProduct\": () => (/* binding */ crossProduct),\n/* harmony export */   \"dotProduct\": () => (/* binding */ dotProduct),\n/* harmony export */   \"subVectors\": () => (/* binding */ subVectors),\n/* harmony export */   \"median\": () => (/* binding */ median),\n/* harmony export */   \"shoelace\": () => (/* binding */ shoelace),\n/* harmony export */   \"refnew\": () => (/* binding */ refnew),\n/* harmony export */   \"refget\": () => (/* binding */ refget),\n/* harmony export */   \"refset\": () => (/* binding */ refset),\n/* harmony export */   \"mixInArray\": () => (/* binding */ mixInArray),\n/* harmony export */   \"createArray\": () => (/* binding */ createArray)\n/* harmony export */ });\n/* harmony import */ var _Vector2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Vector2 */ \"./extensions/MSDF/Vector2.js\");\n\nvar fabs = Math.abs;\nvar pow = Math.pow;\nvar sqrt = Math.sqrt;\nvar cos = Math.cos;\nvar acos = Math.acos;\nvar M_PI = Math.PI;\n\nfunction mixFloat(x, y, lerp) {\n  return x + (y - x) * lerp;\n}\n\nfunction mix(p0, p1, lerp) {\n  return new _Vector2__WEBPACK_IMPORTED_MODULE_0__.Vector2(\n  p0.x + lerp * (p1.x - p0.x),\n  p0.y + lerp * (p1.y - p0.y));\n\n}\n\nfunction sign(n) {\n  return n < 0 ? -1 : 0 < n ? 1 : 0;\n}\n\nfunction nonZeroSign(value) {\n  var sign = value > 0 ? 1 : 0;\n  return 2 * sign - 1;\n}\n\nfunction solveCubic(x, a, b, c, d) {\n  if (fabs(a) < 1e-14)\n  return solveQuadratic(x, b, c, d);\n  return solveCubicNormed(x, b / a, c / a, d / a);\n}\n\nfunction solveQuadratic(x, a, b, c) {\n  if (fabs(a) < 1e-14) {\n    if (fabs(b) < 1e-14) {\n      if (c == 0)\n      return -1;\n      return 0;\n    }\n    x[0] = -c / b;\n    return 1;\n  }\n  var dscr = b * b - 4 * a * c;\n  if (dscr > 0) {\n    dscr = sqrt(dscr);\n    x[0] = (-b + dscr) / (2 * a);\n    x[1] = (-b - dscr) / (2 * a);\n    return 2;\n  } else if (dscr == 0) {\n    x[0] = -b / (2 * a);\n    return 1;\n  } else\n  return 0;\n}\n\nfunction solveCubicNormed(x, a, b, c) {\n  var a2 = a * a;\n  var q = (a2 - 3 * b) / 9;\n  var r = (a * (2 * a2 - 9 * b) + 27 * c) / 54;\n  var r2 = r * r;\n  var q3 = q * q * q;\n  var A, B;\n  if (r2 < q3) {\n    var t = r / sqrt(q3);\n    if (t < -1) t = -1;\n    if (t > 1) t = 1;\n    t = acos(t);\n    a /= 3;q = -2 * sqrt(q);\n    x[0] = q * cos(t / 3) - a;\n    x[1] = q * cos((t + 2 * M_PI) / 3) - a;\n    x[2] = q * cos((t - 2 * M_PI) / 3) - a;\n    return 3;\n  } else {\n    A = -pow(fabs(r) + sqrt(r2 - q3), 1 / 3.);\n    if (r < 0) A = -A;\n    B = A == 0 ? 0 : q / A;\n    a /= 3;\n    x[0] = A + B - a;\n    x[1] = -0.5 * (A + B) - a;\n    x[2] = 0.5 * sqrt(3.) * (A - B);\n    if (fabs(x[2]) < 1e-14)\n    return 2;\n    return 1;\n  }\n}\n\n\nfunction crossProduct(p0, p1) {\n  return p0.cross(p1);\n}\n\nfunction dotProduct(p0, p1) {\n  return p0.dot(p1);\n}\n\nfunction subVectors(p0, p1) {\n  return new _Vector2__WEBPACK_IMPORTED_MODULE_0__.Vector2().subVectors(p0, p1);\n}\n\nfunction median(a, b, c) {\n  return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c));\n}\n\n/**\n   * used by ShapeUtils.js in Threejs\n   * @param {THREE.Vector2} a \n   * @param {THREE.Vector2} b \n   */\nfunction shoelace(a, b) {\n  return (b.x - a.x) * (a.y + b.y);\n}\n\nfunction refnew(val) {return [val];}\nfunction refget(ref) {return ref[0];}\nfunction refset(ref, val) {ref[0] = val;return ref;}\n\nfunction clearArray() {\n  this.length = 0;\n}\n\nfunction isEmpty() {\n  return this.length == 0;\n}\n\nfunction mixInArray(array) {\n  array.clear = clearArray.bind(array);\n  array.empty = isEmpty.bind(array);\n\n  array.size = function () {\n    return array.length;\n  };\n\n  array.back = function () {\n    return array[array.length - 1];\n  };\n\n  array.push_back = function (item) {\n    array.push(item);\n  };\n\n  array.first = function () {\n    return array[0];\n  };\n}\n\nfunction createArray() {\n  var result = [];\n  mixInArray(result);\n  return result;\n}\n\n/***/ }),\n\n/***/ \"./extensions/MSDF/OverlappingContourCombiner.js\":\n/*!*******************************************************!*\\\n  !*** ./extensions/MSDF/OverlappingContourCombiner.js ***!\n  \\*******************************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"OverlappingContourCombiner\": () => (/* binding */ OverlappingContourCombiner)\n/* harmony export */ });\n/* harmony import */ var _Math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Math */ \"./extensions/MSDF/Math.js\");\n/* harmony import */ var _Selector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Selector */ \"./extensions/MSDF/Selector.js\");\n/* harmony import */ var _SignedDistance__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./SignedDistance */ \"./extensions/MSDF/SignedDistance.js\");\n\n\n\n\nvar fabs = Math.abs;\n\n\nfunction initDistance(distance) {\n  distance.r = _SignedDistance__WEBPACK_IMPORTED_MODULE_2__.SignedDistance[Infinity];\n  distance.g = _SignedDistance__WEBPACK_IMPORTED_MODULE_2__.SignedDistance[Infinity];\n  distance.b = _SignedDistance__WEBPACK_IMPORTED_MODULE_2__.SignedDistance[Infinity];\n}\n\nfunction resolveDistance(distance) {\n  return (0,_Math__WEBPACK_IMPORTED_MODULE_0__.median)(distance.r, distance.g, distance.b);\n}\n\n\n/**\n   * \n   * @param {Contour[]} shape \n   */\nvar OverlappingContourCombiner = function OverlappingContourCombiner(shape) {\n  /**\n                                                                              * Array of Integers, 1 means clockwise, -1 means counter-clockwise\n                                                                              */\n  var windings = shape.windings;\n  var edgeSelectors = (0,_Math__WEBPACK_IMPORTED_MODULE_0__.createArray)();\n  var shapeEdgeSelector, innerEdgeSelector, outerEdgeSelector;\n\n  // console.log(windings);\n\n  shapeEdgeSelector = new _Selector__WEBPACK_IMPORTED_MODULE_1__.MultiDistanceSelector();\n  innerEdgeSelector = new _Selector__WEBPACK_IMPORTED_MODULE_1__.MultiDistanceSelector();\n  outerEdgeSelector = new _Selector__WEBPACK_IMPORTED_MODULE_1__.MultiDistanceSelector();\n\n  this.reset = function (p) {\n    shapeEdgeSelector.reset(p);\n    innerEdgeSelector.reset(p);\n    outerEdgeSelector.reset(p);\n  };\n\n  this.setContourEdgeSelection = function (i, edgeSelector) {\n    var edgeDistance = edgeSelector.distance();\n    edgeSelectors[i] = edgeSelector;\n    shapeEdgeSelector.merge(edgeSelector);\n    // counter clockwise and indicate the pint is inside\n    if (windings[i] > 0 && resolveDistance(edgeDistance) >= 0) {\n      innerEdgeSelector.merge(edgeSelector);\n    }\n    // clockwise and indicate the pint is inside\n    if (windings[i] < 0 && resolveDistance(edgeDistance) <= 0) {\n      outerEdgeSelector.merge(edgeSelector);\n    }\n  };\n\n  this.distance = function () {\n    var shapeDistance = shapeEdgeSelector.distance();\n    var innerDistance = innerEdgeSelector.distance();\n    var outerDistance = outerEdgeSelector.distance();\n    var innerScalarDistance = resolveDistance(innerDistance);\n    var outerScalarDistance = resolveDistance(outerDistance);\n    var distance = new _Selector__WEBPACK_IMPORTED_MODULE_1__.Multidistance();\n    initDistance(distance);\n    var contourCount = windings.length;\n\n    var winding = 0;\n    if (innerScalarDistance >= 0 && fabs(innerScalarDistance) <= fabs(outerScalarDistance)) {\n      distance.copy(innerDistance);\n      winding = 1;\n      for (var i = 0; i < contourCount; ++i) {\n        if (windings[i] > 0) {\n          var contourDistance = edgeSelectors[i].distance();\n          if (fabs(resolveDistance(contourDistance)) < fabs(outerScalarDistance) && resolveDistance(contourDistance) > resolveDistance(distance))\n          distance.copy(contourDistance);\n        }}\n    } else if (outerScalarDistance <= 0 && fabs(outerScalarDistance) < fabs(innerScalarDistance)) {\n      distance.copy(outerDistance);\n      winding = -1;\n      for (var _i = 0; _i < contourCount; ++_i) {\n        if (windings[_i] < 0) {\n          var _contourDistance = edgeSelectors[_i].distance();\n          if (fabs(resolveDistance(_contourDistance)) < fabs(innerScalarDistance) && resolveDistance(_contourDistance) < resolveDistance(distance))\n          distance.copy(_contourDistance);\n        }}\n    }\n    // Kevin: Comment out this code from the original code, I spent days to figure out the error\n    // Please keep this comments to compare with the original implementation\n    // else\n    //     return distance.copy(shapeDistance);\n\n    for (var _i2 = 0; _i2 < contourCount; ++_i2) {\n      if (windings[_i2] != winding && edgeSelectors[_i2]) {\n        var _contourDistance2 = edgeSelectors[_i2].distance();\n        if (resolveDistance(_contourDistance2) * resolveDistance(distance) >= 0 && fabs(resolveDistance(_contourDistance2)) < fabs(resolveDistance(distance)))\n        distance.copy(_contourDistance2);\n      }}\n    if (resolveDistance(distance) == resolveDistance(shapeDistance))\n    distance.copy(shapeDistance);\n    return distance;\n  };\n};\n\n\n\n\n/***/ }),\n\n/***/ \"./extensions/MSDF/Scanline.js\":\n/*!*************************************!*\\\n  !*** ./extensions/MSDF/Scanline.js ***!\n  \\*************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Scanline\": () => (/* binding */ Scanline),\n/* harmony export */   \"FILL_NONZERO\": () => (/* binding */ FILL_NONZERO),\n/* harmony export */   \"FILL_NEGATIVE\": () => (/* binding */ FILL_NEGATIVE),\n/* harmony export */   \"FILL_ODD\": () => (/* binding */ FILL_ODD),\n/* harmony export */   \"FILL_POSITIVE\": () => (/* binding */ FILL_POSITIVE)\n/* harmony export */ });\n/* harmony import */ var _Math__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Math */ \"./extensions/MSDF/Math.js\");\nfunction _createForOfIteratorHelper(o, allowArrayLike) {var it;if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) {if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") {if (it) o = it;var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e) {throw _e;}, f: F };}throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\");}var normalCompletion = true,didErr = false,err;return { s: function s() {it = o[Symbol.iterator]();}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e2) {didErr = true;err = _e2;}, f: function f() {try {if (!normalCompletion && it.return != null) it.return();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === \"string\") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === \"Object\" && o.constructor) n = o.constructor.name;if (n === \"Map\" || n === \"Set\") return Array.from(o);if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}\n\n\nvar FILL_NONZERO = 1;\nvar FILL_ODD = 2; // \"even-odd\"\nvar FILL_POSITIVE = 3;\nvar FILL_NEGATIVE = 4;\n\nfunction compareIntersections(a, b) {\n  return (0,_Math__WEBPACK_IMPORTED_MODULE_0__.sign)(a.x - b.x);\n}\n\nfunction interpretFillRule(intersections, fillRule) {\n  switch (fillRule) {\n    case FILL_NONZERO:\n      return intersections != 0;\n    case FILL_ODD:\n      return intersections & 1;\n    case FILL_POSITIVE:\n      return intersections > 0;\n    case FILL_NEGATIVE:\n      return intersections < 0;}\n\n  return false;\n}\n\nvar Scanline = function Scanline() {\n  var intersections = (0,_Math__WEBPACK_IMPORTED_MODULE_0__.createArray)();\n  var lastIndex = 0;\n\n  this.intersections = intersections;\n  this.preprocess = function () {\n    lastIndex = 0;\n    if (!intersections.empty()) {\n      intersections.sort(compareIntersections);\n\n      var totalDirection = 0;var _iterator = _createForOfIteratorHelper(\n      intersections),_step;try {for (_iterator.s(); !(_step = _iterator.n()).done;) {var intersection = _step.value;\n          totalDirection += intersection.direction;\n          intersection.direction = totalDirection;\n        }} catch (err) {_iterator.e(err);} finally {_iterator.f();}\n    }\n  };\n\n  this.setIntersections = function (value) {\n    intersections = value;\n    this.intersections = value;\n\n    this.preprocess();\n  };\n\n  this.moveTo = function (x) {\n    if (intersections.empty())\n    return -1;\n    var index = lastIndex;\n    if (x < intersections[index].x) {\n      do {\n        if (index == 0) {\n          lastIndex = 0;\n          return -1;\n        }\n        --index;\n      } while (x < intersections[index].x);\n    } else {\n      while (index < intersections.size() - 1 && x >= intersections[index + 1].x) {\n        ++index;}\n    }\n    lastIndex = index;\n    return index;\n  };\n\n  this.countIntersections = function (x) {\n    return this.moveTo(x) + 1;\n  };\n\n  this.sumIntersections = function (x) {\n    var index = this.moveTo(x);\n    if (index >= 0)\n    return intersections[index].direction;\n    return 0;\n  };\n\n  this.filled = function (x, fillRule) {\n    return interpretFillRule(this.sumIntersections(x), fillRule);\n  };\n\n};\n\n\n\n\n/***/ }),\n\n/***/ \"./extensions/MSDF/Selector.js\":\n/*!*************************************!*\\\n  !*** ./extensions/MSDF/Selector.js ***!\n  \\*************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"PseudoDistanceSelectorBase\": () => (/* binding */ PseudoDistanceSelectorBase),\n/* harmony export */   \"MultiDistanceSelector\": () => (/* binding */ MultiDistanceSelector),\n/* harmony export */   \"Multidistance\": () => (/* binding */ Multidistance)\n/* harmony export */ });\n/* harmony import */ var _SignedDistance__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SignedDistance */ \"./extensions/MSDF/SignedDistance.js\");\n/* harmony import */ var _Math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Math */ \"./extensions/MSDF/Math.js\");\n/* harmony import */ var _EdgeColor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./EdgeColor */ \"./extensions/MSDF/EdgeColor.js\");\n\n\n\n\n\nvar fabs = Math.abs;\n\nvar PseudoDistanceSelectorBase = function PseudoDistanceSelectorBase() {\n  this.minTrueDistance = new _SignedDistance__WEBPACK_IMPORTED_MODULE_0__.SignedDistance(_SignedDistance__WEBPACK_IMPORTED_MODULE_0__.SignedDistance[Infinity], 1);\n  this.minNegativePseudoDistance = new _SignedDistance__WEBPACK_IMPORTED_MODULE_0__.SignedDistance(_SignedDistance__WEBPACK_IMPORTED_MODULE_0__.SignedDistance[Infinity], 1);\n  this.minPositivePseudoDistance = new _SignedDistance__WEBPACK_IMPORTED_MODULE_0__.SignedDistance(_SignedDistance__WEBPACK_IMPORTED_MODULE_0__.SignedDistance[Infinity], 1);\n\n  this.nearEdgeParam = 0;\n  this.nearEdge = null;\n};\n\nPseudoDistanceSelectorBase.prototype.reset = function () {\n  this.minTrueDistance.reset();\n  this.minNegativePseudoDistance.reset();\n  this.minPositivePseudoDistance.reset();\n\n  this.nearEdgeParam = 0;\n  this.nearEdge = null;\n};\n\nPseudoDistanceSelectorBase.pointFacingEdge = function (prevEdge, edge, nextEdge, p, param) {\n  if (param < 0) {\n    var prevEdgeDir = prevEdge.direction(1).normalizeExt(true).multiplyScalar(-1);\n    var edgeDir = edge.direction(0).normalizeExt(true);\n    var pointDir = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p, edge.point(0));\n    return (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(pointDir, edgeDir) >= (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(pointDir, prevEdgeDir);\n  }\n  if (param > 1) {\n    var _edgeDir = edge.direction(1).normalizeExt(true).multiplyScalar(-1);\n    var nextEdgeDir = nextEdge.direction(0).normalizeExt(true);\n    var _pointDir = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.subVectors)(p, edge.point(1));\n    return (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(_pointDir, _edgeDir) >= (0,_Math__WEBPACK_IMPORTED_MODULE_1__.dotProduct)(_pointDir, nextEdgeDir);\n  }\n  return true;\n};\n\nPseudoDistanceSelectorBase.prototype.addEdgeTrueDistance = function (edge, distance, param) {\n  if (distance.lt(this.minTrueDistance)) {\n    this.minTrueDistance.copy(distance);\n    this.nearEdge = edge;\n    this.nearEdgeParam = param;\n  }\n};\n\nPseudoDistanceSelectorBase.prototype.addEdgePseudoDistance = function (distance) {\n  var minPseudoDistance = distance.distance < 0 ? this.minNegativePseudoDistance : this.minPositivePseudoDistance;\n  if (distance.lt(minPseudoDistance)) {\n    minPseudoDistance.copy(distance);\n  }\n};\n\nPseudoDistanceSelectorBase.prototype.merge = function (other) {\n  if (other.minTrueDistance.lt(this.minTrueDistance)) {\n    this.minTrueDistance.copy(other.minTrueDistance);\n    this.nearEdge = other.nearEdge;\n    this.nearEdgeParam = other.nearEdgeParam;\n  }\n\n  if (other.minNegativePseudoDistance.lt(this.minNegativePseudoDistance)) {\n    this.minNegativePseudoDistance.copy(other.minNegativePseudoDistance);\n  }\n  if (other.minPositivePseudoDistance.lt(this.minPositivePseudoDistance)) {\n    this.minPositivePseudoDistance.copy(other.minPositivePseudoDistance);\n  }\n};\n\nPseudoDistanceSelectorBase.prototype.computeDistance = function (p) {\n  var minDistance = this.minTrueDistance.distance < 0 ? this.minNegativePseudoDistance.distance : this.minPositivePseudoDistance.distance;\n  if (this.nearEdge) {\n    var distance = this.minTrueDistance;\n    this.nearEdge.distanceToPseudoDistance(distance, p, this.nearEdgeParam);\n    if (fabs(distance.distance) < fabs(minDistance)) {\n      minDistance = distance.distance;\n    }\n  }\n  return minDistance;\n};\n\nvar Multidistance = function Multidistance() {\n  this.r = _SignedDistance__WEBPACK_IMPORTED_MODULE_0__.SignedDistance[Infinity];\n  this.g = _SignedDistance__WEBPACK_IMPORTED_MODULE_0__.SignedDistance[Infinity];\n  this.b = _SignedDistance__WEBPACK_IMPORTED_MODULE_0__.SignedDistance[Infinity];\n};\n\nMultidistance.prototype.copy = function (other) {\n  this.r = other.r;\n  this.g = other.g;\n  this.b = other.b;\n\n  return this;\n};\n\nvar MultiDistanceSelector = function MultiDistanceSelector(p) {\n  if (p) {\n    this.p = p.clone();\n  }\n\n  this.r = new PseudoDistanceSelectorBase();\n  this.g = new PseudoDistanceSelectorBase();\n  this.b = new PseudoDistanceSelectorBase();\n};\n\nMultiDistanceSelector.prototype.reset = function (p) {\n  this.p = p.clone();\n  this.r.reset();\n  this.g.reset();\n  this.b.reset();\n};\n\nMultiDistanceSelector.prototype.addEdge = function (prevEdge, edge, nextEdge) {\n  var p = this.p;\n  var distance = edge.signedDistance(p);\n  var param = distance.lerp;\n  if (edge.color & _EdgeColor__WEBPACK_IMPORTED_MODULE_2__.RED) {\n    this.r.addEdgeTrueDistance(edge, distance, param);\n  }\n\n  if (edge.color & _EdgeColor__WEBPACK_IMPORTED_MODULE_2__.GREEN) {\n    this.g.addEdgeTrueDistance(edge, distance, param);\n  }\n\n  if (edge.color & _EdgeColor__WEBPACK_IMPORTED_MODULE_2__.BLUE) {\n    this.b.addEdgeTrueDistance(edge, distance, param);\n  }\n  if (PseudoDistanceSelectorBase.pointFacingEdge(prevEdge, edge, nextEdge, p, param)) {\n    edge.distanceToPseudoDistance(distance, p, param);\n    if (edge.color & _EdgeColor__WEBPACK_IMPORTED_MODULE_2__.RED) {\n      this.r.addEdgePseudoDistance(distance);\n    }\n    if (edge.color & _EdgeColor__WEBPACK_IMPORTED_MODULE_2__.GREEN) {\n      this.g.addEdgePseudoDistance(distance);\n    }\n    if (edge.color & _EdgeColor__WEBPACK_IMPORTED_MODULE_2__.BLUE) {\n      this.b.addEdgePseudoDistance(distance);\n    }\n  }\n};\n\nMultiDistanceSelector.prototype.merge = function (other) {\n  this.r.merge(other.r);\n  this.g.merge(other.g);\n  this.b.merge(other.b);\n};\n\nMultiDistanceSelector.prototype.distance = function () {\n  var multiDistance = new Multidistance();\n\n  multiDistance.r = this.r.computeDistance(this.p);\n  multiDistance.g = this.g.computeDistance(this.p);\n  multiDistance.b = this.b.computeDistance(this.p);\n\n  return multiDistance;\n};\n\n\n\n/***/ }),\n\n/***/ \"./extensions/MSDF/Shape.js\":\n/*!**********************************!*\\\n  !*** ./extensions/MSDF/Shape.js ***!\n  \\**********************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Shape\": () => (/* binding */ Shape)\n/* harmony export */ });\n/* harmony import */ var _Contour__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Contour */ \"./extensions/MSDF/Contour.js\");\n/* harmony import */ var _Math__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Math */ \"./extensions/MSDF/Math.js\");\nfunction _createForOfIteratorHelper(o, allowArrayLike) {var it;if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) {if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") {if (it) o = it;var i = 0;var F = function F() {};return { s: F, n: function n() {if (i >= o.length) return { done: true };return { done: false, value: o[i++] };}, e: function e(_e) {throw _e;}, f: F };}throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\");}var normalCompletion = true,didErr = false,err;return { s: function s() {it = o[Symbol.iterator]();}, n: function n() {var step = it.next();normalCompletion = step.done;return step;}, e: function e(_e2) {didErr = true;err = _e2;}, f: function f() {try {if (!normalCompletion && it.return != null) it.return();} finally {if (didErr) throw err;}} };}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === \"string\") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === \"Object\" && o.constructor) n = o.constructor.name;if (n === \"Map\" || n === \"Set\") return Array.from(o);if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}\n\n\nvar Shape = function Shape() {\n  this.inverseYAxis = false;\n  this.contours = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.createArray)();\n  this.windings = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.createArray)();\n  this.bounds = null;\n};\n\nShape.prototype.createContour = function () {\n  if (this.currentContour && this.currentContour.edges.length == 0) {\n    this.contours.pop();\n  }\n\n  var contour = new _Contour__WEBPACK_IMPORTED_MODULE_0__.Contour();\n  this.addContour(contour);\n  this.currentContour = contour;\n};\n\nShape.prototype.addContour = function (contour) {\n  this.contours.push(contour);\n};\n\nShape.prototype.checkWinding = function () {\n  this.initWinding();\n  // decide winding, find the largest area and use it for 1, if it is negative, revert all of it\n  var l = 0;\n  for (var i = 0; i < this.windings.length; i++) {\n    if (Math.abs(l) < Math.abs(this.windings[i])) {\n      l = this.windings[i];\n    }\n    this.windings[i] = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.sign)(this.windings[i]);\n  }\n\n  // rewind the contour if first contour winding is counterclockwise\n  if (l < 0) {\n    this.inverseYAxis = true;\n  }\n\n  if (this.inverseYAxis) {\n    this.inverseY();\n  }\n};\n\nShape.prototype.initWinding = function () {\n  if (this.windings.length == 0) {\n    for (var i = 0; i < this.contours.length; i++) {\n      this.windings.push(this.contours[i].winding());\n    }\n  }\n};\n\nShape.prototype.inverseY = function () {\n  for (var i = 0; i < this.windings.length; i++) {\n    this.windings[i] *= -1;\n  }\n\n  for (var _i = 0; _i < this.contours.length; _i++) {\n    this.contours[_i].inverseY();\n  }\n\n  // need to flip the bounds as well\n  if (this.bounds) {\n    var y1 = -this.bounds.y1;\n    var y2 = -this.bounds.y2;\n    this.bounds.y1 = y2;\n    this.bounds.y2 = y1;\n  }\n};\n\nShape.prototype.validate = function () {var _iterator = _createForOfIteratorHelper(\n  this.contours),_step;try {for (_iterator.s(); !(_step = _iterator.n()).done;) {var contour = _step.value;\n      if (!contour.edges.empty()) {\n        var corner = contour.edges[contour.edges.length - 1].point(1);\n        for (var edgeIndex = 0; edgeIndex < contour.edges.length - 1; edgeIndex++) {\n          var edge = contour.edges[edgeIndex];\n          if (!edge)\n          return false;\n          if (edge.point(0) != corner)\n          return false;\n          corner = edge.point(1);\n        }\n      }\n    }} catch (err) {_iterator.e(err);} finally {_iterator.f();}\n  return true;\n};\n\nShape.prototype.bounds = function (bounds) {\n  for (var i = 0; i < this.contours.length; i++) {\n    var contour = this.contours[i];\n    contour.bounds(bounds);\n  }\n};\n\nShape.prototype.miterBounds = function (bounds, miterLimit) {\n  for (var i = 0; i < this.contours.length; i++) {\n    var contour = this.contours[i];\n    contour.miterBounds(bounds, miterLimit);\n  }\n};\n\nShape.prototype.scanline = function (line, y) {\n  var intersections = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.createArray)();\n  var x = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.createArray)();\n  var dy = (0,_Math__WEBPACK_IMPORTED_MODULE_1__.createArray)();\n\n  for (var i = 0; i < this.contours.length; i++) {\n    var contour = this.contours[i];\n    for (var edgeIndex = 0; edgeIndex < contour.edges.length; edgeIndex++) {\n      var edge = contour.edges[edgeIndex];\n      var n = edge.scanlineIntersections(x, dy, y);\n      for (var _i2 = 0; _i2 < n; ++_i2) {\n        var intersection = { x: x[_i2], direction: dy[_i2] };\n        intersections.push(intersection);\n      }\n    }\n  }\n\n  line.setIntersections(intersections);\n};\n\nShape.prototype.debug = function () {\n  var contours = this.contours;\n\n  var result = \"\\nvar myPath = new CompoundPath();\\nmyPath.strokeColor = 'black';\\n    \";var _iterator2 = _createForOfIteratorHelper(\n\n\n\n  contours),_step2;try {for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {var contour = _step2.value;\n      for (var i = 0; i < contour.edges.length; i++) {\n        var edge = contour.edges[i];\n        if (i == 0) {\n          result += \"\\nmyPath.moveTo(new Point(\".concat(edge.p[0].x, \", \").concat(edge.p[0].y, \"));\\n\");\n        }\n\n        result += edge.debug(\"myPath\");\n      }\n    }} catch (err) {_iterator2.e(err);} finally {_iterator2.f();}\n\n  console.log(result);\n};\n\n\n\n/***/ }),\n\n/***/ \"./extensions/MSDF/SignedDistance.js\":\n/*!*******************************************!*\\\n  !*** ./extensions/MSDF/SignedDistance.js ***!\n  \\*******************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"SignedDistance\": () => (/* binding */ SignedDistance)\n/* harmony export */ });\nvar SignedDistance = function SignedDistance(distance, dot, lerp) {\n  this.distance = distance || SignedDistance.Infinity;\n  this.dot = dot == undefined ? 1 : dot;\n  this.lerp = lerp;\n};\n\nSignedDistance.Infinity = -1e240;\nvar fabs = Math.abs;\n\nSignedDistance.prototype.gt = function (b) {\n  return fabs(this.distance) > fabs(b.distance) || fabs(this.distance) == fabs(b.distance) && this.dot > b.dot;\n};\n\nSignedDistance.prototype.lt = function (b) {\n  return fabs(this.distance) < fabs(b.distance) || fabs(this.distance) == fabs(b.distance) && this.dot < b.dot;\n};\n\nSignedDistance.prototype.ge = function (b) {\n  return fabs(this.distance) > fabs(b.distance) || fabs(this.distance) == fabs(b.distance) && this.dot >= b.dot;\n};\n\nSignedDistance.prototype.le = function (b) {\n  return fabs(this.distance) < fabs(b.distance) || fabs(this.distance) == fabs(b.distance) && this.dot <= b.dot;\n};\n\nSignedDistance.prototype.copy = function (other) {\n  this.distance = other.distance;\n  this.dot = other.dot;\n  this.lerp = other.lerp;\n};\n\nSignedDistance.prototype.reset = function () {\n  this.distance = SignedDistance.Infinity;\n  this.dot = 1;\n  this.lerp = undefined;\n};\n\n\n\n/***/ }),\n\n/***/ \"./extensions/MSDF/Vector2.js\":\n/*!************************************!*\\\n  !*** ./extensions/MSDF/Vector2.js ***!\n  \\************************************/\n/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {\n\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Vector2\": () => (/* binding */ Vector2)\n/* harmony export */ });\n/**\n * Vector2D copied from THREEJS\n * IT will reduce the bundle size when we put it into worker\n */\n\n/**\n     * @author mrdoob / http://mrdoob.com/\n     * @author philogb / http://blog.thejit.org/\n     * @author egraether / http://egraether.com/\n     * @author zz85 / http://www.lab4games.net/zz85/blog\n     */\n\nfunction Vector2(x, y) {\n\n  this.x = x || 0;\n  this.y = y || 0;\n\n}\n\nObject.defineProperties(Vector2.prototype, {\n\n  \"width\": {\n\n    get: function get() {\n\n      return this.x;\n\n    },\n\n    set: function set(value) {\n\n      this.x = value;\n\n    } },\n\n\n\n  \"height\": {\n\n    get: function get() {\n\n      return this.y;\n\n    },\n\n    set: function set(value) {\n\n      this.y = value;\n\n    } } });\n\n\n\n\n\nObject.assign(Vector2.prototype, {\n\n  isVector2: true,\n\n  set: function set(x, y) {\n\n    this.x = x;\n    this.y = y;\n\n    return this;\n\n  },\n\n  setScalar: function setScalar(scalar) {\n\n    this.x = scalar;\n    this.y = scalar;\n\n    return this;\n\n  },\n\n  setX: function setX(x) {\n\n    this.x = x;\n\n    return this;\n\n  },\n\n  setY: function setY(y) {\n\n    this.y = y;\n\n    return this;\n\n  },\n\n  setComponent: function setComponent(index, value) {\n\n    switch (index) {\n\n      case 0:this.x = value;break;\n      case 1:this.y = value;break;\n      default:throw new Error('index is out of range: ' + index);}\n\n\n\n    return this;\n\n  },\n\n  getComponent: function getComponent(index) {\n\n    switch (index) {\n\n      case 0:return this.x;\n      case 1:return this.y;\n      default:throw new Error('index is out of range: ' + index);}\n\n\n\n  },\n\n  clone: function clone() {\n\n    return new this.constructor(this.x, this.y);\n\n  },\n\n  copy: function copy(v) {\n\n    this.x = v.x;\n    this.y = v.y;\n\n    return this;\n\n  },\n\n  add: function add(v, w) {\n\n    if (w !== undefined) {\n\n      console.warn('THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');\n      return this.addVectors(v, w);\n\n    }\n\n    this.x += v.x;\n    this.y += v.y;\n\n    return this;\n\n  },\n\n  addScalar: function addScalar(s) {\n\n    this.x += s;\n    this.y += s;\n\n    return this;\n\n  },\n\n  addVectors: function addVectors(a, b) {\n\n    this.x = a.x + b.x;\n    this.y = a.y + b.y;\n\n    return this;\n\n  },\n\n  addScaledVector: function addScaledVector(v, s) {\n\n    this.x += v.x * s;\n    this.y += v.y * s;\n\n    return this;\n\n  },\n\n  sub: function sub(v, w) {\n\n    if (w !== undefined) {\n\n      console.warn('THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');\n      return this.subVectors(v, w);\n\n    }\n\n    this.x -= v.x;\n    this.y -= v.y;\n\n    return this;\n\n  },\n\n  subScalar: function subScalar(s) {\n\n    this.x -= s;\n    this.y -= s;\n\n    return this;\n\n  },\n\n  subVectors: function subVectors(a, b) {\n\n    this.x = a.x - b.x;\n    this.y = a.y - b.y;\n\n    return this;\n\n  },\n\n  multiply: function multiply(v) {\n\n    this.x *= v.x;\n    this.y *= v.y;\n\n    return this;\n\n  },\n\n  multiplyScalar: function multiplyScalar(scalar) {\n\n    this.x *= scalar;\n    this.y *= scalar;\n\n    return this;\n\n  },\n\n  divide: function divide(v) {\n\n    this.x /= v.x;\n    this.y /= v.y;\n\n    return this;\n\n  },\n\n  divideScalar: function divideScalar(scalar) {\n\n    return this.multiplyScalar(1 / scalar);\n\n  },\n\n  applyMatrix3: function applyMatrix3(m) {\n\n    var x = this.x,y = this.y;\n    var e = m.elements;\n\n    this.x = e[0] * x + e[3] * y + e[6];\n    this.y = e[1] * x + e[4] * y + e[7];\n\n    return this;\n\n  },\n\n  min: function min(v) {\n\n    this.x = Math.min(this.x, v.x);\n    this.y = Math.min(this.y, v.y);\n\n    return this;\n\n  },\n\n  max: function max(v) {\n\n    this.x = Math.max(this.x, v.x);\n    this.y = Math.max(this.y, v.y);\n\n    return this;\n\n  },\n\n  clamp: function clamp(min, max) {\n\n    // assumes min < max, componentwise\n\n    this.x = Math.max(min.x, Math.min(max.x, this.x));\n    this.y = Math.max(min.y, Math.min(max.y, this.y));\n\n    return this;\n\n  },\n\n  clampScalar: function clampScalar(minVal, maxVal) {\n\n    this.x = Math.max(minVal, Math.min(maxVal, this.x));\n    this.y = Math.max(minVal, Math.min(maxVal, this.y));\n\n    return this;\n\n  },\n\n  clampLength: function clampLength(min, max) {\n\n    var length = this.length();\n\n    return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));\n\n  },\n\n  floor: function floor() {\n\n    this.x = Math.floor(this.x);\n    this.y = Math.floor(this.y);\n\n    return this;\n\n  },\n\n  ceil: function ceil() {\n\n    this.x = Math.ceil(this.x);\n    this.y = Math.ceil(this.y);\n\n    return this;\n\n  },\n\n  round: function round() {\n\n    this.x = Math.round(this.x);\n    this.y = Math.round(this.y);\n\n    return this;\n\n  },\n\n  roundToZero: function roundToZero() {\n\n    this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);\n    this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);\n\n    return this;\n\n  },\n\n  negate: function negate() {\n\n    this.x = -this.x;\n    this.y = -this.y;\n\n    return this;\n\n  },\n\n  dot: function dot(v) {\n\n    return this.x * v.x + this.y * v.y;\n\n  },\n\n  cross: function cross(v) {\n\n    return this.x * v.y - this.y * v.x;\n\n  },\n\n  lengthSq: function lengthSq() {\n\n    return this.x * this.x + this.y * this.y;\n\n  },\n\n  length: function length() {\n\n    return Math.sqrt(this.x * this.x + this.y * this.y);\n\n  },\n\n  manhattanLength: function manhattanLength() {\n\n    return Math.abs(this.x) + Math.abs(this.y);\n\n  },\n\n  normalize: function normalize() {\n\n    return this.divideScalar(this.length() || 1);\n\n  },\n\n  angle: function angle() {\n\n    // computes the angle in radians with respect to the positive x-axis\n\n    var angle = Math.atan2(this.y, this.x);\n\n    if (angle < 0) angle += 2 * Math.PI;\n\n    return angle;\n\n  },\n\n  distanceTo: function distanceTo(v) {\n\n    return Math.sqrt(this.distanceToSquared(v));\n\n  },\n\n  distanceToSquared: function distanceToSquared(v) {\n\n    var dx = this.x - v.x,dy = this.y - v.y;\n    return dx * dx + dy * dy;\n\n  },\n\n  manhattanDistanceTo: function manhattanDistanceTo(v) {\n\n    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);\n\n  },\n\n  setLength: function setLength(length) {\n\n    return this.normalize().multiplyScalar(length);\n\n  },\n\n  lerp: function lerp(v, alpha) {\n\n    this.x += (v.x - this.x) * alpha;\n    this.y += (v.y - this.y) * alpha;\n\n    return this;\n\n  },\n\n  lerpVectors: function lerpVectors(v1, v2, alpha) {\n\n    return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);\n\n  },\n\n  equals: function equals(v) {\n\n    return v.x === this.x && v.y === this.y;\n\n  },\n\n  fromArray: function fromArray(array, offset) {\n\n    if (offset === undefined) offset = 0;\n\n    this.x = array[offset];\n    this.y = array[offset + 1];\n\n    return this;\n\n  },\n\n  toArray: function toArray(array, offset) {\n\n    if (array === undefined) array = [];\n    if (offset === undefined) offset = 0;\n\n    array[offset] = this.x;\n    array[offset + 1] = this.y;\n\n    return array;\n\n  },\n\n  fromBufferAttribute: function fromBufferAttribute(attribute, index, offset) {\n\n    if (offset !== undefined) {\n\n      console.warn('THREE.Vector2: offset has been removed from .fromBufferAttribute().');\n\n    }\n\n    this.x = attribute.getX(index);\n    this.y = attribute.getY(index);\n\n    return this;\n\n  },\n\n  rotateAround: function rotateAround(center, angle) {\n\n    var c = Math.cos(angle),s = Math.sin(angle);\n\n    var x = this.x - center.x;\n    var y = this.y - center.y;\n\n    this.x = x * c - y * s + center.x;\n    this.y = x * s + y * c + center.y;\n\n    return this;\n\n  } });\n\n\n\nVector2.prototype.isEmtpy = function () {\n  return !this.x && !this.y;\n};\n\nVector2.prototype.getOrthogonal = function (polarity) {\n  return polarity ? new Vector2(-this.y, this.x) : new Vector2(this.y, this.x);\n};\n\nVector2.prototype.getOrthonormal = function (polarity) {var allowZero = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;\n  var len = this.length();\n  if (len == 0) {\n    var y = !allowZero ? 1 : 0;\n    return polarity ? new Vector2(0, y) : new Vector2(0, -y);\n  }\n  return polarity ? new Vector2(-this.y / len, this.x / len) : new Vector2(this.y / len, -this.x / len);\n};\n\nVector2.prototype.cross = function (v) {\n  return this.x * v.y - this.y * v.x;\n};\n\n\nVector2.prototype.normalizeExt = function (allowZero) {\n  var len = this.length();\n  if (Math.abs(len) <= 0.0000001)\n  return new Vector2(0, allowZero ? 0 : 1);\n  return new Vector2(this.x / len, this.y / len);\n};\n\n\n\n/***/ })\n\n/******/ \t});\n/************************************************************************/\n/******/ \t// The module cache\n/******/ \tvar __webpack_module_cache__ = {};\n/******/ \t\n/******/ \t// The require function\n/******/ \tfunction __webpack_require__(moduleId) {\n/******/ \t\t// Check if module is in cache\n/******/ \t\tvar cachedModule = __webpack_module_cache__[moduleId];\n/******/ \t\tif (cachedModule !== undefined) {\n/******/ \t\t\treturn cachedModule.exports;\n/******/ \t\t}\n/******/ \t\t// Create a new module (and put it into the cache)\n/******/ \t\tvar module = __webpack_module_cache__[moduleId] = {\n/******/ \t\t\t// no module.id needed\n/******/ \t\t\t// no module.loaded needed\n/******/ \t\t\texports: {}\n/******/ \t\t};\n/******/ \t\n/******/ \t\t// Execute the module function\n/******/ \t\t__webpack_modules__[moduleId](module, module.exports, __webpack_require__);\n/******/ \t\n/******/ \t\t// Return the exports of the module\n/******/ \t\treturn module.exports;\n/******/ \t}\n/******/ \t\n/************************************************************************/\n/******/ \t/* webpack/runtime/define property getters */\n/******/ \t(() => {\n/******/ \t\t// define getter functions for harmony exports\n/******/ \t\t__webpack_require__.d = (exports, definition) => {\n/******/ \t\t\tfor(var key in definition) {\n/******/ \t\t\t\tif(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {\n/******/ \t\t\t\t\tObject.defineProperty(exports, key, { enumerable: true, get: definition[key] });\n/******/ \t\t\t\t}\n/******/ \t\t\t}\n/******/ \t\t};\n/******/ \t})();\n/******/ \t\n/******/ \t/* webpack/runtime/hasOwnProperty shorthand */\n/******/ \t(() => {\n/******/ \t\t__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))\n/******/ \t})();\n/******/ \t\n/******/ \t/* webpack/runtime/make namespace object */\n/******/ \t(() => {\n/******/ \t\t// define __esModule on exports\n/******/ \t\t__webpack_require__.r = (exports) => {\n/******/ \t\t\tif(typeof Symbol !== 'undefined' && Symbol.toStringTag) {\n/******/ \t\t\t\tObject.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });\n/******/ \t\t\t}\n/******/ \t\t\tObject.defineProperty(exports, '__esModule', { value: true });\n/******/ \t\t};\n/******/ \t})();\n/******/ \t\n/************************************************************************/\nvar __webpack_exports__ = {};\n// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.\n(() => {\n/*!*****************************************************************************************************************************************************************************************!*\\\n  !*** ./node_modules/ifdef-loader/ifdef-loader.js??ruleSet[1].rules[0].use[0]!./node_modules/babel-loader/lib/index.js??ruleSet[1].rules[0].use[1]!./extensions/MSDF/GeneratorWorker.js ***!\n  \\*****************************************************************************************************************************************************************************************/\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _MSDF__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./MSDF */ \"./extensions/MSDF/MSDF.js\");\n/* harmony import */ var _Bitmap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Bitmap */ \"./extensions/MSDF/Bitmap.js\");\n\n\n\n\nvar bitmap;\nvar tasks = [];\n\nonmessage = function onmessage(event) {\n  var task = event.data;\n  var range = Math.ceil(task.range);\n  var fontSize = Math.ceil(task.fontSize);\n  var bounds = task.bounds;\n\n  var charInfo = _MSDF__WEBPACK_IMPORTED_MODULE_0__.MSDF.loadGlyph(task.path, bounds, task.fontSize, task.range);\n\n  var width = Math.ceil(charInfo.width);\n  var height = Math.ceil(charInfo.height);\n\n  width = width < fontSize + 2 * range ? fontSize + 2 * range : width;\n  height = height < fontSize + 2 * range ? fontSize + 2 * range : height;\n\n  // reuse the bitmap as much as possible\n  if (!bitmap || bitmap.width < width || bitmap.height < height) {\n    bitmap = new _Bitmap__WEBPACK_IMPORTED_MODULE_1__.Bitmap(width, height);\n  }\n\n  bitmap.reset();\n  task.charInfo = charInfo;\n  tasks.push(task);\n\n  // run on task\n  _MSDF__WEBPACK_IMPORTED_MODULE_0__.MSDF.generate(bitmap, charInfo, range);\n\n  task.image = bitmap.getDrawingData(charInfo.width, charInfo.height, !charInfo.shape.inverseYAxis, range, task.char);\n\n  task.width = charInfo.width;\n  task.height = charInfo.height;\n\n  // delete the shape from charInfo\n  task.inverseYAxis = charInfo.shape.inverseYAxis;\n  charInfo.shape = undefined;\n  charInfo.path = undefined;\n  self.postMessage(task, [task.image.binData.buffer]);\n};\n})();\n\n/******/ })()\n;\n//# sourceMappingURL=8236d39e53c51b3458ca.worker.js.map", __webpack_require__.p + "8236d39e53c51b3458ca.worker.js");
};

/***/ }),

/***/ "./node_modules/worker-loader/dist/workers/InlineWorker.js":
/*!*****************************************************************!*\
  !*** ./node_modules/worker-loader/dist/workers/InlineWorker.js ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";


// http://stackoverflow.com/questions/10343913/how-to-create-a-web-worker-from-a-string

var URL = window.URL || window.webkitURL;

module.exports = function (content, url) {
  try {
    try {
      var blob;

      try {
        // BlobBuilder = Deprecated, but widely implemented
        var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

        blob = new BlobBuilder();

        blob.append(content);

        blob = blob.getBlob();
      } catch (e) {
        // The proposed API
        blob = new Blob([content]);
      }

      return new Worker(URL.createObjectURL(blob));
    } catch (e) {
      return new Worker('data:application/javascript,' + encodeURIComponent(content));
    }
  } catch (e) {
    if (!url) {
      throw Error('Inline worker is not supported');
    }

    return new Worker(url);
  }
};

/***/ }),

/***/ "?4db5":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ "./node_modules/maxrects-packer/dist/maxrects-packer.mjs":
/*!***************************************************************!*\
  !*** ./node_modules/maxrects-packer/dist/maxrects-packer.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Bin": () => (/* binding */ Bin),
/* harmony export */   "MaxRectsBin": () => (/* binding */ MaxRectsBin),
/* harmony export */   "MaxRectsPacker": () => (/* binding */ MaxRectsPacker),
/* harmony export */   "OversizedElementBin": () => (/* binding */ OversizedElementBin),
/* harmony export */   "PACKING_LOGIC": () => (/* binding */ PACKING_LOGIC),
/* harmony export */   "Rectangle": () => (/* binding */ Rectangle)
/* harmony export */ });
class Rectangle {
    /**
     * Creates an instance of Rectangle.
     *
     * @param {number} [width=0]
     * @param {number} [height=0]
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {boolean} [rot=false]
     * @param {boolean} [allowRotation=false]
     * @memberof Rectangle
     */
    constructor(width = 0, height = 0, x = 0, y = 0, rot = false, allowRotation = undefined) {
        /**
         * Oversized tag on rectangle which is bigger than packer itself.
         *
         * @type {boolean}
         * @memberof Rectangle
         */
        this.oversized = false;
        this._rot = false;
        this._allowRotation = undefined;
        this._dirty = 0;
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;
        this._data = {};
        this._rot = rot;
        this._allowRotation = allowRotation;
    }
    /**
     * Test if two given rectangle collide each other
     *
     * @static
     * @param {IRectangle} first
     * @param {IRectangle} second
     * @returns
     * @memberof Rectangle
     */
    static Collide(first, second) { return first.collide(second); }
    /**
     * Test if the first rectangle contains the second one
     *
     * @static
     * @param {IRectangle} first
     * @param {IRectangle} second
     * @returns
     * @memberof Rectangle
     */
    static Contain(first, second) { return first.contain(second); }
    /**
     * Get the area (w * h) of the rectangle
     *
     * @returns {number}
     * @memberof Rectangle
     */
    area() { return this.width * this.height; }
    /**
     * Test if the given rectangle collide with this rectangle.
     *
     * @param {IRectangle} rect
     * @returns {boolean}
     * @memberof Rectangle
     */
    collide(rect) {
        return (rect.x < this.x + this.width &&
            rect.x + rect.width > this.x &&
            rect.y < this.y + this.height &&
            rect.y + rect.height > this.y);
    }
    /**
     * Test if this rectangle contains the given rectangle.
     *
     * @param {IRectangle} rect
     * @returns {boolean}
     * @memberof Rectangle
     */
    contain(rect) {
        return (rect.x >= this.x && rect.y >= this.y &&
            rect.x + rect.width <= this.x + this.width && rect.y + rect.height <= this.y + this.height);
    }
    get width() { return this._width; }
    set width(value) {
        if (value === this._width)
            return;
        this._width = value;
        this._dirty++;
    }
    get height() { return this._height; }
    set height(value) {
        if (value === this._height)
            return;
        this._height = value;
        this._dirty++;
    }
    get x() { return this._x; }
    set x(value) {
        if (value === this._x)
            return;
        this._x = value;
        this._dirty++;
    }
    get y() { return this._y; }
    set y(value) {
        if (value === this._y)
            return;
        this._y = value;
        this._dirty++;
    }
    /**
     * If the rectangle is rotated
     *
     * @type {boolean}
     * @memberof Rectangle
     */
    get rot() { return this._rot; }
    /**
     * Set the rotate tag of the rectangle.
     *
     * note: after `rot` is set, `width/height` of this rectangle is swaped.
     *
     * @memberof Rectangle
     */
    set rot(value) {
        if (this._allowRotation === false)
            return;
        if (this._rot !== value) {
            const tmp = this.width;
            this.width = this.height;
            this.height = tmp;
            this._rot = value;
            this._dirty++;
        }
    }
    /**
     * If the rectangle allow rotation
     *
     * @type {boolean}
     * @memberof Rectangle
     */
    get allowRotation() { return this._allowRotation; }
    /**
     * Set the allowRotation tag of the rectangle.
     *
     * @memberof Rectangle
     */
    set allowRotation(value) {
        if (this._allowRotation !== value) {
            this._allowRotation = value;
            this._dirty++;
        }
    }
    get data() { return this._data; }
    set data(value) {
        if (value === null || value === this._data)
            return;
        this._data = value;
        // extract allowRotation settings
        if (typeof value === "object" && value.hasOwnProperty("allowRotation")) {
            this._allowRotation = value.allowRotation;
        }
        this._dirty++;
    }
    get dirty() { return this._dirty > 0; }
    setDirty(value = true) { this._dirty = value ? this._dirty + 1 : 0; }
}

class Bin {
    constructor() {
        this._dirty = 0;
    }
    get dirty() { return this._dirty > 0 || this.rects.some(rect => rect.dirty); }
    /**
     * Set bin dirty status
     *
     * @memberof Bin
     */
    setDirty(value = true) {
        this._dirty = value ? this._dirty + 1 : 0;
        if (!value) {
            for (let rect of this.rects) {
                if (rect.setDirty)
                    rect.setDirty(false);
            }
        }
    }
}

class MaxRectsBin extends Bin {
    constructor(maxWidth = EDGE_MAX_VALUE, maxHeight = EDGE_MAX_VALUE, padding = 0, options = {}) {
        super();
        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.padding = padding;
        this.freeRects = [];
        this.rects = [];
        this.verticalExpand = false;
        this.options = {
            smart: true,
            pot: true,
            square: true,
            allowRotation: false,
            tag: false,
            exclusiveTag: true,
            border: 0,
            logic: PACKING_LOGIC.MAX_EDGE
        };
        this.options = Object.assign(Object.assign({}, this.options), options);
        this.width = this.options.smart ? 0 : maxWidth;
        this.height = this.options.smart ? 0 : maxHeight;
        this.border = this.options.border ? this.options.border : 0;
        this.freeRects.push(new Rectangle(this.maxWidth + this.padding - this.border * 2, this.maxHeight + this.padding - this.border * 2, this.border, this.border));
        this.stage = new Rectangle(this.width, this.height);
    }
    add(...args) {
        let data;
        let rect;
        if (args.length === 1) {
            if (typeof args[0] !== 'object')
                throw new Error("MacrectsBin.add(): Wrong parameters");
            rect = args[0];
            // Check if rect.tag match bin.tag, if bin.tag not defined, it will accept any rect
            let tag = (rect.data && rect.data.tag) ? rect.data.tag : rect.tag ? rect.tag : undefined;
            if (this.options.tag && this.options.exclusiveTag && this.tag !== tag)
                return undefined;
        }
        else {
            data = args.length > 2 ? args[2] : null;
            // Check if data.tag match bin.tag, if bin.tag not defined, it will accept any rect
            if (this.options.tag && this.options.exclusiveTag) {
                if (data && this.tag !== data.tag)
                    return undefined;
                if (!data && this.tag)
                    return undefined;
            }
            rect = new Rectangle(args[0], args[1]);
            rect.data = data;
            rect.setDirty(false);
        }
        const result = this.place(rect);
        if (result)
            this.rects.push(result);
        return result;
    }
    repack() {
        let unpacked = [];
        this.reset();
        // re-sort rects from big to small
        this.rects.sort((a, b) => {
            const result = Math.max(b.width, b.height) - Math.max(a.width, a.height);
            if (result === 0 && a.hash && b.hash) {
                return a.hash > b.hash ? -1 : 1;
            }
            else
                return result;
        });
        for (let rect of this.rects) {
            if (!this.place(rect)) {
                unpacked.push(rect);
            }
        }
        for (let rect of unpacked)
            this.rects.splice(this.rects.indexOf(rect), 1);
        return unpacked.length > 0 ? unpacked : undefined;
    }
    reset(deepReset = false, resetOption = false) {
        if (deepReset) {
            if (this.data)
                delete this.data;
            if (this.tag)
                delete this.tag;
            this.rects = [];
            if (resetOption) {
                this.options = {
                    smart: true,
                    pot: true,
                    square: true,
                    allowRotation: false,
                    tag: false,
                    border: 0
                };
            }
        }
        this.width = this.options.smart ? 0 : this.maxWidth;
        this.height = this.options.smart ? 0 : this.maxHeight;
        this.border = this.options.border ? this.options.border : 0;
        this.freeRects = [new Rectangle(this.maxWidth + this.padding - this.border * 2, this.maxHeight + this.padding - this.border * 2, this.border, this.border)];
        this.stage = new Rectangle(this.width, this.height);
        this._dirty = 0;
    }
    clone() {
        let clonedBin = new MaxRectsBin(this.maxWidth, this.maxHeight, this.padding, this.options);
        for (let rect of this.rects) {
            clonedBin.add(rect);
        }
        return clonedBin;
    }
    place(rect) {
        // recheck if tag matched
        let tag = (rect.data && rect.data.tag) ? rect.data.tag : rect.tag ? rect.tag : undefined;
        if (this.options.tag && this.options.exclusiveTag && this.tag !== tag)
            return undefined;
        let node;
        let allowRotation;
        // getter/setter do not support hasOwnProperty()
        if (rect.hasOwnProperty("_allowRotation") && rect.allowRotation !== undefined) {
            allowRotation = rect.allowRotation; // Per Rectangle allowRotation override packer settings
        }
        else {
            allowRotation = this.options.allowRotation;
        }
        node = this.findNode(rect.width + this.padding, rect.height + this.padding, allowRotation);
        if (node) {
            this.updateBinSize(node);
            let numRectToProcess = this.freeRects.length;
            let i = 0;
            while (i < numRectToProcess) {
                if (this.splitNode(this.freeRects[i], node)) {
                    this.freeRects.splice(i, 1);
                    numRectToProcess--;
                    i--;
                }
                i++;
            }
            this.pruneFreeList();
            this.verticalExpand = this.width > this.height ? true : false;
            rect.x = node.x;
            rect.y = node.y;
            if (rect.rot === undefined)
                rect.rot = false;
            rect.rot = node.rot ? !rect.rot : rect.rot;
            this._dirty++;
            return rect;
        }
        else if (!this.verticalExpand) {
            if (this.updateBinSize(new Rectangle(rect.width + this.padding, rect.height + this.padding, this.width + this.padding - this.border, this.border)) || this.updateBinSize(new Rectangle(rect.width + this.padding, rect.height + this.padding, this.border, this.height + this.padding - this.border))) {
                return this.place(rect);
            }
        }
        else {
            if (this.updateBinSize(new Rectangle(rect.width + this.padding, rect.height + this.padding, this.border, this.height + this.padding - this.border)) || this.updateBinSize(new Rectangle(rect.width + this.padding, rect.height + this.padding, this.width + this.padding - this.border, this.border))) {
                return this.place(rect);
            }
        }
        return undefined;
    }
    findNode(width, height, allowRotation) {
        let score = Number.MAX_VALUE;
        let areaFit;
        let r;
        let bestNode;
        for (let i in this.freeRects) {
            r = this.freeRects[i];
            if (r.width >= width && r.height >= height) {
                areaFit = (this.options.logic === PACKING_LOGIC.MAX_AREA) ?
                    r.width * r.height - width * height :
                    Math.min(r.width - width, r.height - height);
                if (areaFit < score) {
                    bestNode = new Rectangle(width, height, r.x, r.y);
                    score = areaFit;
                }
            }
            if (!allowRotation)
                continue;
            // Continue to test 90-degree rotated rectangle
            if (r.width >= height && r.height >= width) {
                areaFit = (this.options.logic === PACKING_LOGIC.MAX_AREA) ?
                    r.width * r.height - height * width :
                    Math.min(r.height - width, r.width - height);
                if (areaFit < score) {
                    bestNode = new Rectangle(height, width, r.x, r.y, true); // Rotated node
                    score = areaFit;
                }
            }
        }
        return bestNode;
    }
    splitNode(freeRect, usedNode) {
        // Test if usedNode intersect with freeRect
        if (!freeRect.collide(usedNode))
            return false;
        // Do vertical split
        if (usedNode.x < freeRect.x + freeRect.width && usedNode.x + usedNode.width > freeRect.x) {
            // New node at the top side of the used node
            if (usedNode.y > freeRect.y && usedNode.y < freeRect.y + freeRect.height) {
                let newNode = new Rectangle(freeRect.width, usedNode.y - freeRect.y, freeRect.x, freeRect.y);
                this.freeRects.push(newNode);
            }
            // New node at the bottom side of the used node
            if (usedNode.y + usedNode.height < freeRect.y + freeRect.height) {
                let newNode = new Rectangle(freeRect.width, freeRect.y + freeRect.height - (usedNode.y + usedNode.height), freeRect.x, usedNode.y + usedNode.height);
                this.freeRects.push(newNode);
            }
        }
        // Do Horizontal split
        if (usedNode.y < freeRect.y + freeRect.height &&
            usedNode.y + usedNode.height > freeRect.y) {
            // New node at the left side of the used node.
            if (usedNode.x > freeRect.x && usedNode.x < freeRect.x + freeRect.width) {
                let newNode = new Rectangle(usedNode.x - freeRect.x, freeRect.height, freeRect.x, freeRect.y);
                this.freeRects.push(newNode);
            }
            // New node at the right side of the used node.
            if (usedNode.x + usedNode.width < freeRect.x + freeRect.width) {
                let newNode = new Rectangle(freeRect.x + freeRect.width - (usedNode.x + usedNode.width), freeRect.height, usedNode.x + usedNode.width, freeRect.y);
                this.freeRects.push(newNode);
            }
        }
        return true;
    }
    pruneFreeList() {
        // Go through each pair of freeRects and remove any rects that is redundant
        let i = 0;
        let j = 0;
        let len = this.freeRects.length;
        while (i < len) {
            j = i + 1;
            let tmpRect1 = this.freeRects[i];
            while (j < len) {
                let tmpRect2 = this.freeRects[j];
                if (tmpRect2.contain(tmpRect1)) {
                    this.freeRects.splice(i, 1);
                    i--;
                    len--;
                    break;
                }
                if (tmpRect1.contain(tmpRect2)) {
                    this.freeRects.splice(j, 1);
                    j--;
                    len--;
                }
                j++;
            }
            i++;
        }
    }
    updateBinSize(node) {
        if (!this.options.smart)
            return false;
        if (this.stage.contain(node))
            return false;
        let tmpWidth = Math.max(this.width, node.x + node.width - this.padding + this.border);
        let tmpHeight = Math.max(this.height, node.y + node.height - this.padding + this.border);
        if (this.options.allowRotation) {
            // do extra test on rotated node whether it's a better choice
            const rotWidth = Math.max(this.width, node.x + node.height - this.padding + this.border);
            const rotHeight = Math.max(this.height, node.y + node.width - this.padding + this.border);
            if (rotWidth * rotHeight < tmpWidth * tmpHeight) {
                tmpWidth = rotWidth;
                tmpHeight = rotHeight;
            }
        }
        if (this.options.pot) {
            tmpWidth = Math.pow(2, Math.ceil(Math.log(tmpWidth) * Math.LOG2E));
            tmpHeight = Math.pow(2, Math.ceil(Math.log(tmpHeight) * Math.LOG2E));
        }
        if (this.options.square) {
            tmpWidth = tmpHeight = Math.max(tmpWidth, tmpHeight);
        }
        if (tmpWidth > this.maxWidth + this.padding || tmpHeight > this.maxHeight + this.padding) {
            return false;
        }
        this.expandFreeRects(tmpWidth + this.padding, tmpHeight + this.padding);
        this.width = this.stage.width = tmpWidth;
        this.height = this.stage.height = tmpHeight;
        return true;
    }
    expandFreeRects(width, height) {
        this.freeRects.forEach((freeRect, index) => {
            if (freeRect.x + freeRect.width >= Math.min(this.width + this.padding - this.border, width)) {
                freeRect.width = width - freeRect.x - this.border;
            }
            if (freeRect.y + freeRect.height >= Math.min(this.height + this.padding - this.border, height)) {
                freeRect.height = height - freeRect.y - this.border;
            }
        }, this);
        this.freeRects.push(new Rectangle(width - this.width - this.padding, height - this.border * 2, this.width + this.padding - this.border, this.border));
        this.freeRects.push(new Rectangle(width - this.border * 2, height - this.height - this.padding, this.border, this.height + this.padding - this.border));
        this.freeRects = this.freeRects.filter(freeRect => {
            return !(freeRect.width <= 0 || freeRect.height <= 0 || freeRect.x < this.border || freeRect.y < this.border);
        });
        this.pruneFreeList();
    }
}

class OversizedElementBin extends Bin {
    constructor(...args) {
        super();
        this.rects = [];
        if (args.length === 1) {
            if (typeof args[0] !== 'object')
                throw new Error("OversizedElementBin: Wrong parameters");
            const rect = args[0];
            this.rects = [rect];
            this.width = rect.width;
            this.height = rect.height;
            this.data = rect.data;
            rect.oversized = true;
        }
        else {
            this.width = args[0];
            this.height = args[1];
            this.data = args.length > 2 ? args[2] : null;
            const rect = new Rectangle(this.width, this.height);
            rect.oversized = true;
            rect.data = this.data;
            this.rects.push(rect);
        }
        this.freeRects = [];
        this.maxWidth = this.width;
        this.maxHeight = this.height;
        this.options = { smart: false, pot: false, square: false };
    }
    add() { return undefined; }
    reset(deepReset = false) {
        // nothing to do here
    }
    repack() { return undefined; }
    clone() {
        let clonedBin = new OversizedElementBin(this.rects[0]);
        return clonedBin;
    }
}

const EDGE_MAX_VALUE = 4096;
var PACKING_LOGIC;
(function (PACKING_LOGIC) {
    PACKING_LOGIC[PACKING_LOGIC["MAX_AREA"] = 0] = "MAX_AREA";
    PACKING_LOGIC[PACKING_LOGIC["MAX_EDGE"] = 1] = "MAX_EDGE";
})(PACKING_LOGIC || (PACKING_LOGIC = {}));
class MaxRectsPacker {
    /**
     * Creates an instance of MaxRectsPacker.
     * @param {number} width of the output atlas (default is 4096)
     * @param {number} height of the output atlas (default is 4096)
     * @param {number} padding between glyphs/images (default is 0)
     * @param {IOption} [options={}] (Optional) packing options
     * @memberof MaxRectsPacker
     */
    constructor(width = EDGE_MAX_VALUE, height = EDGE_MAX_VALUE, padding = 0, options = {}) {
        this.width = width;
        this.height = height;
        this.padding = padding;
        /**
         * Options for MaxRect Packer
         * @property {boolean} options.smart Smart sizing packer (default is true)
         * @property {boolean} options.pot use power of 2 sizing (default is true)
         * @property {boolean} options.square use square size (default is false)
         * @property {boolean} options.allowRotation allow rotation packing (default is false)
         * @property {boolean} options.tag allow auto grouping based on `rect.tag` (default is false)
         * @property {boolean} options.exclusiveTag tagged rects will have dependent bin, if set to `false`, packer will try to put tag rects into the same bin (default is true)
         * @property {boolean} options.border atlas edge spacing (default is 0)
         * @property {PACKING_LOGIC} options.logic MAX_AREA or MAX_EDGE based sorting logic (default is MAX_EDGE)
         * @export
         * @interface Option
         */
        this.options = {
            smart: true,
            pot: true,
            square: false,
            allowRotation: false,
            tag: false,
            exclusiveTag: true,
            border: 0,
            logic: PACKING_LOGIC.MAX_EDGE
        };
        this._currentBinIndex = 0;
        this.bins = [];
        this.options = Object.assign(Object.assign({}, this.options), options);
    }
    add(...args) {
        if (args.length === 1) {
            if (typeof args[0] !== 'object')
                throw new Error("MacrectsPacker.add(): Wrong parameters");
            const rect = args[0];
            if (rect.width > this.width || rect.height > this.height) {
                this.bins.push(new OversizedElementBin(rect));
            }
            else {
                let added = this.bins.slice(this._currentBinIndex).find(bin => bin.add(rect) !== undefined);
                if (!added) {
                    let bin = new MaxRectsBin(this.width, this.height, this.padding, this.options);
                    let tag = (rect.data && rect.data.tag) ? rect.data.tag : rect.tag ? rect.tag : undefined;
                    if (this.options.tag && tag)
                        bin.tag = tag;
                    bin.add(rect);
                    this.bins.push(bin);
                }
            }
            return rect;
        }
        else {
            const rect = new Rectangle(args[0], args[1]);
            if (args.length > 2)
                rect.data = args[2];
            if (rect.width > this.width || rect.height > this.height) {
                this.bins.push(new OversizedElementBin(rect));
            }
            else {
                let added = this.bins.slice(this._currentBinIndex).find(bin => bin.add(rect) !== undefined);
                if (!added) {
                    let bin = new MaxRectsBin(this.width, this.height, this.padding, this.options);
                    if (this.options.tag && rect.data.tag)
                        bin.tag = rect.data.tag;
                    bin.add(rect);
                    this.bins.push(bin);
                }
            }
            return rect;
        }
    }
    /**
     * Add an Array of bins/rectangles to the packer.
     *
     * `Javascript`: Any object has property: { width, height, ... } is accepted.
     *
     * `Typescript`: object shall extends `MaxrectsPacker.IRectangle`.
     *
     * note: object has `hash` property will have more stable packing result
     *
     * @param {IRectangle[]} rects Array of bin/rectangles
     * @memberof MaxRectsPacker
     */
    addArray(rects) {
        if (!this.options.tag || this.options.exclusiveTag) {
            // if not using tag or using exclusiveTag, old approach
            this.sort(rects, this.options.logic).forEach(rect => this.add(rect));
        }
        else {
            // sort rects by tags first
            if (rects.length === 0)
                return;
            rects.sort((a, b) => {
                const aTag = (a.data && a.data.tag) ? a.data.tag : a.tag ? a.tag : undefined;
                const bTag = (b.data && b.data.tag) ? b.data.tag : b.tag ? b.tag : undefined;
                return bTag === undefined ? -1 : aTag === undefined ? 1 : bTag > aTag ? -1 : 1;
            });
            // iterate all bins to find the first bin which can place rects with same tag
            //
            let currentTag;
            let currentIdx = 0;
            let targetBin = this.bins.slice(this._currentBinIndex).find(bin => {
                let testBin = bin.clone();
                for (let i = currentIdx; i < rects.length; i++) {
                    const rect = rects[i];
                    const tag = (rect.data && rect.data.tag) ? rect.data.tag : rect.tag ? rect.tag : undefined;
                    // initialize currentTag
                    if (i === 0)
                        currentTag = tag;
                    if (tag !== currentTag) {
                        // all current tag memeber tested successfully
                        currentTag = tag;
                        // do addArray()
                        this.sort(rects.slice(currentIdx, i), this.options.logic).forEach(r => bin.add(r));
                        currentIdx = i;
                        // recrusively addArray() with remaining rects
                        this.addArray(rects.slice(i));
                        return true;
                    }
                    // remaining untagged rect will use normal addArray()
                    if (tag === undefined) {
                        // do addArray()
                        this.sort(rects.slice(i), this.options.logic).forEach(r => this.add(r));
                        currentIdx = rects.length;
                        // end test
                        return true;
                    }
                    // still in the same tag group
                    if (testBin.add(rect) === undefined) {
                        // current bin cannot contain all tag members
                        // procceed to test next bin
                        return false;
                    }
                }
                // all rects tested
                // do addArray() to the remaining tag group
                this.sort(rects.slice(currentIdx), this.options.logic).forEach(r => bin.add(r));
                return true;
            });
            // create a new bin if no current bin fit
            if (!targetBin) {
                const rect = rects[currentIdx];
                const bin = new MaxRectsBin(this.width, this.height, this.padding, this.options);
                const tag = (rect.data && rect.data.tag) ? rect.data.tag : rect.tag ? rect.tag : undefined;
                if (this.options.tag && this.options.exclusiveTag && tag)
                    bin.tag = tag;
                this.bins.push(bin);
                this.addArray(rects.slice(currentIdx));
            }
        }
    }
    /**
     * Reset entire packer to initial states, keep settings
     *
     * @memberof MaxRectsPacker
     */
    reset() {
        this.bins = [];
        this._currentBinIndex = 0;
    }
    /**
     * Repack all elements inside bins
     *
     * @param {boolean} [quick=true] quick repack only dirty bins
     * @returns {void}
     * @memberof MaxRectsPacker
     */
    repack(quick = true) {
        if (quick) {
            let unpack = [];
            for (let bin of this.bins) {
                if (bin.dirty) {
                    let up = bin.repack();
                    if (up)
                        unpack.push(...up);
                }
            }
            this.addArray(unpack);
            return;
        }
        if (!this.dirty)
            return;
        const allRects = this.rects;
        this.reset();
        this.addArray(allRects);
    }
    /**
     * Stop adding new element to the current bin and return a new bin.
     *
     * note: After calling `next()` all elements will no longer added to previous bins.
     *
     * @returns {Bin}
     * @memberof MaxRectsPacker
     */
    next() {
        this._currentBinIndex = this.bins.length;
        return this._currentBinIndex;
    }
    /**
     * Load bins to the packer, overwrite exist bins
     * @param {MaxRectsBin[]} bins MaxRectsBin objects
     * @memberof MaxRectsPacker
     */
    load(bins) {
        bins.forEach((bin, index) => {
            if (bin.maxWidth > this.width || bin.maxHeight > this.height) {
                this.bins.push(new OversizedElementBin(bin.width, bin.height, {}));
            }
            else {
                let newBin = new MaxRectsBin(this.width, this.height, this.padding, bin.options);
                newBin.freeRects.splice(0);
                bin.freeRects.forEach((r, i) => {
                    newBin.freeRects.push(new Rectangle(r.width, r.height, r.x, r.y));
                });
                newBin.width = bin.width;
                newBin.height = bin.height;
                if (bin.tag)
                    newBin.tag = bin.tag;
                this.bins[index] = newBin;
            }
        }, this);
    }
    /**
     * Output current bins to save
     * @memberof MaxRectsPacker
     */
    save() {
        let saveBins = [];
        this.bins.forEach((bin => {
            let saveBin = {
                width: bin.width,
                height: bin.height,
                maxWidth: bin.maxWidth,
                maxHeight: bin.maxHeight,
                freeRects: [],
                rects: [],
                options: bin.options
            };
            if (bin.tag)
                saveBin = Object.assign(Object.assign({}, saveBin), { tag: bin.tag });
            bin.freeRects.forEach(r => {
                saveBin.freeRects.push({
                    x: r.x,
                    y: r.y,
                    width: r.width,
                    height: r.height
                });
            });
            saveBins.push(saveBin);
        }));
        return saveBins;
    }
    /**
     * Sort the given rects based on longest edge or surface area.
     *
     * If rects have the same sort value, will sort by second key `hash` if presented.
     *
     * @private
     * @param {T[]} rects
     * @param {PACKING_LOGIC} [logic=PACKING_LOGIC.MAX_EDGE] sorting logic, "area" or "edge"
     * @returns
     * @memberof MaxRectsPacker
     */
    sort(rects, logic = PACKING_LOGIC.MAX_EDGE) {
        return rects.slice().sort((a, b) => {
            const result = (logic === PACKING_LOGIC.MAX_EDGE) ?
                Math.max(b.width, b.height) - Math.max(a.width, a.height) :
                b.width * b.height - a.width * a.height;
            if (result === 0 && a.hash && b.hash) {
                return a.hash > b.hash ? -1 : 1;
            }
            else
                return result;
        });
    }
    /**
     * Return current functioning bin index, perior to this wont accept any new elements
     *
     * @readonly
     * @type {number}
     * @memberof MaxRectsPacker
     */
    get currentBinIndex() { return this._currentBinIndex; }
    /**
     * Returns dirty status of all child bins
     *
     * @readonly
     * @type {boolean}
     * @memberof MaxRectsPacker
     */
    get dirty() { return this.bins.some(bin => bin.dirty); }
    /**
     * Return all rectangles in this packer
     *
     * @readonly
     * @type {T[]}
     * @memberof MaxRectsPacker
     */
    get rects() {
        let allRects = [];
        for (let bin of this.bins) {
            allRects.push(...bin.rects);
        }
        return allRects;
    }
}


//# sourceMappingURL=maxrects-packer.mjs.map


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../";
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************!*\
  !*** ./extensions/MSDF/index.js ***!
  \**********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Generator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Generator */ "./extensions/MSDF/Generator.js");
function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function");}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });if (superClass) _setPrototypeOf(subClass, superClass);}function _setPrototypeOf(o, p) {_setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {o.__proto__ = p;return o;};return _setPrototypeOf(o, p);}function _createSuper(Derived) {var hasNativeReflectConstruct = _isNativeReflectConstruct();return function _createSuperInternal() {var Super = _getPrototypeOf(Derived),result;if (hasNativeReflectConstruct) {var NewTarget = _getPrototypeOf(this).constructor;result = Reflect.construct(Super, arguments, NewTarget);} else {result = Super.apply(this, arguments);}return _possibleConstructorReturn(this, result);};}function _possibleConstructorReturn(self, call) {if (call && (_typeof(call) === "object" || typeof call === "function")) {return call;}return _assertThisInitialized(self);}function _assertThisInitialized(self) {if (self === void 0) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return self;}function _isNativeReflectConstruct() {if (typeof Reflect === "undefined" || !Reflect.construct) return false;if (Reflect.construct.sham) return false;if (typeof Proxy === "function") return true;try {Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));return true;} catch (e) {return false;}}function _getPrototypeOf(o) {_getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {return o.__proto__ || Object.getPrototypeOf(o);};return _getPrototypeOf(o);}

var av = Autodesk.Viewing;
var msdfNS = AutodeskNamespace('Autodesk.MSDF');
msdfNS["Generator"] = _Generator__WEBPACK_IMPORTED_MODULE_0__.Generator;


/**
                                  * Computational geometry library extension
                                  */var
MSDFExtension = /*#__PURE__*/function (_av$Extension) {_inherits(MSDFExtension, _av$Extension);var _super = _createSuper(MSDFExtension);

  function MSDFExtension(viewer, options) {_classCallCheck(this, MSDFExtension);return _super.call(this,
    viewer, options);
  }_createClass(MSDFExtension, [{ key: "load", value: function load()

    {return true;} }, { key: "unload", value: function unload()
    {return true;} }, { key: "activate", value: function activate()
    {return true;} }, { key: "deactivate", value: function deactivate()
    {return false;} }]);return MSDFExtension;}(av.Extension);


Autodesk.Viewing.theExtensionManager.registerExtension('Autodesk.MSDF', MSDFExtension);
})();

Autodesk.Extensions.MSDF = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=MSDF.js.map