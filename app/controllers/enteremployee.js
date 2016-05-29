var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.enteremployee_window);
  Alloy.Globals.Log("This is child widow enteremployee.js" +JSON.stringify(_tab));
   (Alloy.Globals.googleAuthSheet.getAccessToken()) || Alloy.Globals.googleAuthSheet.Authorize();
};

if (args.callbackFunction){
	callbackFunction = args.callbackFunction;
} else {
	callbackFunction = function() {
		Alloy.Globals.Log("no callback");
	};
}

if (args.title) {
	Alloy.Globals.Log("enteremployee.js::detected vars:JSON.stringify(vars):: "+JSON.stringify(args));
	var data = args.title.split(':');
	var employeeid = data[0];
	var firstname = data[1];$.employeefirstname_tf.value=firstname;
	var lastname = data[2];$.employeelastname_tf.value=lastname;
	var fullname = firstname+" "+lastname;
	var employeejobtitle = data[3];$.employeejobtitle_tf.value=employeejobtitle;
	var phone = data[4];$.employeephone_tf.value=phone;
	var email = data[5];$.employeeemail_tf.value=email;
	var address = data[6];
	var country = data[9];
	var invoice = data[10];
	var project = data[11];
	var proposal = data[12];
	var notes = data[14];
	Alloy.Globals.Log("enteremployee.js::JSON.stringify($.employeefirstname_tf):: :" +JSON.stringify($.employeefirstname_tf));
	//var idtag = data[13].replace("xCoLoNx",",").split(',')[0].replace("yCoLoNy",":");
	var idtag = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[0].replace('yCoLoNy',':'):"none";
	var selfhref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[1].replace('yCoLoNy',':'):"none";
	var edithref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[2].replace('yCoLoNy',':'):"none";

	Alloy.Globals.Log("enteremployee.js::idtag :"+idtag+" edithref: "+edithref+" selfhref: "+selfhref);
	//var employeeid = args.employeeid;
	var employees = Alloy.Collections.instance('labor');
	employees.fetch();	
	$.save_button.titleid = employeeid;
	
	var theemployee = employees.where({col1:employeeid}); //FILTER
	if (theemployee.length > 0 ){
		for (j=0;j<theemployee.length;j++){
			   var theemployeejson = theemployee[j].toJSON(); // EXTRACT ONE ROW. IF MANY. FOR LOOP.
    		   Alloy.Globals.Log("enteremployee.js::theemployeejson.col1 :"+theemployeejson.col1+" col2: "+theemployeejson.col2);
		}
	}
 
}


    Ti.App.Properties.removeProperty('edithref'); //clear ref to previous spreadsheet
    Ti.App.Properties.removeProperty('idtag'); //clear ref to previous spreadsheet
    Ti.App.Properties.removeProperty('selfhref'); //clear ref to previous spreadsheet
    
Alloy.Globals.Log("employeedetail.js:: JSON.stringify(args) :"+JSON.stringify(args));
//var edithref = args.edithref;
//var selfhref = args.selfhref;
//var idtag = args.idtag;
Alloy.Globals.Log("employeedetail.js:: existing edithref: " +edithref);
(edithref)?Titanium.App.Properties.setString('edithref',edithref):Ti.App.Properties.removeProperty('edithref');
(selfhref)?Titanium.App.Properties.setString('selfhref',selfhref):Ti.App.Properties.removeProperty('selfhref');
(idtag)?Titanium.App.Properties.setString('idtag',idtag):Ti.App.Properties.removeProperty('idtag');
Alloy.Globals.Log("employeedetail.js:: existing Titanium.App.Properties.getString('edithref'): " +Titanium.App.Properties.getString('edithref'));

function addRows(){
 Alloy.Globals.Log("JSON stringify e : " +JSON.stringify(e));
// Defining new row
var newRow = Ti.UI.createTableViewRow({
title : 'Row ' + ($.enteremployee_table.data[0].rowCount + 1)
});
 
// Adding row to the table view
$.enteremployee_table.appendRow(newRow);
}

$.notes_tf.addEventListener("blur",function(e){
        Alloy.Globals.Log("enteremployee.js::JSON.stringify(e)  :" +JSON.stringify(e));
		var notes = e.value;
});


