exports.openMainWindow = function(_tab) {
  _tab.open($.proposal_window);
  Ti.API.info("This is child widow proposal.js" +JSON.stringify(_tab));
  //	$.proposal_table.search = $.search_history;
	//Alloy.Collections.proposal.fetch();	

};

$.proposalenter_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('enterproposal');
		clientController.openMainWindow($.tab_proposal);
});

$.proposallist_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('proposallist');
		clientController.openMainWindow($.tab_proposal);
});
$.pendingproposal_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('proposallist');
		clientController.openMainWindow($.tab_proposal);
});
$.submittedproposal_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('proposallist');
		clientController.openMainWindow($.tab_proposal);
});

/*

function transformFunction(model) {
	var transform = model.toJSON();
	console.log("transform is ::" +JSON.stringify(transform));
	transform.title = transform.col1+":"+transform.col2+":"+transform.col3+":"+transform.col4+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"+transform.col8+":"+transform.col9+":"+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"+transform.col15+":"+transform.col16;
	transform.custom = transform.col1+" ( "+transform.col2+"  "+transform.col3+" ) ";
	return transform;
}*/
