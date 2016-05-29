exports.openMainWindow = function(_tab) {
  _tab.open($.proposallist_window);
  Ti.API.info("This is child widow proposal.js" +JSON.stringify(_tab));
  	$.proposallist_table.search = $.search_history;
	Alloy.Collections.proposal.fetch();	

};

$.proposallist_window.addEventListener("click", function(e){
		Alloy.Globals.openDetail(e);
		var title = e.row.title;
		var clientController = Alloy.createController('proposaldetail',{
			title: title
		});
		clientController.openMainWindow($.tab_proposallist);
});


function transformFunction(model) {
	var transform = model.toJSON();
	///Alloy.Globals.Log("transform is ::" +JSON.stringify(transform));
	transform.title = transform.col1+":"+transform.col2+":"+transform.col3+":"+transform.col4+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"+transform.col8+":"+transform.col9+":"+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"+transform.col15+":"+transform.col16;
	transform.custom = "proposal#: "+transform.col1+" - "+transform.col2;
	return transform;
}
