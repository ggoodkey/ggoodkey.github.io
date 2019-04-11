# ![N](./images/firefox/firefox-general-32-32.png)yckelDB Documentation

#### NyckelDB Version 0.4
##### April 11, 2019
NyckelDB is a highly structured JavaScript data store. Any data that 
you can visualize as a table or spreadsheet can be stored in a NyckelDB object. NyckelDB data 
is sortable, searchable, filterable, syncable and shareable. All data inputs are validated 
according to data type, and data can be imported or exported as JSON or CSV (coming soon).

## Table of Contents

* [Overview](#overview)
  * [Dependancies](#dependancies)
  * [Features](#features)
    * [Sort, Shuffle and Filter](#sort-shuffle-and-filter)
    * [Search](#search)
    * [Sync and Share](#sync-and-share)
    * [Data Validation](#data-validation)
  * [Types](#types)
    * [String types](#string-types)
    * [Numeric types](#numeric-types)
    * [Boolean types](#boolean-types)
* [Setting up a new NyckelDB Object](#setting-up-a-new-nyckeldb-object)
  * [The Options Parameter](#the-options-parameter)
    * [Importing Data](#importing-data)
    * [Custom Properties](#custom-properties)
* [Functions](#functions)
* [Formulas](#formulas)
* [Miscellaneous](#miscellaneous)
  * [Database Structure](#database-structure)
  * [Null and Undefined](#null-and-undefined)
  * [Time Stamps](#time-stamps)

# Overview
Nyckel (nick-hell) is a Swedish word that means "key". Keys are used for keeping things safe that are important to you. They are kinda like pouches, but different. Pouches are nice and soft, and you can put just about anything into a pouch. 
It is quite difficult to put just about anything into a key! Keys are small, light-weight, and handy, but not very flexible, which might be the very reason that you want to use a key. Keys mean safety, responsibility, integrity, access.

The basic concept of NyckelDB is to create a portable JavaScript client-side data store that has a very strict gate-keeper, maintaining data integrity wherever you put it and however you use it.
NyckelDB uses Lawnchair as its cross-browser localStorage solution, but will also access Windows storage APIs (Windows.Storage.ApplicationData.current.localFolder) if used in a UWP application for more persistant storage. For a cloud solution,
a compressed and encrypted JSON object can be exported for you to send wherever you want it to go, and imported again and synchronised on another device.

NyckelDB can be visualised as having a table-like structure, with table headers, and table rows, although the actual structure is a combination of 2D Array's and JSON Objects, linked together with auto-generated unique ids.
This enables the database to behave like both an Array and an Object, where data is sortable like in an Array, but also highly performant like an Object for read, write, search and sync operations.

The data store can (and if possible should) be run in the background in a webWorker, and so as much computational work as possible is handled by the database including basic search, sort, filter, 
and even very simple application specific custom formulas.

LZString compression is used in localStorage so you can fit several MB of data in the very limited storage space that some browsers allow, and reduce bandwidth if uploading to a cloud service provider.

All data written to the data store is automatically validated before being written, taking care of much of your form validation work for you such as names, email addresses and phone numbers. 
Some best practices are enforced on password storage by only saving hashed passwords of sufficient length, and requiring the password itself to get it back! 

The basic question that NyckelDB tries to answer is, "How would I like my own personal data to be collected, stored, transmitted and shared?" But beware! It is part of, but not a complete answer to this question.

## Dependancies
* validate.js
* base64.js
* storage.js
* Lawnchair.js

## Features

### Sort, Shuffle and Filter
Like a table, data can be sorted alphabetically and/or numerically by any column in the table, or conversly, shuffled to be completely random &ndash; useful if you want to create a playlist, or stack of flashcards.

The table can also be filtered by column, based on matching a given regular expression.

### Search
NyckelDB contains a basic search engine. Data is search indexed for fast search results of whole words, or can return search suggestions based on partial words.

### Sync and Share
Made possible by use of two features:

* ID tagged rows - all "rows" are identified by a 3-5 digit id, making searchs and synchronization much simpler
* LastModified - all data (in every single cell) is stored with accompanying LastModified attributes

This means that data can be synchronized between local storage and cloud storage, devices, or even people.
Conflict resolution follows the assumption that the most recent data in each cell is the data that you want to keep.

### Data Validation
Data that you input into a NyckelDB object is validated before it is saved, at a minimum, by verifying that it is either a String, Number, or Boolean value. 
All data *must* fall into one of these three categories. Other types of data, such as Objects and Arrays are not allowed in a NyckelDB and will throw an error.
The data type for each column in the table is specified on creation of the table.

Within these 3 general types of data are many more subtypes. 
Additional data validation, and sometimes error correction can be done by specifying a subtype, i.e. streetAddress is a subtype of String. 
Some subtypes fall into more than one category such as *postalZipCode* which can be a String or a Number. 
[See Types below](#types) for a complete list of all the different subtypes.

If you want the most flexibilty you can specify *any*, which will allow any type of data to be saved to that column in the table, as long as it is a String, Number or Boolean value.

## Types
### String types
* **any** is the default type if no type is specified. Use it if you want to accept input data that could be String, Number, or Boolean values
* **string** accepts any String value
* **uniqueString** can be used for things like ids or usernames. It wont accept a value if it already exists in that column of the table.
* **email** verifies that the value could be a valid email address
* **phoneNumber** verifies that the value could be a valid local or long distance phone number, and formats it accordingly
* **password** checks for password strength and that it follows character use requirements, then saves a salted SHA256 hash of the password. Retreival of the password requires that the original password be given and only returns true or false depending on whether they match.
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
* **number** accepts any numeric value, whether positive, negitive, or decimal, up to the Javascript physical size limit
* **integer** checks that it is a number, and rounds numbers to the nearest integer value
* **posInteger** checks that is a positive number, including 0, and rounds to the nearest integer value
* **negInteger** checks that it is a negitive number, including 0, and rounds to the nearest integer value
* **date** for brevity, stores dates as the number of milliseconds since the database creation. Retreived values are returned in UNIX time - the number of milliseconds since 00:00:00 Jan 1, 1970 UTC
* **phoneNumber** see [String types: phoneNumber](#string-types)
* **password** see [String types: password](#string-types)
* **postalZipCode** see [String types: postalZipCode](#string-types)
* **longitude** checks that it is a valid longitudinal decimal coordinate
* **latitude** checks that it is a valid latitudinal decimal coordinate

### Boolean types
* **any** see [String types: any](#string-types)
* **boolean** accepts only true or false

## Setting up a new NyckelDB Object
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
There is (surprisingly) quite a bit of flexibility in how you want to go about setting up a new NyckelDB object. Headers can be passed as an Array, and types as a corresponding Array (as shown above), 
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

Finally, additional metadata can be set such as whether a column should be indexed for searching, what should it's initial value be if nothing is
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
Likewise, you can pass this form of Object directly to the headers parameter instead of an Array, if the specific order of the columns in your table is unimportant.

> __Q: When should you use an Array for your column headers? When would order matter?__
> 
> A: If you want to display the data from an entire row all at once on the screen in a specific order, 
or if you receive your data  as an Array and want to pass it directly into a newly created row in your 
table at once. You can work around this by reordering the output afterwards of course, but better to be aware of this in the beginning.

## The Options Parameter
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

### Importing Data
CSV, or JSON data can be imported into the table in the 'options' parameter in one of 3 forms:

```javascript
//table data that was generated by NyckelDB sync or exportJSON functions
importData: nyckelDBTable, 

//json data that needs to be parsed
importJSON: json, 

//or CSV data that needs to be converted to JSON and then parsed
importCSV: string, 
```

### Custom Properties
Custom properties can be used for data that doesn't quite fit into the "table" model, such as maybe some metadata that applies to the entire database. 
The existance of a custom property must be initated when the NyckelDB object is created, and must be given an initial value. 
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

## Functions
There are all the basic functions for adding, changing and deleting data in the NyckelDB Object including:

Function Name | Parameters | Returns | Description
--------------|------------|---------|------------
addColumn | colName, position, *options, *callback | success | Add a new column to the table. Options are 'type', 'intialValue', 'formula'
deleteColumn | colName | success | Delete a column from the table
addRow | array, *id | rowId | Add a new row to the table. The array must be complete and contain initial values for all the cells in the row. Id is optional and will only be used if it doesn't already exist.
deleteRow | rowId | success | Delete a row along with all the data that it contains
getRow | rowId | row Object | Get an entire row from the table including column name, column type, and values
setVal | rowId, colName, newValue | validated value | Change the value of a cell
getVal | rowId, colName	| table cell value | Get the value of a cell
setProp | propName, value | | Change the value of a table [custom property](#custom-properties)
getProp | propName | property value | Get the value of a table [custom property](#custom-properties)
getTitle | | table title | Get the title of the table
setTitle | newTitle, *callback | | Change the title of the table. (This actually deletes the table and creates a new one with the new name &ndash; something to be aware of if you try to access the table by it's old name and see that it has been deleted!)
getType | colName | a column type | Get the 'type' that has been set on a particular column
sortByCol | colName, *options | | Sort the table alphabetically or numerically by a particular column. Options accepts an Object { "reverse": sort Z-A, (true or false), "fromEndOfStr": sort xA-xZ, (true or false)}
shuffle | | | Shuffle the order of the rows in the table
hideRow | rowId | | Hide a row. The row will not be accessible at all until you call unHideRows.
unHideRows | | | Make all hidden rows accessible again
filter | colName, regExp | | Hide all rows who's value in a specific column don't match the given regular expression
unFilter | | | Make all hidden rows accessible again (another way to call unHideRows)
deleteTable | *callback | | Delete a table along with all the data that it contains, including custom properties
forEachRow | funct, *callback | | Iterate through all (unhidden) rows in a table (in the current sorted order). Passes row ids to funct in sequence and executes funct
forEachCol | funct, *callback | | Iterate through all columns in a table. Passes the column name to funct in sequence and executes funct
search | searchQuery, *options | an Array of row ids which contain the searchQuery | Search for rows that contain all of the words given in the search query. Options accepts an Object { "colNames":[...(an Array of columns to search in)...] }
getSearchSuggestions | searchQuery | an Array of search queries that would return a match | Get search suggestions from partial words, for example, as you type in a search box
getIndexOf | *id, *value, *colName | zero based index of a row's current position in the table, -1 if not found | Get a row's current position in the table. You can supply either a row id, or else both a value and colName to find the first row that contains that value in the given column.
getLength | | a Number | Get the number of (unhidden, unfiltered) rows in the table
getLastModified | | a Number, see [Time stamps](#time-stamps) | Get the timestamp of when the table was most recently changed
isDeleted | | true or false | Check if the table has been deleted or not
importJSON | json, callback | | Merge two copys of the same NyckelDB table (same title, column headers and column types) into one
toCSV | | | Not implemented yet
toJSON_Array | | | Save/download the NyckelDB database to a JSON file
toJSON_KeyValuePairs | | | Not implemented (and may not...?)
sync | *options, *callback | true if successfully synchronized, false if not | Synchronize with a copy of the database in Dropbox. Requires the app to be authenticated with Dropbox. Options accepts an Object { forceSync: true, (false is default) key: a String, oldKey: a String }
NUKEALL | msg, *callback | | Clear all the locally cached copies of all the NyckelDB databases. Msg is the message that you want to tell the user before you blow everything up!

\* parameter not required

## Formulas
Coming soon

## Miscellaneous
The following information may be helpful to understanding how the database works, but is not key to being able to use it.

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
The timestamps used for "created", "lastModified" and "deleted" may look strange. Rather than the typical 13 digit UNIX time, which is the number of milliseconds since 1970, the NyckelDB uses the number of minutes since Fri Jul 14 2017 02:40:00 GMT+0000. To the millisecond accuracy is not nessisary, as synchronization is only permitted by NyckelDB, at maximum, every 5 minutes, so the entire database is made much smaller (and possibly slightly faster) by only recording changes to the nearest minute.
