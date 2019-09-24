// ==UserScript==
// @name        Redactie E-WISE Vimeo script
// @namespace   ewise
// @include     https://vimeo.com/manage/*
// @version     v1.1
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js



// ==/UserScript==
// Author:      Luuk van den Hoogen
// Date:     2019-15-september

$.noConflict();


// =================== START SEARCH ===========================

function startSearch() {


    var query = window.location.href.replace('https://vimeo.com/manage/videos/search/','');


    var direction = vimeo.config.video_manager.initial_state.sort.direction;
    var sort = vimeo.config.video_manager.initial_state.sort.type;
    var sorttype = vimeo.config.video_manager.initial_state.presentation.layout;
    if (sort == "lastUserActionEventDate") {sort = "last_user_action_event_date"};
    if ((direction != "desc" || sort != "date") || (sorttype =='GRID_LAYOUT')) {



$.ajax({
        type: 'POST',
        url: "https://vimeo.com/settings?action=set_video_manager_sort_pref",
    data: "sort[type]=date&sort[direction]=desc&token="+vimeo.xsrft,
    beforeSend: function(request) {
    request.setRequestHeader("action", "set_video_manager_sort_pref");
        request.setRequestHeader("Authorization", "jwt "+vimeo.config.api.jwt);
    },
success:  function() {console.log('Sorting is omgezet');},
         error: function(a) {console.log('fout bij omzetten sorting...'); console.log(a);}
    });

$.ajax({
        type: 'POST',
        url: "https://vimeo.com/settings?action=set_video_manager_layout_pref",
    data: "layout=LIST_LAYOUT&token="+vimeo.xsrft,
    beforeSend: function(request) {
    request.setRequestHeader("action", "set_video_manager_sort_pref");
        request.setRequestHeader("Authorization", "jwt "+vimeo.config.api.jwt);
    },
success:  function() {console.log('Layout is omgezet'); location.reload();},
         error: function(a) {console.log('fout bij omzetten sorting...'); console.log(a);}
    });

};
    var token;
    var allids = "";
    var idarray = [];
    var lengtharray = [];

    var countresults = 0;
    var zipname = decodeURIComponent(query).replace('#','');
    $.ajax({
        url: "https://api.vimeo.com/users/18516679/videos",
        data:"fields=uri,duration&per_page=100&sort="+sort+"&direction="+direction+"&query="+query,
        type: "GET",
        async: true,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "jwt "+vimeo.config.api.jwt); request.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.4.1"); request.setRequestHeader("Content-Type", "application/json");},
        fail: function(a){
            console.log('request failed');},
        success: function(a) {console.dir(a);
                              a.data.sort(function(a, b) {
                                  return a.name - b.name});





                              a.data.forEach(function(z,a) {
                                  countresults++;
                                  var uri = z.uri;
                                  var videoid = uri.replace('/videos/','');
                                  idarray.push(videoid);
                                  lengtharray.push(z.duration);


                                  allids = allids+"/videos/"+videoid+",";

                              });
                              allids = allids.substring(0,(allids.length-1));


                              getStats(allids, countresults, idarray, lengtharray);
                             }});
    $(document).on('click', function(a) {if(a.toElement.textContent == "Load more…") {setTimeout(function() {jQuery( "[name='playsticker']" ).remove(); startSearch()}, 1000);}});
}
// =================== START FOLDER ===========================

