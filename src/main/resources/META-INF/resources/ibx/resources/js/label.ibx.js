/*Copyright (c) 1996-2021 TIBCO Software Inc. All Rights Reserved.*/
// $Revision: 1.65 $:

$.widget("ibi.ibxLabel", $.ibi.ibxFlexBox, 
{
	options:
	{
		"text":"",
		"textWrap":false,
		"textAlign":"",
		"textIsHtml":false,
		"textElClass":"ibx-label-text",
		"customLabel":null,
		"iconPosition":"left",
		"icon":"",
		"iconClasses":"ibx-label-icon",
		"glyph":"",
		"glyphClasses":"",
		"glyphElClass":"ibx-label-glyph",
		"glyphElSpacerClass":"ibx-glyph-spacer",

		"for":null, //make labels work like <label>...focus target on click.

		/*label overlays...array of objects: {"position":"xx", offsetX:"xxpx", offsetY:"yypx", "glyph":"xx", "glyphClasses":"xx", "icon":"xx", "iconClasses":"xx"}*/
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
		options.customLabel = this.element.children('.custom-label').detach();

		//add the sub-elements
		this._glyph = $("<div>").ibxAddClass(options.glyphElClass);
		this._text = $("<div>").ibxAddClass(options.textElClass);
		this.element.append(this._glyph, this._text);
	},
	_setAccessibility:function(accessible, aria)
	{
		var options = this.options;
		aria = this._super(accessible, aria);
		accessible ? this._glyph.attr("aria-hidden", true) : this._glyph.removeAttr("aria-hidden");
		if(options.for)
		{
			var target = $(options.for);
			var id = this.element.prop("id");
			accessible ? target.attr("aria-labelledby", id) : target.removeAttr("aria-labelledby", id);
		}
		return aria;
	},
	_destroy:function()
	{
		this._super();
		this._glyph.remove();
		this._text.remove();
		this.element.ibxRemoveClass("icon-left icon-top icon-right icon-bottom");
	},
	isEditing:function()
	{
		return this._text.is(".ibx-content-editing");
	},
	startEditing:function(editOptions)
	{
		this._text.ibxEditable().ibxEditable("startEditing", editOptions);
	},
	stopEditing:function(revertToOriginal)
	{
		if(this._text.is(".ibx-editable"))
			this._text.ibxEditable("stopEditing", revertToOriginal);

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
	_refresh:function()
	{
		var options = this.options;
		var lastOptions = this._lastOptions || {};

		var glyphVisible = options.glyph || options.glyphClasses;

		//only update if changed
		if(options.icon != lastOptions.icon)
			this._glyph.ibxRemoveClass(lastOptions.iconClasses).ibxAddClass(options.iconClasses).css("backgroundImage", options.icon ? sformat("url('{1}')", options.icon) : "");

		//only update if changed
		if(options.glyph != lastOptions.glyph || options.glyphClasses != lastOptions.glyphClasses)
			this._glyph.html(options.glyph);	
		this._glyph.ibxRemoveClass(lastOptions.glyphClasses).ibxAddClass(options.glyphClasses).ibxAddClass(options.glyphElClass);
		this._glyph.css("display", (!glyphVisible && !options.icon) ? "none" : "");

		//only update if changed
		if(options.text != lastOptions.text)
			options.textIsHtml ? this._text.html(options.text) : this._text.text(options.text);
		this._text.ibxRemoveClass(lastOptions.textElClass).ibxAddClass(options.textElClass).css({"text-align":options.textAlign, "white-space":options.textWrap ? "" : "nowrap"});

		if(options.customLabel)
			this._text.append(options.customLabel);

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
		this._glyph.ibxToggleClass(this.options.glyphElSpacerClass, !!((options.icon || options.glyph || options.glyphClasses) && options.text));

		//general options maintenance
		this.element.ibxRemoveClass("icon-left icon-top icon-right icon-bottom");
		this.element.ibxAddClass("icon-" + options.iconPosition);
		this.element.ibxToggleClass("ibx-label-no-icon", !glyphVisible && !options.icon).ibxToggleClass("ibx-icon-only", !glyphVisible && !options.text);

		//handle overlays
		this._glyph.children(".ibx-label-overlay-frame").remove();
		for(var i = 0; i < options.overlays.length; ++i)
		{
			var overlay = options.overlays[i];
			var elFrame = $("<label class='ibx-label-overlay-frame'>").ibxAddClass(overlay.position);
			this._glyph.append(elFrame);
			
			var elOverlay = null;
			if(overlay.icon)
				elOverlay = $(sformat("<img class='ibx-label-overlay {1}' src='{2}'/>", overlay.iconClasses || "ibx-overlay-image", overlay.icon));
			else{	
				elOverlay = $("<span class='ibx-label-overlay'>").ibxAddClass(overlay.glyphClasses).text(overlay.glyph);
					this.element.css('overflow', (overlay.offsetX || overlay.offsetY) ? 'visible' : "");
					elOverlay.css({left:overlay.offsetX, top:overlay.offsetY});
			}

			elFrame.append(elOverlay);
		}


		//save the current option values...this is to optimize the next refresh
		this._lastOptions = $.extend({}, options);
		this._super();
	}
});
$.ibi.ibxLabel.statics = 
{
};
//# sourceURL=label.ibx.js

