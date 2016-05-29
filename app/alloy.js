// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

//default var
//Initialization.
//Get Licensed
//KRANI MASTER RECORD
//MasterRecord

Alloy.Globals.clientId = "101068780411-h8ko2j2s4jb6ikboj6epplbmrfgn3e9k.apps.googleusercontent.com"; // kraniapp@gmail.com
//Alloy.Globals.clientId = "693726333078-uncq4tte4lo9vfbhl6569d3uduvnn8fd.apps.googleusercontent.com"; //oldkrani1
//Alloy.Globals.clientId = "306793301753-8ej6duert04ksb3abjutpie916l8hcc7.apps.googleusercontent.com";
//var bootstrapid =  "1XajtTX5pdo5yMM_v9cC5-hgHOFlH1n0SN9McS3qElgQ"; //krani1
var bootstrapid =  "1VYoqBhH5b9lVTnpjiXUikFJ51HzNj-6rPGQ_eNIRQ84"; //krani2
Alloy.Globals.license = "freeuser";
var corefilenamearray = ["project","client","invoice","inventory","proposal","master","schedule","labor","joblog"];	
Alloy.Globals.corefilenamearray = corefilenamearray;
var jsonhosting = "http://23.21.53.150:20000";
//var jsonhosting = "https://api.myjson.com/bins/srmw";
var OfflineMode = 0; //default is ONLINE mode
//Titanium.App.Properties.setInt('mindebug',1);
//

Alloy.Globals.Cleanup = function(e) {
	var proptoremove = [];
	var proptoremove = (e)?proptoremove.push(e):["edithref","idtag","selfhref","lastpaiddate","paid","balance","krani_t","futuremenu"];
	for (i=0;i<proptoremove.length;i++){
		console.log("alloy.js:: b4 remove property "+proptoremove[i]+" Titanium.App.Properties.getString(\'"+proptoremove[i]+"\') : "+eval("Titanium.App.Properties.getString(\'"+proptoremove[i]+"\')"));
		eval("Ti.App.Properties.removeProperty(\'"+proptoremove[i]+"\')");
		console.log("alloy.js:: AFTER remove property "+proptoremove[i]+" Titanium.App.Properties.getString(\'"+proptoremove[i]+"\') : "+eval("Titanium.App.Properties.getString(\'"+proptoremove[i]+"\')"));
	}
};
Alloy.Globals.Cleanup();

Alloy.Globals.getMaster = function() {
	var url="https://spreadsheets.google.com/feeds/list/"+bootstrapid+"/od6/public/basic?hl=en_US&alt=json";
	var xhr = Ti.Network.createHTTPClient({
		    onload: function(ee) {
			    	json = JSON.parse(this.responseText);
			    	console.log("Alloy.Globals.updateType : this.responseText: "+this.responseText);
			    	console.log("Alloy.Globals.updateType : json: "+json);
			    	var out = '{ "poi" : ['+"\n";
			    	for (var i=0; i < json.feed.entry.length; i++) {
			    		var col1 = json.feed.entry[i].title.$t.trim();
						var col2= json.feed.entry[i].content.$t.split(',')[0].split(':')[1].trim() || "none";
						if(col1 && col2){
							eval("Titanium.App.Properties.setString(\""+col1+"\",col2)");
							if(col1=="freeuser"){Titanium.App.Properties.setString("freeuser",col2); };
							if(col1=="paiduser"){Titanium.App.Properties.setString("paiduser",col2);};
							if(col1=="paidbasic"){Titanium.App.Properties.setString("paidbasic",col2);};
							if(col1=="paidpremium"){Titanium.App.Properties.setString("paidpremium",col2);};
							if(col1=="paidunlimited"){Titanium.App.Properties.setString("paidunlimited",col2);};
							console.log("alloy::getMaster:: Titanium.App.Properties.getString("+col1+"): "+eval("Titanium.App.Properties.getString(col1)"));
							//console.log("alloy::getMaster:: Titanium.App.Properties.getString(publicrepo): "+Titanium.App.Properties.getString("publicrepo"));						
							}						
						if ( i == (json.feed.entry.length - 1)) {
							out += '{ "col1" : "'+col1+'" , "col2" : "'+col2+'" }]}'+"\n";
						} else {
							out += '{ "col1" : "'+col1+'" , "col2" : "'+col2+'" },'+"\n";
						}
			    	}
					Alloy.Globals.writeFile(out,"master.json");
					var json = out;		    
			}	
		});	
		console.log("alloy::getMaster:url :"+url);		
		xhr.open("GET", url);
		xhr.send();
};

Alloy.Globals.getPrivateMaster = function() {
	console.log("alloy.js::executing Alloy.Globals.getPrivateMaster");	
	var data = [];
	var maxdebug = Titanium.App.Properties.getInt('maxdebug');
	var mindebug = Titanium.App.Properties.getInt('mindebug');
	//var url = "https://spreadsheets.google.com/feeds/list/"+bootstrapid+"/od6/public/full";
	var url = "https://spreadsheets.google.com/feeds/list/"+bootstrapid+"/od6/private/full";
	var thefile = "gss"+bootstrapid+".xml";
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
			var xml = Titanium.XML.parseString(this.responseText);
			if(maxdebug==1){console.log("alloy.js::getPrivateMaster:: response txt is: "+this.responseText);};
			if(maxdebug==1){console.log("alloy.js::getPrivateMaster:: this xml is: " +xml);	};   
			var feed = xml.documentElement.getElementsByTagName("feed");
			var entry = xml.documentElement.getElementsByTagName("entry"); 
			(mindebug == 1) && console.log("alloy.js::this entry length is: " +entry.length);
			for (i=1;i<entry.length;i++){
				var col1 = entry.item(i).getElementsByTagName("gsx:col1").item(0).text;
				var col2 = entry.item(i).getElementsByTagName("gsx:col2").item(0).text;
				var col3 = entry.item(i).getElementsByTagName("gsx:col3").item(0).text;
				var idtag = entry.item(i).getElementsByTagName("id").item(0).text.replace(':','yCoLoNy');
				var link = entry.item(i).getElementsByTagName("link");
				if(col1 && col2){
					eval("Titanium.App.Properties.setString(\""+col1+"\",col2)");
					if(col1=="freeuser"){Titanium.App.Properties.setString("freeuser",col2); };
					if(col1=="paiduser"){Titanium.App.Properties.setString("paiduser",col2);};
					if(col1=="paidbasic"){Titanium.App.Properties.setString("paidbasic",col2);};
					if(col1=="paidpremium"){Titanium.App.Properties.setString("paidpremium",col2);};
					if(col1=="paidunlimited"){Titanium.App.Properties.setString("paidunlimited",col2);};
					console.log("alloy::getMaster:: Titanium.App.Properties.getString("+col1+"): "+eval("Titanium.App.Properties.getString(col1)"));
					//console.log("alloy::getMaster:: Titanium.App.Properties.getString(freeuser): "+Titanium.App.Properties.getString("freeuser"));						
				}	
				for (y=0;y<link.length;y++){			
	    			var listitem = link.item(y);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href").replace(':','yCoLoNy');}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href").replace(':','yCoLoNy');}
    			}
			}
			Ti.API.info(" Alloy.Globals.getPrivateMaster:Data were successfuly downloaded from "+url+". Please proceed.");
			} catch(e){
				Ti.API.info("Alloy.Globals.getPrivateMaster:: cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.onerror = function(e){
		//alert(e);
		console.log("alloy.js::Alloy.Globals.getPrivateMaster::Unable to connect to the network.url: "+url+" with error: "+JSON.stringify(e));
	};
	xhr.open("GET", url);
	xhr.send();
	
};


Alloy.Globals.getEmail = function(e){
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var json = JSON.parse(this.responseText);
	    		Ti.API.info("response is: "+JSON.stringify(json));
	    		var emailid = json.email;
	    		Titanium.App.Properties.setString('emailid',emailid);
	    		Titanium.App.Properties.setString('kraniemailid',emailid);
	    		console.log("tabViewOne.js::args inside getEmail: emailid "+emailid+" :: "+JSON.stringify(e));
	    		
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
			return emailid;
			Titanium.App.Properties.setString('emailid',emailid);
		}
		});
	xhr.onerror = function(e){
		//alert("tabViewOne::getEmail::Unable to get info.");
		console.log('tabViewOne::getEmail:: unable to get info for '+e);
	};
	console.log('tabViewOne::getEmail:: URL:: https://www.googleapis.com/oauth2/v1/userinfo?alt=json');
	xhr.open("GET", 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json');
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};


Alloy.Globals.getPrivateIndex = function(name) {	
	var data = [];
	var url = "https://spreadsheets.google.com/feeds/list/"+bootstrapid+"/od6/private/full";
	var thefile = "gss"+bootstrapid+".xml";
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
			var xml = Titanium.XML.parseString(this.responseText);
			if(maxdebug==1){console.log("alloy.js::Alloy.Globals.getPrivateIndex:: response txt is: "+this.responseText);};
			if(maxdebug==1){console.log("alloy.js::Alloy.Globals.getPrivateIndex:: this xml is: " +xml);	};   
			var feed = xml.documentElement.getElementsByTagName("feed");
			var entry = xml.documentElement.getElementsByTagName("entry"); 
			(mindebug == 1) && console.log("alloy.js::this entry length is: " +entry.length);
			for (i=1;i<entry.length;i++){
				var col1 = entry.item(i).getElementsByTagName("gsx:col1").item(0).text;
				var col2 = entry.item(i).getElementsByTagName("gsx:col2").item(0).text;
				var col3 = entry.item(i).getElementsByTagName("gsx:col3").item(0).text;
				var idtag = entry.item(i).getElementsByTagName("id").item(0).text.replace(':','yCoLoNy');
				var link = entry.item(i).getElementsByTagName("link");
				for (i=0;i<corefilenamearray.length;i++){
					if(col1 && col2){
						var item = corefilenamearray[i];
						var repo = name+"_"+item+"list";
						var reposid = col2;
						if(col1==repo){Titanium.App.Properties.setString(item,col2); };
						console.log("Alloy.Globals.getPrivateIndex :: Titanium.App.Properties.getString("+item+"): "+eval("Titanium.App.Properties.getString("+item+")"));
						//console.log("alloy::getMaster:: Titanium.App.Properties.getString(freeuser): "+Titanium.App.Properties.getString("freeuser"));						
					}						
				}

				for (y=0;y<link.length;y++){			
	    			var listitem = link.item(y);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href").replace(':','yCoLoNy');}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href").replace(':','yCoLoNy');}
    			}
			}
			} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.onerror = function(e){
		//alert(e);
		console.log("alloy.js::Alloy.Globals.getPrivateIndex::Unable to connect to the network.url: "+url);
	};
	xhr.open("GET", url);
	xhr.send();
	Ti.API.info(" Data were successfuly downloaded from "+url+". Please proceed.");
};

/*
//var projectsid = '1FMGrlYtWL6SUQuD-RynfEU_1kf5Yf6__ysrWsY2aAJI'; Titanium.App.Properties.setString('project',projectsid);
var projectsid = '1j2snli2uI9hc__UocnJyBF51z-YG1vWrybkzX79wUBw'; Titanium.App.Properties.setString('project',projectsid);
//var clientsid = '1ECkNoyzgeSu8WkVs3kBnlY8MjJRIAc787nVs6IJsA9w'; Titanium.App.Properties.setString('client',clientsid);
var clientsid = '1ECkNoyzgeSu8WkVs3kBnlY8MjJRIAc787nVs6IJsA9w'; Titanium.App.Properties.setString('client',clientsid);
//var invoicesid = '1-Wz7Apn4AvVpfqcNyMgfqyKA8OAoLNy5Bl0d_jQ9IZk'; Titanium.App.Properties.setString('invoice',invoicesid);
var invoicesid = '12EhwiCnDyDrBgaUD6JugXNutCDZpdADWWSojkXiy3w4'; Titanium.App.Properties.setString('invoice',invoicesid);
//var inventorysid = '1zq6rj-qHxYUkHY1jK2k_25I8_xWYrVOowbsp6VblixA'; Titanium.App.Properties.setString('inventory',inventorysid);
var inventorysid = '1dL3qwkAUImxzJpGsULC4lB3wTQASMzAt0PLi2bV8Z1U'; Titanium.App.Properties.setString('inventory',inventorysid);
//var proposalsid = '1H95ytL9cA1f3YU1Hag4GAtMUV98NyBcYqzyP04BDSwk'; Titanium.App.Properties.setString('proposal',proposalsid);
var proposalsid = '1q8UAYdPh_d-FewJdKbLno92ezigHyBi-YKSPXq5_Z3s'; Titanium.App.Properties.setString('proposal',proposalsid);
//var mastersid = '1WUtkBcD1q3ezozI98w0sq42rl1TwIOTMq25Yayj-sEk'; Titanium.App.Properties.setString('master',mastersid);
var mastersid = '1A-3H7zfFHP9GqcV5G89oQPAqRz8IiqPpOFbYPwm5bIU'; Titanium.App.Properties.setString('master',mastersid);
//var schedulesid = '1c5Nj6XOMIEtlqmHLDoyGocdNu5MRG-WQhckIseVlU2I'; Titanium.App.Properties.setString('schedule',schedulesid);
var schedulesid = '1z7piKUvCmishTQJok8yreMzZ16hfvbS_r8mfyExt980'; Titanium.App.Properties.setString('schedule',schedulesid);
//var laborsid = '1-YaHKOuTqpRG1X83_1tZ6zHWrO1krEmV99HS7S130Hc'; Titanium.App.Properties.setString('labor',laborsid);
var laborsid = '1-weM0tLsaf51_bungT67LMpdgbXEJIbX6s_5qvVFOyE'; Titanium.App.Properties.setString('labor',laborsid);
//var joblogsid = '1SLNRI176qK51rkFWWCQvqToXswdNYlqINsdB2HM0ozk'; Titanium.App.Properties.setString('joblog',joblogsid);
var joblogsid = '1JX1pq5PNoG0MCyl1V17OAdM3KXSYvTdZACy_QlLA8ds'; Titanium.App.Properties.setString('joblog',joblogsid);*/


var projectsid = Titanium.App.Properties.getString('project');
var clientsid = Titanium.App.Properties.getString('client');
var invoicesid = Titanium.App.Properties.getString('invoice');
var inventorysid = Titanium.App.Properties.getString('inventory');
var proposalsid = Titanium.App.Properties.getString('proposal');
var mastersid = Titanium.App.Properties.getString('master');
var schedulesid = Titanium.App.Properties.getString('schedule');
var laborsid = Titanium.App.Properties.getString('labor');
var joblogsid = Titanium.App.Properties.getString('joblog');
var authclientid = Titanium.App.Properties.getString('authclientid');
var authclientsecret = Titanium.App.Properties.getString('authclientsecret');

/*
var projectsid = Titanium.App.Properties.getString('project',projectsid);
var clientsid = Titanium.App.Properties.getString('client',clientsid);
var invoicesid = Titanium.App.Properties.getString('invoice',invoicesid);
var inventorysid = Titanium.App.Properties.getString('inventory',inventorysid);
var proposalsid = Titanium.App.Properties.getString('proposal',proposalsid);
var mastersid = Titanium.App.Properties.getString('master',mastersid);
var schedulesid = Titanium.App.Properties.getString('schedule',schedulesid);
var laborsid = Titanium.App.Properties.getString('labor',laborsid);
var joblogsid = Titanium.App.Properties.getString('joblog',joblogsid);
var authclientid = Titanium.App.Properties.getString('authclientid',authclientid);
var authclientsecret = Titanium.App.Properties.getString('authclientsecret',authclientsecret);*/

var coName = Titanium.App.Properties.getString('coName','Jack Mow Inc.');
var coAddress =  Titanium.App.Properties.getString('coAddress',"1125 Bluemound Rd., Brookfield, WI 53222");
var coPhone = Titanium.App.Properties.getString('coPhone',"262-290-3141");;
var coFax = Titanium.App.Properties.getString('coFax',"262-290-3142");
var coEmail = Titanium.App.Properties.getString('coEmail',"sales@jackmowinc.com");

var usertypearray = ["freeuser","paiduser","paidbasic","paidpremium","paidunlimited"];

console.log("alloy.js::TempDir: "+JSON.stringify(Ti.Filesystem.tempDirectory));
			
Alloy.Globals.writeFile = function (content, filename){
			var file = Ti.Filesystem.getFile(
				Ti.Filesystem.tempDirectory, filename
			);
			file.write(content+"\n");
};			

Alloy.Globals.appendFile = function (content, filename){
			var file = Ti.Filesystem.getFile(
				Ti.Filesystem.tempDirectory, filename
			);
			file.append(content+"\n");
};

Alloy.Globals.readFile = function (filename){
			var file = Ti.Filesystem.getFile(
				Ti.Filesystem.tempDirectory, filename
			);
			file.read();
};

Alloy.Globals.writeFileinJSON = function(content, filename){
	
};

Alloy.Globals.writeFile("","joblogsid.txt");
Alloy.Globals.writeFile("","kranilog.txt");
Alloy.Globals.Log = function(contents) {
	var maxdebug = Titanium.App.Properties.getInt('maxdebug');
	var mindebug = Titanium.App.Properties.getInt('mindebug');
	if (maxdebug == 1) {
		Alloy.Globals.appendFile((new Date())+"::"+contents,"kranilog.txt");
	}
	console.log(maxdebug+":"+(new Date())+"::"+contents);	
};

Alloy.Globals.GoogleAuth_module = require('googleAuth');

Alloy.Globals.googleAuth = new Alloy.Globals.GoogleAuth_module({
	//clientId : '219575370718-u3vb42f04899h02es4mj4uh34otgr5pe.apps.googleusercontent.com',
	clientId : Alloy.Globals.clientId,
	//clientSecret : 'CrWBzHVXAWykCWJwDT1EY-1I',
	propertyName : 'googleToken',
	quiet: false,
	scope : [ 'https://www.googleapis.com/auth/tasks', 'https://www.googleapis.com/auth/tasks.readonly' ]
});

Alloy.Globals.UpdateMap = function(latitude,longitude,title) {
	
	var latitude = latitude;
	var longitude = longitude;
	var subtitle = "None";
	Alloy.Globals.Log("alloy.js::map obtained with latitude: "+latitude+" longitude: "+longitude);
	
  if(Ti.Platform.osname == 'android'){
  		var Map = Titanium.Map;
  		
  		var name = Map.createAnnotation({
	    latitude:latitude,
	    longitude:longitude,
	    title:title,
	    pincolor:Map.ANNOTATION_RED,
	    myid:1 // Custom property to uniquely identify this annotation.
		});

  		var mapview = Map.createView({
	    mapType: Titanium.Map.STANDARD_TYPE,
	    region: {latitude:latitude, longitude:longitude,
	            latitudeDelta:0.1, longitudeDelta:0.1},
	    animate:true,
	    regionFit:false,
	    userLocation:true,
	    annotations:[name]
	});
  	} else {
		var Map = require('ti.map');
		
		var tollPlaza0 = Map.createAnnotation({
	    latitude:latitude,
	    longitude:longitude,
	    title:title,
	    pincolor:Map.ANNOTATION_RED,
	    myid:1 // Custom property to uniquely identify this annotation.
		});
		
		var addr = [];
		if (latitude === "all" || longitude === "all" || title === "all") {
			var addrdata = [];
			// fetch the labor database
			var thelabor = Alloy.Collections.instance('labor');
  			(thelabor) && thelabor.fetch();
  			var laborjson = thelabor.toJSON();
  			for( var i=0; i < laborjson.length; i++){
  				var title = laborjson[i].col2+' '+laborjson[i].col3;
  				var latitude = laborjson[i].col8.trim();
  				var longitude = laborjson[i].col9.trim();
  				addrdata.push({latitude: latitude,longitude:  longitude,title: title});
  			}
  			Alloy.Globals.Log("alloy.js::addrdata after push: "+JSON.stringify(addrdata));
		} else {
			var addrdata = [ {latitude: latitude,longitude:  longitude,title: title} ];
		}
				
		for (i=0;i<addrdata.length;i++){
			addr.push({
				latitude: addrdata[i].latitude,
				longitude: addrdata[i].longitude,
				title: addrdata[i].title,
				pincolor: Map.ANNOTATION_RED,
				myid:i,
				animate: 'true' 
			});
		};
		
		Alloy.Globals.Log("alloy.js::addrdata are: "+JSON.stringify(addrdata));
	    
	    var addrAnnotations = [];
		_.each(addr, function (addr) {
		  addrAnnotations.push(Map.createAnnotation({
		    title: addr.title,
		    pincolor: addr.pincolor,
		    latitude: addr.latitude,
		    longitude: addr.longitude,
		    myid: addr.myid
		  }));  
		});
		
			Alloy.Globals.Log("alloy.js::addrAnnotations are: "+JSON.stringify(addrAnnotations));

		var mapview = Map.createView({
	    mapType: Map.NORMAL_TYPE,
	    region: {latitude:latitude, longitude:longitude,
	            latitudeDelta:0.8, longitudeDelta:0.8},
	    animate:true,
	    userLocation:true,
	    regionFit:false,
	    annotations:addrAnnotations
	});
	
	}
	var win = Titanium.UI.createWindow({
		fullscreen: true,
		tabBarHidden : true,
		navBarHidden: false
	});	
//	Alloy.Globals.Log("mapview:" + JSON.stringify(mapview));
	
    if(Ti.Platform.osname == 'android'){
		alert("do nothing this is android");
   	} else {
	   	var btnBack = Ti.UI.createButton({ 
			title: '< Back', 
			top: 5,
			left: 10
		});
	   	var win1 = Titanium.UI.iOS.createNavigationWindow({
			Title: "MAP",
			backgroundColor: "transparent",
	   	  	window: win
	    });
	    win1.add(btnBack);
	    btnBack.addEventListener("click", function(_tab) { 
			console.debug("closing map" +_tab);
	//		Alloy.Globals.Log("tab:" + JSON.stringify(_tab));
			win1.close();
	});
   }; 
	// Handle click events on any annotations on this map.
	listener = function(evt){Alloy.Globals.Log("Annotation " + evt.title + " clicked, id: " + evt.annotation.myid +"  lat/lon: "+evt.annotation.latitude+"/"+evt.annotation.longitude);};
	mapview.addEventListener('click', listener);
	win.add(mapview);
	//win.open();
	if(Ti.Platform.osname == 'android'){
		win.open();
	} else {
		win1.open();
	};

};

Alloy.Globals.CheckLoc = function(){
	if (Ti.Geolocation.locationServicesEnabled) {
	Titanium.Geolocation.purpose = 'Get Current Location';
	Titanium.Geolocation.getCurrentPosition(function(e) {
	    if (e.error) {
	        Ti.API.error('Error: ' + e.error);
	    } else {
	        Alloy.Globals.Log("Alloy.Globals.CheckLoc:"+e.coords);
	        var coordslat =  e.coords.latitude;
	        alert("Thanks for updating your location. loc details: latitude :"+e.coords.latitude+" longitude : "+e.coords.longitude);
	        }
	    });
	} else {
	    alert('Please enable location services');
	}
};

Alloy.Globals.openDetail = function(e){
	Alloy.Globals.Log('Alloy.Globals.openDetail::all info = ' + JSON.stringify(e));
	Alloy.Globals.Log('Alloy.Globals.openDetail::index = ' + JSON.stringify(e.index));
	Alloy.Globals.Log("Alloy.Globals.openDetail::in open_button click event title :"+e.row.title);
};

