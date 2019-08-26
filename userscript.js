// ==UserScript==
// @name        Luuk's Vimeo gemaksfuncties 2
// @namespace   ewise
// @include     https://vimeo.com/manage/videos/search/*
// @version 1
// @grant   none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.2/jszip.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/PapaParse/4.1.2/papaparse.min.js

// ==/UserScript==
// Author:      Luuk van den Hoogen
// Date:     2019-26-juli

$.noConflict();

$.fn.extend({
    toggleHTML: function(a, b){
        return this.html(this.html() == b ? a : b);
    }
});


var style = document.createElement('style');
style.innerHTML = ".tooltip {opacity: 0; -webkit-transition: opacity 1s ease-in-out; transition: opacity 2s ease-in-out; transition-delay: 2s; } .tooltip:hover:after {opacity: 1;}";


var secs = 3.5;
var resetsecs = 3.5;
var links = new Array;
var globalnames = [];
var globallenghts = [];
var globalIDs = [];
var query;
var totalfile;
var token;
var c;
var zipname;
var teller;
var globalembeds = [];
var filesobj = [];
var totalObjectArray = [];
var allcomments = [];
var oldVersions = {};
var contenttype;
var filedata;
var contentlength;
var blobUrl;
var imagefile;
var showhidethumb = false;
var reader = new FileReader();
var $input = $('<input/>',{type: "file", id:"fileid", style:"display:none;"});
var $copyinput = $('<textarea/>',{id:"copyinput", style:"display:none;"});
$input.prependTo($('body'));
$copyinput.prependTo($('body'));

function downloadAllSrts() {

teller=1;
var zip = new JSZip();
zipname = decodeURIComponent(query).replace('#','');

var d = new Date();
var mm = d.getMonth();
var maanden = ['jan','feb','maart','april','mei','juni','juli','aug','sep','oct','nov','dec'];
var maand = maanden[parseInt(mm)];
var datum = d.getDate()+" "+maand;
//var longeststr = globalnames.sort(function (a, b) { return b.length - a.length; })[0];
//var longest = longeststr.length;

links.forEach(function(link, a) {
totalfile = totalfile+"  >> "+globalnames[a]+"\r\n";



var thisname = globalnames[a];
//while(thisname.length <= longest) {thisname = thisname+" ";};
var srtdata = filesobj[a];
var aantalcorrecties = getNumberOfComments(link);
var edits = " edits";
if(parseInt(aantalcorrecties) == 1) {edits = " edit";};
zip.file(thisname+"    ["+aantalcorrecties+edits+"].srt", srtdata);
console.dir(allcomments);
totalfile = totalfile+allcomments[a]+"\r\n \r\n";


});
zip.file("overzicht.txt", totalfile);

zip.generateAsync({type:"blob"})
.then(function (blob) {
    saveAs(blob, zipname+" (correcties "+datum+").zip");
}); };

function getNumberOfComments(r) {

var req =  $.ajax({

        type: 'GET',
        url: r,
    async: false,
        beforeSend: function (request) {
            request.setRequestHeader('filename', 'name');
        },
        processData: false
    });
var responsetext = (req.responseText);

var arr = [];


if(responsetext.includes(",,,,,,,")) {var j = responsetext.indexOf(",,,,,,,"); responsetext = responsetext.substr(0,j);};
var h = (responsetext.match(/,[0-9],/g) || []).length;



return h;

}

function getVideoInfoForThumbnail(videoid) {
var link;
var videoinfo = $.ajax({
        type: 'POST',
        url: "https://vimeo.com/upload/_get_image_url",
     data: {type: "video", id: videoid},
         success: function(a) {console.log("upload link verkrijgen gelukt"); uploadThumbnail(videoid, a);},
         error: function(a) {console.log('fout bij opvragen video-info voor thumbnail...');}
    });

}


