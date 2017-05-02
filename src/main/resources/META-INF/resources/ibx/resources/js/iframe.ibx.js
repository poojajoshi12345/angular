/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	IBXIFRAME
	Simple wrapper around an iframe...needed because on ios you can't actually
	set the size of the iframe directly, so you have to wrap it in an outer
	div which you can size.
******************************************************************************/
$.widget("ibi.ibxIFrame", $.ibi.ibxWidget, 
{
	options:
	{
		name:"",
		src:"about:blank",
	},
	_widgetClass:"ibx-iframe",
	_create:function()
	{
		this._super();
		var frame = this._iFrame = $("<iframe>").addClass("ibx-iframe-frame");

		this.element.append(frame);

	},
	_destroy:function()
	{
		this._super();
	},
	frame:function()
	{
		return this._iFrame;
	},
	contentDocument:function()
	{
		return this._iFrame.prop("contentDocument");
	},
	contentWindow:function()
	{
		return this._iFrame.prop("contentWindow");
	},
	refresh:function()
	{
		this._super();
		var options = this.options;
		this._iFrame.prop(
		{
			name:options.name,
			src:options.src,
		});
	}
});
//# sourceURL=iframe.ibx.js
