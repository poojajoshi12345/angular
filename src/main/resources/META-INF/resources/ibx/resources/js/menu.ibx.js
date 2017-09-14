/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	IbxMenu
******************************************************************************/
$.widget("ibi.ibxMenu", $.ibi.ibxPopup,
{
	options:
	{
		modal:false,
		destroyOnClose:false,
		multiSelect:false, //user can select multiple items without closing menu (checkboxes, etc.)
		effect:"fade",
	},
	_widgetClass: "ibx-menu",
	_create: function ()
	{
		this._super();
		var box = this._box = $("<div>").ibxVBox({ wrap: false, align:"stretch" }).addClass(".ibx-menu-box");
		this.element.append(box);
		this.element.on("ibx_menu_item_click", this._onMenuItemClick.bind(this));
		this.element.on("ibx_close_sub_menus", this.closeSubMenus.bind(this));
		this.element.children(".ibx-menu-item, .ibx-menu-separator").each(function(idx, el)
		{
			this.add(el);
		}.bind(this));
	},
	_destroy: function ()
	{
		this._super();
	},
	children:function(selector)
	{
		selector = selector || ".ibx-menu-item, .ibx-menu-separator";
		return this._box.children(selector);
	},
	add:function(menuItem, sibling, before, refresh)
	{
		this._box.ibxWidget("add", menuItem, sibling, before, refresh);
	},
	remove:function(menuItem, destroy, refresh)
	{
		this._box.ibxWidget("remove", menuItem, destroy, refresh);
	},
	_onMenuItemClick:function(e, menuItem)
	{
		//trigger the event on this menu, then bubble to parent menus. Prevent default will stop menu from closing.
		if(this._trigger("select", e, menuItem))
		{
			//close if desired.
			if(this.options.autoClose && !this.options.multiSelect)
				this.close();
		
			//bubble event up owner chain.
			var parentMenu = this.element.data("ibxParentMenu");
			if(parentMenu)
				parentMenu.trigger(e, menuItem);
		}
	},
	open:function(openInfo)
	{
		this._super(openInfo)
	},
	close:function(closeData)
	{
		this.closeSubMenus(null, closeData);
		this._super(closeData);
	},
	closeSubMenus:function(e, closeData)
	{
		this._box.children(".ibx-menu-item:hasSubMenu").ibxWidget("closeSubMenu", closeData);
	},
	_refresh: function ()
	{
		this._super();
	}
});
$.ibi.ibxMenu.statics = 
{
};

