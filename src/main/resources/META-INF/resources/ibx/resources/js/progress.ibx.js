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
		showVal:true,
		curValClasses:"",
		markerClasses:"",

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
		this.progLabel.text(options.curVal + "%").css("display", options.showVal ? "" : "none");

		var flex = (options.curVal/options.maxVal)
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

//default waiting/progress...
ibx.waitTimeout = function(duration, message, el)
{
	el = $(el || "body");
	ibx.waitStart(message, el).each(function(idx, el)
	{
		window.setTimeout(function(el)
		{
			ibx.waitStop(el);
		}.bind(this, el), duration);
	});
	return el;
};
ibx.waitStart = function(message, el)
{
	$(el || "body").each(function(message, idx, el)
	{
		el = $(el);

		//kill any current waiting with this element.
		ibx.waitStop(el);

		message = (typeof(message) === "string") ? {text:message} : message;//overload message to allow string/object.
		var waiting = $("<div>").ibxWaiting(message);
		var waitInfo = 
		{
			posOriginal:el.css("position"),
			posInline:el[0].style.position,
			ibxWaiting:waiting,
		};

		if(waitInfo.posOriginal == "static")
			el.css("position", "relative");

		el.data("ibxWaitingInfo", waitInfo).append(waiting);
	}.bind(this, message));
	return el;
};
ibx.waitStop = function(el)
{
	$(el || "body").each(function(idx, el)
	{
		el = $(el);
		var waitInfo = el.data("ibxWaitingInfo");
		if(waitInfo)
		{
			waitInfo.ibxWaiting.detach();
			el.css("position", waitInfo.parentPosInline);
		}
		el.removeData("ibxWaitingInfo");
	});
	return el;
};

//# sourceURL=progress.ibx.js
