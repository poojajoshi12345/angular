/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxColorPicker", $.ibi.ibxVBox,
{
	options:
	{
		"style":"wheel",
		"color":"",
		"colorRgba":"",
		"opacity":1,
		"setOpacity":true,
		"showColorInfo":true,
		"align":"center",
		"inline":true,
		"focusDefault":true,
	},
	_widgetClass: "ibx-color-picker",
	_create: function ()
	{
		this._super();
		var options = this.options;
		var infoBox = this._infoBox = $("<div class='cp-info-box'>").ibxHBox({"align":"stretch", "justify":"center"});
		var swatch = this._swatch = $("<div class='cp-swatch'>");
		var value = this._textValue = $("<div tabindex='-1' class='cp-text-value'>").ibxTextField().on("ibx_textchanged", this._onTextChanging.bind(this));
		var ctrl = this._ctrl = $("<div class='cp-mixer'>");
					
		infoBox.append(swatch, value);
		this.element.append(infoBox, ctrl);
		
		var swatches = [];
		/*
		var palDefault = ibx.resourceMgr.getXmlResource(".ibx-palette-picker-default-palettes", false);
		var colors = palDefault.find("[pid='default_basic'] > color");
		colors.sort(fnAttrSort.bind(colors, "idx", "numeric", false));
		$.each(colors, function(idx, el)
		{
			el = $(el);
			var swatch = {"name":el.attr("display-name"), "color":el.attr("value")};
			swatches.push(swatch);
		}.bind(this));
		*/

		//must be initialized after being added to dom.
		ctrl.minicolors({"control":options.style, "opacity":options.setOpacity, "swatches":swatches, "inline":true, "change": this._onColorChange.bind(this)});
		ctrl.minicolors("value", options.color);

	},
	_destroy: function ()
	{
		this._super();
		this._infoBox.remove();
		this._swatch.remove();
		this._ctrl.remove();
	},
	control:function(){return this._ctrl;},
	_onColorChange:function(value, opacity)
	{
		if(this._inSetOptions)
			return;
		var options = this.options;
		options.color = value;
		options.opacity = (options.setOpacity && !isNaN(opacity)) ? parseFloat(opacity) : 1;
		options.colorRgba = hexToRgba(value, options.opacity);
		this.refresh();
		this.element.dispatchEvent("ibx_colorchange", {"color":options.color, "rgba": options.colorRgba, "opacity":options.opacity}, false, false);

	},
	_onTextChanging:function(e, info)
	{
		if(this._inSetOptions)
			return;
		var options = this.options;
		var color = info.text;
		if(color[0] != "#")
			color = "#" + color;
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		var changed = this.options[key] != value;
		if(!changed || this._inSetOptions)
			return;

		this._inSetOptions = true;
		if(key == "color")
		{
			value = value.toLowerCase();
			if(value.search(/^rgb\(/i) == 0)
				value = rgbToHex(value);
			options.colorRgba = hexToRgba(value, options.opacity);
			this._ctrl.minicolors("value", {"color":options.colorRgba.rgba, "opacity":options.opacity});
		}
		else
		if(key == "opacity")
			this._ctrl.minicolors("value", {"color":options.color, "opacity":value});
		else
		if(key == "style")
			this._ctrl.minicolors("settings", {"control": value});
		else
		if(key == "setOpacity")
			this._ctrl.minicolors("settings", {"opacity": value});
		this._super(key, value);
		this._inSetOptions = false;
	},
	_refresh: function ()
	{
		this._super();
		var options = this.options;
		this._infoBox.css("display", options.showColorInfo ? "" : "none");
		this._swatch.css("backgroundColor", hexToRgba(options.color, options.opacity).rgba);
		this._textValue.ibxWidget("value", options.color);
	}
});

