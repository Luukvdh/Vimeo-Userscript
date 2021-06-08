// ==UserScript==
// @name         HOME PAGE NEWS laat cursussen zien van de laatste tijd
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  try to take over the world!
// @author       You
// @match        *://vimeo.com/$
// @icon         https://www.google.com/s2/favicons?domain=vimeo.com
// @grant        none
// ==/UserScript==

var alreadyfound = [];
var picturestoget = [];
var pakket = 1;
var once = 1;
var g = 0;
      'use strict';
var color = "#000000";


(function() {

    var intr = setInterval(function() {


    if ($( ".video_manager__primary_content_container" ).length)  { console.log("gogo"); clearInterval(intr); gogo();};
  }, 80);
function gogo() { $("body").css("overflow","scroll"); $(".topnav_menu_desktop_main").first().css("width","40%"); $("#topnav2").css("width","550px"); $("a").attr("target","_blank"); $("body").css("overflow","scroll");
    var casus = ".casus {display: inline-block; text-align: left; color: white; font-size: 15pt; padding:0px;height: 62px; min-width: 34%; max-width: 85%; margin:0px; margin-left: 2%; margin-right: 2%;overflow: visible; height:60%; word-break: break-word; overflow-wrap: anywhere; line-height: normal; }";
    var button = ".button {width: 50%;height: 74px;color: #fff; "+
    "padding: 2px 6px;  font-family: 'Lato', sans-serif;  font-weight: 500; position: relative: top:0px; left:0px;  background: transparent;"+
    "cursor: pointer;  transition: all 0.3s ease;  position: relative;  display: inline-block;"+
    "outline: none;} .button:hover {filter: grayscale(0%) brightness(1.8);}";
var containerfx = '.containerfx {display":"flex","align-items":"center","flex-wrap":"wrap","width":"100%";}';
    var pic_css = ".pic {height:70px; z-index:-1; position: static;opacity:0.0; };";

    addGlobalStyle(casus);
    addGlobalStyle(pic_css);
    addGlobalStyle(button);
                 addGlobalStyle(containerfx);
 //$(".video_manager__primary_content_container").children().remove();
$(".video_manager__primary_content_container").css("margin","40px");
//var $zoekbalk = $("<input style=\"width:\'30%\'; height:\'35px\'; text-align:\'center\';margin:\'auto\';\">").attr("id","zoekbalk");
   //$zoekbalk.prependTo($(".video_manager__primary_content_container").first());
       
    $(".video_manager__primary_content_container").addClass("containerfx");
                 $("a").attr("onclick",'$(".video_manager__primary_content_container").removeClass("containerfx")');

        
        var page = 1;
        var query = "po";
        var results = [];
if(getThem(1)) {};
if(getThem(2)) {};
if(getThem(3)) {};

$("#topnav2").on("input", function(i) {zoek(i.currentTarget.value);});

$("#topnav2").focus();
                    


                   



function zoek(i) {

$(".button").each(function(nr, el) { console.log($(el).children().eq(2).text()); if (!$(el).children().eq(2).text().toLowerCase().includes(i.toLowerCase())) { $(el).hide(); } else {$(el).show();}});
   
};






function getThem(q) {
var token = vimeo.config.api.jwt; console.log(token);
if(once >= q) {return;};
    once++;

            $.ajax({
                url: "https://api.vimeo.com/me/videos?per_page=100&fields=name,pictures.uri&page="+q,

                type: "GET",
                async: true,
                xhrFields: {

                },
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", "jwt "+token); request.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.4.1"); request.setRequestHeader("Content-Type", "application/json");
                    // request.setRequestHeader("Referer", "https://vimeo.com/manage/videos/search/"+zipname);
                },

                error: function() {console.log("error bij api vimeo regel 574"); return true;},
                success: function(a) {

                    for(let r of a.data) {
                        var name =r.name;



                        name = name.substring(0,name.lastIndexOf("-"));
                        console.log(name);
                        if(alreadyfound.indexOf(name) < 0 && name.length > 6) {alreadyfound.push(name); picturestoget.push(r.pictures.uri);};};if(q==3){setTimeout(startPics(),800);};return true; }});
};

function startPics() {
for(var e = 0; e < alreadyfound.length; e++) {if(addPics(e)) {var bb = 1;};};};

function addPics(e) {var token = vimeo.config.api.jwt; console.log(alreadyfound.length);


                        var teststr = alreadyfound[e].substring(0,2);
                        console.log(teststr);
                        switch(teststr) {
                            case "PE": pakket = 2; break;
                            case "PO": pakket = 2; break;
                            case "LE": pakket = 3; break;
                            case "SL": pakket = 3; break;
                            default: pakket = 1; break;};
                        switch(pakket) {
                            case 1: color = "#206bb3"; break;
                            case 2: color = "#208765"; break;
                            case 3: color = "#932a6b"; break;};
                        var $pane = $("<div\>");
                        $pane.addClass('button');

                        var $pic = $("<img>",{id: 'pic'+e});
                        $pic.addClass("pic");

                        var $aa = $("<a/>").attr({id:"casus"+e,"href":"https://vimeo.com/manage/videos/search/"+encodeURI(alreadyfound[e])+"?","target":"_blank"});

                        $aa.addClass("casus");
                        $aa.text(alreadyfound[e]);
                        $aa.css("color","white");$pane.css("background-image","linear-gradient(to left,"+color+" 60%,#353839 100%)");
                     
$pane.attr("onClick","window.open('https://vimeo.com/manage/videos/search/"+encodeURI(alreadyfound[e])+"?', '_blank');");
                        $aa.appendTo($pane);$pic.prependTo($pane);
                    


                        $pane.prependTo($(".video_manager__primary_content_container").first());


                        

$.ajax({
                url: "https://api.vimeo.com/"+picturestoget[e],

                type: "GET",
                async: true,
                xhrFields: {

                },
                beforeSend: function(request) {
                    request.setRequestHeader("Authorization", "jwt "+token); request.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.4.1"); request.setRequestHeader("Content-Type", "application/json");
                    // request.setRequestHeader("Referer", "https://vimeo.com/manage/videos/search/"+zipname);
                },

                error: function() {console.log("error bij api vimeo regel 574");}, fail: function() {},
}).then(function(pic) {console.log(pic); console.log(pic.sizes[3].link);  $("#pic"+e).attr("src",pic.sizes[3].link);$("#pic"+e).fadeTo('slow', 1); return true;});


                   };



function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}}})();
