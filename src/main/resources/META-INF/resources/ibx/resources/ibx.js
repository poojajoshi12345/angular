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
			ibx.forceInlineresLoaded = (ibx._appParms.forceInlineresLoaded !== undefined) ? (ibx._appParms.forceInlineresLoaded == "true") : ibx.forceInlineresLoaded;
			ibx.forceLinkLoading = (ibx._appParms.forceLinkLoading !== undefined) ? (ibx._appParms.forceLinkLoading == "true") : ibx.forceLinkLoading;
		}
		ibx._appInfoResolved = true;
	}

	if(!ibx._loaded && !ibx._isLoading)
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
					ibx.loadProfile = new ibxProfiler(true, "ibxLoadProfile", {"ibxLoadStart": new Date()});

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
							
							//if profiling...pause.
							if(ibx.loadProfile)
								ibx.loadProfile.stop();
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
ibx.forceInlineresLoaded = false;//[ACT-1571]Needed a way to package ibx into single file...this forces all script/css to be inline.

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
		$.Deferred.exceptionHook = function(error, stack){console.error(error, stack || "");};
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
	$(".ibx-root").each(function(idx, el)
	{
		var root = $(el);
		var title = root.attr("aria-label") || "Application " + document.title;
		accessible ? root.attr({"role":"application", "aria-label":title, "tabindex":0}) : root.removeAttr("role aria-label tabindex");
	}.bind(this));
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

		//turn on profiling for this element
		var profile = element.data("ibxProfile");
		if(profile)
			profile = ibxProfiler.profiles[profile] || new ibxProfiler(true, profile);

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
	
		if(profile)
			profile.stop();
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
		options[prop] = ibx.coercePropVal(value);
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
ibxProfiler = function(start, name, options)
{
	//register the system events.
	window.addEventListener("ibx_ibxevent", this._ibxSystemEvent.bind(this));
	window.addEventListener("ibx_ibxbindevent", this._ibxSystemEvent.bind(this));
	window.addEventListener("ibx_ibxresmgr", this._ibxSystemEvent.bind(this));

	//save the creation date.
	var start = new Date();
	this.time = sformat("{1}:{2}:{3}:{7} {4}/{5}/{6}", start.getHours(), start.getMinutes(), start.getSeconds(), start.getMonth()+1, start.getDate(), start.getFullYear(), start.getMilliseconds());
	
	//merge/set the options.
	options = (name instanceof Object) ? ibx.parseOptions(name) : options;
	this.options = $.extend(true,
	{
		"name":name || ("ibxProfile_" + ibxProfiler._nCount++),
		"logToConsole": true,
		"profileLevel": ibxProfiler.profileLevel.all,
		"bindFilter": "*",
	}, options);
	
	//start if desired.
	if(start)
		this.start(true, options);

	//register this profile in the static list of profiles.
	ibxProfiler.profiles[this.options.name] = this;
};
ibxProfiler._nCount = 0;
ibxProfiler.profiles = {};//created profiles.
ibxProfiler.profileLevel = {"none":0x00, "ibx":0x01, "resources":0x02, "binding":0x04, "all":0xff};
ibxProfiler._stats = 
{
	"cache":{},
	"ibx":
	{
		"ibxLoadTime":{}
	},
	"resources":
	{
		"totalTime":0,
		"loadCounts":{},
		"bundles":{}
	},
	"binding":
	{
		"totalTime":0,
		"count":0,
		"elements":[],
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
};
_p.stop = function()
{
	if(this.profiling)
	{
		this.stats.binding.elements = this.sortBinds(this.stats.binding.elements, "descending");
		this.stats.binding.count = this.stats.binding.elements.length;
		this.profiling = false;
		delete this.stats.cache;
		if(this.options.logToConsole)
			console.warn(this.options.name, this.stats);
		return this.stats;
	}
};
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
			stats.ibx.totalTime = stats.cache.loadend - options.ibxLoadStart;
			stats.ibx.ibxLoadTime.jQueryLoadTime = stats.cache.jqueryloaded - options.ibxLoadStart;
			stats.ibx.ibxLoadTime.misc = (stats.ibx.ibxLoadTime.totalTime - stats.ibx.ibxLoadTime.resBundleTime - stats.ibx.ibxLoadTime.jQueryLoadTime);
			stats.ibx.resourceFileLoadTime = stats.cache.resourcesloadend - stats.cache.resourcesloadstart;
			stats.ibx.pageBindingTime = stats.cache.pagebindingend - stats.cache.pagebindingstart;
			delete stats.cache;
		}
	}
 	else
	if(eType == "ibx_ibxresmgr" && (options.profileLevel & ibxProfiler.profileLevel.resources))
	{
		var bundleInfo = data.bundle ? data.bundle.ibxProfileInfo : data.fileNode.ibxBundle.ibxProfileInfo;
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
			};
		}
		if(hint == "bundleloaded")
		{
			bundleInfo.loadTime = (new Date()) - bundleInfo.loadTime;
			stats.resources.bundles[data.src] = bundleInfo;
			stats.resources.totalTime += bundleInfo.loadTime;

			//bundle is part of ibx load...not external
			if(data.src.search("ibx_resource_bundle.xml") != -1)
			{
				stats.ibx.ibxLoadTime.totalTime = (new Date()) - options.ibxLoadStart;
				stats.ibx.ibxLoadTime.resBundleTime = bundleInfo.loadTime;
			}

			var loadCounts = stats.resources.loadCounts;
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

			if(!bundleInfo[data.fileType])
				bundleInfo[data.fileType] = 0;
			bundleInfo[data.fileType]++;

			var fileType = data.fileType;
			if(!stats.resources.loadCounts[fileType])
				stats.resources.loadCounts[fileType] = 0;
			stats.resources.loadCounts[fileType]++;
		}
	}
	else
	if(eType == "ibx_ibxbindevent" && (options.profileLevel & ibxProfiler.profileLevel.binding))
	{
		//if first time binding then make a cache for binding information
		if(!data.element.ibxProfileBindInfo)
			data.element.ibxProfileBindInfo = {};
		
		//if first time binding for this particular profile, make a cache for this profile and element
		var bindInfo = data.element.ibxProfileBindInfo[this.options.name];
		if(!bindInfo)
			bindInfo = data.element.ibxProfileBindInfo[this.options.name] = {"cache":{}};
		
		//save the event time.
		bindInfo.cache[hint] = new Date();
		
		//process the event
		if(hint == "bindchildrenstart")
			bindInfo.cache.bindChildren = data.children;
		else
		if(hint == "bindelementend" && !data.element.dataset.ibxConstructing)
		{
			if($(data.element).is(options.bindFilter))
			{
				bindInfo.classes = data.element.className;
				bindInfo.totalTime = bindInfo.cache.bindelementend - bindInfo.cache.bindelementstart;
				bindInfo.widgetTime = bindInfo.cache.bindwidgetend ? (bindInfo.cache.bindwidgetend - bindInfo.cache.bindwidgetstart) : "N/A";
				bindInfo.childTime = bindInfo.cache.bindchildrenend - bindInfo.cache.bindchildrenstart;
				bindInfo.children = bindInfo.cache.bindChildren.map(function(idx, child){return child.ibxProfileBindInfo[this.options.name];}.bind(this)).toArray();
				bindInfo.children = this.sortBinds(bindInfo.children, "descending");
				bindInfo.element = data.element;
				bindInfo.timeStamp = bindInfo.cache.bindelementend;
				delete bindInfo.cache;
				stats.binding.totalTime += isNaN(bindInfo.widgetTime) ? 0 : bindInfo.widgetTime;
				stats.binding.elements.push(bindInfo);
			}
		}
	}
};
_p.sortBinds = function(arBindInfo, sort)
{
	sort = (sort === undefined) ? "descending" : sort;
	return !sort ? this.stats.binding.elements : arBindInfo.sort(function(sort, logItem1, logItem2)
	{
		var ret = 0;
		if(logItem1.totalTime < logItem2.totalTime)
			ret = -1;
		else
		if(logItem1.totalTime > logItem2.totalTime)
			ret = 1;
		return (sort == "descending") ? -ret : ret;
	}.bind(this, sort));
};
_p.findBinds = function(tBase, elFilter, sort)
{
	tBase = (tBase === null) ? 0 : tBase;
	elFilter = elFilter ? elFilter : "*";
	var ret = this.stats.binding.elements.filter(function(elFilter, logItem)
	{
		var ret = $(logItem.element).is(elFilter);
		return ret && (logItem.totalTime >= tBase);
	}.bind(this, elFilter));
	return this.sortBinds(ret, sort); 
};

