var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.jobdetail_window);
  Ti.API.info("This is child widow checking _tab on : " +JSON.stringify(_tab));
  Ti.API.info(" input details : "+JSON.stringify(args));
};

function closeWin(e) {
	Alloy.Globals.Log("e is: "+JSON.stringify(e));
}