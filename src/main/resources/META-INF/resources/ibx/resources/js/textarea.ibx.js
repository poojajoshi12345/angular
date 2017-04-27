/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:
$.widget("ibi.ibxTextArea", $.ibi.ibxFlexBox,
{
	options:
		{
			"text": "",
			"readonly": "",
			"cols": "",
			"rows": "",
			"maxLength": "",
			"placeholder": "",
			"required": "",
			"wrap": "",
			"forId": "",
			"fnFormat": null,
			"textAlign": "",

			/*ibxFlexBox default options*/
			"inline": true,
			"wrap": "false",
			"align": "center",
		},
	_widgetClass: "ibx-text-area",
	_valueOnFocus: null,
	_create: function ()
	{
		this._super();
		this._textInput = $('<textarea class="ibx-default-ctrl-focus"></textarea>');
		this.element.append(this._textInput);
		this._textInput.on("blur", this._onBlur.bind(this)).on("focus", this._onFocus.bind(this)).on("input", this._onInput.bind(this)).on("keydown", this._onKeyDown.bind(this));
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
		this._trigger("change", null, this.element);
		this._trigger("set_form_value", null, { "elem": this.element, "value": this.options.text });
	},
	selectAll: function ()
	{
		this._textInput.select();
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
			this.options.text = value;
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
		if (this.options.forId)
			this._textInput.attr("id", this.options.forId);
		else
			this._textInput.removeAttr("id");
		this._textInput.val(this.options.text);
		if (this.options.readonly)
			this._textInput.attr("readonly");
		else
			this._textInput.removeAttr("readonly");
		if (this.options.cols)
		{
			this._textInput.css("width", "");
			this._textInput.attr("cols", this.options.cols);
		}
		else
		{
			this._textInput.css("width", "100%");
			this._textInput.removeAttr("cols");
		}
		if (this.options.rows)
		{
			this._textInput.css("height", "");
			this._textInput.attr("rows", this.options.rows);
		}
		else
		{
			this._textInput.css("height", "100%");
			this._textInput.removeAttr("rows");
		}
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
		if (this.options.wrap)
			this._textInput.attr("wrap", this.options.wrap);
		else
			this._textInput.removeAttr("wrap");
		if (this.options.textAlign)
			this._textInput.css("text-align", this.options.textAlign);
		else
			this._textInput.css("text-align", "");
	}
});
//# sourceURL=textarea.ibx.js
