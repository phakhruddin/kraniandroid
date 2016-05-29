var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.projectlist_window);
  Ti.API.info("This is child widow projectlist.js" +JSON.stringify(_tab));
  	$.projectlist_table.search = $.search_history;
	Alloy.Collections.project.fetch();	

};

$.ptr.refresh();

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

Alloy.Globals.Log("args sourcecall detected is: " +args.sourcecall);
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
}

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
