/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:
function IbxDialog()
{
	if (_biInPrototype) return;
		IbxPopup.call(this);
	this._widgetCtor = $.ibi.ibxDialog;
}
_p = _biExtend(IbxDialog, IbxPopup, "IbxDialog");
IbxDialog.base = IbxPopup.prototype;

IbxWidget.addWidgetMember(IbxDialog, "vbMain", "vbMain", IbxVBox);
IbxWidget.addWidgetMember(IbxDialog, "titleBox", "titleBox", IbxHBox);
IbxWidget.addWidgetMember(IbxDialog, "titleClose", "titleClose", IbxButton);
IbxWidget.addWidgetMember(IbxDialog, "caption", "caption", IbxLabel);
IbxWidget.addWidgetMember(IbxDialog, "contentBox", "contentBox", IbxVBox);
IbxWidget.addWidgetEvent(IbxDialog, "focusing");

IbxWidget.addWidgetProperty(IbxDialog, "type");
IbxWidget.addWidgetProperty(IbxDialog, "caption");

$.widget("ibi.ibxDialog", $.ibi.ibxPopup, 
{
	options:
	{
		"nameRoot":true,
		"template":".dialog-template",
		"type":"std",
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
			$.ibi.ibxWidget.bindElements(this.element);
		}

		this.titleClose.on("click", this.close.bind(this));
		this.btnApply.on("click", this.apply.bind(this));
		this.btnCancel.on("click", this.close.bind(this, "cancel"));
		this.btnOK.on("click", this.close.bind(this, "ok"));
		if(options.defaultFocused == "close")
			dlg.titleClose.ibxWidget("option", "defaulFocused", true);
		
		this.element.ibxMutationObserver(
		{
			listen:true,
			fnAddedNodes:this._onChildAdded.bind(this),
			init:{childList:true}
		});
	},
	_destroy:function()
	{
		this._super();
	},
	_init:function()
	{
		this._super();
		this.element.children().not(this.vbMain).detach().appendTo(this.element);
		this.refresh();
	},
	_onChildAdded:function(node, mutation)
	{
		this.contentBox.append(node);
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
	}
});
$.ibi.ibxDialog.createMessageDialog = function(options)
{
	options.type += " std";
	var dlg = $("<div>").ibxDialog(options);
	var msg = $("<div>").ibxLabel(options.messageOptions).addClass("ibx-dialog-message");
	dlg.append(msg);
	dlg.ibxWidget("member", "contentBox").css("padding", "5px");
	$.ibi.ibxWidget.bindElements(dlg);
	return dlg;
};

$.ibi.ibxDialog.statics = 
{
	type:
	{
		plain:"std plain",
		error:"std error",
		information:"std information",
		warning:"std warning",
		question:"std question"
	},
};
//# sourceURL=dialog.ibx.js
