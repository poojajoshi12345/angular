/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	COMMAND HANDLING
******************************************************************************/

$.widget("ibi.ibxCommand", $.ibi.ibxWidget, 
{
	options:
	{
		cmdId:null,
		checked:false,
		shortcut:null
	},
	_widgetClass:"ibx-command",
	_create:function()
	{
		this._super();
		this.element.css("display", "none");
		this._onCommandKeyEventBound = this._onCommandKeyEvent.bind(this);
	},
	trigger:function(e)
	{
		this._trigger("triggered", e);
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
				e.preventDefault();
				e.stopPropagation();
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		this.element.attr("data-ibxp-cmd-id", options.cmdId);
		var triggers = $(sformat(".ibx-widget[data-ibxp-command='{1}']", options.cmdId))
		
		triggers.ibxWidget("option", "disabled", options.disabled);
		triggers.filter(".ibx-can-toggle").ibxWidget("option", "checked", options.checked);

		//add shortcut key handling
		if(options.shortcut)
			document.documentElement.addEventListener("keydown", this._onCommandKeyEventBound, true);
		else
			document.documentElement.removeEventListener("keydown", this._onCommandKeyEventBound, true);
	}
});

//# sourceURL=commands.ibx.js

