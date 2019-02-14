/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

//sub classes of menu things to use for navigation mapping
$.widget("ibi.ibxNavMapItem", $.ibi.ibxMenuItem,{options:{navTarget:null, aria:{role:"listitem"}}, _widgetClass: "ibx-nav-map-item"});
$.widget("ibi.ibxNavMap", $.ibi.ibxMenu,
{
	options:
	{
		"navParent":null,
		"navTarget":null,
		"focusDefault":false,
		"focusResetOnBlur":true,
		"refocusLastActiveOnClose":false,
		"aria":
		{
			"role":"list",
			"label":ibx.resourceMgr.getString("IBX_NAV_MAP_LABEL")
		}
	},
	_widgetClass: "ibx-nav-map",
	_create:function()
	{
		this._super();
		this._sep = $("<div>").ibxMenuSeparator();
		this._navToParent = $("<div>").ibxNavMapItem({labelOptions:{text:ibx.resourceMgr.getString("IBX_NAV_MAP_UP_ON_LEVEL")}});
	},
	_onMenuItemClick:function(e)
	{
		if(this._navToParent.is(e.target))
		{
			$(this.options.navParent).ibxWidget("open");
		}
		this._super(e);
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();
		if(options.navParent)
			this._box.prepend(this._navToParent, this._sep);
		else
		{
			this._navToParent.detach();
			this._sep.detach();
		}
	}
});

//just listen for events to trigger the navigation management
function ibxNavManager()
{
	
	window.addEventListener("keydown", ibxNavManager._onKeyEvent.bind(this), true);
}

ibxNavManager.options =
{
	triggerKey:"CTRL+ALT+M",
}
ibxNavManager._onKeyEvent = function(e)
{
	if(eventMatchesShortcut(ibxNavManager.options.triggerKey, e))
	{
		var target = $(e.target);
		var navRoot = target.closest("[data-ibx-nav-map]");
		var navMap = $(navRoot.attr("data-ibx-nav-map")).ibxWidget("open").off("ibx_select").on("ibx_select", ibxNavManager._onNavItemSelected.bind(this));

		var navParent = navRoot.parents("[data-ibx-nav-map]").first();
		navMap.ibxWidget("option", "navParent", navParent.attr("data-ibx-nav-map"));
	}
};

ibxNavManager._onNavItemSelected = function(e)
{
	// var navItem = $(e.originalEvent.target);
	// var navTarget = navItem.ibxWidget("option", "navTarget");
	// //var navParent = navTarget.ibxWidget()
	// $(navTarget).focus();
	// console.log(navTarget);
};

ibx.navManager = new ibxNavManager();

//# sourceURL=navmap.ibx.js
