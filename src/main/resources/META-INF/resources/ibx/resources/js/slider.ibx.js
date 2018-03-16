/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxSlider", $.ibi.ibxGrid,
{
	options:
	{
		"value": 50,
		"min": 0,
		"max": 100,
		"step": 1,
		"lock": false,
		"popupValue": false,
		"orientation": "horizontal",
		"flipLayout": false,
		"edge": "inside",
		"markerShape": "rectangle",
		"minTextPos": "none",
		"maxTextPos": "none",
		"valueTextPos": "none",
		//"textPosition": "none",
		"fnFormat": null,
		"inline":true,
		"align": "center",
		"cols": "auto 1fr auto",
		"rows": "auto 1fr auto",
		"align": "stretch",
		"wantResize": true,
		"focusDefault":true,

		"aria":
		{
			"role":"region",
			"label": ibx.resourceMgr.getString("IBX_STR_SLIDER")
		}
	},
	_widgetClass: "ibx-slider",
	_create: function ()
	{
		this._super();
		this._labelMin = $('<div class="ibx-slider-label-min">').ibxLabel({ 'justify': 'center' });
		this._labelMax = $('<div class="ibx-slider-label-max">').ibxLabel({ 'justify': 'center' });
		this._labelValue = $('<div class="ibx-slider-label-value">').ibxLabel({ 'justify': 'center' });

		this._sliderWrapper = $('<div class="ibx-slider-wrapper">');

		this._sliderBody = $('<div class="ibx-slider-body">');
		this._sliderWrapper.append(this._sliderBody);
		this._slider = $('<div tabindex="0" class="ibx-slider-marker ibx-slider-marker-one">');
		this._slider.hide();
		this._sliderWrapper.append(this._slider);
		this.element.append(this._sliderWrapper);
		this.element.append(this._labelValue, this._labelMin, this._sliderWrapper, this._labelMax);
		this._fnSliderMouseEvent = this._onSliderMouseEvent.bind(this);
		this.element.on("mousedown", this._fnSliderMouseEvent);
		this._slider.on("keydown", this._onSliderKeyDown.bind(this));
		
		window.setTimeout(this._initSlider.bind(this), 1);
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		aria = this._super(accessible, aria);

		//thumb needs to actually be a slider too for ie/firefox.
		var attrs = 
		{
			"role":"slider",
			"aria-valuemin":options.min,
			"aria-valuemax":options.max,
			"aria-valuenow":options.value,
			"aria-labelledby":aria.labelledby,
			"aria-label":sformat(ibx.resourceMgr.getString("IBX_STR_SLIDER_DEF_LABEL"), options.min, options.max)
		}
		accessible ? this._slider.attr(attrs) : this._slider.removeAttr("aria-valuemin aria-valuemax aria-valuenow aria-valuetext role");

		this._labelMin.ibxWidget("option", "aria.hidden", accessible ? true : null);
		this._labelMax.ibxWidget("option", "aria.hidden", accessible ? true : null);
		this._labelValue.ibxWidget("option", "aria.hidden", accessible ? true : null);
		return aria;
	},
	_init: function ()
	{
		this._super();
		var options = this.options;
		if (options.value < options.min)
			options.value = options.min;
		if (options.value > options.max)
			options.value = options.max;
		options.value = this._adjustStep(options.value, options.min, options.max, options.step);
		this.element.on("ibx_resize", this._onResize.bind(this));
	},
	_initSlider: function ()
	{
		this._setValue("" + this.options.value, this.info());
		this._slider.show();
	},
	_setValue: function (value, data)
	{
		this.refresh();
		this._trigger("change", null, data);
	},
	_onResize: function ()
	{
		this.refresh();
	},
	_activeSlider: null,
	_focusSlider: function (e)
	{
		this._activeSlider = this._slider;
		this._slider.addClass('ibx-slider-marker-move');
		var info = this.info();
		this._moveSlider(e);
		this._slider.focus();
	},
	_moveSlider: function (e)
	{
		if (!this.options.lock)
		{
			var info = this.info();
			this.options.value = this._posMarker(e, info.value, info.min, info.max);
			this._setValue("" + this.options.value, this.info());
			this._showPopup();
		}
	},
	_onSliderMouseEvent: function (e)
	{
		switch (e.type)
		{
			case "mousedown":
				{
					this._focusSlider(e);
					e.preventDefault();
					if (this._trigger("start", null, this.info()))
					{
						$(document.body).css("pointerEvents", "none");
						$(document).on("mouseup mousemove", this._fnSliderMouseEvent);
					}
				}
				break;
			case "mouseup":
				{
					this._hidePopup();
					$(document.body).css("pointerEvents", "");
					$(document).off("mouseup mousemove", this._fnSliderMouseEvent);
					this._activeSlider.removeClass('ibx-slider-marker-move');
					e.preventDefault();
					this._trigger("end", null, this.info());
				}
				break;
			case "mousemove":
				{
					this._moveSlider(e);
					e.preventDefault();
				}
				break;
			default:
				break;
		}
	},
	_stepSlider: function (bLeft)
	{
		if (!this.options.lock)
		{
			var info = this.info();
			if (bLeft)
			{
				info.value -= info.step;
				if (info.value < info.min)
					info.value = info.min;
			}
			else
			{
				info.value += info.step;
				if (info.value > info.max)
					info.value = info.max;
			}
			this.options.value = this._adjustStep(info.value, info.min, info.max, info.step);
			this._setValue("" + this.options.value, this.info());
		}
	},
	_onSliderKeyDown : function (e)
	{
		var isSlide = false;
		if(eventMatchesShortcut("LEFT", e) || eventMatchesShortcut("DOWN", e)) //decrease position
		{
			e.stopPropagation();
			e.preventDefault();
			this._activeSlider = $(e.target);
			this._stepSlider(true);
			isSlide = true;
		}
		else
		if(eventMatchesShortcut("RIGHT", e) || eventMatchesShortcut("UP", e)) //increase position
		{
			e.stopPropagation();
			e.preventDefault();
			this._activeSlider = $(e.target);
			this._stepSlider(false);
			isSlide = true;
		}
	},
	_posMarker: function (e, value, min, max)
	{
		var offset = this._sliderWrapper.offset();
		var posX = offset.left - $(window).scrollLeft();
		var posY = offset.top - $(window).scrollTop();

		var mouseX = e.pageX - $(window).scrollLeft();
		var mouseY = e.pageY - $(window).scrollTop();
		var outerWidth = this._sliderWrapper.outerWidth();
		var outerHeight = this._sliderWrapper.outerHeight();
		var value = this.options.value;
		var flipLayout = this.options.flipLayout;

		if (this.options.orientation == "horizontal")
		{
			if (mouseX <= posX)
				value = flipLayout ? max : min;
			else if (mouseX >= posX + outerWidth)
				value = flipLayout ? min : max;
			else
				value = Math.round((flipLayout ? (posX + outerWidth - mouseX) : (mouseX - posX)) * (max - min) / outerWidth + min);
		}
		else
		{
			if (mouseY <= posY)
				value = flipLayout ? min : max;
			else if (mouseY >= posY + outerHeight)
				value = flipLayout ? max : min;
			else
				value = Math.round((flipLayout ? (mouseY - posY) : (posY + outerHeight - mouseY)) * (max - min) / outerHeight + min);
		}

		return this._adjustStep(value, min, max, this.options.step);
	},
	format: function (fnFormat)
	{
		if (fnFormat)
			this.options.fnFormat = fnFormat.bind(this);
		else
			this.options.fnFormat = null;

		this._labelMin.ibxWidget('option', 'text', this._getFormattedText("min"));
		this._labelMax.ibxWidget('option', 'text', this._getFormattedText("max"));
		this._labelValue.ibxWidget('option', 'text', this._getFormattedText("value"));
		this.refresh();
	},
	_getFormattedText: function (val)
	{
		if (this.options.fnFormat)
		{
			return this.options.fnFormat(val, this.info());
		}
		else
		{
			switch (val)
			{
				default:
				case 'value': return '' + this.options.value;
				case 'min': return '' + this.options.min;
				case 'max': return '' + this.options.max;
			}
		}
	},
	info: function ()
	{
		return { elem: this.element, value: parseInt(this.options.value, 10), min: parseInt(this.options.min, 10), max: parseInt(this.options.max, 10), step: parseInt(this.options.step, 10) };
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
	_destroy: function ()
	{
		this._super();
	},
	_flipLayout: function (val)
	{
		if (this.options.flipLayout)
		{
			switch (val)
			{
				case 1: return 3;
				case 2: return 2;
				case 3: return 1;
				default: return val;
			}
		}
		else
			return val;
	},
	_showPopup: function ()
	{
		if (!this.options.popupValue)
			return;

		if (!this._popup)
			this._popup = $('<div class="ibx-slider-popup"></div>').appendTo("body");
		var my = this.options.orientation == 'horizontal' ? 'center bottom' : 'left center';
		var at = this.options.orientation == 'horizontal' ? 'center top-10px' : 'right+10px center';
		this._popup.position({ 'my': my, 'at': at, 'of': this._activeSlider });
		this._popup.html(((this._activeSlider == this._slider) ? this.options.value : this.options.value2));
	},
	_hidePopup: function ()
	{
		if (!this.options.popupValue)
			return;

		if (this._popup)
		{
			this._popup.remove();
			this._popup = null;
		}
	},
	navKeyChildren:function()
	{
		return $([this._slider[0]]);
	},
	_refresh: function ()
	{
		this._labelMin.ibxWidget('option', 'text', this._getFormattedText("min"));
		this._labelMax.ibxWidget('option', 'text', this._getFormattedText("max"));
		this._labelValue.ibxWidget('option', 'text', this._getFormattedText("value"));

		var horiz = this.options.orientation == "horizontal";
		var info = this.info();

		var flipLayout = this.options.flipLayout;
		var wrapperStart = 2;
		var wrapperEnd = 2;

		switch (this.options.minTextPos)
		{
			default:
			case 'none':
				this._labelMin.hide();
				this._labelMin.data('ibxRow', horiz ? 2 : this._flipLayout(3));
				this._labelMin.data('ibxCol', horiz ? this._flipLayout(1) : 2);

				if (horiz)
					wrapperStart = 1;
				else
					wrapperEnd = 3;
				break;
			case 'start':
				this._labelMin.data('ibxRow', horiz ? 1 : this._flipLayout(3));
				this._labelMin.data('ibxCol', horiz ? this._flipLayout(1) : 1);

				this._labelMin.show();
				if (horiz)
					wrapperStart = 1;
				else
					wrapperEnd = 3;
				break;
			case 'center':
				this._labelMin.data('ibxRow', horiz ? 2 : this._flipLayout(3));
				this._labelMin.data('ibxCol', horiz ? this._flipLayout(1) : 2);

				this._labelMin.show();
				if (horiz)
					wrapperStart = 2;
				else
					wrapperEnd = 2;
				break;
			case 'end':
				this._labelMin.data('ibxRow', horiz ? 3 : this._flipLayout(3));
				this._labelMin.data('ibxCol', horiz ? this._flipLayout(1) : 3);

				this._labelMin.show();
				if (horiz)
					wrapperStart = 1;
				else
					wrapperEnd = 3;
				break;

		}

		switch (this.options.maxTextPos)
		{
			default:
			case 'none':
				this._labelMax.hide();
				this._labelMax.data('ibxRow', horiz ? 2 : this._flipLayout(1));
				this._labelMax.data('ibxCol', horiz ? this._flipLayout(3) : 2);
				if (horiz)
					wrapperEnd = 3;
				else
					wrapperStart = 1;
				break;
			case 'start':
				this._labelMax.data('ibxRow',horiz ? 1 : this._flipLayout(1));
				this._labelMax.data('ibxCol', horiz ? this._flipLayout(3) : 1);

				this._labelMax.show();
				if (horiz)
					wrapperEnd = 3;
				else
					wrapperStart = 1;
				break;
			case 'center':
				this._labelMax.data('ibxRow', horiz ? 2 : this._flipLayout(1));
				this._labelMax.data('ibxCol', horiz ? this._flipLayout(3) : 2);

				this._labelMax.show();
				if (horiz)
					wrapperEnd = 2;
				else
					wrapperStart = 2;
				break;
			case 'end':
				this._labelMax.data('ibxRow', horiz ? 3 : this._flipLayout(1));
				this._labelMax.data('ibxCol', horiz ? this._flipLayout(3) : 3);
				this._labelMax.show();
				if (horiz)
					wrapperEnd = 3;
				else
					wrapperStart = 1;
				break;

		}

		valueStart = 1;
		valueEnd = 3;
		if (flipLayout)
		{
			var save = valueStart;
			valueStart = this._flipLayout(valueEnd);
			valueEnd = this._flipLayout(save);
		}


		switch (this.options.valueTextPos)
		{
			default:
			case 'none':
				this._labelValue.hide();
				this._labelValue.data('ibxRow', horiz ? 1 : 2);
				this._labelValue.data('ibxCol', horiz ? 2 : 1);

				break;
			case 'start':
				this._labelValue.data('ibxRow', horiz ? 1 : (valueStart + '/span ' + (valueEnd - valueStart + 1)));
				this._labelValue.data('ibxCol', horiz ? (valueStart + '/span ' + (valueEnd - valueStart + 1)) : 1);

				this._labelValue.show();
				break;
			case 'end':
				this._labelValue.data('ibxRow', horiz ? 3 : (valueStart + '/span ' + (valueEnd - valueStart + 1)));
				this._labelValue.data('ibxCol', horiz ? (valueStart + '/span ' + (valueEnd - valueStart + 1)) : 3);

				this._labelValue.show();
				break;

		}

		if (flipLayout)
		{
			var save = wrapperStart;
			wrapperStart = this._flipLayout(wrapperEnd);
			wrapperEnd = this._flipLayout(save);
		}

		this._sliderWrapper.data('ibxRow', horiz ? '2' : (wrapperStart + '/span ' + (wrapperEnd - wrapperStart + 1)));
		this._sliderWrapper.data('ibxCol', horiz ? (wrapperStart + '/span ' + (wrapperEnd - wrapperStart + 1)) : '2');

		this._super();

		this._slider.css('right', '').css('left', '').css('top', '').css('bottom', '');
		this._sliderBody.css('top', '').css('left', '');

		if (horiz)
		{
			this.options.direction = "row";
			this._sliderWrapper.removeClass('ibx-slider-vertical');
			this._sliderWrapper.addClass('ibx-slider-horizontal');
			this._slider.css(flipLayout ? 'right' : 'left', Math.ceil((info.value - info.min) * (this._sliderWrapper.outerWidth() - (this.options.edge == "center" ? 0 : this._slider.outerWidth())) / (info.max - info.min) - (this.options.edge == "center" ? (this._slider.outerWidth() / 2) : 0)) + 'px');
			this._slider.css('top', Math.ceil((this._sliderWrapper.outerHeight() - this._slider.outerHeight()) / 2) + "px");
			this.element.removeClass('ibx-slider-vertical');
			this.element.addClass('ibx-slider-horizontal');
			this._labelMin.removeClass('ibx-slider-vertical');
			this._labelMin.addClass('ibx-slider-horizontal');
			this._labelMax.removeClass('ibx-slider-vertical');
			this._labelMax.addClass('ibx-slider-horizontal');
			this._labelValue.removeClass('ibx-slider-vertical');
			this._labelValue.addClass('ibx-slider-horizontal');
			this._sliderBody.removeClass('ibx-slider-body-vertical');
			this._sliderBody.addClass('ibx-slider-body-horizontal');
			this._sliderBody.css('top', Math.ceil((this._sliderWrapper.outerHeight() - this._sliderBody.outerHeight()) / 2) + "px");
		}
		else
		{
			this.options.direction = "column";
			this.options.iconPosition = "bottom";
			this._sliderWrapper.removeClass('ibx-slider-horizontal');
			this._sliderWrapper.addClass('ibx-slider-vertical');
			this._slider.css(flipLayout ? 'top' : 'bottom', Math.ceil((info.value - info.min) * (this._sliderWrapper.outerHeight() - (this.options.edge == "center" ? 0 : this._slider.outerHeight())) / (info.max - info.min) - (this.options.edge == "center" ? (this._slider.outerHeight() / 2) : 0)) + 'px');
			this._slider.css('left', Math.ceil((this._sliderWrapper.outerWidth() - this._slider.outerWidth()) / 2) + "px");
			this.element.removeClass('ibx-slider-horizontal');
			this.element.addClass('ibx-slider-vertical');
			this._labelMin.removeClass('ibx-slider-horizontal');
			this._labelMin.addClass('ibx-slider-vertical');
			this._labelMax.removeClass('ibx-slider-horizontal');
			this._labelMax.addClass('ibx-slider-vertical');
			this._labelValue.removeClass('ibx-slider-horizontal');
			this._labelValue.addClass('ibx-slider-vertical');
			this._sliderBody.removeClass('ibx-slider-body-horizontal');
			this._sliderBody.addClass('ibx-slider-body-vertical');
			this._sliderBody.css('left', Math.ceil((this._sliderWrapper.outerWidth() - this._sliderBody.outerWidth()) / 2) + "px");
		}

		this._slider.removeClass('ibx-slider-marker-round locked');
		if (this.options.lock)
			this._slider.addClass('locked');
		if (this.options.markerShape == 'circle')
			this._slider.addClass('ibx-slider-marker-round');
	}
});

