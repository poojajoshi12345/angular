/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxAutoScroll", $.Widget,
{
	options:
	{
		"autoActivate":true,
		"leftMargin":10,
		"topMargin":10,
		"rightMargin":10,
		"bottomMargin":10,
		"stepLeft":10,
		"stepTop":10,
		"stepRight":10,
		"stepBottom":10,
	},
	_widgetClass:"ibx-auto-scroll",
	_timer:null,
	_lastMouseMove:null,
	_create:function()
	{
		this._super();
		this.element.addClass(this._widgetClass);
		var el = this.element[0];
		el.addEventListener("mousemove", this._onMouseEvent.bind(this), true);
		el.addEventListener("mouseenter", this._onMouseEvent.bind(this), true);
		el.addEventListener("mouseleave", this._onMouseEvent.bind(this), true);
	},
	_destroy:function()
	{
		this._super();
		this.disable();
		this.removeClass(this._widgetClass);
	},
	_onMouseEvent: function(e)
	{
		var options = this.options;
		if(options.autoActivate)
		{
			var eType = e.type;
			if(eType == "mouseenter")
				this.enable();
			else
			if(eType == "mouseleave")
				this.disable();
		}
		this._lastMouseMove = e;
	},
	enable:function()
	{
		if(!this._timer)
			this._timer = window.setInterval(this._onManageScroll.bind(this), 10);
	},
	disable:function()
	{
		window.clearInterval(this._timer);
		this._timer = null;
	},
	_onManageScroll:function()
	{
		if(this._lastMouseMove)
		{
			//console.log(this._lastMouseMove);

			var options = this.options;
			var e = this._lastMouseMove;
			var curScroll = this.element.scrollTop();
			if(e.clientY <= options.marginTop && curScroll != 0)
				this.element.scrollTop(curScroll - options.stepTop);
			if(e.clientY >= (this.element.height() - options.marginBottom))
				this.element.scrollTop(curScroll + options.stepBottom);

			var curScroll = this.element.scrollLeft();
			if(e.clientX <= options.marginLeft && curScroll != 0)
				this.element.scrollLeft(curScroll - options.stepLeft);
			if(e.clientX >= (this.element.width() - options.marginRight))
				this.element.scrollLeft(curScroll + options.stepRight);
		}
	}
});

//# sourceURL=autoscroll.ibx.js

