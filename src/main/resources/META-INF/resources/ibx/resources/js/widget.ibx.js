/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:
$.widget("ibi.ibxWidget", $.Widget, 
{
	options:
	{
		"class":"",
		"nameRoot":false,
		"ctxMenu":null,
		"command":null,
		"userValue":null,
		"draggable":false,
		"dragScrolling":false,
		"externalDropTarget":false,		//can you drop external things on this (like native OS files).
		"wantResize":false,
		"opaque":false,					//add iframe behind to stop pdf from bleading through.

		//for keyboard naviation (tab keys - think dialogs)
		"focusRoot":false,				//keep tabbing to this container (like dialogs).
		"focusDefault":false,			//focus the first item in root. (can be a select pattern).

		//DEPRECATED: You should just add the class/id to the element you want to focus by default,
		//and then set the focusDefault option on the parent to select that pattern.
		"defaultFocused":false,


		//for keyboard navigation (arrow keys - mostly composite widgets like menus/selects/etc...508)
		"navKeyRoot":false,				//keep keyboard navigation to this container (not tabbing, more like arrows in trees/lists/etc.).
		"navKeyDir":"horizontal",		//horizontal = left/right, vertical = up/down, or both
		"navKeyResetFocusOnBlur":true,	//when widget loses focus, reset the current active navKey child.
		"navKeyKeys":					//keys for various nav key events
		{
			"activate":"ENTER",
			"cancel":"ESCAPE",
			"first":"HOME",
			"last":"END",
			"hprev":"LEFT",
			"hnext":"RIGHT",
			"vprev":"UP",
			"vnext":"DOWN"
		},

		//ARIA (508)
		"aria":
		{
			"accessible":false,
			"role":null,
			"label":null,
			"labelledby":null,
			"describedby":null,
		}
	},
	_widgetClass:"ibx-widget",
	_adjustWidgetClasses:function(bAdd)
	{
		var classes = [];
		var p = this.__proto__;
		do
		{
			if(p._widgetClass)
				classes.unshift(p._widgetClass);
		}
		while(p = p.__proto__);
		for(var i = 0; i < classes.length; ++i)
		{
			var cls = classes[i];
			bAdd ? this.element.addClass(cls) : this.element.removeClass(cls);
		}
	},
	created:function(){return this._created;},
	_created:false,
	_createWidget:function(options, element)
	{
		this.options.aria.accessible = ibx.isAccessible;//default accessible to ibx, but allow markup/js to override.
		this._super(options, element);
		this._created = true;
		this._destroyed = false;
	},
	_create:function()
	{
		this.widgetFullName = this._widgetClass;
		this.widgetEventPrefix = "ibx_";
		this.element.data("ibxWidget", this);
		this.element.data("ibiIbxWidget", this);
		this.element.attr("data-ibx-type", this.widgetName);
		this.element.on("keydown ibx_keydowninternal", this._onWidgetKeyEvent.bind(this));
		this.element.on("focusin focusout", this._onWidgetFocusEvent.bind(this));
		this.element.on("contextmenu", this._onWidgetContextMenu.bind(this));
		this._adjustWidgetClasses(true);

		//save the resize sensor callback;
		this._resizeCallbackBound = this._resizeCallback.bind(this);

		//assign memember variables
		var memberData = this.element.data("_ibxPrecreateMemberVariables");
		$.each(memberData, function(memberName, memberValue)
		{
			this.member(memberName, memberValue);
		}.bind(this));
		this.element.removeData("_ibxPrecreateMemberVariables");
		this._super();
	},
	ARIA_PROPS_IGNORE:{"role":true, "accessible":true},
	setAccessibility:function(accessible)
	{
		var aria = $.extend(true, {}, this.options.aria);
		aria.disabled = this.options.disabled;
		aria.accessible = accessible = (accessible === undefined) ? aria.accessible : accessible;

		//NEVER reset the role unless you have to, as it will cause the reader to completely re-read the element!
		if(accessible &&  aria.role && (this.element.attr("role") != aria.role))
			this.element.attr("role", aria.role)
		else
		if(!accessible || !aria.role)
			this.element.removeAttr("role")
			
		accessible ? this.element.ibxAriaId() : this.element.removeIbxAriaId();

		//let derived adjust their attributes, and adjust labelledby
		aria = this._setAccessibility(accessible, aria);
		aria.labelledby = aria.label ? null : aria.labelledby; //can't have aria-label and aria-labelledby at same time...label wins.

		//now set the aria- attributes.
		for(var key in aria)
		{
			if(this.ARIA_PROPS_IGNORE[key])
				continue;
			var ariaAttr = "aria-" + key;
			accessible ? this.element.attr(ariaAttr, aria[key]) : this.element.removeAttr(ariaAttr);
		}
	},
	_setAccessibility:function(accessible, aria)
	{
		//do nothing.
		return aria
	},
	destroyed:function(){return this._destroyed;},
	_destroyed:false,
	_destroy:function()
	{
		this._super();

		//kill the resize sensor
		if(this._resizeSensor)
			this._resizeSensor.detach();
		delete this._resizeSensor;

		this._setOptionDisabled(false);
		
		//remove all ibxWidget, and derived data
		var data = this.element.data();
		$.each(data, function(key, value)
		{
			if(key.search("ibiIbx") == 0 || key.search("ibx") == 0)
				this.element.removeData(key);
		}.bind(this));
		
		this.element.off();
		this.element.removeAttr("data-ibx-type");
		this.element.removeClass(this.options.class);
		this.element.removeClass("ibx-focus-root ibx-nav-key-child ibx-nav-key-root ibx-focus-default");
		this._adjustWidgetClasses(false);
		this.setAccessibility(false);
		this._created = false;
		this._destroyed = true;
		this.element.dispatchEvent("destroy", null, false, false);
	},
	_init:function()
	{
		var options = $.extend(true, {}, this.options, ibx.getIbxMarkupOptions(this.element))
		this.option(options);
	},
	owner:function(){return this.element.parent();},
	member:function(memberName, value)
	{
		var ret = null;
		if(value === undefined)
			ret = this[memberName];
		else
		{
			if(this[memberName])
				console.warn("Overwriting Member '" + memberName + "' in nameroot, info=>", {nameRoot:this, memberExisting:this[memberName], memberOverwrite:value});
			this[memberName] = value;
		}
		return ret || $();
	},
	userValue:function(value)
	{
		if(value === undefined)
			return this.options.userValue;
		this.option("userValue", value);
	},
	getCommand:function()
	{
		return $.ibi.ibxCommand.cmds[this.options.command];
	},
	doCommandAction:function(action, data)
	{
		var cmd = this.getCommand();
		if(cmd)
			cmd.ibxWidget("doAction", action, data, this.element[0]);
	},
	_resizeCallback:function()
	{
		this.element.dispatchEvent("ibx_resize");
	},
	_widgetFocused:false,
	widgetFocused:function(){return this._widgetFocused;},
	_onWidgetFocusEvent:function(e)
	{
		//manage the global widget focus states. That is, for complex widgets (has subwidgets), is the whole thing logically focused.
		var options = this.options;
		var isTarget = this.element.is(e.target);
		var isRelTarget = this.element.is(e.relatedTarget);
		var ownsTarget = $.contains(this.element[0], e.target);
		var ownsRelTarget = $.contains(this.element[0], e.relatedTarget);

		if(e.type == "focusin")
		{
			if(!this._widgetFocused)
			{
				this._widgetFocused = true;
				this.element.dispatchEvent("ibx_widgetfocus", e.originalEvent, false, false, e.relatedTarget);
			}

			//do the default focusing.
			if((options.focusDefault !== false))
			{
				//take the element out of the tab order so shift+tab will work and not focus this container.
				if(this.element.data("focusDefaultParentTabIndex") === undefined)
					this.element.data("focusDefaultParentTabIndex", this.element.prop("tabindex")).prop("tabindex", -1);

				if(!ownsTarget)
				{
					//now manage focusing the first valid child.
					if(options.navKeyRoot)
						this.element.dispatchEvent("ibx_keydowninternal", "NAV_KEY_ACTIVATE");
					else
					if(isTarget)
					{
						//focus default item...otherwise find first focusable item (ARIA needs SOMETHING to be focused on the popup)
						var defItem = this.element.find(options.focusDefault);
						defItem = defItem.length ? defItem : this.element.find(":ibxFocusable").first();
						defItem.focus();
					}
				}
			}

			if(options.navKeyRoot && !isTarget)
			{
				//if we own the target, we are now nav active.
				this.element.addClass("ibx-nav-key-root-active");

				//reset the nav kids.				
				this.navKeyChildren().removeClass("ibx-nav-key-item-active ibx-ie-pseudo-focus").addClass("ibx-nav-key-child");

				//set the active kid.
				var navKidActive = $(e.target).closest(".ibx-nav-key-child");
				navKidActive.addClass("ibx-nav-key-item-active").toggleClass("ibx-ie-pseudo-focus", ibxPlatformCheck.isIE);
				options.aria.activedescendant = navKidActive.prop("id");
				this.setAccessibility();
			}
		}
		
		if(e.type == "focusout" && this._widgetFocused && !isRelTarget && !ownsRelTarget)
		{
			this._widgetFocused = false;
			this.element.dispatchEvent("ibx_widgetblur", e, false, false, e.relatedTarget);

			//put this element back in the tab order...so that next tab into will will do auto-focus.
			if(this.element.data("focusDefaultParentTabIndex") !== undefined)
				this.element.prop("tabIndex", this.element.data("focusDefaultParentTabIndex")).removeData("focusDefaultParentTabIndex");

			//active items and tabbing are handled in a given 'context'...popups introduce a higher context, so ignore them here.
			if(options.navKeyRoot)
			{
				//no longer navActive
				this.element.removeClass("ibx-nav-key-root-active");

				//adjust current nav-key-children
				var navKids = this.navKeyChildren("*");//all nav kids not just focusable...menus are hidden at this point.
				navKids.each(function(idx, el)
				{
					var navKid = $(el);
					navKid.removeClass("ibx-nav-key-child ibx-ie-pseudo-focus");
					if(options.navKeyResetFocusOnBlur)
					{
						navKid.removeClass("ibx-nav-key-item-active");
						delete options.aria.activedescendant;
					}
				}.bind(this));

				//config active descendant.
				this.setAccessibility();
			}
		}
	},
	_onWidgetKeyEvent:function(e)
	{
		//if specified, keep traversal of children localized and circular within this widget.  
		//tabbing is for things like popups/dialogs, and arrows for composite widgets (menus/selects)...ARIA support relies on this.
		e = e.originalEvent;
		var options = this.options;
		if(options.focusRoot && e.keyCode == $.ui.keyCode.TAB)
		{
			var tabKids = this.element.find(":ibxFocusable, .ibx-nav-key-root-active");
			var target = null;
			var firstKid = tabKids.first();
			var lastKid = tabKids.last();
			if(firstKid.length && lastKid.length)
			{
				if((firstKid.is(e.target) || $.contains(firstKid[0], e.target)) && e.shiftKey)
					target = tabKids.last();
				else
				if((lastKid.is(e.target) || $.contains(lastKid[0], e.target)) && !e.shiftKey)
					target = tabKids.first();
			}

			//target means first/last item and need to loop...or no kids, so do nothing.
			if(target || !tabKids.length)
			{
				target = $(target);
				target.focus();
				e.preventDefault();
				e.stopPropagation();
			}
		}
		else
		if(options.navKeyRoot)
		{
			var isNavActive = this.navKeyActive();
			var navKids = this.navKeyChildren();
			var active = $();
			var current = navKids.filter(".ibx-nav-key-item-active");

			//[IBX-83]
			if(!isNavActive && this.element.is(e.target) && (e.data == "NAV_KEY_ACTIVATE" || eventMatchesShortcut(options.navKeyKeys.activate, e)))
			{
				isNavActive = true;
				active = current.length ? current : navKids.first();
				current = null;//[HOME-921]this allows activation to focus child, but not key events when child is already active. (think text arrow keys!)
			}
			else
			if(isNavActive && !options.focusDefault && eventMatchesShortcut(options.navKeyKeys.cancel, e))//you can't escape out of a navKeyAutoFocus.
				active = this.element;
			else
			if(isNavActive)
			{
				if(eventMatchesShortcut(options.navKeyKeys.first, e))
					active = navKids.first();
				else
				if(eventMatchesShortcut(options.navKeyKeys.last, e))
					active = navKids.last();
		
				if(!active.length && options.navKeyDir == "horizontal" || options.navKeyDir == "both")
				{
					if(eventMatchesShortcut(options.navKeyKeys.hprev, e))
					{
						var idx = navKids.index(current);
						var prev = navKids.get(--idx)
						active = prev ? $(prev) : navKids.last();
					}
					else
					if(eventMatchesShortcut(options.navKeyKeys.hnext, e))
					{
						var idx = navKids.index(current);
						var next = navKids.get(++idx);
						active = next ? $(next) : navKids.first();
					}
				}

				if(!active.length && options.navKeyDir == "vertical" || options.navKeyDir == "both")
				{
					if(eventMatchesShortcut(options.navKeyKeys.vprev, e))
					{
						var idx = navKids.index(current);
						var prev = navKids.get(--idx);
						active = prev ? $(prev) : navKids.last();
					}
					else
					if(eventMatchesShortcut(options.navKeyKeys.vnext, e))
					{
						var idx = navKids.index(current);
						var next = navKids.get(++idx);
						active = next ? $(next) : navKids.first();
					}
				}
			}

			if(isNavActive && !active.is(current) && active.length)
			{
				var evt = $(active).dispatchEvent("ibx_beforenavkeyfocus", null, true, true, current);
				if(!evt.isDefaultPrevented())
				{
					active[0].focus();
					e.preventDefault();
					e.stopPropagation();
				}
			}
		}
	},
	_onWidgetContextMenu:function(e)
	{
		var ctxEvent = $.Event(e.originalEvent);
		ctxEvent.type = "ibx_ctxmenu";

		var ret = this.element.trigger(ctxEvent);
		if(ctxEvent.isDefaultPrevented() || !this.element.is(e.currentTarget))
			return;

		if(ctxEvent.result)
			console.warn("[ibx Deprecation] Event ibx_ctxmenu - event.result is deprecated.  Use event.menu instead.");
		ctxMenu = ctxEvent.result || ctxEvent.menu || $(this.options.ctxMenu);
		if(ctxMenu.length)
		{
			ctxMenu.ibxWidget("option", {"ctxWidget":this.element[0], "position":{my:"left top", at:"", collision:"flipfit", of:e}});
			ctxMenu.ibxWidget("open");
			e.stopPropagation();
			e.preventDefault();
		}
	},
	children:function(selector)
	{
		return this.element.children(selector);
	},
	navKeyChildren:function(selector)
	{
		selector = selector || ":ibxNavFocusable";
		return this.children(selector);
	},
	navKeyActiveChild:function(el)
	{
		if(el === undefined)
			return this.navKeyChildren(".ibx-nav-key-item-active");

		var active = this.navKeyActiveChild().removeClass(".ibx-nav-key-item-active");
		$(el).addClass(".ibx-nav-key-item-active").focus();

	},
	navKeyActive:function()
	{
		return this.element.hasClass("ibx-nav-key-root-active");
	},
	add:function(el, elSibling, before, refresh)
	{
		el = $(el);
		elSibling = $(elSibling);
		if(elSibling.length)
			before ? el.insertBefore(elSibling) : el.insertAfter(elSibling);
		else
			before ? this.element.prepend(el) : this.element.append(el);

		if(refresh)
			this.refresh();
	},
	remove:function(el, destroy, refresh)
	{
		var children = this.element.children().filter(el || "*");
		var ret = (destroy) ? children.remove() : children.detach();
		if(refresh)
			this.refresh();
	},
	option:function(key, value, refresh)
	{
		var options = this.options;
		var bRefresh = (typeof(key) == "object") || (value !== undefined && (options[key] != value));

		var ret = this._superApply(arguments);
		if(bRefresh && refresh !== false)
			this.refresh();
		return ret;
	},
	_setOptionDisabled:function(value)
	{
		//only do this if the state is changing.
		var changed = value != this.element.hasClass("ibx-widget-disabled");
		if(!changed)
			return;

		this._super(value);
		var wClass = this._widgetClass;
		(value) ? this.element.addClass("ibx-widget-disabled") : this.element.removeClass("ibx-widget-disabled");
		(value) ? this.element.addClass(wClass + "-disabled") : this.element.removeClass(wClass + "-disabled");
		if(this.options.class)
			(value) ? this.element.addClass(this.options.class + "-disabled") : this.element.removeClass(this.options.class + "-disabled");

		this.setAccessibility();
		
		//the add(this.element) looks weird, but it's just adding the element into the previous answer set so each opperates on it.
		this.element.find("[tabIndex], input, textarea").add(this.element).each(function(disabled, idx, el)
		{
			el = $(el);
			if(!disabled)
				el.prop("tabIndex", el.data("ibxDisabledTabIndex")).removeData("ibxDisabledTabIndex");
			else
				el.data("ibxDisabledTabIndex", el.prop("tabIndex")).prop("tabIndex", -1);
		}.bind(this, value));
	},
	refresh:function()
	{
		if(!$.ibi.ibxWidget.noRefresh)
			this._refresh();
	},
	_refresh:function()
	{
		var options = this.options;

		this.element.addClass(options.class);
		this.element.toggleClass("ibx-focus-root", options.focusRoot);
		this.element.toggleClass("ibx-nav-key-root", options.navKeyRoot);
		this.element.toggleClass("ibx-focus-default", options.focusDefault);
		this.element.toggleClass("ibx-draggable", options.draggable);
		this.element.toggleClass("ibx-external-drop-target", options.externalDropTarget);

		//should NOT BE USING defaultFocused on children of focusRoot/navKeyRoot.
		if(options.defaultFocused)
			console.warn("[ibx Deprecation] defaultFocused option should not be used.  Instead set the focusDefault option on parent with selector that specifies this element =>", this.element);
		this.element.toggleClass("ibx-default-focused", options.defaultFocused);

		//now config accessibility
		this.setAccessibility();

		//associate widget with the command
		(options.command) ? this.element.attr("data-ibx-command", options.command) : this.element.removeAttr("data-ibx-command");

		//[PD-198] pdf files in ie bleed through divs above.  This stops that!
		if(options.opaque)
		{
			if(!this.element.children(".ibx-opaque-frame").length)
			{
				var path = sformat("{1}/{2}", ibx.getPath(), "markup/blank.html");
				var iframe = $("<iframe class='ibx-opaque-frame' allowTransparency='false'>").prop("src", path);
				this.element.addClass("ibx-opaque").append(iframe);
			}
		}
		else
		{
			this.element.children(".ibx-opaque-frame").remove();
			this.element.removeClass("ibx-opaque");
		}

		//hookup the resize sensor if interested in resize events.
		if(!options.wantResize && this._resizeSensor)
		{
			this._resizeSensor.detach();
			delete this._resizeSensor;
		}
		else
		if(options.wantResize)
		{
			//create a new resize sensor if we don't have one.
			if(!this._resizeSensor)
				this._resizeSensor = new ResizeSensor(this.element[0],this._resizeCallbackBound);

			//due to a problem with the resize sensor, when things are created in memory and then
			//added to the dom these values are all set to 0 and need to be set as follows.
			var expand = this.element.find(".resize-sensor-expand");
			var shrink = this.element.find(".resize-sensor-shrink");
			expand.prop("scrollLeft", 100000);
			expand.prop("scrollTop", 100000);
			shrink.prop("scrollLeft", 100000);
			shrink.prop("scrollTop", 100000);
		}
	}
});
$.ibi.ibxWidget.noRefresh = false; //globally turn off refresh to speed up various add/remove/update operations.
$.ibi.ibxWidget.navKeys = [$.ui.keyCode.LEFT, $.ui.keyCode.RIGHT, $.ui.keyCode.UP, $.ui.keyCode.DOWN, $.ui.keyCode.HOME, $.ui.keyCode.END, $.ui.keyCode.PAGE_UP, $.ui.keyCode.PAGE_DOWN, 45/*INSERT*/];
$.ibi.ibxWidget.isNavKey = function(keyCode)
{
	keyCode = (keyCode instanceof Object) ? keyCode.keyCode : keyCode;
	return ($.ibi.ibxWidget.navKeys.indexOf(keyCode) != -1);
};
//# sourceURL=widget.ibx.js


