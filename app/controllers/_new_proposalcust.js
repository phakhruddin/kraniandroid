exports.openMainWindow = function(_tab) {
  _tab.open($.proposalcust_window);
  Ti.API.info("This is child widow client.js" +JSON.stringify(_tab));
//  	var activity = $.index.getActivity();
//	activity.invalidateOptionsMenu(); //force reload of menus	
	$.proposalcust_table.search = $.search_history;
	Alloy.Collections.client.fetch();	
};
/*
$.clientlist_window.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('clientdetail',{
			title: title
		});
		clientController.openMainWindow($.tab_clientlist);
		//Alloy.Globals.createController('clientdetail','tab_client')
});*/

function transformFunction(model) {
	var transform = model.toJSON();
	///console.log("transform is ::" +JSON.stringify(transform));
	transform.title = transform.col1+":"+transform.col2+":"+transform.col3+":"+transform.col4+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"+transform.col8+":"+transform.col9+":"+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"+transform.col15+":"+transform.col16;
	transform.custom = transform.col1+" ( "+transform.col2+"  "+transform.col3+" ) ";
	return transform;
}
