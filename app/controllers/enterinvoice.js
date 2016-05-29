var args = arguments[0] || {};
Titanium.App.Properties.setString('selectclient',"false");
var total = 0;
exports.openMainWindow = function(_tab) {
  _tab.open($.enterinvoice_window);
  Ti.API.info("This is child widow enterinvoice.js" +JSON.stringify(_tab));
    //Alloy.Globals.checkNetworkAndGoogleAuthorized('1gnkP116nsTVxtrw6d_mXVdOiesQEPH7LVUIyHUfx9EE');
	(Alloy.Globals.googleAuthSheet.getAccessToken()) || Alloy.Globals.googleAuthSheet.Authorized();
	//googleAuth.authorize();
	
	Alloy.Globals.Log("enterinvoice.js::openMainWindow:: $.enterinvoice_table.data[0] count "+$.enterinvoice_table.data[0].rowCount+" contents: "+JSON.stringify($.enterinvoice_table.data[0].rows));
 	if (args.clienttitle) {  //when user select existing client
		selectClient(args);
	} else {
		//$.enterinvoice_table.setData(addnewclientrow)	;
		Titanium.App.Properties.setString('selectclient',"false");
		var toshow = [$.itemdetail_row, $.addrow_row, $.itemlineend_row,$.totalrow];
		for (x=0;x<toshow.length;x++){
			$.enterinvoice_table.appendRow(toshow[x]);
		};
		// required entry
	}
	
	Alloy.Globals.Log("enterinvoice.js::after selectClient::openMainWindow:: END $.enterinvoice_table.data[0].rows "+JSON.stringify($.enterinvoice_table.data[0].rows));
	for (i=0;i<$.enterinvoice_table.data[0].rowCount;i++) {		
 		Alloy.Globals.Log("children count : "	+$.enterinvoice_table.data[0].rows[i].children.length);
 		for (j=0;j<+$.enterinvoice_table.data[0].rows[i].children.length;j++) { 			
			Alloy.Globals.Log("enterinvoice.js::after selectClient::openMainWindow::END:JSON stringify table 0 row "+i+' : ' +JSON.stringify($.enterinvoice_table.data[0].rows[i]));
			Alloy.Globals.Log("nterinvoice.js::after selectClient::openMainWindow::END:JSON stringify table 0 row "+i+'w/children '+j+' : ' +JSON.stringify($.enterinvoice_table.data[0].rows[i].children[j]));		
		};
	};
	
	if(_tab.from == "clientlist_window"){
		var toshow = [$.itemdetail_row, $.addrow_row, $.itemlineend_row,$.totalrow];
		for (x=0;x<toshow.length;x++){
			$.enterinvoice_table.appendRow(toshow[x]);
		};
	}
};

	var maxdebug = Titanium.App.Properties.getInt('maxdebug');
	var mindebug = Titanium.App.Properties.getInt('mindebug');

Alloy.Globals.Log("enterinvoice.js::outside openMainWindow:: $.enterinvoice_table.data[0] count "+$.enterinvoice_table.data[0].rowCount+" contents: "+JSON.stringify($.enterinvoice_table.data[0].rows));

Alloy.Globals.Log("enterinvoice.js::JSON.stringify(args) : "+JSON.stringify(args));


if(args.clienttitle){
	var data = args.clienttitle.split(':');
	var name = data[0];
	var firstname = data[1];$.savebutton.clientfirstname = firstname || "none";
	var lastname = data[2];$.savebutton.clientlastname = lastname || "none";
	var name = firstname+" "+lastname;
	var company = data[3];$.savebutton.clientcompany = company || "none";
	var phone = data[4];$.savebutton.clientphone = phone || "none";
	var email = data[5];$.savebutton.clientemail = email || "none";
	var address = data[6];$.savebutton.clientaddress = address || "none";
	var city = data[7];$.savebutton.clientcity = city || "none";
	var state = data[8];$.savebutton.clientstate = state || "none";
	var country = data[9];$.savebutton.clientcountry = state || "none";
	var customerid = data[15];$.savebutton.customerid = customerid || "none";
	var uniqueid = customerid;
	(firstname)?$.invoiceclientfirstname_tf.value=firstname:$.invoiceclientfirstname_tf.value=" ";
	(lastname)?$.invoiceclientlastname_tf.value=lastname:$.invoiceclientlastname_tf.value=" ";
	(company)?$.invoiceclientcompany_tf.value=company:$.invoiceclientcompany_tf.value=" ";
	(phone)?$.invoiceclientphone_tf.value=phone:$.invoiceclientphone_tf.value=" ";
	(email)?$.invoiceclientemail_tf.value=email:$.invoiceclientemail_tf.value=" ";
	(address)?$.invoiceclientstreetaddress_tf.value=address:$.invoiceclientstreetaddress_tf.value=" ";
	(city)?$.invoiceclientcity_tf.value=city:$.invoiceclientcity_tf.value=" ";
	(state)?$.invoiceclientstate_tf.value=state:$.invoiceclientstate_tf.value=" ";
}


