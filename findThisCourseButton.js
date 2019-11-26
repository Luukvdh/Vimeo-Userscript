// ==UserScript==
// @name        Knopje 'zoek de hele cursus' bij iedere videopagina
// @namespace   ewise
// @include     https://vimeo.com/manage/*
// @version 1
// @grant   none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==
// Author:      Luuk van den Hoogen
// Date:     2019-26-juli

(function() {
  var thisurl = window.location.href;
  if(thisurl.includes('manage')) { 

  var xpathResult = getElementByXpath("/html/body/div[1]/div[2]/main/div/div[1]/div[1]/span");
  
  var titel = xpathResult.innerText;
      console.log(titel);
  
  var regex = /-/g;
  
  
  var result = [];
  var match;
  while (match = regex.exec(titel)) {
     result.push(match.index); }
  var foundtitle = result[1];
   if(result[0]) {
  foundtitle = titel.substring(parseInt(result[0])+1, parseInt(result[1]));};
  
  //if(result[0] > 6) {
  //foundtitle = titel.substring((titel.indexOf(" ")+1), result[0]);};
  
  
  
  var $button = $('<a/>',{
      text:  'zoek naar deze cursus',
      href: 'https://vimeo.com/manage/videos/search/'+encodeURIComponent(foundtitle),
      id:    'zoekcursus',
      onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
      onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";',
      style: 'padding: 7px; padding-top: 5px; padding-bottom: 5px; color: white; background-color: #19B7EA; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px; position: relative;'
    });
  $button.appendTo(xpathResult);
  
  }})();
  
  function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
  
  
  