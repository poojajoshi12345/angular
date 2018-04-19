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
		resPackages == a1
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

	if(!ibx._loaded && !ibx._isLoading)
	{
		//resolve various ibx context values based on where we're loading from.
		var ibxScript = document.querySelector("script[src*='ibx.js']");
		var ibxPath = ibxScript.getAttribute("src").replace("ibx.js", "");
		ibx.setPath(ibxPath);
		ibx.setAppPath(window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1));
		ibx._appName = window.location.href.substring(window.location.href.lastIndexOf("/") + 1)
		ibx._isLoading = !ibx.loaded;
		
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
			};
		}

		//things to preload for ibx.  Everything else is in the root resource bundle
		var scripts = 
		[
			"<link type='text/css' rel='stylesheet' href='" + ibx._path + "./css/base.ibx.css'/>",
			"<script type='text/javascript' src='" + ibx._path + "./etc/jquery/jquery-3.1.1.js'></script>",
			"<script type='text/javascript' src='" + ibx._path + "./etc/jquery/jquery-ui-1.12.1/jquery-ui.js'></script>",
			"<script type='text/javascript' src='" + ibx._path + "./js/util.ibx.js'></script>",
			"<script type='text/javascript' src='" + ibx._path + "./js/preload.ibx.js'></script>"
		];

		//[IBX-122] don't load jQuery/jQueryUI if alread loaded
		if(window.jQuery)
			scripts[1] = "";
		if(window.jQuery && window.jQuery.ui)
			scripts[2] = "";

		document.open();
		document.write(scripts.join(""));
		document.close();

		//wait for jQuery/jQueryUI to be loaded...then boot ibx
		var dateStart = new Date();
		ibx._loadTimer = window.setInterval(function()
		{
			if((new Date()) - dateStart > ibx.loadTimeout)
			{
				window.clearInterval(ibx._loadTimer);
				throw("Error loading pre ibx resources: " + scripts);
			}
			if(window.jQuery && window.jQuery.widget)
			{
				//jQuery/jQueryUI is in scope...stop polling...
				window.clearInterval(ibx._loadTimer);

				//wait for jQuery to be fully loaded...
				$(function()
				{
					//jquery is fully loaded and running
					$(window).dispatchEvent("ibx_ibxevent", {"hint":"jqueryloaded", "ibx":ibx});

					//continue booting ibx...
					$(window).dispatchEvent("ibx_ibxevent", {"hint":"ibxloading", "ibx":ibx});
					ibx._loadPromise = $.Deferred();
					ibx._loadPromise._autoBind = autoBind;
					ibx._loadPromise._resPackages = resPackages;

					//this is needed because the relese version of ibx prepends the ibxResourceManager to this file which means
					//it's already defined...if in debug, we load it normally via AJAX...so this allows both.
					$.Deferred(function(dfd)
					{
						if(typeof(ibxResourceManager) == "undefined")
						{
							var url = ibx._path + "./js/resources.ibx.js";
							$.get(url).done(function(dfd, text, status, xhr)
							{
								dfd.resolve();
							}.bind(this, dfd));
						}
						else
							dfd.resolve();
					}).done(function()
					{
						//make the master/default resource manager for ibx.
						ibx.resourceMgr = new ibxResourceManager();

						var inlineStyles = $("head > style");//save the pre-ibx styles so they can be moved to the end after load.
						var packages = ibx._loadPromise._resPackages;
						packages.unshift("./ibx_resource_bundle.xml");
						ibx.resourceMgr.addBundles(packages).done(function()
						{
							//ibx is fully loaded and running.
							$(window).dispatchEvent("ibx_ibxevent", {"hint":"ibxloaded", "ibx":ibx});

							//bool means just bind everything...string means select these and bind them
							$(window).dispatchEvent("ibx_ibxevent", {"hint":"markupbinding", "ibx":ibx});
							var autoBind = ibx._loadPromise._autoBind;
							if(autoBind)
							{
								ibx.bindElements((typeof(autoBind) === "string") ? autoBind : "");
								$(window).dispatchEvent("ibx_ibxevent", {"hint":"markupbound", "ibx":ibx});
							}

							$("head").append(inlineStyles);//move any non-ibx styles to the end so they will override ibx styles.
						
							ibx._loaded = true;
							ibx._isLoading = !ibx._loaded;
							ibx._loadPromise.then(fn);
							ibx._loadPromise.then(function()
							{
								ibx._setAccessibility(ibx.isAccessible);//turn on/off default accessibility

								var ibxRoots = $(".ibx-root").addClass("ibx-loaded");//display all ibx-roots, now that we are loaded.
								if(ibx.showOnLoad)
									ibx.showRootNodes(true);
									
							});
							ibx._loadPromise.resolve(ibx);//let everyone know the system is booted.
							$(window).dispatchEvent("ibx_ibxevent", {"hint":"apploaded", "ibx":ibx});
						});
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
}
ibx._setAccessibility = function(accessible)
{
	accessible ? $(".ibx-root").attr("role", "application") : $(".ibx-root").removeAttr("role");
};

//where ibx.js loaded from
ibx._path = "";
ibx.getPath = function(){return ibx._path;};
ibx.setPath = function(path){ibx._path = path;};

//the window's location when the ibx <script> tag was loaded.
ibx._appPath = "";
ibx.getAppPath = function(){return ibx._appPath;};
ibx.setAppPath = function(path){ibx._appPath = path;};

//the endpoint of the windows location when ibx <script> tag was loaded....and any parms passed via url
ibx._appName = "";
ibx.getAppName = function(){return ibx._appName;};
ibx._appParms;
ibx.getAppParms = function(){return ibx._appParms;};

//attach ibxWidgets to dom elements
ibx.bindElements = function(elements)
{
	//get elements that represent placeholders for resource bundle markup, and process them.
	var elPlaceholders = elements ? $(elements).find("[data-ibx-resource]") : $("[data-ibx-resource]");
	ibx.resourceMgr.processPlaceholders(elPlaceholders);
	
	//get elements to bind
	var elBind = elements ? $(elements) : $("[data-ibx-type]");

	//construct all the widgets
	elBind.each(function(idx, el)
	{
		var element = $(el);

		//construct any unconstructed children first...ignore any no-binds.
		if(element.closest("[data-ibx-no-bind=true]").length)
			return;

		var childWidgets = element.children();
		ibx.bindElements(childWidgets);

		//only for elements that haven't been bound before.
		if(!element.data("ibxIsBound"))
		{
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
			if(element.is("[data-ibx-type]") && !element.is(":ibxWidget"))
			{
				var widgetType = element.attr("data-ibx-type");
				if($.ibi[widgetType])
					var widget = $.ibi[widgetType].call($.ibi, {}, element);
				else
				if(widgetType != "ibxNull")
				{
					console.error("Unknown ibxWidget type:", widgetType, element[0]);
					debugger;
				}
				element.data("ibxIsBound", true);//mark this element as having been bound.
			}
		}
	}.bind(this));
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
				options[prop] = $.extend(true, options[prop], option)
			}
			else
			{
				var option = (attr.value[0] == "{" || attr.value[0] == "[") ? ibx.parseOptions(attr.value) : null; //check for '{' to see if we parse as object.
				if(option instanceof Array)
					options[prop] = option;
				else
				if(option instanceof Object)
					options[prop] = $.extend(true, options[prop], option)
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
}

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

//# sourceURL=ibx.js