Alloy.Globals.getData = function(sid,type) {	
	var url = "https://spreadsheets.google.com/feeds/list/"+sid+"/od6/public/basic?hl=en_US&alt=json";
	var thefile = "gss"+sid+".txt";
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
			// parse the retrieved data, turning it into a JavaScript object
	    	json = JSON.parse(this.responseText);
	    	//Alloy.Globals.Log("json data after download : " +json);
	    	var file = Ti.Filesystem.getFile(
				Ti.Filesystem.tempDirectory, thefile
			);
			if(file.exists() && file.writeable) {
			    var success = file.deleteFile();
			    Alloy.Globals.Log((success==true) ? 'success' : 'fail'); // outputs 'success'
			}
			file.write(this.responseText);
			//var OfflineMode = Titanium.App.Properties.setInt('mindebug');
			//if ( OfflineMode == 0 ) {
				(type == 'client') && Alloy.Collections.client.deleteAll();
				(type == 'project') && Alloy.Collections.project.deleteAll();
				(type == 'inventory') && Alloy.Collections.inventory.deleteAll();
				(type == 'invoice') && Alloy.Collections.invoice.deleteAll();
				(type == 'supplier') && Alloy.Collections.supplier.deleteAll();
				(type == 'proposal') && Alloy.Collections.proposal.deleteAll();
				(type == 'labor') && Alloy.Collections.labor.deleteAll();
				(type == 'joblog') && Alloy.Collections.joblog.deleteAll();
				(type == 'invoicesent') && Alloy.Collections.invoicesent.deleteAll();
				(type == 'proposalsent') && Alloy.Collections.proposalsent.deleteAll();
			//}		
			for (var i=1; i < +json.feed.entry.length; i++) {
				var dataModel = Alloy.createModel(type,{
					col1 :  json.feed.entry[i].title.$t.trim() || "none",
					col2 : json.feed.entry[i].content.$t.split(',')[0] && json.feed.entry[i].content.$t.split(',')[0].split(':')[1].trim() || "none",
					col3 : json.feed.entry[i].content.$t.split(',')[1] && json.feed.entry[i].content.$t.split(',')[1].split(':')[1].trim() || "none",
					col4 : json.feed.entry[i].content.$t.split(',')[2] && json.feed.entry[i].content.$t.split(',')[2].split(':')[1].trim() || "none",
					col5 : json.feed.entry[i].content.$t.split(',')[3] && json.feed.entry[i].content.$t.split(',')[3].split(':')[1].trim() || "none",
					col6 : json.feed.entry[i].content.$t.split(',')[4] && json.feed.entry[i].content.$t.split(',')[4].split(':')[1].trim() || "none",
					col7 : json.feed.entry[i].content.$t.split(',')[5] && json.feed.entry[i].content.$t.split(',')[5].split(':')[1].trim() || "none",
					col8 : json.feed.entry[i].content.$t.split(',')[6] && json.feed.entry[i].content.$t.split(',')[6].split(':')[1].trim() || "none",
					col9 : json.feed.entry[i].content.$t.split(',')[7] && json.feed.entry[i].content.$t.split(',')[7].split(':')[1].trim() || "none",
					col10 :  json.feed.entry[i].content.$t.split(',')[8] && json.feed.entry[i].content.$t.split(',')[8].split(':')[1].trim() || "none",
					col11 : json.feed.entry[i].content.$t.split(',')[9] && json.feed.entry[i].content.$t.split(',')[9].split(':')[1].trim() || "none",
					col12 :  json.feed.entry[i].content.$t.split(',')[10] && json.feed.entry[i].content.$t.split(',')[10].split(':')[1].trim() || "none",
					col13 :  json.feed.entry[i].content.$t.split(',')[11] && json.feed.entry[i].content.$t.split(',')[11].split(':')[1].trim() || "none",
					col14 :  json.feed.entry[i].content.$t.split(',')[12] && json.feed.entry[i].content.$t.split(',')[12].split(':')[1].trim() || "none",
					col15 :  json.feed.entry[i].content.$t.split(',')[13] && json.feed.entry[i].content.$t.split(',')[13].split(':')[1].trim() || "none",
					col16 :  json.feed.entry[i].content.$t.split(',')[13] && json.feed.entry[i].content.$t.split(',')[13].split(':')[1].trim() || "none",		
				});			
				dataModel.save();
			}
			//
			} catch(e){
				Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.onerror = function(e){
		alert(e);
	};
	xhr.open("GET", url);
	xhr.send();
	Alloy.Globals.Log(" Data were successfuly downloaded from "+url+". Please proceed.");
};

Alloy.Globals.createController = function(controller,sourcetab){
		var newController = Alloy.createController(controller);
		newController.openMainWindow(sourcetab);
};

Alloy.Globals.getPrivateData = function(sid,type) {	
	var data = [];
	var maxdebug = Titanium.App.Properties.getInt('maxdebug');
	var mindebug = Titanium.App.Properties.getInt('mindebug');
	Alloy.Globals.Log("alloy.js::Alloy.Globals.getPrivateData: type: min max debug: "+type+" :"+mindebug+" : "+maxdebug+" sid: "+sid);
	//Alloy.Globals.checkGoogleisAuthorized();
	//Alloy.Globals.checkNetworkAndGoogleAuthorized('1gnkP116nsTVxtrw6d_mXVdOiesQEPH7LVUIyHUfx9EE');
	//Google Auth check.
	(Alloy.Globals.googleAuthSheet.getAccessToken()) || Alloy.Globals.googleAuthSheet.authorize();
	var url = "https://spreadsheets.google.com/feeds/list/"+sid+"/od6/private/full";
	var thefile = "gss"+sid+".xml";
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
			var xml = Titanium.XML.parseString(this.responseText);
			Alloy.Globals.Log("alloy.js::Alloy.Globals.getPrivateData:: response txt is: "+this.responseText);
			Alloy.Globals.Log("alloy.js::Alloy.Globals.getPrivateData:: this xml is: " +xml);
			var feed = xml.documentElement.getElementsByTagName("feed");
			var entry = xml.documentElement.getElementsByTagName("entry"); 
			Alloy.Globals.Log("alloy.js::this entry length is: " +entry.length);
			// deleting existing entry in database start
			//var OfflineMode = Titanium.App.Properties.setInt('mindebug');
			//if ( OfflineMode == 0 ){
				(type == 'client') && Alloy.Collections.client.deleteAll();
				(type == 'project') && Alloy.Collections.project.deleteAll();
				(type == 'inventory') && Alloy.Collections.inventory.deleteAll();
				(type == 'invoice') && Alloy.Collections.invoice.deleteAll();
				(type == 'supplier') && Alloy.Collections.supplier.deleteAll();
				(type == 'proposal') && Alloy.Collections.proposal.deleteAll();
				(type == 'labor') && Alloy.Collections.labor.deleteAll();
				(type == 'joblog') && Alloy.Collections.joblog.deleteAll();
				(type == 'master') && Alloy.Collections.master.deleteAll();
				(type == 'joblogsid') && Alloy.Collections.joblogsid.deleteAll();
				(type == 'payment') && Alloy.Collections.payment.deleteAll();
				(type == 'paymentsid') && Alloy.Collections.paymentsid.deleteAll();
				(type == 'invoicesent') && Alloy.Collections.invoicesent.deleteAll();
				(type == 'proposalsent') && Alloy.Collections.proposalsent.deleteAll();
			//};		
			// deleting existing entry done
			for (i=1;i<entry.length;i++){
				var col1 = entry.item(i).getElementsByTagName("gsx:col1").item(0).text;
				var col2 = entry.item(i).getElementsByTagName("gsx:col2").item(0).text;
				var col4 = entry.item(i).getElementsByTagName("gsx:col4").item(0).text;
				var idtag = entry.item(i).getElementsByTagName("id").item(0).text.replace(':','yCoLoNy');
				var link = entry.item(i).getElementsByTagName("link");
				for (y=0;y<link.length;y++){			
	    			var listitem = link.item(y);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href").replace(':','yCoLoNy');}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href").replace(':','yCoLoNy');}
    			}
				//data.push({"identification":col1,"next column":col2,"col4":col4});
				data.push({"col1":col1,"col2":col2,"col4":col4});				
				//Alloy.Globals.Log("alloy.js::updating database with data :"+col1+" url:"+idtag+" "+edithref);
				var dataModel = Alloy.createModel(type,{
					col1 :  entry.item(i).getElementsByTagName("gsx:col1").item(0).text.trim() || "none",
					col2 : entry.item(i).getElementsByTagName("gsx:col2").item(0).text.trim() || "none",
					col3 :  entry.item(i).getElementsByTagName("gsx:col3").item(0).text.trim() || "none",
					col4 :  entry.item(i).getElementsByTagName("gsx:col4").item(0).text.trim() || "none",
					col5 :  entry.item(i).getElementsByTagName("gsx:col5").item(0).text.trim() || "none",
					col6 :  entry.item(i).getElementsByTagName("gsx:col6").item(0).text.trim() || "none",
					col7 :  entry.item(i).getElementsByTagName("gsx:col7").item(0).text.trim() || "none",
					col8 :  entry.item(i).getElementsByTagName("gsx:col8").item(0).text.trim() || "none",
					col9 :  entry.item(i).getElementsByTagName("gsx:col9").item(0).text.trim() || "none",
					col10 :  entry.item(i).getElementsByTagName("gsx:col10").item(0).text.trim() || "none",
					col11 :  entry.item(i).getElementsByTagName("gsx:col11").item(0).text.trim() || "none",
					col12 :  entry.item(i).getElementsByTagName("gsx:col12").item(0).text.trim() || "none",
					col13 :  entry.item(i).getElementsByTagName("gsx:col13").item(0).text.trim() || "none",
					//col14 :  entry.item(i).getElementsByTagName("gsx:col14").item(0).text || "none",
					col14 :  idtag+"xCoLoNx"+selfhref+"xCoLoNx"+edithref+"xCoLoNx"+selfhref.trim() || "none",
					col15 :  entry.item(i).getElementsByTagName("gsx:col15").item(0).text.trim() || "none",
					col16 :  entry.item(i).getElementsByTagName("gsx:col16").item(0).text.trim() || "none",		
				});	
				dataModel.save();
			}
			Alloy.Globals.Log("alloy.js:Alloy.Globals.getPrivateData:updating database with data :"+JSON.stringify(data));
			var file = Ti.Filesystem.getFile(
				Ti.Filesystem.tempDirectory, thefile
			);
			if(file.exists() && file.writeable) {
			    var success = file.deleteFile();
			    Alloy.Globals.Log((success==true) ? 'success' : 'fail'); // outputs 'success'
			}
			file.write(this.responseText);
			Alloy.Globals.Log("alloy.js::checking data " +JSON.stringify(data));
			//
			Alloy.Globals.Log(" Alloy.Globals.getPrivateData::Data were successfuly downloaded from "+url+". Please proceed.");
			} catch(e){
				Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.onerror = function(e){
		//alert(e);
		Alloy.Globals.Log("alloy.js::Alloy.Globals.getPrivateData::Unable to pull data from cloud. The "+type+" info displayed here is NOT the latest. error is: "+JSON.stringify(e));
		alert("code:" +e.code+ " Unable to pull data from cloud");
		Alloy.Globals.googleAuthSheet.authorize();
	};
	xhr.open("GET", url);
	xhr.send();
	
};

Alloy.Globals.xmlToJson = function(xml) {	
	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
	return obj;
};


var scope = ['https://spreadsheets.google.com/feeds', 'https://docs.google.com/feeds','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly','https://www.googleapis.com/auth/drive'];
scope.push ("https://www.googleapis.com/auth/drive.appdata");
scope.push ("https://www.googleapis.com/auth/drive.apps.readonly");
scope.push ("https://www.googleapis.com/auth/drive.file");
scope.push ("https://www.googleapis.com/auth/plus.login");
scope.push ("https://www.googleapis.com/auth/userinfo.profile");
scope.push ("https://www.googleapis.com/auth/userinfo.email");
Alloy.Globals.scope = scope;

var GoogleAuth = require('googleAuth');
var googleAuthSheet = new GoogleAuth({
	clientId : Alloy.Globals.clientId,
	///clientSecret : 'fjrsVudiK3ClrOKWxO5QvXYL',
	propertyName : 'googleToken',
	//scope : ['https://spreadsheets.google.com/feeds', 'https://docs.google.com/feeds','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly','https://www.googleapis.com/auth/drive'],
	scope : scope,
	quiet: false
});

Alloy.Globals.googleAuthSheet = new GoogleAuth({
	clientId : Alloy.Globals.clientId,
	///clientSecret : 'fjrsVudiK3ClrOKWxO5QvXYL',
	propertyName : 'googleToken',
	//scope : ['https://spreadsheets.google.com/feeds', 'https://docs.google.com/feeds','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly'],
	scope : scope,
	quiet: false
});

Alloy.Globals.googleAuthCalendar = new GoogleAuth({
	clientId : Alloy.Globals.clientId,
	///clientSecret : 'fjrsVudiK3ClrOKWxO5QvXYL',
	propertyName : 'googleToken',
	//scope : ['https://spreadsheets.google.com/feeds', 'https://docs.google.com/feeds','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly'],
	scope : scope,
	quiet: false
});

Alloy.Globals.LaunchWindowGoogleAuth = function() {
	//authorize first
	//setTimeout("googleAuthSheet.authorize()", 100);
	//googleAuthSheet.authorize();	
			var win = Titanium.UI.createWindow({
				fullscreen: false,
				tabBarHidden : false,
				navBarHidden: false,
				height: "85%",
				modal: true
			});	
			var btnBack = Ti.UI.createButton({ 
				title: '< Back', 
				top: 5,
				left: 10
			});
	   		var win1 = Titanium.UI.iOS.createNavigationWindow({
				Title: "Authentication",
				backgroundColor: "transparent",
		   	  	window: win,
		   	  	height: "85%"
	    	});
	    	var view = Titanium.UI.createView({
				   borderRadius:10
			});	    	
	    	btnBack.addEventListener("click", function(_tab) { 
				console.debug("closing window" +_tab);
		//		Alloy.Globals.Log("tab:" + JSON.stringify(_tab));
				win1.close();
			});
			Alloy.Globals.Log('Authorized first: ');
			//view.add(googleAuthSheet.authorize());							
			view.add(googleAuthSheet.authorize());
			win1.add(btnBack);	
			//window.add(view);
			win1.open({modal:true});

};
	
Alloy.Globals.checkGoogleisAuthorized = function () {
	Titanium.App.Properties.setString('needAuth',"true");
	googleAuthSheet.isAuthorized(function() {
		Alloy.Globals.Log('Access Token: ' +Alloy.Globals.googleAuthSheet.getAccessToken());
		Titanium.App.Properties.setString('needAuth',"false");
	}, function() {
		Alloy.Globals.Log('Fr AlloyGlobal Authorized first, see next window: '+(new  Date()));
		Titanium.App.Properties.setString('needAuth',"true");
		//Alloy.Globals.LaunchWindowGoogleAuth();
	});
};	
	
Alloy.Globals.updateSpreadsheet = function (sid){
	 	var now = new Date();
 	var clientlastname = Titanium.App.Properties.getString('clientlastname',"none");
 	var clientfirstname = Titanium.App.Properties.getString('clientfirstname',"none");
 	var clientphone = Titanium.App.Properties.getString('clientphone',"none");
 	var clientemail = Titanium.App.Properties.getString('clientemail',"none");
 	var clientstreetaddress = Titanium.App.Properties.getString('clientstreetaddress',"none");
 	var clientcity = Titanium.App.Properties.getString('clientcity',"none");
 	var clientstate = Titanium.App.Properties.getString('clientstate',"none");
 	var clientproject = Titanium.App.Properties.getString('clientproject',"none");
 	var clientcompany = Titanium.App.Properties.getString('clientcompany',"none");
 	alert("On "+now+" : Info on: "+clientfirstname+" "+clientlastname+" with "+clientphone+" and email "+clientemail+" at "+clientstreetaddress+", "+clientcity+", "+clientstate+". submitted");
 	var fcsv = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory,'enterclient.csv');
 	var ftxt = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory,'enterclient.txt');
	fcsv.write(now+", "+clientfirstname+", "+clientlastname+", "+clientphone+", "+clientemail+", "+clientstreetaddress+", "+clientcity+", "+clientstate+'\n', true); // write to the file
	ftxt.write(now+", "+clientfirstname+", "+clientlastname+", "+clientphone+", "+clientemail+", "+clientstreetaddress+", "+clientcity+", "+clientstate+'\n', true); // write to the file
	var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
	+'<gsx:col1>'+clientfirstname+'</gsx:col1><gsx:col2>'+clientfirstname+'</gsx:col2><gsx:col3>'
	+clientlastname+'</gsx:col3><gsx:col4>'+clientcompany+'</gsx:col4><gsx:col5>'
	+clientphone+'</gsx:col5><gsx:col6>'+clientemail+'</gsx:col6><gsx:col7>'+clientstreetaddress+'</gsx:col7><gsx:col8>'+clientcity+'</gsx:col8><gsx:col9>'+clientstate
	+'</gsx:col9><gsx:col10>'+'USA'+'</gsx:col10><gsx:col11>'+'NA'+'</gsx:col11><gsx:col12>NA</gsx:col12><gsx:col13>NA</gsx:col13><gsx:col14>NA</gsx:col14><gsx:col15>NA</gsx:col15><gsx:col16>NA</gsx:col16></entry>';
	Alloy.Globals.Log('xmldatastring to POST: '+xmldatastring);
	var xhr =  Titanium.Network.createHTTPClient({
    onload: function() {
    	try {
    		Alloy.Globals.Log(this.responseText); 
    	} catch(e){
    		Alloy.Globals.Log("Alloy.Globals.updateSpreadsheet::cathing e: "+JSON.stringify(e));
    	}     
    },
    onerror: function(e) {
    	Alloy.Globals.Log("Alloy.Globals.updateSpreadsheet::error e: "+JSON.stringify(e));
    }
});
	xhr.open("POST", 'https://spreadsheets.google.com/feeds/list/'+sid+'/od6/private/full');
	xhr.setRequestHeader("Content-type", "application/atom+xml");
	xhr.setRequestHeader("Authorization", 'Bearer '+ googleAuth.getAccessToken());
	xhr.send(xmldatastring);
	Alloy.Globals.Log('done POSTed');


};

Alloy.Globals.checkNetworkAndGoogleAuthorized = function(sid){
	var url = "https://spreadsheets.google.com/feeds/list/"+sid+"/od6/public/basic?hl=en_US&alt=json";
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Alloy.Globals.Log("network is good. Replies are: "+this.responseText);
	    		Alloy.Globals.checkGoogleisAuthorized();
	    	} catch(e){
				Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.onerror = function(e){
		alert("Please connect to the network.");
		Alloy.Globals.Log(new Date()+"::Alloy.Globals.checkNetworkAndGoogleAuthorized::No network connection. Checking SID "+sid);
	};
	xhr.open("GET", url);
	xhr.send();
};

Alloy.Globals.postCreateEvent = function(calid,startdateTime,enddateTime,location,summary,description,organizerdisplayName,fileUrl,organizeremail,colorid,attendeeslist) {
	var startdateTime = startdateTime;
	var enddateTime = enddateTime;
	var location = location || " ";
	var summary = summary || " ";
	var description = description || " ";
	var organizerdisplayName = organizerdisplayName|| " ";
	var fileUrl = fileUrl || " ";
	var organizeremail = organizeremail || " ";
	var colorid = colorid || "3";
	var organizerself ="true";
	//var url = 'https://www.googleapis.com/calendar/v3/calendars/idevice.net%40gmail.com/events?access_token='+googleAuthCalendar.getAccessToken();
	Alloy.Globals.Log("alloy.js::Alloy.Globals.postCreateEvent: emailid:  "+calid);
	//var url = 'https://www.googleapis.com/calendar/v3/calendars/'+calid+'/events';
	var url = 'https://www.googleapis.com/calendar/v3/calendars/'+calid+'/events?sendNotifications=true';
	var recurrences ="";
	var attendeesstrbody = [];
	var attendeesstrstart = '\"attendees\": \[';
	var attendeesstrend = "\],";
	//var attendeeslist = "";
	var attendeeslist = attendeeslist || ["phakhruddin1@gmail.com","deen@idevice.net",Titanium.App.Properties.getString('kraniemailid')];
	if (attendeeslist.length>0){
		for (i=0;i<attendeeslist.length;i++) {	
			var attendeesstr = '\{ \"email\": \"'+attendeeslist[i]
			+'\", \"responseStatus\" : \"needsAction\"\}';	
			attendeesstrbody.push(attendeesstr);
		}
		var eventattendees = attendeesstrstart+""+attendeesstrbody+""+attendeesstrend;
	} else {
		var eventattendees = "";
	}
	var event = '\{'
	+'\"start\": \{ \"dateTime\": \"'+startdateTime+'\"\},'
	+'\"location\": \"'+location+'\",'
	+'\"end\": \{\"dateTime\": \"'+enddateTime+'\"\},'
	+'\"summary\": \"'+summary+'\",'
	+'\"description\": \"'+description+'\",'
	+'\"colorid\": \"'+colorid+'\",'
	+'\"attachments\": \[\{ '
	+			'\"fileUrl\": \"'+fileUrl+'\"'
	+ 		'\}\],'
	+eventattendees
	+'\"organizer\": \{'
	+	'\"email\": \"'+organizeremail+'\",'
	+	'\"displayName\": \"'+organizerdisplayName+'\",'
	+	'\"self\": \"'+organizerself+'\"'
	+	'\},'
	//+'\"reminders\": \{\"useDefault\": true\}'
	+'\"reminders\": \{'
	+		'\"useDefault\": false,'
	+		'\"overrides\": \[\{ '
	+			'\"method\": \"email\",'
	+			'\"minutes\": 1440'
	+		'\},\{'
	+			'\"method\": \"popup\",'
	+			'\"minutes\": 30'
	+ 		'\}\]'
	+	'\}'
	+recurrences
	+'\}';
	Alloy.Globals.Log("alloy.js::event strings are: "+event);
	var xhr =  Titanium.Network.createHTTPClient({
    onload: function() {
    	try {
    		Alloy.Globals.Log(this.responseText); 
    	} catch(e){
    		Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
    	}     
    },
    onerror: function(e) {
    	Alloy.Globals.Log("Alloy.Globals.postCreateEvent::error e: "+JSON.stringify(e));
        alert("Please connect to the network."); 
    }
});
	xhr.open("POST", url);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send(event);
	Alloy.Globals.Log('done POSTed');
};

Alloy.Globals.uploadFile = function(file,filename,parentid) {
		var fileget = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,file);
    	//var fileget = Ti.Filesystem.getFile(file);
		var fileread = fileget.read();
		var filebase64 = Ti.Utils.base64encode(fileread);
 		Alloy.Globals.Log('Access Token for File upload is: ' +Alloy.Globals.googleAuthSheet.getAccessToken());
 		var parts = [];
 		var bound = 287032396531387;
	 		var meta = '\{'
	 		+	'\"title\": \"'+filename+'\",'
	 		+'\"parents\": ['
		  	+'{'
		   	+'\"id\": \"'+parentid+'\"'
		 	+' }'
		 	+']'
			+	'\}';
		var parts = [];
        parts.push('--' + bound);
        parts.push('Content-Type: application/json');
        parts.push('');
        parts.push(meta);
        parts.push('--' + bound);
		parts.push('Content-Type: application/pdf');
        parts.push('Content-Transfer-Encoding: base64');
        parts.push('');
        parts.push(filebase64);
        parts.push('--' + bound + '--');
 		var url = "https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart";
 		var xhr =  Titanium.Network.createHTTPClient({
		    onload: function() {
		    	try {
		    		Alloy.Globals.Log(this.responseText); 
		    		var json = JSON.parse(this.responseText);
		    		var id = json.id;
		    		var webcontentlink = json.webContentLink;
		    		Titanium.App.Properties.setString('webcontentlink',webcontentlink);
	    			Alloy.Globals.Log("alloy.js::Alloy.Globals.uploadFile::id is: "+id+" webcontentlink: "+webcontentlink);
		    		Alloy.Globals.shareAnyonePermission(id);
		    	} catch(e){
		    		Alloy.Globals.Log("Alloy.Globals.uploadFile::cathing e: "+JSON.stringify(e));
		    	}     
		    },
		    onerror: function(e) {
		    	Alloy.Globals.Log("Alloy.Globals.uploadFile::error e: "+JSON.stringify(e));
		        alert("Please connect to the network."); 
		    }
		});
		xhr.open("POST", url);
		xhr.setRequestHeader("Content-type", "multipart/mixed; boundary=" + bound);
		xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
		xhr.setRequestHeader("Content-Length", "2000000");
		xhr.send(parts.join("\r\n"));
		Alloy.Globals.Log('done POSTed');
};



Alloy.Globals.formatAMPM = 	function(date) {
	  var hours = date.getHours();
	  var minutes = date.getMinutes();
	  var ampm = hours >= 12 ? 'pm' : 'am';
	  hours = hours % 12;
	  hours = hours ? hours : 12; // the hour '0' should be '12'
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  var strTime = hours + ':' + minutes + ampm;
	  return strTime;
};

Alloy.Globals.checkFileExistThenCreateSS = function(filename){
		var jsonlist = " ";
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var jsonlist = JSON.parse(this.responseText);
	    		Alloy.Globals.Log("Alloy.Globals.checkFileExistThenCreateSS::response of jsonlist is: "+JSON.stringify(jsonlist));
	    	} catch(e){
				Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
			}
			Alloy.Globals.Log("alloy.js::Alloy.Globals.checkFileExistThenCreateSS::jsonlist.items.length: "+jsonlist.items.length);
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("alloy.js::File DOES NOT EXIST");
				var fileexist = "false";
				Alloy.Globals.createSpreadsheet(filename);  // create file when does not exists
				Titanium.App.Properties.setString(filename,sid); // stamp the ssid.
			} else {
				var fileexist = "true";
				var sid = jsonlist.items[0].id;
				var item=filename.replace(/list$/g,"").replace(/^.*_/g,"");
				Alloy.Globals.Log("alloy.js::Alloy.Globals.checkFileExistThenCreateSS::File exist. sid is: "+jsonlist.items[0].id+" Skipped.");
				Titanium.App.Properties.setString(item,sid);
				Alloy.Globals.Log("alloy.js::Alloy.Globals.checkFileExistThenCreateSS::File exist: sid from Titanium.App.Properties.getString("+item+"); "+eval("Titanium.App.Properties.getString(item)"));
			};
		}
		});
	xhr.onerror = function(e){
		alert("Please connect to the network.");
	};
	var rawquerystring = '?q=title+%3D+\''+filename+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.spreadsheet\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Ctitle)';
	Alloy.Globals.Log("alloy.js::Alloy.Globals.checkFileExistThenCreateSS:: URL:: https://www.googleapis.com/drive/v2/files"+rawquerystring);
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};

