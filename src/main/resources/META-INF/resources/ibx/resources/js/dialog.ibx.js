/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxDialog", $.ibi.ibxPopup, 
{
	options:
	{
		"nameRoot":true,
		"template":".dialog-template",
		"type":"std plain", //predefines: std and plain/error/warning/information/question
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
		
		"aria":
		{
			"role":"dialog"
		}
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
		this.element.on("keydown", this._onDialogKeyDown.bind(this));
		this.titleClose.on("click", this.close.bind(this, "cancel"));
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
		this._trigger("apply");
	},
	_onDialogKeyDown:function(e)
	{
		var defAction = this.options.defaultAction;
		if(e.keyCode == 13 && defAction)
		{
			var target = this.element.find(defAction).data("ibxWidget");
			if(!target.options.disabled)
				target.element.trigger("click");
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
		this.element.find(".ibx-dlg-default-action").removeClass("ibx-dlg-default-action");
		this.element.find(options.defaultAction).addClass("ibx-dlg-default-action");
		this.element.addClass(options.type);
		options.autoSize ? this.element.addClass("dlg-auto-size") : this.element.removeClass("dlg-auto-size");
	}
});
$.ibi.ibxDialog.createMessageDialog = function(options)
{
	//setup the message for the dialog
	options = $.extend(true, {}, {type:"std", messageOptions:{textWrap:true, justify:"start"}}, options);
	var msg = $("<div data-ibx-name='message'>").ibxLabel(options.messageOptions).addClass("ibx-dialog-message").ibxAriaId();

	//setup the dialog
	options.captionOptions = {text:options.caption};//map caption to proper option.
	options.aria = $.extend(true, {}, {"role":"alertdialog", "describedby":msg.prop("id")}, options.aria);
	var dlg = $("<div>").ibxDialog(options).ibxDialog("add", msg);
	ibx.bindElements(dlg);
	return dlg;
};

$.ibi.ibxDialog.statics = 
{
};
//# sourceURL=dialog.ibx.js
