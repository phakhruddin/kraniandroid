
$.location.addEventListener ("click", function(e){
	Alloy.Globals.openDetail(e);
	var item = "labor";
	var sid = Titanium.App.Properties.getString(item,"none");
	Alloy.Globals.getPrivateData(sid,item);
  	var tabViewOneChildController = Alloy.createController("location");
  	tabViewOneChildController.openMainWindow($.tab_one);	
});

function openNextTab(item){
	var sid = Titanium.App.Properties.getString(item,"none");
	Alloy.Globals.Log("tabViewOne::openNextTab::sid for "+ item +" : "+sid);
	Alloy.Globals.getPrivateData(sid,item);
	var scheduleController = Alloy.createController(item);
	scheduleController.openMainWindow($.tab_one);	
}

$.project.addEventListener ("click", function(e){
	///Alloy.Globals.checkFileExistThenCreateSS("joblogssid");
	Alloy.Globals.openDetail(e);
	var item = e.row.id;
	openNextTab(item);
});

$.schedule.addEventListener ("click", function(e){
	Alloy.Globals.openDetail(e);
	var scheduleController = Alloy.createController("schedule");
 	scheduleController.openMainWindow($.tab_one);
});
 	
$.client.addEventListener ("click", function(e){
	$.activityIndicator.show();
	Alloy.Globals.openDetail(e);
	Ti.API.info("e info : "+JSON.stringify(e));
	var item = e.row.id;
	openNextTab(item);
});

$.invoicelistlist.addEventListener ("click", function(e){
	Alloy.Globals.openDetail(e);

 		var item = 'invoice';
 			var sid = Titanium.App.Properties.getString(item,"none");
	Alloy.Globals.Log("tabviewone.js::sid for "+ item +" : "+sid);
	Alloy.Globals.getPrivateData(sid,item);
		var scheduleController = Alloy.createController("invoicelistlist");
 	scheduleController.openMainWindow($.tab_one);
	//openNextTab(item);
});

$.supplier.addEventListener ("click", function(e){
	checkNetworkAndGoogleAuthorized('1gnkP116nsTVxtrw6d_mXVdOiesQEPH7LVUIyHUfx9EE');
			var needAuth = Titanium.App.Properties.getString('needAuth');
				Alloy.Globals.Log("needAuth is :  " +needAuth);
	if (needAuth == "true") {googleAuth.authorize();};
	Alloy.Globals.openDetail(e);
	var scheduleController = Alloy.createController("supplier");
	scheduleController.openMainWindow($.tab_one);	
});

$.inventory.addEventListener ("click", function(e){
	Alloy.Globals.openDetail(e);
	var item = e.row.id;
	openNextTab(item);
});

$.proposallistlist.addEventListener ("click", function(e){
	Alloy.Globals.openDetail(e);

 		var item = 'proposal';
 			var sid = Titanium.App.Properties.getString(item,"none");
	Alloy.Globals.Log("tabviewone.js::sid for "+ item +" : "+sid);
	Alloy.Globals.getPrivateData(sid,item);
		var scheduleController = Alloy.createController("proposallistlist");
 	scheduleController.openMainWindow($.tab_one);
	//openNextTab(item);
});


/*
$.proposal.addEventListener ("click", function(e){
	Alloy.Globals.openDetail(e);
	var item = e.row.id;
	openNextTab(item);
});*/

$.settings.addEventListener ("click", function(e){
	Alloy.Globals.openDetail(e);
	var tabViewOneController = Alloy.createController("settings",{
		metadata: "from tabviewOne",
		callbackFunction: showFutureMenu
	});
	tabViewOneController.openMainWindow($.tab_one);	
});


