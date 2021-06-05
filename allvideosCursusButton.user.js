// ==UserScript==
// @name         'Cursus' knopje in ALL VIDEOS
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  try to take over the world!
// @author       You
// @match        https://vimeo.com/manage/folders*
// @match        https://vimeo.com/manage/videos*
// @grant        none
// ==/UserScript==

function goToWork() {
var nr = 0;
$('body').on("DOMSubtreeModified",function(a) {if (a.target.classList[0] == "video_manager__table_item" && a.eventPhase == 3) {var el2 = a.target; var el = $(el2).children().eq(2).children().first().children().first(); console.dir(el);
    // $(spin).on("DOMSubtreeModified", function() {console.log("NU");




    var txt = $(el).text();

    let newstr = txt.substring(0, txt.lastIndexOf("-"));
   console.log(newstr);

    var $button = $('<a/>',{
    text:  'cursus',
    href: 'https://vimeo.com/manage/videos/search/'+encodeURI(newstr),
    name:    'foundtitles',
    id: 'foundtitle'+nr,
    style: 'padding: 6px; padding-top: 1px; padding-bottom: 1px; padding-right: 6px; color: white; background-color: #19B7EA; display: inline; z-index:999; margin-left:18px; margin-right:8px; border-radius: 4px;',
    onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
    onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";'
  });
$button.appendTo(el);
   console.dir(el.parent().parent().next());
nr++;


};});



   
 
};
(function() {

start0();

document.addEventListener('keydown', function (e) {
    if (e.keyCode == 119) { // F8
        debugger;
    }
}, {
    capture: true
});

})();

function start0() {var readylisten = document.addEventListener('readystatechange', function() {if (document.readyState == "complete") {goToWork();};}, false);};

