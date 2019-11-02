// ==UserScript==
// @name        knopje settings in REVIEWPAGE
// @namespace   ewise
// @include     https://vimeo.com/ewise/review*
// @version 1
// @grant   none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require     https://raw.githubusercontent.com/ewisenl/Vimeo-Userscript/master/SRTConverter.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.1.2/papaparse.min.js

// ==/UserScript==

// Author:      Luuk van den Hoogen
// Date:     2019-26-juli

(function() {

    var xpathResult = getElementByXpath("/html/body/div[1]/div/div[1]");
    
  
    var foundtitle = document.title; foundtitle = foundtitle.toString();
    foundtitle = foundtitle.substring(0, foundtitle.length - 9);
  
      var foundcursus = foundtitle.substring(0,foundtitle.lastIndexOf("-"));
  
  
  var link = window.location; link = link.toString();
  link = link.substring(0, link.length - 11);
  link = link.substring(link.length - 9, link.length);
      console.log(link);
  
    var $button = $('<a/>',{
        text:  'zoek deze video',
        href: 'https://vimeo.com/manage/videos/search/'+encodeURIComponent(foundtitle),
        id:    'zoekcursus',
        onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
        onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";',
        style: 'padding: 7px; padding-top: 5px; padding-bottom: 5px; color: white; background-color: #19B7EA; display: inline-block; z-index:999; border-radius: 4px; position: relative; margin-left: 40vw;'
      });
    $button.prependTo(xpathResult);
  
      var $button2 = $('<a/>',{
        text:  'zoek hele cursus',
        href: 'https://vimeo.com/manage/videos/search/'+encodeURIComponent(foundcursus),
        id:    'zoekcursus',
        onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
        onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";',
        style: 'padding: 7px; padding-top: 5px; padding-bottom: 5px; color: white; background-color: #19B7EA; display: inline-block; z-index:999; border-radius: 4px; position: relative; margin-left: 10px;'
      });
    $button2.appendTo(xpathResult);
  
    var $button3 = $('<a/>',{
        text:  'Instellingen van deze video',
        href: 'https://vimeo.com/manage/'+link+"/general",
        id:    'instellingen',
        onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
        onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";',
        style: 'padding: 7px; padding-top: 5px; padding-bottom: 5px; color: white; background-color: #19B7EA; display: inline-block; z-index:999; border-radius: 4px; position: relative; margin: auto; margin-left: 10px;'
      });
    $button3.appendTo(xpathResult);

    var $button4 = $('<a/>',{
        text:  'download SRT',
        href:   '#',
        id:    'downloadSRT',
        onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
        onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";',
        style: 'padding: 7px; padding-top: 5px; padding-bottom: 5px; color: white; background-color: #19B7EA; display: inline-block; z-index:999; border-radius: 4px; position: relative; margin: auto; margin-left: 10px;'
      });
   




    $button4.on('click', function() {
        var yy = window.location.href; yy = yy.replace('#', '');
        yy = yy+"/download_notes_csv"; console.log(yy); 
        var name = document.title; name = name.replace(" on Vimeo", "");
        var blob = new Blob([getSRT(yy, name)], {type: "text/plain;charset=utf-8"});
        saveAs(blob, name+".srt");
        });
    $button4.appendTo(xpathResult);
    
  
    })();
  
    function getElementByXpath(path) {
      return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }
  
  
  