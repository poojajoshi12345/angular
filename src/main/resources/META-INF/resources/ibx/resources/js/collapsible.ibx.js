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
		"autohide": false,
		"gap": "0px",
	},
	_create:function()
	{
		this.element.on("transitionend", this._onTransitioned.bind(this))
		$(window).on("mousedown", this._onWindowMouseDown.bind(this));
		this.element.on("mousedown", this._onMouseDown.bind(this));
		this._super();
	},
	_destroy:function()
	{
		this._super();
		$(window).off("mousedown");
		switch (this.options.direction)
		{
			default:
			case "left": this.options.mode == "push" ? this.element.css("margin-left", "") : this.element.css("left", ""); break;
			case "right": this.options.mode == "push" ? this.element.css("margin-right", "") : this.element.css("right", ""); break;
			case "up": this.options.mode == "push" ? this.element.css("margin-top", "") : this.element.css("top", ""); break;
			case "down": this.options.mode == "push" ? this.element.css("margin-bottom", "") : this.element.css("bottom", ""); break;
		}
	},
	_init:function()
	{
		this.refresh();
		this.options.startCollapsed ? this.close() : this.open();
	},
	_onWindowMouseDown: function (e)
	{
		if (!this.options.autohide)
			return;
		var target = $(e.target);
		if (this.isOpen() && !this.element.is(target) && this.element.find(target).length == 0)
			this.toggle();
	},
	_onMouseDown: function (e)
	{
		if (this.options.autohide)
			e.stopPropagation();
	},
	_onTransitioned: function (e)
	{ 
		if (this.isOpen())
			this._trigger("open", null, this.element);
		else
			this._trigger("close", null, this.element);
	},
	_isOpen:true,
	isOpen:function()
	{
		return this._isOpen;
	},
	open: function ()
	{
		if (!this.options.disabled && this._trigger("beforeopen", null, this.element))
		{
			this._isOpen = true;
			if (this.options.autohide)
				$(document.body).css("pointer-events", "none");
			this.refresh();
		}
	},
	close: function ()
	{
		if (!this.options.disabled && this._trigger("beforeclose", null, this.element))
		{
			this._isOpen = false;
			if (this.options.autohide)
				$(document.body).css("pointer-events", "");
			this.refresh();
		}
	},
	toggle: function ()
	{
		(this._isOpen) ? this.close() : this.open();
	},
	_setOption:function(key, value)
	{
		this._super(key, value);
		this.refresh();
	},
	refresh: function ()
	{
		if(this._isOpen)
		{
			switch (this.options.direction)
			{
				default:
				case "left": this.options.mode == "push" ? this.element.css("margin-left", "0px") : this.element.css("left", "0px"); break;
				case "right": this.options.mode == "push" ? this.element.css("margin-right", "0px") : this.element.css("right", "0px"); break;
				case "up": this.options.mode == "push" ? this.element.css("margin-top", "0px") : this.element.css("top", "0px"); break;
				case "down": this.options.mode == "push" ? this.element.css("margin-bottom", "0px") : this.element.css("bottom", "0px"); break;
			}
		}
		else
		{
			var gapPixels = parseInt(this.options.gap, 10);
			if (isNaN(gapPixels))
				gapPixels = 0;
			else if (this.options.gap.indexOf("%") >= 0) // it's a percentage
			{
				switch (this.options.direction)
				{
					default:
					case "left":
					case "right":
						gapPixels = Math.round(this.element.outerWidth() * gapPixels / 100);
						break;
					case "up":
					case "down":
						gapPixels = Math.round(this.element.outerHeight() * gapPixels / 100);
						break;
				}
			}
			switch (this.options.direction)
			{
				default:
				case "left": this.options.mode == "push" ? this.element.css("margin-left", (-this.element.outerWidth() + gapPixels) + "px") : this.element.css("left", (-this.element.outerWidth() + gapPixels) + "px"); break;
				case "right": this.options.mode == "push" ? this.element.css("margin-right", (-this.element.outerWidth() + gapPixels) + "px") : this.element.css("right", (-this.element.outerWidth() + gapPixels) + "px"); break;
				case "up": this.options.mode == "push" ? this.element.css("margin-top", (-this.element.outerHeight() + gapPixels) + "px") : this.element.css("top", (-this.element.outerHeight() + gapPixels) + "px"); break;
				case "down": this.options.mode == "push" ? this.element.css("margin-bottom", (-this.element.outerHeight() + gapPixels) + "px") : this.element.css("bottom", (-this.element.outerHeight() + gapPixels) + "px"); break;
			}
		}

		this.element.removeClass("ibx-collapsible ibx-collapsible-left-push ibx-collapsible-left-overlay ibx-collapsible-right-push ibx-collapsible-right-overlay ibx-collapsible-up-push ibx-collapsible-up-overlay ibx-collapsible-down-push ibx-collapsible-down-overlay");
		this.element.addClass("ibx-collapsible ibx-collapsible-" + this.options.direction + "-" + this.options.mode);

		this._isOpen ? this.element.addClass("open") : this.element.removeClass("open");
		this.options.autohide ? this.element.addClass("autohide") : this.element.removeClass("autohide");
	}
});

$.ibi.ibxCollapsible.move = function (element, newdirection, newmode, newStartCollapsed, newGap)
{
	var element = $(element);
	if (element.is(":data('ibi-ibxCollapsible')"))
		element.ibxCollapsible('destroy');
	var parent = element.parent();
	if (!newGap)
		newGap = "0px";
	switch (newdirection)
	{
		default:
		case 'up':
		case 'left':
			parent.prepend(element);
			break;
		case 'right':
		case 'down':
			parent.append(element);
			break;
	}
	element.ibxCollapsible({ direction: newdirection, startCollapsed: newStartCollapsed, mode: newmode, gap: newGap });
}


//# sourceURL=collapsible.ibx.js