function addRows(){
 Alloy.Globals.Log("JSON stringify e : " +JSON.stringify(e));
// Defining new row
var newRow = Ti.UI.createTableViewRow({
title : 'Row ' + ($.enterinvoice_table.data[0].rowCount + 1)
});
 
// Adding row to the table view
///$.enterinvoice_table.appendRow(newRow);
}


var count = 3; //row where line item is entered
Titanium.App.Properties.setInt('count',count);

function addItem(e,itemTextField){
	var count = Titanium.App.Properties.getInt('count',3);
    Alloy.Globals.Log("count :" +count);
	//log
	Alloy.Globals.Log("JSON stringify e : " +JSON.stringify(e));
	Ti.API.info("data length " +$.enterinvoice_table.data.length);		
	Ti.API.info("table data 0 "+$.enterinvoice_table.data[0]);
	Ti.API.info("table row count : "+$.enterinvoice_table.data[0].rowCount);
	Alloy.Globals.Log("JSON stringify table data 0 : " +JSON.stringify($.enterinvoice_table.data[0]));
	/*
	for (i=0;i<$.enterinvoice_table.data[0].rowCount;i++) {			
		Ti.API.info($.enterinvoice_table.data[0].rows[i]);		
		Alloy.Globals.Log("JSON stringify table 0 row "+i+' : ' +JSON.stringify($.enterinvoice_table.data[0].rows[i]));
	}*/
	var itemval = count - 1;
	// Defining new test field
	var itemLabellist = Ti.UI.createLabel({
		id:"tflabellist" , 
		text:'item ' + itemval+' : ',
		font : {
			fontSize: '14',
			fontweight : 'normal'
		},
		left: '20',
		top: '10',
		color: "#3B708A"
		});
	var itemTextField = Titanium.UI.createTextField({
		id:"itemlist_tf",
		borderColor : 'white', // border color
    	width: Ti.UI.FILL,
    	left:'80',
    	top: '12',
    	font: {fontSize: '14'}
		});
	var itemLabelqty = Ti.UI.createLabel({
		id:"tflabelqty" , 
		text:'qty : ',
		font : {
			fontSize: '14',
			fontweight : 'normal'
		},
		top: '30',
		left: '20',
		color: "#3B708A"
		});
	var itemTextFieldqty = Titanium.UI.createTextField({
		id:"itemqty_tf",
		borderColor : 'white', // border color
    	top: '32',
    	left: '60',
    	width: '40',
    	hintText: '1',
    	width: '60',
    	keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD,
    	returnKeyType : Ti.UI.RETURNKEY_DONE,
    	font: {fontSize: '14'}
		});
	var itemLabelprice = Ti.UI.createLabel({
		id:"tflabelqty" , 
		text:'price : ',
		font : {
			fontSize: '14',
			fontweight : 'normal'
		},
		top: '30',
		left: '150',
		color: "#3B708A"
		});
	var itemTextFieldprice = Titanium.UI.createTextField({
		id:"itemprice_tf",
		borderColor : 'white', // border color
       	top: '32',
		left: '200',
		hintText: '160',
		width: '80',
		keyboardType: Ti.UI.KEYBOARD_DECIMAL_PAD,
		returnKeyType: Ti.UI.RETURNKEY_DONE, 
		border: 1, 
		width: 100,
    	font: {fontSize: '14'}
		});
	var toolbarDone = Ti.UI.createButton({systemButton: Titanium.UI.iPhone.SystemButton.DONE});
	var flexSpace = Titanium.UI.createButton({systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE});
	toolbarDone.addEventListener('click', function(){
		itemTextFieldprice.blur();
	});
	itemTextFieldprice.keyboardToolbarColor = '#80c342';
	itemTextFieldprice.keyboardToolbar = [flexSpace, toolbarDone];
	// Defining new row
	var newRow = Ti.UI.createTableViewRow({
		height: '50',
		borderColor : 'white',
		backgroundColor : "white"
	});
	newRow.add(itemLabellist);
	newRow.add(itemTextField);
	newRow.add(itemLabelqty);
	newRow.add(itemTextFieldqty);
	newRow.add(itemLabelprice);
	newRow.add(itemTextFieldprice);
    
	// Adding row to the table view
	$.enterinvoice_table.insertRowAfter(count,newRow);
	var count = count+1;
	Alloy.Globals.Log("new count :" +count);
	Titanium.App.Properties.setInt('count',count);
	
	itemTextField.addEventListener('blur', function(_e) {
 	var clientproject = itemTextField.value;
 	Ti.API.info("clientproject entered in dyn field is: "+clientproject);
 	Alloy.Globals.Log("e JSON of textfield: "+JSON.stringify(_e));
 });
 
 	itemTextFieldprice.addEventListener("blur",function(e){
		Alloy.Globals.Log("enterinvoice.js::itempricelabel eventListener:" +JSON.stringify(e));
		/* NOT NEEDED
		Alloy.Globals.Log("enterinvoice.js::itemTextFieldprice: isNaN("+e.source.value+")?total = "+total+":total = "+total+" + "+parseFloat(e.source.value)+";");
		isNaN(e.source.value)?total = total:total = total + parseFloat(e.source.value);
		Alloy.Globals.Log("enterinvoice.js::itemTextFieldprice: total :" + total);*/
		$.totalvalue.text = total;
	});
 
	//var textfield = Ti.UI.createTextField({keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD, returnKeyType: Ti.UI.RETURNKEY_DONE, backgroundColor: '#262626', border: 1, width: 100});

}

