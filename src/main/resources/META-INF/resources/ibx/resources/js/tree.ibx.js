/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxTree", $.ibi.ibxWidget, 
{
	options:
	{
		"aria":
		{
			"role":"treegrid",
			"readonly":true
		}
	},
	_widgetClass:"ibx-treegrid",
	_create:function()
	{
		this._super();
	},
	_destroy:function()
	{
		this._super();
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();
	}
});


//# sourceURL=tree.ibx.js

