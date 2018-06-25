/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	RESOURCE BUNDLE MANAGEMENT
******************************************************************************/
function ibxResourceManager(ctxPath)
{
	this._resBundle = $($.parseXML("<ibx-res-bundle><markup></markup></ibx-res-bundle>"));
	this._styleSheet = $("<style type='text/css'>").prop("id", "ibxResourceManager_inline_styles").appendTo("head");
	
	this.loadedBundles = {};
	this.loadedFiles = {};
	this.language = document.documentElement.getAttribute("lang") || "ibx_default";//if no lang attribute default to ibx_default bundle
	this.strings = {"ibx_default":{}};

	this.setContextPath(ctxPath || ibx.getPath());//default to the global ibx context path.
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

_p.missingString = "";
_p.language = null;
_p.strings = null;
_p.getString = function(id, def, language)
{
	//make sure language is loaded...or, cascade back to ibx_default
	language = language || this.language;
	if(!this.strings[language])
	{
		language = language.substr(0, 2);
		if(!this.strings[language])
			language = "ibx_default";
	}

	//string not found...bad!
	if(!this.strings[language][id] === undefined)
		console.warn("ibx string not found, id:", id);

	//return string, or one of the fallbacks.
	return this.strings[language][id] || def || this.missingString;
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
	$(window).dispatchEvent("ibx_resmgr", {"hint":"load_error", "loadDepth":this._loadDepth, "resMgr":this, "bundle":null, "xhr":xhr, "status":status, "msg":msg});
	console.error(sformat("[ibx Error] {1}", msg));
};

_p.loadExternalResFile = function(elFile)
{
	elFile = $(elFile);
	elFile.each(function(idx, elFile)
	{
		elFile = $(elFile);
		var src = this.getResPath(elFile.attr("src"), elFile.closest("[loadContext]").attr("loadContext"));
		if(!this.loadedFiles[src])
		{
			var fileType = elFile.prop("tagName");
			if(fileType == "style-file")
				var x = 10;
			var asInline = (elFile.attr("inline") == "true") || (fileType == "script-file" && (elFile.attr("inline") !== "false")) || (fileType == "string-file") || (fileType == "markup-file");
			if(ibx.forceInlineResLoading || asInline)
			{
				$.get({async:false, url:src, dataType:"text", error:this._resFileRetrievalError.bind(this, src)}).done(function(elFIle, src, fileType, content, status, xhr)
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
							eType = "scriptfileinlineloaded";
						}
						this.loadedFiles[src] = true;
						$(window).dispatchEvent("ibx_resmgr", {"hint":eType, "loadDepth":this._loadDepth, "resMgr":this, "fileNode":elFile[0], "src":src});
					}
				}.bind(this, elFile, src, fileType));
			}
			else
			{
				var isStyle = (fileType == "style-file");
				var tag = $(isStyle ? "<link rel='stylesheet' type='text/css'>" : "<script type='text/javascript'>").attr(isStyle ? "href" : "src", src);
				$("head").append(tag);
				this.loadedFiles[src] = true;
				$(window).dispatchEvent("ibx_resmgr", {"hint":isStyle ? "cssfileloaded" : "scriptfileloaded", "loadDepth":this._loadDepth, "resMgr":this, "fileNode":elFile[0], "src":src});
			}
		}
	}.bind(this));
	return elFile;
};