Alloy.Globals.checkFileExistThenUpdateSID = function(filename){
		var jsonlist = " ";
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var jsonlist = JSON.parse(this.responseText);
	    		Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateSID::response of jsonlist is: "+JSON.stringify(jsonlist));
	    		Titanium.App.Properties.setString("status","passed"); 	 		
	    	} catch(e){
				Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateSID::cathing e: "+JSON.stringify(e));
				Titanium.App.Properties.setString("status","failed"); 	; 	
			}
			Alloy.Globals.Log("alloy.js::Alloy.Globals.checkFileExistThenUpdateSID::jsonlist.items.length: "+jsonlist.items.length);
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("alloy.js::Alloy.Globals.checkFileExistThenUpdateSID::File DOES NOT EXIST");
				var fileexist = "false";
				Titanium.App.Properties.setString("status","failed"); 	
			} else {
				var fileexist = "true";
				var sid = jsonlist.items[0].id;
				Alloy.Globals.Log("alloy.js::Alloy.Globals.checkFileExistThenUpdateSID::File exist. sid is: "+jsonlist.items[0].id+" Skipped.");
				Titanium.App.Properties.setString(filename,sid);
				// Write contents.
				var content = filename+','+sid;
				Alloy.Globals.appendFile(content,"joblogsid.txt");
				Titanium.App.Properties.setString("status","passed"); 	
			};
		}
		});
	xhr.onerror = function(e){
		alert("Please connect to the network.");
		Alloy.Globals.Log("alloy.js::checkFileExistThenUpdateSID:File "+filename+" Does Not exist.");
		Alloy.Globals.Status ="failed";
		Titanium.App.Properties.setString("status","failed");	
	};
	var rawquerystring = '?q=title+%3D+\''+filename+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.spreadsheet\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Ctitle)';
	Alloy.Globals.Log("alloy.js::Alloy.Globals.checkFileExistThenUpdateSID:: URL:: https://www.googleapis.com/drive/v2/files"+rawquerystring);
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
	Alloy.Globals.Log("alloy.js::::JSON.stringify(Alloy.Globals.Status) :"+JSON.stringify(Alloy.Globals.Status)+" Titanium.App.Properties.getString(\"status\"): " +Titanium.App.Properties.getString("status"));
	
};


Alloy.Globals.createSpreadsheet = function(filename) {
	var t = parseFloat(Titanium.App.Properties.getInt("krani_t",1));
	var i ;
	Alloy.Globals.Log("alloy.js:Alloy.Globals.createSpreadsheet:create ss with filename: "+filename+ " krani_t: "+t);
	var jsonpost = '{'
		 +'\"title\": \"'+filename+'\",'
		 +'\"mimeType\": \"application/vnd.google-apps.spreadsheet\"'
		+'}';
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Alloy.Globals.Log("Alloy.Globals.createSpreadsheet::response is: "+this.responseText);
	    		var json = JSON.parse(this.responseText);
	    		var sid = json.id;
	    		//populate header
	    		for (i=1;i<17;i++){
	    			var t = parseFloat(Titanium.App.Properties.getInt("krani_t",15000));
					var value = "col"+i;					
					Alloy.Globals.Log("Alloy.Globals.createSpreadsheet2: Alloy.Globals.getSSCell("+sid+",1,"+i+","+value+","+t+")");
					Alloy.Globals.getSSCell(sid,1,i,value,t); //to avoid google quota req/sec exhaustion.
					var t = parseFloat(t) + 500;Titanium.App.Properties.setInt("krani_t",t);
					Alloy.Globals.Log("Alloy.Globals.createSpreadsheet2: Populate Header: wait at "+t+" ms, getSSCell("+sid+",1,"+i+","+value+")");		
				}
				var t = parseFloat(Titanium.App.Properties.getInt("krani_t",10500));
				setTimeout(function(){Alloy.Globals.editTheCell(sid,2,1,"Project Name");},500 + parseFloat(t));
				setTimeout(function(){Alloy.Globals.editTheCell(sid,2,2,"sid");},1000 + parseFloat(t));
				setTimeout(function(){Alloy.Globals.editTheCell(sid,2,4,"Date Created");},1500 + parseFloat(t));
				setTimeout(function(){Alloy.Globals.editTheCell(sid,2,5,"Date Modified");},2000 + parseFloat(t));
				setTimeout(function(){
					Titanium.App.Properties.setString('sid',sid); // 1st sid created.
					Alloy.Globals.Log("alloy.js::sid : "+sid);
					},2500 + parseFloat(t));
				Titanium.App.Properties.setInt("krani_t",3000 + parseFloat(t));
	    	} catch(e){
				Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		alert("Please connect to the network.");
		Alloy.Globals.Log("alloy.js::createSpreadsheet:: error is: "+JSON.stringify(e));
	};
	xhr.open("POST", 'https://www.googleapis.com/drive/v2/files');	
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
    Alloy.Globals.Log("alloy.js::json post: "+jsonpost);
	xhr.send(jsonpost);
};

Alloy.Globals.editTheCell = function(sid,rowno,colno,value) {
	var pos = "R"+rowno+"C"+colno;
	Alloy.Globals.Log("alloy.js::Alloy.Globals.editTheCell on :  https://spreadsheets.google.com/feeds/cells/"+sid+"/od6/private/full/"+pos);
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var xml = Titanium.XML.parseString(this.responseText);
	    		Alloy.Globals.Log("Alloy.Globals.editTheCell:: response is: "+this.responseText);
	    		Alloy.Globals.Log("Alloy.Globals.editTheCell:: xml response is: "+xml);
	    		var entry = xml.documentElement.getElementsByTagName("entry");
	    		var link = xml.documentElement.getElementsByTagName("link");
	    		Alloy.Globals.Log("alloy.js:: number of link found: " +link+ " length: "+link.length);
	    		for (i=0;i<link.length;i++){			
	    			var listitem = link.item(i);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href");}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href");}
	    		}
	    		Alloy.Globals.Log("Alloy.Globals.editTheCell:: self href is : "+selfhref);
				Alloy.Globals.Log("Alloy.Globals.editTheCell:: edit href is : "+edithref);
	    		Alloy.Globals.editCell(sid,rowno,colno,edithref,selfhref,value);	    				    			
	    	} catch(e){
				Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		alert("Please connect to the network.");
		Alloy.Globals.Log("alloy.js::editTheCell:: error is: "+JSON.stringify(e));
	};
	xhr.open("GET", 'https://spreadsheets.google.com/feeds/cells/'+sid+'/od6/private/full/'+pos);
	xhr.setRequestHeader("Content-type", "application/atom+xml");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};

Alloy.Globals.editCell = function(sid,rowno,colno,edithref,selfhref,value){ 
		var xmldatastring = ['<entry xmlns=\'http://www.w3.org/2005/Atom\' '
 		+' xmlns:gs=\'http://schemas.google.com/spreadsheets/2006\'>'
 		+'<id>'+selfhref+'</id>'
 		+'<link rel=\'edit\' type=\'application/atom+xml\''
 		+' href=\''+edithref+'\'/>'
 		+'<gs:cell row=\''+rowno+'\' col=\''+colno+'\' inputValue=\''+value+'\'>'
 		+'</gs:cell>'
 		+'</entry>'].join('');
 		Alloy.Globals.Log("alloy.js::xmldatastring: "+xmldatastring);
       var xhr =  Titanium.Network.createHTTPClient({
    onload: function() {
        try {
                Alloy.Globals.Log(this.responseText); 
        } catch(e){
                Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
        }     
    },
    onerror: function(e) {
        alert("error:"+e.code+"::Please connect to the network.");
        Alloy.Globals.Log("alloy.js::editCell::error is: "+JSON.stringify(e)); 
    }
});
        xhr.open("PUT", ''+edithref+'');
        xhr.setRequestHeader("Content-type", "application/atom+xml");
        xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
        xhr.send(xmldatastring);
        Alloy.Globals.Log('Alloy.Globals.editCell::done POSTed');
};

Alloy.Globals.updateSpreadsheet = function(sid,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16){
	var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
	+'<gsx:col1>'+col1+'</gsx:col1><gsx:col2>'+col2+'</gsx:col2><gsx:col3>'
	+col3+'</gsx:col3><gsx:col4>'+col4+'</gsx:col4><gsx:col5>'
	+col5+'</gsx:col5><gsx:col6>'+col6+'</gsx:col6><gsx:col7>'+col7+'</gsx:col7><gsx:col8>'+col8+'</gsx:col8><gsx:col9>'+col9
	+'</gsx:col9><gsx:col10>'+col10+'</gsx:col10><gsx:col11>'+col11+'</gsx:col11><gsx:col12>'+col12+'</gsx:col12><gsx:col13>'+col13+'</gsx:col13><gsx:col14>'+col14+'</gsx:col14><gsx:col15>'+col15+'</gsx:col15><gsx:col16>'+col16+'</gsx:col16></entry>';
	Alloy.Globals.Log('xmldatastring to POST: '+xmldatastring);
	var xhr =  Titanium.Network.createHTTPClient({
    onload: function() {
    	try {
    		Alloy.Globals.Log(this.responseText); 
    	} catch(e){
    		Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
    	}     
    },
    onerror: function(e) {
    	Alloy.Globals.Log("Alloy.Globals.updateSpreadsheet::error e: "+JSON.stringify(e));
        alert("error:"+e.code+": Please connect to the network."); 
        Alloy.Globals.Log("alloy.js::updateSpreadsheet::Unable to communicate to the cloud. Please try again, sid: "+sid); 
    }
});
	xhr.open("POST", 'https://spreadsheets.google.com/feeds/list/'+sid+'/od6/private/full');
	xhr.setRequestHeader("Content-type", "application/atom+xml");
	xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send(xmldatastring);
	Alloy.Globals.Log('done POSTed');
};

Alloy.Globals.updateSpreadsheet2 = function(sid,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16){
	var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
	+'<gsx:col1>'+col1+'</gsx:col1><gsx:col2>'+col2+'</gsx:col2><gsx:col3>'
	+col3+'</gsx:col3><gsx:col4>'+col4+'</gsx:col4><gsx:col5>'
	+col5+'</gsx:col5><gsx:col6>'+col6+'</gsx:col6><gsx:col7>'+col7+'</gsx:col7><gsx:col8>'+col8+'</gsx:col8><gsx:col9>'+col9
	+'</gsx:col9><gsx:col10>'+col10+'</gsx:col10><gsx:col11>'+col11+'</gsx:col11><gsx:col12>'+col12+'</gsx:col12><gsx:col13>'+col13+'</gsx:col13><gsx:col14>'+col14+'</gsx:col14><gsx:col15>'+col15+'</gsx:col15><gsx:col16>'+col16+'</gsx:col16></entry>';
	Alloy.Globals.Log('xmldatastring to POST: '+xmldatastring);
	var xhr =  Titanium.Network.createHTTPClient({
    onload: function() {
    	try {
    		Alloy.Globals.Log(this.responseText); 
    	} catch(e){
    		Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
    	}     
    },
    onerror: function(e) {
    	Alloy.Globals.Log("Alloy.Globals.updateSpreadsheet2::error e: "+JSON.stringify(e));
        alert("error:"+e.code+": Please connect to the network."); 
        Alloy.Globals.Log("alloy.js::updateSpreadsheet::Unable to communicate to the cloud. Please try again, sid: "+sid); 
    }
});
	xhr.open("POST", 'https://spreadsheets.google.com/feeds/list/'+sid+'/od6/private/full');
	xhr.setRequestHeader("Content-type", "application/atom+xml");
	xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send(xmldatastring);
	Alloy.Globals.Log('done POSTed');
};

Alloy.Globals.saveHandler = function(type){
 	Alloy.Globals.Log("alloy.js::Alloy.Globals.saveHandler::saving all data JSON e: "+JSON.stringify(e));
 	var tabledata = [];	
 	var noentry = "none";
 	var getvalue = ["clientfirstname","clientlastname","clientphone","clientemail","clientstreetaddress","clientcity","clientstate","clientcompany","notes"];
 	for (i=0;i<$.enterclient_table.data[0].rowCount;i++) {		
 		Alloy.Globals.Log("children count : "	+$.enterclient_table.data[0].rows[i].children.length);
 		for (j=0;j<+$.enterclient_table.data[0].rows[i].children.length;j++) { 			
			Alloy.Globals.Log("JSON stringify table 0 row "+i+' : ' +JSON.stringify($.enterclient_table.data[0].rows[i]));
			Alloy.Globals.Log("JSON stringify table 0 row "+i+'w/children '+j+' : ' +JSON.stringify($.enterclient_table.data[0].rows[i].children[j]));
			tabledata.push({data1:$.enterclient_table.data[0].rows[i].children[j].id || "none",data2:$.enterclient_table.data[0].rows[i].children[j].value || "none"});
			for (z=0;z<getvalue.length;z++){
				var subject = getvalue[z];
				if ( $.enterclient_table.data[0].rows[i].children[j].id == subject+"_tf") {					
					 	eval("var "+subject+" = $.enterclient_table.data[0].rows[i].children[j].value || $.enterclient_table.data[0].rows[i].children[j].text || noentry;");		 
				};
			}		
		};
	};
	Alloy.Globals.Log("tabledata are: "+JSON.stringify(tabledata));
	Alloy.Globals.Log("alloy.js::Alloy.Globals.saveHandler:: detect array dyn variable: "+clientfirstname+","+clientlastname+","+clientphone+","+clientemail+","+clientstreetaddress
	+","+clientcity+","+clientstate+","+clientcompany);
	//once tabledata is populated, find submission value
	var name = clientfirstname+' '+clientlastname;
	var customerid = e.source.titleid;
	Alloy.Globals.Log("alloy.js::Alloy.Globals.saveHandler::clientfirstname: "+clientfirstname+" clientlastname "+clientlastname);	
	Alloy.Globals.submit(type,clientfirstname,clientlastname,clientcompany,clientphone,clientemail,clientstreetaddress,clientcity,clientstate,"USA","pending",notes,"0","6/1/2015","7/1/2015",customerid);
	///Alloy.Globals.Log('submit('+clientnumber+','+name+','+customerno+','+total+','+bal+','+paid+','+lastpaiddate+','+followupdate+','+clientphone+','+clientemail+','+duedate+','
	///+currency+','+status+')');
 }; 

