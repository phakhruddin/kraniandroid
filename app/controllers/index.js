$.index.open();
//Initialization
//Debug value
Titanium.App.Properties.setInt('mindebug',0);
Titanium.App.Properties.setInt('maxdebug',0);
//refresh the database

function Login(e) {
	Alloy.Globals.Log("index.js::login(e): " +JSON.stringify(e));
	var buttonstate = e.source.title;
	Alloy.Globals.Log("index.js::login(e): buttonstate: " +buttonstate);
	function logout(e){
		Alloy.Globals.Log("index.js:: logout: "+JSON.stringify(e));
		Alloy.Globals.googleAuthSheet.deAuthorize();
		Alloy.Globals.Cleanup();
		$.login_button.title="LOGIN";
	}
	switch(buttonstate) {
    case "LOGIN":
    	Alloy.Globals.Log("index.js::login(e): buttonstate: execute CASE " +buttonstate);
    	$.login_button.title="Logout";
    break;
        case "Logout":
    Alloy.Globals.Log("tabViewOne.js::login(e): buttonstate: execute CASE " +buttonstate);
    	logout();
    break;
   }
}
