exports.openMainWindow = function(_tab) {
  _tab.open($.project_window);
  Ti.API.info("This is child widow project.js" +JSON.stringify(_tab));	
};

$.projectenter_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('enterproject');
		clientController.openMainWindow($.tab_project);
});

$.projectlist_row.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('projectlist');
		clientController.openMainWindow($.tab_project);
});