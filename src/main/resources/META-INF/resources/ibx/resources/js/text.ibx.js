/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:
function IbxTextField()
{
	if (_biInPrototype) return;
	IbxWidget.call(this);
	this._widgetCtor = $.ibi.ibxTextField;
}
var _p = _biExtend(IbxTextField, IbxWidget, "IbxTextField");
IbxTextField.base = IbxWidget.prototype;
IbxWidget.addWidgetProperty(IbxTextField, "readonly");
IbxWidget.addWidgetProperty(IbxTextField, "size");
IbxWidget.addWidgetProperty(IbxTextField, "maxlength");
IbxWidget.addWidgetProperty(IbxTextField, "autocomplete");
IbxWidget.addWidgetProperty(IbxTextField, "autocorrect");
IbxWidget.addWidgetProperty(IbxTextField, "autocapitalize");
IbxWidget.addWidgetProperty(IbxTextField, "spellcheck");
IbxWidget.addWidgetProperty(IbxTextField, "placeholder");
IbxWidget.addWidgetProperty(IbxTextField, "required");
IbxWidget.addWidgetProperty(IbxTextField, "ctrlType");
IbxWidget.addWidgetProperty(IbxTextField, "text");
IbxWidget.addWidgetFunction(IbxTextField, "selectAll");
IbxWidget.addWidgetEvent(IbxTextField, "textchanging");
IbxWidget.addWidgetEvent(IbxTextField, "textchanged");
IbxWidget.addWidgetEvent(IbxTextField, "action");
IbxWidget.addWidgetProperty(IbxTextField, "forId");


$.widget("ibi.ibxTextField", $.ibi.ibxWidget,
{
	options:
		{
			"text": "",
			"readonly": false,
			"size": 0,
			"maxlength": 0,
			"autocomplete": false,
			"autocorrect": false,
			"autocapitalize": false,
			"spellcheck": false,
			"placeholder": "",
			"required": false,
			"ctrlType": "text",
			"forId": "",
			"fnFormat": null,
		},
	_widgetClass: "ibx-text-field",
	_valueOnFocus: null,
	_create: function ()
	{
		this._super();
		this._textInput = $('<input class="ibx-default-ctrl-focus" type="' + this.options.ctrlType + '"></input>');
		this.element.append(this._textInput);
		this._textInput.on("blur", this._onBlur.bind(this)).on("input", this._onInput.bind(this)).on("keydown", this._onKeyDown.bind(this));
		this._setValue(this.options.text, true);
	},
	_setValue: function (value, bFormat)
	{
		this.options.text = bFormat && this.options.fnFormat ? this.options.fnFormat(value) : value;
		this.refresh();
		this._trigger("change", null, this.element);
		this._trigger("set_form_value", null, { "elem": this.element, "value": this.options.text });
	},
	selectAll: function ()
	{
		this._textInput.select();
	},
	_onBlur: function ()
	{
		this._setValue(this._textInput.val(), true);
	},
	_onKeyDown: function (e)
	{
		if (e.which == 13) // enter
		{
			this._setValue(this._textInput.val(), true);
			this._trigger("action", e, this.element);
			e.preventDefault();
		}
		else
		{
			this._trigger("textchanging", e, this.element);
		}
	},
	_onInput: function (e)
	{
		var value = this._textInput.val();
		if (this.options.text != value)
		{
			this._setValue(value);
			this._trigger("textchanged", e, this.element);
		}
	},
	format: function (fnFormat)
	{
		if (fnFormat)
		{
			this.options.fnFormat = fnFormat.bind(this);
			this._setValue(this.options.text, true);
			this.refresh();
		}
		else
			return this.options.fnFormat;
	},
	_destroy: function ()
	{
		this._super();
		this._textInput.remove();
	},
	refresh: function ()
	{
		this._super();
		this._textInput.attr("type", this.options.ctrlType);
		if (this.options.forId)
			this._textInput.attr("id", this.options.forId);
		else
			this._textInput.removeAttr("id");

		this._textInput.val(this.options.text);

		if (this.options.readonly)
			this._textInput.attr("readonly");
		else
			this._textInput.removeAttr("readonly");
		if (this.options.size != 0)
			this._textInput.attr("size", this.options.size);
		else
			this._textInput.removeAttr("size");
		if (this.options.maxlength != 0)
			this._textInput.attr("maxlength", this.options.maxlength);
		else
			this._textInput.removeAttr("maxlength");
		if (this.options.autocomplete)
			this._textInput.attr("autocomplete", this.options.autocomplete);
		else
			this._textInput.removeAttr("autocomplete");
		if (this.options.autocorrect)
			this._textInput.attr("autocorrect", this.options.autocorrect);
		else
			this._textInput.removeAttr("autocorrect");
		if (this.options.autocapitalize)
			this._textInput.attr("autocapitalize", this.options.autocapitalize);
		else
			this._textInput.removeAttr("autocapitalize");
		if (this.options.spellcheck)
			this._textInput.attr("spellcheck", this.options.spellcheck);
		else
			this._textInput.removeAttr("spellcheck");
		if (this.options.placeholder)
			this._textInput.attr("placeholder", this.options.placeholder);
		else
			this._textInput.removeAttr("placeholder");
		if (this.options.required)
			this._textInput.attr("required");
		else
			this._textInput.removeAttr("required");
	}
});
//# sourceURL=text.ibx.js
