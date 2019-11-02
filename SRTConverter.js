function convertCSVtoSRT(data, form, lenght, a) {


//-----------------------------------VANAF HIER DE CODE OM SRT OM TE ZETTEN -----------------
var file = "";
var timecode = "0";
var comment = "";
var thisline = "";
var allcomments = [];
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
console.dir(totalObjectArray);
totalObjectArray.forEach(function(arr, a) {
if (arr[4].length > 193) {arr[4] = arr[4].substring(0,193)+" (SRT INGEKORT)";};    
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

function getSRT(r, name, boolean) {

    console.log("url is "+r);

    var req =  $.ajax({
    
            type: 'GET',
            url: r,
        async: false});
    var responsetext = (req.responseText); console.log(responsetext); console.log('hoi');
    if(responsetext.includes(",,,,,,,")) {var j = responsetext.indexOf(",,,,,,,"); responsetext = responsetext.substr(0,j);};
    var responsetextsrt = convertCSVtoSRT(responsetext);
    
       return responsetextsrt;
    };

    