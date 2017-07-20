/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxLabel", $.ibi.ibxFlexBox, 
{
	options:
	{
		"text":"",
		"textWrap":false,
		"textAlign":"",
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
		"justify":"start",
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

		//alternate to data-ibxp-text...direct text node children can be used to set the text.
		options.text = options.text + this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		//add the sub-elements
		this._icon = $("<img>").addClass(options.iconElClass);
		this._glyph = $("<label>").addClass(options.glyphElClass);
		this._text = $("<label>").addClass(options.textElClass);
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
		var lastOptions = this._lastOptions || {};

		//only update if changed
		if(options.icon != lastOptions.icon)
			this._icon.prop("src", options.icon)
		this._icon.removeClass(lastOptions.iconElClass).addClass(options.iconElClass);

		//only update if changed
		var glyphVisible = options.glyph || options.glyphClasses;
		if(options.glyph != lastOptions.glyph || options.glyphClasses != lastOptions.glyphClasses)
			this._glyph.html(options.glyph);	
		this._glyph.removeClass(lastOptions.glyphClasses).addClass(options.glyphClasses).addClass(options.glyphElClass);
		
		//only update if changed
		if(options.text != lastOptions.text)
			this._text.html(options.text)
		this._text.removeClass(lastOptions.textElClass).addClass(options.textElClass).css({"text-align":options.textAlign, "white-space":options.textWrap ? "" : "nowrap"});
		options.textWrap ? this._text.addClass("ibx-label-text-wrap") : this._text.removeClass("ibx-label-text-wrap");

		//add appropriate spacer classes
		if(options.icon && (options.text || options.glyph || options.glyphClasses))
			this._icon.addClass(this.options.iconElSpacerClass);
		else
			this._icon.removeClass(this.options.iconElSpacerClass);

		if((options.glyph || options.glyphClasses) && options.text)
			this._glyph.addClass(this.options.glyphElSpacerClass);
		else
			this._glyph.removeClass(this.options.glyphElSpacerClass);

		//general options maintenance
		this.element.removeClass("icon-left icon-top icon-right icon-bottom")
		this.element.addClass("icon-" + options.iconPosition);
		this.options.forId ? this._text.attr("for", this.options.forId) : this._text.removeAttr("for");
		this.options.forId ? this._glyph.attr("for", this.options.forId) : this._glyph.removeAttr("for");
		this._super();

		//don't bloat the DOM...just add what's needed...use prepend so that these are the first children.
		this._icon.detach();
		this._glyph.detach();
		this._text.detach();
		this.element.prepend(options.icon ? this._icon : null, glyphVisible ? this._glyph : null, options.text ? this._text : null);

		//save the current option values...this is to optimize the next refresh
		this._lastOptions = $.extend({}, options);
	}
});
$.ibi.ibxLabel.statics = 
{
}
//# sourceURL=label.ibx.js
