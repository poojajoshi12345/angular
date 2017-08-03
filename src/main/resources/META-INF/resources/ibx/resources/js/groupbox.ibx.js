/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxGroupBox", $.ibi.ibxWidget,
{
	options:
		{
			"titlePosition": "top-left",
			"text": "",
			"glyph": "",
			"glyphClasses": "",
			"icon": "",
			"iconPosition": "left",
			"labelOptions": {}
		},
	_widgetClass: "ibx-group-box",
	_create: function ()
	{
		this._super();
		this.options.text = this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");
		this.options.labelOptions.display = "block";
		this._labelBox = $("<div></div>").ibxHBox();
		this._label = $("<div></div>").ibxLabel();
		this._labelBox.append(this._label);
		this._labelBox.css("position", "absolute");
		this._labelBox.css("left", "0px");
		this._labelBox.css("right", "0px");
		this._labelBox.ibxWidget('option', 'alignIems', 'center');
		this.element.css("position", "relative");
	},
	_destroy: function ()
	{
		this._label.remove();
		this._super();
	},
	_refresh: function ()
	{
		this.options.labelOptions.text = this.options.text;
		this.options.labelOptions.glyph = this.options.glyph;
		this.options.labelOptions.glyphClasses = this.options.glyphClasses;
		this.options.labelOptions.icon = this.options.icon;
		this.options.labelOptions.iconPosition = this.options.iconPosition;
		this.options.labelOptions.justify = (this.options.titlePosition.search("left") != -1) ? "start" : (this.options.titlePosition.search("right") != -1 ? "end" : "center");
		this._label.ibxWidget('option', this.options.labelOptions);
		this._label.addClass("ibx-group-box-label");
		this.element.removeClass("ibx-group-label-pos-top ibx-group-label-pos-bottom");
		if (this.options.titlePosition.search("top") != -1)
		{
			this.element.addClass("ibx-group-label-pos-top");
			this.element.prepend(this._labelBox);
			this._labelBox.css("top", (-this._labelBox.outerHeight() / 2) + "px");
			this._labelBox.css("bottom", "");
		}
		else
		{
			this.element.addClass("ibx-group-label-pos-bottom");
			this.element.append(this._labelBox);
			this._labelBox.css("bottom", (-this._labelBox.outerHeight() / 2) + "px");
			this._labelBox.css("top", "");
		}
		this._labelBox.ibxWidget('option', 'justify', (this.options.titlePosition.search("left") != -1) ? "start" : (this.options.titlePosition.search("right") != -1 ? "end" : "center"));
		this._super();
	}
});


//# sourceURL=groupbox.ibx.js
