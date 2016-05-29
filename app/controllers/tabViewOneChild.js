exports.openMainWindow = function(_tab) {
  _tab.open($.child_window);
  console.debug("This is child widow tabViewOneChild.js" +_tab);
  $.check_loc.addEventListener("click", function(e) {
		//Alloy.Globals.checkLoc();
	});
};