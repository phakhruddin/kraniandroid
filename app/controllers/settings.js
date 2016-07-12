var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.settings_window);
  Ti.API.info("This is child widow schedule.js" +_tab);
};

var maxdebug = Titanium.App.Properties.getInt('maxdebug'); (maxdebug==1)?$.switch_maxdebug.value=true:$.switch_maxdebug.value=false;
var mindebug = Titanium.App.Properties.getInt('mindebug'); (mindebug==1)?$.switch_mindebug.value=true:$.switch_mindebug.value=false;

$.switch_mindebug.addEventListener("change", function(e){
	var switchMDValue = $.switch_mindebug.value;
	Ti.API.info("switch value :" +switchMDValue);
	if ( switchMDValue == true ) {
		Titanium.App.Properties.setInt('mindebug',1);
		var mindebugstatus = "ON";
		alert("OFFLINE Mode is "+mindebugstatus);
	} else {
		Titanium.App.Properties.setInt('mindebug',0);
		var mindebugstatus = "OFF";
		alert("OFFLINE Mode  is "+mindebugstatus);
	};
});

$.switch_maxdebug.addEventListener("change", function(e){
	var switchMDValue = $.switch_maxdebug.value;
	Ti.API.info("switch value :" +switchMDValue);
	if ( switchMDValue == true ) {
		Titanium.App.Properties.setInt('maxdebug',1);
		var maxdebugstatus = "ON";
		alert("Maximum Debug is "+maxdebugstatus);
	} else {
		Titanium.App.Properties.setInt('maxdebug',0);
		var maxdebugstatus = "OFF";
		alert("Maximum Debug is "+maxdebugstatus);
	};
});

function doRow(e){
	Alloy.Globals.Log("location.js::doRow click: "+JSON.stringify(e));
	var win = Titanium.UI.createWindow({title:"Client Details",backgroundColor:'#F5F5F5'});
	var activity = win.activity;	
	var subject = ['firstname','lastname','employeejobtitle','phone','email','streetaddr','city','state','country'];
	for (i=0;i<subject.length;i++){
		eval(subject[i]+" =  e.rowData.title.split(':')["+parseFloat(i+1)+"].trim()");
		Alloy.Globals.Log("location.js::doRow array: "+firstname);
		eval("var "+subject[i]+"label = Ti.UI.createLabel({text:"+subject[i]+",top:14,color:'#3B3B3B',font:{fontSize:'14'},textAlign:'Ti.UI.TEXT_ALIGNMENT_CENTER'})");
		eval("var view = Titanium.UI.createView({top:parseFloat(40)*parseFloat("+i+"),height:'39',width:'95%',layout:'vertical',backgroundColor:'#FAFAFA',borderColor:'#EDEDED',borderRadius:'10',borderWidth:'0.1'})");
		eval("view.add("+subject[i]+"label)");
		win.add(view);
	}	
	activity.onCreateOptionsMenu = function(e){
	  var menu = e.menu;
  	  var menuItem2 = menu.add({
	    title: "Item 2",
	    icon:  Ti.Android.R.drawable.ic_menu_save,
	    showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS
	  });
	  var menuItem1 = menu.add({
	    title: "Item 1",
	    icon:  Ti.Android.R.drawable.ic_menu_edit,
	    showAsAction: Ti.Android.SHOW_AS_ACTION_ALWAYS
	  });
	  menuItem1.addEventListener("click", function(e) {
	    Alloy.Globals.Log("location.js::doRow: menuItem: I was clicked");
	    Alloy.Globals.Log("location.js::doRow: JSON.stringify(win): "+JSON.stringify(win));
	    for (i=0;i<subject.length;i++){
		    Alloy.Globals.Log("location.js::doRow array: menuItem1 "+subject[i]+" is: "+eval(subject[i]));
		    eval(subject[i]+"label.hide()");
		    eval("var "+subject[i]+"TextField = Ti.UI.createTextField({hintText:"+subject[i]+",color:'black',font:{fontSize:'14'},width:'95%'})");
		    //firstnameTextField.addEventListener('blur',function(f){var newfirstname=f.value;menuItem2.newfirstname=newfirstname;});
		    eval(""+subject[i]+"TextField.addEventListener('change',function(f){var new"+subject[i]+"=f.value;menuItem2.new"+subject[i]+"=new"+subject[i]+";})");// menuItem2.newfirstname=erica
		    eval("var view = Titanium.UI.createView({top:parseFloat(40)*parseFloat("+i+"),height:'39',width:'95%',layout:'vertical',backgroundColor:'gray',borderColor:'#EDEDED',borderRadius:'10',borderWidth:'0.1'})");  
	    	eval("view.add("+subject[i]+"TextField)");
			win.add(view);
		}
	  });
	  menuItem2.addEventListener("click",function(e){
	  	 Alloy.Globals.Log("location.js::doRow array: menuItem2: JSON.stringify(e)  "+JSON.stringify(e));
	  });
	};	
	win.open();	
}


$.row_empselect.addEventListener("click", function(e){
	var item = "labor";
	var sid = Titanium.App.Properties.getString(item,"none");
	Alloy.Globals.getPrivateData(sid,item);
	var labor  = Alloy.Collections.instance('labor');
	labor.fetch();
	Alloy.Globals.Log("settings.js::JSON stringify labor data on emailpdf: "+JSON.stringify(labor));
	var employeejson = labor.toJSON();
	Alloy.Globals.Log("settings.js::employeejson.length: "+employeejson.length);
	var win = Titanium.UI.createWindow({title:"Labor Details",backgroundColor:'#F5F5F5'});
	for (j=0;j<employeejson.length;j++) {
		Alloy.Globals.Log("settings.js::employeejson.col2: "+employeejson[j].col2);							
		var activity = win.activity;	
		var view = Titanium.UI.createView({top:30*j,height:'29',width:'95%',layout:'vertical',backgroundColor:'#FAFAFA',borderColor:'#EDEDED',borderRadius:'10',borderWidth:'0.1'});
		var employeelabel = Ti.UI.createLabel({text:employeejson[j].col2,color:'#3B3B3B',font:{fontSize:'14'},textAlign:'Ti.UI.TEXT_ALIGNMENT_CENTER'});
		view.add(employeelabel);
		Alloy.Globals.Log("settings.js::row_empselect : JSON.stringify(view) "+JSON.stringify(view));
		win.add(view);
		var subject = ['firstname','lastname','employeejobtitle','phone','email','streetaddr','city','state','country'];
		/*
		for (i=0;i<subject.length;i++){
			//eval(subject[i]+" =  e.rowData.title.split(':')["+parseFloat(i+1)+"].trim()");
			eval(subject[i]+" =  employeejson[j].col"+parseFloat(i+2)+".trim()");
			Alloy.Globals.Log("settings.js::doRow array: "+eval(subject[i]));
			eval("var "+subject[i]+"label = Ti.UI.createLabel({text:"+subject[i]+",top:14,color:'#3B3B3B',font:{fontSize:'14'},textAlign:'Ti.UI.TEXT_ALIGNMENT_CENTER'})");
			eval("var view = Titanium.UI.createView({top:parseFloat(40)*parseFloat("+i+"),height:'39',width:'95%',layout:'vertical',backgroundColor:'#FAFAFA',borderColor:'#EDEDED',borderRadius:'10',borderWidth:'0.1'})");
			eval("view.add("+subject[i]+"label)");
			win.add(view);
		}
		*/	
	}
	
	win.open();
	
});

var sharedkraniemaildialog = Ti.UI.createAlertDialog({
	cancel: 1,
	buttonNames: ['NO', 'YES'],
	title: 'Shared Account'
});

$.companygmail_tf.hintText=Titanium.App.Properties.getString("sharedkraniemailid")?"Gmail: "+Titanium.App.Properties.getString("sharedkraniemailid"):"GMail e.g: "+Titanium.App.Properties.getString("kraniemailid");
$.companyname_tf.hintText=Titanium.App.Properties.getString("coName")?"Name: "+Titanium.App.Properties.getString("coName"):"Name e.g.: Zefi Landscape LLC";
$.streetaddress_tf.hintText=Titanium.App.Properties.getString("coStreetAddress")?"Address: "+Titanium.App.Properties.getString("coStreetAddress"):"Address e.g.: 100 W East Ave";
$.city_tf.hintText=Titanium.App.Properties.getString("coCity")?"City: "+Titanium.App.Properties.getString("coCity"):"City";
$.state_tf.hintText=Titanium.App.Properties.getString("coState","STATE");
$.zipcode_tf.hintText=Titanium.App.Properties.getString("coZip")?+Titanium.App.Properties.getString("coZip"):"Zipcode";
$.companyphone_tf.hintText=Titanium.App.Properties.getString("coPhone")?"Phone: "+Titanium.App.Properties.getString("coPhone"):"Phone: (414)555-1212";
function coName(e) {Titanium.App.Properties.setString("coName", e.value);}
function coStreetAddress(e) {Titanium.App.Properties.setString("coStreetAddress", e.value);}
function coCity(e) {Titanium.App.Properties.setString("coCity", e.value);}
function coState(e) {Titanium.App.Properties.setString("coState", e.value);}
function coZip(e) {Titanium.App.Properties.setString("coZip", e.value);}
function coPhone(e) {Titanium.App.Properties.setString("coPhone", e.value);}
function coGmail(e) {
	if (e.value && e.value != "") {
		var sharedkraniemailid = e.value;
		Titanium.App.Properties.setString("sharedkraniemailid", sharedkraniemailid);
		Titanium.App.Properties.setString("kraniemailid", sharedkraniemailid);
		Alloy.Globals.Log("setting.js::coGmail: sharedkraniemailid: "+sharedkraniemailid);
		sharedkraniemaildialog.message = sharedkraniemailid+' is the source account?';
		sharedkraniemaildialog.show();
		}
	}
	
sharedkraniemaildialog.addEventListener("click",function(e){
	if (e.index == 1 ) {
		var kraniemailid = Titanium.App.Properties.getString("sharedkraniemailid");	
		var name = kraniemailid.split('@')[0].trim(); //use kraniemailid for uniqueness
		Alloy.Globals.Log("settings.js:coGmail:Alloy.Globals.getJSONOnlineCreateInitialFolder('"+name+"')");
		Alloy.Globals.getJSONOnlineCreateInitialFolder(name); // refresh user
		alert("shared account: "+name);
	} else {return 100;};
});

//LOGO
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
 } else { Alloy.Globals.Log("settings.js::logo does not exists.");};

 

