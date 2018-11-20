/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxTooltip", $.ibi.ibxPopup, 
{
	options:
	{
		"text":null,
		"effect":"fade",
		"delay":500,
		"destroyOnClose":false,
	},
	_widgetClass:"ibx-tooltip",
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
		this._super();
		var options = this.options;
		this.element.ibxToggleClass("ibx-text-tip", options.text);
		if(options.text)
			this.element.html(options.text);
	}
});

//# sourceURL=tooltip.ibx.js
