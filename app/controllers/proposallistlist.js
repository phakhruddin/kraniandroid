exports.openMainWindow = function(_tab) {
  _tab.open($.proposallist_window);
  Alloy.Globals.Log("proposallistlist.js:: This is child widow proposal.js" +JSON.stringify(_tab));
  //	$.proposallist_table.search = $.search_history;
	///Alloy.Collections.proposal.fetch();	//doublefetch

};
$.ptr.refresh();

function transformFunction(model) {
	var transform = model.toJSON();
	//Alloy.Globals.Log("transform is ::" +JSON.stringify(transform));
	transform.title = transform.col1+":"+transform.col2+":"+transform.col3+":"+transform.col4+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"+transform.col8+":"+transform.col9+":"
		+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"+transform.col15+":"+transform.col16;
	transform.custom = transform.col2+" "+transform.col3;
	transform.proposalnumber = "proposal#: "+transform.col1;
	transform.total ='TOTAL: '+transform.col4;
	transform.bal ='BALANCE: '+transform.col5;
	transform.paid ='PAID: '+transform.col6;
	transform.status ='Status: '+transform.col13;
	transform.lastpaiddate = 'Last Paid on: '+transform.col11;
	transform.urlraw = (typeof transform.title.split(':')[13] === typeof undefined)?"":transform.title.split(':')[13];
	//Alloy.Globals.Log("proposallistlist.js::transform.urlraw : for "+transform.col2+" "+transform.col3+"   " +transform.urlraw);
	(typeof transform.urlraw === typeof undefined)?"":$.proposallist_list.metadata += transform.urlraw+",";	
	if (transform.col13 == "submitted"){
		transform.img ="proposalsubmitted.gif";
	} else {
		transform.img ="proposalpending.gif";
	}
	return transform;
}

function doClick(e) {
	Alloy.Globals.Log("JSON.stringify e : " +JSON.stringify(e));	
	//Alloy.Globals.openDetail(e);
		var title = e.source.input;
		Alloy.Globals.Log("title is: "+title);
		var clientController = Alloy.createController('proposaldetail',{
			title: title,
			callbackFunction : pulledEvent
		});
		clientController.openMainWindow($.tab_proposallist);
	//alert("click this");
};

function buttonAction(e){
	Alloy.Globals.Log("JSON stringify e : " +JSON.stringify(e));
	Alloy.Globals.Log("JSON stringify e.source : " +JSON.stringify(e.source));
	var thesort = e.source.title;
	
	if (thesort == "All") { 
		Alloy.Collections.proposal.fetch();
		};
	if (thesort == "Submitted") { 
		var sql = "SELECT * FROM " + Alloy.Collections.proposal.config.adapter.collection_name +" WHERE col13=\"submitted\";";
        Alloy.Globals.Log("sql string:" +sql);
	    Alloy.Collections.proposal.fetch({query:sql});
		};
	if (thesort == "Pending") { 
		var sql = "SELECT * FROM " + Alloy.Collections.proposal.config.adapter.collection_name +" WHERE col13=\"pending\";";
        Alloy.Globals.Log("sql string:" +sql);
	    Alloy.Collections.proposal.fetch({query:sql});
		};
	if (thesort == "None") { var sorttype = "\*"; };
}

function addHandler(e){
	Alloy.Globals.Log("addHandler e "+JSON.stringify(e));
	    //reset the item counter
	    Titanium.App.Properties.setInt('count',0);
		var clientController = Alloy.createController('enterproposal');
		clientController.openMainWindow($.tab_proposallist);
}

function searchHandler(e){
	Alloy.Globals.Log("searchHandler e "+JSON.stringify(e));
}

function mailAction(e) {
	Alloy.Globals.Log("JSON stringify e : " +JSON.stringify(e));
			var clientController = Alloy.createController('proposalsend');
		clientController.openMainWindow($.tab_proposallist);
}

function selectItem(e) {
	Alloy.Globals.Log("proposallistlist.js::info after select item : "+JSON.stringify(e));
}

function myRefresher(e) {
	Alloy.Globals.Log("refreshing after pull : " +JSON.stringify(e));
    Alloy.Collections.proposal.fetch({
        success: e.hide,
        error: e.hide
    });
}

function pulledEvent(e){
	Alloy.Globals.Cleanup();
	var item="proposal";
	var sid = Titanium.App.Properties.getString(item,"none");
	Alloy.Globals.Log("proposallistlist.js:pulledEvent:use in callback: Alloy.Globals.getPrivateData("+sid+","+item+")");
	Alloy.Globals.getPrivateData(sid,item);
	Alloy.Globals.Log("proposallistlist.js:pulledEvent:use in callback: Alloy.Collections.proposal.fetch()");
	Alloy.Collections.proposal.fetch();
}

function deleteItem(e) {
	Alloy.Globals.Log("proposallistlistjs:: deleteItem(): "+JSON.stringify(e));
	var urls = e.source.metadata.replace("undefined","").split(",")[e.itemIndex].replace(/yCoLoNy/g,':').replace(/xCoLoNx/g,',');
	var existingurlsidtag = urls.split(',')[0];
	var existingurlsselfhref = urls.split(',')[1];
	var existingurlsedithref = urls.split(',')[2];
	Alloy.Globals.Log("proposallistlistjs::$.proposallist_table delete: idtag:"+existingurlsidtag+" selfhref: "+existingurlsselfhref+" edithref: "+existingurlsedithref);
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Alloy.Globals.Log("proposallistlistjs::$.proposallist_table delete:success e: "+JSON.stringify(e));
	    		Alloy.Globals.Log("proposallistlistjs::$.proposallist_table delete:response is: "+this.responseText);
	    	} catch(e){
				Alloy.Globals.Log("proposallistlistjs::$.proposallist_table delete:cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.open("DELETE", existingurlsedithref);	
	//xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	if (existingurlsedithref) {xhr.send();} else {Alloy.Globals.Log("proposallistlistjs::$.proposallist_table delete: NO edithref. abort delete ");}
	Alloy.Globals.Log("proposallistlistjs::$.proposallist_table delete: DONE: DELETE "+existingurlsedithref);
	pulledEvent();
}
