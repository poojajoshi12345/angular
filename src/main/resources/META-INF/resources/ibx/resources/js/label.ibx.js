/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxLabel", $.ibi.ibxFlexBox, 
{
	options:
	{
		"text":"",
		"textWrap":false,
		"icon":"",
		"iconPosition":"left",
		"glyph":"",
		"glyphClasses":"",
		"textElClass":"ibx-label-text",
		"iconElClass":"ibx-label-icon",
		"iconElSpacerClass":"ibx-icon-spacer",
		"glyphElClass":"ibx-label-glyph",
		"glyphElSpacerClass":"ibx-glyph-spacer",
		"forId":"",

		/*ibxFlexBox default options*/
		"inline":true,
		"wrap":"false",
		"justify":"center",
		"align":"center",
	},
	_widgetClass:"ibx-label",
	_text:null,
	_icon:null,
	_glyph:null,
	_create:function()
	{
		this._super();
		var options = this.options;

		this._icon = $("<img>").addClass(options.iconElClass);
		this._glyph = $("<label>").addClass(options.glyphElClass);
		this._text = $("<label>").addClass(options.textElClass);
		this.element.prepend(this._icon, this._glyph, this._text);
	},
	_destroy:function()
	{
		this._super();
		this._icon.remove();
		this._glyph.remove();
		this._text.remove();
		this.element.removeClass("icon-left icon-top icon-right icon-bottom")
	},
	refresh:function()
	{
		var options = this.options;
		var title = this.element.prop("title") || options.text;

		this._text.html(options.text).attr("class", options.textElClass).css({"white-space":options.textWrap ? "" : "nowrap"});
		this._glyph.html(options.glyph).attr("class", options.glyphClasses).addClass(options.glyphElClass).css("display", (options.glyph || options.glyphClasses) ? "" : "none");
		this._icon.prop("src", options.icon).attr("class", options.iconElClass).css("display", options.icon ? "" : "none");
		
		//add appropriate spacer classes
		if(options.icon && (options.text || options.glyph || options.glyphClasses))
			this._icon.addClass(this.options.iconElSpacerClass);
		else
			this._icon.removeClass(this.options.iconElSpacerClass);
		
		if((options.iconPosition == "left" || options.iconPosition == "right") && (options.glyph || options.glyphClasses) && options.text)
			this._glyph.addClass(this.options.glyphElSpacerClass);
		else
			this._glyph.removeClass(this.options.glyphElSpacerClass);
		
		this.element.removeClass("icon-left icon-top icon-right icon-bottom")
		this.element.addClass("icon-" + options.iconPosition).prop("title", title);
		this.options.forId ? this._text.attr("for", this.options.forId) : this._text.removeAttr("for");
		this.options.forId ? this._glyph.attr("for", this.options.forId) : this._glyph.removeAttr("for");
		this._super();
	}
});
$.ibi.ibxLabel.statics = 
{
}
//# sourceURL=label.ibx.js
