// Dit is een script dat hoort bij het video-overzicht van de studio, waardoor automatisch links naar de bijbehorende video's op vimeo worden aangemaakt.
// link naar het spreadsheet document: https://docs.google.com/spreadsheets/d/1MSLz8dkZ2SqzEc20K1YAS2MhYub35hJfvG84-FSKrWs/edit#gid=0

function onEdit() {
    var s = SpreadsheetApp.getActiveSheet();
    var r = s.getActiveCell();
    
    
    // woorden die moeten worden genegeerd in de zoekopdracht op Vimeo:
    
    var ignore = ['locatieopname', 'locatie-opname','()', 'studioopname', 'studio-opname','studio','locatie', ' van ', ' de ', ' het ', ' op ', ' in ', ' voor ', 'PE ', 'PO ', 'APO ', 'CME ', 'LE ', 'TA ', 'FY ', 'HA ', 'SO ', 'PAOB ','AA '];
  
    
    
    
    if( r.getColumn() != 2 ) { //checks the column
      var row = r.getRow();
      //Browser.msgBox(row);
      var time = new Date();
      var values = SpreadsheetApp.getActiveSheet().getDataRange().getValues();
      var title =values[row-1][1];
      title = title.replace('(',''); title = title.replace(')','');
      title = deleter(title, ignore);
      title = title.substring(1);
      if (values[row-1][4] == "Montage" || values[row-1][4] == '') { SpreadsheetApp.getActiveSheet().getRange('I' + row.toString()).setValue('');} else {
      var link = '=HYPERLINK("https://vimeo.com/manage/videos/search/'+encodeURI(title)+'"; "vimeo link")';
      //time = Utilities.formatDate(time, "GMT+02:00", "dd/MM/yyyy, HH:mm:ss");
      SpreadsheetApp.getActiveSheet().getRange('I' + row.toString()).setFormula(link);
  
      SpreadsheetApp.getActiveSheet().getRange('I3').setValue('Vimeo link:'); 
      
      SpreadsheetApp.getActiveSheet().getRange('I2').setValue('');
      SpreadsheetApp.getActiveSheet().getRange('I1').setValue('');
      };
    };
   };
  
  function deleter(string, find) {
    var replaceString = string;
    for (var i = 0; i < find.length; i++) {
      replaceString = replaceString.replace(find[i], ' ');
    }
    return replaceString;
  };