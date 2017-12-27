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
		"shortcut":null,
		"userValue":null,
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
	trigger:function(data, src)
	{
		if(!this.options.disabled)
			this.element.dispatchEvent("ibx_triggered", data, false, false, src);
	},
	checked:function(checked, src)
	{
		if(checked === undefined)
			return this.options.checked;
		this._relTarget = src;
		this.option("checked", checked);
		this._relTarget = null;
	},
	userValue:function(value, src)
	{
		if(value === undefined)
			return this.options.userValue;
		this._relTarget = src;
		this.option("userValue", value);
		this._relTarget = null;
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
	_setOption:function(key, value)
	{
		var changed = this.options[key] != value;
		this._super(key, value);

		if(changed && key == "id")
			delete $.ibi.ibxCommand.cmds[this.options.id];
		else
		if(changed && key == "checked")
			this.element.dispatchEvent("ibx_checkchanged", value, false, false, this._relTarget);
		else
		if(changed && key == "userValue")
			this.element.dispatchEvent("ibx_uservaluechanged", value, false, false, this._relTarget);
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;

		//configure associated widgets
		var widgets = $(sformat(".ibx-widget[data-ibx-command='{1}']", options.id))
		widgets.ibxWidget("option", "disabled", options.disabled);
		widgets.ibxWidget("option", "userValue", options.userValue);
		widgets.filter(".ibx-can-toggle").ibxWidget("checked", options.checked);

		if(options.id)
			$.ibi.ibxCommand.cmds[options.id] = this.element;
	}
});
$.ibi.ibxCommand.cmds = {};
$.ibi.ibxCommand.TRIGGER = "trigger";
$.ibi.ibxCommand.CHECK = "checked";
$.ibi.ibxCommand.USER_VALUE = "userValue";

//# sourceURL=commands.ibx.js

