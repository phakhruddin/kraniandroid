var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.clientdetail_window);
  Ti.API.info("This is child widow checking _tab on clientdetail : " +JSON.stringify(_tab));
  Ti.API.info(" input details : "+JSON.stringify(args));
};

var someDummy = Alloy.Models.dummy;
Alloy.Globals.Log("clientdetail.js::stringify dummy :"+JSON.stringify(someDummy));
someDummy.set('id', '1234');
someDummy.fetch();

var data = args.title.split(':');
var customerid = data[0];
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
var citystate = city+". "+state+", "+country;
var invoice = data[10];
var project = data[11];
var proposal = data[12];
//var idtag = data[13].replace("xCoLoNx",",").split(',')[0].replace("yCoLoNy",":");
var idtag = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[0].replace('yCoLoNy',':'):"none";
var selfhref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[1].replace('yCoLoNy',':'):"none";
var edithref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[2].replace('yCoLoNy',':'):"none";

Alloy.Globals.Log("clientdetail.js::idtag :"+idtag+" edithref: "+edithref+" selfhref: "+selfhref);

if (customerid) {
	var clients = Alloy.Collections.instance('client');
	clients.fetch();		
	var theclient = clients.where({col1:customerid}); //FILTER
	if (theclient.length > 0 ){
		for (j=0;j<theclient.length;j++){
			   var theclientjson = theclient[j].toJSON(); // EXTRACT ONE ROW. IF MANY. FOR LOOP.
    		   Alloy.Globals.Log("clientdetail.js::theclientjson.col1 :"+theclientjson.col1+" col2: "+theclientjson.col2);
		}
	}
 
}

someDummy.set('fullname', fullname);
someDummy.set('firstname', firstname);
someDummy.set('lastname', lastname);
someDummy.set('company', company);
someDummy.set('phone', (phone)?phone.toString().replace(/^(...)(...)/g, "\($1\) $2-"):"");
someDummy.set('email', email);
someDummy.set('address', address);
someDummy.set('city', city);
someDummy.set('state', state);
someDummy.set('citystate', citystate);
someDummy.set('country', country);
someDummy.set('firstname', firstname);
someDummy.set('lastname', lastname);
someDummy.set('customerid', customerid);
someDummy.set('invoice', invoice);
someDummy.set('project', project);
someDummy.set('proposal', proposal);

function editAction(e){
		Alloy.Globals.Log("clientdetail.js:: editAction e : "+JSON.stringify(e));
		var clientController = Alloy.createController('enterclient',{
			customerid : customerid,
			firstname : firstname,
			lastname : lastname,
			fullname : fullname,
			company : company,
			phone : phone,
			email : email,
			address : address,
			city : city,
			state : state,
			country : country,
			citystate : citystate,
			invoice : invoice,
			project : project,
			proposal : proposal,
			idtag : idtag,
			edithref : edithref,
			selfhref : selfhref
		});
		clientController.openMainWindow($.tab_clientdetail);
}