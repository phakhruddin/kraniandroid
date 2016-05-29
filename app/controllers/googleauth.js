exports.openMainWindow = function(_tab) {
  _tab.open($.googleauth_window);
  Ti.API.info("This is child widow of : " +JSON.stringify(_tab));
  Ti.API.info("executing google authentication : ");
  //Alloy.Globals.googleAuth.authorize();
  googleAuthSheet.authorize();
};

var GoogleAuth = require('googleAuth');
var googleAuthSheet = new GoogleAuth({
	clientId : Alloy.Globals.clientId,
	clientSecret : 'fjrsVudiK3ClrOKWxO5QvXYL',
	propertyName : 'googleToken',
	scope : ['https://spreadsheets.google.com/feeds', 'https://docs.google.com/feeds','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly'],
	quiet: false
});