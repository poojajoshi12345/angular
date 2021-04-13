/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.8 $:

//sub classes of menu things to use for navigation mapping
$.widget("ibi.ibxNavMapItem", $.ibi.ibxMenuItem,{options:{navTarget:null, aria:{role:"listitem"}}, _widgetClass: "ibx-nav-map-item"});
$.widget("ibi.ibxNavMap", $.ibi.ibxMenu,
{
	options:
	{
		"navParent":null,
		"aria":
		{
			"role":"list",
		}
	},
	_widgetClass: "ibx-nav-map",
	_create:function()
	{
		this._super();
		this._sep = $("<div>").ibxMenuSeparator();
		this._navToParentItem = $("<div>").ibxNavMapItem({labelOptions:{text:ibx.resourceMgr.getString("IBX_NAV_MAP_UP_ON_LEVEL")}});
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		aria.label = !this.parentMenu() ? ibx.resourceMgr.getString("IBX_NAV_MAP_LABEL") : null;
		return aria;
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
			//figure out the proper document (for iframes), and target to navigate to.
			var target = $(e.target);
			var navTarget = target.ibxWidget("option", "navTarget");
			var navFrame = $(target.ibxWidget('option', 'navFrame'));
			var navWnd = window;
			var navDoc = document;
			if(navFrame){
				try{ 
					if(navFrame.is('.ibx-iframe')){
						navDoc = navFrame.ibxWidget('contentDocument');
						navWnd = navFrame.ibxWidget('contentWindow');
					}
					else if(navFrame.is('iframe')){
						navDoc = navFrame.prop('contentDocument');
						navWnd = navFrame.prop('contentWindow');
					}
				}catch(ex){
					console.warn('[ibxNavMap] ' + ex.message);
				}
			}

			$(navTarget, navDoc).focus(); //do the focusing

			//now, if requested, evaluate the runtime target for focusing in context of the proper frame.
			target = target.ibxWidget("option", "evalTarget");
			if(target && navWnd){
				target = navWnd.eval(target);
				$(target, navDoc).focus();
			}
		}
		this._super(e);
	},
	close:function(closeInfo)
	{
		this.options.refocusLastActiveOnClose = (closeInfo !==  "menu_item_click");
		this._super(closeInfo);
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();

		var modal = $(options.navRoot).closest(".pop-modal"); //modal's can't navigate to parent navMap.
		var navParent = options.navParent = $(options.navRoot).parents("[data-ibx-nav-map]").first().attr("data-ibx-nav-map");
		if(!modal.length && navParent)
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
		var modal = $(e.target).closest('.pop-modal');//find closest modal popup and stop there.
		var navRoot = target.closest("[data-ibx-nav-map]", modal[0]);
		$(navRoot.attr("data-ibx-nav-map")).ibxWidget("option", {"navRoot":navRoot}).ibxWidget("open");
	}
};
ibx.navManager = new ibxNavManager();

//# sourceURL=navmap.ibx.js
