var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.enterpayment_window);
  Alloy.Globals.Log("This is child widow checking _tab on : " +JSON.stringify(_tab));
  Alloy.Globals.Log(" input details after tab enterpayment : "+JSON.stringify(args));
};


//extract information received from invoicedetails. START
var data = args.title.title.split(':'); 
var invoicenumber = data[0]; 
var firstname = data[1]; 
var lastname = data[2]; 
var total = data[3]; $.notes_textarea.total = total;
var balance = data[4];
var paid = data[5];
var lastpaiddate = data[6];
var followupdate = data[7];
var phone = data[8];
var email = data[9];
var duedate = data[10];
var notes = data[11];
var status = data[12];
var currency = data[14];
var filename = 'payment_'+invoicenumber+'_'+firstname+'_'+lastname;
var idtag = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[0].replace('yCoLoNy',':'):"none";
var selfhref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[1].replace('yCoLoNy',':'):"none";
var edithref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[2].replace('yCoLoNy',':'):"none";
// Extraction END

callbackFunction = args.callbackFunction;
myRefresher = args.myRefreshercallBack;
	

function checkClick(e){
	Alloy.Globals.Log("enterpayment.js::transform is JSON.stringify(e) ::" +JSON.stringify(e));
}


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
        ///Alloy.Globals.Log("enterpayment.js::transform is ::" +JSON.stringify(transform));
        transform.title = transform.col1+":"+transform.col2+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"
                                                +transform.col8+":"+transform.col9+":"+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13
                                                +":"+transform.col14+":"+transform.col15+":"+transform.col16;
        transform.date = "Date: "+transform.col1;
        transform.notes = "Notes: "+transform.col2;
        transform.img = (transform.col4)?transform.col4:"none";
        
        lat1=transform.col8;
        lon1=transform.col9;
        transform.address = "Lat: "+transform.col8+" , Lon:"+transform.col9;
        var newRow = Ti.UI.createTableViewRow({});
        var newImageView = Ti.UI.createImageView({
                image : transform.img,
                height: 300,
                width: 300
        });     
        var imageRow = newRow.add(newImageView);
        //$.labor_table.setData($.payment_row);
        return transform;
}

var payment = Alloy.Collections.instance('payment');
var content = payment.toJSON();
Alloy.Globals.Log("enterpayment.js::JSON stringify content: "+JSON.stringify(content));

function setDate(e){
	Alloy.Globals.Log("enterpayment.js::JSON stringify content: "+JSON.stringify(e));
	var date = e.value;
    var datesplit = date.toDateString().split(' ');
    //var datepaid = datesplit[1]+" "+datesplit[2]+" "+datesplit[3];
    var datepaid = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
    Alloy.Globals.Log("enterpayment.js::setDate: date: "+date+" datesplit: "+datesplit+" datepaid: "+datepaid);
	$.dateLabel.text = datepaid;
	$.notes_textarea.datepaid = datepaid;
}
//Date Picker

