/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	RESOURCE BUNDLE MANAGEMENT
******************************************************************************/
function ibxResourceManager()
{
	this._tmpId = ibxResourceManager._id++;
	this._rootBundle = $($.parseXML("<ibx-root-res-bundle>\n</ibx-root-res-bundle>"));
	this._styleSheet = $("<style type='text/css'>").prop("id", "ibxResourceManager_"+this._tmpId).appendTo("head");
	this.language = "en";
	this.strings = {"en":{}}
}
var _p = ibxResourceManager.prototype = new Object();

ibxResourceManager._id = 0;//id used for temporary variable name.
_p._rootBundle = null;
_p._styleSheet = null;

_p._contextPath = "";
_p.setContextPath = function(ctxPath){this._contextPath = ctxPath;};
_p.getContextPath = function(){return this._contextPath;};

_p.destroyed = false;
_p.destroy = function()
{
	this._styleSheet.remove();
	delete this._styleSheet;
	delete this._rootBundle;
	delete this._strings;
	this.destroyed = true;
};

_p.language = null;
_p.strings = null;
_p.getString = function(id, language)
{
	language = language || this.language || "en";
	return this.strings[language][id];
};
_p.addStringBundle = function(bundle)
{
	this.strings[bundle.language] = $.extend(this.strings[bundle.language], bundle.strings);
};

_p.addBundle = function(url, data)
{
	var resLoaded = $.Deferred(function(dfd)
	{
		var xhr = $.get(url, data);
		xhr._deferred = dfd;
		xhr._src = url;
		xhr.done(this._onBundleLoaded.bind(this))
		xhr.fail(this._onBundleLoadError.bind(this))
		xhr.progress(this._onBundleProgress.bind(this));
	}.bind(this));
	return $.when(resLoaded);
}
_p._onBundleLoaded = function(xDoc, status, xhr)
{
	xDoc._xhr = xhr;
	this.loadBundle(xDoc, xhr);
};
_p._onBundleLoadError = function(xhr, status, msg)
{
	console.error("ibxResourceManager Bundle Load Error", arguments);
};
_p._onBundleProgress = function()
{
	console.log("Progress", arguments);
};

//load the actual resource bundle here...can be called directly, or from an xhr load.
_p.loadBundle = function(xDoc, xhr)
{
	var name = xhr._name;
	var xDoc = $(xDoc);
	var bundles = xDoc.find("ibx-res-bundle");
	for(var i = 0; i < bundles.length; ++i)
	{
		bundle = $(bundles.get(i));
		var name = name || bundle.attr("name");
		bundle.attr("name", name);

		var dfd = $.Deferred();
		var files = bundle.find("script-file");
		files.each(function(idx, file)
		{
			var file = $(file);
			var src = this.getContextPath() + file.attr("src");
			$.get({async:false, url:src, dataType:"text"}).done(function(content, status, xhr)
			{
				var script = $("<script type='text/javascript'>");
				script.text(content);
				$("head").append(script);
			});
		}.bind(this));

		files = bundle.find("style-file");
		files.each(function(idx, file)
		{
			var link = $("<link rel='stylesheet' type='text/css'>");
			var src = this.getContextPath() + $(file).attr("src");
			link.attr("href", src);
			$("head").append(link);
		}.bind(this));
	};
	this._rootBundle.find("ibx-root-res-bundle").append(bundles);
	xhr._deferred.resolve();
};

_p.getResource = function(selector, ibxBind)
{
	var markup = (new XMLSerializer()).serializeToString(this._rootBundle.find(selector || "").get(0))
	if(!markup)
	{
		console.error("Failed to load resource from ibxResourceBundle");
		debugger;
	}

	markup = $(markup);
	if(ibxBind)
		$.ibi.ibxWidget.bindElements(markup);
	return markup;
};

window["ibxResourceMgr"] = new ibxResourceManager();

//# sourceURL=resources.ibx.js
