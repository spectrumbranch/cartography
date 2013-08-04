function node_filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

function normalizePath(path) {
	var isAbsolute = path.charAt(0) === '/',
		trailingSlash = path.slice(-1) === '/';

	// Normalize the path
	path = normalizeArray(node_filter(path.split('/'), function(p) {
		return !!p;
	  }), !isAbsolute).join('/');

	  if (!path && !isAbsolute) {
		path = '.';
	  }
	  if (path && trailingSlash) {
		path += '/';
	  }
	  
	  return (isAbsolute ? '/' : '') + path;
};

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }
  
  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}