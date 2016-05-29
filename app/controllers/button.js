var args = arguments[0] || {};
var label = args.label || '';
function doTouchstart(e) {
	e.source.backgroundColor = '#a00';
	/*function filterFunction(collection) {
	return collection.where({type:"sorttype"});
	}*/
}
function doTouchend(e) {
	e.source.backgroundColor = '#333';
}
if (args.label) { $.label.text = args.label; }