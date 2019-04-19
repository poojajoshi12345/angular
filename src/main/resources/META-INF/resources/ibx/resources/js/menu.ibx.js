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
		"focusDefault":true,
		"navKeyRoot":true,
		"navKeyDir":"vertical",
		"modal":false,
		"destroyOnClose":false,
		"multiSelect":false, //user can select multiple items without closing menu (checkboxes, etc.)
		"effect":"menu",
		"aria":{"role":"menu"}
	},
	_widgetClass: "ibx-menu",
	_create: function ()
	{
		this._super();
		var box = this._box = $("<div>").ibxVBox({"wrap":"false", "align":"stretch"}).ibxAddClass("ibx-menu-box");
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
		this._super(openInfo);
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
$.ibi.ibxPopup.statics.effect.menu = "pop-effect-menu";//NOT CURRENTLY USED - add custom menu display effect

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
		this.addSubMenu(this.element.children(".ibx-popup"));
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);

		var subMenu = this.subMenu();
		aria.haspopup = !!subMenu;
		aria.expanded = subMenu ? subMenu.ibxWidget("isOpen") : null;

		(accessible) ? this._startMarker.attr("aria-hidden", true) : this._startMarker.removeAttr("aria-hidden");
		(accessible) ? this._endMarker.attr("aria-hidden", true) : this._endMarker.removeAttr("aria-hidden");
		return aria;
	},
	_destroy:function()
	{
		this._startMarker.remove();
		this._endMarker.remove();
		this._label.remove();
		this._super();
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
		{
			this.element.trigger("click");
			e.preventDefault();//stops body from doing weird scrolling
		}
	},
	_onMenuItemClick:function (e)
	{
		window.clearTimeout(this._subTimer);

		//does this item have a submenu?...if so show it...otherwise handle click.
		var subMenu = this.subMenu();
		if(subMenu)
		{
			subMenu.data("ibxParentMenu", this.parentMenu());
			subMenu.ibxWidget("option", {destroyOnClose: false, position:{of: this.element, at:"right top", my:"left top", collision:"flip fit"}}).ibxWidget("open");
		}
		else
		{
			this.refresh();
			this._trigger("menu_item_click", e, this.element);//bubble click event to owner menu.
			this.doCommandAction("trigger");
		}

		//stop this from bubbling, as menus can be stored under other objects, and a click on the menu item should not be
		//confused with a click on the parent...have to check for 'e' because this can be called directly without an event.
		if(e)
			e.stopPropagation();
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
	text:function(text)
	{
		return this.option("text", text);
	},
	parentMenu:function(){return this.element.parents(".ibx-menu").first() || null;},
	subMenu:function()
	{
		var subMenu = this.element.data("ibxSubMenu");
		return subMenu || null;//can't return undefined, because jQueryUI will make that return 'this.element'
	},
	addSubMenu:function(subMenu)
	{
		this.removeSubMenu();
		subMenu = $(subMenu);
		if(subMenu.is(".ibx-popup"))
		{
			this.element.data("ibxSubMenu", subMenu);
			subMenu.appendTo(this.element);
			subMenu.on("ibx_open ibx_close", this._onSubMenuOpenClose.bind(this));
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
			subMenu.ibxWidget("close", closeData);
	},
	_onSubMenuOpenClose:function(e)
	{
		this.setAccessibility();
	},
	option:function(key, value, refresh)
	{
		if(key == "text" && !value)
			return this._label.ibxWidget("option", "text");
		return this._superApply(arguments);
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		if(key == "text")
		{
			if(value)
				options.labelOptions.text = value;
		}
		this._super(key, value);
	},
	_refresh:function()
	{
		this._super();

		var options = this.options;
		this._startMarker.ibxAddClass(sformat("{1} {2}", options.markerClass, options.startMarkerClass));
		this._label.ibxAddClass(options.labelClass);
		this._endMarker.ibxAddClass(sformat("{1} {2}", options.markerClass, options.endMarkerClass));
		this._endMarker.ibxToggleClass("ibx-marker-sub", !!this.subMenu());

		//setup the command shortcut key for the menu item
		var cmd = this.getCommand();
		var scut = cmd ? cmd.ibxWidget("option", "shortcut") : null;
		this._endMarker.text(scut).ibxToggleClass("ibx-end-marker-cmd-shortcut", !!cmd);

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
		this.element.prepend(this._startMarker).ibxAddClass("ibx-can-toggle");
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		aria.checked = this.options.checked;
		aria.selected = this.options.checked;
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
		this.element.toggleClass("checked", options.checked);
		this._startMarker.ibxRemoveClass("ibx-marker-uncheck ibx-marker-check");
		this._startMarker.ibxAddClass(options.checked ? "ibx-marker-check" : "ibx-marker-uncheck");
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
	_destroy:function()
	{
		$.ibi.ibxRadioGroup.removeControl(this.options.group, this.element[0]);
		this._super();
	},
	_init:function()
	{
		this._super();
		$.ibi.ibxRadioGroup.addControl(this.options.group, this.element[0]);
	},
	_onMenuItemClick:function(e)
	{
		/*call menu item click if radio button already selected*/	
		if(this.options.disabled || this.options.group && this.options.checked)
			$.ibi.ibxMenuItem.prototype._onMenuItemClick.call(this, e);
		else
			this._super(e);
	},
	getValue:$.noop,
	_refresh:function()
	{
		var options = this.options;
		this._startMarker.ibxRemoveClass("ibx-marker-radio-uncheck ibx-marker-radio-check");
		this._startMarker.ibxAddClass(options.checked ? "ibx-marker-radio-check" : "ibx-marker-radio-uncheck");
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
$.widget("ibi.ibxMenuSeparator", $.ibi.ibxWidget,{options:{"aria":{"role":"separator", "hidden":true}},_widgetClass: "ibx-menu-separator",});

/******************************************************************************
	ibxMenuBar
	Simple derivation of ibxHBox/ibxVBox...mostly for markup readability
******************************************************************************/
$.widget("ibi.ibxMenuBar", $.ibi.ibxHBox,
{
	"options":
	{
		"navKeyDir":"horizontal",
		"navKeyRoot":true,
		"focusDefault":true,
		"direction":"row",
		"align":"stretch",
		"aria":
		{
			"role":"menubar",
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
		"showArrow":false,
		"justify":"start",
		"menuOptions":
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
		},
		"aria":
		{
			"role":"button",
			"haspopup":true,
		}
	},
	_widgetClass: "ibx-menu-button",
	_create:function()
	{
		var options = this.options;
		options.menuOptions.position.of = this.element[0];
		this.element.on({"click": this._onClickEvent.bind(this)});

		//save bound functions in case someone resets the menu option...need to remove the event listeners.
		this._onBeforeMenuOpenCloseBound = this._onBeforeMenuOpenClose.bind(this);
		this._onMenuSelectBound = this._onMenuSelect.bind(this);

		//get/make the menu...if menu isn't in the dom, tuck it under this element for safe keeping...must be in dom for accessibility.
		var menu = options.menu = options.menu || this.element.children(".ibx-popup")[0] || $("<div class='ibx-menu-button-default-menu'>").ibxMenu();
		if(!menu.parentElement)
			this.element.append(menu);
		
		this.option("menu", menu);
		this._super();
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		aria = this._super(accessible, aria);
		aria.owns = options.menu.prop("id");
		aria.expanded = options.menu.ibxWidget("isOpen");
		return aria;
	},
	_init:function()
	{
		this._super();
		var menuItems = this.element.children(".ibx-menu-item").detach();
		this.add(menuItems);
	},
	children:function(selector)
	{
		return this.options.menu.ibxWidget("children", selector);
	},
	add:function(el, elSibling, before, refresh)
	{
		this.options.menu.ibxWidget("add", el, elSibling, before, refresh);
	},
	remove:function(el, destroy, refresh)
	{
		this.options.menu.ibxWidget("remove", el, destroy, refresh);
	},
	showMenu:function(show)
	{
		this.options.menu.ibxWidget(show ? "open" : "close");
	},
	_onClickEvent:function(e)
	{
		//[HOME-584]...my bad.
		var options = this.options;
		var event = $.Event(e.origionalEvent);
		event.type = "ibx_click";
		event.menu = options.menu;
		this.element.trigger(event);

		//menu might have changed...reset after event.
		var menu = event.menu;
		this.option("menu", menu);

		//open the menu if it is a menu, and it has items, or is some other popup type.
		if(!menu.is(".ibx-menu") || menu.ibxWidget("children", "*").length)
			menu.ibxWidget("open");
	},
	_onKeyEvent:function(e)
	{
		var eType = e.type;

		//other keys - enter/space will trigger the click as a normal button will.
		if(eType == "keyup" && e.keyCode == $.ui.keyCode.DOWN)
		{
			this.element.trigger("click");
			e.stopPropagation();
		}
		else
		if(eType == "keydown" && e.keyCode == $.ui.keyCode.DOWN)
		{
			e.preventDefault();//stops the body from scrolling
			e.stopPropagation();
		}
		this._super(e);
	},
	_onBeforeMenuOpenClose:function(e)
	{
		this.setAccessibility();
	},
	_onMenuSelect:function(e, menuItem)
	{
		this.element.dispatchEvent("ibx_select", menuItem, false, false);
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		if(key == "menu")
		{
			var menu = $(options.menu);
			menu.off("ibx_beforeopen ibx_beforeclose", this._onBeforeMenuOpenCloseBound).off("ibx_select", this._onMenuSelectBound);
			menu = $(value);
			menu.ibxAriaId().on("ibx_beforeopen ibx_beforeclose", this._onBeforeMenuOpenCloseBound).on("ibx_select", this._onMenuSelectBound);
			value = menu;
		}
		this._super(key, value);
	},
	_refresh:function()
	{
		var options = this.options;
		options.menu.ibxWidget("option", options.menuOptions);
		options.iconPosition = options.showArrow ? "right" : options.iconPosition;
		options.glyph = options.showArrow  ? "arrow_drop_down" : options.glyph;
		options.glyphClasses = options.showArrow ? "material-icons ibx-menu-button-arrow" : options.glyphClasses;
		this._super();
	}
});
//defined types mostly for markup readability
$.widget("ibi.ibxHMenuButton", $.ibi.ibxMenuButton,{options:{},_widgetClass: "ibx-hmenu-button"});
$.widget("ibi.ibxVMenuButton", $.ibi.ibxMenuButton,
{
	options:{position:{at:"right top"}},
	_widgetClass: "ibx-vmenu-button",
	_onKeyEvent:function(e)
	{
		if(e.keyCode == $.ui.keyCode.RIGHT)
			this.element.trigger("click");
		this._super(e);
	},
	_refresh:function()
	{
		this._super();
		this._glyph.ibxToggleClass("ibx-menu-button-arrow-right", this.options.showArrow);
	}
});

/******************************************************************************
	ibxMenuSelect
	Let's you define a button that will show a menu and let you pick an item (or multiple)
******************************************************************************/
$.widget("ibi.ibxSelectMenuButton", $.ibi.ibxMenuButton,
{
	options:
	{
		"userValue":[],
		"editable":false,
		"filterValues":false,
		"filterNoCase":true,
		"showArrow":true,
		"useSelectionAsText":true,
		"defaultText":"",
		"multiSelect":false,
		"menuSelOptions":
		{
			selectableChildren:".ibx-select-menu-item",
			type:"single",
			toggleSelection: false,
			escClearSelection:false,
			focusResetOnBlur:false
		},
		"aria":
		{
			"role":"combobox",//turn button into a combobox.
		}
	},
	_widgetClass: "ibx-select-menu-button",
	_create:function()
	{
		this._super();
		var options = this.options;
		options.defaultText = options.defaultText || options.text;
		this._text.ibxEditable({commitKey:null, cancelKey:null}).on("ibx_textchanging", this._onTextChanging.bind(this)).on("keydown", this._onTextKeyDown.bind(this));
		this.element.on("ibx_widgetfocus", this._onWidgetFocus.bind(this));
		this._sm = options.menu.ibxSelectionManager("option", options.menuSelOptions).ibxSelectionManager("instance");
		this._sm.element.on("ibx_selchange", this._onMenuSelChange.bind(this));
	},
	_setAccessibility:function(accessible, aria)
	{
		this._super(accessible, aria);
		this.options.menu.ibxWidget("option", "aria.role", "listbox");//turn menu into a list box
		this.options.menu.ibxWidget("option", "aria.multiselectable", this.options.multiSelect ? true : null);//turn menu into a list box
		this.element.attr("title", this.options.text);
		return aria;
	},
	_init:function()
	{
		this._super();
	},
	add:function(el, elSibling, before, refresh)
	{
		this._super(el, elSibling, before, refresh);
		var userValue = this.options.userValue;
		$(el).attr("role", "option").each(function(idx, el)
		{
			el = $(el);
			var sel = el.ibxWidget("option", "selected");
			if(sel)
				userValue.push(el.ibxWidget("userValue"));
 		}.bind(this));
		this.option("userValue", userValue)
	},
	remove:function(el, destroy, refresh)
	{
		this._super(el, destroy, refresh);
		$(el).attr("role", "menuitem");
	},
	isEditing:function()
	{
		return this._text.ibxEditable("isEditing");
	},
	startEditing:function()
	{
	},
	stopEditing:function()
	{
	},
	_onWidgetFocus:function(e)
	{
		this.startEditing();
	},
	_onKeyEvent:function(e)
	{
		this._super(e);
	},
	_onTextChanging:function(e)
	{
	},
	selected:function(el, select)
	{
		if(el === undefined)
			return this._sm.selected();

		el = $(el);
		this._sm.selected(el, select, select, select);
	},
	_onMenuSelChange:function(e)
	{
		//selection changing from _setOption, so don't do this!
		if(this._inSetOption)
			return;

		//on menu selection set the control's userValue based on selected item(s).
		var userValues = [];
		$(this._sm.selected()).each(function(idx, el)
		{
			el = $(el);
			userValues.push(el.ibxWidget("userValue"));
		}.bind(this));
		this.option("userValue", userValues);
		this.element.dispatchEvent("ibx_selchange", e.originalEvent.data, false, false);
	},
	_onBeforeMenuOpenClose:function(e)
	{
		this._super(e);
	},
	_onTextKeyDown:function(e)
	{
		if(e.keyCode == $.ui.keyCode.DOWN)
			this.options.menu.focus();
	},
	_setOption:function(key, value)
	{
		var options = this.options;

		if(key == "defaultText")
			this.option("text", value, false);
		else
		if(key == "multiSelect" || key == "menuSelOptions")
		{
			var multiSelect = options.multiSelect;
			if(key == "multiSelect")
			{
				multiSelect = value;
				options.menuSelOptions.type = (multiSelect ? "multi" : "single");
				options.menuSelOptions.toggleSelection = multiSelect;
			}
			options.menu.ibxWidget("option",{multiSelect:multiSelect, selMgrOpts:options.menuSelOptions});
		}
		else
		if(key == "userValue")
		{
			var labelText = [];
			var selItems = [];
			var items = this.children();

			value = (value instanceof Array) ? value : [value];//value has to be an array.
			for(var i = 0; i < items.length; ++i)
			{
				var item = $(items[i]);
				var itemValue = item.ibxWidget("userValue");
				var sel = (itemValue && (value.indexOf(itemValue) != -1));
				if(sel)
				{
					selItems.push(item[0]);
					labelText.push(item.ibxWidget("text"));
				}
			}
			if(!options.multiSelect && selItems.length)
				selItems.length = labelText.length = 1;

			labelText = labelText.length ? labelText.join(", ") : options.defaultText;
			this.option("text", labelText);

			this._inSetOption = true;
			this._sm.deselectAll();
			this._sm.selected(selItems, true, true, true);
			this._super(key, value);//need to call super so attached ibxCommand will trigger uservalue update event.
			this._inSetOption = false;
			return;
		}
		this._super(key, value);
	},
	_refresh:function()
	{
		var options = this.options;
		this._text.ibxToggleClass("ibx-select-menu-button-label-editable", options.editable).attr("tabindex", options.editable ? "-1" : null);
		this._super();
	}
});

//defined types mostly for markup readability
$.widget("ibi.ibxHSelectMenuButton", $.ibi.ibxSelectMenuButton,{options:{},_widgetClass: "ibx-hselectmenu-button"});
$.widget("ibi.ibxVSelectMenuButton", $.ibi.ibxSelectMenuButton,
{
	options:{position:{at:"right top"}},
	_widgetClass: "ibx-vselectmenu-button",
	_onKeyEvent:function(e)
	{
		if(e.keyCode == $.ui.keyCode.RIGHT)
			this.element.trigger("click");
		this._super(e);
	},
	_refresh:function()
	{
		this._super();
		this._glyph.ibxToggleClass("ibx-menu-button-arrow-right", this.options.showArrow);
	}
});

//Simple derived widget for select menu items.
$.widget("ibi.ibxSelectMenuItem", $.ibi.ibxMenuItem,
{
	options:
	{
		selected:false,
	},
	_widgetClass:"ibx-select-menu-item",
	_create:function()
	{
		this.options.userValue = this.options.userValue || ("smiAutoUserValue" + $.ibi.ibxSelectMenuItem.autoUserValue++);
		this._super();
	},
	_setOption:function(key, value)
	{
		this._super(key, value);
		var options = this.options;
		if(key == "selected")
			this.element.closest(".ibx-selection-manager").ibxSelectionManager("selected", this.element, options.selected);
	},
	selected:function(selected)
	{
		if(selected === undefined)
			return this.options.selected;
		this.option("selected", selected);
	}
});
$.ibi.ibxSelectMenuItem.autoUserValue = 0;

/******************************************************************************
	ibxSplitMenuButton
	combination button/menu...pressing button will be equiv of selecting defaultMenuItem
******************************************************************************/
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
		var menu = this.element.children(".ibx-popup");
		var menuBtn = this._menuBtn = $("<div>").append(menu).ibxMenuButton().on("mousedown click", this._onMenuButtonMouseEvent.bind(this)).attr("title", ibx.resourceMgr.getString("IBX_SPLIT_BUTTON_DOWN_ARROW_TITLE"));
		var separator = this._separator = $("<div class='split-separator'>");
		this.element.append(separator, menuBtn).on({"click":this._onBtnClick.bind(this)});
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		return aria;
	},
	menu:function(menu)
	{
		if(menu === undefined)
			return this._menuBtn.ibxWidget("option", "menu");
		this._menuBtn.ibxWidget("option", "menu", menu);
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
	_onKeyEvent:function(e)
	{
		var eType = e.type;
		if(eType == "keyup" && e.keyCode == $.ui.keyCode.DOWN)
			this._menuBtn.trigger("click");
		else
		if(eType == "keydown" &&  e.keyCode == $.ui.keyCode.DOWN)
			e.preventDefault();
		this._super(e);
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
		menu.ibxWidget("option", "position", options.menuOptions.position);
		menu.css("minWidth", this.element.css("width"));

		var menuItems = menu.ibxWidget("children");
		menuItems.ibxRemoveClass("ibx-split-button-default-item").filter(options.defaultMenuItem).ibxAddClass("ibx-split-button-default-item");
	}
});
//defined types mostly for markup readability
$.widget("ibi.ibxHSplitMenuButton", $.ibi.ibxSplitMenuButton,{options:{},_widgetClass: "ibx-hsplit-menu-button"});
$.widget("ibi.ibxVSplitMenuButton", $.ibi.ibxSplitMenuButton,{options:{menuOptions:{position:{my:"left top", at:"right top"}}},_widgetClass: "ibx-vsplit-menu-button"});

//separator between menu buttons
$.widget("ibi.ibxMenuButtonSeparator", $.ibi.ibxWidget,{options:{"aria":{"role":"separator", "hidden":true}},_widgetClass: "ibx-menu-button-separator",});



//# sourceURL=menu.ibx.js

