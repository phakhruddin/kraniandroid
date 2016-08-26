exports.openMainWindow = function(_tab) {
  _tab.open($.proposallist_window);
  Alloy.Globals.Log("proposallistlist.js:: This is child widow proposal.js" +_tab);
  //	$.proposallist_table.search = $.search_history;
  Alloy.Collections.proposal.fetch();

};

function transformFunction(model) {
	var transform = model.toJSON();
	//Alloy.Globals.Log("transform is ::" +JSON.stringify(transform));
	transform.title = transform.col1+":"+transform.col2+":"+transform.col3+":"+transform.col4+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"+transform.col8+":"+transform.col9+":"
		+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"+transform.col15+":"+transform.col16;
	transform.custom = transform.col2+" "+transform.col3;
	transform.proposalnumber = "proposal#: "+transform.col1;
	transform.total ='TOTAL: '+transform.col4;
	transform.bal ='BALANCE: '+transform.col5;
	transform.paid ='PAID: '+transform.col6;
	transform.status ='Status: '+transform.col13;
	transform.lastpaiddate = 'Last Paid on: '+transform.col11;
	transform.urlraw = (typeof transform.title.split(':')[13] === typeof undefined)?"":transform.title.split(':')[13];
	//Alloy.Globals.Log("proposallistlist.js::transform.urlraw : for "+transform.col2+" "+transform.col3+"   " +transform.urlraw);
	(typeof transform.urlraw === typeof undefined)?"":$.proposallist_list.metadata += transform.urlraw+",";	
	if (transform.col13 == "submitted"){
		transform.img ="/images/proposalsubmitted.gif";
	} else {
		transform.img ="/images/proposalpending.gif";
	}
	return transform;
}