/*
Alloy.Globals.submit = function(type,clientfirstname,clientlastname,clientcompany,clientphone,clientemail,clientstreetaddress,clientcity,clientstate,country,status,notes,percentcompletion,nextappt,datedue,customerid) {	
 	//var spreadsheet_id = '1-Wz7Apn4AvVpfqcNyMgfqyKA8OAoLNy5Bl0d_jQ9IZk';
    var spreadsheet_id = Titanium.App.Properties.getString(type);
    var existingedithref = Titanium.App.Properties.getString('edithref');
    var edithref = Titanium.App.Properties.getString('edithref');
   /// var existingedithref = edithref;
    var idtag = Titanium.App.Properties.getString('idtag');
    //var edithref = existingedithref;
    var selfhref = Titanium.App.Properties.getString('selfhref');
    var now = Date.now();
 	var captimestamp = now;
    Alloy.Globals.Log("alloy.js::Alloy.Globals.submit::existing edit href is: "+existingedithref+' idtag :'+idtag);
	var xhr =  Titanium.Network.createHTTPClient({
	    onload: function() {
	    	try {
	    		Alloy.Globals.Log(this.responseText);
	    		var xml = Titanium.XML.parseString(this.responseText);
	    		var entry = xml.documentElement.getElementsByTagName("entry");
	    		var link = xml.documentElement.getElementsByTagName("link");
	    		var idtag = xml.documentElement.getElementsByTagName("id").item(0).text;
	    		Alloy.Globals.Log("alloy.js::submit: number of link found: " +link+ " length: "+link.length);
	    		for (i=0;i<link.length;i++){			
	    			var listitem = link.item(i);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href");}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href");}
	    		}
	    		Titanium.App.Properties.setString('edithref',edithref);
	    		Titanium.App.Properties.setString('idtag',idtag);
	    		Titanium.App.Properties.setString('selfhref',selfhref);
	    		Alloy.Globals.Log("alloy.js::Alloy.Globals.submit : self href is : "+selfhref+" edit href is: "+edithref);
	    		Alloy.Globals.Log("alloy.js::Alloy.Globals.submit : idtag is : "+idtag);
	    	} catch(e){
	    		Alloy.Globals.Log("Alloy.Globals.submit ::cathing e: "+JSON.stringify(e));
	    	}     
	    },
	    onerror: function(e) {
	    	Alloy.Globals.Log("Alloy.Globals.submit ::error e: "+JSON.stringify(e));
	        alert("error:"+e.code+": Please connect to the network."); 
	    }
	});
	eval("var "+type+" = Alloy.Collections.instance('"+type+"')");
	//var clients = Alloy.Collections.instance('client');
	if (existingedithref) {
			Alloy.Globals.Log("alloy.js::Alloy.Globals.submit::PUT on existing edit href is: "+existingedithref);
			xhr.open("PUT", existingedithref);
			var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
				+'<id>'+idtag+'</id>'
				+'<updated>2015-05-16T08:01:19.680Z</updated>'
				+'<category scheme=\'http://schemas.google.com/spreadsheets/2006\' term=\'http://schemas.google.com/spreadsheets/2006#list\'/>'
				+'<title type=\'text\'>'+customerid+'</title>'
				+'<content type=\'text\'>col2: '+clientfirstname+', col3: '+clientlastname+', col4: '+clientcompany+', col5: '+clientphone+', col6: '+clientemail+', col7: '+clientstreetaddress
				+', col8: '+clientcity+', col9: '+clientstate+', col10: '+country+', col11: NA, col12: NA, col13: NA, col14: '+captimestamp+', col15: none, col16: '+now+'</content>'
				+'<link rel=\'self\' type=\'application/atom+xml\' href=\''+selfhref+'\'/>'
				+'<link rel=\'edit\' type=\'application/atom+xml\' href=\''+edithref+'\'/>'
				+'<gsx:col1>'+customerid+'</gsx:col1><gsx:col2>'+clientfirstname+'</gsx:col2><gsx:col3>'
				+clientlastname+'</gsx:col3><gsx:col4>'+clientcompany+'</gsx:col4><gsx:col5>'
				+clientphone+'</gsx:col5><gsx:col6>'+clientemail+'</gsx:col6><gsx:col7>'+clientstreetaddress+'</gsx:col7><gsx:col8>'+clientcity+'</gsx:col8>'
				+'<gsx:col9>'+clientstate+'</gsx:col9><gsx:col10>'+country+'</gsx:col10><gsx:col11>NA</gsx:col11><gsx:col12>NA</gsx:col12><gsx:col13>NA</gsx:col13><gsx:col14>'+customerid+'</gsx:col14>'
				+'<gsx:col15>'+notes+'</gsx:col15><gsx:col16>'+customerid+'</gsx:col16></entry>';
			Alloy.Globals.Log('xmldatastring existing to PUT: '+xmldatastring);
			eval("type.fetch()");
			//clients.fetch();
			Alloy.Globals.Log("alloy.js::Alloy.Globals.submit:: update DB with customerid :" +customerid);
				clients.get(customerid).set({
					col1: 	customerid.toString().trim(),
					col2:	clientfirstname.trim(),
					col3:	clientlastname.trim(),
					col4:	clientcompany.trim(),
					col5:	clientphone.trim(),
					col6:	clientemail.trim(),
					col7:	clientstreetaddress.trim(),
					col8:	clientcity.trim(),
					col9:	clientstate.trim(),
					col10:	country.trim()
				}).save();
			alert('Modified & Saved Successfully!');
		} else {
			var customerid = now;
			$.save_button.titleid = customerid; //feed id the save button of the customer id.
			var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
				+'<gsx:col1>'+customerid+'</gsx:col1><gsx:col2>'+clientfirstname+'</gsx:col2><gsx:col3>'
				+clientlastname+'</gsx:col3><gsx:col4>'+clientcompany+'</gsx:col4><gsx:col5>'
				+clientphone+'</gsx:col5><gsx:col6>'+clientemail+'</gsx:col6><gsx:col7>'+clientstreetaddress+'</gsx:col7><gsx:col8>'+clientcity+'</gsx:col8>'
				+'<gsx:col9>'+clientstate+'</gsx:col9><gsx:col10>'+country+'</gsx:col10><gsx:col11>NA</gsx:col11><gsx:col12>NA</gsx:col12><gsx:col13>NA</gsx:col13><gsx:col14>'+customerid+'</gsx:col14>'
				+'<gsx:col15>'+notes+'</gsx:col15><gsx:col16>'+customerid+'</gsx:col16></entry>';
				Alloy.Globals.Log('xmldatastring to POST: '+xmldatastring);
			xhr.open("POST", 'https://spreadsheets.google.com/feeds/list/'+spreadsheet_id+'/od6/private/full');
			Alloy.Globals.Log("alloy.js::Alloy.Globals.submit:: add DB with customerid :" +customerid);
			var dataModel = Alloy.createModel('client',{
					col1: 	customerid.toString().trim(),
					col2:	(clientfirstname == " ")?'none':clientfirstname.trim(),
					col3:	(clientlastname == " ")?'none':clientlastname.trim(),
					col4:	(clientcompany == " ")?'none':clientcompany.trim(),
					col5:	(clientphone == " ")?'none':clientphone.trim(),
					col6:	(clientemail == " ")?'none':clientemail.trim(),
					col7:	(clientstreetaddress == " ")?'none':clientstreetaddress.trim(),
					col8:	(clientcity == " ")?'none':clientcity.trim(),
					col9:	(clientstate == " ")?'none':clientstate.trim(),
					col10:	(country == " ")?'none':country.trim(),
					col11: "none",
					col12: "none",
					col13: "none",
					col14: "none",
					col15: "none",
					col16: "none"
				});			
				dataModel.save();
			alert('Saved Successfully!');
		} 
	xhr.setRequestHeader("Content-type", "application/atom+xml");
	xhr.setRequestHeader("Authorization", 'Bearer '+ googleAuth.getAccessToken());
	xhr.send(xmldatastring);
 }; */
 
 Alloy.Globals.submit = function(type,spreadsheet_id,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16) {	
 	Alloy.Globals.Log("alloy.js::Alloy.Globals.submit::executed with: type:"+type+',col1:'+col1+',col2'+col2+',col3:'+col3);
 	if (! spreadsheet_id) {
 		var spreadsheet_id = Titanium.App.Properties.getString(type);
 	};
    var existingedithref = Titanium.App.Properties.getString('edithref');
    var edithref = Titanium.App.Properties.getString('edithref');
   /// var existingedithref = edithref;
    var idtag = Titanium.App.Properties.getString('idtag');
    //var edithref = existingedithref;
    var selfhref = Titanium.App.Properties.getString('selfhref');
    var now = Date.now();
 	var captimestamp = now;
    Alloy.Globals.Log("alloy.js::Alloy.Globals.submit::existing edit href is: "+existingedithref+' idtag :'+idtag);
	var xhr =  Titanium.Network.createHTTPClient({
	    onload: function() {
	    	try {
	    		Alloy.Globals.Log(this.responseText);
	    		var xml = Titanium.XML.parseString(this.responseText);
	    		var entry = xml.documentElement.getElementsByTagName("entry");
	    		var link = xml.documentElement.getElementsByTagName("link");
	    		var idtag = xml.documentElement.getElementsByTagName("id").item(0).text;
	    		Alloy.Globals.Log("alloy.js::submit: number of link found: " +link+ " length: "+link.length);
	    		for (i=0;i<link.length;i++){			
	    			var listitem = link.item(i);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href");}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href");}
	    		}
	    		Titanium.App.Properties.setString('edithref',edithref);
	    		Titanium.App.Properties.setString('idtag',idtag);
	    		Titanium.App.Properties.setString('selfhref',selfhref);
	    		Alloy.Globals.Log("alloy.js::Alloy.Globals.submit : self href is : "+selfhref+" edit href is: "+edithref);
	    		Alloy.Globals.Log("alloy.js::Alloy.Globals.submit : idtag is : "+idtag);
	    	} catch(e){
	    		Alloy.Globals.Log("Alloy.Globals.submit ::cathing e: "+JSON.stringify(e));
	    	}     
	    },
	    onerror: function(e) {
	    	Alloy.Globals.Log("Alloy.Globals.submit ::error e: "+JSON.stringify(e));
	        alert("error:"+e.code+": Please connect to the network."); 
	    }
	});
	eval("var "+type+" = Alloy.Collections.instance('"+type+"')");
	Alloy.Globals.Log("Alloy.Globals.submit ::JSON.stringify("+type+"): "+eval("JSON.stringify("+type+")"));
	if (existingedithref) {
			Alloy.Globals.Log("alloy.js::Alloy.Globals.submit::PUT on existing edit href is: "+existingedithref);
			xhr.open("PUT", existingedithref);
			var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
				+'<id>'+idtag+'</id>'
				+'<updated>2015-05-16T08:01:19.680Z</updated>'
				+'<category scheme=\'http://schemas.google.com/spreadsheets/2006\' term=\'http://schemas.google.com/spreadsheets/2006#list\'/>'
				+'<title type=\'text\'>'+col1+'</title>'
				+'<content type=\'text\'>col2: '+col2+', col3: '+col3+', col4: '+col4+', col5: '+col5+', col6: '+col6+', col7: '+col7
				+', col8: '+col8+', col9: '+col9+', col10: '+col10+', col11: NA, col12: NA, col13: NA, col14: '+col14+', col15: none, col16: '+col16+'</content>'
				+'<link rel=\'self\' type=\'application/atom+xml\' href=\''+selfhref+'\'/>'
				+'<link rel=\'edit\' type=\'application/atom+xml\' href=\''+edithref+'\'/>'
				+'<gsx:col1>'+col1+'</gsx:col1><gsx:col2>'+col2+'</gsx:col2><gsx:col3>'
				+col3+'</gsx:col3><gsx:col4>'+col4+'</gsx:col4><gsx:col5>'
				+col5+'</gsx:col5><gsx:col6>'+col6+'</gsx:col6><gsx:col7>'+col7+'</gsx:col7><gsx:col8>'+col8+'</gsx:col8>'
				+'<gsx:col9>'+col9+'</gsx:col9><gsx:col10>'+col10+'</gsx:col10><gsx:col11>NA</gsx:col11><gsx:col12>NA</gsx:col12><gsx:col13>NA</gsx:col13><gsx:col14>'+col15+'</gsx:col14>'
				+'<gsx:col15>'+col15+'</gsx:col15><gsx:col16>'+col16+'</gsx:col16></entry>';
			Alloy.Globals.Log('xmldatastring existing to PUT: '+xmldatastring);
			//eval("type.fetch()");
			Alloy.Globals.Log("alloy.js::Alloy.Globals.submit:: update DB with col16 :" +col16);
			//write to DB
			eval(type+".get(col16).set({col1:col1.trim(),col2:col2.trim(),col3:col3.trim(),col4:col4.trim(),col5:col5.trim(),col6:col6.trim(),col7:col7.trim(),col8:col8.trim(),col9:col9.trim(),col10:col10.trim(),col11:col11.trim(),col12:col12.trim(),col13:col13.trim(),col14:col14.trim(),col15:col15.trim(),col16:col16.trim()}).save()");
			alert('Modified & Saved Successfully!');
		} else {
			var col16 = now;
			var col2="<![CDATA["+col2+"]]>"; 
			var col3 = "<![CDATA["+col3+"]]>";
			var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
				+'<gsx:col1>'+col1+'</gsx:col1><gsx:col2>'+col2+'</gsx:col2><gsx:col3>'
				+col3+'</gsx:col3><gsx:col4>'+col4+'</gsx:col4><gsx:col5>'
				+col5+'</gsx:col5><gsx:col6>'+col6+'</gsx:col6><gsx:col7>'+col7+'</gsx:col7><gsx:col8>'+col8+'</gsx:col8>'
				+'<gsx:col9>'+col9+'</gsx:col9><gsx:col10>'+col10+'</gsx:col10><gsx:col11>NA</gsx:col11><gsx:col12>NA</gsx:col12><gsx:col13>NA</gsx:col13><gsx:col14>'+col14+'</gsx:col14>'
				+'<gsx:col15>'+col15+'</gsx:col15><gsx:col16>'+col16+'</gsx:col16></entry>';
			Alloy.Globals.Log('xmldatastring to POST: '+xmldatastring);
			xhr.open("POST", 'https://spreadsheets.google.com/feeds/list/'+spreadsheet_id+'/od6/private/full');
			Alloy.Globals.Log("alloy.js::Alloy.Globals.submit: post done on spreadsheet_id: "+spreadsheet_id);
			Alloy.Globals.Log("alloy.js::Alloy.Globals.submit:: add DB with col16 :" +col16+'col1:'+col1+',col2'+col2+',col3:'+col3);
        	///eval("var dataModel = Alloy.createModel('"+type+"',{col1:col1.trim(),col2:col2.trim(),col3:col3.trim(),col4:col4.trim(),col5:col5.trim(),col6:col6.trim(),col7:col7.trim(),col8:col8.trim(),col9:col9.trim(),col10:col10.trim(),col11:col11.trim(),col12:col12.trim(),col13:col13.trim(),col14:col14.trim(),col15:col15.trim(),col16:col16.trim()})");			
			///dataModel.save();
			alert('Saved Successfully!');
		} 
	xhr.setRequestHeader("Content-type", "application/atom+xml");
	xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send(xmldatastring);
 };
 
 Alloy.Globals.emailpdf = function(firstname,lastname,address,city,state,phone,email,invoicenumber,company,total,balance,paid,lastpaiddate,duedate,price){
	Alloy.Globals.Log("invoicedetail.js::emailpdf::  firstname " + firstname 	+" lastname " + lastname 	+" address " + address 	+" city " + city 	
	+" state " + state 	+" phone " + phone 	+" email " + email 	+" invoicenumber " + invoicenumber 	+" company " + company 	+" total " + total 	
	+" balance " + balance 	+" paid " + paid 	+" lastpaiddate " + lastpaiddate 	+" duedate " + duedate 	+" price " + price);
	
	var html2pdf = require('com.factisresearch.html2pdf');  
 	Alloy.Globals.Log("module is => " + html2pdf);  
 	var adhocs = Alloy.Collections.instance('adhoc');
   
 	html2pdf.addEventListener('pdfready', function(e) {  
	     var file = Ti.Filesystem.getFile(e.pdf);   
	    Alloy.Globals.Log("invoicedetail.js::html2pdf.addEventListener:: Ti.Filesystem.applicationDataDirectory "+Ti.Filesystem.applicationDataDirectory);
		var oldfile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'invoice.pdf');
		if (oldfile.exists()) { oldfile.deleteFile(); }
		var orgfile =  Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'Expose.pdf');
        var renamesuccess = orgfile.rename('invoice.pdf');
        Alloy.Globals.Log("invoicedetail.js::html2pdf.addEventListener:: renamesuccess "+renamesuccess);
	     var file = 'invoice.pdf';
	     Alloy.Globals.Log("opening viewpdf(url) on "+file);
     	 viewpdf(file);
     	 Alloy.Globals.checkGoogleisAuthorized();
     	 Alloy.Globals.uploadFile(file,"invdeen1.pdf") ;
 	});  
 	
 	//var html = '<html><body><p>dBayCo Inc. limited </p></body></html>'; 
 	
 	//var html="";
	//html += "<html><body><div id=\"top-bar\"><div id=\"doc-title\"><span class=\"name\">sample invoice : Sheet1<\/span><\/div><\/div><div id=\"sheets-viewport\"><div id=\"0\" style=\"display:none;position:relative;\" dir=\"ltr\"><div class=\"ritz grid-container\" dir=\"ltr\"><table class=\"waffle\" cellspacing=\"0\" cellpadding=\"0\"><thead><tr><th class=\"row-header freezebar-origin-ltr header-shim row-header-shim\"><\/th><th id=\"0C0\" style=\"width:195px\" class=\"header-shim\"><\/th><th id=\"0C1\" style=\"width:286px\" class=\"header-shim\"><\/th><th id=\"0C2\" style=\"width:100px\" class=\"header-shim\"><\/th><th id=\"0C3\" style=\"width:100px\" class=\"header-shim\"><\/th><th id=\"0C4\" style=\"width:100px\" class=\"header-shim\"><\/th><\/tr><\/thead><tbody><tr style='height:20px;'><th id=\"0R0\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">1<\/div><\/th><td><\/td><td><\/td><td><\/td><td><\/td><td><\/td><\/tr><tr style='height:20px;'><th id=\"0R1\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">2<\/div><\/th><td class=\"s0\" dir=\"ltr\" colspan=\"5\">DbayCo Inc. 130 Moreland Rd., Brookfield, WI 53222<\/td><\/tr><tr style='height:20px;'><th id=\"0R2\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">3<\/div><\/th><td class=\"s1\" dir=\"ltr\" colspan=\"5\">Phone: 262-501-2948, Fax: 262-290-3141. Email: deen@idevice.net<\/td><\/tr><tr style='height:20px;'><th id=\"0R3\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">4<\/div><\/th><td class=\"s2\" colspan=\"5\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R4\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">5<\/div><\/th><td class=\"s3\" dir=\"ltr\" colspan=\"3\">INVOICE<\/td><td class=\"s0\" dir=\"ltr\" colspan=\"2\">WAN-20150225-1<\/td><\/tr><tr style='height:20px;'><th id=\"0R5\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">6<\/div><\/th><td class=\"s2\" colspan=\"2\" rowspan=\"2\"><\/td><td class=\"s2\" colspan=\"3\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R6\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">7<\/div><\/th><td class=\"s4\"><\/td><td class=\"s5\" dir=\"ltr\"><\/td><td class=\"s5\" dir=\"ltr\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R7\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">8<\/div><\/th><td class=\"s2\" dir=\"ltr\">Wannoorbaya WChik<\/td><td class=\"s2\" rowspan=\"4\"><\/td><td class=\"s5\" dir=\"ltr\"><\/td><td class=\"s5\" dir=\"ltr\">230<\/td><td class=\"s5\" dir=\"ltr\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R8\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">9<\/div><\/th><td class=\"s2\" dir=\"ltr\">2258 S Sanctuary Dr<\/td><td class=\"s5\" dir=\"ltr\"><\/td><td class=\"s5\" dir=\"ltr\"><\/td><td class=\"s6\" dir=\"ltr\">due 4\/1\/2015<\/td><\/tr><tr style='height:20px;'><th id=\"0R9\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">10<\/div><\/th><td class=\"s2\" dir=\"ltr\">New Berlin, WI 53151<\/td><td class=\"s2\" colspan=\"3\" rowspan=\"2\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R10\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">11<\/div><\/th><td class=\"s2\" dir=\"ltr\">Date: 2\/28\/2014<\/td><\/tr><tr style='height:20px;'><th id=\"0R11\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">12<\/div><\/th><td class=\"s2\" colspan=\"5\" rowspan=\"2\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R12\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">13<\/div><\/th><\/tr><tr style='height:20px;'><th id=\"0R13\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">14<\/div><\/th><td class=\"s7\" dir=\"ltr\">Item no.<\/td><td class=\"s7\" dir=\"ltr\">Description<\/td><td class=\"s7\" dir=\"ltr\">Qty<\/td><td class=\"s7\" dir=\"ltr\">Unit\/Price<\/td><td class=\"s8\" dir=\"ltr\">Price<\/td><\/tr><tr style='height:20px;'><th id=\"0R14\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">15<\/div><\/th><td class=\"s2\" dir=\"ltr\"><\/td><td class=\"s2\" dir=\"ltr\"><\/td><td class=\"s2\" dir=\"ltr\"><\/td><td class=\"s2\" dir=\"ltr\"><\/td><td class=\"s2\" dir=\"ltr\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R15\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">16<\/div><\/th><td class=\"s9\" dir=\"ltr\">1<\/td><td class=\"s2\" dir=\"ltr\">Mow Lawn<\/td><td class=\"s9\" dir=\"ltr\">1<\/td><td class=\"s9\" dir=\"ltr\">100<\/td><td class=\"s10\" dir=\"ltr\">100<\/td><\/tr><tr style='height:20px;'><th id=\"0R16\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">17<\/div><\/th><td class=\"s9\" dir=\"ltr\">2<\/td><td class=\"s2\" dir=\"ltr\">Cut Trees<\/td><td class=\"s9\" dir=\"ltr\">1<\/td><td class=\"s9\" dir=\"ltr\">120<\/td><td class=\"s10\" dir=\"ltr\">120<\/td><\/tr><tr style='height:20px;'><th id=\"0R17\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">18<\/div><\/th><td class=\"s11\"><\/td><td class=\"s11\"><\/td><td class=\"s11\"><\/td><td class=\"s11\" dir=\"ltr\"><\/td><td class=\"s12\" dir=\"ltr\"><\/td><\/tr><tr style='height:20px;'><th id=\"0R18\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">19<\/div><\/th><td><\/td><td><\/td><td class=\"s13\"><\/td><td class=\"s13\" dir=\"ltr\">SubTotal<\/td><td class=\"s10\" dir=\"ltr\">220<\/td><\/tr><tr style='height:20px;'><th id=\"0R19\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">20<\/div><\/th><td><\/td><td><\/td><td class=\"s13\"><\/td><td class=\"s13\" dir=\"ltr\">Tax<\/td><td class=\"s10\" dir=\"ltr\">10<\/td><\/tr><tr style='height:20px;'><th id=\"0R20\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">21<\/div><\/th><td><\/td><td><\/td><td class=\"s13\"><\/td><td class=\"s13\" dir=\"ltr\">Other<\/td><td class=\"s10\" dir=\"ltr\">0<\/td><\/tr><tr style='height:20px;'><th id=\"0R21\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">22<\/div><\/th><td><\/td><td><\/td><td class=\"s13\"><\/td><td class=\"s13\" dir=\"ltr\">Discount<\/td><td class=\"s10\" dir=\"ltr\">0<\/td><\/tr><tr style='height:20px;'><th id=\"0R22\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">23<\/div><\/th><td><\/td><td><\/td><td class=\"s13\" dir=\"ltr\"><\/td><td class=\"s13\" dir=\"ltr\">Paid<\/td><td class=\"s10\" dir=\"ltr\">0<\/td><\/tr><tr style='height:20px;'><th id=\"0R23\" style=\"height: 20px;\" class=\"row-headers-background row-header-shim\"><div class=\"row-header-wrapper\" style=\"line-height: 20px;\">24<\/div><\/th><td><\/td><td><\/td><td class=\"s14\" dir=\"ltr\">Total due by<\/td><td class=\"s15\" dir=\"ltr\">4\/1\/2015<\/td><td class=\"s15\" dir=\"ltr\">230<\/td><\/tr><\/tbody><\/table><\/div><\/div><\/div><\/body><\/html>";
	var coName = 'Jack Mow Inc.';
	var coAddress = "1125 Bluemound Rd., Brookfield, WI 53222";
	var coPhone = "262-290-3141";
	var coFax = "262-290-3142";
	var coEmail = "sales@jackmowinc.com";
	
	var invoiceno = "002345";
	
	adhocs.fetch();
	Alloy.Globals.Log("invoicedetail.js::emailpdf:: adhocs contents "+JSON.stringify(adhocs)); 
	Alloy.Globals.Log("invoicedetail.js::emailpdf:: adhocs.length: "+adhocs.length); 
	var strVarItems="";
	for (i=0;i<adhocs.length;i++){
		Alloy.Globals.Log("invoicedetail.js::emailpdf:: adhocs.models["+i+"].toJSON().col3: "+adhocs.models[i].toJSON().col3);
		var jobitemstring=adhocs.models[i].toJSON().col3.replace(/xSqBracketOpen/,'[').replace(/xSqBracketClose/,']');
		Alloy.Globals.Log("invoicedetail.js::emailpdf:: adhocs extraction: jobitemstring.length "+jobitemstring.length+ "jobitemstring : "+jobitemstring);
		var jobitemjson = JSON.parse(jobitemstring);
		for (j=0;j<jobitemjson.length;j++){
			var names=jobitemjson[0].names;
			Alloy.Globals.Log("invoicedetail.js::emailpdf:: adhocs extraction:  names : "+jobitemjson[j].names+" : "+jobitemjson[j].descr+" : "+jobitemjson[j].lineitem+" : "+jobitemjson[j].price+" : "+jobitemjson[j].qty);
			strVarItems += "				<tbody>";
			strVarItems += "					<tr>";
			if(j>0){
				Alloy.Globals.Log("invoicedetail.js::emailpdf:: names comparison:  "+jobitemjson[j].names+" vs. "+jobitemjson[j-1].names);
				if(jobitemjson[j].names==jobitemjson[j-1].names){
					strVarItems += "						<td><a class=\"cut\">-<\/a><span contenteditable> <\/span><\/td>";
				} else {
					strVarItems += "						<td><a class=\"cut\">-<\/a><span contenteditable>"+jobitemjson[j].names+"<\/span><\/td>";
				}
				if(jobitemjson[j].descr==jobitemjson[j-1].descr){
					strVarItems += "						<td><span contenteditable> <\/span><\/td>";
				} else {
					strVarItems += "						<td><span contenteditable>"+jobitemjson[j].descr+"<\/span><\/td>";
				}
			} else {
				strVarItems += "						<td><a class=\"cut\">-<\/a><span contenteditable>"+jobitemjson[j].names+"<\/span><\/td>";
				strVarItems += "						<td><span contenteditable>"+jobitemjson[j].descr+"<\/span><\/td>";
			}
			strVarItems += "						<td><span contenteditable>"+jobitemjson[j].lineitem+"<\/span><\/td>";
			strVarItems += "						<td><span contenteditable>"+jobitemjson[j].qty+"<\/span><\/td>";
			(isNaN(jobitemjson[j].price))?strVarItems += "						<td><span>"+jobitemjson[j].price+"<\/span><\/td>":strVarItems += "						<td><span data-prefix>$<\/span><span>"+jobitemjson[j].price+"<\/span><\/td>";
			strVarItems += "					<\/tr>";
			strVarItems += "				<\/tbody>";
		}
	}
  
	var strVar="";
	strVar += "<html>";
	strVar += "	<head>";
	strVar += "		<meta charset=\"utf-8\">";
	strVar += "		<title>Invoice<\/title>";
	strVar += "<style>";
	strVar += "    \/* reset *\/";
	strVar += "";
	strVar += "*";
	strVar += "{";
	strVar += "	border: 0;";
	strVar += "	box-sizing: content-box;";
	strVar += "	color: inherit;";
	strVar += "	font-family: inherit;";
	strVar += "	font-size: inherit;";
	strVar += "	font-style: inherit;";
	strVar += "	font-weight: inherit;";
	strVar += "	line-height: inherit;";
	strVar += "	list-style: none;";
	strVar += "	margin: 0;";
	strVar += "	padding: 0;";
	strVar += "	text-decoration: none;";
	strVar += "	vertical-align: top;";
	strVar += "}";
	strVar += "";
	strVar += "\/* content editable *\/";
	strVar += "";
	strVar += "*[contenteditable] { border-radius: 0.25em; min-width: 1em; outline: 0; }";
	strVar += "";
	strVar += "*[contenteditable] { cursor: pointer; }";
	strVar += "";
	strVar += "*[contenteditable]:hover, *[contenteditable]:focus, td:hover *[contenteditable], td:focus *[contenteditable], img.hover { background: #DEF; box-shadow: 0 0 1em 0.5em #DEF; }";
	strVar += "";
	strVar += "span[contenteditable] { display: inline-block; }";
	strVar += "";
	strVar += "\/* heading *\/";
	strVar += "";
	strVar += "h1 { font: bold 100% sans-serif; letter-spacing: 0.5em; text-align: center; text-transform: uppercase; }";
	strVar += "";
	strVar += "\/* table *\/";
	strVar += "";
	strVar += "table { font-size: 75%; table-layout: fixed; width: 100%; }";
	strVar += "table { border-collapse: separate; border-spacing: 2px; }";
	strVar += "th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }";
	strVar += "th, td { border-radius: 0.25em; border-style: solid; }";
	strVar += "th { background: #EEE; border-color: #BBB; }";
	strVar += "td { border-color: #DDD; }";
	strVar += "";
	strVar += "\/* page *\/";
	strVar += "";
	strVar += "html { font: 16px\/1 'Open Sans', sans-serif; overflow: auto; padding: 0.5in; }";
	strVar += "html { background: #999; cursor: default; }";
	strVar += "";
	strVar += "body { box-sizing: border-box; height: 11in; margin: 0 auto; overflow: hidden; padding: 0.5in; width: 8.5in; }";
	strVar += "body { background: #FFF; border-radius: 1px; box-shadow: 0 0 1in -0.25in rgba(0, 0, 0, 0.5); }";
	strVar += "";
	strVar += "\/* header *\/";
	strVar += "";
	strVar += "header { margin: 0 0 3em; }";
	strVar += "header:after { clear: both; content: \"\"; display: table; }";
	strVar += "";
	strVar += "header h1 { background: #000; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }";
	strVar += "header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }";
	strVar += "header address p { margin: 0 0 0.25em; }";
	strVar += "header span, header img { display: block; float: right; }";
	strVar += "header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }";
	strVar += "header img { max-height: 100%; max-width: 100%; }";
	strVar += "header input { cursor: pointer; -ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\"; height: 100%; left: 0; opacity: 0; position: absolute; top: 0; width: 100%; }";
	strVar += "";
	strVar += "\/* article *\/";
	strVar += "";
	strVar += "article, article address, table.meta, table.inventory { margin: 0 0 3em; }";
	strVar += "article:after { clear: both; content: \"\"; display: table; }";
	strVar += "article h1 { clip: rect(0 0 0 0); position: absolute; }";
	strVar += "";
	strVar += "article address { float: left; font-size: 125%; font-weight: bold; }";
	strVar += "";
	strVar += "\/* table meta & balance *\/";
	strVar += "";
	strVar += "table.meta, table.balance { float: right; width: 36%; }";
	strVar += "table.meta:after, table.balance:after { clear: both; content: \"\"; display: table; }";
	strVar += "";
	strVar += "\/* table meta *\/";
	strVar += "";
	strVar += "table.meta th { width: 40%; }";
	strVar += "table.meta td { width: 60%; }";
	strVar += "";
	strVar += "\/* table items *\/";
	strVar += "";
	strVar += "table.inventory { clear: both; width: 100%; }";
	strVar += "table.inventory th { font-weight: bold; text-align: center; }";
	strVar += "";
	strVar += "table.inventory td:nth-child(1) { width: 26%; }";
	strVar += "table.inventory td:nth-child(2) { width: 38%; }";
	strVar += "table.inventory td:nth-child(3) { text-align: right; width: 12%; }";
	strVar += "table.inventory td:nth-child(4) { text-align: right; width: 12%; }";
	strVar += "table.inventory td:nth-child(5) { text-align: right; width: 12%; }";
	strVar += "";
	strVar += "\/* table balance *\/";
	strVar += "";
	strVar += "table.balance th, table.balance td { width: 50%; }";
	strVar += "table.balance td { text-align: right; }";
	strVar += "";
	strVar += "\/* aside *\/";
	strVar += "";
	strVar += "aside h1 { border: none; border-width: 0 0 1px; margin: 0 0 1em; }";
	strVar += "aside h1 { border-color: #999; border-bottom-style: solid; }";
	strVar += "";
	strVar += "";
	strVar += "@media print {";
	strVar += "	* { -webkit-print-color-adjust: exact; }";
	strVar += "	html { background: none; padding: 0; }";
	strVar += "	body { box-shadow: none; margin: 0; }";
	strVar += "	span:empty { display: none; }";
	strVar += "	.add, .cut { display: none; }";
	strVar += "}";
	strVar += "";
	strVar += "@page { margin: 0; }";
	strVar += "            <\/style>";
	strVar += "	<\/head>";
	strVar += "	<body>";
	strVar += "		<header>";
	strVar += "			<h1>Invoice<\/h1>";
	strVar += "			<address contenteditable>";
	strVar += "				<p>"+coName+"<\/p>";
	strVar += "				<p>"+coAddress+"<\/p>";
	strVar += "				<p>"+coPhone+"<\/p>";
	strVar += "				<p>"+coFax+"<\/p>";
	strVar += "				<p>"+coEmail+"<\/p>";
	strVar += "			<\/address>";
	strVar += "			<span><img alt=\"\" src=\""+logourl+"\"><input type=\"file\" accept=\"image\/*\"><\/span>";
	strVar += "		<\/header>";
	strVar += "		<article>";
	strVar += "			<h1>Recipient<\/h1>";
	strVar += "			<address contenteditable>";
	strVar += "				<p>"+firstname+" "+lastname+"<br>"+address+"<br>"+city+", "+state+"<br> phone:  "+phone+"<br> email: "+email+"<\/p>";
	strVar += "			<\/address>";
	strVar += "			<table class=\"meta\">";
	strVar += "				<tr>";
	strVar += "					<th><span contenteditable>Invoice #<\/span><\/th>";
	strVar += "					<td><span contenteditable>"+invoicenumber+"<\/span><\/td>";
	strVar += "				<\/tr>";
	strVar += "				<tr>";
	strVar += "					<th><span contenteditable>Date<\/span><\/th>";
	strVar += "					<td><span contenteditable>"+(new Date()).toString().slice(4,16)+"<\/span><\/td>";
	strVar += "				<\/tr>";
	strVar += "				<tr>";
	strVar += "					<th><span contenteditable>Amount Due<\/span><\/th>";
	strVar += "					<td><span id=\"prefix\" contenteditable>$<\/span><span>600.00<\/span><\/td>";
	strVar += "				<\/tr>";
	strVar += "			<\/table>";
	strVar += "			<table class=\"inventory\">";
	strVar += "				<thead>";
	strVar += "					<tr>";
	strVar += "						<th><span contenteditable>Project<\/span><\/th>";
	strVar += "						<th><span contenteditable>Description<\/span><\/th>";
	strVar += "						<th><span contenteditable>Item<\/span><\/th>";
	strVar += "						<th><span contenteditable>Quantity<\/span><\/th>";
	strVar += "						<th><span contenteditable>Price<\/span><\/th>";
	strVar += "					<\/tr>";
	strVar += "				<\/thead>";
	strVar += strVarItems;
	strVar += "			<\/table>";
	strVar += "			<table class=\"balance\">";
	strVar += "				<tr>";
	strVar += "					<th><span contenteditable>Total<\/span><\/th>";
	strVar += "					<td><span data-prefix>$<\/span><span>"+subtotal+"<\/span><\/td>";
	strVar += "				<\/tr>";
	strVar += "				<tr>";
	strVar += "					<th><span contenteditable>Amount Paid<\/span><\/th>";
	strVar += "					<td><span data-prefix>$<\/span><span contenteditable>"+paid+"<\/span><\/td>";
	strVar += "				<\/tr>";
	strVar += "				<tr>";
	strVar += "					<th><span contenteditable>Balance Due<\/span><\/th>";
	strVar += "					<td><span data-prefix>$<\/span><span>"+balance+"<\/span><\/td>";
	strVar += "				<\/tr>";
	strVar += "			<\/table>";
	strVar += "		<\/article>";
	strVar += "		<aside>";
	strVar += "			<h1><span contenteditable>Additional Notes<\/span><\/h1>";
	strVar += "			<div contenteditable>";
	strVar += "				<p>A finance charge of 1.5% will be made on unpaid balances after 30 days.<\/p>";
	strVar += "			<\/div>";
	strVar += "		<\/aside>";
	strVar += "	<\/body>";
	strVar += "<\/html>";
   
 	html2pdf.setHtmlString(strVar); 
 };
 
 Alloy.Globals.shareAnyonePermission = function(sid){
	Alloy.Globals.Log("alloy.js::Alloy.Globals.shareAnyonePermission::sid: "+sid);
	var jsonpost = '{'
		 +'\"role\": \"reader\",'
		 +'\"type\": \"anyone\"'
		+'}';
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Alloy.Globals.Log("alloy.js::Alloy.Globals.shareAnyonePermission::response is: "+this.responseText);
	    	} catch(e){
				Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		alert("error:"+e.code+": Please connect to the network."); 
		Alloy.Globals.Log("alloy.js:Alloy.Globals.shareAnyonePermission:: error is: "+JSON.stringify(e));
	};
	xhr.open("POST", 'https://www.googleapis.com/drive/v2/files/'+sid+'/permissions');	
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
    Alloy.Globals.Log("Alloy.Globals.shareAnyonePermission::shareAnyonePermission::json post: "+jsonpost);
	xhr.send(jsonpost);
};


 Alloy.Globals.uploadPictoGoogle = function(image,filename,parentid,position,type,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16){
	Alloy.Globals.Log("Alloy.Globals.uploadPictoGoogle::uploadPictoGoogle::create ss with filename: "+filename);
	//var base64Data = Ti.Utils.base64encode(image);
	var base64Data = Ti.Utils.base64encode(image);
	//var base64Data = image;
	 		var parts = [];
	 		var bound = 287032396531387;
	 		var meta = '\{'
	 		+	'\"title\": \"'+filename+'\",'
	 		+'\"parents\": ['
		  	+'{'
		   	+'\"id\": \"'+parentid+'\"'
		 	+' }'
		 	+']'
			+	'\}';
			var parts = [];
	        parts.push('--' + bound);
	        parts.push('Content-Type: application/json');
	        parts.push('');
	        parts.push(meta);
	        parts.push('--' + bound);
			parts.push('Content-Type: image/jpeg');
	        parts.push('Content-Transfer-Encoding: base64');
	        parts.push('');
	        parts.push(base64Data);
	        parts.push('--' + bound + '--');
	 		var url = "https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart";
	 		var xhr =  Titanium.Network.createHTTPClient({
			    onload: function() {
			    	try {
			    		var json = JSON.parse(this.responseText);
	    				Alloy.Globals.Log("Alloy.Globals.uploadPictoGoogle::uploadPictoGoogle::response is: "+JSON.stringify(json));
	    				var id = json.id;
	    				var webcontentlink = json.webContentLink;
	    				Alloy.Globals.Log("Alloy.Globals.uploadPictoGoogle::uploadPictoGoogle::id is: "+id+" webcontentlink: "+webcontentlink);
	    				Alloy.Globals.shareAnyonePermission(id);
	    				var e = {"value":"none","source":{"_hintText":id}};
	    				Alloy.Globals.Log("Alloy.Globals.uploadPictoGoogle::uploadPictoGoogle::entering urlimage with info below e: "+JSON.stringify(e));
	    				//enterNotes(e,webcontentlink);
	    				eval("var col"+position+" = webcontentlink");
	    				var ssidsourcename = filename.split("_")[0]+"_"+filename.split("_")[1]+"_"+filename.split("_")[2];
	    				var ssidsourcenametofind = type+'_'+ssidsourcename+"_sid";
	    				var ssid = Titanium.App.Properties.getString(ssidsourcenametofind);
	    				Alloy.Globals.Log("alloy.js:Alloy.Globals.uploadPictoGoogle:b4 execute Alloy.Globals.submit, ssid for Titanium.App.Properties.getString("+ssidsourcenametofind+") : "+ssid);
	    				if (type) {
	    					Alloy.Globals.Log("alloy.js:Alloy.Globals.uploadPictoGoogle:b4 execute Alloy.Globals.submit, ssid is : "+ssid);
	    					Alloy.Globals.submit(type,ssid,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16);
	    				} else {
	    					Alloy.Globals.Log("alloy.js:Alloy.Globals.uploadPictoGoogle: Plain upload, no spreadsheet registration for link, ssid is : "+ssid);
	    				}	    				
			    	} catch(e){
			    		Alloy.Globals.Log("Alloy.Globals.uploadPictoGoogle::uploadPictoGoogle::cathing e: "+JSON.stringify(e));
			    	} 
			    	return id;    
			    },
			    onerror: function(e) {
			    	Alloy.Globals.Log("Alloy.Globals.uploadPictoGoogle::uploadPictoGoogle::error e: "+JSON.stringify(e));
			        alert("error:"+e.code+": Please connect to the network.");  
			    }
			});
			xhr.open("POST", url);
			xhr.setRequestHeader("Content-type", "multipart/mixed; boundary=" + bound);
			xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
			//xhr.setRequestHeader("Content-Length", "2000000");
			xhr.send(parts.join("\r\n"));
			Alloy.Globals.Log('done POSTed');
			//Alloy.Globals.Log("Alloy.Globals.uploadPictoGoogle::uploadPictoGoogle::sid outside is: "+id);
};

