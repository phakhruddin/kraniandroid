exports.openMainWindow = function(_tab) {
  _tab.open($.enterdata_window);
  Ti.API.info("This is child widow schedule.js" +JSON.stringify(_tab));

	$.enterclient.addEventListener ("click", function(e){
		Alloy.Globals.openDetail(e);
		var scheduleController = Alloy.createController("enterclient");
		scheduleController.openMainWindow($.tab_enterdata);	
	});

	$.enterinvoice.addEventListener ("click", function(e){
		Alloy.Globals.openDetail(e);
		var scheduleController = Alloy.createController("enterinvoice");
		scheduleController.openMainWindow($.tab_enterdata);	
	});
	
	$.enterproject.addEventListener ("click", function(e){
		Alloy.Globals.openDetail(e);
		var scheduleController = Alloy.createController("enterproject");
		scheduleController.openMainWindow($.tab_enterdata);	
	});

};