/****
 	Selection Management - both tabs and navkey (arrows)
****/
function ibxSelectionManager()
{
	if(ibx.selectionMgr)
		return;
	document.documentElement.addEventListener("focusin", ibxSelectionManager._onFocusEvent.bind(ibxSelectionManager), true);
	document.documentElement.addEventListener("xfocusout", ibxSelectionManager._onFocusEvent.bind(ibxSelectionManager), true);
	document.documentElement.addEventListener("mousedown", ibxSelectionManager._onSelKeyEvent.bind(ibxSelectionManager), true);
	document.documentElement.addEventListener("keydown", ibxSelectionManager._onSelKeyEvent.bind(ibxSelectionManager), true);
}
ibxSelectionManager._onFocusEvent = function(e)
{
	var eType = e.type;
	if(eType == "focusin")
	{
	}
	else
	if(eType == "focusout")
	{
	}
}

ibxSelectionManager._onSelKeyEvent = function(e)
{
	var eType = e.type;
	var target = $(e.target);
	if(eType == "keydown")
	{
		if(e.keyCode == $.ui.keyCode.TAB)
		{
			var root = target.closest(".ibx-focus-root");
			if(root.length)
			{
				var tabKids = root.find(":ibxFocusable");
				var target = null;
				var firstKid = tabKids.first();
				var lastKid = tabKids.last();
				if(firstKid.length && lastKid.length)
				{
					if((firstKid.is(e.target) || $.contains(firstKid[0], e.target)) && e.shiftKey)
						target = tabKids.last();
					else
					if((lastKid.is(e.target) || $.contains(lastKid[0], e.target)) && !e.shiftKey)
						target = tabKids.first();
				}

				//target means first/last item and need to loop...or no kids, so do nothing.
				if(target || !tabKids.length)
				{
					target = $(target);
					target.focus();
					e.preventDefault();
					e.stopPropagation();
				}
			}
		}
		else
		if(false)
		{
			var isNavActive = this.navKeyActive();
			var navKids = this.navKeyChildren();
			var active = $();
			var current = navKids.filter(".ibx-nav-key-item-active");

			//[IBX-83]
			if(!isNavActive && this.element.is(e.target) && (e.data == "NAV_KEY_ACTIVATE" || eventMatchesShortcut(options.navKeyKeys.activate, e)))
			{
				isNavActive = true;
				active = current.length ? current : navKids.first();
				current = null;//[HOME-921]this allows activation to focus child, but not key events when child is already active. (think text arrow keys!)
			}
			else
			if(isNavActive && !options.focusDefault && eventMatchesShortcut(options.navKeyKeys.cancel, e))//you can't escape out of a navKeyAutoFocus.
				active = this.element;
			else
			if(isNavActive)
			{
				if(eventMatchesShortcut(options.navKeyKeys.first, e))
					active = navKids.first();
				else
				if(eventMatchesShortcut(options.navKeyKeys.last, e))
					active = navKids.last();
		
				if(!active.length && options.navKeyDir == "horizontal" || options.navKeyDir == "both")
				{
					if(eventMatchesShortcut(options.navKeyKeys.hprev, e))
					{
						var idx = navKids.index(current);
						var prev = navKids.get(--idx)
						active = prev ? $(prev) : navKids.last();
					}
					else
					if(eventMatchesShortcut(options.navKeyKeys.hnext, e))
					{
						var idx = navKids.index(current);
						var next = navKids.get(++idx);
						active = next ? $(next) : navKids.first();
					}
				}

				if(!active.length && options.navKeyDir == "vertical" || options.navKeyDir == "both")
				{
					if(eventMatchesShortcut(options.navKeyKeys.vprev, e))
					{
						var idx = navKids.index(current);
						var prev = navKids.get(--idx);
						active = prev ? $(prev) : navKids.last();
					}
					else
					if(eventMatchesShortcut(options.navKeyKeys.vnext, e))
					{
						var idx = navKids.index(current);
						var next = navKids.get(++idx);
						active = next ? $(next) : navKids.first();
					}
				}
			}

			if(isNavActive && !active.is(current) && active.length)
			{
				var evt = $(active).dispatchEvent("ibx_beforenavkeyfocus", null, true, true, current);
				if(!evt.isDefaultPrevented())
				{
					active[0].focus();
					e.preventDefault();
					e.stopPropagation();
				}
			}
		}
	}
};

