/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:


/****
	ibx can be called with the following parameters and signatures...
	
	parms:
		function:	to call upon load
		array:		resource packages to load after ibx boots
		bool:		when loaded autobind all markup

	signatures (overloads):
		ibx(function, array, bool)
		ibx(function, array)
		ibx(function, bool)
		ibx(array, bool)
		ibx(array)
		ibx(bool)
}
****/
function ibx()
{
	var fn = null;
	var resPackages = [];
	var autoBind = false;
	var args = arguments;
	var a1 = args[0];
	var a2 = args[1];
	var a3 = args[2];

	if(typeof(a1) === "function")
		fn = a1;
	else
	if(a1 instanceof Array)
		resPackages == a1;
	else
	if(typeof(a1) === "boolean")
		autoBind = a1;

	if(a2 instanceof Array)
		resPackages = a2;
	else
	if(typeof(a2) === "boolean")
		autoBind = a2;

	if(typeof(a3) === "boolean")
		autoBind = a3;

	//resolve various ibx context values based on where we're loading from, and what we're loaded with.
	if(!ibx._appInfoResolved)
	{
		var ibxScript = document.querySelector("script[src*='ibx.js']");
		var ibxPath = ibxScript ? ibxScript.getAttribute("src").replace("ibx.js", "") : "";
		ibx.setPath(ibxPath);
		ibx.setAppPath(window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1));
		ibx._appName = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
		
		//save the parameters, if any, passed on the url
		ibx._appParms = {};
		if(document.location.search)
		{
			var parms = document.location.search.replace(/^\?/, "").split("&");
			for(var i = 0; i < parms.length; ++i)
			{
				parm = parms[i].split("=");
				try {   /* We are not able to decode non UTF8 data by decodeURIComponent(). */
						/* As you know, javascript only has decode routine for Latin-1 and UTF8. */
						/* If value encoded is not one of them, we only have a way that set original data. */
					ibx._appParms[decodeURIComponent(parm[0])] = decodeURIComponent(parm[1]);
				} catch (e) {
					ibx._appParms[parm[0]] = parm[1];
				}
			}
			ibx.forceInlineResLoading = (ibx._appParms.forceInlineResLoading !== undefined) ? (ibx._appParms.forceInlineResLoading == "true") : ibx.forceInlineResLoading;
			ibx.forceLinkLoading = (ibx._appParms.forceLinkLoading !== undefined) ? (ibx._appParms.forceLinkLoading == "true") : ibx.forceLinkLoading;
		}
		ibx._appInfoResolved = true;
	}

	if(!ibx._loaded && !ibx._isLoading)
	{
		if(!ibx._preCompiled)
		{
			//things to preload for ibx.  Everything else is in the root resource bundle
			var scripts = 
			[
				"<link type='text/css' rel='stylesheet' href='" + ibx._path + "./css/base.ibx.css'/>",
				"<sc" + "ript type='text/javascript' src='" + ibx._path + "./etc/jquery/jquery-3.3.1.js'></sc" + "ript>",
				"<sc" + "ript type='text/javascript' src='" + ibx._path + "./etc/jquery/jquery-ui-1.12.1/jquery-ui.js'></sc" + "ript>",
				"<sc" + "ript type='text/javascript' src='" + ibx._path + "./js/util.ibx.js'></sc" + "ript>",
				"<sc" + "ript type='text/javascript' src='" + ibx._path + "./js/preload.ibx.js'></sc" + "ript>",
				"<sc" + "ript type='text/javascript' src='" + ibx._path + "./js/resources.ibx.js'></sc" + "ript>"
			];

			//[IBX-122] don't load jQuery/jQueryUI if already loaded
			if(window.jQuery)
				scripts[1] = "";
			if(window.jQuery && window.jQuery.ui)
				scripts[2] = "";

			document.open();
			document.write(scripts.join(""));
			document.close();
		}

		//wait for jQuery/jQueryUI to be loaded...then boot ibx
		var dateStart = ibx._loadStart = new Date();
		ibx._loadTimer = window.setInterval(function ibx_loadTimer()
		{
			if((new Date()) - dateStart > ibx.loadTimeout)
			{
				window.clearInterval(ibx._loadTimer);
				throw("Error loading pre ibx resources: " + scripts);
			}
			if(window.jQuery && window.jQuery.widget && window.ibxResourceManager)
			{
				if(ibx.profiling)
					ibx.loadProfile = new ibxProfiler(true, {"ibxLoadStart":dateStart});

				/*
					Install custom jQuery.Deferred exception handler so we can see the actual non standard exceptions
					Note: calling 'ibx.deferredExceptionHook(false)' to revert to default jQuery handling
				*/
				ibx._savedDeferredExceptionHook = $.Deferred.exceptionHook;
				ibx.deferredExceptionHook(true);

				//jQuery/jQueryUI is in scope...stop polling...
				window.clearInterval(ibx._loadTimer);

				//wait for jQuery to be fully loaded...
				$(function jQuery_main()
				{
					//we want to precompile this application, not run it.
					if(ibx._appParms.compile == "true")
					{
						var xhr = $.ajax({"url": window.location.pathname, "dataType":"text", "async":false});
						var parser = new DOMParser();
						var inDoc = parser.parseFromString(xhr.responseText, "text/html");

						//remove the "ibx.js" script if it exists...will mess up the final compiled app.
						$(inDoc.querySelector("script[src*='/ibx.js']")).remove();

						//create the resource compiler, and pass a copy of the packages to compile, so the app loads noramlly after compilation.
						var compiler = new ibxResourceCompiler(ibx.getPath(), true);
						var compPackages = resPackages.slice();
						compPackages.COMPILERBUNDLE = true;
						compiler.addBundles(compPackages).done(function()
						{
							var outDoc = compiler.linkBundle(inDoc);
							compiler.destroy();
							console.log(outDoc.documentElement.outerHTML);
							this.compiledApp = outDoc;
						}.bind(this));
					}

					//jquery is fully loaded and running
					$(window).dispatchEvent("ibx_ibxevent", {"hint":"jqueryloaded", "ibx":ibx});

					//continue booting ibx...
					ibx._loadPromise = $.Deferred();
					ibx._loadPromise._autoBind = autoBind;
					ibx._loadPromise._resPackages =  resPackages;

					//make the master/default resource manager for ibx.
					ibx.resourceMgr = new ibxResourceManager();

					var inlineStyles = $("head > style");//save the pre-ibx styles so they can be moved to the end after load.
					var packages = ibx._loadPromise._resPackages;
					packages.unshift("./ibx_resource_bundle.xml");

					//all resources for app are in an internal resource bundle compiled previously...so just load from that.
					if(ibx._preCompiled)
					{
						var bundle = $(".ibx-precompiled-res-bundle").remove();//remove bundle from DOM...no longer needed, saves memory.
						var strBundle = bundle.text();
						var parser = new DOMParser();
						var bundle = parser.parseFromString(strBundle, "application/xml");
						packages = [bundle];
					}

					$(window).dispatchEvent("ibx_ibxevent", {"hint":"resourcesloadstart", "ibx":ibx});
					ibx.resourceMgr.addBundles(packages).done(function ibx_addBundlesDone()
					{
						//ibx is fully loaded and running.
						$(window).dispatchEvent("ibx_ibxevent", {"hint":"resourcesloadend", "ibx":ibx});

						//bool means just bind everything...string means select these and bind them
						var autoBind = ibx._loadPromise._autoBind;
						if(autoBind)
						{
							$(window).dispatchEvent("ibx_ibxevent", {"hint":"pagebindingstart", "ibx":ibx});
							ibx.bindElements((typeof(autoBind) === "string") ? autoBind : "");
							$(window).dispatchEvent("ibx_ibxevent", {"hint":"pagebindingend", "ibx":ibx});
						}

						$("head").append(inlineStyles);//move any non-ibx styles to the end so they will override ibx styles.
						
						ibx._loaded = true;
						ibx._isLoading = !ibx._loaded;
						ibx._loadPromise.then(function ibx_loadPromiseDone()
						{
							ibx._setAccessibility(ibx.isAccessible);//turn on/off default accessibility

							var ibxRoots = $(".ibx-root").addClass("ibx-loaded");//display all ibx-roots, now that we are loaded.
							if(ibx.showOnLoad)
								ibx.showRootNodes(true);
									
							$(window).dispatchEvent("ibx_ibxevent", {"hint":"loadend", "ibx":ibx});
							
							if(ibx.loadProfile)
							{
								var stats = ibx.loadProfile.stop();
								console.log("loadProfile", stats);
							}
						});
						ibx._loadPromise.then(fn);
						ibx._loadPromise.resolve(ibx);//let everyone know the system is booted.
					});
				});
			}
		}, 0);
	}
	else
	if(typeof(fn) === "function")
	{
		if(!ibx._loaded)
			throw("ibx subsystem is not loaded!");
		ibx._loadPromise.done(fn);
	}
	return ibx;
}