function projectdoAdd(e) {  	
	Alloy.Globals.Log("proposallistlist.js::projectdoAdd:::doAdd: "+JSON.stringify(e));
	//Alloy.Globals.Log("proposallistlist.js::projectdoAdd:::doAdd. $.projectlist_table: "+JSON.stringify($.projectlist_table));
	var win = Titanium.UI.createWindow({title:"Add Proposal", backgroundColor:'#DBDBDB'});
    var jobitemheaderviewtop=100;var jobitemheaderviewshrinktop=30;var clientviewheight=70;jobdescrviewheight=140;
	var clientheaderview = Ti.UI.createView({top:"0",height:"30",backgroundColor:"#3B3B3B"});clientheaderview.add(Ti.UI.createLabel({text:"Client",left:"20"}));
	var clientview = Ti.UI.createView({top:"30",height:"70",backgroundColor:"#4D4D4D"});
	if(e.source.firstname){
		var clientlabelbutton = Ti.UI.createLabel({text:e.source.firstname+" "+e.source.lastname,left:"35%",color:"#63D1F4"});clientview.add(clientlabelbutton);	
	} else {
		var selectclientlabelbutton = Ti.UI.createLabel({text:"Select Client >",left:"35%",color:"#63D1F4"});clientview.add(selectclientlabelbutton);
		selectclientlabelbutton.addEventListener("click",function(e){
			selectclientlabelbutton.color="gray";
			setTimeout(function(){selectclientlabelbutton.color="#63D1F4";},100);
			jobdescrTextArea.blur();jobdescrprojTextField.blur();
		});	
	}	
	var jobitemheaderview = Ti.UI.createView({
		top:parseFloat(clientview.top)+parseFloat(clientview.height),
		height:"30",backgroundColor:"#3B3B3B"
		});jobitemheaderview.add(Ti.UI.createLabel({text:"Item & Description",left:"20"}));
	var jobdescrview = Ti.UI.createView({
		top:parseFloat(jobitemheaderview.top)+parseFloat(jobitemheaderview.height),
		height:"140",backgroundColor:"#AAAAAA"
	});
	var jobdescrprojlabel = Ti.UI.createLabel({text:"Project Name: ",top:"10",left:"20",color:"black",font:{fontSize:"12"}});
	var jobdescrprojTextField = Ti.UI.createTextField({top:"5",right:"10",borderRadius:"0.25",color:"gray",font:{fontSize:"12"},width:"60%"});
	jobdescrprojTextField.addEventListener("blur",function(){
		Alloy.Globals.Log("proposallistlist.js::projectdoAdd:::doAdd:jobdescrprojTextField.blur ");
		Titanium.UI.Android.hideSoftKeyboard();
	});jobdescrprojTextField.blur();
	jobdescrview.add(jobdescrprojlabel);jobdescrview.add(jobdescrprojTextField);
	var jobdescrlabel = Ti.UI.createLabel({text:"Description: ",top:"38",left:"20",color:"black",font:{fontSize:"12"}});
	var jobdescrTextArea = Ti.UI.createTextArea({right:"10",height:"100", top:"56",borderRadius:"0.25",color:"gray",borderColor:"black",borderWidth:"0.1",font:{fontSize:"10"},width:"90%"});
	jobdescrTextArea.addEventListener("blur",function(){
		Alloy.Globals.Log("proposallistlist.js::projectdoAdd:::doAdd:jobdescrTextArea.blur ");
		Titanium.UI.Android.hideSoftKeyboard();
	});jobdescrTextArea.blur();


	var jobitemsheaderview = Ti.UI.createView({
		top:parseFloat(jobitemheaderview.top)+parseFloat(jobitemheaderview.height)+parseFloat(jobdescrview.height),
		height:"30",backgroundColor:"#3B3B3B"
		});jobitemsheaderview.add(Ti.UI.createLabel({text:"Line items: Click to add ",left:"20"}));
	var jobitemsaddicon = Ti.UI.createImageView({right:"30",height:"30",width:"30",image:"/images/ic_add_circle_outline_white_24dp.png"});

	jobdescrview.add(jobdescrlabel);jobdescrview.add(jobdescrTextArea);

	jobitemsheaderview.add(jobitemsaddicon);
	win.add(clientheaderview);
	win.add(clientview);
	win.add(jobitemheaderview);
	win.add(jobdescrview);
	win.add(jobitemsheaderview);
	
	var projectDetailscrollView = Ti.UI.createScrollView({
		layout:'vertical',scrollType:"vertical",
		top:parseFloat(jobitemsheaderview.top)+parseFloat(jobitemsheaderview.height)
		});
	function rearrangeView() {
		jobitemheaderview.top=parseFloat(clientview.top)+parseFloat(clientview.height);
		jobdescrview.top=parseFloat(jobitemheaderview.top)+parseFloat(jobitemheaderview.height);
		jobitemsheaderview.top=parseFloat(jobitemheaderview.top)+parseFloat(jobitemheaderview.height)+parseFloat(jobdescrview.height);
		projectDetailscrollView.top=parseFloat(jobitemsheaderview.top)+parseFloat(jobitemsheaderview.height);
		Alloy.Globals.Log("proposallistlist.js::projectdoAdd:::doAdd:rearrangeView pos: jobitemheaderview.top, jobitemsheaderview.top, projectDetailscrollView.top : "+jobitemheaderview.top+", "+jobitemsheaderview.top+", "+projectDetailscrollView.top);

	}
	
	clientheaderview.addEventListener("click",function(){
		jobdescrTextArea.blur();jobdescrprojTextField.blur();
		clientview.height=70;
		rearrangeView();
		});
	jobitemheaderview.addEventListener("click",function(){
		jobdescrTextArea.blur();jobdescrprojTextField.blur();
		jobdescrview.height=140;
		rearrangeView();
		});
	jobitemsheaderview.addEventListener("click",function(){
		clientview.height=0;
		jobdescrview.height=0;
		rearrangeView();
	});
	
	var i=0;
	function addlistitemrow(i) {
		Alloy.Globals.Log("proposallistlist.js::projectdoAdd:::doAdd:: projectDetailscrollView.children.length: B4 update: "+projectDetailscrollView.children.length);
		eval("var jobitemsview"+i+"= Ti.UI.createView({height:'60',backgroundColor:'#DBDBDB'})");
		eval("var lineitemlabel"+i+" = Ti.UI.createLabel({text:'Line Item : ',top:10,left:'20',color:'black',font:{fontSize:'12'}})");
		eval("var lineitemTextField"+i+" = Ti.UI.createTextField({top:0,left:'100',borderRadius:'0.25',color:'gray',font:{fontSize:'12'},width:'60%'})");
		eval("var qtylabel"+i+" = Ti.UI.createLabel({text:'Qty : ',top:36,left:'20',color:'black',font:{fontSize:'12'}})");
		eval("var qtyTextField"+i+" = Ti.UI.createTextField({top:26,left:'50',keyboardType:Ti.UI.KEYBOARD_NUMBER_PAD,returnKeyType:Ti.UI.RETURNKEY_DONE,borderRadius:'0.25',color:'gray',font:{fontSize:'12'},width:'20%'})");
		eval("var pricelabel"+i+" = Ti.UI.createLabel({text:'Price : ',top:36,left:'50%',color:'black',font:{fontSize:'12'}})");
		eval("var priceTextField"+i+" = Ti.UI.createTextField({top:26,left:'60%',keyboardType:Ti.UI.KEYBOARD_DECIMAL_PAD,returnKeyType:Ti.UI.RETURNKEY_DONE,borderRadius:'0.25',color:'gray',font:{fontSize:'12'},width:'20%'})");
		eval("jobitemsview"+i+".add(lineitemlabel"+i+");jobitemsview"+i+".add(lineitemTextField"+i+")");
		eval("jobitemsview"+i+".add(qtylabel"+i+");jobitemsview"+i+".add(qtyTextField"+i+")");
		eval("jobitemsview"+i+".add(pricelabel"+i+");jobitemsview"+i+".add(priceTextField"+i+")");
		eval("projectDetailscrollView.add(jobitemsview"+i+")");	
		eval("jobitemsaddicon.rowcount=i");
		Alloy.Globals.Log("proposallistlist.js::projectdoAdd:::doAdd:: projectDetailscrollView.children.length: After update at i:  "+i+" : "+projectDetailscrollView.children.length);
		win.remove(projectDetailscrollView);
		win.add(projectDetailscrollView);	
	}
	
	
	addlistitemrow(i);
	jobitemsaddicon.addEventListener("click",function(e){jobitemsaddicon.image="/images/ic_add_circle_black_24dp.png";		
		Alloy.Globals.Log("proposallistlist.js::projectdoAdd:::doAdd: jobitemsaddicon.addEventListener: JSON.stringify(e) "+JSON.stringify(e));
		var i = e.source.rowcount;
		setTimeout(function(){jobitemsaddicon.image="/images/ic_add_circle_outline_white_24dp.png";},100);
		i++; addlistitemrow(i);
		Alloy.Globals.Log("proposallistlist.js::projectdoAdd:::doAdd: jobitemsaddicon.addEventListener: i "+i);
	});
	win.open();	
}


