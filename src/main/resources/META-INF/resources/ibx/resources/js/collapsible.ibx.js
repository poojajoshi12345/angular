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
		this.element.data("ibiIbxWidget", this);
		this.element.on("transitionend", this._onTransitioned.bind(this))
		$(window).on("mousedown", this._onWindowMouseDown.bind(this));
		this.element.on("mousedown", this._onMouseDown.bind(this));
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
		this.options.startCollapsed ? this.close() : this.open();
	},
	_onWindowMouseDown: function (e)
	{
		if(this.options.autoClose && this.isOpen())
		{
			//close all open auto close collapsible and then let body get pointer events again.
			$(".ibx-collapsible:autoClose").ibxCollapsible("close");
			$("body").removeClass("body-collapsible-auto-close");
		}
	},
	_onMouseDown: function (e)
	{
		e.stopPropagation();
	},
	_onTransitioned: function (e)
	{ 
		if (this.isOpen())
			this._trigger("open", null, this.element);
		else
			this._trigger("close", null, this.element);
	},
	_isOpen:false,
	isOpen:function()
	{
		return this._isOpen;
	},
	open: function ()
	{
		if (!this.options.disabled && this._trigger("beforeopen", null, this.element))
		{
			this._isOpen = true;
			this.refresh();
			if(this.options.autoClose)
				$("body").addClass("body-collapsible-auto-close");
		}
	},
	close: function ()
	{
		if (!this.options.disabled && this._trigger("beforeclose", null, this.element))
		{
			this._isOpen = false;
			this.refresh();
		}
	},
	toggle: function ()
	{
		(this.isOpen()) ? this.close() : this.open();
	},
	refresh: function ()
	{
		var options = this.options;
		if(this.isOpen())
		{
			this.element.css("margin-" + options.direction, this._marginInfo["margin-" + options.direction]);
			this.element.addClass("open");
		}
		else
		{
			var nMargin = (options.direction == "left" || options.direction == "right") ? this.element.outerWidth(true) : this.element.outerHeight(true);
			this.element.css("margin-" + options.direction, (nMargin * -1) + options.gap);
			this.element.removeClass("open");
		}

		this.element.removeClass("ibx-collapsible ibx-collapsible-left-push ibx-collapsible-left-overlay ibx-collapsible-right-push ibx-collapsible-right-overlay ibx-collapsible-up-push ibx-collapsible-up-overlay ibx-collapsible-down-push ibx-collapsible-down-overlay");
		this.element.addClass("ibx-collapsible ibx-collapsible-" + this.options.direction + "-" + this.options.mode);
		this.options.autoClose ? this.element.addClass("auto-close") : this.element.removeClass("auto-close");
	}
});
//# sourceURL=collapsible.ibx.js
