var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1r_hkXDmRdDen0v8ORLa4C_9dO_j6ubwSW0-q3uhXIzk/edit#gid=0");
var sheet = ss.getSheetByName("Sheet1");


var SHEET_ID = ("1r_hkXDmRdDen0v8ORLa4C_9dO_j6ubwSW0-q3uhXIzk");
function readData() {
  var sheet = SpreadsheetApp.openById(SHEET_ID);
  var data = sheet.getDataRange().getValues();
  console.log(data, 'data');
  for (var i = 0; i < data.length; i++) {
    Logger.log('Id: '+ data[i][0])
    Logger.log('FirstName: ' + data[i][1]);
    Logger.log('LastName: ' + data[i][2]);
    Logger.log('Email' + data[i][3]);
    Logger.log('Password' + data[i][4]);

  }
}

function addData() {
  var sheet = SpreadsheetApp.openById(SHEET_ID);
  sheet.appendRow([4, 'Vishal', 'pandey', 'vishal19@navgurukul.org', '123w']);
}

// Get data
function getData() {
  var sheet = SpreadsheetApp.openById(SHEET_ID);
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
//  console.log(values);
  return values;
}

//doGet
function doGet(e) {
  var requestType = (e.parameter.TypeOfRequest);
  if (requestType == "getUserDetails") {
    return getUserDetails(e);
  }
}

function getUserDetails(e){
  var dataArray = [];
  var rows = sheet.getRange(2,1,sheet.getLastRow()-1, sheet.getLastColumn()).getValues();
  
  for (var i = 0, l= rows.length; i<l; i++){
    var dataRow = rows[i];

    var record = {
      "Id": dataRow[0],
      "FirstName": dataRow[1],
      "LastName": dataRow[2],
      "Email": dataRow[3],
      "Password": dataRow[4]
    }
    
    dataArray.push(record);
  }
//  console.log(dataArray, "data");
  var result = JSON.stringify(dataArray);
  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
}


function doPost(e){
  var requestType = (e.parameter.TypeOfRequest);
  if (requestType == "appendUser") {
    return appendUser(e);
  }
}

//append User
function appendUser(e) {  
  var sheet = SpreadsheetApp.openById(SHEET_ID);
  var data = sheet.getDataRange().getValues();
  if(e.postData !== undefined){
//  Logger.log(e.postData);
  var params = JSON.stringify(JSON.parse(e.postData.contents));
  var parseData = JSON.parse(e.postData.contents);
//  sheet.appendRow([parseData.Token, parseData.Name, parseData.Number]);
    
    for (var i in data){
      var row = data[i];
      var duplicate = false;
      if (parseData.Id == data[i][0]){
        duplicate = true;
        return ContentService.createTextOutput("Id is duplicate!").setMimeType(ContentService.MimeType.JSON);
      }
    }
    if (!duplicate){
        sheet.appendRow([parseData.Id, parseData.FirstName, parseData.LastName, parseData.Email, parseData.Password]);
        return ContentService.createTextOutput(params).setMimeType(ContentService.MimeType.JSON);
      }
        
  }else{
    var warning = {"Warning!": "Please enter valid details"};
    var error = JSON.stringify(warning)
    return ContentService.createTextOutput(error).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e){
  var requestType = (e.parameter.TypeOfRequest);
  if (requestType == "updateUserInformation") {
    return updateUserInformation(e);
  }
}

//getRange and setValues for User details (update)
function updateUserInformation(e){
  var sheet = SpreadsheetApp.openById(SHEET_ID);
  var asheet= sheet.getActiveSheet();
  var dataRange = sheet.getDataRange().getValues();
  if(e.postData !== undefined){
  var params = JSON.stringify(JSON.parse(e.postData.contents));
  var parseData = JSON.parse(e.postData.contents);
    for ( var i=0; i<dataRange.length; i++){
      if (dataRange[i][0] == parseData.Id){
        var B = 'B'+ (i+1);
        var range= sheet.getRange(B)
        var sv= range.setValue([parseData.FirstName]);
      
        var C = 'C'+ (i+1);
        var range= sheet.getRange(C)
        var sv= range.setValue([parseData.LastName]);
        
        var D = 'D'+ (i+1);
        var range= sheet.getRange(D)
        var sv= range.setValue([parseData.Email]);
        
        var E = 'E'+ (i+1);
        var range= sheet.getRange(E)
        var sv= range.setValue([parseData.Password]);
        
//        return ContentService.createTextOutput(params).setMimeType(ContentService.MimeType.JSON);
      } 
    }
    return ContentService.createTextOutput("data updated!").setMimeType(ContentService.MimeType.JSON);
    
  }else{
    var warning = {"Warning!": "Please enter valid details !"};
    var error = JSON.stringify(warning)
    return ContentService.createTextOutput(error).setMimeType(ContentService.MimeType.JSON);
   
  }
}



