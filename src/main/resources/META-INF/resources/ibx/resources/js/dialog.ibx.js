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

IbxDialog.createConfirmDialog = function(options)
{
	var ibxDlgWidget = $.ibi.ibxDialog.createConfirmDialog(options);
	var ibxWidget = ibxDlgWidget.data("ibxWidget");
	var ibxDlg = new IbxDialog();
	ibxDlg.bindWidget(ibxDlgWidget);
	ibxDlg.setDraggable(false);
	ibxDlg.message = new IbxLabel().bindWidget(ibxWidget.message);
	ibxDlg.btnBox = new IbxHBox().bindWidget(ibxWidget.btnBox);
	ibxDlg.btnCancel = new IbxButton().bindWidget(ibxWidget.btnCancel);
	ibxDlg.btnOK = new IbxButton().bindWidget(ibxWidget.btnOK);
	return ibxDlg;
};

IbxDialog.createInputDialog = function(options)
{
	var ibxDlgWidget = $.ibi.ibxDialog.createInputDialog(options);
	var ibxWidget = ibxDlgWidget.data("ibxWidget");
	var ibxDlg = new IbxDialog();
	ibxDlg.bindWidget(ibxDlgWidget);
	ibxDlg.message = new IbxLabel().bindWidget(ibxWidget.message);
	ibxDlg.ctrlBox = new IbxHBox().bindWidget(ibxWidget.ctrlBox);
	ibxDlg.ctrlLabel = new IbxLabel().bindWidget(ibxWidget.ctrlLabel);
	ibxDlg.ctrlInput = new IbxTextField().bindWidget(ibxWidget.ctrlInput);
	ibxDlg.btnBox = new IbxHBox().bindWidget(ibxWidget.btnBox);
	ibxDlg.btnCancel = new IbxButton().bindWidget(ibxWidget.btnCancel);
	ibxDlg.btnOK = new IbxButton().bindWidget(ibxWidget.btnOK);
	return ibxDlg;
};

