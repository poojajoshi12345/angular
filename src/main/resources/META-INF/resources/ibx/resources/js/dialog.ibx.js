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
		"moveable":true,
		"buttons":"okcancel",
		"closeButton":true,
		"closeButtonClasses":"",
		"defaultAction":".ibx-dialog-ok-button",
		"effect":"fade",
		"captionOptions":{},
	},
	_widgetClass:"ibx-dialog",
	_create:function()
	{
		this._super();
		var options = this.options;

		//not created via dialog-template from ibx.resourceMgr.getResrouce
		if(!this.vbMain)
		{
			var dlgRes = ibx.resourceMgr.getResource(this.options.template, false);
			this.element.append(dlgRes.children());
			ibx.bindElements(this.element);
		}

		options.moveHandle = this.titleBox;
		this.element.on("keydown", this.__onDialogKeyDown.bind(this));
		this.titleClose.on("click", this.close.bind(this, "cancel"));
		this.btnApply.on("click", this.apply.bind(this));
		this.btnCancel.on("click", this.close.bind(this, "cancel"));
		this.btnOK.on("click", this.close.bind(this, "ok"));
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
	__onDialogKeyDown:function(e)
	{
		var defAction = this.options.defaultAction;
		if(e.keyCode == 13 && defAction)
		{
			this.element.find(defAction).trigger("click");
		}
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;
		this.caption.ibxLabel(options.captionOptions);
		this.titleClose.css("display", options.closeButton ? "" : "none");
		this.btnOK.css("display", options.buttons.search("ok") != -1 ? "" : "none");
		this.btnCancel.css("display", options.buttons.search("cancel") != -1 ? "" : "none");
		this.btnApply.css("display", options.buttons.search("apply") != -1 ? "" : "none");
		this.element.find(".ibx-dlg-default-action").removeClass("ibx-dlg-default-action");
		this.element.find(options.defaultAction).addClass("ibx-dlg-default-action");
		this.element.addClass(options.type);
		options.autoSize ? this.element.addClass("dlg-auto-size") : this.element.removeClass("dlg-auto-size");
	}
});
$.ibi.ibxDialog.createMessageDialog = function(options)
{
	options.captionOptions = {text:options.caption};//map caption to proper option.
	options = $.extend(true, {}, {type:"std", messageOptions:{justify:"start"}}, options);
	var msg = $("<div data-ibx-name='message'>").ibxLabel(options.messageOptions).addClass("ibx-dialog-message");
	var dlg = $("<div>").ibxDialog().ibxDialog("option", options);
	dlg.ibxWidget("add", msg);
	ibx.bindElements(dlg);
	return dlg;
};

$.ibi.ibxDialog.statics = 
{
};
//# sourceURL=dialog.ibx.js
