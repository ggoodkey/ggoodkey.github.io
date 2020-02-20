var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("validate", ["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var VAL = {
        /*replace non-alphabetic charactors with spaces or specified replacer */
        validate: function (words, replacer) {
            if (!words)
                return "";
            var w = words.toString();
            var r = replacer || " ";
            words = null;
            replacer = null;
            w = VAL.toEnglishAlphabet(w);
            w = w.toLowerCase().replace(/[^a-z]/g, r);
            var x = new RegExp(r + r, "g");
            while (x.test(w))
                w = w.replace(/\s\s/g, r);
            w = w.replace(/^\s+|\s+$/g, ""); /*remove whitespace at begining and end of the string	*/
            return w;
        },
        removeHTMLTags: function (str) {
            return String(str).replace(/<[^>]+>/g, "");
        },
        escapeRegExpChars: function (str) {
            if (!str)
                return "";
            var x = str.toString();
            x = x.replace(/\./g, "\\.");
            x = x.replace(/\\/g, "\\\\");
            x = x.replace(/\+/g, "\\+");
            x = x.replace(/\*/g, "\\*");
            x = x.replace(/\?/g, "\\?");
            x = x.replace(/\[/g, "\\[");
            x = x.replace(/\^/g, "\\^");
            x = x.replace(/\]/g, "\\]");
            x = x.replace(/\$/g, "\\$");
            x = x.replace(/\(/g, "\\(");
            x = x.replace(/\)/g, "\\)");
            x = x.replace(/\{/g, "\\{");
            x = x.replace(/\}/g, "\\}");
            x = x.replace(/\=/g, "\\=");
            x = x.replace(/\!/g, "\\!");
            x = x.replace(/\</g, "\\<");
            x = x.replace(/\>/g, "\\>");
            x = x.replace(/\|/g, "\\|");
            x = x.replace(/\:/g, "\\:");
            x = x.replace(/\-/g, "\\-");
            return x;
        },
        toEnglishAlphabet: function (str) {
            if (!str)
                return "";
            var w = str.toString();
            if (/[\xC0-\xDF]/.test(w)) {
                w = w.replace(/[\xC0-\xC5]/g, "A");
                w = w.replace(/\xC6/g, "AE");
                w = w.replace(/\xC7/g, "C");
                w = w.replace(/[\xC8-\xCB]/g, "E");
                w = w.replace(/[\xCC-\xCF]/g, "I");
                w = w.replace(/\xD0/g, "D");
                w = w.replace(/\xD1/g, "N");
                w = w.replace(/[\xD2-\xD8]/g, "O");
                w = w.replace(/[\xD9-\xDC]/g, "U");
                w = w.replace(/\xDD/g, "Y");
                w = w.replace(/\xDE/g, "P");
                w = w.replace(/\xDF/g, "B");
            }
            if (/[\xE0-\xFE]/.test(w)) {
                w = w.replace(/[\xE0-\xE5]/g, "a");
                w = w.replace(/\xE6/g, "ae");
                w = w.replace(/\xE7/g, "c");
                w = w.replace(/[\xE8-\xEB]/g, "e");
                w = w.replace(/[\xEC-\xEF]/g, "i");
                w = w.replace(/\xF0/g, "d");
                w = w.replace(/\xF1/g, "n");
                w = w.replace(/[\xF2-\xF8]/g, "o");
                w = w.replace(/[\xF9-\xFC]/g, "u");
                w = w.replace(/\xFD|\xFF/g, "y");
                w = w.replace(/\xFE/g, "p");
            }
            return w;
        },
        //TODO: needs work
        toHTMLSafeAlphabet: function (str) {
            if (typeof str === "number")
                return str;
            else if (!str)
                return "";
            str = str.toString();
            str = str.replace(/&/g, "&amp;");
            str = str.replace(/</g, "&lt;");
            str = str.replace(/>/g, "&gt;");
            return str;
        },
        /*replace non-alphabetic or numeric charactors with underscore */
        toVarName: function (str) {
            //reserved and common Javascript words
            var r = ["alert", "all", "anchor", "anchors", "area", "assign", "blur", "button", "checkbox", "clearInterval", "clearTimeout",
                "clientInformation", "close", "closed", "confirm", "constructor", "crypto", "decodeURI", "decodeURIComponent",
                "defaultStatus", "document", "element", "elements", "embed", "embeds", "encodeURI", "encodeURIComponent", "escape", "event",
                "fileUpload", "focus", "form", "forms", "frame", "innerHeight", "innerWidth", "layer", "layers", "link", "location",
                "mimeTypes", "navigate", "navigator", "frames", "frameRate", "hidden", "history", "image", "images", "offscreenBuffering",
                "open", "opener", "option", "outerHeight", "outerWidth", "packages", "pageXOffset", "pageYOffset", "parent", "parseFloat",
                "parseInt", "password", "pkcs11", "plugin", "prompt", "propertyIsEnum", "radio", "reset", "screenX", "screenY", "scroll",
                "secure", "select", "self", "setInterval", "setTimeout", "status", "submit", "taint", "text", "textarea", "top", "unescape",
                "untaint", "window", "Array", "Date", "eval", "function", "hasOwnProperty", "Infinity", "isFinite", "isNaN", "isPrototypeOf",
                "length", "Math", "NaN", "name", "Number", "Object", "prototype", "String", "toString", "undefined", "valueOfabstract",
                "arguments", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default",
                "delete", "do", "double", "else", "enum", "eval", "export", "extends", "false", "final", "finally", "float", "for",
                "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "let", "long", "native", "new",
                "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this",
                "throw", "throws", "transient", "true", "try", "typeof", "var", "void", "volatile", "while", "with", "yield", "onblur",
                "onclick", "onerror", "onfocus", "onkeydown", "onkeypress", "onkeyup", "onmouseover", "onload", "onmouseup", "onmousedown",
                "onsubmit", "$", "jQuery", "Lawnchair", "Dropbox", "Base64", "WinJS", "cordova", "APP", "COM", "VAL", "getClass", "java",
                "JavaArray", "javaClass", "JavaObject", "JavaPackage", "debug", "Promise"];
            if (str === null || str === undefined)
                return "_undefined";
            str = String(str).replace(/ /g, "_").replace(/[^A-z0-9_]/g, "");
            if (/\d/.test(str.charAt(0)) || r.indexOf(str) > -1)
                str = "_" + str;
            return str;
        },
        toPropName: function (str) {
            if (str === null || str === undefined)
                return "_undefined";
            str = String(str).replace(/ /g, "_").replace(/[^A-z0-9_]/g, "");
            if (str === "")
                return "_";
            if (/\d/.test(str.charAt(0)))
                return "_" + str;
            return str;
        },
        trim: function (str) {
            str = String(str);
            while (/\s\s/g.test(str))
                str = str.replace(/\s\s/g, " ");
            if (str === " ")
                return "";
            return str.replace(/^\s+|\s+$/g, "");
        }
    };
    exports.default = VAL;
});
/*!
* Base64 performs several functions:
* Compress a string to base64, Diffie Hellman Merkle key exchange,
* SHA256 hash, and generate high entropy random numbers.
* Generated public Keys are numeric and 300 digits in length (~1000 bit equivelent).
*
* Last Modified: November 16, 2019
* Copyright (C) 2019 Graeme Goodkey github.com/ggoodkey
* All rights reserved
*
* Released free of charge for inclusion in your own applications, as is or as modified by you.
* DISTRIBUTED "AS IS", WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
*
* Converting to Base 64 is based on Vassilis Petroulias' base64v1_0.js
* http://jsbase64.codeplex.com/
*
* Compression is based on Sam Hocevar's lz-string-1.3.3.js
* http://pieroxy.net/blog/pages/lz-string/index.html
*
* Handling big integers is a subset of BigInteger.js by peterolson
* https://www.npmjs.com/package/big-integer/
*
*/
/* eslint-disable */
define("base64-bundle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Base64 = {};
    (function () {
        Base64.Version = 1.2;
        /*base 64 charectors*/
        var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", hexAlf = '00,01,02,03,04,05,06,07,08,09,0a,0b,0c,0d,0e,0f,10,11,12,13,14,15,16,17,18,19,1a,1b,1c,1d,1e,1f,20,21,22,23,24,25,26,27,28,29,2a,2b,2c,2d,2e,2f,30,31,32,33,34,35,36,37,38,39,3a,3b,3c,3d,3e,3f,40,41,42,43,44,45,46,47,48,49,4a,4b,4c,4d,4e,4f,50,51,52,53,54,55,56,57,58,59,5a,5b,5c,5d,5e,5f,60,61,62,63,64,65,66,67,68,69,6a,6b,6c,6d,6e,6f,70,71,72,73,74,75,76,77,78,79,7a,7b,7c,7d,7e,7f,80,81,82,83,84,85,86,87,88,89,8a,8b,8c,8d,8e,8f,90,91,92,93,94,95,96,97,98,99,9a,9b,9c,9d,9e,9f,a0,a1,a2,a3,a4,a5,a6,a7,a8,a9,aa,ab,ac,ad,ae,af,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,ba,bb,bc,bd,be,bf,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,ca,cb,cc,cd,ce,cf,d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,da,db,dc,dd,de,df,e0,e1,e2,e3,e4,e5,e6,e7,e8,e9,ea,eb,ec,ed,ee,ef,f0,f1,f2,f3,f4,f5,f6,f7,f8,f9,fa,fb,fc,fd,fe,ff'.split(','), 
        //100 digit fast
        //prime = "6513516734600035718300327211250928237178281758494417357560086828416863929270451437126021949850746381";
        //300 digit
        prime = "319705304701141539155720137200974664666792526059405792539680974929469783512821793995613718943171723765238853752439032835985158829038528214925658918372196742089464683960239919950882355844766055365179937610326127675178857306260955550407044463370239890187189750909036833976197804646589380690779463976173";
        //644 digit slow
        //prime = "1475979915214180235084898622737381736312066145333169775147771216478570297878078949377407337049389289382748507531496480477281264838760259191814463365330269540496961201113430156902396093989090226259326935025281409614983499388222831448598601834318536230923772641390209490231836446899608210795482963763094236630945410832793769905399982457186322944729636418890623372171723742105636440368218459649632948538696905872650486914434637457507280441823676813517852099348660847172579408422316678097670224011990280170474894487426924742108823536808485072502240519452587542875349976558572670229633962575212637477897785501552646522609988869914013540483809865681250419497686697771007";
        function toHex(arr) {
            var hex = '';
            for (var i = 0, len = arr.length; i < len; i++) {
                hex += hexAlf[arr[i]];
            }
            return hex;
        }
        /*compress and convert text to Base64*/
        function convertTo(input) {
            if (input === null)
                return "";
            var output = "", orig = input;
            var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
            var i, value, context_dictionary = {}, context_dictionaryToCreate = {}, context_c = "", context_wc = "", context_w = "", context_enlargeIn = 2, // Compensate for the first entry which should not count
            context_dictSize = 3, context_numBits = 2, context_data_string = "", context_data_val = 0, context_data_position = 0, ii, f = String.fromCharCode;
            for (ii = 0; ii < input.length; ii += 1) {
                context_c = input.charAt(ii);
                if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
                    context_dictionary[context_c] = context_dictSize++;
                    context_dictionaryToCreate[context_c] = true;
                }
                context_wc = context_w + context_c;
                if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
                    context_w = context_wc;
                }
                else {
                    if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                        if (context_w.charCodeAt(0) < 256) {
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = context_data_val << 1;
                                if (context_data_position === 15) {
                                    context_data_position = 0;
                                    context_data_string += f(context_data_val);
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                            }
                            value = context_w.charCodeAt(0);
                            for (i = 0; i < 8; i++) {
                                context_data_val = context_data_val << 1 | value & 1;
                                if (context_data_position === 15) {
                                    context_data_position = 0;
                                    context_data_string += f(context_data_val);
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        else {
                            value = 1;
                            for (i = 0; i < context_numBits; i++) {
                                context_data_val = context_data_val << 1 | value;
                                if (context_data_position === 15) {
                                    context_data_position = 0;
                                    context_data_string += f(context_data_val);
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = 0;
                            }
                            value = context_w.charCodeAt(0);
                            for (i = 0; i < 16; i++) {
                                context_data_val = context_data_val << 1 | value & 1;
                                if (context_data_position === 15) {
                                    context_data_position = 0;
                                    context_data_string += f(context_data_val);
                                    context_data_val = 0;
                                }
                                else {
                                    context_data_position++;
                                }
                                value = value >> 1;
                            }
                        }
                        context_enlargeIn--;
                        if (context_enlargeIn === 0) {
                            context_enlargeIn = Math.pow(2, context_numBits);
                            context_numBits++;
                        }
                        delete context_dictionaryToCreate[context_w];
                    }
                    else {
                        value = context_dictionary[context_w];
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = context_data_val << 1 | value & 1;
                            if (context_data_position === 15) {
                                context_data_position = 0;
                                context_data_string += f(context_data_val);
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn === 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    // Add wc to the dictionary.
                    context_dictionary[context_wc] = context_dictSize++;
                    context_w = String(context_c);
                }
            }
            // Output the code for w.
            if (context_w !== "") {
                if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
                    if (context_w.charCodeAt(0) < 256) {
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = context_data_val << 1;
                            if (context_data_position === 15) {
                                context_data_position = 0;
                                context_data_string += f(context_data_val);
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 8; i++) {
                            context_data_val = context_data_val << 1 | value & 1;
                            if (context_data_position === 15) {
                                context_data_position = 0;
                                context_data_string += f(context_data_val);
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    else {
                        value = 1;
                        for (i = 0; i < context_numBits; i++) {
                            context_data_val = context_data_val << 1 | value;
                            if (context_data_position === 15) {
                                context_data_position = 0;
                                context_data_string += f(context_data_val);
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = 0;
                        }
                        value = context_w.charCodeAt(0);
                        for (i = 0; i < 16; i++) {
                            context_data_val = context_data_val << 1 | value & 1;
                            if (context_data_position === 15) {
                                context_data_position = 0;
                                context_data_string += f(context_data_val);
                                context_data_val = 0;
                            }
                            else {
                                context_data_position++;
                            }
                            value = value >> 1;
                        }
                    }
                    context_enlargeIn--;
                    if (context_enlargeIn === 0) {
                        context_enlargeIn = Math.pow(2, context_numBits);
                        context_numBits++;
                    }
                    delete context_dictionaryToCreate[context_w];
                }
                else {
                    value = context_dictionary[context_w];
                    for (i = 0; i < context_numBits; i++) {
                        context_data_val = context_data_val << 1 | value & 1;
                        if (context_data_position === 15) {
                            context_data_position = 0;
                            context_data_string += f(context_data_val);
                            context_data_val = 0;
                        }
                        else {
                            context_data_position++;
                        }
                        value = value >> 1;
                    }
                }
                context_enlargeIn--;
                if (context_enlargeIn === 0) {
                    context_enlargeIn = Math.pow(2, context_numBits);
                    context_numBits++;
                }
            }
            // Mark the end of the stream
            value = 2;
            for (i = 0; i < context_numBits; i++) {
                context_data_val = context_data_val << 1 | value & 1;
                if (context_data_position === 15) {
                    context_data_position = 0;
                    context_data_string += f(context_data_val);
                    context_data_val = 0;
                }
                else {
                    context_data_position++;
                }
                value = value >> 1;
            }
            // Flush the last char
            while (true) {
                context_data_val = context_data_val << 1;
                if (context_data_position === 15) {
                    context_data_string += f(context_data_val);
                    break;
                }
                else
                    context_data_position++;
            }
            function toBase64(input) {
                var i = 0;
                while (i < input.length * 2) {
                    if (i % 2 == 0) {
                        chr1 = input.charCodeAt(i / 2) >> 8;
                        chr2 = input.charCodeAt(i / 2) & 255;
                        if (i / 2 + 1 < input.length)
                            chr3 = input.charCodeAt(i / 2 + 1) >> 8;
                        else
                            chr3 = NaN;
                    }
                    else {
                        chr1 = input.charCodeAt((i - 1) / 2) & 255;
                        if ((i + 1) / 2 < input.length) {
                            chr2 = input.charCodeAt((i + 1) / 2) >> 8;
                            chr3 = input.charCodeAt((i + 1) / 2) & 255;
                        }
                        else
                            chr2 = chr3 = NaN;
                    }
                    i += 3;
                    enc1 = chr1 >> 2;
                    enc2 = (chr1 & 3) << 4 | chr2 >> 4;
                    enc3 = (chr2 & 15) << 2 | chr3 >> 6;
                    enc4 = chr3 & 63;
                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    }
                    else if (isNaN(chr3)) {
                        enc4 = 64;
                    }
                    output = output +
                        charset.charAt(enc1) + charset.charAt(enc2) +
                        charset.charAt(enc3) + charset.charAt(enc4);
                }
                return output;
            }
            //constants represent the state of the data, whether or not 
            //it has been compressed so that the process can be reversed
            var compressed = toBase64("l" + context_data_string);
            orig = toBase64("n" + orig);
            //only use compressed version if it is indeed smaller,
            //as lzstring compression actually lengthens short, or already
            //highly compressed strings
            if (compressed.length > orig.length)
                compressed = orig;
            return "b" + compressed;
        }
        /*revert from compressed Base64 text to regular text*/
        function revertFrom(input) {
            if (input === null) {
                console.log("Decompression error1: Input is null");
                return "";
            }
            if (/^b/.test(input))
                input = input.replace(/^b/, "");
            else {
                //console.log("Decompression error2: Input is not base64 compressed >>> " + input);
                return null;
            }
            var output = "", ol = 0, output_ = 0, chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0, f = String.fromCharCode;
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
            while (i < input.length) {
                enc1 = charset.indexOf(input.charAt(i++));
                enc2 = charset.indexOf(input.charAt(i++));
                enc3 = charset.indexOf(input.charAt(i++));
                enc4 = charset.indexOf(input.charAt(i++));
                chr1 = enc1 << 2 | enc2 >> 4;
                chr2 = (enc2 & 15) << 4 | enc3 >> 2;
                chr3 = (enc3 & 3) << 6 | enc4;
                if (ol % 2 == 0) {
                    output_ = chr1 << 8;
                    if (enc3 !== 64) {
                        output += f(output_ | chr2);
                    }
                    if (enc4 !== 64) {
                        output_ = chr3 << 8;
                    }
                }
                else {
                    output = output + f(output_ | chr1);
                    if (enc3 !== 64) {
                        output_ = chr2 << 8;
                    }
                    if (enc4 !== 64) {
                        output += f(output_ | chr3);
                    }
                }
                ol += 3;
            }
            ol = null;
            output_ = null;
            chr1 = null;
            chr2 = null;
            chr3 = null;
            enc1 = null;
            enc2 = null;
            enc3 = null;
            enc4 = null;
            //now decompress the data
            if (/^l/.test(output))
                var compressed = output.replace(/^l/, "");
            else
                return output.replace(/^n/, "");
            output = null;
            if (compressed === null) {
                console.log("Decompression error2: Reverted from Base64 value is null");
                return null;
            }
            if (compressed === "") {
                console.log('Decompression error3: Reverted from Base64 value is "" (Empty string)');
                return null;
            }
            var dictionary = [0, 1, 2, 3], enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = "", w, bits = 0, resb, maxpower = 4, power = 1, c, data = { string: compressed, val: compressed.charCodeAt(0), position: 32768, index: 1 };
            while (power != maxpower) {
                resb = data.val & data.position;
                data.position >>= 1;
                if (data.position === 0) {
                    data.position = 32768;
                    data.val = data.string.charCodeAt(data.index++);
                }
                bits |= (resb > 0 ? 1 : 0) * power;
                power <<= 1;
            }
            switch (bits) {
                case 0:
                    bits = 0;
                    maxpower = Math.pow(2, 8);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position === 0) {
                            data.position = 32768;
                            data.val = data.string.charCodeAt(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = f(bits);
                    break;
                case 1:
                    bits = 0;
                    maxpower = Math.pow(2, 16);
                    power = 1;
                    while (power != maxpower) {
                        resb = data.val & data.position;
                        data.position >>= 1;
                        if (data.position === 0) {
                            data.position = 32768;
                            data.val = data.string.charCodeAt(data.index++);
                        }
                        bits |= (resb > 0 ? 1 : 0) * power;
                        power <<= 1;
                    }
                    c = f(bits);
                    break;
                case 2:
                    return "";
            }
            dictionary[3] = c;
            w = result = c;
            while (true) {
                if (data.index > data.string.length) {
                    console.log("Decompression error5");
                    return "";
                }
                bits = 0;
                maxpower = Math.pow(2, numBits);
                power = 1;
                while (power != maxpower) {
                    resb = data.val & data.position;
                    data.position >>= 1;
                    if (data.position === 0) {
                        data.position = 32768;
                        data.val = data.string.charCodeAt(data.index++);
                    }
                    bits |= (resb > 0 ? 1 : 0) * power;
                    power <<= 1;
                }
                switch (c = bits) {
                    case 0:
                        bits = 0;
                        maxpower = Math.pow(2, 8);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position === 0) {
                                data.position = 32768;
                                data.val = data.string.charCodeAt(data.index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 1:
                        bits = 0;
                        maxpower = Math.pow(2, 16);
                        power = 1;
                        while (power != maxpower) {
                            resb = data.val & data.position;
                            data.position >>= 1;
                            if (data.position === 0) {
                                data.position = 32768;
                                data.val = data.string.charCodeAt(data.index++);
                            }
                            bits |= (resb > 0 ? 1 : 0) * power;
                            power <<= 1;
                        }
                        dictionary[dictSize++] = f(bits);
                        c = dictSize - 1;
                        enlargeIn--;
                        break;
                    case 2:
                        return result;
                }
                if (enlargeIn === 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++;
                }
                if (dictionary[c]) {
                    entry = dictionary[c];
                }
                else {
                    if (c === dictSize && w) {
                        entry = w + w.charAt(0);
                    }
                    else {
                        return null;
                    }
                }
                result += entry;
                // Add w+entry[0] to the dictionary.
                dictionary[dictSize++] = w + entry.charAt(0);
                enlargeIn--;
                w = entry;
                if (enlargeIn === 0) {
                    enlargeIn = Math.pow(2, numBits);
                    numBits++;
                }
            }
        }
        var bigInt = (function (undefined) {
            "use strict";
            var LOG_BASE = 7, MAX_INT = 9007199254740992, DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz", BigInt = BigInt || null;
            var supportsNativeBigInt = typeof BigInt === "function";
            function Integer(v, radix, alphabet, caseSensitive) {
                if (typeof v === "undefined")
                    return Integer[0];
                if (typeof radix !== "undefined")
                    return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
                return parseValue(v);
            }
            function BigInteger(value, sign) {
                this.value = value;
                this.sign = sign;
                this.isSmall = false;
            }
            BigInteger.prototype = Object.create(Integer.prototype);
            function SmallInteger(value) {
                this.value = value;
                this.sign = value < 0;
                this.isSmall = true;
            }
            SmallInteger.prototype = Object.create(Integer.prototype);
            function NativeBigInt(value) {
                this.value = value;
            }
            NativeBigInt.prototype = Object.create(Integer.prototype);
            function isPrecise(n) {
                return -MAX_INT < n && n < MAX_INT;
            }
            function trim(v) {
                var i = v.length;
                while (v[--i] === 0)
                    ;
                v.length = i + 1;
            }
            function truncate(n) {
                if (n > 0)
                    return Math.floor(n);
                return Math.ceil(n);
            }
            BigInteger.prototype.modPow = function (exp, mod) {
                exp = parseValue(exp);
                mod = parseValue(mod);
                if (mod.isZero())
                    throw new Error("Cannot take modPow with modulus 0");
                var r = Integer[1], base = this.mod(mod);
                while (exp.isPositive()) {
                    if (base.isZero())
                        return Integer[0];
                    if (exp.isOdd())
                        r = r.multiply(base).mod(mod);
                    exp = exp.divide(2);
                    base = base.square().mod(mod);
                }
                return r;
            };
            NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;
            var parseBase = function (text, base, alphabet, caseSensitive) {
                alphabet = alphabet || DEFAULT_ALPHABET;
                text = String(text);
                if (!caseSensitive) {
                    text = text.toLowerCase();
                    alphabet = alphabet.toLowerCase();
                }
                var length = text.length;
                var i;
                var absBase = Math.abs(base);
                var alphabetValues = {};
                for (i = 0; i < alphabet.length; i++) {
                    alphabetValues[alphabet[i]] = i;
                }
                for (i = 0; i < length; i++) {
                    var c = text[i];
                    if (c === "-")
                        continue;
                    if (c in alphabetValues) {
                        if (alphabetValues[c] >= absBase) {
                            if (c === "1" && absBase === 1)
                                continue;
                            throw new Error(c + " is not a valid digit in base " + base + ".");
                        }
                    }
                }
                base = parseValue(base);
                var digits = [];
                var isNegative = text[0] === "-";
                for (i = isNegative ? 1 : 0; i < text.length; i++) {
                    var c = text[i];
                    if (c in alphabetValues)
                        digits.push(parseValue(alphabetValues[c]));
                    else if (c === "<") {
                        var start = i;
                        do {
                            i++;
                        } while (text[i] !== ">" && i < text.length);
                        digits.push(parseValue(text.slice(start + 1, i)));
                    }
                    else
                        throw new Error(c + " is not a valid character");
                }
                return parseBaseFromArray(digits, base, isNegative);
            };
            function parseBaseFromArray(digits, base, isNegative) {
                var val = Integer[0], pow = Integer[1], i;
                for (i = digits.length - 1; i >= 0; i--) {
                    val = val.add(digits[i].times(pow));
                    pow = pow.times(base);
                }
                return isNegative ? val.negate() : val;
            }
            function parseStringValue(v) {
                if (isPrecise(+v)) {
                    var x = +v;
                    if (x === truncate(x))
                        return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
                    throw new Error("Invalid integer: " + v);
                }
                var sign = v[0] === "-";
                if (sign)
                    v = v.slice(1);
                var split = v.split(/e/i);
                if (split.length > 2)
                    throw new Error("Invalid integer: " + split.join("e"));
                if (split.length === 2) {
                    var exp = split[1];
                    if (exp[0] === "+")
                        exp = exp.slice(1);
                    exp = +exp;
                    if (exp !== truncate(exp) || !isPrecise(exp))
                        throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
                    var text = split[0];
                    var decimalPlace = text.indexOf(".");
                    if (decimalPlace >= 0) {
                        exp -= text.length - decimalPlace - 1;
                        text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
                    }
                    if (exp < 0)
                        throw new Error("Cannot include negative exponent part for integers");
                    text += (new Array(exp + 1)).join("0");
                    v = text;
                }
                var isValid = /^([0-9][0-9]*)$/.test(v);
                if (!isValid)
                    throw new Error("Invalid integer: " + v);
                if (supportsNativeBigInt) {
                    return new NativeBigInt(BigInt(sign ? "-" + v : v));
                }
                var r = [], max = v.length, l = LOG_BASE, min = max - l;
                while (max > 0) {
                    r.push(+v.slice(min, max));
                    min -= l;
                    if (min < 0)
                        min = 0;
                    max -= l;
                }
                trim(r);
                return new BigInteger(r, sign);
            }
            function parseNumberValue(v) {
                if (supportsNativeBigInt) {
                    return new NativeBigInt(BigInt(v));
                }
                if (isPrecise(v)) {
                    if (v !== truncate(v))
                        throw new Error(v + " is not an integer.");
                    return new SmallInteger(v);
                }
                return parseStringValue(v.toString());
            }
            function parseValue(v) {
                if (typeof v === "number") {
                    return parseNumberValue(v);
                }
                if (typeof v === "string") {
                    return parseStringValue(v);
                }
                if (typeof v === "bigint") {
                    return new NativeBigInt(v);
                }
                return v;
            }
            // Pre-define numbers in range [-1,1]
            for (var i = 0; i < 2; i++) {
                Integer[i] = parseValue(i);
                if (i > 0)
                    Integer[-i] = parseValue(-i);
            }
            return Integer;
        })();
        /*creates a Diffie Hellman Merkle session key from your own secret private key and someone elses public key*/
        function getSessionKey(privateKey, publicKey) {
            return bigInt(publicKey).modPow(Base64.number_hash(privateKey, 100), prime).toString();
        }
        /*converts any string to a positive integer of the requiredLength*/
        Base64.number_hash = function (str, requiredLength) {
            requiredLength = !isNaN(parseFloat(requiredLength)) && isFinite(requiredLength) && requiredLength > 0 ? parseInt(requiredLength) : 10;
            var out = "";
            for (var a = 0, h = 0, s = "", i = void 0, chr = void 0, len = void 0; out.length < requiredLength; a++) {
                //str = Base64.hash(str);
                for (i = 0, len = str.length; i < len; i++) {
                    chr = str.charCodeAt(i);
                    h = (h << 5) - h + chr;
                    h |= 0; // Convert to 32bit integer
                }
                s = String(h + Math.pow(2, 31));
                while (s.length < 10)
                    s = "0" + h;
                out += s.slice(2);
            }
            return out.slice(0, requiredLength);
        };
        /*	generate a random number of the "requiredLength" (input a Number from 1-300),
            based on timing, proccessor speed, and any "additionalEntropy" you want to provide (optional)*/
        Base64.rand = function (requiredLength, additionalEntropy) {
            function random12Digit() {
                return String(Math.floor(Math.random() * (((Math.pow(10, 16)) - 1) - Math.pow(10, 15) + 1) + Math.pow(10, 15))).slice(3, 15);
            }
            var len = !isNaN(parseFloat(requiredLength)) && isFinite(requiredLength) && requiredLength > 0 ? parseInt(requiredLength, 10) : 8, ent = additionalEntropy ? String(additionalEntropy) : random12Digit(), num = 0, str = "", out = "";
            if (len > 300)
                len = 300; //physical limit
            while (out.length < len) {
                num = Number(random12Digit());
                for (var b = 0; b < 4300; b++)
                    num += Number(String(new Date().getTime()).slice(7)); //generate 32 bits of entropy
                str = String(num);
                while (str.charAt(0) === "0" && str.length > 1)
                    str = str.slice(1);
                str = Base64.number_hash(ent + str, 8); //generate 32 bit number from 32 bits of entropy (plus additionalEntropy)
                out += str; //string all the numbers together to form required length
            }
            while (out.charAt(0) === "0" && out.length > 1)
                out = out.slice(1);
            //in some cases during the last round through the "while" statement a number starting with 3 or more 0's will be chosen which results in too short an output number
            if (out.length < len)
                return Base64.rand(len, ent + random12Digit()); //try again
            return out.slice(0, len);
        };
        //salted SHA256 hash
        //asArray (optional) set to true to return an array of 32 base 10 numbers instead of hexadecimal
        Base64.hash = function (message, asArray) {
            function Uint8Arr(length) {
                if (typeof Uint8Array !== 'undefined') {
                    return new Uint8Array(length);
                }
                else {
                    return new Array(length);
                }
            }
            function Int32Arr(length) {
                if (typeof Int32Array !== 'undefined') {
                    return new Int32Array(length);
                }
                else {
                    return new Array(length);
                }
            }
            var h0 = 0x6a09e667;
            var h1 = 0xbb67ae85;
            var h2 = 0x3c6ef372;
            var h3 = 0xa54ff53a;
            var h4 = 0x510e527f;
            var h5 = 0x9b05688c;
            var h6 = 0x1f83d9ab;
            var h7 = 0x5be0cd19;
            var K = [
                0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b,
                0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
                0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7,
                0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc,
                0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152,
                0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
                0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc,
                0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
                0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819,
                0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08,
                0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f,
                0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
                0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
            ];
            message = message ? message : "";
            message = String(message.length + 1231) + String(message);
            var s = unescape(encodeURIComponent(message)); // UTF-8
            var i;
            message = Uint8Arr(s.length);
            for (i = 0; i < s.length; i++) {
                message[i] = s.charCodeAt(i) & 0xff;
            }
            var length = message.length;
            var byteLength = Math.floor((length + 72) / 64) * 64;
            var wordLength = byteLength / 4;
            var bitLength = length * 8;
            var m = Uint8Arr(byteLength);
            if (typeof Uint8Array !== 'undefined' && !Array.isArray(m)) {
                m.set(message);
            }
            else {
                for (i = 0; i < message.length; i++) {
                    m[i] = message[i];
                }
                for (i = message.length; i < m.length; i++) {
                    m[i] = 0;
                }
            }
            m[length] = 0x80;
            m[byteLength - 4] = bitLength >>> 24;
            m[byteLength - 3] = (bitLength >>> 16) & 0xff;
            m[byteLength - 2] = (bitLength >>> 8) & 0xff;
            m[byteLength - 1] = bitLength & 0xff;
            var words = Int32Arr(wordLength);
            var byteIndex = 0;
            var word;
            for (i = 0; i < words.length; i++) {
                word = m[byteIndex] << 24;
                word |= m[byteIndex + 1] << 16;
                word |= m[byteIndex + 2] << 8;
                word |= m[byteIndex + 3];
                words[i] = word;
                byteIndex += 4;
            }
            word = null;
            byteIndex = null;
            var w = Int32Arr(64);
            var v;
            var s0;
            var s1;
            var a;
            var b;
            var c;
            var d;
            var e;
            var f;
            var g;
            var h;
            var ch;
            var temp1;
            var temp2;
            var maj;
            for (var j = 0; j < wordLength; j += 16) {
                for (i = 0; i < 16; i++) {
                    w[i] = words[j + i];
                }
                for (i = 16; i < 64; i++) {
                    v = w[i - 15];
                    s0 = (v >>> 7) | (v << 25);
                    s0 ^= (v >>> 18) | (v << 14);
                    s0 ^= (v >>> 3);
                    v = w[i - 2];
                    s1 = (v >>> 17) | (v << 15);
                    s1 ^= (v >>> 19) | (v << 13);
                    s1 ^= (v >>> 10);
                    w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & 0xffffffff;
                }
                a = h0;
                b = h1;
                c = h2;
                d = h3;
                e = h4;
                f = h5;
                g = h6;
                h = h7;
                for (i = 0; i < 64; i++) {
                    s1 = (e >>> 6) | (e << 26);
                    s1 ^= (e >>> 11) | (e << 21);
                    s1 ^= (e >>> 25) | (e << 7);
                    ch = (e & f) ^ (~e & g);
                    temp1 = (h + s1 + ch + K[i] + w[i]) & 0xffffffff;
                    s0 = (a >>> 2) | (a << 30);
                    s0 ^= (a >>> 13) | (a << 19);
                    s0 ^= (a >>> 22) | (a << 10);
                    maj = (a & b) ^ (a & c) ^ (b & c);
                    temp2 = (s0 + maj) & 0xffffffff;
                    h = g;
                    g = f;
                    f = e;
                    e = (d + temp1) & 0xffffffff;
                    d = c;
                    c = b;
                    b = a;
                    a = (temp1 + temp2) & 0xffffffff;
                }
                h0 = (h0 + a) & 0xffffffff;
                h1 = (h1 + b) & 0xffffffff;
                h2 = (h2 + c) & 0xffffffff;
                h3 = (h3 + d) & 0xffffffff;
                h4 = (h4 + e) & 0xffffffff;
                h5 = (h5 + f) & 0xffffffff;
                h6 = (h6 + g) & 0xffffffff;
                h7 = (h7 + h) & 0xffffffff;
            }
            var hash = Uint8Arr(32);
            for (i = 0; i < 4; i++) {
                hash[i] = (h0 >>> (8 * (3 - i))) & 0xff;
                hash[i + 4] = (h1 >>> (8 * (3 - i))) & 0xff;
                hash[i + 8] = (h2 >>> (8 * (3 - i))) & 0xff;
                hash[i + 12] = (h3 >>> (8 * (3 - i))) & 0xff;
                hash[i + 16] = (h4 >>> (8 * (3 - i))) & 0xff;
                hash[i + 20] = (h5 >>> (8 * (3 - i))) & 0xff;
                hash[i + 24] = (h6 >>> (8 * (3 - i))) & 0xff;
                hash[i + 28] = (h7 >>> (8 * (3 - i))) & 0xff;
            }
            if (asArray)
                return hash;
            else
                return toHex(hash);
        };
        Base64.hmac = function (message, key) {
            key = String(key);
            if (key.length > 32)
                key = Base64.hash(key, true);
            else {
                var s = unescape(encodeURIComponent(key)); // UTF-8
                key = new Uint8Array(32);
                for (var i = 0; i < s.length; i++) {
                    key[i] = s.charCodeAt(i);
                }
            }
            for (var i = 0; i < key.length; i++) {
                key[i] ^= 0x36;
            }
            var inner = Base64.hash(toHex(key));
            for (var i = 0; i < key.length; i++) {
                key[i] ^= 0x36 ^ 0x5c;
            }
            return Base64.hash(toHex(key) + inner + String(message));
        };
        /*compress and convert any text to base64, with our without a key*/
        Base64.write = function (str, key) {
            if (str === null)
                return "";
            str = String(str);
            str = convertTo(str);
            if (key) {
                var a, b = [], c = charset, d = Base64.hash(key), e, f = c + c + c + c + c;
                for (a = 0, e = 0; a < str.length; a++, e = e === String(d).length - 1 ? 0 : e + 1)
                    b[a] = f[c.indexOf(str[a]) + c.indexOf(String(d)[e]) * 4];
                str = "d" + b.join("");
                a = null;
                b = null;
                c = null;
                d = null;
                e = null;
                f = null;
                key = null;
            }
            return str;
        };
        /*revert from base64, and decompress*/
        Base64.read = function (str, key) {
            if (str === null)
                return "";
            str = String(str);
            if (key && /^d/.test(str)) {
                str = str.replace(/^d/, "");
                var a = str.length, b = [], c = charset, d = Base64.hash(key), e, f = c + c + c + c + c, g, h = String(d).length, i = c.length;
                for (g = 0, e = 0; g < a; g++, e = e === h - 1 ? 0 : e + 1)
                    b[g] = f[c.indexOf(str[g]) + i * 4 - c.indexOf(String(d)[e]) * 4];
                str = b.join("");
                key = null;
                a = null;
                b = null;
                c = null;
                d = null;
                e = null;
                f = null;
                g = null;
            }
            str = revertFrom(str);
            return str;
        };
        /*same as Base64.write, but does some error checking as well*/
        Base64.write_and_verify = function (str, key) {
            function locateTextDifferences(str1, str2) {
                var diff = [], d = 1;
                if (str2 === null)
                    return "Decompressing the string returned null. Possibly invalid key used??";
                var len1 = str1.length, len2 = str2.length;
                if (len1 !== len2)
                    diff[0] = "Strings are not the same length. String 1: " + len1 + " characters. String 2: " + len2 + " characters.";
                else
                    diff[0] = "Entire text length: " + len1 + " characters";
                for (var a = 0; a < len1 && a < len2; a++) {
                    if (str1.charAt(a) !== str2.charAt(a)) {
                        diff[d] = "Char " + (a + 1) + ": ASCII " + str1.charCodeAt(a) + " not equal to ";
                        diff[d] = diff[d] + "ASCII " + str2.charCodeAt(a) + ".";
                        diff[d] = diff[d] + "Surrounding text: " + str1.slice(a - 10, a + 10);
                        d++;
                    }
                }
                if (d === 1)
                    return false;
                else
                    return diff.join("<br />");
            }
            /*for debugging the write/read functions*/
            var orig = str;
            str = Base64.write(str, key);
            if (Base64.read(str, key) !== orig)
                return "Write error! Aborted operation. " + locateTextDifferences(orig, Base64.read(str, key));
            else
                return str;
        };
        /*creates a Diffie Hellman Merkle public key from any string (usually from a secret password)*/
        Base64.createPublicKey = function (myPrivateKey) {
            myPrivateKey = Base64.number_hash(myPrivateKey, 100);
            var ret = bigInt("32416178251").modPow(myPrivateKey, prime).toString();
            return ret;
        };
        /* create a secondary secret key to share with someone if you know their public key.
         * You must also give them the secret key's corresponding public key. Similar to a session key
         */
        Base64.createUserKey = function (userPublicKey, masterKey) { return Base64.write("key:" + masterKey, getSessionKey(masterKey, userPublicKey)); };
        /*same as Base64.createUserKey, but needs the user's private key to verify*/
        Base64.createUserKey_and_verify = function (userPrivateKey, masterKey) {
            //create public keys
            var mainPublicKey = Base64.createPublicKey(masterKey), userPublicKey = Base64.createPublicKey(userPrivateKey);
            //verify public keys work
            var usersSessionKey = getSessionKey(userPrivateKey, mainPublicKey), mainSessionKey = getSessionKey(masterKey, userPublicKey);
            if (usersSessionKey !== mainSessionKey)
                throw new Error("Public/Private key creation error");
            //create userKey from masterKey with common session key
            var userKey = Base64.write_and_verify("key:" + masterKey, mainSessionKey);
            //verify
            if (String(masterKey) === String(Base64.readUserKey(userPrivateKey, userKey, mainPublicKey)))
                return userKey;
            else
                throw new Error("Error creating user key for " + userPrivateKey);
        };
        /* read a secret key (userKey) that was shared with you, using your own secret key and the person who shared it
         * with you's public key (the mainPublicKey is the public key that corresponds to the secret key)
         */
        Base64.readUserKey = function (myPrivateKey, userKey, mainPublicKey) {
            var key = Base64.read(userKey, getSessionKey(myPrivateKey, mainPublicKey));
            if (/^key:/.test(key))
                return key.replace(/^key:/, "");
            else
                return false;
        };
        /* share plaintext with someone if you know their public key (as generated by base64.js)
         * expires = Number in months till data is no longer valid (optional, can be easily bypassed if source code is known)
         */
        Base64.share = function (str, myPrivateKey, theirPublicKeys, expires) {
            var key = Base64.rand(prime.length), members = [Base64.createUserKey(Base64.createPublicKey(myPrivateKey), key)]; //add self to members in case uploading to network where you might need to access it as well
            expires = !isNaN(parseFloat(expires)) && isFinite(expires) ? new Date().getTime() + expires * 26298e5 : expires ? new Date().getTime() + 18 * 26298e5 : false;
            theirPublicKeys = theirPublicKeys && theirPublicKeys instanceof Array ? theirPublicKeys : null;
            str = Base64.write(str, key);
            if (theirPublicKeys) {
                for (var a = 0; a < theirPublicKeys.length; a++) {
                    members[a + 1] = Base64.createUserKey(theirPublicKeys[a], key);
                }
            }
            return {
                "Version": Base64.Version,
                "Expires": expires,
                "Compressed": true,
                "Data": str,
                "PublicKey": Base64.createPublicKey(key),
                "UserKeys": Base64.write_and_verify(JSON.stringify(members)),
                "Signature": Base64.hmac(str + expires, key)
            };
        };
        /* returns data as an object {
            "message": a debug message if process failed
            "type": "results" if successful, "debug" if not
            "data": the shared file content
            "hash": the hash of the shared file contents
        }
        */
        Base64.readShared = function (obj, myPrivateKey) {
            var key, type = "debug", message = "", data = null, hash = null;
            if (obj.Version === Base64.Version || obj.Version === 1.0) { //supported version numbers
                if (obj.UserKeys && obj.Compressed) {
                    var members = JSON.parse(Base64.read(obj.UserKeys));
                    for (var a = 0, len = members.length; a < len; a++) {
                        if (Base64.readUserKey(myPrivateKey, members[a], obj.PublicKey))
                            key = Base64.readUserKey(myPrivateKey, members[a], obj.PublicKey);
                    }
                    members = null;
                }
                if (obj.Expires !== false && new Date().getTime() > obj.Expires)
                    message = "data expired";
                else if (key) {
                    if (obj.Version === 1.0) { //version 1.0 uses hash, not hmac
                        data = Base64.read(obj.Data, key);
                        hash = Base64.hash(data + obj.Expires);
                        if (obj.Signature === hash) {
                            type = "results";
                            message = "success";
                        }
                        else {
                            data = null;
                            message = "hash didn't match";
                        }
                    }
                    else {
                        hash = Base64.hmac(obj.Data + obj.Expires, key);
                        if (obj.Signature === hash) {
                            data = Base64.read(obj.Data, key);
                            type = "results";
                            message = "success";
                        }
                        else {
                            data = null;
                            message = "hmac didn't match";
                        }
                    }
                }
                else
                    message = "no key match";
            }
            else
                message = "file version '" + obj.Version + "' not supported";
            return { "type": type, "message": message, "data": data, "hmac": hash };
        };
    })();
    exports.default = Base64;
});
define("Lawnchair-bundle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* eslint-disable */
    /**
     * Lawnchair!
     * ---
     * clientside json store
     *
     */
    var Lawnchair = function (options, callback) {
        // ensure Lawnchair was called as a constructor
        if (!(this instanceof Lawnchair))
            return new Lawnchair(options, callback);
        // lawnchair requires json 
        if (!JSON)
            throw 'JSON unavailable! Include http://www.json.org/json2.js to fix.';
        // options are optional; callback is not
        if (arguments.length <= 2) {
            callback = typeof arguments[0] === 'function' ? arguments[0] : arguments[1];
            options = typeof arguments[0] === 'function' ? {} : arguments[0] || {};
        }
        else {
            throw 'Incorrect # of ctor args!';
        }
        // default configuration 
        this.record = options.record || 'record'; // default for records
        this.name = options.name || 'records'; // default name for underlying store
        // mixin first valid  adapter
        var adapter;
        // if the adapter is passed in we try to load that only
        if (options.adapter) {
            // the argument passed should be an array of prefered adapters
            // if it is not, we convert it
            if (typeof options.adapter === 'string') {
                options.adapter = [options.adapter];
            }
            // iterates over the array of passed adapters 
            for (var j = 0, k = options.adapter.length; j < k; j++) {
                // itirates over the array of available adapters
                for (var i = Lawnchair.adapters.length - 1; i >= 0; i--) {
                    if (Lawnchair.adapters[i].adapter === options.adapter[j]) {
                        adapter = Lawnchair.adapters[i].valid() ? Lawnchair.adapters[i] : undefined;
                        if (adapter)
                            break;
                    }
                }
                if (adapter)
                    break;
            }
            // otherwise find the first valid adapter for this env
        }
        else {
            for (var i = 0, l = Lawnchair.adapters.length; i < l; i++) {
                adapter = Lawnchair.adapters[i].valid() ? Lawnchair.adapters[i] : undefined;
                if (adapter)
                    break;
            }
        }
        // we have failed 
        if (!adapter)
            throw 'No valid adapter.';
        // yay! mixin the adapter 
        for (var j in adapter)
            this[j] = adapter[j];
        // call init for each mixed in plugin
        for (var i = 0, l = Lawnchair.plugins.length; i < l; i++)
            Lawnchair.plugins[i].call(this);
        // init the adapter 
        this.init(options, callback);
    };
    Lawnchair.adapters = [];
    /**
     * queues an adapter for mixin
     * ===
     * - ensures an adapter conforms to a specific interface
     *
     */
    Lawnchair.adapter = function (id, obj) {
        // add the adapter id to the adapter obj
        // ugly here for a  cleaner dsl for implementing adapters
        obj['adapter'] = id;
        // methods required to implement a lawnchair adapter 
        var implementing = 'adapter valid init keys save batch get exists all remove nuke'.split(' '), indexOf = this.prototype.indexOf;
        // mix in the adapter   
        for (var i in obj) {
            if (indexOf(implementing, i) === -1)
                throw 'Invalid adapter! Nonstandard method: ' + i;
        }
        // if we made it this far the adapter interface is valid 
        // insert the new adapter as the preferred adapter
        Lawnchair.adapters.splice(0, 0, obj);
    };
    Lawnchair.plugins = [];
    /**
     * generic shallow extension for plugins
     * ===
     * - if an init method is found it registers it to be called when the lawnchair is inited
     * - yes we could use hasOwnProp but nobody here is an asshole
     */
    Lawnchair.plugin = function (obj) {
        for (var i in obj)
            i === 'init' ? Lawnchair.plugins.push(obj[i]) : this.prototype[i] = obj[i];
    };
    /**
     * helpers
     *
     */
    Lawnchair.prototype = {
        isArray: Array.isArray || function (o) { return Object.prototype.toString.call(o) === '[object Array]'; },
        /**
         * this code exists for ie8... for more background see:
         * http://www.flickr.com/photos/westcoastlogic/5955365742/in/photostream
         */
        indexOf: function (ary, item, i, l) {
            if (ary.indexOf)
                return ary.indexOf(item);
            for (i = 0, l = ary.length; i < l; i++)
                if (ary[i] === item)
                    return i;
            return -1;
        },
        // awesome shorthand callbacks as strings. this is shameless theft from dojo.
        lambda: function (callback) {
            return this.fn(this.record, callback);
        },
        // first stab at named parameters for terse callbacks; dojo: first != best // ;D
        fn: function (name, callback) {
            return typeof callback === 'string' ? new Function(name, callback) : callback;
        },
        // returns a unique identifier (by way of Backbone.localStorage.js)
        // TODO investigate smaller UUIDs to cut on storage cost
        uuid: function () {
            var S4 = function () {
                return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
            };
            return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
        },
        // a classic iterator
        each: function (callback) {
            var cb = this.lambda(callback);
            // iterate from chain
            if (this.__results) {
                for (var i = 0, l = this.__results.length; i < l; i++)
                    cb.call(this, this.__results[i], i);
            }
            // otherwise iterate the entire collection 
            else {
                this.all(function (r) {
                    for (var i = 0, l = r.length; i < l; i++)
                        cb.call(this, r[i], i);
                });
            }
            return this;
        }
        // --
    };
    /**
     * indexed db adapter
     * ===
     * - originally authored by Vivian Li
     *
     */
    Lawnchair.adapter('indexed-db', (function () {
        function fail(e, i) { console.error('error in indexed-db adapter!', e, i); }
        // update the STORE_VERSION when the schema used by this adapter changes
        // (for example, if you change the STORE_NAME above)
        var STORE_VERSION = 3;
        if (!window)
            var window = self;
        var getIDB = function () {
            return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB;
        };
        var getIDBTransaction = function () {
            return window.IDBTransaction || window.webkitIDBTransaction ||
                window.mozIDBTransaction || window.oIDBTransaction ||
                window.msIDBTransaction;
        };
        var getIDBKeyRange = function () {
            return window.IDBKeyRange || window.webkitIDBKeyRange ||
                window.mozIDBKeyRange || window.oIDBKeyRange ||
                window.msIDBKeyRange;
        };
        var getIDBDatabaseException = function () {
            return window.IDBDatabaseException || window.webkitIDBDatabaseException ||
                window.mozIDBDatabaseException || window.oIDBDatabaseException ||
                window.msIDBDatabaseException;
        };
        var useAutoIncrement = function () {
            // using preliminary mozilla implementation which doesn't support
            // auto-generated keys.  Neither do some webkit implementations.
            return !!window.indexedDB;
        };
        // see https://groups.google.com/a/chromium.org/forum/?fromgroups#!topic/chromium-html5/OhsoAQLj7kc
        var READ_WRITE = getIDBTransaction() &&
            'READ_WRITE' in getIDBTransaction() ?
            getIDBTransaction().READ_WRITE : 'readwrite';
        return {
            valid: function () { return !!getIDB(); },
            init: function (options, callback) {
                this.idb = getIDB();
                this.waiting = [];
                this.useAutoIncrement = useAutoIncrement();
                var request = this.idb.open(this.name, STORE_VERSION);
                var self = this;
                var cb = self.fn(self.name, callback);
                if (cb && typeof cb !== 'function')
                    throw 'callback not valid';
                var win = function () {
                    // manually clean up event handlers on request; this helps on chrome
                    request.onupgradeneeded = request.onsuccess = request.onerror = null;
                    if (cb)
                        return cb.call(self, self);
                };
                var upgrade = function (from, to) {
                    // don't try to migrate dbs, just recreate
                    try {
                        self.db.deleteObjectStore('teststore'); // old adapter
                    }
                    catch (e1) { /* ignore */ }
                    try {
                        self.db.deleteObjectStore(self.record);
                    }
                    catch (e2) { /* ignore */ }
                    // ok, create object store.
                    var params = {};
                    if (self.useAutoIncrement) {
                        params.autoIncrement = true;
                    }
                    self.db.createObjectStore(self.record, params);
                    self.store = true;
                };
                request.onupgradeneeded = function (event) {
                    self.db = request.result;
                    self.transaction = request.transaction;
                    upgrade(event.oldVersion, event.newVersion);
                    // will end up in onsuccess callback
                };
                request.onsuccess = function (event) {
                    self.db = event.target.result;
                    // eslint-disable-next-line
                    if (self.db.version != ('' + STORE_VERSION)) {
                        // DEPRECATED API: modern implementations will fire the
                        // upgradeneeded event instead.
                        var oldVersion = self.db.version;
                        var setVrequest = self.db.setVersion('' + STORE_VERSION);
                        // onsuccess is the only place we can create Object Stores
                        setVrequest.onsuccess = function (event) {
                            var transaction = setVrequest.result;
                            setVrequest.onsuccess = setVrequest.onerror = null;
                            // can't upgrade w/o versionchange transaction.
                            upgrade(oldVersion, STORE_VERSION);
                            transaction.oncomplete = function () {
                                for (var i = 0; i < self.waiting.length; i++) {
                                    self.waiting[i].call(self);
                                }
                                self.waiting = [];
                                win();
                            };
                        };
                        setVrequest.onerror = function (e) {
                            setVrequest.onsuccess = setVrequest.onerror = null;
                            console.error("Failed to create objectstore " + e);
                            fail(e);
                        };
                    }
                    else {
                        self.store = true;
                        for (var i = 0; i < self.waiting.length; i++) {
                            self.waiting[i].call(self);
                        }
                        self.waiting = [];
                        win();
                    }
                };
                request.onerror = function (ev) {
                    if (getIDBDatabaseException() && request.errorCode === getIDBDatabaseException().VERSION_ERR) {
                        // xxx blow it away
                        self.idb.deleteDatabase(self.name);
                        // try it again.
                        return self.init(options, callback);
                    }
                    console.error('Failed to open database');
                };
            },
            save: function (obj, callback) {
                var self = this;
                if (!this.store) {
                    this.waiting.push(function () {
                        this.save(obj, callback);
                    });
                    return this;
                }
                var objs = (this.isArray(obj) ? obj : [obj]).map(function (o) { if (!o.key) {
                    o.key = self.uuid();
                } return o; });
                var win = function (e) {
                    if (callback) {
                        self.lambda(callback).call(self, self.isArray(obj) ? objs : objs[0]);
                    }
                };
                var trans = this.db.transaction(this.record, READ_WRITE);
                var store = trans.objectStore(this.record);
                for (var i = 0; i < objs.length; i++) {
                    var o = objs[i];
                    store.put(o, o.key);
                }
                store.transaction.oncomplete = win;
                store.transaction.onabort = fail;
                return this;
            },
            batch: function (objs, callback) {
                return this.save(objs, callback);
            },
            get: function (key, callback) {
                if (!this.store) {
                    this.waiting.push(function () {
                        this.get(key, callback);
                    });
                    return this;
                }
                var self = this;
                var win = function (e) {
                    var r = e.target.result;
                    if (callback) {
                        if (r) {
                            r.key = key;
                        }
                        self.lambda(callback).call(self, r);
                    }
                };
                if (!this.isArray(key)) {
                    var req = this.db.transaction(this.record).objectStore(this.record).get(key);
                    req.onsuccess = function (event) {
                        req.onsuccess = req.onerror = null;
                        win(event);
                    };
                    req.onerror = function (event) {
                        req.onsuccess = req.onerror = null;
                        fail(event);
                    };
                }
                else {
                    // note: these are hosted.
                    var results = [], done = key.length, keys = key;
                    var getOne = function (i) {
                        self.get(keys[i], function (obj) {
                            results[i] = obj;
                            if (--done > 0) {
                                return;
                            }
                            if (callback) {
                                self.lambda(callback).call(self, results);
                            }
                        });
                    };
                    for (var i = 0, l = keys.length; i < l; i++)
                        getOne(i);
                }
                return this;
            },
            exists: function (key, callback) {
                if (!this.store) {
                    this.waiting.push(function () {
                        this.exists(key, callback);
                    });
                    return this;
                }
                var self = this;
                var req = this.db.transaction(self.record).objectStore(this.record).openCursor(getIDBKeyRange().only(key));
                req.onsuccess = function (event) {
                    req.onsuccess = req.onerror = null;
                    // exists iff req.result is not null
                    // XXX but firefox returns undefined instead, sigh XXX
                    var undef;
                    self.lambda(callback).call(self, event.target.result !== null &&
                        event.target.result !== undef);
                };
                req.onerror = function (event) {
                    req.onsuccess = req.onerror = null;
                    fail(event);
                };
                return this;
            },
            all: function (callback) {
                if (!this.store) {
                    this.waiting.push(function () {
                        this.all(callback);
                    });
                    return this;
                }
                var cb = this.fn(this.name, callback) || undefined;
                var self = this;
                var objectStore = this.db.transaction(this.record).objectStore(this.record);
                var toReturn = [];
                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        toReturn.push(cursor.value);
                        cursor['continue']();
                    }
                    else {
                        if (cb)
                            cb.call(self, toReturn);
                    }
                };
                return this;
            },
            keys: function (callback) {
                if (!this.store) {
                    this.waiting.push(function () {
                        this.keys(callback);
                    });
                    return this;
                }
                var cb = this.fn(this.name, callback) || undefined;
                var self = this;
                var objectStore = this.db.transaction(this.record).objectStore(this.record);
                var toReturn = [];
                // in theory we could use openKeyCursor() here, but no one actually
                // supports it yet.
                objectStore.openCursor().onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                        toReturn.push(cursor.key);
                        cursor['continue']();
                    }
                    else {
                        if (cb)
                            cb.call(self, toReturn);
                    }
                };
                return this;
            },
            remove: function (keyOrArray, callback) {
                if (!this.store) {
                    this.waiting.push(function () {
                        this.remove(keyOrArray, callback);
                    });
                    return this;
                }
                var self = this;
                var toDelete = keyOrArray;
                if (!this.isArray(keyOrArray)) {
                    toDelete = [keyOrArray];
                }
                var win = function () {
                    if (callback)
                        self.lambda(callback).call(self);
                };
                var os = this.db.transaction(this.record, READ_WRITE).objectStore(this.record);
                var key = keyOrArray.key ? keyOrArray.key : keyOrArray;
                for (var i = 0; i < toDelete.length; i++) {
                    var key = toDelete[i].key ? toDelete[i].key : toDelete[i];
                    os['delete'](key);
                }
                os.transaction.oncomplete = win;
                os.transaction.onabort = fail;
                return this;
            },
            nuke: function (callback) {
                if (!this.store) {
                    this.waiting.push(function () {
                        this.nuke(callback);
                    });
                    return this;
                }
                var self = this, win = callback ? function () { self.lambda(callback).call(self); } : function () { };
                try {
                    var os = this.db.transaction(this.record, READ_WRITE).objectStore(this.record);
                    os.clear();
                    os.transaction.oncomplete = win;
                    os.transaction.onabort = fail;
                }
                catch (e) {
                    if (e.name === 'NotFoundError')
                        win();
                    else
                        fail(e);
                }
                return this;
            }
        };
    })());
    // /* global module */
    // /**
    //  * Expose nodeJS module
    //  */
    // if (typeof module !== 'undefined' && module.exports) {
    //   module.exports = Lawnchair;
    // }
    exports.default = Lawnchair;
});
define("storage-bundle", ["require", "exports", "base64-bundle", "Lawnchair-bundle"], function (require, exports, base64_1, Lawnchair_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base64_1 = __importDefault(base64_1);
    Lawnchair_1 = __importDefault(Lawnchair_1);
    /* global */
    "use strict";
    var LOCAL = {}, Version = 1.1, PreviousVersion = 1;
    var LocalStorageObj = /** @class */ (function () {
        function LocalStorageObj() {
            this.LocalUserRef = "User" + Version;
            this.LocalUserRef_old = "User" + PreviousVersion;
            this.technology = "";
        }
        LocalStorageObj.prototype.setItem = function (refName, value, key) {
            function ret() {
                LOCAL[refName].save({ key: refName, data: value });
            }
            function write(file) {
                window.Windows.Storage.FileIO.writeTextAsync(file, value).done(function () {
                }, function (error) {
                    //file couldn't be written - handle the error
                    console.log(error, "not written");
                });
            }
            function fileNotFoundError(error) {
                //file not found, handle the error
                console.log(error, "file not found, creating file");
                storageFolder.createFileAsync(refName).done(write, function (error) {
                    //file not created, handle the error
                    console.log(error, "not created");
                });
            }
            if (typeof value === "object")
                value = JSON.stringify(value);
            //if (console && console.log) console.log("setItem", refName, value, key);
            value = key ? base64_1.default.write(value, key) : base64_1.default.write(value);
            if (window.Windows) {
                var storageFolder = window.Windows.Storage.ApplicationData.current.localFolder;
                storageFolder.getFileAsync(refName).done(write, fileNotFoundError);
            }
            else if (typeof LOCAL[refName] === "undefined" || LOCAL[refName] === null || !(LOCAL[refName] instanceof Lawnchair_1.default)) {
                LOCAL[refName] = Lawnchair_1.default();
                return ret();
            }
            else
                return ret();
        };
        LocalStorageObj.prototype.getItem = function (refName, key, callback, doesntExistCallback) {
            function read(str) {
                var value = key ? base64_1.default.read(str, key) : base64_1.default.read(str);
                //if (console && console.log) console.log("getItem", refName, value, key);
                if (key && !value)
                    return callback instanceof Function ? callback(null, "wrong key") : null;
                else
                    return callback instanceof Function ? callback(value) : value;
            }
            function got(obj) {
                if (obj && obj.data) {
                    read(obj.data);
                }
                else {
                    if (doesntExistCallback instanceof Function)
                        return doesntExistCallback();
                    else
                        return null;
                }
            }
            if (window.Windows) {
                var storageFolder = window.Windows.Storage.ApplicationData.current.localFolder;
                storageFolder.getFileAsync(refName).done(function (file) {
                    window.Windows.Storage.FileIO.readTextAsync(file).done(function (fileContent) {
                        read(fileContent);
                        //'fileContent' contains your JSON data as a string
                    }, function (error) {
                        //file couldn't be read - handle the error
                        return callback instanceof Function ? callback(null, error) : null;
                    });
                }, function (error) {
                    //file not found, handle the error
                    if (doesntExistCallback instanceof Function)
                        return doesntExistCallback(error);
                    else
                        return null;
                });
            }
            //try get cached value from the LOCAL object
            else if (LOCAL[refName] && LOCAL[refName] instanceof Lawnchair_1.default) {
                return LOCAL[refName].get(refName, got);
            }
            // or from Lawnchair object and cache it to to LOCAL object for quick retrieval later
            else {
                LOCAL[refName] = Lawnchair_1.default();
                return LOCAL[refName].get(refName, got);
            }
        };
        LocalStorageObj.prototype.nuke = function () {
            // eslint-disable-next-line consistent-this
            var _this = this;
            function getAllKeys() { this.keys(deleteEachKey); }
            function deleteEachKey(keys) { keys.forEach(_this.deleteItem); }
            if (window.Windows) {
                var storageFolder = window.Windows.Storage.ApplicationData.current.localFolder;
                storageFolder.getFilesAsync().done(function (files) {
                    if (files.length > 0)
                        for (var a = 0, len = files.length; a < len; a++) {
                            _this.deleteItem(files[a].name);
                        }
                }, function (error) {
                    console.log(error);
                });
            }
            else {
                Lawnchair_1.default(getAllKeys);
            }
            LOCAL = {};
        };
        LocalStorageObj.prototype.deleteItem = function (refName) {
            function deleteRef() { this.remove(refName); }
            if (window.Windows) {
                var storageFolder = window.Windows.Storage.ApplicationData.current.localFolder;
                storageFolder.getFileAsync(refName).done(function (file) {
                    file.deleteAsync(window.Windows.Storage.StorageDeleteOption.default);
                }, function (error) {
                    console.log(error);
                });
            }
            else {
                Lawnchair_1.default(deleteRef);
                if (LOCAL && LOCAL[refName])
                    LOCAL[refName] = {};
            }
        };
        return LocalStorageObj;
    }());
    var Sto = new LocalStorageObj();
    exports.default = Sto;
});
define("lists-bundle", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LISTSJSON = {
        "Counties": {
            /* list of towns, cities, counties, municipalities in Alberta from google maps
        Tuscany
        Pincher Creek
        Downtown West End
        Jasper
        Downtown Calgary
        Taber
        Bragg Creek
        Didsbury
        Radisson Heights
        Banff
        Vegreville
        High River
        Bowness
        Turner Valley
        Irricana
        Inglewood
        Eau Claire
        Langdon
        Fort Chipewyan
        Viking
        Hounsfield Heights/Briar Hill
        Arrowwood
        Mission
        Woodlands
        Braeside
        Waterton Park
        Drumheller
        Halkirk
        New Dayton
        Stirlingville
        Stavely
        Forestburg
        Big Valley
        Bruderheim
        Milo
        Stirling
        Slave Lake
        Coaldale
        Foremost
        Bittern Lake
        Vauxhall
        Nobleford
        Sunnyside
        Carstairs
        Donalda
        Boyle
        Drayton Valley
        Innisfail
        Millrise
        Morinville
        Skiff
        Chinatown
        Beiseker
        Pineridge
        Dalhousie
        Barons
        Hinton
        Fairview
        Vermilion
        Erlton
        University Heights
        Alyth/Bonnybrook/Manchester
        Rimbey
        Trochu
        Orion
        Devon
        Whitecourt
        Mayerthorpe
        Fort Vermilion
        Kitscoty
        Chipman
        Thorsby
        Innisfree
        Arbour Lake
        St. Paul
        Exshaw
        Sunalta
        Edson
        Nemiscam
        Lamont
        Beaumont
        Peace River
        Oakridge
        Lac des Arcs
        Lake Louise
        Canmore
        Olds
        Rowley
        Red Deer County
        Peace No. 135
        Genesee
        Sylvan Lake
        Okotoks
        Grande Cache
        Holden
        New Brighton
        Falher
        Wildwood
        Beltline
        Girouxville
        Windermere
        Fort Macleod
        Etzikom
        Stettler
        Wrentham
        Bassano
        Gadsby
        Lansdowne
        High Level
        Magrath
        Monterey Park
        Bowden
        Renfrew
        Wheatland County
        Clearwater County
        Alix
        Bentley
        Bellevue
        Three Hills
        Cochrane
        Bankview
        Entwistle
        Strathcona County
        Penhold
        Evansburg
        Burdett
        Fox Creek
        Athabasca
        Bon Accord
        Vulcan
        Valleyview
        Hillhurst
        Cardston County
        Retlaw
        Rycroft
        Empress
        Brentwood
        Nisku
        Cardston
        Tofield
        Ryley
        Christie Park
        Champion
        Panorama Hills
        Calmar
        Bridgeland
        Lac La Biche
        High Prairie
        Beaverlodge
        Raymond
        Beaver County
        Mundare
        Picture Butte
        Breton
        Patterson
        Britannia
        Bashaw
        Blairmore
        South Calgary
        Hardisty
        Mayland Heights
        Martindale
        Blood 148
        Derwent
        Swalwell
        Strathcona Park
        Canyon Meadows
        Czar
        Kneehill County
        Penbrooke Meadows
        Coronation
        Symons Valley
        Gull Lake
        Palliser
        Blackie
        Sangudo
        Conrich
        Meadowlark Park
        Evanston
        Munson
        Shaganappi
        Mountain View County
        Kingsland
        Rosscarrock
        Riverbend
        West Springs
        Yellowhead County
        Whiskey Gap
        Longview
        Charleswood
        Warburg
        Legal
        Galahad
        Douglasdale/Douglasglen
        Grimshaw
        Delacour
        Balzac
        Vilna
        Hidden Valley
        Discovery Ridge
        Silver Springs
        Dewberry
        Duchess
        Heisler
        Nampa
        Bow Island
        Youngstown
        Marlborough
        Seba Beach
        Banff Trail
        Greenview
        Glamorgan
        Morley
        Rainbow Lake
        Edberg
        Shepard Industrial
        Mannville
        Marlborough Park
        Kelvin Grove
        Scenic Acres
        Cambrian Heights
        Cedarbrae
        Windsor Park
        Chinook Park
        Sedgewick
        Carbon
        Bel-Aire
        Berwyn
        Thorhild
        Forest Lawn
        Clairmont
        Varsity
        Sundance
        Wabamun
        Millet
        Morrin
        Tilley
        Richmond
        Falconridge
        Altadore
        Alliance
        Barnwell
        Crowsnest Pass
        Citadel
        Wainwright
        Irma
        Glenwood
        Beddington Heights
        Bonnyville
        Valley Ridge
        Northern Sunrise County
        Manyberries
        Elbow Park
        Blackfalds
        Ferintosh
        Cereal
        North Glenmore
        Nanton
        Strathmore
        Hythe
        MacEwan
        Coutts
        Wabasca Desmarais
        Tuxedo Park
        Thorncliffe
        Vermilion River County
        Hines Creek
        Manning
        Maybutt
        Shawnessy
        Elboya
        Delburne
        Scarboro
        St. Andrews Heights
        Killarney
        Coalhurst
        Crossfield
        Chauvin
        Sexsmith
        Coach Hill
        Carvel
        Point Mckay
        Beaver Mines
        Vulcan
        Royal Oak
        Hillspring
        Minburn
        Milk River
        Montgomery
        Roxboro
        Delia
        North Haven
        Killam
        Cremona
        Cranston
        McKenzie Towne
        Donnelly
        Cowley
        Ponoka County
        Barrhead
        Claresholm
        Veteran
        Clive Alberta
        Jefferson
        Spring Lake
        Mount Pleasant
        Strome
        Deer Ridge
        Somerset
        Crescent Heights
        Hussar
        Andrew
        Spruce Cliff
        Carmangay
        Chaparral
        Country Hills
        Consort
        Clear Hills County
        Gibbons
        Lakeview
        Provost
        Rockyford
        Lomond
        Bridlewood
        Mount Royal
        Southwood
        Sturgeon County
        Hughenden
        Wembley
        Hanna
        Cheadle
        McKenzie Lake
        Acme
        Copperfield
        Parkhill/Stanley Park
        Pump Hill
        Vulcan County
        Huntington Hills
        Sandstone Valley
        Signal Hill
        Deer Run
        Waskatenau
        Kinuso
        Lougheed
        West Hillhurst
        Haysboro
        Lincoln Park
        Chestermere
        Woodbine
        Cougar Ridge
        Saddle Ridge
        Caroline
        Paradise Valley
        Oyen
        Minburn County No. 27
        Bayview
        Big Lakes
        Rosedale
        Lake Bonavista
        Standard
        Westlock County
        Hay Lakes
        Crestmont
        Maple Ridge
        McLennan
        Warner
        Greenwood Greenbriar
        Castleridge
        Parkland
        Two Hills
        Coleman
        Rocky Ridge
        Highwood
        Edgemont
        Elk Point
        Shawnee Slopes
        Marwayne
        Rosalind
        Redwater
        Swan Hills
        Castor
        Hawkwood
        Springbank Hill
        Linden
        Granum
        Collingwood
        Clyde
        Taradale
        Harvie Heights
        Priddis
        Rocky Mountain House
        Evergreen
        Elkwater
        Mayfair
        Eckville
        Rosemont
        Redcliff
        New Sarepta
        Queensland
        Harvest Hills
        Alliance
        Barnwell
        Crowsnest Pass
        Citadel
        Wainwright
        Irma
        Glenwood
        Beddington Heights
        Bonnyville
        Valley Ridge
        Northern Sunrise County
        Manyberries
        Elbow Park
        Blackfalds
        Ferintosh
        Cereal
        North Glenmore
        Nanton
        Strathmore
        Hythe
        MacEwan
        Coutts
        Wabasca Desmarais
        Tuxedo Park
        Thorncliffe
        Vermilion River County
        Hines Creek
        Manning
        Maybutt
        Shawnessy
        Elboya
        Delburne
        Scarboro
        St. Andrews Heights
        Killarney
        Coalhurst
        Crossfield
        Chauvin
        Sexsmith
        Coach Hill
        Carvel
        Point Mckay
        Beaver Mines
        Vulcan
             */
            "athabasca": "Athabasca County",
            "bondiss": "Athabasca County",
            "boyle": "Athabasca County",
            "island_lake": "Athabasca County",
            "island_lake_south": "Athabasca County",
            "mewatha_beach": "Athabasca County",
            "south_baptiste": "Athabasca County",
            "sunset_beach": "Athabasca County",
            "west_baptiste": "Athabasca County",
            "whispering_hills": "Athabasca County",
            "barrhead": "Barrhead County No 11",
            "holden": "Beaver County",
            "ryley": "Beaver County",
            "tofield": "Beaver County",
            "viking": "Beaver County",
            "high_prairie": "Big Lakes",
            "swan_hills": "Big Lakes",
            "ghost_lake": "Bighorn No 8",
            "waiparous": "Bighorn No 8",
            "canmore": ["Bighorn No 8", "Kananaskis Improvement District"],
            "bonnyville": "Bonnyville No 87",
            "bonnyville_beach": "Bonnyville No 87",
            "glendon": "Bonnyville No 87",
            "pelican_narrows": "Bonnyville No 87",
            "breton": "Brazeau County",
            "drayton_valley": "Brazeau County",
            "bashaw": "Camrose County",
            "bawlf": "Camrose County",
            "bittern Lake": "Camrose County",
            "edberg": "Camrose County",
            "ferintosh": "Camrose County",
            "hay_lakes": "Camrose County",
            "rosalind": "Camrose County",
            "cardston": "Cardston County",
            "glenwood": "Cardston County",
            "hill_spring": "Cardston County",
            "magrath": "Cardston County",
            "cleardale": "Clear Hills County",
            "hines_creek": "Clear Hills County",
            "burnstick_lake": "Clearwater County",
            "caroline": "Clearwater County",
            "rocky_mountain_house": "Clearwater County",
            "redcliff": "Cypress County",
            "fairview": "Fairview No 136",
            "alliance": "Flagstaff County",
            "daysland": "Flagstaff County",
            "forestburg": "Flagstaff County",
            "galahad": "Flagstaff County",
            "hardisty": "Flagstaff County",
            "heisler": "Flagstaff County",
            "killam": "Flagstaff County",
            "lougheed": "Flagstaff County",
            "sedgewick": "Flagstaff County",
            "strome": "Flagstaff County",
            "black_diamond": "Foothills No 31",
            "high_river": "Foothills No 31",
            "longview": "Foothills No 31",
            "okotoks": "Foothills No 31",
            "turner_valley": "Foothills No 31",
            "bow_island": "Forty Mile County No 8",
            "foremost": "Forty Mile County No 8",
            "beaverlodge": "Grande Prairie County No 1",
            "hythe": "Grande Prairie County No 1",
            "sexsmith": "Grande Prairie County No 1",
            "wembley": "Grande Prairie County No 1",
            "fox_creek": "Greenview No 16",
            "grande_cache": "Greenview No 16",
            "valleyview": "Greenview No 16",
            "banff": "Improvement District No 9",
            "acme": "Kneehill County",
            "carbon": "Kneehill County",
            "linden": "Kneehill County",
            "three_hills": "Kneehill County",
            "trochu": "Kneehill County",
            "drumheller": ["Kneehill County", "Special Area No 2", "Starland County", "Wheatland County"],
            "alberta_beach": "Lac Ste. Anne County",
            "birch_cove": "Lac Ste. Anne County",
            "castle_island": "Lac Ste. Anne County",
            "mayerthorpe": "Lac Ste. Anne County",
            "nakamun_park": "Lac Ste. Anne County",
            "onoway": "Lac Ste. Anne County",
            "ross_haven": "Lac Ste. Anne County",
            "sandy_beach": "Lac Ste. Anne County",
            "silver_sands": "Lac Ste. Anne County",
            "south_view": "Lac Ste. Anne County",
            "sunrise_beach": "Lac Ste. Anne County",
            "sunset_point": "Lac Ste. Anne County",
            "val_quentin": "Lac Ste. Anne County",
            "west_cove": "Lac Ste. Anne County",
            "yellowstone": "Lac Ste. Anne County",
            "alix": "Lacombe County",
            "bentley": "Lacombe County",
            "birchcliff": "Lacombe County",
            "blackfalds": "Lacombe County",
            "clive": "Lacombe County",
            "eckville": "Lacombe County",
            "gull_lake": "Lacombe County",
            "half_moon_bay": "Lacombe County",
            "sunbreaker_cove": "Lacombe County",
            "andrew": "Lamont County",
            "bruderheim": "Lamont County",
            "chipman": "Lamont County",
            "lamont": "Lamont County",
            "mundare": "Lamont County",
            "beaumont": "Leduc County",
            "calmar": "Leduc County",
            "devon": "Leduc County",
            "golden_days": "Leduc County",
            "itaska_beach": "Leduc County",
            "sundance_beach": "Leduc County",
            "thorsby": "Leduc County",
            "warburg": "Leduc County",
            "slave_lake": "Lesser Slave River No 124",
            "barons": "Lethbridge County",
            "coaldale": "Lethbridge County",
            "coalhurst": "Lethbridge County",
            "nobleford": "Lethbridge County",
            "Picture_butte": "Lethbridge County",
            "high_level": "Mackenzie County",
            "rainbow_lake": "Mackenzie County",
            "fort_vermilion": "Mackenzie County",
            "la_crete": "Mackenzie County",
            "zama_city": "Mackenzie County",
            "innisfree": "Minburn County No 27",
            "mannville": "Minburn County No 27",
            "minburn": "Minburn County No 27",
            "vegreville": "Minburn County No 27",
            "carstairs": "Mountain View County",
            "cremona": "Mountain View County",
            "didsbury": "Mountain View County",
            "olds": "Mountain View County",
            "sundre": "Mountain View County",
            "bassano": "Newell County",
            "duchess": "Newell County",
            "rosemary": "Newell County",
            "manning": "Northern Lights County",
            "peace_river": ["Northern Lights County", "Northern Sunrise County", "Peace No 135"],
            "nampa": "Northern Sunrise County",
            "castor": "Paintearth County No 18",
            "coronation": "Paintearth County No 18",
            "halkirk": "Paintearth County No 18",
            "betula_beach": "Parkland County",
            "kapasiwin": "Parkland County",
            "lakeview": "Parkland County",
            "point_alison": "Parkland County",
            "seba_beach": "Parkland County",
            "spring_lake": "Parkland County",
            "stony_plain": "Parkland County",
            "wabamun": "Parkland County",
            "berwyn": "Peace No 135",
            "grimshaw": "Peace No 135",
            "cowley": "Pincher Creek No 9",
            "lundbreck": "Pincher Creek No 9",
            "pincher_creek": "Pincher Creek No 9",
            "parkland_beach": "Ponoka County",
            "ponoka": "Ponoka County",
            "rimbey": "Ponoka County",
            "amisk": "Provost No 52",
            "czar": "Provost No 52",
            "hughenden": "Provost No 52",
            "provost": "Provost No 52",
            "bowden": "Red Deer County",
            "delburne": "Red Deer County",
            "elnora": "Red Deer County",
            "innisfail": "Red Deer County",
            "jarvis_bay": "Red Deer County",
            "norglenwold": "Red Deer County",
            "penhold": "Red Deer County",
            "sylvan_lake": "Red Deer County",
            "beiseker": "Rocky View County",
            "cochrane": "Rocky View County",
            "crossfield": "Rocky View County",
            "irricana": "Rocky View County",
            "smoky_lake": "Smoky Lake County",
            "vilna": "Smoky Lake County",
            "waskatenau": "Smoky Lake County",
            "donnelly": "Smoky River No 130",
            "falher": "Smoky River No 130",
            "girouxville": "Smoky River No 130",
            "mcLennan": "Smoky River No 130",
            "empress": "Special Area No 2",
            "hanna": "Special Area No 2",
            "cereal": "Special Area No 3",
            "oyen": "Special Area No 3",
            "youngstown": "Special Area No 3",
            "consort": "Special Area No 4",
            "veteran": "Special Area No 4",
            "rycroft": "Spirit River No 133",
            "spirit River": "Spirit River No 133",
            "elk Point": "St Paul County No 19",
            "horseshoe_bay": "St Paul County No 19",
            "st_paul": "St Paul County No 19",
            "delia": "Starland County",
            "morrin": "Starland County",
            "munson": "Starland County",
            "big_valley": "Stettler County No 6",
            "botha": "Stettler County No 6",
            "donalda": "Stettler County No 6",
            "gadsby": "Stettler County No 6",
            "rochon Sands": "Stettler County No 6",
            "stettler": "Stettler County No 6",
            "white_sands": "Stettler County No 6",
            "antler_lake": "Strathcona County",
            "ardrossan": "Strathcona County",
            "collingwood_cove": "Strathcona County",
            "half_moon_lake": "Strathcona County",
            "hastings_lake": "Strathcona County",
            "josephburg": "Strathcona County",
            "north_cooking_lake": "Strathcona County",
            "sherwood_park": "Strathcona County",
            "south_cooking_lake": "Strathcona County",
            "bon_accord": "Sturgeon County",
            "gibbons": "Sturgeon County",
            "legal": "Sturgeon County",
            "morinville": "Sturgeon County",
            "redwater": "Sturgeon County",
            "barnwell": "Taber",
            "taber": "Taber",
            "vauxhall": "Taber",
            "myrnam": "Two Hills County No 21",
            "two_hills": "Two Hills County No 21",
            "willingdon": "Two Hills County No 21",
            "dewberry": "Vermilion River County",
            "kitscoty": "Vermilion River County",
            "marwayne": "Vermilion River County",
            "paradise_valley": "Vermilion River County",
            "vermilion": "Vermilion River County",
            "arrowwood": "Vulcan County",
            "carmangay": "Vulcan County",
            "champion": "Vulcan County",
            "lomond": "Vulcan County",
            "milo": "Vulcan County",
            "vulcan": "Vulcan County",
            "chauvin": "Wainwright No 61",
            "edgerton": "Wainwright No 61",
            "irma": "Wainwright No 61",
            "wainwright": "Wainwright No 61",
            "coutts": "Warner County No 5",
            "milk_river": "Warner County No 5",
            "raymond": "Warner County No 5",
            "stirling": "Warner County No 5",
            "warner": "Warner County No 5",
            "clyde": "Westlock County",
            "larkspur": "Westlock County",
            "westlock": "Westlock County",
            "argentia_beach": "Wetaskiwin County No 10",
            "crystal_springs": "Wetaskiwin County No 10",
            "grandview": "Wetaskiwin County No 10",
            "ma-me-o_beach": "Wetaskiwin County No 10",
            "millet": "Wetaskiwin County No 10",
            "norris_beach": "Wetaskiwin County No 10",
            "poplar_bay": "Wetaskiwin County No 10",
            "silver_beach": "Wetaskiwin County No 10",
            "hussar": "Wheatland County",
            "rockyford": "Wheatland County",
            "standard": "Wheatland County",
            "strathmore": "Wheatland County",
            "claresholm": "Willow Creek No 26",
            "fort_macleod": "Willow Creek No 26",
            "granum": "Willow Creek No 26",
            "nanton": "Willow Creek No 26",
            "stavely": "Willow Creek No 26",
            "Whitecourt": "Woodlands County",
            "edson": "Yellowhead County",
            "hinton": "Yellowhead County",
            "airdrie": ["Rocky View County", "Airdrie"],
            "brooks": ["Newell County No 4", "Brooks"],
            "calgary": ["Rocky View County", "Foothills No 31", "Calgary"],
            "camrose": ["Camrose County No 22", "Camrose"],
            "chestermere": ["Rocky View County", "Chestermere"],
            "cold_lake": ["Bonnyville No 87", "Cold Lake"],
            "edmonton": ["Strathcona County", "Sturgeon County", "Parkland County", "Leduc County", "Edmonton"],
            "fort_saskatchewan": ["Strathcona County", "Sturgeon County", "Fort Saskatchewan"],
            "grande_prairie": ["Grande Prairie County No 1", "Grande Prairie"],
            "lacombe": ["Lacombe County", "Lacombe"],
            "leduc": ["Leduc County", "Leduc"],
            "lethbridge": ["Lethbridge County", "Lethbridge"],
            "lloydminster": ["Vermilion River County No 24", "Lloydminster"],
            "medicine_hat": ["Cypress County", "Medicine Hat"],
            "red_deer": ["Red Deer County", "Red Deer"],
            "spruce_grove": ["Parkland County", "Spruce Grove"],
            "st_albert": ["Sturgeon County", "St Albert"],
            "wetaskiwin": ["Wetaskiwin County No 10", "Wetaskiwin"]
        },
        "Import": {
            "ABAddressBook": {
                "oldHeaders": [
                    "FirstNames",
                    "LastName",
                    "Children",
                    "City",
                    "FieldName",
                    "Address",
                    "PostalCode",
                    "Location",
                    "Directions",
                    "Directions2",
                    "Phone1",
                    "Phone2",
                    "Phone3",
                    "Phone4",
                    "Phone5",
                    "Fax",
                    "Extra",
                    "Notes",
                    "Category"
                ],
                "Headers": [
                    "Name",
                    "GivenName",
                    "AdditionalName",
                    "FamilyName",
                    "YomiName",
                    "GivenNameYomi",
                    "AdditionalNameYomi",
                    "FamilyNameYomi",
                    "NamePrefix",
                    "NameSuffix",
                    "Initials",
                    "Nickname",
                    "ShortName",
                    "MaidenName",
                    "Birthday",
                    "Gender",
                    "Location",
                    "BillingInformation",
                    "DirectoryServer",
                    "Mileage",
                    "Occupation",
                    "Hobby",
                    "Sensitivity",
                    "Priority",
                    "Subject",
                    "Notes",
                    "GroupMembership",
                    "E_mail1_Type",
                    "E_mail1_Value",
                    "E_mail2_Type",
                    "E_mail2_Value",
                    "E_mail3_Type",
                    "E_mail3_Value",
                    "E_mail4_Type",
                    "E_mail4_Value",
                    "E_mail5_Type",
                    "E_mail5_Value",
                    "E_mail6_Type",
                    "E_mail6_Value",
                    "Phone1_Type",
                    "Phone1_Value",
                    "Phone2_Type",
                    "Phone2_Value",
                    "Phone3_Type",
                    "Phone3_Value",
                    "Phone4_Type",
                    "Phone4_Value",
                    "Phone5_Type",
                    "Phone5_Value",
                    "Phone6_Type",
                    "Phone6_Value",
                    "Phone7_Type",
                    "Phone7_Value",
                    "Phone8_Type",
                    "Phone8_Value",
                    "Phone9_Type",
                    "Phone9_Value",
                    "Phone10_Type",
                    "Phone10_Value",
                    "Address1_Type",
                    "Address1_Formatted",
                    "Address1_Street",
                    "Address1_City",
                    "Address1_POBox",
                    "Address1_Region",
                    "Address1_PostalCode",
                    "Address1_Country",
                    "Address1_ExtendedAddress",
                    "Address2_Type",
                    "Address2_Formatted",
                    "Address2_Street",
                    "Address2_City",
                    "Address2_POBox",
                    "Address2_Region",
                    "Address2_PostalCode",
                    "Address2_Country",
                    "Address2_ExtendedAddress",
                    "Organization1_Type",
                    "Organization1_Name",
                    "Organization1_YomiName",
                    "Organization1_Title",
                    "Organization1_Department",
                    "Organization1_Symbol",
                    "Organization1_Location",
                    "Organization1_JobDescription"
                ]
            },
            "CordovaContact": {
                "Object": {
                    "id": null,
                    "rawId": null,
                    "displayName": "",
                    "name": //An object containing all components of a persons name. ContactName Object
                    {
                        "formatted": "",
                        "familyName": "",
                        "givenName": "",
                        "middleName": "",
                        "honorificPrefix": "",
                        "honorificSuffix": ""
                    },
                    "nickname": "",
                    "phoneNumbers": [
                        {
                            "id": null,
                            "type": "",
                            "value": "",
                            "pref": false
                        }
                    ],
                    "emails": [
                        {
                            "id": null,
                            "type": "",
                            "value": "",
                            "pref": false
                        }
                    ],
                    "addresses": [
                        {
                            "id": null,
                            "pref": false,
                            "type": "",
                            "formatted": "",
                            "streetAddress": "",
                            "locality": "",
                            "region": "",
                            "postalCode": "",
                            "country": "" //The country name. _(DOMString)_
                        }
                    ],
                    "ims": [
                        {
                            "id": null,
                            "type": "",
                            "value": "",
                            "pref": false
                        }
                    ],
                    "organizations": [
                        {
                            "id": null,
                            "pref": false,
                            "type": "",
                            "name": "",
                            "department": "",
                            "title": ""
                        }
                    ],
                    "birthday": new Date(),
                    "note": "",
                    "photos": [
                        {
                            "id": null,
                            "type": "",
                            "value": "",
                            "pref": false
                        }
                    ],
                    "categories": [
                        {
                            "id": null,
                            "type": "",
                            "value": "",
                            "pref": false
                        }
                    ],
                    "urls": [
                        //An array of web pages associated with the contact. _(ContactField_
                        {
                            "id": null,
                            "type": "",
                            "value": "",
                            "pref": false
                        }
                    ]
                }
            }
        },
        "Export": {
            "HotmailContacts": {
                "column": [
                    { "_num": "00", "_name": "Title", "__text": "Title" },
                    { "_num": "01", "_name": "First Name", "__text": "GivenName" },
                    { "_num": "02", "_name": "Middle Name" },
                    { "_num": "03", "_name": "Last Name", "__text": "FamilyName" },
                    { "_num": "04", "_name": "Suffix" },
                    { "_num": "05", "_name": "Company" },
                    { "_num": "06", "_name": "Department" },
                    { "_num": "07", "_name": "Job Title" },
                    { "_num": "08", "_name": "Business Street" },
                    { "_num": "09", "_name": "Business City" },
                    { "_num": "10", "_name": "Business State" },
                    { "_num": "11", "_name": "Business Postal Code" },
                    { "_num": "12", "_name": "Business Country" },
                    { "_num": "13", "_name": "Home Street", "__text": "Address" },
                    { "_num": "14", "_name": "Home City", "__text": "City" },
                    { "_num": "15", "_name": "Home State" },
                    { "_num": "16", "_name": "Home Postal Code", "__text": "PostalCode" },
                    { "_num": "17", "_name": "Home Country" },
                    { "_num": "18", "_name": "Business Fax" },
                    { "_num": "19", "_name": "Business Phone" },
                    { "_num": "20", "_name": "Business Phone 2" },
                    { "_num": "21", "_name": "Callback" },
                    { "_num": "22", "_name": "Car Phone" },
                    { "_num": "23", "_name": "Company Main Phone" },
                    { "_num": "24", "_name": "Home Fax", "__text": "Fax" },
                    { "_num": "25", "_name": "Home Phone", "__text": "Phone1" },
                    { "_num": "26", "_name": "Home Phone 2", "__text": "Phone2" },
                    { "_num": "27", "_name": "ISDN" },
                    { "_num": "28", "_name": "Mobile Phone", "__text": "Mobile" },
                    { "_num": "29", "_name": "Other Fax" },
                    { "_num": "30", "_name": "Other Phone", "__text": "Phone3" },
                    { "_num": "31", "_name": "Pager" },
                    { "_num": "32", "_name": "Primary Phone", "__text": "Phone1" },
                    { "_num": "33", "_name": "Radio Phone" },
                    { "_num": "34", "_name": "TTY/TDD Phone" },
                    { "_num": "35", "_name": "Telex" },
                    { "_num": "36", "_name": "Account" },
                    { "_num": "37", "_name": "Anniversary" },
                    { "_num": "38", "_name": "Assistant's Name" },
                    { "_num": "39", "_name": "Billing Information" },
                    { "_num": "40", "_name": "Birthday" },
                    { "_num": "41", "_name": "Business Address PO Box" },
                    { "_num": "42", "_name": "Categories", "__text": "Category" },
                    { "_num": "43", "_name": "Children", "__text": "Children" },
                    { "_num": "44", "_name": "Company Yomi" },
                    { "_num": "45", "_name": "Directory Server" },
                    { "_num": "46", "_name": "E-mail Address" },
                    { "_num": "47", "_name": "E-mail Type" },
                    { "_num": "48", "_name": "E-mail Display Name" },
                    { "_num": "49", "_name": "E-mail 2 Address" },
                    { "_num": "50", "_name": "E-mail 2 Type" },
                    { "_num": "51", "_name": "E-mail 2 Display Name" },
                    { "_num": "52", "_name": "E-mail 3 Address" },
                    { "_num": "53", "_name": "E-mail 3 Type" },
                    { "_num": "54", "_name": "E-mail 3 Display Name" },
                    { "_num": "55", "_name": "Gender" },
                    { "_num": "56", "_name": "Given Yomi" },
                    { "_num": "57", "_name": "Government ID Number" },
                    { "_num": "58", "_name": "Hobby" },
                    { "_num": "59", "_name": "Home Address PO Box" },
                    { "_num": "60", "_name": "Initials" },
                    { "_num": "61", "_name": "Internet Free Busy" },
                    { "_num": "62", "_name": "Keywords" },
                    { "_num": "63", "_name": "Language" },
                    { "_num": "64", "_name": "Location", "__text": "Location" },
                    { "_num": "65", "_name": "Manager's Name" },
                    { "_num": "66", "_name": "Mileage" },
                    { "_num": "67", "_name": "Notes", "__text": "Notes + Directions + Directions2" },
                    { "_num": "68", "_name": "Office Location" },
                    { "_num": "69", "_name": "Organizational ID Number" },
                    { "_num": "70", "_name": "Other Address PO Box" },
                    { "_num": "71", "_name": "Priority" },
                    { "_num": "72", "_name": "Private" },
                    { "_num": "73", "_name": "Profession" },
                    { "_num": "74", "_name": "Referred By" },
                    { "_num": "75", "_name": "Sensitivity" },
                    { "_num": "76", "_name": "Spouse" },
                    { "_num": "77", "_name": "Surname Yomi" },
                    { "_num": "78", "_name": "User 1" },
                    { "_num": "79", "_name": "User 2" },
                    { "_num": "80", "_name": "Web Page" }
                ]
            }
        }
    };
    var Spelling = {
        "CreatedDate": "1384928365563",
        "b": "barrhead",
        "bc": "british_columbia bc",
        "c": "camrose",
        "calg": "calgary",
        "cl": "claresholm",
        "cnc": "calgary_northcentral",
        "cne": "calgary_northeast",
        "cnw": "calgary_northwest",
        "conv": "convention conv",
        "convention": "conv convention",
        "cs": "calgary_south",
        "d": "didsbury",
        "did": "didsbury",
        "dids": "didsbury",
        "e": "edson east",
        "edm": "edmonton",
        "ee": "edmonton_east",
        "enw": "edmonton_northwest",
        "esw": "edmonton_southwest",
        "fm": "fort_mcmurray ft_mcmurray",
        "fort": "fort ft",
        "fsj": "ft_st_john fort_st_john fort_saint_john fsj",
        "ft": "fort ft",
        "ftm": "fort_mcmurray ft_mcmurray",
        "f": "fort_mcmurray ft_mcmurray",
        "gp": "grande_prairie",
        "hr": "high_river",
        "l": "lethbridge lacombe",
        "la": "lacombe",
        "le": "lethbridge",
        "ll": "lloydminster",
        "llo": "lloydminster",
        "mh": "medicine_hat",
        "mountain": "mtn mountain",
        "mtn": "mountain mtn",
        "n": "north northeast northwest northcentral north_central",
        "nc": "northcentral north_central",
        "ne": "northeast",
        "nw": "northwest",
        "p": "pincher_creek",
        "pc": "pincher_creek",
        "pr": "peace_river",
        "r": "rimbey",
        "rd": "red_deer road rd",
        "rmh": "rocky_mtn_house rocky_mountain_house rocky",
        "s": "stettler south southeast southwest",
        "se": "southeast",
        "sk": "saskatchewan sk",
        "sw": "southwest",
        "st": "stettler saint st street",
        "v": "vermilion",
        "w": "whitecourt wainwright west",
        "wa": "wainwright",
        "wh": "whitecourt",
        "y": "yellowknife",
        "yk": "yukon yk",
        /*long a*/
        /*abe*/ "abe": "abe abraham abram bram",
        /*abe*/ "abraham": "abe abraham abram bram",
        /*abe*/ "abram": "abe abraham abram bram",
        /*see egg*/
        /*ale*/ "alayne": "elaine alayne",
        /*aid*/ "ada": "ada",
        /*aid*/ "aden": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
        /*aid*/ "adin": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
        /*aid*/ "aedan": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
        /*aid*/ "aidan": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
        /*aid*/ "aiden": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
        /*aid*/ "aidyn": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
        /*aid*/ "aydan": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
        /*aid*/ "ayden": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
        /*aid*/ "aydin": "aden adin aedan aidan aiden aidyn aydan ayden aydin",
        /*aid*/ "adrianna": "adrianna",
        /*aim*/ "aimee": "aimee amie amy",
        /*aim*/ "amie": "aimee amie amy",
        /*aim*/ "amy": "aimee amie amy",
        /*aim*/ "amos": "amos",
        /*aine*/ "ainsley": "ainsley",
        /*aish*/ "aisha": "aisha",
        /*aiv*/ "ava": "ava eva",
        /*aiv*/ "aven": "aven avonlea",
        /*aiv*/ "avonlea": "aven avonlea",
        /*aiv*/ "avery": "avery avory ayverie",
        /*aiv*/ "avory": "avery avory ayverie",
        /*aiv*/ "ayverie": "avery avory ayverie",
        /*ape*/ "april": "april",
        /*short a*/
        /*ab*/ "abbie": "abbie abby abigail",
        /*ab*/ "abby": "abie abbie abby abigail",
        /*ab*/ "abie": " abie abby abbie abigail",
        /*ab*/ "abigail": "abbie abby abigail gale gayle gail",
        /*add*/ "ad": "ad ade",
        /*add*/ "ade": "ad ade",
        /*add*/ "adam": "adam",
        /*add*/ "adaline": "adaline addie addy adela adelaide adele adeline adell adelle edel",
        /*add*/ "addie": "adaline addie addy adela adelaide adele adeline adell adelle edel",
        /*add*/ "addy": "adaline addie addy adela adelaide adele adeline adell adelle edel",
        /*add*/ "adela": "adaline addie addy adela adelaide adele adeline adell adelle edel",
        /*add*/ "adelaide": "adaline addie addy adela adelaide adele adeline adell adelle edel",
        /*add*/ "adele": "adaline addie addy adela adelaide adele adeline adell adelle edel",
        /*add*/ "adeline": "adaline addie addy adela adelaide adele adeline adell adelle edel",
        /*add*/ "adell": "adaline addie addy adela adelaide adele adeline adell adelle edel",
        /*add*/ "adelle": "adaline addie addy adela adelaide adele adeline adell adelle edel",
        /*add*/ "edel": "ad ada adaline addie addy ade adela adelaide adele adeline adell adelle edel",
        /*add*/ "adasyn": "adasyn addeson addison addisyn addyson adison adisson adyson",
        /*add*/ "addeson": "adasyn addeson addison addisyn addyson adison adisson adyson",
        /*add*/ "addison": "adasyn addeson addison addisyn addyson adison adisson adyson",
        /*add*/ "addisyn": "adasyn addeson addison addisyn addyson adison adisson adyson",
        /*add*/ "addyson": "adasyn addeson addison addisyn addyson adison adisson adyson",
        /*add*/ "adison": "adasyn addeson addison addisyn addyson adison adisson adyson",
        /*add*/ "adisson": "adasyn addeson addison addisyn addyson adison adisson adyson",
        /*add*/ "adyson": "adasyn addeson addison addisyn addyson adison adisson adyson",
        /*af*/ "afton": "afton",
        /*air*/ "erin": "erin",
        /*air*/ "aaron": "aaron aron",
        /*air*/ "aron": "aaron aron",
        /*air*/ "ariana": "ariana arianna",
        /*air*/ "arianna": "ariana arianna",
        /*air*/ "aric": "aric eric erick erik",
        /*air*/ "eric": "aric eric erick erik",
        /*air*/ "erick": "aric eric erick erik",
        /*air*/ "erik": "aric eric erick erik",
        /*air*/ "erica": "erica ericka erika",
        /*air*/ "ericka": "erica ericka erika",
        /*air*/ "erika": "erica ericka erika",
        /*al*/ "al": "al alan allan allen alastair alaster alistair alister allister alban albert alec aleck alex alexander alix alf alfie alfred alonso alonzo alton alvin alwin alwyn",
        /*al*/ "alan": "al alan allan allen",
        /*al*/ "allan": "al alan allan allen",
        /*al*/ "allen": "al alan allan allen",
        /*al*/ "alastair": "alastair alaster alistair alister allister",
        /*al*/ "alaster": "alastair alaster alistair alister allister",
        /*al*/ "alistair": "alastair alaster alistair alister allister",
        /*al*/ "alister": "alastair alaster alistair alister allister",
        /*al*/ "allister": "alastair alaster alistair alister allister",
        /*al*/ "alban": "al alban",
        /*al*/ "albert": "al albert bert bertie",
        /*al*/ "alec": "al alec aleck alex alexander alix",
        /*al*/ "aleck": "al alec aleck alex alexander alix",
        /*al*/ "alexander": "al alec aleck alex alexander alix sandy",
        /*al*/ "alex": "al alec aleck alex alexander alix alexandra alexandria",
        /*al*/ "alix": "al alec aleck alex alexander alix alexandra alexandria",
        /*al*/ "alf": "al alf alfie alfred fred freddie freddy",
        /*al*/ "alfie": "al alf alfie alfred fred freddie freddy",
        /*al*/ "alfred": "al alf alfie alfred fred freddie freddy",
        /*al*/ "alonso": "al alonso alonzo lon lonnie lonny",
        /*al*/ "alonzo": "al alonso alonzo lon lonnie lonny",
        /*al*/ "alton": "al alton",
        /*al*/ "alana": "alana alanna lana",
        /*al*/ "alanna": "alana alanna lana",
        /*al*/ "alexandra": "alex alexandra alix",
        /*al*/ "alexandria": "alex alexandria alix",
        /*al*/ "ali": "ali alli allie ally",
        /*al*/ "alli": "ali alli allie ally",
        /*al*/ "allie": "ali alli allie ally",
        /*al*/ "ally": "ali alli allie ally",
        /*al*/ "alice": "ali alice alli allie ally alyce",
        /*al*/ "alyce": "ali alice alli allie ally alyce",
        /*al*/ "alisa": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
        /*al*/ "alissa": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
        /*al*/ "alyssa": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
        /*al*/ "alisan": "alisan alison allisan allison allysan allyson alysan alyson",
        /*al*/ "alison": "alisan alison allisan allison allysan allyson alysan alyson",
        /*al*/ "allisan": "alisan alison allisan allison allysan allyson alysan alyson",
        /*al*/ "allison": "alisan alison allisan allison allysan allyson alysan alyson",
        /*al*/ "allysan": "alisan alison allisan allison allysan allyson alysan alyson",
        /*al*/ "allyson": "alisan alison allisan allison allysan allyson alysan alyson",
        /*al*/ "alysan": "alisan alison allisan allison allysan allyson alysan alyson",
        /*al*/ "alyson": "alisan alison allisan allison allysan allyson alysan alyson",
        /*al*/ "alivia": "alivia olivia",
        /*al*/ "alberta": "alberta ab alta",
        /*al*/ "ab": "alberta ab alta",
        /*al*/ "alta": "alberta ab alta",
        /*al*/ "alea": "alea aleah allyah",
        /*al*/ "aleah": "alea aleah allyah",
        /*al*/ "allyah": "alea aleah allyah",
        /*al*/ "aleesha": "aleesha alesha alicia alisha allecia alycia",
        /*al*/ "alesha": "aleesha alesha alicia alisha allecia alycia",
        /*al*/ "alicia": "aleesha alesha alicia alisha allecia alycia",
        /*al*/ "alisha": "aleesha alesha alicia alisha allecia alycia",
        /*al*/ "allecia": "aleesha alesha alicia alisha allecia alycia",
        /*al*/ "alycia": "aleesha alesha alicia alisha allecia alycia",
        /*al*/ "aleta": "aleta",
        /*al*/ "alma": "alma",
        /*al*/ "alvin": "al alvin vin vinny elvin",
        /*al*/ "alwin": "al alwin alwyn win",
        /*al*/ "alwyn": "al alwin alwyn win",
        /*all*/ "olive": "olive olivia ollie olly",
        /*all*/ "olivia": "olive olivia ollie olly alivia",
        /*all*/ "ollie": "olive olivia ollie olly oliver oleen olga",
        /*all*/ "olly": "olive olivia ollie olly oliver oleen olga",
        /*all*/ "oliver": "oliver ollie olly",
        /*all*/ "oleen": "oleen ollie olly",
        /*all*/ "olga": "olga ollie olly",
        /*am*/ "amanda": "amanda mandi mandy",
        /*am*/ "amber": "amber",
        /*am*/ "amelia": "amelia emil emilia em",
        /*an*/ "ann": "ann anna anne annie annamay anuschka",
        /*an*/ "anna": "ann anna anne annamay anya",
        /*an*/ "anne": "ann anna anne annie annamay anuschka",
        /*an*/ "annie": "ann anne annie",
        /*an*/ "annamay": "ann anna anne annamay",
        /*an*/ "anya": "anya anna",
        /*an*/ "anabel": "anabel anebel annabel annabelle",
        /*an*/ "anebel": "anabel anebel annabel annabelle",
        /*an*/ "annabel": "anabel anebel annabel annabelle",
        /*an*/ "annabelle": "anabel anebel annabel annabelle",
        /*an*/ "annamarie": "annamarie annemarie anna_marie",
        /*an*/ "annemarie": "annamarie annemarie anne_marie ann_marie",
        /*an*/ "ahnika": "ahnika anika annaka annika",
        /*an*/ "anika": "ahnika anika annaka annika",
        /*an*/ "annaka": "ahnika anika annaka annika",
        /*an*/ "annika": "ahnika anika annaka annika",
        /*an*/ "annaliese": "annaliese annilee anna_lee anne_lee anna_leigh anne_leigh",
        /*an*/ "annilee": "annaliese annilee anna_lee anne_lee anna_leigh anne_leigh",
        /*an*/ "annelle": "annelle annell nell nelle nellie nelly",
        /*an*/ "annell": "annelle annell nell nelle nellie nelly",
        /*an*/ "annette": "annette nettie netty",
        /*an*/ "anecia": "anecia anissa",
        /*an*/ "anissa": "anecia anissa",
        /*an*/ "anita": "anita nita",
        /*an*/ "andre": "andre andreas andres",
        /*an*/ "andreas": "andre andreas andres",
        /*an*/ "andres": "andre andreas andres",
        /*an*/ "andy": "andrew andy",
        /*an*/ "anderson": "anderson andersen",
        /*an*/ "andersen": "anderson andersen",
        /*an*/ "andrea": "andrea andreas",
        /*an*/ "andrew": "andrew andy drew",
        /*an*/ "angela": "angela angeliqua angie",
        /*an*/ "angeliqua": "angela angeliqua angie",
        /*an*/ "angie": "angela angeliqua angie",
        /*an*/ "anthony": "anthony anton antony tony",
        /*an*/ "anton": "anthony anton antony tony",
        /*an*/ "antony": "anthony anton antony tony",
        /*an*/ "anuschka": "anuschka ann anne",
        /*are*/ "auriel": "auriel",
        /*are*/ "ardell": "ardell",
        /*are*/ "aria": "aria",
        /*are*/ "arleen": "arleen arlene arline arlyne",
        /*are*/ "arlene": "arleen arlene arline arlyne",
        /*are*/ "arline": "arleen arlene arline arlyne",
        /*are*/ "arlyne": "arleen arlene arline arlyne",
        /*are*/ "arleigh": "arleigh",
        /*are*/ "arnie": "arnie arnold",
        /*are*/ "arnold": "arnie arnold",
        /*are*/ "art": "art arthur artie arty",
        /*are*/ "arthur": "art arthur artie arty",
        /*are*/ "artie": "art arthur artie arty",
        /*are*/ "arty": "art arthur artie arty",
        /*ash*/ "ash": "ash ashlee ashleigh ashley ashlie asher",
        /*ash*/ "ashlee": "ash ashlee ashleigh ashley ashlie",
        /*ash*/ "ashleigh": "ash ashlee ashleigh ashley ashlie",
        /*ash*/ "ashley": "ash ashlee ashleigh ashley ashlie",
        /*ash*/ "ashlie": "ash ashlee ashleigh ashley ashlie",
        /*ash*/ "asher": "asher ash",
        /*ash*/ "ashlyn": "ashlyn ashlynn",
        /*ash*/ "ashlynn": "ashlyn ashlynn",
        /*ash*/ "ashton": "ashton",
        /*aw*/ "aubrey": "aubrey",
        /*aw*/ "audra": "audra audrey",
        /*aw*/ "audrey": "audra audrey",
        /*aw*/ "augie": "augie august augustine augustus",
        /*aw*/ "august": "august augustine augustus gus gussy gust gustus",
        /*aw*/ "augustine": "august augustine augustus gus gussy gust gustus",
        /*aw*/ "augustus": "august augustine augustus gus gussy gust gustus",
        /*aw*/ "otto": "otto",
        /*aw*/ "atuam": "atuam autumn",
        /*aw*/ "autumn": "atuam autumn",
        /*aw*/ "austen": "austen austin austynn",
        /*aw*/ "austin": "austen austin austynn",
        /*aw*/ "austynn": "austen austin austynn",
        /*axe*/ "axel": "axel",
        /*b*/
        /*bar*/ "barb": "barb barbara barbie",
        /*bar*/ "barbara": "barb barbara barbie",
        /*bar*/ "barbie": "barb barbara barbie",
        /*bar*/ "barney": "barney barnie berney bernie",
        /*bar*/ "barnie": "barney barnie berney bernie",
        /*bar*/ "bart": "bart bartholomew bartlett bartley barty",
        /*bar*/ "bartholomew": "bart bartholomew bartlett bartley barty",
        /*bar*/ "bartlett": "bart bartholomew bartlett bartley barty",
        /*bar*/ "bartley": "bart bartholomew bartlett bartley barty",
        /*bar*/ "barty": "bart bartholomew bartlett bartley barty",
        /*baw*/ "bonnie": "bonnie bonny",
        /*baw*/ "bonny": "bonnie bonny",
        /*baw*/ "bossi": "bossi",
        /*baw*/ "boston": "boston",
        /*bear*/ "barrett": "barrett barrie barry",
        /*bear*/ "barrie": "barrett barrie barry",
        /*bear*/ "barry": "barrett barrie barry",
        /*beck*/ "beck": "beck becky rebecca rebekah",
        /*beck*/ "becky": "beck becky rebecca rebekah",
        /*bee*/ "bea": "bea beatrice beatrix bee",
        /*bee*/ "beatrice": "bea beatrice beatrix bee",
        /*bee*/ "beatrix": "bea beatrice beatrix bee",
        /*bee*/ "bee": "bea beatrice beatrix bee",
        /*ben*/ "ben": "ben benedict bennie benny benjamin benje benjie benjy bennet bennett bensen benson benzen bentley",
        /*ben*/ "benedict": "ben benedict bennie benny",
        /*ben*/ "bennie": "ben benedict bennie benny benjamin",
        /*ben*/ "benny": "ben benedict bennie benny benjamin",
        /*ben*/ "benjamin": "ben benjamin bennie benny",
        /*ben*/ "benje": "ben benje benjie benjy",
        /*ben*/ "benjie": "ben benje benjie benjy",
        /*ben*/ "benjy": "ben benje benjie benjy",
        /*ben*/ "bennet": "ben bennet bennett",
        /*ben*/ "bennett": "ben bennet bennett",
        /*ben*/ "bensen": "ben bensen benson benzen",
        /*ben*/ "benson": "ben bensen benson benzen",
        /*ben*/ "benzen": "ben bensen benson benzen",
        /*ben*/ "bentley": "ben bentley",
        /*bes*/ "bess": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
        /*bes*/ "bessie": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
        /*bes*/ "bessy": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
        /*bes*/ "beth": "bethany bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
        /*bet*/ "bettie": "bettina bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
        /*bet*/ "betty": "bettina bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
        /*bet*/ "bettina": "bettina bettie betty",
        /*beth*/ "bethany": "bethany beth",
        /*bev*/ "bev": "bev beverley beverly bevan",
        /*bev*/ "beverley": "bev beverley beverly",
        /*bev*/ "beverly": "bev beverley beverly",
        /*bev*/ "bevan": "bevan bev",
        /*bill*/ "bill": "bill billie billy will willi william willie willy",
        /*bill*/ "billie": "bill billie billy will willi william willie willy",
        /*bill*/ "billy": "bill billie billy will willi william willie willy",
        /*bla*/ "blanch": "blanch blanche",
        /*bla*/ "blanche": "blanch blanche",
        /*blay*/ "blade": "blade blaiden",
        /*blay*/ "blaiden": "blaiden blade",
        /*blay*/ "blake": "blake",
        /*blay*/ "blain": "blain blaine blane",
        /*blay*/ "blaine": "blain blaine blane",
        /*blay*/ "blane": "blain blaine blane",
        /*blay*/ "blayze": "blayze",
        /*bob*/ "bob": "bob bobbi bobbie bobby robert",
        /*bob*/ "bobbi": "bob bobbi bobbie bobby robert",
        /*bob*/ "bobbie": "bob bobbi bobbie bobby robert",
        /*bob*/ "bobby": "bob bobbi bobbie bobby robert",
        /*boe*/ "beau": "beau",
        /*boe*/ "bodi": "bodi",
        /*boe*/ "bowin": "bowin",
        /*boy*/ "boyd": "boyd",
        /*bra*/ "brock": "brock",
        /*bra*/ "bronwen": "bronwen bronwyn",
        /*bra*/ "bronwyn": "bronwen bronwyn",
        /*brad*/ "brad": "brad bradd bradley",
        /*brad*/ "bradd": "brad bradd bradley",
        /*brad*/ "bradley": "brad bradd bradley",
        /*bram*/ "bram": "abe abraham abram bram",
        /*bran*/ "branden": "branden brandon brendan brenton",
        /*bran*/ "brandon": "branden brandon brendan brenton",
        /*bran*/ "brandy": "brandy",
        /*bran*/ "brant": "brant brent",
        /*bran*/ "brent": "brent brenton brant",
        /*bray*/ "bradden": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
        /*bray*/ "braden": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
        /*bray*/ "bradyn": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
        /*bray*/ "braeden": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
        /*bray*/ "braedon": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
        /*bray*/ "braiden": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
        /*bray*/ "braydan": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
        /*bray*/ "brayden": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
        /*bray*/ "braydin": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
        /*bray*/ "braydon": "bradden braden bradyn braeden braedon braiden braydan brayden braydin braydon",
        /*bray*/ "brady": "brady braidy",
        /*bray*/ "braidy": "brady braidy",
        /*bray*/ "braver": "braver",
        /*bree*/ "bree_ann": "bree_ann bree_anne brianne brie_ann brie_anne",
        /*bree*/ "bree_anne": "bree_ann bree_anne brianne brie_ann brie_anne",
        /*bree*/ "brianne": "bree_ann bree_anne brianne brie_ann brie_anne",
        /*bree*/ "brie_ann": "bree_ann bree_anne brianne brie_ann brie_anne",
        /*bree*/ "brie_anne": "bree_ann bree_anne brianne brie_ann brie_anne",
        /*bree*/ "breana": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
        /*bree*/ "breanna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
        /*bree*/ "bree_anna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
        /*bree*/ "breeanna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
        /*bree*/ "briana": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
        /*bree*/ "brianna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
        /*bree*/ "brie_anna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
        /*bree*/ "brieanna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
        /*bree*/ "bryanna": "breana breanna bree_anna breeanna briana brianna brie_anna brieanna bryanna",
        /*bree*/ "bree": "bree brie",
        /*bree*/ "brie": "bree brie",
        /*bree*/ "brea": "brea breeya bria",
        /*bree*/ "breeya": "brea breeya bria",
        /*bree*/ "bria": "brea breeya bria",
        /*bree*/ "brielle": "brielle briella briellah",
        /*bree*/ "briella": "brielle briella briellah",
        /*bree*/ "briellah": "brielle briella briellah",
        /*bree*/ "brina": "brina sabby sabrina",
        /*bren*/ "brendan": "branden brandon brendan brenton",
        /*bren*/ "brenton": "branden brandon brendan brent brenton",
        /*bren*/ "brenda": "brenda",
        /*bren*/ "brenaya": "brenaya brenna",
        /*bren*/ "brenna": "brenaya brenna",
        /*bren*/ "brennan": "brennan brennen",
        /*bren*/ "brennen": "brennan brennen",
        /*bret*/ "bret": "bret brett",
        /*bret*/ "brett": "bret brett",
        /*brew*/ "bruce": "bruce",
        /*brew*/ "bruno": "bruno",
        /*br-eye*/ "briley": "briley",
        /*br-eye*/ "brian": "brian brien bryan bryen bryon",
        /*br-eye*/ "brien": "brian brien bryan bryen bryon",
        /*br-eye*/ "bryan": "brian brien bryan bryen bryon",
        /*br-eye*/ "bryen": "brian brien bryan bryen bryon",
        /*br-eye*/ "bryon": "brian brien bryan bryen bryon",
        /*br-eye*/ "bryce": "bryce",
        /*br-eye*/ "brysen": "brysen",
        /*bridge*/ "bridget": "bridget bridgette brigid brigit",
        /*bridge*/ "bridgette": "bridget bridgette brigid brigit",
        /*bridge*/ "brigid": "bridget bridgette brigid brigit",
        /*bridge*/ "brigit": "bridget bridgette brigid brigit",
        /*brit*/ "brit": "brit britney britt brittanni brittany brittney",
        /*brit*/ "britney": "brit britney britt brittanni brittany brittney",
        /*brit*/ "britt": "brit britney britt brittanni brittany brittney",
        /*brit*/ "brittanni": "brit britney britt brittanni brittany brittney",
        /*brit*/ "brittany": "brit britney britt brittanni brittany brittney",
        /*brit*/ "brittney": "brit britney britt brittanni brittany brittney",
        /*brin*/ "brynlee": "brynlee bryn brynn",
        /*brin*/ "bryn": "brynlee bryn brynn",
        /*brin*/ "brynn": "brynn brynlee bryn",
        /*see br-eye*/
        /*b-road*/ "broderick": "broderick brodie brody bodi",
        /*b-road*/ "brodie": "broderick brodie brody",
        /*b-road*/ "brody": "broderick brodie brody",
        /*brook*/ "brooklyn": "brooklyn brook brooke brooks",
        /*brook*/ "brook": "brooklyn brook brooke brooks",
        /*brook*/ "brooke": "brooklyn brook brooke brooks",
        /*brook*/ "brooks": "brooklyn brook brooke brooks",
        /*see brew*/
        /*bur*/ "beryl": "beryl burrell",
        /*bur*/ "burrell": "beryl burrell",
        /*bur*/ "burk": "burk",
        /*bur*/ "bern": "barnard barney barnie bern bernard berney bernie",
        /*bur*/ "bernadette": "bernadette bern berney bernie",
        /*bur*/ "berney": "barnard barney barnie bern bernard berney bernie",
        /*bur*/ "bernie": "barnard barney barnie bern bernard berney bernie",
        /*bur*/ "barnard": "barnard barney barnie bern bernard berney bernie",
        /*bur*/ "bernard": "barnard barney barnie bern bernard berney bernie",
        /*bur*/ "berenice": "berenice bernice berniece",
        /*bur*/ "bernice": "berenice bernice berniece",
        /*bur*/ "berniece": "berenice bernice berniece",
        /*bur*/ "bert": "albert bert bertie bertram robert herbert hubert",
        /*bur*/ "bertie": "albert bert bertie bertram robert herbert hubert",
        /*bur*/ "bertram": "bert bertie bertram",
        /*bur*/ "berv": "berv",
        /*bur*/ "berwin": "berwin berwyn berwynn",
        /*bur*/ "berwyn": "berwin berwyn berwynn",
        /*bur*/ "berwynn": "berwin berwyn berwynn",
        /*bye*/ "byron": "byron",
        /*see k*/
        /*soft ch*/
        /*cha*/ "chapel": "chapel",
        /*cha*/ "chad": "chad",
        /*cha*/ "chance": "chance",
        /*cha*/ "chansie": "chansie",
        /*chair*/ "cheri": "cheri cherry",
        /*chair*/ "cherry": "cheri cherry",
        /*char*/ "charlee": "charlee charles charley charlie chuck",
        /*char*/ "charles": "charlee charles charley charlie chuck",
        /*char*/ "charley": "charlee charles charley charlie chuck",
        /*char*/ "charlie": "charlee charles charley charlie chuck",
        /*chay*/ "chase": "chase chas",
        /*chay*/ "chas": "chase chas chastity",
        /*chay*/ "chastity": "chastity chas",
        /*chay*/ "chayton": "chayton",
        /*cheh*/ "chester": "chester chet",
        /*cheh*/ "chet": "chet chester",
        /*chel*/ "chelsea": "chelsea chelsey",
        /*chel*/ "chelsey": "chelsea chelsey",
        /*ch-eye*/ "child": "child",
        /*chih*/ "chip": "chip",
        /*chuh*/ "chub": "chub",
        /*chuh*/ "chuck": "charlee charles charley charlie chuck",
        /*chuh*/ "chukkota": "chukkota chuck",
        /*d*/
        /*see day*/
        /*da*/ "dallas": "dallas dalys",
        /*da*/ "dalys": "dallas dalys",
        /*da*/ "dallan": "dallan",
        /*da*/ "dalton": "dalton",
        /*da*/ "dan": "dan daniel danny dani",
        /*da*/ "daniel": "dan daniel danny dani",
        /*da*/ "danny": "dan daniel danny dani",
        /*da*/ "dani": "dan daniel danny dani",
        /*da*/ "danaka": "danaka danica danika dannika",
        /*da*/ "danica": "danaka danica danika dannika",
        /*da*/ "danika": "danaka danica danika dannika",
        /*da*/ "dannika": "danaka danica danika dannika",
        /*da*/ "danelle": "danelle danielle danneilia",
        /*da*/ "danielle": "danelle danielle danneilia",
        /*da*/ "danneilia": "danelle danielle danneilia",
        /*da*/ "danya": "danya",
        /*da*/ "daphie": "daphie daphne",
        /*da*/ "daphne": "daphie daphne",
        /*dah*/ "declan": "declan dax",
        /*da*/ "daxson": "daxson daxton dacson daxen daxon daxsen dax",
        /*da*/ "daxton": "daxson daxton dacson daxen daxon daxsen dax",
        /*da*/ "dacson": "daxson daxton dacson daxen daxon daxsen dax",
        /*da*/ "daxen": "daxson daxton dacson daxen daxon daxsen dax",
        /*da*/ "daxon": "daxson daxton dacson daxen daxon daxsen dax",
        /*da*/ "daxsen": "daxson daxton dacson daxen daxon daxsen dax",
        /*da*/ "dax": "daxson daxton dacson daxen daxon daxsen dax declan",
        /*dar*/ "darla": "darla",
        /*dar*/ "darleen": "darleen darlene darlyne",
        /*dar*/ "darlene": "darleen darlene darlyne",
        /*dar*/ "darlyne": "darleen darlene darlyne",
        /*dar*/ "darlena": "darlena",
        /*dar*/ "darrick": "darrick",
        /*dar*/ "darcy": "darcy",
        /*dar*/ "darwin": "darwin",
        /*dare*/ "daren": "daren darin darren darrin",
        /*dare*/ "darin": "daren darin darren darrin",
        /*dare*/ "darren": "daren darin darren darrin",
        /*dare*/ "darrin": "daren darin darren darrin",
        /*dare*/ "darienne": "darienne",
        /*dare*/ "dario": "dario",
        /*dare*/ "darius": "darius",
        /*dare*/ "darrel": "darrel darrell darryl daryl derrel daryll",
        /*dare*/ "darrell": "darrel darrell darryl daryl derrel daryll",
        /*dare*/ "darryl": "darrel darrell darryl daryl derrel daryll",
        /*dare*/ "daryl": "darrel darrell darryl daryl derrel daryll",
        /*dare*/ "derrel": "darrel darrell darryl daryl derrel daryll",
        /*dare*/ "daryll": "darrel darrell darryl daryl derrel daryll",
        /*dare*/ "derek": "darrick derek derrick",
        /*dare*/ "derrick": "darrick derek derrick",
        /*dare*/ "darry": "darry",
        /*daw*/ "dom": "dom dominic dominick dominique",
        /*daw*/ "dominic": "dom dominic dominick dominique",
        /*daw*/ "dominick": "dom dominic dominick dominique",
        /*daw*/ "dominique": "dom dominic dominick dominique",
        /*daw*/ "dawn": "dawn don",
        /*daw*/ "don": "dawn don donald donnie donny donavon donal",
        /*daw*/ "donald": "donal don donald donnie donny",
        /*daw*/ "donnie": "donal don donald donnie donny",
        /*daw*/ "donny": "donal don donald donnie donny",
        /*daw*/ "donal": "donal don donald donnie donny",
        /*daw*/ "dona": "dona donna",
        /*daw*/ "donna": "dona donna",
        /*daw*/ "donavon": "donavon don",
        /*daw*/ "dawson": "dawson dawsen",
        /*daw*/ "dawsen": "dawson dawsen",
        /*day*/ "damian": "damian damon damien",
        /*day*/ "damon": "damian damon damien",
        /*day*/ "damien": "damian damon damien",
        /*day*/ "dain": "dain dane",
        /*day*/ "dane": "dain dane",
        /*day*/ "dahlia": "dahlia",
        /*day*/ "dale": "dale",
        /*day*/ "daylan": "daylan daylen",
        /*day*/ "daylen": "daylan daylen",
        /*day*/ "dana": "dana",
        /*day*/ "dayton": "dayton dayson",
        /*day*/ "dayson": "dayton dayson",
        /*day*/ "dave": "dave david davie davy",
        /*day*/ "david": "dave david davie davy",
        /*day*/ "davie": "dave david davie davy",
        /*day*/ "davy": "dave david davie davy",
        /*dee*/ "dee": "dee nadine deanna",
        /*dee*/ "deanna": "deanna dee",
        /*dee*/ "deidre": "deidre",
        /*dee*/ "dean": "dean deane",
        /*dee*/ "deane": "dean deane",
        /*dee*/ "dena": "dena",
        /*deh*/ "deb": "deb debbie debby deborah debra",
        /*deh*/ "debbie": "deb debbie debby deborah debra",
        /*deh*/ "debby": "deb debbie debby deborah debra",
        /*deh*/ "deborah": "deb debbie debby deborah debra",
        /*deh*/ "debra": "deb debbie debby deborah debra",
        /*deh*/ "delbert": "delbert",
        /*deh*/ "delraina": "delraina",
        /*deh*/ "delton": "delton",
        /*deh*/ "delvin": "delvin",
        /*deh*/ "delynn": "delynn",
        /*deh*/ "del": "del delano dell della",
        /*deh*/ "delano": "del delano della",
        /*deh*/ "dell": "del delano dell della",
        /*deh*/ "della": "del delano dell della",
        /*deh*/ "den": "den denis dennis denny",
        /*deh*/ "denis": "den denis dennis denny",
        /*deh*/ "dennis": "den denis dennis denny",
        /*deh*/ "denny": "den denis dennis denny",
        /*deh*/ "denice": "denice denise denyse",
        /*deh*/ "denise": "denice denise denyse",
        /*deh*/ "denyse": "denice denise denyse",
        /*deh*/ "denver": "denver",
        /*der*/ "derwin": "derwin durwin",
        /*der*/ "durwin": "durwin derwin",
        /*deh*/ "deveron": "deveron devren",
        /*deh*/ "devren": "deveron devren",
        /*deh*/ "devin": "devin devon",
        /*deh*/ "devon": "devin devon",
        /*deh*/ "dex": "dex dexter",
        /*deh*/ "dexter": "dex dexter",
        /*die*/ "diane": "diane dianne",
        /*die*/ "dianne": "diane dianne",
        /*die*/ "diana": "diana dianna deanna dee",
        /*die*/ "dianna": "diana dianna deanna dee",
        /*dih*/ "dick": "dick richard",
        /*dih*/ "dickson": "dixon dickson",
        /*dih*/ "dixon": "dixon dickson",
        /*dih*/ "diska": "diska",
        /*dih*/ "district": "district",
        /*dih*/ "dixie": "dixie",
        /*dih*/ "dillon": "dillon dylan",
        /*dih*/ "dylan": "dillon dylan",
        /*see daw*/
        /*door*/ "dora": "dora theo theodora",
        /*door*/ "dorie": "dorie",
        /*door*/ "doreen": "doreen dorene",
        /*door*/ "dorene": "doreen dorene",
        /*door*/ "doris": "doris dorris",
        /*door*/ "dorris": "doris dorris",
        /*door*/ "dorothy": "dorothy",
        /*door*/ "dorson": "dorson",
        /*dr*/ "drew": "andrew andy drew",
        /*dr*/ "drusilla": "drusilla",
        /*duh*/ "doug": "doug douglas douglass",
        /*duh*/ "douglas": "doug douglas douglass",
        /*duh*/ "douglass": "doug douglas douglass",
        /*duh*/ "duncan": "duncan",
        /*duh*/ "dustin": "dustin dusty",
        /*duh*/ "dusty": "dustin dusty",
        /*dw*/ "duane": "duane dwayne dwaine",
        /*dw*/ "dwayne": "duane dwayne dwaine",
        /*dw*/ "dwaine": "duane dwayne dwaine",
        /*dw*/ "duight": "duight",
        /*long e*/
        /*eat*/ "eton": "eton eaton",
        /*eat*/ "eaton": "eton eaton",
        /*ees*/ "easton": "easton",
        /*eed*/ "edith": "edith edyth edythe",
        /*eed*/ "edyth": "edith edyth edythe",
        /*eed*/ "edythe": "edith edyth edythe",
        /*eed*/ "eden": "eden",
        /*eel*/ "elisabeth": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
        /*eel*/ "elizabeth": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
        /*eel*/ "elaine": "elaine alayne",
        /*eel*/ "eli": "eli",
        /*eel*/ "elise": "elise elyse",
        /*eel*/ "elyse": "elise elyse",
        /*eem*/ "emanuel": "emanuel emmanuel",
        /*eem*/ "emmanuel": "emanuel emmanuel",
        /*eeth*/ "ethan": "ethan",
        /*see eat*/
        /*egg*/ "agatha": "agatha aggie agnes",
        /*egg*/ "aggie": "agatha aggie agnes",
        /*egg*/ "agnes": "agatha aggie agnes",
        /*eve*/ "eva": "ava eva",
        /*eve*/ "evol": "evol",
        /*short e*/
        /*eb*/ "ebonee": "ebonee ebonie ebony",
        /*eb*/ "ebonie": "ebonee ebonie ebony",
        /*eb*/ "ebony": "ebonee ebonie ebony",
        /*ed*/ "ed": "ed edmond edmund eddie eddy edgar edward edwin ned ted teddy theo theodore edie",
        /*ed*/ "edna": "edna",
        /*ed*/ "edgar": "ed eddie eddy edgar ted teddy edie",
        /*ed*/ "edmond": "ed edmond edmund eddie eddy edie ted teddy",
        /*ed*/ "edmund": "ed edmond edmund eddie eddy edie ted teddy",
        /*ed*/ "edward": "ed eddie eddy edward ted teddy edie",
        /*ed*/ "edwin": "ed eddie eddy edwin ted teddy edie",
        /*ed*/ "edie": "ed edmond edmund eddie eddy edgar edward edwin ned ted teddy theo theodore edie",
        /*ed*/ "eddie": "ed edmond edmund eddie eddy edgar edward edwin ned ted teddy theo theodore edie",
        /*ed*/ "eddy": "ed edmond edmund eddie eddy edgar edward edwin ned ted teddy theo theodore edie",
        /*ed*/ "edson": "edson",
        /*ef*/ "efren": "efren efron",
        /*ef*/ "efron": "efren efron",
        /*see ur*/
        /*el*/ "el": "el eliot elliot elliott elmer elvin vin elwin elwyn win elwood wood woodrow woody",
        /*el*/ "ella": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",
        /*el*/ "elden": "elden eldon",
        /*el*/ "eldon": "elden eldon",
        /*el*/ "elda": "elda",
        /*el*/ "ellen": "ellen",
        /*el*/ "eleanor": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",
        /*el*/ "elenore": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",
        /*el*/ "eleonore": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",
        /*el*/ "elinor": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",
        /*el*/ "ellie": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",
        /*el*/ "elly": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly",
        /*el*/ "eliot": "el eliot elliot elliott",
        /*el*/ "elliot": "el eliot elliot elliott",
        /*el*/ "elliott": "el eliot elliot elliott",
        /*el*/ "elisa": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
        /*el*/ "elisia": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
        /*el*/ "elissa": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
        /*el*/ "eliza": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
        /*el*/ "elyssa": "alisa alissa alyssa elisa elisia elissa eliza elyssa",
        /*el*/ "elka": "elka",
        /*el*/ "elmer": "el elmer",
        /*el*/ "elvin": "el elvin vin alvin",
        /*el*/ "elwin": "el elwin elwyn win",
        /*el*/ "elwyn": "el elwin elwyn win",
        /*el*/ "elwood": "el elwood wood woodrow woody",
        /*el*/ "elmarie": "elmarie",
        /*el*/ "eloise": "eloise",
        /*el*/ "elora": "elora",
        /*el*/ "else": "else elsie",
        /*el*/ "elsie": "else elsie",
        /*em*/ "em": "ema emma emeli emely emilee emilie emily amelia emil emilia",
        /*em*/ "ema": "ema emma em",
        /*em*/ "emma": "ema emma em",
        /*em*/ "emeli": "emeli emely emilee emilie emily em",
        /*em*/ "emely": "emeli emely emilee emilie emily em",
        /*em*/ "emilee": "emeli emely emilee emilie emily em",
        /*em*/ "emilie": "emeli emely emilee emilie emily em",
        /*em*/ "emily": "emeli emely emilee emilie emily em",
        /*em*/ "emil": "amelia emil emilia em",
        /*em*/ "emilia": "amelia emil emilia em",
        /*em*/ "emmy": "emmy",
        /*em*/ "emery": "emery emarie",
        /*em*/ "emarie": "emery emarie",
        /*see air*/
        /*see ur*/
        /*es*/ "estela": "estela estella",
        /*es*/ "estella": "estela estella",
        /*es*/ "esther": "esther",
        /*eth*/ "ethel": "ethel",
        /*ew*/ "eugene": "eugene gene",
        /*ew*/ "eustace": "eustace eustacia stacey staci stacia stacie stacy",
        /*ew*/ "eustacia": "eustace eustacia stacey staci stacia stacie stacy",
        /*ew*/ "eusebio": "eusebio",
        /*ev*/ "ev": "evan evyn ev",
        /*ev*/ "evan": "evan evyn ev",
        /*ev*/ "evyn": "evan evyn ev",
        /*ev*/ "eveleen": "eveleen eveline evelyn evelynne",
        /*ev*/ "eveline": "eveleen eveline evelyn evelynne",
        /*ev*/ "evelyn": "eveleen eveline evelyn evelynne",
        /*ev*/ "evelynne": "eveleen eveline evelyn evelynne",
        /*ev*/ "everett": "everett everette",
        /*ev*/ "everette": "everett everette",
        /*ez*/ "ezra": "ezra",
        /*faw*/ "fonda": "fonda",
        /*faw*/ "foster": "foster",
        /*fay*/ "fae": "fae faith fay faye",
        /*fay*/ "faith": "fae faith fay faye",
        /*fay*/ "fay": "fae faith fay faye",
        /*fay*/ "faye": "fae faith fay faye",
        /*fair*/ "farren": "farren",
        /*fair*/ "farrow": "farrow farough",
        /*fair*/ "farough": "farrow farough",
        /*fee*/ "phebe": "phebe phoebe",
        /*fee*/ "phoebe": "phebe phoebe",
        /*fell*/ "felicity": "felicity",
        /*fell*/ "felipa": "felipa",
        /*few*/ "funeral": "funeral",
        /*see fur*/
        /*fill*/ "phil": "phil philip phillip philippe",
        /*fill*/ "philip": "phil philip phillip philippe",
        /*fill*/ "phillip": "phil philip phillip philippe",
        /*fill*/ "philippe": "phil philip phillip philippe",
        /*fill*/ "phyllis": "phyllis",
        /*fin*/ "finley": "finley findley finn",
        /*fin*/ "findley": "finley findley finn",
        /*fin*/ "finn": "finley findley finn",
        /*flaw*/ "floss": "flo floss flossie",
        /*flaw*/ "flossie": "flo floss flossie",
        /*floor*/ "flora": "flo flora florence florrie",
        /*floor*/ "florence": "flo flora florence florrie",
        /*floor*/ "florrie": "flo flora florence florrie",
        /*flow*/ "flo": "flo flora florence florrie floss flossie floy",
        /*floy*/ "floy": "flo floy floyd",
        /*floy*/ "floyd": "floyd floy flo",
        /*for*/ "ford": "cliff clifford ford",
        /*see faw*/
        /*see full*/
        /*frah*/ "fran": "fran frances francie francine francis francisco frannie franny",
        /*frah*/ "frances": "fran frances francie francine francis francisco frannie franny",
        /*frah*/ "francie": "fran frances francie francine francis francisco frannie franny",
        /*frah*/ "francine": "fran frances francie francine francis francisco frannie franny",
        /*frah*/ "francis": "fran frances francie francine francis francisco frannie franny frank frankie franklin franklyn franky",
        /*frah*/ "francisco": "fran frances francie francine francis francisco frannie franny frank frankie franklin franklyn franky",
        /*frah*/ "frannie": "fran frances francie francine francis francisco frannie franny",
        /*frah*/ "franny": "fran frances francie francine francis francisco frannie franny",
        /*fray*/ "frank": "francis francisco frank frankie franklin franklyn franky",
        /*fray*/ "frankie": "francis francisco frank frankie franklin franklyn franky",
        /*fray*/ "franklin": "francis francisco frank frankie franklin franklyn franky",
        /*fray*/ "franklyn": "francis francisco frank frankie franklin franklyn franky",
        /*fray*/ "franky": "francis francisco frank frankie franklin franklyn franky",
        /*fray*/ "fraser": "fraser frazer",
        /*fray*/ "frazer": "fraser frazer",
        /*freh*/ "fred": "alfred fred freddie freddy wilfred winfred frederic frederick fredric fredrick",
        /*freh*/ "freddie": "alfred fred freddie freddy wilfred winfred frederic frederick fredric fredrick",
        /*freh*/ "freddy": "alfred fred freddie freddy wilfred winfred frederic frederick fredric fredrick",
        /*freh*/ "frederic": "fred freddie freddy frederic frederick fredric fredrick rick ricky",
        /*freh*/ "frederick": "fred freddie freddy frederic frederick fredric fredrick rick ricky",
        /*freh*/ "fredric": "fred freddie freddy frederic frederick fredric fredrick rick ricky",
        /*freh*/ "fredrick": "fred freddie freddy frederic frederick fredric fredrick rick ricky",
        /*see few*/
        /*full*/ "foulton": "foulton",
        /*fur*/ "fern": "fern",
        /*fur*/ "fernando": "fernando",
        /*gay*/ "gage": "gage guage",
        /*gay*/ "guage": "gage guage",
        /*gay*/ "gale": "abigail gale gayle gail",
        /*gay*/ "gayle": "abigail gale gayle gail",
        /*gay*/ "gail": "abigail gail gale gayle",
        /*gay*/ "gayla": "gayla gale gail gayle",
        /*gay*/ "gabe": "gabe gabriel",
        /*gay*/ "gabriel": "gabe gabriel",
        /*ga*/ "gabrielle": "gabrielle gabby gabi gaby gabi",
        /*ga*/ "gabriela": "gabby gabi gabriela gabriella gaby gabi",
        /*ga*/ "gabriella": "gabby gabi gabriela gabriella gaby gabi",
        /*ga*/ "gabby": "gabby gabi gabriela gabriella gaby gabrielle",
        /*ga*/ "gabi": "gabby gabi gabriela gabriella gaby gabrielle",
        /*ga*/ "gaby": "gabby gabi gabriela gabriella gaby gabrielle",
        /*ga*/ "gavan": "gavan gavin",
        /*ga*/ "gavin": "gavan gavin",
        /*g-air*/ "garret": "garret garrett garet",
        /*g-air*/ "garrett": "garret garrett garet",
        /*g-air*/ "garet": "garret garrett garet",
        /*g-air*/ "garry": "garry gary",
        /*g-air*/ "gary": "garry gary",
        /*gar*/ "garfield": "garfield",
        /*gar*/ "garnet": "garnet",
        /*gar*/ "garth": "garth",
        /*gar*/ "garvin": "garvin",
        /*gur*/ "gertie": "gertie gertrude trudie trudy gertraud",
        /*gur*/ "gertrude": "gertie gertrude trudie trudy gertraud",
        /*gur*/ "gertraud": "gertie gertrude trudie trudy gertraud",
        /*gill*/ "gil": "bert gil gilbert",
        /*gill*/ "gilbert": "bert gil gilbert",
        /*glah*/ "gladys": "gladys",
        /*gleh*/ "glen": "glen glenn",
        /*gleh*/ "glenn": "glen glenn",
        /*gleh*/ "glenda": "glenda",
        /*glor*/ "gloria": "gloria",
        /*gor*/ "gord": "gord gordon",
        /*gor*/ "gordon": "gord gordon",
        /*gray*/ "grace": "grace",
        /*gray*/ "grady": "grady",
        /*gray*/ "gra": "graeme graham graydon grayson",
        /*gray*/ "gray": "gray grey",
        /*gray*/ "grey": "gray grey",
        /*gray*/ "graeme": "graeme graham gra",
        /*gray*/ "graham": "graeme graham gra",
        /*gray*/ "graydon": "graydon gra",
        /*gray*/ "grayson": "grayson gra",
        /*grah or gray*/ "gr": "gr grande great",
        /*grah*/ "grande": "grande gr",
        /*grah*/ "grant": "grant",
        /*gree*/ "greagan": "greagan",
        /*gree*/ "gri": "gri gree griselda",
        /*gree*/ "griselda": "gri gree griselda",
        /*gree*/ "gree": "gri griselda gree",
        /*gree*/ "greer": "greer grier",
        /*gree*/ "grier": "greer grier",
        /*greh*/ "grenald": "grenald",
        /*greh*/ "greg": "greg gregg gregor gregory",
        /*greh*/ "gregg": "greg gregg gregor gregory",
        /*greh*/ "gregor": "greg gregg gregor gregory",
        /*greh*/ "gregory": "greg gregg gregor gregory",
        /*grih*/ "griff": "griff griffin griffith",
        /*grih*/ "griffin": "griff griffin griffith",
        /*grih*/ "griffith": "griff griffin griffith",
        /*guh*/ "gus": "augie august augustine augustus gus gussy gust gustus",
        /*guh*/ "gussy": "augie august augustine augustus gus gussy gust gustus",
        /*guh*/ "gust": "augie august augustine augustus gus gussy gust gustus",
        /*guh*/ "gustus": "augie august augustine augustus gus gussy gust gustus",
        /*gw*/ "gwen": "gwen gwendolen gwendolyn wendy gwynne",
        /*gw*/ "gwendolen": "gwen gwendolen gwendolyn wendy gwynne",
        /*gw*/ "gwendolyn": "gwen gwendolen gwendolyn wendy gwynne",
        /*gw*/ "gwynne": "gwen gwendolen gwendolyn wendy gwynne",
        /*hay*/ "haiden": "hayden haiden",
        /*hay*/ "hayden": "hayden haiden",
        /*hay*/ "hazel": "hazel",
        /*hay*/ "hailey": "hailey haley haylee hayleigh hayley",
        /*hay*/ "haley": "hailey haley haylee hayleigh hayley",
        /*hay*/ "haylee": "hailey haley haylee hayleigh hayley",
        /*hay*/ "hayleigh": "hailey haley haylee hayleigh hayley",
        /*hay*/ "hayley": "hailey haley haylee hayleigh hayley",
        /*hay*/ "hank": "hal hank harold harry henry",
        /*hay*/ "haines": "haines haynes",
        /*hay*/ "haynes": "haines haynes",
        /*hah*/ "hal": "hal hank harold harry henry",
        /*hah*/ "hanna": "hanna hannah",
        /*hah*/ "hannah": "hanna hannah",
        /*hah*/ "hat": "hat",
        /*hair*/ "harold": "hal hank harold harry henry",
        /*hair*/ "harry": "hal hank harold harry henry",
        /*hair*/ "haroldene": "haroldene",
        /*har*/ "harlee": "harlee harley",
        /*har*/ "harley": "harlee harley",
        /*har*/ "hartley": "hartley",
        /*har*/ "harve": "harve harvey harv",
        /*har*/ "harvey": "harve harvey harv",
        /*har*/ "harv": "harve harvey harv",
        /*haw*/ "holly": "holly holley",
        /*haw*/ "holley": "holly holley",
        /*haw*/ "hospital": "hospital",
        /*hee*/ "hee": "hee",
        /*hee*/ "hebron": "hebron",
        /*heh*/ "henry": "hal hank henry",
        /*heh*/ "helen": "helen helene",
        /*heh*/ "helene": "helen helene",
        /*heh*/ "helm": "helm helms",
        /*heh*/ "helms": "helm helms",
        /*heh*/ "health": "health",
        /*heh*/ "heather": "heather",
        /*heh*/ "hendrix": "hendrix",
        /*heh*/ "hesron": "hesron",
        /*her*/ "herb": "bert herb herbert",
        /*her*/ "herbert": "bert herb herbert",
        /*h-eye*/ "heidi": "heidi",
        /*h-eye*/ "heinrich": "heinrich",
        /*hih*/ "hilton": "hilton",
        /*hih*/ "hilary": "hilary hillary",
        /*hih*/ "hillary": "hilary hillary",
        /*hih*/ "hilda": "hilda hildie hylda mathilda matilda",
        /*hih*/ "hildie": "hilda hildie hylda mathilda matilda",
        /*hih*/ "hylda": "hilda hildie hylda mathilda matilda",
        /*see haw*/
        /*hoe*/ "home": "home",
        /*hoe*/ "hope": "hope",
        /*see ow*/
        /*see wah*/
        /*how*/ "howard": "howard howie",
        /*how*/ "howie": "howard howie",
        /*hue*/ "hubert": "bert hubert hugh hughie hugo",
        /*hue*/ "hugh": "bert hubert hugh hughie hugo",
        /*hue*/ "hughie": "bert hubert hugh hughie hugo",
        /*hue*/ "hugo": "bert hubert hugh hughie hugo",
        /*huh*/ "hudson": "hudson",
        /*huh*/ "hunter": "hunter",
        /*huh*/ "huntley": "huntley",
        "ian": "ian",
        "iana": "iana",
        "india": "india",
        "indianna": "indianna",
        "inez": "inez",
        "innisfail": "innisfail",
        "iqbal": "iqbal",
        "einar": "einar",
        "iona": "iona",
        "aileen": "aileen alene eileen",
        "alene": "aileen alene eileen",
        "eileen": "aileen alene eileen",
        "iren": "iren irene",
        "irene": "irene iren",
        "irmgard": "irmgard irma",
        "irma": "irmgard irma",
        "iris": "iris",
        "ike": "ike isaac isaak izak",
        "isaac": "ike isaac isaak izak",
        "isaak": "ike isaac isaak izak",
        "izak": "ike isaac isaak izak",
        "isla": "isla islay",
        "islay": "isla islay",
        "isabel": "bel bell bella belle isabel isabell isabelle isobel isobele issy izabel issie",
        "isabell": "bel bell bella belle isabel isabell isabelle isobel isobele issy izabel issie",
        "isabelle": "bel bell bella belle isabel isabell isabelle isobel isobele issy izabel issie",
        "isobel": "bel bell bella belle isabel isabell isabelle isobel isobele issy izabel issie",
        "isobele": "bel bell bella belle isabel isabell isabelle isobel isobele issy izabel issie",
        "izabel": "bel bell bella belle isabel isabell isabelle isobel isobele issy izabel issie",
        "bel": "bel bell bella belle isabel isabell isabelle isobel isobele izabel",
        "bell": "bel bell bella belle isabel isabell isabelle isobel isobele izabel",
        "belle": "bel bell bella belle isabel isabell isabelle isobel isobele izabel",
        "issy": "isabel isabell isabelle isobel isobele issy izabel issie",
        "issie": "isabel isabell isabelle isobel isobele issy izabel issie",
        "isabella": "isabella isobella izabella issie bel bell bella issy",
        "isobella": "isabella isobella izabella issie bel bell bella issy",
        "izabella": "isabella isobella izabella issie bel bell bella issy",
        "bella": "bel bell bella isabella isobella izabella",
        "ivan": "ivan",
        "ivor": "ivor",
        "jae": "jae jay jayanthe jaynon",
        "jay": "jae jay jayanthe jaynon",
        "jayanthe": "jae jay jayanthe",
        "jacob": "jacob jake jakob",
        "jake": "jacob jake jakob",
        "jakob": "jacob jake jakob",
        "jade": "jade jayd",
        "jayd": "jade jayd",
        "jada": "jada jaida jayda",
        "jaida": "jada jaida jayda",
        "jayda": "jada jaida jayda",
        "jaden": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
        "jadon": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
        "jaeden": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
        "jaedon": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
        "jaiden": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
        "jaidyn": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
        "jaydan": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
        "jayden": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
        "jaydin": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
        "jaydn": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
        "jaydon": "jaden jadon jaeden jaedon jaiden jaidyn jay jaydan jayden jaydin jaydn jaydon",
        "jaimen": "jaimen jamin",
        "jamin": "jaimen jamin",
        "jayla": "jayla",
        "jaylan": "jaylan jaylin jayelynn",
        "jaylin": "jaylan jaylin jayelynn",
        "jayelynn": "jaylan jaylin jayelynn",
        "james": "james jim jimmie jimmy",
        "jamie": "jamie jayme",
        "jayme": "jamie jayme",
        "jane": "jane jayne",
        "jayne": "jane jayne",
        "jayna": "jayna",
        "jaynon": "jaynon jay",
        "janey": "janey janie",
        "janie": "janey janie",
        "jayce": "jace jayce",
        "jace": "jace jayce",
        "jaison": "jaison jason jayson",
        "jason": "jaison jason jayson",
        "jayson": "jaison jason jayson",
        "jack": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
        "jacksen": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
        "jackson": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
        "jacson": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
        "jaxen": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
        "jaxon": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
        "jaxsen": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
        "jaxson": "jack jacksen jackson jacson jaxen jaxon jaxsen jaxson jax",
        "jacalyn": "jacalyn jacklyn jaclyn",
        "jacklyn": "jacalyn jacklyn jaclyn",
        "jaclyn": "jacalyn jacklyn jaclyn",
        "jackie": "jackie jacky jacqueline jacquelyn jax",
        "jacky": "jackie jacky jacqueline jacquelyn jax",
        "jacqueline": "jackie jacky jacqueline jacquelyn jax",
        "jacquelyn": "jackie jacky jacqueline jacquelyn jax",
        "jax": "jacksen jackson jacson jaxen jaxon jaxsen jaxson jax jackie jacky jacqueline jacquelyn",
        "jalena": "jalena",
        "janessa": "janessa",
        "janneka": "janneka",
        "jacinda": "jacinda",
        "jacyntha": "jacyntha",
        "jan": "jan janet janette janice janis jenice",
        "janet": "jan janet janette",
        "janette": "jan janet janette",
        "janice": "jan janice janis jenice",
        "janis": "jan janice janis jenice",
        "jenice": "jan janice janis jenice",
        "janae": "janae janai janay janaya jannea jenae",
        "janai": "janae janai janay janaya jannea jenae",
        "janay": "janae janai janay janaya jannea jenae",
        "janaya": "janae janai janay janaya jannea jenae",
        "jannea": "janae janai janay janaya jannea jenae",
        "jenae": "janae janai janay janaya jannea jenae",
        "janell": "janell janelle",
        "janelle": "janell janelle",
        "janene": "janene janine jeanine jeannine jenneane",
        "janine": "janene janine jeanine jeannine jenneane",
        "jeanine": "janene janine jeanine jeannine jenneane",
        "jeannine": "janene janine jeanine jeannine jenneane",
        "jenneane": "janene janine jeanine jeannine jenneane",
        "jairus": "jairus jarius",
        "jarius": "jarius jairus",
        "jarvis": "jarvis",
        "jasper": "jasper",
        "jassanka": "jassanka",
        "jasmin": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
        "jasmine": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
        "jazmin": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
        "jazmine": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
        "jazmyn": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
        "yasmin": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
        "yasmine": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
        "yazmin": "jasmin jasmine jazmin jazmine jazmyn yasmin yasmine yazmin",
        "jed": "jed",
        "jr": "jr junior",
        "junior": "jr junior",
        "judah": "judah",
        "justin": "justin",
        "geoff": "geoff geoffrey jeff jeffery jeffrey",
        "geoffrey": "geoff geoffrey jeff jeffery jeffrey",
        "jeff": "geoff geoffrey jeff jeffery jeffrey",
        "jeffery": "geoff geoffrey jeff jeffery jeffrey",
        "jeffrey": "geoff geoffrey jeff jeffery jeffrey",
        "jesper": "jesper",
        "gemma": "gemma",
        "general": "general",
        "genevieve": "genevieve",
        "jeanette": "jeanette jeannette",
        "jeannette": "jeanette jeannette",
        "gen": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny jennica jenita jenith",
        "jen": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny jennica jenita jenith",
        "jenn": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny jennica jenita jenith",
        "jenna": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",
        "gena": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",
        "jenne": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",
        "jenni": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",
        "jennie": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",
        "jenny": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",
        "jennifer": "gen jenna gena jen jenn jenne jenni jennie jennifer jenny",
        "jennica": "jennica jenn jen gen",
        "jenita": "jenita jen jenn gen nita",
        "jenith": "jenith jen jenn gen",
        "jenessa": "jenessa jennessa",
        "jennessa": "jenessa jennessa",
        "gerald": "gerald geraldine gerard gerri gerrie gerry jerry",
        "geraldine": "gerald geraldine gerard gerri gerrie gerry jerry",
        "gerard": "gerald geraldine gerard gerri gerrie gerry jerry",
        "gerri": "gerald geraldine gerard gerri gerrie gerry jerry jeremiah jeremy jeremias jeremie",
        "gerrie": "gerald geraldine gerard gerri gerrie gerry jerry jeremiah jeremy jeremias jeremie",
        "gerry": "gerald geraldine gerard gerri gerrie gerry jerry jeremiah jeremy jeremias jeremie",
        "jerry": "gerald geraldine gerard gerri gerrie gerry jerry jeremiah jeremy jeremias jeremie jerome",
        "geralyn": "geralyn",
        "jared": "jared jarek jaret jered",
        "jarek": "jared jarek jaret jered",
        "jaret": "jared jarek jaret jered",
        "jered": "jared jarek jaret jered",
        "jaren": "jaren jaron jarren",
        "jaron": "jaren jaron jarren",
        "jarren": "jaren jaron jarren",
        "jeremiah": "jeremiah jeremy jerry gerri gerrie gerry jeremias jeremie",
        "jeremy": "jeremiah jeremy jerry gerri gerrie gerry jeremias jeremie",
        "jeremias": "jeremiah jeremy jerry gerri gerrie gerry jeremias jeremie",
        "jeremie": "jeremiah jeremy jerry gerri gerrie gerry jeremias jeremie",
        "jerome": "jerome jerry",
        "jericho": "jericho",
        "jerika": "jerika",
        "jess": "jess jessica jesse jessie jessy",
        "jessica": "jess jessica",
        "jesse": "jess jesse jessie jessy",
        "jessie": "jess jesse jessie jessy",
        "jessy": "jess jesse jessie jessy",
        "jett": "jett jhett",
        "jhett": "jett jhett",
        "gelila": "gelila",
        "jiles": "jiles jyles",
        "jyles": "jiles jyles",
        "jill": "jilayne gillian jill jillian jelayne",
        "jelayne": "jilayne jill jelayne",
        "jilayne": "jilayne jill jelayne",
        "gillian": "gillian jill jillian",
        "jillian": "gillian jill jillian",
        "jim": "james jim jimmie jimmy",
        "jimmie": "james jim jimmie jimmy",
        "jimmy": "james jim jimmie jimmy",
        "joe": "joe joey joseph jo",
        "joey": "joe joey joseph jo",
        "joseph": "joe joey joseph jo",
        "jo": "joe joey joseph jo",
        "jobe": "jobe",
        "joel": "joel",
        "joan": "joan",
        "jonah": "jonah",
        "joni": "joni",
        "joann": "joann joanne",
        "joanne": "joann joanne",
        "joceline": "joceline jocelyn",
        "jocelyn": "joceline jocelyn",
        "jodi": "jodi jodie jody",
        "jodie": "jodi jodie jody",
        "jody": "jodi jodie jody",
        "john": "john johnny jon jonathan jonathon jonny johnathon johnathan",
        "johnny": "john johnny jon jonathan jonathon jonny johnathon johnathan",
        "jon": "john johnny jon jonathan jonathon jonny johnathon johnathan",
        "jonathan": "john johnny jon jonathan jonathon jonny johnathon johnathan",
        "jonathon": "john johnny jon jonathan jonathon jonny johnathon johnathan",
        "jonny": "john johnny jon jonathan jonathon jonny johnathon johnathan",
        "johnathon": "john johnny jon jonathan jonathon jonny johnathon johnathan",
        "johnathan": "john johnny jon jonathan jonathon jonny johnathon johnathan",
        "johnson": "johnson johnston",
        "johnston": "johnson johnston",
        "jauna": "jauna",
        "joyce": "joyce",
        "jolene": "jolene joylyn",
        "jose": "jose",
        "jolan": "jolan",
        "jolindie": "jolindie joline jolyn jolynn joylyn",
        "joline": "jolindie joline jolyn jolynn joylyn",
        "jolyn": "jolindie joline jolyn jolynn joylyn",
        "jolynn": "jolindie joline jolyn jolynn joylyn",
        "jordana": "jordana",
        /*jee*/ "gene": "eugene gene georgine jean jeanne",
        "georgine": "georgine jean jeanne gene",
        "jean": "georgine jean jeanne gene",
        "jeanne": "georgine jean jeanne gene",
        "george": "george georgie",
        "georgie": "george georgie",
        "georgette": "georgette",
        "georgia": "georgia jorja",
        "jorja": "georgia jorja",
        "georgina": "georgina gina",
        "gina": "georgina gina",
        "jordain": "jordain jordan jordane jordann jordin jordyn jordy",
        "jordan": "jordain jordan jordane jordann jordin jordyn jordy",
        "jordane": "jordain jordan jordane jordann jordin jordyn jordy",
        "jordann": "jordain jordan jordane jordann jordin jordyn jordy",
        "jordin": "jordain jordan jordane jordann jordin jordyn jordy",
        "jordyn": "jordain jordan jordane jordann jordin jordyn jordy",
        "jordy": "jordain jordan jordane jordann jordin jordyn jordy geordie",
        "geordie": "jordain jordan jordane jordann jordin jordyn geordie jordy",
        "josh": "josh joshua",
        "joshua": "josh joshua",
        "joylyn": "joylyn joylynn joylynne jolene joline jolyn jolynn",
        "joylynn": "joylyn joylynn joylynne jolene joline jolyn jolynn",
        "joylynne": "joylyn joylynn joylynne jolene joline jolyn jolynn",
        "jude": "jude judie judith judy",
        "judie": "jude judie judith judy",
        "judith": "jude judie judith judy",
        "judy": "jude judie judith judy",
        "jule": "jule jules julian julius jul",
        "jules": "jule jules julian julius jul",
        "julian": "jule jules julian julius jul",
        "julius": "jule jules julian julius jul",
        "jul": "jule jules julian julius jul",
        "julianne": "julianne julia julianna",
        "julia": "julianne julia julianna",
        "julianna": "julianne julia julianna",
        "julie": "julie juliet juliette julliette",
        "juliet": "julie juliet juliette julliette",
        "juliette": "julie juliet juliette julliette",
        "julliette": "julie juliet juliette julliette",
        "juneau": "juneau june",
        "june": "juneau june",
        "justice": "justice justus",
        "justus": "justice justus",
        "justina": "justina justine",
        "justine": "justina justine",
        /*k (and hard c)*/
        /*kay*/ "kay": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kaye kay",
        /*kay*/ "kaye": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kaye kay",
        /*kay*/ "cade": "cade kade kayd",
        /*kay*/ "kade": "cade kade kayd",
        /*kay*/ "kayd": "cade kade kayd",
        /*kay*/ "caden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
        /*kay*/ "caiden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
        /*kay*/ "cayden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
        /*kay*/ "kaden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
        /*kay*/ "kadin": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
        /*kay*/ "kadyn": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
        /*kay*/ "kaeden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
        /*kay*/ "kaiden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
        /*kay*/ "kayden": "caden caiden cayden kaden kadin kadyn kaeden kaiden kayden",
        /*kay*/ "cael": "cael cailin kalon kalyn",
        /*kay*/ "cailin": "cael cailin kalon kalyn",
        /*kay*/ "kalon": "cael cailin kalon kalyn",
        /*kay*/ "kalyn": "cael cailin kalon kalyn",
        /*kay*/ "cayla": "cayla kaela kaila kayla kaylah keyla calla",
        /*kay*/ "kaela": "cayla kaela kaila kayla kaylah keyla calla",
        /*kay*/ "kaila": "cayla kaela kaila kayla kaylah keyla calla",
        /*kay*/ "kayla": "cayla kaela kaila kayla kaylah keyla calla",
        /*kay*/ "kaylah": "cayla kaela kaila kayla kaylah keyla calla",
        /*kay*/ "calla": "cayla kaela kaila kayla kaylah keyla calla",
        /*kay*/ "caleb": "caleb cayleb kaleb kayleb kaylob",
        /*kay*/ "cayleb": "caleb cayleb kaleb kayleb kaylob",
        /*kay*/ "kaleb": "caleb cayleb kaleb kayleb kaylob",
        /*kay*/ "kayleb": "caleb cayleb kaleb kayleb kaylob",
        /*kay*/ "kaylob": "caleb cayleb kaleb kayleb kaylob",
        /*kay*/ "kaelee": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
        /*kay*/ "kaelie": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
        /*kay*/ "kailee": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
        /*kay*/ "kailey": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
        /*kay*/ "kaylea": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
        /*kay*/ "kaylee": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
        /*kay*/ "kayleigh": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
        /*kay*/ "kayley": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
        /*kay*/ "kayli": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
        /*kay*/ "kaylie": "kaelee kaelie kailee kailey kaylea kaylee kayleigh kayley kayli kaylie",
        /*kay*/ "kaylene": "kaylene",
        /*kay*/ "kalix": "kalix",
        /*kay*/ "kayce": "kayce",
        /*kay*/ "kaysen": "kaysen",
        /*kay*/ "casey": "cas casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
        /*kay*/ "cassey": "cas cassidy casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
        /*kay*/ "cassi": "cas cassidy casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
        /*kay*/ "cassie": "cas cassidy casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
        /*kay*/ "kasey": "cas casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
        /*kay*/ "cacee": "cas cassidy casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
        /*kay*/ "kasie": "cas casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
        /*kay*/ "kate": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "caitlin": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "caitlyn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "cateline": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "catelyn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "kaitlan": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "kaitlin": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "kaitlyn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "kaitlynn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "katelan": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "katelin": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "katelinn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "katelyn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "katelynn": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy",
        /*kay*/ "katie": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy ketchie",
        /*kay*/ "kattie": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy ketchie",
        /*kay*/ "katty": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy ketchie",
        /*kay*/ "katy": "caitlin caitlyn cateline catelyn kaitlan kaitlin kaitlyn kaitlynn kate katelan katelin katelinn katelyn katelynn katie kattie katty katy ketchie",
        /*ka*/ "kajsa": "kajsa",
        /*k-air*/ "cara": "cara kara",
        /*k-air*/ "kara": "cara kara",
        /*k-air*/ "caren": "caren carin caryn karen karin karon karyn karren",
        /*k-air*/ "carin": "caren carin caryn karen karin karon karyn karren",
        /*k-air*/ "caryn": "caren carin caryn karen karin karon karyn karren",
        /*k-air*/ "karen": "caren carin caryn karen karin karon karyn karren",
        /*k-air*/ "karin": "caren carin caryn karen karin karon karyn karren",
        /*k-air*/ "karon": "caren carin caryn karen karin karon karyn karren",
        /*k-air*/ "karyn": "caren carin caryn karen karin karon karyn karren",
        /*k-air*/ "karren": "caren carin caryn karen karin karon karyn karren",
        /*k-air*/ "carey": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
        /*k-air*/ "carrie": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
        /*k-air*/ "carry": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
        /*k-air*/ "cary": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
        /*k-air*/ "karrie": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
        /*k-air*/ "keri": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
        /*k-air*/ "kerri": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
        /*k-air*/ "kerry": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
        /*k-air*/ "kari": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
        /*k-air*/ "kerrie": "carey carrie carry cary karrie keri kerri kerry kari kerrie",
        /*k-air*/ "kariann": "kari_ann kariann karianne carey_ann carrie_ann carry_ann cary_ann karrie_ann keri_ann kerri_ann kerry_ann kerrie_ann kari_anne carey_anne carrie_anne carry_anne cary_anne karrie_anne keri_anne kerri_anne kerry_anne kerrie_anne",
        /*k-air*/ "karianne": "kari_ann kariann karianne carey_ann carrie_ann carry_ann cary_ann karrie_ann keri_ann kerri_ann kerry_ann kerrie_ann kari_anne carey_anne carrie_anne carry_anne cary_anne karrie_anne keri_anne kerri_anne kerry_anne kerrie_anne",
        /*k-air*/ "carol": "carol carole carrol carroll karol",
        /*k-air*/ "carole": "carol carole carrol carroll karol",
        /*k-air*/ "carrol": "carol carole carrol carroll karol",
        /*k-air*/ "carroll": "carol carole carrol carroll karol",
        /*k-air*/ "karol": "carol carole carrol carroll karol",
        /*k-air*/ "caroline": "carline carlyne caroline carolyn carolynn karoline carlyn karlene",
        /*k-air*/ "carolyn": "carline carlyne caroline carolyn carolynn karoline carlyn karlene",
        /*k-air*/ "carolynn": "carline carlyne caroline carolyn carolynn karoline carlyn karlene",
        /*k-air*/ "karoline": "carline carlyne caroline carolyn carolynn karoline carlyn karlene",
        /*kal*/ "cal": "cal calvin kel kelvin kalvin calby callum",
        /*kal*/ "calvin": "cal calvin kel kelvin kalvin",
        /*see kel*/
        /*kal*/ "kalvin": "cal calvin kel kelvin kalvin",
        /*kal*/ "calby": "calby cal",
        /*kal*/ "callum": "callum cal",
        /*kal*/ "cali": "cali callie kaleigh kaley kali calli kallie",
        /*kal*/ "callie": "cali callie kaleigh kaley kali calli kallie",
        /*kal*/ "kaley": "cali callie kaleigh kaley kali calli kallie",
        /*kal*/ "kali": "cali callie kaleigh kaley kali calli kallie",
        /*kal*/ "calli": "cali callie kaleigh kaley kali calli kallie",
        /*kal*/ "kallie": "cali callie kaleigh kaley kali calli kallie",
        /*kal*/ "kaleigh": "cali callie kaleigh kaley kali calli kallie",
        /*kal*/ "callena": "callena kalena",
        /*kal*/ "kalena": "callena kalena",
        /*kam*/ "cam": "cam cameron camron",
        /*kam*/ "cameron": "cam cameron camron",
        /*kam*/ "camron": "cam cameron camron",
        /*kam*/ "cambria": "cambria",
        /*kam*/ "camila": "camila camilla camille",
        /*kam*/ "camilla": "camila camilla camille",
        /*kam*/ "camille": "camila camilla camille",
        /*kan*/ "candace": "candace candice candy kandace kandis",
        /*kan*/ "candice": "candace candice candy kandace kandis",
        /*kan*/ "candy": "candace candice candy kandace kandis",
        /*kan*/ "kandace": "candace candice candy kandace kandis",
        /*kan*/ "kandis": "candace candice candy kandace kandis",
        /*kar*/ "charissa": "karissa charissa char",
        /*kar*/ "karissa": "karissa charissa char",
        /*kar*/ "carl": "carl carlos karl",
        /*kar*/ "carlos": "carl carlos karl",
        /*kar*/ "karl": "carl carlos karl",
        /*kar*/ "carla": "carla",
        /*kar*/ "karlon": "carline carlyne carlyn karlon carlin",
        /*kar*/ "carlyn": "carline carlyne carlyn karlon carlin karlene",
        /*kar*/ "carlin": "carline carlyne carlyn karlon carlin karlene",
        /*kar*/ "carline": "carline carlyne carlyn karlon carlin karlene",
        /*kar*/ "carlyne": "carline carlyne carlyn karlon carlin karlene",
        /*kar*/ "carlee": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
        /*kar*/ "carleigh": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
        /*kar*/ "carley": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
        /*kar*/ "carli": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
        /*kar*/ "carlie": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
        /*kar*/ "carly": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
        /*kar*/ "karlee": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
        /*kar*/ "karleigh": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
        /*kar*/ "karley": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
        /*kar*/ "karli": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
        /*kar*/ "karlie": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
        /*kar*/ "karly": "carlee carleigh carley carli carlie carly karlee karleigh karley karli karlie karly",
        /*kar*/ "karleen": "karleen karlene carline carlyne",
        /*kar*/ "karlene": "karlene karleen carline carlyne",
        /*kar*/ "carma": "carma karma",
        /*kar*/ "karma": "carma karma",
        /*kar*/ "carmen": "carmen carmine",
        /*kar*/ "carmine": "carmen carmine",
        /*kar*/ "carson": "carson karson",
        /*kar*/ "karson": "carson karson",
        /*kar*/ "carter": "carter",
        /*kash*/ "kashton": "kashton",
        /*kass*/ "cas": "cas cassidy casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra caspar casper",
        /*kass*/ "cass": "cas cassidy casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra caspar casper",
        /*kass*/ "kassandra": "cas casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
        /*kass*/ "casandra": "cas casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
        /*kass*/ "cassandra": "cas casandra casey cass cassandra cassey cassi cassie kasey cacee kasie kassandra",
        /*kass*/ "caspar": "cas caspar casper cass",
        /*kass*/ "casper": "cas caspar casper cass",
        /*kass*/ "cassidy": "cas cass cassey cassi cassie kasey cacee kasie cassidy",
        /*kass*/ "cassia": "cas cass cassey cassi cassie kasey cacee kasie cassia kassia",
        /*kass*/ "kassia": "cassia kassia",
        /*kat*/ "catrina": "catrina catryna katrina katryna katherina tina treena trina",
        /*kat*/ "catryna": "catrina catryna katrina katryna katherina tina treena trina",
        /*kat*/ "katrina": "catrina catryna katrina katryna katherina tina treena trina",
        /*kat*/ "katryna": "catrina catryna katrina katryna katherina tina treena trina",
        /*kat*/ "katherina": "catrina catryna katrina katryna katherina tina treena trina",
        /*kath*/ "catharine": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "catherine": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "catheryn": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "cathie": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "cathryn": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "cathy": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "katharine": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "katherine": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "kathie": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "kathrine": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "kathryn": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "kathrynne": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "kathy": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "katryne": "catharine catherine catheryn cathie cathryn cathy katharine katherine kathie kathrine kathryn kathrynne kathy katryne",
        /*kath*/ "cathlin": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",
        /*kath*/ "cathline": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",
        /*kath*/ "cathleen": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",
        /*kath*/ "kathleen": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",
        /*kath*/ "kathlene": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",
        /*kath*/ "kathlyn": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",
        /*kath*/ "kathlynne": "cathlin cathline cathleen kathleen kathlene kathlyn kathlynne kay",
        /*kaw*/ "calder": "calder",
        /*kaw*/ "colin": "colin collen collin",
        /*kaw*/ "collen": "colin collen collin",
        /*kaw*/ "collin": "colin collen collin",
        /*kaw*/ "coleen": "coleen colleen colene",
        /*kaw*/ "colleen": "coleen colleen colene",
        /*kaw*/ "colene": "coleen colleen colene",
        /*kaw*/ "connan": "connan",
        /*kaw*/ "con": "con connie conny",
        /*kaw*/ "connie": "con connie conny",
        /*kaw*/ "conny": "con connie conny",
        /*kaw*/ "connor": "connor",
        /*kaw*/ "cottage": "cottage",
        /*k-ear*/ "kirsten": "kirsten kyrsten",
        /*k-ear*/ "kyrsten": "kirsten kyrsten",
        /*see key*/
        /*kel*/ "kel": "kel kelley kelli kelly cal calvin kelvin kalvin",
        /*kel*/ "kelvin": "cal calvin kel kelvin kalvin",
        /*kel*/ "kellie": "kel kelley kelli kelly kellie",
        /*kel*/ "kelley": "kel kelley kelli kelly kellie",
        /*kel*/ "kelli": "kel kelley kelli kelly kellie",
        /*kel*/ "kelly": "kel kelley kelli kelly kellie",
        /*kel*/ "kelsey": "kelsey kelsi kelsie",
        /*kel*/ "kelsi": "kelsey kelsi kelsie",
        /*kel*/ "kelsie": "kelsey kelsi kelsie",
        /*kel*/ "kelton": "kelton kelty",
        /*kel*/ "kelty": "kelton kelty",
        /*ken*/ "kenna": "kenna",
        /*ken*/ "ken": "ken kenneth kenny",
        /*ken*/ "kenneth": "ken kenneth kenny kent",
        /*ken*/ "kenny": "ken kenneth kenny",
        /*ken*/ "kendell": "kendell kendall",
        /*ken*/ "kendall": "kendell kendall",
        /*ken*/ "kendra": "kendra",
        /*ken*/ "kennedi": "kennedi kennedy",
        /*ken*/ "kennedy": "kennedi kennedy",
        /*ken*/ "kent": "kenneth kent kenton",
        /*ken*/ "kenton": "kenton kent",
        /*ken*/ "kenya": "kanya kenya",
        /*ken*/ "kanya": "kanya kenya",
        /*ket*/ "ketchie": "ketchie katie",
        /*kev*/ "kev": "kev kevin",
        /*kev*/ "kevin": "kev kevin",
        /*key*/ "kianna": "kianna",
        /*key*/ "keidron": "keidron keadran keadren keadron kidran kidren kidron",
        /*key*/ "keadran": "keidron keadran keadren keadron kidran kidren kidron",
        /*key*/ "keadren": "keidron keadran keadren keadron kidran kidren kidron",
        /*key*/ "keadron": "keidron keadran keadren keadron kidran kidren kidron",
        /*key*/ "kidran": "keidron keadran keadren keadron kidran kidren kidron",
        /*key*/ "kidren": "keidron keadran keadren keadron kidran kidren kidron",
        /*key*/ "kidron": "keidron keadran keadren keadron kidran kidren kidron",
        /*key*/ "keagen": "keagen keaghan keegan",
        /*key*/ "keaghan": "keagen keaghan keegan",
        /*key*/ "keegan": "keagen keaghan keegan",
        /*key*/ "keyla": "keyla",
        /*key*/ "keely": "keely",
        /*key*/ "keonna": "keonna",
        /*key*/ "kesha": "kesha",
        /*key*/ "keaston": "keaston",
        /*key*/ "keith": "keith keithan",
        /*key*/ "keithan": "keith keithan",
        /*key*/ "keaton": "keaton",
        /*hard c long i*/
        /*k-eye*/ "kya": "kya",
        /*k-eye*/ "kyle": "kyle",
        /*k-eye*/ "kyla": "kyla kylah",
        /*k-eye*/ "kylah": "kyla kylah",
        /*k-eye*/ "kylen": "kylen kylenn",
        /*k-eye*/ "kylenn": "kylen kylenn",
        /*k-eye*/ "kyler": "kyler",
        /*k-eye*/ "kiley": "kiley kylee kyley kyli kylie",
        /*k-eye*/ "kylee": "kiley kylee kyley kyli kylie",
        /*k-eye*/ "kyley": "kiley kylee kyley kyli kylie",
        /*k-eye*/ "kyli": "kiley kylee kyley kyli kylie",
        /*k-eye*/ "kylie": "kiley kylee kyley kyli kylie",
        /*k-eye*/ "kyliah": "kyliah kylea kyleigh",
        /*k-eye*/ "kylea": "kyliah kylea kyleigh",
        /*k-eye*/ "kyleigh": "kyliah kylea kyleigh",
        /*k-eye*/ "kyra": "kyra kyrah kyrha",
        /*k-eye*/ "kyrah": "kyra kyrah kyrha",
        /*k-eye*/ "kyrha": "kyra kyrah kyrha",
        /*k-eye*/ "kiral": "kiral",
        /*k-eye*/ "kyren": "kyren",
        /*kew*/ "kumar": "kumar",
        /*kew*/ "cooper": "cooper",
        /*k-ice*/ "kyson": "kyson kysun",
        /*k-ice*/ "kysun": "kyson kysun",
        /*hard c short i*/
        /*kih*/ "kynderly": "kynderly",
        /*kih*/ "kim": "kim kimberley kimberly",
        /*kih*/ "kimberley": "kim kimberley kimberly",
        /*kih*/ "kimberly": "kim kimberley kimberly",
        /*kih*/ "kipp": "kipp",
        /*kih*/ "kitchen": "kitchen",
        /*see k-ear*/
        /*kih*/ "kitly": "kitly",
        /*klah*/ "clancy": "clancy",
        /*kl-air*/ "clair": "clair claire clare",
        /*kl-air*/ "claire": "clair claire clare",
        /*kl-air*/ "clare": "clair claire clare",
        /*kl-air*/ "clara": "clara",
        /*kl-air*/ "clarence": "clarence",
        /*kl-air*/ "clarice": "clarice",
        /*klaw*/ "claud": "claud claude claudia",
        /*klaw*/ "claude": "claud claude claudia",
        /*klaw*/ "claudia": "claud claude claudia",
        /*klaw*/ "clark": "clark clarke",
        /*klaw*/ "clarke": "clark clarke",
        /*klay*/ "clay": "clay clayton",
        /*klay*/ "clayton": "clay clayton",
        /*kleh*/ "clem": "clem clement",
        /*kleh*/ "clement": "clem clement",
        /*klee*/ "cleo": "cleo clio",
        /*klee*/ "clio": "cleo clio",
        /*klee*/ "cleota": "cleota",
        /*klie*/ "clive": "clive",
        /*klih*/ "cliff": "cliff clifford ford",
        /*klih*/ "clifford": "cliff clifford ford",
        /*klih*/ "clint": "clint clinton",
        /*klih*/ "clinton": "clint clinton",
        /*kl-owe*/ "chloe": "chloe cloe khloe",
        /*kl-owe*/ "cloe": "cloe chloe khloe",
        /*kl-owe*/ "khloe": "chloe cloe khloe",
        /*kl-owe*/ "clover": "cloe clover",
        /*hard c long o*/
        /*k-owe*/ "koba": "koba",
        /*k-owe*/ "colby": "colby kobe",
        /*k-owe*/ "kobe": "colby kobe",
        /*k-owe*/ "cody": "cody",
        /*k-owe*/ "coen": "coen",
        /*k-owe*/ "cole": "cole",
        /*k-owe*/ "colt": "colt colter colton",
        /*k-owe*/ "colter": "colt colter",
        /*k-owe*/ "colton": "colt colton",
        /*k-owe*/ "cosette": "cosette",
        /*hard c short o*/
        /*see kaw*/
        /*see kuh*/
        /*kore*/ "cora": "cora kora",
        /*kore*/ "kora": "cora kora",
        /*kore*/ "coral": "coral",
        /*kore*/ "corban": "corban corbin korban korbin",
        /*kore*/ "corbin": "corban corbin korban korbin",
        /*kore*/ "korban": "corban corbin korban korbin",
        /*kore*/ "korbin": "corban corbin korban korbin",
        /*kore*/ "cornie": "cornie",
        /*kore*/ "coralee": "coralee cora_lee corey cory kory cori corri corrie",
        /*kore*/ "cora_lee": "coralee cora_lee corey cory kory cori corri corrie",
        /*kore*/ "kordell": "kordell",
        /*kore*/ "corey": "coralee cora_lee corey cory kory cori corri corrie coryden",
        /*kore*/ "cory": "coralee cora_lee corey cory kory cori corri corrie coryden",
        /*kore*/ "kory": "coralee cora_lee corey cory kory cori corri corrie coryden",
        /*kore*/ "cori": "coralee cora_lee corey cory kory cori corri corrie coryden",
        /*kore*/ "corri": "coralee cora_lee corey cory kory cori corri corrie coryden",
        /*kore*/ "corrie": "coralee cora_lee corey cory kory cori corri corrie coryden",
        /*kore*/ "coryden": "coryden corey cory kory cori corri corrie",
        /*kore*/ "corina": "corina corinna karina",
        /*kore*/ "corinna": "corina corinna karina",
        /*kore*/ "karina": "corina corinna karina",
        /*kore*/ "corine": "corine corinne corrine corynne coreen",
        /*kore*/ "corinne": "corine corinne corrine corynne coreen",
        /*kore*/ "corrine": "corine corinne corrine corynne coreen",
        /*kore*/ "corynne": "corine corinne corrine corynne coreen",
        /*kore*/ "coreen": "corine corinne corrine corynne coreen",
        /*kore*/ "cortney": "cortney courteney courtnee courtney kourtnee kourtney",
        /*kore*/ "courteney": "cortney courteney courtnee courtney kourtnee kourtney",
        /*kore*/ "courtnee": "cortney courteney courtnee courtney kourtnee kourtney",
        /*kore*/ "courtney": "cortney courteney courtnee courtney kourtnee kourtney",
        /*kore*/ "kourtnee": "cortney courteney courtnee courtney kourtnee kourtney",
        /*kore*/ "kourtney": "cortney courteney courtnee courtney kourtnee kourtney",
        /*koy*/ "coy": "coy kai kao",
        /*koy*/ "kai": "coy kai kao",
        /*koy*/ "kao": "coy kai kao",
        /*kray*/ "craig": "craig",
        /*krih*/ "krisean": "krisean kris chris criss",
        /*krih*/ "chris": "chris christian criss cristian kris kristian krystian christopher cris cristopher kristofer kristopher krisean",
        /*krih*/ "christian": "chris christian criss cristian kris kristian krystian",
        /*krih*/ "criss": "chris christian criss cristian kris kristian krystian krisean",
        /*krih*/ "cristian": "chris christian criss cristian kris kristian krystian",
        /*krih*/ "kris": "chris christian criss cristian kris kristian krystian christopher cris cristopher kristofer kristopher krisean krista",
        /*krih*/ "kristian": "chris christian criss cristian kris kristian krystian",
        /*krih*/ "krystian": "chris christian criss cristian kris kristian krystian",
        /*krih*/ "christopher": "chris christopher cris cristopher kris kristofer kristopher",
        /*krih*/ "cris": "chris christopher cris cristopher kris kristofer kristopher krisean",
        /*krih*/ "cristopher": "chris christopher cris cristopher kris kristofer kristopher",
        /*krih*/ "kristofer": "chris christopher cris cristopher kris kristofer kristopher",
        /*krih*/ "kristopher": "chris christopher cris cristopher kris kristofer kristopher",
        /*krih*/ "christensen": "christensen christianson",
        /*krih*/ "christianson": "christensen christianson",
        /*krih*/ "krista": "kris krista",
        /*krih*/ "christal": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
        /*krih*/ "chrystal": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
        /*krih*/ "cristal": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
        /*krih*/ "cristel": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
        /*krih*/ "cristle": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
        /*krih*/ "crystal": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
        /*krih*/ "crystel": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
        /*krih*/ "kristle": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
        /*krih*/ "krystal": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
        /*krih*/ "krystle": "christal chrystal cristal cristel cristle crystal crystel kristle krystal krystle",
        /*krih*/ "christine": "christine kristen kristin kristine kristyn",
        /*krih*/ "kristen": "christine kristen kristin kristine kristyn",
        /*krih*/ "kristin": "christine kristen kristin kristine kristyn",
        /*krih*/ "kristine": "christine kristen kristin kristine kristyn",
        /*krih*/ "kristyn": "christine kristen kristin kristine kristyn",
        /*krih*/ "christina": "christina kristina",
        /*krih*/ "kristina": "christina kristina",
        /*krih*/ "christy": "christy chrysti cristy kristi kristie kristy christie",
        /*krih*/ "chrysti": "christy chrysti cristy kristi kristie kristy christie",
        /*krih*/ "cristy": "christy chrysti cristy kristi kristie kristy christie",
        /*krih*/ "kristi": "christy chrysti cristy kristi kristie kristy christie",
        /*krih*/ "kristie": "christy chrysti cristy kristi kristie kristy christie",
        /*krih*/ "kristy": "christy chrysti cristy kristi kristie kristy christie",
        /*krih*/ "christie": "christy chrysti cristy kristi kristie kristy christie",
        /*krih*/ "krisie": "krisie crissi chrissi chrissy crissy",
        /*krih*/ "crissi": "krisie crissi chrissi chrissy crissy",
        /*krih*/ "chrissi": "krisie crissi chrissi chrissy crissy",
        /*krih*/ "chrissy": "krisie crissi chrissi chrissy crissy",
        /*krih*/ "crissy": "krisie crissi chrissi chrissy crissy",
        /*krew*/ "cruz": "cruz",
        /*hard c short u*/
        /*kuh*/ "cook": "cook cooke",
        /*kuh*/ "cooke": "cook cooke",
        /*kur*/ "kirby": "kirby",
        /*kur*/ "kirk": "kirk",
        /*kur*/ "curt": "curt curtis kurt kurtis",
        /*kur*/ "curtis": "curt curtis kurt kurtis",
        /*kur*/ "kurt": "curt curtis kurt kurtis",
        /*kur*/ "kurtis": "curt curtis kurt kurtis",
        /*kure*/ "keera": "keera keira kiera kira kierra",
        /*kure*/ "keira": "keera keira kiera kira kierra",
        /*kure*/ "kiera": "keera keira kiera kira kierra",
        /*kure*/ "kira": "keera keira kiera kira kierra",
        /*kure*/ "kierra": "keera keira kiera kira kierra",
        /*kure*/ "kieran": "kieran",
        /*hard c long u see kew*/
        /*long a*/
        "lacey": "lacey",
        "lane": "lane lanie layne",
        "lanie": "lane lanie layne",
        "layne": "lane lanie layne",
        "leyton": "leyton",
        /*short a*/
        "lacombe": "lacombe",
        "ladawne": "ladawne ladonn ladon",
        "ladonn": "ladawne ladonn ladon",
        "ladon": "ladawne ladonn ladon",
        "lana": "alana alanna lana",
        "lance": "lance lancelot launcelot",
        "lancelot": "lance lancelot launcelot",
        "launcelot": "lance lancelot launcelot",
        "lancy": "lancy",
        "landon": "landon landyn",
        "landyn": "landon landyn",
        "larry": "larry",
        "larson": "larson larsen",
        "larsen": "larson larsen",
        "lauchie": "lauchie",
        "lavila": "lavila",
        "lavonne": "lavonne",
        "lavern": "lavern laverne",
        "laverne": "lavern laverne",
        "laverna": "laverna verna",
        "verna": "laverna verna",
        "layla": "layla leila",
        "leila": "layla leila",
        /*long e*/
        "lee": "lee leigh leroy lees",
        "leigh": "lee leigh",
        "lees": "lee lees",
        "lea": "lea leah lia leanor",
        "leah": "lea leah lia leanor",
        "lia": "lea leah lia leanor",
        "leanor": "lea leah lia leanor",
        "liane": "leanne liane lea_ann lea_anne lee_ann lee_anne",
        "lea_ann": "leanne liane lea_ann lea_anne lee_ann lee_anne",
        "lea_anne": "leanne liane lea_ann lea_anne lee_ann lee_anne",
        "lee_ann": "leanne liane lea_ann lea_anne lee_ann lee_anne",
        "lee_anne": "leanne liane lea_ann lea_anne lee_ann lee_anne",
        "leanne": "leanne liane lea_ann lea_anne lee_ann lee_anne",
        "leanna": "leanna leiana",
        "leiana": "leanna leiana",
        "liam": "liam",
        "leif": "leif",
        "leo": "leo leon leonard",
        "leon": "leo leon leonard",
        "leona": "leona",
        "lisa": "lisa lissa mel melissa",
        "lissa": "lisa lissa mel melissa",
        "leta": "leta",
        "leroy": "lee leroy roy",
        "levi": "levi",
        /*short e*/
        "leonard": "len lennie lenny leo leon leonard",
        "lenora": "lenora lenore leonora leonore nora norah",
        "lenore": "lenora lenore leonora leonore nora norah",
        "leonora": "lenora lenore leonora leonore nora norah",
        "leonore": "lenora lenore leonora leonore nora norah",
        "nora": "lenora lenore leonora leonore nora norah",
        "norah": "lenora lenore leonora leonore nora norah",
        "len": "len lennie lenny leo leon leonard",
        "lennie": "len lennie lenny leo leon leonard",
        "lenny": "len lennie lenny leo leon leonard",
        "lem": "lem",
        "les": "les lesley leslie lester",
        "lesley": "les lesley leslie",
        "leslie": "les lesley leslie",
        "lester": "les lester",
        "leticia": "leticia letisha letitia lettie tish tisha",
        "letisha": "leticia letisha letitia lettie tish tisha",
        "letitia": "leticia letisha letitia lettie tish tisha",
        "lettie": "leticia letisha letitia lettie tish tisha",
        "tish": "leticia letisha letitia lettie tish tisha",
        "tisha": "leticia letisha letitia lettie tish tisha",
        "levonie": "levonie",
        "lex": "al alec aleck alex alexander alix lex sander sandy",
        "lexus": "lexus",
        "lidia": "lidia lydia",
        "lydia": "lidia lydia",
        "lil": "lil lili lilian lill lilli lillian lillie lilly lily",
        "lili": "lil lili lilian lill lilli lillian lillie lilly lily",
        "lilian": "lil lili lilian lill lilli lillian lillie lilly lily",
        "lill": "lil lili lilian lill lilli lillian lillie lilly lily",
        "lilli": "lil lili lilian lill lilli lillian lillie lilly lily",
        "lillian": "lil lili lilian lill lilli lillian lillie lilly lily",
        "lillie": "lil lili lilian lill lilli lillian lillie lilly lily",
        "lilly": "lil lili lilian lill lilli lillian lillie lilly lily",
        "lily": "lil lili lilian lill lilli lillian lillie lilly lily",
        "lynn": "lynn lynne",
        "lynne": "lynn lynne",
        "linarra": "linarra linara",
        "linara": "linarra linara",
        "linnea": "linnea lynnea",
        "lynnea": "linnea lynnea",
        "linc": "linc lincoln",
        "lincoln": "linc lincoln",
        "linda": "linda lynda",
        "lynda": "linda lynda",
        "lindsay": "lindsay lindsey lyndsay lyndsey lynsi",
        "lindsey": "lindsay lindsey lyndsay lyndsey lynsi",
        "lyndsay": "lindsay lindsey lyndsay lyndsey lynsi",
        "lyndsey": "lindsay lindsey lyndsay lyndsey lynsi",
        "lynsi": "lindsay lindsey lyndsay lyndsey lynsi",
        "lynella": "lynella",
        "linette": "linette lynette",
        "lynette": "linette lynette",
        "lynlee": "lynlee",
        "lysia": "lysia",
        /*liz*/ "liz": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
        /*liz*/ "lizbeth": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
        /*liz*/ "lizzie": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
        /*liz*/ "lizzy": "bess bessie bessy beth bettie betty elisabeth elizabeth liz lizbeth lizzie lizzy",
        "logan": "logan",
        "lois": "lois",
        "lon": "al alonso alonzo lon lonnie lonny",
        "lonnie": "al alonso alonzo lon lonnie lonny",
        "lonny": "al alonso alonzo lon lonnie lonny",
        "larissa": "larissa lorisa",
        "lorisa": "larissa lorisa",
        "lars": "lars laurence laurie lawrence lawrie lorence lorenzo",
        "laurence": "lars laurence laurie lawrence lawrie lorence lorenzo",
        "lawrence": "lars laurence laurie lawrence lawrie lorence lorenzo",
        "lorence": "lars laurence laurie lawrence lawrie lorence lorenzo",
        "lorenzo": "lars laurence laurie lawrence lawrie lorence lorenzo",
        "etta": "etta lauretta loretta retta",
        "lauretta": "etta lauretta loretta retta",
        "loretta": "etta lauretta loretta retta",
        "retta": "etta lauretta loretta retta",
        "laura": "laura lora",
        "lora": "laura lora",
        "lauraine": "lauraine loraine lorrain lorraine",
        "loraine": "lauraine loraine lorrain lorraine",
        "lorrain": "lauraine loraine lorrain lorraine",
        "lorraine": "lauraine loraine lorrain lorraine",
        "laureen": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
        "lauren": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
        "laurene": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
        "laurine": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
        "loreen": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
        "loren": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
        "lorene": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
        "lorine": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
        "laurenne": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
        "lorreen": "laureen lauren laurene laurine loreen loren lorene lorine laurenne lorreen",
        "laurel": "laurel lorel",
        "lorel": "laurel lorel",
        "lauri": "lauri laurie lawrie lori lorie lorri lorrie loree",
        "lori": "lauri laurie lawrie lori lorie lorri lorrie loree",
        "lorie": "lauri laurie lawrie lori lorie lorri lorrie loree",
        "lorri": "lauri laurie lawrie lori lorie lorri lorrie loree",
        "lorrie": "lauri laurie lawrie lori lorie lorri lorrie loree",
        "loree": "lauri laurie lawrie lori lorie lorri lorrie loree",
        "laurie": "lars laurence laurie lawrence lawrie lorence lorenzo lauri lori lorie lorri lorrie loree",
        "lawrie": "lars laurence laurie lawrence lawrie lorence lorenzo lauri lori lorie lorri lorrie loree",
        "lareelyn": "lareelyn",
        "laurinda": "laurinda lorinda",
        "lorinda": "laurinda lorinda",
        "lorne": "lorne",
        "lorna": "lorna",
        "loyal": "loyal",
        "lloyd": "lloyd loy loyd loyde",
        "loy": "lloyd loy loyd loyde lloydminster",
        "loyd": "lloyd loy loyd loyde",
        "loyde": "lloyd loy loyd loyde",
        "lloydminster": "lloydminster",
        "lou": "lewis lou louie louis luis lucinda lucy luci lucie luanne louise lucile lucille luella",
        "luanne": "luanne lou",
        "lewis": "lewis lou louie louis luis",
        "louie": "lewis lou louie louis luis",
        "louis": "lewis lou louie louis luis",
        "luis": "lewis lou louie louis luis",
        "lucinda": "lucinda lou luci lucy lucie",
        "lucy": "luci lucie lucy lucinda",
        "luci": "luci lucie lucy lucinda",
        "lucie": "luci lucie lucy lucinda",
        "lucas": "lucas luke lukas",
        "luke": "lucas luke lukas",
        "lukas": "lucas luke lukas",
        "luella": "luella lou",
        "lucile": "lucile lucille lou",
        "lucille": "lucile lucille lou",
        "louise": "louise lou",
        "luleta": "luleta",
        "luther": "luther",
        "lila": "lila",
        "lyle": "lyle",
        "mae": "mae may",
        "may": "mae may",
        "mabel": "mabel mabelle mable",
        "mabelle": "mabel mabelle mable",
        "mable": "mabel mabelle mable",
        "mason": "mason",
        "mace": "mace macy",
        "macy": "mace macy",
        "madge": "midge madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
        "maddox": "maddox",
        "maigan": "maigan meagan meg megan meghan",
        "meagan": "maigan meagan meg megan meghan",
        "meg": "maigan meagan meg megan meghan",
        "megan": "maigan meagan meg megan meghan",
        "meghan": "maigan meagan meg megan meghan",
        "mavis": "mavis maivis",
        "maivis": "mavis maivis",
        "mcdougal": "mcdougal macdougall",
        "macdougall": "mcdougal macdougall",
        "mcdonald": "mcdonald macdonald",
        "macdonald": "mcdonald macdonald",
        "macrae": "macrae mcrae",
        "mcrae": "macrae mcrae",
        "mackenzie": "mackenzie makenzie mckenzie mackenzi mac mack",
        "makenzie": "mackenzie makenzie mckenzie mackenzi mac mack",
        "mckenzie": "mackenzie makenzie mckenzie mackenzi mac mack",
        "mackenzi": "mackenzie makenzie mckenzie mackenzi mac mack",
        "mac": "mackenzie makenzie mckenzie mackenzi mac mack",
        "mack": "mackenzie makenzie mckenzie mackenzi mac mack",
        "makaila": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
        "makayla": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
        "mckayla": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
        "micaela": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
        "michaela": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
        "mikaela": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
        "mikayla": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
        "mikhayla": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
        "mychaela": "makaila makayla mckayla micaela michaela mikaela mikayla mikhayla mychaela",
        "mckenna": "mckenna",
        "mclane": "mclane maclean mclean",
        "mclean": "mclane maclean mclean",
        "maclean": "mclane maclean mclean",
        /*mah*/ "madalynn": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
        /*mah*/ "madeleine": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
        /*mah*/ "madeline": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
        /*mah*/ "madelyn": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
        /*mah*/ "madelynn": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
        /*mah*/ "madilyn": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
        /*mah*/ "madilynn": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
        /*mah*/ "madelene": "madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
        /*mah*/ "maddison": "maddison madison maddie maddy mady",
        /*mah*/ "madison": "maddison madison maddie maddy mady",
        /*mah*/ "maddie": "maddison madison madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
        /*mah*/ "maddy": "maddison madison madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
        /*mah*/ "mady": "maddison madison madalynn maddie maddy madeleine madeline madelyn madelynn madilyn madilynn mady madelene",
        /*mah*/ "maggie": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory magdalen magdaline",
        /*mah*/ "magdalen": "magdalen magdaline maggie",
        /*mah*/ "magdaline": "magdalen magdaline maggie",
        /*mah*/ "mal": "mal malc malcolm mallory malachi",
        /*mah*/ "malc": "mal malc malcolm",
        /*mah*/ "malcolm": "mal malc malcolm",
        /*mah*/ "malachi": "malachi mel mal",
        /*mah*/ "mallory": "mallory mal mel",
        /*mah*/ "mancel": "mancel",
        /*mah*/ "mandi": "amanda mandi mandy",
        /*mah*/ "mandy": "amanda mandi mandy",
        /*mah*/ "manson": "manson",
        /*mah*/ "mat": "mat matt matthew",
        /*mah*/ "matt": "mat matt matthew",
        /*mah*/ "matthew": "mat matt matthew",
        /*mah*/ "mataya": "mataya",
        /*mah*/ "maverick": "maverick",
        /*mah*/ "max": "max",
        /*mah*/ "maxine": "maxine",
        /*maw*/ "mathilda": "hilda hildie hylda mathilda matilda",
        /*maw*/ "matilda": "hilda hildie hylda mathilda matilda",
        "marc": "marc marcus mark markus",
        "mark": "marc marcus mark markus",
        "marcus": "marc marcus mark markus",
        "markus": "marc marcus mark markus",
        "marg": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
        "margie": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
        "margret": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
        "margaret": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
        "marguerite": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
        "marie": "marie mary mari",
        "mari": "marie mary mari",
        "marina": "marina",
        "mariah": "mariah maria moriah",
        "maria": "mariah maria moriah",
        "moriah": "mariah maria moriah",
        "marge": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
        "margery": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
        "marjorie": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
        "marjory": "madge maggie marg margaret marge margery margie margret marguerite marjorie marjory",
        "marla": "marla",
        "marleen": "marleen",
        "marlin": "marlin marlon",
        "marlon": "marlin marlon",
        "marni": "marni",
        "marsha": "marsha",
        "marshal": "marshal marshall",
        "marshall": "marshal marshall",
        "marcela": "marcela",
        "marci": "marci marcie marcy",
        "marcie": "marci marcie marcy",
        "marcy": "marci marcie marcy",
        "mart": "mart martin marty",
        "martin": "mart martin marty",
        "marty": "mart martin marty",
        "martha": "martha",
        "marv": "marv marvin merv mervin marvyn",
        "marvin": "marv marvin merv mervin marvyn",
        "marvyn": "marv marvin merv mervin marvyn",
        /*see mah*/
        "medicine": "medicine",
        "mel": "lisa lissa mel melissa melanie melinda mindy melvin melisa",
        "melissa": "lisa lissa mel melissa",
        "melanie": "mel melanie",
        "melinda": "mel melinda mindy",
        "melvin": "mel melvin",
        "melisa": "melisa mel",
        "maralee": "maralee",
        "mary": "marie mary mari",
        "mariam": "mariam",
        "mariette": "mariette",
        "marissa": "marissa",
        "marian": "marian marianne marion maryann maryanne mary_anne mary_ann",
        "marianne": "marian marianne marion maryann maryanne mary_anne mary_ann",
        "marion": "marian marianne marion maryann maryanne mary_anne mary_ann",
        "maryann": "marian marianne marion maryann maryanne mary_anne mary_ann",
        "maryanne": "marian marianne marion maryann maryanne mary_anne mary_ann",
        "mary_anne": "marian marianne marion maryann maryanne mary_anne mary_ann",
        "mary_ann": "marian marianne marion maryann maryanne mary_anne mary_ann",
        "marilyn": "marilyn marilynn marlene marlyn marylin merilyn",
        "marilynn": "marilyn marilynn marlene marlyn marylin merilyn",
        "marlene": "marilyn marilynn marlene marlyn marylin merilyn",
        "marlyn": "marilyn marilynn marlene marlyn marylin merilyn",
        "marylin": "marilyn marilynn marlene marlyn marylin merilyn",
        "merilyn": "marilyn marilynn marlene marlyn marylin merilyn",
        "merika": "merika",
        "merle": "merle",
        "merlin": "merlin",
        "mercedes": "mercedes mercy sadie",
        "mercy": "mercedes mercy",
        "myrtle": "myrtle",
        "merv": "marv marvin merv mervin marvyn",
        "mervin": "marv marvin merv mervin marvyn",
        "mia": "mia maia maya mya",
        "maia": "mia maia maya mya",
        "maya": "mia maia maya mya",
        "mya": "mia maia maya mya",
        "mikka": "mikka micah meeka maika",
        "micah": "mikka micah meeka maika",
        "meeka": "mikka micah meeka maika",
        "maika": "mikka micah meeka maika",
        "mieke": "mieke mikai mikie",
        "mikai": "mieke mikai mikie",
        "mikie": "mieke mikai mikie",
        "myla": "myla",
        "milan": "milan",
        "millie": "millie",
        "miles": "miles myles",
        "myles": "miles myles",
        "mira": "mira myra",
        "myra": "mira myra",
        "mikiyo": "mikiyo",
        "micael": "micael michael micheal mickey mike mikel",
        "michael": "micael michael micheal mickey mike mikel",
        "micheal": "micael michael micheal mickey mike mikel",
        "mickey": "micael michael micheal mickey mike mikel",
        "mike": "micael michael micheal mickey mike mikel",
        "mikel": "micael michael micheal mickey mike mikel",
        "michele": "michele michelle",
        "michelle": "michele michelle",
        "midge": "madge midge",
        "miguel": "miguel",
        "mildred": "mildred",
        "mindy": "mel melinda mindy",
        "minea": "minea",
        "minerva": "minerva",
        "mitch": "mitch mitchell",
        "mitchell": "mitch mitchell",
        "mo": "mo moe mose moses",
        "moe": "mo moe mose moses",
        "mose": "mo moe mose moses",
        "moses": "mo moe mose moses",
        "mollie": "mollie molly",
        "molly": "mollie molly",
        "monica": "monica monika",
        "monika": "monica monika",
        "montague": "montague monte montgomery monty",
        "monte": "montague monte montgomery monty",
        "montgomery": "montague monte montgomery monty",
        "monty": "montague monte montgomery monty",
        "maureen": "maureen",
        "morgan": "morgan",
        "maurice": "maurice morris",
        "morris": "maurice morris",
        "mumu": "mumu",
        "munro": "munro",
        "muriel": "muriel",
        "murray": "murray",
        /*nah*/ "nadine": "dee nadine",
        /*nah*/ "nanda": "nanda",
        /*nah*/ "narcylheen": "narcylheen",
        /*nah*/ "nash": "nash",
        /*nah*/ "nan": "nan nana nance nancie nancy nanny nina",
        /*nah*/ "nana": "nan nana nance nancie nancy nanny nina",
        /*nah*/ "nance": "nan nana nance nancie nancy nanny nina",
        /*nah*/ "nancie": "nan nana nance nancie nancy nanny nina",
        /*nah*/ "nancy": "nan nana nance nancie nancy nanny nina",
        /*nah*/ "nanny": "nan nana nance nancie nancy nanny nina",
        /*nah*/ "nat": "nat nate nathan nathanial nathaniel",
        /*nah*/ "nathanial": "nat nate nathan nathanial nathaniel",
        /*nah*/ "nathaniel": "nat nate nathan nathanial nathaniel",
        /*nah*/ "natalia": "natalia natalie nathalie",
        /*nah*/ "natalie": "natalia natalie nathalie",
        /*nah*/ "nathalie": "natalia natalie nathalie",
        /*nah*/ "natasha": "natasha nattie natty natisha",
        /*nah*/ "nattie": "natasha nattie natty natisha",
        /*nah*/ "natty": "natasha nattie natty natisha",
        /*nah*/ "natisha": "natasha nattie natty natisha",
        /*nay*/ "nathan": "nat nate nathan nathanial nathaniel",
        /*nay*/ "nate": "nat nate nathan nathanial nathaniel",
        /*nay*/ "naomi": "naomi",
        /*nee*/ "nita": "nita anita jenita renita renata reta rita",
        /*nee*/ "neal": "neal neil",
        /*nee*/ "neil": "neal neil",
        /*nee*/ "nielson": "nielson nielsen neilson neilsen",
        /*nee*/ "nielsen": "nielson nielsen neilson neilsen",
        /*nee*/ "neilson": "nielson nielsen neilson neilsen",
        /*nee*/ "neilsen": "nielson nielsen neilson neilsen",
        /*neh*/ "nell": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly annelle",
        /*neh*/ "nelle": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly annelle",
        /*neh*/ "nellie": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly annelle",
        /*neh*/ "nelly": "eleanor elenore eleonore elinor ella ellie elly nell nelle nellie nelly annelle",
        /*neh*/ "ned": "ed edmond edmund eddie eddy edwin ned ted teddy theo theodore edie",
        /*neh*/ "netta": "netta nettie netty",
        /*neh*/ "nettie": "netta nettie netty",
        /*neh*/ "netty": "netta nettie netty",
        /*neh*/ "nevil": "nevil nevill neville",
        /*neh*/ "nevill": "nevil nevill neville",
        /*neh*/ "neville": "nevil nevill neville",
        "nicholas": "nic nicholas nikolas nick nicolas nicholus",
        "nikolas": "nic nicholas nikolas nick nicolas nicholus",
        "nick": "nic nicholas nikolas nick nicolas nicholus",
        "nicolas": "nic nicholas nikolas nick nicolas nicholus",
        "nicholus": "nic nicholas nikolas nick nicolas nicholus",
        "niko": "nicole nikki nikky nicki nicky nicol nic niko",
        "nic": "nicole nikki nikky nicki nicky nicol nic niko",
        "nicole": "nicole nikki nikky nicki nicky nicol nic niko",
        "nikki": "nicole nikki nikky nicki nicky nicol nic niko",
        "nikky": "nicole nikki nikky nicki nicky nicol nic niko",
        "nicki": "nicole nikki nikky nicki nicky nicol nic niko",
        "nicky": "nicole nikki nikky nicki nicky nicol nic niko",
        "nicol": "nicole nikki nikky nicki nicky nicol nic niko",
        /*nix*/ "nixon": "nixon",
        /*nigh*/ "ngaire": "ngaire",
        /*nigh*/ "nigel": "nigel",
        /*nigh*/ "niles": "niles",
        /*nigh*/ "nina": "nan nana nance nancie nancy nanny nina",
        /*no*/ "noah": "noah",
        /*no*/ "noel": "noel nowell noelle",
        /*no*/ "nowell": "noel nowell noelle",
        /*no*/ "noelle": "noel nowell noelle",
        /*no*/ "nola": "nola",
        /*no*/ "nolan": "nolan",
        /*no*/ "nona": "nona",
        /*non*/ "nonylheen": "nonylheen",
        /*nor*/ "norma": "norma",
        /*nor*/ "norton": "norton",
        /*nor*/ "norm": "norm norman",
        /*nor*/ "norman": "norm norman",
        "neuman": "neuman neumann",
        "neumann": "neuman neumann",
        /*see are*/
        /*see aw*/
        /*see all*/
        /*or*/ "orin": "orin orrin orrion",
        /*or*/ "orrin": "orin orrin orrion",
        /*or*/ "orrion": "orin orrin orrion",
        /*or*/ "orlyn": "orlyn",
        /*or*/ "orma": "orma",
        /*or*/ "orton": "orton",
        /*oh*/ "oakley": "oakley",
        /*oh*/ "odessa": "odessa",
        /*oh*/ "olds": "olds",
        /*oh*/ "olson": "olson olsen olsson",
        /*oh*/ "olsen": "olson olsen olsson",
        /*oh*/ "olsson": "olson olsen olsson",
        /*oh*/ "ove": "ove",
        /*oh*/ "owen": "owen",
        /*ow*/ "hour": "hour",
        /*pah*/ "pam": "pam pamela pammie pammy",
        /*pah*/ "pamela": "pam pamela pammie pammy",
        /*pah*/ "pammie": "pam pamela pammie pammy",
        /*pah*/ "pammy": "pam pamela pammie pammy",
        /*pah*/ "pat": "pat patricia patsy patti pattie patty tricia trish trisha trissie patrick",
        /*pah*/ "patricia": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
        /*pah*/ "patsy": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
        /*pah*/ "patti": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
        /*pah*/ "pattie": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
        /*pah*/ "patty": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
        /*pah*/ "patrick": "pat patrick",
        /*pah*/ "pattison": "pattison paddison",
        /*pah*/ "paddison": "pattison paddison",
        /*paw*/ "paul": "paul",
        /*paw*/ "pauline": "pauline",
        /*paw*/ "ponoka": "ponoka",
        /*paw*/ "possibly": "possibly",
        /*par*/ "parke": "parke parks",
        /*par*/ "parks": "parke parks",
        /*par*/ "park": "park pk",
        /*par*/ "pk": "park pk",
        /*pay*/ "paye": "payton peyton paye paige",
        /*pay*/ "paige": "paige paye page",
        /*pay*/ "page": "paige page",
        /*pay*/ "payton": "payton peyton paye",
        /*pay*/ "peyton": "payton peyton paye",
        /*pair*/ "perry": "perry",
        /*see pur*/
        /*peh*/ "peggy": "peggy",
        /*peh*/ "penny": "penny",
        /*see f*/
        /*pee*/ "pete": "pete peter",
        /*pee*/ "peter": "pete peter",
        /*pee*/ "peterson": "petersen peterson",
        /*pee*/ "petersen": "petersen peterson",
        /*pih*/ "pipke": "pipke",
        /*prayer*/ "prairie": "prairie",
        /*preh*/ "preston": "preston",
        /*prih*/ "priscilla": "priscilla",
        /*pur*/ "pearl": "pearl",
        /*pur*/ "percy": "percy",
        /*quay*/ "kwade": "kwade",
        /*quih*/ "quentin": "quentin quenton quinn quintin quinton kwyntin",
        /*quih*/ "quenton": "quentin quenton quinn quintin quinton kwyntin",
        /*quih*/ "quintin": "quentin quenton quinn quintin quinton kwyntin",
        /*quih*/ "quinton": "quentin quenton quinn quintin quinton kwyntin",
        /*quih*/ "kwyntin": "quentin quenton quinn quintin quinton kwyntin",
        /*quih*/ "quincy": "quentin quenton quincy quinn quintin quinton kwyntin",
        /*quih*/ "quindy": "quindy quinn",
        /*quih*/ "quinn": "quentin quenton quincy quindy quinn quintin quinton kwyntin",
        /*ra*/ "rachael": "rachael rachel rachelle",
        /*ra*/ "rachel": "rachael rachel rachelle",
        /*ra*/ "rachelle": "rachael rachel rachelle",
        /*ra*/ "racquel": "racquel raquel",
        /*ra*/ "raquel": "racquel raquel",
        /*ra*/ "radhika": "radhika",
        /*ra*/ "ralph": "ralph",
        /*ra*/ "ramona": "ramona",
        /*ra*/ "randy": "randy",
        /*ra*/ "ransom": "ransom",
        /*raw*/ "rob": "bert bob bobbi bobbie bobby rob robbie robby robert robin robyn",
        /*raw*/ "robbie": "bert bob bobbi bobbie bobby rob robbie robby robert robin robyn",
        /*raw*/ "robby": "bert bob bobbi bobbie bobby rob robbie robby robert robin robyn",
        /*raw*/ "robert": "bert bob bobbi bobbie bobby rob robbie robby robert robin robyn",
        /*raw*/ "robin": "bert bob bobbi bobbie bobby rob robbie robby robert robin robyn",
        /*raw*/ "robyn": "bert bob bobbi bobbie bobby rob robbie robby robert robin robyn",
        /*raw*/ "roberta": "roberta",
        /*raw*/ "rocky": "rocky",
        /*raw*/ "roderic": "rick ricky roderic roderick rod roddy",
        /*raw*/ "roderick": "rick ricky roderic roderick rod roddy",
        /*raw*/ "rod": "rod roddy roderic roderick rodney rodger roger",
        /*raw*/ "roddy": "rod roddy roderic roderick rodney",
        /*raw*/ "rodney": "rod roddy rodney",
        /*raw*/ "rodger": "rod rodger roger",
        /*raw*/ "roger": "rod rodger roger",
        /*raw*/ "ron": "ron ronald ronnie ronny",
        /*raw*/ "ronald": "ron ronald ronnie ronny",
        /*raw*/ "ronnie": "ron ronald ronnie ronny ronni veronica",
        /*raw*/ "ronny": "ron ronald ronnie ronny ronni veronica",
        /*raw*/ "ronni": "ron ronald ronnie ronny ronni veronica",
        /*raw*/ "rhonda": "rhonda ronda",
        /*raw*/ "ronda": "rhonda ronda",
        /*raw*/ "roselin": "rosaline roselin rosalyn rozlynn rose rosie rosy rosa",
        /*raw*/ "rosalyn": "rosaline roselin rosalyn rozlynn rose rosie rosy rosa",
        /*raw*/ "rozlynn": "rosaline roselin rosalyn rozlynn rose rosie rosy rosa",
        /*raw*/ "roscoe": "roscoe ross",
        /*raw*/ "ross": "roscoe ross",
        /*raw*/ "roxana": "roxana roxanna roxanne roxie roxy",
        /*raw*/ "roxanna": "roxana roxanna roxanne roxie roxy",
        /*raw*/ "roxanne": "roxana roxanna roxanne roxie roxy",
        /*raw*/ "roxie": "roxana roxanna roxanne roxie roxy",
        /*raw*/ "roxy": "roxana roxanna roxanne roxie roxy",
        /*ray*/ "ray": "ray raymond raymund raynold",
        /*ray*/ "raya": "raya raina rana rayma",
        /*ray*/ "raeanne": "rhiannon raeanne reanne riane",
        /*ray*/ "reanne": "rhiannon raeanne reanne riane",
        /*ray*/ "raelyn": "raelyn raelynn",
        /*ray*/ "raelynn": "raelyn raelynn",
        /*ray*/ "rayma": "rayma raya",
        /*ray*/ "raina": "raina rana raya",
        /*ray*/ "rana": "raina rana raya",
        /*ray*/ "raymond": "ray raymond raymund",
        /*ray*/ "raymund": "ray raymond raymund",
        /*ray*/ "raynold": "raynold ray",
        /*ree*/ "riane": "raeanne reanne riane",
        /*ree*/ "rhiannon": "rhiannon raeanne reanne riane",
        /*ree*/ "rio": "rio",
        /*ree*/ "reagan": "reagan regan",
        /*ree*/ "regan": "reagan regan",
        /*ree*/ "reece": "reece reese rhys",
        /*ree*/ "reese": "reece reese rhys",
        /*ree*/ "rhys": "reece reese rhys",
        /*ree*/ "reed": "reed reid read",
        /*ree*/ "reid": "reed reid read",
        /*ree*/ "read": "reed reid read",
        /*ree*/ "reta": "renita renata reta rita nita",
        /*ree*/ "rita": "renita renata reta rita nita",
        /*reh*/ "rebecca": "beck becky rebecca rebekah",
        /*reh*/ "rebekah": "beck becky rebecca rebekah",
        /*reh*/ "red": "red",
        /*reh*/ "reg": "reg reggie reginald",
        /*reh*/ "reggie": "reg reggie reginald",
        /*reh*/ "reginald": "reg reggie reginald",
        /*reh*/ "relieta": "relieta",
        /*reh*/ "rex": "rex",
        /*reh*/ "rhett": "rhett",
        /*reh*/ "remington": "remington remi remy",
        /*reh*/ "remi": "remington remi remy",
        /*reh*/ "remy": "remington remi remy",
        /*reh*/ "rena": "renae rena rene",
        /*reh*/ "renae": "renae rena rene",
        /*reh*/ "rene": "renie renae rene renee rennie renny reni renie",
        /*reh*/ "renee": "renie rene renee rennie renny reni renie",
        /*reh*/ "rennie": "renie rene renee rennie renny reni renie",
        /*reh*/ "renny": "renie rene renee rennie renny reni renie",
        /*reh*/ "renie": "renie rene renee rennie renny reni renie",
        /*reh*/ "renita": "renita renata reta rita nita",
        /*reh*/ "renata": "renita renata reta rita nita",
        /*r-eye*/ "rian": "rian rion ryan ryon",
        /*r-eye*/ "rion": "rian rion ryan ryon",
        /*r-eye*/ "ryan": "rian rion ryan ryon",
        /*r-eye*/ "ryon": "rian rion ryan ryon",
        /*r-eye*/ "rydan": "rydan",
        /*r-eye*/ "ryder": "ryder",
        /*r-eye*/ "ryker": "ryker",
        /*r-eye*/ "rylan": "rylan rylen ryland",
        /*r-eye*/ "rylen": "rylan rylen ryland",
        /*r-eye*/ "ryland": "rylan rylen ryland",
        /*r-eye*/ "ryley": "ryley reilly riley rilea",
        /*r-eye*/ "reilly": "ryley reilly riley rilea",
        /*r-eye*/ "riley": "ryley reilly riley rilea",
        /*r-eye*/ "rilea": "ryley reilly riley rilea",
        /*see raw*/
        /*see r-eye*/
        /*rih*/ "rich": "broderick rich richard richie rick ricky",
        /*rih*/ "richard": "broderick rich richard richie rick ricky",
        /*rih*/ "richie": "broderick rich richard richie rick ricky",
        /*rih*/ "rick": "broderick rich richard richie rick ricky roderic roderick frederic frederick fredric fredrick",
        /*rih*/ "ricky": "broderick rich richard richie rick ricky roderic roderick frederic frederick fredric fredrick",
        /*roar*/ "rorke": "rorke",
        /*roar*/ "rory": "rory",
        /*row*/ "rodey": "rodey rhodey",
        /*row*/ "rhodey": "rodey rhodey",
        /*row*/ "rohini": "rohini rowena",
        /*row*/ "roland": "roland rolland",
        /*row*/ "rolland": "roland rolland",
        /*row*/ "rolanda": "rolanda rolando",
        /*row*/ "rolando": "rolanda rolando",
        /*row*/ "roman": "roman",
        /*row*/ "ronan": "ronan",
        /*row*/ "rowan": "rowan",
        /*row*/ "rowena": "rohini rowena",
        /*row*/ "rose": "rosabel rosabelle rose rosie rosy rosa rosalee rosalie roselea rosa_lee rosa_lea rosaline roselin rosalyn rozlynn rosanne rosemarie rosemary rose_marie rose_mary",
        /*row*/ "rosa": "rosabel rosabelle rose rosie rosy rosa rosabella",
        /*row*/ "rosabel": "rosabel rosabelle rose rosie rosy rosa",
        /*row*/ "rosabelle": "rosabel rosabelle rose rosie rosy rosa",
        /*row*/ "rosabella": "rosabella rosa",
        /*row*/ "rosalee": "rosalee rosalie rose rosie rosy rosa rosa roselea rosa_lee rosa_lea",
        /*row*/ "rosalie": "rosalee rosalie rose rosie rosy rosa rosa roselea rosa_lee rosa_lea",
        /*row*/ "roselea": "rosalee rosalie rose rosie rosy rosa rosa roselea rosa_lee rosa_lea",
        /*row*/ "rosaline": "rosaline roselin rosalyn rozlynn rose rosie rosy rosa",
        /*row*/ "rosanna": "rosanna roseanna rose_anna",
        /*row*/ "roseanna": "rosanna roseanna rose_anna",
        /*row*/ "rosanne": "rosanne rose rosie rosy rose_anne rose_ann",
        /*row*/ "rosemarie": "rose rosemarie rosemary rosie rosy rose_marie rose_mary",
        /*row*/ "rosemary": "rose rosemarie rosemary rosie rosy rose_marie rose_mary",
        /*row*/ "rosie": "rosabel rosabelle rose rosie rosy rosa rosalee rosalie roselea rosa_lee rosa_lea rosaline roselin rosalyn rozlynn rosanne rosemarie rosemary rose_marie rose_mary",
        /*row*/ "rosy": "rosabel rosabelle rose rosie rosy rosa rosalee rosalie roselea rosa_lee rosa_lea rosaline roselin rosalyn rozlynn rosanne rosemarie rosemary rose_marie rose_mary",
        /*see raw*/
        /*see roar*/
        /*roy*/ "roy": "leroy roy royden royal",
        /*roy*/ "royal": "royal roy",
        /*roy*/ "royden": "royden roy",
        /*rue*/ "reuben": "reuben",
        /*rue*/ "rubie": "rubie ruby",
        /*rue*/ "ruby": "rubie ruby",
        /*rue*/ "ruth": "ruth ruthie",
        /*rue*/ "ruthie": "ruth ruthie",
        /*ruh*/ "russ": "russ russel russell",
        /*ruh*/ "russel": "russ russel russell",
        /*ruh*/ "russell": "russ russel russell",
        /*say*/ "sabby": "brina sabby sabrina",
        /*say*/ "sadie": "mercedes sadie",
        /*say*/ "sage": "sage",
        /*say*/ "saya": "saya",
        /*say*/ "saylor": "saylor",
        /*say*/ "saint": "saint st",
        /*say*/ "sayvrie": "sayvrie",
        /*say*/ "sailey": "sailey",
        /*sah*/ "sabrina": "brina sabby sabrina",
        "sal": "sal sallie sally",
        "sallie": "sal sallie sally",
        "sally": "sal sallie sally",
        "sander": "al alec aleck alex alexander alix lex sander sandy",
        "sam": "sam samantha sammie sammy samuel",
        "samantha": "sam samantha sammie sammy",
        "sammie": "sam samantha sammie sammy",
        "sammy": "sam samantha sammie sammy samuel",
        "samuel": "sam sammy samuel",
        "samara": "samara samaria",
        "samaria": "samara samaria",
        "sandra": "sandra sandy sandi",
        "sandi": "sandra sandy sandi",
        "sandy": "sandy sandra sandi",
        "sara": "sara sarah",
        "sarah": "sara sarah",
        "sari": "sari sarita",
        "sarita": "sari sarita",
        "savanna": "savanna savannah",
        "savannah": "savanna savannah",
        "scott": "scott scottie scotty",
        "scottie": "scott scottie scotty",
        "scotty": "scott scottie scotty",
        "seb": "seb sebastian",
        "sebastian": "seb sebastian",
        "celine": "celine selene",
        "selene": "celine selene",
        "celena": "celena celina lena lina selena selina",
        "celina": "celena celina lena lina selena selina",
        "lena": "celena celina lena lina selena selina",
        "lina": "celena celina lena lina selena selina",
        "selena": "celena celina lena lina selena selina",
        "selina": "celena celina lena lina selena selina",
        "sienna": "sienna syena ciana",
        "syena": "sienna syena ciana",
        "ciana": "sienna syena ciana",
        "sierra": "sierra ciara",
        "ciara": "sierra ciara",
        "cecily": "cecily cicely cissy sissy",
        "cicely": "cecily cicely cissy sissy",
        "cissy": "cecelia cecilia cecillia celia cissy sissy cecil cecile cecily cicely sissi",
        "sissy": "cecelia cecilia cecillia celia cissy sissy cecil cecile cecily cicely sissi",
        "sissi": "cecelia cecilia cecillia celia cissy sissy cecil cecile cecily cicely sissi",
        "cindy": "cindy cynth cynthia cyndi",
        "cynth": "cindy cynth cynthia cyndi",
        "cynthia": "cindy cynth cynthia cyndi",
        "cyndi": "cindy cynth cynthia cyndi",
        "cecelia": "cecelia cecilia cecillia celia cissy sissy sissi",
        "cecilia": "cecelia cecilia cecillia celia cissy sissy sissi",
        "cecillia": "cecelia cecilia cecillia celia cissy sissy sissi",
        "celia": "cecelia cecilia cecillia celia cissy sissy sissi",
        "cecil": "cecil cecile cissy sissy sissi",
        "cecile": "cecil cecile cissy sissy sissi",
        "shaeli": "shaeli",
        "shaelyn": "shaelyn shaelynne shaelynn",
        "shaelynne": "shaelyn shaelynne shaelynn",
        "shaelynn": "shaelyn shaelynne shaelynn",
        "shaylene": "cheylene shaylene",
        "cheylene": "cheylene shaylene",
        "shayla": "shayla shiella",
        "shiella": "shayla shiella",
        "shane": "shane shayne",
        "shayne": "shane shayne",
        "shalaina": "shalaina",
        "chandra": "chandra",
        "shannon": "shannon",
        "chantal": "chantal",
        "charl": "char charl charlene sharleen charlotte",
        "charlotte": "char charl charlotte",
        "charlene": "char charl charlene sharleen",
        "sharleen": "char charl charlene sharleen",
        "char": "char charl charlene sharleen charlotte",
        "sharon": "sharon sharron",
        "sharron": "sharon sharron",
        "sean": "sean shaun shawn shaan",
        "shaun": "sean shaun shawn shaan",
        "shawn": "sean shaun shawn shaan",
        "shaan": "sean shaun shawn shaan",
        "shauna": "shauna shawna",
        "shawna": "shauna shawna",
        "shalanne": "shalanne chelan",
        "chelan": "chelan shalanne",
        "shelley": "shelley shelli shelly",
        "shelli": "shelley shelli shelly",
        "shelly": "shelley shelli shelly",
        "sheridan": "sheridan",
        "sherri": "sherri sherry",
        "sherry": "sherri sherry",
        "cheryl": "cheryl sherrill sheryl",
        "sherrill": "cheryl sherrill sheryl",
        "sheryl": "cheryl sherrill sheryl",
        "cherene": "cherene",
        "cheyanne": "cheyanne",
        "shirl": "shirl shirlee shirley shirlie",
        "shirlee": "shirl shirlee shirley shirlie",
        "shirley": "shirl shirlee shirley shirlie",
        "shirlie": "shirl shirlee shirley shirlie",
        "sid": "sid sidney syd sydney",
        "sidney": "sid sidney syd sydney",
        "syd": "sid sidney syd sydney",
        "sydney": "sid sidney syd sydney",
        "silvester": "silvester syl sylvester vester",
        "syl": "silvester syl sylvester vester silvia sylvia sylvie",
        "sylvester": "silvester syl sylvester vester",
        "vester": "silvester syl sylvester vester",
        "silvia": "silvia syl sylvia sylvie",
        "sylvia": "silvia syl sylvia sylvie",
        "sylvie": "silvia syl sylvia sylvie",
        "sylvain": "sylvain sylvene",
        "sylvene": "sylvain sylvene",
        "simeon": "simeon simon",
        "simon": "simeon simon",
        "simons": "simons simmonds",
        "simmonds": "simons simmonds",
        "cynder": "cynder",
        "cyril": "cyril",
        "sofia": "sofia sofie sophia sophie sophy",
        "sofie": "sofia sofie sophia sophie sophy",
        "sophia": "sofia sofie sophia sophie sophy",
        "sophie": "sofia sofie sophia sophie sophy",
        "sophy": "sofia sofie sophia sophie sophy",
        "sophiane": "sophiane sophie_anne sofie_anne sophie_ann sofie_ann",
        "sophie_anne": "sophiane sophie_anne sofie_anne sophie_ann sofie_ann",
        "sofie_anne": "sophiane sophie_anne sofie_anne sophie_ann sofie_ann",
        "sophie_ann": "sophiane sophie_anne sofie_anne sophie_ann sofie_ann",
        "sofie_ann": "sophiane sophie_anne sofie_anne sophie_ann sofie_ann",
        "sonia": "sonia sonya",
        "sonya": "sonia sonya",
        "spencer": "spencer spence",
        "spence": "spencer spence",
        "stan": "stan stanley",
        "stanley": "stan stanley",
        /*stay*/ "stacey": "eustace eustacia stacey staci stacia stacie stacy",
        /*stay*/ "staci": "eustace eustacia stacey staci stacia stacie stacy",
        /*stay*/ "stacie": "eustace eustacia stacey staci stacia stacie stacy",
        /*stay*/ "stacy": "eustace eustacia stacey staci stacia stacie stacy",
        /*stay*/ "stacia": "eustacia stacey staci stacia stacie stacy",
        "stef": "stef stefan steff steffan steph stephan stephen steve steven stevie stefanie steffanie stephanie stephany stephie stephanne",
        "stefan": "stef stefan steff steffan steph stephan stephen steve steven stevie",
        "steff": "stef stefan steff steffan steph stephan stephen steve steven stevie stefanie steffanie stephanie stephany stephie stephanne",
        "steffan": "stef stefan steff steffan steph stephan stephen steve steven stevie",
        "steph": "stef stefan steff steffan steph stephan stephen steve steven stevie stefanie steffanie stephanie stephany stephie stephanne",
        "stephan": "stef stefan steff steffan steph stephan stephen steve steven stevie",
        "stephen": "stef stefan steff steffan steph stephan stephen steve steven stevie",
        "steve": "stef stefan steff steffan steph stephan stephen steve steven stevie",
        "steven": "stef stefan steff steffan steph stephan stephen steve steven stevie",
        "stevie": "stef stefan steff steffan steph stephan stephen steve steven stevie",
        "stefanie": "stef stefanie steff steffanie steph stephanie stephany stephie stephanne",
        "steffanie": "stef stefanie steff steffanie steph stephanie stephany stephie stephanne",
        "stephanie": "stef stefanie steff steffanie steph stephanie stephany stephie stephanne",
        "stephany": "stef stefanie steff steffanie steph stephanie stephany stephie stephanne",
        "stephie": "stef stefanie steff steffanie steph stephanie stephany stephie stephanne",
        "stephanne": "stef stefanie steff steffanie steph stephanie stephany stephie stephanne",
        "stew": "stew stewart stu stuart",
        "stewart": "stew stewart stu stuart",
        "stu": "stew stewart stu stuart",
        "stuart": "stew stewart stu stuart",
        "sue": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy suhanthy",
        "susan": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
        "susana": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
        "susanna": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
        "susannah": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
        "susanne": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
        "susi": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
        "susie": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
        "susy": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
        "suzanne": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
        "suzie": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
        "suzy": "sue susan susana susanna susannah susanne susi susie susy suzanne suzie suzy",
        /*sue*/ "suhanthy": "suhanthy sue",
        /*tay*/ "tacy": "tacy",
        /*tay*/ "taylor": "taylor",
        /*tay*/ "tayla": "tayla",
        /*tah*/ "tabby": "tabby tabitha",
        /*tah*/ "tabitha": "tabby tabitha",
        /*tah*/ "talan": "talan",
        /*tah*/ "talia": "talia tahlia",
        /*tah*/ "tahlia": "talia tahlia",
        /*tah*/ "tamar": "tamar tamara tammie tammy",
        /*tah*/ "tamara": "tamar tamara tammie tammy",
        /*tah*/ "tamaine": "tamaine tammie tammy ",
        /*tah*/ "tammie": "tamar tamara tammie tammy tamaine",
        /*tah*/ "tammy": "tamar tamara tammie tammy tamaine",
        /*tah*/ "tana": "tanna tana",
        /*tah*/ "tanna": "tanna tana",
        /*tah*/ "tania": "tania tanya tonia tonya tanna",
        /*tah*/ "tanya": "tania tanya tonia tonya tanna",
        /*tah*/ "tanika": "tanika",
        /*tah*/ "tanis": "tanis",
        /*tah*/ "tanner": "tanner",
        /*tah*/ "tanzi": "tanzi",
        /*tah*/ "tasha": "tasha",
        /*tah*/ "tatiana": "tatiana tetchienna",
        /*tar*/ "tarissa": "tarissa",
        /*taw*/ "tonia": "tania tanya tonia tonya tanna",
        /*taw*/ "tonya": "tania tanya tonia tonya tanna",
        /*tee*/ "teagen": "teagen tegan teagan",
        /*tee*/ "tegan": "teagen tegan teagan",
        /*tee*/ "teagan": "teagen tegan teagan",
        /*tee*/ "teeya": "tia teeya",
        /*tee*/ "tia": "tia teeya",
        /*tee*/ "teija": "teija",
        /*tee*/ "teo": "teo",
        /*tee*/ "tiara": "tiara",
        /*tee*/ "tina": "catrina catryna katrina katryna katherina tina treena trina",
        /*teh*/ "ted": "ed edmond edmund eddie eddy ned ted teddy theo theodore edie",
        /*teh*/ "teddy": "ed edmond edmund eddie eddy ned ted teddy theo theodore edie",
        /*teh*/ "terell": "terell terrill",
        /*teh*/ "terrill": "terell terrill",
        /*teh*/ "terence": "terence terrance terrence terry teri terri terrie",
        /*teh*/ "terrance": "terence terrance terrence terry teri terri terrie",
        /*teh*/ "terrence": "terence terrance terrence terry teri terri terrie",
        /*teh*/ "therese": "teresa tess tessa tessie theresa therese",
        /*teh*/ "teresa": "teresa tess tessa tessie theresa therese",
        /*teh*/ "theresa": "teresa tess tessa tessie theresa therese",
        /*teh*/ "terry": "terence terrance terrence terry teri terri terrie teresa theresa therese",
        /*teh*/ "teri": "terence terrance terrence terry teri terri terrie teresa theresa therese",
        /*teh*/ "terri": "terence terrance terrence terry teri terri terrie teresa theresa therese",
        /*teh*/ "terrie": "terence terrance terrence terry teri terri terrie teresa theresa therese",
        /*teh*/ "tess": "teresa tess tessa tessie theresa therese",
        /*teh*/ "tessa": "teresa tess tessa tessie theresa therese",
        /*teh*/ "tessie": "teresa tess tessa tessie theresa therese",
        /*teh*/ "tetchienna": "tatiana tetchienna",
        /*thee*/ "theodore": "ed eddie eddy ned ted teddy theo theodore edie",
        /*thee*/ "theo": "dora theo theodora ed eddie eddy edgar edward edwin ned ted teddy theodore edie",
        /*thee*/ "theodora": "dora theo theodora",
        "tiff": "tiff tiffany tiffy",
        "tiffany": "tiff tiffany tiffy",
        "tiffy": "tiff tiffany tiffy",
        "tim": "tim timmy timothy",
        "timmy": "tim timmy timothy",
        "timothy": "tim timmy timothy",
        /*toe*/ "tony": "anthony anton antony tony",
        "thom": "thom thomas tom tommy tomas",
        "thomas": "thom thomas tom tommy tomas",
        "tom": "thom thomas tom tommy tomas",
        "tommy": "thom thomas tom tommy tomas",
        "tomas": "thom thomas tom tommy tomas",
        "tod": "tod todd",
        "todd": "tod todd",
        "tracey": "tracey traci tracie tracy trissie",
        "traci": "tracey traci tracie tracy trissie",
        "tracie": "tracey traci tracie tracy trissie",
        "tracy": "tracey traci tracie tracy trissie",
        "trenton": "trenton trent",
        "trent": "trenton trent",
        "treena": "catrina catryna katrina katryna katherina tina treena trina",
        "trina": "catrina catryna katrina katryna katherina tina treena trina",
        "tristan": "tristan trystan",
        "trystan": "tristan trystan",
        "tricia": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
        "trish": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
        "trisha": "pat patricia patsy patti pattie patty tricia trish trisha trissie",
        "trissie": "pat patricia patsy patti pattie patty tricia trish trisha trissie tracey traci tracie tracy",
        /*true*/ "trudie": "gertie gertrude trudie trudy gertraud",
        /*true*/ "trudy": "gertie gertrude trudie trudy gertraud",
        "twila": "twila twyla",
        "twyla": "twila twyla",
        "ty": "ty tyler tyce tyson tyrel tyrell tyrrell tyrone",
        "tyler": "ty tyler",
        "tyce": "tyce tyson ty",
        "tyson": "tyce tyson ty",
        "tyrel": "tyrel tyrell tyrrell ty",
        "tyrell": "tyrel tyrell tyrrell ty",
        "tyrrell": "tyrel tyrell tyrrell ty",
        "tyrone": "tyrone ty",
        /*ur*/ "earl": "earl earle",
        /*ur*/ "earle": "earl earle",
        /*ur*/ "erma": "erma",
        /*ur*/ "earnest": "earnest ernest ernie",
        /*ur*/ "ernest": "earnest ernest ernie",
        /*ur*/ "ernie": "earnest ernest ernie",
        /*ur*/ "erv": "erv ervin irv irvin irvine irving vin ervyn",
        /*ur*/ "ervin": "erv ervin irv irvin irvine irving vin ervyn",
        /*ur*/ "irv": "erv ervin irv irvin irvine irving vin ervyn",
        /*ur*/ "irvin": "erv ervin irv irvin irvine irving vin ervyn",
        /*ur*/ "irvine": "erv ervin irv irvin irvine irving vin ervyn",
        /*ur*/ "irving": "erv ervin irv irvin irvine irving vin ervyn",
        /*ur*/ "ervyn": "erv ervin irv irvin irvine irving vin ervyn",
        /*ur*/ "erwin": "erwin irwin win",
        /*ur*/ "irwin": "erwin irwin win",
        "val": "val valarie valerie valery valori",
        "valarie": "val valarie valerie valery valori",
        "valerie": "val valarie valerie valery valori",
        "valery": "val valarie valerie valery valori",
        "valori": "val valarie valerie valery valori",
        "vanesa": "vanesa vanessa vinessa",
        "vanessa": "vanesa vanessa vinessa",
        "vinessa": "vanesa vanessa vinessa",
        /*ver*/ "vern": "vern vernon",
        /*ver*/ "vernon": "vern vernon",
        /*ver*/ "veronica": "ronni ronnie ronny veronica",
        "vetta": "vetta vettie yvette",
        "vettie": "vetta vettie yvette",
        "yvette": "vetta vettie yvette",
        "vianna": "vianna vienna",
        "vienna": "vianna vienna",
        "vic": "vic vick vicki vickie vicky victoria viki vikki victor",
        "vick": "vic vick vicki vickie vicky victoria viki vikki victor",
        "vicki": "vic vick vicki vickie vicky victoria viki vikki",
        "vickie": "vic vick vicki vickie vicky victoria viki vikki",
        "vicky": "vic vick vicki vickie vicky victoria viki vikki",
        "victoria": "vic vick vicki vickie vicky victoria viki vikki",
        "viki": "vic vick vicki vickie vicky victoria viki vikki",
        "vikki": "vic vick vicki vickie vicky victoria viki vikki",
        "victor": "vic vick victor",
        "vin": "vin vince vincent vinny alvin elvin ervin irvin irvine irving ervyn",
        "vinny": "vin vince vincent vinny alvin elvin ervin irvin irvine irving ervyn",
        "vince": "vin vince vincent vinny",
        "vincent": "vin vince vincent vinny",
        "violet": "violet violette",
        "violette": "violet violette",
        "viv": "viv vivian vivien vivienne",
        "vivian": "viv vivian vivien vivienne",
        "vivien": "viv vivian vivien vivienne",
        "vivienne": "viv vivian vivien vivienne",
        "vonna": "vonna vonnie yvonne",
        "vonnie": "vonna vonnie yvonne",
        "yvonne": "vonna vonnie yvonne",
        /*wah*/ "hua": "hua",
        /*wah*/ "wallace": "wallace wally",
        /*wah*/ "wally": "wallace wally walt walter",
        /*wah*/ "waltz": "waltz waltze",
        /*wah*/ "waltze": "waltz waltze",
        /*wah*/ "walker": "walker",
        /*wah*/ "walt": "wally walt walter",
        /*wah*/ "walter": "wally walt walter",
        /*wah*/ "wanda": "wanda",
        /*wah*/ "waselenko": "waselenko waslenko",
        /*wah*/ "waslenko": "waselenko waslenko",
        /*war*/ "warren": "warren",
        /*war*/ "warrick": "warrick",
        "wade": "wade",
        "wane": "wane wayne",
        "wayne": "wane wayne",
        "wainwright": "wainwright",
        "waylon": "waylon weylan",
        "weylan": "waylon weylan",
        /*weh*/ "weather": "weather",
        /*weh*/ "wendell": "wendell",
        /*weh*/ "wendy": "gwen gwendolen gwendolyn wendy gwynne",
        /*weh*/ "wes": "wes wesley",
        /*weh*/ "wesley": "wes wesley",
        /*weh*/ "wetaskiwin": "wetaskiwin",
        /*w-eye*/ "wyatt": "wyatt",
        /*w-eye*/ "wiley": "wiley wylie wylee",
        /*w-eye*/ "wylie": "wiley wylie wylee",
        /*w-eye*/ "wylee": "wiley wylie wylee",
        /*w-eye*/ "whitecourt": "whitecourt",
        /*will*/ "will": "bill billie billy will willi william willie willy wilber wilbur wilson",
        /*will*/ "wilfred": "wilfred winfred fred freddie freddy wilf",
        /*will*/ "willi": "bill billie billy will willi william willie willy wilber wilbur wilson",
        /*will*/ "william": "bill billie billy will willi william willie willy",
        /*will*/ "willie": "bill billie billy will willi william willie willy wilber wilbur wilson",
        /*will*/ "willy": "bill billie billy will willi william willie willy wilber wilbur wilson",
        /*will*/ "willa": "willa",
        /*will*/ "wilber": "wilber wilbur will willi willie willy",
        /*will*/ "wilbur": "wilber wilbur will willi willie willy",
        /*will*/ "wilma": "wilma",
        /*will*/ "wilf": "wilf wilfred",
        /*will*/ "wilson": "will willi willie willy wilson",
        /*win*/ "winn": "alwin alwyn win elwin elwyn erwin irwin winston winn wynn win",
        /*win*/ "wynn": "alwin alwyn win elwin elwyn erwin irwin winston winn wynn win",
        /*win*/ "win": "alwin alwyn win elwin elwyn erwin irwin winston winn wynn",
        /*win*/ "winfred": "wilfred winfred fred freddie freddy",
        /*win*/ "winston": "winston winn wynn win",
        /*woh*/ "wood": "el elwood wood woodrow woody",
        /*woh*/ "woodrow": "el elwood wood woodrow woody",
        /*woh*/ "woody": "el elwood wood woodrow woody",
        /*see w-eye*/
        /*yar*/ "yari": "yari",
        /*y-owe*/ "yolanda": "yolanda yolande",
        /*y-owe*/ "yolande": "yolanda yolande",
        /*yuh*/ "young": "young",
        /*zay*/ "zane": "zane",
        "zach": "zach zachariah zacharias zachary zack zacky",
        "zachariah": "zach zachariah zacharias zachary zack zacky",
        "zacharias": "zach zachariah zacharias zachary zack zacky",
        "zachary": "zach zachariah zacharias zachary zack zacky",
        "zack": "zach zachariah zacharias zachary zack zacky",
        "zacky": "zach zachariah zacharias zachary zack zacky",
        "zahra": "zahra zara zarah",
        "zara": "zahra zara zarah",
        "zarah": "zahra zara zarah",
        /*zeh*/ "zephan": "zephan",
        /*zeh*/ "zev": "zev",
        /*z-eye*/ "zion": "zion",
        "zoe": "zoe zoey",
        "zoey": "zoe zoey",
        /*zuh*/ "zurich": "zurich",
        /*unfinished/ungrouped*/
        /*sa*/ "saffron": "saffron",
        /*sa*/ "sahara": "sahara",
        /*sa*/ "samrana": "samrana",
        /*sa*/ "savitri": "savitri",
        /*soy*/ "sawyer": "sawyer",
        /*seh*/ "seldon": "seldon",
        /*seh*/ "seth": "seth",
        /*seh*/ "separated": "separated",
        /*see*/ "seona": "seona",
        /*see*/ "simone": "simone",
        /*sir*/ "services": "services",
        /*sir*/ "suresh": "suresh",
        /*shar*/ "sharla": "sharla",
        /*shar*/ "sharmilla": "sharmilla",
        /*she*/ "sheena": "sheena",
        /*she*/ "sheila": "sheila",
        /*sheh*/ "shelby": "shelby",
        /*sheh*/ "sheldon": "sheldon",
        /*sheh*/ "shenay": "shenay",
        /*shy*/ "shiloh": "shiloh",
        /*shih*/ "shizuka": "shizuka",
        /*sky*/ "ski": "ski",
        /*sky*/ "skyla": "skyla",
        /*sky*/ "skylar": "skylar",
        /*sky*/ "skyra": "skyra",
        /*sleigh*/ "slade": "slade",
        /*sleigh*/ "slater": "slater",
        /*sew*/ "solidad": "solidad",
        /*saw*/ "songhua": "songhua song",
        /*saw*/ "song": "songhua song",
        /*saw*/ "sonnette": "sonnette",
        /*stee*/ "steel": "steel",
        /*stee*/ "steen": "steen",
        /*steh*/ "stella": "stella",
        /*stir*/ "sterling": "sterling",
        /*steh*/ "stetson": "stetson stet",
        /*steh*/ "stet": "stetson stet",
        /*strah*/ "stratton": "stratton stratson strat",
        /*strah*/ "strat": "stratton stratson strat",
        /*strah*/ "stratson": "stratton stratson strat",
        /*suh*/ "sullivan": "sullivan sully",
        /*suh*/ "sully": "sullivan sully",
        /*suh*/ "summy": "summy",
        /*suh*/ "sunjay": "sunjay",
        /*t-air*/ "tara": "tara",
        /*t-air*/ "taryn": "taryn",
        /*teh*/ "tenielle": "tenielle",
        /*the*/ "thelma": "thelma",
        /*th-eye*/ "thyra": "thyra",
        /*tie*/ "titus": "titus",
        /*toe*/ "toby": "toby",
        /*tore*/ "tor": "tor",
        /*tore*/ "tori": "tori",
        /*toy*/ "toyin": "toyin",
        /*trah*/ "travis": "travis",
        /*treh*/ "trellyn": "trellyn",
        /*treh*/ "trevor": "trevor",
        /*tray*/ "trey": "trey treyson",
        /*tray*/ "treyson": "trey treyson",
        /*trih*/ "trinity": "trinity",
        /*trih*/ "trista": "trista",
        /*troy*/ "troy": "troy",
        /*true*/ "trudi": "trudi",
        /*trih*/ "tryn": "tryn",
        /*tuh*/ "tucker": "tucker",
        /*ew*/ "una": "una",
        /*ur*/ "urs": "urs",
        /*vah*/ "vance": "vance",
        /*vah*/ "vaughn": "vaughn",
        /*veh*/ "ventress": "ventress",
        /*ver*/ "verdell": "verdell",
        /*ver*/ "vermilion": "vermilion",
        /*ver*/ "virginia": "virginia",
        /*ver*/ "verne": "verne",
        /*vih*/ "vinod": "vinod",
        /*temp until remove last comma after last name*/ "end": "end"
    };
    exports.default = Spelling;
});
define("nyckelDB-bundle", ["require", "exports", "base64-bundle", "storage-bundle", "lists-bundle"], function (require, exports, base64_2, storage_1, lists_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    base64_2 = __importDefault(base64_2);
    storage_1 = __importDefault(storage_1);
    lists_1 = __importDefault(lists_1);
    "use strict";
    /* eslint-disable */
    // global depenancies
    var APP, Windows, cordova;
    var NyckelDB = (function () {
        function IS_NUMERIC(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        function IS_ARRAY(a) {
            if (a && a.constructor === Array)
                return true;
            return false;
        }
        function IS_STRING(s) {
            if (typeof s === "string")
                return true;
            return false;
        }
        function TABLE_IS_DELETED(obj) {
            return obj && obj.deleted !== undefined && obj.deleted !== false ? true : false;
        }
        function TO_PROP_NAME(str) {
            if (str == null)
                return "_undefined";
            else {
                while (/^_/.test(str))
                    str = str.replace(/^_/, "");
                str = TRIM(String(str)).replace(/ /g, "_").replace(/[^A-z0-9_]/g, "");
                if (str === "" || /^\d/.test(str) || /^(moz|scroll|screen|on|webkit)/.test(str) || FORBIDDEN.indexOf(str) > -1)
                    return "_" + str;
                else
                    return str;
            }
        }
        function TO_BASIC_ALPHABET(n) {
            if (!n)
                return "";
            var str = n.toString();
            return /[\xC0-\xDF]/.test(str) && (str = str.replace(/[\xC0-\xC5]/g, "A"),
                str = str.replace(/\xC6/g, "AE"),
                str = str.replace(/\xC7/g, "C"),
                str = str.replace(/[\xC8-\xCB]/g, "E"),
                str = str.replace(/[\xCC-\xCF]/g, "I"),
                str = str.replace(/\xD0/g, "D"),
                str = str.replace(/\xD1/g, "N"),
                str = str.replace(/[\xD2-\xD8]/g, "O"),
                str = str.replace(/[\xD9-\xDC]/g, "U"),
                str = str.replace(/\xDD/g, "Y"),
                str = str.replace(/\xDE/g, "P"),
                str = str.replace(/\xDF/g, "B")), /[\xE0-\xFE]/.test(str) && (str = str.replace(/[\xE0-\xE5]/g, "a"),
                str = str.replace(/\xE6/g, "ae"),
                str = str.replace(/\xE7/g, "c"),
                str = str.replace(/[\xE8-\xEB]/g, "e"),
                str = str.replace(/[\xEC-\xEF]/g, "i"),
                str = str.replace(/\xF0/g, "d"),
                str = str.replace(/\xF1/g, "n"),
                str = str.replace(/[\xF2-\xF8]/g, "o"),
                str = str.replace(/[\xF9-\xFC]/g, "u"),
                str = str.replace(/\xFD|\xFF/g, "y"),
                str = str.replace(/\xFE/g, "p")),
                str;
        }
        /*delete duplicate values held in an array
        note: DELETE_DUPLICATES converts non String values to Strings first :. "1" matches 1
        also handles multi dimensional arrays*/
        function DELETE_DUPLICATES(arr) {
            for (var x = 0, len = arr.length, y; x < len - 1; x++) {
                for (y = x + 1; y < len; y++) {
                    if (String(arr[x]) === String(arr[y])) {
                        arr.splice(y, 1);
                        len--;
                        y--;
                    }
                }
            }
            x = null;
            len = null;
            y = null;
            return arr;
        }
        /* trims out extra space charaters in a string at the front, end and in between words */
        function TRIM(str) {
            while (/\s\s/g.test(str))
                str = str.replace(/\s\s/g, " ");
            return str.replace(/^\s+|\s+$/gm, "");
        }
        /*returns number of minutes since Fri Jul 14 2017 02:40:00 GMT+0000, or since 15e11 in javascript time
        use wRefTo (with reference to, Optional) to specify a different base time stamp as reference. Returns the difference
        b/t wRefTo and Now. */
        function TIMESTAMP(wRefTo) {
            if (wRefTo === void 0) { wRefTo = 0; }
            var now = Math.round((new Date().getTime() - 15e11) / 6e4);
            return now - wRefTo;
        }
        //returns a string in the form YYYYMMDDHHMM ie. 201812312359
        function READABLE_TIMESTAMP() {
            function twoDigits(a) {
                var ret = String(a);
                while (ret.length < 2)
                    ret = "0" + a;
                return ret;
            }
            var date = new Date(), day = twoDigits(date.getDate()), month = twoDigits(date.getMonth() + 1), //+ 1 because getMonth is 0 indexed
            year = String(date.getFullYear()), hour = twoDigits(date.getHours()), minute = twoDigits(date.getMinutes());
            date = null;
            return year + month + day + hour + minute;
        }
        //add whitespace to JSON
        // eslint-disable-next-line complexity
        function READABLE_JSON_STRING(str) {
            function enter() {
                out += "\r\n";
                for (a = 0; a < tabDepth; a++) {
                    out += "\t";
                }
            }
            function getArrayDepth(position) {
                //look ahead from 'position' to see how deep the array is
                //if 2d or 3d array, add extra whitespace
                position++;
                for (var depth = 1, len = str.length; position < len; position++) {
                    if (str[position] === "[") {
                        depth++;
                        if (depth > arrayDepth)
                            arrayDepth = depth;
                    }
                    if (str[position] === "]") {
                        depth--;
                        if (depth === 0) {
                            //end of array
                            if (arrayDepth > 0) {
                                arrayEnd = position; //set the end of the array position
                                tabDepth++;
                                enter();
                            }
                            return;
                        }
                    }
                }
            }
            var quote = false, tabDepth = 0, prevChar = "", out = "", a = 0, array = 0, arrayDepth = 0, arrayEnd = 0;
            for (var c = 0, len = str.length; c < len; c++) {
                if ((str[c] === "}" || str[c] === "]" && c === arrayEnd) && !quote) {
                    tabDepth--;
                    enter();
                }
                out += str[c];
                switch (str[c]) {
                    case '"':
                        if (prevChar !== "\\")
                            quote = !quote;
                        break;
                    case ",":
                        if (!quote && (array === 0 || array < arrayDepth))
                            enter();
                        break;
                    case "[":
                        if (!quote) {
                            if (c > arrayEnd)
                                getArrayDepth(c);
                            array++;
                        }
                        break;
                    case "]":
                        if (!quote) {
                            array--;
                            if (array === 0)
                                arrayDepth = 0;
                        }
                        break;
                    case "{":
                        if (!quote) {
                            tabDepth++;
                            enter();
                        }
                        break;
                }
                prevChar = str[c];
            }
            return out;
        }
        function ROW_ID_IS_VALID(rowId) {
            if (TABLE_IS_DELETED(DB[this.id]))
                return false;
            else if (IS_NUMERIC(rowId)) {
                if (rowId < 0) {
                    CACHE_ERROR.call(this, rowId, "row id cannot be less than 0");
                    return false;
                }
                else if (rowId < DB[this.id].table.length)
                    return true;
                else
                    return false;
            }
            else if (typeof rowId === "string" && /^[a-z0-9]+$/i.test(rowId)) {
                if (DB[this.id].ids[rowId] && DB[this.id].ids[rowId][0] !== "del")
                    return true;
                else
                    return false;
            }
            else {
                CACHE_ERROR.call(this, typeof rowId, "invalid row Id, number or string required: " + rowId);
                return false;
            }
        }
        function COL_NAME_IS_VALID(colName) {
            function checkString(str) {
                if (headers.indexOf(TO_PROP_NAME(str)) > -1) {
                    if (str === "id") {
                        CACHE_ERROR.call(this, str, "'id' is a reserved column name, and is not accessible");
                        return false;
                    }
                    else
                        return true;
                }
                else {
                    var ret = false;
                    for (var a = 0, len = headers.length, column = void 0; a < len; a++) {
                        column = DB[this.id].columns.meta[headers[a]];
                        if (column.exportAs && column.exportAs[0] === str) {
                            CACHE_ERROR.call(this, headers[a], str + " conflicts with another column name. Access it with it's new name");
                            break;
                        }
                    }
                    return ret;
                }
            }
            function checkNumber(num) {
                if (num < 1) {
                    CACHE_ERROR.call(this, num, "column name cannot be less than 1");
                    return false;
                }
                else if (num < headers.length)
                    return true;
                else {
                    CACHE_ERROR.call(this, num, "column name not found");
                    return false;
                }
            }
            if (TABLE_IS_DELETED(DB[this.id]))
                return false;
            var headers = DB[this.id].columns.headers;
            if (typeof colName === "string")
                return checkString.call(this, colName);
            else if (IS_NUMERIC(colName))
                return checkNumber.call(this, colName);
            else {
                CACHE_ERROR.call(this, colName, "column name not found");
                return false;
            }
        }
        function VALUE_IS_VALID(value, type, ignoreErrors, traceStr) {
            if (value == null) { // eslint-disable-line eqeqeq
                if (!ignoreErrors)
                    CACHE_ERROR.call(this, value, "@" + traceStr + ": " + type + " value cannot be");
                return false;
            }
            else if (type === "any")
                return true;
            else if (typeof value === "string" && type.match(VALID_STRING_TYPES))
                return true;
            else if (IS_NUMERIC(value) && type.match(VALID_NUMBER_TYPES))
                return true;
            else if (typeof value === "boolean" && type === "boolean")
                return true;
            else {
                if (!ignoreErrors) {
                    if (typeof type !== "string")
                        CACHE_ERROR.call(this, type, "Type must be supplied as a string");
                    else if (!type.match(VALID_TYPES))
                        CACHE_ERROR.call(this, type, "Invalid data type");
                    else
                        CACHE_ERROR.call(this, value + " is a " + typeof value + ", not a " + type, "invalid value");
                }
                return false;
            }
        }
        function GET_INDEX_OF_ROW(rowId) {
            function getIndex(rowId) {
                for (var a = 0, len = DB[this.id].table.length; a < len; a++) {
                    ROW_INDEX_CACHE[this.id][DB[this.id].table[a][0]] = a; //build a cache for faster performance
                    if (DB[this.id].table[a][0] === rowId)
                        return a;
                }
                return -1;
            }
            if (ROW_ID_IS_VALID.call(this, rowId)) {
                if (IS_NUMERIC(rowId))
                    return rowId;
                else {
                    if (DB[this.id].ids[rowId][0] === "del")
                        return -1;
                    if (ROW_INDEX_CACHE[this.id] && ROW_INDEX_CACHE[this.id][rowId])
                        return ROW_INDEX_CACHE[this.id][rowId]; //direct from cache
                    else
                        return getIndex.call(this, rowId);
                }
            }
            else
                return -1;
        }
        function GET_INDEX_OF_HIDDEN_ROW(rowId) {
            if (HIDDEN_TABLE_DATA[this.id] != null && HIDDEN_IDS[this.id] != null && HIDDEN_IDS[this.id][rowId]) {
                if (HIDDEN_IDS[this.id][rowId][0] === "del")
                    return -1;
                for (var a = 0, len = HIDDEN_TABLE_DATA[this.id].length; a < len; a++) {
                    if (HIDDEN_TABLE_DATA[this.id][a][0] === rowId)
                        return a;
                }
                return -1;
            }
            else
                return -1;
        }
        function GET_INDEX_OF_COLUMN(colName) {
            if (TABLE_IS_DELETED(DB[this.id]))
                return -1;
            var headers = DB[this.id].columns.headers;
            if (IS_NUMERIC(colName)) {
                if (colName > 0 && colName < headers.length)
                    return colName;
                else
                    return -1;
            }
            else {
                var orig = colName;
                colName = TO_PROP_NAME(colName);
                if (colName === "id")
                    return -1;
                var ret = headers.indexOf(colName);
                if (ret > -1)
                    return ret;
                for (var a = 1, len = headers.length, column = void 0; a < len; a++) {
                    column = DB[this.id].columns.meta[headers[a]];
                    if (column && column.exportAs && column.exportAs[0] === orig) {
                        if (ret === -1)
                            ret = a;
                        else {
                            //more than 1 possible match exists, return no match found
                            ret = -1;
                            break;
                        }
                    }
                }
                return ret;
            }
        }
        function EXPORT_DB() {
            var db = DB[this.id];
            if (TABLE_IS_DELETED(db) || !HIDDEN_TABLE_DATA[this.id])
                return db;
            else {
                var row;
                while (HIDDEN_TABLE_DATA[this.id].length > 0) {
                    row = HIDDEN_TABLE_DATA[this.id][0];
                    db.ids[row[0]] = JSON.parse(JSON.stringify(HIDDEN_IDS[this.id][row[0]]));
                    delete HIDDEN_IDS[this.id][row[0]];
                    db.table.push(HIDDEN_TABLE_DATA[this.id].splice(0, 1)[0]);
                }
                row = null;
                delete HIDDEN_IDS[this.id];
                delete HIDDEN_TABLE_DATA[this.id];
                return db;
            }
        }
        function TO_LOCAL_STORAGE(changes) {
            if (changes === void 0) { changes = false; }
            function save() {
                if (typeof changes === "undefined" || changes === true) {
                    //check for and surface hidden values before save
                    console.log("saving to localStorage");
                    storage_1.default.setItem(DB[this.id].title, EXPORT_DB.call(this));
                }
                ERRORS[this.id] = "";
            }
            if (storage_1.default) {
                if (ERRORS[this.id]) {
                    var msg = "The following errors are found in the " + DB[this.id].title + " database\n" +
                        ERRORS[this.id] + "\nWould you still like to save changes?";
                    if (APP.confirm) {
                        APP.confirm(msg, save.bind(this), null, { "okButton": "Save" });
                    }
                    else if (window && window.confirm(msg.replace(/<[^>]+>/g, " ")))
                        save.call(this);
                }
                else
                    save.call(this);
            }
            BUILD_SEARCH_INDEX.call(this);
        }
        /*json.identifierCol to specify a specific column in the data to use as the basis for the generated unique id for each row
        */
        function IMPORT_JSON(json, callback, key, fromLocalStorageBool) {
            function ret(success, err, changes) {
                if (callback instanceof Function)
                    return callback.call(this, success, err, changes);
            }
            function applyJSON(json) {
                function checkDBForMissingItems() {
                    //check for errors
                    var missing = [];
                    for (var item in json.ids) {
                        if (!DB[this.id].ids[item] && json.ids[item][0] !== "del") {
                            missing.push(item);
                        }
                    }
                    if (missing.length > 0) {
                        CACHE_ERROR.call(this, missing, "import did not complete sucessfully");
                        for (var a = 0, lenA = missing.length, d = void 0, lenD = void 0; a < lenA; a++) {
                            for (d = 0, lenD = json.table.length; d < lenD; d++) {
                                if (json.table[d][0] === missing[a]) {
                                    //TODO
                                    console.log("error in row " + missing[a]);
                                    break;
                                }
                            }
                        }
                    }
                    missing = null;
                }
                function syncColumns(columns, callback) {
                    if (!columns)
                        return callback();
                    //added in verions 0.4+
                    for (var colName in columns.meta) {
                        //go through all metadata and delete deleted columns 
                        if (columns.meta[colName].deleted && DB[this.id].columns.meta[colName] && !DB[this.id].columns.meta[colName].deleted) {
                            DELETE_COLUMN.call(this, colName, false, columns.meta[colName].deleted[1]);
                        }
                    }
                    for (var a = 1, lenA = DB[this.id].columns.headers.length, colIndex = void 0, colName = void 0, prop = void 0; a < lenA; a++) {
                        colName = DB[this.id].columns.headers[a];
                        colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
                        if (colIndex === -1) {
                            console.log(colName, "adding colname");
                            ADD_COLUMN.call(this, colName, a, columns.meta[colName], false, columns.meta[colName].timestamp[0]);
                        }
                        if (colIndex > 0) { //make changes
                            if (colIndex !== a)
                                MOVE_COLUMN.call(this, colName, colIndex, false);
                            //go through all properties and update
                            for (prop in columns.meta[colName]) {
                                if (columns.meta[colName].hasOwnProperty(prop) &&
                                    (!DB[this.id].columns.meta[colName][prop] ||
                                        columns.meta[colName][prop][0] !== DB[this.id].columns.meta[colName][prop][0] &&
                                            columns.meta[colName][prop][1] > DB[this.id].columns.meta[colName][prop][1])) {
                                    switch (prop) {
                                        case "deleted": //shouldn't find an unsynced deleted column here!!!
                                            CACHE_ERROR.call(this, colName, "deleted column not synced");
                                            break;
                                        case "type":
                                            SET_TYPE.call(this, colName, columns.meta[colName][prop][0], null, false, columns.meta[colName][prop][1]);
                                            break;
                                        case "timestamp":
                                            //do nothing, update timestamp on prop change
                                            console.log("column timestamp compare (new, old): ", columns.meta[colName][prop], DB[this.id].columns.meta[colName][prop]);
                                            break;
                                        default: SET_COLUMN_PROP.call(this, colName, prop, columns.meta[colName][prop][0], false, columns.meta[colName][prop][1]);
                                    }
                                }
                            }
                        }
                    }
                    //TODO check for errors in headers and column metadata
                    return callback();
                }
                function syncTable(table, ids) {
                    function applyProperties() {
                        if (json.properties && DB[this.id].properties) {
                            var _prop;
                            for (var prop in json.properties) {
                                _prop = TO_PROP_NAME(prop);
                                if (DB[this.id].properties[_prop]) {
                                    if (!DB[this.id].properties[_prop][1] || DB[this.id].properties[_prop][1] < json.properties[prop][1]) {
                                        SET_PROP.call(this, _prop, json.properties[prop][0], json.properties[prop][1], json.properties[prop][2], false);
                                        syncChanges = true;
                                    }
                                    else if (DB[this.id].properties[_prop][1] && DB[this.id].properties[_prop][1] !== json.properties[prop][1])
                                        syncChanges = true;
                                }
                                else {
                                    SET_PROP.call(this, _prop, json.properties[prop][0], json.properties[prop][1], json.properties[prop][2], false);
                                    syncChanges = true;
                                }
                            }
                            _prop = null;
                        }
                        checkDBForMissingItems.call(this);
                    }
                    function deleteRows() {
                        //delete deleted rows
                        for (var rowId in json.ids) {
                            if (json.ids[rowId][0] === "del" && DB[this.id].ids[rowId] && DB[this.id].ids[rowId][0] !== "del") {
                                if (json.ids[rowId][1] !== DB[this.id].ids[rowId][0])
                                    syncChanges = true;
                                //if it was deleted after it was created (not restored)
                                if (json.ids[rowId][1] > DB[this.id].ids[rowId][0]) {
                                    DELETE_ROW.call(this, rowId, false, json.ids[rowId][1]);
                                }
                            }
                        }
                        applyProperties.call(this);
                    }
                    function updateRow(toTable, toIds, nRow, rowNotFoundCB) {
                        if (!toTable)
                            return rowNotFoundCB(nRow);
                        for (var c = 0, lenC = toTable.length, e = void 0, eLen = void 0, xRow = void 0, xId = void 0, nId = void 0; c < lenC; c++) {
                            xRow = toTable[c]; //existing row
                            if (xRow[0] !== nRow[0])
                                continue;
                            //ids match, found right row
                            xId = toIds[xRow[0]]; //existing row metadata
                            nId = ids[nRow[0]]; //new row metadata
                            for (e = 1, eLen = nId.length; e < eLen; e++) {
                                if (xId[0] === "del" && nId[0] === "del" || Number(xId[0]) + Number(xId[e]) === Number(nId[0]) + Number(nId[e]))
                                    continue;
                                //cells are different
                                syncChanges = true;
                                if (nId[0] !== "del" && (xId[0] === "del" || Number(xId[0]) + Number(xId[e]) < Number(nId[0]) + Number(nId[e]))) {
                                    //cell needs updated
                                    SET_VAL.call(this, c, e, nRow[e], false, nId[e]);
                                }
                            }
                            match = true;
                            break; //row match found and updated so don't need to search further
                        }
                        if (!match)
                            return rowNotFoundCB(nRow);
                    }
                    function addNewRow(nRow) {
                        if (ids[nRow[0]][0] !== "del" &&
                            (!DB[this.id].ids[nRow[0]] || DB[this.id].ids[nRow[0]][0] === "del" &&
                                DB[this.id].ids[nRow[0]][1] < Number(ids[nRow[0]][0]))) {
                            //new row
                            syncChanges = true;
                            ADD_ROW.call(this, nRow, nRow[0], false, ids[nRow[0]]);
                        }
                    }
                    function tryHiddenRows(nRow) {
                        updateRow.call(this, HIDDEN_TABLE_DATA[this.id], HIDDEN_IDS[this.id], nRow, addNewRow.bind(this));
                    }
                    //update rows
                    var match;
                    for (var b = 0, len = table.length, nRow = void 0; b < len; b++) {
                        match = false;
                        nRow = table[b]; //new row
                        updateRow.call(this, DB[this.id].table, DB[this.id].ids, nRow, tryHiddenRows.bind(this));
                    }
                    deleteRows.call(this);
                }
                function checkDeleted(json) {
                    if (!TABLE_IS_DELETED(DB[this.id])) {
                        //delete table
                        return DELETE_TABLE.call(this, function () { return ret.call(this, true, false, true); }.bind(this), json.lastModified, false);
                    }
                    else
                        return ret.call(this, true, false, false);
                }
                function directLoadDB() {
                    //database has just been initiated and can load all data directly from json, or is being restored from being deleted
                    if (DB[this.id].lastModified >= json.lastModified)
                        return ret.call(this, true, false, false);
                    //recreate existing/deleted table
                    DB[this.id] = {
                        "title": DB[this.id].title,
                        "created": json.created,
                        "lastModified": json.lastModified,
                        "deleted": json.deleted,
                        "version": this.version + "_" + base64_2.default.Version,
                        "columns": json.columns,
                        "ids": json.ids,
                        "table": json.table,
                        "properties": json.properties
                    };
                    TO_LOCAL_STORAGE.call(this, !fromLocalStorageBool);
                    return ret.call(this, true, false, true);
                }
                function updateTimestamps(cb) {
                    function shiftCreatedDate(DB1, DB2) {
                        //update created time stamp
                        DB1.created = DB2.created;
                        DB1.lastModified = DB1.lastModified === 0 ? DB2.lastModified : DB1.lastModified - createdDiff;
                        //update all other time stamps to reflect change in created time stamp
                        var i = 0, idiLen;
                        for (var id in DB1.ids) {
                            for (i = 0, idiLen = DB1.ids[id].length; i < idiLen; i++) {
                                if (i !== 0 || DB1.ids[id][i] !== "del") {
                                    DB1.ids[id][i] = DB1.ids[id][i] - createdDiff;
                                }
                            }
                        }
                        i = null;
                        idiLen = null;
                        //update propert time stamps
                        for (var p in DB1.properties) {
                            if (DB1.hasOwnProperty(p)) {
                                DB1.properties[p][1] = DB1.properties[p][1] - createdDiff;
                            }
                        }
                        //update column time stamps
                        var a;
                        for (var c in DB1.columns.meta) {
                            if (DB1.columns.meta.hasOwnProperty(c)) {
                                for (a in DB1.columns.meta[c]) {
                                    if (DB1.columns.meta[c].hasOwnProperty(a)) {
                                        if (a === "timestamp")
                                            DB1.columns.meta[c][a][0] = DB1.columns.meta[c][a][0] - createdDiff;
                                        DB1.columns.meta[c][a][1] = DB1.columns.meta[c][a][1] - createdDiff;
                                    }
                                }
                            }
                        }
                        a = null;
                        return DB1;
                    }
                    var createdDiff = DB[this.id].created - json.created; //the difference in time between when the two tables were created
                    if (createdDiff === 0)
                        return cb();
                    syncChanges = true;
                    if (createdDiff > 0)
                        DB[this.id] = shiftCreatedDate(DB[this.id], json);
                    else
                        json = shiftCreatedDate(json, DB[this.id]);
                    return cb();
                }
                //preliminary checks
                if (DB[this.id].title !== json.title)
                    return ret.call(this, false, "cannot import " + json.title, false);
                if (TABLE_IS_DELETED(json))
                    return checkDeleted.call(this, json);
                if (TABLE_IS_DELETED(DB[this.id]))
                    return ret.call(this, false, "cannot import to deleted table", false);
                if (!json.table)
                    return ret.call(this, false, "json is not valid", false);
                this.unhideRows();
                if (json.lastModified && json.lastModified === DB[this.id].lastModified) {
                    //no changes
                    checkDBForMissingItems.call(this);
                    return ret.call(this, true, false, false);
                }
                if (DB[this.id].lastModified === 0 && DB[this.id].table.length === 0 && DB[this.id].created !== json.created) {
                    //table has just been initialised and table is being loaded for the first time
                    return directLoadDB.call(this);
                }
                updateTimestamps.call(this, function () {
                    syncColumns.call(this, json.columns, function () {
                        syncTable.call(this, json.table, json.ids);
                    }.bind(this));
                }.bind(this));
                if (!fromLocalStorageBool)
                    TO_LOCAL_STORAGE.call(this, syncChanges);
                else
                    BUILD_SEARCH_INDEX.call(this);
                return ret.call(this, true, ERRORS[this.id], syncChanges);
            }
            function applyCSV(json) {
                function getId(jsonRow, searchLevel, remainingIds, idColName) {
                    function findDifferences(id, jsonRow) {
                        var x, y, b = 0, ret = [];
                        for (var item in jsonRow) {
                            if (jsonRow.hasOwnProperty(item)) {
                                x = String(jsonRow[item]);
                                y = String(this.getVal(id, item));
                                if (y && x !== y) {
                                    ret[b] = item;
                                    b++;
                                }
                            }
                        }
                        x = null;
                        y = null;
                        if (b === 0)
                            return false;
                        else
                            return ret;
                    }
                    function onePossibleMatch(matchedID, minimunFindIdLoop, searchLevel, jsonRow) {
                        var dif = findDifferences.call(this, matchedID, jsonRow);
                        if (dif === false)
                            return matchedID;
                        if (searchLevel < minimunFindIdLoop)
                            return false;
                        for (var a = 0, difLen = dif.length; a < difLen; a++) {
                            SET_VAL.call(this, matchedID, dif[a], jsonRow[dif[a]], false, 0);
                            syncChanges = true;
                        }
                        dif = null;
                        return matchedID;
                    }
                    function toArray(jsonRow) {
                        var arr = [];
                        for (var a = 0, headers_1 = DB[this.id].columns.headers, len = headers_1.length - 1, headerName = void 0; a < len; a++) {
                            headerName = headers_1[a + 1];
                            arr[a] = jsonRow[headerName];
                            //add empty values to table for boolean (false), number (0) or string ("") values
                            if (arr[a] === undefined) {
                                if (DB[this.id].columns.meta[headerName].type[0] === "boolean")
                                    arr[a] = false;
                                else if (/^number|nteger$|itude$/.test(DB[this.id].columns.meta[headerName].type[0]))
                                    arr[a] = 0;
                                else
                                    arr[a] = "";
                            }
                        }
                        return arr;
                    }
                    function toEditTimesArr(json, traceStr) {
                        var ret = [VALIDATE_EDIT_TIME.call(this, TIMESTAMP(Number(json.lastModified || 0)), "row", traceStr)];
                        for (var a = 1, len = DB[this.id].columns.headers.length; a < len; a++) {
                            ret[a] = 0;
                        }
                        return ret;
                    }
                    //if there are no registered ids existing/left, create a new one
                    if (remainingIds.length === 0) {
                        syncChanges = true;
                        return ADD_ROW.call(this, toArray.call(this, jsonRow), null, false, toEditTimesArr.call(this, json, "create new row from csv"));
                    }
                    else {
                        var ids = [];
                        for (var a = 0, b = 0, idsLen = remainingIds.length; a < idsLen; a++) {
                            if (this.getVal(remainingIds[a], idColName) === jsonRow[idColName]) {
                                ids[b] = remainingIds[a];
                                b++;
                            }
                        }
                        switch (ids.length) {
                            case 0:
                                if (searchLevel < 2)
                                    return false;
                                syncChanges = true;
                                return ADD_ROW.call(this, toArray.call(this, jsonRow), null, false, toEditTimesArr.call(this, json, "no remaining ids"));
                            case 1:
                                return onePossibleMatch.call(this, ids[0], 3, searchLevel, jsonRow);
                            default:
                                if (searchLevel < 4)
                                    return false;
                                var numDif = [], dif = [];
                                for (var k = 0; k < ids.length; k++) {
                                    dif[k] = findDifferences.call(this, ids[k], jsonRow);
                                    if (dif[k] === false)
                                        return ids[k];
                                    numDif[k] = dif[k].length;
                                }
                                if (searchLevel < 5)
                                    return false;
                                var closest = 0;
                                for (var m = 1; m < numDif.length; m++) {
                                    if (numDif[m] < numDif[m - 1])
                                        closest = m;
                                }
                                return onePossibleMatch.call(this, ids[closest], 5, searchLevel, jsonRow);
                        }
                    }
                }
                function finish() {
                    if (json.Rows.length > 0)
                        return ret.call(this, false, "CSV import not completed", false);
                    if (json.replaceAll && remainingIds.length > 0) {
                        //delete remaining rows
                        for (var h = 0, hLen = remainingIds.length; h < hLen; h++) {
                            DELETE_ROW.call(this, remainingIds[h], false, TIMESTAMP(Number(json.lastModified)));
                        }
                        syncChanges = true;
                    }
                    TO_LOCAL_STORAGE.call(this, syncChanges);
                    return ret.call(this, true, false, syncChanges);
                }
                var db = DB[this.id];
                if (TABLE_IS_DELETED(db))
                    return ret.call(this, false, "cannot import to deleted table", false);
                //importing CSV file converted to JSON with csv2json function
                var headers = CHECK_HEADERS_ARRAY.call(this, json.Headers);
                if ("lastModified" in json) {
                    if (json.lastModified instanceof Date)
                        json.lastModified = json.lastModified.getTime();
                    if (IS_NUMERIC(json.lastModified))
                        json.lastModified = Math.round((json.lastModified - 15e11) / 6e4);
                    //	else json.lastModified = null; //TODO: why is this null? should it pop an error instead?
                    else
                        console.log("cannot set lastModified to", json.lastModified);
                }
                //check for matching headers
                for (var a = 0, lenA = headers.length, b = void 0, lenB = void 0, existingHeaders = db.columns.headers, foundMatch = false; a < lenA; a++) {
                    foundMatch = false;
                    for (b = 0, lenB = existingHeaders.length; b < lenB; b++) {
                        if (headers[a] === existingHeaders[b]) {
                            foundMatch = true;
                            continue;
                        }
                    }
                    if (foundMatch === false) {
                        for (var col in db.columns.meta) {
                            if (headers[a] === col || db.columns.meta[col].exportAs && headers[a] === db.columns.meta[col].exportAs[0]) {
                                foundMatch = true;
                                continue;
                            }
                        }
                    }
                    if (foundMatch === false) {
                        ADD_COLUMN.call(this, headers[a], a, undefined, false); //TODO set column type to something more specific than "any"
                    }
                }
                //try match rows with existing data
                var remainingIds = [], f = 0, identifierCol = json.identifierCol && headers.indexOf(json.identifierCol) > -1 ? json.identifierCol : headers[0];
                this.forEachRow(function (id) {
                    if (DB[this.id].ids[id][0] !== "del") {
                        remainingIds[f] = id;
                        f++;
                    }
                }.bind(this));
                for (var loop = 0, g = void 0, lenG = void 0, id = void 0; loop < 10; loop++) {
                    for (g = 0, lenG = json.Rows.length; g < lenG; g++) {
                        //TODO add some hirarchy to which columns must match, which should, and which don't matter when finding the matching row
                        id = getId.call(this, json.Rows[g], loop, remainingIds, identifierCol);
                        if (id) {
                            json.Rows.splice(g, 1);
                            g--;
                            lenG--;
                            remainingIds.splice(remainingIds.indexOf(id), 1);
                        }
                    }
                }
                return finish.call(this);
            }
            if (!json)
                return ret.call(this, false, "no json", false);
            if (typeof json === "string")
                json = JSON.parse(json);
            var syncChanges = false;
            if ("Headers" in json && "Rows" in json)
                return applyCSV.call(this, json);
            if ("data" in json && json.version === this.version + "_" + base64_2.default.Version && base64_2.default.hmac(json.data, key) === json.signature) {
                json = base64_2.default.read(json.data, key);
            }
            if ("title" in json)
                return applyJSON.call(this, json);
            else
                return ret.call(this, false, "json incompatible", false);
        }
        function CACHE_ERROR(error, description) {
            error = description ? String(description) + ": " + String(error) : String(error);
            ERRORS[this.id] = ERRORS[this.id] ? ERRORS[this.id] + "<br />" + error : error;
            if (console && console.log)
                DB[this.id] ? console.log(DB[this.id].title + ": " + error) : console.log(error);
        }
        function SAVE_FILE(str, fileName, mimeType) {
            function saveToWindows(str, fileName) {
                // Verify that we are currently not snapped, or that we can unsnap to open the picker
                var currentState = Windows.UI.ViewManagement.ApplicationView.value;
                if (currentState === Windows.UI.ViewManagement.ApplicationViewState.snapped &&
                    !Windows.UI.ViewManagement.ApplicationView.tryUnsnap()) {
                    // Fail silently if we can't unsnap
                    CACHE_ERROR.call(this, "Some kind of Windows 8 bug prevented saving this file.");
                    return false;
                }
                // Create the picker object and set options
                var savePicker = new Windows.Storage.Pickers.FileSavePicker();
                savePicker.suggestedStartLocation = Windows.Storage.Pickers.PickerLocationId.Downloads;
                // Dropdown of file types the user can save the file as
                savePicker.fileTypeChoices.insert("JSON (Javascript Object Notation) File", [".json"]);
                savePicker.fileTypeChoices.insert("Table of Comma Separated Values", [".csv"]);
                savePicker.fileTypeChoices.insert("vCard Contact File", [".vcf"]);
                savePicker.fileTypeChoices.insert("Plain Text", [".txt"]);
                // Default file name if the user does not type one in or select a file to replace
                savePicker.suggestedFileName = fileName;
                return savePicker.pickSaveFileAsync().then(function (file) {
                    if (file === undefined)
                        return false;
                    // Prevent updates to the remote version of the file until we finish making changes and call completeUpdatesAsync.
                    Windows.Storage.CachedFileManager.deferUpdates(file);
                    // write to file
                    Windows.Storage.FileIO.writeTextAsync(file, str).done(function () {
                        // Let Windows know that we're finished changing the file so the other app can update the remote version of the file.
                        // Completing updates may require Windows to ask for user input.
                        Windows.Storage.CachedFileManager.completeUpdatesAsync(file).done(function (updateStatus) {
                            if (updateStatus === Windows.Storage.Provider.FileUpdateStatus.complete) {
                                return true;
                            }
                            else {
                                CACHE_ERROR.call(this, "File " + file.name + " couldn't be saved.");
                                return false;
                            }
                        }.bind(this));
                    }.bind(this));
                    return true;
                }.bind(this));
            }
            function saveToCordova(str, fileName) {
                var fileApi = cordova.file, path;
                if (fileApi.externalDataDirectory)
                    path = fileApi.externalDataDirectory; //Android SD Card
                else if (fileApi.documentsDirectory)
                    path = fileApi.documentsDirectory; //iPhone
                else
                    path = fileApi.dataDirectory; //Android
                fileApi.writeFile(path, fileName, str, true);
                return true;
            }
            function downloadToBrowser(str, fileName, mimeType) {
                //depends on a hidden link with id='hiddenDownloadLink'
                //<a id='hiddenDownloadLink' style='display:none' download='' href=''></a>
                //somewhere in the page to create a web browser download link
                //create link
                if (!mimeType)
                    mimeType = "text/plain";
                var url = "";
                if (Blob && (window.navigator.msSaveOrOpenBlob || URL && URL.createObjectURL)) {
                    var blobObject = new Blob([str], { type: mimeType });
                    if (window.navigator.msSaveOrOpenBlob) {
                        window.navigator.msSaveOrOpenBlob(blobObject, fileName);
                        return true;
                    }
                    else if (URL && URL.createObjectURL) {
                        url = URL.createObjectURL(blobObject);
                    }
                }
                else {
                    url = "data:" + mimeType + ";charset=utf-8," + encodeURIComponent(str);
                }
                var link = document.getElementById("hiddenDownloadLink");
                if (link) {
                    link.download = fileName;
                    link.href = url;
                    link.click();
                }
                else
                    CACHE_ERROR.call(this, "html download link missing", "depends on a hidden link with id='hiddenDownloadLink' <a id='hiddenDownloadLink' style='display:none' download='' href=''></a> somewhere in the page to create a web browser download link");
                if (URL)
                    URL.revokeObjectURL(url);
                return true;
            }
            str = READABLE_JSON_STRING(str);
            if (Windows)
                return saveToWindows.call(this, str, fileName);
            else if (cordova && cordova.file)
                return saveToCordova(str, fileName);
            else
                return downloadToBrowser.call(this, str, fileName, mimeType);
        }
        //returns an array of valid search terms
        function SEARCH_VALIDATE(value) {
            if (!value)
                return [];
            var str = String(value);
            str = str.replace(/<[^>]+>/g, ""); //removeHTMLTags
            str = str.toLowerCase();
            str = TO_BASIC_ALPHABET(str);
            str = str.replace(/[^_0-9a-z ]/g, " ");
            str = TRIM(str);
            if (str === "" || str === " ")
                return [];
            var arr = str.split(" ");
            str = null;
            for (var a = 0, len = arr.length; a < len; a++) {
                //toPropName
                arr[a] = arr[a].replace(/ /g, "_").replace(/[^A-z0-9_]/g, "");
                if (/\d/.test(arr[a].charAt(0)))
                    arr[a] = "_" + arr[a];
            }
            arr = DELETE_DUPLICATES(arr);
            return arr;
        }
        function BUILD_SEARCH_INDEX(colNamesToIndex, callback) {
            function sortByFirstCol(a, b) {
                //sort index by first column
                return a[0] === b[0] ? 0 : a[0] < b[0] ? -1 : 1;
            }
            function sortSearchWords(a, b) {
                var _a = a[0];
                var _b = b[0];
                //try to compare items as numbers	
                if (!isNaN(Number(_a)) && !isNaN(Number(_a))) {
                    _a = Number(_a);
                    _b = Number(_b);
                }
                return _a === _b ? 0 : _a > _b ? -1 : 1;
            }
            function start() {
                SEARCH_INDEX[this.id] = {}; //clear search index
                SEARCH_SUGGESTIONS[this.id] = []; //clear search suggestions
                var indexItem = [], colNums = [];
                for (var h = 0, hLen = COL_NAMES_INDEXED[this.id].length; h < hLen; h++) {
                    colNums[h] = GET_INDEX_OF_COLUMN.call(this, COL_NAMES_INDEXED[this.id][h]);
                }
                //get all the words in the table
                for (var a = 0, b = 0, len = this.getLength(), words = void 0, d = void 0, f = void 0, fLen = void 0, dLen = COL_NAMES_INDEXED[this.id].length; b < len; b++) {
                    for (words = [], d = 0; d < dLen; d++) {
                        if (colNums[d] > -1) {
                            words = SEARCH_VALIDATE(DB[this.id].table[b][colNums[d]]);
                            for (f = 0, fLen = words.length; f < fLen; f++) {
                                //arrange words in arrays of [word, columnName, rowId]
                                indexItem[a] = [words[f], COL_NAMES_INDEXED[this.id][d], DB[this.id].table[b][0]];
                                a++;
                            }
                        }
                    }
                }
                colNums = null;
                indexItem = indexItem.sort(sortByFirstCol);
                for (var x = 0, y = 1, z = 0, reps = indexItem.length, foundMatch = void 0, row = void 0, col = void 0, i = void 0; x < reps; x = z > 0 ? x + z : x + 1, y = x + 1, z = 0) {
                    foundMatch = true;
                    i = SEARCH_INDEX[this.id][indexItem[x][0]] = {};
                    while (foundMatch === true) {
                        if (!indexItem[y + z] || indexItem[x][0] !== indexItem[y + z][0]) {
                            foundMatch = false;
                        }
                        row = indexItem[x + z][2];
                        col = indexItem[x + z][1];
                        if (!i[col])
                            i[col] = [row];
                        else
                            i[col].push(row);
                        z++;
                    }
                }
                indexItem = null;
                //build SEARCH_SUGGESTIONS
                var searchWords = Object.keys(SEARCH_INDEX[this.id]);
                for (var c = 0, lenC = searchWords.length, g = void 0, lenG = COL_NAMES_INDEXED[this.id].length, numResultsPerWord = []; c < lenC; c++) {
                    numResultsPerWord[c] = 0;
                    for (g = 0; g < lenG; g++) {
                        if (COL_NAMES_INDEXED[this.id][g] !== "id" && SEARCH_INDEX[this.id][searchWords[c]][COL_NAMES_INDEXED[this.id][g]]) {
                            numResultsPerWord[c] += SEARCH_INDEX[this.id][searchWords[c]][COL_NAMES_INDEXED[this.id][g]].length;
                        }
                    }
                    searchWords[c] = [numResultsPerWord[c], searchWords[c]];
                }
                searchWords.sort(sortSearchWords);
                for (var e = 0, lenE = searchWords.length; e < lenE; e++) {
                    SEARCH_SUGGESTIONS[this.id][e] = searchWords[e][1];
                }
                STO_SEARCH_INDEX.call(this);
                searchWords = null;
                runQueuedCallbacks.call(this);
                if (callback instanceof Function)
                    return callback();
            }
            function runQueuedCallbacks() {
                while (BUILDING_SEARCH_INDEX_QUEUE[this.id].length > 0) {
                    BUILDING_SEARCH_INDEX_QUEUE[this.id].shift()();
                }
                BUILDING_SEARCH_INDEX[this.id] = false;
            }
            function getIndexableColumns(db, colNamesToIndex) {
                var ret = [], b = 0;
                if (colNamesToIndex) {
                    for (var c = 0, lenC = colNamesToIndex.length, colName = void 0; c < lenC; c++) {
                        colName = TO_PROP_NAME(colNamesToIndex[c]);
                        if (db.columns.meta[colName] && (db.columns.meta[colName].searchable === undefined || db.columns.meta[colName].searchable[0] === true))
                            ret[b++] = colName;
                    }
                }
                else
                    for (var a in db.columns.meta) {
                        if (db.columns.meta[a].searchable === undefined || db.columns.meta[a].searchable && db.columns.meta[a].searchable[0] === true)
                            ret[b++] = a;
                    }
                return ret;
            }
            var db = DB[this.id];
            if (TABLE_IS_DELETED(db))
                return;
            if (BUILDING_SEARCH_INDEX[this.id]) {
                if (callback instanceof Function)
                    BUILDING_SEARCH_INDEX_QUEUE[this.id].push(callback);
                return;
            }
            BUILDING_SEARCH_INDEX_QUEUE[this.id] = [];
            BUILDING_SEARCH_INDEX[this.id] = true;
            COL_NAMES_INDEXED[this.id] = getIndexableColumns(db, colNamesToIndex);
            storage_1.default.getItem("searchIndex_" + DB[this.id].title, null, function (obj) {
                if (typeof obj === "string")
                    obj = JSON.parse(obj);
                if (!(obj &&
                    obj.version === this.version + "_" + base64_2.default.Version &&
                    obj.length === this.getLength() &&
                    obj.lastModified === DB[this.id].lastModified &&
                    obj.colNamesIndexed.join("") === COL_NAMES_INDEXED[this.id].join(""))) {
                    return start.call(this);
                }
                SEARCH_INDEX[this.id] = obj.searchIndex;
                SEARCH_SUGGESTIONS[this.id] = obj.searchSuggestions;
                RECENTLY_SEARCHED[this.id] = obj.recentlySearched;
                runQueuedCallbacks.call(this);
                if (callback instanceof Function)
                    return callback();
            }.bind(this), start.bind(this));
        }
        function STO_SEARCH_INDEX() {
            storage_1.default.setItem("searchIndex_" + DB[this.id].title, {
                "lastModified": DB[this.id].lastModified,
                "colNamesIndexed": COL_NAMES_INDEXED[this.id],
                "searchIndex": SEARCH_INDEX[this.id],
                "searchSuggestions": SEARCH_SUGGESTIONS[this.id],
                "recentlySearched": RECENTLY_SEARCHED[this.id],
                "length": this.getLength(),
                "version": this.version + "_" + base64_2.default.Version
            });
        }
        function SET_PROP(propName, value, editTime, type, storeBool) {
            function validate(propName, value, type) {
                if (VALUE_IS_VALID.call(this, value, type, false, "setProp")) {
                    return apply.call(this, propName, value, type);
                }
                else { //try to coerce value to valid type
                    if (typeof value === "string") {
                        if (value !== "" && !isNaN(Number(value)))
                            value = Number(value); //convert numbers in String form to Number form
                        if (value === "true")
                            value = true;
                        if (value === "false")
                            value = false;
                    }
                    if (VALUE_IS_VALID.call(this, value, type, false, "setProp")) {
                        return apply.call(this, propName, value, type);
                    }
                    else
                        CACHE_ERROR.call(this, value, "cannot set " + propName);
                    return undefined;
                }
            }
            function apply(propName, value, type) {
                editTime = VALIDATE_EDIT_TIME.call(this, editTime, "property", "setProp");
                DB[this.id].properties[propName][0] = value;
                DB[this.id].properties[propName][1] = editTime;
                DB[this.id].properties[propName][2] = type;
                DB[this.id].lastModified = editTime + DB[this.id].created > DB[this.id].lastModified ? editTime + DB[this.id].created : DB[this.id].lastModified;
                this.syncPending = true;
                TO_LOCAL_STORAGE.call(this, storeBool);
                return value;
            }
            if (TABLE_IS_DELETED(DB[this.id]))
                return undefined;
            if (typeof value === "string")
                value = value.replace(/<[^>]+>/g, ""); //remove html markup
            propName = TO_PROP_NAME(propName);
            if (DB[this.id].properties[propName]) {
                return validate.call(this, propName, value, DB[this.id].properties[propName][2]);
            }
            else if (type) {
                return validate.call(this, propName, value, type);
            }
            else
                CACHE_ERROR.call(this, propName, "invalid property name");
            return undefined;
        }
        function ADD_ROW(array, id, storeBool, editTimesArr, callback) {
            //creates a 3 digit id from custom alphabet one step higher than the given starting point
            function getNextId(idLength, existingIds, startingPoint) {
                function setStartingPoint(startingPoint) {
                    if (startingPoint) {
                        newId = TO_BASIC_ALPHABET(startingPoint);
                        newId = newId.replace(/[^A-z0-9]/g, "");
                        if (/^\d/.test(newId))
                            newId = alpha + newId;
                        newId = newId.slice(0, idLength);
                    }
                    while (newId.length < idLength)
                        newId += alpha;
                }
                function maxNumPos(idLength, alphabetLength) {
                    return Math.pow(alphabetLength, idLength - 1) * (alphabetLength - 10);
                }
                function buildId() {
                    function nextIndex(activeChar) {
                        return alphabet.indexOf(newId.charAt(activeChar)) - 1;
                    }
                    //roll all the digits ahead i.e. from 0099 to 0100
                    function rollAhead() {
                        while (letterIndex + 1 === alphabetLength) {
                            //reached the end of the alphabet
                            end = "";
                            for (var c = 0; c < newId.slice(activeChar, idLength).length; c++)
                                end += alpha;
                            if (activeChar === 0) {
                                //reached the first character in the id, roll over to all letters back to A or 0 or whatever
                                newId = end;
                                activeChar = idLength - 1;
                                letterIndex = nextIndex(activeChar);
                                break;
                            }
                            letterIndex = alphabet.indexOf(newId.charAt(activeChar - 1));
                            if (letterIndex + 1 === alphabetLength || activeChar === 1 && /\d/.test(alphabet[letterIndex + 1])) {
                                //the next character is also at the end of the alphabet
                                activeChar--;
                                letterIndex = nextIndex(activeChar);
                                continue;
                            }
                            newId = newId.slice(0, activeChar - 1) + alphabet[letterIndex + 1] + end;
                            activeChar--;
                            if (alphabet[letterIndex + 1] !== "") {
                                newId = newId.slice(0, activeChar) + alphabet[letterIndex + 1] + newId.slice(activeChar + 1, idLength);
                                activeChar = idLength - 1;
                                letterIndex = nextIndex(activeChar);
                            }
                        }
                    }
                    var activeChar, letterIndex, end;
                    for (activeChar = idLength - 1; (existingIds[newId] !== undefined || FORBIDDEN.indexOf(newId) !== -1) && activeChar > -1 && num < maxIdsPossible; activeChar--, num++) {
                        for (letterIndex = alphabet.indexOf(newId.charAt(activeChar)); (existingIds[newId] !== undefined || FORBIDDEN.indexOf(newId) !== -1) && letterIndex < alphabetLength && num < maxIdsPossible; letterIndex++, num++) {
                            if (letterIndex + 1 !== alphabetLength) {
                                if (activeChar === 0 && /\d/.test(alphabet[letterIndex + 1])) {
                                    num--;
                                    continue;
                                }
                                newId = newId.slice(0, activeChar) + alphabet[letterIndex + 1] + newId.slice(activeChar + 1, idLength);
                                continue;
                            }
                            rollAhead();
                        }
                    }
                    alphabet = null;
                    alphabetLength = null;
                    alpha = null;
                    activeChar = null;
                    letterIndex = null;
                    end = null;
                    if (num > maxIdsPossible) {
                        CACHE_ERROR.call(this, "getNextId failed", "You have exceeded a design limitation in the number of possible records that this application can handle.");
                        return null;
                    }
                    else
                        return newId;
                }
                var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
                existingIds = existingIds || {};
                if (typeof existingIds !== "object") {
                    CACHE_ERROR.call(this, "getNextId failed", "Invalid parameters: existingIds expects a JSON object");
                    return null;
                }
                var alphabetLength = alphabet.length, maxIdsPossible = maxNumPos(idLength, alphabetLength), newId = "", num = 0, alpha = alphabet[0];
                setStartingPoint(startingPoint);
                return buildId.call(this);
            }
            if (TABLE_IS_DELETED(DB[this.id])) {
                CACHE_ERROR.call(this, "please recreate table before adding rows");
                return callback instanceof Function ? (callback.call(this, false, "please recreate table before adding rows"), false) : false;
            }
            var hLen = DB[this.id].columns.headers.length;
            if (id && array.length === hLen && array[0] === id) {
                array = array.slice(1);
            }
            if (array.length !== hLen - 1) {
                CACHE_ERROR.call(this, array, "new row doesn't match table size: " + hLen);
                return callback instanceof Function ? (callback.call(this, false, "new row doesn't match table size: " + hLen), false) : false;
            }
            id = getNextId.call(this, 3, DB[this.id].ids, id ? id : IS_ARRAY(array) ? array.join("") : null);
            if (!id)
                return callback instanceof Function ? (callback.call(this, false, "unknown"), false) : false;
            var row = [id];
            if (!array || array.constructor !== Array) {
                CACHE_ERROR.call(this, array, "cannot add row");
                row = null;
                return callback instanceof Function ? (callback.call(this, false, "cannot add row"), false) : false;
            }
            for (var a = 1, len = DB[this.id].columns.headers.length, type = void 0; a < len; a++) {
                type = DB[this.id].columns.meta[DB[this.id].columns.headers[a]].type[0];
                if (type === "boolean")
                    row[a] = false;
                else if (VALID_NUMBER_TYPES.test(type))
                    row[a] = 0;
                else
                    row[a] = "";
            }
            DB[this.id].table.push(row);
            ROW_INDEX_CACHE[this.id] = {}; //clear the cache
            editTimesArr = editTimesArr || [];
            editTimesArr[0] = VALIDATE_EDIT_TIME.call(this, editTimesArr[0], "row", "addRow");
            DB[this.id].lastModified = editTimesArr && editTimesArr[0] !== undefined ?
                editTimesArr[0] + DB[this.id].created > DB[this.id].lastModified ?
                    editTimesArr[0] + DB[this.id].created : DB[this.id].lastModified : TIMESTAMP();
            DB[this.id].ids[id] = editTimesArr && editTimesArr[0] !== undefined ? [editTimesArr[0]] : [TIMESTAMP(DB[this.id].created)];
            for (var a = 0, len = hLen - 1; a < len; a++) {
                SET_VAL.call(this, id, a + 1, array[a], false, editTimesArr[a + 1]);
            }
            row = null;
            hLen = null;
            this.syncPending = true;
            TO_LOCAL_STORAGE.call(this, storeBool);
            return callback instanceof Function ? (callback.call(this, id, false), id) : id;
        }
        function VALIDATE(value, valueType, traceStr, callback) {
            function ret(valid, change, ErrMsg, details) {
                var obj = { valid: valid, value: change, error: ErrMsg, details: change !== value ? "Changed '" + value + "' to '" + change + "'" : details };
                if (callback instanceof Function)
                    callback.call(this, change, ErrMsg, obj.details);
                return obj;
            }
            function validateFamilyName(name) {
                var orig = name, n;
                name = TRIM(String(name));
                if (/[^A-Za-z\xC0-\xFF '\-]/g.test(name)) {
                    var expl = "Lastnames may only contain latin characters A-Z and special characters -'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÛÜÝÞß";
                    return ret.call(this, false, orig, "Invalid characters found in lastname", expl);
                }
                //catch McNames and O'Names
                if (name.slice(0, 2).toLowerCase() === "mc" || name.charAt(1) === "'") {
                    name = name.charAt(0).toUpperCase() + name.charAt(1).toLowerCase() + name.charAt(2).toUpperCase() + name.slice(3).toLowerCase();
                }
                //catch MacNames
                else if (name.slice(0, 3).toLowerCase() === "mac" && name.toLowerCase() !== "mack") {
                    name = "Mac" + name.charAt(3) + name.slice(4).toLowerCase();
                }
                //catch LaNames and LeNames (but not La Names or Le Names)
                else if ((name.slice(0, 2).toLowerCase() === "la" || name.slice(0, 2).toLowerCase() === "le") && name.charAt(2) !== " ") {
                    name = name.charAt(0).toUpperCase() + name.charAt(1).toLowerCase() + name.charAt(2) + name.slice(3).toLowerCase();
                }
                //capitalize Spaced Names
                else if (/ /.test(name)) {
                    n = name.split(" ");
                    if (n[0].length === 2 || n[0].toLowerCase() === "von" || n[0].toLowerCase() === "van") {
                        for (var a = 0, lenA = n.length; a < lenA; a++) {
                            n[a] = n[a].charAt(0) + n[a].slice(1).toLowerCase();
                        }
                        name = n.join(" ");
                    }
                    else
                        return ret.call(this, false, orig, "Invalid lastname", "'" + name + "' is not a valid last name");
                }
                //catch VanNames
                else if (name.slice(0, 3).toLowerCase() === "van") {
                    name = name.charAt(0) + name.slice(1, 3).toLowerCase() + name.charAt(3) + name.slice(4).toLowerCase();
                }
                //capitalize Hyphenated-Names
                else if (/-/.test(name)) {
                    n = name.split("-");
                    for (var b = 0, lenB = n.length; b < lenB; b++) {
                        n[b] = n[b].replace(/^\s+|\s+$/g, "");
                        n[b] = n[b].charAt(0).toUpperCase() + n[b].slice(1).toLowerCase();
                    }
                    name = n.join("-");
                }
                //capitalize all other cases
                else
                    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
                n = null;
                return ret.call(this, true, name, false);
            }
            function validateGivenName(name) {
                var orig = name;
                name = TRIM(String(name));
                if (/[^A-Za-z\xC0-\xFF \-&\(\),;\[\]]/g.test(name)) {
                    var expl = "Firstnames may only contain latin characters A-Z and special characters &()[],;-'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÛÜÝÞß";
                    return ret.call(this, false, orig, "Invalid charactors found in firstname", expl);
                }
                name = name.replace(/\. /g, ", ");
                var n = name.split(" ");
                //capitalize names
                for (var a = 0, lenA = n.length; a < lenA; a++)
                    n[a] = n[a].charAt(0).toUpperCase() + n[a].slice(1);
                name = n.join(" ");
                n = null;
                return ret.call(this, true, name, false);
            }
            function validateOrganization1_Name(field) {
                var orig = field, brak = "";
                field = String(field);
                if (/\(/.test(field) && /\)/.test(field)) {
                    brak = field.slice(field.indexOf("(") + 1, field.indexOf(")"));
                    var regexp = new RegExp("\\(" + brak.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&") + "\\)");
                    field = field.replace(regexp, " /BRACKETS/ ");
                    brak = TRIM(brak);
                }
                field = field.replace(/[^A-Z\xC0-\xFF\/ ]/gi, "");
                field = field.replace(/\/BRACKETS\//g, "(" + brak + ")");
                field = TRIM(field);
                var split = field.split(" ");
                for (var a = 0, lenA = split.length; a < lenA; a++) {
                    split[a] = split[a].charAt(0).toUpperCase() + split[a].slice(1);
                }
                field = split.join(" ");
                split = field.split("/");
                for (var b = 0, lenB = split.length; b < lenB; b++) {
                    split[b] = split[b].charAt(0).toUpperCase() + split[b].slice(1);
                }
                field = split.join("/");
                return ret.call(this, true, field, false);
            }
            function validateAddress(addr) {
                function formatSeeOtherAddr(addr) {
                    addr = addr.replace(/addres:|Address:|adress:|Adress:|Addres:|address:/, "address: ");
                    addr = addr.replace(/Mail:|Mail to:|mail to:|mail:/, "mail: ");
                    if (!/mail:/.test(addr))
                        addr = addr.replace(/c\/o /i, "mail: c/o ");
                    addr = addr.replace(/:see|:See|: See|: see/, ": see ");
                    addr = addr.replace(/Address see:|address see:|address see /, "address: see ");
                    addr = addr.replace(/Mail see:|mail see:|mail see /, "mail: see ");
                    if (/address: |mail: /.test(addr)) {
                        addr = addr.replace(/\)|\(/g, "");
                        addr = "(" + addr + ")";
                        addr = addr.replace(/ : /g, " ");
                    }
                    if (/mail: /.test(addr)) {
                        addr = addr.replace(/Po Box|Bx/g, " PO Box ");
                        if (!/PO Box/g.test(addr))
                            addr = addr.replace(/Box/g, " PO Box ");
                        addr = addr.replace(/Site/g, " Site ");
                        addr = addr.replace(/Comp/g, " Comp ");
                        addr = addr.replace(/(RR\s\s|RR)(\d)/gi, " RR $2");
                        addr = addr.replace(/Unit/g, " Unit ");
                        addr = addr.replace(/Block/g, " Block ");
                    }
                    return addr;
                }
                function formatMailAddr(addr) {
                    addr = addr.replace(/Bx|Po Box/g, " PO Box ");
                    if (!/PO Box/.test(addr))
                        addr = addr.replace(/Box/g, " PO Box ");
                    addr = addr.replace(/Site/g, " Site ");
                    addr = addr.replace(/Comp/g, " Comp ");
                    return addr.replace(/(RR\s\s|RR)(\d)/gi, " RR $2");
                }
                function formatRuralAddr(addr) {
                    if (!/mile /gi.test(addr))
                        addr = addr.replace(/\./g, "");
                    addr = addr.replace(/Rge/g, " Range ");
                    addr = addr.replace(/Twp/g, " Township ");
                    if (/ Range | Township /.test(addr))
                        addr = addr.replace(/Rd/g, " Road ");
                    addr = addr.replace(/Hwy|HWY|hwy|Hiway|hiway/g, " Highway ");
                    //replace dash in Range Road number
                    var i;
                    if (/Range Road \d\-\d|Range Road \d\d-\d/.test(addr)) {
                        i = addr.indexOf("Range Road ");
                        if (addr.charAt(i + 12) === "-")
                            addr = addr.slice(0, i + 12) + addr.slice(i + 13);
                        if (addr.charAt(i + 13) === "-")
                            addr = addr.slice(0, i + 13) + addr.slice(i + 14);
                    }
                    //replace dash in Township Road number
                    if (/Township Road \d\-\d|Township Road \d\d-\d/.test(addr)) {
                        i = addr.indexOf("Township Road ");
                        if (addr.charAt(i + 15) === "-")
                            addr = addr.slice(0, i + 15) + addr.slice(i + 16);
                        if (addr.charAt(i + 16) === "-")
                            addr = addr.slice(0, i + 16) + addr.slice(i + 17);
                    }
                    i = null;
                    return addr;
                }
                function formatUrbanAddr(addr) {
                    addr = addr.replace(/Av /g, " Ave ");
                    addr = addr.replace(/Av$/g, " Ave ");
                    addr = addr.replace(/Rm/g, "Apt ");
                    addr = addr.replace(/# /g, "");
                    addr = addr.replace(/Unit/g, " Unit ");
                    addr = addr.replace(/Block/g, " Block ");
                    if (/\d St|\d Ave/.test(addr)) {
                        addr = addr.replace(/(\d) - (\d)/, "$1-$2");
                    }
                    return addr;
                }
                var orig = addr, brak = "", c = TRIM(String(addr)).split(" ");
                //capitalize
                for (var a = 0, lenA = c.length; a < lenA; a++) {
                    if (!/\d/.test(c[a]) && c[a] !== "of" && c[a] !== "see" && !/addres|adres|mail|^see:/.test(c[a])) {
                        c[a] = c[a].charAt(0).toUpperCase() + c[a].slice(1);
                    }
                    if (c[a] === "Nw" || c[a] === "Ne" || c[a] === "Sw" || c[a] === "Se" || c[a] === "Po" || c[a] === "Rr")
                        c[a] = c[a].toUpperCase();
                    if (c[a] === "C/o")
                        c[a] = c[a].toLowerCase();
                }
                addr = c.join(" ");
                if (/[^A-Za-z0-9\xC0-\xFF\s\-#&]/.test(addr)) {
                    addr = formatSeeOtherAddr(addr);
                    //ignore whatever is inside brackets
                    if (/\(/.test(addr) && /\)/.test(addr)) {
                        //APP.CacheMsg("Brackets in Address", "error");
                        brak = addr.slice(addr.indexOf("(") + 1, addr.indexOf(")"));
                        var regexp = new RegExp("\\(" + brak.replace(/[-[\]{}()*+?.,\\^$|#]/g, "\\$&") + "\\)");
                        addr = addr.replace(regexp, " -BRACKETS- ");
                        brak = TRIM(brak);
                    }
                }
                addr = formatRuralAddr(addr);
                addr = formatUrbanAddr(addr);
                addr = formatMailAddr(addr);
                addr = TRIM(addr);
                if (/[^A-Za-z0-9\xC0-\xFF\s\-&\(\)\/#',]/.test(addr)) {
                    return ret.call(this, false, orig, "Address contains invalid characters", "Addresses may only contain A-z, 0-9, and special characters -&()/#',ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÛÜÝÞß");
                }
                addr = addr.replace(/-BRACKETS-/g, "(" + brak + ")");
                addr = TRIM(addr);
                return ret.call(this, true, addr, false);
            }
            function validateCity(city) {
                var orig = city;
                var c = TRIM(String(city)).split(" ");
                //capitalize names
                for (var a = 0, lenA = c.length; a < lenA; a++) {
                    if (!/\d/.test(c[a]) && c[a] !== "of") {
                        c[a] = c[a].charAt(0).toUpperCase() + c[a].slice(1);
                    }
                }
                city = c.join(" ");
                city = city.replace(/ Nc$| Ne$| Nw$| N$| Sw$| Se$| S$| E$| W$/g, "");
                city = city.replace(/ Ab$/, ", AB");
                city = city.replace(/ Ak$/, ", AK");
                city = city.replace(/ Bc$/, ", BC");
                city = city.replace(/ Mb$/, ", MB");
                city = city.replace(/ Nt$/, ", NT");
                city = city.replace(/ Sk$/, ", SK");
                city = city.replace(/ Yt$/, ", YT");
                city = city.replace(/,,/, ",");
                city = city.replace(/^Ftt |^Fortt /gi, "Fort St. ");
                city = city.replace(/^Ft /gi, "Fort ");
                city = city.replace(/^St /i, "St. ");
                city = city.replace(/^MD of |Municipal District of /i, "M.D. of ");
                city = city.replace(/ No | \#/i, " No. ");
                if (/\'/.test(city) && !/\'s/.test(city))
                    city = city.replace(/\'/g, "");
                if (/\./.test(city) && !/\St. | No. \d|^M.D. of /.test(city))
                    city = city.replace(/\./g, "");
                city = city.replace(/[^A-Za-z0-9\xC0-\xFF\s\'\.]/g, ""); //special characters \xC0-\xFF (ÅÖÄöäå, etc) allowed
                return ret.call(this, true, city, false);
            }
            function validateProvince(prov) {
                var orig = prov;
                prov = TRIM(String(prov)).replace(/[^A-z ]/g, "");
                if (prov === "PEI")
                    prov = "PE";
                if (prov.length < 2 && prov !== "") {
                    return ret.call(this, false, orig, "Province name is too short");
                }
                if (prov.length === 2) {
                    prov = prov.toUpperCase();
                }
                else {
                    var arr = prov.split(" ");
                    for (var a = 0; a < arr.length; a++) {
                        arr[a] = arr[a].charAt(0).toUpperCase() + arr[a].slice(1).toLowerCase();
                    }
                    prov = arr.join(" ");
                    arr = null;
                }
                return ret.call(this, true, prov, false);
            }
            function validatePostalCode(code) {
                var orig = code;
                //number only codes
                if (IS_NUMERIC(code)) {
                    if (/[\s\-]/.test(String(orig))) {
                        code = TRIM(String(orig).replace(/[^0-9\s\-]/g, ""));
                        return ret.call(this, true, code, false);
                    }
                    if (!String(code).match(/\d{2,10}/))
                        return ret.call(this, false, orig, "Invalid postal code");
                    else
                        return ret.call(this, true, code, false);
                }
                //number letter codes
                else {
                    code = String(code).toUpperCase().replace(/[^A-Z0-9]/g, "");
                    if (code.length === 6) {
                        //check Canadian Postal Codes
                        for (var a = 0; a < 6; a++) {
                            //catch 0 instead of O
                            if (code.charAt(a) === "0")
                                code = code.slice(0, a) + "O" + code.slice(a + 1, 6);
                            if (/[^A-Z]/.test(code.charAt(a))) {
                                return ret.call(this, false, orig, "Invalid Canadian postal code", "Position " + a + " should be an uppercase letter A-Z");
                            }
                            a++;
                            //catch O instead of 0
                            if (code.charAt(a) === "O")
                                code = code.slice(0, a) + "0" + code.slice(a + 1, 6);
                            if (/[^0-9]/.test(code.charAt(a))) {
                                return ret.call(this, false, orig, "Invalid Canadian postal code", "Position " + a + " should be a number");
                            }
                        }
                        //check for Canadian postal code format and add missing space
                        if (code.match(/[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d/))
                            code = code.slice(0, 3) + " " + code.slice(3);
                        else
                            return ret.call(this, false, orig, "Invalid Canadian Postal Code", "Use format A1A 1A1");
                    }
                }
                return ret.call(this, true, code, false);
            }
            function validatePhoneNumber(phon) {
                function validateInternationalNumber(phon) {
                    //valid international phone numbers regex
                    var i = /(^9[976]\d|^8[987530]\d|^6[987]\d|^5[90]\d|^42\d|^3[875]\d|^2[98654321]\d|^9[8543210]|^8[6421]|^6[6543210]|^5[87654321]|^4[987654310]|^3[9643210]|^2[70]|^7|^1)\d{1,14}$/;
                    // if (phon.charAt(0) === "0" && phon.length < 11) {
                    // 	if (phon.length === 10) {
                    // 		//format local Swedish numbers beginning with 07
                    // 		if (phon.charAt(1) === "7") {
                    // 			phon = phon.slice(0, 3) + "-" + phon.slice(3, 6) + " " + phon.slice(6, 8) + " " + phon.slice(8, 10);
                    // 		}
                    // 		else if (phon.charAt(1) === "8") {
                    // 			phon = phon.slice(0, 2) + "-" + phon.slice(2, 5) + " " + phon.slice(5, 8) + " " + phon.slice(8, 10);
                    // 		}
                    // 		else phon = orig.replace(/[^0-9\s\-]/g, "");
                    // 	}
                    // 	else if (phon.length === 9 && phon.charAt(1) === "8") {
                    // 		phon = phon.slice(0, 2) + "-" + phon.slice(2, 5) + " " + phon.slice(5, 7) + " " + phon.slice(7, 9);
                    // 	}
                    // 	else phon = orig.replace(/[^0-9\s\-]/g, "");
                    // }
                    // else
                    if (phon.match(i)) {
                        // if (phon.length === 11 && phon.slice(0, 2) === "46") {//Swedish number
                        // 	phon = "+" + phon.slice(0, 2) + "-" + phon.slice(2, 4) + " " + phon.slice(4, 7) + " " + phon.slice(7, 9) + " " + phon.slice(9, 11);
                        // }
                        phon = "+" + orig.replace(/[^0-9\s\-]/g, "");
                    }
                    else if (phon.length < 16 && orig[0] !== "+") {
                        if (phon.charAt(0) === "0")
                            phon = orig.replace(/[^0-9\s\-]/g, "");
                        else
                            return ret.call(this, false, orig, "International phone numbers must begin with '+' symbol");
                    }
                    else
                        return ret.call(this, false, orig, "Invalid Phone Number");
                    return ret.call(this, true, phon, false);
                }
                var orig = String(phon);
                phon = String(phon).replace(/[^0-9]/g, "");
                if (orig.length > 0 && !/\d/.test(phon))
                    return ret.call(this, false, orig, "Phone number must contain digits");
                //international numbers
                if (phon.charAt(0) !== "1" && (phon.length > 10 || phon.charAt(0) === "0" || String(orig).charAt(0) === "+")) {
                    return validateInternationalNumber.call(this, phon);
                }
                else if (phon) {
                    //catch emergency numbers
                    if (phon.charAt(0) === "1" && phon.length < 6)
                        return ret.call(this, true, phon, false);
                    //catch area code inserted where country code should be (403-403-987-6543)
                    if (phon.length === 13 && phon.slice(0, 3) === phon.slice(3, 6))
                        phon = "1" + phon.slice(3, 13);
                    //catch country code (1) at beginning of phone number
                    if (phon.length === 11 && parseInt(phon.charAt(0), 10) === 1)
                        phon = "+1 " + phon.slice(1, 4) + "-" + phon.slice(4, 7) + "-" + phon.slice(7, 11);
                    //catch spaces, dots or brackets used instead of dashes
                    else if (phon.length === 10 && parseInt(phon.charAt(0), 10) !== 1)
                        phon = phon.slice(0, 3) + "-" + phon.slice(3, 6) + "-" + phon.slice(6, 10);
                    else
                        return ret.call(this, false, orig, "Invalid Phone Number");
                }
                return ret.call(this, true, phon, false);
            }
            function validateEmail(email) {
                var orig = email, e = TRIM(String(email)).split("@");
                if (e.length === 2) {
                    //username
                    e[0] = e[0].replace(/[^A-Za-z0-9\&\'\+\-_\.]/g, ""); //too restrictive?
                    e[0] = e[0].replace(/^\.|\.$|^\-|\-$/g, "");
                    e[0] = e[0].replace(/[\s\t\r\n]/g, "");
                    e[0] = e[0].replace(/\.\./g, ".");
                    e[0] = e[0].slice(0, 63);
                    //domain
                    e[1] = e[1].replace(/[^A-Za-z0-9\-\.\_\:\[\]]/g, ""); //too restrictive?
                    e[1] = e[1].replace(/^\.|\.$|^\-|\-$/g, "");
                    e[1] = e[1].replace(/[\s\t\r\n]/g, "");
                    e[1] = e[1].replace(/\.\./g, ".");
                    if (e[0].length > 0 && e[1].length > 1
                        && /^[\w!#$%&'*+\-\/=?^`{|}~.]+$/.test(e[0])
                        && new RegExp("^([a-z0-9][a-z0-9\\-]*\\.)+([a-z]+|xn--[a-z0-9\\-]+)$", "i").test(e[1])) {
                        email = (e[0] + "@" + e[1]).slice(0, 255);
                    }
                    else
                        return ret.call(this, false, orig, "Invalid Email Address", "This email address contains features that may not be compatible with all clients");
                }
                else
                    return ret.call(this, false, orig, "Invalid Email Address", e.length === 1 ? "Requires an @ symbol" : "Email addresses may only contain 1 @ symbol");
                return ret.call(this, true, email, false);
            }
            function validateGPSCoordinates(str) {
                var orig = str;
                str = TRIM(String(str)).replace(/[^\+\-0-9\s\.,]/, "");
                if (!/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(str)) {
                    return ret.call(this, false, orig, "Invalid GPS Co-ordinates");
                }
                var coord = str.split(", ");
                if (coord.length === 2) {
                    if (/\./.test(coord[0]))
                        coord[0] = coord[0].split(".")[0] + "." + coord[0].split(".")[1].slice(0, 6);
                    if (/\./.test(coord[1]))
                        coord[1] = coord[1].split(".")[0] + "." + coord[1].split(".")[1].slice(0, 6);
                    str = coord[0] + ", " + coord[1];
                }
                coord = null;
                return ret.call(this, true, str, false);
            }
            function validateLatitude(str) {
                var orig = str;
                str = String(str).replace(/[^\+\-0-9\.]/, "");
                if (!/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/.test(str)) {
                    return ret.call(this, false, orig, "Invalid GPS Latitude", "Requires a decimal between -90 and +90");
                }
                if (/\./.test(str)) {
                    str = str.split(".")[0] + "." + str.split(".")[1].slice(0, 6);
                }
                return ret.call(this, true, str, false);
            }
            function validateLongitude(str) {
                var orig = str;
                str = String(str).replace(/[^\+\-0-9\.]/, "");
                if (!/^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(str)) {
                    return ret.call(this, false, orig, "Invalid GPS Longitude", "Requires a decimal between -180 and +180");
                }
                if (/\./.test(str)) {
                    str = str.split(".")[0] + "." + str.split(".")[1].slice(0, 6);
                }
                return ret.call(this, true, str, false);
            }
            if (!VALID_TYPES.test(valueType))
                return ret.call(this, false, value, valueType + " is not a valid type");
            if (!VALUE_IS_VALID.call(this, value, valueType, false, traceStr + "@validate"))
                return ret.call(this, false, value, ERRORS.pop() || false);
            if (value === "")
                return ret.call(this, true, value, false);
            //validate value based on value type
            if (/Family/i.test(valueType))
                return validateFamilyName.call(this, value);
            else if (/Given|Spouse/i.test(valueType))
                return validateGivenName.call(this, value);
            else if (/Field|Organization/i.test(valueType))
                return validateOrganization1_Name.call(this, value);
            else if (/City|County/i.test(valueType))
                return validateCity.call(this, value);
            else if (/Province|State|Region/i.test(valueType))
                return validateProvince.call(this, value);
            else if (/Postal/i.test(valueType))
                return validatePostalCode.call(this, value);
            else if (/Street/i.test(valueType) || /Location/i.test(valueType) && /[A-z]/.test(String(value)))
                return validateAddress.call(this, value);
            else if (/Latitude/i.test(valueType))
                return validateLatitude.call(this, value);
            else if (/Longitude/i.test(valueType))
                return validateLongitude.call(this, value);
            else if (/Location/i.test(valueType))
                return validateGPSCoordinates.call(this, value);
            else if (/Phone/i.test(valueType))
                return validatePhoneNumber.call(this, value);
            else if (/Email|E-mail|E_mail/i.test(valueType))
                return validateEmail.call(this, value);
            else
                return ret.call(this, true, value, false);
        }
        function GET_FORBIDDEN() {
            //globals and properties to avoid using (plus anything that begins with "scroll", "screen", "on", "moz" or "webkit")
            var forbidden = "Array ContentSearchUIController CssFlags Date HistoryController Infinity InstallTrigger JavaArray JavaObject JavaPackage Math";
            forbidden += " NaN Number Object PERSISTENT PropTypes TEMPORARY RPMAddMessageListener RPMGetAppBuildID RPMGetBoolPref RPMGetFormatURLPref";
            forbidden += " RPMGetFxAccountsEndpoint RPMGetIntPref RPMGetUpdateChannel RPMIsWindowPrivate RPMRemoveMessageListener RPMSendAsyncMessage";
            forbidden += " RPMSetBoolPref React ReactDOM ReactRedux Redux String addEventListener alert all anchor anchors applicationCache area assign atob";
            forbidden += " blur btoa button caches cancelAnimationFrame cancelIdleCallback captureEvents checkbox chrome class clearInterval clearTimeout";
            forbidden += " clientInformation close closed confirm console constructor createImageBitmap crypto customElements decodeURI decodeURIComponent";
            forbidden += " defaultStatus defaultstatus devicePixelRatio dispatchEvent document dump element elements embed embeds encodeURI encodeURIComponent";
            forbidden += " enum esImport escape eval event export extends external fetch fileUpload find focus form formatParams forms frame frameElement";
            forbidden += " frameRate frames fullScreen function gContentSearchController generateUUID4 getClass getComputedStyle getCookie getDefaultComputedStyle";
            forbidden += " getLoggingParameters getSelection getZenAPIHost hasOwnProperty hidden history image images import indexedDB innerHeight innerWidth";
            forbidden += " isFinite isNaN isPrototypeOf isSecureContext java javaClass layer layers length link localStorage location locationbar logError";
            forbidden += " matchMedia menubar mimeTypes moveBy moveTo name navigate navigator offscreenBuffering open openDatabase opener option opr origin";
            forbidden += " outerHeight outerWidth packages pageXOffset pageYOffset parent parseFloat parseInt password performance personalbar pkcs11";
            forbidden += " plugin postMessage print prompt propertyIsEnum propagateLeads prototype qs qsFromCookies qsFromDataAttribute qsFromDataAttributeHelper";
            forbidden += " qsFromDocument qsFromUrl queueMicrotask radio releaseEvents removeEventListener requestAnimationFrame requestIdleCallback reset";
            forbidden += " resizeBy resizeTo secure select self sessionStorage setInterval setResizable setTimeout sidebar sizeToContent speechSynthesis";
            forbidden += " src status statusbar stop styleMedia submit super taint text textarea toString toolbar top u2f undefined unescape untaint";
            forbidden += " updateStartpageBackgroundColor updateCommands valueOf visualViewport webWorker webpackJsonp window";
            return forbidden.split(" ");
        }
        function SET_VAL(rowId, colName, newValue, storeBool, editTime, callback) {
            function applyVal(toTable, toIds, rowIndex) {
                var thisModified;
                editTime = VALIDATE_EDIT_TIME.call(this, editTime, "cell", "setVal", toTable[rowIndex][0]);
                toTable[rowIndex][colIndex] = newValue;
                toIds[toTable[rowIndex][0]][colIndex] = editTime;
                thisModified = toIds[toTable[rowIndex][0]][0] === "del" ?
                    editTime + Number(toIds[toTable[rowIndex][0]][1]) + DB[this.id].created :
                    editTime + Number(toIds[toTable[rowIndex][0]][0]) + DB[this.id].created;
                if (thisModified > DB[this.id].lastModified)
                    DB[this.id].lastModified = thisModified;
                thisModified = null;
                this.syncPending = true;
                TO_LOCAL_STORAGE.call(this, storeBool);
                return callback instanceof Function ? (callback.call(this, newValue, false, DB[this.id].title, true), newValue) : newValue;
            }
            var db = DB[this.id];
            if (TABLE_IS_DELETED(db)) {
                return callback instanceof Function ? (callback.call(this, undefined, "table is deleted", DB[this.id].title, this.syncPending), undefined) : undefined;
            }
            if (typeof newValue === "string") {
                newValue = newValue.replace(/<[^>]+>/g, ""); //remove html markup
                if (newValue !== "" && !isNaN(Number(newValue)))
                    newValue = Number(newValue); //convert numbers in String form to Number form
                if (newValue === "true")
                    newValue = true;
                if (newValue === "false")
                    newValue = false;
            }
            var rowIndex = GET_INDEX_OF_ROW.call(this, rowId), colIndex = GET_INDEX_OF_COLUMN.call(this, colName), rowIsHidden = false;
            if (rowIndex < 0) {
                rowIndex = GET_INDEX_OF_HIDDEN_ROW.call(this, rowId);
                if (rowIndex > -1)
                    rowIsHidden = true;
            }
            if (!(rowIndex > -1 && colIndex > 0)) {
                var error = rowIndex === -1 ? "rowId not found: " + rowId : "colName not found: " + colName;
                return callback instanceof Function ? (callback.call(this, undefined, error, DB[this.id].title, this.syncPending), undefined) : undefined;
            }
            var validationObj = VALIDATE.call(this, newValue, db.columns.meta[db.columns.headers[colIndex]].type[0], "SET_VAL: " + rowId + ":" + colName);
            if (validationObj.valid) {
                if (rowIsHidden)
                    return applyVal.call(this, HIDDEN_TABLE_DATA[this.id], HIDDEN_IDS[this.id], rowIndex);
                else
                    return applyVal.call(this, db.table, db.ids, rowIndex);
            }
            else
                return callback instanceof Function ? (callback.call(this, undefined, ERRORS[this.id], DB[this.id].title, this.syncPending), undefined) : undefined;
        }
        function DELETE_ROW(rowId, storeBool, editTime) {
            if (TABLE_IS_DELETED(DB[this.id])) {
                CACHE_ERROR.call(this, rowId, "could not delete row, table has been deleted");
                return false;
            }
            //get row index
            var index = GET_INDEX_OF_ROW.call(this, rowId), rowIsHidden = false;
            //if not found
            if (index === -1) {
                //check hidden rows
                if (HIDDEN_TABLE_DATA[this.id] && HIDDEN_IDS[this.id][rowId]) {
                    rowIsHidden = true;
                    index = GET_INDEX_OF_HIDDEN_ROW.call(this, rowId);
                }
                if (index === -1) {
                    index = null;
                    CACHE_ERROR.call(this, rowId, "row does not exist or was already deleted");
                    return false;
                }
            }
            //if found
            editTime = VALIDATE_EDIT_TIME.call(this, editTime, "row", "deleteRow");
            //set deleted in id registry
            if (rowIsHidden)
                HIDDEN_IDS[this.id][HIDDEN_TABLE_DATA[this.id][index][0]] = ["del", editTime];
            else
                DB[this.id].ids[DB[this.id].table[index][0]] = ["del", editTime];
            //delete the row
            if (rowIsHidden)
                HIDDEN_TABLE_DATA[this.id].splice(index, 1);
            else
                DB[this.id].table.splice(index, 1);
            //clear the row cache
            ROW_INDEX_CACHE[this.id] = {};
            //update lastModified and syncPending
            DB[this.id].lastModified = editTime + DB[this.id].created > DB[this.id].lastModified ? editTime + DB[this.id].created : DB[this.id].lastModified;
            this.syncPending = true;
            //save changes to localStorage
            TO_LOCAL_STORAGE.call(this, storeBool);
            return true;
        }
        function VALIDATE_EDIT_TIME(num, type, traceStr, id) {
            var t = TIMESTAMP();
            var db = DB[this.id];
            switch (type) {
                case "created":
                case "lastModified":
                case "deleted":
                    break;
                case "row":
                case "property":
                case "column":
                    t = TIMESTAMP(db.created);
                    break;
                case "cell":
                    if (TABLE_IS_DELETED(db))
                        CACHE_ERROR.call(this, "cannot validate cell edit time of deleted table");
                    else if (id)
                        t = db.ids[id][0] === "del" ? TIMESTAMP(db.created) : TIMESTAMP(db.created + db.ids[id][0]);
                    else
                        CACHE_ERROR.call(this, "validating a cell edit time requires an cell id");
                    break;
                default:
                    CACHE_ERROR.call(this, type, "no such item to timestamp @ " + traceStr);
            }
            if (num === "del" && type === "row")
                return num;
            else if (!num && num !== 0)
                return t;
            else if (!IS_NUMERIC(num) || num === 0 && (type === "created" || type === "lastModified" || type === "deleted")) {
                CACHE_ERROR.call(this, num, "invalid " + type + " timestamp found @ " + traceStr);
                return t;
            }
            else if (num <= t) {
                return num;
            }
            else {
                CACHE_ERROR.call(this, num, type + " timestamp out of range @ " + traceStr + ". Should be less than " + t);
                return num - db.created;
            }
        }
        function DELETE_TABLE(callback, editTime, storeBool) {
            var msg = "Are you sure you want to delete " + DB[this.id].title + " ?", del = function () {
                DELETE_TABLE_BY_ID.call(this, this.id, editTime);
                this.syncPending = true;
                TO_LOCAL_STORAGE.call(this, storeBool);
                if (callback instanceof Function)
                    return callback.call(this, true, ERRORS[this.id], DB[this.id].title, true);
            }.bind(this), cancel = function () {
                if (callback instanceof Function)
                    return callback.call(this, false, ERRORS[this.id], DB[this.id].title, false);
            }.bind(this);
            if (APP.confirm)
                APP.confirm(msg, del, cancel, { "okButton": "Delete" });
            else if (window && window.confirm(msg))
                del.call(this);
            else
                cancel.call(this);
        }
        function DELETE_TABLE_BY_ID(id, editTime) {
            var validatedEditTime = VALIDATE_EDIT_TIME.call(this, editTime, "deleted", "deleteTableById");
            DB[id] = {
                "title": DB[id].title,
                "created": DB[id].created,
                "lastModified": validatedEditTime,
                "deleted": true,
                "version": this.version + "_" + base64_2.default.Version
            };
            validatedEditTime = null;
        }
        function INITIATE_DBS(title, callback) {
            function newDBS() {
                DBS[NUM++] = title;
                storage_1.default.setItem("tables", JSON.stringify(DBS));
                if (callback instanceof Function)
                    return callback(title);
            }
            title = TO_PROP_NAME(title);
            if (DBS && DBS[NUM + 1] === title) {
                NUM++;
                if (callback instanceof Function)
                    return callback(title);
            }
            else
                storage_1.default && storage_1.default.getItem("tables", null, function (tables) {
                    if (tables) {
                        DBS = JSON.parse(tables);
                        if (DBS.indexOf(title) === -1)
                            newDBS.call(this);
                        else {
                            NUM++;
                            if (callback instanceof Function)
                                return callback(title);
                        }
                    }
                    else
                        newDBS.call(this);
                }.bind(this), newDBS.bind(this));
        }
        function CHECK_HEADER_VALUE(headerValue, existingHeaders) {
            headerValue = TO_PROP_NAME(headerValue);
            var b = 1;
            if (existingHeaders.indexOf(headerValue) > -1) {
                while (existingHeaders.indexOf(headerValue.replace(/_\d$/, "") + "_" + b) > 0)
                    b++;
                headerValue = headerValue.replace(/_\d$/, "") + "_" + b;
            }
            return headerValue;
        }
        function CHECK_HEADERS_ARRAY(headers) {
            var ret = [];
            for (var a = 0, len = headers.length; a < len; a++) {
                ret[a] = CHECK_HEADER_VALUE(headers[a], ret);
            }
            if (ret[0] !== "id") {
                if (ret.indexOf("id") > -1)
                    ret[ret.indexOf("id")] = "_id";
                ret.unshift("id");
            }
            return ret;
        }
        function CREATE_BASE64_FILE(key, token, callback) {
            function dataString() {
                var str = base64_2.default.write(JSON.stringify(EXPORT_DB.call(this)), key);
                return JSON.stringify({
                    "data": str,
                    "signature": base64_2.default.hmac(str, key),
                    "version": this.version + "_" + base64_2.default.Version
                });
            }
            function syncFile() {
                if (!DBX_SYNC_OBJ[title] || DB[this.id].lastModified > DBX_SYNC_OBJ[title])
                    DBX_SYNC_OBJ[title] = DB[this.id].lastModified;
                return JSON.stringify(DBX_SYNC_OBJ);
            }
            function syncToken(token) {
                if (token) {
                    token = typeof token === "string" ? JSON.parse(token) : token;
                    if (typeof token !== "string" && token && token.version === this.version + "_" + base64_2.default.Version) {
                        if (token.signature && token.token && token.signature === base64_2.default.hmac(token.token, key)) {
                            var dbxSyncObj = JSON.parse(base64_2.default.read(token.token, key));
                            for (var i in dbxSyncObj) {
                                if (!DBX_SYNC_OBJ[i])
                                    DBX_SYNC_OBJ[i] = dbxSyncObj[i];
                            }
                        }
                        else {
                            SYNC_ERROR = true;
                            SYNC_ERROR_TIME = new Date().getTime();
                            CACHE_ERROR.call(this, "incorrect key tried");
                        }
                    }
                    else
                        CACHE_ERROR.call(this, "token version not supported");
                }
                if (!DBX_SYNC_OBJ[title] || DB[this.id].lastModified > DBX_SYNC_OBJ[title])
                    DBX_SYNC_OBJ[title] = DB[this.id].lastModified;
                token = base64_2.default.write(JSON.stringify(DBX_SYNC_OBJ), key);
                return JSON.stringify({
                    "token": token,
                    "signature": base64_2.default.hmac(token, key),
                    "version": this.version + "_" + base64_2.default.Version
                });
            }
            // if (SYNC_ERROR && new Date().getTime() - SYNC_ERROR_TIME < 6e4) {
            // 	if (callback instanceof Function) return callback.call(this, false, "try again later", false);
            // 	else return;
            // }; //code duplication from sync???
            var title = TO_PROP_NAME(DB[this.id].title), obj = {
                "title": DB[this.id].title,
                "file": dataString.call(this),
                "syncFile": syncFile.call(this),
                "syncToken": syncToken.call(this, token)
            };
            if (callback instanceof Function)
                return callback.call(this, true, ERRORS[this.id], obj);
        }
        function VALIDATE_BASIC_TYPE(type) {
            return VALIDATE_TYPE.call(this, type, true);
        }
        function VALIDATE_TYPE(type, basicTypeBool) {
            type = type ? String(type).toLowerCase().replace(/[^a-z]/g, "") : "null";
            if (!basicTypeBool) {
                type = type.replace(/^(posinteger|posintegers|positiveint|positiveinteger|pos)$/, "posInteger");
                type = type.replace(/^(neginteger|negintegers|negativeint|negativeinteger|neg)$/, "negInteger");
                type = type.replace(/^(uniquestring|uniquestrings|unique|id|uniqueid)$/, "uniqueString");
                type = type.replace(/^(multiline|mulitlinestring|multilinestring|multilinestrings)$/, "multilineString");
                type = type.replace(/^(phonenumber|phonenumbers|phone|phones|mobile|mobilephone|homephone|workphone|personalphone|cellphone|cell)$/, "phoneNumber");
                type = type.replace(/^(formattedaddress|fulladdress|address)$/, "formattedAddress");
                type = type.replace(/^(streetaddress|streetaddresses|street)$/, "streetAddress");
                type = type.replace(/^(mailaddress|mailaddresses|mail|pobox)$/, "mailAddress");
                type = type.replace(/^(citycounty|city|town|citytown|citytowncounty|county)$/, "cityCounty");
                type = type.replace(/^(provincestateregion|province|state|region)$/, "provinceStateRegion");
                type = type.replace(/^(nation|nationality)$/, "country");
                type = type.replace(/^(postalzipcode|postalcode|zipcode|postal|zip)$/, "postalZipCode");
                type = type.replace(/^(givenname|givennames|firstnames|names|firstname|first|name)$/, "givenName");
                type = type.replace(/^(familyname|familynames|lastnames|lastname|last|family)$/, "familyName");
                type = type.replace(/^(geolocation|geolocations|location|geo|gpscoordinates)$/, "geoLocation");
                type = type.replace(/^(time|dates|times)$/, "date");
                type = type.replace(/^(emailaddress|emailaddresses)$/, "email");
                type = type.replace(/^(passwords|key|keys)$/, "password");
                type = type.replace(/^(int|integers)$/, "integer");
            }
            type = type.replace(/^(num|numbers)$/, "number");
            type = type.replace(/^(bool|booleans)$/, "boolean");
            type = type.replace(/^(str|strings)$/, "string");
            type = type.replace(/^(all|other)$/, "any");
            if (type && type.match(VALID_TYPES))
                return type;
            else {
                if (basicTypeBool)
                    CACHE_ERROR.call(this, type, "customProperties can only be set to string, number, boolean, or any, not");
                else
                    CACHE_ERROR.call(this, type, "invalid data type");
                return "any";
            }
        }
        function DELETE_COLUMN(colName, storeBool, editTime, callback) {
            var db = DB[this.id];
            if (TABLE_IS_DELETED(db))
                return callback instanceof Function ? callback.call(this, false, "cannot delete " + colName + " column in deleted table") : false;
            var colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
            if (colIndex > 0) {
                var columns = db.columns.meta, col = db.columns.headers[colIndex], time = VALIDATE_EDIT_TIME.call(this, editTime, "column", "deleteColumn");
                for (var a = 0, len = db.table.length; a < len; a++) {
                    db.table[a].splice(colIndex, 1);
                    db.ids[db.table[a][0]].splice(colIndex, 1);
                }
                if (HIDDEN_TABLE_DATA[this.id]) {
                    for (var a = 0, len = HIDDEN_TABLE_DATA[this.id].length; a < len; a++) {
                        HIDDEN_TABLE_DATA[this.id][a].splice(colIndex, 1);
                        HIDDEN_IDS[this.id][HIDDEN_TABLE_DATA[this.id][a][0]].splice(colIndex, 1);
                    }
                }
                db.columns.headers.splice(colIndex, 1);
                columns[col] = {
                    type: columns[col].type,
                    timestamp: [columns[col].timestamp[0], time],
                    searchable: [false, time],
                    deleted: [true, time]
                };
                colIndex = null;
                DB[this.id].lastModified = time + DB[this.id].created > DB[this.id].lastModified ? time + DB[this.id].created : DB[this.id].lastModified;
                this.syncPending = true;
                TO_LOCAL_STORAGE.call(this, storeBool);
                if (callback instanceof Function)
                    return callback.call(this, true, ERRORS[this.id]);
                else
                    return true;
            }
            else
                return callback instanceof Function ? callback.call(this, false, colName + " column not found") : false;
        }
        function TIMESTAMP_COLUMN_PROP(val, editTime) {
            return IS_ARRAY(val) ? val : [val, editTime];
        }
        function VALIDATE_PROP_INITIAL_VALUE(value, columnType) {
            var obj = VALIDATE.call(this, value, columnType, "validate initialValue prop " + columnType);
            if (obj.valid && !obj.error)
                return obj.value;
            else
                return VALID_NUMBER_TYPES.test(columnType) ? 0 : VALID_STRING_TYPES.test(columnType) ? "" : false;
        }
        function VALIDATE_COLUMN_PROPS(props, editTime) {
            var ret;
            if (IS_STRING(props))
                ret = {
                    type: TIMESTAMP_COLUMN_PROP(VALIDATE_TYPE.call(this, props), editTime),
                    timestamp: [editTime, editTime]
                };
            else if (props && typeof props === "object") {
                ret = {
                    type: props.type ? TIMESTAMP_COLUMN_PROP(VALIDATE_TYPE.call(this, props.type), editTime) : ["any", editTime],
                    timestamp: [editTime, editTime]
                };
                if ("timestamp" in props && IS_ARRAY(props.timestamp)) {
                    props.timestamp[0] = VALIDATE_EDIT_TIME.call(this, props.timestamp[0], "column", "validateColProps");
                    props.timestamp[1] = VALIDATE_EDIT_TIME.call(this, props.timestamp[1], "column", "validateColProps");
                }
                if (props.searchable !== undefined) {
                    ret.searchable = TIMESTAMP_COLUMN_PROP(props.searchable, editTime);
                    ret.searchable[0] = ret.searchable[0];
                }
                if (props.deleted)
                    ret.deleted = TIMESTAMP_COLUMN_PROP(IS_ARRAY(props.deleted) ? props.deleted : true, editTime);
                if (props.formula) {
                    ret.formula = TIMESTAMP_COLUMN_PROP(props.formula, editTime);
                    ret.formula[0] = String(ret.formula[0]);
                }
                if (props.initialValue !== undefined) {
                    ret.initialValue = TIMESTAMP_COLUMN_PROP(props.initialValue, editTime);
                    ret.initialValue[0] = VALIDATE_PROP_INITIAL_VALUE.call(this, ret.initialValue[0], ret.type[0]);
                }
                if (props.exportAs) {
                    ret.exportAs = TIMESTAMP_COLUMN_PROP(props.exportAs, editTime);
                    ret.exportAs[0] = String(ret.exportAs[0]);
                }
            }
            else
                ret = {
                    type: ["any", editTime],
                    timestamp: [editTime, editTime]
                };
            return ret;
        }
        function APPLY_COLUMN_PROPERTIES(tableHeaders, columnProperties, tableCreated, doNotIndex) {
            function applyArray(uncheckedHeaders, headers, props) {
                for (var a = 1, len = uncheckedHeaders.length; a < len; a++) {
                    //if given tableHeader name contains a space or invalid character
                    if (!props[headers[a]]) {
                        var _badHeader = uncheckedHeaders[a];
                        props[headers[a]] = props[_badHeader];
                        delete props[_badHeader];
                    }
                    obj.meta[headers[a]] = props[headers[a]] ? props[headers[a]] : { type: ["any", time], timestamp: [time, time] };
                    if (!obj.meta[headers[a]].exportAs && headers[a] !== uncheckedHeaders[a])
                        obj.meta[headers[a]].exportAs = [String(uncheckedHeaders[a]), time];
                }
                setIndexable();
                return obj;
            }
            function applyObject(uncheckedHeaders, headers, props) {
                var b = 1;
                for (var a in uncheckedHeaders) {
                    if (a !== "id") {
                        if (!props[headers[b]] && props[a]) {
                            props[headers[b]] = props[a];
                            delete props[a];
                        }
                        props[headers[b]] = props[headers[b]] || VALIDATE_COLUMN_PROPS.call(this, uncheckedHeaders[a], time);
                        if (a !== headers[b] && !props[headers[b]].exportAs)
                            props[headers[b]].exportAs = [a, time];
                        b++;
                    }
                }
                for (var b_1 = 1, len = headers.length; b_1 < len; b_1++) {
                    obj.meta[headers[b_1]] = props[headers[b_1]] ? props[headers[b_1]] : { type: ["any", time], timestamp: [time, time] };
                }
                b = null;
                setIndexable();
                return obj;
            }
            function formatProperties(props) {
                var ret = {};
                if (!props) {
                    for (var a = 1, lenA = obj.headers.length; a < lenA; a++) {
                        ret[obj.headers[a]] = {
                            type: ["any", time],
                            timestamp: [time, time]
                        };
                    }
                }
                else if (IS_ARRAY(props)) {
                    for (var a = 0, lenA = props.length; a < lenA; a++) {
                        ret[obj.headers[a + 1]] = {
                            type: TIMESTAMP_COLUMN_PROP(VALIDATE_TYPE.call(this, props[a]), time),
                            timestamp: [time, time]
                        };
                    }
                }
                else if (typeof props === "object") {
                    for (var a in props) {
                        if (props.hasOwnProperty(a)) {
                            ret[a] = VALIDATE_COLUMN_PROPS.call(this, props[a], time);
                        }
                    }
                }
                return ret;
            }
            function setIndexable() {
                if (IS_ARRAY(doNotIndex)) {
                    for (var a = 0, len = doNotIndex.length; a < len; a++) {
                        doNotIndex[a] = TO_PROP_NAME(doNotIndex[a]);
                    }
                }
                else
                    doNotIndex = [];
                for (var a = 1, len = obj.headers.length; a < len; a++) {
                    if (doNotIndex.indexOf(obj.headers[a]) > -1)
                        obj.meta[obj.headers[a]].searchable = [false, time];
                }
            }
            var time = TIMESTAMP(tableCreated), props = columnProperties || {}, obj = {
                meta: {},
                headers: [],
            }, db = DB[this.id];
            if (TABLE_IS_DELETED(db))
                return obj;
            if (IS_ARRAY(tableHeaders)) {
                //tableHeaders is an array, so all data to apply comes from columnProperties
                if (tableHeaders[0] !== "id")
                    tableHeaders.unshift("id");
                obj.headers = CHECK_HEADERS_ARRAY(tableHeaders);
                props = formatProperties.call(this, props);
                return applyArray.call(this, tableHeaders, obj.headers, props);
            }
            else {
                obj.headers = ["id"];
                var b = 1;
                for (var a in tableHeaders) {
                    if (a !== "id")
                        obj.headers[b++] = CHECK_HEADER_VALUE(a, obj.headers);
                }
                props = formatProperties.call(this, props);
                return applyObject.call(this, tableHeaders, obj.headers, props);
            }
        }
        function ADD_COLUMN(colName, position, options, storeBool, editTime, callback) {
            function applyProps(table, cb) {
                if (colName !== orig)
                    opt.exportAs = [orig, validatedEditTime];
                cols[colName] = VALIDATE_COLUMN_PROPS.call(this, opt, validatedEditTime);
                return cb(table);
            }
            function updateTable(db) {
                var initialValue = cols[colName].initialValue !== undefined ? TIMESTAMP_COLUMN_PROP(cols[colName].initialValue, validatedEditTime)[0] : undefined;
                if (initialValue === undefined || initialValue !== undefined && !VALUE_IS_VALID.call(this, initialValue, cols[colName].type[0], true, "updateTable")) {
                    if (cols[colName].type[0] === "boolean")
                        initialValue = false;
                    else if (/number|integer|date|postalZipCode|longitude|latitude/i.test(cols[colName].type[0]))
                        initialValue = 0;
                    else if (/any|string|email|password|address|cityCounty|provinceStateRegion|country|name|geoLocation/i.test(cols[colName].type[0]))
                        initialValue = "";
                    else {
                        CACHE_ERROR.call(this, cols[colName].type.toString(), "initial value not found for data type");
                        initialValue = "";
                    }
                }
                //insert empty cell to every row in table
                for (var a = 0, len = db.table.length; a < len; a++) {
                    db.table[a].splice(position, 0, initialValue);
                    db.ids[db.table[a][0]].splice(position + 1, 0, validatedEditTime);
                }
                if (HIDDEN_TABLE_DATA[this.id]) {
                    for (var a = 0, len = HIDDEN_TABLE_DATA[this.id].length; a < len; a++) {
                        HIDDEN_TABLE_DATA[this.id][a].splice(position, 0, initialValue);
                        HIDDEN_IDS[this.id][HIDDEN_TABLE_DATA[this.id][a][0]].splice(position + 1, 0, validatedEditTime);
                    }
                }
                DB[this.id].lastModified = validatedEditTime + DB[this.id].created > DB[this.id].lastModified ? validatedEditTime + DB[this.id].created : DB[this.id].lastModified;
                this.syncPending = true;
                TO_LOCAL_STORAGE.call(this, storeBool);
                if (callback instanceof Function)
                    return callback.call(this, true, ERRORS[this.id]);
                else
                    return true;
            }
            var opt = options || {}, db = DB[this.id];
            if (TABLE_IS_DELETED(db) || opt.deleted !== undefined && TIMESTAMP_COLUMN_PROP(opt.deleted, 0)[0] === true) {
                if (callback instanceof Function)
                    return callback.call(this, false, "cannot add deleted column");
                else
                    return; //don't add deleted columns to table
            }
            var validatedEditTime = VALIDATE_EDIT_TIME.call(this, editTime, "column", "addColumn"), orig = String(colName), i = 1, cols = db.columns.meta, headers = db.columns.headers;
            colName = TO_PROP_NAME(colName);
            if (colName === "id")
                colName = "_id";
            //check if column already existes
            while (GET_INDEX_OF_COLUMN.call(this, colName) > -1) {
                colName = TO_PROP_NAME(orig.replace(/_\d$/, "")) + "_" + i;
                i++;
            }
            //insert colName to headers
            position = position && position > 0 && position < headers.length ? position : headers.length;
            headers.splice(position, 0, colName);
            //add column properties
            return applyProps.call(this, db, updateTable.bind(this));
        }
        function GET_COL_PROP(colName, propName) {
            if (TABLE_IS_DELETED(DB[this.id]))
                return undefined;
            var colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
            if (colIndex > 0) {
                var prop = DB[this.id].columns.meta[DB[this.id].columns.headers[colIndex]][propName];
                return prop ? prop[0] : undefined;
            }
            else
                return undefined;
        }
        function SET_TYPE(colName, type, data, storeBool, editTime, callback) {
            function retError(err) {
                if (data)
                    CACHE_ERROR.call(this, err);
                if (callback instanceof Function)
                    return callback.call(this, returnData, err);
            }
            function retSuccess(a, b) {
                DB[this.id].columns.meta[colName].timestamp[1] = editTime;
                TO_LOCAL_STORAGE.call(this, storeBool);
                if (callback instanceof Function)
                    return callback.call(this, a, b);
            }
            function checkRows(rowId, i) {
                if (data) {
                    var value = data[colName][rowId] || DB[this.id].table[i][colIndex];
                    if (!VALUE_IS_VALID.call(this, value, type, true, "checkRows")) {
                        if (type.match(VALID_STRING_TYPES)) {
                            value = String(value);
                        }
                        else if (type.match(VALID_NUMBER_TYPES) && IS_NUMERIC(value)) {
                            value = value * 1;
                        }
                        if (!VALUE_IS_VALID.call(this, value, type, true, "checkRows2")) {
                            returnData[colName][rowId] = DB[this.id].table[i][colIndex];
                            can_do = false;
                        }
                        else
                            data[colName][rowId] = value;
                    }
                }
            }
            function setType() {
                if (can_do)
                    DB[this.id].columns.meta[colName].type = [VALIDATE_TYPE.call(this, type), editTime];
            }
            function applyData(rowId, i, total) {
                if (data && can_do && data[colName][rowId]) {
                    SET_VAL.call(this, rowId, colName, data[colName][rowId], i === total, editTime);
                    delete data[colName][rowId];
                }
            }
            function checkSuccess(a, b, c, d) {
                if (data)
                    for (var id in data[colName]) {
                        if (data[colName].hasOwnProperty(id))
                            return retError.call(this, "data provided doesn't match table");
                    }
                if (can_do) {
                    return retSuccess.call(this, can_do, b);
                }
                else
                    return retError.call(this, "cannot apply type to this row, please update data and try again");
            }
            if (TABLE_IS_DELETED(DB[this.id]))
                return retError.call(this, "cannot set type on deleted table");
            var colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
            if (colIndex === -1)
                return retError.call(this, "column does not exist in the table");
            this.unhideRows(); //TODO iterate through hidden rows without unhiding them(?)
            type = VALIDATE_TYPE.call(this, type);
            colName = TO_PROP_NAME(colName);
            editTime = editTime ? VALIDATE_EDIT_TIME.call(this, editTime, "column", "set type") : TIMESTAMP(DB[this.id].created);
            var can_do = true, returnData = {};
            returnData[colName] = {};
            if (!data) {
                data = {};
                data[colName] = {};
            }
            return this.forEachRow.call(this, checkRows.bind(this), setType.bind(this)).forEachRow.call(this, applyData.bind(this), checkSuccess.bind(this));
            //TODO if no type conflics found and most current, apply data and update type
        }
        function MOVE_COLUMN(colName, position, storeBool) {
            //TODO
            TO_LOCAL_STORAGE.call(this, storeBool);
        }
        function SET_COLUMN_PROP(colName, propName, propValue, storeBool, editTime) {
            function setBoolean(value) {
                if (value === "false" || value === 0)
                    value = false;
                return value ? true : false;
            }
            editTime = editTime ? VALIDATE_EDIT_TIME.call(this, editTime, "column", "set column prop") : TIMESTAMP(DB[this.id].created);
            var db = DB[this.id];
            if (TABLE_IS_DELETED(db))
                return undefined;
            if (propName === "exportAs") {
                propValue = this.renameColumn(colName, propValue);
            }
            else if (propName === "formula") {
                propValue = "formulas not complete";
                //TODO
            }
            else if (propName === "searchable") {
                propValue = setBoolean(propValue);
                db.columns.meta[colName][propName] = TIMESTAMP_COLUMN_PROP(propValue, editTime);
            }
            else if (propName === "initialValue") {
                propValue = VALIDATE_PROP_INITIAL_VALUE.call(this, propValue, db.columns.meta[colName].type[0]);
                db.columns.meta[colName][propName] = TIMESTAMP_COLUMN_PROP(propValue, editTime);
            }
            else {
                CACHE_ERROR.call(this, propName, "unknown column property not being synced");
                return undefined;
            }
            db.columns.meta[colName].timestamp[1] = editTime;
            TO_LOCAL_STORAGE.call(this, storeBool);
            return propValue;
        }
        /**
         * Initialise a new instance of NyckelDB
         * @constructs NyckelDB
         * @param {string} tableTitle the name of the new database
         */
        var NyckelDBObj = /** @class */ (function () {
            function NyckelDBObj(tableTitle) {
                tableTitle = tableTitle || "";
                NUM = NUM || 0;
                DB = DB || new Array(Math.pow(2, 32) - 1);
                DBS = DBS || [];
                DBX_SYNC_OBJ = DBX_SYNC_OBJ || {};
                SEARCH_INDEX = SEARCH_INDEX || [];
                SEARCH_SUGGESTIONS = SEARCH_SUGGESTIONS || [];
                RECENTLY_SEARCHED = RECENTLY_SEARCHED || [];
                COL_NAMES_INDEXED = COL_NAMES_INDEXED || [];
                BUILDING_SEARCH_INDEX = BUILDING_SEARCH_INDEX || [];
                BUILDING_SEARCH_INDEX_QUEUE = BUILDING_SEARCH_INDEX_QUEUE || [];
                ROW_INDEX_CACHE = ROW_INDEX_CACHE || [];
                ERRORS = ERRORS || [];
                HIDDEN_TABLE_DATA = HIDDEN_TABLE_DATA || [];
                HIDDEN_IDS = HIDDEN_IDS || [];
                this.syncPending = true;
                this.version = THIS_VERSION;
                //declare private DB object and unique this.id for every new instance of NyckelBDObj()
                this.id = base64_2.default.number_hash(tableTitle + base64_2.default.rand(), 12);
                SEARCH_INDEX[this.id] = {};
                SEARCH_SUGGESTIONS[this.id] = [];
                RECENTLY_SEARCHED[this.id] = [];
                ROW_INDEX_CACHE[this.id] = {};
                DB[this.id] = {
                    "title": tableTitle,
                    "created": 0,
                    "deleted": false,
                    "lastModified": 0,
                    "version": this.version + "_" + base64_2.default.Version,
                    "columns": {
                        "meta": {},
                        "headers": [],
                    },
                    "ids": {},
                    "table": [],
                    "properties": {}
                };
            }
            /**
             * Add a new column to the table
             * @function addColumn
             * @param {string} colName new column name
             * @param {number} position insert new column before column number, ie 1 adds it before the 1st column. If 0 or not specified, adds to end of table
             * @param {object} [options] an Object of column properties: {
             *	type: String,
             *	initialValue: the initial value for every new cell in the new column,
             *	formula: String,
             *	searchable: Boolean whether to index column for searches
             * }
             * @param {successCallback} [callback] callback function
             * @since 0.4
             */
            NyckelDBObj.prototype.addColumn = function (colName, position, options, callback) {
                return ADD_COLUMN.call(this, colName, position, options, true, undefined, callback);
            };
            ;
            /**
             * Add a new row to the table.
             * @function addRow
             * @param {array} array a complete array, or a JSON object in form {[colName]: {value: [value]},..}
             * @param {string} [id] id is optional and will only be used if it doesn't already exist
             * @param {addRowCallback} [callback] if row is a JSON object, the new row id is passed back only through a callback function
             * @returns {string} new row id
             */
            NyckelDBObj.prototype.addRow = function (array, id, callback) {
                if (array && !IS_ARRAY(array) && typeof array === "object") {
                    //convert object to array
                    var _array = [], a = 0;
                    this.forEachCol.call(this, function (col) {
                        if (array[col] && array[col].value)
                            _array[a] = array[col].value;
                        a++;
                    }, function () {
                        var id = ADD_ROW.call(this, _array, id, true, undefined, callback);
                    }.bind(this));
                }
                else
                    return ADD_ROW.call(this, array, id, true, undefined, callback);
            };
            ;
            /**
             * Same as search, but accepts join (+) and filter (-) between search terms to create more specific queries
             *      Possible future deprication and merge functionality into search
             * @function advancedSearch
             * @param {string} searchQuery words to search for in the database
             * @param {object} [options] {
             *	"colNames": Array, an Array of columns to search in
             *	"fuzzyMatch": Boolean
             * }
             * @param {searchCallback} [callback] callback function
             */
            NyckelDBObj.prototype.advancedSearch = function (searchQuery, options, callback) {
                function filter(ids, filterOutQueries) {
                    if (filterOutQueries.length === 0) {
                        return callback instanceof Function ? callback.call(this, ids, ERRORS[this.id]) : undefined;
                    }
                    var _loop_2 = function (b_2, lenB) {
                        (function (self, b) {
                            self.search.call(self, filterOutQueries[b], options, function (result, err) {
                                if (!err)
                                    filterIds = filterIds.concat(result);
                                else
                                    return callback instanceof Function ? callback.call(self, [], err) : undefined;
                                if (b === lenB - 1) {
                                    filterIds = DELETE_DUPLICATES(filterIds);
                                    if (filterIds.length > 0) {
                                        for (var c = 0, lenC = filterIds.length, t = "", d = void 0, lenD = void 0; c < lenC; c++) {
                                            t = String(filterIds[c]);
                                            for (d = 0, lenD = ids.length; d < lenD; d++) {
                                                if (t === String(ids[d])) {
                                                    ids.splice(d, 1);
                                                    d--;
                                                    lenD--;
                                                }
                                            }
                                        }
                                    }
                                    return callback instanceof Function ? callback.call(self, ids, ERRORS[self.id]) : undefined;
                                }
                            });
                        })(this_2, b_2);
                    };
                    var this_2 = this;
                    for (var b_2 = 0, lenB = filterOutQueries.length; b_2 < lenB; b_2++) {
                        _loop_2(b_2, lenB);
                    }
                }
                if (!searchQuery)
                    return callback instanceof Function ? callback.call(this, [], "no query supplied") : undefined;
                var ids = [], filterIds = [], filterOutQueries = [], searchQueryArr = [];
                if (/\s\+|\s\-/.test(searchQuery)) {
                    searchQueryArr = searchQuery.split(" +");
                    for (var a = 0; a < searchQueryArr.length; a++) {
                        if (/\s\-/.test(searchQueryArr[a])) {
                            var f = searchQueryArr[a].split(" -");
                            searchQueryArr[a] = f.shift();
                            filterOutQueries.push.apply(filterOutQueries, f);
                        }
                    }
                }
                else
                    searchQueryArr = [searchQuery];
                var b = 0;
                var _loop_1 = function (a, len) {
                    (function (self, a) {
                        self.search.call(self, searchQueryArr[a], options, function (result, errors) {
                            b++;
                            if (!errors)
                                ids = ids.concat(result);
                            else
                                return callback instanceof Function ? callback.call(self, [], errors) : undefined;
                            if (b >= len - 1) {
                                ids = DELETE_DUPLICATES(ids);
                                filter.call(self, ids, filterOutQueries);
                            }
                        });
                    })(this_1, a);
                };
                var this_1 = this;
                for (var a = 0, len = searchQueryArr.length; a < len; a++) {
                    _loop_1(a, len);
                }
            };
            ;
            /**
             * Delete a column from the table
             * @function deleteColumn
             * @param {string} colName the name of the column to delete
             * @param {function} [callback] callback
             * @returns {boolean} success
             * @since 0.4
             */
            NyckelDBObj.prototype.deleteColumn = function (colName, callback) {
                return DELETE_COLUMN.call(this, colName, true, undefined, callback);
            };
            ;
            /**
             * Delete a row along with all the data that it contains
             * @function deleteRow
             * @param {string|number} rowId the row's id, or its current index
             * @returns {boolean} success
             */
            NyckelDBObj.prototype.deleteRow = function (rowId) {
                return DELETE_ROW.call(this, rowId, true);
            };
            ;
            /**
             * Delete a table along with all the data that it contains, including custom properties
             * @function deleteTable
             * @param {function} [callback] callback function
             * @returns {object} this
             */
            NyckelDBObj.prototype.deleteTable = function (callback) {
                return DELETE_TABLE.call(this, callback, undefined, true);
            };
            ;
            /**
             * Hide all rows who's value in a specific column don't match the given regular expression
             * @function filter
             * @param {string} colName is the column name from the table header
             * @param {regExp} regExp the regular expression to match
             * @returns {object} this
             */
            NyckelDBObj.prototype.filter = function (colName, regExp) {
                if (this.getLength() > 0) {
                    var colIndex = GET_INDEX_OF_COLUMN.call(this, colName), val;
                    if (colIndex > 0) {
                        for (var a = 0, arrLen = DB[this.id].table.length; a < arrLen; a++) {
                            val = String(DB[this.id].table[a][colIndex]);
                            if (!val.match(regExp)) {
                                this.hideRow(a);
                                a--;
                                arrLen--;
                            }
                        }
                        a = null;
                        arrLen = null;
                    }
                    colIndex = null;
                    val = null;
                }
                return this;
            };
            ;
            /**
             * Iterate through all columns in a table. Passes the column name to funct in sequence and executes funct
             * @function forEachCol
             * @param {eachColCallback} funct the function to execute for each column in the table
             * @param {successCallback} [callback] callback function to execute after everything is finished
             * @returns {object} this
             */
            NyckelDBObj.prototype.forEachCol = function (funct, callback) {
                if (TABLE_IS_DELETED(DB[this.id]))
                    return callback instanceof Function ? (callback.call(this, false, "forEach table is deleted"), this) : this;
                if (funct instanceof Function) {
                    for (var a = 1, headers = DB[this.id].columns.headers, len = headers.length; a < len; a++) {
                        funct.call(this, headers[a], a - 1, len - 1);
                    }
                    return callback instanceof Function ? (callback.call(this, true, ERRORS[this.id]), this) : this;
                }
                else
                    return callback instanceof Function ? (callback.call(this, false, "forEach requires a function"), this) : this;
            };
            ;
            /**
             * Iterate through all (unhidden) rows in a table (in the current sorted order). Passes row ids to funct in sequence and executes funct
             * @function forEachRow
             * @param {eachRowCallback} funct the function to execute for each row in the table, parameters: rowId, rowIndex, tableLength
             * @param {successCallback} [callback] callback function to execute when everything is finished
             * @returns {object} this
             */
            NyckelDBObj.prototype.forEachRow = function (funct, callback) {
                if (TABLE_IS_DELETED(DB[this.id]))
                    return callback instanceof Function ? (callback.call(this, false, "forEach table is deleted"), this) : this;
                if (funct instanceof Function) {
                    for (var a = 0, len = this.getLength(); a < len; a++) {
                        funct.call(this, DB[this.id].table[a][0], a, len);
                    }
                    return callback instanceof Function ? (callback.call(this, true, ERRORS[this.id]), this) : this;
                }
                else
                    return callback instanceof Function ? (callback.call(this, false, "forEach requires a function"), this) : this;
            };
            ;
            /**
            * Get the row header names as an Array
            * @function getHeaders
            * @param {getHeadersCallback} [callback] callback
            * @returns {string[]} header names
            */
            NyckelDBObj.prototype.getHeaders = function (callback) {
                var ret = [];
                if (this.isDeleted())
                    return ret;
                for (var a = 1, headers = DB[this.id].columns.headers, len = headers.length; a < len; a++) {
                    ret[a - 1] = headers[a];
                }
                return callback instanceof Function ? (callback.call(this, ret, false), ret) : ret;
            };
            ;
            /**
             * Get a row's current position in the table. You can supply either a row id, or else both a value and colName to find the first row that contains that value in the given column.
             * @function getIndexOf
             * @param {string} [id] row id
             * @param {string|number|boolean} [orValue] cell value
             * @param {string} [colName] is the column name from the table header
             * @returns {number} zero based index of a row's current position in the table, -1 if not found
             */
            NyckelDBObj.prototype.getIndexOf = function (id, orValue, colName) {
                if (TABLE_IS_DELETED(DB[this.id]))
                    return -1;
                else if (id) {
                    return GET_INDEX_OF_ROW.call(this, id);
                }
                else if (orValue && colName) {
                    var colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
                    if (colIndex > 0) {
                        for (var a = 0, arrLen = DB[this.id].table.length; a < arrLen; a++) {
                            if (orValue === DB[this.id].table[a][colIndex]) {
                                return a;
                            }
                        }
                        return -1;
                    }
                    else
                        return -1;
                }
                else
                    return -1;
            };
            ;
            /**
             * Get the timestamp of when the table was most recently changed
             * @function getLastModified
             * @return {number} database modified timestamp
             */
            NyckelDBObj.prototype.getLastModified = function () {
                return DB[this.id].lastModified;
            };
            ;
            /**
             * Get the number of (unhidden, unfiltered) rows in the table
             * @function getLength
             * @returns {number} the number of rows in the table
             */
            NyckelDBObj.prototype.getLength = function () {
                return !DB[this.id] || TABLE_IS_DELETED(DB[this.id]) ? 0 : DB[this.id].table.length;
            };
            ;
            /**
             * Get the value of a table custom property
             * @function getProp
             * @param {string} propName the name of the custom property
             * @returns {string | number | boolean | undefined} the property value
             */
            NyckelDBObj.prototype.getProp = function (propName) {
                propName = TO_PROP_NAME(propName);
                if (DB[this.id].properties) {
                    return DB[this.id].properties[propName] ? DB[this.id].properties[propName][0] : undefined;
                }
                else
                    return undefined;
            };
            ;
            /**
             * Get an entire row from the table as JSON arranged by column name. Returns column name, column type and value
             * @function getRow
             * @param {string|number} rowId the row's id, or its current index
             * @param {getRowCallback} [callback] callback
             * @returns {object | undefined} json formatted data, or undefined if nothing found
             */
            NyckelDBObj.prototype.getRow = function (rowId, callback) {
                var rowIndex = GET_INDEX_OF_ROW.call(this, rowId), ret = {};
                if (rowIndex > -1) {
                    this.forEachCol(function (colName, is) {
                        ret[colName] = {
                            column: colName,
                            type: DB[this.id].columns.meta[colName].type[0],
                            value: DB[this.id].table[rowIndex][is + 1]
                        };
                        if (DB[this.id].columns.meta[colName].exportAs)
                            ret[colName].column = DB[this.id].columns.meta[colName].exportAs[0];
                    }.bind(this), function (success, errors) {
                        return callback instanceof Function ? callback.call(this, ret, errors) : ret;
                    });
                }
                else
                    return callback instanceof Function ? callback.call(this, undefined, "row id not found") : undefined;
            };
            ;
            /**
            * Get an blank row from the table as JSON arranged by column name
            * @function getRowTemplate
            * @param {getRowTemplateCallback} callback callback
            */
            NyckelDBObj.prototype.getRowTemplate = function (callback) {
                var ret = {};
                if (this.isDeleted())
                    return;
                this.forEachCol(function (colName) {
                    ret[colName] = {
                        column: colName,
                        type: DB[this.id].columns.meta[colName].type[0]
                    };
                    if (DB[this.id].columns.meta[colName].exportAs) {
                        ret[colName].column = DB[this.id].columns.meta[colName].exportAs[0];
                    }
                }.bind(this), function (success, errors) {
                    return callback instanceof Function ? callback.call(this, ret, errors) : ret;
                });
            };
            ;
            /**
             * Get search suggestions from partial words, for example, as you type in a search box
             * @function getSearchSuggestions
             * @param {string} searchQuery partial search query
             * @param {object} [options] {
             *	"colNames": Array, an Array of columns to search in
             * }
             * @param {searchCallback} [callback] callback function
             * @returns {array} an Array of search queries that would return a match
             */
            NyckelDBObj.prototype.getSearchSuggestions = function (searchQuery, options, callback) {
                function buildSuggestionsList() {
                    searchQuery = String(searchQuery).split(" ");
                    var last = searchQuery.pop(), suggest = [], a = 0, prefix = last.charAt(0);
                    prefix = prefix.match(/\+|\-/) ? prefix : "";
                    last = SEARCH_VALIDATE(last)[0];
                    if (last) {
                        var matchesThis = new RegExp("^" + last);
                        searchQuery = searchQuery.join(" ");
                        for (var b = 0, len = SEARCH_SUGGESTIONS[this.id].length; b < len; b++) {
                            if (SEARCH_SUGGESTIONS[this.id][b].match(matchesThis)) {
                                if (SEARCH_SUGGESTIONS[this.id][b] === last) { //found exact match, suggest at top of list
                                    suggest.unshift(searchQuery === "" ? prefix + last : searchQuery + " " + prefix + last);
                                    suggest[0] = TRIM(suggest[0].replace(/[^0-9a-z\s\+\-]/g, ""));
                                }
                                else {
                                    suggest[a] = searchQuery === "" ? prefix + SEARCH_SUGGESTIONS[this.id][b] : searchQuery + " " + prefix + SEARCH_SUGGESTIONS[this.id][b];
                                    suggest[a] = TRIM(suggest[a].replace(/[^0-9a-z\s\+\-]/g, ""));
                                }
                                a++;
                            }
                        }
                        for (var c = 0, lenC = RECENTLY_SEARCHED[this.id].length, i = void 0, item = void 0; c < lenC; c++) {
                            i = suggest.indexOf(RECENTLY_SEARCHED[this.id][c]);
                            if (i !== -1) {
                                item = suggest.splice(i, 1)[0];
                                suggest.unshift(item);
                            }
                        }
                    }
                    last = null;
                    a = null;
                    searchQuery = null;
                    return callback instanceof Function ? (callback.call(this, suggest, ERRORS[this.id]), suggest) : suggest;
                }
                if (SEARCH_SUGGESTIONS[this.id].length > 0) {
                    return buildSuggestionsList.call(this);
                }
                else {
                    var cols = options.colNames ? options.colNames.join("|").split("|") : undefined;
                    if (callback instanceof Function)
                        callback.call(this, [], "currently busy building search index");
                    BUILD_SEARCH_INDEX.call(this, cols);
                    return [];
                }
            };
            ;
            /**
             * Get the title of the table
             * @function getTitle
             * @returns {string | undefined } table title
             */
            NyckelDBObj.prototype.getTitle = function () { return DB[this.id] ? DB[this.id].title : undefined; };
            ;
            /**
             * Get the 'type' that has been set on a particular column
             * @function getType
             * @param {string} colName the name of the column
             * @return {string} a column type
             */
            NyckelDBObj.prototype.getType = function (colName) {
                return GET_COL_PROP.call(this, colName, "type");
            };
            ;
            /**
             * Get the value of a cell
             * @function getVal
             * @param {number | string} rowId can be the index of the row, or it's 3 digit identifier
             * @param {string} colName is the column name from the table header
             * @returns {string | number | boolean | undefined} table cell value
             */
            NyckelDBObj.prototype.getVal = function (rowId, colName) {
                var rowIndex = GET_INDEX_OF_ROW.call(this, rowId), colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
                if (rowIndex > -1 && colIndex > 0)
                    return DB[this.id].table[rowIndex][colIndex];
                else
                    return undefined;
            };
            ;
            /**
             * Get a number of cell values from the table at once
             * @function getVals
             * @param {string[] | number[]} rowIds can be an Array of the index of the row, or it's 3 digit identifier
             * @param {string[]} colNames is an Array the column names from the table header
             * @param {getValsCallback} [callback] callback function
             * @returns {array | false} 2d array of table values, or false if nothing found
             */
            NyckelDBObj.prototype.getVals = function (rowIds, colNames, callback) {
                if (!rowIds || rowIds.constructor !== Array || !colNames || colNames.constructor !== Array) {
                    return callback instanceof Function ? callback.call(this, false, "invalid inputs") : false;
                }
                var ret = [];
                for (var a = 0, x = 0, b = void 0, y = void 0, rowIndex = void 0, colIndex = void 0, len = rowIds.length, lenB = colNames.length; a < len; a++) {
                    rowIndex = GET_INDEX_OF_ROW.call(this, rowIds[a]);
                    if (rowIndex > -1) {
                        ret[x] = [rowIds[a]];
                        for (b = 0, y = 1; b < lenB; b++) {
                            colIndex = GET_INDEX_OF_COLUMN.call(this, colNames[b]);
                            if (colIndex > 0) {
                                ret[x][y] = DB[this.id].table[rowIndex][colIndex];
                                y++;
                            }
                            else if (!COL_NAME_IS_VALID.call(this, colNames[b])) {
                                return callback instanceof Function ? callback.call(this, false, colNames[b] + " is not a valid colName") : false;
                            }
                        }
                        x++;
                    }
                    else if (!ROW_ID_IS_VALID.call(this, rowIds[a])) {
                        return callback instanceof Function ? callback.call(this, false, rowIds[a] + " (" + typeof rowIds[a] + ") is not a valid rowId") : false;
                    }
                }
                return callback instanceof Function ? callback.call(this, ret, ERRORS[this.id]) : ret;
            };
            ;
            /**
             * Hide a row. The row will not be accessible at all until you call unHideRows.
             * @function hideRow
             * @param {number | string} rowId can be the index of the row, or it's 3 digit identifier
             * @returns {object} this
             */
            NyckelDBObj.prototype.hideRow = function (rowId) {
                if (!TABLE_IS_DELETED(DB[this.id])) {
                    var index = GET_INDEX_OF_ROW.call(this, rowId);
                    if (index > -1) {
                        var row = DB[this.id].table[index];
                        HIDDEN_IDS[this.id] = HIDDEN_IDS[this.id] || {};
                        HIDDEN_IDS[this.id][row[0]] = JSON.parse(JSON.stringify(DB[this.id].ids[row[0]]));
                        delete DB[this.id].ids[row[0]];
                        HIDDEN_TABLE_DATA[this.id] = HIDDEN_TABLE_DATA[this.id] || [];
                        HIDDEN_TABLE_DATA[this.id].push(DB[this.id].table.splice(index, 1)[0]);
                        ROW_INDEX_CACHE[this.id] = {};
                    }
                    index = null;
                }
                return this;
            };
            ;
            /**
             * Merge two copys of the same NyckelDB table (same title, column headers and column types) into one
             * @function importJSON
             * @param {json} json an exported NyckelDB object
             * @param {string} syncKey the key used to obfuscate the data
             * @param {successCallback} [callback] callback function
             */
            NyckelDBObj.prototype.importJSON = function (json, syncKey, callback) {
                return IMPORT_JSON.call(this, json, callback.bind(this), syncKey, false);
            };
            ;
            //columnProperties could be an Array ["string","number"...] or
            //an Object like this {Column_1: "string", Column_2: "number"...} or
            //an Object like this {Column_1:{type: "string"...}, Column_2:{type: "number"...}...} or
            //an Object like this {Column_1:{type: ["string", 9646483]...}, Column_2:{type: ["number", 9683627]...}...}
            /**
             * Initiate the database. Required to call this right after creating a new NyckelDB obj. Sets initial values, checks for cached data and builds the search index
             * @param {string[] | object} tableHeaders an array of the names of all of the columns, or an object containing column header names and properties
             * @param {string[] | object} [columnProperties] optional, if not specified in with tableHeaders, as an array if just types, or an object if also other column properties
             * @param {object} [options] {
             *	customProperties: {
             *	  <property1Name>: {
             *	    initialValue: <value>,
             *	    type: "String", "Boolean" or "Number" <String>
             *	  },
             *	  <property2Name>...
             *	},
             *	doNotIndex: <Array of tableHeaders>, any columns that do not need to ever be search indexed. Can speed up load times
             *	initialIndex: <Array of tableHeaders>, columns to be search indexed on load. Specifying this value can speed up load times
             *	key: <string>,
             * 	importData: <json>, table data that is ready to drop in to the database without parsing
             *	importJSON: <json>, json data that needs to be parsed
             *	importCSV: <string>, CSV data that needs to be converted to JSON and then parsed
             * }
             * @param {successCallback} [callback]
             */
            NyckelDBObj.prototype.init = function (tableHeaders, columnProperties, options, callback) {
                function validateData() {
                    var db = DB[this.id];
                    if (!TABLE_IS_DELETED(db)) {
                        var columns = db.columns.meta;
                        if (columns) {
                            for (var a = 1, headers = db.columns.headers, len = headers.length, colProp = void 0; a < len; a++) {
                                for (colProp in columns[headers[a]]) {
                                    if (columns[headers[a]].hasOwnProperty(colProp)) {
                                        columns[headers[a]][colProp][1] = VALIDATE_EDIT_TIME.call(this, columns[headers[a]][colProp][1], "column", "didn't get cached table");
                                    }
                                }
                            }
                        }
                        //validate ids
                        for (var id in db.ids) {
                            if (db.ids.hasOwnProperty(id)) {
                                for (var a = 0; a < db.ids[id].length; a++) {
                                    db.ids[id][a] = VALIDATE_EDIT_TIME.call(this, db.ids[id][a], a === 0 ? "row" : "cell", "validating ids", id);
                                }
                            }
                        }
                        for (var prop in db.properties) {
                            if (db.properties.hasOwnProperty(prop)) {
                                db.properties[prop][1] = VALIDATE_EDIT_TIME.call(this, db.properties[prop][1], "property", "didn't get cached table");
                            }
                        }
                    }
                }
                function applyData(json) {
                    function setColumns(json) {
                        if (json) {
                            return json.columns ? APPLY_COLUMN_PROPERTIES.call(this, tableHeaders, json.columns.meta, json.created, opt.doNotIndex) :
                                APPLY_COLUMN_PROPERTIES.call(this, tableHeaders, columnProperties, TIMESTAMP(), opt.doNotIndex);
                        }
                        else
                            return APPLY_COLUMN_PROPERTIES.call(this, tableHeaders, columnProperties, TIMESTAMP(), opt.doNotIndex);
                    }
                    if (json && TABLE_IS_DELETED(json)) {
                        return {
                            "title": DB[this.id].title,
                            "created": json.created || TIMESTAMP(),
                            "lastModified": json.lastModified || TIMESTAMP(),
                            "deleted": true,
                            "version": this.version + "_" + base64_2.default.Version
                        };
                    }
                    else {
                        return {
                            "title": DB[this.id].title,
                            "created": json && json.created !== undefined ? json.created : TIMESTAMP(),
                            "lastModified": json && json.lastModified !== undefined ? json.lastModified : 0,
                            "deleted": false,
                            "version": this.version + "_" + base64_2.default.Version,
                            "ids": json && json.ids ? json.ids : {},
                            "columns": setColumns.call(this, json),
                            "table": json && json.table ? json.table : [],
                            "properties": json && json.properties ? json.properties : properties
                        };
                    }
                }
                function decompress(data, key) {
                    return JSON.parse(base64_2.default.read(data, key));
                }
                function applyCustomProperties(props) {
                    function setInitialValue(type) {
                        return type === "string" ? "" : type === "boolean" ? false : 0;
                    }
                    if (!props)
                        return {};
                    var _props = {};
                    if (IS_ARRAY(props)) {
                        for (var a = 0, len = props.length; a < len; a++) {
                            _props[TO_PROP_NAME(props[a])] = [0, 0, "any"];
                        }
                        return _props;
                    }
                    else if (typeof props !== "object") {
                        CACHE_ERROR.call(this, "Please supply properties in proper format");
                        return {};
                    }
                    var _type = "any", _initialValue = 0, propName, propValue;
                    for (var prop in props) {
                        if (props.hasOwnProperty(prop)) {
                            propName = TO_PROP_NAME(prop);
                            propValue = props[prop];
                            if (typeof propValue === "string") {
                                _type = VALIDATE_BASIC_TYPE.call(this, propValue);
                                _initialValue = setInitialValue(_type);
                                _props[propName] = [_initialValue, 0, _type];
                            }
                            else if (IS_ARRAY(propValue) && propValue.length === 3) {
                                var propArr = propValue;
                                _type = VALIDATE_BASIC_TYPE.call(this, propArr[2]);
                                if (VALUE_IS_VALID.call(this, propArr[0], _type, false, "applyCustomProperties"))
                                    _props[propName] = [propArr[0], propArr[1], _type];
                                propArr = null;
                            }
                            else if (!IS_ARRAY(propValue) && typeof propValue === "object") {
                                if (propValue.type) {
                                    _props[propName] = [0, 0, VALIDATE_BASIC_TYPE.call(this, propValue.type)];
                                }
                                else
                                    _props[propName] = [0, 0, "any"];
                                if (propValue.initialValue !== undefined && VALUE_IS_VALID.call(this, propValue.initialValue, _props[propName][2], false, "applyCustomProperties2")) {
                                    _props[propName][0] = propValue.initialValue;
                                }
                                else {
                                    _type = _props[propName][2];
                                    _initialValue = setInitialValue(_type);
                                    _props[propName][0] = _initialValue;
                                }
                            }
                            else
                                CACHE_ERROR.call(this, prop, "invalid customProperty");
                        }
                    }
                    _type = null;
                    _initialValue = null;
                    propName = null;
                    return _props;
                }
                function initiateTable(options) {
                    if (options && options.importData && options.importData.properties)
                        options.importData.properties = applyCustomProperties.call(this, options.importData.properties);
                    else if (options && options.customProperties)
                        properties = applyCustomProperties.call(this, options.customProperties);
                    //try to get cached table
                    if (storage_1.default)
                        storage_1.default.getItem(DB[this.id].title, null, gotCachedTable.bind(this), didntGetCachedTable.bind(this));
                    else
                        return callback instanceof Function ? callback.call(this, false, "localStorage not found", false) : "localStorage not found";
                }
                function gotCachedTable(json) {
                    if (!json) {
                        didntGetCachedTable.call(this);
                        return;
                    }
                    if (typeof json === "string")
                        json = JSON.parse(json);
                    if (!json.title || json.title !== DB[this.id].title || !json.version || json.created === undefined) {
                        didntGetCachedTable.call(this);
                        return;
                    }
                    var version = String(json.version).split("_");
                    if (String(version[0]) !== String(this.version) && COMPATIBLE_VERSIONS.indexOf(String(version[0])) === -1) {
                        console.log("versions do not match", String(version[0]), String(this.version));
                        didntGetCachedTable.call(this);
                        return;
                    }
                    if ("data" in json) {
                        if (String(version[1]) === String(base64_2.default.Version) && base64_2.default.hmac(json.data, opt.key) === json.signature) {
                            json = base64_2.default.read(json.data, opt.key);
                            return IMPORT_JSON.call(this, json, callback.bind(this), false, true);
                        }
                        else {
                            console.log("compressed data is corrupted");
                            didntGetCachedTable.call(this);
                            return;
                        }
                    }
                    else { //loading directly from local storage
                        DB[this.id] = applyData.call(this, json);
                        validateData.call(this);
                        BUILD_SEARCH_INDEX.call(this, opt.initialIndex);
                        return callback instanceof Function ? (callback.call(this, true, ERRORS[this.id]), this) : this;
                    }
                }
                function didntGetCachedTable() {
                    //creating a brand new table
                    DB[this.id] = applyData.call(this, opt.importData);
                    validateData.call(this);
                    if (opt.importJSON)
                        return IMPORT_JSON.call(this, opt.importJSON, callback.bind(this), opt.key || false, false);
                    else {
                        TO_LOCAL_STORAGE.call(this, true);
                        return callback instanceof Function ? (callback.call(this, true, ERRORS[this.id]), this) : this;
                    }
                }
                var opt = options ? JSON.parse(JSON.stringify(options)) : {};
                var properties = {};
                if (typeof opt.importData === "string")
                    opt.importData = JSON.parse(opt.importData);
                if (opt.importData && (opt.importData.lastModified < opt.importData.created && opt.importData.lastModified !== 0 || opt.importData.lastModified > TIMESTAMP())) {
                    console.log("importData modified dates are corrupted: " + opt.importData.lastModified);
                    return callback instanceof Function ? callback.call(this, false, "importData modified dates are corrupted: " + opt.importData.lastModified, null, false) : CACHE_ERROR.call(this, "importData modified dates are corrupted: " + opt.importData.lastModified);
                }
                if (opt.importData && opt.importData.data) {
                    if (opt.importData.version !== this.version + "_" + base64_2.default.Version && opt.importData.version !== this.version + "." + base64_2.default.Version) {
                        return callback instanceof Function ? callback.call(this, false, "imported database version not supported", null, false) : CACHE_ERROR.call(this, "imported database version not supported");
                    }
                    else if (base64_2.default.hmac(opt.importData.data, opt.key) === opt.importData.signature) {
                        opt.importData = decompress(opt.importData.data, opt.key);
                        initiateTable.call(this, opt);
                        INITIATE_DBS.call(this, DB[this.id].title);
                    }
                    else
                        return callback instanceof Function ? callback.call(this, false, "imported databse corrupted", null, false) : CACHE_ERROR.call(this, "imported database corrupted");
                }
                else {
                    initiateTable.call(this, opt);
                    INITIATE_DBS.call(this, DB[this.id].title);
                }
            };
            /**
             * Check if the table has been deleted or not
             * @function isDeleted
             * @returns {boolean} whether or not the table has been deleted
             */
            NyckelDBObj.prototype.isDeleted = function () {
                return TABLE_IS_DELETED(DB[this.id]);
            };
            ;
            /**
             * Checks whether there are changes since the last time the database was synchronized
             * @function isSyncPending
             * @param {string} cloudSyncFile token that contains the version number, hashed message authentication code (HMAC) and lastSync timestamp of the database
             * @param {successCallback} [callback] callback function
             * @returns {boolean} whether or not sync is needed
             */
            NyckelDBObj.prototype.isSyncPending = function (cloudSyncFile, callback) {
                function ret(val) {
                    return callback instanceof Function ? (callback.call(this, val, ERRORS[this.id]), val) : val;
                }
                if (cloudSyncFile) {
                    if (typeof cloudSyncFile === "string")
                        cloudSyncFile = JSON.parse(cloudSyncFile);
                    var title = TO_PROP_NAME(DB[this.id].title);
                    if (!cloudSyncFile[title] && cloudSyncFile[title] !== 0 || Number(cloudSyncFile[title]) !== DB[this.id].lastModified) {
                        this.syncPending = true;
                        return ret.call(this, true);
                    }
                    else
                        return ret.call(this, false);
                }
                else
                    return ret.call(this, this.syncPending);
            };
            ;
            /**
             * Clear all the locally cached copies of all the NyckelDB databases.
             * @function NUKEALL
             * @param {string} msg the message that you want to tell the user before you blow everything up!
             * @param {successCallback} [callback] callback function
             */
            NyckelDBObj.prototype.NUKEALL = function (msg, callback) {
                function nuke() {
                    if (storage_1.default) {
                        for (var a = 0, len = DBS.length; a < len; a++) {
                            storage_1.default.deleteItem(DBS[a]);
                            storage_1.default.deleteItem("searchIndex_" + DBS[a]);
                        }
                        storage_1.default.deleteItem("tables");
                    }
                    DB = new Array(Math.pow(2, 32) - 1);
                    NUM = 0;
                    DBS = [];
                    DBX_SYNC_OBJ = {};
                    SEARCH_INDEX = [];
                    SEARCH_SUGGESTIONS = [];
                    RECENTLY_SEARCHED = [];
                    COL_NAMES_INDEXED = [];
                    BUILDING_SEARCH_INDEX = [];
                    BUILDING_SEARCH_INDEX_QUEUE = [];
                    ROW_INDEX_CACHE = [];
                    ERRORS = [];
                    SYNC_ERROR = false;
                    SYNC_ERROR_TIME = 0;
                    if (callback instanceof Function)
                        return callback.call(this, true, false);
                }
                if (APP.confirm && APP.notify)
                    APP.confirm(msg, nuke.bind(this), function () {
                        APP.notify("<b>Oi!</b> That was close!", true);
                    }, {
                        "okButton": "Delete all of this site's saved data in this web browser or app"
                    });
                else if (window && window.confirm(msg))
                    nuke.call(this);
            };
            ;
            /**
             * Change the name of a column
             *       Function not complete
             * @function renameColumn
             * @param {string} colName is the current column name from the table header
             * @param {string} newName the new name to apply to the column
             * @param {setCallback} [callback] callback function
             * @returns {string | false} actual name set
             * @since 0.4
             */
            NyckelDBObj.prototype.renameColumn = function (colName, newName, callback) {
                var orig = String(newName);
                colName = TO_PROP_NAME(colName);
                newName = TO_PROP_NAME(newName);
                //TODO check for other columns of the same name
                //check for other columns exportAs name of the same name
                //TODO change name in search index
                return newName;
            };
            ;
            /**
             * Search for rows that contain all of the words given in the search query
             * @function search
             * @param {string} searchQuery words to search for in the database
             * @param {object} options {
             *	"colNames": Array, an Array of columns to search in
             *	"fuzzyMatch": Boolean
             * }
             * @param {searchCallback} callback callback function
             */
            NyckelDBObj.prototype.search = function (searchQuery, options, callback) {
                function findMatches(arr, min) {
                    min = min || 2;
                    if (min === 1)
                        return arr;
                    var ret = []; /*return array*/
                    arr = arr.sort();
                    for (var a = 0, found = false, x = 0, y = x + 1, len = arr.length, b = void 0; x < len - min + 1; x++, y = x + 1) {
                        if (String(arr[x]) === String(arr[y])) {
                            found = true;
                            for (b = 0; b < min - 1; b++) {
                                if (arr[x] !== arr[y + b])
                                    found = false;
                            }
                            if (found === true) {
                                ret[a] = arr[x];
                                x = x + min - 1;
                                a++;
                            }
                        }
                    }
                    return ret;
                }
                function querySearchIndex(searchQuery, lastRoundBool) {
                    var aLen = searchQuery.length, tempIds = [];
                    for (var a = 0, b = void 0, bLen = COL_NAMES_INDEXED[this.id].length, i = void 0; a < aLen; a++) {
                        for (b = 0, i = []; b < bLen; b++) {
                            if (SEARCH_INDEX[this.id][searchQuery[a]] && SEARCH_INDEX[this.id][searchQuery[a]][COL_NAMES_INDEXED[this.id][b]]) {
                                i = i.concat(SEARCH_INDEX[this.id][searchQuery[a]][COL_NAMES_INDEXED[this.id][b]]);
                            }
                        }
                        tempIds = tempIds.concat(DELETE_DUPLICATES(i));
                    }
                    ids = DELETE_DUPLICATES(ids.concat(findMatches.call(this, tempIds, aLen)));
                    if (ids.length > 0) {
                        RECENTLY_SEARCHED[this.id] = DELETE_DUPLICATES(searchQuery.concat(RECENTLY_SEARCHED[this.id]));
                        RECENTLY_SEARCHED[this.id] = RECENTLY_SEARCHED[this.id].slice(0, 25);
                        STO_SEARCH_INDEX.call(this);
                    }
                    if (lastRoundBool)
                        if (callback instanceof Function)
                            return callback.call(this, ids, ERRORS[this.id]);
                }
                function fuzzyMatch(searchQueryArr) {
                    var arr = [];
                    //collect all possible alternate queries
                    for (var a_1 = 0, lenA = searchQueryArr.length; a_1 < lenA; a_1++) {
                        if (lists_1.default[searchQueryArr[a_1]]) {
                            arr[a_1] = lists_1.default[searchQueryArr[a_1]].split(" ");
                        }
                        else
                            arr[a_1] = [searchQueryArr[a_1]];
                    }
                    //combine them in all possible combinations
                    var queries = [], a = 0, n = 0, cursor = [], len = arr.length;
                    while (len)
                        cursor[--len] = 0; //initialize cursors
                    len = arr.length;
                    //while the last item in the last column has not been reached
                    while (arr[n]) {
                        //initiate the new combination
                        queries[a] = [arr[0][cursor[0]]];
                        //write the new combination
                        for (var c = 1; c < len; c++) {
                            queries[a].push(arr[c][cursor[c]]);
                        }
                        a++;
                        n = 0;
                        cursor[n]++;
                        while (n <= len && cursor[n] === arr[n].length) {
                            cursor[n] = 0;
                            cursor[n + 1]++;
                            n++;
                            if (n === len)
                                break;
                        }
                    }
                    arr = null;
                    for (var a_2 = 0, len_1 = queries.length - 1; a_2 < len_1; a_2++) {
                        querySearchIndex.call(this, queries[a_2], false);
                    }
                    return querySearchIndex.call(this, queries[queries.length - 1], true);
                }
                function search(searchQueryArr, options) {
                    if (options.fuzzyMatch)
                        return fuzzyMatch.call(this, searchQueryArr);
                    else
                        return querySearchIndex.call(this, searchQueryArr, true);
                }
                if (TABLE_IS_DELETED(DB[this.id]))
                    if (callback instanceof Function)
                        return callback.call(this, [], "no data");
                options = options || {};
                var cols = options.colNames ? options.colNames.join("|").split("|") : undefined, ids = [], searchQueryArr = SEARCH_VALIDATE(searchQuery);
                //check for search index
                BUILD_SEARCH_INDEX.call(this, cols, search.bind(this, searchQueryArr, options));
            };
            ;
            /**
             * Change the value of a column property
             * @function setColumnProp
             * @param {string} colName the name of the column to modify
             * @param {string} propName the name of the column property to modify
             * @param {string | number | boolean} propValue the new value to set the column property to
             * @returns { string | number | boolean | undefined} the validated property value that was applied
             */
            NyckelDBObj.prototype.setColumnProp = function (colName, propName, propValue) {
                if (propName === "type") {
                    var type = VALIDATE_TYPE.call(this, propValue);
                    return this.setType(colName, type);
                }
                else
                    return SET_COLUMN_PROP.call(this, colName, propName, propValue, true);
            };
            /**
             * Change the value of a table's custom property
             * @function setProp
             * @param {string} propName the name of the property to change
             * @param {string | number | boolean} value new value
             * @returns {string | number | boolean | undefined} the validated property value that was applied
             */
            NyckelDBObj.prototype.setProp = function (propName, value) {
                return SET_PROP.call(this, propName, value, undefined, undefined, true);
            };
            ;
            /**
             * Same as isSyncPending but sets the value of syncPending to true if the cloudSyncFile validates
             * @function setSyncCompleted
             * @param {string} cloudSyncFile token that contains the version number, hashed message authentication code (HMAC) and lastSync timestamp of the database
             * @param {successCallback} [callback] callback function
             * @returns {boolean} whether or not sync is successfully set to complete
             */
            NyckelDBObj.prototype.setSyncCompleted = function (cloudSyncFile, callback) {
                var json = typeof cloudSyncFile === "string" ? JSON.parse(cloudSyncFile) : cloudSyncFile;
                if (cloudSyncFile && this.isSyncPending(json)) {
                    if (callback instanceof Function) {
                        return (callback.call(this, false, "database has been modified since last sync and requires sync again"), false);
                    }
                    else
                        return false;
                }
                else {
                    this.syncPending = false;
                    if (callback instanceof Function) {
                        return (callback.call(this, true, false), true);
                    }
                    else
                        return true;
                }
            };
            ;
            /**
             * Change the title of the table.
             * 	   note: This actually deletes the table and creates a new one
             *     with the new name – something to be aware of if you try
             * 	   to access the table by it's old name and see that it has
             * 	   been deleted!
             * @function setTitle
             * @param {string} newTitle the new title to apply
             * @param {successCallback} [callback] callback function
             * @returns {string} the new title
             */
            NyckelDBObj.prototype.setTitle = function (newTitle, callback) {
                var oldId = this.id, oldTitle = DB[this.id].title, y = DBS.indexOf(oldTitle);
                //applyTitle creates a new id from title
                INITIATE_DBS.call(this, newTitle, function (newTitle) {
                    //copy table and newTitle to new id
                    DB[this.id] = JSON.parse(JSON.stringify(DB[oldId]));
                    DB[this.id].title = newTitle;
                    // //cache oldTitle to maintain syncability
                    // if (DB[this.id].previousTitle) DB[this.id].previousTitle!.push(TO_PROP_NAME(oldTitle));
                    // else DB[this.id].previousTitle = [TO_PROP_NAME(oldTitle)];
                    //delete old table
                    DELETE_TABLE_BY_ID.call(this, oldId, TIMESTAMP());
                    oldId = null;
                    //update modified
                    DB[this.id].lastModified = TIMESTAMP();
                    this.syncPending = true;
                    //swap database references to refer to the new table
                    var x = DBS.indexOf(newTitle);
                    DBS[y] = DBS[x];
                    DBS[x] = oldTitle;
                    oldTitle = null;
                    y = null;
                    x = null;
                    TO_LOCAL_STORAGE.call(this, true);
                    return callback instanceof Function ? (callback.call(this, true, ERRORS[this.id]), this) : this;
                }.bind(this));
            };
            ;
            /**
             * Change the column's data validation 'type'
             *     Not complete
             * @function setType
             * @param {string} colName is the column name from the table header
             * @param {string} type the type of data validation to set for the given column
             * @param {array} data updated column data that validates to the new type
             * @param {setTypeCallback} [callback] callback function
             */
            NyckelDBObj.prototype.setType = function (colName, type, data, callback) {
                return SET_TYPE.call(this, colName, type, data, true, undefined, callback);
            };
            ;
            /**
             * Change the value of a cell
             * @function setVal
             * @param {number | string} rowId can be the index of the row, or it's 3 digit identifier
             * @param {string} colName is the column name from the table header
             * @param {string | number | boolean} newValue the new value to apply to the cell
             * @param {setCallback} [callback] callback function
             * @returns {string | number | boolean | undefined} the actual value that was set after passing through data validation
             */
            NyckelDBObj.prototype.setVal = function (rowId, colName, newValue, callback) {
                return SET_VAL.call(this, rowId, colName, newValue, true, undefined, callback);
            };
            ;
            /**
            * Change multiple values at once
            * @function setVals
            * @param {number|string} rowId can be the index of the row, or it's 3 digit identifier
            * @param {object} newValues object in the form {[colName]:{value:[value]},...}
            * @param {setCallback} [callback] callback function
            */
            NyckelDBObj.prototype.setVals = function (rowId, newValues, callback) {
                function ret() {
                    a++;
                    if (a === len && callback instanceof Function)
                        return callback.call(this, true, ERRORS[this.id]);
                }
                var len = 0, a = 0;
                for (var i in newValues) {
                    len++;
                }
                for (var column in newValues) {
                    if (COL_NAME_IS_VALID.call(this, column)) {
                        SET_VAL.call(this, rowId, column, newValues[column].value, true, undefined, ret.bind(this));
                    }
                }
            };
            ;
            /**
             * Shuffle the order of the rows in the table
             * @function shuffle
             * @returns {object} this
             */
            NyckelDBObj.prototype.shuffle = function () {
                function shuffle(array) {
                    var len = array.length, halfLen = Math.ceil(len / 2), random = base64_2.default.rand(halfLen).split(""), r = 0;
                    //shuffle cards
                    if (len > 0) {
                        var array1, array2;
                        for (var reps = 0, a, lenA; reps < 2 || reps < len / 10; reps++) {
                            //split the deck
                            array1 = array.slice(0, halfLen);
                            array2 = array.slice(halfLen, len);
                            for (a = 0, lenA = array1.length; a < lenA; a++) {
                                array2.splice(a + Number(random[r]), 0, array1[a]);
                                r++;
                                if (r > len / 2)
                                    r = 0;
                            }
                            array = array2;
                            array.push(array.shift());
                            r = 0;
                        }
                        reps = null;
                        a = null;
                        lenA = null;
                        array1 = null;
                        array2 = null;
                    }
                    len = null;
                    halfLen = null;
                    random = null;
                    r = null;
                    return array;
                }
                if (!TABLE_IS_DELETED(DB[this.id])) {
                    var len = this.getLength(), shuffled = shuffle(DB[this.id].table);
                    if (shuffled.length !== len) {
                        CACHE_ERROR.call(this, "shuffle error " + len + " != " + this.getLength());
                        len = null;
                        shuffled = null;
                        return this;
                    }
                    else {
                        DB[this.id].table = shuffled;
                        ROW_INDEX_CACHE[this.id] = {};
                        len = null;
                        shuffled = null;
                        return this;
                    }
                }
                else
                    return this;
            };
            ;
            /**
             * Sort the table alphabetically or numerically by a particular column.
             * @function sortByCol
             * @param {string} colName is the column name from the table header
             * @param {object} [options] {
             *	"reverse": sort Z-A, (true or false)
             *	"fromEndOfStr": sort xA-xZ, (true or false) }
             * @returns {object} this
             */
            NyckelDBObj.prototype.sortByCol = function (colName, options) {
                function reverseStr(str) {
                    str = String(str);
                    var ret = [];
                    for (var a = 0, len = str.length; a < len; a++) {
                        ret[a] = str[len - a - 1];
                    }
                    a = null;
                    len = null;
                    return ret.join("");
                }
                function sortFunction(a, b) {
                    var _a = a[colIndex];
                    var _b = b[colIndex];
                    //try to compare items as numbers
                    if (!isNaN(Number(_a)) && !isNaN(Number(_b))) {
                        _a = Number(_a);
                        _b = Number(_b);
                    }
                    //optionally sort string backwards <-- (from this end)
                    if (options && options.fromEndOfStr) {
                        _a = reverseStr(_a);
                        _b = reverseStr(_b);
                    }
                    return _a === _b ? 0 : _a < _b ? -1 : 1;
                }
                options = options || {};
                var colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
                if (colIndex > 0) {
                    DB[this.id].table.sort(sortFunction);
                    if (options.reverse)
                        DB[this.id].table.reverse();
                    ROW_INDEX_CACHE[this.id] = {};
                    colIndex = null;
                    return this;
                }
                else
                    return this;
            };
            ;
            /**
             * Synchronize with an external copy of the database.
             * @function sync
             * @param {json} json nyckeldb json
             * @param {json} [options] {
             *	forceSync: true, (false is default)
             *	key: string,
             *  initialKey: string,
             *	oldKey: string,
             *	token: string
             * }
             * @param {successCallback} [callback] syncCallback function
             * @return {object} this
             */
            NyckelDBObj.prototype.sync = function (json, options, callback) {
                function retError(msg) {
                    if (callback instanceof Function)
                        return callback.call(this, false, msg, false);
                }
                function sync() {
                    function read(data, key, change) {
                        if (change) {
                            DB[this.id].lastModified = TIMESTAMP();
                            this.syncPending = true;
                        }
                        return base64_2.default.read(data, key);
                    }
                    switch (json.signature) {
                        case base64_2.default.hmac(json.data, readKey):
                            json = read.call(this, json.data, readKey, false);
                            break;
                        case base64_2.default.hmac(json.data, opt.initialKey):
                            json = read.call(this, json.data, opt.initialKey || null, true);
                            break;
                        case base64_2.default.hmac(json.data, null):
                            json = read.call(this, json.data, null, true);
                            break;
                        default:
                            //wrong key, put user through key update ui and try again
                            SYNC_ERROR = true;
                            SYNC_ERROR_TIME = new Date().getTime();
                            return retError.call(this, "wrong key used");
                    }
                    return IMPORT_JSON.call(this, json, function (success, errors, changes) {
                        if (success && !errors && (changes || this.syncPending === true || forceSync === true)) {
                            return CREATE_BASE64_FILE.call(this, writeKey, opt.token, callback);
                        }
                        else
                            return callback instanceof Function ? (callback.call(this, true, ERRORS[this.id], false), this) : this;
                    }.bind(this), false, false);
                }
                function keyMigration() {
                    if (opt.oldKey !== undefined && opt.key && opt.oldKey !== opt.key) {
                        readKey = opt.oldKey;
                        DB[this.id].lastModified = TIMESTAMP();
                        this.syncPending = true;
                    }
                }
                var opt = options || {}, forceSync = opt.forceSync || false, readKey = opt.key || null, writeKey = opt.key || null, wait = MAX_SYNC_FREQUENCY + DBX_SYNC_OBJ[DB[this.id].title] - TIMESTAMP();
                keyMigration.call(this);
                if (wait > 0 && !forceSync)
                    return retError.call(this, "rate limited, try again in " + wait + " minutes");
                else if (SYNC_ERROR && new Date().getTime() - SYNC_ERROR_TIME < 15e3)
                    return retError.call(this, "try again later"); //15 seconds
                else if (!json)
                    return CREATE_BASE64_FILE.call(this, writeKey, opt.token, callback);
                else if (typeof json === "string")
                    json = JSON.parse(json);
                if (!json.data || !(json.version === this.version + "_" + base64_2.default.Version)) {
                    return retError.call(this, "unsupported version:" + json.version);
                }
                return sync.call(this);
            };
            ;
            /**
             * Exports table as CSV string. Not implemented yet
             * @function toCSV
             * @returns {string} database in CSV string format
             */
            NyckelDBObj.prototype.toCSV = function () {
                //TODO
                return "function not complete";
            };
            ;
            /**
             * exports table as JSON 2d array
             * @function toJSON_Array
             * @returns {array} database in array format
             */
            NyckelDBObj.prototype.toJSON_Array = function () {
                return SAVE_FILE.call(this, JSON.stringify(DB[this.id]), DB[this.id].title + "_" + READABLE_TIMESTAMP() + ".json");
            };
            ;
            /**
             * Exports table as JSON key value pairs. Not implemented (and may not...?)
             * @function toJSON_KeyValuePairs
             * @returns {json} database in json format
             */
            NyckelDBObj.prototype.toJSON_KeyValuePairs = function () {
                //TODO
                return "function not complete";
            };
            ;
            /**
             * Make all hidden rows accessible again (another way to call unHideRows)
             * @function unfilter
             * @returns {object} this
             */
            NyckelDBObj.prototype.unfilter = function () {
                return this.unhideRows();
            };
            ;
            /**
             * Make all hidden rows accessible again
             * @function unhideRows
             * @returns {object} this
             */
            NyckelDBObj.prototype.unhideRows = function () {
                if (HIDDEN_TABLE_DATA[this.id] !== undefined && !TABLE_IS_DELETED(DB[this.id])) {
                    var row;
                    while (HIDDEN_TABLE_DATA[this.id].length > 0) {
                        row = HIDDEN_TABLE_DATA[this.id][0];
                        DB[this.id].ids[row[0]] = JSON.parse(JSON.stringify(HIDDEN_IDS[this.id][row[0]]));
                        delete HIDDEN_IDS[this.id][row[0]];
                        DB[this.id].table.push(HIDDEN_TABLE_DATA[this.id].splice(0, 1)[0]);
                    }
                    row = null;
                    delete HIDDEN_TABLE_DATA[this.id];
                    delete HIDDEN_IDS[this.id];
                    ROW_INDEX_CACHE[this.id] = {};
                }
                return this;
            };
            ;
            /**
             * Check if a value is an acceptable input
             * @function validate
             * @param {string|number|boolean} value to check
             * @param {string} valueType an input type, such as "number", "emailAddress"...
             * @param {validateCallback} [callback] callback function
             * @returns {object} valid(boolean), value, errorMsg, errorDetails
             * @since 0.4
             */
            NyckelDBObj.prototype.validate = function (value, valueType, callback) {
                return VALIDATE.call(this, value, valueType, "validate", callback);
            };
            ;
            return NyckelDBObj;
        }());
        //ALL CAPS "PRIVATE" VARIABLES
        var DB; //all databases
        var NUM; //incrementing database number
        var DBS; //array of database titles
        var DBX_SYNC_OBJ; //lastSync dates of all databases
        var SEARCH_INDEX; //tree structured search indexes of all databases 
        var SEARCH_SUGGESTIONS; //tree structured search suggestions of all databases
        var RECENTLY_SEARCHED; //cached last 25 successful searches for surfacing more relevent search suggestions
        var COL_NAMES_INDEXED; //current columns search indexed
        var BUILDING_SEARCH_INDEX; //search index build state, indicates whether search index is ready, or to queue the search for when the search index is built
        var BUILDING_SEARCH_INDEX_QUEUE; // queue of searches to execute after search index is built
        var ROW_INDEX_CACHE; //a cache of the current positions of ids in databases to avoid repetitive looping through the table looking for an id
        var ERRORS;
        var MAX_SYNC_FREQUENCY = 5; //5 minutes
        var SYNC_ERROR = false;
        var SYNC_ERROR_TIME;
        var HIDDEN_IDS;
        var HIDDEN_TABLE_DATA;
        var STRING_TYPES = "any string uniqueString multilineString date email phoneNumber password formattedAddress streetAddress mailAddress cityCounty provinceStateRegion country postalZipCode givenName familyName geoLocation";
        var NUMBER_TYPES = "any number integer posInteger negInteger date phoneNumber password postalZipCode longitude latitude";
        var VALID_TYPES = new RegExp("^(" + DELETE_DUPLICATES((STRING_TYPES + " " + NUMBER_TYPES + " boolean").split(" ")).join("|") + ")$");
        var VALID_STRING_TYPES = new RegExp("^(" + STRING_TYPES.split(" ").join("|") + ")$");
        var VALID_NUMBER_TYPES = new RegExp("^(" + NUMBER_TYPES.split(" ").join("|") + ")$");
        var FORBIDDEN = GET_FORBIDDEN(); //property names that shouldn't be used (?)
        var THIS_VERSION = "0.6.0";
        var COMPATIBLE_VERSIONS = ["0.5"];
        //TODO share function
        return NyckelDBObj;
    }());
    exports.default = NyckelDB;
});
//# sourceMappingURL=bundle.js.map