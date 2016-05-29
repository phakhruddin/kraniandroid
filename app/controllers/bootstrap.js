exports.openMainWindow = function(_tab) {
  _tab.open($.bootstrap_window);
  Ti.API.info("This is child widow schedule.js" +JSON.stringify(_tab));
};


var theproject = Alloy.Collections.instance('project');
(theproject) && theproject.fetch();
var projectjson = theproject.toJSON();
for( var i=0; i < projectjson.length; i++){
	var projectid = projectjson[i].col1;
	var projectname = projectjson[i].col2;
	var projectsid = projectjson[i].col3;
	//addrdata.push({latitude: latitude,longitude:  longitude,title: title});
}



function editTheCell(sid,rowno,colno,value) {
	var pos = "R"+rowno+"C"+colno;
	Alloy.Globals.Log("get SS Cell on :  https://spreadsheets.google.com/feeds/cells/"+sid+"/od6/private/full/"+pos);
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var xml = Titanium.XML.parseString(this.responseText);
	    		Ti.API.info("editTheCell:: response is: "+this.responseText);
	    		Ti.API.info("editTheCell:: xml response is: "+xml);
	    		var entry = xml.documentElement.getElementsByTagName("entry");
	    		var link = xml.documentElement.getElementsByTagName("link");
	    		Alloy.Globals.Log(" number of link found: " +link+ " length: "+link.length);
	    		for (i=0;i<link.length;i++){			
	    			var listitem = link.item(i);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href");}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href");}
	    		}
	    		Ti.API.info("self href is : "+selfhref);
				Ti.API.info("edit href is : "+edithref);
	    		editCell(sid,rowno,colno,edithref,selfhref,value);	    				    			
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		alert("Unable to connect to the cloud. "+e);
	};
	xhr.open("GET", 'https://spreadsheets.google.com/feeds/cells/'+sid+'/od6/private/full/'+pos);
	xhr.setRequestHeader("Content-type", "application/atom+xml");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};


/*
function createSpreadsheet(filename,parentid) {
	Alloy.Globals.Log("create ss with filename: "+filename+" and parentid: "+parentid);
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
	    		Ti.API.info("response is: "+this.responseText);
	    		var json = JSON.parse(this.responseText);
	    		var sid = json.id;
	    		Titanium.App.Properties.setString('sid',sid); // 1st sid created.
	    		Alloy.Globals.Log("sid : "+sid);
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		alert("Unable to connect to the cloud.");
	};
	xhr.open("POST", 'https://www.googleapis.com/drive/v2/files');	
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+ googleAuthSheet.getAccessToken());
    Alloy.Globals.Log("json post: "+jsonpost);
	xhr.send(jsonpost);
}*/

function createSpreadsheet(filename) {
	Alloy.Globals.Log("create ss with filename: "+filename);
	var jsonpost = '{'
		 +'\"title\": \"'+filename+'\",'
		 +'\"mimeType\": \"application/vnd.google-apps.spreadsheet\"'
		+'}';
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Ti.API.info("response is: "+this.responseText);
	    		var json = JSON.parse(this.responseText);
	    		var sid = json.id;
	    		//populate header
	    		for (i=1;i<17;i++){
					var value = "col"+i;
					editTheCell(sid,1,i,value);
				}
				editTheCell(sid,2,1,"Project ID");
				editTheCell(sid,2,2,"Project Name");
				editTheCell(sid,2,3,"sid");
				editTheCell(sid,2,4,"Date Created");
				editTheCell(sid,2,5,"Date Modified");
	    		Titanium.App.Properties.setString('sid',sid); // 1st sid created.
	    		Alloy.Globals.Log("sid : "+sid);
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		alert("Unable to connect to the cloud.");
	};
	xhr.open("POST", 'https://www.googleapis.com/drive/v2/files');	
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
    Alloy.Globals.Log("json post: "+jsonpost);
	xhr.send(jsonpost);
}

function editCell(sid,rowno,colno,edithref,selfhref,value){ 
		var xmldatastring = ['<entry xmlns=\'http://www.w3.org/2005/Atom\' '
 		+' xmlns:gs=\'http://schemas.google.com/spreadsheets/2006\'>'
 		+'<id>'+selfhref+'</id>'
 		+'<link rel=\'edit\' type=\'application/atom+xml\''
 		+' href=\''+edithref+'\'/>'
 		+'<gs:cell row=\''+rowno+'\' col=\''+colno+'\' inputValue=\''+value+'\'>'
 		+'</gs:cell>'
 		+'</entry>'].join('');
 		Alloy.Globals.Log("xmldatastring: "+xmldatastring);
       var xhr =  Titanium.Network.createHTTPClient({
    onload: function() {
        try {
                Ti.API.info(this.responseText); 
        } catch(e){
                Ti.API.info("cathing e: "+JSON.stringify(e));
        }     
    },
    onerror: function(e) {
        Ti.API.info("error e: "+JSON.stringify(e));
        alert("Unable to communicate to the cloud. Please try again"); 
    }
});
        xhr.open("PUT", ''+edithref+'');
        xhr.setRequestHeader("Content-type", "application/atom+xml");
        xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
        xhr.send(xmldatastring);
        Ti.API.info('done POSTed');
}

function checkFileExistThenCreateSS(filename){
		var jsonlist = " ";
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var jsonlist = JSON.parse(this.responseText);
	    		Ti.API.info("response of jsonlist is: "+JSON.stringify(jsonlist));
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
			Alloy.Globals.Log("jsonlist.items.length: "+jsonlist.items.length);
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("File DOES NOT EXIST");
				var fileexist = "false";
				createSpreadsheet(filename);  // create file when does not exists
				Titanium.App.Properties.setString('joblogssid',sid); // stamp the ssid.
			} else {
				var fileexist = "true";
				var sid = jsonlist.items[0].id;
				Alloy.Globals.Log("checkFileExistThenCreateSS:: File exist. sid is: "+jsonlist.items[0].id+" Skipped.");
				Titanium.App.Properties.setString('joblogssid',sid);
			};
		}
		});
	xhr.onerror = function(e){
		alert("Unable to connect to the cloud.");
	};
	var rawquerystring = '?q=title+%3D+\''+filename+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.spreadsheet\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Ctitle)';
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
}


$.createsssid.addEventListener("click", function(e){
	checkFileExistThenCreateSS("joblogssid");
});