/******************************************************************************
	IbxMenuItem
******************************************************************************/
$.widget("ibi.ibxMenuItem", $.ibi.ibxHBox,
{
	options:
	{
		iconPosition:"right",
		justify:"start",
		align:"center",
		type:"plain",
		markerClass:"ibx-menu-item-marker",
		startMarkerClass:"ibx-start-marker",
		endMarkerClass:"ibx-end-marker",
		labelClass:"ibx-menu-item-label",
		labelOptions:{},
	},
	_widgetClass: "ibx-menu-item",
	_create:function()
	{
		var options = this.options;

		//alternate to data-ibxp-text...direct text node children can be used to set the text.
		options.labelOptions.text = options.labelOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		this._startMarker = $("<div>");
		this._endMarker = $("<div>");
		this._label = $("<div>").ibxLabel();

		this.element.append(this._label, this._endMarker);
		this.element.prop("tabIndex", 0).on(
		{
			"click":this._onMenuItemClick.bind(this),
			"mouseenter":this._onMenuItemMouseEvent.bind(this),
			"mouseleave": this._onMenuItemMouseEvent.bind(this),
			"keydown": this._onMenuItemKeyEvent.bind(this)
		});
		this.addSubMenu(this.element.children(".ibx-menu"));
		this._super();
	},
	_onMenuItemKeyEvent: function (e)
	{
		var menuItem = $(e.target);
		if (e.keyCode == 37 || e.keyCode == 38)//left/up
			menuItem.prevAll(":ibxFocusable").first().focus();
		else
		if (e.keyCode == 39 || e.keyCode == 40)//right/down
			menuItem.nextAll(":ibxFocusable").first().focus();
		else
		if (e.keyCode == 13 || e.keyCode == 32)//enter/space
			menuItem.trigger("click");

		if (e.keyCode != 9)
			e.preventDefault();
	},
	_onMenuItemClick: function (e)
	{
		window.clearTimeout(this._subTimer);

		//does this item have a submenu?...if so show it...otherwise handle click.
		var subMenu = this.subMenu();
		if(subMenu)
		{
			subMenu.data("ibxParentMenu", this.element.closest(".ibx-menu"));
			subMenu.appendTo(document.body).ibxMenu({destroyOnClose: false, position:{of: this.element, at:"right top", my:"left top"}}).ibxMenu("open");
		}
		else
		{
			this.refresh();
			this._trigger("menu_item_click", e, this.element);//bubble click event to owner menu.
		}
	},
	_subTimer:null,
	_onMenuItemMouseEvent:function(e)
	{
		window.clearTimeout(this._subTimer);
		if(e.type == "mouseenter")
		{
			this._subTimer = window.setTimeout(function()
			{
				this._trigger("close_sub_menus", null, this.element);
				if(this.subMenu())
					this._onMenuItemClick();
			}.bind(this), 100);
		}
		e.stopPropagation();
	},
	menu:function(){return this.element.closest(".ibx-menu");},
	subMenu:function(){return this.element.data("ibxSubMenu");},
	addSubMenu:function(subMenu)
	{
		this.removeSubMenu();
		if(subMenu && subMenu.length)
		{
			this.element.data("ibxSubMenu", subMenu);
			subMenu.appendTo(this.element);
			subMenu.on("ibx_close", this._onSubMenuClose.bind(this))
			this.refresh();
		}
	},
	removeSubMenu:function()
	{
		this.closeSubMenu();
		var subMenu = this.subMenu();
		if(subMenu)
		{
			this.element.removeData("ibxSubMenu");
			subMenu.detach().off("ibx_close").removeData("ibxParentMenu");
			this.refresh();
		}
	},
	closeSubMenu:function(closeData)
	{
		var subMenu = this.subMenu();
		if(subMenu && subMenu.is(":openPopup"))
			subMenu.ibxMenu("close", closeData);
	},
	_onSubMenuClose:function(e)
	{
		//on close put it back under this menuitem so it's a submenu again.
		var subMenu = this.subMenu();
		this.element.append(subMenu);
	},
	userValue:function()
	{
		return this.options.userValue;
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;

		this._startMarker.addClass(sformat("{1} {2}", options.markerClass, options.startMarkerClass));
		this._label.addClass(options.labelClass);
		this._endMarker.addClass(sformat("{1} {2}", options.markerClass, options.endMarkerClass));
		this._endMarker.toggleClass("ibx-marker-sub", !!this.subMenu());

		//set the label's options...if there's no start marker (not check or radio) and no glyph...add space for glyph.
		var labelOptions = options.labelOptions;
		this._label.ibxLabel("option", labelOptions);
	}
});
$.ibi.ibxMenuItem.statics = 
{
};

/******************************************************************************
	IbxCheckMenuItem
******************************************************************************/
$.widget("ibi.ibxCheckMenuItem", $.ibi.ibxMenuItem,
{
	options:
	{
		type:"check",
		checked:false,
	},
	_widgetClass: "ibx-menu-item-check",
	_create:function()
	{
		this._super();
		this.element.prepend(this._startMarker);
	},
	_onMenuItemClick:function(e)
	{
		var options = this.options;
		options.checked = !options.checked;
		this._super(e);
		this._trigger("change", e, this.element);
	},
	_refresh:function()
	{
		var options = this.options;
		this._startMarker.removeClass("ibx-marker-uncheck ibx-marker-check");
		this._startMarker.addClass(options.checked ? "ibx-marker-check" : "ibx-marker-uncheck");
		this._super();
	}
});
$.ibi.ibxCheckMenuItem.statics = 
{
};

/******************************************************************************
	IbxRadioMenuItem
******************************************************************************/
$.widget("ibi.ibxRadioMenuItem", $.ibi.ibxCheckMenuItem,
{
	options:
	{
		group:""
	},
	_widgetClass: "ibx-menu-item-radio",
	_create:function()
	{
		this._super();
	},
	_init:function()
	{
		this._super();
		var groups = $(sformat(":ibxRadioGroup({1})", this.options.group));
		groups.ibxRadioGroup("addControl", this.element);
	},
	getValue:$.noop,
	checked:function(checked)
	{
		var options = this.options;
		if(typeof(checked) === "undefined")
			return this.options.checked;
		else
		if(checked != options.checked)
		{
			options.checked = checked;
			this.refresh();
			return this;
		}
	},
	_refresh:function()
	{
		var options = this.options;
		this._startMarker.removeClass("ibx-marker-radio-uncheck ibx-marker-radio-check");
		this._startMarker.addClass(options.checked ? "ibx-marker-radio-check" : "ibx-marker-radio-uncheck");
		this._super();
	}
});
$.ibi.ibxRadioMenuItem.statics = 
{
};

/******************************************************************************
	ibxMenuSeparator
	Just a utility widget for handling a menu separator...really just sets the class on the div.
******************************************************************************/
$.widget("ibi.ibxMenuSeparator", $.ibi.ibxWidget,{options:{},_widgetClass: "ibx-menu-separator",});

