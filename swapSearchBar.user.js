// ==UserScript==
// @name        ZOEKBALK E-Wise (Vimeo)
// @namespace   ewise
// @include     https://vimeo.com/*
// @version     1.2
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js


// ==/UserScript==
// Author:      Luuk van den Hoogen
// Date:     2019-11-augustus

(function() {
    'use strict';

    $('.topnav_menu_search_input').attr('placeholder', 'Zoek hier je E-WISE cursus...');
    document.querySelector('.topnav_menu_search_input').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
    e.preventDefault();
   var zoekopdracht = e.target.value;
   zoekopdracht = encodeURI(zoekopdracht);
   location.href = 'https://vimeo.com/manage/videos/search/'+zoekopdracht;
    }
});
})();