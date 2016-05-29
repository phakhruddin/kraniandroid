var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.invoicedetail_window);
  Ti.API.info("invoicedetail.js::This is child widow checking _tab on : " +JSON.stringify(_tab));
  Ti.API.info("invoicedetail.js:: input details : "+JSON.stringify(args));
  prefetchPayment(); //prefetch payment to get existing sid or to create new
  prefetchinvoicesent();
  $.totalbalance_row.addEventListener("click", function(e){
  	    var firstname = e.row.firstname;
  	    var lastname = e.row.lastname;
  	    var invoicenumber = e.row.invoicenumber;
  	    var filename = e.row.filename;
	  	//var sid = e.row.sid;
	  	eval("var sid = e.row."+filename+"_sid");
	  	Alloy.Globals.Log("invoicedetail.js::totalbalance_row:: JSON.stringify(e) "+JSON.stringify(e)+" with : "+firstname+" "+lastname+" : "+invoicenumber+" : "+sid+" : "+filename);
		if (sid){	
			var tabViewOneController = Alloy.createController("enterpayment",{
				title: args,
				firstname : firstname,
				lastname : lastname,
				invoicenumber : invoicenumber,
				sid : sid,
				callbackFunction : dummyRefresh, 
				myRefreshercallBack :myRefresher
			});
			tabViewOneController.openMainWindow($.tab_invoicedetail);
		} else {
			alert("Loading data from the cloud. Please click OK and try again.");
		}
  });
  //find deafult logo if need to generate invoice
  var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
  var name = kraniemailid.split('@')[0].trim();
  var parentid = Titanium.App.Properties.getString(name+"_invoice");
  Alloy.Globals.checkFileExistThenUpdateTitaniumProperties(name+"_defaultlogo"); //check the logo
};

 var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
 var name = kraniemailid.split('@')[0].trim();

invoicecallbackFunction = args.callbackFunction; //callback

Alloy.Collections.adhoc.deleteAll(); //reset adhoc tables.
var someDummy = Alloy.Models.dummy;
Alloy.Globals.Log("stringify dummy :"+JSON.stringify(someDummy));
someDummy.set({'id': '1234'});
someDummy.fetch();
var prevbal = newtotal = 0;

Alloy.Globals.Log("invoicedetail.js::checking JSON.stringify(args) prior to eval : " +JSON.stringify(args));
var data = args.title.split(':');
var invoicenumber = col1 = data[0]; $.totalbalance_row.invoicenumber = invoicenumber; 
var firstname = col2 = data[1]; $.totalbalance_row.firstname = firstname;
var lastname = col3 = data[2]; $.totalbalance_row.lastname = lastname;
var total = col4 = data[3];
var balance = col5 = data[4];
var paid = col6 = data[5];
var lastpaiddate = col7 = data[6];
var followupdate = col8 = data[7];
var customerid = col9 = data[8];
var email = col10 = data[9];
var duedate = col11 = data[10];
var phone = col12 = data[11];
var status = col13 = data[12];
var currency = col15 = data[14];
var notes = col14 = col16 = data[15];
var filename = 'payment_'+invoicenumber+'_'+firstname+'_'+lastname; $.totalbalance_row.filename = filename;
var invoicesentfilename = 'invoicesent_'+invoicenumber+'_'+firstname+'_'+lastname; $.action_row.invoicesentfilename = invoicesentfilename;
var idtag = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[0].replace('yCoLoNy',':'):"none";Titanium.App.Properties.setString('idtag',idtag);
var selfhref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[1].replace('yCoLoNy',':'):"none";Titanium.App.Properties.setString('selfhref',selfhref);
var edithref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[2].replace('yCoLoNy',':'):"none";Titanium.App.Properties.setString('edithref',edithref);
$.duedate_done.idtag = idtag;
$.duedate_done.selfhref = selfhref;
$.duedate_done.edithref = edithref;

if (balance == 0){
	$.phone_button.hide();
	$.email_button.hide();
	$.noaction_button.show();
	$.duedate_label.hide();
	$.balance1.hide();
	$.balance2.show();
} else {
	$.phone_button.show();
	$.email_button.show();
	$.noaction_button.hide();
	$.duedate_label.show();
	$.balance1.show();
	$.balance2.hide();
}

someDummy.set({'invoicenumber': 'Invoice#: '+invoicenumber,
	'firstname': firstname,
	'lastname': lastname,
	'phone': (phone != "NA")?phone.toString().replace(/^(...)(...)/g, "\($1\) $2-"):"",
	'email': email,
	'total': 'Total: '+total,
	'balance': balance,
	'paid': 'Paid: '+paid,
	'lastpaiddate': 'Last paid date: ' +lastpaiddate,
	'followupdate': 'Follow-up date: '+followupdate,
	'duedate':duedate,
	'notes': 'Notes: '+notes,
	'status': 'Status: '+status,
	'currency': (currency=="NA")?"USD":currency
});

//Feed in button with data info
$.email_button.data = data;

Alloy.Globals.Log("invoicedetail.js:: firstname and lastname is: "+firstname+" "+lastname);

//Locate customer id.
	var clients = Alloy.Collections.instance('client');
	clients.fetch();		
	var theclient = clients.where({
		col2:firstname,
		col3:lastname
		}); //FILTER
	Alloy.Globals.Log("invoicedetail.js:: number of clients are: "+clients.length);
	Alloy.Globals.Log("invoicedetail.js:: theclient is: "+JSON.stringify(theclient));
	if(theclient.length > 0){
		Alloy.Globals.Log("invocedetail.js:: JSON.stringify(theclient): "+JSON.stringify(theclient));
		var uniqueid = theclient[0].toJSON().col1;
		var company = theclient[0].toJSON().col4;
		var phone = theclient[0].toJSON().col5;
		var email = theclient[0].toJSON().col6;		
		var address = theclient[0].toJSON().col7;
		var city = theclient[0].toJSON().col8;
		var state = theclient[0].toJSON().col9;	
		Alloy.Globals.Log("invocedetail.js:: uniqueid: "+uniqueid);
	} else {
		alert("could not locate "+firstname+" "+lastname+" . Please try again.");
	}
	someDummy.set('customernumber', 'Customer#: '+(uniqueid)?uniqueid:"0000000000000");
	
//Locate jobs.
Alloy.Globals.Log("invocedetail.js:: locate jobs with uniqueid: "+uniqueid);
if (uniqueid){
	var uniqueid = uniqueid.toString().trim();
	projectitemsarray = [];
	projectnamesarray = [];
	var projects = Alloy.Collections.instance('project');
	projects.fetch();
	Alloy.Globals.Log("invocedetail.js:: JSON.stringify(projects): "+JSON.stringify(projects));
	var theproject = projects.where({
		col13:uniqueid
		}); //FILTER
	Alloy.Globals.Log("invocedetail.js:: locate jobs with uniqueid: "+uniqueid + " theproject.length "+theproject.length);
	Alloy.Globals.Log("invocedetail.js:: b4 JSON.stringify(theproject): "+JSON.stringify(theproject));
	if(theproject.length > 0){
		Alloy.Globals.Log("invocedetail.js:: JSON.stringify(theproject): "+JSON.stringify(theproject));
		for (i=0;i<theproject.length;i++){
			var projectnames = theproject[i].toJSON().col1;
			var projectitems = theproject[i].toJSON().col12;
			projectitemsarray.push(projectitems);
			projectnamesarray.push(projectnames);
		}
		Alloy.Globals.Log("invocedetail.js:: JSON.stringify(projectitemsarray): "+JSON.stringify(projectitemsarray));
	}
} else { Alloy.Globals.Log("unqueid is not a number: uniqueid: "+uniqueid);};
/*
if(projectitemsarray.length>0){

for (i=0;i<projectitemsarray.length;i++) {
	Alloy.Globals.Log("invocedetail.js:: JSON.stringify(projectnamesarray): "+JSON.stringify(projectnamesarray));	
	var projectitems = JSON.parse(projectitemsarray[i].replace(/cOlOn/g,":").toString());
	Alloy.Globals.Log("invocedetail.js:: JSON.stringify(projectitems): "+JSON.stringify(projectitems));
	for (j=0;j<projectitems.length;j++){
		if (j==0){Alloy.Globals.Log("invocedetail.js:: projectitems[0].descr: "+projectitems[j].descr);};	
		if (j>0){Alloy.Globals.Log("invocedetail.js:: projectitems["+j+"].lineitem: "+projectitems[j].lineitem);};			
		}	
	}	
}*/

