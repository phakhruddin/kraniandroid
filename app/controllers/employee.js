var args = arguments[0] || {};
exports.openMainWindow = function(_tab) {
  _tab.open($.employee_window);
  Ti.API.info("This is child widow checking _tab : " +JSON.stringify(_tab));
   	$.employee_table.search = $.search_history;
	Alloy.Collections.labor.fetch();	
	indexselect = null;
	
		$.employee_window.addEventListener("click", function(e){
			Alloy.Globals.Log("location.js: indexselect : "+indexselect);
			Alloy.Globals.openDetail(e);
			e.row.titleid = "rowidimage";
			Alloy.Globals.Log("location.js: source is : "+args.source);
			Alloy.Globals.Log("location.js: JSON.stringify(e) : "+ JSON.stringify(e));
			if (indexselect || indexselect == "0"){
				if (indexselect == e.index){
					Alloy.Globals.Log("location.js: previous e.source.image : "+ e.source.image+" indexselect : "+indexselect);
					e.source.image = "EditControl.png";
					e.row.backgroundColor = "transparent";
					indexselect = null; //reset indexselect		
					Alloy.Globals.Log("location.js: e.source.image : "+ e.source.image);		
				}			
			} else {
				if (e.source.image == "EditControl.png") {
					e.source.image = "EditControlSelected.png";
					e.row.backgroundColor = "#87CEFA";
					indexselect = e.index;
					e.row.id = "selected";
					$.toggle_button.titleid = e;
					Alloy.Globals.Log("location.js: e.source.image : "+ e.source.image+" indexselect : "+indexselect);
					var employee = e.row.title.split(':')[1]+" "+e.row.title.split(':')[2];
					Titanium.App.Properties.setString('employee',employee);
					Alloy.Globals.Log("location.js: employee: "+ Titanium.App.Properties.getString('employee'));
				} else {
					e.source.image = "EditControl.png";
					e.row.backgroundColor = "transparent";
					Alloy.Globals.Log("location.js: e.source.image : "+ e.source.image);
					indexselect = null;
				}
			}
			Alloy.Globals.Log("location.js: JSON.stringify(e) : "+ JSON.stringify(e));
		});	
		
};

function transformFunction(model) {
	var currentaddr;
	var transform = model.toJSON();
	///Alloy.Globals.Log("transform is ::" +JSON.stringify(transform));
	transform.title = transform.col1+":"+transform.col2+":"+transform.col3+":"+transform.col4+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"+transform.col8+":"+transform.col9+":"+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"+transform.col15+":"+transform.col16;
	transform.custom = transform.col2+"  "+transform.col3;
	transform.phone = "Phone: "+(transform.col5)?transform.col5.toString().replace(/^(...)(...)/g, "\($1\) $2-"):"";
	transform.email = "Email: "+transform.col6;
	transform.img ="EditControl.png";
	transform.labelcolor = (transform.col5.length != 10)?"red":"#330"; //alert user to fix the phone number
	return transform;
}

function toggle(e) {
	Alloy.Globals.Log("location.js:: toggle:: JSON.stringify(e) : "+ JSON.stringify(e));
	var therow = e.source.titleid;
	Alloy.Globals.Log("location.js:: toggle:: therow : "+therow);
	therow.row.backgroundColor="red";
}
