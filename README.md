# ![N](./images/firefox/firefox-general-32-32.png)yckelDB Documentation

#### NyckelDB Version 0.4
##### April 19, 2019
NyckelDB is a highly structured JavaScript data store. Any data that 
you can visualize as a table or spreadsheet can be stored in a NyckelDB object. NyckelDB data 
is sortable, searchable, filterable, syncable and shareable. All data inputs are validated 
according to data type, and data can be imported or exported as JSON or CSV (coming soon).

## Table of Contents

* [Overview](#overview)
* [Features](#features)
  * [Sort, Shuffle and Filter](#sort-shuffle-and-filter)
  * [Search](#search)
  * [Search Suggestions](#search-suggestions)
  * [Sync and Share](#sync-and-share)
  * [Data Validation](#data-validation)
  * [Formulas](#formulas)
* [Types](#types)
  * [String types](#string-types)
  * [Numeric types](#numeric-types)
  * [Boolean types](#boolean-types)
* [Setting up a new NyckelDB Object](#setting-up-a-new-nyckeldb-object)
  * [The Options Parameter](#the-options-parameter)
    * [Importing Data](#importing-data)
    * [Custom Properties](#custom-properties)
* [Miscellaneous](#miscellaneous)
  * [Dependencies](#dependencies)
  * [Database Structure](#database-structure)
  * [Null and Undefined](#null-and-undefined)
  * [Time Stamps](#time-stamps)

# Overview
Nyckel (nick-hell) is a Swedish word that means "key". Keys are used for keeping things safe that are important to you. 
Keys are small, light-weight, and handy, but not very flexible, which might be the very reason that you want to use one. Keys mean safety, responsibility, integrity, access.

NyckelDB uses keys in two ways:
1. internally, each data store is isolated from other data stores by use of randomly generated keys
1. data stores can be obfuscated if desired

The basic concept of NyckelDB is to create a portable JavaScript client-side data store that has a very strict gate-keeper, maintaining data integrity wherever you put it and however you use it.
NyckelDB uses Lawnchair as its cross-browser localStorage solution, but will also access Windows storage APIs (Windows.Storage.ApplicationData.current.localFolder) if used in a UWP application for more persistent storage. For a cloud solution,
a compressed and obfuscated JSON object can be exported for you to send wherever you want it to go, and imported again and synchronized on another device.

NyckelDB can be visualized as having a table-like structure, with table headers, and table rows, although the actual structure is a combination of 2D Array's and JSON Objects, linked together with auto-generated unique ids.
This enables the database to behave like both an Array and an Object, where data is sortable like in an Array, but also highly performant like an Object for read, write, search and sync operations.

The data store can (and if possible should) be run in the background in a webWorker, and so as much computational work as possible is handled by the database including basic search, sort, filter, 
and even very simple application specific custom formulas.

LZString compression is used in localStorage so you can fit many MB of data in the very limited storage space that some browsers allow, and reduce bandwidth if uploading to a cloud service provider.

All data written to the data store is automatically validated before being written, taking care of much of your form validation work for you such as names, email addresses and phone numbers. 

# Features
Other than the basic read/write functionality that would be expected in any type of data storage solution, NyckelDB also contains the following features:

### Sort, Shuffle and Filter
Like a table, data can be sorted alphabetically and/or numerically by any column in the table, or conversely, shuffled to be completely random &ndash; useful if you want to create a playlist, or stack of flashcards.

The table can also be filtered by column, based on matching a given regular expression.

### Search
NyckelDB contains a basic search engine. Data is search indexed for fast search results based on whole, and multiple words,
returning results in order of best match. 
Complex searches can be created with the + and - operators, which correspond to AND and NOT respectively.
Fuzzy matching can be used in some cases to return near matches, for example, common names or spelling mistakes.

### Search Suggestions
NyckelDB can aid, or hint to a user what they might be able to search for by returning search suggestions based on partial word matches.
This is surprisingly fast and can be used to create an as-you-type experience to fill in a search box and/or the dropdown list under the search box.
Recent searches are cached so these words can bubble to the top of the next search suggestion.

### Sync and Share
Made possible by use of two features:

* ID tagged rows - all "rows" are identified by a 3-5 digit id, making searches and synchronization much simpler
* LastModified - all data (in every single cell) is stored with accompanying LastModified attributes

This means that data can be synchronized between local storage and cloud storage, devices, or even people.
Conflict resolution follows the assumption that the most recent data in each cell is the data that you want to keep.

Sharing data securely based on a Diffie-Hellman key exchange system coming soon... (maybe)

### Data Validation
Data that you input into a NyckelDB object is validated before it is saved, at a minimum, by verifying that it is either a String, Number, or Boolean value. 
All data *must* fall into one of these three categories. Other types of data, such as Objects and Arrays are not allowed in a NyckelDB and will throw an error.
The data type for each column in the table is specified on creation of the table.

Within these 3 general types of data are many more subtypes. 
Additional data validation, and sometimes error correction can be done by specifying a subtype, i.e. streetAddress is a subtype of String. 
Some subtypes fall into more than one category such as *postalZipCode* which can be a String or a Number. 
[See Types below](#types) for a complete list of all the different subtypes.

If you want the most flexibility you can specify *any*, which will allow any type of data to be saved to that column in the table, as long as it is a String, Number or Boolean value.

### Formulas
Coming soon

# Types
### String types
* **any** is the default type if no type is specified. Use it if you want to accept input data that could be String, Number, or Boolean values
* **string** accepts any String value
* **uniqueString** can be used for things like ids or usernames. It wont accept a value if it already exists in that column of the table.
* **email** verifies that the value could be a valid email address
* **phoneNumber** verifies that the value could be a valid local or long distance phone number, and formats it accordingly
* **password** checks for password strength and that it follows character use requirements, then saves a salted SHA256 hash of the password. Retrieval of the password requires that the original password be given and only returns true or false depending on whether they match.
* **streetAddress** checks that a string contains both letters and numbers, and corrects some common address input errors
* **mailAddress** checks that a string contains both letters and numbers, and corrects some common mailing address input errors
* **cityCounty** for a county, city or town name
* **provinceStateRegion** for a province, state or region
* **country** for a country or nation
* **postalZipCode** verifies that the value could be a Canadian postalCode, or American zipCode
* **givenName** for a first or middle name
* **familyName** for a last name
* **geoLocation** for complete formatted GPS position in decimal coordinates

### Numeric types
* **any** see [String types: any](#string-types)
* **number** accepts any numeric value, whether positive, negative, or decimal, up to the JavaScript physical size limit
* **integer** checks that it is a number, and rounds numbers to the nearest integer value
* **posInteger** checks that is a positive number, including 0, and rounds to the nearest integer value
* **negInteger** checks that it is a negative number, including 0, and rounds to the nearest integer value
* **date** for brevity, stores dates as the number of milliseconds since the database creation. Retrieved values are returned in UNIX time - the number of milliseconds since 00:00:00 Jan 1, 1970 UTC
* **phoneNumber** see [String types: phoneNumber](#string-types)
* **password** see [String types: password](#string-types)
* **postalZipCode** see [String types: postalZipCode](#string-types)
* **longitude** checks that it is a valid longitudinal decimal coordinate
* **latitude** checks that it is a valid latitudinal decimal coordinate

### Boolean types
* **any** see [String types: any](#string-types)
* **boolean** accepts only true or false

# Setting up a new NyckelDB Object
Setting up a new NyckelDB object is as simple as calling the constructor using the "new" keyword and passing it the required table parameters: "headers", and "types". Optional "customProperties" and "importData" can also be passed to the table on setup.

```javascript
var headers = ["Month", "Monthly Income", "Monthly Expenses", "Balance"],
    types = ["date", "posInteger", "negInteger", "integer"],
    options = { 
        importData: myExistingNyckelDBData,
        customProperties:{
            "FinalBalance": {
                type: "integer",
                initialValue: 10000
            },
            "ICanBuyMyGroceriesThisMonth": {
                type: "boolean",
                initialValue: true
            }
        }			
    },
    callback = function(){ 
        //update UI to show newly created NyckelDB here
};
var myTable = new APP.NyckelDB(headers, types, options, callback);
myTable.getLength(); //returns 0
```
There is quite a bit of flexibility in how you want to go about setting up a new NyckelDB object. Headers can be passed as an Array, and types as a corresponding Array (as shown above), 
or you can pass types as an Object in the form: \<columnName>: \<columnType>

```javascript
var types = { 
	Month: "date",
	"Monthly Income": "posInteger",
	"Monthly Expenses": "negInteger",
	Balance: "integer"
}
```
which might be an easier way to manage your code, especially if you have a large number of columns. 

If the order of the columns in your table is unimportant, you can pass this Object directly as the headers
themselves in the first parameter instead of an Array, and the second parameter as null.

Finally, additional metadata can be set such as whether a column should be indexed for searching, what it's initial value should be if nothing is
specified, or even a [formula](#formulas), by passing Types in like this:

```javascript
var types = { 
	Month: { 
		type: "string", 
		search: true,
		initialValue: "January"
	},
	"Monthly Income": {
		type: "posInteger",
		search: false,
		initialValue: 2000
	},
	"Monthly Expenses": {
		type: "negInteger",
		search: false
	},
	Balance: {
		type: "integer",
		formula: "SUBTRACT('Monthly Income','Monthly Expenses')"
	}
}
```


> __Q: When should you use an Array for your column headers? When would order matter?__
> 
> A: If you want to display the data from an entire row all at once on the screen in a specific order, 
or if you receive your data as an Array and want to pass it directly into a newly created row in your 
table at once. You can work around this by reordering the output afterwards of course, but better to be aware of this in the beginning.

### The Options Parameter
The 'options' parameter accepts an Object. It may contain data to import immediately after the database is
created in the form of a CSV file (string), or JSON object, and custom properties that you would like to add to your table.

```javascript
var options = {
	importData: nyckelDBTable,
	importJSON: json,
	importCSV: string,
	customProperties:{
		"FinalBalance": {
			type: "integer",
			initialValue: 10000
		},
		"ICanBuyMyGroceriesThisMonth": {
			type: "boolean",
			initialValue: true
		}
	}	
};
```

##### Importing Data
CSV, or JSON data can be imported into the table in the 'options' parameter in one of 3 forms:

```javascript
//table data that was generated by NyckelDB sync or exportJSON functions
importData: nyckelDBTable, 

//json data that needs to be parsed
importJSON: json, 

//or CSV data that needs to be converted to JSON and then parsed
importCSV: string, 
```

##### Custom Properties
Custom properties can be used for data that doesn't quite fit into the "table" model, such as maybe some metadata that applies to the entire database. 
The existence of a custom property must be initiated when the NyckelDB object is created, and must be given an initial value. 
Custom properties can be given a type as well, but only "string", "number" or "boolean", or left as "any".

```javascript
customProperties:{
	//name the custom property what ever you want
	"FinalBalance": {
		type: "integer",
		initialValue: 10000
	},
	"ICanBuyMyGroceriesThisMonth": {
		type: "boolean",
		initialValue: true
	}
}	
```
# Miscellaneous
The following information may be helpful to understanding how the database works, but is not key to being able to use it.

### Dependencies
* validate.js
* base64.js
* storage.js
* Lawnchair.js

### Database Structure
The NyckelDB JSON Object may contain some, but not all, of the following properties:
* title - table title
* created - created date
* lastModified - last modified date
* deleted - deleted date
* version - created by NyckelDB version
* headers - table headers Array
* types - table header types Array
* ids - Object of ids and their contents last modified metadata
* table - 2D Array of table data
* properties - optional custom properties Object
* data - a password protected database
* signature - a hash of the password and protected database
* 
### Null and Undefined
Values of null or undefined cannot be added to the table. Attempting to do so will fail and throw an error.

### Time Stamps
The timestamps used for "created", "lastModified" and "deleted" may look strange. Rather than the typical 13 digit UNIX time, which is the number of milliseconds since 1970, the NyckelDB uses the number of minutes since Fri Jul 14 2017 02:40:00 GMT+0000. To the millisecond accuracy is not necessary, as synchronization is only permitted by NyckelDB, at maximum, every 5 minutes, so the entire database is made much smaller (and possibly slightly faster) by only recording changes to the nearest minute.
