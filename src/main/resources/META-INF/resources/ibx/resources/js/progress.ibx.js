/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	PROGRESS WIDGET
******************************************************************************/
$.widget("ibi.ibxProgressBar", $.ibi.ibxHBox, 
{
	options:
	{
		minVal:0,
		maxVal:100,
		curVal:0,
		curValClasses:"",
		markerClasses:"",
		progText:"",

		//flexbox options
		inline:true,
		align:"stretch",
	},
	_widgetClass:"ibx-progress-bar",
	_create:function()
	{
		this._super();
		this.progLabel = $("<div class='ibx-progress-label'>").ibxHBox({align:"stretch", justify:"end"});
		this.progMarker = $("<div class='ibx-progress-marker'>").ibxHBox({align:"stretch"});
		this.element.append(this.progMarker, this.progLabel);
	},
	_destroy:function()
	{
		this._super();
	},
	refresh:function()
	{
		this._super();
		var options = this.options;

		this._trigger("format_value", this.element, options.curVal);
		this.progLabel.text(options.progText);

		var flex = (options.curVal - options.minVal)/(options.maxVal - options.minVal);
		this.progMarker.css("flex-grow", flex).addClass(options.markerClasses);
		this.progLabel.css("flex-grow", 1-flex).addClass(options.curValClasses);
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
		stretch:false,
		align:"center",
		justify:"center",
		iconPosition:"top",
		icon:sformat("{1}css/images/loader_small.gif", ibx.getPath()),
		text:"",
		textWrap:true,
		textAlign:"center",
	},
	_widgetClass:"ibx-waiting",
	_create:function()
	{
		this._super();
	},
	_destroy:function()
	{
		this._super();
	},
	refresh:function()
	{
		var options = this.options;
		this._icon.toggleClass("wait-stretch", options.stretch)
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
		progressOptions:{},
		optionsMap:
		{
			minVal:"progressOptions.minVal",
			maxVal:"progressOptions.maxVal",
			curVal:"progressOptions.curVal",
			curValClasses:"progressOptions.curValClasses",
			markerClasses:"progressOptions.markerClasses",
			progText:"progressOptions.progText",
		}
	},
	_widgetClass:"ibx-waiting-progress-bar",
	_create:function()
	{
		this._super();
		this.progress = $("<div>").ibxProgressBar();
		this.element.append(this.progress);
	},
	refresh:function()
	{
		this._super();
		var options = this.options;
		this.progress.css("display", options.showProgress ? "" : "none").ibxWidget("option", options.progressOptions);
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
		waiting = $("<div>").addClass(global ? "ibx-waiting-global" : null).ibxWaiting(message);
		var waitInfo = {posInline:el[0].style.position,	ibxWaiting:waiting,};

		if(!el.is("body") && el.css("position") == "static")
			el.css("position", "relative");

		el.data("ibxWaitingInfo", waitInfo).append(waiting);
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
