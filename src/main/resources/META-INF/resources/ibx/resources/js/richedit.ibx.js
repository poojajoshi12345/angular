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
	_onDragEvent:function(e)
	{
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
			(isHtml) ? this.insertHTML(data) : this.insertText(data);
	},
	pasteHtmlAtCaret:function pasteHtmlAtCaret(html, selectPastedContent)
	{
		var sel, range;
		var sel = this.getContentWindow().getSelection();
		if (window.getSelection)
		{
			// IE9 and non-IE
			sel = window.getSelection();
			if(sel.getRangeAt && sel.rangeCount)
			{
				range = sel.getRangeAt(0);
				range.deleteContents();

				// Range.createContextualFragment() would be useful here but is
				// only relatively recently standardized and is not supported in
				// some browsers (IE9, for one)
				var el = document.createElement("div");
				el.innerHTML = html;
				var frag = document.createDocumentFragment(), node, lastNode;
				while((node = el.firstChild))
				{
					lastNode = frag.appendChild(node);
				}
				var firstNode = frag.firstChild;
				range.insertNode(frag);

				// Preserve the selection
				if (lastNode)
				{
					range = range.cloneRange();
					range.setStartAfter(lastNode);
					if (selectPastedContent) {
						range.setStartBefore(firstNode);
					} else {
						range.collapse(true);
					}
					sel.removeAllRanges();
					sel.addRange(range);
				}
			}
		}
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
			$(cd).on("focusin focusout selectionchange", this._onRichEditDocEvent.bind(this));

			this.styleWithCSS(true);//by default make editor use css for styling.

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
			return this._curSelRange;
		nStart = nStart || 0;
		nEnd = nEnd || -1;
		debugger;
	},
	_onRichEditDocEvent:function(e)
	{
		var doc = this.contentDocument();
		if(e.type == "focusin" && ibxPlatformCheck.isIE && this._curSelRange)
		{
			var sel = doc.getSelection();
			sel.removeAllRanges();
			sel.addRange(this._curSelRange);
		}
		if(e.type == "selectionchange" && this._iFrame.is(document.activeElement))
		{
			var sel = doc.getSelection();
			this._curSelRange = sel.rangeCount ? sel.getRangeAt(0) : null;
			this.element.dispatchEvent(e.originalEvent);
		}
},
	execCommand:function(cmd, withUI, value)
	{
		if(ibxPlatformCheck.isIE)
			this.contentDocument().body.focus();
		console.dir(this._curSelRange);
		this.contentDocument().execCommand(cmd, withUI, value);
	},
	commandEnabled:function(cmd){return this.contentDocument().queryCommandEnabled(cmd);},
	commandState:function(cmd){return this.contentDocument().queryCommandState(cmd);},
	commandValue:function(cmd){return this.contentDocument().queryCommandValue(cmd);},
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
	subscript:function(){this.execCommand("subscript");},
	superscript:function(){this.execCommand("superscript");},
	foreColor:function(color){this.execCommand("foreColor", false, color);},
	backColor:function(color){this.execCommand("backColor", false, color);},
	indent:function(){this.execCommand("indent");},
	outdent:function(){this.execCommand("outdent");},
	insertList:function(ordered){this.execCommand(ordered ? "insertOrderedList" : "insertUnorderedList");},
	insertHTML:function(html){this.execCommand("insertHTML", false, html);},
	insertText:function(text){this.execCommand("insertText", false, text);},
	createLink:function(href){this.execCommand("createLink", false, href);},
	unlink:function(href){this.execCommand("unlink", false, href);},
	justify:function(justify){this.execCommand($.ibi.ibxRichEdit.justify[justify])},
	fontName:function(name){this.execCommand("fontName", false, name);},
	fontSize:function(size)
	{
		if(isNaN(parseInt(size)))
			size = $.ibi.ibxRichEdit.fontSize[size];
		this.execCommand("fontSize", null, size)
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
		state.fontName = this.commandValue("fontName");
		state.fontSize = this.commandValue("fontSize") || 3;
		state.justify = "";
		state.justify = ibx.coercePropVal(this.commandValue("justifyLeft")) ? "left" : state.justify;
		state.justify = ibx.coercePropVal(this.commandValue("justifyCenter")) ? "center" : state.justify;
		state.justify = ibx.coercePropVal(this.commandValue("justifyRight")) ? "right" : state.justify;
		state.justify = ibx.coercePropVal(this.commandValue("justifyFull")) ? "full" : state.justify;
		state.foreColor = this.commandValue("foreColor");
		state.backColor = this.commandValue("backColor");
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

//# sourceURL=richedit.ibx.js

