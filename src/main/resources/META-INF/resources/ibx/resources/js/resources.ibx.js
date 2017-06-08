/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	RESOURCE BUNDLE MANAGEMENT
******************************************************************************/
function ibxResourceManager()
{
	this._rootBundle = $($.parseXML("<ibx-root-res-bundle><markup></markup></ibx-root-res-bundle>"));
	this._bindingDiv = $("<div class='ibx-resource-manager-binding-div' style='display:none'></div>");
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

//daisy chain the loading of the bundles so their dependencies are honored.
_p.addBundles = function(bundles, allLoaded)
{
	var allLoaded = allLoaded || $.Deferred();
	if(bundles.length)
		this.addBundle(bundles.shift()).done(this.addBundles.bind(this, bundles, allLoaded));
	else
		allLoaded.resolve();
	return allLoaded;
};

_p.addBundle = function(info, data)
{
	//resolve bundle's uri
	info = (typeof(info) === "string") ? {url:info} : info;
	info.url = this.getResPath(info.url);

	//is it already loaded?
	if(ibxResourceManager.loadedBundles[info.url])
		return ibxResourceManager.loadedBundles[info.url];

	//...no, so let's get loadin'!
	var resLoaded = $.Deferred();
	var xhr = $.get(info, data);
	xhr._resLoaded = resLoaded;
	xhr._src = info.url;
	xhr.done(this._onBundleFileLoaded.bind(this));
	xhr.fail(this._onBundleFileLoadError.bind(this));
	xhr.progress(this._onBundleFileProgress.bind(this));
	return resLoaded;
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

_p.getResPath = function(src)
{
	//give interested parties the ability to modify the resource uri
	var evt = document.createEvent("Event");
	evt.initEvent("ibx_res_mgr_resolve_uri", true, true);
	evt.ibxResData = {ibxResourceMgr:this, uriIn:src, uriOut:null};
	window.dispatchEvent(evt);

	var src = evt.ibxResData.uriOut || evt.ibxResData.uriIn;
	if(!(/^[/\\]/).test(src))
		src = ibxResourceMgr.getContextPath() + src;

	return src;
};

//load the actual resource bundle here...can be called directly, or from an xhr load (promise/deferred fullfilled/done)
_p.loadBundle = function(xDoc, xhr)
{
	var bundleLoaded = (xhr && xhr._resLoaded) ? xhr._resLoaded : $.Deferred();
	var xDoc = $(xDoc);
	var head = $("head");
	var rootBundle = this._rootBundle.find("ibx-root-res-bundle");
	var bundles = xDoc.find("ibx-res-bundle");
	for(var i = 0; i < bundles.length; ++i)
	{
		//First load the dependency Resource Bundles...this will chain to any depth
		var files = $(bundles.get(i)).find("res-bundle");
		files.each(function(idx, file)
		{
			var src = this.getResPath( $(file).attr("src"));
			ibxResourceMgr.addBundle({url:src, async:false});
		}.bind(this));

		//save bundle reference here, as doing before the recursion above will cause closure issues.
		var bundle = $(bundles.get(i));
		var name = name || bundle.attr("name");
		bundle.attr("name", name);

		ibx.loadEvent("rb_loading", name, bundle[0]);

		//load all css files
		files = bundle.find("style-file");
		files.each(function(idx, file)
		{
			var src = this.getResPath( $(file).attr("src"));
			if(!ibxResourceManager.loadedFiles[src])
			{
				var link = $("<link rel='stylesheet' type='text/css'>");
				link.attr("href", src);
				head.append(link);
				ibxResourceManager.loadedFiles[src] = true;
				ibx.loadEvent("rb_css", src, link, name, bundle[0]);
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
				ibx.loadEvent("rb_css", name, bundle[0]);
			}
		});

		//load all markup files
		files = bundle.find("markup-file");
		files.each(function(idx, file)
		{
			var src = this.getResPath( $(file).attr("src"));
			if(!ibxResourceManager.loadedFiles[src])
			{
				$.get({async:false, url:src, contentType:"text"}).done(function(src, content, status, xhr)
				{
					rootBundle.children("markup").append($(content).find("markup-block"));
					ibxResourceManager.loadedFiles[src] = true;
					ibx.loadEvent("rb_markup", name, bundle[0], src);
				}.bind(this, src));
			}
		}.bind(this));

		//load all inline markup
		var markupBlocks = bundle.find("markup-block");
		markupBlocks.each(function(idx, markup)
		{
			rootBundle.children("markup").append($(markup).clone());
			ibx.loadEvent("rb_markup", name, bundle[0]);
		}.bind(this));

		//load all string and script files
		files = bundle.find("string-file, script-file");
		files.each(function(idx, file)
		{
			var file = $(file);
			var src = this.getResPath( $(file).attr("src"));
			if(!ibxResourceManager.loadedFiles[src])
			{
				if(file.attr("link") == "true")
				{
					$("<script type='text/javascript' src='" + src + "'>").appendTo("head");
					ibx.loadEvent("rb_script", name, bundle[0], src);
				}
				else
				{
					$.get({async:false, url:src, dataType:"text"}).done(function(src, content, status, xhr)
					{
						if((/\S/g).test(content))
						{
							var script = $("<script type='text/javascript' data-ibx-src='" + src + "'>");
							script.text(content);
							head.append(script);
							ibx.loadEvent("rb_script", name, bundle[0], src);
						}
						ibxResourceManager.loadedFiles[src] = true;
					}.bind(this, src));
				}
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
				ibx.loadEvent("rb_string", name, bundle[0]);
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
				ibx.loadEvent("rb_script", name, bundle[0]);
			}
		}.bind(this));

		//now load all forward reference Resource Bundles (packages) that this bundle wants to load.
		var files = $(bundles.get(i)).find("package");
		files.each(function(idx, file)
		{
			file = $(file);
			var src = ibxResourceMgr.getContextPath() + file.attr("src");
			ibxResourceMgr.addBundle({url:src, async:false});
		});

		//save that this bundles has been loaded.
		if(xhr._src)
			ibxResourceManager.loadedBundles[xhr._src] = bundleLoaded;
	}

	//give the main thread a chance to render what's been loaded before resolving the promise
	window.setTimeout(function()
	{
		bundleLoaded.resolve(bundles, this);
	}, 0);

	ibx.loadEvent("res_bundle_loaded", name, bundle[0]);
	return bundleLoaded;
};

_p.getResource = function(selector, ibxBind, forceCreate)
{
	//first, has the resource been loaded...and do we want it, or create a new instance
	forceCreate = (forceCreate === undefined) ? true : forceCreate;
	var resource = $(selector);
	if(forceCreate || !resource.length)
		resource = this._rootBundle.find(selector);

	if(!resource.length)
		throw(sformat("ibxResourceMgr failed to find resource: {1}", selector));

	//get the xml out of the resource bundle as a string (essentially making a clone/copy)
	var markup = "";
	resource.each(function(idx, res)
	{
		markup += (new XMLSerializer()).serializeToString(res);
	}.bind(this));
	if(!markup.length)
		throw(sformat("ibxResourceMgr failed to load resource: {1}", selector));
	markup = $(markup);

	//will autobind if element is an ibx type thing, and user didn't explicitly say NO!
	ibxBind = ((markup.is("[data-ibx-type]") || markup.find("[data-ibx-type]").length) && (typeof(ibxBind) === "undefined")) ? true : ibxBind;
	if(ibxBind)
	{
		this._bindingDiv.empty().append(markup).appendTo("body");
		ibx.bindElements(markup);
		markup.detach();
		this._bindingDiv.detach();
	}

	return markup;
};

window["ibxResourceMgr"] = new ibxResourceManager();

//# sourceURL=resources.ibx.js
