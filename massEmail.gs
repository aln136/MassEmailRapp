/**
Sends emails with data from the spreadsheet using an email template

Note: daily email limit of 100
*/

// CASE SENSTITIVE Header names (to be plugged into the email template)
// The sheet the headers are in is irrelevant; the script will iterate over all headers over all sheets in the ss
// FUTURE EDITS: make it into a dictionary. key:vars and value:string
var studentNameHeader = "Student's Full Name"
var studentEmailHeader = "Student's GNPS email address"
var parentEmailHeader = 'Email Address'
var tutorNameHeader = "Volunteer"
var tutorEmailHeader = "Volunteer email address"


// Email subject
var subject = "Academic Outreach Tutor"

// Email message template
function generateMessage_(tutorName,studentName,studentEmail,parentEmail) {
  var message = 'Hi ' + tutorName + ',\n\nThank you for becoming an Academic Outreach tutor. Below is the contact information for your student, ' + studentName + '. \n\nStudent’s e-mail: ' + studentEmail + '.\nParent’s e-mail: ' + parentEmail + '.\n\nPlease reach out using the template on Google Classroom. Please refer to the "How Academic Outreach Works" page when figuring out a date and time. Please let Mrs. Rapp know when you will be meeting and how things go.\n\nThanks so much for your help.\nErin Yim, Co-President'

  return message;
}

/**

Do not edit past this point

*/

// run and then check execution log for remaining emails
function logRemainingEmails() {
  Logger.log(MailApp.getRemainingDailyQuota())
}

function sendEmails() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // make one array of all header names across the entire ss
  // header names defined as first row of each column
  for (i in ss.getSheets()) {
    if (i == 0) {
      headerData = ss.getSheets()[i].getRange("A1:Z1").getValues()[0]
    }
    else {
      // get the range for each sheet
      headerData = headerData.concat(ss.getSheets()[i].getRange("A1:Z1").getValues()[0]);
    }
  }

  // find which columns contain the placeholder info by using predefined header names
  // FUTURE EDIT: automatically find the column that each header value is in

  for (i in headerData) {
    // find the column that parent email is in
    if (headerData[i] == parentEmailHeader) {
      var parentEmailColumn = i;
    }

    // find the column that student email is in
    if (headerData[i] == studentEmailHeader) {
      var studentEmailColumn = i;
    }

    // find the column that student name is in
    if (headerData[i] == studentNameHeader) {
      var studentNameColumn = i;
    }

    // find the column that tutor name is in
    if (headerData[i] == tutorNameHeader) {
      var tutorNameColumn = i;
    }

    // find the column that tutor email is in
    if (headerData[i] == tutorEmailHeader) {
      var tutorEmailColumn = i;
    }
  }

  // get all values for each sheet
  var sheetData = {}
  // iterate over each sheet...
  for (i in ss.getSheets()) {
    // and get values for all cells, not including headers
    sheetData[i] = ss.getSheets()[i].getRange("A2:Z").getValues();
  }

  // add all values to a list, each object in the list a row across the ss
  var data = []
  // for each sheet,
  for (i in sheetData) {

    // for each row in that sheet,
    for (j in sheetData[i]) {

      // if the first value of the row is a falsy (aka empty cell),
      if (!!sheetData[i][j][1] == false) {
        // move on to the next sheet
        break
      }

      // if it's the first iteration, just add an object (the row) to the list (data)
      if (i == 0) {
        data.push(sheetData[i][j]);
        continue;
      }

      // else, concat the row (j) onto the the list for that row (data[j])
      //console.log(i, j);
      //console.log(data);
      data[j] = data[j].concat(sheetData[i][j]);
    }
  }

  // for each row, use pre-found index values to find the placeholder values and send an email
  for (var i in data) {
    var row = data[i];
    var studentName = row[studentNameColumn];
    var studentEmail = row[studentEmailColumn];
    var parentEmail = row[parentEmailColumn];
    var tutorName = row[tutorNameColumn];
    var tutorEmail = row[tutorEmailColumn];

    // generate the message using found placeholder values
    var message = generateMessage_(tutorName, studentName, studentEmail, parentEmail)

    // send the emails
    //MailApp.sendEmail(tutorEmail, subject, message);
  }
}
