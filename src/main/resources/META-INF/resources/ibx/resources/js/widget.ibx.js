/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxWidget", $.Widget, 
{
	options:
	{
		"class":"",
		"nameRoot":false,
		"ctxMenu":null,
		"dragScrolling":false,
		"wantResize":false,
		"defaultFocused":false,					//for popup...should this be focused on open
		
		//for circular tabbing
		"focusRoot":false,						//for circular tabbing management...like in a dialog.
		
		//for keyboard arrows navigation (mostly composite widgets like menus/selects/etc...508)
		"navKeyRoot":false,						//start key nav here
		"navKeyDir": "horizontal",				//horizontal = left/right, vertical = up/down, or both
		"navKeyAutoFocus":false,				//do an initial nav when this gets focus (basically focus first child or last active item)
		"navKeyResetFocusOnBlur": false,		//when widget loses focus, reset the current active navKey child.

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
		accessible ? this.element.ibxAriaId().attr("role", aria.role) : this.element.removeIbxAriaId().removeAttr("role", aria.role);

		aria = this._setAccessibility(accessible, aria);
		aria.labelledby = aria.label ? null : aria.labelledby; //can't have aria-label and aria-labelledby at same time...label wins.

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
		
		this.element.removeAttr("data-ibx-type");
		this.element.removeClass(this.options.class);
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
				console.warn("Overwriting member '" + memberName + "' in nameroot, info=>", {nameRoot:this, memberExisting:this[memberName], memberOverwrite:value});
			this[memberName] = value;
		}
		return ret || $();
	},
	_resizeCallback:function()
	{
		this._trigger("resize");
	},
	_onWidgetFocusEvent:function(e)
	{
		var options = this.options;
		var isTarget = this.element.is(e.target);
		var isRelTarget = this.element.is(e.relatedTarget);
		var ownsTarget = $.contains(this.element[0], e.target);
		var ownsRelTarget = $.contains(this.element[0], e.relatedTarget);

		//manage the global widget focus states...that is, for complex widgets (subwidget)...treat this as a single unit.
		if(!isRelTarget && !ownsRelTarget && (isTarget || ownsTarget))
		{
			if(e.type == "focusin")
			{
				if((options.navKeyAutoFocus !== false) && isTarget)
				{
					//auto focus - default to the first focusable child (or last active)
					var focusable = this.element.find((options.navKeyAutoFocus === true) ? ":ibxFocusable" : options.navKeyAutoFocus);
					var focusItem = (options.navKeyAutoFocus === true) ? focusable.filter(".ibx-nav-item-active") : focusable;
					focusItem.length ? focusItem.focus() : focusable.first().focus();

					//take this element out of the tab order...so that shift+tab will go from child to natural prev tab item.
					this.element.data("navKeyRootTabIndex", this.element.prop("tabIndex")).prop("tabIndex", -1);
				}

				this._trigger("widgetfocus", e);
			}
			else
			if(e.type == "focusout")
			{
				//active items and tabbing are handled in a given 'context'...popups introduce a higher context, so ignore them here.
				if(!$(e.relatedTarget).is(".ibx-popup"))
				{
					//remove active so next focus goes to first item.
					if(options.navKeyResetFocusOnBlur)
						this.children().removeClass("ibx-nav-item-active").removeAttr("aria-activedescendant");
				
					//put this element back in the tab order...so that next tab into will will do auto-focus.
					if(options.navKeyAutoFocus)
						this.element.prop("tabIndex", this.element.data("navKeyRootTabIndex")).removeData("navKeyRootTabIndex");
				
				}

				this._trigger("widgetblur", e);
			}
		}

		//manage states of children
		if(e.type == "focusin" && !isTarget && ownsTarget && this.options.navKeyRoot)
		{
			var children = this.children();
			children.removeClass("ibx-nav-item-active").removeAttr("aria-activedescendant");
			$(e.target).addClass("ibx-nav-item-active").attr("aria-activedescendant", true);
		}
	},
	_onWidgetKeyEvent:function(e)
	{
		//if specified, keep traversal of children localized and circular within this widget.  
		//tabbing is for things like popups/dialogs, and arrows for composite widgets (menus/selects)...ARIA support relies on this.
		var options = this.options;
		if(options.focusRoot && e.keyCode == $.ui.keyCode.TAB)
		{
			var tabKids = $(this.element).find(":ibxFocusable");
			var target = null;
			if(tabKids.first().is(e.target) && e.shiftKey)
				target = tabKids.last();
			else
			if(tabKids.last().is(e.target) && !e.shiftKey)
				target = tabKids.first();

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
		if(options.navKeyRoot && (-1 != $.ibi.ibxWidget.navKeys.indexOf(e.keyCode)))
		{
			var navKids = this.element.find(":ibxFocusable");
			var active = current = navKids.filter(".ibx-nav-item-active");
			if(active)
			{
				if(e.keyCode == $.ui.keyCode.HOME)
					active = navKids.first();
				else
				if(e.keyCode == $.ui.keyCode.END)
					active = navKids.last();
				else
				if(options.navKeyDir == "horizontal" || options.navKeyDir == "both")
				{
					if(e.keyCode == $.ui.keyCode.LEFT)
					{
						var prev = active.prevAll(":ibxFocusable").first();
						active = prev.length ? prev : navKids.last();
					}
					else
					if(e.keyCode == $.ui.keyCode.RIGHT)
					{
						var next = active.nextAll(":ibxFocusable").first();
						active = next.length ? next : navKids.first();
					}
				}
				else
				if(options.navKeyDir == "vertical" || options.navKeyDir == "both")
				{
					if(e.keyCode == $.ui.keyCode.UP)
					{
						var prev = active.prevAll(":ibxFocusable").first();
						active = prev.length ? prev : navKids.last();
					}
					else
					if(e.keyCode == $.ui.keyCode.DOWN)
					{
						var next = active.nextAll(":ibxFocusable").first();
						active = next.length ? next : navKids.first();
					}
				}
			}
			else
				active = navKids.first();

			var event = $.Event(e);
			event.type = "ibx_beforekeynav";
			event.target = active;
			event.relatedTarget = current;
			this.element.trigger(event);
			if(!event.isDefaultPrevented())
			{
				active.focus();
				e.stopPropagation();
				e.preventDefault();
			}
		}
		else
		if(options.navKeyRoot && e.keyCode == $.ui.keyCode.ESCAPE)
			this.element.focus();//on escape with a navkeyroot, focus the parent.
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
			var tabIndex = el.data("ibxDisabledTabIndex");
			var tabIndexSet = tabIndex !== undefined;
			if(!disabled && tabIndexSet)
				el.prop("tabIndex", tabIndex).removeData("ibxDisabledTabIndex");
			else
			if(disabled && !tabIndexSet)
				el.data("ibxDisabledTabIndex", el.prop("tabIndex")).prop("tabIndex", -1);
		}.bind(this, value));
	},
	refreshEx:function (childRefresh)
	{
		this.element.find(':ibxWidget').filter(childRefresh || '*').add(this.element).ibxWidget('refresh');
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
		this.element.toggleClass("ibx-default-focused", options.defaultFocused);
		this.setAccessibility();

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
$.ibi.ibxWidget.navKeys = [$.ui.keyCode.LEFT, $.ui.keyCode.RIGHT, $.ui.keyCode.UP, $.ui.keyCode.DOWN, $.ui.keyCode.HOME, $.ui.keyCode.END];

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
	_p.dragXOffset = 0;
	_p.dragYOffset = 0;
	_p.setDragImage = function(img, xOffset, yOffset)
	{
		this._dragImage = $(img);
		this.dragXOffset = xOffset || this.dragXOffset;
		this.dragYOffset = yOffset || this.dragYOffset;
	};

	var draggablePatch = 
	{
		options:
		{
			draggable:false,			//!!!!IBX DRAGGABLE!!!! ...NOTHING TO DO WITH NATIVE DRAG/DROP
			dragClass:"ibx-drag-source",
			dragImageClass:"ibx-default-drag-image",
			dragStartDistanceX:5,
			dragStartDistanceY:5,

			nativeDropTarget:false,		//!!!!NATIVE DROP!!!!
			fileUploadAjaxOptions:
			{
			}
		},
		_createOrig:$.ibi.ibxWidget.prototype._create,
		_create:function()
		{
			this._onDragMouseEventBound = this._onDragMouseEvent.bind(this);
			this._onDragKeyEventBound = this._onDragKeyEvent.bind(this);
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
			var width = el.outerWidth();
			var height = el.outerHeight();
			var clone = el.clone().css({"width":width + "px", "height":height + "px"});
			return clone;
		},
		isDragging:function(){return this.element.hasClass(this.options.dragClass);},
		_dispatchDragEvent:function(e, type, target, relatedTarget, data)
		{
			var dEvent = $.Event(e);
			dEvent.type = type;
			dEvent.target = (target instanceof jQuery) ? target[0] : target;
			dEvent.relatedTarget =(relatedTarget instanceof jQuery) ?  relatedTarget[0] : relatedTarget;
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
			
			delete this._dataTransfer;
			delete this._curTarget;
			delete this._mDownLoc;

			$("body").css("pointerEvents", "");
			$("html").off("mouseup mousemove", this._onDragMouseEventBound).css("cursor", "");

			this.element.removeClass(this.options.dragClass);
		},
		_onDragKeyEvent:function(e)
		{
			if(e.keyCode == 27)
				this.endDrag("ibx_dragcancel", e);
		},
		_onDragMouseEvent:function(e)
		{
			var options = this.options;
			var e = e.originalEvent;
			var eType = e.type;
			switch(eType)
			{
				case "mousedown":
					this._mDownLoc = {"x":e.clientX, "y":e.clientY};
					$("html").on("mouseup mousemove", this._onDragMouseEventBound);
					this._curTarget = $();
					break;
				case "mouseup":
					if(this.isDragging())
					{
						//if allowed let target know it was dropped on
						if(!this._curTarget._dragPrevented)
							this._dispatchDragEvent(e, "ibx_drop", this._curTarget, this.element);
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
						$("body").css("pointerEvents", "none");
						e.stopPropagation();

						this._dataTransfer = new ibxDataTransfer();
						dEvent = this._dispatchDragEvent(e, "ibx_dragstart", this.element);
						if(!dEvent.isDefaultPrevented())
						{
							this.element.addClass(options.dragClass);
							var img = this.getDefaultDragImage(this.element).addClass(options.dragImageClass);
							this._dataTransfer.setDragImage(img);
						}
					}

					if(isDragging)
					{
						//what's the current ibx droppable target...have to do this weird thing with the pointerEvents
						//because the browsers (Chrome) won't find a no pointer event node in elementFromPoint
						$("body").css("pointerEvents", "");
						var elTarget = $(document.elementFromPoint(e.clientX, e.clientY));
						$("body").css("pointerEvents", "none");

						//manage the current target
						if(!this._curTarget.is(elTarget))
						{
							//new drop target so reset the effect.
							this._dataTransfer.dropEffect = "not-allowed";

							//spit out events for source/target
							dEvent = this._dispatchDragEvent(e, "ibx_dragleave", this.element, elTarget);
							dEvent = this._dispatchDragEvent(e, "ibx_dragexit", this._curTarget, elTarget);
							dEvent = this._dispatchDragEvent(e, "ibx_dragenter", this.element, this._curTarget);

							//if mouse up happens next, then are we allowed to drop?
							this._curTarget = elTarget;
							this._curTarget._dragPrevented = dEvent.isDefaultPrevented();
						}

						//send drag messages if 'ibx_dragover' was not prevented
						dEvent = this._dispatchDragEvent(e, "ibx_drag", this.element, this._curTarget);
						dEvent = this._dispatchDragEvent(e, "ibx_dragover", this._curTarget, this.element);

						//figure out the cursor
						var cursor = "not-allowed";
						if(this._dataTransfer.effectAllowed == "all")
							cursor = this._dataTransfer.dropEffect;
						else
						if(this._dataTransfer.effectAllowed == this._dataTransfer.dropEffect)
							cursor = this._dataTransfer.dropEffect;
						$("html").css("cursor", cursor);

						//manage the drag cursor
						if(this._dataTransfer._dragImage)
						{	
							$(this._dataTransfer._dragImage).css(
							{
								"left":e.clientX + this._dataTransfer.dragXOffset + "px",
								"top":e.clientY + this._dataTransfer.dragYOffset + "px",
							}).appendTo("body.ibx-root");
						}
					}
					break;

				/*file drop target native drag/drop event handling*/
				case "dragover":
				case "dragleave":
				case "drop":
					dEvent = this._dispatchDragEvent(e, "ibx_" + eType, this.element, e.relatedTarget);
					var dt = e.dataTransfer;
					if(eType == "drop" && !dEvent.defaultPrevented && dt.files.length)
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

						if(this._dispatchDragEvent(e, "ibx_beforefilesupload", this.element, e.relatedTarget, ajaxOptions).isDefaultPrevented())
							return;

						var deferred = $.ajax(ajaxOptions);
						this._dispatchDragEvent(e, "ibx_filesuploading", this.element, e.relatedTarget, deferred);
					}
					e.preventDefault();
					e.stopPropagation();
					break;
			}
		},
		_refreshOrig:$.ibi.ibxWidget.prototype._refresh,
		_refresh:function()
		{
			this._refreshOrig.apply(this, arguments);
			var options = this.options;
			(options.draggable) ? this.element.on("mousedown", this._onDragMouseEventBound) : this.element.off("mousedown", this._onDragMouseEventBound);
			(options.draggable) ? this.element.on("keydown", this._onDragKeyEventBound) : this.element.off("keydown", this._onDragKeyEventBound);
			(options.nativeDropTarget) ? this.element.on("dragover dragleave drop", this._onDragMouseEventBound) : this.element.off("dragover dragleave drop", this._onDragMouseEventBound);

			this.element.toggleClass("ibx-draggable", !!options.draggable);
		}
	};

	//patch ibxWidget to support drag/drop
	$.extend(true, widgetProto, draggablePatch);
})($.ibi.ibxWidget.prototype)


//# sourceURL=widget.ibx.js
