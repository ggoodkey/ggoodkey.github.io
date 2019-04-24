var CACHE = 'pwabuilder-precache';
var precacheFiles = [
	"cordova.js",
	"index.html",
	"manifest.json",
	//"pwabuilder-sw.js",
	"css/icons.css",
	"css/index.css",
	"css/fonts/glyphicons-halflings-regular.eot",
	"css/fonts/glyphicons-halflings-regular.svg",
	"css/fonts/glyphicons-halflings-regular.ttf",
	"css/fonts/glyphicons-halflings-regular.woff",
	"css/fonts/glyphicons-halflings-regular.woff2",
	"images/spinner.gif",
	"scripts/base64.min.js",
	"scripts/common.min.js",
	"scripts/debugmode.min.js",
	"scripts/dropbox.min.js",
	"scripts/index.js",
	"scripts/Lawnchair.js",
	"scripts/lists.min.js",
	"scripts/platformOverrides.js",
	"scripts/storage.js",
	"scripts/nyckelDB.js",
	"scripts/nyckelDB.min.js",
	"scripts/validate.min.js",
	"scripts/vue.min.js",
	"scripts/vue-router.min.js",
	"scripts/webworker.js",
	"scripts/adapters/memory.js",
	"scripts/adapters/indexed-db.js",
	"scripts/adapters/dom.js",
	"scripts/winjs/base.min.js"
];

//Install stage sets up the cache-array to configure pre-cache content
self.addEventListener('install', function (evt) {
	//console.log('[PWA Builder] The service worker is being installed.');
	evt.waitUntil(precache().then(function () {
		//console.log('[PWA Builder] Skip waiting on install');
		return self.skipWaiting();
	}));
});


//allow sw to control of current page
self.addEventListener('activate', function (event) {
	//console.log('[PWA Builder] Claiming clients for current page');
	return self.clients.claim();
});

self.addEventListener('fetch', function (evt) {	
	var corsRequests = /^https\:\/\/www\.dropbox\.com\/|^https\:\/\/api\.dropbox\.com\/|^https\:\/\/dropbox\-api\.arkoselabs\.com\/|^https\:\/\/cfl\.dropboxstatic\.com\/|^https\:\/\/api\-content\.dropbox\.com\/|^https\:\/\/api\.dropboxapi\.com\/|^https\:\/\/content\.dropboxapi\.com\//;

	if (evt.request.url.match(corsRequests)) {
		//console.log('[PWA Builder] cors asset: ' + evt.request.url);
		evt.respondWith(fromServer(evt.request));
	}
	else {
		//console.log('[PWA Builder] The service worker is serving the asset: ' + evt.request.url);
		evt.respondWith(fromCache(evt.request).catch(fromServer(evt.request)));
		evt.waitUntil(update(evt.request));
	}
});


function precache() {
	return caches.open(CACHE).then(function (cache) {
		//console.log("[PWA Builder] precache", cache);
		return cache.addAll(precacheFiles);
	});
}

function fromCache(request) {
	//we pull files from the cache first thing so we can show them fast
	return caches.open(CACHE).then(function (cache) {
		return cache.match(request).then(function (matching) {
			//console.log("[PWA Builder] fromCache", matching);
			return matching || Promise.reject('no-match');
		});
	});
}

function update(request) {
	//this is where we call the server to get the newest version of the 
	//file to use the next time we show view
	return caches.open(CACHE).then(function (cache) {
		return fetch(request).then(function (response) {
			//console.log("[PWA Builder] update", response);
			return cache.put(request, response);
		});
	});
}

function fromServer(request) {
	//this is the fallback if it is not in the cache to go to the server and get it
	return fetch(request).then(function (response) {
		return response;
	});
}
