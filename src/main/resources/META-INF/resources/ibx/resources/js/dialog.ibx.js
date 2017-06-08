/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxDialog", $.ibi.ibxPopup, 
{
	options:
	{
		"nameRoot":true,
		"template":".dialog-template",
		"type":"std",
		"autoSize":true,
		"modal":true,
		"autoClose":false,
		"draggable":true,
		"resizable":false,
		"buttons":"okcancel",
		"closeButton":true,
		"closeButtonClasses":"",
		"effect":"fade",
		"captionLabelOptions":
		{
		},

		"optionsMap":
		{
			"caption":"captionLabelOptions.text"
		}
	},
	_widgetClass:"ibx-dialog",
	_create:function()
	{
		this._super();
		var options = this.options;

		//not created via dialog-template from ibxResourceMgr.getResrouce
		if(!this.vbMain)
		{
			var dlgRes = ibxResourceMgr.getResource(this.options.template, false);
			this.element.append(dlgRes.children());
			ibx.bindElements(this.element);
		}

		options.dragHandle = this.titleBox;
		this.titleClose.on("click", this.close.bind(this));
		this.btnApply.on("click", this.apply.bind(this));
		this.btnCancel.on("click", this.close.bind(this, "cancel"));
		this.btnOK.on("click", this.close.bind(this, "ok"));
		if(options.defaultFocused == "close")
			dlg.titleClose.ibxWidget("option", "defaulFocused", true);
	},
	_init:function()
	{
		this._super();
		this.add(this.element.children().not(this.vbMain));
		this.refresh();
	},
	children:function(selector)
	{
		return this.contentBox.ibxWidget("children", selector);
	},
	add:function(el, sibling, before, refresh)
	{
		this.contentBox.ibxWidget("add", el, sibling, before, refresh);
	},
	remove:function(el)
	{
		this.contentBox.ibxWidget("remove", el, refresh);
	},
	apply:function(e)
	{
		this._trigger("apply");
	},
	refresh:function()
	{
		this._super();
		var options = this.options;
		this.caption.ibxLabel(options.captionLabelOptions);
		this.titleClose.css("display", options.closeButton ? "" : "none");
		this.btnOK.css("display", options.buttons.search("ok") != -1 ? "" : "none");
		this.btnCancel.css("display", options.buttons.search("cancel") != -1 ? "" : "none");
		this.btnApply.css("display", options.buttons.search("apply") != -1 ? "" : "none");
		this.element.addClass(options.type);
		options.autoSize ? this.element.addClass("dlg-auto-size") : this.element.removeClass("dlg-auto-size");
	}
});
$.ibi.ibxDialog.createMessageDialog = function(options)
{
	options = $.extend(true, {}, {type:"std", messageOptions:{justify:"start"}}, options);
	var msg = $("<div data-ibx-name='message'>").ibxLabel(options.messageOptions).addClass("ibx-dialog-message");
	var dlg = $("<div>").ibxDialog(options);
	dlg.ibxWidget("add", msg);
	ibx.bindElements(dlg);
	return dlg;
};

$.ibi.ibxDialog.statics = 
{
};
//# sourceURL=dialog.ibx.js