function jobDetailAddRow (date,notesbody,imageurl,dateadded,employee) {
		Alloy.Globals.Log("enterpayment.js::jobDetailAddRow: date: "+date+"  dateadded: "+dateadded+" new Date(+dateadded): "+new Date(+dateadded));
	    var jobrow = Ti.UI.createTableViewRow ({
                backgroundColor: "white",
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
                text : new Date(+dateadded).toLocaleString()
        });
        var datepaid = Ti.UI.createLabel ({
                color : "#333",
                font : {
                	fontSize : 24
                },
                left  : "20",
                textAlign : "Ti.UI.TEXT_ALIGNMENT_LEFT",
                top : "50",
                text : date.toLocaleString()
                //text : date.toString().split(' ')[1]+" "+date.toString().split(' ')[2]+" "+date.toString().split(' ')[3]
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
                        fontSize: "24"
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
                width:"30%",
                height:"Ti.UI.Size",
                left:"60%",
                top:"40",
                backgroundColor:"white",
                borderRadius:"10",
                borderWidth:"0.1",
                borderColor:"white"
        });
        jobrow.add(datelabel);
        jobrow.add(datepaid);
        jobrow.add(employeelabel);
        jobrow.add(blueline);
        if ( notesbody != "none" ) {
                innerview.add(noteslabel);
                noteslabel.top = 10;
                var noteslabelheight = ((Math.round(notesbody.split('').length/50)+(notesbody.split(/\r?\n|\r/).length))*14)+14;            
                innerview.height = 20+noteslabelheight;  
        } else {      
                imagelabel.height = Ti.UI.SIZE;
                imagelabel.width = 340;
        };
        if (imageurl != "none") {
        	jobrow.add(imagelabel);
            var jobrow = Ti.UI.createTableViewRow ({
                backgroundColor: "white",
                opacity:"0",
                color:"transparent",
                width: Ti.UI.FILL,
                height: Ti.UI.SIZE
        		});
        	};
        if ( notesbody != "none" && imageurl != "none") {
                imagelabel.top = 50;
                noteslabel.top = 220;
        };
        jobrow.add(innerview);
        jobrow.add(datelabel);
        jobrow.add(employeelabel);
        jobrow.add(blueline);
        jobrow.metadata = dateadded; // add metadata info
        
        var jobtable = Ti.UI.createTableView({
                backgroundColor: "white",
                separatorStyle :"Titanium.UI.iPhone.TableViewSeparatorStyle.NONE"
        });
        jobtable.add(jobrow);
        
        $.labor_table.appendRow(jobrow);
        
        //calculate total pay
        if (notesbody && notesbody != "none") {
        	var paid = parseFloat(paid)+parseFloat(notesbody);
        }     
};

//Add row here.
var sid = args.sid;
Alloy.Globals.Log("enterpayment.js::sid right before key in contents value: "+sid);
Alloy.Globals.Log("enterpayment.js::content.length: "+content.length);
var paidamount = 0;
for (i=0;i<content.length;i++){
		var notesbody = content[i].col2;
        var imageurl = content[i].col4;
        var date = content[i].col1;
        var dateadded = content[i].col16;
        var employee = content[i].col5;
        jobDetailAddRow (date,notesbody,imageurl,dateadded,employee);  
        // calculate total
        var paidamount = parseFloat(notesbody) + paidamount   ;
        }
Alloy.Globals.Log("enterpayment.js::paidamount : "+paidamount);
//$.labor_table.appendRow(jobrowentry);

function closeWin(e) {
        Alloy.Globals.Log("enterpayment.js::e is: "+JSON.stringify(e));
}

function UploadPhotoToServer(imagemedia){
        Alloy.Globals.Log("enterpayment.js::UploadPhotoToServer:: Upload photo to the server.");
        var imageView = Titanium.UI.createImageView({
            image:imagemedia,
            width:300,
            height:300
        });
        var image = imageView.toImage();
        Alloy.Globals.Log("enterpayment.js::beginning to upload to the cloud.");
        var imagedatabase64 =  Ti.Utils.base64encode(image);
        var date = new Date();
        var imagefilename = filename+"_"+date.toString().replace(/ /g,'_');;
       // uploadPictoGoogle(image,"uploadphoto3.jpeg");
        uploadPictoGoogle(image,imagefilename);
        //Alloy.Globals.Log("enterpayment.js::UploadPhotoToServer::image sid is : " +imagesid);
}

