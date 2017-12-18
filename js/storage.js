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
	if(Array.isArray(value)){
		value = value.slice();
		value.forEach(function(item){
			if(item.$$hashKey){
				item.$$hashKey = undefined;
			}
		})
	}
	localStorage.setItem(key, JSON.stringify(value));
	//console.log(localStorage.getItem(key))
}
