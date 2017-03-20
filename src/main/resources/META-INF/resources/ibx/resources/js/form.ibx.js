/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:
function IbxForm()
{
	if (_biInPrototype) return;
	IbxWidget.call(this);
	this._widgetCtor = $.ibi.ibxForm;
	this._tagName = "form";
}
var _p = _biExtend(IbxForm, IbxWidget, "IbxForm");
IbxForm.base = IbxWidget.prototype;
IbxWidget.addHtmlProperty(IbxForm, "acceptCharset");
IbxWidget.addHtmlProperty(IbxForm, "action");
IbxWidget.addHtmlProperty(IbxForm, "autocomplete");
IbxWidget.addHtmlProperty(IbxForm, "enctype");
IbxWidget.addHtmlProperty(IbxForm, "method");
IbxWidget.addHtmlProperty(IbxForm, "name");
IbxWidget.addHtmlProperty(IbxForm, "novalidate");
IbxWidget.addHtmlProperty(IbxForm, "target");
IbxWidget.addWidgetEvent(IbxForm, "submit", "");



$.widget("ibi.ibxForm", $.ibi.ibxWidget,
{
	options:
		{
		},
	_widgetClass: "ibx-form",
	_create: function ()
	{
		this._super();
	},
	_destroy: function ()
	{
		this._super();
	},
	refresh: function ()
	{
		this._super();
	}
});
//# sourceURL=form.ibx.js

