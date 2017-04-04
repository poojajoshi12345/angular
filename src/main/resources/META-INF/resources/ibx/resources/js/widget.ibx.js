/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:
function IbxWidget()
{
	if (_biInPrototype) return;
	BiComponent.call(this);

	this.setAppearance("");
	this.setCssClassName("");
	this._widgetProps = {};
	this._widgetCtor = $.ibi.ibxWidget;
	this.addEventListener("create", this.__onWidgetCreate, this);
}
_p = _biExtend(IbxWidget, BiComponent, "IbxWidget");
IbxWidget.base = BiComponent.prototype;

IbxWidget.addHtmlProperty = function(wClass, propName, mapTo)
{
	var p = wClass.prototype;
	var capitalized = propName.capitalize();
	p["get" + capitalized] = function()
	{
		return this.getHtmlProperty(mapTo || propName);
	};
	p["set" + capitalized] = function(value)
	{
		this.setHtmlProperty(mapTo || propName, value);
	};
};
IbxWidget.addCssProperty = function(wClass, cssName, mapTo)
{
	var p = wClass.prototype;
	var capitalized = cssName.capitalize();
	p["get" + capitalized] = function()
	{
		return this.getStyleProperty(mapTo || cssName);
	};
	p["set" + capitalized] = function(value)
	{
		this.setStyleProperty(mapTo || cssName, value);
	};
};
IbxWidget.addWidgetFunction = function(wClass, fnName)
{
	wClass.prototype[fnName] = function()
	{
		return this._widget[fnName].apply(this._widget, arguments);
	};
};
IbxWidget.addWidgetEvent = function(wClass, eType, eventNamespace)
{
	eventNamespace = (eventNamespace !== undefined) ? eventNamespace : "ibx_";
	var _p = wClass.prototype;
	_p._widgetEvents = _p._widgetEvents || {};
	_p._widgetEvents[eventNamespace + eType.toLowerCase()] = true;
};
IbxWidget.addWidgetMember = function(wClass, mName, wName, biClass, bAnonymous)
{
	var _p = wClass.prototype;
	_p._widgetMembers = _p._widgetMembers || {};
	_p._widgetMembers[mName] = {"wName": wName, "biClass": biClass, "bAnonymous": !!bAnonymous};
};
IbxWidget.addWidgetProperty = function(wClass, sName, mapTo)
{
	var p = wClass.prototype;
	var capitalized = sName.capitalize();
	sName = "_" + sName;
	p["get" + capitalized] = function ()
	{
		return this.getWidgetProperty(mapTo || sName);
	};
	p["set" + capitalized] = function (v)
	{
		this.setWidgetProperty(mapTo || sName, v);
	};
};
_p.getWidgetProperty = function(sPropertyName)
{
	var ret = null;
	if(this._widget)
		ret = this._widget.option(sPropertyName.replace(/^_/, ""));
	return ret;
};
_p.setWidgetProperty = function(sPropertyName, oValue)
{
	this._widgetProps[sPropertyName.replace(/^_/, "")] = oValue;
	this.updateWidget();
};

IbxWidget.addWidgetFunction(IbxWidget,"refresh");
IbxWidget.addWidgetFunction(IbxWidget,"enable");
IbxWidget.addWidgetFunction(IbxWidget,"disable");
IbxWidget.addWidgetFunction(IbxWidget,"destroy");
IbxWidget.addWidgetFunction(IbxWidget,"member");

IbxWidget.addWidgetEvent(IbxWidget,"create");
IbxWidget.addWidgetEvent(IbxWidget,"dragstart", "");
IbxWidget.addWidgetEvent(IbxWidget,"drag", "");
IbxWidget.addWidgetEvent(IbxWidget,"dragenter", "");
IbxWidget.addWidgetEvent(IbxWidget,"dragexit", "");
IbxWidget.addWidgetEvent(IbxWidget,"dragleave", "");
IbxWidget.addWidgetEvent(IbxWidget,"dragover", "");
IbxWidget.addWidgetEvent(IbxWidget,"drop", "");
IbxWidget.addWidgetEvent(IbxWidget,"dragend", "");

IbxWidget.addHtmlProperty(IbxWidget,"title");
IbxWidget.addHtmlProperty(IbxWidget,"draggable");

IbxWidget.addCssProperty(IbxWidget,"flex");
IbxWidget.addCssProperty(IbxWidget,"order");
IbxWidget.addCssProperty(IbxWidget,"alignSelf");
IbxWidget.addCssProperty(IbxWidget,"display");
IbxWidget.addCssProperty(IbxWidget,"position");
IbxWidget.addCssProperty(IbxWidget,"width");
IbxWidget.addCssProperty(IbxWidget,"height");
IbxWidget.addCssProperty(IbxWidget,"marginAll","margin");
IbxWidget.addCssProperty(IbxWidget,"marginLeft");
IbxWidget.addCssProperty(IbxWidget,"marginRight");
IbxWidget.addCssProperty(IbxWidget,"marginTop");
IbxWidget.addCssProperty(IbxWidget,"marginBottom");
IbxWidget.addCssProperty(IbxWidget,"padding");
IbxWidget.addCssProperty(IbxWidget,"paddingLeft");
IbxWidget.addCssProperty(IbxWidget,"paddingRight");
IbxWidget.addCssProperty(IbxWidget,"paddingTop");
IbxWidget.addCssProperty(IbxWidget,"paddingBottom");
IbxWidget.addCssProperty(IbxWidget,"borderLeft");
IbxWidget.addCssProperty(IbxWidget,"borderRight");
IbxWidget.addCssProperty(IbxWidget,"borderTop");
IbxWidget.addCssProperty(IbxWidget,"borderBottom");
IbxWidget.addCssProperty(IbxWidget,"font");

