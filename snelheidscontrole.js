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
var thisurl = window.location.href;
if(thisurl.includes('ewise/review')) { 
    var videoelem;
    var buttonelem;
    var clickarea;
    var rate = 1.0;
    
    $(window).on('load', function() {
    
    setTimeout(function() {
    videoelem = getElementByXpath('/html/body/div[1]/div/div[2]/div/div[2]/div[1]/div[2]/div[1]/div/div/div/div[1]/div/div/div[1]/div[1]/div/video');


    
    buttonelem = $('span:contains("Send file")')[1];
    
    buttonelem.innerHTML = rate.toFixed(2)+"x";
    
    console.log(videoelem);
    console.log(buttonelem);
    
    document.addEventListener('keypress', function(key) {
    
        console.log(key.keyCode);
        var keycode = key.keyCode;
        if(keycode == 45) {
        rate = rate-0.1;
    videoelem.playbackRate = rate;
    buttonelem.innerHTML = rate.toFixed(2)+"x";
        };
    
   if ((keycode==43) &&
        (key.location===3)) {

        rate = rate+0.1;
    videoelem.playbackRate = rate;
    buttonelem.innerHTML = rate.toFixed(2)+"x";
    
        };
    
    if(keycode == 96 || keycode == 48) {
        rate = 1.00;
    videoelem.playbackRate = rate;
    buttonelem.innerHTML = rate.toFixed(2)+"x";
        };
   if ((keycode==13) &&
        (key.location===3)) {

       clickarea = getElementByXpath('/html/body/div[1]/div/div[2]/div/div[2]/div[1]/div[2]/div[1]/div/div/div/div[2]/div/button');
       simulate(clickarea, "click", { pointerX: 123, pointerY: 321 });
    };



    }); },1000);
    
    });
    
};})();
    
    function getElementByXpath(path) {
          return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        }

function simulate(element, eventName)
{
    var options = extend(defaultOptions, arguments[2] || {});
    var oEvent, eventType = null;

    for (var name in eventMatchers)
    {
        if (eventMatchers[name].test(eventName)) { eventType = name; break; }
    }

    if (!eventType)
        throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

    if (document.createEvent)
    {
        oEvent = document.createEvent(eventType);
        if (eventType == 'HTMLEvents')
        {
            oEvent.initEvent(eventName, options.bubbles, options.cancelable);
        }
        else
        {
            oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
            options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
        }
        element.dispatchEvent(oEvent);
    }
    else
    {
        options.clientX = options.pointerX;
        options.clientY = options.pointerY;
        var evt = document.createEventObject();
        oEvent = extend(evt, options);
        element.fireEvent('on' + eventName, oEvent);
    }
    return element;
}

function extend(destination, source) {
    for (var property in source)
      destination[property] = source[property];
    return destination;
}

var eventMatchers = {
    'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
}
var defaultOptions = {
    pointerX: 100,
    pointerY: 100,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
}
    