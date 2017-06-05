/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

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
	var options = $.extend(true, {"text":message}, options);
	var parent = $(el || "body");
	var parentPos = parent.css("position")
	parent.data("ibxWaitingInfo", parentPos).css("position", "relative");

	ibx.waiting.ibxWidget("option", options);
	parent.append(ibx.waiting);
	return ibx.waiting;
};
ibx.waitStop = function()
{
	var parent = ibx.waiting.parent();
	var parentPos = parent.data("ibxWaitingInfo");
	ibx.waiting.detach();
	parent.css("position", parentPos);
};

//# sourceURL=progress.ibx.js
