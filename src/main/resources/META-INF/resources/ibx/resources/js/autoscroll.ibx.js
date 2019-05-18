/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.10 $:

$.widget("ibi.ibxAutoScroll", $.Widget,
{
	options:
	{
		"autoActivate":false,
		"direction":"all",
		"marginLeft":20,
		"marginTop":20,
		"marginRight":20,
		"marginBottom":20,
		"stepLeft":5,
		"stepTop":5,
		"stepRight":5,
		"stepBottom":5,
	},
	_widgetClass:"ibx-auto-scroll",
	_timer:null,
	_lastMouseMove:null,
	_create:function()
	{
		this._super();
		this.element.ibxAddClass(this._widgetClass);
		var el = this.element[0];
		el.addEventListener("mousemove", this._onMouseEvent.bind(this), true);
		el.addEventListener("mouseover", this._onMouseEvent.bind(this), true);
		el.addEventListener("mouseout", this._onMouseEvent.bind(this), true);
	},
	_destroy:function()
	{
		this._super();
		this.disable();
		this.element.ibxRemoveClass(this._widgetClass);
	},
	_onMouseEvent: function(e)
	{
		var options = this.options;
		if(options.autoActivate)
		{
			var eType = e.type;
			if(eType == "mouseover")
				this.start();
			else
			if(eType == "mouseout")
				this.stop();
		}
		this._lastMouseMove = e;
	},
	_started:false,
	start:function()
	{
		if(!this._timer)
			this._timer = window.setInterval(this._onManageScroll.bind(this), 10);
		this.options.disabled = false;
	},
	stop:function()
	{
		window.clearInterval(this._timer);
		this._timer = null;
		this.options.disabled = true;
	},
	_onManageScroll:function()
	{
		if(this._lastMouseMove)
		{
			var options = this.options;
			var borderBox = this.element[0].getBoundingClientRect();
			var e = this._lastMouseMove;
			
			if(options.direction.search(/^all|^horizontal/) == 0)
			{
				var curScroll = this.element.scrollLeft();
				if(e.clientX <= (borderBox.left + options.marginLeft) && curScroll != 0)
					this.element.scrollLeft(curScroll - options.stepLeft);
				if(e.clientX >= (borderBox.right - options.marginRight))
					this.element.scrollLeft(curScroll + options.stepRight);
			}

			if(options.direction.search(/^all|^vertical/) == 0)
			{
				var curScroll = this.element.scrollTop();
				if(e.clientY <= (borderBox.top + options.marginTop) && curScroll != 0)
					this.element.scrollTop(curScroll - options.stepTop);
				if(e.clientY >= (borderBox.bottom - options.marginBottom))
					this.element.scrollTop(curScroll + options.stepBottom);
			}
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
		else
		if(key == "disabled" && value)
			this.stop();
	}
});

//# sourceURL=autoscroll.ibx.js