/// processing array in notes
if (projectitemsarray && projectitemsarray.length>0) {
	var topvalue = 10;
	for (x=0;x<projectitemsarray.length;x++) {
		var projectitems = JSON.parse(projectitemsarray[x].replace(/cOlOn/g,":").toString());   // replacing all cOlOn to ':'
		var projectname = projectnamesarray[x];
		Alloy.Globals.Log("invocedetail.js:: createRow: projectnamesarray["+x+"]: "+projectnamesarray[x]);
		Alloy.Globals.Log("invocedetail.js:: createRow: JSON.stringify(projectitems): "+JSON.stringify(projectitems));
		Alloy.Globals.Log("invoicedetail.js::topvalue at START : "+topvalue);
		topvalue = topvalue + 8;
		var projectidentification=projectnamesarray[x].trim().replace(/\s/g,'_'); //
		var projectinfoarray=[];
		var unchecked = Ti.UI.createButton({
			id: projectidentification,
			top: topvalue,
			left: "85%",
			height : 30,
			width : 30,
			image : "EditControl.png"
		});
		var checked = Ti.UI.createButton({
			top: topvalue,
			left: "85%",
			height : 30,
			width : 30,
			image : "EditControlSelected.png"
		});
		topvalue = topvalue + 5;
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
		topvalue = topvalue + 25;
		var descrtitlelabel = Ti.UI.createLabel ({
			left  : "20",
			textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
			top : topvalue,
			font:{
				fontSize:14
			},
			text : 'Description: '
		});
		//calculate height of item description.
		var descr_height = ((Math.round(descr.split('').length/70)+(descr.split(/\r?\n|\r/).length))*14)+14;
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
		$.jobitem_row.add(unchecked);
		$.jobitem_row.add(descrtitlelabel);
		$.jobitem_row.add(descrbodylabel);
		topvalue=topvalue+20+descr_height-20;
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
			topvalue=topvalue+18;
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
			Alloy.Globals.Log("invoicedetail.js:: b4 balance: "+balance+" prevbal: "+prevbal+" projectitems[i].price: "+projectitems[i].price);
			//var balance = (projectitems[i].price = "none")?0:(projectitems[i].price+prevbal);
			if (projectitems[i].price !="none") {
				Alloy.Globals.Log("invoicedetail.js:: B4 total is : "+newtotal);
				var newtotal=parseFloat(newtotal)+parseFloat(projectitems[i].price);
				Alloy.Globals.Log("invoicedetail.js:: AFTER total is : "+newtotal);
			}
			Alloy.Globals.Log("invoicedetail.js:: total is : "+newtotal+" after balance: "+balance+" prevbal: "+prevbal+" projectitems[i].price: "+projectitems[i].price+" invoice no: "+invoicenumber);
			$.jobitem_row.add(itembodylabel);
			$.jobitem_row.add(itemqtylabel);
			$.jobitem_row.add(itempricelabel);
			$.jobitem_row.iteminfo=[projectitems[i].lineitem,projectitems[i].qty,projectitems[i].price];
			var info={"names":projectnamesarray[x].trim(),"descr":projectitems[0].descr,"lineitem":projectitems[i].lineitem,"qty":projectitems[i].qty,"price":projectitems[i].price};
			projectinfoarray.push(info);
			unchecked.titleid=projectinfoarray;
			checked.titleid=projectinfoarray;
			Alloy.Globals.Log("invoicedetail.js::topvalue at Sub END : "+topvalue);
		}
		topvalue=topvalue+20;
		var grayline = Ti.UI.createImageView({
			image: "list_divider@2x.png",
			height: "2",
			width: "90%",
			left: "20",
			top: topvalue
		});	
		$.jobitem_row.add(grayline);
		projectinfoarray=[];
		topvalue = topvalue + 4;
		Alloy.Globals.Log("invoicedetail.js::topvalue at END : "+topvalue);	
	}
	var newbal = parseFloat(newtotal)-parseFloat(paid);	
	Titanium.App.Properties.setString(invoicenumber+'_balance',prevbal);
	//Delay 1 secs. Too much conflict for concurrent edit. error code 409
	var edithref = Titanium.App.Properties.getString('edithref');
    var idtag = Titanium.App.Properties.getString('idtag');
    var selfhref = Titanium.App.Properties.getString('selfhref');
	if (edithref) {		
		Alloy.Globals.Log("invoicedetail.js: update spreadsheet and database with new balance: "+prevbal+" executing Alloy.Globals.updateExistingSpreadsheetAndDB");
		Alloy.Globals.updateExistingSpreadsheetAndDB("invoice",col1,col2,lastname,newtotal,newbal,paid,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16,edithref,selfhref,idtag);
	}		
	
} else {
	Alloy.Globals.Log("invoicedetail.js:: NO projectitemsarray: need client refresh ");
	var clientsid = Titanium.App.Properties.getString("client");
	Alloy.Globals.getPrivateData(clientsid,"client");
	var clientcollection  = Alloy.Collections.instance('client');
    clientcollection.fetch();
    alert("Invoice data downloaded. Please try again.");
};

//prep adhoc tables.
var adhocs = Alloy.Collections.instance('adhoc');

//selection on invoce.
$.jobitem_row.addEventListener("click",function(e){
	if (e.source.titleid) {
		Alloy.Globals.Log("invoicedetail.js::jobitem_row event listener: JSON.stringify(e): "+JSON.stringify(e));
		if (e.source.image=="EditControl.png"){
			Alloy.Globals.Log("invoicedetail.js::after "+e.source.image+" clicked: JSON.stringify(e): "+JSON.stringify(e));
			Alloy.Globals.Log("invoicedetail.js::after "+e.source.image+" clicked: retrieved JSON.stringify(e.source.titleid): "+JSON.stringify(e.source.titleid));
			var info=e.source.titleid;
			var infostring = JSON.stringify(e.source.titleid);
			var infostringmod = (infostring)?infostring.replace(/\[/g,"xSqBracketOpen").replace(/\]/g,"xSqBracketClose"):"";
			Alloy.Globals.Log("invoicedetail.js::after "+e.source.image+" clicked: retrieved project name at Pos 0 again: "+info[0].names);
			e.source.image="EditControlSelected.png";
			var itemid = Date.now().toString();
			//update adhoc table.
			var dataModel = Alloy.createModel("adhoc",{
	                                        col1 :  itemid,
	                                        col2 : info[0].names,
	                                        col3 : infostringmod, 
	                                        //col4:	projectitems[i].price
	                                });     
	        dataModel.save();
			adhocs.fetch();
			Alloy.Globals.Log("invoicedetail.js:: aftere adhocs add & fetch: "+JSON.stringify(adhocs));
			// tag source with itemid
			e.source.itemid=itemid;
			Alloy.Globals.Log("invoicedetail.js::itemid, "+itemid+", stamp to "+e.source.image+" clicked: JSON.stringify(e): "+JSON.stringify(e));
		} else {
			Alloy.Globals.Log("invoicedetail.js::after "+e.source.image+" clicked: JSON.stringify(e): "+JSON.stringify(e));
			e.source.image="EditControl.png";
			var itemid=e.source.itemid;
			adhocs.fetch();
			var theadhoc = adhocs.where({
				col1:itemid
				}); 
			Alloy.Globals.Log("invoicedetail.js::to uncheck: theadhoc is: "+JSON.stringify(theadhoc));
			Alloy.Globals.Log("invoicedetail.js::to uncheck: adhocs is: "+JSON.stringify(adhocs));
			Alloy.Collections.adhoc.deleteCol1(itemid);
			adhocs.fetch();
			Alloy.Globals.Log("invoicedetail.js::to uncheck: adhocs after delete : "+JSON.stringify(adhocs));
		}
	}
});


