/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:
$.widget("ibi.ibxTextArea", $.ibi.ibxFlexBox,
{
	options:
	{
		"cols": "",
		"rows": "",
		"maxlength": "",
		"text": "",
		"readonly": "",
		"maxLength": "",
		"autoComplete": "off",
		"autoCorrect": "off",
		"autoCapitalize": "off",
		"spellCheck": "off",
		"placeholder": "",
		"required": "",
		"forId": "",
		"fnFormat": null,
		"textWrap": "",
		"textAlign": "",

		/*ibxFlexBox default options*/
		"inline": true,
		"wrap": false,
		"align": "stretch",
		},
	_widgetClass: "ibx-text-area",
	_valueOnFocus: null,
	_create: function ()
	{
		this._super();
		this.options.text = this.options.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");
		this._textInput = $('<textarea class="ibx-text-area-ctrl ibx-default-ctrl-focus"></textarea>').css("flex", "1 1 auto");
		this._textInput.on("blur", this._onBlur.bind(this)).on("focus", this._onFocus.bind(this));
		this.element.append(this._textInput).on("focus", this._onControlFocus.bind(this)).on("input", this._onInput.bind(this)).on("keydown", this._onKeyDown.bind(this));
		this._setValue(this.options.text, true);
	},
	_setOption: function (key, value)
	{
		this._super(key, value);
		if (key == "text" && this._textInput) // only do this after create
			this._setValue(value, true);
	},
	_setValue: function (value, bFormat)
	{
		this.options.text = bFormat && this.options.fnFormat ? this.options.fnFormat(value) : value;
		this.refresh();
		this._trigger("change", null, [this.element, this.options.text]);
		this._trigger("set_form_value", null, { "elem": this.element, "value": this.options.text });
	},
	selectAll: function ()
	{
		this._textInput.select();
	},
	_onControlFocus: function (event)
	{
		this.element.find(".ibx-default-ctrl-focus").focus();
	},
	_onFocus: function ()
	{
		this._focusVal = this.options.text;
	},
	_onBlur: function ()
	{
		var newVal = this._textInput.val();
		if (newVal != this._focusVal)
			this._setValue(newVal, true);
	},
	_onKeyDown: function (e)
	{
		//stop various keys from bubbling
		if (e.which == $.ui.keyCode.ENTER || e.which == $.ui.keyCode.LEFT || e.which == $.ui.keyCode.RIGHT || e.which == $.ui.keyCode.UP || e.which == $.ui.keyCode.DOWN)
		{
			e.stopPropagation();
		}
		else
			this._trigger("textchanging", e, [this.element, this.options.text, e.key]);
	},
	_onInput: function (e)
	{
		var value = this._textInput.val();
		if (this.options.text != value)
		{
			this.options.text = value;
			this._trigger("textchanged", e, [this.element, value]);
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
	_refresh: function ()
	{
		this._super();
		if (this.options.cols)
			this._textInput.attr("cols", this.options.cols);
		else
			this._textInput.removeAttr("cols");
		if (this.options.rows)
			this._textInput.attr("rows", this.options.rows);
		else
			this._textInput.removeAttr("rows");
		if (this.options.maxlength)
			this._textInput.attr("maxlength", this.options.maxlength);
		else
			this._textInput.removeAttr("maxlength");
		if (this.options.forId)
			this._textInput.attr("id", this.options.forId);
		else
			this._textInput.removeAttr("id");
		this._textInput.val(this.options.text);
		this._textInput.prop("readonly", this.options.readonly ? 'true' : '');
		if (this.options.maxLength)
			this._textInput.attr("maxlength", this.options.maxLength);
		else
			this._textInput.removeAttr("maxlength");
		if (this.options.placeholder)
			this._textInput.attr("placeholder", this.options.placeholder);
		else
			this._textInput.removeAttr("placeholder");
		if (this.options.required)
			this._textInput.attr("required");
		else
			this._textInput.removeAttr("required");
		if (this.options.textWrap)
			this._textInput.attr("wrap", this.options.textWrap);
		else
			this._textInput.removeAttr("wrap");
		if (this.options.textAlign)
			this._textInput.css("text-align", this.options.textAlign);
		else
			this._textInput.css("text-align", "");

		this._textInput.attr("autocomplete", this.options.autoComplete);
		this._textInput.attr("autocorrect", this.options.autoCorrect);
		this._textInput.attr("autocapitalize", this.options.autoCapitalize);
		this._textInput.attr("spellcheck", this.options.spellCheck != "off" ? "true" : "false");
	}
});
//# sourceURL=textarea.ibx.js
