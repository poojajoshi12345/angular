/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/****
	You can attach a function to ibx at any point and it is guaranteed to be called after the
	system is booted. This is just like jQuery...YEEEEEEE HAAAAAAAAW!
****/
function ibx(fn, path)
{
	if(typeof(fn) === "string")
		ibx.setPath(fn);

	if(ibx._loadedPromise && typeof(fn) === "function")
	{
		if(!ibx._loaded)
			throws("You haven't started the ibx subsystem!");
		ibx._loadedPromise.then(fn);
	}
	return ibx;
}
ibx.loadTimeout = 10000;
ibx._loaded = false;
ibx._loadedPromise = null;
ibx._path = "";
ibx.getPath = function(){return ibx._path;};
ibx.setPath = function(path){ibx._path = path;};

ibx.start = function(path)
{
	if(ibx.loaded)
		return ibx;
	ibx.setPath(path);

	var scripts = 
	[
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
			ibx._loadedPromise = $.Deferred();

			window.clearInterval(ibx._loadTimer);
			var url = ibx._path + "./resources/js/resources.ibx.js";
			$.get(url).then(function()
			{
				ibxResourceMgr.addBundle(ibx._path + "./resources/ibx_resource_bundle.xml").then(function()
				{
					ibx._loadedPromise.reslove("ibx subsystem cocked and loaded!");//let everyone know the system is booted.
					$(window).trigger("ibx_loaded");
					ibx._loaded = true;
				});
			});
		}
	}, 0);
};
//# sourceURL=ibx.js
