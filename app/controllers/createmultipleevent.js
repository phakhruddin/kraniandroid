exports.openMainWindow = function(_tab) {
  _tab.open($.createevent_window);
  Ti.API.info("This is child widow : " +JSON.stringify(_tab));
  multiplepicker();  

};

function multiplepicker(){
	// Appcelerator Titanium (JS) code to produce multiple selection type data entry in a single window.
// via @CJ_Reed
// and Dan Tamas : http://cssgallery.info/making-a-combo-box-in-titanium-appcelerator-code-and-video



	var win = Titanium.UI.createWindow({
		fullscreen: true,
		tabBarHidden : true,
		navBarHidden: false
	});	

 if(Ti.Platform.osname == 'android'){
		alert("do nothing this is android");
   	} else {
	   	var btnBack = Ti.UI.createButton({ 
			title: '< Back', 
			top: 5,
			left: 10
		});
	   	var win1 = Titanium.UI.iOS.createNavigationWindow({
			Title: "Event",
			backgroundColor: "transparent",
	   	  	window: win
	    });
	    win1.add(btnBack);
	    btnBack.addEventListener("click", function(_tab) { 
			console.debug("closing map" +_tab);
	//		Ti.API.info("tab:" + JSON.stringify(_tab));
			win1.close();
	});
   }; 

// build custom tableView data/layout
var array = [];
var titleRow = Titanium.UI.createTableViewRow({height:46, className:'titleRow'}); 
var valueRow = Titanium.UI.createTableViewRow({height:46, className:'valueRow'}); 
var dateRow = Titanium.UI.createTableViewRow({height:46, className:'dateRow'});
var titleLabel = Ti.UI.createLabel({color:'#000000', text:"Name", font:{fontSize:21, fontWeight:'bold'}, top:8, left:12, height:24, width:99});
var titleText = Titanium.UI.createTextField({value:"", color:'#336699', borderColor:'#888', borderWidth:0.1, borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED, font:{fontSize:16, fontWeight:'bold'},top:8, left:100, height:32, width:184});
var valueLabel = Ti.UI.createLabel({color:'#000000', text:"Value", font:{fontSize:21, fontWeight:'bold'}, top:8, left:12, height:24, width:170});
var dateLabel = Ti.UI.createLabel({color:'#000000', text:"Date", font:{fontSize:21, fontWeight:'bold'}, top:8, left:12, height:24, width:170});
var valueData = Ti.UI.createLabel({color:'#3D4460', text:"", font:{fontSize:17, fontWeight:'normal'}, top:11, left:102, height:20, width:180, textAlign:'right'});	
var dateData = Ti.UI.createLabel({color:'#3D4460', text:"", font:{fontSize:17, fontWeight:'normal'}, top:11, left:102, height:20, width:180, textAlign:'right'});	
titleRow.add(titleLabel);
titleRow.add(titleText);
valueRow.add(valueLabel);
valueRow.add(valueData);
dateRow.add(dateLabel);
dateRow.add(dateData);
array.push(titleRow);
array.push(valueRow);
array.push(dateRow);

// view initialisation
var tableView = Titanium.UI.createTableView({data:array, style:Titanium.UI.iPhone.TableViewStyle.GROUPED});
var pickerView = Titanium.UI.createView({height:248,bottom:-248});
var datePickerView = Titanium.UI.createView({height:248,bottom:-248});

// value picker initialisation
var picker = Titanium.UI.createPicker({top:0});
picker.selectionIndicator=true;
var pickerValues = [
	Titanium.UI.createPickerRow({title:'John'}),
	Titanium.UI.createPickerRow({title:'Alex'}),
	Titanium.UI.createPickerRow({title:'Marie'}),
	Titanium.UI.createPickerRow({title:'Eva'}),
	Titanium.UI.createPickerRow({title:'James'})
];
picker.add(pickerValues);
pickerView.add(picker);

// date picker initialisation
var datePicker = Titanium.UI.createPicker({top:0, type:Titanium.UI.PICKER_TYPE_DATE_AND_TIME});
datePicker.selectionIndicator=true;
datePickerView.add(datePicker);

// animations
var slideIn =  Titanium.UI.createAnimation({bottom:-43});
var slideOut =  Titanium.UI.createAnimation({bottom:-251});

// event functions
tableView.addEventListener('click', function(eventObject){
	if (eventObject.rowData.className == "valueRow")
	{
		titleText.blur();
		datePickerView.animate(slideOut);	
		pickerView.animate(slideIn);		
	}
	else if (eventObject.rowData.className == "titleRow")
	{
		pickerView.animate(slideOut);
		datePickerView.animate(slideOut);
		titleText.focus();	
	}
	else if (eventObject.rowData.className == "dateRow")
	{
		pickerView.animate(slideOut);
		datePickerView.animate(slideIn);
		titleText.blur();	
	};
});

datePicker.addEventListener('change',function(e)
{
	dateData.text = e.value;
	tableView.setData(array);
});

picker.addEventListener('change',function(e)
{
	valueData.text = picker.getSelectedRow(0).title;;
	tableView.setData(array);
});

titleText.addEventListener('focus',function() {
	pickerView.animate(slideOut);
	datePickerView.animate(slideOut);
});

// build display
win.add(tableView);
win.add(pickerView);
win.add(datePickerView);

	if(Ti.Platform.osname == 'android'){
		win.open();
	} else {
		win1.open();
	};

}
