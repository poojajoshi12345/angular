/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxSplitter", $.ibi.ibxWidget, 
{
	options:
	{
		"orientation":"vertical",
		"autoReset":true,
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
		var bVertical = (this.options.orientation == "vertical");
		var eType = e.type;
		if(eType == "mousedown")
		{
			if(!this._initialized)
			{
				//save initial sizes for dblclick reset.
				var e1 = this.element.prevAll(":visible").first();
				this._e1Info = {el:e1, width:e1.outerWidth(), height:e1.outerHeight()};
				var e2 = this.element.nextAll(":visible").first();
				this._e2Info =  {el:e2, width:e2.outerWidth(), height:e2.outerHeight()};
				this._initialized = true;
			}

			$(document.body).addClass(bVertical ? "ibx-body-splitter-v" : "ibx-body-splitter-h").css("pointerEvents", "none");
			$(document).on("mouseup mousemove", this._fnSplitterMouseEvent);
			this._eLast = e;
			this._trigger("resizestart", null, { "el1": this.element.prev(), "el2": this.element.next() });
		}
		else
		if(eType == "mouseup")
		{
			$(document.body).removeClass("ibx-body-splitter-v ibx-body-splitter-h").css("pointerEvents", "");
			$(document).off("mouseup mousemove", this._fnSplitterMouseEvent);
			delete this._eLast;
			this._trigger("resizeend", null, { "el1": this.element.prev(), "el2": this.element.next() });
		}
		else
		if(eType == "mousemove")
		{
			var options = this.options
			var oe = e.originalEvent;
			var el1 = this.element.prevAll(":visible").first();
			var el2= this.element.nextAll(":visible").first();
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
			bVertical ? el1.width(s1Val) : el1.height(s1Val);
			bVertical ? el2.width(s2Val) : el2.height(s2Val);

			this._trigger("resize", null, { "el1": el1, "el2": el2, "dx": dx, "dy": dy });
			this._eLast = e;
		}
		else
		if(eType == "dblclick")
		{
			if (this.options.autoReset)
			{
				this.reset();
				this._trigger("reset", null, { "el1": el1, "el2": el2, "dx": dx, "dy": dy });
			}
		}
	},
	_destroy:function()
	{
		this._super();
		this.reset()
		this.element.removeClass("ibx-splitter-v ibx-splitter-h");
	},
	reset:function()
	{
		this.element.prev().css(this._e1Info);
		this.element.next().css(this._e2Info);
	},
	refresh:function()
	{
		this._super();
		var options = this.options;
		var bVertical = (options.orientation == "vertical");
		this.element.removeClass("ibx-splitter-v ibx-splitter-h").addClass(bVertical ? "ibx-splitter-v" : "ibx-splitter-h");
	}
});
$.widget("ibi.ibxHSplitter", $.ibi.ibxSplitter, {options:{orientation:"horizontal"}, _widgetClass:"ibx-splitter-horizontal"});
$.widget("ibi.ibxVSplitter", $.ibi.ibxSplitter, {options:{orientation:"vertical"}, _widgetClass:"ibx-splitter-vertical"});
$.ibi.ibxSplitter.statics = 
{
}
//# sourceURL=splitter.ibx.js
