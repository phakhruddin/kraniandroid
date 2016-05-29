var args = arguments[0] || {};
Titanium.App.Properties.setString('selectclient',"false");
exports.openMainWindow = function(_tab) {
  _tab.open($.enterproposal_window);
  Ti.API.info("This is child widow schedule.js" +JSON.stringify(_tab));
    Alloy.Globals.checkNetworkAndGoogleAuthorized('1gnkP116nsTVxtrw6d_mXVdOiesQEPH7LVUIyHUfx9EE');
	//Alloy.Globals.checkGoogleisAuthorized();
};

function addRows(){
 console.log("JSON stringify e : " +JSON.stringify(e));
// Defining new row
var newRow = Ti.UI.createTableViewRow({
title : 'Row ' + ($.enterproposal_table.data[0].rowCount + 1)
});
 
// Adding row to the table view
$.enterproposal_table.appendRow(newRow);
}

$.enterproposal_table.addEventListener('click', function(e){
	console.log("JSON stringify after table row is clicked : " +JSON.stringify(e));
});

var count = 3; //row where line item is entered
Titanium.App.Properties.setInt('count',count);

function addItem(e,itemTextField){
	var count = Titanium.App.Properties.getInt('count',3);
    console.log("count :" +count);
	//log
	console.log("JSON stringify e : " +JSON.stringify(e));
	Ti.API.info("data length " +$.enterproposal_table.data.length);		
	Ti.API.info("table data 0 "+$.enterproposal_table.data[0]);
	Ti.API.info("table row count : "+$.enterproposal_table.data[0].rowCount);
	console.log("JSON stringify table data 0 : " +JSON.stringify($.enterproposal_table.data[0]));


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
	$.enterproposal_table.insertRowAfter(count,newRow);
	var count = count+1;
	console.log("new count :" +count);
	Titanium.App.Properties.setInt('count',count);
	
	itemTextField.addEventListener('blur', function(_e) {
 	var clientproject = itemTextField.value;
 	Ti.API.info("clientproject entered in dyn field is: "+clientproject);
 	console.log("e JSON of textfield: "+JSON.stringify(_e));
 });
 
 //blur all text field when touching window 
 	function allBlur(){
 		$.itemlist_tf.blur();
	 	$.itemqty_tf.blur();
	 	$.itemprice_tf.blur();
	 	itemTextFieldqty.blur();
	 	itemTextField.blur();
	 	itemTextFieldprice.blur();
 	};
	 $.itemline_row.addEventListener('click',function(e){
	 	allBlur();
	 });
	 
	 newRow.addEventListener('click',function(e){
	 	allBlur();
	 });
	 
	 $.clientdetail_row.addEventListener('click',function(e){
	 	allBlur();
	 });
	 
	 $.addrow_button.addEventListener('click',function(e){
	 	allBlur();
	 });
	
	//var textfield = Ti.UI.createTextField({keyboardType: Ti.UI.KEYBOARD_NUMBER_PAD, returnKeyType: Ti.UI.RETURNKEY_DONE, backgroundColor: '#262626', border: 1, width: 100});

}

