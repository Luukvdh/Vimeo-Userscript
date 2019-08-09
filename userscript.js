// ==UserScript==
// @name        Luuk's Vimeo gemaksfuncties
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

var links = new Array;
var globalnames = [];
var globallenghts = [];
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
$input.prependTo($('body'));

function downloadAllSrts() {

teller=1;
var zip = new JSZip();
zipname = decodeURIComponent(query).replace('#','');

var d = new Date();
var mm = d.getMonth();
var maanden = ['niks','jan','feb','maart','april','mei','juni','juli','aug','sep','oct','nov','dec'];
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
         success: function(a) {console.log("upload link verkrijgen gelukt"); uploadThumbnail(videoid, videoLink, a.link);},
         error: function(a) {console.log('fout bij opvragen video-info voor thumbnail...');}
    });

}


// --------------------------------------------------------------------- upload thumbnail
function uploadThumbnail(videoid, videoLink, cloudlink) {

console.log("Ik ben al bij upload thumbnail!");
console.log("videoid: "+videoid);
console.log("content-type: "+contenttype);
console.log("cloudlink: "+cloudlink);
var data = reader.result;
data = data.replace("image/jpeg;base64,","");
data = data.replace("image/png;base64,","");
console.dir(reader);
$.ajax({
        type: 'PUT',
        url: cloudlink,
    content: {
            "mimeType": contenttype,
            "size": 17934,
            "encoding": "base64",
            "text": data},
    beforeSend: function(request) {
    request.setRequestHeader("Accept", "*/*");

    request.setRequestHeader("Content-Type", contenttype);

    },
success:  function(a) {console.log(a);},
         error: function(a) {console.log('fout bij uploaden van de thumbnail...'); console.log(a);}
    });

}
function addThumbnailButton(videoid, a) {

var $row = $('.table_cell__title_wrapper')[a];


var $link4 = $('<a/>',{
    html:  'thumbnail',
    href: '#',
    id:    'thumbnail'+a,
    style: 'padding: 6px; color: white; background-color: #19B7EA; float: right; z-index:999; margin-left:4%; border-radius: 4px; display: inline;'
  });
$link4.on('click', function() {

    $('input[id=fileid]').trigger('click'); $('input[id=fileid]').on('change', function() { console.dir($("#fileid")[0].files[0]);

reader.readAsDataURL($("#fileid")[0].files[0]); console.log(reader);

contenttype = $("#fileid")[0].files[0].type; contentlength = $("#fileid")[0].files[0].length;  console.log(reader);getVideoInfoForThumbnail(videoid);});});
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
var responsetextsrt = convertCSVtoSRT(responsetext);
name = req.name;
   return responsetextsrt;
};


var $downloadAllLink = $('<a/>',{
    text:  'download alle SRT\'s',
    href: '#',
    onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
    onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";',
    id:    'allbutton',
    style: 'padding: 8px; padding-top: 5px; color: white; background-color: #19B7EA; display: block; float: right; z-index:999; margin-left:4%; border-radius: 4px; height: 25px; margin-top: 8px;'
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
    id: "x"+a,
    title: allcomments[finds],
    id:    'cross',
    style: 'padding: 6px; color: #ee7600; background-color: transparent; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px; line-height:0.5; font-weight: bold;'
  }); $xmark.appendTo($row);


if (numberOfComments > 0) {





var $link2 = $('<a/>',{
    html:  'SRT (<span style="color:white; font-weight: bolder;">'+numberOfComments+'</span>)',
    href: '#',
    onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
    onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";',
    title: allcomments[finds],
    id:    'srt'+a,
    style: 'padding: 6px; color: white; background-color: #19B7EA; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px;'
  });

var $link3 = $('<a/>',{
    text:  'review page',
    href: '#',
    onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
    onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";',
    id:    'reviewpage',
    style: 'padding: 6px; color: white; background-color: #19B7EA; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px;'
  });




$link2.on('click', function() {
var blob = new Blob([getSRT(yy, name)], {type: "text/plain;charset=utf-8"});

saveAs(blob, name+".srt");


});
$link3.on('click', function() {openReviewPage(r);});

$link2.appendTo($row);
$link3.appendTo($row);
};

};
function openReviewPage(link) {window.open(link);}
function niet(r, a, videoid) {
var $row = $('.table_cell__title_wrapper')[a];
var $link5 = $('<a/>',{
    text:  '✓',
    href: '#',
    id: "no"+a,
    id:    'reviewpage',
    style: 'padding: 6px; color: green; background-color: transparent; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px;'
  }); $link5.appendTo($row);



};
function addThumbButton(videoid, a) {
    var $row = $('.table_cell__title_wrapper')[a];
var $settn = $('<a/>',{
    text:  'thumb op 3sec',
    href: '#',
    name: "thumb3button",
    class: "thumb3button",
    onmouseover: 'javascript:this.style.backgroundColor = "#0088CC";',
    onmouseout: 'javascript:this.style.backgroundColor = "#19B7EA";',
    id:    'thumb'+a,
    style: 'padding: 6px; color: white; background-color: #19B7EA; display: block; float: right; z-index:999; margin-left:1%; border-radius: 4px; display: none;'
  });
$settn.on('click', function() {setThumbnailTo3(videoid, a);});
$settn.appendTo($row);
}



