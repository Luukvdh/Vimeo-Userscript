// ==UserScript==
// @name         'Cursus' knopje in ALL VIDEOS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://vimeo.com/manage/folders*
// @match        https://vimeo.com/manage/videos*
// @grant        none
// ==/UserScript==

function goToWork() {
  
  $("span").on('click', function() {console.log("hiieroooo"); $("span").unbind(); setTimeout(function() {goToWork();},1000);});
    //$("button").on('click', function() {console.log("hiieroooo"); $("button").unbind(); setTimeout(function() {goToWork();},1000);});
  $("body").find("div").on('click', function() {this.unbind();goToWork();});
  $("[name='search-input']").keypress(function (e) {
    if(e.which ==13)
    {};
});

var $all;
setTimeout(function() {console.dir($('.table_cell__title_wrapper').toArray()); var $all = $('.table_cell__title_wrapper').toArray(); $('[name=foundtitles]').remove();
$all.forEach(function (a,b) {
var temptitle = a.textContent;
temptitle = findTitle(temptitle);
var target = $('.table_cell__title_wrapper')[b];

var $button = $('<a/>',{
    text:  'cursus',
    href: 'https://vimeo.com/manage/videos/search/'+temptitle,
    name:    'foundtitles',
    id: 'foundtitle'+b,
    style: 'padding: 6px; padding-top: 3px; padding-bottom: 3px; color: white; background-color: #19B7EA; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px; position: relative;',
    onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
    onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";'
  });
var $target = $(target);
var thisurl = $(location).attr('href');

if(!thisurl.includes("videos")) { 
$button.appendTo($target).hide().fadeIn(300);}}
)},1000);

};
(function() {
  setTimeout(function() {goToWork();},200);
$('.active').on('click',function() {goToWork();});
})();

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