//various static resources.
ibx.version = "0.9";		//ibx version...just a placeholder for now.
ibx.loadTimeout = 10000;	//can't get preloads in running state by this interval, then bail!
ibx._loaded = false;		//is ibx loaded.
ibx._loadPromise = null;	//internal promise/deferred for ibx resource loading
ibx.profiling = false;		//profile ibx load cycle
ibx.loadProfile = null;		//profile for load cycle
ibx.resourceMgr = null;		//ibx default resource manager	
ibx.forceLinkLoading = true;//[IBX-152] will force asynchronous loading of javascript via script tags.
ibx.forceInlineResLoading = false;//[ACT-1571]Needed a way to package ibx into single file...this forces all script/css to be inline.
ibx.preCompiled = false;

//where ibx.js loaded from
ibx._path = "";
ibx.getPath = function(){return ibx._path;};
ibx.setPath = function(path){ibx._path = path;};

//the window's location when the ibx script tag was loaded.
ibx._appPath = "";
ibx.getAppPath = function(){return ibx._appPath;};
ibx.setAppPath = function(path){ibx._appPath = path;};

//the endpoint of the windows location when ibx script tag was loaded....and any parms passed via url
ibx._appName = "";
ibx.getAppName = function(){return ibx._appName;};
ibx._appParms;
ibx.getAppParms = function(){return ibx._appParms;};

