/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	RESOURCE BUNDLE MANAGEMENT
******************************************************************************/
function ibxResourceManager()
{
	this._rootBundle = $($.parseXML("<ibx-root-res-bundle><markup></markup></ibx-root-res-bundle>"));
	this._styleSheet = $("<style type='text/css'>").prop("id", "ibxResourceManager_"+this._tmpId).appendTo("head");
	this.language = "en";
	this.strings = {"en":{}};
}
var _p = ibxResourceManager.prototype = new Object();

ibxResourceManager.loadedBundles = {};
ibxResourceManager.loadedFiles = {};

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
	if(ibxResourceManager.loadedBundles[url])
		return ibxResourceManager.loadedBundles[url];

	var resLoaded = $.Deferred();
	var xhr = $.get(url, data);
	xhr._resLoaded = resLoaded;
	xhr._src = url;
	xhr.done(this._onBundleFileLoaded.bind(this));
	xhr.fail(this._onBundleFileLoadError.bind(this));
	xhr.progress(this._onBundleFileProgress.bind(this));
	return resLoaded;//$.when(resLoaded, xhr);
};
_p._onBundleFileLoaded = function(xDoc, status, xhr)
{
	xDoc._xhr = xhr;
	this.loadBundle(xDoc, xhr);
};
_p._onBundleFileLoadError = function(xhr, status, msg)
{
	console.error("ibxResourceManager Bundle Load Error", xhr);
};
_p._onBundleFileProgress = function()
{
};

//load the actual resource bundle here...can be called directly, or from an xhr load.
_p.loadBundle = function(xDoc, xhr)
{
	var bundleLoaded = (xhr && xhr._resLoaded) ? xhr._resLoaded : $.Deferred();
	var xDoc = $(xDoc);
	var head = $("head");
	var rootBundle = this._rootBundle.find("ibx-root-res-bundle");
	var bundles = xDoc.find("ibx-res-bundle");
	for(var i = 0; i < bundles.length; ++i)
	{
		bundle = $(bundles.get(i));
		var name = name || bundle.attr("name");
		bundle.attr("name", name);

		//load all css files
		var files = bundle.find("style-file");
		files.each(function(idx, file)
		{
			var src = this.getContextPath() + $(file).attr("src");
			if(!ibxResourceManager.loadedFiles[src])
			{
				var link = $("<link rel='stylesheet' type='text/css'>");
				link.attr("href", src);
				head.append(link);
				ibxResourceManager.loadedFiles[src] = true;
			}
		}.bind(this));

		//load inline css styles
		styleBlocks = bundle.find("style-sheet").each(function(idx, styleBlock)
		{
			styleBlock = $(styleBlock);
			var content = styleBlock.text();
			if((/\S/g).test(content))
			{
				var styleNode = $("<style type='text/css'>").text(content);
				head.append(styleNode);
			}
		});

		//load all markup files
		files = bundle.find("markup-file");
		files.each(function(idx, file)
		{
			var src = this.getContextPath() + $(file).attr("src");
			if(!ibxResourceManager.loadedFiles[src])
			{
				$.get({async:false, url:src, contentType:"text"}).done(function(content, status, xhr)
				{
					rootBundle.children("markup").append($(content).find("markup-block"));
					ibxResourceManager.loadedFiles[src] = true;
				});
			}
		}.bind(this));

		//load all inline markup
		var markupBlocks = bundle.find("markup-block");
		markupBlocks.each(function(idx, markup)
		{
			rootBundle.children("markup").append($(markup).clone());
		}.bind(this));

		//load all string and script files
		files = bundle.find("string-file, script-file");
		files.each(function(idx, file)
		{
			var src = this.getContextPath() + $(file).attr("src");
			if(!ibxResourceManager.loadedFiles[src])
			{
				$.get({async:false, url:src, dataType:"text"}).done(function(content, status, xhr)
				{
					if((/\S/g).test(content))
					{
						var script = $("<script type='text/javascript'>");
						script.text(content);
						head.append(script);
					}
					ibxResourceManager.loadedFiles[src] = true;
				});
			}
		}.bind(this));

		//load all inline string bundles
		var stringBundles = bundle.find("string-bundle");
		stringBundles.each(function(idx, stringBundle)
		{
			stringBundle = $(stringBundle);
			var content = stringBundle.text();
			if((/\S/g).test(content))
			{
				var strBundle = JSON.parse(content);
				ibxResourceMgr.addStringBundle(strBundle);
			}
		}.bind(this));

		//load all inline scripts
		var scriptBlocks = bundle.find("script-block");
		scriptBlocks.each(function(idx, scriptBlock)
		{
			scriptBlock = $(scriptBlock);
			var content = scriptBlock.text();
			if((/\S/g).test(content))
			{
				var script = $("<script type='text/javascript'>");
				script.text(content);
				head.append(script);
			}
		}.bind(this));
		ibxResourceManager.loadedBundles[name || xhr._src || "anonymous"] = bundleLoaded;
	}

	//give the main thread a chance to render what's been loaded before resolving the promise
	window.setTimeout(function()
	{
		bundleLoaded.resolve(bundle, this);
	}, 0);
	return bundleLoaded;
};

_p.getResource = function(selector, ibxBind)
{
	var resource = this._rootBundle.find(selector).get(0);
	if(!resource)
		throw(sformat("ibxResourceMgr failed to find resrouce: {1}", selector));

	//get the xml out of the resource bundle as a string (essentially making a clone/copy)
	var markup = (new XMLSerializer()).serializeToString(resource);
	if(!markup)
		throw(sformat("ibxResourceMgr failed to load resource: {1}", selector));
	markup = $(markup);

	//will autobind if element is an ibx type thing, and user didn't explicitly say NO!
	ibxBind = (markup.attr("data-ibx-type") && (typeof(ibxBind) === "undefined")) ? true : ibxBind;
	if(ibxBind)
		$.ibi.ibxWidget.bindElements(markup);

	return markup;
};

window["ibxResourceMgr"] = new ibxResourceManager();

//# sourceURL=resources.ibx.js
