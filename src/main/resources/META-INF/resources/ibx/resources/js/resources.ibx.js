/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	RESOURCE BUNDLE MANAGEMENT
******************************************************************************/
function ibxResourceManager()
{
	this._resBundle = $($.parseXML("<ibx-res-bundle><markup></markup></ibx-res-bundle>"));
	this._bindingDiv = $("<div class='ibx-resource-manager-binding-div' style='display:none'></div>");
	this._styleSheet = $("<style type='text/css'>").prop("id", "ibxResourceManager_inline_styles").appendTo("head");
	
	this.loadedBundles = {};
	this.loadedFiles = {};
	this.language = "en";
	this.strings = {"en":{}};

	this.setContextPath(ibx.getPath());//default to the global ibx context path.
}
var _p = ibxResourceManager.prototype = new Object();

_p.loadedBundles = null;
_p.loadedFiles = null;

_p._resBundle = null;
_p._styleSheet = null;

_p._contextPath = "";
_p.setContextPath = function(ctxPath){this._contextPath = ctxPath;};
_p.getContextPath = function(){return this._contextPath;};

_p.destroyed = false;
_p.destroy = function()
{
	this._styleSheet.remove();
	delete this._styleSheet;
	delete this._resBundle;
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
	if(this.loadedBundles[info.url])
		return this.loadedBundles[info.url];

	//...no, so let's get loadin'!
	var resLoaded = $.Deferred();
	var xhr = $.get(info, data);
	xhr._resLoaded = resLoaded;
	xhr.src = info.url;
	xhr.done(this._onBundleFileLoaded.bind(this));
	xhr.fail(this._onBundleFileLoadError.bind(this));
	xhr.progress(this._onBundleFileProgress.bind(this));
	return resLoaded;
};
_p._onBundleFileLoaded = function(xDoc, status, xhr)
{
	xDoc.path = xhr.src.substring(0, xhr.src.lastIndexOf("/") + 1);
	this.loadBundle(xDoc, xhr);
};
_p._onBundleFileProgress = function()
{
};
_p._onBundleFileLoadError = function(xhr, status, msg)
{
	var e = ibx.loadEvent("rb_load_error", {"resMgr":this, "bundle":null, "xhr":xhr, "status":status, "msg":msg});
	if(!e.defaultPrevented)
		console.error(status, msg, xhr.responseText);
};

//if something bad happens while retrieving a source file in the bundle.
_p._resFileRetrievalError = function(src, xhr, status, msg)
{
	var e = ibx.loadEvent("rb_file_load_error", {"resMgr":this, "bundle":null, "src":src, "xhr":xhr, "status":status, "msg":msg});
	if(!e.defaultPrevented)
		console.error(status, msg, xhr.responseText);
};

_p.getResPath = function(src)
{
	var ctxPath = this.getContextPath();
	if(src instanceof Element)
	{
		var el = $(src);
		src = el.attr("src");
		var loadContext = el.closest("[loadContext]").attr("loadContext");
		if(loadContext == "bundle")
			ctxPath = el.prop("ownerDocument").path;
		else
		if(loadContext == "app")
			ctxPath = ibx.getAppPath();
		else
		if(loadContext == "ibx")
			ctxPath = ibx.getPath();
	}

	//give interested parties the ability to modify the resource uri
	var evt = document.createEvent("Event");
	evt.initEvent("ibx_res_mgr_resolve_uri", true, true);
	evt.ibxResData = {resourceMgr:this, uriIn:src, uriOut:null};
	window.dispatchEvent(evt);

	var src = evt.ibxResData.uriOut || evt.ibxResData.uriIn;
	if(!(/^[/\\]/).test(src))
		src = ctxPath + src;

	return src;
};

