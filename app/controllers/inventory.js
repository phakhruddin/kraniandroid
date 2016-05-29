exports.openMainWindow = function(_tab) {
  _tab.open($.inventory_window);
  Ti.API.info("This is child widow inventory.js" +JSON.stringify(_tab));
  	$.inventory_table.search = $.search_history;
	Alloy.Collections.inventory.fetch();	

};

$.ptr.refresh();

$.inventory_window.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('inventorydetail',{
			title: title
		});
		clientController.openMainWindow($.tab_inventory);
});


function transformFunction(model) {
	var transform = model.toJSON();
	///console.log("transform is ::" +JSON.stringify(transform));
	transform.title = transform.col1+":"+transform.col2+":"+transform.col3+":"+transform.col4+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"+transform.col8+":"+transform.col9+":"+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"+transform.col15+":"+transform.col16;
	transform.custom = transform.col2;
	transform.name = "Project: "+transform.col2;
	transform.email = "Inventory contact: "+transform.col6;
	transform.address = "Location: "+transform.col7+","+transform.col8+","+transform.col9;
	return transform;
}

function addHandler(e) {
	console.log("inventory addHandler e : "+JSON.stringify(e));
		//Alloy.Globals.openDetail(e);
		//var title = e.row.title;
		///var clientController = Alloy.createController('enterclient');
		///clientController.openMainWindow($.tab_clientlist);
}

function myRefresher(e) {
	console.log("refreshing after pull : " +JSON.stringify(e));
    Alloy.Collections.inventory.fetch({
        success: e.hide,
        error: e.hide
    });
}
	

