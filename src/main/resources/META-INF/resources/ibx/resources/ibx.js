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
		//resolve where ibx is loading from.
		var ibxScript = document.querySelector("script[src*='ibx.js']");
		var ibxPath = ibxScript.getAttribute("src").replace("ibx.js", "");
		ibx.setPath(ibxPath);

		ibx._isLoading = !ibx.loaded;

		//things to preload for ibx.  Everything else is in the root resource bundle
		var scripts = 
		[
			"<link type='text/css' rel='stylesheet' href='" + ibx._path + "./css/base.ibx.css'/>",
			"<script type='text/javascript' src='" + ibx._path + "./etc/jquery/jquery-3.1.1.js'></script>",
			"<script type='text/javascript' src='" + ibx._path + "./etc/jquery/jquery-ui-1.12.1/jquery-ui.js'></script>",
		];
		document.open();
		document.write(scripts.join(""));
		document.close();

		//wait for jquery to be loaded...then boot ibx
		var dateStart = new Date();
		ibx._loadTimer = window.setInterval(function()
		{
			if((new Date()) - dateStart > ibx.loadTimeout)
			{
				window.clearInterval(ibx._loadTimer);
				throw("Error loading pre ibx resources: " + scripts);
			}

			if(window.jQuery)
			{
				//jQuery is in scope...stop polling...
				window.clearInterval(ibx._loadTimer);

				//wait for jQuery to be fully loaded...
				$(function()
				{
					//continue booting ibx...
					ibx._loadPromise = $.Deferred();
					ibx._loadPromise._autoBind = autoBind;
					ibx._loadPromise._resPackages = resPackages;

					var url = ibx._path + "./js/resources.ibx.js";
					$.get(url).then(function()
					{
						//save the current inline head style blocks so they can be moved after all ibx loaded css files.
						var inlineStyles = $("head > style").detach();

						ibxResourceMgr.setContextPath(ibx._path);
						var packages = ibx._loadPromise._resPackages;
						packages.unshift(ibx._path + "./ibx_resource_bundle.xml");
						ibxResourceMgr.addBundles(packages).done(function()
						{
							//bool means just bind everything...string means select these and bind them
							var autoBind = ibx._loadPromise._autoBind;
							if(autoBind)
								ibx.bindElements((typeof(autoBind) === "string") ? autoBind : "");

							$("head").append(inlineStyles);//append the inline style blocks back to end of head.
						
							ibx._loaded = true;
							ibx._isLoading = !ibx._loaded;
							ibx._loadPromise.then(fn);
							ibx._loadPromise.then(function()
							{
								$(".ibx-root").addClass("ibx-loaded");//display all ibx-roots, now that we are loaded.
							});
							ibx._loadPromise.resolve(ibx);//let everyone know the system is booted.
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
ibx.version = "0.1";
ibx.loadTimeout = 10000;//can't get preloads in running state by this interval, then bail!
ibx._loaded = false;
ibx._loadPromise = null;
ibx._path = "";
ibx.getPath = function(){return ibx._path;};
ibx.setPath = function(path){ibx._path = path;};

ibx.bindElements = function(elements)
{
	//get elements to bind
	var elBound = $();
	var elBind = elements ? $(elements) : $("[data-ibx-type]");

	//construct all the widgets
	elBind.each(function(idx, el)
	{
		var element = $(el);

		//construct any unconstructed children first...ignore any no-binds.
		var childWidgets = element.children(":not([data-ibx-no-bind])");
		var childBound = ibx.bindElements(childWidgets);
		elBound = elBound.add(childBound);

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
			{
				var widget = $.ibi[widgetType].call($.ibi, {}, element);
				elBound = elBound.add(widget.element);
			}
			else
			{
				console.error("Unknown ibxWidget type:", widgetType, element[0]);
				debugger;
			}
		}
	}.bind(this));
	return elBound;
};

ibx.getIbxMarkupOptions = function(el)
{
	el = $(el);

	//first get the ibx-options value and convert that to individual options.
	var ibxOptions = el.attr("data-ibx-options") || "{}";
	var options = this.parseIbxOptions(ibxOptions);

	//then overlay any specific options on top.
	var attrs = $(el).prop("attributes");
	for(var i = 0; i < attrs.length; ++i)
	{
		var attr = attrs[i];
		var name = attr.name;
		if(name.search("data-ibxp-") == 0)
		{
			var prop = name.replace("data-ibxp-", "");
			prop = $.camelCase(prop);
			var option = attr.value[0] == "{" ? this.parseIbxOptions(attr.value) : null; //check for '{' to see if we parse as object.
			options[prop] = option ? $.extend(true, options[prop], option) : attr.value;
		}
	}

	//go through the options and make sure the true/false/1/0 strings are turned into native types.
	$.each(options, function(name, value)
	{
		this[name] = ibx.coercePropVal(value);
	}.bind(options));
	return options;
};

ibx.parseIbxOptions = function(opts)
{
	return eval("("+ opts +")");
};

ibx.coercePropVal = function (val)
{
	if(typeof(val) == "string" && val.length)
	{
		var tempVal = $.trim(val.toLowerCase());
		if (tempVal == "true")
			val = true;
		else
		if (tempVal == "false")
			val = false;
		else
		if (!isNaN(tempVal = Number(val)))
			val = tempVal;
	}
	return val;
};

//# sourceURL=ibx.js