$.itemlist_tf.addEventListener('blur', function(_e) {
    var clientproject = $.itemlist_tf.value;
    Ti.API.info("clientproject entered is: "+clientproject);
    Titanium.App.Properties.setString('clientproject',clientproject);
    Ti.API.info("clientproject obtained is: "+Titanium.App.Properties.getString('clientproject',"none"));
    Alloy.Globals.Log("e JSON of textfield: "+JSON.stringify(_e));
 });
 
 var itemvalue =[];

 function saveHandler(e){
 	Alloy.Globals.Log("enterinvoice.js::saveHandler::JSON.stringify(e): "+JSON.stringify(e));
 	Alloy.Globals.Log("enterinvoice.js::saveHandler::JSON.stringify(args): "+JSON.stringify(args));
 	var clientfirstname = e.source.clientfirstname.trim();
 	var clientlastname = e.source.clientlastname.trim();
 	var customerid = e.source.customerid.trim();
 	var clientemail = e.source.clientemail.trim();
 	var clientcompany = e.source.clientcompany.trim();
 	var clientphone = e.source.clientphone.trim();
 	var clientaddress = e.source.clientaddress.trim();
 	var clientcity = e.source.clientcity.trim();
 	var clientstate = e.source.clientstate.trim();
 	var country = e.source.clientcountry.trim();
 	Alloy.Globals.Log("enterinvoice.js::saveHandler::customerid: clientfirstname: clientlastname "+customerid+" : "+clientfirstname+" : "+clientlastname);
 	var isSelectClientTrue = Titanium.App.Properties.getString('selectclient');
 	Alloy.Globals.Log("saving all data ");
 	Alloy.Globals.Log("isSelectClientTrue is:"+isSelectClientTrue);
 	tabledata = [];	
 	projectdata = [];
 	//suck in all the table value
 	for (i=0;i<$.enterinvoice_table.data[0].rowCount;i++) {		
 		Alloy.Globals.Log("children count : "	+$.enterinvoice_table.data[0].rows[i].children.length);
 		for (j=0;j<+$.enterinvoice_table.data[0].rows[i].children.length;j++) { 			
			Alloy.Globals.Log("JSON stringify table 0 row "+i+' : ' +JSON.stringify($.enterinvoice_table.data[0].rows[i]));
			Alloy.Globals.Log("JSON stringify table 0 row "+i+'w/children '+j+' : ' +JSON.stringify($.enterinvoice_table.data[0].rows[i].children[j]));
			tabledata.push({data1:$.enterinvoice_table.data[0].rows[i].children[j].id || "none",data2:$.enterinvoice_table.data[0].rows[i].children[j].value || "none"});		
		};
	};
	Alloy.Globals.Log("tabledata are: "+JSON.stringify(tabledata));
	var projectname = [];
	var projectdescr = [];
	var lineitem = [];
	var lineitemqty = [];
	var lineitemprice = [];
	for (i=0;i<tabledata.length;i++){
		if (tabledata[i].data1 == "projectname_tf") {  projectname.push({ name:tabledata[i].data2.trim() }); };
		if (tabledata[i].data1 == "projectdescr_tf") {  projectdescr.push({ descr:tabledata[i].data2.trim() }); };
		if (tabledata[i].data1 == "itemlist_tf") {  lineitem.push({ item:tabledata[i].data2.trim()}); };
		if (tabledata[i].data1 == "itemqty_tf") {  lineitemqty.push({ itemqty:tabledata[i].data2.trim() }); };
		if (tabledata[i].data1 == "itemprice_tf") {  lineitemprice.push({ itemprice:tabledata[i].data2.trim() }); };
	}
	Alloy.Globals.Log("lineitem: "+JSON.stringify(lineitem));
	Alloy.Globals.Log("lineitemqty: "+JSON.stringify(lineitemqty));
	Alloy.Globals.Log("lineitemprice: "+JSON.stringify(lineitemprice));
	var item = [];
	item.push({'name':projectname[0].name,'descr':projectdescr[0].descr});
	for (i=0;i<lineitem.length;i++){
		var price = lineitemprice[i].itemprice;
		if (lineitem[i].item != "none"){
			item.push({
				'lineitem':lineitem[i].item,
				'qty':lineitemqty[i].itemqty,
				'price':lineitemprice[i].itemprice
			});
		}
		Alloy.Globals.Log("enterinvoice.js:: itemprice_tf: in a Loop line#293:: isNaN("+price+")?total = "+total+":total = "+total+" + "+parseFloat(price)+";");
		isNaN(price)?total=total:total = total + parseFloat(price);
		Alloy.Globals.Log("enterinvoice.js::itemprice_tf: in a Loop line#293::: total :" + total);
	}
	$.totalvalue.text = total;
	Alloy.Globals.Log("enterproject::saveHandler:total price and JSON.stringify(item): "+total+" AND "+JSON.stringify(item));
	var projectdata = item;
	Alloy.Globals.Log("enterinvoice.js::saveHandler:projectdata: "+JSON.stringify(projectdata));
	var invoicenumber = Date.now();
	var projectid = invoicenumber;
	var name = clientfirstname+' '+clientlastname;
	var customerno = "2";
	var bal = "0";
	var paid = "0";
	var lastpaiddate = "1/1/2000";
	var followupdate = "1/1/2000";
	var duedate = "1/1/2000";
	var currency = "USD";
	var status = "owed";
	var clientproject = projectdata[0].name.trim();
 	var notes = JSON.stringify(projectdata).toString().replace(/:/g,'cOlOn');
 	var dates = "[{\"nextapptdate\"cOlOn\"01/01/0001\",\"duedate\"cOlOn\"01/01/0001\",\"lastpaiddate\"cOlOn\"01/01/0001\"}]";
	Alloy.Globals.Log("clientfirstname: "+clientfirstname+" clientlastname "+clientlastname);	
	if (name.match(/[A-Za-z].+/)) {		
		Alloy.Globals.Log('submit('+invoicenumber+','+clientfirstname+','+clientlastname+','+total+','+bal+','+paid+','+lastpaiddate+','+followupdate+','+customerid+','+clientemail+','+duedate+','
	+currency+','+status+','+clientphone+')');
		submit(invoicenumber,clientfirstname,clientlastname,total,bal,paid,lastpaiddate,followupdate,customerid,clientemail,duedate,currency,status,clientphone);
		Alloy.Globals.Log('submitproject('+clientproject+','+clientfirstname+','+clientlastname+','+clientcompany+','+clientphone+','+clientemail+','+clientaddress+','+clientcity+','+clientstate+','+country+','+notes+','
	+customerid+','+dates+','+projectid+')');
		submitproject(clientproject,clientfirstname,clientlastname,clientcompany,clientphone,clientemail,clientaddress,clientcity,clientstate,country,"Not Started",notes,customerid,"none",dates,projectid);
	}
	$.enterinvoice_window.setRightNavButton($.geninvoice);
	$.geninvoice.invoicenumber = invoicenumber;
	var subject = ["invoicenumber", "clientfirstname","clientlastname","clientcompany","clientphone","clientemail",
	"clientaddress","clientcity","clientstate","country","status","notes","customerid","dates","projectid"];
	for (i=0;i<subject.length;i++){
		eval("$.geninvoice."+subject[i]+" = "+subject[i]);
	}
 }; 
 
 function submit(invoicenumber,clientfirstname,clientlastname,total,bal,paid,lastpaiddate,followupdate,customerid,clientemail,duedate,currency,status,clientphone) {	
 	var now = new Date();
	var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
	+'<gsx:col1>'+invoicenumber+'</gsx:col1><gsx:col2>'+clientfirstname+'</gsx:col2><gsx:col3>'
	+clientlastname+'</gsx:col3><gsx:col4>'+total+'</gsx:col4><gsx:col5>'
	+bal+'</gsx:col5><gsx:col6>'+paid+'</gsx:col6><gsx:col7>'+lastpaiddate+'</gsx:col7><gsx:col8>'+followupdate+'</gsx:col8><gsx:col9>'+customerid
	+'</gsx:col9><gsx:col10>'+clientemail+'</gsx:col10><gsx:col11>'+duedate+'</gsx:col11><gsx:col12>'+clientphone+'</gsx:col12><gsx:col13>'+status+'</gsx:col13><gsx:col14>NA</gsx:col14><gsx:col15>NA</gsx:col15><gsx:col16>NA</gsx:col16></entry>';
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
    	Alloy.Globals.Log("enterinvoice::submit:: error e: "+JSON.stringify(e));
       alert("error:"+e.code+": Please connect to the network.");
    }
});
    //var spreadsheet_id = '1-Wz7Apn4AvVpfqcNyMgfqyKA8OAoLNy5Bl0d_jQ9IZk';
    var spreadsheet_id = Titanium.App.Properties.getString('invoice');
	xhr.open("POST", 'https://spreadsheets.google.com/feeds/list/'+spreadsheet_id+'/od6/private/full');
	xhr.setRequestHeader("Content-type", "application/atom+xml");
	xhr.setRequestHeader("Authorization", 'Bearer '+ googleAuth.getAccessToken());
	xhr.send(xmldatastring);
	Ti.API.info('done POSTed');

 }
 
 function submitproject(clientproject,clientfirstname,clientlastname,clientcompany,clientphone,clientemail,clientstreetaddress,clientcity,clientstate,country,status,notes,percentcompletion,nextappt,datedue,projectid) {	
    //var existingedithref = Titanium.App.Properties.getString('edithref');
    //var edithref = Titanium.App.Properties.getString('edithref');
   // var idtag = Titanium.App.Properties.getString('idtag');
   // var selfhref = Titanium.App.Properties.getString('selfhref');
 
 	var now = Date.now();

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
    		Ti.API.info("enterproject.js::submit: self href is : "+selfhref+" edit href is: "+edithref);
    		Ti.API.info("enterproject.js::submit: idtag is : "+idtag);
    		// Once success, feed data to DB
    	} catch(e){
    		Ti.API.info("cathing e: "+JSON.stringify(e));
    	}     
    },
    onerror: function(e) {
    	Alloy.Globals.Log("enterinvoice::submitproject::error e: "+JSON.stringify(e));
        alert("error:"+e.code+": Please connect to the network.");
    }
});

	var clients = Alloy.Collections.instance('client');
	var projects = Alloy.Collections.instance('project');
	var projectid = now;
	$.savebutton.projectid = projectid;
	var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
	+'<gsx:col1>'+clientproject+'</gsx:col1><gsx:col2>'+clientfirstname+'</gsx:col2><gsx:col3>'
	+clientlastname+'</gsx:col3><gsx:col4>'+clientcompany+'</gsx:col4><gsx:col5>'
	+clientphone+'</gsx:col5><gsx:col6>'+clientemail+'</gsx:col6><gsx:col7>'+clientstreetaddress+'</gsx:col7><gsx:col8>'+clientcity+'</gsx:col8><gsx:col9>'+clientstate
	+'</gsx:col9><gsx:col10>'+country+'</gsx:col10><gsx:col11>'+status+'</gsx:col11><gsx:col12>'+notes+'</gsx:col12><gsx:col13>'+percentcompletion+'</gsx:col13><gsx:col14>'+nextappt+'</gsx:col14><gsx:col15>'+datedue
	+'</gsx:col15><gsx:col16>'+projectid+'</gsx:col16></entry>';
	Ti.API.info('xmldatastring to POST: '+xmldatastring);
    //var spreadsheet_id = '1-Wz7Apn4AvVpfqcNyMgfqyKA8OAoLNy5Bl0d_jQ9IZk';
    var spreadsheet_id = Titanium.App.Properties.getString('project');
	xhr.open("POST", 'https://spreadsheets.google.com/feeds/list/'+spreadsheet_id+'/od6/private/full');
	alert('Saved Successfully!');
	xhr.setRequestHeader("Content-type", "application/atom+xml");
	xhr.setRequestHeader("Authorization", 'Bearer '+ googleAuth.getAccessToken());
	xhr.send(xmldatastring);
	Ti.API.info('done POSTed');
	//update the DB
	var item = "project"; var sid = Titanium.App.Properties.getString(item,"none"); Alloy.Globals.getPrivateData(sid,item);

 }
 
 
 $.enterinvoice_window.addEventListener('click',function(e){
	 	$.itemlist_tf.blur();
	 	$.itemqty_tf.blur();
	 	$.itemprice_tf.blur();
	 });
	 
 $.clientdetail_row.addEventListener('click',function(e){
	 	allTFBlur();
	 });
 
  function allTFBlur(){
 		$.itemlist_tf.blur();
	 	$.itemqty_tf.blur();
	 	$.itemprice_tf.blur();
 };
 
 $.itemprice_tf.addEventListener("blur",function(e){
 	    /* NOT NEEDED
 		Alloy.Globals.Log("enterinvoice.js:: itemprice_tf::singleton #443: isNaN("+e.source.value+")?total = "+total+":total = "+total+" + "+parseFloat(e.source.value)+";");
		isNaN(e.source.value)?total = total:total = total + parseFloat(e.source.value);
		Alloy.Globals.Log("enterinvoice.js::itemprice_tf::singleton #443: total :" + total);*/
		$.totalvalue.text = total;
 });

 
 	
 
