exports.openMainWindow = function(_tab) {
  _tab.open($.invoicelist_window);
  Ti.API.info("This is child widow invoice.js" +_tab);
  //	$.invoicelist_table.search = $.search_history;
	Alloy.Collections.invoice.fetch();	

};

function doBack(){
	$.invoicelist_window.close();
};

function projectdoAdd(e) {
  	
	Alloy.Globals.Log("invoicelistlist.js::projectdoAdd:::doAdd: "+JSON.stringify(e));
	//Alloy.Globals.Log("invoicelistlist.js::projectdoAdd:::doAdd. $.projectlist_table: "+JSON.stringify($.projectlist_table));
	var win = Titanium.UI.createWindow({title:"Add Project", backgroundColor:'#DBDBDB'});
    var jobitemheaderviewtop=100;var jobitemheaderviewshrinktop=30;var clientviewheight=70;jobdescrviewheight=140;
	var clientheaderview = Ti.UI.createView({top:"0",height:"30",backgroundColor:"#3B3B3B"});clientheaderview.add(Ti.UI.createLabel({text:"Client",left:"20"}));
	var clientview = Ti.UI.createView({top:"30",height:"70",backgroundColor:"#4D4D4D"});
	var selectclientlabelbutton = Ti.UI.createLabel({text:"Select Client >",left:"35%",color:"#63D1F4"});clientview.add(selectclientlabelbutton);	
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
		Alloy.Globals.Log("invoicelistlist.js::projectdoAdd:::doAdd:jobdescrprojTextField.blur ");
		Titanium.UI.Android.hideSoftKeyboard();
	});jobdescrprojTextField.blur();
	jobdescrview.add(jobdescrprojlabel);jobdescrview.add(jobdescrprojTextField);
	var jobdescrlabel = Ti.UI.createLabel({text:"Description: ",top:"38",left:"20",color:"black",font:{fontSize:"12"}});
	var jobdescrTextArea = Ti.UI.createTextArea({right:"10",height:"100", top:"56",borderRadius:"0.25",color:"gray",borderColor:"black",borderWidth:"0.1",font:{fontSize:"10"},width:"90%"});
	jobdescrTextArea.addEventListener("blur",function(){
		Alloy.Globals.Log("invoicelistlist.js::projectdoAdd:::doAdd:jobdescrTextArea.blur ");
		Titanium.UI.Android.hideSoftKeyboard();
	});jobdescrTextArea.blur();
	selectclientlabelbutton.addEventListener("click",function(e){
		selectclientlabelbutton.color="gray";
		setTimeout(function(){selectclientlabelbutton.color="#63D1F4";},100);
		jobdescrTextArea.blur();jobdescrprojTextField.blur();
		});

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
		Alloy.Globals.Log("invoicelistlist.js::projectdoAdd:::doAdd:rearrangeView pos: jobitemheaderview.top, jobitemsheaderview.top, projectDetailscrollView.top : "+jobitemheaderview.top+", "+jobitemsheaderview.top+", "+projectDetailscrollView.top);

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
		Alloy.Globals.Log("invoicelistlist.js::projectdoAdd:::doAdd:: projectDetailscrollView.children.length: B4 update: "+projectDetailscrollView.children.length);
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
		Alloy.Globals.Log("invoicelistlist.js::projectdoAdd:::doAdd:: projectDetailscrollView.children.length: After update at i:  "+i+" : "+projectDetailscrollView.children.length);
		win.remove(projectDetailscrollView);
		win.add(projectDetailscrollView);	
	}
	
	
	addlistitemrow(i);
	jobitemsaddicon.addEventListener("click",function(e){jobitemsaddicon.image="/images/ic_add_circle_black_24dp.png";		
		Alloy.Globals.Log("invoicelistlist.js::projectdoAdd:::doAdd: jobitemsaddicon.addEventListener: JSON.stringify(e) "+JSON.stringify(e));
		var i = e.source.rowcount;
		setTimeout(function(){jobitemsaddicon.image="/images/ic_add_circle_outline_white_24dp.png";},100);
		i++; addlistitemrow(i);
		Alloy.Globals.Log("invoicelistlist.js::projectdoAdd:::doAdd: jobitemsaddicon.addEventListener: i "+i);
	});
	win.open();	
}


function pulledEvent(e){
	Alloy.Globals.Cleanup();
	var item="invoice";
	var sid = Titanium.App.Properties.getString(item,"none");
	Alloy.Globals.Log("invoice.js:pulledEvent:use in callback: Alloy.Globals.getPrivateData("+sid+","+item+")");
	Alloy.Globals.getPrivateData(sid,item);
	Alloy.Globals.Log("invoice.js:pulledEvent:use in callback: Alloy.Collections.invoice.fetch()");
	Alloy.Collections.invoice.fetch();
}

$.search_history.visible=false;
function doSearch(e){
	Alloy.Globals.Log("project.js::doSearch : "+JSON.stringify(e));
	Alloy.Globals.Log("project.js::doSearch : JSON.stringify($.search_history) "+JSON.stringify($.search_history));
	var searchstatus = $.search_history.visible;
	Alloy.Globals.Log("project.js::doSearch : searchstatus "+searchstatus);
	if ($.search_history.visible) {$.search_history.visible=false;} else {$.search_history.visible=true;}
	Alloy.Globals.Log("project.js::doSearch : $.search_history.visible: "+$.search_history.visible);
}

function transformFunction(model) {
	var transform = model.toJSON();
	///Alloy.Globals.Log("transform is ::" +JSON.stringify(transform));
	transform.title = transform.col1+":"+transform.col2+":"+transform.col3+":"+transform.col4+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"+transform.col8+":"+transform.col9+":"
		+transform.col10+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"+transform.col15+":"+transform.col16;
	transform.custom = transform.col2+" "+transform.col3;
	transform.invoicenumber = "Invoice#: "+transform.col1;
	transform.total ='TOTAL: '+transform.col4;
	transform.bal ='BALANCE: '+transform.col5;
	transform.paid ='PAID: '+transform.col6;
	transform.status ='Status: '+transform.col13;
	transform.lastpaiddate = 'Last Paid on: '+transform.col11;
	if (transform.col5 <= "0"){
		transform.img ="/images/paid.gif";
		transform.color ="green";
	} else {
		transform.img ="/images/owedoverduewhite.gif";
		var owedpercent = (parseFloat(transform.col5)/parseFloat(transform.col4))*100;
		if ( owedpercent >= 75 ) {
			transform.color ="red";
		} else {
			(owedpercent >= 50)?transform.color ="#FF999":transform.color ="orange";
		}
		//Alloy.Globals.Log("invoicelislist.js: transform: owedpercent, color  ::" +transform.color+" : "+transform.col5+"/"+transform.col4+" = owedpercent "+owedpercent);
	}
	return transform;
}

function doClick(e) {
	Alloy.Globals.Log("JSON.stringify e : " +JSON.stringify(e));	
	//Alloy.Globals.openDetail(e);
		var title = e.section.items[0].total.input;
		Alloy.Globals.Log("title is: "+title);
		var clientController = Alloy.createController('invoicedetail',{
			title: title,
			callbackFunction : pulledEvent
		});
		clientController.openMainWindow($.tab_invoicelist);
	//alert("click this");
};

function buttonAction(e){
	Alloy.Globals.Log("JSON stringify e : " +JSON.stringify(e));
	Alloy.Globals.Log("JSON stringify e.source : " +JSON.stringify(e.source));
	var thesort = e.source.title;
	
	if (thesort == "All") { 
		Alloy.Collections.invoice.fetch();
		};
	if (thesort == "Paid") { 
		var sql = "SELECT * FROM " + Alloy.Collections.invoice.config.adapter.collection_name +" WHERE col13=\"paid\";";
        Alloy.Globals.Log("sql string:" +sql);
	    Alloy.Collections.invoice.fetch({query:sql});
		};
	if (thesort == "Owed") { 
		var sql = "SELECT * FROM " + Alloy.Collections.invoice.config.adapter.collection_name +" WHERE col13=\"owed\";";
        Alloy.Globals.Log("sql string:" +sql);
	    Alloy.Collections.invoice.fetch({query:sql});
		};
	if (thesort == "None") { var sorttype = "\*"; };
}