IbxWidget.addWidgetProperty(IbxWidget,"class");
IbxWidget.addWidgetProperty(IbxWidget,"focusRootIbx", "focusRoot");
IbxWidget.addWidgetProperty(IbxWidget,"defaultFocused");
IbxWidget.addWidgetProperty(IbxWidget, "ctxMenu");
IbxWidget.addWidgetProperty(IbxWidget,"disabled");

IbxWidget.addWidgetProperty(IbxWidget, "subProperty", "subObject.subsubobject.subProperty");

_p._tagName = "DIV";
_p._widget = null;
_p._widgetCtor = null;
_p._widgetProps = null;
_p.getWidget = function(widgetType){return $(this._element).data(widgetType || "ibxWidget");};
_p.bindWidget = function(el, dataInstance, oDocument, widgetProps)
{
	dataInstance = dataInstance || "ibxWidget";
	var ret = null;
	var widget = $(el).data(dataInstance) || this._widgetCtor.call(this._widgetCtor, {}, this._element);
	if(widget)
	{
		this._widget = widget;
		this._document = oDocument || document;
		this._element = widget.element[0];
		this._element._biComponent = this;
		this.setHtmlProperty("className", widget.element.prop("class"));
		this.setHtmlProperty("tabIndex", this._htmlProperties["tabIndex"] || widget.element.prop("tabIndex"));
		this._setHtmlAttributes();
		this._setHtmlProperties();
		this._setCssProperties();
		this._bindWidgetMembers();
		this._bindWidgetEvents();
		this._created = true;
		this._widgetDestroyed = false;
		widget.options.destroy = this._onWidgetDestroyed.bind(this);
		this.updateWidget(this._widgetProps);//must update because mapped properties weren't handled when passed to widget constructor above.

		//hook up parent/child relationship...if no parent yet...use application window (document.body)
		var parent = widget.element.parents(":biComponent").prop("_biComponent") || application.getWindow();
		if(parent && !this._parent)
		{
			parent._children.push(this);
			this._parent = parent;
		}

		this.dispatchEvent("widgetbound");
		ret = this;
	}
	return ret;
};
_p._bindWidgetMembers = function()
{
	for(var key in this._widgetMembers)
	{
		var mInfo = this._widgetMembers[key];
		var wMember = this._widget[mInfo.wName];
		this[key] = wMember;
		if(mInfo.biClass)
		{
			var c = this[key] = (new mInfo.biClass()).bindWidget(wMember);
			c._anonymous = mInfo.bAnonymous;
		}
	}
};
_p._bindWidgetEvents = function()
{
	for(var key in this._widgetEvents)
		this._widget.element.on(key, this._onDispatchWidgetEvent.bind(this));
};
_p._onDispatchWidgetEvent = function(e, data)
{
	var event = new BiEvent(e.type);
	event.originalEvent = e.originalEvent || e;
	event.widget = this._widget;
	event.data = data;
	return this.dispatchEvent(event);
};
_p._create = function(oDocument)
{
	this._document = oDocument || document;
	this._element = this._document.createElement(this._tagName);
};
_p.__onWidgetCreate = function(e)
{
	this.bindWidget(this._element, "ibxWidget", this._document);
	this.setMovable(this._movable);//now we are created, turn on/off moveability
	this.setResizable(this._resizable);//now we are created, turn on/off resizablility
};
_p.dispose = function()
{
	if(!this._widgetDestroyed)
		this.destroy();

	IbxWidget.base.dispose.call(this);
	this.disposeFields(
		"_widget",
		"_widgetProps",
		"_widgetCtor",
		"_widgetDestroyed"
	);
};
_p._onWidgetDestroyed = function(e)
{
	this._widgetDestroyed = true;
	if(!this._disposed)
		this.dispose();
};

_p._focusRoot = false;
_p.setFocusRoot = function(bIsRoot){this._focusRoot = bIsRoot;};
_p.isFocusRoot = function()
{
	return this._focusRoot;
};
_p.getFocusRoot = function()
{
	return this._focusRoot ? this : IbxWidget.base.getFocusRoot.call(this);
};
_p.getActiveComponent = function ()
{
	return null;
};
_p.getTabIndex = function()
{
	return this.getHtmlProperty("tabIndex");
};
_p.setTabIndex = function(idx)
{
	IbxWidget.base.setTabIndex.call(this, idx);
	this.setHtmlProperty("tabIndex", idx);
};

_p._mapPropToOption = function(pName, oValue)
{
	return {"name":pName, "value":oValue};
};
_p.mapPropsToOptions = function(props)
{
	var wOptions = {};
	if(props)
	{
		var widget = this._widget;
		var wOptions = widget ? $.extend(true, {}, this._widget.options) : {};		
		for(key in props)
		{
			var optInfo = this._mapPropToOption(key, props[key]);
			if(wOptions[optInfo.name] != props[key])
			{
				if(optInfo.value && optInfo.value[0] == "{")
					optInfo.value = $.ibi.ibxWidget.parseIbxOptions(optInfo.value);

				//widget option is an object, and property is an object, merge one into the other.
				if(typeof(wOptions[optInfo.name]) === "object" && typeof(optInfo.value) === "object")
					optInfo.value = $.extend(true, wOptions[optInfo.name], optInfo.value);

				wOptions[optInfo.name] = optInfo.value;
			}
		}
	}
	return wOptions;
};
_p.updateWidget = function(props)
{
	var wOptions = this.mapPropsToOptions(props || this._widgetProps);
	if(this._widget)
	{
		this._widget._setOptions(wOptions);
		this._widgetProps = {};
	}
	return wOptions;
};

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
		if(!this.options.ctxMenu || !this.element.is(e.currentTarget))
			return;

		var ctxMenu = $(this.options.ctxMenu);
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
