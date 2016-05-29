exports.openMainWindow = function(_tab) {
  _tab.open($.enterproposal_window);
  Ti.API.info("This is child widow proposal.js" +JSON.stringify(_tab));
};

$.proposalcustomerdetail_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('proposalcust');
		clientController.openMainWindow($.tab_enterproposal);
});
$.lineitem_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('lineitem');
		clientController.openMainWindow($.tab_enterproposal);
});
