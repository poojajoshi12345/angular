/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxTextField", $.ibi.ibxFlexBox,
{
	options:
		{
			"text": "",
			"autoSize": false,
			"readonly": false,
			"size": 0,
			"maxLength": 0,
			"autoComplete": "off",
			"autoCorrect": "off",
			"autoCapitalize": "off",
			"spellCheck": "off",
			"placeholder": "",
			"required": false,
			"ctrlType": "text",
			"forId": "",
			"fnFormat": null,
			"textAlign": "",
			"textOverflow": "",

			/*ibxFlexBox default options*/
			"inline": true,
			"wrap": "false",
			"align": "center",
		},
	_widgetClass: "ibx-text-field",
	_valueOnFocus: null,
	_create: function ()
	{
		this._super();
		this._textInput = $('<input class="ibx-default-ctrl-focus" type="' + this.options.ctrlType + '"></input>');
		this.element.append(this._textInput);
		this._textInput.on("blur", this._onBlur.bind(this)).on("focus", this._onFocus.bind(this)).on("input", this._onInput.bind(this)).on("keydown", this._onKeyDown.bind(this));
		this._setValue(this.options.text, true);
		this.element.on("ibx_change", function (e)
		{
			if (this.options.autoSize)
				this._setAutoSize();
		}.bind(this));
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
	_setAutoSize: function ()
	{
		var val = this._textInput.val();
		var scrollWidth;
		this._textInput.css('min-width', '0px');
		if (val.length == 0)
		{
			var placeholder = this._textInput.prop('placeholder');
			if (placeholder.length == 0)
				scrollWidth = "10em";
			else
			{
				this._textInput.val(placeholder);
				scrollWidth = this._textInput[0].scrollWidth + "px";
				this._textInput.val("");
			}
		}
		else
			scrollWidth = this._textInput[0].scrollWidth + "px";
		this._textInput.css('min-width', scrollWidth);
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
		if (this.options.maxLength != 0)
			this._textInput.attr("maxlength", this.options.maxLength);
		else
			this._textInput.removeAttr("maxlength");

		this._textInput.attr("autocomplete", this.options.autoComplete);
		this._textInput.attr("autocorrect", this.options.autoCorrect);
		this._textInput.attr("autocapitalize", this.options.autoCapitalize);
		this._textInput.attr("spellcheck", this.options.spellCheck != "off" ? "true" : "false");

		if (this.options.placeholder)
			this._textInput.attr("placeholder", this.options.placeholder);
		else
			this._textInput.removeAttr("placeholder");
		if (this.options.required)
			this._textInput.attr("required");
		else
			this._textInput.removeAttr("required");
		if (this.options.textAlign)
			this._textInput.css("text-align", this.options.textAlign);
		else
			this._textInput.css("text-align", "");
		if (this.options.textOverflow)
			this._textInput.css("text-overflow", this.options.textOverflow);
		else
			this._textInput.css("text-overflow", "");
		if (this.options.autoSize)
		{
			this.element.addClass('txt-auto-size');
			this._setAutoSize();
		}
		else
			this.element.removeClass('txt-auto-size');
	}
});
//# sourceURL=text.ibx.js