function doClick(e) {
	Alloy.Globals.Log("JSON.stringify e : " +JSON.stringify(e));	
	//Alloy.Globals.openDetail(e);
		var title = e.source.input;
		Alloy.Globals.Log("title is: "+title);
		var clientController = Alloy.createController('proposaldetail',{
			title: title,
			callbackFunction : pulledEvent
		});
		clientController.openMainWindow($.tab_proposallist);
	//alert("click this");
};

function doAdd(e){
	Alloy.Globals.Log("proposallistlist.js::doAdd: "+JSON.stringify(e));
	var win = Titanium.UI.createWindow({title:"Add proposal",backgroundColor:'#DBDBDB'});
	var clientheaderview = Ti.UI.createView({top:"0",height:"10%",backgroundColor:"#3B3B3B"});clientheaderview.add(Ti.UI.createLabel({text:"Client",left:"20"}));
	var clientview = Ti.UI.createView({top:"10%",height:"39%",backgroundColor:"#4D4D4D"});
	var selectclientlabelbutton = Ti.UI.createLabel({text:"Select Client >",left:"35%",color:"#63D1F4"});clientview.add(selectclientlabelbutton);
	selectclientlabelbutton.addEventListener("click",function(e){
		// checking clients.
		var clients = Alloy.Collections.instance('client');
		clients.fetch();
		var clients = clients.toJSON();
		Alloy.Globals.Log("proposaldetail.js:: clients.length: "+clients.length);	
		Alloy.Globals.Log("proposaldetail.js:: JSON.stringify(clients): "+JSON.stringify(clients));
		var win = Titanium.UI.createWindow({title:"Select Client", backgroundColor: "white"});	
		var scrollView = Ti.UI.createScrollView({scrollType:"vertical"});
		if(clients.length > 0){
			for (i=0;i<clients.length;i++){
				Alloy.Globals.Log("proposaldetail.js:: JSON.stringify(clients[i]) : "+JSON.stringify(clients[i]));
				var firstname = clients[i].col2; var lastname = clients[i].col3;
				var data = [];
				for (j=0;j<Object.keys(clients[i]).length;j++){var entry = eval("clients[i].col"+(j+1));data.push(entry);}  // data[0], data[1]
				var view = Titanium.UI.createView({top:30*i,height:'29',width:'95%',layout:'vertical',backgroundColor:'#FAFAFA',borderColor:'#EDEDED',borderRadius:'10',borderWidth:'0.1'});
				var clientlabel = Ti.UI.createLabel({text:firstname+" "+lastname,color:'#3B3B3B',font:{fontSize:'14'},textAlign:'Ti.UI.TEXT_ALIGNMENT_CENTER',id:clients[i].col1,data:data});
				clientlabel.addEventListener("click",function(e){
					var proposal = Alloy.Collections.instance('proposal');
					proposal.fetch();	
					Alloy.Globals.Log("proposaldetail.js:: doAdd: clientlabel.click :JSON.stringify(e): "+JSON.stringify(e));
					Alloy.Globals.Log("proposaldetail.js:: doAdd: clientlabel.click :JSON.stringify(proposal): "+JSON.stringify(proposal));
					var customerid = e.source.data[0];var firstname = e.source.data[1];var lastname = e.source.data[2];
					var theproposal = proposal.where({col2:firstname,col3:lastname});

					Alloy.Globals.Log("proposaldetail.js::doAdd:clientlabel.click:checking existing inv:customerid : "+firstname+" "+lastname+" "+customerid+":JSON.stringify(theproposal): "+JSON.stringify(theproposal));
					if (theproposal.length > 0){
						openproposalDetail(e.source.data);	//OPEN EXISTING proposal
					} else {
						 var addProjectdialog = Ti.UI.createAlertDialog({
							cancel: 1,
							buttonNames: ['NO', 'YES'],
							title: 'Not found: Add new?'
						});
						addProjectdialog.firstname=firstname; addProjectdialog.lastname=lastname;
						addProjectdialog.addEventListener("click",function(e){
							if (e.index == 1 ) {
								projectdoAdd(e); //Add new project from the proposal menu
							} else {return 100;};
						});
						addProjectdialog.show();					 
					}						
				});
				view.add(clientlabel);
				scrollView.add(view);		
			}		
		} else {
			alert("could not locate "+firstname+" "+lastname+" . Please try again.");
		}		
		win.add(scrollView);
		win.open();
	});
		
	var jobheaderview = Ti.UI.createView({top:"50%",height:"10%",backgroundColor:"#3B3B3B"});jobheaderview.add(Ti.UI.createLabel({text:"Job",left:"20"}));
	var jobview = Ti.UI.createView({top:"60%",height:"39%",backgroundColor:"#4D4D4D"});
	var selectjoblabelbutton = Ti.UI.createLabel({text:"Select job >",left:"35%",color:"#63D1F4"});jobview.add(selectjoblabelbutton);
	win.add(clientheaderview);
	win.add(clientview);
	win.add(jobheaderview);
	win.add(jobview);
	win.open()
};