//After revamp

Alloy.Globals.populateSpreadsheetHeader = function(sid,rowno,colno,edithref,selfhref,value){ 
		var xmldatastring = ['<entry xmlns=\'http://www.w3.org/2005/Atom\' '
 		+' xmlns:gs=\'http://schemas.google.com/spreadsheets/2006\'>'
 		+'<id>'+selfhref+'</id>'
 		+'<link rel=\'edit\' type=\'application/atom+xml\''
 		+' href=\''+edithref+'\'/>'
 		+'<gs:cell row=\''+rowno+'\' col=\''+colno+'\' inputValue=\''+value+'\'>'
 		+'</gs:cell>'
 		+'</entry>'].join('');
 		Alloy.Globals.Log("alloy.js:Alloy.Globals.populateSpreadsheetHeader:xmldatastring: "+xmldatastring);
       var xhr =  Titanium.Network.createHTTPClient({
    onload: function() {
        try {
                Alloy.Globals.Log("alloy.js:Alloy.Globals.populateSpreadsheetHeader:this.responseText::"+this.responseText); 
        } catch(e){
                Alloy.Globals.Log("alloy.js:Alloy.Globals.populateSpreadsheetHeader:cathing e: "+JSON.stringify(e));
        }     
    },
    onerror: function(e) {
        Alloy.Globals.Log("Alloy.Globals.populateSpreadsheetHeader::edithref: "+edithref+":: error e: "+JSON.stringify(e));
        alert("error:"+e.code+": Please connect to the network."); 
    }
});
        xhr.open("PUT", ''+edithref+'');
        xhr.setRequestHeader("Content-type", "application/atom+xml");
        xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
        xhr.send(xmldatastring);
        Alloy.Globals.Log('done POSTed');
};


Alloy.Globals.getSSCell = function(sid,rowno,colno,value,t) {
	var pos = "R"+rowno+"C"+colno;
	var value = value;
	(t)?t=t:t=0; //check if there is no delay needed
	Alloy.Globals.Log("alloy.js::get SS Cell on :  https://spreadsheets.google.com/feeds/cells/"+sid+"/od6/private/full/"+pos+" at "+t+" ms");
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var xml = Titanium.XML.parseString(this.responseText);
	    		Alloy.Globals.Log("Alloy.Globals.getSSCell:: response is: "+this.responseText);
	    		Alloy.Globals.Log("Alloy.Globals.getSSCell:: xml response is: "+xml);
	    		var entry = xml.documentElement.getElementsByTagName("entry");
	    		var link = xml.documentElement.getElementsByTagName("link");
	    		Alloy.Globals.Log("alloy.js:: Alloy.Globals.getSSCell::number of link found: " +link+ " length: "+link.length);
	    		for (i=0;i<link.length;i++){			
	    			var listitem = link.item(i);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href");}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href");}
	    		}
				Alloy.Globals.Log("Alloy.Globals.getSSCell:executing  : Alloy.Globals.populateSpreadsheetHeader("+sid+","+rowno+","+colno+","+edithref+","+selfhref+","+value+")");
	    		Alloy.Globals.populateSpreadsheetHeader(sid,rowno,colno,edithref,selfhref,value);	    				    			
	    	} catch(e){
				Alloy.Globals.Log("Alloy.Globals.getSSCell::cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		alert("error:"+e.code+": Please connect to the network."); 
		Alloy.Globals.Log("projectdetail::Alloy.Globals.getSSCell::Unable to connect to the cloud. "+JSON.stringify(e));
	};
	xhr.open("GET", 'https://spreadsheets.google.com/feeds/cells/'+sid+'/od6/private/full/'+pos);
	xhr.setRequestHeader("Content-type", "application/atom+xml");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());    
	//xhr.send();
	Alloy.Globals.Log("alloy.js::get SS Cell on : executing xhr.send() after "+t+" ms");
	setTimeout(function(){
			xhr.send();
			Alloy.Globals.Log("alloy.js::get SS Cell on : xhr.send() EXECUTED after "+t+" ms");
		},t);
};


Alloy.Globals.createSpreadsheet2 = function(filename,parentid,isinit){
	var t = parseFloat(Titanium.App.Properties.getInt("krani_t",1));
	Alloy.Globals.Log("alloy.js::Alloy.Globals.createSpreadsheet2 with filename: "+filename+" and parentid: "+parentid+" and t:"+t);
	var jsonpost = '{'
		 +'\"title\": \"'+filename+'\",'
		 +'\"parents\": ['
		  +'{'
		   +'\"id\": \"'+parentid+'\"'
		 +' }'
		 +'],'
		 +'\"mimeType\": \"application/vnd.google-apps.spreadsheet\"'
		+'}';
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Alloy.Globals.Log("Alloy.Globals.createSpreadsheet2::response is: "+this.responseText);
	    		var json = JSON.parse(this.responseText);
	    		var sid = json.id;
	    		///Alloy.Globals.populatesidtoDB(filename,sid);
	    		Titanium.App.Properties.setString('sid',sid); // 1st sid created.
	    		// Populate Header
	    		Alloy.Globals.Log("Alloy.Globals.createSpreadsheet2: Populate Header: "+filename+" sid: "+sid);
    			for (j=1;j<17;j++){
    				var t = parseFloat(Titanium.App.Properties.getInt("krani_t",1000));
					var value = "col"+j;
					Alloy.Globals.Log("Alloy.Globals.createSpreadsheet2: Alloy.Globals.getSSCell("+sid+",1,"+j+","+value+","+t+")");
					Alloy.Globals.getSSCell(sid,1,j,value,t);
					var t = parseFloat(t) + 500;Titanium.App.Properties.setInt("krani_t",t);
					Alloy.Globals.Log("Alloy.Globals.createSpreadsheet2: Populate Header: wait at "+t+" ms, getSSCell("+sid+",1,"+j+","+value+")");			
				}
				if (isinit == "yes") {
					var t = parseFloat(Titanium.App.Properties.getInt("krani_t",10500));
					Alloy.Globals.Log("Alloy.Globals.createSpreadsheet2: isinit: "+isinit);
					setTimeout(function(){Alloy.Globals.getSSCell(sid,2,1,"parentid");},500+parseFloat(t));
					setTimeout(function(){Alloy.Globals.getSSCell(sid,2,2,parentid);},1000+parseFloat(t));
					setTimeout(function(){Alloy.Globals.getSSCell(sid,3,1,filename);},1500+parseFloat(t));
					setTimeout(function(){Alloy.Globals.getSSCell(sid,3,2,sid);},2000+parseFloat(t));							
					//TODO: Alloy Globals locate index and create spreadsheet.
					setTimeout(function(){
						var name = filename.replace(/_index$/g,"");
						Alloy.Globals.locateIndexCreateSpreadsheet(name);
					},2500+parseFloat(t));											
	    		}
	    		setTimeout(function(){Alloy.Globals.Log("alloy.js:Alloy.Globals.createSpreadsheet2:sid : "+sid);},3000+parseFloat(t));	
	    		Titanium.App.Properties.setInt("krani_t",3000+parseFloat(t));		    		
	    	} catch(e){
				Alloy.Globals.Log("Alloy.Globals.createSpreadsheet2::cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		alert("error:"+e.code+": Please connect to the network."); 
		Alloy.Globals.Log("projectdetail::createSpreadsheet::Unable to createSpreadsheet with "+filename+".");
	};
	xhr.open("POST", 'https://www.googleapis.com/drive/v2/files');	
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
    Alloy.Globals.Log("alloy.js::json post: "+jsonpost);
	xhr.send(jsonpost);
};


Alloy.Globals.createFolder = function(foldername,parentid){
	Alloy.Globals.Log("alloy.js::create ss with foldername: "+foldername+" and parentid: "+parentid);
	var jsonpost = '{'
		 +'\"title\": \"'+foldername+'\",'
		 +'\"parents\": ['
		  +'{'
		   +'\"id\": \"'+parentid+'\"'
		 +' }'
		 +'],'
		 +'\"mimeType\": \"application/vnd.google-apps.folder\"'
		+'}';
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Alloy.Globals.Log("Alloy.Globals.createFolder::response is: "+this.responseText);
	    		var json = JSON.parse(this.responseText);
	    		var sid = json.id;
	    		///Alloy.Globals.populatesidtoDB(foldername,sid);
	    		Titanium.App.Properties.setString('sid',sid);
	    		Alloy.Globals.Log("alloy.js::sid : "+sid);
	    	} catch(e){
				Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		Alloy.Globals.Log("projectdetail::createFolder::Unable to createFolder with "+foldername+".");
	};
	xhr.open("POST", 'https://www.googleapis.com/drive/v2/files');	
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
    Alloy.Globals.Log("alloy.js::json post: "+jsonpost);
	xhr.send(jsonpost);
};

Alloy.Globals.createFolderIFNotExist = function(foldername,parentid){
		var xhr1 = Ti.Network.createHTTPClient({
		onload:function(e){
			var fileexistjsonlist = JSON.parse(this.responseText);
			Alloy.Globals.Log("Alloy.Globals.createFolderIFNotExist::response of fileexistjsonlist is: "+JSON.stringify(fileexistjsonlist));
			if (fileexistjsonlist.items.length == "0" ){
				Alloy.Globals.Log("alloy.js::Alloy.Globals.createFolderIFNotExist::file "+filename+" does not exist, continue");
				Alloy.Globals.Log("alloy.js:Alloy.Globals.createFolderIFNotExist:create ss with filename: "+filename+" and parentid: "+parentid);
				var jsonpost = '{'
					 +'\"title\": \"'+filename+'\",'
					 +'\"parents\": ['
					  +'{'
					   +'\"id\": \"'+parentid+'\"'
					 +' }'
					 +'],'
					 +'\"mimeType\": \"application/vnd.google-apps.folder\"'
					+'}';
				var xhr2 = Ti.Network.createHTTPClient({
			    onload: function(e) {
				    try {
				    		Alloy.Globals.Log("Alloy.Globals.createFolderIFNotExist::response is: "+this.responseText);
				    		var json = JSON.parse(this.responseText);
				    		var sid = json.id;
				    		///Alloy.Globals.populatesidtoDB(foldername,sid);
				    		Titanium.App.Properties.setString('sid',sid);
				    		Alloy.Globals.Log("Alloy.Globals.createFolderIFNotExist:alloy.js::sid : "+sid);
				    	} catch(e){
							Alloy.Globals.Log("Alloy.Globals.createFolderIFNotExist:cathing e: "+JSON.stringify(e));
						}
					}
				});
			xhr2.onerror = function(e){
				//alert("Alloy.Globals.createFolderIFNotExist::Unable to create spreadsheet.");
				Alloy.Globals.Log("Alloy.Globals.createFolderIFNotExist::Unable to createSpreadsheet with "+filename+".");
			};
			xhr2.open("POST", 'https://www.googleapis.com/drive/v2/files');	
			xhr2.setRequestHeader("Content-type", "application/json");
		    xhr2.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
		    Alloy.Globals.Log("alloy.js::json post: "+jsonpost);
			xhr2.send(jsonpost);
			// Create Credit and Debit END								
		} else {
			Alloy.Globals.Log("alloy.js::Alloy.Globals.createFolderIFNotExist::file "+filename+" EXIST !! Abort...");									
			}
		}							
	});	
	var rawquerystring1 = '?q=title+%3D+\''+filename+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.spreadsheet\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Cparents%2Ctitle)';	
	xhr1.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring1);
	xhr1.setRequestHeader("Content-type", "application/json");
	xhr1.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr1.send();	
		
};


Alloy.Globals.createCoreSS = function (filename,parentid,indexsid) {
		var t = parseFloat(Titanium.App.Properties.getInt("krani_t",1));
		var xhr1 = Ti.Network.createHTTPClient({
		onload:function(e){
			var fileexistjsonlist = JSON.parse(this.responseText);
			Alloy.Globals.Log("Alloy.Globals.createCoreSS::response of fileexistjsonlist is: "+JSON.stringify(fileexistjsonlist));
			if (fileexistjsonlist.items.length == "0" ){
				Alloy.Globals.Log("alloy.js::Alloy.Globals.createCoreSS::file "+filename+" does not exist, continue");
				Alloy.Globals.Log("alloy.js::Alloy.Globals.createCoreSS: filename: "+filename+" and parentid: "+parentid+" krani_t: "+t);
				var jsonpost = '{'
					 +'\"title\": \"'+filename+'\",'
					 +'\"parents\": ['
					  +'{'
					   +'\"id\": \"'+parentid+'\"'
					 +' }'
					 +'],'
					 +'\"mimeType\": \"application/vnd.google-apps.spreadsheet\"'
					+'}';
				var xhr2 = Ti.Network.createHTTPClient({
			    onload: function(e) {
				    try {
				    		Alloy.Globals.Log("Alloy.Globals.createCoreSS::response is: "+this.responseText);
				    		var json = JSON.parse(this.responseText);
				    		var sid = json.id;
				    		var filename = json.title;
				    		///Alloy.Globals.populatesidtoDB(filename,sid); //populate sid db.
				    		Alloy.Globals.Log("alloy.js::Alloy.Globals.createCoreSS::updateSpreadsheet filename: "+filename+" and sid: "+sid);
				    		Alloy.Globals.updateSpreadsheet2(indexsid,filename,sid,"0","0","0","0","0","0","0","0","0","0","0","0","0","0"); //update the index ss with sid
				    		Titanium.App.Properties.setString('sid',sid); // 1st sid created.
				    		var item = filename.replace(/list$/g,"").replace(/^.*_/g,"");
				    		eval("Titanium.App.Properties.setString(item,sid)");
				    		//Alloy.Globals.Log("Alloy.Globals.createCoreSS::Titanium.App.Properties.getString(item,sid): "+eval("Titanium.App.Properties.getString(item,sid)"));
				    		// Populate Header
			    			for (k=1;k<17;k++){
			    				var t = parseFloat(Titanium.App.Properties.getInt("krani_t",10000));
								var value = "col"+k;							
								Alloy.Globals.Log("Alloy.Globals.createSpreadsheet2: Alloy.Globals.getSSCell("+sid+",1,"+k+","+value+","+t+")");
								Alloy.Globals.getSSCell(sid,1,k,value,t); //to avoid google quota req/sec exhaustion.
								var t = parseFloat(t) + 500;Titanium.App.Properties.setInt("krani_t",t);
								Alloy.Globals.Log("Alloy.Globals.createSpreadsheet2: Populate Header: wait at "+t+" ms, getSSCell("+sid+",1,"+k+","+value+")");		
							}
							var t = parseFloat(Titanium.App.Properties.getInt("krani_t",10500));
							setTimeout(function(){
								filename.match(/_index$/) || Alloy.Globals.getSSCell(sid,2,1,"PLEASE DO NOT EDIT THIS FILE. THE APP WILL BREAK. PLS CONTACT support@thekrani.com TO FIX");		
				    			Alloy.Globals.Log("alloy.js::sid : "+sid+" krani_t: "+t);
							},17500+parseFloat(t));
							Titanium.App.Properties.setInt("krani_t",t); // update the API delay				
				    	} catch(e){
							Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
						}
					}
				});
			xhr2.onerror = function(e){
				alert("error:"+e.code+": Please connect to the network."); 
				Alloy.Globals.Log("projectdetail::createSpreadsheet::Unable to createSpreadsheet with "+filename+".");
			};
			xhr2.open("POST", 'https://www.googleapis.com/drive/v2/files');	
			xhr2.setRequestHeader("Content-type", "application/json");
		    xhr2.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
		    Alloy.Globals.Log("alloy.js::json post: "+jsonpost);
			xhr2.send(jsonpost);
			// Create Credit and Debit END								
		} else {
			Alloy.Globals.Log("alloy.js::Alloy.Globals.createCoreSS::file "+filename+" EXIST !! Abort...");									
			}
		}							
	});	
	var rawquerystring1 = '?q=title+%3D+\''+filename+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.spreadsheet\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Cparents%2Ctitle)';	
	xhr1.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring1);
	xhr1.setRequestHeader("Content-type", "application/json");
	xhr1.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr1.send();	
		
};


