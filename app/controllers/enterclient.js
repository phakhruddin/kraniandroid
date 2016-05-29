var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.enterclient_window);
  Ti.API.info("This is child widow enterclient.js" +JSON.stringify(_tab));
    //Alloy.Globals.checkNetworkAndGoogleAuthorized('1gnkP116nsTVxtrw6d_mXVdOiesQEPH7LVUIyHUfx9EE');
    	googleAuth.isAuthorized(function() {		
		}, function() {
			//authorize first
			Ti.API.info('Authorized first, see next window: ');
			googleAuth.authorize();
		});
};

if (args) {
	var customerid = args.customerid;
	var clients = Alloy.Collections.instance('client');
	clients.fetch();	
	$.save_button.titleid = customerid;
	
	var theclient = clients.where({col1:customerid}); //FILTER
	if (theclient.length > 0 ){
		for (j=0;j<theclient.length;j++){
			   var theclientjson = theclient[j].toJSON(); // EXTRACT ONE ROW. IF MANY. FOR LOOP.
    		   Alloy.Globals.Log("enterclient.js::theclientjson.col1 :"+theclientjson.col1+" col2: "+theclientjson.col2);
		}
	}
 
}


    Ti.App.Properties.removeProperty('edithref'); //clear ref to previous spreadsheet
    Ti.App.Properties.removeProperty('idtag'); //clear ref to previous spreadsheet
    Ti.App.Properties.removeProperty('selfhref'); //clear ref to previous spreadsheet
    
Alloy.Globals.Log("clientdetail.js:: JSON.stringify(args) :"+JSON.stringify(args));
var edithref = args.edithref;
var selfhref = args.selfhref;
var idtag = args.idtag;
Alloy.Globals.Log("clientdetail.js:: existing edithref: " +edithref);
(edithref)?Titanium.App.Properties.setString('edithref',edithref):Ti.App.Properties.removeProperty('edithref');
(selfhref)?Titanium.App.Properties.setString('selfhref',selfhref):Ti.App.Properties.removeProperty('selfhref');
(idtag)?Titanium.App.Properties.setString('idtag',idtag):Ti.App.Properties.removeProperty('idtag');
Alloy.Globals.Log("clientdetail.js:: existing Titanium.App.Properties.getString('edithref'): " +Titanium.App.Properties.getString('edithref'));

function addRows(){
 Alloy.Globals.Log("JSON stringify e : " +JSON.stringify(e));
// Defining new row
var newRow = Ti.UI.createTableViewRow({
title : 'Row ' + ($.enterclient_table.data[0].rowCount + 1)
});
 
// Adding row to the table view
$.enterclient_table.appendRow(newRow);
}

$.notes_tf.addEventListener("blur",function(e){
        Alloy.Globals.Log("enterclient.js::JSON.stringify(e)  :" +JSON.stringify(e));
		var notes = e.value;
});


