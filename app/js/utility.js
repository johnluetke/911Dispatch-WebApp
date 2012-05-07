function areEqualArrays(array1, array2) {
	return array1.toString() == array2.toString();
}

function isEmpty(o) {
	for(var p in o) {
	if (o[p] != o.constructor.prototype[p])
		return false;
	}
	return true;
}

function isURL(string) {
	//var isURL = /^((ht|f)tps?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)$/i;
	var isURL = /^(https?:\/\/)?(www.)?[0-9a-z-\.]+\.(com|net|org|edu|co.uk|us)(\/.*)?$/i;

	return isURL.test(string);
}

function isArray(o) {
	return (o.constructor.toString().indexOf("Array") != -1)
}

function intersection(arr1, arr2) {
 	result = [];
	a = arr1.slice(0);
	b = arr2.slice(0);

	while( a.length > 0 && b.length > 0 ) {  
		if      (a[0] < b[0] ){ a.shift(); }
		else if (a[0] > b[0] ){ b.shift(); }
		else /* they're equal */ {
			result.push(a.shift());
			b.shift();
		}
	}
	return result;
}
