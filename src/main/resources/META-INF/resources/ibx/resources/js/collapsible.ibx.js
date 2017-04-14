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
		"transition":"",
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
		this.element.data("ibxWidget", this);
		this.element.data("ibiIbxWidget", this);
		this.element.addClass("ibx-collapsible");
		this.element.on("transitionend", this._onTransitioned.bind(this))
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
		this.options.startCollapsed ? this.close() : this.open();
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
		if(!this.options.disabled && this._trigger("beforeclose", null, this.element))
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
	_onTransitioned: function (e)
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

		this.element.removeClass("ibx-collapsible-left-push ibx-collapsible-left-overlay ibx-collapsible-right-push ibx-collapsible-right-overlay ibx-collapsible-up-push ibx-collapsible-up-overlay ibx-collapsible-down-push ibx-collapsible-down-overlay");
		this.element.addClass(sformat("ibx-collapsible-{1}-{2}", this.options.direction, this.options.mode));
		this.element.css("transition", (options.transition) ? sformat("margin-{1} {2}", this.options.direction, options.transition) : "");
		this.options.autoClose ? this.element.addClass("auto-close") : this.element.removeClass("auto-close");

	}
});
//# sourceURL=collapsible.ibx.js
