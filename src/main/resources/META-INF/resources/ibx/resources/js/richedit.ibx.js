/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:
$.widget("ibi.ibxRichEdit", $.ibi.ibxIFrame, 
{
	options:
	{
		"focusDefault":true,
		"defaultDropHandling":true,
		"aria":
		{
			"role":"region",
		}
	},
	_widgetClass:"ibx-rich-edit",
	_create:function()
	{
		this._readyPromise = new $.Deferred();
		this.element.on("ibx_dragover ibx_drop", this._onDragEvent.bind(this));
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
			$(cd).on("focusin selectionchange", this._onRichEditDocEvent.bind(this));

			//set the content if this is created from markup and there is html inside the ibxRichEdit markup.
			var content = this.element.data("createContent")
			if(content !== undefined)
				cd.body.innerHTML = content;
			this.element.removeData("createContent");
			
			//let the world know we are done by resolving the promise.
			this._readyPromise.resolve(this.element);
		}
	},
	ready:function(fnReady)
	{
		this._readyPromise.then(fnReady);
	},
	_curSelRange:null,
	selection:function(nStart, nEnd)
	{
		if(!arguments.length)
			return this._curSel;
		nStart = nStart || 0;
		nEnd = nEnd || -1;
	},

	_onRichEditDocEvent:function(e)
	{
		var doc = this.contentDocument();
		if(e.type == "focusin" && ibxPlatformCheck.isIE && this._curSelRange)
		{
			this._restoringSelection = true;
			var sel = doc.getSelection();
			sel.removeAllRanges();
			sel.addRange(this._curSelRange);
			this._restoringSelection = false;
		}
		else
		if(e.type == "selectionchange" && this._iFrame.is(document.activeElement) && !this._restoringSelection)
		{
			var sel = doc.getSelection();
			this._curSelRange = sel.rangeCount ? sel.getRangeAt(0) : null;
			this.element.dispatchEvent(e.originalEvent);
		}
	},
	_onDragEvent:function(e)
	{
		if(!this.options.defaultDropHandling)
			return;

		var dt = e.originalEvent.dataTransfer;
		var data = dt.items["text/html"];
		var isHtml = !!data;

		data =  isHtml ? data : dt.items["text/plain"];
		if(!data)
			return;

		var eType = e.type;
		if(eType == "ibx_dragover")
		{
			dt.dropEffect = "copy";
			e.preventDefault();
		}
		else
		if(eType == "ibx_drop")
			(isHtml) ? this.insertHTML(data, true, true) : this.insertText(data, true, true);
	},
	execCommand:function(cmd, value, withUI)
	{
		var cd = this.contentDocument();
		if(cd)
		{
			if(ibxPlatformCheck.isIE)
				this.contentDocument().body.focus();
			cd.execCommand(cmd, withUI, value);
		}
	},
	commandEnabled:function(cmd){return this.contentDocument().queryCommandEnabled(cmd);},
	commandState:function(cmd){return this.contentDocument().queryCommandState(cmd);},
	commandValue:function(cmd){return this.contentDocument().queryCommandValue(cmd);},
	styleWithCSS:function(css){this.execCommand("styleWithCSS", css);},
	defaultParagraphSeparator:function(sep){this.execCommand("defaultParagraphSeparator", sep);},
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
	subscript:function(){this.execCommand("subscript");},
	superscript:function(){this.execCommand("superscript");},
	foreColor:function(color){this.execCommand("foreColor", color);},
	backColor:function(color){this.execCommand("backColor", color);},
	indent:function(){this.execCommand("indent");},
	outdent:function(){this.execCommand("outdent");},
	unlink:function(href){this.execCommand("unlink", href);},
	justify:function(justify){this.execCommand($.ibi.ibxRichEdit.justify[justify])},
	fontName:function(name){this.execCommand("fontName", name);},
	fontSize:function(size)
	{
		if(isNaN(parseInt(size)))
			size = $.ibi.ibxRichEdit.fontSize[size];
		this.execCommand("fontSize", size)
	},
	createLink:function(href){this.execCommand("createLink", href);},
	insertList:function(ordered){this.execCommand(ordered ? "insertOrderedList" : "insertUnorderedList");},
	insertHTML:function(html, selReplace, select){this.insertContent(html, true, selReplace, select);},
	insertText:function(text, selReplace, select){this.insertContent(text, false, selReplace, select);},
	insertContent:function(content, isHTML, selReplace, select)
	{
		/*NOTE: chrome/ff could use insertHTML/insertText...ie doesn't support this, so normalize to a solution that works the same across browsers*/
			
		//focus the document so selections are valid.
		var doc = this.contentDocument();
		doc.body.focus();

		//get selections and create proper node for insertion.
		var sels = doc.getSelection();
		var selRange = sels.getRangeAt(0);
		var node = isHTML ? $.parseHTML(content, doc)[0] : doc.createTextNode(content);

		//remove existing selected content if desired.
		if(selReplace)
			selRange.deleteContents();

		//add new node and select.
		selRange.insertNode(node);
		sels.removeAllRanges();
		sels.addRange(selRange);

		//remove selection if desired.
		if(!select)
			selRange.collapse(false);
	},
	cmdState:function()
	{
		var state = {};
		state.undo = this.commandEnabled("undo");
		state.redo = this.commandEnabled("redo");
		state.selectAll = this.commandEnabled("selectAll");
		state.cut = this.commandEnabled("cut");
		state.copy = this.commandEnabled("copy");
		state.paste = this.commandEnabled("paste");
		state.delete = this.commandEnabled("delete");
		state.bold = this.commandState("bold");
		state.italic = this.commandState("italic");
		state.underline = this.commandState("underline");
		state.strikethrough	= this.commandState("strikethrough");
		state.superscript = this.commandState("superscript");
		state.subscript = this.commandState("subscript");
		state.fontName = this.commandValue("fontName") || ""; //of course IE will return null sometimes.
		state.fontSize = this.commandValue("fontSize") || 3;

		state.justify = "left";
		state.justify = ibx.coercePropVal(this.commandState("justifyLeft")) ? "left" : state.justify;
		state.justify = ibx.coercePropVal(this.commandState("justifyCenter")) ? "center" : state.justify;
		state.justify = ibx.coercePropVal(this.commandState("justifyRight")) ? "right" : state.justify;
		state.justify = ibx.coercePropVal(this.commandState("justifyFull")) ? "full" : state.justify;
		if((state.justify == "justify") && ibxPlatformCheck.isFirefox)
			state.justify = "full";//normalize Firefox..it returns 'justify'.


		//of course, IE returns integers for the color values...seriously??
		state.foreColor = this.commandValue("foreColor");
		state.backColor = this.commandValue("backColor");
		if(ibxPlatformCheck.isIE)
		{
			var fmt = "rgb({1}, {2}, {3})";
			var iClr = state.foreColor;
			state.foreColor =  sformat(fmt, (iClr & 0xFF), ((iClr & 0xFF00)>>8), ((iClr & 0xFF0000)>>16));
			iClr = state.backColor;
			state.backColor =  sformat(fmt, (iClr & 0xFF), ((iClr & 0xFF00)>>8), ((iClr & 0xFF0000)>>16));
		}

		return state;
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();
	}
});

