# ![N](./images/firefox/firefox-general-32-32.png)yckelDB Documentation

#### NyckelDB Version 0.5
##### October 22, 2019
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
* [Getting Started](#getting-started)
  * [Setting up a new NyckelDB Object](#setting-up-a-new-nyckeldb-object)
  * [The Options Parameter](#the-options-parameter)
    * [Importing Data](#importing-data)
    * [Custom Properties](#custom-properties)
* [Full API Documentation](#full-api-documentation)
* [Dependencies](#dependencies)

# Overview
Nyckel (nick-ale) is a Swedish word that means "key".

The basic concept of NyckelDB is to create a portable JavaScript client-side data store with data type validation.

NyckelDB can be visualized as having a table-like structure (Figure 1), with table headers, and table rows, although the actual structure is JSON (Figure 2).

|           |COLUMN 0        |COLUMN 1  |COLUMN 2  |COLUMN 3      |
|:---------:|:--------------:|----------|----------|--------------|
|**HEADERS**|**id**          |**Name**  |**Age**   |**Is Awesome**|
|**TYPES**  |**uniqueString**|**string**|**number**|**boolean**   |
|**ROW 0**  |**aaa**         |Bob       |42        |false         |
|**ROW 1**  |**aab**         |Jill      |21        |true          |
|**ROW 2**  |**aac**         |Anne      |88        |true          |

*Figure 1: Imagine NyckelDB as having a table-like structure*

```javascript
{
    title: "Table Name",
    created: 1234567,
    lastModified: 1234567,
    version: "0.5_1.1",
    ids: {
        aaa: [/* lastModified info */],
        aab: [/* lastModified info */],
        aac: [/* lastModified info */]
    },
    columns: {
        headers: ["id", "Name", "Age", "Is_Awesome"],
        meta: {/* column metadata */}
    },
    table: [
        ["aaa", "Bob", 42, false],
        ["aab", "Jill", 21, true],
        ["aac", "Anne", 88, true]
    ],
    properties: {/* custom properties */}
}

``` 
*Figure 2: What a NyckelDB table really looks like*

The data store can run along side your other JavaScript code by adding a \<script\> tag directly to your HTML document, or run in a background task in a Web Worker (which is recommended).

NyckelDB stores data temporarily in the browser using [Lawnchair](https://github.com/brianleroux/lawnchair/) as its cross-browser localStorage solution. 
For more persistant storage, you can export the data from NyckelDB as a JSON file and send it to your own cloud solution. 
Synchronisation is handled client-side when you import that JSON file back into the NyckelDB. NyckelDB can also access Windows storage APIs (Windows.Storage.ApplicationData.current.localFolder) 
if used in a UWP application.

LZString compression is used so you can fit many MB of data in the very limited localStorage space that some browsers allow, and reduce bandwidth if uploading to a cloud service provider.

All data written to the data store is automatically validated before being written, taking care of much of your form validation work for you such as names, email addresses and phone numbers. 

# Features
Other than the basic read/write functionality that would be expected in any type of data storage solution, NyckelDB also contains the following features:

### Sort, Shuffle and Filter
Like a table, data can be sorted alphabetically/numerically by any column in the table, or conversely, shuffled to be completely random &ndash; useful if you want to create a playlist, or stack of flashcards.

The table can also be filtered by column, based on matching a given regular expression.

### Search
NyckelDB contains a basic search engine. Data is search indexed for fast search results based on whole, and multiple words,
returning results in order of best match. 
Complex searches can be created with the + and - operators, which correspond to AND and NOT respectively.
Fuzzy matching can be used in some cases to return near matches, for example, common names or spelling mistakes.

### Search Suggestions
NyckelDB can aid, or hint to a user what they might be able to search for by returning search suggestions based on partial word matches.
This is surprisingly fast and can be used to create an as-you-type experience to fill in a search box and/or the dropdown list under the search box.
Recent successful searches are cached and returned at the top of the next search suggestion, giving you search history as well (though
this cache isn't saved anywhere so will be gone the next time you access the app/webpage).

### Sync and Share
Data can be exported as a JSON file which can be saved or transferred somewhere and reimported
without worrying about overwriting more recent data because all data (in every single cell) is stored with accompanying LastModified attributes

This means that data can be synchronized between local storage and cloud storage, devices, or even people.
Conflict resolution follows the assumption that the most recent data in each cell is the data that you want to keep.

Sharing data securely based on a Diffie-Hellman key exchange system coming soon... (maybe)

### Data Validation
Data that you input into a NyckelDB object is validated before it is saved, at a minimum, by verifying that it is either a String, Number, or Boolean value. 
All data *must* fall into one of these three categories. Other types of data, such as JavaScript Objects, Arrays or the values 'null' and 'undefined'
are not allowed in a NyckelDB and will throw an error.

Within these 3 general types of data are many more subtypes. 
Additional data validation, and sometimes error correction can be done by specifying a subtype, i.e. streetAddress is a subtype of String. 
Some subtypes fall into more than one category such as *postalZipCode* which can be a String or a Number. 
[See Types below](#types) for a complete list of all the different subtypes.

If you want the most flexibility you can specify *any*, which will allow any type of data to be saved to that column in the table, as long as it is a String, Number or Boolean value.

The data type for each column in the table is best specified on creation of the table, but in some cases can be changed afterwards.

### Formulas
Coming soon

# Types
The following types can be applied to any column:
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

# Getting started
To start using NyckelDB, it's download a copy of `nyckelDB.min.js`, `base64.min.js`, `storage.js`, `Lawnchair.js`, and the Lawnchair adaptors that you want to use (`dom.js`, `indexed-db.js` for starters), and insert them into your html file with script tags, loading them in this order:
```html
    <script type="text/javascript" src="scripts/base64.min.js"></script>
	<script type="text/javascript" src="scripts/Lawnchair.js"></script>
	<script type="text/javascript" src="scripts/adapters/indexed-db.js"></script>
	<script type="text/javascript" src="scripts/adapters/dom.js"></script>
	<script type="text/javascript" src="scripts/storage.js"></script>
	<script type="text/javascript" src="scripts/nyckelDB.min.js"></script>
```

### Setting up a new NyckelDB Object
Setting up a new NyckelDB object is as simple as calling the constructor using the "new" keyword and passing it the required table parameters: "headers", and "types". Optional "customProperties" and "importData" can also be passed to the table on setup.

> [See more details about the NyckelDB API below](#full-api-documentation)
```javascript
var title = "Accounting Spreadsheet",
    headers = ["Month", "Monthly Income", "Monthly Expenses", "Balance"],
    types = ["date", "posInteger", "negInteger", "integer"],
    options = {
        //see 'The Options Parameter' below
    },
    callback = function(){ 
        //update UI to show newly created NyckelDB here
};

var myTable = new APP.NyckelDB(title);
myTable.init(headers, types, options, callback);
myTable.getLength(); //returns 0

```
There is quite a bit of flexibility in how you want to go about setting up a new NyckelDB object. Headers can be passed as an Array, and types as a corresponding Array (as shown above), 
or you can pass types as an Object in the form:

```javascript
var types = { 
    "Month": "date",
    "Monthly Income": "posInteger",
    "Monthly Expenses": "negInteger",
    "Balance": "integer"
}
```
which might be an easier way to manage your code, especially if you have a large number of columns. 

If the order of the columns in your table is unimportant, you can pass this Object directly as the headers
themselves in the first parameter instead of an Array, and the second parameter as null.

> __Q: When should you use an Array for your column headers? When would order matter?__
> 
> A: If you want to display the data from an entire row all at once on the screen in a specific order, 
or if you receive your data as an Array and want to pass it directly into a newly created row in your 
table at once. You can work around this by reordering the output afterwards of course, but better to be aware of this in the beginning.

Finally, additional metadata can be set such as whether a column should be indexed for searching, what it's initial value should be if nothing is
specified, or even a [formula](#formulas), by passing Types in like this:

```javascript
var types = { 
    "Month": { 
        "type": "string", 
        "search": true,
        "initialValue": "January"
    },
    "Monthly Income": {
       "type": "posInteger",
        "search": false,
        "initialValue": 2000
    },
    "Monthly Expenses": {
        "type": "negInteger",
        "search": false
    },
    "Balance": {
        "type": "integer",
        "formula": "SUBTRACT('Monthly Income','Monthly Expenses')"
    }
}
```

### The Options Parameter
The 'options' parameter accepts an Object. It may contain data to import immediately after the database is
created in the form of a CSV file (string), or JSON object, and custom properties that you would like to add to your table.

```javascript
var options = {
    "importData": nyckelDBTable,
    "importJSON": json,
    "importCSV": string,
    "customProperties":{
        "FinalBalance": {
            "type": "integer",
            "initialValue": 10000
        },
        "ICanBuyMyGroceriesThisMonth": {
            "type": "boolean",
            "initialValue": true
        }
    }	
};
```

##### Importing Data
CSV, or JSON data can be imported into the table in the 'options' parameter in one of 3 forms:

```javascript
//table data that was generated by NyckelDB sync or exportJSON functions
"importData": nyckelDBTable, 

//json data that needs to be parsed
"importJSON": json, 

//or CSV data that needs to be converted to JSON and then parsed
"importCSV": string, 
```

##### Custom Properties
Custom properties can be used for data that doesn't quite fit into the "table" model, such as maybe some metadata that applies to the entire database. 
The existence of a custom property must be initiated when the NyckelDB object is created, and must be given an initial value. 
Custom properties can be given a type as well, but only "string", "number" or "boolean", or left as "any".

```javascript
customProperties:{
    //name the custom property what ever you want
    "FinalBalance": {
        "type": "integer",
        "initialValue": 10000
    },
    "ICanBuyMyGroceriesThisMonth": {
        "type": "boolean",
        "initialValue": true
    }
}	
```

# Full API Documentation
https://ggoodkey.github.io/dev/APP.nyckelDB.html

# Dependencies
* base64.js
* storage.js
* Lawnchair.js
