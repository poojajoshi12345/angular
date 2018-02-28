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
		frame.on("DOMContentLoaded readystatechange load beforeunload unload", this._onIFrameEvent.bind(this));
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
	_onIFrameEvent:function(e)
	{
		this.element.dispatchEvent(e.originalEvent);
	},
	contentDocument:function()
	{
		return this._iFrame.prop("contentDocument");
	},
	contentWindow:function()
	{
		return this._iFrame.prop("contentWindow");
	},
	text:function(txt)
	{
		this.contentDocument().body.innerText = txt;
	},
	html:function(html)
	{
		this.contentDocument().body.innerHTML = html;
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		var frmOptions = {};
		var curSrc = this._iFrame.attr("src") || "";
		var curName = this._iFrame.prop("name");
		if(curSrc != options.src)
			frmOptions.src = options.src;
		if(curName != options.name)
			frmOptions.name = options.name;
		this._iFrame.prop(frmOptions);
	}
});
//# sourceURL=iframe.ibx.js
