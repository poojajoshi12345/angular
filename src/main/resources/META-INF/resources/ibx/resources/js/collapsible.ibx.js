/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxCollapsible", $.Widget, 
{
	options:
	{
		"direction": "left",
		"mode": "push",
		"startCollapsed": false,
		"collapsedClass": "collapsed",
		"autoClose": false,
		"gap": 0,
	},
	_create:function()
	{
		this._marginInfo = 
		{
			"margin-left":this.element.css("margin-left"),
			"margin-top":this.element.css("margin-top"),
			"margin-right":this.element.css("margin-right"),
			"margin-bottom":this.element.css("margin-bottom"),
		}
		this.widgetEventPrefix = "ibx_";
		this.element.addClass("ibx-collapsible");
		this.element.on("transitionend", this._onTransitionEnd.bind(this))
		this.element.on("click", this._onMouseEvent.bind(this));
		this._boundWindowMouseEvent = this._onWindowMouseEvent.bind(this);

		this._super();

		if (!this.element.data("ibxWidget"))
		{
			this.element.data("ibxWidget", this);
			this.element.data("ibiIbxWidget", this);
		}
	},
	_destroy:function()
	{
		this._super();
		this.element.css(this._marginInfo);
		$(window).off("mousedown");
	},
	_init:function()
	{
		//don't call super as close/open calls refresh
		if(this.element.hasClass("menu-bar"))
			var x = 10;
		this.element.addClass("ibx-collapsible-initializing");//stop transition while initializing
		this._isOpen = this.options.startCollapsed;
		this.options.startCollapsed ? this.close() : this.open();
		this._onTransitionEnd();
	},
	_isOpen:false,
	isOpen:function()
	{
		return this._isOpen;
	},
	open: function ()
	{
		if (!this.isOpen() && !this.options.disabled && this._trigger("beforeopen", null, this.element))
		{
			//remove the initializing class that stops transitions. Could be done just first time, but really doesn't matter to do it every time
			this.element.removeClass("ibx-collapsible-initializing")
			this._isOpen = true;
			this.refresh();
			if(this.options.autoClose)
				$("body").addClass("body-collapsible-auto-close");
		}
	},
	close: function ()
	{
		if (this.isOpen() && !this.options.disabled && this._trigger("beforeclose", null, this.element))
		{
			this._isOpen = false;
			this.refresh();
		}
	},
	toggle: function ()
	{
		(this.isOpen()) ? this.close() : this.open();
	},
	_onWindowMouseEvent: function (e)
	{
		if(this.options.autoClose && this.isOpen())
		{
			//close all open auto close collapsible and then let body get pointer events again.
			this.close();
			$("body").removeClass("body-collapsible-auto-close");
		}
	},
	_onMouseEvent: function (e)
	{
		e.stopPropagation();
	},
	_onTransitionEnd: function (e)
	{
		if (this.isOpen())
		{
			$(window).on("click", this._boundWindowMouseEvent);
			this._trigger("open", null, this.element);
		}
		else
		{
			$(window).off("click", this._boundWindowMouseEvent);
			this._trigger("close", null, this.element);
		}
	},
	refresh: function ()
	{
		var options = this.options;
		var isOpen = this.isOpen();

		options.autoClose ? this.element.addClass("auto-close") : this.element.removeClass("auto-close");
		var nMargin = 0;
		if(isOpen)
			nMargin = this._marginInfo["margin-" + options.direction];
		else
			nMargin = options.gap + -1 * ((options.direction == "left" || options.direction == "right") ? this.element.outerWidth(true) : this.element.outerHeight(true));
		this.element.css("margin-" + options.direction, nMargin)
		
		//IE has a problem with opacity and zIndex...it'll put the collapsed widget on top of everything else (at least in the case of a grid).
		if(!ibxPlatformCheck.isIE)
			this.element.css("opacity", isOpen ? 1 : 0);
	}
});
//# sourceURL=collapsible.ibx.js