Alloy.Globals.setTiPropFromSS = function(sid) {
	Alloy.Globals.Log("alloy.js::executing Alloy.Globals.setTiPropFromSS on sid: "+sid);	
	var data = [];
	var maxdebug = Titanium.App.Properties.getInt('maxdebug');
	var mindebug = Titanium.App.Properties.getInt('mindebug');
	var url = "https://spreadsheets.google.com/feeds/list/"+sid+"/od6/private/full";
	var thefile = "gss"+sid+".xml";
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
			var xml = Titanium.XML.parseString(this.responseText);
			if(maxdebug==1){Alloy.Globals.Log("alloy.js::Alloy.Globals.setTiPropFromSS:: response txt is: "+this.responseText);};
			if(maxdebug==1){Alloy.Globals.Log("alloy.js::Alloy.Globals.setTiPropFromSS:: this xml is: " +xml);	};   
			var feed = xml.documentElement.getElementsByTagName("feed");
			var entry = xml.documentElement.getElementsByTagName("entry"); 
			(mindebug == 1) && Alloy.Globals.Log("alloy.js::this entry length is: " +entry.length);
			for (i=1;i<entry.length;i++){
				var col1 = entry.item(i).getElementsByTagName("gsx:col1").item(0).text;
				var col2 = entry.item(i).getElementsByTagName("gsx:col2").item(0).text;
				var col3 = entry.item(i).getElementsByTagName("gsx:col3").item(0).text;
				var idtag = entry.item(i).getElementsByTagName("id").item(0).text.replace(':','yCoLoNy');
				var link = entry.item(i).getElementsByTagName("link");
				if(col1 && col2){
					eval("Titanium.App.Properties.setString(\""+col1+"\",col2)"); // Titanium.App.Properties.setString("zefilandscape_client",1234)					
					Alloy.Globals.Log("alloy::setTiPropFromSS:: Titanium.App.Properties.getString("+col1+"): "+eval("Titanium.App.Properties.getString(col1)"));
					var stripcol1 = (col1.match(/list$/))?col1.replace(/list$/,'').split('_').pop():col1.split('_').pop()+"_dir";
					eval("Titanium.App.Properties.setString(\""+stripcol1+"\",col2)"); // Titanium.App.Properties.setString("client",1234) or Titanium.App.Properties.setString("client_dir",1234)
					Alloy.Globals.Log("alloy::setTiPropFromSS:: Titanium.App.Properties.getString("+stripcol1+"): "+eval("Titanium.App.Properties.getString(stripcol1)"));
					//Alloy.Globals.Log("alloy::getMaster:: Titanium.App.Properties.getString(freeuser): "+Titanium.App.Properties.getString("freeuser"));						
				}	
				for (y=0;y<link.length;y++){			
	    			var listitem = link.item(y);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href").replace(':','yCoLoNy');}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href").replace(':','yCoLoNy');}
    			}
			}
			Alloy.Globals.Log(" Alloy.Globals.setTiPropFromSS:Data were successfuly downloaded from "+url+". Please proceed.");
			} catch(e){
				Alloy.Globals.Log("Alloy.Globals.setTiPropFromSS:: cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.onerror = function(e){
		//alert(e);
		Alloy.Globals.Log("alloy.js::Alloy.Globals.setTiPropFromSS::Unable to connect to the network.url: "+url+" with error: "+JSON.stringify(e));
	};
	xhr.open("GET", url);
	xhr.send();
	
};

Alloy.Globals.createCoreInitialCoreFolderandSS = function(name,foldername,parentid,indexsid){
	var foldername = name+"_"+foldername;
	Alloy.Globals.Log("alloy.js::create ss with foldername: "+foldername+" and parentid: "+parentid);
	var xhr1 = Ti.Network.createHTTPClient({
    onload: function(e) {
		var fileexistjsonlist = JSON.parse(this.responseText);
		Alloy.Globals.Log("Alloy.Globals.createCoreInitialCoreFolderandSS::response of fileexistjsonlist is: "+JSON.stringify(fileexistjsonlist));
		if (fileexistjsonlist.items.length == "0" ){
				Alloy.Globals.Log("alloy.js::Alloy.Globals.createCoreInitialCoreFolderandSS::file "+foldername+" does not exist, continue");
				Alloy.Globals.Log("alloy.js::create createCoreInitialCoreFolderandSS with foldername: "+foldername+" and parentid: "+parentid);
				var jsonpost = '{'
				 +'\"title\": \"'+foldername+'\",'
				 +'\"parents\": ['
				  +'{'
				   +'\"id\": \"'+parentid+'\"'
				 +' }'
				 +'],'
				 +'\"mimeType\": \"application/vnd.google-apps.folder\"'
				+'}';
				var xhr = Ti.Network.createHTTPClient({
			    onload: function(e) {
			    try {
			    		Alloy.Globals.Log("Alloy.Globals.createCoreInitialCoreFolderandSS :: response is: "+this.responseText);
			    		var json = JSON.parse(this.responseText);
			    		var sid = json.id;
			    		//Alloy.Globals.populatesidtoDB(foldername,sid);
			    		Titanium.App.Properties.setString('sid',sid);
			    		Alloy.Globals.Log("alloy.js::sid : "+sid);
			    		Alloy.Globals.Log("Alloy.Globals.createCoreInitialCoreFolderandSS::Alloy.Globals.updateSpreadsheet2("+indexsid+","+foldername+","+sid+")");
			    		Alloy.Globals.updateSpreadsheet2(indexsid,foldername,sid,"0","0","0","0","0","0","0","0","0","0","0","0","0","0"); //update the index ss with sid
						//Create Core Spreadsheet
						var parentid = sid;
						var filename = foldername+"list";
						Alloy.Globals.createCoreSS(filename,parentid,indexsid);
			    	} catch(e){
						Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
					}
				}
				});
				xhr.onerror = function(e){
					Alloy.Globals.Log("projectdetail::createFolder::Unable to createFolder with "+foldername+".");
				};
				xhr.open("POST", 'https://www.googleapis.com/drive/v2/files');	
				xhr.setRequestHeader("Content-type", "application/json");
			    xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
			    Alloy.Globals.Log("alloy.js::json post: "+jsonpost);
				xhr.send(jsonpost);					
			} else {
				//STAMP:: the folder SID into memory for additional use.
				var sid = fileexistjsonlist.items[0].id;
				Alloy.Globals.Log("Alloy.Globals.createCoreInitialCoreFolderandSS::dir exists, then stamp: Titanium.App.Properties.setString("+foldername+","+sid+"); sid is: "+sid);
				eval("Titanium.App.Properties.setString(\""+foldername+"\",sid)");
				Alloy.Globals.Log("Alloy.Globals.createCoreInitialCoreFolderandSS::dir exists, AFTER stamp: "+eval("Titanium.App.Properties.getString(\""+foldername+"\")"));
				//TODO: find the underneath file
				Alloy.Globals.Log("Alloy.Globals.createCoreInitialCoreFolderandSS::check endernearth core files: Alloy.Globals.stampSIDFromCoreFilenameGroupOnInitialLogin("+foldername+");");
				Alloy.Globals.stampSIDFromCoreFilenameGroupOnInitialLogin(foldername);
			}	
		}
	});
	var rawquerystring1 = '?q=title+%3D+\''+foldername+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.folder\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Cparents%2Ctitle)';	
	xhr1.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring1);
	xhr1.setRequestHeader("Content-type", "application/json");
	xhr1.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr1.send();		
};



Alloy.Globals.locateIndexCreateSpreadsheet = function(name,name_dir_sid){
		var jsonlist = " ";
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var jsonlist = JSON.parse(this.responseText);
	    		Alloy.Globals.Log("Alloy.Globals.locateIndexCreateSpreadsheet::response of jsonlist is: "+JSON.stringify(jsonlist));
	    		var sid = jsonlist.items[0].id;;	
	    	} catch(e){
				Alloy.Globals.Log("Alloy.Globals.locateIndexCreateSpreadsheet::cathing e: "+JSON.stringify(e));
			}
			Alloy.Globals.Log("alloy.js::Alloy.Globals.locateIndexCreateSpreadsheet::jsonlist.items.length: "+jsonlist.items.length);
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("alloy.js::Alloy.Globals.locateIndexCreateSpreadsheet::File, "+filename+", DOES NOT EXIST");
				var fileexist = "false";
				Titanium.App.Properties.setString("status","failed"); 	
			} else {
				var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
				var emailid = Titanium.App.Properties.getString('emailid');
				Alloy.Globals.Log("alloy.js::Alloy.Globals.locateIndexCreateSpreadsheet::emailid: "+emailid+" vs kraniemailid: "+kraniemailid);
				if ( Titanium.App.Properties.getString("sharedkraniemailid") ) {
	 				Alloy.Globals.Log("alloy.js::Alloy.Globals.locateIndexCreateSpreadsheet::sharedkraniemailid exists: " +Titanium.App.Properties.getString("sharedkraniemailid")+" kraniemailid: "+kraniemailid);
					Alloy.Globals.Log("Alloy.Globals.setTiPropFromSS("+sid+")");
					Alloy.Globals.setTiPropFromSS(sid);
					//alert("could not find data for "+kraniemailid+" in the cloud.");
				} else {
					Alloy.Globals.Log("alloy.js::Alloy.Globals.locateIndexCreateSpreadsheet::NO sharedkraniemailid. kraniemailid: "+kraniemailid+":  emailid: "+emailid);
					var fileexist = "true";
					var indexsid = jsonlist.items[0].id; Titanium.App.Properties.setString("indexsid",indexsid);
					var parentid = jsonlist.items[0].parents[0].id; Titanium.App.Properties.setString("parentid",parentid);
					Alloy.Globals.Log("alloy.js::Alloy.Globals.locateIndexCreateSpreadsheet::File exist. indexsid is: "+indexsid+" parentid:"+parentid);
					// Create Credit and Debit START
					var corefilenamearray = ["project","client","invoice","inventory","proposal","master","schedule","labor","joblog"];	
					for (i=0;i<corefilenamearray.length;i++){	
						var filename = corefilenamearray[i];	
						Alloy.Globals.Log("alloy.js::check if ss with filename: "+filename+" exists ");
						Alloy.Globals.createCoreInitialCoreFolderandSS(name,filename,parentid,indexsid);		
					}
					Titanium.App.Properties.setString("status","passed");
				}

			};
		}
		});
	xhr.onerror = function(e){
		alert("error:"+e.code+": Unable to pull data from cloud."); 
		Alloy.Globals.Log("alloy.js::locateIndexCreateSpreadsheet:: error is: "+JSON.stringify(e));
		Alloy.Globals.Status ="failed";
		Titanium.App.Properties.setString("status","failed");
		Alloy.Globals.googleAuthSheet.authorize();	
	};
	var filename = name+"_index";
	if (name_dir_sid) {
		var rawquerystring = '?q=title+%3D+\''+filename+'\'+and+\''+name_dir_sid+'\'+in+parents+and+mimeType+%3D+\'application%2Fvnd.google-apps.spreadsheet\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Cparents%2Ctitle)';
	} else {
		var rawquerystring = '?q=title+%3D+\''+filename+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.spreadsheet\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Cparents%2Ctitle)';
	}
	Alloy.Globals.Log("alloy.js::Alloy.Globals.locateIndexCreateSpreadsheet: get rawquerystring is: "+rawquerystring);
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
	Alloy.Globals.Log("alloy.js::::JSON.stringify(Alloy.Globals.Status) :"+JSON.stringify(Alloy.Globals.Status)+" Titanium.App.Properties.getString(\"status\"): " +Titanium.App.Properties.getString("status"));	
};

//check initial folder exist after login
Alloy.Globals.checkInitialFolderExistAfterLogin = function(name,parentid){
	var foldername = name+"_dir";
		var xhr0 = Ti.Network.createHTTPClient({
			onload: function(e) {
			    try {
		    		var jsonlist = JSON.parse(this.responseText);
		    		Alloy.Globals.Log("Alloy.Globals.checkInitialFolderExistAfterLogin::response of jsonlist is: "+JSON.stringify(jsonlist));	
		    	} catch(e){
					Alloy.Globals.Log("Alloy.Globals.checkInitialFolderExistAfterLogin::cathing e: "+JSON.stringify(e));
				}
			Alloy.Globals.Log("alloy.js::Alloy.Globals.checkInitialFolderExistAfterLogin::jsonlist.items.length: "+jsonlist.items.length);
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("alloy.js::Alloy.Globals.checkInitialFolderExistAfterLogin:: Folder "+foldername+" does not exist, will create one.");
				//Create folder if it does not yet exist
				Alloy.Globals.Log("alloy.js::create folder with folder: "+foldername+" and parentid: "+parentid);
				var jsonpost = '{'
					 +'\"title\": \"'+foldername+'\",'
					 +'\"parents\": ['
					  +'{'
					   +'\"id\": \"'+parentid+'\"'
					 +' }'
					 +'],'
					 +'\"mimeType\": \"application/vnd.google-apps.folder\",'
					 +'\"shared\": \"false\"'
					+'}';
				var xhr = Ti.Network.createHTTPClient({
				    onload: function(e) {
				    try {
				    		Alloy.Globals.Log("Alloy.Globals.checkInitialFolderExistAfterLogin::response is: "+this.responseText);
				    		var json = JSON.parse(this.responseText);
				    		var sid = json.id;
				    		///Alloy.Globals.populatesidtoDB(foldername,sid);
				    		Titanium.App.Properties.setString('sid',sid);
				    		///Alloy.Globals.Log("alloy.js::sid : "+sid+" setting it to private ");
				    		///Alloy.Globals.setPrivate(sid);
				    		var ssindexname = name+"_index";  		
				    		Alloy.Globals.createSpreadsheet2(ssindexname,sid,"yes");
				    	} catch(e){
							Alloy.Globals.Log("Alloy.Globals.checkInitialFolderExistAfterLogin::cathing e: "+JSON.stringify(e));
						}
					}
				});
				xhr.onerror = function(e){
					alert("error:"+e.code+": Please connect to the network."); 
					Alloy.Globals.Log("alloy::checkInitialFolderExistAfterLogin::Unable to checkInitialFolderExistAfterLogin with "+foldername+". error is: "+JSON.stringify(e));
				};
				xhr.open("POST", 'https://www.googleapis.com/drive/v2/files');	
				xhr.setRequestHeader("Content-type", "application/json");
			    xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
			    Alloy.Globals.Log("alloy.js::json post: "+jsonpost);
				xhr.send(jsonpost);				
			} else {
				Alloy.Globals.Log("alloy.js::Alloy.Globals.checkInitialFolderExistAfterLogin:: Folder "+foldername+" ALREADY EXIST, SKIPPED.");
				Alloy.Globals.locateIndexCreateSpreadsheet(name);
				
				}			
			}
		});
		xhr0.onerror = function(e){
			alert("error:"+e.code+": Please connect to the network."); 
			Alloy.Globals.Log("alloy::checkFolderexist::Unable to checkInitialFolderExistAfterLogin with "+foldername+" error code is: "+JSON.stringify(e));
		};	
	var rawquerystring = '?q=title+%3D+\''+foldername+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.folder\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Cparents%2Ctitle)';
	xhr0.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
	xhr0.setRequestHeader("Content-type", "application/json");
    xhr0.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr0.send();
};


//Create Initial folder and index file if it does not yet exist. If Exist, create other files.
Alloy.Globals.createInitialFolder = function(name,parentid){
	var foldername = name+"_dir";
	Alloy.Globals.Log("Alloy.Globals.createInitialFolder("+name+","+parentid+") with foldername: "+foldername);
		var xhr0 = Ti.Network.createHTTPClient({
			onload: function(e) {
			    try {
		    		var jsonlist = JSON.parse(this.responseText);
		    		Alloy.Globals.Log("Alloy.Globals.createInitialFolder::response of jsonlist is: "+JSON.stringify(jsonlist));
		    		var name_dir = jsonlist.items[0].title;
		    		var name_dir_sid = jsonlist.items[0].id;
		    		eval("Titanium.App.Properties.setString('"+name_dir+"_sid',name_dir_sid)");
		    		Alloy.Globals.Log("Alloy.Globals.createInitialFolder:: Titanium.App.Properties.getString('"+name_dir+"_sid'): "+eval("Titanium.App.Properties.getString('"+name_dir+"_sid')"));
		    	} catch(e){
					Alloy.Globals.Log("Alloy.Globals.createInitialFolder::cathing e: "+JSON.stringify(e));
				}
			Alloy.Globals.Log("alloy.js::Alloy.Globals.createInitialFolder::jsonlist.items.length: "+jsonlist.items.length);
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("alloy.js::Alloy.Globals.createInitialFolder:: Folder "+foldername+" does not exist, will create one.");
				//Create folder if it does not yet exist
				Alloy.Globals.Log("alloy.js:Alloy.Globals.createInitialFolder:create folder with folder: "+foldername+" and parentid: "+parentid);
				var jsonpost = '{'
					 +'\"title\": \"'+foldername+'\",'
					 +'\"parents\": ['
					  +'{'
					   +'\"id\": \"'+parentid+'\"'
					 +' }'
					 +'],'
					 +'\"mimeType\": \"application/vnd.google-apps.folder\",'
					 +'\"shared\": \"false\"'
					+'}';
				var xhr = Ti.Network.createHTTPClient({
				    onload: function(e) {
				    try {
				    		Alloy.Globals.Log("Alloy.Globals.createInitialFolder::response is: "+this.responseText);
				    		var json = JSON.parse(this.responseText);
				    		var sid = json.id;
				    		///Alloy.Globals.populatesidtoDB(foldername,sid);
				    		Titanium.App.Properties.setString('sid',sid);
				    		///Alloy.Globals.Log("alloy.js::sid : "+sid+" setting it to private ");
				    		///Alloy.Globals.setPrivate(sid);
				    		var ssindexname = name+"_index";  		
				    		Alloy.Globals.createSpreadsheet2(ssindexname,sid,"yes");
				    	} catch(e){
							Alloy.Globals.Log("Alloy.Globals.createInitialFolder::cathing e: "+JSON.stringify(e));
						}
					}
				});
				xhr.onerror = function(e){
					alert("error:"+e.code+": Please connect to the network."); 
					Alloy.Globals.Log("alloy::Alloy.Globals.createInitialFolder::Unable to createInitialFolder with "+foldername+" error is: "+JSON.stringify(e));
				};
				xhr.open("POST", 'https://www.googleapis.com/drive/v2/files');	
				xhr.setRequestHeader("Content-type", "application/json");
			    xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
			    Alloy.Globals.Log("alloy.js:Alloy.Globals.createInitialFolder:json post: "+jsonpost);
				xhr.send(jsonpost);				
			} else {
				Alloy.Globals.Log("alloy.js::Alloy.Globals.createInitialFolder:: Folder "+foldername+" ALREADY EXIST, SKIPPED.");
				Alloy.Globals.locateIndexCreateSpreadsheet(name,name_dir_sid); //index found, create folder and spreadsheet
				
				}			
			}
		});
		xhr0.onerror = function(e){
			alert("error:"+e.code+": Please connect to the network."); 
			Alloy.Globals.Log("alloy::checkFolderexist::Unable to createInitialFolder with "+foldername+" error is: "+JSON.stringify(e));
		};	
	//var rawquerystring = '?q=title+%3D+\''+foldername+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.folder\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Cparents%2Ctitle)';
	var rawquerystring = '?q=title+%3D+\''+foldername+'\'+and+\''+parentid+'\'+in+parents+and+mimeType+%3D+\'application%2Fvnd.google-apps.folder\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Cparents%2Ctitle)';
	xhr0.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
	xhr0.setRequestHeader("Content-type", "application/json");
    xhr0.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr0.send();
};

/* Alloy.Globals.initialUserSetup: BEFORE KRANIEMAILID = EMAILID
Alloy.Globals.initialUserSetup = function(e){
			var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    try {
		    		var json = JSON.parse(this.responseText);
		    		Alloy.Globals.Log("Alloy.Globals.initialUserSetup::response is: "+JSON.stringify(json));
		    		var emailid = json.email;
		    		if ( Titanium.App.Properties.getString('kraniemailid') && Titanium.App.Properties.getString('kraniemailid') != emailid ){
						   var kraniemailid = Titanium.App.Properties.getString('kraniemailid'); //this is shared account. dont create dir.
						   Alloy.Globals.Log("alloy:Alloy.Globals.initialUserSetup: kraniemailid exists: "+kraniemailid);
		    		} else {
		    			Alloy.Globals.Log("alloy:Alloy.Globals.initialUserSetup: kraniemailid DOES NOT EXIST: ");
		    			Titanium.App.Properties.setString('kraniemailid',emailid);var kraniemailid=emailid; //this is personal account and first time. create dir.
						//create datastore START
						var name = kraniemailid.split('@')[0].trim(); //use kraniemailid for uniqueness
						Alloy.Globals.Log("advance::checkInfo: name: "+name);
						if(Alloy.Globals.license == "freeuser"){
							var kraniparentid=Titanium.App.Properties.getString("freeuser");
							} else var kraniparentid=Titanium.App.Properties.getString("paidbasic") ;
						Alloy.Globals.Log("alloy.js:createDir::  Alloy.Globals.getPrivateMasterCreateInitialFolder("+name+",yes): ");
						Alloy.Globals.getJSONOnlineCreateInitialFolder(name);
			    		Titanium.App.Properties.setString('kraniemailid',kraniemailid);
			    		Alloy.Globals.Log("main.js::args inside getEmail: kraniemailid "+kraniemailid+" :: "+JSON.stringify(e));
	    			};	    		

		    	} catch(e){
					Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
				}
				return kraniemailid;
				if (Titanium.App.Properties.getString('kraniemailid')){
		    			var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
	    		} else {Titanium.App.Properties.setString('kraniemailid',emailid);var kraniemailid=emaild;};
			}
			});
		xhr.onerror = function(e){
			Alloy.Globals.Log('main::getEmail:: unable to get info for '+e);
		};
		Alloy.Globals.Log('main::getEmail:: URL:: https://www.googleapis.com/oauth2/v1/userinfo?alt=json');
		xhr.open("GET", 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json');
		xhr.setRequestHeader("Content-type", "application/json");
	    xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
		xhr.send();
};*/

Alloy.Globals.initialUserSetup = function(e){
			var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    try {
		    		var json = JSON.parse(this.responseText);
		    		Alloy.Globals.Log("Alloy.Globals.initialUserSetup::response is: "+JSON.stringify(json));
		    		var emailid = json.email;
		    		if (Titanium.App.Properties.getString('kraniemailid')) {
		    			var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
		    		} else {		    			
		    			Titanium.App.Properties.setString('kraniemailid',emailid);var kraniemailid=emailid;
		    			Alloy.Globals.Log("alloy:Alloy.Globals.initialUserSetup: kraniemailid DOES NOT EXIST: set to: "+emailid);
						Titanium.App.Properties.setString('kraniemailid',kraniemailid);
			    		
		    		};   
					//create datastore START
					var name = kraniemailid.split('@')[0].trim(); //use kraniemailid for uniqueness
					//TODO: freeuser, paiduser, premium user.
					if(Alloy.Globals.license == "freeuser"){
						var kraniparentid=Titanium.App.Properties.getString("freeuser");
						} else var kraniparentid=Titanium.App.Properties.getString("paidbasic") ;
					Alloy.Globals.Log("alloy:Alloy.Globals.initialUserSetup:Alloy.Globals.getJSONOnlineCreateInitialFolder("+name+")");
					Alloy.Globals.getJSONOnlineCreateInitialFolder(name);
					Alloy.Globals.Log("alloy:Alloy.Globals.initialUserSetup: kraniemailid "+kraniemailid+" :: "+JSON.stringify(e));			    		 		
		    	} catch(e){
					Alloy.Globals.Log("alloy:Alloy.Globals.initialUserSetup:cathing e: "+JSON.stringify(e));
				}
				return kraniemailid;
				if (Titanium.App.Properties.getString('kraniemailid')){
		    			var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
	    		} else {Titanium.App.Properties.setString('kraniemailid',emailid);var kraniemailid=emaild;};
			}
			});
		xhr.onerror = function(e){
			Alloy.Globals.Log('main::getEmail:: unable to get info for '+e);
		};
		Alloy.Globals.Log('main::getEmail:: URL:: https://www.googleapis.com/oauth2/v1/userinfo?alt=json');
		xhr.open("GET", 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json');
		xhr.setRequestHeader("Content-type", "application/json");
	    xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
		xhr.send();
};