// next phase not needed now start
 var selectprojectrow = [ $.existing, $.clientselect_row ];
 var addnewprojecttrow = [ $.existing, $.clientdetail_row, $.itemline_row, $.itemdetail_row, $.addrow_row, $.itemlineend_row,$.totalrow ];
 // end


// next phase not needed now start
// for project seletction
if (args.projecttitle) {
	selectClient(args);
	$.enterinvoice_table.setData(selectprojectrow)	;
	$.coverviewproject.hide();
	$.selectproject_button.hide();
} else {
	$.enterinvoice_table.setData(addnewprojecttrow)	;
	Titanium.App.Properties.setString('selectproject',"false");
	// required entry
}
 // end


function setClientExisting(args) {

}

var selectclientdialog = Ti.UI.createAlertDialog({
	cancel: 1,
	buttonNames: ['NO', 'YES'],
	message: 'They are existing proposals under this client, proceed?',
	title: 'Invoice exist'
});

function clientSelected() {
		//Alloy.Globals.Log("enterinvoice.js::after selectClient:: selectclientrow "+JSON.stringify(selectclientrow));
		Alloy.Globals.Log("enterinvoice.js::after selectClient::openMainWindow:: b4 exe $.enterinvoice_table.data[0].rowCount : "+$.enterinvoice_table.data[0].rowCount);
		Alloy.Globals.Log("enterinvoice.js::after selectClient::openMainWindow:: b4 exe $.enterinvoice_table.data[0] "+JSON.stringify($.enterinvoice_table.data[0].rows));
		$.coverview.hide();
		$.selectclient_button.hide();	
		//$.enterinvoice_table.deleteRow()
		/*
		var tohide = [$.itemdetail_row, $.addrow_row, $.itemlineend_row,$.totalrow];
		for (x=0;x<tohide.length;x++){
			$.enterinvoice_table.deleteRow(tohide[x]);
		}; //hide first*/
		Alloy.Globals.Log("enterinvoice.js::after selectClient::openMainWindow:: after exe $.enterinvoice_table.data[0].rowCount : "+$.enterinvoice_table.data[0].rowCount);
		Alloy.Globals.Log("enterinvoice.js::after selectClient::openMainWindow:: after exe $.enterinvoice_table.data[0] "+JSON.stringify($.enterinvoice_table.data[0].rows));
		addJobItemFromClientSelection();		
		$.enterinvoice_window.setRightNavButton($.savebutton);		
		Alloy.Globals.Log("enterinvoice.js::after selectClient::openMainWindow:: checking $.jobitem_row "+JSON.stringify($.jobitem_row));	
}


