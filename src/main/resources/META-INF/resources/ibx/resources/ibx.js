/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:


/****
	You can attach a function to ibx at any point and it is guaranteed to be called after the
	system is booted. This is just like jQuery...YEEEEEEE HAAAAAAAAW!
****/
function ibx(fn, path, autoBind)
{
	if(!ibx.loaded)
	{
		ibx.setPath(path);

		var scripts = 
		[
			"<link type='text/css' rel='stylesheet' href='" + ibx._path + "./resources/css/base.ibx.css'></link>",
			"<script type='text/javascript' src='" + ibx._path + "./resources/etc/jquery/jquery-3.1.1.js'></script>",
			"<script type='text/javascript' src='" + ibx._path + "./resources/etc/jquery/jquery-ui-1.12.1/jquery-ui.js'></script>"
		];
		document.open();
		document.write(scripts.join(""));
		document.close();

		var dateStart = new Date();
		ibx._loadTimer = window.setInterval(function()
		{
			if((new Date()) - dateStart > ibx.loadTimeout)
			{
				window.clearInterval(ibx._loadTimer);
				throw("error loading ibx subsystem");
			}

			if(window.$ && window.$.ui)
			{
				window.clearInterval(ibx._loadTimer);

				ibx._loadPromise = $.Deferred();
				ibx._loadPromise._autoBind = autoBind;

				var url = ibx._path + "./resources/js/resources.ibx.js";
				$.get(url).then(function()
				{
					ibxResourceMgr.setContextPath(ibx._path);
					ibxResourceMgr.addBundle(ibx._path + "./resources/ibx_resource_bundle.xml").then(function()
					{
						if(ibx._loadPromise)
						{
							var bindingRoots = $(".ibx-binding-root:not(.ibx-bound)");
							$.ibi.ibxWidget.bindElements(bindingRoots);
							bindingRoots.addClass("ibx-bound");
						}

						ibx._loaded = true;
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
			throws("You haven't started the ibx subsystem!");
		ibx._loadPromise.then(fn);
	}
	return ibx;
}
ibx.loadTimeout = 10000;
ibx._loaded = false;
ibx._loadPromise = null;
ibx._path = "";
ibx.getPath = function(){return ibx._path;};
ibx.setPath = function(path){ibx._path = path;};

//# sourceURL=ibx.js