$.widget("ibi.ibxSelectionManager", $.Widget, 
{
	options:
	{
		"multiSelect":false,
		"selectableItems":""
	},
	_widgetClass:"ibx-selection-manager",
	_create:function()
	{
		this._super();
		this.element.addClass("ibx-selection-manager");
		this.element.on("keydown mousedown", this._onItemEvent.bind(this));
	},
	_destroy:function()
	{
		this._super();
		this.element.removeClass("ibx-selection-manager");
	},
	_onItemEvent:function(e)
	{
		var options = this.options;
		var target = $(e.target).closest(options.selectableItems);
		var eType = e.type;
		var ctrl = e.ctrlKey;
		var shift = e.shiftKey;
		var selected = target.is(".ibx-selected");
		if(eType == "mousedown")
		{
			if(!ctrl && !shift)
				this.deselectAll();
			target.toggleClass("ibx-selected", ctrl ? !selected : true);
			//console.log(target);
		}
		else
		if(eType == "keydown")
		{
		}
	},
	select:function(selector)
	{
		this.element.children().filter(selector).addClass("ibx-selected");
	},
	selectAll:function(selector)
	{
		this.element.children().addClass("ibx-selected");
	},
	deselect:function(selector)
	{
		this.element.children().filter(selector).removeClass("ibx-selected");
	},
	deselectAll:function()
	{
		this.element.children().filter(".ibx-selected").removeClass("ibx-selected");
	},
	_refresh:function()
	{
		this._super();
	}
});
