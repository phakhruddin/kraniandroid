var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.labor_window);
  Ti.API.info("This is child widow checking _tab : " +JSON.stringify(_tab));
   	$.labor_table.search = $.search_history;
	Alloy.Collections.labor.fetch();	
  
};

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
	    case "EditControl.png":
	        e.source.image="EditControlSelected.png";
	        setTimeout(function(){
	    		addLabor(e);      		
	    	},500);   	 
	        break;
	    case "EditControlSelected.png": 
	    	e.source.image="EditControl.png";
	        break;
	    default:
	
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

$.sortview.hide();
$.location_tab.addEventListener("focus",function(){
	$.sortview.show();
});
$.labor_table.addEventListener("scroll",function(){
	$.sortview.hide();
	$.location_tab.addEventListener("singletap",function(){$.sortview.show();});
});

function pulledEvent(e){
	Alloy.Globals.Cleanup();
	Alloy.Globals.Log("location.js:pulledEvent:use in callback: Alloy.Collections.labor.fetch()");
	Alloy.Collections.labor.fetch();
}