// PDF GENERATOR
var price = 100;
var qty = 10;
var subtotal = 1000;
//var logourl = "https://docs.google.com/drawings/d/1Z3O9n2O1rS5CBQuMJwiRSouJRaRRZFVS8-N5zEocN8c/pub?w=144&h=144";
//var logourl = "https://docs.google.com/uc?id=0B22E-wz0NGrrSE9aWVpGSEFDSmM&export=download";
var logourl = Titanium.App.Properties.getString('logourl');
function emailpdf(firstname,lastname,address,city,state,phone,email,invoicenumber,company,total,balance,paid,lastpaiddate,duedate,price){
	
	Alloy.Globals.Log("invoicedetail.js::emailpdf::  firstname " + firstname 	+" lastname " + lastname 	+" address " + address 	+" city " + city 	
	+" state " + state 	+" phone " + phone 	+" email " + email 	+" invoicenumber " + invoicenumber 	+" company " + company 	+" total " + total 	
	+" balance " + balance 	+" paid " + paid 	+" lastpaiddate " + lastpaiddate 	+" duedate " + duedate 	+" price " + price);
	
	var html2pdf = require('com.factisresearch.html2pdf');  
 	Ti.API.info("module is => " + html2pdf);
 	
 	var oldfile = Ti.Filesystem.getFile('invoice.pdf'); if (oldfile.exists()) { oldfile.deleteFile(); } // cleanup old file
   
 	html2pdf.addEventListener('pdfready', function(e) {
 		Alloy.Globals.Log("invoicedetail.js::html2pdf.addEventListener: pdf is ready.");
 		$.invoicedetail_window.title = "Uploading to cloud. Please wait..." ; 
	    var file = Ti.Filesystem.getFile(e.pdf);   
	    Alloy.Globals.Log("invoicedetail.js::html2pdf.addEventListener:: Ti.Filesystem.applicationDataDirectory "+Ti.Filesystem.applicationDataDirectory);
		var oldfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'invoice.pdf');
		if (oldfile.exists()) { oldfile.deleteFile(); }
		var orgfile =  Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'Expose.pdf');
        var renamesuccess = orgfile.rename('invoice.pdf');
        Alloy.Globals.Log("invoicedetail.js::html2pdf.addEventListener:: renamesuccess "+renamesuccess);
		 ///var emailDialog = Ti.UI.createEmailDialog();  
		 ///var newfile = file.rename('invoice.pdf');
		 //emailDialog.addAttachment(Ti.Filesystem.getFile(e.pdf));
		 //emailDialog.open();  
		 ///file.rename('invoice.pdf');
		 var url = '../Documents/invoice.pdf';
		 //var url = '../Documents/Expose.pdf';
		 var newurl = Ti.Filesystem.getFile(url);
		 var file = 'invoice.pdf';
		 Alloy.Globals.Log("opening viewpdf(url) on "+file);
		 ///viewpdf(file);
		 (Alloy.Globals.googleAuthSheet.getAccessToken()) || Alloy.Globals.googleAuthSheet.Authorized();
		 //Set filename for uploaded file
		 var date = new Date();
		 var dateinsert = date.getFullYear()+""+(date.getMonth()+1)+""+date.getDate()+""+date.getHours()+""+date.getMinutes()+""+date.getSeconds();
		 var pdffilename = invoicenumber+"_"+firstname+"_"+lastname+"_"+dateinsert;
		 var predocViewer = Ti.UI.iOS.createDocumentViewer({url:'invoice.pdf'});
		 //var imagefile = predocViewer.toImage();
		 var jpgfilename = "jpg_"+invoicenumber+"_"+firstname+"_"+lastname+"_"+dateinsert;
		 var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
		 var name = kraniemailid.split('@')[0].trim();
		 var parentid = Titanium.App.Properties.getString(name+"_invoice");
		 Alloy.Globals.Log(new Date()+"::invoicedetail.js::html2pdf::Alloy.Globals.uploadFile("+file+","+pdffilename+","+parentid+")");
		 //Alloy.Globals.uploadFile(file,pdffilename,parentid) ;
		 var col1 = Date.now();
		Alloy.Globals.Cleanup(); //cleanup existing edithref.
		Alloy.Globals.uploadPDFFileCreateSnapshotSubmit(file,pdffilename,parentid,"2","invoicesent",col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16);
		setTimeout(function(){prefetchinvoicesent();},2000); // after 2 secs. refresh DB.
		//Alloy.Globals.uploadFile(imagefile,jpgfilename) ;
		 //Added for PNG snapshot
		 //Alloy.Globals.createImageSnapshotofPDFandUpload(file,pdffilename+"_image",parentid);
		 setTimeout(function(){
		 	viewpdf(file);
		 	$.invoicedetail_window.title = "Invoice Detail" ;
		 	$.invoice_button.title = " Generate New Invoice" ;
		 	$.invoice_button.image = "pdf.png" ;
		 	$.invoice_button.color = "#007AFF" ;
		 	
	 		},21000); // after 11 secs when the image is finished uploaded	
  	});  
 	
 	//var html = '<html><body><p>dBayCo Inc. limited </p></body></html>'; 
 	
 	//var html="";
	//html += "<html><body><div id=\"top-bar\"><div id=\"doc-title\"><span class=\"name\">sample invoice : Sheet1<\/span><\/div><\/div><div id=\"sheets-viewport\"><div id=\"0\" style=\"display:none;position:relative;\" dir=\"ltr\"><div class=\"ritz grid-container\" dir=\"ltr\"><table class=\"waffle\" cellspacing=\"0\" cellpadding=\"0\"><thead><tr><th class=\"row-header freezebar-origin-ltr header-shim row-header-shim\"><\/th><th id=\"0C0\" style=\"width:195px\" class=\"header-shim\"><\/th><th id=\"0C1\" style=\"width:286px\" class=\"header-shim\"><\/th><th id=\"0C2\" style=\"width:100px\" class=\"header-shim\"><\/th><th id=\"0C3\" style=\"width:100px\" class=\"header-shim\"><\/th><th id=\"0C4\" style=\"width:100px\" class=\"header-shim\"><\/th><\/tr><\/thead><tbody><tr style='height:20px;'><th id=\"0R0\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">1<\/div><\/th><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><\/tr><tr style='height:20px;'><th id=\"0R1\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">2<\/div><\/th><td class=\"s0\" dir=\"ltr\" colspan=\"5\">DbayCo Inc. 130 Moreland Rd., Brookfield, WI 53222<\/td><\/tr><tr style='height:20px;'><th id=\"0R2\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">3<\/div><\/th><td class=\"s1\" dir=\"ltr\" colspan=\"5\">Phone: 262-501-2948, Fax: 262-290-3141. Email: deen@idevice.net<\/td><\/tr><tr style='height:20px;'><th id=\"0R3\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">4<\/div><\/th><td class=\"s2\" colspan=\"5\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R4\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">5<\/div><\/th><td class=\"s3\" dir=\"ltr\" colspan=\"3\">INVOICE<\/td><td class=\"s0\" dir=\"ltr\" colspan=\"2\">WAN-20150225-1<\/td><\/tr><tr style='height:20px;'><th id=\"0R5\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">6<\/div><\/th><td class=\"s2\" colspan=\"2\" rowspan=\"2\"><\/td><td class=\"s2\" colspan=\"3\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R6\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">7<\/div><\/th><td class=\"s4\"><\/td><td class=\"s5\" dir=\"ltr\"><\/td><td class=\"s5\" dir=\"ltr\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R7\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">8<\/div><\/th><td class=\"s2\" dir=\"ltr\">Wannoorbaya WChik<\/td><td class=\"s2\" rowspan=\"4\"><\/td><td class=\"s5\" dir=\"ltr\"><\/td><td class=\"s5\" dir=\"ltr\">230<\/td><td class=\"s5\" dir=\"ltr\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R8\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">9<\/div><\/th><td class=\"s2\" dir=\"ltr\">2258 S Sanctuary Dr<\/td><td class=\"s5\" dir=\"ltr\"><\/td><td class=\"s5\" dir=\"ltr\"><\/td><td class=\"s6\" dir=\"ltr\">due 4\/1\/2015<\/td><\/tr><tr style='height:20px;'><th id=\"0R9\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">10<\/div><\/th><td class=\"s2\" dir=\"ltr\">New Berlin, WI 53151<\/td><td class=\"s2\" colspan=\"3\" rowspan=\"2\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R10\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">11<\/div><\/th><td class=\"s2\" dir=\"ltr\">Date: 2\/28\/2014<\/td><\/tr><tr style='height:20px;'><th id=\"0R11\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">12<\/div><\/th><td class=\"s2\" colspan=\"5\" rowspan=\"2\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R12\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">13<\/div><\/th><\/tr><tr style='height:20px;'><th id=\"0R13\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">14<\/div><\/th><td class=\"s7\" dir=\"ltr\">Item no.<\/td><td class=\"s7\" dir=\"ltr\">Description<\/td><td class=\"s7\" dir=\"ltr\">Qty<\/td><td class=\"s7\" dir=\"ltr\">Unit\/Price<\/td><td class=\"s8\" dir=\"ltr\">Price<\/td><\/tr><tr style='height:20px;'><th id=\"0R14\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">15<\/div><\/th><td class=\"s2\" dir=\"ltr\"><\/td><td class=\"s2\" dir=\"ltr\"><\/td><td class=\"s2\" dir=\"ltr\"><\/td><td class=\"s2\" dir=\"ltr\"><\/td><td class=\"s2\" dir=\"ltr\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R15\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">16<\/div><\/th><td class=\"s9\" dir=\"ltr\">1<\/td><td class=\"s2\" dir=\"ltr\">Mow Lawn<\/td><td class=\"s9\" dir=\"ltr\">1<\/td><td class=\"s9\" dir=\"ltr\">100<\/td><td class=\"s10\" dir=\"ltr\">100<\/td><\/tr><tr style='height:20px;'><th id=\"0R16\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">17<\/div><\/th><td class=\"s9\" dir=\"ltr\">2<\/td><td class=\"s2\" dir=\"ltr\">Cut Trees<\/td><td class=\"s9\" dir=\"ltr\">1<\/td><td class=\"s9\" dir=\"ltr\">120<\/td><td class=\"s10\" dir=\"ltr\">120<\/td><\/tr><tr style='height:20px;'><th id=\"0R17\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">18<\/div><\/th><td class=\"s11\"><\/td><td class=\"s11\"><\/td><td class=\"s11\"><\/td><td class=\"s11\" dir=\"ltr\"><\/td><td class=\"s12\" dir=\"ltr\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R18\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">19<\/div><\/th><td><\/td><td><\/td><td class=\"s13\"><\/td><td class=\"s13\" dir=\"ltr\">SubTotal<\/td><td class=\"s10\" dir=\"ltr\">220<\/td><\/tr><tr style='height:20px;'><th id=\"0R19\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">20<\/div><\/th><td><\/td><td><\/td><td class=\"s13\"><\/td><td class=\"s13\" dir=\"ltr\">Tax<\/td><td class=\"s10\" dir=\"ltr\">10<\/td><\/tr><tr style='height:20px;'><th id=\"0R20\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">21<\/div><\/th><td><\/td><td><\/td><td class=\"s13\"><\/td><td class=\"s13\" dir=\"ltr\">Other<\/td><td class=\"s10\" dir=\"ltr\">0<\/td><\/tr><tr style='height:20px;'><th id=\"0R21\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">22<\/div><\/th><td><\/td><td><\/td><td class=\"s13\"><\/td><td class=\"s13\" dir=\"ltr\">Discount<\/td><td class=\"s10\" dir=\"ltr\">0<\/td><\/tr><tr style='height:20px;'><th id=\"0R22\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">23<\/div><\/th><td><\/td><td><\/td><td class=\"s13\" dir=\"ltr\"><\/td><td class=\"s13\" dir=\"ltr\">Paid<\/td><td class=\"s10\" dir=\"ltr\">0<\/td><\/tr><tr style='height:20px;'><th id=\"0R23\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">24<\/div><\/th><td><\/td><td><\/td><td class=\"s14\" dir=\"ltr\">Total due by<\/td><td class=\"s15\" dir=\"ltr\">4\/1\/2015<\/td><td class=\"s15\" dir=\"ltr\">230<\/td><\/tr><\/tbody><\/table><\/div><\/div><\/div><\/body><\/html>";
	/*var coName = 'Jack Mow Inc.';
	var coAddress = "1125 Bluemound Rd., Brookfield, WI 53222";
	var coPhone = "262-290-3141";
	var coFax = "262-290-3142";
	var coEmail = "sales@jackmowinc.com";*/
	
	var coName = Titanium.App.Properties.getString("coName");
	var coAddress = Titanium.App.Properties.getString("coStreetAddress")+", \n"+Titanium.App.Properties.getString("coCity")
					+", "+Titanium.App.Properties.getString("coState")+" "+Titanium.App.Properties.getString("coZip");
	var tmpphone = Titanium.App.Properties.getString("coPhone");
	if(tmpphone) {var coPhone = "("+tmpphone.substr(0,3)+")"+tmpphone.substr(3,3)+"-"+tmpphone.substr(6,4);} else var tmpphone="";
	var coEmail = Titanium.App.Properties.getString('kraniemailid');
	var invoiceno = invoicenumber;
	
	if (phone) { var custphone = "("+phone.substr(0,3)+")"+phone.substr(3,3)+"-"+phone.substr(6,4);} else var custphone = "";
	
	adhocs.fetch();
	Alloy.Globals.Log("invoicedetail.js::emailpdf:: adhocs contents "+JSON.stringify(adhocs)); 
	Alloy.Globals.Log("invoicedetail.js::emailpdf:: adhocs.length: "+adhocs.length); 
	var strVarItems="";
	for (i=0;i<adhocs.length;i++){
		Alloy.Globals.Log("invoicedetail.js::emailpdf:: adhocs.models["+i+"].toJSON().col3: "+adhocs.models[i].toJSON().col3);
		var jobitemstring=adhocs.models[i].toJSON().col3.replace(/xSqBracketOpen/,'[').replace(/xSqBracketClose/,']');
		Alloy.Globals.Log("invoicedetail.js::emailpdf:: adhocs extraction: jobitemstring.length "+jobitemstring.length+ "jobitemstring : "+jobitemstring);
		var jobitemjson = JSON.parse(jobitemstring);
		for (j=0;j<jobitemjson.length;j++){
			var names=jobitemjson[0].names;
			Alloy.Globals.Log("invoicedetail.js::emailpdf:: adhocs extraction:  names : "+jobitemjson[j].names+" : "+jobitemjson[j].descr+" : "+jobitemjson[j].lineitem+" : "+jobitemjson[j].price+" : "+jobitemjson[j].qty);
			strVarItems += "				<tbody>";
			strVarItems += "					<tr>";
			if(j>0){
				Alloy.Globals.Log("invoicedetail.js::emailpdf:: names comparison:  "+jobitemjson[j].names+" vs. "+jobitemjson[j-1].names);
				if(jobitemjson[j].names==jobitemjson[j-1].names){
					strVarItems += "						<td><a class=\"cut\">-<\/a><span contenteditable> <\/span><\/td>";
				} else {
					strVarItems += "						<td><a class=\"cut\">-<\/a><span contenteditable>"+jobitemjson[j].names+"<\/span><\/td>";
				}
				if(jobitemjson[j].descr==jobitemjson[j-1].descr){
					strVarItems += "						<td><span contenteditable> <\/span><\/td>";
				} else {
					strVarItems += "						<td><span contenteditable>"+jobitemjson[j].descr+"<\/span><\/td>";
				}
			} else {
				strVarItems += "						<td><a class=\"cut\">-<\/a><span contenteditable>"+jobitemjson[j].names+"<\/span><\/td>";
				strVarItems += "						<td><span contenteditable>"+jobitemjson[j].descr+"<\/span><\/td>";
			}
			strVarItems += "						<td><span contenteditable>"+jobitemjson[j].lineitem+"<\/span><\/td>";
			strVarItems += "						<td><span contenteditable>"+jobitemjson[j].qty+"<\/span><\/td>";
			(isNaN(jobitemjson[j].price))?strVarItems += "						<td><span>"+jobitemjson[j].price+"<\/span><\/td>":strVarItems += "						<td><span data-prefix>$<\/span><span>"+jobitemjson[j].price+"<\/span><\/td>";
			strVarItems += "					<\/tr>";
			strVarItems += "				<\/tbody>";
		}
	}
  
	var strVar="";
	strVar += "<html>";
	strVar += "	<head>";
	strVar += "		<meta charset=\"utf-8\">";
	strVar += "		<title>Invoice<\/title>";
	strVar += "<style>";
	strVar += "    \/* reset *\/";
	strVar += "";
	strVar += "*";
	strVar += "{";
	strVar += "	border: 0;";
	strVar += "	box-sizing: content-box;";
	strVar += "	color: inherit;";
	strVar += "	font-family: inherit;";
	strVar += "	font-size: inherit;";
	strVar += "	font-style: inherit;";
	strVar += "	font-weight: inherit;";
	strVar += "	line-height: inherit;";
	strVar += "	list-style: none;";
	strVar += "	margin: 0;";
	strVar += "	padding: 0;";
	strVar += "	text-decoration: none;";
	strVar += "	vertical-align: top;";
	strVar += "}";
	strVar += "";
	strVar += "\/* content editable *\/";
	strVar += "";
	strVar += "*[contenteditable] { border-radius: 0.25em; min-width: 1em; outline: 0; }";
	strVar += "";
	strVar += "*[contenteditable] { cursor: pointer; }";
	strVar += "";
	strVar += "*[contenteditable]:hover, *[contenteditable]:focus, td:hover *[contenteditable], td:focus *[contenteditable], img.hover { background: #DEF; box-shadow: 0 0 1em 0.5em #DEF; }";
	strVar += "";
	strVar += "span[contenteditable] { display: inline-block; }";
	strVar += "";
	strVar += "\/* heading *\/";
	strVar += "";
	strVar += "h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }";
	strVar += "";
	strVar += "\/* table *\/";
	strVar += "";
	strVar += "table { font-size: 75%; table-layout: fixed; width: 100%; }";
	strVar += "table { border-collapse: separate; border-spacing: 2px; }";
	strVar += "th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }";
	strVar += "th, td { border-radius: 0.25em; border-style: solid; }";
	strVar += "th { background: #EEE; border-color: #BBB; }";
	strVar += "td { border-color: #DDD; }";
	strVar += "";
	strVar += "\/* page *\/";
	strVar += "";
	strVar += "html { font: 16px\/1 'Open Sans', sans-serif; overflow: auto; padding: 0.5in; }";
	strVar += "html { background: #999; cursor: default; }";
	strVar += "";
	strVar += "body { box-sizing: border-box; height: auto; margin: 0 auto; overflow: hidden; padding: 0.5in; width: 8.5in; }";
	strVar += "body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }";
	strVar += "";
	strVar += "\/* header *\/";
	strVar += "";
	strVar += "header { margin: 0 0 3em; }";
	strVar += "header:after { clear: both; content: \"\"; display: table; }";
	strVar += "";
	strVar += "header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }";
	strVar += "header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }";
	strVar += "header address p { margin: 0 0 0.25em; }";
	strVar += "header span, header img { display: block; float: right; }";
	strVar += "header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }";
	strVar += "header img { max-height: 100%; max-width: 100%; }";
	strVar += "header input { cursor: pointer; -ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\"; height: 100%; left: 0; opacity: 0; position: absolute; top: 0; width: 100%; }";
	strVar += "";
	strVar += "\/* article *\/";
	strVar += "";
	strVar += "article, article address, table.meta, table.inventory { margin: 0 0 3em; }";
	strVar += "article:after { clear: both; content: \"\"; display: table; }";
	strVar += "article h1 { clip: rect(0 0 0 0); position: absolute; }";
	strVar += "";
	strVar += "article address { float: left; font-size: 125%; font-weight: bold; }";
	strVar += "";
	strVar += "\/* table meta & balance *\/";
	strVar += "";
	strVar += "table.meta, table.balance { float: right; width: 36%; }";
	strVar += "table.meta:after, table.balance:after { clear: both; content: \"\"; display: table; }";
	strVar += "";
	strVar += "\/* table meta *\/";
	strVar += "";
	strVar += "table.meta th { width: 40%; }";
	strVar += "table.meta td { width: 60%; }";
	strVar += "";
	strVar += "\/* table items *\/";
	strVar += "";
	strVar += "table.inventory { clear: both; width: 100%; }";
	strVar += "table.inventory th { font-weight: bold; text-align: center; }";
	strVar += "";
	strVar += "table.inventory td:nth-child(1) { width: 26%; }";
	strVar += "table.inventory td:nth-child(2) { width: 38%; }";
	strVar += "table.inventory td:nth-child(3) { text-align: right; width: 12%; }";
	strVar += "table.inventory td:nth-child(4) { text-align: right; width: 12%; }";
	strVar += "table.inventory td:nth-child(5) { text-align: right; width: 12%; }";
	strVar += "";
	strVar += "\/* table balance *\/";
	strVar += "";
	strVar += "table.balance th, table.balance td { width: 50%; }";
	strVar += "table.balance td { text-align: right; }";
	strVar += "";
	strVar += "\/* aside *\/";
	strVar += "";
	strVar += "aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }";
	strVar += "aside h1 { border-color: #999; border-bottom-style: solid; }";
	strVar += "";
	strVar += "";
	strVar += "@media print {";
	strVar += "	* { -webkit-print-color-adjust: exact; }";
	strVar += "	html { background: none; padding: 0; }";
	strVar += "	body { box-shadow: none; margin: 0; }";
	strVar += "	span:empty { display: none; }";
	strVar += "	.add, .cut { display: none; }";
	strVar += "}";
	strVar += "";
	strVar += "@page { margin: 0; }";
	strVar += "            <\/style>";
	strVar += "	<\/head>";
	strVar += "	<body>";
	strVar += "		<header>";
	strVar += "			<h1>Invoice<\/h1>";
	strVar += "			<address contenteditable>";
	strVar += "				<p>"+coName+"<\/p>";
	strVar += "				<p>"+coAddress+"<\/p>";
	strVar += "				<p>"+coPhone+"<\/p>";
	strVar += "				<p>"+coEmail+"<\/p>";
	strVar += "			<\/address>";
	strVar += "			<span><img alt=\"\" src=\""+logourl+"\"><input type=\"file\" accept=\"image\/*\"><\/span>";
	strVar += "		<\/header>";
	//strVar += "		<article>";
	strVar += "			<h1>Recipient<\/h1>";
	strVar += "			<address contenteditable>";
	strVar += "				<p>"+((firstname == "none")?"":firstname)+" "+((lastname == "none")?"":lastname)+"<br>"+((address == "none")?"":address)+"<br>"+((city == "none")?"":city)+", "+((state == "none")?"":state)
	+"<br> phone:  "+((custphone == "none")?"":custphone)+"<br> email: "+((email == "none")?"":email)+"<\/p>";
	strVar += "			<\/address>";
	strVar += "			<table class=\"meta\">";
	strVar += "				<tr>";
	strVar += "					<th><span contenteditable>Invoice #<\/span><\/th>";
	strVar += "					<td><span contenteditable>"+invoicenumber+"<\/span><\/td>";
	strVar += "				<\/tr>";
	strVar += "				<tr>";
	strVar += "					<th><span contenteditable>Date<\/span><\/th>";
	strVar += "					<td><span contenteditable>"+(new Date()).toString().slice(4,16)+"<\/span><\/td>";
	strVar += "				<\/tr>";
	strVar += "				<tr>";
	strVar += "					<th><span contenteditable>Amount Due<\/span><\/th>";
	strVar += "					<td><span id=\"prefix\" contenteditable>$<\/span><span>"+balance+"<\/span><\/td>";
	strVar += "				<\/tr>";
	strVar += "			<\/table>";
	strVar += "			<table class=\"inventory\">";
	strVar += "				<thead>";
	strVar += "					<tr>";
	strVar += "						<th><span contenteditable>Project<\/span><\/th>";
	strVar += "						<th><span contenteditable>Description<\/span><\/th>";
	strVar += "						<th><span contenteditable>Item<\/span><\/th>";
	strVar += "						<th><span contenteditable>Quantity<\/span><\/th>";
	strVar += "						<th><span contenteditable>Price<\/span><\/th>";
	strVar += "					<\/tr>";
	strVar += "				<\/thead>";
	strVar += strVarItems;
	strVar += "			<\/table>";
	strVar += "			<table class=\"balance\">";
	strVar += "				<tr>";
	strVar += "					<th><span contenteditable>Total<\/span><\/th>";
	strVar += "					<td><span data-prefix>$<\/span><span>"+subtotal+"<\/span><\/td>";
	strVar += "				<\/tr>";
	strVar += "				<tr>";
	strVar += "					<th><span contenteditable>Amount Paid<\/span><\/th>";
	strVar += "					<td><span data-prefix>$<\/span><span contenteditable>"+paid+"<\/span><\/td>";
	strVar += "				<\/tr>";
	strVar += "				<tr>";
	strVar += "					<th><span contenteditable>Balance Due<\/span><\/th>";
	strVar += "					<td><span data-prefix>$<\/span><span>"+balance+"<\/span><\/td>";
	strVar += "				<\/tr>";
	strVar += "			<\/table>";
	//strVar += "		<\/article>";
	strVar += "		<aside>";
	strVar += "			<h1><span contenteditable>Additional Notes<\/span><\/h1>";
	strVar += "			<div contenteditable>";
	strVar += "				<p>A finance charge of 1.5% will be made on unpaid balances after 30 days.<\/p>";
	strVar += "			<\/div>";
	strVar += "		<\/aside>";
	strVar += "	<\/body>";
	strVar += "<\/html>";
   
 	html2pdf.setHtmlString(strVar); 
 
}