(function() {

    'use strict';

addGlobalStyle('.checkbox > span { color: #34495E; padding: 0.5rem 0.25rem; }');
addGlobalStyle('.checkbox > input { height: 25px;width: 25px;-webkit-appearance: none;-moz-appearance: none;-o-appearance: none;appearance: none;border: 1px solid #34495E;border-radius: 4px;outline: none;transition-duration: 0.3s;background-color: #41B883;cursor: pointer; }');
addGlobalStyle('.checkbox > input:checked {border: 1px solid #41B883; background-color: #34495E;}');
addGlobalStyle('.checkbox > input:checked + span::before {content: "\u2713"; display: block; text-align: center; color: #41B883; position: absolute; left: 0.7rem; top: 0.2rem;}');
addGlobalStyle('.checkbox > input:active {border: 2px solid #34495E;}');
var total = {};

opschoonButton();
thumb3Buttons();

query = window.location.href.replace('https://vimeo.com/manage/videos/search/','');
zipname = decodeURIComponent(query).replace('#','');
totalfile = "oO0OoO0OoO0Oo  "+zipname.toUpperCase()+" (correcties) oO0OoO0OoO0Oo \r\n \r\n \r\n \r\n";
console.dir(vimeo.config);
    token = vimeo.config.api.jwt;


    //AJAX Request search results:

    $.ajax({
         url: "https://api.vimeo.com/users/18516679/videos?fields=created_time%2Cduration%2Cfile_transfer%2Clink%2Clast_user_action_event_date%2Cname%2Cpictures.uri%2Cprivacy%2Creview_page%2Curi&per_page=48&sort=date&direction=desc&query="+query,
data:"fields=created_time%2Cduration%2Cfile_transfer%2Clink%2Clast_user_action_event_date%2Cname%2Cpictures.uri%2Cprivacy%2Creview_page%2Curi&per_page=48&sort=date&direction=desc&query="+query,
         type: "GET",
     beforeSend: function(request) {
    request.setRequestHeader("Authorization", "jwt "+token); request.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.4.1"); request.setRequestHeader("Content-Type", "application/json"); request.setRequestHeader("Referer", "https://vimeo.com/manage/videos/search/"+zipname); },
         fail: function(a){
       alert('request failed');},
         success: function(a) {console.dir(a);
a.data.sort(function(a, b) {
   return a.name - b.name}); c = 0;
  a.data.forEach(function(z,a) {
var w;
var y;
//var name;
var videoid;
var videolength;
         w = (z.review_page.link);
name = z.name;

         y = w+"/download_notes_csv";
videoid = z.uri;
videoid = videoid.replace("/videos/", "");
videolength = z.duration;
getEmbed(videoid, a);
addThumbnailButton(videoid, a);

addVersionsSticker(videoid, a);
addThumbButton(videoid, a);

var numberOfComments = getNumberOfComments(y);
if(!numberOfComments) {niet(w,a, videoid);};

if (numberOfComments > 0) {
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
         }); }});

})();


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
                          style:"width: auto; height: 25px; border-radius: 4px; margin: 5px; margin-left: 12px; padding: auto; padding-top: 6px; padding-left:9px; padding-right:9px; font-weight: bold; background-color: darkred; color: white; float: right; opacity:0.7;",
                          html: "versie "+versionsCount});
var $row = $('.table_cell__title_wrapper')[b];
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
    title: 'verwijder automatisch alle oudste versies van alle video\'s in deze zoekopdracht...',
    href: '#',
    onmouseover: 'javascript:this.style.backgroundColor = "red";',
    onmouseout: 'javascript:this.style.backgroundColor = "darkred";',
    id:    'schoonbutton',
    style: 'padding: 8px; padding-top: 5px; color: white; background-color: darkred; display: block; float: right; z-index:999; margin-left:4%; border-radius: 4px; height: 25px; margin-top: 8px;'
  });
$opschoonLink.click(function() {allesOpschonen();});
var $bar2 = $('.topnav_menu_desktop_main')[0];
$opschoonLink.appendTo($bar2);
};

function thumb3Buttons() {
var $thumb3buttons = $('<a/>',{
    text:  'show thumbnail buttons',
    title: 'toon de knoppen om de thumbnail aan te passen',
    href: '#',
    onmouseover: 'javascript:this.style.backgroundColor = "red";',
    onmouseout: 'javascript:this.style.backgroundColor = "darkred";',
    id:    'thumbsbutton',
    style: 'padding: 8px; padding-top: 5px; color: white; background-color: darkred; display: block; float: right; z-index:999; margin-left:4%; border-radius: 4px; height: 25px; margin-top: 8px;'
  });
$thumb3buttons.click(function() {if(!showhidethumb) {$('.thumb3button').show();}});
var $bar2 = $('.topnav_menu_desktop_main')[0];
$thumb3buttons.appendTo($bar2);
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
       console.log(videoid+" MISLUKT om te verwijderen"); console.dir(a);},
         success: function(a) {console.log(videoid+" gelukt om te verwijderen");}
 });
});
alert("Alle oudste versies zijn verwijderd! Klik nogmaals om voorlaatste versies te verwijderen...");
location.reload();
}

function setThumbnailTo3(videoid, a) {
var qq = $('.table_cell__thumb-wrapper')[a].children[0].children[0].children[0];
qq.style.backgroundImage = "url('https://loading.io/spinners/camera/index.svg')";
qq.backgroundSize = 'contain';

$.ajax({
         url: "https://api.vimeo.com/videos/"+videoid+"/pictures",

         type: "POST",
    data:{active: true, time:'3.5'},
    beforeSend: function(request) {
    request.setRequestHeader("Authorization", "jwt "+token);},
    success: function(v) {$('thumb'+a).hide(); qq.style.backgroundImage = "url("+v.sizes[2].link+")";}
});
}