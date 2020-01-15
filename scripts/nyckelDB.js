"use strict";
/* eslint-disable */
//depenancies
var APP, Base64, Windows, cordova, Spelling;
;
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
    function TIMESTAMP(wRefTo = 0) {
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
            for (let depth = 1, len = str.length; position < len; position++) {
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
        for (let c = 0, len = str.length; c < len; c++) {
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
                for (let a = 0, len = headers.length, column; a < len; a++) {
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
            for (let a = 0, len = DB[this.id].table.length; a < len; a++) {
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
            for (let a = 0, len = HIDDEN_TABLE_DATA[this.id].length; a < len; a++) {
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
            for (let a = 1, len = headers.length, column; a < len; a++) {
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
    function TO_LOCAL_STORAGE(changes = false) {
        function save() {
            if (typeof changes === "undefined" || changes === true) {
                //check for and surface hidden values before save
                console.log("saving to localStorage");
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
                return callback.call(this, success, err, changes);
        }
        function applyJSON(json) {
            function checkDBForMissingItems() {
                //check for errors
                var missing = [];
                for (let item in json.ids) {
                    if (!DB[this.id].ids[item] && json.ids[item][0] !== "del") {
                        missing.push(item);
                    }
                }
                if (missing.length > 0) {
                    CACHE_ERROR.call(this, missing, "import did not complete sucessfully");
                    for (let a = 0, lenA = missing.length, d, lenD; a < lenA; a++) {
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
                for (let colName in columns.meta) {
                    //go through all metadata and delete deleted columns 
                    if (columns.meta[colName].deleted && DB[this.id].columns.meta[colName] && !DB[this.id].columns.meta[colName].deleted) {
                        DELETE_COLUMN.call(this, colName, false, columns.meta[colName].deleted[1]);
                    }
                }
                for (let a = 1, lenA = DB[this.id].columns.headers.length, colIndex, colName, prop; a < lenA; a++) {
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
                                columns.meta[colName][prop][0] !== DB[this.id].columns.meta[colName][prop][0] &&
                                columns.meta[colName][prop][1] > DB[this.id].columns.meta[colName][prop][1]) {
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
                        for (let prop in json.properties) {
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
                    for (let rowId in json.ids) {
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
                    for (let c = 0, lenC = toTable.length, e, eLen, xRow, xId, nId; c < lenC; c++) {
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
                for (let b = 0, len = table.length, nRow; b < len; b++) {
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
                    "version": this.version + "_" + Base64.Version,
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
                    for (let id in DB1.ids) {
                        for (i = 0, idiLen = DB1.ids[id].length; i < idiLen; i++) {
                            if (i !== 0 || DB1.ids[id][i] !== "del") {
                                DB1.ids[id][i] = DB1.ids[id][i] - createdDiff;
                            }
                        }
                    }
                    i = null;
                    idiLen = null;
                    //update propert time stamps
                    for (let p in DB1.properties) {
                        if (DB1.hasOwnProperty(p)) {
                            DB1.properties[p][1] = DB1.properties[p][1] - createdDiff;
                        }
                    }
                    //update column time stamps
                    var a;
                    for (let c in DB1.columns.meta) {
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
                    for (let a = 0, difLen = dif.length; a < difLen; a++) {
                        SET_VAL.call(this, matchedID, dif[a], jsonRow[dif[a]], false, 0);
                        syncChanges = true;
                    }
                    dif = null;
                    return matchedID;
                }
                function toArray(jsonRow) {
                    var arr = [];
                    for (let a = 0, headers = DB[this.id].columns.headers, len = headers.length - 1, headerName; a < len; a++) {
                        headerName = headers[a + 1];
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
                    for (let a = 1, len = DB[this.id].columns.headers.length; a < len; a++) {
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
                    for (let a = 0, b = 0, idsLen = remainingIds.length; a < idsLen; a++) {
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
                    for (let h = 0, hLen = remainingIds.length; h < hLen; h++) {
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
            for (let a = 0, lenA = headers.length, b, lenB, existingHeaders = db.columns.headers, foundMatch = false; a < lenA; a++) {
                foundMatch = false;
                for (b = 0, lenB = existingHeaders.length; b < lenB; b++) {
                    if (headers[a] === existingHeaders[b]) {
                        foundMatch = true;
                        continue;
                    }
                }
                if (foundMatch === false) {
                    for (let col in db.columns.meta) {
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
            for (let loop = 0, g, lenG, id; loop < 10; loop++) {
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
        if ("data" in json && json.version === this.version + "_" + Base64.Version && Base64.hmac(json.data, key) === json.signature) {
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
        for (let a = 0, len = arr.length; a < len; a++) {
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
            for (let h = 0, hLen = COL_NAMES_INDEXED[this.id].length; h < hLen; h++) {
                colNums[h] = GET_INDEX_OF_COLUMN.call(this, COL_NAMES_INDEXED[this.id][h]);
            }
            //get all the words in the table
            for (let a = 0, b = 0, len = this.getLength(), words, d, f, fLen, dLen = COL_NAMES_INDEXED[this.id].length; b < len; b++) {
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
            for (let x = 0, y = 1, z = 0, reps = indexItem.length, foundMatch, row, col, i; x < reps; x = z > 0 ? x + z : x + 1, y = x + 1, z = 0) {
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
            for (let c = 0, lenC = searchWords.length, g, lenG = COL_NAMES_INDEXED[this.id].length, numResultsPerWord = []; c < lenC; c++) {
                numResultsPerWord[c] = 0;
                for (g = 0; g < lenG; g++) {
                    if (COL_NAMES_INDEXED[this.id][g] !== "id" && SEARCH_INDEX[this.id][searchWords[c]][COL_NAMES_INDEXED[this.id][g]]) {
                        numResultsPerWord[c] += SEARCH_INDEX[this.id][searchWords[c]][COL_NAMES_INDEXED[this.id][g]].length;
                    }
                }
                searchWords[c] = [numResultsPerWord[c], searchWords[c]];
            }
            searchWords.sort(sortSearchWords);
            for (let e = 0, lenE = searchWords.length; e < lenE; e++) {
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
                for (let c = 0, lenC = colNamesToIndex.length, colName; c < lenC; c++) {
                    colName = TO_PROP_NAME(colNamesToIndex[c]);
                    if (db.columns.meta[colName] && (db.columns.meta[colName].searchable === undefined || db.columns.meta[colName].searchable[0] === true))
                        ret[b++] = colName;
                }
            }
            else
                for (let a in db.columns.meta) {
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
                return;
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
        return;
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
            function buildId() {
                function nextIndex(activeChar) {
                    return alphabet.indexOf(newId.charAt(activeChar)) - 1;
                }
                //roll all the digits ahead i.e. from 0099 to 0100
                function rollAhead() {
                    while (letterIndex + 1 === alphabetLength) {
                        //reached the end of the alphabet
                        end = "";
                        for (let c = 0; c < newId.slice(activeChar, idLength).length; c++)
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
            return false;
        }
        var hLen = DB[this.id].columns.headers.length;
        if (id && array.length === hLen && array[0] === id) {
            array = array.slice(1);
        }
        if (array.length !== hLen - 1) {
            CACHE_ERROR.call(this, array, "new row doesn't match table size: " + hLen);
            return false;
        }
        id = getNextId.call(this, 3, DB[this.id].ids, id ? id : IS_ARRAY(array) ? array.join("") : null);
        if (!id)
            return false;
        var row = [id];
        if (!array || array.constructor !== Array) {
            CACHE_ERROR.call(this, array, "cannot add row");
            row = null;
            return false;
        }
        for (let a = 1, len = DB[this.id].columns.headers.length, type; a < len; a++) {
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
        for (let a = 0, len = hLen - 1; a < len; a++) {
            SET_VAL.call(this, id, a + 1, array[a], false, editTimesArr[a + 1]);
        }
        row = null;
        hLen = null;
        this.syncPending = true;
        TO_LOCAL_STORAGE.call(this, storeBool);
        return id;
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
                    for (let a = 0, lenA = n.length; a < lenA; a++) {
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
                for (let b = 0, lenB = n.length; b < lenB; b++) {
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
            for (let a = 0, lenA = n.length; a < lenA; a++)
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
            for (let a = 0, lenA = split.length; a < lenA; a++) {
                split[a] = split[a].charAt(0).toUpperCase() + split[a].slice(1);
            }
            field = split.join(" ");
            split = field.split("/");
            for (let b = 0, lenB = split.length; b < lenB; b++) {
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
            for (let a = 0, lenA = c.length; a < lenA; a++) {
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
            for (let a = 0, lenA = c.length; a < lenA; a++) {
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
                for (let a = 0; a < arr.length; a++) {
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
                    for (let a = 0; a < 6; a++) {
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
            "version": this.version + "_" + Base64.Version
        };
        validatedEditTime = null;
    }
    function INITIATE_DBS(title, callback) {
        function newDBS() {
            DBS[NUM++] = title;
            APP.Sto.setItem("tables", JSON.stringify(DBS));
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
            APP.Sto && APP.Sto.getItem("tables", null, function (tables) {
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
        for (let a = 0, len = headers.length; a < len; a++) {
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
            var str = Base64.write(JSON.stringify(EXPORT_DB.call(this)), key);
            return JSON.stringify({
                "data": str,
                "signature": Base64.hmac(str, key),
                "version": this.version + "_" + Base64.Version
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
                if (typeof token !== "string" && token && token.version === this.version + "_" + Base64.Version) {
                    if (token.signature && token.token && token.signature === Base64.hmac(token.token, key)) {
                        let dbxSyncObj = JSON.parse(Base64.read(token.token, key));
                        for (let i in dbxSyncObj) {
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
            token = Base64.write(JSON.stringify(DBX_SYNC_OBJ), key);
            return JSON.stringify({
                "token": token,
                "signature": Base64.hmac(token, key),
                "version": this.version + "_" + Base64.Version
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
            for (let a = 0, len = db.table.length; a < len; a++) {
                db.table[a].splice(colIndex, 1);
                db.ids[db.table[a][0]].splice(colIndex, 1);
            }
            if (HIDDEN_TABLE_DATA[this.id]) {
                for (let a = 0, len = HIDDEN_TABLE_DATA[this.id].length; a < len; a++) {
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
            for (let a = 1, len = uncheckedHeaders.length; a < len; a++) {
                //if given tableHeader name contains a space or invalid character
                if (!props[headers[a]]) {
                    let _badHeader = uncheckedHeaders[a];
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
            for (let a in uncheckedHeaders) {
                if (a !== "id") {
                    if (!props[headers[b]] && props[a]) {
                        props[headers[b]] = props[a];
                        delete props[a];
                    }
                    props[headers[b]] = props[headers[b]] || {};
                    if (a !== headers[b] && !props[headers[b]].exportAs)
                        props[headers[b]].exportAs = [a, time];
                    if (!props[headers[b]].type) {
                        var val = uncheckedHeaders[a];
                        props[headers[b]] = VALIDATE_COLUMN_PROPS.call(this, val, time);
                    }
                    b++;
                }
            }
            for (let b = 1, len = headers.length; b < len; b++) {
                obj.meta[headers[b]] = props[headers[b]] ? props[headers[b]] : { type: ["any", time], timestamp: [time, time] };
            }
            b = null;
            setIndexable();
            return obj;
        }
        function formatProperties(props) {
            var ret = {};
            if (!props) {
                for (let a = 1, lenA = obj.headers.length; a < lenA; a++) {
                    ret[obj.headers[a]] = {
                        type: ["any", time],
                        timestamp: [time, time]
                    };
                }
            }
            else if (IS_ARRAY(props)) {
                for (let a = 0, lenA = props.length; a < lenA; a++) {
                    ret[obj.headers[a + 1]] = {
                        type: TIMESTAMP_COLUMN_PROP(VALIDATE_TYPE.call(this, props[a]), time),
                        timestamp: [time, time]
                    };
                }
            }
            else if (typeof props === "object") {
                for (const a in props) {
                    if (props.hasOwnProperty(a)) {
                        ret[a] = VALIDATE_COLUMN_PROPS.call(this, props[a], time);
                    }
                }
            }
            return ret;
        }
        function setIndexable() {
            if (IS_ARRAY(doNotIndex)) {
                for (let a = 0, len = doNotIndex.length; a < len; a++) {
                    doNotIndex[a] = TO_PROP_NAME(doNotIndex[a]);
                }
            }
            else
                doNotIndex = [];
            for (let a = 1, len = obj.headers.length; a < len; a++) {
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
            for (let a in tableHeaders) {
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
            for (let a = 0, len = db.table.length; a < len; a++) {
                db.table[a].splice(position, 0, initialValue);
                db.ids[db.table[a][0]].splice(position + 1, 0, validatedEditTime);
            }
            if (HIDDEN_TABLE_DATA[this.id]) {
                for (let a = 0, len = HIDDEN_TABLE_DATA[this.id].length; a < len; a++) {
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
        if (TABLE_IS_DELETED(db) || TIMESTAMP_COLUMN_PROP(opt.deleted, 0)[0] === true) {
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
                for (let id in data[colName]) {
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
    function NyckelDBObj(tableTitle) {
        if (tableTitle == null) { // eslint-disable-line
            console.log("no title");
            return CACHE_ERROR.call(this, "title not defined");
        }
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
        this.version = "0.5";
        //declare private DB object and unique this.id for every new instance of NyckelBDObj()
        this.id = Base64.number_hash(tableTitle + Base64.rand(), 12);
        SEARCH_INDEX[this.id] = {};
        SEARCH_SUGGESTIONS[this.id] = [];
        RECENTLY_SEARCHED[this.id] = [];
        ROW_INDEX_CACHE[this.id] = {};
        DB[this.id] = {
            "title": tableTitle,
            "created": 0,
            "deleted": false,
            "lastModified": 0,
            "version": this.version + "_" + Base64.Version,
            "columns": {
                "meta": {},
                "headers": [],
            },
            "ids": {},
            "table": [],
            "properties": {}
        };
    }
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
    const MAX_SYNC_FREQUENCY = 5; //5 minutes
    var SYNC_ERROR = false;
    var SYNC_ERROR_TIME;
    var HIDDEN_IDS;
    var HIDDEN_TABLE_DATA;
    const STRING_TYPES = "any string uniqueString multilineString date email phoneNumber password formattedAddress streetAddress mailAddress cityCounty provinceStateRegion country postalZipCode givenName familyName geoLocation";
    const NUMBER_TYPES = "any number integer posInteger negInteger date phoneNumber password postalZipCode longitude latitude";
    const VALID_TYPES = new RegExp("^(" + DELETE_DUPLICATES((STRING_TYPES + " " + NUMBER_TYPES + " boolean").split(" ")).join("|") + ")$");
    const VALID_STRING_TYPES = new RegExp("^(" + STRING_TYPES.split(" ").join("|") + ")$");
    const VALID_NUMBER_TYPES = new RegExp("^(" + NUMBER_TYPES.split(" ").join("|") + ")$");
    const FORBIDDEN = GET_FORBIDDEN(); //property names that shouldn't be used (?)
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
    /**
     * Add a new row to the table.
     * @function addRow
     * @param {array} array a complete array, or a JSON object in form {[colName]: {value: [value]},..}
     * @param {string} [id] id is optional and will only be used if it doesn't already exist
     * @returns {string} new row id
     */
    NyckelDBObj.prototype.addRow = function (array, id) {
        if (array && !IS_ARRAY(array) && typeof array === "object") {
            //convert object to array
            var _array = [], a = 0;
            return this.forEachCol.call(this, function (col) {
                if (array[col] && array[col].value)
                    _array[a] = array[col].value;
                a++;
            }, function () {
                return ADD_ROW.call(this, _array, id, true);
            }.bind(this));
        }
        else
            return ADD_ROW.call(this, array, id, true);
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
     */
    NyckelDBObj.prototype.advancedSearch = function (searchQuery, options, callback) {
        function filter(ids, filterOutQueries) {
            if (filterOutQueries.length === 0) {
                return callback instanceof Function ? callback.call(this, ids, ERRORS[this.id]) : undefined;
            }
            for (let b = 0, lenB = filterOutQueries.length; b < lenB; b++) {
                (function (self, b) {
                    self.search.call(self, filterOutQueries[b], options, function (result, err) {
                        if (!err)
                            filterIds = filterIds.concat(result);
                        else
                            return callback instanceof Function ? callback.call(self, [], err) : undefined;
                        if (b === lenB - 1) {
                            filterIds = DELETE_DUPLICATES(filterIds);
                            if (filterIds.length > 0) {
                                for (let c = 0, lenC = filterIds.length, t = "", d, lenD; c < lenC; c++) {
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
                })(this, b);
            }
        }
        if (!searchQuery)
            return callback instanceof Function ? callback.call(this, [], "no query supplied") : undefined;
        var ids = [], filterIds = [], filterOutQueries = [], searchQueryArr = [];
        if (/\s\+|\s\-/.test(searchQuery)) {
            searchQueryArr = searchQuery.split(" +");
            for (let a = 0; a < searchQueryArr.length; a++) {
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
        for (let a = 0, len = searchQueryArr.length; a < len; a++) {
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
            })(this, a);
        }
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
        return DELETE_COLUMN.call(this, colName, true, undefined, callback);
    };
    /**
     * Delete a row along with all the data that it contains
     * @function deleteRow
     * @param {string|number} rowId the row's id, or its current index
     * @returns {boolean} success
     */
    NyckelDBObj.prototype.deleteRow = function (rowId) {
        return DELETE_ROW.call(this, rowId, true);
    };
    /**
     * Delete a table along with all the data that it contains, including custom properties
     * @function deleteTable
     * @param {function} [callback] callback function
     * @returns {object} this
     */
    NyckelDBObj.prototype.deleteTable = function (callback) {
        return DELETE_TABLE.call(this, callback, undefined, true);
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
            for (let a = 1, headers = DB[this.id].columns.headers, len = headers.length; a < len; a++) {
                funct.call(this, headers[a], a - 1, len - 1);
            }
            return callback instanceof Function ? (callback.call(this, true, ERRORS[this.id]), this) : this;
        }
        else
            return callback instanceof Function ? (callback.call(this, false, "forEach requires a function"), this) : this;
    };
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
            for (let a = 0, len = this.getLength(); a < len; a++) {
                funct.call(this, DB[this.id].table[a][0], a, len);
            }
            return callback instanceof Function ? (callback.call(this, true, ERRORS[this.id]), this) : this;
        }
        else
            return callback instanceof Function ? (callback.call(this, false, "forEach requires a function"), this) : this;
    };
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
        for (let a = 1, headers = DB[this.id].columns.headers, len = headers.length; a < len; a++) {
            ret[a - 1] = headers[a];
        }
        return callback instanceof Function ? (callback.call(this, ret, false), ret) : ret;
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
    /**
     * Get the timestamp of when the table was most recently changed
     * @function getLastModified
     * @return {number} database modified timestamp
     */
    NyckelDBObj.prototype.getLastModified = function () {
        return DB[this.id].lastModified;
    };
    /**
     * Get the number of (unhidden, unfiltered) rows in the table
     * @function getLength
     * @returns {number} the number of rows in the table
     */
    NyckelDBObj.prototype.getLength = function () {
        return !DB[this.id] || TABLE_IS_DELETED(DB[this.id]) ? 0 : DB[this.id].table.length;
    };
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
                for (let b = 0, len = SEARCH_SUGGESTIONS[this.id].length; b < len; b++) {
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
                for (let c = 0, lenC = RECENTLY_SEARCHED[this.id].length, i, item; c < lenC; c++) {
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
    /**
     * Get the title of the table
     * @function getTitle
     * @returns {string | undefined } table title
     */
    NyckelDBObj.prototype.getTitle = function () { return DB[this.id] ? DB[this.id].title : undefined; };
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
            return;
    };
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
        for (let a = 0, x = 0, b, y, rowIndex, colIndex, len = rowIds.length, lenB = colNames.length; a < len; a++) {
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
                    for (let a = 1, headers = db.columns.headers, len = headers.length, colProp; a < len; a++) {
                        for (colProp in columns[headers[a]]) {
                            if (columns[headers[a]].hasOwnProperty(colProp)) {
                                columns[headers[a]][colProp][1] = VALIDATE_EDIT_TIME.call(this, columns[headers[a]][colProp][1], "column", "didn't get cached table");
                            }
                        }
                    }
                }
                //validate ids
                for (let id in db.ids) {
                    if (db.ids.hasOwnProperty(id)) {
                        for (let a = 0; a < db.ids[id].length; a++) {
                            db.ids[id][a] = VALIDATE_EDIT_TIME.call(this, db.ids[id][a], a === 0 ? "row" : "cell", "validating ids", id);
                        }
                    }
                }
                for (let prop in db.properties) {
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
            if (json && TABLE_IS_DELETED(json))
                return {
                    "title": DB[this.id].title,
                    "created": json.created || TIMESTAMP(),
                    "lastModified": json.lastModified || TIMESTAMP(),
                    "deleted": true,
                    "version": this.version + "_" + Base64.Version
                };
            else
                return {
                    "title": DB[this.id].title,
                    "created": json && json.created !== undefined ? json.created : TIMESTAMP(),
                    "lastModified": json && json.lastModified !== undefined ? json.lastModified : 0,
                    "deleted": false,
                    "version": this.version + "_" + Base64.Version,
                    "ids": json && json.ids ? json.ids : {},
                    "columns": setColumns.call(this, json),
                    "table": json && json.table ? json.table : [],
                    "properties": json && json.properties ? json.properties : properties
                };
        }
        function decompress(data, key) {
            return JSON.parse(Base64.read(data, key));
        }
        function applyCustomProperties(props) {
            function setInitialValue(type) {
                return type === "string" ? "" : type === "boolean" ? false : 0;
            }
            if (!props)
                return {};
            var _props = {};
            if (IS_ARRAY(props)) {
                for (let a = 0, len = props.length; a < len; a++) {
                    _props[TO_PROP_NAME(props[a])] = [0, 0, "any"];
                }
                return _props;
            }
            else if (typeof props !== "object") {
                CACHE_ERROR.call(this, "Please supply properties in proper format");
                return {};
            }
            var _type = "any", _initialValue = 0, propName, propValue;
            for (let prop in props) {
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
                            _props[propName] = [propValue[0], propValue[1], _type];
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
            if (APP.Sto)
                APP.Sto.getItem(DB[this.id].title, null, gotCachedTable.bind(this), didntGetCachedTable.bind(this));
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
            if (String(version[0]) !== String(this.version)) {
                console.log("versions do not match", String(version[0]), String(this.version));
                didntGetCachedTable.call(this);
                return;
            }
            if ("data" in json) {
                if (String(version[1]) === String(Base64.Version) && Base64.hmac(json.data, opt.key) === json.signature) {
                    json = Base64.read(json.data, opt.key);
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
            if (opt.importData.version !== this.version + "_" + Base64.Version && opt.importData.version !== this.version + "." + Base64.Version) {
                return callback instanceof Function ? callback.call(this, false, "imported database version not supported", null, false) : CACHE_ERROR.call(this, "imported database version not supported");
            }
            else if (Base64.hmac(opt.importData.data, opt.key) === opt.importData.signature) {
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
    /**
     * Clear all the locally cached copies of all the NyckelDB databases.
     * @function NUKEALL
     * @param {string} msg the message that you want to tell the user before you blow everything up!
     * @param {successCallback} [callback] callback function
     */
    NyckelDBObj.prototype.NUKEALL = function (msg, callback) {
        function nuke() {
            if (APP.Sto) {
                for (let a = 0, len = DBS.length; a < len; a++) {
                    APP.Sto.deleteItem(DBS[a]);
                    APP.Sto.deleteItem("searchIndex_" + DBS[a]);
                }
                APP.Sto.deleteItem("tables");
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
            for (let a = 0, found = false, x = 0, y = x + 1, len = arr.length, b; x < len - min + 1; x++, y = x + 1) {
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
            for (let a = 0, b, bLen = COL_NAMES_INDEXED[this.id].length, i; a < aLen; a++) {
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
            for (let a = 0, lenA = searchQueryArr.length; a < lenA; a++) {
                if (Spelling[searchQueryArr[a]]) {
                    arr[a] = Spelling[searchQueryArr[a]].split(" ");
                }
                else
                    arr[a] = [searchQueryArr[a]];
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
                for (let c = 1; c < len; c++) {
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
            for (let a = 0, len = queries.length - 1; a < len; a++) {
                querySearchIndex.call(this, queries[a], false);
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
    /**
     * Change the value of a column property
     * @function setColumnProp
     * @param {string} colName the name of the column to modify
     * @param {string} propName the name of the column property to modify
     * @param {string | number | boolean} propValue the new value to set the column property to
     * @returns { string | number | boolean | undefined} the validated property value that was applied
     */
    NyckelDBObj.prototype.setColumnProp = function (colName, propName, propValue) {
        if (propName === "type")
            return this.setType(colName, propValue);
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
    /**
     * Same as isSyncPending but sets the value of syncPending to true if the cloudSyncFile validates
     * @function setSyncCompleted
     * @param {string} cloudSyncFile token that contains the version number, hashed message authentication code (HMAC) and lastSync timestamp of the database
     * @param {successCallback} [callback] callback function
     * @returns {boolean} whether or not sync is successfully set to complete
     */
    NyckelDBObj.prototype.setSyncCompleted = function (cloudSyncFile, callback) {
        if (cloudSyncFile && this.isSyncPending(cloudSyncFile)) {
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
        for (let i in newValues) {
            len++;
        }
        for (let column in newValues) {
            if (COL_NAME_IS_VALID.call(this, column)) {
                SET_VAL.call(this, rowId, column, newValues[column].value, true, undefined, ret.bind(this));
            }
        }
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
                return Base64.read(data, key);
            }
            switch (json.signature) {
                case Base64.hmac(json.data, readKey):
                    json = read.call(this, json.data, readKey, false);
                    break;
                case Base64.hmac(json.data, opt.initialKey):
                    json = read.call(this, json.data, opt.initialKey || null, true);
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
        if (!json.data || !(json.version === this.version + "_" + Base64.Version)) {
            return retError.call(this, "unsupported version:" + json.version);
        }
        return sync.call(this);
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
     * Make all hidden rows accessible again (another way to call unHideRows)
     * @function unfilter
     * @returns {object} this
     */
    NyckelDBObj.prototype.unfilter = function () {
        return this.unhideRows();
    };
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
