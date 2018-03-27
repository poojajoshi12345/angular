/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxAutoScroll", $.Widget,
{
	options:
	{
		"autoActivate":true,
		"marginLeft":20,
		"marginTop":20,
		"marginRight":20,
		"marginBottom":20,
		"stepLeft":20,
		"stepTop":20,
		"stepRight":20,
		"stepBottom":20,
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
				this.start();
			else
			if(eType == "mouseleave")
				this.stop();
		}
		this._lastMouseMove = e;
	},
	start:function()
	{
		if(!this._timer)
			this._timer = window.setInterval(this._onManageScroll.bind(this), 10);
	},
	stop:function()
	{
		window.clearInterval(this._timer);
		this._timer = null;
	},
	_onManageScroll:function()
	{
		if(this._lastMouseMove)
		{
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
	},
	_setOption:function(key, value)
	{
		this._super(key, value);
		var options = this.options;
		if(key == "margin")
			options.marginLeft = options.marginTop = options.marginRight = options.marginBottom = value;
		else
		if(key == "step")
			options.stepLeft = options.stepTop = options.stepRight = options.stepBottom = value;
	}
});

//# sourceURL=autoscroll.ibx.js