ibx.deferredExceptionHook = function(useCustom)
{
	if(!useCustom)
		$.Deferred.exceptionHook = ibx._savedDeferredExceptionHook;
	else
	if(useCustom instanceof Function)
		$.Deferred.exceptionHook = fn;
	else
		$.Deferred.exceptionHook = function(error, stack){console.error(error.stack);};
};

//show all ibx root nodes when loaded...or don't, and show manually at user's discression.
ibx.showOnLoad = true;
ibx.showRootNodes = function(bShow)
{
	$(".ibx-root").toggleClass("ibx-visible", bShow);
	return ibx;//for chaining
};

//manage ARIA
ibx.isAccessible = true;
ibx.accessible = function(accessible)
{
	if(accessible === undefined)
		return ibx.isAccessible;

	ibx.isAccessible = accessible;
	ibx._setAccessibility(accessible);
	var widgets = $(".ibx-widget");
	widgets.each(function(idx, el)
	{
		//need to check destroyed, as some widgets destroy others when refreshing.
		var widget = $(el).data("ibxWidget");
		if(widget && !widget.destroyed())
			$(el).ibxWidget("option", "aria.accessible", accessible);
	});
};
ibx._setAccessibility = function(accessible)
{
	accessible ? $(".ibx-root").attr("role", "application") : $(".ibx-root").removeAttr("role");
};

