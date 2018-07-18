/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxColorPicker", $.ibi.ibxVBox,
{
	options:
	{
		"color":"#000000",
		"align":"center",
		"inline":true,
		"focusDefault":true,
	},
	_widgetClass: "ibx-color-picker",
	_create: function ()
	{
		this._super();

		var infoBox = this._infoBox = $("<div class='cp-info-box'>").ibxHBox({"align":"stretch", "justify":"center"});
		var swatch = this._swatch = $("<div class='cp-swatch'>");
		var value = this._textValue = $("<div tabindex='-1' class='cp-text-value'>").ibxTextField().on("ibx_textchanged", this._onTextChanging.bind(this));
		var ctrl = this._ctrl = $("<div>").farbtastic(this._onColorChange.bind(this));
					
		infoBox.append(swatch, value);
		this.element.append(infoBox, ctrl);
	},
	_destroy: function ()
	{
		this._super();
		this._infoBox.remove();
		this._swatch.remove();
		this._ctrl.remove();
	},
	_onColorChange:function(color)
	{
		this.option("color", color);
		this.element.dispatchEvent("ibx_colorchange", color, false, false);
	},
	_onTextChanging:function(e, info)
	{
		var color = info.text;
		if(color[0] != "#")
			color = "#" + color;
		this._ctrl.prop("farbtastic").setColor(color);
	},
	_refresh: function ()
	{
		this._super();
		var options = this.options;
		this._swatch.css("backgroundColor", options.color);
		this._textValue.ibxWidget("value", options.color);
		this._ctrl.prop("farbtastic").setColor(options.color);
	}
});

$.widget("ibi.ibxPalettePicker", $.ibi.ibxVBox,
{
	options:
	{
		"palette":"",
		"color":"",
		"showPalettes":true,
		"showPalette":true,
		"showCustom":true,
		"showNoFill":true,
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
		var template = ibx.resourceMgr.getResource(".ibx-palette-picker-template", false);
		this.element.on("ibx_selectablechildren ibx_selchange", this._selManagerEvent.bind(this)).append(template.children());
		ibx.bindElements(this.element);
		this._palSelect.on("ibx_change", this._onPalSelectChange.bind(this));

		var palDefault = ibx.resourceMgr.getXmlResource(".palette-picker-default-palettes", false);
		this.paletteFile(palDefault, "default_basic");
	},
	_destroy: function ()
	{
		this._super();
	},
	_selManagerEvent:function(e)
	{
		var info = e.originalEvent.data;
		if(e.type == "ibx_selectablechildren")
			info.items = this.element.find(".pp-swatch");
		else
		if(e.type == "ibx_selchange")
		{
			var swatch = $(info.items[0]);
			this.option("color", swatch.attr("data-pp-hex-value"));
		}
	},
	_onPalSelectChange:function(e)
	{
		var pid = $(e.target).ibxWidget("userValue");
		this._inSelectChange = true;
		this.option("palette", pid);
		this._inSelectChange = false;
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
		this._super(key, value);
		if(key == "palette" && changed)
		{
			if(!this._inSelectChange)
				this._palSelect.ibxWidget("userValue", value);
			else
			{
				var pal = this._palFile.find(sformat("palette[pid={1}]", value));
				var colors = pal.children("color");
				this._swatchBox.ibxWidget("remove");
				colors.sort(this._sortColors.bind(this)).each(function(idx, color)
				{
					var value = color.getAttribute("value");
					var swatch = $(sformat("<div tabindex='0' class='pp-swatch' data-pp-hex-value='{1}'>", value));
					swatch.css("backgroundColor", value).attr("data-pp-rgb-value", swatch.css("backgroundColor"));
					this._swatchBox.append(swatch);
				}.bind(this));

				var colors = pal.find("custom_colors > color");
				this._customBox.ibxWidget("remove");
				colors.sort(this._sortColors.bind(this)).each(function(idx, color)
				{
					var value = color.getAttribute("value");
					var swatch = $(sformat("<div tabindex='0' class='pp-swatch pp-swatch-custom' data-pp-hex-value='{1}'>", value));
					swatch.css("backgroundColor", value).attr("data-pp-rgb-value", swatch.css("backgroundColor"));
					this._customBox.append(swatch);
				}.bind(this));

				this.refresh();
			}
		}
	},
	_sortColors:function(c1, c2)
	{
		var idx1 = parseInt(c1.getAttribute("idx"), 10);
		var idx2 = parseInt(c2.getAttribute("idx"), 10);
		var ret = 0;
		if(idx1 < idx2)
			ret = -1;
		else
		if(idx1 > idx2)
			ret = 1;
		return ret;
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

		var swatch = this.element.find(sformat("[data-pp-hex-value='{1}']", options.color));
		this.element.ibxSelectionManager("option", "toggleSelection", false).ibxSelectionManager("selected", swatch, true);
	}
});
//# sourceURL=colorpicker.ibx.js
