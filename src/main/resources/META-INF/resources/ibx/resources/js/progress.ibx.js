/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	PROGRESS WIDGET
******************************************************************************/
$.widget("ibi.ibxProgressBar", $.ibi.ibxHBox, 
{
	options:
	{
		"minVal":0,
		"maxVal":100,
		"curVal":0,
		"markerClasses":"",

		"showProgText":false,
		"progText":"",
		"progTextClasses":"",
		"progArea":"body",

		//flexbox options
		"inline":true,
		"align":"stretch",

		"aria":{"role":"progressbar"},
	},
	_widgetClass:"ibx-progress-bar",
	_create:function()
	{
		this._super();
		this.progText = $("<div class='ibx-progress-label'>").ibxHBox({align:"stretch", justify:"end"});
		this.progMarker = $("<div class='ibx-progress-marker'>").ibxHBox({align:"stretch"});
		this.element.append(this.progMarker);
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		var options = this.options;

		accessible ? this.progText.ibxAriaId() : this.progText.removeIbxAriaId();
		aria.live = "assertive";
		aria.valuemin = options.minVal;
		aria.valuemax = options.maxVal;
		aria.valuenow = options.curVal;

		var progArea = $(options.progArea);
		(accessible && this.inProgress()) ? progArea.attr("aria-busy", true) : progArea.removeAttr("aria-busy");

		return aria;
	},
	_destroy:function()
	{
		this._super();
	},
	inProgress:function()
	{
		var options = this.options;
		return (options.curVal > options.minVal && options.curVal < options.maxVal);

	},
	_refresh:function()
	{
		this._super();
		var options = this.options;

		this._trigger("format_value", this.element, options.curVal);
		this.progText.text(options.progText || options.curVal);

		var flex = (options.curVal - options.minVal)/(options.maxVal - options.minVal);
		this.progMarker.css("flex-grow", flex).addClass(options.markerClasses);
		this.progText.css({"flex-grow":1-flex, "display":options.showProgText ? "" : "none"}).addClass(options.progTextClasses);
	
		this.element.append(this.progMarker, this.progText);
	}
});

$.ibi.ibxProgressBar.statics = 
{
};

/******************************************************************************
	WAITING WIDGET
******************************************************************************/
$.widget("ibi.ibxWaiting", $.ibi.ibxLabel, 
{
	options:
	{
		"stretch":false,
		"align":"center",
		"justify":"center",
		"iconPosition":"top",
		"glyphClasses":"fa fa-spin fa-spinner",
		"text":"",
		"textWrap":true,
		"textAlign":"center",
		"aria":{"role":"progressbar"}

	},
	_widgetClass:"ibx-waiting",
	_create:function()
	{
		this._super();
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		return aria;
	},
	_destroy:function()
	{
		this._super();
	},
	_refresh:function()
	{
		var options = this.options;
		this._glyph.toggleClass("wait-stretch", options.stretch)
		this._super();
	}
});

/******************************************************************************
	COMBINDED WAITING PROGRESS WIDGET
******************************************************************************/
$.widget("ibi.ibxWaitingProgressBar", $.ibi.ibxWaiting, 
{
	options:
	{
		showProgress:true,
		progOptions:{},
	},
	_widgetClass:"ibx-waiting-progress-bar",
	_create:function()
	{
		this._super();
		this.progress = $("<div>").ibxProgressBar();
		this.element.append(this.progress);
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		this.progress.css("display", options.showProgress ? "" : "none").ibxWidget("option", options.progOptions);
	}
});


ibx.waitStart = function(el, message)
{
	var waiting = $();
	var global = !el;
	$(el || "body").each(function(message, idx, el)
	{
		el = $(el);

		//kill any current waiting with this element.
		ibx.waitStop(el);

		message = (typeof(message) === "string") ? {text:message} : message;//overload message to allow string/object.
		var waitTemp = $("<div>").addClass(global ? "ibx-waiting-global" : null).ibxWaiting(message);
		var waitInfo = {posInline:el[0].style.position,	ibxWaiting:waitTemp};

		if(!el.is("body") && el.css("position") == "static")
			el.css("position", "relative");

		el.data("ibxWaitingInfo", waitInfo).append(waitTemp);
		waiting = waiting.add(waitTemp);
	}.bind(this, message));
	return waiting;
};
ibx.waitStop = function(el)
{
	var waiting = $();
	$(el || "body").filter(":data('ibxWaitingInfo')").each(function(idx, el)
	{
		el = $(el);
		var waitInfo = el.data("ibxWaitingInfo");
		waitInfo.ibxWaiting.detach();
		el.css("position", waitInfo.posInline);
		el.removeData("ibxWaitingInfo");
	});
	return waiting;
};

//# sourceURL=progress.ibx.js
