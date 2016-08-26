var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.labor_window);
  Ti.API.info("This is child widow checking _tab : " +_tab);
   	$.labor_table.search = $.search_history;
	Alloy.Collections.labor.fetch();	
  
};
$.search_history.visible=false;//$.item2.seachhistory=false;

function rowAction(e){
		Alloy.Globals.Log("location.js::rowAction:: JSON.stringify(e): "+JSON.stringify(e));
		
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
	
		Ti.API.info('input details : '+title);
		var firstname = title.split(':')[1].trim();
		var lastname = title.split(':')[2].trim();
		var name = firstname+" "+lastname.trim();
		var latitude = title.split(':')[7].trim().toString();
		var longitude = title.split(':')[8].trim().toString();
		
		switch(e.source.image) {
	    case "/images/EditControl.png":
	        e.source.image="/images/EditControlSelected.png";
	        setTimeout(function(){
	    		addLabor(e);      		
	    	},500);   	 
	        break;
	    case "/images/EditControlSelected.png": 
	    	e.source.image="/images/EditControl.png";
	        break;
	    default:
	
		    Alloy.Globals.UpdateMap(latitude,longitude,name);
			
			var checked = Ti.UI.createImageView({
				top: 10,
				left: 300,
				height : 30,
				width : 30,
				image : "/images/check70.png"
			});
			
			if (args.source == "settings"){
				Alloy.Globals.Log("location.js: source is : "+args.source);
				Alloy.Globals.Log("location.js: JSON.stringify(e) : "+ JSON.stringify(e));
				e.row.titleid = "rowidimage";
				Alloy.Globals.Log("location.js: JSON.stringify(e) : "+ JSON.stringify(e));
			}
		} 
		/*
		//Alloy.Globals.UpdateMap('41.981233','-87.868259',"None");	
		
		Alloy.Globals.UpdateMap(latitude,longitude,name);
		
		var checked = Ti.UI.createImageView({
			top: 10,
			left: 300,
			height : 30,
			width : 30,
			image : "check70.png"
		});
		
		if (args.source == "settings"){
			Alloy.Globals.Log("location.js: source is : "+args.source);
			Alloy.Globals.Log("location.js: JSON.stringify(e) : "+ JSON.stringify(e));
			e.row.titleid = "rowidimage";
			Alloy.Globals.Log("location.js: JSON.stringify(e) : "+ JSON.stringify(e));
		}*/
}

function transformFunction(model) {
	var currentaddr;
	var transform = model.toJSON();
	///Alloy.Globals.Log("transform is ::" +JSON.stringify(transform));
	transform.title = transform.col1+":"+transform.col2+":"+transform.col3+":"+transform.col4+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"+transform.col8+":"+transform.col9+":"+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"+transform.col15+":"+transform.col16;
	transform.custom = transform.col2+"  "+transform.col3;
	transform.phone = "Phone: "+(transform.col5)?transform.col5.toString().replace(/^(...)(...)/g, "\($1\) $2-"):"";
	transform.email = "Email: "+transform.col6;
	transform.labelcolor = (transform.col5.length != 10)?"red":"#330"; //alert user to fix the phone number
	lat1=transform.col8;
	lon1=transform.col9;
	
	getAddress = function(latitude,longitude, callback){
    	Titanium.Geolocation.reverseGeocoder(latitude,longitude,function(evt)
        {
            ////Ti.API.info("reverse geolocation result = "+JSON.stringify(evt));
        	if(callback) {
            	callback.call(null, evt);
        	}
  		});
	};
	myCallback = function(e) {
    	//myComonent.setTitle(e.places.address);
    	///Alloy.Globals.Log("JSON stringify e after callback : " +JSON.stringify(e));
    	          places = e.places;
            if (places && places.length) {
						////Alloy.Globals.Log("JSON stringify : "+JSON.stringify(places));
						//currentaddr = places[0].address;
							currentaddr = places.address;				
					} else {
						currentaddr = "No address found";
			}
	};
 	if (lat1 && lon1) { getAddress(lat1,lon1, myCallback);};
	transform.address = "Lat: "+transform.col8+" , Lon:"+transform.col9;
	//transform.address = currentaddr?currentaddr:'No updated address';
	
	return transform;
}

function checkAllLoc() {
	Alloy.Globals.UpdateMap('all','all',"all");
}

function updateLoc() {
	Alloy.Globals.CheckLoc();
}

