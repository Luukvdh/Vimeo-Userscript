// ==UserScript==
// @name         'Cursus' knopje in ALL VIDEOS
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  try to take over the world!
// @author       You
// @match        https://vimeo.com/manage/folders*
// @match        https://vimeo.com/manage/videos*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// ==/UserScript==
var nr = 0;
function goToWork() {
nr = 0;
    $('.foundtitlesbutton').remove();
    console.log('features clicked!');

$('.video_manager__table_item').each(function(b,a)  {addCursusButton(a);  });

};


    function addCursusButton(a) {
        var el = $(a).children().eq(2).children().first().children().first();





    var txt = $(el).text();

    let newstr = txt.substring(0, txt.lastIndexOf("-"));


    var $button = $('<a/>',{
    text:  'cursus',
    href: 'https://vimeo.com/manage/videos/search/'+encodeURI(newstr)+"?",
    name:    'foundtitles',
        class: 'foundtitlesbutton',
    id: 'foundtitle'+nr,
    style: 'padding: 6px; padding-top: 1px; padding-bottom: 1px; padding-right: 6px; color: white; background-color: #19B7EA; display: inline; z-index:999; margin-left:18px; margin-right:8px; border-radius: 4px;',
    onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
    onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";'
  });
$button.appendTo(el);

nr++;








};
(function() {setTimeout(function() {var $sectie = $("section")[4]; $($sectie).on("DOMSubtreeModified", function(b) {var $bt = $(b.target); if($bt.hasClass('video_manager__table_item')) {addCursusButton($bt);}; });},500);
var featuresbutton = $("[aria-owns='topnav_features']")[0]; $(featuresbutton).text("\n                                Cursusknopjes                                                                    \n                                        \n                                            \n                                        \n                                    \n                                                            ");
     $(featuresbutton).unbind();
    $(featuresbutton).removeAttr("onclick");
    $(featuresbutton).on("click",function() {goToWork();});
// start00();



document.addEventListener('keydown', function (e) {
    if (e.keyCode == 119) { // F8
        debugger;
    }
}, {
    capture: true
});

})();

function start00() {var readylisten = document.addEventListener('readystatechange', function() {if (document.readyState == "complete" && location.href.indexOf("?") < 0) {goToWork();} else {$("h2").last().html(decodeURI(location.href.substring(location.href.lastIndexOf("/")+1,location.href.length-1))); };}, false);};