//attach ibxWidgets to dom elements
ibx.bindElements = function(elements, bindInfo)
{
	var wnd = $(window);//saved for message dispatch
	
	//get elements that represent placeholders for resource bundle markup, and process them.
	var elPlaceholders = elements ? $(elements).find("[data-ibx-resource]") : $("[data-ibx-resource]");
	ibx.resourceMgr.processPlaceholders(elPlaceholders);
	
	//get elements to bind
	var elBind = elements ? $(elements) : $(".ibx-root");

	//construct all the widgets
	for(var i = 0; i < elBind.length; ++i)
	{
		var el = elBind[i];
		var element = $(el);

		//construct any unconstructed children first...ignore any no-binds.
		if(element.closest("[data-ibx-no-bind=true]").length)
			continue;

		var childWidgets = element.children();
		wnd.dispatchEvent("ibx_ibxbindevent", {"hint":"bindelementstart", "ibx":ibx, "element":el});
		wnd.dispatchEvent("ibx_ibxbindevent", {"hint":"bindchildrenstart", "ibx":ibx, "element":el, "children":childWidgets});
		ibx.bindElements(childWidgets);
		wnd.dispatchEvent("ibx_ibxbindevent", {"hint":"bindchildrenend", "ibx":ibx, "element":el, "children":childWidgets});

		//hook up member variables to the closest nameRoot
		var memberName = element.attr("data-ibx-name");
		if(memberName)
		{
			var nameRoot = element.closest(":ibxNameRoot");
			var nameRootWidget = nameRoot.data("ibxWidget");

			if(nameRootWidget)
				nameRootWidget.member(memberName, element);//nameRoot created, set directly
			else
			{
				//nameRoot not created, so store member variable to be set in widget._create
				var memberData = nameRoot.data("_ibxPrecreateMemberVariables") || {};
				memberData[memberName] = element;
				nameRoot.data("_ibxPrecreateMemberVariables", memberData);
			}
		}

		//then construct the parent element, if not already constructed.
		var widgetTime = new Date();
		if(element.is("[data-ibx-type]") && !element.is(".ibx-widget"))
		{
			var widgetType = element.attr("data-ibx-type");
			if($.ibi[widgetType])
			{
				wnd.dispatchEvent("ibx_ibxbindevent", {"hint":"bindwidgetstart", "ibx":ibx, "element":el});
				el.dataset.ibxConstructing = true;
				var widget = $.ibi[widgetType].call($.ibi, {}, element);
				delete el.dataset.ibxConstructing;
				wnd.dispatchEvent("ibx_ibxbindevent", {"hint":"bindwidgetend", "ibx":ibx, "element":el});
			}
			else
			if(widgetType != "ibxNull")
			{
				console.error("Unknown ibxWidget type:", widgetType, element[0]);
				debugger;
			}
			element.data("ibxIsBound", true);//mark this element as having been bound.
		}
		wnd.dispatchEvent("ibx_ibxbindevent", {"hint":"bindelementend", "ibx":ibx, "element":el});
	}
	return elBind;
};

ibx.getIbxMarkupOptions = function(el)
{
	el = $(el);

	//first get the ibx-options value and convert that to individual options.
	var ibxOptions = el.attr("data-ibx-options");
	var options = ibxOptions ? this.parseOptions(ibxOptions) : {};

	//then overlay any specific options on top.
	var attrs = el.prop("attributes");
	for(var i = 0; i < attrs.length; ++i)
	{
		var attr = attrs[i];
		var name = attr.name;
		if(name.search("data-ibxp-") == 0)
		{
			var props = name.replace("data-ibxp-", "").split(".");
			var prop = $.camelCase(props.shift());
			if(props.length)
			{
				var option= ibx.parseCompoundOptions(props, attr.value);
				options[prop] = $.extend(true, options[prop], option);
			}
			else
			{
				var option = (attr.value[0] == "{" || attr.value[0] == "[") ? ibx.parseOptions(attr.value) : null; //check for '{' to see if we parse as object.
				if(option instanceof Array)
					options[prop] = option;
				else
				if(option instanceof Object)
					options[prop] = $.extend(true, options[prop], option);
				else
					options[prop] = attr.value;
			}
		}
	}

	//go through the options and make sure the true/false/1/0 strings are turned into native types.
	$.each(options, function(name, value)
	{
		this[name] = ibx.coercePropVal(value);
	}.bind(options));
	return options;
};

