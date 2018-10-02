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
							delete ibx._loadStart;
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
		var element = $(elBind[i]);

		//construct any unconstructed children first...ignore any no-binds.
		if(element.closest("[data-ibx-no-bind=true]").length)
			continue;

		var childWidgets = element.children();
		wnd.dispatchEvent("ibx_ibxbindevent", {"hint":"bindelementstart", "ibx":ibx, "element":element});
		wnd.dispatchEvent("ibx_ibxbindevent", {"hint":"bindchildrenstart", "ibx":ibx, "element":element, "children":childWidgets});
		ibx.bindElements(childWidgets);
		wnd.dispatchEvent("ibx_ibxbindevent", {"hint":"bindchildrenend", "ibx":ibx, "element":element, "children":childWidgets});

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
				wnd.dispatchEvent("ibx_ibxbindevent", {"hint":"bindwidgetstart", "ibx":ibx, "element":element});
				var widget = $.ibi[widgetType].call($.ibi, {}, element);
				wnd.dispatchEvent("ibx_ibxbindevent", {"hint":"bindwidgetend", "ibx":ibx, "element":element});
			}
			else
			if(widgetType != "ibxNull")
			{
				console.error("Unknown ibxWidget type:", widgetType, element[0]);
				debugger;
			}
			element.data("ibxIsBound", true);//mark this element as having been bound.
		}
		wnd.dispatchEvent("ibx_ibxbindevent", {"hint":"bindelementend", "ibx":ibx, "element":element});
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
ibx.profiling = false;
ibx.profileLevel = {"none":0x00, "ibx":0x01, "resources":0x02, "binding":0x04};
ibx.profileLogLevel = {"none":0x00, "warning":0x01, "error":0x02, "fatal":0x04};
ibx.setProfileOptions = function(options){return $.extend(ibx.profileOptions, options);}
ibx.profileOptions =
{
	profileLevel: ibx.profileLevel.ibx | ibx.profileLevel.resources | ibx.profileLevel.binding,
	profileLogLevel: ibx.profileLogLevel.caution | ibx.profileLogLevel.warning | ibx.profileLogLevel.severe,
	binding:
	{
		caution:25,
		warning:100,
		severe:250,
	}
};
ibx.profileInfo =
{
	"ibx":{},
	"resources":
	{
		"loadCounts":
		{
			"style":0,
			"script":0,
			"string":0,
			"markup":0,
			"bundle":0,
		}
	},
	"bindings":
	{
		"count":0,
		"log":[]
	},
	"cache":{}
};

ibx._ibxSystemEvent = function(e)
{
	if(!ibx.profiling)
		return;

	var eType = e.type;
	var pOptions = ibx.profileOptions;
	var pInfo = ibx.profileInfo;
	var data = e.data;
	var hint = data.hint;
	if(eType == "ibx_ibxevent" && (ibx.profileOptions.profileLevel & ibx.profileLevel.ibx))
	{
		pInfo.cache[hint] = new Date();
		if(hint == "loadend")
		{
			var info = pInfo.ibx;
			info.totalLoadTime = pInfo.cache.loadend - ibx._loadStart;
			info.jQueryLoadTime = pInfo.cache.jqueryloaded - ibx._loadStart;
			info.resourceFileLoadTime = pInfo.cache.resourcesloadend - pInfo.cache.resourcesloadstart;
			info.pageBindingTime = pInfo.cache.pagebindingend - pInfo.cache.pagebindingstart;
			pInfo.bindings.log.reverse();
			delete pInfo.cache;
			console.dir(pInfo);
		}
	}
	else
	if(eType == "ibx_resmgr" && (ibx.profileOptions.profileLevel & ibx.profileLevel.resources))
	{
		if(hint == "bundleloading")
		{
			data.bundle.profileInfo =
			{
				"loadTime":new Date(),
				"totals":
				{
					"style":0,
					"script":0,
					"string":0,
					"markup":0,
					"bundle":0,
				}
			};
		}
		else		
		if(hint == "bundleloaded")
		{
			data.bundle.profileInfo.loadTime = (new Date()) - data.bundle.profileInfo.loadTime;
			pInfo.resources[data.src] = data.bundle.profileInfo;
			pInfo.resources.loadCounts.bundle++;
			delete data.bundle.profileInfo;

			if(data.src.search("ibx_resource_bundle.xml") != -1)
				pInfo.ibx.ibxLoadTime = (new Date()) - ibx._loadStart;
		}
		else
		if(hint == "fileloading")
		{

		}
		else
		if(hint == "fileloaded")
		{
			switch(data.fileType)
			{
				case "string-file": pInfo.resources.loadCounts.string++;break;
				case "markup-file": pInfo.resources.loadCounts.markup++;break;
				case "script-file": pInfo.resources.loadCounts.script++;break;
				case "style-file": pInfo.resources.loadCounts.style++;break;
			}
		}
	}
	else
	if(eType == "ibx_ibxbindevent" && (ibx.profileOptions.profileLevel & ibx.profileLevel.binding))
	{
		if(!data.element.ibxBindInfo)
			data.element.ibxBindInfo = {};
		data.element.ibxBindInfo[hint] = new Date();
		if(hint == "bindelementend")
		{
			var bInfo = data.element.ibxBindInfo;
			bInfo.element = data.element;
			bInfo.bindTime = bInfo.bindelementend - bInfo.bindelementstart;
			bInfo.bindWidgetTime  = bInfo.bindwidgetend ? (bInfo.bindwidgetend - bInfo.bindwidgetstart) : null;
			bInfo.bindChildTime = bInfo.bindchildrenend - bInfo.bindchildrenstart;
			pInfo.bindings.count++;
			if(bInfo.bindTime >= pOptions.binding.caution)
			{
				var type = "Caution";
				if(bInfo.bindTime >= pOptions.binding.warning)
					type = "Warning";
				if(bInfo.bindTime >= pOptions.binding.severe)
					type = "Severe";

				var widget = data.element.data("ibxWidget");
				pInfo.bindings.log.push(
				{
					"level":type,
					"time":bInfo.bindTime,
					"widgetTime":bInfo.bindWidgetTime,
					"childTime":bInfo.bindChildTime,
					"type": widget ? widget._widgetClass : bInfo.element.prop("className"),
					"element":bInfo.element[0],
					"bindInfo":bInfo
				});
			}
		}
	}
}
window.addEventListener("ibx_ibxevent", ibx._ibxSystemEvent.bind(ibx));
window.addEventListener("ibx_ibxbindevent", ibx._ibxSystemEvent.bind(ibx));
window.addEventListener("ibx_resmgr", ibx._ibxSystemEvent.bind(ibx));

//# sourceURL=ibx.js



