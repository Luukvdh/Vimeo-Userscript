// ==UserScript==
// @name         Uitroeptekens ordenen
// @version      1.1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @description  quality page EWISE, click ! to show only courses with exclamation marks
// @author       Luuk
// @match        https://www.e-wise.nl/quality/*
// @match        https://learn.pe-academy.nl/quality/*
// @match        https://www.po-online.nl/quality/*
// @match        https://www.cme-online.nl/quality/*
// @grant        none
// ==/UserScript==
var titles = [];
var links = [];
var linknumbers = [];
var temploc = window.location.href;
var table = $(".views-table")[0];
var backgroundbool = true;
var t;
var ssvheader;
try {
    var domain = temploc.substring(0, temploc.indexOf('quality'));
    console.log(domain); } catch(e) {temploc = "http://www.ewise.nl";};
function getResults(n, link) {

    titles.forEach(function(element) {element.style.backgroundColor = "inherit"; element.children[0].style.textDecoration = "inherit"; element.children[0].style.color = "#0074BD";});
    titles[n].style.backgroundColor = "#777777";
    titles[n].children[0].style.textDecoration =  "none";
    titles[n].children[0].style.color =  "white";







    $("#frame1").attr({"src": domain+"quality/course/"+links[n], "target": "region-content"});

    $("#frame1").on('load', function() {$("#frame1").contents().find("#admin-menu-wrapper").remove(); $("#frame1").contents().scrollTop(400); $("#frame1").contents().find(".pane-title").eq(3).html($("#frame1").contents().find("#page-title").eq(0).text()); });

}

function showMarks(markbool, callback) {
    backgroundbool = markbool;
    $('#page-title').css({color: "red", "font-size": "21pt"});
    if(markbool) {$('#page-title').text("Uitroeptekens overzicht");};
    if(!markbool) {$('#page-title').text("Slecht Scorende Vragen overzicht");};
    $('<div />', {
        name: 'placeholder1',
        id: 'placeholder1',
        style: 'width: 100vw; height: 100vh;'
    }).appendTo('body');

    $('<iframe />', {
        name: 'frame1',
        id: 'frame1',
        frameborder: 1,
        src: 'about:blank',
        style: 'border: 5px; width: 100vw; height: 40vh; position: fixed; bottom: 0px; z-index: 55;',
    }).appendTo('body');


    var n = 0;

    $('table > tbody  > tr').each(function(a) {

        // Uitroeptekens
        if(markbool) {if(!$(this).find('td').eq(6).text().includes('!')) {this.remove();}
                      else {
                          var title = $(this).find('td').eq(0);
                          titles.push(title[0]);
                          var exm = $(this).find('td').eq(6);

                          var link = $(this).find('td').eq(0).html();
                          links.push(link);
                          link = link.substring(link.indexOf("course")+7, link.indexOf("course")+11);
                          linknumbers.push(link);
                          var t = n;
                          exm.html("<a href='#' style='color: red; cursor: pointer; id='link"+n+"'>&nbsp;<u><b></b></u>!&nbsp;</a>");

                          exm.on('click', function() {getResults(t,link);});


                          n++;

                      } ;

                      titles.forEach(function(el, g) {


                          var ahref = el.children[0];
                          $('ahref').attr({target: "frame1",id: "title"+g});
                          console.log(g);
                          $('#title'+g).unbind();
                          $('#title'+g).click(function() {console.log("HIT!"); this.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"}); $('#frame1').scrollTop += 300; getResults(g);

                                                         });



                      });};




        if(!markbool) {
            var title2 = $(this).find('td').eq(0);
            titles.push(title2[0]);
            var exm2 = $(this).find('td').eq(6);

            var linkk = $(this).find('td').eq(0).html();
            links.push(linkk);
            linkk = linkk.substring(linkk.indexOf("course")+7, linkk.indexOf("course")+11);
            linknumbers.push(linkk);
            var ttt = n;
            exm2.html("<a href='#' style='color: red; cursor: pointer; id='link"+n+"'>&nbsp;<u><b></b></u>!&nbsp;</a>");

            exm2.on('click', function() {getResults(ttt,linkk);});


            n++;

        } ;
        console.log("lengte: "+links.length);
        titles.forEach(function(el, g) {



            $(el).find("a").eq(0).attr({target: "frame1",id: "title"+g});
            console.log(g);
            $('#title'+g).unbind();
            $('#title'+g).click(function() {console.log("HIT!"); this.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"}); $('#frame1').scrollTop += 300; getResults(g);

                                           });



        });






    });
    var counter = 1;
    linknumbers.forEach(function(link, vn) {
        var countclass = 0;
        var countlowscore = 0;
        var page = $.ajax({
            type: 'POST',
            url: domain+"quality/course/"+link,
            success: function(a) {console.log("page downloaded"); countlowscore = (a.match(/ views-field-wrong-percentage/g) || []).length; countclass = (a.match(/ flag-action /g) || []).length; $('table > tbody  > tr').eq(vn).find('td').eq(6).text(countclass); ssvheader.innerHTML = "("+(parseInt(counter)+1)+"/"+table.rows.length+")";  $('table > tbody  > tr').eq(vn).find('td').eq(7).text(Math.max(0,(countlowscore-1))); counter++; if(parseInt(counter)+1 > table.rows.length) {ssvheader.innerHTML = "SSV"; callback();}; },
            error: function(a) {console.log('fout bij page download...');}
        });


    });
}