function doBack(){
	$.proposallist_window.close();
};

$.search_history.visible=false;
function doSearch(e){
	Alloy.Globals.Log("posposallistlist.js::doSearch : "+JSON.stringify(e));
	Alloy.Globals.Log("posposallistlist.js::doSearch : JSON.stringify($.search_history) "+JSON.stringify($.search_history));
	var searchstatus = $.search_history.visible;
	Alloy.Globals.Log("posposallistlist.js::doSearch : searchstatus "+searchstatus);
	if ($.search_history.visible) {$.search_history.visible=false;} else {$.search_history.visible=true;}
	Alloy.Globals.Log("posposallistlist.js::doSearch : $.search_history.visible: "+$.search_history.visible);
}

function searchHandler(e){
	Alloy.Globals.Log("searchHandler e "+JSON.stringify(e));
}

function mailAction(e) {
	Alloy.Globals.Log("JSON stringify e : " +JSON.stringify(e));
			var clientController = Alloy.createController('proposalsend');
		clientController.openMainWindow($.tab_proposallist);
}

function selectItem(e) {
	Alloy.Globals.Log("proposallistlist.js::info after select item : "+JSON.stringify(e));
}

function myRefresher(e) {
	Alloy.Globals.Log("refreshing after pull : " +JSON.stringify(e));
    Alloy.Collections.proposal.fetch({
        success: e.hide,
        error: e.hide
    });
}