$.widget("ibi.ibxPalettePicker", $.ibi.ibxVBox,
{
	options:
	{
		"palette":"",
		"color":"",
		"colorRgba":"",
		"opacity":1,
		"showPalettes":true,
		"showPalette":true,
		"showCustom":true,
		"showTransparency":true,
		"showNoFill":true,
		"sliderOptions":{},
		"navKeyRoot":true,
		"navKeyDir":"both",
		"selType":"single",
		"nameRoot":true,
		"focusDefault":true,
		"justify":"center",
		"align":"stretch",
	},
	_widgetClass: "ibx-palette-picker",
	_create: function ()
	{
		this._super();
		this._loadWidgetTemplate(".ibx-palette-picker-template");
		this.element.on("ibx_selectablechildren ibx_selchange", this._selManagerEvent.bind(this));
		this._palSelect.on("ibx_change", this._onPalSelectChange.bind(this));
		this._transSlider.on("ibx_change", this._onTransSliderChange.bind(this)).ibxWidget("option", "fnFormat", this._formatSliderVals.bind(this));

		var palDefault = ibx.resourceMgr.getXmlResource(".ibx-palette-picker-default-palettes", false);
		this.paletteFile(palDefault, "default_basic");
	},
	_destroy: function ()
	{
		this._super();
	},
	_init:function()
	{
		this._inInit = true;
		this._super();
		this._inInit = false;
	},
	_selManagerEvent:function(e)
	{
		var info = e.originalEvent.data;
		if(e.type == "ibx_selectablechildren")
			info.items = this.element.find(".pp-swatch");
		else
		if(e.type == "ibx_selchange" && info.selected == true)
		{
			var swatch = $(info.items[0]);
			var attr = "data-pp-hex-value";
			if(swatch.is(".pp-no-fill"))
				attr = "data-pp-rgb-value";
			this.option("color", swatch.attr(attr));
		}
	},
	_formatSliderVals:function(fmt, info)
	{
		return info[fmt] + "%";
	},
	_onTransSliderChange:function(e, info)
	{
		this._inSliderChange = true;
		this.option("opacity", (info.value/100));
		this._inSliderChange = false;
		e.stopPropagation();
	},
	_onPalSelectChange:function(e)
	{
		var pid = $(e.target).ibxWidget("userValue");
		this._inSelectChange = true;
		this.option("palette", pid);
		this._inSelectChange = false;
		e.stopPropagation();
	},
	_palFile:null,
	paletteFile:function(palFile, palette)
	{
		if(palFile === undefined)
			return this._palFile[0];

		this._palFile = $(palFile);
		var pals = this._palFile.find("palette");
		this._palSelect.ibxWidget("removeControlItem");
		pals.each(function(idx, pal)
		{
			pal = $(pal);
			var pid = pal.attr("pid");
			var selItem = $("<div>").ibxSelectItem({"text":pal.attr("display-name"), "userValue": pal.attr("pid")});
			this._palSelect.ibxWidget("addControlItem", selItem);
		}.bind(this));
		this._palSelect.ibxWidget("userValue", palette || this.options.palette);
	},
	_setOption:function(key, value)
	{
		var options = this.options;
		var changed = options[key] != value;
		if(key == "palette" && changed)
		{
			if(!this._inSelectChange)
				this._palSelect.ibxWidget("userValue", value);
			else
			{
				var pal = this._palFile.find(sformat("palette[pid={1}]", value));
				var colors = pal.children("color");
				this._swatchBox.ibxWidget("remove");
				colors.sort(fnAttrSort.bind(this, "idx", "numeric", false)).each(function(idx, color)
				{
					var value = color.getAttribute("value").toLowerCase();
					var displayName = color.getAttribute("display-name") || value;
					var swatch = $(sformat("<div tabindex='0' class='pp-swatch' title='{1}' data-pp-hex-value='{2}'>", displayName, value));
					swatch.css("backgroundColor", value).attr("data-pp-rgb-value", swatch.css("backgroundColor"));
					this._swatchBox.append(swatch);
				}.bind(this));

				var colors = pal.find("custom_colors > color");
				this._customBox.ibxWidget("remove");
				colors.sort(fnAttrSort.bind(this, "idx", "numeric", false)).each(function(idx, color)
				{
					var value = color.getAttribute("value").toLowerCase();
					var displayName = color.getAttribute("display-name") || value;
					var swatch = $(sformat("<div tabindex='0' class='pp-swatch pp-swatch-custom' title='{1}' data-pp-hex-value='{1}'>", displayName, value));
					swatch.css("backgroundColor", value).attr("data-pp-rgb-value", swatch.css("backgroundColor"));
					this._customBox.append(swatch);
				}.bind(this));

				this.refresh();
			}
		}
		else
		if(key == "opacity")
		{
			if(!this._inSliderChange)
				this._transSlider.ibxWidget("option", "value", Math.min(value * 100, 100));
			options.colorRgba = hexToRgba(options.color, value);
		}
		else
		if(key == "color")
		{
			value = value.toLowerCase();
			if(value.search(/^rgb\(/i) == 0)
				value = rgbToHex(value);
			options.colorRgba = hexToRgba(value, options.opacity);
		}
		else
		if((key == "colorRgba") && !this._inInit)
		{
			console.warn("[ibx Warning] ibxPalettePicker.option.rgbColor is readonly.")
			return;
		}

		this._super(key, value);
		if(changed && (key == "color" || key == "opacity"))
			this.element.dispatchEvent("ibx_change", {"color":options.color, "rgba": options.colorRgba, "opacity":options.opacity}, false, false);
	},
	_refresh: function ()
	{
		this._super();
		var options = this.options;

		this._palSelect.css("display", options.showPalettes ? "" : "none");
		this._swatchBox.css("display", options.showPalette ? "" : "none");
		this._customLabel.css("display", options.showCustom ? "" : "none");
		this._customBox.css("display", options.showCustom ? "" : "none");
		this._noFillBox.css("display", options.showNoFill ? "" : "none");
		this._transparencyBox.css("display", options.showTransparency ? "" : "none");
		this._transSlider.ibxWidget("option", options.sliderOptions);

		var swatch = this.element.find(sformat("[data-pp-hex-value='{1}']", options.color));
		this.element.ibxSelectionManager("option", "toggleSelection", false).ibxSelectionManager("selected", swatch, true);
	}
});
//# sourceURL=colorpicker.ibx.js
