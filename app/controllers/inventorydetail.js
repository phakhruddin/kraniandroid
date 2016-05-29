var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.inventorydetail_window);
  Ti.API.info("This is child widow checking _tab on : " +JSON.stringify(_tab));
  Ti.API.info(" input details : "+JSON.stringify(args));
};

var someDummy = Alloy.Models.dummy;
Alloy.Globals.Log("stringify dummy :"+JSON.stringify(someDummy));
someDummy.set('id', '1234');
someDummy.fetch();

var data = args.title.split(':');
var inventoryname = data[0];
var firstname = data[1];
var lastname = data[2];
var fullname = firstname+" "+lastname;
var company = data[3];
var phone = data[4];
var email = data[5];
var address = data[6];
var city = data[7];
var state = data[8];
var country = data[9];
var status = data[10];
var notes = data[11];
var percentcomplete = data[12];
var nextappt = data[13];
var datedue = data[14];

someDummy.set('fullname', fullname);
someDummy.set('company', company);
someDummy.set('phone', phone);
someDummy.set('email', email);
someDummy.set('address', address+", "+city+", "+state+", "+country);
someDummy.set('firstname', firstname);
someDummy.set('lastname', lastname);
someDummy.set('notes', notes);
someDummy.set('percentcomplete', percentcomplete);
someDummy.set('nextappt', nextappt);
someDummy.set('datedue', datedue);