// ==UserScript==
// @name         'Cursus' knopje in ALL VIDEOS
// @namespace    http://tampermonkey.net/
// @version      1.32
// @description  try to take over the world!
// @author       You
// @match        https://vimeo.com/manage/folders*
// @match        https://vimeo.com/manage/videos*
// @grant        none
// ==/UserScript==

function goToWork(a) {
    console.log(a.readyState);
    setTimeout(function() {

$(".table_cell__title_wrapper").each(function(nr, el) {

    var txt = $(el).children().first().text();

    let newstr = txt.substring(0, txt.lastIndexOf("-"));
   console.log(newstr);

    var $button = $('                 <a/>',{
    text:  'cursus',
    href: 'https://vimeo.com/manage/videos/search/'+encodeURI(newstr),
    name:    'foundtitles',
    id: 'foundtitle'+nr,
    style: 'padding: 6px; padding-top: 3px; padding-bottom: 3px; color: white; background-color: #19B7EA; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px;',
    onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
    onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";'
  });
$button.appendTo(el);



});



    },4000);
};
(function() {

start0();



})();

function start0() {var readylisten = document.addEventListener('readystatechange', function() {if (document.readyState == "complete") {goToWork(this);};}, false);};

// $("span").on('click', function() {console.log("hiieroooo"); $("span").unbind(); $('[name="foundtitles"]').remove(); goToWork();});
// $("button").on('click', function() {console.log("hiieroooo"); $("button").unbind(); $('[name="foundtitles"]').remove(); goToWork();});

function findTitle(input) {
var regex = /-/g;


var result = [];
var match;
while (match = regex.exec(input)) {
   result.push(match.index); }
var foundtitle = result[1];
 if(result[0]) {
foundtitle = input.substring(parseInt(result[0])+1, parseInt(result[1]));};

if(result[0] > 6) {
foundtitle = input.substring((input.indexOf(" ")+1), result[0]);};
return foundtitle;
}

