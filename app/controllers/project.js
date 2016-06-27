var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.projectlist_window);
  Ti.API.info("This is child widow projectlist.js" +_tab);
  	$.projectlist_table.search = $.search_history;
	Alloy.Collections.project.fetch();	

};

var clientController;

function transformFunction(model) {
	var transform = model.toJSON();
	Alloy.Globals.Log("project.js::transform col1 data:: "+JSON.stringify(transform.col1)+" col15:"+JSON.stringify(transform.col15)+" col16:"+JSON.stringify(transform.col16));
	transform.title = transform.col1.trim()+":"+transform.col2.trim()+":"+transform.col3.trim()+":"+transform.col4.trim()+":"+transform.col5.trim()+":"+transform.col6+":"+transform.col7+":"
	+transform.col8+":"+transform.col9+":"+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"
	+transform.col15+":"+transform.col16;
	transform.custom = transform.col1;
	transform.name = transform.col2+" "+transform.col3;
	transform.phone = "Phone: "+(transform.col5)?transform.col5.toString().replace(/^(...)(...)/g, "\($1\) $2-"):"";
	transform.labelcolor = (transform.col5.length != 10)?"red":"#330"; //alert user to fix the phone number
	transform.email = "email: "+transform.col6;
	transform.addresscolor = "orange";
	var address = transform.col7.trim();
	var city = transform.col8.trim();
	var state = transform.col9.trim();
	if ( address && city && state && address != "undefined" && address != "none") {
		transform.fulladdress = address+' , '+city+' , '+state;
	} else {
		transform.fulladdress = "Please enter address";
		transform.addresscolor = "red";
	}
	datesraw = transform.col15;
	if (datesraw != "NA" && datesraw != "none" ){
		datesdata = datesraw.replace(/cOlOn/g,":");
		datesdata = JSON.parse(datesdata);
		Alloy.Globals.Log("project.js::transformfunction: JSON.stringify(datesraw): "+JSON.stringify(datesraw)+"due date: "+datesdata[0].duedate);
		if (datesdata) {
			if(transform.datedue != "none" || transform.datedue != "NA" ){transform.datedue = "due date: "+datesdata[0].duedate; } else { transform.datedue = "due date: ";} ;
		} else transform.datedue = "due date: ";
	} else transform.datedue = "due date: ";
	
	return transform;
}

function addHandler(e) {
	Alloy.Globals.Log("addHandler e : "+JSON.stringify(e));
			var clientController = Alloy.createController('enterproject');
		clientController.openMainWindow($.tab_projectlist);
}

function myRefresher(e) {
	Alloy.Globals.Log("refreshing after pull : " +JSON.stringify(e));
    Alloy.Collections.project.fetch({
        success: e.hide,
        error: e.hide
    });
}

Alloy.Globals.Log("project.js::args sourcecall detected is: " +args.sourcecall);
/*
if (args.sourcecall) {
	$.projectlist_window.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var enterinvoiceController = Alloy.createController(args.sourcecall,{
			title: title
		});
		enterinvoiceController.openMainWindow($.tab_enterinvoicelist);
});
} else {
	$.projectlist_window.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('projectdetail',{
			title: title,
			callbackFunction : pulledEvent
		});
		clientController.openMainWindow($.tab_projectlist);
	});
}*/

$.projectlist_table.addEventListener("click", function(e){
		Alloy.Globals.Log("projectlist_table e : " +JSON.stringify(e));
		Alloy.Globals.Log("projectlist_table e.rowData.title : " +e.rowData.title);
		openProjectDetail(e.rowData.title);
		////Alloy.Globals.openDetail(e);
		////var title = e.row.title;
		///var clientController = Alloy.createController('projectdetail');
		////clientController.openMainWindow($.tab_projectlist);
});

function pulledEvent(e){
	Alloy.Globals.Cleanup();
	var item = "project";
	var sid = Titanium.App.Properties.getString(item,"none");
	Alloy.Globals.Log("project.js::pulledEvent::sid for Alloy.Globals.getPrivateData("+ item +" , "+sid+" )");
	Alloy.Globals.getPrivateData(sid,item);
	Alloy.Globals.Log("project.js:pulledEvent:use in callback: Alloy.Collections.project.fetch()");
	Alloy.Collections.project.fetch();	
}


