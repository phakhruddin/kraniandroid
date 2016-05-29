var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.clientlist_window);
  Ti.API.info("This is child widow client.js" +JSON.stringify(_tab));
//  	var activity = $.index.getActivity();
//	activity.invalidateOptionsMenu(); //force reload of menus	
	$.clientlist_table.search = $.search_history;
	Alloy.Collections.client.fetch();	
};

console.log("removing eventlistener for clientlist_window click");
$.clientlist_window.removeEventListener("click");
console.log("args sourcecall detected is: " +args.sourcecall);
if (args.sourcecall == 'enterinvoice') {
	$.clientlist_window.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		console.log("START::calling back window of: "+args.sourcecall+" , on title: "+title);
		var clientController = Alloy.createController('enterinvoice',{
			title: title
		});
		console.log("END::calling back window of: "+args.sourcecall+" , on title: "+title
		+" , with details of clientController : "+JSON.stringify(clientController));
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
	console.log("transform is ::" +JSON.stringify(transform));
	transform.title = transform.col1+":"+transform.col2+":"+transform.col3+":"+transform.col4+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"+transform.col8+":"+transform.col9+":"+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"+transform.col15+":"+transform.col16;
	transform.custom = transform.col2+"  "+transform.col3;
	transform.phone = "Phone: "+transform.col5;
	transform.email = "Email: "+transform.col6;
	transform.address = "Address: "+transform.col7+","+transform.col8+","+transform.col9;
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
	console.log("clientlist addHandler e : "+JSON.stringify(e));
		//Alloy.Globals.openDetail(e);
		//var title = e.row.title;
		var clientController = Alloy.createController('enterclient');
		clientController.openMainWindow($.tab_clientlist);
}
	
	