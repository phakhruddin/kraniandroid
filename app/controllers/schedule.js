exports.openMainWindow = function(_tab) {
  _tab.open($.schedule_window);
  Ti.API.info("This is child widow schedule.js" +JSON.stringify(_tab));
  $.schedule_list.search = $.search_history;
  refreshCalendar();
  Alloy.Collections.schedule.fetch();
  Alloy.Collections.labor.fetch();	
  
};

$.ptr.refresh();

  var osname = Ti.Platform.osname;
  
  function CheckEvents() {
	var calendars = [];
	var selectedCalendarName;
	var selectedid;
	var pickerData = [];
	
	
	//**read events from calendar*******
	function performCalendarReadFunctions(){
	    var scrollView = Ti.UI.createScrollView({
	      backgroundColor: '#eee',
	      height: 500,
	      top: 20
	    });
	
	    var label = Ti.UI.createLabel({
	      backgroundColor: 'white',
	      text: 'Click on the button to display the events for the selected calendar',
	      textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
	      top: 20
	    });
	    scrollView.add(label);
	
	    var selectableCalendars = Ti.Calendar.allCalendars;
	    for (var i = 0, ilen = selectableCalendars.length; i < ilen; i++) {
	      calendars.push({ name: selectableCalendars[i].name, id: selectableCalendars[i].id });
	      pickerData.push( Ti.UI.createPickerRow({ title: calendars[i].name }) );
	      if(i === 0){
	        selectedCalendarName = selectableCalendars[i].name;
	        selectedid = selectableCalendars[i].id;
	      }
	    }
	    
	    if(!calendars.length){
	      label.text = 'No calendars available. Select at least one in the native calendar before using this app';
	    } else {
	      label.text = 'Click button to view calendar events';
	      
	      var picker = Ti.UI.createPicker({
	        top:20
	      });
	      
	      picker.add(pickerData);
	      win.add(picker);
	      
	      picker.addEventListener('change', function(e){
	        for (var i = 0, ilen = calendars.length; i < ilen; i++) {
	          if(calendars[i].name === e.row.title){
	            selectedCalendarName = calendars[i].name;
	            selectedid = calendars[i].id;
	            Ti.API.info('Selected calendar that we are going to fetch is :: '+ selectedid + ' name:' + selectedCalendarName);
	          }
	        }
	      });
	      
	      var button = Ti.UI.createButton({
	        title: 'View events',
	        top: 20
	      });
	      win.add(button);
	      
	      button.addEventListener('click', function(e){
	        label.text = 'Generating...';
	        
	        var currentYear = new Date().getFullYear();
	        
	        var consoleString = '';
	        
	        function print(s) {
	          if (consoleString.length) {
	            consoleString = consoleString + '\n';
	          }
	          consoleString = consoleString + s;
	        }
	        
	        var calendar = Ti.Calendar.getCalendarById(selectedid);
	        Ti.API.info('Calendar was of type' + calendar);
	        Ti.API.info('calendar that we are going to fetch is :: '+ calendar.id + ' name:' + calendar.name);
	        
	        function printReminder(r) {
	            if (osname === 'android') {
	                var typetext = '[method unknown]';
	                if (r.method == Ti.Calendar.METHOD_EMAIL) {
	                    typetext = 'Email';
	                } else if (r.method == Ti.Calendar.METHOD_SMS) {
	                    typetext = 'SMS';
	                } else if (r.method == Ti.Calendar.METHOD_ALERT) {
	                    typetext = 'Alert';
	                } else if (r.method == Ti.Calendar.METHOD_DEFAULT) {
	                    typetext = '[default reminder method]';
	                }
	                print(typetext + ' reminder to be sent ' + r.minutes + ' minutes before the event');
	            }
	        }
	        
	        function printAlert(a) {
	            if (osname === 'android') {
	                print('Alert id ' + a.id + ' begin ' + a.begin + '; end ' + a.end + '; alarmTime ' + a.alarmTime + '; minutes ' + a.minutes);
	            } else if (osname === 'iphone' || osname === 'ipad') {
	                print('Alert absoluteDate ' + a.absoluteDate + ' relativeOffset ' + a.relativeOffset);
	            }
	        }
	        
	        function printEvent(event) {
	          if (event.allDay) {
	            print('Event: ' + event.title + '; ' + event.begin + ' (all day)');
	          } else {
	            print('Event: ' + event.title + '; ' + event.begin + ' ' + event.begin+ '-' + event.end);
	          }
	          
	          var reminders = event.reminders;
	          if (reminders && reminders.length) {
	            print('There is/are ' + reminders.length + ' reminder(s)');
	            for (var i = 0; i < reminders.length; i++) {
	                printReminder(reminders[i]);
	            }
	          }
	          print('hasAlarm? ' + event.hasAlarm);
	          var alerts = event.alerts;
	          if (alerts && alerts.length) {
	            for (var i = 0; i < alerts.length; i++) {
	              printAlert(alerts[i]);
	            }
	          }
	          
	          var status = event.status;
	          if (status == Ti.Calendar.STATUS_TENTATIVE) {
	            print('This event is tentative');
	          }
	          if (status == Ti.Calendar.STATUS_CONFIRMED) {
	            print('This event is confirmed');
	          }
	          if (status == Ti.Calendar.STATUS_CANCELED) {
	            print('This event was canceled');
	          }
	        }
	        
	        var events = calendar.getEventsInYear(currentYear);
	        if (events && events.length) {
	          print(events.length + ' event(s) in ' + currentYear);
	          print('');
	          for (var i = 0; i < events.length; i++) {
	            printEvent(events[i]);
	            print('');
	          }
	        } else {
	          print('No events');
	        }
	        
	        label.text = consoleString;
	      });
	    }
	
	    win.add(scrollView);
	}
	
	
	var win = Ti.UI.createWindow({
	  backgroundColor: 'white',
	  exitOnClose: true,
	  fullscreen: false,
	  layout: 'vertical',
	  title: 'Calendar'
	});
	
	if (osname === 'android') {
	    performCalendarReadFunctions();
	} else if (osname === 'iphone' || osname === 'ipad') {
	    if (Ti.Calendar.eventsAuthorization == Ti.Calendar.AUTHORIZATION_AUTHORIZED) {
	        performCalendarReadFunctions();
	    } else {
	        Ti.Calendar.requestEventsAuthorization(function(e){
	            if (e.success) {
	                performCalendarReadFunctions();
	            } else {
	                alert('Access to calendar is not allowed');
	            }
	        });
	    }
	}
	
	    if(Ti.Platform.osname == 'android'){
			alert("do nothing this is android");
	   	} else {
		   	var btnBack = Ti.UI.createButton({ 
				title: '< Back', 
				top: 20,
				left: 10
			});
		   	var win1 = Titanium.UI.iOS.createNavigationWindow({
				Title: "Krani",
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
	   
	   	if(Ti.Platform.osname == 'android'){
			win.open();
		} else {
			win1.open();
		};
	
	//win.open();
	}

  function CreateEvents() {
    function printEventDetails(eventID) {
	    Ti.API.info('eventID:' + eventID);
	    var defCalendar = Ti.Calendar.defaultCalendar;
	    var eventFromCalendar = defCalendar.getEventById(eventID);
	    if (eventFromCalendar != null) {
	        Ti.API.info('Printing event values ::');
	        Ti.API.info('title : '+ eventFromCalendar.title);
	        Ti.API.info('notes : ' + eventFromCalendar.notes);
	        Ti.API.info('location:' + eventFromCalendar.location);
	        Ti.API.info('allDay ? :' + eventFromCalendar.allDay);
	        Ti.API.info('status : '+ eventFromCalendar.status);
	        Ti.API.info('availability : '+ eventFromCalendar.availability);
	        Ti.API.info('hasAlarm ? : '+ eventFromCalendar.hasAlarm);
	        Ti.API.info('id : '+ eventFromCalendar.id);
	        Ti.API.info('isDetached ? : '+ eventFromCalendar.isDetached);
	        Ti.API.info('begin : '+ eventFromCalendar.begin);
	        Ti.API.info('end : '+ eventFromCalendar.end);
	        var eventRule = eventFromCalendar.recurrenceRules;
	        Ti.API.info("recurrenceRules : " + eventRule);
	        for (var i = 0; i < eventRule.length; i++) {
	            Ti.API.info("Rule # "+ i);
	            Ti.API.info('frequency : ' + eventRule[i].frequency);
	            Ti.API.info('interval : ' + eventRule[i].interval);
	            Ti.API.info('daysofTheWeek : ' );
	            var daysofTheWeek = eventRule[i].daysOfTheWeek; 
	            for (var j = 0; j < daysofTheWeek.length; j++) {
	                Ti.API.info('{ dayOfWeek : '+ daysofTheWeek[j].dayOfWeek +'weekNumber : '+daysofTheWeek[j].week +'}, ');
	            }
	            Ti.API.info('firstDayOfTheWeek : ' + eventRule[i].firstDayOfTheWeek);
	            Ti.API.info('daysOfTheMonth : ');
	            var daysOfTheMonth = eventRule[i].daysOfTheMonth;
	            for(var j=0;j<daysOfTheMonth.length;j++) {
	                Ti.API.info(' ' + daysOfTheMonth[j]);
	            }
	            Ti.API.info('daysOfTheYear : ');
	            var daysOfTheYear = eventRule[i].daysOfTheYear;
	            for(var j=0;i<daysOfTheYear.length;j++) {
	                Ti.API.info(' ' + daysOfTheYear[j]);
	            }
	            Ti.API.info('weeksOfTheYear : ');
	            var weeksOfTheYear = eventRule[i].weeksOfTheYear;
	            for(var j=0;j<weeksOfTheYear.length;j++) {
	                Ti.API.info(' ' + weeksOfTheYear[j]);
	            }
	            Ti.API.info('monthsOfTheYear : ');
	            var monthsOfTheYear = eventRule[i].monthsOfTheYear;
	            for(var j=0;j<monthsOfTheYear.length;j++) {
	                Ti.API.info(' ' + monthsOfTheYear[j]);
	            }
	            Ti.API.info('daysOfTheYear : ');
	            var setPositions = eventRule[i].setPositions;
	            for(var j=0;j<setPositions.length;j++) {
	                Ti.API.info(' ' + setPositions[j]);
	            }
	        };
	        Ti.API.info('alerts : '+ eventFromCalendar.alerts);
	        var newAlerts = eventFromCalendar.alerts;
	        
	        for(var i=0 ; i < newAlerts.length ; i++) {
	            Ti.API.info('*****ALert '+ i);
	            Ti.API.info('absoluteDate :'+ newAlerts[i].absoluteDate);
	            Ti.API.info('relativeOffset ;' + newAlerts[i].relativeOffset);
	        }
	   }
	}
	function performCalendarWriteFunctions(){
	    var defCalendar = Ti.Calendar.defaultCalendar;
	    var date1 = new Date(new Date().getTime() + 3000),
	        date2 = new Date(new Date().getTime() + 900000);
	    Ti.API.info('Date1 : '+ date1 + 'Date2 : '+ date2);
	    var event1 = defCalendar.createEvent({
	                        title: 'Sample Event',
	                        notes: 'This is a test event which has some values assigned to it.',
	                        location: 'Appcelerator Inc',
	                        begin: date1,
	                        end: date2,
	                        availability: Ti.Calendar.AVAILABILITY_FREE,
	                        allDay: false,
	                });
	    var alert1 = event1.createAlert({
	                        absoluteDate: new Date(new Date().getTime() - (1000*60*20))
	                });
	    var alert2 = event1.createAlert({
	        relativeOffset:-(60*15)
	    });
	    var allAlerts = new Array(alert1,alert2);
	    event1.alerts = allAlerts;
	    var newRule = event1.createRecurenceRule({
	                        frequency: Ti.Calendar.RECURRENCEFREQUENCY_MONTHLY,
	                        interval: 1,
	                        daysOfTheWeek: [{dayOfWeek:1,week:2},{dayOfWeek:2}],
	                        end: {occurrenceCount:10}
	                });
	    Ti.API.info('newRule : '+ newRule);
	    event1.recurrenceRules = [newRule];
	    Ti.API.info('Going to save event now');
	    event1.save(Ti.Calendar.SPAN_THISEVENT);
	    Ti.API.info('Done with saving event,\n Now trying to retreive it.');
	    printEventDetails(event1.id);
	}
	
	if(Ti.Platform.osname == 'android'){
			var win = Ti.UI.createWindow({
	                        backgroundColor: 'transparent',
	                        title: 'Calendar'
	            });
	   	} else {
		   	var btnBack = Ti.UI.createButton({ 
				title: '< BACK',
				height:50,
			    width:"50%",
			        font: {
			        fontSize:24,
			        fontFamily:'Helvetica Neue',
			        fontWeight:'normal'
			    },
			    left:"25%",
			    right:"25%",
			    top:-50
			});
		   	var win1 = Titanium.UI.iOS.createNavigationWindow({
				Title: "Calendar",
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
	
	var label = Ti.UI.createLabel({
	                        text: 'Check console log',
	                        height: Ti.UI.size,
	                        width: Ti.UI.size
	            });
	if (osname === 'iphone' || osname === 'ipad') { win1.add(label);} else {win.add(label);}
	
	if(Ti.Calendar.eventsAuthorization == Ti.Calendar.AUTHORIZATION_AUTHORIZED) {
	    performCalendarWriteFunctions();
	} else {
	    Ti.Calendar.requestEventsAuthorization(function(e){
	            if (e.success) {
	                performCalendarWriteFunctions();
	            } else {
	                alert('Access to calendar is not allowed');
	            }
	        });
	}
	
	if (osname === 'iphone' || osname === 'ipad') { win1.add(label);} else {win.open();}
	
	
	}

  function multiplepicker(){
	// Appcelerator Titanium (JS) code to produce multiple selection type data entry in a single window.
	// via @CJ_Reed
	// and Dan Tamas : http://cssgallery.info/making-a-combo-box-in-titanium-appcelerator-code-and-video
	
	
	
	var win = Titanium.UI.createWindow({
			fullscreen: true,
			backgroundColor: "gray",
			tabBarHidden : true,
			navBarHidden: false
		});	
	
	if(Ti.Platform.osname == 'android'){
			alert("do nothing this is android");
	   	} else {
		   	var btnBack = Ti.UI.createButton({ 
				title: '< Back', 
				top: 5,
				color: "blue",
				style: "Ti.UI.iPhone.SystemButtonStyle.PLAIN",
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
	var titleRow = Titanium.UI.createTableViewRow({height:50, className:'titleRow'}); 
	var valueRow = Titanium.UI.createTableViewRow({height:50, className:'valueRow'}); 
	var dateRow = Titanium.UI.createTableViewRow({height:50, className:'dateRow'});
	var enddateRow = Titanium.UI.createTableViewRow({height:50, className:'enddateRow'});
	var submitRow = Titanium.UI.createTableViewRow({height:50, className:'submitRow'});
	var dummyRow = Titanium.UI.createTableViewRow({height:5, backgroundColor:'gray', className:'dummyRow'}); 
	//var titleLabel = Ti.UI.createLabel({color:'gray', text:"Title", font:{fontSize:20, fontWeight:'normal'}, top:8, left:12, height:24, width:99});
	//var titleText = Titanium.UI.createTextField({value:"  ", color:'#336699', borderColor:'#888', borderWidth:0.1, borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED, font:{fontSize:16, fontWeight:'normal'},top:8, left:100, height:32, width:184});
	var titleText = Titanium.UI.createTextField({color:'#336699', borderColor:'white', borderWidth:0, hintText:'Client: John Stan - Lawn Mowing', left:12, font:{fontSize:18, fontWeight:'normal'},top:0, left:20, height:40, width:320});
	var valueLabel = Ti.UI.createLabel({color:'gray', text:"Labor", font:{fontSize:16, color:"gray", fontWeight:'normal'}, top:8, left:12, height:24, width:170});
	var dateLabel = Ti.UI.createLabel({color:'gray', text:"Start Date", font:{fontSize:16,  color: "gray", fontWeight:'normal'}, top:8, left:12, height:24, width:170});
	var valueData = Ti.UI.createLabel({color:'#3D4460', text:"", font:{fontSize:16, fontWeight:'normal'}, top:11, left:112, height:20, width:180, textAlign:'right'});	
	var dateData = Ti.UI.createLabel({color:'#3D4460', text:"", font:{fontSize:16, fontWeight:'normal'}, top:11, left:100, height:20, width:240});	
	var enddateLabel = Ti.UI.createLabel({color:'gray', text:"End Date", font:{fontSize:16, color: "gray", fontWeight:'normal'}, top:8, left:12, height:24, width:170});
	var enddateData = Ti.UI.createLabel({color:'#3D4460', text:"", font:{fontSize:16, fontWeight:'normal'}, top:11, left:100, height:20, width:240});
	var submitLabel = Ti.UI.createLabel({color:'blue', text:"Create Event > ", font:{fontSize:16, fontWeight:'normal'}, top:8, right:40, height:24, width:170});	
	//titleRow.add(titleLabel);
	titleRow.add(titleText);
	valueRow.add(valueLabel);
	valueRow.add(valueData);
	dateRow.add(dateLabel);
	dateRow.add(dateData);
	enddateRow.add(enddateLabel);
	enddateRow.add(enddateData);
	submitRow.add(submitLabel);
	array.push(dummyRow);
	array.push(titleRow);
	array.push(dummyRow);
	array.push(valueRow);
	array.push(dummyRow);
	array.push(dateRow);
	array.push(dummyRow);
	array.push(enddateRow);
	array.push(dummyRow);
	array.push(submitRow);
	
	// view initialisation
	var tableView = Titanium.UI.createTableView({data:array, style:Titanium.UI.iPhone.TableViewStyle.GROUPED});
	//var pickerView = Titanium.UI.createView({height:248,bottom:-248});
	var pickerView = Titanium.UI.createView({height:248,bottom:-248});
	var datePickerView = Titanium.UI.createView({height:248,bottom:-248});
	var enddatePickerView = Titanium.UI.createView({height:248,bottom:-248});
	
	  var thelabor = Alloy.Collections.instance('labor');
	  thelabor.fetch();
	  var laborjson = thelabor.toJSON();
	  Alloy.Globals.Log("laborjson.length "+laborjson.length);
	  Alloy.Globals.Log("laborjson "+laborjson);
	  Alloy.Globals.Log("laborjson[0].col2 "+laborjson[0].col2);
	  
	  
	var labor = [ 'John', 'Alex', 'Marie', 'Eva' ];
	var Values = [];
	var pickerValues = [];
	var picker = Titanium.UI.createPicker({top:0});
	picker.selectionIndicator=true;
	
	for( var i=0; i < laborjson.length; i++){
	  var Values = Ti.UI.createPickerRow({
	    title: laborjson[i].col2+' '+laborjson[i].col3
	  });
	  pickerValues.push(Values);
	}
	
	Ti.API.info("PickerValues are : "+JSON.stringify(pickerValues));
	picker.add(pickerValues);
	pickerView.add(picker);
	
	// date picker initialisation
	var datePicker = Titanium.UI.createPicker({top:0, type:Titanium.UI.PICKER_TYPE_DATE_AND_TIME});
	datePicker.selectionIndicator=true;
	datePickerView.add(datePicker);
	
	var enddatePicker = Titanium.UI.createPicker({top:0, type:Titanium.UI.PICKER_TYPE_DATE_AND_TIME});
	enddatePicker.selectionIndicator=true;
	enddatePickerView.add(enddatePicker);
	
	// animations
	//var slideIn =  Titanium.UI.createAnimation({bottom:-33});
	var slideIn =  Titanium.UI.createAnimation({bottom:-50});
	var slideOut =  Titanium.UI.createAnimation({bottom:-251});
	
	// event functions
	submitLabel.hide();
	datePickerView.animate(slideIn);	
	tableView.addEventListener('click', function(eventObject){
		if (eventObject.rowData.className == "valueRow")
		{
			titleText.blur();
			datePickerView.animate(slideOut);
			enddatePickerView.animate(slideOut);	
			pickerView.animate(slideIn);
			submitLabel.hide();	
		}
		else if (eventObject.rowData.className == "titleRow")
		{
			pickerView.animate(slideOut);
			datePickerView.animate(slideOut);
			enddatePickerView.animate(slideOut);
			titleText.focus();	
			submitLabel.hide();			
		}
		else if (eventObject.rowData.className == "dateRow")
		{
			pickerView.animate(slideOut);
			datePickerView.animate(slideIn);
			enddatePickerView.animate(slideOut);
			titleText.blur();	
			submitLabel.hide();		
		}
		else if (eventObject.rowData.className == "enddateRow")
		{
			pickerView.animate(slideOut);
			datePickerView.animate(slideOut);
			enddatePickerView.animate(slideIn);
			titleText.blur();
		}
		else if (eventObject.rowData.className == "submitRow")
		{
			pickerView.animate(slideOut);
			datePickerView.animate(slideOut);
			enddatePickerView.animate(slideOut);
			titleText.blur();
			submitLabel.show();	
		};
	});
	
	datePicker.addEventListener('change',function(e)
	{
		//dateData.text = e.value;
		Alloy.Globals.Log("start date e.value: "+e.value);
		var startdatetimeUTC = Date.parse(e.value);
		var startdatetimeLocale = new Date(startdatetimeUTC);
		//var startdatetime = startdatetimeLocale.toString().replace(/GMT.*/," ");
		var startdatetime = startdatetimeLocale.toString().split(' ',4).toString().replace(/,/g,' ')+' '+Alloy.Globals.formatAMPM(startdatetimeLocale);
		dateData.text = startdatetime;
		tableView.setData(array);
		var dateTime = startdatetimeLocale.toISOString();
		dateData.textid = dateTime;
		Ti.API.info("dateData: "+JSON.stringify(dateData));
	});
	
	enddatePicker.addEventListener('change',function(e)
	{
		Alloy.Globals.Log("end date e.value: "+e.value);
		var enddatetimeUTC = Date.parse(e.value);
		var enddatetimeLocale = new Date(enddatetimeUTC);
		var enddatetime = enddatetimeLocale.toString().split(' ',4).toString().replace(/,/g,' ')+' '+Alloy.Globals.formatAMPM(enddatetimeLocale);
		enddateData.text = enddatetime;
		tableView.setData(array);		
		var enddateTime = enddatetimeLocale.toISOString();
		Alloy.Globals.Log("+enddateTime: " +enddateTime);
		enddateData.textid = enddateTime;
		Ti.API.info("enddateData: "+JSON.stringify(enddateData));
		submitLabel.show();	
	});
	
	picker.addEventListener('change',function(e)
	{
		valueData.text = picker.getSelectedRow(0).title;;
		tableView.setData(array);
		Ti.API.info("schedule::picker:valueData: "+JSON.stringify(valueData));
	});
	
	titleText.addEventListener('focus',function() {
		pickerView.animate(slideOut);
		datePickerView.animate(slideOut);
		enddatePickerView.animate(slideOut);
		submitLabel.hide();	
	});
	
	submitLabel.addEventListener('click',function() {
		Alloy.Globals.Log("title txt :"+JSON.stringify(titleText));
		var summary = titleText.value;
		var description = valueData.text;
		var enddateTime = enddateData.textid;
		var startdateTime = dateData.textid;
		var organizerdisplayName = valueData.text;
		Alloy.Globals.Log("schedule:submitLabel: summary, organizerdisplayName, startdateTime, enddateTime, description :" +summary+", "+organizerdisplayName+", "+startdateTime+", "+enddateTime+" , "+description);
		alert("event created");
		//Alloy.Globals.postCreateEvent(startdateTime,enddateTime,location,summary,description,organizerdisplayName,organizeremail,colorid,attendeeslist)
		Alloy.Globals.googleAuthSheet.isAuthorized(function() {
				Alloy.Globals.Log('Access Token: ' + Alloy.Globals.googleAuthSheet.getAccessToken());				
		}, function() {
				Alloy.Globals.Log('Schedule submit: Authorized first, see next window: ');
		});
		//var calid="idevice.net@gmail.com";
		var kraniemailid = Titanium.App.Properties.getString('kraniemailid');Alloy.Globals.Log("schedule.js::kraniemailid:: "+kraniemailid);
		var calid = kraniemailid;
		Alloy.Globals.Log("postCreateEvent(calid:"+calid+",startdateTime,enddateTime,\"\",summary:"+summary+",description:"+description+",organizerdisplayName:"+organizerdisplayName+")");
		postCreateEvent(calid,startdateTime,enddateTime,"",summary,description,organizerdisplayName);
		
	});

	
	// build display
	win.add(tableView);
	win.add(pickerView);
	win.add(datePickerView);
	win.add(enddatePickerView);
	
	if(Ti.Platform.osname == 'android'){
			win.open();
		} else {
			win1.open();
		};
	
}

var GoogleAuth = require('googleAuth');
var googleAuthCalendar = new GoogleAuth({
	clientId : Alloy.Globals.clientId,
	clientSecret : 'fjrsVudiK3ClrOKWxO5QvXYL',
	propertyName : 'googleToken',
	scope : ['https://spreadsheets.google.com/feeds', 'https://docs.google.com/feeds','https://www.googleapis.com/auth/calendar','https://www.googleapis.com/auth/calendar.readonly'],
	quiet: false
});

function createEventFuture() {
	Alloy.Globals.createController('createevent',$.schedule_tab);
}

function sharedCalendar() {
	//googleAuthCalendar;
	Alloy.Globals.Log('schedule::getSharedCalendar:Access Token for Calendar is: ' + Alloy.Globals.googleAuthSheet.getAccessToken());
	Alloy.Globals.googleAuthSheet.isAuthorized(function() {
		Alloy.Globals.Log('schedule::getSharedCalendar:Access Token: ' + Alloy.Globals.googleAuthSheet.getAccessToken());
	}, function() {
		Alloy.Globals.Log('schedule::getSharedCalendar::Sch shared cal Authorized first, see next window: ');
		});
	Alloy.Globals.createController('sharedcalendar',$.schedule_tab);
}

function transformFunction(model) {
	var transform = model.toJSON();
	///Alloy.Globals.Log("transform is ::" +JSON.stringify(transform));
	transform.title = transform.col1+":"+transform.col2+":"+transform.col3+":"+transform.col4+":"+transform.col5+":"+transform.col6+":"+transform.col7+":"+transform.col8+":"+transform.col9+":"+transform.col10
	+":"+transform.col11+":"+transform.col12+":"+transform.col13+":"+transform.col14+":"+transform.col15+":"+transform.col16;
    //date conversion
    function addZero(i) {
	    if (i < 10) {
	        i = "0" + i;
	    }
	    return i;
	}
	function formatAMPM(date) {
	  var hours = date.getHours();
	  var minutes = date.getMinutes();
	  var ampm = hours >= 12 ? 'p' : 'a';
	  hours = hours % 12;
	  hours = hours ? hours : 12; // the hour '0' should be '12'
	  minutes = minutes < 10 ? '0'+minutes : minutes;
	  var strTime = hours + ':' + minutes + ampm;
	  return strTime;
	}
	var startdatetimeUTC = Date.parse(transform.col4);
	var startdatetimeLocale = new Date(startdatetimeUTC);
	var startdatetime = startdatetimeLocale.toString().replace(/GMT.*/," ");
	var enddatetimeUTC = Date.parse(transform.col5);
	var enddatetimeLocale = new Date(enddatetimeUTC);
	var enddatetime = enddatetimeLocale.toString().replace(/GMT.*/," ");
	var starttime = addZero(startdatetimeLocale.getHours()) + ":" + addZero(startdatetimeLocale.getMinutes());
    var endtime = addZero(enddatetimeLocale.getHours()) + ":" + addZero(enddatetimeLocale.getMinutes());
    var startday = startdatetime.split(' ')[0].trim();
    var endday = enddatetime.split(' ')[0];
    var startmonth = startdatetime.split(' ')[1];
    var endmonth = enddatetime.split(' ')[1];
    var startdaydate = startdatetime.split(' ')[2];
    var enddaydate = enddatetime.split(' ')[2];
    var startyear = startdatetime.split(' ')[3];
    var endyear = enddatetime.split(' ')[3];
    ///Alloy.Globals.Log("date and daytime :"+startday+' '+startmonth+' '+startdaydate+' '+startyear);
    var daymonthyear = startday+' '+startmonth+' '+startdaydate+' '+startyear;
    if (transform.col2) { var client = transform.col2; var newclient = client.replace(/.*https.*/g,'No client info');
    	///Alloy.Globals.Log("client newclient : " +client+' : '+newclient);
    };
    	
    ///Alloy.Globals.Log("col4: "+transform.col4+" Date: " +startdatetimeUTC+" : "+startdatetimeLocale); 
	//transform.custom = (transform.col1 == "none")?"Event title was not provided":transform.col1;
	transform.custom = (startdatetimeUTC)?formatAMPM(startdatetimeLocale)+' - '+formatAMPM(enddatetimeLocale):'00 - 00';
	transform.name = (transform.col2 == "none")?"":transform.col2;
	transform.item = (transform.col3 == "none" || transform.col3 == "None")?"":'Address: '+transform.col3;
	transform.start = (startdatetimeUTC)?'Start: '+startdatetime:'Start: Date&Time not provided';
	transform.end = (enddatetimeUTC)?'End: '+enddatetime:'End: Date&Time not provided';
	transform.email = (transform.col9 == "none")?"":'email : '+transform.col9;
	transform.client = (transform.col2 == "none")?"No client information":newclient;
	transform.address = (transform.col3 == "none" || transform.col3 == " " )?"":'Address : '+transform.col3;
	transform.daymonthyear = (startdatetimeUTC)?daymonthyear:' ';
	transform.startday = (startdatetimeUTC)?startday:' ';
	transform.startmonth = (startdatetimeUTC)?startmonth+' '+startdaydate:' ';
	transform.startyear = (startdatetimeUTC)?startyear:' ';
	transform.event = (transform.col1 == "none")?"Event title was not provided":transform.col1;
	transform.searchitems = transform.custom+":"+transform.name+":"+transform.col3+":"+transform.client+":"+transform.startyear+":"+transform.startmonth+":"+transform.startday+":"+transform.col1;
	//check status
	if (transform.col15 == "submitted"){
		transform.img ="proposalsubmitted.gif";
	} else {
		transform.img ="proposalpending.gif";
	}
	//match day
	///Alloy.Globals.Log("startday : "+startday);
	transform.imgday = startday+".png";
	
	return transform;
}

// 24hrs - 86400000
function filterFunction(collection) { 
		var sorttype = Titanium.App.Properties.getString('sorttype'); 
	    Alloy.Globals.Log("schedule::filterFunction:sorttype in filter : "+sorttype); 
	    //Alloy.Globals.Log("JSON stringify collection: " +JSON.stringify(collection));
	    if (sorttype == "Today")  {
	    	//Alloy.Collections.schedule.today();
	    	var filterday = new Date();
	    	var dateNow = Date.now();
	    	Alloy.Globals.Log("filterday: "+filterday+ ", dateNow: "+dateNow);
	    	return collection.where({col6:"confirmed"});
	    } else if (sorttype == "ThisWeek") {
	    	return collection.where({col6:"confirmed"});
	    } else if ( sorttype == "ThisMonth") {
	        return collection.where({col6:"confirmed"});
	    } else {
	    	return collection.where({col6:"confirmed"});
	    }
}

function buttonAction(e){
	Alloy.Globals.Log("schedule::buttonAction:JSON stringify e : " +JSON.stringify(e));
	Alloy.Globals.Log("schedule::buttonAction:JSON stringify e.source : " +JSON.stringify(e.source));
	var someDummy = Alloy.Models.dummy;
	someDummy.set('id', '1234');
    var today = new Date();
    var todayUTC = Date.now();
    var tomorrowUTC= todayUTC+86400000;
    var tomorrowLocale = new Date(tomorrowUTC);
    var tomorrowISO= tomorrowLocale.toISOString();
    var todayISO = today.toISOString();
    var yesterdayUTC = todayUTC-86400000;
    var yesterdayLocale = new Date(yesterdayUTC);
    var yesterdayISO= yesterdayLocale.toISOString();
    var lastweekUTC = todayUTC-(86400000*7);
    var lastweekLocale = new Date(lastweekUTC);
    var lastweekISO= lastweekLocale.toISOString();
    var nextweekUTC = todayUTC+(86400000*7);
    var nextweekLocale = new Date(nextweekUTC);
    var nextweekISO= nextweekLocale.toISOString();
    var nextmonthUTC = todayUTC+(86400000*31);
    var nextmonthLocale = new Date(nextmonthUTC);
    var nextmonthISO= nextmonthLocale.toISOString();
    Ti.API.info("today: " + today+" todayISO: "+todayISO);
    Ti.API.info("tomorrowLocale: " + tomorrowLocale+" tomorrowISO: "+tomorrowISO);
    Ti.API.info("yesterdayLocale: " + yesterdayLocale+" yesterdayISO: "+yesterdayISO);
	var thesort = e.source.title;
	if (thesort == "Day") { 
		var sorttype = "Today";
		//var HeaderTitle = 'Today: '+today.toString().split(' ',4).toString().replace(/,/g,' ');
		var HeaderTitle = 'Today: '+today.toString().substring(0,15);
		someDummy.set('HeaderTitle',HeaderTitle);
        var sql = "SELECT * FROM " + Alloy.Collections.schedule.config.adapter.collection_name +" WHERE col4 between "+'"'+yesterdayISO+'"'+" AND "+'"'+tomorrowISO+'"';
        Alloy.Globals.Log("sql string:" +sql);
		Alloy.Collections.schedule.fetch({query:sql});
		//Alloy.Collections.schedule.today();
	};
	if (thesort == "Week") { 
		var sorttype = "ThisWeek"; 
		var HeaderTitle = 'Week: '+today.toString().substring(0,11)+' - '+nextweekLocale.toString().substring(0,15);
		someDummy.set('HeaderTitle',HeaderTitle);
		var sql = "SELECT * FROM " + Alloy.Collections.schedule.config.adapter.collection_name +" WHERE col4 between "+'"'+yesterdayISO+'"'+" AND "+'"'+nextweekISO+'"';
        Alloy.Globals.Log("sql string:" +sql);
		Alloy.Collections.schedule.fetch({query:sql});	
		};
	if (thesort == "Month") { 
		var sorttype = "ThisMonth"; 
		var HeaderTitle = 'Month: '+today.toString().substring(0,11)+' - '+nextmonthLocale.toString().substring(0,15);
		someDummy.set('HeaderTitle',HeaderTitle);
		var sql = "SELECT * FROM " + Alloy.Collections.schedule.config.adapter.collection_name +" WHERE col4 between "+'"'+todayISO+'"'+" AND "+'"'+nextmonthISO+'"';
        Alloy.Globals.Log("sql string:" +sql);
		Alloy.Collections.schedule.fetch({query:sql});	
		};
	if (thesort == "All") { 
		someDummy.set('HeaderTitle','ALL Calendar Entries');
		Alloy.Collections.schedule.fetch(); 
		Alloy.Collections.schedule.sort();
		someDummy.fetch();
		};
	Ti.App.Properties.setString("sorttype",sorttype);
	//Alloy.Collections.schedule.fetch();
}

function refreshCalendar() {
	//var calid = 'idevice.net@gmail.com';
	//var calid = '2elugripfnsd2hblojnu4t72u0@group.calendar.google.com';
	var kraniemailid = Titanium.App.Properties.getString('kraniemailid');Alloy.Globals.Log("schedule.js::kraniemailid:: "+kraniemailid);
	var calid = kraniemailid;
	var url = 'https://www.googleapis.com/calendar/v3/calendars/'+calid+'/events'+"?access_token="+Alloy.Globals.googleAuthSheet.getAccessToken();;
	getSharedCalendarData(url);
}


var getSharedCalendarData = function(url) {	
	Ti.API.info("schedule::getSharedCalendarData:URL is: "+url);
	var thefile = "calendar.txt";
	var data = [];
	//Alloy.Globals.checkGoogleisAuthorized();
	//Alloy.Globals.checkNetworkAndGoogleAuthorized('1gnkP116nsTVxtrw6d_mXVdOiesQEPH7LVUIyHUfx9EE');
	//googleAuthCalendar;
	Alloy.Globals.Log('schedule::getSharedCalendarData:Access Token for Calendar is: ' + Alloy.Globals.googleAuthSheet.getAccessToken());
	Alloy.Globals.googleAuthSheet.isAuthorized(function() {
		Alloy.Globals.Log('schedule::getSharedCalendarData:Access Token: ' + Alloy.Globals.googleAuthSheet.getAccessToken());
		
		var xhr = Ti.Network.createHTTPClient({
		    onload: function(e) {
		    try {
				Alloy.Globals.Log("schedule::getSharedCalendarData:response txt is: "+this.responseText);
				var file = Ti.Filesystem.getFile(
					Ti.Filesystem.tempDirectory, thefile
				);
				if(file.exists() && file.writeable) {
				    var success = file.deleteFile();
				    Ti.API.info((success==true) ? file.write(this.responseText) : 'fail'); // outputs 'success'
					}	
				// Updating calendar DB
				var json = JSON.parse(this.responseText);
				//var json = this.responseText;
				Alloy.Collections.schedule.deleteAll();
				for (var i=0; i < +json.items.length; i++) {
					var dataModel = Alloy.createModel('schedule',{
						col1 :  json.items[i].summary || "none",
						col2 : json.items[i].description || "none",
						col3 : json.items[i].location || "none",
						col4 : json.items[i].start.dateTime || "none",
						col5 : json.items[i].end.dateTime || "none",
						col6 : json.items[i].status  || "none",
						col7 : json.items[i].status || "none",
						col8 : json.items[i].creator.displayName || "none",
						col9 : json.items[i].creator.email || "none",
						col10 :  json.items[i].creator.email || "none",
						col11 : json.items[i].creator.email || "none",
						col12 :  json.items[i].creator.email || "none",
						col13 :  json.items[i].creator.email || "none",
						col14 :  json.items[i].creator.email || "none",
						col15 :  json.items[i].creator.email || "none",
						col16 :  json.items[i].creator.email || "none",		
					});			
					dataModel.save();
				}							
				} catch(e){
					Ti.API.info("cathing e: "+JSON.stringify(e));
				}
			}
		});
		xhr.onerror = function(e){
			//alert(e);
			var kraniemailid = Titanium.App.Properties.getString('kraniemailid');
			var jsonlist = JSON.parse(this.responseText);
			alert("schedule:error:"+jsonlist.error.code+": Send email to "+kraniemailid+" asking shared calendar access permission");
			Alloy.Globals.Log("schedule::getSharedCalendarData:response txt after failure is: "+this.responseText);
		};
		xhr.open("GET", url);
		xhr.send();
		Ti.API.info(" schedule::getSharedCalendarData:Data were successfuly downloaded from "+url+". Please proceed.");
		
	}, function() {
		Alloy.Globals.Log('schedule::getSharedCalendarData:Sch get shrd cal Authorized first, see next window: ');
		Alloy.Globals.googleAuthSheet.authorize();
		///Alloy.Globals.LaunchWindowGoogleAuth();
	});
	var url = " ";
};

function selectItem(e) {
	Alloy.Globals.Log("schedule::selectItem:JSON stringify: "+JSON.stringify(e));
}

function doClick(e) {
	Alloy.Globals.Log("JSON stringify: "+JSON.stringify(e));
}

function myRefresher(e) {
	Alloy.Globals.Log("refreshing after pull : " +JSON.stringify(e));
    Alloy.Collections.schedule.fetch({
        success: e.hide,
        error: e.hide
    });
}

function postCreateEvent(calid,startdateTime,enddateTime,location,summary,description,organizerdisplayName,organizeremail,colorid,attendeeslist) {
	var attendeeslist = [];
	var startdateTime = startdateTime || "2015-03-05T15:30:00-06:00";
	var enddateTime = enddateTime || "2015-03-05T15:40:00-06:00";
	var location = location || Titanium.App.Properties.getString("coStreetAddress");
	var summary = summary || "summary";
	var description = description || "description";
	var organizerdisplayName = organizerdisplayName|| Titanium.App.Properties.getString("coName");
	var organizeremail = organizeremail || Titanium.App.Properties.getString("emailid");
	var colorid = colorid || "3";
	var organizerself ="true";
	//var url = 'https://www.googleapis.com/calendar/v3/calendars/idevice.net%40gmail.com/events?access_token='+googleAuthCalendar.getAccessToken();
	///var url = 'https://www.googleapis.com/calendar/v3/calendars/idevice.net@gmail.com/events';
	var emailid = Titanium.App.Properties.getString('emailid'); (emailid) && attendeeslist.push(emailid);
	var kraniemailid = Titanium.App.Properties.getString('kraniemailid');(kraniemailid) && attendeeslist.push(kraniemailid);
	Alloy.Globals.Log("schedule.js::postCreateEvent: emailid:  "+emailid+" : kraniemailid:: "+kraniemailid);
	var calid = kraniemailid;
	//var url = 'https://www.googleapis.com/calendar/v3/calendars/'+calid+'/events';
	var url = 'https://www.googleapis.com/calendar/v3/calendars/'+calid+'/events?sendNotifications=true';
	var recurrences ="";
	var attendeesstrbody = [];
	var attendeesstrstart = '\"attendees\": \[';
	var attendeesstrend = "\],";
	//var attendeeslist = ""; 
	//var attendeeslist = ["phakhruddin1@gmail.com","deen@idevice.net"];
	if (attendeeslist.length>0){
		for (i=0;i<attendeeslist.length;i++) {	
			var attendeesstr = '\{ \"email\": \"'+attendeeslist[i]
			+'\", \"responseStatus\" : \"needsAction\"\}';	
			attendeesstrbody.push(attendeesstr);
		}
		var eventattendees = attendeesstrstart+""+attendeesstrbody+""+attendeesstrend;
	} else {
		var eventattendees = "";
	}
	var event = '\{'
	+'\"start\": \{ \"dateTime\": \"'+startdateTime+'\"\},'
	+'\"location\": \"'+location+'\",'
	+'\"end\": \{\"dateTime\": \"'+enddateTime+'\"\},'
	+'\"summary\": \"'+summary+'\",'
	+'\"description\": \"'+description+'\",'
	+'\"colorid\": \"'+colorid+'\",'
	+eventattendees
	+'\"organizer\": \{'
	+	'\"email\": \"'+organizeremail+'\",'
	+	'\"displayName\": \"'+organizerdisplayName+'\",'
	+	'\"self\": \"'+organizerself+'\"'
	+	'\}'	
	+recurrences
	+'\}';
	Alloy.Globals.Log("event strings are: "+event);
	var xhr =  Titanium.Network.createHTTPClient({
    onload: function() {
    	try {
    		Ti.API.info(this.responseText); 
    	} catch(e){
    		Ti.API.info("cathing e: "+JSON.stringify(e));
    	}     
    },
    onerror: function(e) {
    	Ti.API.info("error e: "+JSON.stringify(e));
        alert("schedule::postCreateEvent::Unable to communicate to the cloud. Please try again"); 
    }
});
	xhr.open("POST", url);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.setRequestHeader("Authorization", 'Bearer '+Alloy.Globals.googleAuthSheet.getAccessToken());
	xhr.send(event);
	Ti.API.info('schedule.js::postCreateEvent: done POSTed , url:: '+url);
	refreshCalendar();
};
