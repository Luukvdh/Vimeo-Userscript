// ==UserScript==
// @name         'Cursus' knopje in ALL VIDEOS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @include     https://vimeo.com/manage/videos
// @include     https://vimeo.com/manage/folders*
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// ==/UserScript==
$(document).on('click', function(a) {if(a.toElement.textContent == "Load more…") {setTimeout(function() {jQuery( "[name='foundtitles']" ).remove(); goToWork()}, 1200);}});
function goToWork() {

    'use strict';

var $all;
setTimeout(function() {console.dir($('.table_cell__title_wrapper').toArray()); var $all = $('.table_cell__title_wrapper').toArray();
$all.forEach(function (a,b) {
var temptitle = a.textContent;
temptitle = findTitle(temptitle);
var $target = $('.table_cell__title_wrapper')[b];

var $button = $('<a/>',{
    text:  'cursus',
    href: 'https://vimeo.com/manage/videos/search/'+temptitle,
    name:    'foundtitles',
    id: 'foundtitle'+b,
    style: 'padding: 6px; padding-top: 3px; padding-bottom: 3px; color: white; background-color: #19B7EA; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px; position: relative;',
    onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
    onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";'
  });

$button.appendTo($target);
}); },2000);

};
goToWork();


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