var count = 3; //row where line item is entered
Titanium.App.Properties.setInt('count',count);
 
 var itemvalue =[];

 function saveHandler(e){
 	Alloy.Globals.Log("enteremployee.js::saveHandler::saving all data JSON e: "+JSON.stringify(e));
 	var tabledata = [];	
 	var noentry = "none";
 	var getvalue = ["employeefirstname","employeelastname","employeephone","employeeemail","employeestreetaddress","employeecity","employeestate","employeejobtitle","notes"];
 	for (i=0;i<getvalue.length;i++) {
 		var subject = getvalue[i];
 		eval("var "+subject+" = $."+subject+"_tf.value");
 	}
 	/*
 	for (i=0;i<$.enteremployee_table.data[0].rowCount;i++) {		
 		Alloy.Globals.Log("children count : "	+$.enteremployee_table.data[0].rows[i].children.length);
 		for (j=0;j<+$.enteremployee_table.data[0].rows[i].children.length;j++) { 			
			Alloy.Globals.Log("JSON stringify table 0 row "+i+' : ' +JSON.stringify($.enteremployee_table.data[0].rows[i]));
			Alloy.Globals.Log("JSON stringify table 0 row "+i+'w/children '+j+' : ' +JSON.stringify($.enteremployee_table.data[0].rows[i].children[j]));
			tabledata.push({data1:$.enteremployee_table.data[0].rows[i].children[j].id || "none",data2:$.enteremployee_table.data[0].rows[i].children[j].value || "none"});
			for (z=0;z<getvalue.length;z++){
				var subject = getvalue[z];
				if ( $.enteremployee_table.data[0].rows[i].children[j].id == subject+"_tf") {					
					 	eval("var "+subject+" = $.enteremployee_table.data[0].rows[i].children[j].value || $.enteremployee_table.data[0].rows[i].children[j].text || noentry;");		 
				};
			}		
		};
	};
	Alloy.Globals.Log("tabledata are: "+JSON.stringify(tabledata));
	Alloy.Globals.Log("enteremployee.js::saveHandler:: detect array dyn variable: "+employeefirstname+","+employeelastname+","+employeephone+","+employeeemail+","+employeestreetaddress
	+","+employeecity+","+employeestate+","+employeejobtitle);*/
	//once tabledata is populated, find submission value
	Alloy.Globals.Log("enteremployee.js::saveHandler:: detect array NON DYN variable: "+employeefirstname+","+employeelastname+","+employeephone+","+employeeemail+","+employeestreetaddress
	+","+employeecity+","+employeestate+","+employeejobtitle+","+notes);
	var name = employeefirstname+' '+employeelastname;
	var employeeid = (e.source.titleid)?e.source.titleid:Date.now();
	var lat="42.961409";
 	var lon="-88.223041";
 	var country = "USA"; var none="none";
	Alloy.Globals.Log("enteremployee.js::saveHandler::employeefirstname: submit("+ employeeid+","+employeefirstname+","+employeelastname+","+employeejobtitle+","+employeephone+","+employeeemail+","+lat+","+lon+","+employeestreetaddress+","+employeecity+","+employeestate+","+country+","+notes+","+employeeid +")");	
	submit(employeeid,employeefirstname,employeelastname,employeejobtitle,employeephone,employeeemail,lat,lon,employeestreetaddress,employeecity,employeestate,country,notes	,employeeid);
	///Alloy.Globals.Log('submit('+employeenumber+','+name+','+customerno+','+total+','+bal+','+paid+','+lastpaiddate+','+followupdate+','+employeephone+','+employeeemail+','+duedate+','
	///+currency+','+status+')');
 }; 
 /*
 function submit0(employeeid,employeefirstname,employeelastname,employeejobtitle,employeephone,employeeemail,lat,lon,employeestreetaddress,employeecity,employeestate,country,none,employeeid){
 	
 };*/
 
 function submit(employeeid,employeefirstname,employeelastname,employeejobtitle,employeephone,employeeemail,lat,lon,employeestreetaddress,employeecity,employeestate,country,notes,employeeid) {	
 	//var spreadsheet_id = '1-Wz7Apn4AvVpfqcNyMgfqyKA8OAoLNy5Bl0d_jQ9IZk';
    var spreadsheet_id = Titanium.App.Properties.getString('labor');
    var existingedithref = Titanium.App.Properties.getString('edithref');
    var edithref = Titanium.App.Properties.getString('edithref');
   /// var existingedithref = edithref;
    var idtag = Titanium.App.Properties.getString('idtag');
    //var edithref = existingedithref;
    var selfhref = Titanium.App.Properties.getString('selfhref');
    var now = Date.now();
 	var captimestamp = now;
    Alloy.Globals.Log("enteremployee.js::submit::existing edit href is: "+existingedithref+' idtag :'+idtag);
	var xhr =  Titanium.Network.createHTTPClient({
	    onload: function() {
	    	try {
	    		Ti.API.info(this.responseText);
	    		var xml = Titanium.XML.parseString(this.responseText);
	    		var entry = xml.documentElement.getElementsByTagName("entry");
	    		var link = xml.documentElement.getElementsByTagName("link");
	    		var idtag = xml.documentElement.getElementsByTagName("id").item(0).text;
	    		Alloy.Globals.Log("enteremployee.js::submit: number of link found: " +link+ " length: "+link.length);
	    		for (i=0;i<link.length;i++){			
	    			var listitem = link.item(i);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href");}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href");}
	    		}
	    		Titanium.App.Properties.setString('edithref',edithref);
	    		Titanium.App.Properties.setString('idtag',idtag);
	    		Titanium.App.Properties.setString('selfhref',selfhref);
	    		Ti.API.info("enteremployee.js::submit: self href is : "+selfhref+" edit href is: "+edithref);
	    		Ti.API.info("enteremployee.js::submit: idtag is : "+idtag);
	    	} catch(e){
	    		Ti.API.info("cathing e: "+JSON.stringify(e));
	    	}     
	    },
	    onerror: function(e) {
	    	Alloy.Globals.Log("enteremployee::error e: "+JSON.stringify(e));
	        alert("error:"+e.code+": Please connect to the network.");
	    }
	});
	var employees = Alloy.Collections.instance('labor');
	if (existingedithref) {
			Alloy.Globals.Log("enteremployee.js::submit::PUT on existing edit href is: "+existingedithref);
			xhr.open("PUT", existingedithref);
			var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
				+'<id>'+idtag+'</id>'
				+'<updated>2015-05-16T08:01:19.680Z</updated>'
				+'<category scheme=\'http://schemas.google.com/spreadsheets/2006\' term=\'http://schemas.google.com/spreadsheets/2006#list\'/>'
				+'<title type=\'text\'>'+employeeid+'</title>'
				+'<content type=\'text\'>col2: '+employeefirstname+', col3: '+employeelastname+', col4: '+employeejobtitle+', col5: '+employeephone+', col6: '+employeeemail+', col7:none '
				+', col8: '+lat+', col9: '+lon+', col10: '+employeestreetaddress+', col11: '+employeecity+', col12: '+employeestate+', col13: '+country+', col14: none, col15: '+notes+', col16: '+employeeid+'</content>'
				+'<link rel=\'self\' type=\'application/atom+xml\' href=\''+selfhref+'\'/>'
				+'<link rel=\'edit\' type=\'application/atom+xml\' href=\''+edithref+'\'/>'
				+'<gsx:col1>'+employeeid+'</gsx:col1><gsx:col2>'+employeefirstname+'</gsx:col2><gsx:col3>'
				+employeelastname+'</gsx:col3><gsx:col4>'+employeejobtitle+'</gsx:col4><gsx:col5>'
				+employeephone+'</gsx:col5><gsx:col6>'+employeeemail+'</gsx:col6><gsx:col7>none</gsx:col7><gsx:col8>'+lat+'</gsx:col8>'
				+'<gsx:col9>'+lon+'</gsx:col9><gsx:col10>'+employeestreetaddress+'</gsx:col10><gsx:col11>'+employeecity+'</gsx:col11><gsx:col12>'+employeestate+'</gsx:col12><gsx:col13>'
				+country+'</gsx:col13><gsx:col14>none</gsx:col14><gsx:col15>'+notes+'</gsx:col15><gsx:col16>'+employeeid+'</gsx:col16></entry>';
			Ti.API.info('xmldatastring existing to PUT: '+xmldatastring);
			employees.fetch();
			Alloy.Globals.Log("enteremployee.js::submit:: update DB with employeeid :" +employeeid);
			Alloy.Collections.labor.deleteCol1(employeeid);
				employees.get(employeeid).set({
					col1: 	employeeid.toString(),
					col2:	employeefirstname,
					col3:	employeelastname,
					col4:	employeejobtitle,
					col5:	employeephone,
					col6:	employeeemail,
					col7:	employeestreetaddress,
					col8:	employeecity,
					col9:	employeestate,
					col10:	country,
					col15:	notes
				}).save();
			alert('Modified & Saved Successfully!');
		} else {
			Alloy.Globals.Log("enteremployee.js::submit::POST on new: "+ employeeid+","+employeefirstname+","+employeelastname+","+employeejobtitle+","+employeephone+","+employeeemail+","+lat+","+lon+","
			+employeestreetaddress+","+employeecity+","+employeestate+","+country+","+notes+","+employeeid);
			var employeeid = now;
			$.save_button.titleid = employeeid; //feed id the save button of the customer id.
			var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
				+'<gsx:col1>'+employeeid+'</gsx:col1><gsx:col2>'+employeefirstname+'</gsx:col2><gsx:col3>'
				+employeelastname+'</gsx:col3><gsx:col4>'+employeejobtitle+'</gsx:col4><gsx:col5>'
				+employeephone+'</gsx:col5><gsx:col6>'+employeeemail+'</gsx:col6><gsx:col7>none</gsx:col7><gsx:col8>'+lat+'</gsx:col8>'
				+'<gsx:col9>'+lon+'</gsx:col9><gsx:col10>'+employeestreetaddress+'</gsx:col10><gsx:col11>'+employeecity+'</gsx:col11><gsx:col12>'
				+employeestate+'</gsx:col12><gsx:col13>'
				+country+'</gsx:col13><gsx:col14>none</gsx:col14><gsx:col15>'+notes+'</gsx:col15><gsx:col16>'+employeeid+'</gsx:col16></entry>';
			Ti.API.info('xmldatastring to POST: '+xmldatastring);
			xhr.open("POST", 'https://spreadsheets.google.com/feeds/list/'+spreadsheet_id+'/od6/private/full');
			Alloy.Globals.Log("enteremployee.js::submit:: add DB with employeeid :" +employeeid);
			Alloy.Globals.Log("enteremployee.js::submit::POST on new: "+xmldatastring);
			var dataModel = Alloy.createModel('labor',{
					col1: 	employeeid.toString(),
					col2:	(employeefirstname == " ")?'none':employeefirstname.trim(),
					col3:	(employeelastname == " ")?'none':employeelastname,
					col4:	(employeejobtitle == " ")?'none':employeejobtitle,
					col5:	(employeephone == " ")?'none':employeephone,
					col6:	(employeeemail == " ")?'none':employeeemail,
					col7:	"none",
					col8:	(lat == " ")?'none':lat,
					col9:	(lon == " ")?'none':lon,
					col10:	(employeestreetaddress == " ")?'none':employeestreetaddress,
					col11: 	(employeecity == " ")?'none':employeecity,
					col12: 	(employeestate == " ")?'none':employeestate,
					col13: 	(country == " ")?'none':country,
					col14: "none",
					col15: (notes == " ")?'none':notes,
					col16: employeeid.toString()
				});			
				dataModel.save();
			alert('Saved Successfully!');
		} 
	xhr.setRequestHeader("Content-type", "application/atom+xml");
	xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send(xmldatastring);
 }
 
 
var addnewemployeerow = [ $.existing, $.employeedetail_row, $.itemline_row, $.itemdetail_row, $.addrow_row, $.itemlineend_row ];

$.enteremployee_table.setData(addnewemployeerow)	;

$.check_employee.addEventListener('click', function(e){
	var employeeController = Alloy.createController('employee',{
			sourcecall: 'enteremployee'
		});
	employeeController.openMainWindow($.enteremployee_tab);
	
});

$.enteremployee_table.addEventListener('click', function(e){
	Alloy.Globals.Log("JSON stringify after table row is clicked : " +JSON.stringify(e));
	$.notes_tf.blur();
});

$.enteremployee_window.addEventListener("close",function(e){	
	callbackFunction();
});

 