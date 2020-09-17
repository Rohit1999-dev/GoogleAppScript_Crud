var SHEET_ID = ("GOOGLE_API_SHEET_ID");
var ss = SpreadsheetApp.openById(SHEET_ID);
var sheet = ss.getSheetByName("Sheet1");
//Logger.log(sheet);

function readData() {
  var sheet = SpreadsheetApp.openById(SHEET_ID);
  var data = sheet.getDataRange().getValues();
  console.log(data, 'data');
//  for(var i=1; i<data.length; i++){
//    console.log(data[i]);
//  }
}


function doPost(e){
  var requestType = (e.parameter.TypeOfRequest);
  if(requestType == "newSignUpUser"){
    return newSignUpUser(e);
  }
  if(requestType == "loginUser"){
    return loginUser(e);
  }
  if(requestType == "deleteAccount"){
      return deleteAccount(e);
  }
}


function newSignUpUser(e) {  
  var data = sheet.getDataRange().getValues();
  if(e.postData !== undefined){
  var params = JSON.stringify(JSON.parse(e.postData.contents));
  var parseData = JSON.parse(e.postData.contents);    
    for (var i in data){
      var row = data[i];
      var duplicate = false;
      if (parseData.email == data[i][2]){
        duplicate = true;
        return ContentService.createTextOutput("email is duplicate!").setMimeType(ContentService.MimeType.JSON);
      }
    }
    if (!duplicate){
        sheet.appendRow([parseData.userid, parseData.username, parseData.email, parseData.password]);
        return ContentService.createTextOutput("sucessfully signup account !").setMimeType(ContentService.MimeType.JSON);
      }
        
  }else{
    var warning = {"Warning!": "Please enter valid details"};
    var error = JSON.stringify(warning)
    return ContentService.createTextOutput(error).setMimeType(ContentService.MimeType.JSON);
  }
}

function getAccessToken(data){
  var header = {
    "alg": "HS256",
    "typ": "JWT"
  };
  data['createdAt'] = new Date().getTime() / 1000;
  data['validTill'] = 2*24*60*60;
  var encodedHeader = Utilities.base64EncodeWebSafe(JSON.stringify(header));
  var encodedData = Utilities.base64EncodeWebSafe(JSON.stringify(data));
  var token = encodedHeader + "." + encodedData;
  
  var secret = "confidentialSecret";
  var signature = Utilities.computeHmacSha256Signature(token, secret)
  
  signature =  Utilities.base64EncodeWebSafe(signature);
  var signedToken = token + "." + signature;
//  console.log(signedToken);
  return signedToken;
}

function decodeAccessToken(token){
  var base64_data = token.split('.')[1];
  var dict_data = Utilities.newBlob(Utilities.base64DecodeWebSafe(base64_data)).getDataAsString();
  return JSON.parse(dict_data);
}

function loginUser(e){
  var jsonData = JSON.parse(e.postData.contents);
//  var jsonData = {
//	"email":"ankur19@navgurukul.org",
//	"password":"plkmjk"
//}
  var data = sheet.getDataRange().getValues();
  var email_id = jsonData['email'];
  var password = jsonData['password'];
  var token = '', msg = '';
  
  for(var i=1; i<data.length; i++){    
    if(data[i][2] === email_id){
      if(data[i][3] === password){
        if(data[i][4]){ 
          token_data = decodeAccessToken(data[i][4]); 
          if((new Date().getTime()/1000)-token_data['createdAt']>=token_data['validTill']){
            token = getAccessToken(jsonData);
            msg = 'token updated';
          }
          else{
            token = data[i][4];
            msg = 'token is same';
          }
        }else{
         token = getAccessToken(jsonData);
         msg = 'new token';
        }
        sheet.getRange('E'+(i+1)).setValue(token);
      }  
      else
        msg = "your password is wrong";
      break;
    } 
  }
  if(i == data.length)
    msg= "you should register first!";
//  console.log(token);
  
  var response = {'status': 0, 'msg': msg, 'data': token};
  var result = JSON.stringify(response);
  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
}

function deleteAccount(e){
    var params = JSON.parse(e.postData.contents);
  //  var params = {"email": "ashish@gmail.com"}
    var sheet = SpreadsheetApp.openById(SHEET_ID);
    var rows = sheet.getDataRange();
    var data = rows.getValues();
   
    for(var i = 0; i <= rows.getNumRows() - 1; i++){
      if(data[i][2] === params["email"]){
  //      console.log(data[i]);
        sheet.deleteRow(parseInt(i)+1);
        var msg = "record deleted for email_id "+ params["email"] ;
        break;
      }  
    }
  //  console.log(msg, i);
    var response = {'status': 0, 'msg': msg };
    var result = JSON.stringify(response);
    return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  }

function doGet(e){
  var ss = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1tnrJQHhuPTdv7iI03_vJtsveVXd0R8ZVeddoGhUyl-I/edit#gid=1461464255");
  var sheet = ss.getSheetByName("Sheet1");
  return getUsers(sheet);
  
}

function getUsers(sheet){
  var jo = {};
  var dataArray = [];

// collecting data from 2nd Row , 1st column to last row and last column
  var rows = sheet.getRange(2,1,sheet.getLastRow()-1, sheet.getLastColumn()).getValues();
  
  for(var i = 0, l= rows.length; i<l ; i++){
    var dataRow = rows[i];
    var record = {};
    record['FirstName'] = dataRow[1];
    record['LastName'] = dataRow[2];
    record['Email'] = dataRow[3];
    record['Password'] = dataRow[4];
    
    dataArray.push(record);
    
  }  
  
  jo.user = dataArray;
  
  var result = JSON.stringify(jo);
  
//  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  console.log(result);
  
}  
  