$.itemlist_tf.addEventListener('blur', function(_e) {
    var clientproject = $.itemlist_tf.value;
    Ti.API.info("clientproject entered is: "+clientproject);
    Titanium.App.Properties.setString('clientproject',clientproject);
    Ti.API.info("clientproject obtained is: "+Titanium.App.Properties.getString('clientproject',"none"));
    console.log("e JSON of textfield: "+JSON.stringify(_e));
 });
 
 var itemvalue =[];

 function saveHandler(){
 	var isSelectClientTrue = Titanium.App.Properties.getString('selectclient');
 	console.log("saving all data ");
 	console.log("isSelectClientTrue is:"+isSelectClientTrue);
 	var tabledata = [];	
 	for (i=0;i<$.enterproposal_table.data[0].rowCount;i++) {		
 		console.log("children count : "	+$.enterproposal_table.data[0].rows[i].children.length);
 		for (j=0;j<+$.enterproposal_table.data[0].rows[i].children.length;j++) { 			
			//Ti.API.info($.enterproposal_table.data[0].rows[i].children[0]);		
			console.log("JSON stringify table 0 row "+i+' : ' +JSON.stringify($.enterproposal_table.data[0].rows[i]));
			console.log("JSON stringify table 0 row "+i+'w/children '+j+' : ' +JSON.stringify($.enterproposal_table.data[0].rows[i].children[j]));
			tabledata.push({data1:$.enterproposal_table.data[0].rows[i].children[j].id || "none",data2:$.enterproposal_table.data[0].rows[i].children[j].value || "none"});
			console.log("tabledata are: "+JSON.stringify(tabledata));
		};
	};
	//once tabledata is populated, find submission value
	var item = [];
	var itemqty = [];
	var itemprice = [];
	for (i=0;i<tabledata.length;i++){
		if (tabledata[i].data1 == "clientfirstname_tf") { var clientfirstname = tabledata[i].data2; };
		if (tabledata[i].data1 == "clientlastname_tf") { var clientlastname = tabledata[i].data2; };
		if (tabledata[i].data1 == "clientphone_tf") { var clientphone = tabledata[i].data2; };
		if (tabledata[i].data1 == "clientemail_tf") { var clientemail = tabledata[i].data2; };
		if (tabledata[i].data1 == "clientstreetaddress_tf") { var clientstreetaddress = tabledata[i].data2; };
		if (tabledata[i].data1 == "clientcity_tf") { var clientcity = tabledata[i].data2; };
		if (tabledata[i].data1 == "clientstate_tf") { var clientstate = tabledata[i].data2; };
		if (tabledata[i].data1 == "clientcompany_tf") { var clientcompany = tabledata[i].data2; };
		if (tabledata[i].data1 == "itemlist_tf") {  item.push({ descr:tabledata[i].data2 }); };
		if (tabledata[i].data1 == "itemqty_tf") {  itemqty.push({ qty:tabledata[i].data2 }); };
		if (tabledata[i].data1 == "itemprice_tf") {  itemprice.push({ price:tabledata[i].data2 }); };
	}	
	//console.log("checking clientfirstname ::: "+clientfirstname);
	if (!clientfirstname) { //no entry done. Get from existing.
		var someDummy = Alloy.Models.dummy;
		var fullname = someDummy.get('fullname');
		var clientfirstname = someDummy.get('firstname');
		var clientlastname = someDummy.get('lastname');
		var clientcompany = someDummy.get('company');
		var clientphone = someDummy.get('phone');
		var clientemail = someDummy.get('email');
		var clientstreetaddress = someDummy.get('address');
		var fulladdress = someDummy.get('fulladdress');
		var clientcity = someDummy.get('city');
		var clientstate = someDummy.get('state');
		var country = someDummy.get('country');
		console.log("after dummy  get, fullname is: "+fullname+" lastname is : "+clientlastname);	
	}
	console.log("item: "+JSON.stringify(item));
	console.log("itemqty: "+JSON.stringify(itemqty));
	console.log("itemprice: "+JSON.stringify(itemprice));
 }; 
 
 function submit() {		
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
	var clientsid = Titanium.App.Properties.getString('client');
	xhr.open("POST", 'https://spreadsheets.google.com/feeds/qty/'+clientsid+'/od6/private/full');
	xhr.setRequestHeader("Content-type", "application/atom+xml");
	xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send(xmldatastring);
	Ti.API.info('done POSTed');
 }
 
 $.enterproposal_window.addEventListener('click',function(e){
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
 
 var addnewclientrow = [ $.existing, $.clientdetail_row, $.itemline_row, $.itemdetail_row, $.addrow_row, $.itemlineend_row,$.totalrow ];
 var selectclientrow = [ $.existing, $.clientselect_row, $.itemline_row, $.itemdetail_row, $.addrow_row, $.itemlineend_row,$.totalrow ];

if (args.title) {
	selectClient(args);
	$.enterproposal_table.setData(selectclientrow)	;
} else {
	$.enterproposal_table.setData(addnewclientrow)	;
	Titanium.App.Properties.setString('selectclient',"false");
}

function setClientExisting(args) {

}

function selectClient(args) {
	Titanium.App.Properties.setString('selectclient',"true");
	var someDummy = Alloy.Models.dummy;
	console.log("stringify dummy after selectClient :"+JSON.stringify(someDummy));
	someDummy.set('id', '1234');
	someDummy.fetch();
	
			var data = args.title.split(':');
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
	
	console.log("dummy output is: "+fullname);
	
	someDummy.set('fullname', fullname);
	someDummy.set('firstname', firstname);
	someDummy.set('lastname', lastname);
	someDummy.set('company', company);
	someDummy.set('phone', phone);
	someDummy.set('email', email);
	someDummy.set('address', address);
	someDummy.set('fulladdress', fulladdress);
	someDummy.set('city', city);
	someDummy.set('state', state);
	someDummy.set('country', country);
	someDummy.set('firstname', firstname);
	someDummy.set('lastname', lastname);
	someDummy.set('name', name);
	someDummy.set('invoice', invoice);
	someDummy.set('project', project);
	someDummy.set('proposal', proposal);
}

$.check_client.addEventListener('click', function(e){
	var clientController = Alloy.createController('client',{
			sourcecall: 'enterproposal'
		});
	clientController.openMainWindow($.enterproposal_tab);
	
});


 



 