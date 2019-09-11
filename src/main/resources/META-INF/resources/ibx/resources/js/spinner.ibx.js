/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision: 1.25 $:

/******************************************************************************
	SPINNER
******************************************************************************/
$.widget("ibi.ibxSpinner", $.ibi.ibxTextField, 
{
	options:
	{
		"value": 0,
		"min" :0,
		"max" :100,
		"step" :1,
		"precision":3,
		"fnFormat":null,
		"fnUnformat":null,
		"btnGroupClass":"ibx-spinner-btn-grp",
		"btnUpClass":"ibx-spinner-btn-up",
		"btnUpOptions":
		{
		},
		"btnDownClass":"ibx-spinner-btn-down",
		"btnDownOptions":
		{
		},
		"aria":{}
	},
	_widgetClass:"ibx-spinner",
	_create:function()
	{
		this._btnUp = $("<div>").ibxButton().on("mousedown mouseup mouseout", this._onSpinBtnEvent.bind(this));
		this._btnDown = $("<div>").ibxButton().on("mousedown mouseup mouseout", this._onSpinBtnEvent.bind(this));
		this._btnBox = $("<div>").ibxVButtonGroup().append(this._btnUp, this._btnDown);

		this._super();
		this._textInput.css('width', '1px');
		this._textInput.ibxAddClass("ibx-spinner-text-input");
		this.element.on("ibx_textchanging", this._onTextChanging.bind(this)).append(this._btnBox);
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		aria = this._super(accessible, aria);
		var attr = 
		{
			"role":"spinbutton",
			"aria-valuemin":options.min,
			"aria-valuemax":options.max,
			"aria-valuenow":options.value,
		};
		accessible ? this._textInput.attr(attr) : this._textInput.removeAttr("aria-valuemin aria-valuemax aria-valuenow");
		this._btnUp.ibxButton("option", "aria.hidden", true);
		this._btnDown.ibxButton("option", "aria.hidden", true);
		return aria;
	},
	_init: function ()
	{
		this._super();
		var options = this.options;
		this._btnUp.ibxAddClass(options.btnUpClass);
		this._btnDown.ibxAddClass(options.btnDownClass);
		this._btnBox.ibxAddClass(options.btnGroupClass);
		this._setValue(options.value);
	},
	_destroy: function ()
	{
		this._btnBox.remove();
		this._super();
	},
	_intervalId: null,
	_bUp: true,
	_cleared: false,
	_onSpinBtnEvent:function(e)
	{
		if(e.type == "mouseup" || e.type == "mouseout")
		{
			this.element.dispatchEvent("ibx_spinend", null, true, false);
			clearInterval(this._intervalId);
			this._intervalId = null;
			this._cleared = true;
		}
		else
		if(e.type == "mousedown")
		{
			this._onTextInputBlur(e); // just in case user typed a value
			this.element.dispatchEvent("ibx_spinstart", null, true, false);
			this._cleared = false;
			this._bUp = $(e.currentTarget).hasClass(this.options.btnUpClass);
			this._stepSpinner(this._bUp);
			setTimeout(function(e)
			{
				if (!this._cleared)
				{
					if (this._intervalId)
						clearInterval(this._intervalId);
					this._intervalId = setInterval(this._onPressTimer.bind(this), 100);
				}
			}.bind(this), 200);
		}
	},
	_onPressTimer:function(e)
	{
		this._stepSpinner(this._bUp);
	},
	_onTextInputKeyDown: function (e)
	{
		this._super(e);
		if(e.keyCode == $.ui.keyCode.UP)
		{
			this._stepSpinner(true);
			e.preventDefault();
		}
		else
		if(e.keyCode == $.ui.keyCode.DOWN)
		{
			this._stepSpinner(false);
			e.preventDefault();
		}
	},
	_onTextInputBlur: function (e)
	{
		var value = this._setValue(this._textInput.val());
		if (this.options.value != value)
			this._trigger("textchanged", e, this.element);
	},
	_onTextChanging: function (e)
	{
		if (!jQuery.isNumeric(e.key) && e.which != 9 && e.which != 37 && e.which != 38 && e.which != 39 && e.which != 40 && e.which != 8 && e.which != 46 && e.which != 189 && e.which != 190)
			e.preventDefault();
	},
	_stepSpinner: function (bUp)
	{
		var info = this._getInfo();
		info.value += bUp ? info.step : -info.step;
		this._setValue(info.value);
		this.refresh();
	},
	_adjustStep: function (val, min, max, step)
	{
		var lower = Math.min(Math.floor((val - min) / step) * step + min, max);
		var higher = Math.min(Math.ceil((val - min) / step) * step + min, max);

		if (val - lower < higher - val)
			return lower;
		else
			return higher;
	},
	setValue:function(value)
	{
		this.setValue(value);
	},
	_setValue: function(value)
	{
		var options = this.options;
		var curVal = options.value;
		var fnFormat = options.fnFormat || this._fnFormat;
		var fnUnformat = options.fnUnformat || this._fnUnformat;

		value = fnUnformat(value);
		if(value === NaN)
			value = options.min;

		value = Math.max(value, options.min);
		value = Math.min(value, options.max);
		var value = this._adjustStep(value, options.min, options.max, options.step);

		var isFloat = !!(options.step % 1) 
		this.options.value = value = (isFloat ? Number(value.toFixed(options.precision)) : value);
		this.options.text = fnFormat(value);
		this.refresh();
		if(value != curVal)
			this._trigger("change", null, this._getInfo());
		return value;
	},
	_getInfo: function ()
	{
		var options = this.options;
		return { elem: this.element, value: options.value, min: this.options.min, max: this.options.max, step: this.options.step};
	},
	_fnFormat:function(value)
	{
		return value;
	},
	_fnUnformat:function(value)
	{
		return Number(String(value).replace(/[^0-9.+\-]*/g, ""));
	},
	_setOption:function(key, value)
	{
		this._super(key, value);
		if(key == "value")
			this._setValue(value);
	},
	_refresh: function ()
	{
		var options = this.options;
		this._super();
		if (this._btnBox)
			this._btnBox.ibxWidget('refresh');
	}
});
$.ibi.ibxSpinner.statics = 
{
};


//# sourceURL=spinner.ibx.js