var count = 3; //row where line item is entered
Titanium.App.Properties.setInt('count',count);
 
 var itemvalue =[];

 function saveHandler(e){
 	Alloy.Globals.Log("enterclient.js::saveHandler::saving all data JSON e: "+JSON.stringify(e));
 	var tabledata = [];	
 	var noentry = "none";
 	var getvalue = ["clientfirstname","clientlastname","clientphone","clientemail","clientstreetaddress","clientcity","clientstate","clientcompany","notes"];
 	for (i=0;i<$.enterclient_table.data[0].rowCount;i++) {		
 		Alloy.Globals.Log("children count : "	+$.enterclient_table.data[0].rows[i].children.length);
 		for (j=0;j<+$.enterclient_table.data[0].rows[i].children.length;j++) { 			
			Alloy.Globals.Log("JSON stringify table 0 row "+i+' : ' +JSON.stringify($.enterclient_table.data[0].rows[i]));
			Alloy.Globals.Log("JSON stringify table 0 row "+i+'w/children '+j+' : ' +JSON.stringify($.enterclient_table.data[0].rows[i].children[j]));
			tabledata.push({data1:$.enterclient_table.data[0].rows[i].children[j].id || "none",data2:$.enterclient_table.data[0].rows[i].children[j].value || "none"});
			for (z=0;z<getvalue.length;z++){
				var subject = getvalue[z];
				if ( $.enterclient_table.data[0].rows[i].children[j].id == subject+"_tf") {					
					 	eval("var "+subject+" = $.enterclient_table.data[0].rows[i].children[j].value || $.enterclient_table.data[0].rows[i].children[j].text || noentry;");		 
				};
			}		
		};
	};
	Alloy.Globals.Log("tabledata are: "+JSON.stringify(tabledata));
	Alloy.Globals.Log("enterclient.js::saveHandler:: detect array dyn variable: "+clientfirstname+","+clientlastname+","+clientphone+","+clientemail+","+clientstreetaddress
	+","+clientcity+","+clientstate+","+clientcompany);
	//once tabledata is populated, find submission value
	var name = clientfirstname+' '+clientlastname;
	var customerid = e.source.titleid;
	Alloy.Globals.Log("enterclient.js::saveHandler::clientfirstname: "+clientfirstname+" clientlastname "+clientlastname);	
	submit(clientfirstname,clientlastname,clientcompany,clientphone,clientemail,clientstreetaddress,clientcity,clientstate,"USA","pending",notes,"0","6/1/2015","7/1/2015",customerid);
	///Alloy.Globals.Log('submit('+clientnumber+','+name+','+customerno+','+total+','+bal+','+paid+','+lastpaiddate+','+followupdate+','+clientphone+','+clientemail+','+duedate+','
	///+currency+','+status+')');
 }; 
 
 function submit(clientfirstname,clientlastname,clientcompany,clientphone,clientemail,clientstreetaddress,clientcity,clientstate,country,status,notes,percentcompletion,nextappt,datedue,customerid) {	
 	//var spreadsheet_id = '1-Wz7Apn4AvVpfqcNyMgfqyKA8OAoLNy5Bl0d_jQ9IZk';
    var spreadsheet_id = Titanium.App.Properties.getString('client');
    var existingedithref = Titanium.App.Properties.getString('edithref');
    var edithref = Titanium.App.Properties.getString('edithref');
   /// var existingedithref = edithref;
    var idtag = Titanium.App.Properties.getString('idtag');
    //var edithref = existingedithref;
    var selfhref = Titanium.App.Properties.getString('selfhref');
    var now = Date.now();
 	var captimestamp = now;
    Alloy.Globals.Log("enterclient.js::submit::existing edit href is: "+existingedithref+' idtag :'+idtag);
	var xhr =  Titanium.Network.createHTTPClient({
	    onload: function() {
	    	try {
	    		Ti.API.info(this.responseText);
	    		var xml = Titanium.XML.parseString(this.responseText);
	    		var entry = xml.documentElement.getElementsByTagName("entry");
	    		var link = xml.documentElement.getElementsByTagName("link");
	    		var idtag = xml.documentElement.getElementsByTagName("id").item(0).text;
	    		Alloy.Globals.Log("enterclient.js::submit: number of link found: " +link+ " length: "+link.length);
	    		for (i=0;i<link.length;i++){			
	    			var listitem = link.item(i);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href");}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href");}
	    		}
	    		Titanium.App.Properties.setString('edithref',edithref);
	    		Titanium.App.Properties.setString('idtag',idtag);
	    		Titanium.App.Properties.setString('selfhref',selfhref);
	    		Ti.API.info("enterclient.js::submit: self href is : "+selfhref+" edit href is: "+edithref);
	    		Ti.API.info("enterclient.js::submit: idtag is : "+idtag);
	    	} catch(e){
	    		Ti.API.info("cathing e: "+JSON.stringify(e));
	    	}     
	    },
	    onerror: function(e) {
	    	Alloy.Globals.Log("enterclient.js:: error e: "+JSON.stringify(e));
	        alert("error:"+e.code+": Please connect to the network.");
	    }
	});

	var clients = Alloy.Collections.instance('client');
	if (existingedithref) {
			Alloy.Globals.Log("enterclient.js::submit::PUT on existing edit href is: "+existingedithref);
			xhr.open("PUT", existingedithref);
			var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
				+'<id>'+idtag+'</id>'
				+'<updated>2015-05-16T08:01:19.680Z</updated>'
				+'<category scheme=\'http://schemas.google.com/spreadsheets/2006\' term=\'http://schemas.google.com/spreadsheets/2006#list\'/>'
				+'<title type=\'text\'>'+customerid+'</title>'
				+'<content type=\'text\'>col2: '+clientfirstname+', col3: '+clientlastname+', col4: '+clientcompany+', col5: '+clientphone+', col6: '+clientemail+', col7: '+clientstreetaddress
				+', col8: '+clientcity+', col9: '+clientstate+', col10: '+country+', col11: NA, col12: NA, col13: NA, col14: '+captimestamp+', col15: none, col16: '+now+'</content>'
				+'<link rel=\'self\' type=\'application/atom+xml\' href=\''+selfhref+'\'/>'
				+'<link rel=\'edit\' type=\'application/atom+xml\' href=\''+edithref+'\'/>'
				+'<gsx:col1>'+customerid+'</gsx:col1><gsx:col2>'+clientfirstname+'</gsx:col2><gsx:col3>'
				+clientlastname+'</gsx:col3><gsx:col4>'+clientcompany+'</gsx:col4><gsx:col5>'
				+clientphone+'</gsx:col5><gsx:col6>'+clientemail+'</gsx:col6><gsx:col7>'+clientstreetaddress+'</gsx:col7><gsx:col8>'+clientcity+'</gsx:col8>'
				+'<gsx:col9>'+clientstate+'</gsx:col9><gsx:col10>'+country+'</gsx:col10><gsx:col11>NA</gsx:col11><gsx:col12>NA</gsx:col12><gsx:col13>NA</gsx:col13><gsx:col14>'+customerid+'</gsx:col14>'
				+'<gsx:col15>'+notes+'</gsx:col15><gsx:col16>'+customerid+'</gsx:col16></entry>';
			Ti.API.info('xmldatastring existing to PUT: '+xmldatastring);
			clients.fetch();
			Alloy.Globals.Log("enterclient.js::submit:: update DB with customerid :" +customerid);
			Alloy.Collections.client.deleteCol1(customerid);
				clients.get(customerid).set({
					col1: 	customerid.toString(),
					col2:	clientfirstname,
					col3:	clientlastname,
					col4:	clientcompany,
					col5:	clientphone,
					col6:	clientemail,
					col7:	clientstreetaddress,
					col8:	clientcity,
					col9:	clientstate,
					col10:	country
				}).save();
			alert('Modified & Saved Successfully!');
		} else {
			var customerid = now;
			$.save_button.titleid = customerid; //feed id the save button of the customer id.
			var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
				+'<gsx:col1>'+customerid+'</gsx:col1><gsx:col2>'+clientfirstname+'</gsx:col2><gsx:col3>'
				+clientlastname+'</gsx:col3><gsx:col4>'+clientcompany+'</gsx:col4><gsx:col5>'
				+clientphone+'</gsx:col5><gsx:col6>'+clientemail+'</gsx:col6><gsx:col7>'+clientstreetaddress+'</gsx:col7><gsx:col8>'+clientcity+'</gsx:col8>'
				+'<gsx:col9>'+clientstate+'</gsx:col9><gsx:col10>'+country+'</gsx:col10><gsx:col11>NA</gsx:col11><gsx:col12>NA</gsx:col12><gsx:col13>NA</gsx:col13><gsx:col14>'+customerid+'</gsx:col14>'
				+'<gsx:col15>'+notes+'</gsx:col15><gsx:col16>'+customerid+'</gsx:col16></entry>';
				Ti.API.info('xmldatastring to POST: '+xmldatastring);
			xhr.open("POST", 'https://spreadsheets.google.com/feeds/list/'+spreadsheet_id+'/od6/private/full');
			Alloy.Globals.Log("enterclient.js::submit:: add DB with customerid :" +customerid);
			var dataModel = Alloy.createModel('client',{
					col1: 	customerid.toString(),
					col2:	(clientfirstname == " ")?'none':clientfirstname,
					col3:	(clientlastname == " ")?'none':clientlastname,
					col4:	(clientcompany == " ")?'none':clientcompany,
					col5:	(clientphone == " ")?'none':clientphone,
					col6:	(clientemail == " ")?'none':clientemail,
					col7:	(clientstreetaddress == " ")?'none':clientstreetaddress,
					col8:	(clientcity == " ")?'none':clientcity,
					col9:	(clientstate == " ")?'none':clientstate,
					col10:	(country == " ")?'none':country,
					col11: "none",
					col12: "none",
					col13: "none",
					col14: "none",
					col15: "none",
					col16: "none"
				});			
				dataModel.save();
			alert('Saved Successfully!');
		} 
	xhr.setRequestHeader("Content-type", "application/atom+xml");
	xhr.setRequestHeader("Authorization", 'Bearer '+ googleAuth.getAccessToken());
	xhr.send(xmldatastring);
 }
 
 
