/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.8 $:

//sub classes of menu things to use for navigation mapping
$.widget("ibi.ibxNavMapItem", $.ibi.ibxMenuItem,{options:{navTarget:null, aria:{role:"listitem"}}, _widgetClass: "ibx-nav-map-item"});
$.widget("ibi.ibxNavMap", $.ibi.ibxMenu,
{
	options:
	{
		"navParent":null,
		"navTarget":null,
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
		this._navToParentItem = $("<div>").ibxNavMapItem({labelOptions:{text:ibx.resourceMgr.getString("IBX_NAV_MAP_UP_ON_LEVEL")}});
	},
	_onMenuItemClick:function(e)
	{
		if(this._navToParentItem.is(e.target))
		{
			//have to chain the previously active element so it can be focused if the parent is closed via escape.
			//then open the new parent navmap.
			var parentMap = $(this.options.navParent);
			parentMap.ibxWidget("open").ibxWidget('instance')._elPrevActive = this._elPrevActive;

		}
		else
		{
			var target = $(e.target).ibxWidget("option", "navTarget");
			if(target)
				$(target).focus();

			target = $(e.target).ibxWidget("option", "evalTarget");
			if(target){
				target = eval(target);
				$(target).focus();
			}
		}
		this._super(e);
	},
	close:function(closeInfo)
	{
		this.options.refocusLastActiveOnClose = (closeInfo == "cancel");
		this._super(closeInfo);
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();

		var navParent = options.navParent = $(options.navRoot).parents("[data-ibx-nav-map]").first().attr("data-ibx-nav-map");
		if(navParent)
			this._box.prepend(this._navToParentItem, this._sep);
		else
		{
			this._navToParentItem.detach();
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
	triggerKey:"CTRL+SHIFT+F10",
}
ibxNavManager._onKeyEvent = function(e)
{
	if(eventMatchesShortcut(ibxNavManager.options.triggerKey, e))
	{
		var target = $(e.target);
		var navRoot = target.closest("[data-ibx-nav-map]");
		$(navRoot.attr("data-ibx-nav-map")).ibxWidget("option", {"navRoot":navRoot}).ibxWidget("open");
	}
};
ibx.navManager = new ibxNavManager();

//# sourceURL=navmap.ibx.js