//load the actual resource bundle here...can be called directly, or from an xhr load (promise/deferred fullfilled/done)
_p.loadBundle = function(xDoc, xhr)
{
	var bundleLoaded = (xhr && xhr._resLoaded) ? xhr._resLoaded : $.Deferred();
	var xDoc = $(xDoc);
	var head = $("head");
	var rootBundle = this._resBundle.find("ibx-res-bundle");
	var bundle = xDoc.find("ibx-res-bundle").first();

	//let the loading begin!
	ibx.loadEvent("rb_loading", {"resMgr":this, "bundle":bundle[0]});

	//First load the dependency Resource Bundles...this will chain to any depth
	var files = [];
	bundle.find("res-bundle").each(function(idx, el){files.push($(el).attr("src"));});
	this.addBundles(files).done(function(xDoc, head, rootBundle, bundle, bundleLoaded)
	{
		//load all css files
		files = bundle.find("style-file");
		files.each(function(idx, elFile)
		{
			var src = this.getResPath(elFile);
			if(!this.loadedFiles[src])
			{
				var link = $("<link rel='stylesheet' type='text/css'>");
				link.attr("href", src);
				head.append(link);
				this.loadedFiles[src] = true;
				ibx.loadEvent("rb_css_file_loaded", {"resMgr":this, "bundle":bundle[0], "src":src});
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
				ibx.loadEvent("rb_css_inline_loaded", {"resMgr":this, "bundle":bundle[0]});
			}
		});

		//load all markup files
		files = bundle.find("markup-file");
		files.each(function(idx, elFile)
		{
			var src = this.getResPath(elFile);
			if(!this.loadedFiles[src])
			{
				$.get({async:false, url:src, contentType:"text", error:this._resFileRetrievalError.bind(this, src)}).done(function(src, content, status, xhr)
				{
					rootBundle.children("markup").append($(content).find("markup-block"));
					this.loadedFiles[src] = true;
					ibx.loadEvent("rb_markup_file_loaded", {"resMgr":this, "bundle":bundle[0], "src":src});
				}.bind(this, src));
			}
		}.bind(this));

		//load all inline markup
		var markupBlocks = bundle.find("markup-block");
		markupBlocks.each(function(idx, markup)
		{
			rootBundle.children("markup").first().append($(markup).clone());
			ibx.loadEvent("rb_markup_inline_loaded", {"resMgr":this, "bundle":bundle[0]});
		}.bind(this));

		//load all string and script files
		files = bundle.find("string-file, script-file");
		files.each(function(idx, elFile)
		{
			var src = this.getResPath(elFile);
			var elFile = $(elFile);
			if(!this.loadedFiles[src])
			{
				if(elFile.attr("link") == "true")
				{
					$("<script type='text/javascript' src='" + src + "'>").appendTo("head");
					ibx.loadEvent("rb_script_file_loaded", {"resMgr":this, "bundle":bundle[0], "src":src});
				}
				else
				{
					var isIbxStringFile = (elFile.prop("tagName") == "string-file");
					$.get({async:false, url:src, dataType:"text", error:this._resFileRetrievalError.bind(this, src)}).done(function(src, isIbxStringFile, content, status, xhr)
					{
						if(isIbxStringFile)
						{
							content = eval("(" + content + ")");//JSON.parse(content);
							this.addStringBundle(content);
							ibx.loadEvent("rb_string_file_loaded", {"resMgr":this, "bundle":bundle[0], "src":src});
						}
						else
						if((/\S/g).test(content))
						{
							window.ibxResourceMgr = this;//because the string bundle from server wants to add to 'window.ibxResourceMgr'
							var script = $("<script type='text/javascript' data-ibx-src='" + src + "'>");
							script.text(content);
							head.append(script);
							delete window.ibxResourceMgr;//clean up the temporary global
							ibx.loadEvent("rb_script_file_loaded", {"resMgr":this, "bundle":bundle[0], "src":src});
						}
						this.loadedFiles[src] = true;
					}.bind(this, src, isIbxStringFile));
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
				this.addStringBundle(strBundle);
				ibx.loadEvent("rb_string_inline_loaded", {"resMgr":this, "bundle":bundle[0]});
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
				ibx.loadEvent("rb_script_inline_loaded", {"resMgr":this, "bundle":bundle[0]});
			}
		}.bind(this));

		//now load all forward reference Resource Bundles (packages) that this bundle wants to load.
		var files = [];
		bundle.find("res-bundle").each(function(idx, el){files.push($(el).attr("src"));});
		this.addBundles(files).done(function()
		{
			//save that this bundles has been loaded.
			if(xhr.src)
				this.loadedBundles[xhr.src] = bundleLoaded;

			//give the main thread a chance to render what's been loaded before resolving the promise
			window.setTimeout(function(bundle)
			{
				ibx.loadEvent("rb_loaded", {"resMgr":this, "bundle":bundle[0]});
				bundleLoaded.resolve(bundle, this);
			}.bind(this, bundle), 0);
		}.bind(this, xDoc, head, rootBundle, bundle, bundleLoaded));

	}.bind(this, xDoc, head, rootBundle, bundle, bundleLoaded));
	return bundleLoaded;
};

_p.getResource = function(selector, ibxBind, forceCreate)
{
	//first, has the resource been loaded...and do we want it, or create a new instance
	forceCreate = (forceCreate === undefined) ? true : forceCreate;
	var resource = $(selector);
	if(forceCreate || !resource.length)
		resource = this._resBundle.find(selector);

	if(!resource.length)
		throw(sformat("ibx.resourceMgr failed to find resource: {1}", selector));

	//get the xml out of the resource bundle as a string (essentially making a clone/copy)
	var markup = "";
	resource.each(function(idx, res)
	{
		markup += (new XMLSerializer()).serializeToString(res);
	}.bind(this));
	if(!markup.length)
		throw(sformat("ibx.resourceMgr failed to load resource: {1}", selector));
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

//window["ibx.resourceMgr"] = new ibxResourceManager();

//# sourceURL=resources.ibx.js
