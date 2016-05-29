exports.openMainWindow = function(_tab) {
  _tab.open($.enterproject_window);
  Ti.API.info("This is child widow schedule.js" +JSON.stringify(_tab));
  
	Alloy.Globals.checkNetworkAndGoogleAuthorized('1gnkP116nsTVxtrw6d_mXVdOiesQEPH7LVUIyHUfx9EE');  
	//Alloy.Globals.checkGoogleisAuthorized();
	  
  	$.save_clientlastname_button.addEventListener('click', function(_e) {
    $.clientlastname_tf.blur();
    var clientlastname = $.clientlastname_tf.value;
    Ti.API.info("clientlastname entered is: "+clientlastname);
    Titanium.App.Properties.setString('clientlastname',clientlastname);
    Ti.API.info("clientlastname obtained is: "+Titanium.App.Properties.getString('clientlastname',"none"));
    $.save_clientlastname_button.hide();
 });

	$.clientlastname_tf.addEventListener("focus", function(){
 	$.save_clientlastname_button.show();
 });

	$.save_clientfirstname_button.addEventListener('click', function(_e) {
    $.clientfirstname_tf.blur();
    var clientfirstname = $.clientfirstname_tf.value;
    Ti.API.info("clientfirstname entered is: "+clientfirstname);
    Titanium.App.Properties.setString('clientfirstname',clientfirstname);
    Ti.API.info("clientfirstname obtained is: "+Titanium.App.Properties.getString('clientfirstname',"none"));
    $.save_clientfirstname_button.hide();
 });

	$.clientfirstname_tf.addEventListener("focus", function(){
 	$.save_clientfirstname_button.show();
 });

	$.save_clientemail_button.addEventListener('click', function(_e) {
    $.clientemail_tf.blur();
    var clientemail = $.clientemail_tf.value;
    Ti.API.info("clientemail entered is: "+clientemail);
    Titanium.App.Properties.setString('clientemail',clientemail);
    Ti.API.info("clientemail obtained is: "+Titanium.App.Properties.getString('clientemail',"none"));
    $.save_clientemail_button.hide();
 });

	$.clientemail_tf.addEventListener("focus", function(){
 	$.save_clientemail_button.show();
 });

	$.save_clientphone_button.addEventListener('click', function(_e) {
    $.clientphone_tf.blur();
    var clientphone = $.clientphone_tf.value;
    Ti.API.info("clientphone entered is: "+clientphone);
    Titanium.App.Properties.setString('clientphone',clientphone);
    Ti.API.info("clientphone obtained is: "+Titanium.App.Properties.getString('clientphone',"none"));
    $.save_clientphone_button.hide();
 });

	$.clientphone_tf.addEventListener("focus", function(){
 	$.save_clientphone_button.show();
 });

	$.save_clientstreetaddress_button.addEventListener('click', function(_e) {
    $.clientstreetaddress_tf.blur();
    var clientstreetaddress = $.clientstreetaddress_tf.value;
    Ti.API.info("clientstreetaddress entered is: "+clientstreetaddress);
    Titanium.App.Properties.setString('clientstreetaddress',clientstreetaddress);
    Ti.API.info("clientstreetaddress obtained is: "+Titanium.App.Properties.getString('clientstreetaddress',"none"));
    $.save_clientstreetaddress_button.hide();
 });

	$.clientstreetaddress_tf.addEventListener("focus", function(){
 	$.save_clientstreetaddress_button.show();
 });

	$.save_clientcity_button.addEventListener('click', function(_e) {
    $.clientcity_tf.blur();
    var clientcity = $.clientcity_tf.value;
    Ti.API.info("clientcity entered is: "+clientcity);
    Titanium.App.Properties.setString('clientcity',clientcity);
    Ti.API.info("clientcity obtained is: "+Titanium.App.Properties.getString('clientcity',"none"));
    $.save_clientcity_button.hide();
 });

	$.clientcity_tf.addEventListener("focus", function(){
 	$.save_clientcity_button.show();
 });

	$.save_clientstate_button.addEventListener('click', function(_e) {
    $.clientstate_tf.blur();
    var clientstate = $.clientstate_tf.value;
    Ti.API.info("clientstate entered is: "+clientstate);
    Titanium.App.Properties.setString('clientstate',clientstate);
    Ti.API.info("clientstate obtained is: "+Titanium.App.Properties.getString('clientstate',"none"));
    $.save_clientstate_button.hide();
 });

	$.clientstate_tf.addEventListener("focus", function(){
 	$.save_clientstate_button.show();
 });

	$.save_clientproject_button.addEventListener('click', function(_e) {
    $.clientproject_tf.blur();
    var clientproject = $.clientproject_tf.value;
    Ti.API.info("clientproject entered is: "+clientproject);
    Titanium.App.Properties.setString('clientproject',clientproject);
    Ti.API.info("clientproject obtained is: "+Titanium.App.Properties.getString('clientproject',"none"));
    $.save_clientproject_button.hide();
 });

	$.clientproject_tf.addEventListener("focus", function(){
 	$.save_clientproject_button.show();
 });
 
 	$.save_clientcompany_button.addEventListener('click', function(_e) {
    $.clientcompany_tf.blur();
    var clientcompany = $.clientcompany_tf.value;
    Ti.API.info("clientcompany entered is: "+clientcompany);
    Titanium.App.Properties.setString('clientcompany',clientcompany);
    Ti.API.info("clientcompany obtained is: "+Titanium.App.Properties.getString('clientcompany',"none"));
    $.save_clientcompany_button.hide();
 });

	$.clientcompany_tf.addEventListener("focus", function(){
 	$.save_clientcompany_button.show();
 });

 	$.submit_button.addEventListener("click", function(){
		
 	var now = new Date();
 	var clientlastname = Titanium.App.Properties.getString('clientlastname',"none");
 	var clientfirstname = Titanium.App.Properties.getString('clientfirstname',"none");
 	var clientphone = Titanium.App.Properties.getString('clientphone',"none");
 	var clientemail = Titanium.App.Properties.getString('clientemail',"none");
 	var clientstreetaddress = Titanium.App.Properties.getString('clientstreetaddress',"none");
 	var clientcity = Titanium.App.Properties.getString('clientcity',"none");
 	var clientstate = Titanium.App.Properties.getString('clientstate',"none");
 	var clientproject = Titanium.App.Properties.getString('clientproject',"none");
 	var clientcompany = Titanium.App.Properties.getString('clientcompany',"none");
 	alert("On "+now+" : Info on: "+clientfirstname+" "+clientlastname+" with "+clientphone+" and email "+clientemail+" at "+clientstreetaddress+", "+clientcity+", "+clientstate+". submitted");
 	var fcsv = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory,'enterclient.csv');
 	var ftxt = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory,'enterclient.txt');
	fcsv.write(now+", "+clientfirstname+", "+clientlastname+", "+clientphone+", "+clientemail+", "+clientstreetaddress+", "+clientcity+", "+clientstate+'\n', true); // write to the file
	ftxt.write(now+", "+clientfirstname+", "+clientlastname+", "+clientphone+", "+clientemail+", "+clientstreetaddress+", "+clientcity+", "+clientstate+'\n', true); // write to the file
	var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
	+'<gsx:col1>'+clientfirstname+'</gsx:col1><gsx:col2>'+clientfirstname+'</gsx:col2><gsx:col3>'
	+clientlastname+'</gsx:col3><gsx:col4>'+clientcompany+'</gsx:col4><gsx:col5>'
	+clientphone+'</gsx:col5><gsx:col6>'+clientemail+'</gsx:col6><gsx:col7>'+clientstreetaddress+'</gsx:col7><gsx:col8>'+clientcity+'</gsx:col8><gsx:col9>'+clientstate
	+'</gsx:col9><gsx:col10>'+'USA'+'</gsx:col10><gsx:col11>'+'NA'+'</gsx:col11><gsx:col12>NA</gsx:col12><gsx:col13>NA</gsx:col13><gsx:col14>NA</gsx:col14><gsx:col15>NA</gsx:col15><gsx:col16>NA</gsx:col16></entry>';
	Ti.API.info('xmldatastring to POST: '+xmldatastring);
	var xhr =  Titanium.Network.createHTTPClient({
    onload: function() {
    	try {
    		Ti.API.info(this.responseText); 
    	} catch(e){
    		Ti.API.info("cathing e: "+JSON.stringify(e));
    	}     
    },
    onerror: function(e) {
    	Ti.API.info("error e: "+JSON.stringify(e));
        alert("Unable to communicate to the cloud. Please try again"); 
    }
});
	xhr.open("POST", 'https://spreadsheets.google.com/feeds/list/1ECkNoyzgeSu8WkVs3kBnlY8MjJRIAc787nVs6IJsA9w/od6/private/full');
	xhr.setRequestHeader("Content-type", "application/atom+xml");
	xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send(xmldatastring);
	Ti.API.info('done POSTed');


 });
};