/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/

/******************************************************************************
	RESOURCE BUNDLE MANAGEMENT
******************************************************************************/
function ibxResourceManager(ctxPath)
{
	if(_jsDerivingClass)return;
	this._resBundle = $($.parseXML("<ibx-res-bundle><styles></styles><markup></markup></ibx-res-bundle>"));
	this._styleSheet = $("<style type='text/css'>").ibxAddClass("ibxResourceManager_inline_styles").appendTo("head");
	
	this.loadedBundles = {};
	this.loadedFiles = {};
	this.language = document.documentElement.getAttribute("lang") || "ibx_default";//if no lang attribute default to ibx_default bundle
	this.strings = {"ibx_default":{}};

	this.setContextPath(ctxPath || ibx.getPath());//default to the global ibx context path.
}
var _p = jsDeriveClass(ibxResourceManager, Object);

_p.loadedBundles = null;
_p.loadedFiles = null;

_p._styleSheet = null;
_p._resBundle = null;
_p.getResBundle = function(){return this._resBundle;};

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

_p.missingString = "";
_p.language = null;
_p.strings = null;
_p.getString = function(id, def, language)
{
	//get the string bundle...first language, if not...fallback to default
	language = language || this.language;
	var stringBundle = this.strings[language] || this.strings[language.substr(0, 2)] || this.strings["ibx_default"];

	//get the string...try the current language, then default...then not found.
	var strOut = stringBundle[id];
	strOut = (strOut === undefined) ? this.strings["ibx_default"][id] : strOut;
	if(strOut === undefined)
		console.warn("ibx string not found, id:", id);

	//return string, or one of the fallbacks.
	return strOut || def || this.missingString;
};
_p.addStringBundle = function(bundle, defLang)
{
	if(!bundle.language)
		bundle.language = "ibx_default";
	this.strings[bundle.language] = $.extend(this.strings[bundle.language], bundle.strings);
	if(defLang)
		this.language = bundle.language;
};

//daisy chain the loading of the bundles so their dependencies are honored.
_p.addBundles = function(bundles)
{
	if(!bundles._allLoaded)
		bundles._allLoaded = allLoaded || $.Deferred();

	var allLoaded = allLoaded || $.Deferred();
	if(bundles.length)
	{
		var bundleInfo = bundles.shift();
		if(bundleInfo instanceof XMLDocument)
			this.loadBundle(bundleInfo).done(this.addBundles.bind(this, bundles));
		else
		{
			bundleInfo = (typeof(bundleInfo) == "string") ? {"src":bundleInfo, "loadContext":""} : bundleInfo;
			this.addBundle(bundleInfo.src, bundleInfo.loadContext).done(function(bundles)
			{
				this.addBundles(bundles);
			}.bind(this, bundles));
		}
	}
	else
		bundles._allLoaded.resolve(this);
	return bundles._allLoaded;
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
	resLoaded.src = ajaxSettings.url;

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
	$(window).dispatchEvent("ibx_ibxresmgr", {"hint":"load_error", "loadDepth":this._loadDepth, "resMgr":this, "bundle":null, "xhr":xhr, "status":status, "msg":msg});
	console.error(sformat("[ibx Error] {1}\n{2}", xhr.statusText, msg));
};

