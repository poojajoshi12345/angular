	".woff":"font/woff",
	".woff2":"font/woff2",
	".ttf":"font/truetype"

$._ajax = $.ajax;
$.ajax = function()
{
	var arg1 = arguments[0];
	var arg2 = arguments[1];
	var url = null;
	var options = null;

	if(typeof(arg1) === "string")
	{
		url = arg1;
		options = arg2;
	}
	else
	if(typeof(arg1) === "object")
	{
		options = arg1;
		url = options.url;
	}

	var uri = parseUri(url);
	if(uri.protocol == "BSS" || uri.protocol == "BLS")
	{
		var storage = uri.protocol == "BSS" ? window.sessionStorage : window.localStorage;
		var name = uri.queryKey.name;
		var content = uri.queryKey.content;
		return content ? storage.setItem(name, content) : storage.getItem(name);
	}
	else
		return $._ajax.apply($, arguments);
};

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
// http://blog.stevenlevithan.com/archives/parseuri
function parseUri (str) {
	var o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};
parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};
	ibx(function()