function doAdd(){
	var win = Titanium.UI.createWindow({title:"Add Employee",backgroundColor:'#DBDBDB'});
	var firstnameTextField = Ti.UI.createTextField({hintText:"Firstname", top:"10",left:"20",borderRadius:"0.25",color:"gray",font:{fontSize:"14"},width:"85%"});win.add(firstnameTextField);
	var lastnameTextField = Ti.UI.createTextField({hintText:"Lastname",top:"40",left:"20",borderRadius:"0.25",color:"gray",font:{fontSize:"14"},width:"85%"});win.add(lastnameTextField);
	var phoneTextField = Ti.UI.createTextField({hintText:"phone",keyboardType:Ti.UI.KEYBOARD_NUMBER_PAD,returnKeyType:Ti.UI.RETURNKEY_DONE,top:"70",left:"20",borderRadius:"0.25",color:"gray",font:{fontSize:"14"},width:"85%"});win.add(phoneTextField);
	var emailTextField = Ti.UI.createTextField({hintText:"email",top:"100",left:"20",borderRadius:"0.25",color:"gray",font:{fontSize:"14"},width:"85%"});win.add(emailTextField);
	var streetaddrTextField = Ti.UI.createTextField({hintText:"street address",top:"130",left:"20",borderRadius:"0.25",color:"gray",font:{fontSize:"14"},width:"85%"});win.add(streetaddrTextField);
	var cityTextField = Ti.UI.createTextField({hintText:"city",top:"160",left:"20",borderRadius:"0.25",color:"gray",font:{fontSize:"14"},width:"85%"});win.add(cityTextField);
	var stateTextField = Ti.UI.createTextField({hintText:"state",top:"190",left:"20",borderRadius:"0.25",color:"gray",font:{fontSize:"14"},width:"85%"});win.add(stateTextField);
	var companyTextField = Ti.UI.createTextField({hintText:"company",top:"220",left:"20",borderRadius:"0.25",color:"gray",font:{fontSize:"14"},width:"85%"});	win.add(companyTextField);
	var savelabelbutton = Ti.UI.createLabel({text:"Save",top:"260",right:"20",color:"#63D1F4"});win.add(savelabelbutton);
	win.open();	
};

function addLabor(e){
	Alloy.Globals.Log("location.js::addLabor:JSON.stringify(e): "+JSON.stringify(e));
	var item = "labor";
	var sid = Titanium.App.Properties.getString(item,"none");
	Alloy.Globals.getPrivateData(sid,item);
	if (e.row) {
		Alloy.Globals.Log("location.js::addLabor:e.row.title: "+e.row.title);
		var tabViewOneChildController = Alloy.createController("enteremployee",{
  		title:e.row.title,
  		callbackFunction : pulledEvent
  	});
	} else {
		var tabViewOneChildController = Alloy.createController("enteremployee");
	}
  	tabViewOneChildController.openMainWindow($.location_tab);	
}

var editbutton = Titanium.UI.createButton({
   systemButton:"CAMERA",
   left:"20"
});

function editAction(e){
	Alloy.Globals.Log("location.js::editAction:JSON.stringify(e): "+JSON.stringify(e));
}

function editEmployee(e){
	Alloy.Globals.Log("location.js::editEmployee:JSON.stringify(e): "+JSON.stringify(e));	
}

function pulledEvent(e){
	Alloy.Globals.Cleanup();
	Alloy.Globals.Log("location.js:pulledEvent:use in callback: Alloy.Collections.labor.fetch()");
	Alloy.Collections.labor.fetch();
}

function doSearch(e){
	Alloy.Globals.Log("client.js::doSearch : "+JSON.stringify(e));
	Alloy.Globals.Log("client.js::doSearch : JSON.stringify($.search_history) "+JSON.stringify($.search_history));
	var searchstatus = $.search_history.visible;
	Alloy.Globals.Log("client.js::doSearch : searchstatus "+searchstatus);
	if ($.search_history.visible) {$.search_history.visible=false;} else {$.search_history.visible=true;}
	Alloy.Globals.Log("client.js::doSearch : $.search_history.visible: "+$.search_history.visible);
	//$.table.setData([]);
	Alloy.Globals.Log("client.js::doSearch : JSON.stringify($.labor_table): "+JSON.stringify($.labor_table));
	Alloy.Globals.Log("client.js::doSearch : $.labor_table.sections.length:"+$.labor_table.sections.length+", $.labor_table.sections[0].rows.length:"+$.labor_table.sections[0].rows.length+", $.labor_table.sections[0].rows[0].children.length:"+$.labor_table.sections[0].rows[0].children.length);
	Alloy.Globals.Log("client.js::doSearch : JSON.stringify($.labor_table.sections[0].rows): "+JSON.stringify($.labor_table.sections[0].rows));
	for (i=0;i<$.labor_table.sections[0].rows.length;i++){
		Alloy.Globals.Log("client.js::doSearch : JSON.stringify($.labor_table.sections[0].rows[i]): "+JSON.stringify($.labor_table.sections[0].rows[i]));
		for(k=0;k<$.labor_table.sections[0].rows[i].length;k++){
			Alloy.Globals.Log("client.js::doSearch : JSON.stringify($.labor_table.sections[0].rows[i].children[k]): "+JSON.stringify($.labor_table.sections[0].rows[i].children[k]));
		}
	}
	//$.labor_table.setData([]);
	//Alloy.Globals.Log("client.js::doSearch : after $.labor_table.setData([]): JSON.stringify($.labor_table): "+JSON.stringify($.labor_table));
}
function doBack(){
	$.labor_window.close();
};

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



