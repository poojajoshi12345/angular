/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

function ibxNavManager()
{
	
	window.addEventListener("keydown", ibxNavManager._onKeyEvent.bind(this), true);
}

ibxNavManager.options =
{
	triggerKey:"CTRL+M",
}
ibxNavManager._onKeyEvent = function(e)
{
	if(eventMatchesShortcut(ibxNavManager.options.triggerKey, e))
	{
		var target = $(e.target);
		var navMenu = $("<div>").ibxMenu({"refocusLastActiveOnClose":false});
		var navRoot = target.parents("[data-ibx-nav-root=true]").first();
		var navPoints = navRoot.find("[data-ibx-nav-point]");
		navPoints.each(function(idx, navPoint)
		{
			navPoint = $(navPoint);
			if(navRoot.is(navPoint.parents("[data-ibx-nav-root=true]").first()))
			{
				var navInfo = "(" + navPoint.data("ibxNavPoint") + ")";
				navInfo = eval(navInfo);
				navInfo.el = navPoint[0];
				var menuItem = $("<div>").ibxMenuItem({labelOptions:{text:navInfo.label}, userValue:navInfo});
				navMenu.ibxWidget("add", menuItem);
			}
		}.bind(this))

		navMenu.ibxWidget("open").on("ibx_select", function(e)
		{
			var navInfo = $(e.originalEvent.target).ibxWidget("option", "userValue");
			navInfo.el.focus();
			console.log(navInfo.el);
		});
	}
}

ibx.navManager = new ibxNavManager();

//# sourceURL=navmap.ibx.js