$.widget("ibi.ibxDialog", $.ibi.ibxPopup, 
{
	options:
	{
		"nameRoot":true,
		"type":"std",
		"autoClose":false,
		"draggable":true,
		"resizable":false,
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
		var vb = this.vbMain = $("<div>").ibxVBox({"align":"stretch"}).addClass("ibx-dialog").css("height", "100%");
		var titleBox = this.titleBox = $("<div>").ibxHBox({"align":"center"}).addClass("ibx-dialog-title-bar");
		var titleClose = this.titleClose = $("<div tabIndex='1'>").ibxButton().addClass("ibx-title-bar-close-button").on("click", this.close.bind(this));
		var caption = this.caption = $("<div>").ibxLabel({"justify":"start"}).addClass("ibx-title-bar-caption");
		var contentBox = this.contentBox= $("<div>").ibxVBox({"align":"stretch"}).addClass("ibx-dialog-content");
		titleBox.append(caption, titleClose)
		vb.append(titleBox, contentBox);
		this.element.append(vb).ibxMutationObserver(
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
	refresh:function()
	{
		this._super();
		var options = this.options;
		this.caption.ibxLabel(options.captionLabelOptions);
		this.titleClose.css("display", options.closeButton ? "" : "none");
		this.element.addClass(options.type);
	}
});
$.ibi.ibxDialog.getStandardDialogOptions = function(options){return $.extend({},  $.ibi.ibxDialog.statics._standardDialogOptions, options);};
$.ibi.ibxDialog.createBaseStandardDialog = function(options)
{
	var options = $.extend({"draggable":false, "destroyOnClose":true, "buttons":"okcancel"}, options);
	var hasOK = (options.buttons.search("ok") != -1);
	var hasCancel = (options.buttons.search("cancel") != -1);
	var btnBox = 
	[
		"<div data-ibx-type='ibxHBox' data-ibx-name='btnBox' data-ibxp-justify='end' data-ibxp-align='center' class='ibx-dialog-button-box'>",
			"<div data-ibx-type='ibxButton' data-ibx-name='btnCancel' data-ibxp-icon-position='top' class='ibx-dialog-cancel-button' tabIndex='1'></div>",
			"<div data-ibx-type='ibxButton' data-ibx-name='btnOK' data-ibxp-icon-position='top' class='ibx-dialog-ok-button' tabIndex='1'></div>",
		"</div",
	];
	btnBox = $(btnBox.join(""));

	var widget = $("<div>").ibxDialog(options).addClass($.ibi.ibxDialog.statics.type[options.type]).data("ibxWidget");
	widget.vbMain.append(btnBox);
	$.ibi.ibxWidget.bindElements(widget.element);

	widget.btnCancel.ibxButton({text:(options.btnCancelLabel || "Cancel")}).css("display", hasCancel ? "" : "none").on("click", widget.close.bind(widget, "cancel"));
	widget.btnOK.ibxButton({text:(options.btnOkLabel || "OK")}).css("display", hasOK ? "" : "none").on("click", widget.close.bind(widget, "ok"));
	
	if(options.defaultFocused == "close")
		widget.titleClose.ibxWidget("option", "defaulFocused", true);
	return widget.element;
};
$.ibi.ibxDialog.createConfirmDialog = function(options)
{
	var message = $("<div class='ibx-dialog-confirm-message' data-ibx-type='ibxLabel' data-ibx-name='message' data-ibxp-justify='start'</div>");
	var dlg = $.ibi.ibxDialog.createBaseStandardDialog(options).append(message);
	$.ibi.ibxWidget.bindElements(dlg)//bind any new content from the message.

	var widget = dlg.data("ibxWidget");
	widget.message.ibxWidget("option", "text", options.message);
	if(options.defaultFocused == "ok")
		widget.btnOK.ibxWidget("option", "defaultFocused", true);
	if(options.defaultFocused == "cancel")
		widget.btnCancel.ibxWidget("option", "defaultFocused", true);
	return dlg;
};
$.ibi.ibxDialog.createInputDialog = function(options)
{
	var ctrlBox = 
	[
		"<div data-ibx-name='ctrlBox' data-ibx-type='ibxHBox' data-ibxp-align='stretch' class='ibx-dialog-input-ctrl-box'>",
			"<div data-ibx-type='ibxLabel' data-ibx-name='ctrlLabel' data-ibxp-for-id='txtField' data-ibxp-justify='start' data-ibxp-text='{1}' class='ibx-dialog-input-label'></div>",
			"<div data-ibx-type='ibxTextField' data-ibx-name='ctrlInput' data-ibxp-for-id='txtField' data-ibxp-ctrl-type='{2}' data-ibxp-ctrl-placeholder='{3}' value='{4}' class='ibx-dialog-input-ctrl' tabIndex='1'></div>",
		"</div>"
	];
	ctrlBox = sformat(ctrlBox.join(""), options.inputLabel, options.inputType, options.placeholder, options.inputValue);

	var dlg = $.ibi.ibxDialog.createConfirmDialog(options).append(ctrlBox);
	$.ibi.ibxWidget.bindElements(dlg)//bind any new content from the message.

	var widget = dlg.data("ibxWidget");
	if(options.defaultFocused == "input")
		widget.ctrlInput.ibxWidget("option", "defaultFocused", true);

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
	_standardDialogOptions:
	{
		autoClose:true,
		caption:"Attention",
		message:"",
		type:"standard",
		inputLabel:"Value:",
		inputType:"text",
		inputValue:"",
		placeholder:"Enter a value",
		buttons:"okcancel",
		btnOkLabel:"OK",
		btnCancelLabel:"Cancel",
		defaultFocused:"cancel", /*ok|cancel|input|close*/
	},
};
//# sourceURL=dialog.ibx.js
