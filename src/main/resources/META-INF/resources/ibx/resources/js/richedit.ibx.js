/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.94 $:
$.widget("ibi.ibxRichEdit", $.ibi.ibxIFrame, 
{
	options:
	{
		"defaultDropHandling":true,
		"defaultFont":null,
		"aria":
		{
			"role":"region",
		}
	},
	_widgetClass:"ibx-rich-edit",
	_create:function()
	{
		//save any content before super, so we can set it as the text of the rich edit after create.
		var createContent = this.element.html().trim();
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
	_init:function()
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
			cd.body.style.fontFamily = this.options.defaultFont;

			$(cd).on("focusin selectionchange", this._onRichEditDocEvent.bind(this));
			this.contentWindow().addEventListener("unload", this._onIFrameEvent.bind(this));

			//set the content if this is created from markup and there is html inside the ibxRichEdit markup.
			var content = this.element.data("createContent");
			if(content)
			{
				this.insertHTML(content.content, content.isHTML, content.replace, content.select);
				this.element.removeData("createContent");
			}
		}
		else
		if(e.type == "unload")
		{
			//if you move this iframe in the dom, then IE will invalidate the current selection (of course)...so kill it!
			if(ibxPlatformCheck.isIE)
				this._currange = null;
		}
		else
		if(e.type == "focusin" && this._iFrame.is(e.target))
		{
			var cd = this.contentDocument();
			cd.body.focus();
		}
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

		//nice...ie must have something focused for selections to work.
		var focusItem = document.activeElement || this.element[0];
		if(ibxPlatformCheck.isIE)
			this.element[0].focus();

		//now do the actual insertion
		var selection = doc.getSelection();
		var range = null;
		if(selection && selection.rangeCount)
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
		if(select && selection)
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
};
$.ibi.ibxRichEdit.justify = 
{
	"left":"justifyLeft",
	"center":"justifyCenter",
	"right":"justifyRight",
	"full":"justifyFull"
};


/**
 * @namespace ibi.ibxEditable
 * @class
 * @classdesc Allows in-place editing of any elligable element (div/span/etc)
 * @param {object} options The initial options for the widget.
 * @example var myWidget = $(element).ibxEditable(options);
 */
$.widget("ibi.ibxEditable", $.Widget, 
{
	/**
	 * @memberof ibi.ibxEditable.prototype
	 * @name options
	 * @description Configuration options for widget.
	 * @property {object} options
	 * @property {boolean} options.spellcheck Should the element spell check its content .
	 * @property {boolean} options.autocomplete Should the element attempt to autocomplete while entering content.
	 * @property {boolean} options.autocapitalize Should the element attempt to capitalize while entering content.
	 * @property {boolean} options.autocorrect Should the element attempt to correct 'errors' while entering content.
	 * @property {boolean} options.multiLine Allow enter key to create a new line.
	 * @property {boolean} options.selectAll Should all contents be selected when entering edit mode.
	 * @property {boolean} options.insertBrOnReturn Should element use a &lt;br> for line breaks.
	 * @property {keycode} options.commitKey What key press should signify a commit of the current editing.
	 * @property {keycode} options.cancelKey What key press should signify a cancel of the current editing.
	 * @property {boolean} options.commitOnBlur Should the element commit the current text when blurred.
	 */
	options:
	{
		"startEditing":false,
		"spellcheck":false,
		"autocomplete":false,
		"autocapitalize":false,
		"autocorrect":false,
		"multiLine":false,
		"selectAll":true,
		"insertBrOnReturn":true,
		"commitKey":$.ui.keyCode.ENTER,
		"cancelKey":$.ui.keyCode.ESCAPE,
		"editOnFocus":false,
		"commitOnBlur":true,

		"aria":
		{
			"role":"textbox"
		}
	},
	_onElementEventBound:null,
	_create:function()
	{
		this.element.data("ibiIbxWidget", this);//polymorphism to ibxWidget
		this.element.ibxAddClass("ibx-editable");
		this.element.ibxMutationObserver({subtree:true, characterData:true, characterDataOldValue:true});
		this.element.on("keydown focus blur ibx_nodemutated", this._onElementEvent.bind(this));
		this._super();
		this.refresh();
	},
	setAccessibility:$.ibi.ibxWidget.prototype.setAccessibility,
	_setAccessibility:function(accessible, aria)
	{
		options = this.options;
		aria.multiline = options.multiLine ? true : null;
		aria.autocomplete = options.autocomplete ? true : null;
		return aria;	
	},
	_init:function()
	{
		this._super();
		var options = $.extend(true, {}, this.options, ibx.getIbxMarkupOptions(this.element));
		this.option(options);
		if(this.options.startEditing)
			this.startEditing();
	},
	_lastValue:null,
	_onElementEvent:function(e)
	{
		var options = this.options;
		var isEditing = this.isEditing();

		if(e.type == "focus" && !isEditing && options.editOnFocus)
			this.startEditing();
		else
		if(isEditing)
		{
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
				if(!options.multiLine && e.keyCode === $.ui.keyCode.ENTER)
					e.preventDefault();
			}
			else
			if(e.type == "blur")
			{
				if(options.commitOnBlur)
					this.stopEditing();
			}
			else
			if(e.type == "ibx_nodemutated")
			{
				var mr = e.originalEvent.data[0];
				var value = mr.oldValue;
				var newValue = mr.target.textContent;

				if(value != newValue)
				{
					//let people know the value is changing...they can stop it from happening.
					var event = this.element.dispatchEvent("ibx_textchanging", {"value":value, "newValue":newValue}, true, true);
					if(event.isDefaultPrevented())
						mr.target.textContent = value;//revert to current value
				}
			}
		}
	},
	_preEditValue:null,
	/**
	 * @memberof ibi.ibxEditable.prototype
	 * @description Get the original value before editing.
	 */
	preEditValue:function()
	{
		return this._preEditValue;
	},
	/**
	 * @memberof ibi.ibxEditable.prototype
	 * @description Is this control in edit mode.
	 */
	isEditing:function()
	{
		return this.element.is(".ibx-content-editing");
	},
	/**
	 * @memberof ibi.ibxEditable.prototype
	 * @description Start editing the element's content.
	 * @param {object} editOptions The runtime options to use when editing.  Will overlay the widget's options.
	 */
	startEditing:function(editOptions)
	{
		if(!this.isEditing())
		{
			var evt = this.element.dispatchEvent("ibx_startediting", this.element.text(), true, true);
			if(evt.isDefaultPrevented())
				return;

			this._preEditValue = this.element.html();//save the current text for possible reversion.
			var options = $.extend({contentEditable:true}, this.options, editOptions); 
			this.option(options);
			this.element.prop(options).ibxAddClass("ibx-content-editing").focus();
			if(options.selectAll)
				document.getSelection().selectAllChildren(this.element[0]);
			this.element.ibxMutationObserver("option", {listen:true});
			this.refresh();
		}
	},
	/**
	 * @memberof ibi.ibxEditable.prototype
	 * @description Stop editing the element's content.
	 * @param {boolean} revertToOriginal Should the original value (text before editing) be restored.  Essentially a "cancel".
	 * @fires Event:ibx_changed The event's data member will have the new text
	 */
	stopEditing:function(revertToOriginal)
	{
		if(this.isEditing())
		{
			var evt = this.element.dispatchEvent("ibx_stopediting", this.element.text(), true, true);
			if(evt.isDefaultPrevented())
				return;

			this.element.ibxMutationObserver("option", {listen:false});

			//if any seletion, remove it when finished editing.
			var sel = document.getSelection();
			sel.removeAllRanges();

			//cleanup and let world know we're done.
			this.element.ibxRemoveClass("ibx-content-editing").prop("contentEditable", false);
			if(revertToOriginal)
			{
				this.element.html(this._preEditValue);
				this.element.dispatchEvent("ibx_canceledit", this.element.text(), true, false);
			}
			else
			{
				var event = this.element.dispatchEvent("ibx_changed", this.element.text(), true, true);
				if(event.isDefaultPrevented())
					this.element.html(this._preEditValue);
			}
			this.refresh();
		}
	},
	/**
	 * @memberof ibi.ibxEditable.prototype
	 * @description Set the text content of the element.
	 * @param {string} text  The text to set into the element.
	 * @fires Event:ibx_changed The event's data member will have the new text
	 */
	text:function(text)
	{
		this.element.text(text);
		this.element.dispatchEvent("ibx_changed", text, true, false);
	},
	/**
	 * @memberof ibi.ibxEditable.prototype
	 * @description Set the html content of the element.
	 * @param {string} html  The html to set into the element.
	 * @fires Event:ibx_changed The event's data member will have the new text
	 */
	html:function(html)
	{
		this.element.html(html);
		this.element.dispatchEvent("ibx_changed", html, true, false);
	},
	refresh:function()
	{
		this.setAccessibility(ibx.accessible && this.isEditing);
	},
});
//# sourceURL=richedit.ibx.js
