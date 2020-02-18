"use strict";
var loc = window.location;
if (!(loc && (/^file/.test(loc.href) || /^file/.test(loc.protocol) || loc.origin === "file://")) && navigator.serviceWorker) {
    //Service workers
    if (navigator.serviceWorker.controller) {
        //console.log('[PWA Builder] active service worker found, no need to register');
    }
    else {
        //Register the ServiceWorker
        navigator.serviceWorker.register('pwabuilder-sw.js', {
            scope: "/"
        }).then(function (reg) {
            //console.log('Service worker has been registered for scope:' + reg.scope);
        }, function (err) {
            // registration failed :(
            //console.log('ServiceWorker registration failed: ', err);
        });
    }
}
else
    console.log("no serviceWorkers");
//# sourceMappingURL=sw.js.map