ibx.parseCompoundOptions = function(props, value)
{
	var prop = $.camelCase(props.shift());
	var options = {};
	if(props.length)
		options[prop] = ibx.parseCompoundOptions(props, value);
	else
		options[prop] = value;
	return options;
};

ibx.parseOptions = function(opts)
{
	return eval("("+ opts +")");
};

ibx.coercePropVal = function (val)
{
	if(typeof(val) == "string" && val.length)
	{
		var tempVal = $.trim(val.toLowerCase());
		if(tempVal == "true")
			val = true;
		else
		if(tempVal == "false")
			val = false;
		else
		if($.isNumeric(val))
			val = Number(tempVal);
	}
	return val;
};

/*ibx profiling*/
ibxProfiler = function(start, options)
{
	window.addEventListener("ibx_ibxevent", this._ibxSystemEvent.bind(this));
	window.addEventListener("ibx_ibxbindevent", this._ibxSystemEvent.bind(this));
	window.addEventListener("ibx_ibxresmgr", this._ibxSystemEvent.bind(this));
	this.options = {"profileLevel": ibxProfiler.profileLevel.all, "bindFilter": "*",};
	if(start)
		this.start(true, options);
};
ibxProfiler.profileLevel = {"none":0x00, "ibx":0x01, "resources":0x02, "binding":0x04, "all":0xff};
ibxProfiler._stats = 
{
	"cache":{},
	"ibx":{},
	"resourceLoading":
	{
		"loadCounts":{}
	},
	"resourceBinding":
	{
		"count":0,
		"log":[],
	},
};

_p = ibxProfiler.prototype = Object.create(Object.prototype);
_p.profiling = false;
_p.options = null;
_p.stats = null;

