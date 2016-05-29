exports.openMainWindow = function(_tab) {
  _tab.open($.invoice_window);
  Ti.API.info("This is child widow invoice.js" +JSON.stringify(_tab));
  	//$.invoice_table.search = $.search_history;
	//Alloy.Collections.invoice.fetch();	

};

$.invoicelist_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('invoicelistlist');
		clientController.openMainWindow($.tab_invoice);
});

$.invoiceenter_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('enterinvoice');
		clientController.openMainWindow($.tab_invoice);
});

$.invoicesend_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('invoicesend');
		clientController.openMainWindow($.tab_invoice);
});
