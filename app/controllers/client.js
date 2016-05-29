var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.clientlist_window);
  Ti.API.info("This is child widow client.js" +JSON.stringify(_tab));
//  	var activity = $.index.getActivity();
//	activity.invalidateOptionsMenu(); //force reload of menus	
	$.activityIndicator.show();
	$.clientlist_table.search = $.search_history;
	Alloy.Collections.client.fetch();	
	setTimeout(function(){
        $.activityIndicator.hide();
    }, 10);
   
    $.clientlist_window.addEventListener("close", function(e){
    	Alloy.Globals.Log("client.js::openMainWindow:: closing clientlist_window JSON.stringify(e) : "+JSON.stringify(e));
    	_tab.from=e.source.id;
    	Alloy.Globals.Log("client.js::openMainWindow:: closing clientlist_window info on _tab : "+JSON.stringify(_tab));
    });
};

//action taken when window is closed.


Alloy.Globals.Log("client.js::JSON.stringify(args): " +JSON.stringify(args));

function showIndicator(e){
    $.activityIndicator.show();
    // do some work that takes 6 seconds
    // ie. replace the following setTimeout block with your code
    setTimeout(function(){
        e.source.close();
        $.activityIndicator.hide();
    }, 6000);
}

$.ptr.refresh();

Alloy.Globals.Log("args sourcecall detected is: " +args.sourcecall);
if (args.sourcecall) {
	$.clientlist_window.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController(args.sourcecall,{
			clienttitle: title,
			title:title
		});
		clientController.openMainWindow($.tab_clientlist);
});
} else {
	$.clientlist_window.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('clientdetail',{
			title: title
		});
		clientController.openMainWindow($.tab_clientlist);
		//Alloy.Globals.createController('clientdetail','tab_client')
	});
}


function transformFunction(model) {
	var transform = model.toJSON();
	///Alloy.Globals.Log("transform is ::" +JSON.stringify(transform));
	transform.title = transform.col1+":"+transform.col2+":"+transform.col3+":"+transform.col4+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"+transform.col8+":"+transform.col9+":"+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"+transform.col15+":"+transform.col16;
	transform.custom = transform.col2+"  "+transform.col3;
	transform.phone = "Phone: "+(transform.col5)?transform.col5.toString().replace(/^(...)(...)/g, "\($1\) $2-"):"";
	transform.email = "Email: "+transform.col6;
	transform.address = "Address: "+transform.col7+","+transform.col8+","+transform.col9;
	transform.labelcolor = (transform.col5.length != 10)?"red":"#330"; //alert user to fix the phone number
	return transform;
}


function menuItemLogout_click() {
		googleAuth.deAuthorize();
		//googleAuth.refreshToken();
		$.table.setData([]);
}
	
function menuItemSync_click() {
		Ti.API.info('Authorized: ' + googleAuth.isAuthorized());
		googleAuth.isAuthorized(function() {
			Ti.API.info('Access Token: ' + googleAuth.getAccessToken());
			//empty table view
			$.table.setData([]);
			var xhrList = Ti.Network.createHTTPClient({
				// function called when the response data is available
				onload : function(e) {
					try {
						var resp = JSON.parse(this.responseText);
						for (var i = 0; i < resp.items.length; i++) {
							//GET DATA FOR LIST
							var xhrTasks = Ti.Network.createHTTPClient({
								// function called when the response data is available
								onload : function(e) {
									var resp = JSON.parse(this.responseText);
									for (var j = 0; j < resp.items.length; j++) {
										if (resp.items[j].title != '') {
											var row = Titanium.UI.createTableViewRow({
												title : resp.items[j].title
											});
											$.table.appendRow(row);
										}
									}
								},
								// function called when an error occurs, including a timeout
								onerror : function(e) {
									Titanium.UI.createAlertDialog({
										title : 'Error',
										message : 'Can\'t load tasks for list ' + resp[i].title
									});
								},
								timeout : 5000
							});
							xhrTasks.open("GET", 'https://www.googleapis.com/tasks/v1/lists/' + resp.items[i].id + '/tasks?access_token=' + googleAuth.getAccessToken());
							xhrTasks.send();
						}
					} catch(e) {
						Titanium.UI.createAlertDialog({
							title : 'Error',
							message : 'Can\'t load tasks for list' 
						});
						Ti.API.error('RESPONSE: '+JSON.stringify(e));
					}
				},
				// function called when an error occurs, including a timeout
				onerror : function(e) {
					Titanium.UI.createAlertDialog({
						title : 'Error',
						message : 'Can\'t load tasklists'
					});
					Ti.API.error('HTTP: '+JSON.stringify(e));
				},
				timeout : 5000
			});
			xhrList.open("GET", 'https://www.googleapis.com/tasks/v1/users/@me/lists?access_token=' + googleAuth.getAccessToken());
			xhrList.send();
		}, function() {
			Ti.API.info('Authorize google account...');
			googleAuth.authorize();
		});
}

function addHandler(e) {
	Alloy.Globals.Log("clientlist addHandler e : "+JSON.stringify(e));
		//Alloy.Globals.openDetail(e);
		//var title = e.row.title;
		var clientController = Alloy.createController('enterclient');
		clientController.openMainWindow($.tab_clientlist);
}

function myRefresher(e) {
	Alloy.Globals.Log("refreshing after pull : " +JSON.stringify(e));
    Alloy.Collections.client.fetch({
        success: e.hide,
        error: e.hide
    });
}

exports.logfromSource = function(e){
	Alloy.Globals.Log("logfromSource::source is client.js JSON.stringify(e):"+JSON.stringify(e));
};

function logfromSource0(e) {
	Alloy.Globals.Log("logfromSource0::source is client.js (e) :"+e);
}

function pulledEvent(e){
	Alloy.Globals.Cleanup();
	var item = "client";
	var sid = Titanium.App.Properties.getString(item,"none");
	Alloy.Globals.Log("client.js::pulledEvent::sid for Alloy.Globals.getPrivateData("+ item +" , "+sid+" )");
	Alloy.Globals.getPrivateData(sid,item);
	Alloy.Globals.Log("client.js:pulledEvent:use in callback: Alloy.Collections.client.fetch()");
	Alloy.Collections.client.fetch();	
}
	
$.clientlist_table.addEventListener("delete", function(e){
	Alloy.Globals.Log("client.js::$.clientlist_table delete: "+JSON.stringify(e));
	var urls = e.row.title.split(':')[13].replace(/yCoLoNy/g,':').replace(/xCoLoNx/g,',');
	var existingurlsidtag = urls.split(',')[0];
	var existingurlsselfhref = urls.split(',')[1];
	var existingurlsedithref = urls.split(',')[2];
	Alloy.Globals.Log("client.js::$.clientlist_table delete: idtag:"+existingurlsidtag+" selfhref: "+existingurlsselfhref+" edithref: "+existingurlsedithref);
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Alloy.Globals.Log("client.js::$.clientlist_table delete:success e: "+JSON.stringify(e));
	    		Alloy.Globals.Log("client.js::$.clientlist_table delete:response is: "+this.responseText);
	    	} catch(e){
				Alloy.Globals.Log("client.js::$.clientlist_table delete:cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.open("DELETE", existingurlsedithref);	
	//xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	if (existingurlsedithref) {xhr.send();} else {Alloy.Globals.Log("client.js::$.clientlist_table delete: NO edithref. abort delete ");}
	Alloy.Globals.Log("client.js::$.clientlist_table delete: DONE: DELETE "+existingurlsedithref);
	pulledEvent();
});
