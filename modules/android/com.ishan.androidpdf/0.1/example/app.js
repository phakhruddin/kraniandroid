// open a single window
var win = Ti.UI.createWindow({
	backgroundColor : 'white'
});

var androidpdf = require('com.ishan.androidpdf');
Ti.API.info("module is => " + androidpdf);

//To open a pdf the file should be present inside your application directory folder, like com.xyz.abcApp folder.
//Now call the openPdf method.

/*
 * This method accepts a dictionary with a key-value pair.
 * fileName is the name of the file minus the .pdf extension.
 */
androidpdf.openPDF({
	'fileName' : 'Name of the file without .pdf extension.'
})
win.open();