function startFolder() {


    var query = window.location.href.replace('https://vimeo.com/manage/folders/',''); console.log(query);


    var direction = vimeo.config.video_manager.initial_state.sort.direction;
    var sort = vimeo.config.video_manager.initial_state.sort.type;
    var sorttype = vimeo.config.video_manager.initial_state.presentation.layout;
    if (sort == "lastUserActionEventDate") {sort = "last_user_action_event_date"};
    if ((direction != "desc" || sort != "date") || (sorttype =='GRID_LAYOUT')) {



$.ajax({
        type: 'POST',
        url: "https://vimeo.com/settings?action=set_video_manager_sort_pref",
    data: "sort[type]=date&sort[direction]=desc&token="+vimeo.xsrft,
    beforeSend: function(request) {
    request.setRequestHeader("action", "set_video_manager_sort_pref");
        request.setRequestHeader("Authorization", "jwt "+vimeo.config.api.jwt);
    },
success:  function() {console.log('Sorting is omgezet');},
         error: function(a) {console.log('fout bij omzetten sorting...'); console.log(a);}
    });

$.ajax({
        type: 'POST',
        url: "https://vimeo.com/settings?action=set_video_manager_layout_pref",
    data: "layout=LIST_LAYOUT&token="+vimeo.xsrft,
    beforeSend: function(request) {
    request.setRequestHeader("action", "set_video_manager_sort_pref");
        request.setRequestHeader("Authorization", "jwt "+vimeo.config.api.jwt);
    },
success:  function() {console.log('Layout is omgezet'); location.reload();},
         error: function(a) {console.log('fout bij omzetten sorting...'); console.log(a);}
    });

};
    var token;
    var allids = "";
    var idarray = [];
    var lengtharray = [];

    var countresults = 0;
    var zipname = decodeURIComponent(query).replace('#','');
    $.ajax({
        url: "https://api.vimeo.com/users/18516679/projects/"+query+"/videos?fields=created_time%2Cduration%2Cfile_transfer%2Clink%2Clast_user_action_event_date%2Cname%2Cpictures.uri%2Cprivacy%2Creview_page%2Curi&per_page=100&sort=date&direction=desc",
        //data:"fields=created_time%2Cduration%2Cfile_transfer%2Clink%2Clast_user_action_event_date%2Cname%2Cpictures.uri%2Cprivacy%2Creview_page%2Curi&per_page=100&sort=date&direction=desc",
        type: "GET",
        async: true,
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "jwt "+vimeo.config.api.jwt); request.setRequestHeader("Accept", "application/vnd.vimeo.*+json;version=3.4.1"); request.setRequestHeader("Content-Type", "application/json");},
        fail: function(a){
            console.log('request failed');},
        success: function(a) {console.dir(a);
                              //a.data.sort(function(a, b) {
                                  //return a.name - b.name});





                              a.data.forEach(function(z,a) {
                                  countresults++;
                                  var uri = z.uri;
                                  var videoid = uri.replace('/videos/','');
                                  idarray.push(videoid);
                                  lengtharray.push(z.duration);


                                  allids = allids+"/videos/"+videoid+",";

                              });
                              allids = allids.substring(0,(allids.length-1));


                              getStats(allids, countresults, idarray, lengtharray);
                             }});
    $(document).on('click', function(a) {if(a.toElement.textContent == "Load more…") {setTimeout(function() {jQuery( "[name='playsticker']" ).remove(); startFolder()}, 1000);}});
}

function getStats(videoid, a, idarray, lengtharray) {
var newjwt;
    $.ajax({
        type: 'GET',

        url: "https://vimeo.com/manage/342965848/services/stats",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "jwt "+vimeo.config.api.jwt); request.setRequestHeader('Accept', 'application/vnd.vimeo.*+json;version=3.3');},
        success: function(r) {console.dir(r); newjwt = r.jwt; getStats2(videoid, a, idarray, lengtharray, newjwt); }});  }


