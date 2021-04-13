/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.24 $:

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
		this.element.ibxAddClass("ibx-collapsible");
		this.element.on("transitionend", this._onTransitionEnd.bind(this))
		this.element.on("click", this._onMouseEvent.bind(this));
		this._boundWindowMouseEvent = this._onWindowMouseEvent.bind(this);
		this._super();
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
		this.element.ibxAddClass("ibx-collapsible-initializing");//stop transition while initializing
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
		if (!this.isOpen() && !this.options.disabled && this._trigger("beforeopen"))
		{
			//remove the initializing class that stops transitions. Could be done just first time, but really doesn't matter to do it every time
			this._isOpen = true;
			this.element.ibxRemoveClass("ibx-collapsed ibx-collapsible-initializing")
			if(this.options.autoClose)
				$("body").ibxAddClass("body-collapsible-auto-close");
			this.refresh();
			this._trigger("opened")
		}
	},
	close: function ()
	{
		if (this.isOpen() && !this.options.disabled && this._trigger("beforeclose"))
		{
			this._isOpen = false;
			this.refresh();
			this._trigger("closed");
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
			$("body").ibxRemoveClass("body-collapsible-auto-close");
		}
	},
	_onMouseEvent: function (e)
	{
		e.stopPropagation();
	},
	_onTransitionEnd: function (e)
	{
		if(this.isOpen())
		{
			$(window).on("click", this._boundWindowMouseEvent);
			this._trigger("open");
		}
		else
		{
			if(!e || e.originalEvent.propertyName.search("margin") != -1)
			{
				this.element.ibxAddClass("ibx-collapsed");
				$(window).off("click", this._boundWindowMouseEvent);
				this._trigger("close");
			}
		}
	},
	refresh: function ()
	{
		var options = this.options;
		var isOpen = this.isOpen();

		this.element.ibxToggleClass("auto-close", options.autoClose);
		
		var nMargin = 0;
		if(isOpen)
			nMargin = this._marginInfo["margin-" + options.direction];
		else
			nMargin = options.gap + (-1 * ((options.direction == "left" || options.direction == "right") ? this.element.outerWidth(true) : this.element.outerHeight(true)));
		this.element.css("margin-" + options.direction, nMargin)
		
		//IE has a problem with opacity and zIndex...it'll put the collapsed widget on top of everything else (at least in the case of a grid).
		if(!ibxPlatformCheck.isIE)
			this.element.css("opacity", isOpen ? 1 : 0);
	}
});
//# sourceURL=collapsible.ibx.js
