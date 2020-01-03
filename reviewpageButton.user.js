// ==UserScript==
// @name        knopje settings in REVIEWPAGE
// @namespace   ewise
// @include     https://vimeo.com/ewise/review*
// @version     1.7
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require     https://raw.githubusercontent.com/ewisenl/Vimeo-Userscript/master/SRTConverter.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.1.2/papaparse.min.js

// ==/UserScript==

// Author:      Luuk van den Hoogen
// Date:     2019-26-juli

(function() {
  
  var xpathResult = getElementByXpath("/html/body/div[1]/div/div[1]");
  xpathResult.style.backgroundColor = "#1F1F1F";

  var foundtitle = document.title; foundtitle = foundtitle.toString();
  foundtitle = foundtitle.substring(0, foundtitle.length - 9);

    var foundcursus = foundtitle.substring(0,foundtitle.lastIndexOf("-"));


var link = window.location; link = link.toString();
link = link.substring(0, link.length - 11);
link = link.substring(link.length - 9, link.length);
    console.log(link);

  // var $button = $('<a/>',{
  //     text:  'zoek deze video',
  //     href: 'https://vimeo.com/manage/videos/search/'+encodeURIComponent(foundtitle),
  //     id:    'zoekcursus',
  //     onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
  //     onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";',
  //     style: 'padding: 7px; padding-top: 5px; padding-bottom: 5px; color: white; background-color: #19B7EA; display: inline-block; z-index:999; border-radius: 4px; position: relative; margin-left: 20vw;'
  //   });
  // $button.prependTo(xpathResult);

    var $button2 = $('<a/>',{
      text:  'zoek alle video\'s van deze cursus',
      href: 'https://vimeo.com/manage/videos/search/'+encodeURIComponent(foundcursus),
      id:    'zoekcursus',
      onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
      onmouseout: 'javascript:this.style.backgroundColor = "#125b73";',
      style: 'padding: 9px; padding-top: 7px; padding-bottom: 7px; color: white; background-color: #125b73; display: inline-block; z-index:999; border-radius: 4px; position: relative; margin-left: 20vw; margin-top: 5px;'
    });
  $button2.appendTo(xpathResult);

  var $button3 = $('<a/>',{
      text:  'Instellingen van deze video',
      href: 'https://vimeo.com/manage/'+link+"/general",
      id:    'instellingen',
      onmouseover: 'javascript:this.style.backgroundColor = "#0088CC"',
      onmouseout: 'javascript:this.style.backgroundColor = "#125b73"',
      style: 'padding: 9px; padding-top: 7px; padding-bottom: 7px; color: white; background-color: #125b73; display: inline-block; z-index:999; border-radius: 4px; position: relative; margin: auto; margin-left: 10px; margin-top: 5px;'
    });
  $button3.appendTo(xpathResult);

  var $button4 = $('<a/>',{
      text:  'download SRT',
      href:   '#',
      id:    'downloadSRT',
      onmouseover: 'javascript:this.style.backgroundColor = "#0088CC"',
      onmouseout: 'javascript:this.style.backgroundColor = "#125b73"',
      style: 'padding: 9px; padding-top: 7px; padding-bottom: 7px; color: white; background-color: #125b73; display: inline-block; z-index:999; border-radius: 4px; position: relative; margin: auto; margin-left: 10px; margin-top: 5px;'
    });

    var $button5 = $('<a/>',{
      text:  'Open laatste correcties',
      href:   '#',
      id:    'openRemarks',
      onmouseover: 'javascript:this.style.backgroundColor = "DarkMagenta";',
      onmouseout: 'javascript:this.style.backgroundColor = "BlueViolet";',
      style: 'padding: 9px; padding-top: 7px; padding-bottom: 7px; color: white; background-color: BlueViolet; display: inline-block; z-index:999; border-radius: 4px; position: relative; margin: auto; margin-left: 10px; margin-top: 5px;'
    });





  $button4.on('click', function() {
      var yy = window.location.href; yy = yy.replace('#', '');
      yy = yy+"/download_notes_csv"; console.log(yy);
      var name = document.title; name = name.replace(" on Vimeo", "");
      var blob = new Blob([getSRT(yy, name, false)], {type: "text/plain;charset=utf-8"});
      saveAs(blob, name+".srt");
      });
  $button4.appendTo(xpathResult);

  $button5.on('click', function() {
    var yy = window.location.href; yy = yy.replace('#', '');
    yy = yy+"/download_notes_csv"; console.log(yy);
    var name = document.title; name = name.replace(" on Vimeo", "");
    var csvraw = getSRT(yy, name, true);
    csvraw.data.shift();
    csvraw.data.pop();
    console.dir(csvraw);
    var aantal = csvraw.data.length;
    $('#openRemarks').text('Open laatste correcties ('+aantal+')');
    
    var w = window.open("","Laatste correcties "+name,"width=" + (parseInt(window.innerWidth) * 0.4) + ",height=" + (parseInt(window.innerHeight) * .45) + ",toolbar=0,menubar=0,location=0,status=0,scrollbars=1,resizable=0,left=0,top=0");
  var html = "<style>html {font-family: 'Open Sans';} th, td {padding: 15px; text-align: left;} tr:nth-child(even) {background-color: #f2f2f2;} tr:nth-child(odd) {background-color: #f0f0f0;}</style><p style='width: 100%; text-align: center;'><b>Correcties&nbsp;"+name+"</b></p><table style='vertical-align: top;'>";
csvraw.data.forEach(function(a) {
  console.log(a[2]+" : ",a[4]);
  html += "<tr><td>"+a[2]+"</td><td>"+a[4]+"</td></tr>";
});
html += "</table>";
$(w.document.head).html('<title>Correcties '+name+'</title>');
    $(w.document.body).html(html);

    });
$button5.appendTo(xpathResult);

$(window).on('load', function() {
  var yy = window.location.href; yy = yy.replace('#', '');
  yy = yy+"/download_notes_csv"; console.log(yy);
  var name = document.title; name = name.replace(" on Vimeo", "");
  
  var csvraw2 = getSRT(yy, name, true);
    csvraw2.data.shift();
    csvraw2.data.pop();
  
    var aantal = csvraw2.data.length;
    $('#openRemarks').html('Open laatste correcties (&nbsp;<b>'+aantal+'</b>&nbsp;)'); });

  })();

  function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }


