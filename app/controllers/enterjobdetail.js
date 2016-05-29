var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.enterjobdetail_window);
  Ti.API.info("This is child widow checking _tab on : " +JSON.stringify(_tab));
  Ti.API.info(" input details after tab enterjobdetail : "+JSON.stringify(args));
};

var parentid = args.parentid;
genJoblog = args.callbackFunction;

var GoogleAuth = require('googleAuth');
var googleAuthSheet = new GoogleAuth({
        clientId : Alloy.Globals.clientId,
        clientSecret : 'fjrsVudiK3ClrOKWxO5QvXYL',
        propertyName : 'googleToken',
        scope : scope,
        quiet: false
});

function transformFunction(model) {
        var currentaddr;

        var transform = model.toJSON();
        ///Alloy.Globals.Log("enterjobdetail.js::transform is ::" +JSON.stringify(transform));
        transform.title = transform.col1+":"+transform.col2+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"
                                                +transform.col8+":"+transform.col9+":"+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13
                                                +":"+transform.col14+":"+transform.col15+":"+transform.col16;
        transform.date = "Date: "+transform.col1;
        transform.notes = "Notes: "+transform.col2;
        transform.img = (transform.col4)?transform.col4:"none";
		transform.jobid = transform.col16;
        var newRow = Ti.UI.createTableViewRow({});
        var newImageView = Ti.UI.createImageView({
                image : transform.img,
                height: 300,
                width: 300
        });     
        var imageRow = newRow.add(newImageView);
        //$.labor_table.setData($.joblog_row);
        return transform;
}

var content = "";
Alloy.Globals.Log("enterjobdetail.js:: initial contents: "+JSON.stringify(content));
var joblog = Alloy.Collections.instance('joblog');
joblog.fetch();
var content = joblog.toJSON();
Alloy.Globals.Log("enterjobdetail.js::JSON stringify content: "+JSON.stringify(content));


function getParentFolder(args) {
	var sid = Titanium.App.Properties.getString('joblog');
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var json = JSON.parse(this.responseText);
	    		Ti.API.info("response is: "+JSON.stringify(json));
	    		var parentid = json.items[0].id;
	    		Titanium.App.Properties.setString('parentid',parentid);
	    		Alloy.Globals.Log("projectdetail.js::args inside getParentFolder: "+JSON.stringify(args));
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
			return parentid;
			Titanium.App.Properties.setString('parentid',parentid);
		}
		});
	xhr.onerror = function(e){
		alert("error:"+e.code+": Please connect to the network.");
		Alloy.Globals.Log('projectdetail::getParentFolder:: unable to get parents for '+sid);
	};
	Alloy.Globals.Log('projectdetail::getParentFolder:: URL:: https://www.googleapis.com/drive/v2/files/'+sid+'/parents');
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files/'+sid+'/parents');
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};


function jobDetailAddRow (date,notesbody,imageurl,jobcommentdata,employee) {
	    var jobrow = Ti.UI.createTableViewRow ({
                backgroundColor: "#ECE6E6",
                opacity:"0",
                color:"transparent",
                width: Ti.UI.SIZE,
                height: Ti.UI.SIZE
        });
        var datelabel = Ti.UI.createLabel ({
                color : "orange",
                font : {
                	fontSize : 10
                },
                left  : "20",
                textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
                top : "10",
                text : date
        });
        var employeelabel = Ti.UI.createLabel ({
                color : "orange",
                font : {
                	fontSize : 10
                },
                right  : "20",
                textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
                top : "10",
                text : employee
        });
        var blueline = Ti.UI.createImageView ({
                left  : "20",
                textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
                top : "30",
                width : "85%",
                height : "3",
                image : "blueline.png"
        });
        var noteslabel = Ti.UI.createLabel ({
                color : "#888",
                left  : "20",
                width : "300",
                textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
                font: {
                        fontSize: "12"
                        },
                text : notesbody
        });
        var imagelabel = Ti.UI.createImageView ({
                image : imageurl,
                top : 50,
                height : Ti.UI.SIZE,
                width : Ti.UI.FILL
        });
        var innerview = Ti.UI.createView({
                width:"90%",
                height:"85%",
                backgroundColor:"white",
                borderRadius:"10",
                borderWidth:"0.1",
                borderColor:"white"
        });
        var selectbutton = Ti.UI.createButton({
        	image:"EditControl.png",
        	right:"45",
        	width:"30",
        	height:"30"
        });

        innerview.add(datelabel);
        innerview.add(employeelabel);
        innerview.add(blueline);
        if ( notesbody != "none" ) {
                innerview.add(noteslabel);
                noteslabel.top = 50;
                var noteslabelheight = ((Math.round(notesbody.split('').length/50)+(notesbody.split(/\r?\n|\r/).length))*14)+14;
                //Alloy.Globals.Log("enterjobdetail.js::noteslabelheight: "+noteslabelheight+" notesbody count: "+notesbody.split(' ').length);
                innerview.height = 60+noteslabelheight;
                selectbutton.top="40";
               // innerview.height = "100";
        } else {
                //imagelabel.height = 200;
                imagelabel.height = Ti.UI.SIZE;
                imagelabel.width = 340;    
        };
        if (imageurl != "none") {
        	innerview.add(imagelabel);
        	var jobrow = Ti.UI.createTableViewRow ({
                backgroundColor: "#ECE6E6",
                opacity:"0",
                color:"transparent",
                width: Ti.UI.FILL,
                height: Ti.UI.SIZE
        		});
        		selectbutton.top="225";      
        	};
        if ( notesbody != "none" && imageurl != "none") {
                imagelabel.top = 50;
                noteslabel.top = 220;
        };
        jobrow.add(innerview);
        //$.job_row.add(innerview);
        jobrow.add(selectbutton);
        jobrow.metadata = jobcommentdata; // add metadata info
        //$.job_row.metadata = jobcommentdata; // add metadata info
      /*  
        var jobtable = Ti.UI.createTableView({
                backgroundColor: "white",
                separatorStyle :"Titanium.UI.iPhone.TableViewSeparatorStyle.NONE"
        });
        jobtable.add(jobrow);*/
        
       $.labor_table.appendRow(jobrow);

};



//Add row here.
var sid = args.sid;
Alloy.Globals.Log("enterjobdetail.js::sid right before key in contents value: "+sid);
Alloy.Globals.Log("enterjobdetail.js::content.length: "+content.length);
var jobcommentdata = [];
for (i=0;i<content.length;i++){
		var notesbody = content[i].col2;
        var imageurl = content[i].col4;
        var date = content[i].col1;
        for (j=1;j<17;j++){
        	eval("jobcommentdata.push(content[i].col"+j+")"); // feed metadata
        }
        var employee = content[i].col5;
        jobDetailAddRow (date,notesbody,imageurl,jobcommentdata,employee); 
        var jobcommentdata = [];
        }


function closeWin(e) {
        Alloy.Globals.Log("enterjobdetail.js::e is: "+JSON.stringify(e));
}


function UploadPhotoToServer(imagemedia,parentid){
        Alloy.Globals.Log("enterjobdetail.js::UploadPhotoToServer:: Upload photo to the server.");
        var imageView = Titanium.UI.createImageView({
            image:imagemedia,
            width:300,
            height:300
        });
        var image = imageView.toImage();
        Alloy.Globals.Log("enterjobdetail.js::beginning to upload to the cloud.");
        var imagedatabase64 =  Ti.Utils.base64encode(image);
        var date = new Date();
        var imagefilename = filename+"_"+date.toString().replace(/ /g,'_');;
       // uploadPictoGoogle(image,"uploadphoto3.jpeg");
        uploadPictoGoogle(image,imagefilename,parentid);
        //Alloy.Globals.Log("enterjobdetail.js::UploadPhotoToServer::image sid is : " +imagesid);
}

function uploadFile(e){
       Alloy.Globals.Log("enterjobdetail.js::JSON stringify e uploadFile on parentid "+parentid+" : " +JSON.stringify(e));
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
   
   var win = Titanium.UI.createWindow({
                                        title:"Media",
                                        backgroundColor: "black"
                                });

function takePic(e){ 
        Alloy.Globals.Log("enterjobdetail.js::JSON stringify e takePic:" +JSON.stringify(e));
        Titanium.Media.showCamera({
                success:function(e){
                        if(e.mediaType === Titanium.Media.MEDIA_TYPE_PHOTO){
                               var imageView = Titanium.UI.createImageView({
                                        image:e.media,
                                        width:300,
                                        height:300
                                });
                                var image = imageView.toImage();
                                Alloy.Globals.Log("enterjobdetail.js::beginning to upload to the cloud.");
                                var date = new Date();
        						var imagefilename = filename+"_"+date.toString().replace(/ /g,'_');;
						        uploadPictoGoogle(image,imagefilename,parentid);
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
                		alert("error:"+e.code+": Unable to load camera.");
                        Alloy.Globals.Log("enterjobdetail::takePic::error:unable to load the camera");
                }, cancel:function(e){
                        Alloy.Globals.Log("enterjobdetail::takePic::cancel:unable to load the camera");
                        alert("error:"+e.code+": Unable to load camera.");
                },
                allowEditing:true,
                saveToPhotoGallery:true,
                mediaTypes:[Titanium.Media.MEDIA_TYPE_PHOTO,Titanium.Media.MEDIA_TYPE_VIDEO],
                videoQuality:Titanium.Media.QUALITY_HIGH
        });
        //win.open();
        }
        
        
        var win = Ti.UI.createWindow({
         backgroundColor: 'white'
        });

                
        var send = Titanium.UI.createButton({
            title : 'Send',
            style : Titanium.UI.iPhone.SystemButtonStyle.DONE,
        });
        
        var camera = Titanium.UI.createButton({
            systemButton : Titanium.UI.iPhone.SystemButton.CAMERA,
        });
        
        var cancel = Titanium.UI.createButton({
            systemButton : Titanium.UI.iPhone.SystemButton.CANCEL
        });
        
        var flexSpace = Titanium.UI.createButton({
            systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
        });
        
        var textfield = Titanium.UI.createTextField({
            borderStyle : Titanium.UI.INPUT_BORDERSTYLE_BEZEL,
            hintText : 'Focus to see keyboard with toolbar',
            keyboardToolbar : [cancel, flexSpace, camera, flexSpace, send],
            keyboardToolbarColor : '#999',
            backgroundColor : "white",
            keyboardToolbarHeight : 40,
            top : 10,
            width : Ti.UI.SIZE, height : Ti.UI.SIZE
        });


var sid = args.sid;
Alloy.Globals.Log("enterjobdetail.js::before notes_textarea hintText: JSON.stringify(args): "+JSON.stringify(args)+" sid:"+sid);
$.notes_textarea._hintText = sid; 
$.notes_textarea.addEventListener("return",function(e){
	e.source.value = e.source.value;
}); 
function save(){
	$.notes_textarea.blur();
};      
$.notes_textarea.addEventListener("blur",function(e){
        Alloy.Globals.Log("enterjobdetail.js::JSON.stringify(e)  :" +JSON.stringify(e));
        e.source.keyboardToolbar.items = null;
        enterNotes(e);
        e.source.value = "";
        //$.ktb_textarea.hide();
});
        
function enterNotes(e,imgurl) {
        Alloy.Globals.Log("enterjobdetail.js::JSON.stringify(e) enterNotes  :" +JSON.stringify(e));
        //$.enterjobdetail_window.show($.notes_textarea);
        //$.enterjobdetail_window.add(textfield);
        var date = new Date();
        var now = Date.now();var jobitemid = now;
        var employee = Titanium.App.Properties.getString('employee');
        var notesbody = e.value;
        var sourcesid = e.source._hintText;
        var imageurl = imgurl?imgurl:"none";
        var dataModel = Alloy.createModel("joblog",{
                                        col1 :  date || "none",
                                        col2 : notesbody || "none",
                                        col3 : imageurl,        
                                        col4 : "none", 
                                        col5 : employee,	
                                        col6:"none", col7:"none", col8:"none", col9:"none", 
                                        col10: sourcesid, 
                                        col11:"none",	col12:"none", col13:"none",	col14:"none", col15:"none",	
                                        col16: jobitemid 
 
                                });     
        dataModel.save();
        var joblog  = Alloy.Collections.instance('joblog');
        joblog.fetch();
        var content = joblog.toJSON();
        Alloy.Globals.Log("enterjobdetail.js::JSON stringify joblog after write: "+JSON.stringify(content));
        var thedate = date.toString().replace(".","").split(' ',4).toString().replace(/,/g,' ')+' '+Alloy.Globals.formatAMPM(date);
        //Alloy.Globals.Log("enterjobdetail.js::thedate is: " +thedate);
        jobDetailAddRow (thedate,notesbody,imageurl,"none",employee); //add to the local db
        submit(thedate,notesbody,imageurl,jobitemid,joblog,employee); //submit to the cloud
        
};

 function submit(thedate,notesbody,imageurl,jobitemid,joblog,employee) {  
        var thenone = "none";   
        var sid = args.sid;
        var imageurl = imageurl.replace('&','&amp;');
        //var imageurl = 'https://docs.google.com/uc?id=0B3XMbMJnSVEGS0lBXzVaLUFlZHM&amp;export=download';
        var xmldatastring = ['<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
        +'<gsx:col1>'+thedate+'</gsx:col1><gsx:col2>'+notesbody+'</gsx:col2><gsx:col3>'
        +thenone+'</gsx:col3><gsx:col4>'+imageurl+'</gsx:col4><gsx:col5>'
        +employee+'</gsx:col5><gsx:col6>'+thenone+'</gsx:col6><gsx:col7>'+thenone+'</gsx:col7><gsx:col8>'+thenone+'</gsx:col8><gsx:col9>'+thenone
        +'</gsx:col9><gsx:col10>'+sid+'</gsx:col10><gsx:col11>'+thenone+'</gsx:col11><gsx:col12>NA</gsx:col12><gsx:col13>NA</gsx:col13><gsx:col14>NA</gsx:col14>'
        +'<gsx:col15>NA</gsx:col15><gsx:col16>'+jobitemid+'</gsx:col16></entry>'].join('');
        Ti.API.info('xmldatastring to POST: '+xmldatastring);
        var xhr =  Titanium.Network.createHTTPClient({
    onload: function() {
        try {
                Ti.API.info(this.responseText); 
    			var xml = Titanium.XML.parseString(this.responseText);
	    		var entry = xml.documentElement.getElementsByTagName("entry");
	    		var link = xml.documentElement.getElementsByTagName("link");
	    		var idtag = xml.documentElement.getElementsByTagName("id").item(0).text;
	    		Alloy.Globals.Log("enterjobdetail.js::submit: number of link found: " +link+ " length: "+link.length);
	    		for (i=0;i<link.length;i++){			
	    			var listitem = link.item(i);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href");}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href");}
	    		}
	    		Titanium.App.Properties.setString('edithref',edithref);
	    		Titanium.App.Properties.setString('idtag',idtag);
	    		Titanium.App.Properties.setString('selfhref',selfhref);
	    		Ti.API.info("enterjobdetail.js::submit: self href is : "+selfhref+" edit href is: "+edithref);
	    		Ti.API.info("enterjobdetail.js::submit: idtag is : "+idtag);
	    		Alloy.Globals.Log("enterjobdetail.js::submit:: update DB with jobitemid :" +jobitemid);
				(joblog.get(jobitemid)) && joblog.get(jobitemid).set({
					col16:	idtag+"xCoLoNx"+selfhref+"xCoLoNx"+edithref+"xCoLoNx"+selfhref || "none",
				}).save();
			alert('Modified & Saved Successfully!');
        } catch(e){
                Ti.API.info("enterjobdetail.js::submit::cathing e: "+JSON.stringify(e));
        }     
    },
    onerror: function(e) {
        Alloy.Globals.Log("enterjobdetail.js::submit::error e: "+JSON.stringify(e));
        alert("error:"+e.code+": Please connect to the network.");
    }
});
        //var sid = Titanium.App.Properties.getString('joblog'); 
        //var sid = Titanium.App.Properties.getString('sid'); //sid need to correct//sid need to correct
        xhr.open("POST", 'https://spreadsheets.google.com/feeds/list/'+sid+'/od6/private/full');
        xhr.setRequestHeader("Content-type", "application/atom+xml");
        xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
        xhr.send(xmldatastring);
        Ti.API.info('done POSTed');
 }

var scope = ['https://spreadsheets.google.com/feeds', 'https://docs.google.com/feeds','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly','https://www.googleapis.com/auth/drive'];
scope.push ("https://www.googleapis.com/auth/drive.appdata");
scope.push ("https://www.googleapis.com/auth/drive.apps.readonly");
scope.push ("https://www.googleapis.com/auth/drive.file");
//scope.push ("https://www.googleapis.com/auth/plus.login");



//var jsonargs = JSON.stringify(args);
Alloy.Globals.Log("enterjobdetail.js::jsonargs : "+JSON.stringify(args));
var projectid = args.title.title.split(':')[15];
var firstname = args.title.title.split(':')[1];
var lastname = args.title.title.split(':')[2];
var filename = 'project_'+projectid+'_'+firstname+'_'+lastname;
Titanium.App.Properties.setString('filename',filename);
Alloy.Globals.Log("enterjobdetail.js::value derived from args: projectid: "+projectid+" firstname: "+firstname+" lastname: "+lastname);
//var filename = "project"+jsonargs.title.split(':')[15];
//display customer name and jobid on tableview section.
$.name_section.headerTitle = firstname+" "+lastname+"    Project#: "+projectid;

function createSpreadsheet(filename,parentid) {
	Alloy.Globals.Log("enterjobdetail.js::create ss with filename: "+filename+" and parentid: "+parentid);
	var jsonpost = '{'
		 +'\"title\": \"'+filename+'\",'
		 +'\"shared\": \"true\",'
		 +'\"parents\": ['
		  +'{'
		   +'\"id\": \"0AHXMbMJnSVEGUk9PVA\"'
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
	    		Alloy.Globals.Log("enterjobdetail.js::sid : "+sid);
	    		populatejoblogSIDtoDB(filename,sid);
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		alert("error:"+e.code+": Please connect to the network.");
		Alloy.Globals.Log("enterjobdetail::createSpreadsheet::Unable to connect to the cloud. error is: "+JSON.stringify(e));
	};
	xhr.open("POST", 'https://www.googleapis.com/drive/v2/files');	
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
    Alloy.Globals.Log("enterjobdetail.js::json post: "+jsonpost);
	xhr.send(jsonpost);
}


var jsonlist = " ";
function fileExist(){
		var jsonlist = " ";
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var jsonlist = JSON.parse(this.responseText);
	    		Ti.API.info("response of jsonlist is: "+JSON.stringify(jsonlist));
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
			Alloy.Globals.Log("enterjobdetail.js::jsonlist.items.length: "+jsonlist.items.length);
			var filename = Titanium.App.Properties.getString('filename');
			filelist = [];
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("enterjobdetail.js::File DOES NOT EXIST");
				var fileexist = "false";
				createSpreadsheet(filename,parentid);  // create file when does not exists
			} else {
				var fileexist = "true";
				Alloy.Globals.Log("enterjobdetail.js::enterjobdetail.js::fileExist:: File exist. sid is: "+jsonlist.items[0].id+" Skipped.");
				populatejoblogSIDtoDB(filename,sid);
			};
		}
		});
	xhr.onerror = function(e){
		Alloy.Globals.Log("enterjobdetail::fileExist::Unable to connect to the cloud. error is: "+JSON.stringify(e));
		alert("error:"+e.code+": Please connect to the network.");
	};
	//xhr.open("GET", 'https://www.googleapis.com/drive/v2/files');
	var rawquerystring = '?q=title+%3D+\''+filename+'\'+and+mimeType+%3D+\'application%2Fvnd.google-apps.spreadsheet\'+and+trashed+%3D+false&fields=items(id%2CmimeType%2Clabels%2Ctitle)';
	//xhr.open("GET", 'https://www.googleapis.com/drive/v2/files?q=title+%3D+\'project_1_Phakhruddin_Abdullah\'&fields=items(mimeType%2Clabels%2Ctitle)');
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files'+rawquerystring);
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
}

//fileExist();
///var parentid = Titanium.App.Properties.getString('parentid');
var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
var name = kraniemailid.split('@')[0].trim();
var parentid = Titanium.App.Properties.getString(name+"_project");
Alloy.Globals.Log("enterjobdetail.js:: parentid derived from Titanium.App.Properties.getString("+name+"_project) is: "+parentid); 
//createSpreadsheet(filename,parentid); 


var file = Ti.Filesystem.getFile(
				Ti.Filesystem.tempDirectory, "joblogsid.txt"
			);
		var joblogsidfile =	file.read().text;
		//var joblogsidfilejson =	JSON.parse(joblogsidfile);
Alloy.Globals.Log("enterjobdetail.js::joblogsidfile" +joblogsidfile);
//Alloy.Globals.Log("enterjobdetail.js::JSON.stringify(joblogsidfilejson)" +joblogsidfilejson);

function populatejoblogSIDtoDB(filename,sid) {
	       var dataModel = Alloy.createModel("joblogsid",{
                                        col1 :  filename || "none",
                                        col2 : sid || "none",
                                        col3 : "none",col4:"none", col5:"none",	col6:"none", col7:"none", col8:"none", col9:"none", 
                                        col10:"none", col11:"none",	col12:"none", col13:"none",	col14:"none", col15:"none",	col16:"none"
                                });     
        dataModel.save();
	var thejoblogsid = Alloy.Collections.instance('joblogsid');
	thejoblogsid.fetch();
	Ti.API.info(" enterjobdetail.js::populatejoblogSIDtoDB:: thejoblogsid : "+JSON.stringify(thejoblogsid));
	}

//Retrieve cloud data again

var sid = args.sid;
Ti.API.info("sid for joblog in enterjobdetail.js : "+sid);
Alloy.Globals.getPrivateData(sid,"joblog");

function uploadPictoGoogle(image,filename,parentid){
	Alloy.Globals.Log("enterjobdetail.js::uploadPictoGoogle::create ss with filename: "+filename);
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
	 		Alloy.Globals.Log("enterjobdetail.js::uploadPictoGoogle:: URL: "+url+" "+meta);
	 		var xhr =  Titanium.Network.createHTTPClient({
			    onload: function() {
			    	try {
			    		var json = JSON.parse(this.responseText);
	    				Ti.API.info("enterjobdetail.js::uploadPictoGoogle::response is: "+JSON.stringify(json));
	    				var id = json.id;
	    				var webcontentlink = json.webContentLink;
	    				Ti.API.info("enterjobdetail.js::uploadPictoGoogle::id is: "+id+" webcontentlink: "+webcontentlink);
	    				shareAnyonePermission(id);
	    				var e = {"value":"none","source":{"_hintText":id}};
	    				Alloy.Globals.Log("enterjobdetail.js::uploadPictoGoogle::entering urlimage with info below e: "+JSON.stringify(e));
	    				enterNotes(e,webcontentlink);
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

function shareAnyonePermission(sid){
	Alloy.Globals.Log("enterjobdetail.js::shareAnyonePermission::sid: "+sid);
	var jsonpost = '{'
		 +'\"role\": \"reader\",'
		 +'\"type\": \"anyone\"'
		+'}';
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Ti.API.info("enterjobdetail.js::shareAnyonePermission::response is: "+this.responseText);
	    	} catch(e){
				Ti.API.info("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		Alloy.Globals.Log("enterjobdetail::shareAnyonePermission::Unable to connect to the cloud. error is: "+JSON.stringify(e));
		alert("error:"+e.code+": Please connect to the network.");
	};
	xhr.open("POST", 'https://www.googleapis.com/drive/v2/files/'+sid+'/permissions');	
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
    Alloy.Globals.Log("enterjobdetail.js::shareAnyonePermission::json post: "+jsonpost);
	xhr.send(jsonpost);
}

var headertitle = args.title.title.split(':')[0];
Alloy.Globals.Log("enterjobdetails:headerTitle:: " +headertitle);
$.joblogsection.headerTitle = headertitle;

$.labor_table.addEventListener("delete", function(e){
	Alloy.Globals.Log("enterjobdetail.js::$.labor_table delete: "+JSON.stringify(e));
	if (metadata != "none") {
		var metadata = e.row.metadata[13];
		if (metadata) {
			var urls = metadata.replace(/yCoLoNy/g,':').replace(/xCoLoNx/g,',');
			var existingurlsidtag = urls.split(',')[0];
			var existingurlsselfhref = urls.split(',')[1];
			var existingurlsedithref = urls.split(',')[2];
			var uniqueid = e.row.metadata[15];
			Alloy.Collections.joblog.deleteCol16(uniqueid); //deleting the database
			Alloy.Globals.Log("enterjobdetail.js::$.labor_table delete: idtag:"+existingurlsidtag+" selfhref: "+existingurlsselfhref+" edithref: "+existingurlsedithref);
			var xhr = Ti.Network.createHTTPClient({
			    onload: function(e) {
			    try {
			    		Ti.API.info("enterjobdetail.js::$.labor_table delete:success e: "+JSON.stringify(e));
			    		Ti.API.info("enterjobdetail.js::$.labor_table delete:response is: "+this.responseText);
			    	} catch(e){
						Ti.API.info("enterjobdetail.js::$.labor_table delete:cathing e: "+JSON.stringify(e));
					}
				}
			});
			xhr.open("DELETE", existingurlsedithref);	
			//xhr.setRequestHeader("Content-type", "application/json");
		    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
			if (existingurlsedithref) {xhr.send();} else {Alloy.Globals.Log("enterjobdetail.js::$.labor_table delete: NO edithref. abort delete ");}
			Alloy.Globals.Log("enterjobdetail.js::$.labor_table delete: DONE: DELETE "+existingurlsedithref);
		} else {
			Alloy.Globals.Log("enterjobdetail.js:: metadata is empty : need refresh");
			alert("Please refresh in order to delete");
		}

	} else {
		Alloy.Globals.Log("enterjobdetail.js:: metadata is none : "+metadata);
	}
	
});

//Select which ones to be included in the report
$.labor_table.addEventListener("click",function(e){
	Alloy.Globals.Log("enterjobdetail.js::$.labor_table JSON.stringify(e): "+JSON.stringify(e));
	var jobitemid = e.row.metadata[15];
	Alloy.Globals.Log("enterjobdetail.js::jobitemid: "+jobitemid);
	switch(e.source.image) {
	    case "EditControl.png":
	       	e.source.image="EditControlSelected.png";
	        var joblog = Alloy.Collections.instance('joblog');
        	joblog.fetch();
        	Alloy.Collections.joblog.deleteCol16(jobitemid);
        	joblog.get(jobitemid).set({
        		col1: e.row.metadata[0],
        		col2: e.row.metadata[1],
        		col3: e.row.metadata[2],
        		col4: e.row.metadata[3],
        		col5: e.row.metadata[4],
        		col6:"report",
        		col7: "none",col8: "none",col9: "none",col11: "none",col12: "none",col13: "none",col15: "none",
        		col10: e.row.metadata[9],
        		col14: e.row.metadata[13],
        		col16: jobitemid	
    			}).save();
        	Alloy.Globals.Log("enterjobdetail.js::update joblog on itemid "+jobitemid+" JSON.stringify(joblog): "+JSON.stringify(joblog));
	        break;
	    case "EditControlSelected.png": 
	    	e.source.image="EditControl.png";
	        var joblog = Alloy.Collections.instance('joblog');
        	joblog.fetch();
        	Alloy.Collections.joblog.deleteCol16(jobitemid);
        	joblog.get(jobitemid).set({
        		col1: e.row.metadata[0],
        		col2: e.row.metadata[1],
        		col3: e.row.metadata[2],
        		col4: e.row.metadata[3],
        		col5: e.row.metadata[4],
        		col6:"none",
        		col7: "none",col8: "none",col9: "none",col11: "none",col12: "none",col13: "none",col15: "none",
        		col10: e.row.metadata[9],
        		col14: e.row.metadata[13],
        		col16: jobitemid	
    			}).save();
        	Alloy.Globals.Log("enterjobdetail.js::update joblog on itemid "+jobitemid+" JSON.stringify(joblog): "+JSON.stringify(joblog));
	        break;
    }
});

var refresh = Ti.UI.createRefreshControl({
    tintColor:'orange'
});

$.labor_table.refreshControl=refresh;

refresh.addEventListener('refreshstart',function(e){
	if(sid){Alloy.Globals.getPrivateData(sid,"project");};
	setTimeout(function(){
		
		/*
        Alloy.Globals.Log('credit::refresh:: JSON.stringify(e): '+JSON.stringify(e));
        var content=Alloy.Globals.fetchingData('creditmodel');
		Alloy.Globals.Log("credit.js::JSON stringify content: "+JSON.stringify(content));*/
        refresh.endRefreshing();
    }, 2000);
});

//genJoblog = args.functionfromSource;

function getReport(){
	var joblogs = Alloy.Collections.instance('joblog');
	joblogs.fetch();	
	var thejoblog = joblogs.where({col6:"report"}); //FILTER
		if (thejoblog.length > 0 ){
		for (j=0;j<thejoblog.length;j++){
			   var thejoblogjson = thejoblog[j].toJSON(); // EXTRACT ONE ROW. IF MANY. FOR LOOP.
    		   Alloy.Globals.Log("enterjobdetail.js::thejoblogjson.col2 :"+thejoblogjson.col2+" col4: "+thejoblogjson.col4+" col6: "+thejoblogjson.col6+" col16: "+thejoblogjson.col16);
		}
	}
	Alloy.Globals.Log("projectdetail.js: genReport: execute the source genJoblog()");
	genJoblog();
}

$.enterjobdetail_window.addEventListener("close",function(){
	var content;
	Alloy.Globals.Log("enterjobdetail.js:: enterjobdetail_window close: clear contents: "+JSON.stringify(content));
});