_p.loadExternalResFile = function(elFile, bundle)
{
	elFile = $(elFile);
	elFile.each(function(bundle, idx, elFile)
	{
		elFile.ibxBundle = bundle[0];
		elFile = $(elFile);
		var src = this.getResPath(elFile.attr("src"), elFile.closest("[loadContext]").attr("loadContext"));

		if(this.loadedFiles[src])
		{
			//duplicate, just resolve and continue
			var dfd = elFile[0]._loadPromise;
			if(dfd)
				dfd.resolve();
			return;
		}

		var fileType = elFile.prop("tagName");
		var isInline = elFile.attr("inline") == "true";

		if(fileType == "style-file")
			elFile.attr("inline", "false");
		else
		if((fileType == "script-file") && ibx.forceLinkLoading)
			elFile.attr("inline" , "false");
		else
		if(fileType == "script-file")
			elFile.attr("inline", "true");
		else
		if(fileType == "string-file" || fileType == "markup-file")
			elFile.attr("inline", "true");

		if(ibx.forceInlineResLoading || (elFile.attr("inline") == "true"))
		{
			$(window).dispatchEvent("ibx_ibxresmgr", {"hint":"fileloading", "loadDepth":this._loadDepth, "resMgr":this, "fileType":fileType, "fileNode":elFile[0], "src":src});
			$.get({async:false, url:src, dataType:"text", error:this._resFileRetrievalError.bind(this, elFile, src, fileType)}).done(function(elFile, src, fileType, content, status, xhr)
			{
				content = this.preProcessResource(content);//precompile the content...string substitutions, etc.
				if(content)
				{
					if(fileType == "string-file")
					{
						content = content.replace(/^[^{][\s|\S][^{]*/, "");//strip off any possible header (copyright, etc.)
						content = JSON.parse(content);
						this.addStringBundle(content, elFile.attr("default") == "true");
						eType = "stringfileloaded";
					}
					else
					if(fileType == "markup-file")
					{
						this._resBundle.find("ibx-res-bundle > markup").append($(content).find("markup-block").attr("src", src));
						eType = "markupfileloaded";
					}
					else
					if(fileType == "style-file")
					{
						var tag = $("<style type='text/css'>").attr("data-ibx-src", src).text(content);
						$("head").append(tag);
						eType = "cssfileinlineloaded";
					}
					else
					if(fileType == "script-file")
					{
						if(ibx.forceInlineResLoading)
							$("head").append($("<script type='text/javascript'>").attr("data-ibx-src", src).text(content));
						else
							eval.call(window, content);
						elFile[0]._loadPromise.resolve();
						eType = "scriptfileinlineloaded";
					}
					this.loadedFiles[src] = true;
					$(window).dispatchEvent("ibx_ibxresmgr", {"hint":"fileloaded", "loadDepth":this._loadDepth, "resMgr":this, "fileType":fileType, "fileNode":elFile[0], "src":src});
				}
			}.bind(this, elFile, src, fileType));
		}
		else
		{
			var isStyle = (fileType == "style-file");
			if(isStyle)
			{
				var el = document.createElement("link");
				el.type = "text/css";
				el.rel = "stylesheet";
				el.href = src;
			}
			else
			{
				var el = document.createElement("script");
				el.type = elFile.attr("type") || "text/javascript";
				el.async = false;
				el.src = src;
				el._loadPromise = elFile[0]._loadPromise;
			}

			//need to resolve promise when file is actually loaded...also used for profile timings/counts.
			el.addEventListener("load", function(isStyle, e)
			{
				$(window).dispatchEvent("ibx_ibxresmgr", {"hint":"fileloaded", "loadDepth":this._loadDepth, "resMgr":this, "fileType":fileType, "fileNode":elFile[0], "src":src});
				if(e.target._loadPromise)
					e.target._loadPromise.resolve();
			}.bind(this, isStyle));


			$("head")[0].appendChild(el);
			this.loadedFiles[src] = true;
			$(window).dispatchEvent("ibx_ibxresmgr", {"hint":"fileloading", "loadDepth":this._loadDepth, "resMgr":this, "fileType":fileType, "fileNode":elFile[0], "src":src});
		}
	}.bind(this, bundle));
	return elFile;
};

//if something bad happens while retrieving a source file in the bundle.
_p._resFileRetrievalError = function(elFile, src, fileType, xhr, status, msg)
{
	$(window).dispatchEvent("ibx_ibxresmgr", {"hint":"fileloaderror", "loadDepth":this._loadDepth, "resMgr":this, "fileType":fileType, "fileNode":elFile[0], "bundle":null, "src":src, "xhr":xhr, "status":status, "msg":msg});
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

	//give interested parties the ability to modify the resource uri/loadContext info
	evt = $(window).dispatchEvent("ibx_ibxresmgr_resolveuri", {"resourceMgr":this, "uri":src, "loadCtx":loadContext}, true, false);
	src = evt.data.uri;
	loadContext = evt.data.loadCtx;

	//if the src is a root not a relative uri, then don't use the load context.
	if(!(/^[/\\]/).test(src))
		src = loadContext + src;
	return src;
};

//load the actual resource bundle here...can be called directly, or from an xhr load (promise/deferred fullfilled/done)
_p._loadDepth = 0;
_p.loadBundle = function(xResDoc)
{
	var head = $("head");
	var bundle = $(xResDoc).find("ibx-res-bundle").first();

	//switch the path for loading dependent files using this bundles's path.
	this._bundlePath = xResDoc.path;

	//make sure we have a promise to resolve when loaded
	xResDoc.resLoaded = xResDoc.resLoaded || $.Deferred();

	//let the loading begin!
	$(window).dispatchEvent("ibx_ibxresmgr", {"hint":"bundleloading", "loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0], src:xResDoc.src});

	//First load the dependency Resource Bundles...this will chain to any depth
	var files = [];
	bundle.find("ibx-res-bundle").each(function(idx, el)
	{
		el = $(el);
		files.push({"src":el.attr("src"), "loadContext":el.closest("[loadContext]").attr("loadContext")});
	});

	this._bundlePath = xResDoc.path;

	this.addBundles(files).done(function(curBundlePath, xResDoc, head, bundle)
	{
		++this._loadDepth;

		//now that dependent bundles are loaded, set back the correct path to this bundle.
		this._bundlePath = curBundlePath;

		//load strings
		this.loadExternalResFile(bundle.find("string-file"), bundle);
		var stringBundles = bundle.find("string-bundle");
		stringBundles.each(function(idx, stringBundle)
		{
			stringBundle = $(stringBundle);
			var content = stringBundle.text().trim();
			if(content)
			{
				content = this.preProcessResource(content);//precompile the content...string substitutions, etc.
				var strBundle = JSON.parse(content);
				this.addStringBundle(strBundle);
				$(window).dispatchEvent("ibx_ibxresmgr", {"hint":"stringinlineloaded", "loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
			}
		}.bind(this));

		//load css
		this.loadExternalResFile(bundle.find("style-file"), bundle);
		styleBlocks = bundle.find("style-sheet").each(function(idx, styleBlock)
		{
			styleBlock = $(styleBlock);
			var content = styleBlock.text().trim();
			if(content)
			{
				var src = styleBlock.attr("src") || "inline";
				content = this.preProcessResource(content);//precompile the content...string substitutions, etc.
				var styleNode = $("<style type='text/css'>").attr("data-ibx-src", src).text(content);
				head.append(styleNode);
				$(window).dispatchEvent("ibx_ibxresmgr", {"hint":"cssinlineloaded", "loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
				
				styleBlock = styleBlock.clone().text(content);
				this._resBundle.find("ibx-res-bundle > styles").first().append(styleBlock);//save sheet in res document
			}
		}.bind(this));

		//load markup
		this.loadExternalResFile(bundle.find("markup-file"), bundle);
		var markupBlocks = bundle.find("markup-block");
		markupBlocks.each(function(idx, markup)
		{
			this._resBundle.find("ibx-res-bundle > markup").first().append($(markup).clone());
			$(window).dispatchEvent("ibx_ibxresmgr", {"hint":"markupinlineloaded", "loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
		}.bind(this));

		//load scripts...they will be loaded asynchronously, but processed synchronously...so we have to make sure all
		//scripts are loaded before we continue with the blocks and subsequent resources.
		window.scriptPromises = [];
		var scripts = bundle.find("script-file").each(function(idx, el)
		{
			var dfd = new $.Deferred();
			el._loadPromise = dfd;
			scriptPromises.push(dfd);
		}.bind(this));
		this.loadExternalResFile(scripts, bundle);
		$.when.apply($, scriptPromises).then(function()
		{
			var scriptBlocks = bundle.find("script-block");
			scriptBlocks.each(function(idx, scriptBlock)
			{
				scriptBlock = $(scriptBlock);
				var content = scriptBlock.text().trim();
				if(content)
				{
					var src = scriptBlock.attr("src") || "inline";
					var script = $("<script type='text/javascript'>").attr("data-ibx-src", src);
					content = this.preProcessResource(content);//precompile the content...string substitutions, etc.
					script.text(content);
					head.append(script);
					$(window).dispatchEvent("ibx_ibxresmgr", {"hint":"scriptinlineloaded", "loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
				}
			}.bind(this));

			//now load all forward reference Resource Bundles (packages) that this bundle wants to load.
			var files = [];
			bundle.find("ibx-package").each(function(idx, el){el = $(el);files.push({"src":$(el).attr("src"), "loadContext":el.closest("[loadContext]").attr("loadContext")});});
			this.addBundles(files).done(function ibx_ibxresmgr_bundleFullyLoaded()
			{
				//save that this bundles has been loaded.
				if(xResDoc.src)
					this.loadedBundles[xResDoc.src] = xResDoc.resLoaded;
			
				document.body.offsetHeight;				
				--this._loadDepth;
				$(window).dispatchEvent("ibx_ibxresmgr", {"hint":"bundleloaded", "loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0], src:xResDoc.src});
				xResDoc.resLoaded.resolve(bundle, this);
			}.bind(this, xResDoc, head, bundle));

		}.bind(this, bundle));

	}.bind(this, this._bundlePath, xResDoc, head, bundle));
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
		markup = this.preProcessResource(markup);
	}.bind(this));
	if(!markup.length)
		throw(sformat("ibx.resourceMgr failed to load resource: {1}", selector));
	markup = $(markup);

	//replace the data-ibx-resource placeholders with the actual resources.
	this.processPlaceholders(markup.find("[data-ibx-resource]"));

	//will autobind if element is an ibx type thing, and user didn't explicitly say NO!
	ibxBind = ((markup.is("[data-ibx-type]") || markup.find("[data-ibx-type]").length) && (typeof(ibxBind) === "undefined")) ? true : ibxBind;
	if(ibxBind)
	{
		var bindingDiv =  $("<div class='ibx-resource-manager-binding-div' style='display:none'></div>").append(markup).appendTo("body");
		ibx.bindElements(markup);
		markup.detach();
		bindingDiv.detach();
	}
	return markup;
};

_p.getXmlResource = function(selector)
{
	var resource = this._resBundle.find(selector);
	if(!resource.length)
		throw(sformat("ibx.resourceMgr failed to find resource: {1}", selector));
	
	//get the xml out of the resource bundle as a string (essentially making a clone/copy)
	var markup = "";
	resource.each(function(idx, res)
	{
		markup += (new XMLSerializer()).serializeToString(res);
		markup = this.preProcessResource(markup);
	}.bind(this));

	markup = $.parseXML(markup);
	markup = $(markup);
	if(!markup.length)
		throw(sformat("ibx.resourceMgr failed to load resource: {1}", selector));
	return markup;
};

_p.processPlaceholders = function(resource)
{
	resource.each(function(idx, el)
	{
		el = $(el);
		var resId = el.attr("data-ibx-resource");
		var res = ibx.resourceMgr.getResource(resId, false, true).ibxAddClass(el.prop("className"));
		el.replaceWith(res);
	}.bind(this));
	return resource;
};

_p.preProcessResource = function(resource, language)
{
	language = language || this.language;
	
	var strInfo = [];
	var regEx = /@ibxString\w*\((.[^\)]*)\)/gi;
	while(match = regEx.exec(resource))
	{
		var symbol = unescapeXmlString(match[1]).replace(/ |\"|\'/g, "").split(",");//remove any existing quotes and split parms into array.
		symbol = sformat("\"{1}\"", symbol.join("\",\""));//recombine parms with quotes.
		var str = eval("(this.getString(" + symbol + "))");//get the string.
		if(match[0].search("@ibxStringXml") == 0)
			str = escapeXmlString(str);
		else
		if(match[0].search("@ibxStringJson") == 0)
		{
			//[IBX-46]Have to escape the quotes so when turned back into a string JSON will parse correctly.

			str = JSON.stringify(str).slice(1,-1); // escape string and then remove leading and trainling double quotes that stringify adds
			str = str.replace(/'/g, "\\'"); // escape single quotes as it's not done by stringify
			str = escapeXmlString(str);
		}
		strInfo.push({"match":match, "string":str});
	}

	$(strInfo).each(function(idx, info)
	{
		resource = resource.replace(info.match[0], info.string);
	}.bind(this));

	return resource;
};


/******************************************************************************
ibxResourceCompiler - used to package ibx application into single html file.
******************************************************************************/
function ibxResourceCompiler(ctxPath, config)
{
	ibxResourceManager.call(this);
	this._config = config;
	this._resBundle = $($.get({"url":this._contextPath + "./ibx_compiler_bundle.xml", "async":false, "dataType":"xml"}).responseXML);
	var bootRes = this._resBundle.find("ibx-boot-resources").detach();
	if(config.bootable)
	{
		bootRes.find("ibx-boot-files").children().each(function(idx, file)
		{
			var filePath = file.getAttribute("src");
			var xhr = $.get({"url":this._contextPath + file.getAttribute("src"), "async":false, "dataType":"text"});
			if(file.nodeName == "style-file")
			{
				var fileBlock = this._makeResBlock("style-sheet", filePath, xhr.responseText).attr("ibx-boot-file", true);
				this._resBundle.find("styles").append(fileBlock);
			}
			else
			if(file.nodeName == "script-file")
			{
				var isIbx = (filePath.search("/ibx.js") != -1);
				var content = xhr.responseText;
				if(isIbx)
					content += "\nibx._preCompiled = true;\n";
				fileBlock = this._makeResBlock("script-block", filePath, content).attr("ibx-boot-file", true);
				this._resBundle.find("scripts").append(fileBlock);
			}
		}.bind(this));

		this.loadBundle(($.get({"url":this._contextPath + "./ibx_resource_bundle.xml", "async":false, "dataType":"xml"}).responseXML));
	}
	this._resBundle[0].documentElement.setAttribute("ibx-bootable", config.bootable);
}
var _p = ibxResourceCompiler.prototype = new ibxResourceManager();

_p._makeResBlock = function(type, src, content)
{
	console.log("ADDING RESOURCE:", type, "BUNDLE:", this._bundlePath, "PATH: ", src);

	content = content.replace(/<!\[CDATA\[/g, "");
	content = content.replace(/]]>/g, "");

	var cdata = this._resBundle[0].createCDATASection(content);
	var block = sformat("<{1} src='{2}'></{1}>", type, src);
	block = $(block, this._resBundle);
	block.append(cdata);
	return block;
};

_p.getBundle = function()
{
	return this._resBundle[0];
};
_p.getBundleAsString = function()
{
	var bundle = this.getBundle();
	var serializer = new XMLSerializer();
	return serializer.serializeToString(bundle);
};

_p.linkBundle = function(outDoc)
{
	outDoc = $(outDoc);

	var bootFiles = this._resBundle.find("[data-boot-file]").detach();
	var bootScript = $(sformat("<script type='text/javascript'>")).text(bootFiles.not("style-sheet").text());
	var bootStyle = $(sformat("<style type='text/css'>")).text(bootFiles.not("script-block").text());
	var bundle = sformat("<sc" + "ript class='ibx-precompiled-res-bundle' type='text/xml'>{1}</sc" +"ript>", this.getBundleAsString());
	var head = outDoc.find("head");
	var firstStyle = outDoc.find("style");
	var firstScript = outDoc.find("script");
	
	if(firstStyle.length)
		firstStyle.before(bootStyle);
	else
		head.append(bootStyle);

	if(firstScript.length)
	{
		firstScript.before(bundle);
		if(this._config.bootable)
			firstScript.before(bootScript);
	}
	else
	{
		head.append(bundle);
		if(this._config.bootable)
			head.append(bootScript);
	}
	var body = outDoc.find("body");
	return outDoc[0];
};

_p.addStringBundle = function(strBundle)
{
	var section = this._resBundle.find("strings");
	var strings = this._makeResBlock("string-bundle", "inline", JSON.stringify(strBundle));
	section.append(strings);
}

_p.loadExternalResFile = function(elFile)
{
	$(elFile).each(function(idx, file)
	{
		var file = $(file);
		var type = file.prop("nodeName");
		var src = this.getResPath(file.attr("src"), file.closest("[loadContext]").attr("loadContext"));
		var xhr = $.get({"url": src, "async":false, "dataType":"text"});
		var content = xhr.responseText;
		var noCompile = (file.attr("nocompile") == "true");

		//do not compile into internal resource bundle.
		if(type == "string-file")
		{	
			var block = noCompile ? this._resBundle[0].importNode(file[0]) : this._makeResBlock("string-bundle", src, content);
			this._resBundle.find("strings").append(block);
		}
		else
		if(type == "style-file")
		{
			var block = noCompile ? this._resBundle[0].importNode(file[0]) : this._makeResBlock("style-sheet", src, content);
			this._resBundle.find("styles").append(block);
		}
		else
		if(type == "markup-file")
		{
			var block = noCompile ? this._resBundle[0].importNode(file[0]) : this._makeResBlock("markup-block", src, content);
			this._resBundle.find("markup").append(block);
		}
		else
		if(type == "script-file")
		{
			var block = noCompile ? this._resBundle[0].importNode(file[0]) : this._makeResBlock("script-block", src, content);
			this._resBundle.find("scripts").append(block);
		}

		//resolve the promise for this file.
		if(file[0]._loadPromise)
			file[0]._loadPromise.resolve();			

	}.bind(this));
}
//# sourceURL=resources.ibx.js