// --------------------------------------------------------------------- upload thumbnail
function uploadThumbnail(videoid, cloudlink) {

console.log("Ik ben al bij upload thumbnail!");
console.log("videoid: "+videoid);
console.log("content-type: "+contenttype);
console.log("cloudlink: "+cloudlink);

$.ajax({
        type: 'PUT',
        url: cloudlink,
    content: {
            "mimeType": contenttype,
            "size": contentlength,
        "Content-type": "application/json",

            "data": data},
    beforeSend: function(request) {
    request.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.4");

    request.setRequestHeader("Content-Type", contenttype);

    },
success:  function(a) {console.log(a);},
         error: function(a) {console.log('fout bij uploaden van de thumbnail...'); console.log(a);}
    });

}
var data;
function addThumbnailButton(videoid, a) {

var $row = $('.table_cell__title_wrapper')[a];


var $link4 = $('<a/>',{
    html:  'thumbnail',
    href: '#',
    id:    'thumbnail'+a,
    style: 'padding: 6px; color: white; background-color: #19B7EA; float: right; z-index:999; margin-left:4%; border-radius: 4px; display: inline;'
  });
$link4.on('click', function() {

    $('input[id=fileid]').trigger('click'); $('input[id=fileid]').on('change', function() { 

var r = new FileReader();

contenttype = $("#fileid")[0].files[0].type; contentlength = $("#fileid")[0].files[0].length;

r.onload = function(){ data = r.result; };
r.readAsBinaryString($("#fileid")[0].files[0]); data = r.result;
getVideoInfoForThumbnail(videoid);});});
//$link4.appendTo($row);

}





