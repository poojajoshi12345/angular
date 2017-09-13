/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxLabel", $.ibi.ibxFlexBox, 
{
	options:
	{
		"text":"",
		"textWrap":false,
		"textAlign":"",
		"textElClass":"ibx-label-text",
		"iconPosition":"left",
		"icon":"",
		"iconClasses":"ibx-label-icon",
		"glyph":"",
		"glyphClasses":"",
		"glyphElClass":"ibx-label-glyph",
		"glyphElSpacerClass":"ibx-glyph-spacer",
		"forId":"",

		/*label overlays...array of objects: {"position":"xx", "glyph":"xx", "glyphClasses":"xx", "icon":"xx"}*/
		"overlays":[],

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
		options.text = options.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		//add the sub-elements
		this._glyph = $("<label>").addClass(options.glyphElClass);
		this._text = $("<label>").addClass(options.textElClass);
	},
	_destroy:function()
	{
		this._super();
		this._glyph.remove();
		this._text.remove();
		this.element.removeClass("icon-left icon-top icon-right icon-bottom")
	},
	_refresh:function()
	{
		var options = this.options;
		var lastOptions = this._lastOptions || {};

		var glyphVisible = options.glyph || options.glyphClasses;

		//only update if changed
		if(options.icon != lastOptions.icon)
			this._glyph.removeClass(lastOptions.iconClasses).addClass(options.iconClasses).css("backgroundImage", options.icon ? sformat("url('{1}')", options.icon) : "");

		//only update if changed
		if(options.glyph != lastOptions.glyph || options.glyphClasses != lastOptions.glyphClasses)
			this._glyph.html(options.glyph);	
		this._glyph.removeClass(lastOptions.glyphClasses).addClass(options.glyphClasses).addClass(options.glyphElClass);
		
		//only update if changed
		if(options.text != lastOptions.text)
			this._text.html(options.text)
		this._text.removeClass(lastOptions.textElClass).addClass(options.textElClass).css({"text-align":options.textAlign, "white-space":options.textWrap ? "" : "nowrap"});

		//add appropriate spacer classes
		this._glyph.toggleClass(this.options.glyphElSpacerClass, !!((options.icon || options.glyph || options.glyphClasses) && options.text));

		//general options maintenance
		this.element.removeClass("icon-left icon-top icon-right icon-bottom")
		this.element.addClass("icon-" + options.iconPosition);
		this.options.forId ? this._text.attr("for", this.options.forId) : this._text.removeAttr("for");
		this.options.forId ? this._glyph.attr("for", this.options.forId) : this._glyph.removeAttr("for");
		this._super();

		//don't bloat the DOM...just add what's needed...use prepend so that these are the first children.
		this._glyph.detach();
		this._text.detach();
		this.element.prepend((options.icon || glyphVisible) ? this._glyph : null, options.text ? this._text : null);
		this.element.toggleClass("ibx-label-no-icon", !glyphVisible).toggleClass("ibx-icon-only", !glyphVisible && !options.text);

		//handle overlays
		this._glyph.children(".ibx-label-overlay-frame").remove();
		for(var i = 0; i < options.overlays.length; ++i)
		{
			var overlay = options.overlays[i];
			var elFrame = $("<label class='ibx-label-overlay-frame'>").addClass(overlay.position)
			this._glyph.append(elFrame);
			
			var elOverlay = $("<span class='ibx-label-overlay'>").addClass(overlay.glyphClasses).text(overlay.glyph);
			elFrame.append(elOverlay);
		}


		//save the current option values...this is to optimize the next refresh
		this._lastOptions = $.extend({}, options);
	}
});
$.ibi.ibxLabel.statics = 
{
}
//# sourceURL=label.ibx.js