var addnewclientrow = [ $.existing, $.clientdetail_row, $.itemline_row, $.itemdetail_row, $.addrow_row, $.itemlineend_row ];

$.enterclient_table.setData(addnewclientrow)	;

$.check_client.addEventListener('click', function(e){
	var clientController = Alloy.createController('client',{
			sourcecall: 'enterclient'
		});
	clientController.openMainWindow($.enterclient_tab);
	
});

var scope = ['https://spreadsheets.google.com/feeds', 'https://docs.google.com/feeds','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly','https://www.googleapis.com/auth/drive'];
scope.push ("https://www.googleapis.com/auth/drive.appdata");
scope.push ("https://www.googleapis.com/auth/drive.apps.readonly");
scope.push ("https://www.googleapis.com/auth/drive.file");
var GoogleAuth = require('googleAuth');
var googleAuth = new GoogleAuth({
	clientId : Alloy.Globals.clientId,
	clientSecret : 'fjrsVudiK3ClrOKWxO5QvXYL',
	propertyName : 'googleToken',
	scope : scope,
	quiet: false
	//scope : ['https://spreadsheets.google.com/feeds', 'https://docs.google.com/feeds'],
});
/*
function getStreetAddress(){
	(args.address)?$.clientstreetaddress_tf.value=args.address:$.clientstreetaddress_tf.value=" ";
}*/
/*
$.enterclient_table.addEventListener('click', function(e){
	Alloy.Globals.Log("JSON stringify after table row is clicked : " +JSON.stringify(e));
	$.notes_tf.blur();
});*/

(args.firstname)?$.clientfirstname_tf.value=args.firstname:$.clientfirstname_tf.value=" ";
(args.lastname)?$.clientlastname_tf.value=args.lastname:$.clientlastname_tf.value=" ";
(args.company)?$.clientcompany_tf.value=args.company:$.clientcompany_tf.value=" ";
(args.phone)?$.clientphone_tf.value=args.phone:$.clientphone_tf.value=" ";
(args.email)?$.clientemail_tf.value=args.email:$.clientemail_tf.value=" ";
(args.address)?$.clientstreetaddress_tf.value=args.address:$.clientstreetaddress_tf.value=" ";
(args.city)?$.clientcity_tf.value=args.city:$.clientcity_tf.value=" ";
(args.state)?$.clientstate_tf.value=args.state:$.clientstate_tf.value=" ";
 



 