$.widget("ibi.ibxHSlider", $.ibi.ibxSlider, { options: { orientation: "horizontal"} });
$.widget("ibi.ibxVSlider", $.ibi.ibxSlider, { options: { orientation: "vertical", navKeyDir:"vertical", aria:{orientation:"vertical"} } });


$.widget("ibi.ibxRange", $.ibi.ibxSlider,
{
	options:
	{
		"value2": 0,
		"lock2": false,
		"markerShape2": "",
		"aria":
		{
			"orientation":"horizontal",
			"label": ibx.resourceMgr.getString("IBX_STR_SLIDER_RANGE")
		},

		"navKeyKeys":
		{
			"hprev":"CTRL+LEFT",
			"hnext":"CTRL+RIGHT",
			"vprev":"CTRL+UP",
			"vnext":"CTRL+DOWN",
		},
	},
	_widgetClass: "ibx-range",
	_create: function ()
	{
		this._super();
		this._sliderRangeBody = $('<div class="ibx-slider-range-body">');
		this._sliderRangeBody.insertBefore(this._slider);
		this._slider2 = $('<div tabindex="0" class="ibx-slider-marker ibx-slider-marker-two">');
		this._slider2.hide();
		this._sliderWrapper.append(this._slider2);
		this._slider2.on("keydown", this._onSliderKeyDown.bind(this));
		
		var options = this.options;
		if (options.value < options.min)
			options.value = options.min;
		if (options.value > options.max)
			options.value = options.max;
		options.value = this._adjustStep(options.value, options.min, options.max, options.step);
		if (options.value2 > options.max)
			options.value2 = options.max;
		if (options.value2 < options.value)
			options.value2 = options.value;
		options.value2 = this._adjustStep(options.value2, options.value, options.max, options.step);
	},
	_setAccessibility:function(accessible, aria)
	{
		this._super(accessible, aria);
		var options = this.options;

		//thumb needs to actually be a slider too for ie/firefox.
		var attrs = 
		{
			"role":"slider",
			"aria-valuemin":options.min,
			"aria-valuemax":options.max,
			"aria-valuenow":options.value2,
			"aria-valuetext":sformat(ibx.resourceMgr.getString("IBX_STR_SLIDER_RANGE_VAL_HIGH"), options.value2),
			"aria-label":sformat(ibx.resourceMgr.getString("IBX_STR_SLIDER_RANGE_DEF_LABEL"), options.min, options.max)
		}
		accessible ? this._slider.attr("aria-label", sformat(ibx.resourceMgr.getString("IBX_STR_SLIDER_RANGE_DEF_LABEL"), options.min, options.max)) : null;
		accessible ? this._slider.attr("aria-valuetext", sformat(ibx.resourceMgr.getString("IBX_STR_SLIDER_RANGE_VAL_LOW"), options.value)) : null;
		accessible ? this._slider2.attr(attrs) : this._slider2.removeAttr("aria-valuemin aria-valuemax aria-valuenow aria-valuetext role");
		return aria;
	},
	_initSlider: function ()
	{
		this._super();
		this._setValue("" + this.options.value + "," + this.options.value2, this.info());
		this._slider2.show();
	},
	_focusSlider: function (e)
	{
		if (this.options.lock)
			this._activeSlider = this._slider2;
		else if (this.options.lock2)
			this._activeSlider = this._slider;
		else
		{
			if (e.target == this._slider[0])
			{
				if (this.options.value == this.options.value2 && this.options.value == this.options.min)
					this._activeSlider = this._slider2;
				else
					this._activeSlider = this._slider;
			}
			else if (e.target == this._slider2[0])
			{
				if (this.options.value == this.options.value2 && this.options.value == this.options.max)
					this._activeSlider = this._slider;
				else
					this._activeSlider = this._slider2;
			}
			else
			{

				var offset1 = this._slider.offset();
				var posX1 = offset1.left - $(window).scrollLeft();
				var posY1 = offset1.top - $(window).scrollTop();

				var offset2 = this._slider2.offset();
				var posX2 = offset2.left - $(window).scrollLeft();
				var posY2 = offset2.top - $(window).scrollTop();

				var mouseX = e.pageX - -$(window).scrollLeft();
				var mouseY = e.pageY - -$(window).scrollTop();

				if (this.options.orientation == "horizontal")
				{
					if (Math.abs(mouseX - posX1) < Math.abs(mouseX - posX2))
						this._activeSlider = this._slider;
					else
						this._activeSlider = this._slider2;
				}
				else
				{
					if (Math.abs(mouseY - posY1) < Math.abs(mouseY - posY2))
						this._activeSlider = this._slider;
					else
						this._activeSlider = this._slider2;
				}
			}
		}

		this._activeSlider.addClass('ibx-slider-marker-move');
		var info = this.info();
		this._moveSlider(e);
		this._activeSlider.focus();
	},
	_moveSlider: function (e)
	{
		if (this._activeSlider.is(this._slider) && this.options.lock)
			return;
		if (this._activeSlider.is(this._slider2) && this.options.lock2)
			return;

		var info = this.info();
		if (this._activeSlider.is(this._slider2))
		{
			this.options.value2 = this._posMarker(e, info.value2, info.min, info.max);
			if (this.options.value2 < this.options.value)
				this.options.value2 = this.options.value;
		}
		else
		{
			this.options.value = this._posMarker(e, info.value, info.min, info.max);
			if (this.options.value > this.options.value2)
				this.options.value = this.options.value2;
			this.options.value = this.options.value;
		}
		this._setValue("" + this.options.value + "," + this.options.value2, this.info());
		this._showPopup();
	},
	_stepSlider: function (bLeft)
	{
		if (this._activeSlider.is(this._slider) && this.options.lock)
			return;
		if (this._activeSlider.is(this._slider2) && this.options.lock2)
			return;

		var info = this.info();
		if (bLeft)
		{
			if (this._activeSlider.is(this._slider))
			{
				info.value -= info.step;
				if (info.value < info.min)
					info.value = info.min;
				this.options.value = this.options.value = this._adjustStep(info.value, info.min, info.max, info.step);
			}
			else
			{
				info.value2 -= info.step;
				if (info.value2 < info.value)
					info.value2 = info.value;
				this.options.value2 = this._adjustStep(info.value2, info.min, info.max, info.step);
			}
		}
		else
		{
			if (this._activeSlider.is(this._slider))
			{
				info.value += info.step;
				if (info.value > info.value2)
					info.value = info.value2;
				this.options.value = this.options.value = this._adjustStep(info.value, info.min, info.max, info.step);
			}
			else
			{
				info.value2 += info.step;
				if (info.value2 > info.max)
					info.value2 = info.max;
				this.options.value2 = this._adjustStep(info.value2, info.min, info.max, info.step);
			}
		}

		this._setValue("" + this.options.value + "," + this.options.value2, this.info());
	},
	_getFormattedText: function (val)
	{
		if (this.options.fnFormat)
		{
			return this.options.fnFormat(val, this.info());
		}
		else
		{
			switch (val)
			{
				default:
				case 'value': return '' + this.options.value + ',' + this.options.value2;
				case 'min': return '' + this.options.min;
				case 'max': return '' + this.options.max;
			}
		}
	},
	info: function ()
	{
		return $.extend({}, this._super(), { value: parseInt(this.options.value, 10), value2: parseInt(this.options.value2, 10) });
	},
	_destroy: function ()
	{
		this._super();
	},
	navKeyChildren:function()
	{
		return $([this._slider[0], this._slider2[0]]);
	},
	_refresh: function ()
	{
		this._super();

		var info = this.info();
		var flipLayout = this.options.flipLayout;

		this._slider2.css('left', '').css('right', '').css('top', '').css('bottom', '');
		this._sliderRangeBody.css('top', '').css('bottom', '').css('left', '').css('right', '').css('width', '').css('height', '');

		if (this.options.orientation == "horizontal")
		{
			this._slider2.css(flipLayout ? 'right' : 'left', Math.ceil((info.value2 - info.min) * (this._sliderWrapper.outerWidth() - (this.options.edge == "center" ? 0 : this._slider2.outerWidth())) / (info.max - info.min) - (this.options.edge == "center" ? (this._slider2.outerWidth() / 2) : 0)) + 'px');
			this._slider2.css('top', Math.ceil((this._sliderWrapper.outerHeight() - this._slider2.outerHeight()) / 2) + "px");
			this._sliderRangeBody.removeClass('ibx-slider-range-body-vertical');
			this._sliderRangeBody.addClass('ibx-slider-range-body-horizontal');
			this._sliderRangeBody.css('top', Math.ceil((this._sliderWrapper.outerHeight() - this._sliderRangeBody.outerHeight()) / 2) + "px");
		}
		else
		{
			this._slider2.css(flipLayout ? 'top' : 'bottom', Math.ceil((info.value2 - info.min) * (this._sliderWrapper.outerHeight() - (this.options.edge == "center" ? 0 : this._slider2.outerHeight())) / (info.max - info.min) - (this.options.edge == "center" ? (this._slider2.outerHeight() / 2) : 0)) + 'px');
			this._slider2.css('left', Math.ceil((this._sliderWrapper.outerWidth() - this._slider2.outerWidth()) / 2) + "px");
			this._sliderRangeBody.removeClass('ibx-slider-range-body-horizontal');
			this._sliderRangeBody.addClass('ibx-slider-range-body-vertical');
			this._sliderRangeBody.css('left', Math.ceil((this._sliderWrapper.outerWidth() - this._sliderRangeBody.outerWidth()) / 2) + "px");
		}

		this._slider2.removeClass('ibx-slider-marker-round locked');
		if (this.options.lock2)
			this._slider2.addClass('locked');
		var markerShape = this.options.markerShape2 ? this.options.markerShape2 : this.options.markerShape;
		if (markerShape == 'circle')
			this._slider2.addClass('ibx-slider-marker-round');

		var s = flipLayout ? this._slider2 : this._slider;
		var s2 = flipLayout ? this._slider : this._slider2;

		if (this.options.orientation == "horizontal")
		{
			this._sliderRangeBody.css(flipLayout ? 'right' : 'left', this._slider.css(flipLayout ? 'right' : "left"));
			this._sliderRangeBody.css('width', (parseInt(this._slider2.css(flipLayout ? 'right' : "left"), 10) + this._slider2.outerWidth() - parseInt(this._slider.css(flipLayout ? 'right' : "left"), 10)) + "px");
		}
		else
		{
			this._sliderRangeBody.css(flipLayout ? 'top' : 'bottom', this._slider.css(flipLayout ? 'top' : "bottom"));
			this._sliderRangeBody.css('height', (parseInt(this._slider2.css(flipLayout ? 'top' : "bottom"), 10) + this._slider2.outerHeight() - parseInt(this._slider.css(flipLayout ? 'top' : "bottom"), 10)) + "px");
		}

	}
});

