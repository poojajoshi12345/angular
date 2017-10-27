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

		"aria":
		{
			"role":"progressbar",
			"live":"polite",
		},
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
		aria.valuemin = options.minVal;
		aria.valuemax = options.maxVal;
		aria.valuenow = options.curVal;
		aria.describedby = aria.describedby || this.progText.prop("id");

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

/******************************************************************************
	WAITING WIDGET
******************************************************************************/
$.widget("ibi.ibxWaiting", $.ibi.ibxLabel, 
{
	options:
	{
		"waiting":false,
		"stretch":false,
		"align":"center",
		"justify":"center",
		"iconPosition":"top",
		"glyphClasses":"fa fa-spin fa-spinner",
		"text":"",
		"textWrap":true,
		"textAlign":"center",
		"aria":
		{
			"role":"progressbar",
			"live":"assertive",
			"relevant":"all",
			"valuemin":0,
			"valuemax":0,
		}
	},
	_widgetClass:"ibx-waiting",
	_create:function()
	{
		this._super();
		this.element.attr("tabIndex", 0);
		this.element.on("mousedown mouseup mousemove click keydown keyup keypress", function(e){e.preventDefault();e.stopPropagation();});
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		var options = this.options;
		aria.describedby = aria.describedby || this._text.prop("id");
		var waitArea = $(options.waitArea || this.element.parent());
		(accessible && options.waiting) ? waitArea.attr("aria-busy", true) : waitArea.removeAttr("aria-busy");
		return aria;
	},
	_destroy:function()
	{
		this._super();
	},
	message:function(msg, isHtml)
	{
		if(msg)
		{
			this.options.text = msg;
			isHtml ? this._text.html(msg) : this._text.text(msg);
			return this.element;
		}
		else
			return this.options.text;
	},
	start:function()
	{
		this.options.waiting = true;
		window.requestAnimationFrame(this._doWait.bind(this));
	},
	stop:function()
	{
		this.options.waiting = false;
	},
	_doWait:function(timestampe)
	{
		var options = this.options;
		if(options.waiting)
		{
			if(!this._trigger("waiting", null, this.element))
				this.stop();
			else
				window.requestAnimationFrame(this._doWait.bind(this));
		}
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

		options = (typeof(message) === "string") ? {text:message} : message;//overload message to allow string/object.
		var waitTemp = $("<div>").addClass(global ? "ibx-waiting-global" : null).ibxWaiting(options);
		var waitInfo = {posInline:el[0].style.position,	ibxWaiting:waitTemp};

		if(!el.is("body") && el.css("position") == "static")
			el.css("position", "relative");

		el.data("ibxWaitingInfo", waitInfo).append(waitTemp);
		waitTemp.ibxWidget("start");
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
		waitInfo.ibxWaiting.ibxWidget("stop").detach();
		el.css("position", waitInfo.posInline);
		el.removeData("ibxWaitingInfo");
	});
	return waiting;
};

//# sourceURL=progress.ibx.js
