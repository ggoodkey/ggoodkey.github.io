"use strict";

/* eslint-disable */

//depenancies
var APP: any, Base64: any, Windows: any, cordova: any, Spelling: any;

type tableValue = string | number | boolean;

type tableRow = [string, tableValue];

type tableErrors = string | string[] | false;

type basicTypeString = "any" | "number" | "string" | "boolean";

type typeString = basicTypeString | "integer" | "posInteger" | "negInteger" | "uniqueString" | "multilineString" |
	"date" | "email" | "phoneNumber" | "password" | "formattedAddress" | "streetAddress" | "mailAddress" |
	"cityCounty" | "provinceStateRegion" | "country" | "postalZipCode" | "givenName" | "familyName" | "geoLocation" |
	"longitude" | "latitude";

type addColumnOptions = {
	type?: typeString;
	initialValue?: tableValue;
	formula?: string;
	search?: boolean;
	deleted?: boolean;
	exportAs?: string;
};

type columnMetadata = {
	[prop: string]: [typeString | number | boolean | string, number] | undefined;
	type: [typeString, number];
	timestamp: [number, number];//[created, modified]
	search?: [boolean, number];
	initialValue?: [tableValue, number];
	formula?: [string, number];
	deleted?: [true, number];
	exportAs?: [string, number];
};

type customProperties = string[] |
	{ [propertyName: string]: basicTypeString } |
	{ [propertyName: string]: [tableValue, number, basicTypeString] } |
	{ [propertyName: string]: { initialValue?: tableValue, type?: basicTypeString } };

type NyckelDBOptions = {
	key?: string;
	doNotIndex?: string[];
	initialIndex?: string[];
	customProperties?: customProperties;
	importData?: nyckelDB_compressed;
	importJSON?: nyckelDB_uncompressed | csv2jsonOutput | nyckelDB_compressed | nyckelDB_deleted;
	importCSV?: string;
};
	
type initTableHeaders = string[] |
{ [headerName: string]: typeString };

type deletedId = ["del", number];

type tableIds = {
	[id: string]: number[];
}

type searchIndex = { [searchWord: string]: { [columnName: string]: string; }; };

type searchOptions = { colNames?: string[], fuzzyMatch?: boolean };

interface NyckelDB_interface {
	id: number;
	syncPending: boolean;
	version: string;
	readonly addColumn: Function;
	readonly addRow: Function;
	readonly advancedSearch: Function;
	readonly deleteColumn: Function;
	readonly deleteRow: Function;
	readonly deleteTable: Function;
	readonly filter: Function;
	readonly forEachCol: Function;
	readonly forEachRow: Function;
	readonly getHeaders: Function;
	readonly getIndexOf: Function;
	readonly getLastModified: Function;
	readonly getLength: Function;
	readonly getProp: Function;
	readonly getRow: Function;
	readonly getRowTemplate: Function;
	readonly getSearchSuggestions: Function;
	readonly getTitle: Function;
	readonly getType: Function;
	readonly getVal: Function;
	readonly getVals: Function;
	readonly hideRow: Function;
	readonly init: Function;
	readonly importJSON: Function;
	readonly isDeleted: Function;
	readonly isSyncPending: Function;
	readonly NUKEALL: Function;
	readonly renameColumn: Function;
	readonly search: Function;
	readonly setProp: Function;
	readonly setSyncCompleted: Function;
	readonly setTitle: Function;
	readonly setType: Function;
	readonly setVal: Function;
	readonly setVals: Function;
	readonly shuffle: Function;
	readonly sortByCol: Function;
	readonly sync: Function;
	readonly toCSV: Function;
	readonly toJSON_Array: Function;
	readonly toJSON_KeyValuePairs: Function;
	readonly unfilter: Function;
	readonly unhideRows: Function;
	readonly validate: Function;
}

interface base64File {
	readonly title: string;//database title
	readonly file: string;//compressed data
	readonly syncFile: string;//stringified DBS_SYNC_OBJ
	readonly syncToken: string;//stringified token
}

interface tableColumns {
	headers: string[],
	indexable: string[],
	meta: {
		[colName: string]: columnMetadata;
	}
}

interface rowTemplate {
	[columnName: string]: {
		column: string, //column name
		type: typeString, //data type (for data validation)
		exportAs?: string //original/display column name if column name has been changed
	}
}

interface validateObj { valid: boolean, value: tableValue, error: tableErrors, details: string | undefined };

interface nyckelDB_uncompressed {
	title: string;
	version: string;
	created: number;
	lastModified: number;
	deleted: false;
	columns: tableColumns;
	ids: tableIds;
	table: tableRow[];
	properties: { [propertyName: string]: [tableValue, number, basicTypeString] };
//	previousTitle?: string[]; //adds too much complexity changing title?
}

interface nyckelDB_compressed {
	readonly title: string;
	readonly version: string;
	readonly created: number;
	readonly lastModified: number;
	readonly data: string;
	readonly signature: string;
}

interface nyckelDB_deleted {
	title: string;
	version: string;
	created: number;
	lastModified: number;
	deleted: true;
//	previousTitle?: string[];
}

interface csv2jsonOutput {
	CSVHeaders: string[];
	Headers: string[];
	Rows: { [colName: string]: string; }[];
	replaceAll: boolean;
	lastModified: number | Date;
	identifierCol: string;
}

interface HTMLDownloadElement {
	download?: string;
	href?: string;
	click: Function;
}

interface searchIndexObj {
	version: string;
	length: number;
	lastModified: number;
	colNamesIndexed: string[];
	searchIndex: searchIndex;
	searchSuggestions: string[];
	recentlySearched: string[];
}
 
interface syncToken {
	version: string;
	signature: string;
	token: string;
}

//jsdoc callback type declarations
/**
 * This callback returns whether the function executed successfully as it's first parameter
 * @callback successCallback
 * @param {boolean} success function concluded successfully
 * @param {string | string[] | false} errors
 */
type successCallback = (this: NyckelDB_interface, success: boolean, errors: tableErrors) => void;
/**
 * This callback returns search results as it's first parameter
 * @callback searchCallback
 * @param {string[]} searchResults array of ids that matched the searchQuery
 * @param {string | string[] | false} errors
 */
type searchCallback = (this: NyckelDB_interface, searchResults: string[], errors: tableErrors) => void;
/**
 * This callback returns search suggestions as it's first parameter
 * @callback suggestionsCallback
 * @param {string[]} searchSuggestions an array of possible searches that would return search results
 * @param {string | string[] | false} errors
 */
/**
 * forEachRow funct
 * @callback eachRowCallback
 * @param {string} rowId the id of the current row
 * @param {number} is the position in the table of the current row
 * @param {number} of the total number of rows in the table (% complete = is/of)
 */
/**
 * forEachCol funct, use parameters 'isIndexNum' and 'ofNumCols' to get progress
 * @callback eachColCallback
 * @param {string} colName the name of the current column
 * @param {number} isIndexNum the position in the table of the current column
 * @param {number} ofNumCols the total number of columns in the table (% complete = isIndexNum/ofNumCols)
 */

/**
 * This callback returns a value as it's first parameter
 * @callback getCallback
 * @param {string | number | boolean | undefined} value a value from the database
 * @param {string | string[] | false} errors
 */
type getCallback = (this: NyckelDB_interface, value: tableValue | undefined, errors: tableErrors) => void;
/**
 * This callback returns the validated value set, or false if unsuccessful, as it's first parameter
 * @callback setCallback
 * @param {string | number | boolean | undefined} value actual value set after validation, or false if unsuccessful
 * @param {string | string[] | false} errors
 */
type setCallback = getCallback;

/**
 * This callback returns an array of values as it's first parameter
 * @callback getValsCallback
 * @param {(string | number | boolean)[][] | false} values an array of values from the database
 * @param {string | string[] | false} errors
 */
type getValsCallback = (this: NyckelDB_interface, value: tableValue[][] | false, errors: tableErrors) => void;

/**
 * This callback returns an object as it's first parameter
 * @callback getRowCallback
 * @param {object[]} values an array of objects containing values, types, and column names from the database
 * @param {string | string[] | false} errors
 */
type getRowCallback = (this: NyckelDB_interface, row: {[columnName: string]: {column: string, type: typeString, value: tableValue}} | undefined , errors: tableErrors) => void;
 /**
 * This callback returns an object as it's first parameter
 * @callback getHeadersCallback
 * @param {string[]} a list of the table headers
 * @param {string | string[] | false} errors
 */

type getHeadersCallback = (this: NyckelDB_interface, result: string[], errors: tableErrors) => void;

 /**
 * This callback returns the validated table value as it's first parameter
 * @callback validateCallback
 * @param {tableValue} updatedValue the value accepted by the database
 * @param {string | string[] | false} errors
 * @param {string | undefined} errorDetails a description of the error
 */
type validateCallback = (this: NyckelDB_interface, updatedValue: tableValue, errors: tableErrors, errorDetails: string | undefined) => void;

/**
 * This callback returns an object as it's first parameter
 * @callback getRowTemplateCallback
 * @param {object} a a blank tableRow object containing all the table columns with their types
 * @param {string | string[] | false} errors
 */
type getRowTemplateCallback = (this: NyckelDB_interface, result: rowTemplate, errors: tableErrors) => void;

/**
 * This callback returns an object as it's first parameter
 * @callback setTypeCallback
 * @param {object} a a blank tableRow object containing all the table columns with their types
 * @param {string | string[] | false} errors
 */
type setTypeCallback = (this: NyckelDB_interface, returnData: {[columnName: string]:{[rowId: string]: tableValue}} | true, errors: tableErrors) => void;

/**
 * This callback returns success as it's first parameter and a compressed db as it's last parameter if successfully synced
 * @callback syncCallback
 * @param {boolean} success function concluded successfully
 * @param {string | string[] | false} errors
 * @param {object | false} syncedJSONFile to upload to server after successful sync, or false if unsuccessful
 */
type syncCallback = (success: boolean, errors: string | false, base64File: base64File | false) => void;

