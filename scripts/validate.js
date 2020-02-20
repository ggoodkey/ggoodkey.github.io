define(["require", "exports"], function (require, exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", { value: true });
    var VAL;
    (function () {
        VAL = {
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
    }());
    exports.default = VAL;
});
//# sourceMappingURL=validate.js.map