function viewpdf(url){
	var win = Ti.UI.createWindow();
	// Use a NavigationWindow to create a navigation bar for the window
	var navWin = Ti.UI.iOS.createNavigationWindow({
		backgroundColor: "gray",
		window: win
		});
	
	var navButton = Titanium.UI.createButton({title:'Back'});
	win.RightNavButton = navButton;
	//var leftNavButton = Titanium.UI.createButton({title:'Back'});
	//win.LeftNavButton = leftNavButton;
	
	var winButton = Titanium.UI.createButton({
	    title:'View PDF',
	    height:40,
	    width:200,
	    top:270
	});
	
	win.add(winButton);
	
	// Create a document viewer to preview a PDF file
	var url = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,url);
	url.rename('invoice.pdf');
	var docViewer2 = Ti.UI.iOS.createDocumentViewer({url:'invoice.pdf'});
	Alloy.Globals.Log("invoicedetail.js::viewpdf: JSON.stringify(docViewer2) only:"+JSON.stringify(docViewer2) );
	
	var docViewer = Ti.UI.iOS.createDocumentViewer({url:url.nativePath});
	docViewer.addEventListener('load',function(){
		Alloy.Globals.Log("invoicedetail.js::viewpdf: JSON.stringify(docViewer) after callback:"+JSON.stringify(docViewer) );
	});
	
	var prepdftheimage = docViewer.toImage;
	Alloy.Globals.Log("invoicedetail.js::viewpdf: JSON.stringify(docViewer) + JSON.stringify(prepdftheimage) : "+JSON.stringify(docViewer) +" : prepdftheimage: "+ JSON.stringify(prepdftheimage));
	navButton.addEventListener('click', function(){
	    //docViewer.show({view:navButton, animated: true});
	    navWin.close();
	});
	// The document viewer immediately launches without an animation
	winButton.addEventListener('click', function(){
		docViewer.show();
		var theimage = docViewer.toImage;
		Alloy.Globals.Log("invoicedetail.js::viewpdf: JSON.stringify(docViewer) + JSON.stringify(theimage) : "+JSON.stringify(docViewer) +" : theimage: "+ JSON.stringify(theimage));
    	 var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
		 var name = kraniemailid.split('@')[0].trim();
     	 var parentid = Titanium.App.Properties.getString(name+"_invoice");
		//Alloy.Globals.uploadPictoGoogle(theimage,'pdftoimage1.jpg',parentid) ;
		});
	
	navWin.open();
	var pdftoimage = docViewer.toImage;
	Alloy.Globals.Log("invoicedetail.js::viewpdf: JSON.stringify(pdftoimage) :  pdftoimage: "+ JSON.stringify(pdftoimage));
}
 