function pulledEvent(e){
	Alloy.Globals.Cleanup();
	var item="proposal";
	var sid = Titanium.App.Properties.getString(item,"none");
	Alloy.Globals.Log("proposallistlist.js:pulledEvent:use in callback: Alloy.Globals.getPrivateData("+sid+","+item+")");
	Alloy.Globals.getPrivateData(sid,item);
	Alloy.Globals.Log("proposallistlist.js:pulledEvent:use in callback: Alloy.Collections.proposal.fetch()");
	Alloy.Collections.proposal.fetch();
}

function deleteItem(e) {
	Alloy.Globals.Log("proposallistlistjs:: deleteItem(): "+JSON.stringify(e));
	var urls = e.source.metadata.replace("undefined","").split(",")[e.itemIndex].replace(/yCoLoNy/g,':').replace(/xCoLoNx/g,',');
	var existingurlsidtag = urls.split(',')[0];
	var existingurlsselfhref = urls.split(',')[1];
	var existingurlsedithref = urls.split(',')[2];
	Alloy.Globals.Log("proposallistlistjs::$.proposallist_table delete: idtag:"+existingurlsidtag+" selfhref: "+existingurlsselfhref+" edithref: "+existingurlsedithref);
	var xhr = Ti.Network.createHTTPClient({
	    onload: function(e) {
	    try {
	    		Alloy.Globals.Log("proposallistlistjs::$.proposallist_table delete:success e: "+JSON.stringify(e));
	    		Alloy.Globals.Log("proposallistlistjs::$.proposallist_table delete:response is: "+this.responseText);
	    	} catch(e){
				Alloy.Globals.Log("proposallistlistjs::$.proposallist_table delete:cathing e: "+JSON.stringify(e));
			}
		}
	});
	xhr.open("DELETE", existingurlsedithref);	
	//xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	if (existingurlsedithref) {xhr.send();} else {Alloy.Globals.Log("proposallistlistjs::$.proposallist_table delete: NO edithref. abort delete ");}
	Alloy.Globals.Log("proposallistlistjs::$.proposallist_table delete: DONE: DELETE "+existingurlsedithref);
	pulledEvent();
}

