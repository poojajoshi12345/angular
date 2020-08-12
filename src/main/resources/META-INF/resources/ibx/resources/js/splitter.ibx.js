/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.15 $:

$.widget("ibi.ibxSplitter", $.ibi.ibxWidget, 
{
	options:
	{
		"orientation":"vertical",
		"resize":"both",
		"locked":false,
		"autoReset":true,
		"el1":null,
		"el2":null,
	},
	_widgetClass:"ibx-splitter",
	_create:function()
	{
		this._super();
		this._fnSplitterMouseEvent = this._onSplitterMouseEvent.bind(this);//must save for later removal because of bind.
		this.element.on("mousedown dblclick", this._fnSplitterMouseEvent);
	},
	_onSplitterMouseEvent:function(e)
	{
		var options = this.options;
		var bVertical = (options.orientation == "vertical");
		var eType = e.type;

		//locked so no action taken.
		if(options.locked)
			return;

		var el1 = options.el1 ? $(options.el1) : this.element.prevAll(":visible").first();
		var el2 = options.el2 ? $(options.el2) : this.element.nextAll(":visible").first()

		if(eType == "mousedown")
		{
			if(!this._initialized)
			{
				//save initial sizes for dblclick reset.
				this._e1Info = {el:el1, width:el1.outerWidth(), height:el1.outerHeight()};
				this._e2Info =  {el:el2, width:el2.outerWidth(), height:el2.outerHeight()};
				this._initialized = true;
			}

			el1.ibxAddClass("ibx-splitter-sizing");
			el2.ibxAddClass("ibx-splitter-sizing");
			$(document.body).ibxAddClass(bVertical ? "ibx-body-splitter-v" : "ibx-body-splitter-h").css("pointerEvents", "none");
			$(document).on("mouseup mousemove", this._fnSplitterMouseEvent);
			this._eLast = e;
			this._trigger("resizestart", null, { "el1":el1, "el2":el2});
		}
		else
		if(eType == "mouseup")
		{
			el1.ibxRemoveClass("ibx-splitter-sizing");
			el2.ibxRemoveClass("ibx-splitter-sizing");
			$(document.body).ibxRemoveClass("ibx-body-splitter-v ibx-body-splitter-h").css("pointerEvents", "");
			$(document).off("mouseup mousemove", this._fnSplitterMouseEvent);
			el1.css("flex", "");
			el2.css("flex", "");
			delete this._eLast;
			this._trigger("resizeend", null, { "el1":el1, "el2":el2});
		}
		else
		if(eType == "mousemove")
		{
			
			var oe = e.originalEvent;
			var s1= bVertical ? el1.width() : el1.height();
			var s2 = bVertical ? el2.width() : el2.height();
			var m1 = parseInt(el1.css(bVertical ? "min-width" : "min-height"), 10);
			var m2 = parseInt(el2.css(bVertical ? "min-width" : "min-height"), 10);
			var dx = e.screenX - this._eLast.screenX;
			var dy = e.screenY - this._eLast.screenY;

			var s1Val = bVertical ? (s1+dx) : (s1+dy);
			s1Val = s1Val <= m1 ? 0 : s1Val;

			var s2Val = bVertical ? (s2-dx) : (s2-dy);
			s2Val = s2Val <= m2 ? 0 : s2Val;

			//don't let either side get smaller than 0 or min-width (min-height) calculated above
			if(s1Val <= 0 || s2Val <= 0)
				return;

			//set the actual widths
			if(options.resize == "both" || options.resize == "first")
				bVertical ? el1.width(s1Val).css("flex", "0 0 auto") : el1.height(s1Val).css("flex", "0 0 auto");

			if(options.resize == "both" || options.resize == "second")
				bVertical ? el2.width(s2Val).css("flex", "0 0 auto") : el2.height(s2Val).css("flex", "0 0 auto");

			this._trigger("resize", null, { "el1": el1, "el2": el2, "dx": dx, "dy": dy });
			this._eLast = e;
		}
		else
		if(eType == "dblclick" && this.options.autoReset)
			this.reset();
	},
	_destroy:function()
	{
		this._super();
		this.reset()
		this.element.ibxRemoveClass("ibx-splitter-v ibx-splitter-h");
	},
	reset:function()
	{
		var options = this.options;
		var el1 = this.element.prevAll(":visible").first();
		var el2= this.element.nextAll(":visible").first();
		
		if(options.resize == "both" || options.resize == "first")
			el1.css(this._e1Info);

		if(options.resize == "both" || options.resize == "second")
			el2.css(this._e2Info);
			
		this._trigger("reset", null, {"el1": el1, "el2": el2});
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		var bVertical = (options.orientation == "vertical");
		this.element.ibxToggleClass("ibx-splitter-locked", options.locked);
		this.element.ibxRemoveClass("ibx-splitter-v ibx-splitter-h").ibxAddClass(bVertical ? "ibx-splitter-v" : "ibx-splitter-h");
	}
});
$.widget("ibi.ibxHSplitter", $.ibi.ibxSplitter, {options:{orientation:"horizontal"}, _widgetClass:"ibx-splitter-horizontal"});
$.widget("ibi.ibxVSplitter", $.ibi.ibxSplitter, {options:{orientation:"vertical"}, _widgetClass:"ibx-splitter-vertical"});
$.ibi.ibxSplitter.statics = 
{
}
//# sourceURL=splitter.ibx.js