var NyckelDB = (function () {
	function IS_NUMERIC(n: any): n is number {
		return !isNaN(parseFloat(n)) && isFinite(n);
	}
	function IS_ARRAY<T>(a: any): a is Array<T>{
		if (a && a.constructor === Array) return true;
		return false;
	}
	function TABLE_IS_DELETED(obj: nyckelDB_uncompressed | nyckelDB_deleted): obj is nyckelDB_deleted {
		return obj && obj.deleted !== undefined && obj.deleted !== false ? true : false;
	}
	function TO_PROP_NAME(str: any): string {
		if (str == null) return "_undefined";
		else {
			while (/^_/.test(str)) str = str.replace(/^_/, "");
			str = TRIM(String(str)).replace(/ /g, "_").replace(/[^A-z0-9_]/g, "");
			if (str === "" || /^\d/.test(str) || /^(moz|scroll|screen|on|webkit)/.test(str) || FORBIDDEN.indexOf(str) > -1) return "_" + str;
			else return str;
		}
	}
	function TO_BASIC_ALPHABET(n:string):string {
		if (!n) return "";
		var str = n.toString();
		return /[\xC0-\xDF]/.test(str) && (
			str = str.replace(/[\xC0-\xC5]/g, "A"),
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
			str = str.replace(/\xDF/g, "B")
		), /[\xE0-\xFE]/.test(str) && (
			str = str.replace(/[\xE0-\xE5]/g, "a"),
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
		str
	}
	/*delete duplicate values held in an array
	note: DELETE_DUPLICATES converts non String values to Strings first :. "1" matches 1
	also handles multi dimensional arrays*/
	function DELETE_DUPLICATES<T>(arr: T[]): T[] {
		for (var x = 0, len = arr.length, y; x < len - 1; x++) {
			for (y = x + 1; y < len; y++) {
				if (String(arr[x]) === String(arr[y])) {
					arr.splice(y, 1);
					len--;
					y--;
				}
			}
		}
		x = null!; len = null!; y = null!;
		return arr;
	}
	/* trims out extra space charaters in a string at the front, end and in between words */
	function TRIM(str: string): string {
		while (/\s\s/g.test(str)) str = str.replace(/\s\s/g, " ");
		return str.replace(/^\s+|\s+$/gm, "");
	}	 
	/*returns number of minutes since Fri Jul 14 2017 02:40:00 GMT+0000, or since 15e11 in javascript time
	use wRefTo (with reference to, Optional) to specify a different base time stamp as reference. Returns the difference
	b/t wRefTo and Now. */
	function TIMESTAMP(wRefTo: number = 0): number {
		var now = Math.round((new Date().getTime() - 15e11) / 6e4);
		return now - wRefTo;
	}
	//returns a string in the form YYYYMMDDHHMM ie. 201812312359
	function READABLE_TIMESTAMP(): string {
		function twoDigits(a: number): string {
			var ret: string = String(a);
			while (ret.length < 2) ret = "0" + a;
			return ret;
		}
		var date = new Date(),
			day = twoDigits(date.getDate()),
			month = twoDigits(date.getMonth() + 1), //+ 1 because getMonth is 0 indexed
			year = String(date.getFullYear()),
			hour = twoDigits(date.getHours()),
			minute = twoDigits(date.getMinutes());
		date = null!;
		return year + month + day + hour + minute;
	}
	//add whitespace to JSON
	// eslint-disable-next-line complexity
	function READABLE_JSON_STRING(str: string): string {
		function enter(): void {
			out += "\r\n";
			for (a = 0; a < tabDepth; a++) {
				out += "\t";
			}
		}
		function getArrayDepth(position: number): void {
			//look ahead from 'position' to see how deep the array is
			//if 2d or 3d array, add extra whitespace
			position++;
			for (let depth = 1, len = str.length; position < len; position++) {
				if (str[position] === "[") {
					depth++;
					if (depth > arrayDepth) arrayDepth = depth;
				}
				if (str[position] === "]") {
					depth--;
					if (depth === 0) {
						//end of array
						if (arrayDepth > 0) {
							arrayEnd = position;//set the end of the array position
							tabDepth++;
							enter();
						}
						return;
					}
				}
			}
		}
		var quote = false,
			tabDepth = 0,
			prevChar = "",
			out = "",
			a = 0,
			array = 0,
			arrayDepth = 0,
			arrayEnd = 0;
		for (let c = 0, len = str.length; c < len; c++) {
			if ((str[c] === "}" || str[c] === "]" && c === arrayEnd) && !quote) {
				tabDepth--;
				enter();
			}
			out += str[c];
			switch (str[c]) {
				case '"':
					if (prevChar !== "\\") quote = !quote;
					break;
				case ",":
					if (!quote && (array === 0 || array < arrayDepth)) enter();
					break;
				case "[":
					if (!quote) {
						if (c > arrayEnd) getArrayDepth(c);
						array++;
					}
					break;
				case "]":
					if (!quote) {
						array--;
						if (array === 0) arrayDepth = 0;
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
	function ROW_ID_IS_VALID(this: NyckelDB_interface, rowId: number | string): boolean {
		if (TABLE_IS_DELETED(DB[this.id])) return false;
		else if (IS_NUMERIC(rowId)) {
			if (rowId < 0) {
				CACHE_ERROR.call(this, rowId, "row id cannot be less than 0");
				return false;
			}
			else if (rowId < (DB[this.id] as nyckelDB_uncompressed).table.length) return true;
			else return false;
		}
		else if (typeof rowId === "string" && /^[a-z0-9]+$/i.test(rowId)) {
			if ((DB[this.id] as nyckelDB_uncompressed).ids[rowId] && ((DB[this.id] as nyckelDB_uncompressed).ids[rowId] as deletedId)[0] !== "del") return true;
			else return false;
		}
		else {
			CACHE_ERROR.call(this, typeof rowId, "invalid row Id, number or string required: " + rowId);
			return false;
		}
	}
	function COL_NAME_IS_VALID(this: NyckelDB_interface, colName: string): boolean {
		function checkString(this: NyckelDB_interface, str: string): boolean {
			if (headers.indexOf(TO_PROP_NAME(str)) > -1) {
				if (str === "id") {
					CACHE_ERROR.call(this, str, "'id' is a reserved column name, and is not accessible");
					return false;
				}
				else return true;
			}
			else {
				var ret = false;
				for (let a = 0, len = headers.length, column; a < len; a++) {
					column = (DB[this.id] as nyckelDB_uncompressed).columns.meta[headers[a]];
					if (column.exportAs && column.exportAs[0] === str) {
						CACHE_ERROR.call(this, headers[a], str + " conflicts with another column name. Access it with it's new name");
						break;
					}
				}
				return ret;
			}
		}
		function checkNumber(this: NyckelDB_interface, num: number): boolean {
			if (num < 1) {
				CACHE_ERROR.call(this, num, "column name cannot be less than 1");
				return false;
			}
			else if (num < headers.length) return true;
			else {
				CACHE_ERROR.call(this, num, "column name not found");
				return false;
			}
		}
		if (TABLE_IS_DELETED(DB[this.id])) return false;
		var headers = (DB[this.id] as nyckelDB_uncompressed).columns.headers;
		if (typeof colName === "string") return checkString.call(this, colName);
		else if (IS_NUMERIC(colName)) return checkNumber.call(this, colName);
		else {
			CACHE_ERROR.call(this, colName, "column name not found");
			return false;
		}
	}
	function VALUE_IS_VALID(this: NyckelDB_interface, value: tableValue, type: typeString, ignoreErrors: boolean, traceStr: string): boolean {
		if (value == null) {// eslint-disable-line eqeqeq
			if (!ignoreErrors) CACHE_ERROR.call(this, value, "@" + traceStr + ": " + type + " value cannot be");
			return false;
		}
		else if (type === "any") return true;
		else if (typeof value === "string" && type.match(VALID_STRING_TYPES)) return true;
		else if (IS_NUMERIC(value) && type.match(VALID_NUMBER_TYPES)) return true;
		else if (typeof value === "boolean" && type === "boolean") return true;
		else {
			if (!ignoreErrors) {
				if (typeof type !== "string") CACHE_ERROR.call(this, type, "Type must be supplied as a string");
				else if (!type.match(VALID_TYPES)) CACHE_ERROR.call(this, type, "Invalid data type");
				else CACHE_ERROR.call(this, value + " is a " + typeof value + ", not a " + type, "invalid value");
			}
			return false;
		}
	}
	function GET_INDEX_OF_ROW(this: NyckelDB_interface, rowId: string | number): number {
		function getIndex(this: NyckelDB_interface, rowId: string | number) {
			for (let a = 0, len = (DB[this.id] as nyckelDB_uncompressed).table.length; a < len; a++) {
				ROW_INDEX_CACHE[this.id][(DB[this.id] as nyckelDB_uncompressed).table[a][0]] = a;//build a cache for faster performance
				if ((DB[this.id] as nyckelDB_uncompressed).table[a][0] === rowId) return a;
			}
			return -1;
		}
		if (ROW_ID_IS_VALID.call(this, rowId)) {
			if (IS_NUMERIC(rowId)) return rowId as number;
			else {
				if (((DB[this.id] as nyckelDB_uncompressed).ids[rowId] as deletedId)[0] === "del") return -1;
				if (ROW_INDEX_CACHE[this.id] && ROW_INDEX_CACHE[this.id][rowId]) return ROW_INDEX_CACHE[this.id][rowId]; //direct from cache
				else return getIndex.call(this, rowId);
			}
		}
		else return -1;
	}
	function GET_INDEX_OF_HIDDEN_ROW(this: NyckelDB_interface, rowId: string | number): number {
		if (HIDDEN_TABLE_DATA[this.id] != null && HIDDEN_IDS[this.id] != null && HIDDEN_IDS[this.id][rowId]) {
			if ((HIDDEN_IDS[this.id][rowId] as deletedId)[0] === "del") return -1;
			for (let a = 0, len = HIDDEN_TABLE_DATA[this.id].length; a < len; a++) {
				if (HIDDEN_TABLE_DATA[this.id][a][0] === rowId) return a;
			}
			return -1;
		}
		else return -1;
	}
	function GET_INDEX_OF_COLUMN(this: NyckelDB_interface, colName: string | number): number {
		if (TABLE_IS_DELETED(DB[this.id])) return -1;
		var headers = (DB[this.id] as nyckelDB_uncompressed).columns.headers;
		if (IS_NUMERIC(colName)) {
			if (colName > 0 && colName < headers.length) return colName;
			else return -1;
		}
		else {
			var orig = colName;
			colName = TO_PROP_NAME(colName);
			if (colName === "id") return -1;
			var ret = headers.indexOf(colName);
			if (ret > -1) return ret;
			for (let a = 1, len = headers.length, column; a < len; a++) {
				column = (DB[this.id] as nyckelDB_uncompressed).columns.meta[headers[a]];
				if (column && column.exportAs && column.exportAs[0] === orig) {
					if (ret === -1) ret = a;
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
	function EXPORT_DB(this: NyckelDB_interface): nyckelDB_uncompressed | nyckelDB_deleted {
		var db = DB[this.id];
		if (TABLE_IS_DELETED(db) || !HIDDEN_TABLE_DATA[this.id]) return db;
		else {
			var row: tableRow;
			while (HIDDEN_TABLE_DATA[this.id].length > 0) {
				row = HIDDEN_TABLE_DATA[this.id][0];
				db.ids[row[0]] = JSON.parse(JSON.stringify(HIDDEN_IDS[this.id][row[0]]));
				delete HIDDEN_IDS[this.id][row[0]];
				db.table.push(HIDDEN_TABLE_DATA[this.id].splice(0, 1)[0]);
			}
			row = null!;
			delete HIDDEN_IDS[this.id];
			delete HIDDEN_TABLE_DATA[this.id];
			return db;
		}
	}
	function TO_LOCAL_STORAGE(this: NyckelDB_interface, changes = false): void {
		function save(this: NyckelDB_interface): void {
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
				else if (window && window.confirm(msg.replace(/<[^>]+>/g, " "))) save.call(this);
			}
			else save.call(this);
		}
		BUILD_SEARCH_INDEX.call(this);
	}
	/*json.identifierCol to specify a specific column in the data to use as the basis for the generated unique id for each row
	*/
	function IMPORT_JSON(this: NyckelDB_interface, json: nyckelDB_uncompressed | csv2jsonOutput | nyckelDB_compressed | nyckelDB_deleted, callback: (this: NyckelDB_interface, success: boolean, err: string | false, changes: boolean) => void, key: string | false, fromLocalStorageBool: boolean): void {
		function ret(this: NyckelDB_interface, success: boolean, err: string | false, changes: boolean): void {
			if (callback instanceof Function) return callback.call(this, success, err, changes);
		}
		function applyJSON(this: NyckelDB_interface, json: nyckelDB_uncompressed): void {
			function checkDBForMissingItems(this: NyckelDB_interface): void {
				//check for errors
				var missing: string[] = [];
				for (let item in json.ids) {
					if (!(DB[this.id] as nyckelDB_uncompressed).ids[item] && (json.ids[item] as deletedId)[0] !== "del") {
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
				missing = null!;
			}
			function syncColumns(this: NyckelDB_interface, columns: tableColumns, callback: () => void): void {
				if (!columns) return callback();
				//added in verions 0.4+
				for (let colName in columns.meta) {
					//go through all metadata and delete deleted columns 
					if ((columns.meta[colName] as columnMetadata).deleted && (DB[this.id] as nyckelDB_uncompressed).columns.meta[colName] && !(DB[this.id] as nyckelDB_uncompressed).columns.meta[colName].deleted) {
						DELETE_COLUMN.call(this, colName, false, (columns.meta[colName] as columnMetadata).deleted![1]);
					}
				}
				for (let a = 1, lenA = (DB[this.id] as nyckelDB_uncompressed).columns.headers.length, colIndex: number, colName: string, prop: string; a < lenA; a++) {
					colName = (DB[this.id] as nyckelDB_uncompressed).columns.headers[a];
					colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
					if (colIndex === -1) {
						console.log(colName, "adding colname");
						ADD_COLUMN.call(this, colName, columns.meta[colName].type[0], a, undefined, false, columns.meta[colName].timestamp[0], columns.meta[colName]);
					}
					if (colIndex > 0) {//make changes
						if (colIndex !== a) MOVE_COLUMN.call(this, colName, colIndex, false);
						//go through all properties and update
						for (prop in columns.meta[colName]) {
							if (columns.meta[colName].hasOwnProperty(prop) && columns.meta[colName][prop]![1] > (DB[this.id] as nyckelDB_uncompressed).columns.meta[colName][prop]![1]) {
								switch (prop) {
									case "deleted"://shouldn't find an unsynced deleted column here!!!
										CACHE_ERROR.call(this, colName, "deleted column not synced");
										break;
									case "type": SET_TYPE.call(this, colName, columns.meta[colName][prop][0], null, false, columns.meta[colName][prop][1]);
										break;
									case "timestamp":
										//do nothing, update timestamp on prop change
										console.log("column timestamp compare (new, old): ", columns.meta[colName][prop], (DB[this.id] as nyckelDB_uncompressed).columns.meta[colName][prop]);
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
				//TODO check for errors in headers and column metadata
				return callback();
			}
			function syncTable(this: NyckelDB_interface, table: tableRow[], ids: tableIds) {
				function applyProperties(this: NyckelDB_interface): void {
					if (json.properties && (DB[this.id] as nyckelDB_uncompressed).properties) {
						var _prop: string;
						for (let prop in json.properties) {
							_prop = TO_PROP_NAME(prop);
							if ((DB[this.id] as nyckelDB_uncompressed).properties[_prop]) {
								if (!(DB[this.id] as nyckelDB_uncompressed).properties[_prop][1] || (DB[this.id] as nyckelDB_uncompressed).properties[_prop][1] < json.properties[prop][1]) {
									SET_PROP.call(this, _prop, json.properties[prop][0], json.properties[prop][1], json.properties[prop][2], false);
									syncChanges = true;
								}
								else if ((DB[this.id] as nyckelDB_uncompressed).properties[_prop][1] && (DB[this.id] as nyckelDB_uncompressed).properties[_prop][1] !== json.properties[prop][1]) syncChanges = true;
							}
							else {
								SET_PROP.call(this, _prop, json.properties[prop][0], json.properties[prop][1], json.properties[prop][2], false);
								syncChanges = true;
							}
						}
						_prop = null!;
					}
					checkDBForMissingItems.call(this);
				}
				function deleteRows(this: NyckelDB_interface): void {	
					//delete deleted rows
					for (let rowId in json.ids) {
						if ((json.ids[rowId] as deletedId)[0] === "del" && (DB[this.id] as nyckelDB_uncompressed).ids[rowId] && ((DB[this.id] as nyckelDB_uncompressed).ids[rowId] as deletedId)[0] !== "del") {
							if (json.ids[rowId][1] !== (DB[this.id] as nyckelDB_uncompressed).ids[rowId][0]) syncChanges = true;
							//if it was deleted after it was created (not restored)
							if (json.ids[rowId][1] > (DB[this.id] as nyckelDB_uncompressed).ids[rowId][0]) {
								DELETE_ROW.call(this, rowId, false, json.ids[rowId][1]);
							}
						}
					}
					applyProperties.call(this);
				}
				function updateRow(this: NyckelDB_interface, toTable: tableRow[], toIds: tableIds, nRow: tableRow, rowNotFoundCB: (nRow: tableRow) => void): void {
					if (!toTable) return rowNotFoundCB(nRow);
					for (let c = 0, lenC = toTable.length, e: number, eLen: number, xRow: tableRow, xId: number[] | deletedId, nId: number[] | deletedId; c < lenC; c++) {
						xRow = toTable[c];//existing row
						if (xRow[0] !== nRow[0]) continue;
						//ids match, found right row
						xId = toIds[xRow[0]];//existing row metadata
						nId = ids[nRow[0]];//new row metadata
						for (e = 1, eLen = nId.length; e < eLen; e++) {
							if ((xId as deletedId)[0] === "del" && (nId as deletedId)[0] === "del" || Number(xId[0]) + Number(xId[e]) === Number(nId[0]) + Number(nId[e])) continue;
							//cells are different
							syncChanges = true;
							if ((nId as deletedId)[0] !== "del" && ((xId as deletedId)[0] === "del" || Number(xId[0]) + Number(xId[e]) < Number(nId[0]) + Number(nId[e]))) {
								//cell needs updated
								SET_VAL.call(this, c, e, nRow[e], false, nId[e]);
							}
						}
						match = true;
						break;//row match found and updated so don't need to search further
					}
					if (!match) return rowNotFoundCB(nRow);
				}
				function addNewRow(this: NyckelDB_interface, nRow: tableRow): void {
					if ((ids[nRow[0]] as deletedId)[0] !== "del" &&
						(!(DB[this.id] as nyckelDB_uncompressed).ids[nRow[0]] || ((DB[this.id] as nyckelDB_uncompressed).ids[nRow[0]] as deletedId)[0] === "del" &&
						(DB[this.id] as nyckelDB_uncompressed).ids[nRow[0]][1] < Number(ids[nRow[0]][0]))) {
						//new row
						syncChanges = true;
						ADD_ROW.call(this, nRow, nRow[0], false, ids[nRow[0]]);
					}
				}
				function tryHiddenRows(this: NyckelDB_interface, nRow: tableRow): void {
					updateRow.call(this, HIDDEN_TABLE_DATA[this.id], HIDDEN_IDS[this.id], nRow, addNewRow.bind(this));
				}
				//update rows
				var match: boolean;
				for (let b = 0, len = table.length, nRow; b < len; b++) {
					match = false;
					nRow = table[b];//new row
					updateRow.call(this, (DB[this.id] as nyckelDB_uncompressed).table, (DB[this.id] as nyckelDB_uncompressed).ids, nRow, tryHiddenRows.bind(this));
				}
				deleteRows.call(this);
			}
			function checkDeleted(this: NyckelDB_interface, json: nyckelDB_deleted): void {
				if (!TABLE_IS_DELETED(DB[this.id])) {
					//delete table
					return DELETE_TABLE.call(this, function (this: NyckelDB_interface) { return ret.call(this, true, false, true); }.bind(this), json.lastModified, false);
				}
				else return ret.call(this, true, false, false);
			}
			function directLoadDB(this: NyckelDB_interface): void {
				//database has just been initiated and can load all data directly from json, or is being restored from being deleted
				if (DB[this.id].lastModified >= json.lastModified) return ret.call(this, true, false, false);
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
				}
				TO_LOCAL_STORAGE.call(this, !fromLocalStorageBool);
				return ret.call(this, true, false, true);
			}
			function updateTimestamps(this: NyckelDB_interface, cb: () => void): void {
				function shiftCreatedDate(DB1: nyckelDB_uncompressed, DB2:nyckelDB_uncompressed): nyckelDB_uncompressed {
					//update created time stamp
					DB1.created = DB2.created;
					DB1.lastModified = DB1.lastModified === 0 ? DB2.lastModified : DB1.lastModified - createdDiff;
					//update all other time stamps to reflect change in created time stamp
					var i = 0, idiLen: number;
					for (let id in DB1.ids) {
						for (i = 0, idiLen = DB1.ids[id].length; i < idiLen; i++) {
							if (i !== 0 || (DB1.ids[id] as deletedId)[i] !== "del") {
								DB1.ids[id][i] = DB1.ids[id][i] - createdDiff;
							}
						}
					}
					i = null!; idiLen = null!;
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
									if (a === "timestamp") DB1.columns.meta[c][a]![0] = DB1.columns.meta[c][a]![0] - createdDiff;
									DB1.columns.meta[c][a]![1] = DB1.columns.meta[c][a]![1] - createdDiff;
								}
							}
						}
					}
					a = null!;
					return DB1;
				}
				var createdDiff = DB[this.id].created - json.created;//the difference in time between when the two tables were created
				if (createdDiff === 0) return cb();
				syncChanges = true;
				if (createdDiff > 0) DB[this.id] = shiftCreatedDate((DB[this.id] as nyckelDB_uncompressed), json);
				else json = shiftCreatedDate(json, (DB[this.id] as nyckelDB_uncompressed));
				return cb();
			}
			//preliminary checks
			if (DB[this.id].title !== json.title) return ret.call(this, false, "cannot import " + json.title, false);
			if (TABLE_IS_DELETED(json)) return checkDeleted.call(this, json);
			if (TABLE_IS_DELETED(DB[this.id])) return ret.call(this, false, "cannot import to deleted table", false);
			if (!json.table) return ret.call(this, false, "json is not valid", false);
			this.unhideRows();
			if (json.lastModified && json.lastModified === DB[this.id].lastModified) {
				//no changes
				checkDBForMissingItems.call(this);
				return ret.call(this, true, false, false);
			}
			if (DB[this.id].lastModified === 0 && (DB[this.id] as nyckelDB_uncompressed).table.length === 0 && DB[this.id].created !== json.created) {
				//table has just been initialised and table is being loaded for the first time
				return directLoadDB.call(this);
			}
			updateTimestamps.call(this, function (this: NyckelDB_interface) {
				syncColumns.call(this, json.columns, function (this: NyckelDB_interface) {
					syncTable.call(this, json.table, json.ids);
				}.bind(this));
			}.bind(this));
			if (!fromLocalStorageBool) TO_LOCAL_STORAGE.call(this, syncChanges);
			else BUILD_SEARCH_INDEX.call(this);
			return ret.call(this, true, ERRORS[this.id], syncChanges);
		}
		function applyCSV(this: NyckelDB_interface, json: csv2jsonOutput): void {
			type csv2jsonRow = { [colName: string]: tableValue; };
			function getId(this: NyckelDB_interface, jsonRow: csv2jsonRow, searchLevel: number, remainingIds: string[], idColName: string): string | false {
				function findDifferences(this: NyckelDB_interface, id: string, jsonRow: csv2jsonRow): string[] | false {
					var x: string, y: string, b = 0, ret: string[] = [];
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
					x = null!; y = null!;
					if (b === 0) return false;
					else return ret;
				}
				function onePossibleMatch(this: NyckelDB_interface, matchedID: string, minimunFindIdLoop: number, searchLevel: number, jsonRow: csv2jsonRow): string | false {
					var dif = findDifferences.call(this, matchedID, jsonRow);
					if (dif === false) return matchedID;
					if (searchLevel < minimunFindIdLoop) return false;
					for (let a = 0, difLen = dif.length; a < difLen; a++) {
						SET_VAL.call(this, matchedID, dif[a], jsonRow[dif[a]], false, 0);
						syncChanges = true;
					}
					dif = null!;
					return matchedID;
				}
				function toArray(this: NyckelDB_interface, jsonRow: csv2jsonRow): tableValue[] {
					var arr: tableValue[] = [];
					for (let a = 0, headers = (DB[this.id] as nyckelDB_uncompressed).columns.headers, len = headers.length - 1, headerName: string; a < len; a++) {
						headerName = headers[a + 1];
						arr[a] = jsonRow[headerName];
						//add empty values to table for boolean (false), number (0) or string ("") values
						if (arr[a] === undefined) {
							if ((DB[this.id] as nyckelDB_uncompressed).columns.meta[headerName].type[0] === "boolean") arr[a] = false;
							else if (/^number|nteger$|itude$/.test((DB[this.id] as nyckelDB_uncompressed).columns.meta[headerName].type[0])) arr[a] = 0;
							else arr[a] = "";
						}
					}
					return arr;
				}
				function toEditTimesArr(this: NyckelDB_interface, json: csv2jsonOutput, traceStr: string): number[] {
					var ret = [VALIDATE_EDIT_TIME.call(this, TIMESTAMP(Number(json.lastModified || 0)), "row", traceStr)];
					for (let a = 1, len = (DB[this.id] as nyckelDB_uncompressed).columns.headers.length; a < len; a++) {
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
					var ids: string[] = [];
					for (let a = 0, b = 0, idsLen = remainingIds.length; a < idsLen; a++) {
						if (this.getVal(remainingIds[a], idColName) === jsonRow[idColName]) {
							ids[b] = remainingIds[a];
							b++;
						}
					}
					switch (ids.length) {
						case 0:
							if (searchLevel < 2) return false;
							syncChanges = true;
							return ADD_ROW.call(this, toArray.call(this, jsonRow), null, false, toEditTimesArr.call(this, json, "no remaining ids"));
						case 1:
							return onePossibleMatch.call(this, ids[0], 3, searchLevel, jsonRow);
						default:
							if (searchLevel < 4) return false;
							var numDif: number[] = [],
								dif: (false | string[])[] = [];
							for (var k = 0; k < ids.length; k++) {
								dif[k] = findDifferences.call(this, ids[k], jsonRow);
								if (dif[k] === false) return ids[k];
								numDif[k] = (dif[k] as string[]).length;
							}
							if (searchLevel < 5) return false;
							var closest = 0;
							for (var m = 1; m < numDif.length; m++) {
								if (numDif[m] < numDif[m - 1]) closest = m;
							}
							return onePossibleMatch.call(this, ids[closest], 5, searchLevel, jsonRow);
					}
				}
			}
			function finish(this: NyckelDB_interface): void {
				if (json.Rows.length > 0) return ret.call(this, false, "CSV import not completed", false);
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
			if (TABLE_IS_DELETED(db)) return ret.call(this, false, "cannot import to deleted table", false);
			//importing CSV file converted to JSON with csv2json function
			var headers = CHECK_HEADERS_ARRAY.call(this, json.Headers);
			if ("lastModified" in json) {
				if (json.lastModified instanceof Date) json.lastModified = json.lastModified.getTime();
				if (IS_NUMERIC(json.lastModified)) json.lastModified = Math.round((json.lastModified - 15e11) / 6e4);
				//	else json.lastModified = null; //TODO: why is this null? should it pop an error instead?
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
						if (headers[a] === col || db.columns.meta[col].exportAs && headers[a] === db.columns.meta[col].exportAs![0]) {
							foundMatch = true;
							continue;
						}
					}
				}
				if (foundMatch === false) {
					ADD_COLUMN.call(this, headers[a], "any", a, undefined, false);//TODO set column type to something more specific than "any"
				}
			}
			//try match rows with existing data
			var remainingIds: string[] = [],
				f = 0,
				identifierCol = json.identifierCol && headers.indexOf(json.identifierCol) > -1 ? json.identifierCol : headers[0];
			this.forEachRow(function (this: NyckelDB_interface, id: string) {
				if (((DB[this.id] as nyckelDB_uncompressed).ids[id] as deletedId)[0] !== "del") {
					remainingIds[f] = id;
					f++;
				}
			}.bind(this));
			for (let loop = 0, g: number, lenG: number, id: string | false; loop < 10; loop++) {
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
		if (!json) return ret.call(this, false, "no json", false);
		if (typeof json === "string") json = JSON.parse(json);
		var syncChanges = false;
		if ("Headers" in json && "Rows" in json) return applyCSV.call(this, json);
		if ("data" in json && json.version === this.version + "_" + Base64.Version && Base64.hmac(json.data, key) === json.signature) {
			json = Base64.read(json.data, key);
		}
		if ("title" in json) return applyJSON.call(this, (json as nyckelDB_uncompressed));
		else return ret.call(this, false, "json incompatible", false);	
	}
	function CACHE_ERROR(this: NyckelDB_interface, error: any, description?: string): void {
		error = description ? String(description) + ": " + String(error) : String(error);
		ERRORS[this.id] = ERRORS[this.id] ? ERRORS[this.id] + "<br />" + error : error;
		if (console && console.log) DB[this.id] ? console.log(DB[this.id].title + ": " + error) : console.log(error);
	}
	function SAVE_FILE(this: NyckelDB_interface, str: string, fileName: string, mimeType?: string): boolean {
		function saveToWindows(this: NyckelDB_interface, str: string, fileName: string) {
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
			return savePicker.pickSaveFileAsync().then(function (this: NyckelDB_interface, file: any) {
				if (file === undefined) return false;
				// Prevent updates to the remote version of the file until we finish making changes and call completeUpdatesAsync.
				Windows.Storage.CachedFileManager.deferUpdates(file);
				// write to file
				Windows.Storage.FileIO.writeTextAsync(file, str).done(function (this: NyckelDB_interface) {
					// Let Windows know that we're finished changing the file so the other app can update the remote version of the file.
					// Completing updates may require Windows to ask for user input.
					Windows.Storage.CachedFileManager.completeUpdatesAsync(file).done(function (this: NyckelDB_interface, updateStatus: any) {
						if (updateStatus === Windows.Storage.Provider.FileUpdateStatus.complete) {
							return true;
						} else {
							CACHE_ERROR.call(this, "File " + file.name + " couldn't be saved.");
							return false;
						}
					}.bind(this));
				}.bind(this));
				return true;
			}.bind(this));
		}
		function saveToCordova(str: string, fileName: string) {
			var fileApi = cordova.file,
				path;
			if (fileApi.externalDataDirectory) path = fileApi.externalDataDirectory;//Android SD Card
			else if (fileApi.documentsDirectory) path = fileApi.documentsDirectory;	//iPhone
			else path = fileApi.dataDirectory;										//Android
			fileApi.writeFile(path, fileName, str, true);
			return true;
		}
		function downloadToBrowser(this: NyckelDB_interface, str: string, fileName: string, mimeType?: string) {
			//depends on a hidden link with id='hiddenDownloadLink'
			//<a id='hiddenDownloadLink' style='display:none' download='' href=''></a>
			//somewhere in the page to create a web browser download link
			//create link
			if (!mimeType) mimeType = "text/plain";
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
			var link: HTMLDownloadElement | null = document.getElementById("hiddenDownloadLink");
			if (link) {
				link.download = fileName;
				link.href = url;
				link.click();
			}
			else CACHE_ERROR.call(this, "html download link missing", "depends on a hidden link with id='hiddenDownloadLink' <a id='hiddenDownloadLink' style='display:none' download='' href=''></a> somewhere in the page to create a web browser download link");
			if (URL) URL.revokeObjectURL(url);
			return true;
		}
		str = READABLE_JSON_STRING(str);
		if (Windows) return saveToWindows.call(this, str, fileName);
		else if (cordova && cordova.file) return saveToCordova(str, fileName);
		else return downloadToBrowser.call(this, str, fileName, mimeType);
	}
	//returns an array of valid search terms
	function SEARCH_VALIDATE(value: string | number | boolean): string[] {
		if (!value) return [];
		var str = String(value);
		str = str.replace(/<[^>]+>/g, "");//removeHTMLTags
		str = str.toLowerCase();
		str = TO_BASIC_ALPHABET(str);
		str = str.replace(/[^_0-9a-z ]/g, " ");
		str = TRIM(str);
		if (str === "" || str === " ") return [];
		var arr = str.split(" ");
		str = null!;
		for (let a = 0, len = arr.length; a < len; a++) {
			//toPropName
			arr[a] = arr[a].replace(/ /g, "_").replace(/[^A-z0-9_]/g, "");
			if (/\d/.test(arr[a].charAt(0))) arr[a] = "_" + arr[a];
		}
		arr = DELETE_DUPLICATES(arr);
		return arr;
	}
	function BUILD_SEARCH_INDEX(this: NyckelDB_interface, colNamesToIndex?: string[], callback?: () => void): void {
		function sortByFirstCol(a: string[], b: string[]): number {
			//sort index by first column
			return a[0] === b[0] ? 0 : a[0] < b[0] ? -1 : 1;
		}
		function sortSearchWords(a: string[], b: string[]): number {
			var _a: string | number = a[0];
			var _b: string | number = b[0];
			//try to compare items as numbers	
			if (!isNaN(Number(_a)) && !isNaN(Number(_a))) {
				_a = Number(_a);
				_b = Number(_b);
			}
			return _a === _b ? 0 : _a > _b ? -1 : 1;
		}
		function start(this: NyckelDB_interface): void {
			SEARCH_INDEX[this.id] = {}; //clear search index
			SEARCH_SUGGESTIONS[this.id] = []; //clear search suggestions
			var indexItem: any[] = [],
				colNums: number[] = [];
			for (let h = 0, hLen = COL_NAMES_INDEXED[this.id].length; h < hLen; h++) {
				colNums[h] = GET_INDEX_OF_COLUMN.call(this, COL_NAMES_INDEXED[this.id][h]);
			}
			//get all the words in the table
			for (let a = 0, b = 0, len = this.getLength(), words: string[], d: number, f: number, fLen: number, dLen = COL_NAMES_INDEXED[this.id].length; b < len; b++) {
				for (words = [], d = 0; d < dLen; d++) {
					if (colNums[d] > -1) {
						words = SEARCH_VALIDATE((DB[this.id] as nyckelDB_uncompressed).table[b][colNums[d]]);
						for (f = 0, fLen = words.length; f < fLen; f++) {
							//arrange words in arrays of [word, columnName, rowId]
							indexItem[a] = [words[f], COL_NAMES_INDEXED[this.id][d], (DB[this.id] as nyckelDB_uncompressed).table[b][0]];
							a++;
						}
					}
				}
			}
			colNums = null!;
			indexItem = indexItem.sort(sortByFirstCol);
			for (let x = 0, y = 1, z = 0, reps = indexItem.length, foundMatch: boolean, row, col, i:{[colName: string]: string[]}; x < reps; x = z > 0 ? x + z : x + 1, y = x + 1, z = 0) {
				foundMatch = true;
				i = SEARCH_INDEX[this.id][indexItem[x][0]] = {};
				while (foundMatch === true) {
					if (!indexItem[y + z] || indexItem[x][0] !== indexItem[y + z][0]) {
						foundMatch = false;
					}
					row = indexItem[x + z][2];
					col = indexItem[x + z][1];
					if (!i[col]) i[col] = [row];
					else i[col].push(row);
					z++;
				}
			}
			indexItem = null!;
			//build SEARCH_SUGGESTIONS
			var searchWords: any[] = Object.keys(SEARCH_INDEX[this.id]);
			for (let c = 0, lenC = searchWords.length, g, lenG = COL_NAMES_INDEXED[this.id].length, numResultsPerWord: number[] = []; c < lenC; c++) {
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
			searchWords = null!;
			runQueuedCallbacks.call(this);
			if (callback instanceof Function) return callback();
		}
		function runQueuedCallbacks(this: NyckelDB_interface): void {
			while (BUILDING_SEARCH_INDEX_QUEUE[this.id].length > 0) {
				BUILDING_SEARCH_INDEX_QUEUE[this.id].shift()!();
			}
			BUILDING_SEARCH_INDEX[this.id] = false;
		}
		var db = DB[this.id];
		if (TABLE_IS_DELETED(db)) return;
		if (BUILDING_SEARCH_INDEX[this.id]) {
			if (callback instanceof Function) BUILDING_SEARCH_INDEX_QUEUE[this.id].push(callback);
			return;
		}
		BUILDING_SEARCH_INDEX_QUEUE[this.id] = [];
		BUILDING_SEARCH_INDEX[this.id] = true;
		if (db.columns.indexable !== undefined) {
			if (!colNamesToIndex) colNamesToIndex = db.columns.indexable.join("|").split("|");
			//refine colNames list
			else for (let c = 0, d = 0; c < colNamesToIndex.length; c++ , d++) {
				colNamesToIndex[c] = TO_PROP_NAME(colNamesToIndex[c]);
				if (colNamesToIndex[c] && colNamesToIndex[c] !== "" && db.columns.indexable.indexOf(colNamesToIndex[c]) === -1) {
					colNamesToIndex.splice(d, 1);
					d--;
				}
			}
		}
		COL_NAMES_INDEXED[this.id] = colNamesToIndex ?
			colNamesToIndex.join("|").split("|") :
			db.columns.indexable ?
				db.columns.indexable.join("|").split("|") :
				db.columns.headers.join("|").split("|");
		APP.Sto.getItem("searchIndex_" + DB[this.id].title, null, function (this: NyckelDB_interface, obj: searchIndexObj) {
			if (typeof obj === "string") obj = JSON.parse(obj);
			if (!(
				obj &&
				obj.version === this.version + "_" + Base64.Version &&
				obj.length === this.getLength() &&
				obj.lastModified === DB[this.id].lastModified &&
				obj.colNamesIndexed.join("") === COL_NAMES_INDEXED[this.id].join("")
			)) {
				return start.call(this);
			}
			SEARCH_INDEX[this.id] = obj.searchIndex;
			SEARCH_SUGGESTIONS[this.id] = obj.searchSuggestions;
			RECENTLY_SEARCHED[this.id] = obj.recentlySearched;
			runQueuedCallbacks.call(this);
			if (callback instanceof Function) return callback();
		}.bind(this), start.bind(this));
	}
	function STO_SEARCH_INDEX(this: NyckelDB_interface): void {
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
	function SET_PROP(this: NyckelDB_interface, propName: string, value: tableValue, editTime?: number, type?: basicTypeString, storeBool?: boolean): tableValue | undefined {
		function validate(this: NyckelDB_interface, propName: string, value: tableValue, type: basicTypeString): tableValue | undefined{
			if (VALUE_IS_VALID.call(this, value, type, false, "setProp")) {
				return apply.call(this, propName, value, type);
			}
			else {//try to coerce value to valid type
				if (typeof value === "string") {
					if (value !== "" && !isNaN(Number(value))) value = Number(value); //convert numbers in String form to Number form
					if (value === "true") value = true;
					if (value === "false") value = false;
				}
				if (VALUE_IS_VALID.call(this, value, type, false, "setProp")) {
					return apply.call(this, propName, value, type);
				}
				else CACHE_ERROR.call(this, value, "cannot set " + propName);
				return;
			}
		}
		function apply(this: NyckelDB_interface, propName: string, value: tableValue, type: basicTypeString): tableValue{
			editTime = VALIDATE_EDIT_TIME.call(this, editTime, "property", "setProp");
			(DB[this.id] as nyckelDB_uncompressed).properties[propName][0] = value;
			(DB[this.id] as nyckelDB_uncompressed).properties[propName][1] = editTime;
			(DB[this.id] as nyckelDB_uncompressed).properties[propName][2] = type;
			DB[this.id].lastModified = editTime + DB[this.id].created > DB[this.id].lastModified ? editTime + DB[this.id].created : DB[this.id].lastModified;
			this.syncPending = true;
			TO_LOCAL_STORAGE.call(this, storeBool);
			return value;
		}
		if (TABLE_IS_DELETED(DB[this.id])) return;
		if (typeof value === "string") value = value.replace(/<[^>]+>/g, "");//remove html markup
		propName = TO_PROP_NAME(propName);
		if ((DB[this.id] as nyckelDB_uncompressed).properties[propName]) {
			return validate.call(this, propName, value, (DB[this.id] as nyckelDB_uncompressed).properties[propName][2]);
		}
		else if (type) {
			return validate.call(this, propName, value, type);
		}
		else CACHE_ERROR.call(this, propName, "invalid property name");
		return;
	}
	function ADD_ROW(this: NyckelDB_interface, array: any[], id: string | null, storeBool: boolean, editTimesArr?: number[]): string | false {
		//creates a 3 digit id from custom alphabet one step higher than the given starting point
		function getNextId(this: NyckelDB_interface, idLength: number, existingIds: { [id: string]: any; }, startingPoint: string | null): string | null {
			function setStartingPoint(startingPoint: string | null): void {
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
			function maxNumPos(idLength: number, alphabetLength: number): number {
				return Math.pow(alphabetLength, idLength - 1) * (alphabetLength - 10);
			}
			function buildId(this: NyckelDB_interface): string | null {
				function nextIndex(activeChar: number): number {
					return alphabet.indexOf(newId.charAt(activeChar)) - 1;
				}
				//roll all the digits ahead i.e. from 0099 to 0100
				function rollAhead(): void {
					while (letterIndex + 1 === alphabetLength) {
						//reached the end of the alphabet
						end = "";
						for (let c = 0; c < newId.slice(activeChar, idLength).length; c++) end += alpha;
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
				var activeChar: number,
					letterIndex: number,
					end;
				for (activeChar = idLength - 1; (existingIds[newId] !== undefined || FORBIDDEN.indexOf(newId) !== -1) && activeChar > -1 && num < maxIdsPossible; activeChar-- , num++) {
					for (letterIndex = alphabet.indexOf(newId.charAt(activeChar));
						(existingIds[newId] !== undefined || FORBIDDEN.indexOf(newId) !== -1) && letterIndex < alphabetLength && num < maxIdsPossible;
						letterIndex++ , num++) {
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
				alphabet = null!; alphabetLength = null!; alpha = null!; activeChar = null!; letterIndex = null!; end = null;
				if (num > maxIdsPossible) {
					CACHE_ERROR.call(this, "getNextId failed", "You have exceeded a design limitation in the number of possible records that this application can handle.");
					return null;
				}
				else return newId;
			}
			var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
			existingIds = existingIds || {};
			if (typeof existingIds !== "object") {
				CACHE_ERROR.call(this, "getNextId failed", "Invalid parameters: existingIds expects a JSON object");
				return null;
			}
			var alphabetLength = alphabet.length,
				maxIdsPossible = maxNumPos(idLength, alphabetLength),
				newId = "",
				num = 0,
				alpha = alphabet[0];

			setStartingPoint(startingPoint);
			return buildId.call(this);
		}
		if (TABLE_IS_DELETED(DB[this.id])) {
			CACHE_ERROR.call(this, "please recreate table before adding rows");
			return false;
		}
		var hLen = (DB[this.id] as nyckelDB_uncompressed).columns.headers.length;
		if (id && array.length === hLen && array[0] === id) {
			array = array.slice(1);
		}
		if (array.length !== hLen - 1) {
			CACHE_ERROR.call(this, array, "new row doesn't match table size: " + hLen);
			return false;
		}
		id = getNextId.call(this, 3, (DB[this.id] as nyckelDB_uncompressed).ids, id ? id : IS_ARRAY(array) ? array.join("") : null);
		if (!id) return false;
		var row: any[] = [id];
		if (!array || array.constructor !== Array) {
			CACHE_ERROR.call(this, array, "cannot add row");
			row = null!;
			return false;
		}
		for (let a = 1, len = (DB[this.id] as nyckelDB_uncompressed).columns.headers.length, type; a < len; a++){
			type = (DB[this.id] as nyckelDB_uncompressed).columns.meta[(DB[this.id] as nyckelDB_uncompressed).columns.headers[a]].type[0];
			if (type === "boolean") row[a] = false;
			else if (VALID_NUMBER_TYPES.test(type)) row[a] = 0;
			else row[a] = "";
		}
		(DB[this.id] as nyckelDB_uncompressed).table.push((row as tableRow));
		ROW_INDEX_CACHE[this.id] = {};//clear the cache
		editTimesArr = editTimesArr || [];
		editTimesArr[0] = VALIDATE_EDIT_TIME.call(this, editTimesArr[0], "row", "addRow");

		DB[this.id].lastModified = editTimesArr && editTimesArr[0] !== undefined ?
			editTimesArr[0] + DB[this.id].created > DB[this.id].lastModified ?
				editTimesArr[0] + DB[this.id].created : DB[this.id].lastModified : TIMESTAMP();

		(DB[this.id] as nyckelDB_uncompressed).ids[id] = editTimesArr && editTimesArr[0] !== undefined ? [editTimesArr[0]] : [TIMESTAMP(DB[this.id].created)];

		for (let a = 0, len = hLen - 1; a < len; a++) {
			SET_VAL.call(this, id, a + 1, array[a], false, editTimesArr[a + 1]);
		}
		row = null!; hLen = null!;
		this.syncPending = true;
		TO_LOCAL_STORAGE.call(this, storeBool);
		return id;
	}
	function VALIDATE(this: NyckelDB_interface, value: any, valueType: typeString, traceStr:string, callback?: validateCallback): validateObj {
		function ret(this: NyckelDB_interface, valid: boolean, change: tableValue, ErrMsg: tableErrors, details?: string): validateObj {
			var obj = { valid: valid, value: change, error: ErrMsg, details: change !== value ? "Changed '" + value + "' to '" + change + "'" : details };
			if (callback instanceof Function) callback.call(this, change, ErrMsg, obj.details);
			return obj;
		}
		function validateFamilyName(this: NyckelDB_interface, name: any) {
			var orig = name,
				n;
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
				else return ret.call(this, false, orig, "Invalid lastname", "'" + name + "' is not a valid last name");
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
			else name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
			n = null;
			return ret.call(this, true, name, false);
		}
		function validateGivenName(this: NyckelDB_interface, name: any) {
			var orig = name;
			name = TRIM(String(name));
			if (/[^A-Za-z\xC0-\xFF \-&\(\),;\[\]]/g.test(name)) {
				var expl = "Firstnames may only contain latin characters A-Z and special characters &()[],;-'ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÛÜÝÞß";
				return ret.call(this, false, orig, "Invalid charactors found in firstname", expl);
			}
			name = name.replace(/\. /g, ", ");
			var n = name.split(" ");
			//capitalize names
			for (let a = 0, lenA = n.length; a < lenA; a++) n[a] = n[a].charAt(0).toUpperCase() + n[a].slice(1);
			name = n.join(" ");
			n = null!;
			return ret.call(this, true, name, false);
		}
		function validateOrganization1_Name(this: NyckelDB_interface, field: any) {
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
		function validateAddress(this: NyckelDB_interface, addr: any) {
			function formatSeeOtherAddr(addr: string) {
				addr = addr.replace(/addres:|Address:|adress:|Adress:|Addres:|address:/, "address: ");
				addr = addr.replace(/Mail:|Mail to:|mail to:|mail:/, "mail: ");
				if (!/mail:/.test(addr)) addr = addr.replace(/c\/o /i, "mail: c/o ");
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
					if (!/PO Box/g.test(addr)) addr = addr.replace(/Box/g, " PO Box ");
					addr = addr.replace(/Site/g, " Site ");
					addr = addr.replace(/Comp/g, " Comp ");
					addr = addr.replace(/(RR\s\s|RR)(\d)/gi, " RR $2");
					addr = addr.replace(/Unit/g, " Unit ");
					addr = addr.replace(/Block/g, " Block ");
				}
				return addr;
			}
			function formatMailAddr(addr: string) {
				addr = addr.replace(/Bx|Po Box/g, " PO Box ");
				if (!/PO Box/.test(addr)) addr = addr.replace(/Box/g, " PO Box ");
				addr = addr.replace(/Site/g, " Site ");
				addr = addr.replace(/Comp/g, " Comp ");
				return addr.replace(/(RR\s\s|RR)(\d)/gi, " RR $2");
			}
			function formatRuralAddr(addr: string) {
				if (!/mile /gi.test(addr)) addr = addr.replace(/\./g, "");
				addr = addr.replace(/Rge/g, " Range ");
				addr = addr.replace(/Twp/g, " Township ");
				if (/ Range | Township /.test(addr)) addr = addr.replace(/Rd/g, " Road ");
				addr = addr.replace(/Hwy|HWY|hwy|Hiway|hiway/g, " Highway ");
				//replace dash in Range Road number
				var i: number;
				if (/Range Road \d\-\d|Range Road \d\d-\d/.test(addr)) {
					i = addr.indexOf("Range Road ");
					if (addr.charAt(i + 12) === "-") addr = addr.slice(0, i + 12) + addr.slice(i + 13);
					if (addr.charAt(i + 13) === "-") addr = addr.slice(0, i + 13) + addr.slice(i + 14);
				}
				//replace dash in Township Road number
				if (/Township Road \d\-\d|Township Road \d\d-\d/.test(addr)) {
					i = addr.indexOf("Township Road ");
					if (addr.charAt(i + 15) === "-") addr = addr.slice(0, i + 15) + addr.slice(i + 16);
					if (addr.charAt(i + 16) === "-") addr = addr.slice(0, i + 16) + addr.slice(i + 17);
				}
				i = null!;
				return addr;
			}
			function formatUrbanAddr(addr: string) {
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
			var orig = addr,
				brak = "",
				c = TRIM(String(addr)).split(" ");
			//capitalize
			for (let a = 0, lenA = c.length; a < lenA; a++) {
				if (!/\d/.test(c[a]) && c[a] !== "of" && c[a] !== "see" && !/addres|adres|mail|^see:/.test(c[a])) {
					c[a] = c[a].charAt(0).toUpperCase() + c[a].slice(1);
				}
				if (c[a] === "Nw" || c[a] === "Ne" || c[a] === "Sw" || c[a] === "Se" || c[a] === "Po" || c[a] === "Rr") c[a] = c[a].toUpperCase();
				if (c[a] === "C/o") c[a] = c[a].toLowerCase();
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
		function validateCity(this: NyckelDB_interface, city: any) {
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
			if (/\'/.test(city) && !/\'s/.test(city)) city = city.replace(/\'/g, "");
			if (/\./.test(city) && !/\St. | No. \d|^M.D. of /.test(city)) city = city.replace(/\./g, "");
			city = city.replace(/[^A-Za-z0-9\xC0-\xFF\s\'\.]/g, "");//special characters \xC0-\xFF (ÅÖÄöäå, etc) allowed
			return ret.call(this, true, city, false);
		}
		function validateProvince(this: NyckelDB_interface, prov: any) {
			var orig = prov;
			prov = TRIM(String(prov)).replace(/[^A-z ]/g, "");
			if (prov === "PEI") prov = "PE";
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
				arr = null!;
			}
			return ret.call(this, true, prov, false);
		}
		function validatePostalCode(this: NyckelDB_interface, code: any) {
			var orig = code;
			//number only codes
			if (IS_NUMERIC(code)) {
				if (/[\s\-]/.test(String(orig))) {
					code = TRIM(String(orig).replace(/[^0-9\s\-]/g, ""));
					return ret.call(this, true, code, false);
				}
				if (!String(code).match(/\d{2,10}/)) return ret.call(this, false, orig, "Invalid postal code");
				else return ret.call(this, true, code, false);
			}
			//number letter codes
			else {
				code = String(code).toUpperCase().replace(/[^A-Z0-9]/g, "");
				if (code.length === 6) {
					//check Canadian Postal Codes
					for (let a = 0; a < 6; a++) {
						//catch 0 instead of O
						if (code.charAt(a) === "0") code = code.slice(0, a) + "O" + code.slice(a + 1, 6);
						if (/[^A-Z]/.test(code.charAt(a))) {
							return ret.call(this, false, orig, "Invalid Canadian postal code", "Position " + a + " should be an uppercase letter A-Z");
						}
						a++;
						//catch O instead of 0
						if (code.charAt(a) === "O") code = code.slice(0, a) + "0" + code.slice(a + 1, 6);
						if (/[^0-9]/.test(code.charAt(a))) {
							return ret.call(this, false, orig, "Invalid Canadian postal code", "Position " + a + " should be a number");
						}
					}
					//check for Canadian postal code format and add missing space
					if (code.match(/[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d/)) code = code.slice(0, 3) + " " + code.slice(3);
					else return ret.call(this, false, orig, "Invalid Canadian Postal Code", "Use format A1A 1A1");
				}
			}
			return ret.call(this, true, code, false);
		}
		function validatePhoneNumber(this: NyckelDB_interface, phon: any) {
			function validateInternationalNumber(this: NyckelDB_interface, phon: string) {
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
					if (phon.charAt(0) === "0") phon = orig.replace(/[^0-9\s\-]/g, "");

					else return ret.call(this, false, orig, "International phone numbers must begin with '+' symbol");
				}
				else return ret.call(this, false, orig, "Invalid Phone Number");
				return ret.call(this, true, phon, false);
			}
			var orig = String(phon);
			phon = String(phon).replace(/[^0-9]/g, "");
			if (orig.length > 0 && !/\d/.test(phon)) return ret.call(this, false, orig, "Phone number must contain digits");
			//international numbers
			if (phon.charAt(0) !== "1" && (phon.length > 10 || phon.charAt(0) === "0" || String(orig).charAt(0) === "+")) {
				return validateInternationalNumber.call(this, phon);
			}
			else if (phon) {
				//catch emergency numbers
				if (phon.charAt(0) === "1" && phon.length < 6) return ret.call(this, true, phon, false);
				//catch area code inserted where country code should be (403-403-987-6543)
				if (phon.length === 13 && phon.slice(0, 3) === phon.slice(3, 6)) phon = "1" + phon.slice(3, 13);
				//catch country code (1) at beginning of phone number
				if (phon.length === 11 && parseInt(phon.charAt(0), 10) === 1) phon = "+1 " + phon.slice(1, 4) + "-" + phon.slice(4, 7) + "-" + phon.slice(7, 11);
				//catch spaces, dots or brackets used instead of dashes
				else if (phon.length === 10 && parseInt(phon.charAt(0), 10) !== 1) phon = phon.slice(0, 3) + "-" + phon.slice(3, 6) + "-" + phon.slice(6, 10);
				else return ret.call(this, false, orig, "Invalid Phone Number");
			}
			return ret.call(this, true, phon, false);
		}
		function validateEmail(this: NyckelDB_interface, email: any) {
			var orig = email,
				e = TRIM(String(email)).split("@");
			if (e.length === 2) {
				//username
				e[0] = e[0].replace(/[^A-Za-z0-9\&\'\+\-_\.]/g, "");//too restrictive?
				e[0] = e[0].replace(/^\.|\.$|^\-|\-$/g, "");
				e[0] = e[0].replace(/[\s\t\r\n]/g, "");
				e[0] = e[0].replace(/\.\./g, ".");
				e[0] = e[0].slice(0, 63);
				//domain
				e[1] = e[1].replace(/[^A-Za-z0-9\-\.\_\:\[\]]/g, "");//too restrictive?
				e[1] = e[1].replace(/^\.|\.$|^\-|\-$/g, "");
				e[1] = e[1].replace(/[\s\t\r\n]/g, "");
				e[1] = e[1].replace(/\.\./g, ".");
				if (e[0].length > 0 && e[1].length > 1
					&& /^[\w!#$%&'*+\-\/=?^`{|}~.]+$/.test(e[0])
					&& new RegExp("^([a-z0-9][a-z0-9\\-]*\\.)+([a-z]+|xn--[a-z0-9\\-]+)$", "i").test(e[1])) {
					email = (e[0] + "@" + e[1]).slice(0, 255);
				}
				else return ret.call(this, false, orig, "Invalid Email Address", "This email address contains features that may not be compatible with all clients");
			}
			else return ret.call(this, false, orig, "Invalid Email Address", e.length === 1 ? "Requires an @ symbol" : "Email addresses may only contain 1 @ symbol");
			return ret.call(this, true, email, false);
		}
		function validateGPSCoordinates(this: NyckelDB_interface, str: any) {
			var orig = str;
			str = TRIM(String(str)).replace(/[^\+\-0-9\s\.,]/, "");
			if (!/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(str)) {
				return ret.call(this, false, orig, "Invalid GPS Co-ordinates");
			}
			var coord = str.split(", ");
			if (coord.length === 2) {
				if (/\./.test(coord[0])) coord[0] = coord[0].split(".")[0] + "." + coord[0].split(".")[1].slice(0, 6);
				if (/\./.test(coord[1])) coord[1] = coord[1].split(".")[0] + "." + coord[1].split(".")[1].slice(0, 6);
				str = coord[0] + ", " + coord[1];
			}
			coord = null!;
			return ret.call(this, true, str, false);
		}
		function validateLatitude(this: NyckelDB_interface, str: any) {
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
		function validateLongitude(this: NyckelDB_interface, str: any) {
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
		if (!VALID_TYPES.test(valueType)) return ret.call(this, false, value, valueType + " is not a valid type");
		if (!VALUE_IS_VALID.call(this, value, valueType, false, traceStr + "@validate")) return ret.call(this, false, value, ERRORS.pop() || false);
		if (value === "") return ret.call(this, true, value, false);

		//validate value based on value type
		if (/Family/i.test(valueType)) return validateFamilyName.call(this, value);
		else if (/Given|Spouse/i.test(valueType)) return validateGivenName.call(this, value);
		else if (/Field|Organization/i.test(valueType)) return validateOrganization1_Name.call(this, value);
		else if (/City|County/i.test(valueType)) return validateCity.call(this, value);
		else if (/Province|State|Region/i.test(valueType)) return validateProvince.call(this, value);
		else if (/Postal/i.test(valueType)) return validatePostalCode.call(this, value);
		else if (/Street/i.test(valueType) || /Location/i.test(valueType) && /[A-z]/.test(String(value))) return validateAddress.call(this, value);
		else if (/Latitude/i.test(valueType)) return validateLatitude.call(this, value);
		else if (/Longitude/i.test(valueType)) return validateLongitude.call(this, value);
		else if (/Location/i.test(valueType)) return validateGPSCoordinates.call(this, value);
		else if (/Phone/i.test(valueType)) return validatePhoneNumber.call(this, value);
		else if (/Email|E-mail|E_mail/i.test(valueType)) return validateEmail.call(this, value);
		else return ret.call(this, true, value, false);
	}
	function GET_FORBIDDEN(): string[] {
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
	function SET_VAL(this: NyckelDB_interface, rowId: string | number, colName: string | number, newValue: tableValue, storeBool: boolean, editTime?: number, callback?: (newValue: tableValue | undefined, errors:string | false, title:string, syncPending: boolean) => void): tableValue | undefined {
		function applyVal(this: NyckelDB_interface, toTable: tableRow[], toIds: tableIds, rowIndex: number): tableValue {
			var thisModified: number;
			editTime = VALIDATE_EDIT_TIME.call(this, editTime, "cell", "setVal", toTable[rowIndex][0]);
			toTable[rowIndex][colIndex] = newValue;
			toIds[toTable[rowIndex][0]][colIndex] = editTime;
			thisModified = (toIds[toTable[rowIndex][0]] as deletedId)[0] === "del" ?
				editTime + Number(toIds[toTable[rowIndex][0]][1]) + DB[this.id].created :
				editTime + Number(toIds[toTable[rowIndex][0]][0]) + DB[this.id].created;
			if (thisModified > DB[this.id].lastModified) DB[this.id].lastModified = thisModified;
			thisModified = null!;
			this.syncPending = true;
			TO_LOCAL_STORAGE.call(this, storeBool);
			return callback instanceof Function ? (callback.call(this, newValue, false, DB[this.id].title, true), newValue) : newValue;
		}
		var db = DB[this.id];
		if (TABLE_IS_DELETED(db)) {
			return callback instanceof Function ? (callback.call(this, undefined, "table is deleted", DB[this.id].title, this.syncPending), undefined) : undefined;
		}
		if (typeof newValue === "string") {
			newValue = newValue.replace(/<[^>]+>/g, "");//remove html markup
			if (newValue !== "" && !isNaN(Number(newValue))) newValue = Number(newValue); //convert numbers in String form to Number form
			if (newValue === "true") newValue = true;
			if (newValue === "false") newValue = false;
		}
		var rowIndex = GET_INDEX_OF_ROW.call(this, rowId),
			colIndex = GET_INDEX_OF_COLUMN.call(this, colName),
			rowIsHidden = false;
		if (rowIndex < 0) {
			rowIndex = GET_INDEX_OF_HIDDEN_ROW.call(this, rowId);
			if (rowIndex > -1) rowIsHidden = true;
		}
		if (!(rowIndex > -1 && colIndex > 0)) {
			var error = rowIndex === -1 ? "rowId not found: " + rowId : "colName not found: " + colName;
			return callback instanceof Function ? (callback.call(this, undefined, error, DB[this.id].title, this.syncPending), undefined) : undefined;
		}
		var validationObj = VALIDATE.call(this, newValue, db.columns.meta[db.columns.headers[colIndex]].type[0], "SET_VAL: " + rowId + ":" + colName);
		if (validationObj.valid) {
			if (rowIsHidden) return applyVal.call(this, HIDDEN_TABLE_DATA[this.id], HIDDEN_IDS[this.id], rowIndex);
			else return applyVal.call(this, db.table, db.ids, rowIndex);
		}
		else return callback instanceof Function ? (callback.call(this, undefined, ERRORS[this.id], DB[this.id].title, this.syncPending), undefined) : undefined;
	}
	function DELETE_ROW(this: NyckelDB_interface, rowId: string | number, storeBool: boolean, editTime?: number): boolean {
		if (TABLE_IS_DELETED(DB[this.id])) {
			CACHE_ERROR.call(this, rowId, "could not delete row, table has been deleted");
			return false;
		}
		//get row index
		var index = GET_INDEX_OF_ROW.call(this, rowId),
			rowIsHidden = false;
		//if not found
		if (index === -1) {
			//check hidden rows
			if (HIDDEN_TABLE_DATA[this.id] && HIDDEN_IDS[this.id][rowId]) {
				rowIsHidden = true;
				index = GET_INDEX_OF_HIDDEN_ROW.call(this, rowId);
			}
			if (index === -1) {
				index = null!;
				CACHE_ERROR.call(this, rowId, "row does not exist or was already deleted");
				return false;
			}
		}
		//if found
		editTime = VALIDATE_EDIT_TIME.call(this, editTime, "row", "deleteRow");
		//set deleted in id registry
		if (rowIsHidden) (HIDDEN_IDS[this.id][HIDDEN_TABLE_DATA[this.id][index][0]] as deletedId) = ["del", editTime];
		else ((DB[this.id] as nyckelDB_uncompressed).ids[(DB[this.id] as nyckelDB_uncompressed).table[index][0]] as deletedId) = ["del", editTime];
		//delete the row
		if (rowIsHidden) HIDDEN_TABLE_DATA[this.id].splice(index, 1);
		else (DB[this.id] as nyckelDB_uncompressed).table.splice(index, 1);
		//clear the row cache
		ROW_INDEX_CACHE[this.id] = {};
		//update lastModified and syncPending
		DB[this.id].lastModified = editTime + DB[this.id].created > DB[this.id].lastModified ? editTime + DB[this.id].created : DB[this.id].lastModified;
		this.syncPending = true;
		//save changes to localStorage
		TO_LOCAL_STORAGE.call(this, storeBool);
		return true;
	}
	function VALIDATE_EDIT_TIME(this: NyckelDB_interface, num: any, type: string, traceStr: string, id?: string): number {
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
				if (TABLE_IS_DELETED(db)) CACHE_ERROR.call(this, "cannot validate cell edit time of deleted table");
				else if (id) t = (db.ids[id] as deletedId)[0] === "del" ? TIMESTAMP(db.created) : TIMESTAMP(db.created + db.ids[id][0]);
				else CACHE_ERROR.call(this, "validating a cell edit time requires an cell id");
				break;
			default:
				CACHE_ERROR.call(this, type, "no such item to timestamp @ " + traceStr);
		}
		if (num === "del" && type === "row") return num;
		else if (!num && num !== 0) return t;
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
	function DELETE_TABLE(this: NyckelDB_interface, callback: (sucess: boolean, errors: tableErrors, title: string, syncPending: boolean) => void, editTime?: number, storeBool?: boolean): void {
		var msg = "Are you sure you want to delete " + DB[this.id].title + " ?",
			del = function (this: NyckelDB_interface) {
				DELETE_TABLE_BY_ID.call(this, this.id, editTime);
				this.syncPending = true;
				TO_LOCAL_STORAGE.call(this, storeBool);
				if (callback instanceof Function) return callback.call(this, true, ERRORS[this.id], DB[this.id].title, true);
			}.bind(this),
			cancel = function (this: NyckelDB_interface) {
				if (callback instanceof Function) return callback.call(this, false, ERRORS[this.id], DB[this.id].title, false);
			}.bind(this);
		if (APP.confirm) APP.confirm(msg, del, cancel, { "okButton": "Delete" });
		else if (window && window.confirm(msg)) del.call(this);
		else cancel.call(this);
	}
	function DELETE_TABLE_BY_ID(this: NyckelDB_interface, id: number, editTime?: number): void {
		var validatedEditTime = VALIDATE_EDIT_TIME.call(this, editTime, "deleted", "deleteTableById");
		(DB[id] as unknown as nyckelDB_deleted) = {
			"title": DB[id].title,
			"created": DB[id].created,
			"lastModified": validatedEditTime,
			"deleted": true,
			"version": this.version + "_" + Base64.Version
		};
		validatedEditTime = null!;
	}
	function INITIATE_DBS(this: NyckelDB_interface, title: string, callback?:(title: string) => void): void {
		function newDBS(this: NyckelDB_interface) {	
			DBS[NUM++] = title;
			APP.Sto.setItem("tables", JSON.stringify(DBS));
			if (callback instanceof Function) return callback(title);
		}
		title = TO_PROP_NAME(title);
		if (DBS && DBS[NUM + 1] === title) {
			NUM++;
			if (callback instanceof Function) return callback(title);
		}
		else APP.Sto && APP.Sto.getItem("tables", null, function (this: NyckelDB_interface, tables: string): void {
			if (tables) {
				DBS = JSON.parse(tables);
				if (DBS.indexOf(title) === -1) newDBS.call(this);
				else {
					NUM++;
					if (callback instanceof Function) return callback(title);
				}
			}
			else newDBS.call(this);
		}.bind(this), newDBS.bind(this));
	}
	function CHECK_HEADER_VALUE(headerValue: any, existingHeaders: string[]): string{
		headerValue = TO_PROP_NAME(headerValue);
		var b = 1;
		if (existingHeaders.indexOf(headerValue) > -1) {
			while (existingHeaders.indexOf(headerValue.replace(/_\d$/, "") + "_" + b) > 0) b++;
			headerValue = headerValue.replace(/_\d$/, "") + "_" + b;
		}
		return headerValue;
	}
	function CHECK_HEADERS_ARRAY(headers: any[]): string[] {
		var ret: string[] = [];
		for (let a = 0, len = headers.length; a < len; a++) {
			ret[a] = CHECK_HEADER_VALUE(headers[a], ret)
		}
		if (ret[0] !== "id") {
			if (ret.indexOf("id") > -1) ret[ret.indexOf("id")] = "_id";
			ret.unshift("id");
		}
		return ret;
	}
	function CREATE_BASE64_FILE(this: NyckelDB_interface, key: string | null | undefined, token?: string | syncToken, callback?: syncCallback): void {
		function dataString(this: NyckelDB_interface): string {
			var str = Base64.write(JSON.stringify(EXPORT_DB.call(this)), key);
			return JSON.stringify({
				"data": str,
				"signature": Base64.hmac(str, key),
				"version": this.version + "_" + Base64.Version
			});
		}
		function syncFile(this: NyckelDB_interface): string {
			if (!DBX_SYNC_OBJ[title] || DB[this.id].lastModified > DBX_SYNC_OBJ[title]) DBX_SYNC_OBJ[title] = DB[this.id].lastModified;
			return JSON.stringify(DBX_SYNC_OBJ);
		}
		function syncToken(this: NyckelDB_interface, token?: string | syncToken): string {
			if (token) {
				token = typeof token === "string" ? JSON.parse(token) : token;
				if (typeof token !== "string" && token && token.version === this.version + "_" + Base64.Version) {
					if (token.signature && token.token && token.signature === Base64.hmac(token.token, key)) {
						let dbxSyncObj: { [tableName: string]: number } = JSON.parse(Base64.read(token.token, key));
						for (let i in dbxSyncObj) {
							if (!DBX_SYNC_OBJ[i]) DBX_SYNC_OBJ[i] = dbxSyncObj[i];
						}
					}
					else {
						SYNC_ERROR = true;
						SYNC_ERROR_TIME = new Date().getTime();
						CACHE_ERROR.call(this, "incorrect key tried");
					}
				}
				else CACHE_ERROR.call(this, "token version not supported");
			}
			if (!DBX_SYNC_OBJ[title] || DB[this.id].lastModified > DBX_SYNC_OBJ[title]) DBX_SYNC_OBJ[title] = DB[this.id].lastModified;
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
		var title = TO_PROP_NAME(DB[this.id].title),
			obj = {
			"title": DB[this.id].title,
			"file": dataString.call(this),
			"syncFile": syncFile.call(this),
			"syncToken": syncToken.call(this, token)
		};
		if (callback instanceof Function) return callback.call(this, true, ERRORS[this.id], obj);
	}
	function VALIDATE_BASIC_TYPE(this: NyckelDB_interface, type: any): basicTypeString{
		return (VALIDATE_TYPE.call(this, type, true) as basicTypeString);
	}
	function VALIDATE_TYPE(this: NyckelDB_interface, type: any, basicTypeBool?: boolean): typeString {
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

		if (type && type.match(VALID_TYPES)) return type;
		else {
			if (basicTypeBool) CACHE_ERROR.call(this, type, "customProperties can only be set to string, number, boolean, or any, not");
			else CACHE_ERROR.call(this, type, "invalid Header type");
			return "any";
		}
	}
	function VALIDATE_COLUMN_PROPERTY(this: NyckelDB_interface, value: any, propertyName: keyof columnMetadata, columnType: typeString): tableValue {
		if (propertyName === "type") return VALIDATE_TYPE.call(this, value);
		else if (propertyName === "deleted" || propertyName === "search") return value === false ? value : true;
		else if (propertyName === "initialValue") {
			var obj = VALIDATE.call(this, value, columnType, "validate " + propertyName + " prop " + columnType);
			if (obj.valid && !obj.error) return obj.value;
			else return VALID_NUMBER_TYPES.test(columnType) ? 0 : VALID_STRING_TYPES.test(columnType) ? "" : false;
		}
		else return String(value);
	}
	function APPLY_COLUMN_PROPERTIES(this: NyckelDB_interface, tableHeaders: initTableHeaders, columnProperties?: { [columnName: string]: any }, tableCreated?: number, doNotIndex?: string[]) {
		function applyHeaders(this: NyckelDB_interface, headers: initTableHeaders): string[] {
			if (IS_ARRAY(headers)) {
				return CHECK_HEADERS_ARRAY(headers);
			}
			else if (!headers || typeof headers !== "object") return ["id"];
			var headersArr: string[] = ["id"],
				b = 1;
			for (let a in headers) {
				if (a !== "id") {
					headersArr[b] = CHECK_HEADER_VALUE(a, headersArr);
					if (!_columnProperties[headersArr[b]] && _columnProperties[a]) {
						_columnProperties[headersArr[b]] = _columnProperties[a];
						delete _columnProperties[a];
					}
					_columnProperties[headersArr[b]] = _columnProperties[headersArr[b]] || {};
					if (!_columnProperties[headersArr[b]].type && typeof headers[a] === "string") {
						_columnProperties[headersArr[b]].type = VALIDATE_TYPE.call(this, headers[a]);
					}
					b++;
				}
			}
			b = null!;
			return headersArr;
		}
		function apply_Simple_Array(this: NyckelDB_interface, tableHeadersArr: any[], headers: string[]): tableColumns {
			for (let a = 1, b = 0, len = tableHeadersArr.length; a < len; a++ , b++) {
				obj.meta[headers[a]] = {
					type: [VALIDATE_TYPE.call(this, _columnProperties[b]), time],
					timestamp: [time, time]
				};
				if (headers[a] !== tableHeadersArr[a]) obj.meta[headers[a]].exportAs = [String(tableHeadersArr[a]), time];
			}
			console.log("simple_Array " +  db.title, obj);
			return obj;
		}
		function applyArray(this: NyckelDB_interface, tableHeadersArr: any[], headers: string[]): tableColumns {
			for (let a = 1, len = tableHeadersArr.length; a < len; a++) {
				//if given tableHeader name contains a space or invalid character
				if (!_columnProperties[headers[a]]) {
					let _badHeader = tableHeadersArr[a];
					_columnProperties[headers[a]] = _columnProperties[_badHeader];
					delete _columnProperties[_badHeader];
				}
				if (_columnProperties[headers[a]]) {
					if (typeof _columnProperties[headers[a]] === "string") {
						//migrate old version of types data forward to be held in an object
						obj.meta[headers[a]] = {
							type: [VALIDATE_TYPE.call(this, _columnProperties[headers[a]]), time],
							timestamp: [time, time]
						};
					}
					else if (_columnProperties[headers[a]].type) {
						if (IS_ARRAY(_columnProperties[headers[a]].type)) obj.meta[headers[a]] = {
							type: [VALIDATE_TYPE.call(this, _columnProperties[headers[a]].type[0]), _columnProperties[headers[a]].type[1]],
							timestamp: _columnProperties[headers[a]].timestamp || [time, time]
							//TODO add other properties
							//initialValue: 
						};
						else obj.meta[headers[a]] = {
							type: [VALIDATE_TYPE.call(this, _columnProperties[headers[a]].type), time],
							timestamp: _columnProperties[headers[a]].timestamp || [time, time]
							//TODO add other properties
							//initialValue: 
						};
					}
					else console.log(_columnProperties[headers[a]], "error");
					if (_columnProperties[headers[a]].exportAs) obj.meta[headers[a]].exportAs = _columnProperties[headers[a]].exportAs;
					else if (headers[a] !== tableHeadersArr[a]) obj.meta[headers[a]].exportAs = [String(tableHeadersArr[a]), time];
				}
				else {
					obj.meta[headers[a]] = {
						type: ["any", time],
						timestamp: [time, time]
					};
					if (headers[a] !== tableHeadersArr[a]) obj.meta[headers[a]].exportAs = [String(tableHeadersArr[a]), time];
				}
			}
			console.log("applied array " + db.title, obj);
			return obj;
		}
		function applyObject(this: NyckelDB_interface, headers: string[]): tableColumns {
			//TODO rewrite
			var b = 1;
			for (let a in tableHeaders) {
				if (a !== "id") {
					obj.meta[headers[b]] = {
						type: ["any", time],
						timestamp: [time, time]
					};
					if (typeof _columnProperties[a] === "string") {
						obj.meta[headers[b]].type[0] = VALIDATE_TYPE.call(this, _columnProperties[a]);
					}
					else if (typeof _columnProperties[a] === "object") {
						for (let c in _columnProperties[a]) {
							if (_columnProperties[a].hasOwnProperty(c)) {
								obj.meta[headers[b]][c] = obj.meta[headers[b]][c] || ["", VALIDATE_EDIT_TIME.call(this, 0, "column", "apply column type")];
								if (IS_ARRAY(_columnProperties[a][c])) {
									obj.meta[headers[b]][c]![0] = VALIDATE_COLUMN_PROPERTY.call(this, _columnProperties[a][c][0], c, _columnProperties[a].type[0]);
									obj.meta[headers[b]][c]![1] = VALIDATE_EDIT_TIME.call(this, _columnProperties[a][c][1],"column", "apply column type");
								}
								else if (VALUE_IS_VALID.call(this, _columnProperties[a][c], "any", true, "applying table properties")) {
									obj.meta[headers[b]][c]![0] = VALIDATE_COLUMN_PROPERTY.call(this, _columnProperties[a][c], c, _columnProperties[a].type);
								}
								else console.log("found invalid table property", _columnProperties[a][c], a, c);
							}
						}
					}
					else {
						//console.log("error: invalid type of column properties", _columnProperties[a]);
					}
					if (headers[b] !== a && !obj.meta[headers[b]].exportAs) obj.meta[headers[b]].exportAs = [a, time];
				}
				b++;
			}
			b = null!;
			console.log("applied obj " + db.title, obj);
			return obj;
		}
		var time = TIMESTAMP(tableCreated),
			_columnProperties = columnProperties || {},
			obj: tableColumns = {
				meta: {},
				headers: applyHeaders.call(this, tableHeaders),
				indexable: []
			},
			db = DB[this.id];
		if (TABLE_IS_DELETED(db)) return obj;
		obj.indexable = obj.headers.join("|").split("|");
		obj.indexable.splice(0, 1);//remove id
		if (IS_ARRAY(doNotIndex)) {
			for (let a = 0, len = doNotIndex.length, i; a < len; a++) {
				i = obj.indexable.indexOf(TO_PROP_NAME(doNotIndex[a]));
				if (i > -1) obj.indexable.splice(i, 1);
			}
		}
		if (IS_ARRAY(tableHeaders)) {
			//tableHeaders is an array, so all data to apply comes from columnProperties
			if (tableHeaders[0] !== "id" && obj.headers.length === tableHeaders.length + 1) tableHeaders.unshift("id");
			if (IS_ARRAY(_columnProperties)) return apply_Simple_Array.call(this, tableHeaders, obj.headers); //old db code with types array
			else return applyArray.call(this, tableHeaders, obj.headers);
		}
		else return applyObject.call(this, obj.headers);
	}
	function DELETE_COLUMN(this: NyckelDB_interface, colName: string, storeBool: boolean, editTime?: number, callback?: successCallback) {
		var db = DB[this.id];
		if(TABLE_IS_DELETED(db)) return callback instanceof Function ? callback.call(this, false, "cannot delete " + colName + " column in deleted table") : false;
		var colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
		if (colIndex > 0) {
			var columns = db.columns.meta,
				col = db.columns.headers[colIndex],
				time = VALIDATE_EDIT_TIME.call(this, editTime, "column", "deleteColumn");
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
				search: [false, time],
				deleted: [true, time]
			};
			colIndex = null!;
			//update search index
			var i = db.columns.indexable.indexOf(col);
			if (i > -1) {
				db.columns.indexable.splice(i, 1);
			}
			DB[this.id].lastModified = time + DB[this.id].created > DB[this.id].lastModified ? time + DB[this.id].created : DB[this.id].lastModified;
			this.syncPending = true;
			TO_LOCAL_STORAGE.call(this, storeBool);
			if (callback instanceof Function) return callback.call(this, true, ERRORS[this.id]);
			else return true;
		}
		else return callback instanceof Function ? callback.call(this, false, colName + " column not found") : false;
	}
	function ADD_COLUMN(this: NyckelDB_interface,
		colName: string,
		type: typeString,
		position: number,
		options?: addColumnOptions,
		storeBool?: boolean,
		editTime?: number,
		metadata?: columnMetadata,
		callback?: successCallback): void {
		function timestamp<T>(val: T | [T, number]): [T, number] {
			return IS_ARRAY(val) ? val : [val, validatedEditTime];
		}
		function applyProps(this: NyckelDB_interface, table: nyckelDB_uncompressed, cb: (table: nyckelDB_uncompressed) => void): void {
			if (opt.initialValue && VALUE_IS_VALID.call(this, timestamp(opt.initialValue)[0], props.type[0], false, "applyProps")) props.initialValue = timestamp(opt.initialValue);
			if (opt.search !== undefined && VALUE_IS_VALID.call(this, timestamp(opt.search)[0], "boolean", false, "applyProps2")) props.search = timestamp(opt.search);
			//TODO: add more poroperties here
			cols[colName] = props;
			return cb(table);
		}
		function updateTable(this: NyckelDB_interface, db: nyckelDB_uncompressed) {
			if (!opt.initialValue || opt.initialValue && !VALUE_IS_VALID.call(this, opt.initialValue, props.type[0], true, "updateTable")) {
				if (props.type[0] === "boolean") opt.initialValue = false;
				else if (/number|integer|date|postalZipCode|longitude|latitude/i.test(props.type[0])) opt.initialValue = 0;
				else if (/any|string|email|password|address|cityCounty|provinceStateRegion|country|name|geoLocation/i.test(props.type[0])) opt.initialValue = "";
				else {
					CACHE_ERROR.call(this, props.type.toString(), "initial value not found for data type");
					opt.initialValue = "";
				}
			}
			//insert empty cell to every row in table
			for (let a = 0, len = db.table.length; a < len; a++) {
				db.table[a].splice(position, 0, opt.initialValue!);
				db.ids[db.table[a][0]].splice(position + 1, 0, validatedEditTime);
			}
			if (HIDDEN_TABLE_DATA[this.id]) {
				for (let a = 0, len = HIDDEN_TABLE_DATA[this.id].length; a < len; a++) {
					HIDDEN_TABLE_DATA[this.id][a].splice(position, 0, opt.initialValue!);
					HIDDEN_IDS[this.id][HIDDEN_TABLE_DATA[this.id][a][0]].splice(position + 1, 0, validatedEditTime);
				}
			}
			//update search index
			if (!props.search || props.search[0] !== false) {
				db.columns.indexable.push(colName);
			}
			DB[this.id].lastModified = validatedEditTime + DB[this.id].created > DB[this.id].lastModified ? validatedEditTime + DB[this.id].created : DB[this.id].lastModified;
			this.syncPending = true;
			TO_LOCAL_STORAGE.call(this, storeBool);
			if (callback instanceof Function) return callback.call(this, true, ERRORS[this.id]);
			else return true;
		}
		var opt: addColumnOptions = options || {},
			db = DB[this.id];
		if (TABLE_IS_DELETED(db) || opt.deleted === true) {
			if (callback instanceof Function) return callback.call(this, false, "cannot add deleted column");
			else return; //don't add deleted columns to table
		}
		var validatedEditTime = VALIDATE_EDIT_TIME.call(this, editTime, "column", "addColumn");
		var orig = String(colName),
			i = 1,
			props: columnMetadata = {
				type: ["any", validatedEditTime],
				timestamp: [validatedEditTime, validatedEditTime]
			},
			cols = db.columns.meta,
			headers = db.columns.headers;
		colName = TO_PROP_NAME(colName);
		if (colName === "id") colName = "_id";
		//check if column already existes
		while (GET_INDEX_OF_COLUMN.call(this, colName) > -1) {
			colName = TO_PROP_NAME(orig.replace(/_\d$/, "")) + "_" + i;
			i++;
		}
		props.type[0] = VALIDATE_TYPE.call(this, type);
		if (colName !== orig) props.exportAs = [orig, validatedEditTime];
		//insert colName to headers
		position = position && position > 0 && position < headers.length ? position : headers.length;
//		DB[this.id].created.splice(position, 0, validatedEditTime);
//		DB[this.id].modified.splice(position, 0, 0);
		headers.splice(position, 0, colName);
		//add column properties
		return applyProps.call(this, db, updateTable.bind(this));
	}
	function GET_COL_PROP(this: NyckelDB_interface, colName: string, propName: string): tableValue | undefined {
		if (TABLE_IS_DELETED(DB[this.id])) return undefined;
		var colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
		if (colIndex > 0) {
			var prop = (DB[this.id] as nyckelDB_uncompressed).columns.meta[(DB[this.id] as nyckelDB_uncompressed).columns.headers[colIndex]][propName];
			return prop ? prop[0] : undefined;
		}
		else return undefined;
	}
	function SET_TYPE(this: NyckelDB_interface, colName: string, type: typeString, data?: { [columnName: string]: {[rowId: string]: tableValue}; } | null, storeBool?: boolean, editTime?: number, callback?: setTypeCallback): void {
		function retError(this: NyckelDB_interface, err: string): void {
			if (data) CACHE_ERROR.call(this, err);
			if(callback instanceof Function) return callback.call(this, returnData, err);
		}
		function retSuccess(this:NyckelDB_interface, a: true, b: tableErrors): void {
			if (callback instanceof Function) return callback.call(this, a, b);
		}
		function checkRows(this: NyckelDB_interface, rowId: string, i: number): void {
			if (data) {
				var value = data[colName][rowId] || (DB[this.id] as nyckelDB_uncompressed).table[i][colIndex];
				if (!VALUE_IS_VALID.call(this, value, type, true, "checkRows")) {
					if (type.match(VALID_STRING_TYPES)) {
						value = String(value);
					}
					else if (type.match(VALID_NUMBER_TYPES) && IS_NUMERIC(value)) {
						value = value * 1;
					}
					if (!VALUE_IS_VALID.call(this, value, type, true, "checkRows2")) {
						returnData[colName][rowId] = (DB[this.id] as nyckelDB_uncompressed).table[i][colIndex];
						can_do = false;
					}
					else data[colName][rowId] = value;
				}
			}
		}
		function setType(this: NyckelDB_interface): void {
			if (can_do) (DB[this.id] as nyckelDB_uncompressed).columns.meta[colName].type = [VALIDATE_TYPE.call(this, type), editTime!];
		}
		function applyData(this: NyckelDB_interface, rowId: string, i:number, total:number): void {
			if (data && can_do && data[colName][rowId]) {
				SET_VAL.call(this, rowId, colName, data[colName][rowId], i === total, editTime);
				delete data[colName][rowId];
			}
		}
		function checkSuccess(this: NyckelDB_interface, a: boolean, b: tableErrors, c: string | null, d: boolean): void {
			if(data) for (let id in data[colName]) {
				if (data[colName].hasOwnProperty(id)) return retError.call(this, "data provided doesn't match table");
			}
			if (can_do) {
				return retSuccess.call(this, can_do, b);
			}
			else return retError.call(this, "cannot apply type to this row, please update data and try again");
		}
		if (TABLE_IS_DELETED(DB[this.id])) return retError.call(this, "cannot set type on deleted table");
		var colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
		if (colIndex === -1) return retError.call(this, "column does not exist in the table");
		this.unhideRows(); //TODO iterate through hidden rows without unhiding them(?)
		type = VALIDATE_TYPE.call(this, type);
		colName = TO_PROP_NAME(colName);
		editTime = editTime ? VALIDATE_EDIT_TIME.call(this, editTime, "column", "set type") : TIMESTAMP(DB[this.id].created);
		var can_do: boolean = true,
			returnData: {[columnName: string]:{[rowId: string]: tableValue}} = {};
		returnData[colName] = {};
		if (!data) {
			data = {};
			data[colName] = {};
		}
		return this.forEachRow.call(this, checkRows.bind(this), setType.bind(this)).forEachRow.call(this, applyData.bind(this), checkSuccess.bind(this));
		//TODO if no type conflics found and most current, apply data and update type
	}
	function MOVE_COLUMN(this: NyckelDB_interface, colName: string, position: number, storeBool: boolean) {
		//TODO
	}
	/**
	 * Initialise a new instance of NyckelDB
	 * @constructs NyckelDB
	 * @param {string} tableTitle the name of the new database
	 */
	function NyckelDBObj(this: NyckelDB_interface, tableTitle: any): void {
		if (tableTitle == null) {// eslint-disable-line
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
				"indexable": []
			},
			"ids": {},
			"table": [],
			"properties":{}
		}
	}
	//ALL CAPS "PRIVATE" VARIABLES
	var DB: (nyckelDB_uncompressed | nyckelDB_deleted)[];//all databases
	var NUM: number;//incrementing database number
	var DBS: string[];//array of database titles
	var DBX_SYNC_OBJ: {[tableName: string]: number};//lastSync dates of all databases
	var SEARCH_INDEX: searchIndex[];//tree structured search indexes of all databases 
	var SEARCH_SUGGESTIONS: string[][];//tree structured search suggestions of all databases
	var RECENTLY_SEARCHED: string[][];//cached last 25 successful searches for surfacing more relevent search suggestions
	var COL_NAMES_INDEXED: string[][];//current columns search indexed
	var BUILDING_SEARCH_INDEX: boolean[];//search index build state, indicates whether search index is ready, or to queue the search for when the search index is built
	var BUILDING_SEARCH_INDEX_QUEUE: { (): void; }[][];// queue of searches to execute after search index is built
	var ROW_INDEX_CACHE: {[id: string]: number}[];//a cache of the current positions of ids in databases to avoid repetitive looping through the table looking for an id
	var ERRORS: string[];
	const MAX_SYNC_FREQUENCY = 5; //5 minutes
	var SYNC_ERROR = false;
	var SYNC_ERROR_TIME: number;
	var HIDDEN_IDS: tableIds[];
	var HIDDEN_TABLE_DATA: tableRow[][];
	const STRING_TYPES = "any string uniqueString multilineString date email phoneNumber password formattedAddress streetAddress mailAddress cityCounty provinceStateRegion country postalZipCode givenName familyName geoLocation";
	const NUMBER_TYPES = "any number integer posInteger negInteger date phoneNumber password postalZipCode longitude latitude";
	const VALID_TYPES = new RegExp("^(" + DELETE_DUPLICATES((STRING_TYPES + " " + NUMBER_TYPES + " boolean").split(" ")).join("|") + ")$");
	const VALID_STRING_TYPES = new RegExp("^(" + STRING_TYPES.split(" ").join("|") + ")$");
	const VALID_NUMBER_TYPES = new RegExp("^(" + NUMBER_TYPES.split(" ").join("|") + ")$");
	const FORBIDDEN = GET_FORBIDDEN();//property names that shouldn't be used (?)
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
	 * @param {successCallback} [callback] callback function
	 * @since 0.4
	 */
	NyckelDBObj.prototype.addColumn = function (colName: string, position: number, options?: addColumnOptions, callback?: successCallback): void {
		return ADD_COLUMN.call(this, colName, options && options.type ? options.type : "any", position, options, true, undefined, undefined, callback);
	};
	/**
	 * Add a new row to the table.
	 * @function addRow
	 * @param {array} array a complete array, or a JSON object in form {[colName]: {value: [value]},..}
	 * @param {string} [id] id is optional and will only be used if it doesn't already exist
	 * @returns {string} new row id
	 */
	NyckelDBObj.prototype.addRow = function (array: tableValue[] | {[columnName: string]: {value:tableValue}}, id: string): string | false {
		if (array && !IS_ARRAY(array) && typeof array === "object") {
			//convert object to array
			var _array: any[] = [],
				a = 0;
			return this.forEachCol.call(this, function (col: string) {
				if (array[col] && array[col].value) _array[a] = array[col].value;
				a++;
			}, function (this: NyckelDB_interface) {
				return ADD_ROW.call(this, _array, id, true);
			}.bind(this));
		}
		else return ADD_ROW.call(this, array, id, true);
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
	NyckelDBObj.prototype.advancedSearch = function (searchQuery: any, options: searchOptions, callback: searchCallback): void {
		function filter(this: NyckelDB_interface, ids: string[], filterOutQueries: string[]) {
			if (filterOutQueries.length === 0) {
				return callback instanceof Function ? callback.call(this, ids, ERRORS[this.id]) : undefined;
			}
			for (let b = 0, lenB = filterOutQueries.length; b < lenB; b++) {
				(function (self, b) {
					self.search.call(self, filterOutQueries[b], options, function (result: string[], err: tableErrors) {
						if (!err) filterIds = filterIds.concat(result);
						else return callback instanceof Function ? callback.call(self, [], err) : undefined;
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
		if (!searchQuery) return callback instanceof Function ? callback.call(this, [], "no query supplied") : undefined;
		var ids: string[] = [],
			filterIds: string[] = [],
			filterOutQueries: string[] = [],
			searchQueryArr: string[] = [];
		if (/\s\+|\s\-/.test(searchQuery)) {
			searchQueryArr = searchQuery.split(" +");
			for (let a = 0; a < searchQueryArr.length; a++) {
				if (/\s\-/.test(searchQueryArr[a])) {
					var f = searchQueryArr[a].split(" -");
					searchQueryArr[a] = f.shift()!;
					filterOutQueries.push.apply(filterOutQueries, f);
				}
			}
		}
		else searchQueryArr = [searchQuery];
		for (let a = 0, len = searchQueryArr.length; a < len; a++) {
			(function (self, a) {
				self.search.call(self, searchQueryArr[a], options, function (result: string[], errors: tableErrors) {
					if (!errors) ids = ids.concat(result);
					else return callback instanceof Function ? callback.call(self, [], errors) : undefined;
					if (a === len - 1) {
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
	NyckelDBObj.prototype.deleteColumn = function (colName: string, callback?: successCallback) {
		return DELETE_COLUMN.call(this, colName, true, undefined, callback);
	};
	/**
	 * Delete a row along with all the data that it contains
	 * @function deleteRow
	 * @param {string|number} rowId the row's id, or its current index
	 * @returns {boolean} success
	 */
	NyckelDBObj.prototype.deleteRow = function (rowId: string | number): boolean {
		return DELETE_ROW.call(this, rowId, true);
	};
	/**
	 * Delete a table along with all the data that it contains, including custom properties
	 * @function deleteTable
	 * @param {function} [callback] callback function
	 * @returns {object} this
	 */
	NyckelDBObj.prototype.deleteTable = function (callback: successCallback): void {
		return DELETE_TABLE.call(this, callback, undefined, true);
	};	
	/**
	 * Hide all rows who's value in a specific column don't match the given regular expression
	 * @function filter
	 * @param {string} colName is the column name from the table header
	 * @param {regExp} regExp the regular expression to match
	 * @returns {object} this
	 */
	NyckelDBObj.prototype.filter = function (colName: string, regExp: any): object {
		if (this.getLength() > 0) {
			var colIndex = GET_INDEX_OF_COLUMN.call(this, colName),
				val;
			if (colIndex > 0) {
				for (var a = 0, arrLen = (DB[this.id] as nyckelDB_uncompressed).table.length; a < arrLen; a++) {
					val = String((DB[this.id] as nyckelDB_uncompressed).table[a][colIndex]);
					if (!val.match(regExp)) {
						this.hideRow(a);
						a--;
						arrLen--;
					}
				}
				a = null!; arrLen = null!;
			}
			colIndex = null!; val = null;
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
	NyckelDBObj.prototype.forEachCol = function (funct: (colName: string, isIndexNum: number, ofNumCols: number) => void, callback?: successCallback): NyckelDB_interface {
		if(TABLE_IS_DELETED(DB[this.id])) return callback instanceof Function ? (callback.call(this, false, "forEach table is deleted"), this) : this;
		if (funct instanceof Function) {
			for (let a = 1, headers = (DB[this.id] as nyckelDB_uncompressed).columns.headers, len = headers.length; a < len; a++) {
				funct.call(this, headers[a], a - 1, len - 1);
			}
			return callback instanceof Function ? (callback.call(this, true, ERRORS[this.id]), this) : this;
		}
		else return callback instanceof Function ? (callback.call(this, false, "forEach requires a function"), this) : this;
	};
	/**
	 * Iterate through all (unhidden) rows in a table (in the current sorted order). Passes row ids to funct in sequence and executes funct
	 * @function forEachRow
	 * @param {eachRowCallback} funct the function to execute for each row in the table, parameters: rowId, rowIndex, tableLength
	 * @param {successCallback} [callback] callback function to execute when everything is finished
	 * @returns {object} this
	 */
	NyckelDBObj.prototype.forEachRow = function (funct: (rowId: string, rowIndexNum: number, tableLength: number) => void, callback?: successCallback): NyckelDB_interface {
		if(TABLE_IS_DELETED(DB[this.id])) return callback instanceof Function ? (callback.call(this, false, "forEach table is deleted"), this) : this;
		if (funct instanceof Function) {
			for (let a = 0, len = this.getLength(); a < len; a++) {
				funct.call(this, (DB[this.id] as nyckelDB_uncompressed).table[a][0], a, len);
			}
			return callback instanceof Function ? (callback.call(this, true, ERRORS[this.id]), this) : this;
		}
		else return callback instanceof Function ? (callback.call(this, false, "forEach requires a function"), this) : this;
	};
	/**
	* Get the row header names as an Array
	* @function getHeaders
	* @param {getHeadersCallback} [callback] callback
	* @returns {string[]} header names
	*/
	NyckelDBObj.prototype.getHeaders = function (callback?: getHeadersCallback): string[] {
		var ret: string[] = [];
		if (this.isDeleted()) return ret;
		for (let a = 1, headers = (DB[this.id] as nyckelDB_uncompressed).columns.headers, len = headers.length; a < len; a++) {
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
	NyckelDBObj.prototype.getIndexOf = function (id: string, orValue?: tableValue, colName?: string): number {
		if (TABLE_IS_DELETED(DB[this.id])) return -1;
		else if (id) {
			return GET_INDEX_OF_ROW.call(this, id);
		}
		else if (orValue && colName) {
			var colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
			if (colIndex > 0) {
				for (var a = 0, arrLen = (DB[this.id] as nyckelDB_uncompressed).table.length; a < arrLen; a++) {
					if (orValue === (DB[this.id] as nyckelDB_uncompressed).table[a][colIndex]) {
						return a;
					}
				}
				return -1;
			}
			else return -1;
		}
		else return -1;
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
	NyckelDBObj.prototype.getLength = function (): number {
		return !DB[this.id] || TABLE_IS_DELETED(DB[this.id]) ? 0 : (DB[this.id] as nyckelDB_uncompressed).table.length;
	};
	/**
	 * Get the value of a table custom property
	 * @function getProp
	 * @param {string} propName the name of the custom property
	 * @returns {string | number | boolean | undefined} the property value
	 */
	NyckelDBObj.prototype.getProp = function (propName: string): tableValue | undefined {
		propName = TO_PROP_NAME(propName);
		if ((DB[this.id] as nyckelDB_uncompressed).properties) {
			return (DB[this.id] as nyckelDB_uncompressed).properties[propName] ? (DB[this.id] as nyckelDB_uncompressed).properties[propName][0] : undefined;
		}
		else return undefined;
	};
	/**
	 * Get an entire row from the table as JSON arranged by column name. Returns column name, column type and value
	 * @function getRow
	 * @param {string|number} rowId the row's id, or its current index
	 * @param {getRowCallback} [callback] callback
	 * @returns {object | undefined} json formatted data, or undefined if nothing found
	 */
	NyckelDBObj.prototype.getRow = function (rowId: string | number, callback?: getRowCallback): {[columnName:string]:{column:string, type: typeString, value: tableValue}} | void {
		var rowIndex = GET_INDEX_OF_ROW.call(this, rowId),
			ret: {
				[colName: string]: {
					column: string;
					type: typeString;
					value: tableValue;
				};
			} = {};
		if (rowIndex > -1) {
			this.forEachCol(function (this: NyckelDB_interface, colName: string, is: number) {
				ret[colName] = {
					column: colName,
					type: (DB[this.id] as nyckelDB_uncompressed).columns.meta[colName].type[0],
					value: (DB[this.id] as nyckelDB_uncompressed).table[rowIndex][is + 1]
				};
				if ((DB[this.id] as nyckelDB_uncompressed).columns.meta[colName].exportAs) ret[colName].column = (DB[this.id] as nyckelDB_uncompressed).columns.meta[colName].exportAs![0];
			}.bind(this), function (this: NyckelDB_interface, success: boolean, errors: tableErrors) {
				return callback instanceof Function ? callback.call(this, ret, errors) : ret;
			});
		}
		else return callback instanceof Function ? callback.call(this, undefined, "row id not found") : undefined;
	};
	/**
	* Get an blank row from the table as JSON arranged by column name
	* @function getRowTemplate
	* @param {getRowTemplateCallback} callback callback
	*/
	NyckelDBObj.prototype.getRowTemplate = function (callback: getRowTemplateCallback): void {
		var ret: rowTemplate = {};
		if (this.isDeleted()) return;
		this.forEachCol(function (this: NyckelDB_interface, colName: string) {
			ret[colName] = {
				column: colName,
				type: (DB[this.id] as nyckelDB_uncompressed).columns.meta[colName].type[0]
			};
			if ((DB[this.id] as nyckelDB_uncompressed).columns.meta[colName].exportAs) {
				ret[colName].column = (DB[this.id] as nyckelDB_uncompressed).columns.meta[colName].exportAs![0];
			}
		}.bind(this), function (this: NyckelDB_interface, success: boolean, errors: tableErrors) {
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
	NyckelDBObj.prototype.getSearchSuggestions = function (searchQuery: any, options: {colNames: string[]}, callback: searchCallback): string[] {
		function buildSuggestionsList(this: NyckelDB_interface) {
			searchQuery = String(searchQuery).split(" ");
			var last: string = searchQuery.pop(),
				suggest: string[] = [],
				a = 0,
				prefix = last.charAt(0);
			prefix = prefix.match(/\+|\-/) ? prefix : "";
			last = SEARCH_VALIDATE(last)[0];
			if (last) {
				var matchesThis = new RegExp("^" + last);
				searchQuery = searchQuery.join(" ");
				for (let b = 0, len = SEARCH_SUGGESTIONS[this.id].length; b < len; b++) {
					if (SEARCH_SUGGESTIONS[this.id][b].match(matchesThis)) {
						if (SEARCH_SUGGESTIONS[this.id][b] === last) {//found exact match, suggest at top of list
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
			last = null!; a = null!; searchQuery = null;
			return callback instanceof Function ? (callback.call(this, suggest, ERRORS[this.id]), suggest) : suggest;
		}
		if (SEARCH_SUGGESTIONS[this.id].length > 0) {
			return buildSuggestionsList.call(this);
		}
		else {
			var cols = options.colNames ? options.colNames.join("|").split("|") : undefined;
			if (callback instanceof Function) callback.call(this, [], "currently busy building search index");
			BUILD_SEARCH_INDEX.call(this, cols);
			return [];
		}
	};
	/**
	 * Get the title of the table
	 * @function getTitle
	 * @returns {string | undefined } table title
	 */
	NyckelDBObj.prototype.getTitle = function (): string | undefined { return DB[this.id] ? DB[this.id].title : undefined; };
	/**
	 * Get the 'type' that has been set on a particular column
	 * @function getType
	 * @param {string} colName the name of the column
	 * @return {string} a column type
	 */
	NyckelDBObj.prototype.getType = function (colName: string) {
		return GET_COL_PROP.call(this, colName, "type");
	};
	/**
	 * Get the value of a cell
	 * @function getVal
	 * @param {number | string} rowId can be the index of the row, or it's 3 digit identifier
	 * @param {string} colName is the column name from the table header
	 * @returns {string | number | boolean | undefined} table cell value
	 */
	NyckelDBObj.prototype.getVal = function (rowId: number | string, colName: string): tableValue | undefined {
		var rowIndex = GET_INDEX_OF_ROW.call(this, rowId),
			colIndex = GET_INDEX_OF_COLUMN.call(this, colName);
		if (rowIndex > -1 && colIndex > 0) return (DB[this.id] as nyckelDB_uncompressed).table[rowIndex][colIndex];
		else return;
	};
	/**
	 * Get a number of cell values from the table at once
	 * @function getVals
	 * @param {string[] | number[]} rowIds can be an Array of the index of the row, or it's 3 digit identifier
	 * @param {string[]} colNames is an Array the column names from the table header
	 * @param {getValsCallback} [callback] callback function
	 * @returns {array | false} 2d array of table values, or false if nothing found
	 */
	NyckelDBObj.prototype.getVals = function (rowIds: (string | number)[], colNames: string[], callback: getValsCallback): tableValue[][] | false | void {
		if (!rowIds || rowIds.constructor !== Array || !colNames || colNames.constructor !== Array) {
			return callback instanceof Function ? callback.call(this, false, "invalid inputs") : false;
		}
		var ret: tableValue[][] = [];
		for (let a = 0, x = 0, b: number,  y: number, rowIndex: number, colIndex: number, len = rowIds.length, lenB = colNames.length ; a < len; a++) {
			rowIndex = GET_INDEX_OF_ROW.call(this, rowIds[a]);
			if (rowIndex > -1) {
				ret[x] = [rowIds[a]];
				for (b = 0, y = 1; b < lenB; b++) {
					colIndex = GET_INDEX_OF_COLUMN.call(this, colNames[b]);
					if (colIndex > 0) {
						ret[x][y] = (DB[this.id] as nyckelDB_uncompressed).table[rowIndex][colIndex];
						y++;
					}
					else if (!COL_NAME_IS_VALID.call(this, colNames[b])) {
						return callback instanceof Function ? callback.call(this, false, colNames[b] + " is not a valid colName") : false;
					}
				}
				x++;
			}
			else if (!ROW_ID_IS_VALID.call(this, rowIds[a])) {
				return callback instanceof Function ? callback.call(this, false, rowIds[a] + " is not a valid rowId") : false;
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
	NyckelDBObj.prototype.hideRow = function (rowId: number | string): NyckelDB_interface {
		if (!TABLE_IS_DELETED(DB[this.id])) {
			var index = GET_INDEX_OF_ROW.call(this, rowId);
			if (index > -1) {
				var row = (DB[this.id] as nyckelDB_uncompressed).table[index];
				HIDDEN_IDS[this.id] = HIDDEN_IDS[this.id] || {};
				HIDDEN_IDS[this.id][row[0]] = JSON.parse(JSON.stringify((DB[this.id] as nyckelDB_uncompressed).ids[row[0]]));
				delete (DB[this.id] as nyckelDB_uncompressed).ids[row[0]];
				HIDDEN_TABLE_DATA[this.id] = HIDDEN_TABLE_DATA[this.id] || [];
				HIDDEN_TABLE_DATA[this.id].push((DB[this.id] as nyckelDB_uncompressed).table.splice(index, 1)[0]);
				ROW_INDEX_CACHE[this.id] = {};
			}
			index = null!;
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
	NyckelDBObj.prototype.importJSON = function (json: nyckelDB_uncompressed, syncKey: string, callback: successCallback): void {
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
	NyckelDBObj.prototype.init = function (
		tableHeaders: string[] | { [columnName: string]: string | addColumnOptions | columnMetadata;} | any,
		columnProperties?: string[] | { [columnName: string]: string | addColumnOptions | columnMetadata; } | any,
		options?: NyckelDBOptions | any,
		callback?: successCallback | any
	): void {
		function validateData(this: NyckelDB_interface): void {
			var db = DB[this.id];
			if (!TABLE_IS_DELETED(db)) {
				var columns = db.columns.meta;
				if (columns) {
					for (let a = 1, headers = db.columns.headers, len = headers.length, colProp; a < len; a++) {
						for (colProp in columns[headers[a]]) {
							if (columns[headers[a]].hasOwnProperty(colProp)) {
								columns[headers[a]][colProp]![1] = VALIDATE_EDIT_TIME.call(this, columns[headers[a]][colProp]![1], "column", "didn't get cached table");
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
		function applyData(this: NyckelDB_interface, json?: nyckelDB_uncompressed | nyckelDB_deleted): nyckelDB_uncompressed | nyckelDB_deleted {
			function setColumns(this: NyckelDB_interface, json?: nyckelDB_uncompressed) {
				if (json) {
					return json.columns ? APPLY_COLUMN_PROPERTIES.call(this, tableHeaders, json.columns, json.created, opt.doNotIndex) :
							APPLY_COLUMN_PROPERTIES.call(this, tableHeaders, columnProperties, TIMESTAMP(), opt.doNotIndex);
				}
				else return APPLY_COLUMN_PROPERTIES.call(this, tableHeaders, columnProperties, TIMESTAMP(), opt.doNotIndex);
			}
			if (json && TABLE_IS_DELETED(json)) return {
				"title": DB[this.id].title,
				"created": json.created || TIMESTAMP(),
				"lastModified": json.lastModified || TIMESTAMP(),
				"deleted": true,
				"version": this.version + "_" + Base64.Version
			};
			else return {
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
		function decompress(data: string, key: string | undefined): nyckelDB_uncompressed{
			return JSON.parse(Base64.read(data, key));
		}
		function applyCustomProperties(this: NyckelDB_interface, props: customProperties): { [propertyName: string]: [tableValue, number, basicTypeString] } {
			function setInitialValue(type: basicTypeString): tableValue {
				return type === "string" ? "" : type === "boolean" ? false : 0;
			}
			if (!props) return {};
			var _props:{[propName: string]:[tableValue, number, basicTypeString]} = {};
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
			var _type: basicTypeString = "any", _initialValue: tableValue = 0, propName: string, propValue;
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
						var propArr: [tableValue, number, string] = (propValue as [tableValue, number, string]);
						_type = VALIDATE_BASIC_TYPE.call(this, propArr[2]);
						if (VALUE_IS_VALID.call(this, propArr[0], _type, false, "applyCustomProperties")) _props[propName] = [propValue[0], propValue[1], _type];
						propArr = null!;
					}
					else if (!IS_ARRAY(propValue) && typeof propValue === "object") {
						if (propValue.type) {
							_props[propName] = [0, 0, VALIDATE_BASIC_TYPE.call(this, propValue.type)];
						}
						else _props[propName] = [0, 0, "any"];
						if (propValue.initialValue && VALUE_IS_VALID.call(this, propValue.initialValue, _props[propName][2], false, "applyCustomProperties2")) {
							_props[propName][0] = propValue.initialValue;
						}
						else {
							_type = _props[propName][2];
							_initialValue = setInitialValue(_type);
							_props[propName][0] = _initialValue;
						}
					}
					else CACHE_ERROR.call(this, prop, "invalid customProperty");
				}
			}
			_type = null!; _initialValue = null!; propName = null!;
			return _props;
		}
		function initiateTable(this: NyckelDB_interface, options: NyckelDBOptions | null) {
			if (options && options.importData && (options.importData as unknown as nyckelDB_uncompressed).properties)
				(options.importData as unknown as nyckelDB_uncompressed).properties = applyCustomProperties.call(this, (options.importData as unknown as nyckelDB_uncompressed).properties);
			else if (options && options.customProperties) properties = applyCustomProperties.call(this, options.customProperties);
			//try to get cached table
			if (APP.Sto) APP.Sto.getItem(DB[this.id].title, null, gotCachedTable.bind(this), didntGetCachedTable.bind(this));
			else return callback instanceof Function ? callback.call(this, false, "localStorage not found", false) : "localStorage not found";
		}
		function gotCachedTable(this: NyckelDB_interface, json: nyckelDB_compressed | nyckelDB_uncompressed | nyckelDB_deleted) {
			if (!json) {
				didntGetCachedTable.call(this);
				return;
			}
			if (typeof json === "string") json = JSON.parse(json);
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
			else {//loading directly from local storage
				DB[this.id] = applyData.call(this, json);
				validateData.call(this);
				BUILD_SEARCH_INDEX.call(this, opt.initialIndex);
				return callback instanceof Function ? (callback.call(this, true, ERRORS[this.id]), this): this;
			}
		}
		function didntGetCachedTable(this: NyckelDB_interface) {
			//creating a brand new table
			DB[this.id] = applyData.call(this, (opt.importData as unknown as nyckelDB_uncompressed | undefined));
			validateData.call(this);
			if (opt.importJSON) return IMPORT_JSON.call(this, opt.importJSON, callback.bind(this), opt.key || false, false);
			else {
				TO_LOCAL_STORAGE.call(this, true);
				return callback instanceof Function ? (callback.call(this, true, ERRORS[this.id]), this): this;
			}
		}
		var opt: NyckelDBOptions = options ? JSON.parse(JSON.stringify(options)) : {};
		var properties = {};
		if (typeof opt.importData === "string") opt.importData = JSON.parse(opt.importData);
		if (opt.importData && ((opt.importData as unknown as nyckelDB_uncompressed).lastModified < opt.importData.created && opt.importData.lastModified !== 0 || opt.importData.lastModified > TIMESTAMP())) {
			console.log("importData modified dates are corrupted: " + opt.importData.lastModified);
			return callback instanceof Function ? callback.call(this, false, "importData modified dates are corrupted: " + opt.importData.lastModified, null, false) : CACHE_ERROR.call(this, "importData modified dates are corrupted: " + opt.importData.lastModified);
		}
		if (opt.importData && opt.importData.data) {
			if (opt.importData.version !== this.version + "_" + Base64.Version && opt.importData.version !== this.version + "." + Base64.Version) {
				return callback instanceof Function ? callback.call(this, false, "imported database version not supported", null, false) : CACHE_ERROR.call(this, "imported database version not supported");
			}
			else if (Base64.hmac(opt.importData.data, opt.key) === opt.importData.signature) {
				(opt.importData as unknown as nyckelDB_uncompressed) = decompress(opt.importData.data, opt.key);
				initiateTable.call(this, opt);
				INITIATE_DBS.call(this, DB[this.id].title);
			}
			else return callback instanceof Function ? callback.call(this, false, "imported databse corrupted", null, false) : CACHE_ERROR.call(this, "imported database corrupted");
		}
		else {
			initiateTable.call(this, opt);
			INITIATE_DBS.call(this, DB[this.id].title);
		}
	}
	/**
	 * Check if the table has been deleted or not
	 * @function isDeleted
	 * @returns {boolean} whether or not the table has been deleted
	 */
	NyckelDBObj.prototype.isDeleted = function (): boolean {
		return TABLE_IS_DELETED(DB[this.id]);
	};
	/**
	 * Checks whether there are changes since the last time the database was synchronized
	 * @function isSyncPending
	 * @param {string} cloudSyncFile token that contains the version number, hashed message authentication code (HMAC) and lastSync timestamp of the database
	 * @param {successCallback} [callback] callback function
	 * @returns {boolean} whether or not sync is needed
	 */
	NyckelDBObj.prototype.isSyncPending = function (cloudSyncFile: {[tableTitle: string]: number}, callback: successCallback): boolean {
		function ret(this: NyckelDB_interface, val: boolean): boolean {
			return callback instanceof Function ? (callback.call(this, val, ERRORS[this.id]), val) : val;
		}
		if (cloudSyncFile) {
			if (typeof cloudSyncFile === "string") cloudSyncFile = JSON.parse(cloudSyncFile);
			var title: string = TO_PROP_NAME(DB[this.id].title);
			if (!cloudSyncFile[title] && cloudSyncFile[title] !== 0 || Number(cloudSyncFile[title]) !== DB[this.id].lastModified) {
				this.syncPending = true;
				return ret.call(this, true);
			}
			else return ret.call(this, false);
		}
		else return ret.call(this, this.syncPending);
	};
	/**
	 * Clear all the locally cached copies of all the NyckelDB databases.
	 * @function NUKEALL
	 * @param {string} msg the message that you want to tell the user before you blow everything up!
	 * @param {successCallback} [callback] callback function
	 */
	NyckelDBObj.prototype.NUKEALL = function (msg: string, callback: successCallback): void {
		function nuke(this: NyckelDB_interface) {
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
			if (callback instanceof Function) return callback.call(this, true, false);
		}
		if (APP.confirm && APP.notify) APP.confirm(msg, nuke.bind(this), function () {
			APP.notify("<b>Oi!</b> That was close!", true);
		}, {
			"okButton": "Delete all of this site's saved data in this web browser or app"
		});
		else if (window && window.confirm(msg)) nuke.call(this);
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
	NyckelDBObj.prototype.renameColumn = function (colName: string, newName: string, callback: setCallback): string | false {
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
	NyckelDBObj.prototype.search = function (searchQuery: any, options: searchOptions, callback: searchCallback): void {
		function findMatches(arr: any[], min: number): any[] {
			min = min || 2;
			if (min === 1) return arr;
			var ret: any[] = []; /*return array*/
			arr = arr.sort();
			for (let a = 0, found = false, x = 0, y = x + 1, len = arr.length, b: number; x < len - min + 1; x++ , y = x + 1) {
				if (String(arr[x]) === String(arr[y])) {
					found = true;
					for (b = 0; b < min - 1; b++) {
						if (arr[x] !== arr[y + b]) found = false;
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
		function querySearchIndex(this: NyckelDB_interface, searchQuery: string[], lastRoundBool: boolean): string[] | void {
			var aLen = searchQuery.length,
				tempIds: string[] = [];
			for (let a = 0, b, bLen = COL_NAMES_INDEXED[this.id].length, i: string[]; a < aLen; a++) {
				for (b = 0, i = []; b < bLen; b++) {
					if (SEARCH_INDEX[this.id][searchQuery[a]] && SEARCH_INDEX[this.id][searchQuery[a]][COL_NAMES_INDEXED[this.id][b]]) {
						i = i.concat(SEARCH_INDEX[this.id][searchQuery[a]][COL_NAMES_INDEXED[this.id][b]]);
					}
				}
				tempIds = DELETE_DUPLICATES(tempIds.concat(i));
			}
			ids = DELETE_DUPLICATES(ids.concat(findMatches.call(this, tempIds, aLen)));
			if (ids.length > 0) {
				RECENTLY_SEARCHED[this.id] = DELETE_DUPLICATES(searchQuery.concat(RECENTLY_SEARCHED[this.id]));
				RECENTLY_SEARCHED[this.id] = RECENTLY_SEARCHED[this.id].slice(0, 25);
				STO_SEARCH_INDEX.call(this);
			}
			if (lastRoundBool) if (callback instanceof Function) return callback.call(this, ids, ERRORS[this.id]);
		}
		function fuzzyMatch(this: NyckelDB_interface, searchQueryArr: string[]) {
			var arr: string[][] = [];
			//collect all possible alternate queries
			for (let a = 0, lenA = searchQueryArr.length; a < lenA; a++) {
				if (Spelling[searchQueryArr[a]]) {
					arr[a] = Spelling[searchQueryArr[a]].split(" ");
				}
				else arr[a] = [searchQueryArr[a]];
			}
			//combine them in all possible combinations
			var queries: string[][] = [],
				a = 0,
				n = 0,
				cursor: number[] = [],
				len = arr.length;
			while (len) cursor[--len] = 0;//initialize cursors
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
					if (n === len) break;
				}
			}
			arr = null!;
			for (let a = 0, len = queries.length - 1; a < len; a++) {
				querySearchIndex.call(this, queries[a], false);
			}
			return querySearchIndex.call(this, queries[queries.length - 1], true);
		}
		function search(this: NyckelDB_interface, searchQueryArr: string[], options: searchOptions) {
			if (options.fuzzyMatch) return fuzzyMatch.call(this, searchQueryArr);
			else return querySearchIndex.call(this, searchQueryArr, true);
		}
		if (TABLE_IS_DELETED(DB[this.id])) if(callback instanceof Function) return callback.call(this, [], "no data");
		options = options || {};
		var cols = options.colNames ? options.colNames.join("|").split("|") : undefined,
			ids: string[] = [],
			searchQueryArr = SEARCH_VALIDATE(searchQuery);
		//check for search index
		BUILD_SEARCH_INDEX.call(this, cols, search.bind(this, searchQueryArr, options));
	};
	/**
	 * Change the value of a table's custom property
	 * @function setProp
	 * @param {string} propName the name of the property to change
	 * @param {string | number | boolean} value new value
	 * @returns {string | number | boolean | undefined} the validated property value that was applied
	 */
	NyckelDBObj.prototype.setProp = function (propName: string, value: tableValue): tableValue | undefined {
		return SET_PROP.call(this, propName, value, undefined, undefined, true);
	};
	/**
	 * Same as isSyncPending but sets the value of syncPending to true if the cloudSyncFile validates
	 * @function setSyncCompleted
	 * @param {string} cloudSyncFile token that contains the version number, hashed message authentication code (HMAC) and lastSync timestamp of the database
	 * @param {successCallback} [callback] callback function
	 * @returns {boolean} whether or not sync is successfully set to complete
	 */
	NyckelDBObj.prototype.setSyncCompleted = function (cloudSyncFile: string, callback?: successCallback): boolean {
		if (cloudSyncFile && this.isSyncPending(cloudSyncFile)) {
			if (callback instanceof Function) {
				return (callback.call(this, false, "database has been modified since last sync and requires sync again"), false);
			}
			else return false;
		}
		else {
			this.syncPending = false;
			if (callback instanceof Function) {
				return (callback.call(this, true, false), true);
			}
			else return true;
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
	NyckelDBObj.prototype.setTitle = function (newTitle: string, callback?: successCallback): void {
		var oldId = this.id,
			oldTitle = DB[this.id].title,
			y = DBS.indexOf(oldTitle);

		//applyTitle creates a new id from title
		INITIATE_DBS.call(this, newTitle, function (this: NyckelDB_interface, newTitle: string) {
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
			oldTitle = null!; y = null!; x = null!;

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
	NyckelDBObj.prototype.setType = function (colName: string, type: typeString, data?: { [columnName: string]: {[rowId: string]: tableValue}; }, callback?: setTypeCallback): void {
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
	NyckelDBObj.prototype.setVal = function (rowId: number | string, colName: string, newValue: tableValue, callback: setCallback): tableValue | undefined {
		return SET_VAL.call(this, rowId, colName, newValue, true, undefined, callback);
	};
	/**
	* Change multiple values at once
	* @function setVals
	* @param {number|string} rowId can be the index of the row, or it's 3 digit identifier
	* @param {object} newValues object in the form {[colName]:{value:[value]},...}
	* @param {setCallback} [callback] callback function
	*/
	NyckelDBObj.prototype.setVals = function (rowId: number | string, newValues: {[columnName: string]:{value:tableValue}}, callback: setCallback) {
		function ret(this: NyckelDB_interface) {
			a++;
			if (a === len && callback instanceof Function) return callback.call(this, true, ERRORS[this.id]);
		}
		var len = 0,
			a = 0;
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
	NyckelDBObj.prototype.shuffle = function (): NyckelDB_interface {
		function shuffle(array: any[] | [string, tableValue][]) {
			var len = array.length,
				halfLen = Math.ceil(len / 2),
				random = Base64.rand(halfLen).split(""),
				r = 0;
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
						if (r > len / 2) r = 0;
					}
					array = array2;
					array.push(array.shift());
					r = 0;
				}
				reps = null!; a = null; lenA = null; array1 = null; array2 = null;
			}
			len = null!; halfLen = null!; random = null; r = null!;
			return array;
		}
		if (!TABLE_IS_DELETED(DB[this.id])) {
			var len = this.getLength(),
				shuffled = shuffle((DB[this.id] as nyckelDB_uncompressed).table);
			if (shuffled.length !== len) {
				CACHE_ERROR.call(this, "shuffle error " + len + " != " + this.getLength());
				len = null; shuffled = null!;
				return this;
			}
			else {
				(DB[this.id] as nyckelDB_uncompressed).table = shuffled;
				ROW_INDEX_CACHE[this.id] = {};
				len = null; shuffled = null!;
				return this;
			}
		}
		else return this;
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
	NyckelDBObj.prototype.sortByCol = function (colName: string, options?: { reverse?: boolean, fromEndOfStr?: boolean }): NyckelDB_interface {
		function reverseStr(str: string) {
			str = String(str);
			var ret: string[] = [];
			for (var a = 0, len = str.length; a < len; a++) {
				ret[a] = str[len - a - 1];
			}
			a = null!; len = null!;
			return ret.join("");
		}
		function sortFunction(a: any[], b: any[]) {
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
			(DB[this.id] as nyckelDB_uncompressed).table.sort(sortFunction);
			if (options.reverse) (DB[this.id] as nyckelDB_uncompressed).table.reverse();
			ROW_INDEX_CACHE[this.id] = {};
			colIndex = null!;
			return this;
		}
		else return this;
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
	NyckelDBObj.prototype.sync = function (json: nyckelDB_compressed, options?: { forceSync?: boolean; key?: string; initialKey?: string; oldKey?: string; token?: string}, callback?: syncCallback): void {
		function retError(this: NyckelDB_interface, msg: string) {
			if (callback instanceof Function) return callback.call(this, false, msg, false);
		}
		function sync(this: NyckelDB_interface) {
			function read(this: NyckelDB_interface, data: string, key: string | null, change: boolean) {
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
			return IMPORT_JSON.call(this, json, function (this: NyckelDB_interface, success: boolean, errors: tableErrors, changes: boolean) {
				if (success && !errors && (changes || this.syncPending === true || forceSync === true)) {
					return CREATE_BASE64_FILE.call(this, writeKey, opt.token, callback);
				}
				else return callback instanceof Function ? (callback.call(this, true, ERRORS[this.id], false), this) : this;
			}.bind(this), false, false);
		}
		function keyMigration(this: NyckelDB_interface) {
			if (opt.oldKey !== undefined && opt.key && opt.oldKey !== opt.key) {
				readKey = opt.oldKey;
				DB[this.id].lastModified = TIMESTAMP();
				this.syncPending = true;
			}
		}
		var opt = options || {},
			forceSync = opt.forceSync || false,
			readKey = opt.key || null,
			writeKey = opt.key || null,
			wait = MAX_SYNC_FREQUENCY + DBX_SYNC_OBJ[DB[this.id].title] - TIMESTAMP();
		keyMigration.call(this);
		if (wait > 0 && !forceSync) return retError.call(this, "rate limited, try again in " + wait + " minutes");
		else if (SYNC_ERROR && new Date().getTime() - SYNC_ERROR_TIME < 15e3) return retError.call(this, "try again later");//15 seconds
		else if (!json) return CREATE_BASE64_FILE.call(this, writeKey, opt.token, callback);
		else if (typeof json === "string") json = JSON.parse(json);
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
	NyckelDBObj.prototype.unfilter = function (): NyckelDB_interface {
		return this.unhideRows();
	};
	/**
	 * Make all hidden rows accessible again
	 * @function unhideRows
	 * @returns {object} this
	 */
	NyckelDBObj.prototype.unhideRows = function (): NyckelDB_interface {
		if (HIDDEN_TABLE_DATA[this.id] !== undefined && !TABLE_IS_DELETED(DB[this.id])) {
			var row: tableRow;
			while (HIDDEN_TABLE_DATA[this.id].length > 0) {
				row = HIDDEN_TABLE_DATA[this.id][0];
				(DB[this.id] as nyckelDB_uncompressed).ids[row[0]] = JSON.parse(JSON.stringify(HIDDEN_IDS[this.id][row[0]]));
				delete HIDDEN_IDS[this.id][row[0]];
				(DB[this.id] as nyckelDB_uncompressed).table.push(HIDDEN_TABLE_DATA[this.id].splice(0, 1)[0]);
			}
			row = null!;
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
	NyckelDBObj.prototype.validate = function (value: any, valueType: typeString, callback: validateCallback) {
		return VALIDATE.call(this, value, valueType, "validate", callback);
	};
	//TODO share function
	return NyckelDBObj;
}());