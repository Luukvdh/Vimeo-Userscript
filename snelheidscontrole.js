// ==UserScript==
// @name        Marjolein's Snelheidscontrole
// @namespace   ewise
// @include     https://vimeo.com/ewise/review*
// @version     1.1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js


// ==/UserScript==

// Author:      Luuk van den Hoogen
// Date:     2019-26-november

(function() {

    var videoelem;
    var buttonelem;
    var rate = 1.0;
    
    $(window).on('load', function() {
    
    setTimeout(function() {
    videoelem = getElementByXpath('/html/body/div[1]/div/div[2]/div/div[2]/div[1]/div[2]/div[1]/div/div/div/div[1]/div/div/div[1]/div[1]/div/video');
    
    buttonelem = $("button span")[2];
    
    buttonelem.innerHTML = rate.toFixed(2)+"x";
    
    console.log(videoelem);
    console.dir(buttonelem)
    document.addEventListener('keypress', function(key) {
    key.preventDefault();
        console.log(key.keyCode);
        var keycode = key.keyCode;
        if(keycode == 45) {
        rate = rate-0.1;
    videoelem.playbackRate = rate;
    buttonelem.innerHTML = rate.toFixed(2)+"x";
        };
    
    if(keycode == 61 || keycode == 43) {
        rate = rate+0.1;
    videoelem.playbackRate = rate;
    buttonelem.innerHTML = rate.toFixed(2)+"x";
    
        };
    
    if(keycode == 96 || keycode == 48) {
        rate = 1.00;
    videoelem.playbackRate = rate;
    buttonelem.innerHTML = rate.toFixed(2)+"x";
        };
    
    
    
    });
    },1000);
    
    });
    
        })();
    
    function getElementByXpath(path) {
          return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }
    