function uploadFile(file,filename,parentid){
 		var fileget = Ti.Filesystem.getFile(file);
		var fileread = fileget.read();
		var filebase64 = Ti.Utils.base64encode(fileread);
	 		Alloy.Globals.Log('Access Token for File upload is: ' + Alloy.Globals.googleAuthSheet.getAccessToken());
	 		var parts = [];
	 		var bound = 287032396531387;
	 		var meta = '\{'
	 		+	'\"title\": \"'+filename+'\",'
	 		+'\"parents\": ['
		  	+'{'
		   	+'\"id\": \"'+parentid+'\"'
		 	+' }'
		 	+']'
			+	'\}';
			var parts = [];
	        parts.push('--' + bound);
	        parts.push('Content-Type: application/json');
	        parts.push('');
	        parts.push(meta);
	        parts.push('--' + bound);
			parts.push('Content-Type: application/pdf');
	        parts.push('Content-Transfer-Encoding: base64');
	        parts.push('');
	        parts.push(filebase64);
	        parts.push('--' + bound + '--');
	 		var url = "https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart";
	 		var xhr =  Titanium.Network.createHTTPClient({
			    onload: function() {
			    	try {
			    		Ti.API.info(this.responseText); 
			    	} catch(e){
			    		Ti.API.info("cathing e: "+JSON.stringify(e));
			    	}     
			    },
			    onerror: function(e) {
			    	Ti.API.info("invoicedetail.js:uploadFile::parentid: "+parentid+" :error e: "+JSON.stringify(e));
			        alert("invoicedetail::uploadFile::unable to talk to the cloud, will try later"); 
			    }
			});
			xhr.open("POST", url);
			xhr.setRequestHeader("Content-type", "multipart/mixed; boundary=" + bound);
			xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
			xhr.setRequestHeader("Content-Length", "2000000");
			xhr.send(parts.join("\r\n"));
			Ti.API.info('done POSTed');
 	}
   