function getStats2(videoid, a, idarray, lengtharray, newjwt) {

    for (var q = 0; q < a; q++) {
        var xpath = "/html/body/div[1]/div[2]/main/div/div/div[1]/div[1]/div/div[2]/div/div/div/div[1]/section/div/div[2]/div/div/div[1]/div/table/tbody/tr["+(q+1)+"]/td[3]/div";
        var elem = getElementByXpath(xpath);
        var datum = new Date();
        datum = datum.toISOString().split('T')[0];



        var $spinnertje = $('<a/>',{
            html:  '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="15px" height="15px" viewBox="0 0 128 128" xml:space="preserve"><g><path d="M75.4 126.63a11.43 11.43 0 0 1-2.1-22.65 40.9 40.9 0 0 0 30.5-30.6 11.4 11.4 0 1 1 22.27 4.87h.02a63.77 63.77 0 0 1-47.8 48.05v-.02a11.38 11.38 0 0 1-2.93.37z" fill="#6c87f0" fill-opacity="1"/><animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1800ms" repeatCount="indefinite"></animateTransform></g></svg>',
            title: 'Wordt deze video wel gebruikt?',
            href: '#',
            class: 'denker',
            id:    'playsdenker'+a,
            style: 'padding: 7px; color: white; font-weight: bold; background-color: transparent; position: absolute; right: 10px; top: 25%; z-index:999; margin-left:7%; border-radius: 4px; height: 15px; margin-top: 8px; opacity: 1; height: 25px; opacity:0.25;'
        }); $spinnertje.appendTo(elem);
    };
    //             ---- STATS OM EEN WEER TE GEVEN ----------
    $.ajax({
        type: 'GET',

        url: "https://api.vimeo.com/me/videos/stats?start_date=2012-08-16&end_date="+datum+"&group_by=video&filter_videos="+videoid+"&fields=plays,finishes,watched,loads&per_page=100",
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "jwt "+newjwt); request.setRequestHeader('Accept', 'application/vnd.vimeo.*+json;version=3.3');},
        success: function(r) { console.log(r); $('.denker').hide();



                              for(var number = 0; number<a; number++) {


                                  var xpath = "/html/body/div[1]/div[2]/main/div/div/div[1]/div[1]/div/div[2]/div/div/div/div[1]/section/div/div[2]/div/div/div[1]/div/table/tbody/tr["+(number+1)+"]/td[3]/div";
                              var elem = getElementByXpath(xpath);
                              var length_in_secs = lengtharray[number];
                              var mins = Math.floor(length_in_secs/60);
                              var secs = length_in_secs-(Math.floor(length_in_secs/60)*60);
                              if (secs < 10) {secs = "0"+secs};
                              var timecode = mins+":"+secs;




                              var plays = r.data[number].plays;
                              var finishes = r.data[number].finishes;
                              var loads = r.data[number].loads;
                              var skipped = parseInt(loads) - parseInt(plays);
                              var mean_watched = r.data[number].watched.mean_percent;
                              var percentage_int = mean_watched / 100;
                                  var $timeSticker = $('<div/>',{
                                      html: '<span style="color: darkgray; font-weight: normal; text-align: left;">'+timecode+'</span>',
                                      style: 'text-align: right; position: absolute; right: 240px;'

                                  }).appendTo(elem);



                                  var $playsSticker = $('<a/>',{
                                      html:  '</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; views: <span style="color: gray; font-weight: bold;">'+plays+'&nbsp;&nbsp;</span> watched:  <span id="percentagespan'+number+'" style="font-weight: bold;">'+mean_watched+'%</span><a href="https://www.vimeo.com/manage/'+idarray[number]+'/stats"><svg width="14px" height="14px" style="opacity: 0.5; margin-left: 10px; margin-right: 10px;" viewBox="0 0 17 17"><path fill="gray" d="M3 17a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1zm4 0a1 1 0 0 1-1-1V8a1 1 0 1 1 2 0v8a1 1 0 0 1-1 1zm4 0a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v5a1 1 0 0 1-1 1zm4 0a1 1 0 0 1-1-1V9a1 1 0 0 1 2 0v7a1 1 0 0 1-1 1z" fill="#1a2e3b"></path><path d="M11 7a1 1 0 0 1-.71-.29L6 2.41l-4.29 4.3A1.004 1.004 0 0 1 .29 5.29l5-5a1 1 0 0 1 1.41 0l4.3 4.3L15.29.3a1 1 0 0 1 1.41 1.41l-5 5A1 1 0 0 1 11 7z" fill="#1a2e3b"></path></svg></a>',
                                      title:
                                      'finished: '+finishes+' \n(= '+Math.round((finishes/plays)*100)+'% zag het einde van de video)',
                                      href: '#',
                                      name: 'playsticker',
                                      id:    'playsticker'+a,
                                      style: 'text-align: left; position: absolute; right: 30px; width: 200px;'
                                  }); $playsSticker.appendTo(elem);
                                  if (plays > 6 && !elem.innerText.includes('Preview') && !elem.innerText.includes('preview')) {$('#percentagespan'+number).css({color: 'rgb(' + ((100 - mean_watched) *8.56) +',' + (mean_watched *2.0) +',0)'});};


                              }


                             },
        fail: function(message) {console.log(message);}
    });





}

(function() {
    'use strict';
var url = location.href;
if (url.includes('search')) {startSearch();};
if (url.includes('folders')) {startFolder();};




})();

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

$('#search-input').bind("enterKey",function(e){
   e.preventDefault();
   console.log(e);
   var searchstring = e.target.defaultValue;
   location.href = "https://vimeo.com/manage/videos/search/"+encodeURIComponent(searchstring);
});
$('#search-input').keydown(function(e){

    if(e.keyCode == 13)
    {
        $(this).trigger("enterKey");
    }
});


