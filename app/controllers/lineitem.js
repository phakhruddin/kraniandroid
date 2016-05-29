exports.openMainWindow = function(_tab) {
  _tab.open($.lineitem_window);
  Ti.API.info("This is child widow: " +JSON.stringify(_tab));
};