function genInvoice(e){
	$.invoicedetail_window.title = "Please wait ...";
 	$.invoice_button.title = "Please wait ..." ;
 	$.invoice_button.color = "gray" ;
 	$.invoice_button.image = "" ;
	Alloy.Globals.Log("invoicedetail.js::genInvoice:: JSON.stringify(e) "+JSON.stringify(e)+" with : "+firstname+" "+lastname+" : "+invoicenumber);
	var logourl = Titanium.App.Properties.getString('logourl');
	Alloy.Globals.Log("invoicedetail.js::genInvoice:: logourl is: "+logourl);
	emailpdf(firstname,lastname,address,city,state,phone,email,invoicenumber,company,total,balance,paid,lastpaiddate,duedate,price);
	//var url = '../Documents/invoice.pdf';
	//var file = '../Documents/Expose.pdf';

	//var file = 'Expose.pdf';
	//var orgfile = 'Expose.pdf';
	//var file = orgfile.rename('invoice.pdf');
};

// Section where payment is tracked.

function populatepaymentSIDtoDB(filename,sid) {
	var needupdate = "yes";
	var thepaymentsid = Alloy.Collections.instance('paymentsid');
	thepaymentsid.fetch();
    if (thepaymentsid.length > 0) {
    	var paymentsidjson = thepaymentsid.toJSON();
    	for( var i=0; i < paymentsidjson.length; i++ ){
    		var oldsid = paymentsidjson[i].col2.trim();
    		Alloy.Globals.Log("invoicedetail.js::populatepaymentSIDtoDB::compare sid : "+oldsid+" vs. "+sid);
    		if ( sid == oldsid ){
    			var needupdate = "no";
    			Alloy.Globals.Log("invoicedetail.js::populatepaymentSIDtoDB::needupdate: "+needupdate+" , abort!");
    			return;
    		} 
    	}
    }   
       	if (needupdate == "yes"){
		    var dataModel = Alloy.createModel("paymentsid",{
	            col1 :  filename || "none",
	            col2 : sid || "none",
	            col3 : "none",col4:"none", col5:"none",	col6:"none", col7:"none", col8:"none", col9:"none", 
	            col10:"none", col11:"none",	col12:"none", col13:"none",	col14:"none", col15:"none",	col16:"none"
	    	});
    		dataModel.save();
    	}; 	
	thepaymentsid.fetch();
	Ti.API.info(" invoicedetail.js::populatepaymentSIDtoDB::needupdate "+needupdate+" with thepaymentsid: "+thepaymentsid.length+" : "+JSON.stringify(thepaymentsid));
	}

function getParentFolder(args) {
	var sid = Titanium.App.Properties.getString('invoice');
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var json = JSON.parse(this.responseText);
	    		Ti.API.info("response is: "+JSON.stringify(json));
	    		var parentid = json.items[0].id;
	    		Titanium.App.Properties.setString('parentid',parentid);
	    		Alloy.Globals.Log("enterjobdetail.js::args inside getParentFolder: "+JSON.stringify(args));
	    		//var filename = 'test03';
	    		//createSpreadsheet(filename,parentid);    		
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
			return parentid;
		}
		});
	xhr.onerror = function(e){
		alert("invoicedetail::getParentFolder::Unable to connect to the cloud.");
	};
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files/'+sid+'/parents');
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};

function fileExist(filename,parentid){
		Alloy.Globals.Log("executing fileExist("+filename+","+parentid+") ");
		var jsonlist = " ";
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var jsonlist = JSON.parse(this.responseText);
	    		Ti.API.info("fileExist::response of jsonlist is: "+JSON.stringify(jsonlist));
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
			Alloy.Globals.Log("invoicedetail.js::jsonlist.items.length: "+jsonlist.items.length);
			filelist = [];
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("invoicedetail.js::File DOES NOT EXIST");
				var fileexist = "false";
				createSpreadsheet(filename,parentid);  // create file when does not exists
				//PopulateHeader
			} else {
				var fileexist = "true";
				var sid = jsonlist.items[0].id;
				eval("Titanium.App.Properties.setString('"+filename+"_sid',sid)");
				//$.totalbalance_row.sid = sid;
				eval("$.totalbalance_row."+filename+"_sid = sid");
				Alloy.Globals.Log("invoicedetail.js::fileExist:: File exist. sid is: "+jsonlist.items[0].id+" Skipped.");
				Alloy.Globals.Log("invoicedetail.js:: fileExist. Titanium.App.Properties.setString('"+filename+"_sid',sid) is: "+eval("Titanium.App.Properties.getString('"+filename+"_sid')")+".");
				Titanium.App.Properties.setString('sid',sid);
				populatepaymentSIDtoDB(filename,sid);
				//populateSpreadsheetHeader();
			};
		}
		});
	xhr.onerror = function(e){
		alert("error:"+e.code+": Please refresh");
		Alloy.Globals.googleAuthSheet.authorize();
	};
	//var rawquerystring = '?q=title+%3D+\''+filename+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.spreadsheet\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Ctitle)';
	if (parentid) {
			var rawquerystring = '?q=title+%3D+\''+filename+'\'+and+\''+parentid+'\'+in+parents+and+mimeType+%3D+\'application%2Fvnd.google-apps.spreadsheet\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Cparents%2Ctitle)';
		} else {
			var rawquerystring = '?q=title+%3D+\''+filename+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.spreadsheet\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Cparents%2Ctitle)';
		}
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
}

function xmlToJson(xml) {
	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};


function getSSCell(sid,rowno,colno,value) {
	var pos = "R"+rowno+"C"+colno;
	Alloy.Globals.Log("invoicedetail.js::get SS Cell on :  https://spreadsheets.google.com/feeds/cells/"+sid+"/od6/private/full/"+pos);
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var xml = Titanium.XML.parseString(this.responseText);
	    		Ti.API.info("getSSCell:: response is: "+this.responseText);
	    		Ti.API.info("getSSCell:: xml response is: "+xml);
	    		var entry = xml.documentElement.getElementsByTagName("entry");
	    		var link = xml.documentElement.getElementsByTagName("link");
	    		Alloy.Globals.Log("invoicedetail.js:: number of link found: " +link+ " length: "+link.length);
	    		for (i=0;i<link.length;i++){			
	    			var listitem = link.item(i);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href");}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href");}
	    		}
	    		Ti.API.info("self href is : "+selfhref);
				Ti.API.info("edit href is : "+edithref);
	    		populateSpreadsheetHeader(sid,rowno,colno,edithref,selfhref,value);	    				    			
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		alert("invoicedetail::getSSCell::Unable to connect to the cloud. "+e);
	};
	xhr.open("GET", 'https://spreadsheets.google.com/feeds/cells/'+sid+'/od6/private/full/'+pos);
	xhr.setRequestHeader("Content-type", "application/atom+xml");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};