$.projectlist_table.addEventListener("delete", function(e){
	Alloy.Globals.Log("project.js::$.projectlist_table delete: "+JSON.stringify(e));
	var urls = e.row.title.split(':')[13].replace(/yCoLoNy/g,':').replace(/xCoLoNx/g,',');
	var existingurlsidtag = urls.split(',')[0];
	var existingurlsselfhref = urls.split(',')[1];
	var existingurlsedithref = urls.split(',')[2];
	Alloy.Globals.Log("project.js::$.projectlist_table delete: idtag:"+existingurlsidtag+" selfhref: "+existingurlsselfhref+" edithref: "+existingurlsedithref);
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Alloy.Globals.Log("project.js::$.projectlist_table delete:success e: "+JSON.stringify(e));
	    		Alloy.Globals.Log("project.js::$.projectlist_table delete:response is: "+this.responseText);
	    	} catch(e){
				Alloy.Globals.Log("project.js::$.projectlist_table delete:cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.open("DELETE", existingurlsedithref);	
	//xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	if (existingurlsedithref) {xhr.send();} else {Alloy.Globals.Log("project.js::$.projectlist_table delete: NO edithref. abort delete ");}
	Alloy.Globals.Log("project.js::$.projectlist_table delete: DONE: DELETE "+existingurlsedithref);
	pulledEvent();
});

function doBack(e) {
	Alloy.Globals.Log("project.js::doMenuClick: "+JSON.stringify(e));
}
function doAdd(e) {
	Alloy.Globals.Log("project.js::doAdd: "+JSON.stringify(e));
	Alloy.Globals.Log("project.js::doAdd. $.projectlist_table: "+JSON.stringify($.projectlist_table));
	//$.projectlist_table.setData([]);
	$.projectlist_window.remove($.projectlist_table);
	$.projectlist_window.close();
	for (var i = $.projectlist_table.data[0].rows.length-1; i >= 0; i--) {
	       $.projectlist_table.deleteRow(i);
	}
	$.projectlist_table.setData([]);
	Alloy.Globals.Log("project.js::doAdd. $.projectlist_table: after clear"+JSON.stringify($.projectlist_table));
	var clientController = Alloy.createController('projectdetail');
	clientController.openMainWindow($.tab_projectlist);
}

function nextapptdateActionDone(e) {
	Alloy.Globals.Log("project.js::nextapptdateActionDone on Done: "+JSON.stringify(e));
	if (e.source.dates) {
		var dates = e.source.dates;
		var datesinUTC = e.source.datesinUTC;
		var startdateTimeUTC = datesinUTC[0].nextapptdate;
		var startdateTimeLocale = new Date(startdateTimeUTC);
		var startdateTimeISO = startdateTimeLocale.toISOString();
		var enddateTimeUTC = parseFloat(60*60*1000+parseFloat(startdateTimeUTC));
		var enddateTimeLocale = new Date(enddateTimeUTC);
		var enddateTimeISO = enddateTimeLocale.toISOString();
		Alloy.Globals.Log("project.js::nextapptdateActionDone: startdateTimeUTC "+startdateTimeUTC + " datesinUTC " +JSON.stringify(datesinUTC));
		var dates = JSON.stringify(dates).replace(/:/g,"cOlOn");
		Alloy.Globals.Log("project.js::nextapptdatepicker before SS update: "+dates);
		//ReREAD the URL HREF
	    var newedithref = (Titanium.App.Properties.getString('edithref'))?Titanium.App.Properties.getString('edithref'):edithref;
	    var newidtag = (Titanium.App.Properties.getString('idtag'))?Titanium.App.Properties.getString('idtag'):idtag;
	    var newselfhref = (Titanium.App.Properties.getString('selfhref'))?Titanium.App.Properties.getString('selfhref'):selfhref;
	    Alloy.Globals.Log("project.js::nextapptdateActionDone on Done:,projectname:" +projectname+	",firstname:" +firstname+	",lastname:" +lastname+	",company:" +company+	",phone:" +phone+	",email:" 
	    +email+	",address:" +address+	",city:" +city+	",state:" +state+	",country:" +country+	",status:" +status+	",notesraw:" +notesraw+	",customerid:" 
	    +customerid+	",none:none,dates:" +dates+	",projectid:" +projectid+	",newedithref:" +newedithref+	",newselfhref:" +newselfhref+	",newidtag:" +newidtag);
		Alloy.Globals.updateExistingSpreadsheetAndDB("project",projectname,firstname,lastname,company,phone,email,address,city,state,country,status,notesraw,customerid,"none",dates,projectid,newedithref,newselfhref,newidtag);
	} else {
		alert("Please select the date");
	}
	
}

function openProjectDetail(title) {	
	var tr = Titanium.UI.create2DMatrix();
	tr = tr.rotate(90);
	var drop_button = Titanium.UI.createButton({
		image : "/images/downbutton.png",
		height : "40",
		width : "15",
		transform:tr
	});

	var statusarray = [{'text':'Completed','color':'green'}, {'text':'In Progress','color':'orange'},{'text':'Awaiting Customer','color':'yellow'},{'text':'Not Started','color':'red'},{'text':'Invoiced','color':'black'}, {'text':'Proposal','color':'blue'}];

	var pickerColumn = Ti.UI.createPickerColumn();
	for (i=0;i<statusarray.length;i++){
		var pickerRow = Titanium.UI.createPickerRow();
		//var pickerLabel = Titanium.UI.createLabel({text:statusarray[i].text,color:statusarray[i].color,font:{fontSize:14}});
		var pickerLabel = Titanium.UI.createLabel({text:"PickerLabel "+i, color:"blue"});	
		pickerRow.add(pickerLabel);
		pickerRow.title=statusarray[i].text;
		pickerRow.backgroundColor=statusarray[i].color;
		pickerRow.id=statusarray[i].text;
		pickerRow.colorid=statusarray[i].color;
		pickerColumn.addRow(pickerRow);
		Alloy.Globals.Log("project.js::pickerRow "+ JSON.stringify(pickerRow));	
	}
	
	var picker = Ti.UI.createPicker({
	  top:5,
	  columns: [pickerColumn],
	  selectionIndicator: true
	});
	 
	//picker_view.add(picker);
	
	var slide_in =  Titanium.UI.createAnimation({bottom:0});
	var slide_out =  Titanium.UI.createAnimation({bottom:-551});
	
	//variables start
	var data = title.split(':');
	projectname = data[0];
	firstname = data[1];
	lastname = data[2];
	fullname = firstname+" "+lastname;
	company = data[3];
	phone = data[4];Alloy.Globals.Log("project.js::phone: "+phone);
	email = data[5];Alloy.Globals.Log("project.js::email: "+email);
	address = data[6];
	city = data[7];
	state = data[8];
	country = data[9];
	fulladdress = ( address && city && state ) && address+' , '+city+' , '+state || "Please enter address";
	fulladdress = ( address == "none" || city == "none" || state == "none" ) && "Please enter address"  || address+' , '+city+' , '+state ;
	status = data[10];
	customerid = data[12];
	notesraw = data[11];
	dates = data[14];Alloy.Globals.Log("project.js::dates: "+dates);
	datesdata = dates.replace(/cOlOn/g,":");Alloy.Globals.Log("project.js::datesdata: "+datesdata);
	datedue = JSON.parse(datesdata)[0].duedate;
	nextapptdate = JSON.parse(datesdata)[0].nextapptdate;
	lastpaiddate = JSON.parse(datesdata)[0].lastpaiddate;
	projectid = data[15];
	filename = 'project_'+projectid+'_'+firstname+'_'+lastname;
	idtag = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[0].replace('yCoLoNy',':'):"none";Titanium.App.Properties.setString('idtag',idtag);
	selfhref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[1].replace('yCoLoNy',':'):"none";Titanium.App.Properties.setString('selfhref',selfhref);
	edithref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[2].replace('yCoLoNy',':'):"none";Titanium.App.Properties.setString('edithref',edithref);
	//variables end
	var win = Titanium.UI.createWindow({
            title:"Project Detail",
            backgroundColor: "white"
    });
    if (Ti.UI.Android){win.windowSoftInputMode = Ti.UI.Android.SOFT_INPUT_ADJUST_PAN;}
	var headerview = Ti.UI.createView({height:"170"});
	var statusheaderlabel = Ti.UI.createLabel({text:"Status Summary",left:"20"});
	var statusheaderview = Ti.UI.createView({height:"30",backgroundColor:"#3B3B3B"});
	statusheaderview.add(statusheaderlabel);
	var statusview = Ti.UI.createView({height:"30",backgroundColor:"#4D4D4D"});
	var datesview = Ti.UI.createView({height:"60",backgroundColor:"#3D3D3D"});
	var joblogview = Ti.UI.createView({height:"60",backgroundColor:"#4D4D4D"});
	var jobitemheaderlabel = Ti.UI.createLabel({text:"Item & Description",left:"20"});
	var jobitemheaderview = Ti.UI.createView({height:"30",backgroundColor:"#3B3B3B"});
	jobitemheaderview.add(jobitemheaderlabel);
	var jobdescrview = Ti.UI.createView({height:"30",backgroundColor:"#DBDBDB"});
	var jobitemsview = Ti.UI.createView({height:"300"});
	var projectDetailscrollView = Ti.UI.createScrollView({layout:'vertical',scrollType:"vertical"});
    
    var projectidlabel = Ti.UI.createLabel({text:"Project #: "+projectid,color:"#4D4D4D",font:{fontSize:"12"},left :"5%",top:"10"});
   	var projectnamelabel = Ti.UI.createLabel({text:projectname,color:"orange",font:{fontSize:"24"},left :"5%",top:"34"});
	var fullnamelabel = Ti.UI.createLabel({text: fullname,color:"#2B2B2B",font:{fontSize:"18"},left :"5%",top:"68"});
	var phonelabel = Ti.UI.createLabel({text:"Phone : "+phone,color:"#4D4D4D",font:{fontSize:"12"},left :"5%",top:"92"});
	var emaillabel = Ti.UI.createLabel({text:"Email : "+email,color:"#4D4D4D",font:{fontSize:"12"},left :"5%",top:"106"});
	var companylabel = Ti.UI.createLabel({text:"Company : "+company,color:"#4D4D4D",font:{fontSize:"12"},left :"5%",top:"122"});
	var fulladdresslabel = Ti.UI.createLabel({text:"Address : "+fulladdress,color:"#4D4D4D",font:{fontSize:"12"},left :"5%",top:"138"});
	
	var details = ["projectidlabel","projectnamelabel","fullnamelabel","phonelabel","emaillabel","companylabel","fulladdresslabel"];
	for (i=0;i<details.length;i++){
		eval("headerview.add("+details[i]+")");
	}
	var detail = []; //cleanup
	
	var datepicker = Ti.UI.createPicker({
	  type: Ti.UI.PICKER_TYPE_DATE,
	  top:"50",
	  left:"100"
	});
	datepicker.state = "off";
	datepicker.nextapptdate = nextapptdate; datepicker.datedue = datedue;datepicker.lastpaiddate = lastpaiddate;
	
	var timepicker = Ti.UI.createPicker({
	  type: Ti.UI.PICKER_TYPE_TIME,
	  top:"60",
	  left:"100"
	});
	timepicker.state = "off";
	
	
	datepicker.addEventListener("change",function(e){
		Alloy.Globals.Log("project.js::datepicker:change: "+JSON.stringify(e));
		var dates = [];
		var datesinUTC = [];
		var utcdate = Date.parse(e.value.toString());
		var regdate = new Date(utcdate);
		var nextapptdate = e.source.nextapptdate;
		var datedue = e.source.datedue;
		var lastpaiddate = e.source.lastpaiddate;;
		if ( datepicker.source == "nextapptdatelabelbutton") {			
			var nextapptdateISO = e.value.toString();
			nextapptdate = ( (new Date(utcdate)).getMonth() + 1 )+"/"+(new Date(utcdate)).getDate()+"/"+(new Date(utcdate)).getFullYear();
			nextapptdatelabel.text = nextapptdate;
			Alloy.Globals.Log("project.js::datepicker:change after: "+nextapptdate);			
		}
		if ( datepicker.source == "duedatelabelbutton") {
			var datedueISO = e.value.toString();
			datedue = ( (new Date(utcdate)).getMonth() + 1 )+"/"+(new Date(utcdate)).getDate()+"/"+(new Date(utcdate)).getFullYear();
			duedatelabel.text = datedue;
			Alloy.Globals.Log("project.js::datepicker:change after: "+datedue);
		}
		Alloy.Globals.Log("project.js::datepicker:change: all date: nextapptdate "+nextapptdate+" datedue: "+datedue +" lastpaiddate:"+lastpaiddate);
		dates.push({"nextapptdate":nextapptdate,"duedate":datedue,"lastpaiddate":lastpaiddate});
		datesinUTC.push({"nextapptdate":utcdate,"duedate":datedue,"lastpaiddate":lastpaiddate});
		Alloy.Globals.Log("project.js::datepicker:change: dates "+JSON.stringify(dates)+" datesinUTC: "+JSON.stringify(datesinUTC));
		donelabelbutton.dates = dates;	
		donelabelbutton.datesinUTC = datesinUTC;		
	});
	timepicker.addEventListener("change",function(e){
		Alloy.Globals.Log("project.js::datepicker:change: "+JSON.stringify(e));
	});

	var donelabelbutton = Ti.UI.createLabel({text:"DONE",top:"150",left:"20",color:"#63D1F4"});donelabelbutton.dates = "";
	
	donelabelbutton.addEventListener("click",function(e){
		Alloy.Globals.Log("project.js::donelabelbutton:click: "+JSON.stringify(e));
		timepicker.hide();
		donelabelbutton.hide();
		datesview.height="60";
		nextapptdateActionDone(e);
		});

function datepickertoggle(e){
		Alloy.Globals.Log("project.js:::datepicker "+JSON.stringify(datepicker));
		if (datepicker.state == "off") { 		
			datepicker.show();datepicker.state = "on";
			donelabelbutton.show();
			datesview.height = "200";
		} else {
			datepicker.hide();datepicker.state = "off";
			donelabelbutton.hide();
			datesview.height = "60";			
		}		
};
	
	var nextapptdatelabelbutton = Ti.UI.createLabel({text:"Next Appt Date: ",top:"3",left:"20",color:"#63D1F4"});
	var nextapptdatelabel = Ti.UI.createLabel({text:nextapptdate,top:"3",left:"200",color:"gray"});
	nextapptdatelabelbutton.addEventListener("click",function(e){
		Alloy.Globals.Log("project.js::nextapptdatelabelbutton:click: "+JSON.stringify(e));	
		nextapptdatelabelbutton.color="gray";setTimeout(function(){nextapptdatelabelbutton.color="#63D1F4";},100);
		datepicker.source = "nextapptdatelabelbutton";
		datepickertoggle();
	});
	var duedatelabelbutton = Ti.UI.createLabel({text:"Due Date: ",top:"30",left:"20",color:"#63D1F4"});
	var duedatelabel = Ti.UI.createLabel({text:datedue,top:"30",left:"200",color:"gray"});
	var viewjobloglabelbutton = Ti.UI.createLabel({text:"View/Update Job Logs > ",top:"5",left:"25%",color:"#63D1F4"});
	var genreportinpdflabelbutton = Ti.UI.createLabel({text:"Generate Report in PDF > ",top:"30",left:"25%",color:"#63D1F4"});
	duedatelabelbutton.addEventListener("click",function(e){
		Alloy.Globals.Log("project.js::duedatelabelbutton:click: "+JSON.stringify(e));
		duedatelabelbutton.color="gray";setTimeout(function(){duedatelabelbutton.color="#63D1F4";},100);
		datepicker.source = "duedatelabelbutton";
		datepickertoggle();
	});	
	viewjobloglabelbutton.addEventListener("click",function(e){
		Alloy.Globals.Log("project.js::duedatelabelbutton:click: "+JSON.stringify(e));
		viewjobloglabelbutton.color="gray";setTimeout(function(){viewjobloglabelbutton.color="#63D1F4";},100);
		viewUpdateJobLog(e);
	});
	function closureTest(a,b,c){
		Alloy.Globals.Log("project.js::closureTest: "+a);
		b();
		(c)?c():Alloy.Globals.Log("project.js::closureTest: no c ");
	}
	genreportinpdflabelbutton.addEventListener("click",function(e){
		Alloy.Globals.Log("project.js::duedatelabelbutton:click: "+JSON.stringify(e));
		genreportinpdflabelbutton.color="gray";setTimeout(function(){genreportinpdflabelbutton.color="#63D1F4";},100);
		closureTest("Dothis",function(){
			Alloy.Globals.Log("project.js::closureTest: AGAIN ");
		});
		Alloy.Globals.Log("project.js:genreportinpdflabelbutton:Alloy.Globals.submit():click: ");
		Alloy.Globals.submit("joblog",'1F81cf3gXu_bxZRKp1QecqZW1qdwSLHTX9KURAL2_3-s');
	});
	datesview.add(nextapptdatelabelbutton);
	datesview.add(nextapptdatelabel);
	datesview.add(duedatelabelbutton);
	datesview.add(duedatelabel);
	datesview.add(datepicker);datepicker.hide();
	datesview.add(timepicker);timepicker.hide();
	datesview.add(donelabelbutton);donelabelbutton.hide();
	joblogview.add(viewjobloglabelbutton);
	joblogview.add(genreportinpdflabelbutton);
	statusview.add(picker);
	
	// Job Items
	if (notesraw != "none") {
		var notesstring = notesraw.replace(/cOlOn/g,':');   // replacing all cOlOn to ':'
		Alloy.Globals.Log("project.js::notesstring: "+notesstring);
		var notes = JSON.parse(notesstring);
		var descr = notes[0].descr;
		var descrtitlelabel = Ti.UI.createLabel ({
			color : "#2B2B2B",
			left  : "20",
			top : "10",
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
			top : "10",
			font:{
				fontSize:12
			},
			text : descr
		});
		jobdescrview.add(descrtitlelabel);
		jobdescrview.add(descrbodylabel);
		jobdescrview.height = descr_height + 5;
		
		var itemtitlelabel = Ti.UI.createLabel ({
		left  : "20",
		top : "4",
		font:{
			fontSize:14
		},
		text : 'List Item :'
		});
	
		if ( notes.length > 1) {jobitemsview.add(itemtitlelabel); }
	var topvalue = 24;
	for (i=1;i<notes.length;i++){
		var itembodylabel = Ti.UI.createLabel ({
			color : "#333",
			left  : "20",
			
			top : topvalue,
			font:{
				fontSize:12
			},
			text : i+' :    '+notes[i].lineitem
		});		
		var itemqtylabel = Ti.UI.createLabel ({
			color : "#333",
			left  : "200",
			
			top : topvalue+12+4,
			font:{
				fontSize:10
			},
			text : isNaN(notes[i].qty)?notes[i].qty='Qty :'+0:'Qty :'+notes[i].qty  
		});
		var itempricelabel = Ti.UI.createLabel ({
			color : "#333",
			left  : "320",
			
			top : topvalue+12+4,
			font:{
				fontSize:10
			},
			text : isNaN(notes[i].price)?notes[i].qty='Price : '+0:'Price : '+notes[i].price
		});
		var blanklabel = Ti.UI.createLabel ({
			top : topvalue+12+4+6,
			text : ''
		});
		
		jobitemsview.add(itembodylabel);
		jobitemsview.add(itemqtylabel);
		jobitemsview.add(itempricelabel);
		jobitemsview.add(itempricelabel);
		jobitemsview.add(blanklabel);
		var topvalue = topvalue + 40;
	}
	jobitemsview.height = topvalue+75;
	
	
		
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
	 		Alloy.Globals.Log("project.js::xmldatastring: "+xmldatastring);
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
	        alert("projectdetail::populateSpreadsheetHeader::Unable to communicate to the cloud. Please try again"); 
	    }
	});
	        xhr.open("PUT", ''+edithref+'');
	        xhr.setRequestHeader("Content-type", "application/atom+xml");
	        xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	        xhr.send(xmldatastring);
	        Ti.API.info('done POSTed');
	}
	
	function getSSCell(sid,rowno,colno,value) {
		var pos = "R"+rowno+"C"+colno;
		Alloy.Globals.Log("project.js::get SS Cell on :  https://spreadsheets.google.com/feeds/cells/"+sid+"/od6/private/full/"+pos);
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    try {
		    		var xml = Titanium.XML.parseString(this.responseText);
		    		Ti.API.info("getSSCell:: response is: "+this.responseText);
		    		Ti.API.info("getSSCell:: xml response is: "+xml);
		    		var entry = xml.documentElement.getElementsByTagName("entry");
		    		var link = xml.documentElement.getElementsByTagName("link");
		    		Alloy.Globals.Log("project.js:: number of link found: " +link+ " length: "+link.length);
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
			alert("projectdetail::getSSCell::Unable to connect to the cloud. "+e);
		};
		xhr.open("GET", 'https://spreadsheets.google.com/feeds/cells/'+sid+'/od6/private/full/'+pos);
		xhr.setRequestHeader("Content-type", "application/atom+xml");
	    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
		xhr.send();
	};
	
	function populatejoblogSIDtoDB(filename,sid) {
		var needupdate = "yes";
		var thejoblogsid = Alloy.Collections.instance('joblogsid');
		thejoblogsid.fetch();
	    if (thejoblogsid.length > 0) {
	    	var joblogsidjson = thejoblogsid.toJSON();
	    	for( var i=0; i < joblogsidjson.length; i++ ){
	    		var oldsid = joblogsidjson[i].col2.trim();
	    		Alloy.Globals.Log("project.js::populatejoblogSIDtoDB::compare sid : "+oldsid+" vs. "+sid);
	    		if ( sid == oldsid ){
	    			var needupdate = "no";
	    			Alloy.Globals.Log("project.js::populatejoblogSIDtoDB::needupdate: "+needupdate+" , abort!");
	    			return;
	    		} 
	    	}
	    }   
	       	if (needupdate == "yes"){
			    var dataModel = Alloy.createModel("joblogsid",{
		            col1 :  filename || "none",
		            col2 : sid || "none",
		            col3 : "none",col4:"none", col5:"none",	col6:"none", col7:"none", col8:"none", col9:"none", 
		            col10:"none", col11:"none",	col12:"none", col13:"none",	col14:"none", col15:"none",	col16:"none"
		    	});
	    		dataModel.save();
	    	}; 	
		thejoblogsid.fetch();
		Ti.API.info(" project.js::populatejoblogSIDtoDB::needupdate "+needupdate+" with thejoblogsid: "+thejoblogsid.length+" : "+JSON.stringify(thejoblogsid));
	}
	
	function createSpreadsheet(filename,parentid) {
		Alloy.Globals.Log("project.js::create ss with filename: "+filename+" and parentid: "+parentid);
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
		    		populatejoblogSIDtoDB(filename,sid);
		    		Titanium.App.Properties.setString('sid',sid); // 1st sid created.
		    		for (i=1;i<17;i++){
							var value = "col"+i;
							getSSCell(sid,1,i,value);
						}
						getSSCell(sid,2,1,"Date");
						getSSCell(sid,2,2,"Notes");
						var date = new Date();
						for (r=3;r<6;r++) {
							getSSCell(sid,r,1,date);
							getSSCell(sid,r,2,"Please enter work logs.");
							getSSCell(sid,r,16,Date.now()); //jobitemid
						};
						
		    		Alloy.Globals.Log("project.js::sid : "+sid);
		    	} catch(e){
					Ti.API.info("cathing e: "+JSON.stringify(e));
				}
			}
			});
		xhr.onerror = function(e){
			alert("projectdetail::createSpreadsheet::Unable to create spreadsheet.");
			Alloy.Globals.Log("projectdetail::createSpreadsheet::Unable to createSpreadsheet with "+filename+".");
		};
		xhr.open("POST", 'https://www.googleapis.com/drive/v2/files');	
		xhr.setRequestHeader("Content-type", "application/json");
	    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	    Alloy.Globals.Log("project.js::json post: "+jsonpost);
		xhr.send(jsonpost);
	}
	
	function fileExist(filename,parentid){
		Alloy.Globals.Log("project.js::executing fileExist("+filename+","+parentid+") ");
		var jsonlist = " ";
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var jsonlist = JSON.parse(this.responseText);
	    		Ti.API.info("response of jsonlist is: "+JSON.stringify(jsonlist));
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
			Alloy.Globals.Log("project.js::jsonlist.items.length: "+jsonlist.items.length);
			filelist = [];
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("project.js::File DOES NOT EXIST");
				var fileexist = "false";
				Alloy.Globals.Log("project.js::fileExist: createSpreadsheet("+filename+","+parentid+")");
				createSpreadsheet(filename,parentid);  // create file when does not exists
			} else {
				var fileexist = "true";
				var sid = jsonlist.items[0].id;
				eval(filename+"_sid = sid");
				Alloy.Globals.Log("project.js::fileExist:: File exist. sid is: "+jsonlist.items[0].id+" Skipped.");
				// load data START
				var item = "joblog";	
				Alloy.Globals.getPrivateData(sid,item);
				Alloy.Globals.Log("project.js::fileExist:: Alloy.Collections.joblog.fetch()");
				//Alloy.Collections.joblog.fetch();	
				var joblog  = Alloy.Collections.instance('joblog');
		        joblog.fetch();
		        Alloy.Globals.Log("project.js::JSON stringify joblog data on fileExist: "+JSON.stringify(joblog));				
				// load data END
				populatejoblogSIDtoDB(filename,sid);
			};
		}
		});
		xhr.onerror = function(e){
			alert("Creating new document in the cloud");
		};
		var rawquerystring = '?q=title%3D\''+filename+'\'';
		xhr.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
		xhr.send();
	}
	
	function prefetchJoblog(){
		Ti.App.Properties.removeProperty("sid"); var sid;
		var kraniemailid=Titanium.App.Properties.getString('emailid');
		var name = kraniemailid.split('@')[0].trim();
		projectparentid = Titanium.App.Properties.getString(name+"_project");	
		var filename = 'project_'+projectid+'_'+firstname+'_'+lastname;
		var parentid = Titanium.App.Properties.getString('parentid');	
		var item = "joblog";					
		Alloy.Globals.Log("project.js::prefetchJoblog:: Titanium.App.Properties.getString("+name+"_project); " +projectparentid);
		Alloy.Globals.Log("project.js::prefetchJoblog::need to check if parent/filename exist: "+projectparentid+'/'+filename);
		fileExist(filename,projectparentid);
		Alloy.Globals.Log("project.js::prefetchJoblog :,projectname:" +projectname+	",firstname:" +firstname+	",lastname:" +lastname+	",parentid:" 
	+parentid+	",kraniemailid:" +kraniemailid+", filename:" +filename+	",projectid:" +projectid+", name:" +name);
	
	}	
	
	prefetchJoblog();
	
	// Prep row view
	

	
	var LoadRemoteImage = function (obj,url) {
	   var xhr = Titanium.Network.createHTTPClient();	
		xhr.onload = function()
		{
		 Alloy.Globals.Log('project.js:image data='+this.responseData);
		 obj.image=this.responseData;		 
		};
		// open the client
		xhr.open('GET',url);		
		// send the data
		xhr.send();
	};
	
	//View Update Job Logs
	function viewUpdateJobLog(e){
		Alloy.Globals.Log("project.js::viewUpdateJobLog: "+JSON.stringify(e));
		var datelabel=employeelabel=blueline=selectbutton=joblogoddview=viewUpdateJobLogscrollView=null;
		Alloy.Globals.Log("project.js::viewUpdateJobLog: initial joblogoddview "+JSON.stringify(joblogoddview));
		var viewUpdateJobLogscrollView = Ti.UI.createScrollView({layout:'vertical',scrollType:"vertical"});
		var viewUpdateJobLogwin = Titanium.UI.createWindow({
	        title:"Job Log",
	        backgroundColor: "#5C5C5C"
		});
		
		//viewUpdateJobLog: fetching data: START		
		var content = [];
		var joblog = Alloy.Collections.instance('joblog');
		joblog.fetch();
		var content = joblog.toJSON();
		Alloy.Globals.Log("enterjobdetail.js:: content.length: "+content.length+", JSON stringify content: "+JSON.stringify(content));
		//viewUpdateJobLog: fetching data: END
		var jobcommentdata = [];
		for (i=0;i<content.length;i++){
			var notesbody = content[i].col2;
	        var imageurl = content[i].col4;
	        var date = content[i].col1;
	        for (j=1;j<17;j++){
	        	eval("jobcommentdata.push(content[i].col"+j+")"); // feed metadata
	        }
	        var employee = content[i].col5;
	        //jobDetailAddRow (date,notesbody,imageurl,jobcommentdata,employee); 
	        var datelabel = Ti.UI.createLabel ({
	            color : "orange",
	            font : {
	            	fontSize : 10
	            },
	            left  : "20",
	            
	            top : "10",
	            text : date
	    	});
	        var employeelabel = Ti.UI.createLabel ({
	                color : "orange",
	                font : {
	                	fontSize : 10
	                },
	                right  : "20",               
	                top : "10",
	                text : employee
	        });
	        var blueline = Ti.UI.createImageView ({
	                left  : "20",
	                
	                top : "30",
	                width : "85%",
	                height : "3",
	                image : "/images/blueline.png"
	        });
	        var noteslabel = Ti.UI.createLabel ({
	                color : "#888",
	                left  : "20",
	                width : "300",
	                
	                font: {
	                        fontSize: "12"
	                        },
	                text : notesbody
	        });
	        var imagelabel = Ti.UI.createImageView ({
   	                top : "50",
	                height : Ti.UI.SIZE,
	                width : Ti.UI.FILL
	        });
			//var joblogoddview = Ti.UI.createView({height:"100",backgroundColor:"#FAFAFA"});
			eval("var joblogoddview"+i+"= Ti.UI.createView({height:100,backgroundColor:'#FAFAFA',borderRadius:20,borderColor:'#B5A642',borderWidth:'0.1',width:'95%'})");
			eval("var joblogevenview"+i+" = Ti.UI.createView({height:5,backgroundColor:'#5C5C5C'})");
	        var selectbutton = Ti.UI.createImageView({
	        	image:"/images/EditControl.png",
	        	top: "50%",
	        	left: "90%",
	        	height: "20",
	        	width: "20"	     
	        });
/*         	joblogoddview.add(datelabel);
        	joblogoddview.add(employeelabel);
        	joblogoddview.add(blueline);
        	joblogoddview.add(selectbutton);*/
        	eval("joblogoddview"+i+".add(datelabel)");
        	eval("joblogoddview"+i+".add(employeelabel)");
        	eval("joblogoddview"+i+".add(blueline)");
        	eval("joblogoddview"+i+".add(selectbutton)");
        	
        	
        	if ( notesbody != "none" ) {
                //joblogoddview.add(noteslabel);
                eval("joblogoddview"+i+".add(noteslabel)");
                noteslabel.top = 50;
                var noteslabelheight = ((Math.round(notesbody.split('').length/50)+(notesbody.split(/\r?\n|\r/).length))*14)+14;
                //Alloy.Globals.Log("enterjobdetail.js::noteslabelheight: "+noteslabelheight+" notesbody count: "+notesbody.split(' ').length);
                /////(i==(content.length-1))?joblogoddview.height = 180+noteslabelheight:joblogoddview.height = 60+noteslabelheight; //higher height because of footer
                (i==(content.length-1))?eval("joblogoddview"+i+".height = 180+noteslabelheight"):eval("joblogoddview"+i+".height = 60+noteslabelheight"); //higher height because of footer
                selectbutton.top="40";
            } else {
                imagelabel.height = Ti.UI.SIZE;
                imagelabel.width = 340;    
	        };
            if (imageurl != "none") {
            	LoadRemoteImage(imagelabel,imageurl);
            	imagelabel.height="200";imagelabel.width="200";
	        	////joblogoddview.add(imagelabel);
	        	eval("joblogoddview"+i+".add(imagelabel)");
	        	////joblogoddview.height = "220";  
	        	eval("joblogoddview"+i+".height = 300");  
        	};
	        if ( notesbody != "none" && imageurl != "none") {
                imagelabel.top = 50;
                noteslabel.top = 220;
                ////joblogoddview.height = 200+60+noteslabelheight;
                eval("joblogoddview"+i+".height = 200+60+noteslabelheight");
	        };
    		////viewUpdateJobLogscrollView.add(joblogoddview);
    		eval("viewUpdateJobLogscrollView.add(joblogoddview"+i+")");
    		eval("viewUpdateJobLogscrollView.add(joblogevenview"+i+")");
	        var jobcommentdata = [];			
		}
		
		// footer view
		var viewUpdateJobLogfooterButtonView = Ti.UI.createView({bottom:"0",height:"40",backgroundColor:"#2B2B2B"});
		var viewUpdateJobLogSavelabelbutton = Ti.UI.createLabel({text:"Save",right:"20",color:"#63D1F4"});
		var viewUpdateJobLogGenReportlabelbutton = Ti.UI.createLabel({text:"Generate Report",left:"40%",color:"#63D1F4"});
		viewUpdateJobLogfooterButtonView.add(viewUpdateJobLogSavelabelbutton);
		viewUpdateJobLogfooterButtonView.add(viewUpdateJobLogGenReportlabelbutton);
		var viewUpdateJobLogfooterView = Ti.UI.createView({bottom:"40",height:"40",backgroundColor:"#333333"});
		var viewUpdateJobLogfooterTextArea = Ti.UI.createTextArea({width:"95%",height:"30",backgroundColor:"white",borderRadius:"10",borderColor:"#ADADAD",color:"#3B3B3B"});
		viewUpdateJobLogfooterTextArea.addEventListener("click",function(e){
			Alloy.Globals.Log("project.js:: viewUpdateJobLogfooterTextArea: JSON.stringify(e): "+JSON.stringify(e));
			(e.source.height < "31")?viewUpdateJobLogfooterTextAreaheight=100:viewUpdateJobLogfooterTextAreaheight=30;
			viewUpdateJobLogfooterTextArea.height=viewUpdateJobLogfooterTextAreaheight;viewUpdateJobLogfooterView.height=viewUpdateJobLogfooterTextAreaheight+10;
		});
		// Save START
		viewUpdateJobLogfooterTextArea.addEventListener("blur",function(e){
			Alloy.Globals.Log("project.js:: viewUpdateJobLogfooterTextArea: JSON.stringify(e): "+JSON.stringify(e));					
			var notesbody = e.value;
			Alloy.Globals.Log("project.js:: viewUpdateJobLogfooterTextArea: viewUpdateJobLogscrollView.children.length: B4 update: "+viewUpdateJobLogscrollView.children.length);
			var i = viewUpdateJobLogscrollView.children.length;
			viewUpdateJobLogSavelabelbutton.notes = notesbody;
			eval("var joblogoddview"+i+"= Ti.UI.createView({height:100,backgroundColor:'#FAFAFA',borderRadius:20,borderColor:'#B5A642',borderWidth:'0.1',width:'95%'})");
			eval("var joblogevenview"+i+" = Ti.UI.createView({height:5,backgroundColor:'#5C5C5C'})");
			eval("joblogoddview"+i+".add(Ti.UI.createImageView({left:20,top:25,width:'85%',height:3,image:'/images/blueline.png'}))");
			eval("joblogoddview"+i+".add(Ti.UI.createLabel ({color : 'orange',font : {fontSize : 10},right  : 20,top :5,text : 'employee'}))");
	    	eval("joblogoddview"+i+".add(Ti.UI.createLabel ({color : 'orange',font : {fontSize : 10},left  : 20,top :5,text : 'date'}))");
	    	eval("joblogoddview"+i+".add(Ti.UI.createImageView({image:'/images/EditControl.png',top:40,left: '90%',height: 20,width: 20}))");			
	        eval("joblogoddview"+i+".add(Ti.UI.createLabel ({color:'#888',font:{fontSize:12},left:20,width:300,top:40,text:notesbody}))");	        
            var noteslabelheight = ((Math.round(notesbody.split('').length/50)+(notesbody.split(/\r?\n|\r/).length))*14)+14;
            var viewheight = 180 + noteslabelheight;
      		eval("joblogoddview"+i+".height = viewheight");
			eval("viewUpdateJobLogscrollView.add(joblogoddview"+i+")");
			eval("viewUpdateJobLogscrollView.add(joblogevenview"+i+")");
			Alloy.Globals.Log("project.js:: viewUpdateJobLogfooterTextArea: viewUpdateJobLogscrollView.children.length: AFTER update: "+viewUpdateJobLogscrollView.children.length);
		});
		viewUpdateJobLogSavelabelbutton.addEventListener("click",function(e){
			Alloy.Globals.Log("project.js:: viewUpdateJobLogSavelabelbutton: JSON.stringify(e): "+JSON.stringify(e));
			setTimeout(function(){viewUpdateJobLogSavelabelbutton.color="#63D1F4";},100);
			viewUpdateJobLogfooterTextArea.blur();
			viewUpdateJobLogfooterTextArea.value="";
		});
		
		// Save END
				
		//camera START
		var viewUpdateJobLogCameralabelbutton = Ti.UI.createLabel({text:"Camera",left:"20",color:"#63D1F4"});
		viewUpdateJobLogfooterButtonView.add(viewUpdateJobLogCameralabelbutton);
 
		viewUpdateJobLogCameralabelbutton.addEventListener('click', function(e){	
			setTimeout(function(){viewUpdateJobLogCameralabelbutton.color="#63D1F4";},100);	 
			var parentid = e.source.parentid;  
		   //Activate camera
		   Titanium.Media.showCamera({
				success : function(event) {
					//Holds the captured image
					var capturedImg= event.media;
					var image = capturedImg;		 
					// Condition to check the selected media
					if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {			 	 
						//Add the image to window for displaying
						Alloy.Globals.Log("project.js:: viewUpdateJobLogCameralabelbutton: viewUpdateJobLogscrollView.children.length: B4 update: "+viewUpdateJobLogscrollView.children.length);
						var i = viewUpdateJobLogscrollView.children.length;
						eval("var joblogoddview"+i+"= Ti.UI.createView({height:100,backgroundColor:'#FAFAFA',borderRadius:20,borderColor:'#B5A642',borderWidth:'0.1',width:'95%'})");
						eval("var joblogevenview"+i+" = Ti.UI.createView({height:5,backgroundColor:'#5C5C5C'})");
						eval("joblogoddview"+i+".add(Ti.UI.createImageView({left:20,top:25,width:'85%',height:3,image:'/images/blueline.png'}))");
						eval("joblogoddview"+i+".add(Ti.UI.createLabel ({color : 'orange',font : {fontSize : 10},right  : 20,top :5,text : 'employee'}))");
				    	eval("joblogoddview"+i+".add(Ti.UI.createLabel ({color : 'orange',font : {fontSize : 10},left  : 20,top :5,text : 'date'}))");
				    	eval("joblogoddview"+i+".add(Ti.UI.createImageView({image:'/images/EditControl.png',top:155,left: '90%',height: 20,width: 20}))");
				        eval("joblogoddview"+i+".height = 560");
			      		eval("joblogoddview"+i+".add(Titanium.UI.createImageView({top:40,left:'5%',width:300,height:300,image: capturedImg }))");
						eval("viewUpdateJobLogscrollView.add(joblogoddview"+i+")");
						Alloy.Globals.Log("project.js:: viewUpdateJobLogCameralabelbutton: viewUpdateJobLogscrollView.children.length: AFTER update: "+viewUpdateJobLogscrollView.children.length);						
						eval("viewUpdateJobLogscrollView.add(joblogevenview"+i+")");
						Alloy.Globals.Log("project.js:: viewUpdateJobLogCameralabelbutton: load pics");
                        Alloy.Globals.Log("project.js::beginning to upload to the cloud.");
                        var date = new Date();
						var imagefilename = filename+"_"+date.toString().replace(/ /g,'_');
						Alloy.Globals.Log("project.js:: viewUpdateJobLogCameralabelbutton: image,imagefilename,parentid,"+image+","+imagefilename+","+projectparentid
						+", "+filename+"_sid: " +eval(filename+"_sid"));
						////Alloy.Globals.uploadPictoGoogle(image,imagefilename,projectparentid);
						var col2=col3=col4=col6=col7=col8=col9=col10=col11=col12=col13=col14=col15=col16=existingedithref=existingselfhref=existingidtag='none';
						var ssid = eval(filename+"_sid");
						var func = function() {
							Alloy.Globals.Log("project.js:: viewUpdateJobLogCameralabelbutton: execute func();");
						}; 
						Alloy.Globals.uploadPictoGoogle(image,imagefilename,projectparentid,'4','joblog',date,col2,col3,col4,'employee',col6,col7,col8,col9,ssid,col11,col12,col13,col14,col15,Date.now(),existingedithref,existingselfhref,existingidtag,func);
					}
				},
				cancel : function() {
					//While cancellation of the process
				},
				error : function(error) {
					// If any error occurs during the process			 
				}
			});
		});
		//camera END
		
		viewUpdateJobLogwin.add(viewUpdateJobLogscrollView);
		
		viewUpdateJobLogfooterView.add(viewUpdateJobLogfooterTextArea);
		viewUpdateJobLogwin.add(viewUpdateJobLogfooterButtonView);
		viewUpdateJobLogwin.add(viewUpdateJobLogfooterView);
		
		viewUpdateJobLogwin.open();
		viewUpdateJobLogwin.addEventListener("close",function(){
			Alloy.Globals.Log("project.js:: win.close: b4 cleanup: datelabel");
			viewUpdateJobLogscrollView.remove(joblogoddview);
			viewUpdateJobLogwin.remove(viewUpdateJobLogscrollView);
			///Alloy.Globals.Log("project.js:: win.close: after cleanup: "+JSON.stringify(joblogoddview)+" viewUpdateJobLogscrollView "+JSON.stringify(viewUpdateJobLogscrollView));
		});
		
	}
	
	// ScrollView Window
	projectDetailscrollView.add(headerview);
	projectDetailscrollView.add(statusheaderview);
	projectDetailscrollView.add(statusview);
	projectDetailscrollView.add(datesview);	
	projectDetailscrollView.add(joblogview);
	projectDetailscrollView.add(jobitemheaderview);
	projectDetailscrollView.add(jobdescrview);
	projectDetailscrollView.add(jobitemsview);
	win.add(projectDetailscrollView);
    win.open();
    


}


