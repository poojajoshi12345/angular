/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.13 $:

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
		"src":"",
		"closeOpenMenusOnBlur":true,
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
		if(!this.isSameDomain())
			return;

		//HOME-3317: when iframe gets blurred close all open menus
		if(e.type == "load"){
			this.contentWindow().addEventListener('blur', function(e){
				this.onWindowBlur(e);
			}.bind(this));
			this._loadPromise.resolve(this.element[0]);
		}


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
	onWindowBlur:function(e)
	{
		if(!this.isSameDomain())
			return;

		if(this.options.closeOpenMenusOnBlur){
			var cw = this.contentWindow();
			if(cw.ibxPopupManager)
				cw.ibxPopupManager.closeOpenPopups('.ibx-menu');
		}
	},
	isSameDomain:function(){
		var html = null;
		try {
			// deal with older browsers
			var doc = this.contentDocument();
			html = doc.body.innerHTML;
		} catch (err) {
			// do nothing
		}
		return (html !== null);
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
		if(!this.isSameDomain())
			return '';
		if(txt === undefined)
			return this.contentDocument().body.innerText;
		this.contentDocument().body.innerText = txt;
	},
	html:function(html)
	{
		if(!this.isSameDomain())
			return '';
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