//if something bad happens while retrieving a source file in the bundle.
_p._resFileRetrievalError = function(src, xhr, status, msg)
{
	$(window).dispatchEvent("ibx_resmgr", {"hint":"fileloaderror", "loadDepth":this._loadDepth, "resMgr":this, "bundle":null, "src":src, "xhr":xhr, "status":status, "msg":msg});
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
	evt = $(window).dispatchEvent("ibx_resmgr_resolveuri", {"resourceMgr":this, "uri":src, "loadCtx":loadContext}, true, false);
	var src = evt.data.uri;
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
	$(window).dispatchEvent("ibx_resmgr", {"hint":"bundleloading", "loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0], src:xResDoc.path});

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
		this.loadExternalResFile(bundle.find("string-file"));
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
				$(window).dispatchEvent("ibx_resmgr", {"hint":"stringinlineloaded", "loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
			}
		}.bind(this));

		//load css
		this.loadExternalResFile(bundle.find("style-file"));
		styleBlocks = bundle.find("style-sheet").each(function(idx, styleBlock)
		{
			styleBlock = $(styleBlock);
			var content = styleBlock.text().trim();
			if(content)
			{
				content = this.preProcessResource(content);//precompile the content...string substitutions, etc.
				var styleNode = $("<style type='text/css'>").text(content);
				head.append(styleNode);
				$(window).dispatchEvent("ibx_resmgr", {"hint":"cssinlineloaded", "loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
			}
		}.bind(this));

		//load markup
		this.loadExternalResFile(bundle.find("markup-file"));
		var markupBlocks = bundle.find("markup-block");
		markupBlocks.each(function(idx, markup)
		{
			this._resBundle.find("ibx-res-bundle > markup").first().append($(markup).clone());
			$(window).dispatchEvent("ibx_resmgr", {"hint":"markupinlineloaded", "loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
		}.bind(this));

		//load scripts
		this.loadExternalResFile(bundle.find("script-file"));
		var scriptBlocks = bundle.find("script-block");
		scriptBlocks.each(function(idx, scriptBlock)
		{
			scriptBlock = $(scriptBlock);
			var content = scriptBlock.text().trim();
			if(content)
			{
				var script = $("<script type='text/javascript'>");
				content = this.preProcessResource(content);//precompile the content...string substitutions, etc.
				script.text(content);
				head.append(script);
				$(window).dispatchEvent("ibx_resmgr", {"hint":"scriptinlineloaded", "loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
			}
		}.bind(this));

		//now load all forward reference Resource Bundles (packages) that this bundle wants to load.
		var files = [];
		bundle.find("ibx-package").each(function(idx, el){el = $(el);files.push({"src":$(el).attr("src"), "loadContext":el.closest("[loadContext]").attr("loadContext")});});
		this.addBundles(files).done(function()
		{
			//save that this bundles has been loaded.
			if(xResDoc.src)
				this.loadedBundles[xResDoc.src] = xResDoc.resLoaded;
			
			--this._loadDepth;

			//give the main thread a chance to render what's been loaded before resolving the promise
			window.setTimeout(function(bundle)
			{
				$(window).dispatchEvent("ibx_resmgr", {"hint":"bundleloaded", "loadDepth":this._loadDepth, "resMgr":this, "bundle":bundle[0]});
				--this._loadDepth;
				xResDoc.resLoaded.resolve(bundle, this);
			}.bind(this, bundle), 0);
		}.bind(this, xResDoc, head, bundle));

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

_p.processPlaceholders = function(resource)
{
	resource.each(function(idx, el)
	{
		el = $(el);
		var resId = el.attr("data-ibx-resource");
		var res = ibx.resourceMgr.getResource(resId, false, true).addClass(el.prop("className"));
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



function ibxResourceCompiler(ctxPath, bootable)
{
	ibxResourceManager.call(this);
	this._resBundle = $($.get({"url":this._contextPath + "./ibx_compiler_bundle.xml", "async":false, "dataType":"xml"}).responseXML);
	this._bootable = bootable
	var bootRes = this._resBundle.find("ibx-boot-resources").detach();
	this._initScripts = bootable ? bootRes.children("ibx-init-scripts") : $();
	this._bootScripts = bootable ? bootRes.children("ibx-boot-scripts") : $();
	this._bootFiles = bootable ? bootRes.children("ibx-boot-files") : $();
	if(bootable)
	{
		var strBootFiles = "";
		this._bootFiles.children().each(function(idx, file)
		{
			var xhr = $.get({"url":this._contextPath + file.getAttribute("src"), "async":false, "dataType":"text"});
			if(file.nodeName == "style-file")
				strBootFiles += sformat("<style data-ibx-src='{1}' type='text/css'>{2}</style>\n", file.getAttribute("src"), xhr.responseText);
			else
			if(file.nodeName == "script-file")
			{
				block = sformat("<sc" + "ript data-ibx-src='{1}' type='text/javascript'>\nSCRIPT_CONTENT_HERE\n</sc" + "ript>\n", file.getAttribute("src"), xhr.responseText);
				block = block.replace("SCRIPT_CONTENT_HERE", xhr.responseText);
				strBootFiles += block + "\n";
			}
		}.bind(this));

		var cdata = $("<![CDATA[]]>", this._resBundle);
		cdata[0].textContent = strBootFiles;
		this._bootFiles.empty().append(cdata);
		var coreBundle = $($.get({"url":this._contextPath + "./ibx_resource_bundle.xml", "async":false, "dataType":"xml"}).responseXML);
		this.compileBundle(coreBundle);
	}
}
var _p = ibxResourceCompiler.prototype = new ibxResourceManager();

_p._bootable = false;
_p.bootable = function(){return this._bootable;};

_p._makeResBlock = function(type, src, content)
{
	return $(sformat("<{1} src='{2}'><![CDATA[{3}\]\]\></{1}>", type, src, content), this._resBundle);
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
	var bundle = sformat("<sc" + "ript class='ibx-res-bundle' type='text/xml'>{1}</sc" +"ript>", this.getBundleAsString());
	var head = outDoc.find("head");
	var scripts = outDoc.find("scripts");
	if(scripts.length)
	{
		scripts.first().before(bundle);
		if(this._bootable)
			this._bootFiles.insertAfter(scripts.last());
	}
	else
	{
		head.append(bundle);
		if(this._bootable)
			head.append(this._bootFiles.text(), this._bootScripts.text());
	}
	var body = outDoc.find("body");

	if(this._bootable)
		body.after(this._initScripts.text());
	return outDoc[0];
};

_p.compileBundles = function(bundles)
{
	$(bundles).each(function(idx, bundle)
	{
		this.compileBundle(bundle);
	}.bind(this));
	return this;
};

_p.compileBundle = function(bundle)
{
	this.loadBundle(bundle);
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
		var type = file.nodeName;
		var xhr = $.get({"url":this._contextPath + file.getAttribute("src"), "async":false, "dataType":"text"});
		var content = xhr.responseText;

		if(type == "string-file")
		{	
			var block = this._makeResBlock("string-bundle", file.getAttribute("src"), content);
			this._resBundle.find("strings").append(block);
		}
		else
		if(type == "style-file")
		{
			var block = this._makeResBlock("style-sheet", file.getAttribute("src"), content);
			this._resBundle.find("styles").append(block);
		}
		else
		if(type == "markup-file")
		{
			var block = this._makeResBlock("markup-block", file.getAttribute("src"), content);
			this._resBundle.find("markup").append(block);
		}
		else
		if(type == "script-file")
		{
			var block = this._makeResBlock("script-block", file.getAttribute("src"), content);
			this._resBundle.find("scripts").append(block);
		}
	}.bind(this));
}

//# sourceURL=resources.ibx.js
