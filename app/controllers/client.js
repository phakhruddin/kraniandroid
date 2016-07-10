var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.clientlist_window);
  Ti.API.info("This is child widow client.js"+_tab);
	$.clientlist_table.search = $.search_history;
	Alloy.Collections.client.fetch();	
};

function doAdd(){
	var win = Titanium.UI.createWindow({
        title:"Add Client",
        backgroundColor:'#DBDBDB'
    });
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

function doSearch(e){
	Alloy.Globals.Log("client.js::doSearch : "+JSON.stringify(e));
	Alloy.Globals.Log("client.js::doSearch : JSON.stringify($.search_history) "+JSON.stringify($.search_history));
	var searchstatus = $.search_history.visible;
	Alloy.Globals.Log("client.js::doSearch : searchstatus "+searchstatus);
	if ($.search_history.visible) {$.search_history.visible=false;} else {$.search_history.visible=true;}
	Alloy.Globals.Log("client.js::doSearch : $.search_history.visible: "+$.search_history.visible);
}
function doBack(){};

//action taken when window is closed.

Alloy.Globals.Log("client.js::JSON.stringify(args): " +JSON.stringify(args));

$.clientlist_table.search = $.search_history;
$.search_history.visible=false;//$.item2.seachhistory=false;

function openClientDetail(title){
	Alloy.Globals.Log("clientlist_table:openClientDetail: JSON.stringify(title) " +JSON.stringify(title));
}


$.clientlist_table.addEventListener("click", function(e){
	Alloy.Globals.Log("clientlist_table e : " +JSON.stringify(e));
	Alloy.Globals.Log("clientlist_table e.rowData.title : " +e.rowData.title);
	openClientDetail(e.rowData.title);
});


function transformFunction(model) {
	var transform = model.toJSON();
	///Alloy.Globals.Log("transform is ::" +JSON.stringify(transform));
	transform.title = transform.col1+":"+transform.col2+":"+transform.col3+":"+transform.col4+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"+transform.col8+":"+transform.col9+":"+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"+transform.col15+":"+transform.col16;
	transform.custom = transform.col2+"  "+transform.col3;
	transform.phone = "Phone: "+(transform.col5)?transform.col5.toString().replace(/^(...)(...)/g, "\($1\) $2-"):"";
	transform.email = "Email: "+transform.col6;
	transform.address = "Address: "+transform.col7+","+transform.col8+","+transform.col9;
	transform.labelcolor = (transform.col5.length != 10)?"red":"#330"; //alert user to fix the phone number
	return transform;
}
	

$.clientlist_table.addEventListener("delete", function(e){
	Alloy.Globals.Log("client.js::$.clientlist_table delete: "+JSON.stringify(e));
	var urls = e.row.title.split(':')[13].replace(/yCoLoNy/g,':').replace(/xCoLoNx/g,',');
	var existingurlsidtag = urls.split(',')[0];
	var existingurlsselfhref = urls.split(',')[1];
	var existingurlsedithref = urls.split(',')[2];
	Alloy.Globals.Log("client.js::$.clientlist_table delete: idtag:"+existingurlsidtag+" selfhref: "+existingurlsselfhref+" edithref: "+existingurlsedithref);
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Alloy.Globals.Log("client.js::$.clientlist_table delete:success e: "+JSON.stringify(e));
	    		Alloy.Globals.Log("client.js::$.clientlist_table delete:response is: "+this.responseText);
	    	} catch(e){
				Alloy.Globals.Log("client.js::$.clientlist_table delete:cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.open("DELETE", existingurlsedithref);	
	//xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	if (existingurlsedithref) {xhr.send();} else {Alloy.Globals.Log("client.js::$.clientlist_table delete: NO edithref. abort delete ");}
	Alloy.Globals.Log("client.js::$.clientlist_table delete: DONE: DELETE "+existingurlsedithref);
	pulledEvent();
});

function doRow(e){
	Alloy.Globals.Log("client.js::doRow click: "+JSON.stringify(e));
	var win = Titanium.UI.createWindow({title:"Client Details",backgroundColor:'#F5F5F5'});
	var activity = win.activity;	
	var subject = ['firstname','lastname','company','phone','email','streetaddr','city','state','country'];
	for (i=0;i<subject.length;i++){
		eval(subject[i]+" =  e.rowData.title.split(':')["+parseFloat(i+1)+"].trim()");
		Alloy.Globals.Log("client.js::doRow array: "+firstname);
		eval("var "+subject[i]+"label = Ti.UI.createLabel({text:"+subject[i]+",top:14,color:'#3B3B3B',font:{fontSize:'14'},textAlign:'Ti.UI.TEXT_ALIGNMENT_CENTER'})");
		eval("var view = Titanium.UI.createView({top:parseFloat(40)*parseFloat("+i+"),height:'39',width:'95%',layout:'vertical',backgroundColor:'#FAFAFA',borderColor:'#EDEDED',borderRadius:'10',borderWidth:'0.1'})");
		eval("view.add("+subject[i]+"label)");
		win.add(view);
	}	
	
	var firstnameTextField = Ti.UI.createTextField({hintText:firstname,color:"black",font:{fontSize:"14"},width:"95%"});
	//var ffirstnamelabel = Ti.UI.createLabel({text:'firstname',textAlign:'Ti.UI.TEXT_ALIGNMENT_CENTER', color:"#3B3B3B",font:{fontSize:"14"}});view.add(ffirstnamelabel);
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
	    Alloy.Globals.Log("client.js::doRow: menuItem: I was clicked");
	    Alloy.Globals.Log("client.js::doRow: JSON.stringify(win): "+JSON.stringify(win));
	    for (i=0;i<subject.length;i++){
		    Alloy.Globals.Log("client.js::doRow array: menuItem1 "+subject[i]+" is: "+eval(subject[i]));
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
	  	 Alloy.Globals.Log("client.js::doRow array: menuItem2: JSON.stringify(e)  "+JSON.stringify(e));
	  });
	};	
	win.open();
	
}
