/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxWidget", $.Widget, 
{
	options:
	{
		"class":"",
		"nameRoot":false,
		"focusRoot":false,
		"defaultFocused":false,
		"ctxMenu":null,
		"dragScrolling":false,
		"wantResize":false,

		//map one option to another...useful for deep option mapping, looks like: visibleOptionName:"myInternalObject.optionName
		"optionsMap":
		{
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
		this.element.on("click keydown keypress", this._onFocusRootEvent.bind(this));
		this.element.on("contextmenu", this._onWidgetContextMenu.bind(this));
		this._adjustWidgetClasses(true);

		//Ritalin, if ya know what I mean!
		this.element.children("[tabindex]").first().focus();
		
		//assign memember variables
		var memberData = this.element.data("_ibxPrecreateMemberVariables");
		$.each(memberData, function(memberName, memberValue)
		{
			this.member(memberName, memberValue);
		}.bind(this));
		this.element.removeData("_ibxPrecreateMemberVariables");

		this._super();
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
		this.element.removeData("ibxWidget");
		this.element.removeAttr("data-ibx-type");
		this.element.removeClass(this.options.class);
		this._adjustWidgetClasses(false);
		this._created = false;
		this._destroyed = true;
		this._trigger("destroy");
	},
	_init:function()
	{
		var options = $.extend({}, this.options, ibx.getIbxMarkupOptions(this.element))
		this.option(options);
	},
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
	_onResize:$.noop,
	_onFocusRootEvent:function(e)
	{
		if(this.options.focusRoot)
		{
			if(e.keyCode == 9)
			{
				var elActive = $(document.activeElement).closest("[tabIndex][tabIndex != -1]");
				var tabKids = $(this.element).find(":ibxFocusable");
				var curIdx = tabKids.index(elActive);
				var target = null;
				if(e.shiftKey)
					target = (0 == curIdx) ? tabKids.last() : tabKids[--curIdx];
				else
					target = ((tabKids.length - 1) == curIdx) ? tabKids.first() : tabKids[++curIdx];

				target = $(target);
				var ret = this._trigger("focusing", null, {"target":target, "relatedTarget":elActive});
				if(ret)
					target.focus();
				e.preventDefault();
			}
			e.stopPropagation();
		}
	},
	_onWidgetContextMenu:function(e)
	{
		var ctxEvent = $.Event(e.originalEvent);
		ctxEvent.type = "ibx_ctxmenu";

		var ret = this.element.trigger(ctxEvent);
		if(ctxEvent.isDefaultPrevented() || !this.element.is(e.currentTarget))
			return;

		ctxMenu = ctxEvent.result || $(this.options.ctxMenu);
		if(ctxMenu.length)
		{
			ctxMenu.ibxWidget("option", "position", {my:"", at:""});
			ctxMenu.offset({top:e.clientY, left:e.clientX});
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
	remove:function(el, refresh)
	{
		this.element.children().filter(el).detach();
		if(refresh)
			this.refresh();
	},
	option:function(key, value)
	{
		//console.warn("The problem with the data-ibxp-label-options.text is that when 'option' is called with object, it doesn't decode the '.' values into sub options.");
		var ret = null;
		var key = this.options.optionsMap[key] || key;
		if(value !== undefined)
			ret = this._super(key, value);
		else
			ret = this._super(key);

		this.refresh();
		return ret;
	},
	_setOption:function(key, value)
	{
		if(value instanceof Object)
			this._super(key, value);
		else
		if(this.options.optionsMap[key])
		{
			//map option to option.option.xxx this makes markup clearer to read
			curValue = this.option(this.options.optionsMap[key]);
			if(curValue != value)
			{
				this.option(this.options.optionsMap[key], value);
				this._needsRefresh = true;
			}

			//mapped option keys can show up on the main options when set from markup...it's complicated...just delete them here as they aren't needed.
			delete this.options[key];
		}
		else
		if(this.options[key] != value)
			this._super(key, value);
		return this;
	},
	_setOptionDisabled:function(value)
	{
		this._super(value);
		var wClass = this._widgetClass;
		(value) ? this.element.addClass("ibx-widget-disabled") : this.element.removeClass("ibx-widget-disabled");
		(value) ? this.element.addClass(wClass + "-disabled") : this.element.removeClass(wClass + "-disabled");
		if(this.options.class)
			(value) ? this.element.addClass(this.options.class + "-disabled") : this.element.removeClass(this.options.class + "-disabled");

		this.element.find("[tabIndex]").add(this.element).each(function(disabled, idx, el)
		{
			var $el = $(el);
			if(disabled)
				$el.data("ibxDisabledTabIndex", $el.prop("tabIndex")).prop("tabIndex", -1);
			else
			{
				var tabIndex = $el.data("ibxDisabledTabIndex");
				(!tabIndex) ? $el.removeProp("tabIndex") : $el.prop("tabIndex", tabIndex);
				$el.removeData("ibxDisabledTabIndex");
			}
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
		options.focusRoot ? this.element.addClass("ibx-focus-root") : this.element.removeClass("ibx-focus-root");
		options.defaultFocused ? this.element.addClass("ibx-default-focused") : this.element.removeClass("ibx-default-focused");
	
		//hookup the resize sensor if interested in resize events.
		if(!options.wantResize && this._resizeSensor)
		{
			this._resizeSensor.detach();
			delete this._resizeSensor;
		}
		else
		if(options.wantResize && !this._resizeSensor)
			this._resizeSensor = new ResizeSensor(this.element[0], this._onResize.bind(this));
	}
});

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
		this._dragXOffset = xOffset || this.dragXOffset;
		this._dragYOffset = yOffset || this.dragYOffset;
	};

	var draggablePatch = 
	{
		options:
		{
			droppable:false,
			draggable:false,
			dragClass:"ibx-drag-source",
			dropTargetClass:"ibx-drop-target",
			dragStartDistanceX:5,
			dragStartDistanceY:5,
			dragImageClass:"ibx-default-drag-image",
			fileUploadAjaxInfo:
			{
			}
		},
		_createOrig:$.ibi.ibxWidget.prototype._create,
		_create:function()
		{
			this._createOrig.apply(this, arguments);
			this._onDragMouseEventBound = this._onDragMouseEvent.bind(this);
		},
		getDefaultDragImage:function(el)
		{
			var def = $.Deferred();
			var hc = html2canvas(el,
			{
				onrendered:function(def, canvas)
				{
					$(canvas).css("pointer-events", "none").addClass(this.options.dragImageClass);

					def.resolve(canvas);	
				}.bind(this, def)
			});
			return def;
		},
		isDragging:function(){return this.element.hasClass(this.options.dragClass);},
		isDropTarget:function(){return this.element.hasClass(this.options.dropTargetClass);},
		_dispatchDragEvent:function(e, type, target, relatedTarget)
		{
			var dEvent = $.Event(e);
			dEvent.type = type;
			dEvent.target = (target instanceof jQuery) ? target[0] : target;
			dEvent.relatedTarget =(relatedTarget instanceof jQuery) ?  relatedTarget[0] : relatedTarget;
			dEvent.dataTransfer = this._dataTransfer || e.dataTransfer;
			$(target).trigger(dEvent);
			return dEvent;
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
							this._dispatchDragEvent(e, "ibx_drop", this._curTarget);

						//end the drag operation
						this._dispatchDragEvent(e, "ibx_dragend", this.element);
						$(this._dataTransfer._dragImage).remove();
						this.element.removeClass(options.dragClass);
						this._curTarget.removeClass(options.dropTargetClass);
						delete this._dataTransfer;
						delete this._curTarget;
					}

					$("body").css("pointerEvents", "");
					$("html").off("mouseup mousemove", this._onDragMouseEventBound).css("cursor", "");

					delete this._mDownLoc;
					this.element.removeClass(this.options.dragClass);
					break;
				case "mousemove":
					var dEvent = null;
					var dx = Math.abs(e.clientX - this._mDownLoc.x);
					var dy = Math.abs(e.clientY - this._mDownLoc.y);
					var isDragging = this.isDragging();
					if(!isDragging && (dx >= this.options.dragStartDistanceX || dy >= this.options.dragStartDistanceY))
					{
						$("body").css("pointerEvents", "none");
						e.stopPropagation();

						this._dataTransfer = new ibxDataTransfer();
						dEvent = this._dispatchDragEvent(e, "ibx_dragstart", this.element);
						if(!dEvent.isDefaultPrevented())
						{
							this.element.addClass(this.options.dragClass);
							this._dataTransfer.dragImage = this.getDefaultDragImage(this.element).done(function(img)
							{
								this._dataTransfer._dragImage = this._dataTransfer._dragImage || img;
							}.bind(this));
						}
					}

					if(isDragging)
					{
						//what's the current droppable target...have to do this weird thing with the pointerEvents
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

							//cleanup
							this._curTarget.removeClass(this.options.dropTargetClass);
							this._curTarget = elTarget.addClass(options.dropTargetClass);
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
								"pointerEvents":"none",
								"position":"absolute",
								"left":e.clientX + this._dataTransfer.dragXOffset + "px",
								"top":e.clientY + this._dataTransfer.dragYOffset + "px",
							}).appendTo("body");
						}
					}
					break;
				/*Native drag/drop event handling*/
				case "dragover":
				case "dragleave":
				case "drop":
					dEvent = this._dispatchDragEvent(e, "ibx_" + eType, this.element, e.relatedTarget);
					var dt = e.dataTransfer;
					if(eType == "drop" && !dEvent.defaultPrevented && dt.files.length)
					{
						e.preventDefault();
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
						}, options.fileUploadAjaxInfo);
						$.ajax(ajaxOptions);
					}
					break;
			}
		},
		_refreshOrig:$.ibi.ibxWidget.prototype._refresh,
		_refresh:function()
		{
			this._refreshOrig.apply(this, arguments);
			var options = this.options;
			(options.draggable) ? this.element.on("mousedown", this._onDragMouseEventBound) : this.element.off("mousedown", this._onDragMouseEventBound);
			(options.droppable) ? this.element.on("dragover dragleave drop", this._onDragMouseEventBound) : this.element.off("dragover dragleave drop", this._onDragMouseEventBound);

			this.element.toggleClass("ibx-draggable", options.draggable);
			this.element.toggleClass("ibx-droppable", options.droppable);
		}
	};

	//patch ibxWidget to support drag/drop
	$.extend(true, widgetProto, draggablePatch);
})($.ibi.ibxWidget.prototype)


//# sourceURL=widget.ibx.js
