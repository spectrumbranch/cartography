if (typeof (Cartography) === "undefined") {
	throw new Error("Cartography core is required");
}

Cartography.createArray = function(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = Cartography.createArray.apply(this, args);
    }

    return arr;
}