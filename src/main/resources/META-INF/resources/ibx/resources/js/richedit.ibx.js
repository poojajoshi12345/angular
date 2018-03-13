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
			$(cd).on("focusin focusout selectionchange", this._onRichEditDocEvent.bind(this));

			this.styleWithCSS(true);//by default make editor use css for styling.
			this.element.removeData("createContent");
			this._readyPromise.resolve(this.element);
		}
	},
	_curSelRange:null,
	_capturingSelRange:null,
	selection:function(){return this._curSelRange;},
	_onRichEditDocEvent:function(e)
	{
		var doc = this.contentDocument();
		if(e.type == "focusin" && this._curSelRange)
		{
			var sel = doc.getSelection();
			sel.removeAllRanges();
			sel.addRange(this._curSelRange);
		}
		else
		if(e.type == "focusout")
		{
			var sel = doc.getSelection();
			this._curSelRange = sel.rangeCount ? doc.getSelection().getRangeAt(0) : null;
		}
		else
		if(e.type == "selectionchange")
			this.element.dispatchEvent(e.originalEvent);
	},
	commandEnabled:function(cmd){return this.contentDocument().queryCommandEnabled(cmd);},
	commandState:function(cmd){return this.contentDocument().queryCommandState(cmd);},
	commandValue:function(cmd){return this.contentDocument().queryCommandValue(cmd);},
	cmdStates:function()
	{
		var state = {};
		state.undo = this.commandEnabled("undo");
		state.redo = this.commandEnabled("redo");
		state.selectAll = this.commandEnabled("selectAll");
		state.cut = this.commandEnabled("cut");
		state.copy = this.commandEnabled("copy");
		state.paste = this.commandEnabled("paste");
		state.bold = this.commandState("bold");
		state.italic = this.commandState("italic");
		state.underline = this.commandState("underline");
		state.strikethrough = this.commandState("strikethrough");
		state.fontName = this.commandValue("fontName");
		state.fontSize = this.commandValue("fontSize") || 3;
		state.fontSizePx = $.ibi.ibxRichEdit.fontSize[state.fontSize];
		state.justify = "";
		state.justify = ibx.coercePropVal(this.commandValue("justifyLeft")) ? "left" : state.justify;
		state.justify = ibx.coercePropVal(this.commandValue("justifyCenter")) ? "center" : state.justify;
		state.justify = ibx.coercePropVal(this.commandValue("justifyRight")) ? "right" : state.justify;
		state.justify = ibx.coercePropVal(this.commandValue("justifyFull")) ? "full" : state.justify;
		state.foreColor = this.commandValue("foreColor");
		state.backColor = this.commandValue("backColor");
		return state;
	},
	execCommand:function(cmd, withUI, value)
	{
		this.contentDocument().body.focus();
		this.contentDocument().execCommand(cmd, withUI, value);
	},
	styleWithCSS:function(css){this.execCommand("styleWithCSS", false, css);},
	removeFormat:function(){this.execCommand("removeFormat");},
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
	fontName:function(name){this.execCommand("fontName", false, name);},
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
	indent:function(){this.execCommand("indent");},
	outdent:function(){this.execCommand("outdent");},
	insertList:function(ordered){this.execCommand(ordered ? "insertOrderedList" : "insertUnorderedList");},

	ready:function(fnReady)
	{
		this._readyPromise.then(fnReady);
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();
	}
});

$.ibi.ibxRichEdit.fontSize = 
{
	1:"8",
	2:"10",
	3:"12",
	4:"14",
	5:"18",
	6:"24",
	7:"36",

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
	"full":"justifyFull"
}

//# sourceURL=richedit.ibx.js

