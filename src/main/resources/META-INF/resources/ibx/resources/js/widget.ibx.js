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
		"tooltip":null,

		//for selection and keyboard naviation (circular tabbing/arrow keys)
		//These are just passthrough options for the attached ibxSelectionManager widget.
		"selType":"none",				//no selection by default.
		"focusRoot":false,				//keep tabbing to this container (like dialogs).
		"focusDefault":false,			//focus the first item in root. (can be a select pattern).
		"navKeyRoot":false,				//keep keyboard navigation to this container (not tabbing, more like arrows in trees/lists/etc.).
		"navKeyDir":"both",				//horizontal = left/right, vertical = up/down, or both
		"navKeyResetFocusOnBlur":true,	//when widget loses focus, reset the current active navKey child.

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
			if(cls == "ibx-tree")
				var x = 10;
				
			this.element.ibxToggleClass(cls, bAdd);
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
		this.element.on("focusin focusout", this._onWidgetFocusEvent.bind(this));
		this.element.on("contextmenu", this._onWidgetContextMenu.bind(this));
		this.element.on("mouseover mouseout mousemove", this._onWidgetMouseEvent.bind(this));
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
	_loadWidgetTemplate:function(tmpl)
	{
		var template = ibx.resourceMgr.getResource(tmpl, false);
		$.extend(true, this.options, ibx.getIbxMarkupOptions(template));

		var children = template.children();
		this.element.append(children);
		ibx.bindElements(children);
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
		aria.label = aria.label || this.element.attr("title");
		aria.label = (typeof(this.options.tooltip) === "string") ? this.options.tooltip : aria.label;

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
		this.element.ibxRemoveClass(this.options.class);
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
		var isTarget = this.element.is(e.target);
		var ownsRelTarget = $.contains(this.element[0], e.relatedTarget);
		if(e.type == "focusin" && !this._widgetFocused)
		{
			this._widgetFocused = true;
			this.element.dispatchEvent("ibx_widgetfocus", e.originalEvent, false, false, e.relatedTarget);
		}
		else
		if(e.type == "focusout" && this._widgetFocused && !ownsRelTarget)
		{
			this._widgetFocused = false;
			this.element.dispatchEvent("ibx_widgetblur", e, false, false, e.relatedTarget);
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
	_ttTimer:null,
	_ttPopup:null,
	_onWidgetMouseEvent:function(e)
	{
		var eType = e.type;
		if(eType == "mouseover" && !this._ttPopup)
		{
			var tt = this.options.tooltip;
			if(typeof(tt) == "string")
				tt = $("<div>").ibxTooltip({"text":tt});
			
			if(tt)
			{
				var popupWidget = tt.data("ibxWidget");
				var delay = popupWidget.options.delay;
				this._ttTimer = window.setTimeout(function(popupWidget)
				{
					popupWidget.option("position", {"my":"left+8 top+22", "at":"left bottom", "of":this._eLastMouse})
					popupWidget.open();
				}.bind(this, popupWidget), delay);
				this._ttPopup = tt;
				e.stopPropagation();
			}
		}
		else
		if(eType == "mouseout" && this._ttPopup && !this._ttPopup.is(e.relatedTarget) && !$.contains(this.element[0], e.relatedTarget))
		{
			window.clearTimeout(this._ttTimer)
			this._ttPopup.ibxWidget("close");
			this._ttPopup = null;
		}
		this._eLastMouse = e;
	},
	children:function(selector)
	{
		return this.element.children(selector);
	},
	add:function(el, elSibling, before, refresh)
	{
		el = $(el);
		elSibling = $(elSibling, this.element);
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
		var changed = value != this.element.ibxHasClass("ibx-widget-disabled");
		if(!changed)
			return;

		this._super(value);
		var wClass = this._widgetClass;
		this.element.ibxToggleClass("ibx-widget-disabled", value);
		this.element.ibxToggleClass(wClass + "-disabled", value);
		if(this.options.class)
			this.element.ibxToggleClass(this.options.class + "-disabled", value);

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

		this.element.ibxAddClass(options.class);
		this.element.ibxToggleClass("ibx-draggable", options.draggable);
		this.element.ibxToggleClass("ibx-external-drop-target", options.externalDropTarget);

		if(options.focusRoot || options.navKeyRoot || options.focusDefault || options.selType != "none")
		{
			var mgrOptions = 
			{
				"type": options.selType,
				"focusDefault": options.focusDefault,
				"focusRoot": options.focusRoot,
				"navKeyRoot": options.navKeyRoot,
				"navKeyDir": options.navKeyDir,
				"focusResetOnBlur": options.navKeyResetFocusOnBlur,
			};
			this.element.ibxSelectionManager();
			this.element.ibxSelectionManager("option", mgrOptions);//need this or options won't get set properly.
		}

		//now config accessibility
		this.setAccessibility();

		//associate widget with the command
		(options.command) ? this.element.attr("data-ibx-command", options.command) : this.element.removeAttr("data-ibx-command");

		//[PD-198] pdf files in ie bleed through divs above.  This stops that!
		if(options.opaque)
		{
			if(!this.element.children(".ibx-opaque-frame").length)
			{
				var path = sformat("{1}{2}", ibx.getPath(), "markup/blank.html");
				var iframe = $("<iframe class='ibx-opaque-frame' allowTransparency='false'>").prop("src", path);
				this.element.ibxAddClass("ibx-opaque").append(iframe);
			}
		}
		else
		{
			this.element.children(".ibx-opaque-frame").remove();
			this.element.ibxRemoveClass("ibx-opaque");
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