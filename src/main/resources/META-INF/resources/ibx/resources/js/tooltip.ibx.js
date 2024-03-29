/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.4 $:

$.widget("ibi.ibxTooltip", $.ibi.ibxPopup, 
{
	options:
	{
		"text":null,
		"effect":"fade",
		"delay":300,
		"destroyOnClose":true,
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
	open:function(openInfo)
	{
		ibxPopupManager.closeOpenPopups(".ibx-tooltip");
		this._super();
	},
	close:function(closeInfo)
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
