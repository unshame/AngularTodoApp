function getStoredItem(key) {
	try {
		return JSON.parse(localStorage.getItem(key));
	} catch (e) {
		return null;
	}
}

function getStoredArrayItem(key, defaultArray){
	if(!defaultArray) defaultArray = [];
	var array = getStoredItem(key);
	if (!Array.isArray(array)) {
		return defaultArray;
	}
	else{
		return array;
	}
}

function setStoredItem(key, value) {
	localStorage.setItem(key, angular.toJson(value));
	//console.log(localStorage.getItem(key))
}
