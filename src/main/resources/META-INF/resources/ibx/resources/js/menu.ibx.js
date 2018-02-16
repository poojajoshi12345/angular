/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	IbxMenu
******************************************************************************/
$.widget("ibi.ibxMenu", $.ibi.ibxPopup,
{
	options:
	{
		"focusRoot":false,
		"navKeyRoot":true,
		"navKeyDir":"vertical",
		"navKeyAutoFocus":true,
		"modal":false,
		"destroyOnClose":false,
		"multiSelect":false, //user can select multiple items without closing menu (checkboxes, etc.)
		"effect":"fade",
		"aria":{"role":"menu"}
	},
	_widgetClass: "ibx-menu",
	_create: function ()
	{
		this._super();
		var box = this._box = $("<div>").ibxVBox({"wrap":"false", "align":"stretch"}).addClass("ibx-menu-box");
		this.element.append(box);
		this.element.on("keydown", this._onMenuKeyDown.bind(this));
		this.element.on("ibx_menu_item_click", this._onMenuItemClick.bind(this));
		this.element.on("ibx_close_sub_menus", this.closeSubMenus.bind(this));
		this.element.children(".ibx-menu-item, .ibx-menu-separator").each(function(idx, el)
		{
			this.add(el);
		}.bind(this));
	},
	_setAccessibility:function(accessible, aria)
	{
		this._super(accessible, aria);
		return aria;
	},
	_destroy: function ()
	{
		this._super();
	},
	parentMenu:function(){return this.element.data("ibxParentMenu") || null;},
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
	_onMenuKeyDown:function(e)
	{
		if(e.keyCode == $.ui.keyCode.TAB)
			this.close();
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
			var parentMenu = this.parentMenu();
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

/******************************************************************************
	IbxMenuItem
******************************************************************************/
$.widget("ibi.ibxMenuItem", $.ibi.ibxHBox,
{
	options:
	{
		"iconPosition":"right",
		"justify":"start",
		"align":"center",
		"type":"plain",
		"markerClass":"ibx-menu-item-marker",
		"startMarkerClass":"ibx-start-marker",
		"endMarkerClass":"ibx-end-marker",
		"labelClass":"ibx-menu-item-label",
		"labelOptions":{},
		"aria":
		{
			"role":"menuitem",
			"haspopup":false
		}
	},
	_widgetClass: "ibx-menu-item",
	_create:function()
	{
		this._super();

		var options = this.options;

		//alternate to data-ibxp-text...direct text node children can be used to set the text.
		options.labelOptions.text = options.labelOptions.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		this._startMarker = $("<div>");
		this._endMarker = $("<div>");
		this._label = $("<div>").ibxLabel();

		this.element.attr("tabIndex", -1).append(this._label, this._endMarker);
		this.element.on(
		{
			"keydown":this._onMenuItemKeyEvent.bind(this),
			"click":this._onMenuItemClick.bind(this),
			"mouseenter":this._onMenuItemMouseEvent.bind(this),
			"mouseleave": this._onMenuItemMouseEvent.bind(this)
		});
		this.addSubMenu(this.element.children(".ibx-menu"));
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		aria.labelledby = aria.labelledby || this._label.prop("id");

		var subMenu = this.subMenu();
		aria.haspopup = !!subMenu;
		aria.expanded = subMenu ? subMenu.ibxWidget("isOpen") : null;

		(accessible) ? this._startMarker.attr("aria-hidden", true) : this._startMarker.removeAttr("aria-hidden");
		(accessible) ? this._endMarker.attr("aria-hidden", true) : this._endMarker.removeAttr("aria-hidden");
		return aria;
	},
	_onMenuItemKeyEvent:function(e)
	{
		if(e.keyCode == $.ui.keyCode.LEFT)//close if submenu
		{
			var menu = this.parentMenu();
			menu.ibxWidget("parentMenu") ? menu.ibxWidget("close") : null;
		}
		else
		if(e.keyCode == $.ui.keyCode.RIGHT && this.subMenu())//open if submenu
			this.element.trigger("click");
		else
		if(e.keyCode == $.ui.keyCode.ENTER || e.keyCode == $.ui.keyCode.SPACE)//activate
			this.element.trigger("click");
	},
	_onMenuItemClick:function (e)
	{
		window.clearTimeout(this._subTimer);

		//does this item have a submenu?...if so show it...otherwise handle click.
		var subMenu = this.subMenu();
		if(subMenu)
		{
			subMenu.data("ibxParentMenu", this.parentMenu());
			subMenu.ibxMenu({destroyOnClose: false, position:{of: this.element, at:"right top", my:"left top"}}).ibxMenu("open");
		}
		else
		{
			this.refresh();
			this._trigger("menu_item_click", e, this.element);//bubble click event to owner menu.
			this.doCommandAction("trigger");
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
	parentMenu:function(){return this.element.parents(".ibx-menu").first() || null},
	subMenu:function(){return this.element.data("ibxSubMenu");},
	addSubMenu:function(subMenu)
	{
		this.removeSubMenu();
		if(subMenu && subMenu.length)
		{
			this.element.data("ibxSubMenu", subMenu);
			subMenu.appendTo(this.element);
			subMenu.on("ibx_open ibx_close", this._onSubMenuOpenClose.bind(this))
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
			subMenu.detach().off("ibx_open ibx_close").removeData("ibxParentMenu");
			this.refresh();
		}
	},
	closeSubMenu:function(closeData)
	{
		var subMenu = this.subMenu();
		if(subMenu && subMenu.is(":openPopup"))
			subMenu.ibxMenu("close", closeData);
	},
	_onSubMenuOpenClose:function(e)
	{
		this.setAccessibility();
	},
	_refresh:function()
	{
		this._super();

		var options = this.options;
		this._startMarker.addClass(sformat("{1} {2}", options.markerClass, options.startMarkerClass));
		this._label.addClass(options.labelClass);
		this._endMarker.addClass(sformat("{1} {2}", options.markerClass, options.endMarkerClass));
		this._endMarker.toggleClass("ibx-marker-sub", !!this.subMenu());

		//setup the command shortcut key for the menu item
		var cmd = this.getCommand();
		var scut = cmd ? cmd.ibxWidget("option", "shortcut") : null;
		this._endMarker.text(scut).toggleClass("ibx-end-marker-cmd-shortcut", !!cmd);

		//set the label's options...if there's no start marker (not check or radio) and no glyph...add space for glyph.
		var labelOptions = options.labelOptions;
		this._label.ibxLabel("option", labelOptions);
	}
});

/******************************************************************************
	IbxCheckMenuItem
******************************************************************************/
$.widget("ibi.ibxCheckMenuItem", $.ibi.ibxMenuItem,
{
	options:
	{
		"type":"check",
		"checked":false,
		"aria":
		{
			"role":"menuitemcheckbox",
			"checked":false
		}
	},
	_widgetClass: "ibx-menu-item-check",
	_create:function()
	{
		this._super();
		this.element.prepend(this._startMarker).addClass("ibx-can-toggle");
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		aria.checked = this.options.checked;
		return aria;
	},
	_onMenuItemClick:function(e)
	{
		this.option("checked", !this.options.checked);
		this._super(e);
	},
	checked:function(checked)
	{
		if(checked === undefined)
			return this.options.checked;
		this.option("checked", checked);
	},
	_setOption:function(key, value)
	{
		var changed = this.options[key] != value;
		this._super(key, value);
		if(key == "checked" && changed)
		{
			this._trigger("change", null, this.element);
			this.doCommandAction("checked", value);
		}
	},
	_refresh:function()
	{
		var options = this.options;
		this._startMarker.removeClass("ibx-marker-uncheck ibx-marker-check");
		this._startMarker.addClass(options.checked ? "ibx-marker-check" : "ibx-marker-uncheck");
		this._super();
	}
});

/******************************************************************************
	IbxRadioMenuItem
******************************************************************************/
$.widget("ibi.ibxRadioMenuItem", $.ibi.ibxCheckMenuItem,
{
	options:
	{
		"group":"",
		"aria":{"role":"menuitemradio"}
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
$.widget("ibi.ibxMenuSeparator", $.ibi.ibxWidget,{options:{"aria":{"role":"separator"}},_widgetClass: "ibx-menu-separator",});

/******************************************************************************
	ibxMenuBar
	Simple derivation of ibxHBox/ibxVBox...mostly for markup readability
******************************************************************************/
$.widget("ibi.ibxMenuBar", $.ibi.ibxHBox,
{
	"options":
	{
		"navKeyRoot":true,
		"navKeyAutoFocus":true,
		"direction":"row",
		"align":"stretch",
		"aria":
		{
			"role":"menubar",
			"orientation":"horizontal"
		}
	},
	_widgetClass:"ibx-menu-bar",
	_create:function()
	{
		this._super();
	},
	_refresh:function()
	{
		this._super();
		this.children(".ibx-menu-button").attr("tabIndex", -1);
	}
});
$.widget("ibi.ibxHMenuBar", $.ibi.ibxMenuBar, {options:{direction:"row"}, _widgetClass:"ibx-hmenu-bar"});
$.widget("ibi.ibxVMenuBar", $.ibi.ibxMenuBar, {options:{direction:"column", aria:{orientation:"vertical"}, "navKeyDir":"vertical"}, _widgetClass:"ibx-vmenu-bar"});

/******************************************************************************
	ibxMenuButton
	Let's you define a button that will show a menu
******************************************************************************/
$.widget("ibi.ibxMenuButton", $.ibi.ibxButtonSimple,
{
	options:
	{
		"menu":null,
		"menuOpen":false,
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
		"aria":
		{
			"role":"menuitem",
			"haspopup":false
		}
	},
	_widgetClass: "ibx-menu-button",
	_create:function()
	{
		this._super();
		this.options.position.of = this.element[0];
		this.element.on({"click": this._onMenuButtonMouseEvent.bind(this), "keyup": this._onMenuButtonKeyEvent.bind(this)});
		this.options.menu = this.element.children(".ibx-menu");
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		aria.haspopup = !!this.options.menu.length;
		aria.expanded = this.options.menuOpen;
		return aria;
	},
	_onMenuButtonMouseEvent:function(e)
	{
		//[HOME-584]...my bad.
		var options = this.options;
		var event = $.Event(e.origionalEvent);
		event.type = "ibx_click";
		this.element.trigger(event);
		var menu = event.menu || options.menu;
		$(menu).ibxWidget("option", {position:options.position}).ibxWidget("open");
	},
	_onMenuButtonKeyEvent:function(e)
	{
		//other keys - enter/space will trigger the click as a normal button will.
		if(e.keyCode == $.ui.keyCode.DOWN)
			this.element.trigger("click");
	},
	_onMenuButtonMenuOpenClose:function(e)
	{
		this.options.menuOpen = (e.type == "ibx_open");
		this.setAccessibility();
	},
	_refresh:function()
	{
		$(this.options.menu).off("ibx_open ibx_close");
		this.options.menu = $(this.options.menu);
		this.options.menu.on("ibx_open ibx_close", this._onMenuButtonMenuOpenClose.bind(this));
		this._super();
	}
});
//defined types mostly for markup readability
$.widget("ibi.ibxHMenuButton", $.ibi.ibxMenuButton,{options:{},_widgetClass: "ibx-hmenu-button"});
$.widget("ibi.ibxVMenuButton", $.ibi.ibxMenuButton,
{
	options:{position:{at:"right top"}},
	_widgetClass: "ibx-vmenu-button",
	_onMenuButtonKeyEvent:function(e)
	{
		if(e.keyCode == $.ui.keyCode.RIGHT)
			this.element.trigger("click");
	}
});

$.widget("ibi.ibxSplitMenuButton", $.ibi.ibxButtonSimple,
{
	options:
	{
		"class":"split-button",
		"defaultMenuItem":null,
		"align":"center",
		"menuOptions":
		{
			"class":"split-menu",
			"justify":"center",
			"position":
			{
				"my":"left top",
				"at":"left bottom",
			}
		},
		"aria":
		{
			"role":"button",
			"haspopup":true
		}
	},
	_widgetClass:"ibx-split-menu-button",
	_create:function()
	{
		this._super();
		var options = this.options;

		options.menuOptions.position.of = this.element;
		var menu = this.element.children(".ibx-menu");
		var menuBtn = this._menuBtn = $("<div>").append(menu).ibxMenuButton().on("mousedown click", this._onMenuButtonMouseEvent.bind(this));
		var separator = this._separator = $("<div class='split-separator'>");
		this.element.append(separator, menuBtn).on({"click":this._onBtnClick.bind(this), "keyup":this._onBtnKeyEvent.bind(this)});
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
	_onBtnKeyEvent:function(e)
	{
		if(e.keyCode == $.ui.keyCode.DOWN)
			this._menuBtn.trigger("click");
	},
	_onMenuButtonMouseEvent:function(e)
	{
		if(e.type == "mousedown")
		{
			var menu = this._menuBtn.ibxWidget("option", "menu");
			menu.css("minWidth", this.element.css("width"));
		}
		if(e.type == "click")
			e.stopPropagation();
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
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
$.widget("ibi.ibxMenuButtonSeparator", $.ibi.ibxWidget,{options:{"aria":{"role":"separator"}},_widgetClass: "ibx-menu-button-separator",});


//# sourceURL=menu.ibx.js