$.ibi.ibxRichEdit.fontSize = 
{
	"xx-small":1,
	"x-small":2,
	"small":3,
	"medium":4,
	"large":5,
	"x-large":6,
	"xx-large":7
}
$.ibi.ibxRichEdit.justify = 
{
	"left":"justifyLeft",
	"center":"justifyCenter",
	"right":"justifyRight",
	"full":"justifyFull"
}






$.widget("ibi.ibxRichEdit2", $.ibi.ibxWidget, 
{
	options:
	{
		"spellCheck":false,
		"defaultDropHandling":true,
		"aria":
		{
			"role":"region",
		}
	},
	_widgetClass:"ibx-rich-edit2",
	_create:function()
	{
		this._readyPromise = new $.Deferred();
		this.element.on("focusin", this._onRichEditEvent.bind(this)).prop("contentEditable", true);
		$(document).on("selectionchange", this._onRichEditEvent.bind(this));
		this._super();
	},
	_destroy:function()
	{
		this._super();
	},
	_curSelRange:null,
	selection:function(nStart, nEnd)
	{
		if(!arguments.length)
			return this._curSelRange;
		nStart = nStart || 0;
		nEnd = nEnd || -1;
	},
	_onRichEditEvent:function(e)
	{
		if(e.type == "focusin" && ibxPlatformCheck.isIE && this._curSelRange)
		{
			this._restoringSelection = true;
			var sel = doc.getSelection();
			sel.removeAllRanges();
			sel.addRange(this._curSelRange);
			this._restoringSelection = false;
		}
		else
		if(e.type == "selectionchange" && this.element.is(document.activeElement) && !this._restoringSelection)
		{
			var sel = doc.getSelection();
			this._curSelRange = sel.rangeCount ? sel.getRangeAt(0) : null;
			this.element.dispatchEvent("selectionchange", sel, false, false);
		}
	},
	text:function(txt)
	{
		if(txt === undefined)
			return this.element.text();
		this.element.text(txt);
	},
	html:function(html)
	{
		if(html === undefined)
			return this.element.html();
		this.element.html(html);
	},
	execCommand:function(cmd, value, withUI)
	{
		if(ibxPlatformCheck.isIE)
			this.element.focus();
		document.execCommand(cmd, withUI, value);
	},
	commandEnabled:function(cmd){return document.queryCommandEnabled(cmd);},
	commandState:function(cmd){return document.queryCommandState(cmd);},
	commandValue:function(cmd){return document.queryCommandValue(cmd);},
	styleWithCSS:function(css){this.execCommand("styleWithCSS", css);},
	defaultParagraphSeparator:function(sep){this.execCommand("defaultParagraphSeparator", sep);},
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
	subscript:function(){this.execCommand("subscript");},
	superscript:function(){this.execCommand("superscript");},
	foreColor:function(color){this.execCommand("foreColor", color);},
	backColor:function(color){this.execCommand("backColor", color);},
	indent:function(){this.execCommand("indent");},
	outdent:function(){this.execCommand("outdent");},
	unlink:function(href){this.execCommand("unlink", href);},
	justify:function(justify){this.execCommand($.ibi.ibxRichEdit.justify[justify])},
	fontName:function(name){this.execCommand("fontName", name);},
	fontSize:function(size)
	{
		if(isNaN(parseInt(size)))
			size = $.ibi.ibxRichEdit.fontSize[size];
		this.execCommand("fontSize", size)
	},
	createLink:function(href){this.execCommand("createLink", href);},
	insertList:function(ordered){this.execCommand(ordered ? "insertOrderedList" : "insertUnorderedList");},
	insertHTML:function(html, selReplace, select){this.insertContent(html, true, selReplace, select);},
	insertText:function(text, selReplace, select){this.insertContent(text, false, selReplace, select);},
	insertContent:function(content, isHTML, selReplace, select)
	{
		/*NOTE: chrome/ff could use insertHTML/insertText...ie doesn't support this, so normalize to a solution that works the same across browsers*/
			
		//focus the document so selections are valid.
		var doc = this.contentDocument();
		doc.body.focus();

		//get selections and create proper node for insertion.
		var sels = doc.getSelection();
		var selRange = sels.getRangeAt(0);
		var node = isHTML ? $.parseHTML(content, doc)[0] : doc.createTextNode(content);

		//remove existing selected content if desired.
		if(selReplace)
			selRange.deleteContents();

		//add new node and select.
		selRange.insertNode(node);
		sels.removeAllRanges();
		sels.addRange(selRange);

		//remove selection if desired.
		if(!select)
			selRange.collapse(false);
	},
	cmdState:function()
	{
		var state = {};
		state.undo = this.commandEnabled("undo");
		state.redo = this.commandEnabled("redo");
		state.selectAll = this.commandEnabled("selectAll");
		state.cut = this.commandEnabled("cut");
		state.copy = this.commandEnabled("copy");
		state.paste = this.commandEnabled("paste");
		state.delete = this.commandEnabled("delete");
		state.bold = this.commandState("bold");
		state.italic = this.commandState("italic");
		state.underline = this.commandState("underline");
		state.strikethrough	= this.commandState("strikethrough");
		state.superscript = this.commandState("superscript");
		state.subscript = this.commandState("subscript");
		state.fontName = this.commandValue("fontName") || ""; //of course IE will return null sometimes.
		state.fontSize = this.commandValue("fontSize") || 3;

		state.justify = "left";
		state.justify = ibx.coercePropVal(this.commandState("justifyLeft")) ? "left" : state.justify;
		state.justify = ibx.coercePropVal(this.commandState("justifyCenter")) ? "center" : state.justify;
		state.justify = ibx.coercePropVal(this.commandState("justifyRight")) ? "right" : state.justify;
		state.justify = ibx.coercePropVal(this.commandState("justifyFull")) ? "full" : state.justify;
		if((state.justify == "justify") && ibxPlatformCheck.isFirefox)
			state.justify = "full";//normalize Firefox..it returns 'justify'.


		//of course, IE returns integers for the color values...seriously??
		state.foreColor = this.commandValue("foreColor");
		state.backColor = this.commandValue("backColor");
		if(ibxPlatformCheck.isIE)
		{
			var fmt = "rgb({1}, {2}, {3})";
			var iClr = state.foreColor;
			state.foreColor =  sformat(fmt, (iClr & 0xFF), ((iClr & 0xFF00)>>8), ((iClr & 0xFF0000)>>16));
			iClr = state.backColor;
			state.backColor =  sformat(fmt, (iClr & 0xFF), ((iClr & 0xFF00)>>8), ((iClr & 0xFF0000)>>16));
		}

		return state;
	},
	_refresh:function()
	{
		var options = this.options;
		this._super();
		this.element.attr("spellCheck", options.spellCheck);
	}
});

//# sourceURL=richedit.ibx.js

