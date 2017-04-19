/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:


/****
	You can attach a function to ibx at any point and it is guaranteed to be called after the
	system is booted. YEEEEEEE HAAAAAAAAW!
****/
function ibx(fn, path, autoBind)
{
	if(!ibx._loaded && !ibx._isLoading)
	{
		ibx._isLoading = !ibx.loaded;
		ibx.setPath(path);

		//things to preload for ibx.  Everything else is in the root resource bundle
		var scripts = 
		[
			"<link type='text/css' rel='stylesheet' href='" + ibx._path + "./resources/css/base.ibx.css'/>",
			"<script type='text/javascript' src='" + ibx._path + "./resources/etc/jquery/jquery-3.1.1.js'></script>",
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

			if(window.$)
			{
				//save the current inline head style block so they can be moved after all ibx loaded css files.
				var styles = $("head > style").detach();

				//jquery is loaded...stop polling and continue bootstrapping ibx...
				window.clearInterval(ibx._loadTimer);

				ibx._loadPromise = $.Deferred();
				ibx._loadPromise._autoBind = autoBind;

				var url = ibx._path + "./resources/js/resources.ibx.js";
				$.get(url).then(function()
				{
					ibxResourceMgr.setContextPath(ibx._path);
					ibxResourceMgr.addBundle(ibx._path + "./resources/ibx_resource_bundle.xml").done(function()
					{
						if(ibx._loadPromise._autoBind)
						{
							ibx.bindElements();
						}

						ibx._loaded = true;
						ibx._isLoading = !ibx._loaded;
						ibx._loadPromise.then(fn);
						ibx._loadPromise.then(function()
						{
							$("head").append(styles);//append the inline style blocks back to end of head.
							$(".ibx-root").addClass("ibx-loaded");//display all ibx-roots, now that we are loaded.
						});
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
		var noBind = ibx.coercePropVal(element.attr("data-ibx-no-bind"));
		if(noBind)
			return;

		//construct any unconstructed ancestors first
		var childWidgets = element.find("[data-ibx-type]");
		var childBound = ibx.bindElements(childWidgets);
		elBound = elBound.add(childBound);

		//hook up member variables to the closest nameRoot
		var memberName = element.attr("data-ibx-name");
		if(memberName)
		{
			var nameRoot = element.closest(":ibxNameRoot");
			var nameRootWidget = nameRoot.data("ibxWidget");
			if(nameRootWidget)
				nameRootWidget[memberName] = element;//nameRoot created, set directly
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



