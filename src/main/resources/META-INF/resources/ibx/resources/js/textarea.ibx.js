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

		"navKeyRoot":true,
		"focusDefault":true,

		"aria":
		{
			"role":"textbox",
			"multiline":true,
		}
	},
	_widgetClass: "ibx-text-area",
	_valueOnFocus: null,
	_create: function ()
	{
		this._super();
		this.options.text = this.options.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");
		this._textArea = $('<textarea tabIndex="-1" class="ibx-text-area-ctrl"></textarea>').css("flex", "1 1 auto");
		this._textArea.on("blur", this._onTextAreaBlur.bind(this)).on("focus", this._onTextAreaFocus.bind(this));
		this._textArea.on("input", this._onTextAreaInput.bind(this)).on("keydown", this._onTextAreaKeyDown.bind(this));
		this._setValue(this.options.text, true);
		this.element.append(this._textArea).on(
		{
			"focus":function(e)
			{
				this._textArea.focus();
			}.bind(this)
		});
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		accessible ? this._textArea.attr("role", "textbox") : this._textInput.removeAttr("role");
		accessible ? this._textArea.attr("aria-labelledby", aria.labelledby) : this._textArea.removeAttr("aria-labelledby");
		accessible ? this._textArea.attr("aria-multiline", true) : this._textArea.removeAttr("aria-multiline");
		return aria;
	},
	_setOption: function (key, value)
	{
		this._super(key, value);
		if (key == "text" && this._textArea) // only do this after create
			this._setValue(value, true);
	},
	_setValue: function (value, bFormat)
	{
		this.options.text = bFormat && this.options.fnFormat ? this.options.fnFormat(value) : value;
		this.refresh();
		this._trigger("change", null, {"text": this.options.text});
	},
	value:function(val, bFormat)
	{
		if(val === undefined)
			return this.options.text;
		else
			this._setValue(val, bFormat);
	},
	selectAll: function ()
	{
		this._textArea.select();
	},
	_onTextAreaFocus: function ()
	{
		this._focusVal = this.options.text;
	},
	_onTextAreaBlur: function ()
	{
		var newVal = this._textArea.val();
		if (newVal != this._focusVal)
			this._setValue(newVal, true);
	},
	_onTextAreaKeyDown: function (e)
	{
		if(!$.ibi.ibxWidget.isNavKey(e))
			this._trigger("textchanging", e, {"text": this.options.text});
		
		//[HOME-1050]Stop enter from closing dialog...put it here because I can't see why this would ever propagate.
		if(e.keyCode == $.ui.keyCode.ENTER)
			e.stopPropagation();
	},
	_onTextAreaInput: function (e)
	{
		var value = this._textArea.val();
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
		this._textArea.remove();
	},
	_refresh: function ()
	{
		this._super();

		if (this.options.cols)
			this._textArea.attr("cols", this.options.cols);
		else
			this._textArea.removeAttr("cols");
		if (this.options.rows)
			this._textArea.attr("rows", this.options.rows);
		else
			this._textArea.removeAttr("rows");
		if (this.options.maxlength)
			this._textArea.attr("maxlength", this.options.maxlength);
		else
			this._textArea.removeAttr("maxlength");
		if (this.options.forId)
			this._textArea.attr("id", this.options.forId);
		else
			this._textArea.removeAttr("id");
		this._textArea.val(this.options.text);
		this._textArea.prop("readonly", this.options.readonly ? 'true' : '');
		if (this.options.maxLength)
			this._textArea.attr("maxlength", this.options.maxLength);
		else
			this._textArea.removeAttr("maxlength");
		if (this.options.placeholder)
			this._textArea.attr("placeholder", this.options.placeholder);
		else
			this._textArea.removeAttr("placeholder");
		if (this.options.required)
			this._textArea.attr("required");
		else
			this._textArea.removeAttr("required");

		if (this.options.textWrap)
			this._textArea.attr("wrap", this.options.textWrap);
		else
			this._textArea.attr("wrap", "off");
		
		if (this.options.textAlign)
			this._textArea.css("text-align", this.options.textAlign);
		else
			this._textArea.css("text-align", "");

		this._textArea.attr("autocomplete", this.options.autoComplete);
		this._textArea.attr("autocorrect", this.options.autoCorrect);
		this._textArea.attr("autocapitalize", this.options.autoCapitalize);
		this._textArea.attr("spellcheck", this.options.spellCheck != "off" ? "true" : "false");
	}
});
//# sourceURL=textarea.ibx.js