Alloy.Globals.getPrivateMasterCreateInitialFolder = function(name,needcreateinitialfolder) {
	Alloy.Globals.Log("alloy.js::executing Alloy.Globals.getPrivateMasterCreateInitialFolder");	
	var data = [];
	var maxdebug = Titanium.App.Properties.getInt('maxdebug');
	var mindebug = Titanium.App.Properties.getInt('mindebug');
	var url = "https://spreadsheets.google.com/feeds/list/"+bootstrapid+"/od6/private/full";
	var thefile = "gss"+bootstrapid+".xml";
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
			var xml = Titanium.XML.parseString(this.responseText);
			if(maxdebug==1){Alloy.Globals.Log("alloy.js::getPrivateMasterCreateInitialFolder:: response txt is: "+this.responseText);};
			if(maxdebug==1){Alloy.Globals.Log("alloy.js::getPrivateMasterCreateInitialFolder:: this xml is: " +xml);	};   
			var feed = xml.documentElement.getElementsByTagName("feed");
			var entry = xml.documentElement.getElementsByTagName("entry"); 
			(mindebug == 1) && Alloy.Globals.Log("alloy.js::this entry length is: " +entry.length);
			for (i=0;i<entry.length;i++){
				var col1 = entry.item(i).getElementsByTagName("gsx:col1").item(0).text;
				var col2 = entry.item(i).getElementsByTagName("gsx:col2").item(0).text;
				var col3 = entry.item(i).getElementsByTagName("gsx:col3").item(0).text;
				var idtag = entry.item(i).getElementsByTagName("id").item(0).text.replace(':','yCoLoNy');
				var link = entry.item(i).getElementsByTagName("link");
				if(col1 && col2){
					eval("Titanium.App.Properties.setString(\""+col1+"\",col2)");
					if(col1=="freeuser"){var freeusersid=col2;Titanium.App.Properties.setString("freeuser",freeusersid); };
					if(col1=="paiduser"){var paidusersid=col2; Titanium.App.Properties.setString("paiduser",paidusersid);};
					if(col1=="paidbasic"){var paidbasicsid=col2; Titanium.App.Properties.setString("paidbasic",paidbasicsid);};
					if(col1=="paidpremium"){var paidpremiumsid=col2;Titanium.App.Properties.setString("paidpremium",paidpremiumsid);};
					if(col1=="paidunlimited"){var paidunlimited=col2;Titanium.App.Properties.setString("paidunlimited",paidunlimited);};
					Alloy.Globals.Log("alloy::getMaster:: Titanium.App.Properties.getString("+col1+"): "+eval("Titanium.App.Properties.getString(col1)"));
					//Alloy.Globals.Log("alloy::getMaster:: Titanium.App.Properties.getString(freeuser): "+Titanium.App.Properties.getString("freeuser"));						
				}	
				for (y=0;y<link.length;y++){			
	    			var listitem = link.item(y);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href").replace(':','yCoLoNy');}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href").replace(':','yCoLoNy');}
    			}
			}
			if(needcreateinitialfolder="yes"){
				var parentid = eval("Titanium.App.Properties.getString(Alloy.Globals.license)"); //create initial folder based on license.
				Alloy.Globals.Log("Alloy.Globals.getPrivateMasterCreateInitialFolder:: create InitialFolder based on license: "+Alloy.Globals.license+" Titanium.App.Properties.getString("+Alloy.Globals.license+"): "+parentid);
				Alloy.Globals.createInitialFolder(name,parentid);
			}
			Alloy.Globals.Log(" Alloy.Globals.getPrivateMasterCreateInitialFolder:Data were successfuly downloaded from "+url+". Please proceed.");
			} catch(e){
				Alloy.Globals.Log("Alloy.Globals.getPrivateMasterCreateInitialFolder:: cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.onerror = function(e){
		//alert(e);
		Alloy.Globals.Log("alloy.js::Alloy.Globals.getPrivateMasterCreateInitialFolder::Unable to connect to the network.url: "+url+" with error: "+JSON.stringify(e));
	};
	xhr.open("GET", url);
	xhr.send();
};




Alloy.Globals.getMasterAllowance = function() {
	var bootstrapid =  "1mcGGarLWUy83OXdexMili5ghQ-sGBkJFSMZysU8vF-k";
	var url="https://spreadsheets.google.com/feeds/list/"+bootstrapid+"/od6/public/basic?hl=en_US&alt=json";
	var xhr = Ti.Network.createHTTPClient({
		    onload: function(ee) {
			    	json = JSON.parse(this.responseText);
			    	Alloy.Globals.Log("Alloy.Globals.updateType : this.responseText: "+this.responseText);
			    	Alloy.Globals.Log("Alloy.Globals.updateType : json: "+json);
			    	var out = '{ "poi" : ['+"\n";
			    	for (var i=0; i < json.feed.entry.length; i++) {
			    		var col1 = json.feed.entry[i].title.$t.trim();
						var col2= json.feed.entry[i].content.$t.split(',')[0].split(':')[1].trim() || "none";
						if(col1 && col2){
							eval("Titanium.App.Properties.setString(\""+col1+"\",col2)");
							if(col1=="publicrepo"){Titanium.App.Properties.setString("publicrepo",col2); };
							if(col1=="privaterepo"){Titanium.App.Properties.setString("privaterepo",col2);};
							if(col1=="userindex1"){Titanium.App.Properties.setString("userindex1",col2);};
							Alloy.Globals.Log("alloy::getMaster:: Titanium.App.Properties.getString("+col1+"): "+eval("Titanium.App.Properties.getString(col1)"));
							Alloy.Globals.Log("alloy::getMaster:: Titanium.App.Properties.getString(publicrepo): "+Titanium.App.Properties.getString("publicrepo"));						}						
						if ( i == (json.feed.entry.length - 1)) {
							out += '{ "col1" : "'+col1+'" , "col2" : "'+col2+'" }]}'+"\n";
						} else {
							out += '{ "col1" : "'+col1+'" , "col2" : "'+col2+'" },'+"\n";
						}
			    	}
					Alloy.Globals.writeFile(out,"master.json");
					var json = out;		    
			}	
		});	
		Alloy.Globals.Log("alloy::getMaster:url :"+url);		
		xhr.open("GET", url);
		xhr.send();
};

Alloy.Globals.getMasterAllowanceKrani = function() {
	//var bootstrapid =  "1mcGGarLWUy83OXdexMili5ghQ-sGBkJFSMZysU8vF-k"; //allowance
	//var bootstrapid =  "1XajtTX5pdo5yMM_v9cC5-hgHOFlH1n0SN9McS3qElgQ";// krani1
	var bootstrapid =  "1VYoqBhH5b9lVTnpjiXUikFJ51HzNj-6rPGQ_eNIRQ84"; //krani2
	var url="https://spreadsheets.google.com/feeds/list/"+bootstrapid+"/od6/public/basic?hl=en_US&alt=json";
	var xhr = Ti.Network.createHTTPClient({
		    onload: function(ee) {		    	
			    	Alloy.Globals.Log("Alloy.Globals.updateType : this.responseText: "+this.responseText);
			    	json = JSON.parse(this.responseText);
			    	Alloy.Globals.Log("Alloy.Globals.updateType : json: "+json);
			    	var out = '{ "poi" : ['+"\n";
			    	for (var i=0; i < json.feed.entry.length; i++) {
			    		var col1 = json.feed.entry[i].title.$t.trim();
						var col2= json.feed.entry[i].content.$t.split(',')[0].split(':')[1].trim() || "none";
						if(col1 && col2){
							eval("Titanium.App.Properties.setString(\""+col1+"\",col2)");
							if(col1=="publicrepo"){Titanium.App.Properties.setString("publicrepo",col2); };
							if(col1=="privaterepo"){Titanium.App.Properties.setString("privaterepo",col2);};
							if(col1=="userindex1"){Titanium.App.Properties.setString("userindex1",col2);};
							Alloy.Globals.Log("alloy::getMaster:: Titanium.App.Properties.getString("+col1+"): "+eval("Titanium.App.Properties.getString(col1)"));
							//Alloy.Globals.Log("alloy::getMaster:: Titanium.App.Properties.getString(publicrepo): "+Titanium.App.Properties.getString("publicrepo"));						
							}						
						if ( i == (json.feed.entry.length - 1)) {
							out += '{ "col1" : "'+col1+'" , "col2" : "'+col2+'" }]}'+"\n";
						} else {
							out += '{ "col1" : "'+col1+'" , "col2" : "'+col2+'" },'+"\n";
						}
			    	}
					Alloy.Globals.writeFile(out,"master.json");
					var json = out;		    
			}	
		});	
		Alloy.Globals.Log("alloy::getMaster:url :"+url);		
		xhr.open("GET", url);
		xhr.send();
};


Alloy.Globals.getMasterCreateInitialFolder = function(name,needcreateinitialfolder) {
	var url="https://spreadsheets.google.com/feeds/list/"+bootstrapid+"/od6/public/basic?hl=en_US&alt=json";
	var xhr = Ti.Network.createHTTPClient({
		    onload: function(ee) {
			    	json = JSON.parse(this.responseText);
			    	Alloy.Globals.Log("Alloy.Globals.updateType : this.responseText: "+this.responseText);
			    	Alloy.Globals.Log("Alloy.Globals.updateType : json: "+json);
			    	var out = '{ "poi" : ['+"\n";
			    	for (var i=0; i < json.feed.entry.length; i++) {
			    		var col1 = json.feed.entry[i].title.$t.trim();
						var col2= json.feed.entry[i].content.$t.split(',')[0].split(':')[1].trim() || "none";
						if(col1 && col2){
							eval("Titanium.App.Properties.setString(\""+col1+"\",col2)");
							if(col1=="publicrepo"){Titanium.App.Properties.setString("publicrepo",col2); };
							if(col1=="privaterepo"){Titanium.App.Properties.setString("privaterepo",col2);};
							if(col1=="userindex1"){Titanium.App.Properties.setString("userindex1",col2);};
							Alloy.Globals.Log("alloy::getMaster:: Titanium.App.Properties.getString("+col1+"): "+eval("Titanium.App.Properties.getString(col1)"));
							//Alloy.Globals.Log("alloy::getMaster:: Titanium.App.Properties.getString(publicrepo): "+Titanium.App.Properties.getString("publicrepo"));						
							}						
						if ( i == (json.feed.entry.length - 1)) {
							out += '{ "col1" : "'+col1+'" , "col2" : "'+col2+'" }]}'+"\n";
						} else {
							out += '{ "col1" : "'+col1+'" , "col2" : "'+col2+'" },'+"\n";
						}
			    	}
					Alloy.Globals.writeFile(out,"master.json");
					var json = out;		
					if(needcreateinitialfolder="yes"){
						var parentid = eval("Titanium.App.Properties.getString(Alloy.Globals.license)"); //create initial folder based on license.
						Alloy.Globals.Log("Alloy.Globals.getPrivateMasterCreateInitialFolder:: create InitialFolder based on license: "+Alloy.Globals.license+" Titanium.App.Properties.getString("+Alloy.Globals.license+"): "+parentid);
						Alloy.Globals.createInitialFolder(name,parentid);
					}	    
			}	
		});	
		Alloy.Globals.Log("alloy::getMasterCreateInitialFolder:url :"+url);		
		xhr.open("GET", url);
		xhr.send();
};

Alloy.Globals.getJSONOnline = function(e){
	var url=jsonhosting;
	var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {		    	
			    	Alloy.Globals.Log("Alloy.Globals.getJSONOnline : this.responseText: "+this.responseText);
			    	var json = JSON.parse(this.responseText);
			    	//var json = this.responseText;
			    	Alloy.Globals.Log("Alloy.Globals.getJSONOnline : json: "+json);
			    	var out = '{ "bootstrap" : ['+"\n";
			    	for (var i=0; i < json.poi.length; i++) {
			    		var col1 = json.poi[i].col1;
						var col2= json.poi[i].col2 || "none";
						if(col1 && col2){
							eval("Titanium.App.Properties.setString(\""+col1+"\",col2)");
							if(col1=="publicrepo"){Titanium.App.Properties.setString("publicrepo",col2); };
							if(col1=="privaterepo"){Titanium.App.Properties.setString("privaterepo",col2);};
							if(col1=="userindex1"){Titanium.App.Properties.setString("userindex1",col2);};
							Alloy.Globals.Log("alloy::getJSONOnline:: Titanium.App.Properties.getString("+col1+"): "+eval("Titanium.App.Properties.getString(col1)"));
							//Alloy.Globals.Log("alloy::getMaster:: Titanium.App.Properties.getString(publicrepo): "+Titanium.App.Properties.getString("publicrepo"));						
							}						
						if ( i == (json.poi.length - 1)) {
							out += '{ "col1" : "'+col1+'" , "col2" : "'+col2+'" }]}'+"\n";
						} else {
							out += '{ "col1" : "'+col1+'" , "col2" : "'+col2+'" },'+"\n";
						}
			    	}
					Alloy.Globals.writeFile(out,"master.json");
					var json = out;		    
			}	
		});	
		Alloy.Globals.Log("alloy::getMaster:url :"+url);		
		xhr.open("GET", url);
		xhr.send();
};

Alloy.Globals.getJSONOnlineCreateInitialFolder = function(name){
	var url=jsonhosting; //krani corp
	var xhr = Ti.Network.createHTTPClient({
		    onload: function() {		    	
			    	Alloy.Globals.Log("Alloy.Globals.getJSONOnlineCreateInitialFolder : this.responseText: "+this.responseText);
			    	var json = JSON.parse(this.responseText);
			    	//var json = this.responseText;
			    	Alloy.Globals.Log("Alloy.Globals.getJSONOnlineCreateInitialFolder : json: "+json);
			    	var out = '{ "bootstrap" : ['+"\n";
			    	for (var i=0; i < json.poi.length; i++) {
			    		var col1 = json.poi[i].col1;
						var col2= json.poi[i].col2 || "none";
						if(col1 && col2){
							eval("Titanium.App.Properties.setString(\""+col1+"\",col2)");
							Alloy.Globals.Log("alloy::getJSONOnlineCreateInitialFolder:: Titanium.App.Properties.getString("+col1+"): "+eval("Titanium.App.Properties.getString(col1)"));
							//Alloy.Globals.Log("alloy::getMaster:: Titanium.App.Properties.getString(publicrepo): "+Titanium.App.Properties.getString("publicrepo"));						
							}						
						if ( i == (json.poi.length - 1)) {
							out += '{ "col1" : "'+col1+'" , "col2" : "'+col2+'" }]}'+"\n";
						} else {
							out += '{ "col1" : "'+col1+'" , "col2" : "'+col2+'" },'+"\n";
						}
			    	}
					Alloy.Globals.writeFile(out,"master.json");
					var json = out;
					//create initial folder
					var parentid = eval("Titanium.App.Properties.getString(Alloy.Globals.license)"); //create initial folder based on license.
					Alloy.Globals.Log("Alloy.Globals.getJSONOnlineCreateInitialFolder:: create InitialFolder based on license: "+Alloy.Globals.license+" Titanium.App.Properties.getString("+Alloy.Globals.license+"): "+parentid);
					Alloy.Globals.createInitialFolder(name,parentid);		    
			}	
		});	
		Alloy.Globals.Log("alloy::getJSONOnlineCreateInitialFolder:url :"+url);		
		xhr.open("GET", url);
		xhr.send();
};

Alloy.Globals.stampSIDFromCoreFilename = function(filename){
		var jsonlist = " ";
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var jsonlist = JSON.parse(this.responseText);
	    		Alloy.Globals.Log("Alloy.Globals.stampSIDFromCoreFilename::response of jsonlist is: "+JSON.stringify(jsonlist));
	    	} catch(e){
				Alloy.Globals.Log("stampSIDFromCoreFilename::cathing e: "+JSON.stringify(e));
			}
			Alloy.Globals.Log("alloy.js::Alloy.Globals.stampSIDFromCoreFilename::jsonlist.items.length: "+jsonlist.items.length);
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("alloy.js::stampSIDFromCoreFilename::File DOES NOT EXIST");
				var fileexist = "false";
				var emailid = Titanium.App.Properties.getString('emailid');
				var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
				if ( emailid == kraniemailid ) {
					Alloy.Globals.Log("alloy.js::stampSIDFromCoreFilename::emailid is the same: execute SS creation ");
					Alloy.Globals.createSpreadsheet(filename);  // create file when does not exists
					Titanium.App.Properties.setString(filename,sid); // stamp the ssid.
					//TODO:Locateindex
					var name = kraniemailid.split('@')[0].trim(); //use kraniemailid for uniqueness
					Alloy.Globals.Log("Alloy.Globals.stampSIDFromCoreFilename::Alloy.Globals.getJSONOnlineCreateInitialFolder('"+name+"')");
					Alloy.Globals.getJSONOnlineCreateInitialFolder(name); // refresh user
				} else {
					Alloy.Globals.Log("alloy.js::stampSIDFromCoreFilename::emailid is NOT the same: emailid : "+emailid+" vs. kraniemailid:  "+kraniemailid);
				}				
			} else {
				var fileexist = "true";
				var sid = jsonlist.items[0].id;
				var item=filename.replace(/list$/g,"").replace(/^.*_/g,"");
				Alloy.Globals.Log("alloy.js::Alloy.Globals.stampSIDFromCoreFilename::File exist. filename/sid is: "+jsonlist.items[0].title+"/"+jsonlist.items[0].id+" Skipped.");
				Titanium.App.Properties.setString(item,sid);
				Alloy.Globals.Log("alloy.js::Alloy.Globals.stampSIDFromCoreFilename::File exist: sid from Titanium.App.Properties.getString("+item+"); "+eval("Titanium.App.Properties.getString(item)"));
			};
		}
		});
	xhr.onerror = function(e){
		alert("error:"+e.code+": Please connect to the network."); 
		Alloy.Globals.Log("alloy.js::checkFileExistThenCreateSS:: Unable to connect to the cloud.");
	};
	var rawquerystring = '?q=title+%3D+\''+filename+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.spreadsheet\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Ctitle)';
	Alloy.Globals.Log("alloy.js::Alloy.Globals.stampSIDFromCoreFilename:: URL:: https://www.googleapis.com/drive/v2/files"+rawquerystring);
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};

Alloy.Globals.stampSIDFromCoreDirname = function(dirname){
		var jsonlist = " ";
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var jsonlist = JSON.parse(this.responseText);
	    		Alloy.Globals.Log("Alloy.Globals.stampSIDFromCoreDirname::response of jsonlist is: "+JSON.stringify(jsonlist));
	    	} catch(e){
				Alloy.Globals.Log("stampSIDFromCoreDirname::cathing e: "+JSON.stringify(e));
			}
			Alloy.Globals.Log("alloy.js::Alloy.Globals.stampSIDFromCoreDirname::jsonlist.items.length: "+jsonlist.items.length);
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("alloy.js::stampSIDFromCoreDirname::File DOES NOT EXIST");
				var fileexist = "false";
				//Alloy.Globals.createSpreadsheet(dirname);  // create file when does not exists
				//Titanium.App.Properties.setString(dirname,sid); // stamp the ssid.
			} else {
				var fileexist = "true";
				var sid = jsonlist.items[0].id;
				Alloy.Globals.Log("alloy.js::Alloy.Globals.stampSIDFromCoreDirname::File exist. filename/sid is: "+jsonlist.items[0].title+"/"+jsonlist.items[0].id+" Skipped.");
				Titanium.App.Properties.setString(dirname,sid);
				Alloy.Globals.Log("alloy.js::Alloy.Globals.stampSIDFromCoreDirname::File exist: sid from Titanium.App.Properties.getString("+dirname+"); "+eval("Titanium.App.Properties.getString(dirname)"));
			};
		}
		});
	xhr.onerror = function(e){
		alert("error:"+e.code+": Please connect to the network."); 
		Alloy.Globals.Log("alloy.js::checkFileExistThenCreateSS:: Unable to connect to the cloud.");
	};
	var rawquerystring = '?q=title+%3D+\''+dirname+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.folder\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Ctitle)';
	Alloy.Globals.Log("alloy.js::Alloy.Globals.stampSIDFromCoreDirname:: URL:: https://www.googleapis.com/drive/v2/files"+rawquerystring);
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};

Alloy.Globals.stampSIDFromCoreFilenameGroup = function(emailid){
	for (i=0;i<Alloy.Globals.corefilenamearray.length;i++){
		var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
		var name = kraniemailid.split('@')[0].trim();
		var newfilename = name+"_"+Alloy.Globals.corefilenamearray[i]+"list";
		Alloy.Globals.Log("alloy.js::Alloy.Globals.stampSIDFromCoreFilenameGroup:: Alloy.Globals.stampSIDFromCoreFilename("+newfilename+"); ");
		Alloy.Globals.stampSIDFromCoreFilename(newfilename);
	}
};

Alloy.Globals.stampSIDFromCoreFilenameGroupOnInitialLogin = function(dirname){
		var newfilename = dirname+"list";
		Alloy.Globals.Log("alloy.js::Alloy.Globals.stampSIDFromCoreFilenameGroupOnInitialLogin:: Alloy.Globals.stampSIDFromCoreFilename("+newfilename+"); ");
		Alloy.Globals.stampSIDFromCoreFilename(newfilename);
};

Alloy.Globals.loginActivity = function(e){
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var json = JSON.parse(this.responseText);
	    		Alloy.Globals.Log("response is: "+JSON.stringify(json));
	    		var emailid = json.email;
	    		Titanium.App.Properties.setString('emailid',emailid);
	    		if (Titanium.App.Properties.getString('kraniemailid')){
		    			var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
		    		} else {Titanium.App.Properties.setString('kraniemailid',emailid);var kraniemailid=emaild;};
	    		Alloy.Globals.Log("tabViewOne.js::args inside getEmail: emailid "+emailid+" :: "+JSON.stringify(e));
	    		Alloy.Globals.getJSONOnline(); //Initial initiation information. 
	    		var t=0;
				for (i=0;i<Alloy.Globals.corefilenamearray.length;i++){
					var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
					var name = kraniemailid.split('@')[0].trim();
					//var name = emailid.split('@')[0].trim();
					var newfilename = name+"_"+Alloy.Globals.corefilenamearray[i]+"list";
					var newdirname = name+"_"+Alloy.Globals.corefilenamearray[i];
					Alloy.Globals.Log("alloy.js::Alloy.Globals.loginActivity:Alloy.Globals.stampSIDFromCoreFilename("+newfilename+") at "+t+" ms; Alloy.Globals.stampSIDFromCoreDirname("+newdirname+") at "+t+" ms; ");
					setTimeout(function(){Alloy.Globals.stampSIDFromCoreDirname(newdirname);},t);
					setTimeout(function(){Alloy.Globals.stampSIDFromCoreFilename(newfilename);},t+500);
					Alloy.Globals.checkFileExistThenUpdateTitaniumProperties(name+"_defaultlogo"); //update defaultlogo webcontent links
					var t = t + 1000;
				}
	    		
	    	} catch(e){
				Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
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
};


Alloy.Globals.updateExistingSpreadsheetAndDB = function(type,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16,existingedithref,existingselfhref,idtag) 
{
	Alloy.Globals.Log("alloy.js::Alloy.Globals.updateExistingSpreadsheetAndDB::PUT on existing edit href is: "+existingedithref+' idtag :'+idtag);
	Alloy.Globals.Log("alloy.js::Alloy.Globals.updateExistingSpreadsheetAndDB:: "+type+" , "+col1+" , "+col2+" , "+col3+" , "+col4+" , "+col5+" , "+col6+" , "+col7+" , "+col8+" , "+col9+" , "+col10+" , "+col11+" , "
	+col12+" , "+col13+" , "+col14+" , "+col15+" , "+col16+" , "+existingedithref+" , "+existingselfhref+" ) ");
	var xhr =  Titanium.Network.createHTTPClient({
	    onload: function() {
	    	try {
	    		Alloy.Globals.Log("alloy.js::Alloy.Globals.updateExistingSpreadsheetAndDB: "+this.responseText);
	    		var xml = Titanium.XML.parseString(this.responseText);
	    		var entry = xml.documentElement.getElementsByTagName("entry");
	    		var link = xml.documentElement.getElementsByTagName("link");
	    		var idtag = xml.documentElement.getElementsByTagName("id").item(0).text;
	    		Alloy.Globals.Log("alloy.js::Alloy.Globals.updateExistingSpreadsheetAndDB:: number of link found: " +link+ " length: "+link.length);
	    		for (i=0;i<link.length;i++){			
	    			var listitem = link.item(i);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href");}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href");}
	    		}
	    		Titanium.App.Properties.setString('edithref',edithref);
	    		Titanium.App.Properties.setString('idtag',idtag);
	    		Titanium.App.Properties.setString('selfhref',selfhref);
	    		Alloy.Globals.Log("alloy.js::Alloy.Globals.updateExistingSpreadsheetAndDB: self href is : "+selfhref+" edit href is: "+edithref);
	    		Alloy.Globals.Log("alloy.js::Alloy.Globals.updateExistingSpreadsheetAndDB: idtag is : "+idtag);
	    		Alloy.Globals.Log(new Date()+'Alloy.Globals.updateExistingSpreadsheetAndDB::Modified & Saved Successfully!');	
	    	} catch(e){
	    		Alloy.Globals.Log("Alloy.Globals.updateExistingSpreadsheetAndDB::cathing e: "+JSON.stringify(e));
	    	}     
	    },
	    onerror: function(e) {
	    	Alloy.Globals.Log("alloy.js::Alloy.Globals.updateExistingSpreadsheetAndDB:error e: "+JSON.stringify(e));
	         alert("error:"+e.code+": Please connect to the network."); 
	    }
	});				
	xhr.open("PUT", existingedithref);
	var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
		+'<id>'+idtag+'</id>'
		+'<updated>2015-05-16T08:01:19.680Z</updated>'
		+'<category scheme=\'http://schemas.google.com/spreadsheets/2006\' term=\'http://schemas.google.com/spreadsheets/2006#list\'/>'
		+'<title type=\'text\'>'+col1+'</title>'
		+'<content type=\'text\'>col2: '+col2+', col3: '+col3+', col4: '+col4+', col5: '+col5+', col6: '+col6+', col7: '+col7
		+', col8: '+col8+', col9: '+col9+', col10: '+col10+', col11: '+col11+', col12: '+col12+', col13: '+col13+', col14: '+col14+', col15: '+col15+', col16: '+col16+'</content>'
		+'<link rel=\'self\' type=\'application/atom+xml\' href=\''+existingselfhref+'\'/>'
		+'<link rel=\'edit\' type=\'application/atom+xml\' href=\''+existingedithref+'\'/>'
		+'<gsx:col1>'+col1+'</gsx:col1><gsx:col2>'+col2+'</gsx:col2><gsx:col3>'
		+col3+'</gsx:col3><gsx:col4>'+col4+'</gsx:col4><gsx:col5>'
		+col5+'</gsx:col5><gsx:col6>'+col6+'</gsx:col6><gsx:col7>'+col7+'</gsx:col7><gsx:col8>'+col8+'</gsx:col8>'
		+'<gsx:col9>'+col9+'</gsx:col9><gsx:col10>'+col10+'</gsx:col10><gsx:col11>'+col11+'</gsx:col11><gsx:col12>'+col12+'</gsx:col12><gsx:col13>'+col13+'</gsx:col13><gsx:col14>'+col14+'</gsx:col14>'
		+'<gsx:col15>'+col15+'</gsx:col15><gsx:col16>'+col16+'</gsx:col16></entry>';
	Alloy.Globals.Log('Alloy.Globals.updateExistingSpreadsheetAndDB::xmldatastring existing to PUT: '+xmldatastring);
	/*
	type.fetch();
	Alloy.Globals.Log("alloy.js::Alloy.Globals.updateExistingSpreadsheetAndDB:: update DB with col1 :" +col1);
		type.get(col1).set({
			col1: 	col1.toString().trim(),
			col2:	col2.trim(),
			col3:	col3,
			col4:	col4,
			col5:	col5,
			col6:	col6,
			col7:	col7,
			col8:	col8,
			col9:	col9,
			col10:	col10,
			col11:	col11,
			col12:	col12,
			col13:	col13,
			col14:  col14,
			col15:	col15,
			col16:	col16
		}).save();*/
	
	xhr.setRequestHeader("Content-type", "application/atom+xml");
	xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send(xmldatastring);	
};