function changeEmbed(videoid, ischecked) {
if(ischecked) {
var embeddata = $.ajax({
        type: 'PUT',
        url: "https://api.vimeo.com/videos/"+videoid+"/presets/120424522",
    beforeSend: function(request) {
    request.setRequestHeader("Authorization", "jwt "+token); request.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.4.1"); request.setRequestHeader("Content-Type", "application/json"); request.setRequestHeader("Referer", "https://vimeo.com/manage/videos/search/"+zipname); },
         success: function() {console.log('embed leraren toegevoegd...');}
    }); };

if(!ischecked) {
var embeddataremove = $.ajax({
        type: 'PUT',
        url: "https://api.vimeo.com/videos/"+videoid+"/presets/297161",
     beforeSend: function(request) {
    request.setRequestHeader("Authorization", "jwt "+token); request.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.4.1"); request.setRequestHeader("Content-Type", "application/json"); request.setRequestHeader("Referer", "https://vimeo.com/manage/videos/search/"+zipname); },
         success: function() {console.log('embed leraren verwijderd...')}, error: function(a) {console.log("embed veranderen niet gelukt..."); console.log(a);}}
    ); };



}



function addEmbedButtons(embed, a, videoid) {
a = a+2;
var $row = $('.video_manager__checkbox')[a];

var $label = $("<label>", {style: "display: block; position: relative; padding-left: 35px; cursor: pointer; left: -75px; top: 5px;"});
var $checkbox = $('<input />',{
    type: 'checkbox',
    class: 'checkbox',
    title: 'Leraren-embed instellingen?',
    id:    'LEcheckbox'+a,
    name:  'LEcheckbox'+a,
    checked: false,
style: "display: block; position: relative;"
  });
//var $checkspan = $('<span />',{
//    style: "position: absolute; height: 25px; width: 25px; background-color: #eee; top: 5px;"});
if (embed) {$checkbox.prop({'checked': true});};

$checkbox.click(function(a){
    if($(this).is(':checked')) {

        changeEmbed(videoid, true);
    } else {

        changeEmbed(videoid, false);
    }
});
$checkbox.appendTo($label);
//$checkspan.appendTo($label);
$label.prependTo($row);
}


function getEmbed(videoid, a) {
var code;

var statusCodeResponses = {
    200: function () {

console.log("embed check OK!");
    },
    404: function () {


console.log("embed check mislukt...");
    }};



var embeddata = $.ajax({
        type: 'GET',
        url: "https://vimeo.com/manage/"+videoid+"/services/embed",
         statusCode: statusCodeResponses,
success:function(b) {if (b.embed_settings.embed_preset_id == 297161) {addEmbedButtons(false, a, videoid);}; if (b.embed_settings.embed_preset_id == 120424522) {addEmbedButtons(true, a, videoid);} }
    });



}







function getSRT(r, name, boolean) {



var req =  $.ajax({

        type: 'GET',
        url: r,
    async: false});
var responsetext = (req.responseText);
if(responsetext.includes(",,,,,,,")) {var j = responsetext.indexOf(",,,,,,,"); responsetext = responsetext.substr(0,j);};
var responsetextsrt = convertCSVtoSRT(responsetext);
name = req.name;
   return responsetextsrt;
};


var $downloadAllLink = $('<a/>',{
    text:  'download alle SRT\'s',
    href: '#',
    class: 'blue',
    onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
    onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";',
    id:    'allbutton',
    style: 'padding: 8px; padding-top: 5px; color: white; background-color: #19B7EA; display: block; float: right; z-index:999; margin-left:4%; border-radius: 4px; height: 28px; margin-top: 8px;'
  });
$downloadAllLink.click(function() {downloadAllSrts();});
var $bar = $('.topnav_menu_desktop_main')[0];
$downloadAllLink.appendTo($bar);









var finds = (-1);

function wel(r, a, yy, name, videoid) { finds++;
links.push(yy);
$('#allbutton').text("download alle SRT's ("+links.length+")");
var numberOfComments = getNumberOfComments(yy);
var $row = $('.table_cell__title_wrapper')[a];
var $xmark = $('<a/>',{
    html:  '<span style="font-weight: bold; font-size: 14pt; position: relative; top: 2px;">&#9993;&nbsp;</span>('+numberOfComments+')',
    href: '#',
    //onmouseover: 'javascript:this.style.transform = "scale(1.05)"',
    //onmouseout: 'javascript:this.style.transform = "scale(1.0)"',
    id: "x"+a,
    class: 'blue',
    title: allcomments[finds],
    id:    'cross'+a,
    style: 'padding: 6px; color: #ee7600; background-color: transparent; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px; line-height:0.5; font-weight: bold;transition: all 0.10s;'
  });

   $xmark.click(function() {var copyText = allcomments[finds]; var inp = document.getElementById('copyinput'); document.getElementById('copyinput').value = copyText; document.getElementById('copyinput').focus(); document.getElementById('copyinput').select(); document.execCommand("copy"); console.log('COPIED!'); });
   $xmark.appendTo($row);


if (numberOfComments > 0) {





var $link2 = $('<a/>',{
    html:  'SRT (<span style="color:white; font-weight: bolder;">'+numberOfComments+'</span>)',
    href: '#',
    class:'blue',
    onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";this.style.transform = "scale(1.05)"',
    onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";this.style.transform = "scale(1.0)"',
    title: allcomments[finds],
    id:    'srt'+a,
    style: 'padding: 6px; color: white; background-color: #19B7EA; display: block; float: right; z-index:999; margin-left:2%; border-radius: 4px;transition: all 0.10s; display: none;'
  });

var $link3 = $('<a/>',{
    text:  'review page',
    href: '#',
    class:'blue',
    onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";this.style.transform = "scale(1.05)"',
    onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";this.style.transform = "scale(1.0)"',
    id:    'reviewpage'+a,
    style: 'padding: 6px; color: white; background-color: #19B7EA; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px; transition: all 0.10s; display: none;'
  });










$link2.on('click', function() {
var blob = new Blob([getSRT(yy, name)], {type: "text/plain;charset=utf-8"});

saveAs(blob, name+".srt");


});
$link3.on('click', function() {openReviewPage(r);});

$link2.appendTo($row);
$link3.appendTo($row);
};
$('.table_cell__title_wrapper').on('mouseover', function(e) { var ind = e.target.parentNode.parentNode.sectionRowIndex; console.log(ind); $('#srt'+ind).fadeIn(0.15); $('#reviewpage'+ind).fadeIn(0.15);   });
$('.table_cell__title_wrapper').on('mouseleave', function(e) { var ind = e.target.parentNode.parentNode.sectionRowIndex; $('#srt'+ind).fadeOut(0.1);   $('#reviewpage'+ind).fadeOut(0.1);  });
};
function openReviewPage(link) {window.open(link);}
function niet(r, a, videoid) {
var $row = $('.table_cell__title_wrapper')[a];
var $link5 = $('<a/>',{
    text:  '✓',
    href: '#',
    id: "no"+a,
    id:    'vink'+a,
    style: 'padding: 6px; color: green; background-color: transparent; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px;'
  }); $link5.appendTo($row);



};
function addThumbButton(videoid, a) {
    var $row = $('.table_cell__title_wrapper')[a];

    var $setleft = $('<a/>',{
    html:  '- 0.5s',
    href: '#',
    name: "thumb3button",
    class: "thumb3button",
    onmouseover: 'javascript:this.style.backgroundColor = "transparent";this.style.transform = "scale(1.05)"',
    onmouseout: 'javascript:this.style.backgroundColor = "transparent";this.style.transform = "scale(1.0)"',
    id:    'thumbleft'+a,
   style: 'width: 60px; margin-bottom: 6px; text-align: center; height: 20px; color: DarkOrchid; background-color: transparent; display: block; float: right; z-index:999; margin-left:2%; border-radius: 50%; display: none;transition: all 0.15s; font-weight: bold; font-size: 16pt; overflow: visible;'
  });





var $settn = $('<a/>',{
    text:  'still op '+secs+' sec',
    href: '#',
    name: "thumb3button",
    class: "thumb3button",
    onmouseover: 'javascript:this.style.backgroundColor = "DarkMagenta";this.style.transform = "scale(1.05)"',
    onmouseout: 'javascript:this.style.backgroundColor = "DarkOrchid";this.style.transform = "scale(1.0)"',
    id:    'thumb'+a,
    style: 'padding: 7px;  color: white; background-color: DarkOrchid; display: block; float: right; z-index:999; margin-left:2%; border-radius: 8px; display: none;transition: all 0.15s; font-weight: normal;'
  });


     var $setright = $('<a/>',{
    html:  '&#43;0.5s',
    href: '#',
    name: "thumb3button",
    class: "thumb3button",
    onmouseover: 'javascript:this.style.backgroundColor = "transparent";this.style.transform = "scale(1.05)"',
    onmouseout: 'javascript:this.style.backgroundColor = "transparent";this.style.transform = "scale(1.0)"',
    id:    'thumbright'+a,
    style: 'width: 40px; margin-bottom: 6px; text-align: center; height: 20px; color: DarkOrchid; background-color: transparent; display: block; float: right; z-index:999; margin-left:2%; border-radius: 50%; display: none;transition: all 0.15s; font-weight: bold; font-size: 16pt; overflow: visible;'
  });




$settn.on('click', function() {setThumbnailTo3(videoid, a, secs);});
$setleft.on('click', function() {secs = secs-0.5; $settn.text('still op '+secs+' sec'); setThumbnailTo3(videoid, a, secs);});
$setright.on('click', function() {secs = secs+0.5; $settn.text('still op '+secs+' sec'); setThumbnailTo3(videoid, a, secs);});
$setleft.appendTo($row);
$settn.appendTo($row);
$setright.appendTo($row);

}


var page = 1;























// ------  START

// ------  START

// ------  START



function start() {




setTimeout(function() {$('body').children().each, function(b,a) {
console.log(b);
var $spinnertje = $('<a/>',{
    text:  'X',
    href: '#',
    id: "no"+a,
    id:    'vink'+a,
    style: 'padding: 6px; color: green; background-color: transparent; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px;'
  }); $spinnertje.appendTo(b);
}}, 2000);
    token = vimeo.config.api.jwt;
     'use strict';
//console.dir(vimeo.config);
var direction = vimeo.config.video_manager.initial_state.sort.direction;
var listtype = vimeo.config.video_manager.initial_state.sort.type;
if (direction != "desc" || listtype != "date") {


var listtoken = vimeo.xsrft;
$.ajax({
        type: 'POST',
        url: "https://vimeo.com/settings?action=set_video_manager_sort_pref",
    data: "sort[type]=date&sort[direction]=desc&token="+listtoken,
    beforeSend: function(request) {
    request.setRequestHeader("action", "set_video_manager_sort_pref");
        request.setRequestHeader("Authorization", "jwt "+token);
    },
success:  function(a) {console.log('Sorting is omgezet'); location.reload();},
         error: function(a) {console.log('fout bij omzetten sorting...'); console.log(a);}
    });

};
var total = {};


opschoonButton();
thumb3Buttons();

query = window.location.href.replace('https://vimeo.com/manage/videos/search/','');
zipname = decodeURIComponent(query).replace('#','');
totalfile = "oO0OoO0OoO0Oo  "+zipname.toUpperCase()+" (correcties) oO0OoO0OoO0Oo \r\n \r\n \r\n \r\n";




    //AJAX Request search results:

    $.ajax({
         url: "https://api.vimeo.com/users/18516679/videos?fields=created_time%2Cduration%2Cfile_transfer%2Clink%2Clast_user_action_event_date%2Cname%2Cpictures.uri%2Cprivacy%2Creview_page%2Curi&per_page=48&page="+page+"&sort=date&direction=desc&query="+query,
data:"fields=created_time%2Cduration%2Cfile_transfer%2Clink%2Clast_user_action_event_date%2Cname%2Cpictures.uri%2Cprivacy%2Creview_page%2Curi&per_page=48&sort=date&direction=desc&query="+query,
         type: "GET",
        async: true,
     beforeSend: function(request) {
    request.setRequestHeader("Authorization", "jwt "+token); request.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.4.1"); request.setRequestHeader("Content-Type", "application/json"); request.setRequestHeader("Referer", "https://vimeo.com/manage/videos/search/"+zipname); },
         fail: function(a){
       alert('request failed');},
         success: function(a) {console.dir(a);
a.data.sort(function(a, b) {
   return a.name - b.name}); c = 0;





a.data.forEach(function(z,a) {
var videoid = z.uri;
var created = z.created_time;
getYearPlays(videoid,a, created);

});









a.data.forEach(function(z,a) {



var $roww = $('.table_cell__title_wrapper')[a];
var $ticker = $('<a/>',{
    html:  '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="25px" height="25px" viewBox="0 0 128 128" xml:space="preserve"><g><path d="M75.4 126.63a11.43 11.43 0 0 1-2.1-22.65 40.9 40.9 0 0 0 30.5-30.6 11.4 11.4 0 1 1 22.27 4.87h.02a63.77 63.77 0 0 1-47.8 48.05v-.02a11.38 11.38 0 0 1-2.93.37z" fill="#6c87f0" fill-opacity="1"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform></g></svg>',
    href: '#',
    id: "ticker"+a,
    style: 'padding: 6px; color: green; background-color: transparent; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px;'
  }); $ticker.appendTo($roww);



a = a + (48*((page-1)));
var w;
var y;
//var name;
var videoid;
var videolength;
         w = (z.review_page.link);
var name = z.name;

         y = w+"/download_notes_csv";
videoid = z.uri;


videoid = videoid.replace("/videos/", "");
globalIDs.push(videoid);
videolength = z.duration;
getEmbed(videoid, a);



addThumbnailButton(videoid, a);

addVersionsSticker(videoid, a);
addThumbButton(videoid, a);

var numberOfComments = getNumberOfComments(y);
if(!numberOfComments) {$('#ticker'+a).hide(); niet(w,a, videoid);};

if (numberOfComments > 0) { $('#ticker'+a).hide();
globalnames.push(name);

globallenghts.push(videolength);
    var fileinfo = getSRT(y, name, 'no');  filesobj.push(fileinfo);
try{
 $.ajax({
    type: 'HEAD',
    url: y,
success: function() {
        wel(w, a, y, name, videoid, videolength);
},
error: function() {
       niet(w, a);
}
});
} catch(e) {}; };

c++;
         });




}});
$('.denker').remove();
};
(function() {start();})();


function addPlaysSticker(a, yearplays, red, last5months) {
var colorr = 'gray'; if(last5months < 1) {colorr = 'red'};
$('#playsdenker'+a).hide();
var $playsSticker = $('<a/>',{
    html:  yearplays+' views dit jaar <span style="opacity: 0.4; color: '+colorr+';" id="colorspan">('+last5months+')</span>',
    title: 'Afgelopen jaar is deze video '+yearplays+' keer afgespeeld.',
    href: '#',
    //onmouseover: 'javascript:this.style.transform = "scale(1.08)"',
    //onmouseout: 'javascript:this.style.transform = "scale(1.08)"',
    id:    'playsticker'+a,
    style: 'padding: 7px; color: white; font-weight: bold; background-color: transparent; color: darkgray; position: absolute; right: 37px; top: 25%; z-index:999; margin-left:4%; border-radius: 4px; height: 25px; margin-top: 8px; opacity: 0.8; transition: all 0.15s;'
  });
$playsSticker.click(function() {});
if (yearplays == 1) {$playsSticker.text(yearplays+ ' view dit jaar');};
var toolong = 0;
var lasttwomonths = 0;

$playsSticker.attr('title', last5months+' views in laatste 6 maanden');
if (red == 1) {$playsSticker.css({'color': 'red', display: 'inherit', opacity: 0.7});};
if (last5months < 1 && red > 1) { $playsSticker.css({display: 'inherit',color: 'red', opacity: 0.7});};
var $row = $('.table_cell__title_wrapper')[a];
$playsSticker.appendTo($row);


}


function getYearPlays(videoid, a, created) {
var newvideo = false;
var age = Date.parse(created);
var now = Date.now(); var diff = (now - age);
if (diff < 3830464000) {newvideo = true;};  // = als de video ouder is dan 1,5 jaar


var $playsDenker = $('<a/>',{
    html:  '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="15px" height="15px" viewBox="0 0 128 128" xml:space="preserve"><g><path d="M75.4 126.63a11.43 11.43 0 0 1-2.1-22.65 40.9 40.9 0 0 0 30.5-30.6 11.4 11.4 0 1 1 22.27 4.87h.02a63.77 63.77 0 0 1-47.8 48.05v-.02a11.38 11.38 0 0 1-2.93.37z" fill="#6c87f0" fill-opacity="1"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform></g></svg>',
    title: 'Wordt deze video wel gebruikt?',
    href: '#',
    class: 'denker',
    //onmouseover: 'javascript:this.style.backgroundColor = "red";this.style.transform = "scale(1.08)"',
    //onmouseout: 'javascript:this.style.backgroundColor = "red"; this.style.transform = "scale(1.0)"',
    id:    'playsdenker'+a,
    style: 'padding: 7px; color: white; font-weight: bold; background-color: transparent; position: absolute; right: 10px; top: 25%; z-index:999; margin-left:4%; border-radius: 4px; height: 15px; margin-top: 8px; opacity: 1; height: 25px; opacity:0.25;'
  });
$playsDenker.click(function() {console.log(videoid);});

var $row = $('.table_cell__title_wrapper')[a];
$playsDenker.appendTo($row);
  var dedatum = new Date();
var jaarEerder = new Date();
jaarEerder.setFullYear( jaarEerder.getFullYear() - 1 );
dedatum = dedatum.toISOString().split('T')[0];
jaarEerder = jaarEerder.toISOString().split('T')[0];
var ExportLink;
    $.ajax({
    type: 'GET',

    url: "https://api.vimeo.com/me/videos/stats?group_by=month&start_date="+jaarEerder+"&end_date="+dedatum+"&per_page=60&page=1&filter_videos="
        +videoid+"&sort_by=date&direction=desc&fields=range.start_date%2Crange.end_date%2Cplays%2Cfinishes%2Clikes%2Ccomments%2Cloads%2Cdownloads%2Cwatched"
        +"&csv=/https%3A%2F%2Fapi.vimeo.com%2Fme%2Fvideos%2Fstats%3Fstart_date%3D"+jaarEerder+"%26end_date%3D"+dedatum+"%26fields%3Drange.start_date%2Crange.end_date%2C%2Ccreated_time%2Cplays%2Cfinishes%2Clikes%2Ccomments%2Cloads%2Cdownloads%2Cwatched.mean_percent%26group_by%3Dyear%26per_page%3D15000%26sort_by%3Ddate%2Cdirection%3Dasc",
     beforeSend: function(request) {
    request.setRequestHeader("Authorization", "jwt "+token); request.setRequestHeader('Accept', 'application/vnd.vimeo.*+json;version=3.3');},
success: function(r) { var yearplays;
var playstotal = []; console.log(r.export_link); ExportLink = r.export_link;
//r.forEach(function(g, a) {playstotal.push(g[a].plays)});

var csv;


    try{var count = r.data.length; for(var q=0; q < count; q++) {playstotal.push(r.data[q].plays);};
        var stilte = "0"; for(var w = 0; w < playstotal.length; w++) {if(playstotal[w] == 0) {stilte++}; if(playstotal[w] > 0) {stilte = 0;} };
        var playsave = playstotal;
        playstotal.splice(12);
        if (newvideo == true) {stilte = 0;};
//console.dir(playstotal);
       // console.log("nulmaanden: "+stilte);
        var playstotalyear = playstotal.reduce(add, 0);
        //console.log(playsave);
playsave= playsave.slice(playsave.length-6, playsave.length);
        var quartertotal = playsave.reduce(add, 0);
        //console.log(quartertotal);
        //playstotalyear = playstotalyear;
        var red = 0;
        if(playstotalyear < 1 && newvideo == false) {red = 1;};




        if(stilte > 4 && stilte < 13 && newvideo == false) {red = 0};
        addPlaysSticker(a, playstotalyear, red, quartertotal);} catch(error) {console.log('plays error:'+error);};

},
fail: function(message) {console.log(message);}
});

}

function add(accumulator, a) {
    return accumulator + a;
}
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}



function convertCSVtoSRT(data, form, lenght, a) {


//-----------------------------------VANAF HIER DE CODE OM SRT OM TE ZETTEN -----------------
var file = "";
var timecode = "0";
var comment = "";
var thisline = "";

var totalline = "";
var currentArray;
var date;
var oldnumber = 0;
var digit;
var ordered = {};
var thesecomments = [];
var adobeObject = {"tc":"00:00:00", "comment": "Start voor Adobe Premiere", "utc":"000"};
var totalObjectArray =
    [[
"","","00:00:00","","Start voor Adobe Premiere","","","","000"
    ]];
currentArray = Papa.parse(data);
//file = "1 \r\n";
//file = file+'00:00:00,000 --> 00:00:00,999\r\nStart voor Adobe Premiere \r\n \r\n';


currentArray.data.forEach(function(arr, a) { a++;

if (arr[2] == "00:00:00") {arr[2] = "00:00:01"};
var checker = /^([0-9])/.test(arr[1]);
if(checker) {


var time = "01/01/2011 "+arr[2];
time = Date.parse(time);
if(time == 1293836400000 && a>0) {time = 1293836401000 ; arr[2] = "00:00:01"};
arr[8] = time;
totalObjectArray.push(arr);


totalObjectArray.sort(function(a, b){return a[8] - b[8]});

}});

var position = 1;
totalObjectArray.forEach(function(arr, a) {
thisline = position+"\r\n"+arr[2]+",000 --> "+add2seconds(arr[2])+",999\r\n"+arr[4]+"\r\n \r\n";
file = file + thisline; oldnumber = digit;
position++;

if (a>0) {thesecomments.push(arr[2]+" : "+arr[4]+" \r\n");};

});
allcomments.push(thesecomments.join(""));

return file;
 }

function add2seconds(timecode) {if(timecode.length > 7) {
var arr = timecode.split(':');
if (parseInt(arr[2].replace(':','')) >= 58 && parseInt(arr[0].replace(':','')) != 59) { var eee = "000"+(parseInt(arr[1])+1); eee = eee.slice(-2); arr[1] = eee; arr[2] = "01";};
if (parseInt(arr[2].replace(':','')) >= 58 && parseInt(arr[0].replace(':','')) == 59) {arr[0] = parseInt(arr[0])+1; arr[2] = "00"; arr[1] = "00"} else {
 var qqq = "000"+(parseInt(arr[2])+3); qqq = qqq.slice(-2); arr[2] = qqq;};
var newtimecode = arr[0]+":"+arr[1]+":"+arr[2]; };
return newtimecode;
};


function addVersionsSticker(videoid, b) {

    $.ajax({
         url: "https://vimeo.com/manage/"+videoid+"/services/collaboration",

         type: "GET",
         fail: function(xhr){
       alert('request failed');},
         success: function(a) {
var versionsCount = a.versions.length;
if (versionsCount > 1) {
var $commentCountDiv = $('<div/>',
                         {id: "versiondiv"+a,
                          "z-index": "99999",
                          onclick:"window.open('https://vimeo.com/manage/"+videoid+"/collaboration')",
                          style:"width: auto; height: 25px; border-radius: 4px; margin: 5px; margin-left: 12px; padding: auto; padding-top: 3px; padding-left:9px; padding-right:9px; font-weight: bold; background-color: darkred; color: white; opacity:0.4; display: inline-block; left: 300px; ",
                          html: "versie "+versionsCount});
var $row = $('.table_cell__title')[b];
$commentCountDiv.appendTo($row);
for(var t = 1; t < versionsCount; t++) {
oldVersions[videoid] = a.versions[t].id;
};
};


         }});

};


function opschoonButton() {
var $opschoonLink = $('<a/>',{
    text:  'versies opschonen',
    class: 'blue',
    title: 'verwijder automatisch alle oudste versies van alle video\'s in deze zoekopdracht...',
    href: '#',
    onmouseover: 'javascript:this.style.backgroundColor = "red";',
    onmouseout: 'javascript:this.style.backgroundColor = "darkred";',
    id:    'schoonbutton',
    style: 'padding: 8px; padding-top: 5px; color: white; background-color: darkred; display: block; float: right; z-index:999; margin-left:4%; border-radius: 4px; height: 25px; margin-top: 8px;'
  });
$opschoonLink.click(function() {allesOpschonen();});
var $bar2 = $('.topnav_menu_desktop_main')[0];
if (page == 1) {$opschoonLink.appendTo($bar2);};
};

function thumb3Buttons() {
var $thumb3buttons = $('<a/>',{
    html:  '<b>show</b> thumbnail buttons',
    title: 'Toon de knoppen om de thumbnail aan te passen...',
    href: '#',
    onmouseover: 'javascript:this.style.backgroundColor = "DarkMagenta";',
    onmouseout: 'javascript:this.style.backgroundColor = "BlueViolet ";',
    id:    'thumbsbutton',
    style: 'padding: 8px; padding-top: 5px; color: white; background-color: BlueViolet ; display: block; float: right; z-index:999; margin-left:4%; border-radius: 4px; height: 25px; margin-top: 8px;'
  });
$thumb3buttons.click(function() {if(!showhidethumb) {$thumb3buttons.toggleHTML('<b>hide</b> thumbnail buttons', '<b>show</b> thumbnail buttons'); $('.thumb3button').toggle(); $('.blue').toggle();
        }});



    var $bar2 = $('.topnav_menu_desktop_main')[0];
if (page == 1) {$thumb3buttons.appendTo($bar2);};

var $allThumbsButton = $('<a/>',{
    html:  '&#x27A4; alles op 3sec',
    title: 'Zet alle thumbnails op de 3 seconde-frame... (want daar zit normaal het startscherm, behalve bij de leraren)...',
    href: '#',
    class: 'thumb3button',
    onmouseover: 'javascript:this.style.backgroundColor = "DarkMagenta";',
    onmouseout: 'javascript:this.style.backgroundColor = "DarkOrchid";',
    id:    'thumbsallbutton',
    style: 'padding: 8px; padding-top: 5px; color: white; background-color: DarkMagenta; display: none; float: right; z-index:999; margin-left:1.4%; border-radius: 8px; height: 25px; margin-top: 8px;'
  });
$allThumbsButton.click(function() {setAllThumbnails(resetsecs);});

$allThumbsButton.appendTo($bar2);




};


function allesOpschonen() {
Object.keys(oldVersions).forEach(function (videoid) {
console.log("Begonnen met verwijderen...");
$.ajax({
         url: "https://vimeo.com/manage/"+videoid+"/services/versions/"+oldVersions[videoid],

         type: "DELETE",
     headers: {
    "Host": "vimeo.com",
Connection: "keep-alive",
Pragma: "no-cache",
"Cache-Control": "no-cache",
Origin: "https://vimeo.com",
"X-Requested-With": "XMLHttpRequest",
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
"Content-Type": "application/json",
Accept: "*/*",
Referer: "https://vimeo.com/manage/"+videoid+"/collaboration",
"Accept-Encoding": "gzip, deflate, br",
"Accept-Language": "nl-NL,nl;q=0.9,en-US;q=0.8,en;q=0.7"},

         fail: function(a){
       console.log(videoid+" MISLUKT om te verwijderen"); },
         success: function(a) {console.log(videoid+" gelukt om te verwijderen");}
 });
});
alert("Alle oudste versies zijn verwijderd! Klik nogmaals om voorlaatste versies te verwijderen...");
location.reload();
}

function setThumbnailTo3(videoid, a, secs) {
var qq = $('.table_cell__thumb-wrapper')[a].children[0].children[0].children[0];qq.backgroundPosition = "-150px 0px";
qq.style.backgroundImage = "url('https://loading.io/spinners/coolors/index.palette-rotating-ring-loader.svg')";


$.ajax({
         url: "https://api.vimeo.com/videos/"+videoid+"/pictures",

         type: "POST",
    data:{active: true, time:secs},
    beforeSend: function(request) {
    request.setRequestHeader("Authorization", "jwt "+token);},
    success: function(v) {$('thumb'+a).hide(); qq.style.backgroundImage = "url("+v.sizes[2].link+")";}
});
}

function setAllThumbnails(resetsecs) {

var co = 0;
globalIDs.forEach(function(b,x) {
setThumbnailTo3(b,co, resetsecs); co++;
});}

$(document).on('click', function(a) {try{if(a.toElement.textContent == "Load more…") {setTimeout(function() {page++; start()}, 1200);}} catch(e) {}});