$.widget("ibi.ibxHRange", $.ibi.ibxRange, { options: { orientation: "horizontal" } });
$.widget("ibi.ibxVRange", $.ibi.ibxRange, { options: { orientation: "vertical", navKeyDir:"vertical", aria:{orientation:"vertical"} } });

$.widget("ibi.ibxLeftRange", $.ibi.ibxRange,
{
	options:
	{
		aria:{orientation:"horizontal"}
	},
	_create: function ()
	{
		this._super();
		this.options.value = this.options.min;
	},
	_initSlider: function ()
	{
		this._super();
		this._slider.hide();
	},
	_focusSlider: function (e)
	{
		this._activeSlider = this._slider2;
		this._activeSlider.addClass('ibx-slider-marker-move');
		var info = this.info();
		this._moveSlider(e);
		this._activeSlider.focus();
	},
});

$.widget("ibi.ibxRightRange", $.ibi.ibxRange,
{
	_create: function ()
	{
		this._super();
		this.options.value2 = this.options.max;
	},
	_initSlider: function ()
	{
		this._super();
		this._slider2.hide();
	},
	_focusSlider: function (e)
	{
		this._activeSlider = this._slider;
		this._activeSlider.addClass('ibx-slider-marker-move');
		var info = this.info();
		this._moveSlider(e);
		this._activeSlider.focus();
	},
});

$.widget("ibi.ibxHLeftRange", $.ibi.ibxLeftRange, { options: { orientation: "horizontal" } });
$.widget("ibi.ibxHRightRange", $.ibi.ibxRightRange, { options: { orientation: "horizontal" } });
$.widget("ibi.ibxVLeftRange", $.ibi.ibxLeftRange, { options: { orientation: "vertical", navKeyDir:"vertical", aria:{orientation:"vertical"} } });
$.widget("ibi.ibxVRightRange", $.ibi.ibxRightRange, { options: { orientation: "vertical", navKeyDir:"vertical", aria:{orientation:"vertical"} } });


//# sourceURL=slider.ibx.js
