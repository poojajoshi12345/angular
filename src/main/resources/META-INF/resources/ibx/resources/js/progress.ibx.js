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
		curVal:50,
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
		iconElSpacerClass:"ibx-waiting-el-spacer",
		text:ibxResourceMgr.getString("STR_LOADING"),
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

//default, global, waiting/loading placeholder.
ibx.waitStart = function(message, el, options)
{
	ibx.waitStop(el);

	var options = $.extend(true, {"text":message}, options);
	var parent = $(el || "body").first();
	var waiting = $("<div class='ibx-global-waiting'>").ibxWaiting(options);
	var waitInfo = 
	{
		parentPos:parent.css("position"),
		parentPosInline:parent[0].style.position,
		ibxWaiting:waiting,
	}

	if(waitInfo.parentPos == "static")
		parent.css("position", "relative");

	parent.data("ibxWaitingInfo", waitInfo).append(waiting);
	return waiting;
};
ibx.waitStop = function(el)
{
	el = $(el || "body");
	var waitInfo = el.data("ibxWaitingInfo");
	if(waitInfo)
	{
		waitInfo.ibxWaiting.detach();
		el.css("position", waitInfo.parentPosInline);
	}
	el.removeData("ibxWaitingInfo");
};

//# sourceURL=progress.ibx.js
