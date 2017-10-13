/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

/******************************************************************************
	SPINNER
******************************************************************************/
$.widget("ibi.ibxSpinner", $.ibi.ibxTextField, 
{
	options:
	{
		"value": 50,
		"min" :0,
		"max" :100,
		"step" :1,

		btnGroupClass:"ibx-spinner-btn-grp",
		btnUpClass:"ibx-spinner-btn-up",
		btnUpOptions:
		{
		},
		btnDownClass:"ibx-spinner-btn-down",
		btnDownOptions:
		{
		},
	},
	_widgetClass:"ibx-spinner",
	_create:function()
	{
		this._super();
		this._btnUp = $("<div tabIndex='0'>").ibxButton().on("mousedown mouseup mouseout", this._onBtnEvent.bind(this));
		this._btnDown = $("<div tabIndex='0'>").ibxButton().on("mousedown mouseup mouseout", this._onBtnEvent.bind(this));
		this._btnBox = $("<div>").ibxVButtonGroup();
		this._btnBox.append(this._btnUp);
		this._btnBox.append(this._btnDown);
		this._textInput.addClass("ibx-spinner-text-input");
		this.element.on("ibx_textchanging", this._onTextChanging.bind(this)).append(this._btnBox);
		this._textInput.css('width', '1px');
	},
	_init: function ()
	{
		this._super();
		var options = this.options;
		this._btnUp.addClass(options.btnUpClass);
		this._btnDown.addClass(options.btnDownClass);
		this._btnBox.addClass(options.btnGroupClass);
		if (options.value > options.max)
			options.value = options.max;
		if (options.value < options.min)
			options.value = options.min;
		options.value = this._adjustStep(options.value, options.min, options.max, options.step);
		this._setValue(options.value, true);
	},
	_destroy: function ()
	{
		this._super();
	},
	_intervalId: null,
	_bUp: true,
	_cleared: false,
	_onBtnEvent:function(e)
	{
		if(e.type == "mouseup" || e.type == "mouseout")
		{
			clearInterval(this._intervalId);
			this._intervalId = null;
			this._cleared = true;
		}
		else
		if(e.type == "mousedown")
		{
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
	_setValue: function (value, bFormat)
	{
		this.options.value = parseInt(value, 10);
		this.options.text = bFormat && this.options.fnFormat ? this.options.fnFormat(value) : value;
		this.refresh();
		this._trigger("change", null, this._getInfo());
		this._trigger("set_form_value", null, { "elem": this.element, "value": value });
	},
	_onWidgetKeyDown: function (e)
	{
		this._super(e);

		if (e.which == 38) // up
		{
			this._stepSpinner(true);
			e.preventDefault();
		}
		else if (e.which == 40) // down
		{
			this._stepSpinner(false);
			e.preventDefault();
		}
	},
	_onCtrlBlur: function (e)
	{
		var value = this._textInput.val();
		var numValue = parseInt(value, 10);
		if (isNaN(numValue))
			numValue = this.options.min;
		if (numValue > this.options.max)
			numValue = this.options.max;
		if (numValue < this.options.min)
			numValue = this.options.min;
		var newValue = this._adjustStep(numValue, this.options.min, this.options.max, this.options.step);
		if (this.options.value != newValue)
		{
			this._setValue(newValue, true);
			this._trigger("textchanged", e, this.element);
		}
	},
	_onTextChanging: function (e, txtField)
	{
		if (!jQuery.isNumeric(e.key) && e.which != 37 && e.which != 38 && e.which != 39 && e.which != 40 && e.which != 8 && e.which != 46 && e.which != 190)
			e.preventDefault();
	},
	_stepSpinner: function (bUp)
	{
		var info = this._getInfo();
		if (bUp)
		{
			info.value += info.step;
			if (info.value > info.max)
				info.value = info.max;
		}
		else
		{
			info.value -= info.step;
			if (info.value < info.min)
				info.value = info.min;
		}
		info.value = this._adjustStep(info.value, info.min, info.max, info.step);
		this._setValue(info.value, true);
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
	_getInfo: function ()
	{
		return { elem: this.element, value: parseInt(this.options.value, 10), min: parseInt(this.options.min, 10), max: parseInt(this.options.max, 10), step: parseInt(this.options.step, 10) };
	},
	_refresh: function ()
	{
		this._super();
		if (this._btnBox)
			this._btnBox.ibxWidget('refresh');
	}
});
$.ibi.ibxSpinner.statics = 
{
};


//# sourceURL=spinner.ibx.js