function uploadFile(e){
        Alloy.Globals.Log("enterpayment.js::JSON stringify e uploadFile : " +JSON.stringify(e));
       Titanium.Media.openPhotoGallery({
           success:function(event)
           {             
               Ti.API.debug('Our type was: '+event.mediaType);
               if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO)
               {
                   UploadPhotoToServer(event.media);
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
        Alloy.Globals.Log("enterpayment.js::JSON stringify e takePic:" +JSON.stringify(e));
        Titanium.Media.showCamera({
                success:function(e){
                        if(e.mediaType === Titanium.Media.MEDIA_TYPE_PHOTO){
                               var imageView = Titanium.UI.createImageView({
                                        image:e.media,
                                        width:300,
                                        height:300
                                });
                                var image = imageView.toImage();
                                Alloy.Globals.Log("enterpayment.js::beginning to upload to the cloud.");
                                var date = new Date();
        						var imagefilename = filename+"_"+date.toString().replace(/ /g,'_');;
						        uploadPictoGoogle(image,imagefilename);
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
                        Alloy.Globals.Log("enterpayment::takePic::error:unable to load the camera");
                        alert("error:"+e.code+": Unable to load camera.");
                }, cancel:function(e){
                		alert("error:"+e.code+": Unable to load camera.");
                        Alloy.Globals.Log("enterpayment::takePic::cancel:unable to load the camera");
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
Alloy.Globals.Log("enterpayment.js::before notes_textarea hintText: JSON.stringify(args): "+JSON.stringify(args)+" sid:"+sid);
$.notes_textarea._hintText = "100";           
$.notes_textarea.addEventListener("blur",function(e){
        Alloy.Globals.Log("enterpayment.js::JSON.stringify(e)  :" +JSON.stringify(e));
        e.source.keyboardToolbar.items = null;
        var datepaid = e.source.datepaid;
       // $.paymentdonebutton.datepaid = datepaid;
        if (datepaid) {
        	Alloy.Globals.Log("enterpayment.js::before enterNotes(e): JSON.stringify(e): "+JSON.stringify(e));
        	enterNotes(e);
        	e.source.value = "";
        } else {
        	alert("Please select date");
        }
        
        //$.ktb_textarea.hide();
});
/*
$.paymentdonebutton.addEventListener("click",function(e){
    Alloy.Globals.Log("enterpayment.js::paymentdone:JSON.stringify(e)  :" +JSON.stringify(e));
 	$.notes_textarea.blur();
});*/
        
function enterNotes(e,imgurl) {
        Alloy.Globals.Log("enterpayment.js::JSON.stringify(e) enterNotes  :" +JSON.stringify(e));
        //$.enterpayment_window.show($.notes_textarea);
        //$.enterpayment_window.add(textfield);
        var date = new Date();
        var now = Date.now().toString();
        var jobitemid = now;      
        var employee = Titanium.App.Properties.getString('employee');
        var payment = parseFloat(e.value);
        var notesbody = payment.toFixed(2);
        var datepaid = e.source.datepaid;
        var sourcesid = e.source._hintText;
        var paidamount = e.source.paidamount;
        var imageurl = imgurl?imgurl:"none";
        Alloy.Globals.Log("enterpayment.js:: jobitemid is:"+jobitemid+" paidamount: "+paidamount+" payment: "+payment);
        var dataModel = Alloy.createModel("payment",{
                                        col1 : datepaid || "none",
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
        var payment  = Alloy.Collections.instance('payment');
        payment.fetch();
        var content = payment.toJSON();
        Alloy.Globals.Log("enterpayment.js::JSON stringify payment after write: "+JSON.stringify(content));
        var thedate = date.toString().replace(".","").split(' ',4).toString().replace(/,/g,' ')+' '+Alloy.Globals.formatAMPM(date);
        //Alloy.Globals.Log("enterpayment.js::thedate is: " +thedate);
        var dateadded = jobitemid;
        jobDetailAddRow (datepaid,notesbody,imageurl,dateadded,employee); //add to the local db
        submit(datepaid,notesbody,imageurl,jobitemid,payment,employee); //submit to the cloud
        var paidamount = paidamount + parseFloat(notesbody);
        var total = e.source.total;
        var balance = parseFloat(total)-parseFloat(paidamount);
        Alloy.Globals.Log("enterpayment.js::enterNotes: paidamount , parseFloat(notesbody) : "+paidamount+" + "+parseFloat(notesbody));
        $.paymentsection.headerTitle = firstname+" "+lastname+"    PAID: "+paidamount;
        ///updateInvoice(paidamount,datepaid,balance); //update invoice spreadsheet
        //Alloy.Globals.UpdateSSDBthenFetch("payment"); //load the data back
        callbackFunction(paidamount,balance,datepaid); //update the dummy
        
};

 function submit(thedate,notesbody,imageurl,jobitemid,payment,employee) {  
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
        Alloy.Globals.Log('xmldatastring to POST: '+xmldatastring);
        var xhr =  Titanium.Network.createHTTPClient({
    onload: function() {
        try {
                Alloy.Globals.Log(this.responseText); 
    			var xml = Titanium.XML.parseString(this.responseText);
	    		var entry = xml.documentElement.getElementsByTagName("entry");
	    		var link = xml.documentElement.getElementsByTagName("link");
	    		var idtag = xml.documentElement.getElementsByTagName("id").item(0).text;
	    		Alloy.Globals.Log("enterpayment.js::submit: number of link found: " +link+ " length: "+link.length);
	    		for (i=0;i<link.length;i++){			
	    			var listitem = link.item(i);
	    			if (listitem.getAttribute("rel") == "edit"){ var edithref = listitem.getAttribute("href");}
	    			if (listitem.getAttribute("rel") == "self"){ var selfhref = listitem.getAttribute("href");}
	    		}
	    		Titanium.App.Properties.setString('edithref',edithref);
	    		Titanium.App.Properties.setString('idtag',idtag);
	    		Titanium.App.Properties.setString('selfhref',selfhref);
	    		Alloy.Globals.Log("enterpayment.js::submit: self href is : "+selfhref+" edit href is: "+edithref);
	    		Alloy.Globals.Log("enterpayment.js::submit: idtag is : "+idtag);
	    		Alloy.Globals.Log("enterpayment.js::submit:: update DB with jobitemid :" +jobitemid+" sid: "+sid);
				payment.get(jobitemid).set({
					col16:	idtag+"xCoLoNx"+selfhref+"xCoLoNx"+edithref+"xCoLoNx"+selfhref || "none",
				}).save();
			alert('Modified & Saved Successfully!');
        } catch(e){
                Alloy.Globals.Log("enterpayment.js::submit:: sid:"+sid+" :cathing e: "+JSON.stringify(e));
        }     
    },
    onerror: function(e) {
        Alloy.Globals.Log("enterpayment.js::submit::error e: "+JSON.stringify(e));
       alert("error:"+e.code+": Please connect to the network.");
    }
});
        //var sid = Titanium.App.Properties.getString('payment'); 
        //var sid = Titanium.App.Properties.getString('sid'); //sid need to correct//sid need to correct
        xhr.open("POST", 'https://spreadsheets.google.com/feeds/list/'+sid+'/od6/private/full');
        xhr.setRequestHeader("Content-type", "application/atom+xml");
        xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
        xhr.send(xmldatastring);
        Alloy.Globals.Log('done POSTed');
 }

var scope = ['https://spreadsheets.google.com/feeds', 'https://docs.google.com/feeds','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly','https://www.googleapis.com/auth/drive'];
scope.push ("https://www.googleapis.com/auth/drive.appdata");
scope.push ("https://www.googleapis.com/auth/drive.apps.readonly");
scope.push ("https://www.googleapis.com/auth/drive.file");
//scope.push ("https://www.googleapis.com/auth/plus.login");



//var jsonargs = JSON.stringify(args);
Alloy.Globals.Log("enterpayment.js::jsonargs : "+JSON.stringify(args));
var firstname = args.firstname;
var lastname = args.lastname;
var invoicenumber = args.invoicenumber;
var filename = 'project_'+invoicenumber+'_'+firstname+'_'+lastname;
Titanium.App.Properties.setString('filename',filename);
$.paymentsection.headerTitle = firstname+" "+lastname+"    PAID: "+paidamount;
$.notes_textarea.paidamount = paidamount;
Alloy.Globals.Log("enterpayment.js::value derived from args: invoicenumber: "+invoicenumber+" firstname: "+firstname+" lastname: "+lastname);
//var filename = "project"+jsonargs.title.split(':')[15];
function getParentFolder(args) {
	var sid = Titanium.App.Properties.getString('payment');
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var json = JSON.parse(this.responseText);
	    		Alloy.Globals.Log("response is: "+JSON.stringify(json));
	    		var parentid = json.items[0].id;
	    		Titanium.App.Properties.setString('parentid',parentid);
	    		Alloy.Globals.Log("enterpayment.js::args inside getParentFolder: "+JSON.stringify(args));
	    		//var filename = 'test03';
	    		//createSpreadsheet(filename,parentid);    		
	    	} catch(e){
				Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
			}
			return parentid;
		}
		});
	xhr.onerror = function(e){
		alert("error:"+e.code+": Please connect to the network.");
		Alloy.Globals.Log("enterpayment::getParentFolder::Unable to connect to the cloud. error is: "+JSON.stringify(e));
	};
	xhr.open("GET", 'https://www.googleapis.com/drive/v2/files/'+sid+'/parents');
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send();
};


function createSpreadsheet(filename,parentid) {
	Alloy.Globals.Log("enterpayment.js::create ss with filename: "+filename+" and parentid: "+parentid);
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
	    		Alloy.Globals.Log("response is: "+this.responseText);
	    		var json = JSON.parse(this.responseText);
	    		var sid = json.id;
	    		Alloy.Globals.Log("enterpayment.js::sid : "+sid);
	    		populatepaymentSIDtoDB(filename,sid);
	    	} catch(e){
				Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		alert("error:"+e.code+": Please connect to the network.");
		Alloy.Globals.Log("enterpayment::createSpreadsheet::Unable to connect to the cloud. error is: "+JSON.stringify(e));
	};
	xhr.open("POST", 'https://www.googleapis.com/drive/v2/files');	
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
    Alloy.Globals.Log("enterpayment.js::json post: "+jsonpost);
	xhr.send(jsonpost);
}


var jsonlist = " ";
function fileExist(){
		var jsonlist = " ";
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		var jsonlist = JSON.parse(this.responseText);
	    		Alloy.Globals.Log("response of jsonlist is: "+JSON.stringify(jsonlist));
	    	} catch(e){
				Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
			}
			Alloy.Globals.Log("enterpayment.js::jsonlist.items.length: "+jsonlist.items.length);
			var filename = Titanium.App.Properties.getString('filename');
			filelist = [];
			if (jsonlist.items.length == "0" ){
				Alloy.Globals.Log("enterpayment.js::File DOES NOT EXIST");
				var fileexist = "false";
				createSpreadsheet(filename,parentid);  // create file when does not exists
			} else {
				var fileexist = "true";
				Alloy.Globals.Log("enterpayment.js::enterpayment.js::fileExist:: File exist. sid is: "+jsonlist.items[0].id+" Skipped.");
				populatepaymentSIDtoDB(filename,sid);
			};
		}
		});
	xhr.onerror = function(e){
		alert("error:"+e.code+": Please connect to the network.");
		Alloy.Globals.Log("enterpayment::fileExist::Unable to connect to the cloud. error is : "+JSON.stringify(e));
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
var parentid = Titanium.App.Properties.getString('parentid');
//Alloy.Globals.Log("enterpayment.js::create spreadsheet with filename: "+filename+" and parentid: "+parentid); 
//createSpreadsheet(filename,parentid); 

/*
var file = Ti.Filesystem.getFile(
				Ti.Filesystem.tempDirectory, "paymentsid.txt"
			);
		var paymentsidfile =	file.read().text;
		//var paymentsidfilejson =	JSON.parse(paymentsidfile);
Alloy.Globals.Log("enterpayment.js::paymentsidfile" +paymentsidfile);
//Alloy.Globals.Log("enterpayment.js::JSON.stringify(paymentsidfilejson)" +paymentsidfilejson);*/

function populatepaymentSIDtoDB(filename,sid) {
	       var dataModel = Alloy.createModel("paymentsid",{
                                        col1 :  filename || "none",
                                        col2 : sid || "none",
                                        col3 : "none",col4:"none", col5:"none",	col6:"none", col7:"none", col8:"none", col9:"none", 
                                        col10:"none", col11:"none",	col12:"none", col13:"none",	col14:"none", col15:"none",	col16:"none"
                                });     
        dataModel.save();
	var thepaymentsid = Alloy.Collections.instance('paymentsid');
	thepaymentsid.fetch();
	Alloy.Globals.Log(" enterpayment.js::populatepaymentSIDtoDB:: thepaymentsid : "+JSON.stringify(thepaymentsid));
	}

//Retrieve cloud data again

var sid = args.sid;
Alloy.Globals.Log("enterpayment.js::sid for payment in enterpayment.js : "+sid);
Alloy.Globals.getPrivateData(sid,"payment");

function uploadPictoGoogle(image,filename){
	Alloy.Globals.Log("enterpayment.js::uploadPictoGoogle::create ss with filename: "+filename);
	var base64Data = Ti.Utils.base64encode(image);
	 		var parts = [];
	 		var bound = 287032396531387;
	 		var meta = '\{'
	 		+	'\"title\": \"'+filename+'\"'	 		
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
	    				Alloy.Globals.Log("enterpayment.js::uploadPictoGoogle::response is: "+JSON.stringify(json));
	    				var id = json.id;
	    				var webcontentlink = json.webContentLink;
	    				Alloy.Globals.Log("enterpayment.js::uploadPictoGoogle::id is: "+id+" webcontentlink: "+webcontentlink);
	    				shareAnyonePermission(id);
	    				var e = {"value":"none","source":{"_hintText":id}};
	    				Alloy.Globals.Log("enterpayment.js::uploadPictoGoogle::entering urlimage with info below e: "+JSON.stringify(e));
	    				enterNotes(e,webcontentlink);
			    	} catch(e){
			    		Alloy.Globals.Log("enterpayment.js::uploadPictoGoogle::cathing e: "+JSON.stringify(e));
			    	} 
			    	return id;    
			    },
			    onerror: function(e) {
			    	Alloy.Globals.Log("enterpayment.js::uploadPictoGoogle::error e: "+JSON.stringify(e));
			       alert("error:"+e.code+": Please connect to the network.");
			    }
			});
			xhr.open("POST", url);
			xhr.setRequestHeader("Content-type", "multipart/mixed; boundary=" + bound);
			xhr.setRequestHeader("Authorization", 'Bearer '+googleAuthSheet.getAccessToken());
			//xhr.setRequestHeader("Content-Length", "2000000");
			xhr.send(parts.join("\r\n"));
			Alloy.Globals.Log('done POSTed');
			//Alloy.Globals.Log("enterpayment.js::uploadPictoGoogle::sid outside is: "+id);
}