function doAdd(e){
	Alloy.Globals.Log("invoicelistlist.js::doAdd: "+JSON.stringify(e));

	var win = Titanium.UI.createWindow({title:"Add Invoice",backgroundColor:'#DBDBDB'});
	var clientheaderview = Ti.UI.createView({top:"0",height:"10%",backgroundColor:"#3B3B3B"});clientheaderview.add(Ti.UI.createLabel({text:"Client",left:"20"}));
	var clientview = Ti.UI.createView({top:"10%",height:"39%",backgroundColor:"#4D4D4D"});
	var selectclientlabelbutton = Ti.UI.createLabel({text:"Select Client >",left:"35%",color:"#63D1F4"});clientview.add(selectclientlabelbutton);
	selectclientlabelbutton.addEventListener("click",function(e){
		// checking clients.
		var clients = Alloy.Collections.instance('client');
		clients.fetch();
		var clients = clients.toJSON();
		Alloy.Globals.Log("invocedetail.js:: clients.length: "+clients.length);	
		Alloy.Globals.Log("invocedetail.js:: JSON.stringify(clients): "+JSON.stringify(clients));
		var win = Titanium.UI.createWindow({title:"Select Client", backgroundColor: "white"});	
		var scrollView = Ti.UI.createScrollView({scrollType:"vertical"});
		if(clients.length > 0){
			for (i=0;i<clients.length;i++){
				Alloy.Globals.Log("invocedetail.js:: JSON.stringify(clients[i]) : "+JSON.stringify(clients[i]));
				var firstname = clients[i].col2; var lastname = clients[i].col3;
				var data = [];
				for (j=0;j<Object.keys(clients[i]).length;j++){var entry = eval("clients[i].col"+(j+1));data.push(entry);}  // data[0], data[1]
				var view = Titanium.UI.createView({top:30*i,height:'29',width:'95%',layout:'vertical',backgroundColor:'#FAFAFA',borderColor:'#EDEDED',borderRadius:'10',borderWidth:'0.1'});
				var clientlabel = Ti.UI.createLabel({text:firstname+" "+lastname,color:'#3B3B3B',font:{fontSize:'14'},textAlign:'Ti.UI.TEXT_ALIGNMENT_CENTER',id:clients[i].col1,data:data});
				clientlabel.addEventListener("click",function(e){
					var invoice = Alloy.Collections.instance('invoice');
					invoice.fetch();	
					Alloy.Globals.Log("invocedetail.js:: doAdd: clientlabel.click :JSON.stringify(e): "+JSON.stringify(e));
					Alloy.Globals.Log("invocedetail.js:: doAdd: clientlabel.click :JSON.stringify(invoice): "+JSON.stringify(invoice));
					var customerid = e.source.data[0];var firstname = e.source.data[1];var lastname = e.source.data[2];
					var theinvoice = invoice.where({col2:firstname,col3:lastname});

					Alloy.Globals.Log("invocedetail.js::doAdd:clientlabel.click:checking existing inv:customerid : "+firstname+" "+lastname+" "+customerid+":JSON.stringify(theinvoice): "+JSON.stringify(theinvoice));
					if (theinvoice.length > 0){
						openInvoiceDetail(e.source.data);	//OPEN EXISTING INVOICE
					} else {
						 var addProjectdialog = Ti.UI.createAlertDialog({
							cancel: 1,
							buttonNames: ['NO', 'YES'],
							title: 'Not found: Add new?'
						});
						addProjectdialog.addEventListener("click",function(e){
							if (e.index == 1 ) {
								projectdoAdd(e); //Add new project from the invoice menu
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
	win.open();
}

function mailAction(e) {
	Alloy.Globals.Log("invoicelistlist:JSON stringify e : " +JSON.stringify(e));
			var clientController = Alloy.createController('invoicesend');
		clientController.openMainWindow($.tab_invoicelist);
}

function selectItem(e) {
	Alloy.Globals.Log("invoicelistlist.js::info after select item : "+JSON.stringify(e));
}

function myRefresher(e) {
	Alloy.Globals.Log("refreshing after pull : " +JSON.stringify(e));
    Alloy.Collections.invoice.fetch({
        success: e.hide,
        error: e.hide
    });
}

function whois(e){
	Alloy.Globals.Log("invoicelistlist.js: openInvoiceDetail:JSON.stringify e : " +JSON.stringify(e));
	var loc = e.itemIndex;
	Alloy.Globals.Log("invoicelistlist.js: openInvoiceDetail:itemIndex : " +loc);
	Alloy.Globals.Log("invoicelistlist.js: openInvoiceDetail:section.items[itemIndex].properties.searchableText : " +eval("e.section.items["+e.itemIndex+"].properties.searchableText"));
	Alloy.Globals.Log("invoicelistlist.js: openInvoiceDetail:JSON.stringify(e.section.items) : " +JSON.stringify(e.section.items));
	var datanonsplit = eval("e.section.items["+e.itemIndex+"].properties.searchableText");
	var data = eval("e.section.items["+e.itemIndex+"].properties.searchableText.split(':')");
	Alloy.Globals.Log("invoicelistlist.js: openInvoiceDetail:data : " +data);
}
   
function openInvoiceDetail(e){
	$.activityIndicator.show();
	var activityIndicator = Ti.UI.createActivityIndicator({style: Titanium.UI.ActivityIndicatorStyle.BIG_DARK});
	activityIndicator.show();
	Alloy.Globals.Log("invoicelistlist.js: openInvoiceDetail:JSON.stringify e : " +JSON.stringify(e));
	//variables start	
	Alloy.Collections.adhoc.deleteAll();
	var adhocs = Alloy.Collections.instance('adhoc'); //adhocs DB
	var data = (e[0])?e:eval("e.section.items["+e.itemIndex+"].properties.searchableText.split(':')");
	Alloy.Globals.Log("invoicelistlist.js: openInvoiceDetail:data : " +data);
	invoicenumber = col1 = (e[0])?"TBD":data[0];
	firstname = col2 = data[1];
	lastname = col3 = data[2];
	var total = col4 =  (e[0])?"TBD":data[3];
	balance = col5 =  (e[0])?"TBD":data[4];
	var paid = col6 =  (e[0])?"TBD":data[5];
	var lastpaiddate = col7 =  (e[0])?"TBD":data[6];
	var followupdate = col8 =  (e[0])?"TBD":data[7];
	var customerid = col9 =  (e[0])?data[0]:data[8];
	email = col10 = (e[0])?data[5]:data[9];
	var duedate = col11 = (e[0])?"TBD":data[10];
	phone = col12 = (e[0])?data[4]:data[11];
	var status = col13 = (e[0])?"TBD":data[12];
	var currency = col15 = (e[0])?"TBD":data[14];
	var notes = col14 = col16 = data[15];
	filename = 'payment_'+invoicenumber+'_'+firstname+'_'+lastname;
	var invoicesentfilename = 'invoicesent_'+invoicenumber+'_'+firstname+'_'+lastname;
	existingurlsidtag = idtag = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[0].replace('yCoLoNy',':'):"none";Titanium.App.Properties.setString('idtag',idtag);
	existingurlsselfhref = selfhref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[1].replace('yCoLoNy',':'):"none";Titanium.App.Properties.setString('selfhref',selfhref);
	existingurlsedithref = edithref = (data[13])?data[13].replace(/xCoLoNx/g,',').split(',')[2].replace('yCoLoNy',':'):"none";Titanium.App.Properties.setString('edithref',edithref);
	
	openInvoiceDetailscrollView = Ti.UI.createScrollView({scrollType:"vertical"});
	savedata = {col1:"",col2:"",col3:"",col4:"",col5:"",col6:"",col7:"",col8:"",col9:"",col10:"",col11:"",col12:"",col13:"",col14:"",col15:"",col16:""};
	for (k=1;k<17;k++){eval("savedata.col"+k+"=data["+(k-1)+"]"); } // register everything to savedata
	Alloy.Globals.Log("invoicelistlist.js:: After: savedata: JSON.stringify(savedata) : "+JSON.stringify(savedata));
	var clients = Alloy.Collections.instance('client');
	clients.fetch();		
	var theclient = clients.where({
		col2:firstname,
		col3:lastname
		}); //FILTER
	Alloy.Globals.Log("invoicelistlist.js:: number of clients are: "+clients.length);
	Alloy.Globals.Log("invoicelistlist.js:: theclient is: "+JSON.stringify(theclient));
	if(theclient.length > 0){
		Alloy.Globals.Log("invocedetail.js:: JSON.stringify(theclient): "+JSON.stringify(theclient));
		var uniqueid = theclient[0].toJSON().col1;
		var company = theclient[0].toJSON().col4;
		var phone = theclient[0].toJSON().col5;
		var email = theclient[0].toJSON().col6;		
		var address = theclient[0].toJSON().col7;
		var city = theclient[0].toJSON().col8;
		var state = theclient[0].toJSON().col9;	
		Alloy.Globals.Log("invocedetail.js:: uniqueid: "+uniqueid);
	} else {
		alert("could not locate "+firstname+" "+lastname+" . Please try again.");
	}
	Alloy.Globals.Log("invoicelistlist.js:: locate jobs with uniqueid: "+uniqueid);
	
	
	//variables ends.
	
	function addPaymentRow(date,notesbody,imageurl,dateadded,employee) {
		Alloy.Globals.Log("enterpayment.js::invoicelistlist.js:addPaymentRow: date: "+date+"  dateadded: "+dateadded+" new Date(+dateadded): "+new Date(+dateadded));
	    var paidrow = Ti.UI.createView ({
                backgroundColor: "white",
                opacity:"0",
                color:"transparent",
                height: "70"
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
                image : "/images/blueline.png"
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
        paidrow.add(datelabel);
        paidrow.add(datepaid);
        paidrow.add(employeelabel);
        paidrow.add(blueline);
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
        	////paidrow.add(imagelabel);
            var paidrow = Ti.UI.createTableViewRow ({
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
        /*paidrow.add(innerview);
        paidrow.add(datelabel);
        paidrow.add(employeelabel);
        paidrow.add(blueline);*/
        paidrow.metadata = dateadded; // add metadata info
     
        Alloy.Globals.Log("enterpayment.js::invoicelistlist.js:addPaymentRow: JSON.stringify(paidrow) "+JSON.stringify(paidrow));
        Alloy.Globals.Log("enterpayment.js::invoicelistlist.js:addPaymentRow: JSON.stringify(paidrow.children) "+JSON.stringify(paidrow.children));
        return paidrow;
        
	}
	
	function enterPayment(filename,cbfunc){
		Alloy.Globals.Log("invoicelistlist.js::enterPayment::after filename: " +filename);
		var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
		var name = kraniemailid.split('@')[0].trim();
		var parentid = Titanium.App.Properties.getString(name+"_invoice");
		Alloy.Globals.Log("invoicedetail.js::prefetchpayment::need to check if parent/filename exist: "+parentid+'/'+filename);
		Alloy.Globals.checkFileExist(filename,function(e){
			Alloy.Globals.Log("enterPayment.js::JSON.stringify(e): "+JSON.stringify(e));
			var sid = e.sid;
			var item="payment";
			Alloy.Globals.Log("invoicedetail.js::prefetchpayment: updating DB with: item: "+item+" e.sid: "+e.sid);
			function nexStep(){
				var payment = [];
				var enterPaymentwin = Ti.UI.createWindow({title:"Enter Payment",backgroundColor:'#404040'});
				var enterPaymentScrollView = Ti.UI.createScrollView({scrollType:'vertical',top:0,height:'60%'});
				var payment = Alloy.Collections.instance('payment');
				payment.fetch(); //1st then 2nd fetch.
				setTimeout(function(){
					payment.fetch();
					var content = payment.toJSON();
					Alloy.Globals.Log("enterPayment.js:in:Alloy.Globals.checkFileExist: Alloy.Globals.getPrivateData:nexStep:JSON stringify content: "+JSON.stringify(content));
					Alloy.Globals.Log("enterPayment.js:in:Alloy.Globals.checkFileExist: Alloy.Globals.getPrivateData:nexStep:content.length: "+content.length);
					//Prep enterPaymentwindows. START
					savedata = {col1:"",col2:"",col3:"",col4:"",col5:"",col6:"",col7:"",col8:"",col9:"",col10:"",col11:"",col12:"",col13:"",col14:"",col15:"",col16:""};
					enterPaymentScrollView.bottom = "40%";
					var datepaidpicker = Ti.UI.createPicker({type: Ti.UI.PICKER_TYPE_DATE,top:"370",left:"10%"});
					var paymentdone = Ti.UI.createButton({bottom:"5%",left:"75%",title:"DONE"});
					paymentdone.addEventListener("click",function(e){
						Alloy.Globals.Log("enterPayment.js:in:datepaidpicker: paymentdone: JSON.stringify(e): "+JSON.stringify(e));
						Alloy.Globals.Log("enterPayment.js:in:datepaidpicker: paymentdone: e.savedata: "+e.savedata+" e.source.savedata: "+e.source.savedata);
						var datasaved = (e.savedata)?e.savedata:e.source.savedata;
						if (datasaved.col1 != ""){
							Alloy.Globals.Log("enterPayment.js:in:datepaidpicker: paymentdone: Proceed save:;Alloy.Globals.submit:sid :"+sid+" datasaved.col1: "+datasaved.col1);
							savedata.col3 = savedata.col4 = savedata.col6 = savedata.col7 = savedata.col8 = savedata.col9 = savedata.col11 = 'none';
							savedata.col12 = savedata.col13 = savedata.col14 = savedata.col15 = 'NA';
							savedata.col10 = sid;
							//Alloy.Globals.submit("payment","",savedata.col1,savedata.col2,savedata.col3,savedata.col4,savedata.col5,savedata.col6,savedata.col7,savedata.col8,savedata.col9,savedata.col10,savedata.col11,savedata.col12,savedata.col13,savedata.col14,savedata.col15,savedata.col16,existingurlsedithref,existingurlsselfhref,existingurlsidtag);
				  			Alloy.Globals.submit("payment",sid,savedata.col1,savedata.col2,savedata.col3,savedata.col4,savedata.col5,savedata.col6,savedata.col7,savedata.col8,savedata.col9,savedata.col10,savedata.col11,savedata.col12,savedata.col13,savedata.col14,savedata.col15,savedata.col16);	
							enterPaymentwin.close();
						}
					});
					datepaidpicker.addEventListener("change",function(e){
						Alloy.Globals.Log("enterPayment.js:in:datepaidpicker: change: e.value"+e.value);
						var date = e.value;
						var datesplit = date.toDateString().split(' ');
	   					var datepaid = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
	   			 		Alloy.Globals.Log("enterpayment.js::setDate: date: "+date+" datesplit: "+datesplit+" datepaid: "+datepaid);
						savedata.col1 = datepaid;
						paymentdone.savedata = savedata;
					});
					var date =  new Date();
					var currentdate = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();
					var datepaidlabel = Ti.UI.createLabel({left:20,top:350,text:currentdate,color:"white"});
					var paidamountTextField = Ti.UI.createTextField({top:"340",left:"65%", hintText:"200", borderRadius:"0.25",color:"gray",width:"30%"});
					paidamountTextField.addEventListener("change",function(e){
						Alloy.Globals.Log("enterPayment.js:in:paidamountTextField: change: e.value"+e.value);
						savedata.col2=e.value;
						paymentdone.savedata = savedata;
					});
					
					enterPaymentwin.add(datepaidpicker);
					enterPaymentwin.add(datepaidlabel);
					enterPaymentwin.add(paidamountTextField);
					enterPaymentwin.add(paymentdone);
					enterPaymentwin.title = "Enter Payment";
					//Prep enterPaymentwindows. END
					var topvalue = 10;				
					var paidamount = 0;
					for (i=0;i<content.length;i++){
							var notesbody = content[i].col2;
					        var imageurl = content[i].col4;
					        var date = content[i].col1;
					        var dateadded = content[i].col16;
					        var employee = content[i].col5;
					        
		        			var paymentheader_rowview = Titanium.UI.createView({top:topvalue, backgroundColor:"gray", height:"40",borderRadius:"10"});
							var payment_rowview = Titanium.UI.createView({top:topvalue+15, backgroundColor:"white", height:"43"});
			
							var payment_paidlabel = Titanium.UI.createLabel({left:"50%", font:{fontSize:"24"}, color:"gray",text:notesbody });
							var payment_datepaidlabel = Titanium.UI.createLabel({left:"10", top:5, font:{fontSize:"12"}, color:"black",text:date });
							var payment_datelabel = Titanium.UI.createLabel({left:"10",font:{fontSize:"8"}, color:"orange" ,top:"1", text:new Date(+dateadded).toLocaleString()});
							var payment_employeelabel = Titanium.UI.createLabel({right:"5",font:{fontSize:"8"}, color:"orange" ,top:"1", text:employee });
							
							paymentheader_rowview.add(payment_employeelabel);
							paymentheader_rowview.add(payment_datelabel);
							payment_rowview.add(payment_paidlabel);
							payment_rowview.add(payment_datepaidlabel);
							topvalue = topvalue + 60;
							enterPaymentScrollView.add(paymentheader_rowview);
							enterPaymentScrollView.add(payment_rowview);	
					        // calculate total
					        var paidamount = parseFloat(notesbody) + paidamount   ;
					        }
					Alloy.Globals.Log("enterPayment.js:in:Alloy.Globals.checkFileExist: Alloy.Globals.getPrivateData:nexStep:paidamount : "+paidamount);
					enterPaymentwin.add(enterPaymentScrollView);
					enterPaymentwin.addEventListener('close', function(){(cbfunc) && cbfunc();});
					enterPaymentwin.open();
					setTimeout(function(){(cbfunc) && cbfunc();},2000);
				},1000);			
			}
			Alloy.Globals.getPrivateData(e.sid,item,nexStep(),function(){});			
		});	
		//setTimeout(function(){nexStep();},4000);
		
		
		
	}

	function altenterPayment(filename){
		Alloy.Globals.Log("invoicelistlist.js: openInvoiceDetail:altenterPayment: filename: " +filename);
		//Prep Windows. START
		openInvoiceDetailscrollView.removeAllChildren();
		openInvoiceDetailscrollView.bottom = "40%";
		var datepaidpicker = Ti.UI.createPicker({type: Ti.UI.PICKER_TYPE_DATE,top:"370",left:"10%"});
		var datepaidlabel = Ti.UI.createLabel({left:20,top:350,text:"1/17/2018",color:"white"});
		var paidamountTextField = Ti.UI.createTextField({top:"340",left:"65%", hintText:"200", borderRadius:"0.25",color:"gray",width:"30%"});
		var paymentdone = Ti.UI.createButton({bottom:"5%",left:"75%",title:"DONE"});
		win.add(datepaidpicker);
		win.add(datepaidlabel);
		win.add(paidamountTextField);
		win.add(paymentdone);
		win.title = "Enter Payment";
		//Prep Windows. END
		var topvalue = 10;	
				
		for (i=0;i<10;i++){
			var paymentheader_rowview = Titanium.UI.createView({top:topvalue, backgroundColor:"gray", height:"40",borderRadius:"10"});
			var payment_rowview = Titanium.UI.createView({top:topvalue+15, backgroundColor:"white", height:"43"});
		
			var payment_paidlabel = Titanium.UI.createLabel({left:"50%", font:{fontSize:"24"}, color:"gray",text:"100.00" });
			var payment_datepaidlabel = Titanium.UI.createLabel({left:"10", top:5, font:{fontSize:"12"}, color:"black",text:"9/17/2016" });
			var payment_datelabel = Titanium.UI.createLabel({left:"100",font:{fontSize:"8"}, color:"orange" ,top:"1", text:"9/18/2016" });
			var payment_employeelabel = Titanium.UI.createLabel({left:"10",font:{fontSize:"8"}, color:"orange" ,top:"1", text:"Mark Hughes" });
			
			paymentheader_rowview.add(payment_employeelabel);
			paymentheader_rowview.add(payment_datelabel);
			payment_rowview.add(payment_paidlabel);
			payment_rowview.add(payment_datepaidlabel);
			topvalue = topvalue + 60;
			openInvoiceDetailscrollView.add(paymentheader_rowview);
			openInvoiceDetailscrollView.add(payment_rowview);	
		}
	}
	
	//rows, labels, etc.
	var win = Titanium.UI.createWindow({title:"Invoice Detail", backgroundColor: "#404040"});	
	var activityIndicator = Ti.UI.createActivityIndicator({style: Titanium.UI.ActivityIndicatorStyle.BIG_DARK});
	var invoicenumber_rowview = Titanium.UI.createView({id:"invoicenumber_row",backgroundColor:"#F5F5F5",top:'5',  height:"105", borderRadius:"10"});
	var invoicenumberlabel = Titanium.UI.createLabel({id:"invoicenumber" ,color:"#404040" ,top:"5", font: { fontSize:10 }, text:"Invoice #: "+invoicenumber});
	var headerlabel = Titanium.UI.createLabel({id:"header", color:"#404040", top:"20", text:firstname+" "+lastname, font: { fontSize:30, fontStyle: 'bold' } }) ;
	invoicenumber_rowview.add(invoicenumberlabel);invoicenumber_rowview.add(headerlabel);
	Alloy.Globals.Log("invoicelistlist.js: openInvoiceDetail:JSON.stringify invoicenumber_rowview : " +JSON.stringify(invoicenumber_rowview));
	var totalbalance_rowview = Titanium.UI.createView({id:"totalbalance_row", top:"85", backgroundColor:"#F5F5F5", height:"180",borderRadius:"10"});
	var bal_titlelabel = Titanium.UI.createLabel({id:"bal_title", color:"#404040", font: { fontSize:12 },top:"10", text:"BALANCE"});
	//var balance1label = Titanium.UI.createLabel({id:"balance1",color:"red",textAlign:"Ti.UI.TEXT_ALIGNMENT_CENTER",top:"20",text:balance,font: {fontSize: '54',fontStyle: 'bold'}});
	var balance2label = Titanium.UI.createLabel({id:"balance2",color:"green", top:"25",text:balance,font: {fontSize: '54',fontStyle: 'bold'}});
	var currencylabel = Titanium.UI.createLabel({id:"currency",color:"#999999", top:"85",text:(currency != "NA")?currency:""});
	var totallabel = Titanium.UI.createLabel({id:"total",color:"#404040", left:'10%',top:"105",font: { fontSize:12 },text:'TOTAL: '+total});
	var paidlabel = Titanium.UI.createLabel({id:"paid",color:"#404040", right:"15%",top:"105",font: { fontSize:12 },text:'PAID: '+paid});
	var invoice_buttonlabel = Titanium.UI.createLabel({id:"invoice_button",top:"125",color:'#63D1F4',text:"Click to update payment ->"});
	invoice_buttonlabel.addEventListener("click",function(){
		activityIndicator.show();
		invoice_buttonlabel.color="gray";
		setTimeout(function(){invoice_buttonlabel.color='#63D1F4';},100);
		//altenterPayment(filename);
		enterPayment(filename,function(){activityIndicator.hide();});
	});
	totalbalance_rowview.add(bal_titlelabel);
	//totalbalance_rowview.add(balance1label);
	totalbalance_rowview.add(balance2label);
	totalbalance_rowview.add(currencylabel);
	totalbalance_rowview.add(totallabel);
	totalbalance_rowview.add(paidlabel);
	totalbalance_rowview.add(invoice_buttonlabel);
	
	var dates_rowview = Titanium.UI.createView({id:"dates_row", top:"250", backgroundColor:"#404040", height:"125",borderRadius:"10"});
	var donelabelbutton = Ti.UI.createLabel({text:"DONE",top:"125",left:"20",color:"#63D1F4"});donelabelbutton.dates = "";
	var generateinvoice_buttonlabel = Titanium.UI.createLabel({color:'#63D1F4', left:"25%", top:"10", text:"Generate Invoice >"});
	var duedate_buttonlabel = Titanium.UI.createLabel({id:"duedate_button", color:'#63D1F4', left:"25%", top:"40", text:"DUE DATE: "});
	var duedate_label = Titanium.UI.createLabel({id:"duedate_label", color:"red" ,left:"50%", top:"40",  text:duedate });
	var duedate_donebuttonlabel = Titanium.UI.createLabel({id:"duedate_done", color:'#63D1F4', right:"40", top:"10", title:"DONE"});
	var datepicker = Ti.UI.createPicker({type: Ti.UI.PICKER_TYPE_DATE,top:"5",left:"75"});
	datepicker.addEventListener("change",function(e){
		Alloy.Globals.Log("invoicelistlist.js::datepicker:change: "+JSON.stringify(e));
		var utcdate = Date.parse(e.value.toString());
		var regdate = new Date(utcdate);
		var datedue = e.source.datedue;	
		var datedueISO = e.value.toString();
		datedue = ( (new Date(utcdate)).getMonth() + 1 )+"/"+(new Date(utcdate)).getDate()+"/"+(new Date(utcdate)).getFullYear();
		duedate_label.text = datedue;
		savedata.col11 = datedue;
		Alloy.Globals.Log("invoicelistlist.js::datepicker:change after: "+datedue+" savedata.col11: "+savedata.col11);
		donelabelbutton.savedata = savedata;	
		Alloy.Globals.Log("invoicelistlist.js::datepicker:change after: JSON.stringify(savedata) "+JSON.stringify(savedata));
	});
	var pickerrowview = Ti.UI.createView({top:315,height:"150", backgroundColor:"#404040"});
	pickerrowview.add(datepicker);
	pickerrowview.add(donelabelbutton);
	datepicker.visible = false;
	pickerrowview.hide();
	duedate_buttonlabel.addEventListener("click",function(e){
		Alloy.Globals.Log("invoicelistlist.js::duedate_buttonlabel:click: "+JSON.stringify(e));
		duedate_buttonlabel.color="gray";setTimeout(function(){duedate_buttonlabel.color="#63D1F4";},100);
		datepicker.source = "duedate_buttonlabel";
		Alloy.Globals.Log("invoicelistlist.js: openInvoiceDetail:datepicker.visible : " +datepicker.visible);
		if (datepicker.visible) {
			datepicker.hide();pickerrowview.hide();
			action_rowview.top=parseFloat(action_rowview.top)-200;
			(jobitem_row0) && jobitem_row0.show();
			(jobitemlist0_row1) && jobitemlist0_row1.show();
		} 
		else {
			pickerrowview.show();pickerrowview.add(donelabelbutton);datepicker.show();
			action_rowview.top=parseFloat(action_rowview.top)+200;
			(jobitem_row0) && jobitem_row0.hide();
			(jobitemlist0_row1) && jobitemlist0_row1.hide();
		}
	});
	donelabelbutton.addEventListener("click",function(e){
		Alloy.Globals.Log("invoicelistlist.js: donelabelbutton: JSON.stringify(savedata) : " +JSON.stringify(savedata));
		setTimeout(function(){donelabelbutton.color="gray";},100);
		datepicker.hide();pickerrowview.hide();
		action_rowview.top=parseFloat(action_rowview.top)-200;
		(jobitem_row0) && jobitem_row0.show();
		(jobitemlist0_row1) && jobitemlist0_row1.show();
		Alloy.Globals.Log("invoicelistlist.js: donelabelbutton::existingurlsedithref, "+existingurlsedithref+", existingurlsselfhref, "+existingurlsselfhref+",  existingurlsidtag, "+existingurlsidtag);
		savedata.col14=savedata.col16="NA";Alloy.Globals.submit("project","",savedata.col1,savedata.col2,savedata.col3,savedata.col4,savedata.col5,savedata.col6,savedata.col7,savedata.col8,savedata.col9,savedata.col10,savedata.col11,savedata.col12,savedata.col13,savedata.col14,savedata.col15,savedata.col16,existingurlsedithref,existingurlsselfhref,existingurlsidtag);	
	});
	
	duedate_donebuttonlabel.addEventListener("click",function(e){});
	dates_rowview.add(duedate_buttonlabel);
	dates_rowview.add(duedate_label);
	dates_rowview.add(duedate_donebuttonlabel);
	dates_rowview.add(generateinvoice_buttonlabel);
	
	var action_rowview = Titanium.UI.createView({id:"action_row", top:"335", backgroundColor:"#F5F5F5", height:"150",borderRadius:"10"});
	var phonebuttonimage = Ti.UI.createImageView({left:"15%", top:"10", height:"30", width:"30", image:"/images/call.png" });
	phonebuttonimage.addEventListener=("click",function(e){ });
	var emailbuttonimage = Titanium.UI.createImageView({left:"40%", top:"10", height:"30", width:"30", image:"/images/email.png" });
	emailbuttonimage.addEventListener=("click",function(e){ });
	var previewbuttonimage = Titanium.UI.createImageView({left:"65%", top:"10", height:"30", width:"30", image:"/images/documents@2x.png" });
	emailbuttonimage.addEventListener=("click",function(e){ });
	action_rowview.add(phonebuttonimage);
	action_rowview.add(emailbuttonimage);
	action_rowview.add(previewbuttonimage);	
	
	/*
	win.add(invoicenumber_rowview);	
	win.add(totalbalance_rowview);	
	win.add(dates_rowview);	
	win.add(action_rowview);
	Alloy.Globals.Log("invoicelistlist.js: openInvoiceDetail:JSON.stringify jobitem_row : " +JSON.stringify(jobitem_row));
	win.add(jobitem_row);	
	*/
	
	openInvoiceDetailscrollView.add(invoicenumber_rowview);	
	openInvoiceDetailscrollView.add(totalbalance_rowview);	
	openInvoiceDetailscrollView.add(dates_rowview);	
	openInvoiceDetailscrollView.add(action_rowview);
	openInvoiceDetailscrollView.add(pickerrowview);
	//Alloy.Globals.Log("invoicelistlist.js: openInvoiceDetail:JSON.stringify openInvoiceDetailscrollView : " +JSON.stringify(openInvoiceDetailscrollView));
	
	if (uniqueid){
		var uniqueid = uniqueid.toString().trim();
		projectitemsarray = [];
		projectnamesarray = [];
		var projects = Alloy.Collections.instance('project');
		projects.fetch();
		Alloy.Globals.Log("invoicelistlist.js:: JSON.stringify(projects): "+JSON.stringify(projects));
		var theproject = projects.where({
			col13:uniqueid
			}); //FILTER
		Alloy.Globals.Log("invoicelistlist.js:: locate jobs with uniqueid: "+uniqueid + " theproject.length "+theproject.length);
		Alloy.Globals.Log("invoicelistlist.js:: b4 JSON.stringify(theproject): "+JSON.stringify(theproject));
		if(theproject.length > 0){
			Alloy.Globals.Log("invoicelistlist.js:: JSON.stringify(theproject): "+JSON.stringify(theproject));
			for (i=0;i<theproject.length;i++){
				var projectnames = theproject[i].toJSON().col1;
				var projectitems = theproject[i].toJSON().col12;
				projectitemsarray.push(projectitems);
				projectnamesarray.push(projectnames);
			}
			Alloy.Globals.Log("invoicelistlist.js:: JSON.stringify(projectitemsarray): "+JSON.stringify(projectitemsarray));
		}
	} else { Alloy.Globals.Log("uniqueid is not a number: uniqueid: "+uniqueid);};
	
	if (projectitemsarray && projectitemsarray.length>0) {
		var topvalue = 415;
		//var jobitem_row = Titanium.UI.createView({id:"jobitem_row", top:"365", backgroundColor:"#F5F5F5", height:"545",borderRadius:"10"});		
		for (x=0;x<projectitemsarray.length;x++) {
			var jobitem_row_topSTART = topvalue;
			eval("var jobitem_row"+x+" = Titanium.UI.createView({top:topvalue,backgroundColor:'#F5F5F5', height:'300',borderRadius:'10',borderColor:'gray'})");
			var projectitems = JSON.parse(projectitemsarray[x].replace(/cOlOn/g,":").toString());   // replacing all cOlOn to ':'
			var projectname = projectnamesarray[x];
			Alloy.Globals.Log("invoicelistlist.js:: createRow: projectnamesarray["+x+"]: "+projectnamesarray[x]);
			Alloy.Globals.Log("invoicelistlist.js:: createRow: JSON.stringify(projectitems): "+JSON.stringify(projectitems));
			Alloy.Globals.Log("invoicedetail.js::topvalue at START : "+topvalue);
			topvalue = topvalue + 8;
			var projectidentification=projectnamesarray[x].trim().replace(/\s/g,'_'); //
			var projectinfoarray=[];
			var unchecked = Ti.UI.createImageView({
				id: projectidentification,
				top: 8,
				left: "85%",
				height : 30,
				width : 30,
				image : "/images/EditControl.png"
			});
			var checked = Ti.UI.createImageView({
				id: projectidentification,
				top: 8,
				left: "85%",
				height : 30,
				width : 30,
				image : "/images/EditControlSelected.png"
			});
			unchecked.addEventListener("click",function(e){
				Alloy.Globals.Log("invoicelistlist.js::unchecked:click: "+JSON.stringify(e));
				if (e.source.titleid) {
					Alloy.Globals.Log("invoicelistlist.js::jobitem_row event listener: JSON.stringify(e): "+JSON.stringify(e));
					if (e.source.image=="/images/EditControl.png"){
						Alloy.Globals.Log("invoicelistlist.js::after "+e.source.image+" clicked: JSON.stringify(e): "+JSON.stringify(e));
						Alloy.Globals.Log("invoicelistlist.js::after "+e.source.image+" clicked: retrieved JSON.stringify(e.source.titleid): "+JSON.stringify(e.source.titleid));
						var info=e.source.titleid;
						var infostring = JSON.stringify(e.source.titleid);
						var infostringmod = (infostring)?infostring.replace(/\[/g,"xSqBracketOpen").replace(/\]/g,"xSqBracketClose"):"";
						Alloy.Globals.Log("invoicelistlist.js::after "+e.source.image+" clicked: retrieved project name at Pos 0 again: "+info[0].names);
						e.source.image="/images/EditControlSelected.png";
						var itemid = Date.now().toString();
						//update adhoc table.
						var dataModel = Alloy.createModel("adhoc",{
				                                        col1 :  itemid,
				                                        col2 : info[0].names,
				                                        col3 : infostringmod, 
				                                        //col4:	projectitems[i].price
				                                });     
				        dataModel.save();
						adhocs.fetch();
						Alloy.Globals.Log("invoicelistlist.js:: aftere adhocs add & fetch: "+JSON.stringify(adhocs));
						// tag source with itemid
						e.source.itemid=itemid;
						Alloy.Globals.Log("invoicelistlist.js::itemid, "+itemid+", stamp to "+e.source.image+" clicked: JSON.stringify(e): "+JSON.stringify(e));
					} else {
						Alloy.Globals.Log("invoicelistlist.js::after "+e.source.image+" clicked: JSON.stringify(e): "+JSON.stringify(e));
						e.source.image="/images/EditControl.png";
						var itemid=e.source.itemid;
						adhocs.fetch();
						var theadhoc = adhocs.where({
							col1:itemid
							}); 
						Alloy.Globals.Log("invoicelistlist.js::to uncheck: theadhoc is: "+JSON.stringify(theadhoc));
						Alloy.Globals.Log("invoicelistlist.js::to uncheck: adhocs is: "+JSON.stringify(adhocs));
						Alloy.Collections.adhoc.deleteCol1(itemid);
						adhocs.fetch();
						Alloy.Globals.Log("invoicelistlist.js::to uncheck: adhocs after delete : "+JSON.stringify(adhocs));
					}
				} else {alert("No items to invoice");}
			});
			topvalue = topvalue + 5;
			var projectnamelabel = Ti.UI.createLabel ({
				color : "#333",
				left : "20",
				top : 13,
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
				top : 33,
				font:{
					fontSize:14
				},
				color:"black",
				text : 'Description: '
			});
			//calculate height of item description.
			////var descr_height = ((Math.round(descr.split('').length/70)+(descr.split(/\r?\n|\r/).length))*14)+14;
			var descr_height = ((Math.round(descr.split('').length/50)+(descr.split(/\r?\n|\r/).length))*14)+14;
			var descrbodylabel = Ti.UI.createLabel ({
				color : "#333",
				left  : "120",
				top : 35,
				font:{
					fontSize:12
				},
				width:"60%",
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
			eval("jobitem_row"+x+".add(projectnamelabel)");
			eval("jobitem_row"+x+".add(unchecked)");
			eval("jobitem_row"+x+".add(descrtitlelabel)");
			eval("jobitem_row"+x+".add(descrbodylabel)");
			//topvalue=topvalue+20+descr_height-20;
			topvalue=topvalue+20+descr_height;
			var itemtitlelabel = Ti.UI.createLabel ({
				left  : "20",
				top : 53+descr_height-20,
				font:{
					fontSize:14
				},
				color:"black",
				text : 'List Item :'
			});
			var jobitem_row_topEND = topvalue;
			var jobitem_row_height = jobitem_row_topEND - jobitem_row_topSTART;
			eval("jobitem_row"+x+".height = jobitem_row_height+4");
			if ( projectitems.length > 1) {eval("jobitem_row"+x+".add(itemtitlelabel)"); }
			Alloy.Globals.Log("invoicedetail.js::topvalue "+topvalue+" jobitem_row"+x+".top: "+eval("jobitem_row"+x+".top")+" jobitem_row"+x+".height: "+eval("jobitem_row"+x+".height"));
			Alloy.Globals.Log("invoicedetail.js::topvalue  JSON.stringify(jobitem_row"+x+"): "+eval("JSON.stringify(jobitem_row"+x+")"));
			eval("openInvoiceDetailscrollView.add(jobitem_row"+x+")");
			Alloy.Globals.Log("invoicedetail.js::topvalue: after openInvoiceDetailscrollView.add(jobitem_row"+x+"): openInvoiceDetailscrollView.children.lenghth: "+openInvoiceDetailscrollView.children.lenghth );
			for (i=1;i<projectitems.length;i++){
				eval("var jobitemlist"+x+"_row"+i+" = Titanium.UI.createView({top:topvalue,backgroundColor:'#F5F5F5', height:'50',borderRadius:'10'})");
				var itembodylabel = Ti.UI.createLabel ({
					color : "#333",
					left  : "20",
					top : 5,
					font:{
						fontSize:12
					},
					text : i+' :    '+projectitems[i].lineitem
				});	
				var itemqtylabel = Ti.UI.createLabel ({
					color : "#333",
					left  : "50%",
					top : 24,
					font:{
						fontSize:10
					},
					text : 'Qty :'+projectitems[i].qty
				});
				var itempricelabel = Ti.UI.createLabel ({
					color : "#333",
					left  : "75%",
					top : 24,
					font:{
						fontSize:10
					},
					text : 'Price : '+projectitems[i].price
				});	
				topvalue = topvalue + 50;
				eval("jobitemlist"+x+"_row"+i+".add(itembodylabel)");
				eval("jobitemlist"+x+"_row"+i+".add(itemqtylabel)");
				eval("jobitemlist"+x+"_row"+i+".add(itempricelabel)");
				var info={"names":projectnamesarray[x].trim(),"descr":projectitems[0].descr,"lineitem":projectitems[i].lineitem,"qty":projectitems[i].qty,"price":projectitems[i].price};
				projectinfoarray.push(info);
				unchecked.titleid=projectinfoarray; //This determine if project has list item that can be invoiced.
				checked.titleid=projectinfoarray;
				eval("openInvoiceDetailscrollView.add(jobitemlist"+x+"_row"+i+")");//add row
				Alloy.Globals.Log("invoicedetail.js::topvalue at Sub END : "+topvalue);
				Alloy.Globals.Log("invoicedetail.js::topvalue at END : "+topvalue+" jobitemlist"+x+"_row"+i+".top: "+eval("jobitemlist"+x+"_row"+i+".top"));
				Alloy.Globals.Log("invoicedetail.js::topvalue at END : JSON.stringify(jobitemlist"+x+"_row"+i+"): "+eval("JSON.stringify(jobitemlist"+x+"_row"+i+")"));
			}
			topvalue=topvalue-2;
			projectinfoarray=[];
			Alloy.Globals.Log("invoicedetail.js::topvalue at END : "+topvalue);	
		}
		Alloy.Globals.Log("invoicedetail.js::topvalue at END: "+topvalue+" jobitem_row"+x+".top: "+eval("jobitem_row"+i+".top"));		
	} else {
		Alloy.Globals.Log("invoicedetail.js:: NO projectitemsarray: need client refresh ");
		var clientsid = Titanium.App.Properties.getString("client");
		Alloy.Globals.getPrivateData(clientsid,"client");
		var clientcollection  = Alloy.Collections.instance('client');
	    clientcollection.fetch();
	    alert("Invoice data downloaded. Please try again.");
	};

	//Report Generation. START
	function genInvoice(e){
		Alloy.Globals.Log("project.js::generateinvoice_buttonlabel:click: "+JSON.stringify(e));
		generateinvoice_buttonlabel.color="gray";generateinvoice_buttonlabel.text="Generating report ...";
		//PDF creator START	
		var strVarItems="";
		var pricetotal=0;
		var adhoc  = Alloy.Collections.instance('adhoc');
	    adhoc.fetch();
	    Alloy.Globals.Log("projectdetail.js::JSON stringify adhoc data on emailpdf: "+JSON.stringify(adhoc));
	    var adhocjson = adhoc.toJSON();
	    Alloy.Globals.Log("projectdetail.js::jobitemjson.length: "+adhocjson.length);
	    for (i=0;i<adhocjson.length;i++){
			Alloy.Globals.Log("invoicelistlist.js::emailpdf:: adhocjson["+i+"].col3: "+adhocjson[i].col3);
			var jobitemstring=adhocjson[i].col3.replace(/xSqBracketOpen/,'[').replace(/xSqBracketClose/,']');
			Alloy.Globals.Log("invoicelistlist.js::emailpdf:: adhocs extraction: jobitemstring.length "+jobitemstring.length+ "jobitemstring : "+jobitemstring);
			var jobitemjson = JSON.parse(jobitemstring);
			Alloy.Globals.Log("invoicelistlist.js::emailpdf:: adhocs extraction: jobitemjson.length "+jobitemjson.length+ "jobitemjson : "+jobitemjson);
	    	for (j=0;j<jobitemjson.length;j++){
		    	var names=jobitemjson[0].names;
				Alloy.Globals.Log("invoicedetail.js::emailpdf:: adhocs extraction:  jobitemjson["+j+"].names : "+jobitemjson[j].names
				+" : jobitemjson["+j+"].descr: "+jobitemjson[j].descr+" jobitemjson["+j+"].lineitem : "+jobitemjson[j].lineitem
				+" jobitemjson["+j+"].price : "+jobitemjson[j].price+" jobitemjson["+j+"].qty : "+jobitemjson[j].qty);
	    		if (jobitemjson[j].lineitem){
					strVarItems += "		<br><table width=\"100%\" class=\"jobitem\"><tr>";
					if (j == "0"){
						strVarItems += "						<td width=\"10%\">"+jobitemjson[j].names+"<\/td>";
						strVarItems += "						<td width=\"27%\">"+jobitemjson[j].descr+"<\/td>";
					} else {
						strVarItems += "<td width=\"10%\"> <\/td>";
						strVarItems += "<td width=\"27%\"> <\/td>";
					};					
					strVarItems += "						<td width=\"23%\">"+jobitemjson[j].lineitem+"<\/td>";
					strVarItems += "						<td width=\"5%\">"+jobitemjson[j].qty+"<\/td>";
					strVarItems += "						<td width=\"5%\">"+jobitemjson[j].price+"<\/td>";
					var pricetotal = pricetotal + parseFloat(jobitemjson[j].price);
					Alloy.Globals.Log("invoicelistlist.js: html gen: pricetotal "+pricetotal);
					strVarItems += "					<\/tr>";
					////strVarItems += "				<\/tbody>";
					strVarItems += "			<\/table>";
		    	}	
	    	}    	
	    };

		
		
		var coAddress = "1125 Bluemound Rd., Brookfield, WI 53222";
		var coPhone = "262-290-3141";
		var coFax = "262-290-3142";
		var coEmail = "sales@jackmowinc.com";
		var logourl = 'https://docs.google.com/uc?id=0B8NAtyyp6PTGdkNYaGRma3VtUlE&export=download';
		var custphone = phone;
		var strVar='';
		var address = "2258 S West Dr., Brookfield, WI";
		strVar += '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">';
		strVar += "	<head>";
		strVar += "		<meta charset=\"utf-8\">";
		strVar += "		<title>Project Report<\/title>";
		strVar += "<style>";
		strVar += "table.header th { text-align: center; text-transform: uppercase; background: #000; color: #FFF;font-size: 300% }";
		strVar += "h1.header { text-align: center; text-transform: uppercase; font-size: 125% ; letter-spacing: 10px;}";
		strVar += "table.customer td{border:0;border-width: 1px;}";
		strVar += "table.summary {align: left;border-width: 0px;}";
		strVar += "table.jobitem th,td {align: left;border-width: 0px;}";
		strVar += "th,td {text-align:left;border-width: 0px;}";
		strVar += "table.summary th,td { padding: 0.5em; position: relative; text-align: left; }";
		strVar += "table.summary th,td { border-radius: 0.50em;}";
		strVar += "table.item th{text-align:center;border-width: 1px; padding: 0.5em; position: relative;border-radius: 0.25em; border-style: solid;background:gray;color:white;}";
		strVar += "</style>";
		strVar += "	<\/head>";
		strVar += "	<body>";
		strVar += "			<table width=\"100%\" class=\"header\">";
		strVar += "			<tr><th style=\"font-size:200%\">Invoice<\/th></tr>";
		strVar += "			<\/table>";
		strVar += "			<br><span><img width=\"100\" height=\"100\" align=\"right\" alt=\"\" src=\""+logourl+"\"><input type=\"hidden\" accept=\"image\/*\"><\/span>";
		strVar += "				<p align=\"center\" >"+coName+". ";
		strVar += "				"+coAddress+". ";
		strVar += "				"+coPhone+". ";
		strVar += "				"+coEmail+"<\/p>";
		strVar += "			<h1 class=\"header\">Customer<\/h1>";
		strVar += "			<table width=\"100%\" align=\"left\" class=\"customer\" >";
		strVar += "				<tr>";
		strVar += "					<th ><span >"+((firstname == "none")?"":firstname)+" "+((lastname == "none")?"":lastname)+"<\/span><\/th>";
		//strVar += "					<th><span >Project Name<\/span><\/th>";
		//strVar += "					<th><span >"+balance+"<\/span><\/th>";
		strVar += "				<\/tr>";
		strVar += "				<tr>";
		strVar += "					<th><span >"+((address == "none")?"":address)+"<\/span><\/th>";
		strVar += "					<th><span >Date<\/span><\/th>";
		strVar += "					<th><span >"+(new Date()).toString().slice(4,16)+"<\/span><\/th>";
		strVar += "				<\/tr>";
		strVar += "				<tr>";
		strVar += "					<th><span >"+((city == "none")?"":city)+", "+((state == "none")?"":state)+"<\/span><\/th>";
		strVar += "					<th><span >Invoice #<\/span><\/th>";
		strVar += "					<th><span><\/span><span>"+invoicenumber+"<\/span><\/th>";
		strVar += "				<\/tr>";
		strVar += "				<tr>";
		strVar += "					<th><span >"+((custphone == "none")?"":custphone)+"<\/span><\/th>";
		strVar += "					<th><span >Total: <\/span><\/th>";
		strVar += "					<th><span >"+((pricetotal)?pricetotal:"NA")+"<\/span><\/th>";
		strVar += "				<\/tr>";
		strVar += "				<tr>";
		strVar += "					<th><span >"+((email == "none")?"":email)+"<\/span><\/th>";
		strVar += "				<\/tr>";
		strVar += "			<\/table><br><br>";
		strVar += "			<table width=\"100%\" class=\"item\">";
		strVar += "				<thead>";
		strVar += "					<tr>";
		strVar += "						<th><span >Date<\/span><\/th>";
		strVar += "						<th><span >Description<\/span><\/th>";
		strVar += "						<th><span >Item<\/span><\/th>";
		strVar += "						<th><span >Qty<\/span><\/th>";
		strVar += "						<th><span >Price<\/span><\/th>";
		strVar += "					<\/tr>";
		strVar += "				<\/thead>";
		strVar += strVarItems;
		strVar += "	<\/table>";
		strVar += "	<\/body>";
		strVar += "<\/html>";
		
		Alloy.Globals.Log("invoicelistlist.js:: strVar: "+strVar);
		
		var pdfCreator = require('com.pablog178.pdfcreator.android');	
	
	    pdfCreator.addEventListener("error", function(_evt){
	    	Alloy.Globals.Log("project.js::pdfCreator:: on error: _evt: " +_evt);
	        //An error has ocurred
	    });	
	   
	    // Generate a PDF based on HTML	    
	      
	    pdfCreator.addEventListener("complete", function (_evt) {
	        //Handle the PDF created
	        Alloy.Globals.Log("project.js::pdfCreator::after complete: _evt: " +JSON.stringify(_evt));
	        generateinvoice_buttonlabel.color="#63D1F4";generateinvoice_buttonlabel.text="Generate Report in PDF > ";
	        ////var pdfUrl = "http://www.irs.gov/pub/irs-pdf/fw4.pdf";
			////Ti.Platform.openURL("https://docs.google.com/gview?embedded=true&url=" + Ti.Network.encodeURIComponent(pdfUrl));		
			var pdfemaildialog = Ti.UI.createAlertDialog({
				cancel: 1,
				buttonNames: ['NO', 'YES'],
				message: 'Would you like to email the PDF?',
				title: 'email PDF'
			});
			pdfemaildialog.addEventListener('click', function(e){
				Alloy.Globals.Log("project.js::pdfCreator::pdfemaildialog: JSON.stringify(e) :"+JSON.stringify(e));
				Alloy.Globals.Log("project.js::pdfCreator:: pdfemaildialog: e.source.data :"+e.source.data);
				
				var pdfFile = e.source.pdfFile; 
				Alloy.Globals.Log("project.js::pdfCreator::pdfemaildialog: pdfFile: " +JSON.stringify(pdfFile));
				/*
				var pdffilename = e.source.pdffilename; 
				var name = e.source.name;
				var parentid = e.source.parentid;
				var appfilepath = e.source.appfilepath;*/
				Alloy.Globals.Log("project.js::pdfCreator::pdfemaildialog: b4 dialog launched: pdffilename: "+pdffilename);
				if (e.index == 1 ) {
					Alloy.Globals.Log("project.js::pdfCreator::pdfemaildialog: emailing pdffilename :"+pdffilename);
					pdfemaildialog.hide();
				    var emailDialog = Ti.UI.createEmailDialog();  
					emailDialog.addAttachment(pdfFile);
			 		emailDialog.open(); 				
				} else {				
					Alloy.Globals.Log("project.js::pdfCreator::pdfemaildialog: Cancelled : just open:");
					try{
					    Ti.Android.currentActivity.startActivity(Ti.Android.createIntent({
					        action: Ti.Android.ACTION_VIEW,
					        type: 'application/pdf',
					        data: appfilepath
					    }));
					} catch(e) {
					    Ti.API.info('error trying to launch activity, e = '+JSON.stringify(e));
					    Alloy.Globals.Log('project.js::pdfCreator:No PDF apps installed!');			
					}					
					Alloy.Globals.Log("project.js::pdfCreator:Alloy.Globals.uploadFile(pdfFile,"+pdffilename+","+parentid+")");
					Alloy.Globals.uploadFile('hello.pdf',pdffilename,parentid);		
					pdfemaildialog.hide();			
				} 	
			});			
			var pdfFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, _evt.filename);pdfemaildialog.pdfFile=pdfFile;
			Alloy.Globals.Log("project.js::pdfCreator:: pdfFile: " +JSON.stringify(pdfFile));
			var date = new Date();var dateinsert = date.getFullYear()+""+(date.getMonth()+1)+""+date.getDate()+""+date.getHours();
     	 	pdffilename = invoicenumber+"_"+firstname+"_"+lastname+"_"+dateinsert;pdfemaildialog.pdffilename=pdffilename;
     	 	var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
		 	var name = kraniemailid.split('@')[0].trim();pdfemaildialog.name=name;
     	 	var parentid = Titanium.App.Properties.getString(name+"_project");pdfemaildialog.parentid=parentid;
			var appfilepath = pdfFile.nativePath;pdfemaildialog.appfilepath=appfilepath;
 
 			pdfemaildialog.show();

			/*
			var win = Ti.UI.createWindow({ backgroundColor : 'white' });
			var androidpdf = require('com.ishan.androidpdf');
			Ti.API.info("module is => " + androidpdf);
			androidpdf.openPDF({ 'fileName' : 'hello' });
			win.open();*/
	    }); 
	    
	    Alloy.Globals.Log("project.js::pdfCreator::strVar: " +strVar);
	    pdfCreator.generatePDFWithHTML({
	        ////html : '<html><body><h1>Hello World!</h1></body></html>',
	        html : strVar,
	        filename : 'hello.pdf'
	    });	    
	    //PDF creator end.
	};
	generateinvoice_buttonlabel.addEventListener("click",function(e){
		generateinvoice_buttonlabel.color="gray";
		setTimeout(function(){generateinvoice_buttonlabel.color='#63D1F4';},100);
		genInvoice(e);			
	});
	//Report Generation. END

	win.add(openInvoiceDetailscrollView);
	win.add(activityIndicator);
	win.addEventListener('close',function(){});
	win.open();
}