var scope = ['https://spreadsheets.google.com/feeds', 'https://docs.google.com/feeds','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly','https://www.googleapis.com/auth/drive'];
scope.push ("https://www.googleapis.com/auth/drive.appdata");
scope.push ("https://www.googleapis.com/auth/drive.apps.readonly");
scope.push ("https://www.googleapis.com/auth/drive.file");
var GoogleAuth = require('googleAuth');
var googleAuth = new GoogleAuth({
	clientId : Alloy.Globals.clientId,
	clientSecret : 'fjrsVudiK3ClrOKWxO5QvXYL',
	propertyName : 'googleToken',
	scope : scope,
	quiet: false
});

var loadingLabel = Ti.UI.createLabel({
  color: '#FCF9F9',
  font: { fontSize:18 },
  text: 'Connecting to google. Please wait ...',
  textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
  top: "50%",
  width: Ti.UI.SIZE, height: Ti.UI.SIZE
});
var loadingView = Titanium.UI.createView({
   borderRadius:10,
   backgroundColor:'#514F4F',
   width:Ti.UI.FILL,
   height:Ti.UI.FILL
});
loadingView.add(loadingLabel);

var refreshView = Titanium.UI.createView({
   borderRadius:10,
   opacity:"0.5",
   backgroundColor:'#514F4F',
   width:Ti.UI.FILL,
   height:Ti.UI.FILL
});

var signinView = Titanium.UI.createView({
   opacity:"0.95",
   backgroundColor:'#514F4F',
   width:Ti.UI.FILL,
   height:Ti.UI.FILL
});
var signinButton = Titanium.UI.createButton({
   title: 'LOGIN',
   width: 100,
   height: 50,
   color: "white",
   font: {
   	fontSize:"32"
   }
});
signinButton.addEventListener('click',function(e)
{
   Alloy.Globals.Log("You clicked the button");
   $.tabviewone_window.remove(signinView);
   login(e);
});
signinView.add(signinButton);
$.tabviewone_window.add(signinView);


checkNetworkAndGoogleAuthorized = function(sid){
	var url = "https://spreadsheets.google.com/feeds/list/"+sid+"/od6/public/basic?hl=en_US&alt=json";
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Ti.API.info("network is good. Replies are: "+this.responseText);
	    		Alloy.Globals.Log("googleAuth.isAuthorized:  " +googleAuth.isAuthorized);
	    		Titanium.App.Properties.setString('needAuth',"false");
	    		googleAuth.isAuthorized(function() {
						Alloy.Globals.Log('Access Token: ' + googleAuth.getAccessToken());
					}, function() {
						Alloy.Globals.Log('TV1 Authorized first, see next window: '+(new  Date()));
						Titanium.App.Properties.setString('needAuth',"true");
					});
			
	    		
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.onerror = function(e){
		alert("error: "+e.code+" : Unable to pull data from cloud");
		Alloy.Globals.Log("tabViewOne::checkNetworkAndGoogleAuthorized:failed to get to: "+url);
	};
	xhr.open("GET", url);
	xhr.send();
};

function checkUserLicense(name){
	Alloy.Globals.LicenseCheck(name,"freeuser");
	setTimeout(function(){Alloy.Globals.LicenseCheck(name,"paidbasic");},1000);
	setTimeout(function(){
		$.user_row.height = (Alloy.Globals.statusHeight)?Alloy.Globals.statusHeight:"1%";
		$.user_row.backgroundColor = (Alloy.Globals.statusColor)?Alloy.Globals.statusColor:"white";
		$.user_label.color = "white";
		$.user_label.text = (Alloy.Globals.userText)?Alloy.Globals.userText:"";
	},2000);		
}

function prefetchJoblogSID(){
	var sid = Titanium.App.Properties.getString('joblogssid',"none");
	Alloy.Globals.Log("prefetchJoblogSID:: checking sid :" +sid);
	if ( sid != "none"){
		Alloy.Globals.Log('prefetchJoblogSID:: populate Alloy.Globals.getPrivateData('+sid+','+joblogsid+'); ');
		Alloy.Globals.getPrivateData(sid,"joblogsid");
	} else {
		Alloy.Globals.Log("prefetchJoblogSID:: joblogsid sid does not exists !");
	}
	
}

