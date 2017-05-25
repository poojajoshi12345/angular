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
		effect:"fade"
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
	remove:function(menuItem, refresh)
	{
		this._box.ibxWidget("remove", menuItem, refresh);
	},
	_onMenuItemClick:function(e, menuItem)
	{
		//trigger the event on this menu, then bubble to parent menus. Prevent default will stop menu from closing.
		if(this._trigger("select", e, menuItem))
		{
			//close if desired.
			if(this.options.autoClose)
				this.close();
		
			//bubble event up owner chain.
			var parentMenu = this.element.data("ibxParentMenu");
			if(parentMenu)
				parentMenu.trigger(e, menuItem);
		}
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
	refresh: function ()
	{
		this._super();
	}
});
$.ibi.ibxMenu.statics = 
{
};

/******************************************************************************
	IbxContextMenu
	Just a menu that is always a child of the body when open, and puts
	itself back under it's DOM parent when closed.
******************************************************************************/
$.widget("ibi.ibxContextMenu", $.ibi.ibxMenu,
{
	_widgetClass: "ibx-context-menu",
	open:function(openInfo)
	{
		this.element.data("ibxMenuParent", $(this.element.parent()));
		this.element.appendTo("body");
		this._super(openInfo);
	},
	close:function(openInfo)
	{
		this.element.appendTo(this.element.data("ibxMenuParent"));
		this.element.removeData("ibxMenuParent");
		this._super(openInfo);
	}
});
$.ibi.ibxContextMenu.statics = 
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
		labelOptions:
		{
			justify:"start"
		},

		optionsMap:
		{
			text:"labelOptions.text",
			icon:"labelOptions.icon",
			glyph:"labelOptions.glyph",
			glyphClasses:"labelOptions.glyphClasses",
		},
	},
	_widgetClass: "ibx-menu-item",
	_create:function()
	{
		var options = this.options;
		this._startMarker = $("<div>");
		this._endMarker = $("<div>");
		this._label = $("<div>").ibxLabel();
		this.element.append(this._startMarker, this._label, this._endMarker);
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
			subMenu.detach().off("ibx_close").removeData("ibxParentMenu");
		this.element.removeData("ibxSubMenu");
		this.refresh();
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
		this.refresh();
	},
	userValue:function()
	{
		return this.options.userValue;
	},
	refresh:function()
	{
		this._super();
		var options = this.options;

		this._endMarker.removeClass("ibx-marker-sub");
		if(this.subMenu())
			this._endMarker.addClass("ibx-marker-sub");

		this._startMarker.addClass(sformat("{1} {2}", options.markerClass, options.startMarkerClass));
		this._label.addClass(options.labelClass);
		this._endMarker.addClass(sformat("{1} {2}", options.markerClass, options.endMarkerClass));

		options.labelOptions.text = options.text || options.labelOptions.text;
		this._label.ibxLabel("option", options.labelOptions);
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
	_onMenuItemClick:function(e)
	{
		var options = this.options;
		options.checked = !options.checked;
		this._super(e);
		this._trigger("change", e, this.element);
	},
	refresh:function()
	{
		this._super();
		var options = this.options;
		this._startMarker.removeClass("ibx-marker-uncheck ibx-marker-check");
		this._startMarker.addClass(options.checked ? "ibx-marker-check" : "ibx-marker-uncheck");
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
	refresh:function()
	{
		this._super();
		var options = this.options;

		this._startMarker.removeClass("ibx-marker-radio-uncheck ibx-marker-radio-check");
		this._startMarker.addClass(options.checked ? "ibx-marker-radio-check" : "ibx-marker-radio-uncheck");
	}
});
$.ibi.ibxRadioMenuItem.statics = 
{
};

/******************************************************************************
	jibxMenuSeparator
	Just a utility widget for handling a menu separator...really just sets the class on the div.
******************************************************************************/
$.widget("ibi.ibxMenuSeparator", $.ibi.ibxWidget,{options:{},_widgetClass: "ibx-menu-separator",});

/******************************************************************************
	ibxMenuBar
	Simple derivation of ibxHBox...really just for readability
******************************************************************************/
$.widget("ibi.ibxHMenuBar", $.ibi.ibxHBox, {options:{align:"stretch"}, _widgetClass:"ibx-hmenu-bar"});

/******************************************************************************
	ibxMenuButton
	Let's you define a button that will show a menu
******************************************************************************/
$.widget("ibi.ibxMenuButton", $.ibi.ibxButtonSimple,
{
	options:
	{
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

		"optionsMap":
		{
			"posMy":"position.my",
			"posAt":"position.at",
			"posOf":"position.of",
			"posCollision":"position.collision",
			"posUsing":"position.using",
			"posWithin":"position.within"
		}		
	},
	_widgetClass: "ibx-menu-button",
	_create:function()
	{
		this._super();
		this.options.position.of = this.element[0];
		this.element.prop("tabIndex", 0).on("click", this._onClick.bind(this));
		this.menu(this.element.children(".ibx-menu"));
	},
	_onClick:function(e)
	{
		if(this._menu)
			this._menu.ibxWidget("open");
	},
	_menu:null,
	menu:function(menu)
	{
		if(!menu)
			return this._menu;
		else
			this._menu = menu;
	},
	refresh:function()
	{
		this._super();
		var options = this.options;
		if(this._menu)
			this._menu.ibxWidget("option", {destroOnClose:false,position:options.position});
	}
});

$.widget("ibi.ibxMenuButtonSeparator", $.ibi.ibxWidget,{options:{},_widgetClass: "ibx-menu-button-separator",});



//# sourceURL=menu.ibx.js

