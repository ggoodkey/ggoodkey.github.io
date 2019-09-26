//depenancies
var APP, Base64, Windows, cordova, Spelling;
/* eslint-disable */
var NyckelDB = (function () {
    "use strict";
    function IS_NUMERIC(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
    function TO_PROP_NAME(str) {
        return str == null ? "_undefined" : (str = String(str).replace(/ /g, "_").replace(/[^A-z0-9_]/g, ""), str === "") ? "_" : /\d/.test(str.charAt(0)) ? "_" + str : str;
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
        if (this.isDeleted())
            return false;
        if (IS_NUMERIC(rowId)) {
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
                    column = DB[this.id].columns[headers[a]];
                    if ("exportAs" in column && column.exportAs[0] === str) {
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
        if (this.isDeleted())
            return false;
        var headers = DB[this.id].columns.$headers;
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
        if (this.isDeleted())
            return -1;
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
        if (this.isDeleted())
            return -1;
        var headers = DB[this.id].columns.$headers;
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
                column = DB[this.id].columns[headers[a]];
                if (column.exportAs && column.exportAs[0] === orig) {
                    if (ret === -1)
                        ret = a;
                    else {
                        //more than 1 possible matches exist, return no match found
                        ret = -1;
                        break;
                    }
                }
            }
            return ret;
        }
    }
    function EXPORT_DB() {
        if (!HIDDEN_TABLE_DATA[this.id])
            return DB[this.id];
        else {
            var db = DB[this.id];
            var row;
            while (HIDDEN_TABLE_DATA[this.id].length > 0) {
                row = HIDDEN_TABLE_DATA[this.id][0];
                db.ids[row[0]] = JSON.parse(JSON.stringify(HIDDEN_IDS[this.id][row[0]]));
                delete HIDDEN_IDS[this.id][row[0]];
                db.table.push(HIDDEN_TABLE_DATA[this.id].splice(0, 1)[0]);
            }
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
                APP.Sto.setItem(DB[this.id].title, EXPORT_DB.call(this));
            }
            ERRORS[this.id] = "";
        }
        if (APP.Sto) {
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
                return callback(success, err, DB[this.id] && DB[this.id].title, !err ? changes : false);
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
                if (!HIDDEN_TABLE_DATA[this.id] && json.table.length !== DB[this.id].table.length ||
                    HIDDEN_TABLE_DATA[this.id] && json.table.length !== DB[this.id].table.length + HIDDEN_TABLE_DATA[this.id].length) {
                    CACHE_ERROR.call(this, "lastModified date not updated");
                }
            }
            function syncColumns(columns, callback) {
                if (!columns)
                    return callback();
                //added in verions 0.4+
                for (var colName in columns) {
                    //go through all metadata and delete deleted columns //ignore $headers, $etc
                    if (colName.charAt(0) !== "$" && columns[colName].deleted && DB[this.id].columns[colName] && !DB[this.id].columns[colName].deleted) {
                        DELETE_COLUMN.call(this, colName, false, columns[colName].deleted[1]);
                    }
                }
                for (var a = 0, lenA = columns.$headers.length, colIndex = void 0, colName = void 0, prop = void 0; a < lenA; a++) {
                    colName = columns.$headers[a];
                    colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
                    if (colIndex === -1)
                        ADD_COLUMN.call(this, colName, columns[colName], a, null, false, columns.$created[a]);
                    if (colIndex > 0) { //make changes					
                        if (colIndex !== a)
                            MOVE_COLUMN.call(this, colName, colIndex, false);
                        //go through all properties and update
                        for (prop in columns[colName]) {
                            if (columns[colName][prop][1] > DB[this.id].columns[colName][prop][1]) {
                                switch (prop) {
                                    case "deleted": //shouldn't find an unsynced deleted column here!!!
                                        CACHE_ERROR.call(this, colName, "deleted column not synced");
                                        break;
                                    case "type":
                                        SET_TYPE.call(this, colName, columns[colName][prop][0], null, false, columns[colName][prop][1]);
                                        break;
                                    //TODO add more props here
                                    default:
                                        CACHE_ERROR.call(this, prop, "unknown column property not being synced");
                                    //report sync not handling this property
                                }
                            }
                        }
                    }
                }
                return callback();
            }
            function syncTable(table, ids) {
                function updateTimestamps() {
                    function deleteRows() {
                        function applyProperties() {
                            if (json.properties && DB[this.id].properties) {
                                var _prop;
                                for (var prop in json.properties) {
                                    _prop = TO_PROP_NAME(prop);
                                    if (DB[this.id].properties[_prop]) {
                                        if (!DB[this.id].properties[_prop][1] || DB[this.id].properties[_prop][1] < json.properties[prop][1]) {
                                            SET_PROP.call(this, _prop, json.properties[prop][0], json.properties[prop][1], undefined, false);
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
                        //delete deleted rows
                        for (var rowId in json.ids) {
                            if (json.ids[rowId][0] === "del" && DB[this.id].ids[rowId] && DB[this.id].ids[rowId][0] !== "del") {
                                if (json.ids[rowId][1] !== DB[this.id].ids[rowId][0])
                                    syncChanges = true;
                                //if it was deleted after it was created (not restored)
                                if (json.ids[rowId][1] - createdDiff > DB[this.id].ids[rowId][0]) {
                                    DELETE_ROW.call(this, rowId, false, json.ids[rowId][1]);
                                }
                            }
                        }
                        applyProperties.call(this);
                    }
                    if (json.created < DB[this.id].created) {
                        //update created time stamp
                        DB[this.id].created = json.created;
                        DB[this.id].lastModified = DB[this.id].lastModified === 0 ? json.lastModified : DB[this.id].lastModified - createdDiff;
                        //update all other time stamps to reflect change in created time stamp
                        var i = 0, idiLen;
                        for (var id in DB[this.id].ids) {
                            for (i = 0, idiLen = DB[this.id].ids[id].length; i < idiLen; i++) {
                                if (i !== 0 || DB[this.id].ids[id][i] !== "del")
                                    DB[this.id].ids[id][i] = DB[this.id].ids[id][i] - createdDiff;
                            }
                        }
                        syncChanges = true;
                        //TODO update column timestamps
                    }
                    deleteRows.call(this);
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
                            if (xId[0] === "del" && nId[0] === "del" || Number(xId[0]) + Number(xId[e]) === Number(nId[0]) + Number(nId[e]) - createdDiff)
                                continue;
                            //cells are different
                            syncChanges = true;
                            if (nId[0] !== "del" && (xId[0] === "del" || Number(xId[0]) + Number(xId[e]) < Number(nId[0]) + Number(nId[e]) - createdDiff)) {
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
                            DB[this.id].ids[nRow[0]][1] < Number(ids[nRow[0]][0]) - createdDiff)) {
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
                updateTimestamps.call(this);
            }
            function checkDeleted(json) {
                if (!this.isDeleted()) {
                    //delete table
                    return DELETE_TABLE.call(this, function () { return ret.call(this, true, null, true); }.bind(this), json.deleted, false);
                }
                else
                    return ret.call(this, true, null, false);
            }
            function directLoadDB() {
                //database has just been initiated and can load all data directly from json, or is being restored from being deleted
                if (DB[this.id].lastModified >= json.lastModified)
                    return ret.call(this, true, null, false);
                //recreate existing/deleted table
                this.unhideRows();
                DB[this.id].created = json.created;
                DB[this.id].ids = json.ids;
                DB[this.id].lastModified = json.lastModified;
                DB[this.id].properties = json.properties;
                DB[this.id].table = json.table;
                var version = json.version;
                if ("Version" in json)
                    version = json.Version;
                if (json.types && json.headers && version === "0.3_1.1") {
                    //migrate old json.types to columns
                    DB[this.id].columns = APPLY_COLUMN_PROPERTIES.call(this, json.headers, json.types, json.created);
                }
                else
                    DB[this.id].columns = json.columns;
                DB[this.id].version = this.version + "_" + Base64.Version;
                if (!fromLocalStorageBool)
                    TO_LOCAL_STORAGE.call(this);
                return ret.call(this, true, null, true);
            }
            if (json.lastModified && json.lastModified === DB[this.id].lastModified) {
                //no changes
                checkDBForMissingItems.call(this);
                return ret.call(this, true, null, false);
            }
            var eTitle = TO_PROP_NAME(DB[this.id].title), nTitle = TO_PROP_NAME(json.title);
            if (json.previousTitle && json.previousTitle.indexOf(eTitle) > -1) {
                //title has been changed
                DB[this.id].title = json.title;
            }
            if (nTitle !== eTitle && !DB[this.id].previousTitle ||
                DB[this.id].previousTitle && DB[this.id].previousTitle.indexOf(nTitle) === -1) {
                return ret.call(this, false, "cannot import " + json.title, false);
            }
            //table titles match
            if ("deleted" in json) {
                return checkDeleted.call(this, json);
            }
            else if (!json.table)
                return ret.call(this, false, "json is not valid", false);
            if (DB[this.id].lastModified === 0 && DB[this.id].table.length === 0 && DB[this.id].created !== json.created || this.isDeleted()) {
                return directLoadDB.call(this);
            }
            var createdDiff = DB[this.id].created - json.created; //the difference in time between when the two tables were created
            syncColumns.call(this, json.columns, function () {
                syncTable.call(this, json.table, json.ids);
            }.bind(this));
            //TODO check for errors in headers and column metadata
            if (!fromLocalStorageBool)
                TO_LOCAL_STORAGE.call(this, syncChanges);
            else
                BUILD_SEARCH_INDEX.call(this);
            return ret.call(this, true, ERRORS[this.id], syncChanges);
        }
        function applyCSV(json) {
            function getId(jsonRow, searchLevel, remainingIds, idColName) {
                function findDifferences(id, json) {
                    var x, y, b = 0, ret = [];
                    for (var item in json) {
                        if (json.hasOwnProperty(item)) {
                            x = String(json[item]);
                            y = String(this.getVal(id, item));
                            if (y && x !== y) {
                                ret[b] = item;
                                b++;
                            }
                        }
                    }
                    if (b === 0)
                        return false;
                    else
                        return ret;
                }
                function onePossibleMatch(matchedID, minimunFindIdLoop, searchLevel, json) {
                    var dif = findDifferences.call(this, matchedID, json);
                    if (dif === false)
                        return matchedID;
                    if (searchLevel < minimunFindIdLoop)
                        return false;
                    for (var a = 0, difLen = dif.length; a < difLen; a++) {
                        SET_VAL.call(this, matchedID, dif[a], json[dif[a]], false, 0);
                        syncChanges = true;
                    }
                    return matchedID;
                }
                function toArray(json) {
                    var arr = [], headerName;
                    for (var a = 0, headers_1 = DB[this.id].columns.$headers, len = headers_1.length - 1; a < len; a++) {
                        headerName = headers_1[a + 1];
                        arr[a] = json[headerName];
                        //add empty values to table for boolean (false), number (0) or string ("") values
                        if (arr[a] === undefined) {
                            if (DB[this.id].columns[headerName].type[0] === "boolean")
                                arr[a] = false;
                            else if (/^number|nteger$|itude$/.test(DB[this.id].columns[headerName].type[0]))
                                arr[a] = 0;
                            else
                                arr[a] = "";
                        }
                    }
                    return arr;
                }
                function toEditTimesArr(json, traceStr) {
                    var ret = [VALIDATE_EDIT_TIME.call(this, TIMESTAMP(Number(json.lastModified)), undefined, "row", traceStr)];
                    for (var a = 1, len = DB[this.id].columns.$headers.length; a < len; a++) {
                        ret[a] = 0;
                    }
                    return ret;
                }
                //if there are no registered ids existing/left, create a new one
                if (remainingIds.length === 0) {
                    syncChanges = true;
                    return ADD_ROW.call(this, toArray.call(this, jsonRow), false, false, toEditTimesArr.call(this, json, "create new row from csv"));
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
                            return ADD_ROW.call(this, toArray.call(this, jsonRow), false, false, toEditTimesArr.call(this, json, "no remaining ids"));
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
                return ret.call(this, true, null, syncChanges);
            }
            //importing CSV file converted to JSON with csv2json function
            var headers = CHECK_HEADERS_ARRAY.call(this, json.Headers), foundMatch = false;
            if ("lastModified" in json) {
                if (json.lastModified instanceof Date)
                    json.lastModified = json.lastModified.getTime();
                if (IS_NUMERIC(json.lastModified))
                    json.lastModified = Math.round((json.lastModified - 15e11) / 6e4);
                //	else json.lastModified = null; //TODO: why is this null? should it pop an error instead?
            }
            //check for matching headers
            for (var a = 0, lenA = headers.length, b = void 0, lenB = void 0, existingHeaders = DB[this.id].columns.$headers; a < lenA; a++) {
                foundMatch = false;
                for (b = 0, lenB = existingHeaders.length; b < lenB; b++) {
                    if (headers[a] === existingHeaders[b]) {
                        foundMatch = true;
                        continue;
                    }
                }
                if (foundMatch === false) {
                    for (var col in DB[this.id].columns) {
                        if (headers[a] === col || DB[this.id].columns[col].exportAs && headers[a] === DB[this.id].columns[col].exportAs[0]) {
                            foundMatch = true;
                            continue;
                        }
                    }
                }
                if (foundMatch === false) {
                    ADD_COLUMN.call(this, headers[a], "any", a, null, false); //TODO set column type to something more specific than "any"
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
        var version = "Version" in json ? json.Version : json.version;
        if ("data" in json && version === this.version + "_" + Base64.Version && Base64.hmac(json.data, key) === json.signature) {
            json = Base64.read(json.data, key);
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
                if (file) {
                    // Prevent updates to the remote version of the file until we finish making changes and call CompleteUpdatesAsync.
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
                }
                else {
                    return false;
                }
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
            var indexItem = [], a = 0, colNums = [];
            for (var h = 0, hLen = COL_NAMES_INDEXED[this.id].length; h < hLen; h++) {
                colNums[h] = GET_INDEX_OF_COLUMN.call(this, COL_NAMES_INDEXED[this.id][h]);
            }
            //get all the words in the table
            for (var b = 0, len = this.getLength(), words, d, f, fLen, dLen = COL_NAMES_INDEXED[this.id].length; b < len; b++) {
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
            words = null;
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
            var searchWords = [], numResultsPerWord = [];
            searchWords = Object.keys(SEARCH_INDEX[this.id]);
            for (var c = 0, lenC = searchWords.length, g, lenG = COL_NAMES_INDEXED[this.id].length; c < lenC; c++) {
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
            numResultsPerWord = null;
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
        if (this.isDeleted())
            return;
        if (BUILDING_SEARCH_INDEX[this.id]) {
            if (callback instanceof Function)
                BUILDING_SEARCH_INDEX_QUEUE[this.id].push(callback);
            return;
        }
        BUILDING_SEARCH_INDEX_QUEUE[this.id] = [];
        BUILDING_SEARCH_INDEX[this.id] = true;
        if (DB[this.id].columns.$indexable !== undefined) {
            if (!colNamesToIndex)
                colNamesToIndex = DB[this.id].columns.$indexable.join("|").split("|");
            //refine colNames list
            else
                for (var c = 0, d = 0; c < colNamesToIndex.length; c++, d++) {
                    colNamesToIndex[c] = TO_PROP_NAME(colNamesToIndex[c]);
                    if (colNamesToIndex[c] && colNamesToIndex[c] !== "" && DB[this.id].columns.$indexable.indexOf(colNamesToIndex[c]) === -1) {
                        colNamesToIndex.splice(d, 1);
                        d--;
                    }
                }
        }
        COL_NAMES_INDEXED[this.id] = colNamesToIndex ?
            colNamesToIndex.join("|").split("|") :
            DB[this.id].columns.$indexable ?
                DB[this.id].columns.$indexable.join("|").split("|") :
                DB[this.id].columns.$headers.join("|").split("|");
        APP.Sto.getItem("searchIndex_" + DB[this.id].title, null, function (obj) {
            if (typeof obj === "string")
                obj = JSON.parse(obj);
            if (!(obj &&
                obj.version === this.version + "_" + Base64.Version &&
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
        APP.Sto.setItem("searchIndex_" + DB[this.id].title, {
            "lastModified": DB[this.id].lastModified,
            "colNamesIndexed": COL_NAMES_INDEXED[this.id],
            "searchIndex": SEARCH_INDEX[this.id],
            "searchSuggestions": SEARCH_SUGGESTIONS[this.id],
            "recentlySearched": RECENTLY_SEARCHED[this.id],
            "length": this.getLength(),
            "version": this.version + "_" + Base64.Version
        });
    }
    function SET_PROP(propName, value, editTime, type, storeBool) {
        function validate(propName, value, type) {
            if (VALUE_IS_VALID.call(this, value, type), false, "setProp") {
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
                if (VALUE_IS_VALID.call(this, value, type), false, "setProp") {
                    return apply.call(this, propName, value, type);
                }
                else
                    CACHE_ERROR.call(this, value, "cannot set " + propName);
            }
        }
        function apply(propName, value, type) {
            editTime = VALIDATE_EDIT_TIME.call(this, editTime, undefined, "property", "setProp");
            DB[this.id].properties[propName][0] = value;
            DB[this.id].properties[propName][1] = editTime;
            DB[this.id].properties[propName][2] = type;
            DB[this.id].lastModified = editTime + DB[this.id].created > DB[this.id].lastModified ? editTime + DB[this.id].created : DB[this.id].lastModified;
            this.syncPending = true;
            if (storeBool !== false)
                TO_LOCAL_STORAGE.call(this, true);
            return value;
        }
        if (this.isDeleted())
            return;
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
    }
    function ADD_ROW(array, id, storeBool, editTimesArr) {
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
            function getForbidden() {
                var forbidden = "alert all anchor anchors area assign blur button checkbox clearInterval clearTimeout clientInformation close closed";
                forbidden += " confirm constructor crypto decodeURI decodeURIComponent defaultStatus document element elements embed embeds encodeURI";
                forbidden += " encodeURIComponent escape event fileUpload focus form forms frame innerHeight innerWidth layer layers link location";
                forbidden += " mimeTypes navigate navigator frames frameRate hidden history image images offscreenBuffering open opener option outerHeight";
                forbidden += " outerWidth packages pageXOffset pageYOffset parent parseFloat parseInt password pkcs11 plugin prompt propertyIsEnum radio";
                forbidden += " reset screenX screenY scroll secure select self setInterval setTimeout status submit taint text textarea Array Date eval";
                forbidden += " function hasOwnProperty Infinity isFinite isNaN isPrototypeOf length Math NaN name Number Object prototype String toString";
                forbidden += " undefined valueOf abstract arguments boolean break byte case catch char class const continue debugger default delete do";
                forbidden += " double else enum eval export extends false final finally float for function goto if implements import in instanceof int";
                forbidden += " interface let long native new null package private protected public return short static super switch synchronized this";
                forbidden += " throw throws transient true try typeof top unescape untaint window var void volatile while with yield onblur onclick";
                forbidden += " onerror onfocus onkeydown onkeypress onkeyup onmouseover onload onmouseup onmousedown onsubmit getClass java JavaArray";
                forbidden += " javaClass JavaObject JavaPackage";
                return forbidden.split(" ");
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
                for (var activeChar = idLength - 1, letterIndex, end; (existingIds[newId] !== undefined || forbidden.indexOf(newId) !== -1) && activeChar > -1 && num < maxIdsPossible; activeChar--, num++) {
                    for (letterIndex = alphabet.indexOf(newId.charAt(activeChar)); (existingIds[newId] !== undefined || forbidden.indexOf(newId) !== -1) && letterIndex < alphabetLength && num < maxIdsPossible; letterIndex++, num++) {
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
                forbidden = null;
                alphabetLength = null;
                alpha = null;
                activeChar = null;
                letterIndex = null;
                end = null;
                if (num > maxIdsPossible) {
                    CACHE_ERROR.call(this, "getNextId failed", "You have exceeded a design limitation in the number of possible records that this application can handle.");
                    return false;
                }
                else
                    return newId;
            }
            var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""), forbidden = getForbidden();
            existingIds = existingIds || {};
            if (typeof existingIds !== "object") {
                CACHE_ERROR.call(this, "getNextId failed", "Invalid parameters: existingIds expects a JSON object");
                return false;
            }
            var alphabetLength = alphabet.length, maxIdsPossible = maxNumPos(idLength, alphabetLength), newId = "", num = 0, alpha = alphabet[0];
            setStartingPoint(startingPoint);
            return buildId.call(this);
        }
        if (this.isDeleted()) {
            CACHE_ERROR.call(this, "please recreate table before adding rows");
            return false;
        }
        var hLen = DB[this.id].columns.$headers.length;
        if (id && array.length === hLen && array[0] === id) {
            array = array.slice(1);
        }
        if (array.length !== hLen - 1) {
            CACHE_ERROR.call(this, array, "new row doesn't match table size: " + hLen);
            return false;
        }
        id = getNextId.call(this, 3, DB[this.id].ids, id ? id : array && array.constructor === Array ? array.join("") : null);
        if (!id)
            return false;
        var row = [id];
        if (!array || array.constructor !== Array) {
            CACHE_ERROR.call(this, array, "cannot add row");
            row = null;
            return false;
        }
        for (var a = 1, len = DB[this.id].columns.$headers.length, type = void 0; a < len; a++) {
            type = DB[this.id].columns[DB[this.id].columns.$headers[a]].type[0];
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
        editTimesArr[0] = VALIDATE_EDIT_TIME.call(this, editTimesArr[0], undefined, "row", "addRow");
        DB[this.id].lastModified = editTimesArr && editTimesArr[0] !== undefined ?
            editTimesArr[0] + DB[this.id].created > DB[this.id].lastModified ?
                editTimesArr[0] + DB[this.id].created : DB[this.id].lastModified : TIMESTAMP();
        DB[this.id].ids[id] = editTimesArr && editTimesArr[0] !== undefined ? [editTimesArr[0]] : [TIMESTAMP(DB[this.id].created)];
        for (var a = 0, len = hLen - 1; a < len; a++) {
            SET_VAL.call(this, id, a + 1, array[a], false, editTimesArr[a + 1]);
        }
        row = null;
        this.syncPending = true;
        if (storeBool !== false)
            TO_LOCAL_STORAGE.call(this, true);
        return id;
    }
    function VALIDATE(value, valueType, traceStr, callback) {
        function ret(valid, change, msg, details) {
            var obj = { valid: valid, value: change, error: msg, details: change !== value ? "Changed '" + value + "' to '" + change + "'" : details };
            if (callback instanceof Function)
                callback(change, msg, obj.details, this.syncPending);
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
                    for (var a = 0; a < n.length; a++) {
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
                for (var b = 0; b < n.length; b++) {
                    n[b] = n[b].replace(/^\s+|\s+$/g, "");
                    n[b] = n[b].charAt(0).toUpperCase() + n[b].slice(1).toLowerCase();
                }
                name = n.join("-");
            }
            //capitalize all other cases
            else
                name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            n = null;
            return ret.call(this, true, name);
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
            for (var a = 0; a < n.length; a++)
                n[a] = n[a].charAt(0).toUpperCase() + n[a].slice(1);
            name = n.join(" ");
            return ret.call(this, true, name);
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
            for (var a = 0; a < split.length; a++) {
                split[a] = split[a].charAt(0).toUpperCase() + split[a].slice(1);
            }
            field = split.join(" ");
            split = field.split("/");
            for (var b = 0; b < split.length; b++) {
                split[b] = split[b].charAt(0).toUpperCase() + split[b].slice(1);
            }
            field = split.join("/");
            return ret.call(this, true, field);
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
            var orig = addr, brak = "";
            var c = TRIM(String(addr)).split(" ");
            //capitalize
            for (var a = 0; a < c.length; a++) {
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
            return ret.call(this, true, addr);
        }
        function validateCity(city) {
            var orig = city;
            var c = TRIM(String(city)).split(" ");
            //capitalize names
            for (var a = 0; a < c.length; a++) {
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
            return ret.call(this, true, city);
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
            }
            return ret.call(this, true, prov);
        }
        function validatePostalCode(code) {
            var orig = code;
            //number only codes
            if (IS_NUMERIC(code)) {
                if (/[\s\-]/.test(String(orig))) {
                    code = TRIM(String(orig).replace(/[^0-9\s\-]/g, ""));
                    return ret.call(this, true, code);
                }
                if (!String(code).match(/\d{2,10}/))
                    return ret.call(this, false, orig, "Invalid postal code");
                else
                    return ret.call(this, true, code);
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
            return ret.call(this, true, code);
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
                return ret.call(this, true, phon);
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
                    return ret.call(this, true, phon);
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
            return ret.call(this, true, phon);
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
            return ret.call(this, true, email);
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
            return ret.call(this, true, str);
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
            return ret.call(this, true, str);
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
            return ret.call(this, true, str);
        }
        if (!VALIDATE_TYPE.call(this, valueType))
            return ret.call(this, false, value, valueType + " is not a valid type");
        if (!VALUE_IS_VALID.call(this, value, valueType, false, traceStr + "@validate"))
            return ret.call(this, false, value, ERRORS.pop());
        if (value === "")
            return ret.call(this, true, value);
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
            return ret.call(this, true, value);
    }
    function SET_VAL(rowId, colName, newValue, storeBool, editTime, callback) {
        function applyVal(toTable, toIds, rowIndex) {
            var thisModified;
            editTime = VALIDATE_EDIT_TIME.call(this, editTime, undefined, "cell", "setVal", toTable[rowIndex][0]);
            toTable[rowIndex][colIndex] = newValue;
            toIds[toTable[rowIndex][0]][colIndex] = editTime;
            thisModified = toIds[toTable[rowIndex][0]][0] === "del" ?
                editTime + Number(toIds[toTable[rowIndex][0]][1]) + DB[this.id].created :
                editTime + Number(toIds[toTable[rowIndex][0]][0]) + DB[this.id].created;
            if (thisModified > DB[this.id].lastModified)
                DB[this.id].lastModified = thisModified;
            this.syncPending = true;
            if (storeBool !== false)
                TO_LOCAL_STORAGE.call(this, true);
            return callback instanceof Function ? (callback(newValue, false, DB[this.id].title, true), newValue) : newValue;
        }
        if (this.isDeleted()) {
            return callback instanceof Function ? (callback(undefined, "table is deleted", DB[this.id].title, this.syncPending), undefined) : undefined;
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
            return callback instanceof Function ? (callback(undefined, error, DB[this.id].title, this.syncPending), undefined) : undefined;
        }
        var validationObj = VALIDATE.call(this, newValue, DB[this.id].columns[DB[this.id].columns.$headers[colIndex]].type[0], "SET_VAL: " + rowId + ":" + colName);
        if (validationObj.valid) {
            if (rowIsHidden)
                return applyVal.call(this, HIDDEN_TABLE_DATA[this.id], HIDDEN_IDS[this.id], rowIndex);
            else
                return applyVal.call(this, DB[this.id].table, DB[this.id].ids, rowIndex);
        }
        else
            return callback instanceof Function ? (callback(undefined, ERRORS[this.id], DB[this.id].title, this.syncPending), undefined) : undefined;
    }
    function DELETE_ROW(rowId, storeBool, editTime) {
        if (this.isDeleted()) {
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
        editTime = VALIDATE_EDIT_TIME.call(this, editTime, undefined, "row", "deleteRow");
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
        if (storeBool !== false)
            TO_LOCAL_STORAGE.call(this, true);
        return true;
    }
    function VALIDATE_EDIT_TIME(num, createdDiff, type, traceStr, id) {
        if (createdDiff === void 0) { createdDiff = 0; }
        var t = TIMESTAMP();
        switch (type) {
            case "created":
            case "lastModified":
            case "deleted":
                break;
            case "row":
            case "property":
            case "column":
                t = TIMESTAMP(DB[this.id].created);
                break;
            case "cell":
                t = TIMESTAMP(DB[this.id].created + (DB[this.id].ids[id][0] === "del" ? 0 : DB[this.id].ids[id][0]));
                break;
            default:
                CACHE_ERROR.call(this, type, "no such item to timestamp @ " + traceStr);
        }
        if (num === "del")
            return num;
        else if (!num && num !== 0)
            return t;
        else if (!IS_NUMERIC(num) || num === 0 && (type === "created" || type === "lastModified" || type === "deleted")) {
            CACHE_ERROR.call(this, num, "invalid " + type + " timestamp found @ " + traceStr);
            return t;
        }
        else if (num - createdDiff <= t) {
            return num;
        }
        else {
            CACHE_ERROR.call(this, num, type + " timestamp out of range @ " + traceStr + ". Should be less than " + t);
            return num - DB[this.id].created;
        }
    }
    function DELETE_TABLE(callback, editTime, storeBool) {
        var msg = "Are you sure you want to delete " + DB[this.id].title + " ?", del = function () {
            DELETE_TABLE_BY_ID.call(this, this.id, editTime);
            this.syncPending = true;
            if (storeBool !== false)
                TO_LOCAL_STORAGE.call(this, true);
            if (callback instanceof Function)
                return callback(true, ERRORS[this.id], DB[this.id].title, true);
        }.bind(this), cancel = function () {
            if (callback instanceof Function)
                return callback(false, ERRORS[this.id], DB[this.id].title, false);
        }.bind(this);
        if (APP.confirm)
            APP.confirm(msg, del, cancel, { "okButton": "Delete" });
        else if (window && window.confirm(msg))
            del();
        else
            cancel();
    }
    function DELETE_TABLE_BY_ID(id, editTime) {
        editTime = VALIDATE_EDIT_TIME.call(this, editTime, undefined, "deleted", "deleteTableById");
        DB[id] = {
            "title": DB[id].title,
            "created": DB[id].created,
            "deleted": editTime,
            "lastModified": editTime > DB[id].lastModified ? editTime : DB[id].lastModified,
            "version": this.version + "_" + Base64.Version
        };
    }
    function INITIATE_NEW_DB(title, options, callback) {
        function initiateEmptyDBObjects(id) {
            SEARCH_INDEX[id] = {};
            SEARCH_SUGGESTIONS[id] = [];
            RECENTLY_SEARCHED[id] = [];
            ROW_INDEX_CACHE[id] = {};
        }
        function newDBS() {
            DBS[++NUM] = title;
            //declare private DB object and unique this.id for every new instance of APP.NyckelBDObj()
            this.id = Base64.number_hash(title + Base64.rand(), 12);
            initiateEmptyDBObjects(this.id);
            APP.Sto.setItem("tables", JSON.stringify(DBS));
            return callback(title, options);
        }
        title = TO_PROP_NAME(String(title).replace(/[^A-z\s_0-9]/g, ""));
        APP.Sto && APP.Sto.getItem("tables", null, function (tables) {
            if (tables) {
                DBS = JSON.parse(tables);
                if (DBS.indexOf(title) > -1) {
                    this.id = Base64.number_hash(title + Base64.rand(), 12);
                    initiateEmptyDBObjects(this.id);
                    NUM++;
                    return callback(title, options);
                }
                else
                    newDBS.call(this);
            }
            else
                CACHE_ERROR.call(this, "couldn't find tables");
        }.bind(this), newDBS.bind(this));
    }
    function CHECK_HEADERS_ARRAY(headers) {
        var header, ret = [];
        for (var a = 0, b = 1, len = headers.length; a < len; a++) {
            for (b = a + 1; b < len; b++) {
                if (headers[a] === headers[b])
                    CACHE_ERROR.call(this, headers[a], "duplicate header values");
            }
            ret[a] = TO_PROP_NAME(headers[a]);
        }
        for (var a = 0, b = 1, len = ret.length, c = void 0; a < len; a++) {
            header = ret[a];
            for (c = a + 1, b = 1; c < len; c++) {
                if (ret[c] === header) {
                    while (ret.indexOf(header.replace(/_\d$/, "") + "_" + b) > 0) {
                        b++;
                    }
                    ret[c] = header.replace(/_\d$/, "") + "_" + b;
                    b++;
                }
            }
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
            var str = Base64.write(JSON.stringify(EXPORT_DB.call(this)), key);
            return JSON.stringify({
                "data": str,
                "signature": Base64.hmac(str, key),
                "version": this.version + "_" + Base64.Version
            });
        }
        function syncFile() {
            var title = TO_PROP_NAME(DB[this.id].title);
            if (!DBX_SYNC_OBJ[title] || DB[this.id].lastModified > DBX_SYNC_OBJ[title])
                DBX_SYNC_OBJ[title] = DB[this.id].lastModified;
            return JSON.stringify(DBX_SYNC_OBJ);
        }
        function syncToken(token) {
            if (token) {
                token = typeof token === "string" ? JSON.parse(token) : token;
                if (token.version === this.version + "_" + Base64.Version) {
                    if (token.signature && token.token && token.signature === Base64.hmac(token.token, key)) {
                        var dbxSyncObj = JSON.parse(Base64.read(token.token, key));
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
            var title = TO_PROP_NAME(DB[this.id].title);
            if (!DBX_SYNC_OBJ[title] || DB[this.id].lastModified > DBX_SYNC_OBJ[title])
                DBX_SYNC_OBJ[title] = DB[this.id].lastModified;
            token = Base64.write(JSON.stringify(DBX_SYNC_OBJ), key);
            return JSON.stringify({
                "token": token,
                "signature": Base64.hmac(token, key),
                "version": this.version + "_" + Base64.Version
            });
        }
        if (SYNC_ERROR && new Date().getTime() - SYNC_ERROR_TIME < 6e4)
            return callback instanceof Function ? (callback(false, "try again later", DB[this.id].title, false), false) : false;
        var obj = {
            "title": DB[this.id].title,
            "file": dataString.call(this),
            "syncFile": syncFile.call(this),
            "syncToken": syncToken.call(this, token)
        };
        return callback instanceof Function ? (callback(true, ERRORS[this.id], DB[this.id].title, obj), true) : true;
    }
    function VALIDATE_TYPE(type, options) {
        type = type ? String(type).toLowerCase().replace(/[^a-z]/g, "") : "null";
        if (!options) {
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
            if (options)
                CACHE_ERROR.call(this, type, "customProperties can only be set to string, number, boolean, or any, not");
            else
                CACHE_ERROR.call(this, type, "invalid Header type");
            return "any";
        }
    }
    function APPLY_COLUMN_PROPERTIES(tableHeaders, columnProperties, tableCreated, doNotIndex) {
        function applyHeaders(headers) {
            if (headers && headers.constructor === Array) {
                return CHECK_HEADERS_ARRAY.call(this, headers);
            }
            else if (!headers || typeof headers !== "object")
                return ["id"];
            var _headers = headers, b = 1;
            headers = ["id"];
            for (var a in _headers) {
                if (a !== "id") {
                    headers[b] = a;
                    b++;
                    //initiate columnProperties with unchecked header values (to be fixed later)
                    columnProperties[a] = columnProperties[a] || {};
                    if (typeof _headers[a] === "object") {
                        columnProperties[a].type = columnProperties[a].type || VALIDATE_TYPE.call(this, _headers[a].type);
                    }
                    else if (typeof _headers[a] === "string") {
                        columnProperties[a].type = columnProperties[a].type || VALIDATE_TYPE.call(this, _headers[a]);
                    }
                }
            }
            return CHECK_HEADERS_ARRAY.call(this, headers);
        }
        function apply_Simple_Array() {
            for (var a = 1, b = 0, len = tableHeaders.length; a < len; a++, b++) {
                obj[obj.$headers[a]] = {
                    type: [VALIDATE_TYPE.call(this, columnProperties[b]), time]
                    //TODO add other properties
                    //initialValue: 
                    //search:
                };
                if (obj.$headers[a] !== tableHeaders[a])
                    obj[obj.$headers[a]].exportAs = [tableHeaders[a], time];
                obj.$created[a] = 0;
                obj.$modified[a] = 0;
            }
            return obj;
        }
        function applyArray() {
            for (var a = 1, len = tableHeaders.length; a < len; a++) {
                if (columnProperties[tableHeaders[a]]) {
                    //if given tableHeader name contains a space or invalid character
                    if (!columnProperties[obj.$headers[a]]) {
                        var _badHeader = tableHeaders[a];
                        columnProperties[obj.$headers[a]] = columnProperties[_badHeader];
                        delete columnProperties[_badHeader];
                    }
                    if (typeof columnProperties[obj.$headers[a]] === "string") {
                        //migrate old version of types data forward to be held in an object
                        obj[obj.$headers[a]] = {
                            type: [VALIDATE_TYPE.call(this, columnProperties[obj.$headers[a]]), time]
                            //TODO add other properties
                            //initialValue: 
                            //search:
                        };
                    }
                    else if (columnProperties[obj.$headers[a]].type) {
                        if (columnProperties[obj.$headers[a]].type.constructor === Array)
                            obj[obj.$headers[a]] = {
                                type: [VALIDATE_TYPE.call(this, columnProperties[obj.$headers[a]].type[0]), columnProperties[obj.$headers[a]].type[1]]
                                //TODO add other properties
                                //initialValue: 
                                //search:
                            };
                        else
                            obj[obj.$headers[a]] = {
                                type: [VALIDATE_TYPE.call(this, columnProperties[obj.$headers[a]].type), time]
                                //TODO add other properties
                                //initialValue: 
                                //search:
                            };
                    }
                    else
                        console.log(columnProperties[obj.$headers[a]], "error");
                    if (columnProperties[obj.$headers[a]].exportAs)
                        obj[obj.$headers[a]].exportAs = columnProperties[obj.$headers[a]].exportAs;
                    else if (obj.$headers[a] !== tableHeaders[a])
                        obj[obj.$headers[a]].exportAs = [tableHeaders[a], time];
                }
                else {
                    obj[obj.$headers[a]] = {
                        type: ["any", time]
                        //TODO add other properties
                        //initialValue: 
                        //search:
                    };
                    if (obj.$headers[a] !== tableHeaders[a])
                        obj[obj.$headers[a]].exportAs = [tableHeaders[a], time];
                }
                obj.$created[a] = 0;
                obj.$modified[a] = 0;
            }
            return obj;
        }
        function applyObject() {
            var b = 1;
            for (var a in tableHeaders) {
                if (a !== "id") {
                    obj[obj.$headers[b]] = {
                        type: [typeof columnProperties[a] === "string" ?
                                VALIDATE_TYPE.call(this, columnProperties[a]) : columnProperties[a] && columnProperties[a].type ?
                                VALIDATE_TYPE.call(this, columnProperties[a].type) : "any", time]
                        //TODO add other properties
                        //initialValue: 
                        //search:
                    };
                    if (obj.$headers[b] !== a)
                        obj[obj.$headers[b]].exportAs = [a, time];
                    obj.$created[b] = 0;
                    obj.$modified[b] = 0;
                    b++;
                }
            }
            return obj;
        }
        //columnProperties could be an Array ["string","number"...] or
        //an Object like this {Column_1: "string", Column_2: "number"...} or
        //an Object like this {Column_1:{type: "string"...}, Column_2:{type: "number"...}...} or
        //an Object like this {Column_1:{type: ["string", 9646483]...}, Column_2:{type: ["number", 9683627]...}...}
        columnProperties = columnProperties || {};
        var time = TIMESTAMP(tableCreated), obj = {
            $headers: applyHeaders.call(this, tableHeaders),
            $created: [0],
            $modified: [0],
            $indexable: []
        };
        obj.$indexable = obj.$headers.join("|").split("|"),
            obj.$indexable.splice(0, 1); //remove id
        if (doNotIndex && doNotIndex.constructor === Array) {
            for (var a = 0, len = doNotIndex.length, i = void 0; a < len; a++) {
                i = obj.$indexable.indexOf(TO_PROP_NAME(doNotIndex[a]));
                if (i > -1)
                    obj.$indexable.splice(i, 1);
            }
        }
        if (tableHeaders.constructor === Array) {
            if (tableHeaders[0] !== "id" && obj.$headers.length === tableHeaders.length + 1)
                tableHeaders.unshift("id");
            if (columnProperties.constructor === Array)
                return apply_Simple_Array.call(this); //old db code with types array
            else
                return applyArray.call(this);
        }
        else
            return applyObject.call(this);
    }
    function DELETE_COLUMN(colName, storeBool, editTime, callback) {
        var colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
        if (colIndex > 0) {
            var columns = DB[this.id].columns, col = columns.$headers[colIndex], time = VALIDATE_EDIT_TIME.call(this, editTime, undefined, "column", "deleteColumn");
            for (var a = 0, len = DB[this.id].table.length; a < len; a++) {
                DB[this.id].table[a].splice(colIndex, 1);
                DB[this.id].ids[DB[this.id].table[a][0]].splice(colIndex, 1);
            }
            if (HIDDEN_TABLE_DATA[this.id]) {
                for (var a = 0, len = HIDDEN_TABLE_DATA[this.id].length; a < len; a++) {
                    HIDDEN_TABLE_DATA[this.id][a].splice(colIndex, 1);
                    HIDDEN_IDS[this.id][HIDDEN_TABLE_DATA[this.id][a][0]].splice(colIndex, 1);
                }
            }
            columns.$headers.splice(colIndex, 1);
            columns.$created.splice(colIndex, 1);
            columns.$modified.splice(colIndex, 1);
            columns[col] = {
                type: columns[col].type,
                deleted: [true, time]
            };
            //update search index
            var i = columns.$indexable.indexOf(col);
            if (i > -1) {
                columns.$indexable.splice(i, 1);
            }
            DB[this.id].lastModified = time + DB[this.id].created > DB[this.id].lastModified ? time + DB[this.id].created : DB[this.id].lastModified;
            this.syncPending = true;
            if (storeBool !== false)
                TO_LOCAL_STORAGE.call(this, true);
            if (callback instanceof Function)
                return callback(true, ERRORS[this.id], DB[this.id].title, this.syncPending);
            else
                return true;
        }
        else
            return callback instanceof Function ? callback(false, colName + " column not found", DB[this.id].title, this.syncPending) : false;
    }
    function ADD_COLUMN(colName, type, position, options, storeBool, editTime, callback) {
        function timestamp(val) {
            function isArr(val) {
                return val && val.constructor === Array;
            }
            return isArr(val) ? val : [val, editTime];
        }
        function applyProps(cb) {
            var arr;
            for (var prop in options) {
                arr = timestamp(options[prop]);
                switch (prop) {
                    case "deleted": //taken care of above
                        break;
                    case "initialValue":
                        if (VALUE_IS_VALID.call(this, arr[0], props.type[0]), false, "applyProps")
                            props[prop] = arr;
                        break;
                    case "search":
                        if (VALUE_IS_VALID.call(this, arr[0], "boolean"), false, "applyProps2")
                            props[prop] = arr;
                        break;
                    //TODO add more properties here
                    default: console.log("property not implemented: " + prop);
                }
            }
            cols[colName] = props;
            return cb();
        }
        function updateTable() {
            if (!options.initialValue || options.initialValue && !VALUE_IS_VALID.call(this, options.initialValue[0], props.type[0]), true, "updateTable") {
                if (props.type[0] === "boolean")
                    options.initialValue = false;
                else if (/number|integer|date|postalZipCode|longitude|latitude/i.test(props.type[0]))
                    options.initialValue = 0;
                else if (/any|string|email|password|address|cityCounty|provinceStateRegion|country|name|geoLocation/i.test(props.type[0]))
                    options.initialValue = "";
                else {
                    CACHE_ERROR.call(this, props.type.toString(), "initial value not found for data type");
                    options.initialValue = "";
                }
            }
            //insert empty cell to every row in table
            for (var a = 0, len = DB[this.id].table.length; a < len; a++) {
                DB[this.id].table[a].splice(position, 0, options.initialValue[0]);
                DB[this.id].ids[DB[this.id].table[a][0]].splice(position + 1, 0, editTime);
            }
            if (HIDDEN_TABLE_DATA[this.id]) {
                for (var a = 0, len = HIDDEN_TABLE_DATA[this.id].length; a < len; a++) {
                    HIDDEN_TABLE_DATA[this.id][a].splice(position, 0, options.initialValue[0]);
                    HIDDEN_IDS[this.id][HIDDEN_TABLE_DATA[this.id][a][0]].splice(position + 1, 0, editTime);
                }
            }
            //update search index
            if (props.search[0] !== false) {
                cols.$indexable.push(colName);
            }
            DB[this.id].lastModified = editTime + DB[this.id].created > DB[this.id].lastModified ? editTime + DB[this.id].created : DB[this.id].lastModified;
            this.syncPending = true;
            if (storeBool !== false)
                TO_LOCAL_STORAGE.call(this, true);
            if (callback instanceof Function)
                return callback(true, ERRORS[this.id], DB[this.id].title, this.syncPending);
            else
                return true;
        }
        options = options || {};
        if (this.isDeleted() || options.deleted) {
            return callback instanceof Function ? callback(false, "cannot add deleted column", DB[this.id].title, this.syncPending) : false; //don't add deleted columns to table
        }
        editTime = VALIDATE_EDIT_TIME.call(this, editTime, undefined, "column", "addColumn");
        var orig = String(colName), i = 1, props = {
            type: ["any", editTime],
            search: [true, editTime]
        }, cols = DB[this.id].columns, headers = cols.$headers;
        colName = TO_PROP_NAME(colName);
        if (colName === "id")
            colName = "_id";
        //check if column already existes
        while (GET_INDEX_OF_COLUMN.call(this, colName) > -1) {
            colName = TO_PROP_NAME(orig.replace(/_\d$/, "")) + "_" + i;
            i++;
        }
        props.type[0] = VALIDATE_TYPE.call(this, type);
        if (colName !== orig)
            props.exportAs = [orig, editTime];
        //insert colName to headers
        position = position && position > 0 && position < headers.length ? position : headers.length;
        cols.$created.splice(position, 0, editTime);
        cols.$modified.splice(position, 0, 0);
        headers.splice(position, 0, colName);
        //add column properties
        return applyProps.call(this, updateTable.bind(this));
    }
    function GET_COL_PROP(colName, propName) {
        var colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
        if (colIndex > 0) {
            var prop = DB[this.id].columns[DB[this.id].columns.$headers[colIndex]][propName];
            return prop ? prop[0] : null;
        }
        else
            return undefined;
    }
    function SET_TYPE(colName, type, data, storeBool, editTime, callback) {
        function retError(err) {
            if (data)
                CACHE_ERROR.call(this, err);
            return callback instanceof Function ? callback(returnData, err, DB[this.id].title, this.syncPending) : err;
        }
        function retSuccess(a, b, c, d) {
            return callback instanceof Function ? callback(a, b, c, d) : a;
        }
        function checkRows(rowId, i) {
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
        function setType() {
            if (can_do)
                DB[this.id].columns[colName].type = [VALIDATE_TYPE.call(this, type), editTime];
        }
        function applyData(rowId, i, total) {
            if (can_do && data[colName][rowId]) {
                SET_VAL.call(this, rowId, colName, data[colName][rowId], i === total, editTime);
                delete data[colName][rowId];
            }
        }
        function checkSuccess(a, b, c, d) {
            for (var id in data[colName]) {
                if (data[colName].hasOwnProperty(id))
                    return retError.call(this, "data provided doesn't match table");
            }
            if (can_do) {
                return retSuccess(a, b, c, d);
            }
            else
                return retError.call(this, "cannot apply type to this row, please update data and try again");
        }
        var colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
        if (colIndex === -1)
            return retError.call(this, "column does not exist in the table");
        this.unhideRows(); //TODO iterate through hidden rows without unhiding them(?)
        type = VALIDATE_TYPE.call(this, type);
        colName = TO_PROP_NAME(colName);
        editTime = editTime ? VALIDATE_EDIT_TIME.call(this, editTime, undefined, "column", "set type") : TIMESTAMP(DB[this.id].created);
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
    }
    /**
     * Initialise a new instance of nyckelDB. Note: part of the APP namespace, so use "new APP.nyckelDB(...);"
     * @constructs APP.nyckelDB
     * @param {string} tableTitle the name of the new database
     * @param {string[]|object} tableHeaders an array of the names of all of the columns, or an object containing column header names and properties
     * @param {string[]|object} [columnProperties] optional, if not specified in with tableHeaders, as an array if just types, or an object if also other column properties
     * @param {object} [options] {
     *	customProperties:{
     *	  <property1Name>: {
     *	    initialValue: <value>,
     *	    type: "String", "Boolean" or "Number" <String>
     *	  },
     *	  <property2Name>...
     *	},
     *	importData: <json>, table data that is ready to drop in to the database without parsing
     *	importJSON: <json>, json data that needs to be parsed
     *	importCSV: <string>, CSV data that needs to be converted to JSON and then parsed
     *	doNotIndex: <Array of tableHeaders>, any columns that do not need to ever be search indexed. Can speed up load times
     *	initialIndex: <Array of tableHeaders>, columns to be search indexed on load. Specifying this value can speed up load times
     *	key: <string>,
     *	token: <string>
     * }
     * @param {successCallback} [callback] the callback function
     * @returns {object} methods
     * @property {string} title the database title
     * @property {string} id the randomly generated unique id of the database instance
     * @property {string} Version nyckelDB version number
     * @property {boolean} syncPending whether or not the database has been synchronized with an external file since changes
     */
    function NyckelDBObj(tableTitle, tableHeaders, columnProperties, options, callback) {
        function applyCustomProperties(props) {
            function setInitialValue(type) {
                return type === "string" ? "" : type === "boolean" ? false : 0;
            }
            if (!props)
                return {};
            var _props = {};
            if (props.constructor === Array) {
                for (var a = 0, len = props.length; a < len; a++) {
                    _props[TO_PROP_NAME(props[a])] = [0, 0, "any"];
                }
                return _props;
            }
            else if (typeof props !== "object") {
                CACHE_ERROR.call(this, "Please supply properties in proper format");
                return {};
            }
            var _type = null, _initialValue = 0, _prop;
            for (var prop in props) {
                if (props.hasOwnProperty(prop)) {
                    _prop = TO_PROP_NAME(prop);
                    if (typeof props[prop] === "string") {
                        _type = VALIDATE_TYPE.call(this, props[prop], "custom");
                        _initialValue = setInitialValue(_type);
                        _props[_prop] = [_initialValue, 0, _type];
                    }
                    else if (props[prop].constructor === Array && props[prop].length === 3) {
                        _type = VALIDATE_TYPE.call(this, props[prop][2], "custom");
                        if (VALUE_IS_VALID.call(this, props[prop][0], _type, false, "applyCustomProperties"))
                            _props[_prop] = [props[prop][0], props[prop][1], _type];
                    }
                    else if (typeof props[prop] === "object") {
                        if (props[prop].type) {
                            _props[_prop] = [0, 0, VALIDATE_TYPE.call(this, props[prop].type, "custom")];
                        }
                        else
                            _props[_prop] = [0, 0, "any"];
                        if (props[prop].initialValue && VALUE_IS_VALID.call(this, props[prop].initialValue, _props[_prop][2], false, "applyCustomProperties2")) {
                            _props[_prop][0] = props[prop].initialValue;
                        }
                        else {
                            _type = _props[_prop][2];
                            _initialValue = setInitialValue(_type);
                            _props[_prop][0] = _initialValue;
                        }
                    }
                    else
                        CACHE_ERROR.call(this, prop, "invalid customProperty");
                }
            }
            _type = null;
            _initialValue = null;
            _prop = null;
            return _props;
        }
        function applyData(json) {
            function setColumns(json) {
                if (json) {
                    if ("Version" in json)
                        json.version = json.Version;
                    return json.columns ? APPLY_COLUMN_PROPERTIES.call(this, tableHeaders, json.columns, json.created, options.doNotIndex) :
                        json.types && json.headers || json.version === "0.3_1.1" ?
                            APPLY_COLUMN_PROPERTIES.call(this, json.headers, json.types, json.created, options.doNotIndex) : //migrate old types
                            APPLY_COLUMN_PROPERTIES.call(this, tableHeaders, columnProperties, TIMESTAMP(), options.doNotIndex);
                }
                else
                    return APPLY_COLUMN_PROPERTIES.call(this, tableHeaders, columnProperties, TIMESTAMP(), options.doNotIndex);
            }
            if (!json)
                json = {
                    "title": tableTitle,
                    "created": TIMESTAMP(),
                    "lastModified": 0,
                    "version": this.version + "_" + Base64.Version,
                    "ids": {},
                    "columns": setColumns.call(this, json),
                    "table": [],
                    "properties": properties
                };
            else if ("deleted" in json)
                json = {
                    "title": tableTitle,
                    "created": json.created || TIMESTAMP(),
                    "deleted": json.deleted,
                    "lastModified": json.lastModified !== undefined ? json.lastModified : 0,
                    "version": this.version + "_" + Base64.Version
                };
            else if ("table" in json)
                json = {
                    "title": tableTitle,
                    "created": json && json.created !== undefined ? json.created : TIMESTAMP(),
                    "lastModified": json && json.lastModified !== undefined ? json.lastModified : 0,
                    "version": this.version + "_" + Base64.Version,
                    "ids": json && json.ids ? json.ids : {},
                    "columns": setColumns.call(this, json),
                    "table": json && json.table ? json.table : [],
                    "properties": json && json.properties ? json.properties : properties
                };
            return json;
        }
        function gotCachedTable(json) {
            function returnFunc(success, errors, title, syncChanges) {
                if (success && syncChanges && !errors)
                    return CREATE_BASE64_FILE.call(this, options.key, options.token, callback);
                else if (callback instanceof Function)
                    return callback(success, errors, DB[this.id].title, false);
                else
                    return errors;
            }
            if (!json) {
                console.log('json not found');
                didntGetCachedTable.call(this);
                return;
            }
            if (typeof json === "string")
                json = JSON.parse(json);
            if ("Version" in json)
                json.version = json.Version;
            if (!json.title || json.title !== tableTitle || !json.version || json.created === undefined || json.lastModified === undefined) {
                console.log("properties don't match");
                didntGetCachedTable.call(this);
                return;
            }
            var version = String(json.version).split("_");
            if (json.lastModified < json.created && json.lastModified !== 0 || json.lastModified > TIMESTAMP()) {
                console.log("database lastModified dates are corrupted: " + json.lastModified);
                didntGetCachedTable.call(this);
                return;
            }
            if (String(version[0]) !== String(this.version) && !(String(version[0]) === "0.3" && String(this.version) === "0.4")) {
                console.log("versions do not match", String(version[0]), String(this.version));
                didntGetCachedTable.call(this);
                return;
            }
            if ("data" in json) {
                if (String(version[1]) === String(Base64.Version) && Base64.hmac(json.data, options.key) === json.signature) {
                    json = Base64.read(json.data, options.key);
                    return IMPORT_JSON.call(this, json, returnFunc.bind(this), false, true);
                }
                else {
                    console.log("compressed data is corrupted");
                    didntGetCachedTable.call(this);
                    return;
                }
            }
            else { //loading directly from local storage
                DB[this.id] = applyData.call(this, json);
                BUILD_SEARCH_INDEX.call(this, options.initialIndex || null);
                return CREATE_BASE64_FILE.call(this, options.key, options.token, callback);
            }
        }
        function didntGetCachedTable() {
            console.log("didnt get cached table");
            //creating a brand new table
            DB[this.id] = applyData.call(this, options.importData);
            //validate columns edit time
            var columns = DB[this.id].columns;
            if (columns) {
                for (var a = 1, headers = columns.$headers, len = headers.length, colProp = void 0; a < len; a++) {
                    for (colProp in columns[headers[a]]) {
                        columns[headers[a]][colProp][1] = VALIDATE_EDIT_TIME.call(this, columns[headers[a]][colProp][1], undefined, "column", "didn't get cached table");
                    }
                }
            }
            //validate ids
            for (var id in DB[this.id].ids) {
                if (DB[this.id].ids.hasOwnProperty(id)) {
                    for (var a = 0; a < DB[this.id].ids[id].length; a++) {
                        DB[this.id].ids[id][a] = VALIDATE_EDIT_TIME.call(this, DB[this.id].ids[id][a], undefined, a === 0 ? "row" : "cell", "didn't get cached table", id);
                    }
                }
            }
            for (var prop in DB[this.id].properties) {
                if (DB[this.id].properties.hasOwnProperty(prop)) {
                    DB[this.id].properties[prop][1] = VALIDATE_EDIT_TIME.call(this, DB[this.id].properties[prop][1], undefined, "property", "didn't get cached table");
                }
            }
            properties = null;
            if (options.importJSON)
                IMPORT_JSON.call(this, options.importJSON, function (success, errors, title, syncChanges) {
                    return CREATE_BASE64_FILE.call(this, options.key, options.token, callback);
                }, false, false);
            else {
                TO_LOCAL_STORAGE.call(this, true);
                return CREATE_BASE64_FILE.call(this, options.key, options.token, callback);
            }
        }
        function initiateTable(title, options) {
            tableTitle = title;
            if (options.importData && options.importData.properties)
                options.importData.properties = applyCustomProperties.call(this, options.importData.properties);
            else if (options.customProperties)
                properties = applyCustomProperties.call(this, options.customProperties);
            //try to get cached table
            if (APP.Sto)
                APP.Sto.getItem(tableTitle, null, gotCachedTable.bind(this), didntGetCachedTable.bind(this));
            else
                return callback instanceof Function ? callback(false, "localStorage not found", tableTitle, false) : "localStorage not found";
        }
        NUM = NUM === undefined ? -1 : NUM;
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
        options = options ? JSON.parse(JSON.stringify(options)) : {};
        if (typeof options.importData === "string")
            options.importData = JSON.parse(options.importData);
        if (options.importData && (options.importData.lastModified < options.importData.created && options.importData.lastModified !== 0 || options.importData.lastModified > TIMESTAMP())) {
            console.log("importData lastModified dates are corrupted: " + options.importData.lastModified);
        }
        tableTitle = options.importData && options.importData.title ? options.importData.title : tableTitle;
        var properties = {};
        this.syncPending = true;
        this.version = "0.4";
        if (tableTitle == null) { // eslint-disable-line
            return callback instanceof Function ? (callback(false, "title not defined", null, false), this) : CACHE_ERROR.call(this, "title not defined"), this;
        }
        else {
            if (options.importData && options.importData.data) {
                if (options.importData.version !== this.version + "_" + Base64.Version && options.importData.version !== this.version + "." + Base64.Version) {
                    return callback instanceof Function ? (callback(false, "imported database version not supported", null, false), this) : CACHE_ERROR.call(this, "imported database version not supported"), this;
                }
                else if (Base64.hmac(options.importData.data, options.key) === options.importData.signature) {
                    options.importData = JSON.parse(Base64.read(options.importData.data, options.key));
                    INITIATE_NEW_DB.call(this, tableTitle, options, initiateTable.bind(this));
                }
                else
                    return callback instanceof Function ? (callback(false, "imported databse corrupted", null, false), this) : CACHE_ERROR.call(this, "imported database corrupted"), this;
            }
            else
                INITIATE_NEW_DB.call(this, tableTitle, options, initiateTable.bind(this));
        }
    }
    //ALL CAPS "PRIVATE" VARIABLES
    var DB; //all databases, contains objects in form 
    /*
     * {
     *	title: String,
     *	created: Number,
     *	lastModified: Number,
     *	version: String,
     *	deleted?: Number,
     *	columns?: { },
     *	ids?: { }
     *	table?:[2d Array],
     *	properties?: { }
     * }
     */
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
    var VALID_TYPES = new RegExp("^(" + ["any", "number", "integer", "posInteger", "negInteger", "boolean", "string",
        "uniqueString", "multilineString", "date", "email", "phoneNumber", "password", "formattedAddress",
        "streetAddress", "mailAddress", "cityCounty", "provinceStateRegion", "country", "postalZipCode",
        "givenName", "familyName", "geoLocation", "longitude", "latitude"].join("|") + ")$");
    var VALID_STRING_TYPES = new RegExp("^(" + ["any", "string", "uniqueString", "multilineString", "date",
        "email", "phoneNumber", "password", "formattedAddress", "streetAddress", "mailAddress", "cityCounty",
        "provinceStateRegion", "country", "postalZipCode", "givenName", "familyName", "geoLocation"].join("|") + ")$");
    var VALID_NUMBER_TYPES = new RegExp("^(" + ["any", "number", "integer", "posInteger", "negInteger", "date",
        "phoneNumber", "password", "postalZipCode", "longitude", "latitude"].join("|") + ")$");
    /**
     * Search for rows that contain all of the words given in the search query
     * @function search
     * @param {string} searchQuery words to search for in the database
     * @param {object} options {
     *	"colNames": Array, an Array of columns to search in
     *	"fuzzyMatch": Boolean
     * }
     * @param {searchCallback} callback callback function
     * @returns {string[]} an Array of row ids which contain the searchQuery
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
            ids = ids.concat(DELETE_DUPLICATES(findMatches.call(this, tempIds, aLen)));
            if (ids.length > 0) {
                RECENTLY_SEARCHED[this.id] = DELETE_DUPLICATES(searchQuery.concat(RECENTLY_SEARCHED[this.id]));
                RECENTLY_SEARCHED[this.id] = RECENTLY_SEARCHED[this.id].slice(0, 25);
                STO_SEARCH_INDEX.call(this);
            }
            if (lastRoundBool)
                return callback instanceof Function ? callback(ids, ERRORS[this.id], DB[this.id].title, this.syncPending) : ids;
        }
        function fuzzyMatch(searchQueryArr) {
            //collect all possible alternate queries
            for (var a_1 = 0, lenA = searchQueryArr.length; a_1 < lenA; a_1++) {
                if (Spelling[searchQueryArr[a_1]]) {
                    searchQueryArr[a_1] = Spelling[searchQueryArr[a_1]].split(" ");
                }
                //	else searchQueryArr[a] = [searchQueryArr[a]]; //commented out b/c wrong? searchQueryArr is already an array
            }
            //combine them in all possible combinations
            var queries = [], a = 0, n = 0, cursor = [], len = searchQueryArr.length;
            while (len)
                cursor[--len] = 0; //initialize cursors
            len = searchQueryArr.length;
            //while the last item in the last column has not been reached
            while (searchQueryArr[n]) {
                //initiate the new combination
                queries[a] = [searchQueryArr[0][cursor[0]]];
                //write the new combination
                for (var c = 1; c < len; c++) {
                    queries[a].push(searchQueryArr[c][cursor[c]]);
                }
                a++;
                n = 0;
                cursor[n]++;
                while (n <= len && cursor[n] === searchQueryArr[n].length) {
                    cursor[n] = 0;
                    cursor[n + 1]++;
                    n++;
                    if (n === len)
                        break;
                }
            }
            for (var a_2 = 0, len_1 = queries.length - 1; a_2 < len_1; a_2++) {
                querySearchIndex.call(this, queries[a_2], false);
            }
            return querySearchIndex.call(this, queries[queries.length - 1], true);
        }
        function search(searchQueryArr, options) {
            if (options.fuzzyMatch)
                fuzzyMatch.call(this, searchQueryArr);
            else
                querySearchIndex.call(this, searchQueryArr, true);
        }
        if (this.isDeleted())
            return callback instanceof Function ? callback([], "no data", DB[this.id].title, this.requiresSync) : null;
        options = options || {};
        var cols = options.colNames ? options.colNames.join("|").split("|") : undefined, ids = [], searchQueryArr = SEARCH_VALIDATE(searchQuery);
        //check for search index
        BUILD_SEARCH_INDEX.call(this, cols, search.bind(this, searchQueryArr, options));
    };
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
     * @returns {array} an Array of row ids which contain the searchQuery
     */
    NyckelDBObj.prototype.advancedSearch = function (searchQuery, options, callback) {
        function filter(ids, filterOutQueries) {
            if (filterOutQueries.length === 0) {
                return callback instanceof Function ? callback(ids, ERRORS[this.id], DB[this.id].title, this.syncPending) : ids;
            }
            var _loop_2 = function (b, lenB) {
                (function (self, b) {
                    self.search.call(self, filterOutQueries[b], options, function (result, err, table, sync) {
                        if (!err)
                            filterIds = filterIds.concat(result);
                        else
                            return callback instanceof Function ? callback([], err, table, sync) : [];
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
                            return callback instanceof Function ? callback(ids, ERRORS[self.id], DB[self.id].title, self.syncPending) : ids;
                        }
                    });
                })(this_2, b);
            };
            var this_2 = this;
            for (var b = 0, lenB = filterOutQueries.length; b < lenB; b++) {
                _loop_2(b, lenB);
            }
        }
        if (!searchQuery)
            return callback instanceof Function ? callback([], "no query supplied", DB[this.id].title, this.syncPending) : null;
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
        var _loop_1 = function (a, len) {
            (function (self, a) {
                self.search.call(self, searchQueryArr[a], options, function (result, errors, table, sync) {
                    if (!errors)
                        ids = ids.concat(result);
                    else
                        return callback instanceof Function ? callback([], errors, table, sync) : [];
                    if (a === len - 1) {
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
    /**
     * Get search suggestions from partial words, for example, as you type in a search box
     * @function getSearchSuggestions
     * @param {string} searchQuery partial search query
     * @param {object} [options] {
     *	"colNames": Array, an Array of columns to search in
     * }
     * @param {suggestionsCallback} [callback] callback function
     * @returns {array} an Array of search queries that would return a match
     */
    NyckelDBObj.prototype.getSearchSuggestions = function (searchQuery, options, callback) {
        function buildSuggestionsList() {
            searchQuery = searchQuery.split(" ");
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
            return callback instanceof Function ? callback(suggest, ERRORS[this.id], DB[this.id].title, this.syncPending) : suggest;
        }
        if (SEARCH_SUGGESTIONS[this.id].length > 0) {
            buildSuggestionsList.call(this);
        }
        else {
            var cols = options.colNames ? options.colNames.join("|").split("|") : null;
            if (callback instanceof Function)
                callback([], "currently busy building search index", DB[this.id].title, this.requiresSync);
            BUILD_SEARCH_INDEX.call(this, cols);
            return [];
        }
    };
    /**
     * forEachRow funct
     * @callback eachRowCallback
     * @param {string} rowId the id of the current row
     * @param {number} is the position in the table of the current row
     * @param {number} of the total number of rows in the table (% complete = is/of)
     */
    /**
     * Iterate through all (unhidden) rows in a table (in the current sorted order). Passes row ids to funct in sequence and executes funct
     * @function forEachRow
     * @param {eachRowCallback} funct the function to execute for each row in the table, parameters: rowId, rowIndex, tableLength
     * @param {successCallback} [callback] callback function to execute when everything is finished
     * @returns {object} this
     */
    NyckelDBObj.prototype.forEachRow = function (funct, callback) {
        if (funct instanceof Function) {
            for (var a = 0, len = this.getLength(); a < len; a++) {
                funct(DB[this.id].table[a][0], a, len);
            }
            return callback instanceof Function ? (callback(true, ERRORS[this.id], DB[this.id].title, this.syncPending), this) : this;
        }
    };
    /**
     * forEachCol funct, use parameters 'isIndexNum' and 'ofNumCols' to get progress
     * @callback eachColCallback
     * @param {string} colName the name of the current column
     * @param {number} isIndexNum the position in the table of the current column
     * @param {number} ofNumCols the total number of columns in the table (% complete = isIndexNum/ofNumCols)
     */
    /**
     * Iterate through all columns in a table. Passes the column name to funct in sequence and executes funct
     * @function forEachCol
     * @param {eachColCallback} funct the function to execute for each column in the table
     * @param {successCallback} [callback] callback function to execute after everything is finished
     * @returns {object} this
     */
    NyckelDBObj.prototype.forEachCol = function (funct, callback) {
        if (funct instanceof Function) {
            for (var a = 1, headers = DB[this.id].columns.$headers, len = headers.length; a < len; a++) {
                funct(headers[a], a - 1, len - 1);
            }
            return callback instanceof Function ? (callback(true, ERRORS[this.id], DB[this.id].title, this.syncPending), this) : this;
        }
    };
    /**
     * Get the title of the table
     * @function getTitle
     * @returns {string} table title
     */
    NyckelDBObj.prototype.getTitle = function () { return DB[this.id] ? DB[this.id].title : undefined; };
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
        return INITIATE_NEW_DB.call(this, newTitle, undefined, function (newTitle) {
            //copy table and newTitle to new id
            DB[this.id] = JSON.parse(JSON.stringify(DB[oldId]));
            DB[this.id].title = newTitle;
            //cache oldTitle to maintain syncability
            if (DB[this.id].previousTitle)
                DB[this.id].previousTitle.push(TO_PROP_NAME(oldTitle));
            else
                DB[this.id].previousTitle = [TO_PROP_NAME(oldTitle)];
            //delete old table
            DELETE_TABLE_BY_ID.call(this, oldId, TIMESTAMP());
            oldId = null;
            //update lastModified
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
            return callback instanceof Function ? (callback(true, ERRORS[this.id], DB[this.id].title, true), this) : this;
        }.bind(this));
    };
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
            a = a[colIndex];
            b = b[colIndex];
            //try to compare items as numbers
            if (!isNaN(Number(a)) && !isNaN(Number(b))) {
                a = Number(a);
                b = Number(b);
            }
            //optionally sort string backwards <-- (from this end)
            if (options.fromEndOfStrBool) {
                a = reverseStr(a);
                b = reverseStr(b);
            }
            return a === b ? 0 : a < b ? -1 : 1;
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
    };
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
    };
    /**
     * Get a number of cell values from the table at once
     * @function getVals
     * @param {string[]|number[]} rowIds can be an Array of the index of the row, or it's 3 digit identifier
     * @param {string[]} colNames is an Array the column names from the table header
     * @param {getValsCallback} [callback] callback function
     * @returns {array|boolean} 2d array of table values, or false if nothing found
     */
    NyckelDBObj.prototype.getVals = function (rowIds, colNames, callback) {
        if (!rowIds || rowIds.constructor !== Array || !colNames || colNames.constructor !== Array) {
            return callback instanceof Function ? callback(false, "invalid inputs", DB[this.id].title, this.syncPending) : false;
        }
        var rowIndex, colIndex, ret = [], a, b, x, y, len = rowIds.length, lenB = colNames.length;
        for (a = 0, x = 0; a < len; a++) {
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
                        return callback instanceof Function ? callback(false, colNames[b] + " is not a valid colName", DB[this.id].title, this.syncPending) : false;
                    }
                }
                x++;
            }
            else if (!ROW_ID_IS_VALID.call(this, rowIds[a])) {
                return callback instanceof Function ? callback(false, rowIds[a] + " is not a valid rowId", DB[this.id].title, this.syncPending) : false;
            }
        }
        rowIndex = null;
        colIndex = null;
        x = null;
        y = null;
        a = null;
        b = null;
        len = null;
        lenB = null;
        return callback instanceof Function ? callback(ret, ERRORS[this.id], DB[this.id].title, this.syncPending) : ret;
    };
    /**
     * Get an entire row from the table as JSON arranged by column name. Returns column name, column type and value
     * @function getRow
     * @param {string|number} rowId the row's id, or its current index
     * @param {getRowCallback} [callback] callback
     * @returns {object|boolean} json formatted data, or false if nothing found
     */
    NyckelDBObj.prototype.getRow = function (rowId, callback) {
        var rowIndex = GET_INDEX_OF_ROW.call(this, rowId), ret = {};
        if (rowIndex > -1) {
            this.forEachCol(function (colName, is) {
                ret[colName] = {
                    column: colName,
                    type: DB[this.id].columns[colName].type[0],
                    value: DB[this.id].table[rowIndex][is + 1]
                };
                if (DB[this.id].columns[colName].exportAs)
                    ret[colName].column = DB[this.id].columns[colName].exportAs[0];
            }.bind(this), function (success, errors, title, syncPending) {
                return callback instanceof Function ? callback(ret, errors, title, syncPending) : ret;
            });
        }
        else
            return callback instanceof Function ? callback(false, "row id not found", DB[this.id].title, this.syncPending) : false;
    };
    /**
    * Get an blank row from the table as JSON arranged by column name
    * @function getRowTemplate
    * @param {getRowCallback} [callback] callback
    */
    NyckelDBObj.prototype.getRowTemplate = function (callback) {
        var ret = {};
        this.forEachCol(function (colName) {
            ret[colName] = {
                column: colName,
                type: DB[this.id].columns[colName].type[0]
            };
            if (DB[this.id].columns[colName].exportAs)
                ret[colName].column = DB[this.id].columns[colName].exportAs[0];
        }.bind(this), function (success, errors, title, syncPending) {
            return callback instanceof Function ? callback(ret, errors, title, syncPending) : ret;
        });
    };
    /**
    * Get the row header names as an Array
    * @function getHeaders
    * @param {getHeadersCallback} [callback] callback
    * @returns {string[]} header names
    */
    NyckelDBObj.prototype.getHeaders = function (callback) {
        var ret = [];
        for (var a = 1, headers = DB[this.id].columns.$headers, len = headers.length; a < len; a++) {
            ret[a - 1] = headers[a];
        }
        return callback instanceof Function ? callback(ret, false, DB[this.id].title, this.syncPending) : ret;
    };
    /**
     * Exports table as CSV string. Not implemented yet
     * @function toCSV
     * @returns {string} database in CSV string format
     */
    NyckelDBObj.prototype.toCSV = function () {
        //TODO
        return "function not complete";
    };
    /**
     * exports table as JSON 2d array
     * @function toJSON_Array
     * @returns {array} database in array format
     */
    NyckelDBObj.prototype.toJSON_Array = function () {
        return SAVE_FILE.call(this, JSON.stringify(DB[this.id]), DB[this.id].title + "_" + READABLE_TIMESTAMP() + ".json");
    };
    /**
     * Exports table as JSON key value pairs. Not implemented (and may not...?)
     * @function toJSON_KeyValuePairs
     * @returns {json} database in json format
     */
    NyckelDBObj.prototype.toJSON_KeyValuePairs = function () {
        //TODO
        return "function not complete";
    };
    /**
     * Get the value of a table custom property
     * @function getProp
     * @param {string} propName the name of the custom property
     * @returns {string|number|boolean} the property value
     */
    NyckelDBObj.prototype.getProp = function (propName) {
        propName = TO_PROP_NAME(propName);
        return DB[this.id].properties && DB[this.id].properties[propName] ? DB[this.id].properties[propName][0] : undefined;
    };
    /**
     * Get the number of (unhidden, unfiltered) rows in the table
     * @function getLength
     * @returns {number} the number of rows in the table
     */
    NyckelDBObj.prototype.getLength = function () {
        return !DB[this.id] || this.isDeleted() ? 0 : DB[this.id].table.length;
    };
    /**
     * Check if the table has been deleted or not
     * @function isDeleted
     * @returns {boolean} whether or not the table has been deleted
     */
    NyckelDBObj.prototype.isDeleted = function () {
        return DB[this.id] && DB[this.id].deleted !== undefined ? true : false;
    };
    /**
     * Shuffle the order of the rows in the table
     * @function shuffle
     * @returns {object} this
     */
    NyckelDBObj.prototype.shuffle = function () {
        function shuffle(array) {
            var len = array.length, halfLen = Math.ceil(len / 2), random = Base64.rand(halfLen).split(""), r = 0;
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
        if (!this.isDeleted()) {
            var len = this.getLength(), shuffled = shuffle(DB[this.id].table);
            if (shuffled.length !== len) {
                CACHE_ERROR.call(this, "shuffle error " + len + " != " + this.getLength());
                len = null;
                shuffled = null;
            }
            else {
                DB[this.id].table = shuffled;
                ROW_INDEX_CACHE[this.id] = {};
                len = null;
                shuffled = null;
                return this;
            }
        }
    };
    /**
     * Get a row's current position in the table. You can supply either a row id, or else both a value and colName to find the first row that contains that value in the given column.
     * @function getIndexOf
     * @param {string} [id] row id
     * @param {string|number|boolean} [orValue] cell value
     * @param {string} [colName] is the column name from the table header
     * @returns {number} zero based index of a row's current position in the table, -1 if not found
     */
    NyckelDBObj.prototype.getIndexOf = function (id, orValue, colName) {
        if (this.isDeleted())
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
        }
        else
            return -1;
    };
    /**
     * Hide a row. The row will not be accessible at all until you call unHideRows.
     * @function hideRow
     * @param {number|string} rowId can be the index of the row, or it's 3 digit identifier
     * @returns {object} this
     */
    NyckelDBObj.prototype.hideRow = function (rowId) {
        if (!this.isDeleted()) {
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
    /**
     * Make all hidden rows accessible again
     * @function unhideRows
     * @returns {object} this
     */
    NyckelDBObj.prototype.unhideRows = function () {
        if (HIDDEN_TABLE_DATA[this.id] !== undefined) {
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
    /**
     * Make all hidden rows accessible again (another way to call unHideRows)
     * @function unfilter
     * @returns {object} this
     */
    NyckelDBObj.prototype.unfilter = function () {
        return this.unhideRows();
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
    /**
     * Add a new row to the table.
     * @function addRow
     * @param {array} array a complete array, or a JSON object in form {[colName]: {value: [value]},..}
     * @param {string} [id] id is optional and will only be used if it doesn't already exist
     * @returns {string} new row id
     */
    NyckelDBObj.prototype.addRow = function (array, id) {
        if (array && array.constructor !== Array && typeof array === "object") {
            //convert object to array
            var _array = [], a = 0;
            this.forEachCol.call(this, function (col) {
                if (array[col] && array[col].value)
                    _array[a] = array[col].value;
                a++;
            }, function () {
                return ADD_ROW.call(this, _array, id);
            }.bind(this));
        }
        else
            return ADD_ROW.call(this, array, id);
    };
    /**
     * Change the value of a cell
     * @function setVal
     * @param {number|string} rowId can be the index of the row, or it's 3 digit identifier
     * @param {string} colName is the column name from the table header
     * @param {string|number|boolean} newValue the new value to apply to the cell
     * @param {setCallback} [callback] callback function
     * @returns {string|number|boolean} the actual value that was set after passing through data validation
     */
    NyckelDBObj.prototype.setVal = function (rowId, colName, newValue, callback) {
        return SET_VAL.call(this, rowId, colName, newValue, true, null, callback);
    };
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
                return callback(true, ERRORS[this.id], DB[this.id].title, true);
        }
        var len = 0, a = 0;
        for (var i in newValues) {
            len++;
        }
        for (var value in newValues) {
            if (newValues[value].column && COL_NAME_IS_VALID.call(this, newValues[value].column)) {
                SET_VAL.call(this, rowId, newValues[value].column, newValues[value].value, true, null, ret.bind(this));
            }
        }
    };
    /**
     * Delete a row along with all the data that it contains
     * @function deleteRow
     * @param {string|number} rowId the row's id, or its current index
     * @returns {boolean} success
     */
    NyckelDBObj.prototype.deleteRow = function (rowId) {
        return DELETE_ROW.call(this, rowId);
    };
    /**
     * Merge two copys of the same NyckelDB table (same title, column headers and column types) into one
     * @function importJSON
     * @param {json} json an exported NyckelDB object
     * @param {string} syncKey the key used to obfuscate the data
     * @param {string} syncToken the obfuscated version number, hashed message authentication code (HMAC), and lastSync timestamp of the NyckelDB json object
     * @param {function} [callback] callback function
     * @returns {object} this
     */
    NyckelDBObj.prototype.importJSON = function (json, syncKey, syncToken, callback) {
        return IMPORT_JSON.call(this, json, function (success, errors, title, syncChanges) {
            if (success && syncChanges && !errors)
                return CREATE_BASE64_FILE.call(this, syncKey, syncToken, callback), this;
            else
                return callback instanceof Function ? (callback(success, errors, title, false), this) : this;
        }.bind(this), syncKey, false);
    };
    /**
     * Delete a table along with all the data that it contains, including custom properties
     * @function deleteTable
     * @param {function} [callback] callback function
     * @returns {object} this
     */
    NyckelDBObj.prototype.deleteTable = function (callback) {
        return DELETE_TABLE.call(this, callback);
    };
    /**
     * Clear all the locally cached copies of all the NyckelDB databases.
     * @function NUKEALL
     * @param {string} msg the message that you want to tell the user before you blow everything up!
     * @param {successCallback} [callback] callback function
     */
    NyckelDBObj.prototype.NUKEALL = function (msg, callback) {
        function nuke() {
            if (APP.Sto) {
                for (var a = 0, len = DBS.length; a < len; a++) {
                    APP.Sto.deleteItem(DBS[a]);
                    APP.Sto.deleteItem("searchIndex_" + DBS[a]);
                }
                APP.Sto.deleteItem("tables");
            }
            DB = new Array(Math.pow(2, 32) - 1);
            NUM = -1;
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
            SYNC_ERROR_TIME = null;
            if (callback instanceof Function)
                return callback(true, null, null, true), this;
            else
                return this;
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
    /**
     * Checks whether there are changes since the last time the database was synchronized
     * @function isSyncPending
     * @param {string} cloudSyncFile token that contains the version number, hashed message authentication code (HMAC) and lastSync timestamp of the database
     * @param {successCallback} [callback] callback function
     * @returns {boolean} whether or not sync is needed
     */
    NyckelDBObj.prototype.isSyncPending = function (cloudSyncFile, callback) {
        function ret(val) {
            return callback instanceof Function ? callback(true, ERRORS[this.id], DB[this.id].title, val) : val;
        }
        if (cloudSyncFile) {
            if (typeof cloudSyncFile === "string")
                cloudSyncFile = JSON.parse(cloudSyncFile);
            var title = TO_PROP_NAME(DB[this.id].title);
            if (!cloudSyncFile[title] && cloudSyncFile[title] !== 0 || parseInt(cloudSyncFile[title]) !== DB[this.id].lastModified) {
                this.syncPending = true;
                return ret.call(this, true);
            }
            else
                return ret.call(this, false);
        }
        else
            return ret.call(this, this.syncPending);
    };
    /**
     * Synchronize with an external copy of the database.
     * @function sync
     * @param {json} json nyckeldb json
     * @param {json} [options] {
     *	forceSync: true, (false is default)
     *	key: a String,
     *	oldKey: a String,
     *	token: a String
     * }
     * @param {function} [callback] callback function
     * @return {object} this
     */
    NyckelDBObj.prototype.sync = function (json, options, callback) {
        function retError(msg) {
            callback instanceof Function ? (callback(false, msg, DB[this.id].title, false), this) : this;
        }
        function sync() {
            function read(data, key, change) {
                if (change) {
                    DB[this.id].lastModified = TIMESTAMP();
                    this.syncPending = true;
                }
                return Base64.read(data, key);
            }
            //		console.log("signature", json.signature);
            //		console.log("readKey", readKey, Base64.hmac(json.data, readKey));
            //		console.log("initialKey", options.initialKey, Base64.hmac(json.data, options.initialKey));
            //		console.log("null", null, Base64.hmac(json.data, null));
            switch (json.signature) {
                case Base64.hmac(json.data, readKey):
                    json = read.call(this, json.data, readKey, false);
                    break;
                case Base64.hmac(json.data, options.initialKey):
                    json = read.call(this, json.data, options.initialKey, true);
                    break;
                case Base64.hmac(json.data, null):
                    json = read.call(this, json.data, null, true);
                    break;
                default:
                    //wrong key, put user through key update ui and try again
                    SYNC_ERROR = true;
                    SYNC_ERROR_TIME = new Date().getTime();
                    return retError.call(this, "wrong key used");
            }
            return IMPORT_JSON.call(this, json, function (success, errors, title, changes) {
                if (success && !errors && (changes || this.syncPending === true || forceSync === true)) {
                    return CREATE_BASE64_FILE.call(this, writeKey, options.token, callback);
                }
                else
                    return callback instanceof Function ? (callback(true, ERRORS[this.id], title, false), this) : this;
            }.bind(this), false, false);
        }
        function keyMigration() {
            if (options.oldKey !== undefined && options.key && options.oldKey !== options.key) {
                readKey = options.oldKey;
                DB[this.id].lastModified = TIMESTAMP();
                this.syncPending = true;
            }
        }
        options = options || {};
        var forceSync = options.forceSync || false, readKey = options.key || false, writeKey = options.key || false, wait = MAX_SYNC_FREQUENCY + DBX_SYNC_OBJ[DB[this.id].title] - TIMESTAMP();
        if (options === true)
            forceSync = true;
        keyMigration.call(this);
        if (wait > 0 && !forceSync)
            return retError.call(this, "rate limited, try again in " + wait + " minutes");
        else if (SYNC_ERROR && new Date().getTime() - SYNC_ERROR_TIME < 6e4)
            return retError.call(this, "try again later");
        else if (!json)
            return CREATE_BASE64_FILE.call(this, writeKey, options.token, callback);
        else if (typeof json === "string")
            json = JSON.parse(json);
        if (!json.data || !(json.version === "0.3_1.1" && this.version === "0.4" || //sync takes into account all changes from v0.3 to 0.4
            json.version === this.version + "_" + Base64.Version ||
            json.version === this.version + "." + Base64.Version)) {
            return retError.call(this, "unsupported version:" + json.version);
        }
        return sync.call(this);
    };
    /**
     * Get the timestamp of when the table was most recently changed
     * @function getLastModified
     * @return {number} database lastModified timestamp
     */
    NyckelDBObj.prototype.getLastModified = function () {
        return DB[this.id].lastModified;
    };
    /**
     * Get the 'type' that has been set on a particular column
     * @function getType
     * @param {string} colName the name of the column
     * @return {string} a column type
     */
    NyckelDBObj.prototype.getType = function (colName) {
        return GET_COL_PROP.call(this, colName, "type");
    };
    /**
     * Change the column's data validation 'type'
     *     Not complete
     * @function setType
     * @param {string} colName is the column name from the table header
     * @param {string} type the type of data validation to set for the given column
     * @param {array} data updated column data that validates to the new type
     * @param {setCallback} [callback] callback function
     * @return {string} actual type set
     */
    NyckelDBObj.prototype.setType = function (colName, type, data, callback) {
        return SET_TYPE.call(this, colName, type, data, true, false, callback);
    };
    /**
     * Same as isSyncPending but sets the value of syncPending to true if the cloudSyncFile validates
     * @function setSyncCompleted
     * @param {string} cloudSyncFile token that contains the version number, hashed message authentication code (HMAC) and lastSync timestamp of the database
     * @param {successCallback} [callback] callback function
     * @returns {boolean} whether or not sync is needed
     */
    NyckelDBObj.prototype.setSyncCompleted = function (cloudSyncFile, callback) {
        if (cloudSyncFile && this.isSyncPending(cloudSyncFile)) {
            if (callback instanceof Function) {
                return callback(false, "syncfile supplied doesn't match lastModified time of the database: " + DB[this.id].lastModified + JSON.stringify(cloudSyncFile), DB[this.id].title, true);
            }
            else
                return false;
        }
        else {
            this.syncPending = false;
            return callback instanceof Function ? callback(true, false, DB[this.id].title, false) : true;
        }
    };
    /**
     * Add a new column to the table
     * @function addColumn
     * @param {string} colName new column name
     * @param {number} position insert new column before column number, ie 1 adds it before the 1st column. If 0 or not specified, adds to end of table
     * @param {object} [options] an Object of column properties: {
     *	type: String,
     *	initialValue: the initial value for every new cell in the new column,
     *	formula: String,
     *	search: Boolean whether to index column for searches
     * }
     * @param {function} [callback] callback function
     * @returns {boolean|string} success or errors
     * @since 0.4
     */
    NyckelDBObj.prototype.addColumn = function (colName, position, options, callback) {
        return ADD_COLUMN.call(this, colName, options && options.type ? options.type : "any", position, options, true, null, callback);
    };
    /**
     * Delete a column from the table
     * @function deleteColumn
     * @param {string} colName the name of the column to delete
     * @param {function} [callback] callback
     * @returns {boolean} success
     * @since 0.4
     */
    NyckelDBObj.prototype.deleteColumn = function (colName, callback) {
        return DELETE_COLUMN.call(this, colName, true, null, callback);
    };
    /**
     * Change the name of a column
     *       Function not complete
     * @function renameColumn
     * @param {string} colName is the current column name from the table header
     * @param {string} newName the new name to apply to the column
     * @param {setCallback} [callback] callback function
     * @returns {string} actual name set
     * @since 0.4
     */
    NyckelDBObj.prototype.renameColumn = function (colName, newName, callback) {
        colName = TO_PROP_NAME(colName);
        newName = TO_PROP_NAME(newName);
        //TODO check for other columns of the same name
        //check for other columns exportAs name of the same name
        //TODO change name in search index
        return newName;
    };
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
    //TODO share function
    return NyckelDBObj;
}());