function openproposalDetail(e){
	Alloy.Globals.Log("proposallistlist.js: openproposalDetail:JSON.stringify e : " +JSON.stringify(e));
	//variables start	
	var data = (e[0])?e:eval("e.section.items["+e.itemIndex+"].properties.searchableText.split(':')");
	Alloy.Globals.Log("proposallistlist.js: openproposalDetail:data : " +data);
	var proposalnumber = col1 = (e[0])?"TBD":data[0];
	var firstname = col2 = data[1];
	var lastname = col3 = data[2];
	var total = col4 =  (e[0])?"TBD":data[3];
	var balance = col5 =  (e[0])?"TBD":data[4];
	var paid = col6 =  (e[0])?"TBD":data[5];
	var lastpaiddate = col7 =  (e[0])?"TBD":data[6];
	var followupdate = col8 =  (e[0])?"TBD":data[7];
	var customerid = col9 =  (e[0])?data[0]:data[8];
	var email = col10 = (e[0])?data[5]:data[9];
	var duedate = col11 = (e[0])?"TBD":data[10];
	var phone = col12 = (e[0])?data[4]:data[11];
	var status = col13 = (e[0])?"TBD":data[12];
	var currency = col15 = (e[0])?"TBD":data[14];
	var notes = col14 = col16 = data[15];
	var filename = 'payment_'+proposalnumber+'_'+firstname+'_'+lastname;
	var proposalsentfilename = 'proposalsent_'+proposalnumber+'_'+firstname+'_'+lastname;
	var idtag = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[0].replace('yCoLoNy',':'):"none";Titanium.App.Properties.setString('idtag',idtag);
	var selfhref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[1].replace('yCoLoNy',':'):"none";Titanium.App.Properties.setString('selfhref',selfhref);
	var edithref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[2].replace('yCoLoNy',':'):"none";Titanium.App.Properties.setString('edithref',edithref);
	
	var openproposalDetailscrollView = Ti.UI.createScrollView({scrollType:"vertical"});

	var clients = Alloy.Collections.instance('client');
	clients.fetch();		
	var theclient = clients.where({
		col2:firstname,
		col3:lastname
		}); //FILTER
	Alloy.Globals.Log("proposallistlist.js:: number of clients are: "+clients.length);
	Alloy.Globals.Log("proposallistlist.js:: theclient is: "+JSON.stringify(theclient));
	if(theclient.length > 0){
		Alloy.Globals.Log("proposaldetail.js:: JSON.stringify(theclient): "+JSON.stringify(theclient));
		var uniqueid = theclient[0].toJSON().col1;
		var company = theclient[0].toJSON().col4;
		var phone = theclient[0].toJSON().col5;
		var email = theclient[0].toJSON().col6;		
		var address = theclient[0].toJSON().col7;
		var city = theclient[0].toJSON().col8;
		var state = theclient[0].toJSON().col9;	
		Alloy.Globals.Log("proposaldetail.js:: uniqueid: "+uniqueid);
	} else {
		alert("could not locate "+firstname+" "+lastname+" . Please try again.");
	}
	Alloy.Globals.Log("proposallistlist.js:: locate jobs with uniqueid: "+uniqueid);
	
	if (uniqueid){
		var uniqueid = uniqueid.toString().trim();
		projectitemsarray = [];
		projectnamesarray = [];
		var projects = Alloy.Collections.instance('project');
		projects.fetch();
		Alloy.Globals.Log("proposallistlist.js:: JSON.stringify(projects): "+JSON.stringify(projects));
		var theproject = projects.where({
			col13:uniqueid
			}); //FILTER
		Alloy.Globals.Log("proposallistlist.js:: locate jobs with uniqueid: "+uniqueid + " theproject.length "+theproject.length);
		Alloy.Globals.Log("proposallistlist.js:: b4 JSON.stringify(theproject): "+JSON.stringify(theproject));
		if(theproject.length > 0){
			Alloy.Globals.Log("proposallistlist.js:: JSON.stringify(theproject): "+JSON.stringify(theproject));
			for (i=0;i<theproject.length;i++){
				var projectnames = theproject[i].toJSON().col1;
				var projectitems = theproject[i].toJSON().col12;
				projectitemsarray.push(projectitems);
				projectnamesarray.push(projectnames);
			}
			Alloy.Globals.Log("proposallistlist.js:: JSON.stringify(projectitemsarray): "+JSON.stringify(projectitemsarray));
		}
	} else { Alloy.Globals.Log("uniqueid is not a number: uniqueid: "+uniqueid);};
	
	if (projectitemsarray && projectitemsarray.length>0) {
		var topvalue = 10;
		var jobitem_row = Titanium.UI.createView({id:"jobitem_row", top:"355", backgroundColor:"#F5F5F5", height:"500",borderRadius:"10"});		
		for (x=0;x<projectitemsarray.length;x++) {
			var projectitems = JSON.parse(projectitemsarray[x].replace(/cOlOn/g,":").toString());   // replacing all cOlOn to ':'
			var projectname = projectnamesarray[x];
			Alloy.Globals.Log("proposallistlist.js:: createRow: projectnamesarray["+x+"]: "+projectnamesarray[x]);
			Alloy.Globals.Log("proposallistlist.js:: createRow: JSON.stringify(projectitems): "+JSON.stringify(projectitems));
			Alloy.Globals.Log("proposaldetail.js::topvalue at START : "+topvalue);
			topvalue = topvalue + 8;
			var projectidentification=projectnamesarray[x].trim().replace(/\s/g,'_'); //
			var projectinfoarray=[];
			var unchecked = Ti.UI.createImageView({
				id: projectidentification,
				top: topvalue,
				left: "85%",
				height : 30,
				width : 30,
				image : "/images/EditControl.png"
			});
			var checked = Ti.UI.createImageView({
				top: topvalue,
				left: "85%",
				height : 30,
				width : 30,
				image : "/images/EditControlSelected.png"
			});
			topvalue = topvalue + 5;
			var projectnamelabel = Ti.UI.createLabel ({
				color : "#333",
				left : "20",
				top : topvalue,
				font:{
					fontSize:16,
					fontWeight: "bold"
				},
				text : projectnamesarray[x].trim()
			});
			var descr = projectitems[0].descr;
			topvalue = topvalue + 25;
			var descrtitlelabel = Ti.UI.createLabel ({
				left  : "20",
				top : topvalue,
				font:{
					fontSize:14
				},
				color:"black",
				text : 'Description: '
			});
			//calculate height of item description.
			var descr_height = ((Math.round(descr.split('').length/70)+(descr.split(/\r?\n|\r/).length))*14)+14;
			var descrbodylabel = Ti.UI.createLabel ({
				color : "#333",
				left  : "120",
				top : topvalue,
				font:{
					fontSize:12
				},
				text : descr
			});
			var innerview = Ti.UI.createView({
		        width:"90%",
		        height:"85%",
		        backgroundColor:"white",
		        borderRadius:"10",
		        borderWidth:"0.1",
		        borderColor:"white"
			});	
			jobitem_row.add(projectnamelabel);
			jobitem_row.add(unchecked);
			jobitem_row.add(descrtitlelabel);
			jobitem_row.add(descrbodylabel);
			topvalue=topvalue+20+descr_height-20;
			var itemtitlelabel = Ti.UI.createLabel ({
				left  : "20",
				top : topvalue,
				font:{
					fontSize:14
				},
				color:"black",
				text : 'List Item :'
			});
			if ( projectitems.length > 1) {jobitem_row.add(itemtitlelabel); }
			for (i=1;i<projectitems.length;i++){
				topvalue=topvalue+20;
				var itembodylabel = Ti.UI.createLabel ({
					color : "#333",
					left  : "20",
					top : topvalue,
					font:{
						fontSize:12
					},
					text : i+' :    '+projectitems[i].lineitem
				});	
				topvalue=topvalue+14;
				var itemqtylabel = Ti.UI.createLabel ({
					color : "#333",
					left  : "50%",
					top : topvalue,
					font:{
						fontSize:10
					},
					text : 'Qty :'+projectitems[i].qty
				});
				var itempricelabel = Ti.UI.createLabel ({
					color : "#333",
					left  : "75%",
					top : topvalue,
					font:{
						fontSize:10
					},
					text : 'Price : '+projectitems[i].price
				});	
				jobitem_row.add(itembodylabel);
				jobitem_row.add(itemqtylabel);
				jobitem_row.add(itempricelabel);
				jobitem_row.iteminfo=[projectitems[i].lineitem,projectitems[i].qty,projectitems[i].price];
				var info={"names":projectnamesarray[x].trim(),"descr":projectitems[0].descr,"lineitem":projectitems[i].lineitem,"qty":projectitems[i].qty,"price":projectitems[i].price};
				projectinfoarray.push(info);
				unchecked.titleid=projectinfoarray;
				checked.titleid=projectinfoarray;
				Alloy.Globals.Log("proposaldetail.js::topvalue at Sub END : "+topvalue);
			}
			topvalue=topvalue+20;
			var grayline = Ti.UI.createImageView({
				image: "list_divider@2x.png",
				height: "2",
				width: "90%",
				left: "20",
				top: topvalue
			});	
			jobitem_row.add(grayline);
			projectinfoarray=[];
			topvalue = topvalue + 4;
			Alloy.Globals.Log("proposaldetail.js::topvalue at END : "+topvalue);	
		}		
		
	} else {
		Alloy.Globals.Log("proposaldetail.js:: NO projectitemsarray: need client refresh ");
		var clientsid = Titanium.App.Properties.getString("client");
		Alloy.Globals.getPrivateData(clientsid,"client");
		var clientcollection  = Alloy.Collections.instance('client');
	    clientcollection.fetch();
	    alert("proposal data downloaded. Please try again.");
	};


	//variables ends.

	//rows, labels, etc.
	var win = Titanium.UI.createWindow({title:"proposal Detail", backgroundColor: "white"});	
	var proposalnumber_rowview = Titanium.UI.createView({id:"proposalnumber_row",backgroundColor:"#F5F5F5",top:'5',  height:"75", borderRadius:"10"});
	var proposalnumberlabel = Titanium.UI.createLabel({id:"proposalnumber" ,color:"#404040" ,top:"5", font: { fontSize:10 }, text:"proposal #: "+proposalnumber});
	var headerlabel = Titanium.UI.createLabel({id:"header", color:"#404040", top:"20", text:firstname+" "+lastname, font: { fontSize:30, fontStyle: 'bold' } }) ;
	proposalnumber_rowview.add(proposalnumberlabel);proposalnumber_rowview.add(headerlabel);
	Alloy.Globals.Log("proposallistlist.js: openproposalDetail:JSON.stringify proposalnumber_rowview : " +JSON.stringify(proposalnumber_rowview));
	var totalbalance_rowview = Titanium.UI.createView({id:"totalbalance_row", top:"85", backgroundColor:"#F5F5F5", height:"160",borderRadius:"10"});
	var bal_titlelabel = Titanium.UI.createLabel({id:"bal_title", color:"#404040", font: { fontSize:12 },top:"10", text:"BALANCE"});
	var balance2label = Titanium.UI.createLabel({id:"balance2",color:"green", top:"25",text:balance,font: {fontSize: '54',fontStyle: 'bold'}});
	var currencylabel = Titanium.UI.createLabel({id:"currency",color:"#999999", top:"85",text:(currency != "NA")?currency:""});
	var totallabel = Titanium.UI.createLabel({id:"total",color:"#404040", left:'10%',top:"105",font: { fontSize:12 },text:'TOTAL: '+total});
	var paidlabel = Titanium.UI.createLabel({id:"paid",color:"#404040", right:"15%",top:"105",font: { fontSize:12 },text:'PAID: '+paid});
	var proposal_buttonlabel = Titanium.UI.createLabel({id:"proposal_button",top:"125",color:'#63D1F4',text:"Generate Proposal -> "});
	totalbalance_rowview.add(bal_titlelabel);
	totalbalance_rowview.add(balance2label);
	totalbalance_rowview.add(currencylabel);
	totalbalance_rowview.add(totallabel);
	totalbalance_rowview.add(paidlabel);
	totalbalance_rowview.add(proposal_buttonlabel);
	
	var dates_rowview = Titanium.UI.createView({id:"dates_row", top:"250", backgroundColor:"#F5F5F5", height:"35",borderRadius:"10"});
	var duedate_buttonlabel = Titanium.UI.createLabel({id:"duedate_button", color:'#63D1F4', left:"20%", top:"10", text:"DUE DATE: "});
	duedate_buttonlabel.addEventListener("click",function(e){});
	var duedate_label = Titanium.UI.createLabel({id:"duedate_label", color:"red" ,left:"45%", top:"10",  text:duedate });
	var duedate_donebuttonlabel = Titanium.UI.createLabel({id:"duedate_done", color:'#63D1F4', right:"40", top:"10", title:"DONE"});
	duedate_donebuttonlabel.addEventListener("click",function(e){});
	dates_rowview.add(duedate_buttonlabel);
	dates_rowview.add(duedate_label);
	dates_rowview.add(duedate_donebuttonlabel);
	
	var action_rowview = Titanium.UI.createView({id:"action_row", top:"290", backgroundColor:"#F5F5F5", height:"60",borderRadius:"10"});
	var phonebuttonimage = Ti.UI.createImageView({left:"15%", top:"10", height:"30", width:"30", image:"/images/call.png" });
	phonebuttonimage.addEventListener=("click",function(e){ });
	var emailbuttonimage = Titanium.UI.createImageView({left:"40%", top:"10", height:"30", width:"30", image:"/images/email.png" });
	emailbuttonimage.addEventListener=("click",function(e){ });
	var previewbuttonimage = Titanium.UI.createImageView({left:"65%", top:"10", height:"30", width:"30", image:"/images/documents@2x.png" });
	emailbuttonimage.addEventListener=("click",function(e){ });
	action_rowview.add(phonebuttonimage);
	action_rowview.add(emailbuttonimage);
	action_rowview.add(previewbuttonimage);
	
	openproposalDetailscrollView.add(proposalnumber_rowview);	
	openproposalDetailscrollView.add(totalbalance_rowview);	
	openproposalDetailscrollView.add(dates_rowview);	
	openproposalDetailscrollView.add(action_rowview);
	//Alloy.Globals.Log("proposallistlist.js: openproposalDetail:JSON.stringify openproposalDetailscrollView : " +JSON.stringify(openproposalDetailscrollView));
	openproposalDetailscrollView.add(jobitem_row);	
	
	win.add(openproposalDetailscrollView);
	win.open();
}
