/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxRichEdit", $.ibi.ibxIFrame, 
{
	options:
	{
		"src":"",
		"aria":
		{
			"role":"region",
		}
	},
	_widgetClass:"ibx-rich-text",
	_create:function()
	{
		this.element.data("createContent", this.element.html());
		this.element.empty();
		this._super();
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
			var cw = this.contentWindow();
			cd.designMode = "On";
			cd.body.contentEditable = true;
			cd.body.innerHTML = this.element.data("createContent");
			this.element.removeData("createContent");
		}
	},
	execCommand:function(cmd, withUI, value)
	{
		this.contentDocument().execCommand(cmd, withUI, value);
	},
	cut:function(){this.execCommand("Cut");},
	copy:function(){this.execCommand("Copy");},
	paste:function(){this.execCommand("Paste");},
	del:function(){this.execCommand("Delete");},

	bold:function(){this.execCommand("Bold");},
	italic:function(){this.execCommand("Italic");},
	underline:function(){this.execCommand("Underline");},


	/*
	backColor:function(color){this.execCommand("backColor", false, color);},
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

//# sourceURL=richedit.ibx.js

