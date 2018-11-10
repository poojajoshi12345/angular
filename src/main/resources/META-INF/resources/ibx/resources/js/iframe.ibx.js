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
		"focusDefault":true,
		"name":"",
		"src":""
	},
	_widgetClass:"ibx-iframe",
	_create:function()
	{
		this._super();
		this._loadPromise = new $.Deferred();
		var frame = this._iFrame = $("<iframe tabindex='-1'>").ibxAddClass("ibx-iframe-frame");
		frame.on("load", this._onIFrameEvent.bind(this));
		this.element.append(frame);

		var cw = $(this.contentWindow());
		cw.on("keydown keyup keypress mousedown mouseup contextmenu", this._onIFrameEvent.bind(this));
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
		if(e.type == "load")
			this._loadPromise.resolve(this.element[0]);


		if(e.originalEvent)
		{
			var proxyEvent = $.Event(e.originalEvent);
			if(!this.element.trigger(proxyEvent))
				e.preventDefault;
		}
	},
	ready:function(fnReady)
	{
		this._loadPromise.then(fnReady);
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
		if(txt === undefined)
			return this.contentDocument().body.innerText;
		this.contentDocument().body.innerText = txt;
	},
	html:function(html)
	{
		if(html === undefined)
			return this.contentDocument().body.innerHTML;
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
