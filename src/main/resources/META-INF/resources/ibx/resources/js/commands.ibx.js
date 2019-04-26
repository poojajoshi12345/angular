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
	_init:function()
	{
		//need to do this so that if created from markup the id will be set first so userValue/etc will correctly be set on associated widgets.
		//_setOption relies on id being set first.
		var markupOpts = ibx.getIbxMarkupOptions(this.element);
		if(markupOpts.id)
			this.option("id", markupOpts.id);
		this._super();
	},
	doAction:function(action, data, src)
	{
		var ret = true;
		this._relTarget = src;
		if(action == "trigger" && !this.options.disabled)
			event = this.element.dispatchEvent("ibx_triggered", data, false, false, src);
		else
		if(action == "disabled")
			this.option("disabled", data);
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
		if(eventMatchesShortcut(this.options.shortcut, e))
			this.doAction("trigger", null, e.target);
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		var idOld = options.id;
		var changed = this.options[key] != value;
		
		//calls base
		this._super(key, value);

		if(key == "id")
		{
			delete $.ibi.ibxCommand.cmds[idOld];//remove old entry
			$.ibi.ibxCommand.cmds[value] = this.element;//add new entry
			this.updateState();//update all the states of connected widgets.
		}
		else
		if(changed && (key == "disabled" || key == "checked" || key == "userValue"))
		{
			if(key == "disabled")
				this.updateState(key);
			else
			if(key == "checked")
				this.updateState(key);
			else
			if(key == "userValue")
				this.updateState(key);
		}
	},
	updateState:function(state)
	{
		var options = this.options;
		var widgets = $(sformat(".ibx-widget[data-ibx-command='{1}']", options.id)); //widgets attached to this command.
		if(state == "disabled" || !state)
		{
			widgets.ibxWidget(options.disabled ? "disable" : "enable");
			this.element.dispatchEvent("ibx_disabledchanged", options.disabled, false, false, this._relTarget);
		}

		if(state == "checked" || !state)
		{
			widgets.filter(".ibx-can-toggle").ibxWidget("checked", options.checked);
			this.element.dispatchEvent("ibx_checkchanged", options.checked, false, false, this._relTarget);
		}

		if(state == "userValue" || !state)
		{
			widgets.ibxWidget("userValue", options.userValue);
			//don't need to dispatch uservaluechanged event because the base widget will do that when the option changes.
		}
	}
});
$.ibi.ibxCommand.cmds = {};

//# sourceURL=commands.ibx.js