_p.start = function(clear, options)
{
	$.extend(this.options, options);

	if(clear)
		this.stats = $.extend(true, {}, ibxProfiler._stats);
	this.profiling = true;
}
_p.stop = function()
{
	if(this.profiling)
	{
		this.stats.resourceBinding.log = this.sortBinds(this.stats.resourceBinding.log, "descending");
		this.profiling = false;
		delete this.stats.cache;
		return this.stats;
	}
}
_p._ibxSystemEvent = function(e)
{
	if(!this.profiling)
		return;

	var eType = e.type;
	var options = this.options;
	var stats = this.stats;
	var data = e.data;
	var hint = data.hint;
	if(eType == "ibx_ibxevent" && (options.profileLevel & ibxProfiler.profileLevel.ibx))
	{
		stats.cache[hint] = new Date();
		if(hint == "loadend")
		{
			stats.ibx.totalLoadTime = stats.cache.loadend - options.ibxLoadStart;
			stats.ibx.jQueryLoadTime = stats.cache.jqueryloaded - options.ibxLoadStart;
			stats.ibx.resourceFileLoadTime = stats.cache.resourcesloadend - stats.cache.resourcesloadstart;
			stats.ibx.pageBindingTime = stats.cache.pagebindingend - stats.cache.pagebindingstart;
			delete stats.cache;
		}
	}
 	else
	if(eType == "ibx_ibxresmgr" && (options.profileLevel & ibxProfiler.profileLevel.resources))
	{
		var bundleInfo = data.bundle || data.fileNode.ibxBundle.ibxProfileInfo;
		if(hint == "bundleloading")
		{
			data.bundle.ibxProfileInfo =
			{
				"loadTime":new Date(),
				"string-file":0,
				"style-file":0,
				"markup-file":0,
				"script-file":0,
				"ibx-res-bundle":0,
				"cache":{}
			}
		}
		if(hint == "bundleloaded")
		{
			if(data.src.search("ibx_resource_bundle.xml") != -1)
				stats.ibx.ibxLoadTime = (new Date()) - options.ibxLoadStart;
			bundleInfo.loadTime = (new Date()) - bundleInfo.loadTime;
			stats.resourceLoading[data.src] = bundleInfo;

			var loadCounts = stats.resourceLoading.loadCounts;
			if(!loadCounts["ibx-res-bundle"])
				loadCounts["ibx-res-bundle"] = 0;
			loadCounts["ibx-res-bundle"]++;

			delete bundleInfo.cache;
			delete data.bundle.ibxProfileInfo;
		}
		else
		if(hint == "fileloading")
			bundleInfo.cache[data.fileNode.attributes.src.value] = new Date();
		else
		if(hint == "fileloaded")
		{
			bundleInfo.cache[data.fileNode.attributes.src.value] = (new Date()) - data.fileNode.attributes.src.value;
			bundleInfo[data.fileType]++

			var fileType = data.fileType;
			if(!stats.resourceLoading.loadCounts[fileType])
				stats.resourceLoading.loadCounts[fileType] = 0;
			stats.resourceLoading.loadCounts[fileType]++;
		}
	}
	else
	if(eType == "ibx_ibxbindevent" && (options.profileLevel & ibxProfiler.profileLevel.binding))
	{
		if(!data.element.ibxBindInfo)
			data.element.ibxBindInfo = {"cache":{}};
		data.element.ibxBindInfo.cache[hint] = new Date();
		
		if(hint == "bindchildrenstart")
			data.element.ibxBindInfo.cache.bindChildren = data.children;
		else
		if(hint == "bindelementend" && !data.element.dataset.ibxConstructing)
		{
			stats.resourceBinding.count++;
			if($(data.element).is(options.bindFilter))
			{
				var bInfo = data.element.ibxBindInfo;
				bInfo.totalTime = bInfo.cache.bindelementend - bInfo.cache.bindelementstart;
				bInfo.widgetTime = bInfo.cache.bindwidgetend ? (bInfo.cache.bindwidgetend - bInfo.cache.bindwidgetstart) : null;
				bInfo.childTime = bInfo.cache.bindchildrenend - bInfo.cache.bindchildrenstart;
				bInfo.classes = data.element.className;
				bInfo.children = bInfo.cache.bindChildren.map(function(idx, child){return child.ibxBindInfo;}).toArray();
				bInfo.children = this.sortBinds(bInfo.children, "descending");
				bInfo.element = data.element;

				delete bInfo.cache;
				stats.resourceBinding.log.push(bInfo);
			}
		}
	}
}
_p.sortBinds = function(arBindInfo, sort)
{
	sort = (sort === undefined) ? "descending" : sort;
	return !sort ? this.stats.resourceBinding.log : arBindInfo.sort(function(sort, logItem1, logItem2)
	{
		var ret = 0;
		if(logItem1.totalTime < logItem2.totalTime)
			ret = -1;
		else
		if(logItem1.totalTime > logItem2.totalTime)
			ret = 1;
		return (sort == "descending") ? -ret : ret
	}.bind(this, sort))
};
_p.findBinds = function(tBase, el, sort)
{
	tBase = (tBase === null) ? 0 : tBase
	el = el ? el : "*";
	var ret = this.stats.resourceBinding.log.filter(function(el, logItem)
	{
		var ret = $(logItem.element).is(el);
		return ret && (logItem.totalTime >= tBase);
	}.bind(this, el));
	return this.sortBinds(ret, sort); 
};

//# sourceURL=ibx.js



