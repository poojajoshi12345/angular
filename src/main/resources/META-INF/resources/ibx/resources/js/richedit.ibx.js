/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:
$.widget("ibi.ibxRichEdit", $.ibi.ibxIFrame, 
{
	options:
	{
		"defaultDropHandling":true,
		"aria":
		{
			"role":"region",
		}
	},
	_widgetClass:"ibx-rich-edit",
	_create:function()
	{
		//save any content before super, so we can set it as the text of the rich edit after create.
		var createContent = this.element.html();
		this.element.empty();
		this._super();

		this.element.on("ibx_dragover ibx_drop", this._onDragEvent.bind(this));
		if(createContent)
			this.insertHTML(createContent);
		this._iFrame.on("focusin", this._onIFrameEvent.bind(this));
	},
	_destroy:function()
	{
		this._super();
	},
	_onIFrameEvent:function(e)
	{
		this._super(e);
		var cd = this.contentDocument();
		if(e.type == "load")
		{
			cd.designMode = "On";
			cd.body.contentEditable = true;
			cd.body.spellcheck = false;
			$(cd).on("focusin selectionchange", this._onRichEditDocEvent.bind(this));

			//set the content if this is created from markup and there is html inside the ibxRichEdit markup.
			var content = this.element.data("createContent");
			if(content)
			{
				this.insertHTML(content.content, content.isHTML, content.replace, content.select);
				this.element.removeData("createContent");
			}
		}
		else
		if(e.type == "focusin" && this._iFrame.is(e.target))
			cd.body.focus();
	},
	_currange:null,
	selection:function(nStart, nEnd)
	{
		if(!arguments.length)
			return this._currange;

		var doc = this.contentDocument();
		var sel = doc.getSelection();
		range = doc.createRange();
		range.setStart(doc.body, nStart);
		range.setEnd(doc.body, nEnd);
		sel.addRange(range);
	},
	_onRichEditDocEvent:function(e)
	{
		var doc = this.contentDocument();
		if(e.type == "focusin" && ibxPlatformCheck.isIE && this._currange)
		{
			this._restoringSelection = true;
			var sel = doc.getSelection();
			sel.removeAllRanges();
			sel.addRange(this._currange);
			this._restoringSelection = false;
		}
		else
		if(e.type == "selectionchange" && this._iFrame.is(document.activeElement) && !this._restoringSelection)
		{
			var sel = doc.getSelection();
			this._currange = sel.rangeCount ? sel.getRangeAt(0) : null;
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
	deselectAll:function(collapseToStart)
	{
		//IE - of course, the selection is removed when focus is lost...so restore, if needed, before collapse.
		var selection = this.contentDocument().getSelection();
		if(!selection.rangeCount && ibxPlatformCheck.isIE)
			selection.addRange(this._currange || document.createRange());
		collapseToStart ? selection.collapseToStart() : selection.collapseToEnd();
	},
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
	justify:function(justify){this.execCommand($.ibi.ibxRichEdit.justify[justify]);},
	fontName:function(name){this.execCommand("fontName", name);},
	fontSize:function(size)
	{
		if(isNaN(parseInt(size, 10)))
			size = $.ibi.ibxRichEdit.fontSize[size];
		this.execCommand("fontSize", size);
	},
	createLink:function(href){this.execCommand("createLink", href);},
	insertList:function(ordered){this.execCommand(ordered ? "insertOrderedList" : "insertUnorderedList");},
	insertHTML:function(html, select, selReplace, focus){this.insertContent(html, true, select, selReplace, focus);},
	insertText:function(text, select,  selReplace, focus){this.insertContent(text, false, select, selReplace, focus);},
	insertContent:function(content, isHTML, select, selReplace, focus)
	{
		/*NOTE: chrome/ff could use insertHTML/insertText...ie doesn't support this, so normalize to a solution that works the same across browsers*/
		//get selections and create proper node for insertion.
		var doc = this.contentDocument();
		if(!doc || (doc.readyState != "complete"))
		{
			this.element.data("createContent", {"content":content, "isHTML":isHTML, "replace":selReplace, "select":select});
			return;
		}

		//nice...ie must have body focused for selections to work...awesome Microsoft!
		var focusItem = document.activeElement;
		if(ibxPlatformCheck.isIE)
			this.element[0].focus();

		//now do the actual insertion
		var selection = doc.getSelection();
		var range = null;
		if(selection.rangeCount)
			range = selection.getRangeAt(0);
		else
		{
			range = doc.createRange();
			range.setStart(doc.body, 0);
		}

		var node = isHTML ? $.parseHTML(content, doc)[0] : doc.createTextNode(content);

		//remove existing selected content if desired.
		if(selReplace)
			range.deleteContents();

		//insert the new node at end of current selection/caret.
		range.collapse(false);
		try
		{
			range.insertNode(node);
		}
		catch(ex)
		{
		}
		
		//OK, so...IE and Chrome are fine with addRange causing a selection of new node...Firefox needs to collapse the range, as it seems to add it automatically...OMG what a nightmare!
		if(select)
			selection.addRange(range);
		else
			range.collapse(false);

		//focus if desired
		if(focus)
			this.element[0].focus();
		else
		if(!focus && ibxPlatformCheck.isIE)
			focusItem.focus();
		return;
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


$.widget("ibi.ibxEditable", $.Widget, 
{
	options:
	{
		"spellcheck":false,
		"autocomplete":false,
		"autocapitalize":false,
		"autocorrect":false,
		"selectAll":true,
		"insertBrOnReturn":true,
		"commitKey":$.ui.keyCode.ENTER,
		"cancelKey":$.ui.keyCode.ESCAPE,
		"commitOnBlur":true,
	},
	_onElementEventBound:null,
	_create:function()
	{
		this.element.data("ibiIbxWidget", this);//polymorphism to ibxWidget
		this.element.ibxAddClass("ibx-editable");
		this._onElementEventBound = this._onElementEvent.bind(this);
		this._super();
	},
	_lastValue:null,
	_onElementEvent:function(e)
	{
		var options = this.options;
		if(e.type == "keydown")
		{
			var isCancel = e.keyCode == options.cancelKey;
			var isCommit = e.keyCode == options.commitKey;
			if(isCancel || isCommit)
			{
				this.stopEditing(isCancel);
				e.preventDefault();
				e.stopPropagation();
			}
			else
			{
				var value = this._lastValue = this.element.text();
				var event = this.element.dispatchEvent("ibx_textchanging", {"keyEvent":e.originalEvent, "text":value}, true, true);
				if(event.isDefaultPrevented())
					e.preventDefault();
			}
		}
		else
		if(e.type == "blur")
		{
			if(options.commitOnBlur)
				this.stopEditing();
		}
	},
	_preEditValue:null,
	startEditing:function(editOptions)
	{
		this._preEditValue = this.element.html();//save the current text for possible reversion.
		this.element.on("keydown blur", this._onElementEventBound);

		var options = $.extend({contentEditable:true}, this.options, editOptions); 
		this.element.prop(options).ibxAddClass("ibx-content-editing").focus();
		if(options.selectAll)
			document.getSelection().selectAllChildren(this.element[0]);
	},
	stopEditing:function(revertToOriginal)
	{
		if(this.element.is(".ibx-content-editing"))
		{
			this.element.off("keydown blur", this._onElementEventBound).prop("contentEditable", false).ibxRemoveClass("ibx-content-editing");
			this.element.focus();
			if(revertToOriginal)
				this.element.html(this._preEditValue);
			else
				this.element.dispatchEvent("ibx_textchanged", this.element.text(), true, false);
		}
	},
});

//# sourceURL=richedit.ibx.js

