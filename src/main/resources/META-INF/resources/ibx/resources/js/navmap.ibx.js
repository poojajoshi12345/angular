/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

//sub classes of menu things to use for navigation mapping
$.widget("ibi.ibxNavMap", $.ibi.ibxMenu,{_widgetClass: "ibx-nav-map", options:{"focusDefault":false, "focusResetOnBlur":true, "refocusLastActiveOnClose":false, "aria":{"label":"Quick Navigation Map"}}});
$.widget("ibi.ibxNavMapItem", $.ibi.ibxMenuItem,{_widgetClass: "ibx-nav-map-item", options:{}});

//just listen for events to trigger the navigation management
function ibxNavManager()
{
	
	window.addEventListener("keydown", ibxNavManager._onKeyEvent.bind(this), true);
}

ibxNavManager.options =
{
	triggerKey:"ALT+M",
}
ibxNavManager._onKeyEvent = function(e)
{
	if(eventMatchesShortcut(ibxNavManager.options.triggerKey, e))
	{
		var target = $(e.target);
		var navRoot = target.closest("[data-ibx-nav-map]");
		var navMap = $(navRoot.attr("data-ibx-nav-map")).ibxWidget("open").on("ibx_select", function(e)
		{
			var navItem = e.originalEvent.target.getAttribute("data-ibx-nav-target");
			//don't know why I need this, but the default focusing of the navKeyRoot isn't working after initial focusing
			//it's focusing the default item and then focusing the root?
			$(document.body).focus();
			$(navItem).focus();
		}).focus();
	}
}

ibx.navManager = new ibxNavManager();

//# sourceURL=navmap.ibx.js
