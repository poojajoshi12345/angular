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
	doAction:function(action, data, src)
	{
		this._relTarget = src;
		if(action == "trigger" && !this.options.disabled)
			this.element.dispatchEvent("ibx_triggered", data, false, false, src);
		else
		if(action == "checked")
			this.option("checked", data);
		else
		if(action == "uservalue")
			this.option("userValue", data);
		this._relTarget = null;
	},
	_onCommandKeyEvent:function(e)
	{
		if(eventMatchesCommand(this.options.shortcut, e))
		{
			this.doAction("trigger", null, e.target);
			e.preventDefault();
			e.stopPropagation();
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
		if(changed && key == "checked")
			this.element.dispatchEvent("ibx_checkchanged", value, false, false, this._relTarget);
		else
		if(changed && key == "userValue")
			this.element.dispatchEvent("ibx_uservaluechanged", value, false, false, this._relTarget);
		else
		if(changed && key == "id")
			delete $.ibi.ibxCommand.cmds[this.options.id];
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;

		//configure associated widgets
		var widgets = $(sformat(".ibx-widget[data-ibx-command='{1}']", options.id))
		widgets.ibxWidget(options.disabled ? "disable" : "enable");
		widgets.ibxWidget("userValue", options.userValue);
		widgets.filter(".ibx-can-toggle").ibxWidget("checked", options.checked);

		if(options.id)
			$.ibi.ibxCommand.cmds[options.id] = this.element;
	}
});
$.ibi.ibxCommand.cmds = {};

//# sourceURL=commands.ibx.js