selectclientdialog.addEventListener("click",function(e){
	if (e.index == 1 ) {
		clientSelected();
	} else {return 100;};
});

function selectClient(args) {
	Titanium.App.Properties.setString('selectclient',"true");
			var data = args.clienttitle.split(':');
	var name = data[0];
	var firstname = data[1];
	var lastname = data[2];
	var fullname = firstname+" "+lastname;
	var company = data[3];
	var phone = data[4];
	var email = data[5];
	var address = data[6];
	var city = data[7];
	var state = data[8];
	var country = data[9];
	var fulladdress = address+", "+city+". "+state+", "+country;
	var invoice = data[10];
	var project = data[11];
	var proposal = data[12];
	var customerid = data[15];
	Alloy.Globals.Log("enterinvoice.js:selectClient: examine (args): "+JSON.stringify(args));
	var item = "invoice";
	var check = Alloy.Collections.instance(item);
	check.fetch();
	var found = check.where({col9:""+customerid+""});
	Alloy.Globals.Log("enterinvoice.js:selectClient: examine (found): "+JSON.stringify(found));
	if (found.length > 0) {
		selectclientdialog.show();
	} else { clientSelected();}
}

function matchClient() {
	var clientController = Alloy.createController('client',{
			sourcecall: 'enterinvoice'
		});
	clientController.openMainWindow($.enterinvoice_tab);
	Alloy.Globals.Log("enterinvoice.js:: examine clientController: "+JSON.stringify(clientController));
	$.selectclient_button.hide();
	$.coverview.hide();
	
	var someDummy = Alloy.Models.dummy;
	Alloy.Globals.Log("stringify dummy after selectClient :"+JSON.stringify(someDummy));
	someDummy.set('id', '1234');
	someDummy.fetch();
	someDummy.set('searchagain', 'Click here to search again.');
	someDummy.set('searchprojectagain', 'Click here to search again.');
}

