$(document).ready(function(){
	//parse line with template: element_id#cfa#element_value1;element_value2|display_value
	function parseValue(v){
		if (!v.match(/\w+#cfa#([\S ]+|[\S ]+;[\S ]+)\|[\S ]+/g))
			return null;
		var obj = { originValue: v };
		var preParse = v.split('|');
		obj.displayValue = preParse[1];
		var leftParse = preParse[0].split('#cfa#');
		obj.focusId = leftParse[0];
		obj.filterValues = leftParse[1].split(';');
		return obj;
	}
	
	//generate parse data to list objects from list options
	function generate(opts_arr){
		if (Array.isArray(opts_arr)){
			var arr = [];
			for(var i in opts_arr){
				var parseObj = parseValue(opts_arr[i].innerText);
				parseObj.curElement = opts_arr[i];
				parseObj.value = opts_arr[i].value;
				opts_arr[i].innerText = parseObj.displayValue;
				arr.push(parseObj);
			}
			return arr;
		}
		return null;
	}
	
	function clearSelect(s) {
		while(s.select.childNodes.length)
		{
			s.select.removeChild(s.select.childNodes[0]);
		}
	}
	
	function _indexOf(arr, callback) {
		for(var i = 0; i < arr.length; i++){
			if (callback(arr[i]))
				return i;
		}
		return 0;
	}
	
	//fill select with default option
	function fillSelect (s, filterVal){
		var defaultOption = document.createElement('option');
		defaultOption.appendChild(document.createTextNode('\u00A0'));
		defaultOption.innerText = ' ';
		s.select.appendChild(defaultOption);
		s.options.forEach(function (x) {
			if (x.filterValues.filter(i => i == filterVal).length){
				var opt = document.createElement('option');
				opt.value = x.value;
				opt.innerText = x.displayValue;
				s.select.appendChild(opt);
			}
		});
	}
	
	var options = $('option:contains(#cfa#)').toArray();
	var genOptions = generate(options);
	var focusIds = [];
	var selects = genOptions.reduce(function (p, c) {
		p[c.curElement.parentElement.id] = p[c.curElement.parentElement.id] || {
			select: c.curElement.parentElement,
			options: []
		};
		p[c.curElement.parentElement.id].options.push(c);
		p[c.curElement.parentElement.id].focusId = c.focusId;
		if (focusIds.filter(x => x == c.focusId).length == 0) {
			focusIds.push(c.focusId);
		}
		return p;
	}, {});
	
	for (var i in focusIds){
		var elmt = $('#' + focusIds[i])[0];
		elmt.addEventListener('change', function(e) {
			for (var s in selects){
				if (selects[s].focusId == e.srcElement.id){
					clearSelect(selects[s]);
					fillSelect(selects[s], elmt.value);
				}
			}
		});
		for (var s in selects){
			if (selects[s].focusId == elmt.id){
				var v = selects[s].select.selectedOptions[0].value;
				clearSelect(selects[s]);
				fillSelect(selects[s], elmt.value);
				selects[s].select.selectedIndex =  v != '' ? _indexOf(selects[s].select.options, x => x.value == v) : 0;
			}
		}
	}
	$(':contains(#cfa#)[class=value]').toArray().forEach(function (x) {x.innerText = parseValue(x.innerText).displayValue});
});