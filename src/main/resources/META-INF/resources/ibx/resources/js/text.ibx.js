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

			/*nav key will autofocus the input control and manage focus of children*/
			"navKeyRoot":true,
			"navKeyAutoFocus":true,

			/*ibxFlexBox default options*/
			"inline": true,
			"wrap": "false",
			"align": "center",

			"aria":
			{
				"role":"textbox"
			}
		},
	_widgetClass: "ibx-text-field",
	_valueOnFocus: null,
	_create: function ()
	{
		this._super();
		this.options.text = this.options.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");
		this._textInput = $('<input tabIndex="-1" type="' + this.options.ctrlType + '"></input>');
		this._textInput.on("blur", this._onTextInputBlur.bind(this)).on("focus", this._onTextInputFocus.bind(this));
		this._textInput.on("keydown", this._onTextInputKeyDown.bind(this)).on("input", this._onTextInputInput.bind(this));
		this._setValue(this.options.text, true);
		this.element.append(this._textInput);
		this.element.on("ibx_change", function(e)
		{
			if (this.options.autoSize)
				this._setAutoSize();
		}.bind(this));
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		accessible ? this._textInput.attr("role", "textbox") : this._textInput.removeAttr("role");
		accessible ? this._textInput.attr("aria-labelledby", aria.labelledby) : this._textInput.removeAttr("aria-labelledby");
		return aria;
	},
	_setValue: function (value, bFormat)
	{
		this.options.text = bFormat && this.options.fnFormat ? this.options.fnFormat(value) : value;
		this.refresh();
		this._trigger("change", null, {"text": this.options.text});
		this._trigger("set_form_value", null, { "elem": this.element, "value": this.options.text });
	},
	value:function(value, bFormat)
	{
		if(value === undefined)
			return this.options.text;
		else
			this._setValue(value, bFormat);
	},
	selectAll: function ()
	{
		this._textInput.select();
	},
	_setAutoSize: function ()
	{
		var val = this._textInput.val();
		var scrollWidth;
		var curMax = this._textInput.css("max-width");
		this._textInput.css('max-width', '0px');
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
		this._textInput.css('min-width', scrollWidth).css("max-width", curMax);
	},
	_onTextInputFocus: function (event)
	{
		this._focusVal = this.options.text;
	},
	_onTextInputBlur: function ()
	{
		var newVal = this._textInput.val();
		if (newVal != this._focusVal)
			this._setValue(newVal, true);
	},
	_onTextInputKeyDown: function (e)
	{
		if (e.which == $.ui.keyCode.ENTER) // enter
		{
			var newVal = this._textInput.val();
			this._focusVal = newVal;
			this._setValue(newVal, true);
			this._trigger("action", e, {"text": this.options.text});
			e.preventDefault();
		}
		else
		if(!$.ibi.ibxWidget.isNavKey(e))
			this._trigger("textchanging", e, {"text": this.options.text});
	},
	_onTextInputInput: function (e)
	{
		var value = this._textInput.val();
		if (this.options.text != value)
		{
			this.options.text = value;
			this._trigger("textchanged", e, {"text": value});
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

		this._textInput.attr("type", this.options.ctrlType);
		if (this.options.forId)
			this._textInput.attr("id", this.options.forId);
		else
			this._textInput.removeAttr("id");

		this._textInput.val(this.options.text);
		this._textInput.prop("readonly", this.options.readonly ? 'true' : '');
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

		this.options.placeholder = this.options.placeholder.toString();//must cooerce to string...'0' would not set value.
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

		this._textInput.css("width", this.options.autoSize ? "1px" : "");
	}
});
//# sourceURL=text.ibx.js
