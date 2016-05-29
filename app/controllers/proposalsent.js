var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.proposalsent_window);
  Alloy.Globals.Log("This is child widow proposalsent.js" +JSON.stringify(_tab));
  $.proposalsent_table.search = $.search_history;
  Alloy.Collections.proposalsent.fetch();
};

callbackFunction = args.callbackFunction;

function addHandler(e) {
	Alloy.Globals.Log("JSON stringify addHandler(e): "+JSON.stringify(e));
}

 function myRefresher(e) {
	Alloy.Globals.Log("refreshing after pull : " +JSON.stringify(e));
    Alloy.Collections.proposalsent.fetch({
        success: e.hide,
        error: e.hide
    });
}

function transformFunction(model) {
	var transform = model.toJSON();
	Alloy.Globals.Log("proposalsent.js::transform is ::" +JSON.stringify(transform));
	transform.url = transform.col2; //update proposalurl.
	transform.imgurl = transform.col3; //update imgurl	
	var utcdate = JSON.stringify(transform.col1);
	var date = (transform.col1)?new Date(parseInt(transform.col1)):"";
	transform.custom = (date.toString().substring(0,16));
	transform.title = transform.col1+":"+transform.custom+":"+transform.col16;
	Alloy.Globals.Log("utcdate is ::" +utcdate+" transform.col1: " +transform.col1+ " date is: "+date);
	return transform;
}

function filterFunction(collection) {
	return collection.where({col5:'NA'});
}

function uploadPictoGoogle(image,filename,parentid){
	Alloy.Globals.Log("proposalsent.js::uploadPictoGoogle::create ss with filename: "+filename);
	var base64Data = Ti.Utils.base64encode(image);
	 		var parts = [];
	 		var bound = 287032396531387;
			var meta = '\{'
	 		+	'\"title\": \"'+filename+'\",'
	 		+	'\"parents\" : ['
  			+		'\{'
   			+ 		'\"id\": \"'+parentid+'\"'
  			+		'\}'
 			+	']'	 		
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
	 		Alloy.Globals.Log("enterjobdetail.js::uploadPictoGoogle:: URL: "+url+" "+meta);
	 		var xhr =  Titanium.Network.createHTTPClient({
			    onload: function() {
			    	try {
			    		var json = JSON.parse(this.responseText);
	    				Ti.API.info("enterjobdetail.js::uploadPictoGoogle::response is: "+JSON.stringify(json));
	    				var id = json.id;
	    				var webcontentlink = json.webContentLink;
	    				Ti.API.info("enterjobdetail.js::uploadPictoGoogle::id is: "+id+" webcontentlink: "+webcontentlink);
	    				//shareAnyonePermission(id);
	    				var e = {"value":"none","source":{"_hintText":id}};
	    				Alloy.Globals.Log("enterjobdetail.js::uploadPictoGoogle::entering urlimage with info below e: "+JSON.stringify(e));
	    				//enterNotes(e,webcontentlink);
			    	} catch(e){
			    		Ti.API.info("enterjobdetail.js::uploadPictoGoogle::cathing e: "+JSON.stringify(e));
			    	} 
			    	return id;    
			    },
			    onerror: function(e) {
			    	Alloy.Globals.Log("enterjobdetail.js::uploadPictoGoogle::error e: "+JSON.stringify(e));
			    	alert("error:"+e.code+": Please connect to the network.");
			    }
			});
			xhr.open("POST", url);
			xhr.setRequestHeader("Content-type", "multipart/mixed; boundary=" + bound);
			xhr.setRequestHeader("Authorization", 'Bearer '+googleAuthSheet.getAccessToken());
			//xhr.setRequestHeader("Content-Length", "2000000");
			xhr.send(parts.join("\r\n"));
			Ti.API.info('done POSTed');
			//Ti.API.info("enterjobdetail.js::uploadPictoGoogle::sid outside is: "+id);
}


function viewproposal(e) {
	Alloy.Globals.Log("proposalsent.js:: viewproposal:: "+JSON.stringify(e));
	var url = e.row.url;
	if (url.match("http")) {
		Titanium.UI.setBackgroundColor('#fff'); 
	  		
	  	var win= Ti.UI.createWindow({
	  		modal : true,
		    title: "proposal #: "
		});
		var close = Ti.UI.createButton({
			title : "close"
		});
		close.addEventListener("click", function() {
    		win1.close();
		});
		//
		var preview = Ti.UI.createButton({
			title : "preview"
		});
		//
	  	var win1 = Titanium.UI.iOS.createNavigationWindow({
  		 	window: win,
  		 	Title:" "
		});		
		var webView= Ti.UI.createWebView({
		    url:e.row.url
		});
		var view= Ti.UI.createView({
		    height:'auto',
		    width:'auto',
		});	
		 webView.addEventListener('load',function(){
		     view.show();
		 });
		 
		 view.add(webView);
		 win.add(view);		
		 win.rightNavButton = close;
		 
		 win1.open();
		 
		 //pdf to image start
 		var winpdf2image= Ti.UI.createWindow({
	  		modal : true,
		    title: "PDF Preview #: "
		});
		var winnavpdf2image = Titanium.UI.iOS.createNavigationWindow({
  		 	window: winpdf2image,
  		 	Title:" PDF Preview Navigation "
		});	
		var viewpdf2image= Ti.UI.createView({
		    height:'auto',
		    width:'auto',
		});
	} else Alloy.Globals.Log("proposalsent.js:: viewproposal:: url is not http "+url);
}

$.proposalsent_window.addEventListener('close',function(){
	callbackFunction();
});

var refresh = Ti.UI.createRefreshControl({
    tintColor:'orange'
});

$.proposalsent_table.refreshControl=refresh;

refresh.addEventListener('refreshstart',function(e){
	setTimeout(function(){
        Alloy.Globals.Log('proposalsent::refresh:: JSON.stringify(e): '+JSON.stringify(e));
        callbackFunction();
        refresh.endRefreshing();
    }, 2000);
});
