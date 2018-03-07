/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxRichEdit", $.ibi.ibxIFrame, 
{
	options:
	{
		"navKeyRoot":true,
		"focusDefault":true,
		"aria":
		{
			"role":"region",
		}
	},
	_widgetClass:"ibx-rich-edit",
	_create:function()
	{
		this._readyPromise = new $.Deferred();
		this.element.data("createContent", this.element.html());
		this.element.empty();
		this._super();
		this._iFrame.prop("tabindex", -1);
	},
	_destroy:function()
	{
		this._super();
	},
	_onIFrameEvent:function(e)
	{
		this._super(e);
		if(e.type == "load")
		{
			var cd = this.contentDocument();
			cd.designMode = "On";
			cd.body.contentEditable = true;
			cd.body.spellcheck = false;
			cd.body.innerHTML = this.element.data("createContent");
			$(cd).on("focusin focusout", this._onRichEditDocEvent.bind(this));
			
			this.element.removeData("createContent");
			this._readyPromise.resolve(this.element);
		}
	},
	_onRichEditDocEvent:function(e)
	{
		if(e.type == "focusout")
		{
			var cw = this.contentWindow();
			var sel = cw.getSelection();
			var range = sel.rangeCount ? sel.getRangeAt(0) : null;
			this.element.data("selInfo", {"sel":sel, "range":range});
		}
		else
		if(e.type == "focusin")
		{
			var selInfo = this.element.data("selInfo");
			if(selInfo && selInfo.range)
			{
				selInfo.sel.removeAllRanges();
				selInfo.sel.addRange(selInfo.range);
			}
		}
	},
	ready:function(fnReady)
	{
		this._readyPromise.then(fnReady);
	},
	execCommand:function(cmd, withUI, value)
	{
		var cd = this.contentDocument();
		cd.body.focus();
		cd.execCommand(cmd, withUI, value);
	},

	undo:function(){this.execCommand("undo");},
	redo:function(){this.execCommand("redo");},
	selectAll:function(){this.execCommand("selectAll");},

	cut:function(){this.execCommand("Cut");},
	copy:function(){this.execCommand("Copy");},
	paste:function(){this.execCommand("Paste");},
	del:function(){this.execCommand("Delete");},

	bold:function(){this.execCommand("Bold");},
	italic:function(){this.execCommand("Italic");},
	underline:function(){this.execCommand("Underline");},
	strikeThrough:function(){this.execCommand("strikeThrough");},

	fontSize:function(size)
	{
		if(typeof(size) === "string")
			size = $.ibi.ibxRichEdit.fontSize[size];
		this.execCommand("fontSize", null, size)
	},
	justify:function(justify)
	{
		if(typeof(justify) === "string")
			justify = $.ibi.ibxRichEdit.justify[justify];
		this.execCommand(justify)
	},
	foreColor:function(color){this.execCommand("foreColor", false, color);},
	backColor:function(color){this.execCommand("backColor", false, color);},

	/*
	bold:function(){this.execCommand("bold");},
	fontName:function(font){this.execCommand("fontName", false, font);},

	fontSize:function(increase){increase ? this.execCommand("increaseFontSize") : this.execCommand("decreaseFontSize");},//suspicious (ff only?)
	paragraphSeparator:function(sep){this.execCommand("defaultParagraphSeparator", null, sep);},//suspicious (chrome/ff only?)
	createLink:function(uri){this.execCommand("creatLink", null, uri);},//suspicious (none?)
	*/


	_refresh:function()
	{
		var options = this.options;
		this._super();
	}
});

$.ibi.ibxRichEdit.fontSize = 
{
	"8":1,
	"10":2,
	"12":3,
	"14":4,
	"18":5,
	"24":6,
	"36":7
}
$.ibi.ibxRichEdit.justify = 
{
	"left":"justifyLeft",
	"center":"justifyCenter",
	"right":"justifyRight",
	"full":"justify"
}

//# sourceURL=richedit.ibx.js

