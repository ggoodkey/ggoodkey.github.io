define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // Avoid `console` errors in browsers that lack a console.
    (function () {
        var method;
        var noop = function () { };
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = window.console || {};
        while (length--) {
            method = methods[length];
            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }
    }());
    // import Base64 from "./base64";
    // // import { debug } from "./debugmode";
    // export function shuffle(array) {
    // 	var len = array.length,
    // 		halfLen = Math.ceil(len / 2),
    // 		random = Base64.rand(halfLen).split(""),
    // 		r = 0;
    // 	//shuffle cards
    // 	if (len > 0) {
    // 		for (var reps = 0; reps < 2 || reps < len / 10; reps++) {
    // 			//split the deck
    // 			var array1 = array.slice(0, halfLen),
    // 				array2 = array.slice(halfLen, len);
    // 			for (var a = 0; a < array1.length; a++) {
    // 				//	debug(array[a]);
    // 				array2.splice(a + Number(random[r]), 0, array1[a]);
    // 				r++;
    // 				if (r > len / 2) r = 0;
    // 			}
    // 			array = array2;
    // 			array.push(array.shift());
    // 			r = 0;
    // 		}
    // 	}
    // 	return array;
    // }
    /*eg. email('bob123','gmail.com','Hi Bob');*/
    function email(username, domain, subject, message) {
        username = username.replace(/[^A-Za-z0-9\&\'\+\-_\.]/g, "");
        domain = domain.replace(/[^A-Za-z0-9\-\.\_\:\[\]]/g, "");
        var query = subject || message ? "?" : "", joiner = subject && message ? "&" : "";
        subject = subject ? "subject=" + subject : "";
        message = message ? "body=" + message : "";
        window.location.href = encodeURI("mailto" + ":" + username + "@" + domain + query + subject + joiner + message);
    }
    exports.email = email;
    // export function toggleFullScreen() {
    // 	var doc = window.document,
    // 		docEl = doc.documentElement,
    // 		requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen,
    // 		cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    // 	if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) requestFullScreen.call(docEl);
    // 	else cancelFullScreen.call(doc);
    // 	doc = null; docEl = null; requestFullScreen = null; cancelFullScreen = null;
    // }
    function getWidth() {
        var xWidth = 0;
        if (window.innerWidth !== null)
            xWidth = window.innerWidth;
        else if (window.screen !== null)
            xWidth = window.screen.availWidth;
        else if (document.body !== null)
            xWidth = document.body.clientWidth;
        return xWidth;
    }
    exports.getWidth = getWidth;
    function getHeight() {
        var xHeight = 0;
        if (window.innerHeight !== null)
            xHeight = window.innerHeight;
        else if (window.screen !== null)
            xHeight = window.screen.availHeight;
        else if (document.body !== null)
            xHeight = document.body.clientHeight;
        return xHeight;
    }
    exports.getHeight = getHeight;
    /*Initiate this function in the the window.onload event
    *     i.e. window.onload = readFile("browseButton1","scriptOutput",".png","image");
    * formInputId is id of <input type="file" accept=".csv" id="browseButton1"/> (in this case it would be "browseButton1")
    * divOutputId is the id of the <div id="fileOutput"></div> where the file contents will go in the page
    * readAs accepts "text", "image", "binary", or "array" (defaults to text)
    * fileExtension could be ".txt", ".png", ".csv", etc. (defaults to .csv)*/
    // export function readFile(formInputId, divOutputId, fileExtension, readAs) {
    // 	if (window.File && window.FileReader && window.FileList && window.Blob) {
    // 		document.getElementById(formInputId).addEventListener('change', function (e) {
    // 			var file = document.getElementById(formInputId).files[0],/* FileList object*/
    // 			path = document.getElementById(formInputId).value.replace(/\\/g, "/");
    // 			fileExtension = fileExtension ? fileExtension : ".csv";
    // 			var ext = new RegExp(fileExtension + "$", "gi");
    // 			if (path.match(ext) === fileExtension) /* verify file extension*/ {
    // 				var reader = new FileReader();
    // 				reader.onload = function (e) {
    // 					document.getElementById(divOutputId).value = reader.result;
    // 					return reader.result;
    // 				};
    // 				if (readAs === "image") reader.readAsDataURL(file);
    // 				if (readAs === "binary") reader.readAsBinaryString(file);
    // 				if (readAs === "array") reader.readAsArrayBuffer(file);
    // 				else reader.readAsText(file);
    // 			}
    // 			else {
    // 				alert("File type not supported! Expected " + fileExtension);
    // 			}
    // 		}, false);
    // 	}
    // 	else {
    // 		var msg = "";
    // 		if (!window.File) msg = "File API is not supported. ";
    // 		if (!window.FileReader) msg = msg + "FileReader API is not supported: This means that browsing for the CSV file wont work, but you can still copy and paste the file contents into the text box instead. ";
    // 		if (!window.FileList) msg = msg + "FileList API is not supported. ";
    // 		if (!window.Blob) msg = msg + "Blob API is not supported. ";
    // 		alert(msg);
    // 		debug("This application uses certain features which are not fully supported in this browser.<br /><br />" + msg + "<br /><br />Make sure you browser is up to date, or try running the application in a different web browser.");
    // 	}
    // }
    /*This function returns the CSS style of an element that hasn't been created in the DOM yet
    *Works where jQuery $(".class").css("prop") fails*/
    // export function getCSS(fromClass, prop) {
    // 	var $i = $("<div>").css('display', 'none').addClass(fromClass);
    // 	$("body").append($i); /* add to DOM, in order to read the CSS property*/
    // 	try { return $i.css(prop); }
    // 	finally { $i.remove(); } /* and remove from DOM*/
    // }
    // export function getExtraPxY(id) {
    // 	if (id[0] !== "#") id = "#" + id;
    // 	return parseInt($(id).css("padding-top")) + parseInt($(id).css("padding-bottom")) + parseInt($(id).css("margin-top")) +
    // 	parseInt($(id).css("margin-bottom")) + parseInt($(id).css("border-top-width")) + parseInt($(id).css("border-bottom-width"));
    // }
    // export function getExtraPxX(id) {
    // 	if (id[0] !== "#") id = "#" + id;
    // 	return parseInt($(id).css("padding-right")) + parseInt($(id).css("padding-left")) + parseInt($(id).css("margin-right")) +
    // 	parseInt($(id).css("margin-left")) + parseInt($(id).css("border-right-width")) + parseInt($(id).css("border-left-width"));
    // }
    /*adds leading zeros to a list of numbers so they can be sorted using sort() function*/
    function toSortableNumbers(arr) {
        var hig = parseInt(arr[0]), /*highest number in array*/ len = arr.length;
        /*find the highest number used*/
        for (var a = 0; a < len; a++)
            hig = hig <= parseInt(arr[a]) ? parseInt(arr[a]) : hig;
        for (var b = 0, higLen = String(hig).length; b < len; b++)
            while (higLen > String(arr[b]).length)
                arr[b] = "0" + arr[b];
        hig = null;
        len = null;
        return arr;
    }
    exports.toSortableNumbers = toSortableNumbers;
    /*delete duplicate values held in an array
    note: deleteDuplicates converts non String values to Strings first :. "1" matches 1
    also handles multi dimensional arrays*/
    function deleteDuplicates(arr) {
        for (var x = 0, len = arr.length; x < len - 1; x++) {
            for (var y = x + 1; y < len; y++) {
                if (String(arr[x]) === String(arr[y])) {
                    arr.splice(y, 1);
                    len--;
                    y--;
                }
            }
        }
        return arr;
    }
    exports.deleteDuplicates = deleteDuplicates;
    /*arr = an Array
    min = the minimum number of repeats to find to be considered a match,
    i.e. 2 = find duplicates, 3 = find triplicates...
    note: findMatches converts non String values to Strings first :. "1" matches 1*/
    function findMatches(arr, min) {
        min = min || 2;
        if (min === 1)
            return arr;
        var ret = [], /*return array*/ a = 0, mat = false; /*match found*/
        arr = arr.sort();
        for (var x = 0, y = x + 1, len = arr.length; x < len - min + 1; x++, y = x + 1) {
            if (String(arr[x]) === String(arr[y])) {
                mat = true;
                for (var b = 0; b < min - 1; b++) {
                    if (arr[x] !== arr[y + b])
                        mat = false;
                }
                if (mat === true) {
                    ret[a] = arr[x];
                    x = x + min - 1;
                    a++;
                }
            }
        }
        arr = null;
        a = null;
        mat = null;
        min = null;
        return ret;
    }
    exports.findMatches = findMatches;
    /* Changes XML to JSON*/
    function xmlToJson(xml) {
        /* Create the return object*/
        var obj = {};
        if (xml.nodeType === 1) { /* element*/
            /* do attributes*/
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        }
        else if (xml.nodeType === 3) { /* text*/
            obj = xml.nodeValue;
        }
        /* do children*/
        if (xml.hasChildNodes()) {
            for (var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof obj[nodeName] === "undefined") {
                    obj[nodeName] = xmlToJson(item);
                }
                else {
                    if (typeof obj[nodeName].push === "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                }
            }
        }
        return obj;
    }
    exports.xmlToJson = xmlToJson;
    function csv2json(strData, strDelimiter) {
        function clean(s) {
            s = s.replace(/&#/g, "& #"); /*catches a bug if a cell contains the ASCII character escape sequence &#2*/
            s = s.replace(/_x000D_\n/g, " "); /*catches a bug if a cell contains multiple lines of data*/
            s = s.replace(/," \n",/g, ",,"); /*catches a bug found if a cell contains just a space and the newline character (return)*/
            s = s.replace(/^\s+|\s+$/g, ""); /*replace whitespace at the start or end of the string*/
            return s;
        }
        // get the string delimiter specified in the file (Microsoft Office format)
        if (/^sep=/.test(strData)) {
            strDelimiter = strData.charAt(4);
            var reg = new RegExp("^sep=" + strDelimiter);
            strData = strData.replace(reg, "");
        }
        else
            strDelimiter = strDelimiter || ",";
        strData = clean(strData);
        var objPattern = new RegExp("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" + "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + "([^\"\\" + strDelimiter + "\\r\\n]*))", "gi"), arrData = [[]], arrMatches = null;
        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec(strData)) {
            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[1];
            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If it does not, then we know
            // that this delimiter is a row delimiter.
            if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter) {
                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push([]);
            }
            var strMatchedValue;
            if (arrMatches[2]) {
                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g"), "\"");
            }
            else {
                // We found a non-quoted value.
                strMatchedValue = arrMatches[3];
            }
            // Now that we have our value string, let's add
            // it to the data array.
            arrData[arrData.length - 1].push(strMatchedValue);
        }
        var variableNames = [];
        /*convert table header names to valid variable names*/
        for (var a = 0; a < arrData[0].length; a++) {
            /*reduced set of valid characters*/
            variableNames[a] = String(arrData[0][a]).replace(/\-/g, "_").replace(/[^A-Z\_a-z0-9]/g, "");
            /*if it starts with a number, add an underscore in front*/
            if (/[0-9]/.test(variableNames[a].charAt(0)))
                variableNames[a] = "_" + variableNames[a];
            /*ensure it isn't a reserved javascript word by converting first letter to uppercase*/
            if (/[a-z]/.test(variableNames[a].charAt(0)))
                variableNames[a] = variableNames[a].charAt(0).toUpperCase() + variableNames[a].slice(1);
            /*convert reserved words that are uppercase, NaN and Infinity, to all caps*/
            if (variableNames[a] === "NaN" || variableNames[a] === "Infinity")
                variableNames[a] = variableNames[a].toUpperCase();
            if (variableNames[a] === "")
                variableNames[a] = "Column" + (a + 1);
        }
        /*make sure every name is unique*/
        for (var d = 0, b = d + 1, c = void 0; d < variableNames.length; d++, b = d + 1) {
            c = 2;
            while (b < variableNames.length) {
                if (variableNames[d] === variableNames[b]) {
                    variableNames[b] = variableNames[b] + c;
                    c++;
                }
                b++;
            }
            if (c > 2)
                variableNames[d] = variableNames[d] + "1";
        }
        var jsonData = {
            Headers: [],
            Rows: []
        };
        jsonData.Headers = variableNames;
        if (variableNames.join("") !== arrData[0].join(""))
            jsonData.CSVHeaders = arrData[0];
        jsonData.Rows = [];
        /*convert table from array of arrays to array of objects*/
        for (var f = 1, h = 0, obj = void 0, e = void 0, g = void 0, i = void 0; f < arrData.length; f++) {
            jsonData.Rows[h] = {};
            obj = {};
            e = 0;
            g = 0;
            for (i in jsonData.Headers) {
                if (arrData[f][g]) {
                    obj[jsonData.Headers[i]] = arrData[f][g];
                    e++;
                }
                g++;
            }
            if (e !== 0) {
                jsonData.Rows[h] = obj;
                h++;
            }
        }
        return jsonData;
    }
    exports.csv2json = csv2json;
    function json2csv(jsondata, headersArray, separator, textdelim) {
        var sep = separator || ",", del = textdelim || "\"", hdrs = headersArray || [], ret = [], r = 1, h = 0, rows = jsondata.Rows || jsondata;
        if (typeof jsondata === "string")
            return null; /* JSON text parsing is not implemented (yet)*/
        if (hdrs.length === 0) {
            for (var a in jsondata.Headers) {
                if (jsondata.Headers.hasOwnProperty(a)) {
                    hdrs[h] = del + jsondata.Headers[a] + del;
                    h++;
                }
            }
        }
        if (jsondata.CSVHeaders)
            ret[0] = jsondata.CSVHeaders.join(sep);
        else
            ret[0] = hdrs.join(sep);
        for (var c in rows) {
            var dataArray = [];
            for (var b = 0; b < hdrs.length; b++) {
                var data = rows[c][hdrs[b]];
                if (data) {
                    dataArray[b] = /,|\r|\n/.test(data) ? del + data + del : data;
                    dataArray[b] = dataArray[b].replace(/"/g, '""');
                }
                else
                    dataArray[b] = "";
            }
            ret[r] = dataArray.join(sep);
            r++;
        }
        return "sep=" + sep + "\n" + ret.join("\n");
    }
    exports.json2csv = json2csv;
    /*converts camelCase to Camel Case*/
    function fromCamelCase(str) {
        str = str.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1");
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    exports.fromCamelCase = fromCamelCase;
    /*   ____________
        |            |    A Javascript parser for vCards
        |  vCard.js  |    Created by Mattt Thompson, 2008
        |            |    Released under the MIT License
    */
    /* Adding Javascript 1.6 Compatibility */
    // if (!Array.prototype.forEach) {
    // 	Array.prototype.forEach = function (d, c) { c = c || this; for (var b = 0, a = this.length; b < a; b++) { d.call(c, this[b], b, this); } };
    // }
    // if (typeof Prototype !== "undefined" || !Array.prototype.map) {
    // 	Array.prototype.map = function (d, c) {
    // 		c = c || this;
    // 		var e = [];
    // 		for (var b = 0, a = this.length; b < a; b++) {
    // 			e.push(d.call(c, this[b], b, this));
    // 		}
    // 		return e;
    // 	};
    // }
    // if (typeof Prototype !== "undefined" || !Array.prototype.filter) {
    // 	Array.prototype.filter = function (d, c) {
    // 		c = c || this;
    // 		var e = [];
    // 		for (var b = 0, a = this.length; b < a; b++) {
    // 			if (d.call(c, this[b], b, this)) {
    // 				e.push(this[b]);
    // 			}
    // 		}
    // 		return e;
    // 	};
    // }
    // ["forEach", "map", "filter", "slice", "concat"].forEach(function (a) {
    // 	if (!Array[a]) {
    // 		Array[a] = function (b) {
    // 			return this.prototype[a].apply(b, Array.prototype.slice.call(arguments, 1));
    // 		};
    // 	}
    // });
    // Date.ISO8601PartMap = { Year: 1, Month: 3, Date: 5, Hours: 7, Minutes: 8, Seconds: 9 };
    // Date.matchISO8601 = function (a) {
    // 	return a.match(/^(\d{4})(-?(\d{2}))?(-?(\d{2}))?(T(\d{2}):?(\d{2})(:?(\d{2}))?)?(Z?(([+\-])(\d{2}):?(\d{2})))?$/);
    // };
    // Date.parseISO8601 = function (e) {
    // 	var b = this.matchISO8601(e);
    // 	if (b) {
    // 		var a = new Date, c, d = 0; for (var f in this.ISO8601PartMap) {
    // 			if (part === b[this.ISO8601PartMap[f]]) {
    // 				a["set" + f](f === "Month" ? parseInt(part) - 1 : parseInt(part));
    // 			} else {
    // 				a["set" + f](f === "Date" ? 1 : 0);
    // 			}
    // 		}
    // 		if (b[11]) {
    // 			d = parseInt(b[14]) * 60 + parseInt(b[15]);
    // 			d *= parseInt[13] === "-" ? 1 : -1;
    // 		}
    // 		d -= a.getTimezoneOffset();
    // 		a.setTime(a.getTime() + d * 60 * 1000);
    // 		return a;
    // 	}
    // };
    // /*get the 'length' of an Object*/
    // if (!Object.size) {
    // 	Object.size = function (obj) {
    // 		var size = 0, key;
    // 		for (key in obj) {
    // 			if (obj.hasOwnProperty(key)) size++;
    // 		}
    // 		return size;
    // 	};
    // }
    // /*sort an Object alphabetically A-z*/
    // if (!Object.sort) {
    // 	Object.sort = function (obj) {
    // 		var sorted = {}, key, a = [];
    // 		for (key in obj) {
    // 			if (obj.hasOwnProperty(key)) a.push(key);
    // 		}
    // 		a.sort();
    // 		for (key = 0; key < a.length; key++) sorted[a[key]] = obj[a[key]];
    // 		return sorted;
    // 	};
    // }
    // /*check if an Object is empty*/
    // if (!Object.isEmpty) {
    // 	Object.isEmpty = function (obj) {
    // 		for (var prop in obj) {
    // 			if (obj.hasOwnProperty(prop)) return false;
    // 		}
    // 		return true;
    // 	};
    // }
    if (!Object.assign) {
        Object.defineProperty(Object, 'assign', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: function (target) {
                'use strict';
                if (target === undefined || target === null) {
                    throw new TypeError('Cannot convert first argument to object');
                }
                var to = Object(target);
                for (var i = 1; i < arguments.length; i++) {
                    var nextSource = arguments[i];
                    if (nextSource === undefined || nextSource === null) {
                        continue;
                    }
                    nextSource = Object(nextSource);
                    var keysArray = Object.keys(Object(nextSource));
                    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                        var nextKey = keysArray[nextIndex];
                        var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                        if (desc !== undefined && desc.enumerable) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
                return to;
            }
        });
    }
    // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
    if (!Object.keys) {
        Object.keys = (function () {
            'use strict';
            var hasOwnProperty = Object.prototype.hasOwnProperty, hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString'), dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ], dontEnumsLength = dontEnums.length;
            return function (obj) {
                if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                    throw new TypeError('Object.keys called on non-object');
                }
                var result = [], i;
                for (var prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }
                if (hasDontEnumBug) {
                    for (i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    }
                }
                return result;
            };
        }());
    }
});
// Array.prototype.clone = function () {
// 	var arr = this.slice(0);
// 	for (var i = 0; i < this.length; i++) {
// 		if (this[i].clone) {
// 			//recursion
// 			arr[i] = this[i].clone();
// 		}
// 	}
// 	return arr;
// };
//# sourceMappingURL=common.js.map