function shareAnyonePermission(sid){
	Alloy.Globals.Log("enterpayment.js::shareAnyonePermission::sid: "+sid);
	var jsonpost = '{'
		 +'\"role\": \"reader\",'
		 +'\"type\": \"anyone\"'
		+'}';
		var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Alloy.Globals.Log("enterpayment.js::shareAnyonePermission::response is: "+this.responseText);
	    	} catch(e){
				Alloy.Globals.Log("cathing e: "+JSON.stringify(e));
			}
		}
		});
	xhr.onerror = function(e){
		Alloy.Globals.Log("enterpayment::shareAnyonePermission::Unable to connect to the cloud. error is :"+JSON.stringify(e));
		alert("error:"+e.code+": Please connect to the network.");
	};
	xhr.open("POST", 'https://www.googleapis.com/drive/v2/files/'+sid+'/permissions');	
	xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
    Alloy.Globals.Log("enterpayment.js::shareAnyonePermission::json post: "+jsonpost);
	xhr.send(jsonpost);
}

var headertitle = args.title.title.split(':')[0];
Alloy.Globals.Log("enterpayments:headerTitle:: " +headertitle);
//$.paymentsection.headerTitle = headertitle;

$.labor_table.addEventListener("delete", function(e){
	Alloy.Globals.Log("enterpayment.js::$.labor_table delete: "+JSON.stringify(e));
	var metadata = e.row.metadata;
	var urls = metadata.replace(/yCoLoNy/g,':').replace(/xCoLoNx/g,',');
	var existingurlsidtag = urls.split(',')[0];
	var existingurlsselfhref = urls.split(',')[1];
	var existingurlsedithref = urls.split(',')[2];
	Alloy.Globals.Log("enterpayment.js::$.labor_table delete: idtag:"+existingurlsidtag+" selfhref: "+existingurlsselfhref+" edithref: "+existingurlsedithref);
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Alloy.Globals.Log("enterpayment.js::$.labor_table delete:success e: "+JSON.stringify(e));
	    		Alloy.Globals.Log("enterpayment.js::$.labor_table delete:response is: "+this.responseText);
	    	} catch(e){
				Alloy.Globals.Log("enterpayment.js::$.labor_table delete:cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.open("DELETE", existingurlsedithref);	
	//xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	if (existingurlsedithref) {xhr.send();} else {Alloy.Globals.Log("enterpayment.js::$.labor_table delete: NO edithref. abort delete ");}
	Alloy.Globals.Log("enterpayment.js::$.labor_table delete: DONE: DELETE "+existingurlsedithref);
});

function blurIT(e) {
	Alloy.Globals.Log("enterpayment.js::blurIT::JSON.stringify(e): "+JSON.stringify(e));
	$.notes_textarea.blur();
}


flexSpace = Titanium.UI.createButton({
    systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
});

$.notes_textarea.KeyboardToolbar = [flexSpace,$.donebutton];

// update existing invoice spreadsheeet on balance.

//function updateInvoice(edithref,selfhref,idtag,invoicenumber,clientfirstname,clientlastname,total,bal,paid,lastpaiddate,followupdate,clientphone,clientemail,duedate,currency,status){
function updateInvoice(paidamount,datepaid,balance){ 
		var paid = paidamount;    
		var lastpaiddate = datepaid;
		var xmldatastring = '<entry xmlns=\'http://www.w3.org/2005/Atom\' xmlns:gsx=\'http://schemas.google.com/spreadsheets/2006/extended\'>'
						+'<id>'+idtag+'</id>'
						+'<updated>2015-05-16T08:01:19.680Z</updated>'
						+'<category scheme=\'http://schemas.google.com/spreadsheets/2006\' term=\'http://schemas.google.com/spreadsheets/2006#list\'/>'
						+'<gsx:col1>'+invoicenumber+'</gsx:col1><gsx:col2>'+firstname+'</gsx:col2><gsx:col3>'
						+lastname+'</gsx:col3><gsx:col4>'+total+'</gsx:col4><gsx:col5>'
						+balance+'</gsx:col5><gsx:col6>'+paid+'</gsx:col6><gsx:col7>'+lastpaiddate+'</gsx:col7><gsx:col8>'+followupdate
						+'</gsx:col8><gsx:col9>'+phone+'</gsx:col9><gsx:col10>'+email+'</gsx:col10><gsx:col11>'+duedate
						+'</gsx:col11><gsx:col12>'+currency+'</gsx:col12><gsx:col13>'+status
						+'</gsx:col13><gsx:col14>NA</gsx:col14><gsx:col15>NA</gsx:col15><gsx:col16>NA</gsx:col16></entry>';
 		Alloy.Globals.Log("projectdetail.js::xmldatastring: "+xmldatastring);
       var xhr =  Titanium.Network.createHTTPClient({
   	   onload: function() {
        try {
                Alloy.Globals.Log("enterpayment.js::updateInvoice"+this.responseText); 
        } catch(e){
                Alloy.Globals.Log("enterpayment.js::updateInvoice::cathing e: "+JSON.stringify(e));
        }     
    },
    onerror: function(e) {
        Alloy.Globals.Log("enterpayment.js::updateInvoice::error e: "+JSON.stringify(e));
        alert("error:"+e.code+": Please connect to the network.");
    }
});
        xhr.open("PUT", ''+edithref+'');
        xhr.setRequestHeader("Content-type", "application/atom+xml");
        xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
        xhr.send(xmldatastring);
        Alloy.Globals.Log('done POSTed');
}

$.enterpayment_window.addEventListener("close",function(e){
	Alloy.Globals.Log("enterpayment.js::enterpayment_window.close(): "+JSON.stringify(e));
	myRefresher();
	Alloy.Collections.paymentsid.deleteAll();
});
