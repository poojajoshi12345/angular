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
	{
		var bundleInfo = bundles.shift();
		bundleInfo = (typeof(bundleInfo) == "string") ? {"src":bundleInfo, "loadContext":""} : bundleInfo;
		this.addBundle(bundleInfo.src, bundleInfo.loadContext).done(this.addBundles.bind(this, bundles, allLoaded));
	}
	else
		allLoaded.resolve();
	return allLoaded;
};

//can pass a string or jQuery.ajax settings object.
_p.addBundle = function(ajaxSettings, loadContext, data)
{
	//resolve bundle's uri
	ajaxSettings = (typeof(ajaxSettings) === "string") ? {url:ajaxSettings} : ajaxSettings;
	ajaxSettings.url = this.getResPath(ajaxSettings.url, loadContext);

	//is it already loaded?
	if(this.loadedBundles[ajaxSettings.url])
		return this.loadedBundles[ajaxSettings.url];

	//...no, so let's get loadin'!
	var resLoaded = $.Deferred();
	var xhr = $.get(ajaxSettings, data);
	xhr.resLoaded = resLoaded;
	xhr.src = ajaxSettings.url;
	xhr.done(this._onBundleFileLoaded.bind(this));
	xhr.fail(this._onBundleFileLoadError.bind(this));
	xhr.progress(this._onBundleFileProgress.bind(this));
	return resLoaded;
};
_p._onBundleFileLoaded = function(xDoc, status, xhr)
{
	//successfully loaded...move needed stuff to the xDoc for loading.
	xDoc.resLoaded = xhr.resLoaded;
	xDoc.src = xhr.src;
	xDoc.path = xDoc.src.substring(0, xDoc.src.lastIndexOf("/") + 1);
	this.loadBundle(xDoc);
};
_p._onBundleFileProgress = function()
{
};
_p._onBundleFileLoadError = function(xhr, status, msg)
{
	var e = ibx.loadEvent("rb_load_error", {"loadDepth":this._loadDepth, "resMgr":this, "bundle":null, "xhr":xhr, "status":status, "msg":msg});
	if(!e.defaultPrevented)
		console.error(status, msg, xhr.responseText);
};

//if something bad happens while retrieving a source file in the bundle.
_p._resFileRetrievalError = function(src, xhr, status, msg)
{
	var e = ibx.loadEvent("rb_file_load_error", {"loadDepth":this._loadDepth, "resMgr":this, "bundle":null, "src":src, "xhr":xhr, "status":status, "msg":msg});
	if(!e.defaultPrevented)
		console.error(status, msg, xhr.responseText);
};

_p.getResPath = function(src, loadContext)
{
	var loadContext = loadContext || this.getContextPath();
	if(loadContext == "bundle")
		loadContext = this._bundlePath;
	else
	if(loadContext == "app")
		loadContext = ibx.getAppPath();
	else
	if(loadContext == "ibx")
		loadContext = ibx.getPath();

	//give interested parties the ability to modify the resource uri
	var evt = document.createEvent("Event");
	evt.initEvent("ibx_res_mgr_resolve_uri", true, true);
	evt.ibxResData = {"resourceMgr":this, "uriIn":src, "uriOut":null, "loadCtx":loadContext};
	window.dispatchEvent(evt);
	var src = evt.ibxResData.uriOut || src;

	if(!(/^[/\\]/).test(src))
		src = loadContext + src;

	return src;
};