function createSpreadsheet(filename,parentid) {
	Alloy.Globals.Log("invoicedetail.js::create ss with filename: "+filename+" and parentid: "+parentid);
	var jsonpost = '{'
		 +'\"title\": \"'+filename+'\",'
		 +'\"parents\": ['
		  +'{'
		   +'\"id\": \"'+parentid+'\"'
		 +' }'
		 +'],'
		 +'\"mimeType\": \"application/vnd.google-apps.spreadsheet\"'
		+'}';
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Ti.API.info("response is: "+this.responseText);
	    		var json = JSON.parse(this.responseText);
	    		var sid = json.id;
	    		//Add dynamic Ti Properties set for sid
	    		eval("Titanium.App.Properties.setString('"+filename+"_sid',sid)");
	    		Alloy.Globals.Log("invoicedetail.js::createSpreadsheet:: File exist. sid is: "+json.id+" ");
				Alloy.Globals.Log("invoicedetail.js::createSpreadsheet:: File exist. Titanium.App.Properties.setString('"+filename+"_sid',sid) is: "+eval("Titanium.App.Properties.getString('"+filename+"_sid')")+".");
	    		$.totalbalance_row.sid = sid; // inject sid to tableviewrow
	    		populatepaymentSIDtoDB(filename,sid);
	    		Titanium.App.Properties.setString('sid',sid); // 1st sid created.
	    		var t = 0;
	    		for (i=1;i<17;i++){ 			   
						var value = "col"+i;
						//getSSCell(sid,1,i,value);
						Alloy.Globals.getSSCell(sid,1,i,value,t);
						var t = parseFloat(t) + 500;
					}
				Alloy.Globals.getSSCell(sid,2,1,"Date",9000);
				Alloy.Globals.getSSCell(sid,2,2,"Notes",9500);
				//Initial spreadsheet data.
				var date = new Date();	
				var month = date.getMonth()+1;
				var day = date.getDate();
				var year = date.getFullYear();			
				Alloy.Globals.getSSCell(sid,3,1,month+"/"+day+"/"+year,10000);
				Alloy.Globals.getSSCell(sid,3,2,"0.00",10500);
				Alloy.Globals.getSSCell(sid,3,16,Date.now(),11000); //jobitemid							
	    		Alloy.Globals.Log("invoicedetail.js::sid : "+sid);
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		alert("invoicedetail:error:"+e.code+"::Unable to connect to the cloud. Pls refresh.");
	};
	xhr.open("POST", 'https://www.googleapis.com/drive/v2/files');	
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
    Alloy.Globals.Log("invoicedetail.js:createSpreadsheet:json post: "+jsonpost);
	xhr.send(jsonpost);
}

function populateSpreadsheetHeader(sid,rowno,colno,edithref,selfhref,value){ 
		var xmldatastring = ['<entry xmlns=\'http://www.w3.org/2005/Atom\' '
 		+' xmlns:gs=\'http://schemas.google.com/spreadsheets/2006\'>'
 		+'<id>'+selfhref+'</id>'
 		+'<link rel=\'edit\' type=\'application/atom+xml\''
 		+' href=\''+edithref+'\'/>'
 		+'<gs:cell row=\''+rowno+'\' col=\''+colno+'\' inputValue=\''+value+'\'>'
 		+'</gs:cell>'
 		+'</entry>'].join('');
 		Alloy.Globals.Log("invoicedetail.js::xmldatastring: "+xmldatastring);
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
        alert("invoicedetail::populateSpreadsheetHeader::Unable to communicate to the cloud. Please try again"); 
    }
});
        xhr.open("PUT", ''+edithref+'');
        xhr.setRequestHeader("Content-type", "application/atom+xml");
        xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
        xhr.send(xmldatastring);
        Ti.API.info('done POSTed');
}

function matchpaymentsidfromDB(filename){
	thepaymentsidarray = [];
	var thepaymentsid = Alloy.Collections.instance('paymentsid');
	thepaymentsid.fetch();
	Ti.API.info(" matchpaymentsidfromDB::thepaymentsid : "+JSON.stringify(thepaymentsid));
	if (thepaymentsid.length > 0) {
		var paymentsidjson = thepaymentsid.toJSON();
		Alloy.Globals.Log("projectdetail.js::matchpaymentsidfromDB::JSON.stringify(paymentsidjson): " +JSON.stringify(paymentsidjson));
		for( var i=0; i < paymentsidjson.length; i++){
			var projectname = paymentsidjson[i].col1;
			var sid = paymentsidjson[i].col2.trim();
			if (filename == projectname){
				Alloy.Globals.Log("projectdetail.js::matchpaymentsidfromDB::sid: " +sid);
				$.totalbalance_row.sid = sid;
				return sid;			
			}
		}
	} 

}


function prefetchPayment(e){
	//var parentid = Titanium.App.Properties.getString('parentid');
	var name = kraniemailid.split('@')[0].trim();
	var parentid = Titanium.App.Properties.getString(name+"_invoice");
	Alloy.Globals.Log("invoicedetail.js::prefetchpayment::need to check if parent/filename exist: "+parentid+'/'+filename);
	
	fileExist(filename,parentid);
	var item = "payment";
	var sid = eval("Titanium.App.Properties.getString('"+filename+"_sid')");
	Alloy.Globals.Log("invoicedetail.js::prefetchpayment::sid for "+filename+' : '+sid);
	if(sid){
		Alloy.Globals.Log("invoicedetail.js::prefetchpayment: updating DB with: item : sid : "+item+" : "+sid);
		Alloy.Globals.getPrivateData(sid,item);
	} else {
		Alloy.Globals.Log("invoicedetail.js::prefetchpayment: creating sid. very first new project");
	};  // a very first new project would not have sid. suppress error.
	//wait for 1 sec before fetching data
	setTimeout(function(){
		Alloy.Globals.Log("invoicedetail.js::prefetchpayment:: after 1 sec wait: Alloy.Collections.payment.fetch()");
		var payment  = Alloy.Collections.instance('payment');
    	payment.fetch();
    	Alloy.Globals.Log("invoicedetail.js::JSON stringify payment data on prefetch: "+JSON.stringify(payment));
	},1000);
}

function dummyRefresh(paid,balance,lastpaiddate){
	Alloy.Globals.Log("invoicedetail.js::dummyRefresh:: execute in enterpayment:: balance: "+paid);
	someDummy.set({'id': '1234',
		'paid': 'Paid: '+paid,
		'balance': +balance,
		'lastpaiddate': 'Last paid date: ' +lastpaiddate
		});
	someDummy.fetch();
	Alloy.Globals.Log("invoicedetail.js:dummyRefresh: JSON.stringify(someDummy):: "+JSON.stringify(someDummy));
		//Alloy.Globals.Cleanup();
	Alloy.Globals.Log("invoicedetail.js:pulledEvent:use in callback: Alloy.Collections.payment.fetch()");
	prefetchPayment(); //refresh. pulledEvent.
	///Alloy.Collections.payment.fetch();	
	var edithref = Titanium.App.Properties.getString('edithref');
    var idtag = Titanium.App.Properties.getString('idtag');
    var selfhref = Titanium.App.Properties.getString('selfhref');
	Alloy.Globals.Log("invoicedetail.js::dummyRefresh::Alloy.Globals.updateExistingSpreadsheetAndDB:: invoice , "+col1+" , "+col2+" , "+lastname+" , "+newtotal+" , "+balance+" , "+paid+" , "+lastpaiddate+" , "+col8+" , "+col9+" , "+col10+" , "+col11+" , "
	+col12+" , "+col13+" , "+col14+" , "+col15+" , "+col16+" , "+edithref+" , "+selfhref+", "+idtag+" ) ");
	var col4 = newtotal;
	var col5 = balance;
	var col6 = paid;
	( balance <= "0" )?col13="paid":col13="owed";
	Alloy.Globals.updateExistingSpreadsheetAndDB("invoice",col1,col2,lastname,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16,edithref,selfhref,idtag);
	invoicecallbackFunction(); //download update SS then update the local DB.
	myRefresher();
}	

function actionPhone(e){
	Alloy.Globals.Log("invoicedetail.js:actionPhone:JSON.stringify(e): "+JSON.stringify(e));
	var phonenumber = e.source.titleid.trim();
	if (phonenumber) {var phonenumber = phonenumber.replace(/(\s|\)|\(|-)/g,"");}
	Alloy.Globals.Log("invoicedetail.js:actionPhone:call number: Ti.Platform.openURL('tel:'"+phonenumber+"''): "+phonenumber);
	//var phonenumber = "2623526221";
	//Ti.Platform.openURL('telprompt://' + phonenumber);; 
	Ti.Platform.openURL('tel:'+phonenumber+'');; 
}
function actioneMail(e){
	Alloy.Globals.Log("invoicedetail.js:actioneMail:JSON.stringify(e): "+JSON.stringify(e));
	var email = e.source.titleid.trim();
	var emailDialog = Ti.UI.createEmailDialog();
	emailDialog.subject = "Invoice #"+ e.source.data[0];
	emailDialog.toRecipients = [email];
	emailDialog.messageBody = '<b>Follow up on Invoice#:  '+e.source.data[0]+' </b>';
	emailDialog.open();
}

// set date due

var duedatePicker = Titanium.UI.createPicker({top:0, type:Titanium.UI.PICKER_TYPE_DATE_AND_TIME});
duedatePicker.selectionIndicator=true;
duedatePicker.addEventListener("change",function(e) {
	var dates = [];
	var datesinUTC = [];
	Alloy.Globals.Log("projectdetail.js::duedatepicker on change: "+JSON.stringify(e));
	var duedateISO = e.value.toString();
	var utcdate = Date.parse(e.value.toString());
	var regdate = new Date(utcdate);
	duedate = ( (new Date(utcdate)).getMonth() + 1 )+"/"+(new Date(utcdate)).getDate()+"/"+(new Date(utcdate)).getFullYear();
	$.duedate_label.text = duedate;
	//update ss
	dates.push({"duedate":duedate,"lastpaiddate":lastpaiddate});
	datesinUTC.push({"duedate":utcdate,"lastpaiddate":lastpaiddate});
	$.duedate_done.dates = dates;
	$.duedate_done.datesinUTC = datesinUTC;

});

