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

		//merge in the markup options into the current options...they will be correctly assigned
		//(options map) when init is called after all creates are finished.
		$.extend(this.options, $.ibi.ibxWidget.getIbxMarkupOptions(this.element));
	
		//Ritalin, if ya know what I mean!
		this.element.children("[tabindex]").first().focus();
		
		//assign memember variables
		var memberData = this.element.data("_ibxPrecreateMemberVariables");
		$.extend(this, memberData);
		this.element.removeData("_ibxPrecreateMemberVariables");
		this._super();
	},
	destroyed:function(){return this._destroyed;},
	_destroyed:false,
	_destroy:function()
	{
		this._super();
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
		this._setOptions(this.options);
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
				$el.prop("tabIndex", $el.data("ibxDisabledTabIndex")).data("ibxDisabledTabIndex", null);
		}.bind(this, value));
	},
	member:function(member)
	{
		return this[member];
	},
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
		var ctxEvent = $.Event(e);
		ctxEvent.type = "ibx_ctxmenu";

		var ret = this.element.trigger(ctxEvent);
		if(ctxEvent.isDefaultPrevented() || (!this.options.ctxMenu || !this.element.is(e.currentTarget)))
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
	refresh:function()
	{
		var options = this.options;
		this.element.addClass(options.class);
		options.focusRoot ? this.element.addClass("ibx-focus-root") : this.element.removeClass("ibx-focus-root");
		options.defaultFocused ? this.element.addClass("ibx-default-focused") : this.element.removeClass("ibx-default-focused");
	}
});


$.ibi.ibxWidget.bindElements = function(elements)
{
	//get elements to bind
	var elBound = $();
	var elBind = elements ? $(elements) : $("[data-ibx-type]");

	//construct all the widgets
	elBind.each(function(idx, el)
	{
		var element = $(el);
		var noBind = $.ibi.ibxWidget.coercePropVal(element.attr("data-ibx-no-bind"));
		if(noBind)
			return;

		//construct any unconstructed ancestors first
		var childWidgets = element.find("[data-ibx-type]");
		var childBound = $.ibi.ibxWidget.bindElements(childWidgets);
		elBound = elBound.add(childBound);

		//hook up member variables to the closest nameRoot
		var memberName = element.attr("data-ibx-name");
		if(memberName)
		{
			var nameRoot = element.closest(":ibxNameRoot");
			var nameRootWidget = nameRoot.data("ibxWidget");
			if(nameRootWidget)
				nameRootWidget[memberName] = element;//nameRoot created, set directly
			else
			{
				//nameRoot not created, so store member variable to be set in widget._create
				var memberData = nameRoot.data("_ibxPrecreateMemberVariables") || {};
				memberData[memberName] = element;
				nameRoot.data("_ibxPrecreateMemberVariables", memberData);
			}
		}

		//then construct the parent element, if not already constructed.
		if(element.is("[data-ibx-type]") && !element.is(":ibxWidget"))
		{
			var widgetType = element.attr("data-ibx-type");
			if($.ibi[widgetType])
			{
				var widget = $.ibi[widgetType].call($.ibi, {}, element);
				elBound = elBound.add(widget.element);
			}
			else
			{
				console.error("Unknown ibxWidget type:", widgetType, element[0]);
				debugger;
			}
		}
	}.bind(this));
	return elBound;
};
$.ibi.ibxWidget.getIbxMarkupOptions = function(el)
{
	el = $(el);

	//first get the ibx-options value and convert that to individual options.
	var ibxOptions = el.attr("data-ibx-options") || "{}";
	var options = this.parseIbxOptions(ibxOptions);

	//then overlay any specific options on top.
	var attrs = $(el).prop("attributes");
	for(var i = 0; i < attrs.length; ++i)
	{
		var attr = attrs[i];
		var name = attr.name;
		if(name.search("data-ibxp-") == 0)
		{
			var prop = name.replace("data-ibxp-", "");
			prop = $.camelCase(prop);
			var option = attr.value[0] == "{" ? this.parseIbxOptions(attr.value) : null; //check for '{' to see if we parse as object.
			options[prop] = option ? $.extend(true, options[prop], option) : attr.value;
		}
	}

	//go through the options and make sure the true/false/1/0 strings are turned into native types.
	$.each(options, function(name, value)
	{
		this[name] = $.ibi.ibxWidget.coercePropVal(value);
	}.bind(options));
	return options;
};
$.ibi.ibxWidget.parseIbxOptions = function(opts)
{
	return eval("("+ opts +")");
};
$.ibi.ibxWidget.coercePropVal = function (val)
{
	if(typeof(val) == "string" && val.length)
	{
		var tempVal = $.trim(val.toLowerCase());
		if (tempVal == "true")
			val = true;
		else
		if (tempVal == "false")
			val = false;
		else
		if (!isNaN(tempVal = Number(val)))
			val = tempVal;
	}
	return val;
};

$.ibi.ibxWidget.statics = 
{
};

$(function()
{
	//$.ibi.ibxWidget.bindElements()
});
//# sourceURL=widget.ibx.js
