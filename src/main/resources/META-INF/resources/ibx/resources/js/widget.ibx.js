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
		//_setOptions will respect the options map.
		this.option($.extend(true, {}, this.options, ibx.getIbxMarkupOptions(this.element)));
		this.refresh();
	},
	option:function(key, value)
	{
		//retrieve mapped options.
		if(typeof key === "string" && this.options.optionsMap[key] && !value)
			return this._super(this.options.optionsMap[key]);
		else
			return this._superApply(arguments);
	},
	_setOption:function(key, value)
	{
		//map option to option.option.xxx. Used mostly for Bindows markup property setting.
		if(this.options.optionsMap[key])
		{
			this.option(this.options.optionsMap[key], value);
			delete this.options[key];//mapped option keys should be removed from main options object so things don't get set twice (like text on a label).
		}
		else
			this._super(key, value);

		if(this._created)
		{
			this.element.removeClass(this.options.class);
			this.refresh();
		}
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
	refreshEx: function (childRefresh)
	{
		this.element.find(':ibxWidget').filter(childRefresh || '*').ibxWidget('refresh');
	},
	refresh:function()
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
		{
			this._resizeSensor = new ResizeSensor(this.element[0], this._onResize.bind(this));
		}
	}
});


(function(widgetProto)
{
	var draggablePatch = 
	{
		options:
		{
			draggable:false,
			dragEffect:"all",
			dragImage:null,
			dragImageX:0,
			dragImageY:16,
			dragData:"",

			droppable:false,
			dropEffect:"move" //copy,move,link
		},
		_createOrig:$.ibi.ibxWidget.prototype._create,
		_create:function()
		{
			this._createOrig.apply(this, arguments);
			this._onNativeDragEventBound = this._onNativeDragEvent.bind(this);
		},
		_onNativeDragEvent:function(e)
		{
			e = e.originalEvent;
			var options = this.options;
			var dt = e.dataTransfer;
			var data = dt.getData("text");

			/***** IE ONLY SUPPORTS THE DATA TYPE OF => text/plain <= SO USE THAT ALWAYS! *****/
			switch(e.type)
			{
				/****DRAG SOURCE EVENTS****/
				case "dragstart":
					if(!this._dragStart(e))//prevent default will stop drag
						e.preventDefault();
					else
						this.element.addClass("ibx-dragging");

					var dragImage = $(this.options.dragImage);
					if(dragImage.length)
						dt.setDragImage($(options.dragImage)[0], options.dragImageX, options.dragImageY);
					break;
				case "dragend":
					this.element.removeClass("ibx-dragging");
					break;

				/****DROP TARGET EVENTS****/
				case "dragenter":
				case "dragover":
					if(this._dragOver(e, e.dataTransfer.getData("text")))//prevent default will allow drop
					{
						e.preventDefault();
						dt.dropEffect = options.dropEffect;
						this.element.addClass("ibx-drag-target");
					}
					break;
				case "dragexit":
				case "dragleave":
					this.element.removeClass("ibx-drag-target");
					break;
				case "drop":
					if(this._dragDrop(e, e.dataTransfer.getData("text")))//prevent default will stop default behavior (open as link for some elments)
						e.preventDefault();
					this.element.removeClass("ibx-dragging ibx-drag-target");
					break;
				default:
					break;
			}

		},
		_dragStart:function(e){return true},
		_dragOver:function(){return true;},
		_dragDrop:function(e){return true;},
		_refreshOrig:$.ibi.ibxWidget.prototype.refresh,
		refresh:function()
		{
			this._refreshOrig.apply(this, arguments);
			var options = this.options;

			var dragEvents = 
			{
				"dragstart":	this._onNativeDragEventBound,
				"dragend":		this._onNativeDragEventBound,
			}
			if(this._isDraggable && !options.draggable)
				this.element.off(dragEvents);
			else
			if(!this._isDraggable && options.draggable)
				this.element.on(dragEvents);
			this._isDraggable = options.draggable;

			var dropEvents = 
			{
				"dragstart":	this._onNativeDragEventBound,
				"dragend":		this._onNativeDragEventBound,
				"dragenter":	this._onNativeDragEventBound,
				"dragexit":		this._onNativeDragEventBound,
				"dragover":		this._onNativeDragEventBound,
				"dragleave":	this._onNativeDragEventBound,
				"drop":			this._onNativeDragEventBound
			}
			if(this._isDroppable && !options.droppable)
				this.element.off(dropEvents);
			else
			if(!this._isDroppable && options.droppable)
				this.element.on(dropEvents);
			this._isDroppable = options.droppable;

			this.element.attr("draggable", this._isDraggable).toggleClass("ibx-draggable", options.draggable).toggleClass("ibx-droppable", options.droppable);
		}
	};

	//patch ibxWidget to support drag/drop
	$.extend(true, widgetProto, draggablePatch);
})($.ibi.ibxWidget.prototype)




//# sourceURL=widget.ibx.js
