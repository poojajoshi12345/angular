/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	PROGRESS WIDGET
******************************************************************************/
$.widget("ibi.ibxProgressBar", $.ibi.ibxHBox, 
{
	options:
	{
		color:"#ccc",
		backColor:"transparent",
		inline:true,
		align:"stretch",
		minVal:0,
		maxVal:100,
		curVal:50,
		showMin:true,
		showMax:true,
		showVal:true,
	},
	_widgetClass:"ibx-progress-bar",
	_create:function()
	{
		this._super();
		this._labelStart = $("<div class='lab-start'>").ibxLabel({iconPosition:"top"});
		this._labelEnd = $("<div class='lab-end'>").ibxLabel({iconPosition:"top"});
		this._labelInline = $("<div class='lab-inline'>").ibxLabel({iconPosition:"left"});
		this._progMarker = $("<div class='prog-marker'>");
		this._progBar = $("<div class='prog-bar'>").ibxHBox({align:"stretch"}).append(this._progMarker, this._labelInline);
		this.element.append(this._labelStart, this._progBar, this._labelEnd);
	},
	_destroy:function()
	{
		this._super();
	},
	refresh:function()
	{
		this._super();
		var options = this.options;
		this._labelStart.ibxWidget("option", "text", options.minVal.toString()).css("display", options.showMin ? "" : "none");
		this._labelEnd.ibxWidget("option", "text", options.maxVal.toString()).css("display", options.showMax ? "" : "none");
		var flex = (options.curVal/options.maxVal)
		this._progMarker.css("flex-grow", flex);
		this._labelInline.text(options.curVal).css("display", options.showVal ? "" : "none");
	}
});

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
ibx.waiting = $("<div class='ibx-global-waiting'>").ibxWaiting();
ibx.waitStart = function(message, el, options)
{
	ibx.waitStop();

	var options = $.extend(true, {"text":message}, options);
	var parent = $(el || "body");
	var parentPos = parent.css("position");
	var parentPosInline = parent[0].style.position;
	if(parentPos == "static")
	{
		parent.data("ibxWaitParentPosition", parentPosInline);
		parent.css("position", "relative");
	}

	ibx.waiting.ibxWidget("option", options);
	parent.append(ibx.waiting);
	return ibx.waiting;
};
ibx.waitStop = function()
{
	var parent = ibx.waiting.parent();
	if(parent)
	{
		ibx.waiting.detach();
		parent.css("position", parent.data("ibxWaitParentPosition"));
	}
};

//# sourceURL=progress.ibx.js
