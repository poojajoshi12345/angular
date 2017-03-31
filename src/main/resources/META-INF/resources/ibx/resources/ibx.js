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
			"<link type='text/css' rel='stylesheet' href='" + ibx._path + "./resources/css/base.ibx.css'></link>",
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
							$.ibi.ibxWidget.bindElements();

						ibx._loaded = true;
						ibx._isLoading = !ibx._loaded;
						ibx._loadPromise.then(fn);
						ibx._loadPromise.resolve(ibx);//let everyone know the system is booted.
						$(".ibx-root").addClass("ibx-loaded");//display all ibx-roots, now that we are loaded.
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

//# sourceURL=ibx.js