//prefetchJoblogSID();

function initialLoad(){
	checkNetworkAndGoogleAuthorized('1gnkP116nsTVxtrw6d_mXVdOiesQEPH7LVUIyHUfx9EE');
	var item = 'invoice';
 	var sid = Titanium.App.Properties.getString(item,"none");
 	Alloy.Globals.Log("tabviewone.js:InitialLoad:sid for "+ item +" : "+sid);
	Alloy.Globals.getPrivateData(sid,item);
	Alloy.Collections.instance(item).fetch();
}

//initialLoad();

function getParentFolder(args) {
	var sid = Titanium.App.Properties.getString('joblog');
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Alloy.Globals.Log("tabViewOne:getParentFolder : this.responseText: "+this.responseText);
	    		var json = JSON.parse(this.responseText);
	    		Ti.API.info("response is: "+JSON.stringify(json));
	    		var parentid = json.items[0].id;
	    		Titanium.App.Properties.setString('parentid',parentid);
	    		//Alloy.Globals.Log("tabViewOne.js::args inside getParentFolder: "+JSON.stringify(args));
	    	} catch(e){
				Ti.API.info("tabViewOne:getParentFolder::cathing e: "+JSON.stringify(e));
				Ti.API.info('tabViewOne:getParentFolder::Authorized first, see next window: ');
				Titanium.App.Properties.setString('needAuth',"true");
				Alloy.Globals.googleAuthSheet.authorize();
				Ti.API.info('tabViewOne:getParentFolder::Access Token: ' + Alloy.Globals.googleAuthSheet.getAccessToken());
				$.login_button.title="REFRESH";
			}
			return parentid;
			Titanium.App.Properties.setString('parentid',parentid);
		}
		});
	xhr.onerror = function(e){
		//alert("tabViewOne::getParentFolder::Unable to get info.");
		Alloy.Globals.Log('tabViewOne::getParentFolder:: unable to get parents for '+sid);
	};
	Alloy.Globals.Log('tabViewOne::getParentFolder:: URL:: https://www.googleapis.com/drive/v2/files/'+sid+'/parents');
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files/'+sid+'/parents');
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};

//getParentFolder();
//Initial user create under freeuser
var parentid = Titanium.App.Properties.getString("freeuser");

function logout(e){
	Alloy.Globals.Log("tabviewone:: logout: "+JSON.stringify(e));
	Alloy.Globals.Cleanup();
	Alloy.Globals.googleAuthSheet.deAuthorize();
	$.logout_button.title = "Please click login ->";
}

function setMenuText() {
	Alloy.Globals.Log("tabViewOne.js::Titanium.App.Properties.getString(sharedkraniemailid): " +Titanium.App.Properties.getString("sharedkraniemailid")+" Titanium.App.Properties.getString(kraniemailid): "+Titanium.App.Properties.getString("kraniemailid"));
	(Titanium.App.Properties.getString("kraniemailid"))?$.label_schedule.text=" Schedule \("+Titanium.App.Properties.getString("kraniemailid").split('@')[0].trim()+"\)":"";
	(Titanium.App.Properties.getString("sharedkraniemailid"))?$.label_schedule.text= " Schedule \("+Titanium.App.Properties.getString("sharedkraniemailid").split('@')[0].trim()+"\)":"";	
	Titanium.App.Properties.setString('employee',Titanium.App.Properties.getString("emailid"));
	Alloy.Globals.Log("tabViewOne.js::setMenuText: sharedkraniemailid: " +Titanium.App.Properties.getString("sharedkraniemailid"));
}