function matchProject(){
	var projectController = Alloy.createController('project',{
			sourcecall: 'enterinvoice'
		});
	Alloy.Globals.Log("enterinvoice.js:: examine projectController: "+JSON.stringify(projectController));
	projectController.openMainWindow($.enterinvoice_tab);
}

$.invoiceclientfirstname_tf.addEventListener("focus",function(e){
	e.source.borderColor = "red";
	$.itemlist_tf.borderColor = "red";
	$.enterinvoice_window.setRightNavButton($.savebutton);
});

$.itemlist_tf.addEventListener("focus",function(e){
	e.source.borderColor = "red";
	$.invoiceclientfirstname_tf.borderColor = "red";
	$.enterinvoice_window.setRightNavButton($.savebutton);
});

$.enterinvoice_window.setRightNavButton();

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



$.enterinvoice_table.addEventListener('click', function(e){
	Alloy.Globals.Log("JSON stringify after table row is clicked : " +JSON.stringify(e));
		 	$.itemlist_tf.blur();
	 	$.itemqty_tf.blur();
	 	$.itemprice_tf.blur();
});
 
 function addJobItemFromClientSelection() {
 	
 
 
 if(args.clienttitle){  //Locate existing jobs.
 
if (uniqueid.match(/[0-9]/g)){
	projectitemsarray = [];
	projectnamesarray = [];
	var projects = Alloy.Collections.instance('project');
	projects.fetch();
	var theproject = projects.where({
		col13:uniqueid
		}); //FILTER
	if(theproject.length > 0){
		Alloy.Globals.Log("enterinvoice.js:: JSON.stringify(theproject): "+JSON.stringify(theproject));
		for (i=0;i<theproject.length;i++){
			var projectnames = theproject[i].toJSON().col1;
			var projectitems = theproject[i].toJSON().col12;
			projectitemsarray.push(projectitems);
			projectnamesarray.push(projectnames);
		}
		Alloy.Globals.Log("enterinvoice.js:: JSON.stringify(projectitemsarray): "+JSON.stringify(projectitemsarray));
	}
}

if(projectitemsarray.length>0){
	
for (i=0;i<projectitemsarray.length;i++) {
	Alloy.Globals.Log("enterinvoice.js:: JSON.stringify(projectnamesarray): "+JSON.stringify(projectnamesarray));	
	var projectitems = JSON.parse(projectitemsarray[i].replace(/cOlOn/g,":").toString());
	Alloy.Globals.Log("enterinvoice.js:: JSON.stringify(projectitems): "+JSON.stringify(projectitems));
	for (j=0;j<projectitems.length;j++){
		if (j==0){Alloy.Globals.Log("enterinvoice.js:: projectitems[0].descr: "+projectitems[j].descr);};	
		if (j>0){Alloy.Globals.Log("enterinvoice.js:: projectitems["+j+"].lineitem: "+projectitems[j].lineitem);};			
		}	
	}	
}

/// processing array in notes
if (projectitemsarray.length>0) {
	$.itemline_row.title = "Enter new project. Existing projects are added by default.";
	var topvalue = 10;
	// title start
	topvalue = topvalue + 10;
   	var blueline = Ti.UI.createImageView ({
        left  : "20",
        textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
        top : topvalue,
        width : "85%",
        height : "3",
        image : "blueline.png"
    });
	topvalue = topvalue + 10;
	var currentTitle = Ti.UI.createLabel ({
		color : "#333",
		textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
		left : "20",
		top : topvalue,
		font:{
			fontSize:18,
			fontWeight: "bold"
		},
		text : "Current projects:"
	});
	$.jobitem_row.add(blueline);
	$.jobitem_row.add(currentTitle);
	// title END
	for (x=0;x<projectitemsarray.length;x++) {
		var projectitems = JSON.parse(projectitemsarray[x].replace(/cOlOn/g,":").toString());   // replacing all cOlOn to ':'
		var projectname = projectnamesarray[x];
		if(maxdebug==1){
			Alloy.Globals.Log("enterinvoice.js:: createRow: projectnamesarray["+x+"]: "+projectnamesarray[x]);
			Alloy.Globals.Log("enterinvoice.js:: createRow: JSON.stringify(projectitems): "+JSON.stringify(projectitems));
			Alloy.Globals.Log("enterinvoice.js::topvalue at START : "+topvalue);
		};
		topvalue = topvalue + 30;
		var projectidentification=projectnamesarray[x].trim().replace(/\s/g,'_'); //
		var projectinfoarray=[];


		var unchecked = Ti.UI.createButton({
			id: projectidentification,
			top: topvalue,
			left: "85%",
			height : 30,
			width : 30,
			image : "square82.png"
		});
		var checked = Ti.UI.createButton({
			top: topvalue,
			left: "85%",
			height : 30,
			width : 30,
			image : "check70.png"
		});
		var projectnamelabel = Ti.UI.createLabel ({
			color : "#333",
			textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
			left : "20",
			top : topvalue,
			font:{
				fontSize:16,
				fontWeight: "bold"
			},
			text : projectnamesarray[x].trim()
		});
		var descr = projectitems[0].descr;
		topvalue = topvalue + 20;
		var descrtitlelabel = Ti.UI.createLabel ({
			left  : "20",
			textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
			top : topvalue,
			font:{
				fontSize:14
			},
			text : 'Description: '
		});
		var descrbodylabel = Ti.UI.createLabel ({
			color : "#333",
			left  : "120",
			textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
			top : topvalue,
			font:{
				fontSize:12
			},
			text : descr
		});
		var innerview = Ti.UI.createView({
	        width:"90%",
	        height:"85%",
	        backgroundColor:"white",
	        borderRadius:"10",
	        borderWidth:"0.1",
	        borderColor:"white"
		});	
		$.jobitem_row.add(projectnamelabel);
		//$.jobitem_row.add(unchecked);
		$.jobitem_row.add(descrtitlelabel);
		$.jobitem_row.add(descrbodylabel);
		if(maxdebug==1){
			Alloy.Globals.Log("enterinvoice.js:: addRow: projectnamelabel: "+x+" : " +projectnamesarray[x].trim());		
			//Alloy.Globals.Log("enterinvoice.js:: addRow: unchecked:  "+x+" : " +JSON.stringify(unchecked));		
			Alloy.Globals.Log("enterinvoice.js:: addRow: descrtitlelabel:   "+x+" :" +JSON.stringify(descrtitlelabel));		
			Alloy.Globals.Log("enterinvoice.js:: addRow: descrbodylabel:  "+x+" : " +descr);
		}
		topvalue=topvalue+18;
		var itemtitlelabel = Ti.UI.createLabel ({
			left  : "20",
			textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
			top : topvalue,
			font:{
				fontSize:14
			},
			text : 'List Item :'
		});
		if ( projectitems.length > 1) {$.jobitem_row.add(itemtitlelabel); }
		for (i=1;i<projectitems.length;i++){
			topvalue=topvalue+14;
			var itembodylabel = Ti.UI.createLabel ({
				color : "#333",
				left  : "20",
				textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
				top : topvalue,
				font:{
					fontSize:12
				},
				text : i+' :    '+projectitems[i].lineitem
			});	
			topvalue=topvalue+14;
			var itemqtylabel = Ti.UI.createLabel ({
				color : "#333",
				left  : "50%",
				textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
				top : topvalue,
				font:{
					fontSize:10
				},
				text : 'Qty :'+projectitems[i].qty
			});
			var itempricelabel = Ti.UI.createLabel ({
				color : "#333",
				left  : "75%",
				textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
				top : topvalue,
				font:{
					fontSize:10
				},
				text : 'Price : '+projectitems[i].price
			});	
			$.jobitem_row.add(itembodylabel);
			$.jobitem_row.add(itemqtylabel);
			$.jobitem_row.add(itempricelabel);
			if(maxdebug==1){
				Alloy.Globals.Log("enterinvoice.js:: addRow: itembodylabel: "+i+" : " +projectitems[i].lineitem);			
				Alloy.Globals.Log("enterinvoice.js:: addRow: itemqtylabel: "+i+" : " +projectitems[i].qty);			
				Alloy.Globals.Log("enterinvoice.js:: addRow: itempricelabel: "+i+" : " +projectitems[i].price);
			}			
			$.jobitem_row.iteminfo=[projectitems[i].lineitem,projectitems[i].qty,projectitems[i].price];
			var info={"names":projectnamesarray[x].trim(),"descr":projectitems[0].descr,"lineitem":projectitems[i].lineitem,"qty":projectitems[i].qty,"price":projectitems[i].price};
			projectinfoarray.push(info);
			//add total price	
			Alloy.Globals.Log("enterinvoice.js::itempricelabel:itempricelabel:existing project: isNaN("+projectitems[i].price+")?total = "+total+":total = "+total+" + "+parseFloat(projectitems[i].price)+";");
			isNaN(projectitems[i].price)?total = total:total = total + parseFloat(projectitems[i].price);
			Alloy.Globals.Log("enterinvoice.js::itempricelabel::(projectitems["+i+"].price)?total : "+projectitems[i].price+" : total: "+total);		
			//unchecked.titleid=projectinfoarray;
			//checked.titleid=projectinfoarray;
			if(maxdebug==1){Alloy.Globals.Log("enterinvoice.js::topvalue at Sub END : "+topvalue);};
		}
		topvalue=topvalue+20;
		var grayline = Ti.UI.createImageView({
			image: "grayline.png",
			height: "2",
			width: "90%",
			left: "20",
			top: topvalue
		});	
		$.jobitem_row.add(grayline);
		projectinfoarray=[];
		topvalue = topvalue + 4;
		if(maxdebug==1){
			Alloy.Globals.Log("enterinvoice.js:: addRow: grayline ");	
			Alloy.Globals.Log("enterinvoice.js:: table appendRow: " +JSON.stringify($.jobitem_row));		
			Alloy.Globals.Log("enterinvoice.js::topvalue at END : "+topvalue);
		}
	}
	$.enterinvoice_table.appendRow($.jobitem_row); // append row once.
	};
}
}

function genInvoice(e){
	Alloy.Globals.Log("enterinvoice.js::genInvoice: JSON.stringify(e): "+JSON.stringify(e));
}



