/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.58 $:

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
			"fnFormat": null,
			"textAlign": "",
			"textOverflow": "",

			"focusDefault":true,

			/*ibxFlexBox default options*/
			"inline": true,
			"wrap": "false",
			"align": "center",

			"aria":
			{
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
		this.element.append(this._textInput);
		this.element.on("ibx_change", function(e)
		{
			if (this.options.autoSize)
				this._setAutoSize();
		}.bind(this));
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		aria = this._super(accessible, aria);
		accessible ? this._textInput.attr("role", "textbox").ibxAriaId() : this._textInput.removeAttr("role").removeIbxAriaId();
		accessible ? this._textInput.attr("aria-label", aria.label || options.text || this.element.attr("title") || ibx.resourceMgr.getString("IBX_TEXT_INPUT_LABEL")) : this._textInput.removeAttr("aria-label");
		accessible ? this._textInput.attr("aria-labelledby", aria.labelledby) : this._textInput.removeAttr("aria-label");
		return aria;
	},
	_init:function()
	{
		this._super();
		this._setValue(this.options.text, true);
	},
	_setValue: function (value, bFormat)
	{
		this.options.text = bFormat && this.options.fnFormat ? this.options.fnFormat(value) : value;
		this.refresh();
		this._trigger("change", null, {"text": this.options.text});
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
			this.doCommandAction("trigger");
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
		this._textInput.val(this.options.text);
		this._textInput.prop("readonly", this.options.readonly ? 'true' : '');
		this.element.ibxToggleClass('ibx-text-field-read-only', this.options.readonly);
		
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
			this.element.ibxAddClass('txt-auto-size');
			this._setAutoSize();
		}
		else
			this.element.ibxRemoveClass('txt-auto-size');

		this._textInput.css("width", this.options.autoSize ? "1px" : "");
	}
});
//# sourceURL=text.ibx.js
