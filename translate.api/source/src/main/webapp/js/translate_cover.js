translate.requests = new Array();
translate.request.send = function(url, data, func, method, isAsynchronize, headers, abnormalFunc){
	translate.requests.push({
		url:url,
		data:data
	});
}