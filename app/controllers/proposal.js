exports.openMainWindow = function(_tab) {
  _tab.open($.proposal_window);
  Ti.API.info("This is child widow proposal.js" +JSON.stringify(_tab));
  	//$.proposal_table.search = $.search_history;
	//Alloy.Collections.proposal.fetch();	

};

$.proposallist_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('proposallistlist');
		clientController.openMainWindow($.tab_proposal);
});

$.proposalenter_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('enterproposal');
		clientController.openMainWindow($.tab_proposal);
});

$.proposalsend_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('proposalsend');
		clientController.openMainWindow($.tab_proposal);
});