/******************************************************************************
	ibxMenuBar
	Simple derivation of ibxHBox/ibxVBox...mostly for markup readability
******************************************************************************/
$.widget("ibi.ibxMenuBar", $.ibi.ibxHBox, {options:{align:"stretch"}, _widgetClass:"ibx-menu-bar"});
$.widget("ibi.ibxHMenuBar", $.ibi.ibxMenuBar, {options:{}, _widgetClass:"ibx-hmenu-bar"});
$.widget("ibi.ibxVMenuBar", $.ibi.ibxMenuBar, {options:{direction:"column"}, _widgetClass:"ibx-vmenu-bar"});

/******************************************************************************
	ibxMenuButton
	Let's you define a button that will show a menu
******************************************************************************/
$.widget("ibi.ibxMenuButton", $.ibi.ibxButtonSimple,
{
	options:
	{
		"menu":null,
		"position":
		{
			/* for my/at position values see: http://api.jqueryui.com/position/ */
			"my":"left top",
			"at":"left bottom",
			"of":null,
			"collision":"flip",
			"using":null,
			"within":null,
		},
	},
	_widgetClass: "ibx-menu-button",
	_create:function()
	{
		this._super();
		this.options.position.of = this.element[0];
		this.element.on("click", this._onClick.bind(this));
		this.options.menu = this.element.children(".ibx-menu").appendTo("body");
	},
	_onClick:function(e)
	{
		var options = this.options;
		var event = $.Event(e.origionalEvent);
		event.type = "ibx_click";
		this.element.trigger(event);
		var menu = event.menu || options.menu;
		$(menu).ibxWidget("option", {position:options.position}).ibxWidget("open");
	},
	_refresh:function()
	{
		this._super();
	}
});
//defined types mostly for markup readability
$.widget("ibi.ibxHMenuButton", $.ibi.ibxMenuButton,{options:{},_widgetClass: "ibx-hmenu-button"});
$.widget("ibi.ibxVMenuButton", $.ibi.ibxMenuButton,{options:{position:{at:"right top"}},_widgetClass: "ibx-vmenu-button"});


$.widget("ibi.ibxSplitMenuButton", $.ibi.ibxHBox,
{
	options:
	{
		"defaultMenuItem":null,
		"align":"stretch",
		"btnOptions":
		{
			"class":"split-button",
			"defaultItem":null,
		},
		"menuOptions":
		{
			"class":"split-menu",
			"justify":"center",
			"position":
			{
				"my":"left top",
				"at":"left bottom",
			}
		}
	},
	_widgetClass:"ibx-split-menu-button",
	_create:function()
	{
		this._super();
		var options = this.options;

		//alternate to data-ibxp-text...direct text node children can be used to set the text.
		options.btnOptions.text = options.btnOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");
		var btn = this._btn = $("<div>").ibxButtonSimple().on("click", this._onBtnClick.bind(this));

		options.menuOptions.menu = this.element.children(".ibx-menu");
		options.menuOptions.position.of = this.element;
		var menu = this._menuBtn = $("<div>").ibxMenuButton().on("click", this._onMenuBtnClick.bind(this));

		var separator = this._separator = $("<div class='split-separator'>");

		this.element.append(btn, separator, menu);
		options.menuOptions.menu.appendTo("body");
	},
	_onBtnClick:function(e)
	{
		var event = $.Event(e.origionalEvent);
		event.type = "ibx_click";
		this.element.trigger(event);

		var menu = event.menu || this._menuBtn.ibxWidget("option", "menu");
		var defItem = menu.ibxWidget("children", ".ibx-split-button-default-item");
		defItem.trigger("click");
	},
	_onMenuBtnClick:function(e)
	{
		var menu = this._menuBtn.ibxWidget("option", "menu");
		menu.css("minWidth", this.element.css("width"));
		e.stopPropagation();
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		this._btn.ibxWidget("option", options.btnOptions);
		this._menuBtn.ibxWidget("option", options.menuOptions);

		var menu = this._menuBtn.ibxWidget("option", "menu");
		menu.css("minWidth", this.element.css("width"));

		var menuItems = menu.ibxWidget("children");
		menuItems.removeClass("ibx-split-button-default-item").filter(options.defaultMenuItem).addClass("ibx-split-button-default-item");
	}
});
//defined types mostly for markup readability
$.widget("ibi.ibxHSplitMenuButton", $.ibi.ibxSplitMenuButton,{options:{},_widgetClass: "ibx-hsplit-menu-button"});
$.widget("ibi.ibxVSplitMenuButton", $.ibi.ibxSplitMenuButton,{options:{menuOptions:{position:{my:"left top", at:"right top"}}},_widgetClass: "ibx-vsplit-menu-button"});

//separator between menu buttons
$.widget("ibi.ibxMenuButtonSeparator", $.ibi.ibxWidget,{options:{},_widgetClass: "ibx-menu-button-separator",});


//# sourceURL=menu.ibx.js