//load the actual resource bundle here...can be called directly, or from an xhr load (promise/deferred fullfilled/done)
_p._loadDepth = 0;
_p.loadBundle = function(xResDoc)
{
	//switch the path for loading dependent files using this bundles's path.
	this._bundlePath = xResDoc.path;

	var head = $("head");
	var rootBundle = this._resBundle.find("ibx-res-bundle");
	var bundle = $(xResDoc).find("ibx-res-bundle").first();
	
	//make sure we have a promise to resolve when loaded
	xResDoc.resLoaded = xResDoc.resLoaded || $.Deferred();

	//let the loading begin!
	ibx.loadEvent("rb_loading", {"loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0], src:xResDoc.path});

	//First load the dependency Resource Bundles...this will chain to any depth
	var files = [];
	bundle.find("ibx-res-bundle").each(function(idx, el)
	{
		el = $(el);
		files.push({"src":el.attr("src"), "loadContext":el.closest("[loadContext]").attr("loadContext")});
	});

	this._bundlePath = xResDoc.path;
	this.addBundles(files).done(function(curBundlePath, xResDoc, head, rootBundle, bundle)
	{
		++this._loadDepth;

		//now that dependent bundles are loaded, set back the correct path to this bundle.
		this._bundlePath = curBundlePath;

		//load all css files
		files = bundle.find("style-file");
		files.each(function(idx, elFile)
		{
			elFile = $(elFile);
			var src = this.getResPath(elFile.attr("src"), elFile.closest("[loadContext]").attr("loadContext"));
			if(!this.loadedFiles[src])
			{
				var link = $("<link rel='stylesheet' type='text/css'>");
				link.attr("href", src);
				head.append(link);
				this.loadedFiles[src] = true;
				ibx.loadEvent("rb_css_file_loaded", {"loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0], "src":src});
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
				ibx.loadEvent("rb_css_inline_loaded", {"loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
			}
		}.bind(this));

		//load all markup files
		files = bundle.find("markup-file");
		files.each(function(idx, elFile)
		{
			elFile = $(elFile);
			var src = this.getResPath(elFile.attr("src"), elFile.closest("[loadContext]").attr("loadContext"));
			if(!this.loadedFiles[src])
			{
				$.get({async:false, url:src, contentType:"text", error:this._resFileRetrievalError.bind(this, src)}).done(function(src, content, status, xhr)
				{
					rootBundle.children("markup").append($(content).find("markup-block"));
					this.loadedFiles[src] = true;
					ibx.loadEvent("rb_markup_file_loaded", {"loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0], "src":src});
				}.bind(this, src));
			}
		}.bind(this));

		//load all inline markup
		var markupBlocks = bundle.find("markup-block");
		markupBlocks.each(function(idx, markup)
		{
			rootBundle.children("markup").first().append($(markup).clone());
			ibx.loadEvent("rb_markup_inline_loaded", {"loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
		}.bind(this));

		//load all string and script files
		files = bundle.find("string-file, script-file");
		files.each(function(idx, elFile)
		{
			elFile = $(elFile);
			var src = this.getResPath(elFile.attr("src"), elFile.closest("[loadContext]").attr("loadContext"));
			var elFile = $(elFile);
			if(!this.loadedFiles[src])
			{
				if(elFile.attr("link") == "true")
				{
					$("<script type='text/javascript' src='" + src + "'>").appendTo("head");
					ibx.loadEvent("rb_script_file_loaded", {"loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0], "src":src});
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
							ibx.loadEvent("rb_string_file_loaded", {"loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0], "src":src});
						}
						else
						if((/\S/g).test(content))
						{
							window.ibxResourceMgr = this;//because the string bundle from server wants to add to 'window.ibxResourceMgr'
							var script = $("<script type='text/javascript' data-ibx-src='" + src + "'>");
							script.text(content);
							head.append(script);
							delete window.ibxResourceMgr;//clean up the temporary global
							ibx.loadEvent("rb_script_file_loaded", {"loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0], "src":src});
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
				ibx.loadEvent("rb_string_inline_loaded", {"loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
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
				ibx.loadEvent("rb_script_inline_loaded", {"loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
			}
		}.bind(this));

		//now load all forward reference Resource Bundles (packages) that this bundle wants to load.
		var files = [];
		bundle.find("ibx-package").each(function(idx, el){files.push($(el).attr("src"));});
		this.addBundles(files).done(function()
		{
			//save that this bundles has been loaded.
			if(xResDoc.src)
				this.loadedBundles[xResDoc.src] = xResDoc.resLoaded;
			
			--this._loadDepth;

			//give the main thread a chance to render what's been loaded before resolving the promise
			window.setTimeout(function(bundle)
			{
				ibx.loadEvent("rb_loaded", {"loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
				--this._loadDepth;
				xResDoc.resLoaded.resolve(bundle, this);
			}.bind(this, bundle), 0);
		}.bind(this, xResDoc, head, rootBundle, bundle));

	}.bind(this, this._bundlePath, xResDoc, head, rootBundle, bundle));
	return xResDoc.resLoaded;
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
