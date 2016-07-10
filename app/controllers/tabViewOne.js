var count=7;
var timeoutms = 10000; //10secs
var i=0;




function openNextTab(item){
	var sid = Titanium.App.Properties.getString(item,"none");
	Alloy.Globals.Log("tabViewOne::openNextTab::sid for "+ item +" : "+sid);
	Alloy.Globals.getPrivateData(sid,item);
	var scheduleController = Alloy.createController(item);
	scheduleController.openMainWindow($.tab_one);	
}

function setMenuText() {
	Alloy.Globals.Log("tabViewOne.js::Titanium.App.Properties.getString(sharedkraniemailid): " +Titanium.App.Properties.getString("sharedkraniemailid")+" Titanium.App.Properties.getString(kraniemailid): "+Titanium.App.Properties.getString("kraniemailid"));
	//(Titanium.App.Properties.getString("kraniemailid"))?$.label_schedule.text=" Schedule \("+Titanium.App.Properties.getString("kraniemailid").split('@')[0].trim()+"\)":"";
	//(Titanium.App.Properties.getString("sharedkraniemailid"))?$.label_schedule.text= " Schedule \("+Titanium.App.Properties.getString("sharedkraniemailid").split('@')[0].trim()+"\)":"";	
	$.label_schedule.text=" Schedule";
	Titanium.App.Properties.setString('employee',Titanium.App.Properties.getString("emailid"));
	Alloy.Globals.Log("tabViewOne.js::setMenuText: sharedkraniemailid: " +Titanium.App.Properties.getString("sharedkraniemailid"));
}

function checkUserLicense(name){
	Alloy.Globals.LicenseCheck(name,"freeuser");
	//setTimeout(function(){Alloy.Globals.LicenseCheck(name,"paidbasic");},1000);
	setTimeout(function(){
		$.user_row.height = (Alloy.Globals.statusHeight)?Alloy.Globals.statusHeight:"5";
		$.user_row.backgroundColor = (Alloy.Globals.statusColor)?Alloy.Globals.statusColor:"white";
		$.user_label.color = "white";
		$.user_label.text = (Alloy.Globals.userText)?Alloy.Globals.userText:"";
	},2000);		
}



function login(e) {
	googleauthorizecount = 0;
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
    	Alloy.Globals.googleAuthSheet.isAuthorized(function() {
    		Alloy.Globals.Log('Access Token 1st: ' + Alloy.Globals.googleAuthSheet.getAccessToken());
			Titanium.App.Properties.setString('needAuth',"false");
			//login activity
			setTimeout(function(){
				Alloy.Globals.Log(new Date()+"::tabviewone.js::login:before loginActivity()");
				$.status_view.backgroundColor="green";
				$.status_view.height="2";
				$.status_label.text="";
				$.login_button.title="Logout";
				if (Titanium.App.Properties.getString("emailid")) {
					$.logout_button.title=Titanium.App.Properties.getString("emailid").split('@')[0].trim();
					checkUserLicense($.logout_button.title);					
					setMenuText();
					Alloy.Globals.loginActivity();
					$.tabviewone_window.remove(loadingView);
					$.tabviewone_window.remove(signinView);
				} else {
					Alloy.Globals.Log(new Date()+"::tabviewone.js::login:before loginActivity(): email is not found "+Titanium.App.Properties.getString("emailid")); 
					refresh(e);				}			
			},2000);

    	}, function() {
    		$.login_button.title="";	
			$.tabviewone_window.add(loadingView);
    		Alloy.Globals.Log('tabViewOne.js:Authorized first, see next window: googleauthorizecount: '+googleauthorizecount);
    		Titanium.App.Properties.setString('needAuth',"true");   		
    		if ( googleauthorizecount != 1 ) { Alloy.Globals.googleAuthSheet.authorize();}
    		var googleauthorizecount = 1;
			setTimeout(function(){
				Alloy.Globals.Log((new Date())+"tabViewOne::show back window");
				//$.tabviewone_window.show();
				$.login_button.title="REFRESH";	
				$.status_view.backgroundColor="orange";
				$.status_view.height="30";
				$.status_label.text="Please click REFRESH above.";
				$.tabviewone_window.add(refreshView);
				$.tabviewone_window.remove(loadingView);
			},10000);
    		function dosettimeout (i,timeoutms) {
				setTimeout(function(){
					Alloy.Globals.Log((new Date())+"tabViewOne::loop no: "+i+" after "+timeoutms*i+" secs");		
				},timeoutms*i);
			}
			Alloy.Globals.Log('Access Token 2nd: ' + Alloy.Globals.googleAuthSheet.getAccessToken());
			
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
		refresh(e);
        break;    
    case "Logout":
    Alloy.Globals.Log("tabViewOne.js::login(e): buttonstate: execute CASE " +buttonstate);
    	logout();
    break;
   }
}


function refresh(e){
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
			$.status_view.height="5";
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
}

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
var refreshButton = Titanium.UI.createButton({
   title: 'REFRESH',
   width: 150,
   height: 80,
   color: "white",
   font: {
   	fontSize:"24"
   }
});
refreshButton.addEventListener('click',function(e)
{
   Alloy.Globals.Log("You clicked the refresh button");
   $.tabviewone_window.remove(refreshView);
   refresh(e);
});
refreshView.add(refreshButton);

var signinView = Titanium.UI.createView({
   opacity:"0.95",
   backgroundColor:'#514F4F',
   width:Ti.UI.FILL,
   height:Ti.UI.FILL
});
var signinButton = Titanium.UI.createButton({
   title: 'LOGIN',
   width: 150,
   height: 80,
   color: "white",
   font: {
   	fontSize:"36"
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



$.schedule.addEventListener ("click", function(e){
	Alloy.Globals.openDetail(e);
	var scheduleController = Alloy.createController("schedule");
 	scheduleController.openMainWindow($.tab_one);
});

$.project.addEventListener ("click", function(e){
	Alloy.Globals.openDetail(e);
	var item = e.row.id;
	openNextTab(item);
});

$.client.addEventListener ("click", function(e){
	Alloy.Globals.openDetail(e);
	var item = e.row.id;
	openNextTab(item);
});

$.location.addEventListener ("click", function(e){
	Alloy.Globals.openDetail(e);
	var item = "labor";;
	var sid = Titanium.App.Properties.getString(item,"none");
	Alloy.Globals.getPrivateData(sid,item);
  	var tabViewOneChildController = Alloy.createController("location");
  	tabViewOneChildController.openMainWindow($.tab_one);	
});

