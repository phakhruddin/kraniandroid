exports.openMainWindow = function(_tab) {
  _tab.open($.client_window);
  Ti.API.info("This is child widow client.js" +JSON.stringify(_tab));
};

$.cliententer_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('enterclient');
		clientController.openMainWindow($.tab_client);
});

$.clientlist_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('clientlist');
		clientController.openMainWindow($.tab_client);
});
