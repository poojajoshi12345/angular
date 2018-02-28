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
	_refresh:function()
	{
		var options = this.options;
		this._super();
	}
});

//# sourceURL=richtext.ibx.js

