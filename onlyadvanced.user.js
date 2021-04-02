// ==UserScript==
// @name         Only Advanced Please!
// @namespace    https://vimeo.com
// @version      1.7
// @description  try to take over the world!
// @author       You
// @match        https://vimeo.com/manage/videos/*
// @icon         https://www.google.com/s2/favicons?domain=vimeo.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
var link = location.href;
    if(!link.includes("search")) {
link = link.replace("manage/videos/","manage/");
link = link + "/general";
location.href = link;};


})();
