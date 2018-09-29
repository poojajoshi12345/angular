/*Copyright 1996-2016 Information Builders, Inc. All rights reserved.*/
// $Revision$:

$.widget("ibi.ibxLabel", $.ibi.ibxFlexBox, 
{
	options:
	{
		"text":"",
		"textWrap":false,
		"textAlign":"",
		"textIsHtml":false,
		"textElClass":"ibx-label-text",
		"iconPosition":"left",
		"icon":"",
		"iconClasses":"ibx-label-icon",
		"glyph":"",
		"glyphClasses":"",
		"glyphElClass":"ibx-label-glyph",
		"glyphElSpacerClass":"ibx-glyph-spacer",

		"for":null, //make labels work like <label>...focus target on click.

		/*label overlays...array of objects: {"position":"xx", "glyph":"xx", "glyphClasses":"xx", "icon":"xx", "iconClasses":"xx"}*/
		"overlays":[],

		/*ibxFlexBox default options*/
		"inline":true,
		"wrap":false,
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

		//handle the for option
		this.element.on("focus mousedown", this._onLabelEvent.bind(this));

		//alternate to data-ibxp-text...direct text node children can be used to set the text.
		options.text = options.text || this.element.textNodes().remove().text().replace(/^\s*|\s*$/g, "");

		//add the sub-elements
		this._glyph = $("<div>").addClass(options.glyphElClass);
		this._text = $("<div>").addClass(options.textElClass);
		this.element.append(this._glyph, this._text);
	},
	_setAccessibility:function(accessible, aria)
	{
		aria = this._super(accessible, aria);
		accessible ? this._glyph.attr("aria-hidden", true) : this._glyph.removeAttr("aria-hidden");
		return aria;
	},
	_destroy:function()
	{
		this._super();
		this._glyph.remove();
		this._text.remove();
		this.element.removeClass("icon-left icon-top icon-right icon-bottom")
	},
	_onLabelEvent:function(e)
	{
		var options = this.options;
		if(options.for)
		{
			$(options.for).focus();
			e.preventDefault();
		}
	},
	_setOption:function(key, value)
	{
		this._super(key, value);
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
		this._glyph.css("display", (!glyphVisible && !options.icon) ? "none" : "");

		//only update if changed
		if(options.text != lastOptions.text)
			options.textIsHtml ? this._text.html(options.text) : this._text.text(options.text);
		this._text.removeClass(lastOptions.textElClass).addClass(options.textElClass).css({"text-align":options.textAlign, "white-space":options.textWrap ? "" : "nowrap"});

		//[IBX-131] flexbox align center doesn't work correctly in IE with text wrapping...must be set to stretch and then center text automatically.
		//this causes an inconsistency with other browsers...ie will center text when wrapped other won't.  
		//SO EXPLICITLY TELL USERS TO SPECIFY THE TEXT-ALIGN THEY WANT IF WRAPPING IS ON AND WIDTH IS FIXED.
		if(ibxPlatformCheck.isIE)
		{
			if(options.align == "center" && options.textWrap == true && (options.iconPosition == "top" || options.iconPosition == "bottom"))
				this._text.css("alignSelf", "stretch").css("textAlign", options.textAlign || "center");
			else
				this._text.css("alignSelf", "");
		}

		//add appropriate spacer classes
		this._glyph.toggleClass(this.options.glyphElSpacerClass, !!((options.icon || options.glyph || options.glyphClasses) && options.text));

		//general options maintenance
		this.element.removeClass("icon-left icon-top icon-right icon-bottom")
		this.element.addClass("icon-" + options.iconPosition);
		this.element.toggleClass("ibx-label-no-icon", !glyphVisible && !options.icon).toggleClass("ibx-icon-only", !glyphVisible && !options.text);

		//handle overlays
		this._glyph.children(".ibx-label-overlay-frame").remove();
		for(var i = 0; i < options.overlays.length; ++i)
		{
			var overlay = options.overlays[i];
			var elFrame = $("<label class='ibx-label-overlay-frame'>").addClass(overlay.position)
			this._glyph.append(elFrame);
			
			var elOverlay = null;
			if(overlay.icon)
				elOverlay = $(sformat("<img class='ibx-label-overlay {1}' src='{2}'/>", overlay.iconClasses || "ibx-overlay-image", overlay.icon));
			else	
				elOverlay = $("<span class='ibx-label-overlay'>").addClass(overlay.glyphClasses).text(overlay.glyph);

			elFrame.append(elOverlay);
		}


		//save the current option values...this is to optimize the next refresh
		this._lastOptions = $.extend({}, options);
		this._super();
	}
});
$.ibi.ibxLabel.statics = 
{
}
//# sourceURL=label.ibx.js

