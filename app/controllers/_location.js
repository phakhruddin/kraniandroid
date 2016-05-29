exports.openMainWindow = function(_tab) {
  _tab.open($.location_window);
  Ti.API.info("This is child widow checking _tab : " +JSON.stringify(_tab));
  
  $.updateloc.addEventListener ("click", function(e){
		Alloy.Globals.openDetail(e);
		Alloy.Globals.CheckLoc();
	});
  
  $.checkloc.addEventListener ("click", function(e){
		Alloy.Globals.openDetail(e);
		Alloy.Globals.getData('1-YaHKOuTqpRG1X83_1tZ6zHWrO1krEmV99HS7S130Hc','labor');
		var scheduleController = Alloy.createController("labor");
		scheduleController.openMainWindow($.tab_two);	
	});
	
  $.checkallloc.addEventListener ("click", function(e){
		Alloy.Globals.openDetail(e);
		Alloy.Globals.UpdateMap('all','all',"all");
	});
};