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
		"dragScrolling":false,
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
		this.element.on("keydown", this._onWidgetKeyEvent.bind(this));
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
		this.element.removeClass("ibx-focus-root ibx-nav-key-root ibx-focus-default");
		this._adjustWidgetClasses(false);
		this.setAccessibility(false);
		this._created = false;
		this._destroyed = true;
		this._trigger("destroy");
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
		this._trigger("resize");
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
			if((options.focusDefault !== false) && !ownsTarget)
			{

				//take the element out of the tab order so shift+tab will work and not focus this container.
				if(this.element.data("navKeyRootTabIndex") === undefined)
					this.element.data("navKeyRootTabIndex", this.element.prop("tabindex")).prop("tabindex", -1);

				//now manage focusing the first valid child.
				if(options.navKeyRoot)
					this.element.dispatchEvent("keydown", "NAV_KEY_ACTIVATE");
				else
				if(isTarget)
				{
					//focus default item...otherwise find first focusable item (ARIA needs SOMETHING to be focused on the popup)
					var defItem = this.element.find(options.focusDefault);
					defItem = defItem.length ? defItem : this.element.find(":ibxFocusable").first();
					defItem.focus();
				}
			}

			if(options.navKeyRoot && !isTarget)
			{
				//if we own the target, we are now nav active.
				this.element.addClass("ibx-nav-key-root-active");

				//de-activate all children, and activate the direct child that is/owns the target.
				this.navKeyChildren().each(function(target, idx, el)
				{
					var navKid = $(el);
					navKid.removeClass("ibx-nav-key-item-active ibx-ie-pseudo-focus");
					if(navKid.is(target) || $.contains(navKid[0], target))
					{
						navKid.addClass("ibx-nav-key-item-active").toggleClass("ibx-ie-pseudo-focus", ibxPlatformCheck.isIE);
						options.aria.activedescendant = navKid.prop("id");
					}
				}.bind(this, e.target));

				//config active descendant.
				this.setAccessibility();
			}
		}
		
		if(e.type == "focusout" && this._widgetFocused && !ownsRelTarget)
		{
			this._widgetFocused = false;
			this.element.dispatchEvent("ibx_widgetblur", e, false, false, e.relatedTarget);

			//put this element back in the tab order...so that next tab into will will do auto-focus.
			if(this.element.data("navKeyRootTabIndex") !== undefined)
				this.element.prop("tabIndex", this.element.data("navKeyRootTabIndex")).removeData("navKeyRootTabIndex");


			var children = this.navKeyChildren("*");//all nav kids not just focusable...menus are hidden at this point.
			children.removeClass("ibx-ie-pseudo-focus");

			//active items and tabbing are handled in a given 'context'...popups introduce a higher context, so ignore them here.
			if(options.navKeyRoot)
			{
				//no longer navActive
				this.element.removeClass("ibx-nav-key-root-active");

				//remove active so next focus goes to first item.
				if(options.navKeyResetFocusOnBlur)
				{
					children.removeClass("ibx-nav-key-item-active");
					delete options.aria.activedescendant;
				}

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
				var ret = this._trigger("focusing", null, {"target":target, "relatedTarget":e.relatedTarget});
				if(ret)
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
				else
				if(options.navKeyDir == "horizontal" || options.navKeyDir == "both")
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
				else
				if(options.navKeyDir == "vertical" || options.navKeyDir == "both")
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
				var event = $.Event(e);
				event.type = "ibx_beforenavkey";
				event.target = active;
				event.relatedTarget = current;
				this.element.trigger(event);
				if(!event.isDefaultPrevented())
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
			console.warn("[Deprecation] Event ibx_ctxmenu - event.result is depricated.  Use event.menu instead.");
		ctxMenu = ctxEvent.result || ctxEvent.menu || $(this.options.ctxMenu);
		if(ctxMenu.length)
		{
			ctxMenu.ibxWidget("option", "position", {my:"left top", at:"", collision:"flipfit", of:e});
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
		var children = this.element.children().filter(el);
		var ret = (destroy) ? children.remove() : children.detach();
		if(refresh)
			this.refresh();
	},
	option:function(key, value)
	{
		var bRefresh = (typeof(key) == "object") || (value !== undefined && (this.options[key] != value));
		var ret = this._superApply(arguments);
		if(bRefresh)
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
$.ibi.ibxWidget.navKeys = [$.ui.keyCode.LEFT, $.ui.keyCode.RIGHT, $.ui.keyCode.UP, $.ui.keyCode.DOWN, $.ui.keyCode.HOME, $.ui.keyCode.END, $.ui.keyCode.PAGE_UP, $.ui.keyCode.PAGE_DOWN, 45/*INSERT*/];
$.ibi.ibxWidget.isNavKey = function(keyCode)
{
	keyCode = (keyCode instanceof Object) ? keyCode.keyCode : keyCode;
	return ($.ibi.ibxWidget.navKeys.indexOf(keyCode) != -1);
};

/****
 	Drag/Drop mix in
****/
(function(widgetProto)
{
	function ibxDataTransfer()
	{
		this.items = {};
		this.effectAllowed = "all";
		this.dropEffect = "not-allowed";
	}
	_p = ibxDataTransfer.prototype = new Object();
	_p.items = null;
	_p.getData = function(type){return this.items[type]};
	_p.setData = function(type, data){this.items[type] = data;};
	_p.clearData = function(type){delete this.items[type];};
	_p._dragImage = null;
	_p.dragXOffset = 8;
	_p.dragYOffset = 8;
	_p.setDragImage = function(img, xOffset, yOffset)
	{
		this._dragImage = img ? $(img) : this._dragImage;
		if(this._dragImage)
			this._dragImage.css("position", "absolute").addClass("ibx-drag-image");
		this.dragXOffset = xOffset || this.dragXOffset;
		this.dragYOffset = yOffset || this.dragYOffset;
	};

	var draggablePatch = 
	{
		options:
		{
			draggable:false,			//!!!!IBX DRAGGABLE!!!! ...NOTHING TO DO WITH NATIVE DRAG/DROP
			dragClass:"ibx-drag-source",
			dragImageClass:"",
			dragStartDistanceX:5,
			dragStartDistanceY:5,

			nativeFileDropTarget:false, //!!!!NATIVE FILE DROP TARGET!!!! 
			fileUploadAjaxOptions:
			{
			}
		},
		_createOrig:$.ibi.ibxWidget.prototype._create,
		_create:function()
		{
			this._onDragMouseEventBound = this._onDragMouseEvent.bind(this);
			this._onDragKeyEventBound = this._onDragKeyEvent.bind(this); 
			this.element.on("mousedown dragover drop", this._onDragMouseEventBound);
			this.element.on("keydown", this._onDragKeyEventBound);
			this._createOrig.apply(this, arguments);
		},
		_destroyOrig:$.ibi.ibxWidget.prototype._destroy,
		_destroy:function()
		{
			this._destroyOrig.apply(this, arguments);
			this.element.removeClass("ibx-draggable");
		},
		getDefaultDragImage:function(el)
		{
			//clone the node and make sure the width/height are preserved so it lays out correctly.
			el = $(el);
			var width = el.width();
			var height = el.height();
			var clone = el.clone().css({"width":width + "px", "height":height + "px", "margin":"0px"});
			return clone;
		},
		isDragging:function(){return this.element.hasClass(this.options.dragClass);},
		_dispatchDragEvent:function(e, type, target, data)
		{
			var dEvent = $.Event(e);
			dEvent.type = type;
			dEvent.target = (target instanceof jQuery) ? target[0] : target;
			dEvent.dataTransfer = this._dataTransfer || e.dataTransfer;
			$(target).trigger(dEvent, data);
			return dEvent;
		},
		endDrag:function(eType, e)
		{
			if(eType && this.isDragging())//[IA-7558] Only spit out event if dragging.
				this._dispatchDragEvent(e, eType, this.element);
			
			if(this._dataTransfer)
				$(this._dataTransfer._dragImage).remove();

			document.documentElement.removeEventListener("mouseup", this._onDragMouseEventBound, true);
			document.documentElement.removeEventListener("mousemove", this._onDragMouseEventBound, true);
			this.element.removeClass(this.options.dragClass);
			this._curTarget.css("cursor", this._curTarget.data("ibxDragTargetCursor")).removeClass("ibx-drag-target");

			delete this._dataTransfer;
			delete this._curTarget;
			delete this._mDownLoc;
		},
		_onDragKeyEvent:function(e)
		{
			if(this.options.draggable && this.isDragging() && e.keyCode == $.ui.keyCode.ESCAPE)
			{
				this.endDrag("ibx_dragcancel", e);
				e.stopPropagation();
			}
		},
		_onDragMouseEvent:function(e)
		{
			var options = this.options;
			if(!options.draggable)
				return;

			//stop proagation...bubbling will mess up draggable within draggable.
			e.stopPropagation();

			var eType = e.type;
			switch(eType)
			{
				case "mousedown":
					this._mDownLoc = {"x":e.clientX, "y":e.clientY};
					document.documentElement.addEventListener("mouseup", this._onDragMouseEventBound, true);
					document.documentElement.addEventListener("mousemove", this._onDragMouseEventBound, true);
					this._curTarget = $();
					break;
				case "mouseup":
					if(this.isDragging())
					{
						//if allowed let target know it was dropped on
						if(!this._curTarget._dragPrevented)
							this._dispatchDragEvent(e, "ibx_drop", this._curTarget);
					}

					//end the drag operation
					this.endDrag("ibx_dragend", e);
					break;
				case "mousemove":
					var dEvent = null;
					var dx = Math.abs(e.clientX - this._mDownLoc.x);
					var dy = Math.abs(e.clientY - this._mDownLoc.y);
					var isDragging = this.isDragging();
					if(!isDragging && (dx >= options.dragStartDistanceX || dy >= this.options.dragStartDistanceY))
					{
						e.stopPropagation();

						this._dataTransfer = new ibxDataTransfer();
						dEvent = this._dispatchDragEvent(e, "ibx_dragstart", this.element);
						if(!dEvent.isDefaultPrevented())
						{
							//start dragging...and also set default drag image if not already set.
							this.element.addClass(options.dragClass);
							if(!this._dataTransfer._dragImage)
								this._dataTransfer.setDragImage(this.getDefaultDragImage(this.element).addClass(options.dragImageClass));
						}
					}

					if(isDragging)
					{
						//find the element under the mouse.
						var elTarget = $(document.elementFromPoint(e.clientX, e.clientY));

						//manage the current target
						if(!this._curTarget.is(elTarget))
						{
							//new drop target so reset the effect.
							this._dataTransfer.dropEffect = "not-allowed";

							//spit out events for source/target
							dEvent = this._dispatchDragEvent(e, "ibx_dragleave", this._curTarget);
							dEvent = this._dispatchDragEvent(e, "ibx_dragenter", elTarget);

							//save the current drag target info.
							this._curTarget.css("cursor", this._curTarget.data("ibxDragTargetCursor")).removeClass("ibx-drag-target");
							this._curTarget = elTarget;
							this._curTarget.data("ibxDragTargetCursor", this._curTarget.css("cursor")).addClass("ibx-drag-target");
						}

						//send drag messages if 'ibx_dragover' was not prevented
						dEvent = this._dispatchDragEvent(e, "ibx_drag", this.element);
						dEvent = this._dispatchDragEvent(e, "ibx_dragover", this._curTarget);
						var dragPrevented = this._curTarget._dragPrevented = !dEvent.isDefaultPrevented();

						//figure out the cursor
						var cursor = "not-allowed";
						if(!dragPrevented)
						{
							if(this._dataTransfer.effectAllowed == "all")
								cursor = this._dataTransfer.dropEffect;
							else
							if(this._dataTransfer.effectAllowed == this._dataTransfer.dropEffect)
								cursor = this._dataTransfer.dropEffect;
						}
						var curCursor = this._curTarget.css("cursor");
						if(curCursor != cursor)
							this._curTarget.css("cursor", cursor);

						//manage the drag cursor
						if(this._dataTransfer._dragImage)
						{
							var dragImage = this._dataTransfer._dragImage;
							var xOffset = (this._dataTransfer.dragXOffset == "center") ? -(dragImage.width()/2) : this._dataTransfer.dragXOffset;
							var yOffset = (this._dataTransfer.dragYOffset == "center") ? -(dragImage.height()/2) : this._dataTransfer.dragYOffset;
							$(this._dataTransfer._dragImage).css(
							{
								"left":e.clientX + xOffset + "px",
								"top":e.clientY + yOffset + "px",
							}).appendTo("body.ibx-root");
						}
					}
					break;

				/*file drop target native drag/drop event handling*/
				case "dragover":
					if(options.nativeFileDropTarget)
						e.preventDefault();
					break;
				case "drop":
					var dt = e.originalEvent.dataTransfer;
					if(options.nativeFileDropTarget && dt.files.length)
					{
						var formData = new FormData();
						$.each(dt.files, function(idx, file)
						{
							formData.append(file.name, file);
						});
						var ajaxOptions = $.extend(true,
						{
							"method":"POST",
							"contentType":false,
							"processData":false,
							"data":formData,
							"url":"",
							"dataTransfer":dt
						}, options.fileUploadAjaxOptions);

						if(this._dispatchDragEvent(e.originalEvent, "ibx_beforefilesupload", this.element, ajaxOptions).isDefaultPrevented())
							return;

						var deferred = $.ajax(ajaxOptions);
						this._dispatchDragEvent(e.originalEvent, "ibx_filesuploading", this.element, deferred);
					}
					e.preventDefault();
					break;
			}
		},
		_refreshOrig:$.ibi.ibxWidget.prototype._refresh,
		_refresh:function()
		{
			this._refreshOrig.apply(this, arguments);
			var options = this.options;
			this.element.toggleClass("ibx-draggable", !!options.draggable);
		}
	};

	//patch ibxWidget to support drag/drop
	$.extend(true, widgetProto, draggablePatch);
})($.ibi.ibxWidget.prototype)


//# sourceURL=widget.ibx.js