//LOGO
function addLogo(){
	var logourl = Titanium.App.Properties.getString("logourl");
	var logoview = Ti.UI.createImageView ({
	        image : logourl,
	        top : 10,
	        height : "150",
	        width : "150"
	});
	
	if ( logourl ) {
	 	var logourl = Titanium.App.Properties.getString('logourl') ; 
	 	Alloy.Globals.Log("settings.js::logo url is: "+logourl); 
	 	$.logo_row.add(logoview);
	 } else { $.table.deleteRow($.logo_row);Alloy.Globals.Log("settings.js::logo does not exists.");};
}

function login(e) {
	Alloy.Globals.Log("tabViewOne.js::login(e): " +JSON.stringify(e));
	var buttonstate = e.source.title;
	Alloy.Globals.Log("tabViewOne.js::login(e): buttonstate: " +buttonstate);
	function logout(e){
		Alloy.Globals.Log("tabviewone:: logout: "+JSON.stringify(e));
		Alloy.Globals.googleAuthSheet.deAuthorize();
		Alloy.Globals.Cleanup();
		$.logout_button.title = "Please click login ->";
		$.login_button.title="LOGIN";
	}
	switch(buttonstate) {
    case "LOGIN":
        
    	Alloy.Globals.Log("tabViewOne.js::login(e): buttonstate: execute CASE " +buttonstate);
		Alloy.Globals.googleAuthSheet.isAuthorized(function() {
			$.login_button.title="";
			$.tabviewone_window.add(loadingView);
			Ti.API.info('Access Token: ' + Alloy.Globals.googleAuthSheet.getAccessToken());
			Titanium.App.Properties.setString('needAuth',"false");
			//login activity
			setTimeout(function(){
				Alloy.Globals.Log(new Date()+"::tabviewone.js::login:before loginActivity()");
				$.status_view.backgroundColor="green";
				$.status_view.height="1%";
				$.status_label.text="";
				$.login_button.title="Logout";
				$.logout_button.title=Titanium.App.Properties.getString("emailid").split('@')[0].trim();
				checkUserLicense($.logout_button.title);
				setMenuText();
				Alloy.Globals.loginActivity();
				$.tabviewone_window.remove(loadingView);
				$.tabviewone_window.remove(signinView);
			},2000);
			
		}, function() {
			//$.tabviewone_window.hide();
			$.login_button.title="";	
			$.tabviewone_window.add(loadingView);
			Ti.API.info('Authorized first, see next window: ');		
			Titanium.App.Properties.setString('needAuth',"true");
			Alloy.Globals.googleAuthSheet.authorize();
			setTimeout(function(){
				Alloy.Globals.Log((new Date())+"tabViewOne::show back window");
				//$.tabviewone_window.show();
				$.login_button.title="REFRESH";	
				$.status_view.backgroundColor="orange";
				$.status_view.height="5%";
				$.status_label.text="Please click REFRESH above.";
				$.tabviewone_window.add(refreshView);
				$.tabviewone_window.remove(loadingView);
			},10000);
			Ti.API.info('Access Token: ' + Alloy.Globals.googleAuthSheet.getAccessToken());
			//pause for a while before next action.
			function dosettimeout (i,timeoutms) {
				setTimeout(function(){
					Alloy.Globals.Log((new Date())+"tabViewOne::loop no: "+i+" after "+timeoutms*i+" secs");		
				},timeoutms*i);
			}
			
			var count=7;
			var timeoutms = 10000; //10secs
			var i=0;
			
			for (i=0;i<count;i++){
				Alloy.Globals.Log((new Date())+"tabViewOne::i is: "+i);
				if(Alloy.Globals.googleAuthSheet.getAccessToken()){ 
					Alloy.Globals.Log((new Date())+"tabViewOne::break it after "+i+" times w/token: "+ Alloy.Globals.googleAuthSheet.getAccessToken());				
				} else {
					Alloy.Globals.Log((new Date())+"tabViewOne::dosettimeout("+i+","+timeoutms+" w/token: "+ Alloy.Globals.googleAuthSheet.getAccessToken());
					dosettimeout(i,timeoutms);
				}	
			}

		});
        break;
    case "REFRESH":
    	Alloy.Globals.Log("tabViewOne.js::login(e): buttonstate: execute CASE " +buttonstate);
		var themastersid=[];
		//wait for 30secs upon OAUTH2 screen
		function refreshActivity() {
			Alloy.Globals.Log("tabViewOne.js::refresh(e): executing  refreshActivity()  ");
			Alloy.Globals.Log("tabViewOne.js::refresh(e): before executing  Alloy.Globals.getPrivateMaster()  ");
				//Alloy.Globals.getPrivateMaster();
				//Alloy.Globals.getMaster();
				Alloy.Globals.getJSONOnline();
				Alloy.Globals.Log("tabViewOne.js::refresh(e): before executing  Alloy.Globals.initialUserSetup()  ");
				Alloy.Globals.initialUserSetup(); 
				function getEmail(e){
							var xhr = Ti.Network.createHTTPClient({
						    onload: function(e) {
						    try {
						    		var json = JSON.parse(this.responseText);
						    		Ti.API.info("response is: "+JSON.stringify(json));
						    		var emailid = json.email;
						    		Titanium.App.Properties.setString('emailid',emailid); $.logout_button=Titanium.App.Properties.getString('emailid').split('@')[0].trim();
						    		//Set the company emailid. Set to oneself if this is not a shared account.
						    		if (Titanium.App.Properties.getString('kraniemailid')){
						    			var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
						    			checkUserLicense(kraniemailid);
						    		} else {
						    			Titanium.App.Properties.setString('kraniemailid',emailid);
						    			var kraniemailid=emaild;
						    			checkUserLicense(kraniemailid);
						    			};
						    		Alloy.Globals.Log("tabViewOne.js::args inside getEmail: emailid "+emailid+" :: "+JSON.stringify(e));
						    		
						    	} catch(e){
									Ti.API.info("cathing e: "+JSON.stringify(e));
								}
								return emailid;
								Titanium.App.Properties.setString('emailid',emailid);
							}
							});
						xhr.onerror = function(e){
							//alert("tabViewOne::getEmail::Unable to get info.");
							Alloy.Globals.Log('tabViewOne::getEmail:: unable to get info for '+e);
						};
						Alloy.Globals.Log('tabViewOne::getEmail:: URL:: https://www.googleapis.com/oauth2/v1/userinfo?alt=json');
						xhr.open("GET", 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json');
						xhr.setRequestHeader("Content-type", "application/json");
					    xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
						xhr.send();
					}
					
					function getParentID(email){
						Alloy.Globals.Log("tabViewOne.js::getParentID: with email: " +email);
						var themastersid = Alloy.Collections.instance('master');
						themastersid.fetch();
						Ti.API.info(" themastersid : "+JSON.stringify(themastersid));
						if (themastersid.length > 0) {
							var mastersidjson = themastersid.toJSON();
							Alloy.Globals.Log("tabViewOne.js::JSON.stringify(mastersidjson): " +JSON.stringify(mastersidjson));
							for( var i=0; i < mastersidjson.length; i++){
								var mastercol1 = mastersidjson[i].col1.trim();
								if ( mastercol1 == email.trim()) { 
									Ti.API.info(" tabViewOne::getParentID: found mastercol1: "+mastercol1+" vs. "+email.trim());
									var parentid = mastersidjson[i].col2.trim(); 
									Titanium.App.Properties.setString('parentid',parentid);
								};
							}	
							if (parentid) {
								Alloy.Globals.Log("tabViewOne.js::getParentID: parentid is: "+parentid);
								//$.email_label.text=email;
								//$.email_label.font={fontSize:"5dp"};
				
								//alert(email+" is registered user. Please proceed. Thanks");
							} else {
								alert(email+" is NOT registered user. Using demo access. Please proceed. Thanks");
							}	
						} 
					}
					
					if (Alloy.Globals.googleAuthSheet.getAccessToken()) {getEmail();}
					var email= Titanium.App.Properties.getString('emailid');
					if (email) {
					//var mastersid = Titanium.App.Properties.getString('master');
					//Alloy.Globals.getPrivateData(mastersid,"master");
					//getParentID(email);
					//TODO:steps to get parentid.
					
				} else {(Alloy.Globals.googleAuthSheet.getAccessToken()) && getEmail(); }

				///addLogo();
			}
		Alloy.Globals.Log("check Alloy.Globals.googleAuthSheet.getAccessToken() "+Alloy.Globals.googleAuthSheet.getAccessToken()+" before execute refreshActivity() ");
		if(Alloy.Globals.googleAuthSheet.getAccessToken()){
			Alloy.Globals.Log("tabViewOne.js::refresh(e): executing refreshActivity ");
			refreshActivity();
		} else {
			Alloy.Globals.Log("tabViewOne.js::refresh(e): 30 secs timeout before executing refreshActivity ");
			setTimeout(function(){ 
				refreshActivity();
			}, 30000);
		}
		setTimeout(function(){
			$.status_view.backgroundColor="green";
			$.status_view.height="1%";
			$.status_label.text="";
			$.login_button.title="Logout";
			$.tabviewone_window.remove(refreshView);
			setMenuText();
			/*
			if (Titanium.App.Properties.getString("kraniemailid")) {
				var buttontitle = (Titanium.App.Properties.getString("sharedkraniemailid"))?Titanium.App.Properties.getString("sharedkraniemailid").split('@')[0].trim():Titanium.App.Properties.getString("kraniemailid").split('@')[0].trim();
				$.logout_button.title = buttontitle;
				};*/
		},2000);
        break;
    case "RefreshAgain":
    	Alloy.Globals.Log("tabViewOne.js::login(e): buttonstate: execute CASE " +buttonstate);
    	logout();
    break;
    case "Logout":
    Alloy.Globals.Log("tabViewOne.js::login(e): buttonstate: execute CASE " +buttonstate);
    	logout();
    break;
	} 

}
		
var refresh = Ti.UI.createRefreshControl({
    tintColor:'orange'
});

$.table.refreshControl=refresh;

refresh.addEventListener('refreshstart',function(e){
	setTimeout(function(){
        Alloy.Globals.Log('tabviewone::refresh:: JSON.stringify(e): '+JSON.stringify(e));
        Alloy.Globals.refreshActivity();
        setMenuText();
        refresh.endRefreshing();
    }, 2000);
});

function showFutureMenu(response) {
	if(response == "yes") {
		$.table.appendRow($.futuremenu);
		$.table.appendRow($.supplier);
		$.table.appendRow($.inventory);
		$.table.appendRow($.report);			
	} else {
		$.table.deleteRow($.report);
		$.table.deleteRow($.inventory);
		$.table.deleteRow($.supplier);
		$.table.deleteRow($.futuremenu);	
	}	
}

showFutureMenu("no");

$.google.addEventListener ("click", function(e){
	Alloy.Globals.openDetail(e);
	var tabViewOneController = Alloy.createController("google",{
		metadata: "from tabviewOne",
		callbackFunction: showFutureMenu
	});
	tabViewOneController.openMainWindow($.tab_one);	
});

//LOGO
/*addLogo();
 $.logo_row.addEventListener ("click", function(e){
 	Alloy.Globals.Log('tabviewone::logo_row:: JSON.stringify(e): '+JSON.stringify(e));
 	if ( e.source.image = "" ) {
 		Alloy.Globals.Log('tabviewone::logo_row:: expand row: e.source.image '+e.source.image);
 		e.source.height = "Ti.UI.Size";		
 		var logourl = Titanium.App.Properties.getString("logourl");
 		e.source.image = logourl;	
 	} else {
 		Alloy.Globals.Log('tabviewone::logo_row:: shrink row: e.source.image '+e.source.image);
 		e.source.image = "";
 		e.source.height = "20";
 
 	}
 });*/

 
