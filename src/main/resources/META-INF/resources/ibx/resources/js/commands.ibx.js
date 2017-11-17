/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	COMMAND HANDLING
******************************************************************************/

$.widget("ibi.ibxCommand", $.ibi.ibxWidget, 
{
	options:
	{
		"id":null,
		"checked":false,
		"shortcut":null
	},
	_widgetClass:"ibx-command",
	_create:function()
	{
		this._super();
		this.element.css("display", "none");
		this._onCommandKeyEventBound = this._onCommandKeyEvent.bind(this);
		document.documentElement.addEventListener("keydown", this._onCommandKeyEventBound, true);
	},
	_destroy:function()
	{
		this._super();
		document.documentElement.removeEventListener("keydown", this._onCommandKeyEventBound, true);
		delete $.ibi.ibxCommand.cmds[this.options.id];
	},
	trigger:function(e)
	{
		if(!this.options.disabled)
			this.element.dispatchEvent("ibx_triggered", e, false, false, e.target);
	},
	check:function(checked)
	{
		if(checked != this.options.checked)
			$(window).trigger("ibx_cmdchecked");
		this.option("checked", checked);
	},
	_onCommandKeyEvent:function(e)
	{
		var sc = this.options.shortcut;
		if(sc)
		{
			var trigger = true;
			sc = sc.toUpperCase();
			if(-1 != sc.indexOf("CTRL"))
				trigger = trigger & (e.ctrlKey);
			if(-1 != sc.indexOf("ALT"))
				trigger = trigger & (e.altKey);
			if(-1 != sc.indexOf("SHIFT"))
				trigger = trigger & (e.shiftKey);

			sc = sc.replace(/CTRL|ALT|SHIFT|\+| /gi, "");
			trigger = trigger & (($.ui.keyCode[sc] == e.keyCode) || (-1 != sc.search(e.key.toUpperCase())));
			if(trigger)
			{
				this.trigger(e);
				e.preventDefault();
				e.stopPropagation();
			}
		}
	},
	_setOptionDisabled:function(value)
	{
		this._super(value);
		this._refresh()
	},
	_preRefresh:function(option, value)
	{
		var options = this.options
		if(options.id)
			delete $.ibi.ibxCommand.cmds[options.id];
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;

		//configure associated widgets
		var widgets = $(sformat(".ibx-widget[data-ibx-command='{1}']", options.id))
		widgets.ibxWidget("option", "disabled", options.disabled)
		widgets.filter(".ibx-can-toggle").ibxWidget("option", "checked", options.checked);

		if(options.id)
			$.ibi.ibxCommand.cmds[options.id] = this.element;

		//commands don't have to be in the dom to work.
		this.element.detach();
	}
});
$.ibi.ibxCommand.cmds = {};

//# sourceURL=commands.ibx.js