$.duedate_done.hide();
function duedateAction(e){
	Alloy.Globals.Log("invoicedetail.js:: duedate_button:: JSON.stringify(e): "+JSON.stringify(e));
	duedatePicker.show();
	$.duedate_done.show();
	if (e.source.textid=="pickershow") {
		duedatePicker.hide(); $.duedate_button.textid="pickerhide";
		$.datepicker_row.height="1";
		$.datepicker_row.remove(duedatePicker);
		$.duedate_done.hide();
	} else {
		$.datepicker_row.height="170";
		$.datepicker_row.add(duedatePicker);
		duedatePicker.show(); $.duedate_button.textid="pickershow";
		$.duedate_done.show();
	}
}

function duedateActionDone(e){
	Alloy.Globals.Log("invoicedetail.js:: duedateActionDone:: JSON.stringify(e): "+JSON.stringify(e));
	if (e.source.dates) {
		var dates = e.source.dates;
		var duedate = dates[0].duedate;
		var datesinUTC = e.source.datesinUTC;
		var startdateTimeUTC = datesinUTC[0].duedate;
		var startdateTimeLocale = new Date(startdateTimeUTC);
		var startdateTimeISO = startdateTimeLocale.toISOString();
		var enddateTimeUTC = parseFloat(5*60*1000+parseFloat(startdateTimeUTC));
		var enddateTimeLocale = new Date(enddateTimeUTC);
		var enddateTimeISO = enddateTimeLocale.toISOString();
		Alloy.Globals.Log("invoicedetail.js:: duedateActionDone:: startdateTimeUTC "+startdateTimeUTC + " datesinUTC " +JSON.stringify(datesinUTC));
		var summary = e.source.summary;
		var description = e.source.descr;
		var organizerdisplayName = e.source.organizerdisplayName;
		var dates = JSON.stringify(dates).replace(/:/g,"cOlOn");
		Alloy.Globals.Log("invoicedetail.js:: duedatepicker before SS update: "+dates);
		var edithref = Titanium.App.Properties.getString('edithref');
    	var idtag = Titanium.App.Properties.getString('idtag');
    	var selfhref = Titanium.App.Properties.getString('selfhref');
		Alloy.Globals.updateExistingSpreadsheetAndDB("invoice",col1,col2,lastname,newtotal,newbal,paid,col7,col8,col9,col10,duedate,col12,col13,col14,col15,col16,edithref,selfhref,idtag);
		///var projectsid = Titanium.App.Properties.getString('project');
		///Alloy.Globals.getPrivateData(projectsid,"project");
		///callbackFunction();
		//Hide next appt date
		$.duedate_button.textid="pickerhide";
		$.datepicker_row.height="1";
		//$.datepicker_row.remove(duedatePicker);
		duedatePicker.hide();
		$.duedate_done.hide();
		//create reminder
		var kraniemailid = Titanium.App.Properties.getString('kraniemailid');Alloy.Globals.Log("schedule.js::kraniemailid:: "+kraniemailid);
		var calid = kraniemailid;
		var organizerdisplayName = kraniemailid;
		var summary = "Invoice Follow-up: "+col2+" "+col3;
		var description = "Invoice link: "+Titanium.App.Properties.getString('webcontentlink')+" ,Bal: "+newbal+" ,email: "+col10+" ,Phone: "+col12;
		updatecalendardialog.data = [{"calid":calid,"startdateTimeISO":startdateTimeISO,"enddateTimeISO":enddateTimeISO,"summary":summary,"description":description,"organizerdisplayName":organizerdisplayName}];
		updatecalendardialog.show();
	} else {
		alert("Please select date");
	}
	invoicecallbackFunction(); //refresh invoice callback	
}

var updatecalendardialog = Ti.UI.createAlertDialog({
	cancel: 1,
	buttonNames: ['NO', 'YES'],
	message: 'Would you like to set a reminder?',
	title: 'Follow-up Reminder'
});
updatecalendardialog.addEventListener('click', function(e){
	Alloy.Globals.Log("invoicedetail.js:: updatecalendardialog: JSON.stringify(e) :"+JSON.stringify(e));
	Alloy.Globals.Log("invoicedetail.js:: updatecalendardialog: e.source.data :"+e.source.data);
	var data = e.source.data;
	var startdateTimeISO = data[0].startdateTimeISO;
	var enddateTimeISO = data[0].enddateTimeISO;
	var organizerdisplayName = data[0].organizerdisplayName;
	var calid = data[0].calid;
	var description = data[0].description;
	var summary = data[0].summary;
	var fileUrl = Titanium.App.Properties.getString('webcontentlink');
	if (e.index == 1 ) {
		Alloy.Globals.Log("invoicedetail.js:: updatecalendardialog: startdateTimeISO :"+startdateTimeISO);
		Alloy.Globals.Log("Alloy.Globals.postCreateEvent(calid:"+calid+","+startdateTimeISO+","+enddateTimeISO+",\"\",summary:"+summary+",description:"+description+",organizerdisplayName:"+organizerdisplayName+")");
		Alloy.Globals.postCreateEvent(calid,startdateTimeISO,enddateTimeISO,"",summary,description,organizerdisplayName,fileUrl);
	} else {
		Alloy.Globals.Log("invoicedetail.js:: updatecalendardialog: Cancelled :");
	}
});
 
$.invoicedetail_window.addEventListener("close",function(){
	var proptoremove = [];
	proptoremove.push(invoicesentfilename+"_sid");
	proptoremove.push(filename+"_sid");
	for (i=0;i<proptoremove.length;i++){
		Alloy.Globals.Log("invoicedetail.js:invoicedetail_window: b4 remove property "+proptoremove[i]+" Titanium.App.Properties.getString(\'"+proptoremove[i]+"\') : "+eval("Titanium.App.Properties.getString(\'"+proptoremove[i]+"\')"));
		eval("Ti.App.Properties.removeProperty(\'"+proptoremove[i]+"\')");
		Alloy.Globals.Log("invoicedetail.js:invoicedetail_window: AFTER remove property "+proptoremove[i]+" Titanium.App.Properties.getString(\'"+proptoremove[i]+"\') : "+eval("Titanium.App.Properties.getString(\'"+proptoremove[i]+"\')"));
	}
	invoicecallbackFunction();
});

Alloy.Globals.checkFileExistThenUpdateSID("invoicesentfilename","invoicesent");

function prefetchinvoicesent(e){
	//var parentid = Titanium.App.Properties.getString('parentid');
	var name = kraniemailid.split('@')[0].trim();
	var parentid = Titanium.App.Properties.getString(name+"_invoice");
	Alloy.Globals.Log("invoicedetail.js::prefetchinvoicesent::need to check if parent/filename exist: "+parentid+'/'+invoicesentfilename);
	fileExist(invoicesentfilename,parentid);
	var item = "invoicesent";	
	var invoicesentsid = eval("Titanium.App.Properties.getString('"+invoicesentfilename+"_sid')");
	Alloy.Globals.Log("invoicedetail.js::prefetchinvoicesent:: filename "+invoicesentfilename+'_sid : invoicesentsid '+invoicesentsid);
	if(invoicesentsid){
		Alloy.Globals.Log("invoicedetail.js::prefetchinvoicesent: updating DB with: item : invoicesentsid : "+item+" : "+invoicesentsid);
		Alloy.Globals.getPrivateData(invoicesentsid,item);
	} else {
		Alloy.Globals.Log("invoicedetail.js::prefetchinvoicesent: creating invoicesentsid. very first new project");
	};  // a very first new project would not have sid. suppress error.
	Alloy.Globals.Log("invoicedetail.js::prefetchinvoicesent:: Alloy.Collections.invoicesent.fetch()");
	//Alloy.Collections.invoicesent.fetch();	
	var invoicesent  = Alloy.Collections.instance('invoicesent');
        invoicesent.fetch();
        Alloy.Globals.Log("invoicedetail.js::JSON stringify invoicesent data on prefetch: "+JSON.stringify(invoicesent));
}

function actionPreview(e) {
	Alloy.Globals.Log("invoicedetail.js:: actionPreview: JSON.stringify(e) :"+JSON.stringify(e));
	prefetchinvoicesent();
	var tabViewOneController = Alloy.createController("invoicesent",{
		callbackFunction : prefetchinvoicesent
			});
	tabViewOneController.openMainWindow($.tab_invoicedetail);
}
 
function myRefresher() {
	  Alloy.Globals.Log("invoicedetail.js:: refresh start: ");
	  prefetchPayment(); //prefetch payment to get existing sid or to create new
	  prefetchinvoicesent();
}


var refresh = Ti.UI.createRefreshControl({
    tintColor:'orange'
});

$.invoicedetail_table.refreshControl=refresh;

refresh.addEventListener('refreshstart',function(){
	setTimeout(function(){
        Alloy.Globals.Log('invoicedetail.js::refresh::start ');
        myRefresher();
        refresh.endRefreshing();
    }, 2000);
});