(function() {
    var rr = 1;
    $(table).find('tr').each(function(v){
        if(v>0) {
            var trow = $(this);
            var trr = $('<td/>',{id: 'ssv'+v});
            trow.append(trr);

            rr += 1;} else {var troww = $(this); var th = $('<th/>'); troww.append(th);};

    });


    t = $('table > thead  > tr').find('th').eq(6)[0];
    ssvheader = $('table > thead  > tr').find('th').eq(7)[0];
    try { ssvheader.innerHTML = "<a style='cursor: pointer;' id='ssdclicker' onClick=''><u>SSV</u></a>";   t.innerHTML = "<a style='cursor: pointer;' id='markclicker' onClick=''><u>!</u></a>"; } catch(e) {};
    $('#markclicker').click(function() {showMarks(true, function() {$('#markclicker').unbind(); $('#ssdclicker').unbind(); $('#markclicker').click(function() {location.reload();}); $('#ssdclicker').click(function() {location.reload();}); if(!backgroundbool) {sort_table($(".views-table")[0], 7);};});});
    $('#ssdclicker').click(function() {showMarks(false, function() {$('#markclicker').unbind(); $('#ssdclicker').unbind(); $('#ssdclicker').click(function() {location.reload();}); $('#markerclicker').click(function() {location.reload();}); if(!backgroundbool) {sort_table($(".views-table")[0], 7);};});});

})();




var asc = 2;

function sort_table(table, col)
{
    $('.sortorder').remove();
    if (asc == 2) {asc = -1;} else {asc = 2;}
    var rows = table.tBodies[0].rows;
    var rlen = rows.length-1;
    var arr = new Array();
    var i, j, cells, clen;
    // fill the array with values from the table
    for(i = 0; i < rlen; i++)
    {
        cells = rows[i].cells;
        clen = cells.length;
        arr[i] = new Array();
        for(j = 0; j < clen; j++) { arr[i][j] = cells[j].innerHTML; }
    }
    // sort the array by the specified column number (col) and order (asc)
    arr.sort(function(a, b)
             {
        var retval=0;
        var col1 = a[col].toLowerCase().replace(',', '').replace('$', '').replace(' usd', '')
        var col2 = b[col].toLowerCase().replace(',', '').replace('$', '').replace(' usd', '')
        var fA=parseFloat(col1);
        var fB=parseFloat(col2);
        if(col1 != col2)
        {
            if((fA==col1) && (fB==col2) ){ retval=( fA > fB ) ? asc : -1*asc; } //numerical
            else { retval=(col1 > col2) ? asc : -1*asc;}
        }
        return retval;
    });
    for(var rowidx=0;rowidx<rlen;rowidx++)
    {
        for(var colidx=0;colidx<arr[rowidx].length;colidx++){ table.tBodies[0].rows[rowidx].cells[colidx].innerHTML=arr[rowidx][colidx]; }
    }

    hdr = table.rows[0].cells[col];
    if (asc == -1) {
        $(hdr).html($(hdr).html() + '<span class="sortorder">▲</span>');
    } else {
        $(hdr).html($(hdr).html() + '<span class="sortorder">▼</span>');
    }
}


function sortTable(n) {
    sort_table(table, n);
}