Alloy.Globals.deleteFile = function(sid){
	var xhr =  Titanium.Network.createHTTPClient({
    onload: function(e) {
		try {
    		Alloy.Globals.Log("Alloy.Globals.deleteFile:: this.responseText "+this.responseText); 
    		Alloy.Globals.Log(new Date()+"Alloy.Globals.deleteFile:: successfully deleted sid:  "+sid); 
    	} catch(e){
    		Alloy.Globals.Log("Alloy.Globals.deleteFile::cathing e: "+JSON.stringify(e));
    	}     
    },
    onerror: function(e) {
    	Alloy.Globals.Log("Alloy.Globals.deleteFile::::error e: "+JSON.stringify(e));
        Alloy.Globals.Log("alloy.js::Alloy.Globals.deleteFile:::Unable to communicate to the cloud. Please try again, sid: "+sid); 
    }
	});
	xhr.open("DELETE", 'https://www.googleapis.com/drive/v2/files/'+sid);
	//xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	Alloy.Globals.Log(new Date()+'::Alloy.Globals.deleteFile::done POSTed');

};


Alloy.Globals.checkFileExistThenDelete = function(filename){
		var jsonlist = " ";
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var jsonlist = JSON.parse(this.responseText);
	    		Alloy.Globals.Log("Alloy.Globals.checkFileExistThenDelete::response of jsonlist is: "+JSON.stringify(jsonlist));
	    	} catch(e){
				Alloy.Globals.Log("Alloy.Globals.checkFileExistThenDelete::cathing e: "+JSON.stringify(e));
			}
			Alloy.Globals.Log("jsonlist.items.length: "+jsonlist.items.length);
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("Alloy.Globals.checkFileExistThenDelete::File DOES NOT EXIST. Ignored");
				var fileexist = "false";
			} else {
				var fileexist = "true";
				var sid = jsonlist.items[0].id;
				Alloy.Globals.Log("Alloy.Globals.checkFileExistThenDelete:: File exist. sid is: "+jsonlist.items[0].id+" Deleting.");
				//Alloy.Globals.deleteFile(sid);
				Alloy.Globals.renameFile(sid,filename+"tobedeleted");
			};
		}
		});
	xhr.onerror = function(e){
		Alloy.Globals.Log("Alloy.Globals.checkFileExistThenDelete::error e: "+JSON.stringify(e));
	};
	var rawquerystring = '?q=title+%3D+\''+filename+'\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Ctitle)';
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};

Alloy.Globals.renameFile = function(sid,newname){
	var meta = '\{'
	+	'\"title\": \"'+newname+'\"'
	+	'\}';
	Alloy.Globals.Log("Alloy.Globals.renameFile::renaming to :"+newname+" with meta: "+meta);
	var xhr =  Titanium.Network.createHTTPClient({
    onload: function(e) {
		try {
    		Alloy.Globals.Log("Alloy.Globals.renameFile:: this.responseText "+this.responseText); 
    		Alloy.Globals.Log(new Date()+"Alloy.Globals.renameFile:: successfully deleted sid:  "+sid); 
    	} catch(e){
    		Alloy.Globals.Log("Alloy.Globals.renameFile::cathing e: "+JSON.stringify(e));
    	}     
    },
    onerror: function(e) {
    	Alloy.Globals.Log("Alloy.Globals.renameFile::::error e: "+JSON.stringify(e));
        Alloy.Globals.Log("alloy.js::Alloy.Globals.renameFile:::Unable to communicate to the cloud. Please try again, sid: "+sid); 
    }
	});
	xhr.open("PATCH", 'https://www.googleapis.com/drive/v2/files/'+sid);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send(meta);
	Alloy.Globals.Log(new Date()+'::Alloy.Globals.renameFile::done POSTed');
};

Alloy.Globals.checkFileExistThenUpdateTitaniumProperties = function(filename){
		var jsonlist = " ";
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var jsonlist = JSON.parse(this.responseText);
	    		Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateTitaniumProperties::response of jsonlist is: "+JSON.stringify(jsonlist));
	    	} catch(e){
				Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateTitaniumProperties::cathing e: "+JSON.stringify(e));
			}
			Alloy.Globals.Log("jsonlist.items.length: "+jsonlist.items.length);
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateTitaniumProperties::File DOES NOT EXIST. Ignored");
				var fileexist = "false";
			} else {
				var fileexist = "true";
				var sid = jsonlist.items[0].id;
				var webcontentlink = jsonlist.items[0].webContentLink;
				Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateTitaniumProperties:: File exist.webcontentlink: "+webcontentlink+" sid is: "+jsonlist.items[0].id+" Update Titanium Properties.");	
				Titanium.App.Properties.setString('logourl',webcontentlink);		
			};
		}
		});
	xhr.onerror = function(e){
		Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateTitaniumProperties::error e: "+JSON.stringify(e));
		Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateTitaniumProperties::refReshActivity needed:  Alloy.Globals.refreshActivity()");
		Alloy.Globals.refreshActivity();
	};
	var rawquerystring = '?q=title+%3D+\''+filename+'\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Ctitle%2CwebContentLink)';
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};

Alloy.Globals.refreshActivity = function() {
	Alloy.Globals.Log("alloy.js::refresh(e): executing  refreshActivity()  ");
	Alloy.Globals.Log("alloy.js::refresh(e): before executing  Alloy.Globals.getPrivateMaster()  ");
	//Alloy.Globals.getPrivateMaster();
	//Alloy.Globals.getMaster();
	Alloy.Globals.googleAuthSheet.isAuthorized(function() {
			Alloy.Globals.Log('Access Token: ' + Alloy.Globals.googleAuthSheet.getAccessToken());
		}, function() {
			Alloy.Globals.Log('alloy::Alloy.Globals.refreshActivity:Authorized first');
			Alloy.Globals.googleAuthSheet.authorize();
		});
	Alloy.Globals.getJSONOnline();
	Alloy.Globals.Log("alloy.js::refresh(e): before executing  Alloy.Globals.initialUserSetup()  ");
	Alloy.Globals.initialUserSetup(); 
	function getEmail(e){
			var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    try {
		    		var json = JSON.parse(this.responseText);
		    		Alloy.Globals.Log("response is: "+JSON.stringify(json));
		    		var emailid = json.email;
		    		Titanium.App.Properties.setString('emailid',emailid);
		    		//Set the company emailid. Set to oneself if this is not a shared account.
		    		if (Titanium.App.Properties.getString('kraniemailid')){
		    			var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
		    		} else {Titanium.App.Properties.setString('kraniemailid',emailid);var kraniemailid=emaild;};
		    		Alloy.Globals.Log("alloy.js::args inside getEmail: emailid "+emailid+" :: "+JSON.stringify(e));
		    		
		    	} catch(e){
					Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
				}
				return emailid;
				Titanium.App.Properties.setString('emailid',emailid);
			}
			});
		xhr.onerror = function(e){
			//alert("alloy::getEmail::Unable to get info.");
			Alloy.Globals.Log('alloy::getEmail:: unable to get info for '+e);
		};
		Alloy.Globals.Log('alloy::getEmail:: URL:: https://www.googleapis.com/oauth2/v1/userinfo?alt=json');
		xhr.open("GET", 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json');
		xhr.setRequestHeader("Content-type", "application/json");
	    xhr.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
		xhr.send();
	}
		
	function getParentID(email){
		Alloy.Globals.Log("alloy.js::getParentID: with email: " +email);
		var themastersid = Alloy.Collections.instance('master');
		themastersid.fetch();
		Alloy.Globals.Log(" themastersid : "+JSON.stringify(themastersid));
		if (themastersid.length > 0) {
			var mastersidjson = themastersid.toJSON();
			Alloy.Globals.Log("alloy.js::JSON.stringify(mastersidjson): " +JSON.stringify(mastersidjson));
			for( var i=0; i < mastersidjson.length; i++){
				var mastercol1 = mastersidjson[i].col1.trim();
				if ( mastercol1 == email.trim()) { 
					Alloy.Globals.Log(" alloy::getParentID: found mastercol1: "+mastercol1+" vs. "+email.trim());
					var parentid = mastersidjson[i].col2.trim(); 
					Titanium.App.Properties.setString('parentid',parentid);
				};
			}	
			if (parentid) {
				Alloy.Globals.Log("alloy.js::getParentID: parentid is: "+parentid);
				//$.email_label.text=email;
				//$.email_label.font={fontSize:"5dp"};

				//alert(email+" is registered user. Please proceed. Thanks");
			} else {
				alert(email+" is NOT registered user. Using demo access. Please proceed. Thanks");
			}	
		} 
	}
		
	(Alloy.Globals.googleAuthSheet.getAccessToken()) && getEmail();
	var email= Titanium.App.Properties.getString('emailid');
	if (email) {
	//var mastersid = Titanium.App.Properties.getString('master');
	//Alloy.Globals.getPrivateData(mastersid,"master");
	//getParentID(email);
	//TODO:steps to get parentid.
		
	} else {(Alloy.Globals.googleAuthSheet.getAccessToken()) && getEmail(); }
};

Alloy.Globals.UpdateSSDBthenFetch = function(item){
  var sid = Titanium.App.Properties.getString(item);
  Alloy.Globals.getPrivateData(sid,item);
  Alloy.Globals.Log("Alloy.Globals.UpdateSSDBthenFetch: updating item: " +item+" with sid: "+sid);
  eval("Alloy.Collections."+item+".fetch()");
};

Alloy.Globals.checkFileExistThenUpdateSID = function(filename){
		var jsonlist = " ";
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var jsonlist = JSON.parse(this.responseText);
	    		Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateSID::response of jsonlist is: "+JSON.stringify(jsonlist));
	    	} catch(e){
				Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateSID::cathing e: "+JSON.stringify(e));
			}
			Alloy.Globals.Log("jsonlist.items.length: "+jsonlist.items.length);
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateSID::File DOES NOT EXIST. Ignored");
				var fileexist = "false";
			} else {
				var fileexist = "true";
				var sid = jsonlist.items[0].id;
				//Titanium.App.Properties.setString('invoicesentsid',sid);
				eval("Titanium.App.Properties.setString('"+filename+"_sid',sid)");
				Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateSID:: File exist. sid is: "+jsonlist.items[0].id+" ");
				Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateSID:: File exist. Titanium.App.Properties.setString('"+filename+"_sid',sid) is: "+eval("Titanium.App.Properties.getString('"+filename+"_sid')")+".");
			};
		}
		});
	xhr.onerror = function(e){
		Alloy.Globals.Log("Alloy.Globals.checkFileExistThenUpdateSID::error e: "+JSON.stringify(e));
	};
	var rawquerystring = '?q=title+%3D+\''+filename+'\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Ctitle)';
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};

Alloy.Globals.createImageSnapshotofPDFandUpload = function(url,filename,parentid,position,type,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16){
	Alloy.Globals.Log("Alloy.Globals.createImageSnapshotofPDFandUpload:: url:: "+url);
	 var webView= Ti.UI.createWebView({
	 	url:url
	 });
	 Alloy.Globals.Log("Alloy.Globals.createImageSnapshotofPDFandUpload:: Initial: webView:: "+JSON.stringify(webView));
	 // Added for test
	 Titanium.UI.setBackgroundColor('#fff'); 
	  		
	  	var win= Ti.UI.createWindow({
	  		modal : true,
		    title: "Invoice preview uploaded. Please wait."
		});
	  	var win1 = Titanium.UI.iOS.createNavigationWindow({
  		 	window: win,
  		 	Title:" "
		});		
		var view= Ti.UI.createView({
		    height:'auto',
		    width:'auto',
		});	
		 webView.addEventListener('load',function(){
		     ///view.show();     	 	 		 
		     setTimeout(function(){
		     	var pdf2image = webView.toImage();
				 var filepdf2image = Titanium.Filesystem.createTempFile(Titanium.Filesystem.resourcesDirectory);
				 filepdf2image.write(pdf2image);
				 Alloy.Globals.Log("Alloy.Globals.createImageSnapshotofPDFandUpload:: JSON.stringify(filepdf2image):: "+JSON.stringify(filepdf2image)+" filepdf2image "+filepdf2image+" pdf2image "+pdf2image);
				 Alloy.Globals.uploadPictoGoogle(pdf2image,filename,parentid,position,type,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16);
		     	 win1.close();
		     },10000);
		 });	 
		 view.add(webView);
		 win.add(view);		
		 
		
	 //Added for test Done
	 Alloy.Globals.Log("Alloy.Globals.createImageSnapshotofPDFandUpload:: DONE: webView:: "+JSON.stringify(webView));
	 
	 win1.addEventListener('open',function() {
	 	
	 });
	 win1.open(); //open it	 
};

Alloy.Globals.uploadPDFFileCreateSnapshotSubmit = function(file,filename,parentid,position,type,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16) {
		var fileget = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,file);
    	//var fileget = Ti.Filesystem.getFile(file);
		var fileread = fileget.read();
		var filebase64 = Ti.Utils.base64encode(fileread);
 		Alloy.Globals.Log('Access Token for File upload is: ' +Alloy.Globals.googleAuthSheet.getAccessToken());
 		var parts = [];
 		var bound = 287032396531387;
	 		var meta = '\{'
	 		+	'\"title\": \"'+filename+'\",'
	 		+'\"parents\": ['
		  	+'{'
		   	+'\"id\": \"'+parentid+'\"'
		 	+' }'
		 	+']'
			+	'\}';
		var parts = [];
        parts.push('--' + bound);
        parts.push('Content-Type: application/json');
        parts.push('');
        parts.push(meta);
        parts.push('--' + bound);
		parts.push('Content-Type: application/pdf');
        parts.push('Content-Transfer-Encoding: base64');
        parts.push('');
        parts.push(filebase64);
        parts.push('--' + bound + '--');
 		var url = "https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart";
 		var xhr =  Titanium.Network.createHTTPClient({
		    onload: function() {
		    	try {
		    		Alloy.Globals.Log(this.responseText); 
		    		var json = JSON.parse(this.responseText);
		    		var id = json.id;
		    		var webcontentlink = json.webContentLink;
		    		Titanium.App.Properties.setString('webcontentlink',webcontentlink);
	    			Alloy.Globals.Log("alloy.js::Alloy.Globals.uploadPDFFileCreateSnapshotSubmit::id is: "+id+" webcontentlink: "+webcontentlink);
	    			eval("var col"+position+" = webcontentlink");	
	    			var col2 = Titanium.App.Properties.getString('webcontentlink');
	    			var col4=col5=col6=col7=col8=col9=col10=col11=col12=col13=col14=col15=col16="NA";
	    			setTimeout(function(){
	    				//TODO: fix this.
	    				Alloy.Globals.createImageSnapshotofPDFandUpload(webcontentlink,filename+"_image",parentid,"3",type,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16);
	    				//Alloy.Globals.submit(type,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16);		
	    			},10000);
	    			Alloy.Globals.shareAnyonePermission(id);
     	 			
		    	} catch(e){
		    		Alloy.Globals.Log("Alloy.Globals.uploadPDFFileCreateSnapshotSubmit::cathing e: "+JSON.stringify(e));
		    	}     
		    },
		    onerror: function(e) {
		    	Alloy.Globals.Log("Alloy.Globals.uploadFileSubmit::error e: "+JSON.stringify(e));
		        alert("Please connect to the network."); 
		    }
		});
		xhr.open("POST", url);
		xhr.setRequestHeader("Content-type", "multipart/mixed; boundary=" + bound);
		xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
		xhr.setRequestHeader("Content-Length", "2000000");
		xhr.send(parts.join("\r\n"));
		Alloy.Globals.Log('done POSTed');
};

Alloy.Globals.LicenseUserAction = function(type) {
	var checklicense = Titanium.App.Properties.getString("checklicense");
	Alloy.Globals.Log("alloy.js::Alloy.Globals.LicenseUserAction: foldername: "+type+" checklicense action is: "+checklicense);
	if ( checklicense == "yes" ) {		
		switch (type) {
			case "freeuser" :
				Alloy.Globals.Log("alloy.js::Alloy.Globals.LicenseUserAction: "+type);
				Alloy.Globals.statusColor = "gray";
				Alloy.Globals.statusHeight = "3%";
				Alloy.Globals.userText = "F R E E    U S E R";
			break;
			case "paiduser" :
				alert("This is "+type);
			break;
			case "paidbasic" :
				Alloy.Globals.Log("alloy.js::Alloy.Globals.LicenseUserAction: "+type);
				alert("This is "+type);
			break;
			case "paidpremium" :
				alert("This is "+type);
			break;
			case "paidunlimited" :
				alert("This is "+type);
			break;
			default :
				alert("This is "+type);
				Alloy.Globals.statusColor = "blue";
		}
	};
};
/*
Alloy.Globals.LicenseCheck = function(name){
	var kraniemailid = (Titanium.App.Properties.getString('kraniemailid'))?Titanium.App.Properties.getString('kraniemailid'):Titanium.App.Properties.getString('emailid');
	var name = (name)?name:kraniemailid.split('@')[0].trim();
	var foldername = name+"_dir";
	Alloy.Globals.Log("alloy.js::Alloy.Globals.LicenseCheck on: foldername: "+foldername);
	var xhr1 = Ti.Network.createHTTPClient({
		onload: function(e) {
			var fileexistjsonlist = JSON.parse(this.responseText);
			if (fileexistjsonlist) {
				Alloy.Globals.Log("Alloy.Globals.LicenseCheck::response of fileexistjsonlist is: "+JSON.stringify(fileexistjsonlist));
				if (fileexistjsonlist.items.length == "0" ){
						Alloy.Globals.Log("Alloy.Globals.LicenseCheck::dir "+foldername+" does not exists ");					
					} else {
						//STAMP:: the folder SID into memory for additional use.
						var sid = fileexistjsonlist.items[0].id;
						var parentid = fileexistjsonlist.items[0].parents[0].id;
						Alloy.Globals.Log("Alloy.Globals.LicenseCheck:: executing. Alloy.Globals.LicenseUserAction(\"freeuser\")");
						Alloy.Globals.LicenseUserAction("freeuser");
					}	
				}		
			}
		});
		var usertypeid = Titanium.App.Properties.getString("freeuser");
		var rawquerystring1 = '?q=title+%3D+\''+foldername+'\'+and+\''+usertypeid+'\'+in+parents+and+mimeType+%3D+\'application%2Fvnd.google-apps.folder\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Cparents%2Ctitle)';
		xhr1.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring1);
		xhr1.setRequestHeader("Content-type", "application/json");
		xhr1.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
		xhr1.send();
		Alloy.Globals.Log("alloy.js::Alloy.Globals.LicenseCheck: execute GET https://www.googleapis.com/drive/v2/file/"+rawquerystring1);
};*/

Alloy.Globals.LicenseCheck = function(name,licensetype){
	var kraniemailid = (Titanium.App.Properties.getString('kraniemailid'))?Titanium.App.Properties.getString('kraniemailid'):Titanium.App.Properties.getString('emailid');
	var name = (name)?name.split('@')[0].trim():kraniemailid.split('@')[0].trim();
	var foldername = name+"_dir";
	Alloy.Globals.Log("alloy.js::Alloy.Globals.LicenseCheck on: foldername: "+foldername+" licensetype: "+licensetype);
	var xhr1 = Ti.Network.createHTTPClient({
		onload: function(e) {
			var fileexistjsonlist = JSON.parse(this.responseText);
			if (fileexistjsonlist) {
				Alloy.Globals.Log("Alloy.Globals.LicenseCheck::response of fileexistjsonlist is: "+JSON.stringify(fileexistjsonlist));
				if (fileexistjsonlist.items.length == "0" ){
						Alloy.Globals.Log("Alloy.Globals.LicenseCheck::dir "+foldername+" does not exists in licensetype: "+licensetype);					
					} else {
						//STAMP:: the folder SID into memory for additional use.
						var sid = fileexistjsonlist.items[0].id;
						var parentid = fileexistjsonlist.items[0].parents[0].id;
						Alloy.Globals.Log("Alloy.Globals.LicenseCheck:: executing. Alloy.Globals.LicenseUserAction(\""+licensetype+"\")");
						Alloy.Globals.LicenseUserAction(licensetype);
					}	
				}		
			}
		});
		var usertypeid = Titanium.App.Properties.getString(licensetype);
		var rawquerystring1 = '?q=title+%3D+\''+foldername+'\'+and+\''+usertypeid+'\'+in+parents+and+mimeType+%3D+\'application%2Fvnd.google-apps.folder\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Cparents%2Ctitle)';
		xhr1.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring1);
		xhr1.setRequestHeader("Content-type", "application/json");
		xhr1.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
		xhr1.send();
		Alloy.Globals.Log("alloy.js::Alloy.Globals.LicenseCheck: execute GET https://www.googleapis.com/drive/v2/file/"+rawquerystring1);
};

Alloy.Globals.LicenseCheckNested = function(name,name1){
	var kraniemailid = (Titanium.App.Properties.getString('kraniemailid'))?Titanium.App.Properties.getString('kraniemailid'):Titanium.App.Properties.getString('emailid');
	var name = (name)?name:kraniemailid.split('@')[0].trim();
	var foldername = name+"_dir";
	Alloy.Globals.Log("alloy.js::Alloy.Globals.LicenseCheck on: foldername: "+foldername);
	var xhr1 = Ti.Network.createHTTPClient({
		onload: function(e) {
			var fileexistjsonlist = JSON.parse(this.responseText);
			if (fileexistjsonlist) {
				Alloy.Globals.Log("Alloy.Globals.LicenseCheck::response of fileexistjsonlist is: "+JSON.stringify(fileexistjsonlist));
				if (fileexistjsonlist.items.length == "0" ){
						Alloy.Globals.Log("Alloy.Globals.LicenseCheck::dir "+foldername+" does not exists ");					
					} else {
						//STAMP:: the folder SID into memory for additional use.
						var sid = fileexistjsonlist.items[0].id;
						var parentid = fileexistjsonlist.items[0].parents[0].id;
						Alloy.Globals.Log("Alloy.Globals.LicenseCheck:: executing. Alloy.Globals.LicenseUserAction(\"freeuser\")");
						Alloy.Globals.LicenseUserAction("freeuser");
					}	
				}		
			}
		});
		var usertypeid = Titanium.App.Properties.getString("freeuser");
		var rawquerystring1 = '?q=title+%3D+\''+foldername+'\'+and+\''+usertypeid+'\'+in+parents+and+mimeType+%3D+\'application%2Fvnd.google-apps.folder\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Cparents%2Ctitle)';
		xhr1.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring1);
		xhr1.setRequestHeader("Content-type", "application/json");
		xhr1.setRequestHeader("Authorization", 'Bearer '+ Alloy.Globals.googleAuthSheet.getAccessToken());
		xhr1.send();
		Alloy.Globals.Log("alloy.js::Alloy.Globals.LicenseCheck: execute GET https://www.googleapis.com/drive/v2/file/"+rawquerystring1);
};