//getParentID for logo
 var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
 var name = kraniemailid.split('@')[0].trim();
 var parentid = Titanium.App.Properties.getString(name+"_invoice");
 var filename = name+'_defaultlogo';
 
 
 function shareAnyonePermission(sid){
	Alloy.Globals.Log("settings.js::shareAnyonePermission::sid: "+sid);
	var jsonpost = '{'
		 +'\"role\": \"reader\",'
		 +'\"type\": \"anyone\"'
		+'}';
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Ti.API.info("settings.js::shareAnyonePermission::response is: "+this.responseText);
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		alert("error:"+e.code+": Please connect to the network."); 
		Alloy.Globals.Log("settings::shareAnyonePermission::Unable to connect to the cloud.");
	};
	xhr.open("POST", 'https://www.googleapis.com/drive/v2/files/'+sid+'/permissions');	
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
    Alloy.Globals.Log("settings.js::shareAnyonePermission::json post: "+jsonpost);
	xhr.send(jsonpost);
}
 
 
function uploadPictoGoogle(image,filename,parentid){
	Alloy.Globals.Log("settings.js::uploadPictoGoogle::create ss with filename: "+filename);
	var base64Data = Ti.Utils.base64encode(image);
	 		var parts = [];
	 		var bound = 287032396531387;
	 		/*
	 		var meta = '\{'
	 		+	'\"title\": \"'+filename+'\"'	 		
			+	'\}';*/
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
	 		Alloy.Globals.Log("settings.js::uploadPictoGoogle:: URL: "+url+" "+meta);
	 		var xhr =  Titanium.Network.createHTTPClient({
			    onload: function() {
			    	try {
			    		var json = JSON.parse(this.responseText);
	    				Ti.API.info("settings.js::uploadPictoGoogle::response is: "+JSON.stringify(json));
	    				var id = json.id;
	    				var webcontentlink = json.webContentLink;
	    				Titanium.App.Properties.setString('logourl',webcontentlink);  //set logo image
	    				Ti.API.info("settings.js::uploadPictoGoogle::id is: "+id+" webcontentlink: "+webcontentlink);
	    				shareAnyonePermission(id);
	    				var e = {"value":"none","source":{"_hintText":id}};
	    				Alloy.Globals.Log("settings.js::uploadPictoGoogle::entering urlimage with info below e: "+JSON.stringify(e));
			    	} catch(e){
			    		Ti.API.info("settings.js::uploadPictoGoogle::cathing e: "+JSON.stringify(e));
			    	} 
			    	return id; 	 
			    },
			    onerror: function(e) {
			    	Alloy.Globals.Log("settings.js::uploadPictoGoogle::error e: "+JSON.stringify(e));
			        alert("error:"+e.code+": Please connect to the network."); 
			    }
			});
			xhr.open("POST", url);
			xhr.setRequestHeader("Content-type", "multipart/mixed; boundary=" + bound);
			xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
			//xhr.setRequestHeader("Content-Length", "2000000");
			xhr.send(parts.join("\r\n"));
			Ti.API.info('done POSTed');
			//Ti.API.info("settings.js::uploadPictoGoogle::sid outside is: "+id);
}


function UploadPhotoToServer(imagemedia,parentid){
        Alloy.Globals.Log("settings.js::UploadPhotoToServer:: Upload photo to the server.");
        var imageView = Titanium.UI.createImageView({
            image:imagemedia,
            width:100,
            height:100
        });
        var image = imageView.toImage();
        Alloy.Globals.Log("settings.js::beginning to upload to the cloud.");
        var imagedatabase64 =  Ti.Utils.base64encode(image);
        var date = new Date();
        var imagefilename = filename.replace(/ /g,'_');;
       // uploadPictoGoogle(image,"uploadphoto3.jpeg");
       Alloy.Globals.Log(new Date()+"::settings.js::UploadPhotoToServer:: Delete existing logo. Alloy.Globals.checkFileExistThenDelete("+imagefilename+")");
       	Alloy.Globals.checkFileExistThenDelete(imagefilename);
       	setTimeout(function(){
       		Alloy.Globals.Log(new Date()+"settings.js::UploadPhotoToServer:: uploadPictoGoogle(image,"+imagefilename+","+parentid+")");
       		uploadPictoGoogle(image,imagefilename,parentid);
       		},2000); //delay 2 secs. finish deleting first       
        //Alloy.Globals.Log("settings.js::UploadPhotoToServer::image sid is : " +imagesid);
}     	 
     	 
function uploadFile(e){
   Alloy.Globals.Log("settings.js::JSON stringify e uploadFile on parentid "+parentid+" : " +JSON.stringify(e));
   Titanium.Media.openPhotoGallery({
       success:function(event)
       {             
           Ti.API.debug('Our type was: '+event.mediaType);
               if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
               {
                   UploadPhotoToServer(event.media,parentid);
               }
           },
           cancel:function()
           {   
           },
           error:function(err)
           {
               Ti.API.error(err);
           },
           mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
       });
  	}
   
   function takePic(e){ 
    Alloy.Globals.Log("settings.js::JSON stringify e takePic:" +JSON.stringify(e));
	Titanium.Media.showCamera({
	        success:function(e){
	                if(e.mediaType === Titanium.Media.MEDIA_TYPE_PHOTO){
	                       var imageView = Titanium.UI.createImageView({
	                                image:e.media,
	                                width:100,
	                                height:100
	                        });
	                        var image = imageView.toImage();
	                        Alloy.Globals.Log("settings.js::beginning to upload to the cloud.");
	                        var date = new Date();
							var imagefilename = filename;
							Alloy.Globals.Log("settings.js::JSON stringify e takePic: Alloy.Globals.uploadPictoGoogle(image,"+imagefilename+","+parentid+")");
							UploadPhotoToServer(image,parentid);
					        //Alloy.Globals.uploadPictoGoogle(image,imagefilename,parentid);
	                } else if (e.mediaType === Titanium.Media.MEDIA_TYPE_VIDEO){
	                        var w = Titanium.UI.createWindow({
	                                title:"Job Video",
	                                backgroundColor: "black"
	                        });
	                        
	                        var videoPlayer = Titanium.Media.createVideoPlayer({
	                                media: e.media                          
	                        });
	                        w.add(videoPlayer);
	                        videoPlayer.addEventListener("complete",function(e){
	                                w.remove(videoPlayer);
	                                videoPlayer = null ;
	                                w.close();
	                        });             
	                        
	                }
	                
	        }, error:function(e){
	        		alert("error:"+e.code+": Unable to load camera"); 
	                Alloy.Globals.Log("settings::takePic::error:unable to load the camera");
	        }, cancel:function(e){
	        		alert("error:"+e.code+": Unable to load camera."); 
	                Alloy.Globals.Log("settings::takePic::cancel:unable to load the camera");
	        },
	        allowEditing:true,
	        saveToPhotoGallery:true,
	        mediaTypes:[Titanium.Media.MEDIA_TYPE_PHOTO,Titanium.Media.MEDIA_TYPE_VIDEO],
	        videoQuality:Titanium.Media.QUALITY_HIGH
	});
	//win.open();
}

function phoneBlur(){
	$.companyphone_tf.blur();
}

function zipBlur(){
	$.zipcode_tf.blur();
}
   
function currencyAction(e){ 
	var currency = e.value;
	Titanium.App.Properties.setString("currency", currency); 
	Alloy.Globals.Log("settings::currencyAction::currency: "+Titanium.App.Properties.getString("currency"));
};


function sendSupportEmail() {   
        var emailDialog = Ti.UI.createEmailDialog();
        emailDialog.subject = "krani support needed from "+kraniemailid;
        emailDialog.toRecipients = ['deen@idevice.net'];
        emailDialog.messageBody = 'Debug data on: '+new Date()+'\n Please write your message below. Thanks:- \n';
        var ftxt1 = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory,'kranilog.txt');
        emailDialog.addAttachment(ftxt1);
        emailDialog.open();
};

showFutureMenu = args.callbackFunction;
futuremenuSwitchValue=Titanium.App.Properties.getInt('futuremenu');
if (futuremenuSwitchValue && futuremenuSwitchValue == "1") {
	$.switch_futuremenu.value = true;
} else $.switch_futuremenu.value = false;
$.switch_futuremenu.addEventListener("change", function(e){
	var switchMDValue = $.switch_futuremenu.value;
	Ti.API.info("switch value :" +switchMDValue);
	if ( switchMDValue == true ) {
		Titanium.App.Properties.setInt('futuremenu',1);
		var futuremenustatus = "ON";
		alert("Show Future Feature menu is "+futuremenustatus);
		showFutureMenu("yes");
	} else {
		Titanium.App.Properties.setInt('futuremenu',0);
		var futuremenustatus = "OFF";
		alert("Show Future Feature menu is "+futuremenustatus);
		showFutureMenu("no");
	};
});