_p.toString = function(verbose)
{
	var name = this.options.name;
	var stats = this.stats;
	var resCounts = stats.resources.loadCounts;
	var strOut = "";

	if(verbose)
		strOut = sformat("Summary: {1}\nDetail:\n{2}", this.toString(), this.serialize(this.stats, 0));
	else
	{
		strOut = sformat("ibxProfile {1}: ibx {2}ms, binding {3}ms (count: {4}), resources {5}ms (counts: bundle {6}, markup {7}, scripts {8}, strings {9}, styles {10})",
			name,
			stats.ibx.ibxLoadTime.totalTime,
			stats.binding.totalTime, stats.binding.count,
			stats.resources.totalTime, resCounts["ibx-res-bundle"], resCounts["markup-file"], resCounts["script-file"], resCounts["string-file"], resCounts["style-file"]
		);
	}
	return strOut;
}

_p.serialize = function(o, depth, format)
{
	var strOut = "";
	var strIndent = (new Array(depth + 1)).join("\t");

	if(o instanceof Array)
	{
		for(var i = 0; i < o.length; ++i)
			strOut += this.serialize(o[i], depth + 1, format) + "\n";
	}
	else
	if(o instanceof Object)
	{
		for(var key in o)
		{
			var prop = o[key];
			if(!prop)
				continue;

			if(prop instanceof Object)
			{
				if(prop instanceof HTMLElement)
					continue;
				strOut += sformat("{1}{2}:\n", strIndent, key);
				strOut += this.serialize(prop, depth + 1, format);
			}
			else
			if(!(prop instanceof Function))
				strOut += sformat("{1}{2}: {3}\n", strIndent, key, prop);
		}
	}

	return strOut + "";
}

//# sourceURL=ibx.js



