// ==UserScript==
// @name        ZOEKBALK E-Wise (Vimeo)
// @namespace   ewise
// @include     https://vimeo.com/*
// @version     1.5
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js


// ==/UserScript==
// Author:      Luuk van den Hoogen
// Date:     2019-11-augustus

(function() {
    'use strict';
$("#topnav_menu_search_omnisearch").unbind();
    $("#topnav-search_search_form").remove();
    $("<input id='topnav2'>").appendTo($("#topnav_menu_search_omnisearch"));
    $('#topnav2').attr('placeholder', 'Zoek hier je E-WISE cursus...');
    $('#topnav2').css({'width':'100%','height':'50px','border-radius': '5px','padding':'5px','padding-left':'10px','font-size':'12pt'});
    document.querySelector('#topnav2').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
    e.preventDefault();
   var zoekopdracht = e.target.value;
   zoekopdracht = encodeURI(zoekopdracht);
   location.href = 'https://vimeo.com/manage/videos/search/'+zoekopdracht;
    }
});
})();
