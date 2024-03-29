/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.47 $:

$.widget("ibi.ibxDialog", $.ibi.ibxPopup, 
{
	options:
	{
		"nameRoot":true,
		"type":"std plain", //predefines: std and plain/error/warning/information/question
		"autoSize":true,
		"modal":true,
		"autoClose":false,
		"movable":true,
		"buttons":"okcancel",
		"closeButton":true,
		"closeButtonClasses":"",
		"defaultAction":".ibx-dialog-ok-button",
		"effect":"fade",
		"captionOptions":{},
		
		"aria":
		{
			"role":"dialog"
		}
	},
	_widgetClass:"ibx-dialog",
	_create:function()
	{
		this._super();
		this._loadWidgetTemplate(".ibx-dialog-template");

		var options = this.options;
		options.moveHandle = this.titleBox;
		this.element.on("keydown", this._onDialogKeyDown.bind(this));
		this.titleClose.on("click", this.close.bind(this, "cancel"));
		this.btnCustom.on("click", this.custom.bind(this));
		this.btnApply.on("click", this.apply.bind(this));
		this.btnCancel.on("click", this.close.bind(this, "cancel"));
		this.btnOK.on("click", this.close.bind(this, "ok"));
		this.btnNo.on("click", this.close.bind(this, "no"));
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		if(!aria.labelledby)
			aria.labelledby = this.caption.prop("id");
		return aria;
	},
	_destroy:function()
	{
		this._super();
		var options = this.options;
		this.element.ibxRemoveClass("dlg-auto-size");
		this.element.ibxRemoveClass(options.type);

		var children = this.children();
		children.detach();
		this.element.empty();
		this.element.append(children);
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
	remove:function(el, destroy, refresh)
	{
		this.contentBox.ibxWidget("remove", el, destroy, refresh);
	},
	apply:function(e)
	{
		this.element.dispatchEvent("ibx_apply");
	},
	custom:function(e)
	{
		this.element.dispatchEvent("ibx_custom");
	},
	_onDialogKeyDown:function(e)
	{
		var defAction = this.options.defaultAction;
		if(!$(e.target).is(".ibx-button") && e.keyCode == 13 && defAction)
		{
			var target = this.element.find(defAction);
			if(!target.ibxWidget("option", "disabled"))
				target.dispatchEvent("click");
		}
	},
	_refresh:function()
	{
		this._super();
		var options = this.options;

		//manage default captions
		var caption = options.captionOptions.text;
		if(!caption)
		{
			if(-1 != options.type.search("plain"))
				caption = ibx.resourceMgr.getString("IBX_DLG_CAPTION_PLN");
			else
			if(-1 != options.type.search("error"))
				caption = ibx.resourceMgr.getString("IBX_DLG_CAPTION_ERR");
			else
			if(-1 != options.type.search("warn"))
				caption = ibx.resourceMgr.getString("IBX_DLG_CAPTION_WRN");
			else
			if(-1 != options.type.search("information"))
				caption = ibx.resourceMgr.getString("IBX_DLG_CAPTION_INF");
			else
			if(-1 != options.type.search("question"))
				caption = ibx.resourceMgr.getString("IBX_DLG_CAPTION_QST");
		
			options.captionOptions.text = caption;
		}			
		this.caption.ibxLabel(options.captionOptions);

		this.titleClose.css("display", options.closeButton ? "" : "none");
		this.btnOK.css("display", options.buttons.search("ok") != -1 ? "" : "none");
		this.btnNo.css("display", options.buttons.search("no") != -1 ? "" : "none");
		this.btnCancel.css("display", options.buttons.search("cancel") != -1 ? "" : "none");
		this.btnApply.css("display", options.buttons.search("apply") != -1 ? "" : "none");
		this.btnCustom.css("display", options.buttons.search("custom") != -1 ? "" : "none");
		this.element.find(".ibx-dlg-default-action").ibxRemoveClass("ibx-dlg-default-action");
		this.element.find(options.defaultAction).ibxAddClass("ibx-dlg-default-action");
		this.element.ibxAddClass(options.type);
		options.autoSize ? this.element.ibxAddClass("dlg-auto-size") : this.element.ibxRemoveClass("dlg-auto-size");
	}
});
$.ibi.ibxDialog.createMessageDialog = function(options)
{
	options = options || {};

	//setup the options for the dialog
	options = $.extend(true, {},
	{
		type:"std",
		captionOptions:
		{
			text:options.caption,
		},
		messageOptions:
		{
			text:options.message,
			textWrap:true,
			justify:"start",
		},
		aria:{role:"alertdialog"}
	}, options);
	var msg = $("<div data-ibx-name='message'>").ibxLabel(options.messageOptions).ibxAddClass("ibx-dialog-message").ibxAriaId();

	//setup the dialog
	options.aria = $.extend(true, {}, {"describedby":msg.prop("id")}, options.aria);
	var dlg = $("<div>").ibxDialog(options).ibxDialog("add", msg);
	ibx.bindElements(msg);
	return dlg;
};

$.ibi.ibxDialog.statics = 
{
};
//# sourceURL=dialog.ibx.js
